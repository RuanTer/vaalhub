import { useState, useEffect, useCallback } from 'react';
import { Helmet } from 'react-helmet-async';
import { buildPageMeta, buildItemListMeta } from '../hooks/useSEO';
import Modal from '../components/ui/Modal';
import SponsorBanner from '../components/ui/SponsorBanner';
import NewsletterSignupBar from '../components/ui/NewsletterSignupBar';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
const PAGE_SIZE = 20;

const locations  = ['Vereeniging', 'Vanderbijlpark', 'Meyerton', 'Sasolburg', 'Sharpeville'];
const categories = ['Music', 'Sports', 'Markets', 'Food & Drink', 'Arts & Culture', 'Family', 'Business', 'Community', 'Other'];

// ── date helpers ──────────────────────────────────────────────────────────────

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

export default function Events() {
  const [events, setEvents]           = useState([]);
  const [loading, setLoading]         = useState(true);
  const [error, setError]             = useState(null);
  const [selectedEvent, setSelected]  = useState(null);
  const [total, setTotal]             = useState(0);
  const [page, setPage]               = useState(1);
  const [filtersOpen, setFiltersOpen] = useState(false);

  const [filters, setFilters] = useState({
    search:   '',
    location: '',
    category: '',
    upcoming: true,
  });

  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const activeFilterCount = [filters.location, filters.category, filters.search].filter(Boolean).length
    + (filters.upcoming ? 0 : 0); // upcoming is a separate toggle, not counted

  const clearFilters = () => setFilters(f => ({ ...f, location: '', category: '', search: '' }));

  const fetchEvents = useCallback(async (currentPage, currentFilters) => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams({
        status:   'published',
        limit:    String(PAGE_SIZE),
        offset:   String((currentPage - 1) * PAGE_SIZE),
        upcoming: currentFilters.upcoming.toString(),
      });
      if (currentFilters.location) params.append('location', currentFilters.location);
      if (currentFilters.category) params.append('category', currentFilters.category);
      if (currentFilters.search)   params.append('search',   currentFilters.search);

      const res = await fetch(`${API_URL}/api/events?${params}`);
      if (!res.ok) throw new Error('Failed to fetch events');
      const data = await res.json();

      setEvents(data.data || []);
      // API may not return total for events — fall back to length-based
      setTotal(data.total ?? (data.data?.length ?? 0));
    } catch (err) {
      console.error(err);
      setError('Unable to load events. Please try again later.');
    } finally {
      setLoading(false);
    }
  }, []);

  // Reset to page 1 on filter change
  useEffect(() => {
    setPage(1);
    fetchEvents(1, filters);
  }, [filters]); // eslint-disable-line react-hooks/exhaustive-deps

  const handlePageChange = (p) => {
    setPage(p);
    fetchEvents(p, filters);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Helmet>
        {buildPageMeta({
          title: 'Events in the Vaal Triangle',
          description: `Discover upcoming events, markets, festivals, sports, arts, and community gatherings across Vereeniging, Vanderbijlpark, Meyerton, Sasolburg and the Vaal Triangle.`,
          path: '/events',
          keywords: 'Vaal Triangle events, Vereeniging events, Vanderbijlpark events, Meyerton events, things to do Vaal, community events South Africa, VaalHub',
        })}
        {buildItemListMeta(events, 'Upcoming Events – Vaal Triangle', '/events')}
      </Helmet>

      {/* ── Compact hero + search ─────────────────────────────────────────── */}
      <div className="bg-gradient-to-r from-vaal-orange-500 to-vaal-orange-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
          <h1 className="text-2xl sm:text-3xl font-bold mb-1">Vaal Triangle Events</h1>
          <p className="text-white/80 text-sm sm:text-base mb-5">
            Upcoming events, festivals, and activities in your area
          </p>
          <div className="relative max-w-xl">
            <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              placeholder="Search events…"
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

            {/* Upcoming toggle — always visible */}
            <button
              onClick={() => setFilters(f => ({ ...f, upcoming: !f.upcoming }))}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium border transition-colors ${
                filters.upcoming
                  ? 'bg-green-50 border-green-400 text-green-700'
                  : 'border-gray-200 text-gray-600 hover:bg-gray-50'
              }`}
            >
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              Upcoming
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
                {total.toLocaleString()} event{total !== 1 ? 's' : ''}
              </span>
            )}
          </div>

          {/* Mobile: collapsible dropdowns */}
          {filtersOpen && (
            <div className="grid grid-cols-2 gap-2 pb-3 lg:hidden">
              <select value={filters.location} onChange={e => setFilters(f => ({ ...f, location: e.target.value }))}
                className="px-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-vaal-orange-500 bg-white text-gray-700">
                <option value="">All Locations</option>
                {locations.map(l => <option key={l} value={l}>{l}</option>)}
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
            <select value={filters.location} onChange={e => setFilters(f => ({ ...f, location: e.target.value }))}
              className="px-3 py-1.5 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-vaal-orange-500 bg-white text-gray-700">
              <option value="">All Locations</option>
              {locations.map(l => <option key={l} value={l}>{l}</option>)}
            </select>
            <select value={filters.category} onChange={e => setFilters(f => ({ ...f, category: e.target.value }))}
              className="px-3 py-1.5 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-vaal-orange-500 bg-white text-gray-700">
              <option value="">All Categories</option>
              {categories.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
            <button
              onClick={() => setFilters(f => ({ ...f, upcoming: !f.upcoming }))}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium border transition-colors ${
                filters.upcoming
                  ? 'bg-green-50 border-green-400 text-green-700'
                  : 'border-gray-200 text-gray-600 hover:bg-gray-50'
              }`}
            >
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              Upcoming only
            </button>
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
                {total.toLocaleString()} event{total !== 1 ? 's' : ''}
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
            <p className="mt-3 text-gray-500 text-sm">Loading events…</p>
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
        {!loading && !error && events.length === 0 && (
          <div className="text-center py-16 bg-white rounded-xl border border-gray-100">
            <svg className="mx-auto h-10 w-10 text-gray-300 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <h3 className="text-base font-semibold text-gray-700">No events found</h3>
            <p className="mt-1 text-sm text-gray-400">Try adjusting your filters or check back soon.</p>
            {(activeFilterCount > 0 || !filters.upcoming) && (
              <button onClick={clearFilters} className="mt-3 text-sm text-vaal-orange-500 hover:text-vaal-orange-600 font-medium underline underline-offset-2">
                Clear filters
              </button>
            )}
          </div>
        )}

        {/* Grid */}
        {!loading && !error && events.length > 0 && (
          <>
            <p className="text-xs text-gray-400 mb-4">
              Showing {((page - 1) * PAGE_SIZE) + 1}–{Math.min(page * PAGE_SIZE, total || events.length)} events
              {totalPages > 1 && <> · page {page} of {totalPages}</>}
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {events.map(event => (
                <EventCard key={event.event_id} event={event} onOpen={setSelected} />
              ))}
            </div>

            <Pagination page={page} totalPages={totalPages} onChange={handlePageChange} />
          </>
        )}
      </div>

      {/* Newsletter */}
      <NewsletterSignupBar />

      {/* Modal */}
      {selectedEvent && <EventModal event={selectedEvent} onClose={() => setSelected(null)} />}
    </div>
  );
}

// ── Event card ────────────────────────────────────────────────────────────────

function EventCard({ event, onOpen }) {
  const sd = shortDate(event.date_start);
  return (
    <div
      onClick={() => onOpen(event)}
      className="bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 overflow-hidden cursor-pointer flex flex-col"
    >
      {/* Image */}
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

        {/* Date badge */}
        <div className="absolute top-2.5 left-2.5 bg-vaal-orange-500 text-white px-3 py-1.5 rounded-lg shadow text-center min-w-[44px]">
          <div className="text-lg font-bold leading-none">{sd.day}</div>
          <div className="text-xs font-semibold leading-tight">{sd.month}</div>
        </div>

        {/* Pinned badge */}
        {event.pinned === 1 && (
          <div className="absolute top-2.5 right-2.5 bg-yellow-400 text-yellow-900 px-2 py-0.5 rounded-full text-xs font-bold shadow">
            Popular
          </div>
        )}
      </div>

      {/* Details */}
      <div className="p-4 flex flex-col flex-1">
        {/* Pills */}
        <div className="flex flex-wrap gap-1.5 mb-2">
          {event.category && (
            <span className="text-xs px-2 py-0.5 bg-vaal-orange-50 text-vaal-orange-700 rounded-full font-medium">{event.category}</span>
          )}
          {event.location && (
            <span className="text-xs px-2 py-0.5 bg-gray-100 text-gray-600 rounded-full">{event.location}</span>
          )}
        </div>

        {/* Title */}
        <h3 className="text-sm font-bold text-gray-900 line-clamp-2 mb-1.5 leading-snug hover:text-vaal-orange-600 transition-colors">
          {event.title}
        </h3>

        {/* Date line */}
        <div className="flex items-center gap-1.5 text-xs text-gray-500 mb-2">
          <svg className="w-3.5 h-3.5 flex-shrink-0 text-vaal-orange-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <span className="line-clamp-1">{formatDate(event.date_start)}</span>
        </div>

        {/* Description */}
        {event.description && (
          <p className="text-xs text-gray-500 line-clamp-2 flex-1">{event.description}</p>
        )}

        {/* Button */}
        <button className="mt-3 w-full py-1.5 bg-vaal-orange-500 hover:bg-vaal-orange-600 text-white text-xs font-semibold rounded-lg transition-colors">
          View Details
        </button>
      </div>
    </div>
  );
}

// ── Event modal ───────────────────────────────────────────────────────────────

function EventModal({ event, onClose }) {
  return (
    <Modal isOpen onClose={onClose} title={event.title}>
      <div className="space-y-5">

        {/* Image */}
        {event.image_url && !event.image_url.includes('data:image') && (
          <div className="w-full rounded-xl overflow-hidden bg-gray-100">
            <img src={event.image_url} alt={event.title}
              className="w-full h-auto object-contain max-h-[400px]"
              onError={e => { e.target.style.display = 'none'; }} />
          </div>
        )}

        {/* Tags */}
        <div className="flex flex-wrap gap-2">
          {event.category && (
            <span className="px-3 py-1 bg-vaal-orange-100 text-vaal-orange-700 text-xs font-medium rounded-full">{event.category}</span>
          )}
          {event.location && (
            <span className="px-3 py-1 bg-gray-100 text-gray-700 text-xs font-medium rounded-full">📍 {event.location}</span>
          )}
        </div>

        {/* When */}
        <div className="bg-gray-50 rounded-xl p-4">
          <h4 className="text-sm font-semibold text-gray-900 mb-2 flex items-center gap-2">
            <svg className="w-4 h-4 text-vaal-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            When
          </h4>
          <p className="text-sm text-gray-700">
            {formatDate(event.date_start)}
            {event.date_end && event.date_end !== event.date_start && (
              <span> – {formatDate(event.date_end)}</span>
            )}
          </p>
          {event.time && <p className="text-sm text-gray-600 mt-0.5">🕐 {event.time}</p>}
        </div>

        {/* Description */}
        {event.description && (
          <div>
            <h4 className="text-sm font-semibold text-gray-900 mb-1.5">About This Event</h4>
            <p className="text-sm text-gray-600 leading-relaxed whitespace-pre-line">{event.description}</p>
          </div>
        )}

        {/* Organizer */}
        {event.organizer && (
          <div className="bg-gray-50 rounded-xl p-4">
            <h4 className="text-sm font-semibold text-gray-900 mb-1">Organizer</h4>
            <p className="text-sm text-gray-600">{event.organizer}</p>
          </div>
        )}

        {/* Contact */}
        {event.contact_info && (
          <div className="bg-gray-50 rounded-xl p-4">
            <h4 className="text-sm font-semibold text-gray-900 mb-1">Contact</h4>
            <p className="text-sm text-gray-600">{event.contact_info}</p>
          </div>
        )}

        {/* Price */}
        {event.price && (
          <div className="bg-vaal-orange-50 border border-vaal-orange-200 rounded-xl p-4">
            <h4 className="text-sm font-semibold text-gray-900 mb-1">Admission</h4>
            <p className="text-sm font-medium text-gray-700">{event.price}</p>
          </div>
        )}

        {/* Source */}
        {event.source_url && (
          <div className="pt-4 border-t border-gray-100">
            <a href={event.source_url} target="_blank" rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-vaal-orange-600 transition-colors underline underline-offset-2">
              More information →
            </a>
          </div>
        )}
      </div>
    </Modal>
  );
}
