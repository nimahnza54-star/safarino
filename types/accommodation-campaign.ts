import type { Accommodation } from "./accommodation";

export type AccommodationCampaignId = "firstBooking" | "loyalty" | "lastMinute";

export interface AccommodationCampaign {
  id: AccommodationCampaignId;
  title: string;
  /** Short label used on badges, e.g. «تخفیف اولین رزرو». */
  shortLabel: string;
  /** Badge text shown on discounted accommodation cards. */
  badgeText: string;
  description: string;
  /** Percentage discount applied to eligible accommodations, 0–100. */
  discountPercent: number;
  /** Explicit eligibility list — an accommodation belongs to a campaign only if its id is here. */
  accommodationIds: string[];
  terms: string[];
  /**
   * ISO-8601 timestamp after which the campaign is no longer valid.
   * Only set for time-bound campaigns (last minute). Once it passes the
   * UI shows an expired state; the frontend never silently generates a
   * new expiration.
   */
  expiresAt?: string;
}

/** An accommodation presented inside a campaign, with pricing resolved. */
export interface DiscountedAccommodation extends Accommodation {
  campaignId: AccommodationCampaignId;
  originalPricePerNight: number;
  finalPricePerNight: number;
  discountPercent: number;
}
