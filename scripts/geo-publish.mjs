#!/usr/bin/env node
/**
 * Publish ONE GEO article: lint → add only that file → commit → push (push = live on Vercel).
 *
 *   node scripts/geo-publish.mjs P0-01 --dry-run
 *   node scripts/geo-publish.mjs P0-01 [--no-push] [--trailer "Co-Authored-By: Name <email>"]...
 *
 * Run this ONLY after Jake has explicitly said to publish. The script itself never asks —
 * non-interactive tools cannot answer prompts — so the confirmation has to happen in chat.
 * It refuses when: lint fails, the index already holds other staged files, or the file is
 * unchanged. It never runs `git add -A`.
 */
import fs from 'node:fs'
import path from 'node:path'
import { spawnSync } from 'node:child_process'
import { fileURLToPath } from 'node:url'
import { ROOT, GEO_DIR, SITE, loadConfig, normalizeId, articleById, readMdx, rel } from './geo-lib.mjs'

const argv = process.argv.slice(2)
const dryRun = argv.includes('--dry-run')
const noPush = argv.includes('--no-push')
const trailers = []
for (let i = 0; i < argv.length; i++) if (argv[i] === '--trailer' && argv[i + 1]) trailers.push(argv[++i])
const rawId = argv.find((a) => !a.startsWith('--') && !trailers.includes(a))

function die(msg, code = 1) {
  console.error(`✖ ${msg}`)
  process.exit(code)
}
function git(args, opts = {}) {
  const r = spawnSync('git', args, { cwd: ROOT, encoding: 'utf8', ...opts })
  if (r.error) die(`git 执行失败：${r.error.message}`)
  return r
}

if (!rawId) die('用法: node scripts/geo-publish.mjs <article-id> [--dry-run] [--no-push] [--trailer "..."]', 2)
const id = normalizeId(rawId)
if (!id) die(`"${rawId}" 不是合法的文章 ID`, 2)

const config = loadConfig()
const a = articleById(config, id)
if (!a) die(`${id} 不在 geo/geo_agent_config.json 里`)
const file = path.join(GEO_DIR, `${a.slug}.mdx`)
if (!fs.existsSync(file)) die(`草稿不存在：${rel(file)}`)

// 1. lint must pass
const lintPath = path.join(path.dirname(fileURLToPath(import.meta.url)), 'geo-lint.mjs')
const lint = spawnSync(process.execPath, [lintPath, id], { cwd: ROOT, stdio: 'inherit' })
if (lint.status !== 0) die('lint 有 FAIL，先修再发')

// 2. git state
const branch = git(['rev-parse', '--abbrev-ref', 'HEAD']).stdout.trim()
const staged = git(['diff', '--cached', '--name-only']).stdout.trim()
if (staged) die(`index 里已经有别的文件在等待提交：\n${staged}\n先处理掉（git reset 或单独提交），本脚本只提交这一篇`)
const status = git(['status', '--porcelain', '--', rel(file)]).stdout
const code = status.slice(0, 2)
let verb
if (code.startsWith('??')) verb = 'add'
else if (/[ M]M|M /.test(code) || code.includes('M')) verb = 'rewrite'
else if (!status.trim()) die(`${rel(file)} 没有改动，没什么可发布的`)
else die(`无法判断文件状态（git status 输出 "${code}"）`)

const { data } = readMdx(file)
const shortTitle = String(data.title || a.title).replace(/\s+/g, ' ').slice(0, 40)
const subject = verb === 'add' ? `feat: add ${id} - ${shortTitle}` : `rewrite: ${id} - ${shortTitle}`
const url = `${SITE}/geo/${a.slug}`

console.log('\n发布计划')
console.log(`  分支：${branch}${branch !== 'main' ? '   ⚠ 不是 main，Vercel 生产环境只跟 main' : ''}`)
console.log(`  文件：${rel(file)}（${verb === 'add' ? '新文件' : '已发布文章的修改'}）+ 重新生成的 docs/OWNER.md、docs/STATUS.md`)
console.log(`  提交：${subject}`)
for (const t of trailers) console.log(`        ${t}`)
console.log(`  推送：${noPush ? '否（--no-push）' : 'git push origin main'}`)
console.log(`  上线：${url}（Vercel 约 2 分钟）`)

if (dryRun) {
  console.log('\n--dry-run，未执行。')
  process.exit(0)
}

// 3. regenerate the owner/status pages so the commit that changes what Jake sees also refreshes his page
const ownerPath = path.join(path.dirname(fileURLToPath(import.meta.url)), 'owner.mjs')
const regen = spawnSync(process.execPath, [ownerPath, '--write'], { cwd: ROOT, stdio: 'inherit' })
if (regen.status !== 0) die('owner.mjs --write 失败')

// 4. add this article + the regenerated pages (nothing else), commit, push
let r = git(['add', '--', rel(file), 'docs/OWNER.md', 'docs/STATUS.md'])
if (r.status !== 0) die(`git add 失败：${r.stderr}`)
const commitArgs = ['commit', '-m', subject]
for (const t of trailers) commitArgs.push('-m', t)
r = git(commitArgs, { stdio: 'inherit' })
if (r.status !== 0) die('git commit 失败（pre-commit hook 可能拦下了 frontmatter 问题）')
if (!noPush) {
  r = git(['push', 'origin', branch], { stdio: 'inherit' })
  if (r.status !== 0) die('git push 失败')
  console.log(`\n✓ 已推送。约 2 分钟后可访问 ${url}`)
  console.log(`  然后跑：node scripts/geo-status.mjs --backfill ${a.slug}`)
} else {
  console.log('\n✓ 已提交，未推送。最后手动 git push origin main。')
}
