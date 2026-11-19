import type { AccommodationRules } from "@/types/accommodation";

/**
 * House rules per accommodation id.
 * Every record falls back to DEFAULT_ACCOMMODATION_RULES when no override
 * exists, so the dataset stays complete without repeating boilerplate.
 * Rules are property policy — never UI copy.
 */
export const DEFAULT_ACCOMMODATION_RULES: AccommodationRules = {
  checkInTime: "۱۴:۰۰",
  checkOutTime: "۱۲:۰۰",
  petPolicy: "ورود حیوان خانگی فقط با هماهنگی قبلی و پذیرش توسط میزبان مجاز است.",
  smokingPolicy: "کشیدن سیگار داخل واحد اقامتی ممنوع است؛ فضای باز حیاط برای این کار در نظر گرفته شده.",
  eventPolicy: "برگزاری مراسم و مهمانی خارج از ظرفیت اعلام‌شده واحد ممنوع است.",
  cancellationPolicy:
    "استرداد طبق سیاست همان اقامتگاه انجام می‌شود؛ جزئیات دقیق پیش از ثبت درخواست نمایش داده می‌شود.",
  maxGuests: 8,
};

const OVERRIDES: Record<string, Partial<AccommodationRules>> = {
  "acc-tehran-01": {
    checkInTime: "۱۵:۰۰",
    petPolicy: "ورود حیوان خانگی در این ویلا امکان‌پذیر نیست.",
    cancellationPolicy: "تا ۷۲ ساعت قبل از ورود، استرداد کامل؛ پس از آن طبق سیاست میزبان ۵۰٪ مبلغ کسر می‌شود.",
    maxGuests: 10,
  },
  "acc-mazandaran-01": {
    checkInTime: "۱۳:۰۰",
    eventPolicy: "دورهمی خانوادگی حداکثر تا ظرفیت ۱۰ نفر با هماهنگی قبلی مجاز است.",
    cancellationPolicy:
      "تا ۷۲ ساعت قبل از ورود استرداد کامل؛ تا ۲۴ ساعت قبل ۳۰٪ جریمه؛ کمتر از ۲۴ ساعت بدون استرداد.",
    maxGuests: 12,
  },
  "acc-yazd-01": {
    checkOutTime: "۱۱:۰۰",
    smokingPolicy: "کشیدن سیگار در حیاط مرکزی و اتاق‌ها ممنوع است.",
    cancellationPolicy: "تا ۴۸ ساعت قبل از ورود، استرداد کامل؛ پس از آن بدون استرداد.",
    maxGuests: 8,
  },
  "acc-kish-01": {
    petPolicy: "ورود حیوان خانگی به این واحد ساحلی امکان‌پذیر نیست.",
    cancellationPolicy: "تا ۷۲ ساعت قبل از ورود استرداد کامل؛ بین ۷۲ تا ۲۴ ساعت قبل ۵۰٪ مبلغ کسر می‌شود.",
    maxGuests: 12,
  },
  "acc-gilan-01": {
    checkInTime: "۱۳:۰۰",
    checkOutTime: "۱۱:۰۰",
    eventPolicy: "این کلبه برای اقامت خانوادگی آرام است؛ هرگونه مراسم شبانه مجاز نیست.",
    cancellationPolicy: "تا ۴۸ ساعت قبل از ورود استرداد کامل؛ پس از آن بدون استرداد.",
    maxGuests: 5,
  },
  "acc-mashhad-01": {
    cancellationPolicy:
      "تا ۴۸ ساعت قبل از ورود استرداد کامل؛ پس از آن طبق سیاست ویلا ۳۰٪ کسر می‌شود.",
    maxGuests: 11,
  },
  "acc-mazandaran-03": {
    petPolicy: "حیوان خانگی مجاز نیست.",
    eventPolicy: "برگزاری هرگونه مراسم در کلبه درختی ممنوع است.",
    cancellationPolicy: "تا ۴۸ ساعت قبل از ورود استرداد کامل؛ پس از آن بدون استرداد.",
    maxGuests: 6,
  },
};

/** Resolve rules for an accommodation id (override merged over defaults). */
export function getAccommodationRules(id: string): AccommodationRules {
  const override = OVERRIDES[id];
  return override
    ? { ...DEFAULT_ACCOMMODATION_RULES, ...override }
    : { ...DEFAULT_ACCOMMODATION_RULES };
}
