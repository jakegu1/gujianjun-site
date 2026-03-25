import { MDXRemote } from 'next-mdx-remote/rsc'
import Link from 'next/link'
import { getAllPosts, getPostBySlug } from '@/lib/posts'

export async function generateStaticParams() {
  const posts = getAllPosts()
  return posts.map((post) => ({ slug: post.slug }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const post = getPostBySlug(slug)
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

export default async function PostPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const post = getPostBySlug(slug)

  return (
    <main className="min-h-screen bg-[#0a0a0a] text-gray-100">
      <div className="max-w-3xl mx-auto px-6 py-16">
        {/* Back link */}
        <Link
          href="/blog"
          className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-[#f15a65] transition-colors mb-12"
        >
          ← 返回文章列表
        </Link>

        <header className="mb-12">
          {/* Tags */}
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
