
"use client";

import Link from "next/link";
import {
  ChevronDown,
  Menu,
  X,
  Globe,
  User,
  Headset,
  BriefcaseBusiness,
} from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { InfoModal } from "@/components/hotel-booking/InfoModal";

type ActiveSection = "hotel" | "accommodation";

interface MainHeaderProps {
  activeSection?: ActiveSection;
}

export default function MainHeader({
  activeSection = "hotel",
}: MainHeaderProps) {
  const [moreOpen, setMoreOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeModalId, setActiveModalId] = useState<string | null>(null);

  const headerRef = useRef<HTMLElement>(null);

  const isHotel = activeSection === "hotel";
  const isAccommodation = activeSection === "accommodation";

  const openModal = (modalId: string) => {
    setActiveModalId(modalId);
    setMoreOpen(false);
    setMobileMenuOpen(false);
  };

  const closeMenus = () => {
    setMoreOpen(false);
    setMobileMenuOpen(false);
  };

  // Close menus when clicking outside or pressing Escape
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      const target = event.target as Node;

      if (
        headerRef.current &&
        !headerRef.current.contains(target)
      ) {
        closeMenus();
      }
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        closeMenus();
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  const activeNavClass =
    "text-[#e21b5b] font-semibold border-b-2 border-[#e21b5b] pb-1";

  const inactiveNavClass =
    "text-gray-700 transition-colors duration-200 hover:text-[#e21b5b]";

  const mobileNavClass = (active: boolean) =>
    `block w-full rounded-lg px-4 py-3 text-right text-sm font-medium transition-colors duration-200 ${
      active
        ? "bg-[#fff0f4] text-[#e21b5b]"
        : "text-gray-700 hover:bg-gray-50 hover:text-[#e21b5b]"
    }`;

  return (
    <>
      <header
        ref={headerRef}
        className="sticky top-0 z-50 w-full border-b border-gray-200 bg-white"
        dir="rtl"
      >
        <div className="mx-auto max-w-7xl px-3 sm:px-6 lg:px-8">

          {/* Main Header */}
          <div className="flex min-h-16 items-center justify-between gap-2 sm:min-h-20">

            {/* Right: Logo & Desktop Navigation */}
            <div className="flex min-w-0 items-center gap-4 lg:gap-8">

              {/* Logo */}
              <Link
                href="/"
                onClick={closeMenus}
                className="group flex shrink-0 items-center gap-2"
              >
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#e21b5b] text-white shadow-md shadow-[#e21b5b]/20 transition-transform group-hover:scale-105 sm:h-10 sm:w-10">
                  <svg
                    className="h-5 w-5 text-white"
                    viewBox="0 0 128 128"
                    fill="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      fill="currentColor"
                      d="M28.9700376,63.3244248 C47.6273373,55.1957357 60.0684594,49.8368063 66.2934036,47.2476366 C84.0668845,39.855031 87.7600616,38.5708563 90.1672227,38.528 C90.6966555,38.5191258 91.8804274,38.6503351 92.6472251,39.2725385 C93.294694,39.7979149 93.4728387,40.5076237 93.5580865,41.0057381 C93.6433345,41.5038525 93.7494885,42.63857 93.6651041,43.5252052 C92.7019529,53.6451182 88.5344133,78.2034783 86.4142057,89.5379542 C85.5170662,94.3339958 83.750571,95.9420841 82.0403991,96.0994568 C78.3237996,96.4414641 75.5015827,93.6432685 71.9018743,91.2836143 C66.2690414,87.5912212 63.0868492,85.2926952 57.6192095,81.6896017 C51.3004058,77.5256038 55.3966232,75.2369981 58.9976911,71.4967761 C59.9401076,70.5179421 76.3155302,55.6232293 76.6324771,54.2720454 C76.6721165,54.1030573 76.7089039,53.4731496 76.3346867,53.1405352 C75.9604695,52.8079208 75.4081573,52.921662 75.0095933,53.0121213 C74.444641,53.1403447 65.4461175,59.0880351 48.0140228,70.8551922 C45.4598218,72.6091037 43.1463059,73.4636682 41.0734751,73.4188859 C38.7883453,73.3695169 34.3926725,72.1268388 31.1249416,71.0646282 C27.1169366,69.7617838 23.931454,69.0729605 24.208838,66.8603276 C24.3533166,65.7078514 25.9403832,64.5292172 28.9700376,63.3244248 Z"
                    />
                  </svg>
                </div>

                <div className="flex flex-col">
                  <span className="text-xl font-black tracking-tight text-[#e21b5b] sm:text-2xl">
                    سفرینو
                  </span>

                  <span className="-mt-1 text-[9px] font-normal text-gray-400 sm:text-[10px]">
                    سفری به دنیای نو
                  </span>
                </div>
              </Link>

              {/* Desktop Navigation */}
              <nav className="hidden items-center gap-x-6 text-sm font-medium xl:gap-x-8 lg:flex">

                <Link
                  href="/hotel-booking"
                  className={
                    isHotel ? activeNavClass : inactiveNavClass
                  }
                >
                  رزرو هتل
                </Link>

                <Link
                  href="/accommodation-booking"
                  className={
                    isAccommodation
                      ? activeNavClass
                      : inactiveNavClass
                  }
                >
                  ویلا و اقامتگاه
                </Link>

                {/* More Dropdown */}
                <div
                  className="relative"
                  onMouseEnter={() => setMoreOpen(true)}
                  onMouseLeave={() => setMoreOpen(false)}
                >
                  <button
                    type="button"
                    onClick={() => setMoreOpen((prev) => !prev)}
                    className={`flex items-center gap-2 py-2 transition-colors duration-200 ${
                      moreOpen
                        ? "text-[#e21b5b]"
                        : "text-gray-700 hover:text-[#e21b5b]"
                    }`}
                    aria-haspopup="true"
                    aria-expanded={moreOpen}
                    aria-controls="desktop-more-dropdown"
                  >
                    <span>بیشتر</span>

                    <ChevronDown
                      className={`h-4 w-4 transition-transform duration-200 ${
                        moreOpen
                          ? "rotate-180 text-[#e21b5b]"
                          : "text-gray-400"
                      }`}
                    />
                  </button>

                  <div
                    id="desktop-more-dropdown"
                    className={`absolute right-0 top-full z-[9999] w-52 pt-2 transition-all duration-200 ${
                      moreOpen
                        ? "visible translate-y-0 opacity-100"
                        : "pointer-events-none invisible translate-y-1 opacity-0"
                    }`}
                  >
                    <div className="overflow-hidden rounded-xl border border-gray-100 bg-white py-2 shadow-xl">

                      <button
                        type="button"
                        onClick={() => openModal("travel-insurance")}
                        className="block w-full px-4 py-3 text-right text-sm text-gray-700 transition-colors hover:bg-gray-50 hover:text-[#e21b5b]"
                      >
                        بیمه مسافرتی
                      </button>

                      <button
                        type="button"
                        onClick={() => openModal("careers")}
                        className="block w-full px-4 py-3 text-right text-sm text-gray-700 transition-colors hover:bg-gray-50 hover:text-[#e21b5b]"
                      >
                        استخدام سفرینو
                      </button>

                      <button
                        type="button"
                        onClick={() => openModal("about-us")}
                        className="block w-full px-4 py-3 text-right text-sm text-gray-700 transition-colors hover:bg-gray-50 hover:text-[#e21b5b]"
                      >
                        درباره ما
                      </button>

                    </div>
                  </div>
                </div>

                <Link
                  href="/accommodation-booking"
                  className={inactiveNavClass}
                >
                  میزبان شوید
                </Link>

              </nav>
            </div>

            {/* Left: Actions */}
            <div className="flex shrink-0 items-center gap-1.5 text-sm sm:gap-3">

              {/* Support - Desktop */}
              <a
                href="tel:02188880000"
                className="hidden items-center gap-2 rounded-lg border border-gray-200 px-3 py-2 text-gray-600 transition-all hover:border-[#fad1dd] hover:text-[#e21b5b] xl:flex"
              >
                <Headset className="h-4 w-4 text-[#e21b5b]" />

                <span className="text-xs font-medium">
                  مرکز پشتیبانی آنلاین
                </span>
              </a>

              {/* My Trips */}
              <button
                type="button"
                onClick={() => openModal("my-trips")}
                className="hidden items-center gap-2 px-2 py-2 text-gray-600 transition-colors hover:text-gray-900 md:flex"
              >
                <BriefcaseBusiness className="h-4 w-4 text-gray-400" />

                <span className="text-xs font-medium">
                  سفرهای من
                </span>
              </button>

              {/* Login */}
              <button
                type="button"
                onClick={() => openModal("account-login")}
                className="flex items-center gap-1.5 rounded-lg border border-gray-300 bg-white px-2.5 py-2 text-[11px] font-semibold text-gray-700 shadow-sm transition hover:border-[#e21b5b] hover:text-[#e21b5b] sm:gap-2 sm:rounded-xl sm:px-4 sm:text-xs"
              >
                <User className="h-4 w-4" />

                <span className="whitespace-nowrap">
                  ورود یا ثبت‌نام
                </span>
              </button>

              {/* Settings */}
              <button
                type="button"
                onClick={() => openModal("settings")}
                className="hidden p-2 text-gray-400 transition-colors hover:text-gray-600 sm:block"
                title="تنظیمات"
                aria-label="تنظیمات"
              >
                <Globe className="h-5 w-5" />
              </button>

              {/* Mobile Menu Button */}
              <button
                type="button"
                onClick={() => {
                  setMobileMenuOpen((prev) => !prev);
                  setMoreOpen(false);
                }}
                className="flex h-9 w-9 items-center justify-center rounded-lg border border-gray-200 text-gray-700 transition-colors hover:border-[#e21b5b] hover:text-[#e21b5b] lg:hidden"
                aria-label={
                  mobileMenuOpen
                    ? "بستن منو"
                    : "باز کردن منو"
                }
                aria-expanded={mobileMenuOpen}
                aria-controls="mobile-navigation"
              >
                {mobileMenuOpen ? (
                  <X className="h-5 w-5" />
                ) : (
                  <Menu className="h-5 w-5" />
                )}
              </button>

            </div>
          </div>

          {/* Mobile Navigation */}
          <div
            id="mobile-navigation"
            className={`overflow-hidden transition-all duration-300 ease-in-out lg:hidden ${
              mobileMenuOpen
                ? "max-h-[650px] border-t border-gray-100 opacity-100"
                : "max-h-0 border-t-0 opacity-0"
            }`}
          >
            <nav className="space-y-1 py-3">

              <Link
                href="/hotel-booking"
                onClick={closeMenus}
                className={mobileNavClass(isHotel)}
              >
                رزرو هتل
              </Link>

              <Link
                href="/accommodation-booking"
                onClick={closeMenus}
                className={mobileNavClass(isAccommodation)}
              >
                ویلا و اقامتگاه
              </Link>

              {/* Mobile More Dropdown */}
              <div>
                <button
                  type="button"
                  onClick={() => setMoreOpen((prev) => !prev)}
                  className="flex w-full items-center justify-between rounded-lg px-4 py-3 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 hover:text-[#e21b5b]"
                  aria-expanded={moreOpen}
                >
                  <span>بیشتر</span>

                  <ChevronDown
                    className={`h-4 w-4 text-gray-400 transition-transform duration-200 ${
                      moreOpen ? "rotate-180 text-[#e21b5b]" : ""
                    }`}
                  />
                </button>

                <div
                  className={`overflow-hidden transition-all duration-200 ${
                    moreOpen
                      ? "max-h-48 opacity-100"
                      : "max-h-0 opacity-0"
                  }`}
                >
                  <div className="mr-4 border-r-2 border-[#fad1dd] py-1 pr-3">

                    <button
                      type="button"
                      onClick={() => openModal("travel-insurance")}
                      className="block w-full rounded-lg px-4 py-2.5 text-right text-sm text-gray-600 transition-colors hover:bg-gray-50 hover:text-[#e21b5b]"
                    >
                      بیمه مسافرتی
                    </button>

                    <button
                      type="button"
                      onClick={() => openModal("careers")}
                      className="block w-full rounded-lg px-4 py-2.5 text-right text-sm text-gray-600 transition-colors hover:bg-gray-50 hover:text-[#e21b5b]"
                    >
                      استخدام سفرینو
                    </button>

                    <button
                      type="button"
                      onClick={() => openModal("about-us")}
                      className="block w-full rounded-lg px-4 py-2.5 text-right text-sm text-gray-600 transition-colors hover:bg-gray-50 hover:text-[#e21b5b]"
                    >
                      درباره ما
                    </button>

                  </div>
                </div>
              </div>

              <Link
                href="/accommodation-booking"
                onClick={closeMenus}
                className={mobileNavClass(false)}
              >
                میزبان شوید
              </Link>

              <div className="my-2 border-t border-gray-100" />

              {/* Mobile My Trips */}
              <button
                type="button"
                onClick={() => openModal("my-trips")}
                className="flex w-full items-center gap-3 rounded-lg px-4 py-3 text-sm text-gray-600 transition-colors hover:bg-gray-50 hover:text-[#e21b5b]"
              >
                <BriefcaseBusiness className="h-4 w-4 text-gray-400" />
                سفرهای من
              </button>

              {/* Mobile Support */}
              <a
                href="tel:02188880000"
                onClick={closeMenus}
                className="flex w-full items-center gap-3 rounded-lg px-4 py-3 text-sm text-gray-600 transition-colors hover:bg-gray-50 hover:text-[#e21b5b]"
              >
                <Headset className="h-4 w-4 text-[#e21b5b]" />
                مرکز پشتیبانی آنلاین
              </a>

              {/* Mobile Settings */}
              <button
                type="button"
                onClick={() => openModal("settings")}
                className="flex w-full items-center gap-3 rounded-lg px-4 py-3 text-sm text-gray-600 transition-colors hover:bg-gray-50 hover:text-[#e21b5b]"
              >
                <Globe className="h-4 w-4 text-gray-400" />
                تنظیمات
              </button>

            </nav>
          </div>

        </div>
      </header>

      {/* Modals */}
      <InfoModal
        modalId={activeModalId}
        onClose={() => setActiveModalId(null)}
      />
    </>
  );
}
