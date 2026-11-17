import Link from "next/link";
import { Vazirmatn } from "next/font/google";

const vazirmatn = Vazirmatn({
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  variable: "--font-vazirmatn",
  display: "swap",
});

export const metadata = {
  title: "سفرینو - رزرو آنلاین هتل و اقامتگاه",
  description: "رزرو آنلاین هتل، ویلا و اقامتگاه با سفرینو - بهترین قیمت و تضمین)",
};

export default function Home() {
  return (
    <div
      dir="rtl"
      lang="fa"
      className={`${vazirmatn.className} min-h-full bg-[#fcfcfc] text-gray-800 text-sm antialiased`}
    >
      {/* Hero Section */}
      <section className="pt-20 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 bg-[#e21b5b]/10 text-[#e21b5b] px-4 py-1.5 rounded-full text-xs font-bold mb-6">
              <i className="fa-solid fa-paper-plane"></i>
              <span>سفرینو</span>
            </div>
            <h1 className="text-4xl sm:text-5xl font-black text-gray-900 mb-4 tracking-tight">
              رزرو آنلاین هتل و اقامتگاه
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              بهترین Portland برای سفر شما. رزرو هتل، ویلا و اقامتگاه بوم‌گردی
              با تضمین کمترین قیمت و پشتیبانی ۲۴ ساعته.
            </p>
          </div>

          {/* Navigation Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
            {/* Card 1: Hotel Booking */}
            <Link
              href="/hotel-booking"
              className="group block bg-white rounded-3xl border border-gray-200 shadow-sm hover:shadow-xl hover:border-[#e21b5b]/30 transition-all p-8 text-center"
            >
              <div className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-[#e21b5b]/10 flex items-center justify-center group-hover:bg-[#e21b5b] group-hover:text-white transition-colors">
                <i className="fa-solid fa-hotel text-2xl text-[#e21b5b] group-hover:text-white"></i>
              </div>
              <h3 className="text-xl font-black text-gray-900 mb-2 group-hover:text-[#e21b5b] transition-colors">
                رزرو هتل
              </h3>
              <p className="text-gray-600 mb-6 text-sm leading-relaxed">
                رزرو آنلاین هتل‌های ایران و جهان با بهترین قیمت و شرایط لچکدار.
              </p>
              <div className="flex items-center justify-center gap-2 text-xs font-bold text-[#e21b5b]">
                <span>شروع رزرو</span>
                <i className="fa-solid fa-chevron-right"></i>
              </div>
            </Link>

            {/* Card 2: Accommodation & Villa Booking */}
            <Link
              href="/accommodation-booking"
              className="group block bg-white rounded-3xl border border-gray-200 shadow-sm hover:shadow-xl hover:border-[#0070cd]/30 transition-all p-8 text-center"
            >
              <div className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-[#0070cd]/10 flex items-center justify-center group-hover:bg-[#0070cd] group-hover:text-white transition-colors">
                <i className="fa-solid fa-house-chimney text-2xl text-[#0070cd] group-hover:text-white"></i>
              </div>
              <h3 className="text-xl font-black text-gray-900 mb-2 group-hover:text-[#0070cd] transition-colors">
                ویلا و اقامتگاه
              </h3>
              <p className="text-gray-600 mb-6 text-sm leading-relaxed">
                رزرو ویلا، سوئیت و اقامتگاه بوم‌گردی در سراسر ایران با تخفیف‌های
                ویژه و راحت‌ترین فرآیند.
              </p>
              <div className="flex items-center justify-center gap-2 text-xs font-bold text-[#0070cd]">
                <span>مشاهده اقامتگاه‌ها</span>
                <i className="fa-solid fa-chevron-right"></i>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* Quick Features Row */}
      <section className="bg-white border-t border-gray-200 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div className="flex flex-col items-center gap-2">
              <div className="w-10 h-10 rounded-xl bg-[#e21b5b]/10 flex items-center justify-center text-[#e21b5b]">
                <i className="fa-solid fa-tags"></i>
              </div>
              <span className="text-sm font-bold text-gray-900">تضمین بهترین قیمت</span>
            </div>
            <div className="flex flex-col items-center gap-2">
              <div className="w-10 h-10 rounded-xl bg-[#0070cd]/10 flex items-center justify-center text-[#0070cd]">
                <i className="fa-solid fa-shield-halved"></i>
              </div>
              <span className="text-sm font-bold text-gray-900">خرید مطمئن و امن</span>
            </div>
            <div className="flex flex-col items-center gap-2">
              <div className="w-10 h-10 rounded-xl bg-[#e21b5b]/10 flex items-center justify-center text-[#e21b5b]">
                <i className="fa-solid fa-bolt"></i>
              </div>
              <span className="text-sm font-bold text-gray-900">صدور آنی واچر</span>
            </div>
            <div className="flex flex-col items-center gap-2">
              <div className="w-10 h-10 rounded-xl bg-[#0070cd]/10 flex items-center justify-center text-[#0070cd]">
                <i className="fa-solid fa-headset"></i>
              </div>
              <span className="text-sm font-bold text-gray-900">پشتیبانی ۲۴ ساعته</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
