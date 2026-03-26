import Link from 'next/link'
import { getAllGeoPosts } from '@/lib/geo-posts'

export const metadata = {
  title: 'GEO Tutorial Series — The Complete Guide to Generative Engine Optimization | 顾得',
  description:
    'A 60-part tutorial series on GEO (Generative Engine Optimization) — learn how to optimize your content for AI search engines like ChatGPT, Perplexity, and Google AI Overviews.',
}

function groupByPillar(posts: ReturnType<typeof getAllGeoPosts>) {
  const groups: Record<string, typeof posts> = {}
  for (const post of posts) {
    const pillar = post.pillar || 'Uncategorized'
    if (!groups[pillar]) groups[pillar] = []
    groups[pillar].push(post)
  }
  return groups
}

const pillarOrder = [
  'Hub',
  'Foundations',
  'AI Technical',
  'Strategy',
  'On-Page GEO',
  'Technical GEO',
  'Multi-Platform',
  'Measurement',
  'Advanced',
  'Workflow',
  'Case Studies',
]

export default function GeoPage() {
  const posts = getAllGeoPosts()
  const grouped = groupByPillar(posts)

  return (
    <main className="min-h-screen bg-[#0a0a0a] text-gray-100">
      <div className="max-w-3xl mx-auto px-6 py-16">
        <div className="mb-12">
          <span className="text-xs font-mono text-[#f15a65] tracking-widest uppercase">
            Tutorial Series
          </span>
          <h1 className="text-4xl font-bold mt-2">GEO — Generative Engine Optimization</h1>
          <p className="text-gray-400 mt-4 leading-relaxed">
            A comprehensive guide to optimizing your content for AI search engines.
            From fundamentals to advanced strategies — written by a practitioner, not a professor.
          </p>
        </div>

        {posts.length === 0 ? (
          <p className="text-gray-500 py-16 text-center">Series coming soon. Stay tuned.</p>
        ) : (
          <div className="space-y-12">
            {pillarOrder.map((pillar) => {
              const pillarPosts = grouped[pillar]
              if (!pillarPosts || pillarPosts.length === 0) return null
              return (
                <section key={pillar}>
                  <h2 className="text-sm font-mono text-[#f15a65] tracking-widest uppercase mb-4">
                    {pillar}
                  </h2>
                  <div className="space-y-1">
                    {pillarPosts.map((post) => (
                      <article key={post.slug}>
                        <Link
                          href={`/geo/${post.slug}`}
                          className="group flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-6 py-4 border-b border-gray-900 hover:border-gray-700 transition-colors"
                        >
                          <span className="text-xs font-mono text-gray-600 sm:w-16 shrink-0">
                            {post.articleId}
                          </span>
                          <div className="flex-1 min-w-0">
                            <h3 className="text-gray-300 group-hover:text-white transition-colors font-medium">
                              {post.title}
                            </h3>
                            {post.excerpt && (
                              <p className="text-sm text-gray-600 mt-1 truncate">{post.excerpt}</p>
                            )}
                          </div>
                          <span className="text-xs text-gray-600 shrink-0">{post.readingTime}</span>
                        </Link>
                      </article>
                    ))}
                  </div>
                </section>
              )
            })}
          </div>
        )}
      </div>
    </main>
  )
}
