"use client";

import { useState } from "react";
import Image from "@/components/AppImage";
import { Modal } from "./Modal";
import {
  TRAVEL_CARD_PRODUCTS,
  type TravelCardProduct,
} from "@/mock/content/travel-card.mock";

/**
 * «سفر کارت سفرینو» — the three corporate products. Each card's
 * «اطلاعات بیشتر» opens the detail modal for that specific product.
 */
export function TravelCards() {
  const [activeProduct, setActiveProduct] = useState<TravelCardProduct | null>(null);

  return (
    <section className="py-10 bg-gray-50" aria-labelledby="travel-cards-title">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h2 id="travel-cards-title" className="text-2xl font-black text-gray-900 mb-2">
            سفر کارت سفرینو
          </h2>
          <div className="w-20 h-1 bg-[#e21b5b] mx-auto rounded-full" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {TRAVEL_CARD_PRODUCTS.map((product) => (
            <div
              key={product.id}
              className="bg-white rounded-3xl overflow-hidden border border-gray-200 shadow-sm flex flex-col"
            >
              <div className="relative h-40 w-full overflow-hidden">
                <Image
                  src={product.image}
                  alt={product.imageAlt}
                  className="w-full h-full object-cover"
                  fill
                  sizes="(max-width: 768px) 100vw, 33vw"
                />
              </div>
              <div className="p-5 flex flex-col flex-1">
                <h3 className="text-base font-black text-[#e21b5b]">{product.title}</h3>
                <p className="text-[11px] text-gray-400 mb-3">{product.tagline}</p>
                <ul className="text-xs text-gray-600 space-y-1.5 mb-4">
                  {product.items.map((item) => (
                    <li key={item} className="flex items-center gap-2">
                      <i className="fa-solid fa-check text-[#e21b5b] text-[10px]" aria-hidden="true" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
                <button
                  type="button"
                  onClick={() => setActiveProduct(product)}
                  aria-haspopup="dialog"
                  className="mt-auto self-start bg-[#0070cd] hover:bg-[#005a9f] text-white font-bold text-xs py-2.5 px-6 rounded-xl transition shadow"
                >
                  {product.ctaLabel}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <Modal
        open={activeProduct !== null}
        onClose={() => setActiveProduct(null)}
        title={activeProduct?.title ?? ""}
      >
        {activeProduct && (
          <>
            <p className="text-xs text-gray-600 leading-6 mb-4">{activeProduct.detailLead}</p>
            <ul className="space-y-2.5 mb-4">
              {activeProduct.bullets.map((item) => (
                <li key={item} className="flex items-start gap-2 text-xs text-gray-700 leading-6">
                  <i className="fa-solid fa-check text-[#e21b5b] text-[10px] mt-1.5" aria-hidden="true" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
            <p className="text-[10px] text-gray-400 border-t border-gray-100 pt-3 leading-5">
              {activeProduct.footnote}
            </p>
          </>
        )}
      </Modal>
    </section>
  );
}
