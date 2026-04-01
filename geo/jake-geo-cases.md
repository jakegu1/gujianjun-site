# Jake Gu — GEO 实测案例与行业案例库

> **用途**：这是配合写作风格档案（jake-style-profile.md）和文章生成 Prompt 使用的第三份文档。  
> 每次生成文章时，从本库中选取与文章主题相关的案例，作为"Jake 式发现"或有据可查的行业佐证。  
> **案例标注说明**：  
> 🔵 = Jake 实测（GoEast 或个人项目，可第一人称叙述）  
> 🟡 = 行业真实案例（有来源，第三方视角叙述）  
> 🟢 = 学术/研究数据（适合作为命题式陈述的数据支撑）

---

## 模块 A：内容结构与写作格式

### A-1. FAQ 内容与 Schema 标记

🔵 **GoEast HSK 备考页 — FAQ 改造**
- **背景**：HSK 备考页原版是散文式长篇介绍，问题分散在段落中，无结构化 FAQ。
- **操作**：加入 5 个独立 Q&A，配合 FAQPage JSON-LD Schema 标记。
- **结果**：两周内在 Perplexity "如何备考 HSK3" 相关查询中出现引用。
- **结论**：FAQ 是预切块内容（pre-chunked content），RAG 系统天然偏好。每个 Q&A 对本身就是自包含的知识胶囊，不依赖上下文即可被提取。
- **适用文章主题**：FAQ 写法、Schema 标记、内容结构优化、AI 可引用内容

---

🟡 **B2B SaaS 公司 — AEO 指南 Schema 改造**
- **背景**：一家 SaaS 公司发布了"什么是 AEO"的教程页，初始只有基础 Article Schema，无 FAQ 标记。发布后 1–4 周基本无 AI 引用。
- **操作**：第 5 周加入 FAQPage Schema（6 个问题），同时完善 Article Schema 中的 Person 实体字段，加入 sameAs 指向 LinkedIn 和 About 页。
- **结果**：3 周内在 Perplexity 的"what is AEO"查询中出现引用；6 周内被 Google AI Overviews 收录用于"answer engine optimization definition"查询。平均排名从 14.7 升至 8.3（提升 6.4 位）。
- **来源**：digitaltechmainia.org，2026-03
- **适用文章主题**：Schema 实施、FAQ 优化、Article Schema 写法

---

🟢 **FAQPage Schema 引用率数据**
- Relixir 对 50 个站点的研究（2025）：有 FAQPage Schema 的页面 AI 引用率为 41%，无 Schema 页面为 15%，差距约 2.7 倍。
- Frase.io 研究：有 FAQPage 标记的页面在 Google AI Overviews 中出现的概率是无标记页面的 3.2 倍。
- 2024 年 Conductor 对 50,000 个搜索查询的分析：正确实施 FAQPage 和 HowTo Schema 的页面，被 Google AI Overviews 特别展示的比例显著高于无结构化数据的页面。
- **⚠️ 反向数据**：Search/Atlas 2024 年研究发现，Schema 覆盖率与引用率之间没有线性相关——高 Schema 覆盖率的站点不一定比低 Schema 站点表现更好。结论：Schema 是基础设施，不是魔法子弹。内容质量仍是决定性因素。
- **来源**：Relixir 2025, Frase.io, Conductor 2024, Search/Atlas 2024

---

### A-2. 内容段落结构（首句法则、命题式写作）

🔵 **GoEast HSK 页面 — 首句结构改造**
- **背景**：每个备考技巧段落以背景介绍开头：「HSK 考试是中国汉语水平考试，分 1–9 级……」
- **操作**：改写为每个技巧直接以可操作结论开头：「HSK3 阅读部分的核心难点是时间分配，建议每道题控制在 90 秒以内。」
- **结果**：改版两周后页面在 Perplexity 的 HSK 相关查询中开始出现引用。
- **结论**：AI 的 reranker 在打分时，开头有结论的段落比开头是背景铺垫的段落得分高。具体机制：向量检索之后的 cross-encoder reranker 对"命题密度"有偏好——第一句是陈述句的 chunk，比第一句是背景描述的 chunk 评分更高。
- **适用文章主题**：段落写法、AI 可引用内容、reranking 机制

---

🟢 **GEO 学术基础研究数据**
- Aggarwal 等人（KDD 2024，普林斯顿/Google Brain）：对数千次 LLM 与在线内容交互的分析发现，针对实体清晰度、结构和上下文流优化的页面，在 AI 生成摘要中被引用的频率比未优化页面高 58%。
- Liu 等人（系统研究）：对 Perplexity.ai 引用模式的大规模量化研究发现，实施结构化 GEO 框架的网站，在 AI 生成回复中的可见度提升最高达 37%，部分优化超过 40%。
- **来源**：ACM KDD 2024, https://doi.org/10.1145/3637528.3671900

---

### A-3. 内容特异性与数字密度

🔵 **GoEast 页面速度分析 — 数字的具体性**
- **背景**：分析 GoEast 网站性能时，泛泛说"页面加载慢"没有任何实际意义。
- **操作**：通过 HAR 文件分析，量化为：68 个第三方请求来自 30 个域名，首次内容渲染时间 32 秒，最大瓶颈依次是 Facebook Pixel、Brevo、Pinterest Pixel、TikTok Pixel。
- **结论**：AI 系统在向量空间中对"包含具体数字"的 chunk 赋予更高的语义唯一性。说"32秒"的页面比说"加载很慢"的页面，在向量检索中的区分度更高，被精确查询命中的概率也更高。
- **适用文章主题**：内容写法、特异性原则、数字密度

---

🔵 **GoEast 学员数据引用**
- 具体数据：GoEast 学员平均 5.2 个月达到 HSK3（2024 内部数据，n=380），每周学习 6 小时。
- 这个数据在引用时比"几个月内可达到 HSK3"的模糊表述，在 AI 回复中被引用的概率更高。
- **结论**：即使是内部数据（注明 n= 和年份），也比"据研究"或"有报告显示"的引用权重高。
- **适用文章主题**：命题式写作、数据引用规范、E-E-A-T 内容质量

---

## 模块 B：技术 GEO

### B-1. robots.txt 与爬虫管理

🔵 **GoEast 网站 — 爬虫屏蔽修复**
- **背景**：GoEast 网站的 robots.txt 在防抓取配置时，使用了过于激进的规则，将所有非 Googlebot 的爬虫全局屏蔽（`Disallow: /`）。Google SEO 表现正常，但在 AI 搜索中完全隐形。
- **操作**：修复 robots.txt，明确放行 CCBot、GPTBot、ClaudeBot、Google-Extended、PerplexityBot。
- **结果**：修复后 Perplexity 的引用量在六周内出现明显增长。
- **结论**：这是成本最低、回报最直接的 GEO 技术修复之一。很多网站 SEO 没有问题，但在 AI 搜索里完全隐形，第一步排查就是 robots.txt。
- **适用文章主题**：技术 GEO、爬虫管理、robots.txt 配置、GEO 入门

---

🟢 **AI 爬虫屏蔽的行业现状**
- Press Gazette 研究：近 80% 的主流新闻发布商，至少屏蔽了一个 AI 训练爬虫。
- 这创造了内容稀缺效应：主动开放爬虫访问的品牌，在 AI 生成回复中占据不成比例的份额。
- **来源**：Press Gazette, Frase.io 2025 整理

---

🟢 **llms.txt 文件的现实局限**
- 截至 2025 年 8 月，对 1,000 个域名的分析显示，主要 LLM 爬虫（GPTBot、ClaudeBot、PerplexityBot）对 llms.txt 文件的访问次数为零；传统爬虫（Googlebot）会访问，但 AI 专属爬虫不会。
- 仅约 951 个域名发布了 llms.txt（截至 2025 年 7 月）。
- **结论**：llms.txt 是有意义的规范，但截至 2025 年仍是"写了不吃亏，但不要指望它"的状态。
- **来源**：averi.ai，2025-08 分析

---

### B-2. Schema 标记与结构化数据

🟡 **Schema 实施：LLM 实际如何处理 JSON-LD**
- **实验**：2026 年 2 月，SEO 专家 Mark Williams-Cook 创建了一个虚假公司页面，将地址信息**仅**放在无效的 JSON-LD Schema 中（不在任何可见页面内容里）。ChatGPT 和 Perplexity 均成功提取并返回了该地址。
- **结论**：LLM 将 JSON-LD 作为原始文本 token 处理，而不是像 Google 爬虫那样语义解析 Schema 结构。这意味着：①JSON-LD 对 LLM 有效，但不是通过"语义理解 Schema 类型"，而是通过"读取文本"；②Schema 对 Google AI Overviews 的影响路径（通过 Knowledge Graph）与对 ChatGPT/Perplexity 的影响路径（通过原始文本提取）不同。
- **实践含义**：即使 Schema 写错了类型，LLM 也可能提取到信息。但正确的 Schema 仍然对 Google AI Overviews 的 Knowledge Graph 路径至关重要。
- **来源**：SERoundtable, WhiteHat SEO, 2026-02

---

🟢 **Schema 类型的 GEO 优先级**
- Microsoft Bing Copilot 主产品经理 Fabrice Canel 在 2025 年 3 月 SMX 慕尼黑确认："Schema 标记帮助 Microsoft 的 LLM 理解内容。"
- 优先级最高的 Schema 类型（AI 引用相关）：Organization、Person、Article/BlogPosting、FAQPage、HowTo、Product。
- 当前 Schema 覆盖率：全网约 4,500 万个域名实施了 Schema，占所有注册域名的约 12.4%。早期采用者优势显著。
- **来源**：SMX Munich 2025, WPRiders, averi.ai

---

### B-3. 页面速度与核心网络指标

🔵 **GoEast 网站性能问题 — 第三方脚本分析**
- HAR 文件分析结果：68 个第三方请求来自 30 个不同域名，导致 32 秒首次内容渲染时间（FCP）。
- 最大瓶颈（按阻塞时间排序）：Facebook Pixel → Brevo 追踪脚本 → Pinterest Pixel → TikTok Pixel。
- **GEO 层面的影响**：页面速度过慢会直接影响 AI 爬虫的抓取完整性。PerplexityBot 和 GPTBot 在爬取时有超时机制，超时未加载完的内容不会进入索引。
- **结论**：在修复 robots.txt 之后，页面速度是第二优先级的技术 GEO 修复项。
- **适用文章主题**：技术 GEO、Core Web Vitals、第三方脚本管理

---

### B-4. 内容更新与时效性

🟢 **内容新鲜度对 AI 引用的影响**
- Perplexity 的引用来源偏好：大量偏向近期发布的内容，对发布时间较近的文章有明显的新鲜度加权。
- Google AI Overviews：会在生成回复时优先考虑最近更新的内容，特别是新闻类和快速变化领域。
- 操作建议：更新"最后修改日期"字段（dateModified）是成本最低的时效性信号强化手段，但内容本身也要有实质性更新，否则 Google 会检测到"假更新"。
- **来源**：frase.io, Perplexity 引用模式分析

---

## 模块 C：实体与知识图谱

### C-1. 品牌实体建立

🔵 **GoEast 品牌实体弱点**
- **问题**：当用户在 Perplexity 或 ChatGPT 里问"上海哪里可以学中文"时，GoEast 的出现频率不稳定，原因之一是 Organization Schema 不完整（缺少 sameAs 指向 Google Business Profile、Wikipedia 或权威中文目录）。
- **修复方向**：完善 Organization Schema，加入 sameAs 字段指向多个权威实体来源。
- **结论**：AI 系统通过多个数据源的一致性来验证品牌实体的可信度。单一来源的品牌信息，比多来源一致性品牌信息的实体权重低。
- **适用文章主题**：实体优化、知识图谱、品牌 GEO

---

🟢 **实体优化的学术基础**
- KDD 2024 论文（Aggarwal 等）：对实体清晰度的优化是 GEO 最有效的单一干预措施之一。页面中实体关系明确（Who + What + When + Where）的内容，AI 引用率比实体模糊的内容高 58%。
- **实体优化的核心**：同一实体在页面内的一致性命名（避免"GoEast"/"GoEast Mandarin"/"GoEast 语言学校"三种写法混用），以及通过 sameAs 属性将站内实体与外部知识图谱节点连接。
- **来源**：ACM KDD 2024

---

### C-2. 作者实体与 E-E-A-T

🟢 **作者 Person 实体对 AI 引用的影响**
- 在 B2B SaaS 案例（见 A-1）中，加入完整 Person 实体标记（sameAs 指向 LinkedIn + About 页）后，6 周内被 Google AI Overviews 收录。
- Google 官方立场：作者实体清晰度是 E-E-A-T 评估的关键信号之一，直接影响 AI Overviews 对内容的信任度。
- **实践建议**：作者 About 页、LinkedIn、Google Scholar（学术类）、行业媒体署名文章——每多连接一个权威外部节点，作者实体权重就提升一级。
- **来源**：digitaltechmainia.org, Google Search Central

---

## 模块 D：平台特性（ChatGPT / Perplexity / Google AIO）

### D-1. Perplexity 引用特性

🟢 **Perplexity 的来源偏好**
- Reddit 占 Perplexity 引用来源的 6.6%，远高于其他 AI 平台——反映 Perplexity 对"真实用户体验内容"的强烈偏好。
- 发布时间：Perplexity 对新鲜内容有明显加权，相同质量的内容，近期发布的被引用概率更高。
- 问答式内容：用户在 Perplexity 里的提问方式和 FAQ 格式高度匹配，Q&A 内容的向量相似度天然更高。
- **来源**：Frase.io GEO 研究，2025

---

🟢 **Perplexity vs ChatGPT 引用逻辑差异**
- ChatGPT（参数知识为主）：对常识性内容，倾向从参数知识直接回答，不引用外部来源。触发引用的条件：内容有具体数字、时效性信息、或反直觉结论。
- Perplexity（检索优先）：几乎所有回答都实时检索，引用频率更高。偏好：结构清晰、首句是结论、有具体证据的内容。
- **对内容策略的含义**：针对 Perplexity，写作重点是"检索相关性"（用词与用户查询高度匹配）；针对 ChatGPT，写作重点是"触发引用门槛"（提供参数知识里没有的具体信息）。
- **来源**：Frase.io, 行业观察汇总

---

### D-2. Google AI Overviews

🟢 **AI Overviews 覆盖率与 CTR 影响**
- Google AI Overviews 展示比例：2025 年 1 月约 6.49%，2025 年末约 18–20%，目前已覆盖超过 20 亿月活用户（200 个国家）。
- CTR 影响：Ahrefs 2025 年 12 月对 30 万个关键词的研究：AI Overview 出现时，第一名有机结果的 CTR 下降 58%。
- 反向数据：当品牌被 AI Overviews 引用时，该品牌的点击率反而**高于**未被引用的竞争对手。被引用 = 隐性背书。
- **来源**：Ahrefs Dec 2025, IMD 2025, Frase.io

---

### D-3. 中国 AI 平台（豆包、Kimi、DeepSeek）

🔵 **中国平台 GEO 的特殊性**
- 豆包（Doubao）、Kimi、DeepSeek 的中文内容检索增强能力在 2024–2025 年已相当成熟，使用的是同样的 RAG 机制。
- 中国平台特殊考量：百度 AI 摘要的引用逻辑受百度自有 Knowledge Graph（百度百科、百家号生态）的影响更强；微信搜一搜的引用偏向微信公众号生态内容。
- **实践含义**：在中国市场做 GEO，除了通用 GEO 原则外，还需要在百度百科、百家号、知乎建立品牌实体的"中文锚点"。
- **适用文章主题**：中国市场 GEO、多平台 GEO 策略

---

## 模块 E：内容类型与格式

### E-1. 电商内容 GEO

🔵 **Shopify 黏性胸贴店 — 产品描述改写方向**
- **原文风格**（AI 不会引用）：「我们的硅胶胸贴采用医疗级硅胶材质，舒适透气，适合各类服装搭配，深受用户好评……」
- **GEO 版本**（对比+数据+场景）：「硅胶胸贴可重复使用 30–50 次，防水，适合低胸和背部裸露服装；布质胸贴一次性使用，透气性更好，适合长时间穿着的日常场景。选择标准取决于穿着频率和服装类型，而非品牌偏好。」
- **结论**：电商产品页的 GEO 核心是"写答案，不写广告"。用户在 AI 里问"硅胶胸贴和布质胸贴哪个好"，AI 引用的一定是有对比结论的内容，不是有品牌溢美词的内容。
- **适用文章主题**：电商 GEO、产品页优化、比较类内容

---

🟢 **电商 AI 流量数据**
- Adobe 数据：AI 驱动的零售网站流量，从 2024 年 7 月到 2025 年 2 月增长了 12 倍；到 2025 年 7 月，同比增长达到 4,700%（相比 2024 年同期）。
- 2025 年 Amazon Prime Day 期间，AI 助手（Rufus 等）驱动的商品查询量显著增长。
- 38% 的美国消费者在 2025 年 7 月已在使用 AI 进行购物决策，预计年底超过 50%。
- **来源**：Adobe 2025, IMD 2025

---

### E-2. B2B 内容 GEO

🟡 **Webflow 开发机构 — ChatGPT 推荐出现**
- **背景**：一家 Webflow 开发机构意识到潜在客户越来越多地通过 ChatGPT 等 AI 工具寻求机构推荐，而不是直接 Google 搜索。
- **操作**：优化内容的实体清晰度（明确说明"服务什么规模的客户"、"解决什么具体问题"）和叙事结构（从"我们做什么"转向"客户遇到什么问题，我们如何解决"）。
- **结果**：开始稳定出现在 ChatGPT 对"Webflow SEO agency"相关问题的回复中。
- **来源**：alphap.tech，2026-01
- **适用文章主题**：B2B GEO、服务页面优化、实体清晰度

---

🟡 **LS Building Products — 内容架构从产品为中心到答案为中心**
- **背景**：B2B 建材制造商，内容以产品目录和规格表为主，在 AI 搜索中完全不可见。
- **操作**：与 Single Grain 合作，将内容架构重建为话题集群（topic clusters），每篇内容对应承包商、建筑师、项目经理实际会向 ChatGPT 或 Perplexity 提问的具体问题——材料选择、安装规范、合规要求、全周期成本计算。
- **结论**："产品为中心"转向"答案为中心"——这是 B2B 内容做 GEO 的核心认知转变。
- **来源**：singlegrain.com
- **适用文章主题**：内容架构、话题权威、B2B GEO

---

### E-3. 教育与语言学习内容

🔵 **GoEast 课程描述 — GEO 改写方向**
- **原版**：「我们提供全面的中文培训解决方案，满足不同学习阶段的需求。我们的课程由经验丰富的教师设计，结合先进的教学方法……」
- **GEO 版本**：「GoEast 企业中文培训分三个层级：基础沟通（HSK1–2）、商务应用（HSK3–4）、高级谈判（HSK5+）。平均学员每周 4 小时、6 个月完成一个层级（2024 内部数据，n=380）。」
- **结论**：GEO 版本可以直接回答"学中文到 HSK3 需要多久"这类 AI 查询，原版不能。同样的逻辑适用于律师事务所、SaaS 产品、医疗机构的服务描述。
- **适用文章主题**：服务页面 GEO、内容改写、企业官网 GEO

---

## 模块 F：话题权威（Topical Authority）

### F-1. 内容集群与 Pillar 页面

🟡 **Contently — 内容重构后 AI 流量增长**
- **背景**：内容策略平台 Contently 在 2024 年推出 AI Studio 和 LLM 优化蓝图，帮助品牌按 AI 系统偏好的方式结构化内容（Q&A 格式、Schema 标记等）。
- **结果**：采用 Contently GEO 工具包的早期用户，在重新格式化和更新内容后，来自 AI 生成答案的高质量流量提升了 42%。
- **来源**：contently.com, navistratanalytics.com

---

🟢 **话题权威的 AI 引用效应**
- 在某一话题上发布了系统性内容集群（Pillar + 多篇 Spoke）的站点，被 AI 引用时往往不只被引用一次——AI 在生成系统性回答时，倾向于从同一个"话题权威站点"引用多个来源。
- 换言之：话题权威不只是 SEO 护城河，也是 GEO 护城河。
- **来源**：GEO 行业实践汇总

---

## 模块 G：GEO 效果衡量与监测

### G-1. AI 引用追踪

🔵 **GoEast GEO 追踪方案**
- 当前方法：每周手动在 Perplexity 和 ChatGPT 中输入 10–15 个目标查询（覆盖核心服务词、竞争词、长尾问答词），记录是否出现引用及引用片段。
- 工具补充：Semrush AI Toolkit（追踪跨平台 AI 可见性）、Otterly.AI（监控 AI 引用和品牌提及）。
- **结论**：目前 AI 引用追踪没有类似 Google Search Console 的标准化工具，手动追踪 + 工具辅助是现实可行的组合。
- **适用文章主题**：GEO 效果衡量、AI 可见性追踪

---

🟢 **新 KPI 体系**
- 传统 SEO KPI（排名、CTR）已不足以反映 AI 时代的内容可见性。新增 KPI：
  - AI 引用份额（AI Citation Share）：品牌在目标查询集中被 AI 引用的比例
  - 概述可见度（Overview Visibility）：内容出现在 AI Overviews 的频率
  - 零点击替代率（Zero-click Displacement Rate）：因 AI 直接回答导致的流量损失估算
  - AI 来源转化率：来自 AI 引用的访客转化率（研究显示是普通有机流量的 4.4 倍）
- **来源**：BrightEdge Market Pulse, Frase.io 2025

---

### G-2. AI 流量的商业价值

🟢 **AI 来源流量转化率数据**
- AI 来源访客的转化率是普通有机搜索访客的 4.4 倍，页面停留时间多 68%（行业研究数据）。
- SmartRent（PropTech SaaS）：实施 GEO 和 SEO 联合优化后，AI 搜索量增长 200%，线索量增长 32%。
- Backlinko 2025 年分析（800% 增长数据）：实施系统化 GEO 框架的企业，LLM 来源网站流量在 2025 年 Q2 vs 2024 年 Q2 增长了约 800%。
- **⚠️ 数据注意事项**：800% 这类数字基数通常极低（AI 流量在 2024 年几乎为零），绝对值意义有限。用于说明趋势可以，不建议作为核心承诺数字。
- **来源**：Backlinko 2025, singlegrain.com, Frase.io

---

## 模块 H：GEO 实施优先级与常见误区

### H-1. 最高 ROI 的 GEO 操作（按成本排序）

🔵 **Jake 的 GEO 优先级框架**（基于 GoEast 实战经验）

| 优先级 | 操作 | 成本 | 预期周期 |
|--------|------|------|----------|
| 1 | 检查并修复 robots.txt（放行 AI 爬虫） | 极低 | 1–2天 |
| 2 | 对核心页面加入 FAQ 部分 + FAQPage Schema | 低 | 1–2周/页 |
| 3 | 改写各 H2 首句为结论句 | 低 | 2–3天/页 |
| 4 | 完善 Organization + Article + Person Schema | 中 | 1周 |
| 5 | 建立话题集群（Pillar + Spoke 结构） | 高 | 2–3个月 |
| 6 | 在外部权威平台建立实体锚点（知乎、LinkedIn、行业媒体） | 中 | 持续 |

- **结论**：前三步是纯内容和配置操作，不需要开发资源，但对 GEO 可见度的影响是最快可见的。

---

### H-2. 常见 GEO 误区

🟢 **误区数据**
- 误区 1：Schema 越多越好。Search/Atlas 2024 研究发现 Schema 覆盖率与引用率无线性相关。空字段的 Schema 比没有 Schema 还差（Product schema 若关键字段为空，会主动降低引用率）。
- 误区 2：只优化 Google AI Overviews。ChatGPT 的引用逻辑（参数知识触发）、Perplexity 的引用逻辑（检索相关性）与 Google 的 Knowledge Graph 路径完全不同，需要分开优化。
- 误区 3：GEO 可以替代 SEO。在被 AI 检索到之前，内容需要先被爬虫发现和索引——SEO 的基础技术设施（sitemap、crawl budget、页面速度）依然是 GEO 的前提条件。
- **来源**：Search/Atlas 2024, singlegrain.com

---

## 模块 I：行业特定 GEO 案例

### I-1. 汽车行业

🟡 **Fortune 500 汽车品牌 — GenOptima GEO 案例**
- **操作**：实施 GEO 策略，包括内容语义优化和知识图谱集成。
- **结果**：Q3 2025，展厅询问量增长约 300%，销售转化率提升 5 倍（500%）。
- **⚠️ 数据来源为 GenOptima 自述**，独立核实困难，建议用于说明趋势而非精确引用。
- **来源**：Sina Finance, Nov 2025，转引自 gen-optima.com

---

### I-2. 房地产行业

🟡 **房地产开发商 — GenOptima GEO 案例**
- **操作**：GEO 内容优化。
- **结果**：网页曝光量增长 210%，在线预约转化量增长 4 倍。
- **⚠️ 同上，数据为服务商自述。**
- **来源**：gen-optima.com

---

### I-3. SaaS / 技术类

🟡 **SmartRent（PropTech SaaS）— GEO + SEO 联合优化**
- **结果**：AI 搜索量增长 200%，线索量增长 32%。
- **来源**：singlegrain.com
- **适用文章主题**：SaaS GEO、B2B 线索生成

---

## 附录：关键数据快查表

| 数据点 | 数值 | 来源 | 适用场景 |
|--------|------|------|----------|
| FAQPage Schema 引用率提升 | 2.7× | Relixir 2025 | FAQ 优化文章 |
| FAQ Schema vs 无 Schema 引用率 | 41% vs 15% | Relixir 2025 | Schema 文章 |
| AI 来源流量 YoY 增长 | 800% | Backlinko 2025 | GEO 价值概述 |
| AI 来源访客转化率 | 普通流量 4.4× | 多来源 | GEO 商业价值 |
| GEO 优化后 AI 引用率提升 | 最高 58% | KDD 2024 | GEO 学术背书 |
| 结构化 GEO 框架 AI 可见度提升 | 最高 37% | Liu et al. | GEO 入门文章 |
| AI Overviews 出现比例（2025 末） | ~18-20% | IMD 2025 | AI 趋势文章 |
| AI Overview 存在时 P1 CTR 下降 | 58% | Ahrefs Dec 2025 | 零点击趋势 |
| AI 引用流量 YoY 增长（零售） | 4,700% | Adobe 2025 | 电商 GEO 文章 |
| 主流新闻发布商屏蔽 AI 爬虫比例 | ~80% | Press Gazette | robots.txt 文章 |
| 当前 Schema 覆盖率 | 约 12.4% | 多来源 | Schema 机会论证 |

---

> **最后更新**：2026-03  
> **维护说明**：每季度补充新案例，特别是 GoEast 实测结果。每当有新的 GEO 实验结论，直接加入对应模块。
