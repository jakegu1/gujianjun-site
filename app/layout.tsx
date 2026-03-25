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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="zh-CN">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        {children}
      </body>
    </html>
  )
}
