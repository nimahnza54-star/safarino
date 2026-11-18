"use client";

import { useCallback, useEffect, useState } from "react";
import { getHotels, sortByRating } from "@/services/hotels.service";
import { HotelGrid, type GridStatus } from "./HotelGrid";
import type { Hotel } from "@/types/hotel";

const PREVIEW_COUNT = 4;

/**
 * «برترین هتل‌ها» — top rated hotels. «همه هتل‌ها» expands the list
 * inline to the full dataset sorted by rating (no navigation).
 */
export function BestHotelsSection() {
  const [hotels, setHotels] = useState<Hotel[]>([]);
  const [status, setStatus] = useState<GridStatus>("loading");
  const [showAll, setShowAll] = useState(false);
  const [reloadToken, setReloadToken] = useState(0);

  useEffect(() => {
    let alive = true;
    getHotels()
      .then((data) => {
        if (!alive) return;
        setHotels(sortByRating(data));
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

  const visible = showAll ? hotels : hotels.slice(0, PREVIEW_COUNT);

  return (
    <section className="py-8 bg-gray-50" aria-labelledby="best-hotels-title">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-6">
          <h3 id="best-hotels-title" className="text-xl font-black text-gray-900">
            برترین هتل‌ها
          </h3>
          {hotels.length > PREVIEW_COUNT && (
            <button
              type="button"
              onClick={() => setShowAll((prev) => !prev)}
              aria-expanded={showAll}
              className="text-xs font-bold text-[#0070cd] hover:underline flex items-center gap-1"
            >
              <span>{showAll ? "نمایش کمتر" : "همه هتل‌ها"}</span>
              <i
                className={`fa-solid fa-chevron-${showAll ? "up" : "down"} text-[10px]`}
                aria-hidden="true"
              />
            </button>
          )}
        </div>
        <HotelGrid hotels={visible} variant="best" status={status} onRetry={retry} />
      </div>
    </section>
  );
}
