'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import type { Post } from '@/lib/posts'

const fadeUp = {
  hidden: { opacity: 0, y: 32 },
  show: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, delay: i * 0.12, ease: [0.22, 1, 0.36, 1] },
  }),
}

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
      <section className="relative min-h-screen flex items-center justify-center px-6">
        {/* Background grid */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage:
              'linear-gradient(#f15a65 1px, transparent 1px), linear-gradient(90deg, #f15a65 1px, transparent 1px)',
            backgroundSize: '60px 60px',
          }}
        />
        {/* Glow */}
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-[#f15a65]/10 rounded-full blur-[120px] pointer-events-none" />

        <div className="relative max-w-4xl w-full">
          <motion.div
            custom={0}
            variants={fadeUp}
            initial="hidden"
            animate="show"
            className="text-sm font-mono text-[#f15a65] mb-4 tracking-widest uppercase"
          >
            Shanghai · Digital Marketing
          </motion.div>

          <motion.h1
            custom={1}
            variants={fadeUp}
            initial="hidden"
            animate="show"
            className="text-7xl md:text-9xl font-bold tracking-tight mb-6 leading-none"
          >
            顾<span className="text-[#f15a65]">得</span>
          </motion.h1>

          <motion.p
            custom={2}
            variants={fadeUp}
            initial="hidden"
            animate="show"
            className="text-xl md:text-2xl text-gray-300 mb-4 font-light"
          >
            SEO &amp; GEO Specialist
          </motion.p>

          <motion.p
            custom={3}
            variants={fadeUp}
            initial="hidden"
            animate="show"
            className="text-base text-gray-500 max-w-xl mb-12 leading-relaxed"
          >
            专注于搜索引擎优化与 AI 生成引擎优化，帮助品牌在搜索结果与 AI 回答中占据第一位。
            6 年实战经验，多个自然流量增长 300% 的案例。
          </motion.p>

          <motion.div
            custom={4}
            variants={fadeUp}
            initial="hidden"
            animate="show"
            className="flex flex-wrap gap-4"
          >
            <Link
              href="/blog"
              className="inline-flex items-center gap-2 bg-[#f15a65] text-white px-6 py-3 rounded-full font-medium hover:bg-[#e04a55] transition-colors"
            >
              阅读文章 →
            </Link>
            <a
              href="mailto:gu@gujianjun.net"
              className="inline-flex items-center gap-2 border border-gray-700 text-gray-300 px-6 py-3 rounded-full font-medium hover:border-[#f15a65] hover:text-[#f15a65] transition-colors"
            >
              联系我
            </a>
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-gray-600 text-xs"
        >
          <span>向下滚动</span>
          <motion.div
            animate={{ y: [0, 6, 0] }}
            transition={{ repeat: Infinity, duration: 1.5 }}
            className="w-px h-8 bg-gradient-to-b from-gray-600 to-transparent"
          />
        </motion.div>
      </section>

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
            href="mailto:gu@gujianjun.net"
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
