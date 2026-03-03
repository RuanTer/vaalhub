#!/usr/bin/env node
/**
 * Post-build: inject article-specific meta tags from pre-renders into
 * the Vite-built React shell (dist/index.html), writing the result to
 * each dist/news/{slug}/index.html.
 *
 * WHY:
 *   The pre-render files in public/news/{slug}/index.html contain all
 *   article-specific meta tags + JSON-LD.  Vite copies them to dist/
 *   as-is, but they have no React app — Googlebot would see a blank shell.
 *
 *   This script REPLACES each dist/news/{slug}/index.html with a copy of
 *   dist/index.html (the full React SPA shell) that has the article meta
 *   tags injected into <head>.  Result:
 *     - Googlebot reads article title, description, og:* and JSON-LD ✅
 *     - React Router renders the article at the correct URL (no redirect) ✅
 *     - HTTP 200 for every article URL ✅
 */

const fs   = require('fs');
const path = require('path');

const distDir       = path.resolve(__dirname, '..', 'dist');
const distIndex     = path.join(distDir, 'index.html');
const distNewsDir   = path.join(distDir, 'news');

// ── Sanity checks ────────────────────────────────────────────────────────────
if (!fs.existsSync(distIndex)) {
  console.error('inject-prerenders: dist/index.html not found — run npm run build first');
  process.exit(1);
}
if (!fs.existsSync(distNewsDir)) {
  console.log('inject-prerenders: no dist/news/ directory — nothing to do');
  process.exit(0);
}

const reactShell = fs.readFileSync(distIndex, 'utf8');

// ── Process each article directory ──────────────────────────────────────────
const slugDirs = fs.readdirSync(distNewsDir, { withFileTypes: true })
  .filter(d => d.isDirectory())
  .map(d => d.name);

let count = 0;

for (const slug of slugDirs) {
  const preRenderPath = path.join(distNewsDir, slug, 'index.html');
  if (!fs.existsSync(preRenderPath)) continue;

  const preRenderHtml = fs.readFileSync(preRenderPath, 'utf8');

  // Extract <head> content from the pre-render (our article meta tags + JSON-LD)
  const headMatch = preRenderHtml.match(/<head>([\s\S]*?)<\/head>/i);
  if (!headMatch) {
    console.warn(`  SKIP (no <head>): news/${slug}/index.html`);
    continue;
  }

  let articleHead = headMatch[1]
    // Strip the sessionStorage redirect script (safety — shouldn't be there anymore)
    .replace(/<script>[\s\S]*?sessionStorage\.redirect[\s\S]*?<\/script>/gi, '')
    // Strip charset + viewport — already in dist/index.html, avoid duplication
    .replace(/<meta\s+charset[^>]*>/gi, '')
    .replace(/<meta\s+name=["']viewport["'][^>]*>/gi, '')
    .trim();

  if (!articleHead) {
    console.warn(`  SKIP (empty head after strip): news/${slug}/index.html`);
    continue;
  }

  // Inject article meta tags immediately after the opening <head> tag in the React shell
  const newHtml = reactShell.replace(
    /(<head>)/i,
    `$1\n  <!-- Article pre-render meta: ${slug} -->\n  ${articleHead}\n`
  );

  fs.writeFileSync(preRenderPath, newHtml, 'utf8');
  count++;
  console.log(`  ✅ news/${slug}/`);
}

console.log(`\ninject-prerenders: done — ${count}/${slugDirs.length} pages enriched`);
