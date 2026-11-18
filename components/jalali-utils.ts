/**
 * Jalali (Persian) calendar utilities
 * No external dependencies - pure TypeScript implementation
 */

/**
 * Days in each Jalali month (non-leap year)
 * Farvardin(1) to Esfand(12): 31,31,31,31,31,31,30,30,30,30,30,29/30
 */
const JALALI_MONTH_DAYS = [31, 31, 31, 31, 31, 31, 30, 30, 30, 30, 30, 29];

/**
 * Persian/Arabic-Indic digits
 */
const PERSIAN_DIGITS = ["۰", "۱", "۲", "۳", "۴", "۵", "۶", "۷", "۸", "۹"];

/**
 * Jalali month names
 */
const JALALI_MONTH_NAMES = [
  "فروردین",
  "اردیبهشت",
  "خرداد",
  "تیر",
  "مرداد",
  "شهریور",
  "مهر",
  "آبان",
  "آذر",
  "دی",
  "بهمن",
  "اسفند",
];

/**
 * Weekday short names (Persian, starting from Saturday)
 * Sh, Y, D, S, Ch, P, J
 */
const JALALI_WEEKDAYS = ["ش", "ی", "د", "س", "چ", "پ", "ج"];

/**
 * Convert a number to Persian numerals
 */
export function toPersianNumerals(num: number): string {
  return num
    .toString()
    .split("")
    .map((d) => PERSIAN_DIGITS[parseInt(d, 10)])
    .join("");
}

/**
 * Convert Persian numerals to English digits
 */
export function toEnglishNumerals(str: string): string {
  return str
    .split("")
    .map((c) => {
      const idx = PERSIAN_DIGITS.indexOf(c);
      return idx !== -1 ? idx.toString() : c;
    })
    .join("");
}

/**
 * Check if a Jalali year is a leap year (Kabiseh)
 */
export function isJalaliLeapYear(jy: number): boolean {
  const breaks = [
    -61, 9, 38, 199, 426, 686, 756, 818, 1181, 1210, 1635, 2060, 2097, 2192, 2262,
    2324, 2394, 2456, 3178,
  ];
  const cycleStart = 979;
  const cycleLength = 12053;
  const cycleCount = Math.floor((jy - cycleStart) / cycleLength);
  const remainder = jy - cycleStart - cycleCount * cycleLength;
  if (remainder < 0) return false;
  const breakIndex = breaks.findIndex((b) => b > remainder);
  if (breakIndex === -1) return false;
  return breaks[breakIndex - 1] === remainder;
}

/**
 * Get the number of days in a Jalali month
 */
export function getJalaliDaysInMonth(jy: number, jm: number): number {
  if (jm === 12 && isJalaliLeapYear(jy)) {
    return 30;
  }
  return JALALI_MONTH_DAYS[jm - 1];
}

/**
 * Convert Gregorian date to Jalali
 * Algorithm adapted from jalaali-js (MIT)
 */
export function gregorianToJalali(gy: number, gm: number, gd: number) {
  const jDaysInMonth = [31, 31, 31, 31, 31, 31, 30, 30, 30, 30, 30, 29];

  const gYear = gy - (gm > 2 ? 1 : 0);
  const leap =
    (gYear % 4 === 0 && gYear % 100 !== 0) || gYear % 400 === 0;
  const gdoy =
    gm > 2
      ? (leap ? 1 : 2) + Math.floor((275 * gm) / 9)
      : gm * 31 - (gm - 1) * 30;
  const gdayNo =
    365 * gYear +
    Math.floor((gYear + 3) / 4) -
    Math.floor((gYear + 99) / 100) +
    Math.floor((gYear + 399) / 400) +
    gdoy +
    gd -
    1;
  const jdayNo = gdayNo - 79;

  const jn = Math.floor(jdayNo / 12053);
  const jdayNoRem = jdayNo % 12053;
  let jYear =
    979 + 33 * jn + 4 * Math.floor(jdayNoRem / 1461);
  let jdayNoRem2 = jdayNoRem % 1461;

  let jMonth: number;
  let jDay: number;

  if (jdayNoRem2 >= 366) {
    jYear += Math.floor((jdayNoRem2 - 1) / 365);
    let jdayNoRem3 = (jdayNoRem2 - 1) % 365;
    for (jMonth = 0; jMonth < 11; jMonth++) {
      if (jdayNoRem3 >= jDaysInMonth[jMonth]) {
        jdayNoRem3 -= jDaysInMonth[jMonth];
      } else {
        break;
      }
    }
    jDay = jdayNoRem3 + 1;
  } else {
    for (jMonth = 0; jMonth < 11; jMonth++) {
      if (jdayNoRem2 >= jDaysInMonth[jMonth]) {
        jdayNoRem2 -= jDaysInMonth[jMonth];
      } else {
        break;
      }
    }
    jDay = jdayNoRem2 + 1;
  }

  return { jy: jYear, jm: jMonth + 1, jd: jDay };
}

/**
 * Convert Jalali date to Gregorian
 * Algorithm adapted from jalaali-js (MIT)
 */
export function jalaliToGregorian(jy: number, jm: number, jd: number) {
  const gDaysInMonth = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

  const cycleStart = 979;

  const jyRem = jy - cycleStart;
  const jn = Math.floor(jyRem / 33);
  const jyRemMod33 = jyRem % 33;

  let jyGregorianBase: number;
  if (jyRemMod33 < 3) {
    jyGregorianBase = 621 + jyRem + 33 * jn;
  } else {
    jyGregorianBase = 622 + jyRem + 33 * jn;
  }

  let gYear = jyGregorianBase;
  let gMonth = 0;
  let gDay = 0;

  const jdayNo =
    jd -
    1 +
    (jm - 1 < 6 ? (jm - 1) * 31 : (jm - 1) * 30 + 5) +
    (jy > 979 ? 365 * (jy - 1) + Math.floor((jy - 1 - 1) / 33) + 3 : 0);

  let gdayNo = jdayNo + 79;

  gYear = 400 * Math.floor(gdayNo / 146097);
  gdayNo = gdayNo % 146097;

  let leap = true;
  if (gdayNo >= 36525) {
    gdayNo--;
    gYear += 100 * Math.floor(gdayNo / 36524);
    gdayNo = gdayNo % 36524;
    if (gdayNo >= 1460) {
      gdayNo--;
      gYear += 4 * Math.floor(gdayNo / 1461);
      gdayNo = gdayNo % 1461;
      if (gdayNo >= 366) {
        leap = false;
        gdayNo--;
        gYear += Math.floor(gdayNo / 365);
        gdayNo = gdayNo % 365;
      }
    }
  }

  for (gMonth = 0; gMonth < 11; gMonth++) {
    const days = gMonth === 1 && !leap ? 28 : gDaysInMonth[gMonth];
    if (gdayNo >= days) {
      gdayNo -= days;
    } else {
      break;
    }
  }

  gDay = gdayNo + 1;
  gMonth = gMonth + 1;

  return { gy: gYear, gm: gMonth, gd: gDay };
}

/**
 * Jalali calendar date (Persian calendar).
 */
export type JalaliDate = { jy: number; jm: number; jd: number };

/**
 * Get the current Jalali date based on the actual system date
 */
export function getCurrentJalaliDate(): JalaliDate {
  const now = new Date();
  return gregorianToJalali(now.getFullYear(), now.getMonth() + 1, now.getDate());
}

/**
 * Get Jalali month name by index (1-based)
 */
export function getJalaliMonthName(jm: number): string {
  return JALALI_MONTH_NAMES[jm - 1];
}

/**
 * Get weekday short names for Jalali calendar
 */
export function getJalaliWeekdays(): string[] {
  return JALALI_WEEKDAYS;
}

/**
 * Calculate the number of nights between two Jalali dates
 */
export function calcNights(
  checkIn: { jy: number; jm: number; jd: number },
  checkOut: { jy: number; jm: number; jd: number }
): number {
  const gi = jalaliToGregorian(checkIn.jy, checkIn.jm, checkIn.jd);
  const go = jalaliToGregorian(checkOut.jy, checkOut.jm, checkOut.jd);
  const diffMs =
    new Date(go.gy, go.gm - 1, go.gd).getTime() -
    new Date(gi.gy, gi.gm - 1, gi.gd).getTime();
  return Math.round(diffMs / (1000 * 60 * 60 * 24));
}

/**
 * Get the first day of week (0=Saturday) for a Jalali month
 */
export function getJalaliMonthStartWeekday(jy: number, jm: number): number {
  const g = jalaliToGregorian(jy, jm, 1);
  const date = new Date(g.gy, g.gm - 1, g.gd);
  const day = date.getDay(); // 0=Sunday
  return (day + 1) % 7; // 0=Saturday
}

/**
 * Format a Jalali date as a display string (e.g., "۲۶ فروردین")
 */
export function formatJalaliDate(
  jy: number,
  jm: number,
  jd: number,
  options?: { withYear?: boolean }
): string {
  const day = toPersianNumerals(jd);
  const month = getJalaliMonthName(jm);
  if (options?.withYear) {
    const year = toPersianNumerals(jy);
    return `${day} ${month} ${year}`;
  }
  return `${day} ${month}`;
}

/**
 * Format a Jalali date range summary
 * Example: "تاریخ ورود: ۲۶ فروردین - تاریخ خروج: ۲۹ فروردین (۳ شب)"
 */
export function formatDateRangeSummary(
  checkIn: { jy: number; jm: number; jd: number },
  checkOut: { jy: number; jm: number; jd: number }
): string {
  const nights = calcNights(checkIn, checkOut);
  const nightsStr = toPersianNumerals(nights);
  return `تاریخ ورود: ${formatJalaliDate(checkIn.jy, checkIn.jm, checkIn.jd)} - تاریخ خروج: ${formatJalaliDate(checkOut.jy, checkOut.jm, checkOut.jd)} (${nightsStr} شب)`;
}
