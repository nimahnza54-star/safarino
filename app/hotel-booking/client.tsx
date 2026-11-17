"use client";

import Image from "next/image";
import { Vazirmatn } from "next/font/google";
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

type HotelCardProps = {
  imgSrc: string;
  alt: string;
  title: string;
  location: string;
  variant: "best" | "firstDiscount" | "loyalty" | "lastMinute";
  discountPercent?: string;
  discountLabel?: string;
  hasHeart?: boolean;
};

function HotelCard({
  imgSrc,
  alt,
  title,
  location,
  variant,
  discountPercent,
  discountLabel,
  hasHeart = true,
}: HotelCardProps) {
  const isDiscount =
    variant === "firstDiscount" ||
    variant === "loyalty" ||
    variant === "lastMinute";
  const badgeColor =
    variant === "lastMinute"
      ? "bg-red-600"
      : variant === "loyalty"
        ? "bg-amber-500"
        : "bg-[#e21b5b]";
  const badgeText = discountPercent || "۱۰ ٪";

  return (
    <div className="bg-white rounded-2xl overflow-hidden border border-gray-200 shadow-sm hover:shadow-md transition">
      <div className="relative h-48">
        <Image
          src={imgSrc}
          alt={alt}
          className="w-full h-full object-cover"
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
        />
        {variant === "best" && hasHeart && (
          <button className="absolute top-3 left-3 w-8 h-8 rounded-full bg-white/80 hover:bg-white text-gray-700 flex items-center justify-center transition">
            <i className="fa-regular fa-heart"></i>
          </button>
        )}
        {isDiscount && (
          <div className={`absolute top-3 right-3 ${badgeColor} text-white text-[10px] font-bold px-2 py-0.5 rounded-full`}>
            {badgeText}
          </div>
        )}
      </div>
      <div className="p-4">
        <div className="flex items-center gap-1 text-[#f59e0b] text-xs mb-1">
          <i className="fa-solid fa-star"></i>
          <i className="fa-solid fa-star"></i>
          <i className="fa-solid fa-star"></i>
          <i className="fa-solid fa-star"></i>
          <i className="fa-solid fa-star"></i>
        </div>
        <h4 className="font-black text-sm text-gray-900 mb-1">{title}</h4>
        <p className="text-[11px] text-gray-400">{location}</p>
        {isDiscount && (
          <div className="flex items-center justify-between text-xs pt-2 border-t border-gray-100 mt-2">
            <span className="text-gray-500">{discountLabel || "تخفیف"} </span>
            <span className="font-bold text-[#d1134e]">۲۰۰,۰۰۰ تومان</span>
          </div>
        )}
      </div>
    </div>
  );
}

type FeatureCardProps = {
  imgSrc: string;
  alt: string;
  title: string;
  description: string;
};

function FeatureCard({ imgSrc, alt, title, description }: FeatureCardProps) {
  return (
    <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-shadow flex flex-col text-center">
      <div className="h-44 overflow-hidden">
        <Image
          src={imgSrc}
          alt={alt}
          className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
        />
      </div>
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          <h3 className="font-bold text-gray-900 text-base mb-2">{title}</h3>
          <p className="text-xs text-gray-500 leading-relaxed line-clamp-3">
            {description}
          </p>
        </div>
        <a
          href="#"
          className="mt-4 text-xs font-bold text-[#0070cd] hover:text-blue-700 flex items-center justify-center gap-1"
        >
          <span>اطلاعات بیشتر</span>
          <i className="fa-solid fa-angle-left text-[10px]"></i>
        </a>
      </div>
    </div>
  );
}

type FaqItemProps = {
  index: number;
  question: string;
  answer: string;
};

function FaqItem({ index, question, answer }: FaqItemProps) {
  const [open, setOpen] = useState(false);
  const contentId = `faq-content-${index}`;
  const iconId = `faq-icon-${index}`;

  const toggle = () => setOpen((prev) => !prev);

  return (
    <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden transition shadow-sm">
      <button
        onClick={toggle}
        className="w-full flex items-center justify-between p-4 text-right font-bold text-xs sm:text-sm text-gray-800 hover:text-[#e21b5b] focus:outline-none"
      >
        <span className="flex items-center gap-2">
          <span className="w-6 h-6 rounded-full bg-[#e21b5b]/10 text-[#e21b5b] flex items-center justify-center text-xs">
            ؟
          </span>
          <span>{question}</span>
        </span>
        <i
          className={`fa-solid fa-chevron-down text-xs text-gray-400 transition-transform ${
            open ? "rotate-180" : ""
          }`}
          id={iconId}
        />
      </button>
      <div
        id={contentId}
        className={`px-5 pb-4 text-xs text-gray-500 leading-relaxed border-t border-gray-100 pt-3 ${
          open ? "" : "hidden"
        }`}
      >
        {answer}
      </div>
    </div>
  );
}

type BlogCardProps = {
  imgSrc: string;
  alt: string;
  title: string;
  excerpt: string;
  author: string;
  date: string;
};

function BlogCard({ imgSrc, alt, title, excerpt, author, date }: BlogCardProps) {
  return (
    <article className="bg-white rounded-2xl overflow-hidden border border-gray-200 shadow-sm hover:shadow-md transition">
      <div className="h-44 overflow-hidden">
        <Image
          src={imgSrc}
          alt={alt}
          className="w-full h-full object-cover"
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
        />
      </div>
      <div className="p-4">
        <span className="text-[10px] text-[#e21b5b] font-bold bg-[#e21b5b]/10 px-2 py-0.5 rounded-full">
          راهنمای سفر
        </span>
        <h4 className="font-bold text-sm text-gray-900 mt-2 mb-2 line-clamp-1">
          {title}
        </h4>
        <p className="text-xs text-gray-500 line-clamp-2 leading-relaxed mb-4">
          {excerpt}
        </p>
        <div className="flex items-center justify-between pt-3 border-t border-gray-100 text-[11px] text-gray-400">
          <span className="flex items-center gap-1">
            <i className="fa-regular fa-user"></i> {author}
          </span>
          <span>{date}</span>
        </div>
      </div>
    </article>
  );
}

/* ------------------------------------------------------------------ */
/* Page Sections                                                        */
/* ------------------------------------------------------------------ */

function TopNotificationBar() {
  const [visible, setVisible] = useState(true);

  if (!visible) return null;

  return (
    <div className="bg-[#fff9db] border-b border-[#ffe066] text-[#665000] py-2 px-4 text-xs font-medium">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center space-x-2 space-x-reverse">
          <i className="fa-solid fa-circle-exclamation text-amber-600 text-sm"></i>
          <span>
            اطلاعیه مهم: پروازها و اسکان مناطق تحت نظارت با تخفیف ویژه نوروز ۱۴۰۵ ارائه می&zwnj;شود. برای اطلاعات بیشتر با پشتیبانی در تماس باشید.
          </span>
        </div>
        <button
          onClick={() => setVisible(false)}
          className="text-gray-500 hover:text-gray-800 text-sm"
        >
          <i className="fa-solid fa-xmark"></i>
        </button>
      </div>
    </div>
  );
}

function MainHeader() {
  const [moreOpen, setMoreOpen] = useState(false);

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Right: Logo & Primary Navigation */}
          <div className="flex items-center space-x-6 space-x-reverse">
            <a href="#" className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-full bg-[#e21b5b] flex items-center justify-center text-white text-xl font-bold shadow-md shadow-[#e21b5b]/20">
                <i className="fa-solid fa-paper-plane"></i>
              </div>
              <div className="flex flex-col">
                <span className="text-2xl font-black text-[#e21b5b] tracking-tight">
                  سفرینو
                </span>
                <span className="text-[10px] text-gray-400 font-normal -mt-1">
                  سفری به دنیای نو
                </span>
              </div>
            </a>
            <nav className="hidden lg:flex items-center space-x-6 space-x-reverse font-medium text-gray-700 text-sm">
              <a
                href="#"
                className="text-[#e21b5b] font-semibold border-b-2 border-[#e21b5b] pb-1"
              >
                رزرو هتل
              </a>
              <a href="#" className="hover:text-[#e21b5b] transition-colors">
                ویلا و اقامتگاه
              </a>
              <div className="relative group">
                <button
                  onClick={() => setMoreOpen((prev) => !prev)}
                  className="flex items-center gap-1 hover:text-[#e21b5b] py-2 transition-colors"
                >
                  <span>بیشتر</span>
                  <i
                    className={`fa-solid fa-chevron-down text-xs text-gray-400 group-hover:rotate-180 transition-transform ${
                      moreOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>
                <div
                  className={`absolute right-0 top-full ${
                    moreOpen ? "block" : "hidden"
                  } bg-white shadow-xl border border-gray-100 rounded-xl p-3 w-48 text-right text-xs z-50`}
                >
                  <a href="#" className="block px-3 py-2 rounded-lg hover:bg-gray-50 text-gray-700">
                    بیمه مسافرتی
                  </a>
                  <a href="#" className="block px-3 py-2 rounded-lg hover:bg-gray-50 text-gray-700">
                    استخدام سفرینو
                  </a>
                  <a href="#" className="block px-3 py-2 rounded-lg hover:bg-gray-50 text-gray-700">
                    درباره ما
                  </a>
                </div>
              </div>
              <a href="#" className="hover:text-[#e21b5b] transition-colors">
                میزبان شوید
              </a>
            </nav>
          </div>
          {/* Left: Quick Actions, Support & User Account */}
          <div className="flex items-center space-x-4 space-x-reverse text-sm">
            <a
              href="#"
              className="hidden sm:flex items-center gap-2 text-gray-600 hover:text-[#e21b5b] px-3 py-2 rounded-lg border border-gray-200 transition-all hover:border-[#fad1dd]"
            >
              <i className="fa-solid fa-headset text-[#e21b5b]"></i>
              <span className="text-xs font-medium">مرکز پشتیبانی آنلاین</span>
            </a>
            <a
              href="#"
              className="hidden md:flex items-center gap-2 text-gray-600 hover:text-gray-900 px-2 py-2"
            >
              <i className="fa-solid fa-suitcase-rolling text-gray-400"></i>
              <span className="text-xs font-medium">سفرهای من</span>
            </a>
            <div className="relative">
              <button
                className="flex items-center gap-2 bg-white border border-gray-300 hover:border-[#e21b5b] text-gray-700 px-4 py-2 rounded-xl text-xs font-semibold shadow-sm transition"
              >
                <i className="fa-regular fa-user text-sm"></i>
                <span>ورود یا ثبت‌نام</span>
              </button>
            </div>
            <button className="text-gray-400 hover:text-gray-600 p-2" title="تنظیمات">
              <i className="fa-solid fa-globe text-base"></i>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}

function CategoryTab({
  icon,
  label,
  active,
}: {
  icon: React.ReactNode;
  label: string;
  active?: boolean;
}) {
  return (
    <button
      className={`flex flex-col items-center justify-center min-w-[76px] py-2 px-3 rounded-2xl transition-all border ${
        active
          ? "bg-[#e21b5b]/10 text-[#e21b5b] font-bold border-[#fad1dd]"
          : "text-gray-600 hover:bg-gray-50 hover:text-[#e21b5b] font-medium border-transparent"
      }`}
    >
      <i className={`fa-solid ${icon} text-xl mb-1.5`}></i>
      <span className="text-xs">{label}</span>
    </button>
  );
}

function HeroSearchSection() {
  const [calendarOpen, setCalendarOpen] = useState(false);
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

  return (
    <section className="relative pt-6 pb-12 bg-gradient-to-b from-gray-100 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Search Card Wrap */}
        <div className="bg-white rounded-3xl shadow-xl shadow-gray-200/60 border border-gray-100 p-4 sm:p-6 lg:p-8">
          {/* Category Tab Bar */}
          <div className="flex items-center gap-2 sm:gap-4 overflow-x-auto pb-4 mb-6 border-b border-gray-100 no-scrollbar">
            <CategoryTab icon="fa-hotel" label="هتل" active />
            <CategoryTab icon="fa-house-chimney" label="ویلا و اقامتگاه" />
            <CategoryTab icon="fa-plane-departure" label="پرواز داخلی" />
            <CategoryTab icon="fa-earth-americas" label="پرواز خارجی" />
            <CategoryTab icon="fa-train" label="قطار" />
            <CategoryTab icon="fa-bus-simple" label="اتوبوس" />
            <CategoryTab icon="fa-umbrella-beach" label="تور" />
            <CategoryTab icon="fa-bolt" label="سفر شتاب" />
            <CategoryTab icon="fa-ticket" label="بلیط جاذبه‌ها" />
            <CategoryTab icon="fa-hand-holding-heart" label="کار داوطلبانه" />
            <CategoryTab icon="fa-users" label="سفر با تو" />
            <CategoryTab icon="fa-campground" label="اجاره لوازم سفر" />
          </div>

          {/* Search Input Bar Fields */}
          <div className="relative grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
            {/* Destination Field */}
            <div className="md:col-span-4 border border-gray-300 rounded-2xl p-3 hover:border-[#e21b5b] focus-within:border-[#e21b5b] focus-within:ring-2 focus-within:ring-[#e21b5b]/20 transition-all bg-white">
              <label className="block text-[11px] font-semibold text-gray-400 mb-0.5">
                مقصد یا اقامتگاه (داخلی، خارجی)
              </label>
              <div className="flex items-center gap-2">
                <i className="fa-solid fa-location-dot text-gray-400"></i>
                <input
                  className="w-full text-xs font-bold text-gray-800 border-none p-0 focus:ring-0 placeholder:font-normal placeholder:text-gray-400"
                  placeholder="نام شهر یا هتل مورد نظر..."
                  type="text"
                  defaultValue="تهران، هتل اسپیناس پالاس"
                />
              </div>
            </div>

            {/* Date Selector Field */}
            <div
              ref={dateTriggerRef}
              onClick={toggleCalendar}
              className="cursor-pointer md:col-span-4 border border-[#e21b5b] rounded-2xl p-3 bg-[#e21b5b]/10 hover:border-[#d1134e] transition-all"
            >
              <label className="block text-[11px] font-semibold text-[#d1134e] mb-0.5">
                تاریخ ورود و خروج
              </label>
              <div className="flex items-center justify-between text-xs font-bold text-gray-800">
                <div className="flex items-center gap-2">
                  <i className="fa-regular fa-calendar-days text-[#e21b5b]"></i>
                  <span>۲۵ فروردین ۱۴۰۵</span>
                </div>
                <span className="text-gray-400 font-normal">تا</span>
                <div className="flex items-center gap-2">
                  <span>۲۹ فروردین ۱۴۰۵</span>
                </div>
              </div>
            </div>

            {/* Guests / Room Field */}
            <div className="md:col-span-2 border border-gray-300 rounded-2xl p-3 hover:border-[#e21b5b] focus-within:border-[#e21b5b] transition-all bg-white">
              <label className="block text-[11px] font-semibold text-gray-400 mb-0.5">
                تعداد مسافران
              </label>
              <div className="flex items-center gap-2 text-xs font-bold text-gray-800">
                <i className="fa-solid fa-user-group text-gray-400"></i>
                <span>۲ بزرگسال، ۱ کودک</span>
              </div>
            </div>

            {/* Search Button */}
            <div className="md:col-span-2">
              <button
                className="w-full h-[54px] bg-[#e21b5b] hover:bg-[#d1134e] text-white rounded-2xl font-bold flex items-center justify-center gap-2 shadow-lg shadow-[#e21b5b]/30 transition-all transform active:scale-95"
              >
                <i className="fa-solid fa-magnifying-glass text-base"></i>
                <span>جستجو</span>
              </button>
            </div>

            {/* Embedded Datepicker Dropdown */}
            <div
              ref={calendarRef}
              className={`absolute top-[75px] right-1/4 z-30 bg-white border border-gray-200 shadow-2xl rounded-3xl p-5 w-full max-w-md ${
                calendarOpen ? "" : "hidden"
              } md:block`}
            >
              <div className="flex items-center justify-between pb-3 border-b border-gray-100 text-xs">
                <div className="flex items-center gap-2">
                  <input
                    id="flexible-date"
                    type="checkbox"
                    className="rounded text-[#e21b5b] focus:ring-[#e21b5b]"
                    defaultChecked
                  />
                  <label htmlFor="flexible-date" className="text-gray-600 cursor-pointer">
                    تقویم منعطف
                  </label>
                </div>
                <span className="font-bold text-gray-700">برو به امروز</span>
              </div>

              {/* Month Calendars Side-by-side */}
              <div className="grid grid-cols-2 gap-4 mt-3 text-center">
                {/* Month 1: Farvardin */}
                <div>
                  <div className="font-bold text-xs text-gray-800 mb-2">فروردین</div>
                  <div className="grid grid-cols-7 text-[10px] text-gray-400 mb-1 font-semibold">
                    <span>ش</span><span>ی</span><span>د</span><span>س</span><span>چ</span><span>پ</span><span className="text-red-500">ج</span>
                  </div>
                  <div className="grid grid-cols-7 gap-1 text-[11px] font-medium text-gray-700">
                    <span className="text-gray-300"></span>
                    <span className="text-gray-300"></span>
                    <span className="text-gray-300"></span>
                    <span className="py-1">۱</span>
                    <span className="py-1">۲</span>
                    <span className="py-1">۳</span>
                    <span className="py-1 text-red-500">۴</span>
                    <span className="py-1">۵</span>
                    <span className="py-1">۶</span>
                    <span className="py-1">۷</span>
                    <span className="py-1">۸</span>
                    <span className="py-1">۹</span>
                    <span className="py-1">۱۰</span>
                    <span className="py-1 text-red-500">۱۱</span>
                    <span className="py-1">۱۲</span>
                    <span className="py-1">۱۳</span>
                    <span className="py-1">۱۴</span>
                    <span className="py-1">۱۵</span>
                    <span className="py-1">۱۶</span>
                    <span className="py-1">۱۷</span>
                    <span className="py-1 text-red-500">۱۸</span>
                    <span className="py-1">۱۹</span>
                    <span className="py-1">۲۰</span>
                    <span className="py-1">۲۱</span>
                    <span className="py-1">۲۲</span>
                    <span className="py-1">۲۳</span>
                    <span className="py-1">۲۴</span>
                    <span className="py-1 text-red-500">۲۵</span>
                    <span className="py-1 bg-[#e21b5b] text-white rounded-lg">۲۶</span>
                    <span className="py-1 bg-[#e21b5b]/20 text-[#b00c3e]">۲۷</span>
                    <span className="py-1 bg-[#e21b5b]/20 text-[#b00c3e]">۲۸</span>
                    <span className="py-1 bg-[#e21b5b] text-white rounded-lg">۲۹</span>
                    <span className="py-1">۳۰</span>
                    <span className="py-1">۳۱</span>
                  </div>
                </div>
                {/* Month 2: Ordibehesht */}
                <div>
                  <div className="font-bold text-xs text-gray-800 mb-2">اردیبهشت</div>
                  <div className="grid grid-cols-7 text-[10px] text-gray-400 mb-1 font-semibold">
                    <span>ش</span><span>ی</span><span>د</span><span>س</span><span>چ</span><span>پ</span><span className="text-red-500">ج</span>
                  </div>
                  <div className="grid grid-cols-7 gap-1 text-[11px] font-medium text-gray-700">
                    <span className="py-1">۱</span>
                    <span className="py-1">۲</span>
                    <span className="py-1">۳</span>
                    <span className="py-1">۴</span>
                    <span className="py-1">۵</span>
                    <span className="py-1">۶</span>
                    <span className="py-1 text-red-500">۷</span>
                    <span className="py-1">۸</span>
                    <span className="py-1">۹</span>
                    <span className="py-1">۱۰</span>
                    <span className="py-1">۱۱</span>
                    <span className="py-1">۱۲</span>
                    <span className="py-1">۱۳</span>
                    <span className="py-1 text-red-500">۱۴</span>
                    <span className="py-1">۱۵</span>
                    <span className="py-1">۱۶</span>
                    <span className="py-1">۱۷</span>
                    <span className="py-1">۱۸</span>
                    <span className="py-1">۱۹</span>
                    <span className="py-1">۲۰</span>
                    <span className="py-1 text-red-500">۲۱</span>
                    <span className="py-1">۲۲</span>
                    <span className="py-1">۲۳</span>
                    <span className="py-1">۲۴</span>
                    <span className="py-1">۲۵</span>
                    <span className="py-1">۲۶</span>
                    <span className="py-1">۲۷</span>
                    <span className="py-1 text-red-500">۲۸</span>
                    <span className="py-1">۲۹</span>
                    <span className="py-1">۳۰</span>
                    <span className="py-1">۳۱</span>
                  </div>
                </div>
              </div>

              {/* Calendar Footer Actions */}
              <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between">
                <span className="text-[11px] text-gray-500">
                  تاریخ ورود: ۲۶ فروردین - تاریخ خروج: ۲۹ فروردین (۳ شب)
                </span>
                <button className="bg-[#e21b5b] text-white px-5 py-1.5 rounded-xl text-xs font-bold hover:bg-[#d1134e] transition">
                  تایید
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function ValuePropositions() {
  const featureData = [
    {
      imgSrc: "https://lh3.googleusercontent.com/aida-public/AB6AXuAlTO6GOYQEIrXnS_5UhxUgdC_3-ZZLu-7Cf0uNkhahD2IV1THyuOVtBdo9QJCjZFCcaq6zv5mrW6hLQNCCqgrGudK9TAARxPoAKzm8V4lt2_8_Ah6NqA37l15QhYFzoP8l8EtOIipTMKycOcrap0GKMTyG-D2n-FTlgTO3fEdEwM9xYlD6maOD1RYT7cQ03YZxnKsMJXgRdbcmAVHeswxhRe-XcbW4IStR5gGAbw",
      alt: "اتوماسیون تخصصی سفرینو",
      title: "اتوماسیون تخصصی سفرینو",
      description: "اولین ارائه دهنده اتوماسیون تخصصی مدیریت داخلی و مالتی هتل، کلود و اقامتگاه با متدهای روز دنیا برای اتصال مسافران به مدیریت اقامتگاه‌ها.",
    },
    {
      imgSrc: "https://lh3.googleusercontent.com/aida-public/AB6AXuCfidui21759IBgt7pT9kLgHJS1tSYH9EU8MysIFVFaeoMC-TMvQKzfSB8ovUFYlBqC0JJAMYRP5EdmPVPQQ3hbqUqkGsr42ZaErvRs52_wfP_HKPUQ0e8dcMjzl2PjDUnbkF5x_wApOyhNBPqIKjxIhjoJBoQ82dvEMLNHXoa102GeZf802-c6-ER_HlgjOR04BaGbi1yc8vPCZbJTU0YjyDGJmxTnOzndEcxN3Q",
      alt: "جوایز انحصاری",
      title: "جوایز انحصاری",
      description: "تسهیلات ویژه به کاربرانی تعلق می‌گیرد که بیشترین سفر را در طول سال با پلتفرم سفرینو تجربه کرده و وفادار مانده‌اند.",
    },
    {
      imgSrc: "https://lh3.googleusercontent.com/aida-public/AB6AXuBb8gOP1SKe-pL3iPj6pUb-Ht8xHyBVL5dkY7yjH1GzueNryCxguDEc9FBox9B4jMIzXy4g59CSMwkbIfLGSmF9oMd5vHi2cX9eai8Z3Wqgyk4Rm1GQCYBWoOvcOycOeknNrVP5rl9aqdfRxKAo2k3XG83_7_SRNsIlJTk20RfHtGgQrXRDLV8RRPWaDQXOhEOvv6rO00U_ZemFJdKEPEXiCIhkj3dKEpKQCpB_cw",
      alt: "یک میزبانی ویژه",
      title: "یک میزبانی ویژه",
      description: "شرایط ویژه مدیریت میزبان در پلتفرم اختصاصی سفرینو به میزبان قدرت تصمیم گیری بیشتر و درآمد پایدارتر می‌دهد.",
    },
    {
      imgSrc: "https://lh3.googleusercontent.com/aida-public/AB6AXuD_DiKcKQDhnvlly2UZZBOggCP1WcpcVFSSFnRnXKdb3xJCKhb46NQMFdanhribpdW1f_R2QK1awf7wIcjNAsCJ3hcVjY6Gtx5bZBo3a5iV_seLi2X3oIv1s7Oi3Xrw86ZfPkpikyqyqSiogAcNj9uGTCqPnRLAFe6XTcHyUB9pXWFj97kKB4PVSwafNwR0Zy0ZuXgMqu5ZPoytTtnl-DfR9d9PQdyC36zdh_k47w",
      alt: "تخصصی‌ترین پلتفرم سفر در جهان",
      title: "تخصصی‌ترین پلتفرم سفر در جهان",
      description: "جامع‌ترین پلتفرم گردشگری با قابلیت پرداخت با انواع کارت‌ها و پشتیبانی ۲۴ ساعته در هفت روز هفته برای گردشگران بین‌المللی.",
    },
  ];

  const cityButtons = [
    { label: "هتل های مازندران", icon: "fa-tree" },
    { label: "هتل های تهران", icon: "fa-tower-observation" },
    { label: "هتل های شیراز", icon: "fa-monument" },
    { label: "هتل های مشهد", icon: "fa-mosque" },
    { label: "هتل های یزد", icon: "fa-archway" },
    { label: "هتل های کیش", icon: "fa-umbrella-beach" },
    { label: "هتل های قشم", icon: "fa-water" },
    { label: "هتل های همدان", icon: "fa-mountain" },
  ];

  return (
    <section className="py-12 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <h2 className="text-2xl font-black text-gray-900 mb-2">
            سفرینو پنجره ای به دنیای گردشگری
          </h2>
          <div className="w-20 h-1 bg-[#e21b5b] mx-auto rounded-full"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {featureData.map((f, i) => (
            <FeatureCard key={i} {...f} />
          ))}
        </div>

        <div className="mt-12 grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
          {cityButtons.map((c, i) => (
            <a
              key={i}
              href="#"
              className="flex items-center justify-between p-3 rounded-2xl bg-gray-50 border border-gray-200 hover:border-[#e21b5b] hover:bg-[#e21b5b]/30 transition-all text-xs font-bold text-gray-700"
            >
              <span>{c.label}</span>
              <i className={`fa-solid ${c.icon} text-gray-400`}></i>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}

function HotelsSection({
  title,
  variant,
}: {
  title: string;
  variant: "best" | "firstDiscount" | "loyalty";
}) {
  const cards = [
    {
      imgSrc: "https://lh3.googleusercontent.com/aida-public/AB6AXuCxA53IjNeihYHk2fSRpHBJsCsuCYKb0aWGwIK5AQlCpNWxSthHHZBVYkdaeOSiknG-MNc5hjt5lpAt5XDwlDELZ4QHKok6rLOFFvRF-fZ0J5kitHXfvh07mTvWa2GC7lmMz8oNQnYG91i-4Vc0BEw4H1W__8HYeeolSBTlu84aUjdTNyADJ_QCy0iZWvIccUqiMxS4OtSdKiypZirAfEt6X2N6czuBGw4Hd0dmxQ",
      alt: "هتل اسپیناس پالاس",
      title: "هتل اسپیناس پالاس",
      location: "تهران، سعادت آباد",
    },
    {
      imgSrc: "https://lh3.googleusercontent.com/aida-public/AB6AXuBrrjxVxlb9-yz4_aB2cxiDlem-cd5b_jv6Aj4GOqo63XBGwdR8PSU14iUyO6Fw2ztmw6FYEG7crV6PSOnnu381ynORS6ixweg1dVsCxMooUpJSMQ60QgzbccfETmOfv03Of0NDWnFf-5BChj9ZqzyO-4RwBne4U4EduWksZl-zEfyLtpepw6UEdM8XVhtCK6Jzm-tNY2b5UapgODvgowqxbLtubSUCYjtz-tNY5g",
      alt: "هتل اسپیناس پالاس",
      title: "هتل اسپیناس پالاس",
      location: "تهران، سعادت آباد",
    },
    {
      imgSrc: "https://lh3.googleusercontent.com/aida-public/AB6AXuBrZVtiBEdc_8Y3ZK0mxI2M7duniIGakFN8kAFmi8jJy1X63jQn1-NQnaV7JwOKnBuUxnJqEey_m4TSKzYuyUGBfRngFN5W8F_gezMgJG0cxkrwhj5w7A1QM3yGVOM-vCipWcFshzK7JIZEZI8uJuwd82qSy6OD6i18PKjOmQ2hiZ7GbibCvOcGad26EfVOtmReoinW3SDdMfNLrV0V5D4zn5CQ65Ipp3wzyNoJ5g",
      alt: "هتل اسپیناس پالاس",
      title: "هتل اسپیناس پالاس",
      location: "تهران، سعادت آباد",
    },
    {
      imgSrc: "https://lh3.googleusercontent.com/aida-public/AB6AXuAQFmIkYbeQXgaXHYPtBnL1t7PBBBvwInOOsAuHbBBZ5yO5iUCd_7_Kzsf7Wrx4S-hdZGnj3UUh4LzQdDwGZJC4DSs25i6aUilbAgq0XNzdjCMZLwF4EeKm2Yx1dt01E9gPsnMLXR-b4EuRUH3vMpMyxuN18cBBSUYGoL2pGIme9uatVDERKfffmuQohClywNnCNWwsH3h9b4PqbdHvKWQxIKmLmt0uhJE4FqnHeQ",
      alt: "هتل اسپیناس پالاس",
      title: "هتل اسپیناس پالاس",
      location: "تهران، سعادت آباد",
    },
  ];

  const discountLabel =
    variant === "firstDiscount"
      ? "تخفیف اولین رزرو"
      : variant === "loyalty"
        ? "تخفیف وفاداری"
        : "";

  return (
    <section
      className={`py-8 ${variant === "best" ? "bg-gray-50" : "bg-white"}`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <h3 className="text-xl font-black text-gray-900">{title}</h3>
          </div>
          <a href="#" className="text-xs font-bold text-[#0070cd] hover:underline flex items-center gap-1">
            <span>همه هتل ها</span>
            <i className="fa-solid fa-chevron-left text-[10px]"></i>
          </a>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {cards.map((card, i) => (
            <HotelCard
              key={i}
              variant={variant}
              imgSrc={card.imgSrc}
              alt={card.alt}
              title={card.title}
              location={card.location}
              discountPercent="۱۰ ٪"
              discountLabel={discountLabel}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

function LastMinuteSection() {
  const cards = [
    {
      imgSrc: "https://lh3.googleusercontent.com/aida-public/AB6AXuDH-5QUbTVgD52JPlZXMvrAH7k1-vdhFRZak-GjCX0VI2rha2-Jrsbx8KKdvI5ZLlkLwgzzU0OCr_hH-gL_dfVaMslriYyT2lp7bJ2z_qYJ2APqPU0QdDSo-nO1tT9L0-sHyH1SzZCt5M0IBjQoYu4l4gPqMnx1Cyha0slrt2_0RkMwnxo_-bMiZSrV-fRiMPz2TuUg1b1PzcrnI4lwkIxx0biHZe5S3jAF5b6SxA",
    },
    {
      imgSrc: "https://lh3.googleusercontent.com/aida-public/AB6AXuBgJ-m0IlxwMhIuFBo7RdzXUfp7Xg9LQ5K1C3u4OOT46MU9g3ticWwjFymZsLZoAZ2mvY00SumDMpQOSs1O-Udk-juq4nRezQfyRVLTjwpM3xjKbxlRWFadHYS4fQuEvo5kP9SkLkgKao3v4a41y67mFKcp_z8bxcTOSH4II7xDyxwskxDdB8e6ewOYMP0kQsXgtE5zIIqvctWHd-S5r73z8tkUqGB-iAMr42GJCg",
    },
    {
      imgSrc: "https://lh3.googleusercontent.com/aida-public/AB6AXuCVL0OHcTMHfPl6kzoh0jb8osWgC3Gj5i2FaUtwAetAOhY3SpEQkjY2aXHSlhQwCD-fhDWGH2dIJD87UJmilVtcILo85b-cR7Le3nqD_x1ej140Y1KV-htCEgDyBsMVOsJwiXl17YtCF_GWRd3iDIYX8hZU4BcKgLgXOzfvH4-nT1M4BOKV002gv5aPr7DzuxITJUcmC8Gra8jwbQO3llQemjLhPdE6J21nZbqAdw",
    },
    {
      imgSrc: "https://lh3.googleusercontent.com/aida-public/AB6AXuA0kzyEv1oh5XHxtCeMVrI2VO1EdTGgwVaUTqlJix6e03bsc6mKlL3Qj3_JNdTh6b60JomjGZ6iVnnBNkMTeKmNSJhfp8Q7VD4hFXqRMSUCSIRrgvpsXgVYoHDP2jY1U_Bv198BZPbIRwRuvIvIxG-ifXk92LFq-ErFDloU6wRhU057xo_LgtkekPJfmUgXqGEPd8RDMVWSqDqCI3sJe4Ue_jtTyjD9PQ51yrBAqA",
    },
  ];

  return (
    <section className="py-8 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-4">
            <h3 className="text-xl font-black text-gray-900">
              هتل های تخفیف لحظه آخری
            </h3>
            <div className="flex items-center gap-1.5 bg-gray-900 text-white px-3 py-1.5 rounded-xl font-mono text-xs font-bold shadow">
              <span className="bg-[#e21b5b] px-1.5 py-0.5 rounded">07</span>
              <span>:</span>
              <span className="bg-[#e21b5b] px-1.5 py-0.5 rounded">10</span>
              <span>:</span>
              <span className="bg-[#e21b5b] px-1.5 py-0.5 rounded">34</span>
            </div>
          </div>
          <a href="#" className="text-xs font-bold text-[#0070cd] hover:underline flex items-center gap-1">
            <span>همه هتل ها</span>
            <i className="fa-solid fa-chevron-left text-[10px]"></i>
          </a>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {cards.map((card, i) => (
            <HotelCard
              key={i}
              variant="lastMinute"
              imgSrc={card.imgSrc}
              alt="هتل اسپیناس پالاس"
              title="هتل اسپیناس پالاس"
              location="تهران، سعادت آباد"
              discountPercent="۱۰ ٪"
              discountLabel="تخفیف وفاداری"
            />
          ))}
        </div>
      </div>
    </section>
  );
}

function PromoGiftCards() {
  return (
    <section className="py-10 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[
            {
              imgSrc: "https://lh3.googleusercontent.com/aida-public/AB6AXuDM3a99CGzhydsdwpgOR4kAjAMDKJBsniazw_GDN1VdiYYQm23L_yvQsiibE8QSg8bYIzijpKcF5FWL-qMvEjNruOTk72Tkr_FC4K4IVPjKZOFePJJnatAEJD8eeqvrgVfyS9aAqo82CeWaOTem9c9NSBnTBAX_aqSbXdleIdz5dWIfyrRWMpvDMzuMJGYfyDO8XTTiovZuneavmaF8_63KLgedpG2uOXBpg3CJdQ",
              title: "سفر کارت سفرینو",
              items: ["بن کارت سفر کارکنان", "سفر کارت سازمانی", "موتور باشگاه مشتریان"],
            },
            {
              imgSrc: "https://lh3.googleusercontent.com/aida-public/AB6AXuCfjpfCtY-GEfse38UiCcwfR6nxSsG8z0CPjUesBqyd0B10q3XjNO-pMd2X9GlMLVxU5zOhnnYFK7IjgU3qqzODTy3hrsmTt0kTkaMpoet6cZ7GeD6U51VD_feaypeUopNqf6xv5bX2LjiZRE23GYg1akgJYMGTg8z3F5BzKPTTtXXxnlefefL278t2buaLT-HFA1_2BR6jGQ58bZfh0WHIt8kmXs8q3s1ke0WRjw",
              title: "سفر کارت سفرینو",
              items: [
                "بن کارت سفر کارکنان",
                "سفر کارت سازمانی",
                "ویژه ارگان‌ها و شرکت‌ها",
              ],
            },
          ].map((banner, i) => (
            <div
              key={i}
              className="relative bg-white rounded-3xl overflow-hidden border border-gray-200 shadow-sm flex flex-col sm:flex-row items-center p-6 gap-6"
            >
              <div className="w-full sm:w-1/2 h-44 rounded-2xl overflow-hidden">
                <Image
                  src={banner.imgSrc}
                  alt={banner.title}
                  className="w-full h-full object-cover"
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
              </div>
              <div className="w-full sm:w-1/2 flex flex-col items-center sm:items-start text-center sm:text-right">
                <h4 className="text-lg font-black text-[#e21b5b] mb-2">{banner.title}</h4>
                <ul className="text-xs text-gray-600 space-y-1.5 mb-4">
                  {banner.items.map((item, j) => (
                    <li key={j} className="flex items-center gap-2">
                      <i className="fa-solid fa-check text-[#e21b5b] text-[10px]"></i>
                      {item}
                    </li>
                  ))}
                </ul>
                <a href="#" className="bg-[#0070cd] hover:bg-[#005a9f] text-white font-bold text-xs py-2.5 px-6 rounded-xl transition shadow">
                  اطلاعات بیشتر
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function AboutAndSeoSection() {
  return (
    <section className="py-12 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-right space-y-6 text-gray-700 leading-relaxed text-xs sm:text-sm">
          <h3 className="text-xl font-black text-gray-900 border-r-4 border-[#e21b5b] pr-3">
            رزرو هتل در سفرینو
          </h3>
          <p className="text-gray-500">
            سامانه سفرینو به عنوان یکی از پیشگامان صنعت گردشگری الکترونیک در کشور، بستری هوشمند و مطمئن را برای رزرو انواع هتل‌ها، اقامتگاه‌های بوم‌گردی و ویلا فراهم ساخته است. با سفرینو شما می‌توانید قبل از اقدام به سفر تمامی امکانات، نظرات واقعی مسافران، تصاویر ۳۶۰ درجه اتاق‌ها و تخفیف‌های ویژه فصلی را مقایسه کنید و اقامت ایده‌آل خود را با تضمین کمترین قیمت نهایی نمایید.
          </p>
          <h4 className="text-base font-bold text-gray-800">رزرو آسان آنلاین هتل در سفرینو</h4>
          <p className="text-gray-500">
            با ظهور اینترنت، رزرو هتل دیگر نیازی به تماس‌های مکرر یا سردرگمی در مقصد ندارد. شما می‌توانید در ۲۴ ساعت شبانه‌روز و ۷ روز هفته تنها با چند کلیک هتل مورد نظر خود را رزرو و واچر رسمی آنی دریافت کنید. تیم پشتیبانی سفرینو از لحظه انتخاب اقامتگاه تا پایان سفر همراه مطمئن شما خواهد بود.
          </p>
        </div>

        <div className="mt-12 bg-gradient-to-r from-[#fff1f2] to-[#fce7ed] border border-[#fce7ed] rounded-3xl p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="flex items-center gap-4">
            <div className="w-32 h-44 rounded-2xl overflow-hidden shadow-md">
              <Image
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuD4uLWkqekb8Uw2zoK5uDXKn7bH_zd1YCz5i6tY4M8XhCIiFnkrm-7ptUdZ9ezKBEvJysjRs-959gmkO7qGszFu8gwSdi2VgvjevYd5XoHVFfmP2Esgo7MzGsd7T9CX_Q9uBkcYVXSCH0NU3D7aPb8XSsfCQBj5J17w7DInKly02SrqaBi_c-EfXvkWcXK8K3hs0AaP8k-e-wKax071IcZLIlr5dMijWUWLfLUr_Q"
                alt="اپلیکیشن سفرینو"
                className="w-full h-full object-cover"
                fill
                sizes="(max-width: 640px) 100vw, 200px"
              />
            </div>
            <div>
              <h4 className="text-lg font-black text-[#d1134e] mb-1">اپلیکیشن سفرینو</h4>
              <p className="text-xs text-gray-600 mb-3">سریع‌تر و مطمئن‌تر به سفر بروید</p>
              <div className="flex items-center gap-2 text-xs font-semibold text-[#0070cd]">
                <span>مشاهده لینک‌های دانلود</span>
                <div className="flex gap-2 text-gray-700 text-sm">
                  <i className="fa-brands fa-android"></i>
                  <i className="fa-brands fa-apple"></i>
                </div>
              </div>
              <p className="text-[10px] text-gray-400 mt-1">قابل نصب روی اندروید و آیفون</p>
            </div>
          </div>
          <div className="flex flex-col items-center border-t md:border-t-0 md:border-r border-gray-200 pt-4 md:pt-0 md:pr-8">
            <div className="w-24 h-24 bg-white p-2 rounded-2xl border border-gray-200 shadow-sm flex items-center justify-center">
              <i className="fa-solid fa-qrcode text-5xl text-gray-800"></i>
            </div>
            <span className="text-[11px] font-bold text-gray-600 mt-2">
              برای دانلود اسکن کنید!
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}

function FaqSection() {
  const faqs = [
    {
      index: 1,
      question: "پیش از رزرو هتل چگونه درباره هتل و فرآیند رزرو اطلاعات کسب کنم؟",
      answer: "فرآیند انتخاب و رزرو اینترنتی هتل بسیار ساده است. با مشخص کردن مقصد و تاریخ ورود و خروج می‌توانید لیست هتل‌ها را با قیمت، امکانات و نظرات واقعی کاربران بررسی کنید و در کمتر از ۲ دقیقه واچر رسمی دریافت نمایید.",
    },
    {
      index: 2,
      question: "شرایط کنسلی رزرو هتل در سفرینو چگونه است؟",
      answer: "قوانین کنسلی هر هتل توسط مدیریت همان اقامتگاه تعیین می‌شود. با این حال درخواست استرداد آنلاین از پنل کاربری در دسترس بوده و مبالغ طبق ضوابط هتل به حساب مسافر عودت داده می‌شود.",
    },
    {
      index: 3,
      question: "آیا رزرو هتل در سفرینو با تضمین کمترین قیمت انجام می‌شود؟",
      answer: "بله، با توجه به قرارداد مستقیم سفرینو با برترین هتل‌های ایران و خاورمیانه، مناسب‌ترین نرخ‌های اختصاصی همراه با کدهای تخفیف دوره‌ای به مسافران ارائه می‌شود.",
    },
  ];

  return (
    <section className="py-12 bg-gray-50">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h3 className="text-xl font-black text-gray-900 mb-2">
            پرسش‌های متداول درباره رزرو هتل در سفرینو
          </h3>
          <p className="text-xs text-gray-500">
            پاسخ سریع به رایج‌ترین پرسش‌های مسافران و کاربران گرامی
          </p>
        </div>
        <div className="space-y-3">{faqs.map((f) => <FaqItem key={f.index} {...f} />)}</div>
      </div>
    </section>
  );
}

function BlogSection() {
  const blogData = [
    {
      imgSrc: "https://lh3.googleusercontent.com/aida-public/AB6AXuAcvryV66bKPHCsPOmIoTnGeTw-NSeYEmd5dccO8mtTsexYHP2cN5JDjz8F7XFHzT9aVe76tGomAQh9BJmGC8dSXzbueGsaPBYgPC0TBUPSGg4VRlPC8sC03V2MJLuRgkTJv5ckZg8fpARN8rtQou2Zu6KZnsAPmAOm6WkB6yguh7yYDkWLoshBrDLVT_BSbc6KLKVrmd4ZOoOl7KIGYq5VUcO9EaiACNZcMzSJng",
      alt: "گردشگری در زمستان ۱۴۰۴",
      title: "گردشگری در زمستان ۱۴۰۴",
      excerpt: "بررسی مقاصد گرمسیری ایران، اقامتگاه‌های کویر و تجربه‌های فراموش‌نشده در سفر زمستانه.",
      author: "تحریریه سفرینو",
      date: "۱۴۰۴/۱۲/۱۵",
    },
    {
      imgSrc: "https://lh3.googleusercontent.com/aida-public/AB6AXuDiNeHBOKEGQA2LuEO-o4xV0XnpATannt0RkFKvSeRqzolrzPDXedM66pdAiNeM5kICHKUdFkGUUqAyqt8xZzKAZi0Wzu5VpEyImSPnmXG67pqSX2jeqQk3wFdNKCkPdDfQngl_18bcWnjAIj6hrW_ipYaMWdQ2_PVjKX0K8kw6Qpd7WmXVSAvs7KtUb_kHO3xQsRJf45V4lAh9UOd9BY1Jb-sjaN7-g3mf6w4E2w",
      alt: "گردشگری در زمستان ۱۴۰۴",
      title: "گردشگری در زمستان ۱۴۰۴",
      excerpt: "بررسی مقاصد گرمسیری ایران، اقامتگاه‌های کویر و تجربه‌های فراموش‌نشده در سفر زمستانه.",
      author: "تحریریه سفرینو",
      date: "۱۴۰۴/۱۲/۱۵",
    },
    {
      imgSrc: "https://lh3.googleusercontent.com/aida-public/AB6AXuB3f5cs93S58EiWWkZrSzKOxo2MjgD5HODJPSwlxUThYuGezlvye7gPAC77kk7oTVln1Zqw6l2EUqGIJOl6F_CCebtc_AeU3RE8VUYOiv9GGVVZfDj4wu8vSCtM51kCLwujBrOM3nlF5HeR6enTZPODDpch8cnoDROOHP3KUdCj90Eie7EkNTo_ghSt_OqAb0Fgfm-y80r1BxynUYQzoNOvNYvUps53ryEMJPnjrg",
      alt: "گردشگری در زمستان ۱۴۰۴",
      title: "گردشگری در زمستان ۱۴۰۴",
      excerpt: "بررسی مقاصد گرمسیری ایران، اقامتگاه‌های کویر و تجربه‌های فراموش‌نشده در سفر زمستانه.",
      author: "تحریریه سفرینو",
      date: "۱۴۰۴/۱۲/۱۵",
    },
    {
      imgSrc: "https://lh3.googleusercontent.com/aida-public/AB6AXuACQML9Wrr4x1beU8I0n0ILXzLsRwiAWoIJqQYG3_5sSSQJx3a7scZyWMUmqZ8IaBc4ksmdgFwjaTsaQhTADhpqZyZ-HBn9J00W26XrBF7-1ONT3B_DtHGz6cVECdEZthb-0wvDqKDiHP80EjWf-XD4s8KDYYAMUghKUUerE6AFaf1W93ZU6G6LrJDPvxxeApKPqP82UdM49KZ2OrHuncn3XEZJX4wq1ENkiF2X9A",
      alt: "گردشگری در زمستان ۱۴۰۴",
      title: "گردشگری در زمستان ۱۴۰۴",
      excerpt: "بررسی مقاصد گرمسیری ایران، اقامتگاه‌های کویر و تجربه‌های فراموش‌نشده در سفر زمستانه.",
      author: "تحریریه سفرینو",
      date: "۱۴۰۴/۱۲/۱۵",
    },
  ];

  return (
    <section className="py-12 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h3 className="text-2xl font-black text-[#e21b5b] mb-2">
            سفر در مجله گردشگری سفرینو
          </h3>
          <p className="text-xs text-gray-500">
            تازه ترین مقالات، راهنمای سفر و معرفی مقاصد جذاب ایران و جهان
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {blogData.map((b, i) => <BlogCard key={i} {...b} />)}
        </div>
      </div>
    </section>
  );
}

function MainFooter() {
  return (
    <footer className="bg-gray-100 border-t border-gray-200 pt-12 pb-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Trust badges & Support Row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pb-10 border-b border-gray-200 text-center">
          {[
            {
              icon: "fa-headset",
              title: "پشتیبانی ۲۴ ساعته",
              desc: "پاسخگویی در تمام ایام سال",
            },
            {
              icon: "fa-tags",
              title: "تضمین بهترین قیمت",
              desc: "نرخ مصوب و منصفانه",
            },
            {
              icon: "fa-bolt-lightning",
              title: "صدور آنی واچر",
              desc: "تایید قطعی در کوتاه‌ترین زمان",
            },
            {
              icon: "fa-shield-halved",
              title: "خرید مطمئن و امن",
              desc: "دارای نماد اعتماد الکترونیک",
            },
          ].map((item, i) => (
            <div key={i} className="flex flex-col items-center">
              <div className="w-12 h-12 rounded-2xl bg-white border border-gray-200 flex items-center justify-center text-[#e21b5b] text-xl mb-3 shadow-sm">
                <i className={`fa-solid ${item.icon}`}></i>
              </div>
              <h5 className="font-bold text-xs text-gray-900">{item.title}</h5>
              <p className="text-[11px] text-gray-500 mt-1">{item.desc}</p>
            </div>
          ))}
        </div>

        {/* Links Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 py-10 border-b border-gray-200 text-xs">
          <div>
            <h5 className="font-black text-gray-900 text-sm mb-4">سفرینو</h5>
            <ul className="space-y-2.5 text-gray-600">
              <li><a href="#" className="hover:text-[#e21b5b]">درباره سفرینو</a></li>
              <li><a href="#" className="hover:text-[#e21b5b]">تماس با ما</a></li>
              <li><a href="#" className="hover:text-[#e21b5b]">چرا سفرینو؟</a></li>
              <li><a href="#" className="hover:text-[#e21b5b]">فرصت‌های شغلی</a></li>
              <li><a href="#" className="hover:text-[#e21b5b]">بیمه مسافرتی</a></li>
            </ul>
          </div>
          <div>
            <h5 className="font-black text-gray-900 text-sm mb-4">خدمات مسافران</h5>
            <ul className="space-y-2.5 text-gray-600">
              <li><a href="#" className="hover:text-[#e21b5b]">مرکز پشتیبانی آنلاین</a></li>
              <li><a href="#" className="hover:text-[#e21b5b]">راهنمای رزرو هتل</a></li>
              <li><a href="#" className="hover:text-[#e21b5b]">راهنمای استرداد</a></li>
              <li><a href="#" className="hover:text-[#e21b5b]">قوانین و مقررات</a></li>
              <li><a href="#" className="hover:text-[#e21b5b]">پرسش و پاسخ</a></li>
            </ul>
          </div>
          <div>
            <h5 className="font-black text-gray-900 text-sm mb-4">اطلاعات تکمیلی</h5>
            <ul className="space-y-2.5 text-gray-600">
              <li><a href="#" className="hover:text-[#e21b5b]">باشگاه مشتریان سفرینو</a></li>
              <li><a href="#" className="hover:text-[#e21b5b]">سفر کارت سازمانی</a></li>
              <li><a href="#" className="hover:text-[#e21b5b]">همکاری با آژانس‌ها</a></li>
              <li><a href="#" className="hover:text-[#e21b5b]">ثبت اقامتگاه و ویلا</a></li>
              <li><a href="#" className="hover:text-[#e21b5b]">مجله گردشگری</a></li>
            </ul>
          </div>
          <div>
            <h5 className="font-black text-gray-900 text-sm mb-4">ارتباط با ما</h5>
            <p className="text-gray-600 text-xs leading-relaxed mb-4">
              تلفن پشتیبانی: ۰۲۱-۸۸۸۸۰۰۰۰<br />
              تهران، خیابان ولیعصر، برج سفرینو، طبقه ۱۰
            </p>
            <div className="flex items-center space-x-3 space-x-reverse text-lg text-gray-500">
              <a href="#" className="hover:text-[#e21b5b]"><i className="fa-brands fa-instagram"></i></a>
              <a href="#" className="hover:text-[#e21b5b]"><i className="fa-brands fa-telegram"></i></a>
              <a href="#" className="hover:text-[#e21b5b]"><i className="fa-brands fa-linkedin"></i></a>
              <a href="#" className="hover:text-[#e21b5b]"><i className="fa-brands fa-twitter"></i></a>
            </div>
          </div>
        </div>

        {/* Copyright Bottom */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between text-[11px] text-gray-400 gap-4">
          <p>تمامی حقوق این سامانه متعلق به شرکت گردشگری سفرینو می&zwnj;باشد. © ۱۴۰۴</p>
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

export default function HotelBookingClient() {
  return (
    <div
      dir="rtl"
      lang="fa"
      className={`${vazirmatn.className} min-h-full bg-gray-50 text-gray-800 text-sm antialiased selection:bg-[#e21b5b] selection:text-white`}
    >
      <TopNotificationBar />
      <MainHeader />
      <HeroSearchSection />
      <ValuePropositions />
      <HotelsSection title="برترین هتل های ایران" variant="best" />
      <HotelsSection title="هتل های با تخفیف اولین رزرو" variant="firstDiscount" />
      <HotelsSection title="هتل های با تخفیف وفاداری" variant="loyalty" />
      <LastMinuteSection />
      <PromoGiftCards />
      <AboutAndSeoSection />
      <FaqSection />
      <BlogSection />
      <MainFooter />
    </div>
  );
}
