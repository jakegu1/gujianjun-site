#!/usr/bin/env node
/**
 * Document tests + number guard + gate check for the ledger in docs/.
 * Every rule here exists because a hand-maintained document was found lying somewhere.
 *
 *   node scripts/docs-check.mjs        # exit 1 on any ✖
 *
 * Run by .husky/pre-commit whenever docs/, scripts/, AGENTS.md, CLAUDE.md, skills or slug pages are staged.
 */
import fs from 'node:fs'
import path from 'node:path'
import { spawnSync } from 'node:child_process'
import { ROOT, computeStatus, pillarOrder, loadConfig, rel } from './geo-lib.mjs'
import { DOCS, docPath, readDoc, parseBacklog, parseGates, parseMistakes, parseGlossary, gateRules, daysUntil } from './docs-lib.mjs'

const results = []
const nowIso = new Date().toISOString()
function check(name, fn) {
  try {
    const r = fn()
    if (r === true || r == null) results.push({ name, ok: true })
    else if (typeof r === 'object' && r.warn) results.push({ name, ok: true, warn: r.warn })
    else results.push({ name, ok: false, msg: String(r) })
  } catch (err) {
    results.push({ name, ok: false, msg: err.message.split('\n')[0] })
  }
}
const read = (p) => fs.readFileSync(path.join(ROOT, p), 'utf8')
const exists = (p) => fs.existsSync(path.join(ROOT, p))

// ── 1. instructions wiring ──────────────────────────────────────────────────
check('CLAUDE.md imports AGENTS.md (single source of rules)', () => {
  const first = read('CLAUDE.md').split(/\r?\n/).find((l) => l.trim())
  return first === '@AGENTS.md' || `first line is "${first}", expected "@AGENTS.md"`
})
check('Hermes skill file is a pointer, not a second copy of the process', () => {
  const p = '.hermes/skills/geo-article/SKILL.md'
  if (!exists(p)) return `${p} missing`
  const md = read(p)
  if (/^## Step/m.test(md)) return 'it contains "## Step" sections — process content must live only in .claude/skills/geo-article/SKILL.md'
  return md.includes('.claude/skills/geo-article/SKILL.md') || 'it does not point at .claude/skills/geo-article/SKILL.md'
})
check('canonical skill exists with name geo-article', () => {
  const md = read('.claude/skills/geo-article/SKILL.md')
  return /^name:\s*geo-article\s*$/m.test(md) || 'frontmatter name is not geo-article'
})

// ── 2. site invariants the scripts depend on ───────────────────────────────
check('unknown /geo and /blog slugs 404 (dynamicParams = false on both slug pages)', () => {
  const bad = ['app/(site)/geo/[slug]/page.tsx', 'app/(site)/blog/[slug]/page.tsx'].filter((p) => !/export const dynamicParams = false/.test(read(p)))
  return bad.length ? `missing in ${bad.join(', ')}` : true
})
check('pillarOrder parsed from app/(site)/geo/page.tsx and equals config pillars', () => {
  const config = loadConfig()
  const fromPage = pillarOrder(config)
  const fromConfig = config.pillars.map((p) => p.name)
  const a = [...fromPage].sort().join('|')
  const b = [...fromConfig].sort().join('|')
  return a === b || `page: ${fromPage.join(', ')} ≠ config: ${fromConfig.join(', ')}`
})
check('personal files are ignored at the repo root; public/ assets are not', () => {
  // `git check-ignore -q` accepts exactly one path, so ask once per path.
  const ignored = (p) => spawnSync('git', ['check-ignore', '-q', p], { cwd: ROOT }).status === 0
  const leaks = ['x.pdf', 'x.txt', 'docs/BRIEF.private.md', 'CLAUDE.local.md'].filter((p) => !ignored(p))
  if (leaks.length) return `NOT ignored: ${leaks.join(', ')}`
  return !ignored('public/resume.pdf') || 'public/resume.pdf is ignored — the root-only pattern leaked'
})

// ── 3. number guard: every published number is generated or guarded ────────
check('blog pinned card takes the GEO article count from content/, not a literal', () => {
  const src = read('app/(site)/blog/page.tsx')
  if (/v:\s*'\d+',\s*l:\s*'GEO 文章'/.test(src)) return 'hard-coded GEO article count found — use String(geoPosts.length)'
  return /String\(geoPosts\.length\),\s*l:\s*'GEO 文章'/.test(src) || 'expected { v: String(geoPosts.length), l: \'GEO 文章\' }'
})
check('/geo index "N-part series" equals config.total_articles', () => {
  const m = read('app/(site)/geo/page.tsx').match(/(\d+)-part/)
  const n = loadConfig().total_articles
  return (m && Number(m[1]) === n) || `page says ${m ? m[1] : '?'}-part, config says ${n}`
})
check('AGENTS.md carries no hand-written counts (处/篇) other than the plan size', () => {
  const hits = (read('AGENTS.md').match(/\d+\s*(处|篇)/g) || []).filter((h) => !/^60\s*篇/.test(h))
  return hits.length ? `found ${hits.join(', ')} — counts belong in generated docs/STATUS.md` : true
})

// ── 4. ledger documents ────────────────────────────────────────────────────
check('BACKLOG: every open item has an ID, and W items have deadline + "if you do nothing"', () => {
  const b = parseBacklog()
  const bad = []
  for (const r of b.w) {
    if (!/^W\d+$/.test(r['ID'] || '')) bad.push(`bad W id "${r['ID']}"`)
    if (!/^\d{4}-\d{2}-\d{2}$/.test(r['截止'] || '')) bad.push(`${r['ID']}: 截止 must be YYYY-MM-DD`)
    if (!r['如果你什么都不做']) bad.push(`${r['ID']}: 如果你什么都不做 is empty`)
    if (!r['做完的标志']) bad.push(`${r['ID']}: 做完的标志 is empty`)
  }
  for (const r of b.t) {
    if (!/^T\d+$/.test(r['ID'] || '')) bad.push(`bad T id "${r['ID']}"`)
    if (!r['验收']) bad.push(`${r['ID']}: 验收 is empty`)
  }
  if (!b.w.length && !b.t.length) bad.push('no open items parsed — table headings changed?')
  if (!b.now) bad.push('missing "> 当前在做：" line')
  if (!b.question) bad.push('missing "> 现在最要紧的问题：" line')
  return bad.length ? bad.join('; ') : true
})
check('DECISIONS: every row names an enforcer or says (unenforced)', () => {
  const md = readDoc('DECISIONS.md')
  const rows = md.split(/\r?\n/).filter((l) => /^\|\s*D\d+\s*\|/.test(l))
  if (!rows.length) return 'no decision rows found'
  const bad = rows.filter((l) => {
    const cells = l.replace(/^\|/, '').replace(/\|$/, '').split('|').map((c) => c.trim())
    const enforcer = cells[3] || ''
    return !enforcer
  })
  return bad.length ? `${bad.length} row(s) with empty enforcer column` : true
})
check('STRATEGY gates: dated, wired to gateRules, and answered once overdue', () => {
  const gates = parseGates()
  if (!gates.length) return 'no gate rows'
  const bad = []
  for (const g of gates) {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(g['日期'] || '')) bad.push(`${g['ID']}: no date`)
    if (typeof gateRules[g['ID']] !== 'function') bad.push(`${g['ID']}: no gateRules.${g['ID']} in scripts/docs-lib.mjs`)
    if (!(g['规则'] || '').includes(`gateRules.${g['ID']}`)) bad.push(`${g['ID']}: 规则 cell must name gateRules.${g['ID']}`)
    const d = daysUntil(g['日期'], nowIso)
    if (d != null && d < 0 && !(g['结论'] || '').trim()) bad.push(`${g['ID']}: overdue by ${-d} days with no 结论`)
  }
  return bad.length ? bad.join('; ') : true
})
check('MISTAKES: latest dated entry is within 14 days', () => {
  const m = parseMistakes()
  if (!m.length) return 'MISTAKES.md has no rows'
  const latest = m.map((r) => r['日期']).filter((d) => /^\d{4}-\d{2}-\d{2}$/.test(d)).sort().at(-1)
  if (!latest) return 'no valid 日期 in MISTAKES.md'
  const age = -daysUntil(latest, nowIso)
  return age <= 14 || `latest entry ${latest} is ${age} days old — write a dated entry (even "checked, nothing found")`
})
check('GLOSSARY defines every specialist term used on OWNER.md', () => {
  const owner = readDoc('OWNER.md')
  if (!owner) return 'docs/OWNER.md missing — run node scripts/owner.mjs --write'
  const terms = ['GEO', 'SEO', 'RAG', 'JSON-LD', 'frontmatter', 'MDX', 'slug', 'lint', 'Vercel', 'Keystatic', '断链', '口径', '素材包', '门槛', 'pillar', 'FAQ', '内链', '【待补', 'commit', 'push', 'Schema', 'Phase', 'git log', 'docs-check']
  const defined = parseGlossary().map((r) => (r['词'] || '').toLowerCase())
  const missing = terms.filter((t) => owner.toLowerCase().includes(t.toLowerCase()) && !defined.some((d) => d.includes(t.toLowerCase())))
  return missing.length ? `used but undefined: ${missing.join(', ')}` : true
})
check('internal links inside docs/*.md resolve', () => {
  const bad = []
  for (const name of fs.readdirSync(DOCS).filter((n) => n.endsWith('.md'))) {
    const md = readDoc(name)
    for (const m of md.matchAll(/\]\(([^)]+)\)/g)) {
      const target = m[1].split('#')[0].trim()
      if (!target || /^(https?:|mailto:)/.test(target)) continue
      let abs
      if (/^\/(blog|geo)\//.test(target)) {
        // site-absolute link → the article file must exist
        const [, kind, slug] = target.match(/^\/(blog|geo)\/([^/]+)\/?$/) || []
        if (!slug) continue
        abs = path.join(ROOT, 'content', kind === 'blog' ? 'posts' : 'geo', `${slug}.mdx`)
        if (!fs.existsSync(abs)) abs = abs.replace(/\.mdx$/, '.md')
      } else if (target.startsWith('/')) {
        continue // other site routes (/tag/…, /sitemap.xml) are not files
      } else {
        abs = path.resolve(DOCS, target)
      }
      if (!fs.existsSync(abs)) bad.push(`${name} → ${target}`)
    }
  }
  return bad.length ? bad.join('; ') : true
})

// ── 5. generated pages regenerate byte-identical ───────────────────────────
check('OWNER.md and STATUS.md regenerate identically (no hand edits)', () => {
  const owner = readDoc('OWNER.md')
  const m = owner.match(/<!-- generated: (\S+) by scripts\/owner\.mjs/)
  if (!m) return 'docs/OWNER.md has no generated header — run node scripts/owner.mjs --write'
  const r = spawnSync(process.execPath, [path.join(ROOT, 'scripts', 'owner.mjs'), '--asof', m[1], '--stdout', 'all'], { cwd: ROOT, encoding: 'utf8', maxBuffer: 64 * 1024 * 1024 })
  if (r.status !== 0) return `owner.mjs failed: ${(r.stderr || '').split('\n')[0]}`
  const gen = JSON.parse(r.stdout)
  const norm = (s) => s.replace(/\r\n/g, '\n').trimEnd()
  const bad = []
  if (norm(gen.owner) !== norm(owner)) bad.push('docs/OWNER.md')
  if (norm(gen.status) !== norm(readDoc('STATUS.md'))) bad.push('docs/STATUS.md')
  if (bad.length) return `${bad.join(' and ')} differ from regeneration — run node scripts/owner.mjs --write (or revert the hand edit)`
  const age = -daysUntil(m[1].slice(0, 10), nowIso)
  return age > 7 ? { warn: `owner page is ${age} days old — run node scripts/owner.mjs --write` } : true
})

// ── 6. the guards themselves must be able to go red ────────────────────────
check('geo-lint fails a deliberately broken draft (scripts/fixtures/lint-broken.mdx)', () => {
  const fixture = path.join(ROOT, 'scripts', 'fixtures', 'lint-broken.mdx')
  const r = spawnSync(process.execPath, [path.join(ROOT, 'scripts', 'geo-lint.mjs'), fixture, '--json'], { cwd: ROOT, encoding: 'utf8' })
  const j = JSON.parse(r.stdout || '{}')
  const rules = new Set((j.fails || []).map((f) => f.rule))
  const expected = ['title', 'mdx', 'jsonld', 'faq', 'links', 'wording', 'robots', 'facts', 'length']
  const missing = expected.filter((e) => !rules.has(e))
  return r.status === 1 && !missing.length ? true : `expected FAIL rules ${expected.join(', ')}; missing: ${missing.join(', ') || 'none'} (exit ${r.status})`
})

// ── report ──────────────────────────────────────────────────────────────────
let failed = 0
for (const r of results) {
  if (r.ok && r.warn) console.log(`  ⚠ ${r.name}\n      ${r.warn}`)
  else if (r.ok) console.log(`  ✓ ${r.name}`)
  else {
    failed += 1
    console.log(`  ✖ ${r.name}\n      ${r.msg}`)
  }
}
console.log(failed ? `\n✖ ${failed} of ${results.length} checks failed` : `\n✓ all checks passed (${results.length})`)
process.exit(failed ? 1 : 0)
