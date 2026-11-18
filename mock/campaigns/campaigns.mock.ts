import type { Campaign } from "@/types/campaign";

/**
 * Central campaign configuration.
 *
 * `expiresAt` for time-bound campaigns lives here so the backend team can
 * later replace the mock with an API response without touching the UI.
 * The countdown is computed from this stable timestamp on every render;
 * it is never regenerated client-side.
 */
export const CAMPAIGNS: Campaign[] = [
  {
    id: "firstBooking",
    title: "هتل‌های با تخفیف اولین رزرو",
    shortLabel: "تخفیف اولین رزرو",
    badgeText: "۱۵٪ اولین رزرو",
    description:
      "همه کاربرانی که برای اولین بار از سفرینو رزرو هتل انجام می‌دهند، از ۱۵٪ تخفیف اولین رزرو روی هتل‌های منتخب بهره‌مند می‌شوند.",
    discountPercent: 15,
    hotelIds: [
      "hotel-tehran-01",
      "hotel-shiraz-01",
      "hotel-mashhad-01",
      "hotel-kish-01",
      "hotel-yazd-01",
      "hotel-mazandaran-01",
    ],
    terms: [
      "تخفیف فقط برای اولین رزرو تأییدشده هر کاربر اعمال می‌شود.",
      "تخفیف روی مبلغ نهایی اقامت (بدون احتساب عوارض و مالیات) محاسبه می‌شود.",
      "امکان ترکیب با سایر کدهای تخفیف وجود ندارد.",
    ],
  },
  {
    id: "loyalty",
    title: "هتل‌های با تخفیف وفاداری",
    shortLabel: "تخفیف وفاداری",
    badgeText: "۱۰٪ وفاداری",
    description:
      "اعضای باشگاه مشتریان سفرینو با امتیاز وفاداری خود از ۱۰٪ تخفیف روی هتل‌های منتخب وفاداری استفاده می‌کنند.",
    discountPercent: 10,
    hotelIds: [
      "hotel-tehran-01",
      "hotel-kish-01",
      "hotel-mashhad-02",
      "hotel-yazd-02",
      "hotel-qeshm-02",
      "hotel-hamedan-02",
    ],
    terms: [
      "تخفیف وفاداری فقط برای اعضای باشگاه مشتریان سفرینو قابل استفاده است.",
      "۱۰٪ از مبلغ نهایی به عنوان امتیاز وفاداری قابل استفاده نیست و پس از تسویه کسر می‌شود.",
      "تخفیف در زمان تسویه و بر اساس آخرین سیاست باشگاه محاسبه می‌شود.",
    ],
  },
  {
    id: "lastMinute",
    title: "هتل‌های تخفیف لحظه آخری",
    shortLabel: "تخفیف لحظه آخری",
    badgeText: "۳۰٪ لحظه آخری",
    description:
      "پیشنهادهای محدود زمانی با تا ۳۰٪ تخفیف لحظه آخری روی اتاق‌های باقی‌مانده هتل‌های منتخب.",
    discountPercent: 30,
    hotelIds: [
      "hotel-mazandaran-01",
      "hotel-yazd-01",
      "hotel-kish-01",
      "hotel-mashhad-02",
    ],
    terms: [
      "پیشنهاد فقط تا پایان مهلت اعلام‌شده معتبر است و پس از آن غیرفعال می‌شود.",
      "ظرفیت اتاق‌های لحظه آخری محدود و بر اساس باقی‌مانده هتل است.",
      "استرداد رزرو لحظه آخری مطابق قوانین همان هتل انجام می‌شود.",
    ],
    /**
     * Stable expiration timestamp (ISO-8601). The countdown targets this
     * exact moment; when it passes, the section renders an expired state
     * and the offers are no longer presented as bookable.
     */
    expiresAt: "2026-11-19T23:59:59+03:30",
  },
];
