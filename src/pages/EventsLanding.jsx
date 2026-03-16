import { useState, useEffect, useCallback } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import SponsorBanner from '../components/ui/SponsorBanner';
import NewsletterSignupBar from '../components/ui/NewsletterSignupBar';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
const SITE_URL = 'https://vaalhub.co.za';
const DEFAULT_IMAGE = `${SITE_URL}/vaalhub-logo.png`;
const PAGE_SIZE = 24;

// ── Data mappings ────────────────────────────────────────────────────────────

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

const locationBySlug = Object.fromEntries(LOCATIONS.map(l => [l.slug, l]));
const categoryBySlug = Object.fromEntries(EVENT_CATEGORIES.map(c => [c.slug, c]));
const locationSlugs = new Set(LOCATIONS.map(l => l.slug));

// ── Date helpers ─────────────────────────────────────────────────────────────

function formatDate(dateString) {
  if (!dateString) return 'Date TBA';
  return new Date(dateString).toLocaleDateString('en-ZA', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
  });
}

function shortDate(dateString) {
  if (!dateString) return { month: 'TBA', day: '?' };
  const d = new Date(dateString);
  return {
    month: d.toLocaleDateString('en-US', { month: 'short' }).toUpperCase(),
    day: d.getDate(),
  };
}

function eventSlug(title = '') {
  return title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '') || 'event';
}

// ── SEO content builders ─────────────────────────────────────────────────────

function getPageSEO(pageType, category, location) {
  const catLabel = category?.label || '';
  const locLabel = location?.label || '';
  const allLocations = 'Vereeniging, Vanderbijlpark, Meyerton and Sasolburg';

  if (pageType === 'this-weekend') {
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
        { name: "This Weekend" },
      ],
    };
  }

  if (pageType === 'category-location') {
    return {
      title: `${catLabel} in ${locLabel} | VaalHub Events`,
      description: `Find local ${catLabel.toLowerCase()} in ${locLabel}. Browse weekend ${catLabel.toLowerCase()}, upcoming ${catLabel.toLowerCase()} and more on VaalHub.`,
      keywords: `${catLabel.toLowerCase()} ${locLabel}, ${catLabel.toLowerCase()} in ${locLabel}, ${locLabel} ${catLabel.toLowerCase()}, Vaal Triangle ${catLabel.toLowerCase()}, VaalHub`,
      h1: `${catLabel} in ${locLabel}`,
      intro: `Discover ${catLabel.toLowerCase()} happening in ${locLabel}, Vaal Triangle. Browse upcoming events, find dates and details on VaalHub.`,
      path: `/events/category/${category.slug}/${location.slug}`,
      faqs: [
        { q: `What ${catLabel.toLowerCase()} are happening in ${locLabel}?`, a: `VaalHub lists upcoming ${catLabel.toLowerCase()} in ${locLabel} and across the Vaal Triangle. Browse our events page for dates, venues and details.` },
        { q: `Where can I find ${catLabel.toLowerCase()} near ${locLabel}?`, a: `Check VaalHub for ${catLabel.toLowerCase()} in ${locLabel} and surrounding areas including ${allLocations}.` },
      ],
      breadcrumbs: [
        { name: 'Home', url: '/' },
        { name: 'Events', url: '/events' },
        { name: catLabel, url: `/events/category/${category.slug}` },
        { name: locLabel },
      ],
    };
  }

  if (pageType === 'category') {
    return {
      title: `${catLabel} in the Vaal Triangle | VaalHub Events`,
      description: `Find local ${catLabel.toLowerCase()} across the Vaal Triangle. Browse weekend ${catLabel.toLowerCase()}, upcoming ${catLabel.toLowerCase()} and more in ${allLocations}.`,
      keywords: `${catLabel.toLowerCase()} Vaal Triangle, ${catLabel.toLowerCase()} Vereeniging, ${catLabel.toLowerCase()} Vanderbijlpark, ${catLabel.toLowerCase()} events, VaalHub`,
      h1: `${catLabel} in the Vaal Triangle`,
      intro: `Discover ${catLabel.toLowerCase()} happening across the Vaal Triangle. Find upcoming events in ${allLocations} and Sharpeville.`,
      path: `/events/category/${category.slug}`,
      faqs: [
        { q: `What ${catLabel.toLowerCase()} are happening in the Vaal Triangle?`, a: `VaalHub lists upcoming ${catLabel.toLowerCase()} across ${allLocations} and Sharpeville. Browse our events page for dates, venues and details.` },
        { q: `Where can I find ${catLabel.toLowerCase()} near me?`, a: `Check VaalHub for ${catLabel.toLowerCase()} in your area. Filter by location to find events in ${allLocations}.` },
        { q: `How do I submit a ${catLabel.toLowerCase().replace(/s$/, '')} event?`, a: 'Visit VaalHub and click "Add Your Event" to submit your event for free. Events are reviewed and published within 24 hours.' },
      ],
      breadcrumbs: [
        { name: 'Home', url: '/' },
        { name: 'Events', url: '/events' },
        { name: catLabel },
      ],
    };
  }

  if (pageType === 'location') {
    return {
      title: `Events in ${locLabel} | Things To Do This Week | VaalHub`,
      description: `Discover upcoming events, markets, festivals and things to do in ${locLabel}, Vaal Triangle. Find live music, sports, family activities and more on VaalHub.`,
      keywords: `events ${locLabel}, things to do ${locLabel}, what's on ${locLabel}, markets ${locLabel}, Vaal Triangle events`,
      h1: `Events in ${locLabel}`,
      intro: `Find upcoming events, markets, live music, sports and family activities in ${locLabel}. Your guide to things to do in the Vaal Triangle.`,
      path: `/events/${location.slug}`,
      faqs: [
        { q: `What events are happening in ${locLabel} this weekend?`, a: `VaalHub lists all upcoming events in ${locLabel} including markets, live music, sports, family activities and community events. Check back regularly for new listings.` },
        { q: `Where can I find things to do in ${locLabel}?`, a: `Browse VaalHub's events page for things to do in ${locLabel}. Filter by category to find exactly what you're looking for.` },
        { q: `What markets are in ${locLabel}?`, a: `Find weekend markets, craft markets, food markets and more in ${locLabel} on VaalHub. New market listings are added regularly.` },
      ],
      breadcrumbs: [
        { name: 'Home', url: '/' },
        { name: 'Events', url: '/events' },
        { name: locLabel },
      ],
    };
  }

  return null;
}

// ── Helmet meta builder ─────────────────────────────────────────────────────

function PageHelmet({ seo }) {
  const url = `${SITE_URL}${seo.path}`;

  const collectionSchema = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: seo.h1,
    description: seo.description,
    url,
    isPartOf: { '@type': 'WebSite', name: 'VaalHub', url: SITE_URL },
    inLanguage: 'en-ZA',
  };

  const faqSchema = seo.faqs?.length ? {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: seo.faqs.map(f => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: { '@type': 'Answer', text: f.a },
    })),
  } : null;

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

  return (
    <Helmet>
      <title>{seo.title}</title>
      <meta name="description" content={seo.description} />
      <meta name="keywords" content={seo.keywords} />
      <meta name="robots" content="index, follow" />
      <link rel="canonical" href={url} />
      <meta property="og:type" content="website" />
      <meta property="og:url" content={url} />
      <meta property="og:title" content={seo.title} />
      <meta property="og:description" content={seo.description} />
      <meta property="og:image" content={DEFAULT_IMAGE} />
      <meta property="og:site_name" content="VaalHub" />
      <meta property="og:locale" content="en_ZA" />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:site" content="@VaalHub" />
      <meta name="twitter:title" content={seo.title} />
      <meta name="twitter:description" content={seo.description} />
      <meta name="twitter:image" content={DEFAULT_IMAGE} />
      <script type="application/ld+json">{JSON.stringify(collectionSchema)}</script>
      {faqSchema && <script type="application/ld+json">{JSON.stringify(faqSchema)}</script>}
      <script type="application/ld+json">{JSON.stringify(breadcrumbSchema)}</script>
    </Helmet>
  );
}

// ── Event card ──────────────────────────────────────────────────────────────

function EventCard({ event }) {
  const sd = shortDate(event.date_start);
  const slug = eventSlug(event.title);
  return (
    <Link
      to={`/events/${event.event_id}/${slug}`}
      className="bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 overflow-hidden cursor-pointer flex flex-col"
    >
      <div className="relative h-40 bg-gray-100 overflow-hidden flex-shrink-0">
        {event.image_url && !event.image_url.includes('data:image') ? (
          <img src={event.image_url} alt={event.title}
            className="w-full h-full object-cover"
            onError={e => { e.target.style.display = 'none'; }} />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-vaal-orange-50 to-vaal-orange-100">
            <svg className="w-12 h-12 text-vaal-orange-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
        )}
        <div className="absolute top-2.5 left-2.5 bg-vaal-orange-500 text-white px-3 py-1.5 rounded-lg shadow text-center min-w-[44px]">
          <div className="text-lg font-bold leading-none">{sd.day}</div>
          <div className="text-xs font-semibold leading-tight">{sd.month}</div>
        </div>
        {event.pinned === 1 && (
          <div className="absolute top-2.5 right-2.5 bg-yellow-400 text-yellow-900 px-2 py-0.5 rounded-full text-xs font-bold shadow">
            Popular
          </div>
        )}
      </div>
      <div className="p-4 flex flex-col flex-1">
        <div className="flex flex-wrap gap-1.5 mb-2">
          {event.category && (
            <span className="text-xs px-2 py-0.5 bg-vaal-orange-50 text-vaal-orange-700 rounded-full font-medium">{event.category}</span>
          )}
          {event.location && (
            <span className="text-xs px-2 py-0.5 bg-gray-100 text-gray-600 rounded-full">{event.location}</span>
          )}
        </div>
        <h3 className="text-sm font-bold text-gray-900 line-clamp-2 mb-1.5 leading-snug hover:text-vaal-orange-600 transition-colors">
          {event.title}
        </h3>
        <div className="flex items-center gap-1.5 text-xs text-gray-500 mb-2">
          <svg className="w-3.5 h-3.5 flex-shrink-0 text-vaal-orange-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <span className="line-clamp-1">{formatDate(event.date_start)}</span>
        </div>
        {event.description && (
          <p className="text-xs text-gray-500 line-clamp-2 flex-1">{event.description}</p>
        )}
        <span className="mt-3 w-full py-1.5 bg-vaal-orange-500 hover:bg-vaal-orange-600 text-white text-xs font-semibold rounded-lg transition-colors block text-center">
          View Details
        </span>
      </div>
    </Link>
  );
}

// ── Main component ──────────────────────────────────────────────────────────

export default function EventsLanding() {
  const params = useParams();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);

  // Determine page type from URL params
  const { categorySlug, locationSlug } = params;
  const typeOrLocation = params.typeOrLocation || params.locationSlug;

  let pageType, category, location;

  if (categorySlug) {
    // /events/category/:categorySlug or /events/category/:categorySlug/:locationSlug
    category = categoryBySlug[categorySlug];
    if (locationSlug && !categorySlug) {
      // This case is handled by the location route
    } else if (locationSlug && categorySlug) {
      location = locationBySlug[locationSlug];
      pageType = location && category ? 'category-location' : null;
    } else {
      pageType = category ? 'category' : null;
    }
  } else if (locationSlug && locationSlugs.has(locationSlug)) {
    // /events/:locationSlug
    location = locationBySlug[locationSlug];
    pageType = 'location';
  } else if (locationSlug === 'this-weekend') {
    pageType = 'this-weekend';
  }

  const seo = getPageSEO(pageType, category, location);

  const fetchEvents = useCallback(async (currentPage) => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams({
        status: 'published',
        limit: String(PAGE_SIZE),
        offset: String((currentPage - 1) * PAGE_SIZE),
        upcoming: 'true',
      });
      if (pageType === 'location' || pageType === 'category-location') {
        params.append('location', location.label);
      }
      if (pageType === 'category' || pageType === 'category-location') {
        params.append('category', category.apiCategory);
      }
      // "this-weekend" just uses upcoming=true which is already set

      const res = await fetch(`${API_URL}/api/events?${params}`);
      if (!res.ok) throw new Error('Failed to fetch events');
      const data = await res.json();
      setEvents(data.data || []);
      setTotal(data.total ?? (data.data?.length ?? 0));
    } catch (err) {
      console.error(err);
      setError('Unable to load events. Please try again later.');
    } finally {
      setLoading(false);
    }
  }, [pageType, category, location]);

  useEffect(() => {
    setPage(1);
    fetchEvents(1);
  }, [fetchEvents]);

  const handlePageChange = (p) => {
    setPage(p);
    fetchEvents(p);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  if (!seo) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Page Not Found</h1>
          <p className="text-gray-500 mb-4">The event page you are looking for does not exist.</p>
          <Link to="/events" className="text-vaal-orange-500 hover:text-vaal-orange-600 font-medium">
            Browse all events
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <PageHelmet seo={seo} />

      {/* ── Hero ────────────────────────────────────────────────────────── */}
      <div className="bg-gradient-to-r from-vaal-orange-500 to-vaal-orange-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
          <nav className="flex items-center gap-1.5 text-xs text-white/70 mb-3 flex-wrap">
            {seo.breadcrumbs.map((crumb, i) => (
              <span key={i} className="flex items-center gap-1.5">
                {i > 0 && <span>/</span>}
                {crumb.url ? (
                  <Link to={crumb.url} className="hover:text-white transition-colors">{crumb.name}</Link>
                ) : (
                  <span className="text-white font-medium">{crumb.name}</span>
                )}
              </span>
            ))}
          </nav>
          <h1 className="text-2xl sm:text-3xl font-bold mb-1">{seo.h1}</h1>
          <p className="text-white/80 text-sm sm:text-base max-w-2xl">{seo.intro}</p>
        </div>
      </div>

      <SponsorBanner />

      {/* ── Location pills ─────────────────────────────────────────────── */}
      {pageType !== 'location' && pageType !== 'category-location' && (
        <div className="bg-white border-b border-gray-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
            <div className="flex items-center gap-2 overflow-x-auto pb-1">
              <span className="text-xs text-gray-400 font-medium whitespace-nowrap mr-1">Location:</span>
              {LOCATIONS.map(loc => {
                const href = pageType === 'category'
                  ? `/events/category/${category.slug}/${loc.slug}`
                  : `/events/${loc.slug}`;
                return (
                  <Link key={loc.slug} to={href}
                    className="px-3 py-1.5 text-xs font-medium rounded-full border border-gray-200 text-gray-600 hover:bg-vaal-orange-50 hover:border-vaal-orange-300 hover:text-vaal-orange-700 transition-colors whitespace-nowrap">
                    {loc.label}
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* ── Category pills ─────────────────────────────────────────────── */}
      {pageType !== 'category' && pageType !== 'category-location' && (
        <div className="bg-white border-b border-gray-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
            <div className="flex items-center gap-2 overflow-x-auto pb-1">
              <span className="text-xs text-gray-400 font-medium whitespace-nowrap mr-1">Category:</span>
              {EVENT_CATEGORIES.filter((c, i, arr) => arr.findIndex(x => x.apiCategory === c.apiCategory) === i).map(cat => {
                const href = pageType === 'location'
                  ? `/events/category/${cat.slug}/${location.slug}`
                  : `/events/category/${cat.slug}`;
                return (
                  <Link key={cat.slug} to={href}
                    className="px-3 py-1.5 text-xs font-medium rounded-full border border-gray-200 text-gray-600 hover:bg-vaal-orange-50 hover:border-vaal-orange-300 hover:text-vaal-orange-700 transition-colors whitespace-nowrap">
                    {cat.label}
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* ── Event grid ─────────────────────────────────────────────────── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {loading && (
          <div className="text-center py-16">
            <div className="inline-block animate-spin rounded-full h-10 w-10 border-b-2 border-vaal-orange-500" />
            <p className="mt-3 text-gray-500 text-sm">Loading events...</p>
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-5 py-4 rounded-xl text-sm">
            <p className="font-semibold mb-0.5">Something went wrong</p>
            <p>{error}</p>
          </div>
        )}

        {!loading && !error && events.length === 0 && (
          <div className="text-center py-16 bg-white rounded-xl border border-gray-100">
            <svg className="mx-auto h-10 w-10 text-gray-300 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <h3 className="text-base font-semibold text-gray-700">No events found</h3>
            <p className="mt-1 text-sm text-gray-400">Check back soon for new events in this area.</p>
            <Link to="/events" className="mt-3 inline-block text-sm text-vaal-orange-500 hover:text-vaal-orange-600 font-medium">
              Browse all events
            </Link>
          </div>
        )}

        {!loading && !error && events.length > 0 && (
          <>
            <p className="text-xs text-gray-400 mb-4">
              Showing {((page - 1) * PAGE_SIZE) + 1}--{Math.min(page * PAGE_SIZE, total || events.length)} events
              {totalPages > 1 && <> &middot; page {page} of {totalPages}</>}
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {events.map(event => (
                <EventCard key={event.event_id} event={event} />
              ))}
            </div>
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-1 mt-8 flex-wrap">
                <button onClick={() => handlePageChange(page - 1)} disabled={page === 1}
                  className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-sm font-medium border border-gray-200 text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors">
                  Prev
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1)
                  .filter(p => p === 1 || p === totalPages || Math.abs(p - page) <= 1)
                  .reduce((acc, p, i, arr) => {
                    if (i > 0 && p - arr[i - 1] > 1) acc.push('...');
                    acc.push(p);
                    return acc;
                  }, [])
                  .map((item, i) =>
                    item === '...' ? (
                      <span key={`e${i}`} className="px-2 py-1.5 text-gray-400 text-sm">...</span>
                    ) : (
                      <button key={item} onClick={() => handlePageChange(item)}
                        className={`min-w-[36px] px-2 py-1.5 rounded-lg text-sm font-medium transition-colors border ${
                          item === page ? 'bg-vaal-orange-500 text-white border-vaal-orange-500' : 'border-gray-200 text-gray-700 hover:bg-gray-50'
                        }`}>
                        {item}
                      </button>
                    )
                  )}
                <button onClick={() => handlePageChange(page + 1)} disabled={page === totalPages}
                  className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-sm font-medium border border-gray-200 text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors">
                  Next
                </button>
              </div>
            )}
          </>
        )}
      </div>

      {/* ── FAQ section ────────────────────────────────────────────────── */}
      {seo.faqs && seo.faqs.length > 0 && (
        <div className="bg-white border-t border-gray-100">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
            <h2 className="text-lg font-bold text-gray-900 mb-6">Frequently Asked Questions</h2>
            <div className="space-y-5">
              {seo.faqs.map((faq, i) => (
                <div key={i}>
                  <h3 className="text-sm font-semibold text-gray-800 mb-1">{faq.q}</h3>
                  <p className="text-sm text-gray-600 leading-relaxed">{faq.a}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ── Related links ─────────────────────────────────────────────── */}
      <div className="bg-gray-50 border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Other locations */}
            {pageType !== 'this-weekend' && (
              <div>
                <h3 className="text-sm font-bold text-gray-900 mb-3">Events in Other Areas</h3>
                <div className="flex flex-wrap gap-2">
                  {LOCATIONS.filter(l => l.slug !== location?.slug).map(loc => (
                    <Link key={loc.slug}
                      to={category ? `/events/category/${category.slug}/${loc.slug}` : `/events/${loc.slug}`}
                      className="text-xs px-3 py-1.5 bg-white border border-gray-200 rounded-full text-gray-600 hover:text-vaal-orange-600 hover:border-vaal-orange-300 transition-colors">
                      {loc.label}
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* Other categories */}
            <div>
              <h3 className="text-sm font-bold text-gray-900 mb-3">Browse by Category</h3>
              <div className="flex flex-wrap gap-2">
                {EVENT_CATEGORIES.filter((c, i, arr) => arr.findIndex(x => x.apiCategory === c.apiCategory) === i)
                  .filter(c => c.slug !== category?.slug)
                  .map(cat => (
                    <Link key={cat.slug}
                      to={location ? `/events/category/${cat.slug}/${location.slug}` : `/events/category/${cat.slug}`}
                      className="text-xs px-3 py-1.5 bg-white border border-gray-200 rounded-full text-gray-600 hover:text-vaal-orange-600 hover:border-vaal-orange-300 transition-colors">
                      {cat.label}
                    </Link>
                  ))}
              </div>
            </div>
          </div>

          <div className="mt-6 pt-6 border-t border-gray-200 flex flex-wrap gap-3">
            <Link to="/events" className="text-xs text-vaal-orange-500 hover:text-vaal-orange-600 font-medium">
              All Events
            </Link>
            <Link to="/events/this-weekend" className="text-xs text-vaal-orange-500 hover:text-vaal-orange-600 font-medium">
              This Weekend
            </Link>
            <Link to="/add-event" className="text-xs text-vaal-orange-500 hover:text-vaal-orange-600 font-medium">
              Submit an Event
            </Link>
          </div>
        </div>
      </div>

      <NewsletterSignupBar />
    </div>
  );
}
