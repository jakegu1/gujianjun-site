@AGENTS.md

## Claude Code 专用

- 写文章：`/geo-article P0-01`，或直接说"写 P0-01"。技能在 `.claude/skills/geo-article/SKILL.md`。
- 技能走到"草稿预览"就停，等 Jake 在对话里确认后才 commit / push。这是流程的一部分，不是可选项。
- 浏览器预览：`.claude/launch.json` 里的 `Next.js Dev Server`（`npm run dev`，端口 3000）。
- 提交信息末尾按本会话的 system reminder 加 `Co-Authored-By` 行；`geo-publish.mjs` 用 `--trailer` 传入。
