import type { JalaliDate } from "../components/jalali-utils";

/** Fields the booking-form validation can report errors for. */
export type AccommodationBookingField =
  | "accommodationId"
  | "dates"
  | "nights"
  | "guests"
  | "guestName"
  | "guestPhone";

export interface AccommodationBookingFieldError {
  field: AccommodationBookingField;
  message: string;
}

export interface AccommodationBookingInput {
  accommodationId: string;
  checkIn: JalaliDate | null;
  checkOut: JalaliDate | null;
  adults: number;
  children: number;
  /** Number of units/rooms to book. */
  rooms: number;
  /** Maximum guests per unit — used for capacity validation. */
  maxGuests: number;
  /** Nights between checkIn and checkOut. */
  nights: number;
  guestName: string;
  guestPhone: string;
  notes?: string;
}

/**
 * Response of the (currently mocked) booking request.
 * There is no real backend yet: this is ALWAYS a pending/demo result
 * (with a clearly labelled DEMO- reference) and must never be presented
 * as a confirmed reservation or a paid order.
 */
export interface AccommodationBookingResult {
  /** Always the demo/pending state — never a confirmed reservation. */
  status: "pending_demo";
  /** Clearly labelled demo reference — NOT a real reservation number. */
  demoReference: string;
  submittedAt: string;
  message: string;
}
