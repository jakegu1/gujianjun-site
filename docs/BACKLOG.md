# BACKLOG · 待办，以及试过但否决的

> 当前在做：项目脚手架已搭好（AGENTS.md、写文章技能、脚本、账本文档）；下一步是新开一个 session 按 kick-start 提示词修已发布文章里的问题（T1–T5），然后从 P0-01 开始写。
> 现在最要紧的问题：素材包（W1）还不存在。没有它，铁律"零编造"会让下一篇新文章里大量句子变成【待补】，系列写不下去。

单元格里不要用 `|`。W = 只有 Jake 能做；T = AI 或任何人能做。`scripts/docs-check.mjs` 检查 W 行有截止日期和"如果你什么都不做"，T 行有验收命令。

## 需要 Jake 的（W）

| ID | 事项 | 截止 | 为什么是这个日期 | 做完的标志 | 卡在哪 | 如果你什么都不做 |
|---|---|---|---|---|---|---|
| W1 | 提供素材包：在 `docs/facts/` 里放你的真实数据，每条带口径（时间范围 + 来源）和"可公开 / 脱敏"标记 | 2026-09-22 | 下一篇文章（P0-01）和 T5 复查都要它；晚一周，写作就停一周 | `docs/facts/` 至少有一个文件，`docs/BRIEF.md` §5 第 1 条不再写"尚不存在" | 不卡 | 新文章要么满是【待补】要么只能复述旧文；18 篇案例的口径复查（T5）无法进行 |
| W2 | 逐条确认已上线的商业绝对值可不可以公开：`$5 CPL`、`$400 预算`、三天 1,500 封邮箱、10K→30K 自然点击、65 个 Top 10 词、2K+ AI 月引荐 | 2026-09-22 | 这些已经挂在线上；铁律 4 说没标"可公开"的绝对值不该出现 | 每个数字在素材包里有"可公开"或"改相对值"标记；T5 据此改写 | 不卡 | 线上继续挂着可能违反保密要求的数字，而且被追问时你没有口径 |
| W3 | 决定规范域名：`www.gujianjun.net`（推荐，Vercel 现在把不带 www 的 307 跳到它）还是不带 www | 2026-09-30 | 之后每篇文章的 JSON-LD 都按这个写，越晚改越多 | `AGENTS.md` 写明规范域名；T6 做完后全站只剩一种写法 | 不卡 | 17 篇文章的 url 和 @id 与实际域名不一致，实体信号打折 |
| W4 | 决定实体命名：JSON-LD 的 `name` 用 Jake Gu 还是顾简钧，"顾得"要不要作为 alternateName | 2026-09-30 | GEO 的实体一致性规则（案例库 C-1）是你自己总结的，现在站上三种写法混用 | `app/layout.tsx` 的 Person 有 name + alternateName + sameAs，所有文章的 author 一致（T7） | 不卡 | AI 可能把 Jake Gu / 顾得 / 顾简钧 当三个人，实体建立不起来 |
| W5 | 确认或改写门槛 G1（2026-10-31：≥ 6 篇新 GEO 文章且断链为 0，否则把计划从 60 缩到 Phase 1 的 31 篇） | 2026-09-22 | 门槛只能在到期前改，而且只能改严 | `docs/STRATEGY.md` 的 G1 行"结论"格之前的"问题"格前面加上"（Jake 已确认 日期）" | 不卡 | 到期那天 docs-check 变红，逼你当天回答；规则是我定的不是你定的 |
| W6 | 新开 session，贴 kick-start 提示词，让它修已发布文章（T1–T5） | 2026-09-30 | 这些问题线上可见，且每篇新文章都会继续链向它们 | `docs/STATUS.md` 里断链 0、"有机"0、lint FAIL 0 | T5 卡在 W1 / W2 | 断链和误译照旧；新文章只能少放内链 |

## 技术 / 写作待办（T）

| ID | 事项 | 验收 | 依赖 |
|---|---|---|---|
| T1 | 30 处内链指向未写文章：写出目标文章（P0-01、P4-01、P7-01、P4-04 各解 3 处，占 12 处）或把链接改成文字 | `node scripts/geo-status.mjs` 的"断链"行为 0 | 无 |
| T2 | 16 处"有机（搜索/流量/结果/排名）"改成"自然"（5 篇 GEO 文章 + 1 篇博客） | `docs/STATUS.md` 的"有机误译残留"为 0 处（`node scripts/owner.mjs --write` 后看） | 无 |
| T3 | P2-07 的 JSON-LD 非法（headline 里的英文引号未转义，线上已是坏的）；P4-03 缺 BreadcrumbList 且 JSON-LD 后面还有内容 | `node scripts/geo-lint.mjs P2-07` 和 `P4-03` 无 jsonld FAIL | 无 |
| T4 | 9 篇没有外部来源链接、5 篇开头没有编号要点、P3-02 汉字数只有目标的 76%、P3-03 正文 4 问 JSON-LD 3 问 | `docs/STATUS.md` 的 lint 表里 sources / opening / length / faq 的 WARN 为 0 | 无 |
| T5 | 18 篇博客按七条铁律逐篇复查：简历腔、每个数字的口径、商业敏感绝对值（标题里就有 `$5 CPL`、`$400`）；改完的每篇 commit 信息附"铁律自查" | 每篇 `git log --format=%b -1 -- content/posts/{slug}.mdx` 含"铁律自查" | W1、W2 |
| T6 | 统一规范域名：`metadataBase`、全部文章 JSON-LD 的 url / @id、模板、`lib` 里的 SITE 常量 | `grep -rn "gujianjun.net" app lib content .claude` 只出现一种写法 | W3 |
| T7 | 实体命名统一：Person 加 alternateName / sameAs，17 篇 author 一致；docs-check 增加一条检查 | 新增的 docs-check 条目为绿 | W4 |
| T8 | 接入 AI 引用数据源：把引用追踪表导出成 `data/ai-citations.json`，OWNER 页第 4 节"AI 引用"不再是"无数据" | `docs/OWNER.md` 第 4 节该行显示数字和口径 | Jake 提供追踪表 |
| T9 | FAQ 格式要不要统一（14 篇加粗行、3 篇 ###）：Jake 决定后统一 | 17 篇同一格式，geo-lint 收紧为只认一种 | Jake 决定 |
| T10 | `geo/publish.sh` 与 `geo-publish.mjs` 功能重复；确认没人用 shell 版后删除 | 文件不存在，AGENTS.md 无引用 | Jake 确认 |

## 已关闭 / 已否决（带证据）

| ID | 事项 | 结论 | 证据 |
|---|---|---|---|
| C1 | 不存在的 /geo/{slug} 返回 500 | 已修 2026-09-15：两个 slug 页面加 `dynamicParams = false` | 修前 `curl /geo/geo-guide` → 500；修后本地 build 通过，上线后应为 404 |
| C2 | `content/posts/goeast-case-study-link-map.md`（内部参考，无 frontmatter）被当文章渲染并进 sitemap | 已修 2026-09-15：移到 `docs/` | 修前线上 HTTP 200 且 sitemap 含该 URL |
| C3 | 两个个人文件（简历 PDF、求职要求 TXT）躺在公开仓库工作区 | 已处理 2026-09-15：移到 `D:\Work\personal-docs\`，.gitignore 加根目录 `/*.pdf` `/*.txt` | `git log --all` 证明从未提交过；`git check-ignore` 验证规则生效 |
| C4 | 博客置顶卡片写着"60 GEO 文章" | 已修 2026-09-15：改为 `content/geo` 实际数量 | 硬编码 60（计划数）vs 实际 17 |
| C5 | `QCLAW_INSTRUCTIONS.md` → `OPENCLAW_INSTRUCTIONS.md` 改名未提交，且内容与技能重复 | 已处理 2026-09-15：先提交改名保留历史，再缩成指针 | 旧文件自身有 4 处不一致（标题仍是 Qclaw、content/posts、/blog/、"中文…面向国际读者"） |
| R1 | `CLAUDE.md` 用 symlink 指向 `AGENTS.md` | 否决 | Windows 上建 symlink 需要管理员或开发者模式（Claude Code 文档明说），改用 `@AGENTS.md` 导入 |
| R2 | 技能只放 `.agents/skills/` 一份给三个工具共用 | 否决 | Claude Code 不读 `.agents/skills`；Cursor 同时读 `.agents` 和 `.claude`，两处同名会撞。改为 `.claude/skills` 正本 + `.hermes/skills` 指针 |
| R3 | 在 lib 里给不存在的 slug 加 `notFound()` | 否决 | 要改 lib 两个文件、两个页面和两个 API 路由；`dynamicParams = false` 一行等效，API 路由本来就 404 |
| R4 | 现在就做打分制 SCORECARD | 推迟到 T8 之后 | 没有任何外部数据源接入，分数只会衡量"写了多少代码"，正是 project-ledger 点名的反模式 |
| R5 | 用脚本自动把断链改成纯文字 | 否决 | 目标文章都在计划里，先写还是先去链是内容决定，T1 逐篇处理 |
| R6 | 把新的七条铁律直接写进 AGENTS.md 正文 | 部分否决 | 铁律进了 `docs/BRIEF.md`，AGENTS.md 只放指针和优先级；战略目的含薪资和创业计划，仓库公开，放进 `docs/BRIEF.private.md` 并 ignore |
