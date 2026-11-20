"use client";

import { useCallback, useRef, useState } from "react";
import Image from "@/components/AppImage";
import { Vazirmatn } from "next/font/google";
import MainHeader from "@/components/MainHeader";
import { SearchBox } from "@/components/SearchBox";
import { FavoritesProvider } from "@/hooks/useFavorites";
import { searchAccommodations } from "@/services/accommodations.service";
import { SearchResultsSection } from "@/components/accommodation-booking/SearchResultsSection";
import { BestAccommodationsSection } from "@/components/accommodation-booking/BestAccommodationsSection";
import { CampaignAccommodationSection } from "@/components/accommodation-booking/CampaignAccommodationSection";
import { AccommodationExplorerSection } from "@/components/accommodation-booking/AccommodationExplorerSection";
import { TravelCards } from "@/components/hotel-booking/TravelCards";
import { BlogSection } from "@/components/hotel-booking/BlogSection";
import { SiteFooter } from "@/components/hotel-booking/SiteFooter";
import { FaqSection } from "@/components/hotel-booking/FaqSection";
import { Modal } from "@/components/hotel-booking/Modal";
import { TopNotificationBar } from "@/components/TopNotificationBar";
import type { GridStatus } from "@/components/accommodation-booking/AccommodationGrid";
import {
  APP_DOWNLOAD,
  ACCOMMODATION_VALUE_PROPS,
  ACCOMMODATION_PILLARS,
  ACCOMMODATION_DESTINATION_CHIPS,
  ACCOMMODATION_SEO_ARTICLE,
  ACCOMMODATION_FAQS,
  type AccommodationCityCategoryId,
  type AccommodationTypeCategoryId,
} from "@/mock";
import type { Accommodation } from "@/types/accommodation";
import type { SearchCriteria } from "@/types/search";

const vazirmatn = Vazirmatn({
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  variable: "--font-vazirmatn",
  display: "swap",
});

/* ------------------------------------------------------------------ */
/* Top notification bar (dismissable, shared component)                 */
/* ------------------------------------------------------------------ */
function ValuePropositionBanner({
  onSelectCity,
}: {
  onSelectCity: (city: AccommodationCityCategoryId) => void;
}) {
  const [openPropId, setOpenPropId] = useState<string | null>(null);
  const openProp = ACCOMMODATION_VALUE_PROPS.find((prop) => prop.id === openPropId) ?? null;

  return (
    <section className="py-10 bg-white" aria-labelledby="why-safarino-title">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h2 id="why-safarino-title" className="text-2xl font-black text-slate-800">
            چرا سفرینو را برای اقامت انتخاب کنیم؟
          </h2>
          <p className="text-xs text-gray-400 mt-1">
            نتایج جستجو و پیشنهادهای ویژه بر اساس کیفیت و محبوبیت
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {ACCOMMODATION_VALUE_PROPS.map((prop) => (
            <div
              key={prop.id}
              className="border border-gray-200 rounded-2xl p-5 text-center flex flex-col justify-between hover:shadow-lg transition-all bg-white group"
            >
              <div>
                <div className="relative w-full h-44 rounded-xl overflow-hidden mb-4 bg-gray-100">
                  <Image
                    src={prop.image}
                    alt={prop.imageAlt}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                  />
                </div>
                <h3 className="text-sm font-black text-slate-800 mb-2">{prop.title}</h3>
                <p className="text-[11px] text-gray-500 leading-6">{prop.description}</p>
              </div>
              <div className="mt-4 pt-3 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setOpenPropId(prop.id)}
                  className="text-[#e21b5b] font-bold text-xs hover:text-[#b00c3e] flex items-center justify-center gap-1 w-full"
                >
                  <span>اطلاعات بیشتر</span>
                  <i className="fa-solid fa-angle-left text-[10px]" aria-hidden="true" />
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-10 grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-4 gap-3 text-xs">
          {ACCOMMODATION_DESTINATION_CHIPS.map((chip) => (
            <button
              key={chip.id}
              type="button"
              onClick={() => onSelectCity(chip.id)}
              className="border border-gray-200 hover:border-[#e21b5b] rounded-xl p-3 flex items-center justify-between group transition-colors text-right"
            >
              <span className="flex items-center gap-2">
                <i className={`fa-solid ${chip.icon} ${chip.iconColor}`} aria-hidden="true" />
                <span className="font-bold text-slate-700 group-hover:text-[#e21b5b]">
                  {chip.label}
                </span>
              </span>
              <i
                className="fa-solid fa-chevron-left text-gray-300 text-[10px] group-hover:text-[#e21b5b]"
                aria-hidden="true"
              />
            </button>
          ))}
        </div>
      </div>

      {openProp && (
        <Modal open onClose={() => setOpenPropId(null)} title={openProp.title}>
          <p className="text-xs text-gray-600 leading-6 mb-4">{openProp.detailLead}</p>
          <ul className="space-y-2 mb-4">
            {openProp.bullets.map((bullet) => (
              <li key={bullet} className="flex items-start gap-2 text-xs text-gray-700 leading-6">
                <i className="fa-solid fa-check text-[#e21b5b] text-[10px] mt-1" aria-hidden="true" />
                <span>{bullet}</span>
              </li>
            ))}
          </ul>
          <p className="text-[10px] text-gray-400 leading-5 border-t border-gray-100 pt-3">
            {openProp.footnote}
          </p>
        </Modal>
      )}
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Category pillars (filter the explorer by accommodation type)        */
/* ------------------------------------------------------------------ */
function CategoryPillars({
  onSelectType,
}: {
  onSelectType: (type: AccommodationTypeCategoryId) => void;
}) {
  return (
    <section className="bg-gradient-to-b from-gray-100 to-white pb-10" aria-label="انتخاب نوع اقامتگاه">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mt-2 grid grid-cols-3 sm:grid-cols-6 gap-4">
          {ACCOMMODATION_PILLARS.map((pillar) => (
            <button
              key={pillar.id}
              type="button"
              onClick={() => onSelectType(pillar.id)}
              className="flex flex-col items-center group"
              aria-label={`نمایش ${pillar.label}`}
            >
              <div className="w-full aspect-[4/5] rounded-2xl overflow-hidden shadow-sm border border-gray-200/80 group-hover:shadow-md transition-all relative">
                <Image
                  src={pillar.image}
                  alt={pillar.imageAlt}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  fill
                  sizes="(max-width: 640px) 100vw, 33vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent flex items-end justify-center pb-2">
                  <span className="text-white text-xs font-bold">{pillar.label}</span>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* SEO article (mock-driven)                                           */
/* ------------------------------------------------------------------ */
function AccommodationSeoArticle() {
  return (
    <section className="py-12 bg-white border-y border-gray-100" aria-labelledby="accom-seo-title">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-justify">
        <div className="border-r-4 border-[#e21b5b] pr-3 mb-6">
          <h2 id="accom-seo-title" className="text-xl font-black text-slate-800">
            {ACCOMMODATION_SEO_ARTICLE.title}
          </h2>
        </div>
        <div className="space-y-4 text-xs leading-relaxed text-gray-600">
          {ACCOMMODATION_SEO_ARTICLE.paragraphs.map((paragraph) => (
            <p key={paragraph.slice(0, 32)}>{paragraph}</p>
          ))}
          <h3 className="font-bold text-slate-800 text-sm pt-2">
            {ACCOMMODATION_SEO_ARTICLE.subtitle}
          </h3>
          <p>{ACCOMMODATION_SEO_ARTICLE.subtitleParagraph}</p>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Mobile app banner (driven by APP_DOWNLOAD mock)                     */
/* ------------------------------------------------------------------ */
function MobileAppBanner() {
  const [open, setOpen] = useState(false);

  return (
    <section className="py-10" aria-label="اپلیکیشن سفرینو">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-rose-50 via-pink-50 to-white border border-rose-100 rounded-3xl p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-8 relative overflow-hidden">
          <div className="flex items-center gap-6">
            <div className="bg-white p-3 rounded-2xl border border-gray-200 shadow-sm text-center">
              <div className="w-24 h-24 bg-gray-50 flex items-center justify-center rounded-lg border border-dashed border-gray-300">
                <i className="fa-solid fa-qrcode text-5xl text-slate-700" aria-hidden="true" />
              </div>
              <span className="block text-[10px] text-gray-500 font-bold mt-2">
                {APP_DOWNLOAD.qrLabel}
              </span>
            </div>
            <div>
              <span className="text-xs font-bold text-[#e21b5b] block mb-1">
                {APP_DOWNLOAD.appName}
              </span>
              <h2 className="text-xl font-black text-slate-800 mb-2">{APP_DOWNLOAD.title}</h2>
              <p className="text-xs text-gray-500 mb-4">{APP_DOWNLOAD.subtitle}</p>
              <button
                type="button"
                onClick={() => setOpen(true)}
                className="bg-slate-900 text-white hover:bg-slate-800 px-4 py-2 rounded-xl text-xs font-bold inline-flex items-center gap-2 transition-colors"
              >
                <i className="fa-solid fa-mobile-screen-button" aria-hidden="true" />
                <span>مشاهده لینک‌های دانلود</span>
              </button>
            </div>
          </div>
          <div className="relative w-60 h-44 rounded-2xl overflow-hidden shadow-xl border-2 border-white">
            <Image
              src="/assets/app-promo.jpg"
              alt={APP_DOWNLOAD.subtitle}
              className="w-full h-full object-cover"
              fill
              sizes="(max-width: 640px) 100vw, 300px"
            />
          </div>
        </div>
      </div>

      <Modal open={open} onClose={() => setOpen(false)} title="دانلود اپلیکیشن سفرینو">
        <p className="text-xs text-gray-500 leading-6 mb-4">{APP_DOWNLOAD.unavailableMessage}</p>
        <ul className="space-y-3">
          {APP_DOWNLOAD.downloads.map((entry) => (
            <li
              key={entry.store}
              className="flex items-center justify-between gap-4 border border-gray-200 rounded-2xl px-4 py-3"
            >
              <span className="flex items-center gap-3">
                <i className={`${entry.icon} text-2xl text-slate-700`} aria-hidden="true" />
                <span className="text-xs font-bold text-gray-800">{entry.label}</span>
              </span>
              {entry.url ? (
                <a
                  href={entry.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[11px] font-bold text-[#0070cd] hover:underline"
                >
                  دانلود
                </a>
              ) : (
                <span className="text-[10px] font-bold text-gray-400 bg-gray-100 rounded-full px-3 py-1">
                  به‌زودی
                </span>
              )}
            </li>
          ))}
        </ul>
      </Modal>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Search state machine (mirrors hotel-booking)                        */
/* ------------------------------------------------------------------ */
type SearchState =
  | { status: "idle" }
  | { status: "loading" | "success" | "error"; criteria: SearchCriteria };

export default function AccommodationBookingClient() {
  const [searchState, setSearchState] = useState<SearchState>({ status: "idle" });
  const [searchResults, setSearchResults] = useState<Accommodation[]>([]);
  // Bumped on clear so the SearchBox remounts and drops internal state.
  const [searchBoxKey, setSearchBoxKey] = useState(0);
  // Explorer filters live at the page level so the pillars/chips can drive them.
  const [city, setCity] = useState<AccommodationCityCategoryId>("all");
  const [type, setType] = useState<AccommodationTypeCategoryId>("all");
  const explorerRef = useRef<HTMLDivElement>(null);

  const scrollToExplorer = useCallback(() => {
    explorerRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, []);

  const handleSelectCity = useCallback(
    (nextCity: AccommodationCityCategoryId) => {
      setCity(nextCity);
      scrollToExplorer();
    },
    [scrollToExplorer]
  );

  const handleSelectType = useCallback(
    (nextType: AccommodationTypeCategoryId) => {
      setType(nextType);
      scrollToExplorer();
    },
    [scrollToExplorer]
  );

  const runSearch = useCallback((criteria: SearchCriteria) => {
    setSearchState({ status: "loading", criteria });
    searchAccommodations(criteria)
      .then((results) => {
        setSearchResults(results);
        setSearchState({ status: "success", criteria });
      })
      .catch(() => {
        setSearchResults([]);
        setSearchState({ status: "error", criteria });
      });
  }, []);

  const clearSearch = useCallback(() => {
    setSearchState({ status: "idle" });
    setSearchResults([]);
    setSearchBoxKey((key) => key + 1);
  }, []);

  const retrySearch = useCallback(() => {
    if (searchState.status === "idle") return;
    runSearch(searchState.criteria);
  }, [searchState, runSearch]);

  const gridStatus: GridStatus =
    searchState.status === "error"
      ? "error"
      : searchState.status === "loading"
        ? "loading"
        : "success";

  return (
    <FavoritesProvider>
      <div
        dir="rtl"
        lang="fa"
        className={`${vazirmatn.className} min-h-full bg-gray-50 text-slate-700 antialiased selection:bg-[#e21b5b] selection:text-white`}
      >
        <TopNotificationBar />
        <MainHeader activeSection="accommodation" />
        <SearchBox
          key={searchBoxKey}
          initialDestination="رامسر، مازندران"
          initialDateRange="۲۵ فروردین ۱۴۰۵ - ۲۹ فروردین ۱۴۰۵"
          initialPassengers="۲ بزرگسال، ۱ کودک"
          onSearch={runSearch}
          onClear={clearSearch}
          initialActiveTab={1}
          tabLinks={{ 0: "/hotel-booking" }}
          helperText="جستجو فقط اقامتگاه‌های منطبق با مقصد و ظرفیت را نمایش می‌دهد."
          searchTitle="جستجوی اقامتگاه‌های منطبق"
          destinationPlaceholder="نام شهر یا اقامتگاه مورد نظر..."
        />
        {searchState.status !== "idle" && (
          <SearchResultsSection
            criteria={searchState.criteria}
            results={searchResults}
            status={gridStatus}
            errorMessage="خطا در جستجو. لحظه‌ای دیگر دوباره تلاش کنید."
            onRetry={retrySearch}
            onClear={clearSearch}
          />
        )}

        <ValuePropositionBanner onSelectCity={handleSelectCity} />
        <CategoryPillars onSelectType={handleSelectType} />

        {/* Top rated + full browse workspace (city/type/favorites/sort) */}
        <BestAccommodationsSection />
        <div ref={explorerRef} className="scroll-mt-24">
          <AccommodationExplorerSection
            city={city}
            type={type}
            onCityChange={setCity}
            onTypeChange={setType}
          />
        </div>

        {/* Campaigns: first booking / loyalty / last minute */}
        <CampaignAccommodationSection campaignId="firstBooking" />
        <CampaignAccommodationSection campaignId="loyalty" bg="gray" />
        <CampaignAccommodationSection campaignId="lastMinute" />

        {/* Corporate travel cards */}
        <TravelCards />

        {/* SEO + app */}
        <AccommodationSeoArticle />
        <MobileAppBanner />

        {/* FAQ + blog */}
        <FaqSection
          items={ACCOMMODATION_FAQS}
          title="سؤالات متداول رزرو ویلا و اقامتگاه در سفرینو"
          subtitle="پاسخ سریع به رایج‌ترین سؤال‌های کاربران و راهنمای شرایط لغو و استرداد"
          id="accommodation-faq"
        />
        <BlogSection />

        <SiteFooter />
      </div>
    </FavoritesProvider>
  );
}
