#!/usr/bin/env node
/**
 * Writing brief for one GEO article, straight from geo/geo_agent_config.json.
 *
 *   node scripts/geo-brief.mjs P0-01
 *   node scripts/geo-brief.mjs P0-01 --json
 *
 * This is Step 1 of .claude/skills/geo-article/SKILL.md. It resolves every {{variable}}
 * the prompt template needs and, crucially, marks which internal_links may be used NOW
 * (target already published) versus which must NOT be linked (target unwritten → live 500).
 */
import fs from 'node:fs'
import path from 'node:path'
import {
  GEO_DIR,
  SITE,
  loadConfig,
  normalizeId,
  articleById,
  articleBySlug,
  phaseOf,
  writtenGeo,
  slugFromUrl,
  rel,
  today,
} from './geo-lib.mjs'

const argv = process.argv.slice(2)
const asJson = argv.includes('--json')
const rawId = argv.find((a) => !a.startsWith('--'))

if (!rawId) {
  console.error('用法: node scripts/geo-brief.mjs <article-id>   例如 P0-01')
  process.exit(2)
}
const id = normalizeId(rawId)
if (!id) {
  console.error(`"${rawId}" 不是合法的文章 ID（格式 P0-01 … P10-04）`)
  process.exit(2)
}

const config = loadConfig()
const a = articleById(config, id)
if (!a) {
  console.error(`${id} 不在 geo/geo_agent_config.json 里`)
  process.exit(1)
}

const written = writtenGeo()
const file = path.join(GEO_DIR, `${a.slug}.mdx`)
const exists = fs.existsSync(file)
const phase = phaseOf(config, id)

const links = (a.internal_links || []).map((l) => {
  const slug = slugFromUrl(l.url)
  const target = slug ? articleBySlug(config, slug) : null
  const published = slug ? written.has(slug) : false
  return {
    title: l.title,
    slug,
    id: target ? target.id : null,
    href: slug ? `/geo/${slug}/` : l.url,
    published,
  }
})
const usable = links.filter((l) => l.published)
const blocked = links.filter((l) => !l.published)

// Published articles whose config says they should link to THIS article (for backfill after publishing).
const inboundCandidates = []
for (const w of written.values()) {
  const cfg = w.articleId ? articleById(config, w.articleId) : null
  if (!cfg) continue
  if ((cfg.internal_links || []).some((l) => slugFromUrl(l.url) === a.slug)) {
    inboundCandidates.push({ id: cfg.id, slug: w.slug })
  }
}

// Tag frequency across the published series so the writer reuses existing tags.
const tagFreq = new Map()
for (const w of written.values()) for (const t of w.data.tags || []) tagFreq.set(t, (tagFreq.get(t) || 0) + 1)
const tags = [...tagFreq.entries()].sort((x, y) => y[1] - x[1])

const samePillar = [...written.values()]
  .filter((w) => w.data.pillar === a.pillar)
  .map((w) => ({ id: w.articleId, slug: w.slug, file: rel(w.file) }))

const brief = {
  id,
  pillar: a.pillar,
  type: a.type,
  priority: a.priority,
  phase: phase ? `${phase.name} (${phase.description})` : null,
  title_en: a.title,
  slug: a.slug,
  url: `${SITE}/geo/${a.slug}/`,
  target_words: a.target_words,
  content_brief: a.content_brief,
  suggested_h2s: a.suggested_h2s,
  example_guidance: a.example_guidance,
  date: today(),
  file: rel(file),
  exists,
  internal_links: { usable, blocked, count_config: links.length, count_usable: usable.length },
  inbound_candidates: inboundCandidates,
  same_pillar_published: samePillar,
  tags_in_use: tags,
}

if (asJson) {
  console.log(JSON.stringify(brief, null, 2))
  process.exit(0)
}

const line = (s = '') => console.log(s)
line(`写作简报 · ${id} · ${today()}`)
line('='.repeat(72))
line(`选题（config 英文标题，不是 H1）：${a.title}`)
line(`支柱：${a.pillar}   类型：${a.type}   优先级：${a.priority}   阶段：${brief.phase || '?'}`)
line(`slug：${a.slug}`)
line(`URL：${brief.url}`)
line(`目标字数（汉字）：${a.target_words}   ≥ 90% = ${Math.ceil(a.target_words * 0.9)}`)
line(`目标文件：${brief.file}   ${exists ? '⚠ 已存在 —— 除非用户说"重写"，否则停下来问' : '（尚未写）'}`)
line()
line('content_brief：')
line(`  ${a.content_brief}`)
line()
line('suggested_h2s（起点，可按行文调整；每个 H2 要含关键词或语义变体）：')
for (const h of a.suggested_h2s || []) line(`  - ${h}`)
line()
line('example_guidance：')
line(`  ${a.example_guidance}`)
line()
line(`内链 · config 里 ${links.length} 条，现在可用 ${usable.length} 条（{{internal_link_count}} = ${usable.length}）：`)
for (const l of usable) line(`  ✅ ${l.id ? l.id.padEnd(6) : '      '} [${l.title}](${l.href})`)
for (const l of blocked) line(`  ⏳ ${l.id ? l.id.padEnd(6) : '      '} ${l.title}  —— 未写，不要加链接（线上 500）；可用文字提一句`)
line()
line(`同支柱已发布文章（读 2–3 篇对齐语气和格式）：${samePillar.length ? '' : '无'}`)
for (const s of samePillar) line(`  ${s.id.padEnd(6)} ${s.file}`)
line()
line(`发布后要回填链接的已发布文章（它们的 config 内链包含本篇）：${inboundCandidates.length ? '' : '无'}`)
for (const c of inboundCandidates) line(`  ${c.id.padEnd(6)} /geo/${c.slug}/`)
line()
line('系列已用 tag（复用，别造近义词）：')
line('  ' + tags.map(([t, n]) => `${t}(${n})`).join('  '))
line()
line('frontmatter 变量：')
line(`  date: "${today()}"   pillar: "${a.pillar}"   articleId: "${id}"   文件名: ${a.slug}.mdx`)
line()
line('下一步：读 geo/jake-writing-style-guide.md（§10 Feedback Log 优先）→ prompt 模板 → 案例库 → 知识库相关章节，然后起草。')
