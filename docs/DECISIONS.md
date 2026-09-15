# DECISIONS · 为什么是这样，以及是什么在强制它

> 只记三种决定：做起来难的、被推翻过的、新来的人会觉得不对劲的。
> 第四列是关键：强制它的如果是"人"，那就是没强制，写 `(unenforced)`，它就是待办。
> 单元格里不要用 `|`。`scripts/docs-check.mjs` 会检查每一行第四列非空。

| # | 决定 | 为什么 | 什么在强制它 |
|---|------|--------|--------------|
| D1 | `AGENTS.md` 是唯一的规则文件；`CLAUDE.md` 只有一行 `@AGENTS.md` 加 Claude 专用说明 | Cursor / Hermes / Codex 原生读 AGENTS.md，Claude Code 只读 CLAUDE.md；两份规则必然漂移。Windows 上 symlink 需要管理员权限，所以用导入 | docs-check：CLAUDE.md 第一行必须是 `@AGENTS.md` |
| D2 | 写文章的技能正本只在 `.claude/skills/geo-article/`；`.hermes/skills/geo-article/` 是纯指针 | Claude Code 和 Cursor 都读 `.claude/skills/`；Hermes 只读 `.hermes/skills/` 和 `.agents/skills/`，而且要求 `version:` 字段，Claude Code 不接受未知字段，无法共用一个文件 | docs-check：Hermes 文件不得含 `## Step`，且必须指向正本 |
| D3 | 文章的 JSON-LD 放在正文末尾唯一的 ```` ```json ```` 代码块里，不放 frontmatter | 页面 `extractJsonLd` 抽第一个 json 块注入 `<script>`，17 篇文章已按此写；改成 frontmatter 字段要同时改页面和全部文章 | geo-lint：json 块数量 ≠ 1 即 FAIL；geo-status 一致性行 |
| D4 | 内链只能指向已发布的文章 | 之前 30 处内链指向未写文章，线上 500 | geo-lint：链接目标不存在即 FAIL；geo-brief 把未写目标标成 ⏳ |
| D5 | 不存在的 slug 用 `export const dynamicParams = false` 变成 404，而不是在 lib 里加 `notFound()` | 一行改动、零 lib/API 变更；站点本来就是全静态，每次 push 重建 | docs-check：两个 slug 页面必须含这一行 |
| D6 | 脚本里的支柱列表和 JSON-LD 正则从站点源码读，不重抄 | 重抄的常量会和页面漂移 | geo-lib 解析 `app/(site)/geo/page.tsx`；docs-check 断言解析结果等于 config 的支柱集合 |
| D7 | 发布只在 Jake 在对话里明确说"发布"之后；`geo-publish` 永远不提问，只 add 那一篇加生成的 docs 页 | 非交互工具无法回答脚本提问；仓库公开，push 即发布 | 脚本层：geo-publish 在 lint FAIL、index 有其他文件、文件无改动时拒绝（已看它变红）。对话层：(unenforced) |
| D8 | 个人文件（简历、求职材料）和私有战略永远不进仓库 | 仓库公开，现任雇主能读 | .gitignore 根目录 `/*.pdf` `/*.txt` 和 `*.private.md`；docs-check 用 `git check-ignore` 验证，并验证 `public/` 不受波及 |
| D9 | 零编造：草稿可以写 `【待补：xxx】`，带【待补】的文章不能发布 | 网站此前出现过与事实不符的内容；prompt 模板旧规则甚至鼓励"合理估计" | geo-lint：含【待补】即 FAIL（fixture 已验证变红）；prompt 模板第 7 条已改写 |
| D10 | 主人页 `docs/OWNER.md` 和 `docs/STATUS.md` 只由脚本生成，任何数字不手写 | 手写文档在别的项目里几乎全部漂移，生成的两份零漂移 | docs-check：用页面自带的时间戳重新生成，必须逐字节一致；AGENTS.md 不得出现 "N 处 / N 篇" |
| D11 | 门槛 G1 的规则写在 `scripts/docs-lib.mjs` 的 `gateRules.G1`，到期前只能改严，到期未答 docs-check 变红 | 门槛写在散文里会被重新解释；看到结果再改规则不是测试 | docs-check：每个门槛有日期、有同名函数、`规则` 格子写明函数名；过期无结论即 FAIL |
| D12 | 博客置顶卡片的 "GEO 文章" 数字来自 `content/geo` 的实际数量 | 之前硬编码 60（计划数），实际 17，数字在替"忙"冒充"进展" | docs-check：页面不得出现字面量数字，必须是 `String(geoPosts.length)` |
| D13 | FAQ 两种格式（`### 问题` 与加粗行 `**问题？**`）都接受，模板推荐 `###` | 已发布 17 篇里 14 篇用加粗、3 篇用 ###，统一是内容决定（BACKLOG T9），不是工具该替 Jake 做的 | geo-lint 两种都计数；(unenforced) 统一与否 |
