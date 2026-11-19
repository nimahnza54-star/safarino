import type { AccommodationCityCategoryId, AccommodationTypeCategoryId } from "@/mock/accommodations/accommodation-categories.mock";

/**
 * Content specific to the accommodation page:
 * value-proposition cards, type pillars, destination chips, SEO article
 * and the accommodation FAQ. Shared platform-wide copy stays in
 * site-content.mock.ts / travel-card.mock.ts.
 */

export interface AccommodationValueProp {
  id: string;
  image: string;
  imageAlt: string;
  title: string;
  description: string;
  detailLead: string;
  bullets: string[];
  footnote: string;
}

export const ACCOMMODATION_VALUE_PROPS: AccommodationValueProp[] = [
  {
    id: "accom-automation",
    image: "/assets/feature-automation.jpg",
    imageAlt: "اتوماسیون تخصصی سفرینو",
    title: "اتوماسیون تخصصی سفرینو",
    description:
      "اولین ارائه‌دهنده اتوماسیون هوشمند مدیریت پذیرش و رزرو هتل و اقامتگاه‌های سنتی در کشور با اتصال مستقیم به سامانه‌های هتلداری.",
    detailLead:
      "سفرینو تنها پلتفرم رزرو اقامت در ایران است که اتوماسیون مدیریت پذیرش را مستقیماً به سامانه‌های هتلداری و اقامتگاه‌های سنتی متصل می‌کند.",
    bullets: [
      "ثبت و مدیریت خودکار پذیرش در اقامتگاه و ویلا",
      "همگام‌سازی ظرفیت واحدها با تقویم میزبان",
      "گزارش وضعیت رزروها به‌صورت لحظه‌ای",
      "کاهش خطای انسانی در ثبت دستی رزرو",
      "پشتیبانی فنی برای میزبانان طرف قرارداد",
    ],
    footnote: "اتصال اتوماسیون نیازمند عقد قرارداد با سفرینو و تأیید فنی اقامتگاه است.",
  },
  {
    id: "accom-rewards",
    image: "/assets/feature-rewards.jpg",
    imageAlt: "جوایز انحصاری",
    title: "جوایز انحصاری",
    description:
      "تسهیلات ویژه به کاربرانی تعلق می‌گیرد که بیشترین رزرو اقامتگاه را در طول سال با پلتفرم سفرینو ثبت و به اتمام رسانده باشند.",
    detailLead:
      "باشگاه مشتریان سفرینو به پرمصرف‌ترین مسافران اقامتی جایزه می‌دهد؛ امتیاز شما با هر اقامت تأییدشده جمع می‌شود.",
    bullets: [
      "کسب امتیاز خودکار پس از هر اقامت تأییدشده",
      "جایزه سالانه برای بیشترین شب اقامت",
      "تخفیف‌های اختصاصی باشگاه برای اعضا",
      "اولویت در رزرو اقامتگاه‌های پرتقاضا",
      "باشگاه سطح‌بندی‌شده با مزایای هر سطح",
    ],
    footnote: "جوایز بر اساس اقامت‌های تأییدشده در یک سال تقویمی محاسبه می‌شود.",
  },
  {
    id: "accom-hosting",
    image: "/assets/feature-hosting.jpg",
    imageAlt: "یک میزبانی ویژه",
    title: "یک میزبانی ویژه",
    description:
      "شرایط ویژه مدیریت میزبان در پلتفرم اختصاصی سفرینو به میزبانان قدرت تصمیم‌گیری، تقویم باز و مدیریت خودکار قیمت‌ها را فراهم می‌آورد.",
    detailLead:
      "میزبانان سفرینو با پنل اختصاصی، قیمت‌گذاری پویا و تقویم باز، کنترل کامل اقامتگاه خود را در دست دارند.",
    bullets: [
      "ثبت آگهی و مدیریت تصاویر و امکانات واحد",
      "تقویم قیمت‌گذاری خودکار برای روزهای پیک و عادی",
      "مدیریت رزروها و پیام مستقیم با مسافر",
      "گزارش مالی ماهانه و پرداخت تسویه",
      "پشتیبانی اختصاصی تیم میزبان سفرینو",
    ],
    footnote:
      "«میزبان شوید» را در بالای سایت بزنید یا با مرکز پشتیبانی ۰۲۱-۸۸۸۸۰۰۰۰ تماس بگیرید؛ ثبت و انتشار اقامتگاه پس از بازدید و تأیید انجام می‌شود.",
  },
  {
    id: "accom-platform",
    image: "/assets/feature-platform.jpg",
    imageAlt: "تخصصی‌ترین پلتفرم سفر در جهان",
    title: "تخصصی‌ترین پلتفرم سفر در جهان",
    description:
      "پلتفرم جامع گردشگری با قابلیت پرداخت به انواع کارت‌ها و پشتیبانی ۲۴ ساعته در هفت روز هفته با سرعت و امنیت بسیار بالا.",
    detailLead:
      "سفرینو زیرساخت یکپارچه جستجو، مقایسه و رزرو اقامت را برای هتل و اقامتگاه فراهم کرده است؛ از درگاه امن بانکی تا پشتیبانی فارسی شبانه‌روزی.",
    bullets: [
      "جستجو و مقایسه هم‌زمان هتل و اقامتگاه",
      "پرداخت آنلاین روی درگاه‌های امن بانکی",
      "پشتیبانی فارسی ۲۴/۷ قبل، حین و بعد از سفر",
      "واچر الکترونیکی فوری پس از تأیید رزرو",
      "استرداد وجه مطابق سیاست هر اقامتگاه",
    ],
    footnote: "قیمت‌ها نمایشی هستند و پس از اتصال سامانه واقعی از سوی میزبان اعلام می‌شود.",
  },
];

export interface AccommodationPillar {
  id: AccommodationTypeCategoryId;
  label: string;
  image: string;
  imageAlt: string;
}

/** Type pillars under the hero search — clicking filters the explorer by type. */
export const ACCOMMODATION_PILLARS: AccommodationPillar[] = [
  {
    id: "villa",
    label: "ویلا",
    image: "/accommodations/mazandaran-04.svg",
    imageAlt: "ویلا",
  },
  {
    id: "kolbeh",
    label: "کلبه",
    image: "/accommodations/gilan-01.svg",
    imageAlt: "کلبه",
  },
  {
    id: "rustic",
    label: "خانه روستایی",
    image: "/accommodations/gilan-03.svg",
    imageAlt: "خانه روستایی",
  },
  {
    id: "boomgardi",
    label: "بوم‌گردی",
    image: "/accommodations/yazd-01.svg",
    imageAlt: "اقامتگاه بوم‌گردی",
  },
  {
    id: "apartment",
    label: "آپارتمان",
    image: "/accommodations/kish-02.svg",
    imageAlt: "آپارتمان",
  },
  {
    id: "suite",
    label: "سوئیت",
    image: "/accommodations/mazandaran-02.svg",
    imageAlt: "سوئیت",
  },
];

export interface AccommodationDestinationChip {
  id: AccommodationCityCategoryId;
  label: string;
  icon: string;
  iconColor: string;
}

/** Destination quick chips — clicking filters the explorer by destination. */
export const ACCOMMODATION_DESTINATION_CHIPS: AccommodationDestinationChip[] = [
  { id: "mazandaran", label: "اقامتگاه‌های مازندران", icon: "fa-tree", iconColor: "text-emerald-600" },
  { id: "tehran", label: "اقامتگاه‌های تهران", icon: "fa-city", iconColor: "text-blue-600" },
  { id: "gilan", label: "اقامتگاه‌های گیلان", icon: "fa-seedling", iconColor: "text-teal-600" },
  { id: "alborz", label: "اقامتگاه‌های البرز", icon: "fa-mountain", iconColor: "text-amber-600" },
  { id: "yazd", label: "بوم‌گردی‌های یزد", icon: "fa-sun", iconColor: "text-yellow-600" },
  { id: "isfahan", label: "اقامتگاه‌های اصفهان", icon: "fa-landmark", iconColor: "text-orange-600" },
  { id: "shiraz", label: "ویلاهای شیراز", icon: "fa-monument", iconColor: "text-rose-600" },
  { id: "kish", label: "ویلاهای کیش", icon: "fa-umbrella-beach", iconColor: "text-cyan-600" },
];

export const ACCOMMODATION_SEO_ARTICLE = {
  title: "رزرو ویلا، سوئیت و اقامتگاه بوم‌گردی در سفرینو",
  subtitle: "رزرو آسان آنلاین اقامتگاه در سراسر ایران",
  subtitleParagraph:
    "با ظهور اینترنت، رزرو اقامتگاه بدون نیاز به تماس‌های مکرر یا سردرگمی در مقصد بسیار ساده است. شما می‌توانید در ۲۴ ساعت شبانه‌روز و ۷ روز هفته تنها با چند کلیک اقامتگاه مورد نظر خود را با شفافیت کامل در هزینه نهایی ثبت کنید. تیم پشتیبانی سفرینو از لحظه جستجو تا پایان سفر همراه شما خواهد بود.",
  paragraphs: [
    "سامانه سفرینو به عنوان یکی از پیشگامان صنعت گردشگری الکترونیک در کشور، بستری هوشمند و مطمئن را برای رزرو انواع هتل‌ها، اقامتگاه‌های بوم‌گردی، ویلاهای استخردار لوکس، کلبه‌های جنگلی و سوئیت‌های مبله فراهم ساخته است. با سفرینو شما می‌توانید قبل از اقدام به سفر تمامی امکانات، نظرات مسافران، تصاویر واحدها و تخفیف‌های ویژه را مقایسه کنید و اقامتگاه ایده‌آل خود را با شفافیت کامل قیمت نهایی نمایید.",
    "از کلبه‌های جنگلی گیلان و مازندران تا باغ‌عمارت‌های شیراز و اقامتگاه‌های بوم‌گردی یزد، همه اقامتگاه‌های طرف قرارداد سفرینو با امتیاز، ظرفیت و قوانین مشخص نمایش داده می‌شوند؛ کافی است مقصد و تاریخ را انتخاب کنید تا فهرست اقامتگاه‌های منطبق را ببینید.",
  ],
} as const;

export interface AccommodationFaq {
  id: string;
  question: string;
  answer: string;
}

export const ACCOMMODATION_FAQS: AccommodationFaq[] = [
  {
    id: "accom-faq-1",
    question: "پیش از رزرو اقامتگاه، چطور درباره آن و فرآیند رزرو اطلاعات کسب کنم؟",
    answer:
      "فرآیند انتخاب و رزرو اقامتگاه در سفرینو ساده است: با انتخاب مقصد، تاریخ ورود و خروج و تعداد مسافران در نوار جستجو، فهرست اقامتگاه‌های منطبق را می‌بینید. روی هر کارت «جزئیات» بزنید تا امکانات، قوانین، شرایط استرداد و تصویر واحد را ببینید. در هر مرحله، مرکز پشتیبانی ۲۴/۷ سفرینو پاسخگوی شماست.",
  },
  {
    id: "accom-faq-2",
    question: "شرایط کنسلی رزرو اقامتگاه و ویلا در سفرینو چگونه است؟",
    answer:
      "شرایط کنسلی به سیاست همان اقامتگاه بستگی دارد و پیش از ثبت درخواست و در صفحه جزئیات هر اقامتگاه نمایش داده می‌شود. به طور معمول تا مهلت اعلام‌شده (مثلاً ۴۸ یا ۷۲ ساعت قبل از ورود) استرداد کامل انجام می‌شود؛ پس از آن ممکن است جریمه‌ای مطابق سیاست میزبان کسر شود. بازگشت وجه از همان درگاه پرداخت و بسته به بانک، معمولاً ظرف ۱ تا ۷۲ ساعت کاری انجام می‌شود.",
  },
  {
    id: "accom-faq-3",
    question: "آیا رزرو آنلاین در سفرینو با تضمین کمترین قیمت انجام می‌شود؟",
    answer:
      "قیمت‌های نمایش‌داده‌شده در سفرینو شفاف و رقابتی هستند و هزینه‌ها پیش از ثبت درخواست مشخص است. تضمین کمترین قیمت فقط برای کمپین‌های اعلام‌شده اعمال می‌شود؛ اگر پس از رزرو متوجه مغایرت با قیمت اعلام‌شده میزبان شدید، با پشتیبانی تماس بگیرید تا موضوع بررسی شود.",
  },
  {
    id: "accom-faq-4",
    question: "چگونه می‌توانم به عنوان میزبان اقامتگاه خود را در سفرینو ثبت کنم؟",
    answer:
      "از بخش «میزبان شوید» در بالای سایت استفاده کنید یا با مرکز پشتیبانی سفرینو به شماره ۰۲۱-۸۸۸۸۰۰۰۰ تماس بگیرید. پس از ثبت اطلاعات اولیه (موقعیت، ظرفیت، امکانات و قوانین)، تیم میزبان سفرینو برای هماهنگی بازدید و تأیید اقامتگاه با شما تماس می‌گیرد. انتشار نهایی اقامتگاه پس از تأیید انجام می‌شود.",
  },
];
