import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { buildPageMeta } from '../hooks/useSEO';
import { executeRecaptcha } from '../utils/recaptcha';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const CATEGORIES = [
  'Community Event', 'Sports', 'Arts', 'Market',
  'School Event', 'Music', 'Festival', 'Other',
];

const LOCATIONS = [
  'Vereeniging', 'Vanderbijlpark', 'Meyerton',
  'Sasolburg', 'Sharpeville', 'All Areas',
];

const inputClass =
  'w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-vaal-orange-500 focus:border-vaal-orange-500 bg-white text-gray-900 placeholder-gray-400 text-sm';

const labelClass = 'block text-sm font-medium text-gray-700 mb-1.5';

export default function AddEvent() {
  const [form, setForm] = useState({
    submitter_name: '', submitter_email: '', submitter_phone: '',
    title: '', description: '', date_start: '', date_end: '', time: '',
    location: '', category: '', organizer: '', contact_info: '',
    price: '', image_url: '', source_url: '',
  });
  const [status, setStatus]       = useState('idle'); // idle | loading | success | error
  const [errorMsg, setErrorMsg]   = useState('');
  const [charCount, setCharCount] = useState(0);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(f => ({ ...f, [name]: value }));
    if (name === 'description') setCharCount(value.length);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('loading');
    setErrorMsg('');

    const token = await executeRecaptcha('submit_event');

    try {
      const res = await fetch(`${API_URL}/api/events/submit`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, recaptcha_token: token }),
      });
      const data = await res.json();

      if (res.ok) {
        setStatus('success');
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else {
        setStatus('error');
        setErrorMsg(data.error || 'Something went wrong. Please try again.');
      }
    } catch {
      setStatus('error');
      setErrorMsg('Unable to connect to the server. Please check your connection and try again.');
    }
  };

  /* ── SUCCESS STATE ──────────────────────────────────────────────── */
  if (status === 'success') {
    return (
      <div className="min-h-screen bg-gray-50">
        <Helmet>{buildPageMeta({ title: 'Event Submitted', path: '/add-event' })}</Helmet>
        <div className="bg-gradient-to-r from-vaal-orange-500 to-vaal-orange-600 text-white py-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="text-2xl sm:text-3xl font-bold">Add Your Event</h1>
          </div>
        </div>
        <div className="max-w-xl mx-auto px-4 py-16 text-center">
          <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 rounded-full bg-green-100">
            <svg className="w-8 h-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Event Submitted!</h2>
          <p className="text-gray-600 mb-6 leading-relaxed">
            Thanks for sharing your event with the Vaal Triangle community.
            Our team will review it and publish it within <strong>1–2 business days</strong>.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link to="/events"
              className="px-6 py-2.5 bg-vaal-orange-500 hover:bg-vaal-orange-600 text-white font-semibold rounded-lg transition-colors text-sm">
              Browse Events
            </Link>
            <button onClick={() => { setStatus('idle'); setForm({ submitter_name: '', submitter_email: '', submitter_phone: '', title: '', description: '', date_start: '', date_end: '', time: '', location: '', category: '', organizer: '', contact_info: '', price: '', image_url: '', source_url: '' }); setCharCount(0); }}
              className="px-6 py-2.5 border border-gray-300 text-gray-700 hover:bg-gray-50 font-semibold rounded-lg transition-colors text-sm">
              Submit Another
            </button>
          </div>
        </div>
      </div>
    );
  }

  /* ── FORM STATE ─────────────────────────────────────────────────── */
  return (
    <div className="min-h-screen bg-gray-50">
      <Helmet>
        {buildPageMeta({
          title: 'Add Your Event – Vaal Triangle',
          description: 'Submit your community event, market, festival, or gathering to VaalHub for free. Reach thousands of Vaal Triangle residents.',
          path: '/add-event',
        })}
      </Helmet>

      {/* ── Compact hero ──────────────────────────────────────────── */}
      <div className="bg-gradient-to-r from-vaal-orange-500 to-vaal-orange-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
          <div className="flex items-center gap-3 mb-2">
            <div className="flex items-center justify-center w-10 h-10 bg-white/20 rounded-xl">
              <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold">Add Your Event</h1>
              <p className="text-white/80 text-sm">Share your event with the Vaal Triangle community — it's free</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-6">

        {/* Back link */}
        <Link to="/events" className="inline-flex items-center gap-1 text-sm text-gray-400 hover:text-vaal-orange-600 transition-colors mb-5">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
          Back to Events
        </Link>

        {/* ── Benefit cards ───────────────────────────────────────── */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          {[
            { icon: 'M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z', title: 'Free Listing', desc: 'No cost to submit' },
            { icon: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z', title: 'Reach Locals', desc: 'Thousands of readers' },
            { icon: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z', title: 'Quick Review', desc: '1–2 business days' },
          ].map(({ icon, title, desc }) => (
            <div key={title} className="bg-white rounded-xl border border-gray-100 p-3 text-center">
              <div className="flex items-center justify-center w-8 h-8 mx-auto mb-1.5 bg-vaal-orange-50 rounded-lg">
                <svg className="w-4 h-4 text-vaal-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d={icon} />
                </svg>
              </div>
              <p className="text-xs font-semibold text-gray-800">{title}</p>
              <p className="text-xs text-gray-400">{desc}</p>
            </div>
          ))}
        </div>

        {/* ── Error banner ────────────────────────────────────────── */}
        {status === 'error' && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm mb-6 flex items-start gap-2">
            <svg className="w-5 h-5 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <p>{errorMsg}</p>
          </div>
        )}

        {/* ── Form ────────────────────────────────────────────────── */}
        <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">

          {/* Section 1: Your details */}
          <div className="p-5 sm:p-6">
            <h2 className="text-base font-bold text-gray-900 mb-4 flex items-center gap-2">
              <span className="flex items-center justify-center w-6 h-6 bg-vaal-orange-500 text-white text-xs font-bold rounded-full">1</span>
              Your Details
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <label htmlFor="submitter_name" className={labelClass}>Full name *</label>
                <input id="submitter_name" name="submitter_name" type="text" required
                  value={form.submitter_name} onChange={handleChange} placeholder="Your name"
                  className={inputClass} />
              </div>
              <div>
                <label htmlFor="submitter_email" className={labelClass}>Email *</label>
                <input id="submitter_email" name="submitter_email" type="email" required
                  value={form.submitter_email} onChange={handleChange} placeholder="you@example.com"
                  className={inputClass} />
              </div>
              <div>
                <label htmlFor="submitter_phone" className={labelClass}>Phone</label>
                <input id="submitter_phone" name="submitter_phone" type="tel"
                  value={form.submitter_phone} onChange={handleChange} placeholder="Optional"
                  className={inputClass} />
              </div>
            </div>
          </div>

          <hr className="border-gray-100" />

          {/* Section 2: Event details */}
          <div className="p-5 sm:p-6">
            <h2 className="text-base font-bold text-gray-900 mb-4 flex items-center gap-2">
              <span className="flex items-center justify-center w-6 h-6 bg-vaal-orange-500 text-white text-xs font-bold rounded-full">2</span>
              Event Details
            </h2>
            <div className="space-y-4">
              <div>
                <label htmlFor="title" className={labelClass}>Event title *</label>
                <input id="title" name="title" type="text" required maxLength={200}
                  value={form.title} onChange={handleChange} placeholder="e.g. Vaal River Market Day"
                  className={inputClass} />
              </div>

              <div>
                <label htmlFor="description" className={labelClass}>Description *</label>
                <textarea id="description" name="description" rows={4} required maxLength={2000}
                  value={form.description} onChange={handleChange}
                  placeholder="Tell people what the event is about, what to expect, and any other important details…"
                  className={`${inputClass} resize-y`} />
                <p className="mt-1 text-xs text-gray-400 text-right">{charCount}/2000</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label htmlFor="date_start" className={labelClass}>Start date *</label>
                  <input id="date_start" name="date_start" type="date" required
                    value={form.date_start} onChange={handleChange}
                    className={inputClass} />
                </div>
                <div>
                  <label htmlFor="date_end" className={labelClass}>End date</label>
                  <input id="date_end" name="date_end" type="date"
                    value={form.date_end} onChange={handleChange} min={form.date_start || undefined}
                    className={inputClass} />
                </div>
                <div>
                  <label htmlFor="time" className={labelClass}>Time</label>
                  <input id="time" name="time" type="text"
                    value={form.time} onChange={handleChange} placeholder="e.g. 09:00 - 16:00"
                    className={inputClass} />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="location" className={labelClass}>Location *</label>
                  <select id="location" name="location" required value={form.location} onChange={handleChange}
                    className={inputClass}>
                    <option value="">Select area…</option>
                    {LOCATIONS.map(l => <option key={l} value={l}>{l}</option>)}
                  </select>
                </div>
                <div>
                  <label htmlFor="category" className={labelClass}>Category *</label>
                  <select id="category" name="category" required value={form.category} onChange={handleChange}
                    className={inputClass}>
                    <option value="">Select category…</option>
                    {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="organizer" className={labelClass}>Organizer / Venue</label>
                  <input id="organizer" name="organizer" type="text"
                    value={form.organizer} onChange={handleChange} placeholder="e.g. Emerald Casino"
                    className={inputClass} />
                </div>
                <div>
                  <label htmlFor="contact_info" className={labelClass}>Contact info</label>
                  <input id="contact_info" name="contact_info" type="text"
                    value={form.contact_info} onChange={handleChange} placeholder="Phone or email for attendees"
                    className={inputClass} />
                </div>
              </div>

              <div>
                <label htmlFor="price" className={labelClass}>Admission / Price</label>
                <input id="price" name="price" type="text"
                  value={form.price} onChange={handleChange} placeholder="e.g. Free, R50, R150 per person"
                  className={inputClass} />
              </div>
            </div>
          </div>

          <hr className="border-gray-100" />

          {/* Section 3: Media & links */}
          <div className="p-5 sm:p-6">
            <h2 className="text-base font-bold text-gray-900 mb-4 flex items-center gap-2">
              <span className="flex items-center justify-center w-6 h-6 bg-vaal-orange-500 text-white text-xs font-bold rounded-full">3</span>
              Media & Links
            </h2>
            <div className="space-y-4">
              <div>
                <label htmlFor="image_url" className={labelClass}>Event poster / flyer link</label>
                <input id="image_url" name="image_url" type="url"
                  value={form.image_url} onChange={handleChange}
                  placeholder="https://drive.google.com/... or Facebook image link"
                  className={inputClass} />
                <p className="mt-1 text-xs text-gray-400">
                  Paste a link to your event poster on Facebook, Google Drive, or Imgur.
                  Right-click an image and choose "Copy image address".
                </p>
              </div>
              <div>
                <label htmlFor="source_url" className={labelClass}>Event page / Facebook link</label>
                <input id="source_url" name="source_url" type="url"
                  value={form.source_url} onChange={handleChange}
                  placeholder="https://facebook.com/events/..."
                  className={inputClass} />
                <p className="mt-1 text-xs text-gray-400">
                  Link to your Facebook event, website, or ticket page so people can find out more.
                </p>
              </div>
            </div>
          </div>

          <hr className="border-gray-100" />

          {/* Submit */}
          <div className="p-5 sm:p-6">
            <button
              type="submit"
              disabled={status === 'loading'}
              className="w-full flex items-center justify-center gap-2 py-3 bg-vaal-orange-500 hover:bg-vaal-orange-600 disabled:opacity-60 disabled:cursor-not-allowed text-white font-semibold rounded-xl transition-colors shadow-sm text-sm"
            >
              {status === 'loading' ? (
                <>
                  <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                  </svg>
                  Submitting…
                </>
              ) : (
                <>
                  Submit Event for Review
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                  </svg>
                </>
              )}
            </button>
            <p className="mt-3 text-center text-xs text-gray-400">
              Events are reviewed by our team before publishing. This usually takes 1–2 business days.
            </p>
          </div>
        </form>

        {/* Helper note */}
        <div className="mt-6 mb-4 text-center">
          <p className="text-xs text-gray-400">
            Need to update an existing event?{' '}
            <Link to="/contact" className="text-vaal-orange-500 hover:text-vaal-orange-600 underline underline-offset-2">
              Contact us
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
