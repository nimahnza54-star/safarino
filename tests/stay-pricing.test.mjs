import test from "node:test";
import assert from "node:assert/strict";
import { estimateStayPrice } from "../.test-build/services/stay-pricing.js";

test("estimateStayPrice: basic multiplication", () => {
  const r = estimateStayPrice({ pricePerNight: 1_000_000, nights: 3 });
  assert.equal(r.nightlyRate, 1_000_000);
  assert.equal(r.baseTotal, 3_000_000);
  assert.equal(r.discountAmount, 0);
  assert.equal(r.total, 3_000_000);
  assert.equal(r.nights, 3);
});

test("estimateStayPrice: applies percentage discount per night", () => {
  const r = estimateStayPrice({ pricePerNight: 1_000_000, nights: 2, discountPercent: 15 });
  assert.equal(r.nightlyRate, 850_000); // computeFinalPrice(1_000_000, 15)
  assert.equal(r.baseTotal, 2_000_000);
  assert.equal(r.total, 1_700_000);
  assert.equal(r.discountAmount, 300_000);
  assert.equal(r.discountPercent, 15);
});

test("estimateStayPrice: 30% last-minute discount", () => {
  const r = estimateStayPrice({ pricePerNight: 4_500_000, nights: 1, discountPercent: 30 });
  assert.equal(r.nightlyRate, 3_150_000);
  assert.equal(r.total, 3_150_000);
});

test("estimateStayPrice: clamps discount to [0, 100]", () => {
  assert.equal(estimateStayPrice({ pricePerNight: 1000, nights: 1, discountPercent: -5 }).nightlyRate, 1000);
  assert.equal(estimateStayPrice({ pricePerNight: 1000, nights: 1, discountPercent: 150 }).nightlyRate, 0);
});

test("estimateStayPrice: zero and invalid nights yield total 0", () => {
  assert.equal(estimateStayPrice({ pricePerNight: 1000, nights: 0 }).total, 0);
  assert.equal(estimateStayPrice({ pricePerNight: 1000, nights: -3 }).total, 0);
  assert.equal(estimateStayPrice({ pricePerNight: 1000, nights: Number.NaN }).total, 0);
});

test("estimateStayPrice: fractional nights are floored", () => {
  assert.equal(estimateStayPrice({ pricePerNight: 1000, nights: 2.9 }).nights, 2);
});

test("estimateStayPrice: invalid price treated as 0", () => {
  assert.equal(estimateStayPrice({ pricePerNight: Number.NaN, nights: 2 }).total, 0);
  assert.equal(estimateStayPrice({ pricePerNight: -500, nights: 2 }).total, 0);
});
