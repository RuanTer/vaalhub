/**
 * useSEO — builds arrays of Helmet-compatible React elements for each page type.
 * Returns plain React.createElement calls (no JSX) so this file stays as .js.
 *
 * Usage inside a .jsx component:
 *   import { Helmet } from 'react-helmet-async';
 *   import { buildArticleMeta } from '../hooks/useSEO';
 *
 *   <Helmet>{buildArticleMeta(article)}</Helmet>
 */

import React from 'react';

const SITE_URL = 'https://vaalhub.co.za';
const SITE_NAME = 'VaalHub';
const DEFAULT_IMAGE = `${SITE_URL}/vaalhub-logo.png`;
const TWITTER_HANDLE = '@VaalHub';

// ── Helpers ──────────────────────────────────────────────────────────────

/** Strip HTML and truncate to ~155 chars for meta description */
export function toDescription(text, maxLen = 155) {
  if (!text) return '';
  const stripped = text.replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim();
  return stripped.length > maxLen ? stripped.slice(0, maxLen - 1) + '\u2026' : stripped;
}

const e = React.createElement;

/** Build a JSON-LD <script> element */
function jsonLd(schema, keyPrefix = 'json-ld') {
  return e('script', {
    key: keyPrefix,
    type: 'application/ld+json',
    dangerouslySetInnerHTML: { __html: JSON.stringify(schema) },
  });
}

// ── Keyword extraction ────────────────────────────────────────────────────

const STOPWORDS = new Set([
  'with','from','that','this','have','been','will','they','what','when',
  'where','which','while','about','after','before','their','there','these',
  'those','would','could','should','also','into','over','more','than','just',
  'only','both','each','such','even','back','very','much','then','some',
  'other','your','says','said','says','after','were',
]);

const AREA_ALIASES = {
  Vereeniging:    ['Vereeniging', 'Three Rivers', 'Vaal Triangle'],
  Vanderbijlpark: ['Vanderbijlpark', 'VDP', 'Vaal Triangle'],
  Meyerton:       ['Meyerton', 'Midvaal', 'Vaal Triangle'],
  Sasolburg:      ['Sasolburg', 'Zamdela', 'Vaal Triangle'],
  Sharpeville:    ['Sharpeville', 'Vereeniging', 'Vaal Triangle'],
  'Vaal Triangle':['Vaal Triangle'],
};

/**
 * Build a rich comma-separated keyword string from an article.
 * Combines area aliases, category, brand, and significant headline words.
 */
export function buildKeywords(item) {
  const parts = new Set();

  // Geographic breadcrumb
  const area = item.area || item.location || 'Vaal Triangle';
  (AREA_ALIASES[area] || ['Vaal Triangle']).forEach(k => parts.add(k));

  // Category / type
  if (item.category) parts.add(item.category);

  // Brand
  parts.add(SITE_NAME);

  // Significant words from headline/title
  const text = item.headline || item.title || item.name || '';
  text.split(/\s+/).forEach(raw => {
    const word = raw.replace(/[^a-zA-Z\-]/g, '');
    if (word.length >= 4 && !STOPWORDS.has(word.toLowerCase())) {
      // Title-case to match search intent
      parts.add(word.charAt(0).toUpperCase() + word.slice(1));
    }
  });

  // Extra signals from summary if available (first 5 significant words)
  const summary = item.summary || item.description || '';
  let sumCount = 0;
  summary.split(/\s+/).forEach(raw => {
    if (sumCount >= 5) return;
    const word = raw.replace(/[^a-zA-Z\-]/g, '');
    if (word.length >= 5 && !STOPWORDS.has(word.toLowerCase())) {
      parts.add(word.charAt(0).toUpperCase() + word.slice(1));
      sumCount++;
    }
  });

  return [...parts].join(', ');
}

// ── BreadcrumbList ────────────────────────────────────────────────────────

/**
 * Build a BreadcrumbList schema for a given path.
 * crumbs: [{ name: 'News', url: '/news' }, { name: 'Article Title' }]
 */
function breadcrumbSchema(crumbs) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: crumbs.map((c, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: c.name,
      item: c.url ? `${SITE_URL}${c.url}` : undefined,
    })),
  };
}

// ── NewsArticle SEO ───────────────────────────────────────────────────────

export function buildArticleMeta(article) {
  if (!article) return [];

  const title = `${article.headline} | VaalHub`;
  // Prefer summary for the description — it's written to be descriptive.
  // Fall back to full_text, stripping any [IMAGE:N] tokens first.
  const rawDesc = article.summary ||
    (article.full_text || '').replace(/\[IMAGE:\d+\]/g, '').trim();
  const description = toDescription(rawDesc);
  const url = `${SITE_URL}/news/${article.slug || article.news_id}`;
  const image = article.image_url || DEFAULT_IMAGE;
  const publishDate = article.publish_date
    ? new Date(article.publish_date).toISOString()
    : undefined;
  // Use edited date as dateModified if available
  const modifiedDate = article.edited_date
    ? new Date(article.edited_date).toISOString()
    : publishDate;
  const keywords = buildKeywords(article);

  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'NewsArticle',
    headline: article.headline,
    description,
    url,
    image: image ? [image] : undefined,
    datePublished: publishDate,
    dateModified: modifiedDate,
    author: {
      '@type': 'Organization',
      name: article.source_name || SITE_NAME,
      url: article.source_url || SITE_URL,
    },
    publisher: {
      '@type': 'Organization',
      name: SITE_NAME,
      logo: { '@type': 'ImageObject', url: DEFAULT_IMAGE },
      url: SITE_URL,
    },
    mainEntityOfPage: { '@type': 'WebPage', '@id': url },
    ...(article.category && { articleSection: article.category }),
    keywords,
    isAccessibleForFree: 'True',
    inLanguage: 'en-ZA',
  };

  const crumbSchema = breadcrumbSchema([
    { name: 'Home', url: '/' },
    { name: 'News', url: '/news' },
    { name: article.category || 'Article', url: `/news?category=${encodeURIComponent(article.category || '')}` },
    { name: article.headline },
  ]);

  return [
    e('title', { key: 'title' }, title),
    e('meta', { key: 'desc',     name: 'description',    content: description }),
    e('meta', { key: 'keywords', name: 'keywords',        content: keywords }),
    e('meta', { key: 'robots',   name: 'robots',          content: 'index, follow' }),
    e('link', { key: 'canonical', rel: 'canonical',        href: url }),
    // Open Graph
    e('meta', { key: 'og:type',        property: 'og:type',        content: 'article' }),
    e('meta', { key: 'og:url',         property: 'og:url',         content: url }),
    e('meta', { key: 'og:title',       property: 'og:title',       content: title }),
    e('meta', { key: 'og:description', property: 'og:description', content: description }),
    e('meta', { key: 'og:image',       property: 'og:image',       content: image }),
    e('meta', { key: 'og:image:alt',   property: 'og:image:alt',   content: article.headline }),
    e('meta', { key: 'og:site_name',   property: 'og:site_name',   content: SITE_NAME }),
    e('meta', { key: 'og:locale',      property: 'og:locale',      content: 'en_ZA' }),
    ...(publishDate ? [
      e('meta', { key: 'og:published_time', property: 'article:published_time', content: publishDate }),
      e('meta', { key: 'og:modified_time',  property: 'article:modified_time',  content: modifiedDate }),
    ] : []),
    ...(article.category ? [e('meta', { key: 'og:section', property: 'article:section', content: article.category })] : []),
    // Twitter
    e('meta', { key: 'tw:card',  name: 'twitter:card',        content: 'summary_large_image' }),
    e('meta', { key: 'tw:site',  name: 'twitter:site',        content: TWITTER_HANDLE }),
    e('meta', { key: 'tw:title', name: 'twitter:title',       content: title }),
    e('meta', { key: 'tw:desc',  name: 'twitter:description', content: description }),
    e('meta', { key: 'tw:image', name: 'twitter:image',       content: image }),
    e('meta', { key: 'tw:image:alt', name: 'twitter:image:alt', content: article.headline }),
    // JSON-LD (two schemas: NewsArticle + BreadcrumbList)
    jsonLd(articleSchema, 'json-ld-article'),
    jsonLd(crumbSchema,   'json-ld-breadcrumb'),
  ];
}

// ── Event SEO ─────────────────────────────────────────────────────────────

export function buildEventMeta(event) {
  if (!event) return [];

  const title = `${event.title} | VaalHub Events`;
  const description = toDescription(event.description);
  const slug = (event.title || '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '') || 'event';
  const url = event.event_id ? `${SITE_URL}/events/${event.event_id}/${slug}` : `${SITE_URL}/events`;
  const image = event.image_url || DEFAULT_IMAGE;
  const keywords = buildKeywords({ ...event, headline: event.title });

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Event',
    name: event.title,
    description,
    url: event.source_url || url,
    image: image ? [image] : undefined,
    ...(event.date_start && { startDate: new Date(event.date_start).toISOString().split('T')[0] }),
    ...(event.date_end   && { endDate:   new Date(event.date_end).toISOString().split('T')[0] }),
    location: {
      '@type': 'Place',
      name: event.location || 'Vaal Triangle',
      address: {
        '@type': 'PostalAddress',
        addressLocality: event.location || 'Vaal Triangle',
        addressRegion: 'Gauteng / Free State',
        addressCountry: 'ZA',
      },
    },
    ...(event.organizer && { organizer: { '@type': 'Organization', name: event.organizer } }),
    ...(event.price && {
      offers: {
        '@type': 'Offer',
        price: event.price,
        priceCurrency: 'ZAR',
        availability: 'https://schema.org/InStock',
      },
    }),
    eventStatus: 'https://schema.org/EventScheduled',
    eventAttendanceMode: 'https://schema.org/OfflineEventAttendanceMode',
    inLanguage: 'en-ZA',
  };

  const crumbSchema = breadcrumbSchema([
    { name: 'Home', url: '/' },
    { name: 'Events', url: '/events' },
    { name: event.title },
  ]);

  return [
    e('title', { key: 'title' }, title),
    e('meta', { key: 'desc',     name: 'description',    content: description }),
    e('meta', { key: 'keywords', name: 'keywords',        content: keywords }),
    e('meta', { key: 'robots',   name: 'robots',          content: 'index, follow' }),
    e('link', { key: 'canonical', rel: 'canonical',        href: url }),
    e('meta', { key: 'og:type',        property: 'og:type',        content: 'website' }),
    e('meta', { key: 'og:url',         property: 'og:url',         content: url }),
    e('meta', { key: 'og:title',       property: 'og:title',       content: title }),
    e('meta', { key: 'og:description', property: 'og:description', content: description }),
    e('meta', { key: 'og:image',       property: 'og:image',       content: image }),
    e('meta', { key: 'og:locale',      property: 'og:locale',      content: 'en_ZA' }),
    e('meta', { key: 'tw:card',  name: 'twitter:card',        content: 'summary_large_image' }),
    e('meta', { key: 'tw:title', name: 'twitter:title',       content: title }),
    e('meta', { key: 'tw:desc',  name: 'twitter:description', content: description }),
    e('meta', { key: 'tw:image', name: 'twitter:image',       content: image }),
    jsonLd(schema,     'json-ld-event'),
    jsonLd(crumbSchema,'json-ld-breadcrumb'),
  ];
}

// ── Business SEO ──────────────────────────────────────────────────────────

/** Resolve a possibly-relative URL to a full absolute URL */
function absoluteUrl(rawUrl) {
  if (!rawUrl) return null;
  return rawUrl.startsWith('http') ? rawUrl : `${SITE_URL}${rawUrl}`;
}

export function buildBusinessMeta(business, overrideUrl) {
  if (!business) return [];

  const name = business.name || business.business_name;
  const title = `${name} | VaalHub Business Directory`;

  // Build a rich description: use provided description or synthesise one
  const rawDesc = business.description
    || `${name} is a local ${business.category || 'business'} based in ${business.area || 'the Vaal Triangle'}. Find contact details, hours and more on VaalHub.`;
  const description = toDescription(rawDesc);

  const url = overrideUrl || `${SITE_URL}/businesses`;

  // Prefer the business logo; fall back to the VaalHub default banner
  const image = absoluteUrl(business.logo_url) || DEFAULT_IMAGE;
  const keywords = buildKeywords({ ...business, headline: name });

  // Collect all online profiles into sameAs (deduped, truthy only)
  const sameAsSet = new Set(
    [business.website, business.facebook, business.instagram, business.source_url]
      .map(u => absoluteUrl(u))
      .filter(Boolean)
  );
  const sameAs = [...sameAsSet];

  // Address region: Sasolburg is Free State, everything else is Gauteng
  const addressRegion = (business.area === 'Sasolburg' || business.location === 'Sasolburg')
    ? 'Free State'
    : 'Gauteng';

  const schema = {
    '@context': 'https://schema.org',
    '@type': mapBusinessCategory(business.category),
    '@id': url,                              // canonical identifier for this entity
    name,
    description,
    url: business.website || business.source_url || url,
    image: image ? { '@type': 'ImageObject', url: image, caption: `${name} logo` } : undefined,
    ...(business.phone   && { telephone: business.phone }),
    ...(business.email   && { email: business.email }),
    ...(sameAs.length    && { sameAs }),
    address: {
      '@type': 'PostalAddress',
      streetAddress:   business.address || '',
      addressLocality: business.area || business.location || 'Vaal Triangle',
      addressRegion,
      addressCountry:  'ZA',
    },
    ...(business.operating_hours && { openingHours: business.operating_hours }),
    ...(business.google_rating && {
      aggregateRating: {
        '@type':       'AggregateRating',
        ratingValue:   String(business.google_rating),
        reviewCount:   String(business.google_review_count || 1),
        bestRating:    '5',
        worstRating:   '1',
      },
    }),
    areaServed: {
      '@type': 'Place',
      name: business.area || 'Vaal Triangle',
      address: {
        '@type':          'PostalAddress',
        addressLocality:  business.area || 'Vaal Triangle',
        addressRegion,
        addressCountry:   'ZA',
      },
    },
    currenciesAccepted: 'ZAR',
    inLanguage: 'en-ZA',
  };

  const crumbSchema = breadcrumbSchema([
    { name: 'Home', url: '/' },
    { name: 'Businesses', url: '/businesses' },
    { name },
  ]);

  return [
    e('title', { key: 'title' }, title),
    e('meta', { key: 'desc',     name: 'description',    content: description }),
    e('meta', { key: 'keywords', name: 'keywords',        content: keywords }),
    e('meta', { key: 'robots',   name: 'robots',          content: 'index, follow' }),
    e('link', { key: 'canonical', rel: 'canonical',        href: url }),
    // Open Graph — 'website' is the safest type; bots respect it universally
    e('meta', { key: 'og:type',        property: 'og:type',        content: 'website' }),
    e('meta', { key: 'og:url',         property: 'og:url',         content: url }),
    e('meta', { key: 'og:title',       property: 'og:title',       content: title }),
    e('meta', { key: 'og:description', property: 'og:description', content: description }),
    e('meta', { key: 'og:image',       property: 'og:image',       content: image }),
    e('meta', { key: 'og:image:alt',   property: 'og:image:alt',   content: `${name} logo` }),
    e('meta', { key: 'og:site_name',   property: 'og:site_name',   content: SITE_NAME }),
    e('meta', { key: 'og:locale',      property: 'og:locale',      content: 'en_ZA' }),
    // Twitter / X card
    e('meta', { key: 'tw:card',      name: 'twitter:card',        content: 'summary_large_image' }),
    e('meta', { key: 'tw:site',      name: 'twitter:site',        content: TWITTER_HANDLE }),
    e('meta', { key: 'tw:title',     name: 'twitter:title',       content: title }),
    e('meta', { key: 'tw:desc',      name: 'twitter:description', content: description }),
    e('meta', { key: 'tw:image',     name: 'twitter:image',       content: image }),
    e('meta', { key: 'tw:image:alt', name: 'twitter:image:alt',   content: `${name} logo` }),
    // JSON-LD
    jsonLd(schema,     'json-ld-business'),
    jsonLd(crumbSchema,'json-ld-breadcrumb'),
  ];
}

function mapBusinessCategory(category) {
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

// ── ItemList SEO (listing pages) ──────────────────────────────────────────

/**
 * Build an ItemList JSON-LD schema for listing pages (news, events, businesses).
 * items: array of { name/headline/title, url } objects
 */
export function buildItemListSchema(items = [], listName, listUrl) {
  if (!items.length) return null;
  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: listName,
    url: `${SITE_URL}${listUrl}`,
    numberOfItems: items.length,
    itemListElement: items.slice(0, 50).map((item, i) => {
      let itemUrl;
      if (item.slug) {
        itemUrl = `${SITE_URL}/news/${item.slug}`;
      } else if (item.business_id) {
        const bizSlug = (item.business_name || item.name || '')
          .toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
        itemUrl = `${SITE_URL}/businesses/${item.business_id}/${bizSlug}`;
      } else {
        itemUrl = `${SITE_URL}/businesses`;
      }
      return {
        '@type': 'ListItem',
        position: i + 1,
        name: item.headline || item.title || item.name || item.business_name || '',
        url: itemUrl,
      };
    }),
  };
}

/** Return a JSON-LD element for the ItemList, or null if no items */
export function buildItemListMeta(items, listName, listUrl) {
  const schema = buildItemListSchema(items, listName, listUrl);
  if (!schema) return null;
  return jsonLd(schema, 'json-ld-itemlist');
}

// ── Page-level SEO (listing pages) ───────────────────────────────────────

export function buildPageMeta({ title, description, path, image, keywords }) {
  const fullTitle = title
    ? `${title} | VaalHub`
    : 'VaalHub - Local News, Events & Business | Vaal Triangle';
  const desc =
    description ||
    'Your trusted source for local news, events, and business information across the Vaal Triangle. Covering Vereeniging, Vanderbijlpark, Meyerton, Sasolburg and Sharpeville.';
  const url = `${SITE_URL}${path || ''}`;
  const img = image || DEFAULT_IMAGE;
  const kw = keywords ||
    'Vaal Triangle, Vereeniging, Vanderbijlpark, Meyerton, Sasolburg, Sharpeville, local news, events, businesses, VaalHub';

  return [
    e('title', { key: 'title' }, fullTitle),
    e('meta', { key: 'desc',     name: 'description',    content: desc }),
    e('meta', { key: 'keywords', name: 'keywords',        content: kw }),
    e('meta', { key: 'robots',   name: 'robots',          content: 'index, follow' }),
    e('link', { key: 'canonical', rel: 'canonical',        href: url }),
    e('meta', { key: 'og:type',        property: 'og:type',        content: 'website' }),
    e('meta', { key: 'og:url',         property: 'og:url',         content: url }),
    e('meta', { key: 'og:title',       property: 'og:title',       content: fullTitle }),
    e('meta', { key: 'og:description', property: 'og:description', content: desc }),
    e('meta', { key: 'og:image',       property: 'og:image',       content: img }),
    e('meta', { key: 'og:site_name',   property: 'og:site_name',   content: SITE_NAME }),
    e('meta', { key: 'og:locale',      property: 'og:locale',      content: 'en_ZA' }),
    e('meta', { key: 'tw:card',  name: 'twitter:card',        content: 'summary_large_image' }),
    e('meta', { key: 'tw:site',  name: 'twitter:site',        content: TWITTER_HANDLE }),
    e('meta', { key: 'tw:title', name: 'twitter:title',       content: fullTitle }),
    e('meta', { key: 'tw:desc',  name: 'twitter:description', content: desc }),
    e('meta', { key: 'tw:image', name: 'twitter:image',       content: img }),
  ];
}
