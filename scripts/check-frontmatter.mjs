#!/usr/bin/env node
/**
 * Pre-commit guard: validates YAML frontmatter of every .md / .mdx file
 * inside content/ (posts + geo). Runs in ~100ms and catches the exact
 * class of bug that silently broke the /blog page:
 *
 *   description: "...怎么把"异步"从..."
 *                          ^ unescaped inner ASCII quote → YAML parse error
 *
 * Exits non-zero with a readable report so `git commit` is aborted.
 *
 * Usage:
 *   node scripts/check-frontmatter.mjs                 # scan all content/
 *   node scripts/check-frontmatter.mjs <file> [file]   # scan given files only
 *                                                       (husky pre-commit mode)
 */
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import matter from 'gray-matter'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const ROOT = path.resolve(__dirname, '..')

const CONTENT_DIRS = ['content/posts', 'content/geo']

/** Collect every .md / .mdx file under content/. */
function walkContent() {
  const out = []
  for (const rel of CONTENT_DIRS) {
    const abs = path.join(ROOT, rel)
    if (!fs.existsSync(abs)) continue
    for (const name of fs.readdirSync(abs)) {
      if (!/\.mdx?$/.test(name)) continue
      out.push(path.join(abs, name))
    }
  }
  return out
}

/** Accept explicit file list from CLI (husky passes staged paths) if given. */
function resolveTargets() {
  const args = process.argv.slice(2)
  if (args.length === 0) return walkContent()
  return args
    .map((p) => path.isAbsolute(p) ? p : path.resolve(ROOT, p))
    .filter((p) => /\.mdx?$/.test(p) && fs.existsSync(p))
}

const files = resolveTargets()
if (files.length === 0) {
  // Nothing relevant staged — allow the commit through.
  process.exit(0)
}

const failures = []
for (const file of files) {
  try {
    const raw = fs.readFileSync(file, 'utf8')
    matter(raw)
  } catch (err) {
    const msg = (err && err.message) ? err.message.split('\n')[0] : String(err)
    failures.push({ file: path.relative(ROOT, file), msg })
  }
}

if (failures.length > 0) {
  console.error('\n✖ Frontmatter validation failed:\n')
  for (const f of failures) {
    console.error(`  ${f.file}`)
    console.error(`    → ${f.msg}\n`)
  }
  console.error('Hint: if your YAML value contains ASCII double quotes,')
  console.error('      switch to single quotes or use Chinese 「 」 brackets.')
  console.error('      Example:')
  console.error(`        description: "...把「异步」从..."   ✓`)
  console.error(`        description: "...把"异步"从..."     ✗ (YAML parse error)\n`)
  process.exit(1)
}

if (!process.argv.slice(2).length) {
  // Only log in "scan all" mode so git-hook output stays quiet on success.
  console.log(`✓ frontmatter OK for ${files.length} file(s)`)
}
