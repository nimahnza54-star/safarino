"use client";

import { HotelCard, type HotelCardVariant } from "./HotelCard";
import type { Hotel } from "@/types/hotel";
import type { DiscountedHotel } from "@/types/campaign";

function isDiscountedHotel(hotel: Hotel | DiscountedHotel): hotel is DiscountedHotel {
  return "finalPricePerNight" in hotel;
}

export type GridStatus = "loading" | "success" | "error";

interface HotelGridProps {
  hotels: Array<Hotel | DiscountedHotel>;
  variant: HotelCardVariant;
  status?: GridStatus;
  campaignLabel?: string;
  /** Message shown when status === "error". */
  errorMessage?: string;
  onRetry?: () => void;
  emptyTitle?: string;
  emptyDescription?: string;
}

export function HotelGrid({
  hotels,
  variant,
  status = "success",
  campaignLabel,
  errorMessage = "خطا در دریافت فهرست هتل‌ها. لطفاً دوباره تلاش کنید.",
  onRetry,
  emptyTitle = "هتلی با این مشخصات یافت نشد",
  emptyDescription = "می‌توانید معیار جستجو را تغییر دهید یا فیلترها را پاک کنید.",
}: HotelGridProps) {
  if (status === "loading") {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6" aria-busy="true">
        {Array.from({ length: 4 }, (_, i) => (
          <div
            key={`skeleton-${i}`}
            className="bg-white rounded-2xl border border-gray-200 overflow-hidden animate-pulse"
          >
            <div className="h-48 bg-gray-200" />
            <div className="p-4 space-y-2">
              <div className="h-3 bg-gray-200 rounded w-1/3" />
              <div className="h-4 bg-gray-200 rounded w-2/3" />
              <div className="h-3 bg-gray-200 rounded w-1/2" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (status === "error") {
    return (
      <div className="text-center py-12" role="alert">
        <i className="fa-solid fa-triangle-exclamation text-3xl text-amber-500 mb-3" aria-hidden="true" />
        <p className="text-sm font-bold text-gray-700 mb-1">مشکلی پیش آمد</p>
        <p className="text-xs text-gray-500 mb-4">{errorMessage}</p>
        {onRetry && (
          <button
            type="button"
            onClick={onRetry}
            className="inline-flex items-center gap-2 bg-[#e21b5b] hover:bg-[#d1134e] text-white text-xs font-bold px-6 py-2.5 rounded-xl transition"
          >
            <i className="fa-solid fa-rotate-right" aria-hidden="true" />
            تلاش دوباره
          </button>
        )}
      </div>
    );
  }

  if (hotels.length === 0) {
    return (
      <div className="text-center py-12">
        <i className="fa-solid fa-hotel text-4xl text-gray-300 mb-3" aria-hidden="true" />
        <p className="text-sm font-bold text-gray-700 mb-1">{emptyTitle}</p>
        <p className="text-xs text-gray-500">{emptyDescription}</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {hotels.map((hotel) => {
        if (isDiscountedHotel(hotel)) {
          return (
            <HotelCard
              key={hotel.id}
              hotel={hotel}
              variant={variant}
              campaignLabel={campaignLabel}
              discountPercent={hotel.discountPercent}
              originalPrice={hotel.originalPricePerNight}
              finalPrice={hotel.finalPricePerNight}
            />
          );
        }
        return <HotelCard key={hotel.id} hotel={hotel} variant={variant} />;
      })}
    </div>
  );
}
