import React, { useState, useEffect } from 'react';
import { 
  FileText, 
  Download, 
  Calendar, 
  PieChart, 
  AlertCircle, 
  Clock, 
  ChevronRight, 
  Search,
  BellRing,
  CheckCircle2,
  Filter,
  ArrowRight,
  ClipboardList,
  Activity,
  TrendingUp,
  X,
  PlusCircle,
  Settings,
  Share2,
  Layout,
  XCircle,
  History,
  ShieldCheck,
  UserCheck
} from 'lucide-react';
import { 
  AreaChart, 
  Area, 
  ResponsiveContainer, 
  Tooltip as RechartsTooltip,
  XAxis
} from 'recharts';
import { useNavigate } from 'react-router-dom';
import { getLeaveStats, getPendingDetailedLeaves, getTodayLeaves } from '../../../services/hrApi';

const LeaveManagement = () => {
  const navigate = useNavigate();
  const [notification, setNotification] = useState(null);
  const [activeTab, setActiveTab] = useState('Active');
  const [showConfigDrawer, setShowConfigDrawer] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [complianceRules, setComplianceRules] = useState([
    { id: 1, label: 'Auto-approve medical < 2 days', active: true },
    { id: 2, label: 'Restrict engineering > 5% total', active: false },
    { id: 3, label: 'Flag repetitive Fri/Mon patterns', active: true },
  ]);

  const showNotification = (msg) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3000);
  };

  const toggleRule = (id) => {
    setComplianceRules(prev => prev.map(r => r.id === id ? { ...r, active: !r.active } : r));
    showNotification("Global policy node updated.");
  };

  const getTabData = () => {
    const data = {
      'Pending': [
        { title: 'Sarah Chen - Sick Leave', date: 'Oct 12', category: 'Urgent', status: 'Priority', size: '3 Days', path: '/leave/approval', icon: Clock, color: 'text-orange-600', bg: 'bg-orange-50' },
        { title: 'Marcus Thompson - Annual', date: 'Oct 20', category: 'Vacation', status: 'Required', size: '6 Days', path: '/leave/approval', icon: Calendar, color: 'text-emerald-600', bg: 'bg-emerald-50' },
      ],
      'Archive': [
        { title: 'Arjun Mehta - Annual', date: 'Nov 12', category: 'History', status: 'Locked', size: 'Approved', path: '/leave/history', icon: History, color: 'text-slate-600', bg: 'bg-slate-50' },
        { title: 'Priya Sharma - Sick', date: 'Oct 28', category: 'History', status: 'Locked', size: 'Approved', path: '/leave/history', icon: History, color: 'text-slate-600', bg: 'bg-slate-50' },
      ],
      'Analytics': [
        { title: 'Q3 Departmental Audit', date: 'Quarterly', category: 'Analytics', status: 'Generated', size: '15 Page PDF', path: '/leave/history', icon: PieChart, color: 'text-primary-600', bg: 'bg-primary-50' },
        { title: 'Absence Trend Report', date: 'Monthly', category: 'Analytics', status: 'Ready', size: 'Excel Data', path: '/leave/history', icon: Activity, color: 'text-primary-600', bg: 'bg-primary-50' },
      ],
      'Active': [
        { title: 'Leave Request Audit', date: 'Oct 24', category: 'Requests', status: 'Priority', size: '18 Pending', path: '/leave/requests', icon: ClipboardList, color: 'text-primary-600', bg: 'bg-primary-50' },
        { title: 'Leadership Approvals', date: 'Wk 42', category: 'Approvals', status: 'Required', size: '12 Items', path: '/leave/approval', icon: CheckCircle2, color: 'text-emerald-600', bg: 'bg-emerald-50' },
        { title: 'Compliance Engine', date: 'FY 2024', category: 'Legal', status: 'Updated', size: 'v4.2 Active', path: '/leave/requests', icon: ShieldCheck, color: 'text-orange-600', bg: 'bg-orange-50' },
      ]
    };
    return data[activeTab] || data['Active'];
  };

  const trendData = [
    { name: 'Mon', value: 4 }, { name: 'Tue', value: 7 }, { name: 'Wed', value: 5 },
    { name: 'Thu', value: 8 }, { name: 'Fri', value: 12 }, { name: 'Sat', value: 2 }, { name: 'Sun', value: 1 }
  ];

  const [statCards, setStatCards] = useState([
    { label: 'Pending', value: '—', color: 'text-orange-500', icon: Clock, filter: 'Pending' },
    { label: 'Approved', value: '—', color: 'text-emerald-500', icon: CheckCircle2, filter: 'Approved' },
    { label: 'Rejected', value: '—', color: 'text-rose-500', icon: XCircle, filter: 'Rejected' },
    { label: 'On Leave Today', value: '—', color: 'text-primary-500', icon: UserCheck, filter: 'All Requests' },
  ]);

  // Fetch leave stats from API
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await getLeaveStats();
        const data = res.data?.data;
        if (data) {
          setStatCards([
            { label: 'Pending', value: String(data.pending || 0), color: 'text-orange-500', icon: Clock, filter: 'Pending' },
            { label: 'Approved', value: String(data.approved || 0), color: 'text-emerald-500', icon: CheckCircle2, filter: 'Approved' },
            { label: 'Rejected', value: String(data.rejected || 0), color: 'text-rose-500', icon: XCircle, filter: 'Rejected' },
            { label: 'On Leave Today', value: String(data.onLeaveToday || 0), color: 'text-primary-500', icon: UserCheck, filter: 'All Requests' },
          ]);
        }
      } catch (err) {
        console.error('Failed to fetch leave stats:', err);
      }
    };
    fetchStats();
  }, []);

  const currentActions = getTabData();

  return (
    <div className="flex flex-col h-[calc(100vh-120px)] w-full gap-8 animate-in fade-in slide-in-from-bottom-4 duration-700 relative pt-4 overflow-hidden">
      
      {/* Configuration Drawer */}
      {showConfigDrawer && (
        <div className="fixed inset-0 z-200 flex justify-end">
           <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm animate-in fade-in" onClick={() => setShowConfigDrawer(false)}></div>
           <div className="w-full max-w-lg bg-white h-full relative z-210 shadow-2xl animate-in slide-in-from-right-full duration-500 flex flex-col">
              <div className="p-10 border-b border-slate-50 flex items-center justify-between">
                 <div>
                    <h3 className="text-2xl font-black text-slate-800 tracking-tight">Leave Policy Engine</h3>
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">Global logic & threshold management</p>
                 </div>
                 <button onClick={() => setShowConfigDrawer(false)} className="p-3 bg-slate-50 text-slate-400 hover:text-slate-800 rounded-2xl transition-all"><X size={20} /></button>
              </div>
              <div className="flex-1 overflow-y-auto p-10 space-y-10 custom-scrollbar no-scrollbar text-left">
                 <section className="space-y-6">
                    <h4 className="text-xs font-black text-slate-800 uppercase tracking-widest flex items-center gap-2">
                       <Layout size={14} className="text-primary-500" />
                       Allocation Quota
                    </h4>
                    <div className="grid grid-cols-2 gap-4">
                       {['Sick Leave', 'Casual Leave', 'Annual Leave', 'Maternity'].map(t => (
                          <div key={t} className="p-5 border border-slate-100 rounded-[24px] text-left hover:border-primary-500 hover:bg-primary-50 transition-all group">
                             <p className="text-xs font-black text-slate-800 uppercase tracking-tight group-hover:text-primary-600">{t}</p>
                             <p className="text-xl font-black text-slate-400 mt-1">24 Days</p>
                          </div>
                       ))}
                    </div>
                 </section>
                 <section className="space-y-6">
                    <h4 className="text-xs font-black text-slate-800 uppercase tracking-widest flex items-center gap-2">
                       <ShieldCheck size={14} className="text-emerald-500" />
                       Compliance Rules
                    </h4>
                    <div className="space-y-4 text-left">
                       {complianceRules.map(rule => (
                          <div key={rule.id} 
                               onClick={() => toggleRule(rule.id)}
                               className="p-4 bg-slate-50 rounded-2xl flex items-center justify-between cursor-pointer hover:bg-slate-100 transition-all active:scale-[0.98]">
                             <span className="text-[10px] font-black text-slate-600 uppercase tracking-widest">{rule.label}</span>
                             <div className={`w-10 h-6 rounded-full flex items-center px-1 transition-all ${rule.active ? 'bg-primary-500' : 'bg-slate-300'}`}>
                                <div className={`w-4 h-4 bg-white rounded-full shadow-sm transition-all ${rule.active ? 'ml-auto' : 'ml-0'}`}></div>
                             </div>
                          </div>
                       ))}
                    </div>
                 </section>
              </div>
              <div className="p-10 border-t border-slate-50 bg-slate-50/20">
                 <button 
                  onClick={() => { setShowConfigDrawer(false); showNotification("Synchronizing global leave quotas..."); }}
                  className="w-full py-4 bg-slate-900 text-white font-black rounded-2xl hover:bg-slate-800 transition-all shadow-2xl shadow-slate-200 uppercase tracking-[0.2em] text-[11px]"
                 >
                    Apply Global Quotas
                 </button>
              </div>
           </div>
        </div>
      )}

      {/* Global Notification */}
      {notification && (
        <div className="fixed top-24 right-8 z-100 animate-in slide-in-from-right-8 fade-in flex items-center gap-3 bg-slate-900 text-white px-6 py-4 rounded-2xl shadow-2xl border border-white/10">
          <BellRing size={20} className="text-primary-400" />
          <span className="text-sm font-bold tracking-tight uppercase">{notification}</span>
        </div>
      )}

      {/* Header System */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 shrink-0">
        <div>
          <h1 className="text-4xl font-black text-slate-800 tracking-tight leading-none mb-2">Absence Intelligence Hub</h1>
          <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mt-1">Employee Leave Lifecycle & Diagnostic Oversight</p>
        </div>
        <div className="flex items-center gap-3 self-start lg:self-center">
           <button 
             onClick={() => navigate('/leave/history')}
             className="px-8 py-3 bg-white border border-slate-100 text-slate-400 font-black text-[10px] uppercase rounded-2xl hover:bg-slate-50 transition-all shadow-sm active:scale-95"
           >
              View History
           </button>
           <button 
             onClick={() => setShowConfigDrawer(true)}
             className="px-10 py-3 bg-slate-900 text-white font-black rounded-2xl hover:bg-slate-800 transition-all shadow-xl shadow-slate-200 uppercase tracking-widest text-[10px]"
           >
              Configure Policies
           </button>
        </div>
      </div>

      {/* Main Workspace Grid */}
      <div className="flex-1 grid grid-cols-1 xl:grid-cols-4 gap-8 overflow-hidden min-h-0">
         
         {/* 1. SIDEBAR: Live Absence Metrics */}
         <div className="xl:col-span-1 flex flex-col gap-6 overflow-y-auto no-scrollbar pb-10">
            
            <div className="card-soft bg-white p-8 border-slate-100 shadow-soft">
               <div className="flex items-center justify-between mb-8">
                  <h3 className="text-xs font-black text-slate-800 uppercase tracking-widest">Absence Trend</h3>
                  <TrendingUp size={20} className="text-orange-500" />
               </div>
               <div className="h-32 w-full min-h-[128px] overflow-hidden">
                  <ResponsiveContainer width="99%" height="100%" minWidth={0}>
                    <AreaChart data={trendData}>
                       <defs>
                          <linearGradient id="colorAbsence" x1="0" y1="0" x2="0" y2="1">
                             <stop offset="5%" stopColor="#f97316" stopOpacity={0.1}/>
                             <stop offset="95%" stopColor="#f97316" stopOpacity={0}/>
                          </linearGradient>
                       </defs>
                       <Area type="monotone" dataKey="value" stroke="#f97316" strokeWidth={3} fillOpacity={1} fill="url(#colorAbsence)" />
                    </AreaChart>
                  </ResponsiveContainer>
               </div>
               <div className="mt-6 flex items-end justify-between">
                   <div>
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Today's Absence</p>
                      <p className="text-3xl font-black text-slate-800 tracking-tighter leading-none">12 Employees</p>
                   </div>
                   <span className="px-3 py-1 bg-rose-50 text-rose-600 text-[10px] font-black rounded-lg">91% Uptime</span>
               </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
               {statCards.map((stat, i) => (
                 <div key={i} 
                      onClick={() => navigate(`/leave/requests?status=${stat.filter}`)}
                      className="card-soft bg-white p-5 flex flex-col gap-3 hover:border-primary-100 transition-all cursor-pointer active:scale-95 group">
                    <div className={`p-2 w-fit bg-slate-50 rounded-xl ${stat.color} shadow-inner group-hover:bg-white group-hover:shadow-soft`}><stat.icon size={16} /></div>
                    <div>
                       <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest leading-none mb-2">{stat.label}</p>
                       <p className="text-2xl font-black text-slate-800 tracking-tighter leading-none">{stat.value}</p>
                    </div>
                 </div>
               ))}
            </div>

            <div className="card-soft bg-slate-900 p-8 border-none text-white relative overflow-hidden group mt-auto">
               <div className="relative z-10">
                  <AlertCircle className="mb-4 text-orange-400" size={24} />
                   <h4 className="text-sm font-black uppercase tracking-widest leading-tight mb-2">Policy Warning</h4>
                   <p className="text-[10px] opacity-60 font-black leading-relaxed uppercase tracking-widest mb-6">4 departments have exceeded the seasonal leave threshold.</p>
                   <button className="w-full py-4 bg-white/10 hover:bg-white/20 rounded-xl text-[10px] font-black uppercase tracking-[0.25em] transition-all">Review Hub</button>
               </div>
               <div className="absolute -right-4 -bottom-4 w-32 h-32 bg-orange-600/20 rounded-full blur-3xl group-hover:scale-150 transition-transform"></div>
            </div>
         </div>

         {/* 2. MAIN HUB: Leave Workspaces */}
         <div className="xl:col-span-3 flex flex-col min-h-0 bg-white border border-slate-100 rounded-[44px] shadow-soft overflow-hidden">
            
            {/* Command Toolbar */}
            <div className="px-10 py-8 border-b border-slate-50 flex flex-col lg:flex-row lg:items-center justify-between gap-6 bg-slate-50/20">
               <div className="flex items-center gap-8">
                  {['Active', 'Pending', 'Archive', 'Analytics'].map(tab => (
                    <button 
                      key={tab} 
                      onClick={() => setActiveTab(tab)}
                      className={`text-[11px] font-black uppercase tracking-[0.2em] transition-all relative py-2 ${activeTab === tab ? 'text-primary-600' : 'text-slate-300 hover:text-slate-800'}`}
                    >
                       {tab}
                       {activeTab === tab && <div className="absolute bottom-0 left-0 right-0 h-1 bg-primary-600 rounded-full animate-in zoom-in-y"></div>}
                    </button>
                  ))}
               </div>
               <div className="relative group max-w-sm w-full lg:w-64">
                  <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" />
                  <input 
                    type="text" 
                    placeholder="Search by name, type, or reason..." 
                    className="w-full bg-white border border-slate-100 focus:border-primary-100 outline-none rounded-2xl pl-12 pr-4 py-3 text-xs font-black text-slate-600 transition-all shadow-sm uppercase tracking-tight"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
               </div>
            </div>

            {/* Diagnostic Table/Cards */}
            <div className="flex-1 overflow-y-auto no-scrollbar">
               <table className="w-full text-left">
                  <thead className="sticky top-0 z-20 bg-white/80 backdrop-blur-md border-b border-slate-100">
                     <tr>
                        <th className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Diagnostic Workspace</th>
                        <th className="px-6 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Log Node</th>
                        <th className="px-6 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Compliance</th>
                        <th className="px-6 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Actions</th>
                     </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50 relative z-10 transition-all">
                     {currentActions.filter(a => a.title.toLowerCase().includes(searchQuery.toLowerCase())).map((act, idx) => (
                        <tr key={`${activeTab}-${idx}`} onClick={() => navigate(act.path)} className="group hover:bg-slate-50/50 transition-all cursor-pointer animate-in fade-in slide-in-from-left-4 duration-300">
                           <td className="px-10 py-8">
                              <div className="flex items-center gap-5">
                                 <div className={`p-4 rounded-2xl ${act.bg} ${act.color} border border-slate-100 shadow-sm group-hover:scale-110 transition-all`}>
                                    {React.createElement(act.icon, { size: 24 })}
                                 </div>
                                 <div className="text-left">
                                    <p className="text-sm font-black text-slate-800 tracking-tight leading-none group-hover:text-primary-600 transition-colors uppercase mb-2">{act.title}</p>
                                    <div className="flex items-center gap-2 text-indigo-400 font-black text-[9px] uppercase tracking-[0.1em]">
                                       {act.category} • {act.size}
                                    </div>
                                 </div>
                              </div>
                           </td>
                           <td className="px-6 py-8">
                              <div className="flex items-center gap-2 text-[11px] font-black text-slate-400 uppercase tracking-widest">
                                 <Calendar size={14} className="text-primary-400" />
                                 {act.date}
                              </div>
                           </td>
                           <td className="px-6 py-8">
                              <span className={`px-4 py-1.5 text-[10px] font-black rounded-xl uppercase tracking-widest border ${
                                 act.status === 'Priority' || act.status === 'Urgent' ? 'bg-orange-50 text-orange-600 border-orange-100' : 
                                 act.status === 'Required' || act.status === 'Locked' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-slate-900/5 text-slate-600 border-slate-100'
                              }`}>{act.status}</span>
                           </td>
                           <td className="px-10 py-8 text-right">
                              <div className="flex items-center justify-end gap-3">
                                 <button onClick={(e) => { e.stopPropagation(); showNotification(`Exporting ${act.title}...`); }} className="p-3 bg-white border border-slate-100 text-slate-400 hover:text-slate-800 rounded-2xl shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all active:scale-95">
                                    <Download size={20} />
                                 </button>
                                 <button className="p-3 bg-white border border-slate-100 text-slate-400 hover:text-primary-600 rounded-2xl shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all active:scale-95">
                                    <ArrowRight size={20} />
                                 </button>
                              </div>
                           </td>
                        </tr>
                     ))}
                  </tbody>
               </table>
            </div>

            {/* Persistence Footer */}
            <div className="px-10 py-6 bg-slate-900 border-t border-white/5 flex items-center justify-between text-white shrink-0">
               <div className="flex items-center gap-4">
                  <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                  <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Policy Node: IN-MUM-SRV-04 Active</p>
               </div>
               <div className="flex items-center gap-6">
                  <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Total Active Requests: 18</p>
                  <button className="px-6 py-2.5 bg-white/10 hover:bg-white/20 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all">Sync Policies</button>
               </div>
            </div>

         </div>

      </div>

    </div>
  );
};

export default LeaveManagement;
