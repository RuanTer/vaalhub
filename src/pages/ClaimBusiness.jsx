import { useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export default function ClaimBusiness() {
  const [searchParams] = useSearchParams();
  const businessId = searchParams.get('id') || '';
  const businessName = searchParams.get('name') || 'this business';

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    role: 'owner',
  });
  const [status, setStatus] = useState('idle'); // idle | loading | success | error
  const [message, setMessage] = useState('');

  // If no business ID in URL, show a friendly redirect message immediately
  if (!businessId) {
    return (
      <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md mx-auto text-center">
          <div className="bg-white rounded-2xl shadow-md p-10">
            <div className="flex items-center justify-center w-16 h-16 bg-orange-100 rounded-full mx-auto mb-4">
              <svg className="w-8 h-8 text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Find your business first</h2>
            <p className="text-gray-600 mb-8">
              To claim a listing, open a business from the directory and click{' '}
              <span className="font-semibold text-gray-800">"Claim this listing →"</span>{' '}
              at the bottom of the details panel.
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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!businessId) {
      setStatus('error');
      setMessage('No business ID provided. Please return to the business listing and try again.');
      return;
    }
    setStatus('loading');
    setMessage('');

    try {
      const res = await fetch(`${API_URL}/api/claims/submit`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          business_id: parseInt(businessId, 10),
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          role: formData.role,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        setStatus('success');
      } else {
        setStatus('error');
        setMessage(data.error || 'Something went wrong. Please try again.');
      }
    } catch {
      setStatus('error');
      setMessage('Unable to connect to the server. Please try again later.');
    }
  };

  /* ── Success state ──────────────────────────────────────── */
  if (status === 'success') {
    return (
      <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md mx-auto text-center">
          <div className="bg-white rounded-2xl shadow-md p-10">
            <div className="flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mx-auto mb-4">
              <svg className="w-8 h-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Check your email!</h2>
            <p className="text-gray-600 mb-4">
              We've sent a verification link to{' '}
              <span className="font-semibold">{formData.email}</span>.
            </p>
            <p className="text-gray-500 text-sm mb-8">
              Click the link in the email to confirm your address and submit your claim for review.
              Once verified, our team will review your claim and you'll receive login credentials
              for your business portal within 1–2 business days.
            </p>
            <Link
              to="/businesses"
              className="inline-block bg-vaal-orange-500 hover:bg-vaal-orange-600 text-white font-semibold py-2.5 px-6 rounded-lg transition-colors duration-200"
            >
              Back to Businesses
            </Link>
          </div>
        </div>
      </div>
    );
  }

  /* ── Form state ─────────────────────────────────────────── */
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-lg mx-auto">

        {/* Back link */}
        <Link
          to="/businesses"
          className="inline-flex items-center text-sm text-gray-500 hover:text-gray-700 mb-6 gap-1"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to businesses
        </Link>

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Claim your listing</h1>
          <p className="text-gray-600">
            Claiming{' '}
            <span className="font-semibold text-gray-800">"{businessName}"</span>{' '}
            on VaalHub. Once approved you'll be able to update your business information directly.
          </p>
        </div>

        {/* How it works */}
        <div className="bg-orange-50 border border-orange-200 rounded-xl p-5 mb-8">
          <h3 className="font-semibold text-orange-900 mb-3">How it works</h3>
          <ol className="space-y-1.5 text-sm text-orange-800">
            <li className="flex gap-2"><span className="font-bold">1.</span> Fill in the form below</li>
            <li className="flex gap-2"><span className="font-bold">2.</span> Click the verification link sent to your email</li>
            <li className="flex gap-2"><span className="font-bold">3.</span> Our team reviews your claim (1–2 business days)</li>
            <li className="flex gap-2"><span className="font-bold">4.</span> Receive your business portal login credentials</li>
          </ol>
        </div>

        {/* Form card */}
        <div className="bg-white rounded-2xl shadow-md p-8">
          <form onSubmit={handleSubmit} className="space-y-5">

            {/* Full name */}
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1.5">
                Your full name <span className="text-red-500">*</span>
              </label>
              <input
                id="name"
                name="name"
                type="text"
                required
                value={formData.name}
                onChange={handleChange}
                disabled={status === 'loading'}
                placeholder="Jane Smith"
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-vaal-orange-500 focus:border-vaal-orange-500 disabled:opacity-50"
              />
            </div>

            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1.5">
                Business email address <span className="text-red-500">*</span>
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                value={formData.email}
                onChange={handleChange}
                disabled={status === 'loading'}
                placeholder="jane@yourbusiness.co.za"
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-vaal-orange-500 focus:border-vaal-orange-500 disabled:opacity-50"
              />
              <p className="mt-1 text-xs text-gray-500">Use your business email address if possible</p>
            </div>

            {/* Phone */}
            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1.5">
                Contact number
              </label>
              <input
                id="phone"
                name="phone"
                type="tel"
                value={formData.phone}
                onChange={handleChange}
                disabled={status === 'loading'}
                placeholder="016 000 0000"
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-vaal-orange-500 focus:border-vaal-orange-500 disabled:opacity-50"
              />
            </div>

            {/* Role */}
            <div>
              <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-1.5">
                Your role <span className="text-red-500">*</span>
              </label>
              <select
                id="role"
                name="role"
                value={formData.role}
                onChange={handleChange}
                disabled={status === 'loading'}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-vaal-orange-500 focus:border-vaal-orange-500 bg-white disabled:opacity-50"
              >
                <option value="owner">Owner</option>
                <option value="manager">Manager</option>
                <option value="marketing">Marketing / PR</option>
              </select>
            </div>

            {/* Error message */}
            {status === 'error' && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-start gap-2">
                <svg className="w-5 h-5 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
                <p className="text-sm">{message}</p>
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={status === 'loading'}
              className="w-full bg-vaal-orange-500 hover:bg-vaal-orange-600 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {status === 'loading' ? (
                <>
                  <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Submitting…
                </>
              ) : (
                'Submit Claim →'
              )}
            </button>
          </form>
        </div>

        <p className="mt-6 text-center text-xs text-gray-400">
          By submitting you confirm you are an authorised representative of this business.
          False claims may result in removal from the directory.
        </p>
      </div>
    </div>
  );
}
