import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import ArticleCard from '../components/ui/ArticleCard';
import { TIMING } from '../config/constants';

const Home = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [activeBox, setActiveBox] = useState(0);
  const [currentArticleSlide, setCurrentArticleSlide] = useState(0);

  // Hero swipe state
  const [heroTouchStartX, setHeroTouchStartX] = useState(null);
  const [heroDragOffset, setHeroDragOffset] = useState(0);

  // Article swipe state
  const [articleTouchStartX, setArticleTouchStartX] = useState(null);
  const [articleDragOffset, setArticleDragOffset] = useState(0);

  const heroSlides = [
    {
      title: 'Discover Local Impact in',
      highlight: 'Communities Worldwide',
      description: 'Your trusted source for local news, events, and business information across the Vaal Triangle.',
      image: 'https://images.unsplash.com/photo-1464219789935-c2d9d9aba644?w=1200',
      buttons: [
        { text: 'Explore the Vaal', link: '/explore', primary: true },
        { text: 'Local Businesses', link: '/business', primary: false },
      ],
      duration: 3000,
    },
    {
      title: 'Keeping Your Operations Running With',
      highlight: 'Expert Electrical Solutions',
      description: 'Over 50 years\' combined experience, same-day delivery, reliable support that keeps operations moving.',
      image: '/ads/factorpro-logo.jpg',
      isAdvertisement: true,
      buttons: [],
      duration: 7000,
    },
    {
      title: 'Advertise Your Business',
      highlight: 'Reach Local Customers',
      description: 'Connect with thousands of local residents and grow your business in the Vaal Triangle community.',
      image: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=1200',
      buttons: [
        { text: 'Get Started', link: '/advertise', primary: true },
        { text: 'View Packages', link: '/advertise', primary: false },
      ],
      duration: 4000,
    },
  ];

  const featuredArticles = [
    {
      id: 1,
      title: 'Exploring the Vaal Triangle: Attractions, History, and Local Life',
      excerpt: 'The Vaal Triangle is the industrial–urban region linking Vereeniging, Vanderbijlpark and Sasolburg about 60 km south of Johannesburg.',
      category: 'Featured',
      image: 'https://images.unsplash.com/photo-1464219789935-c2d9d9aba644?w=800',
      date: 'January 16, 2026',
      slug: '/towns',
    },
    {
      id: 2,
      title: 'Vereeniging: History, Things to Do, Businesses & Local Life',
      excerpt: 'Vereeniging is the commercial and administrative centre of the Vaal Triangle. Founded in the late 1800s, the town played a critical role in South Africa\'s early industrial development.',
      category: 'Towns',
      image: 'https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?w=800',
      date: 'January 16, 2026',
      slug: '/towns/vereeniging',
    },
    {
      id: 3,
      title: 'Vanderbijlpark: Industry, Lifestyle, Things to Do',
      excerpt: 'Vanderbijlpark is a planned industrial town established in the mid-20th century. Designed to support steel production and technical education.',
      category: 'Towns',
      image: 'https://images.unsplash.com/photo-1480714378408-67cf0d13bc1b?w=800',
      date: 'January 16, 2026',
      slug: '/towns/vanderbijlpark',
    },
    {
      id: 4,
      title: 'Meyerton: Small-Town Living, Nature & Growing Local Business',
      excerpt: 'Meyerton offers a quieter, more small-town alternative within the Vaal Triangle, known for its relaxed pace of life and agricultural surroundings.',
      category: 'Towns',
      image: 'https://images.unsplash.com/photo-1523459178261-028135da2714?w=800',
      date: 'January 16, 2026',
      slug: '/towns/meyerton',
    },
    {
      id: 5,
      title: 'Sharpeville: A Place of Global Historical Importance',
      excerpt: 'Sharpeville holds a unique and profound place in South African and world history, internationally recognised for its role in the struggle for human rights.',
      category: 'Heritage',
      image: 'https://images.unsplash.com/photo-1518176258769-f227c798150e?w=800',
      date: 'January 16, 2026',
      slug: '/towns/sharpeville',
    },
  ];

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

  // ─── Hero auto-advance ───────────────────────────────────────
  useEffect(() => {
    const duration = heroSlides[currentSlide]?.duration || TIMING.CAROUSEL_INTERVAL;
    const timer = setTimeout(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, duration);
    return () => clearTimeout(timer);
  }, [currentSlide]);

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
  const onHeroTouchStart = (e) => {
    setHeroTouchStartX(e.touches[0].clientX);
    setHeroDragOffset(0);
  };
  const onHeroTouchMove = (e) => {
    if (heroTouchStartX === null) return;
    setHeroDragOffset(e.touches[0].clientX - heroTouchStartX);
  };
  const onHeroTouchEnd = () => {
    if (heroTouchStartX === null) return;
    if (heroDragOffset < -50) nextSlide();
    else if (heroDragOffset > 50) prevSlide();
    setHeroTouchStartX(null);
    setHeroDragOffset(0);
  };

  // ─── Article navigation ─────────────────────────────────────
  const nextArticleSlide = useCallback(() => {
    setCurrentArticleSlide((prev) => (prev + 1) % featuredArticles.length);
  }, [featuredArticles.length]);

  const prevArticleSlide = useCallback(() => {
    setCurrentArticleSlide((prev) => (prev - 1 + featuredArticles.length) % featuredArticles.length);
  }, [featuredArticles.length]);

  // ─── Article touch / swipe ───────────────────────────────────
  const onArticleTouchStart = (e) => {
    setArticleTouchStartX(e.touches[0].clientX);
    setArticleDragOffset(0);
  };
  const onArticleTouchMove = (e) => {
    if (articleTouchStartX === null) return;
    setArticleDragOffset(e.touches[0].clientX - articleTouchStartX);
  };
  const onArticleTouchEnd = () => {
    if (articleTouchStartX === null) return;
    if (articleDragOffset < -50) nextArticleSlide();
    else if (articleDragOffset > 50) prevArticleSlide();
    setArticleTouchStartX(null);
    setArticleDragOffset(0);
  };

  return (
    <div>
      {/* ═══════════════════════════════════════════════════════════
          HERO CAROUSEL
          • Image strip slides horizontally (swipeable on mobile)
          • Images sit inside a padded, rounded container – no cropping
          • Text + buttons live BELOW the image and fade in/out
          ═══════════════════════════════════════════════════════════ */}
      <section className="bg-white">
        {/* ── Image area with edge buffers, constrained to nav width ── */}
        <div
          className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4"
          onTouchStart={onHeroTouchStart}
          onTouchMove={onHeroTouchMove}
          onTouchEnd={onHeroTouchEnd}
        >
          {/* Outer rounded frame – clips the sliding strip.
              Height is capped so the image never exceeds ~38vh on desktop,
              leaving room for text + a peek of the next section. */}
          <div className="relative overflow-hidden rounded-2xl" style={{ height: '38vh', maxHeight: '420px', minHeight: '220px' }}>
            {/* Slide strip – images side by side, translated */}
            <div
              className="flex h-full transition-transform duration-500 ease-out will-change-transform"
              style={{
                transform: `translate3d(calc(-${currentSlide * 100}% + ${heroDragOffset}px), 0, 0)`,
              }}
            >
              {heroSlides.map((slide, index) => (
                <div
                  key={index}
                  className={`relative flex-shrink-0 w-full h-full ${slide.isAdvertisement ? 'bg-gray-100' : ''}`}
                >
                  <img
                    src={slide.image}
                    alt={slide.title}
                    className={`w-full h-full ${slide.isAdvertisement ? 'object-contain' : 'object-cover'}`}
                  />

                  {/* Sponsored badge – sits inside the image, top-left */}
                  {slide.isAdvertisement && (
                    <span className="absolute top-3 left-3 z-10 px-3 py-0.5 bg-vaal-orange-500 text-white text-xs font-semibold rounded-full">
                      Sponsored
                    </span>
                  )}
                </div>
              ))}
            </div>

            {/* ── Left arrow ── */}
            <button
              onClick={prevSlide}
              className="absolute left-2 top-1/2 -translate-y-1/2 z-10 hidden sm:flex items-center justify-center w-9 h-9 rounded-full bg-black/30 hover:bg-black/50 text-white transition-colors"
              aria-label="Previous slide"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>

            {/* ── Right arrow ── */}
            <button
              onClick={nextSlide}
              className="absolute right-2 top-1/2 -translate-y-1/2 z-10 hidden sm:flex items-center justify-center w-9 h-9 rounded-full bg-black/30 hover:bg-black/50 text-white transition-colors"
              aria-label="Next slide"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>

        {/* ── Text + buttons (fade in/out) + dots ── */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-6 pt-5 relative" style={{ minHeight: '140px' }}>
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
                <span className="text-vaal-orange-500">{slide.highlight}</span>
              </h1>

              <p className="text-gray-600 text-sm mt-1.5 max-w-2xl">
                {slide.description}
              </p>

              {/* CTA buttons */}
              {slide.buttons.length > 0 && (
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
                </div>
              )}
            </div>
          ))}

          {/* ── Dots ── */}
          <div className="flex justify-center gap-2 mt-4">
            {heroSlides.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentSlide(i)}
                aria-label={`Go to slide ${i + 1}`}
                className={`rounded-full transition-all duration-300 ${
                  i === currentSlide
                    ? 'w-7 h-2.5 bg-vaal-orange-500'
                    : 'w-2.5 h-2.5 bg-gray-300 hover:bg-gray-400'
                }`}
              />
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════
          KEY FOCUS AREAS
          ═══════════════════════════════════════════════════════════ */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Our Key Focus Areas
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Discover how our core programs, stories, and commitment to transparency work together to create lasting change in our communities.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-0 border border-gray-200 rounded-xl overflow-hidden">
            {keyFocusAreas.map((area, index) => (
              <div
                key={index}
                className={`p-8 border-r border-b border-gray-200 last:border-r-0 transition-all duration-500 cursor-pointer ${
                  index === activeBox
                    ? 'bg-vaal-orange-500 text-white'
                    : 'bg-white text-gray-900 hover:bg-gray-50'
                }`}
                onClick={() => setActiveBox(index)}
              >
                <div className={`flex items-center justify-center w-12 h-12 rounded-full font-bold text-xl mb-4 ${
                  index === activeBox
                    ? 'bg-white text-vaal-orange-500'
                    : 'bg-gray-100 text-gray-900'
                }`}>
                  {area.number}
                </div>
                <h3 className="text-xl font-bold mb-3">{area.title}</h3>
                <p className={`text-sm ${index === activeBox ? 'text-white/90' : 'text-gray-600'}`}>
                  {area.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════
          FEATURED STORIES
          Mobile: horizontal swipe strip, 85vw cards with peek
          Desktop (md+): static responsive grid
          ═══════════════════════════════════════════════════════════ */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
              Featured Stories
            </h2>
            {/* Arrow buttons – mobile only */}
            <div className="flex md:hidden items-center gap-2">
              <button
                onClick={prevArticleSlide}
                className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
                aria-label="Previous stories"
              >
                <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <button
                onClick={nextArticleSlide}
                className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
                aria-label="Next stories"
              >
                <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>

          {/* ── MOBILE swipe strip (hidden on md+) ── */}
          <div
            className="md:hidden overflow-hidden"
            onTouchStart={onArticleTouchStart}
            onTouchMove={onArticleTouchMove}
            onTouchEnd={onArticleTouchEnd}
          >
            <div
              className="flex transition-transform duration-300 ease-out will-change-transform"
              style={{
                transform: `translate3d(calc(-${currentArticleSlide} * (85vw + 1rem) + ${articleDragOffset}px), 0, 0)`,
              }}
            >
              {featuredArticles.map((article) => (
                <div
                  key={article.id}
                  className="flex-shrink-0 pr-4"
                  style={{ width: '85vw' }}
                >
                  <ArticleCard article={article} />
                </div>
              ))}
            </div>
          </div>

          {/* ── DESKTOP static grid (md+) ── */}
          <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredArticles.map((article) => (
              <ArticleCard key={article.id} article={article} />
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════
          CALL TO ACTION
          ═══════════════════════════════════════════════════════════ */}
      <section className="py-16 bg-vaal-orange-500 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Building Stronger Communities Together
          </h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Join us in celebrating and supporting the vibrant communities across the Vaal Triangle
          </p>
          <div className="flex justify-center">
            <Link
              to="/advertise"
              className="px-8 py-3 bg-white text-vaal-orange-600 rounded-md hover:bg-gray-100 transition-colors font-medium"
            >
              Advertise With Us
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
