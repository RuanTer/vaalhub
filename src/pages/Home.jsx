import { useState, useEffect, useCallback, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { buildPageMeta } from '../hooks/useSEO';
import { TIMING } from '../config/constants';
import Modal from '../components/ui/Modal';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

// Static placeholder content shown when no live API is available
const PLACEHOLDER_EVENTS = [
  {
    event_id: 1,
    title: 'Vaal Community Market',
    date_start: '2025-03-15',
    location: 'Vanderbijlpark',
    category: 'Market',
    description: 'Browse local produce, crafts, and food stalls at the monthly Vaal community market.',
    image_url: 'https://images.unsplash.com/photo-1488459716781-31db52582fe9?w=600',
  },
  {
    event_id: 2,
    title: 'Vaal River Festival',
    date_start: '2025-04-05',
    location: 'Vereeniging',
    category: 'Festival',
    description: 'Annual riverside festival featuring live music, water sports, and local food vendors.',
    image_url: 'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=600',
  },
  {
    event_id: 3,
    title: 'Business Networking Evening',
    date_start: '2025-03-22',
    location: 'Meyerton',
    category: 'Networking',
    description: 'Connect with local business owners and entrepreneurs across the Vaal Triangle.',
    image_url: 'https://images.unsplash.com/photo-1515187029135-18ee286d815b?w=600',
  },
];

const PLACEHOLDER_NEWS = [
  {
    news_id: 1,
    headline: 'Vaal Triangle Welcomes New Community Development Projects',
    summary: 'Several new infrastructure and community upliftment projects have been announced for the Vaal Triangle region.',
    category: 'Community',
    area: 'Vaal Triangle',
    publish_date: '2025-02-10',
    image_url: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=600',
  },
  {
    news_id: 2,
    headline: 'Local Businesses Thrive as Tourism Grows in the Vaal',
    summary: 'Small businesses across Vanderbijlpark and Vereeniging are reporting increased foot traffic as tourism picks up.',
    category: 'Business',
    area: 'Vanderbijlpark',
    publish_date: '2025-02-08',
    image_url: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=600',
  },
  {
    news_id: 3,
    headline: 'Vaal River Water Levels Improve After Recent Rainfall',
    summary: 'Recent rains have brought welcome relief to the Vaal Dam, with levels rising significantly over the past month.',
    category: 'Environment',
    area: 'Vereeniging',
    publish_date: '2025-02-05',
    image_url: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600',
  },
];

// ─── Horizontal scroll carousel component ──────────────────────
// Desktop: shows as grid when ≤3 cards; activates carousel when >3
// Mobile: always carousel with swipe indicator dots
function CardCarousel({ children, itemCount }) {
  const trackRef = useRef(null);
  const [canScroll, setCanScroll] = useState(false);
  const [scrollPct, setScrollPct] = useState(0);
  const [isMobile, setIsMobile] = useState(false);

  // Detect mobile
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  // Determine if carousel should be active
  const carouselActive = isMobile || itemCount > 3;

  // Track scroll progress for dot indicator
  const handleScroll = useCallback(() => {
    const el = trackRef.current;
    if (!el) return;
    const max = el.scrollWidth - el.clientWidth;
    setScrollPct(max > 0 ? el.scrollLeft / max : 0);
    setCanScroll(max > 0);
  }, []);

  useEffect(() => {
    const el = trackRef.current;
    if (!el) return;
    // check on mount
    const max = el.scrollWidth - el.clientWidth;
    setCanScroll(max > 0);
    el.addEventListener('scroll', handleScroll, { passive: true });
    return () => el.removeEventListener('scroll', handleScroll);
  }, [handleScroll, children]);

  if (!carouselActive) {
    // Plain grid (desktop, ≤3 cards)
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {children}
      </div>
    );
  }

  // Carousel mode
  const dotCount = Math.max(1, itemCount - 2); // rough dot indicator
  const activeDot = Math.round(scrollPct * (dotCount - 1));

  return (
    <div className="relative">
      {/* Scrollable track */}
      <div
        ref={trackRef}
        className="flex gap-5 overflow-x-auto pb-3 snap-x snap-mandatory"
        style={{
          scrollbarWidth: 'none',
          msOverflowStyle: 'none',
          WebkitOverflowScrolling: 'touch',
        }}
      >
        {/* Each child gets a fixed-width snap card */}
        {Array.isArray(children) ? children.map((child, i) => (
          <div
            key={i}
            className="flex-shrink-0 snap-start"
            style={{ width: isMobile ? '82vw' : '320px', maxWidth: '360px' }}
          >
            {child}
          </div>
        )) : (
          <div className="flex-shrink-0 snap-start" style={{ width: isMobile ? '82vw' : '320px', maxWidth: '360px' }}>
            {children}
          </div>
        )}
      </div>

      {/* Swipe indicator (mobile always, desktop if scrollable) */}
      {(isMobile || canScroll) && (
        <div className="mt-3 flex flex-col items-center gap-1">
          {isMobile && (
            <p className="text-xs text-gray-400 flex items-center gap-1">
              <svg className="w-3.5 h-3.5 text-vaal-orange-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
              Swipe to see more
            </p>
          )}
          {/* Progress dots */}
          <div className="flex gap-1.5 justify-center">
            {Array.from({ length: dotCount }).map((_, i) => (
              <div
                key={i}
                className={`rounded-full transition-all duration-300 ${
                  i === activeDot
                    ? 'w-5 h-2 bg-vaal-orange-500'
                    : 'w-2 h-2 bg-gray-300'
                }`}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

const Home = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [activeBox, setActiveBox] = useState(0);

  // Featured content state — start with placeholders so sections always show
  const [featuredEvents, setFeaturedEvents] = useState(PLACEHOLDER_EVENTS);
  const [featuredNews, setFeaturedNews] = useState(PLACEHOLDER_NEWS);
  const [loadingFeatured, setLoadingFeatured] = useState(false);

  // Sponsors + hero slides from API
  const [sponsors, setSponsors] = useState([]);
  const [heroSlidesDB, setHeroSlidesDB] = useState([]);

  // Hero swipe state
  const [heroTouchStartX, setHeroTouchStartX] = useState(null);
  const [heroDragOffset, setHeroDragOffset] = useState(0);

  // Event detail modal (card click → full detail popup, same as Events page)
  const [selectedEvent, setSelectedEvent] = useState(null);

  // Modal state
  const [showEventModal, setShowEventModal] = useState(false);
  const [showBusinessModal, setShowBusinessModal] = useState(false);
  const [showSponsorModal, setShowSponsorModal] = useState(false);
  const [activeSponsor, setActiveSponsor] = useState(null);
  const [formSubmitted, setFormSubmitted] = useState(false);

  // Form state
  const [eventForm, setEventForm] = useState({ name: '', email: '', phone: '', eventName: '', date: '', location: '', description: '' });
  const [businessForm, setBusinessForm] = useState({ name: '', email: '', phone: '', businessName: '', category: '', location: '', website: '', description: '' });

  // ── Convert DB hero slides into slide objects ────────────────────
  // Fallback hardcoded slides used before the API responds
  const FALLBACK_SLIDES = [
    {
      title: 'Discover Local Impact in',
      highlight: 'Communities Worldwide',
      description: 'Your trusted source for local news, events, and business information across the Vaal Triangle.',
      image: 'https://images.unsplash.com/photo-1464219789935-c2d9d9aba644?w=1200',
      buttons: [{ text: 'Local Businesses', link: '/businesses', primary: true }, { text: 'Explore Events', link: '/events', primary: false }],
      duration: 3000,
      display_order: 0,
    },
    {
      title: 'Advertise Your Business',
      highlight: 'Reach Local Customers',
      description: 'Connect with thousands of local residents and grow your business in the Vaal Triangle community.',
      image: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=1200',
      buttons: [{ text: 'Get Started', link: '/advertise', primary: true }, { text: 'Add Your Business', link: '/verify-business', primary: false }],
      duration: 4000,
      display_order: 99,
    },
  ];

  // Map DB rows → slide objects
  const dbSlides = heroSlidesDB.map((s) => ({
    title: s.title || '',
    highlight: s.highlight || '',
    description: s.description || '',
    image: s.image_url || 'https://images.unsplash.com/photo-1464219789935-c2d9d9aba644?w=1200',
    buttons: [
      ...(s.btn1_text ? [{ text: s.btn1_text, link: s.btn1_link || '/', primary: true }] : []),
      ...(s.btn2_text ? [{ text: s.btn2_text, link: s.btn2_link || '/', primary: false }] : []),
    ],
    duration: s.duration || 4000,
    display_order: s.display_order ?? 0,
  }));

  // Use DB slides when loaded, otherwise use fallbacks
  const baseSlides = dbSlides.length > 0 ? dbSlides : FALLBACK_SLIDES;

  // Sponsor slides injected between base slides based on display_order:
  // sponsor slides sit at display_order 50, so they appear between order 0–49 and 50+
  const sponsorSlides = sponsors.map((sp) => ({
    title: sp.name,
    highlight: sp.tagline || '',
    description: sp.description || '',
    image: sp.hero_image_url || sp.logo_url || 'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=1200',
    isAdvertisement: true,
    sponsorUrl: sp.website_url || '',
    buttons: [],
    duration: 7000,
    display_order: 50,
    sponsorData: sp,
  }));

  // Merge and sort all slides by display_order
  const heroSlides = [...baseSlides, ...sponsorSlides].sort(
    (a, b) => (a.display_order ?? 0) - (b.display_order ?? 0)
  );

  const keyFocusAreas = [
    {
      number: '1',
      title: 'Celebrate Local History',
      description: 'Preserve and share the Vaal Triangle\'s rich heritage, educating residents and visitors about historic sites, stories, and cultural identity.',
    },
    {
      number: '2',
      title: 'Promote Tourism & Activities',
      description: 'Highlight attractions, outdoor experiences, events, and hidden gems across the region to support exploration and boost local tourism participation.',
    },
    {
      number: '3',
      title: 'Support Local Businesses',
      description: 'Showcase and uplift small enterprises, entrepreneurs, and community businesses — helping residents discover services, fostering economic growth and local pride.',
    },
    {
      number: '4',
      title: 'Strengthen Community Engagement',
      description: 'Provide timely news, events, resources, and interactive content that connects residents, encourages participation, and builds stronger community relationships.',
    },
  ];

  // ─── Fetch featured content + sponsors ───────────────────────
  useEffect(() => {
    const fetchAll = async () => {
      try {
        setLoadingFeatured(true);

        const [eventsRes, newsRes, sponsorsRes, heroRes] = await Promise.allSettled([
          fetch(`${API_URL}/api/featured/events?limit=5`),
          fetch(`${API_URL}/api/featured/news?limit=5`),
          fetch(`${API_URL}/api/sponsors`),
          fetch(`${API_URL}/api/hero-slides`),
        ]);

        if (eventsRes.status === 'fulfilled') {
          const d = await eventsRes.value.json();
          if (d.success && d.data.length > 0) setFeaturedEvents(d.data);
        }
        if (newsRes.status === 'fulfilled') {
          const d = await newsRes.value.json();
          if (d.success && d.data.length > 0) setFeaturedNews(d.data);
        }
        if (sponsorsRes.status === 'fulfilled') {
          const d = await sponsorsRes.value.json();
          if (d.success) setSponsors(d.data);
        }
        if (heroRes.status === 'fulfilled') {
          const d = await heroRes.value.json();
          if (d.success && d.data.length > 0) setHeroSlidesDB(d.data);
        }
      } catch (error) {
        console.error('Error fetching homepage data:', error);
      } finally {
        setLoadingFeatured(false);
      }
    };
    fetchAll();
  }, []);

  // ─── Hero auto-advance ────────────────────────────────────────
  useEffect(() => {
    if (heroSlides.length === 0) return;
    const duration = heroSlides[currentSlide]?.duration || TIMING.CAROUSEL_INTERVAL;
    const timer = setTimeout(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, duration);
    return () => clearTimeout(timer);
  }, [currentSlide, heroSlides.length]);

  // Keep currentSlide in bounds when slides array changes (sponsors load async)
  useEffect(() => {
    if (currentSlide >= heroSlides.length && heroSlides.length > 0) {
      setCurrentSlide(0);
    }
  }, [heroSlides.length]);

  // ─── Key Focus Areas auto-rotate ─────────────────────────────
  useEffect(() => {
    const boxTimer = setInterval(() => {
      setActiveBox((prev) => (prev + 1) % keyFocusAreas.length);
    }, TIMING.FEATURED_STORIES_INTERVAL);
    return () => clearInterval(boxTimer);
  }, []);

  // ─── Hero navigation ─────────────────────────────────────────
  const nextSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
  }, [heroSlides.length]);

  const prevSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev - 1 + heroSlides.length) % heroSlides.length);
  }, [heroSlides.length]);

  // ─── Hero touch / swipe ──────────────────────────────────────
  const onHeroTouchStart = (e) => { setHeroTouchStartX(e.touches[0].clientX); setHeroDragOffset(0); };
  const onHeroTouchMove = (e) => { if (heroTouchStartX === null) return; setHeroDragOffset(e.touches[0].clientX - heroTouchStartX); };
  const onHeroTouchEnd = () => {
    if (heroTouchStartX === null) return;
    if (heroDragOffset < -50) nextSlide();
    else if (heroDragOffset > 50) prevSlide();
    setHeroTouchStartX(null); setHeroDragOffset(0);
  };

  // ─── Format dates ─────────────────────────────────────────────
  const formatEventDate = (dateStr) => {
    if (!dateStr) return 'Date TBD';
    return new Date(dateStr).toLocaleDateString('en-ZA', { day: 'numeric', month: 'short', year: 'numeric' });
  };

  const formatNewsDate = (dateStr) => {
    if (!dateStr) return '';
    return new Date(dateStr).toLocaleDateString('en-ZA', { day: 'numeric', month: 'long', year: 'numeric' });
  };

  // Long date format for event detail modal (matches Events page)
  const formatEventDateLong = (dateStr) => {
    if (!dateStr) return 'Date TBA';
    return new Date(dateStr).toLocaleDateString('en-ZA', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
  };

  // ─── Form submit handlers ─────────────────────────────────────
  const handleEventSubmit = (e) => {
    e.preventDefault();
    const subject = encodeURIComponent(`New Event Submission: ${eventForm.eventName}`);
    const body = encodeURIComponent(
      `Name: ${eventForm.name}\nEmail: ${eventForm.email}\nPhone: ${eventForm.phone}\n\nEvent Name: ${eventForm.eventName}\nDate: ${eventForm.date}\nLocation: ${eventForm.location}\n\nDescription:\n${eventForm.description}`
    );
    window.location.href = `mailto:info@vaalhub.co.za?subject=${subject}&body=${body}`;
    setFormSubmitted(true);
    setTimeout(() => {
      setShowEventModal(false);
      setFormSubmitted(false);
      setEventForm({ name: '', email: '', phone: '', eventName: '', date: '', location: '', description: '' });
    }, 3000);
  };

  const handleBusinessSubmit = (e) => {
    e.preventDefault();
    const subject = encodeURIComponent(`New Business Submission: ${businessForm.businessName}`);
    const body = encodeURIComponent(
      `Contact Name: ${businessForm.name}\nEmail: ${businessForm.email}\nPhone: ${businessForm.phone}\n\nBusiness Name: ${businessForm.businessName}\nCategory: ${businessForm.category}\nLocation: ${businessForm.location}\nWebsite: ${businessForm.website}\n\nDescription:\n${businessForm.description}`
    );
    window.location.href = `mailto:info@vaalhub.co.za?subject=${subject}&body=${body}`;
    setFormSubmitted(true);
    setTimeout(() => {
      setShowBusinessModal(false);
      setFormSubmitted(false);
      setBusinessForm({ name: '', email: '', phone: '', businessName: '', category: '', location: '', website: '', description: '' });
    }, 3000);
  };

  const inputClass = 'w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-vaal-orange-500 focus:border-transparent';

  return (
    <div>
      <Helmet>
        {buildPageMeta({
          title: 'VaalHub – Local News, Events & Business',
          description: 'VaalHub is your trusted source for local news, events, and business information across the Vaal Triangle – Vereeniging, Vanderbijlpark, Meyerton, Sharpeville and Sasolburg.',
          path: '/',
        })}
      </Helmet>

      {/* ═══════════════════════════════════════════════════════════
          HERO CAROUSEL
          ═══════════════════════════════════════════════════════════ */}
      <section className="bg-white">
        <div
          className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4"
          onTouchStart={onHeroTouchStart}
          onTouchMove={onHeroTouchMove}
          onTouchEnd={onHeroTouchEnd}
        >
          <div className="relative overflow-hidden rounded-2xl" style={{ height: '38vh', maxHeight: '420px', minHeight: '220px' }}>
            <div
              className="flex h-full transition-transform duration-500 ease-out will-change-transform"
              style={{ transform: `translate3d(calc(-${currentSlide * 100}% + ${heroDragOffset}px), 0, 0)` }}
            >
              {heroSlides.map((slide, index) => (
                <div key={index} className={`relative flex-shrink-0 w-full h-full ${slide.isAdvertisement ? 'bg-gray-100' : ''}`}>
                  <img
                    src={slide.image}
                    alt={slide.title}
                    className={`w-full h-full ${slide.isAdvertisement ? 'object-contain' : 'object-cover'}`}
                    onError={(e) => { e.target.style.display = 'none'; }}
                  />
                  {/* Gold glowing Sponsored badge */}
                  {slide.isAdvertisement && (
                    <span
                      className="absolute top-3 left-3 z-10 px-3 py-1 text-xs font-bold rounded-full"
                      style={{
                        background: '#d4af37',
                        color: '#1a1a1a',
                        boxShadow: '0 0 10px 3px rgba(212,175,55,0.7), 0 0 20px 6px rgba(212,175,55,0.3)',
                        animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
                      }}
                    >
                      ✦ Sponsored
                    </span>
                  )}
                </div>
              ))}
            </div>

            {/* Arrows */}
            <button onClick={prevSlide} className="absolute left-2 top-1/2 -translate-y-1/2 z-10 hidden sm:flex items-center justify-center w-9 h-9 rounded-full bg-black/30 hover:bg-black/50 text-white transition-colors" aria-label="Previous slide">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
            </button>
            <button onClick={nextSlide} className="absolute right-2 top-1/2 -translate-y-1/2 z-10 hidden sm:flex items-center justify-center w-9 h-9 rounded-full bg-black/30 hover:bg-black/50 text-white transition-colors" aria-label="Next slide">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
            </button>
          </div>
        </div>

        {/* Text + buttons + dots */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-6 pt-5 relative overflow-hidden" style={{ height: '160px' }}>
          {heroSlides.map((slide, index) => (
            <div
              key={index}
              className="transition-opacity duration-500 ease-in-out"
              style={{
                opacity: index === currentSlide ? 1 : 0,
                position: index === currentSlide ? 'relative' : 'absolute',
                inset: index === currentSlide ? 'auto' : 0,
                pointerEvents: index === currentSlide ? 'auto' : 'none',
              }}
            >
              <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 leading-tight">
                {slide.title}{' '}
                {slide.isAdvertisement ? (
                  <span className="font-bold text-gray-900">{slide.highlight}</span>
                ) : (
                  <span className="text-vaal-orange-500">{slide.highlight}</span>
                )}
              </h1>

              <p className="text-gray-600 text-sm mt-1.5 max-w-2xl">{slide.description}</p>

              <div className="flex flex-wrap gap-3 mt-3">
                {slide.buttons.map((btn, i) => (
                  <Link
                    key={i}
                    to={btn.link}
                    className={`px-5 py-1.5 rounded-md text-sm font-semibold transition-colors ${
                      btn.primary
                        ? 'bg-vaal-orange-500 text-white hover:bg-vaal-orange-600'
                        : 'bg-gray-100 text-gray-800 border border-gray-200 hover:bg-gray-200'
                    }`}
                  >
                    {btn.text}
                  </Link>
                ))}
                {/* Contact sponsor button on ad slide */}
                {slide.isAdvertisement && (
                  <button
                    onClick={() => { setActiveSponsor(slide.sponsorData); setShowSponsorModal(true); }}
                    className="px-5 py-1.5 rounded-md text-sm font-semibold border-2 transition-all hover:scale-105"
                    style={{ borderColor: '#d4af37', color: '#d4af37', background: 'transparent' }}
                  >
                    Contact Sponsor
                  </button>
                )}
              </div>
            </div>
          ))}

          {/* Dots */}
          <div className="flex justify-center gap-2 mt-4">
            {heroSlides.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentSlide(i)}
                aria-label={`Go to slide ${i + 1}`}
                className={`rounded-full transition-all duration-300 ${
                  i === currentSlide ? 'w-7 h-2.5 bg-vaal-orange-500' : 'w-2.5 h-2.5 bg-gray-300 hover:bg-gray-400'
                }`}
              />
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════
          EVENTS IN THE VAAL — CAROUSEL
          ═══════════════════════════════════════════════════════════ */}
      {!loadingFeatured && featuredEvents.length > 0 && (
        <section className="py-12 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900">Events in the Vaal</h2>
              <Link
                to="/events"
                className="px-5 py-2 bg-vaal-orange-500 text-white text-sm font-semibold rounded-lg flex items-center gap-2 animate-pulse hover:animate-none hover:bg-vaal-orange-600 transition-colors"
              >
                View All Events
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>

            <CardCarousel itemCount={featuredEvents.length}>
              {featuredEvents.map((event) => (
                <div
                  key={event.event_id}
                  onClick={() => setSelectedEvent(event)}
                  className="bg-white rounded-lg shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col group h-full cursor-pointer transform hover:-translate-y-1"
                >
                  <div className="relative h-48 bg-gray-200 overflow-hidden">
                    {/* Placeholder — always present, revealed when image is absent or fails */}
                    <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-vaal-orange-100 to-vaal-orange-200">
                      <svg className="w-16 h-16 text-vaal-orange-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                    {event.image_url && (
                      <img
                        src={event.image_url}
                        alt={event.title}
                        className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                        onError={(e) => { e.target.style.display = 'none'; }}
                      />
                    )}
                    {event.category && (
                      <div className="absolute top-3 left-3 bg-vaal-orange-500 text-white px-3 py-1 rounded-full text-xs font-medium">
                        {event.category}
                      </div>
                    )}
                    {event.pinned === 1 && (
                      <div className="absolute top-3 right-3 bg-yellow-400 text-yellow-900 px-2 py-1 rounded-full text-xs font-bold flex items-center gap-1 shadow-md">
                        <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/></svg>
                        Popular
                      </div>
                    )}
                  </div>

                  <div className="p-5 flex flex-col flex-1">
                    <div className="flex-1">
                      <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-vaal-orange-600 transition-colors">
                        {event.title}
                      </h3>
                      <div className="space-y-2 mb-3">
                        <div className="flex items-center text-sm text-gray-600">
                          <svg className="w-4 h-4 mr-2 text-vaal-orange-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                          {formatEventDate(event.date_start)}
                        </div>
                        {event.location && (
                          <div className="flex items-center text-sm text-gray-600">
                            <svg className="w-4 h-4 mr-2 text-vaal-orange-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                            {event.location}
                          </div>
                        )}
                      </div>
                      {event.description && (
                        <p className="text-gray-600 text-sm line-clamp-2">{event.description}</p>
                      )}
                    </div>
                    {/* View Details button — same as Events page */}
                    <button className="w-full mt-4 py-2 px-4 bg-vaal-orange-500 hover:bg-vaal-orange-600 text-white font-medium rounded-lg transition-colors duration-200 flex items-center justify-center">
                      View Details
                      <svg className="ml-2 w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </button>
                  </div>
                </div>
              ))}
            </CardCarousel>
          </div>
        </section>
      )}

      {/* ═══════════════════════════════════════════════════════════
          TOP NEWS — CAROUSEL
          ═══════════════════════════════════════════════════════════ */}
      {!loadingFeatured && featuredNews.length > 0 && (
        <section className="py-12 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900">Top News</h2>
              <Link
                to="/news"
                className="px-5 py-2 bg-vaal-orange-500 text-white text-sm font-semibold rounded-lg flex items-center gap-2 animate-pulse hover:animate-none hover:bg-vaal-orange-600 transition-colors"
              >
                View All News
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>

            <CardCarousel itemCount={featuredNews.length}>
              {featuredNews.map((article) => (
                <Link
                  key={article.news_id}
                  to={`/news/${article.news_id}`}
                  className="bg-white rounded-lg shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col group border border-gray-100 h-full"
                >
                  <div className="aspect-video bg-gray-200 overflow-hidden relative">
                    {/* Placeholder — always present, revealed when image is absent or fails */}
                    <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200">
                      <svg className="w-12 h-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                      </svg>
                    </div>
                    {article.image_url && (
                      <img
                        src={article.image_url}
                        alt={article.headline}
                        className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                        onError={(e) => { e.target.style.display = 'none'; }}
                      />
                    )}
                  </div>

                  <div className="p-5 flex flex-col flex-1">
                    <div className="flex-1">
                      <div className="flex flex-wrap gap-2 mb-3">
                        {article.category && (
                          <span className="inline-block px-3 py-1 bg-vaal-orange-100 text-vaal-orange-700 text-xs font-medium rounded-full">
                            {article.category}
                          </span>
                        )}
                        {article.area && (
                          <span className="inline-block px-3 py-1 bg-gray-100 text-gray-700 text-xs font-medium rounded-full">
                            {article.area}
                          </span>
                        )}
                      </div>
                      <h3 className="text-base font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-vaal-orange-600 transition-colors">
                        {article.headline}
                      </h3>
                      {article.summary && (
                        <p className="text-gray-600 text-sm line-clamp-3 mb-2">{article.summary}</p>
                      )}
                      <p className="text-xs text-gray-400">{formatNewsDate(article.publish_date)}</p>
                    </div>
                    <div className="mt-4">
                      <span className="inline-flex items-center text-sm font-semibold text-vaal-orange-600 group-hover:text-vaal-orange-700">
                        Read More
                        <svg className="ml-1 w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </CardCarousel>
          </div>
        </section>
      )}

      {/* ═══════════════════════════════════════════════════════════
          KEY FOCUS AREAS
          ═══════════════════════════════════════════════════════════ */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Our Key Focus Areas</h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Discover how our core programs, stories, and commitment to transparency work together to create lasting change in our communities.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-0 border border-gray-200 rounded-xl overflow-hidden">
            {keyFocusAreas.map((area, index) => (
              <div
                key={index}
                className={`p-8 border-r border-b border-gray-200 last:border-r-0 transition-all duration-500 cursor-pointer ${
                  index === activeBox ? 'bg-vaal-orange-500 text-white' : 'bg-white text-gray-900 hover:bg-gray-50'
                }`}
                onClick={() => setActiveBox(index)}
              >
                <div className={`flex items-center justify-center w-12 h-12 rounded-full font-bold text-xl mb-4 ${
                  index === activeBox ? 'bg-white text-vaal-orange-500' : 'bg-gray-100 text-gray-900'
                }`}>
                  {area.number}
                </div>
                <h3 className="text-xl font-bold mb-3">{area.title}</h3>
                <p className={`text-sm ${index === activeBox ? 'text-white/90' : 'text-gray-600'}`}>{area.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════
          CALL TO ACTION
          ═══════════════════════════════════════════════════════════ */}
      <section className="py-16 bg-vaal-orange-500 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Building Stronger Communities Together</h2>
          <p className="text-xl mb-10 max-w-2xl mx-auto">
            Join us in celebrating and supporting the vibrant communities across the Vaal Triangle
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              to="/advertise"
              className="px-7 py-3 bg-white text-vaal-orange-600 rounded-lg hover:bg-gray-100 transition-colors font-semibold shadow"
            >
              Advertise With Us
            </Link>
            <button
              onClick={() => { setShowEventModal(true); setFormSubmitted(false); }}
              className="px-7 py-3 border-2 border-white text-white rounded-lg hover:bg-white hover:text-vaal-orange-600 transition-colors font-semibold"
            >
              Add Your Event
            </button>
            <button
              onClick={() => { setShowBusinessModal(true); setFormSubmitted(false); }}
              className="px-7 py-3 border-2 border-white text-white rounded-lg hover:bg-white hover:text-vaal-orange-600 transition-colors font-semibold"
            >
              Add Your Business
            </button>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════
          ADD YOUR EVENT MODAL
          ═══════════════════════════════════════════════════════════ */}
      {showEventModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="bg-vaal-orange-500 text-white px-6 py-5 rounded-t-2xl flex justify-between items-center">
              <div>
                <h3 className="text-xl font-bold">Add Your Event</h3>
                <p className="text-white/80 text-sm mt-1">Submit your event and we'll get it listed</p>
              </div>
              <button onClick={() => setShowEventModal(false)} className="text-white/80 hover:text-white text-2xl leading-none">&times;</button>
            </div>

            {formSubmitted ? (
              <div className="p-8 text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h4 className="text-lg font-bold text-gray-900 mb-2">Opening your email...</h4>
                <p className="text-gray-600 text-sm">Your email client is opening with your event details pre-filled. Just click Send!</p>
              </div>
            ) : (
              <form onSubmit={handleEventSubmit} className="p-6 space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">Your Name *</label>
                    <input type="text" required className={inputClass} value={eventForm.name} onChange={e => setEventForm({...eventForm, name: e.target.value})} placeholder="John Smith" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">Email *</label>
                    <input type="email" required className={inputClass} value={eventForm.email} onChange={e => setEventForm({...eventForm, email: e.target.value})} placeholder="you@email.com" />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Phone Number</label>
                  <input type="tel" className={inputClass} value={eventForm.phone} onChange={e => setEventForm({...eventForm, phone: e.target.value})} placeholder="+27 00 000 0000" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Event Name *</label>
                  <input type="text" required className={inputClass} value={eventForm.eventName} onChange={e => setEventForm({...eventForm, eventName: e.target.value})} placeholder="e.g. Vaal Market Day" />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">Date *</label>
                    <input type="date" required className={inputClass} value={eventForm.date} onChange={e => setEventForm({...eventForm, date: e.target.value})} />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">Location *</label>
                    <input type="text" required className={inputClass} value={eventForm.location} onChange={e => setEventForm({...eventForm, location: e.target.value})} placeholder="e.g. Vanderbijlpark" />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Event Description *</label>
                  <textarea required rows={4} className={inputClass} value={eventForm.description} onChange={e => setEventForm({...eventForm, description: e.target.value})} placeholder="Tell us about your event – what's happening, who it's for, cost, etc." />
                </div>
                <p className="text-xs text-gray-500">Clicking Submit will open your email client with all details pre-filled. Just click Send!</p>
                <div className="flex gap-3 pt-2">
                  <button type="button" onClick={() => setShowEventModal(false)} className="flex-1 px-4 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium text-sm">Cancel</button>
                  <button type="submit" className="flex-1 px-4 py-2.5 bg-vaal-orange-500 text-white rounded-lg hover:bg-vaal-orange-600 transition-colors font-semibold text-sm">Submit Event</button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* ═══════════════════════════════════════════════════════════
          ADD YOUR BUSINESS MODAL
          ═══════════════════════════════════════════════════════════ */}
      {showBusinessModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="bg-vaal-orange-500 text-white px-6 py-5 rounded-t-2xl flex justify-between items-center">
              <div>
                <h3 className="text-xl font-bold">Add Your Business</h3>
                <p className="text-white/80 text-sm mt-1">Get your business listed on VaalHub</p>
              </div>
              <button onClick={() => setShowBusinessModal(false)} className="text-white/80 hover:text-white text-2xl leading-none">&times;</button>
            </div>

            {formSubmitted ? (
              <div className="p-8 text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h4 className="text-lg font-bold text-gray-900 mb-2">Opening your email...</h4>
                <p className="text-gray-600 text-sm">Your email client is opening with your business details pre-filled. Just click Send!</p>
              </div>
            ) : (
              <form onSubmit={handleBusinessSubmit} className="p-6 space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">Your Name *</label>
                    <input type="text" required className={inputClass} value={businessForm.name} onChange={e => setBusinessForm({...businessForm, name: e.target.value})} placeholder="John Smith" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">Email *</label>
                    <input type="email" required className={inputClass} value={businessForm.email} onChange={e => setBusinessForm({...businessForm, email: e.target.value})} placeholder="you@email.com" />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Phone Number</label>
                  <input type="tel" className={inputClass} value={businessForm.phone} onChange={e => setBusinessForm({...businessForm, phone: e.target.value})} placeholder="+27 00 000 0000" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Business Name *</label>
                  <input type="text" required className={inputClass} value={businessForm.businessName} onChange={e => setBusinessForm({...businessForm, businessName: e.target.value})} placeholder="e.g. Vaal Plumbing Services" />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">Category *</label>
                    <select required className={inputClass} value={businessForm.category} onChange={e => setBusinessForm({...businessForm, category: e.target.value})}>
                      <option value="">Select category</option>
                      <option>Restaurant</option>
                      <option>Retail</option>
                      <option>Services</option>
                      <option>Healthcare</option>
                      <option>Entertainment</option>
                      <option>Automotive</option>
                      <option>Construction</option>
                      <option>Professional Services</option>
                      <option>Other</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">Location *</label>
                    <select required className={inputClass} value={businessForm.location} onChange={e => setBusinessForm({...businessForm, location: e.target.value})}>
                      <option value="">Select area</option>
                      <option>Vereeniging</option>
                      <option>Vanderbijlpark</option>
                      <option>Meyerton</option>
                      <option>Sasolburg</option>
                      <option>Sharpeville</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Website (optional)</label>
                  <input type="url" className={inputClass} value={businessForm.website} onChange={e => setBusinessForm({...businessForm, website: e.target.value})} placeholder="https://yourbusiness.co.za" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Business Description *</label>
                  <textarea required rows={3} className={inputClass} value={businessForm.description} onChange={e => setBusinessForm({...businessForm, description: e.target.value})} placeholder="Tell us about your business – what you do, services offered, etc." />
                </div>
                <p className="text-xs text-gray-500">Clicking Submit will open your email client with all details pre-filled. Just click Send!</p>
                <div className="flex gap-3 pt-2">
                  <button type="button" onClick={() => setShowBusinessModal(false)} className="flex-1 px-4 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium text-sm">Cancel</button>
                  <button type="submit" className="flex-1 px-4 py-2.5 bg-vaal-orange-500 text-white rounded-lg hover:bg-vaal-orange-600 transition-colors font-semibold text-sm">Submit Business</button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* ═══════════════════════════════════════════════════════════
          EVENT DETAIL MODAL (same layout as Events page)
          ═══════════════════════════════════════════════════════════ */}
      {selectedEvent && (
        <Modal
          isOpen={!!selectedEvent}
          onClose={() => setSelectedEvent(null)}
          title={selectedEvent.title}
        >
          <div className="space-y-6">
            {/* Event Image */}
            {selectedEvent.image_url && !selectedEvent.image_url.includes('data:image') && (
              <div className="w-full rounded-lg overflow-hidden bg-gray-100">
                <img
                  src={selectedEvent.image_url}
                  alt={selectedEvent.title}
                  className="w-full h-auto object-contain max-h-[500px]"
                  onError={(e) => { e.target.style.display = 'none'; }}
                />
              </div>
            )}

            {/* Tags */}
            <div className="flex flex-wrap gap-2">
              {selectedEvent.category && (
                <span className="inline-block px-4 py-2 bg-vaal-orange-100 text-vaal-orange-700 text-sm font-medium rounded-full">
                  {selectedEvent.category}
                </span>
              )}
              {selectedEvent.location && (
                <span className="inline-block px-4 py-2 bg-gray-100 text-gray-700 text-sm font-medium rounded-full">
                  📍 {selectedEvent.location}
                </span>
              )}
            </div>

            {/* Date & Time */}
            <div className="bg-gray-50 rounded-lg p-4">
              <h4 className="font-semibold text-gray-900 mb-2 flex items-center">
                <svg className="w-5 h-5 mr-2 text-vaal-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                When
              </h4>
              <p className="text-gray-700">
                <strong>Date:</strong> {formatEventDateLong(selectedEvent.date_start)}
                {selectedEvent.date_end && selectedEvent.date_end !== selectedEvent.date_start && (
                  <span> – {formatEventDateLong(selectedEvent.date_end)}</span>
                )}
              </p>
              {selectedEvent.time && (
                <p className="text-gray-700 mt-1"><strong>Time:</strong> {selectedEvent.time}</p>
              )}
            </div>

            {/* Description */}
            {selectedEvent.description && (
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">About This Event</h4>
                <p className="text-gray-700 whitespace-pre-line leading-relaxed">{selectedEvent.description}</p>
              </div>
            )}

            {/* Organizer */}
            {selectedEvent.organizer && (
              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="font-semibold text-gray-900 mb-2">Organizer</h4>
                <p className="text-gray-700">{selectedEvent.organizer}</p>
              </div>
            )}

            {/* Contact Info */}
            {selectedEvent.contact_info && (
              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="font-semibold text-gray-900 mb-2">Contact Information</h4>
                <p className="text-gray-700">{selectedEvent.contact_info}</p>
              </div>
            )}

            {/* Price */}
            {selectedEvent.price && (
              <div className="bg-vaal-orange-50 rounded-lg p-4 border border-vaal-orange-200">
                <h4 className="font-semibold text-gray-900 mb-2">Admission</h4>
                <p className="text-gray-700 font-medium">{selectedEvent.price}</p>
              </div>
            )}

            {/* Source link */}
            {selectedEvent.source_url && (
              <div className="pt-4 border-t border-gray-200">
                <p className="text-sm text-gray-500 mb-3">Want more information from the original source?</p>
                <a
                  href={selectedEvent.source_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-lg transition-colors duration-200"
                >
                  Visit Event Source
                  <svg className="ml-2 w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                </a>
              </div>
            )}
          </div>
        </Modal>
      )}

      {/* ═══════════════════════════════════════════════════════════
          CONTACT SPONSOR MODAL (dynamic — shows current sponsor)
          ═══════════════════════════════════════════════════════════ */}
      {showSponsorModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm">
            <div className="px-6 py-5 rounded-t-2xl flex justify-between items-center" style={{ background: 'linear-gradient(135deg, #1a1a1a, #2d2d2d)' }}>
              <div>
                <h3 className="text-xl font-bold" style={{ color: '#d4af37', textShadow: '0 0 8px rgba(212,175,55,0.6)' }}>Sponsor Info</h3>
                <p className="text-gray-400 text-sm mt-1">{activeSponsor?.name || 'Sponsor'}</p>
              </div>
              <button onClick={() => setShowSponsorModal(false)} className="text-gray-400 hover:text-white text-2xl leading-none">&times;</button>
            </div>
            <div className="p-6 space-y-4">
              <p className="text-gray-600 text-sm">
                Interested in working with {activeSponsor?.name || 'this sponsor'} or becoming a sponsor on VaalHub?
              </p>
              <div className="flex flex-col gap-3">
                {activeSponsor?.website_url && (
                  <a
                    href={activeSponsor.website_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full px-4 py-2.5 text-center text-sm font-bold rounded-lg transition-all hover:scale-105"
                    style={{ background: '#d4af37', color: '#1a1a1a', boxShadow: '0 0 10px 2px rgba(212,175,55,0.4)' }}
                  >
                    Visit {activeSponsor.name} Website
                  </a>
                )}
                <a
                  href="mailto:info@vaalhub.co.za?subject=Sponsorship%20Enquiry"
                  className="w-full px-4 py-2.5 text-center bg-vaal-orange-500 hover:bg-vaal-orange-600 text-white text-sm font-semibold rounded-lg transition-colors"
                >
                  Enquire About Sponsorship
                </a>
                <button onClick={() => setShowSponsorModal(false)} className="w-full px-4 py-2.5 border border-gray-300 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-50 transition-colors">
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default Home;
