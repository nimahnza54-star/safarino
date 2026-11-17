import { chromium } from "playwright";

const results = [];

function check(name, condition, detail = "") {
  results.push({ name, pass: condition, detail });
  console.log(`${condition ? "PASS" : "FAIL"} | ${name} ${detail ? `— ${detail}` : ""}`);
}

async function testPage(page, pageName) {
  console.log(`\n=== Testing ${pageName} ===`);

  // Capture browser console
  page.on('console', msg => console.log(`[Browser] ${msg.type()}: ${msg.text()}`));
  page.on('pageerror', err => console.log(`[Browser Error]: ${err.message}`));

  // 1. Page loads and "بیشتر" exists
  await page.goto(`http://127.0.0.1:3000/${pageName}`, {
    waitUntil: "domcontentloaded",
  });
  await page.waitForTimeout(2000); // let React hydrate

  const trigger = page.getByText("بیشتر", { exact: true });
  check(`${pageName}: "بیشتر" trigger exists`, (await trigger.count()) > 0);

  // Find the button containing "بیشتر"
  const triggerLocator = page.locator("button:has-text('بیشتر')");
  check(`${pageName}: "بیشتر" button exists`, (await triggerLocator.count()) > 0);

  // Closed state: ChevronDown icon present next to "بیشتر"
  const chevronInsideTrigger = triggerLocator.locator("svg").first();
  check(`${pageName}: ChevronDown icon present next to "بیشتر"`, (await chevronInsideTrigger.count()) > 0);

  // Arrow points down when closed (no rotate-180 class)
  const chevronClasses = await chevronInsideTrigger.getAttribute("class");
  check(`${pageName}: Arrow points down when closed (no rotate-180)`, !chevronClasses.includes("rotate-180"), `classes: ${chevronClasses}`);

  // 2. Hover to open dropdown - use mouse.move for more reliable hover
  const triggerBox = await triggerLocator.boundingBox();
  if (!triggerBox) throw new Error("Trigger not found");
  await page.mouse.move(triggerBox.x + triggerBox.width / 2, triggerBox.y + triggerBox.height / 2);
  await page.waitForTimeout(500);

  // Check dropdown CONTAINER visibility (not just text presence)
  const dropdownContainer = page.locator("#more-dropdown");
  const isDropdownVisible = await dropdownContainer.evaluate(el => {
    const style = window.getComputedStyle(el);
    return style.visibility !== 'hidden' && style.opacity !== '0';
  });
  check(`${pageName}: Dropdown container is visible on hover`, isDropdownVisible);

  // 3. Verify all three options are VISIBLE
  const dropdownItems = dropdownContainer.locator("a");
  const itemCount = await dropdownItems.count();
  check(`${pageName}: Dropdown has 3 items`, itemCount === 3);

  const itemTexts = [];
  for (let i = 0; i < itemCount; i++) {
    const text = await dropdownItems.nth(i).textContent();
    itemTexts.push(text?.trim());
  }
  check(`${pageName}: Item 1 = "بیمه مسافرتی"`, itemTexts[0] === "بیمه مسافرتی");
  check(`${pageName}: Item 2 = "استخدام سفرینو"`, itemTexts[1] === "استخدام سفرینو");
  check(`${pageName}: Item 3 = "درباره ما"`, itemTexts[2] === "درباره ما");

  // 4. Arrow rotates upward when open
  const chevronClassesOpen = await chevronInsideTrigger.getAttribute("class");
  check(`${pageName}: Arrow rotates up when open (has rotate-180)`, chevronClassesOpen.includes("rotate-180"), `classes: ${chevronClassesOpen}`);

  // 5. Move mouse from trigger into dropdown - stays open
  const dropdownBox = await dropdownContainer.boundingBox();
  if (dropdownBox) {
    await page.mouse.move(dropdownBox.x + dropdownBox.width / 2, dropdownBox.y + 20);
    await page.waitForTimeout(500);
    
    const stillVisible = await dropdownContainer.evaluate(el => {
      const style = window.getComputedStyle(el);
      return style.visibility !== 'hidden' && style.opacity !== '0';
    });
    check(`${pageName}: Dropdown stays open when mouse moves into menu`, stillVisible);
  } else {
    check(`${pageName}: Dropdown stays open when mouse moves into menu`, false, "dropdown box not found");
  }

  // 6. Move outside - closes
  await page.mouse.move(100, 100);
  await page.waitForTimeout(500);
  const closedVisible = await dropdownContainer.evaluate(el => {
    const style = window.getComputedStyle(el);
    return style.visibility !== 'hidden' && style.opacity !== '0';
  });
  check(`${pageName}: Dropdown closes when moving outside`, !closedVisible);

  // 7. Click-to-toggle
  await triggerLocator.click();
  await page.waitForTimeout(500);
  const clickOpenVisible = await dropdownContainer.evaluate(el => {
    const style = window.getComputedStyle(el);
    return style.visibility !== 'hidden' && style.opacity !== '0';
  });
  check(`${pageName}: Dropdown opens on click`, clickOpenVisible);
  
  await triggerLocator.click();
  await page.waitForTimeout(500);
  const clickCloseVisible = await dropdownContainer.evaluate(el => {
    const style = window.getComputedStyle(el);
    return style.visibility !== 'hidden' && style.opacity !== '0';
  });
  check(`${pageName}: Dropdown closes on second click`, !clickCloseVisible);

  // 8. Escape key
  await triggerLocator.click();
  await page.waitForTimeout(500);
  await page.keyboard.press("Escape");
  await page.waitForTimeout(500);
  const escapeVisible = await dropdownContainer.evaluate(el => {
    const style = window.getComputedStyle(el);
    return style.visibility !== 'hidden' && style.opacity !== '0';
  });
  check(`${pageName}: Dropdown closes on Escape`, !escapeVisible);
}

async function main() {
  const browser = await chromium.launch({ headless: false, slowMo: 500 });
  const page = await browser.newPage();
  await page.setViewportSize({ width: 1400, height: 900 });

  try {
    await testPage(page, "hotel-booking");
    await testPage(page, "accommodation-booking");
  } catch (e) {
    console.error("Test error:", e.message);
  } finally {
    await browser.close();
  }

  console.log("\n=== SUMMARY ===");
  const passed = results.filter(r => r.pass).length;
  const failed = results.filter(r => !r.pass).length;
  console.log(`Passed: ${passed}, Failed: ${failed}`);
  results.forEach(r => {
    if (!r.pass) console.log(`  FAILED: ${r.name} ${r.detail ? `— ${r.detail}` : ""}`);
  });
  process.exit(failed > 0 ? 1 : 0);
}

main();