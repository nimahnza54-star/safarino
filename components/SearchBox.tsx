"use client";

import { useState, useCallback } from "react";
import { calcNights, type JalaliDate } from "@/components/jalali-utils";
import { DestinationDropdown } from "@/components/DestinationDropdown";
import { DateRangePicker } from "@/components/DateRangePicker";
import { PassengerDropdown } from "@/components/PassengerDropdown";
import type { SearchCriteria } from "@/types/search";

type CategoryTab = {
  icon: string;
  label: string;
  active?: boolean;
};

export type SearchBoxProps = {
  initialDestination?: string;
  initialDateRange?: string;
  initialPassengers?: string;
  /** Called with validated criteria. When omitted, the search button stays disabled (current accommodation-booking state). */
  onSearch?: (criteria: SearchCriteria) => void;
  /** Called when the user clears the filters inside this box. */
  onClear?: () => void;
};

const CATEGORY_TABS: CategoryTab[] = [
  { icon: "fa-hotel", label: "هتل", active: true },
  { icon: "fa-house-chimney", label: "ویلا و اقامتگاه" },
  { icon: "fa-plane-departure", label: "پرواز داخلی" },
  { icon: "fa-earth-americas", label: "پرواز خارجی" },
  { icon: "fa-train", label: "قطار" },
  { icon: "fa-bus-simple", label: "اتوبوس" },
  { icon: "fa-umbrella-beach", label: "تور" },
  { icon: "fa-bolt", label: "سفر شتاب" },
  { icon: "fa-ticket", label: "بلیط جاذبه‌ها" },
  { icon: "fa-hand-holding-heart", label: "کار داوطلبانه" },
  { icon: "fa-users", label: "سفر با تو" },
  { icon: "fa-campground", label: "اجاره لوازم سفر" },
];

export function SearchBox({
  initialDestination,
  initialDateRange,
  initialPassengers,
  onSearch,
  onClear,
}: SearchBoxProps = {}) {
  const defaultDestination = initialDestination ?? "تهران، هتل اسپیناس پالاس";
  const defaultDateRange = initialDateRange ?? "۲۵ فروردین ۱۴۰۵ - ۲۹ فروردین ۱۴۰۵";
  const defaultPassengers = initialPassengers ?? "۲ بزرگسال، ۱ کودک";

  const [destination, setDestination] = useState(defaultDestination);
  const [dateRange, setDateRange] = useState(defaultDateRange);
  const [passengers, setPassengers] = useState(defaultPassengers);
  const [activeTab, setActiveTab] = useState(0);
  const [checkIn, setCheckIn] = useState<JalaliDate | null>(null);
  const [checkOut, setCheckOut] = useState<JalaliDate | null>(null);
  const [passengerCounts, setPassengerCounts] = useState({
    adults: 2,
    children: 1,
    rooms: 1,
  });
  const [error, setError] = useState<string | null>(null);
  // Incremented on reset so child dropdowns remount and drop internal state.
  const [resetToken, setResetToken] = useState(0);

  const selectTab = useCallback((index: number) => {
    setActiveTab(index);
  }, []);

  const handleRangeChange = useCallback(
    (nextCheckIn: JalaliDate | null, nextCheckOut: JalaliDate | null) => {
      setCheckIn(nextCheckIn);
      setCheckOut(nextCheckOut);
    },
    []
  );

  const handlePassengersChange = useCallback(
    (next: { adults: number; children: number; rooms: number }) => {
      setPassengerCounts(next);
    },
    []
  );

  const handleSearch = useCallback(() => {
    const { adults, children, rooms } = passengerCounts;

    if (adults + children === 0) {
      setError("حداقل یک مسافر (بزرگسال یا کودک) انتخاب کنید.");
      return;
    }
    if ((checkIn === null) !== (checkOut === null)) {
      setError("تاریخ ورود و خروج را کامل انتخاب کنید.");
      return;
    }
    if (checkIn && checkOut && calcNights(checkIn, checkOut) <= 0) {
      setError("تاریخ خروج باید بعد از تاریخ ورود باشد.");
      return;
    }

    setError(null);
    onSearch?.({ destination, checkIn, checkOut, adults, children, rooms });
  }, [destination, checkIn, checkOut, passengerCounts, onSearch]);

  const handleClear = useCallback(() => {
    setDestination(defaultDestination);
    setDateRange(defaultDateRange);
    setPassengers(defaultPassengers);
    setCheckIn(null);
    setCheckOut(null);
    setPassengerCounts({ adults: 2, children: 1, rooms: 1 });
    setResetToken((token) => token + 1);
    setError(null);
    onClear?.();
  }, [defaultDestination, defaultDateRange, defaultPassengers, onClear]);

  const searchEnabled = onSearch !== undefined;

  return (
    <section className="relative pt-6 pb-12 bg-gradient-to-b from-gray-100 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Search Card Wrap */}
        <div className="bg-white rounded-3xl shadow-xl shadow-gray-200/60 border border-gray-100 p-4 sm:p-6 lg:p-8">
          {/* Category Tab Bar */}
          <div className="flex items-center gap-2 sm:gap-4 overflow-x-auto pb-4 mb-6 border-b border-gray-100 no-scrollbar">
            {CATEGORY_TABS.map((tab, i) => (
              <button
                key={i}
                onClick={() => selectTab(i)}
                aria-pressed={activeTab === i}
                className={`flex flex-col items-center justify-center min-w-[76px] py-2 px-3 rounded-2xl transition-all border ${
                  activeTab === i
                    ? "bg-[#e21b5b]/10 text-[#e21b5b] font-bold border-[#fad1dd]"
                    : "text-gray-600 hover:bg-gray-50 hover:text-[#e21b5b] font-medium border-transparent"
                }`}
              >
                <i className={`fa-solid ${tab.icon} text-xl mb-1.5`}></i>
                <span className="text-xs">{tab.label}</span>
              </button>
            ))}
          </div>

          {/* Search Input Bar Fields */}
          <div className="relative grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
            {/* Destination Field */}
            <DestinationDropdown
              key={`destination-${resetToken}`}
              value={destination}
              onChange={setDestination}
            />

            {/* Date Selector Field */}
            <DateRangePicker
              key={`dates-${resetToken}`}
              value={dateRange}
              onChange={setDateRange}
              onRangeChange={handleRangeChange}
            />

            {/* Guests / Room Field */}
            <PassengerDropdown
              key={`passengers-${resetToken}`}
              value={passengers}
              onChange={setPassengers}
              onPassengersChange={handlePassengersChange}
            />

            {/* Search Button */}
            <div className="md:col-span-2">
              <button
                type="button"
                onClick={searchEnabled ? handleSearch : undefined}
                disabled={!searchEnabled}
                aria-disabled={!searchEnabled}
                title={
                  searchEnabled
                    ? "جستجوی هتل‌های منطبق"
                    : "جستجو در نسخه کامل در دسترس قرار می‌گیرد"
                }
                className={`w-full h-[54px] bg-[#e21b5b] text-white rounded-2xl font-bold flex items-center justify-center gap-2 shadow-lg shadow-[#e21b5b]/30 transition-all transform ${
                  searchEnabled
                    ? "hover:bg-[#d1134e] active:scale-95"
                    : "opacity-70 cursor-not-allowed"
                }`}
              >
                <i className="fa-solid fa-magnifying-glass text-base"></i>
                <span>جستجو</span>
              </button>
            </div>
          </div>

          {/* Validation / helper row */}
          <div className="mt-3 flex items-center justify-between gap-3 flex-wrap">
            {error ? (
              <p className="text-[11px] font-bold text-red-600 inline-flex items-center gap-1.5" role="alert">
                <i className="fa-solid fa-circle-exclamation" aria-hidden="true" />
                {error}
              </p>
            ) : (
              <span className="text-[10px] text-gray-400">
                جستجو فقط هتل‌های منطبق با مقصد و ظرفیت را نمایش می‌دهد.
              </span>
            )}
            {searchEnabled && (
              <button
                type="button"
                onClick={handleClear}
                className="text-[10px] font-bold text-gray-500 hover:text-[#e21b5b] inline-flex items-center gap-1 transition-colors"
              >
                <i className="fa-solid fa-rotate-left" aria-hidden="true" />
                بازنشانی فیلترها
              </button>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
