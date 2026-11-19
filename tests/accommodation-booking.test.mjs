import test from "node:test";
import assert from "node:assert/strict";
import {
  validateAccommodationBookingInput,
  submitAccommodationBookingRequest,
  AccommodationBookingValidationError,
} from "../.test-build/services/accommodation-booking.service.js";

const validInput = {
  accommodationId: "accom-mazandaran-01",
  checkIn: { jy: 1405, jm: 2, jd: 10 },
  checkOut: { jy: 1405, jm: 2, jd: 14 },
  adults: 2,
  children: 1,
  rooms: 1,
  maxGuests: 8,
  nights: 4,
  guestName: "علی رضایی",
  guestPhone: "09123456789",
};

test("validateAccommodationBookingInput: valid input returns no errors", () => {
  assert.deepEqual(validateAccommodationBookingInput(validInput), []);
});

test("validateAccommodationBookingInput: rejects missing dates and zero/negative nights", () => {
  const errors = validateAccommodationBookingInput({
    ...validInput,
    checkOut: null,
    nights: 0,
  });
  assert.ok(errors.some((e) => e.field === "dates"));
  assert.ok(errors.some((e) => e.field === "nights"));
});

test("validateAccommodationBookingInput: rejects over-capacity parties", () => {
  const errors = validateAccommodationBookingInput({
    ...validInput,
    adults: 10,
    children: 2,
    rooms: 1,
    maxGuests: 8,
  });
  assert.ok(errors.some((e) => e.field === "guests"));
});

test("validateAccommodationBookingInput: rooms multiply capacity", () => {
  const errors = validateAccommodationBookingInput({
    ...validInput,
    adults: 10,
    children: 2,
    rooms: 2,
    maxGuests: 8,
  });
  assert.ok(!errors.some((e) => e.field === "guests"));
});

test("validateAccommodationBookingInput: requires a guest name of at least 3 chars", () => {
  const errors = validateAccommodationBookingInput({ ...validInput, guestName: "ال" });
  assert.ok(errors.some((e) => e.field === "guestName"));
});

test("validateAccommodationBookingInput: requires a valid 09 mobile", () => {
  assert.ok(
    validateAccommodationBookingInput({ ...validInput, guestPhone: "12345" }).some(
      (e) => e.field === "guestPhone"
    )
  );
  // Persian numerals are accepted and normalized
  assert.deepEqual(
    validateAccommodationBookingInput({ ...validInput, guestPhone: "۰۹۱۲۳۴۵۶۷۸۹" }),
    []
  );
});

test("validateAccommodationBookingInput: rejects empty accommodationId", () => {
  const errors = validateAccommodationBookingInput({ ...validInput, accommodationId: "  " });
  assert.ok(errors.some((e) => e.field === "accommodationId"));
});

test("submitAccommodationBookingRequest: returns a clearly labelled pending demo result", async () => {
  const result = await submitAccommodationBookingRequest(validInput);
  assert.equal(result.status, "pending_demo");
  assert.match(result.demoReference, /^DEMO-/);
  assert.ok(result.message.includes("آزمایشی"));
  assert.ok(!Number.isNaN(Date.parse(result.submittedAt)));
});

test("submitAccommodationBookingRequest: throws AccommodationBookingValidationError on invalid input", async () => {
  await assert.rejects(
    () => submitAccommodationBookingRequest({ ...validInput, guestPhone: "x" }),
    AccommodationBookingValidationError
  );
});
