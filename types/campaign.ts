import type { Hotel } from "./hotel";

export type CampaignId = "firstBooking" | "loyalty" | "lastMinute";

export interface Campaign {
  id: CampaignId;
  title: string;
  /** Short label used on badges, e.g. «تخفیف اولین رزرو». */
  shortLabel: string;
  /** Badge text shown on discounted hotel cards. */
  badgeText: string;
  description: string;
  /** Percentage discount applied to eligible hotels, 0–100. */
  discountPercent: number;
  /** Explicit eligibility list — a hotel belongs to a campaign only if its id is here. */
  hotelIds: string[];
  terms: string[];
  /**
   * ISO-8601 timestamp of when the campaign stops being valid.
   * Only set for time-bound campaigns (last minute deals).
   * The frontend shows an expired state once this passes; it never
   * silently generates a new expiration.
   */
  expiresAt?: string;
}

/** A hotel presented inside a campaign, with pricing resolved. */
export interface DiscountedHotel extends Hotel {
  campaignId: CampaignId;
  originalPricePerNight: number;
  finalPricePerNight: number;
  discountPercent: number;
}
