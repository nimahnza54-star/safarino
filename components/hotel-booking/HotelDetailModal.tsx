"use client";

import Image from "@/components/AppImage";
import { useState } from "react";
import { Modal } from "./Modal";
import {
  formatCount,
  formatPercent,
  formatRating,
  formatToman,
} from "@/components/format-utils";
import type { Hotel } from "@/types/hotel";

export interface DiscountInfo {
  originalPrice: number;
  finalPrice: number;
  discountPercent: number;
  campaignLabel?: string;
}

interface HotelDetailModalProps {
  hotel: Hotel;
  discount?: DiscountInfo | null;
  open: boolean;
  onClose: () => void;
}

/**
 * Hotel quick-detail dialog — the "detail interaction" used everywhere a
 * hotel is shown, since no hotel detail route exists in this frontend.
 * Shows everything structured data provides; promises no fake booking flow.
 */
export function HotelDetailModal({
  hotel,
  discount,
  open,
  onClose,
}: HotelDetailModalProps) {
  const [imageError, setImageError] = useState(false);
  const starsFilled = Math.round(hotel.rating);

  return (
    <Modal open={open} onClose={onClose} title={hotel.name}>
      <div className="relative h-40 w-full rounded-2xl overflow-hidden bg-gray-100 mb-4">
        {imageError ? (
          <div
            className="absolute inset-0 flex flex-col items-center justify-center gap-2 text-gray-400"
            role="img"
            aria-label={hotel.name}
          >
            <i className="fa-solid fa-hotel text-4xl" aria-hidden="true" />
            <span className="text-[11px]">تصویر در دسترس نیست</span>
          </div>
        ) : (
          <Image
            src={hotel.image}
            alt={hotel.name}
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
      </div>

      <div className="flex flex-wrap items-center gap-3 text-[11px] text-gray-500 mb-3">
        <span className="inline-flex items-center gap-1">
          <i className="fa-solid fa-location-dot text-gray-400" aria-hidden="true" />
          {hotel.location}
        </span>
        <span className="inline-flex items-center gap-1">
          <i className="fa-solid fa-user-group text-gray-400" aria-hidden="true" />
          ظرفیت تا {formatCount(hotel.maxGuests)} مهمان در هر اتاق
        </span>
      </div>

      <div className="flex items-center gap-2 mb-3">
        <div
          className="flex items-center gap-0.5 text-[#f59e0b] text-xs"
          aria-label={`امتیاز ${formatRating(hotel.rating)} از ۵`}
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
          {formatRating(hotel.rating)}
        </span>
        <span className="text-[10px] text-gray-400">
          ({formatCount(hotel.reviewCount)} نظر)
        </span>
      </div>

      <p className="text-xs text-gray-600 leading-6 mb-4">{hotel.description}</p>

      {hotel.amenities.length > 0 && (
        <ul className="flex flex-wrap gap-2 mb-4">
          {hotel.amenities.map((amenity) => (
            <li
              key={amenity}
              className="inline-flex items-center gap-1.5 text-[10px] font-bold text-gray-600 bg-gray-50 border border-gray-200 rounded-full px-3 py-1"
            >
              <i className="fa-solid fa-check text-[#e21b5b] text-[9px]" aria-hidden="true" />
              {amenity}
            </li>
          ))}
        </ul>
      )}

      <div className="border-t border-gray-100 pt-4 flex flex-wrap items-end justify-between gap-3">
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
              {formatToman(hotel.pricePerNight)}
            </div>
          )}
          <div className="text-[9px] text-gray-400">هر شب</div>
        </div>
        <p className="text-[9px] text-amber-800 bg-amber-50 border border-amber-200 rounded-xl px-3 py-1.5 max-w-52 leading-4">
          ظرفیت و قیمت نهایی در لحظه تسویه توسط هتل اعلام می‌شود.
        </p>
      </div>
    </Modal>
  );
}
