import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import readingTime from 'reading-time'

const geoDirectory = path.join(process.cwd(), 'content/geo')

export interface GeoPost {
  slug: string
  title: string
  date: string
  excerpt: string
  tags: string[]
  pillar: string
  articleId: string
  coverImage?: string
  readingTime: string
  content: string
}

export function getAllGeoPosts(): GeoPost[] {
  if (!fs.existsSync(geoDirectory)) return []

  const fileNames = fs.readdirSync(geoDirectory)
  const posts = fileNames
    .filter((name) => name.endsWith('.mdx') || name.endsWith('.md'))
    .map((fileName) => {
      const slug = fileName.replace(/\.mdx?$/, '')
      const fullPath = path.join(geoDirectory, fileName)
      const fileContents = fs.readFileSync(fullPath, 'utf8')
      const { data, content } = matter(fileContents)
      const stats = readingTime(content)

      return {
        slug,
        title: data.title ?? slug,
        date: data.date ?? '',
        excerpt: data.excerpt ?? '',
        tags: data.tags ?? [],
        pillar: data.pillar ?? '',
        articleId: data.articleId ?? '',
        coverImage: data.coverImage,
        readingTime: stats.text,
        content,
      } as GeoPost
    })

  return posts.sort((a, b) => (a.date < b.date ? 1 : -1))
}

export function getGeoPostBySlug(slug: string): GeoPost {
  const mdxPath = path.join(geoDirectory, `${slug}.mdx`)
  const mdPath = path.join(geoDirectory, `${slug}.md`)
  const fullPath = fs.existsSync(mdxPath) ? mdxPath : mdPath
  const fileContents = fs.readFileSync(fullPath, 'utf8')
  const { data, content } = matter(fileContents)
  const stats = readingTime(content)

  return {
    slug,
    title: data.title ?? slug,
    date: data.date ?? '',
    excerpt: data.excerpt ?? '',
    tags: data.tags ?? [],
    pillar: data.pillar ?? '',
    articleId: data.articleId ?? '',
    coverImage: data.coverImage,
    readingTime: stats.text,
    content,
  }
}
