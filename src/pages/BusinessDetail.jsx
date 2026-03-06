import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { buildBusinessMeta } from '../hooks/useSEO';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
const SITE_URL = 'https://vaalhub.co.za';

function slugify(name = '') {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

const CATEGORY_ICONS = {
  Restaurant: '🍽️', Retail: '🛍️', Healthcare: '🏥', Automotive: '🚗',
  Construction: '🔨', Education: '📚', Entertainment: '🎭',
  'Professional Services': '💼', Service: '⚙️',
};

export default function BusinessDetail() {
  const { id } = useParams();
  const [business, setBusiness] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!id) { setError('No business specified.'); setLoading(false); return; }
    setLoading(true);
    fetch(`${API_URL}/api/businesses/${id}`)
      .then(r => {
        if (!r.ok) throw new Error(r.status === 404 ? 'Business not found.' : 'Failed to load.');
        return r.json();
      })
      .then(data => { setBusiness(data); setLoading(false); })
      .catch(e => { setError(e.message); setLoading(false); });
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-red-600 border-t-transparent" />
      </div>
    );
  }

  if (error || !business) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 px-4">
        <div className="text-5xl">🏢</div>
        <h1 className="text-2xl font-bold text-gray-800">Business Not Found</h1>
        <p className="text-gray-500">{error || 'This business could not be found.'}</p>
        <Link to="/businesses" className="mt-2 px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition">
          ← Back to Businesses
        </Link>
      </div>
    );
  }

  const name = business.business_name || business.name;
  const slug = slugify(name);
  const canonicalUrl = `${SITE_URL}/businesses/${id}/${slug}`;
  const icon = CATEGORY_ICONS[business.category] || '🏢';
  const logoSrc = business.logo_url
    ? (business.logo_url.startsWith('http') ? business.logo_url : `${SITE_URL}${business.logo_url}`)
    : null;

  return (
    <>
      <Helmet>{buildBusinessMeta(business, canonicalUrl)}</Helmet>

      <div className="min-h-screen bg-gray-50">
        {/* Breadcrumb */}
        <div className="bg-white border-b border-gray-100">
          <div className="max-w-4xl mx-auto px-4 py-3 flex items-center gap-2 text-sm text-gray-500">
            <Link to="/" className="hover:text-red-600 transition">Home</Link>
            <span>›</span>
            <Link to="/businesses" className="hover:text-red-600 transition">Businesses</Link>
            <span>›</span>
            <span className="text-gray-800 font-medium truncate">{name}</span>
          </div>
        </div>

        <div className="max-w-4xl mx-auto px-4 py-8">
          {/* Header card */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden mb-6">
            <div className="h-2 bg-gradient-to-r from-red-600 to-red-400" />
            <div className="p-6 sm:p-8 flex flex-col sm:flex-row gap-6 items-start">
              {/* Logo */}
              <div className="flex-shrink-0">
                {logoSrc ? (
                  <img
                    src={logoSrc}
                    alt={`${name} logo`}
                    className="w-24 h-24 sm:w-32 sm:h-32 object-contain rounded-xl border border-gray-100 bg-gray-50 p-2"
                    onError={e => { e.target.onerror = null; e.target.style.display = 'none'; }}
                  />
                ) : (
                  <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-xl bg-red-50 flex items-center justify-center text-5xl">
                    {icon}
                  </div>
                )}
              </div>

              {/* Name / badges */}
              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-2 mb-1">
                  {business.is_verified === 1 && (
                    <span className="inline-flex items-center gap-1 text-xs font-semibold text-green-700 bg-green-50 border border-green-200 px-2 py-0.5 rounded-full">
                      ✓ Verified
                    </span>
                  )}
                  {business.category && (
                    <span className="inline-flex items-center gap-1 text-xs font-medium text-gray-600 bg-gray-100 px-2 py-0.5 rounded-full">
                      {icon} {business.category}
                    </span>
                  )}
                  {business.location && (
                    <span className="text-xs text-gray-500">📍 {business.location}</span>
                  )}
                </div>
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 leading-tight">{name}</h1>
                {business.description && (
                  <p className="mt-3 text-gray-600 leading-relaxed">{business.description}</p>
                )}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {/* Contact details */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <h2 className="text-lg font-semibold text-gray-800 mb-4">Contact Information</h2>
              <ul className="space-y-3">
                {business.phone && (
                  <li className="flex items-start gap-3">
                    <span className="text-xl mt-0.5">📞</span>
                    <div>
                      <p className="text-xs text-gray-400 uppercase tracking-wide font-medium">Phone</p>
                      <a href={`tel:${business.phone}`} className="text-gray-800 font-medium hover:text-red-600 transition">
                        {business.phone}
                      </a>
                    </div>
                  </li>
                )}
                {business.email && (
                  <li className="flex items-start gap-3">
                    <span className="text-xl mt-0.5">✉️</span>
                    <div>
                      <p className="text-xs text-gray-400 uppercase tracking-wide font-medium">Email</p>
                      <a href={`mailto:${business.email}`} className="text-gray-800 font-medium hover:text-red-600 transition break-all">
                        {business.email}
                      </a>
                    </div>
                  </li>
                )}
                {business.website && (
                  <li className="flex items-start gap-3">
                    <span className="text-xl mt-0.5">🌐</span>
                    <div>
                      <p className="text-xs text-gray-400 uppercase tracking-wide font-medium">Website</p>
                      <a href={business.website} target="_blank" rel="noopener noreferrer"
                         className="text-red-600 font-medium hover:text-red-700 transition break-all">
                        {business.website.replace(/^https?:\/\//, '')}
                      </a>
                    </div>
                  </li>
                )}
                {business.address && (
                  <li className="flex items-start gap-3">
                    <span className="text-xl mt-0.5">📍</span>
                    <div>
                      <p className="text-xs text-gray-400 uppercase tracking-wide font-medium">Address</p>
                      <p className="text-gray-800">{business.address}</p>
                    </div>
                  </li>
                )}
                {business.operating_hours && (
                  <li className="flex items-start gap-3">
                    <span className="text-xl mt-0.5">🕐</span>
                    <div>
                      <p className="text-xs text-gray-400 uppercase tracking-wide font-medium">Hours</p>
                      <p className="text-gray-800 whitespace-pre-line">{business.operating_hours}</p>
                    </div>
                  </li>
                )}
              </ul>
            </div>

            {/* Social & Google */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <h2 className="text-lg font-semibold text-gray-800 mb-4">Find Us Online</h2>
              <div className="space-y-3">
                {business.facebook && (
                  <a href={business.facebook} target="_blank" rel="noopener noreferrer"
                     className="flex items-center gap-3 p-3 rounded-xl bg-blue-50 hover:bg-blue-100 transition group">
                    <span className="text-2xl">📘</span>
                    <span className="text-blue-700 font-medium group-hover:underline">Facebook</span>
                  </a>
                )}
                {business.instagram && (
                  <a href={business.instagram} target="_blank" rel="noopener noreferrer"
                     className="flex items-center gap-3 p-3 rounded-xl bg-pink-50 hover:bg-pink-100 transition group">
                    <span className="text-2xl">📷</span>
                    <span className="text-pink-700 font-medium group-hover:underline">Instagram</span>
                  </a>
                )}
                {business.google_place_id && (
                  <a href={`https://www.google.com/maps/place/?q=place_id:${business.google_place_id}`}
                     target="_blank" rel="noopener noreferrer"
                     className="flex items-center gap-3 p-3 rounded-xl bg-green-50 hover:bg-green-100 transition group">
                    <span className="text-2xl">🗺️</span>
                    <span className="text-green-700 font-medium group-hover:underline">View on Google Maps</span>
                  </a>
                )}
                {business.google_rating && (
                  <div className="flex items-center gap-3 p-3 rounded-xl bg-yellow-50">
                    <span className="text-2xl">⭐</span>
                    <div>
                      <p className="text-yellow-700 font-bold">{business.google_rating} / 5</p>
                      <p className="text-xs text-yellow-600">{business.google_review_count} Google reviews</p>
                    </div>
                  </div>
                )}
                {!business.facebook && !business.instagram && !business.google_place_id && (
                  <p className="text-gray-400 text-sm italic">No online profiles linked yet.</p>
                )}
              </div>

              {/* Claim CTA */}
              {business.is_verified !== 1 && (
                <div className="mt-6 pt-4 border-t border-gray-100">
                  <p className="text-sm text-gray-500 mb-2">Is this your business?</p>
                  <Link
                    to={`/claim-business?id=${business.business_id}&name=${encodeURIComponent(name)}`}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-red-600 text-white text-sm font-semibold rounded-lg hover:bg-red-700 transition">
                    🏷️ Claim & Verify
                  </Link>
                </div>
              )}
            </div>
          </div>

          {/* Back link */}
          <div className="mt-8 flex justify-start">
            <Link to="/businesses"
                  className="inline-flex items-center gap-2 text-gray-500 hover:text-red-600 transition text-sm font-medium">
              ← Back to Business Directory
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
