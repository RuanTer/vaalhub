#!/usr/bin/env node
/**
 * Post-build: inject page-specific meta tags from pre-renders into
 * the Vite-built React shell (dist/index.html).
 *
 * Handles two page types:
 *   • dist/news/{slug}/index.html         (articles)
 *   • dist/businesses/{id}/{slug}/index.html  (business profiles)
 *
 * WHY:
 *   Pre-render files contain page-specific meta tags + JSON-LD.  Vite copies
 *   them to dist/ as-is, but they have no React app — Googlebot would see a
 *   blank shell and social media crawlers would show generic VaalHub branding.
 *
 *   This script REPLACES each file with a copy of dist/index.html (the full
 *   React SPA shell) that has the page-specific meta tags injected into <head>.
 *
 *   Result for every pre-rendered URL:
 *     - Crawler reads correct title, description, og:image, JSON-LD  ✅
 *     - React Router renders the page for human visitors              ✅
 *     - HTTP 200 — no redirects                                       ✅
 */

import { readFileSync, writeFileSync, readdirSync, existsSync } from 'fs';
import { resolve, join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const distDir   = resolve(__dirname, '..', 'dist');
const distIndex = join(distDir, 'index.html');

// ── Sanity check ─────────────────────────────────────────────────────────────
if (!existsSync(distIndex)) {
  console.error('inject-prerenders: dist/index.html not found — run npm run build first');
  process.exit(1);
}

const reactShell = readFileSync(distIndex, 'utf8');

// ── Core injector ─────────────────────────────────────────────────────────────
/**
 * Read a pre-render file, extract its <head> content, and write a new file
 * that is the React shell with those meta tags prepended inside <head>.
 *
 * @param {string} preRenderPath  Full path to the existing pre-render file
 * @param {string} label          Human-readable label for logging (e.g. "news/my-article")
 * @returns {boolean}  true if processed, false if skipped
 */
function injectPrerender(preRenderPath, label) {
  if (!existsSync(preRenderPath)) return false;

  const preRenderHtml = readFileSync(preRenderPath, 'utf8');

  const headMatch = preRenderHtml.match(/<head>([\s\S]*?)<\/head>/i);
  if (!headMatch) {
    console.warn(`  SKIP (no <head>): ${label}`);
    return false;
  }

  let pageHead = headMatch[1]
    // Strip legacy sessionStorage redirect script (shouldn't appear in new files)
    .replace(/<script>[\s\S]*?sessionStorage\.redirect[\s\S]*?<\/script>/gi, '')
    // Strip charset + viewport — already in the React shell
    .replace(/<meta\s+charset[^>]*>/gi, '')
    .replace(/<meta\s+name=["']viewport["'][^>]*>/gi, '')
    .trim();

  if (!pageHead) {
    console.warn(`  SKIP (empty head after strip): ${label}`);
    return false;
  }

  const newHtml = reactShell.replace(
    /(<head>)/i,
    `$1\n  <!-- Pre-render meta: ${label} -->\n  ${pageHead}\n`
  );

  writeFileSync(preRenderPath, newHtml, 'utf8');
  return true;
}

// ── Process news articles ─────────────────────────────────────────────────────
let newsCount = 0;
let newsTotal = 0;

const distNewsDir = join(distDir, 'news');
if (existsSync(distNewsDir)) {
  const slugDirs = readdirSync(distNewsDir, { withFileTypes: true })
    .filter(d => d.isDirectory())
    .map(d => d.name);

  newsTotal = slugDirs.length;
  for (const slug of slugDirs) {
    const path = join(distNewsDir, slug, 'index.html');
    if (injectPrerender(path, `news/${slug}`)) {
      newsCount++;
      console.log(`  ✅ news/${slug}/`);
    }
  }
} else {
  console.log('inject-prerenders: no dist/news/ directory — skipping articles');
}

// ── Process business profiles ─────────────────────────────────────────────────
let bizCount = 0;
let bizTotal = 0;

const distBizDir = join(distDir, 'businesses');
if (existsSync(distBizDir)) {
  // Structure: dist/businesses/{id}/{slug}/index.html
  const idDirs = readdirSync(distBizDir, { withFileTypes: true })
    .filter(d => d.isDirectory())
    .map(d => d.name);

  for (const bizId of idDirs) {
    const idPath = join(distBizDir, bizId);
    const slugDirs = readdirSync(idPath, { withFileTypes: true })
      .filter(d => d.isDirectory())
      .map(d => d.name);

    bizTotal += slugDirs.length;
    for (const slug of slugDirs) {
      const path = join(idPath, slug, 'index.html');
      if (injectPrerender(path, `businesses/${bizId}/${slug}`)) {
        bizCount++;
        console.log(`  ✅ businesses/${bizId}/${slug}/`);
      }
    }
  }
} else {
  console.log('inject-prerenders: no dist/businesses/ directory — skipping business profiles');
}

// ── Process event pages ──────────────────────────────────────────────────────
let eventCount = 0;
let eventTotal = 0;

const distEventDir = join(distDir, 'events');
if (existsSync(distEventDir)) {
  // Structure: dist/events/{id}/{slug}/index.html
  const idDirs = readdirSync(distEventDir, { withFileTypes: true })
    .filter(d => d.isDirectory())
    .map(d => d.name);

  for (const eventId of idDirs) {
    const idPath = join(distEventDir, eventId);
    const slugDirs = readdirSync(idPath, { withFileTypes: true })
      .filter(d => d.isDirectory())
      .map(d => d.name);

    eventTotal += slugDirs.length;
    for (const slug of slugDirs) {
      const path = join(idPath, slug, 'index.html');
      if (injectPrerender(path, `events/${eventId}/${slug}`)) {
        eventCount++;
        console.log(`  ✅ events/${eventId}/${slug}/`);
      }
    }
  }
} else {
  console.log('inject-prerenders: no dist/events/ directory — skipping events');
}

// ── Process town pages ───────────────────────────────────────────────────────
let townCount = 0;
let townTotal = 0;

const distTownDir = join(distDir, 'towns');
if (existsSync(distTownDir)) {
  const townDirs = readdirSync(distTownDir, { withFileTypes: true })
    .filter(d => d.isDirectory())
    .map(d => d.name);

  townTotal = townDirs.length;
  for (const town of townDirs) {
    const path = join(distTownDir, town, 'index.html');
    if (injectPrerender(path, `towns/${town}`)) {
      townCount++;
      console.log(`  ✅ towns/${town}/`);
    }
  }
} else {
  console.log('inject-prerenders: no dist/towns/ directory — skipping towns');
}

// ── Summary ───────────────────────────────────────────────────────────────────
console.log(`\ninject-prerenders: done`);
console.log(`  Articles  : ${newsCount}/${newsTotal} enriched`);
console.log(`  Businesses: ${bizCount}/${bizTotal} enriched`);
console.log(`  Events    : ${eventCount}/${eventTotal} enriched`);
console.log(`  Towns     : ${townCount}/${townTotal} enriched`);
