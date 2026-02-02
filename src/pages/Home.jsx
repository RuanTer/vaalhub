import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import ArticleCard from '../components/ui/ArticleCard';
import { TIMING } from '../config/constants';

const Home = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [activeBox, setActiveBox] = useState(0);
  const [currentArticleSlide, setCurrentArticleSlide] = useState(0);
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);

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
      duration: 3000, // 3 seconds
    },
    {
      title: 'Keeping Your Operations Running With',
      highlight: 'Expert Electrical Solutions',
      description: 'Over 50 years\' combined experience, same-day delivery, reliable support that keeps operations moving.',
      image: '/ads/factorpro-logo.jpg',
      isAdvertisement: true,
      buttons: [],
      duration: 7000, // 7 seconds
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
      duration: 4000, // 4 seconds
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

  // Auto-advance carousel with variable timing
  useEffect(() => {
    const currentDuration = heroSlides[currentSlide]?.duration || TIMING.CAROUSEL_INTERVAL;
    const timer = setTimeout(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, currentDuration);
    return () => clearTimeout(timer);
  }, [currentSlide]);

  // Auto-rotate active box
  useEffect(() => {
    const boxTimer = setInterval(() => {
      setActiveBox((prev) => (prev + 1) % keyFocusAreas.length);
    }, TIMING.FEATURED_STORIES_INTERVAL);
    return () => clearInterval(boxTimer);
  }, []);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + heroSlides.length) % heroSlides.length);
  };

  const nextArticleSlide = () => {
    setCurrentArticleSlide((prev) => (prev + 1) % featuredArticles.length);
  };

  const prevArticleSlide = () => {
    setCurrentArticleSlide((prev) => (prev - 1 + featuredArticles.length) % featuredArticles.length);
  };

  // Handle touch events for swipe gestures on article carousel
  const handleTouchStart = (e) => {
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;

    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;

    if (isLeftSwipe) {
      nextArticleSlide();
    }
    if (isRightSwipe) {
      prevArticleSlide();
    }

    setTouchStart(0);
    setTouchEnd(0);
  };

  return (
    <div>
      {/* Hero Carousel Section */}
      <section className="relative bg-white overflow-hidden">
        {/* Mobile Layout - Image on top, text below */}
        <div className="lg:hidden">
          {heroSlides.map((slide, index) => (
            <div
              key={index}
              className={`transition-opacity duration-1000 ${
                index === currentSlide ? 'opacity-100' : 'opacity-0 absolute inset-0'
              }`}
            >
              {/* Image Section - Fixed height */}
              <div className="relative h-64 overflow-hidden bg-gray-100 flex items-center justify-center">
                <img
                  src={slide.image}
                  alt={slide.title}
                  className="w-full h-full object-contain"
                />
              </div>

              {/* Text Section - White background */}
              <div className="bg-white px-6 py-8">
                <h1 className="text-2xl md:text-3xl font-bold mb-4 text-gray-900">
                  {slide.title}
                  <br />
                  <span className="text-vaal-orange-500">{slide.highlight}</span>
                </h1>
                <p className="text-base md:text-lg text-gray-700 mb-6">
                  {slide.description}
                </p>

                {/* Dots Indicator */}
                <div className="flex space-x-2 justify-center">
                  {heroSlides.map((_, dotIndex) => (
                    <button
                      key={dotIndex}
                      onClick={() => setCurrentSlide(dotIndex)}
                      className={`w-2 h-2 rounded-full transition-all ${
                        dotIndex === currentSlide ? 'bg-vaal-orange-500 w-6' : 'bg-gray-300'
                      }`}
                    />
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Desktop Layout - Side by side */}
        <div className="hidden lg:block relative h-[600px]">
          <div className="flex h-full">
            {/* Left Side - Content (1/3) */}
            <div className="w-1/3 bg-white flex items-center px-12 lg:px-16 z-10">
              <div className="w-full">
                {heroSlides.map((slide, index) => (
                  <div
                    key={index}
                    className={`transition-opacity duration-1000 ${
                      index === currentSlide ? 'opacity-100' : 'opacity-0 absolute'
                    }`}
                  >
                    <h1 className="text-4xl lg:text-5xl font-bold mb-6 text-gray-900">
                      {slide.title}
                      <br />
                      <span className="text-vaal-orange-500">{slide.highlight}</span>
                    </h1>
                    <p className="text-lg lg:text-xl text-gray-700">
                      {slide.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Side - Images (2/3) */}
            <div className="w-2/3 relative overflow-hidden">
              {heroSlides.map((slide, index) => (
                <div
                  key={index}
                  className={`absolute inset-0 transition-opacity duration-1000 ${
                    index === currentSlide ? 'opacity-100' : 'opacity-0'
                  }`}
                >
                  <img
                    src={slide.image}
                    alt={slide.title}
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}

              {/* Dots Indicator */}
              <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex space-x-2 z-10">
                {heroSlides.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentSlide(index)}
                    className={`w-3 h-3 rounded-full transition-all ${
                      index === currentSlide ? 'bg-white w-8' : 'bg-white/50'
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Key Focus Areas */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Our Key Focus Areas
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Discover how our core programs, stories, and commitment to transparency work together to create lasting change in our communities.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-0 border border-gray-200">
            {keyFocusAreas.map((area, index) => (
              <div
                key={index}
                className={`p-8 border-r border-b border-gray-200 last:border-r-0 transition-all duration-500 ${
                  index === activeBox
                    ? 'bg-vaal-orange-500 text-white'
                    : 'bg-white text-gray-900'
                }`}
              >
                <div className={`flex items-center justify-center w-12 h-12 rounded-full font-bold text-xl mb-4 ${
                  index === activeBox
                    ? 'bg-white text-gray-900'
                    : 'bg-white text-gray-900'
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

      {/* Featured Articles Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
              Featured Stories
            </h2>
            <div className="flex items-center gap-4">
              <button
                onClick={prevArticleSlide}
                className="p-2 rounded-full bg-white hover:bg-gray-100 shadow-md transition-colors"
              >
                <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <button
                onClick={nextArticleSlide}
                className="p-2 rounded-full bg-white hover:bg-gray-100 shadow-md transition-colors"
              >
                <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>

          <div
            className="relative overflow-hidden touch-pan-y"
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          >
            <div
              className="flex transition-transform duration-200 ease-out will-change-transform"
              style={{
                transform: `translate3d(-${currentArticleSlide * 100}%, 0, 0)`,
              }}
            >
              {featuredArticles.map((article) => (
                <div key={article.id} className="w-full md:w-1/2 lg:w-1/3 flex-shrink-0 px-4">
                  <ArticleCard article={article} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
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
