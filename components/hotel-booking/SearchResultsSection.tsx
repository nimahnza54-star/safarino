"use client";

import { formatJalaliDate, toPersianNumerals } from "@/components/jalali-utils";
import { HotelGrid, type GridStatus } from "./HotelGrid";
import type { Hotel } from "@/types/hotel";
import type { SearchCriteria } from "@/types/search";

interface SearchResultsSectionProps {
  criteria: SearchCriteria;
  results: Hotel[];
  status: GridStatus;
  errorMessage?: string | null;
  onRetry: () => void;
  onClear: () => void;
}

/**
 * Results panel shown directly under the search box after a search.
 * Dates and guest counts are echoed back for transparency; availability
 * itself is not represented in the mock dataset, so the panel states
 * that limitation explicitly instead of pretending rooms are bookable.
 */
export function SearchResultsSection({
  criteria,
  results,
  status,
  errorMessage,
  onRetry,
  onClear,
}: SearchResultsSectionProps) {
  const destinationLabel = criteria.destination.trim() || "همه مقصدها";
  const guests = criteria.adults + criteria.children;
  const dateLabel =
    criteria.checkIn && criteria.checkOut
      ? `${formatJalaliDate(criteria.checkIn.jy, criteria.checkIn.jm, criteria.checkIn.jd)} تا ${formatJalaliDate(criteria.checkOut.jy, criteria.checkOut.jm, criteria.checkOut.jd)}`
      : null;

  return (
    <section className="bg-white border-b border-gray-100" aria-label="نتیجه جستجوی هتل">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
          <div className="min-w-0">
            <h2 className="text-sm sm:text-base font-black text-gray-900">
              نتیجه جستجو برای «{destinationLabel}»
            </h2>
            <p className="text-[11px] text-gray-500 mt-1 flex flex-wrap items-center gap-x-3 gap-y-1">
              <span>
                {status === "success" &&
                  `${toPersianNumerals(results.length)} هتل مطابق معیار شما یافت شد`}
                {status === "loading" && "در حال جستجو…"}
                {status === "error" && "خطا در جستجو"}
              </span>
              <span>{toPersianNumerals(guests)} مسافر · {toPersianNumerals(criteria.rooms)} اتاق</span>
              {dateLabel && <span>{dateLabel}</span>}
            </p>
          </div>
          <button
            type="button"
            onClick={onClear}
            className="inline-flex items-center gap-2 text-[11px] font-bold text-gray-600 hover:text-[#e21b5b] border border-gray-200 hover:border-[#e21b5b] rounded-xl px-4 py-2 transition-all"
          >
            <i className="fa-solid fa-xmark" aria-hidden="true" />
            پاک‌کردن فیلترها
          </button>
        </div>

        <p className="text-[10px] text-amber-700 bg-amber-50 border border-amber-200 rounded-xl px-3 py-2 mb-4 inline-flex items-center gap-2">
          <i className="fa-solid fa-circle-info" aria-hidden="true" />
          ظرفیت و قیمت دقیق اتاق‌ها در لحظه تسویه توسط هتل اعلام می‌شود؛ این فهرست بر اساس داده نمایشی تهیه شده است.
        </p>

        <HotelGrid
          hotels={results}
          variant="best"
          status={status}
          errorMessage={errorMessage ?? undefined}
          onRetry={onRetry}
          emptyTitle="هتلی با این مشخصات یافت نشد"
          emptyDescription="مقصد یا معیارهای جستجو را تغییر دهید و دوباره جستجو کنید."
        />
      </div>
    </section>
  );
}
