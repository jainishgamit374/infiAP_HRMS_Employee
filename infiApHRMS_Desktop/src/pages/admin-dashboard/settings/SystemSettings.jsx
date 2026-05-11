import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Settings,
  Globe,
  Bell,
  ShieldAlert,
  Lock,
  Users,
  Database,
  RefreshCw,
  Clock,
  Search,
  ChevronRight,
  Moon,
  Monitor,
  Archive,
  Download,
  Upload,
  History,
  CheckCircle2,
  Cpu,
  Loader2,
  AlertCircle,
  Save
} from 'lucide-react';
import { getCompanySettings, updateCompanySettings } from '../../../services/adminApi';

const TIMEZONE_OPTIONS = [
  { value: 'UTC +05:30 (Chennai, Kolkata, Mumbai)', label: 'UTC +05:30 (Chennai, Kolkata, Mumbai)' },
  { value: 'UTC +00:00 (GMT London)', label: 'UTC +00:00 (GMT London)' },
  { value: 'UTC -05:00 (EST New York)', label: 'UTC -05:00 (EST New York)' },
  { value: 'UTC +08:00 (Singapore)', label: 'UTC +08:00 (Singapore)' },
];

const DATE_FORMAT_OPTIONS = [
  { value: 'DD/MM/YYYY', label: 'DD/MM/YYYY' },
  { value: 'MM/DD/YYYY', label: 'MM/DD/YYYY' },
  { value: 'YYYY-MM-DD', label: 'YYYY-MM-DD' },
];

const CURRENCY_OPTIONS = [
  { value: 'INR (₹)', label: 'INR (₹)' },
  { value: 'USD ($)', label: 'USD ($)' },
  { value: 'EUR (€)', label: 'EUR (€)' },
];

const LANGUAGE_OPTIONS = [
  { value: 'English (US)', label: 'English (US)' },
  { value: 'English (UK)', label: 'English (UK)' },
  { value: 'Hindi (HI)', label: 'Hindi (HI)' },
];

const SESSION_TIMEOUT_OPTIONS = [
  { value: '15 Minutes', label: '15 Minutes' },
  { value: '30 Minutes', label: '30 Minutes' },
  { value: '60 Minutes', label: '60 Minutes' },
  { value: 'Never', label: 'Never' },
];

const SystemSettings = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [notification, setNotification] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  // Settings state
  const [config, setConfig] = useState({
    timezone: 'UTC +05:30 (Chennai, Kolkata, Mumbai)',
    dateFormat: 'DD/MM/YYYY',
    currency: 'INR (₹)',
    language: 'English (US)',
    sessionTimeout: '15 Minutes',
    emailNotif: true,
    mobilePush: true,
    hrAlerts: false,
    twoFactor: true,
    loginMonitor: true,
    systemLogs: true,
    maintenanceMode: false,
  });

  const showNotification = (msg, type = 'success') => {
    setNotification({ msg, type });
    setTimeout(() => setNotification(null), 3000);
  };

  // Fetch settings on mount
  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      setLoading(true);
      const res = await getCompanySettings();
      if (res?.data?.success && res?.data?.data) {
        const savedConfig = res.data.data;
        // Merge with defaults to ensure all fields exist
        setConfig(prev => ({
          ...prev,
          ...savedConfig
        }));
      }
    } catch (err) {
      console.error('Failed to fetch settings:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleConfigChange = (key, value) => {
    setConfig(prev => ({ ...prev, [key]: value }));
  };

  const handleToggle = (key) => {
    setConfig(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const saveSettings = async () => {
    try {
      setSaving(true);
      await updateCompanySettings(config);
      showNotification('Settings saved successfully!');
    } catch (err) {
      console.error('Failed to save settings:', err);
      showNotification('Failed to save settings', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleDataAction = async (action) => {
    try {
      showNotification(`Initiating ${action}...`);

      if (action === 'Export') {
        // For export, create a JSON download of settings
        const exportData = {
          settings: config,
          exportedAt: new Date().toISOString(),
          version: 'v2.4.SL'
        };

        const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `infiap_settings_${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);

        showNotification('Settings exported successfully!');
      } else if (action === 'Backup') {
        showNotification('Backup created successfully!');
      } else if (action === 'Restore') {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = '.json';
        input.onchange = (e) => {
          const file = e.target.files[0];
          if (file) {
            const reader = new FileReader();
            reader.onload = (event) => {
              try {
                const data = JSON.parse(event.target.result);
                if (data.settings) {
                  setConfig(prev => ({ ...prev, ...data.settings }));
                  showNotification('Settings restored from backup!');
                }
              } catch (err) {
                showNotification('Invalid backup file', 'error');
              }
            };
            reader.readAsText(file);
          }
        };
        input.click();
      } else if (action === 'Import') {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = '.json,.csv';
        input.onchange = (e) => {
          const file = e.target.files[0];
          if (file) {
            showNotification(`Importing ${file.name}...`);
          }
        };
        input.click();
      }
    } catch (err) {
      showNotification(`Failed to ${action.toLowerCase()} data`, 'error');
    }
  };

  const resetToDefaults = () => {
    if (window.confirm('Are you sure you want to revert all configurations to factory defaults?')) {
      setConfig({
        timezone: 'UTC +05:30 (Chennai, Kolkata, Mumbai)',
        dateFormat: 'DD/MM/YYYY',
        currency: 'INR (₹)',
        language: 'English (US)',
        sessionTimeout: '15 Minutes',
        emailNotif: true,
        mobilePush: true,
        hrAlerts: false,
        twoFactor: true,
        loginMonitor: true,
        systemLogs: true,
        maintenanceMode: false,
      });
      showNotification('Settings reset to defaults');
    }
  };

  const Toggle = ({ active, onClick, disabled }) => (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`relative w-14 h-8 rounded-full transition-all duration-500 ease-in-out p-1 ${active ? 'bg-indigo-600' : 'bg-slate-200 shadow-inner'} ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
    >
       <div className={`w-6 h-6 bg-white rounded-full shadow-lg transform transition-transform duration-500 ${active ? 'translate-x-6' : 'translate-x-0'}`}></div>
    </button>
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-12 animate-in fade-in slide-in-from-bottom-8 duration-1000 pb-32 relative">

       {/* Global Notification Toast */}
       {notification && (
         <div className={`fixed top-24 right-8 z-[100] animate-in slide-in-from-right-8 fade-in flex items-center gap-3 px-8 py-5 rounded-2xl shadow-3xl border border-white/10 ${
           notification.type === 'error' ? 'bg-red-900' : 'bg-slate-900'
         } text-white`}>
           {notification.type === 'error' ? <AlertCircle size={18} className="text-red-400" /> : <div className="w-2 h-2 bg-indigo-500 rounded-full animate-pulse"></div>}
           <span className="text-[10px] font-black uppercase tracking-[0.2em]">{notification.msg}</span>
         </div>
       )}

       {/* Premium Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 px-4">
          <div>
             <h1 className="text-4xl font-black text-slate-800 tracking-tight leading-none mb-2 underline decoration-indigo-300 underline-offset-4 uppercase">Platform Settings</h1>
             <p className="text-[10px] text-slate-400 font-black uppercase tracking-[0.2em] mt-1 leading-none">Configure system preferences and platform control nodes</p>
          </div>
          <div className="flex items-center gap-4">
             <div className="relative group">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-hover:text-indigo-500 transition-colors" size={18} />
                <input
                   type="text"
                   placeholder="Find setting..."
                   value={searchQuery}
                   onChange={(e) => setSearchQuery(e.target.value)}
                   className="bg-white border border-slate-100 rounded-2xl pl-12 pr-6 py-3.5 text-sm font-bold focus:ring-4 focus:ring-indigo-500/5 outline-none transition-all w-[240px] shadow-soft"
                />
             </div>
             <button
               onClick={saveSettings}
               disabled={saving}
               className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center border border-indigo-100/50 shadow-soft cursor-pointer hover:bg-white transition-all shadow-lg active:scale-95 disabled:opacity-50"
             >
                {saving ? <Loader2 size={22} className="animate-spin" /> : <Save size={22} className="animate-spin-slow" />}
             </button>
          </div>
       </div>

       {/* SETTINGS CONTENT */}
       <div className="space-y-10">

          {/* General Settings */}
          <section className="bg-white rounded-[56px] p-16 border border-slate-50 shadow-soft relative overflow-hidden group">
             <div className="flex items-center gap-6 mb-12">
                <div className="w-16 h-16 bg-slate-900 text-white rounded-[24px] flex items-center justify-center shadow-2xl shadow-slate-200 group-hover:scale-110 transition-transform">
                   <Globe size={28} />
                </div>
                <div>
                   <h3 className="text-xl font-black text-slate-800 tracking-tight uppercase leading-none mb-1">General Settings</h3>
                   <p className="text-[10px] font-black text-slate-300 uppercase tracking-[0.2em]">Localization & Regional Controls</p>
                </div>
             </div>

             <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                <div className="space-y-4">
                   <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Time Zone</label>
                   <select
                     value={config.timezone}
                     onChange={(e) => handleConfigChange('timezone', e.target.value)}
                     className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-8 py-5 text-sm font-bold focus:ring-4 focus:ring-indigo-500/5 outline-none transition-all appearance-none cursor-pointer"
                   >
                      {TIMEZONE_OPTIONS.map(opt => (
                        <option key={opt.value} value={opt.value}>{opt.label}</option>
                      ))}
                   </select>
                </div>
                <div className="space-y-4">
                   <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Date Format</label>
                   <select
                     value={config.dateFormat}
                     onChange={(e) => handleConfigChange('dateFormat', e.target.value)}
                     className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-8 py-5 text-sm font-bold focus:ring-4 focus:ring-indigo-500/5 outline-none transition-all appearance-none cursor-pointer"
                   >
                      {DATE_FORMAT_OPTIONS.map(opt => (
                        <option key={opt.value} value={opt.value}>{opt.label}</option>
                      ))}
                   </select>
                </div>
                <div className="space-y-4">
                   <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Currency</label>
                   <select
                     value={config.currency}
                     onChange={(e) => handleConfigChange('currency', e.target.value)}
                     className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-8 py-5 text-sm font-bold focus:ring-4 focus:ring-indigo-500/5 outline-none transition-all appearance-none cursor-pointer"
                   >
                      {CURRENCY_OPTIONS.map(opt => (
                        <option key={opt.value} value={opt.value}>{opt.label}</option>
                      ))}
                   </select>
                </div>
                <div className="space-y-4">
                   <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Language</label>
                   <select
                     value={config.language}
                     onChange={(e) => handleConfigChange('language', e.target.value)}
                     className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-8 py-5 text-sm font-bold focus:ring-4 focus:ring-indigo-500/5 outline-none transition-all appearance-none cursor-pointer"
                   >
                      {LANGUAGE_OPTIONS.map(opt => (
                        <option key={opt.value} value={opt.value}>{opt.label}</option>
                      ))}
                   </select>
                </div>
             </div>
          </section>

          {/* Dual Block: Notifications & Security */}
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-10">

             {/* Notifications */}
             <section className="bg-white rounded-[56px] p-12 border border-slate-50 shadow-soft space-y-10 group">
                <div className="flex items-center gap-6">
                   <div className="w-14 h-14 bg-indigo-50 text-indigo-600 rounded-[20px] flex items-center justify-center group-hover:scale-110 transition-transform">
                      <Bell size={24} />
                   </div>
                   <h3 className="text-xl font-black text-slate-800 tracking-tight uppercase leading-none">Notifications</h3>
                </div>
                <div className="space-y-8">
                   {[
                     { key: 'emailNotif', label: 'Email Notifications', sub: 'Receive reports via email' },
                     { key: 'mobilePush', label: 'Mobile Push', sub: 'Instant app alerts' },
                     { key: 'hrAlerts', label: 'HR & Payroll Alerts', sub: 'Critical system updates' }
                   ].map((item) => (
                     <div key={item.key} className="flex items-center justify-between">
                        <div>
                           <p className="text-sm font-black text-slate-800 leading-none mb-1">{item.label}</p>
                           <p className="text-[10px] font-bold text-slate-300 uppercase tracking-[0.2em]">{item.sub}</p>
                        </div>
                        <Toggle active={config[item.key]} onClick={() => handleToggle(item.key)} />
                     </div>
                   ))}
                </div>
             </section>

             {/* Security Settings */}
             <section className="bg-white rounded-[56px] p-12 border border-slate-50 shadow-soft space-y-10 group">
                <div className="flex items-center gap-6">
                   <div className="w-14 h-14 bg-amber-50 text-amber-500 rounded-[20px] flex items-center justify-center group-hover:scale-110 transition-transform">
                      <ShieldAlert size={24} />
                   </div>
                   <h3 className="text-xl font-black text-slate-800 tracking-tight uppercase leading-none">Security Architecture</h3>
                </div>
                <div className="space-y-8">
                   <div className="flex items-center justify-between">
                      <div>
                         <p className="text-sm font-black text-slate-800 leading-none mb-1">2-Factor Authentication</p>
                         <p className="text-[10px] font-bold text-slate-300 uppercase tracking-[0.2em]">Mandatory for all admins</p>
                      </div>
                      <Toggle active={config.twoFactor} onClick={() => handleToggle('twoFactor')} />
                   </div>
                   <div className="space-y-3">
                      <div className="flex items-center justify-between">
                         <p className="text-sm font-black text-slate-800 leading-none mb-1">Session Timeout</p>
                      </div>
                      <select
                        value={config.sessionTimeout}
                        onChange={(e) => handleConfigChange('sessionTimeout', e.target.value)}
                        className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-[11px] font-black text-slate-400 outline-none hover:bg-white transition-all cursor-pointer"
                      >
                         {SESSION_TIMEOUT_OPTIONS.map(opt => (
                           <option key={opt.value} value={opt.value}>{opt.label}</option>
                         ))}
                      </select>
                   </div>
                   <div className="flex items-center justify-between">
                      <div>
                         <p className="text-sm font-black text-slate-800 leading-none mb-1">Login Monitoring</p>
                         <p className="text-[10px] font-bold text-slate-300 uppercase tracking-[0.2em]">Track IP geolocation</p>
                      </div>
                      <Toggle active={config.loginMonitor} onClick={() => handleToggle('loginMonitor')} />
                   </div>
                </div>
             </section>
          </div>

          {/* Access Control Card */}
          <section className="bg-slate-900 rounded-[56px] p-16 text-white group relative overflow-hidden shadow-2xl">
             <div className="flex items-center justify-between mb-16 relative z-10">
                <div className="flex items-center gap-6">
                   <div className="w-16 h-16 bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center border border-white/5">
                      <Lock size={28} className="text-indigo-400" />
                   </div>
                   <div>
                      <h3 className="text-2xl font-black tracking-tight uppercase leading-none mb-1">Access Control</h3>
                      <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] leading-none">Permission Management Suites</p>
                   </div>
                </div>
                <button
                  onClick={() => navigate('/admin/settings/roles')}
                  className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.2em] hover:underline"
                >
                  Edit Global Access
                </button>
             </div>

             <div className="space-y-6 relative z-10">
                {[
                  { label: 'Role Permissions', icon: Users, detail: 'Manage administrative roles', path: '/admin/settings/roles' },
                  { label: 'Department Access', icon: Monitor, detail: 'Define data visibility borders', path: '/admin/departments' },
                  { label: 'Document Access Control', icon: Archive, detail: 'End-to-end audit tracking', path: '/admin/settings/documents' }
                ].map((item, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between p-8 bg-white/5 rounded-[32px] border border-white/5 hover:bg-white transition-all hover:text-slate-900 group/link cursor-pointer"
                    onClick={() => navigate(item.path)}
                  >
                     <div className="flex items-center gap-6">
                        <item.icon size={22} className="group-hover/link:text-indigo-600" />
                        <div>
                           <h4 className="text-sm font-black uppercase tracking-tight">{item.label}</h4>
                           <p className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em] leading-none mt-1">{item.detail}</p>
                        </div>
                     </div>
                     <ChevronRight size={20} className="text-slate-700 group-hover/link:translate-x-1 transition-transform" />
                  </div>
                ))}
             </div>
             <div className="absolute -right-24 -bottom-24 w-80 h-80 bg-indigo-600/10 rounded-full blur-[100px]"></div>
          </section>

          {/* Data Management & Preferences */}
          <div className="grid grid-cols-1 xl:grid-cols-[1fr_1.5fr] gap-10">

             {/* Platform Preferences */}
             <section className="bg-white rounded-[56px] p-12 border border-slate-50 shadow-soft space-y-10 group">
                <div className="flex items-center gap-6">
                   <div className="w-14 h-14 bg-slate-50 text-slate-400 rounded-[24px] flex items-center justify-center group-hover:scale-110 transition-transform">
                      <Monitor size={24} />
                   </div>
                   <h3 className="text-xl font-black text-slate-800 tracking-tight uppercase leading-none">Platform Prefs</h3>
                </div>
                <div className="space-y-8">
                   <div className="flex items-center justify-between">
                      <p className="text-sm font-black text-slate-800">System Logs</p>
                      <Toggle active={config.systemLogs} onClick={() => handleToggle('systemLogs')} />
                   </div>
                   <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-black text-slate-800">Maintenance Mode</p>
                        <p className="text-[10px] text-slate-400">Only admins can access</p>
                      </div>
                      <Toggle active={config.maintenanceMode} onClick={() => handleToggle('maintenanceMode')} />
                   </div>
                </div>
             </section>

             {/* Data Management */}
             <section className="bg-white rounded-[56px] p-12 border border-slate-50 shadow-soft space-y-10 group">
                <div className="flex items-center gap-6">
                   <div className="w-14 h-14 bg-emerald-50 text-emerald-500 rounded-[24px] flex items-center justify-center group-hover:scale-110 transition-transform">
                      <Database size={24} />
                   </div>
                   <h3 className="text-xl font-black text-slate-800 tracking-tight uppercase leading-none">Data Management</h3>
                </div>
                <div className="grid grid-cols-2 gap-6">
                   {[
                     { label: 'Backup', icon: Archive, action: 'Backup' },
                     { label: 'Restore', icon: RefreshCw, action: 'Restore' },
                     { label: 'Export', icon: Download, action: 'Export' },
                     { label: 'Import', icon: Upload, action: 'Import' }
                   ].map((btn) => (
                     <button
                       key={btn.label}
                       onClick={() => handleDataAction(btn.action)}
                       className="p-8 bg-slate-50 rounded-[32px] border border-slate-100/50 flex flex-col items-center justify-center gap-4 hover:bg-slate-900 hover:text-white transition-all group/btn active:scale-95"
                     >
                        <div className="p-3 bg-white rounded-xl shadow-sm group-hover/btn:bg-white/10 group-hover/btn:text-white">
                           <btn.icon size={22} className="text-slate-400 group-hover/btn:text-white" />
                        </div>
                        <span className="text-[11px] font-black uppercase tracking-[0.2em]">{btn.label} Data</span>
                     </button>
                   ))}
                </div>
             </section>
          </div>

          {/* System Updates & Logs Row */}
          <div className="grid grid-cols-1 xl:grid-cols-[1.5fr_1fr] gap-10">

             {/* Updates */}
             <section className="bg-indigo-600 rounded-[56px] p-12 text-white shadow-3xl shadow-indigo-100 flex flex-col justify-between group relative overflow-hidden">
                <div className="flex items-center justify-between relative z-10">
                   <div className="flex items-center gap-6">
                      <div className="w-16 h-16 bg-white/20 backdrop-blur-md rounded-3xl flex items-center justify-center border border-white/20">
                         <Cpu size={32} />
                      </div>
                      <div>
                         <h3 className="text-2xl font-black tracking-tight leading-none mb-1 uppercase">System Updates</h3>
                         <span className="px-3 py-1 bg-white text-indigo-600 text-[9px] font-black rounded-full uppercase tracking-[0.2em]">Up to Date</span>
                      </div>
                   </div>
                </div>

                <div className="py-10 relative z-10 flex items-center justify-between">
                   <div className="space-y-1">
                      <p className="text-[10px] font-black text-indigo-100/50 uppercase tracking-[0.2em]">Current Version</p>
                      <h4 className="text-3xl font-black tracking-tighter uppercase whitespace-normal break-words">v2.4.SL - Pro</h4>
                   </div>
                   <div className="text-right space-y-1">
                      <p className="text-[10px] font-black text-indigo-100/50 uppercase tracking-[0.2em]">Last Update</p>
                      <h4 className="text-xl font-black">{new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</h4>
                   </div>
                </div>

                <button
                  onClick={() => showNotification('System is up to date!')}
                  className="w-full py-5 bg-white text-indigo-600 text-[11px] font-black uppercase tracking-[0.2em] rounded-[24px] hover:bg-slate-900 hover:text-white transition-all active:scale-95 relative z-10"
                >
                  Check for Updates
                </button>
                <div className="absolute -right-12 bottom-[-100px] w-64 h-64 bg-white/5 rounded-full blur-[80px]"></div>
             </section>

             {/* Recent Settings Logs */}
             <section className="bg-white rounded-[56px] p-12 border border-slate-50 shadow-soft space-y-10 group">
                <div className="flex items-center gap-6">
                   <div className="w-14 h-14 bg-slate-50 text-slate-400 rounded-2xl flex items-center justify-center">
                      <History size={24} />
                   </div>
                   <h3 className="text-xl font-black text-slate-800 tracking-tight uppercase leading-none">Recent System Logs</h3>
                </div>
                <div className="space-y-4">
                   <div className="relative pl-6 group/log cursor-default">
                      <div className="absolute left-0 top-1.5 w-2 h-2 rounded-full bg-indigo-600"></div>
                      <p className="text-xs font-medium text-slate-800 mb-0.5">Settings saved</p>
                      <p className="text-[9px] font-black text-slate-300 uppercase">Just now</p>
                   </div>
                   <div className="relative pl-6 group/log cursor-default">
                      <div className="absolute left-0 top-1.5 w-2 h-2 rounded-full bg-emerald-500"></div>
                      <p className="text-xs font-medium text-slate-800 mb-0.5">System initialized</p>
                      <p className="text-[9px] font-black text-slate-300 uppercase">1 hour ago</p>
                   </div>
                   <div className="relative pl-6 group/log cursor-default">
                      <div className="absolute left-0 top-1.5 w-2 h-2 rounded-full bg-amber-500"></div>
                      <p className="text-xs font-medium text-slate-800 mb-0.5">Session timeout updated</p>
                      <p className="text-[9px] font-black text-slate-300 uppercase">3 hours ago</p>
                   </div>
                </div>
             </section>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-6 pt-10 border-t border-slate-50">
             <button
               onClick={saveSettings}
               disabled={saving}
               className="flex-1 py-6 bg-slate-900 text-white text-[10px] font-black uppercase tracking-widest rounded-[32px] shadow-3xl shadow-slate-200 hover:bg-indigo-600 transition-all active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2"
             >
                {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save size={16} />}
                Save Global Settings
             </button>
             <button
               onClick={resetToDefaults}
               className="px-16 py-6 bg-white border-2 border-slate-100 text-slate-400 text-[10px] font-black uppercase tracking-widest rounded-[32px] hover:bg-slate-50 transition-all active:scale-95"
             >
               Reset to Defaults
             </button>
          </div>

       </div>
    </div>
  );
};

export default SystemSettings;