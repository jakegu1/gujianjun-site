import Link from 'next/link'
import { getAllPosts } from '@/lib/posts'
import { getAllGeoPosts } from '@/lib/geo-posts'

export const metadata = {
  title: '文章 | 顾得',
  description: 'SEO、GEO、数字营销实战经验分享 — 顾得',
}

export default function BlogPage() {
  const regularPosts = getAllPosts().map((p) => ({ ...p, href: `/blog/${p.slug}` }))
  const geoPosts = getAllGeoPosts().map((p) => ({ ...p, href: `/geo/${p.slug}` }))
  const posts = [...regularPosts, ...geoPosts].sort((a, b) => (a.date < b.date ? 1 : -1))

  return (
    <main className="min-h-screen bg-[#0a0a0a] text-gray-100">
      <div className="max-w-3xl mx-auto px-6 py-16">
        <div className="mb-12">
          <span className="text-xs font-mono text-[#f15a65] tracking-widest uppercase">
            Writing
          </span>
          <h1 className="text-4xl font-bold mt-2">全部文章</h1>
        </div>

        {posts.length === 0 ? (
          <p className="text-gray-500 py-16 text-center">暂无文章，敬请期待。</p>
        ) : (
          <div className="space-y-1">
            {posts.map((post) => (
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
        )}
      </div>
    </main>
  )
}
