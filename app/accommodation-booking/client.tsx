"use client";

import Image from "@/components/AppImage";
import { Vazirmatn } from "next/font/google";
import MainHeader from "@/components/MainHeader";
import { SearchBox } from "@/components/SearchBox";
import { useState, useEffect, useCallback, useRef } from "react";



const vazirmatn = Vazirmatn({
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  variable: "--font-vazirmatn",
  display: "swap",
});

/* ------------------------------------------------------------------ */
/* Reusable Sub-components                                              */
/* ------------------------------------------------------------------ */

type AccomCardProps = {
  imgSrc: string;
  alt: string;
  location: string;
  label?: string;
  labelColor?: string;
  title: string;
  price: string;
  currency?: string;
  originalPrice?: string;
  stars?: number;
  badge?: string;
  borderColor?: string;
  availableText?: string;
};

function AccomCard({
  imgSrc,
  alt,
  location,
  label,
  labelColor,
  title,
  price,
  currency = "تومان",
  originalPrice,
  stars = 5,
  badge,
  borderColor = "border-gray-200",
  availableText,
}: AccomCardProps) {
  return (
    <div className={`bg-white rounded-2xl overflow-hidden ${borderColor} card-shadow hover:-translate-y-1 transition-all group`}>
      <div className="relative aspect-[16/10] overflow-hidden">
        <Image
          src={imgSrc}
          alt={alt}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
        />
        {label && (
          <span
            className={`absolute top-3 right-3 ${labelColor} text-white text-xs font-bold px-2 py-1 rounded-lg`}
          >
            {label}
          </span>
        )}
        {badge && (
          <span
            className={`absolute bottom-3 right-3 bg-black/60 text-white text-[10px] px-2 py-0.5 rounded backdrop-blur`}
          >
            {badge}
          </span>
        )}
      </div>
      <div className="p-4">
        <div className="flex items-center justify-between text-xs mb-1">
          <div className="flex items-center text-amber-400 text-[10px] gap-0.5">
  {[1, 2, 3, 4, 5].map((star) => (
    <i key={star} className="fa-solid fa-star"></i>
  ))}
</div>
          {availableText ? (
            <span className="text-red-600 font-bold text-[11px]">{availableText}</span>
          ) : (
            <span className="text-gray-400 text-[11px]">{location}</span>
          )}
        </div>
        <h4 className="font-bold text-slate-800 text-sm mb-3">{title}</h4>
        <div className="flex items-center justify-between pt-3 border-t border-gray-100">
          <span className="text-xs text-gray-400">هر شب از:</span>
          <div className="text-left">
            {originalPrice && (
              <span className="text-xs line-through text-gray-400">{originalPrice}</span>
            )}
            <span className="font-black text-[#e21b5b] text-base">{price}</span>
            <span className="text-[10px] text-gray-500 mr-1">{currency}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

type FeatureCardAcomProps = {
  imgSrc: string;
  alt: string;
  title: string;
  description: string;
};

function FeatureCardAcom({ imgSrc, alt, title, description }: FeatureCardAcomProps) {
  return (
    <div className="border border-gray-200 rounded-2xl p-5 text-center flex flex-col justify-between hover:shadow-lg transition-all bg-white group">
      <div>
        <div className="relative w-full h-44 rounded-xl overflow-hidden mb-4 bg-gray-100">
          <Image
            src={imgSrc}
            alt={alt}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform"
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
            />
        </div>
        <h3 className="font-bold text-slate-800 text-sm mb-2">{title}</h3>
        <p className="text-xs text-gray-500 leading-relaxed text-justify">
          {description}
        </p>
      </div>
      <div className="mt-4 pt-3 border-t border-gray-100">
        <a href="#" className="text-[#e21b5b] font-bold text-xs hover:text-[#b00c3e] flex items-center justify-center gap-1">
          <span>اطلاعات بیشتر</span>
          <i className="fa-solid fa-angle-left text-[10px]"></i>
        </a>
      </div>
    </div>
  );
}

type FaqItemAcomProps = {
  index: number;
  question: string;
  answer: string;
  initiallyOpen?: boolean;
};

function FaqItemAcom({ index, question, answer, initiallyOpen = false }: FaqItemAcomProps) {
  const [open, setOpen] = useState(initiallyOpen);

  return (
    <div className="border border-gray-200 rounded-2xl overflow-hidden">
      <div
        onClick={() => setOpen((prev) => !prev)}
        className={`p-4 flex items-center justify-between cursor-pointer transition-colors ${
          open ? "bg-[#fff1f2]/40" : "hover:bg-gray-50"
        }`}
      >
        <span className="text-xs sm:text-sm font-bold text-slate-800 flex items-center gap-2">
          <span
            className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${
              open
                ? "bg-[#e21b5b] text-white"
                : "bg-gray-200 text-gray-600"
            }`}
          >
            ؟
          </span>
          {question}
        </span>
        <i className={`fa-solid fa-chevron text-xs ${
          open ? "fa-chevron-up text-[#e21b5b]" : "fa-chevron-down text-gray-400"
        }`}></i>
      </div>
      {open && (
        <div className="p-4 bg-white text-xs text-gray-600 leading-relaxed border-t border-gray-100">
          {answer}
        </div>
      )}
    </div>
  );
}

type CategoryPillarProps = {
  imgSrc: string;
  alt: string;
  label: string;
};

function CategoryPillar({ imgSrc, alt, label }: CategoryPillarProps) {
  return (
    <a href="#" className="flex flex-col items-center group">
      <div className="w-full aspect-[4/5] rounded-2xl overflow-hidden shadow-sm border border-gray-200/80 group-hover:shadow-md transition-all relative">
        <Image
          src={imgSrc}
          alt={alt}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          fill
          sizes="(max-width: 640px) 100vw, 33vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent flex items-end justify-center pb-2">
          <span className="text-white text-xs font-bold">{label}</span>
        </div>
      </div>
    </a>
  );
}

type CityChipProps = {
  label: string;
  icon: string;
  iconColor: string;
};

function CityChip({ label, icon, iconColor }: CityChipProps) {
  return (
    <a href="#" className="border border-gray-200 hover:border-[#e21b5b] rounded-xl p-3 flex items-center justify-between group transition-colors">
      <div className="flex items-center gap-2">
        <i className={`fa-solid ${icon} ${iconColor}`}></i>
        <span className="font-bold text-slate-700 group-hover:text-[#e21b5b]">
          {label}
        </span>
      </div>
      <i className="fa-solid fa-chevron-left text-gray-300 text-[10px] group-hover:text-[#e21b5b]"></i>
    </a>
  );
}

type TravelCardProps = {
  badge: string;
  badgeColor: string;
  title: string;
  items: string[];
  buttonText: string;
  buttonColor: string;
  imgSrc: string;
  imgAlt: string;
  rotate: number;
};

function TravelCard({
  badge,
  badgeColor,
  title,
  items,
  buttonText,
  buttonColor,
  imgSrc,
  imgAlt,
  rotate,
}: TravelCardProps) {
  return (
    <div className="border border-gray-200 rounded-3xl p-6 bg-white shadow-sm flex flex-col sm:flex-row items-center justify-between gap-6 hover:shadow-md transition-shadow">
      <div className="space-y-3 text-right">
        <span className={`inline-block text-xs font-bold ${badgeColor} px-2.5 py-1 rounded-lg`}>
          {badge}
        </span>
        <h4 className="text-lg font-black text-slate-800">{title}</h4>
        <ul className="text-xs text-gray-500 space-y-1 list-disc list-inside">
          {items.map((item, i) => (
            <li key={i}>{item}</li>
          ))}
        </ul>
        <a href="#" className={`inline-block mt-2 ${buttonColor} text-white text-xs font-bold px-5 py-2.5 rounded-xl transition-colors`}>
          {buttonText}
        </a>
      </div>
      <div className={`relative w-48 sm:w-56 h-32 rounded-2xl overflow-hidden shadow-lg transform rotate-${rotate}`}>
        <Image
          src={imgSrc}
          alt={imgAlt}
          className="w-full h-full object-cover"
          fill
          sizes="(max-width: 640px) 100vw, 200px"
        />
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Page Sections                                                        */
/* ------------------------------------------------------------------ */

function TopNotificationBanner() {
  const [showNotice, setShowNotice] = useState(true);

  if (!showNotice) return null;

  return (
    <div className="bg-amber-100 text-amber-900 border-b border-amber-200 text-xs py-2 px-4 flex items-center justify-between text-center relative z-50">
      <div className="max-w-7xl mx-auto flex items-center gap-2 font-medium">
        <i className="fa-solid fa-bullhorn text-amber-600"></i>
        <span>
          اطلاعیه مهم: پروازها و اسکان مناطق تحت نظارت با تخفیف ویژه نوروز ۱۴۰۵ ارائه می&zwnj;شود. برای اطلاعات بیشتر با پشتیبانی در تماس باشید.
        </span>
      </div>

      <button
        onClick={() => setShowNotice(false)}
        className="text-amber-700 hover:text-amber-950 px-2 font-bold text-sm"
        type="button"
        aria-label="بستن اطلاعیه"
      >
        ✕
      </button>
    </div>
  );
}


function HeroSearchSection() {
  const [calendarOpen, setCalendarOpen] = useState(false);
  const [guestCount, setGuestCount] = useState(3);
  const dateTriggerRef = useRef<HTMLDivElement>(null);
  const calendarRef = useRef<HTMLDivElement>(null);

  const toggleCalendar = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    setCalendarOpen((prev) => !prev);
  }, []);

  const handleClickOutside = useCallback(
    (e: MouseEvent) => {
      if (
        dateTriggerRef.current &&
        !dateTriggerRef.current.contains(e.target as Node) &&
        calendarRef.current &&
        !calendarRef.current.contains(e.target as Node)
      ) {
        setCalendarOpen(false);
      }
    },
    []
  );

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [handleClickOutside]);

  const incrementGuest = () => setGuestCount((prev) => prev + 1);
  const decrementGuest = () => setGuestCount((prev) => (prev > 1 ? prev - 1 : 1));

  return (
    <section className="relative pt-6 pb-14 bg-gradient-to-b from-rose-50/40 via-white to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Category Tabs */}
        <div className="flex items-center justify-between overflow-x-auto gap-3 pb-4 mb-6 custom-scrollbar text-center text-xs font-medium text-gray-600">
          {[
            { icon: "fa-house-chimney", label: "ویلا و اقامتگاه", active: true },
            { icon: "fa-hotel", label: "هتل", active: false },
            { icon: "fa-plane-departure", label: "پرواز داخلی", active: false },
            { icon: "fa-plane", label: "پرواز خارجی", active: false },
            { icon: "fa-train", label: "قطار", active: false },
            { icon: "fa-bus", label: "اتوبوس", active: false },
            { icon: "fa-umbrella-beach", label: "تور", active: false },
            { icon: "fa-bolt", label: "سفر شتاب", active: false, iconColor: "text-amber-500" },
            { icon: "fa-ticket", label: "بلیط جاذبه‌ها", active: false },
            { icon: "fa-hand-holding-heart", label: "کار داوطلبانه", active: false },
            { icon: "fa-car-side", label: "سفر با تو", active: false },
            { icon: "fa-campground", label: "اجاره لوازم سفر", active: false },
          ].map((item, i) => (
            <a
              key={i}
              href="#"
              className={`flex flex-col items-center gap-2 min-w-[70px] p-2 rounded-xl transition-all ${
                item.active
                  ? "text-[#e21b5b] font-bold border-b-2 border-[#e21b5b] bg-white shadow-sm"
                  : "hover:text-[#e21b5b] hover:bg-white"
              }`}
            >
              <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                item.active ? "bg-[#e21b5b]/10 text-[#e21b5b]" : "bg-gray-50 text-gray-500"
              }`}>
                <i className={`fa-solid ${item.icon} ${item.iconColor || ""} text-base`}></i>
              </div>
              <span>{item.label}</span>
            </a>
          ))}
        </div>

        {/* Main Booking Engine Box */}
        <div className="bg-white border border-gray-200/80 rounded-2xl p-4 md:p-6 hero-search-shadow relative z-20">
          <form className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
            {/* Destination Field */}
            <div className="md:col-span-4 border border-gray-200 rounded-xl p-2.5 px-3.5 hover:border-[#e21b5b] transition-colors flex items-center gap-3">
              <i className="fa-solid fa-location-dot text-[#e21b5b] text-lg"></i>
              <div className="flex-1">
                <label className="block text-[11px] text-gray-400 font-medium">
                  مقصد یا اقامتگاه (داخلی، خارجی)
                </label>
                <input
                  className="w-full border-none p-0 text-slate-800 text-sm font-semibold focus:ring-0 placeholder-gray-400"
                  placeholder="شهر یا نام اقامتگاه را وارد کنید"
                  type="text"
                  defaultValue="رامسر، مازندران"
                />
              </div>
            </div>

            {/* Date Selector */}
            <div
              ref={dateTriggerRef}
              onClick={toggleCalendar}
              className="md:col-span-4 border border-gray-200 rounded-xl p-2.5 px-3.5 hover:border-[#e21b5b] transition-colors flex items-center justify-between cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <i className="fa-regular fa-calendar-days text-[#e21b5b] text-lg"></i>
                <div>
                  <span className="block text-[11px] text-gray-400 font-medium">
                    تاریخ ورود و خروج
                  </span>
                  <span className="text-sm font-bold text-slate-800">
                    ۲۵ فروردین ۱۴۰۵ - ۲۹ فروردین
                  </span>
                </div>
              </div>
              <span className="text-xs bg-rose-50 text-[#e21b5b] px-2 py-0.5 rounded font-bold">
                ۴ شب
              </span>
            </div>

            {/* Guests Count Field */}
            <div className="md:col-span-2 border border-gray-200 rounded-xl p-2.5 px-3.5 flex items-center justify-between">
              <div>
                <span className="block text-[11px] text-gray-400 font-medium">
                  تعداد مسافران
                </span>
                <span className="text-sm font-bold text-slate-800">
                  ۲ بزرگسال، ۱ کودک
                </span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={incrementGuest}
                  className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center text-xs font-bold hover:bg-gray-200"
                  type="button"
                >
                  +
                </button>
                <span className="text-xs font-bold text-slate-700">{guestCount}</span>
                <button
                  onClick={decrementGuest}
                  className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center text-xs font-bold hover:bg-gray-200"
                  type="button"
                >
                  −
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <div className="md:col-span-2">
              <button
                className="w-full bg-[#e21b5b] hover:bg-[#d1134e] text-white font-bold py-3.5 px-4 rounded-xl shadow-lg shadow-[#e21b5b]/25 flex items-center justify-center gap-2 transition-all active:scale-[0.98]"
                type="button"
              >
                <i className="fa-solid fa-magnifying-glass"></i>
                <span>جستجو</span>
              </button>
            </div>
          </form>

          {/* Persian Jalali Calendar Overlay */}
          <div
            ref={calendarRef}
            className={`hidden lg:block absolute top-[90%] left-1/4 transform -translate-x-10 mt-3 w-80 bg-white border border-gray-200 rounded-2xl shadow-2xl p-4 z-50 ${calendarOpen ? "" : "hidden"}`}
          >
            <div className="flex items-center justify-between pb-3 border-b border-gray-100 mb-3 text-xs font-bold">
              <div className="flex items-center gap-2">
                <input
                  id="flex-cal"
                  type="checkbox"
                  className="rounded text-[#e21b5b] focus:ring-0"
                />
                <label htmlFor="flex-cal" className="text-gray-600 text-[11px]">
                  تقویم منعطف
                </label>
              </div>
              <button className="text-[#e21b5b] hover:underline text-[11px]">
                برو به امروز
              </button>
            </div>
            <div className="flex items-center justify-between text-xs font-bold mb-3 px-1">
              <span className="text-[#e21b5b]">فروردین</span>
              <span className="text-gray-400">اردیبهشت</span>
            </div>
            <div className="grid grid-cols-7 gap-1 text-center text-[10px] text-gray-500 mb-2 font-medium">
              <span>ش</span><span>ی</span><span>د</span><span>س</span><span>چ</span><span>پ</span><span className="text-rose-500">ج</span>
            </div>
            <div className="grid grid-cols-7 gap-1 text-center text-xs font-medium">
              <span className="p-1 text-gray-300"></span>
              <span className="p-1 text-gray-300"></span>
              <span className="p-1 hover:bg-gray-100 rounded">۱</span>
              <span className="p-1 hover:bg-gray-100 rounded">۲</span>
              <span className="p-1 hover:bg-gray-100 rounded">۳</span>
              <span className="p-1 hover:bg-gray-100 rounded">۴</span>
              <span className="p-1 hover:bg-gray-100 rounded text-rose-500">۵</span>
              <span className="p-1 hover:bg-gray-100 rounded">۶</span>
              <span className="p-1 hover:bg-gray-100 rounded">۷</span>
              <span className="p-1 hover:bg-gray-100 rounded">۸</span>
              <span className="p-1 hover:bg-gray-100 rounded">۹</span>
              <span className="p-1 hover:bg-gray-100 rounded">۱۰</span>
              <span className="p-1 hover:bg-gray-100 rounded">۱۱</span>
              <span className="p-1 hover:bg-gray-100 rounded text-rose-500">۱۲</span>
              <span className="p-1 hover:bg-gray-100 rounded">۱۳</span>
              <span className="p-1 hover:bg-gray-100 rounded">۱۴</span>
              <span className="p-1 hover:bg-gray-100 rounded">۱۵</span>
              <span className="p-1 hover:bg-gray-100 rounded">۱۶</span>
              <span className="p-1 hover:bg-gray-100 rounded">۱۷</span>
              <span className="p-1 hover:bg-gray-100 rounded">۱۸</span>
              <span className="p-1 hover:bg-gray-100 rounded text-rose-500">۱۹</span>
              <span className="p-1 hover:bg-gray-100 rounded">۲۰</span>
              <span className="p-1 hover:bg-gray-100 rounded">۲۱</span>
              <span className="p-1 hover:bg-gray-100 rounded">۲۲</span>
              <span className="p-1 hover:bg-gray-100 rounded">۲۳</span>
              <span className="p-1 hover:bg-gray-100 rounded">۲۴</span>
              <span className="p-1 bg-[#e21b5b] text-white rounded-r font-bold">۲۵</span>
              <span className="p-1 bg-[#e21b5b]/20 text-[#b00c3e]">۲۶</span>
              <span className="p-1 bg-[#e21b5b]/20 text-[#b00c3e]">۲۷</span>
              <span className="p-1 bg-[#e21b5b]/20 text-[#b00c3e]">۲۸</span>
              <span className="p-1 bg-[#e21b5b] text-white rounded-l font-bold">۲۹</span>
              <span className="p-1 hover:bg-gray-100 rounded">۳۰</span>
              <span className="p-1 hover:bg-gray-100 rounded text-rose-500">۳۱</span>
            </div>
            <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between text-xs">
              <span className="text-[11px] text-gray-500">تاریخ خروج: ۲۹ فروردین (۴ شب)</span>
              <button className="bg-[#e21b5b] text-white px-3 py-1 rounded-lg text-xs font-bold hover:bg-[#d1134e]">
                تایید
              </button>
            </div>
          </div>
        </div>

        {/* Quick Category Pillars */}
        <div className="mt-10 grid grid-cols-3 sm:grid-cols-6 gap-4">
          <CategoryPillar
            imgSrc="https://lh3.googleusercontent.com/aida-public/AB6AXuBc4eSCCnOvNx0Gl8PugQ6MDPjj_J11as8KoWe61yGl7f8E2fQJimjwpKfzrTpkhQALx-AnAVkiBT8tfHt9g_Pf9AX71OSjGvsa0goOvP20Uzn8MTyvyr0DQchMZhObp1ouLhcFaAIj8fWSnvcZTe_vlIPvTaCnf0WomVhIREg5iY03q_Y_CBJXnK0MaBl9zeWCCl-NNdWPwCiQ2C8Wy9t-T84ZBP9xxF4UhxZB7A"
            alt="پت نواز"
            label="پت نواز"
          />
          <CategoryPillar
            imgSrc="https://lh3.googleusercontent.com/aida-public/AB6AXuDDiS51xp2yS5rtkD1skrZm_UX3nYJunSniwVBbONNxBSmFRD7Fsf9TCKbH926yuvG6zg-OeoVGyjYXSUJrvnMv7IEC2H_qGXYVMmKU20_e9Us-UAdea7lVVsZTZi5IfUVlcXSy60s_XAoakyhVPiHvCLG_qRTP2DIuAoKovcxFIi1RFmhp3GWStlpRSmHGCl4sN6IyynKCKAiDHJuAeHI1xuaKLYgxOdAd8SQJ6w"
            alt="ویلا استخردار"
            label="ویلا استخردار"
          />
          <CategoryPillar
            imgSrc="https://lh3.googleusercontent.com/aida-public/AB6AXuC3nJZLc4w_qCD9jRnd84F2ZmiXjA3_uina8TAPzJs-zSkpcXgcKaT6s-WzARAFOIokuBuOUipxGW5oAxwvowNnnCqJ0EZMr71olHRGbBGJEi5t2Y2YZRL2dYyGVN84G8FQrfw9pIHgvVBKKn7G6cnQ_1OLn1QIa74t7YhzMS7yWr7AnNn7TV0qEKflUST3gCU5cTZ5CC5THiKwJUjHho7q3P68v7i6-gGwQFMETg"
            alt="کلبه چوبی"
            label="کلبه چوبی"
          />
          <CategoryPillar
            imgSrc="https://lh3.googleusercontent.com/aida-public/AB6AXuANMXRNXXKdxG3cMTEJo8v-gtbba8YrIPasrhu8bMYfK3iply7F6N6nmg82fV4lpzvFnBV5RJBEs3c7W9l1LOELSHPvcREijGqPhLwIyVqeHktme15yH98zvQDUKyiM9V8iAN87Y0W1MzrJ4iaXV0cYeWb7drgLRaEW_WJ-jBb6wqwVfe-ViPXK0xzhhpZuo9jcCyzCHat_1UjgzuwQV0eiZZ4MA6yvhoOELgdp9Q"
            alt="بوم‌گردی"
            label="بوم‌گردی"
          />
          <CategoryPillar
            imgSrc="https://lh3.googleusercontent.com/aida-public/AB6AXuBlYO01HCfF1Y-8YzlpQvQn2Z1c9ApyCxccdlr9uO5VgOTdxG1VobgeepWPd4R4m6W-Hb-e8I3kcTa-EwpREutw3uVfVJE1T14OY4zL4Mqv8vWAw95s9-Uer7tfJcNEwBQVq8sygSzQjX7FwAirRpHt7wLZQ125ot_gbnx-kWyz0goQTZnzFbYrs0s9LKCGIGn8IkQs8GPB8AOXz3Gp8m1nbyTz-3ayCgwYwOfMAQ"
            alt="ساحلی لوکس"
            label="ساحلی لوکس"
          />
          <CategoryPillar
            imgSrc="https://lh3.googleusercontent.com/aida-public/AB6AXuBVNAXGXomBe4HORhzDJhvtUHACK4PPowAHohBzu8a6E5_0JL7C_-x-oXJmewyKQpshGgrNSwUOWcBTz43rWF-yQdoMBvQd5CUZsb9VdvMJbpEDPkx_6kqWZVOyFKwljQYuL_nRtwBliyfJcMyK17o__0vRmEcJTOP9v6mtt-kHCgHcDvI1nOVcWttIeW3ulc0kAjnzOKenvRvyJuUyEv8oM9OeUxlfP5-GiaEaYQ"
            alt="اقتصادی و به صرفه"
            label="اقتصادی و به صرفه"
          />
        </div>
      </div>
    </section>
  );
}

function ValuePropositionBanner() {
  const featureData = [
    {
      imgSrc: "https://lh3.googleusercontent.com/aida-public/AB6AXuCgNWBcSGIawYTFwvFP5K_wKk7UMQDbUOIDkOBKIRvxoE9u_ioNC_dudnR0uos_q0lViqYQdUFSbJyThv7c4cFnLt-trthCDSN1s_pyx3BJ-8F4aIOHyzs7i9N460txHZwozgg7-EHRIJd-XqY30Rkuz58bf96PrUbvY3WmKLjqVEtNOoouD99K0MHGBa7fvQR-lNnU-nXa4xSeVmR3AVWcfrHPKClwd-nrye3EBQ",
      alt: "اتوماسیون",
      title: "اتوماسیون تخصصی سفرینو",
      description: "اولین ارائه دهنده اتوماسیون هوشمند مدیریت پذیرش و رزرو هتل و اقامتگاه‌های سنتی در کشور با اتصال مستقیم به سامانه‌های هتلداری.",
    },
    {
      imgSrc: "https://lh3.googleusercontent.com/aida-public/AB6AXuAlB1C2iymLkndRHEuPytNlAsIyp2qLvb8SLH-rX7RMp1aGvlTt1xC0uzGNYGARqZ4GC9urnR5yhtol0Hv1dpr2tQvWeBCtmt7HbRCZHS-iTYj519J43frp3wCspGbutkvZiwqJhqNqTw6_WV7-hoIUFiYg29Px93hrWLPV1vQwE_tbLXrVEeQ0jTDEt0Y--iXXw5tyPr_NIupuM0214aRZnbHf2hLheZVf1MMQRA",
      alt: "جوایز انحصاری",
      title: "جوایز انحصاری",
      description: "تسهیلات ویژه به کاربرانی تعلق می‌گیرد که بیشترین رزرو اقامتگاه را در طول سال با پلتفرم سفرینو ثبت و به اتمام رسانده باشند.",
    },
    {
      imgSrc: "https://lh3.googleusercontent.com/aida-public/AB6AXuAEPGltt5hiu3dccwV8RWGKdlGCvagUGlgMs9aOuYChMVpBWIWBOesnRZFBr8scDapXqHyOwCr2x4hNITaV6jPeMOJj7wPmCQ7gqdVX1Zx_TVzYFMsn8gYmMDhKbja_7WvKMt05ZyphOSwbn2O1AU49avEXku-YafOClF_Cwlds9PbHbxlfyzss--QZtXjT1Sx4oaIXDRqkWBag78kyVEbiVZVDSJfcyvFPWqdHOg",
      alt: "یک میزبانی ویژه",
      title: "یک میزبانی ویژه",
      description: "شرایط ویژه مدیریت میزبان در پلتفرم اختصاصی سفرینو به میزبانان قدرت تصمیم‌گیری، تقویم باز و مدیریت خودکار قیمت‌ها را فراهم می‌آورد.",
    },
    {
      imgSrc: "https://lh3.googleusercontent.com/aida-public/AB6AXuBuLi_e-ShuG1NZ9HhZ_bfGBGuj-Ciqq169jcXgNOFKIqRPAxWxUGIHxBVVjRVbLAXWzCIUvTQeTjZ8Rw4mzaLbF_czfTmQt9a5281jhtQi62Y4tkggiWZGoobkeGzjnOxTvm8R_nNhn-QYgY3nHSXTfC-jrJpbJwuAAk9DUFQOrLBOYXkk6F2o5ex3VhE9X5HJ8KKyyh3XwwdWhGxWeqzkF8YCEVtAI6mzqQlf9A",
      alt: "پلتفرم سفر",
      title: "تخصصی‌ترین پلتفرم سفر در جهان",
      description: "پلتفرم جامع گردشگری با قابلیت پرداخت به انواع کارت‌ها و پشتیبانی ۲۴ ساعته در هفت روز هفته با سرعت و امنیت بسیار بالا.",
    },
  ];

  const cityChips = [
    { label: "اقامتگاه‌های مازندران", icon: "fa-tree", iconColor: "text-emerald-600" },
    { label: "اقامتگاه‌های تهران", icon: "fa-city", iconColor: "text-blue-600" },
    { label: "ویلاهای شیراز", icon: "fa-mountain-sun", iconColor: "text-amber-600" },
    { label: "اقامتگاه‌های مشهد", icon: "fa-mosque", iconColor: "text-indigo-600" },
    { label: "بوم‌گردی‌های یزد", icon: "fa-sun", iconColor: "text-yellow-600" },
    { label: "ویلاهای کیش", icon: "fa-water", iconColor: "text-cyan-600" },
    { label: "اقامتگاه‌های قشم", icon: "fa-umbrella-beach", iconColor: "text-teal-600" },
    { label: "اقامتگاه‌های همدان", icon: "fa-landmark", iconColor: "text-stone-600" },
  ];

  return (
    <section className="py-10 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-black text-slate-800">
            سفرینو پنجره ای به دنیای گردشگری
          </h2>
          <p className="text-xs text-gray-400 mt-1">
            امکانات و ویژگی‌های انحصاری برای مسافران و میزبانان محترم
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featureData.map((f, i) => (
            <FeatureCardAcom key={i} {...f} />
          ))}
        </div>

        <div className="mt-10 grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-4 gap-3 text-xs">
          {cityChips.map((c, i) => (
            <CityChip key={i} {...c} />
          ))}
        </div>
      </div>
    </section>
  );
}

function ListingSection1() {
  const cards = [
    {
      imgSrc: "https://lh3.googleusercontent.com/aida-public/AB6AXuDury7HrJ6RM1kacSHS7ogFYZ6NZqsH5uTPlmWh-6QjYKrOKhXb-WK71Bmfcvaj5ZXYtqV6DflofAsoXGKmrFAFdfkIfko5-PRjmER54a1nvWJc5AzOOC8vxjNPmsz19uhbEDtZv8S3yK55tFckmFY3y-hPVz0bg-2F9FdAufMWDwnL6a5WSF0V1KW9m9cq0TWKREU5XmRrsjhubibTE4FnA3cLY3XyowNxxlxpUw",
      alt: "اقامتگاه",
      location: "تهران، سعادت آباد",
      badge: "استخردار • ۴ خواب",
      title: "ویلا عمارت اختصاصی اسپیناس پلاس",
      price: "۲,۸۰۰,۰۰۰",
    },
    {
      imgSrc: "https://lh3.googleusercontent.com/aida-public/AB6AXuCmI96XbGqO9oCcrWxkWzST2IbJltxgco2qoVP5L9yaicC71hVGC4BEAyWYIz4jIYrtc3PSCmEG75JbE-GUQxYWJBEt3N1KHLhmBLVAM5QiczgNg-r0FNXprvEm988r9NBW5O_IZ3nC7ZATJ_A9mw6KL6wsMxova6BuzYgIInF-mV9_0Dtxhb2sadSodEDFpZNuaC46iO3nzvf-kxBZHDp_FZ_JdBfP6mFPNbQSog",
      alt: "اقامتگاه",
      location: "مازندران، نوشهر",
      badge: "جنگلی • دوبلکس",
      title: "ویلا جنگلی مدرن چلیک",
      price: "۳,۴۰۰,۰۰۰",
    },
    {
      imgSrc: "https://lh3.googleusercontent.com/aida-public/AB6AXuBi_e7UQFcbiOXobNGMoVprVU0yoP6FzopchkE2puMz2YRObVWnJfQCu2mPWdmO3QIQBmj-uc2SeWXl_oKzDWrk9frllKS2vesNnlLHM0WRAIu5TNn88QWMhM1cpeOP462amyBS9BoOjEf2nkseg-fQtAyS8FH-acW_WDrCn6gYvKzD9ssqJm2ckxB84cMvY_PSFlraRxejtvJB5Kdy4ukC_7m6TyVIABPD2JWBSw",
      alt: "اقامتگاه",
      location: "یزد، بافت تاریخی",
      badge: "سنتی • حوض‌دار",
      stars: 4.5,
      title: "اقامتگاه بوم‌گردی نگین کویر",
      price: "۱,۶۵۰,۰۰۰",
    },
    {
      imgSrc: "https://lh3.googleusercontent.com/aida-public/AB6AXuBRhwDyfzVeMC3ssD5KJoEcWcBfav0hQNRrP5dqin0FxAZO_1kaLsNhEcjSKi-wMilVMuu12dxFdut9g7krou6O5un01N5gqXhgy6eMml2LtYvoU8ivCOlkhPsnbd6ZWR3alQj_NGvWl-ZFTpJ9v2WUuSFiwpyJvuq9SEDreyhGrQgkfsxVAa4T2lwI33Q1KhS4ppvG8_YYJifRYeS56e2cKAXxSdJhhrmxRSrdmQ",
      alt: "اقامتگاه",
      location: "جزیره کیش، مرجان",
      badge: "دید دریا • تریپلکس",
      title: "ویلا ساحلی صدف کیش",
      price: "۴,۲۰۰,۰۰۰",
    },
  ];

  return (
    <section className="py-10 bg-gray-50/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-black text-slate-800">برترین اقامتگاه‌های ایران</h3>
          <a href="#" className="text-[#e21b5b] text-xs font-bold hover:underline flex items-center gap-1">
            <span>همه اقامتگاه‌ها</span>
            <i className="fa-solid fa-angle-left text-[10px]"></i>
          </a>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {cards.map((card, i) => (
            <AccomCard key={i} {...card} badge={card.badge} />
          ))}
        </div>
      </div>
    </section>
  );
}

function ListingSection2() {
  const cards = [
    {
      imgSrc: "https://lh3.googleusercontent.com/aida-public/AB6AXuCK7m0D6mMZjAOut8oLSSrHNrd33FdFjaKQU7maIpYbDEaRdCjgC8H47uKgsoOwOJJJgJwtsAIUP_nz8W6TC4h7B9oAUhXe9OMjdC0B83oPbPA-OnTKeBDzPcAdsBOCwg-tAQoQPHHR08ICUBtJmUIUBqEFFHk_vGsqQL9PW-gg0-aJ7U1r6V_nhvXhxWpXcGENY0Th-byYHTraIc3VhwKI_-KyXSGjoXJEOJrdXA",
      alt: "اقامتگاه",
      label: "۱۰٪ تخفیف",
      labelColor: "bg-[#e21b5b]",
      location: "",
      availableText: "تخفیف اولین رزرو",
      title: "کلبه سوئیسی چوبی ماسال",
      price: "۱,۸۰۰,۰۰۰",
      originalPrice: "۲,۰۰۰,۰۰۰",
    },
    {
      imgSrc: "https://lh3.googleusercontent.com/aida-public/AB6AXuAgU6GcIGxv5DHp_j01hMCksha4NmyxPw9JrqDrvfF8v1Dlcm7TrYudYj-PPR7DRAkJb5GEIOA1HfRyLmiWKqPfh2y_FqFA-re_MQQjvvr2wNqhX7RmTVk6FA8T6a2M02qclb6H0puyZZnIRIgXdA2_vdrDu27INUc70sUU6uYSvGHqzKbIdv3ux8fBEMPT2L-OfQQq-eY86NhLSPrAzr3SJ91jPPNLJZd-UM57Xg",
      alt: "اقامتگاه",
      label: "۱۵٪ تخفیف",
      labelColor: "bg-[#e21b5b]",
      location: "",
      availableText: "تخفیف اولین رزرو",
      title: "باغ ویلا مجلل کردان",
      price: "۲,۹۵۰,۰۰۰",
      originalPrice: "۳,۵۰۰,۰۰۰",
    },
    {
      imgSrc: "https://lh3.googleusercontent.com/aida-public/AB6AXuDb5fick9U8tNgBHhVhVzR9o_lAAM8P-tBcdK6RmTh4ZixXpqiBawyEw9MfEj5CUn7mk-fKqmrWPp10u_1p4swUO_rrFUjzHwYAOaTLbofT_leecxhAFr3s7SIhGjcFZqk6yr81ARhlKR7ZlY1EK2-3XeAaFmllws1-xGTPQxi7NJKZMQ1dauNHzRcX697xCN-K_YrlRwmz6_2tW3kzPpABTHITqKqFBeaoq4LJcA",
      alt: "اقامتگاه",
      label: "۱۰٪ تخفیف",
      labelColor: "bg-[#e21b5b]",
      location: "",
      availableText: "تخفیف اولین رزرو",
      title: "سوئیت مدرن سنتی جلفا اصفهان",
      price: "۱,۰۸۰,۰۰۰",
      originalPrice: "۱,۲۰۰,۰۰۰",
    },
    {
      imgSrc: "https://lh3.googleusercontent.com/aida-public/AB6AXuCTKWPp4kCBuipXZO14-8i_3CqaJhaWrLIYByoq7x_zmXvYysMV7gDJkCRC7O175HTceTlLQBQsmkmeWzYEgMRZ9WT7PZhWwdfyGlOPCz21q3UT5-zct5x59jeED46tmsKkIg1NTb-0jz_gT3h8TGks9EbhmDprW2Ostx3cuDduHT85qTixr4U-wD_-K1_Ja-YkNrP5MseM3ysv9pJWsGk677gb12BoGX24Qi1cAw",
      alt: "اقامتگاه",
      label: "۱۰٪ تخفیف",
      labelColor: "bg-[#e21b5b]",
      location: "",
      availableText: "تخفیف اولین رزرو",
      title: "ویلا نوساز پلاک اول دریا انزلی",
      price: "۲,۵۰۰,۰۰۰",
      originalPrice: "۲,۸۰۰,۰۰۰",
    },
  ];

  return (
    <section className="py-10 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-xl font-black text-slate-800">
              اقامتگاه‌های با تخفیف اولین رزرو
            </h3>
            <p className="text-xs text-gray-400 mt-1">
              تخفیف ویژه سفر اولی‌های سفرینو در سراسر کشور
            </p>
          </div>
          <a href="#" className="text-[#e21b5b] text-xs font-bold hover:underline flex items-center gap-1">
            <span>همه اقامتگاه‌ها</span>
            <i className="fa-solid fa-angle-left text-[10px]"></i>
          </a>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {cards.map((card, i) => (
            <AccomCard
              key={i}
              {...card}
              label={card.label}
              labelColor={card.labelColor}
              availableText={card.availableText}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

function ListingSection3() {
  const cards = [
    {
      imgSrc: "https://lh3.googleusercontent.com/aida-public/AB6AXuBLm0jUsyYBogH1GMLwgf8YjWJ94sWhFa9K4i0YpEiCpbY3R8gAZWFj3w-s7NsRph1bnwFe2Js3SGuEwripCSrwL-IH5QQ2YOR131rd0ZerZZnl1XCtwAEUYZn5iI3Aw3hoqjSUMeQfyO9y_sDA9I5q389ZDsGhIyG8Zx3jt2hFKVk0gw_-KpZePXQaek0xHAr6ENxTNvK8OwAx2-NkAyRXrQ6q6mGrde-ISu5yzQ",
      alt: "اقامتگاه",
      label: "باشگاه وفاداری",
      labelColor: "bg-amber-500",
      location: "رامسر، بلوار کازینو",
      title: "پنت‌هاوس ساحلی یاس رامسر",
      price: "۲,۲۰۰,۰۰۰",
    },
    {
      imgSrc: "https://lh3.googleusercontent.com/aida-public/AB6AXuCNyeBcUKrbLTaJFut-eFv0QjJe82XK3dv-MJFxN2-DXAfxn0P0-1vKdi0VPpxMyaBcmpLtTEvNDYLASAE3ukvEfKF0j-4PpsWfWU0jUBkwtIpZDBpB1nuywzgjyhyR3Uxd2fn5aCcNjQAgfHlZJdR3P0TjF8phuxEsQ-CyMgCJpBGO5QF7xHswfIW6-ygeUwKEn0qKPV2B8lg3qg3eLgaup-4gIkX47ZsqImMIjA",
      alt: "اقامتگاه",
      label: "باشگاه وفاداری",
      labelColor: "bg-amber-500",
      location: "شیراز، قلات",
      title: "باغ عمارت سنتی ترنج",
      price: "۱,۹۰۰,۰۰۰",
    },
    {
      imgSrc: "https://lh3.googleusercontent.com/aida-public/AB6AXuCPR4HxfPBHf6bgfmSMYclZocRO-QpwscBLc6vW4BONrW5WpS03XJlBn-WLYRd2DyiikQ2llZaw7x6fo2QhVvLzvXNjN9_1onbL4hOKzR8rfEtRHT-1TjhUP3tIH5tiobuslxi_vFrnUnozDNmWc7H8nRDdM9xbG-coASPNNgKHXKnxMB5yOfChQcBkh1hk9dxo6ppDHbnABuOLq1_9pTwTvel3nUGEG8b286k9Dw",
      alt: "اقامتگاه",
      label: "باشگاه وفاداری",
      labelColor: "bg-amber-500",
      location: "مشهد، طرقبه",
      title: "ویلا استخردار آبگرم طرقبه",
      price: "۲,۶۰۰,۰۰۰",
    },
    {
      imgSrc: "https://lh3.googleusercontent.com/aida-public/AB6AXuBcLqjO_Cs8wDBJedfh07sk2TP8ytzuKz6hDk4e2KJkx7wDnqlObe66DXyFDyUfq2kdhOE9bZSVI_tDY32EZLXhhSyPuHz81vN242UOoZI_VD1DS_AkDO8SaiVwAdXVnEU7-hLMsOr9BZD4l3vv4WCH7BY4faTTcT-uU2m2UE5PUuw_Hj5BQgM7uNoVS3n3KtqCZ_KSIVTU-x3qB-1QqgH1I6daWMzFb60vAezhYw",
      alt: "اقامتگاه",
      label: "باشگاه وفاداری",
      labelColor: "bg-amber-500",
      location: "مازندران، کلاردشت",
      title: "کلبه درختی منظره ابدی",
      price: "۱,۷۵۰,۰۰۰",
    },
  ];

  return (
    <section className="py-10 bg-gray-50/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-xl font-black text-slate-800">
              اقامتگاه‌های با تخفیف وفاداری
            </h3>
            <p className="text-xs text-gray-400 mt-1">
              ویژه اعضای باشگاه مشتریان طلایی و نقره‌ای سفرینو
            </p>
          </div>
          <a href="#" className="text-[#e21b5b] text-xs font-bold hover:underline flex items-center gap-1">
            <span>همه اقامتگاه‌ها</span>
            <i className="fa-solid fa-angle-left text-[10px]"></i>
          </a>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {cards.map((card, i) => (
            <AccomCard key={i} {...card} />
          ))}
        </div>
      </div>
    </section>
  );
}

function ListingSection4() {
  const cards = [
    {
      imgSrc: "https://lh3.googleusercontent.com/aida-public/AB6AXuAD2-3_F02hMzABjwkRyrpYXUxLLo7qeqdovTq241t2FyeJAGwmauSzhW-8Ikn-8EJ-GFNXTKsXdz9F49yfHNev3R1v6x9vW83ZKKMd9stBIh3TWzLpckzBrreYlj41g_sW4mSmajIlKnpQ7FeRQ4CKL8lNB1ni2Fu1rFNSdv1EZc28LHakKi_zKTxLDYPRP5yGujG_u8sZvTSG-GQMiKgFGCk9LRTCJiKB_qQ3NA",
      alt: "اقامتگاه",
      label: "۳۰٪ تخفیف",
      labelColor: "bg-red-600",
      location: "چالوس، رادیو دریا",
      availableText: "امشب خالی",
      title: "ویلا ساحلی استخردار موج",
      price: "۲,۱۰۰,۰۰۰",
      originalPrice: "۳,۰۰۰,۰۰۰",
    },
    {
      imgSrc: "https://lh3.googleusercontent.com/aida-public/AB6AXuClISncFlmzqgsKV8I0SY80fnu2qQPv6NPM-jIpExZJjYUcmhVk_sL9acbrIxpk_9Oja0-BQZ9zfr_y5ltbFdKFiT5K6KtK_o_JM0_4xskBpG78_2ip-VFpuZsrUzTBGo6Xv6p00hmYE589hmATBPz8FTnBZFXXqLx2-RsGnKaTfTW4pBJMbAmwOAeXMERBn5klVkZDpakdnqTc-Ahh7kzwqfp5LS2F7qMonnNjFA",
      alt: "اقامتگاه",
      label: "۲۵٪ تخفیف",
      labelColor: "bg-red-600",
      location: "گیلان، فومن",
      availableText: "امشب خالی",
      title: "کلبه روستایی شالیزار",
      price: "۱,۲۰۰,۰۰۰",
      originalPrice: "۱,۶۰۰,۰۰۰",
    },
    {
      imgSrc: "https://lh3.googleusercontent.com/aida-public/AB6AXuCqEp5YMriPCap7TfWFBrlCxvNxnSTNNYpWuHSFn88QZpWUdSfrrlaYurQc5NaSAOGmZ2YaNAcLiT2ovtgXoZAi_doG8SQomn87lrp71bDKTJAIsA6TooWgqa62ZrtuKTY7WqC1trAlt9ZRuHBL8UtMxr8z06PtfUC84Dy8oy7XnGKFRmEkFOo5DsKu6NdzFRxq_w2I2JlFJVgWw12FO7kPz29tLz9-R9El4YIw6g",
      alt: "اقامتگاه",
      label: "۲۰٪ تخفیف",
      labelColor: "bg-red-600",
      location: "البرز، سهیلیه",
      availableText: "امشب خالی",
      title: "ویلا استخر روباز آبگرم سهیلیه",
      price: "۲,۲۴۰,۰۰۰",
      originalPrice: "۲,۸۰۰,۰۰۰",
    },
    {
      imgSrc: "https://lh3.googleusercontent.com/aida-public/AB6AXuD9b1qoCYiM4uh2m0f2qIpXTXshXwa1CvwK2kje_kbOH8aAn9uS0c7-t7crWgl4HDYkCHIxBmEh9T4UVWAriiG_X5NCOd7keL5AAwiWB7d8-QU0tDeWzIKvPQadtBDpna03NXYu5EI0Bk2XvxNlccujISPzMlgitaF7NoxP8CD6VvorKAkqfskA5m50dVo_EThojM5GOT3yqGFSRq4yijVHKXheVvs4qJzEc5fV_g",
      alt: "اقامتگاه",
      label: "۳۵٪ تخفیف",
      labelColor: "bg-red-600",
      location: "مازندران، متل قو",
      availableText: "امشب خالی",
      title: "ویلا جنگلی لوکس متل قو",
      price: "۲,۶۰۰,۰۰۰",
      originalPrice: "۴,۰۰۰,۰۰۰",
    },
  ];

  return (
    <section className="py-10 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-4">
            <h3 className="text-xl font-black text-slate-800">
              اقامتگاه‌های تخفیف لحظه آخری
            </h3>
            <div className="flex items-center gap-1.5 bg-slate-900 text-white px-3 py-1.5 rounded-xl font-mono text-sm font-bold tracking-wider">
              <span className="bg-slate-800 px-1.5 py-0.5 rounded">07</span>
              <span>:</span>
              <span className="bg-slate-800 px-1.5 py-0.5 rounded">18</span>
              <span>:</span>
              <span className="bg-slate-800 px-1.5 py-0.5 rounded text-rose-400">34</span>
            </div>
          </div>
          <a href="#" className="text-[#e21b5b] text-xs font-bold hover:underline flex items-center gap-1">
            <span>همه اقامتگاه‌ها</span>
            <i className="fa-solid fa-angle-left text-[10px]"></i>
          </a>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {cards.map((card, i) => (
            <AccomCard
              key={i}
              {...card}
              borderColor="border-rose-200"
              label={card.label}
              labelColor={card.labelColor}
              availableText={card.availableText}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

function TravelCardsSection() {
  return (
    <section className="py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <TravelCard
            badge="راهکار شرکتی"
            badgeColor="text-[#e21b5b] bg-[#fff1f2]"
            title="سفر کارت سفرینو"
            items={[
              "بن کارت سفر ویژه کارکنان",
              "سفر کارت سازمان‌ها و ارگان‌ها",
              "موتور باشگاه مشتریان وفادار",
            ]}
            buttonText="اطلاعات بیشتر"
            buttonColor="bg-[#0284c7] hover:bg-[#0369a1]"
            imgSrc="https://lh3.googleusercontent.com/aida-public/AB6AXuD_-a50gJknJGOpoOghl1qiAU5AECNxpBFN1Ne_zdDweiYA22KQ6BS0eYGCtOCWtc4lpYro3-hvQSNii_5bnYXagN8Goq5ET86O9B8m6gUpZ0CyuR7ThgOYuALQe3bG7YHGHDW2gF4Trctu9todE-Z5myro4gVnKLhdfCz13iL8JNMjsqZlFRn2ZYkk2HjY1vpb0534G2yrX456L6U-aQBxyb9vXVqKpu-hk3mg_Q"
            imgAlt="سفر کارت سفرینو"
            rotate={2}
          />
          <TravelCard
            badge="هدیه به یادماندنی"
            badgeColor="text-amber-600 bg-amber-50"
            title="کارت هدیه سفر"
            items={[
              "انتخاب مبالغ دلخواه از ۵۰۰ هزار تا ۵۰ میلیون",
              "امکان درج متن دلخواه و تبریک شخصی‌سازی شده",
              "اعتبار نامحدود زمانی در کلیه هتل‌ها و اقامتگاه‌ها",
            ]}
            buttonText="خرید کارت هدیه"
            buttonColor="bg-[#e21b5b] hover:bg-[#d1134e]"
            imgSrc="https://lh3.googleusercontent.com/aida-public/AB6AXuAgdkCmA34VaxvC2iK13-sNJyQd5YOqkrxvW4zawDmpUDG_SkGj-WwbLoaUz0Kubug2KhlsZf_vGHfUvqkOsNgOW90P4cxgF-8oI4kKQFQtXeufmMP_p5zhFsb2YvZlM9WUZecJpipdt6RGNFvJYatrnKHnQAOubLxvm8pNIT0olEl7F1ZIsF4BMUxH8743m1ftK_MVvidS8pdjzDcvKtnUrhdNLyC4BaI_wT4jUg"
            imgAlt="کارت هدیه سفرینو"
            rotate={-2}
          />
        </div>
      </div>
    </section>
  );
}

function SeoContentBlock() {
  return (
    <section className="py-12 bg-white border-y border-gray-100">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-justify">
        <div className="border-r-4 border-[#e21b5b] pr-3 mb-6">
          <h2 className="text-xl font-black text-slate-800">
            رزرو ویلا، سوئیت و اقامتگاه بوم‌گردی در سفرینو
          </h2>
          <p className="text-xs text-gray-500 mt-1">
            تجربه اقامت خاطره‌انگیز و بدون دغدغه در مطمئن‌ترین شبکه اقامتی کشور
          </p>
        </div>
        <div className="space-y-4 text-xs leading-relaxed text-gray-600">
          <p>
            سامانه سفرینو به عنوان یکی از پیشگامان صنعت گردشگری الکترونیک در کشور، بستری هوشمند و مطمئن را برای رزرو انواع هتل‌ها، اقامتگاه‌های بوم‌گردی، ویلاهای استخردار لوکس، کلبه‌های جنگلی و سوئیت‌های مبله فراهم ساخته است. با سفرینو شما می‌توانید قبل از اقدام به سفر تمامی امکانات، نظرات واقعی مسافران، تصاویر ۳۶۰ درجه اتاق‌ها و تخفیف‌های ویژه فصلی را مقایسه کنید و اقامتگاه ایده‌آل خود را با تضمین کمترین قیمت نهایی نمایید.
          </p>
          <h3 className="font-bold text-slate-800 text-sm pt-2">
            رزرو آسان آنلاین اقامتگاه در سراسر ایران
          </h3>
          <p>
            با ظهور اینترنت، رزرو اقامتگاه بدون نیاز به تماس‌های مکرر یا سردرگمی در مقصد بسیار ساده است. شما می‌توانید در ۲۴ ساعت شبانه‌روز و ۷ روز هفته تنها با چند کلیک هتل مورد نظر خود را با تضمین تحویل فوری واچر نهایی کنید. تیم پشتیبانی سفرینو از لحظه جستجو تا پایان سفر همراه مطمئن شما خواهد بود.
          </p>
        </div>
      </div>
    </section>
  );
}

function MobileAppBanner() {
  return (
    <section className="py-10">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-rose-50 via-pink-50 to-white border border-rose-100 rounded-3xl p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-8 relative overflow-hidden">
          <div className="flex items-center gap-6">
            <div className="bg-white p-3 rounded-2xl border border-gray-200 shadow-sm text-center">
              <div className="w-24 h-24 bg-gray-50 flex items-center justify-center rounded-lg border border-dashed border-gray-300">
                <i className="fa-solid fa-qrcode text-5xl text-slate-700"></i>
              </div>
              <span className="block text-[10px] text-gray-500 font-bold mt-2">
                برای دانلود اسکن کنید
              </span>
            </div>
            <div>
              <span className="text-xs font-bold text-[#e21b5b] block mb-1">
                نسخه جدید منتشر شد
              </span>
              <h3 className="text-xl font-black text-slate-800 mb-2">
                اپلیکیشن سفرینو
              </h3>
              <p className="text-xs text-gray-500 mb-4">
                سریع‌تر و مطمئن‌تر به سفر بروید. دسترسی به تخفیف‌های ویژه اپلیکیشن.
              </p>
              <div className="flex items-center gap-3">
                <a href="#" className="bg-slate-900 text-white hover:bg-slate-800 px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-colors">
                  <i className="fa-brands fa-apple text-base"></i>
                  <span>نسخه iOS</span>
                </a>
                <a href="#" className="bg-slate-900 text-white hover:bg-slate-800 px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-colors">
                  <i className="fa-brands fa-android text-base text-emerald-400"></i>
                  <span>نسخه اندروید</span>
                </a>
              </div>
            </div>
          </div>
          <div className="relative w-60 h-44 rounded-2xl overflow-hidden shadow-xl border-2 border-white">
            <Image
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuCPEguL3Mhc__npHZB8y2ZJrg-zQ_2X8Hb6GbY1u_14mIB3gB8rvwwg80L_UCDFKjlYHgGS07vO3OBDFmE4uIydjJIGRayF972QeH_3--wb1E1x7_wpu8tLe37CSh1fY8P361ZM6at6gUXOhUYqMQeg63p5Mh-LrMRSyXLrEMYutRG8O90ibP31MEo8knIWKkVv81GcS2K5O0nwSv-Js1Wovo92ysTjD9pQCIlt5w"
              alt="اپلیکیشن سفرینو"
              className="w-full h-full object-cover"
              fill
              sizes="(max-width: 640px) 100vw, 300px"
            />
          </div>
        </div>
      </div>
    </section>
  );
}

function FaqAccordionSection() {
  const faqs = [
    {
      index: 1,
      question: "پیش از رزرو هتل یا اقامتگاه، چگونه درباره هتل و فرآیند رزرو آن اطلاعات کسب کنم؟",
      answer: "فرآیند انتخاب و رزرو آنلاین در علی بابا بسیار ساده است: به سادگی و با چند کلیک می‌توانید با انتخاب مقصد و تاریخ سفر، اقامتگاه مد نظر خود را با قیمت مناسب رزرو کنید. با این حال در صورت نیاز، مرکز پشتیبانی ۲۴ ساعته سفرینو در تمامی مراحل پاسخگوی شماست.",
      initiallyOpen: true,
    },
    {
      index: 2,
      question: "شرایط کنسلی رزرو اقامتگاه و ویلا در سفرینو چگونه است؟",
      answer: "",
    },
    {
      index: 3,
      question: "آیا رزرو آنلاین در سفرینو با تضمین کمترین قیمت انجام می‌شود؟",
      answer: "",
    },
    {
      index: 4,
      question: "چگونه می‌توانم به عنوان میزبان اقامتگاه خود را در سفرینو ثبت کنم؟",
      answer: "",
    },
  ];

  return (
    <section className="py-12 bg-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h3 className="text-2xl font-black text-slate-800">
            پرسش‌های متداول درباره رزرو اقامتگاه در سفرینو
          </h3>
          <p className="text-xs text-gray-400 mt-1">
            پاسخ سریع به رایج‌ترین پرسش‌های مسافران و کاربران گرامی
          </p>
        </div>
        <div className="space-y-3">{faqs.map((f) => <FaqItemAcom key={f.index} {...f} />)}</div>
      </div>
    </section>
  );
}

function TravelBlogSection() {
  const blogData = [
    {
      imgSrc: "https://lh3.googleusercontent.com/aida-public/AB6AXuAWPA6XxVAybx4spbyrVRNLkqkxd54E1Etze4J3szgSUx8tJEBr64y6kNmjSyDfqKFeaxZ2K00AZLL3S-ld9CKUdUWykUOWxUmIBKIcc5V5q_XPQpLVsm5Cd1aPAHod7xNOphL1oTMRoBiLZ54OgSmV4ghR3t0P8TbeHYtC7xcMygczP0Gat2XUQY-raw6G7ZvG9cvxJbywdGYFI_ZWtZyfAV8agecdFvxYUM6_JQ",
      alt: "گردشگری در زمستان",
      title: "گردشگری در زمستان ۱۴۰۴",
      excerpt: "بررسی مقاصد برتر گردشگری ایران، اقامتگاه‌های کویر و تجربه‌های فراموش‌نشده در سفر زمستانه.",
      date: "۱۴۰۴/۱۲/۱۵",
    },
    {
      imgSrc: "https://lh3.googleusercontent.com/aida-public/AB6AXuDGqbfnCGHUZAh1Om1MSidi2qIuJzK0xr1bZZ6JzepZ_XyNKrKT6aqLxjl7K9lA6JG_2kVO__H5LGbTDaz5rBYkRgX2dSyVzjxZp7JY7F7ycXXNU61ZVMJFKvm-vUlPXHkDcfDIWoc7aDfq-NalVmd4BBLKrST5yIhqW7MFtr-7wgtKG1m5MEezN9FZL504imEeiH3j74WrDS5K9P_IHYy7niytmwNx0ERRzUkgCA",
      alt: "کلبه‌های شمال",
      title: "زیباترین کلبه‌های چوبی گیلان و مازندران",
      excerpt: "معرفی بهترین کلبه‌های سوئیسی در دل جنگل‌های هیرکانی با امکانات رفاهی کامل و لوکیشن بی‌نظیر.",
      date: "۱۴۰۴/۱۲/۱۴",
    },
    {
      imgSrc: "https://lh3.googleusercontent.com/aida-public/AB6AXuAOUQPhkKWGPIRe6I5ExIlNjEgZDaD24nOH8EPeMeZGippsaXRMBO6cYXuQdahl-RVy7ZKawYf9e67SnowFvFX77UN-2_7mH9QnqLs925xBXCWy65nM4TCOVGE4Mq_VR-osUBJPG-OAQ1d1rLsZmajtvIl3P96OMYuo79SYSlgsrtq7ZZ9AkZFXZAKvj80r0nWyG3_mmJqS473Th-sRbt-Ufvu0ClEHuYOO3hDgAg",
      alt: "کیش و قشم",
      title: "اقامت در جنوب؛ کیش یا قشم؟",
      excerpt: "مقایسه جامع هزینه‌ها، ویلاهای ساحلی و جاذبه‌های گردشگری دو جزیره محبوب خلیج فارس.",
      date: "۱۴۰۴/۱۲/۱۲",
    },
    {
      imgSrc: "https://lh3.googleusercontent.com/aida-public/AB6AXuDnFZxIDDXFFPlID1aXbFBBGcE-fXJt5VTa8NoBxWmU_DJxXj4So0YNzyvqEgDvEFkQ2nGXe7dwokDVcparw63zKxlIB2vCfmNQ_DCqONF3LrBGWDRWane1C4MYJUIe6x3NLQ6s3trXsK_BkjhgCI2ayIArBGec7_u-QnAHec9XIPmhXbka5Xbk_UIeE1tT1FtwsRLdwuOb_J87CmYRtMQ6lOqTMqCk2sCDJx6xMg",
      alt: "اصفهان تاریخی",
      title: "اقامت در خانه‌های صفوی اصفهان",
      excerpt: "تجربه حس زندگی در دل تاریخ با رزرو هتل سنتی و بوم‌گردی‌های باشکوه اصفهان و کاشان.",
      date: "۱۴۰۴/۱۲/۱۰",
    },
  ];

  return (
    <section className="py-12 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <h3 className="text-2xl font-black text-slate-800">
            سفر در مجله گردشگری سفرینو
          </h3>
          <p className="text-xs text-gray-400 mt-1">
            تازه ترین مقالات، راهنمای سفر و معرفی مقاصد جذاب ایران و جهان
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {blogData.map((b, i) => (
            <article
              key={i}
              className="bg-white rounded-2xl overflow-hidden border border-gray-200 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between"
            >
              <div>
                <div className="relative aspect-[16/10] overflow-hidden">
                  <Image
                    src={b.imgSrc}
                    alt={b.alt}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                            />
                </div>
                <div className="p-4">
                  <span className="text-[10px] font-bold text-[#e21b5b] bg-rose-50 px-2 py-0.5 rounded">
                    راهنمای سفر
                  </span>
                  <h4 className="font-bold text-slate-800 text-sm mt-2 mb-2 line-clamp-1">
                    {b.title}
                  </h4>
                  <p className="text-xs text-gray-500 line-clamp-2 leading-relaxed">
                    {b.excerpt}
                  </p>
                </div>
              </div>
              <div className="p-4 pt-0 border-t border-gray-50 flex items-center justify-between text-[11px] text-gray-400 mt-2">
                <span>تحریریه سفرینو</span>
                <span>{b.date}</span>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function MainFooter() {
  return (
    <footer className="bg-white border-t border-gray-200 pt-12 pb-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Guarantee Badges Row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 pb-10 border-b border-gray-100 text-center">
          {[
            { icon: "fa-headset", title: "پشتیبانی ۲۴ ساعته", desc: "پاسخگویی در تمام ایام سال" },
            { icon: "fa-tags", title: "تضمین بهترین قیمت", desc: "نرخ مصوب و منصفانه" },
            { icon: "fa-bolt", title: "صدور آنی واچر", desc: "تایید قطعی در کوتاه‌ترین زمان" },
            { icon: "fa-shield-halved", title: "خرید مطمئن و امن", desc: "دارای نماد اعتماد الکترونیک" },
          ].map((item, i) => (
            <div key={i} className="flex flex-col items-center">
              <div className="w-12 h-12 rounded-2xl bg-rose-50 text-[#e21b5b] flex items-center justify-center text-xl mb-3">
                <i className={`fa-solid ${item.icon}`}></i>
              </div>
              <h5 className="text-xs font-bold text-slate-800 mb-1">{item.title}</h5>
              <span className="text-[11px] text-gray-400">{item.desc}</span>
            </div>
          ))}
        </div>

        {/* Links & Navigation Columns */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-8 py-10 text-xs">
          <div>
            <h5 className="font-bold text-slate-800 text-sm mb-4">سفرینو</h5>
            <ul className="space-y-2 text-gray-500">
              <li><a href="#" className="hover:text-[#e21b5b] transition-colors">درباره سفرینو</a></li>
              <li><a href="#" className="hover:text-[#e21b5b] transition-colors">تماس با ما</a></li>
              <li><a href="#" className="hover:text-[#e21b5b] transition-colors">چرا سفرینو؟</a></li>
              <li><a href="#" className="hover:text-[#e21b5b] transition-colors">فرصت‌های شغلی</a></li>
              <li><a href="#" className="hover:text-[#e21b5b] transition-colors">بیمه مسافرتی</a></li>
            </ul>
          </div>
          <div>
            <h5 className="font-bold text-slate-800 text-sm mb-4">خدمات مسافران</h5>
            <ul className="space-y-2 text-gray-500">
              <li><a href="#" className="hover:text-[#e21b5b] transition-colors">مرکز پشتیبانی آنلاین</a></li>
              <li><a href="#" className="hover:text-[#e21b5b] transition-colors">راهنمای رزرو هتل</a></li>
              <li><a href="#" className="hover:text-[#e21b5b] transition-colors">راهنمای استرداد</a></li>
              <li><a href="#" className="hover:text-[#e21b5b] transition-colors">قوانین و مقررات</a></li>
              <li><a href="#" className="hover:text-[#e21b5b] transition-colors">پرسش و پاسخ</a></li>
            </ul>
          </div>
          <div>
            <h5 className="font-bold text-slate-800 text-sm mb-4">اطلاعات تکمیلی</h5>
            <ul className="space-y-2 text-gray-500">
              <li><a href="#" className="hover:text-[#e21b5b] transition-colors">باشگاه مشتریان سفرینو</a></li>
              <li><a href="#" className="hover:text-[#e21b5b] transition-colors">سفر کارت سازمانی</a></li>
              <li><a href="#" className="hover:text-[#e21b5b] transition-colors">همکاری با آژانس‌ها</a></li>
              <li><a href="#" className="hover:text-[#e21b5b] transition-colors">ثبت اقامتگاه و ویلا</a></li>
              <li><a href="#" className="hover:text-[#e21b5b] transition-colors">مجله گردشگری</a></li>
            </ul>
          </div>
          <div>
            <h5 className="font-bold text-slate-800 text-sm mb-4">ارتباط با ما</h5>
            <p className="text-gray-500 leading-relaxed mb-3">
              تلفن پشتیبانی: ۰۲۱-۸۸۸۸۰۰۰۰<br />
              تهران، خیابان پشتیبانی، برج سفرینو، طبقه ۱۰
            </p>
            <div className="flex items-center gap-3 text-lg text-gray-400">
              <a href="#" className="hover:text-[#e21b5b] transition-colors"><i className="fa-brands fa-instagram"></i></a>
              <a href="#" className="hover:text-[#e21b5b] transition-colors"><i className="fa-brands fa-telegram"></i></a>
              <a href="#" className="hover:text-[#e21b5b] transition-colors"><i className="fa-brands fa-linkedin"></i></a>
              <a href="#" className="hover:text-[#e21b5b] transition-colors"><i className="fa-brands fa-twitter"></i></a>
            </div>
          </div>
        </div>

        {/* Copyright & Bottom Links */}
        <div className="pt-6 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between text-[11px] text-gray-400 gap-3">
          <span>تمامی حقوق این سامانه متعلق به شرکت گردشگری سفرینو می&zwnj;باشد. © ۱۴۰۴</span>
          <div className="flex items-center gap-4">
            <a href="#" className="hover:underline">حریم خصوصی</a>
            <a href="#" className="hover:underline">شرایط استفاده</a>
            <a href="#" className="hover:underline">نقشه سایت</a>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default function AccommodationBookingClient() {
  return (
    <div
      dir="rtl"
      lang="fa"
      className={`${vazirmatn.className} min-h-full bg-gray-50 text-slate-700 antialiased selection:bg-[#e21b5b] selection:text-white`}
    >
      <TopNotificationBanner />
      <MainHeader activeSection="accommodation" />
      <SearchBox
        initialDestination="رامسر، مازندران"
        initialDateRange="۲۵ فروردین ۱۴۰۵ - ۲۹ فروردین ۱۴۰۵"
        initialPassengers="۲ بزرگسال، ۱ کودک"
      />
      <ValuePropositionBanner />
      <ListingSection1 />
      <ListingSection2 />
      <ListingSection3 />
      <ListingSection4 />
      <TravelCardsSection />
      <SeoContentBlock />
      <MobileAppBanner />
      <FaqAccordionSection />
      <TravelBlogSection />
      <MainFooter />
    </div>
  );
}
