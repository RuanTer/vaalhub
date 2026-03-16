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

/* ── Modern SVG icon set ─────────────────────────────────────────── */

function PhoneIcon() {
  return (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.81a19.79 19.79 0 01-3.07-8.72A2 2 0 012.18 0h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.91 7.91a16 16 0 006.18 6.18l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z" />
    </svg>
  );
}

function MailIcon() {
  return (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="4" width="20" height="16" rx="2" />
      <path d="M2 7l10 7 10-7" />
    </svg>
  );
}

function GlobeIcon() {
  return (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <path d="M2 12h20M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z" />
    </svg>
  );
}

function MapPinIcon() {
  return (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 10c0 7-9 13-9 13S3 17 3 10a9 9 0 0118 0z" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  );
}

function ClockIcon() {
  return (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </svg>
  );
}

function FacebookIcon() {
  return (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
      <path d="M24 12.073C24 5.405 18.627 0 12 0S0 5.405 0 12.073C0 18.1 4.388 23.094 10.125 24v-8.437H7.078v-3.49h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.49h-2.796V24C19.612 23.094 24 18.1 24 12.073z" />
    </svg>
  );
}

function InstagramIcon() {
  return (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
    </svg>
  );
}

function GoogleMapsIcon() {
  return (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" />
      <circle cx="12" cy="9" r="2.5" />
    </svg>
  );
}

function StarIcon({ filled = true }) {
  return (
    <svg className="w-4 h-4" viewBox="0 0 24 24" fill={filled ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="1.5">
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
  );
}

function ImageIcon() {
  return (
    <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
      <circle cx="8.5" cy="8.5" r="1.5" />
      <polyline points="21 15 16 10 5 21" />
    </svg>
  );
}

function TagIcon() {
  return (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20.59 13.41l-7.17 7.17a2 2 0 01-2.83 0L2 12V2h10l8.59 8.59a2 2 0 010 2.82z" />
      <line x1="7" y1="7" x2="7.01" y2="7" />
    </svg>
  );
}

export default function BusinessDetail() {
  const { id } = useParams();
  const [business, setBusiness] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [promoZoomed, setPromoZoomed] = useState(false);

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
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-vaal-orange-500 border-t-transparent" />
      </div>
    );
  }

  if (error || !business) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 px-4">
        <div className="text-5xl">🏢</div>
        <h1 className="text-2xl font-bold text-gray-800">Business Not Found</h1>
        <p className="text-gray-500">{error || 'This business could not be found.'}</p>
        <Link to="/businesses" className="mt-2 px-6 py-2 bg-vaal-orange-500 text-white rounded-lg hover:bg-vaal-orange-600 transition">
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
  const promoSrc = business.promo_image
    ? (business.promo_image.startsWith('http') ? business.promo_image : `${SITE_URL}${business.promo_image}`)
    : null;

  return (
    <>
      <Helmet>{buildBusinessMeta(business, canonicalUrl)}</Helmet>

      <div className="min-h-screen bg-gray-50">
        {/* Breadcrumb */}
        <div className="bg-white border-b border-gray-100">
          <div className="max-w-4xl mx-auto px-4 py-3 flex items-center gap-2 text-sm text-gray-500">
            <Link to="/" className="hover:text-vaal-orange-500 transition">Home</Link>
            <span>›</span>
            <Link to="/businesses" className="hover:text-vaal-orange-500 transition">Businesses</Link>
            <span>›</span>
            <span className="text-gray-800 font-medium truncate">{name}</span>
          </div>
        </div>

        <div className="max-w-4xl mx-auto px-4 py-8">

          {/* ── Header card ─────────────────────────────────────────── */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden mb-6">
            {/* Orange accent bar — matches site brand */}
            <div className="h-1.5 bg-gradient-to-r from-vaal-orange-500 via-orange-400 to-amber-400" />
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
                  <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-xl bg-orange-50 flex items-center justify-center text-5xl">
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
                    <span className="inline-flex items-center gap-1 text-xs text-gray-500">
                      <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M21 10c0 7-9 13-9 13S3 17 3 10a9 9 0 0118 0z" /><circle cx="12" cy="10" r="3" />
                      </svg>
                      {business.location}
                    </span>
                  )}
                </div>
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 leading-tight">{name}</h1>
                {business.description && (
                  <p className="mt-3 text-gray-600 leading-relaxed">{business.description}</p>
                )}
                {business.tags && (
                  <div className="flex flex-wrap gap-1.5 mt-3">
                    {business.tags.split(',').map(tag => (
                      <Link
                        key={tag.trim()}
                        to={`/businesses?tag=${encodeURIComponent(tag.trim())}`}
                        className="text-xs px-2.5 py-1 bg-gray-50 text-gray-500 hover:bg-vaal-orange-50 hover:text-vaal-orange-700 border border-gray-200 hover:border-vaal-orange-300 rounded-full transition-colors"
                      >
                        {tag.trim()}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* ── Promo / Specials image (only shown if promo_image exists) ── */}
          {promoSrc && (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden mb-6">
              {/* Section header */}
              <div className="px-6 py-4 border-b border-gray-100 flex items-center gap-2">
                <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-vaal-orange-50 text-vaal-orange-500">
                  <TagIcon />
                </span>
                <div>
                  <h2 className="text-base font-semibold text-gray-800">Specials &amp; Information</h2>
                  <p className="text-xs text-gray-400">Promotions, pricelist or other info from this business</p>
                </div>
              </div>

              {/* Image — click to zoom */}
              <div
                className="relative cursor-zoom-in"
                onClick={() => setPromoZoomed(true)}
                title="Click to enlarge"
              >
                <img
                  src={promoSrc}
                  alt={`${name} specials or pricelist`}
                  className="w-full max-h-[480px] object-contain bg-gray-50"
                  onError={e => { e.target.closest('.bg-white').style.display = 'none'; }}
                />
                {/* Zoom hint */}
                <div className="absolute bottom-3 right-3 flex items-center gap-1.5 bg-black/50 text-white text-xs px-2.5 py-1.5 rounded-full backdrop-blur-sm pointer-events-none">
                  <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
                    <line x1="11" y1="8" x2="11" y2="14" /><line x1="8" y1="11" x2="14" y2="11" />
                  </svg>
                  View full size
                </div>
              </div>
            </div>
          )}

          {/* Lightbox */}
          {promoZoomed && promoSrc && (
            <div
              className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4 cursor-zoom-out"
              onClick={() => setPromoZoomed(false)}
            >
              <div className="relative max-w-5xl max-h-full" onClick={e => e.stopPropagation()}>
                <button
                  onClick={() => setPromoZoomed(false)}
                  className="absolute -top-10 right-0 text-white/80 hover:text-white text-sm flex items-center gap-1"
                >
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                  Close
                </button>
                <img
                  src={promoSrc}
                  alt={`${name} specials`}
                  className="max-w-full max-h-[85vh] object-contain rounded-xl shadow-2xl"
                />
              </div>
            </div>
          )}

          {/* ── PDF Viewer (menu, pricelist, brochure) ─────────────── */}
          {business.pdf_filename && (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden mb-6">
              {/* Section header */}
              <div className="px-6 py-4 border-b border-gray-100 flex items-center gap-2">
                <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-vaal-orange-50 text-vaal-orange-500">
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
                    <polyline points="14 2 14 8 20 8" />
                    <line x1="16" y1="13" x2="8" y2="13" />
                    <line x1="16" y1="17" x2="8" y2="17" />
                    <polyline points="10 9 9 9 8 9" />
                  </svg>
                </span>
                <div>
                  <h2 className="text-base font-semibold text-gray-800">Documents &amp; Downloads</h2>
                  <p className="text-xs text-gray-400">Menu, pricelist, or brochure from this business</p>
                </div>
              </div>

              {/* Embedded PDF viewer */}
              <div className="p-4">
                <object
                  data={`${API_URL}/api/businesses/${business.business_id}/pdf`}
                  type="application/pdf"
                  className="w-full h-[600px] sm:h-[500px] rounded-lg border border-gray-200"
                >
                  <iframe
                    src={`${API_URL}/api/businesses/${business.business_id}/pdf`}
                    className="w-full h-[600px] sm:h-[500px] rounded-lg border border-gray-200"
                    title={`${name} document`}
                  >
                    <p className="text-gray-500 text-sm p-4">
                      Your browser does not support embedded PDFs.
                    </p>
                  </iframe>
                </object>

                {/* Download / open link as fallback */}
                <a
                  href={`${API_URL}/api/businesses/${business.business_id}/pdf`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-3 inline-flex items-center gap-2 text-sm font-medium text-vaal-orange-600 hover:text-vaal-orange-700 transition-colors"
                >
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" />
                    <polyline points="7 10 12 15 17 10" />
                    <line x1="12" y1="15" x2="12" y2="3" />
                  </svg>
                  Download PDF
                </a>
              </div>
            </div>
          )}

          {/* ── Contact + Social grid ───────────────────────────────── */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">

            {/* Contact details */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <h2 className="text-lg font-semibold text-gray-800 mb-4">Contact Information</h2>
              <ul className="space-y-4">

                {business.phone && (
                  <li className="flex items-start gap-3">
                    <span className="flex-shrink-0 flex items-center justify-center w-9 h-9 rounded-lg bg-vaal-orange-50 text-vaal-orange-500 mt-0.5">
                      <PhoneIcon />
                    </span>
                    <div>
                      <p className="text-xs text-gray-400 uppercase tracking-wide font-medium">Phone</p>
                      <a href={`tel:${business.phone}`} className="text-gray-800 font-medium hover:text-vaal-orange-500 transition">
                        {business.phone}
                      </a>
                    </div>
                  </li>
                )}

                {business.email && (
                  <li className="flex items-start gap-3">
                    <span className="flex-shrink-0 flex items-center justify-center w-9 h-9 rounded-lg bg-vaal-orange-50 text-vaal-orange-500 mt-0.5">
                      <MailIcon />
                    </span>
                    <div>
                      <p className="text-xs text-gray-400 uppercase tracking-wide font-medium">Email</p>
                      <a href={`mailto:${business.email}`} className="text-gray-800 font-medium hover:text-vaal-orange-500 transition break-all">
                        {business.email}
                      </a>
                    </div>
                  </li>
                )}

                {business.website && (
                  <li className="flex items-start gap-3">
                    <span className="flex-shrink-0 flex items-center justify-center w-9 h-9 rounded-lg bg-vaal-orange-50 text-vaal-orange-500 mt-0.5">
                      <GlobeIcon />
                    </span>
                    <div>
                      <p className="text-xs text-gray-400 uppercase tracking-wide font-medium">Website</p>
                      <a href={business.website} target="_blank" rel="noopener noreferrer"
                         className="text-vaal-orange-500 font-medium hover:text-vaal-orange-600 transition break-all">
                        {business.website.replace(/^https?:\/\//, '')}
                      </a>
                    </div>
                  </li>
                )}

                {business.address && (
                  <li className="flex items-start gap-3">
                    <span className="flex-shrink-0 flex items-center justify-center w-9 h-9 rounded-lg bg-vaal-orange-50 text-vaal-orange-500 mt-0.5">
                      <MapPinIcon />
                    </span>
                    <div>
                      <p className="text-xs text-gray-400 uppercase tracking-wide font-medium">Address</p>
                      <p className="text-gray-800">{business.address}</p>
                    </div>
                  </li>
                )}

                {business.operating_hours && (
                  <li className="flex items-start gap-3">
                    <span className="flex-shrink-0 flex items-center justify-center w-9 h-9 rounded-lg bg-vaal-orange-50 text-vaal-orange-500 mt-0.5">
                      <ClockIcon />
                    </span>
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
                    <span className="flex items-center justify-center w-9 h-9 rounded-lg bg-blue-600 text-white flex-shrink-0">
                      <FacebookIcon />
                    </span>
                    <span className="text-blue-700 font-medium group-hover:underline">Facebook</span>
                    <svg className="w-4 h-4 text-blue-400 ml-auto" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6M15 3h6v6M10 14L21 3" />
                    </svg>
                  </a>
                )}

                {business.instagram && (
                  <a href={business.instagram} target="_blank" rel="noopener noreferrer"
                     className="flex items-center gap-3 p-3 rounded-xl bg-pink-50 hover:bg-pink-100 transition group">
                    <span className="flex items-center justify-center w-9 h-9 rounded-lg bg-gradient-to-br from-purple-500 via-pink-500 to-orange-400 text-white flex-shrink-0">
                      <InstagramIcon />
                    </span>
                    <span className="text-pink-700 font-medium group-hover:underline">Instagram</span>
                    <svg className="w-4 h-4 text-pink-400 ml-auto" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6M15 3h6v6M10 14L21 3" />
                    </svg>
                  </a>
                )}

                {business.google_place_id && (
                  <a href={`https://www.google.com/maps/place/?q=place_id:${business.google_place_id}`}
                     target="_blank" rel="noopener noreferrer"
                     className="flex items-center gap-3 p-3 rounded-xl bg-green-50 hover:bg-green-100 transition group">
                    <span className="flex items-center justify-center w-9 h-9 rounded-lg bg-green-600 text-white flex-shrink-0">
                      <GoogleMapsIcon />
                    </span>
                    <span className="text-green-700 font-medium group-hover:underline">View on Google Maps</span>
                    <svg className="w-4 h-4 text-green-400 ml-auto" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6M15 3h6v6M10 14L21 3" />
                    </svg>
                  </a>
                )}

                {business.google_rating && (
                  <div className="flex items-center gap-3 p-3 rounded-xl bg-yellow-50">
                    <span className="flex items-center justify-center w-9 h-9 rounded-lg bg-yellow-400 text-white flex-shrink-0">
                      <StarIcon />
                    </span>
                    <div>
                      <p className="text-yellow-700 font-bold text-sm">{business.google_rating} / 5 on Google</p>
                      {business.google_review_count && (
                        <p className="text-xs text-yellow-600">{business.google_review_count} reviews</p>
                      )}
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
                    className="inline-flex items-center gap-2 px-4 py-2 bg-vaal-orange-500 text-white text-sm font-semibold rounded-lg hover:bg-vaal-orange-600 transition">
                    <TagIcon />
                    Claim &amp; Verify
                  </Link>
                </div>
              )}
            </div>
          </div>

          {/* Back link */}
          <div className="mt-8 flex justify-start">
            <Link to="/businesses"
                  className="inline-flex items-center gap-2 text-gray-500 hover:text-vaal-orange-500 transition text-sm font-medium">
              ← Back to Business Directory
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
