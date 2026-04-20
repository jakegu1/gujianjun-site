import type { NextConfig } from 'next'
import createMDX from '@next/mdx'

const withMDX = createMDX({})

/**
 * Agent-discovery Link response headers (RFC 8288).
 * These advertise machine-readable resources to AI agents scanning the site.
 *  - rel="sitemap"       : IANA-registered, points to sitemap.xml
 *  - rel="describedby"   : points to robots.txt (crawl policy + Content-Signal)
 *  - custom rel URIs     : agent-skills index (Agent Skills Discovery RFC v0.2.0)
 */
const AGENT_LINK_HEADER = [
  '</sitemap.xml>; rel="sitemap"; type="application/xml"',
  '</robots.txt>; rel="describedby"; type="text/plain"',
  '</.well-known/agent-skills/index.json>; rel="https://agentskills.io/rel/index"; type="application/json"',
].join(', ')

const nextConfig: NextConfig = {
  pageExtensions: ['js', 'jsx', 'ts', 'tsx', 'md', 'mdx'],

  async headers() {
    return [
      {
        // Apply to every path so agents hitting any page (including the
        // homepage) discover the site's machine-readable resources.
        source: '/:path*',
        headers: [
          { key: 'Link', value: AGENT_LINK_HEADER },
        ],
      },
    ]
  },
}

export default withMDX(nextConfig)
