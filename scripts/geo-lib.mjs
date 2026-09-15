/**
 * Shared helpers for the GEO-series scripts (geo-status / geo-brief / geo-lint / geo-publish /
 * owner / docs-check). Pure Node (v20+), only depends on gray-matter which the site already uses.
 *
 * Everything that must agree with the site's own rendering is READ from the site source instead
 * of being retyped here, so this file cannot silently drift:
 *   - pillarOrder   ← app/(site)/geo/page.tsx
 *   - JSON-LD regex ← identical to extractJsonLd in app/(site)/geo/[slug]/page.tsx
 */
import fs from 'node:fs'
import path from 'node:path'
import { spawnSync } from 'node:child_process'
import { fileURLToPath } from 'node:url'
import matter from 'gray-matter'

export const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
export const CONFIG_PATH = path.join(ROOT, 'geo', 'geo_agent_config.json')
export const GEO_DIR = path.join(ROOT, 'content', 'geo')
export const POSTS_DIR = path.join(ROOT, 'content', 'posts')
export const GEO_PAGE = path.join(ROOT, 'app', '(site)', 'geo', 'page.tsx')
export const SITE = 'https://gujianjun.net'

/** Same regex as extractJsonLd() in app/(site)/geo/[slug]/page.tsx — the FIRST ```json block wins. */
export const JSON_LD_RE = /```json\n(\{[\s\S]*?\})\n```/

/** "organic" mistranslated as 有机 (Feedback Log 2026-03-27 says 自然). */
export const ORGANIC_RE = /有机(搜索|流量|结果|排名|点击)/g

export function loadConfig() {
  return JSON.parse(fs.readFileSync(CONFIG_PATH, 'utf8'))
}

/** "p0-1" / "P0-01" / " p10-3 " → "P0-01" / "P10-03"; anything else → null */
export function normalizeId(raw) {
  if (raw == null) return null
  const m = String(raw).trim().toUpperCase().match(/^P(\d{1,2})-(\d{1,2})$/)
  if (!m) return null
  return `P${parseInt(m[1], 10)}-${String(parseInt(m[2], 10)).padStart(2, '0')}`
}

export function articleById(config, id) {
  const norm = normalizeId(id)
  return norm ? config.articles.find((a) => a.id === norm) || null : null
}

export function articleBySlug(config, slug) {
  return config.articles.find((a) => a.slug === slug) || null
}

export function phaseOf(config, id) {
  for (const [name, p] of Object.entries(config.publishing_phases || {})) {
    if (p.articles.includes(id)) return { name, priority: p.priority, description: p.description }
  }
  return null
}

/** The pillar list the /geo index actually renders. Parsed from the page so it cannot drift. */
export function pillarOrder(config) {
  try {
    const src = fs.readFileSync(GEO_PAGE, 'utf8')
    const m = src.match(/const pillarOrder\s*=\s*\[([\s\S]*?)\]/)
    if (m) {
      const names = [...m[1].matchAll(/'([^']+)'/g)].map((x) => x[1])
      if (names.length) return names
    }
  } catch {
    /* fall through to config */
  }
  return config.pillars.map((p) => p.name)
}

function listMdx(dir) {
  if (!fs.existsSync(dir)) return []
  return fs
    .readdirSync(dir)
    .filter((n) => /\.mdx?$/.test(n))
    .sort()
    .map((n) => path.join(dir, n))
}

export const listGeoFiles = () => listMdx(GEO_DIR)
export const listPostFiles = () => listMdx(POSTS_DIR)

export function slugOf(file) {
  return path.basename(file).replace(/\.mdx?$/, '')
}

/** YAML dates may arrive as Date objects when unquoted; render them as YYYY-MM-DD either way. */
export function dateStr(v) {
  if (v instanceof Date) return v.toISOString().slice(0, 10)
  return v == null ? '' : String(v)
}

/** Parse one MDX file. Throws on YAML errors (same failure the build would hit). */
export function readMdx(file) {
  const raw = fs.readFileSync(file, 'utf8')
  const { data, content } = matter(raw)
  return { file, raw, data, content, slug: slugOf(file) }
}

export function safeRead(file) {
  try {
    return readMdx(file)
  } catch (err) {
    return { file, raw: '', data: {}, content: '', slug: slugOf(file), error: err.message.split('\n')[0] }
  }
}

/** Map slug → { slug, file, articleId, data, error? } for every file in content/geo. */
export function writtenGeo() {
  const map = new Map()
  for (const f of listGeoFiles()) {
    const r = safeRead(f)
    map.set(r.slug, { slug: r.slug, file: f, articleId: String(r.data.articleId || ''), data: r.data, error: r.error })
  }
  return map
}

/** Split body into { fences, jsonLd, body, index, length } exactly the way the page does. */
export function splitJsonLd(content) {
  const fences = [...content.matchAll(/^```json[ \t]*$/gm)].length
  const m = content.match(JSON_LD_RE)
  if (!m) return { fences, jsonLd: null, body: content, index: -1, length: 0 }
  return { fences, jsonLd: m[1], body: content.replace(m[0], ''), index: m.index, length: m[0].length }
}

export function countCjk(text) {
  return (text.match(/[一-鿿]/g) || []).length
}

/** Markdown links to /geo/… or /blog/… inside the body. */
export function internalLinks(body) {
  const out = []
  for (const m of body.matchAll(/\]\((\/(geo|blog)\/([A-Za-z0-9-]+))\/?(?:#[^)]*)?\)/g)) {
    out.push({ href: m[1], kind: m[2], slug: m[3] })
  }
  return out
}

/** External http(s) markdown links, excluding the site itself. */
export function externalLinks(body) {
  return [...body.matchAll(/\]\((https?:\/\/[^)\s]+)\)/g)]
    .map((m) => m[1])
    .filter((u) => !/gujianjun\.net/i.test(u))
}

export function today() {
  const d = new Date()
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

export function rel(file) {
  return path.relative(ROOT, file).split(path.sep).join('/')
}

export function slugFromUrl(url) {
  const m = String(url || '').match(/\/geo\/([A-Za-z0-9-]+)\/?/)
  return m ? m[1] : null
}

/**
 * Everything the status / owner pages need, computed once, deterministically (sorted, no clock).
 * "Written" = a file in content/geo whose articleId is a config id.
 */
export function computeStatus() {
  const config = loadConfig()
  const written = writtenGeo()
  const byId = new Map(config.articles.map((a) => [a.id, a]))
  const bySlug = new Map(config.articles.map((a) => [a.slug, a]))
  const entries = [...written.values()].sort((a, b) => a.slug.localeCompare(b.slug))
  const writtenIds = new Set(entries.map((w) => w.articleId).filter((id) => byId.has(id)))

  const phases = Object.entries(config.publishing_phases).map(([name, p]) => ({
    name,
    priority: p.priority,
    description: p.description,
    total: p.articles.length,
    written: p.articles.filter((id) => writtenIds.has(id)),
    unwritten: p.articles.filter((id) => !writtenIds.has(id)).map((id) => byId.get(id)),
  }))

  const pillars = pillarOrder(config).map((name) => {
    const arts = config.articles.filter((a) => a.pillar === name)
    return {
      name,
      total: arts.length,
      written: arts.filter((a) => writtenIds.has(a.id)).map((a) => a.id),
      unwritten: arts.filter((a) => !writtenIds.has(a.id)).map((a) => a.id),
    }
  })

  const consistency = {
    parseErrors: entries.filter((w) => w.error).map((w) => ({ slug: w.slug, error: w.error })),
    notInConfig: entries.filter((w) => !w.error && !byId.has(w.articleId)).map((w) => ({ slug: w.slug, articleId: w.articleId })),
    slugMismatch: entries
      .filter((w) => !w.error && byId.has(w.articleId) && byId.get(w.articleId).slug !== w.slug)
      .map((w) => ({ id: w.articleId, slug: w.slug, expected: byId.get(w.articleId).slug })),
    pillarMismatch: entries
      .filter((w) => !w.error && byId.has(w.articleId) && byId.get(w.articleId).pillar !== w.data.pillar)
      .map((w) => ({ id: w.articleId, pillar: String(w.data.pillar || ''), expected: byId.get(w.articleId).pillar })),
  }

  const postFiles = listPostFiles()
  const postSlugs = new Set(postFiles.map(slugOf))
  const brokenLinks = []
  const words = []
  const timeline = new Map()
  for (const w of entries) {
    if (w.error) continue
    const { content } = readMdx(w.file)
    const { body, fences } = splitJsonLd(content)
    const cfg = byId.get(w.articleId) || null
    const date = dateStr(w.data.date)
    words.push({ id: w.articleId, slug: w.slug, cjk: countCjk(body), target: cfg ? cfg.target_words : null, jsonFences: fences, date })
    for (const l of internalLinks(body)) {
      const ok = l.kind === 'geo' ? written.has(l.slug) : postSlugs.has(l.slug)
      if (!ok) {
        const t = l.kind === 'geo' ? bySlug.get(l.slug) : null
        brokenLinks.push({ from: w.articleId, fromSlug: w.slug, href: l.href, targetId: t ? t.id : '(not in config)' })
      }
    }
    const month = date.slice(0, 7) || '(no date)'
    timeline.set(month, (timeline.get(month) || 0) + 1)
  }
  brokenLinks.sort((a, b) => a.fromSlug.localeCompare(b.fromSlug) || a.href.localeCompare(b.href))

  const posts = postFiles
    .map((f) => {
      const r = safeRead(f)
      return {
        slug: r.slug,
        file: rel(f),
        title: r.data.title ? String(r.data.title) : null,
        date: dateStr(r.data.date) || null,
        tags: Array.isArray(r.data.tags) ? r.data.tags.map(String) : [],
        category: r.data.category ? String(r.data.category) : null,
        cjk: countCjk(r.content),
        frontmatter: Object.keys(r.data).length > 0,
        error: r.error || null,
      }
    })
    .sort((a, b) => a.slug.localeCompare(b.slug))

  return {
    config,
    written,
    byId,
    bySlug,
    writtenIds,
    phases,
    pillars,
    consistency,
    brokenLinks,
    words,
    timeline: [...timeline.entries()].sort((a, b) => a[0].localeCompare(b[0])),
    posts,
    totals: { planned: config.articles.length, written: writtenIds.size, unwritten: config.articles.length - writtenIds.size },
  }
}

/** Published articles whose config internal_links include `slug` but whose body does not link it. */
export function backfillCandidates(status, slug) {
  const out = []
  for (const w of [...status.written.values()].sort((a, b) => a.slug.localeCompare(b.slug))) {
    if (w.error || w.slug === slug) continue
    const cfg = status.byId.get(w.articleId)
    if (!cfg) continue
    if (!(cfg.internal_links || []).some((l) => slugFromUrl(l.url) === slug)) continue
    const { body } = splitJsonLd(readMdx(w.file).content)
    if (!internalLinks(body).some((l) => l.kind === 'geo' && l.slug === slug)) out.push({ id: w.articleId, slug: w.slug, file: rel(w.file) })
  }
  return out
}

/** Run geo-lint over every published GEO article; returns sorted [{ id, slug, file, ok, fails, warns, infos }]. */
export function lintAll() {
  const lintPath = path.join(ROOT, 'scripts', 'geo-lint.mjs')
  const rows = listGeoFiles().map((f) => {
    const r = spawnSync(process.execPath, [lintPath, f, '--json'], { cwd: ROOT, encoding: 'utf8' })
    let j
    try {
      j = JSON.parse(r.stdout)
    } catch {
      j = { ok: false, fails: [{ level: 'FAIL', rule: 'lint', msg: `lint crashed: ${(r.stderr || '').split('\n')[0]}` }], warns: [], infos: [] }
    }
    const { data, slug } = safeRead(f)
    return { id: String(data.articleId || ''), slug, file: rel(f), ok: !!j.ok, fails: j.fails || [], warns: j.warns || [], infos: j.infos || [] }
  })
  return rows.sort((a, b) => a.id.localeCompare(b.id, undefined, { numeric: true }))
}

/** [{ file, count }] for every content file still carrying the 有机 mistranslation. */
export function organicOccurrences() {
  const out = []
  for (const f of [...listGeoFiles(), ...listPostFiles()]) {
    const raw = fs.readFileSync(f, 'utf8')
    const n = (raw.match(ORGANIC_RE) || []).length
    if (n) out.push({ file: rel(f), count: n })
  }
  return out.sort((a, b) => a.file.localeCompare(b.file))
}

/**
 * Commit lines "YYYY-MM-DD hash subject" for a window. With `until` (ISO timestamp) the window is
 * [until - days, until], which makes regeneration deterministic; without it, the last `days` days.
 */
export function gitLog({ until, days = 14, max = 20 } = {}) {
  const args = ['log', '--date=short', '--format=%ad %h %s']
  if (until) {
    const u = new Date(until)
    const s = new Date(u.getTime() - days * 86400000)
    args.push(`--since=${s.toISOString()}`, `--until=${u.toISOString()}`)
  } else {
    args.push(`--since=${days} days ago`)
  }
  const r = spawnSync('git', args, { cwd: ROOT, encoding: 'utf8' })
  const lines = (r.stdout || '').split('\n').map((l) => l.trim()).filter(Boolean)
  return { total: lines.length, lines: lines.slice(0, max), truncated: lines.length > max, max }
}
