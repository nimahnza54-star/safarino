
import {
  isLeapJalaaliYear as isLeapYear,
  isValidJalaaliDate,
  jalaaliMonthLength,
  toGregorian,
  toJalaali,
} from "jalaali-js";

export type JalaliDate = {
  jy: number;
  jm: number;
  jd: number;
};

const MONTH_NAMES = [
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

const WEEKDAYS = ["ش", "ی", "د", "س", "چ", "پ", "ج"];

const PERSIAN_DIGITS = [
  "۰", "۱", "۲", "۳", "۴",
  "۵", "۶", "۷", "۸", "۹",
];

export function toPersianNumerals(value: number | string): string {
  return String(value).replace(
    /\d/g,
    (digit) => PERSIAN_DIGITS[Number(digit)]
  );
}

export function toEnglishNumerals(value: string): string {
  return value
    .replace(/[۰-۹]/g, (digit) =>
      String(PERSIAN_DIGITS.indexOf(digit))
    )
    .replace(/[٠-٩]/g, (digit) =>
      String("٠١٢٣٤٥٦٧٨٩".indexOf(digit))
    );
}

export function gregorianToJalali(
  gy: number,
  gm: number,
  gd: number
): JalaliDate {
  return toJalaali(gy, gm, gd);
}

export function jalaliToGregorian(
  jy: number,
  jm: number,
  jd: number
): {
  gy: number;
  gm: number;
  gd: number;
} {
  if (!isValidJalaaliDate(jy, jm, jd)) {
    throw new Error(`Invalid Jalali date: ${jy}/${jm}/${jd}`);
  }

  return toGregorian(jy, jm, jd);
}

export function isJalaliLeapYear(jy: number): boolean {
  return isLeapYear(jy);
}

export function getJalaliDaysInMonth(
  jy: number,
  jm: number
): number {
  if (!Number.isInteger(jm) || jm < 1 || jm > 12) {
    throw new Error(`Invalid Jalali month: ${jm}`);
  }

  return jalaaliMonthLength(jy, jm);
}

export function getCurrentJalaliDate(): JalaliDate {
  const parts = new Intl.DateTimeFormat("en-US", {
    calendar: "gregory",
    numberingSystem: "latn",
    timeZone: "Asia/Tehran",
    year: "numeric",
    month: "numeric",
    day: "numeric",
  }).formatToParts(new Date());

  const read = (
    type: "year" | "month" | "day"
  ): number => {
    const value = parts.find(
      (part) => part.type === type
    )?.value;

    if (!value) {
      throw new Error(`Unable to read Tehran ${type}`);
    }

    return Number(value);
  };

  return gregorianToJalali(
    read("year"),
    read("month"),
    read("day")
  );
}

export function getJalaliMonthName(jm: number): string {
  return MONTH_NAMES[jm - 1] ?? "";
}

export function getJalaliWeekdays(): string[] {
  return WEEKDAYS;
}

/** Saturday = 0 ... Friday = 6 */
export function getJalaliMonthStartWeekday(
  jy: number,
  jm: number
): number {
  const firstDay = jalaliToGregorian(jy, jm, 1);

  const weekday = new Date(
    Date.UTC(
      firstDay.gy,
      firstDay.gm - 1,
      firstDay.gd
    )
  ).getUTCDay();

  return (weekday + 1) % 7;
}

function dateUtcTimestamp(date: JalaliDate): number {
  const gregorian = jalaliToGregorian(
    date.jy,
    date.jm,
    date.jd
  );

  return Date.UTC(
    gregorian.gy,
    gregorian.gm - 1,
    gregorian.gd
  );
}

export function calcNights(
  checkIn: JalaliDate,
  checkOut: JalaliDate
): number {
  return Math.round(
    (
      dateUtcTimestamp(checkOut) -
      dateUtcTimestamp(checkIn)
    ) / 86_400_000
  );
}

export function formatJalaliDate(
  jy: number,
  jm: number,
  jd: number,
  options?: {
    withYear?: boolean;
  }
): string {
  const base = `${toPersianNumerals(jd)} ${getJalaliMonthName(jm)}`;

  return options?.withYear
    ? `${base} ${toPersianNumerals(jy)}`
    : base;
}

export function formatDateRangeSummary(
  checkIn: JalaliDate,
  checkOut: JalaliDate
): string {
  const nights = calcNights(checkIn, checkOut);

  return (
    `تاریخ ورود: ${formatJalaliDate(checkIn.jy, checkIn.jm, checkIn.jd)} - ` +
    `تاریخ خروج: ${formatJalaliDate(checkOut.jy, checkOut.jm, checkOut.jd)} ` +
    `(${toPersianNumerals(nights)} شب)`
  );
}
