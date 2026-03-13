#!/usr/bin/env node
/**
 * Pre-build: fetch all published news articles from the live API and write a
 * minimal HTML file for each one into public/news/{slug}/index.html
 *
 * WHY:
 *   VaalHub's React SPA renders meta tags in the browser via react-helmet-async.
 *   Search engines and social media crawlers may not execute JavaScript — they
 *   read the raw HTML.  Without pre-rendered meta, articles are invisible to
 *   Google and shared links show generic VaalHub branding.
 *
 *   inject-prerenders.js then merges those meta tags into dist/index.html
 *   so the deployed page has correct SEO + the full React SPA.
 *
 * USAGE:
 *   node scripts/generate-news-prerenders.js
 *
 * Run BEFORE `npm run build`, or via `npm run prerenders`.
 */

import { mkdirSync, writeFileSync } from 'fs';
import { resolve, join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

const API_URL  = process.env.API_URL  || 'https://vaalhub-api-production.up.railway.app';
const SITE_URL = process.env.SITE_URL || 'https://vaalhub.co.za';
const OUT_DIR  = resolve(__dirname, '..', 'public', 'news');
const DEFAULT_IMAGE = `${SITE_URL}/vaalhub-logo.png`;

// ── Helpers ──────────────────────────────────────────────────────────────────

function slugify(text = '') {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '') || 'article';
}

function escapeHtml(str) {
  return String(str || '')
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

function toDescription(text = '', maxLen = 155) {
  const stripped = text.replace(/<[^>]+>/g, '').replace(/\[IMAGE:\d+\]/g, '').replace(/\s+/g, ' ').trim();
  return stripped.length > maxLen ? stripped.slice(0, maxLen - 1) + '\u2026' : stripped;
}

function absoluteUrl(url) {
  if (!url) return null;
  return url.startsWith('http') ? url : `${SITE_URL}${url}`;
}

// ── HTML generator ────────────────────────────────────────────────────────────

function generateHtml(article) {
  const headline    = escapeHtml(article.headline || 'Article');
  const rawHeadline = article.headline || 'Article';
  const slug        = article.slug || slugify(rawHeadline);
  const articleUrl  = `${SITE_URL}/news/${slug}`;
  const image       = absoluteUrl(article.image_url) || DEFAULT_IMAGE;
  const rawDesc     = article.summary || (article.full_text || '').replace(/\[IMAGE:\d+\]/g, '').trim();
  const description = escapeHtml(toDescription(rawDesc));
  const title       = escapeHtml(`${rawHeadline} | VaalHub`);
  const publishDate = article.publish_date
    ? new Date(article.publish_date).toISOString()
    : undefined;
  const modifiedDate = article.edited_date
    ? new Date(article.edited_date).toISOString()
    : publishDate;

  // JSON-LD NewsArticle schema
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'NewsArticle',
    headline: rawHeadline,
    description: toDescription(rawDesc),
    url: articleUrl,
    image: image ? [image] : undefined,
    ...(publishDate  && { datePublished: publishDate }),
    ...(modifiedDate && { dateModified: modifiedDate }),
    author: {
      '@type': 'Organization',
      name: article.source_name || 'VaalHub',
      url: article.source_url || SITE_URL,
    },
    publisher: {
      '@type': 'Organization',
      name: 'VaalHub',
      logo: { '@type': 'ImageObject', url: DEFAULT_IMAGE },
      url: SITE_URL,
    },
    mainEntityOfPage: { '@type': 'WebPage', '@id': articleUrl },
    ...(article.category && { articleSection: article.category }),
    isAccessibleForFree: 'True',
    inLanguage: 'en-ZA',
  };

  const breadcrumb = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home',    item: `${SITE_URL}/` },
      { '@type': 'ListItem', position: 2, name: 'News',    item: `${SITE_URL}/news` },
      { '@type': 'ListItem', position: 3, name: rawHeadline },
    ],
  };

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <title>${title}</title>
  <meta name="description"  content="${description}">
  <meta name="robots"       content="index, follow">
  <link rel="canonical"     href="${escapeHtml(articleUrl)}">
  <!-- Open Graph -->
  <meta property="og:type"        content="article">
  <meta property="og:url"         content="${escapeHtml(articleUrl)}">
  <meta property="og:title"       content="${title}">
  <meta property="og:description" content="${description}">
  <meta property="og:image"       content="${escapeHtml(image)}">
  <meta property="og:image:alt"   content="${headline}">
  <meta property="og:site_name"   content="VaalHub">
  <meta property="og:locale"      content="en_ZA">
${publishDate ? `  <meta property="article:published_time" content="${publishDate}">
  <meta property="article:modified_time"  content="${modifiedDate}">` : ''}
${article.category ? `  <meta property="article:section" content="${escapeHtml(article.category)}">` : ''}
  <!-- Twitter / X -->
  <meta name="twitter:card"        content="summary_large_image">
  <meta name="twitter:site"        content="@VaalHub">
  <meta name="twitter:title"       content="${title}">
  <meta name="twitter:description" content="${description}">
  <meta name="twitter:image"       content="${escapeHtml(image)}">
  <meta name="twitter:image:alt"   content="${headline}">
  <!-- JSON-LD schemas -->
  <script type="application/ld+json">${JSON.stringify(schema)}</script>
  <script type="application/ld+json">${JSON.stringify(breadcrumb)}</script>
</head>
<body></body>
</html>`;
}

// ── Fetch all articles ───────────────────────────────────────────────────────

async function fetchAllArticles() {
  const articles = [];
  let page = 1;
  const limit = 100;

  while (true) {
    const url = `${API_URL}/api/news?status=published&limit=${limit}&offset=${(page - 1) * limit}`;
    console.log(`  Fetching page ${page}: ${url}`);
    const res = await fetch(url);
    if (!res.ok) throw new Error(`API returned ${res.status} for ${url}`);
    const data = await res.json();

    const items = Array.isArray(data) ? data : (data.articles || data.news || data.items || []);
    if (!items.length) break;

    articles.push(...items);
    console.log(`  Got ${items.length} articles (total so far: ${articles.length})`);

    if (items.length < limit) break;
    page++;
  }

  return articles;
}

// ── Main ──────────────────────────────────────────────────────────────────────

async function main() {
  console.log(`\n📰 News Pre-render Generator`);
  console.log(`   API:  ${API_URL}`);
  console.log(`   Site: ${SITE_URL}`);
  console.log(`   Out:  ${OUT_DIR}\n`);

  let articles;
  try {
    articles = await fetchAllArticles();
  } catch (err) {
    console.error(`\n❌ Failed to fetch articles: ${err.message}`);
    console.error('   Make sure the API is running and API_URL is correct.');
    console.error('   Skipping news pre-render generation.\n');
    process.exit(0);
  }

  if (!articles.length) {
    console.log('No published articles found — nothing to generate.');
    process.exit(0);
  }

  mkdirSync(OUT_DIR, { recursive: true });
  let written = 0;

  for (const article of articles) {
    const slug = article.slug || slugify(article.headline || '');
    const dir  = join(OUT_DIR, slug);
    mkdirSync(dir, { recursive: true });

    const html = generateHtml(article);
    writeFileSync(join(dir, 'index.html'), html, 'utf8');
    written++;
    console.log(`  ✅ news/${slug}/`);
  }

  console.log(`\n✨ Done — ${written} news pre-renders written to public/news/\n`);
}

main().catch(err => {
  console.error('generate-news-prerenders error:', err);
  process.exit(1);
});
