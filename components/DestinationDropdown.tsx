"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import { toEnglishNumerals } from "@/components/jalali-utils";

export type DestinationOption = {
  id: string;
  name: string;
  city: string;
  type: "hotel" | "accommodation" | "villa";
};

/**
 * Sample dataset of hotels and accommodations across Iranian cities.
 * This is local mock data - no backend connection.
 */
const DESTINATIONS: DestinationOption[] = [
  // Tehran
  { id: "1", name: "هتل اسپیناس پالاس", city: "تهران", type: "hotel" },
  { id: "2", name: "هتل อูتلی تهران", city: "تهران", type: "hotel" },
  { id: "3", name: "هتل edustو تهران", city: "تهران", type: "hotel" },
  { id: "4", name: "هتل 플و 체ران", city: "تهران", type: "hotel" },
  { id: "5", name: "م granting تهران", city: "تهران", type: "accommodation" },
  // Mazandaran
  { id: "6", name: "هتل میларام", city: "مازندران، نوشهر", type: "hotel" },
  { id: "7", name: "ویلا جنگلی چلیک", city: "مازندران، نوشهر", type: "villa" },
  { id: "8", name: "اقامتگاه بوم‌گردی کلاردشت", city: "مازندران، کلاردشت", type: "accommodation" },
  { id: "9", name: "هتل سایادال", city: "مازندران، بابل", type: "hotel" },
  // Isfahan
  { id: "10", name: "هتل سی además", city: "اصفهان", type: "hotel" },
  { id: "11", name: "اقامتگاه سنتی جلفا", city: "اصفهان، جلفا", type: "accommodation" },
  { id: "12", name: "ویلاсториک کاشان", city: "کاشان", type: "villa" },
  // Mashhad
  { id: "13", name: "هتل علىನೆ مشهد", city: "مشهد", type: "hotel" },
  { id: "14", name: "اقامتگاه طرقبه مشهد", city: "مشهد، طرقبه", type: "accommodation" },
  // Shiraz
  { id: "15", name: "هتل وارنت شیراز", city: "شیراز", type: "hotel" },
  { id: "16", name: "باغ Amelia شیراز", city: "شیراز", type: "villa" },
  { id: "17", name: "اقامتگاه سنتی قلات", city: "شیراز، قلات", type: "accommodation" },
  // Yazd
  { id: "18", name: "هتل سادات یزد", city: "یزد", type: "hotel" },
  { id: "19", name: "اقامتگاه بوم‌گردی بافت تاریخی", city: "یزد، بافت تاریخی", type: "accommodation" },
  // Kish
  { id: "20", name: "هتل مارین 키ش", city: "جزیره کیش", type: "hotel" },
  { id: "21", name: "ویلا ساحلی صدف", city: "جزیره کیش، مرجان", type: "villa" },
  // Qeshm
  { id: "22", name: "هتل قشم", city: "جزیره قشم", type: "hotel" },
  // Ramsar
  { id: "23", name: "پنتهاوس ساحلی یاس", city: "رامسر، بلوار کازینو", type: "villa" },
  // Chalous
  { id: "24", name: "ویلا موج استخردار", city: "چالوس، رادیو دریا", type: "villa" },
  // Gilan
  { id: "25", name: "کلبه روستایی شالیزار", city: "گیلان، فومن", type: "villa" },
  // Alborz
  { id: "26", name: "ویلا استخر روباز", city: "البرز، سهیلیه", type: "villa" },
  // Additional diverse options
  { id: "27", name: "هتلellor، تهران", city: "تهران", type: "hotel" },
  { id: "28", name: "هتل.module، مشهد", city: "مشهد", type: "hotel" },
  { id: "29", name: "اقامتگاه بوم‌گردی 들", city: "مازندران، Ramsar", type: "accommodation" },
  { id: "30", name: "هتل آسمان、شیراز", city: "شیراز", type: "hotel" },
  { id: "31", name: "ویلا باغ、یزد", city: "یزد", type: "villa" },
  { id: "32", name: "هتل cilia، کیش", city: "جزیره کیش", type: "hotel" },
  { id: "33", name: "اقامتگاه بوم‌گردی، همدان", city: "همدان", type: "accommodation" },
  { id: "34", name: "هتل roni، أردبیل", city: "اردبیل", type: "hotel" },
  { id: "35", name: "هتل tabriz، تبریز", city: "تبریز", type: "hotel" },
  { id: "36", name: "هتل zephyr، ارومیه", city: "ارومیه", type: "hotel" },
];

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
