"use client";

import Link from "next/link";
import { useState, type ReactNode } from "react";
import { Headphones, BadgePercent, BadgeCheck, CreditCard } from "lucide-react";
import {
  BOTTOM_BAR_LINKS,
  CONTACT_INFO,
  FOOTER_COLUMNS,
  SITE_CONFIG,
  SOCIAL_LINKS,
  type FooterAction,
} from "@/mock/content/footer.mock";
import { TRUST_BADGES } from "@/mock/content/site-content.mock";
import { InfoModal } from "./InfoModal";

const TRUST_BADGE_ICONS: Record<string, React.ReactNode> = {
  "fa-headset": <Headphones aria-hidden="true" strokeWidth={2} className="text-xl" />,
  "fa-tags": <BadgePercent aria-hidden="true" strokeWidth={2} className="text-xl" />,
  "fa-bolt-lightning": <BadgeCheck aria-hidden="true" strokeWidth={2} className="text-xl" />,
  "fa-shield-halved": <CreditCard aria-hidden="true" strokeWidth={2} className="text-xl" />,
};

/**
 * Footer — fully driven by mock/content/footer.mock.ts.
 * Links render as routes (existing app routes), tel: anchors, or buttons
 * that open informational modals. No href="#" placeholders anywhere.
 */
export function SiteFooter() {
  const [activeModalId, setActiveModalId] = useState<string | null>(null);

  const renderAction = (
    action: FooterAction,
    label: string,
    className: string,
    children?: ReactNode
  ) => {
    switch (action.type) {
      case "route":
        return (
          <Link href={action.href} className={className} aria-label={label}>
            {children ?? label}
          </Link>
        );
      case "tel":
      case "mailto":
        return (
          <a href={action.href} className={className} aria-label={label}>
            {children ?? label}
          </a>
        );
      case "modal":
        return (
          <button type="button" onClick={() => setActiveModalId(action.modalId)} className={className} aria-label={label}>
            {children ?? label}
          </button>
        );
    }
  };

  return (
    <footer className="bg-gray-100 border-t border-gray-200 pt-12 pb-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Trust badges */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pb-10 border-b border-gray-200 text-center">
          {TRUST_BADGES.map((badge) => (
            <div key={badge.id} className="flex flex-col items-center">
              <div className="w-12 h-12 rounded-2xl bg-white border border-gray-200 flex items-center justify-center text-[#e21b5b] mb-3 shadow-sm">
                {TRUST_BADGE_ICONS[badge.icon] ?? (
                  <i className={`fa-solid ${badge.icon}`} aria-hidden="true" />
                )}
              </div>
              <h5 className="font-bold text-xs text-gray-900">{badge.title}</h5>
              <p className="text-[11px] text-gray-500 mt-1">{badge.description}</p>
            </div>
          ))}
        </div>

        {/* Links grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 py-10 border-b border-gray-200 text-xs">
          {FOOTER_COLUMNS.map((column) => (
            <nav key={column.title} aria-label={column.title}>
              <h5 className="font-black text-gray-900 text-sm mb-4">{column.title}</h5>
              <ul className="space-y-2.5 text-gray-600">
                {column.links.map((link) => (
                  <li key={link.label}>
                    {renderAction(link.action, link.label, "hover:text-[#e21b5b] transition-colors")}
                  </li>
                ))}
              </ul>
            </nav>
          ))}

          {/* Contact column */}
          <div>
            <h5 className="font-black text-gray-900 text-sm mb-4">ارتباط با ما</h5>
            <p className="text-gray-600 text-xs leading-relaxed mb-4">
              تلفن پشتیبانی:{" "}
              <a
                href={CONTACT_INFO.phoneHref}
                className="font-bold text-gray-800 hover:text-[#e21b5b] transition-colors"
                dir="ltr"
              >
                {CONTACT_INFO.phoneDisplay}
              </a>
              <br />
              {CONTACT_INFO.address}
            </p>
            <div className="flex items-center gap-4 text-lg text-gray-500">
              {SOCIAL_LINKS.map((social) => (
                <span key={social.id}>
                  {renderAction(
                    social.action,
                    social.label,
                    "hover:text-[#e21b5b] transition-colors",
                    <i className={social.icon} aria-hidden="true" />
                  )}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between text-[11px] text-gray-400 gap-4">
          <p>
            {SITE_CONFIG.copyrightNotice}. © {SITE_CONFIG.copyrightYear}
          </p>
          <div className="flex items-center gap-4">
            {BOTTOM_BAR_LINKS.map((link) => (
              <span key={link.label}>
                {renderAction(link.action, link.label, "hover:underline")}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Informational modals */}
      <InfoModal modalId={activeModalId} onClose={() => setActiveModalId(null)} />
    </footer>
  );
}
