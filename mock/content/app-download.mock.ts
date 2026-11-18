/**
 * Configuration for the «اپلیکیشن سفرینو» section.
 *
 * Download URLs and the QR target are intentionally `null` until the
 * backend/release team provides real destinations. The UI renders a
 * clearly-labelled unavailable state in that case — it never shows a
 * misleading working link or QR code. To enable downloads later, set
 * these values (e.g. from an API response) and no other change is needed.
 */
export interface StoreDownloadEntry {
  store: "android" | "ios";
  label: string;
  icon: string;
  /** null = not available yet; UI shows a «به‌زودی» state for this store. */
  url: string | null;
}

export interface AppDownloadConfig {
  /** Product name shown as the heading («سفرینو»). */
  appName: string;
  badgeTitle: string;
  title: string;
  subtitle: string;
  platformIcons: string[];
  qrLabel: string;
  /** Target URL encoded in the QR code. null = QR hidden, unavailable state shown. */
  qrTargetUrl: string | null;
  downloads: StoreDownloadEntry[];
  unavailableMessage: string;
}

export const APP_DOWNLOAD: AppDownloadConfig = {
  appName: "سفرینو",
  badgeTitle: "اپلیکیشن سفرینو",
  title: "سریع‌تر و مطمئن‌تر به سفر بروید",
  subtitle: "قابل نصب روی اندروید و آیفون",
  platformIcons: ["fa-brands fa-android", "fa-brands fa-apple"],
  qrLabel: "برای دانلود اسکن کنید!",
  qrTargetUrl: null,
  downloads: [
    {
      store: "android",
      label: "دانلود نسخه اندروید",
      icon: "fa-brands fa-android",
      url: null,
    },
    {
      store: "ios",
      label: "دانلود نسخه iOS",
      icon: "fa-brands fa-apple",
      url: null,
    },
  ],
  unavailableMessage:
    "لینک مستقیم دانلود اپلیکیشن سفرینو هنوز منتشر نشده است. به‌محض انتشار رسمی در کافه‌بازار و اپ‌استور، این بخش به‌روزرسانی می‌شود.",
};
