import { ACCOMMODATIONS } from "@/mock/accommodations/accommodations.mock";
import {
  matchesAccommodation,
  fitsCapacity,
  normalizeFa,
} from "@/services/accommodation-math";
import {
  filterAccommodations,
  sortAccommodations,
  DEFAULT_ACCOMMODATION_FILTERS,
} from "@/services/accommodation-math";
import type {
  Accommodation,
  AccommodationCity,
  AccommodationFilters,
  AccommodationSort,
} from "@/types/accommodation";
import type { SearchCriteria } from "@/types/search";

/**
 * Accommodation service — frontend data-access layer for villas and
 * accommodations. Currently backed by the central mock dataset with an
 * artificial latency so loading states behave like a real backend.
 * To connect a real API later, replace the internals of these functions
 * with `fetch()` calls; UI components only depend on this module's
 * types and signatures, not on mock file structure.
 *
 * Note: the mock dataset carries no availability calendar — a search
 * match means «matches the criteria», NOT «is confirmed bookable».
 */
export {
  matchesAccommodation,
  fitsCapacity,
  filterAccommodations,
  sortAccommodations,
  DEFAULT_ACCOMMODATION_FILTERS,
  normalizeFa,
};
export {
  computeStayBreakdown,
  numberOfNights,
  validateBookingInput,
  isValidIranianMobile,
} from "@/services/accommodation-math";

export type { AccommodationSort } from "@/types/accommodation";

const NETWORK_DELAY_MS = 250;
const delay = () =>
  new Promise<void>((resolve) => setTimeout(resolve, NETWORK_DELAY_MS));

export async function getAccommodations(): Promise<Accommodation[]> {
  await delay();
  return [...ACCOMMODATIONS];
}

export async function getAccommodationById(
  id: string
): Promise<Accommodation | undefined> {
  await delay();
  return ACCOMMODATIONS.find((item) => item.id === id);
}

export async function getAccommodationsByCity(
  city: AccommodationCity | "all"
): Promise<Accommodation[]> {
  await delay();
  if (city === "all") return [...ACCOMMODATIONS];
  return ACCOMMODATIONS.filter((item) => item.city === city);
}

/** Search accommodations by destination text + party size. */
export async function searchAccommodations(
  criteria: SearchCriteria
): Promise<Accommodation[]> {
  await delay();
  return ACCOMMODATIONS.filter(
    (item) =>
      matchesAccommodation(item, criteria.destination) &&
      fitsCapacity(item, criteria)
  );
}

/** Apply structured filters + sort (pure, no I/O). */
export function applyAccommodationView(
  list: Accommodation[],
  filters: AccommodationFilters,
  sort: AccommodationSort
): Accommodation[] {
  return sortAccommodations(filterAccommodations(list, filters), sort);
}

/** Featured pick — highest rated first. */
export function sortByRating(accommodations: Accommodation[]): Accommodation[] {
  return [...accommodations].sort(
    (a, b) => b.rating - a.rating || b.reviewCount - a.reviewCount
  );
}

export async function getFeaturedAccommodations(
  limit = 4
): Promise<Accommodation[]> {
  await delay();
  return sortByRating(ACCOMMODATIONS).slice(0, limit);
}
