#!/usr/bin/env node
/**
 * Pre-build: generate static HTML shells for event landing pages.
 *
 * WHY:
 *   These pages target SEO queries like "events in Vereeniging",
 *   "markets Vaal Triangle", "what's on this weekend Vanderbijlpark".
 *   Crawlers (Google, social media) do NOT execute JavaScript, so we need
 *   pre-rendered HTML with proper meta tags, JSON-LD schemas, and visible
 *   heading text for each page type.
 *
 * OUTPUT:
 *   public/events/this-weekend/index.html
 *   public/events/{locationSlug}/index.html
 *   public/events/category/{categorySlug}/index.html
 *   public/events/category/{categorySlug}/{locationSlug}/index.html
 *
 * USAGE:
 *   node scripts/generate-events-landing-prerenders.js
 *
 * ENV VARS:
 *   SITE_URL  Public URL of the website (default: https://vaalhub.co.za)
 */

import { mkdirSync, writeFileSync } from 'fs';
import { resolve, join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

const SITE_URL = process.env.SITE_URL || 'https://vaalhub.co.za';
const OUT_DIR  = resolve(__dirname, '..', 'public', 'events');
const DEFAULT_IMAGE = `${SITE_URL}/vaalhub-logo.png`;

// ── Data ────────────────────────────────────────────────────────────────────

const LOCATIONS = [
  { slug: 'vereeniging', label: 'Vereeniging', region: 'Gauteng' },
  { slug: 'vanderbijlpark', label: 'Vanderbijlpark', region: 'Gauteng' },
  { slug: 'meyerton', label: 'Meyerton', region: 'Gauteng' },
  { slug: 'sasolburg', label: 'Sasolburg', region: 'Free State' },
  { slug: 'sharpeville', label: 'Sharpeville', region: 'Gauteng' },
];

const EVENT_CATEGORIES = [
  { slug: 'markets', label: 'Markets', apiCategory: 'Markets' },
  { slug: 'live-music', label: 'Live Music', apiCategory: 'Music' },
  { slug: 'sports', label: 'Sports', apiCategory: 'Sports' },
  { slug: 'food-and-drink', label: 'Food & Drink', apiCategory: 'Food & Drink' },
  { slug: 'arts-and-culture', label: 'Arts & Culture', apiCategory: 'Arts & Culture' },
  { slug: 'family', label: 'Family & Kids', apiCategory: 'Family' },
  { slug: 'kids-activities', label: 'Kids Activities', apiCategory: 'Family' },
  { slug: 'business', label: 'Business', apiCategory: 'Business' },
  { slug: 'community', label: 'Community', apiCategory: 'Community' },
];

// ── Helpers ──────────────────────────────────────────────────────────────────

function escapeHtml(str) {
  return String(str || '')
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

const allLocations = 'Vereeniging, Vanderbijlpark, Meyerton and Sasolburg';

// ── SEO content for each page type ──────────────────────────────────────────

function getThisWeekendSEO() {
  return {
    title: "What's On This Weekend | Vaal Triangle Events | VaalHub",
    description: `Find out what's happening this weekend in the Vaal Triangle. Browse events, markets, live music, family activities and more across ${allLocations}.`,
    keywords: "what's on this weekend Vaal Triangle, weekend events Vaal, things to do this weekend Vereeniging, weekend activities Vanderbijlpark, VaalHub events",
    h1: "What's On This Weekend",
    intro: `Discover what's happening this weekend across the Vaal Triangle. From markets and live music to family activities and community events in ${allLocations}.`,
    path: '/events/this-weekend',
    faqs: [
      { q: 'What is there to do this weekend in the Vaal Triangle?', a: `Browse upcoming weekend events across ${allLocations} on VaalHub. Find markets, live music, sports, family activities and more.` },
      { q: 'What events are happening near me this weekend?', a: 'VaalHub lists events across the Vaal Triangle. Filter by location to find events near you this weekend.' },
      { q: 'Where can I find weekend activities in the Vaal Triangle?', a: `Check VaalHub for the latest weekend events in ${allLocations} and Sharpeville. New events are added daily.` },
    ],
    breadcrumbs: [
      { name: 'Home', url: '/' },
      { name: 'Events', url: '/events' },
      { name: 'This Weekend' },
    ],
  };
}

function getLocationSEO(location) {
  const loc = location.label;
  return {
    title: `Events in ${loc} | Things To Do This Week | VaalHub`,
    description: `Discover upcoming events, markets, festivals and things to do in ${loc}, Vaal Triangle. Find live music, sports, family activities and more on VaalHub.`,
    keywords: `events ${loc}, things to do ${loc}, what's on ${loc}, markets ${loc}, Vaal Triangle events`,
    h1: `Events in ${loc}`,
    intro: `Find upcoming events, markets, live music, sports and family activities in ${loc}. Your guide to things to do in the Vaal Triangle.`,
    path: `/events/${location.slug}`,
    faqs: [
      { q: `What events are happening in ${loc} this weekend?`, a: `VaalHub lists all upcoming events in ${loc} including markets, live music, sports, family activities and community events. Check back regularly for new listings.` },
      { q: `Where can I find things to do in ${loc}?`, a: `Browse VaalHub's events page for things to do in ${loc}. Filter by category to find exactly what you're looking for.` },
      { q: `What markets are in ${loc}?`, a: `Find weekend markets, craft markets, food markets and more in ${loc} on VaalHub. New market listings are added regularly.` },
    ],
    breadcrumbs: [
      { name: 'Home', url: '/' },
      { name: 'Events', url: '/events' },
      { name: loc },
    ],
  };
}

function getCategorySEO(category) {
  const cat = category.label;
  return {
    title: `${cat} in the Vaal Triangle | VaalHub Events`,
    description: `Find local ${cat.toLowerCase()} across the Vaal Triangle. Browse weekend ${cat.toLowerCase()}, upcoming ${cat.toLowerCase()} and more in ${allLocations}.`,
    keywords: `${cat.toLowerCase()} Vaal Triangle, ${cat.toLowerCase()} Vereeniging, ${cat.toLowerCase()} Vanderbijlpark, ${cat.toLowerCase()} events, VaalHub`,
    h1: `${cat} in the Vaal Triangle`,
    intro: `Discover ${cat.toLowerCase()} happening across the Vaal Triangle. Find upcoming events in ${allLocations} and Sharpeville.`,
    path: `/events/category/${category.slug}`,
    faqs: [
      { q: `What ${cat.toLowerCase()} are happening in the Vaal Triangle?`, a: `VaalHub lists upcoming ${cat.toLowerCase()} across ${allLocations} and Sharpeville. Browse our events page for dates, venues and details.` },
      { q: `Where can I find ${cat.toLowerCase()} near me?`, a: `Check VaalHub for ${cat.toLowerCase()} in your area. Filter by location to find events in ${allLocations}.` },
      { q: `How do I submit a ${cat.toLowerCase().replace(/s$/, '')} event?`, a: 'Visit VaalHub and click "Add Your Event" to submit your event for free. Events are reviewed and published within 24 hours.' },
    ],
    breadcrumbs: [
      { name: 'Home', url: '/' },
      { name: 'Events', url: '/events' },
      { name: cat },
    ],
  };
}

function getCategoryLocationSEO(category, location) {
  const cat = category.label;
  const loc = location.label;
  return {
    title: `${cat} in ${loc} | VaalHub Events`,
    description: `Find local ${cat.toLowerCase()} in ${loc}. Browse weekend ${cat.toLowerCase()}, upcoming ${cat.toLowerCase()} and more on VaalHub.`,
    keywords: `${cat.toLowerCase()} ${loc}, ${cat.toLowerCase()} in ${loc}, ${loc} ${cat.toLowerCase()}, Vaal Triangle ${cat.toLowerCase()}, VaalHub`,
    h1: `${cat} in ${loc}`,
    intro: `Discover ${cat.toLowerCase()} happening in ${loc}, Vaal Triangle. Browse upcoming events, find dates and details on VaalHub.`,
    path: `/events/category/${category.slug}/${location.slug}`,
    faqs: [
      { q: `What ${cat.toLowerCase()} are happening in ${loc}?`, a: `VaalHub lists upcoming ${cat.toLowerCase()} in ${loc} and across the Vaal Triangle. Browse our events page for dates, venues and details.` },
      { q: `Where can I find ${cat.toLowerCase()} near ${loc}?`, a: `Check VaalHub for ${cat.toLowerCase()} in ${loc} and surrounding areas including ${allLocations}.` },
    ],
    breadcrumbs: [
      { name: 'Home', url: '/' },
      { name: 'Events', url: '/events' },
      { name: cat, url: `/events/category/${category.slug}` },
      { name: loc },
    ],
  };
}

// ── HTML generator ──────────────────────────────────────────────────────────

function generateHtml(seo) {
  const pageUrl = `${SITE_URL}${seo.path}`;
  const title = escapeHtml(seo.title);
  const description = escapeHtml(seo.description);

  const collectionSchema = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: seo.h1,
    description: seo.description,
    url: pageUrl,
    isPartOf: { '@type': 'WebSite', name: 'VaalHub', url: SITE_URL },
    inLanguage: 'en-ZA',
  };

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: seo.faqs.map(f => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: { '@type': 'Answer', text: f.a },
    })),
  };

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: seo.breadcrumbs.map((c, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: c.name,
      ...(c.url ? { item: `${SITE_URL}${c.url}` } : {}),
    })),
  };

  const breadcrumbNav = seo.breadcrumbs
    .map((c, i) => {
      if (c.url) return `<a href="${c.url}">${escapeHtml(c.name)}</a>`;
      return escapeHtml(c.name);
    })
    .join(' &gt; ');

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <title>${title}</title>
  <meta name="description"  content="${description}">
  <meta name="keywords"     content="${escapeHtml(seo.keywords)}">
  <meta name="robots"       content="index, follow">
  <link rel="canonical"     href="${escapeHtml(pageUrl)}">
  <!-- Open Graph -->
  <meta property="og:type"        content="website">
  <meta property="og:url"         content="${escapeHtml(pageUrl)}">
  <meta property="og:title"       content="${title}">
  <meta property="og:description" content="${description}">
  <meta property="og:image"       content="${escapeHtml(DEFAULT_IMAGE)}">
  <meta property="og:image:alt"   content="${escapeHtml(seo.h1)}">
  <meta property="og:site_name"   content="VaalHub">
  <meta property="og:locale"      content="en_ZA">
  <!-- Twitter / X -->
  <meta name="twitter:card"        content="summary_large_image">
  <meta name="twitter:site"        content="@VaalHub">
  <meta name="twitter:title"       content="${title}">
  <meta name="twitter:description" content="${description}">
  <meta name="twitter:image"       content="${escapeHtml(DEFAULT_IMAGE)}">
  <!-- JSON-LD schemas -->
  <script type="application/ld+json">${JSON.stringify(collectionSchema)}</script>
  <script type="application/ld+json">${JSON.stringify(faqSchema)}</script>
  <script type="application/ld+json">${JSON.stringify(breadcrumbSchema)}</script>
</head>
<body>
  <h1>${escapeHtml(seo.h1)}</h1>
  <p>${escapeHtml(seo.intro)}</p>
  <nav>${breadcrumbNav}</nav>
</body>
</html>`;
}

// ── Main ────────────────────────────────────────────────────────────────────

function main() {
  console.log(`\n🌐 Site: ${SITE_URL}`);
  console.log(`📁 Out:  ${OUT_DIR}\n`);

  mkdirSync(OUT_DIR, { recursive: true });
  let written = 0;

  // 1. This weekend page
  const weekendDir = join(OUT_DIR, 'this-weekend');
  mkdirSync(weekendDir, { recursive: true });
  writeFileSync(join(weekendDir, 'index.html'), generateHtml(getThisWeekendSEO()), 'utf8');
  written++;
  console.log('  ✅ events/this-weekend/');

  // 2. Location pages
  for (const location of LOCATIONS) {
    const locDir = join(OUT_DIR, location.slug);
    mkdirSync(locDir, { recursive: true });
    writeFileSync(join(locDir, 'index.html'), generateHtml(getLocationSEO(location)), 'utf8');
    written++;
    console.log(`  ✅ events/${location.slug}/`);
  }

  // 3. Category pages
  const catDir = join(OUT_DIR, 'category');
  mkdirSync(catDir, { recursive: true });
  for (const category of EVENT_CATEGORIES) {
    const catSlugDir = join(catDir, category.slug);
    mkdirSync(catSlugDir, { recursive: true });
    writeFileSync(join(catSlugDir, 'index.html'), generateHtml(getCategorySEO(category)), 'utf8');
    written++;
    console.log(`  ✅ events/category/${category.slug}/`);

    // 4. Category + location combo pages
    for (const location of LOCATIONS) {
      const comboDir = join(catSlugDir, location.slug);
      mkdirSync(comboDir, { recursive: true });
      writeFileSync(join(comboDir, 'index.html'), generateHtml(getCategoryLocationSEO(category, location)), 'utf8');
      written++;
      console.log(`  ✅ events/category/${category.slug}/${location.slug}/`);
    }
  }

  console.log(`\n✨ Done — ${written} event landing pre-renders written.\n`);
}

main();
