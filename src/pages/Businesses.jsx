import { useState, useEffect } from 'react';
import Modal from '../components/ui/Modal';
import SponsorBanner from '../components/ui/SponsorBanner';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export default function Businesses() {
  const [businesses, setBusinesses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedBusiness, setSelectedBusiness] = useState(null);
  const [filters, setFilters] = useState({
    location: '',
    category: '',
  });

  const locations = ['Vereeniging', 'Vanderbijlpark', 'Meyerton', 'Sasolburg', 'Sharpeville'];
  const categories = ['Restaurant', 'Retail', 'Services', 'Healthcare', 'Entertainment', 'Automotive', 'Construction', 'Professional Services', 'Other'];

  useEffect(() => {
    fetchBusinesses();
  }, [filters]);

  const fetchBusinesses = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        status: 'published',
        limit: '100',
      });

      if (filters.location) {
        params.append('location', filters.location);
      }

      if (filters.category) {
        params.append('category', filters.category);
      }

      const response = await fetch(`${API_URL}/api/businesses?${params}`);

      if (!response.ok) {
        throw new Error('Failed to fetch businesses');
      }

      const data = await response.json();
      setBusinesses(data.data || []);
      setError(null);
    } catch (err) {
      console.error('Error fetching businesses:', err);
      setError('Unable to load businesses. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const openBusinessModal = (business) => {
    setSelectedBusiness(business);
  };

  const closeBusinessModal = () => {
    setSelectedBusiness(null);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-vaal-orange-500 to-vaal-orange-600 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Business Directory</h1>
          <p className="text-xl text-white/90">
            Discover local businesses and services in the Vaal Triangle
          </p>
        </div>
      </div>

      {/* Sponsor Banner */}
      <SponsorBanner />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Filters */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <h2 className="text-lg font-semibold mb-4">Filter Businesses</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Location Filter */}
            <div>
              <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-2">
                Location
              </label>
              <select
                id="location"
                value={filters.location}
                onChange={(e) => setFilters({ ...filters, location: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-vaal-orange-500 focus:border-vaal-orange-500"
              >
                <option value="">All Locations</option>
                {locations.map((location) => (
                  <option key={location} value={location}>
                    {location}
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
            <p className="mt-4 text-gray-600">Loading businesses...</p>
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
        {!loading && !error && businesses.length === 0 && (
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
                d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
              />
            </svg>
            <h3 className="mt-2 text-lg font-medium text-gray-900">No businesses found</h3>
            <p className="mt-1 text-gray-500">Try adjusting your filters or check back later for new businesses.</p>
          </div>
        )}

        {/* Businesses Grid - 3 Column Tile Layout */}
        {!loading && !error && businesses.length > 0 && (
          <>
            <div className="mb-6">
              <p className="text-gray-600">
                Showing <span className="font-semibold">{businesses.length}</span> business{businesses.length !== 1 ? 'es' : ''}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {businesses.map((business) => (
                <div
                  key={business.business_id}
                  onClick={() => openBusinessModal(business)}
                  className="bg-white rounded-lg shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden cursor-pointer transform hover:-translate-y-1 flex flex-col"
                >
                  {/* Business Logo/Image */}
                  <div className="relative h-48 bg-gradient-to-br from-vaal-orange-50 to-vaal-orange-100 overflow-hidden flex items-center justify-center p-6">
                    {business.logo_url ? (
                      <img
                        src={business.logo_url}
                        alt={business.business_name}
                        className="max-h-full max-w-full object-contain"
                        onError={(e) => {
                          e.target.style.display = 'none';
                        }}
                      />
                    ) : (
                      <svg
                        className="w-20 h-20 text-vaal-orange-300"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={1.5}
                          d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                        />
                      </svg>
                    )}

                    {/* Verified Badge */}
                    {business.is_verified === 1 && (
                      <div className="absolute top-3 right-3 bg-blue-500 text-white px-2 py-1 rounded-full text-xs font-medium flex items-center shadow-md">
                        <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                          <path
                            fillRule="evenodd"
                            d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                            clipRule="evenodd"
                          />
                        </svg>
                        Verified
                      </div>
                    )}
                  </div>

                  {/* Business Details */}
                  <div className="p-5 flex flex-col h-full">
                    <div className="flex-1">
                      {/* Category & Location */}
                      <div className="flex flex-wrap gap-2 mb-3">
                        {business.category && (
                          <span className="inline-block px-3 py-1 bg-vaal-orange-100 text-vaal-orange-700 text-xs font-medium rounded-full">
                            {business.category}
                          </span>
                        )}
                        {business.location && (
                          <span className="inline-block px-3 py-1 bg-gray-100 text-gray-700 text-xs font-medium rounded-full">
                            📍 {business.location}
                          </span>
                        )}
                      </div>

                      {/* Business Name */}
                      <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2 hover:text-vaal-orange-600 transition-colors">
                        {business.business_name}
                      </h3>

                      {/* Description Preview */}
                      {business.description && (
                        <p className="text-gray-600 text-sm line-clamp-3">{business.description}</p>
                      )}

                      {/* Quick Contact Info */}
                      <div className="space-y-1 mt-4">
                        {business.phone && (
                          <div className="flex items-center text-sm text-gray-600">
                            <svg className="w-4 h-4 mr-2 text-vaal-orange-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                            </svg>
                            <span className="line-clamp-1">{business.phone}</span>
                          </div>
                        )}

                        {business.operating_hours && (
                          <div className="flex items-center text-sm text-gray-600">
                            <svg className="w-4 h-4 mr-2 text-vaal-orange-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <span className="line-clamp-1">{business.operating_hours}</span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* View Details Button */}
                    <button className="w-full mt-4 py-2 px-4 bg-vaal-orange-500 hover:bg-vaal-orange-600 text-white font-medium rounded-lg transition-colors duration-200 flex items-center justify-center">
                      View Details
                      <svg className="ml-2 w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      {/* Business Detail Modal */}
      {selectedBusiness && (
        <Modal
          isOpen={!!selectedBusiness}
          onClose={closeBusinessModal}
          title={selectedBusiness.business_name}
        >
          <div className="space-y-6">
            {/* Business Logo */}
            {selectedBusiness.logo_url && (
              <div className="w-full rounded-lg overflow-hidden bg-gradient-to-br from-vaal-orange-50 to-vaal-orange-100 flex items-center justify-center p-8">
                <img
                  src={selectedBusiness.logo_url}
                  alt={selectedBusiness.business_name}
                  className="w-full h-auto object-contain max-h-[300px]"
                  onError={(e) => {
                    e.target.style.display = 'none';
                  }}
                />
              </div>
            )}

            {/* Tags */}
            <div className="flex flex-wrap gap-2">
              {selectedBusiness.category && (
                <span className="inline-block px-4 py-2 bg-vaal-orange-100 text-vaal-orange-700 text-sm font-medium rounded-full">
                  {selectedBusiness.category}
                </span>
              )}
              {selectedBusiness.location && (
                <span className="inline-block px-4 py-2 bg-gray-100 text-gray-700 text-sm font-medium rounded-full">
                  📍 {selectedBusiness.location}
                </span>
              )}
              {selectedBusiness.is_verified === 1 && (
                <span className="inline-block px-4 py-2 bg-blue-100 text-blue-700 text-sm font-medium rounded-full flex items-center">
                  <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                  Verified Business
                </span>
              )}
            </div>

            {/* Description */}
            {selectedBusiness.description && (
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">About</h4>
                <p className="text-gray-700 whitespace-pre-line leading-relaxed">
                  {selectedBusiness.description}
                </p>
              </div>
            )}

            {/* Contact Information */}
            <div className="bg-gray-50 rounded-lg p-4">
              <h4 className="font-semibold text-gray-900 mb-3">Contact Information</h4>
              <div className="space-y-3">
                {selectedBusiness.phone && (
                  <div className="flex items-start">
                    <svg className="w-5 h-5 mr-3 text-vaal-orange-500 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                    <div>
                      <p className="text-sm font-medium text-gray-700">Phone</p>
                      <a href={`tel:${selectedBusiness.phone}`} className="text-vaal-orange-600 hover:text-vaal-orange-700">
                        {selectedBusiness.phone}
                      </a>
                    </div>
                  </div>
                )}

                {selectedBusiness.email && (
                  <div className="flex items-start">
                    <svg className="w-5 h-5 mr-3 text-vaal-orange-500 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    <div>
                      <p className="text-sm font-medium text-gray-700">Email</p>
                      <a href={`mailto:${selectedBusiness.email}`} className="text-vaal-orange-600 hover:text-vaal-orange-700">
                        {selectedBusiness.email}
                      </a>
                    </div>
                  </div>
                )}

                {selectedBusiness.address && (
                  <div className="flex items-start">
                    <svg className="w-5 h-5 mr-3 text-vaal-orange-500 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <div>
                      <p className="text-sm font-medium text-gray-700">Address</p>
                      <p className="text-gray-600">{selectedBusiness.address}</p>
                    </div>
                  </div>
                )}

                {selectedBusiness.operating_hours && (
                  <div className="flex items-start">
                    <svg className="w-5 h-5 mr-3 text-vaal-orange-500 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <div>
                      <p className="text-sm font-medium text-gray-700">Operating Hours</p>
                      <p className="text-gray-600">{selectedBusiness.operating_hours}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Social Media & Website */}
            {(selectedBusiness.website || selectedBusiness.facebook || selectedBusiness.instagram) && (
              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="font-semibold text-gray-900 mb-3">Connect</h4>
                <div className="flex flex-wrap gap-3">
                  {selectedBusiness.website && (
                    <a
                      href={selectedBusiness.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center px-4 py-2 bg-vaal-orange-500 hover:bg-vaal-orange-600 text-white text-sm font-medium rounded-lg transition-colors"
                    >
                      <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                      </svg>
                      Visit Website
                    </a>
                  )}

                  {selectedBusiness.facebook && (
                    <a
                      href={selectedBusiness.facebook}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors"
                    >
                      <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                      </svg>
                      Facebook
                    </a>
                  )}

                  {selectedBusiness.instagram && (
                    <a
                      href={selectedBusiness.instagram}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center px-4 py-2 bg-pink-600 hover:bg-pink-700 text-white text-sm font-medium rounded-lg transition-colors"
                    >
                      <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.070-4.85.070-3.204 0-3.584-.012-4.849-.070-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                      </svg>
                      Instagram
                    </a>
                  )}
                </div>
              </div>
            )}
          </div>
        </Modal>
      )}
    </div>
  );
}
