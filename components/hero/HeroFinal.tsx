'use client'

import { motion, AnimatePresence, animate, useMotionValue, useSpring, useTransform } from 'framer-motion'
import Link from 'next/link'
import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import ContactModal from '@/components/ContactModal'

/* ── Tools / Platforms (Row 1: scrolls left, faster) ── */
const TOOLS = [
  { en: 'SEO',            zh: '谷歌搜索优化' },
  { en: 'GA4',            zh: '谷歌分析' },
  { en: 'GTM',            zh: '代码管理器' },
  { en: 'GOOGLE ADS',     zh: '搜索广告' },
  { en: 'AHREFS',         zh: 'SEO 工具' },
  { en: 'SALESFORCE',     zh: '客户管理' },
  { en: 'WORDPRESS',      zh: '内容管理' },
  { en: 'ZAPIER',         zh: '自动化工具' },
  { en: 'NEXT.JS',        zh: '前端框架' },
  { en: 'VERCEL',         zh: '部署托管' },
  { en: 'BREVO',          zh: '邮件营销' },
  { en: 'SEARCH CONSOLE', zh: '搜索控制台' },
  { en: 'REACT',          zh: '组件开发' },
  { en: 'CONTACT FORM 7', zh: '表单插件' },
  { en: 'ACUITY',         zh: '预约系统' },
]

/* ── Methods / Concepts (Row 2: scrolls right, slower) ── */
const METHODS = [
  { en: 'GEO',                 zh: 'AI 生成引擎优化' },
  { en: 'TECHNICAL SEO',       zh: '技术优化' },
  { en: 'AI CITATION',         zh: 'AI 引用优化' },
  { en: 'SCHEMA MARKUP',       zh: '结构化数据' },
  { en: 'CORE WEB VITALS',     zh: '核心网页指标' },
  { en: 'VECTOR SEARCH',       zh: '向量搜索' },
  { en: 'RAG',                 zh: '检索增强生成' },
  { en: 'ENTITY SEO',          zh: '实体优化' },
  { en: 'LLM VISIBILITY',      zh: '大模型可见性' },
  { en: 'CONVERSION TRACKING', zh: '转化追踪' },
  { en: 'CONTENT STRATEGY',    zh: '内容策略' },
  { en: 'LINK BUILDING',       zh: '外链建设' },
  { en: 'ATTRIBUTION',         zh: '归因分析' },
  { en: 'ZERO-CLICK',          zh: '零点击优化' },
  { en: 'GROWTH HACKING',      zh: '增长黑客' },
  { en: 'CHATGPT',             zh: '对话式搜索' },
  { en: 'PERPLEXITY',          zh: 'AI 搜索引擎' },
  { en: 'AI OVERVIEWS',        zh: 'AI 概览' },
  { en: 'PROMPT ENGINEERING',  zh: '提示词工程' },
]

/* ── Custom glowing cursor (desktop / fine-pointer only) ── */
function CustomCursor({ hovering }: { hovering: boolean }) {
  const x = useMotionValue(-100)
  const y = useMotionValue(-100)
  const sx = useSpring(x, { stiffness: 500, damping: 40, mass: 0.5 })
  const sy = useSpring(y, { stiffness: 500, damping: 40, mass: 0.5 })
  const [enabled, setEnabled] = useState(false)

  useEffect(() => {
    // Only enable on devices with a hoverable, fine pointer (i.e. real mouse).
    // Touch devices report `hover: none` and `pointer: coarse`.
    if (typeof window === 'undefined' || !window.matchMedia) return
    const mq = window.matchMedia('(hover: hover) and (pointer: fine)')
    setEnabled(mq.matches)
    const onChange = (e: MediaQueryListEvent) => setEnabled(e.matches)
    mq.addEventListener?.('change', onChange)
    return () => mq.removeEventListener?.('change', onChange)
  }, [])

  useEffect(() => {
    if (!enabled) return
    const onMove = (e: MouseEvent) => { x.set(e.clientX); y.set(e.clientY) }
    window.addEventListener('mousemove', onMove)
    return () => window.removeEventListener('mousemove', onMove)
  }, [x, y, enabled])

  if (!enabled) return null

  return (
    <>
      <motion.div
        className="fixed top-0 left-0 pointer-events-none z-[60] mix-blend-screen"
        style={{ x, y, translateX: '-50%', translateY: '-50%' }}
      >
        <div className="w-2 h-2 rounded-full bg-white" />
      </motion.div>
      <motion.div
        className="fixed top-0 left-0 pointer-events-none z-[60]"
        style={{ x: sx, y: sy, translateX: '-50%', translateY: '-50%' }}
        animate={{ scale: hovering ? 2.8 : 1 }}
        transition={{ duration: 0.25 }}
      >
        <div className="w-10 h-10 rounded-full border border-[#f15a65]/70 shadow-[0_0_24px_rgba(241,90,101,0.5)]" />
      </motion.div>
    </>
  )
}

/* ── Magnetic button wrapper ── */
function Magnetic({ children, strength = 0.3 }: { children: React.ReactNode; strength?: number }) {
  const ref = useRef<HTMLDivElement>(null)
  const x = useMotionValue(0), y = useMotionValue(0)
  const sx = useSpring(x, { stiffness: 200, damping: 18 })
  const sy = useSpring(y, { stiffness: 200, damping: 18 })

  const onMove = (e: React.MouseEvent) => {
    const r = ref.current?.getBoundingClientRect()
    if (!r) return
    x.set((e.clientX - (r.left + r.width / 2)) * strength)
    y.set((e.clientY - (r.top + r.height / 2)) * strength)
  }
  const onLeave = () => { x.set(0); y.set(0) }
  return <motion.div ref={ref} onMouseMove={onMove} onMouseLeave={onLeave} style={{ x: sx, y: sy }}>{children}</motion.div>
}

/* ── Cinematic gradient mesh + particle field with cursor repulsion ── */
function HeroBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const mouse = useRef({ x: -1000, y: -1000 })

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    const DPR = Math.min(window.devicePixelRatio || 1, 2)
    let W = 0, H = 0

    interface P { x: number; y: number; vx: number; vy: number; bx: number; by: number; s: number }
    interface B { cx: number; cy: number; r: number; phase: number; speed: number; orbit: number; color: string }
    let pts: P[] = []
    let blobs: B[] = []

    const setup = () => {
      W = canvas.clientWidth; H = canvas.clientHeight
      canvas.width = W * DPR; canvas.height = H * DPR
      ctx.setTransform(DPR, 0, 0, DPR, 0, 0)

      pts = []
      const count = Math.min(200, Math.floor((W * H) / 8500))
      for (let i = 0; i < count; i++) {
        const x = Math.random() * W, y = Math.random() * H
        pts.push({ x, y, bx: x, by: y, vx: 0, vy: 0, s: Math.random() * 1.2 + 0.3 })
      }

      blobs = [
        { cx: W * 0.3, cy: H * 0.4, r: Math.max(W, H) * 0.55, phase: 0, speed: 0.05, orbit: W * 0.15, color: '241,90,101' },
        { cx: W * 0.7, cy: H * 0.6, r: Math.max(W, H) * 0.5, phase: 2, speed: 0.07, orbit: W * 0.18, color: '255,138,101' },
        { cx: W * 0.5, cy: H * 0.3, r: Math.max(W, H) * 0.45, phase: 4, speed: 0.04, orbit: W * 0.2, color: '120,60,180' },
        { cx: W * 0.2, cy: H * 0.8, r: Math.max(W, H) * 0.4, phase: 1, speed: 0.06, orbit: W * 0.12, color: '60,100,200' },
      ]
    }
    setup()
    const onR = () => setup()
    const onMove = (e: MouseEvent) => {
      const r = canvas.getBoundingClientRect()
      mouse.current.x = e.clientX - r.left
      mouse.current.y = e.clientY - r.top
    }
    window.addEventListener('resize', onR)
    window.addEventListener('mousemove', onMove)

    let raf = 0, t = 0
    const FR = 150, FR2 = FR * FR
    const LR = 90, LR2 = LR * LR

    const render = () => {
      t += 0.012
      // Base dark
      ctx.fillStyle = '#050505'
      ctx.fillRect(0, 0, W, H)
      // Cinematic gradient blobs
      ctx.globalCompositeOperation = 'lighter'
      for (const b of blobs) {
        const bx = b.cx + Math.cos(t * b.speed + b.phase) * b.orbit
        const by = b.cy + Math.sin(t * b.speed * 0.8 + b.phase) * b.orbit * 0.7
        const g = ctx.createRadialGradient(bx, by, 0, bx, by, b.r)
        g.addColorStop(0, `rgba(${b.color},0.28)`)
        g.addColorStop(0.4, `rgba(${b.color},0.1)`)
        g.addColorStop(1, `rgba(${b.color},0)`)
        ctx.fillStyle = g
        ctx.beginPath(); ctx.arc(bx, by, b.r, 0, Math.PI * 2); ctx.fill()
      }
      ctx.globalCompositeOperation = 'source-over'

      // Vignette
      const vg = ctx.createRadialGradient(W/2, H/2, Math.min(W,H)*0.3, W/2, H/2, Math.max(W,H)*0.8)
      vg.addColorStop(0, 'rgba(5,5,5,0)'); vg.addColorStop(1, 'rgba(5,5,5,0.8)')
      ctx.fillStyle = vg; ctx.fillRect(0, 0, W, H)

      // Particle field with cursor repulsion
      const { x: mx, y: my } = mouse.current
      for (const p of pts) {
        const dx = p.x - mx, dy = p.y - my
        const d2 = dx * dx + dy * dy
        if (d2 < FR2 && d2 > 0.1) {
          const d = Math.sqrt(d2)
          const f = (1 - d / FR) * 3.5
          p.vx += (dx / d) * f
          p.vy += (dy / d) * f
        }
        p.vx += (p.bx - p.x) * 0.02
        p.vy += (p.by - p.y) * 0.02
        p.vx *= 0.9; p.vy *= 0.9
        p.x += p.vx; p.y += p.vy
      }
      // Constellation links
      ctx.lineWidth = 0.5
      for (let i = 0; i < pts.length; i++) {
        for (let j = i + 1; j < pts.length; j++) {
          const dx = pts[i].x - pts[j].x, dy = pts[i].y - pts[j].y
          const d2 = dx * dx + dy * dy
          if (d2 < LR2) {
            ctx.strokeStyle = `rgba(241,90,101,${(1 - d2 / LR2) * 0.13})`
            ctx.beginPath(); ctx.moveTo(pts[i].x, pts[i].y); ctx.lineTo(pts[j].x, pts[j].y); ctx.stroke()
          }
        }
      }
      for (const p of pts) {
        ctx.beginPath(); ctx.arc(p.x, p.y, p.s, 0, Math.PI * 2)
        ctx.fillStyle = 'rgba(255,200,190,0.55)'; ctx.fill()
      }

      // Cursor aura
      const ag = ctx.createRadialGradient(mx, my, 0, mx, my, FR)
      ag.addColorStop(0, 'rgba(241,90,101,0.08)')
      ag.addColorStop(1, 'rgba(241,90,101,0)')
      ctx.fillStyle = ag
      ctx.beginPath(); ctx.arc(mx, my, FR, 0, Math.PI * 2); ctx.fill()

      raf = requestAnimationFrame(render)
    }
    raf = requestAnimationFrame(render)
    return () => { cancelAnimationFrame(raf); window.removeEventListener('resize', onR); window.removeEventListener('mousemove', onMove) }
  }, [])

  return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none" aria-hidden />
}

/* ── Chromatic aberration text ── */
function ChromaticText({ children }: { children: React.ReactNode }) {
  return (
    <span className="relative inline-block">
      <span aria-hidden className="absolute inset-0 text-[#ff3040] mix-blend-screen" style={{ transform: 'translate(-3px,0)' }}>{children}</span>
      <span aria-hidden className="absolute inset-0 text-[#30a0ff] mix-blend-screen" style={{ transform: 'translate(3px,0)' }}>{children}</span>
      <span className="relative">{children}</span>
    </span>
  )
}

/* ── Top tagline: 得到曝光 · 得到引用 · 得到增长 · 得到结果 ── */
function DeliveryRow() {
  const items = [
    { zh: '曝光', en: 'VISIBILITY' },
    { zh: '引用', en: 'CITATIONS' },
    { zh: '增长', en: 'GROWTH' },
    { zh: '结果', en: 'RESULTS' },
  ]
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
      className="flex items-center gap-2 md:gap-3 flex-wrap justify-center"
    >
      {items.map((item, i) => (
        <motion.span
          key={item.zh}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.25 + i * 0.1, ease: [0.22, 1, 0.36, 1] }}
          className="inline-flex items-baseline gap-1 text-[13px] md:text-[15px] font-semibold tracking-wide"
        >
          <span className="text-white/55">得到</span>
          <span className="font-black bg-gradient-to-r from-[#ffb4a0] via-[#f15a65] to-[#ff8a65] bg-clip-text text-transparent">
            {item.zh}
          </span>
          {i < items.length - 1 && (
            <span className="ml-2 md:ml-3 text-white/20 font-light select-none">·</span>
          )}
        </motion.span>
      ))}
    </motion.div>
  )
}

/* ── Center: 顾得 (dominant, solo) ── */
function GuDeCentered() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30, filter: 'blur(20px)' }}
      animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
      transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
      className="text-[min(22vw,13rem)] font-black leading-[0.85] tracking-tighter flex items-baseline justify-center"
    >
      <span className="text-white/90">顾</span>
      <span className="relative inline-block">
        <motion.span
          aria-hidden
          className="absolute inset-0 rounded-full blur-3xl"
          style={{ background: 'radial-gradient(circle, rgba(241,90,101,0.55) 0%, transparent 70%)' }}
          animate={{ opacity: [0.5, 1, 0.5], scale: [1, 1.12, 1] }}
          transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
        />
        <span
          className="relative bg-gradient-to-br from-[#ffb4a0] via-[#f15a65] to-[#ff8a65] bg-clip-text text-transparent"
          style={{ filter: 'drop-shadow(0 0 40px rgba(241,90,101,0.4))' }}
        >
          得
        </span>
      </span>
    </motion.div>
  )
}

/* ── Count-up number ── */
function CountUp({ to, duration = 2, delay = 0, format = (v: number) => Math.round(v).toString() }: { to: number; duration?: number; delay?: number; format?: (v: number) => string }) {
  const mv = useMotionValue(0)
  const rounded = useTransform(mv, (v) => format(v))
  const [text, setText] = useState(format(0))
  useEffect(() => {
    const controls = animate(mv, to, { duration, delay, ease: [0.22, 1, 0.36, 1] })
    const unsub = rounded.on('change', (v) => setText(v))
    return () => { controls.stop(); unsub() }
  }, [to, duration, delay, mv, rounded])
  return <>{text}</>
}

/* ── Sparkline (animated draw) ── */
function Sparkline({ data, delay = 0, active = false }: { data: number[]; delay?: number; active?: boolean }) {
  const W = 100, H = 18
  const max = Math.max(...data)
  const min = Math.min(...data)
  const range = max - min || 1
  const points = data.map((d, i) => {
    const x = (i / (data.length - 1)) * W
    const y = H - ((d - min) / range) * H
    return `${x},${y}`
  }).join(' ')
  const path = `M ${points.split(' ').join(' L ')}`
  return (
    <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} className="overflow-visible">
      <defs>
        <linearGradient id={`sparkFill-${delay}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#f15a65" stopOpacity="0.4" />
          <stop offset="100%" stopColor="#f15a65" stopOpacity="0" />
        </linearGradient>
      </defs>
      {/* Area fill */}
      <motion.path
        d={`${path} L ${W},${H} L 0,${H} Z`}
        fill={`url(#sparkFill-${delay})`}
        initial={{ opacity: 0 }}
        animate={{ opacity: active ? 0.9 : 0.5 }}
        transition={{ duration: 0.4 }}
      />
      {/* Line */}
      <motion.path
        d={path}
        fill="none"
        stroke="#f15a65"
        strokeWidth={active ? 2 : 1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 1.5, delay, ease: 'easeOut' }}
      />
      {/* End dot */}
      <motion.circle
        cx={W}
        cy={H - ((data[data.length - 1] - min) / range) * H}
        r={active ? 3.5 : 2.5}
        fill="#ffb4a0"
        style={{ filter: 'drop-shadow(0 0 6px #f15a65)' }}
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4, delay: delay + 1.4 }}
      />
    </svg>
  )
}

/* ── Interactive Stat Card (with screenshot preview + lightbox) ── */
function StatCard({ stat, index }: { stat: typeof STATS_DATA[number]; index: number }) {
  const [hover, setHover] = useState(false)
  const [lightboxOpen, setLightboxOpen] = useState(false)
  const [mounted, setMounted] = useState(false)
  const hasImages = stat.images.length > 0

  useEffect(() => { setMounted(true) }, [])

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 2.2 + index * 0.12, ease: [0.22, 1, 0.36, 1] }}
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
        onClick={() => hasImages && setLightboxOpen(true)}
        whileHover={{ y: -3 }}
        className={`group relative rounded-xl p-3 border backdrop-blur-md transition-colors duration-300 ${
          hasImages ? 'cursor-pointer' : 'cursor-default'
        } ${
          hover
            ? 'bg-white/[0.06] border-[#f15a65]/40'
            : 'bg-white/[0.025] border-white/10'
        }`}
      >
        {/* Animated glow */}
        <motion.div
          aria-hidden
          className="absolute inset-0 pointer-events-none overflow-hidden rounded-xl"
          animate={{ opacity: hover ? 1 : 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className="absolute -inset-px" style={{ background: 'radial-gradient(400px circle at 50% 0%, rgba(241,90,101,0.15), transparent 60%)' }} />
        </motion.div>

        {/* Top-right: index or camera icon */}
        <div className="absolute top-2 right-2 flex items-center gap-1.5">
          {hasImages && (
            <motion.div
              animate={{ opacity: hover ? 1 : 0.5, scale: hover ? 1.1 : 1 }}
              className="text-[10px] text-[#f15a65]"
              title="Has screenshot proof"
            >
              {/* Small camera/image SVG icon */}
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                <circle cx="8.5" cy="8.5" r="1.5" />
                <polyline points="21 15 16 10 5 21" />
              </svg>
            </motion.div>
          )}
          <div className="text-[9px] font-mono text-white/30 tracking-wider">
            0{index + 1}
          </div>
        </div>

        {/* Big number with count-up */}
        <div className="flex items-baseline gap-0.5">
          <span className="text-[1.55rem] md:text-[1.8rem] font-black tracking-tight bg-gradient-to-b from-white via-white to-white/60 bg-clip-text text-transparent leading-none">
            {stat.prefix}<CountUp to={stat.value} duration={2} delay={2.4 + index * 0.15} format={stat.format} />{stat.suffix}
          </span>
        </div>

        {/* Label */}
        <div className="text-[11px] font-medium text-white/80 mt-1 tracking-wide">
          {stat.label}
        </div>

        {/* Sparkline */}
        <div className="mt-1">
          <Sparkline data={stat.trend} delay={2.8 + index * 0.15} active={hover} />
        </div>

        {/* Context line — swaps to "VIEW PROOF→" on hover when images exist */}
        <motion.div
          animate={{ color: hover ? 'rgba(241,90,101,0.9)' : 'rgba(255,255,255,0.4)' }}
          transition={{ duration: 0.3 }}
          className="text-[10px] font-mono tracking-wider mt-1 flex items-center justify-between"
        >
          <span>{stat.sub}</span>
          {hasImages && hover && (
            <motion.span
              initial={{ opacity: 0, x: -4 }}
              animate={{ opacity: 1, x: 0 }}
              className="text-[#f15a65] font-bold"
            >
              VIEW →
            </motion.span>
          )}
        </motion.div>

        {/* Floating screenshot preview on hover */}
        <AnimatePresence>
          {hover && hasImages && (
            <motion.div
              initial={{ opacity: 0, y: 8, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 8, scale: 0.96 }}
              transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
              className="absolute left-1/2 -translate-x-1/2 bottom-[calc(100%+14px)] z-50 pointer-events-none"
              style={{ width: 340 }}
            >
              <div className="relative rounded-lg overflow-hidden border border-[#f15a65]/40 bg-black/95 backdrop-blur-xl shadow-[0_20px_60px_rgba(0,0,0,0.8),0_0_0_1px_rgba(241,90,101,0.1)]">
                <img
                  src={stat.images[0].src}
                  alt={stat.images[0].caption}
                  className="w-full h-auto block max-h-[200px] object-cover object-top"
                />
                <div className="px-3 py-2 border-t border-white/10 flex items-center justify-between gap-2">
                  <span className="text-[10px] font-mono tracking-wider text-[#f15a65] uppercase shrink-0">
                    {stat.images[0].tab}
                  </span>
                  <span className="text-[10px] text-white/60 truncate">
                    {stat.images.length > 1 ? `${stat.images.length} screenshots · click to view` : 'click to enlarge'}
                  </span>
                </div>
              </div>
              {/* Arrow pointing down to card */}
              <div className="absolute top-full left-1/2 -translate-x-1/2 -translate-y-1/2 w-2.5 h-2.5 rotate-45 bg-black/95 border-r border-b border-[#f15a65]/40" />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Full-screen lightbox \u2014 portaled to document.body so `position: fixed`
          is not contained by any transformed ancestor (StatCard has framer-motion transforms) */}
      {mounted && createPortal(
        <AnimatePresence>
          {lightboxOpen && (
            <ScreenshotLightbox stat={stat} onClose={() => setLightboxOpen(false)} />
          )}
        </AnimatePresence>,
        document.body
      )}
    </>
  )
}

type StatImage = { src: string; caption: string; tab: string; source: string }

const STATS_DATA: Array<{
  value: number
  prefix: string
  suffix: string
  format: (v: number) => string
  label: string
  sub: string
  detail: string
  trend: number[]
  images: StatImage[]
}> = [
  {
    value: 3, prefix: '', suffix: '×', format: (v: number) => Math.round(v).toString(),
    label: '自然流量增长',
    sub: '10K → 30K / 月',
    detail: '12 个月内将每月自然搜索流量从 10K 提升到 30K，目前仍在持续增长。',
    trend: [8, 10, 12, 14, 16, 18, 20, 23, 26, 30],
    images: [
      {
        src: '/proof/gsc-organic-growth.png',
        caption: '12 个月内点击量翻三倍，流量稳定增长',
        tab: 'GSC',
        source: 'Google Search Console',
      },
    ],
  },
  {
    value: 2, prefix: '', suffix: '×', format: (v: number) => Math.round(v).toString(),
    label: '网站总访问',
    sub: 'vs. 上年同期',
    detail: '网站整体 views 翻倍，包含直接访问、社交、referral 等所有来源。',
    trend: [5, 6, 6, 7, 8, 9, 10, 11, 11, 12],
    images: [
      {
        src: '/proof/semrush-total-traffic.png',
        caption: 'Semrush: 网站总流量长期增长趋势，最大增幅达 10 倍',
        tab: 'Semrush',
        source: 'Semrush Traffic Analytics',
      },
    ],
  },
  {
    value: 2000, prefix: '', suffix: '+', format: (v: number) => Math.round(v).toLocaleString(),
    label: 'AI 引用',
    sub: 'ChatGPT / 月',
    detail: '品牌内容被 ChatGPT、Claude、Perplexity 等生成式 AI 引用次数，数据仍在持续增长。',
    trend: [50, 120, 280, 450, 700, 950, 1250, 1550, 1800, 2000],
    images: [
      {
        src: '/proof/geo-chatgpt.png',
        caption: 'ChatGPT 无痕模式：推荐 online Chinese schools 时，GoEast Mandarin 排名第一',
        tab: 'ChatGPT',
        source: 'ChatGPT Incognito',
      },
      {
        src: '/proof/geo-ai-overviews.png',
        caption: '"online chinese school" 搜索中，Google 自然结果 + AI Overviews 同时 Top 1',
        tab: 'AI Overviews',
        source: 'Google Chrome Incognito',
      },
    ],
  },
  {
    value: 65, prefix: '', suffix: '', format: (v: number) => Math.round(v).toString(),
    label: '核心关键词',
    sub: 'Google Top 10',
    detail: '行业核心搜索词进入 Google 搜索结果第一页（Top 10）的数量。',
    trend: [12, 18, 24, 30, 36, 42, 48, 54, 60, 65],
    images: [
      {
        src: '/proof/ahrefs-top10-keywords.png',
        caption: 'Ahrefs: 65 个核心关键词进入 Google Top 10，新增 57 个',
        tab: 'Ahrefs',
        source: 'Ahrefs Keyword Tracker',
      },
    ],
  },
]

/* ── Lightbox modal for full-size screenshot view ── */
function ScreenshotLightbox({ stat, onClose }: { stat: typeof STATS_DATA[number]; onClose: () => void }) {
  const [idx, setIdx] = useState(0)
  const images = stat.images

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
      if (e.key === 'ArrowLeft') setIdx((i) => (i - 1 + images.length) % images.length)
      if (e.key === 'ArrowRight') setIdx((i) => (i + 1) % images.length)
    }
    window.addEventListener('keydown', handler)
    document.body.style.overflow = 'hidden'
    return () => {
      window.removeEventListener('keydown', handler)
      document.body.style.overflow = ''
    }
  }, [images.length, onClose])

  if (!images.length) return null
  const img = images[idx]

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25 }}
      className="fixed inset-0 z-[100] bg-[#0a0a0a] flex flex-col"
      onClick={onClose}
      style={{ cursor: 'auto' }}
    >
      {/* Subtle radial vignette for depth (still fully opaque underlying) */}
      <div
        aria-hidden
        className="absolute inset-0 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse at center, rgba(241,90,101,0.04) 0%, transparent 60%)' }}
      />

      {/* Fixed close button at viewport top-right — always visible */}
      <button
        onClick={(e) => { e.stopPropagation(); onClose() }}
        className="fixed top-5 right-5 md:top-6 md:right-6 z-[110] w-11 h-11 rounded-full bg-white/[0.06] hover:bg-[#f15a65] border border-white/15 hover:border-[#f15a65] text-white/80 hover:text-white flex items-center justify-center transition-all duration-200 backdrop-blur-md"
        aria-label="Close"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
          <line x1="18" y1="6" x2="6" y2="18" />
          <line x1="6" y1="6" x2="18" y2="18" />
        </svg>
      </button>

      {/* Modal content — flex column constrained to viewport */}
      <motion.div
        initial={{ scale: 0.96, y: 12 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.96, y: 12 }}
        transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
        className="relative flex-1 flex flex-col w-full max-w-6xl mx-auto px-5 md:px-10 py-5 md:py-8 min-h-0"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="shrink-0 pr-14">
          <div className="flex items-baseline gap-3 flex-wrap">
            <span className="text-3xl md:text-4xl font-black tracking-tight bg-gradient-to-r from-[#ffb4a0] to-[#f15a65] bg-clip-text text-transparent">
              {stat.prefix}{stat.format(stat.value)}{stat.suffix}
            </span>
            <span className="text-base md:text-lg text-white/85 font-medium">{stat.label}</span>
          </div>
          <div className="text-[13px] text-white/55 mt-1 max-w-2xl leading-relaxed">{stat.detail}</div>
        </div>

        {/* Tabs — prominent, above image when multiple screenshots */}
        {images.length > 1 && (
          <div className="shrink-0 flex items-center gap-2 mt-4 border-b border-white/10">
            {images.map((im, i) => (
              <button
                key={i}
                onClick={(e) => { e.stopPropagation(); setIdx(i) }}
                className={`relative px-4 md:px-5 py-2.5 text-sm font-medium tracking-wide transition-colors ${
                  i === idx ? 'text-white' : 'text-white/45 hover:text-white/80'
                }`}
                style={{ cursor: 'pointer' }}
              >
                <span className="flex items-center gap-2">
                  {i === idx && <span className="w-1.5 h-1.5 rounded-full bg-[#f15a65] animate-pulse" />}
                  {im.tab}
                </span>
                {i === idx && (
                  <motion.div
                    layoutId="tabActiveIndicator"
                    className="absolute inset-x-0 -bottom-px h-0.5 bg-gradient-to-r from-[#ffb4a0] to-[#f15a65]"
                    transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                  />
                )}
              </button>
            ))}
            <div className="ml-auto text-[10px] font-mono tracking-[0.25em] text-white/30 uppercase hidden md:block">
              ← → to switch
            </div>
          </div>
        )}

        {/* Image — takes remaining space, properly constrained */}
        <div className="flex-1 min-h-0 flex items-center justify-center mt-4">
          <div className="relative rounded-xl overflow-hidden border border-white/10 bg-black shadow-[0_30px_80px_rgba(0,0,0,0.6)] max-h-full">
            <motion.img
              key={img.src}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
              src={img.src}
              alt={img.caption}
              className="block max-w-full max-h-full object-contain"
              style={{ maxHeight: 'calc(100vh - 260px)' }}
            />
          </div>
        </div>

        {/* Caption + source footer */}
        <div className="shrink-0 mt-4 flex items-center justify-between gap-4">
          <div className="min-w-0">
            <div className="text-[13px] text-white/80 leading-relaxed">{img.caption}</div>
            <div className="text-[10px] font-mono tracking-[0.25em] text-[#f15a65] uppercase mt-1">
              · {img.source}
            </div>
          </div>
          <div className="hidden md:block text-[10px] font-mono tracking-[0.25em] text-white/30 uppercase shrink-0">
            <span className="text-white/60">ESC</span> to close
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}

function StatsBar() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6, delay: 2 }}
      className="w-full max-w-5xl mx-auto"
    >
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5">
        {STATS_DATA.map((s, i) => <StatCard key={i} stat={s} index={i} />)}
      </div>
    </motion.div>
  )
}

/* ── Categorized bilingual marquee row ── */
function CategoryMarquee({
  tags,
  reverse = false,
  speed = 55,
  labelEn,
  labelZh,
}: {
  tags: { en: string; zh: string }[]
  reverse?: boolean
  speed?: number
  labelEn: string
  labelZh: string
}) {
  const items = [...tags, ...tags]
  return (
    <div className="relative flex items-center select-none">
      {/* Sticky category label on left */}
      <div className="relative z-20 shrink-0 pl-6 pr-4 py-1.5 flex items-center gap-2 bg-gradient-to-r from-[#050505] via-[#050505] to-transparent">
        <span className="w-1 h-1 rounded-full bg-[#f15a65]" />
        <div className="flex flex-col leading-tight">
          <span className="text-[10px] font-mono tracking-[0.25em] text-[#f15a65] font-bold uppercase">
            {labelEn}
          </span>
          <span className="text-[9px] text-white/40 tracking-wider">{labelZh}</span>
        </div>
        <span className="ml-2 text-white/20 text-xs">|</span>
      </div>

      {/* Scrolling tags */}
      <div className="overflow-hidden flex-1">
        <motion.div
          className="flex gap-8 whitespace-nowrap"
          animate={{ x: reverse ? ['-50%', '0%'] : ['0%', '-50%'] }}
          transition={{ duration: speed, ease: 'linear', repeat: Infinity }}
        >
          {items.map((t, i) => (
            <span key={i} className="inline-flex items-center gap-2.5 shrink-0">
              <span className="text-[12px] font-mono tracking-[0.2em] text-white/75 font-semibold uppercase">
                {t.en}
              </span>
              <span className="text-[11px] text-white/35 tracking-wider">{t.zh}</span>
              <span className="w-1 h-1 rounded-full bg-[#f15a65]/50 ml-3" />
            </span>
          ))}
        </motion.div>
      </div>
    </div>
  )
}

/* ── Film grain overlay ── */
function FilmGrain() {
  return (
    <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-[0.12] mix-blend-overlay" aria-hidden>
      <filter id="gf">
        <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" stitchTiles="stitch" />
        <feColorMatrix values="0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  0 0 0 0.5 0" />
      </filter>
      <rect width="100%" height="100%" filter="url(#gf)" />
    </svg>
  )
}

/* ── Spacing defaults (in px) ── */
const DEFAULT_SPACING = {
  mainPyTop: 0,
  mainPyBottom: 85,
  taglineToGu: 12,
  guToSub: 53,
  subToCTA: 34,
  ctaToStats: 32,
  statsToMarquee: 8,
  marqueePy: 6,
  marqueeRowGap: 3,
}
type Spacing = typeof DEFAULT_SPACING

const SPACING_META: Array<{ key: keyof Spacing; label: string; max: number }> = [
  { key: 'mainPyTop',      label: '主内容 顶部 padding',  max: 120 },
  { key: 'taglineToGu',    label: '得到X → 顾得',         max: 120 },
  { key: 'guToSub',        label: '顾得 → 副标题',         max: 120 },
  { key: 'subToCTA',       label: '副标题 → 按钮',         max: 120 },
  { key: 'ctaToStats',     label: '按钮 → 数据卡片',      max: 120 },
  { key: 'statsToMarquee', label: '数据卡片 → Marquee',   max: 120 },
  { key: 'marqueePy',      label: 'Marquee 内边距',          max: 60  },
  { key: 'marqueeRowGap',  label: 'Marquee 行间距',          max: 40  },
  { key: 'mainPyBottom',   label: '主内容 底部 padding',  max: 120 },
]

function SpacingPanel({ spacing, setSpacing }: { spacing: Spacing; setSpacing: React.Dispatch<React.SetStateAction<Spacing>> }) {
  const [open, setOpen] = useState(true)
  const [copied, setCopied] = useState(false)

  const copyValues = async () => {
    const text = Object.entries(spacing).map(([k, v]) => `  ${k}: ${v}`).join(',\n')
    try {
      await navigator.clipboard.writeText(`{\n${text}\n}`)
      setCopied(true)
      setTimeout(() => setCopied(false), 1500)
    } catch {}
  }
  const reset = () => setSpacing(DEFAULT_SPACING)

  return (
    <div
      className="fixed top-4 right-4 z-[200] font-sans"
      style={{ cursor: 'auto' }}
    >
      <div className="rounded-lg border border-white/15 bg-black/85 backdrop-blur-xl shadow-[0_20px_60px_rgba(0,0,0,0.6)] overflow-hidden">
        {/* Header */}
        <button
          onClick={() => setOpen((v) => !v)}
          className="w-full flex items-center justify-between gap-4 px-3.5 py-2.5 text-left hover:bg-white/5 transition-colors"
        >
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-[#f15a65] animate-pulse" />
            <span className="text-[11px] font-mono tracking-[0.2em] text-white/80 uppercase">间距调试面板</span>
          </div>
          <span className="text-white/50 text-sm">{open ? '–' : '+'}</span>
        </button>

        {open && (
          <div className="px-3.5 pb-3.5 pt-1 w-[300px] space-y-2.5 border-t border-white/10">
            {SPACING_META.map(({ key, label, max }) => (
              <div key={key} className="space-y-1">
                <div className="flex items-baseline justify-between text-[11px]">
                  <span className="text-white/70">{label}</span>
                  <span className="font-mono text-[#ffb4a0] tabular-nums">{spacing[key]}px</span>
                </div>
                <input
                  type="range"
                  min={0}
                  max={max}
                  step={1}
                  value={spacing[key]}
                  onChange={(e) => setSpacing((s) => ({ ...s, [key]: Number(e.target.value) }))}
                  className="w-full accent-[#f15a65] cursor-pointer"
                />
              </div>
            ))}

            <div className="flex gap-2 pt-2">
              <button
                onClick={copyValues}
                className="flex-1 text-[11px] font-mono tracking-wider px-3 py-1.5 rounded bg-[#f15a65] hover:bg-[#f15a65]/90 text-white transition-colors"
              >
                {copied ? '✓ 已复制' : '复制当前值'}
              </button>
              <button
                onClick={reset}
                className="flex-1 text-[11px] font-mono tracking-wider px-3 py-1.5 rounded bg-white/5 hover:bg-white/10 border border-white/10 text-white/70 transition-colors"
              >
                重置
              </button>
            </div>
            <div className="text-[10px] text-white/35 font-mono tracking-wider text-center pt-1">
              调整后将值发给我，我会写回代码
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

/* ─── Main ─── */
export default function HeroFinal() {
  const [hover, setHover] = useState(false)
  const [spacing, setSpacing] = useState<Spacing>(DEFAULT_SPACING)
  const [contactOpen, setContactOpen] = useState(false)

  return (
    <section className="relative h-screen bg-[#050505] text-gray-100 overflow-hidden flex flex-col [@media(hover:hover)_and_(pointer:fine)]:[cursor:none]">
      <HeroBackground />
      <FilmGrain />
      {/* Scan lines */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.03]"
        style={{ backgroundImage: 'repeating-linear-gradient(0deg, rgba(255,255,255,1) 0 1px, transparent 1px 3px)' }}
      />
      <CustomCursor hovering={hover} />

      {/* Main content — whole block (including marquee) centered vertically as one unit */}
      <div
        className="relative flex-1 flex flex-col justify-center z-10"
        style={{ paddingTop: spacing.mainPyTop, paddingBottom: spacing.mainPyBottom }}
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
      >
        <div className="flex flex-col items-center px-6">
          {/* Top tagline */}
          <DeliveryRow />

          {/* Center: 顾得 */}
          <div style={{ marginTop: spacing.taglineToGu }}>
            <GuDeCentered />
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.7 }}
            style={{ marginTop: spacing.guToSub }}
            className="text-[13px] md:text-[14px] text-white/65 max-w-2xl text-center leading-[1.65] font-light space-y-1"
          >
            <p>海外市场增长，专注 SEO 与 GEO，让品牌同时出现在 Google 搜索和 AI 回答里。</p>
            <p className="text-white/50">时代在变，搜索在变。我让我们的品牌，在每一个入口都被看见。</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.2 }}
            style={{ marginTop: spacing.subToCTA }}
            className="flex gap-4"
          >
            <Magnetic>
              <button
                type="button"
                onClick={() => setContactOpen(true)}
                className="inline-flex items-center gap-2 bg-[#f15a65] text-white px-5 py-2.5 rounded-full text-sm font-medium shadow-[0_0_30px_rgba(241,90,101,0.4)] hover:shadow-[0_0_40px_rgba(241,90,101,0.55)] transition-shadow cursor-pointer"
              >
                联系我 →
              </button>
            </Magnetic>
            <Magnetic>
              <Link
                href="/blog/goeast-mandarin-case-study"
                className="inline-flex items-center gap-2 border border-white/15 text-gray-200 px-5 py-2.5 rounded-full text-sm font-medium backdrop-blur-md bg-white/[0.03] hover:border-[#f15a65]/40 hover:text-white hover:bg-white/[0.06] transition-colors"
              >
                了解我
              </Link>
            </Magnetic>
          </motion.div>

          {/* Interactive stats bar */}
          <div className="w-full" style={{ marginTop: spacing.ctaToStats }}>
            <StatsBar />
          </div>
        </div>

        {/* Two categorized marquee rows */}
        <div
          className="relative border-t border-white/5 flex flex-col"
          style={{
            marginTop: spacing.statsToMarquee,
            paddingTop: spacing.marqueePy,
            paddingBottom: spacing.marqueePy,
            rowGap: spacing.marqueeRowGap,
          }}
        >
          <CategoryMarquee tags={TOOLS} reverse={false} speed={55} labelEn="TOOLS" labelZh="工具栈" />
          <CategoryMarquee tags={METHODS} reverse={true} speed={75} labelEn="METHODS" labelZh="方法论" />
        </div>
      </div>

      <ContactModal open={contactOpen} onClose={() => setContactOpen(false)} />
    </section>
  )
}
