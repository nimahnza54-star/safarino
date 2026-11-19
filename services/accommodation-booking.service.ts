import type {
  AccommodationBookingField,
  AccommodationBookingFieldError,
  AccommodationBookingInput,
  AccommodationBookingResult,
} from "../types/accommodation-booking";
import { validateBookingInput } from "./accommodation-math";

/**
 * Booking service — frontend data-access layer for accommodation
 * reservation requests.
 *
 * There is NO booking backend yet. `submitAccommodationBookingRequest`
 * simulates the network round-trip and ALWAYS returns a `pending_demo`
 * result. It must never be presented as a confirmed reservation and must
 * never claim a payment succeeded. To connect the real API, replace the
 * internals with a `fetch()` to the booking endpoint; the UI contract
 * (input/output types) is designed to stay unchanged.
 */
const NETWORK_DELAY_MS = 600;

/**
 * Thrown when the booking payload fails validation. Carries the
 * field-level errors so the form can highlight the exact inputs.
 */
export class AccommodationBookingValidationError extends Error {
  readonly errors: AccommodationBookingFieldError[];

  constructor(errors: AccommodationBookingFieldError[]) {
    super("Accommodation booking input failed validation.");
    this.name = "AccommodationBookingValidationError";
    this.errors = errors;
  }
}

/**
 * Validate a booking payload and return a flat, ordered list of
 * field-level errors (empty when the payload is valid). Delegates to the
 * shared pure validator so the form and the service stay in sync.
 */
export function validateAccommodationBookingInput(
  input: AccommodationBookingInput
): AccommodationBookingFieldError[] {
  const result = validateBookingInput(input);
  if (result.valid) return [];

  return (
    Object.entries(result.errors ?? {}) as Array<[AccommodationBookingField, string]>
  ).map(([field, message]) => ({ field, message }));
}

/** Clearly labelled demo reference — NOT a real reservation number. */
function createDemoReference(): string {
  const stamp = new Date()
    .toISOString()
    .replace(/[-:TZ.]/g, "")
    .slice(0, 14);
  const suffix = Math.random().toString(36).slice(2, 6).toUpperCase();
  return `DEMO-${stamp}-${suffix}`;
}

export async function submitAccommodationBookingRequest(
  input: AccommodationBookingInput
): Promise<AccommodationBookingResult> {
  const errors = validateAccommodationBookingInput(input);
  if (errors.length > 0) {
    throw new AccommodationBookingValidationError(errors);
  }

  await new Promise<void>((resolve) => setTimeout(resolve, NETWORK_DELAY_MS));

  // Intentionally NOT fabricating a reservation number or confirmation.
  return {
    status: "pending_demo",
    demoReference: createDemoReference(),
    submittedAt: new Date().toISOString(),
    message:
      "درخواست رزرو آزمایشی شما ثبت شد. این یک رزرو قطعی نیست و هیچ پرداختی انجام نشده است. پس از اتصال بک‌اند، میزبان درخواست را بررسی و تأیید می‌کند؛ واچر صادر می‌شود.",
  };
}
