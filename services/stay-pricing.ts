/**
 * Pure stay-pricing business logic — no I/O, no mock imports, no component
 * dependencies. Reusable by cards, detail views, campaign sections and the
 * booking flow. Unit-tested via tests/stay-pricing.test.mjs.
 */

import { computeFinalPrice } from "./hotel-math";

export interface StayPriceInput {
  /** Nightly rate in toman (mock/illustrative until backend pricing is connected). */
  pricePerNight: number;
  /** Number of nights; fractional/negative input is floored and clamped at 0. */
  nights: number;
  /** Optional campaign discount, 0–100. */
  discountPercent?: number;
}

export interface StayPriceBreakdown {
  nights: number;
  /** Nightly rate after discount (what the guest pays per night). */
  nightlyRate: number;
  /** pricePerNight × nights before discount. */
  baseTotal: number;
  discountPercent: number;
  discountAmount: number;
  /** Final estimated total in toman. */
  total: number;
}

export function estimateStayPrice({
  pricePerNight,
  nights,
  discountPercent = 0,
}: StayPriceInput): StayPriceBreakdown {
  const safeNights = Number.isFinite(nights)
    ? Math.max(0, Math.floor(nights))
    : 0;
  const safePrice =
    Number.isFinite(pricePerNight) && pricePerNight > 0 ? pricePerNight : 0;
  const safeDiscount = Math.min(100, Math.max(0, discountPercent));

  const nightlyRate = computeFinalPrice(safePrice, safeDiscount);
  const baseTotal = safePrice * safeNights;
  const total = nightlyRate * safeNights;

  return {
    nights: safeNights,
    nightlyRate,
    baseTotal,
    discountPercent: safeDiscount,
    discountAmount: baseTotal - total,
    total,
  };
}
