/**
 * Miscellaneous site-wide copy: top notification bar, trust badges,
 * and the SEO article shown above the app-download box.
 */

export const TOP_NOTIFICATION = {
  message:
    "اطلاعیه مهم: پروازها و اسکان مناطق تحت نظارت با تخفیف ویژه نوروز ۱۴۰۵ ارائه می‌شود. برای اطلاعات بیشتر با پشتیبانی در تماس باشید.",
} as const;

export interface TrustBadge {
  id: string;
  icon: string;
  title: string;
  description: string;
}

export const TRUST_BADGES: TrustBadge[] = [
  {
    id: "support-247",
    icon: "fa-headset",
    title: "پشتیبانی ۲۴ ساعته",
    description: "همراه شما در تمام روزهای هفته",
  },
  {
    id: "best-price",
    icon: "fa-tags",
    title: "ضمانت بهترین قیمت",
    description: "بهترین قیمت و تخفیف‌های ویژه",
  },
  {
    id: "instant-confirm",
    icon: "fa-bolt-lightning",
    title: "تایید امن و فوری",
    description: "صدور و تایید فوری رزرو پس از ثبت",
  },
  {
    id: "secure-payment",
    icon: "fa-shield-halved",
    title: "پرداخت امن و راحت",
    description: "درگاه‌های امن و مطمئن بانکی",
  },
];

export const SEO_ARTICLE = {
  title: "رزرو هتل در سفرینو",
  paragraphs: [
    "رزرو هتل با سفرینو یعنی انتخاب مطمئن از میان صدها هتل داخلی و خارجی طرف قرارداد. در سفرینو بهترین قیمت، کدهای تخفیف و شرایط استرداد هر هتل قبل از تسویه برای شما شفاف نمایش داده می‌شود.",
    "با مراجعه به سفرینو می‌توانید از تخفیف‌های ویژه و مزایای باشگاه مشتریان در کامل‌ترین بانک اطلاعاتی هتل‌های سراسر کشور بهره‌مند شوید و رزرو خود را با صدور آنی واچر نهایی کنید.",
  ],
  subtitle: "رزرو آنلاین هتل در سفرینو",
  subtitleParagraph:
    "با پلن‌های متنوع متناسب با هر بودجه می‌توانید با آرامش خاطر سفر کنید؛ از رزرو هتل‌های داخلی گرفته تا پیشنهادهای لحظه آخری و امکان بیمه مسافرتی هم‌زمان با رزرو.",
} as const;
