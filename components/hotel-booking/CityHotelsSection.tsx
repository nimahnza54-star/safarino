"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { getHotels } from "@/services/hotels.service";
import { HOTEL_CITY_CATEGORIES, type CityCategoryId } from "@/mock/hotels/hotel-categories.mock";
import { useFavorites } from "@/hooks/useFavorites";
import { toPersianNumerals } from "@/components/jalali-utils";
import { HotelGrid, type GridStatus } from "./HotelGrid";
import type { Hotel } from "@/types/hotel";

/**
 * «شهرهای پرطرفدار» — city filter chips above the hotel grid.
 * Also hosts the favorites view: toggling «علاقه‌مندی‌های من» filters the
 * grid to favorited hotels across all cities.
 */
export function CityHotelsSection() {
  const [hotels, setHotels] = useState<Hotel[]>([]);
  const [status, setStatus] = useState<GridStatus>("loading");
  const [selectedCity, setSelectedCity] = useState<CityCategoryId>("all");
  const [favoritesOnly, setFavoritesOnly] = useState(false);
  const [reloadToken, setReloadToken] = useState(0);
  const { isFavorite, count: favoritesCount } = useFavorites();

  useEffect(() => {
    let alive = true;
    getHotels()
      .then((data) => {
        if (!alive) return;
        setHotels(data);
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

  const visibleHotels = useMemo(
    () =>
      hotels.filter((hotel) => {
        if (favoritesOnly && !isFavorite(hotel.id)) return false;
        if (!favoritesOnly && selectedCity !== "all" && hotel.city !== selectedCity)
          return false;
        return true;
      }),
    [hotels, favoritesOnly, selectedCity, isFavorite]
  );

  const emptyCopy = favoritesOnly
    ? {
        title: "هنوز هتلی به علاقه‌مندی‌ها اضافه نکرده‌اید",
        description: "روی آیکون قلب روی هر کارت هتل بزنید تا اینجا نمایش داده شود.",
      }
    : {
        title: "هتلی در این شهر یافت نشد",
        description: "شهر دیگری را انتخاب کنید یا همه هتل‌ها را ببینید.",
      };

  return (
    <div className="mt-12">
      {/* City chips */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-9 gap-3">
        {HOTEL_CITY_CATEGORIES.map((category) => {
          const active = !favoritesOnly && selectedCity === category.id;
          return (
            <button
              key={category.id}
              type="button"
              aria-pressed={active}
              onClick={() => {
                setSelectedCity(category.id);
                setFavoritesOnly(false);
              }}
              className={`flex flex-col items-center justify-center gap-1.5 p-3 rounded-2xl border text-[10px] sm:text-[11px] font-bold transition-all ${
                active
                  ? "bg-[#e21b5b]/10 border-[#e21b5b] text-[#e21b5b] shadow-sm"
                  : "bg-gray-50 border-gray-200 text-gray-700 hover:border-[#e21b5b] hover:text-[#e21b5b]"
              }`}
            >
              <i
                className={`fa-solid ${category.icon} text-lg ${
                  active ? "text-[#e21b5b]" : "text-gray-400"
                }`}
                aria-hidden="true"
              />
              <span>{category.label}</span>
            </button>
          );
        })}
      </div>

      {/* Result meta row: count + favorites toggle */}
      <div className="mt-6 mb-4 flex flex-wrap items-center justify-between gap-3">
        <p className="text-xs font-bold text-gray-600" aria-live="polite">
          {status === "success" &&
            `${toPersianNumerals(visibleHotels.length)} هتل ${
              favoritesOnly ? "در علاقه‌مندی‌های شما" : "یافت شد"
            }`}
        </p>
        <button
          type="button"
          aria-pressed={favoritesOnly}
          onClick={() => setFavoritesOnly((prev) => !prev)}
          className={`inline-flex items-center gap-2 text-xs font-bold px-4 py-2 rounded-xl border transition-all ${
            favoritesOnly
              ? "bg-[#e21b5b] border-[#e21b5b] text-white shadow-sm"
              : "bg-white border-gray-200 text-gray-700 hover:border-[#e21b5b] hover:text-[#e21b5b]"
          }`}
        >
          <i
            className={`fa-heart ${favoritesOnly ? "fa-solid" : "fa-regular"}`}
            aria-hidden="true"
          />
          علاقه‌مندی‌های من
          <span
            className={`min-w-6 text-center text-[10px] px-1.5 py-0.5 rounded-full ${
              favoritesOnly ? "bg-white text-[#e21b5b]" : "bg-[#e21b5b]/10 text-[#e21b5b]"
            }`}
          >
            {toPersianNumerals(favoritesCount)}
          </span>
        </button>
      </div>

      <HotelGrid
        hotels={visibleHotels}
        variant="best"
        status={status}
        onRetry={retry}
        emptyTitle={emptyCopy.title}
        emptyDescription={emptyCopy.description}
      />
    </div>
  );
}
