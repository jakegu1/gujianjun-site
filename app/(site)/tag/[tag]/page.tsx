import Link from 'next/link'
import { getAllPosts } from '@/lib/posts'
import { getAllGeoPosts } from '@/lib/geo-posts'

export async function generateStaticParams() {
  const regularPosts = getAllPosts()
  const geoPosts = getAllGeoPosts()
  const allTags = new Set<string>()
  for (const p of regularPosts) p.tags.forEach((t) => allTags.add(t))
  for (const p of geoPosts) p.tags.forEach((t) => allTags.add(t))
  return Array.from(allTags).map((tag) => ({ tag }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ tag: string }>
}) {
  const { tag } = await params
  return {
    title: `标签: ${tag} | Jake Gu`,
    description: `所有标记为「${tag}」的文章`,
  }
}

export default async function TagPage({
  params,
}: {
  params: Promise<{ tag: string }>
}) {
  const { tag } = await params

  const regularPosts = getAllPosts()
    .filter((p) => p.tags.includes(tag))
    .map((p) => ({ ...p, href: `/blog/${p.slug}`, source: 'blog' as const }))

  const geoPosts = getAllGeoPosts()
    .filter((p) => p.tags.includes(tag))
    .map((p) => ({ ...p, href: `/geo/${p.slug}`, source: 'geo' as const }))

  const posts = [...regularPosts, ...geoPosts].sort((a, b) =>
    a.date < b.date ? 1 : -1
  )

  return (
    <main className="min-h-screen bg-[#0a0a0a] text-gray-100">
      <div className="max-w-3xl mx-auto px-6 py-16">
        <Link
          href="/blog"
          className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-[#f15a65] transition-colors mb-12"
        >
          ← 返回文章列表
        </Link>

        <div className="mb-12">
          <span className="text-xs font-mono text-[#f15a65] tracking-widest uppercase">
            Tag
          </span>
          <h1 className="text-4xl font-bold mt-2">{tag}</h1>
          <p className="text-gray-500 mt-2">
            {posts.length} 篇文章
          </p>
        </div>

        {posts.length === 0 ? (
          <p className="text-gray-500 py-16 text-center">
            该标签下暂无文章。
          </p>
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
                      <p className="text-sm text-gray-600 mt-1 truncate">
                        {post.excerpt}
                      </p>
                    )}
                  </div>
                  <div className="flex gap-2 shrink-0">
                    {post.source === 'geo' && (
                      <span className="text-xs bg-[#f15a65]/10 text-[#f15a65] border border-[#f15a65]/20 px-2 py-0.5 rounded">
                        GEO
                      </span>
                    )}
                    <span className="text-xs text-gray-600">
                      {post.readingTime}
                    </span>
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
