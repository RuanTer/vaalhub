import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
const SITE_URL = 'https://vaalhub.co.za';

function slugify(text = '') {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '') || 'item';
}

function formatDate(dateString) {
  if (!dateString) return '';
  return new Date(dateString).toLocaleDateString('en-ZA', {
    day: 'numeric', month: 'short', year: 'numeric',
  });
}

/**
 * Shared component for town pages: adds SEO metadata + dynamic content sections.
 * Props:
 *   - townName: "Vereeniging"
 *   - townSlug: "vereeniging"
 *   - province: "Gauteng" | "Free State"
 *   - description: SEO meta description for the town
 */
export default function TownDynamicContent({ townName, townSlug, province = 'Gauteng', description }) {
  const [news, setNews] = useState([]);
  const [events, setEvents] = useState([]);
  const [businesses, setBusinesses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchContent() {
      try {
        const [newsRes, eventsRes, bizRes] = await Promise.allSettled([
          fetch(`${API_URL}/api/news?area=${townName}&limit=5`),
          fetch(`${API_URL}/api/events?location=${townName}&limit=5`),
          fetch(`${API_URL}/api/businesses?location=${townName}&status=published&limit=5`),
        ]);

        if (newsRes.status === 'fulfilled' && newsRes.value.ok) {
          const data = await newsRes.value.json();
          setNews(data.data || []);
        }
        if (eventsRes.status === 'fulfilled' && eventsRes.value.ok) {
          const data = await eventsRes.value.json();
          setEvents(data.data || []);
        }
        if (bizRes.status === 'fulfilled' && bizRes.value.ok) {
          const data = await bizRes.value.json();
          const items = Array.isArray(data) ? data : (data.data || data.businesses || []);
          setBusinesses(items.slice(0, 5));
        }
      } catch {
        // Fail silently — static content still shows
      } finally {
        setLoading(false);
      }
    }
    fetchContent();
  }, [townName]);

  const townUrl = `${SITE_URL}/towns/${townSlug}`;
  const metaDesc = description || `${townName} local news, events, businesses and things to do. Your complete guide to ${townName} in the Vaal Triangle, South Africa.`;
  const keywords = `${townName}, ${townName} news, events in ${townName}, ${townName} businesses, things to do ${townName}, Vaal Triangle`;

  return (
    <>
      {/* SEO metadata */}
      <Helmet>
        <title>{townName} - News, Events & Local Guide | VaalHub</title>
        <meta name="description" content={metaDesc} />
        <meta name="keywords" content={keywords} />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href={townUrl} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={townUrl} />
        <meta property="og:title" content={`${townName} - News, Events & Local Guide | VaalHub`} />
        <meta property="og:description" content={metaDesc} />
        <meta property="og:site_name" content="VaalHub" />
        <meta property="og:locale" content="en_ZA" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={`${townName} - News, Events & Local Guide | VaalHub`} />
        <meta name="twitter:description" content={metaDesc} />
        <script type="application/ld+json">{JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'Place',
          name: townName,
          description: metaDesc,
          url: townUrl,
          address: {
            '@type': 'PostalAddress',
            addressLocality: townName,
            addressRegion: province,
            addressCountry: 'ZA',
          },
          containedInPlace: { '@type': 'Place', name: 'Vaal Triangle' },
        })}</script>
        <script type="application/ld+json">{JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'BreadcrumbList',
          itemListElement: [
            { '@type': 'ListItem', position: 1, name: 'Home', item: `${SITE_URL}/` },
            { '@type': 'ListItem', position: 2, name: townName },
          ],
        })}</script>
      </Helmet>

      {/* Dynamic content sections */}
      <div className="bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

            {/* Latest News */}
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-4">Latest {townName} News</h2>
              {loading ? (
                <div className="animate-pulse space-y-3">
                  {[1,2,3].map(i => <div key={i} className="h-16 bg-gray-200 rounded-lg" />)}
                </div>
              ) : news.length > 0 ? (
                <div className="space-y-3">
                  {news.map(article => (
                    <Link
                      key={article.news_id}
                      to={`/news/${article.slug || article.news_id}`}
                      className="block bg-white rounded-lg border border-gray-100 p-3 hover:border-vaal-orange-300 hover:shadow-sm transition-all"
                    >
                      <h3 className="text-sm font-semibold text-gray-900 line-clamp-2 mb-1">{article.headline}</h3>
                      <p className="text-xs text-gray-400">{formatDate(article.publish_date)}</p>
                    </Link>
                  ))}
                  <Link to={`/news?area=${townName}`} className="block text-sm text-vaal-orange-600 hover:text-vaal-orange-700 font-medium mt-2">
                    View all {townName} news →
                  </Link>
                </div>
              ) : (
                <p className="text-sm text-gray-400">No recent news for {townName}.</p>
              )}
            </div>

            {/* Upcoming Events */}
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-4">Upcoming Events in {townName}</h2>
              {loading ? (
                <div className="animate-pulse space-y-3">
                  {[1,2,3].map(i => <div key={i} className="h-16 bg-gray-200 rounded-lg" />)}
                </div>
              ) : events.length > 0 ? (
                <div className="space-y-3">
                  {events.map(event => (
                    <Link
                      key={event.event_id}
                      to={`/events/${event.event_id}/${slugify(event.title)}`}
                      className="block bg-white rounded-lg border border-gray-100 p-3 hover:border-vaal-orange-300 hover:shadow-sm transition-all"
                    >
                      <h3 className="text-sm font-semibold text-gray-900 line-clamp-2 mb-1">{event.title}</h3>
                      <div className="flex items-center gap-2 text-xs text-gray-400">
                        <span>{formatDate(event.date_start)}</span>
                        {event.category && <span className="px-1.5 py-0.5 bg-vaal-orange-50 text-vaal-orange-600 rounded">{event.category}</span>}
                      </div>
                    </Link>
                  ))}
                  <Link to={`/events?location=${townName}`} className="block text-sm text-vaal-orange-600 hover:text-vaal-orange-700 font-medium mt-2">
                    View all {townName} events →
                  </Link>
                </div>
              ) : (
                <p className="text-sm text-gray-400">No upcoming events in {townName}.</p>
              )}
            </div>

            {/* Local Businesses */}
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-4">{townName} Businesses</h2>
              {loading ? (
                <div className="animate-pulse space-y-3">
                  {[1,2,3].map(i => <div key={i} className="h-16 bg-gray-200 rounded-lg" />)}
                </div>
              ) : businesses.length > 0 ? (
                <div className="space-y-3">
                  {businesses.map(biz => (
                    <Link
                      key={biz.business_id}
                      to={`/businesses/${biz.business_id}/${slugify(biz.business_name || biz.name)}`}
                      className="block bg-white rounded-lg border border-gray-100 p-3 hover:border-vaal-orange-300 hover:shadow-sm transition-all"
                    >
                      <h3 className="text-sm font-semibold text-gray-900 line-clamp-1 mb-1">{biz.business_name || biz.name}</h3>
                      <p className="text-xs text-gray-400">{biz.category}</p>
                    </Link>
                  ))}
                  <Link to={`/businesses?location=${townName}`} className="block text-sm text-vaal-orange-600 hover:text-vaal-orange-700 font-medium mt-2">
                    View all {townName} businesses →
                  </Link>
                </div>
              ) : (
                <p className="text-sm text-gray-400">No businesses listed for {townName} yet.</p>
              )}
            </div>

          </div>
        </div>
      </div>
    </>
  );
}
