#!/usr/bin/env node
/**
 * Pre-build: generate static HTML shells for service landing pages.
 *
 * WHY:
 *   These pages target SEO queries like "plumber in Vereeniging",
 *   "electrician near me Vaal Triangle", "fencing services Vanderbijlpark".
 *   Crawlers (Google, social media) do NOT execute JavaScript, so we need
 *   pre-rendered HTML with proper meta tags, JSON-LD schemas, and visible
 *   heading text for each service + location combination.
 *
 * OUTPUT:
 *   public/businesses/services/{serviceSlug}/index.html
 *   public/businesses/services/{serviceSlug}/{locationSlug}/index.html
 *
 * USAGE:
 *   node scripts/generate-service-prerenders.js
 *
 * ENV VARS:
 *   SITE_URL  Public URL of the website (default: https://vaalhub.co.za)
 */

import { mkdirSync, writeFileSync } from 'fs';
import { resolve, join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

const SITE_URL = process.env.SITE_URL || 'https://vaalhub.co.za';
const OUT_DIR  = resolve(__dirname, '..', 'public', 'businesses', 'services');
const DEFAULT_IMAGE = `${SITE_URL}/vaalhub-logo.png`;

// ── Service & location data ──────────────────────────────────────────────────

const SERVICE_PAGES = [
  // Construction
  { slug: 'plumber', label: 'Plumber', category: 'Construction', searchTag: 'plumber' },
  { slug: 'plumbing', label: 'Plumbing Services', category: 'Construction', searchTag: 'plumbing' },
  { slug: 'electrician', label: 'Electrician', category: 'Construction', searchTag: 'electrician' },
  { slug: 'electrical', label: 'Electrical Services', category: 'Construction', searchTag: 'electrical' },
  { slug: 'fencing', label: 'Fencing Services', category: 'Construction', searchTag: 'fencing' },
  { slug: 'painting', label: 'Painting Services', category: 'Construction', searchTag: 'painting' },
  { slug: 'roofing', label: 'Roofing Services', category: 'Construction', searchTag: 'roofing' },
  { slug: 'tiling', label: 'Tiling Services', category: 'Construction', searchTag: 'tiling' },
  { slug: 'building', label: 'Building Contractors', category: 'Construction', searchTag: 'building' },
  { slug: 'welding', label: 'Welding Services', category: 'Construction', searchTag: 'welding' },
  { slug: 'landscaping', label: 'Landscaping', category: 'Construction', searchTag: 'landscaping' },
  { slug: 'solar', label: 'Solar Installation', category: 'Construction', searchTag: 'solar' },
  { slug: 'handyman', label: 'Handyman Services', category: 'Construction', searchTag: 'handyman' },
  { slug: 'waterproofing', label: 'Waterproofing', category: 'Construction', searchTag: 'waterproofing' },
  { slug: 'paving', label: 'Paving Services', category: 'Construction', searchTag: 'paving' },

  // Automotive
  { slug: 'mechanic', label: 'Mechanic', category: 'Automotive', searchTag: 'mechanic' },
  { slug: 'panel-beater', label: 'Panel Beater', category: 'Automotive', searchTag: 'panel beater' },
  { slug: 'towing', label: 'Towing Services', category: 'Automotive', searchTag: 'towing' },
  { slug: 'car-wash', label: 'Car Wash', category: 'Automotive', searchTag: 'car wash' },
  { slug: 'tyres', label: 'Tyre Services', category: 'Automotive', searchTag: 'tyres' },

  // Healthcare
  { slug: 'dentist', label: 'Dentist', category: 'Healthcare', searchTag: 'dentist' },
  { slug: 'doctor', label: 'Doctor', category: 'Healthcare', searchTag: 'doctor' },
  { slug: 'physiotherapy', label: 'Physiotherapy', category: 'Healthcare', searchTag: 'physiotherapy' },
  { slug: 'pharmacy', label: 'Pharmacy', category: 'Healthcare', searchTag: 'pharmacy' },
  { slug: 'vet', label: 'Veterinarian', category: 'Healthcare', searchTag: 'vet' },
  { slug: 'gym', label: 'Gym & Fitness', category: 'Healthcare', searchTag: 'gym' },
  { slug: 'hair-salon', label: 'Hair Salon', category: 'Healthcare', searchTag: 'hair salon' },
  { slug: 'beauty-salon', label: 'Beauty Salon', category: 'Healthcare', searchTag: 'beauty salon' },

  // Service
  { slug: 'cleaning', label: 'Cleaning Services', category: 'Service', searchTag: 'cleaning' },
  { slug: 'pest-control', label: 'Pest Control', category: 'Service', searchTag: 'pest control' },
  { slug: 'security', label: 'Security Services', category: 'Service', searchTag: 'security' },
  { slug: 'locksmith', label: 'Locksmith', category: 'Service', searchTag: 'locksmith' },
  { slug: 'removals', label: 'Removals & Moving', category: 'Service', searchTag: 'removals' },
  { slug: 'garden-service', label: 'Garden Service', category: 'Service', searchTag: 'garden service' },
  { slug: 'catering', label: 'Catering Services', category: 'Service', searchTag: 'catering' },

  // Professional Services
  { slug: 'attorney', label: 'Attorney', category: 'Professional Services', searchTag: 'attorney' },
  { slug: 'accountant', label: 'Accountant', category: 'Professional Services', searchTag: 'accountant' },
  { slug: 'estate-agent', label: 'Estate Agent', category: 'Professional Services', searchTag: 'estate agent' },
  { slug: 'insurance', label: 'Insurance', category: 'Professional Services', searchTag: 'insurance' },

  // Restaurant
  { slug: 'pizza', label: 'Pizza', category: 'Restaurant', searchTag: 'pizza' },
  { slug: 'coffee-shop', label: 'Coffee Shop', category: 'Restaurant', searchTag: 'coffee shop' },
  { slug: 'takeaway', label: 'Takeaway', category: 'Restaurant', searchTag: 'takeaway' },
  { slug: 'steakhouse', label: 'Steakhouse', category: 'Restaurant', searchTag: 'steakhouse' },

  // Education
  { slug: 'driving-school', label: 'Driving School', category: 'Education', searchTag: 'driving school' },
  { slug: 'creche', label: 'Cr\u00e8che & Daycare', category: 'Education', searchTag: 'creche' },
  { slug: 'tutoring', label: 'Tutoring', category: 'Education', searchTag: 'tutoring' },

  // Entertainment
  { slug: 'wedding-venue', label: 'Wedding Venue', category: 'Entertainment', searchTag: 'wedding venue' },
  { slug: 'function-venue', label: 'Function Venue', category: 'Entertainment', searchTag: 'function venue' },
];

const LOCATIONS = [
  { slug: 'vereeniging', label: 'Vereeniging', region: 'Gauteng' },
  { slug: 'vanderbijlpark', label: 'Vanderbijlpark', region: 'Gauteng' },
  { slug: 'meyerton', label: 'Meyerton', region: 'Gauteng' },
  { slug: 'sasolburg', label: 'Sasolburg', region: 'Free State' },
  { slug: 'sharpeville', label: 'Sharpeville', region: 'Gauteng' },
];

// ── Helpers ──────────────────────────────────────────────────────────────────

function escapeHtml(str) {
  return String(str || '')
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

// ── HTML generator ───────────────────────────────────────────────────────────

function generateHtml(service, location) {
  const serviceName = service.label;
  const serviceNameLower = serviceName.toLowerCase();
  const hasLocation = !!location;
  const locationName = hasLocation ? location.label : 'Vaal Triangle';
  const region = hasLocation ? location.region : 'Gauteng';

  const pageUrl = hasLocation
    ? `${SITE_URL}/businesses/services/${service.slug}/${location.slug}`
    : `${SITE_URL}/businesses/services/${service.slug}`;

  const title = escapeHtml(
    hasLocation
      ? `${serviceName} in ${locationName} | VaalHub Business Directory`
      : `${serviceName} | Vaal Triangle | VaalHub`
  );

  const description = escapeHtml(
    hasLocation
      ? `Find trusted ${serviceNameLower} in ${locationName}, Vaal Triangle. Compare reviews, contact details and get quotes. Browse verified local ${serviceNameLower} businesses on VaalHub.`
      : `Find the best ${serviceNameLower} across the Vaal Triangle. Compare reviews, get contact details and quotes from verified local businesses on VaalHub.`
  );

  const heading = hasLocation
    ? `${serviceName} in ${locationName}`
    : `${serviceName} in the Vaal Triangle`;

  const introText = hasLocation
    ? `Looking for a trusted ${serviceNameLower} in ${locationName}? Browse verified local businesses, compare Google reviews and get contact details on VaalHub.`
    : `Find the best ${serviceNameLower} across the Vaal Triangle, including Vereeniging, Vanderbijlpark, Meyerton, Sasolburg and Sharpeville.`;

  // JSON-LD: Service schema
  const serviceSchema = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: `${serviceName}${hasLocation ? ` in ${locationName}` : ' - Vaal Triangle'}`,
    description: hasLocation
      ? `Find trusted ${serviceNameLower} in ${locationName}, Vaal Triangle. Compare reviews, contact details and get quotes.`
      : `Find the best ${serviceNameLower} across the Vaal Triangle.`,
    url: pageUrl,
    areaServed: {
      '@type': 'Place',
      name: locationName,
      address: {
        '@type': 'PostalAddress',
        addressLocality: locationName,
        addressRegion: region,
        addressCountry: 'ZA',
      },
    },
    provider: {
      '@type': 'Organization',
      name: 'VaalHub',
      url: SITE_URL,
    },
    serviceType: serviceName,
    inLanguage: 'en-ZA',
  };

  // JSON-LD: FAQPage
  const faqQuestions = hasLocation
    ? [
        { q: `Where can I find a ${serviceNameLower} in ${locationName}?`, a: `VaalHub lists verified ${serviceNameLower} businesses in ${locationName}. Browse our directory to compare reviews, contact details and services offered.` },
        { q: `How do I choose the best ${serviceNameLower} in ${locationName}?`, a: `Check Google reviews, verify contact details, and compare multiple ${serviceNameLower} providers on VaalHub to find the best fit for your needs in ${locationName}.` },
        { q: `Are there verified ${serviceNameLower} businesses on VaalHub?`, a: `Yes, VaalHub features verified businesses with confirmed contact details and Google reviews to help you make informed decisions.` },
      ]
    : [
        { q: `Where can I find a ${serviceNameLower} in the Vaal Triangle?`, a: `VaalHub lists ${serviceNameLower} businesses across Vereeniging, Vanderbijlpark, Meyerton, Sasolburg and Sharpeville.` },
        { q: `How do I choose the best ${serviceNameLower} in the Vaal Triangle?`, a: `Compare reviews, check verified status, and contact multiple providers through VaalHub to find the right ${serviceNameLower} for your needs.` },
        { q: `Are there verified ${serviceNameLower} businesses on VaalHub?`, a: `Yes, VaalHub features verified businesses with confirmed contact details and Google reviews to help you make informed decisions.` },
      ];

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqQuestions.map(faq => ({
      '@type': 'Question',
      name: faq.q,
      acceptedAnswer: { '@type': 'Answer', text: faq.a },
    })),
  };

  // JSON-LD: BreadcrumbList
  const breadcrumbItems = [
    { '@type': 'ListItem', position: 1, name: 'Home', item: `${SITE_URL}/` },
    { '@type': 'ListItem', position: 2, name: 'Businesses', item: `${SITE_URL}/businesses` },
    { '@type': 'ListItem', position: 3, name: service.category, item: `${SITE_URL}/businesses?category=${encodeURIComponent(service.category)}` },
    { '@type': 'ListItem', position: 4, name: serviceName, item: `${SITE_URL}/businesses/services/${service.slug}` },
  ];
  if (hasLocation) {
    breadcrumbItems.push({ '@type': 'ListItem', position: 5, name: locationName });
  }

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: breadcrumbItems,
  };

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <title>${title}</title>
  <meta name="description"  content="${description}">
  <meta name="robots"       content="index, follow">
  <link rel="canonical"     href="${escapeHtml(pageUrl)}">
  <!-- Open Graph -->
  <meta property="og:type"        content="website">
  <meta property="og:url"         content="${escapeHtml(pageUrl)}">
  <meta property="og:title"       content="${title}">
  <meta property="og:description" content="${description}">
  <meta property="og:image"       content="${escapeHtml(DEFAULT_IMAGE)}">
  <meta property="og:image:alt"   content="${escapeHtml(`${serviceName} in ${locationName}`)}">
  <meta property="og:site_name"   content="VaalHub">
  <meta property="og:locale"      content="en_ZA">
  <!-- Twitter / X -->
  <meta name="twitter:card"        content="summary_large_image">
  <meta name="twitter:site"        content="@VaalHub">
  <meta name="twitter:title"       content="${title}">
  <meta name="twitter:description" content="${description}">
  <meta name="twitter:image"       content="${escapeHtml(DEFAULT_IMAGE)}">
  <!-- JSON-LD schemas -->
  <script type="application/ld+json">${JSON.stringify(serviceSchema)}</script>
  <script type="application/ld+json">${JSON.stringify(faqSchema)}</script>
  <script type="application/ld+json">${JSON.stringify(breadcrumbSchema)}</script>
</head>
<body>
  <h1>${escapeHtml(heading)}</h1>
  <p>${escapeHtml(introText)}</p>
  <p>Browse the VaalHub business directory to find verified ${escapeHtml(serviceNameLower)} businesses${hasLocation ? ` in ${escapeHtml(locationName)}` : ' across the Vaal Triangle'}.</p>
  <nav>
    <a href="/">Home</a> &gt;
    <a href="/businesses">Businesses</a> &gt;
    <a href="/businesses/services/${service.slug}">${escapeHtml(serviceName)}</a>${hasLocation ? ` &gt; ${escapeHtml(locationName)}` : ''}
  </nav>
</body>
</html>`;
}

// ── Main ─────────────────────────────────────────────────────────────────────

function main() {
  console.log(`\n🌐 Site: ${SITE_URL}`);
  console.log(`📁 Out:  ${OUT_DIR}\n`);

  mkdirSync(OUT_DIR, { recursive: true });
  let written = 0;

  for (const service of SERVICE_PAGES) {
    // 1. Service-only page (no location)
    const serviceDir = join(OUT_DIR, service.slug);
    mkdirSync(serviceDir, { recursive: true });
    const html = generateHtml(service, null);
    writeFileSync(join(serviceDir, 'index.html'), html, 'utf8');
    written++;
    console.log(`  ✅ businesses/services/${service.slug}/`);

    // 2. Service + location pages
    for (const location of LOCATIONS) {
      const locDir = join(serviceDir, location.slug);
      mkdirSync(locDir, { recursive: true });
      const locHtml = generateHtml(service, location);
      writeFileSync(join(locDir, 'index.html'), locHtml, 'utf8');
      written++;
      console.log(`  ✅ businesses/services/${service.slug}/${location.slug}/`);
    }
  }

  console.log(`\n✨ Done — ${written} service landing pre-renders written.\n`);
}

main();
