---
name: geo-article
description: 为 gujianjun.net 的 GEO 教程系列写一篇文章。触发词："写 P0-01"、"帮我写 P3-05"、"写 P1-01 到 P1-05"、"write P4-02"、"重写 P2-03"、"发布 P0-01"。按 config ID 走完 简报 → 装载上下文 → 起草 → lint → 预览 的完整流程，然后停下等 Jake 确认；只有 Jake 明确说发布后才 commit + push（push 即上线）。
argument-hint: <article-id e.g. P0-01> [rewrite]
---

# 写一篇 GEO 系列文章

目标文章：`$ARGUMENTS`（Claude Code 会填；在 Cursor / Hermes 里从用户消息里取 ID，格式 `P{0-10}-{两位数}`）。

先读一遍仓库根目录的 `AGENTS.md`（渲染规则、ID 规则、风格优先级、Git 纪律都在那）。本技能只写流程。

**两条不可越过的线：**
1. 内链只能指向已经发布的文章。不存在的 `/geo/{slug}` 线上是 HTTP 500。
2. 写到 Step 5 的预览就停。commit / push 只在 Jake 明确说"发布 / 上线 / push / 保存并发布"之后做。"看起来不错"不算确认，"好"也不算，要问清楚。

## Step 1 · 简报（脚本，不要自己翻 JSON）

```bash
node scripts/geo-brief.mjs P0-01
```

输出里有：config 记录（id / pillar / type / target_words / content_brief / suggested_h2s / example_guidance）、目标文件路径、文件是否已存在、每条 internal_link 现在是 ✅ 已发布 还是 ⏳ 未写、系列里已用的 tag 及频率、今天的日期。

- ID 不在 config → 停，告诉 Jake。
- 文件已存在且用户没说"重写" → 停，问是重写还是别的。重写模式见文末。
- 只链接 ✅ 的目标。⏳ 的目标在正文里可以用文字提一句，不加链接；发布后 `geo-status --backfill` 会提醒回填。

## Step 2 · 装载上下文（按这个顺序读，冲突时前者胜）

0. `docs/BRIEF.md`：你是谁、为谁写、七条铁律、允许的事实来源。存在 `docs/BRIEF.private.md`（不进 git）就先读它。铁律高于下面所有规则，违反任何一条整篇重写。素材包（`docs/facts/`）不存在时，凡是需要新事实的句子一律写 `【待补：xxx】`。
1. `geo/jake-writing-style-guide.md` 全文。**§10 Feedback Log 最新条目优先级最高**，§11 是每篇必须满足的硬规则。
2. `geo/geo-article-prompt-template.md` 里 ```` ``` ```` 代码块内的 system prompt。把简报里的变量代入 `{{title}}` `{{url}}` `{{content_brief}}` `{{target_words}}` `{{type}}` `{{suggested_h2s}}` `{{internal_link_count}}` `{{internal_links}}` `{{example_guidance}}`。
   `{{internal_link_count}}` 和 `{{internal_links}}` 只算 ✅ 的。忽略它说的 "written in English" 和 "150–160 字符"，文章是中文。
3. `geo/jake-geo-cases.md`：按文章主题挑模块（A 结构与写法、B 技术、C 实体、D 平台、E 内容类型、F 话题权威、G 衡量、H 优先级与误区、I 行业）。🔵 第一人称、🟡 第三方视角、🟢 当数据支撑；带 ⚠️ 的数字只说趋势。
4. `geo/GEO_Knowledge_Base.md`：只读相关章节（目录在文件开头）。数据可能过时，用自己的知识补充时要标注年份和来源。
5. 已发布的 2–3 篇同支柱文章（`content/geo/`）：看真实的语气、H2 写法、FAQ 格式、JSON-LD 形状，和它们保持一致。

## Step 3 · 起草

用 `.claude/skills/geo-article/templates/article.mdx` 的骨架。写之前把这几条钉死：

- **H1 / title**：中文，含主关键词，Jake 的语气（有判断），不是 config 英文标题的直译，不用"完全指南"。
- **开头**：第一句就是结论（命题式，带数据 + 可打开的来源链接）；引言后用编号列表把核心要点先放出来；然后才是正文。
- **H2**：每节首句直接给结论；每节能脱离上下文独立成立；每个 H2 至少 1–2 条 "X 是 Y / X 导致 Y" 的陈述并带数据来源；节末给读者一个动作。
- **案例配比**：按 example_guidance 和风格指南 §7。GoEast 不连续超过 3 段；至少一个语言教育之外的行业例子；GoEast 例子后面要提炼可迁移的原则。
- **改写对比**：方法论类文章至少一组完整的"改写前 / 改写后"，最好覆盖两个行业。
- **命名技巧**：可操作的技巧给一个可记忆的名字（"首句法则"这种）。
- **On-Page GEO / Technical GEO 支柱**：必须有一段提醒读者先检查 robots.txt 放行 GPTBot / CCBot / ClaudeBot / Google-Extended / PerplexityBot。
- **引用**：每个数字都要有真实链接 `[来源, 年份](URL)`；不确定 URL 就只写出处不加链接。绝不编 URL。外链 2–4 个，优先一手来源。
- **铁律**（`docs/BRIEF.md` §4）：零编造，只用素材包和已发布事实，缺就写 `【待补：xxx】`；每个数字带口径（时间范围 + 来源）；不利信息照写，写成"我发现的问题和我的应对"；雇主敏感绝对值（内部定价、CPL、转化率、账户 ID）不写，用相对值或区间；假设性例子明确写"假设"，不能冒充 Jake 的经历；不写"我负责了 / 参与了"，写"问题 → 判断 → 取舍 → 结果 → 重来会怎样"；一篇只打一个点。
- **内链**：3–7 个，只用 ✅ 目标，锚文本多样，分散在正文里，不堆在结尾。路径写 `/geo/{slug}/`。
- **FAQ**：`## 常见问题`，3–5 个 `### 问题？`，每个答案第一句就是答案，2–4 句，自包含。（已发布文章里 14 篇用加粗行 `**问题？**`、3 篇用 `###`，lint 两种都认；新文用 `###`，标题能进 chunk 元数据。Jake 若决定统一，改这一行。）
- **JSON-LD**：文末唯一的 ```` ```json ```` 块，`@graph` = Article（`@id` `{url}#article`，author 用 `https://gujianjun.net/#person` 的 Person 实体，datePublished = date，dateModified = date）+ BreadcrumbList（首页 / GEO 教程系列 / 本文）+ FAQPage（问题和答案与正文 FAQ 完全一致）。示例 JSON 用 ```` ```jsonc ````。
- **字数**：正文汉字数 ≥ target_words 的 90%。写不够不要灌水，回去补一个案例或一组对比。
- **不要**：HTML 注释、`<script>`、英文双引号出现在 frontmatter 值里、"有机搜索"（要写"自然搜索"）、prompt 模板和风格指南里的黑名单词。

写完先按 Feedback Log 逐条自查一遍（尤其 2026-03-26 的 12 条精修：语气词、"我"开头、H2 有态度、比喻带一句解释和小玩笑、术语与通俗互注）。

## Step 4 · 保存 + lint

保存到 `content/geo/{slug}.mdx`（slug 来自简报），frontmatter 用简报给的 date（今天）。然后：

```bash
node scripts/geo-lint.mjs P0-01
node scripts/check-frontmatter.mjs content/geo/{slug}.mdx
```

有 FAIL 就改到没有。WARN 逐条看：能改就改，不改要在预览里说明为什么。

## Step 5 · 预览，然后停

给 Jake 看，格式固定：

1. 文件路径
2. frontmatter 全文
3. H2 目录（一行一个）
4. 正文前 500 字
5. 汉字数 / 目标字数、内链数（列出目标）、外链数（列出 URL）、FAQ 题数
6. lint 结果（FAIL / WARN 各几条，WARN 内容）
7. 这篇用了哪些案例（🔵 / 🟡 / 🟢 各几个）
8. 铁律自查：七条逐条写"遵守 / 未涉及 / 待确认"，每条附一句证据（例如"③：第 4 节写了 Kids 线 CPA 高于预期"；"④：没有出现绝对值，CPL 用了相对变化"）
9. `【待补：…】` 清单：有几处、各缺什么。有一处就不能发布，只能等 Jake 补事实或删句子

最后一句固定问："草稿已保存到 content/geo/{slug}.mdx，还没有提交。要修改哪里？还是可以发布？"（有【待补】时改成："有 N 处【待补】，补上或删掉之前不能发布，你先看哪一处？"）

**到这里停下。不要 git add，不要 commit，不要 push。** 等 Jake 回复。修改意见来了就改、重跑 lint、再预览。

## Step 6 · 发布（只在 Jake 明确说发布之后）

```bash
node scripts/geo-publish.mjs P0-01 --dry-run    # 先看计划
node scripts/geo-publish.mjs P0-01 --trailer "Co-Authored-By: <本工具的署名>"
```

脚本会：重跑 lint → 检查 index 里没有别的文件 → 重新生成 `docs/OWNER.md` 和 `docs/STATUS.md` → 只 add 这一篇加这两个生成页 → `feat: add P0-01 - 短标题` → `git push origin main`。任何一步失败就停，不要绕过。

发布后告诉 Jake：URL `https://gujianjun.net/geo/{slug}`，Vercel 约 2 分钟。然后跑：

```bash
node scripts/geo-status.mjs --backfill {slug}
```

它列出哪些已发布文章按 config 应该链到这篇但还没链。列给 Jake，问要不要回填（回填也是改已发布文章，同样要确认后再 commit）。

## 批量（"写 P1-01 到 P1-05"）

逐篇走 Step 1–5，每篇都停下等确认。确认过的可以攒着一起发布：逐篇跑 `geo-publish.mjs --no-push`，最后一次 `git push origin main`。顺序按 config 的 `priority`（1 先）。

## 重写模式（"重写 P2-03"）

1. 先读现有文件，列出这篇当前的 lint 结果和 Jake 的重写理由。
2. datePublished 保留原值，frontmatter `date` 不变，JSON-LD `dateModified` 改为今天。
3. 不要改 slug、articleId、pillar。已有的内链目标如果仍然 ✅ 就保留。
4. 其余同 Step 3–6；commit 信息会自动变成 `rewrite: P2-03 - 短标题`。

## 绝不做的事

- `git add -A`、`git add .`、`git push --force`、改 `geo/geo_agent_config.json` 里的 slug。
- 把简历、求职材料之类的个人文件加进 git。
- 在没有确认的情况下 commit 或 push。
- 为了凑字数或凑数据编造案例、数字、URL。
