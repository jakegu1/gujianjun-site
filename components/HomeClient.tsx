'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import type { Post } from '@/lib/posts'
import HeroFinal from './hero/HeroFinal'

const skills = [
  { name: 'SEO 搜索引擎优化', level: 95 },
  { name: 'GEO / AI 搜索优化', level: 88 },
  { name: '内容营销策略', level: 90 },
  { name: '数据分析与归因', level: 82 },
  { name: '增长黑客', level: 78 },
  { name: 'Technical SEO', level: 85 },
]

const experiences = [
  { year: '2023–至今', role: 'SEO & GEO Lead', company: '某知名互联网公司' },
  { year: '2021–2023', role: 'Digital Marketing Manager', company: '数字营销代理商' },
  { year: '2019–2021', role: 'SEO Specialist', company: '电商平台' },
]

export default function HomeClient({ posts }: { posts: Post[] }) {
  return (
    <div className="min-h-screen bg-[#0a0a0a] text-gray-100 overflow-x-hidden">
      {/* ── Hero ── */}
      <HeroFinal />

      {/* ── Skills ── */}
      <section className="py-24 px-6 border-t border-gray-900">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <span className="text-xs font-mono text-[#f15a65] tracking-widest uppercase">
              Expertise
            </span>
            <h2 className="text-3xl font-bold mt-2 mb-12">核心技能</h2>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8">
            {skills.map((skill, i) => (
              <motion.div
                key={skill.name}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.08 }}
              >
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-gray-300">{skill.name}</span>
                  <span className="text-[#f15a65] font-mono">{skill.level}%</span>
                </div>
                <div className="h-1 bg-gray-800 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    whileInView={{ width: `${skill.level}%` }}
                    viewport={{ once: true }}
                    transition={{ duration: 1, delay: i * 0.1, ease: 'easeOut' }}
                    className="h-full bg-gradient-to-r from-[#f15a65] to-[#ff8a65] rounded-full"
                  />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Experience ── */}
      <section className="py-24 px-6 border-t border-gray-900">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <span className="text-xs font-mono text-[#f15a65] tracking-widest uppercase">
              Career
            </span>
            <h2 className="text-3xl font-bold mt-2 mb-12">工作经历</h2>
          </motion.div>

          <div className="relative">
            <div className="absolute left-0 top-2 bottom-2 w-px bg-gray-800" />
            <div className="space-y-10 pl-8">
              {experiences.map((exp, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                  className="relative"
                >
                  <div className="absolute -left-8 top-1.5 w-3 h-3 rounded-full bg-[#f15a65] border-2 border-[#0a0a0a]" />
                  <span className="text-xs font-mono text-[#f15a65] mb-1 block">{exp.year}</span>
                  <h3 className="text-lg font-semibold text-white">{exp.role}</h3>
                  <p className="text-gray-500 text-sm mt-1">{exp.company}</p>
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
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            想让你的网站出现在<span className="text-[#f15a65]"> AI 推荐</span>里？
          </h2>
          <p className="text-gray-500 mb-8">
            无论是 SEO 咨询、GEO 策略还是内容规划，欢迎联系探讨。
          </p>
          <a
            href="mailto:jake.gu@foxmail.com"
            className="inline-flex items-center gap-2 bg-[#f15a65] text-white px-8 py-4 rounded-full font-medium text-lg hover:bg-[#e04a55] transition-colors"
          >
            发邮件给我 →
          </a>
        </motion.div>
        <p className="mt-16 text-xs text-gray-700">
          © {new Date().getFullYear()} 顾得 · gujianjun.net
        </p>
      </section>
    </div>
  )
}
