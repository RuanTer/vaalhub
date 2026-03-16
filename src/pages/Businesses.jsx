import { useState, useEffect, useCallback } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { buildPageMeta } from '../hooks/useSEO';
import Modal from '../components/ui/Modal';
import SponsorBanner from '../components/ui/SponsorBanner';
import NewsletterSignupBar from '../components/ui/NewsletterSignupBar';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
const PAGE_SIZE = 20;

const locations  = ['Vereeniging', 'Vanderbijlpark', 'Meyerton', 'Sasolburg', 'Sharpeville'];
const categories = ['Restaurant', 'Retail', 'Service', 'Healthcare', 'Entertainment', 'Automotive', 'Construction', 'Professional Services', 'Education', 'Other'];

// ── tiny helpers ─────────────────────────────────────────────────────────────

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

function VerifiedBadge({ small = false }) {
  return (
    <span className={`inline-flex items-center gap-1 bg-blue-600 text-white font-semibold rounded-full ${small ? 'px-2 py-0.5 text-xs' : 'px-2.5 py-1 text-xs'}`}>
      <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
      </svg>
      Verified
    </span>
  );
}

// ── Pagination bar ────────────────────────────────────────────────────────────

function Pagination({ page, totalPages, onChange }) {
  if (totalPages <= 1) return null;

  // Build page window: always show first, last, current ±1
  const pages = new Set([1, totalPages, page, page - 1, page + 1].filter(p => p >= 1 && p <= totalPages));
  const sorted = [...pages].sort((a, b) => a - b);

  const items = [];
  let prev = null;
  for (const p of sorted) {
    if (prev !== null && p - prev > 1) items.push('…');
    items.push(p);
    prev = p;
  }

  return (
    <div className="flex items-center justify-center gap-1 mt-8 flex-wrap">
      {/* Prev */}
      <button
        onClick={() => onChange(page - 1)}
        disabled={page === 1}
        className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-sm font-medium border border-gray-200 text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
      >
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
        </svg>
        Prev
      </button>

      {items.map((item, i) =>
        item === '…' ? (
          <span key={`ellipsis-${i}`} className="px-2 py-1.5 text-gray-400 text-sm select-none">…</span>
        ) : (
          <button
            key={item}
            onClick={() => onChange(item)}
            className={`min-w-[36px] px-2 py-1.5 rounded-lg text-sm font-medium transition-colors border ${
              item === page
                ? 'bg-vaal-orange-500 text-white border-vaal-orange-500'
                : 'border-gray-200 text-gray-700 hover:bg-gray-50'
            }`}
          >
            {item}
          </button>
        )
      )}

      {/* Next */}
      <button
        onClick={() => onChange(page + 1)}
        disabled={page === totalPages}
        className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-sm font-medium border border-gray-200 text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
      >
        Next
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
        </svg>
      </button>
    </div>
  );
}

// ── Main component ────────────────────────────────────────────────────────────

export default function Businesses() {
  const [searchParams] = useSearchParams();
  const [businesses, setBusinesses]     = useState([]);
  const [loading, setLoading]           = useState(true);
  const [error, setError]               = useState(null);
  const [selectedBusiness, setSelected] = useState(null);
  const [total, setTotal]               = useState(0);
  const [page, setPage]                 = useState(1);
  const [filtersOpen, setFiltersOpen]   = useState(false);
  const [popularTags, setPopularTags]   = useState([]);
  const [selectedTag, setSelectedTag]   = useState(searchParams.get('tag') || '');

  const [filters, setFilters] = useState({
    location:     '',
    category:     '',
    search:       '',
    verifiedOnly: false,
  });

  // Fetch popular tags once on mount
  useEffect(() => {
    fetch(`${API_URL}/api/business-tags`)
      .then(r => r.json())
      .then(data => setPopularTags(data.popular || []))
      .catch(() => {});
  }, []);

  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  // Fetch whenever page or filters change
  const fetchBusinesses = useCallback(async (currentPage, currentFilters, currentTag) => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams({
        status: 'published',
        limit:  String(PAGE_SIZE),
        offset: String((currentPage - 1) * PAGE_SIZE),
      });
      if (currentFilters.location)     params.append('location',  currentFilters.location);
      if (currentFilters.category)     params.append('category',  currentFilters.category);
      if (currentFilters.search)       params.append('search',    currentFilters.search);
      if (currentFilters.verifiedOnly) params.append('verified',  '1');
      if (currentTag)                  params.append('tag',       currentTag);

      const res  = await fetch(`${API_URL}/api/businesses?${params}`);
      if (!res.ok) throw new Error('Failed to fetch businesses');
      const data = await res.json();

      setBusinesses(data.data || []);
      setTotal(data.total || 0);
    } catch (err) {
      console.error(err);
      setError('Unable to load businesses. Please try again later.');
    } finally {
      setLoading(false);
    }
  }, []);

  // Reset to page 1 when filters or tag change
  useEffect(() => {
    setPage(1);
    fetchBusinesses(1, filters, selectedTag);
  }, [filters, selectedTag]); // eslint-disable-line react-hooks/exhaustive-deps

  // Fetch when page changes (but not on filter changes — handled above)
  const handlePageChange = (newPage) => {
    setPage(newPage);
    fetchBusinesses(newPage, filters, selectedTag);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const activeFilterCount = [filters.location, filters.category, filters.search, filters.verifiedOnly, selectedTag].filter(Boolean).length;

  const clearFilters = () => { setFilters({ location: '', category: '', search: '', verifiedOnly: false }); setSelectedTag(''); };

  return (
    <div className="min-h-screen bg-gray-50">
      <Helmet>
        {buildPageMeta({
          title: 'Business Directory – Vaal Triangle',
          description: 'Find local businesses, restaurants, services, healthcare, retail and more across Vereeniging, Vanderbijlpark, Meyerton, Sasolburg and the Vaal Triangle.',
          path: '/businesses',
        })}
      </Helmet>

      {/* ── Compact hero + inline search ─────────────────────────────────── */}
      <div className="bg-gradient-to-r from-vaal-orange-500 to-vaal-orange-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
          <h1 className="text-2xl sm:text-3xl font-bold mb-1">Business Directory</h1>
          <p className="text-white/80 text-sm sm:text-base mb-5">
            Local businesses and services across the Vaal Triangle
          </p>

          {/* Search bar — in the hero so users see it immediately */}
          <div className="relative max-w-xl">
            <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              placeholder="Search by name, service, or keyword…"
              value={filters.search}
              onChange={e => setFilters(f => ({ ...f, search: e.target.value }))}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl text-gray-900 text-sm placeholder-gray-400 bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-white/60"
            />
          </div>
        </div>
      </div>

      {/* Sponsor Banner */}
      <SponsorBanner />

      {/* ── Filter bar ───────────────────────────────────────────────────── */}
      <div className="bg-white border-b border-gray-100 sticky top-0 z-10 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          {/* Mobile: single row with filter toggle button */}
          <div className="flex items-center gap-2 py-2.5 lg:hidden">
            <button
              onClick={() => setFiltersOpen(o => !o)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium border transition-colors ${
                filtersOpen || activeFilterCount > 0
                  ? 'bg-vaal-orange-50 border-vaal-orange-300 text-vaal-orange-700'
                  : 'border-gray-200 text-gray-600 hover:bg-gray-50'
              }`}
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2a1 1 0 01-.293.707L13 13.414V19a1 1 0 01-.553.894l-4 2A1 1 0 017 21v-7.586L3.293 6.707A1 1 0 013 6V4z" />
              </svg>
              Filters
              {activeFilterCount > 0 && (
                <span className="flex items-center justify-center w-4 h-4 rounded-full bg-vaal-orange-500 text-white text-xs font-bold">
                  {activeFilterCount}
                </span>
              )}
            </button>

            {/* Verified pill — always visible on mobile */}
            <button
              onClick={() => setFilters(f => ({ ...f, verifiedOnly: !f.verifiedOnly }))}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium border transition-colors ${
                filters.verifiedOnly
                  ? 'bg-blue-50 border-blue-400 text-blue-700'
                  : 'border-gray-200 text-gray-600 hover:bg-gray-50'
              }`}
            >
              <svg className="w-3.5 h-3.5 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              Verified
            </button>

            {activeFilterCount > 0 && (
              <button
                onClick={clearFilters}
                className="ml-auto flex items-center gap-1 text-xs text-gray-400 hover:text-vaal-orange-600 transition-colors"
              >
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
                Clear
              </button>
            )}

            {/* Result count */}
            {!loading && (
              <span className="ml-auto text-xs text-gray-400 whitespace-nowrap">
                {total.toLocaleString()} result{total !== 1 ? 's' : ''}
              </span>
            )}
          </div>

          {/* Mobile: collapsible dropdowns */}
          {filtersOpen && (
            <div className="grid grid-cols-2 gap-2 pb-3 lg:hidden">
              <select
                value={filters.location}
                onChange={e => setFilters(f => ({ ...f, location: e.target.value }))}
                className="px-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-vaal-orange-500 focus:border-vaal-orange-500 bg-white text-gray-700"
              >
                <option value="">All Locations</option>
                {locations.map(l => <option key={l} value={l}>{l}</option>)}
              </select>
              <select
                value={filters.category}
                onChange={e => setFilters(f => ({ ...f, category: e.target.value }))}
                className="px-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-vaal-orange-500 focus:border-vaal-orange-500 bg-white text-gray-700"
              >
                <option value="">All Categories</option>
                {categories.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
          )}

          {/* Desktop: single row */}
          <div className="hidden lg:flex items-center gap-3 py-2.5">
            <select
              value={filters.location}
              onChange={e => setFilters(f => ({ ...f, location: e.target.value }))}
              className="px-3 py-1.5 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-vaal-orange-500 focus:border-vaal-orange-500 bg-white text-gray-700"
            >
              <option value="">All Locations</option>
              {locations.map(l => <option key={l} value={l}>{l}</option>)}
            </select>

            <select
              value={filters.category}
              onChange={e => setFilters(f => ({ ...f, category: e.target.value }))}
              className="px-3 py-1.5 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-vaal-orange-500 focus:border-vaal-orange-500 bg-white text-gray-700"
            >
              <option value="">All Categories</option>
              {categories.map(c => <option key={c} value={c}>{c}</option>)}
            </select>

            <button
              onClick={() => setFilters(f => ({ ...f, verifiedOnly: !f.verifiedOnly }))}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium border transition-colors ${
                filters.verifiedOnly
                  ? 'bg-blue-50 border-blue-400 text-blue-700'
                  : 'border-gray-200 text-gray-600 hover:bg-gray-50'
              }`}
            >
              <svg className="w-3.5 h-3.5 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              Verified only
            </button>

            {activeFilterCount > 0 && (
              <button
                onClick={clearFilters}
                className="flex items-center gap-1 text-sm text-gray-400 hover:text-vaal-orange-600 transition-colors"
              >
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
                Clear filters
              </button>
            )}

            {!loading && (
              <span className="ml-auto text-sm text-gray-400">
                {total.toLocaleString()} business{total !== 1 ? 'es' : ''}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* ── Popular tags ──────────────────────────────────────────────────── */}
      {popularTags.length > 0 && (
        <div className="bg-white border-b border-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2.5">
            <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide">
              <span className="text-xs text-gray-400 font-medium whitespace-nowrap flex-shrink-0">Popular:</span>
              {popularTags.slice(0, 15).map(t => (
                <button
                  key={t.tag}
                  onClick={() => setSelectedTag(prev => prev === t.tag ? '' : t.tag)}
                  className={`whitespace-nowrap px-2.5 py-1 rounded-full text-xs font-medium border transition-colors flex-shrink-0 ${
                    selectedTag === t.tag
                      ? 'bg-vaal-orange-500 text-white border-vaal-orange-500'
                      : 'bg-gray-50 text-gray-600 border-gray-200 hover:bg-vaal-orange-50 hover:border-vaal-orange-300 hover:text-vaal-orange-700'
                  }`}
                >
                  {t.tag} <span className="text-[10px] opacity-70">({t.count})</span>
                </button>
              ))}
              {selectedTag && (
                <button
                  onClick={() => setSelectedTag('')}
                  className="whitespace-nowrap text-xs text-gray-400 hover:text-vaal-orange-600 underline flex-shrink-0"
                >
                  clear
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ── Main content ─────────────────────────────────────────────────── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">

        {/* Add Your Business — slim inline banner */}
        <div className="flex items-center justify-between gap-3 bg-vaal-orange-50 border border-vaal-orange-200 rounded-xl px-4 py-3 mb-6">
          <p className="text-sm text-vaal-orange-800 font-medium">
            Can't find your business?{' '}
            <span className="text-vaal-orange-600 font-normal">Get listed for free.</span>
          </p>
          <Link
            to="/add-business"
            className="flex-shrink-0 text-sm font-semibold text-vaal-orange-600 hover:text-vaal-orange-700 underline underline-offset-2 transition-colors"
          >
            Add yours →
          </Link>
        </div>

        {/* Loading */}
        {loading && (
          <div className="text-center py-16">
            <div className="inline-block animate-spin rounded-full h-10 w-10 border-b-2 border-vaal-orange-500" />
            <p className="mt-3 text-gray-500 text-sm">Loading businesses…</p>
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
            <h3 className="text-base font-semibold text-gray-700">No businesses found</h3>
            <p className="mt-1 text-sm text-gray-400">Try adjusting your filters.</p>
            {activeFilterCount > 0 && (
              <button onClick={clearFilters} className="mt-3 text-sm text-vaal-orange-500 hover:text-vaal-orange-600 font-medium underline underline-offset-2">
                Clear all filters
              </button>
            )}
          </div>
        )}

        {/* Grid */}
        {!loading && !error && businesses.length > 0 && (
          <>
            {/* Page info */}
            <p className="text-xs text-gray-400 mb-4">
              Showing {((page - 1) * PAGE_SIZE) + 1}–{Math.min(page * PAGE_SIZE, total)} of {total.toLocaleString()} businesses
              {totalPages > 1 && <> · page {page} of {totalPages}</>}
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {businesses.map(biz => (
                <BusinessCard key={biz.business_id} biz={biz} onQuickView={setSelected} />
              ))}
            </div>

            <Pagination page={page} totalPages={totalPages} onChange={handlePageChange} />
          </>
        )}
      </div>

      {/* Newsletter */}
      <NewsletterSignupBar />

      {/* Quick-view modal */}
      {selectedBusiness && (
        <BusinessModal biz={selectedBusiness} onClose={() => setSelected(null)} />
      )}
    </div>
  );
}

// ── Business card ─────────────────────────────────────────────────────────────

function BusinessCard({ biz, onQuickView }) {
  return (
    <div
      onClick={() => onQuickView(biz)}
      className="bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 overflow-hidden cursor-pointer flex flex-col"
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
            <VerifiedBadge small />
          </div>
        )}
      </div>

      {/* Details */}
      <div className="p-4 flex flex-col flex-1">
        {/* Pills */}
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
          {biz.tags && biz.tags.split(',').slice(0, 3).map(tag => (
            <span key={tag} className="text-[10px] px-1.5 py-0.5 bg-gray-50 text-gray-400 rounded-full">
              {tag.trim()}
            </span>
          ))}
        </div>

        {/* Name */}
        <h3 className="text-sm font-bold text-gray-900 line-clamp-2 mb-1 hover:text-vaal-orange-600 transition-colors leading-snug">
          {biz.business_name}
        </h3>

        {/* Rating */}
        {biz.google_rating > 0 && (
          <div className="mb-2">
            <StarRow rating={biz.google_rating} count={biz.google_review_count} />
          </div>
        )}

        {/* Description */}
        {biz.description && (
          <p className="text-xs text-gray-500 line-clamp-2 flex-1">{biz.description}</p>
        )}

        {/* Quick contact */}
        {biz.phone && (
          <div className="flex items-center gap-1.5 mt-2 text-xs text-gray-500">
            <svg className="w-3.5 h-3.5 text-vaal-orange-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
            </svg>
            <span className="truncate">{biz.phone}</span>
          </div>
        )}

        {/* Buttons */}
        <div className="mt-3 flex gap-2">
          <button className="flex-1 py-1.5 bg-vaal-orange-500 hover:bg-vaal-orange-600 text-white text-xs font-semibold rounded-lg transition-colors">
            Quick View
          </button>
          <Link
            to={`/businesses/${biz.business_id}`}
            onClick={e => e.stopPropagation()}
            title="Full page"
            className="flex items-center justify-center w-8 h-8 border border-vaal-orange-300 text-vaal-orange-600 hover:bg-vaal-orange-50 rounded-lg transition-colors flex-shrink-0"
          >
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
          </Link>
        </div>
      </div>
    </div>
  );
}

// ── Quick-view modal ──────────────────────────────────────────────────────────

function BusinessModal({ biz, onClose }) {
  return (
    <Modal isOpen onClose={onClose} title={biz.business_name}>
      <div className="space-y-5">

        {/* Logo */}
        {biz.logo_url && (
          <div className="relative w-full h-48 rounded-xl overflow-hidden bg-gray-100">
            <img src={biz.logo_url} aria-hidden="true"
              className="absolute inset-0 w-full h-full object-cover scale-125 blur-lg opacity-50"
              onError={e => { e.target.style.display = 'none'; }} />
            <img src={biz.logo_url} alt={biz.business_name}
              className="relative z-10 w-full h-full object-contain mix-blend-multiply"
              onError={e => { e.target.style.display = 'none'; e.target.previousSibling.style.display = 'none'; }} />
          </div>
        )}

        {/* Tags */}
        <div className="flex flex-wrap gap-2">
          {biz.category && <span className="px-3 py-1 bg-vaal-orange-100 text-vaal-orange-700 text-xs font-medium rounded-full">{biz.category}</span>}
          {biz.location && <span className="px-3 py-1 bg-gray-100 text-gray-700 text-xs font-medium rounded-full">📍 {biz.location}</span>}
          {biz.is_verified === 1 && <VerifiedBadge />}
        </div>

        {/* Rating */}
        {biz.google_rating > 0 && (
          <div className="flex items-center gap-3 bg-yellow-50 border border-yellow-100 rounded-xl px-4 py-3">
            <StarRow rating={biz.google_rating} count={biz.google_review_count} />
            {biz.google_review_count > 0 && (
              <span className="text-xs text-gray-500 ml-1">Google reviews</span>
            )}
          </div>
        )}

        {/* Description */}
        {biz.description && (
          <div>
            <h4 className="text-sm font-semibold text-gray-900 mb-1.5">About</h4>
            <p className="text-sm text-gray-600 leading-relaxed whitespace-pre-line">{biz.description}</p>
          </div>
        )}

        {/* Contact */}
        <div className="bg-gray-50 rounded-xl p-4 space-y-3">
          <h4 className="text-sm font-semibold text-gray-900">Contact</h4>
          {biz.phone && (
            <div className="flex items-start gap-3">
              <svg className="w-4 h-4 text-vaal-orange-500 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
              <a href={`tel:${biz.phone}`} className="text-sm text-vaal-orange-600 hover:underline">{biz.phone}</a>
            </div>
          )}
          {biz.email && (
            <div className="flex items-start gap-3">
              <svg className="w-4 h-4 text-vaal-orange-500 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              <a href={`mailto:${biz.email}`} className="text-sm text-vaal-orange-600 hover:underline break-all">{biz.email}</a>
            </div>
          )}
          {biz.address && (
            <div className="flex items-start gap-3">
              <svg className="w-4 h-4 text-vaal-orange-500 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <span className="text-sm text-gray-600">{biz.address}</span>
            </div>
          )}
          {(biz.google_opening_hours || biz.operating_hours) && (
            <div className="flex items-start gap-3">
              <svg className="w-4 h-4 text-vaal-orange-500 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div className="text-sm text-gray-600">
                {biz.google_opening_hours
                  ? biz.google_opening_hours.split(' | ').map((l, i) => <p key={i}>{l}</p>)
                  : <p>{biz.operating_hours}</p>}
                {biz.google_opening_hours && <span className="text-xs text-green-600 font-medium">✓ Google verified</span>}
              </div>
            </div>
          )}
        </div>

        {/* Social / website */}
        {(biz.website || biz.facebook || biz.instagram) && (
          <div className="flex flex-wrap gap-2">
            {biz.website && (
              <a href={biz.website} target="_blank" rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-vaal-orange-500 hover:bg-vaal-orange-600 text-white text-xs font-semibold rounded-lg transition-colors">
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                </svg>
                Website
              </a>
            )}
            {biz.facebook && (
              <a href={biz.facebook} target="_blank" rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-lg transition-colors">
                <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
                Facebook
              </a>
            )}
            {biz.instagram && (
              <a href={biz.instagram} target="_blank" rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-pink-600 hover:bg-pink-700 text-white text-xs font-semibold rounded-lg transition-colors">
                <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                </svg>
                Instagram
              </a>
            )}
          </div>
        )}

        {/* Claim / verified */}
        <div className="border-t border-gray-100 pt-4 flex items-center justify-between gap-4">
          {biz.is_verified === 1 ? (
            <p className="text-xs text-green-600 font-medium flex items-center gap-1">
              <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              Verified owner
            </p>
          ) : (
            <p className="text-xs text-gray-400">
              Is this your business?{' '}
              <a href={`/claim-business?id=${biz.business_id}&name=${encodeURIComponent(biz.business_name)}`}
                className="text-vaal-orange-500 hover:text-vaal-orange-600 font-semibold underline underline-offset-2">
                Claim it →
              </a>
            </p>
          )}

          <Link
            to={`/businesses/${biz.business_id}`}
            className="flex items-center gap-1 text-xs text-gray-400 hover:text-vaal-orange-600 transition-colors flex-shrink-0"
          >
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
            Full page
          </Link>
        </div>
      </div>
    </Modal>
  );
}
