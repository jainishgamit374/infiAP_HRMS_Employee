import React, { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAdminDashboard } from '../../context/AdminDashboardContext';
import {
   Building2,
   Users,
   Briefcase,
   UserPlus,
   PlusCircle,
   Send,
   ChevronRight,
   AlertCircle,
   Wallet,
   BellRing,
   Check,
   Sparkles,
   LayoutDashboard,
   CreditCard,
   PieChart,
   BarChart3,
   ShieldCheck,
   FileText,
   Activity,
   ArrowRight,
   History,
   Terminal,
   RefreshCw,
   Box,
   Layers
} from 'lucide-react';

const AdminDashboard = () => {
   const navigate = useNavigate();
   const { summary, totals, staffDirectory } = useAdminDashboard();

   const stats = useMemo(() => [
      {
         label: 'Departments',
         value: String(summary.departments ?? totals.deptCount),
         color: '#818CF8'
      },
      {
         label: 'Hiring Roles',
         value: String(summary.openJobs ?? totals.activeCount).padStart(2, '0'),
         color: '#34D399'
      },
      {
         label: 'Active Staff',
         value: String(summary.activeStaff ?? staffDirectory.length),
         color: '#FBBF24'
      },
   ], [summary.departments, summary.openJobs, summary.activeStaff, totals.deptCount, totals.activeCount, staffDirectory.length]);

   const coreModules = [
      {
         name: 'Recruitment',
         desc: 'Postings & Interviews',
         icon: Briefcase,
         path: '/admin/recruitment-control/hub',
         color: 'bg-indigo-600',
         tag: '15 New Apps'
      },
      {
         name: 'Payroll',
         desc: 'Structures & Audits',
         icon: CreditCard,
         path: '/admin/payroll-management',
         color: 'bg-slate-900',
         tag: 'Cycle: Active'
      },
      {
         name: 'Policies',
         desc: 'Protocols & Compliance',
         icon: FileText,
         path: '/admin/policies',
         color: 'bg-emerald-600',
         tag: '12 Mandatory'
      },
      {
         name: 'Security',
         desc: 'Encrypted Vaults',
         icon: ShieldCheck,
         path: '/admin/security',
         color: 'bg-amber-600',
         tag: '45 Secured'
      },
   ];

   return (
      <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in duration-700 pb-40">

         {/* Premium Compact Header */}
         <div className="flex items-center justify-between border-b border-slate-50 pb-8">
            <div>
               <h1 className="text-4xl font-black text-slate-800 tracking-tight leading-none mb-2">Institutional Headquarters</h1>
               <p className="text-[10px] text-slate-400 font-black uppercase tracking-[0.2em] mt-1 leading-none">Master Node Control & Institutional Auditing</p>
            </div>
            <div className="flex items-center gap-4">
               <div className="flex items-center gap-2 px-4 py-2 bg-indigo-50 border border-indigo-100 rounded-xl">
                  <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-pulse"></div>
                  <span className="text-[10px] font-black text-indigo-600 uppercase tracking-widest">Instance Stable</span>
               </div>
               <button 
                 onClick={() => alert('Institutional Intelligence: Accessing Restricted System Settings...')}
                 className="p-2.5 bg-slate-50 text-slate-400 rounded-xl hover:bg-slate-900 hover:text-white transition-all border border-slate-100"
               >
                  <Settings size={18} />
               </button>
            </div>
         </div>

         {/* Hero Insight Section */}
         <div className="bg-slate-900 p-10 rounded-3xl text-white shadow-xl relative overflow-hidden group">
            <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-10">
               <div className="max-w-xl">
                  <div className="flex items-center gap-3 mb-4">
                     <Sparkles size={16} className="text-indigo-400" />
                     <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Institutional Dashboard</span>
                  </div>
                  <h2 className="text-[11px] font-black tracking-[0.2em] mb-2 uppercase text-slate-400">Core status: Optimal Environment</h2>
                  <p className="text-[10px] text-slate-500 font-black leading-relaxed max-w-sm uppercase tracking-widest">100% of infrastructure services are operational and secured across all managed business units.</p>
               </div>
               <div className="grid grid-cols-3 gap-8 bg-white/5 backdrop-blur-md p-6 rounded-2xl border border-white/5">
                  {stats.map((stat, i) => (
                     <div key={i} className="text-center pr-8 border-r last:border-0 border-white/10 last:pr-0">
                        <p className="text-xl font-black tabular-nums tracking-tight mb-0.5" style={{ color: stat.color }}>{stat.value}</p>
                        <p className="text-[8px] font-black text-slate-500 uppercase tracking-widest leading-none">{stat.label}</p>
                     </div>
                  ))}
               </div>
            </div>
            <div className="absolute top-0 right-0 w-48 h-48 bg-indigo-600/10 rounded-full blur-[80px]"></div>
         </div>

         {/* Module Launch Hub */}
         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {coreModules.map((module, i) => (
               <div
                  key={i}
                  onClick={() => navigate(module.path)}
                  className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm transition-all hover:border-indigo-600 hover:shadow-xl hover:shadow-indigo-50 cursor-pointer group flex flex-col items-start"
               >
                  <div className={`w-12 h-12 ${module.color} text-white rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-lg shadow-current/20`}>
                     <module.icon size={20} />
                  </div>
                  <h3 className="text-sm font-black text-slate-800 tracking-tight uppercase mb-2 group-hover:text-indigo-600 transition-colors">{module.name}</h3>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] leading-relaxed mb-8">{module.desc}</p>
                  <div className="mt-auto flex items-center justify-between w-full">
                     <span className="text-[10px] font-black text-indigo-400 uppercase tracking-widest bg-indigo-50/50 px-3 py-1 rounded-lg">{module.tag}</span>
                     <div className="w-10 h-10 bg-slate-50 rounded-full flex items-center justify-center text-slate-200 group-hover:bg-indigo-600 group-hover:text-white transition-all shadow-sm">
                        <ArrowRight size={16} />
                     </div>
                  </div>
               </div>
            ))}
         </div>

         {/* Secondary Controls & Health Grid */}
         <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">

            {/* Operations Hub */}
            <div className="xl:col-span-8 bg-white p-8 rounded-3xl border border-slate-100 shadow-sm space-y-8">
               <div className="flex items-center justify-between pb-6 border-b border-slate-50">
                  <h3 className="text-xs font-black text-slate-800 uppercase tracking-widest">Operational Core</h3>
                  <div className="flex gap-2">
                     <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                     <span className="text-[9px] font-black text-emerald-600 uppercase tracking-widest">Active</span>
                  </div>
               </div>

               <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {[
                     { name: 'Add Personnel', icon: UserPlus, path: '/employees/add', bg: 'bg-indigo-50', color: 'text-indigo-600' },
                     { name: 'Deploy Update', icon: RefreshCw, path: '/admin/settings', bg: 'bg-amber-50', color: 'text-amber-500' },
                     { name: 'Fiscal Audit', icon: BarChart3, path: '/admin/payroll-management/reports', bg: 'bg-emerald-50', color: 'text-emerald-500' },
                     { name: 'System Logs', icon: History, path: '/admin/security', bg: 'bg-slate-50', color: 'text-slate-500' }
                  ].map((action, i) => (
                     <button
                        key={i}
                        onClick={() => navigate(action.path)}
                        className="flex flex-col items-center justify-center p-6 border border-slate-100 rounded-2xl bg-slate-50/50 hover:bg-white hover:border-indigo-600 hover:shadow-xl hover:shadow-indigo-50 transition-all group active:scale-95"
                     >
                        <div className={`w-10 h-10 ${action.bg} ${action.color} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                           <action.icon size={18} />
                        </div>
                        <span className="text-[10px] font-black text-slate-800 uppercase tracking-widest">{action.name}</span>
                     </button>
                  ))}
               </div>
            </div>

            {/* Infrastructure Health Card */}
            <div className="xl:col-span-4 bg-white p-8 rounded-3xl border border-slate-100 shadow-sm space-y-8">
               <div className="flex items-center gap-3 pb-6 border-b border-slate-50">
                  <div className="w-10 h-10 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center">
                     <Activity size={18} />
                  </div>
                  <div>
                     <h3 className="text-[11px] font-black text-slate-800 uppercase tracking-widest">Health Audit</h3>
                     <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Instance Monitoring</p>
                  </div>
               </div>

               <div className="space-y-6">
                  <div className="space-y-2">
                     <div className="flex justify-between items-center text-[9px] font-black uppercase tracking-widest">
                        <span className="text-slate-400">Database Integrity</span>
                        <span className="text-indigo-600">Stable</span>
                     </div>
                     <div className="w-full h-1 bg-slate-50 rounded-full overflow-hidden">
                        <div className="h-full bg-indigo-500 rounded-full w-[94%]"></div>
                     </div>
                  </div>
                  <div className="space-y-2">
                     <div className="flex justify-between items-center text-[9px] font-black uppercase tracking-widest">
                        <span className="text-slate-400">Cluster Availability</span>
                        <span className="text-emerald-500">99.9%</span>
                     </div>
                     <div className="w-full h-1 bg-slate-50 rounded-full overflow-hidden">
                        <div className="h-full bg-emerald-500 rounded-full w-[99%]"></div>
                     </div>
                  </div>
               </div>

               <button 
                 onClick={() => alert('Infrastructure Health Protocol: Initializing Deep Diagnostic Sequence... Status Optimal.')}
                 className="w-full py-4 bg-slate-900 text-white text-[10px] font-black uppercase tracking-[0.4em] rounded-2xl shadow-xl hover:bg-indigo-600 transition-all flex items-center justify-center gap-3"
               >
                  <Terminal size={14} /> Run Full Diagnostic
               </button>
            </div>

         </div>

      </div>
   );
};

// Internal Settings icon stub
const Settings = ({ size }) => (
   <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"></path><circle cx="12" cy="12" r="3"></circle></svg>
);

export default AdminDashboard;
