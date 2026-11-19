"use client";

import { useCallback, useEffect, useState } from "react";
import { getAccommodations, sortByRating } from "@/services/accommodations.service";
import { AccommodationGrid, type GridStatus } from "./AccommodationGrid";
import type { Accommodation } from "@/types/accommodation";

const PREVIEW_COUNT = 4;

/** «برترین اقامتگاه‌های ایران» — بالاترین امتیازها؛ «همه اقامتگاه‌ها» لیست را باز می‌کند. */
export function BestAccommodationsSection() {
  const [accommodations, setAccommodations] = useState<Accommodation[]>([]);
  const [status, setStatus] = useState<GridStatus>("loading");
  const [showAll, setShowAll] = useState(false);
  const [reloadToken, setReloadToken] = useState(0);

  useEffect(() => {
    let alive = true;
    getAccommodations()
      .then((data) => {
        if (!alive) return;
        setAccommodations(sortByRating(data));
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

  const visible = showAll ? accommodations : accommodations.slice(0, PREVIEW_COUNT);

  return (
    <section className="py-8 bg-gray-50" aria-labelledby="best-accommodations-title">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-6">
          <h3 id="best-accommodations-title" className="text-xl font-black text-gray-900">
            برترین اقامتگاه‌های ایران
          </h3>
          {accommodations.length > PREVIEW_COUNT && (
            <button
              type="button"
              onClick={() => setShowAll((prev) => !prev)}
              aria-expanded={showAll}
              className="text-xs font-bold text-[#0070cd] hover:underline flex items-center gap-1"
            >
              <span>{showAll ? "نمایش کمتر" : "همه اقامتگاه‌ها"}</span>
              <i
                className={`fa-solid fa-chevron-${showAll ? "up" : "down"} text-[10px]`}
                aria-hidden="true"
              />
            </button>
          )}
        </div>
        <AccommodationGrid
          accommodations={visible}
          variant="best"
          status={status}
          onRetry={retry}
        />
      </div>
    </section>
  );
}
