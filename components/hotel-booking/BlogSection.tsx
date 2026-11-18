import Image from "@/components/AppImage";
import { BLOG_POSTS } from "@/mock/content/blog-posts.mock";

/** «مجله گردشگری سفرینو» — travel blog articles. */
export function BlogSection() {
  return (
    <section id="blog" className="py-12 bg-white" aria-labelledby="blog-title">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h3 id="blog-title" className="text-2xl font-black text-[#e21b5b] mb-2">
            سفر در مجله گردشگری سفرینو
          </h3>
          <p className="text-xs text-gray-500">
            راهنمای کامل مسافرت، بهترین مقاصد و نکات مهم سفر و اقامتگاه
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {BLOG_POSTS.map((post) => (
            <article
              key={post.id}
              className="bg-white rounded-2xl overflow-hidden border border-gray-200 shadow-sm hover:shadow-md transition"
            >
              <div className="relative h-44 overflow-hidden">
                <Image
                  src={post.image}
                  alt={post.imageAlt}
                  className="w-full h-full object-cover"
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                />
              </div>
              <div className="p-4">
                <span className="text-[10px] text-[#e21b5b] font-bold bg-[#e21b5b]/10 px-2 py-0.5 rounded-full">
                  {post.tag}
                </span>
                <h4 className="font-bold text-sm text-gray-900 mt-2 mb-2 line-clamp-1">
                  {post.title}
                </h4>
                <p className="text-xs text-gray-500 line-clamp-2 leading-relaxed mb-4">
                  {post.excerpt}
                </p>
                <div className="flex items-center justify-between pt-3 border-t border-gray-100 text-[11px] text-gray-400">
                  <span className="flex items-center gap-1">
                    <i className="fa-regular fa-user" aria-hidden="true" /> {post.author}
                  </span>
                  <span>{post.date}</span>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
