import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        <h1 className="text-9xl font-bold text-vaal-orange-500">404</h1>
        <h2 className="text-3xl font-bold text-gray-900 mt-4 mb-2">Page Not Found</h2>
        <p className="text-gray-600 mb-8">
          Sorry, we couldn't find the page you're looking for. It may have been moved or deleted.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            to="/"
            className="inline-block px-6 py-3 bg-vaal-orange-500 text-white rounded-md hover:bg-vaal-orange-600 transition-colors font-medium"
          >
            Back to Home
          </Link>
          <Link
            to="/towns/vereeniging"
            className="inline-block px-6 py-3 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors font-medium"
          >
            Browse Towns
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
