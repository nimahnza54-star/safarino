"use client";

import { Headphones, BadgePercent, BadgeCheck, CreditCard } from "lucide-react";

interface Benefit {
  id: string;
  icon: React.ReactNode;
  title: string;
  description: string;
}

const BENEFITS: Benefit[] = [
  {
    id: "support-247",
    icon: <Headphones aria-hidden="true" strokeWidth={2} className="h-6 w-6" />,
    title: "پشتیبانی 24 ساعته",
    description: "همراه شما در تمام روزهای هفته",
  },
  {
    id: "best-price",
    icon: <BadgePercent aria-hidden="true" strokeWidth={2} className="h-6 w-6" />,
    title: "ضمانت بهترین قیمت",
    description: "بهترین قیمت و تخفیف‌های ویژه",
  },
  {
    id: "instant-confirm",
    icon: <BadgeCheck aria-hidden="true" strokeWidth={2} className="h-6 w-6" />,
    title: "تایید امن و فوری",
    description: "صدور و تایید فوری رزرو پس از ثبت",
  },
  {
    id: "secure-payment",
    icon: <CreditCard aria-hidden="true" strokeWidth={2} className="h-6 w-6" />,
    title: "پرداخت امن و راحت",
    description: "درگاه‌های امن و مطمئن بانکی",
  },
];

/**
 * «مزایای رزرو هتل» — four benefit cards, each with a dedicated lucide-react
 * icon centered inside a circular container. Uses Safarino's brand palette
 * (pink #e21b5b) for the icon containers and follows the existing design
 * system for typography, spacing, and RTL alignment.
 */
export function Benefits() {
  return (
    <section className="py-12 bg-white" aria-labelledby="benefits-title">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <h2 id="benefits-title" className="text-2xl font-black text-gray-900 mb-2">
            مزایای رزرو هتل با سفرینو
          </h2>
          <div className="w-20 h-1 bg-[#e21b5b] mx-auto rounded-full" />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {BENEFITS.map((benefit) => (
            <div
              key={benefit.id}
              className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow flex flex-col items-center text-center"
            >
              <div
                className="w-14 h-14 rounded-full bg-[#e21b5b]/10 flex items-center justify-center text-[#e21b5b] mb-4"
                aria-hidden="true"
              >
                {benefit.icon}
              </div>
              <h3 className="font-bold text-gray-900 text-base mb-1">
                {benefit.title}
              </h3>
              <p className="text-xs text-gray-500 leading-relaxed">
                {benefit.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}