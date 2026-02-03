import { useState } from 'react';
import { API_ENDPOINTS } from '../config/api';
import { LIMITS, VALIDATION, TIMING } from '../config/constants';
import { executeRecaptcha } from '../utils/recaptcha';

const Advertise = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    businessName: '',
    message: '',
  });
  const [submitStatus, setSubmitStatus] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitStatus('loading');

    try {
      // Get reCAPTCHA token (optional - don't block submission if it fails)
      const recaptchaToken = await executeRecaptcha('advertising_form');

      const formDataToSend = new FormData();
      formDataToSend.append('name', formData.name);
      formDataToSend.append('email', formData.email);
      formDataToSend.append('phone', formData.phone);
      formDataToSend.append('businessName', formData.businessName);
      formDataToSend.append('message', formData.message);
      formDataToSend.append('timestamp', new Date().toISOString());
      formDataToSend.append('type', 'advertising');

      // Only add reCAPTCHA token if available
      if (recaptchaToken && recaptchaToken !== 'dev_mode_no_recaptcha') {
        formDataToSend.append('recaptchaToken', recaptchaToken);
      }

      const response = await fetch(API_ENDPOINTS.ADVERTISING, {
        method: 'POST',
        body: formDataToSend,
        redirect: 'follow',
      });

      // Try to parse JSON response
      let data;
      try {
        const text = await response.text();
        console.log('Advertising response text:', text);
        data = JSON.parse(text);
      } catch (parseError) {
        console.log('Could not parse response as JSON, assuming success');
        // If we can't parse JSON but the request succeeded, assume success
        if (response.ok) {
          data = { success: true };
        } else {
          throw new Error('Failed to parse response');
        }
      }

      if (data.success || response.ok) {
        setSubmitStatus('success');
        setFormData({
          name: '',
          email: '',
          phone: '',
          businessName: '',
          message: '',
        });
        setTimeout(() => setSubmitStatus(''), TIMING.SUCCESS_MESSAGE_DURATION * 1.5);
      } else {
        console.error('Server response:', data);
        setSubmitStatus('error');
        setTimeout(() => setSubmitStatus(''), TIMING.SUCCESS_MESSAGE_DURATION);
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      setSubmitStatus('error');
      setTimeout(() => setSubmitStatus(''), TIMING.SUCCESS_MESSAGE_DURATION);
    }
  };

  return (
    <div className="bg-white">
      {/* Hero Section */}
      <div className="bg-vaal-orange-500 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Advertise With VaalHub</h1>
            <p className="text-xl">
              Reach thousands of local residents and grow your business in the Vaal Triangle community.
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Information Section */}
          <div>
            <h2 className="text-3xl font-bold mb-6 text-gray-900">Why Advertise With Us?</h2>

            <div className="space-y-6 mb-8">
              <div>
                <h3 className="text-xl font-bold mb-2 text-gray-900">Local Reach</h3>
                <p className="text-gray-700">
                  Connect directly with residents across Vereeniging, Vanderbijlpark, Meyerton, and surrounding areas.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-bold mb-2 text-gray-900">Targeted Audience</h3>
                <p className="text-gray-700">
                  Reach people actively looking for local news, events, and businesses in the Vaal Triangle.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-bold mb-2 text-gray-900">Flexible Options</h3>
                <p className="text-gray-700">
                  From banner ads to sponsored content, we offer various advertising solutions to fit your budget.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-bold mb-2 text-gray-900">Measurable Results</h3>
                <p className="text-gray-700">
                  Track your campaign performance with detailed analytics and insights.
                </p>
              </div>
            </div>

            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="text-xl font-bold mb-4 text-gray-900">Advertising Options</h3>
              <ul className="space-y-2 text-gray-700">
                <li className="flex items-start">
                  <span className="text-vaal-orange-500 mr-2">•</span>
                  <span>Homepage banner advertisements</span>
                </li>
                <li className="flex items-start">
                  <span className="text-vaal-orange-500 mr-2">•</span>
                  <span>Sponsored articles and content</span>
                </li>
                <li className="flex items-start">
                  <span className="text-vaal-orange-500 mr-2">•</span>
                  <span>Business directory listings</span>
                </li>
                <li className="flex items-start">
                  <span className="text-vaal-orange-500 mr-2">•</span>
                  <span>Newsletter sponsorships</span>
                </li>
                <li className="flex items-start">
                  <span className="text-vaal-orange-500 mr-2">•</span>
                  <span>Social media promotions</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Contact Form */}
          <div>
            <div className="bg-white border border-gray-200 rounded-lg p-8 shadow-sm">
              <h2 className="text-2xl font-bold mb-6 text-gray-900">Get Started Today</h2>
              <p className="text-gray-600 mb-6">
                Fill out the form below and we'll get back to you within 24 hours with more information about our advertising packages.
              </p>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    minLength={LIMITS.NAME_MIN_LENGTH}
                    maxLength={LIMITS.NAME_MAX_LENGTH}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-vaal-orange-500"
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    maxLength={LIMITS.EMAIL_MAX_LENGTH}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-vaal-orange-500"
                  />
                </div>

                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                    pattern={VALIDATION.PHONE_PATTERN}
                    maxLength={LIMITS.PHONE_MAX_LENGTH}
                    title={VALIDATION.PHONE_TITLE}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-vaal-orange-500"
                  />
                </div>

                <div>
                  <label htmlFor="businessName" className="block text-sm font-medium text-gray-700 mb-1">
                    Business Name *
                  </label>
                  <input
                    type="text"
                    id="businessName"
                    name="businessName"
                    value={formData.businessName}
                    onChange={handleChange}
                    required
                    minLength={LIMITS.BUSINESS_NAME_MIN_LENGTH}
                    maxLength={LIMITS.BUSINESS_NAME_MAX_LENGTH}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-vaal-orange-500"
                  />
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
                    Tell us about your advertising goals
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    rows="4"
                    maxLength={LIMITS.MESSAGE_MAX_LENGTH}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-vaal-orange-500"
                  ></textarea>
                  <div className="text-sm text-gray-500 text-right mt-1">
                    {formData.message.length}/{LIMITS.MESSAGE_MAX_LENGTH} characters
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={submitStatus === 'loading'}
                  className="w-full px-6 py-3 bg-vaal-orange-500 text-white rounded-md hover:bg-vaal-orange-600 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {submitStatus === 'loading' ? 'Submitting...' : 'Submit Inquiry'}
                </button>

                {submitStatus === 'success' && (
                  <div className="p-4 bg-green-50 border border-green-200 rounded-md">
                    <p className="text-green-800 text-sm">
                      Thank you for your inquiry! We'll get back to you within 24 hours.
                    </p>
                  </div>
                )}

                {submitStatus === 'error' && (
                  <div className="p-4 bg-red-50 border border-red-200 rounded-md">
                    <p className="text-red-800 text-sm">
                      Something went wrong. Please try again or contact us directly.
                    </p>
                  </div>
                )}
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Advertise;
