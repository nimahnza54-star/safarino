"use client";

import Image from "@/components/AppImage";
import { useFavorites } from "@/hooks/useFavorites";
import { formatCount, formatPercent, formatRating, formatToman } from "@/components/format-utils";
import { useState } from "react";
import type { Accommodation } from "@/types/accommodation";
import { AccommodationDetailModal } from "./AccommodationDetailModal";
import { BookingModal } from "./BookingModal";

export type AccommodationCardVariant = "best" | "firstBooking" | "loyalty" | "lastMinute";

export interface AccommodationDiscountInfo {
  originalPrice: number;
  finalPrice: number;
  discountPercent: number;
  campaignLabel?: string;
}

interface AccommodationCardProps {
  accommodation: Accommodation;
  variant: AccommodationCardVariant;
  /** Campaign short label shown next to the price row (discount variants). */
  campaignLabel?: string;
  discountPercent?: number;
  originalPrice?: number;
  finalPrice?: number;
}

const VARIANT_STYLES: Record<Exclude<AccommodationCardVariant, "best">, string> = {
  firstBooking: "bg-[#e21b5b]",
  loyalty: "bg-amber-500",
  lastMinute: "bg-red-600",
};

export function AccommodationCard({
  accommodation,
  variant,
  campaignLabel,
  discountPercent,
  originalPrice,
  finalPrice,
}: AccommodationCardProps) {
  const { isFavorite, toggleFavorite, hydrated } = useFavorites();
  const [imageError, setImageError] = useState(false);
  const [detailOpen, setDetailOpen] = useState(false);
  const [bookingOpen, setBookingOpen] = useState(false);

  const isDiscount = variant !== "best";
  const favorite = hydrated && isFavorite(accommodation.id);
  const starsFilled = Math.round(accommodation.rating);

  const discount: AccommodationDiscountInfo | null =
    isDiscount && originalPrice !== undefined && finalPrice !== undefined && discountPercent !== undefined
      ? { originalPrice, finalPrice, discountPercent, campaignLabel }
      : null;

  return (
    <article
      data-testid={`accommodation-card-${accommodation.id}`}
      className="bg-white rounded-2xl overflow-hidden border border-gray-200 shadow-sm hover:shadow-md transition flex flex-col"
    >
      <div className="relative h-48 bg-gray-100">
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
            className="w-full h-full object-cover"
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
            onError={() => setImageError(true)}
          />
        )}

        <button
          type="button"
          onClick={() => toggleFavorite(accommodation.id)}
          aria-pressed={favorite}
          aria-label={
            favorite
              ? `${accommodation.name} از علاقه‌مندی‌ها حذف شود`
              : `${accommodation.name} به علاقه‌مندی‌ها افزوده شود`
          }
          title={favorite ? "حذف از علاقه‌مندی‌ها" : "افزودن به علاقه‌مندی‌ها"}
          className="absolute top-3 left-3 w-8 h-8 rounded-full bg-white/80 hover:bg-white flex items-center justify-center transition shadow-sm"
        >
          <i
            className={`${
              favorite ? "fa-solid text-[#e21b5b]" : "fa-regular text-gray-700"
            } fa-heart text-sm`}
            aria-hidden="true"
          />
        </button>

        {discount && (
          <div
            className={`absolute top-3 right-3 ${VARIANT_STYLES[variant as Exclude<AccommodationCardVariant, "best">]} text-white text-[10px] font-bold px-2 py-0.5 rounded-full`}
          >
            {formatPercent(discount.discountPercent)}
          </div>
        )}

        <span className="absolute bottom-3 right-3 bg-black/60 text-white text-[10px] px-2 py-0.5 rounded backdrop-blur">
          {accommodation.typeLabel}
        </span>
      </div>

      <div className="p-4 flex flex-col flex-1">
        <div className="flex items-center gap-2 mb-1">
          <div
            className="flex items-center gap-0.5 text-[#f59e0b] text-xs"
            aria-label={`امتیاز ${formatRating(accommodation.rating)} از ۵`}
          >
            {Array.from({ length: 5 }, (_, i) => (
              <i
                key={i}
                className={`fa-solid fa-star text-[10px] ${
                  i < starsFilled ? "" : "text-gray-200"
                }`}
                aria-hidden="true"
              />
            ))}
          </div>
          <span className="text-[10px] font-bold text-gray-500">
            {formatRating(accommodation.rating)}
          </span>
          <span className="text-[10px] text-gray-400">
            ({formatCount(accommodation.reviewCount)} نظر)
          </span>
        </div>

        <h4 className="font-black text-sm text-gray-900 mb-1">
          <button
            type="button"
            onClick={() => setDetailOpen(true)}
            aria-haspopup="dialog"
            className="text-right line-clamp-1 hover:text-[#e21b5b] transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#e21b5b] rounded"
          >
            {accommodation.name}
          </button>
        </h4>
        <p className="text-[11px] text-gray-400 mb-2">{accommodation.location}</p>
        <p className="text-[11px] text-gray-500 leading-relaxed line-clamp-2 mb-3">
          {accommodation.description}
        </p>

        <div className="mt-auto pt-2 border-t border-gray-100">
          <div className="flex items-end justify-between gap-2">
            <div className="min-w-0">
              {discount && (
                <div className="text-[10px] text-gray-400 line-through">
                  {formatToman(discount.originalPrice)}
                </div>
              )}
              <div className={`text-xs font-black ${discount ? "text-[#d1134e]" : "text-gray-900"}`}>
                {formatToman(discount?.finalPrice ?? accommodation.pricePerNight)}
              </div>
              <div className="text-[9px] text-gray-400">هر شب</div>
            </div>
            <div className="flex flex-col items-end gap-1">
              {discount?.campaignLabel && (
                <span className="text-[10px] font-bold text-gray-500">
                  {discount.campaignLabel}
                </span>
              )}
              <button
                type="button"
                onClick={() => setDetailOpen(true)}
                className="text-[10px] font-bold text-[#0070cd] hover:underline shrink-0"
              >
                جزئیات
              </button>
            </div>
          </div>
        </div>
      </div>

      <AccommodationDetailModal
        accommodation={accommodation}
        discount={discount}
        open={detailOpen}
        onClose={() => setDetailOpen(false)}
        onBook={() => {
          setDetailOpen(false);
          setBookingOpen(true);
        }}
      />
      <BookingModal
        accommodation={accommodation}
        discount={discount}
        open={bookingOpen}
        onClose={() => setBookingOpen(false)}
      />
    </article>
  );
}
