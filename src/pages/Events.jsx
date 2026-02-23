import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { buildPageMeta } from '../hooks/useSEO';
import Modal from '../components/ui/Modal';
import SponsorBanner from '../components/ui/SponsorBanner';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export default function Events() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [filters, setFilters] = useState({
    location: '',
    category: '',
    upcoming: false,
  });

  const locations = ['Vereeniging', 'Vanderbijlpark', 'Meyerton', 'Sasolburg', 'Sharpeville'];
  const categories = ['Music', 'Sports', 'Markets', 'Food & Drink', 'Arts & Culture', 'Family', 'Business', 'Community', 'Other'];

  useEffect(() => {
    fetchEvents();
  }, [filters]);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        status: 'published',
        limit: '100',
        upcoming: filters.upcoming.toString(),
      });

      if (filters.location) {
        params.append('location', filters.location);
      }

      if (filters.category) {
        params.append('category', filters.category);
      }

      const response = await fetch(`${API_URL}/api/events?${params}`);

      if (!response.ok) {
        throw new Error('Failed to fetch events');
      }

      const data = await response.json();

      // API now handles sorting (pinned first, then chronological, undated last)
      setEvents(data.data || []);
      setError(null);
    } catch (err) {
      console.error('Error fetching events:', err);
      setError('Unable to load events. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Date TBA';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-ZA', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const formatShortDate = (dateString) => {
    if (!dateString) return { month: 'TBA', day: '?' };
    const date = new Date(dateString);
    return {
      month: date.toLocaleDateString('en-US', { month: 'short' }).toUpperCase(),
      day: date.getDate(),
    };
  };

  const openEventModal = (event) => {
    setSelectedEvent(event);
  };

  const closeEventModal = () => {
    setSelectedEvent(null);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Helmet>
        {buildPageMeta({
          title: 'Events in the Vaal Triangle',
          description: 'Discover upcoming events, markets, festivals, sports, arts, and community gatherings across Vereeniging, Vanderbijlpark, Meyerton, Sasolburg and the Vaal Triangle.',
          path: '/events',
        })}
      </Helmet>

      {/* Hero Section */}
      <div className="bg-gradient-to-r from-vaal-orange-500 to-vaal-orange-600 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Vaal Triangle Events</h1>
          <p className="text-xl text-white/90">
            Discover upcoming events, festivals, and activities in your area
          </p>
        </div>
      </div>

      {/* Sponsor Banner */}
      <SponsorBanner />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Filters */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <h2 className="text-lg font-semibold mb-4">Filter Events</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Location Filter */}
            <div>
              <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-2">
                Location
              </label>
              <select
                id="location"
                value={filters.location}
                onChange={(e) => setFilters({ ...filters, location: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-vaal-orange-500 focus:border-vaal-orange-500"
              >
                <option value="">All Locations</option>
                {locations.map((location) => (
                  <option key={location} value={location}>
                    {location}
                  </option>
                ))}
              </select>
            </div>

            {/* Category Filter */}
            <div>
              <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
                Category
              </label>
              <select
                id="category"
                value={filters.category}
                onChange={(e) => setFilters({ ...filters, category: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-vaal-orange-500 focus:border-vaal-orange-500"
              >
                <option value="">All Categories</option>
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>

            {/* Upcoming Toggle */}
            <div>
              <label htmlFor="upcoming" className="block text-sm font-medium text-gray-700 mb-2">
                Show
              </label>
              <select
                id="upcoming"
                value={filters.upcoming ? 'upcoming' : 'all'}
                onChange={(e) => setFilters({ ...filters, upcoming: e.target.value === 'upcoming' })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-vaal-orange-500 focus:border-vaal-orange-500"
              >
                <option value="upcoming">Upcoming Events Only</option>
                <option value="all">All Events</option>
              </select>
            </div>
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-vaal-orange-500"></div>
            <p className="mt-4 text-gray-600">Loading events...</p>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-lg">
            <p className="font-semibold">Error</p>
            <p>{error}</p>
          </div>
        )}

        {/* No Results */}
        {!loading && !error && events.length === 0 && (
          <div className="text-center py-12 bg-white rounded-lg shadow-sm">
            <svg
              className="mx-auto h-12 w-12 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
            <h3 className="mt-2 text-lg font-medium text-gray-900">No events found</h3>
            <p className="mt-1 text-gray-500">Try adjusting your filters or check back later for new events.</p>
          </div>
        )}

        {/* Events Grid - 3 Column Tile Layout */}
        {!loading && !error && events.length > 0 && (
          <>
            <div className="mb-6">
              <p className="text-gray-600">
                Showing <span className="font-semibold">{events.length}</span> event{events.length !== 1 ? 's' : ''}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {events.map((event) => {
                const shortDate = formatShortDate(event.date_start);
                return (
                  <div
                    key={event.event_id}
                    onClick={() => openEventModal(event)}
                    className="bg-white rounded-lg shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden cursor-pointer transform hover:-translate-y-1 flex flex-col"
                  >
                    {/* Event Image */}
                    <div className="relative h-48 bg-gray-200 overflow-hidden">
                      {event.image_url && !event.image_url.includes('data:image') ? (
                        <img
                          src={event.image_url}
                          alt={event.title}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.target.style.display = 'none';
                            e.target.parentElement.innerHTML = '<div class="w-full h-full flex items-center justify-center bg-gradient-to-br from-vaal-orange-100 to-vaal-orange-200"><svg class="w-16 h-16 text-vaal-orange-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg></div>';
                          }}
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-vaal-orange-100 to-vaal-orange-200">
                          <svg
                            className="w-16 h-16 text-vaal-orange-400"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                            />
                          </svg>
                        </div>
                      )}

                      {/* Date Badge Overlay */}
                      <div className="absolute top-4 left-4 bg-vaal-orange-500 text-white px-4 py-2 rounded-lg shadow-lg">
                        <div className="text-2xl font-bold leading-none">{shortDate.day}</div>
                        <div className="text-xs font-semibold">{shortDate.month}</div>
                      </div>
                      {/* Pinned / Most Viewed badge */}
                      {event.pinned === 1 && (
                        <div className="absolute top-4 right-4 bg-yellow-400 text-yellow-900 px-2 py-1 rounded-full text-xs font-bold flex items-center gap-1 shadow-md">
                          <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path d="M10 2a8 8 0 100 16A8 8 0 0010 2zm1 11H9v-2h2v2zm0-4H9V7h2v2z"/></svg>
                          Popular
                        </div>
                      )}
                    </div>

                    {/* Event Details */}
                    <div className="p-5 flex flex-col h-full">
                      <div className="flex-1">
                        {/* Category & Location */}
                        <div className="flex flex-wrap gap-2 mb-3">
                          {event.category && (
                            <span className="inline-block px-3 py-1 bg-vaal-orange-100 text-vaal-orange-700 text-xs font-medium rounded-full">
                              {event.category}
                            </span>
                          )}
                          {event.location && (
                            <span className="inline-block px-3 py-1 bg-gray-100 text-gray-700 text-xs font-medium rounded-full">
                              📍 {event.location}
                            </span>
                          )}
                        </div>

                        {/* Title */}
                        <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2 hover:text-vaal-orange-600 transition-colors">
                          {event.title}
                        </h3>

                        {/* Date & Time */}
                        <div className="flex items-center text-sm text-gray-600 mb-3">
                          <svg className="w-4 h-4 mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                            />
                          </svg>
                          <span className="line-clamp-1">{formatDate(event.date_start)}</span>
                        </div>

                        {/* Description Preview */}
                        {event.description && (
                          <p className="text-gray-600 text-sm line-clamp-3">{event.description}</p>
                        )}
                      </div>

                      {/* View Details Button */}
                      <button className="w-full mt-4 py-2 px-4 bg-vaal-orange-500 hover:bg-vaal-orange-600 text-white font-medium rounded-lg transition-colors duration-200 flex items-center justify-center">
                        View Details
                        <svg className="ml-2 w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}
      </div>

      {/* Event Detail Modal */}
      {selectedEvent && (
        <Modal
          isOpen={!!selectedEvent}
          onClose={closeEventModal}
          title={selectedEvent.title}
        >
          <div className="space-y-6">
            {/* Event Image */}
            {selectedEvent.image_url && !selectedEvent.image_url.includes('data:image') && (
              <div className="w-full rounded-lg overflow-hidden bg-gray-100">
                <img
                  src={selectedEvent.image_url}
                  alt={selectedEvent.title}
                  className="w-full h-auto object-contain max-h-[500px]"
                  onError={(e) => {
                    e.target.style.display = 'none';
                  }}
                />
              </div>
            )}

            {/* Tags */}
            <div className="flex flex-wrap gap-2">
              {selectedEvent.category && (
                <span className="inline-block px-4 py-2 bg-vaal-orange-100 text-vaal-orange-700 text-sm font-medium rounded-full">
                  {selectedEvent.category}
                </span>
              )}
              {selectedEvent.location && (
                <span className="inline-block px-4 py-2 bg-gray-100 text-gray-700 text-sm font-medium rounded-full">
                  📍 {selectedEvent.location}
                </span>
              )}
            </div>

            {/* Date & Time */}
            <div className="bg-gray-50 rounded-lg p-4">
              <h4 className="font-semibold text-gray-900 mb-2 flex items-center">
                <svg className="w-5 h-5 mr-2 text-vaal-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                When
              </h4>
              <p className="text-gray-700">
                <strong>Date:</strong> {formatDate(selectedEvent.date_start)}
                {selectedEvent.date_end && selectedEvent.date_end !== selectedEvent.date_start && (
                  <span> - {formatDate(selectedEvent.date_end)}</span>
                )}
              </p>
              {selectedEvent.time && (
                <p className="text-gray-700 mt-1">
                  <strong>Time:</strong> {selectedEvent.time}
                </p>
              )}
            </div>

            {/* Description */}
            {selectedEvent.description && (
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">About This Event</h4>
                <p className="text-gray-700 whitespace-pre-line leading-relaxed">
                  {selectedEvent.description}
                </p>
              </div>
            )}

            {/* Organizer */}
            {selectedEvent.organizer && (
              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="font-semibold text-gray-900 mb-2">Organizer</h4>
                <p className="text-gray-700">{selectedEvent.organizer}</p>
              </div>
            )}

            {/* Contact Info */}
            {selectedEvent.contact_info && (
              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="font-semibold text-gray-900 mb-2">Contact Information</h4>
                <p className="text-gray-700">{selectedEvent.contact_info}</p>
              </div>
            )}

            {/* Price */}
            {selectedEvent.price && (
              <div className="bg-vaal-orange-50 rounded-lg p-4 border border-vaal-orange-200">
                <h4 className="font-semibold text-gray-900 mb-2">Admission</h4>
                <p className="text-gray-700 font-medium">{selectedEvent.price}</p>
              </div>
            )}

            {/* External Source Link (Optional) */}
            {selectedEvent.source_url && (
              <div className="pt-4 border-t border-gray-200">
                <p className="text-sm text-gray-500 mb-3">Want more information from the original source?</p>
                <a
                  href={selectedEvent.source_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-lg transition-colors duration-200"
                >
                  Visit Event Source
                  <svg className="ml-2 w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                </a>
              </div>
            )}
          </div>
        </Modal>
      )}
    </div>
  );
}
