/**
 * Readers for the hand-maintained ledger documents in docs/ (BACKLOG, STRATEGY, MISTAKES, GLOSSARY)
 * and the frozen gate rules. Used by owner.mjs (generator) and docs-check.mjs (tests).
 *
 * Table convention: GitHub-flavoured markdown tables; a cell must not contain a "|" character.
 */
import fs from 'node:fs'
import path from 'node:path'
import { ROOT } from './geo-lib.mjs'

export const DOCS = path.join(ROOT, 'docs')

export function docPath(name) {
  return path.join(DOCS, name)
}

export function readDoc(name) {
  const p = docPath(name)
  return fs.existsSync(p) ? fs.readFileSync(p, 'utf8') : ''
}

/** Text of the section under the first heading matching `headingRe`, up to the next heading of the same or higher level. */
export function section(md, headingRe) {
  const lines = md.split(/\r?\n/)
  const i = lines.findIndex((l) => headingRe.test(l))
  if (i < 0) return ''
  const level = (lines[i].match(/^(#+)/) || [null, '#'])[1].length
  const out = []
  for (let j = i + 1; j < lines.length; j++) {
    const m = lines[j].match(/^(#+)\s/)
    if (m && m[1].length <= level) break
    out.push(lines[j])
  }
  return out.join('\n')
}

/** First markdown table in `text` → { headers, rows: [{ header: cell }] } */
export function parseTable(text) {
  const lines = text.split(/\r?\n/)
  const start = lines.findIndex((l) => l.trim().startsWith('|'))
  if (start < 0) return { headers: [], rows: [] }
  const block = []
  for (let j = start; j < lines.length && lines[j].trim().startsWith('|'); j++) block.push(lines[j])
  const cells = (l) =>
    l
      .trim()
      .replace(/^\|/, '')
      .replace(/\|$/, '')
      .split('|')
      .map((c) => c.trim())
  const headers = cells(block[0])
  const rows = []
  for (const l of block.slice(1)) {
    const c = cells(l)
    if (c.every((x) => /^:?-+:?$/.test(x))) continue
    const row = {}
    headers.forEach((h, k) => {
      row[h] = c[k] ?? ''
    })
    rows.push(row)
  }
  return { headers, rows }
}

/** Value of a blockquote field like `> 当前在做：xxx` */
export function quoteField(md, label) {
  const m = md.match(new RegExp('^>\\s*' + label + '\\s*[:：]\\s*(.+)$', 'm'))
  return m ? m[1].trim() : ''
}

export function parseBacklog() {
  const md = readDoc('BACKLOG.md')
  return {
    now: quoteField(md, '当前在做'),
    question: quoteField(md, '现在最要紧的问题'),
    w: parseTable(section(md, /^## 需要 Jake/)).rows,
    t: parseTable(section(md, /^## 技术/)).rows,
    closed: parseTable(section(md, /^## 已关闭/)).rows,
  }
}

export function parseGates() {
  return parseTable(section(readDoc('STRATEGY.md'), /^## 门槛/)).rows
}

export function strategyParagraph() {
  return section(readDoc('STRATEGY.md'), /^## 一段话/).trim()
}

export function parseMistakes() {
  return parseTable(readDoc('MISTAKES.md')).rows
}

export function parseGlossary() {
  return parseTable(readDoc('GLOSSARY.md')).rows
}

/** Whole days from the date part of `asofIso` to `dateStr` (negative = overdue). */
export function daysUntil(dateStr, asofIso) {
  const a = Date.parse(String(asofIso).slice(0, 10))
  const d = Date.parse(dateStr)
  if (Number.isNaN(a) || Number.isNaN(d)) return null
  return Math.round((d - a) / 86400000)
}

/**
 * Gate rules, frozen in code. Each returns { reading, pass } from the computed status.
 * Changing a rule after its date, or in the direction that makes passing easier, is not allowed
 * (see docs/STRATEGY.md). docs-check pins the function names and the STRATEGY rows to each other.
 */
export const gateRules = {
  /** G1 · 2026-10-31: ≥ 6 new GEO articles dated on/after 2026-09-15 AND zero broken internal links. */
  G1(status) {
    const since = '2026-09-15'
    const fresh = [...status.written.values()].filter((w) => !w.error && String(w.data.date || '').slice(0, 10) >= since).length
    const broken = status.brokenLinks.length
    return { reading: `自 ${since} 起新发布 ${fresh} 篇（目标 ≥ 6），断链 ${broken} 处（目标 0）`, pass: fresh >= 6 && broken === 0 }
  },
}
