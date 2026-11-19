"use client";

import { useNowSeconds } from "@/hooks/useNowSeconds";
import { getCampaignRemainingMs } from "@/services/campaigns.service";

interface CountdownProps {
  /** Stable ISO-8601 expiration timestamp (from mock campaign config or API). */
  expiresAt: string;
}

const FA_DIGITS = ["۰", "۱", "۲", "۳", "۴", "۵", "۶", "۷", "۸", "۹"];
const pad2 = (n: number) =>
  String(n)
    .padStart(2, "0")
    .split("")
    .map((d) => FA_DIGITS[Number(d)] ?? d)
    .join("");

/**
 * Ticks once per second toward `expiresAt`. During SSR/first paint a
 * stable placeholder is rendered to avoid hydration mismatches; remaining
 * time is always derived from the wall clock, never from decremented state.
 */
export function Countdown({ expiresAt }: CountdownProps) {
  const nowSec = useNowSeconds();
  const remainingMs =
    nowSec === -1 ? null : getCampaignRemainingMs(expiresAt, nowSec * 1000);

  const box = (value: string) => (
    <span className="bg-[#e21b5b] px-1.5 py-0.5 rounded tabular-nums">{value}</span>
  );

  return (
    <div
      className="flex items-center gap-1.5 bg-gray-900 text-white px-3 py-1.5 rounded-xl font-mono text-xs font-bold shadow"
      role="timer"
      aria-label="زمان باقی‌مانده کمپین لحظه آخری"
    >
      {remainingMs === null ? (
        <>
          {box("--")}<span>:</span>{box("--")}<span>:</span>{box("--")}
        </>
      ) : remainingMs === 0 ? (
        <span className="px-1 text-[11px] font-sans">مهلت تمام شد</span>
      ) : (
        (() => {
          const totalSeconds = Math.floor(remainingMs / 1000);
          const hours = Math.floor(totalSeconds / 3600);
          const minutes = Math.floor((totalSeconds % 3600) / 60);
          const seconds = totalSeconds % 60;
          return (
            <>
              {box(pad2(hours))}<span>:</span>
              {box(pad2(minutes))}<span>:</span>
              {box(pad2(seconds))}
            </>
          );
        })()
      )}
    </div>
  );
}
