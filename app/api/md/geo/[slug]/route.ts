import { NextResponse } from 'next/server'
import { getGeoPostBySlug } from '@/lib/geo-posts'
import { toMarkdownResponse } from '@/lib/markdown-response'

export const runtime = 'nodejs'
export const dynamic = 'force-static'

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ slug: string }> },
) {
  const { slug } = await params
  try {
    const post = getGeoPostBySlug(slug)
    const md = buildMarkdown({
      title: post.title,
      date: post.date,
      tags: post.tags,
      pillar: post.pillar,
      articleId: post.articleId,
      slug: `/geo/${slug}`,
      body: post.content,
    })
    return toMarkdownResponse(md)
  } catch {
    return new NextResponse('Not found', { status: 404 })
  }
}

function buildMarkdown(args: {
  title: string
  date: string
  tags: string[]
  pillar: string
  articleId: string
  slug: string
  body: string
}) {
  const meta = [
    `# ${args.title}`,
    '',
    `> **Date**: ${args.date}`,
    args.pillar ? `> **Pillar**: ${args.pillar}` : null,
    args.articleId ? `> **Article ID**: ${args.articleId}` : null,
    args.tags.length ? `> **Tags**: ${args.tags.join(', ')}` : null,
    `> **Canonical**: https://www.gujianjun.net${args.slug}`,
    '',
    '---',
    '',
  ]
    .filter(Boolean)
    .join('\n')
  return meta + args.body.trim() + '\n'
}
