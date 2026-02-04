import { useNewsletter } from '../hooks/useNewsletter';
import { LIMITS } from '../config/constants';

const FACEBOOK_PAGE_URL = 'https://www.facebook.com/profile.php?id=61587360156408';

const Subscribe = () => {
  const { email, setEmail, status, subscribe } = useNewsletter();

  const shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent('https://vaalhub.co.za/subscribe')}`;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Hero Banner */}
      <div className="bg-gray-900 text-white py-16">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="flex justify-center mb-4">
            <img src="/vh-logo.svg" alt="VaalHub" className="h-16 w-16 rounded-xl" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold mb-3">Stay in the Loop</h1>
          <p className="text-gray-400 text-lg max-w-xl mx-auto">
            Get the latest local news, events, and stories from the Vaal Triangle delivered straight to your inbox.
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex items-start justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-md">
          {/* Subscribe Card */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
            <h2 className="text-xl font-bold text-gray-900 mb-2 text-center">Subscribe to VaalHub</h2>
            <p className="text-gray-500 text-sm text-center mb-6">
              Join thousands of residents staying informed about the Vaal Triangle.
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
                  <p className="text-green-800 font-semibold text-sm">You\'re subscribed!</p>
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
              <a href="/privacy" className="text-vaal-orange-500 hover:text-vaal-orange-600">Privacy Policy</a>.
            </p>
          </div>

          {/* Share Section */}
          <div className="mt-6 bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <p className="text-sm text-gray-600 text-center mb-4">
              Know someone who\'d love to stay updated? Share this page!
            </p>
            <div className="flex justify-center gap-3">
              {/* Facebook Share */}
              <a
                href={shareUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-5 py-2.5 bg-[#1877F2] text-white rounded-lg hover:bg-[#1661cf] transition-colors text-sm font-medium"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" />
                </svg>
                Share on Facebook
              </a>
            </div>
          </div>

          {/* Follow us */}
          <div className="mt-4 text-center">
            <p className="text-xs text-gray-400">
              Also follow us on{' '}
              <a
                href={FACEBOOK_PAGE_URL}
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
