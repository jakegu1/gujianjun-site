#!/usr/bin/env node
/**
 * Generates docs/OWNER.md (the owner page) and docs/STATUS.md (the detailed status) from source:
 * geo config + content/ + geo-lint + git log + the hand-maintained ledger tables in docs/.
 *
 *   node scripts/owner.mjs --write               # regenerate both, as of now
 *   node scripts/owner.mjs --stdout owner|status # print one page
 *   node scripts/owner.mjs --asof <ISO> ...      # regenerate as of a fixed instant (docs-check uses this
 *                                                #   to prove the committed pages were not hand-edited)
 *
 * Header line format is load-bearing: docs-check parses the timestamp out of it.
 */
import fs from 'node:fs'
import { computeStatus, lintAll, organicOccurrences, gitLog } from './geo-lib.mjs'
import { docPath, parseBacklog, parseGates, parseMistakes, parseGlossary, strategyParagraph, daysUntil, gateRules } from './docs-lib.mjs'

const argv = process.argv.slice(2)
const arg = (name) => {
  const i = argv.indexOf(name)
  return i >= 0 ? argv[i + 1] : null
}
const asof = arg('--asof') || new Date().toISOString()
const asofDay = asof.slice(0, 10)
const write = argv.includes('--write')
const stdout = arg('--stdout')

const status = computeStatus()
const lint = lintAll()
const organic = organicOccurrences()
const log = gitLog({ until: asof, days: 14, max: 20 })
const backlog = parseBacklog()
const gates = parseGates()
const mistakes = parseMistakes()
const glossary = parseGlossary()

const header = (name) => `<!-- generated: ${asof} by scripts/owner.mjs (${name}) — do not edit; regenerate with: node scripts/owner.mjs --write -->`
const esc = (s) => String(s ?? '').replace(/\|/g, '｜').replace(/\r?\n/g, ' ')
const table = (headers, rows) => [`| ${headers.join(' | ')} |`, `|${headers.map(() => '---').join('|')}|`, ...rows.map((r) => `| ${r.map(esc).join(' | ')} |`)].join('\n')
const countdown = (d) => {
  const n = daysUntil(d, asof)
  if (n == null) return '日期无效'
  if (n < 0) return `已过 ${-n} 天`
  if (n === 0) return '今天'
  return `${n} 天`
}

const cleanCount = lint.filter((r) => r.ok).length
const failByRule = {}
for (const r of lint) for (const rule of new Set(r.fails.map((f) => f.rule))) failByRule[rule] = (failByRule[rule] || 0) + 1
const organicTotal = organic.reduce((a, b) => a + b.count, 0)
const phase1 = status.phases.find((p) => p.name === 'phase_1')
const lastDate = status.words.map((w) => w.date).filter(Boolean).sort().at(-1) || '无'
const noFm = status.posts.filter((p) => !p.frontmatter).length
const gateRows = gates.map((g) => {
  const rule = gateRules[g['ID']]
  const r = rule ? rule(status) : { reading: '（代码里没有这条规则）', pass: null }
  return { ...g, reading: r.reading, pass: r.pass }
})

// ───────────────────────────── OWNER.md ─────────────────────────────
function renderOwner() {
  const out = []
  out.push('# gujianjun.net · 主人页')
  out.push('')
  out.push(header('OWNER'))
  out.push('')
  out.push(`生成于 ${asofDay}。这一页是脚本从仓库算出来的，不是手写的：改了源头就跑 \`node scripts/owner.mjs --write\`，手改会被 \`node scripts/docs-check.mjs\` 打回。`)
  out.push('')

  out.push('## 1. 这是什么，现在最要紧的一个问题')
  out.push('')
  out.push(strategyParagraph() || '【待补：docs/STRATEGY.md 里写 "## 一段话"】')
  out.push('')
  out.push(`**现在最要紧的问题：** ${backlog.question || '【待补：BACKLOG.md 里写一行 "> 现在最要紧的问题："】'}`)
  out.push('')

  out.push('## 2. 需要你做的，最急的在前')
  out.push('')
  const w = [...backlog.w].sort((a, b) => String(a['截止']).localeCompare(String(b['截止'])))
  if (!w.length) out.push('现在没有只有你能做的事。')
  else
    out.push(
      table(
        ['ID', '事项', '截止', '还剩', '为什么是这个日期', '做完的标志', '卡在哪', '如果你什么都不做'],
        w.map((r) => [r['ID'], r['事项'], r['截止'], countdown(r['截止']), r['为什么是这个日期'], r['做完的标志'], r['卡在哪'] || '不卡', r['如果你什么都不做'] || '【待补：这一格不能空】']),
      ),
    )
  out.push('')

  out.push('## 3. 决定去留的日期')
  out.push('')
  if (!gateRows.length) out.push('没有门槛。')
  else
    out.push(
      table(
        ['门槛', '日期', '还剩', '问题', '现在的读数', '若否', '结论'],
        gateRows.map((g) => [g['ID'], g['日期'], countdown(g['日期']), g['问题'], g.reading, g['若否'], g['结论'] || '（到期当天写）']),
      ),
    )
  out.push('')
  out.push('规则写在代码里（`scripts/docs-lib.mjs` 的 `gateRules`），到期前只能改严，到期未答 docs-check 会变红。')
  out.push('')

  out.push('## 4. 现在的状态（每个数字都来自源码，不是手写）')
  out.push('')
  out.push(
    table(
      ['指标', '数值', '来源', '写代码能推动吗'],
      [
        ['GEO 系列已发布', `${status.totals.written} / ${status.totals.planned}`, 'content/geo 对照 geo_agent_config.json', '能'],
        ['Phase 1（核心页）已发布', phase1 ? `${phase1.written.length} / ${phase1.total}` : '?', '同上', '能'],
        ['最近一篇 GEO 文章的日期', lastDate, 'content/geo frontmatter', '能'],
        ['断链（指向不存在的文章）', `${status.brokenLinks.length} 处`, 'scripts/geo-status.mjs', '能'],
        ['已发布 GEO 文章里 lint 零 FAIL 的', `${cleanCount} / ${lint.length}`, 'scripts/geo-lint.mjs', '能'],
        ['lint FAIL 按规则（篇数）', Object.entries(failByRule).sort().map(([k, v]) => `${k} ${v}`).join('，') || '无', 'scripts/geo-lint.mjs', '能'],
        ['"有机"误译残留', `${organicTotal} 处，${organic.length} 个文件`, 'grep content/', '能'],
        ['博客 / 案例文章', `${status.posts.length} 篇（其中无 frontmatter ${noFm} 篇）`, 'content/posts', '能'],
        ['AI 平台引用 gujianjun.net 的次数', '无数据：还没接入引用追踪表（BACKLOG T8）', '—', '不能，只有外部世界能'],
        ['招聘方 / 客户主动联系', '无数据：没有记录渠道', '—', '不能'],
      ],
    ),
  )
  out.push('')
  out.push('最后两行是这个项目真正的目的，代码碰不到它们。上面的数字全绿也只说明"活干完了"，不说明"目的达到了"。')
  out.push('')

  out.push('## 5. AI 现在在做什么')
  out.push('')
  out.push(backlog.now || '【待补：BACKLOG.md 里写一行 "> 当前在做："】')
  out.push('')

  out.push(`## 6. 最近 14 天改了什么（git log，最多 ${log.max} 条${log.truncated ? `，已截断：共 ${log.total} 条` : ''}）`)
  out.push('')
  if (!log.lines.length) out.push('这 14 天没有提交。')
  else for (const l of log.lines) out.push(`- ${l}`)
  out.push('')

  out.push('## 7. 我搞错过什么')
  out.push('')
  const m = [...mistakes].sort((a, b) => String(b['日期']).localeCompare(String(a['日期'])))
  if (!m.length) out.push('MISTAKES.md 是空的。这不是好消息，是没人查过。')
  else out.push(table(['日期', '我当时的说法', '实际情况', '怎么发现的'], m.slice(0, 6).map((r) => [r['日期'], r['我当时的说法'], r['实际情况'], r['怎么发现的']])))
  out.push('')
  const latest = m[0] ? m[0]['日期'] : '无'
  out.push(`最新一条：${latest}。超过 14 天没有新条目，docs-check 会变红；那时我必须写明"这两周检查过，没发现错误"并署日期，这句话本身以后也可能被证明是错的。`)
  out.push('')

  out.push('## 8. 不读代码怎么检查我')
  out.push('')
  out.push('1. 浏览器打开 https://www.gujianjun.net/geo/geo-guide 。看到站点自己的 404 页就对了；看到 "Internal Server Error" 说明断链修复没上线。')
  out.push(`2. 打开 https://www.gujianjun.net/blog ，置顶卡片上 "GEO 文章" 的数字应该等于 ${status.totals.written}（本页第 4 节的已发布数）。不等就是页面在撒谎。`)
  out.push('3. 终端里跑 `node scripts/geo-status.mjs`：第二行 "已写 X / 60" 是进度；"断链" 那行的数字是 0 才算 BACKLOG T1 完成。')
  out.push('4. 终端里跑 `node scripts/docs-check.mjs`：最后一行是 `✓ all checks passed`，否则它会列出哪一条红了、为什么。')
  out.push('5. 看本页第一行"生成于"的日期：超过 7 天，说明没人跑过 `--write`，这页可能已经过时（docs-check 会提醒）。')
  out.push('')

  out.push('## 9. 术语表')
  out.push('')
  if (!glossary.length) out.push('【待补：docs/GLOSSARY.md】')
  else out.push(table(['词', '意思'], glossary.map((r) => [r['词'], r['意思']])))
  out.push('')
  out.push('> 这页哪里看不懂，是这页的缺陷，不是你的问题。指出是哪一行，它就会被重写。')
  out.push('')
  return out.join('\n')
}

// ───────────────────────────── STATUS.md ─────────────────────────────
function renderStatus() {
  const out = []
  out.push('# gujianjun.net · 内容状态')
  out.push('')
  out.push(header('STATUS'))
  out.push('')
  out.push(`生成于 ${asofDay}。GEO 系列已发布 ${status.totals.written} / ${status.totals.planned}，未写 ${status.totals.unwritten}。终端版：\`node scripts/geo-status.mjs\`。`)
  out.push('')
  out.push('## 按阶段')
  out.push('')
  for (const p of status.phases) {
    out.push(`### ${p.name.replace('_', ' ')} · ${p.description} — 已写 ${p.written.length} / ${p.total}`)
    out.push('')
    out.push(`已写：${p.written.join('、') || '无'}`)
    out.push('')
    if (p.unwritten.length) {
      out.push(table(['ID', '支柱', '目标字数', 'slug', '选题'], p.unwritten.map((a) => [a.id, a.pillar, a.target_words, a.slug, a.title])))
      out.push('')
    }
  }
  out.push('## 按支柱')
  out.push('')
  out.push(table(['支柱', '已写 / 计划', '未写'], status.pillars.map((p) => [p.name, `${p.written.length} / ${p.total}`, p.unwritten.join('、') || '—'])))
  out.push('')
  out.push('## 发布节奏（按 frontmatter date 的月份）')
  out.push('')
  out.push(table(['月份', '篇数'], status.timeline.map(([m, n]) => [m, n])))
  out.push('')
  out.push('## 已发布 GEO 文章的 lint 结果')
  out.push('')
  out.push(
    table(
      ['ID', 'slug', 'FAIL', 'WARN', '汉字 / 目标'],
      lint.map((r) => {
        const w = status.words.find((x) => x.slug === r.slug)
        return [r.id, r.slug, [...new Set(r.fails.map((f) => f.rule))].join('，') || '—', [...new Set(r.warns.map((f) => f.rule))].join('，') || '—', w ? `${w.cjk} / ${w.target ?? '?'}` : '?']
      }),
    ),
  )
  out.push('')
  out.push(`零 FAIL：${cleanCount} / ${lint.length}。FAIL 按规则（篇数）：${Object.entries(failByRule).sort().map(([k, v]) => `${k} ${v}`).join('，') || '无'}。`)
  out.push('')
  out.push(`## 断链：${status.brokenLinks.length} 处`)
  out.push('')
  if (status.brokenLinks.length) out.push(table(['来自', 'slug', '指向', '目标 ID'], status.brokenLinks.map((b) => [b.from, b.fromSlug, b.href, b.targetId])))
  else out.push('无。')
  out.push('')
  out.push(`## "有机"误译残留：${organicTotal} 处`)
  out.push('')
  if (organic.length) out.push(table(['文件', '处数'], organic.map((o) => [o.file, o.count])))
  else out.push('无。')
  out.push('')
  out.push('## 一致性')
  out.push('')
  const c = status.consistency
  out.push(`- frontmatter 解析失败：${c.parseErrors.map((x) => `${x.slug}（${x.error}）`).join('，') || '无'}`)
  out.push(`- articleId 不在 config：${c.notInConfig.map((x) => `${x.slug}（${x.articleId || '空'}）`).join('，') || '无'}`)
  out.push(`- slug 与 config 不一致：${c.slugMismatch.map((x) => `${x.id}: ${x.slug} ≠ ${x.expected}`).join('，') || '无'}`)
  out.push(`- pillar 与 config 不一致：${c.pillarMismatch.map((x) => `${x.id}: ${x.pillar} ≠ ${x.expected}`).join('，') || '无'}`)
  out.push('')
  out.push(`## 博客 / 案例文章（content/posts）：${status.posts.length} 篇`)
  out.push('')
  out.push(table(['日期', 'slug', '标题', 'tags', '汉字'], status.posts.map((p) => [p.date || '（无）', p.slug, p.title || (p.error ? `解析失败：${p.error}` : '（无 frontmatter）'), p.tags.join('，'), p.cjk])))
  out.push('')
  return out.join('\n')
}

const owner = renderOwner()
const statusMd = renderStatus()

if (stdout === 'owner') console.log(owner)
else if (stdout === 'status') console.log(statusMd)
else if (stdout === 'all') console.log(JSON.stringify({ asof, owner, status: statusMd }))
if (write) {
  fs.writeFileSync(docPath('OWNER.md'), owner)
  fs.writeFileSync(docPath('STATUS.md'), statusMd)
  console.log(`✓ wrote docs/OWNER.md and docs/STATUS.md (as of ${asof})`)
}
if (!stdout && !write) {
  console.log('用法: node scripts/owner.mjs --write | --stdout owner|status|all [--asof ISO]')
  process.exit(2)
}
