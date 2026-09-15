# gujianjun.net — 项目说明（所有 AI 工具共用）

> 这是本仓库唯一的权威规则文件。Cursor、Hermes、Codex 直接读它；Claude Code 通过 `CLAUDE.md` 里的 `@AGENTS.md` 导入。规则只改这一份。
> 写任何文章之前先读 `docs/BRIEF.md`（你是谁、为谁写、七条铁律）；如果存在 `docs/BRIEF.private.md`（不进 git），也先读它。
> 写文章的完整流程在 `.claude/skills/geo-article/SKILL.md`。进度、未写清单、问题清单在生成的 `docs/OWNER.md` 和 `docs/STATUS.md`，不在这里手抄。

## 这是什么

Jake Gu（顾简钧）的个人站 https://gujianjun.net ：首页（简历 + GoEast 案例）+ 博客 `/blog` + 计划 60 篇的 GEO 教程系列 `/geo`。
站点语言 zh-CN。所有文章用中文写，专业术语保留英文（RAG、chunking、Schema、reranker）。

## 技术栈

- Next.js 16.1 App Router（`app/(site)/…`）、React 19、Tailwind 4、TypeScript。没有数据库。
- 内容 = MDX 文件。`lib/posts.ts` / `lib/geo-posts.ts` 用 `gray-matter` 读 frontmatter，页面用 `next-mdx-remote/rsc` + `remark-gfm` 渲染。
- Keystatic（`keystatic.config.ts`，storage local，后台 `/keystatic`）只挂了 `content/posts`，字段只有 title/date/excerpt/tags/coverImage。
  它不知道 `content/geo`，也不认识 posts 里的 `description`/`category`/`client` 字段。不要用 Keystatic 改现有文章，会丢字段；直接改文件。
- 部署：Vercel。`git push origin main` 即上线，约 2 分钟，没有 staging。构建失败时 Vercel 保留上一版，线上不会变，也不会报错给你。
- `middleware.ts`：`/blog/*` 和 `/geo/*` 收到 `Accept: text/markdown` 时返回原始 Markdown（给 AI agent 用）。
- `app/robots.txt/route.ts` 显式放行 GPTBot / CCBot / ClaudeBot / PerplexityBot / Google-Extended。`app/sitemap.xml/route.ts` 自动收录全部文章和 tag 页。
- 提交前钩子 `.husky/pre-commit`：改了 `content/` 就跑 `scripts/check-frontmatter.mjs`（frontmatter YAML 错误曾让 `/blog` 整页挂掉）；改了 `docs/`、`scripts/`、规则文件或 slug 页面就跑 `scripts/docs-check.mjs`。

## 常用命令

```bash
npm run dev                          # http://localhost:3000
npm run build                        # 等价于 Vercel 的构建；改了 app/ 或 lib/ 上线前跑一次
npm run check:frontmatter            # 扫全部 content/ 的 frontmatter
node scripts/geo-status.mjs          # 60 篇里已写/未写按 phase 列出、断链；--posts 看博客；--backfill <slug>
node scripts/geo-brief.mjs P0-01     # 某一篇的写作简报（config 记录 + 变量 + 现在能链接的文章）
node scripts/geo-lint.mjs P0-01      # 检查草稿；有 FAIL 就不能发
node scripts/geo-publish.mjs P0-01 --dry-run   # 看发布计划；去掉 --dry-run 才真的 add/commit/push
node scripts/owner.mjs --write       # 重新生成 docs/OWNER.md 和 docs/STATUS.md
node scripts/docs-check.mjs          # 账本文档的测试：生成页没被手改、门槛没过期、个人文件没漏进仓库……
```

脚本是纯 Node（v24），只依赖已有的 `gray-matter`，在 Claude Code / Cursor / Hermes / 终端里都一样跑。

## 改完东西之后的顺序（顺序错了就会发布过时的东西）

1. 改文章 → `node scripts/geo-lint.mjs <ID>` → `npm run check:frontmatter`。
2. 改了 `app/` 或 `lib/` → `npm run build`。
3. 改了 `docs/` 里任何手写文件，或做了会改变 Jake 要做什么的事 → `node scripts/owner.mjs --write` → `node scripts/docs-check.mjs`。
4. 一个发现一个 commit，先看到红再修；commit 信息里写红长什么样。
5. 文章的 push 只在 Jake 明确说"发布"之后（`geo-publish` 会连生成的 docs 页一起提交）。

## 内容模型

| 目录 | 路由 | frontmatter | 说明 |
|---|---|---|---|
| `content/posts/*.mdx` | `/blog/{slug}` | title, date, excerpt 或 description, tags, (category, client) | 博客与 GoEast 案例，slug = 文件名 |
| `content/geo/*.mdx` | `/geo/{slug}` | title, date, excerpt, tags, pillar, articleId | GEO 系列，slug = 文件名 = config 里的 slug |

渲染规则（来自 `app/(site)/geo/[slug]/page.tsx`，改文章前必须知道）：

1. 正文里**第一个** ```` ```json ```` 代码块会被整块抽走，作为页面 JSON-LD 注入 `<script type="application/ld+json">`，不显示。
   所以每篇只能有一个 ```` ```json ```` 块，放在文末，内容是 `@graph`: Article + BreadcrumbList + FAQPage。示例代码一律用 ```` ```jsonc ````。
2. `pillar` 必须是 `app/(site)/geo/page.tsx` 里 `pillarOrder` 的 11 个名字之一，否则文章在 `/geo` 列表里不显示（URL 仍能打开）。
3. `tags` 会各生成一个 `/tag/{tag}` 页面并进 sitemap。复用已有 tag（`geo-brief` 会列出频率），别造近义词。
4. frontmatter 是 YAML：值里出现英文双引号会让 `next build` 失败。用单引号、「」或改写。
5. 两个 slug 页面都设了 `dynamicParams = false`：不存在的 `/geo/{slug}` 是 404（以前是 500）。**内链只能指向已经写好的文章。**
6. MDX 里不能用 HTML 注释 `<!-- -->`（构建失败，2026-03-26 踩过），要注释用 `{/* */}`。

## 文章 ID 规则（GEO 系列）

- 唯一数据源：`geo/geo_agent_config.json`。60 篇，每篇有 id、slug、pillar、title、type、priority、target_words、content_brief、suggested_h2s、internal_links、example_guidance；`publishing_phases` 分三期。
- ID = `P{支柱号}-{两位序号}`。P0 Hub · P1 Foundations · P2 AI Technical · P3 Strategy · P4 On-Page GEO · P5 Technical GEO · P6 Multi-Platform · P7 Measurement · P8 Advanced · P9 Workflow · P10 Case Studies。
- 文件名 = config 的 slug，绝不自拟。`articleId`、`pillar` 与 config 一致，`geo-lint` 会核对。
- config 里的英文 `title` 是**选题**，不是 H1。H1 和 frontmatter title 用中文按 Jake 的风格重写（含主关键词），slug 不变。
- `target_words` 按正文汉字数算（不含 JSON-LD 块）。低于 90% 视为没写够，不要灌水，去补案例或对比。
- 已写 / 未写不要靠记忆，跑 `node scripts/geo-status.mjs` 或看 `docs/STATUS.md`。
- 一篇文章一个 commit：新文 `feat: add P1-01 - 短标题`，重写 `rewrite: P1-01 - 短标题`。`geo-publish` 会自动生成。

## 写作规则的优先级（冲突时按此顺序）

0. `docs/BRIEF.md` §4 的七条铁律：零编造（缺就写 `【待补：xxx】`）、数字带口径、不利信息照写、保护雇主、不写简历腔、禁 AI 腔、一篇只打一个点。违反任何一条整篇重写。
1. `geo/jake-writing-style-guide.md` **§10 Feedback Log** —— 越新的条目优先级越高。这是 Jake 逐句校对后的结论。
2. 同文件 §11 永久质量规则：结论先行 + 引言后编号要点；每个 H2 独立成块；每个 H2 至少 1–2 条带数据和来源的命题式陈述；FAQ ≥ 3 问；Article + FAQPage + BreadcrumbList JSON-LD 且 author 是 Person 实体；可操作技巧要命名；On-Page GEO / Technical GEO 类文章必须提醒检查 robots.txt。
3. 同文件 §1–§9：语气、句长分布、词汇黑名单、三源案例轮换（行业 40–50% / GoEast 30–40% / 副业与假设 10–20%，按支柱有调整，见 §7）、Jake 的真实背景。
4. `geo/geo-article-prompt-template.md` 的 system prompt：SEO/GEO 结构规则、AI 味短语黑名单。它是英文时代写的，"written in English" 和 "150–160 字符 meta description" 已被上面覆盖。
5. 数据源，不是规则：`geo/jake-geo-cases.md`（🔵 Jake 实测，可第一人称；🟡 行业案例，第三方视角；🟢 研究数据；带 ⚠️ 的数字只能说趋势）、`geo/GEO_Knowledge_Base.md`（按主题只取相关章节；可能过时，补充时标注来源和年份）。

最常犯的硬规则：organic 一律译"自然"不是"有机"；标题不用"完全指南"；每个引用的数字都要有真实可打开的链接，找不到就只写出处不加链接，绝不编 URL；GoEast 例子不能连续超过 3 段；每篇至少一个语言教育行业之外的例子；假设性例子要写明是假设；FAQ 段落标题用 `## 常见问题`。

## 刻意为之，不要"修"

- JSON-LD 放在正文的代码块里而不是 frontmatter 字段：页面就是这么抽的，已发布文章都这么写。
- `scripts/` 里的支柱列表和 JSON-LD 正则是从站点源码解析出来的，不是常量。看起来绕，是为了不漂移。
- `.hermes/skills/geo-article/SKILL.md` 只有几行，故意的：Hermes 要 `version:` 字段，Claude Code 不接受未知字段，所以它是指针不是副本。
- `docs/OWNER.md`、`docs/STATUS.md` 顶部写着 generated：不要手改，改源头再跑 `owner.mjs --write`。
- `geo/publish.sh` 还在，是给人在 Git Bash 里用的交互版；AI 工具用 `geo-publish.mjs`。
- 已发布文章里 FAQ 有两种写法（`###` 和加粗行），lint 两种都认。统一与否是 Jake 的内容决定（BACKLOG T9）。
- 文章 JSON-LD 的 url 目前不带 www，而 Vercel 把不带 www 的请求跳到 www。这是待决定项（BACKLOG W3），不要单独改一篇。

## Git 纪律

- 仓库是公开的。推上去 = 发布到全世界，删了也有缓存。
- 绝不 `git add -A` / `git add .`。按文件名 add。
- 绝不提交：任何简历 / 求职 / 合同 / 报价材料（根目录的 `*.pdf`、`*.txt` 已被 .gitignore 挡住）、`*.private.md`、`.env*`、`CLAUDE.local.md`、`node_modules`、`.next`。这类文件出现在工作区时先问 Jake 怎么处理，不要动。
- 文章草稿写进 `content/geo/` 就停。commit 和 push 只在 Jake 明确说"发布 / 上线 / push / 保存并发布"之后做，而且只 add 那一篇加生成的 docs 页。
- 不要 `git pull --rebase`（改 SHA）。不要开分支发文章，除非 Jake 要求。

## 文档地图

| 文件 | 回答的唯一问题 | 谁维护 |
|---|---|---|
| `AGENTS.md`（本文件） | 在这里怎么干活不踩坑 | 手写 |
| `docs/BRIEF.md` / `docs/BRIEF.private.md` | 你是谁、为谁写、什么不能做 | 手写；private 不进 git |
| `docs/OWNER.md` | Jake 不读代码怎么掌控这个项目 | 生成 |
| `docs/STATUS.md` | 计划里写了哪些、没写哪些、哪些有问题 | 生成 |
| `docs/BACKLOG.md` | 还欠什么，以及试过又否决了什么 | 手写 |
| `docs/DECISIONS.md` | 为什么是这样，什么在强制它 | 手写 |
| `docs/STRATEGY.md` | 什么时候继续、缩小或停 | 手写，门槛规则在代码里 |
| `docs/MISTAKES.md` | 我搞错过什么 | 手写，超过 14 天没新条目会变红 |
| `docs/GLOSSARY.md` | 主人页上的词是什么意思 | 手写 |
| `geo/*` | 60 篇的数据、风格、案例、知识 | 手写 |
| `.claude/skills/geo-article/` | 写一篇文章的流程 | 手写 |
