import React, { useState } from 'react';
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
  DoorOpen,
  UserX,
  FileSignature,
  History
} from 'lucide-react';
import { 
  AreaChart, 
  Area, 
  ResponsiveContainer, 
  Tooltip as RechartsTooltip,
  XAxis,
  PieChart as RePieChart,
  Pie,
  Cell
} from 'recharts';
import { useNavigate } from 'react-router-dom';

const ResignationHub = () => {
  const navigate = useNavigate();
  const [notification, setNotification] = useState(null);
  const [activeTab, setActiveTab] = useState('Active');
  const [showConfigDrawer, setShowConfigDrawer] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const showNotification = (msg) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3000);
  };

  const resignationActions = [
    { title: 'Submit Resignation', date: 'Immediate', category: 'Employee Action', status: 'Priority', size: 'Draft', path: '/resignation/submit', icon: FileSignature, color: 'text-rose-600', bg: 'bg-rose-50' },
    { title: 'Request Tracking', date: 'Wk 42', category: 'Management', status: 'Required', size: '4 Items', path: '/resignation/requests', icon: Activity, color: 'text-primary-600', bg: 'bg-primary-50' },
    { title: 'Exit Process Audit', date: 'Oct 2023', category: 'Offboarding', status: 'Live', size: 'Diagnostic', path: '/resignation/exit', icon: DoorOpen, color: 'text-emerald-600', bg: 'bg-emerald-50' },
    { title: 'Historical Turnover', date: 'FY 2023', category: 'Archive', status: 'Locked', size: '1.4 MB', path: '/resignation/history', icon: History, color: 'text-slate-600', bg: 'bg-slate-50' },
  ];

  const pieData = [
    { name: 'Better Opportunity', value: 45 },
    { name: 'Relocation', value: 20 },
    { name: 'Personal Reason', value: 15 },
    { name: 'Compensation', value: 20 }
  ];

  const COLORS = ['#ef4444', '#f59e0b', '#3b82f6', '#10b981'];

  return (
    <div className="flex flex-col min-h-[calc(100vh-120px)] w-full gap-10 animate-in fade-in slide-in-from-bottom-4 duration-700 relative pt-4 text-left pb-20">
      
      {/* Configuration Drawer */}
      {showConfigDrawer && (
        <div className="fixed inset-0 z-200 flex justify-end">
           <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm animate-in fade-in" onClick={() => setShowConfigDrawer(false)}></div>
           <div className="w-full max-w-lg bg-white h-full relative z-210 shadow-2xl animate-in slide-in-from-right-full duration-500 flex flex-col">
              <div className="p-10 border-b border-slate-50 flex items-center justify-between">
                 <div>
                    <h3 className="text-2xl font-black text-slate-800 tracking-tight">Offboarding Protocol</h3>
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">Configure exit lifecycle logic</p>
                 </div>
                 <button onClick={() => setShowConfigDrawer(false)} className="p-3 bg-slate-50 text-slate-400 hover:text-slate-800 rounded-2xl transition-all"><X size={20} /></button>
              </div>
              <div className="flex-1 overflow-y-auto p-10 space-y-10 custom-scrollbar no-scrollbar">
                 <section className="space-y-6">
                    <h4 className="text-xs font-black text-slate-800 uppercase tracking-widest flex items-center gap-2">
                       <DoorOpen size={14} className="text-rose-500" />
                       Exit Checklist
                    </h4>
                    <div className="space-y-4">
                       {['IT Asset Recovery', 'Financial Full & Final', 'Database Access Revoke', 'Exit Interview Schedule'].map(opt => (
                          <label key={opt} className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl cursor-pointer hover:bg-slate-100 transition-all">
                             <span className="text-[11px] font-black text-slate-600 uppercase tracking-widest">{opt}</span>
                             <input type="checkbox" className="w-5 h-5 rounded-lg border-slate-200 text-rose-600 focus:ring-rose-500" defaultChecked />
                          </label>
                       ))}
                    </div>
                 </section>
              </div>
              <div className="p-10 border-t border-slate-50 bg-slate-50/20">
                 <button 
                  onClick={() => { setShowConfigDrawer(false); showNotification("Updating offboarding protocols..."); }}
                  className="w-full py-4 bg-slate-900 text-white font-black rounded-2xl hover:bg-slate-800 transition-all shadow-2xl shadow-slate-200 uppercase tracking-[0.2em] text-[11px]"
                 >
                    Apply Exit Strategy
                 </button>
              </div>
           </div>
        </div>
      )}

      {/* Global Notification */}
      {notification && (
        <div className="fixed top-24 right-8 z-100 animate-in slide-in-from-right-8 fade-in flex items-center gap-3 bg-slate-900 text-white px-6 py-4 rounded-2xl shadow-2xl border border-white/10">
          <BellRing size={20} className="text-primary-400" />
          <span className="text-sm font-bold tracking-tight uppercase tracking-widest">{notification}</span>
        </div>
      )}

      {/* Header System */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 shrink-0">
        <div>
          <h1 className="text-4xl font-black text-slate-800 tracking-tight leading-none mb-2">Exit Lifecycle Hub</h1>
          <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest leading-none">Corporate Resignation Management & Offboarding Diagnostic</p>
        </div>
        <div className="flex items-center gap-3 self-start lg:self-center">
           <button 
             onClick={() => showNotification("Initiating clearance workflow...")}
             className="px-8 py-3 bg-white border border-slate-100 text-slate-400 font-black text-[10px] uppercase rounded-2xl hover:bg-slate-50 transition-all shadow-sm active:scale-95"
           >
              Manage Clearance
           </button>
           <button 
             onClick={() => setShowConfigDrawer(true)}
             className="px-10 py-3 bg-slate-900 text-white font-black rounded-2xl hover:bg-slate-800 transition-all shadow-xl shadow-slate-200 uppercase tracking-widest text-[10px]"
           >
              Configure Exit
           </button>
        </div>
      </div>

      {/* Main Workspace Grid */}
      <div className="flex-1 grid grid-cols-1 xl:grid-cols-12 gap-10 text-left">
         
         {/* 1. SIDEBAR: Live Turnover Metrics */}
         <div className="xl:col-span-3 flex flex-col gap-10 text-left">
            
            <div className="card-soft bg-white p-8 border-slate-100 shadow-soft">
               <div className="flex items-center justify-between mb-8">
                  <h3 className="text-[11px] font-black text-slate-800 uppercase tracking-[0.2em]">Turnover Drivers</h3>
                  <TrendingUp size={20} className="text-rose-500" />
               </div>
               <div className="h-40 w-full flex items-center justify-center">
                  <ResponsiveContainer width="100%" height="100%">
                    <RePieChart>
                       <Pie
                          data={pieData}
                          cx="50%"
                          cy="50%"
                          innerRadius={40}
                          outerRadius={60}
                          paddingAngle={8}
                          dataKey="value"
                       >
                          {pieData.map((entry, index) => (
                             <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} stroke="none" />
                          ))}
                       </Pie>
                    </RePieChart>
                  </ResponsiveContainer>
               </div>
               <div className="mt-6 flex items-end justify-between">
                  <div>
                     <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Monthly Churn</p>
                     <p className="text-2xl font-black text-slate-800 tracking-tighter">1.4%</p>
                  </div>
                  <span className="px-3 py-1 bg-emerald-50 text-emerald-600 text-[10px] font-black rounded-lg">-0.5%</span>
               </div>
            </div>

            <div className="space-y-4">
               {[
                 { label: 'Active Requests', value: '4', icon: FileSignature, color: 'text-rose-500' },
                 { label: 'Clearance Index', value: '78%', icon: Activity, color: 'text-primary-500' },
               ].map((stat, i) => (
                 <div key={i} className="card-soft bg-white p-6 flex items-center gap-4 hover:border-primary-100 transition-all cursor-crosshair">
                    <div className={`p-3 bg-slate-50 rounded-2xl ${stat.color} shadow-inner`}><stat.icon size={20} /></div>
                    <div>
                       <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">{stat.label}</p>
                       <p className="text-lg font-black text-slate-800 tracking-tighter leading-none">{stat.value}</p>
                    </div>
                 </div>
               ))}
            </div>

            <div className="card-soft bg-slate-900 p-8 border-none text-white relative overflow-hidden group mt-auto">
               <div className="relative z-10">
                  <UserX className="mb-4 text-rose-400" size={24} />
                  <h4 className="text-sm font-black uppercase tracking-widest leading-tight mb-2">Offboarding Priority</h4>
                  <p className="text-[10px] opacity-60 font-medium leading-relaxed uppercase tracking-widest mb-6">3 critical engineering nodes have filed for exit. Initiate retention protocol immediately.</p>
                  <button className="w-full py-3 bg-white/10 hover:bg-white/20 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all">Retention Hub</button>
               </div>
               <div className="absolute -right-4 -bottom-4 w-32 h-32 bg-rose-600/20 rounded-full blur-3xl group-hover:scale-150 transition-transform"></div>
            </div>
         </div>

         {/* 2. MAIN HUB: Resignation Workspaces */}
         <div className="xl:col-span-9 flex flex-col min-h-0 bg-white border border-slate-100 rounded-[44px] shadow-soft overflow-hidden">
            
            {/* Command Toolbar */}
            <div className="px-10 py-8 border-b border-slate-50 flex flex-col lg:flex-row lg:items-center justify-between gap-6 bg-slate-50/20">
               <div className="flex items-center gap-8">
                  {['Active', 'Review', 'Clearance', 'History'].map(tab => (
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
                    placeholder="Search resignations, status, or dates..." 
                    className="w-full bg-white border border-slate-100 focus:border-primary-100 outline-none rounded-2xl pl-12 pr-4 py-3 text-xs font-black text-slate-600 transition-all shadow-sm uppercase tracking-tight"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
               </div>
            </div>

            {/* Diagnostic Table/Cards */}
            <div className="flex-1 overflow-y-auto no-scrollbar">
               <table className="w-full text-left">
                  <thead className="sticky top-0 z-20 bg-slate-50/80 backdrop-blur-md border-b border-slate-100">
                     <tr>
                        <th className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Exit Workspace</th>
                        <th className="px-6 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Log Node</th>
                        <th className="px-6 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Compliance</th>
                        <th className="px-6 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Actions</th>
                     </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50 relative z-10">
                     {resignationActions.map((act, idx) => (
                        <tr key={idx} onClick={() => navigate(act.path)} className="group hover:bg-slate-50/50 transition-all cursor-pointer">
                           <td className="px-10 py-8">
                              <div className="flex items-center gap-5">
                                 <div className={`p-4 rounded-2xl ${act.bg} ${act.color} border border-slate-100 shadow-sm group-hover:scale-110 transition-all`}>
                                    <act.icon size={24} />
                                 </div>
                                 <div>
                                    <p className="text-sm font-black text-slate-800 tracking-tight leading-none group-hover:text-primary-600 transition-colors uppercase mb-1">{act.title}</p>
                                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{act.size} • Verified Lifecycle</p>
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
                                 act.status === 'Priority' ? 'bg-rose-50 text-rose-600 border-rose-100' : 
                                 act.status === 'Required' ? 'bg-indigo-50 text-indigo-600 border-indigo-100' : 'bg-slate-900/5 text-slate-600 border-slate-100'
                              }`}>{act.status}</span>
                           </td>
                           <td className="px-10 py-8 text-right">
                              <div className="flex items-center justify-end gap-3">
                                 <button onClick={(e) => { e.stopPropagation(); showNotification(`Exporting exit dossier: ${act.title}...`); }} className="p-3 bg-white border border-slate-100 text-slate-400 hover:text-slate-800 rounded-2xl shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all">
                                    <Download size={20} />
                                 </button>
                                 <button className="p-3 bg-white border border-slate-100 text-slate-400 hover:text-primary-600 rounded-2xl shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all">
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
                  <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Exit Node: EXT-MUM-SRV-07 Active</p>
               </div>
               <div className="flex items-center gap-6">
                  <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Active Exits: 4</p>
                  <button className="px-6 py-2.5 bg-white/10 hover:bg-white/20 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all">Sync Clearance</button>
               </div>
            </div>

         </div>

      </div>

    </div>
  );
};

export default ResignationHub;
