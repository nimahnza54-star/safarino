import { AppDownloadSection } from "./AppDownloadSection";
import { SEO_ARTICLE } from "@/mock/content/site-content.mock";

/** «رزرو هتل در سفرینو» SEO article + app download box. */
export function SeoArticle() {
  return (
    <section className="py-12 bg-white" aria-labelledby="seo-article-title">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-right space-y-6 text-gray-700 leading-relaxed text-xs sm:text-sm">
          <h3
            id="seo-article-title"
            className="text-xl font-black text-gray-900 border-r-4 border-[#e21b5b] pr-3"
          >
            {SEO_ARTICLE.title}
          </h3>
          {SEO_ARTICLE.paragraphs.map((paragraph) => (
            <p key={paragraph.slice(0, 32)} className="text-gray-500">
              {paragraph}
            </p>
          ))}
          <h4 className="text-base font-bold text-gray-800">{SEO_ARTICLE.subtitle}</h4>
          <p className="text-gray-500">{SEO_ARTICLE.subtitleParagraph}</p>
        </div>

        <AppDownloadSection />
      </div>
    </section>
  );
}
