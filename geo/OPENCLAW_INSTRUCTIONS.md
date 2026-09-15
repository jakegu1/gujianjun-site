# 文章发布操作手册（已迁移，本文件只是指针）

> 2026-09-15 起，这个流程的唯一权威版本是 `.claude/skills/geo-article/SKILL.md`。
> 项目规则在根目录 `AGENTS.md`（Cursor / Hermes / Codex 直接读；Claude Code 经 `CLAUDE.md` 导入）。
> 本文件不再保存流程内容，避免两份流程漂移。旧版本在 git 历史里（`git log -- geo/QCLAW_INSTRUCTIONS.md`）。

## 怎么触发

对任何一个接入了本仓库的 AI 工具说："写 P0-01"、"帮我写 P1-03"、"写 P1-01 到 P1-05"、"重写 P2-03"，或直接 `/geo-article P0-01`。

## 流程去哪看

| 内容 | 位置 |
|------|------|
| 完整流程（简报 → 上下文 → 起草 → lint → 预览停下 → 确认后发布） | `.claude/skills/geo-article/SKILL.md` |
| 文章骨架 + JSON-LD 模板 | `.claude/skills/geo-article/templates/article.mdx` |
| 你是谁、为谁写、七条铁律 | `docs/BRIEF.md` |
| 60 篇文章的数据（id / slug / 支柱 / 字数 / 内链） | `geo/geo_agent_config.json` |
| 写作风格指南（§10 Feedback Log 优先级最高） | `geo/jake-writing-style-guide.md` |
| 案例库 / 知识库 | `geo/jake-geo-cases.md` / `geo/GEO_Knowledge_Base.md` |
| 脚本 | `scripts/geo-brief.mjs`、`geo-lint.mjs`、`geo-publish.mjs`、`geo-status.mjs` |
| 文章保存目录 / 线上路径 | `content/geo/{slug}.mdx` → `https://gujianjun.net/geo/{slug}` |
