/**
 * Core hotel domain types.
 *
 * Every hotel in the dataset is identified by a stable, unique `id`.
 * Favorites, campaigns and search results all reference hotels by id.
 */
export type HotelCity =
  | "mazandaran"
  | "tehran"
  | "shiraz"
  | "mashhad"
  | "yazd"
  | "kish"
  | "qeshm"
  | "hamedan";

export interface Hotel {
  id: string;
  name: string;
  city: HotelCity;
  /** Persian display label of the city/region, e.g. «تهران». */
  cityLabel: string;
  /** Free-form location detail, e.g. «تهران، سعادت‌آباد». */
  location: string;
  /** Average guest rating, 0–5. Mock data — not a live rating. */
  rating: number;
  /** Number of mock reviews behind the rating. */
  reviewCount: number;
  /** Nightly price in Iranian toman (IRR-less display currency). */
  pricePerNight: number;
  /** Short Persian description shown on cards and detail views. */
  description: string;
  /** Image URL — either a local asset in /public or an allow-listed remote host. */
  image: string;
  /** Maximum guests the property can host in a single room. */
  maxGuests: number;
  amenities: string[];
}

/** Minimal pick used for search suggestions (destination dropdown). */
export interface DestinationOption {
  id: string;
  name: string;
  city: string;
  type: "hotel" | "accommodation" | "villa";
}
