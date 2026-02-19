/**
 * SponsorBanner — horizontal sponsor strip shown on Events, News, Businesses pages.
 * Fetches active sponsors from /api/sponsors and renders a gold-themed banner.
 * Supports multiple sponsors (auto-rotates every 6 s when there is more than one).
 */

import { useState, useEffect } from 'react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export default function SponsorBanner() {
  const [sponsors, setSponsors] = useState([]);
  const [current, setCurrent] = useState(0);
  const [visible, setVisible] = useState(true);

  // Fetch sponsors
  useEffect(() => {
    fetch(`${API_URL}/api/sponsors`)
      .then((r) => r.json())
      .then((d) => {
        if (d.success && d.data.length > 0) setSponsors(d.data);
      })
      .catch(() => {}); // silently ignore if API unavailable
  }, []);

  // Auto-rotate when there are multiple sponsors
  useEffect(() => {
    if (sponsors.length <= 1) return;
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % sponsors.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [sponsors.length]);

  // Don't render if dismissed or no sponsors
  if (!visible || sponsors.length === 0) return null;

  const sp = sponsors[current];

  return (
    <div
      className="w-full"
      style={{
        background: 'linear-gradient(90deg, #1a1a1a 0%, #2d2d2d 60%, #1a1a1a 100%)',
        borderTop: '2px solid #d4af37',
        borderBottom: '2px solid #d4af37',
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between gap-4 flex-wrap">

        {/* Left: sponsored badge + logo / name */}
        <div className="flex items-center gap-3 min-w-0">
          <span
            className="flex-shrink-0 px-2.5 py-0.5 text-xs font-bold rounded-full"
            style={{
              background: '#d4af37',
              color: '#1a1a1a',
              boxShadow: '0 0 8px 2px rgba(212,175,55,0.5)',
            }}
          >
            ✦ Sponsored
          </span>

          {sp.logo_url && (
            <img
              src={sp.logo_url}
              alt={sp.name}
              className="h-8 w-auto object-contain flex-shrink-0"
              style={{ maxWidth: '90px' }}
            />
          )}

          <div className="min-w-0">
            <p className="text-white font-bold text-sm truncate">{sp.name}</p>
            {sp.tagline && (
              <p className="text-gray-400 text-xs truncate">{sp.tagline}</p>
            )}
          </div>
        </div>

        {/* Right: visit website + dots (if multiple) + close */}
        <div className="flex items-center gap-3 flex-shrink-0">
          {/* Sponsor dots */}
          {sponsors.length > 1 && (
            <div className="flex gap-1">
              {sponsors.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrent(i)}
                  className={`rounded-full transition-all duration-300 ${
                    i === current ? 'w-4 h-2 bg-yellow-400' : 'w-2 h-2 bg-gray-600 hover:bg-gray-400'
                  }`}
                  aria-label={`Sponsor ${i + 1}`}
                />
              ))}
            </div>
          )}

          {sp.website_url && (
            <a
              href={sp.website_url}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-1.5 text-xs font-bold rounded-md transition-all hover:scale-105 flex-shrink-0"
              style={{ background: '#d4af37', color: '#1a1a1a' }}
            >
              Visit Website
            </a>
          )}

          {/* Dismiss */}
          <button
            onClick={() => setVisible(false)}
            className="text-gray-500 hover:text-gray-300 transition-colors text-lg leading-none flex-shrink-0"
            aria-label="Close sponsor banner"
          >
            ×
          </button>
        </div>
      </div>
    </div>
  );
}
