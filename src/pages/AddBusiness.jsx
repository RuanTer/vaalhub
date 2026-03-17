import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { buildPageMeta } from '../hooks/useSEO';
import { executeRecaptcha } from '../utils/recaptcha';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const CATEGORIES = [
  'Restaurant', 'Retail', 'Service', 'Healthcare', 'Entertainment',
  'Automotive', 'Construction', 'Professional Services', 'Education', 'Other',
];

const LOCATIONS = [
  'Vereeniging', 'Vanderbijlpark', 'Meyerton', 'Sasolburg', 'Sharpeville',
];

const CATEGORY_TAGS = {
  Construction: ['Fencing', 'Plumbing', 'Electrician', 'Painting', 'Roofing', 'Tiling', 'Paving', 'Welding', 'Carpentry', 'Waterproofing', 'Flooring', 'Solar', 'Gates', 'Garage Doors', 'Landscaping', 'Swimming Pool', 'Borehole', 'Handyman'],
  Service: ['Cleaning', 'Pest Control', 'Security', 'Locksmith', 'Courier', 'Moving', 'Storage', 'Laundry', 'Printing', 'Signage', 'IT Support', 'Computer Repair', 'Air Conditioning', 'Gardening', 'Tree Felling', 'Photography'],
  Automotive: ['Mechanic', 'Panel Beater', 'Tyres', 'Towing', 'Car Wash', 'Brakes', 'Spray Painting', 'Fitment Centre', 'Auto Electrician', 'Car Rental'],
  Restaurant: ['Pizza', 'Burgers', 'Sushi', 'Steakhouse', 'Coffee Shop', 'Bakery', 'Takeaway', 'Fast Food', 'Pub', 'Grill', 'Catering', 'Halal'],
  Healthcare: ['Dentist', 'Doctor', 'Physiotherapy', 'Optometrist', 'Pharmacy', 'Vet', 'Gym', 'Fitness', 'Spa', 'Beauty Salon', 'Hairdresser', 'Barber', 'Nail Salon'],
  'Professional Services': ['Attorney', 'Accountant', 'Tax', 'Financial Advisor', 'Insurance', 'Estate Agent', 'Architect', 'Engineer', 'Bookkeeper', 'Web Design'],
  Retail: ['Clothing', 'Furniture', 'Hardware', 'Electronics', 'Grocery', 'Pet Shop', 'Florist', 'Jewellery', 'Sports', 'Liquor'],
  Education: ['Creche', 'Daycare', 'Tutor', 'Driving School', 'Training Centre', 'Music Lessons', 'Dance'],
  Entertainment: ['Cinema', 'Bowling', 'Casino', 'Nightclub', 'Live Music', 'Venue', 'Party Hire', 'Kids Entertainment'],
};

const inputClass =
  'w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-vaal-orange-500 focus:border-vaal-orange-500 bg-white text-gray-900 placeholder-gray-400';

export default function AddBusiness() {
  const [form, setForm] = useState({
    name: '', email: '', phone: '',
    businessName: '', category: '', location: '', website: '', description: '',
    facebook: '', instagram: '',
  });
  const [selectedTags, setSelectedTags] = useState([]);
  const [status, setStatus] = useState('idle'); // idle | loading | success | error
  const [errorMsg, setErrorMsg] = useState('');

  // File states
  const [logo, setLogo] = useState(null);
  const [logoPreview, setLogoPreview] = useState(null);
  const [pdf, setPdf] = useState(null);
  const [photos, setPhotos] = useState([]);
  const [photoPreviews, setPhotoPreviews] = useState([]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (name === 'category') setSelectedTags([]);
  };

  const toggleTag = (tag) => {
    setSelectedTags(prev =>
      prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
    );
  };

  const availableTags = CATEGORY_TAGS[form.category] || [];

  // ── File handlers ──────────────────────────────────────────────

  const handleLogoChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) {
      setErrorMsg('Logo must be under 2 MB.');
      return;
    }
    setLogo(file);
    setLogoPreview(URL.createObjectURL(file));
    setErrorMsg('');
  };

  const removeLogo = () => {
    if (logoPreview) URL.revokeObjectURL(logoPreview);
    setLogo(null);
    setLogoPreview(null);
  };

  const handlePdfChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      setErrorMsg('PDF must be under 5 MB.');
      return;
    }
    setPdf(file);
    setErrorMsg('');
  };

  const handlePhotosChange = (e) => {
    const files = Array.from(e.target.files);
    const total = photos.length + files.length;
    if (total > 5) {
      setErrorMsg(`Maximum 5 photos allowed. You already have ${photos.length}.`);
      return;
    }
    for (const f of files) {
      if (f.size > 3 * 1024 * 1024) {
        setErrorMsg(`"${f.name}" is too large. Each photo must be under 3 MB.`);
        return;
      }
    }
    const newPreviews = files.map(f => URL.createObjectURL(f));
    setPhotos(prev => [...prev, ...files]);
    setPhotoPreviews(prev => [...prev, ...newPreviews]);
    setErrorMsg('');
  };

  const removePhoto = (index) => {
    URL.revokeObjectURL(photoPreviews[index]);
    setPhotos(prev => prev.filter((_, i) => i !== index));
    setPhotoPreviews(prev => prev.filter((_, i) => i !== index));
  };

  // ── Submit ─────────────────────────────────────────────────────

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('loading');
    setErrorMsg('');

    const token = await executeRecaptcha('submit_business');

    const normalizeUrl = (url) => {
      if (!url || !url.trim()) return '';
      const trimmed = url.trim();
      if (/^https?:\/\//i.test(trimmed)) return trimmed;
      return 'https://' + trimmed;
    };

    try {
      const formData = new FormData();
      formData.append('submitter_name', form.name);
      formData.append('submitter_email', form.email);
      formData.append('submitter_phone', form.phone);
      formData.append('business_name', form.businessName);
      formData.append('category', form.category);
      formData.append('location', form.location);
      formData.append('description', form.description);
      formData.append('website', normalizeUrl(form.website));
      formData.append('facebook', normalizeUrl(form.facebook));
      formData.append('instagram', normalizeUrl(form.instagram));
      formData.append('recaptcha_token', token || '');

      if (selectedTags.length > 0) {
        formData.append('tags', selectedTags.join(','));
      }

      if (logo) formData.append('logo', logo);
      if (pdf) formData.append('pdf', pdf);
      for (const photo of photos) {
        formData.append('photos', photo);
      }

      const res = await fetch(`${API_URL}/api/businesses/submit`, {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();

      if (res.ok) {
        setStatus('success');
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else {
        setStatus('error');
        setErrorMsg(data.error || 'Something went wrong. Please try again.');
      }
    } catch {
      setStatus('error');
      setErrorMsg('Unable to connect to the server. Please check your connection and try again.');
    }
  };

  const resetForm = () => {
    setForm({ name: '', email: '', phone: '', businessName: '', category: '', location: '', website: '', description: '', facebook: '', instagram: '' });
    setSelectedTags([]);
    setStatus('idle');
    setErrorMsg('');
    removeLogo();
    setPdf(null);
    photoPreviews.forEach(p => URL.revokeObjectURL(p));
    setPhotos([]);
    setPhotoPreviews([]);
  };

  /* ── SUCCESS STATE ──────────────────────────────────────────── */
  if (status === 'success') {
    return (
      <div className="min-h-screen bg-gray-50">
        <Helmet>{buildPageMeta({ title: 'Business Submitted', path: '/add-business' })}</Helmet>
        <div className="bg-gradient-to-r from-vaal-orange-500 to-vaal-orange-600 text-white py-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="text-2xl sm:text-3xl font-bold">Add Your Business</h1>
          </div>
        </div>
        <div className="max-w-xl mx-auto px-4 py-16 text-center">
          <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 rounded-full bg-green-100">
            <svg className="w-8 h-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Business Submitted!</h2>
          <p className="text-gray-600 mb-6 leading-relaxed">
            Thanks for listing your business on VaalHub.
            Our team will review it and publish it within <strong>1-2 business days</strong>.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link to="/businesses"
              className="px-6 py-2.5 bg-vaal-orange-500 hover:bg-vaal-orange-600 text-white font-semibold rounded-lg transition-colors text-sm">
              Browse Businesses
            </Link>
            <button onClick={resetForm}
              className="px-6 py-2.5 border border-gray-300 text-gray-700 hover:bg-gray-50 font-semibold rounded-lg transition-colors text-sm">
              Submit Another
            </button>
          </div>
        </div>
      </div>
    );
  }

  /* ── MAIN FORM ──────────────────────────────────────────────── */
  return (
    <div className="min-h-screen bg-gray-50">
      <Helmet>
        {buildPageMeta({
          title: 'Add Your Business \u2013 VaalHub',
          description: 'List your Vaal Triangle business on VaalHub for free. Reach thousands of locals looking for services, restaurants, shops and more.',
          path: '/add-business',
        })}
      </Helmet>

      {/* Hero */}
      <div className="bg-gradient-to-r from-vaal-orange-500 to-vaal-orange-600 text-white py-14">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center justify-center w-14 h-14 bg-white/20 rounded-full mb-4">
            <svg className="w-7 h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-3">Add Your Business</h1>
          <p className="text-xl text-white/90 max-w-xl mx-auto">
            Get your business in front of thousands of Vaal Triangle residents — completely free.
          </p>
        </div>
      </div>

      {/* Benefits strip */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
            {[
              { icon: '\uD83C\uDD93', label: 'Always Free', desc: 'No listing fees, ever' },
              { icon: '\uD83D\uDCCD', label: 'Local Reach', desc: 'Thousands of Vaal residents' },
              { icon: '\u26A1', label: 'Quick Setup', desc: 'Live within 1\u20132 business days' },
            ].map((b) => (
              <div key={b.label} className="flex flex-col items-center gap-1">
                <span className="text-3xl">{b.icon}</span>
                <p className="font-semibold text-gray-900 text-sm">{b.label}</p>
                <p className="text-gray-500 text-xs">{b.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12">

        {/* Back link */}
        <Link
          to="/businesses"
          className="inline-flex items-center text-sm text-gray-500 hover:text-gray-700 mb-8 gap-1"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to businesses
        </Link>

        {/* Error banner */}
        {status === 'error' && errorMsg && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-start gap-3">
            <svg className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <circle cx="12" cy="12" r="10" /><path d="M12 8v4m0 4h.01" />
            </svg>
            <p className="text-sm text-red-700">{errorMsg}</p>
          </div>
        )}

        {/* Form card */}
        <div className="bg-white rounded-2xl shadow-md p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-1">Your business details</h2>
          <p className="text-gray-500 text-sm mb-7">
            Fill in as much as you can — we'll do the rest. Fields marked{' '}
            <span className="text-red-500 font-medium">*</span> are required.
          </p>

          <form onSubmit={handleSubmit} className="space-y-6">

            {/* Section: Contact */}
            <div>
              <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4">Your contact info</h3>
              <div className="space-y-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1.5">
                    Your full name <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="name" name="name" type="text" required
                    value={form.name} onChange={handleChange}
                    placeholder="Jane Smith"
                    className={inputClass}
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1.5">
                      Email address <span className="text-red-500">*</span>
                    </label>
                    <input
                      id="email" name="email" type="email" required
                      value={form.email} onChange={handleChange}
                      placeholder="jane@yourbusiness.co.za"
                      className={inputClass}
                    />
                  </div>
                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1.5">
                      Phone number
                    </label>
                    <input
                      id="phone" name="phone" type="tel"
                      value={form.phone} onChange={handleChange}
                      placeholder="016 000 0000"
                      className={inputClass}
                    />
                  </div>
                </div>
              </div>
            </div>

            <hr className="border-gray-100" />

            {/* Section: Business */}
            <div>
              <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4">Business info</h3>
              <div className="space-y-4">
                <div>
                  <label htmlFor="businessName" className="block text-sm font-medium text-gray-700 mb-1.5">
                    Business name <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="businessName" name="businessName" type="text" required
                    value={form.businessName} onChange={handleChange}
                    placeholder="e.g. Vaal Plumbing Services"
                    className={inputClass}
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1.5">
                      Category <span className="text-red-500">*</span>
                    </label>
                    <select
                      id="category" name="category" required
                      value={form.category} onChange={handleChange}
                      className={inputClass}
                    >
                      <option value="">Select a category</option>
                      {CATEGORIES.map((c) => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1.5">
                      Location <span className="text-red-500">*</span>
                    </label>
                    <select
                      id="location" name="location" required
                      value={form.location} onChange={handleChange}
                      className={inputClass}
                    >
                      <option value="">Select a location</option>
                      {LOCATIONS.map((l) => (
                        <option key={l} value={l}>{l}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {availableTags.length > 0 && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      What services do you offer? <span className="text-gray-400 font-normal">(select all that apply)</span>
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {availableTags.map(tag => (
                        <button
                          key={tag}
                          type="button"
                          onClick={() => toggleTag(tag)}
                          className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${
                            selectedTags.includes(tag)
                              ? 'bg-vaal-orange-500 text-white border-vaal-orange-500'
                              : 'bg-white text-gray-600 border-gray-200 hover:border-vaal-orange-300 hover:bg-vaal-orange-50'
                          }`}
                        >
                          {tag}
                        </button>
                      ))}
                    </div>
                    <p className="mt-1.5 text-xs text-gray-400">These help customers find you when searching for specific services.</p>
                  </div>
                )}

                <div>
                  <label htmlFor="website" className="block text-sm font-medium text-gray-700 mb-1.5">
                    Website or social media link
                  </label>
                  <input
                    id="website" name="website" type="text"
                    value={form.website} onChange={handleChange}
                    placeholder="www.yourbusiness.co.za"
                    className={inputClass}
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="facebook" className="block text-sm font-medium text-gray-700 mb-1.5">
                      Facebook page URL
                    </label>
                    <input
                      id="facebook" name="facebook" type="text"
                      value={form.facebook} onChange={handleChange}
                      placeholder="facebook.com/yourbusiness"
                      className={inputClass}
                    />
                  </div>
                  <div>
                    <label htmlFor="instagram" className="block text-sm font-medium text-gray-700 mb-1.5">
                      Instagram URL
                    </label>
                    <input
                      id="instagram" name="instagram" type="text"
                      value={form.instagram} onChange={handleChange}
                      placeholder="instagram.com/yourbusiness"
                      className={inputClass}
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1.5">
                    Brief description <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    id="description" name="description" rows={4} required
                    value={form.description} onChange={handleChange}
                    placeholder="Tell us what your business does, what makes it special, and who it serves..."
                    className={`${inputClass} resize-none`}
                  />
                  <p className="mt-1 text-xs text-gray-400">This will appear on your listing in the directory.</p>
                </div>
              </div>
            </div>

            <hr className="border-gray-100" />

            {/* Section: Media & Documents */}
            <div>
              <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4">Media & documents</h3>
              <p className="text-sm text-gray-500 mb-4">
                Upload your logo, photos of your business, or a PDF brochure / menu. All files are optional.
              </p>

              <div className="space-y-5">

                {/* Logo */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Company logo</label>
                  <div className="flex items-center gap-4">
                    {logoPreview ? (
                      <div className="relative">
                        <img src={logoPreview} alt="Logo preview" className="w-20 h-20 rounded-xl object-cover border border-gray-200" />
                        <button type="button" onClick={removeLogo}
                          className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center text-xs hover:bg-red-600">
                          &times;
                        </button>
                      </div>
                    ) : (
                      <div className="w-20 h-20 rounded-xl border-2 border-dashed border-gray-200 flex items-center justify-center text-gray-300">
                        <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                      </div>
                    )}
                    <div>
                      <label className="cursor-pointer inline-flex items-center gap-1.5 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-medium rounded-lg transition-colors">
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                        </svg>
                        Choose logo
                        <input type="file" accept="image/*" onChange={handleLogoChange} className="hidden" />
                      </label>
                      <p className="text-xs text-gray-400 mt-1">Square, at least 200x200px. Max 2 MB.</p>
                    </div>
                  </div>
                </div>

                {/* PDF */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">PDF document</label>
                  <div className="flex items-center gap-3">
                    <label className="cursor-pointer inline-flex items-center gap-1.5 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-medium rounded-lg transition-colors">
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      {pdf ? 'Change PDF' : 'Choose PDF'}
                      <input type="file" accept=".pdf" onChange={handlePdfChange} className="hidden" />
                    </label>
                    {pdf && (
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-gray-600 truncate max-w-[200px]">{pdf.name}</span>
                        <button type="button" onClick={() => setPdf(null)}
                          className="text-red-500 hover:text-red-600 text-xs font-medium">Remove</button>
                      </div>
                    )}
                  </div>
                  <p className="text-xs text-gray-400 mt-1">Menu, pricelist, or brochure. Max 5 MB.</p>
                </div>

                {/* Photos */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Business photos <span className="text-gray-400 font-normal">({photos.length}/5)</span>
                  </label>
                  {photoPreviews.length > 0 && (
                    <div className="grid grid-cols-3 sm:grid-cols-5 gap-3 mb-3">
                      {photoPreviews.map((src, i) => (
                        <div key={i} className="relative group">
                          <img src={src} alt={`Photo ${i + 1}`} className="w-full aspect-square rounded-lg object-cover border border-gray-200" />
                          <button type="button" onClick={() => removePhoto(i)}
                            className="absolute top-1 right-1 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600">
                            &times;
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                  {photos.length < 5 && (
                    <label className="cursor-pointer inline-flex items-center gap-1.5 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-medium rounded-lg transition-colors">
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                      </svg>
                      Add photos
                      <input type="file" accept="image/*" multiple onChange={handlePhotosChange} className="hidden" />
                    </label>
                  )}
                  <p className="text-xs text-gray-400 mt-1">Photos of your business, products, or team. Each max 3 MB.</p>
                </div>

              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={status === 'loading'}
              className="w-full bg-vaal-orange-500 hover:bg-vaal-orange-600 disabled:bg-vaal-orange-300 text-white font-semibold py-3.5 px-6 rounded-lg transition-colors duration-200 flex items-center justify-center gap-2 text-base shadow-sm"
            >
              {status === 'loading' ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Submitting...
                </>
              ) : (
                <>
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Submit Business for Review
                </>
              )}
            </button>

            <p className="text-center text-xs text-gray-400 -mt-2">
              Our team reviews every submission. Your business will be live within 1-2 business days.
            </p>
          </form>
        </div>

        {/* Already listed? */}
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-xl p-5 text-center">
          <p className="text-sm text-blue-800">
            <span className="font-semibold">Already listed on VaalHub?</span>{' '}
            Find your business in the directory and click{' '}
            <span className="font-semibold">"Claim this listing \u2192"</span>{' '}
            to take ownership of your page.
          </p>
          <Link
            to="/businesses"
            className="inline-block mt-3 text-sm text-blue-600 hover:text-blue-700 font-medium underline underline-offset-2"
          >
            Browse the directory \u2192
          </Link>
        </div>

      </div>
    </div>
  );
}
