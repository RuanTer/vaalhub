import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { buildPageMeta, buildItemListMeta } from '../hooks/useSEO';
import SponsorBanner from '../components/ui/SponsorBanner';
import NewsletterSignupBar from '../components/ui/NewsletterSignupBar';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
const PAGE_SIZE = 20;

const areas      = ['Vereeniging', 'Vanderbijlpark', 'Meyerton', 'Sasolburg', 'Sharpeville', 'Vaal Triangle'];
const categories = ['Local News', 'Business', 'Crime', 'Development', 'Politics', 'Community'];

// ── helpers ───────────────────────────────────────────────────────────────────

function formatDate(dateString) {
  if (!dateString) return '';
  return new Date(dateString).toLocaleDateString('en-ZA', {
    year: 'numeric', month: 'long', day: 'numeric',
  });
}

function timeAgo(dateString) {
  if (!dateString) return '';
  const diff = Date.now() - new Date(dateString).getTime();
  const days  = Math.floor(diff / 86_400_000);
  if (days === 0) return 'Today';
  if (days === 1) return 'Yesterday';
  if (days <  7)  return `${days} days ago`;
  return formatDate(dateString);
}

// ── Pagination ────────────────────────────────────────────────────────────────

function Pagination({ page, totalPages, onChange }) {
  if (totalPages <= 1) return null;
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
      <button onClick={() => onChange(page - 1)} disabled={page === 1}
        className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-sm font-medium border border-gray-200 text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors">
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
        </svg>
        Prev
      </button>
      {items.map((item, i) =>
        item === '…' ? (
          <span key={`e${i}`} className="px-2 py-1.5 text-gray-400 text-sm select-none">…</span>
        ) : (
          <button key={item} onClick={() => onChange(item)}
            className={`min-w-[36px] px-2 py-1.5 rounded-lg text-sm font-medium transition-colors border ${
              item === page ? 'bg-vaal-orange-500 text-white border-vaal-orange-500' : 'border-gray-200 text-gray-700 hover:bg-gray-50'
            }`}>
            {item}
          </button>
        )
      )}
      <button onClick={() => onChange(page + 1)} disabled={page === totalPages}
        className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-sm font-medium border border-gray-200 text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors">
        Next
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
        </svg>
      </button>
    </div>
  );
}

// ── Main component ────────────────────────────────────────────────────────────

export default function News() {
  const [news, setNews]               = useState([]);
  const [loading, setLoading]         = useState(true);
  const [error, setError]             = useState(null);
  const [total, setTotal]             = useState(0);
  const [page, setPage]               = useState(1);
  const [filtersOpen, setFiltersOpen] = useState(false);

  const [filters, setFilters] = useState({
    search:   '',
    area:     '',
    category: '',
  });

  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const activeFilterCount = [filters.area, filters.category, filters.search].filter(Boolean).length;
  const clearFilters = () => setFilters({ search: '', area: '', category: '' });

  const fetchNews = useCallback(async (currentPage, currentFilters) => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams({
        status: 'published',
        limit:  String(PAGE_SIZE),
        offset: String((currentPage - 1) * PAGE_SIZE),
      });
      if (currentFilters.area)     params.append('area',     currentFilters.area);
      if (currentFilters.category) params.append('category', currentFilters.category);
      if (currentFilters.search)   params.append('search',   currentFilters.search);

      const res = await fetch(`${API_URL}/api/news?${params}`);
      if (!res.ok) throw new Error('Failed to fetch news');
      const data = await res.json();

      setNews(data.data || []);
      setTotal(data.total || 0);
    } catch (err) {
      console.error(err);
      setError('Unable to load news. Please try again later.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    setPage(1);
    fetchNews(1, filters);
  }, [filters]); // eslint-disable-line react-hooks/exhaustive-deps

  const handlePageChange = (p) => {
    setPage(p);
    fetchNews(p, filters);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Helmet>
        {buildPageMeta({
          title: 'Latest News',
          description: `Stay up to date with the latest local news from Vereeniging, Vanderbijlpark, Meyerton, Sharpeville, Sasolburg and across the Vaal Triangle.`,
          path: '/news',
          keywords: 'Vaal Triangle news, Vereeniging news, Vanderbijlpark news, Meyerton news, Sasolburg news, Sharpeville news, local news South Africa, VaalHub',
        })}
        {buildItemListMeta(news, 'Latest News – Vaal Triangle', '/news')}
      </Helmet>

      {/* ── Compact hero + search ─────────────────────────────────────────── */}
      <div className="bg-gradient-to-r from-vaal-orange-500 to-vaal-orange-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
          <h1 className="text-2xl sm:text-3xl font-bold mb-1">Latest News</h1>
          <p className="text-white/80 text-sm sm:text-base mb-5">
            Local news from across the Vaal Triangle
          </p>
          <div className="relative max-w-xl">
            <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              placeholder="Search articles…"
              value={filters.search}
              onChange={e => setFilters(f => ({ ...f, search: e.target.value }))}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl text-gray-900 text-sm placeholder-gray-400 bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-white/60"
            />
          </div>
        </div>
      </div>

      {/* Sponsor Banner */}
      <SponsorBanner />

      {/* ── Sticky filter bar ────────────────────────────────────────────── */}
      <div className="bg-white border-b border-gray-100 sticky top-0 z-10 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          {/* Mobile row */}
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
                <span className="flex items-center justify-center w-4 h-4 rounded-full bg-vaal-orange-500 text-white text-xs font-bold">{activeFilterCount}</span>
              )}
            </button>

            {activeFilterCount > 0 && (
              <button onClick={clearFilters} className="flex items-center gap-1 text-xs text-gray-400 hover:text-vaal-orange-600 transition-colors">
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
                Clear
              </button>
            )}

            {!loading && (
              <span className="ml-auto text-xs text-gray-400 whitespace-nowrap">
                {total.toLocaleString()} article{total !== 1 ? 's' : ''}
              </span>
            )}
          </div>

          {/* Mobile: collapsible dropdowns */}
          {filtersOpen && (
            <div className="grid grid-cols-2 gap-2 pb-3 lg:hidden">
              <select value={filters.area} onChange={e => setFilters(f => ({ ...f, area: e.target.value }))}
                className="px-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-vaal-orange-500 bg-white text-gray-700">
                <option value="">All Areas</option>
                {areas.map(a => <option key={a} value={a}>{a}</option>)}
              </select>
              <select value={filters.category} onChange={e => setFilters(f => ({ ...f, category: e.target.value }))}
                className="px-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-vaal-orange-500 bg-white text-gray-700">
                <option value="">All Categories</option>
                {categories.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
          )}

          {/* Desktop row */}
          <div className="hidden lg:flex items-center gap-3 py-2.5">
            <select value={filters.area} onChange={e => setFilters(f => ({ ...f, area: e.target.value }))}
              className="px-3 py-1.5 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-vaal-orange-500 bg-white text-gray-700">
              <option value="">All Areas</option>
              {areas.map(a => <option key={a} value={a}>{a}</option>)}
            </select>
            <select value={filters.category} onChange={e => setFilters(f => ({ ...f, category: e.target.value }))}
              className="px-3 py-1.5 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-vaal-orange-500 bg-white text-gray-700">
              <option value="">All Categories</option>
              {categories.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
            {activeFilterCount > 0 && (
              <button onClick={clearFilters} className="flex items-center gap-1 text-sm text-gray-400 hover:text-vaal-orange-600 transition-colors">
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
                Clear filters
              </button>
            )}
            {!loading && (
              <span className="ml-auto text-sm text-gray-400">
                {total.toLocaleString()} article{total !== 1 ? 's' : ''}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* ── Main content ─────────────────────────────────────────────────── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">

        {/* Loading */}
        {loading && (
          <div className="text-center py-16">
            <div className="inline-block animate-spin rounded-full h-10 w-10 border-b-2 border-vaal-orange-500" />
            <p className="mt-3 text-gray-500 text-sm">Loading articles…</p>
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
        {!loading && !error && news.length === 0 && (
          <div className="text-center py-16 bg-white rounded-xl border border-gray-100">
            <svg className="mx-auto h-10 w-10 text-gray-300 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
            </svg>
            <h3 className="text-base font-semibold text-gray-700">No articles found</h3>
            <p className="mt-1 text-sm text-gray-400">Try adjusting your filters or check back soon.</p>
            {activeFilterCount > 0 && (
              <button onClick={clearFilters} className="mt-3 text-sm text-vaal-orange-500 hover:text-vaal-orange-600 font-medium underline underline-offset-2">
                Clear filters
              </button>
            )}
          </div>
        )}

        {/* Grid */}
        {!loading && !error && news.length > 0 && (
          <>
            <p className="text-xs text-gray-400 mb-4">
              Showing {((page - 1) * PAGE_SIZE) + 1}–{Math.min(page * PAGE_SIZE, total)} of {total.toLocaleString()} articles
              {totalPages > 1 && <> · page {page} of {totalPages}</>}
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {news.map(article => (
                <ArticleCard key={article.slug || article.news_id} article={article} />
              ))}
            </div>

            <Pagination page={page} totalPages={totalPages} onChange={handlePageChange} />
          </>
        )}
      </div>

      {/* Newsletter */}
      <NewsletterSignupBar />
    </div>
  );
}

// ── Article card ──────────────────────────────────────────────────────────────

function ArticleCard({ article }) {
  return (
    <article className="bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 overflow-hidden flex flex-col">
      {/* Thumbnail */}
      <div className="relative h-40 bg-gray-100 overflow-hidden flex-shrink-0">
        <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200">
          <svg className="w-10 h-10 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
          </svg>
        </div>
        {article.image_url && (
          <img src={article.image_url} alt={article.headline}
            className="absolute inset-0 w-full h-full object-cover hover:scale-105 transition-transform duration-300"
            onError={e => { e.target.style.display = 'none'; }} />
        )}
      </div>

      {/* Content */}
      <div className="p-4 flex flex-col flex-1">
        {/* Pills */}
        <div className="flex flex-wrap gap-1.5 mb-2">
          {article.category && (
            <span className="text-xs px-2 py-0.5 bg-vaal-orange-50 text-vaal-orange-700 rounded-full font-medium">{article.category}</span>
          )}
          {article.area && (
            <span className="text-xs px-2 py-0.5 bg-gray-100 text-gray-600 rounded-full">{article.area}</span>
          )}
        </div>

        {/* Headline */}
        <h2 className="text-sm font-bold text-gray-900 line-clamp-2 mb-1.5 leading-snug hover:text-vaal-orange-600 transition-colors">
          {article.headline}
        </h2>

        {/* Summary */}
        {article.summary && (
          <p className="text-xs text-gray-500 line-clamp-2 flex-1 leading-relaxed">{article.summary}</p>
        )}

        {/* Meta row */}
        <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-50">
          <span className="text-xs text-gray-400">{timeAgo(article.publish_date)}</span>
          {article.source_name && (
            <span className="text-xs text-gray-400 truncate max-w-[120px]">{article.source_name}</span>
          )}
        </div>

        {/* Read more */}
        <Link
          to={`/news/${article.slug || article.news_id}`}
          className="mt-3 w-full py-1.5 bg-vaal-orange-500 hover:bg-vaal-orange-600 text-white text-xs font-semibold rounded-lg transition-colors text-center block"
        >
          Read Article
        </Link>
      </div>
    </article>
  );
}
