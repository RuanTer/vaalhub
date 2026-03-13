import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { buildEventMeta } from '../hooks/useSEO';
import SponsorBanner from '../components/ui/SponsorBanner';
import NewsletterSignupBar from '../components/ui/NewsletterSignupBar';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

function formatDate(dateString) {
  if (!dateString) return 'Date TBA';
  return new Date(dateString).toLocaleDateString('en-ZA', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
  });
}

export default function EventDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchEvent() {
      setLoading(true);
      try {
        const res = await fetch(`${API_URL}/api/events/${id}`);
        if (!res.ok) throw new Error('Event not found');
        const data = await res.json();
        setEvent(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchEvent();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="inline-block animate-spin rounded-full h-10 w-10 border-b-2 border-vaal-orange-500" />
      </div>
    );
  }

  if (error || !event) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4">
        <h1 className="text-2xl font-bold text-gray-800">Event not found</h1>
        <p className="text-gray-500">This event may have been removed or the link is incorrect.</p>
        <Link to="/events" className="text-vaal-orange-500 hover:text-vaal-orange-600 font-medium">
          Browse all events →
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Helmet>{buildEventMeta(event)}</Helmet>

      {/* Breadcrumb */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <nav className="flex items-center gap-2 text-sm text-gray-400">
            <Link to="/" className="hover:text-vaal-orange-500 transition-colors">Home</Link>
            <span>/</span>
            <Link to="/events" className="hover:text-vaal-orange-500 transition-colors">Events</Link>
            <span>/</span>
            <span className="text-gray-600 truncate max-w-[200px]">{event.title}</span>
          </nav>
        </div>
      </div>

      <SponsorBanner />

      <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <header className="mb-8">
          {/* Tags */}
          <div className="flex flex-wrap gap-2 mb-4">
            {event.category && (
              <span className="px-3 py-1 bg-vaal-orange-100 text-vaal-orange-700 text-xs font-medium rounded-full">
                {event.category}
              </span>
            )}
            {event.location && (
              <span className="px-3 py-1 bg-gray-100 text-gray-700 text-xs font-medium rounded-full">
                {event.location}
              </span>
            )}
          </div>

          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 leading-tight mb-4">
            {event.title}
          </h1>

          {/* Date */}
          <div className="flex items-center gap-2 text-gray-600">
            <svg className="w-5 h-5 text-vaal-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <span className="text-base font-medium">
              {formatDate(event.date_start)}
              {event.date_end && event.date_end !== event.date_start && (
                <span> – {formatDate(event.date_end)}</span>
              )}
            </span>
          </div>
          {event.time && (
            <p className="text-gray-500 mt-1 ml-7">Time: {event.time}</p>
          )}
        </header>

        {/* Image */}
        {event.image_url && !event.image_url.includes('data:image') && (
          <div className="w-full rounded-xl overflow-hidden bg-gray-100 mb-8">
            <img
              src={event.image_url}
              alt={event.title}
              className="w-full h-auto object-contain max-h-[500px]"
              onError={e => { e.target.style.display = 'none'; }}
            />
          </div>
        )}

        {/* Details grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main content */}
          <div className="lg:col-span-2">
            {event.description && (
              <div className="bg-white rounded-xl border border-gray-100 p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-3">About This Event</h2>
                <p className="text-gray-600 leading-relaxed whitespace-pre-line">{event.description}</p>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-4">
            {/* Location card */}
            {event.location && (
              <div className="bg-white rounded-xl border border-gray-100 p-5">
                <h3 className="text-sm font-semibold text-gray-900 mb-2 flex items-center gap-2">
                  <svg className="w-4 h-4 text-vaal-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  Location
                </h3>
                <p className="text-sm text-gray-600">{event.location}</p>
              </div>
            )}

            {/* Organizer card */}
            {event.organizer && (
              <div className="bg-white rounded-xl border border-gray-100 p-5">
                <h3 className="text-sm font-semibold text-gray-900 mb-2">Organizer</h3>
                <p className="text-sm text-gray-600">{event.organizer}</p>
              </div>
            )}

            {/* Contact */}
            {event.contact_info && (
              <div className="bg-white rounded-xl border border-gray-100 p-5">
                <h3 className="text-sm font-semibold text-gray-900 mb-2">Contact</h3>
                <p className="text-sm text-gray-600">{event.contact_info}</p>
              </div>
            )}

            {/* Price */}
            {event.price && (
              <div className="bg-vaal-orange-50 border border-vaal-orange-200 rounded-xl p-5">
                <h3 className="text-sm font-semibold text-gray-900 mb-2">Admission</h3>
                <p className="text-sm font-medium text-gray-700">{event.price}</p>
              </div>
            )}

            {/* Source link */}
            {event.source_url && (
              <a
                href={event.source_url}
                target="_blank"
                rel="noopener noreferrer"
                className="block bg-white rounded-xl border border-gray-100 p-5 hover:border-vaal-orange-300 transition-colors"
              >
                <span className="text-sm text-vaal-orange-600 font-medium">More information →</span>
              </a>
            )}

            {/* Back link */}
            <Link
              to="/events"
              className="block text-center py-2.5 text-sm font-medium text-gray-600 hover:text-vaal-orange-600 transition-colors"
            >
              ← Browse all events
            </Link>
          </div>
        </div>
      </article>

      <NewsletterSignupBar />
    </div>
  );
}
