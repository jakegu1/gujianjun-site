# KICKSTART · 修复已发布文章（给下一个 session 的第一条指令）

> 用法：把"---"之间的整段贴给新 session（Claude Code / Cursor / Hermes 都行），或者直接说"读 docs/KICKSTART.md 并按它执行"。
> 这个文件是一次性的，五个 T 项做完就删掉它（单独一个 commit）。写于 2026-09-15。

---

你在 gujianjun.net 的仓库里。先按顺序读：`AGENTS.md`、`docs/BRIEF.md`（存在 `docs/BRIEF.private.md` 就一起读，它不进 git）、`docs/OWNER.md`、`docs/BACKLOG.md`。这个 session 只做一件事：把已发布文章里已经量出来的问题修掉（BACKLOG 的 T1–T5），不写新文章。

## 工作方式

- 每个 T 项一个 commit。先跑验收命令看到红，修完看到绿，commit 信息里写红长什么样。
- 改任何一篇文章之前先 `node scripts/geo-lint.mjs <ID>` 记下基线；改完再跑，FAIL 必须为 0，WARN 逐条说明是改了还是为什么不改。
- 不 `git add -A`，按文件名 add。commit 之后不要 push。每个 T 项做完，给 Jake 看 `git diff --stat` 和 lint 前后对比；Jake 说"发布"你再 `git push origin main`。仓库公开，push 即上线。
- 需要新事实的地方写 `【待补：xxx】`，不编数字、不编来源、不编 URL。带【待补】的文件 lint 会拦，不能 push。
- 商业绝对值（$、CPL、转化率、客单价）只有 `docs/facts/` 里标了"可公开"的才能保留；没标的改成相对值、区间或【待补】。`docs/facts/` 现在还不存在（BACKLOG W1 / W2 由 Jake 提供）。没有它，T5 只做简历腔和口径的部分，敏感数字列成清单等 Jake 决定。
- 改了 `app/` 或 `lib/` 要 `npm run build`。每次 commit 前跑 `node scripts/owner.mjs --write`，把 `docs/OWNER.md`、`docs/STATUS.md` 一起 add（pre-commit 的 docs-check 会验证）。
- 只改问题本身。顺手"润色"一篇文章的其他段落是另一个 commit，而且要先问。

## 顺序和验收

1. **T3 · JSON-LD（先做，最小）**
   P2-07（`content/geo/ai-knowledge-cutoff-grounding.mdx`）：JSON-LD 的 `headline` 里有未转义的英文双引号，线上注入的 JSON-LD 是非法的。把标题里的 `"知道"` 改成 `「知道」`（frontmatter title、H1、headline 三处一致）或在 JSON 里转义。
   P4-03（`content/geo/writing-ai-citable-content.mdx`）：JSON-LD 缺 BreadcrumbList，且 JSON-LD 块后面还有一个 MDX 注释，把注释挪到块前面。
   验收：`node scripts/geo-lint.mjs P2-07` 和 `node scripts/geo-lint.mjs P4-03` 没有 jsonld FAIL。

2. **T2 · "有机" → "自然"，16 处**
   5 篇 GEO 文章 + 1 篇博客：P1-01、P1-02、P1-03、P3-01、`content/posts/goeast-link-building-outreach.mdx`。只改"有机搜索 / 有机流量 / 有机结果 / 有机排名"这几个词组，别顺手改别的句子。
   验收：`node scripts/owner.mjs --write` 之后 `docs/STATUS.md` 的"有机误译残留"为 0 处。

3. **T1 · 断链 30 处**
   先看 `node scripts/geo-status.mjs` 的断链表（12 篇，19 个目标）。目标文章都还没写，这一轮把这些链接改成纯文字提及：保留句子意思，去掉 `[ ]( )`，不要删整句。以后写出目标文章时，`node scripts/geo-status.mjs --backfill <slug>` 会列出该回填的文章。
   验收：断链行为 0，且每篇 `geo-lint` 的 links FAIL 为 0。

4. **T4 · 质量 WARN**
   9 篇没有外部来源链接：只加真实、现在能打开的 URL，指向文章已经引用的那个来源；找不到就只写出处不加链接，绝不编。
   5 篇开头缺编号要点：用文章里已有的结论写 3–5 条，不新增事实。
   P3-03：正文 4 问、JSON-LD 3 问，补齐一致。
   P3-02 汉字数只有目标的 76%：这一轮不扩写（扩写需要新事实），在 BACKLOG T4 备注"待素材包"。
   验收：`docs/STATUS.md` 的 lint 表里 sources / opening / faq 的 WARN 为 0（length 除外）。

5. **T5 · 18 篇博客按七条铁律复查（需要 W1 / W2）**
   每篇过一遍 `docs/BRIEF.md` §4，列出：简历腔句子（"我负责了 / 参与了"）、没有口径的数字、商业敏感绝对值（标题里就有 `$5 CPL`、`$400 预算`）。
   能改的：简历腔改成"问题 → 判断 → 取舍 → 结果 → 重来会怎样"；口径缺失但已发布内容里能补的就补。
   不能改的（需要素材包）：列成清单交给 Jake，文章暂时不动。
   每篇的 commit 信息附一段"铁律自查"（七条各一行）。
   验收：`git log --format=%b -1 -- content/posts/<slug>.mdx` 含"铁律自查"；lint 通过。

做完：`node scripts/docs-check.mjs` 全绿；给 Jake 一份汇总：每个 T 项修前 / 修后的数字、留下的【待补】清单、等 Jake 决定的清单；然后删掉 `docs/KICKSTART.md`（单独 commit）。

## 不要做的事

- 不写新文章（那是 `/geo-article` 的事，从 P0-01 开始，等 Jake 说）。
- 不改 `geo/geo_agent_config.json` 里的 slug。
- 不改域名（www 与否，W3 未决）、不改实体命名（Jake Gu / 顾简钧 / 顾得，W4 未决）、不统一 FAQ 格式（T9 未决）。
- 不碰 `docs/BRIEF.private.md`，不把它或任何简历 / 求职材料加进 git。
- 不 push，除非 Jake 对那个 commit 说了"发布"。

---
