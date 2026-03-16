#!/usr/bin/env node
/**
 * Pre-build: fetch all published businesses from the live API and write a
 * minimal HTML file for each one into public/businesses/{id}/{slug}/index.html
 *
 * WHY:
 *   VaalHub's React SPA renders meta tags in the browser via react-helmet-async.
 *   Social media link-preview crawlers (WhatsApp, Facebook, Telegram, Slack,
 *   LinkedIn…) do NOT execute JavaScript — they read the raw HTML served by the
 *   web host.  Without pre-rendered meta, every shared business link shows the
 *   generic VaalHub branding instead of the business logo + description.
 *
 *   This script generates a thin HTML shell for each business page.
 *   inject-prerenders.js then merges those meta tags into dist/index.html
 *   so the deployed page has:
 *     - Correct og:title, og:description, og:image (business logo) ✅
 *     - JSON-LD LocalBusiness schema for Google ✅
 *     - Full React SPA for human visitors ✅
 *
 * USAGE:
 *   node scripts/generate-business-prerenders.js
 *
 * ENV VARS:
 *   API_URL   Base URL of the VaalHub API  (default: https://vaalhub-api-production.up.railway.app)
 *   SITE_URL  Public URL of the website    (default: https://vaalhub.co.za)
 *
 * Run this script BEFORE `npm run build`, or add to a `prebuild` npm script.
 */

import { mkdirSync, writeFileSync } from 'fs';
import { resolve, join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

const API_URL  = process.env.API_URL  || 'https://vaalhub-api-production.up.railway.app';
const SITE_URL = process.env.SITE_URL || 'https://vaalhub.co.za';
const OUT_DIR  = resolve(__dirname, '..', 'public', 'businesses');
const DEFAULT_IMAGE = `${SITE_URL}/vaalhub-logo.png`;

// ── Helpers ──────────────────────────────────────────────────────────────────

function slugify(name = '') {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '') || 'business';
}

function escapeHtml(str) {
  return String(str || '')
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

function toDescription(text = '', maxLen = 155) {
  const stripped = text.replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim();
  return stripped.length > maxLen ? stripped.slice(0, maxLen - 1) + '…' : stripped;
}

function absoluteUrl(url) {
  if (!url) return null;
  return url.startsWith('http') ? url : `${SITE_URL}${url}`;
}

function mapCategory(category) {
  const map = {
    Restaurant:    'FoodEstablishment',
    Retail:        'Store',
    Healthcare:    'MedicalOrganization',
    Entertainment: 'EntertainmentBusiness',
    Automotive:    'AutomotiveBusiness',
    Education:     'EducationalOrganization',
    'Real Estate': 'RealEstateAgent',
    Financial:     'FinancialService',
    Construction:  'HomeAndConstructionBusiness',
  };
  return map[category] || 'LocalBusiness';
}

// ── HTML generator ────────────────────────────────────────────────────────────

function generateHtml(biz) {
  const name        = escapeHtml(biz.business_name || biz.name || 'Business');
  const rawName     = biz.business_name || biz.name || 'Business';
  const slug        = slugify(rawName);
  const bizUrl      = `${SITE_URL}/businesses/${biz.business_id}/${slug}`;
  const image       = absoluteUrl(biz.logo_url) || DEFAULT_IMAGE;
  const description = escapeHtml(
    toDescription(
      biz.description ||
      `${rawName} is a local ${biz.category || 'business'} in ${biz.area || biz.location || 'the Vaal Triangle'}. Find contact details, hours and more on VaalHub.`
    )
  );
  const title       = escapeHtml(`${rawName} | VaalHub Business Directory`);
  const area        = escapeHtml(biz.area || biz.location || 'Vaal Triangle');
  const addressRegion = (biz.area === 'Sasolburg' || biz.location === 'Sasolburg') ? 'Free State' : 'Gauteng';

  // JSON-LD LocalBusiness schema
  const sameAs = [biz.website, biz.facebook, biz.instagram, biz.source_url]
    .map(u => absoluteUrl(u))
    .filter(Boolean);

  const schema = {
    '@context': 'https://schema.org',
    '@type': mapCategory(biz.category),
    '@id': bizUrl,
    name: rawName,
    description: biz.description || `${rawName} — local business in the Vaal Triangle.`,
    url: biz.website || biz.source_url || bizUrl,
    image: { '@type': 'ImageObject', url: image, caption: `${rawName} logo` },
    ...(biz.phone   && { telephone: biz.phone }),
    ...(biz.email   && { email: biz.email }),
    ...(sameAs.length && { sameAs }),
    address: {
      '@type':          'PostalAddress',
      streetAddress:    biz.address || '',
      addressLocality:  biz.area || biz.location || 'Vaal Triangle',
      addressRegion,
      addressCountry:   'ZA',
    },
    ...(biz.operating_hours && { openingHours: biz.operating_hours }),
    ...(biz.google_rating   && {
      aggregateRating: {
        '@type':     'AggregateRating',
        ratingValue: String(biz.google_rating),
        reviewCount: String(biz.google_review_count || 1),
        bestRating:  '5',
        worstRating: '1',
      },
    }),
    areaServed: [
      {
        '@type': 'Place',
        name: biz.area || 'Vaal Triangle',
        address: {
          '@type': 'PostalAddress',
          addressLocality: biz.area || biz.location || 'Vaal Triangle',
          addressRegion,
          addressCountry: 'ZA',
        },
      },
      {
        '@type': 'GeoCircle',
        geoMidpoint: {
          '@type': 'GeoCoordinates',
          latitude: -26.6735,
          longitude: 27.9262,
        },
        geoRadius: '30000',
      },
    ],
    geo: {
      '@type': 'GeoCoordinates',
      latitude: -26.6735,
      longitude: 27.9262,
    },
    ...(biz.tags && {
      hasOfferCatalog: {
        '@type': 'OfferCatalog',
        name: `Services by ${rawName}`,
        itemListElement: biz.tags.split(',').slice(0, 8).map(tag => ({
          '@type': 'OfferCatalog',
          name: tag.trim(),
          itemListElement: [{
            '@type': 'Offer',
            itemOffered: {
              '@type': 'Service',
              name: tag.trim(),
              areaServed: {
                '@type': 'Place',
                name: biz.area || 'Vaal Triangle',
              },
            },
          }],
        })),
      },
    }),
    currenciesAccepted: 'ZAR',
    inLanguage: 'en-ZA',
  };

  const breadcrumb = {
    '@context': 'https://schema.org',
    '@type':    'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home',       item: `${SITE_URL}/` },
      { '@type': 'ListItem', position: 2, name: 'Businesses', item: `${SITE_URL}/businesses` },
      { '@type': 'ListItem', position: 3, name: rawName },
    ],
  };

  // Build service keywords from tags
  const tagKeywords = biz.tags
    ? biz.tags.split(',').map(t => escapeHtml(t.trim())).filter(Boolean).join(', ')
    : '';
  const metaKeywords = [rawName, biz.category, biz.area || 'Vaal Triangle', 'Vaal Triangle', tagKeywords, 'VaalHub'].filter(Boolean).join(', ');

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <title>${title}</title>
  <meta name="description"  content="${description}">
  <meta name="keywords"     content="${escapeHtml(metaKeywords)}">
  <meta name="robots"       content="index, follow">
  <link rel="canonical"     href="${escapeHtml(bizUrl)}">
  <!-- Open Graph -->
  <meta property="og:type"        content="website">
  <meta property="og:url"         content="${escapeHtml(bizUrl)}">
  <meta property="og:title"       content="${title}">
  <meta property="og:description" content="${description}">
  <meta property="og:image"       content="${escapeHtml(image)}">
  <meta property="og:image:alt"   content="${name} logo">
  <meta property="og:site_name"   content="VaalHub">
  <meta property="og:locale"      content="en_ZA">
  <!-- Twitter / X -->
  <meta name="twitter:card"        content="summary_large_image">
  <meta name="twitter:site"        content="@VaalHub">
  <meta name="twitter:title"       content="${title}">
  <meta name="twitter:description" content="${description}">
  <meta name="twitter:image"       content="${escapeHtml(image)}">
  <meta name="twitter:image:alt"   content="${name} logo">
  <!-- JSON-LD schemas -->
  <script type="application/ld+json">${JSON.stringify(schema)}</script>
  <script type="application/ld+json">${JSON.stringify(breadcrumb)}</script>
</head>
<body>
  <h1>${name}</h1>
  <p>${description}</p>
  ${biz.tags ? `<p>Services: ${escapeHtml(biz.tags.split(',').map(t => t.trim()).join(', '))}</p>` : ''}
  <p>Location: ${area}, Vaal Triangle, South Africa</p>
  <a href="/businesses">Back to Business Directory</a>
</body>
</html>`;
}

// ── Fetch all businesses ──────────────────────────────────────────────────────

async function fetchAllBusinesses() {
  const businesses = [];
  let page = 1;
  const limit = 100;

  while (true) {
    const url = `${API_URL}/api/businesses?status=published&limit=${limit}&offset=${(page - 1) * limit}`;
    console.log(`  Fetching page ${page}: ${url}`);
    const res = await fetch(url);
    if (!res.ok) throw new Error(`API returned ${res.status} for ${url}`);
    const data = await res.json();

    const items = Array.isArray(data) ? data : (data.businesses || data.items || []);
    if (!items.length) break;

    businesses.push(...items);
    console.log(`  Got ${items.length} businesses (total so far: ${businesses.length})`);

    if (items.length < limit) break;
    page++;
  }

  return businesses;
}

// ── Main ──────────────────────────────────────────────────────────────────────

async function main() {
  console.log(`\n📍 API:  ${API_URL}`);
  console.log(`🌐 Site: ${SITE_URL}`);
  console.log(`📁 Out:  ${OUT_DIR}\n`);

  let businesses;
  try {
    businesses = await fetchAllBusinesses();
  } catch (err) {
    console.error(`\n❌ Failed to fetch businesses: ${err.message}`);
    console.error('   Make sure the API is running and API_URL is correct.');
    console.error('   Skipping pre-render generation.\n');
    process.exit(0); // Soft exit — don't break the build
  }

  if (!businesses.length) {
    console.log('No published businesses found — nothing to generate.');
    process.exit(0);
  }

  mkdirSync(OUT_DIR, { recursive: true });
  let written = 0;

  for (const biz of businesses) {
    const slug = slugify(biz.business_name || biz.name || '');
    const dir  = join(OUT_DIR, String(biz.business_id), slug);
    mkdirSync(dir, { recursive: true });

    const html = generateHtml(biz);
    writeFileSync(join(dir, 'index.html'), html, 'utf8');
    written++;
    console.log(`  ✅ businesses/${biz.business_id}/${slug}/`);
  }

  console.log(`\n✨ Done — ${written} business pre-renders written to public/businesses/\n`);
}

main().catch(err => {
  console.error('generate-business-prerenders error:', err);
  process.exit(1);
});
