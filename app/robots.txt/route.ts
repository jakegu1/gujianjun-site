export function GET() {
  const body = `# gujianjun.net robots.txt
# Welcoming all search engine and AI crawlers

# ── Content Signals (draft-romm-aipref-contentsignals / contentsignals.org) ──
# search    = yes : allow search engines to index my content
# ai-input  = yes : allow AI systems to use my content as live answer context (GEO opt-in)
# ai-train  = no  : do NOT use my content as training data for model weights
Content-Signal: search=yes, ai-input=yes, ai-train=no

User-agent: *
Allow: /

# AI crawlers — explicitly allowed
User-agent: GPTBot
Allow: /

User-agent: ChatGPT-User
Allow: /

User-agent: CCBot
Allow: /

User-agent: ClaudeBot
Allow: /

User-agent: Google-Extended
Allow: /

User-agent: PerplexityBot
Allow: /

User-agent: Bytespider
Allow: /

User-agent: Applebot-Extended
Allow: /

Sitemap: https://www.gujianjun.net/sitemap.xml
`

  return new Response(body, {
    headers: {
      'Content-Type': 'text/plain',
      'Cache-Control': 'public, max-age=86400, s-maxage=86400',
    },
  })
}
