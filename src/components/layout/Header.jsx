import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useNewsletter } from '../../hooks/useNewsletter';
import { TOWNS, TIMING } from '../../config/constants';
import { LIMITS } from '../../config/constants';

const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSubscribeModalOpen, setIsSubscribeModalOpen] = useState(false);
  const { email, setEmail, status, subscribe, isSuccess, reset } = useNewsletter();

  const navigation = [
    { name: 'Home', href: '/' },
    { name: 'Business', href: '#', comingSoon: true },
    { name: 'Events', href: '#', comingSoon: true },
    { name: 'Towns', href: '/towns', submenu: TOWNS.map(town => ({
      name: town.name,
      href: town.path,
    }))},
    { name: 'Explore', href: '#', comingSoon: true },
  ];

  // Auto-close modal on success
  useEffect(() => {
    if (isSuccess) {
      const timer = setTimeout(() => {
        setIsSubscribeModalOpen(false);
        reset();
      }, TIMING.MODAL_AUTO_CLOSE);
      return () => clearTimeout(timer);
    }
  }, [isSuccess, reset]);

  const handleModalClose = () => {
    setIsSubscribeModalOpen(false);
    reset();
  };

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      {/* Top Bar */}
      <div className="bg-gray-900 text-white py-2">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center text-sm">
            <div className="flex items-center space-x-4">
              <span>Vaal Triangle, Gauteng</span>
              <span className="hidden md:inline">|</span>
              <span className="hidden md:inline">{new Date().toLocaleDateString('en-ZA', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setIsSubscribeModalOpen(true)}
                className="hover:text-vaal-orange-400 transition-colors"
              >
                Subscribe
              </button>
              <Link to="/advertise" className="text-vaal-orange-500 hover:text-vaal-orange-400 font-medium">Advertise</Link>
            </div>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          {/* Logo */}
          <Link to="/" className="flex items-center">
            <div className="text-3xl font-bold font-serif">
              <span className="text-gray-900">Vaal</span>
              <span className="text-vaal-orange-500">Hub</span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex space-x-8">
            {navigation.map((item) => (
              <div key={item.name} className="relative group">
                <Link
                  to={item.href}
                  className="text-gray-700 hover:text-vaal-orange-500 font-medium transition-colors duration-200"
                >
                  {item.name}
                  {item.comingSoon && <span className="ml-2 text-xs text-gray-400">(Coming Soon)</span>}
                </Link>
                {item.submenu && (
                  <div className="absolute left-0 mt-2 w-48 bg-white shadow-lg rounded-md opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                    <div className="py-2">
                      {item.submenu.map((subitem) => (
                        <Link
                          key={subitem.name}
                          to={subitem.href}
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-vaal-orange-50 hover:text-vaal-orange-600"
                        >
                          {subitem.name}
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </nav>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-vaal-orange-500 hover:bg-gray-100"
          >
            <span className="sr-only">Open main menu</span>
            {!isMobileMenuOpen ? (
              <svg className="block h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            ) : (
              <svg className="block h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMobileMenuOpen && (
        <div className="lg:hidden border-t border-gray-200">
          <div className="px-2 pt-2 pb-3 space-y-1">
            {navigation.map((item) => (
              <div key={item.name}>
                <Link
                  to={item.href}
                  className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-vaal-orange-500 hover:bg-gray-50"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {item.name}
                  {item.comingSoon && <span className="ml-2 text-xs text-gray-400">(Coming Soon)</span>}
                </Link>
                {item.submenu && (
                  <div className="pl-6 space-y-1">
                    {item.submenu.map((subitem) => (
                      <Link
                        key={subitem.name}
                        to={subitem.href}
                        className="block px-3 py-2 rounded-md text-sm text-gray-600 hover:text-vaal-orange-500 hover:bg-gray-50"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        {subitem.name}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Subscribe Modal */}
      {isSubscribeModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6 relative">
            <button
              onClick={handleModalClose}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            <h2 className="text-2xl font-bold text-gray-900 mb-2">Subscribe to VaalHub</h2>
            <p className="text-gray-600 mb-4">Stay updated with the latest news, events, and stories from the Vaal Triangle.</p>

            {/* Share on Facebook */}
            <div className="flex justify-center mb-5">
              <a
                href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent('https://vaalhub.co.za/subscribe')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 px-3 py-1.5 bg-[#1877F2] text-white rounded-md hover:bg-[#1661cf] transition-colors text-xs font-medium"
              >
                <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" />
                </svg>
                Share on Facebook
              </a>
            </div>

            <form onSubmit={subscribe}>
              <div className="mb-4">
                <label htmlFor="modal-email" className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  id="modal-email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  maxLength={LIMITS.EMAIL_MAX_LENGTH}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-vaal-orange-500 focus:border-vaal-orange-500"
                  placeholder="your@email.com"
                />
              </div>

              <button
                type="submit"
                disabled={status === 'loading'}
                className="w-full px-4 py-3 bg-vaal-orange-500 text-white rounded-md hover:bg-vaal-orange-600 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {status === 'loading' ? 'Subscribing...' : 'Subscribe'}
              </button>

              {status === 'success' && (
                <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-md">
                  <p className="text-green-800 text-sm">Thank you for subscribing!</p>
                </div>
              )}

              {status === 'error' && (
                <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-md">
                  <p className="text-red-800 text-sm">Something went wrong. Please try again.</p>
                </div>
              )}
            </form>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
