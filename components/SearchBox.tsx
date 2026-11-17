"use client";

import { useState, useCallback } from "react";
import { toPersianNumerals } from "@/components/jalali-utils";
import { DestinationDropdown } from "@/components/DestinationDropdown";
import { DateRangePicker } from "@/components/DateRangePicker";
import { PassengerDropdown } from "@/components/PassengerDropdown";

type CategoryTab = {
  icon: string;
  label: string;
  active?: boolean;
};

export type SearchBoxProps = {
  initialDestination?: string;
  initialDateRange?: string;
  initialPassengers?: string;
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
}: SearchBoxProps = {}) {
  const [destination, setDestination] = useState(
    initialDestination ?? "تهران، هتل اسپیناس پالاس"
  );
  const [dateRange, setDateRange] = useState(
    initialDateRange ?? "۲۵ فروردین ۱۴۰۵ - ۲۹ فروردین ۱۴۰۵"
  );
  const [passengers, setPassengers] = useState(
    initialPassengers ?? "۲ بزرگسال، ۱ کودک"
  );
  const [activeTab, setActiveTab] = useState(0);

  const selectTab = useCallback((index: number) => {
    setActiveTab(index);
  }, []);

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
            <DestinationDropdown value={destination} onChange={setDestination} />

            {/* Date Selector Field */}
            <DateRangePicker value={dateRange} onChange={setDateRange} />

            {/* Guests / Room Field */}
            <PassengerDropdown value={passengers} onChange={setPassengers} />

            {/* Search Button */}
            <div className="md:col-span-2">
              <button
                disabled
                className="w-full h-[54px] bg-[#e21b5b] text-white rounded-2xl font-bold flex items-center justify-center gap-2 shadow-lg shadow-[#e21b5b]/30 transition-all transform active:scale-95 opacity-70 cursor-not-allowed"
              >
                <i className="fa-solid fa-magnifying-glass text-base"></i>
                <span>جستجو</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
