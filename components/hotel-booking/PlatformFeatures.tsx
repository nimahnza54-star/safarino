"use client";

import { useState } from "react";
import Image from "@/components/AppImage";
import { Modal } from "./Modal";
import { PLATFORM_FEATURES, type PlatformFeature } from "@/mock/content/platform-features.mock";

/**
 * «چرا سفرینو» — the four platform feature cards. Clicking «اطلاعات بیشتر»
 * opens an accessible modal with the full detail of that specific feature.
 */
export function PlatformFeatures() {
  const [activeFeature, setActiveFeature] = useState<PlatformFeature | null>(null);

  return (
    <section className="pt-12 pb-4 bg-white" aria-labelledby="platform-features-title">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <h2 id="platform-features-title" className="text-2xl font-black text-gray-900 mb-2">
            سفرینو پنجره ای به دنیای گردشگری
          </h2>
          <div className="w-20 h-1 bg-[#e21b5b] mx-auto rounded-full" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {PLATFORM_FEATURES.map((feature) => (
            <div
              key={feature.id}
              className="bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-shadow flex flex-col text-center"
            >
              <div className="relative h-44 overflow-hidden">
                <Image
                  src={feature.image}
                  alt={feature.imageAlt}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                />
              </div>
              <div className="p-5 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="font-bold text-gray-900 text-base mb-2">{feature.title}</h3>
                  <p className="text-xs text-gray-500 leading-relaxed line-clamp-3">
                    {feature.shortDescription}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setActiveFeature(feature)}
                  aria-haspopup="dialog"
                  className="mt-4 text-xs font-bold text-[#0070cd] hover:text-blue-700 inline-flex items-center justify-center gap-1 transition-colors"
                >
                  <span>اطلاعات بیشتر</span>
                  <i className="fa-solid fa-angle-left text-[10px]" aria-hidden="true" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <Modal
        open={activeFeature !== null}
        onClose={() => setActiveFeature(null)}
        title={activeFeature?.title ?? ""}
      >
        {activeFeature && (
          <>
            <p className="text-xs text-gray-600 leading-6 mb-4">{activeFeature.detailLead}</p>
            <ul className="space-y-2.5 mb-4">
              {activeFeature.bullets.map((item) => (
                <li key={item} className="flex items-start gap-2 text-xs text-gray-700 leading-6">
                  <i className="fa-solid fa-check text-[#e21b5b] text-[10px] mt-1.5" aria-hidden="true" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
            <p className="text-[10px] text-gray-400 border-t border-gray-100 pt-3 leading-5">
              {activeFeature.footnote}
            </p>
          </>
        )}
      </Modal>
    </section>
  );
}
