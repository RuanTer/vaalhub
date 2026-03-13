#!/usr/bin/env node
/**
 * Pre-build: generate pre-rendered HTML for each town page with SEO metadata.
 *
 * WHY:
 *   Town pages are static React components with ZERO Helmet/SEO metadata.
 *   Google sees a blank SPA shell. These pre-renders add town-specific
 *   title, description, keywords, and Place JSON-LD so the pages can rank
 *   for searches like "Vereeniging news", "things to do in Vanderbijlpark".
 *
 * USAGE:
 *   node scripts/generate-town-prerenders.js
 */

import { mkdirSync, writeFileSync } from 'fs';
import { resolve, join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

const SITE_URL = process.env.SITE_URL || 'https://vaalhub.co.za';
const OUT_DIR  = resolve(__dirname, '..', 'public', 'towns');
const DEFAULT_IMAGE = `${SITE_URL}/vaalhub-logo.png`;

function escapeHtml(str) {
  return String(str || '')
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

// ── Town data ────────────────────────────────────────────────────────────────

const TOWNS = [
  {
    slug: 'vereeniging',
    name: 'Vereeniging',
    province: 'Gauteng',
    description: 'Vereeniging local news, events, businesses and things to do. Your complete guide to life in Vereeniging, Vaal Triangle, South Africa.',
    keywords: 'Vereeniging, Vereeniging news, events in Vereeniging, Vereeniging businesses, things to do Vereeniging, Three Rivers, Vaal Triangle',
    geo: { lat: -26.6731, lng: 27.9263 },
  },
  {
    slug: 'vanderbijlpark',
    name: 'Vanderbijlpark',
    province: 'Gauteng',
    description: 'Vanderbijlpark local news, events, businesses and things to do. Your complete guide to life in Vanderbijlpark, Vaal Triangle, South Africa.',
    keywords: 'Vanderbijlpark, Vanderbijlpark news, events in Vanderbijlpark, Vanderbijlpark businesses, things to do Vanderbijlpark, VDP, Vaal Triangle',
    geo: { lat: -26.7113, lng: 27.8380 },
  },
  {
    slug: 'meyerton',
    name: 'Meyerton',
    province: 'Gauteng',
    description: 'Meyerton local news, events, businesses and things to do. Your complete guide to life in Meyerton, Midvaal, Vaal Triangle, South Africa.',
    keywords: 'Meyerton, Meyerton news, events in Meyerton, Meyerton businesses, things to do Meyerton, Midvaal, Vaal Triangle',
    geo: { lat: -26.5559, lng: 28.0045 },
  },
  {
    slug: 'sasolburg',
    name: 'Sasolburg',
    province: 'Free State',
    description: 'Sasolburg local news, events, businesses and things to do. Your complete guide to life in Sasolburg, Vaal Triangle, South Africa.',
    keywords: 'Sasolburg, Sasolburg news, events in Sasolburg, Sasolburg businesses, things to do Sasolburg, Vaalpark, Vaal Triangle',
    geo: { lat: -26.8137, lng: 27.8168 },
  },
  {
    slug: 'sharpeville',
    name: 'Sharpeville',
    province: 'Gauteng',
    description: 'Sharpeville local news, events, businesses and things to do. Your complete guide to life in Sharpeville, Vaal Triangle, South Africa.',
    keywords: 'Sharpeville, Sharpeville news, events in Sharpeville, Sharpeville businesses, things to do Sharpeville, Sharpeville history, Vaal Triangle',
    geo: { lat: -26.6867, lng: 27.8700 },
  },
];

// ── HTML generator ────────────────────────────────────────────────────────────

function generateHtml(town) {
  const title = escapeHtml(`${town.name} - News, Events & Local Guide | VaalHub`);
  const description = escapeHtml(town.description);
  const townUrl = `${SITE_URL}/towns/${town.slug}`;

  // JSON-LD Place schema
  const placeSchema = {
    '@context': 'https://schema.org',
    '@type': 'Place',
    name: town.name,
    description: town.description,
    url: townUrl,
    geo: {
      '@type': 'GeoCoordinates',
      latitude: town.geo.lat,
      longitude: town.geo.lng,
    },
    address: {
      '@type': 'PostalAddress',
      addressLocality: town.name,
      addressRegion: town.province,
      addressCountry: 'ZA',
    },
    containedInPlace: {
      '@type': 'Place',
      name: 'Vaal Triangle',
    },
  };

  const breadcrumb = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home',       item: `${SITE_URL}/` },
      { '@type': 'ListItem', position: 2, name: 'Towns',      item: `${SITE_URL}/towns` },
      { '@type': 'ListItem', position: 3, name: town.name },
    ],
  };

  // WebPage schema for local guide
  const webPageSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: `${town.name} - Local Guide`,
    description: town.description,
    url: townUrl,
    isPartOf: { '@type': 'WebSite', name: 'VaalHub', url: SITE_URL },
    about: { '@type': 'Place', name: town.name },
    inLanguage: 'en-ZA',
  };

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <title>${title}</title>
  <meta name="description"  content="${description}">
  <meta name="keywords"     content="${escapeHtml(town.keywords)}">
  <meta name="robots"       content="index, follow">
  <link rel="canonical"     href="${escapeHtml(townUrl)}">
  <meta name="geo.placename" content="${escapeHtml(town.name)}, Vaal Triangle">
  <meta name="geo.region"    content="ZA-${town.province === 'Free State' ? 'FS' : 'GT'}">
  <meta name="geo.position"  content="${town.geo.lat};${town.geo.lng}">
  <!-- Open Graph -->
  <meta property="og:type"        content="website">
  <meta property="og:url"         content="${escapeHtml(townUrl)}">
  <meta property="og:title"       content="${title}">
  <meta property="og:description" content="${description}">
  <meta property="og:image"       content="${DEFAULT_IMAGE}">
  <meta property="og:site_name"   content="VaalHub">
  <meta property="og:locale"      content="en_ZA">
  <!-- Twitter / X -->
  <meta name="twitter:card"        content="summary_large_image">
  <meta name="twitter:site"        content="@VaalHub">
  <meta name="twitter:title"       content="${title}">
  <meta name="twitter:description" content="${description}">
  <meta name="twitter:image"       content="${DEFAULT_IMAGE}">
  <!-- JSON-LD schemas -->
  <script type="application/ld+json">${JSON.stringify(placeSchema)}</script>
  <script type="application/ld+json">${JSON.stringify(breadcrumb)}</script>
  <script type="application/ld+json">${JSON.stringify(webPageSchema)}</script>
</head>
<body>
  <h1>${escapeHtml(town.name)} - News, Events & Local Guide</h1>
  <p>${description}</p>
</body>
</html>`;
}

// ── Main ──────────────────────────────────────────────────────────────────────

function main() {
  console.log(`\n🏘️  Town Pre-render Generator`);
  console.log(`   Site: ${SITE_URL}`);
  console.log(`   Out:  ${OUT_DIR}\n`);

  mkdirSync(OUT_DIR, { recursive: true });
  let written = 0;

  for (const town of TOWNS) {
    const dir = join(OUT_DIR, town.slug);
    mkdirSync(dir, { recursive: true });

    const html = generateHtml(town);
    writeFileSync(join(dir, 'index.html'), html, 'utf8');
    written++;
    console.log(`  ✅ towns/${town.slug}/`);
  }

  console.log(`\n✨ Done — ${written} town pre-renders written to public/towns/\n`);
}

main();
