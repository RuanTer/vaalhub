import { Link } from 'react-router-dom';
import { useNewsletter } from '../../hooks/useNewsletter';
import { TOWNS, LIMITS } from '../../config/constants';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  const { email, setEmail, status, subscribe } = useNewsletter();

  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* About Section */}
          <div>
            <div className="flex items-center mb-4">
              <img src="/vh-logo.svg" alt="VaalHub" className="h-8 w-8 rounded-md mr-2" />
              <h3 className="text-white text-lg font-bold">
                <span className="text-white">Vaal</span>
                <span className="text-vaal-orange-500">Hub</span>
              </h3>
            </div>
            <p className="text-sm mb-4">
              Your trusted source for local news, events, and business information across the Vaal Triangle.
            </p>
            <div className="flex space-x-4">
              <a href="https://www.facebook.com/profile.php?id=61587360156408" target="_blank" rel="noopener noreferrer" className="hover:text-vaal-orange-400 transition-colors">
                <span className="sr-only">Facebook</span>
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" />
                </svg>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white text-lg font-bold mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li><Link to="/about" className="hover:text-vaal-orange-400 transition-colors">About Us</Link></li>
              <li><Link to="/contact" className="hover:text-vaal-orange-400 transition-colors">Contact Us</Link></li>
              <li><Link to="/advertise" className="hover:text-vaal-orange-400 transition-colors">Advertise With Us</Link></li>
              <li><Link to="/contact" className="hover:text-vaal-orange-400 transition-colors">Submit News</Link></li>
              <li><Link to="/events" className="hover:text-vaal-orange-400 transition-colors">Events Calendar</Link></li>
            </ul>
          </div>

          {/* Towns */}
          <div>
            <h3 className="text-white text-lg font-bold mb-4">Explore Towns</h3>
            <ul className="space-y-2 text-sm">
              {TOWNS.map((town) => (
                <li key={town.slug}>
                  <Link to={town.path} className="hover:text-vaal-orange-400 transition-colors">
                    {town.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="text-white text-lg font-bold mb-4">Stay Updated</h3>
            <p className="text-sm mb-4">Get the latest news and events delivered to your inbox.</p>
            <form onSubmit={subscribe} className="space-y-2">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                required
                maxLength={LIMITS.EMAIL_MAX_LENGTH}
                className="w-full px-4 py-2 rounded-md bg-gray-800 border border-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-vaal-orange-500"
              />
              <button
                type="submit"
                disabled={status === 'loading'}
                className="w-full px-4 py-2 bg-vaal-orange-500 text-white rounded-md hover:bg-vaal-orange-600 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {status === 'loading' ? 'Subscribing...' : 'Subscribe'}
              </button>
              {status === 'success' && (
                <p className="text-sm text-green-400">Thank you for subscribing!</p>
              )}
              {status === 'error' && (
                <p className="text-sm text-red-400">Something went wrong. Please try again.</p>
              )}
            </form>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center text-sm">
          <p>&copy; {currentYear} VaalHub. All rights reserved.</p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <Link to="/privacy" className="hover:text-vaal-orange-400 transition-colors">Privacy Policy</Link>
            <Link to="/terms" className="hover:text-vaal-orange-400 transition-colors">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
