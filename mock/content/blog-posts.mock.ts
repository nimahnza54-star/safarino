/** Travel magazine («مجله گردشگری») articles for the blog section. */
export interface BlogPost {
  id: string;
  image: string;
  imageAlt: string;
  tag: string;
  title: string;
  excerpt: string;
  author: string;
  date: string;
}

export const BLOG_POSTS: BlogPost[] = [
  {
    id: "blog-1",
    image:
      "/assets/blog-mashhad.jpg",
    imageAlt: "سفر به مشهد",
    tag: "گردشگری",
    title: "سفر به مشهد",
    excerpt:
      "راهنمای کامل سفر به مشهد: بهترین زمان بازدید، هتل‌های نزدیک حرم و نکات مهم برای یک اقامت آرام و به‌صرفه.",
    author: "تیم تحریریه سفرینو",
    date: "۱۴۰۵/۰۸/۱۲",
  },
  {
    id: "blog-2",
    image:
      "/assets/blog-yazd.jpg",
    imageAlt: "جاذبه‌های تاریخی ایران",
    tag: "میراث",
    title: "گشت‌وگذار در بافت تاریخی یزد",
    excerpt:
      "از باغ دولت‌آباد تا بادگیرهای فهادان؛ راهنمای قدم‌به‌قدم گشت‌وگذار در شهر بادگیرها همراه با پیشنهاد هتل‌های سنتی.",
    author: "تیم تحریریه سفرینو",
    date: "۱۴۰۵/۰۷/۲۸",
  },
  {
    id: "blog-3",
    image:
      "/assets/blog-kish.jpg",
    imageAlt: "جزیره کیش",
    tag: "تفریح",
    title: "کیش در پاییز؛ بهترین پیشنهادهای اقامت",
    excerpt:
      "بهترین زمان سفر به کیش، ریزورت‌های ساحلی مناسب خانواده و تفریحات آبی پیشنهادی برای یک پاییز متفاوت.",
    author: "تیم تحریریه سفرینو",
    date: "۱۴۰۵/۰۷/۱۵",
  },
  {
    id: "blog-4",
    image:
      "/assets/blog-mazandaran.jpg",
    imageAlt: "جنگل‌های مازندران",
    tag: "طبیعت",
    title: "کلاردشت، مقصدی برای فرار از شهر",
    excerpt:
      "راهنمای اقامت در جنگل‌های کلاردشت؛ از هتل‌های جنگلی تا اقامتگاه‌های بوم‌گردی و نکات مسیر تهران–کلاردشت.",
    author: "تیم تحریریه سفرینو",
    date: "۱۴۰۵/۰۶/۳۰",
  },
];
