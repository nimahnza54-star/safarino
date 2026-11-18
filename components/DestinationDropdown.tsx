"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import { DESTINATIONS } from "@/mock/destinations/destinations.mock";
import type { DestinationOption } from "@/types/hotel";

export type { DestinationOption };

type DestinationDropdownProps = {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
};

export function DestinationDropdown({
  value,
  onChange,
  placeholder = "نام شهر یا هتل مورد نظر...",
}: DestinationDropdownProps) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);

  const filtered = DESTINATIONS.filter(
    (d) =>
      d.name
        .toLocaleLowerCase("fa")
        .includes(query.toLocaleLowerCase("fa")) ||
      d.city.toLocaleLowerCase("fa").includes(query.toLocaleLowerCase("fa"))
  );

  const selectDestination = useCallback(
    (dest: DestinationOption) => {
      onChange(`${dest.name}، ${dest.city}`);
      setOpen(false);
      setQuery("");
    },
    [onChange]
  );

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
      className="relative md:col-span-4"
    >
      <div className="border border-gray-300 rounded-2xl p-3 hover:border-[#e21b5b] focus-within:border-[#e21b5b] focus-within:ring-2 focus-within:ring-[#e21b5b]/20 transition-all bg-white cursor-pointer group">
        <label className="block text-[11px] font-semibold text-gray-400 mb-0.5">
          مقصد یا اقامتگاه (داخلی، خارجی)
        </label>
        <div className="flex items-center gap-2">
          <i className="fa-solid fa-location-dot text-gray-400"></i>
          <input
            ref={inputRef}
            className="w-full text-xs font-bold text-gray-800 border-none p-0 focus:ring-0 placeholder:font-normal placeholder:text-gray-400"
            placeholder={placeholder}
            defaultValue={value}
            readOnly
            onClick={() => setOpen(true)}
          />
        </div>
      </div>

      {open && (
        <div className="absolute right-0 z-50 mt-1 w-full max-w-xs bg-white border border-gray-200 rounded-2xl shadow-2xl overflow-hidden">
          <div className="p-3 border-b border-gray-100">
            <input
              autoFocus
              className="w-full text-xs border border-gray-200 rounded-xl px-3 py-2 focus:ring-1 focus:ring-[#e21b5b] outline-none bg-gray-50"
              placeholder="جستجوی هتل یا شهر..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>
          <div className="max-h-[300px] overflow-y-auto">
            {filtered.length === 0 ? (
              <div className="p-4 text-xs text-gray-500 text-center">
                نتیجه‌ای یافت نشد
              </div>
            ) : (
              <ul>
                {filtered.map((dest) => (
                  <li key={dest.id}>
                    <button
                      onClick={() => selectDestination(dest)}
                      className="w-full text-right p-3 text-xs text-gray-700 hover:bg-[#e21b5b]/10 transition-colors border-b border-gray-50 last:border-b-0"
                    >
                      <div className="font-bold">{dest.name}</div>
                      <div className="text-[10px] text-gray-500 mt-0.5">
                        {dest.city}
                      </div>
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
