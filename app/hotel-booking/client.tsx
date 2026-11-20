"use client";

import { useCallback, useState } from "react";
import { Vazirmatn } from "next/font/google";
import MainHeader from "@/components/MainHeader";
import { SearchBox } from "@/components/SearchBox";
import { FavoritesProvider } from "@/hooks/useFavorites";
import { searchHotels } from "@/services/hotels.service";
import { SearchResultsSection } from "@/components/hotel-booking/SearchResultsSection";
import { PlatformFeatures } from "@/components/hotel-booking/PlatformFeatures";
import { Benefits } from "@/components/hotel-booking/Benefits";
import { CityHotelsSection } from "@/components/hotel-booking/CityHotelsSection";
import { BestHotelsSection } from "@/components/hotel-booking/BestHotelsSection";
import { CampaignHotelSection } from "@/components/hotel-booking/CampaignHotelSection";
import { TravelCards } from "@/components/hotel-booking/TravelCards";
import { SeoArticle } from "@/components/hotel-booking/SeoArticle";
import { FaqSection } from "@/components/hotel-booking/FaqSection";
import { BlogSection } from "@/components/hotel-booking/BlogSection";
import { SiteFooter } from "@/components/hotel-booking/SiteFooter";
import { TopNotificationBar } from "@/components/TopNotificationBar";
import type { GridStatus } from "@/components/hotel-booking/HotelGrid";
import type { Hotel } from "@/types/hotel";
import type { SearchCriteria } from "@/types/search";

const vazirmatn = Vazirmatn({
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  variable: "--font-vazirmatn",
  display: "swap",
});

type SearchState =
  | { status: "idle" }
  | { status: "loading" | "success" | "error"; criteria: SearchCriteria };

export default function HotelBookingClient() {
  const [searchState, setSearchState] = useState<SearchState>({ status: "idle" });
  const [searchResults, setSearchResults] = useState<Hotel[]>([]);
  // Bumped on clear so the whole SearchBox remounts and drops internal state.
  const [searchBoxKey, setSearchBoxKey] = useState(0);

  const runSearch = useCallback((criteria: SearchCriteria) => {
    setSearchState({ status: "loading", criteria });
    searchHotels(criteria)
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
        className={`${vazirmatn.className} min-h-full bg-gray-50 text-gray-800 text-sm antialiased selection:bg-[#e21b5b] selection:text-white`}
      >
        <TopNotificationBar />
        <MainHeader activeSection="hotel" />
        <SearchBox
          key={searchBoxKey}
          initialDestination="تهران، هتل اسپیناس پالاس"
          initialDateRange="۲۵ فروردین ۱۴۰۵ - ۲۹ فروردین ۱۴۰۵"
          initialPassengers="۲ بزرگسال، ۱ کودک"
          onSearch={runSearch}
          onClear={clearSearch}
        />
        {searchState.status !== "idle" && (
          <SearchResultsSection
            criteria={searchState.criteria}
            results={searchResults}
            status={gridStatus}
            errorMessage="خطا در جستجو. لطفاً دوباره تلاش کنید."
            onRetry={retrySearch}
            onClear={clearSearch}
          />
        )}

        {/* Platform features + city-based hotel browser */}
        <PlatformFeatures />
        <Benefits />
        <section className="bg-white pb-10" aria-label="هتل‌ها بر اساس شهر">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <CityHotelsSection />
          </div>
        </section>

        {/* Top rated + campaign lists */}
        <BestHotelsSection />
        <CampaignHotelSection campaignId="firstBooking" />
        <CampaignHotelSection campaignId="loyalty" />
        <CampaignHotelSection campaignId="lastMinute" />

        {/* Corporate travel cards */}
        <TravelCards />

        {/* SEO + app */}
        <SeoArticle />

        {/* FAQ + blog */}
        <FaqSection />
        <BlogSection />

        <SiteFooter />
      </div>
    </FavoritesProvider>
  );
}
