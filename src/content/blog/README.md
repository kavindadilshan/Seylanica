# Knowledge Hub articles

Each `.md` file in this folder is one article. The file name is the URL:
`ceylon-vs-cassia.md` is published at `/blog/ceylon-vs-cassia`.

## Adding a real photo to an article (no code changes)

1. Name the photo after the article's file name: `ceylon-vs-cassia.jpg`
   (`.webp`, `.jpg`, `.jpeg` or `.png`).
2. Put it in `public/images/blog/`.
3. Rebuild or redeploy. The article, its card, its social-share preview and its
   structured data all switch to the real photo automatically.

Until a photo exists, an article shows its category's default image (set in
`src/data/blog.ts`). Use landscape photos, ideally 1600 × 900 px or larger and
under 400 KB (WebP is smallest). To describe the photo for screen readers and
Google Images, add `imageAlt: ...` to the article's frontmatter.

To use one photo for several articles, set `image: /images/blog/your-photo.jpg`
in each article's frontmatter instead.

## Article format

```markdown
---
title: Ceylon Cinnamon vs Cassia: 7 Differences Every Buyer Should Know
description: One or two sentences, about 150 characters. Shown in Google results and social previews.
category: ceylon-cinnamon-basics
date: 2026-03-14
updated: 2026-05-02          # optional; set when you materially revise an article
tags: ceylon vs cassia, coumarin, quills
imageAlt: Ceylon quills beside cassia bark   # optional
keyTakeaways:
  - First short, self-contained takeaway.
  - Second takeaway.
faq:
  - q: A question buyers ask?
    a: A direct answer in one to three sentences.
---

Opening paragraph that answers the title's question directly...

## A section heading

Body text in Markdown. Link to other articles with `/blog/<slug>` and to site
pages with `/products`, `/quality`, `/quote`, `/buyer-hub` or `/shop`.
```

Categories: `ceylon-cinnamon-basics`, `grades-specifications`, `quality-lab-testing`,
`import-export`, `buying-sourcing`, `private-label-retail`, `culinary-industry-uses`,
`origin-sustainability`, `market-insights`.

## Writing rules (compliance)

- No health or medical claims. Describe flavour, use and lab data, never benefits.
- Tie figures (coumarin, moisture, volatile oil) to the lot Certificate of Analysis.
- Do not claim certifications that are not held (see `COMPLIANCE` in `src/config/site.ts`).
- Lead each section with the direct answer; AI assistants and featured snippets quote it.
