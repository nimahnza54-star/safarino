"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useFavorites } from "@/hooks/useFavorites";
import { getAccommodations, sortAccommodations, type AccommodationSort } from "@/services/accommodations.service";
import {
  ACCOMMODATION_CITY_CATEGORIES,
  ACCOMMODATION_TYPE_CATEGORIES,
  type AccommodationCityCategoryId,
  type AccommodationTypeCategoryId,
} from "@/mock/accommodations/accommodation-categories.mock";
import { AccommodationGrid, type GridStatus } from "./AccommodationGrid";
import { toPersianNumerals } from "@/components/jalali-utils";
import type { Accommodation } from "@/types/accommodation";

const SORT_OPTIONS: Array<{ value: AccommodationSort; label: string }> = [
  { value: "recommended", label: "پیشنهاد سفرینو" },
  { value: "priceAsc", label: "ارزان‌ترین" },
  { value: "priceDesc", label: "گران‌ترین" },
  { value: "rating", label: "بیشترین امتیاز" },
  { value: "popular", label: "محبوب‌ترین" },
];

interface AccommodationExplorerSectionProps {
  city: AccommodationCityCategoryId;
  type: AccommodationTypeCategoryId;
  onCityChange: (city: AccommodationCityCategoryId) => void;
  onTypeChange: (type: AccommodationTypeCategoryId) => void;
}

/**
 * «همه اقامتگاه‌ها» — browse/filter workspace for the whole mock dataset.
 * City, type, favorites and sort compose; the count always reflects the
 * visible collection. Reuses one dataset — no per-filter copies.
 */
export function AccommodationExplorerSection({
  city,
  type,
  onCityChange,
  onTypeChange,
}: AccommodationExplorerSectionProps) {
  const { favoriteIds, hydrated } = useFavorites();
  const [accommodations, setAccommodations] = useState<Accommodation[]>([]);
  const [status, setStatus] = useState<GridStatus>("loading");
  const [reloadToken, setReloadToken] = useState(0);
  const [sort, setSort] = useState<AccommodationSort>("recommended");
  const [favoritesOnly, setFavoritesOnly] = useState(false);

  useEffect(() => {
    let alive = true;
    getAccommodations()
      .then((data) => {
        if (!alive) return;
        setAccommodations(data);
        setStatus("success");
      })
      .catch(() => {
        if (alive) setStatus("error");
      });
    return () => {
      alive = false;
    };
  }, [reloadToken]);

  const retry = useCallback(() => {
    setStatus("loading");
    setReloadToken((token) => token + 1);
  }, []);

  const filtered = useMemo(() => {
    let next = accommodations;
    if (city !== "all") next = next.filter((item) => item.city === city);
    if (type !== "all") next = next.filter((item) => item.type === type);
    if (favoritesOnly && hydrated) {
      next = next.filter((item) => favoriteIds.has(item.id));
    }
    return sortAccommodations(next, sort);
  }, [accommodations, city, type, favoritesOnly, hydrated, favoriteIds, sort]);

  const resetFilters = useCallback(() => {
    onCityChange("all");
    onTypeChange("all");
    setFavoritesOnly(false);
    setSort("recommended");
  }, [onCityChange, onTypeChange]);

  const chipClass = (active: boolean) =>
    `flex items-center gap-2 whitespace-nowrap text-[11px] font-bold rounded-xl border px-3 py-2 transition-all ${
      active
        ? "border-[#e21b5b] bg-[#e21b5b]/10 text-[#e21b5b]"
        : "border-gray-200 text-gray-600 hover:border-[#e21b5b] hover:text-[#e21b5b]"
    }`;

  return (
    <section
      id="accommodation-explorer"
      className="py-10 bg-gray-50"
      aria-labelledby="accommodation-explorer-title"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
          <div>
            <h3 id="accommodation-explorer-title" className="text-xl font-black text-gray-900">
              همه اقامتگاه‌ها
            </h3>
            <p className="text-[11px] text-gray-500 mt-1">
              {status === "success"
                ? `${toPersianNumerals(filtered.length)} اقامتگاه مطابق فیلترها`
                : "در حال بارگذاری اقامتگاه‌ها…"}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setFavoritesOnly((prev) => !prev)}
              aria-pressed={favoritesOnly}
              className={`inline-flex items-center gap-1.5 text-[11px] font-bold rounded-xl border px-3 py-2 transition-all ${
                favoritesOnly
                  ? "border-[#e21b5b] bg-[#e21b5b]/10 text-[#e21b5b]"
                  : "border-gray-200 text-gray-600 hover:border-[#e21b5b] hover:text-[#e21b5b]"
              }`}
            >
              <i className={`fa-heart ${favoritesOnly ? "fa-solid" : "fa-regular"}`} aria-hidden="true" />
              علاقه‌مندی‌های من
              {hydrated && (
                <span className="text-[10px] bg-gray-100 rounded-full px-1.5">
                  {toPersianNumerals(favoriteIds.size)}
                </span>
              )}
            </button>

            <label className="inline-flex items-center gap-1.5 text-[11px] font-bold text-gray-600">
              <span className="sr-only">مرتب‌سازی</span>
              <i className="fa-solid fa-arrow-down-wide-short text-gray-400" aria-hidden="true" />
              <select
                value={sort}
                onChange={(event) => setSort(event.target.value as AccommodationSort)}
                className="border border-gray-200 rounded-xl px-2 py-2 text-[11px] font-bold text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#e21b5b]/40 focus:border-[#e21b5b] bg-white"
                aria-label="مرتب‌سازی نتایج"
              >
                {SORT_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </label>
          </div>
        </div>

        {/* City filter */}
        <div className="flex gap-2 overflow-x-auto pb-2 mb-2 no-scrollbar" role="group" aria-label="فیلتر بر اساس مقصد">
          {ACCOMMODATION_CITY_CATEGORIES.map((category) => (
            <button
              key={category.id}
              type="button"
              onClick={() => onCityChange(category.id)}
              aria-pressed={city === category.id}
              className={chipClass(city === category.id)}
            >
              <i className={`fa-solid ${category.icon}`} aria-hidden="true" />
              {category.label}
            </button>
          ))}
        </div>

        {/* Type filter */}
        <div className="flex gap-2 overflow-x-auto pb-3 mb-6 no-scrollbar" role="group" aria-label="فیلتر بر اساس نوع اقامتگاه">
          {ACCOMMODATION_TYPE_CATEGORIES.map((category) => (
            <button
              key={category.id}
              type="button"
              onClick={() => onTypeChange(category.id)}
              aria-pressed={type === category.id}
              className={chipClass(type === category.id)}
            >
              <i className={`fa-solid ${category.icon}`} aria-hidden="true" />
              {category.label}
            </button>
          ))}
        </div>

        {filtered.length === 0 && status === "success" ? (
          <div className="text-center py-12">
            <i className="fa-regular fa-heart text-4xl text-gray-300 mb-3" aria-hidden="true" />
            <p className="text-sm font-bold text-gray-700 mb-1">
              {favoritesOnly ? "هنوز اقامتگاهی به علاقه‌مندی‌ها اضافه نکرده‌اید" : "اقامتگاهی با این فیلترها یافت نشد"}
            </p>
            <p className="text-xs text-gray-500 mb-4">فیلترها را تغییر دهید یا پاک کنید.</p>
            <button
              type="button"
              onClick={resetFilters}
              className="inline-flex items-center gap-2 bg-[#e21b5b] hover:bg-[#d1134e] text-white text-xs font-bold px-6 py-2.5 rounded-xl transition"
            >
              <i className="fa-solid fa-rotate-left" aria-hidden="true" />
              پاک‌کردن فیلترها
            </button>
          </div>
        ) : (
          <AccommodationGrid
            accommodations={filtered}
            variant="best"
            status={status}
            onRetry={retry}
          />
        )}
      </div>
    </section>
  );
}
