import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Save, Mail, User, Shield, Loader2, AlertCircle, CheckCircle2, Calendar } from 'lucide-react';
import { useAuth } from '../../../context/AuthContext';
import { getAdminProfile, updateAdminProfile } from '../../../services/adminApi';

const formatDateTime = (value) => {
  if (!value) return 'Not available';

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return 'Not available';

  return date.toLocaleString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

const normalizeRoleLabel = (role) => {
  if (!role) return 'Admin';

  return String(role)
    .split(' ')
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase())
    .join(' ');
};

const AdminProfileEdit = () => {
  const navigate = useNavigate();
  const { user, fetchProfile } = useAuth();
  const [profile, setProfile] = useState(null);
  const [formData, setFormData] = useState({ name: '', email: '' });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    let isMounted = true;

    const loadProfile = async () => {
      try {
        const response = await getAdminProfile();
        const data = response.data?.data || user || {};

        if (!isMounted) return;

        setProfile(data);
        setFormData({
          name: data.name || '',
          email: data.email || '',
        });
      } catch (err) {
        if (!isMounted) return;
        const fallback = user || {};
        setProfile(fallback);
        setFormData({
          name: fallback.name || '',
          email: fallback.email || '',
        });
        setError(err.response?.data?.error || 'Failed to load admin profile');
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    loadProfile();

    return () => {
      isMounted = false;
    };
  }, [user]);

  const initials = useMemo(() => {
    const parts = String(formData.name || 'Admin')
      .split(' ')
      .filter(Boolean);

    if (!parts.length) return 'A';

    return parts.slice(0, 2).map((part) => part[0]).join('').toUpperCase();
  }, [formData.name]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSaving(true);
    setError(null);
    setSuccess(false);

    try {
      const response = await updateAdminProfile(formData);
      const updatedProfile = response.data?.data || profile || {};

      setProfile(updatedProfile);
      setSuccess(true);

      if (typeof fetchProfile === 'function') {
        await fetchProfile();
      }

      setTimeout(() => {
        navigate('/admin/employees/view');
      }, 1200);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to update admin profile');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-10 h-10 animate-spin text-indigo-600" />
          <p className="text-slate-600 font-medium">Loading admin profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-24">
      <div className="flex items-center justify-between gap-4 border-b border-slate-100 pb-8">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate('/admin/employees/view')}
            className="p-2.5 hover:bg-slate-100 rounded-xl transition-colors"
            aria-label="Back to profile"
          >
            <ArrowLeft size={20} className="text-slate-600" />
          </button>
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 mb-2">Admin Identity</p>
            <h1 className="text-4xl font-black text-slate-800 tracking-tight leading-none">Edit Profile</h1>
          </div>
        </div>
      </div>

      {success && (
        <div className="flex items-center gap-3 p-4 bg-emerald-50 border border-emerald-200 rounded-xl">
          <CheckCircle2 className="w-5 h-5 text-emerald-600" />
          <p className="text-emerald-800 font-medium">Profile updated successfully.</p>
        </div>
      )}

      {error && (
        <div className="flex items-center gap-3 p-4 bg-red-50 border border-red-200 rounded-xl">
          <AlertCircle className="w-5 h-5 text-red-600" />
          <p className="text-red-800">{error}</p>
        </div>
      )}

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        <section className="bg-white rounded-3xl border border-slate-100 shadow-sm p-8 xl:col-span-1 space-y-6">
          <div className="flex justify-center">
            <div className="w-36 h-36 rounded-full bg-gradient-to-br from-slate-900 to-indigo-600 flex items-center justify-center shadow-xl border-4 border-white overflow-hidden">
              {profile?.profilePicture ? (
                <img src={profile.profilePicture} alt={profile?.name || 'Admin'} className="w-full h-full object-cover" />
              ) : (
                <span className="text-5xl font-black text-white">{initials}</span>
              )}
            </div>
          </div>

          <div className="text-center space-y-2">
            <h2 className="text-3xl font-black text-slate-800 tracking-tight">{formData.name || 'Admin User'}</h2>
            <p className="text-xs font-black uppercase tracking-[0.2em] text-indigo-600">{normalizeRoleLabel(profile?.role || user?.role)}</p>
            <p className="text-sm text-slate-500">{formData.email || 'admin@infiap.com'}</p>
          </div>

          <div className="grid grid-cols-1 gap-3 pt-4 border-t border-slate-100">
            <div className="flex items-center justify-between rounded-2xl bg-slate-50 px-4 py-3">
              <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Account ID</span>
              <span className="text-sm font-black text-slate-800">{profile?.id || profile?._id || 'N/A'}</span>
            </div>
            <div className="flex items-center justify-between rounded-2xl bg-slate-50 px-4 py-3">
              <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Created</span>
              <span className="text-sm font-bold text-slate-700">{formatDateTime(profile?.createdAt)}</span>
            </div>
            <div className="flex items-center justify-between rounded-2xl bg-slate-50 px-4 py-3">
              <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Last Updated</span>
              <span className="text-sm font-bold text-slate-700">{formatDateTime(profile?.updatedAt || profile?.createdAt)}</span>
            </div>
          </div>
        </section>

        <section className="bg-white rounded-3xl border border-slate-100 shadow-sm p-8 xl:col-span-2 space-y-8">
          <div className="flex items-center gap-3 pb-6 border-b border-slate-100">
            <div className="w-10 h-10 bg-indigo-50 rounded-xl flex items-center justify-center">
              <User size={18} className="text-indigo-600" />
            </div>
            <h3 className="text-[11px] font-black text-slate-800 uppercase tracking-[0.2em]">Profile Details</h3>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-black text-slate-400 uppercase tracking-wider mb-2">Full Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full bg-white border border-slate-100 hover:border-slate-200 focus:border-indigo-500 outline-none rounded-xl px-4 py-3.5 text-sm font-medium text-slate-800 placeholder:text-slate-400 transition-all"
                  placeholder="Enter full name"
                />
              </div>

              <div>
                <label className="block text-xs font-black text-slate-400 uppercase tracking-wider mb-2">Email Address</label>
                <div className="flex items-center gap-3 bg-white border border-slate-100 hover:border-slate-200 focus-within:border-indigo-500 rounded-xl px-4 py-3.5 transition-all">
                  <Mail size={16} className="text-slate-400 flex-shrink-0" />
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="flex-1 bg-transparent outline-none text-sm font-medium text-slate-800 placeholder:text-slate-400"
                    placeholder="Enter email address"
                  />
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3 p-4 bg-blue-50 border border-blue-100 rounded-2xl">
              <Shield size={18} className="text-blue-600 flex-shrink-0" />
              <p className="text-sm text-blue-800">
                Role updates are controlled from the auth system. This screen only edits the live profile record for name and email.
              </p>
            </div>

            <div className="flex items-center gap-4">
              <button
                type="submit"
                disabled={saving}
                className="flex-1 flex items-center justify-center gap-2 px-6 py-3.5 bg-indigo-600 text-white text-[10px] font-black uppercase tracking-widest rounded-xl shadow-lg hover:bg-indigo-700 transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {saving ? (
                  <>
                    <Loader2 size={16} className="animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save size={16} />
                    Save Changes
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={() => navigate('/admin/employees/view')}
                className="flex-1 flex items-center justify-center gap-2 px-6 py-3.5 bg-slate-100 text-slate-800 text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-slate-200 transition-all"
              >
                Cancel
              </button>
            </div>

            <div className="flex items-start gap-3 p-4 bg-slate-50 border border-slate-100 rounded-2xl">
              <Calendar size={16} className="text-slate-400 mt-0.5 flex-shrink-0" />
              <p className="text-xs text-slate-600">
                The profile timestamp updates from the backend, so the view screen always reflects the latest save time.
              </p>
            </div>
          </form>
        </section>
      </div>
    </div>
  );
};

export default AdminProfileEdit;