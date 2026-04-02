import { useState, useEffect, useCallback } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import React from 'react';
import NewsletterSignupBar from '../components/ui/NewsletterSignupBar';
import SponsorBanner from '../components/ui/SponsorBanner';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
const SITE_URL = 'https://vaalhub.co.za';
const SITE_NAME = 'VaalHub';
const DEFAULT_IMAGE = `${SITE_URL}/vaalhub-logo.png`;
const TWITTER_HANDLE = '@VaalHub';

const e = React.createElement;

// ── Service & location data ──────────────────────────────────────────────────

const SERVICE_PAGES = [
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
  { slug: 'mechanic', label: 'Mechanic', category: 'Automotive', searchTag: 'mechanic' },
  { slug: 'panel-beater', label: 'Panel Beater', category: 'Automotive', searchTag: 'panel beater' },
  { slug: 'towing', label: 'Towing Services', category: 'Automotive', searchTag: 'towing' },
  { slug: 'car-wash', label: 'Car Wash', category: 'Automotive', searchTag: 'car wash' },
  { slug: 'tyres', label: 'Tyre Services', category: 'Automotive', searchTag: 'tyres' },
  { slug: 'dentist', label: 'Dentist', category: 'Healthcare', searchTag: 'dentist' },
  { slug: 'doctor', label: 'Doctor', category: 'Healthcare', searchTag: 'doctor' },
  { slug: 'physiotherapy', label: 'Physiotherapy', category: 'Healthcare', searchTag: 'physiotherapy' },
  { slug: 'pharmacy', label: 'Pharmacy', category: 'Healthcare', searchTag: 'pharmacy' },
  { slug: 'vet', label: 'Veterinarian', category: 'Healthcare', searchTag: 'vet' },
  { slug: 'gym', label: 'Gym & Fitness', category: 'Healthcare', searchTag: 'gym' },
  { slug: 'hair-salon', label: 'Hair Salon', category: 'Healthcare', searchTag: 'hair salon' },
  { slug: 'beauty-salon', label: 'Beauty Salon', category: 'Healthcare', searchTag: 'beauty salon' },
  { slug: 'cleaning', label: 'Cleaning Services', category: 'Service', searchTag: 'cleaning' },
  { slug: 'pest-control', label: 'Pest Control', category: 'Service', searchTag: 'pest control' },
  { slug: 'security', label: 'Security Services', category: 'Service', searchTag: 'security' },
  { slug: 'locksmith', label: 'Locksmith', category: 'Service', searchTag: 'locksmith' },
  { slug: 'removals', label: 'Removals & Moving', category: 'Service', searchTag: 'removals' },
  { slug: 'garden-service', label: 'Garden Service', category: 'Service', searchTag: 'garden service' },
  { slug: 'catering', label: 'Catering Services', category: 'Service', searchTag: 'catering' },
  { slug: 'attorney', label: 'Attorney', category: 'Professional Services', searchTag: 'attorney' },
  { slug: 'accountant', label: 'Accountant', category: 'Professional Services', searchTag: 'accountant' },
  { slug: 'estate-agent', label: 'Estate Agent', category: 'Professional Services', searchTag: 'estate agent' },
  { slug: 'insurance', label: 'Insurance', category: 'Professional Services', searchTag: 'insurance' },
  { slug: 'pizza', label: 'Pizza', category: 'Restaurant', searchTag: 'pizza' },
  { slug: 'coffee-shop', label: 'Coffee Shop', category: 'Restaurant', searchTag: 'coffee shop' },
  { slug: 'takeaway', label: 'Takeaway', category: 'Restaurant', searchTag: 'takeaway' },
  { slug: 'steakhouse', label: 'Steakhouse', category: 'Restaurant', searchTag: 'steakhouse' },
  { slug: 'driving-school', label: 'Driving School', category: 'Education', searchTag: 'driving school' },
  { slug: 'creche', label: 'Cr\u00e8che & Daycare', category: 'Education', searchTag: 'creche' },
  { slug: 'tutoring', label: 'Tutoring', category: 'Education', searchTag: 'tutoring' },
  { slug: 'wedding-venue', label: 'Wedding Venue', category: 'Entertainment', searchTag: 'wedding venue' },
  { slug: 'function-venue', label: 'Function Venue', category: 'Entertainment', searchTag: 'function venue' },
];

const LOCATIONS = [
  { slug: 'vereeniging',    label: 'Vereeniging',    region: 'Gauteng'    },
  { slug: 'vanderbijlpark', label: 'Vanderbijlpark',  region: 'Gauteng'    },
  { slug: 'meyerton',       label: 'Meyerton',        region: 'Gauteng'    },
  { slug: 'sasolburg',      label: 'Sasolburg',       region: 'Free State' },
  { slug: 'sebokeng',       label: 'Sebokeng',        region: 'Gauteng'    },
  { slug: 'evaton',         label: 'Evaton',          region: 'Gauteng'    },
  { slug: 'heidelberg',     label: 'Heidelberg',      region: 'Gauteng'    },
  { slug: 'sharpeville',    label: 'Sharpeville',     region: 'Gauteng'    },
  { slug: 'walkerville',    label: 'Walkerville',     region: 'Gauteng'    },
  { slug: 'three-rivers',   label: 'Three Rivers',    region: 'Gauteng'    },
];

const SERVICE_MAP = Object.fromEntries(SERVICE_PAGES.map(s => [s.slug, s]));
const LOCATION_MAP = Object.fromEntries(LOCATIONS.map(l => [l.slug, l]));

// ── Helpers ──────────────────────────────────────────────────────────────────

function slugToLabel(slug) {
  return slug
    .split('-')
    .map(w => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');
}

function jsonLd(schema, keyPrefix = 'json-ld') {
  return e('script', {
    key: keyPrefix,
    type: 'application/ld+json',
    dangerouslySetInnerHTML: { __html: JSON.stringify(schema) },
  });
}

// ── Star rating ──────────────────────────────────────────────────────────────

function StarRow({ rating, count }) {
  return (
    <div className="flex items-center gap-1.5">
      <div className="flex items-center gap-0.5">
        {[1, 2, 3, 4, 5].map(s => (
          <svg key={s} className={`w-3.5 h-3.5 ${s <= Math.round(rating) ? 'text-yellow-400' : 'text-gray-300'}`} fill="currentColor" viewBox="0 0 20 20">
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        ))}
      </div>
      <span className="text-xs font-semibold text-gray-700">{rating.toFixed(1)}</span>
      {count > 0 && <span className="text-xs text-gray-400">({count.toLocaleString()})</span>}
    </div>
  );
}

function VerifiedBadge() {
  return (
    <span className="inline-flex items-center gap-1 bg-blue-600 text-white font-semibold rounded-full px-2 py-0.5 text-xs">
      <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
      </svg>
      Verified
    </span>
  );
}

// ── Main component ───────────────────────────────────────────────────────────

export default function ServiceLanding() {
  const { serviceSlug, locationSlug } = useParams();

  const serviceInfo = SERVICE_MAP[serviceSlug] || { slug: serviceSlug, label: slugToLabel(serviceSlug), category: 'Service', searchTag: serviceSlug };
  const locationInfo = locationSlug ? (LOCATION_MAP[locationSlug] || { slug: locationSlug, label: slugToLabel(locationSlug), region: 'Gauteng' }) : null;

  const serviceName = serviceInfo.label;
  const locationName = locationInfo ? locationInfo.label : 'Vaal Triangle';
  const region = locationInfo ? locationInfo.region : 'Gauteng';

  const [businesses, setBusinesses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchBusinesses = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams({ status: 'published', tag: serviceInfo.searchTag });
      if (locationInfo) params.append('location', locationInfo.label);
      const res = await fetch(`${API_URL}/api/businesses?${params}`);
      if (!res.ok) throw new Error('Failed to fetch');
      const data = await res.json();
      const raw = Array.isArray(data) ? data : (data.data || data.businesses || []);
      const sorted = [...raw].sort((a, b) => {
        const aPhoto = a.google_photo_url ? 0 : 1;
        const bPhoto = b.google_photo_url ? 0 : 1;
        if (aPhoto !== bPhoto) return aPhoto - bPhoto;
        return (b.google_rating || 0) - (a.google_rating || 0);
      });
      setBusinesses(sorted);
    } catch (err) {
      console.error(err);
      setError('Unable to load businesses. Please try again later.');
    } finally {
      setLoading(false);
    }
  }, [serviceInfo.searchTag, locationInfo?.label]);

  useEffect(() => { fetchBusinesses(); }, [fetchBusinesses]);

  // ── SEO data ─────────────────────────────────────────────────────────────

  const pageTitle = locationInfo
    ? `${serviceName} in ${locationName} | VaalHub Business Directory`
    : `${serviceName} | Vaal Triangle | VaalHub`;

  const pageDescription = locationInfo
    ? `Find trusted ${serviceName.toLowerCase()} in ${locationName}, Vaal Triangle. Compare reviews, contact details and get quotes. Browse verified local ${serviceName.toLowerCase()} businesses on VaalHub.`
    : `Find the best ${serviceName.toLowerCase()} across the Vaal Triangle. Compare reviews, get contact details and quotes from verified local businesses on VaalHub.`;

  const pageUrl = locationInfo
    ? `${SITE_URL}/businesses/services/${serviceSlug}/${locationSlug}`
    : `${SITE_URL}/businesses/services/${serviceSlug}`;

  const keywords = [
    serviceName, serviceInfo.searchTag, locationName,
    'Vaal Triangle', 'Vereeniging', 'Vanderbijlpark',
    `${serviceName.toLowerCase()} near me`, `${serviceName.toLowerCase()} ${locationName}`,
    'VaalHub',
  ].join(', ');

  // JSON-LD: Service schema
  const serviceSchema = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: `${serviceName}${locationInfo ? ` in ${locationName}` : ' - Vaal Triangle'}`,
    description: pageDescription,
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
      name: SITE_NAME,
      url: SITE_URL,
    },
    serviceType: serviceName,
    inLanguage: 'en-ZA',
  };

  // JSON-LD: ItemList (if businesses loaded)
  const itemListSchema = businesses.length > 0 ? {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: `${serviceName} businesses${locationInfo ? ` in ${locationName}` : ' in the Vaal Triangle'}`,
    url: pageUrl,
    numberOfItems: businesses.length,
    itemListElement: businesses.slice(0, 50).map((biz, i) => {
      const bizSlug = (biz.business_name || biz.name || '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
      return {
        '@type': 'ListItem',
        position: i + 1,
        name: biz.business_name || biz.name,
        url: `${SITE_URL}/businesses/${biz.business_id}/${bizSlug}`,
      };
    }),
  } : null;

  // JSON-LD: FAQ
  const faqQuestions = locationInfo
    ? [
        { q: `Where can I find a ${serviceName.toLowerCase()} in ${locationName}?`, a: `VaalHub lists verified ${serviceName.toLowerCase()} businesses in ${locationName}. Browse our directory to compare reviews, contact details and services offered.` },
        { q: `How much does a ${serviceName.toLowerCase()} cost in ${locationName}?`, a: `Prices for ${serviceName.toLowerCase()} in ${locationName} vary by provider. Contact businesses directly through VaalHub to request quotes and compare rates.` },
        { q: `What ${serviceName.toLowerCase()} services are available near ${locationName}?`, a: `${locationName} and the wider Vaal Triangle have many ${serviceName.toLowerCase()} providers. Use VaalHub to find businesses near you with reviews and verified contact information.` },
        { q: `How do I choose the best ${serviceName.toLowerCase()} in ${locationName}?`, a: `Check Google reviews, verify contact details, and compare multiple ${serviceName.toLowerCase()} providers on VaalHub to find the best fit for your needs in ${locationName}.` },
      ]
    : [
        { q: `Where can I find a ${serviceName.toLowerCase()} in the Vaal Triangle?`, a: `VaalHub lists ${serviceName.toLowerCase()} businesses across Vereeniging, Vanderbijlpark, Meyerton, Sasolburg and Sharpeville. Browse our directory to compare options.` },
        { q: `How do I choose the best ${serviceName.toLowerCase()} in the Vaal Triangle?`, a: `Compare reviews, check verified status, and contact multiple providers through VaalHub to find the right ${serviceName.toLowerCase()} for your needs.` },
        { q: `Are there verified ${serviceName.toLowerCase()} businesses on VaalHub?`, a: `Yes, VaalHub features verified businesses with confirmed contact details and Google reviews to help you make informed decisions.` },
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
  const breadcrumbs = [
    { name: 'Home', url: '/' },
    { name: 'Businesses', url: '/businesses' },
    { name: serviceInfo.category, url: `/businesses?category=${encodeURIComponent(serviceInfo.category)}` },
    { name: serviceName, url: `/businesses/services/${serviceSlug}` },
  ];
  if (locationInfo) {
    breadcrumbs.push({ name: locationName });
  }
  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: breadcrumbs.map((c, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: c.name,
      ...(c.url && i < breadcrumbs.length - 1 ? { item: `${SITE_URL}${c.url}` } : {}),
    })),
  };

  // ── Related services ─────────────────────────────────────────────────────

  const relatedServices = SERVICE_PAGES
    .filter(s => s.category === serviceInfo.category && s.slug !== serviceSlug)
    .slice(0, 8);

  const otherLocations = LOCATIONS.filter(l => l.slug !== locationSlug);

  // ── Helmet meta ──────────────────────────────────────────────────────────

  const helmetChildren = [
    e('title', { key: 'title' }, pageTitle),
    e('meta', { key: 'desc', name: 'description', content: pageDescription }),
    e('meta', { key: 'keywords', name: 'keywords', content: keywords }),
    e('meta', { key: 'robots', name: 'robots', content: 'index, follow' }),
    e('link', { key: 'canonical', rel: 'canonical', href: pageUrl }),
    // Open Graph
    e('meta', { key: 'og:type', property: 'og:type', content: 'website' }),
    e('meta', { key: 'og:url', property: 'og:url', content: pageUrl }),
    e('meta', { key: 'og:title', property: 'og:title', content: pageTitle }),
    e('meta', { key: 'og:description', property: 'og:description', content: pageDescription }),
    e('meta', { key: 'og:image', property: 'og:image', content: DEFAULT_IMAGE }),
    e('meta', { key: 'og:image:alt', property: 'og:image:alt', content: `${serviceName} in ${locationName}` }),
    e('meta', { key: 'og:site_name', property: 'og:site_name', content: SITE_NAME }),
    e('meta', { key: 'og:locale', property: 'og:locale', content: 'en_ZA' }),
    // Twitter
    e('meta', { key: 'tw:card', name: 'twitter:card', content: 'summary_large_image' }),
    e('meta', { key: 'tw:site', name: 'twitter:site', content: TWITTER_HANDLE }),
    e('meta', { key: 'tw:title', name: 'twitter:title', content: pageTitle }),
    e('meta', { key: 'tw:desc', name: 'twitter:description', content: pageDescription }),
    e('meta', { key: 'tw:image', name: 'twitter:image', content: DEFAULT_IMAGE }),
    // JSON-LD
    jsonLd(serviceSchema, 'json-ld-service'),
    jsonLd(faqSchema, 'json-ld-faq'),
    jsonLd(breadcrumbSchema, 'json-ld-breadcrumb'),
    ...(itemListSchema ? [jsonLd(itemListSchema, 'json-ld-itemlist')] : []),
  ];

  // ── Render ───────────────────────────────────────────────────────────────

  const heading = locationInfo
    ? `${serviceName} in ${locationName}`
    : `${serviceName} in the Vaal Triangle`;

  const introText = locationInfo
    ? `Looking for a trusted ${serviceName.toLowerCase()} in ${locationName}? Browse verified local businesses, compare Google reviews and get contact details. Whether you need a quick quote or want to compare options, VaalHub makes it easy to find the right ${serviceName.toLowerCase()} near you.`
    : `Find the best ${serviceName.toLowerCase()} across the Vaal Triangle, including Vereeniging, Vanderbijlpark, Meyerton, Sasolburg and Sharpeville. Compare reviews, get quotes and connect with verified local businesses on VaalHub.`;

  return (
    <div className="min-h-screen bg-gray-50">
      <Helmet>{helmetChildren}</Helmet>

      {/* Hero */}
      <div className="bg-gradient-to-r from-vaal-orange-500 to-vaal-orange-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
          {/* Breadcrumbs */}
          <nav className="flex items-center gap-1.5 text-xs text-white/70 mb-4 flex-wrap">
            <Link to="/" className="hover:text-white transition-colors">Home</Link>
            <span>/</span>
            <Link to="/businesses" className="hover:text-white transition-colors">Businesses</Link>
            <span>/</span>
            <Link to={`/businesses/services/${serviceSlug}`} className="hover:text-white transition-colors">{serviceName}</Link>
            {locationInfo && (
              <>
                <span>/</span>
                <span className="text-white">{locationName}</span>
              </>
            )}
          </nav>

          <h1 className="text-2xl sm:text-3xl font-bold mb-2">{heading}</h1>
          <p className="text-white/80 text-sm sm:text-base max-w-2xl">{introText}</p>
        </div>
      </div>

      <SponsorBanner />

      {/* Location pills (when on service-only page) */}
      {!locationInfo && (
        <div className="bg-white border-b border-gray-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
            <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide">
              <span className="text-xs text-gray-400 font-medium whitespace-nowrap flex-shrink-0">Filter by area:</span>
              {LOCATIONS.map(loc => (
                <Link
                  key={loc.slug}
                  to={`/businesses/services/${serviceSlug}/${loc.slug}`}
                  className="whitespace-nowrap px-3 py-1.5 rounded-full text-xs font-medium border border-gray-200 bg-gray-50 text-gray-600 hover:bg-vaal-orange-50 hover:border-vaal-orange-300 hover:text-vaal-orange-700 transition-colors flex-shrink-0"
                >
                  {loc.label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Other locations (when on location page) */}
      {locationInfo && otherLocations.length > 0 && (
        <div className="bg-white border-b border-gray-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
            <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide">
              <span className="text-xs text-gray-400 font-medium whitespace-nowrap flex-shrink-0">Other areas:</span>
              <Link
                to={`/businesses/services/${serviceSlug}`}
                className="whitespace-nowrap px-3 py-1.5 rounded-full text-xs font-medium border border-gray-200 bg-gray-50 text-gray-600 hover:bg-vaal-orange-50 hover:border-vaal-orange-300 hover:text-vaal-orange-700 transition-colors flex-shrink-0"
              >
                All Areas
              </Link>
              {otherLocations.map(loc => (
                <Link
                  key={loc.slug}
                  to={`/businesses/services/${serviceSlug}/${loc.slug}`}
                  className="whitespace-nowrap px-3 py-1.5 rounded-full text-xs font-medium border border-gray-200 bg-gray-50 text-gray-600 hover:bg-vaal-orange-50 hover:border-vaal-orange-300 hover:text-vaal-orange-700 transition-colors flex-shrink-0"
                >
                  {loc.label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Main content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">

        {/* Add business CTA */}
        <div className="flex items-center justify-between gap-3 bg-vaal-orange-50 border border-vaal-orange-200 rounded-xl px-4 py-3 mb-6">
          <p className="text-sm text-vaal-orange-800 font-medium">
            Are you a {serviceName.toLowerCase()} in {locationName}?{' '}
            <span className="text-vaal-orange-600 font-normal">Get listed for free.</span>
          </p>
          <Link
            to="/add-business"
            className="flex-shrink-0 text-sm font-semibold text-vaal-orange-600 hover:text-vaal-orange-700 underline underline-offset-2 transition-colors"
          >
            Add yours &rarr;
          </Link>
        </div>

        {/* Loading */}
        {loading && (
          <div className="text-center py-16">
            <div className="inline-block animate-spin rounded-full h-10 w-10 border-b-2 border-vaal-orange-500" />
            <p className="mt-3 text-gray-500 text-sm">Loading {serviceName.toLowerCase()} businesses&hellip;</p>
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-5 py-4 rounded-xl text-sm">
            <p className="font-semibold mb-0.5">Something went wrong</p>
            <p>{error}</p>
          </div>
        )}

        {/* Empty */}
        {!loading && !error && businesses.length === 0 && (
          <div className="text-center py-16 bg-white rounded-xl border border-gray-100">
            <svg className="mx-auto h-10 w-10 text-gray-300 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
            <h3 className="text-base font-semibold text-gray-700">No {serviceName.toLowerCase()} businesses found</h3>
            <p className="mt-1 text-sm text-gray-400">
              {locationInfo
                ? `We don't have any listed ${serviceName.toLowerCase()} businesses in ${locationName} yet.`
                : `We don't have any listed ${serviceName.toLowerCase()} businesses yet.`}
            </p>
            <Link
              to="/add-business"
              className="mt-3 inline-block text-sm text-vaal-orange-500 hover:text-vaal-orange-600 font-medium underline underline-offset-2"
            >
              Know a {serviceName.toLowerCase()}? Add it here
            </Link>
          </div>
        )}

        {/* Grid */}
        {!loading && !error && businesses.length > 0 && (
          <>
            <p className="text-xs text-gray-400 mb-4">
              {businesses.length} {serviceName.toLowerCase()} business{businesses.length !== 1 ? 'es' : ''} found
              {locationInfo ? ` in ${locationName}` : ' in the Vaal Triangle'}
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {businesses.map(biz => (
                <ServiceBusinessCard key={biz.business_id} biz={biz} />
              ))}
            </div>
          </>
        )}

        {/* FAQ section */}
        <div className="mt-12 bg-white rounded-xl border border-gray-100 p-6">
          <h2 className="text-lg font-bold text-gray-900 mb-4">
            Frequently Asked Questions about {serviceName} in {locationName}
          </h2>
          <div className="space-y-4">
            {faqQuestions.map((faq, i) => (
              <div key={i}>
                <h3 className="text-sm font-semibold text-gray-800 mb-1">{faq.q}</h3>
                <p className="text-sm text-gray-600">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Related services */}
        {relatedServices.length > 0 && (
          <div className="mt-8">
            <h2 className="text-lg font-bold text-gray-900 mb-3">
              Related {serviceInfo.category} Services
            </h2>
            <div className="flex flex-wrap gap-2">
              {relatedServices.map(s => (
                <Link
                  key={s.slug}
                  to={locationInfo ? `/businesses/services/${s.slug}/${locationSlug}` : `/businesses/services/${s.slug}`}
                  className="px-3 py-1.5 rounded-full text-sm font-medium border border-gray-200 bg-white text-gray-700 hover:bg-vaal-orange-50 hover:border-vaal-orange-300 hover:text-vaal-orange-700 transition-colors"
                >
                  {s.label}
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Back link */}
        <div className="mt-8 text-center">
          <Link
            to="/businesses"
            className="inline-flex items-center gap-1.5 text-sm text-vaal-orange-600 hover:text-vaal-orange-700 font-medium transition-colors"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
            Browse all businesses
          </Link>
        </div>
      </div>

      <NewsletterSignupBar />
    </div>
  );
}

// ── Business card ────────────────────────────────────────────────────────────

function ServiceBusinessCard({ biz }) {
  return (
    <Link
      to={`/businesses/${biz.business_id}`}
      className="bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 overflow-hidden flex flex-col"
    >
      {/* Logo area */}
      <div className="relative h-40 bg-gray-100 overflow-hidden flex-shrink-0">
        {biz.logo_url ? (
          <>
            <img src={biz.logo_url} aria-hidden="true"
              className="absolute inset-0 w-full h-full object-cover scale-125 blur-lg opacity-40"
              onError={e => { e.target.style.display = 'none'; }} />
            <img src={biz.logo_url} alt={biz.business_name}
              className="relative z-10 w-full h-full object-contain mix-blend-multiply"
              onError={e => { e.target.style.display = 'none'; e.target.previousSibling.style.display = 'none'; }} />
          </>
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-vaal-orange-50 to-vaal-orange-100 flex items-center justify-center">
            <svg className="w-14 h-14 text-vaal-orange-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
          </div>
        )}

        {biz.is_verified === 1 && (
          <div className="absolute top-2.5 right-2.5">
            <VerifiedBadge />
          </div>
        )}
      </div>

      {/* Details */}
      <div className="p-4 flex flex-col flex-1">
        <div className="flex flex-wrap gap-1.5 mb-2">
          {biz.category && (
            <span className="text-xs px-2 py-0.5 bg-vaal-orange-50 text-vaal-orange-700 rounded-full font-medium">
              {biz.category}
            </span>
          )}
          {biz.location && (
            <span className="text-xs px-2 py-0.5 bg-gray-100 text-gray-600 rounded-full">
              {biz.location}
            </span>
          )}
        </div>

        <h3 className="text-sm font-bold text-gray-900 line-clamp-2 mb-1 hover:text-vaal-orange-600 transition-colors leading-snug">
          {biz.business_name}
        </h3>

        {biz.google_rating > 0 && (
          <div className="mb-2">
            <StarRow rating={biz.google_rating} count={biz.google_review_count} />
          </div>
        )}

        {biz.description && (
          <p className="text-xs text-gray-500 line-clamp-2 flex-1">{biz.description}</p>
        )}

        {biz.phone && (
          <div className="flex items-center gap-1.5 mt-2 text-xs text-gray-500">
            <svg className="w-3.5 h-3.5 text-vaal-orange-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
            </svg>
            <span className="truncate">{biz.phone}</span>
          </div>
        )}

        <div className="mt-3">
          <span className="block w-full py-1.5 bg-vaal-orange-500 hover:bg-vaal-orange-600 text-white text-xs font-semibold rounded-lg transition-colors text-center">
            View Details
          </span>
        </div>
      </div>
    </Link>
  );
}
