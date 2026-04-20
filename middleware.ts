import { NextRequest, NextResponse } from 'next/server'

/**
 * Markdown for Agents — content negotiation middleware.
 *
 * When an agent requests /blog/{slug} or /geo/{slug} with
 *   Accept: text/markdown
 * (or a q-weighted preference for it over text/html), we rewrite to an
 * internal route handler that serves the raw Markdown source of the post.
 *
 * Browsers get the default HTML response. Agents get Markdown with
 *   Content-Type: text/markdown; charset=utf-8
 *   x-markdown-tokens: <approx token count>
 *
 * Also adds a self-referential Link header on HTML responses so agents can
 * discover the markdown alternate per RFC 8288 / RFC 6249.
 */

function prefersMarkdown(accept: string | null): boolean {
  if (!accept) return false
  // Cheap parser: find q values for text/markdown and text/html.
  const parts = accept.split(',').map((s) => s.trim())
  let mdQ = 0
  let htmlQ = 0
  for (const p of parts) {
    const [type, ...params] = p.split(';').map((x) => x.trim())
    const qParam = params.find((x) => x.startsWith('q='))
    const q = qParam ? parseFloat(qParam.slice(2)) : 1
    if (type === 'text/markdown') mdQ = Math.max(mdQ, q)
    else if (type === 'text/html') htmlQ = Math.max(htmlQ, q)
    else if (type === '*/*') {
      // treat as low baseline — does not prefer markdown
    }
  }
  // Prefer markdown only if explicitly requested AND at least as high as html.
  return mdQ > 0 && mdQ >= htmlQ
}

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl
  const accept = req.headers.get('accept')

  // Match /blog/{slug} and /geo/{slug} — single segment after prefix.
  const blogMatch = pathname.match(/^\/blog\/([^\/]+)\/?$/)
  const geoMatch = pathname.match(/^\/geo\/([^\/]+)\/?$/)
  const match = blogMatch || geoMatch
  if (!match) return NextResponse.next()

  const kind = blogMatch ? 'blog' : 'geo'
  const slug = match[1]

  // Advertise the markdown alternate on every response for this page.
  const selfHref = `${pathname}`
  const linkAlternate = `<${selfHref}>; rel="alternate"; type="text/markdown"`

  if (prefersMarkdown(accept)) {
    const url = req.nextUrl.clone()
    url.pathname = `/api/md/${kind}/${slug}`
    const res = NextResponse.rewrite(url)
    res.headers.append('Link', linkAlternate)
    res.headers.set('Vary', 'Accept')
    return res
  }

  const res = NextResponse.next()
  res.headers.append('Link', linkAlternate)
  res.headers.set('Vary', 'Accept')
  return res
}

export const config = {
  matcher: ['/blog/:slug', '/geo/:slug'],
}
