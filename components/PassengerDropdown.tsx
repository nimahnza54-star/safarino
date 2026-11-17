"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import { toPersianNumerals } from "@/components/jalali-utils";

type PassengerDropdownProps = {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
};

export function PassengerDropdown({
  value,
  onChange,
  placeholder = "تعداد مسافران",
}: PassengerDropdownProps) {
  const [open, setOpen] = useState(false);
  const [adults, setAdults] = useState(2);
  const [children, setChildren] = useState(1);
  const wrapperRef = useRef<HTMLDivElement>(null);

  const incrementAdults = useCallback(() => setAdults((prev) => prev + 1), []);
  const decrementAdults = useCallback(() => setAdults((prev) => Math.max(0, prev - 1)), []);
  const incrementChildren = useCallback(() => setChildren((prev) => prev + 1), []);
  const decrementChildren = useCallback(() => setChildren((prev) => Math.max(0, prev - 1)), []);

  const confirmSelection = useCallback(() => {
    const adultStr = toPersianNumerals(adults);
    const childStr = toPersianNumerals(children);
    let label = "";
    if (adults > 0 && children > 0) {
      label = `${adultStr} بزرگسال، ${childStr} کودک`;
    } else if (adults > 0) {
      label = `${adultStr} بزرگسال`;
    } else if (children > 0) {
      label = `${childStr} کودک`;
    } else {
      label = placeholder;
    }
    onChange(label);
    setOpen(false);
  }, [adults, children, onChange, placeholder]);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div
      ref={wrapperRef}
      className="relative md:col-span-2"
    >
      <div
        className="border border-gray-300 rounded-2xl p-3 hover:border-[#e21b5b] focus-within:border-[#e21b5b] focus-within:ring-2 focus-within:ring-[#e21b5b]/20 transition-all bg-white cursor-pointer group"
        onClick={() => setOpen(true)}
      >
        <label className="block text-[11px] font-semibold text-gray-400 mb-0.5">
          تعداد مسافران
        </label>
        <div className="flex items-center gap-2 text-xs font-bold text-gray-800">
          <i className="fa-solid fa-user-group text-gray-400"></i>
          <span>{value || placeholder}</span>
        </div>
      </div>

      {open && (
        <div className="absolute right-0 z-50 mt-1 w-full max-w-xs bg-white border border-gray-200 rounded-2xl shadow-2xl overflow-hidden">
          <div className="p-4 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-bold text-slate-800">بزرگسال</span>
              <div className="flex items-center gap-2">
                <button
                  onClick={decrementAdults}
                  disabled={adults === 0}
                  className="w-7 h-7 rounded-full bg-gray-100 flex items-center justify-center text-xs font-bold text-gray-600 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  aria-label="کم کردن بزرگسال"
                >
                  −
                </button>
                <span className="w-6 text-center text-xs font-bold text-gray-800">
                  {toPersianNumerals(adults)}
                </span>
                <button
                  onClick={incrementAdults}
                  className="w-7 h-7 rounded-full bg-[#e21b5b] text-white flex items-center justify-center text-xs font-bold hover:bg-[#d1134e] transition-colors"
                  aria-label="افزودن بزرگسال"
                >
                  +
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-sm font-bold text-slate-800">کودک</span>
              <div className="flex items-center gap-2">
                <button
                  onClick={decrementChildren}
                  disabled={children === 0}
                  className="w-7 h-7 rounded-full bg-gray-100 flex items-center justify-center text-xs font-bold text-gray-600 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  aria-label="کم کردن کودک"
                >
                  −
                </button>
                <span className="w-6 text-center text-xs font-bold text-gray-800">
                  {toPersianNumerals(children)}
                </span>
                <button
                  onClick={incrementChildren}
                  className="w-7 h-7 rounded-full bg-[#e21b5b] text-white flex items-center justify-center text-xs font-bold hover:bg-[#d1134e] transition-colors"
                  aria-label="افزودن کودک"
                >
                  +
                </button>
              </div>
            </div>

            <button
              onClick={confirmSelection}
              className="w-full bg-[#e21b5b] text-white text-xs font-bold py-2 rounded-xl hover:bg-[#d1134e] transition-colors"
            >
              تایید
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
