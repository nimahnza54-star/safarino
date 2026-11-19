import type { AccommodationType } from "@/types/accommodation";

export type AccommodationTypeCategoryId = AccommodationType | "all";
export type AccommodationCityCategoryId =
  | "mazandaran"
  | "tehran"
  | "gilan"
  | "alborz"
  | "yazd"
  | "isfahan"
  | "shiraz"
  | "mashhad"
  | "kish"
  | "all";

export interface AccommodationTypeCategory {
  id: AccommodationTypeCategoryId;
  label: string;
  icon: string;
}

/** Type filter chips shown above the accommodation grid. */
export const ACCOMMODATION_TYPE_CATEGORIES: AccommodationTypeCategory[] = [
  { id: "all", label: "همه اقامتگاه‌ها", icon: "fa-house-chimney" },
  { id: "villa", label: "ویلا", icon: "fa-house-flag" },
  { id: "suite", label: "سوئیت", icon: "fa-couch" },
  { id: "apartment", label: "آپارتمان", icon: "fa-building" },
  { id: "boomgardi", label: "بوم‌گردی", icon: "fa-campground" },
  { id: "kolbeh", label: "کلبه", icon: "fa-tree" },
  { id: "rustic", label: "خانه روستایی", icon: "fa-wheat-awn" },
];

export interface AccommodationCityCategory {
  id: AccommodationCityCategoryId;
  label: string;
  icon: string;
}

/** Destination filter chips shown above the accommodation grid. */
export const ACCOMMODATION_CITY_CATEGORIES: AccommodationCityCategory[] = [
  { id: "mazandaran", label: "اقامتگاه مازندران", icon: "fa-tree" },
  { id: "tehran", label: "اقامتگاه تهران", icon: "fa-tower-observation" },
  { id: "gilan", label: "اقامتگاه گیلان", icon: "fa-seedling" },
  { id: "alborz", label: "اقامتگاه البرز", icon: "fa-mountain" },
  { id: "yazd", label: "اقامتگاه یزد", icon: "fa-archway" },
  { id: "isfahan", label: "اقامتگاه اصفهان", icon: "fa-landmark" },
  { id: "shiraz", label: "اقامتگاه شیراز", icon: "fa-monument" },
  { id: "mashhad", label: "اقامتگاه مشهد", icon: "fa-mosque" },
  { id: "kish", label: "اقامتگاه کیش", icon: "fa-umbrella-beach" },
  { id: "all", label: "همه اقامتگاه‌ها", icon: "fa-house-chimney" },
];
