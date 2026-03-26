import { getAllPosts } from '@/lib/posts'
import { getAllGeoPosts } from '@/lib/geo-posts'
import HomeClient from '@/components/HomeClient'

export const metadata = {
  title: '顾得 | SEO & GEO Specialist',
  description:
    '顾得 — 上海数字营销专家，专注 SEO 搜索引擎优化与 GEO AI 生成引擎优化，帮助品牌在搜索结果与 AI 回答中取得领先位置。',
}

export default function HomePage() {
  const regularPosts = getAllPosts().map((p) => ({ ...p, href: `/blog/${p.slug}` }))
  const geoPosts = getAllGeoPosts().map((p) => ({ ...p, href: `/geo/${p.slug}` }))
  const posts = [...regularPosts, ...geoPosts]
    .sort((a, b) => (a.date < b.date ? 1 : -1))
    .slice(0, 3)
  return <HomeClient posts={posts} />
}
