import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import './globals.css'

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
})

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
})

export const metadata: Metadata = {
  title: {
    default: '顾得 | SEO & GEO Specialist',
    template: '%s | 顾得',
  },
  description:
    '顾得 — 上海数字营销专家，专注 SEO 与 GEO，帮助品牌在搜索结果与 AI 回答中取得领先位置。',
  metadataBase: new URL('https://gujianjun.net'),
  openGraph: {
    siteName: '顾得',
    locale: 'zh_CN',
    type: 'website',
  },
}

const globalSchema = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Person',
      '@id': 'https://gujianjun.net/#person',
      name: 'Jake Gu',
      url: 'https://gujianjun.net',
      sameAs: [
        'https://www.linkedin.com/in/%E7%AE%80%E9%92%A7-%E9%A1%BE-28204b16a/',
      ],
      jobTitle: 'GEO & SEO Specialist',
      knowsAbout: ['Generative Engine Optimization', 'GEO', 'SEO', 'AI Search Optimization', '数字营销'],
      description: '上海数字营销专家，专注 SEO 与 GEO，帮助品牌在搜索结果与 AI 回答中取得领先位置。',
    },
    {
      '@type': 'WebSite',
      '@id': 'https://gujianjun.net/#website',
      name: '顾得',
      url: 'https://gujianjun.net',
      author: { '@id': 'https://gujianjun.net/#person' },
      inLanguage: 'zh-CN',
    },
  ],
}

// impact.com 站点所有权验证。impact 要求的是非标准的 value= 属性（不是 content=），
// React 的 meta 类型里没有 value，所以这里断言后展开。
const impactVerification = {
  name: 'impact-site-verification',
  value: '2709c9ea-5009-413c-af75-5cbcefa7fc76',
} as React.MetaHTMLAttributes<HTMLMetaElement>

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="zh-CN" suppressHydrationWarning>
      <head suppressHydrationWarning>
        <meta {...impactVerification} />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(globalSchema) }}
        />
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        {children}
      </body>
    </html>
  )
}
