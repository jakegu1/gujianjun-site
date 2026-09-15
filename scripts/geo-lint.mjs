#!/usr/bin/env node
/**
 * Lint one GEO article draft against the site's rendering rules, the config, and the
 * hard rules in geo/jake-writing-style-guide.md (§10 Feedback Log + §11).
 *
 *   node scripts/geo-lint.mjs P0-01               # resolves content/geo/{slug}.mdx via config
 *   node scripts/geo-lint.mjs content/geo/x.mdx   # or a path
 *   node scripts/geo-lint.mjs P0-01 --json
 *
 * Exit 1 on any FAIL. WARNs are for the author to judge; each one must be either fixed
 * or explained in the draft preview.
 */
import fs from 'node:fs'
import path from 'node:path'
import {
  ROOT,
  GEO_DIR,
  loadConfig,
  normalizeId,
  articleById,
  pillarOrder,
  writtenGeo,
  listPostFiles,
  readMdx,
  splitJsonLd,
  countCjk,
  internalLinks,
  externalLinks,
  rel,
} from './geo-lib.mjs'

const argv = process.argv.slice(2)
const asJson = argv.includes('--json')
const target = argv.find((a) => !a.startsWith('--'))
if (!target) {
  console.error('用法: node scripts/geo-lint.mjs <article-id | path-to-mdx>')
  process.exit(2)
}

const config = loadConfig()
let file
const idArg = normalizeId(target)
if (idArg) {
  const a = articleById(config, idArg)
  if (!a) {
    console.error(`${idArg} 不在 geo/geo_agent_config.json 里`)
    process.exit(1)
  }
  file = path.join(GEO_DIR, `${a.slug}.mdx`)
} else {
  file = path.resolve(ROOT, target)
}

const findings = []
const F = (rule, msg) => findings.push({ level: 'FAIL', rule, msg })
const W = (rule, msg) => findings.push({ level: 'WARN', rule, msg })
const I = (rule, msg) => findings.push({ level: 'INFO', rule, msg })

function report() {
  const fails = findings.filter((f) => f.level === 'FAIL')
  const warns = findings.filter((f) => f.level === 'WARN')
  const infos = findings.filter((f) => f.level === 'INFO')
  if (asJson) {
    console.log(JSON.stringify({ file: rel(file), ok: fails.length === 0, fails, warns, infos }, null, 2))
  } else {
    console.log(`lint · ${rel(file)}`)
    for (const f of fails) console.log(`  ✖ FAIL [${f.rule}] ${f.msg}`)
    for (const f of warns) console.log(`  ⚠ WARN [${f.rule}] ${f.msg}`)
    for (const f of infos) console.log(`  · ${f.msg}`)
    console.log(fails.length ? `\n${fails.length} FAIL, ${warns.length} WARN — 不能发布` : `\n0 FAIL, ${warns.length} WARN`)
  }
  process.exit(fails.length ? 1 : 0)
}

// ── file + frontmatter ───────────────────────────────────────────────────────
if (!fs.existsSync(file)) {
  F('file', `文件不存在：${rel(file)}`)
  report()
}
let raw, data, content
try {
  ;({ raw, data, content } = readMdx(file))
} catch (err) {
  F('frontmatter', `YAML 解析失败（next build 会同样失败）：${err.message.split('\n')[0]}`)
  report()
}
if (raw.includes('\r\n')) W('eol', 'CRLF 换行。站点抽 JSON-LD 的正则只认 LF，保存成 LF')

const slug = path.basename(file).replace(/\.mdx?$/, '')
for (const k of ['title', 'date', 'excerpt', 'tags', 'pillar', 'articleId']) {
  const v = data[k]
  if (v == null || v === '' || (Array.isArray(v) && v.length === 0)) F('frontmatter', `缺少 ${k}`)
}
if (data.date instanceof Date) F('date', 'date 没加引号，YAML 把它变成了 Date 对象；写成 date: "YYYY-MM-DD"')
else if (data.date && !/^\d{4}-\d{2}-\d{2}$/.test(String(data.date))) F('date', `date 格式应为 YYYY-MM-DD，现在是 "${data.date}"`)

const cfg = data.articleId ? articleById(config, data.articleId) : null
if (data.articleId && !cfg) F('config', `articleId "${data.articleId}" 不在 geo_agent_config.json`)
if (cfg) {
  if (cfg.slug !== slug) F('config', `文件名 "${slug}" ≠ config 里 ${cfg.id} 的 slug "${cfg.slug}"`)
  if (data.pillar !== cfg.pillar) F('config', `pillar "${data.pillar}" ≠ config 的 "${cfg.pillar}"`)
}
const order = pillarOrder(config)
if (data.pillar && !order.includes(data.pillar)) {
  F('pillar', `pillar "${data.pillar}" 不在 app/(site)/geo/page.tsx 的 pillarOrder 里，文章会从 /geo 列表消失。可选：${order.join(' | ')}`)
}
const title = String(data.title || '')
if (/完全指南/.test(title)) F('title', '标题里的"完全指南"是英文直译痕迹（Feedback Log 2026-03-26 精修 #1）')
const excerpt = String(data.excerpt || '')
if (excerpt && (excerpt.length < 60 || excerpt.length > 160)) {
  W('excerpt', `excerpt ${excerpt.length} 字符。已发布文章实测 67–121，规则写的是 120–155；超出 60–160 就该改`)
}
const tags = Array.isArray(data.tags) ? data.tags : []
if (tags.length && (tags.length < 3 || tags.length > 7)) W('tags', `tags 有 ${tags.length} 个，建议 3–6 个`)
if (tags.length && !tags.includes('GEO')) W('tags', '系列文章都带 "GEO" 标签，这篇没有')

// ── body structure ───────────────────────────────────────────────────────────
const { fences, jsonLd, body, index, length } = splitJsonLd(content)

if (/<!--/.test(content)) F('mdx', 'HTML 注释 <!-- --> 会让 MDX 构建失败（2026-03-26 踩过）。用 {/* */}')
if (/<script[\s>]/i.test(body)) F('mdx', '正文里有 <script> 标签。JSON-LD 只能放在 ```json 块里')

if (fences === 0) F('jsonld', '没有 ```json 块。站点把第一个 ```json 块注入为 JSON-LD；文末要有 Article + BreadcrumbList + FAQPage')
if (fences > 1) F('jsonld', `有 ${fences} 个 \`\`\`json 块，站点只抽第一个当 JSON-LD，其余会渲染成代码。示例 JSON 改用 \`\`\`jsonc`)
if (jsonLd) {
  const after = content.slice(index + length).trim()
  if (after) W('jsonld', 'JSON-LD 块后面还有内容；JSON-LD 应该是文件最后一块')
  try {
    const ld = JSON.parse(jsonLd)
    const graph = Array.isArray(ld['@graph']) ? ld['@graph'] : [ld]
    const types = graph.map((g) => g['@type'])
    for (const t of ['Article', 'BreadcrumbList', 'FAQPage']) {
      if (!types.includes(t)) F('jsonld', `JSON-LD 缺少 @type ${t}`)
    }
    const art = graph.find((g) => g['@type'] === 'Article')
    if (art) {
      if (!String(art.url || '').includes(`/geo/${slug}`)) F('jsonld', `Article.url "${art.url}" 没有指向 /geo/${slug}/`)
      if (data.date && art.datePublished !== String(data.date)) W('jsonld', `Article.datePublished (${art.datePublished}) ≠ frontmatter date (${data.date})；新文应一致，重写保留原值`)
      if (!art.dateModified) W('jsonld', 'Article 缺少 dateModified')
      const author = art.author || {}
      if (author['@type'] !== 'Person' || !author['@id']) F('jsonld', 'Article.author 必须是带 @id 的 Person 实体（https://gujianjun.net/#person）')
    }
    const faq = graph.find((g) => g['@type'] === 'FAQPage')
    if (faq) {
      const n = Array.isArray(faq.mainEntity) ? faq.mainEntity.length : 0
      if (n < 3) F('jsonld', `FAQPage 只有 ${n} 个问题，至少 3 个`)
      data.__faqLd = n
    }
  } catch (err) {
    F('jsonld', `JSON-LD 不是合法 JSON：${err.message}`)
  }
}

const h1s = [...body.matchAll(/^# (.+)$/gm)].map((m) => m[1].trim())
if (h1s.length === 0) F('h1', '正文没有 H1（# 标题）')
if (h1s.length > 1) F('h1', `有 ${h1s.length} 个 H1，只能有一个`)
if (h1s.length === 1 && title && h1s[0] !== title.trim()) W('h1', `H1 "${h1s[0]}" 与 frontmatter title 不一致（§11：H1 应与 title 一致）`)

const h2s = [...body.matchAll(/^## (.+)$/gm)].map((m) => m[1].trim())
if (h2s.length < 3) W('structure', `只有 ${h2s.length} 个 H2`)

// FAQ section
// No \b here: JS word boundaries do not exist between CJK characters and end-of-line.
const faqIdx = body.search(/^## (?:常见问题|FAQ)/m)
if (faqIdx < 0) {
  F('faq', '没有 "## 常见问题" 段落（已发布文章统一用这个标题）')
} else {
  const rest = body.slice(faqIdx)
  const nextH2 = rest.slice(3).search(/^## /m)
  const section = nextH2 >= 0 ? rest.slice(0, nextH2 + 3) : rest
  // Two formats exist in the published series: "### 问题？" (3 early articles) and a bold
  // line "**问题？**" (14 later ones). Both count; the template recommends ###.
  const q = [...section.matchAll(/^(?:### .+|\*\*[^*\n]*[？?]\*\*[ \t]*)$/gm)].length
  if (q < 3) F('faq', `FAQ 只有 ${q} 个 ### 问题，至少 3 个（5 更好）`)
  if (data.__faqLd != null && data.__faqLd !== q) W('faq', `正文 FAQ ${q} 题，JSON-LD FAQPage ${data.__faqLd} 题，应一致`)
  const faqH2Index = h2s.findIndex((h) => /^(?:常见问题|FAQ)/.test(h))
  if (faqH2Index >= 0 && faqH2Index !== h2s.length - 1) W('faq', 'FAQ 不是最后一个 H2')
}

// Opening: conclusion first + numbered key points before the first H2
const firstH2 = body.search(/^## /m)
const intro = firstH2 > 0 ? body.slice(0, firstH2) : body
if (!/^\d+\.\s/m.test(intro)) W('opening', '引言里没有编号要点列表（§11：结论先行，正文前先放核心要点）')

// ── links ────────────────────────────────────────────────────────────────────
const written = writtenGeo()
const postSlugs = new Set(listPostFiles().map((f) => path.basename(f).replace(/\.mdx?$/, '')))
const links = internalLinks(body)
for (const l of links) {
  if (l.kind === 'geo' && l.slug === slug) W('links', `链接到自己：${l.href}`)
  const ok = l.kind === 'geo' ? written.has(l.slug) : postSlugs.has(l.slug)
  if (!ok) F('links', `${l.href} 指向不存在的文章（线上 500）。只链接已发布的；用 geo-brief 看哪些可用`)
}
const geoLinkCount = links.filter((l) => l.kind === 'geo').length
if (geoLinkCount < 3) W('links', `只有 ${geoLinkCount} 个系列内链，规则是 3–7 个（前提是目标已发布）`)
if (geoLinkCount > 9) W('links', `${geoLinkCount} 个系列内链偏多`)
const ext = externalLinks(body)
if (ext.length < 2) W('sources', `只有 ${ext.length} 个外部来源链接，规则是 2–4 个一手来源`)
for (const u of ext) {
  if (/example\.com|yoursite|placeholder|xxx/i.test(u)) F('sources', `占位 URL：${u}`)
}

// ── wording ──────────────────────────────────────────────────────────────────
const text = body.replace(/```[\s\S]*?```/g, '')
const organic = text.match(/有机(搜索|流量|结果|排名|点击)/g)
if (organic) F('wording', `"${[...new Set(organic)].join('、')}"：organic 在 SEO 语境译"自然"，不是"有机"（Feedback Log 2026-03-27）`)
const KILL = [
  '在当今', '数字化时代', '不可否认', '值得注意的是', '总而言之', '综上所述', '让我们一起', '赋能', '深入探讨',
  '不容忽视', '毋庸置疑', '本文将', '本文拆解', '全方位', '深度解析',
  'delve', 'tapestry', 'multifaceted', 'seamlessly', 'game-changer', 'cutting-edge', 'unlock the power',
  'in today', 'dive in', 'dive deep', 'holistic', 'navigate the complexities', 'without further ado',
]
const hits = KILL.filter((k) => text.toLowerCase().includes(k.toLowerCase()))
if (hits.length) W('wording', `黑名单/AI 味用语：${hits.join('、')}（风格指南 §4 与 prompt 模板；"本文…"改成"我"开头，精修 #4）`)
const bangs = (text.match(/[!！]/g) || []).length
if (bangs > 2) W('wording', `${bangs} 个感叹号，上限 1–2 个`)
if (/不仅[^。\n]{0,15}更/.test(text)) W('wording', '"不仅……更……"排比（铁律 6，docs/BRIEF.md）')

// ── 铁律（docs/BRIEF.md §4）──────────────────────────────────────────────────
const pending = content.match(/【待补[:：][^】]*】/g) || []
if (pending.length) F('facts', `${pending.length} 处【待补】：${pending.slice(0, 5).join(' ')}${pending.length > 5 ? ' …' : ''}。铁律 1：草稿可以留，发布前必须补上或删掉`)
const money = text.match(/[$￥¥]\s?\d[\d,.]*\s*[kK万]?/g)
if (money) W('sensitive', `货币绝对值 ${[...new Set(money)].slice(0, 5).join('、')}：铁律 4，只有素材包标注"可公开"的才能写，否则改成相对值或区间`)
const metric = text.match(/(CPL|CPA|CAC|ROAS|转化率|客单价|毛利)[^。\n]{0,12}\d+(?:\.\d+)?\s*%?/g)
if (metric) W('sensitive', `商业指标绝对值：${[...new Set(metric)].slice(0, 5).join('、')}（铁律 4，确认可公开）`)

if (['On-Page GEO', 'Technical GEO'].includes(String(data.pillar)) && !/robots\.txt/i.test(text)) {
  F('robots', `${data.pillar} 类文章必须提醒检查 robots.txt 放行 AI 爬虫（§11 / Feedback Log 2026-03-26）`)
}

// GoEast streak: consecutive paragraphs mentioning GoEast
const paras = text.split(/\n\s*\n/).map((p) => p.trim()).filter((p) => p && !/^#{1,6}\s/.test(p) && !/^\|/.test(p))
let streak = 0
let maxStreak = 0
for (const p of paras) {
  if (/goeast/i.test(p)) {
    streak += 1
    maxStreak = Math.max(maxStreak, streak)
  } else streak = 0
}
if (maxStreak > 3) W('examples', `GoEast 连续出现在 ${maxStreak} 段里，上限 3 段（三源轮换）`)
const goeastParas = paras.filter((p) => /goeast/i.test(p)).length
if (paras.length && goeastParas / paras.length > 0.5) W('examples', `${Math.round((goeastParas / paras.length) * 100)}% 的段落提到 GoEast，读起来像 GoEast 软文`)

// ── length ───────────────────────────────────────────────────────────────────
const cjk = countCjk(body)
if (cjk < 500) F('length', `正文只有 ${cjk} 个汉字，这不是一篇文章`)
if (cfg) {
  const ratio = cjk / cfg.target_words
  if (ratio < 0.9) W('length', `${cjk} 汉字，目标 ${cfg.target_words}（${Math.round(ratio * 100)}%），低于 90%`)
  I('length', `汉字 ${cjk} / 目标 ${cfg.target_words}（${Math.round(ratio * 100)}%）· H2 ${h2s.length} · 内链 ${geoLinkCount} · 外链 ${ext.length}`)
} else {
  I('length', `汉字 ${cjk} · H2 ${h2s.length} · 内链 ${geoLinkCount} · 外链 ${ext.length}`)
}

report()
