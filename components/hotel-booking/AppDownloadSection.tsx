"use client";

import { useState } from "react";
import Image from "@/components/AppImage";
import { Modal } from "./Modal";
import { APP_DOWNLOAD } from "@/mock/content/app-download.mock";

/** The app promo image kept from the original design. */
const APP_PROMO_IMAGE =
  "/assets/app-promo.jpg";

/**
 * «اپلیکیشن سفرینو» section: download panel + QR area.
 * Until the release team sets real store URLs in the mock config
 * (mock/content/app-download.mock.ts), the UI renders an explicit
 * «به‌زودی» unavailable state — never a misleading fake link or QR.
 */
export function AppDownloadSection() {
  const [downloadOpen, setDownloadOpen] = useState(false);
  const anyAvailable = APP_DOWNLOAD.downloads.some((d) => d.url !== null);
  const qrUrl = APP_DOWNLOAD.qrTargetUrl;

  return (
    <div className="mt-12 bg-gradient-to-r from-[#fff1f2] to-[#fce7ed] border border-[#fce7ed] rounded-3xl p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-8">
      <div className="flex items-center gap-4">
        <div className="relative w-32 h-44 rounded-2xl overflow-hidden shadow-md">
          <Image
            src={APP_PROMO_IMAGE}
            alt="اپلیکیشن سفرینو"
            className="w-full h-full object-cover"
            fill
            sizes="(max-width: 640px) 100vw, 200px"
          />
        </div>
        <div>
          <h4 className="text-lg font-black text-[#d1134e] mb-1">
            {APP_DOWNLOAD.appName}
          </h4>
          <p className="text-xs text-gray-600 mb-3">{APP_DOWNLOAD.title}</p>
          <button
            type="button"
            onClick={() => setDownloadOpen(true)}
            aria-haspopup="dialog"
            className="flex items-center gap-2 text-xs font-semibold text-[#0070cd] hover:underline"
          >
            <span>مشاهده لینک‌های دانلود</span>
            <span className="flex gap-2 text-gray-700 text-sm">
              <i className="fa-brands fa-android" aria-hidden="true" />
              <i className="fa-brands fa-apple" aria-hidden="true" />
            </span>
          </button>
          <p className="text-[10px] text-gray-400 mt-1">{APP_DOWNLOAD.subtitle}</p>
        </div>
      </div>

      {/* QR area */}
      <div className="flex flex-col items-center border-t md:border-t-0 md:border-r border-gray-200 pt-4 md:pt-0 md:pr-8">
        {qrUrl ? (
          <div className="w-24 h-24 bg-white p-2 rounded-2xl border border-gray-200 shadow-sm flex items-center justify-center overflow-hidden">
            {/* Real QR of the configured URL — rendered by a QR image service configured in mock data. */}
            <Image
              src={`https://api.qrserver.com/v1/create-qr-code/?data=${encodeURIComponent(qrUrl)}&size=200x200&margin=0`}
              alt="QR کد دانلود اپلیکیشن سفرینو"
              width={200}
              height={200}
              unoptimized
              className="w-full h-full"
            />
          </div>
        ) : (
          <div
            className="w-24 h-24 bg-white/60 p-2 rounded-2xl border border-dashed border-gray-300 flex flex-col items-center justify-center gap-1 text-gray-400"
            role="img"
            aria-label="QR کد دانلود فعلاً در دسترس نیست"
          >
            <i className="fa-solid fa-qrcode text-3xl" aria-hidden="true" />
            <span className="text-[9px] font-bold">به‌زودی</span>
          </div>
        )}
        <span className="text-[11px] font-bold text-gray-600 mt-2">
          {APP_DOWNLOAD.qrLabel}
        </span>
      </div>

      {/* Download panel */}
      <Modal
        open={downloadOpen}
        onClose={() => setDownloadOpen(false)}
        title="لینک‌های دانلود اپلیکیشن سفرینو"
      >
        <ul className="space-y-3">
          {APP_DOWNLOAD.downloads.map((entry) => (
            <li
              key={entry.store}
              className="flex items-center justify-between gap-3 border border-gray-100 rounded-2xl px-4 py-3 bg-gray-50"
            >
              <span className="flex items-center gap-3 text-sm font-bold text-gray-800">
                <i className={`${entry.icon} text-2xl text-gray-700`} aria-hidden="true" />
                {entry.label}
              </span>
              {entry.url ? (
                <a
                  href={entry.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[11px] font-bold text-white bg-[#0070cd] hover:bg-[#005a9f] rounded-xl px-4 py-2 transition-colors"
                >
                  دانلود
                </a>
              ) : (
                <span className="text-[10px] font-bold text-amber-800 bg-amber-100 border border-amber-200 rounded-xl px-3 py-1.5">
                  به‌زودی
                </span>
              )}
            </li>
          ))}
        </ul>
        {!anyAvailable && (
          <p className="text-[10px] text-gray-400 leading-5 mt-4 border-t border-gray-100 pt-3">
            {APP_DOWNLOAD.unavailableMessage}
          </p>
        )}
      </Modal>
    </div>
  );
}
