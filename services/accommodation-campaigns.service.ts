import { ACCOMMODATION_CAMPAIGNS } from "@/mock/campaigns/accommodation-campaigns.mock";
import { ACCOMMODATIONS } from "@/mock/accommodations/accommodations.mock";
import {
  computeFinalPrice,
  isCampaignExpired,
  getCampaignRemainingMs,
} from "@/services/hotel-math";
import type {
  AccommodationCampaign,
  AccommodationCampaignId,
  DiscountedAccommodation,
} from "@/types/accommodation-campaign";

/**
 * Accommodation campaign service — resolves campaign membership and
 * pricing from mock configuration. Eligibility is expressed only as
 * accommodation id lists in mock/campaigns/accommodation-campaigns.mock.ts.
 */
export { computeFinalPrice, isCampaignExpired, getCampaignRemainingMs };

const NETWORK_DELAY_MS = 250;
const delay = () =>
  new Promise<void>((resolve) => setTimeout(resolve, NETWORK_DELAY_MS));

export async function getAccommodationCampaigns(): Promise<AccommodationCampaign[]> {
  await delay();
  return [...ACCOMMODATION_CAMPAIGNS];
}

export async function getAccommodationCampaignById(
  id: AccommodationCampaignId
): Promise<AccommodationCampaign | undefined> {
  await delay();
  return ACCOMMODATION_CAMPAIGNS.find((c) => c.id === id);
}

/**
 * Returns the accommodations eligible for a campaign with resolved
 * pricing. Membership order follows the campaign's configured id list.
 */
export async function getCampaignAccommodations(
  id: AccommodationCampaignId
): Promise<DiscountedAccommodation[]> {
  await delay();
  const campaign = ACCOMMODATION_CAMPAIGNS.find((c) => c.id === id);
  if (!campaign) return [];

  return campaign.accommodationIds
    .map((accId) => ACCOMMODATIONS.find((item) => item.id === accId))
    .filter((item): item is NonNullable<typeof item> => item !== undefined)
    .map((item) => ({
      ...item,
      campaignId: campaign.id,
      originalPricePerNight: item.pricePerNight,
      finalPricePerNight: computeFinalPrice(
        item.pricePerNight,
        campaign.discountPercent
      ),
      discountPercent: campaign.discountPercent,
    }));
}
