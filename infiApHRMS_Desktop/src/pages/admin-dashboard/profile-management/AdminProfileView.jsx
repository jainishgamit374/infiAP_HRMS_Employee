import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Calendar, Edit3, Mail, Shield, Loader2, AlertCircle, User, BadgeCheck } from 'lucide-react';
import { useAuth } from '../../../context/AuthContext';
import { getAdminProfile } from '../../../services/adminApi';

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

  const value = String(role).trim();
  if (!value) return 'Admin';

  return value
    .split(' ')
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase())
    .join(' ');
};

const AdminProfileView = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;

    const loadProfile = async () => {
      try {
        const response = await getAdminProfile();
        if (!isMounted) return;
        setProfile(response.data?.data || null);
      } catch (err) {
        if (!isMounted) return;
        setError(err.response?.data?.error || 'Failed to load admin profile');
        setProfile(user || null);
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

  const displayData = profile || user || {};

  const initials = useMemo(() => {
    const parts = String(displayData.name || 'Admin')
      .split(' ')
      .filter(Boolean);

    if (!parts.length) return 'A';

    return parts.slice(0, 2).map((part) => part[0]).join('').toUpperCase();
  }, [displayData.name]);

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
            onClick={() => navigate('/admin/dashboard')}
            className="p-2.5 hover:bg-slate-100 rounded-xl transition-colors"
            aria-label="Back to dashboard"
          >
            <ArrowLeft size={20} className="text-slate-600" />
          </button>
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 mb-2">Admin Identity</p>
            <h1 className="text-4xl font-black text-slate-800 tracking-tight leading-none">View Profile</h1>
          </div>
        </div>

        <button
          onClick={() => navigate('/admin/employees/edit')}
          className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 text-white text-[10px] font-black uppercase tracking-widest rounded-xl shadow-lg hover:bg-indigo-700 transition-all active:scale-95"
        >
          <Edit3 size={14} />
          Edit Profile
        </button>
      </div>

      {error && (
        <div className="flex items-center gap-3 p-4 bg-amber-50 border border-amber-200 rounded-xl">
          <AlertCircle className="w-5 h-5 text-amber-600" />
          <p className="text-amber-900">{error}</p>
        </div>
      )}

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        <section className="bg-white rounded-3xl border border-slate-100 shadow-sm p-8 xl:col-span-1 space-y-6">
          <div className="flex justify-center">
            <div className="w-36 h-36 rounded-full bg-gradient-to-br from-slate-900 to-indigo-600 flex items-center justify-center shadow-xl border-4 border-white overflow-hidden">
              {displayData.profilePicture ? (
                <img src={displayData.profilePicture} alt={displayData.name || 'Admin'} className="w-full h-full object-cover" />
              ) : (
                <span className="text-5xl font-black text-white">{initials}</span>
              )}
            </div>
          </div>

          <div className="text-center space-y-2">
            <h2 className="text-3xl font-black text-slate-800 tracking-tight">{displayData.name || 'Admin User'}</h2>
            <p className="text-xs font-black uppercase tracking-[0.2em] text-indigo-600">{normalizeRoleLabel(displayData.role || user?.role)}</p>
            <p className="text-sm text-slate-500">{displayData.email || 'admin@infiap.com'}</p>
          </div>

          <div className="grid grid-cols-1 gap-3 pt-4 border-t border-slate-100">
            <div className="flex items-center justify-between rounded-2xl bg-slate-50 px-4 py-3">
              <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Account ID</span>
              <span className="text-sm font-black text-slate-800">{displayData.id || displayData._id || 'N/A'}</span>
            </div>
            <div className="flex items-center justify-between rounded-2xl bg-slate-50 px-4 py-3">
              <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Created</span>
              <span className="text-sm font-bold text-slate-700">{formatDateTime(displayData.createdAt)}</span>
            </div>
            <div className="flex items-center justify-between rounded-2xl bg-slate-50 px-4 py-3">
              <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Last Updated</span>
              <span className="text-sm font-bold text-slate-700">{formatDateTime(displayData.updatedAt)}</span>
            </div>
          </div>
        </section>

        <section className="bg-white rounded-3xl border border-slate-100 shadow-sm p-8 xl:col-span-2 space-y-8">
          <div className="flex items-center gap-3 pb-6 border-b border-slate-100">
            <div className="w-10 h-10 bg-indigo-50 rounded-xl flex items-center justify-center">
              <User size={18} className="text-indigo-600" />
            </div>
            <h3 className="text-[11px] font-black text-slate-800 uppercase tracking-[0.2em]">Account Overview</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-black text-slate-400 uppercase tracking-wider mb-2">Full Name</label>
              <p className="text-sm font-bold text-slate-800 bg-slate-50 px-4 py-3 rounded-xl">{displayData.name || 'Not set'}</p>
            </div>

            <div>
              <label className="block text-xs font-black text-slate-400 uppercase tracking-wider mb-2">Email Address</label>
              <div className="flex items-center gap-3 bg-slate-50 px-4 py-3 rounded-xl">
                <Mail size={16} className="text-slate-400" />
                <p className="text-sm font-bold text-slate-800">{displayData.email || 'Not set'}</p>
              </div>
            </div>

            <div>
              <label className="block text-xs font-black text-slate-400 uppercase tracking-wider mb-2">Role</label>
              <div className="flex items-center gap-3 bg-slate-50 px-4 py-3 rounded-xl">
                <Shield size={16} className="text-slate-400" />
                <p className="text-sm font-bold text-slate-800">{normalizeRoleLabel(displayData.role || user?.role)}</p>
              </div>
            </div>

            <div>
              <label className="block text-xs font-black text-slate-400 uppercase tracking-wider mb-2">Profile Synced</label>
              <div className="flex items-center gap-3 bg-slate-50 px-4 py-3 rounded-xl">
                <Calendar size={16} className="text-slate-400" />
                <p className="text-sm font-bold text-slate-800">{formatDateTime(displayData.updatedAt || displayData.createdAt)}</p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3 p-4 bg-emerald-50 border border-emerald-100 rounded-2xl">
            <BadgeCheck size={18} className="text-emerald-600 flex-shrink-0" />
            <p className="text-sm text-emerald-800 font-medium">
              This profile is loaded from the authenticated admin record, so changes stay in sync across the dashboard.
            </p>
          </div>
        </section>
      </div>
    </div>
  );
};

export default AdminProfileView;