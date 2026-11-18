"use client";

import {
  CONTACT_INFO,
  FOOTER_INFO_MODALS,
} from "@/mock/content/footer.mock";
import { Modal } from "./Modal";

interface InfoModalProps {
  /** Key into FOOTER_INFO_MODALS; null closes. */
  modalId: string | null;
  onClose: () => void;
}

/**
 * Shared informational modal used by the footer and the header
 * («درباره ما», «بیمه مسافرتی», «سفرهای من», …). Content lives in
 * mock/content/footer.mock.ts so every entry has a real destination.
 */
export function InfoModal({ modalId, onClose }: InfoModalProps) {
  const activeModal = modalId ? FOOTER_INFO_MODALS[modalId] : undefined;

  return (
    <Modal
      open={activeModal !== undefined}
      onClose={onClose}
      title={activeModal?.title ?? ""}
      footer={
        activeModal?.phoneCta ? (
          <a
            href={CONTACT_INFO.phoneHref}
            dir="ltr"
            className="flex w-full items-center justify-center gap-2 bg-[#e21b5b] hover:bg-[#d1134e] text-white text-xs font-bold py-3 rounded-xl transition-colors"
          >
            <i className="fa-solid fa-phone" aria-hidden="true" />
            {CONTACT_INFO.phoneDisplay}
          </a>
        ) : undefined
      }
    >
      {activeModal && (
        <>
          {activeModal.paragraphs.map((paragraph) => (
            <p key={paragraph.slice(0, 32)} className="text-xs text-gray-600 leading-6 mb-3">
              {paragraph}
            </p>
          ))}
          {activeModal.bullets && (
            <ul className="space-y-2">
              {activeModal.bullets.map((item) => (
                <li key={item} className="flex items-start gap-2 text-xs text-gray-700 leading-6">
                  <i className="fa-solid fa-check text-[#e21b5b] text-[10px] mt-1.5" aria-hidden="true" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          )}
        </>
      )}
    </Modal>
  );
}
