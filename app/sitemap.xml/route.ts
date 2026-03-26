import { getAllPosts } from '@/lib/posts'
import { getAllGeoPosts } from '@/lib/geo-posts'

const BASE_URL = 'https://www.gujianjun.net'

export function GET() {
  const posts = getAllPosts()
  const geoPosts = getAllGeoPosts()

  const staticPages = [
    { url: '', changefreq: 'weekly', priority: '1.0' },
    { url: '/blog', changefreq: 'weekly', priority: '0.8' },
    { url: '/geo', changefreq: 'weekly', priority: '0.9' },
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

  const allEntries = [...staticPages, ...blogEntries, ...geoEntries]

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
