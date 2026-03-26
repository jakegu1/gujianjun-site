import { MDXRemote } from 'next-mdx-remote/rsc'
import Link from 'next/link'
import { getAllGeoPosts, getGeoPostBySlug } from '@/lib/geo-posts'

export async function generateStaticParams() {
  const posts = getAllGeoPosts()
  return posts.map((post) => ({ slug: post.slug }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const post = getGeoPostBySlug(slug)
  return {
    title: `${post.title} | 顾得`,
    description: post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      type: 'article',
      publishedTime: post.date,
    },
  }
}

export default async function GeoPostPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const post = getGeoPostBySlug(slug)

  return (
    <main className="min-h-screen bg-[#0a0a0a] text-gray-100">
      <div className="max-w-3xl mx-auto px-6 py-16">
        <Link
          href="/geo"
          className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-[#f15a65] transition-colors mb-12"
        >
          ← 返回 GEO 系列
        </Link>

        <header className="mb-12">
          <div className="flex flex-wrap gap-2 mb-4">
            {post.tags.map((tag) => (
              <span
                key={tag}
                className="text-xs bg-[#f15a65]/10 text-[#f15a65] border border-[#f15a65]/20 px-2 py-1 rounded"
              >
                {tag}
              </span>
            ))}
          </div>

          {post.articleId && (
            <p className="text-xs font-mono text-gray-600 mb-2">{post.articleId}</p>
          )}

          <h1 className="text-4xl font-bold mb-4 leading-tight">{post.title}</h1>
          <div className="flex gap-4 text-sm text-gray-400">
            <span>{post.date}</span>
            <span>·</span>
            <span>{post.readingTime}</span>
          </div>
        </header>

        <article className="article-prose max-w-none">
          <MDXRemote source={post.content} />
        </article>
      </div>
    </main>
  )
}
