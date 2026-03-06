import { useState, useEffect, useCallback } from 'react';
import { useNavigate, Link } from 'react-router-dom';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const EDITABLE_FIELDS = [
  { key: 'description',      label: 'Description',      type: 'textarea', rows: 4, placeholder: 'Tell people about your business…' },
  { key: 'phone',            label: 'Phone',            type: 'tel',      placeholder: '016 000 0000' },
  { key: 'email',            label: 'Public email',     type: 'email',    placeholder: 'contact@yourbusiness.co.za' },
  { key: 'website',          label: 'Website',          type: 'url',      placeholder: 'https://yourbusiness.co.za' },
  { key: 'address',          label: 'Address',          type: 'text',     placeholder: '123 Main St, Vanderbijlpark' },
  { key: 'operating_hours',  label: 'Operating hours',  type: 'text',     placeholder: 'Mon–Fri 8am–5pm' },
  { key: 'logo_url',         label: 'Logo URL',         type: 'url',      placeholder: 'https://…/logo.png' },
  { key: 'facebook',         label: 'Facebook URL',     type: 'url',      placeholder: 'https://facebook.com/yourbusiness' },
  { key: 'instagram',        label: 'Instagram URL',    type: 'url',      placeholder: 'https://instagram.com/yourbusiness' },
];

export default function PortalDashboard() {
  const navigate = useNavigate();
  const token = localStorage.getItem('vaalhub_portal_token');

  const [business, setBusiness] = useState(null);
  const [form, setForm] = useState({});
  const [loadStatus, setLoadStatus] = useState('loading'); // loading | ready | error

  const [saveStatus, setSaveStatus] = useState('idle'); // idle | saving | saved | error
  const [saveMsg, setSaveMsg] = useState('');

  const [pwForm, setPwForm] = useState({
    current_password: '',
    new_password: '',
    confirm_password: '',
  });
  const [pwStatus, setPwStatus] = useState('idle'); // idle | saving | saved | error
  const [pwMsg, setPwMsg] = useState('');

  /* ── Auth helper ─────────────────────────────────────────── */
  const logout = useCallback(() => {
    localStorage.removeItem('vaalhub_portal_token');
    navigate('/portal', { replace: true });
  }, [navigate]);

  /* ── Load business data on mount ─────────────────────────── */
  useEffect(() => {
    if (!token) {
      navigate('/portal', { replace: true });
      return;
    }

    fetch(`${API_URL}/api/portal/business`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json().then((data) => ({ ok: res.ok, status: res.status, data })))
      .then(({ ok, status, data }) => {
        if (ok) {
          setBusiness(data.business);
          // Pre-fill only editable fields
          const f = {};
          EDITABLE_FIELDS.forEach(({ key }) => {
            f[key] = data.business[key] || '';
          });
          setForm(f);
          setLoadStatus('ready');
        } else if (status === 401) {
          logout();
        } else {
          setLoadStatus('error');
        }
      })
      .catch(() => setLoadStatus('error'));
  }, [token, navigate, logout]);

  /* ── Save business info ──────────────────────────────────── */
  const handleSave = async (e) => {
    e.preventDefault();
    setSaveStatus('saving');
    setSaveMsg('');

    try {
      const res = await fetch(`${API_URL}/api/portal/business`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (res.ok) {
        setSaveStatus('saved');
        setSaveMsg('Changes saved successfully!');
        setTimeout(() => setSaveStatus('idle'), 3000);
      } else if (res.status === 401) {
        logout();
      } else {
        setSaveStatus('error');
        setSaveMsg(data.error || 'Failed to save changes.');
      }
    } catch {
      setSaveStatus('error');
      setSaveMsg('Connection error. Please try again.');
    }
  };

  /* ── Change password ─────────────────────────────────────── */
  const handlePwChange = async (e) => {
    e.preventDefault();

    if (pwForm.new_password !== pwForm.confirm_password) {
      setPwStatus('error');
      setPwMsg('New passwords do not match.');
      return;
    }
    if (pwForm.new_password.length < 8) {
      setPwStatus('error');
      setPwMsg('New password must be at least 8 characters.');
      return;
    }

    setPwStatus('saving');
    setPwMsg('');

    try {
      const res = await fetch(`${API_URL}/api/portal/change-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          current_password: pwForm.current_password,
          new_password: pwForm.new_password,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        setPwStatus('saved');
        setPwMsg('Password changed successfully!');
        setPwForm({ current_password: '', new_password: '', confirm_password: '' });
        setTimeout(() => setPwStatus('idle'), 3000);
      } else if (res.status === 401) {
        logout();
      } else {
        setPwStatus('error');
        setPwMsg(data.error || 'Failed to change password.');
      }
    } catch {
      setPwStatus('error');
      setPwMsg('Connection error. Please try again.');
    }
  };

  /* ── Loading state ───────────────────────────────────────── */
  if (loadStatus === 'loading') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <svg className="animate-spin h-10 w-10 text-vaal-orange-500 mx-auto mb-4" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
          <p className="text-gray-500">Loading your dashboard…</p>
        </div>
      </div>
    );
  }

  /* ── Error state ─────────────────────────────────────────── */
  if (loadStatus === 'error') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="text-center max-w-sm">
          <div className="flex items-center justify-center w-14 h-14 bg-red-100 rounded-full mx-auto mb-4">
            <svg className="w-7 h-7 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h2 className="text-lg font-bold text-gray-900 mb-2">Failed to load data</h2>
          <p className="text-gray-500 text-sm mb-6">Could not connect to the server. Please try again.</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-vaal-orange-500 hover:bg-vaal-orange-600 text-white font-semibold py-2 px-5 rounded-lg transition-colors text-sm"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  /* ── Dashboard ───────────────────────────────────────────── */
  return (
    <div className="min-h-screen bg-gray-50">

      {/* Top navigation bar */}
      <header className="bg-white border-b border-gray-200 px-4 sm:px-6 lg:px-8 py-4 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link to="/" className="flex items-center gap-2">
              <span className="bg-vaal-orange-500 text-white font-bold text-sm px-2.5 py-1 rounded-md">VH</span>
            </Link>
            <div>
              <p className="font-semibold text-gray-900 leading-tight">{business?.business_name}</p>
              <p className="text-xs text-gray-500">Business Portal</p>
            </div>
          </div>
          <button
            onClick={logout}
            className="text-sm text-gray-500 hover:text-gray-700 flex items-center gap-1.5 border border-gray-200 rounded-lg px-3 py-1.5 hover:bg-gray-50 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            Sign out
          </button>
        </div>
      </header>

      {/* Main content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">

        {/* Verified status banner */}
        <div className="flex items-center gap-3 bg-green-50 border border-green-200 rounded-xl p-4">
          <svg className="w-5 h-5 text-green-600 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
          <div>
            <p className="text-sm font-semibold text-green-800">Verified Listing</p>
            <p className="text-xs text-green-700">Your business shows a verified badge on VaalHub</p>
          </div>
          <Link
            to="/businesses"
            className="ml-auto text-xs text-green-700 hover:text-green-900 underline underline-offset-2 whitespace-nowrap"
          >
            View listing →
          </Link>
        </div>

        {/* ── Business information form ───────────────────────── */}
        <section className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sm:p-8">
          <h2 className="text-lg font-bold text-gray-900 mb-1">Business Information</h2>
          <p className="text-sm text-gray-500 mb-6">
            Update the details shown on your public listing. Changes are reflected immediately after saving.
          </p>

          <form onSubmit={handleSave} className="space-y-5">
            {EDITABLE_FIELDS.map(({ key, label, type, rows, placeholder }) => (
              <div key={key}>
                <label htmlFor={key} className="block text-sm font-medium text-gray-700 mb-1.5">
                  {label}
                </label>
                {type === 'textarea' ? (
                  <textarea
                    id={key}
                    rows={rows}
                    value={form[key] || ''}
                    onChange={(e) => setForm((f) => ({ ...f, [key]: e.target.value }))}
                    placeholder={placeholder}
                    disabled={saveStatus === 'saving'}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-vaal-orange-500 focus:border-vaal-orange-500 resize-y disabled:opacity-50 text-sm"
                  />
                ) : (
                  <input
                    id={key}
                    type={type}
                    value={form[key] || ''}
                    onChange={(e) => setForm((f) => ({ ...f, [key]: e.target.value }))}
                    placeholder={placeholder}
                    disabled={saveStatus === 'saving'}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-vaal-orange-500 focus:border-vaal-orange-500 disabled:opacity-50 text-sm"
                  />
                )}
              </div>
            ))}

            {/* Save status feedback */}
            {saveStatus === 'saved' && (
              <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg text-sm flex items-center gap-2">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                {saveMsg}
              </div>
            )}
            {saveStatus === 'error' && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                {saveMsg}
              </div>
            )}

            <div className="pt-2">
              <button
                type="submit"
                disabled={saveStatus === 'saving'}
                className="bg-vaal-orange-500 hover:bg-vaal-orange-600 text-white font-semibold py-2.5 px-6 rounded-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 text-sm"
              >
                {saveStatus === 'saving' ? (
                  <>
                    <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Saving…
                  </>
                ) : (
                  'Save Changes'
                )}
              </button>
            </div>
          </form>
        </section>

        {/* ── Change password ─────────────────────────────────── */}
        <section className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sm:p-8">
          <h2 className="text-lg font-bold text-gray-900 mb-1">Change Password</h2>
          <p className="text-sm text-gray-500 mb-6">
            Keep your portal account secure with a strong, unique password.
          </p>

          <form onSubmit={handlePwChange} className="space-y-4 max-w-sm">
            {[
              { key: 'current_password', label: 'Current password' },
              { key: 'new_password',     label: 'New password' },
              { key: 'confirm_password', label: 'Confirm new password' },
            ].map(({ key, label }) => (
              <div key={key}>
                <label htmlFor={key} className="block text-sm font-medium text-gray-700 mb-1.5">
                  {label}
                </label>
                <input
                  id={key}
                  type="password"
                  value={pwForm[key]}
                  onChange={(e) => setPwForm((f) => ({ ...f, [key]: e.target.value }))}
                  disabled={pwStatus === 'saving'}
                  placeholder="••••••••"
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-vaal-orange-500 focus:border-vaal-orange-500 disabled:opacity-50 text-sm"
                />
              </div>
            ))}

            {pwStatus === 'saved' && (
              <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg text-sm">
                {pwMsg}
              </div>
            )}
            {pwStatus === 'error' && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                {pwMsg}
              </div>
            )}

            <button
              type="submit"
              disabled={pwStatus === 'saving'}
              className="bg-gray-800 hover:bg-gray-900 text-white font-semibold py-2.5 px-5 rounded-lg transition-colors text-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {pwStatus === 'saving' ? (
                <>
                  <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Updating…
                </>
              ) : (
                'Update Password'
              )}
            </button>
          </form>
        </section>

        {/* Footer */}
        <p className="text-center text-xs text-gray-400 pb-6">
          VaalHub Business Portal ·{' '}
          <a href="mailto:info@vaalhub.co.za" className="hover:text-gray-600">
            info@vaalhub.co.za
          </a>
        </p>
      </main>
    </div>
  );
}
