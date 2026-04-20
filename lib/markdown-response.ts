/**
 * Shared helper for Markdown-for-Agents responses.
 *
 * Sets the content type, a Vary header so caches distinguish browsers from
 * agents, and x-markdown-tokens with an approximate token count — which is
 * what Cloudflare's "Markdown for Agents" recommends so agents can budget
 * context windows without having to tokenize the payload themselves.
 *
 * The approximation is the GPT rule-of-thumb: ~4 characters per token for
 * mixed English + Chinese text. This is intentionally cheap (no tiktoken
 * dependency) and good enough for budgeting.
 */
export function approxTokens(markdown: string): number {
  if (!markdown) return 0
  return Math.ceil(markdown.length / 4)
}

export function toMarkdownResponse(markdown: string): Response {
  return new Response(markdown, {
    headers: {
      'Content-Type': 'text/markdown; charset=utf-8',
      'x-markdown-tokens': String(approxTokens(markdown)),
      Vary: 'Accept',
      'Cache-Control': 'public, max-age=300, s-maxage=3600',
    },
  })
}
