import type { Accommodation, AccommodationFilters, AccommodationSort } from "../types/accommodation";
import type { SearchCriteria } from "../types/search";
import type {
  AccommodationBookingField,
  AccommodationBookingInput,
} from "../types/accommodation-booking";
import { calcNights } from "../components/jalali-utils";
import { normalizeFa } from "./hotel-math";

export { normalizeFa };

/**
 * Pure accommodation business logic — no I/O, no mock imports.
 * Kept dependency-free so it can be unit-tested with the built-in
 * Node test runner (see tests/accommodation-math.test.mjs).
 */

/** Destination match: name, location, city label or type label vs. free-text query. */
export function matchesAccommodation(
  accommodation: Accommodation,
  rawQuery: string
): boolean {
  const query = normalizeFa(rawQuery);
  if (!query) return true;

  const tokens = query
    .split(/[،,]/)
    .map((t) => t.trim())
    .filter(Boolean);
  const haystacks = [
    normalizeFa(accommodation.name),
    normalizeFa(accommodation.location),
    normalizeFa(accommodation.cityLabel),
    normalizeFa(accommodation.typeLabel),
  ];

  return tokens.some(
    (token) =>
      haystacks.some((h) => h.includes(token)) ||
      haystacks.some((h) => token.includes(h))
  );
}

/**
 * Capacity check for a whole-unit booking: the party size must fit the
 * unit's max occupancy. Unlike hotels there is no per-room multiplier —
 * an accommodation is a single bookable unit. `criteria.rooms` is carried
 * by the shared search form but is not multiplied into capacity.
 */
export function fitsCapacity(
  accommodation: Accommodation,
  criteria: Pick<SearchCriteria, "adults" | "children">
): boolean {
  const guests = criteria.adults + criteria.children;
  return accommodation.maxGuests >= guests;
}

/** Default filters: everything, unfiltered. */
export const DEFAULT_ACCOMMODATION_FILTERS: AccommodationFilters = {
  destination: "all",
  type: "all",
};

/** Apply destination + type filters together. */
export function filterAccommodations(
  list: Accommodation[],
  filters: AccommodationFilters
): Accommodation[] {
  return list.filter((item) => {
    if (filters.destination !== "all" && item.city !== filters.destination)
      return false;
    if (filters.type !== "all" && item.type !== filters.type) return false;
    return true;
  });
}

/** Sort a list (non-mutating). */
export function sortAccommodations<T extends Accommodation>(
  list: T[],
  sort: AccommodationSort
): T[] {
  const copy = [...list];
  switch (sort) {
    case "priceAsc":
      return copy.sort((a, b) => a.pricePerNight - b.pricePerNight);
    case "priceDesc":
      return copy.sort((a, b) => b.pricePerNight - a.pricePerNight);
    case "rating":
      return copy.sort(
        (a, b) => b.rating - a.rating || b.reviewCount - a.reviewCount
      );
    case "popular":
      return copy.sort(
        (a, b) => b.reviewCount - a.reviewCount || b.rating - a.rating
      );
    case "recommended":
    default:
      return copy.sort(
        (a, b) => b.rating - a.rating || b.reviewCount - a.reviewCount
      );
  }
}

/** Price breakdown for a stay. Nights must already be validated to be >= 1. */
export interface StayPriceBreakdown {
  nights: number;
  /** Undiscounted nightly rate. */
  nightlyOriginal: number;
  /** Nightly rate after the campaign discount (equals nightlyOriginal when none). */
  nightlyFinal: number;
  discountPercent: number;
  originalTotal: number;
  discountAmount: number;
  finalTotal: number;
}

/**
 * Compute the estimated stay price. Only applies discounts that are
 * explicitly present in the configuration — never invents taxes or fees.
 */
export function computeStayBreakdown(params: {
  pricePerNight: number;
  nights: number;
  discountPercent?: number;
}): StayPriceBreakdown {
  const { pricePerNight, nights } = params;
  const discountPercent = params.discountPercent ?? 0;
  const nightlyFinal =
    discountPercent > 0
      ? Math.round(pricePerNight * (1 - discountPercent / 100))
      : pricePerNight;
  const originalTotal = pricePerNight * nights;
  const finalTotal = nightlyFinal * nights;
  return {
    nights,
    nightlyOriginal: pricePerNight,
    nightlyFinal,
    discountPercent,
    originalTotal,
    discountAmount: originalTotal - finalTotal,
    finalTotal,
  };
}

/** Number of nights between two Jalali dates (0 when the range is invalid). */
export function numberOfNights(
  checkIn: { jy: number; jm: number; jd: number },
  checkOut: { jy: number; jm: number; jd: number }
): number {
  return calcNights(checkIn, checkOut);
}

/* ------------------------------------------------------------------ */
/* Booking form validation                                              */
/* ------------------------------------------------------------------ */

export type BookingField = AccommodationBookingField;

export interface BookingValidation {
  valid: boolean;
  errors?: Partial<Record<AccommodationBookingField, string>>;
}

const PERSIAN_TO_ENGLISH_DIGITS: Record<string, string> = {
  "۰": "0", "۱": "1", "۲": "2", "۳": "3", "۴": "4",
  "۵": "5", "۶": "6", "۷": "7", "۸": "8", "۹": "9",
  "٠": "0", "١": "1", "٢": "2", "٣": "3", "٤": "4",
  "٥": "5", "٦": "6", "٧": "7", "٨": "8", "٩": "9",
};

export function toEnglishDigits(input: string): string {
  return input.replace(/[۰-۹٠-٩]/g, (d) => PERSIAN_TO_ENGLISH_DIGITS[d] ?? d);
}

/** Iranian mobile: 09 followed by exactly 9 digits. */
export function isValidIranianMobile(phone: string): boolean {
  return /^09\d{9}$/.test(toEnglishDigits(phone).replace(/\s/g, ""));
}

/** Validate a booking request draft; returns Persian error messages. */
export function validateBookingInput(input: AccommodationBookingInput): BookingValidation {
  const errors: Partial<Record<AccommodationBookingField, string>> = {};

  if (!input.accommodationId.trim()) {
    errors.accommodationId = "اقامتگاه انتخاب نشده است.";
  }

  if (!input.checkIn || !input.checkOut) {
    errors.dates = "تاریخ ورود و خروج را کامل انتخاب کنید.";
  } else if (calcNights(input.checkIn, input.checkOut) <= 0) {
    errors.dates = "تاریخ خروج باید بعد از تاریخ ورود باشد.";
  }

  if (!Number.isFinite(input.nights) || input.nights <= 0) {
    errors.nights = "حداقل یک شب اقامت لازم است.";
  }

  const adults = Number.isFinite(input.adults) ? input.adults : 0;
  const children = Number.isFinite(input.children) ? input.children : 0;
  const rooms = Number.isFinite(input.rooms) ? input.rooms : 0;
  if (adults < 1) {
    errors.guests = "حداقل یک بزرگسال در رزرو لازم است.";
  } else if (children < 0 || rooms < 1) {
    errors.guests = "تعداد کودک یا واحد انتخاب‌شده نامعتبر است.";
  } else if (adults + children > input.maxGuests * rooms) {
    errors.guests = `ظرفیت این اقامتگاه حداکثر ${input.maxGuests} نفر در هر واحد است.`;
  }

  if (input.guestName.trim().length < 3) {
    errors.guestName = "نام و نام خانوادگی را کامل وارد کنید.";
  }

  if (!isValidIranianMobile(input.guestPhone)) {
    errors.guestPhone = "شماره موبایل معتبر وارد کنید (مثلاً ۰۹۱۲۳۴۵۶۷۸۹).";
  }

  return Object.keys(errors).length === 0
    ? { valid: true }
    : { valid: false, errors };
}
