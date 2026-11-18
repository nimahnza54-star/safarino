/**
 * End-to-end verification for the /hotel-booking page (and its neighbors).
 * Runs against a production build served on BASE_URL (default 127.0.0.1:3210).
 *
 * Usage: node scripts/verify-hotel-booking.mjs
 */
import { chromium } from "playwright";

const BASE_URL = process.env.BASE_URL ?? "http://127.0.0.1:3210";

let passed = 0;
let failed = 0;
const failures = [];

function check(name, condition, detail = "") {
  const ok = Boolean(condition);
  console.log(`${ok ? "PASS" : "FAIL"} | ${name}${detail ? ` — ${detail}` : ""}`);
  if (ok) passed += 1;
  else {
    failed += 1;
    failures.push(name);
  }
}

const browser = await chromium.launch();
const context = await browser.newContext({
  locale: "fa-IR",
  timezoneId: "Asia/Tehran",
});
const page = await context.newPage();

const consoleErrors = [];
const pageErrors = [];
const failedRequests = [];
page.on("console", (msg) => {
  if (msg.type() === "error") consoleErrors.push(msg.text());
});
page.on("pageerror", (err) => pageErrors.push(err.message));
page.on("response", (res) => {
  if (res.status() >= 400) failedRequests.push(`${res.status()} ${res.url()}`);
});

await page.goto(`${BASE_URL}/hotel-booking`, { waitUntil: "domcontentloaded" });
await page.waitForTimeout(2500); // hydration + initial data fetch

/* ---------------- 1. Load & console health ---------------- */
console.log("\n=== 1. Page load ===");
check("page title contains سفرینو or هتل", /هتل|سفرینو/.test(await page.title()), await page.title());
check("no page errors on load", pageErrors.length === 0, pageErrors.join(" | "));
check(
  "no console errors on load",
  consoleErrors.length === 0,
  consoleErrors.join(" | ").slice(0, 400)
);

/* ---------------- 2. Broken images ---------------- */
console.log("\n=== 2. Images ===");
const brokenImages = await page.evaluate(() =>
  Array.from(document.images)
    .filter((img) => img.complete && img.naturalWidth === 0)
    .map((img) => img.currentSrc || img.src)
);
check("no broken <img> elements", brokenImages.length === 0, brokenImages.join(" | "));

/* ---------------- 3. Featured hotels & favorites ---------------- */
console.log("\n=== 3. Favorites (برترین هتل‌ها) ===");
const bestSection = page.locator("section", { has: page.getByRole("heading", { name: "برترین هتل‌ها" }) });
const bestCards = bestSection.locator("article");
check("best hotels renders 4 cards", (await bestCards.count()) === 4, `${await bestCards.count()} cards`);

const heartButtons = bestSection.getByRole("button", { name: /علاقه‌مندی/ });
check("best hotels has favorite buttons", (await heartButtons.count()) >= 4);
await heartButtons.first().click();
await page.waitForTimeout(300);
check(
  "favorite toggles aria-pressed=true",
  (await heartButtons.first().getAttribute("aria-pressed")) === "true"
);
const storedFavorites = await page.evaluate(() =>
  JSON.parse(window.localStorage.getItem("safarino:favorites") ?? "[]")
);
check(
  "favorite persisted to localStorage",
  Array.isArray(storedFavorites) && storedFavorites.length === 1,
  JSON.stringify(storedFavorites)
);
await page.reload({ waitUntil: "domcontentloaded" });
await page.waitForTimeout(2500);
const heartAfterReload = page
  .locator("section", { has: page.getByRole("heading", { name: "برترین هتل‌ها" }) })
  .getByRole("button", { name: /به علاقه‌مندی‌ها افزوده شود|از علاقه‌مندی‌ها حذف شود/ })
  .first();
check(
  "favorite survives reload",
  (await heartAfterReload.getAttribute("aria-pressed")) === "true"
);
await heartAfterReload.click(); // remove again
await page.waitForTimeout(300);

/* ---------------- 3.5 Hotel detail modal ---------------- */
console.log("\n=== 3.5 Hotel detail ===");
await bestSection.getByRole("button", { name: "جزئیات" }).first().click();
await page.waitForTimeout(300);
const detailDialog = page.getByRole("dialog");
check("hotel detail modal opens", (await detailDialog.count()) === 1);
check(
  "hotel detail shows location & amenities",
  (await detailDialog.getByText(/ظرفیت تا/).count()) >= 1
);
await page.keyboard.press("Escape");
await page.waitForTimeout(200);
check("hotel detail closes with Escape", (await detailDialog.count()) === 0);

/* ---------------- 4. City category filtering ---------------- */
console.log("\n=== 4. City categories ===");
const cityRegion = page.getByRole("region", { name: "هتل‌ها بر اساس شهر" });
const cityButton = (label) =>
  cityRegion.getByRole("button", { name: label, exact: true });

await cityButton("هتل‌های مشهد").click();
await page.waitForTimeout(800);
check(
  "Mashhad filter shows 2 hotels",
  (await page.locator("article[data-testid^='hotel-card-']").count()) >= 0 &&
    (await page.getByText("۲ هتل یافت شد").count()) === 1,
  "count label"
);

await cityButton("همه هتل‌ها").click();
await page.waitForTimeout(800);
check(
  "همه هتل‌ها shows 16 hotels",
  (await page.getByText("۱۶ هتل یافت شد").count()) === 1
);

await cityButton("هتل‌های کیش").click();
await page.waitForTimeout(800);
check(
  "Kish filter shows 2 hotels",
  (await page.getByText("۲ هتل یافت شد").count()) === 1
);

/* Favorites filter */
const favToggle = cityRegion.getByRole("button", { name: /علاقه‌مندی‌های من/ });
await page.locator("section", { has: page.getByRole("heading", { name: "برترین هتل‌ها" }) })
  .getByRole("button", { name: /به علاقه‌مندی‌ها افزوده شود/ })
  .first()
  .click();
await page.waitForTimeout(300);
await favToggle.click();
await page.waitForTimeout(500);
check(
  "favorites filter shows saved hotel(s)",
  (await page.getByText("در علاقه‌مندی‌های شما").count()) === 1
);
await favToggle.click(); // back to all
await page.waitForTimeout(500);
// remove the favorite we just added
await page.locator("section", { has: page.getByRole("heading", { name: "برترین هتل‌ها" }) })
  .getByRole("button", { name: /از علاقه‌مندی‌ها حذف شود/ })
  .first()
  .click();

/* ---------------- 5. Search with validation ---------------- */
console.log("\n=== 5. Search ===");
const searchButton = page.getByRole("button", { name: "جستجو" });
await searchButton.click();
await page.waitForTimeout(1200);
const resultsHeading = page.getByRole("heading", { name: /نتیجه جستجو برای/ });
check("search results panel appears", (await resultsHeading.count()) === 1);
check(
  "Tehran default search finds 2 hotels",
  (await page.getByText("۲ هتل مطابق معیار شما یافت شد").count()) === 1
);

await page.getByRole("button", { name: "پاک‌کردن فیلترها" }).click();
await page.waitForTimeout(400);
check(
  "clearing search hides the results panel",
  (await resultsHeading.count()) === 0
);

/* Capacity-driven empty state: 10 adults in 1 room */
await page.getByText("تعداد مسافران").click();
await page.waitForTimeout(300);
const addAdult = page.getByRole("button", { name: "افزودن بزرگسال" });
for (let i = 0; i < 8; i++) await addAdult.click();
await page.keyboard.press("Escape");
await page.mouse.click(20, 20); // click away to close dropdown
await searchButton.click();
await page.waitForTimeout(1200);
check(
  "oversized party yields the empty state",
  (await page.getByText("هتلی با این مشخصات یافت نشد").count()) >= 1
);
await page.getByRole("button", { name: "پاک‌کردن فیلترها" }).click();
await page.waitForTimeout(400);
await searchButton.click();
await page.waitForTimeout(1200);
check(
  "search works again after reset",
  (await page.getByText("۲ هتل مطابق معیار شما یافت شد").count()) === 1
);

/* ---------------- 6. Feature & travel-card modals ---------------- */
console.log("\n=== 6. Modals ===");
const featureButtons = page.getByRole("button", { name: "اطلاعات بیشتر" });
const featureButtonCount = await featureButtons.count();
check("features CTA buttons render (4 features + 3 travel cards)", featureButtonCount === 7, `${featureButtonCount}`);

await featureButtons.first().click();
await page.waitForTimeout(300);
const featureDialog = page.getByRole("dialog");
check("feature modal opens", (await featureDialog.count()) === 1);
check(
  "feature modal has the automation title",
  (await featureDialog.getByText("اتوماسیون تخصصی سفرینو").count()) >= 1
);
await page.keyboard.press("Escape");
await page.waitForTimeout(200);
check("Escape closes the feature modal", (await featureDialog.count()) === 0);

/* Travel card: its own product info, not a generic message */
const employeeCardButton = page
  .getByRole("button", { name: "اطلاعات بیشتر" })
  .nth(4);
await employeeCardButton.click();
await page.waitForTimeout(300);
check(
  "travel card modal shows بن کارت سفر کارکنان content",
  (await page.getByRole("dialog").getByText("بن کارت سفر کارکنان").count()) >= 1
);
await page.keyboard.press("Escape");

/* ---------------- 7. App download modal & QR unavailable state ---------------- */
console.log("\n=== 7. App download ===");
await page.getByRole("button", { name: /مشاهده لینک‌های دانلود/ }).click();
await page.waitForTimeout(300);
const downloadDialog = page.getByRole("dialog");
check("download modal opens", (await downloadDialog.count()) === 1);
check(
  "download modal shows both stores as به‌زودی",
  (await downloadDialog.getByText("به‌زودی").count()) >= 2
);
await page.keyboard.press("Escape");
check(
  "QR area shows unavailable state",
  (await page.getByRole("img", { name: "QR کد دانلود فعلاً در دسترس نیست" }).count()) === 1
);

/* ---------------- 8. Campaign sections & countdown ---------------- */
console.log("\n=== 8. Campaigns ===");
const firstBookingSection = page.locator("section", {
  has: page.getByRole("heading", { name: /تخفیف اولین رزرو/ }),
});
check(
  "firstBooking renders 4 preview cards",
  (await firstBookingSection.locator("article").count()) === 4
);
await firstBookingSection.getByRole("button", { name: "همه هتل‌ها" }).click();
await page.waitForTimeout(300);
check(
  "firstBooking «همه هتل‌ها» expands to 6 campaign hotels",
  (await firstBookingSection.locator("article").count()) === 6
);

const loyaltySection = page.locator("section", {
  has: page.getByRole("heading", { name: /تخفیف وفاداری/ }),
});
check(
  "loyalty renders 4 preview cards",
  (await loyaltySection.locator("article").count()) === 4
);

const lastMinuteSection = page.locator("section", {
  has: page.getByRole("heading", { name: /لحظه آخری/ }),
});
const timer = lastMinuteSection.getByRole("timer");
check("lastMinute countdown is rendered", (await timer.count()) === 1);
const t1 = await timer.textContent();
await page.waitForTimeout(2100);
const t2 = await timer.textContent();
check("countdown ticks", t1 !== t2, `${t1} → ${t2}`);

/* Discount pricing sanity: original price struck through somewhere */
check(
  "discount badges render (percent sign)",
  (await page.getByText("۱۵٪").count()) >= 1
);

/* ---------------- 9. Footer ---------------- */
console.log("\n=== 9. Footer ===");
check(
  "tel: link present",
  (await page.locator('a[href="tel:02188880000"]').count()) >= 1
);
check(
  "accommodation route link present",
  (await page.locator('a[href="/accommodation-booking"]').count()) >= 1
);
check(
  "blog anchor link present",
  (await page.locator('a[href="#blog"]').count()) >= 1
);
check(
  "no dead href=\"#\" links remain",
  (await page.locator('a[href="#"]').count()) === 0
);

await page.getByRole("button", { name: "تماس با ما" }).last().click();
await page.waitForTimeout(300);
const contactDialog = page.getByRole("dialog");
check("contact modal opens from footer", (await contactDialog.count()) === 1);
check(
  "contact modal includes phone CTA",
  (await contactDialog.locator('a[href="tel:02188880000"]').count()) >= 1
);
await page.keyboard.press("Escape");

/* FAQ accordion */
await page.locator("#faq").scrollIntoViewIfNeeded();
const faqButton = page.getByRole("button", { name: /چطور بهترین هتل/ });
const before = await faqButton.getAttribute("aria-expanded");
await faqButton.click();
const after = await faqButton.getAttribute("aria-expanded");
check("FAQ accordion toggles aria-expanded", before === "false" && after === "true", `${before} → ${after}`);

/* ---------------- 10. Neighbor page & failed requests ---------------- */
console.log("\n=== 10. Neighbors & network ===");
await page.goto(`${BASE_URL}/accommodation-booking`, { waitUntil: "domcontentloaded" });
await page.waitForTimeout(2000);
check(
  "accommodation-booking renders",
  (await page.getByText(/ویلا|اقامتگاه/).count()) >= 1
);
check(
  "no HTTP >= 400 responses on accommodation-booking",
  failedRequests.length === 0,
  failedRequests.join(" | ").slice(0, 400)
);

/* ---------------- Summary ---------------- */
console.log(`\n========================================`);
console.log(`RESULT: ${passed} passed, ${failed} failed`);
if (failed > 0) {
  console.log("Failures:", failures.join("; "));
  process.exitCode = 1;
}
await browser.close();
