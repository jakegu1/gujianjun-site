import { getAllPosts } from '@/lib/posts'
import { getAllGeoPosts } from '@/lib/geo-posts'

const BASE_URL = 'https://www.gujianjun.net'

export function GET() {
  const posts = getAllPosts()
  const geoPosts = getAllGeoPosts()

  const staticPages = [
    { url: '', lastmod: '', changefreq: 'weekly', priority: '1.0' },
    { url: '/blog', lastmod: '', changefreq: 'weekly', priority: '0.8' },
    { url: '/geo', lastmod: '', changefreq: 'weekly', priority: '0.9' },
  ]

  const blogEntries = posts.map((post) => ({
    url: `/blog/${post.slug}`,
    lastmod: post.date,
    changefreq: 'monthly' as const,
    priority: '0.7',
  }))

  const geoEntries = geoPosts.map((post) => ({
    url: `/geo/${post.slug}`,
    lastmod: post.date,
    changefreq: 'monthly' as const,
    priority: '0.8',
  }))

  const allTags = new Set<string>()
  for (const p of posts) p.tags.forEach((t) => allTags.add(t))
  for (const p of geoPosts) p.tags.forEach((t) => allTags.add(t))

  const tagEntries = Array.from(allTags).map((tag) => ({
    url: `/tag/${encodeURIComponent(tag)}`,
    lastmod: '',
    changefreq: 'weekly' as const,
    priority: '0.5',
  }))

  const allEntries = [...staticPages, ...blogEntries, ...geoEntries, ...tagEntries]

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${allEntries
  .map(
    (entry) => `  <url>
    <loc>${BASE_URL}${entry.url}</loc>${entry.lastmod ? `\n    <lastmod>${entry.lastmod}</lastmod>` : ''}
    <changefreq>${entry.changefreq}</changefreq>
    <priority>${entry.priority}</priority>
  </url>`
  )
  .join('\n')}
</urlset>`

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 'public, max-age=3600, s-maxage=3600',
    },
  })
}
