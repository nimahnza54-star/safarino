
"use client";

import Link from "next/link";
import { ChevronDown } from "lucide-react";
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
  const [activeModalId, setActiveModalId] = useState<string | null>(null);
  const moreRef = useRef<HTMLDivElement>(null);

  const openModal = (modalId: string) => {
    setActiveModalId(modalId);
    setMoreOpen(false);
  };

  const isHotel = activeSection === "hotel";
  const isAccommodation = activeSection === "accommodation";

  const activeNavClass =
    "text-[#e21b5b] font-semibold border-b-2 border-[#e21b5b] pb-1";

  const inactiveNavClass =
    "text-gray-700 transition-colors duration-200 hover:text-[#e21b5b]";

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      const target = event.target as Node;

      if (moreRef.current && !moreRef.current.contains(target)) {
        setMoreOpen(false);
      }
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setMoreOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  return (
    <>
    <header className="sticky top-0 z-50 border-b border-gray-200 bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-20 items-center justify-between">

          {/* Right: Logo & Primary Navigation */}
          <div className="flex items-center space-x-8 space-x-reverse">

            {/* Logo */}
            <Link href="/" className="group flex items-center gap-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#e21b5b] text-white shadow-md shadow-[#e21b5b]/20 transition-transform group-hover:scale-105">
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
                <span className="text-2xl font-black tracking-tight text-[#e21b5b]">
                  سفرینو
                </span>

                <span className="-mt-1 text-[10px] font-normal text-gray-400">
                  سفری به دنیای نو
                </span>
              </div>
            </Link>

            {/* Navigation */}
            <nav className="mr-8 hidden items-center gap-x-8 overflow-visible text-sm font-medium lg:flex">

              <Link
                href="/hotel-booking"
                className={isHotel ? activeNavClass : inactiveNavClass}
              >
                رزرو هتل
              </Link>

              <Link
                href="/accommodation-booking"
                className={
                  isAccommodation ? activeNavClass : inactiveNavClass
                }
              >
                ویلا و اقامتگاه
              </Link>

              {/* More Dropdown */}
              <div
                ref={moreRef}
                className="relative"
                onMouseEnter={() => setMoreOpen(true)}
                onMouseLeave={() => setMoreOpen(false)}
              >
                {/* Trigger */}
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
                  aria-controls="more-dropdown"
                >
                  <span>بیشتر</span>

                  <ChevronDown
                    className={`h-4 w-4 transition-transform duration-200 ease-in-out ${
                      moreOpen
                        ? "rotate-180 text-[#e21b5b]"
                        : "rotate-0 text-gray-400"
                    }`}
                    aria-hidden="true"
                  />
                </button>

                {/* Dropdown */}
                <div
                  id="more-dropdown"
                  className={`absolute right-0 top-full z-[9999] w-[200px] pt-2 transition-all duration-200 ease-out ${
                    moreOpen
                      ? "visible translate-y-0 opacity-100"
                      : "invisible pointer-events-none translate-y-1 opacity-0"
                  }`}
                >
                  {/* Invisible hover bridge */}
                  <div
                    className="absolute bottom-full right-0 left-0 h-2"
                    aria-hidden="true"
                  />

                  <div className="overflow-hidden rounded-xl border border-gray-100 bg-white py-2 shadow-xl">

                    <button
                      type="button"
                      onClick={() => openModal("travel-insurance")}
                      className="block w-full px-4 py-3 text-right text-sm text-gray-700 transition-colors duration-200 hover:bg-gray-50 hover:text-[#e21b5b]"
                    >
                      بیمه مسافرتی
                    </button>

                    <button
                      type="button"
                      onClick={() => openModal("careers")}
                      className="block w-full px-4 py-3 text-right text-sm text-gray-700 transition-colors duration-200 hover:bg-gray-50 hover:text-[#e21b5b]"
                    >
                      استخدام سفرینو
                    </button>

                    <button
                      type="button"
                      onClick={() => openModal("about-us")}
                      className="block w-full px-4 py-3 text-right text-sm text-gray-700 transition-colors duration-200 hover:bg-gray-50 hover:text-[#e21b5b]"
                    >
                      درباره ما
                    </button>

                  </div>
                </div>
              </div>

              <Link
                href="/accommodation-booking"
                className="text-gray-700 transition-colors duration-200 hover:text-[#e21b5b]"
              >
                میزبان شوید
              </Link>

            </nav>
          </div>

          {/* Left: Quick Actions, Support & User Account */}
          <div className="flex items-center space-x-4 space-x-reverse text-sm">

            <a
              href="tel:02188880000"
              className="hidden items-center gap-2 rounded-lg border border-gray-200 px-3 py-2 text-gray-600 transition-all hover:border-[#fad1dd] hover:text-[#e21b5b] sm:flex"
            >
              <i className="fa-solid fa-headset text-[#e21b5b]"></i>

              <span className="text-xs font-medium">
                مرکز پشتیبانی آنلاین
              </span>
            </a>

            <button
              type="button"
              onClick={() => openModal("my-trips")}
              className="hidden items-center gap-2 px-2 py-2 text-gray-600 transition-colors hover:text-gray-900 md:flex"
            >
              <i className="fa-solid fa-suitcase-rolling text-gray-400"></i>

              <span className="text-xs font-medium">
                سفرهای من
              </span>
            </button>

            <div className="relative">
              <button
                type="button"
                onClick={() => openModal("account-login")}
                className="flex items-center gap-2 rounded-xl border border-gray-300 bg-white px-4 py-2 text-xs font-semibold text-gray-700 shadow-sm transition hover:border-[#e21b5b]"
              >
                <i className="fa-regular fa-user text-sm"></i>

                <span>ورود یا ثبت‌نام</span>
              </button>
            </div>

            <button
              type="button"
              onClick={() => openModal("settings")}
              className="p-2 text-gray-400 transition-colors hover:text-gray-600"
              title="تنظیمات"
              aria-label="تنظیمات"
            >
              <i className="fa-solid fa-globe text-base"></i>
            </button>

          </div>
        </div>
      </div>
    </header>
    <InfoModal modalId={activeModalId} onClose={() => setActiveModalId(null)} />
    </>
  );
}
