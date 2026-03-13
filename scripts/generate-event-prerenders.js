#!/usr/bin/env node
/**
 * Pre-build: fetch all published events from the live API and write a
 * minimal HTML file for each one into public/events/{id}/{slug}/index.html
 *
 * WHY:
 *   Events currently only display in a modal on /events — no individual URLs
 *   for Google to index. This script generates pre-rendered HTML with Event
 *   JSON-LD schema so Google can show event rich results.
 *
 * USAGE:
 *   node scripts/generate-event-prerenders.js
 */

import { mkdirSync, writeFileSync } from 'fs';
import { resolve, join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

const API_URL  = process.env.API_URL  || 'https://vaalhub-api-production.up.railway.app';
const SITE_URL = process.env.SITE_URL || 'https://vaalhub.co.za';
const OUT_DIR  = resolve(__dirname, '..', 'public', 'events');
const DEFAULT_IMAGE = `${SITE_URL}/vaalhub-logo.png`;

// ── Helpers ──────────────────────────────────────────────────────────────────

function slugify(text = '') {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '') || 'event';
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
  return stripped.length > maxLen ? stripped.slice(0, maxLen - 1) + '\u2026' : stripped;
}

function absoluteUrl(url) {
  if (!url) return null;
  return url.startsWith('http') ? url : `${SITE_URL}${url}`;
}

/**
 * Format startDate for Google Event rich results.
 * Google requires at least YYYY-MM-DD, preferably with time.
 */
function formatEventDate(dateStr, timeStr) {
  if (!dateStr) return undefined;
  try {
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return dateStr;
    // If we have a time string like "18:00" or "6pm", combine with date
    if (timeStr) {
      const timeParts = timeStr.match(/(\d{1,2}):(\d{2})/);
      if (timeParts) {
        d.setHours(parseInt(timeParts[1]), parseInt(timeParts[2]));
        return d.toISOString();
      }
    }
    // Return date only (YYYY-MM-DD) if no time
    return d.toISOString().split('T')[0];
  } catch {
    return dateStr;
  }
}

// ── HTML generator ────────────────────────────────────────────────────────────

function generateHtml(event) {
  const rawTitle    = event.title || 'Event';
  const title       = escapeHtml(`${rawTitle} | VaalHub Events`);
  const slug        = slugify(rawTitle);
  const eventUrl    = `${SITE_URL}/events/${event.event_id}/${slug}`;
  const image       = absoluteUrl(event.image_url) || DEFAULT_IMAGE;
  const description = escapeHtml(toDescription(event.description || `${rawTitle} in ${event.location || 'the Vaal Triangle'}. Find details, dates and more on VaalHub.`));
  const location    = event.location || 'Vaal Triangle';
  const addressRegion = (location === 'Sasolburg') ? 'Free State' : 'Gauteng';

  const startDate = formatEventDate(event.date_start, event.time);
  const endDate   = formatEventDate(event.date_end, null);

  // JSON-LD Event schema (optimized for Google rich results)
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Event',
    name: rawTitle,
    description: toDescription(event.description || ''),
    url: eventUrl,
    image: image ? [image] : undefined,
    ...(startDate && { startDate }),
    ...(endDate   && { endDate }),
    location: {
      '@type': 'Place',
      name: location,
      address: {
        '@type': 'PostalAddress',
        addressLocality: location,
        addressRegion,
        addressCountry: 'ZA',
      },
    },
    ...(event.organizer && { organizer: { '@type': 'Organization', name: event.organizer } }),
    ...(event.price && {
      offers: {
        '@type': 'Offer',
        price: event.price,
        priceCurrency: 'ZAR',
        url: eventUrl,
        availability: 'https://schema.org/InStock',
      },
    }),
    eventStatus: 'https://schema.org/EventScheduled',
    eventAttendanceMode: 'https://schema.org/OfflineEventAttendanceMode',
    inLanguage: 'en-ZA',
  };

  const breadcrumb = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home',   item: `${SITE_URL}/` },
      { '@type': 'ListItem', position: 2, name: 'Events', item: `${SITE_URL}/events` },
      { '@type': 'ListItem', position: 3, name: rawTitle },
    ],
  };

  // Human-readable date for the pre-render body (helps crawlers)
  const dateDisplay = event.date_start
    ? new Date(event.date_start).toLocaleDateString('en-ZA', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })
    : '';

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <title>${title}</title>
  <meta name="description"  content="${description}">
  <meta name="robots"       content="index, follow">
  <link rel="canonical"     href="${escapeHtml(eventUrl)}">
  <!-- Open Graph -->
  <meta property="og:type"        content="website">
  <meta property="og:url"         content="${escapeHtml(eventUrl)}">
  <meta property="og:title"       content="${title}">
  <meta property="og:description" content="${description}">
  <meta property="og:image"       content="${escapeHtml(image)}">
  <meta property="og:image:alt"   content="${escapeHtml(rawTitle)}">
  <meta property="og:site_name"   content="VaalHub">
  <meta property="og:locale"      content="en_ZA">
  <!-- Twitter / X -->
  <meta name="twitter:card"        content="summary_large_image">
  <meta name="twitter:site"        content="@VaalHub">
  <meta name="twitter:title"       content="${title}">
  <meta name="twitter:description" content="${description}">
  <meta name="twitter:image"       content="${escapeHtml(image)}">
  <meta name="twitter:image:alt"   content="${escapeHtml(rawTitle)}">
  <!-- JSON-LD schemas -->
  <script type="application/ld+json">${JSON.stringify(schema)}</script>
  <script type="application/ld+json">${JSON.stringify(breadcrumb)}</script>
</head>
<body>
  <h1>${escapeHtml(rawTitle)}</h1>
  ${dateDisplay ? `<p>${dateDisplay}</p>` : ''}
  <p>${escapeHtml(location)}</p>
</body>
</html>`;
}

// ── Fetch all events ─────────────────────────────────────────────────────────

async function fetchAllEvents() {
  const events = [];
  let page = 1;
  const limit = 100;

  while (true) {
    const url = `${API_URL}/api/events?status=published&upcoming=false&limit=${limit}&offset=${(page - 1) * limit}`;
    console.log(`  Fetching page ${page}: ${url}`);
    const res = await fetch(url);
    if (!res.ok) throw new Error(`API returned ${res.status} for ${url}`);
    const data = await res.json();

    const items = Array.isArray(data) ? data : (data.data || data.events || data.items || []);
    if (!items.length) break;

    events.push(...items);
    console.log(`  Got ${items.length} events (total so far: ${events.length})`);

    if (items.length < limit) break;
    page++;
  }

  return events;
}

// ── Main ──────────────────────────────────────────────────────────────────────

async function main() {
  console.log(`\n📅 Event Pre-render Generator`);
  console.log(`   API:  ${API_URL}`);
  console.log(`   Site: ${SITE_URL}`);
  console.log(`   Out:  ${OUT_DIR}\n`);

  let events;
  try {
    events = await fetchAllEvents();
  } catch (err) {
    console.error(`\n❌ Failed to fetch events: ${err.message}`);
    console.error('   Skipping event pre-render generation.\n');
    process.exit(0);
  }

  if (!events.length) {
    console.log('No published events found — nothing to generate.');
    process.exit(0);
  }

  mkdirSync(OUT_DIR, { recursive: true });
  let written = 0;

  for (const event of events) {
    const slug = slugify(event.title || '');
    const dir  = join(OUT_DIR, String(event.event_id), slug);
    mkdirSync(dir, { recursive: true });

    const html = generateHtml(event);
    writeFileSync(join(dir, 'index.html'), html, 'utf8');
    written++;
    console.log(`  ✅ events/${event.event_id}/${slug}/`);
  }

  console.log(`\n✨ Done — ${written} event pre-renders written to public/events/\n`);
}

main().catch(err => {
  console.error('generate-event-prerenders error:', err);
  process.exit(1);
});
