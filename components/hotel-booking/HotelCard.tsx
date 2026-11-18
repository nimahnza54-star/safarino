"use client";

import { useState } from "react";
import Image from "@/components/AppImage";
import { useFavorites } from "@/hooks/useFavorites";
import { formatCount, formatPercent, formatRating, formatToman } from "@/components/format-utils";
import { HotelDetailModal } from "./HotelDetailModal";
import type { Hotel } from "@/types/hotel";

export type HotelCardVariant = "best" | "firstBooking" | "loyalty" | "lastMinute";

interface HotelCardProps {
  hotel: Hotel;
  variant: HotelCardVariant;
  /** Campaign short label shown next to the price row (discount variants). */
  campaignLabel?: string;
  /** Campaign discount percentage for the badge; undefined hides the badge. */
  discountPercent?: number;
  originalPrice?: number;
  finalPrice?: number;
}

const VARIANT_STYLES: Record<Exclude<HotelCardVariant, "best">, string> = {
  firstBooking: "bg-[#e21b5b]",
  loyalty: "bg-amber-500",
  lastMinute: "bg-red-600",
};

export function HotelCard({
  hotel,
  variant,
  campaignLabel,
  discountPercent,
  originalPrice,
  finalPrice,
}: HotelCardProps) {
  const { isFavorite, toggleFavorite, hydrated } = useFavorites();
  const [imageError, setImageError] = useState(false);
  const [detailOpen, setDetailOpen] = useState(false);

  const isDiscount = variant !== "best";
  const favorite = hydrated && isFavorite(hotel.id);
  const starsFilled = Math.round(hotel.rating);

  return (
    <article
      data-testid={`hotel-card-${hotel.id}`}
      className="bg-white rounded-2xl overflow-hidden border border-gray-200 shadow-sm hover:shadow-md transition flex flex-col"
    >
      <div className="relative h-48 bg-gray-100">
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
            className="w-full h-full object-cover"
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
            onError={() => setImageError(true)}
          />
        )}

        <button
          type="button"
          onClick={() => toggleFavorite(hotel.id)}
          aria-pressed={favorite}
          aria-label={
            favorite
              ? `${hotel.name} از علاقه‌مندی‌ها حذف شود`
              : `${hotel.name} به علاقه‌مندی‌ها افزوده شود`
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

        {isDiscount && discountPercent !== undefined && (
          <div
            className={`absolute top-3 right-3 ${VARIANT_STYLES[variant as Exclude<HotelCardVariant, "best">]} text-white text-[10px] font-bold px-2 py-0.5 rounded-full`}
          >
            {formatPercent(discountPercent)}
          </div>
        )}
      </div>

      <div className="p-4 flex flex-col flex-1">
        <div className="flex items-center gap-2 mb-1">
          <div
            className="flex items-center gap-0.5 text-[#f59e0b] text-xs"
            aria-label={`امتیاز ${formatRating(hotel.rating)} از ۵`}
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
            {formatRating(hotel.rating)}
          </span>
          <span className="text-[10px] text-gray-400">
            ({formatCount(hotel.reviewCount)} نظر)
          </span>
        </div>

        <h4 className="font-black text-sm text-gray-900 mb-1">
          <button
            type="button"
            onClick={() => setDetailOpen(true)}
            aria-haspopup="dialog"
            className="text-right line-clamp-1 hover:text-[#e21b5b] transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#e21b5b] rounded"
          >
            {hotel.name}
          </button>
        </h4>
        <p className="text-[11px] text-gray-400 mb-2">{hotel.location}</p>
        <p className="text-[11px] text-gray-500 leading-relaxed line-clamp-2 mb-3">
          {hotel.description}
        </p>

        <div className="mt-auto pt-2 border-t border-gray-100">
          {isDiscount && originalPrice !== undefined && finalPrice !== undefined ? (
            <div className="flex items-end justify-between gap-2">
              <div className="min-w-0">
                <div className="text-[10px] text-gray-400 line-through">
                  {formatToman(originalPrice)}
                </div>
                <div className="text-xs font-black text-[#d1134e]">
                  {formatToman(finalPrice)}
                </div>
                <div className="text-[9px] text-gray-400">هر شب</div>
              </div>
              <div className="flex flex-col items-end gap-1">
                {campaignLabel && (
                  <span className="text-[10px] font-bold text-gray-500">
                    {campaignLabel}
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
          ) : (
            <div className="flex items-end justify-between gap-2">
              <div>
                <div className="text-xs font-black text-gray-900">
                  {formatToman(hotel.pricePerNight)}
                </div>
                <div className="text-[9px] text-gray-400">هر شب</div>
              </div>
              <button
                type="button"
                onClick={() => setDetailOpen(true)}
                className="text-[10px] font-bold text-[#0070cd] hover:underline shrink-0"
              >
                جزئیات
              </button>
            </div>
          )}
        </div>
      </div>

      <HotelDetailModal
        hotel={hotel}
        open={detailOpen}
        onClose={() => setDetailOpen(false)}
        discount={
          isDiscount && originalPrice !== undefined && finalPrice !== undefined && discountPercent !== undefined
            ? {
                originalPrice,
                finalPrice,
                discountPercent,
                campaignLabel,
              }
            : null
        }
      />
    </article>
  );
}
