import { useState } from 'react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export default function VerifyBusiness() {
  const [formData, setFormData] = useState({
    businessId: '',
    verificationCode: '',
  });
  const [status, setStatus] = useState(''); // 'success', 'error', 'loading'
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('loading');
    setMessage('');

    try {
      const response = await fetch(`${API_URL}/api/verify-business`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          business_id: formData.businessId,
          verification_code: formData.verificationCode,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setStatus('success');
        setMessage('Your business has been successfully verified! The verified badge will now appear on your listing.');
        setFormData({ businessId: '', verificationCode: '' });
      } else {
        setStatus('error');
        setMessage(data.error || 'Verification failed. Please check your code and try again.');
      }
    } catch (error) {
      setStatus('error');
      setMessage('An error occurred. Please try again later.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Verify Your Business
          </h1>
          <p className="text-gray-600">
            Enter your verification code to claim and verify your business listing
          </p>
        </div>

        {/* Verification Form */}
        <div className="bg-white rounded-lg shadow-md p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Business ID */}
            <div>
              <label
                htmlFor="businessId"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Business ID
              </label>
              <input
                id="businessId"
                type="text"
                required
                value={formData.businessId}
                onChange={(e) =>
                  setFormData({ ...formData, businessId: e.target.value })
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-vaal-orange-500 focus:border-vaal-orange-500"
                placeholder="e.g., 123"
                disabled={status === 'loading'}
              />
              <p className="mt-1 text-xs text-gray-500">
                Find this in your notification email or on your business listing
              </p>
            </div>

            {/* Verification Code */}
            <div>
              <label
                htmlFor="verificationCode"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Verification Code
              </label>
              <input
                id="verificationCode"
                type="text"
                required
                value={formData.verificationCode}
                onChange={(e) =>
                  setFormData({ ...formData, verificationCode: e.target.value.toUpperCase() })
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-vaal-orange-500 focus:border-vaal-orange-500 font-mono text-lg tracking-wider"
                placeholder="XXXXXXXX"
                maxLength={8}
                disabled={status === 'loading'}
              />
              <p className="mt-1 text-xs text-gray-500">
                8-character code provided by VaalHub
              </p>
            </div>

            {/* Status Messages */}
            {status === 'success' && (
              <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg flex items-start">
                <svg
                  className="w-5 h-5 mr-2 flex-shrink-0 mt-0.5"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
                <p className="text-sm">{message}</p>
              </div>
            )}

            {status === 'error' && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-start">
                <svg
                  className="w-5 h-5 mr-2 flex-shrink-0 mt-0.5"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                    clipRule="evenodd"
                  />
                </svg>
                <p className="text-sm">{message}</p>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={status === 'loading'}
              className="w-full bg-vaal-orange-500 hover:bg-vaal-orange-600 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            >
              {status === 'loading' ? (
                <>
                  <svg
                    className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
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
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Verifying...
                </>
              ) : (
                'Verify Business'
              )}
            </button>
          </form>
        </div>

        {/* Help Text */}
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="font-semibold text-blue-900 mb-2">Need Help?</h3>
          <div className="text-sm text-blue-800 space-y-2">
            <p>• Verification codes are sent to the email address on your business listing</p>
            <p>• Don't have a code? Contact us to claim your business</p>
            <p>• Already verified? Your verified badge should be visible on your listing</p>
          </div>
          <div className="mt-4">
            <a
              href="/businesses"
              className="text-vaal-orange-600 hover:text-vaal-orange-700 font-medium text-sm"
            >
              View all businesses →
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
