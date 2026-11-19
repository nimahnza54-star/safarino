/**
 * Canonical accommodation amenities with display icons.
 * Records reference amenities by their Persian label (kept human-readable
 * in cards and the detail modal); the icon map is only for presentation.
 */
export interface AmenityDefinition {
  label: string;
  icon: string;
}

export const ACCOMMODATION_AMENITIES: AmenityDefinition[] = [
  { label: "وای‌فای", icon: "fa-wifi" },
  { label: "استخر", icon: "fa-person-swimming" },
  { label: "پارکینگ", icon: "fa-square-parking" },
  { label: "آشپزخانه کامل", icon: "fa-kitchen-set" },
  { label: "سیستم سرمایش و گرمایش", icon: "fa-temperature-half" },
  { label: "منظره جنگل", icon: "fa-tree" },
  { label: "منظره دریا", icon: "fa-water" },
  { label: "منظره کوه", icon: "fa-mountain-sun" },
  { label: "حیاط اختصاصی", icon: "fa-leaf" },
  { label: "روف‌گاردن", icon: "fa-seedling" },
  { label: "جکوزی", icon: "fa-hot-tub-person" },
  { label: "آتش‌دان", icon: "fa-fire-burner" },
  { label: "تاب", icon: "fa-person-walking" },
  { label: "مبلمان و اسباب‌بازی", icon: "fa-chair" },
  { label: "رستوران", icon: "fa-utensils" },
  { label: "فضای سبز", icon: "fa-seedling" },
  { label: "نگهبان ۲۴ ساعته", icon: "fa-shield-halved" },
];
