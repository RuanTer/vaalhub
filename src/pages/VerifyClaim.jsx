import { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export default function VerifyClaim() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token') || '';

  const [status, setStatus] = useState('loading'); // loading | success | error
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (!token) {
      setStatus('error');
      setMessage('No verification token found. Please check the link in your email.');
      return;
    }

    fetch(`${API_URL}/api/claims/verify?token=${encodeURIComponent(token)}`)
      .then((res) => res.json().then((data) => ({ ok: res.ok, data })))
      .then(({ ok, data }) => {
        if (ok) {
          setStatus('success');
        } else {
          setStatus('error');
          setMessage(
            data.error ||
              'Verification failed. The link may have expired or already been used.'
          );
        }
      })
      .catch(() => {
        setStatus('error');
        setMessage('Unable to connect to the server. Please try again later.');
      });
  }, [token]);

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto text-center">
        <div className="bg-white rounded-2xl shadow-md p-10">

          {/* Loading */}
          {status === 'loading' && (
            <>
              <div className="flex items-center justify-center w-16 h-16 bg-orange-100 rounded-full mx-auto mb-4">
                <svg
                  className="animate-spin w-8 h-8 text-vaal-orange-500"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Verifying your email…</h2>
              <p className="text-gray-500 text-sm">Please wait a moment.</p>
            </>
          )}

          {/* Success */}
          {status === 'success' && (
            <>
              <div className="flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mx-auto mb-4">
                <svg className="w-8 h-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Email Verified!</h2>
              <p className="text-gray-600 mb-2">
                Your email address has been confirmed and your claim is now{' '}
                <span className="font-semibold">pending review</span>.
              </p>
              <p className="text-gray-500 text-sm mb-8">
                Our team will review your claim within 1–2 business days. If approved, you'll
                receive your business portal login credentials via email.
              </p>
              <Link
                to="/businesses"
                className="inline-block bg-vaal-orange-500 hover:bg-vaal-orange-600 text-white font-semibold py-2.5 px-6 rounded-lg transition-colors duration-200"
              >
                Back to Businesses
              </Link>
            </>
          )}

          {/* Error */}
          {status === 'error' && (
            <>
              <div className="flex items-center justify-center w-16 h-16 bg-red-100 rounded-full mx-auto mb-4">
                <svg className="w-8 h-8 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Verification Failed</h2>
              <p className="text-gray-600 mb-8">{message}</p>
              <div className="space-y-3">
                <Link
                  to="/businesses"
                  className="block bg-vaal-orange-500 hover:bg-vaal-orange-600 text-white font-semibold py-2.5 px-6 rounded-lg transition-colors duration-200"
                >
                  Back to Businesses
                </Link>
                <a
                  href="mailto:info@vaalhub.co.za"
                  className="block text-sm text-gray-500 hover:text-gray-700"
                >
                  Need help? Contact info@vaalhub.co.za
                </a>
              </div>
            </>
          )}

        </div>
      </div>
    </div>
  );
}
