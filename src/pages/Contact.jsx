import { useState } from 'react';

const Contact = () => {
  const [form, setForm] = useState({ name: '', email: '', subject: 'General Inquiry', message: '' });
  const [status, setStatus] = useState('idle'); // idle | loading | success | error

  const subjects = [
    'General Inquiry',
    'Submit a News Story',
    'Report an Issue',
    'Partnership Opportunity',
    'Technical Support',
    'Other',
  ];

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('loading');

    try {
      // Send via mailto as the primary method — opens the user's email client
      // pre-filled with all the details so nothing is lost
      const mailtoBody = [
        `Name: ${form.name}`,
        `Email: ${form.email}`,
        `Subject: ${form.subject}`,
        '',
        form.message,
      ].join('\n');

      const mailtoUrl = `mailto:info@vaalhub.co.za?subject=${encodeURIComponent(form.subject)}&body=${encodeURIComponent(mailtoBody)}`;

      window.location.href = mailtoUrl;

      // Show success after a short delay (mailto opens the client asynchronously)
      setTimeout(() => {
        setStatus('success');
        setForm({ name: '', email: '', subject: 'General Inquiry', message: '' });
      }, 1500);
    } catch {
      setStatus('error');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Banner */}
      <div className="bg-gray-900 text-white py-12">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">Contact Us</h1>
          <p className="text-gray-400">We'd love to hear from you. Send us a message and we'll get back to you as soon as possible.</p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Form */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
              {status === 'success' ? (
                <div className="text-center py-8">
                  <div className="flex justify-center mb-4">
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                      <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Message Sent!</h3>
                  <p className="text-gray-600 text-sm mb-6">
                    Your email client should have opened with your message ready to send to info@vaalhub.co.za.
                    If it didn't open, you can email us directly.
                  </p>
                  <button
                    onClick={() => setStatus('idle')}
                    className="px-6 py-2 bg-vaal-orange-500 text-white rounded-lg hover:bg-vaal-orange-600 transition-colors text-sm font-medium"
                  >
                    Send Another Message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    {/* Name */}
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1.5">
                        Your Name
                      </label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={form.name}
                        onChange={handleChange}
                        required
                        placeholder="John Smith"
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-vaal-orange-500 focus:border-vaal-orange-500 outline-none text-sm"
                      />
                    </div>

                    {/* Email */}
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1.5">
                        Email Address
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={form.email}
                        onChange={handleChange}
                        required
                        placeholder="john@email.com"
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-vaal-orange-500 focus:border-vaal-orange-500 outline-none text-sm"
                      />
                    </div>
                  </div>

                  {/* Subject */}
                  <div>
                    <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-1.5">
                      Subject
                    </label>
                    <select
                      id="subject"
                      name="subject"
                      value={form.subject}
                      onChange={handleChange}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-vaal-orange-500 focus:border-vaal-orange-500 outline-none text-sm bg-white"
                    >
                      {subjects.map((s) => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                  </div>

                  {/* Message */}
                  <div>
                    <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1.5">
                      Message
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      value={form.message}
                      onChange={handleChange}
                      required
                      rows={5}
                      placeholder="Tell us what's on your mind..."
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-vaal-orange-500 focus:border-vaal-orange-500 outline-none text-sm resize-none"
                    />
                  </div>

                  {/* Submit */}
                  <button
                    type="submit"
                    disabled={status === 'loading'}
                    className="w-full px-6 py-3 bg-vaal-orange-500 text-white rounded-lg hover:bg-vaal-orange-600 transition-colors font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {status === 'loading' ? 'Sending...' : 'Send Message'}
                  </button>

                  {status === 'error' && (
                    <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                      <p className="text-red-800 text-sm">Something went wrong. Please email us directly at info@vaalhub.co.za</p>
                    </div>
                  )}
                </form>
              )}
            </div>
          </div>

          {/* Sidebar – contact info */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Get In Touch</h3>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 bg-vaal-orange-50 rounded-lg flex items-center justify-center flex-shrink-0">
                    <svg className="w-4 h-4 text-vaal-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-700">Email</p>
                    <a href="mailto:info@vaalhub.co.za" className="text-sm text-vaal-orange-500 hover:text-vaal-orange-600">
                      info@vaalhub.co.za
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 bg-vaal-orange-50 rounded-lg flex items-center justify-center flex-shrink-0">
                    <svg className="w-4 h-4 text-vaal-orange-600" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-700">Facebook</p>
                    <a
                      href="https://www.facebook.com/profile.php?id=61587360156408"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-vaal-orange-500 hover:text-vaal-orange-600"
                    >
                      VaalHub Facebook Page
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 bg-vaal-orange-50 rounded-lg flex items-center justify-center flex-shrink-0">
                    <svg className="w-4 h-4 text-vaal-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 12.414a1.414 1.414 0 010-2L17.657 6.343a2 2 0 010 2.828l-3.414 3.414a1.414 1.414 0 010 2l3.414 3.414a2 2 0 010 2.828zM6.343 17.657l-3.414-3.414a2 2 0 010-2.828L6.343 7.999a1.414 1.414 0 012 0l3.414 3.414a1.414 1.414 0 010 2L8.343 16.828a2 2 0 01-2 .829z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-700">Location</p>
                    <p className="text-sm text-gray-600">Vaal Triangle, Gauteng, South Africa</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-vaal-orange-50 border border-vaal-orange-200 rounded-xl p-5">
              <h4 className="text-sm font-bold text-vaal-orange-800 mb-1.5">Want to advertise?</h4>
              <p className="text-xs text-vaal-orange-700 mb-3">
                Reach thousands of local residents across the Vaal Triangle.
              </p>
              <a href="/advertise" className="inline-block px-4 py-1.5 bg-vaal-orange-500 text-white text-xs font-semibold rounded-md hover:bg-vaal-orange-600 transition-colors">
                Learn More
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
