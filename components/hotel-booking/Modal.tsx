"use client";

import { useEffect, useId, useRef, type ReactNode } from "react";

interface ModalProps {
  open: boolean;
  onClose: () => void;
  /** Used as the dialog's accessible name (aria-labelledby). */
  title: string;
  children: ReactNode;
  footer?: ReactNode;
}

/**
 * Accessible RTL modal: Escape to close, backdrop click to close,
 * body scroll lock, focus moves to the close button on open and is
 * restored to the previously focused element on close.
 */
export function Modal({ open, onClose, title, children, footer }: ModalProps) {
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const previousFocusRef = useRef<Element | null>(null);
  const titleId = useId();

  useEffect(() => {
    if (!open) return;

    previousFocusRef.current = document.activeElement;
    closeButtonRef.current?.focus();

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleKeyDown);

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = previousOverflow;
      if (previousFocusRef.current instanceof HTMLElement) {
        previousFocusRef.current.focus();
      }
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-4"
      role="presentation"
    >
      {/* Backdrop */}
      <button
        type="button"
        aria-label="بستن پنجره"
        className="absolute inset-0 bg-black/50 backdrop-blur-[2px] cursor-default"
        onClick={onClose}
        tabIndex={-1}
      />
      {/* Dialog */}
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className="relative w-full max-w-lg max-h-[85vh] overflow-y-auto bg-white rounded-3xl shadow-2xl border border-gray-100"
      >
        <div className="sticky top-0 z-10 flex items-center justify-between gap-4 bg-white/95 backdrop-blur px-6 pt-5 pb-3 border-b border-gray-100 rounded-t-3xl">
          <h2
            id={titleId}
            className="text-base sm:text-lg font-black text-gray-900"
          >
            {title}
          </h2>
          <button
            ref={closeButtonRef}
            type="button"
            onClick={onClose}
            aria-label="بستن"
            className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600 flex items-center justify-center transition-colors"
          >
            <i className="fa-solid fa-xmark text-sm" aria-hidden="true" />
          </button>
        </div>
        <div className="px-6 py-4">{children}</div>
        {footer ? (
          <div className="px-6 pb-5 pt-2 border-t border-gray-100">{footer}</div>
        ) : null}
      </div>
    </div>
  );
}
