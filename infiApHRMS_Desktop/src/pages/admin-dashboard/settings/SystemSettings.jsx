import React, { useState } from 'react';
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
  Cpu
} from 'lucide-react';

const SystemSettings = () => {
  const [toggles, setToggles] = useState({
    emailNotif: true,
    mobilePush: true,
    hrAlerts: false,
    twoFactor: true,
    loginMonitor: true,
    darkMode: false,
    systemLogs: true,
    maintenanceMode: false
  });

  const [notification, setNotification] = useState(null);
  const [config, setConfig] = useState({
    timezone: 'UTC +05:30 (Chennai, Kolkata, Mumbai)',
    dateFormat: 'DD/MM/YYYY',
    currency: 'INR (₹)',
    language: 'English (US)',
    sessionTimeout: '15 Minutes'
  });

  const showNotification = (msg) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3000);
  };

  const handleConfigChange = (key, value) => {
    setConfig(prev => ({ ...prev, [key]: value }));
  };

  const handleToggle = (key) => {
    setToggles(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const Toggle = ({ active, onClick }) => (
    <button 
      onClick={onClick}
      className={`relative w-14 h-8 rounded-full transition-all duration-500 ease-in-out p-1 ${active ? 'bg-indigo-600' : 'bg-slate-200 shadow-inner'}`}
    >
       <div className={`w-6 h-6 bg-white rounded-full shadow-lg transform transition-transform duration-500 ${active ? 'translate-x-6' : 'translate-x-0'}`}></div>
    </button>
  );

  return (
    <div className="max-w-4xl mx-auto space-y-12 animate-in fade-in slide-in-from-bottom-8 duration-1000 pb-32 relative">
       
       {/* Global Notification Toast */}
       {notification && (
         <div className="fixed top-24 right-8 z-[100] animate-in slide-in-from-right-8 fade-in flex items-center gap-3 bg-slate-900 text-white px-8 py-5 rounded-2xl shadow-3xl border border-white/10">
           <div className="w-2 h-2 bg-indigo-500 rounded-full animate-pulse"></div>
           <span className="text-[10px] font-black uppercase tracking-[0.2em]">{notification}</span>
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
                   className="bg-white border border-slate-100 rounded-2xl pl-12 pr-6 py-3.5 text-sm font-bold focus:ring-4 focus:ring-indigo-500/5 outline-none transition-all w-[240px] shadow-soft"
                />
             </div>
             <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center border border-indigo-100/50 shadow-soft cursor-pointer hover:bg-white transition-all shadow-lg active:scale-95" onClick={() => showNotification('System Diagnostic: Accessing Interface Metadata...')}>
                <Settings size={22} className="animate-spin-slow" />
             </div>
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
                      <option>UTC +05:30 (Chennai, Kolkata, Mumbai)</option>
                      <option>UTC +00:00 (GMT London)</option>
                   </select>
                </div>
                <div className="space-y-4">
                   <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Date Format</label>
                   <select 
                     value={config.dateFormat}
                     onChange={(e) => handleConfigChange('dateFormat', e.target.value)}
                     className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-8 py-5 text-sm font-bold focus:ring-4 focus:ring-indigo-500/5 outline-none transition-all appearance-none cursor-pointer"
                   >
                      <option>DD/MM/YYYY</option>
                      <option>MM/DD/YYYY</option>
                   </select>
                </div>
                <div className="space-y-4">
                   <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Currency</label>
                   <select 
                     value={config.currency}
                     onChange={(e) => handleConfigChange('currency', e.target.value)}
                     className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-8 py-5 text-sm font-bold focus:ring-4 focus:ring-indigo-500/5 outline-none transition-all appearance-none cursor-pointer"
                   >
                      <option>INR (₹)</option>
                      <option>USD ($)</option>
                   </select>
                </div>
                <div className="space-y-4">
                   <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Language</label>
                   <select 
                     value={config.language}
                     onChange={(e) => handleConfigChange('language', e.target.value)}
                     className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-8 py-5 text-sm font-bold focus:ring-4 focus:ring-indigo-500/5 outline-none transition-all appearance-none cursor-pointer"
                   >
                      <option>English (US)</option>
                      <option>Hindi (HI)</option>
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
                        <Toggle active={toggles[item.key]} onClick={() => handleToggle(item.key)} />
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
                      <Toggle active={toggles.twoFactor} onClick={() => handleToggle('twoFactor')} />
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
                         <option>15 Minutes</option>
                         <option>30 Minutes</option>
                      </select>
                   </div>
                   <div className="flex items-center justify-between">
                      <div>
                         <p className="text-sm font-black text-slate-800 leading-none mb-1">Login Monitoring</p>
                         <p className="text-[10px] font-bold text-slate-300 uppercase tracking-[0.2em]">Track IP geolocation</p>
                      </div>
                      <Toggle active={toggles.loginMonitor} onClick={() => handleToggle('loginMonitor')} />
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
                  onClick={() => showNotification('Access Matrix: Opening Global Permission Management Hub...')}
                  className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.2em] hover:underline"
                >
                  Edit Global Access
                </button>
             </div>

             <div className="space-y-6 relative z-10">
                {[
                  { label: 'Role Permissions', icon: Users, detail: 'Manage administrative roles' },
                  { label: 'Department Access', icon: Monitor, detail: 'Define data visibility borders' },
                  { label: 'Document Access Control', icon: Archive, detail: 'End-to-end audit tracking' }
                ].map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between p-8 bg-white/5 rounded-[32px] border border-white/5 hover:bg-white transition-all hover:text-slate-900 group/link cursor-pointer" onClick={() => showNotification(`Access Control: Opening ${item.label} Module...`)}>
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
                      <p className="text-sm font-black text-slate-800">Dark Mode</p>
                      <Toggle active={toggles.darkMode} onClick={() => handleToggle('darkMode')} />
                   </div>
                   <div className="flex items-center justify-between">
                      <p className="text-sm font-black text-slate-800">System Logs</p>
                      <Toggle active={toggles.systemLogs} onClick={() => handleToggle('systemLogs')} />
                   </div>
                   <div className="flex items-center justify-between">
                      <p className="text-sm font-black text-slate-800">Maintenance Mode</p>
                      <Toggle active={toggles.maintenanceMode} onClick={() => handleToggle('maintenanceMode')} />
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
                     { label: 'Backup', icon: Archive },
                     { label: 'Restore', icon: RefreshCw },
                     { label: 'Export', icon: Download },
                     { label: 'Import', icon: Upload }
                   ].map((btn) => (
                     <button 
                       key={btn.label} 
                       onClick={() => showNotification(`Institutional Audit: Initializing ${btn.label} Node Protocol...`)}
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
                      <h4 className="text-xl font-black">Oct 24, 2023</h4>
                   </div>
                </div>

                <button 
                  onClick={() => showNotification('Cluster Intelligence: Searching for Institutional v2.5.SL Payload... System Up-to-Date.')}
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
                <div className="space-y-10 relative before:absolute before:left-2 before:top-2 before:bottom-2 before:w-[2px] before:bg-slate-50">
                   {[
                     { desc: 'Admin changed global time zone', time: '1 minute ago', dot: 'bg-indigo-600' },
                     { desc: 'Automated backup completed', time: '1 hour ago', dot: 'bg-emerald-500' },
                     { desc: 'Login attempt from unknown IP', time: '3 hours ago', dot: 'bg-amber-500' }
                   ].map((log, idx) => (
                     <div key={idx} className="relative pl-10 group/log cursor-default">
                        <div className={`absolute left-0 top-1.5 w-4 h-4 rounded-full border-4 border-white shadow-sm ${log.dot} transition-transform group-hover/log:scale-125`}></div>
                        <p className="text-sm font-black text-slate-800 mb-1 group-hover/log:text-indigo-600 transition-colors uppercase leading-tight">{log.desc}</p>
                        <p className="text-[10px] font-black text-slate-300 uppercase tracking-[0.2em] leading-none">{log.time}</p>
                     </div>
                   ))}
                </div>
             </section>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-6 pt-10 border-t border-slate-50">
             <button 
               onClick={() => showNotification('Success: Institutional Global Settings Synchronized with Master Core.')}
               className="flex-1 py-6 bg-slate-900 text-white text-[10px] font-black uppercase tracking-widest rounded-[32px] shadow-3xl shadow-slate-200 hover:bg-indigo-600 transition-all active:scale-95"
             >
               Save Global Settings
             </button>
             <button 
               onClick={() => {
                 if(window.confirm('Institutional Alert: Are you sure you want to revert all configurations to factory defaults?')) {
                   showNotification('Resetting: Platform configurations restored to factory baselines.');
                 }
               }}
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
