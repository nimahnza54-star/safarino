"use client";

import { useMemo, useState } from "react";
import { Modal } from "@/components/hotel-booking/Modal";
import { DateRangePicker } from "@/components/DateRangePicker";
import { calcNights, toPersianNumerals, type JalaliDate } from "@/components/jalali-utils";
import { formatToman, formatCount } from "@/components/format-utils";
import type { Accommodation } from "@/types/accommodation";
import type { AccommodationDiscountInfo } from "./AccommodationCard";
import type { AccommodationBookingFieldError } from "@/types/accommodation-booking";
import {
  AccommodationBookingValidationError,
  submitAccommodationBookingRequest,
  validateAccommodationBookingInput,
} from "@/services/accommodation-booking.service";
import { estimateStayPrice } from "@/services/stay-pricing";

interface BookingModalProps {
  accommodation: Accommodation;
  discount?: AccommodationDiscountInfo | null;
  open: boolean;
  onClose: () => void;
}

const inputClass =
  "w-full border border-gray-200 rounded-xl px-3 py-2 text-xs text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#e21b5b]/40 focus:border-[#e21b5b] placeholder-gray-400";

const stepperClass =
  "flex items-center justify-between border border-gray-200 rounded-xl px-3 py-2";

function Stepper({
  label,
  value,
  onChange,
  min,
  max,
}: {
  label: string;
  value: number;
  onChange: (next: number) => void;
  min: number;
  max: number;
}) {
  return (
    <div className={stepperClass}>
      <span className="text-[11px] text-gray-600">{label}</span>
      <span className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => onChange(Math.min(max, value + 1))}
          className="w-6 h-6 rounded-full bg-gray-100 text-xs font-bold hover:bg-gray-200"
          aria-label={`افزایش ${label}`}
        >
          +
        </button>
        <span className="text-xs font-bold w-4 text-center">{toPersianNumerals(value)}</span>
        <button
          type="button"
          onClick={() => onChange(Math.max(min, value - 1))}
          className="w-6 h-6 rounded-full bg-gray-100 text-xs font-bold hover:bg-gray-200"
          aria-label={`کاهش ${label}`}
        >
          −
        </button>
      </span>
    </div>
  );
}

/**
 * Booking-request form. Lives as a child of Modal, which renders null
 * while closed — so all local state resets naturally on each open
 * (no effect-driven reset needed).
 */
function BookingForm({
  accommodation,
  discount,
  onClose,
}: {
  accommodation: Accommodation;
  discount?: AccommodationDiscountInfo | null;
  onClose: () => void;
}) {
  const [dateRange, setDateRange] = useState("انتخاب تاریخ ورود و خروج");
  const [checkIn, setCheckIn] = useState<JalaliDate | null>(null);
  const [checkOut, setCheckOut] = useState<JalaliDate | null>(null);
  const [adults, setAdults] = useState(2);
  const [children, setChildren] = useState(0);
  const [rooms, setRooms] = useState(1);
  const [guestName, setGuestName] = useState("");
  const [guestPhone, setGuestPhone] = useState("");
  const [notes, setNotes] = useState("");
  const [errors, setErrors] = useState<AccommodationBookingFieldError[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [demoReference, setDemoReference] = useState<string | null>(null);

  const nights = checkIn && checkOut ? calcNights(checkIn, checkOut) : 0;

  const priceBreakdown = useMemo(() => {
    if (nights <= 0) return null;
    return estimateStayPrice({
      pricePerNight: discount?.originalPrice ?? accommodation.pricePerNight,
      nights,
      discountPercent: discount?.discountPercent ?? 0,
    });
  }, [nights, discount, accommodation.pricePerNight]);

  const fieldError = (field: AccommodationBookingFieldError["field"]) =>
    errors.find((error) => error.field === field)?.message;

  const handleSubmit = async () => {
    if (submitting || demoReference) return; // prevent duplicate submissions

    const input = {
      accommodationId: accommodation.id,
      checkIn,
      checkOut,
      adults,
      children,
      rooms,
      maxGuests: accommodation.maxGuests,
      nights,
      guestName,
      guestPhone,
      notes: notes.trim() || undefined,
    };

    const validationErrors = validateAccommodationBookingInput(input);
    if (validationErrors.length > 0) {
      setErrors(validationErrors);
      return;
    }

    setErrors([]);
    setSubmitting(true);
    try {
      const result = await submitAccommodationBookingRequest(input);
      setDemoReference(result.demoReference);
    } catch (error) {
      if (error instanceof AccommodationBookingValidationError) {
        setErrors(error.errors);
      } else {
        setErrors([
          {
            field: "accommodationId",
            message: "ثبت درخواست با خطا مواجه شد. لطفاً دوباره تلاش کنید.",
          },
        ]);
      }
    } finally {
      setSubmitting(false);
    }
  };

  if (demoReference) {
    return (
      <div className="text-center py-4">
        <div className="w-14 h-14 rounded-full bg-amber-50 border border-amber-200 flex items-center justify-center mx-auto mb-3">
          <i className="fa-solid fa-hourglass-half text-2xl text-amber-500" aria-hidden="true" />
        </div>
        <h3 className="text-sm font-black text-gray-800 mb-2">
          درخواست رزرو ثبت شد (نمایشی)
        </h3>
        <p className="text-[11px] text-gray-500 leading-6 mb-4">
          این یک <strong>رزرو قطعی نیست</strong>. سامانه رزرو هنوز به بک‌اند متصل نشده و هیچ
          مبلغی از شما دریافت نمی‌شود. کد پیگیری نمایشی:
        </p>
        <code
          dir="ltr"
          className="inline-block text-xs font-mono font-bold bg-gray-50 border border-gray-200 rounded-lg px-4 py-2 text-gray-700 mb-4"
        >
          {demoReference}
        </code>
        <p className="text-[9px] text-gray-400 leading-5 mb-4">
          پس از اتصال سامانه واقعی، نتیجه نهایی رزرو از طریق پیامک به شماره موبایل اعلام می‌شود.
        </p>
        <button
          type="button"
          onClick={onClose}
          className="bg-[#e21b5b] hover:bg-[#d1134e] text-white text-xs font-bold px-8 py-2.5 rounded-xl transition"
        >
          بستن
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Dates */}
      <div>
        <DateRangePicker
          value={dateRange}
          onChange={setDateRange}
          onRangeChange={(from, to) => {
            setCheckIn(from);
            setCheckOut(to);
          }}
        />
        {fieldError("dates") && (
          <p role="alert" className="text-[10px] font-bold text-red-600 mt-1.5">
            {fieldError("dates")}
          </p>
        )}
      </div>

      {/* Guests */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
        <Stepper label="بزرگسال" value={adults} onChange={setAdults} min={1} max={30} />
        <Stepper label="کودک" value={children} onChange={setChildren} min={0} max={30} />
        <Stepper label="واحد / اتاق" value={rooms} onChange={setRooms} min={1} max={10} />
      </div>
      {fieldError("guests") && (
        <p role="alert" className="text-[10px] font-bold text-red-600 -mt-2">
          {fieldError("guests")}
        </p>
      )}
      <p className="text-[10px] text-gray-400 -mt-2">
        ظرفیت این اقامتگاه {formatCount(accommodation.maxGuests)} نفر در هر واحد است.
      </p>

      {/* Price breakdown */}
      <div className="rounded-2xl border border-gray-100 bg-gray-50 p-3 text-[11px]">
        {priceBreakdown ? (
          <dl className="space-y-1.5">
            <div className="flex justify-between text-gray-500">
              <dt>تعداد شب‌ها</dt>
              <dd>{toPersianNumerals(priceBreakdown.nights)} شب</dd>
            </div>
            <div className="flex justify-between text-gray-500">
              <dt>نرخ هر شب</dt>
              <dd>{formatToman(priceBreakdown.nightlyRate)}</dd>
            </div>
            <div className="flex justify-between text-gray-500">
              <dt>جمع اقامت</dt>
              <dd>{formatToman(priceBreakdown.baseTotal)}</dd>
            </div>
            {priceBreakdown.discountAmount > 0 && (
              <div className="flex justify-between text-[#d1134e]">
                <dt>تخفیف {toPersianNumerals(priceBreakdown.discountPercent)}٪</dt>
                <dd>− {formatToman(priceBreakdown.discountAmount)}</dd>
              </div>
            )}
            <div className="flex justify-between border-t border-gray-200 pt-1.5 font-black text-gray-900">
              <dt>جمع کل تخمینی</dt>
              <dd>{formatToman(priceBreakdown.total)}</dd>
            </div>
            <p className="text-[9px] text-amber-800 pt-1 leading-4">
              مبلغ تخمینی است؛ هزینه‌های جانبی احتمالی میزبان و مبلغ نهایی در تسویه اعلام می‌شود.
              قیمت‌ها نمایشی هستند.
            </p>
          </dl>
        ) : (
          <p className="text-gray-400 text-center py-2">
            پس از انتخاب تاریخ ورود و خروج، تخمین قیمت نمایش داده می‌شود.
          </p>
        )}
      </div>

      {/* Contact form */}
      <div className="space-y-2">
        <label className="block text-[11px] font-bold text-gray-600" htmlFor="booking-guest-name">
          نام و نام خانوادگی مسافر *
        </label>
        <input
          id="booking-guest-name"
          type="text"
          value={guestName}
          onChange={(event) => setGuestName(event.target.value)}
          placeholder="مثال: علی رضایی"
          className={inputClass}
          autoComplete="name"
        />
        {fieldError("guestName") && (
          <p role="alert" className="text-[10px] font-bold text-red-600">
            {fieldError("guestName")}
          </p>
        )}

        <label className="block text-[11px] font-bold text-gray-600" htmlFor="booking-guest-phone">
          شماره موبایل *
        </label>
        <input
          id="booking-guest-phone"
          type="tel"
          dir="ltr"
          inputMode="numeric"
          value={guestPhone}
          onChange={(event) => setGuestPhone(event.target.value)}
          placeholder="09xxxxxxxxx"
          className={`${inputClass} text-left`}
          autoComplete="tel"
        />
        {fieldError("guestPhone") && (
          <p role="alert" className="text-[10px] font-bold text-red-600">
            {fieldError("guestPhone")}
          </p>
        )}

        <label className="block text-[11px] font-bold text-gray-600" htmlFor="booking-notes">
          توضیحات (اختیاری)
        </label>
        <textarea
          id="booking-notes"
          value={notes}
          onChange={(event) => setNotes(event.target.value)}
          placeholder="مثلاً: ساعت ورود، درخواست تخت اضافه، ..."
          className={`${inputClass} min-h-16`}
          rows={2}
        />
      </div>

      <button
        type="button"
        onClick={handleSubmit}
        disabled={submitting}
        className="w-full inline-flex items-center justify-center gap-2 bg-[#e21b5b] hover:bg-[#d1134e] disabled:opacity-60 disabled:cursor-not-allowed text-white text-xs font-bold py-3.5 rounded-2xl transition shadow-lg shadow-[#e21b5b]/25"
      >
        {submitting ? (
          <>
            <i className="fa-solid fa-circle-notch fa-spin" aria-hidden="true" />
            در حال ثبت درخواست…
          </>
        ) : (
          <>
            <i className="fa-solid fa-paper-plane" aria-hidden="true" />
            ثبت درخواست رزرو (نمایشی)
          </>
        )}
      </button>
      <p className="text-[9px] text-gray-400 text-center leading-4">
        با توجه به عدم اتصال به سامانه واقعی، این فرم فقط یک درخواست نمایشی ثبت می‌کند و
        رزرو یا پرداختی انجام نمی‌شود.
      </p>
    </div>
  );
}

/**
 * Booking-request flow (frontend only).
 *
 * There is no real booking backend yet — submitting produces a clearly
 * labelled pending/demo result, never a confirmed reservation. The submit
 * path goes through services/accommodation-booking.service.ts, which is
 * the seam for the future real API.
 */
export function BookingModal({ accommodation, discount, open, onClose }: BookingModalProps) {
  return (
    <Modal open={open} onClose={onClose} title={`رزرو: ${accommodation.name}`}>
      {/* Modal renders null while closed, so the form's state resets on each open. */}
      <BookingForm accommodation={accommodation} discount={discount} onClose={onClose} />
    </Modal>
  );
}
