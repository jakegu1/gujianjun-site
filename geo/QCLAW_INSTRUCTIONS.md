# Qclaw 文章发布操作手册

> **重要**：这是一个子任务，只在用户明确要求写文章时激活。平时保持你自己的对话风格，不要受本文档影响。

---

## 什么时候激活这个流程

只有当用户说类似以下内容时，才进入文章发布模式：
- "写 P0-01"
- "帮我写 P1-03 这篇文章"
- "发布 P3-05"
- 任何提到文章 ID（格式为 `PX-XX`）+ "写/发布/生成" 的指令

其他时候，正常对话，不要提及本文档。

---

## 操作步骤（收到写文章指令后）

### Step 1：从 config 中提取文章数据

读取 `geo/geo_agent_config.json`，找到对应 `id` 的文章对象。

例如用户说"写 P1-01"，提取：

```json
{
  "id": "P1-01",
  "title": "What is GEO? Generative Engine Optimization Explained",
  "slug": "what-is-geo",
  "type": "Pillar",
  "target_words": 3500,
  "content_brief": "...",
  "suggested_h2s": ["..."],
  "internal_links": [...],
  "example_guidance": "..."
}
```

### Step 2：组合完整 prompt

将以下内容按顺序组合成完整 prompt：

1. **System prompt**：读取 `geo/geo-article-prompt-template.md` 中 ` ``` ` 代码块内的完整 system prompt
2. **风格指南**：读取 `geo/jake-writing-style-guide.md` 全文，作为 system prompt 的补充上下文
3. **变量替换**：用 Step 1 提取的文章数据，替换 prompt 中的所有 `{{变量}}`：
   - `{{title}}` → 文章标题
   - `{{url}}` → 文章 URL
   - `{{content_brief}}` → 内容摘要
   - `{{target_words}}` → 目标字数
   - `{{type}}` → 文章类型
   - `{{suggested_h2s}}` → H2 结构（JSON 数组转为列表）
   - `{{internal_link_count}}` → internal_links 数组长度
   - `{{internal_links}}` → 格式化为 `- [title](url)` 列表
   - `{{example_guidance}}` → 案例分配指导

### Step 3：生成文章

使用组合好的 prompt 生成文章。生成时注意：
- 遵循 jake-writing-style-guide.md 中的所有风格规则
- 遵循 prompt template 中的 SEO/GEO 优化规则
- 按 example_guidance 分配案例来源比例

### Step 4：转成 MDX 格式并保存

将生成的 markdown 转为 MDX 文件，保存到网站目录。

**文件路径**：`content/geo/{slug}.mdx`

**文件格式**：

```mdx
---
title: "文章标题"
date: "YYYY-MM-DD"
excerpt: "120-155字符的 meta description，包含主关键词"
tags: ["GEO", "相关标签1", "相关标签2"]
pillar: "Foundations"
articleId: "P1-01"
---

文章正文（Markdown 格式）...

## FAQ

### 问题1？

回答1...

### 问题2？

回答2...
```

**注意事项**：
- `date` 使用当天日期，格式 `YYYY-MM-DD`
- `excerpt` 必须 120-155 字符，这是 Google 搜索结果摘要
- `slug` 使用 config 中的 slug，不要自己编
- `tags` 从文章内容提取 3-5 个相关标签
- `pillar` 使用 config 中该文章的 pillar 名称（如 "Foundations", "AI Technical" 等）
- `articleId` 使用 config 中的 id（如 "P1-01"）
- JSON-LD schema 建议放在文章末尾的代码块中（不会被渲染，但方便后续实现）
- 文章中的 internal_links 使用相对路径（如 `/geo/what-is-geo/`），不要用完整 URL

### Step 5：展示给用户确认

**不要直接 git push！** 把生成的文章展示给用户：

1. 显示文件将保存到的路径
2. 显示 frontmatter（title、date、excerpt、tags）
3. 显示文章开头 500 字预览
4. 显示文章总字数
5. 问用户："文章已生成，要我保存并发布吗？"

### Step 6：用户确认后保存并发布

只有用户明确说"发布"/"保存"/"push"/"上线" 后：

```bash
# 1. 保存文件
# 文件已在 Step 4 写入 content/posts/{slug}.mdx

# 2. Git 提交并推送
cd C:\Users\86277\gujianjun-site
git add content/geo/{slug}.mdx
git commit -m "feat: add {id} - {短标题}"
git push

# 3. 等待 Vercel 自动部署（约2分钟）
```

告诉用户："文章已推送，Vercel 正在部署，约2分钟后可在 gujianjun.net/blog/{slug} 访问。"

---

## 批量操作

如果用户说"写 P1-01 到 P1-05"，按以下流程：

1. **逐篇生成**，每篇都走完 Step 1-5
2. **每篇都等用户确认**后再保存
3. **可以一次性 git push** 多篇已确认的文章

---

## 文件位置速查

| 文件 | 路径 |
|------|------|
| 文章配置（60篇数据） | `geo/geo_agent_config.json` |
| Prompt 模板 | `geo/geo-article-prompt-template.md` |
| 写作风格指南 | `geo/jake-writing-style-guide.md` |
| 文章保存目录 | `content/geo/` |
| 图片保存目录 | `public/images/posts/` |

---

## URL 结构说明

GEO 系列文章有专属路由：`gujianjun.net/geo/{slug}`

**文章 URL**：`https://gujianjun.net/geo/{slug}`
**系列首页**：`https://gujianjun.net/geo/`

---

## 常见问题

**Q：文章里的图片怎么处理？**
A：在文章中用 `![alt text](/images/posts/filename.png)` 占位。实际图片需要用户手动上传到 `public/images/posts/` 或通过 Keystatic CMS 上传。

**Q：frontmatter 中的 tags 有固定列表吗？**
A：没有严格限制，但建议复用这些常见标签：GEO, SEO, AI搜索, RAG, 内容策略, 技术SEO, Schema Markup, Perplexity, ChatGPT, Google AI Overview

**Q：文章语言是中文还是英文？**
A：英文。这是面向国际读者的 GEO 教程系列。参考 jake-writing-style-guide.md 中的双语模式——主体英文，偶尔自然地使用中文术语。
