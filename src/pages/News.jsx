import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export default function News() {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    area: '',
    category: '',
  });

  const areas = ['All Areas', 'Vereeniging', 'Vanderbijlpark', 'Meyerton', 'Sasolburg', 'Sharpeville', 'Vaal Triangle'];
  const categories = ['All Categories', 'Local News', 'Business', 'Crime', 'Development', 'Politics', 'Community'];

  useEffect(() => {
    fetchNews();
  }, [filters]);

  const fetchNews = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        status: 'published',
        limit: '50',
      });

      if (filters.area && filters.area !== 'All Areas') {
        params.append('area', filters.area);
      }

      if (filters.category && filters.category !== 'All Categories') {
        params.append('category', filters.category);
      }

      const response = await fetch(`${API_URL}/api/news?${params}`);

      if (!response.ok) {
        throw new Error('Failed to fetch news');
      }

      const data = await response.json();
      setNews(data.data || []);
      setError(null);
    } catch (err) {
      console.error('Error fetching news:', err);
      setError('Unable to load news. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Date not available';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-ZA', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-vaal-orange-500 to-vaal-orange-600 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Latest News</h1>
          <p className="text-xl text-white/90">
            Stay updated with the latest news from across the Vaal Triangle
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Filters */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <h2 className="text-lg font-semibold mb-4">Filter News</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Area Filter */}
            <div>
              <label htmlFor="area" className="block text-sm font-medium text-gray-700 mb-2">
                Area
              </label>
              <select
                id="area"
                value={filters.area}
                onChange={(e) => setFilters({ ...filters, area: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-vaal-orange-500 focus:border-vaal-orange-500"
              >
                <option value="">All Areas</option>
                {areas.map((area) => (
                  <option key={area} value={area}>
                    {area}
                  </option>
                ))}
              </select>
            </div>

            {/* Category Filter */}
            <div>
              <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
                Category
              </label>
              <select
                id="category"
                value={filters.category}
                onChange={(e) => setFilters({ ...filters, category: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-vaal-orange-500 focus:border-vaal-orange-500"
              >
                <option value="">All Categories</option>
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-vaal-orange-500"></div>
            <p className="mt-4 text-gray-600">Loading news...</p>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-lg">
            <p className="font-semibold">Error</p>
            <p>{error}</p>
          </div>
        )}

        {/* No Results */}
        {!loading && !error && news.length === 0 && (
          <div className="text-center py-12 bg-white rounded-lg shadow-sm">
            <svg
              className="mx-auto h-12 w-12 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"
              />
            </svg>
            <h3 className="mt-2 text-lg font-medium text-gray-900">No news articles found</h3>
            <p className="mt-1 text-gray-500">Try adjusting your filters or check back later for updates.</p>
          </div>
        )}

        {/* News Grid */}
        {!loading && !error && news.length > 0 && (
          <>
            <div className="mb-6">
              <p className="text-gray-600">
                Showing <span className="font-semibold">{news.length}</span> article{news.length !== 1 ? 's' : ''}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {news.map((article) => (
                <article
                  key={article.news_id}
                  className="bg-white rounded-lg shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col"
                >
                  {/* Image */}
                  {article.image_url && (
                    <div className="aspect-video bg-gray-200 overflow-hidden">
                      <img
                        src={article.image_url}
                        alt={article.headline}
                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-200"
                      />
                    </div>
                  )}

                  <div className="p-6 flex flex-col h-full">
                    <div className="flex-1">
                      {/* Category & Area */}
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

                      {/* Headline */}
                      <h2 className="text-xl font-bold text-gray-900 mb-2 line-clamp-2">
                        {article.headline}
                      </h2>

                      {/* Summary */}
                      {article.summary && (
                        <p className="text-gray-600 line-clamp-3">{article.summary}</p>
                      )}

                      {/* Date */}
                      <p className="text-sm text-gray-500 mt-3">
                        {formatDate(article.publish_date)}
                      </p>

                      {/* Source Attribution (visible on hover for transparency) */}
                      {article.source_url && (
                        <p className="text-xs text-gray-400 mt-2">
                          Source: {article.source_name || 'External'}
                        </p>
                      )}
                    </div>

                    {/* Read More Button */}
                    <Link
                      to={`/news/${article.news_id}`}
                      className="w-full mt-4 py-2 px-4 bg-vaal-orange-500 hover:bg-vaal-orange-600 text-white font-medium rounded-lg transition-colors duration-200 flex items-center justify-center"
                    >
                      Read Full Article
                      <svg
                        className="ml-2 w-4 h-4"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 5l7 7-7 7"
                        />
                      </svg>
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
