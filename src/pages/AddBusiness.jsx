import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { buildPageMeta } from '../hooks/useSEO';

const CATEGORIES = [
  'Restaurant', 'Retail', 'Service', 'Healthcare', 'Entertainment',
  'Automotive', 'Construction', 'Professional Services', 'Education', 'Other',
];

const LOCATIONS = [
  'Vereeniging', 'Vanderbijlpark', 'Meyerton', 'Sasolburg', 'Sharpeville',
];

export default function AddBusiness() {
  const [form, setForm] = useState({
    name: '', email: '', phone: '',
    businessName: '', category: '', location: '', website: '', description: '',
  });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const subject = encodeURIComponent(`New Business Submission: ${form.businessName}`);
    const body = encodeURIComponent(
      `Contact Name: ${form.name}\nEmail: ${form.email}\nPhone: ${form.phone}\n\nBusiness Name: ${form.businessName}\nCategory: ${form.category}\nLocation: ${form.location}\nWebsite: ${form.website}\n\nDescription:\n${form.description}`
    );
    window.location.href = `mailto:info@vaalhub.co.za?subject=${subject}&body=${body}`;
    setSubmitted(true);
  };

  const inputClass =
    'w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-vaal-orange-500 focus:border-vaal-orange-500 bg-white text-gray-900 placeholder-gray-400';

  /* ── Success / email-opened state ──────────────────────────── */
  if (submitted) {
    return (
      <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md mx-auto text-center">
          <div className="bg-white rounded-2xl shadow-md p-10">
            <div className="flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mx-auto mb-4">
              <svg className="w-8 h-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Your email app is opening!</h2>
            <p className="text-gray-600 mb-4">
              We've pre-filled an email to{' '}
              <span className="font-semibold">info@vaalhub.co.za</span> with your business details.
              Just hit send and we'll be in touch.
            </p>
            <p className="text-gray-500 text-sm mb-8">
              If the email didn't open automatically, send the details manually to{' '}
              <a href="mailto:info@vaalhub.co.za" className="text-vaal-orange-500 font-medium underline underline-offset-2">
                info@vaalhub.co.za
              </a>.
            </p>
            <Link
              to="/businesses"
              className="inline-block bg-vaal-orange-500 hover:bg-vaal-orange-600 text-white font-semibold py-2.5 px-6 rounded-lg transition-colors duration-200"
            >
              Browse Businesses →
            </Link>
          </div>
        </div>
      </div>
    );
  }

  /* ── Main form ──────────────────────────────────────────────── */
  return (
    <div className="min-h-screen bg-gray-50">
      <Helmet>
        {buildPageMeta({
          title: 'Add Your Business – VaalHub',
          description: 'List your Vaal Triangle business on VaalHub for free. Reach thousands of locals looking for services, restaurants, shops and more.',
          path: '/add-business',
        })}
      </Helmet>

      {/* Hero */}
      <div className="bg-gradient-to-r from-vaal-orange-500 to-vaal-orange-600 text-white py-14">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center justify-center w-14 h-14 bg-white/20 rounded-full mb-4">
            <svg className="w-7 h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-3">Add Your Business</h1>
          <p className="text-xl text-white/90 max-w-xl mx-auto">
            Get your business in front of thousands of Vaal Triangle residents — completely free.
          </p>
        </div>
      </div>

      {/* Benefits strip */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
            {[
              { icon: '🆓', label: 'Always Free', desc: 'No listing fees, ever' },
              { icon: '📍', label: 'Local Reach', desc: 'Thousands of Vaal residents' },
              { icon: '⚡', label: 'Quick Setup', desc: 'Live within 1–2 business days' },
            ].map((b) => (
              <div key={b.label} className="flex flex-col items-center gap-1">
                <span className="text-3xl">{b.icon}</span>
                <p className="font-semibold text-gray-900 text-sm">{b.label}</p>
                <p className="text-gray-500 text-xs">{b.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12">

        {/* Back link */}
        <Link
          to="/businesses"
          className="inline-flex items-center text-sm text-gray-500 hover:text-gray-700 mb-8 gap-1"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to businesses
        </Link>

        {/* Form card */}
        <div className="bg-white rounded-2xl shadow-md p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-1">Your business details</h2>
          <p className="text-gray-500 text-sm mb-7">
            Fill in as much as you can — we'll do the rest. Fields marked{' '}
            <span className="text-red-500 font-medium">*</span> are required.
          </p>

          <form onSubmit={handleSubmit} className="space-y-6">

            {/* Section: Contact */}
            <div>
              <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4">Your contact info</h3>
              <div className="space-y-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1.5">
                    Your full name <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="name" name="name" type="text" required
                    value={form.name} onChange={handleChange}
                    placeholder="Jane Smith"
                    className={inputClass}
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1.5">
                      Email address <span className="text-red-500">*</span>
                    </label>
                    <input
                      id="email" name="email" type="email" required
                      value={form.email} onChange={handleChange}
                      placeholder="jane@yourbusiness.co.za"
                      className={inputClass}
                    />
                  </div>
                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1.5">
                      Phone number
                    </label>
                    <input
                      id="phone" name="phone" type="tel"
                      value={form.phone} onChange={handleChange}
                      placeholder="016 000 0000"
                      className={inputClass}
                    />
                  </div>
                </div>
              </div>
            </div>

            <hr className="border-gray-100" />

            {/* Section: Business */}
            <div>
              <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4">Business info</h3>
              <div className="space-y-4">
                <div>
                  <label htmlFor="businessName" className="block text-sm font-medium text-gray-700 mb-1.5">
                    Business name <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="businessName" name="businessName" type="text" required
                    value={form.businessName} onChange={handleChange}
                    placeholder="e.g. Vaal Plumbing Services"
                    className={inputClass}
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1.5">
                      Category <span className="text-red-500">*</span>
                    </label>
                    <select
                      id="category" name="category" required
                      value={form.category} onChange={handleChange}
                      className={inputClass}
                    >
                      <option value="">Select a category</option>
                      {CATEGORIES.map((c) => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1.5">
                      Location <span className="text-red-500">*</span>
                    </label>
                    <select
                      id="location" name="location" required
                      value={form.location} onChange={handleChange}
                      className={inputClass}
                    >
                      <option value="">Select a location</option>
                      {LOCATIONS.map((l) => (
                        <option key={l} value={l}>{l}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label htmlFor="website" className="block text-sm font-medium text-gray-700 mb-1.5">
                    Website or social media link
                  </label>
                  <input
                    id="website" name="website" type="url"
                    value={form.website} onChange={handleChange}
                    placeholder="https://www.yourbusiness.co.za"
                    className={inputClass}
                  />
                </div>

                <div>
                  <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1.5">
                    Brief description <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    id="description" name="description" rows={4} required
                    value={form.description} onChange={handleChange}
                    placeholder="Tell us what your business does, what makes it special, and who it serves..."
                    className={`${inputClass} resize-none`}
                  />
                  <p className="mt-1 text-xs text-gray-400">This will appear on your listing in the directory.</p>
                </div>
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              className="w-full bg-vaal-orange-500 hover:bg-vaal-orange-600 text-white font-semibold py-3.5 px-6 rounded-lg transition-colors duration-200 flex items-center justify-center gap-2 text-base shadow-sm"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              Submit via Email →
            </button>

            <p className="text-center text-xs text-gray-400 -mt-2">
              This will open your email client with the details pre-filled. Just hit send!
            </p>
          </form>
        </div>

        {/* Already listed? */}
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-xl p-5 text-center">
          <p className="text-sm text-blue-800">
            <span className="font-semibold">Already listed on VaalHub?</span>{' '}
            Find your business in the directory and click{' '}
            <span className="font-semibold">"Claim this listing →"</span>{' '}
            to take ownership of your page.
          </p>
          <Link
            to="/businesses"
            className="inline-block mt-3 text-sm text-blue-600 hover:text-blue-700 font-medium underline underline-offset-2"
          >
            Browse the directory →
          </Link>
        </div>

      </div>
    </div>
  );
}
