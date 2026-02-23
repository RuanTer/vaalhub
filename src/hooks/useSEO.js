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
function jsonLd(schema) {
  return e('script', {
    key: 'json-ld',
    type: 'application/ld+json',
    dangerouslySetInnerHTML: { __html: JSON.stringify(schema) },
  });
}

// ── NewsArticle SEO ───────────────────────────────────────────────────────

export function buildArticleMeta(article) {
  if (!article) return [];

  const title = `${article.headline} | VaalHub`;
  const description = toDescription(article.summary || article.full_text);
  const url = `${SITE_URL}/news/${article.news_id}`;
  const image = article.image_url || DEFAULT_IMAGE;
  const publishDate = article.publish_date ? new Date(article.publish_date).toISOString() : undefined;

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'NewsArticle',
    headline: article.headline,
    description,
    url,
    image: image ? [image] : undefined,
    datePublished: publishDate,
    dateModified: publishDate,
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
    ...(article.area && { keywords: `${article.area}, Vaal Triangle, ${article.category || ''}` }),
  };

  return [
    e('title', { key: 'title' }, title),
    e('meta', { key: 'desc', name: 'description', content: description }),
    e('meta', { key: 'robots', name: 'robots', content: 'index, follow' }),
    e('link', { key: 'canonical', rel: 'canonical', href: url }),
    // Open Graph
    e('meta', { key: 'og:type', property: 'og:type', content: 'article' }),
    e('meta', { key: 'og:url', property: 'og:url', content: url }),
    e('meta', { key: 'og:title', property: 'og:title', content: title }),
    e('meta', { key: 'og:description', property: 'og:description', content: description }),
    e('meta', { key: 'og:image', property: 'og:image', content: image }),
    e('meta', { key: 'og:site_name', property: 'og:site_name', content: SITE_NAME }),
    ...(publishDate ? [e('meta', { key: 'og:published_time', property: 'article:published_time', content: publishDate })] : []),
    ...(article.category ? [e('meta', { key: 'og:section', property: 'article:section', content: article.category })] : []),
    // Twitter
    e('meta', { key: 'tw:card', name: 'twitter:card', content: 'summary_large_image' }),
    e('meta', { key: 'tw:site', name: 'twitter:site', content: TWITTER_HANDLE }),
    e('meta', { key: 'tw:title', name: 'twitter:title', content: title }),
    e('meta', { key: 'tw:desc', name: 'twitter:description', content: description }),
    e('meta', { key: 'tw:image', name: 'twitter:image', content: image }),
    // JSON-LD
    jsonLd(schema),
  ];
}

// ── Event SEO ─────────────────────────────────────────────────────────────

export function buildEventMeta(event) {
  if (!event) return [];

  const title = `${event.title} | VaalHub Events`;
  const description = toDescription(event.description);
  const url = `${SITE_URL}/events`;
  const image = event.image_url || DEFAULT_IMAGE;

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Event',
    name: event.title,
    description,
    url: event.source_url || url,
    image: image ? [image] : undefined,
    ...(event.date_start && { startDate: new Date(event.date_start).toISOString().split('T')[0] }),
    ...(event.date_end && { endDate: new Date(event.date_end).toISOString().split('T')[0] }),
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
  };

  return [
    e('title', { key: 'title' }, title),
    e('meta', { key: 'desc', name: 'description', content: description }),
    e('meta', { key: 'robots', name: 'robots', content: 'index, follow' }),
    e('link', { key: 'canonical', rel: 'canonical', href: url }),
    e('meta', { key: 'og:type', property: 'og:type', content: 'website' }),
    e('meta', { key: 'og:url', property: 'og:url', content: url }),
    e('meta', { key: 'og:title', property: 'og:title', content: title }),
    e('meta', { key: 'og:description', property: 'og:description', content: description }),
    e('meta', { key: 'og:image', property: 'og:image', content: image }),
    e('meta', { key: 'tw:card', name: 'twitter:card', content: 'summary_large_image' }),
    e('meta', { key: 'tw:title', name: 'twitter:title', content: title }),
    e('meta', { key: 'tw:desc', name: 'twitter:description', content: description }),
    e('meta', { key: 'tw:image', name: 'twitter:image', content: image }),
    jsonLd(schema),
  ];
}

// ── Business SEO ──────────────────────────────────────────────────────────

export function buildBusinessMeta(business) {
  if (!business) return [];

  const name = business.name || business.business_name;
  const title = `${name} | VaalHub Business Directory`;
  const description = toDescription(business.description || `${name} — local business in the Vaal Triangle.`);
  const url = `${SITE_URL}/businesses`;
  const image = business.logo_url || DEFAULT_IMAGE;

  const schema = {
    '@context': 'https://schema.org',
    '@type': mapBusinessCategory(business.category),
    name,
    description,
    url: business.website || business.source_url || url,
    image: image ? [image] : undefined,
    ...(business.phone && { telephone: business.phone }),
    ...(business.email && { email: business.email }),
    ...(business.website && { sameAs: [business.website] }),
    address: {
      '@type': 'PostalAddress',
      streetAddress: business.address || '',
      addressLocality: business.area || 'Vaal Triangle',
      addressRegion: 'Gauteng',
      addressCountry: 'ZA',
    },
    ...(business.operating_hours && { openingHours: business.operating_hours }),
  };

  return [
    e('title', { key: 'title' }, title),
    e('meta', { key: 'desc', name: 'description', content: description }),
    e('meta', { key: 'robots', name: 'robots', content: 'index, follow' }),
    e('link', { key: 'canonical', rel: 'canonical', href: url }),
    e('meta', { key: 'og:type', property: 'og:type', content: 'website' }),
    e('meta', { key: 'og:url', property: 'og:url', content: url }),
    e('meta', { key: 'og:title', property: 'og:title', content: title }),
    e('meta', { key: 'og:description', property: 'og:description', content: description }),
    e('meta', { key: 'og:image', property: 'og:image', content: image }),
    e('meta', { key: 'tw:card', name: 'twitter:card', content: 'summary_large_image' }),
    e('meta', { key: 'tw:title', name: 'twitter:title', content: title }),
    e('meta', { key: 'tw:desc', name: 'twitter:description', content: description }),
    e('meta', { key: 'tw:image', name: 'twitter:image', content: image }),
    jsonLd(schema),
  ];
}

function mapBusinessCategory(category) {
  const map = {
    Restaurant: 'FoodEstablishment',
    Retail: 'Store',
    Healthcare: 'MedicalOrganization',
    Entertainment: 'EntertainmentBusiness',
    Automotive: 'AutomotiveBusiness',
  };
  return map[category] || 'LocalBusiness';
}

// ── Page-level SEO (listing pages) ───────────────────────────────────────

export function buildPageMeta({ title, description, path, image }) {
  const fullTitle = title
    ? `${title} | VaalHub`
    : 'VaalHub - Local News, Events & Business | Vaal Triangle';
  const desc =
    description ||
    'Your trusted source for local news, events, and business information across the Vaal Triangle.';
  const url = `${SITE_URL}${path || ''}`;
  const img = image || DEFAULT_IMAGE;

  return [
    e('title', { key: 'title' }, fullTitle),
    e('meta', { key: 'desc', name: 'description', content: desc }),
    e('meta', { key: 'robots', name: 'robots', content: 'index, follow' }),
    e('link', { key: 'canonical', rel: 'canonical', href: url }),
    e('meta', { key: 'og:type', property: 'og:type', content: 'website' }),
    e('meta', { key: 'og:url', property: 'og:url', content: url }),
    e('meta', { key: 'og:title', property: 'og:title', content: fullTitle }),
    e('meta', { key: 'og:description', property: 'og:description', content: desc }),
    e('meta', { key: 'og:image', property: 'og:image', content: img }),
    e('meta', { key: 'og:site_name', property: 'og:site_name', content: SITE_NAME }),
    e('meta', { key: 'tw:card', name: 'twitter:card', content: 'summary_large_image' }),
    e('meta', { key: 'tw:site', name: 'twitter:site', content: TWITTER_HANDLE }),
    e('meta', { key: 'tw:title', name: 'twitter:title', content: fullTitle }),
    e('meta', { key: 'tw:desc', name: 'twitter:description', content: desc }),
    e('meta', { key: 'tw:image', name: 'twitter:image', content: img }),
  ];
}
