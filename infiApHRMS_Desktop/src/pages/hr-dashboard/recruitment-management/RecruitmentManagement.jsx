import React, { useEffect, useState } from 'react';
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
  LayoutDashboard,
  Briefcase,
  Users,
  UserPlus,
  ShieldCheck,
  Target
} from 'lucide-react';
import { 
  AreaChart, 
  Area, 
  ResponsiveContainer, 
  Tooltip as RechartsTooltip,
  XAxis,
  BarChart,
  Bar,
  Cell
} from 'recharts';
import { useNavigate } from 'react-router-dom';
import { useJobContext } from '../../../context/JobContext';
import { getCandidateTracking, getRecruitmentJobs } from '../../../services/hrApi';

const RecruitmentManagement = () => {
  const navigate = useNavigate();
  const { jobs, totals: jobTotals } = useJobContext();
  const [notification, setNotification] = useState(null);
  const [activeTab, setActiveTab] = useState('Active');
  const [showConfigDrawer, setShowConfigDrawer] = useState(false);
   const [searchQuery, setSearchQuery] = useState('');
   const [pipelineData, setPipelineData] = useState([
      { name: 'Applied', value: 120 },
      { name: 'Screening', value: 85 },
      { name: 'Technical', value: 42 },
      { name: 'Leadership', value: 18 },
      { name: 'Offer', value: 4 }
   ]);
   const [applicantTotal, setApplicantTotal] = useState(jobTotals.totalApplicants || 0);

  const showNotification = (msg) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3000);
  };

  const getTabData = () => {
    switch (activeTab) {
      case 'Review':
        return [
          { title: 'Sarah Chen - Final Review', date: 'Today', category: 'Product', status: 'Priority', size: 'Designer', path: '/recruitment/applications', icon: ShieldCheck, color: 'text-orange-600', bg: 'bg-orange-50' },
          { title: 'Marcus Thompson - Screening', date: 'Today', category: 'Sales', status: 'Required', size: 'Account Exec', path: '/recruitment/applications', icon: Clock, color: 'text-indigo-600', bg: 'bg-indigo-50' },
        ];
      case 'History':
        return [
          { title: 'Engineering Cohort Q3', date: 'Sep 2023', category: 'Archive', status: 'Locked', size: '12 Hires', path: '/recruitment/candidates', icon: Users, color: 'text-slate-600', bg: 'bg-slate-50' },
        ];
      case 'Archives':
        return [
          { title: 'Talent Pool 2022', date: 'Dec 2022', category: 'Strategic', status: 'Cold', size: '840 Nodes', path: '/recruitment/candidates', icon: Target, color: 'text-slate-400', bg: 'bg-slate-50' },
        ];
      default: // Active
        return [
          { title: 'Job Postings', date: 'Active', category: 'Recruit', status: 'Live', size: `${jobTotals.activeCount} Active`, path: '/recruitment/active-jobs', icon: Briefcase, color: 'text-primary-600', bg: 'bg-primary-50' },
          { title: 'Candidate Pipeline', date: 'Oct 2023', category: 'Applicants', status: 'Priority', size: '348 Active', path: '/recruitment/candidates', icon: Users, color: 'text-indigo-600', bg: 'bg-indigo-50' },
          { title: 'Hiring Applications', date: 'Wk 42', category: 'Review', status: 'Required', size: '12 Direct', path: '/recruitment/applications', icon: ClipboardList, color: 'text-primary-600', bg: 'bg-primary-50' },
          { title: 'Interview Scheduling', date: 'Today', category: 'Operations', status: 'Live', size: '8 Slots', path: '/recruitment/interviews', icon: Calendar, color: 'text-orange-600', bg: 'bg-orange-50' },
          { title: 'Talent Sourcing Audit', date: 'FY 2024', category: 'Strategic', status: 'Ready', size: 'Verified', path: '/recruitment/candidates', icon: Target, color: 'text-emerald-600', bg: 'bg-emerald-50' },
        ];
    }
  };

  const currentActions = getTabData();

   useEffect(() => {
      let isMounted = true;

      const loadPipeline = async () => {
         try {
            const [candidateRes, jobRes] = await Promise.all([
               getCandidateTracking(),
               getRecruitmentJobs()
            ]);

            const candidates = Array.isArray(candidateRes.data?.data) ? candidateRes.data.data : [];
            const jobs = Array.isArray(jobRes.data?.data) ? jobRes.data.data : [];

            const stageCounts = candidates.reduce((acc, item) => {
               const stage = item.stage || item.status || 'Applied';
               acc[stage] = (acc[stage] || 0) + 1;
               return acc;
            }, {});

            const mapped = Object.entries(stageCounts).map(([name, value]) => ({ name, value }));

            if (isMounted) {
               if (mapped.length) setPipelineData(mapped);
               if (candidates.length) setApplicantTotal(candidates.length);
            }
         } catch (err) {
            console.error('Failed to load recruitment pipeline:', err);
         }
      };

      loadPipeline();

      return () => {
         isMounted = false;
      };
   }, []);

  const COLORS = ['#8b5cf6', '#6366f1', '#3b82f6', '#10b981', '#f59e0b'];

  return (
    <div className="flex flex-col h-[calc(100vh-120px)] w-full gap-8 animate-in fade-in slide-in-from-bottom-4 duration-700 relative pt-4 overflow-hidden text-left">
      
      {/* Configuration Drawer */}
      {showConfigDrawer && (
        <div className="fixed inset-0 z-200 flex justify-end">
           <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm animate-in fade-in" onClick={() => setShowConfigDrawer(false)}></div>
           <div className="w-full max-w-lg bg-white h-full relative z-210 shadow-2xl animate-in slide-in-from-right-full duration-500 flex flex-col">
              <div className="p-10 border-b border-slate-50 flex items-center justify-between">
                 <div>
                    <h3 className="text-2xl font-black text-slate-800 tracking-tight">Hiring Protocol Engine</h3>
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">Configure recruitment pipeline logic</p>
                 </div>
                 <button onClick={() => setShowConfigDrawer(false)} className="p-3 bg-slate-50 text-slate-400 hover:text-slate-800 rounded-2xl transition-all active:scale-95 text-left"><X size={20} /></button>
              </div>
              <div className="flex-1 overflow-y-auto p-10 space-y-10 custom-scrollbar no-scrollbar text-left">
                 <section className="space-y-6">
                    <h4 className="text-xs font-black text-slate-800 uppercase tracking-widest flex items-center gap-2">
                       <LayoutDashboard size={14} className="text-primary-500" />
                       Hiring Workflow
                    </h4>
                    <div className="space-y-4">
                       {['AI CV Screening', 'Auto-Schedule Tech Rounds', 'Leadership Review Node', 'Background Check Sync'].map(opt => (
                          <label key={opt} className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl cursor-pointer hover:bg-slate-100 transition-all active:scale-[0.98]">
                             <span className="text-[11px] font-black text-slate-600 uppercase tracking-widest">{opt}</span>
                             <input type="checkbox" className="w-5 h-5 rounded-lg border-slate-200 text-primary-600 focus:ring-primary-500" defaultChecked />
                          </label>
                       ))}
                    </div>
                 </section>
              </div>
              <div className="p-10 border-t border-slate-50 bg-slate-50/20">
                 <button 
                  onClick={() => { setShowConfigDrawer(false); showNotification("Recalibrating recruitment pipelines..."); }}
                  className="w-full py-4 bg-slate-900 text-white font-black rounded-2xl hover:bg-slate-800 transition-all shadow-2xl shadow-slate-200 uppercase tracking-[0.2em] text-[11px] active:scale-95"
                 >
                    Apply Workflow Protocols
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
          <h1 className="text-4xl font-black text-slate-800 tracking-tight leading-none mb-2">Talent Acquisition Command</h1>
          <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">Global Recruitment Pipelines & Vacancy Oversight</p>
        </div>
        <div className="flex items-center gap-3 self-start lg:self-center">
           <button 
             onClick={() => showNotification("Initiating candidate sourcing nodes...")}
             className="px-8 py-3 bg-white border border-slate-100 text-slate-400 font-black text-[10px] uppercase rounded-2xl hover:bg-slate-50 transition-all shadow-sm active:scale-95"
           >
              Source Talent
           </button>
           <button 
             onClick={() => setShowConfigDrawer(true)}
             className="px-10 py-3 bg-slate-900 text-white font-black rounded-2xl hover:bg-slate-800 transition-all shadow-xl shadow-slate-200 uppercase tracking-widest text-[10px] active:scale-95"
           >
              Configure Hiring
           </button>
        </div>
      </div>

      {/* Main Workspace Grid */}
      <div className="flex-1 grid grid-cols-1 xl:grid-cols-4 gap-8 overflow-hidden min-h-0">
         
         {/* 1. SIDEBAR: Live Recruitment Metrics */}
         <div className="xl:col-span-1 flex flex-col gap-6 overflow-y-auto no-scrollbar pb-10">
            
            <div className="card-soft bg-white p-8 border-slate-100 shadow-soft">
               <div className="flex items-center justify-between mb-8">
                  <h3 className="text-xs font-black text-slate-800 uppercase tracking-widest">Pipeline Health</h3>
                  <TrendingUp size={20} className="text-indigo-500" />
               </div>
               <div className="h-32 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={pipelineData}>
                       <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                          {pipelineData.map((entry, index) => (
                             <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                       </Bar>
                    </BarChart>
                  </ResponsiveContainer>
               </div>
                <div className="mt-6 flex items-end justify-between">
                   <div>
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Active Applicants</p>
                      <p className="text-3xl font-black text-slate-800 tracking-tighter leading-none">{applicantTotal} Global</p>
                   </div>
                   <span className="px-3 py-1 bg-emerald-50 text-emerald-600 text-[10px] font-black rounded-lg">94% EFF</span>
                </div>
            </div>

            <div className="space-y-4">
               {[
                 { label: 'Unscheduled Interviews', value: '4', icon: Clock, color: 'text-orange-500' },
                 { label: 'Time to Hire Avg', value: '18 Days', icon: Activity, color: 'text-primary-500' },
               ].map((stat, i) => (
                 <div key={i} className="card-soft bg-white p-6 flex items-center gap-4 hover:border-primary-100 transition-all cursor-pointer active:scale-95 group">
                    <div className={`p-3 bg-slate-50 rounded-2xl ${stat.color} shadow-inner group-hover:bg-white group-hover:shadow-soft`}><stat.icon size={20} /></div>
                    <div>
                       <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-2">{stat.label}</p>
                       <p className="text-2xl font-black text-slate-800 tracking-tighter leading-none uppercase">{stat.value}</p>
                    </div>
                 </div>
               ))}
            </div>

            <div className="card-soft bg-slate-900 p-8 border-none text-white relative overflow-hidden group mt-auto">
               <div className="relative z-10">
                  <AlertCircle className="mb-4 text-indigo-400" size={24} />
                  <h4 className="text-sm font-black uppercase tracking-widest leading-tight mb-2">Hiring Alert</h4>
                  <p className="text-[10px] opacity-60 font-medium leading-relaxed uppercase tracking-widest mb-6">4 senior roles have reached their critical deadline without finalist identification.</p>
                  <button onClick={() => navigate('/recruitment/applications')} className="w-full py-3 bg-white/10 hover:bg-white/20 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all active:scale-95">Review Pipeline</button>
               </div>
               <div className="absolute -right-4 -bottom-4 w-32 h-32 bg-indigo-600/20 rounded-full blur-3xl group-hover:scale-150 transition-transform"></div>
            </div>
         </div>

         {/* 2. MAIN HUB: Recruitment Workspaces */}
         <div className="xl:col-span-3 flex flex-col min-h-0 bg-white border border-slate-100 rounded-[44px] shadow-soft overflow-hidden">
            
            {/* Command Toolbar */}
            <div className="px-10 py-8 border-b border-slate-50 flex flex-col lg:flex-row lg:items-center justify-between gap-6 bg-slate-50/20">
               <div className="flex items-center gap-8">
                  {['Active', 'Review', 'History', 'Archives'].map(tab => (
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
                  <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-hover:text-primary-500 transition-colors pointer-events-none" />
                  <input 
                    type="text" 
                    placeholder="Search candidates, roles, or scores..." 
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
                        <th className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest text-left">Acquisition Workspace</th>
                        <th className="px-6 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest text-left">Log Period</th>
                        <th className="px-6 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest text-left">Compliance</th>
                        <th className="px-6 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Actions</th>
                     </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50 relative z-10 transition-all">
                     {currentActions.filter(a => a.title.toLowerCase().includes(searchQuery.toLowerCase())).map((act, idx) => (
                        <tr key={`${activeTab}-${idx}`} onClick={() => navigate(act.path)} className="group hover:bg-slate-50/50 transition-all cursor-pointer animate-in fade-in slide-in-from-left-4 duration-300">
                           <td className="px-10 py-8">
                              <div className="flex items-center gap-5">
                                 <div className={`p-4 rounded-2xl ${act.bg} ${act.color} border border-slate-100 shadow-sm group-hover:scale-110 transition-all`}>
                                    {act.icon ? <act.icon size={24} /> : <div className="w-6 h-6 bg-slate-200 rounded-full" />}
                                 </div>
                                 <div className="text-left">
                                    <p className="text-sm font-black text-slate-800 tracking-tight leading-none group-hover:text-primary-600 transition-colors uppercase mb-2">{act.title}</p>
                                    <div className="flex items-center gap-2 text-indigo-400 font-black text-[9px] uppercase tracking-[0.1em]">
                                       {act.size} • Verified Nodes
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
                                 act.status === 'Priority' || act.status === 'Required' ? 'bg-orange-50 text-orange-600 border-orange-100' : 
                                 act.status === 'Live' ? 'bg-indigo-50 text-indigo-600 border-indigo-100' : 'bg-slate-900/5 text-slate-600 border-slate-100'
                              }`}>{act.status}</span>
                           </td>
                           <td className="px-10 py-8 text-right">
                              <div className="flex items-center justify-end gap-3">
                                 <button onClick={(e) => { e.stopPropagation(); showNotification(`Exporting talent pipeline: ${act.title}...`); }} className="p-3 bg-white border border-slate-100 text-slate-400 hover:text-slate-800 rounded-2xl shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all active:scale-95">
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
                  <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Recruit Node: TAL-MUM-SRV-01 Active</p>
               </div>
                <div className="flex items-center gap-6">
                   <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Total Published Vacancies: {jobs.length}</p>
                   <button className="px-6 py-2.5 bg-white/10 hover:bg-white/20 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all">Sync Pipeline</button>
                </div>
            </div>

         </div>

      </div>

    </div>
  );
};

export default RecruitmentManagement;
