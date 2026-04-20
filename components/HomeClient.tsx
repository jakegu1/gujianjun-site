'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { useState } from 'react'
import type { Post } from '@/lib/posts'
import HeroFinal from './hero/HeroFinal'
import ContactModal from './ContactModal'

const capabilities: {
  title: string
  en: string
  desc: string
  tags: string[]
}[] = [
  {
    title: 'SEO / GEO',
    en: 'Search & AI Visibility',
    desc: '从 Technical SEO 到 Generative Engine Optimization——不仅优化 Google 排名，也优化内容在 ChatGPT、Perplexity、AI Overviews 里被引用的概率。',
    tags: [
      'Technical SEO',
      '信息架构',
      'Schema / JSON-LD',
      'RAG 内容工程',
      'Reranker 优化',
      '向量检索',
      'AI 引用率',
      '外链建设',
    ],
  },
  {
    title: 'Paid Acquisition',
    en: 'Google Ads & Lead Gen',
    desc: '从 campaign 结构、转化追踪到 landing page 优化，完整闭环管理 B2B 询盘和 B2C 课程报名投放，focus 在 lead quality 而不是 volume。',
    tags: [
      'Google Ads',
      'Facebook / LinkedIn',
      '转化追踪',
      'Landing Page 优化',
      'Lead Quality 诊断',
      'B2B 询盘',
      'B2C 报名',
    ],
  },
  {
    title: 'Data & Analytics',
    en: 'Measurement & Attribution',
    desc: 'GA4 + GTM + Search Console + Looker Studio 的完整数据链路搭建。把散在各处的数据做成一个每天准时跑、业务团队真的看得懂的仪表盘。',
    tags: ['GA4', 'GTM', 'Search Console', 'Ahrefs', 'Semrush', 'Looker Studio', '归因分析', 'Apps Script'],
  },
  {
    title: 'MarTech & CRM',
    en: 'Infrastructure & Automation',
    desc: '把 CMS、CRM、邮件营销、表单系统和自动化工作流连成一条可靠的链路——不是"看起来能用"，是"每天准时跑、出问题能报警"。',
    tags: ['Salesforce', 'Brevo', 'Zapier', 'Contact Form 7', 'Acuity', 'WordPress mu-plugin', 'Webhook 告警'],
  },
  {
    title: 'Development',
    en: 'Full-stack for Marketing',
    desc: '不是专职开发，但能独立把工具和系统搭起来。从 WordPress / PHP 插件到 Next.js 个人站、Python 脚本，都是为增长目标服务的。',
    tags: ['WordPress / PHP', 'Next.js / Vercel', 'React', 'HTML / CSS / JS', 'Python', 'Google Apps Script'],
  },
  {
    title: 'AI & Automation',
    en: 'LLM-powered Workflows',
    desc: 'Claude API + DeepSeek + Feishu 集成的 OpenClaw 内容自动化 pipeline，实现规模化 AI 辅助内容生产。Prompt Engineering 用在真实生产环境里。',
    tags: ['Claude API', 'DeepSeek', 'Prompt Engineering', 'OpenClaw Pipeline', 'AI 内容工作流'],
  },
]

const experiences: {
  year: string
  role: string
  company: string
  location: string
  highlights: string[]
}[] = [
  {
    year: '2023.05 – 2026.05',
    role: 'Digital Marketing & Technology Lead',
    company: 'GoEast Mandarin',
    location: '上海 · 在线中文教育',
    highlights: [
      '独立负责 SEO / GEO、Google Ads、数据分析（GA4 / GTM）、CRM（Salesforce / Brevo）及 WordPress 开发全链路',
      '主导 SEO 信息架构重构与关键词体系搭建，推动自然搜索月点击从 10K 增长至 28K（+180%），65 个核心关键词进入 Google 前 10',
      '建立 GEO 策略体系：深入研究 RAG、向量检索、Reranker 等 AI 搜索底层机制，实现 AI 引荐流量从 0 到 2,000+/月',
      '搭建 60 篇 GEO 系列内容矩阵（11 Pillar Topic、~199K 字），从"什么是 GEO"到"Reranker 精排机制"',
      '管理 Google Ads 账户：Kids Chinese Camp 搜索广告重组、转化追踪修复、自动化报表与七维度数据看板',
      '构建 MarTech 基础设施：CF7 表单自动化、双发件人邮件路由、Salesforce / Brevo 集成、Zapier 工作流',
      '开发 WordPress mu-plugin 体系：CF7 表单健康检查器（WP-Cron + Lark Webhook 告警）、phpmailer 路由插件',
      '部署 OpenClaw 内容自动化管道（Claude API + DeepSeek + Feishu），实现规模化 AI 辅助内容生产',
    ],
  },
  {
    year: '2021.11 – 2022.12',
    role: '海外市场负责人',
    company: '包装制品有限公司',
    location: '上海 · B2B 包装行业',
    highlights: [
      '统筹公司海外数字营销全局：Google Ads、SEO、Facebook、LinkedIn 多渠道投放与预算分配',
      'SEO 体系从 0 到 1 搭建：关键词规划、站内优化、内容产出、外链建设，3 个月将新站自然流量从 0 增长至 3,000/月',
      '通过 Google Ads 竞价推广，月均获取询盘 300+，首年成交额超 100 万元',
      '优化广告渠道组合，淘汰低 ROI 渠道，实现投入产出比最大化',
    ],
  },
  {
    year: '2019.04 – 2021.11',
    role: '跨境电商运营',
    company: '机械行业外贸 B2B',
    location: '上海 · 多平台运营',
    highlights: [
      '负责 Google 独立站、阿里国际站、Shopify 店铺日常运营及广告投放（Google / Facebook / Snapchat Ads）',
      'Google 独立站首年销售额突破 100 万元',
      '机械行业阿里国际站运营至行业 Top 10',
      '环保行业新阿里国际站从零搭建（域名 → 建站 → 详情页 → 推广），4 个月询盘量突破 100 条/月',
    ],
  },
  {
    year: '2017.09 – 2018.12',
    role: '英语教师',
    company: '华尔街英语培训中心（上海）',
    location: '上海 · 成人英语教育',
    highlights: [
      '负责学员课程管理、外教课程排班及学习督导',
      '接待意向客户并协调课程顾问跟进，积累教育行业及客户沟通经验',
    ],
  },
]

const certifications = [
  '英语专业八级 (TEM-8)',
  '中学英语教师资格证',
  'Google 搜索广告认证',
  'Google 展示广告认证',
]

export default function HomeClient({ posts }: { posts: Post[] }) {
  const [contactOpen, setContactOpen] = useState(false)

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-gray-100 overflow-x-hidden">
      {/* ── Hero ── */}
      <HeroFinal />

      {/* ── Expertise (capability groups, no fake percentages) ── */}
      <section className="py-24 px-6 border-t border-gray-900">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mb-12"
          >
            <span className="text-xs font-mono text-[#f15a65] tracking-widest uppercase">
              Expertise
            </span>
            <h2 className="text-3xl md:text-4xl font-bold mt-2">专业能力</h2>
            <p className="text-gray-500 text-sm mt-3 max-w-2xl">
              7 年数字营销实战，从 B2B 外贸独立站到在线教育 B2C——完整经历过从 0 到 1 搭建搜索增长体系、付费投放、MarTech 基础设施和 AI 内容自动化。
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-4">
            {capabilities.map((cap, i) => (
              <motion.div
                key={cap.title}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.06 }}
                className="rounded-xl border border-white/[0.06] bg-white/[0.015] p-6 hover:border-[#f15a65]/30 hover:bg-white/[0.03] transition-colors"
              >
                <div className="flex items-baseline justify-between mb-3">
                  <h3 className="text-lg font-semibold text-white">{cap.title}</h3>
                  <span className="text-[10px] font-mono text-gray-500 tracking-widest uppercase">
                    {cap.en}
                  </span>
                </div>
                <p className="text-[13px] text-gray-400 leading-relaxed mb-4">{cap.desc}</p>
                <div className="flex flex-wrap gap-1.5">
                  {cap.tags.map((t) => (
                    <span
                      key={t}
                      className="text-[11px] text-gray-300 bg-white/[0.04] border border-white/[0.06] px-2 py-0.5 rounded"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>

          {/* Certifications */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="mt-8 flex flex-wrap items-center gap-3 text-xs text-gray-500"
          >
            <span className="text-[10px] font-mono tracking-widest uppercase text-gray-600">
              Certifications
            </span>
            {certifications.map((c) => (
              <span
                key={c}
                className="text-xs text-gray-400 bg-white/[0.03] border border-white/[0.06] px-2.5 py-1 rounded"
              >
                {c}
              </span>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── Experience (real resume) ── */}
      <section className="py-24 px-6 border-t border-gray-900">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mb-12"
          >
            <span className="text-xs font-mono text-[#f15a65] tracking-widest uppercase">
              Career
            </span>
            <h2 className="text-3xl md:text-4xl font-bold mt-2">工作经历</h2>
            <p className="text-gray-500 text-sm mt-3">
              从跨境电商到在线教育 — 三段独立负责增长与技术的完整经历
            </p>
          </motion.div>

          <div className="relative">
            <div className="absolute left-0 top-3 bottom-3 w-px bg-gradient-to-b from-[#f15a65]/40 via-gray-800 to-transparent" />
            <div className="space-y-12 pl-8">
              {experiences.map((exp, i) => (
                <motion.div
                  key={`${exp.company}-${exp.year}`}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.08 }}
                  className="relative"
                >
                  <div className="absolute -left-[34px] top-2 w-3 h-3 rounded-full bg-[#f15a65] border-2 border-[#0a0a0a] shadow-[0_0_12px_rgba(241,90,101,0.6)]" />

                  <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1 mb-1">
                    <span className="text-xs font-mono text-[#f15a65] tracking-wide">{exp.year}</span>
                    <span className="text-[11px] text-gray-600">·</span>
                    <span className="text-xs text-gray-500">{exp.location}</span>
                  </div>

                  <h3 className="text-xl font-semibold text-white leading-tight">
                    {exp.role}
                  </h3>
                  <p className="text-sm text-gray-400 mt-0.5 mb-4">
                    <span className="text-gray-300">{exp.company}</span>
                  </p>

                  <ul className="space-y-2">
                    {exp.highlights.map((h, j) => (
                      <li
                        key={j}
                        className="text-[14px] text-gray-400 leading-relaxed pl-4 relative before:content-[''] before:absolute before:left-0 before:top-[0.6em] before:w-1 before:h-1 before:rounded-full before:bg-[#f15a65]/60"
                      >
                        {h}
                      </li>
                    ))}
                  </ul>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Featured Case Study ── */}
      <section className="py-24 px-6 border-t border-gray-900 relative overflow-hidden">
        {/* ambient glow */}
        <div
          className="absolute inset-0 pointer-events-none opacity-60"
          style={{
            background:
              'radial-gradient(ellipse at 20% 50%, rgba(241,90,101,0.08) 0%, transparent 50%), radial-gradient(ellipse at 80% 50%, rgba(90,127,241,0.05) 0%, transparent 50%)',
          }}
        />
        <div className="relative max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mb-10"
          >
            <span className="text-xs font-mono text-[#f15a65] tracking-widest uppercase">
              Featured Case Study
            </span>
            <h2 className="text-3xl md:text-4xl font-bold mt-2">在 GoEast 的三年</h2>
            <p className="text-gray-500 text-sm mt-2">
              一个人，从零搭建一套完整的数字营销体系
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          >
            <Link
              href="/blog/goeast-mandarin-case-study"
              className="group block rounded-2xl border border-white/[0.08] bg-gradient-to-br from-white/[0.03] to-white/[0.01] backdrop-blur-sm p-8 md:p-10 hover:border-[#f15a65]/40 hover:from-[#f15a65]/[0.06] hover:to-white/[0.02] transition-all duration-500"
            >
              <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
                {/* Left: narrative */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-4">
                    <span className="inline-flex items-center gap-1.5 text-[11px] font-mono text-[#f15a65]/90 tracking-widest uppercase border border-[#f15a65]/25 rounded-full px-3 py-1 bg-[#f15a65]/[0.06]">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#f15a65] animate-pulse" />
                      2023 – 2026
                    </span>
                    <span className="text-xs text-gray-500">GoEast Mandarin</span>
                  </div>

                  <h3 className="text-2xl md:text-3xl font-bold text-white leading-tight mb-4 group-hover:text-[#ff8a65] transition-colors">
                    从零搭建一套数字营销体系
                  </h3>

                  <p className="text-[15px] text-gray-400 leading-relaxed mb-6">
                    独立负责 SEO、GEO、Google Ads 和整套 MarTech 基础设施。
                    没有团队、没有前任文档——三年里我把它做成了一个真正可靠的系统。
                    这篇不只是成果汇报，更是对这段经历的真实回顾：学到了什么、搞砸过什么、以及为什么它是我职业生涯里最重要的阶段。
                  </p>

                  <div className="flex flex-wrap gap-2 mb-6">
                    {['SEO', 'GEO', 'Google Ads', 'MarTech', 'Lead Gen'].map((t) => (
                      <span
                        key={t}
                        className="text-xs text-gray-400 bg-white/[0.04] border border-white/[0.06] px-2.5 py-1 rounded"
                      >
                        {t}
                      </span>
                    ))}
                  </div>

                  <span className="inline-flex items-center gap-2 text-[#f15a65] font-medium text-sm group-hover:gap-3 transition-all">
                    阅读完整 Case Study
                    <span className="transition-transform group-hover:translate-x-1">→</span>
                  </span>
                </div>

                {/* Right: metrics */}
                <div className="lg:w-72 shrink-0 grid grid-cols-2 gap-4 content-start">
                  {[
                    { v: '3×', l: '自然点击增长', s: '10K → 30K+' },
                    { v: '65', l: '关键词 Top 10', s: 'Google SERP' },
                    { v: '60', l: 'GEO 文章矩阵', s: '~199K 词' },
                    { v: '$5', l: '成人课 CPL', s: 'Google Ads' },
                  ].map((m, i) => (
                    <motion.div
                      key={m.l}
                      initial={{ opacity: 0, scale: 0.9 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.5, delay: 0.2 + i * 0.08 }}
                      className="rounded-lg border border-white/[0.06] bg-white/[0.02] p-4 group-hover:border-[#f15a65]/20 transition-colors"
                    >
                      <div className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-[#f15a65] to-[#ff8a65] bg-clip-text text-transparent leading-none mb-1.5">
                        {m.v}
                      </div>
                      <div className="text-[11px] text-gray-300 font-medium leading-tight">
                        {m.l}
                      </div>
                      <div className="text-[10px] text-gray-600 font-mono mt-0.5">
                        {m.s}
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* ── Featured Articles ── */}
      <section className="py-24 px-6 border-t border-gray-900">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="flex items-end justify-between mb-12"
          >
            <div>
              <span className="text-xs font-mono text-[#f15a65] tracking-widest uppercase">
                Writing
              </span>
              <h2 className="text-3xl font-bold mt-2">近期文章</h2>
            </div>
            <Link
              href="/blog"
              className="text-sm text-gray-400 hover:text-[#f15a65] transition-colors"
            >
              全部文章 →
            </Link>
          </motion.div>

          {posts.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="text-center py-16 text-gray-600"
            >
              <p className="text-lg mb-2">文章即将发布</p>
              <p className="text-sm">正在撰写 SEO &amp; GEO 深度内容，敬请期待</p>
            </motion.div>
          ) : (
            <div className="space-y-1">
              {posts.map((post, i) => (
                <motion.div
                  key={post.slug}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                >
                  <Link
                    href={post.href ?? `/blog/${post.slug}`}
                    className="group flex items-center gap-6 py-5 border-b border-gray-900 hover:border-gray-700 transition-colors"
                  >
                    <span className="text-xs font-mono text-gray-600 w-24 shrink-0">
                      {post.date}
                    </span>
                    <h3 className="flex-1 text-gray-300 group-hover:text-white transition-colors">
                      {post.title}
                    </h3>
                    <div className="hidden sm:flex gap-2 shrink-0">
                      {post.tags.slice(0, 2).map((tag) => (
                        <span
                          key={tag}
                          className="text-xs bg-gray-900 text-gray-500 px-2 py-0.5 rounded"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                    <span className="text-[#f15a65] opacity-0 group-hover:opacity-100 transition-opacity text-lg">
                      →
                    </span>
                  </Link>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="py-24 px-6 border-t border-gray-900 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="max-w-2xl mx-auto"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4 leading-tight">
            想让你的网站出现在
            <span className="text-[#f15a65]"> 搜索结果</span>
            和
            <span className="text-[#f15a65]"> AI 推荐</span>
            里？
          </h2>
          <p className="text-gray-500 mb-8">
            无论是 SEO 咨询、GEO 策略还是内容规划，欢迎联系探讨。
          </p>
          <button
            type="button"
            onClick={() => setContactOpen(true)}
            className="inline-flex items-center gap-2 bg-[#f15a65] text-white px-8 py-4 rounded-full font-medium text-lg shadow-[0_0_30px_rgba(241,90,101,0.35)] hover:bg-[#e04a55] hover:shadow-[0_0_40px_rgba(241,90,101,0.5)] transition-all cursor-pointer"
          >
            联系我 →
          </button>
          <p className="mt-4 text-xs text-gray-600">
            微信 / 手机 · 邮箱 都可
          </p>
        </motion.div>
        <p className="mt-16 text-xs text-gray-700">
          © {new Date().getFullYear()} 顾得 · gujianjun.net
        </p>
      </section>

      <ContactModal open={contactOpen} onClose={() => setContactOpen(false)} />
    </div>
  )
}
