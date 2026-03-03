/**
 * NewsletterSignupBar — inline email capture section.
 * Warm, editorial feel with orange gradient. Used on article, events,
 * and businesses pages to convert readers into subscribers.
 */

import { useNewsletter } from '../../hooks/useNewsletter';

export default function NewsletterSignupBar() {
  const { email, setEmail, subscribe, isLoading, isSuccess, isError } = useNewsletter();

  return (
    <section
      className="w-full relative overflow-hidden"
      style={{
        background: 'linear-gradient(135deg, #c2410c 0%, #ea580c 40%, #f97316 70%, #fb923c 100%)',
      }}
    >
      {/* Subtle dot-grid texture — newspaper print nod */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage:
            'radial-gradient(circle, rgba(255,255,255,0.07) 1px, transparent 1px)',
          backgroundSize: '20px 20px',
        }}
      />

      {/* Decorative arc top-right */}
      <div
        className="absolute -top-16 -right-16 w-48 h-48 rounded-full pointer-events-none"
        style={{ background: 'rgba(255,255,255,0.06)' }}
      />
      <div
        className="absolute -bottom-10 -left-10 w-32 h-32 rounded-full pointer-events-none"
        style={{ background: 'rgba(0,0,0,0.08)' }}
      />

      <div className="relative max-w-4xl mx-auto px-6 py-10 sm:py-12">

        {/* ── SUCCESS STATE ─────────────────────────────────── */}
        {isSuccess ? (
          <div className="flex flex-col items-center text-center gap-3 py-2">
            {/* Animated checkmark circle */}
            <div
              className="flex items-center justify-center w-14 h-14 rounded-full mb-1"
              style={{ background: 'rgba(255,255,255,0.2)' }}
            >
              <svg
                className="w-8 h-8 text-white"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2.5}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <p className="text-white text-xl font-bold tracking-tight">
              You're in!
            </p>
            <p className="text-orange-100 text-sm max-w-xs">
              Welcome to the VaalHub community. Local news, straight to your inbox.
            </p>
          </div>
        ) : (
          /* ── DEFAULT / FORM STATE ─────────────────────────── */
          <div className="flex flex-col lg:flex-row lg:items-center gap-6 lg:gap-10">

            {/* Left: icon + copy */}
            <div className="flex items-start gap-4 lg:flex-shrink-0">
              {/* Mail icon */}
              <div
                className="flex-shrink-0 flex items-center justify-center w-12 h-12 rounded-xl mt-0.5"
                style={{ background: 'rgba(255,255,255,0.18)' }}
              >
                <svg
                  className="w-6 h-6 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={1.8}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75"
                  />
                </svg>
              </div>

              <div>
                <h3 className="text-white font-bold text-lg leading-snug">
                  Stay informed. Get local news delivered.
                </h3>
                <p className="text-orange-100 text-sm mt-1 leading-relaxed">
                  Join thousands of Vaal Triangle residents who read VaalHub first.
                </p>
              </div>
            </div>

            {/* Right: email form */}
            <form
              onSubmit={subscribe}
              className="flex flex-col sm:flex-row gap-3 w-full lg:max-w-md"
            >
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Your email address"
                required
                disabled={isLoading}
                className="flex-1 px-4 py-3 rounded-lg text-gray-900 text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-white/60 disabled:opacity-60 bg-white shadow-sm"
              />
              <button
                type="submit"
                disabled={isLoading || !email}
                className="flex items-center justify-center gap-2 px-6 py-3 rounded-lg font-semibold text-sm transition-all duration-150 disabled:opacity-60 disabled:cursor-not-allowed"
                style={{
                  background: isLoading ? 'rgba(0,0,0,0.25)' : 'rgba(0,0,0,0.28)',
                  color: '#fff',
                  border: '1.5px solid rgba(255,255,255,0.35)',
                  backdropFilter: 'blur(4px)',
                }}
                onMouseEnter={(e) => {
                  if (!isLoading) e.currentTarget.style.background = 'rgba(0,0,0,0.42)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = isLoading
                    ? 'rgba(0,0,0,0.25)'
                    : 'rgba(0,0,0,0.28)';
                }}
              >
                {isLoading ? (
                  <>
                    <svg
                      className="animate-spin w-4 h-4"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8v8H4z"
                      />
                    </svg>
                    Subscribing…
                  </>
                ) : (
                  'Subscribe'
                )}
              </button>
            </form>
          </div>
        )}

        {/* Error message — shown below form */}
        {isError && !isSuccess && (
          <p className="mt-3 text-center text-sm font-medium text-white/90">
            ⚠️ Something went wrong. Please try again.
          </p>
        )}

        {/* Privacy note */}
        {!isSuccess && (
          <p className="mt-4 text-center text-xs text-orange-200 lg:text-left lg:pl-16">
            No spam, ever. Unsubscribe at any time.
          </p>
        )}
      </div>
    </section>
  );
}
