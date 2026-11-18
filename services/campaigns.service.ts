import { CAMPAIGNS } from "@/mock/campaigns/campaigns.mock";
import { HOTELS } from "@/mock/hotels/hotels.mock";
import {
  computeFinalPrice,
  isCampaignExpired,
  getCampaignRemainingMs,
} from "@/services/hotel-math";
import type {
  Campaign,
  CampaignId,
  DiscountedHotel,
} from "@/types/campaign";

/**
 * Campaign service — resolves campaign membership and pricing.
 *
 * Campaign eligibility is expressed purely as lists of hotel ids in the
 * mock configuration (`mock/campaigns`), so introducing a new campaign
 * or editing membership never touches UI code. Discount math is the
 * single source of truth used by every section.
 */
export { computeFinalPrice, isCampaignExpired, getCampaignRemainingMs };

const NETWORK_DELAY_MS = 250;
const delay = () =>
  new Promise<void>((resolve) => setTimeout(resolve, NETWORK_DELAY_MS));

export async function getCampaigns(): Promise<Campaign[]> {
  await delay();
  return [...CAMPAIGNS];
}

export async function getCampaignById(
  id: CampaignId
): Promise<Campaign | undefined> {
  await delay();
  return CAMPAIGNS.find((c) => c.id === id);
}

/**
 * Returns the hotels eligible for a campaign with resolved pricing.
 * Membership order follows the campaign's configured hotelIds list.
 */
export async function getCampaignHotels(
  id: CampaignId
): Promise<DiscountedHotel[]> {
  await delay();
  const campaign = CAMPAIGNS.find((c) => c.id === id);
  if (!campaign) return [];

  return campaign.hotelIds
    .map((hotelId) => HOTELS.find((h) => h.id === hotelId))
    .filter((hotel): hotel is NonNullable<typeof hotel> => hotel !== undefined)
    .map((hotel) => ({
      ...hotel,
      campaignId: campaign.id,
      originalPricePerNight: hotel.pricePerNight,
      finalPricePerNight: computeFinalPrice(
        hotel.pricePerNight,
        campaign.discountPercent
      ),
      discountPercent: campaign.discountPercent,
    }));
}
