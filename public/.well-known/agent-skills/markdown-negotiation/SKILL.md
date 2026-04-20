# Skill: Markdown Content Negotiation

`gujianjun.net` supports HTTP content negotiation for Markdown per the
Cloudflare *Markdown for Agents* conventions.

## How to use

Send an HTTP `Accept` header that prefers Markdown when fetching any
article page:

```
GET /blog/{slug}    HTTP/1.1
Accept: text/markdown
```

```
GET /geo/{slug}     HTTP/1.1
Accept: text/markdown
```

The server returns the raw Markdown source of the post with:

- `Content-Type: text/markdown; charset=utf-8`
- `x-markdown-tokens: <approx token count>`   (≈ chars / 4)
- `Vary: Accept`
- A `Link: <self>; rel="alternate"; type="text/markdown"` header is also
  advertised on the HTML response.

Browsers (which send `Accept: text/html,...`) continue to get the normal
HTML page — there is no behavior change for humans.

## Scope

- `/blog/{slug}`   — personal articles + case studies
- `/geo/{slug}`    — Generative Engine Optimization research articles

Front matter is stripped and replaced with a compact quoted metadata block
(title, date, tags, canonical URL). The article body is served verbatim.

## Example

```
curl -H 'Accept: text/markdown' https://www.gujianjun.net/blog/goeast-mandarin-case-study
```
