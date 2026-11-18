import type { JalaliDate } from "../components/jalali-utils";

/** Structured criteria captured by the hotel search box. */
export interface SearchCriteria {
  /** Raw destination text selected in the dropdown («هتل …، شهر»). */
  destination: string;
  checkIn: JalaliDate | null;
  checkOut: JalaliDate | null;
  adults: number;
  children: number;
  rooms: number;
}
