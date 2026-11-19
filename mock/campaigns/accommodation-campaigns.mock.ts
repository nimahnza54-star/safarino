import type { AccommodationCampaign } from "@/types/accommodation-campaign";

/**
 * Central accommodation campaign configuration.
 * Eligibility is expressed only as accommodation id lists here; the UI
 * never hardcodes which property belongs to which campaign.
 * `expiresAt` is a stable ISO-8601 timestamp — it is never regenerated.
 */
export const ACCOMMODATION_CAMPAIGNS: AccommodationCampaign[] = [
  {
    id: "firstBooking",
    title: "اقامتگاه‌های با تخفیف اولین رزرو",
    shortLabel: "تخفیف اولین رزرو",
    badgeText: "۱۵٪ اولین رزرو",
    description:
      "کاربرانی که برای اولین بار از سفرینو اقامتگاه رزرو می‌کنند، از ۱۵٪ تخفیف روی اقامتگاه‌های منتخب بهره‌مند می‌شوند.",
    discountPercent: 15,
    accommodationIds: [
      "acc-gilan-01",
      "acc-alborz-01",
      "acc-isfahan-01",
      "acc-gilan-02",
      "acc-tehran-02",
      "acc-kish-02",
    ],
    terms: [
      "تخفیف فقط برای اولین رزرو تأییدشده هر کاربر اعمال می‌شود.",
      "تخفیف روی مبلغ نهایی اقامت (بدون احتساب هزینه خدمات) محاسبه می‌شود.",
      "امکان ترکیب با سایر کدهای تخفیف وجود ندارد.",
    ],
  },
  {
    id: "loyalty",
    title: "اقامتگاه‌های با تخفیف وفاداری",
    shortLabel: "تخفیف وفاداری",
    badgeText: "۱۰٪ وفاداری",
    description:
      "اعضای باشگاه مشتریان طلایی و نقره‌ای سفرینو از ۱۰٪ تخفیف روی اقامتگاه‌های منتخب وفاداری استفاده می‌کنند.",
    discountPercent: 10,
    accommodationIds: [
      "acc-mazandaran-02",
      "acc-shiraz-01",
      "acc-mashhad-01",
      "acc-mazandaran-03",
      "acc-yazd-01",
      "acc-isfahan-01",
    ],
    terms: [
      "تخفیف وفاداری فقط برای اعضای باشگاه مشتریان سفرینو قابل استفاده است.",
      "۱۰٪ از مبلغ نهایی به عنوان امتیاز وفاداری کسر می‌شود.",
      "تخفیف در زمان ثبت درخواست و بر اساس آخرین سیاست باشگاه محاسبه می‌شود.",
    ],
  },
  {
    id: "lastMinute",
    title: "اقامتگاه‌های تخفیف لحظه آخری",
    shortLabel: "تخفیف لحظه آخری",
    badgeText: "۳۰٪ لحظه آخری",
    description:
      "پیشنهادهای محدود زمانی با تا ۳۰٪ تخفیف لحظه آخری روی ظرفیت باقی‌مانده اقامتگاه‌های منتخب.",
    discountPercent: 30,
    accommodationIds: [
      "acc-mazandaran-04",
      "acc-gilan-03",
      "acc-alborz-02",
      "acc-mazandaran-05",
    ],
    terms: [
      "پیشنهاد فقط تا پایان مهلت اعلام‌شده معتبر است و پس از آن غیرفعال می‌شود.",
      "ظرفیت اقامتگاه‌های لحظه آخری محدود و بر اساس باقی‌مانده میزبان است.",
      "استرداد رزرو لحظه آخری مطابق قوانین همان اقامتگاه انجام می‌شود.",
    ],
    /**
     * Stable expiration timestamp (ISO-8601). The countdown targets this
     * exact moment; when it passes, the section renders an expired state
     * and the offers are no longer presented as bookable.
     */
    expiresAt: "2026-11-19T23:59:59+03:30",
  },
];
