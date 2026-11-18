import type { Hotel } from "@/types/hotel";

/**
 * Central hotel dataset.
 *
 * IMPORTANT: this is fictional mock data for frontend development.
 * Prices, ratings and review counts are invented for UI purposes and must
 * be replaced by backend data. Every record has a stable unique `id`;
 * favorites, campaigns and search reference these ids.
 */
export const HOTELS: Hotel[] = [
  // ── تهران ───────────────────────────────────────────────
  {
    id: "hotel-tehran-01",
    name: "هتل اسپیناس پالاس",
    city: "tehran",
    cityLabel: "تهران",
    location: "تهران، سعادت‌آباد",
    rating: 4.8,
    reviewCount: 1284,
    pricePerNight: 4_800_000,
    description:
      "هتلی پنج ستاره با معماری مدرن، استخر سرپوشیده، رستوران ایرانی و بین‌المللی و دسترسی آسان به مراکز تجاری سعادت‌آباد.",
    image:
      "/assets/hotel-tehran-01.jpg",
    maxGuests: 6,
    amenities: ["وای‌فای رایگان", "استخر", "پارکینگ", "رستوران", "ترانسفر فرودگاهی"],
  },
  {
    id: "hotel-tehran-02",
    name: "هتل دیپلماتیک تهران",
    city: "tehran",
    cityLabel: "تهران",
    location: "تهران، ولیعصر",
    rating: 4.2,
    reviewCount: 640,
    pricePerNight: 3_200_000,
    description:
      "هتلی چهار ستاره در قلب ولیعصر، مناسب برای سفرهای کاری با اتاق‌های مجهز، سالن کنفرانس و رستوران صبحانه.",
    image: "/hotels/tehran-diplomatic.svg",
    maxGuests: 4,
    amenities: ["وای‌فای رایگان", "سالن کنفرانس", "رستوران", "پارکینگ"],
  },
  // ── مازندران ────────────────────────────────────────────
  {
    id: "hotel-mazandaran-01",
    name: "هتل آرامش نوشهر",
    city: "mazandaran",
    cityLabel: "مازندران",
    location: "مازندران، نوشهر، ساحلی",
    rating: 4.3,
    reviewCount: 512,
    pricePerNight: 2_900_000,
    description:
      "اقامتی آرام در ساحل نوشهر با چشم‌انداز دریای خزر، صبحانه محلی و دسترسی مستقیم به ساحل اختصاصی.",
    image:
      "/assets/hotel-mazandaran-01.jpg",
    maxGuests: 5,
    amenities: ["وای‌فای رایگان", "دسترسی ساحلی", "رستوران", "پارکینگ"],
  },
  {
    id: "hotel-mazandaran-02",
    name: "هتل جنگلی کلاردشت",
    city: "mazandaran",
    cityLabel: "مازندران",
    location: "مازندران، کلاردشت، جنگل‌های ارس",
    rating: 4.6,
    reviewCount: 389,
    pricePerNight: 3_400_000,
    description:
      "اقامتگاهی جنگلی در دل کلاردشت با کلبه‌های چوبی مدرن، طبیعت‌گردی راهنمای محلی و صبحانه روستایی.",
    image: "/hotels/kolardasht-forest.svg",
    maxGuests: 6,
    amenities: ["صبحانه محلی", "راهنمای طبیعت‌گردی", "پارکینگ", "منطقه امن"],
  },
  // ── شیراز ───────────────────────────────────────────────
  {
    id: "hotel-shiraz-01",
    name: "هتل باغ‌ایران شیراز",
    city: "shiraz",
    cityLabel: "شیراز",
    location: "شیراز، بلوار کریم‌خان",
    rating: 4.5,
    reviewCount: 903,
    pricePerNight: 3_600_000,
    description:
      "هتلی با فضای باغ ایرانی، حوض و تخت‌خواب‌های سنتی، نزدیک بازار وکیل و آرامگاه حافظ با معماری قاجاری بازطراحی‌شده.",
    image:
      "/assets/hotel-shiraz-01.jpg",
    maxGuests: 5,
    amenities: ["وای‌فای رایگان", "رستوران", "باغ ایرانی", "پارکینگ"],
  },
  {
    id: "hotel-shiraz-02",
    name: "هتل تخت‌جمشید شیراز",
    city: "shiraz",
    cityLabel: "شیراز",
    location: "شیراز، بلوار تخت‌جمشید",
    rating: 4.0,
    reviewCount: 471,
    pricePerNight: 2_700_000,
    description:
      "هتلی چهار ستاره اقتصادی در مسیر تخت‌جمشید و نقش رستم، مناسب خانواده‌ها با اتاق‌های خانوادگی و صبحانه ایرانی.",
    image: "/hotels/shiraz-baghiran.svg",
    maxGuests: 4,
    amenities: ["وای‌فای رایگان", "صبحانه", "پارکینگ", "اتاق خانوادگی"],
  },
  // ── مشهد ────────────────────────────────────────────────
  {
    id: "hotel-mashhad-01",
    name: "هتل رضوی مشهد",
    city: "mashhad",
    cityLabel: "مشهد",
    location: "مشهد، خیابان امام رضا",
    rating: 4.6,
    reviewCount: 1530,
    pricePerNight: 2_400_000,
    description:
      "اقامتی مطمئن نزدیک حرم امام رضا با ترانسفر رایگان حرم، رستوران ایرانی و اتاق‌های مناسب زائران.",
    image:
      "/assets/hotel-mashhad-01.jpg",
    maxGuests: 6,
    amenities: ["ترانسفر حرم", "وای‌فای رایگان", "رستوران", "صبحانه"],
  },
  {
    id: "hotel-mashhad-02",
    name: "هتل حرم‌طلایی مشهد",
    city: "mashhad",
    cityLabel: "مشهد",
    location: "مشهد، خسروی",
    rating: 4.1,
    reviewCount: 720,
    pricePerNight: 1_800_000,
    description:
      "هتل اقتصادی در فاصله پیاده از حرم با اتاق‌های تمیز، سرویس اتاق و بهترین گزینه برای سفر زیارتی با بودجه محدود.",
    image:
      "/assets/hotel-mashhad-02.jpg",
    maxGuests: 4,
    amenities: ["نزدیک حرم", "وای‌فای رایگان", "سرویس اتاق"],
  },
  // ── یزد ─────────────────────────────────────────────────
  {
    id: "hotel-yazd-01",
    name: "هتل باغ دولت‌آباد یزد",
    city: "yazd",
    cityLabel: "یزد",
    location: "یزد، میدان دولت‌آباد",
    rating: 4.4,
    reviewCount: 588,
    pricePerNight: 2_200_000,
    description:
      "اقامت در مجاورت باغ دولت‌آباد و بافت تاریخی یزد؛ اتاق‌های سقف‌دار سنتی با بادگیر و سرویس چای یزدی.",
    image:
      "/assets/hotel-yazd-01.jpg",
    maxGuests: 4,
    amenities: ["وای‌فای رایگان", "معماری سنتی", "صبحانه", "پارکینگ"],
  },
  {
    id: "hotel-yazd-02",
    name: "هتل بادگیر یزد",
    city: "yazd",
    cityLabel: "یزد",
    location: "یزد، فهادان",
    rating: 4.0,
    reviewCount: 342,
    pricePerNight: 1_500_000,
    description:
      "خانه تاریخی بازسازی‌شده با اتاق‌های سنتی در دل بافت قدیم یزد، نزدیک مجموعه امیرچخماغ؛ تجربه‌ای اصیل با امکانات مدرن.",
    image: "/hotels/yazd-badgir.svg",
    maxGuests: 3,
    amenities: ["معماری سنتی", "صبحانه", "وای‌فای رایگان"],
  },
  // ── کیش ─────────────────────────────────────────────────
  {
    id: "hotel-kish-01",
    name: "هتل مرجان کیش",
    city: "kish",
    cityLabel: "کیش",
    location: "جزیره کیش، بلوار مرجان",
    rating: 4.7,
    reviewCount: 1102,
    pricePerNight: 5_500_000,
    description:
      "ریزورت پنج ستاره با استخر روباز، آکواپارک، چند رستوران و اتاق‌های رو به دریا؛ انتخاب اول سفر تفریحی کیش.",
    image:
      "/assets/hotel-kish-01.jpg",
    maxGuests: 6,
    amenities: ["استخر روباز", "آکواپارک", "رستوران", "ترانسفر فرودگاهی", "وای‌فای رایگان"],
  },
  {
    id: "hotel-kish-02",
    name: "هتل آفتاب کیش",
    city: "kish",
    cityLabel: "کیش",
    location: "جزیره کیش، میدان ساحل",
    rating: 4.3,
    reviewCount: 654,
    pricePerNight: 4_200_000,
    description:
      "هتلی چهار ستاره مشرف به ساحل با استخر، جکوزی و دسترسی پیاده به اسکله تفریحی؛ مناسب خانواده‌ها و سفرهای زمستانی.",
    image: "/hotels/kish-aftab.svg",
    maxGuests: 5,
    amenities: ["استخر", "جکوزی", "نزدیک ساحل", "رستوران", "پارکینگ"],
  },
  // ── قشم ─────────────────────────────────────────────────
  {
    id: "hotel-qeshm-01",
    name: "هتل ستاره قشم",
    city: "qeshm",
    cityLabel: "قشم",
    location: "جزیره قشم، بلوار دریا",
    rating: 4.2,
    reviewCount: 470,
    pricePerNight: 2_600_000,
    description:
      "هتلی چهار ستاره در نزدیکی ساحل و بازار سنتی قشم با اتاق‌های مدرن و تورهای ژئوپارک قشم.",
    image: "/hotels/qeshm-sitare.svg",
    maxGuests: 5,
    amenities: ["وای‌فای رایگان", "تور ژئوپارک", "رستوران", "پارکینگ"],
  },
  {
    id: "hotel-qeshm-02",
    name: "هتل خلیج‌فارس قشم",
    city: "qeshm",
    cityLabel: "قشم",
    location: "جزیره قشم، شهر قشم",
    rating: 3.9,
    reviewCount: 268,
    pricePerNight: 1_900_000,
    description:
      "اقامتگاهی اقتصادی و تمیز در مرکز شهر قشم، انتخاب مناسب برای سفرهای طبیعت‌گردی و بازدید از تنگه چاهکوه.",
    image: "/hotels/qeshm-khalij.svg",
    maxGuests: 4,
    amenities: ["وای‌فای رایگان", "صبحانه", "نزدیک بازار"],
  },
  // ── همدان ───────────────────────────────────────────────
  {
    id: "hotel-hamedan-01",
    name: "هتل باباطاهر همدان",
    city: "hamedan",
    cityLabel: "همدان",
    location: "همدان، میدان آرامگاه باباطاهر",
    rating: 4.4,
    reviewCount: 540,
    pricePerNight: 2_000_000,
    description:
      "هتلی آرام در مجاورت آرامگاه باباطاهر و بو علی‌سینا با اتاق‌های استاندارد و صبحانه همدانی.",
    image:
      "/assets/hotel-hamedan-01.jpg",
    maxGuests: 4,
    amenities: ["وای‌فای رایگان", "صبحانه", "پارکینگ", "رستوران"],
  },
  {
    id: "hotel-hamedan-02",
    name: "هتل گنبد علویان همدان",
    city: "hamedan",
    cityLabel: "همدان",
    location: "همدان، خیابان بوعلی",
    rating: 4.0,
    reviewCount: 295,
    pricePerNight: 1_600_000,
    description:
      "هتلی اقتصادی نزدیک گنبد علویان و بازار همدان، مناسب سفرهای کاری و زیارتی با قیمت عادلانه.",
    image: "/hotels/hamedan-alavian.svg",
    maxGuests: 4,
    amenities: ["وای‌فای رایگان", "صبحانه", "نزدیک بازار"],
  },
];
