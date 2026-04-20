# GoEast Case Study — Article Link Map
> Reference file for AI writing agent. When drafting any article in this series, import this file to use the correct slugs, full URLs, and internal link targets.

---

## Site & Format

- **Base URL**: `https://www.gujianjun.net`
- **Blog path prefix**: `/blog/`
- **All articles are MDX files** in the `/blog/` route of the Next.js site.
- **Full URL pattern**: `https://www.gujianjun.net/blog/{slug}`

---

## Article Registry

| ID | Title | Slug | Full URL |
|----|-------|------|----------|
| A0 | GoEast Mandarin — Full Digital Marketing Case Study | `goeast-mandarin-case-study` | `https://www.gujianjun.net/blog/goeast-mandarin-case-study` |
| A1 | How I Grew GoEast's Organic Traffic from 10K to 30K+ Clicks | `goeast-seo-organic-growth` | `https://www.gujianjun.net/blog/goeast-seo-organic-growth` |
| A2 | Building a GA4 + Looker Studio Dashboard for a Language School | `ga4-looker-studio-language-school` | `https://www.gujianjun.net/blog/ga4-looker-studio-language-school` |
| A3 | GEO AI Citation Tracking: How I Measure LLM Visibility | `geo-ai-citation-tracking` | `https://www.gujianjun.net/blog/geo-ai-citation-tracking` |
| A4 | Kids Chinese Camp Google Ads Restructure + Conversion Tracking Fix | `kids-chinese-camp-google-ads` | `https://www.gujianjun.net/blog/kids-chinese-camp-google-ads` |
| A5 | GoEast Adult Online Course Google Ads: Diagnosing Lead Quality vs Volume | `goeast-online-course-google-ads` | `https://www.gujianjun.net/blog/goeast-online-course-google-ads` |
| A6 | Running a $400 Summer Immersion Google Ads Campaign from Scratch | `summer-immersion-google-ads` | `https://www.gujianjun.net/blog/summer-immersion-google-ads` |
| A7 | CF7 Dual-Sender Email: Sending Different Emails to User and Admin | `cf7-dual-sender-email-plugin` | `https://www.gujianjun.net/blog/cf7-dual-sender-email-plugin` |
| A8 | Building a CF7 Form Health Checker with WP-Cron | `cf7-form-health-checker` | `https://www.gujianjun.net/blog/cf7-form-health-checker` |
| A9 | Full CRM Pipeline: Salesforce + Brevo + Zapier for an Online School | `salesforce-brevo-zapier-crm` | `https://www.gujianjun.net/blog/salesforce-brevo-zapier-crm` |
| A10 | Connecting Acuity Scheduling to Google Ads Conversion Tracking | `acuity-google-ads-conversion-tracking` | `https://www.gujianjun.net/blog/acuity-google-ads-conversion-tracking` |
| A11 | How a Chinese Vocabulary Test Captured 1,500+ Emails in 3 Days | `chinese-vocabulary-test-lead-gen` | `https://www.gujianjun.net/blog/chinese-vocabulary-test-lead-gen` |
| A12 | Chinese Name Generator: A Tool That Converts Visitors into Leads | `chinese-name-generator-leads` | `https://www.gujianjun.net/blog/chinese-name-generator-leads` |
| A13 | Link Building on Adsy: How We Earned Backlinks for a Language School | `goeast-link-building-outreach` | `https://www.gujianjun.net/blog/goeast-link-building-outreach` |
| A14 | Building a Topic Map for Chinese Learning SEO: From Pronunciation to Business Chinese | `goeast-seo-content-topic-map` | `https://www.gujianjun.net/blog/goeast-seo-content-topic-map` |
| A15 | Async by Default: Working Across Four Time Zones at GoEast | `goeast-remote-async-team` | `https://www.gujianjun.net/blog/goeast-remote-async-team` |

---

## Cluster Membership

### Cluster 1 — SEO & GEO
- A1: GoEast SEO organic growth
- A2: GA4 + Looker Studio dashboard
- A3: GEO AI citation tracking
- A13: Link building / Adsy outreach
- A14: SEO content topic map

### Cluster 2 — Google Ads
- A4: Kids camp ads
- A5: Adult online course ads
- A6: Summer immersion ads

### Cluster 3 — MarTech & Dev
- A7: CF7 dual-sender plugin
- A8: CF7 form health checker
- A9: Salesforce + Brevo + Zapier
- A10: Acuity conversion tracking

### Cluster 4 — Lead Gen Tools
- A11: Chinese vocabulary test
- A12: Chinese name generator

### Cluster 5 — Team & Process
- A15: Async remote work across time zones

---

## Internal Linking Rules

### Rule 1 — Every sub-article links back to Overview (A0)
Every article A1–A15 must include a backlink to A0 in one of these positions:
- End of intro section: "This is one part of the [GoEast full case study](/blog/goeast-mandarin-case-study)."
- Or in the article footer/closing section.

### Rule 2 — Overview (A0) links out to all 15 sub-articles
Each section in A0 ends with a "Read the full breakdown →" link to the corresponding sub-article.

### Rule 3 — Intra-cluster links

| Article | Must link to |
|---------|-------------|
| A1 | A2, A3, A13, A14 |
| A2 | A1, A3 |
| A3 | A1, A2, A14 |
| A4 | A5, A10 |
| A5 | A4, A10 |
| A6 | A4, A5 |
| A7 | A8 |
| A8 | A7, A9 |
| A9 | A10, A11, A12 |
| A10 | A4, A5, A9 |
| A11 | A12, A9 |
| A12 | A11, A9 |
| A13 | A1, A14 |
| A14 | A1, A3, A13 |
| A15 | A0 only (process article, links back to overview) |

### Rule 4 — Cross-cluster bridge links

| From | To | Rationale |
|------|----|-----------|
| A1 (SEO growth) | A11 (vocab test) | Both are organic/inbound acquisition strategies |
| A3 (GEO citation) | A11 (vocab test) | Vocab test page is itself a GEO-optimized asset |
| A5 (adult ads) | A9 (Salesforce+Brevo) | Ad leads flow directly into the CRM pipeline |
| A4 (kids camp ads) | A9 (Salesforce+Brevo) | Same reason |
| A14 (topic map) | A11 (vocab test) | Vocab test is a content asset that lives within the topic map |
| A15 (async team) | A14 (topic map) | Sarah's weekly content contributions were managed async |
| A15 (async team) | A13 (link building) | Sarah's outreach work was entirely async |

---

## Team Context (for natural writing and correct attribution)

- **Emily** — CEO, based in Canada. Sets direction, trusts Jake on execution. Remote manager.
- **Dan** — Social media lead (overall strategy and community). Based in Shanghai. Team morale anchor, unofficial food guide for Shanghai restaurants.
- **Jasmine** — Social media video production. Based in Shanghai. Helped source and organise photo/video assets for SEO landing pages.
- **Alice** — Technical / WordPress colleague. Based in Sweden. Introduced Jake to React and Node.js ecosystem; influenced his move toward Next.js for gujianjun.net.
- **Sarah** — Intern under Jake's direct management (joined ~mid-2024, ~1 year after Jake). Jordanian-German, strong Mandarin. Responsible for: one Chinese-learning article per week, Adsy outreach for backlinks (3–5 per week). Jake's first and only direct report at GoEast.

---

## Key Data Points (do not fabricate other numbers)

| Metric | Value | Relevant to |
|--------|-------|-------------|
| Organic clicks growth | 10K → 30K+ | A0, A1 |
| Keywords in top 10 | 65 | A0, A1 |
| Adult course CPL | ~$5 | A0, A5 |
| Vocab test emails captured | 1,500+ in first 3 days | A0, A11 |
| GEO content architecture | 60 articles, 11 pillars, ~199K words | A0, A3 |
| CF7 outage caused by bug | Reading CF7 mail state inside `phpmailer_init` | A7 |
| Name generator launch | April 2026; email required after 2 uses or on saving name card | A0, A12 |
| Sarah's outreach cadence | 3–5 backlinks per week via Adsy, 1 article per week | A13, A15 |
| Topic map scope | Adults, K12, pronunciation, grammar, exams, business Chinese | A14 |

---

## Writing Guidelines

### Article length
| Type | Approximate length | Examples |
|------|--------------------|---------|
| Technical deep-dive | 1,500–2,500 words | A1, A5, A9 |
| Campaign case study | 1,000–1,800 words | A4, A6 |
| Tool/plugin build | 600–1,000 words | A7, A8 |
| Lead gen experiment | 800–1,200 words | A11, A12 |
| Process / methodology | 800–1,500 words | A13, A14, A15 |
| Overview hub | 2,000–3,500 words | A0 |

### Language rules
- **Article body, all headings, section titles: Chinese (Simplified)**
- **Keep in English**: product names, tool names, technical terms, proper nouns, metric labels, code snippets, UI strings
- Examples: Google Ads, GA4, GTM, SEO, GEO, CPL, CRM, Salesforce, Brevo, Zapier, CF7, WordPress, Acuity, MDX, API, mu-plugin, WP-Cron, Looker Studio, GSC, Ahrefs, LLM, RAG, CTR, CPC, ROAS, lead, landing page, conversion, Adsy, topic map, outreach
- Do not translate these terms into Chinese equivalents

---

## MDX Frontmatter Template

```mdx
---
title: ""
description: ""
date: "YYYY-MM-DD"
tags: ["GoEast", "case-study", "{cluster-tag}"]
category: "case-study"
client: "GoEast Mandarin"
---
```

Cluster tags: `seo`, `geo`, `google-ads`, `martech`, `wordpress`, `lead-gen`, `team`, `process`

---

## Author Context

- Author: Jake Gu (顾家骏), Digital Marketing & Technology Lead at GoEast Mandarin (May 2023 – May 2026)
- Role: SEO/GEO strategy, Google Ads, WordPress/PHP dev, GA4/GTM, CRM integrations, intern management (Sarah)
- GoEast: online + offline Chinese language school, based in Shanghai
- gujianjun.net: Jake's personal site — this case study series serves as portfolio and GEO authority-building experiment
