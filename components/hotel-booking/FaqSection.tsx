"use client";

import { useState } from "react";
import { HOTEL_FAQS, type FaqItemData } from "@/mock/content/faqs.mock";

function FaqItem({ faq, initialOpen = false }: { faq: FaqItemData; initialOpen?: boolean }) {
  const [open, setOpen] = useState(initialOpen);
  const contentId = `faq-content-${faq.id}`;

  return (
    <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden transition shadow-sm">
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        aria-expanded={open}
        aria-controls={contentId}
        className="w-full flex items-center justify-between p-4 text-right font-bold text-xs sm:text-sm text-gray-800 hover:text-[#e21b5b] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#e21b5b]"
      >
        <span className="flex items-center gap-2">
          <span
            className="w-6 h-6 rounded-full bg-[#e21b5b]/10 text-[#e21b5b] flex items-center justify-center text-xs"
            aria-hidden="true"
          >
            ؟
          </span>
          <span>{faq.question}</span>
        </span>
        <i
          className={`fa-solid fa-chevron-down text-xs text-gray-400 transition-transform ${
            open ? "rotate-180" : ""
          }`}
          aria-hidden="true"
        />
      </button>
      <div
        id={contentId}
        className={`px-5 pb-4 text-xs text-gray-500 leading-relaxed border-t border-gray-100 pt-3 ${
          open ? "" : "hidden"
        }`}
      >
        {faq.answer}
      </div>
    </div>
  );
}

/** «پرسش‌های متداول درباره رزرو هتل در سفرینو» — accordion. */
export function FaqSection() {
  return (
    <section id="faq" className="py-12 bg-gray-50" aria-labelledby="faq-title">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h3 id="faq-title" className="text-xl font-black text-gray-900 mb-2">
            پرسش‌های متداول درباره رزرو هتل در سفرینو
          </h3>
          <p className="text-xs text-gray-500">
            پاسخ سریع به رایج‌ترین سؤال‌های مسافران و همکاران ما در مرکز تماس
          </p>
        </div>
        <div className="space-y-3">
          {HOTEL_FAQS.map((faq) => (
            <FaqItem key={faq.id} faq={faq} />
          ))}
        </div>
      </div>
    </section>
  );
}
