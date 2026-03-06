import { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

// ── Spinner ───────────────────────────────────────────────────────────────────
function Spinner({ className = 'h-5 w-5' }) {
  return (
    <svg className={`animate-spin ${className}`} fill="none" viewBox="0 0 24 24">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
    </svg>
  );
}

// ── Email-based resend (shown when no token in URL, or unknown error) ─────────
function ResendByEmailForm() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState('idle'); // idle | loading | sent | error
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('loading');
    setErrorMsg('');
    try {
      await fetch(`${API_URL}/api/claims/resend-by-email`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      // Always show success — API never reveals whether email exists
      setStatus('sent');
    } catch {
      setStatus('error');
      setErrorMsg('Unable to connect. Please try again or email info@vaalhub.co.za.');
    }
  };

  if (status === 'sent') {
    return (
      <div className="mt-5 bg-green-50 border border-green-200 rounded-xl p-4 text-left">
        <div className="flex items-start gap-3">
          <svg className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
          <div>
            <p className="text-sm font-semibold text-green-800">Check your inbox</p>
            <p className="text-sm text-green-700 mt-0.5">
              If we found a pending claim for{' '}
              <span className="font-medium">{email}</span>, a new link has been sent.
              Check your spam folder too.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mt-5 border border-gray-200 rounded-xl p-4 text-left">
      <p className="text-sm font-semibold text-gray-800 mb-1">Request a new verification link</p>
      <p className="text-xs text-gray-500 mb-3">
        Enter the email address you used when submitting the claim.
      </p>
      <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-2">
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={status === 'loading'}
          placeholder="your@email.co.za"
          className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-vaal-orange-500 focus:border-vaal-orange-500 disabled:opacity-50"
        />
        <button
          type="submit"
          disabled={status === 'loading' || !email}
          className="flex items-center justify-center gap-2 px-4 py-2 bg-vaal-orange-500 hover:bg-vaal-orange-600 text-white text-sm font-semibold rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
        >
          {status === 'loading' ? <><Spinner className="h-4 w-4" /> Sending…</> : 'Send link'}
        </button>
      </form>
      {status === 'error' && (
        <p className="mt-2 text-xs text-red-600">{errorMsg}</p>
      )}
    </div>
  );
}

// ── Token-based resend (shown when token is expired — HTTP 410) ───────────────
function ResendByTokenButton({ token }) {
  const [status, setStatus] = useState('idle');
  const [message, setMessage] = useState('');

  const handleResend = async () => {
    setStatus('loading');
    try {
      const res = await fetch(`${API_URL}/api/claims/resend-verification`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token }),
      });
      const data = await res.json();
      if (res.ok) {
        setStatus('sent');
        setMessage(data.message || 'A new verification link has been sent to your email.');
      } else {
        setStatus('error');
        setMessage(data.error || 'Failed to resend. Please contact info@vaalhub.co.za.');
      }
    } catch {
      setStatus('error');
      setMessage('Unable to connect. Please try again later.');
    }
  };

  if (status === 'sent') {
    return (
      <div className="mb-5 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg text-sm text-left">
        <span className="font-medium">Sent!</span> {message}
      </div>
    );
  }
  if (status === 'error') {
    return (
      <div className="mb-5 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm text-left">
        {message}
      </div>
    );
  }

  return (
    <button
      onClick={handleResend}
      disabled={status === 'loading'}
      className="w-full flex items-center justify-center gap-2 mb-5 bg-vaal-orange-500 hover:bg-vaal-orange-600 text-white font-semibold py-2.5 px-6 rounded-lg transition-colors duration-200 disabled:opacity-50"
    >
      {status === 'loading' ? <><Spinner className="h-5 w-5" /> Sending…</> : 'Send a new verification link'}
    </button>
  );
}


// ── Main page ─────────────────────────────────────────────────────────────────
export default function VerifyClaim() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token') || '';

  // If there's no token at all, skip "loading" and go straight to "no-token"
  const [status, setStatus] = useState(token ? 'loading' : 'no-token');
  const [message, setMessage] = useState('');
  const [isExpired, setIsExpired] = useState(false);

  useEffect(() => {
    if (!token) return; // handled by 'no-token' status

    fetch(`${API_URL}/api/claims/verify?token=${encodeURIComponent(token)}`)
      .then((res) => res.json().then((data) => ({ ok: res.ok, httpStatus: res.status, data })))
      .then(({ ok, httpStatus, data }) => {
        if (ok) {
          setStatus('success');
        } else {
          setStatus('error');
          setMessage(data.error || 'Verification failed. The link may have expired or already been used.');
          if (httpStatus === 410) setIsExpired(true);
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

          {/* ── Loading ── */}
          {status === 'loading' && (
            <>
              <div className="flex items-center justify-center w-16 h-16 bg-orange-100 rounded-full mx-auto mb-4">
                <Spinner className="w-8 h-8 text-vaal-orange-500" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Verifying your email…</h2>
              <p className="text-gray-500 text-sm">Please wait a moment.</p>
            </>
          )}

          {/* ── Success ── */}
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
                Our team will review your claim within 1–2 business days. If approved,
                you'll receive your business portal login credentials via email.
              </p>
              <Link
                to="/businesses"
                className="inline-block bg-vaal-orange-500 hover:bg-vaal-orange-600 text-white font-semibold py-2.5 px-6 rounded-lg transition-colors duration-200"
              >
                Back to Businesses
              </Link>
            </>
          )}

          {/* ── No token in URL (direct navigation / broken link) ── */}
          {status === 'no-token' && (
            <>
              <div className="flex items-center justify-center w-16 h-16 bg-amber-100 rounded-full mx-auto mb-4">
                <svg className="w-8 h-8 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Check your email</h2>
              <p className="text-gray-600 mb-1">
                Your verification link is in the email we sent you when you submitted the claim.
                Click the orange button in that email.
              </p>
              <p className="text-gray-500 text-sm mb-2">
                Can't find it? Check your <span className="font-medium">spam / junk</span> folder.
              </p>
              <p className="text-gray-500 text-sm">
                Or enter your email below to receive a new link.
              </p>

              <ResendByEmailForm />

              <div className="mt-5 space-y-2">
                <Link to="/businesses" className="block text-sm text-gray-500 hover:text-gray-700">
                  ← Back to Businesses
                </Link>
                <a href="mailto:info@vaalhub.co.za" className="block text-xs text-gray-400 hover:text-gray-600">
                  Still need help? info@vaalhub.co.za
                </a>
              </div>
            </>
          )}

          {/* ── Token present but verification failed ── */}
          {status === 'error' && (
            <>
              <div className="flex items-center justify-center w-16 h-16 bg-red-100 rounded-full mx-auto mb-4">
                <svg className="w-8 h-8 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Verification Failed</h2>
              <p className="text-gray-600 mb-6">{message}</p>

              {/* Expired token (HTTP 410) → one-click token-based resend */}
              {isExpired && token && <ResendByTokenButton token={token} />}

              {/* Unknown/invalid error → email-based resend form as fallback */}
              {!isExpired && <ResendByEmailForm />}

              <div className="mt-5 space-y-2">
                <Link
                  to="/businesses"
                  className="block bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-2.5 px-6 rounded-lg transition-colors duration-200"
                >
                  Back to Businesses
                </Link>
                <a
                  href="mailto:info@vaalhub.co.za"
                  className="block text-xs text-gray-400 hover:text-gray-600"
                >
                  Still need help? info@vaalhub.co.za
                </a>
              </div>
            </>
          )}

        </div>
      </div>
    </div>
  );
}
