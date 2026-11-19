/**
 * Core accommodation (villa / suite / eco-lodge / …) domain types.
 * Kept separate from the hotel domain model — accommodations are whole
 * bookable units, hotels are per-room, and the two must not be mixed.
 */
export type AccommodationCity =
  | "mazandaran"
  | "tehran"
  | "gilan"
  | "alborz"
  | "yazd"
  | "isfahan"
  | "shiraz"
  | "mashhad"
  | "kish"
  | "qeshm"
  | "hamedan";

export type AccommodationType =
  | "villa"
  | "suite"
  | "apartment"
  | "boomgardi"
  | "kolbeh"
  | "rustic";

/** Rules attached to a whole property, always in this shape — never ad-hoc strings. */
export interface AccommodationRules {
  /** e.g. «۱۴:۰۰» */
  checkInTime: string;
  /** e.g. «۱۲:۰۰» */
  checkOutTime: string;
  petPolicy: string;
  smokingPolicy: string;
  eventPolicy: string;
  cancellationPolicy: string;
  /** Maximum guests accepted in a single unit. */
  maxGuests: number;
}

export interface Accommodation {
  /** Stable unique id — favorites, campaigns and booking requests reference this. */
  id: string;
  name: string;
  city: AccommodationCity;
  /** Persian display label of the city/region, e.g. «مازندران». */
  cityLabel: string;
  /** Free-form location detail, e.g. «مازندران، نوشهر، جنگلی». */
  location: string;
  type: AccommodationType;
  /** Persian display label of the type, e.g. «ویلا». */
  typeLabel: string;
  /** Short Persian description shown on cards and detail views. */
  description: string;
  /** Local mock illustration path under /public — stylized artwork, not a real photo. */
  image: string;
  /** Average guest rating, 0–5. Mock rating — not a live one. */
  rating: number;
  /** Number of mock reviews behind the rating. */
  reviewCount: number;
  /** Nightly price in Iranian toman. */
  pricePerNight: number;
  /** Maximum guests in the whole unit. */
  maxGuests: number;
  bedrooms: number;
  beds: number;
  bathrooms: number;
  amenities: string[];
  /** Property rules — merged from mock defaults at dataset build time. */
  rules: AccommodationRules;
}

/** Sort orders supported by the listing explorer. */
export type AccommodationSort =
  | "recommended"
  | "priceAsc"
  | "priceDesc"
  | "rating"
  | "popular";

/** Structured filters applied in the explorer section. */
export interface AccommodationFilters {
  /** Destination chip id, or "all". */
  destination: AccommodationCity | "all";
  /** Accommodation type chip id, or "all". */
  type: AccommodationType | "all";
}
