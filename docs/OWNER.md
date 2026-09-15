# gujianjun.net · 主人页

<!-- generated: 2026-09-15T06:51:42.390Z by scripts/owner.mjs (OWNER) — do not edit; regenerate with: node scripts/owner.mjs --write -->

生成于 2026-09-15。这一页是脚本从仓库算出来的，不是手写的：改了源头就跑 `node scripts/owner.mjs --write`，手改会被 `node scripts/docs-check.mjs` 打回。

## 1. 这是什么，现在最要紧的一个问题

这是你的个人站：首页放简历和 GoEast 案例，`/blog` 放 GoEast 的实战复盘，`/geo` 放一套计划 60 篇的 GEO 教程。文章由 AI 按你的风格指南和七条铁律代写，你逐篇审、逐篇放行。它存在的意义不是"有很多文章"，而是让读者和 AI 搜索引擎把 "Jake Gu / 顾简钧" 当成 GEO 与 MarTech 领域一个可引用、可验证、做过实事的人。写代码只能推动"文章写出来了"，推不动"有人因此找到你"，所以主人页第 4 节最后两行永远由外部世界决定。

**现在最要紧的问题：** 素材包（W1）还不存在。没有它，铁律"零编造"会让下一篇新文章里大量句子变成【待补】，系列写不下去。

## 2. 需要你做的，最急的在前

| ID | 事项 | 截止 | 还剩 | 为什么是这个日期 | 做完的标志 | 卡在哪 | 如果你什么都不做 |
|---|---|---|---|---|---|---|---|
| W1 | 提供素材包：在 `docs/facts/` 里放你的真实数据，每条带口径（时间范围 + 来源）和"可公开 / 脱敏"标记 | 2026-09-22 | 7 天 | 下一篇文章（P0-01）和 T5 复查都要它；晚一周，写作就停一周 | `docs/facts/` 至少有一个文件，`docs/BRIEF.md` §5 第 1 条不再写"尚不存在" | 不卡 | 新文章要么满是【待补】要么只能复述旧文；18 篇案例的口径复查（T5）无法进行 |
| W2 | 逐条确认已上线的商业绝对值可不可以公开：`$5 CPL`、`$400 预算`、三天 1,500 封邮箱、10K→30K 自然点击、65 个 Top 10 词、2K+ AI 月引荐 | 2026-09-22 | 7 天 | 这些已经挂在线上；铁律 4 说没标"可公开"的绝对值不该出现 | 每个数字在素材包里有"可公开"或"改相对值"标记；T5 据此改写 | 不卡 | 线上继续挂着可能违反保密要求的数字，而且被追问时你没有口径 |
| W5 | 确认或改写门槛 G1（2026-10-31：≥ 6 篇新 GEO 文章且断链为 0，否则把计划从 60 缩到 Phase 1 的 31 篇） | 2026-09-22 | 7 天 | 门槛只能在到期前改，而且只能改严 | `docs/STRATEGY.md` 的 G1 行"结论"格之前的"问题"格前面加上"（Jake 已确认 日期）" | 不卡 | 到期那天 docs-check 变红，逼你当天回答；规则是我定的不是你定的 |
| W3 | 决定规范域名：`www.gujianjun.net`（推荐，Vercel 现在把不带 www 的 307 跳到它）还是不带 www | 2026-09-30 | 15 天 | 之后每篇文章的 JSON-LD 都按这个写，越晚改越多 | `AGENTS.md` 写明规范域名；T6 做完后全站只剩一种写法 | 不卡 | 17 篇文章的 url 和 @id 与实际域名不一致，实体信号打折 |
| W4 | 决定实体命名：JSON-LD 的 `name` 用 Jake Gu 还是顾简钧，"顾得"要不要作为 alternateName | 2026-09-30 | 15 天 | GEO 的实体一致性规则（案例库 C-1）是你自己总结的，现在站上三种写法混用 | `app/layout.tsx` 的 Person 有 name + alternateName + sameAs，所有文章的 author 一致（T7） | 不卡 | AI 可能把 Jake Gu / 顾得 / 顾简钧 当三个人，实体建立不起来 |
| W6 | 新开 session，贴 kick-start 提示词，让它修已发布文章（T1–T5） | 2026-09-30 | 15 天 | 这些问题线上可见，且每篇新文章都会继续链向它们 | `docs/STATUS.md` 里断链 0、"有机"0、lint FAIL 0 | T5 卡在 W1 / W2 | 断链和误译照旧；新文章只能少放内链 |

## 3. 决定去留的日期

| 门槛 | 日期 | 还剩 | 问题 | 现在的读数 | 若否 | 结论 |
|---|---|---|---|---|---|---|
| G1 | 2026-10-31 | 46 天 | 从 2026-09-15 到 10-31，是否发布了至少 6 篇新的 GEO 文章（含 P0-01），并且断链为 0？ | 自 2026-09-15 起新发布 0 篇（目标 ≥ 6），断链 30 处（目标 0） | 把计划从 60 篇缩到 Phase 1 的 31 篇；Phase 2、3 停写并移入待办的"否决"表；把精力转到 18 篇案例的复查和 W1 素材包 | （到期当天写） |

规则写在代码里（`scripts/docs-lib.mjs` 的 `gateRules`），到期前只能改严，到期未答 docs-check 会变红。

## 4. 现在的状态（每个数字都来自源码，不是手写）

| 指标 | 数值 | 来源 | 写代码能推动吗 |
|---|---|---|---|
| GEO 系列已发布 | 17 / 60 | content/geo 对照 geo_agent_config.json | 能 |
| Phase 1（核心页）已发布 | 9 / 31 | 同上 | 能 |
| 最近一篇 GEO 文章的日期 | 2026-04-04 | content/geo frontmatter | 能 |
| 断链（指向不存在的文章） | 30 处 | scripts/geo-status.mjs | 能 |
| 已发布 GEO 文章里 lint 零 FAIL 的 | 5 / 17 | scripts/geo-lint.mjs | 能 |
| lint FAIL 按规则（篇数） | jsonld 2，links 12，wording 4 | scripts/geo-lint.mjs | 能 |
| "有机"误译残留 | 16 处，5 个文件 | grep content/ | 能 |
| 博客 / 案例文章 | 17 篇（其中无 frontmatter 0 篇） | content/posts | 能 |
| AI 平台引用 gujianjun.net 的次数 | 无数据：还没接入引用追踪表（BACKLOG T8） | — | 不能，只有外部世界能 |
| 招聘方 / 客户主动联系 | 无数据：没有记录渠道 | — | 不能 |

最后两行是这个项目真正的目的，代码碰不到它们。上面的数字全绿也只说明"活干完了"，不说明"目的达到了"。

## 5. AI 现在在做什么

项目脚手架已搭好（AGENTS.md、写文章技能、脚本、账本文档）；下一步是新开一个 session 按 kick-start 提示词修已发布文章里的问题（T1–T5），然后从 P0-01 开始写。

## 6. 最近 14 天改了什么（git log，最多 20 条）

- 2026-09-15 72352fa docs(rules): fold the seven iron rules into the writing rules; retire the realistic-estimates clause
- 2026-09-15 852fa0d chore: cross-tool project setup (AGENTS.md, geo-article skill, geo scripts)
- 2026-09-15 0544096 chore: ignore personal material at the repo root and *.private.md
- 2026-09-15 f18def8 fix(site): unknown /geo and /blog slugs return 404 instead of 500; pinned card shows the real GEO article count
- 2026-09-15 eb1c5d1 chore(content): move goeast-case-study-link-map.md out of content/posts
- 2026-09-15 dd1cdd8 chore: rename QCLAW_INSTRUCTIONS.md to OPENCLAW_INSTRUCTIONS.md

## 7. 我搞错过什么

| 日期 | 我当时的说法 | 实际情况 | 怎么发现的 |
|---|---|---|---|
| 2026-09-15 | 已发布文章里有 33 处内链指向未写文章 | 30 处 | 手数的；写了 `geo-status` 生成脚本一跑是 30，重新逐篇加总也是 30。数字进文件前就该先让脚本算 |
| 2026-09-15 | 14 篇已发布文章的 FAQ 少于 3 题（lint 报 FAIL） | 17 篇全部有 3–5 题。是 lint 错了两次：JS 的 `\b` 在中文后面不成立，漏掉 `## 常见问题`；后 14 篇的问题是加粗行不是 `###` | 用 lint 扫 17 篇已发布文章，14 篇同时报同一个错，明显是工具的错不是文章的错 |
| 2026-09-15 | AGENTS.md 初稿把两个个人文件按原文件名写进"绝不提交"清单 | 文件名本身就泄露求职信息，而 AGENTS.md 要进公开仓库 | 提交前自查发现，改成泛称 |
| 2026-09-15 | 一开始把断链问题描述成"线上 404" | 线上是 500，比 404 更糟（页面直接 readFileSync 抛异常） | 一条 curl 命令 |

最新一条：2026-09-15。超过 14 天没有新条目，docs-check 会变红；那时我必须写明"这两周检查过，没发现错误"并署日期，这句话本身以后也可能被证明是错的。

## 8. 不读代码怎么检查我

1. 浏览器打开 https://www.gujianjun.net/geo/geo-guide 。看到站点自己的 404 页就对了；看到 "Internal Server Error" 说明断链修复没上线。
2. 打开 https://www.gujianjun.net/blog ，置顶卡片上 "GEO 文章" 的数字应该等于 17（本页第 4 节的已发布数）。不等就是页面在撒谎。
3. 终端里跑 `node scripts/geo-status.mjs`：第二行 "已写 X / 60" 是进度；"断链" 那行的数字是 0 才算 BACKLOG T1 完成。
4. 终端里跑 `node scripts/docs-check.mjs`：最后一行是 `✓ all checks passed`，否则它会列出哪一条红了、为什么。
5. 看本页第一行"生成于"的日期：超过 7 天，说明没人跑过 `--write`，这页可能已经过时（docs-check 会提醒）。

## 9. 术语表

| 词 | 意思 |
|---|---|
| GEO | Generative Engine Optimization，生成式引擎优化：让 ChatGPT、Perplexity、Google AI Overviews 这类 AI 在回答问题时引用你的内容 |
| SEO | 搜索引擎优化：让 Google 这类传统搜索引擎把你的页面排在前面 |
| RAG | 检索增强生成：AI 先去检索网页片段，再根据片段生成回答。你的内容能不能被引用，取决于能不能在这条流水线里活下来 |
| JSON-LD / Schema | 藏在网页里、给机器读的一段结构化说明（作者是谁、文章是什么、FAQ 有哪些）。每篇文章末尾那个 ```` ```json ```` 代码块就是它 |
| frontmatter | 每篇文章文件开头 `---` 之间的那几行：标题、日期、摘要、标签、支柱、编号。写错一个引号整站构建失败 |
| MDX | 文章文件的格式，Markdown 加一点点代码能力。文件后缀 .mdx |
| slug | 文章在网址里的那一段，比如 `/geo/what-is-geo` 里的 what-is-geo。等于文件名，来自计划表，不能自拟 |
| pillar / 支柱 | GEO 系列的 11 个主题分组（Hub、Foundations、AI Technical……），文章页顶部那行小字 |
| Phase / 阶段 | 60 篇计划的三期发布顺序：Phase 1 是 31 篇核心页，Phase 2 是 23 篇深入篇，Phase 3 是 6 篇补充篇 |
| lint | 自动检查：脚本读一篇草稿，逐条对照规则，报 FAIL（不能发）和 WARN（要么改要么解释） |
| 断链 | 文章里的链接指向一篇还没写出来的文章。修复前线上是 500 错误，修复后是 404 |
| 内链 / 外链 | 内链：指向本站其他文章的链接。外链：指向站外来源（研究、官方文档）的链接，每个引用的数字都该有一个 |
| FAQ | 文章末尾的"常见问题"段，3–5 个问答，AI 最爱引用的格式 |
| 口径 | 一个数字的来源和范围：什么时间段、哪个工具（GSC / GA4 / Ahrefs / Salesforce）测出来的。没有口径的数字不写 |
| 素材包 | 你提供的真实数据集合（`docs/facts/`），每条带口径和"可公开 / 脱敏"标记。文章里的事实只能来自它和已发布内容 |
| 【待补】 | 草稿里的占位符：`【待补：xxx】` 表示"这里需要一个真实事实，我没有，不编"。带它的文章不能发布 |
| 门槛 / gate | 一个写死了日期和规则的判断点，到期必须回答"继续、缩小还是停"，至少一个分支会缩小项目 |
| commit | 把一次改动记进版本历史，附一句说明。一篇文章一个 commit |
| push | 把本地的 commit 推到 GitHub。这个仓库一 push，Vercel 就自动把网站重新发布，两分钟后全世界可见 |
| git log | 版本历史清单，主人页第 6 节"最近 14 天改了什么"就是从它生成的 |
| Vercel | 托管这个网站的服务。它盯着 GitHub，有新 push 就重新构建；构建失败会静默保留旧版本 |
| Keystatic | 装在网站里的一个可视化内容后台（/keystatic）。目前只接了博客目录，而且不认识案例文章的部分字段，所以我们不用它改文章 |
| docs-check | `node scripts/docs-check.mjs`：一组检查，验证账本文档没撒谎、生成页没被手改、门槛没过期、个人文件没漏进仓库。最后一行绿的才算好 |
| lint FAIL 按规则 | 把每篇文章不过关的原因归类计数：links = 断链，wording = 用词（比如"有机"），jsonld = 结构化数据出错，faq = 问答段不合格 |

> 这页哪里看不懂，是这页的缺陷，不是你的问题。指出是哪一行，它就会被重写。
