import { MDXRemote } from 'next-mdx-remote/rsc'
import Link from 'next/link'
import remarkGfm from 'remark-gfm'
import { getAllGeoPosts, getGeoPostBySlug } from '@/lib/geo-posts'

function extractJsonLd(content: string) {
  const match = content.match(/```json\n(\{[\s\S]*?\})\n```/)
  if (!match) return { cleanContent: content, jsonLd: null }
  return {
    cleanContent: content.replace(match[0], ''),
    jsonLd: match[1],
  }
}

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
    title: `${post.title} | GEO Guide — Jake Gu`,
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
  const { cleanContent, jsonLd } = extractJsonLd(post.content)

  return (
    <main className="min-h-screen bg-[#0a0a0a] text-gray-100">
      <div className="max-w-3xl mx-auto px-6 py-16">
        {/* Back link */}
        <Link
          href="/geo"
          className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-[#f15a65] transition-colors mb-12"
        >
          ← GEO Tutorial Series
        </Link>

        <header className="mb-12">
          {/* Pillar + Article ID */}
          <div className="flex items-center gap-3 mb-4">
            {post.pillar && (
              <span className="text-xs font-mono text-[#f15a65] tracking-widest uppercase">
                {post.pillar}
              </span>
            )}
            {post.articleId && (
              <span className="text-xs font-mono text-gray-600">
                {post.articleId}
              </span>
            )}
          </div>

          <h1 className="text-4xl font-bold mb-4 leading-tight">{post.title}</h1>
          <div className="flex gap-4 text-sm text-gray-400">
            <span>{post.date}</span>
            <span>·</span>
            <span>{post.readingTime}</span>
          </div>

          {/* Tags */}
          <div className="flex flex-wrap gap-2 mt-4">
            {post.tags.map((tag) => (
              <Link
                key={tag}
                href={`/tag/${encodeURIComponent(tag)}`}
                className="text-xs bg-[#f15a65]/10 text-[#f15a65] border border-[#f15a65]/20 px-2 py-1 rounded hover:bg-[#f15a65]/20 transition-colors"
              >
                {tag}
              </Link>
            ))}
          </div>
        </header>

        <article className="article-prose max-w-none">
          <MDXRemote
            source={cleanContent}
            options={{ mdxOptions: { remarkPlugins: [remarkGfm] } }}
          />
        </article>

        {jsonLd && (
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: jsonLd }}
          />
        )}
      </div>
    </main>
  )
}
