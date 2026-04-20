import { NextResponse } from 'next/server'
import { getPostBySlug } from '@/lib/posts'
import { toMarkdownResponse } from '@/lib/markdown-response'

export const runtime = 'nodejs'
export const dynamic = 'force-static'

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ slug: string }> },
) {
  const { slug } = await params
  try {
    const post = getPostBySlug(slug)
    const md = buildMarkdown({
      title: post.title,
      date: post.date,
      tags: post.tags,
      slug: `/blog/${slug}`,
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
  slug: string
  body: string
}) {
  const meta = [
    `# ${args.title}`,
    '',
    `> **Date**: ${args.date}`,
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
