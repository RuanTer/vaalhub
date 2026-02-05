import { useNewsletter } from '../hooks/useNewsletter';
import { LIMITS } from '../config/constants';
import { Link } from 'react-router-dom';

const Subscribe = () => {
  const { email, setEmail, status, subscribe } = useNewsletter();

  const shareLinks = {
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent('https://vaalhub.co.za/subscribe')}`,
    whatsapp: `https://wa.me/?text=${encodeURIComponent('Stay updated with local news from the Vaal Triangle! Subscribe here: https://vaalhub.co.za/subscribe')}`,
    twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent('Stay updated with local news from the Vaal Triangle!')}&url=${encodeURIComponent('https://vaalhub.co.za/subscribe')}`,
  };

  return (
    <div>
      {/* Hero Banner */}
      <div className="bg-gray-900 text-white py-14">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-3xl md:text-4xl font-bold mb-3">Stay in the Loop</h1>
          <p className="text-gray-400 text-lg max-w-xl mx-auto">
            Get the latest local news, events, and stories from the Vaal Triangle delivered straight to your inbox.
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md mx-auto">

          {/* Subscribe Card */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
            <h2 className="text-xl font-bold text-gray-900 mb-2 text-center">Subscribe to VaalHub</h2>
            <p className="text-gray-500 text-sm text-center mb-6">
              Join residents staying informed about the Vaal Triangle.
            </p>

            <form onSubmit={subscribe} className="space-y-4">
              <div>
                <label htmlFor="subscribe-email" className="block text-sm font-medium text-gray-700 mb-1.5">
                  Email Address
                </label>
                <input
                  type="email"
                  id="subscribe-email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  maxLength={LIMITS.EMAIL_MAX_LENGTH}
                  placeholder="you@email.com"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-vaal-orange-500 focus:border-vaal-orange-500 outline-none transition-shadow text-sm"
                />
              </div>

              <button
                type="submit"
                disabled={status === 'loading'}
                className="w-full px-4 py-3 bg-vaal-orange-500 text-white rounded-lg hover:bg-vaal-orange-600 transition-colors font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {status === 'loading' ? 'Subscribing...' : 'Subscribe Now'}
              </button>

              {status === 'success' && (
                <div className="p-4 bg-green-50 border border-green-200 rounded-lg text-center">
                  <p className="text-green-800 font-semibold text-sm">You are subscribed!</p>
                  <p className="text-green-600 text-xs mt-0.5">Thank you for joining the VaalHub community.</p>
                </div>
              )}

              {status === 'error' && (
                <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-red-800 text-sm">Something went wrong. Please try again.</p>
                </div>
              )}
            </form>

            <p className="text-xs text-gray-400 text-center mt-4">
              We respect your privacy. Read our{' '}
              <Link to="/privacy" className="text-vaal-orange-500 hover:text-vaal-orange-600">Privacy Policy</Link>.
            </p>
          </div>

          {/* Share this page */}
          <div className="mt-6 bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <p className="text-sm text-gray-600 text-center mb-4">
              Know someone who would love to stay updated? Share this page!
            </p>
            <div className="flex justify-center gap-3 flex-wrap">
              {/* Facebook */}
              <a
                href={shareLinks.facebook}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-4 py-2.5 bg-[#1877F2] text-white rounded-lg hover:bg-[#1661cf] transition-colors text-sm font-medium"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" />
                </svg>
                Facebook
              </a>

              {/* WhatsApp */}
              <a
                href={shareLinks.whatsapp}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-4 py-2.5 bg-[#25D366] text-white rounded-lg hover:bg-[#1da85e] transition-colors text-sm font-medium"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                </svg>
                WhatsApp
              </a>

              {/* Twitter / X */}
              <a
                href={shareLinks.twitter}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-4 py-2.5 bg-gray-900 text-white rounded-lg hover:bg-gray-700 transition-colors text-sm font-medium"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
                X
              </a>
            </div>
          </div>

          {/* Copy link */}
          <div className="mt-4 bg-white rounded-xl shadow-sm border border-gray-200 p-5">
            <p className="text-xs text-gray-500 text-center mb-2">Or copy the link directly</p>
            <div className="flex gap-2">
              <input
                type="text"
                value="https://vaalhub.co.za/subscribe"
                readOnly
                className="flex-1 px-3 py-2 border border-gray-200 rounded-lg text-sm text-gray-700 bg-gray-50 select-all"
                onFocus={(e) => e.target.select()}
              />
              <button
                onClick={() => {
                  navigator.clipboard.writeText('https://vaalhub.co.za/subscribe');
                  alert('Link copied!');
                }}
                className="px-4 py-2 bg-vaal-orange-500 text-white rounded-lg hover:bg-vaal-orange-600 transition-colors text-sm font-medium whitespace-nowrap"
              >
                Copy
              </button>
            </div>
          </div>

          {/* Footer note */}
          <div className="mt-6 text-center">
            <p className="text-xs text-gray-400">
              Also follow us on{' '}
              <a
                href="https://www.facebook.com/profile.php?id=61587360156408"
                target="_blank"
                rel="noopener noreferrer"
                className="text-vaal-orange-500 hover:text-vaal-orange-600 font-medium"
              >
                Facebook
              </a>{' '}
              for daily updates.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Subscribe;
