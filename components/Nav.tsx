'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

const links = [
  { href: '/', label: '首页' },
  { href: '/blog', label: '文章' },
]

export default function Nav() {
  const pathname = usePathname()

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-[#0a0a0a]/80 backdrop-blur-md border-b border-gray-900">
      <nav className="max-w-4xl mx-auto px-6 h-14 flex items-center justify-between">
        <Link
          href="/"
          className="text-base font-bold text-white hover:text-[#f15a65] transition-colors"
        >
          顾<span className="text-[#f15a65]">得</span>
        </Link>

        <ul className="flex items-center gap-6">
          {links.map(({ href, label }) => (
            <li key={href}>
              <Link
                href={href}
                className={`text-sm transition-colors ${
                  pathname === href
                    ? 'text-[#f15a65]'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                {label}
              </Link>
            </li>
          ))}
          <li>
            <a
              href="mailto:jake.gu@foxmail.com"
              className="text-sm border border-gray-700 text-gray-300 px-4 py-1.5 rounded-full hover:border-[#f15a65] hover:text-[#f15a65] transition-colors"
            >
              联系
            </a>
          </li>
        </ul>
      </nav>
    </header>
  )
}
