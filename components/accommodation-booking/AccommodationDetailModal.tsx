"use client";

import Image from "@/components/AppImage";
import { useState } from "react";
import { Modal } from "@/components/hotel-booking/Modal";
import {
  formatCount,
  formatPercent,
  formatRating,
  formatToman,
} from "@/components/format-utils";
import type { Accommodation } from "@/types/accommodation";
import type { AccommodationDiscountInfo } from "./AccommodationCard";

interface AccommodationDetailModalProps {
  accommodation: Accommodation;
  discount?: AccommodationDiscountInfo | null;
  open: boolean;
  onClose: () => void;
  /** شروع فرآیند رزرو — توسط کارت/گرید مدیریت می‌شود */
  onBook: () => void;
}

/**
 * Accommodation quick-detail dialog. Shows everything the mock record
 * provides — no fabricated owner info, reviews or availability.
 */
export function AccommodationDetailModal({
  accommodation,
  discount,
  open,
  onClose,
  onBook,
}: AccommodationDetailModalProps) {
  const [imageError, setImageError] = useState(false);
  const starsFilled = Math.round(accommodation.rating);

  const specs: Array<{ icon: string; label: string; value: string }> = [
    { icon: "fa-user-group", label: "ظرفیت", value: `${formatCount(accommodation.maxGuests)} نفر` },
    { icon: "fa-bed", label: "اتاق خواب", value: formatCount(accommodation.bedrooms) },
    { icon: "fa-couch", label: "تخت", value: formatCount(accommodation.beds) },
    { icon: "fa-bath", label: "سرویس بهداشتی", value: formatCount(accommodation.bathrooms) },
    { icon: "fa-right-to-bracket", label: "ساعت ورود", value: accommodation.rules.checkInTime },
    { icon: "fa-right-from-bracket", label: "ساعت خروج", value: accommodation.rules.checkOutTime },
  ];

  const rules: Array<{ label: string; value: string }> = [
    { label: "حیوان خانگی", value: accommodation.rules.petPolicy },
    { label: "سیگار کشیدن", value: accommodation.rules.smokingPolicy },
    { label: "برگزاری مراسم", value: accommodation.rules.eventPolicy },
    { label: "لغو و استرداد", value: accommodation.rules.cancellationPolicy },
    { label: "حداکثر نفرات", value: `${formatCount(accommodation.rules.maxGuests)} نفر در هر واحد` },
  ];

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={accommodation.name}
      footer={
        <div className="flex items-center justify-between gap-3 flex-wrap">
          <div>
            {discount ? (
              <>
                <div className="text-[10px] text-gray-400 line-through">
                  {formatToman(discount.originalPrice)}
                </div>
                <div className="text-base font-black text-[#d1134e]">
                  {formatToman(discount.finalPrice)}
                </div>
              </>
            ) : (
              <div className="text-base font-black text-gray-900">
                {formatToman(accommodation.pricePerNight)}
              </div>
            )}
            <div className="text-[9px] text-gray-400">هر شب · قیمت نمایشی</div>
          </div>
          <button
            type="button"
            onClick={onBook}
            className="inline-flex items-center gap-2 bg-[#e21b5b] hover:bg-[#d1134e] text-white text-xs font-bold px-6 py-3 rounded-xl transition shadow-lg shadow-[#e21b5b]/25"
          >
            <i className="fa-solid fa-calendar-check" aria-hidden="true" />
            رزرو این اقامتگاه
          </button>
        </div>
      }
    >
      <div className="relative h-48 w-full rounded-2xl overflow-hidden bg-gray-100 mb-4">
        {imageError ? (
          <div
            className="absolute inset-0 flex flex-col items-center justify-center gap-2 text-gray-400"
            role="img"
            aria-label={accommodation.name}
          >
            <i className="fa-solid fa-house-chimney text-4xl" aria-hidden="true" />
            <span className="text-[11px]">تصویر در دسترس نیست</span>
          </div>
        ) : (
          <Image
            src={accommodation.image}
            alt={accommodation.name}
            fill
            sizes="(max-width: 640px) 100vw, 512px"
            className="w-full h-full object-cover"
            onError={() => setImageError(true)}
          />
        )}
        {discount && (
          <span className="absolute top-3 right-3 bg-[#e21b5b] text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
            {formatPercent(discount.discountPercent)}
            {discount.campaignLabel ? ` ${discount.campaignLabel}` : ""}
          </span>
        )}
        <span className="absolute bottom-3 right-3 bg-black/60 text-white text-[10px] px-2 py-0.5 rounded backdrop-blur">
          {accommodation.typeLabel}
        </span>
      </div>

      <div className="flex flex-wrap items-center gap-3 text-[11px] text-gray-500 mb-3">
        <span className="inline-flex items-center gap-1">
          <i className="fa-solid fa-location-dot text-gray-400" aria-hidden="true" />
          {accommodation.location}
        </span>
      </div>

      <div className="flex items-center gap-2 mb-3">
        <div
          className="flex items-center gap-0.5 text-[#f59e0b] text-xs"
          aria-label={`امتیاز ${formatRating(accommodation.rating)} از ۵`}
        >
          {Array.from({ length: 5 }, (_, i) => (
            <i
              key={i}
              className={`fa-solid fa-star text-[11px] ${i < starsFilled ? "" : "text-gray-200"}`}
              aria-hidden="true"
            />
          ))}
        </div>
        <span className="text-xs font-black text-gray-700">
          {formatRating(accommodation.rating)}
        </span>
        <span className="text-[10px] text-gray-400">
          ({formatCount(accommodation.reviewCount)} نظر)
        </span>
      </div>

      <p className="text-xs text-gray-600 leading-6 mb-4">{accommodation.description}</p>

      <dl className="grid grid-cols-3 gap-2 mb-4">
        {specs.map((spec) => (
          <div
            key={spec.label}
            className="rounded-xl border border-gray-100 bg-gray-50 px-2 py-2 text-center"
          >
            <dt className="text-[9px] text-gray-400 inline-flex items-center gap-1">
              <i className={`fa-solid ${spec.icon} text-gray-400`} aria-hidden="true" />
              {spec.label}
            </dt>
            <dd className="text-[11px] font-bold text-gray-800 mt-0.5">{spec.value}</dd>
          </div>
        ))}
      </dl>

      {accommodation.amenities.length > 0 && (
        <div className="mb-4">
          <h3 className="text-[11px] font-bold text-gray-700 mb-2">امکانات</h3>
          <ul className="flex flex-wrap gap-2">
            {accommodation.amenities.map((amenity) => (
              <li
                key={amenity}
                className="inline-flex items-center gap-1.5 text-[10px] font-bold text-gray-600 bg-gray-50 border border-gray-200 rounded-full px-3 py-1"
              >
                <i className="fa-solid fa-check text-[#e21b5b] text-[9px]" aria-hidden="true" />
                {amenity}
              </li>
            ))}
          </ul>
        </div>
      )}

      <div>
        <h3 className="text-[11px] font-bold text-gray-700 mb-2">قوانین و شرایط</h3>
        <ul className="space-y-1.5 text-[10px] leading-5 text-gray-600">
          {rules.map((rule) => (
            <li key={rule.label} className="flex items-start gap-1.5">
              <span className="font-bold text-gray-800 shrink-0">{rule.label}:</span>
              <span>{rule.value}</span>
            </li>
          ))}
        </ul>
      </div>

      <p className="text-[9px] text-amber-800 bg-amber-50 border border-amber-200 rounded-xl px-3 py-1.5 mt-4 leading-4">
        ظرفیت، قیمت نهایی و دسترسی در لحظه تسویه و توسط میزبان اعلام می‌شود. امتیاز و تعداد نظرها مقادیر نمایشی هستند.
      </p>
    </Modal>
  );
}
