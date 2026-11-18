import type { HotelCity } from "@/types/hotel";

export type CityCategoryId = HotelCity | "all";

export interface HotelCityCategory {
  id: CityCategoryId;
  label: string;
  icon: string;
}

/** City filter chips shown in the «شهرهای پرطرفدار» strip. */
export const HOTEL_CITY_CATEGORIES: HotelCityCategory[] = [
  { id: "mazandaran", label: "هتل‌های مازندران", icon: "fa-tree" },
  { id: "tehran", label: "هتل‌های تهران", icon: "fa-tower-observation" },
  { id: "shiraz", label: "هتل‌های شیراز", icon: "fa-monument" },
  { id: "mashhad", label: "هتل‌های مشهد", icon: "fa-mosque" },
  { id: "yazd", label: "هتل‌های یزد", icon: "fa-archway" },
  { id: "kish", label: "هتل‌های کیش", icon: "fa-umbrella-beach" },
  { id: "qeshm", label: "هتل‌های قشم", icon: "fa-water" },
  { id: "hamedan", label: "هتل‌های همدان", icon: "fa-mountain" },
  { id: "all", label: "همه هتل‌ها", icon: "fa-hotel" },
];
