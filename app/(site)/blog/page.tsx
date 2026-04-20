import Link from 'next/link'
import { getAllPosts } from '@/lib/posts'
import { getAllGeoPosts } from '@/lib/geo-posts'

export const metadata = {
  title: '文章 | 顾得',
  description: 'SEO、GEO、数字营销实战经验分享 — 顾得',
}

const FEATURED_SLUG = 'goeast-mandarin-case-study'

export default function BlogPage() {
  const regularPosts = getAllPosts().map((p) => ({ ...p, href: `/blog/${p.slug}` }))
  const geoPosts = getAllGeoPosts().map((p) => ({ ...p, href: `/geo/${p.slug}` }))
  const all = [...regularPosts, ...geoPosts].sort((a, b) => (a.date < b.date ? 1 : -1))

  const featured = all.find((p) => p.slug === FEATURED_SLUG)
  const rest = featured ? all.filter((p) => p.slug !== FEATURED_SLUG) : all

  return (
    <main className="min-h-screen bg-[#0a0a0a] text-gray-100">
      <div className="max-w-3xl mx-auto px-6 py-16">
        <div className="mb-12">
          <span className="text-xs font-mono text-[#f15a65] tracking-widest uppercase">
            Writing
          </span>
          <h1 className="text-4xl font-bold mt-2">全部文章</h1>
          <p className="text-sm text-gray-500 mt-3">
            实战案例、GEO 研究、增长手记 — 全部原创
          </p>
        </div>

        {/* ── Pinned Featured Case Study ── */}
        {featured && (
          <div className="mb-16">
            <div className="flex items-center gap-2 mb-4">
              <span className="inline-flex items-center gap-1.5 text-[10px] font-mono text-[#f15a65] tracking-widest uppercase border border-[#f15a65]/30 rounded-full px-2.5 py-1 bg-[#f15a65]/[0.08]">
                <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17 4v2a3 3 0 0 1-3 3h-1v10l-2 2-2-2V9h-1a3 3 0 0 1-3-3V4h12z" />
                </svg>
                Pinned · Case Study
              </span>
              <span className="text-[11px] text-gray-600">置顶案例</span>
            </div>

            <Link
              href={featured.href}
              className="group relative block rounded-2xl border border-[#f15a65]/20 bg-gradient-to-br from-[#f15a65]/[0.06] via-white/[0.015] to-white/[0.01] p-7 md:p-9 overflow-hidden hover:border-[#f15a65]/45 hover:from-[#f15a65]/[0.1] transition-all duration-500"
            >
              {/* corner glow */}
              <div
                className="absolute -top-20 -right-20 w-60 h-60 rounded-full pointer-events-none opacity-70 blur-3xl"
                style={{ background: 'radial-gradient(circle, rgba(241,90,101,0.25) 0%, transparent 70%)' }}
              />
              <div className="relative">
                <div className="flex flex-wrap items-center gap-2 mb-4">
                  <span className="text-[11px] font-mono text-[#f15a65]/90 tracking-widest uppercase">
                    2023 – 2026
                  </span>
                  <span className="text-[11px] text-gray-600">·</span>
                  <span className="text-[11px] text-gray-500">GoEast Mandarin</span>
                  <span className="text-[11px] text-gray-600">·</span>
                  <span className="text-[11px] text-gray-500">{featured.readingTime}</span>
                </div>

                <h2 className="text-2xl md:text-3xl font-bold text-white leading-tight mb-3 group-hover:text-[#ff8a65] transition-colors">
                  {featured.title}
                </h2>

                {featured.excerpt && (
                  <p className="text-[14px] md:text-[15px] text-gray-400 leading-relaxed mb-5 line-clamp-3">
                    {featured.excerpt}
                  </p>
                )}

                {/* key metrics row */}
                <div className="grid grid-cols-4 gap-3 md:gap-4 mb-6">
                  {[
                    { v: '3×', l: '自然点击' },
                    { v: '65', l: 'Top 10 关键词' },
                    { v: '2K+', l: 'AI 月引荐' },
                    { v: '60', l: 'GEO 文章' },
                  ].map((m) => (
                    <div
                      key={m.l}
                      className="rounded-lg border border-white/[0.06] bg-white/[0.02] p-2.5 md:p-3"
                    >
                      <div className="text-lg md:text-xl font-bold bg-gradient-to-r from-[#f15a65] to-[#ff8a65] bg-clip-text text-transparent leading-none">
                        {m.v}
                      </div>
                      <div className="text-[10px] md:text-[11px] text-gray-500 mt-1 leading-tight">
                        {m.l}
                      </div>
                    </div>
                  ))}
                </div>

                <span className="inline-flex items-center gap-2 text-[#f15a65] font-medium text-sm group-hover:gap-3 transition-all">
                  阅读完整案例
                  <span className="transition-transform group-hover:translate-x-1">→</span>
                </span>
              </div>
            </Link>
          </div>
        )}

        {/* ── All Articles ── */}
        {rest.length === 0 ? (
          <p className="text-gray-500 py-16 text-center">暂无文章，敬请期待。</p>
        ) : (
          <div>
            {featured && (
              <div className="flex items-center gap-3 mb-2">
                <span className="text-[11px] font-mono text-gray-500 tracking-widest uppercase">
                  All Articles
                </span>
                <span className="h-px flex-1 bg-gray-900" />
              </div>
            )}
            <div className="space-y-1">
              {rest.map((post) => (
                <article key={post.href}>
                  <Link
                    href={post.href}
                    className="group flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-6 py-6 border-b border-gray-900 hover:border-gray-700 transition-colors"
                  >
                    <span className="text-xs font-mono text-gray-600 sm:w-24 shrink-0">
                      {post.date}
                    </span>
                    <div className="flex-1 min-w-0">
                      <h2 className="text-gray-300 group-hover:text-white transition-colors font-medium">
                        {post.title}
                      </h2>
                      {post.excerpt && (
                        <p className="text-sm text-gray-600 mt-1 truncate">{post.excerpt}</p>
                      )}
                    </div>
                    <div className="flex gap-2 shrink-0">
                      {post.tags.slice(0, 2).map((tag) => (
                        <span
                          key={tag}
                          className="text-xs bg-[#f15a65]/10 text-[#f15a65] border border-[#f15a65]/20 px-2 py-0.5 rounded"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </Link>
                </article>
              ))}
            </div>
          </div>
        )}
      </div>
    </main>
  )
}
