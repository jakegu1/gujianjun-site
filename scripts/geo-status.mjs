#!/usr/bin/env node
/**
 * GEO series status — generated from geo/geo_agent_config.json + content/geo/.
 *
 *   node scripts/geo-status.mjs                # written / unwritten per phase + pillar, broken links
 *   node scripts/geo-status.mjs --posts        # also list content/posts grouped by tag
 *   node scripts/geo-status.mjs --backfill X   # published articles whose config links include slug X but body lacks it
 *   node scripts/geo-status.mjs --json         # machine-readable
 *
 * Never trust memory for this list — run the script. The markdown twin is docs/STATUS.md (scripts/owner.mjs).
 */
import { computeStatus, backfillCandidates, today } from './geo-lib.mjs'

const argv = process.argv.slice(2)
const asJson = argv.includes('--json')
const showPosts = argv.includes('--posts')
const bfIdx = argv.indexOf('--backfill')
const backfillSlug = bfIdx >= 0 ? argv[bfIdx + 1] : null

const s = computeStatus()
const backfill = backfillSlug ? backfillCandidates(s, backfillSlug) : null

if (asJson) {
  const { config, written, byId, bySlug, writtenIds, ...rest } = s
  console.log(JSON.stringify({ date: today(), ...rest, writtenIds: [...writtenIds], backfill }, null, 2))
  process.exit(0)
}

const line = (t = '') => console.log(t)
line(`GEO 系列进度 · ${today()}`)
line(`已写 ${s.totals.written} / ${s.totals.planned}，未写 ${s.totals.unwritten}`)
line()
for (const p of s.phases) {
  line(`${p.name.replace('_', ' ').toUpperCase()} · ${p.description} — 已写 ${p.written.length} / ${p.total}，未写 ${p.unwritten.length}`)
  line(`  已写：${p.written.join(' ') || '（无）'}`)
  for (const a of p.unwritten) {
    line(`  ☐ ${a.id.padEnd(6)} ${a.pillar.padEnd(14)} ${String(a.target_words).padStart(5)}  ${a.slug.padEnd(38)} ${a.title}`)
  }
  line()
}
line('按支柱：' + s.pillars.map((p) => `${p.name} ${p.written.length}/${p.total}`).join(' · '))
line('发布节奏：' + (s.timeline.map(([m, n]) => `${m} ${n} 篇`).join(' · ') || '无'))
line()

const c = s.consistency
line('一致性：')
line(`  frontmatter 解析失败：${c.parseErrors.length ? c.parseErrors.map((w) => `${w.slug} (${w.error})`).join(', ') : '无'}`)
line(`  articleId 不在 config：${c.notInConfig.length ? c.notInConfig.map((w) => `${w.slug} (${w.articleId || '空'})`).join(', ') : '无'}`)
line(`  slug 与 config 不一致：${c.slugMismatch.length ? c.slugMismatch.map((w) => `${w.id}: ${w.slug} ≠ ${w.expected}`).join(', ') : '无'}`)
line(`  pillar 与 config 不一致：${c.pillarMismatch.length ? c.pillarMismatch.map((w) => `${w.id}: ${w.pillar} ≠ ${w.expected}`).join(', ') : '无'}`)
const multiFence = s.words.filter((x) => x.jsonFences !== 1)
line(`  json 代码块数量 ≠ 1 的文章：${multiFence.length ? multiFence.map((x) => `${x.id} (${x.jsonFences})`).join(', ') : '无'}`)
const under = s.words.filter((x) => x.target && x.cjk < x.target * 0.9)
line(`  汉字数低于目标 90%：${under.length ? under.map((x) => `${x.id} ${x.cjk}/${x.target}`).join(', ') : '无'}`)
line()

const fromSet = new Set(s.brokenLinks.map((b) => b.from))
const targetSet = new Set(s.brokenLinks.map((b) => b.href))
line(`断链（指向不存在的页面）：${s.brokenLinks.length} 处，来自 ${fromSet.size} 篇，指向 ${targetSet.size} 个地址`)
for (const b of s.brokenLinks) line(`  ${b.from.padEnd(6)} ${b.fromSlug.padEnd(34)} → ${b.href}  (${b.targetId})`)
line()

if (backfill) {
  line(`回填候选 · 按 config 应该链到 /geo/${backfillSlug}/ 但正文没链的已发布文章：${backfill.length}`)
  for (const b of backfill) line(`  ${b.id.padEnd(6)} ${b.file}`)
  line()
}

if (showPosts) {
  line(`content/posts：${s.posts.length} 个文件`)
  const groups = new Map()
  for (const p of s.posts) {
    const key = p.error
      ? '（解析失败）'
      : !p.frontmatter
        ? '（无 frontmatter — 会被当文章渲染）'
        : p.tags.filter((t) => !['GoEast', 'case-study'].includes(t))[0] || p.category || '（未分类）'
    if (!groups.has(key)) groups.set(key, [])
    groups.get(key).push(p)
  }
  for (const [key, items] of groups) {
    line(`  [${key}] ${items.length}`)
    for (const p of items) line(`    ${(p.date || '').padEnd(10)} ${p.slug.padEnd(40)} ${p.title || p.error || ''}`)
  }
  line()
}
