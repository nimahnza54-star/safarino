import { HOTELS } from "@/mock/hotels/hotels.mock";
import {
  matchesDestination,
  fitsCapacity,
  normalizeFa,
} from "@/services/hotel-math";
import type { Hotel, HotelCity } from "@/types/hotel";
import type { SearchCriteria } from "@/types/search";

/**
 * Hotel service — frontend data-access layer for hotels.
 *
 * Currently backed by the central mock dataset with an artificial
 * latency so loading states behave like a real backend. To connect a
 * real API later, replace the internals of these functions with
 * `fetch()` calls; UI components only depend on this module's types
 * and function signatures, not on mock file structure.
 */
export { matchesDestination, fitsCapacity, normalizeFa };
export { computeFinalPrice, isCampaignExpired, getCampaignRemainingMs } from "@/services/hotel-math";

const NETWORK_DELAY_MS = 250;
const delay = () =>
  new Promise<void>((resolve) => setTimeout(resolve, NETWORK_DELAY_MS));

export async function getHotels(): Promise<Hotel[]> {
  await delay();
  return [...HOTELS];
}

export async function getHotelsByCity(
  city: HotelCity | "all"
): Promise<Hotel[]> {
  await delay();
  if (city === "all") return [...HOTELS];
  return HOTELS.filter((h) => h.city === city);
}

export async function searchHotels(
  criteria: SearchCriteria
): Promise<Hotel[]> {
  await delay();
  return HOTELS.filter(
    (hotel) =>
      matchesDestination(hotel, criteria.destination) &&
      fitsCapacity(hotel, criteria)
  );
}

export function sortByRating(hotels: Hotel[]): Hotel[] {
  return [...hotels].sort(
    (a, b) => b.rating - a.rating || b.reviewCount - a.reviewCount
  );
}

/** Featured («برترین هتل‌ها»): highest rated first. */
export async function getFeaturedHotels(limit = 4): Promise<Hotel[]> {
  await delay();
  return sortByRating(HOTELS).slice(0, limit);
}
