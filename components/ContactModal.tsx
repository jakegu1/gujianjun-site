'use client'

import { AnimatePresence, motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'

const WECHAT = '15821393416'
const EMAIL = 'jake.gu@foxmail.com'

function CopyButton({ text, label }: { text: string; label?: string }) {
  const [copied, setCopied] = useState(false)
  const onCopy = async () => {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      setTimeout(() => setCopied(false), 1600)
    } catch {
      /* clipboard blocked — ignore */
    }
  }
  return (
    <button
      onClick={onCopy}
      className="inline-flex items-center gap-1 text-xs font-medium text-[#f15a65] hover:text-[#ff8a65] transition-colors px-2 py-1 rounded border border-[#f15a65]/25 bg-[#f15a65]/[0.06] hover:bg-[#f15a65]/10 cursor-pointer"
    >
      {copied ? '已复制 ✓' : label ?? '复制'}
    </button>
  )
}

export default function ContactModal({
  open,
  onClose,
}: {
  open: boolean
  onClose: () => void
}) {
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose()
    document.addEventListener('keydown', onKey)
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = prev
    }
  }, [open, onClose])

  if (!mounted) return null

  return createPortal(
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          onClick={onClose}
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md"
        >
          <motion.div
            initial={{ scale: 0.92, opacity: 0, y: 16 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.96, opacity: 0, y: 8 }}
            transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-md rounded-2xl border border-white/10 bg-gradient-to-br from-[#111] to-[#0a0a0a] p-6 md:p-8 shadow-[0_0_80px_rgba(241,90,101,0.15)]"
          >
            {/* close */}
            <button
              onClick={onClose}
              aria-label="关闭"
              className="absolute top-3 right-3 w-9 h-9 rounded-full flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M18 6 6 18M6 6l12 12" />
              </svg>
            </button>

            <div className="mb-6">
              <span className="text-[11px] font-mono text-[#f15a65] tracking-widest uppercase">
                Get in touch
              </span>
              <h3 className="text-2xl font-bold text-white mt-1">联系顾得</h3>
              <p className="text-sm text-gray-500 mt-1.5">
                SEO / GEO / 增长咨询 · 欢迎通过以下方式联系我
              </p>
            </div>

            {/* WeChat */}
            <div className="rounded-xl border border-white/[0.08] bg-white/[0.02] p-5 mb-3">
              <div className="flex items-start gap-4">
                <div className="w-11 h-11 shrink-0 rounded-lg bg-[#07C160]/15 border border-[#07C160]/30 flex items-center justify-center">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="#07C160">
                    <path d="M8.5 2C4.36 2 1 4.91 1 8.5c0 2.08 1.13 3.93 2.88 5.12L3 16.5l3.1-1.63c.76.2 1.56.31 2.4.31l.6-.02c-.24-.66-.37-1.36-.37-2.1 0-3.55 3.36-6.43 7.5-6.43.2 0 .4.01.6.03C16.24 3.96 12.8 2 8.5 2zm-2.6 4a1 1 0 1 1 0 2 1 1 0 0 1 0-2zm5.2 0a1 1 0 1 1 0 2 1 1 0 0 1 0-2zM15.5 9c-3.58 0-6.5 2.47-6.5 5.5S11.92 20 15.5 20c.76 0 1.5-.11 2.18-.31L20.5 21l-.77-2.2C21.1 17.77 22 16.21 22 14.5 22 11.47 19.08 9 15.5 9zM13 12.5a.75.75 0 1 1 0 1.5.75.75 0 0 1 0-1.5zm5 0a.75.75 0 1 1 0 1.5.75.75 0 0 1 0-1.5z" />
                  </svg>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <div className="text-sm font-medium text-white">微信 / 手机</div>
                    <CopyButton text={WECHAT} />
                  </div>
                  <div className="text-lg font-mono text-gray-200 mt-1 tracking-wide">
                    {WECHAT}
                  </div>
                  <p className="text-xs text-gray-500 mt-1.5">
                    微信搜索手机号添加，备注「网站」我会优先回复
                  </p>
                </div>
              </div>

              {/* Optional QR — shows if /wechat-qr.png exists in /public, otherwise hides gracefully */}
              <div className="mt-4 pt-4 border-t border-white/[0.06] flex items-center gap-4">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/wechat-qr.png"
                  alt="微信二维码"
                  width={96}
                  height={96}
                  className="rounded-lg bg-white/5 p-1.5 border border-white/[0.06]"
                  onError={(e) => {
                    ;(e.currentTarget.parentElement as HTMLElement).style.display = 'none'
                  }}
                />
                <p className="text-xs text-gray-500 leading-relaxed">
                  也可以扫码加微信。
                  <br />
                  （二维码在手机 WeChat → 我 → 我的二维码 里）
                </p>
              </div>
            </div>

            {/* Email */}
            <div className="rounded-xl border border-white/[0.08] bg-white/[0.02] p-5">
              <div className="flex items-start gap-4">
                <div className="w-11 h-11 shrink-0 rounded-lg bg-[#f15a65]/15 border border-[#f15a65]/30 flex items-center justify-center">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#f15a65" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="5" width="18" height="14" rx="2" />
                    <path d="m3 7 9 6 9-6" />
                  </svg>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <div className="text-sm font-medium text-white">邮箱</div>
                    <CopyButton text={EMAIL} />
                  </div>
                  <a
                    href={`mailto:${EMAIL}`}
                    className="text-base font-mono text-gray-200 mt-1 block hover:text-[#f15a65] transition-colors break-all"
                  >
                    {EMAIL}
                  </a>
                  <p className="text-xs text-gray-500 mt-1.5">
                    适合正式咨询、合作邀约、长篇需求描述
                  </p>
                </div>
              </div>
            </div>

            <p className="text-[11px] text-gray-600 text-center mt-5">
              Based in 上海 · 响应时间通常 24 小时内
            </p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body,
  )
}
