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
  Layout
} from 'lucide-react';
import { 
  AreaChart, 
  Area, 
  ResponsiveContainer, 
  Tooltip as RechartsTooltip,
  XAxis,
  BarChart,
  Bar
} from 'recharts';
import { useNavigate } from 'react-router-dom';
import { getAttendanceReports, generateAttendanceReport } from '../../../services/hrApi';

const AttendanceReports = () => {
  const navigate = useNavigate();
  const [notification, setNotification] = useState(null);
  const [activeTab, setActiveTab] = useState('Monthly');
  const [showConfigDrawer, setShowConfigDrawer] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const showNotification = (msg) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3000);
  };

  const [reports, setReports] = useState([]);
  const [trendData, setTrendData] = useState([]);

  const fetchReports = async () => {
    try {
      const res = await getAttendanceReports();
      const data = res.data?.data;
      if (data) {
        setReports(data.reports?.map(r => ({
          title: r.title || 'Attendance Audit',
          date: r.date ? new Date(r.date).toLocaleDateString() : 'N/A',
          type: r.type || 'System Final',
          status: r.status || 'Ready',
          size: r.size || '1.1 MB',
          path: r.path || '#'
        })) || []);
        
        if (data.trendData?.length) {
          setTrendData(data.trendData);
        } else {
          setTrendData([
            { name: 'Mon', value: 92 }, { name: 'Tue', value: 88 }, { name: 'Wed', value: 95 },
            { name: 'Thu', value: 91 }, { name: 'Fri', value: 98 }, { name: 'Sat', value: 30 }, { name: 'Sun', value: 10 }
          ]);
        }
      }
    } catch (err) {
      console.error('Failed to load reports:', err);
      // Fallback data
      setReports([
        { title: 'Global Attendance Audit', date: 'Oct 2023', type: 'System Final', status: 'Ready', size: '2.4 MB', path: '/attendance-reports/daily' },
        { title: 'Late Inflow Analysis', date: 'Wk 42', type: 'Diagnostic', status: 'Ready', size: '1.1 MB', path: '/attendance-reports/late' },
      ]);
      setTrendData([
        { name: 'Mon', value: 92 }, { name: 'Tue', value: 88 }, { name: 'Wed', value: 95 },
        { name: 'Thu', value: 91 }, { name: 'Fri', value: 98 }, { name: 'Sat', value: 30 }, { name: 'Sun', value: 10 }
      ]);
    }
  };

  useEffect(() => {
    fetchReports();
  }, []);

  const handleGenerate = async () => {
     setShowConfigDrawer(false); 
     showNotification("Compiling Strategic Master Report...");
     try {
        await generateAttendanceReport({ type: 'Master' });
        fetchReports(); // refresh the list after generating
        showNotification("Master Report Generated Successfully.");
     } catch (err) {
        showNotification("Failed to generate report.");
     }
  };

  const filteredReports = reports.filter(rep => 
    rep.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    rep.type.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex flex-col h-[calc(100vh-120px)] w-full gap-8 animate-in fade-in slide-in-from-bottom-4 duration-700 relative pt-4 overflow-hidden">
      
      {/* Configuration Drawer (Sliding Panel) */}
      {showConfigDrawer && (
        <div className="fixed inset-0 z-200 flex justify-end">
           <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm animate-in fade-in" onClick={() => setShowConfigDrawer(false)}></div>
           <div className="w-full max-w-lg bg-white h-full relative z-210 shadow-2xl animate-in slide-in-from-right-full duration-500 flex flex-col">
              <div className="p-10 border-b border-slate-50 flex items-center justify-between">
                 <div>
                    <h3 className="text-2xl font-black text-slate-800 tracking-tight">Generate Master Report</h3>
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">Configure diagnostic architecture</p>
                 </div>
                 <button onClick={() => setShowConfigDrawer(false)} className="p-3 bg-slate-50 text-slate-400 hover:text-slate-800 rounded-2xl transition-all"><X size={20} /></button>
              </div>
              <div className="flex-1 overflow-y-auto p-10 space-y-10 custom-scrollbar">
                 <section className="space-y-6">
                    <h4 className="text-xs font-black text-slate-800 uppercase tracking-widest flex items-center gap-2">
                       <Layout size={14} className="text-primary-500" />
                       Report Template
                    </h4>
                    <div className="grid grid-cols-2 gap-4">
                       {['Attendance Audit', 'Late Diagnostic', 'Leave Balance', 'Payroll Sync'].map(t => (
                          <button key={t} className="p-5 border border-slate-100 rounded-[24px] text-left hover:border-primary-500 hover:bg-primary-50 transition-all group">
                             <p className="text-xs font-black text-slate-800 uppercase tracking-tight group-hover:text-primary-600">{t}</p>
                             <p className="text-[10px] text-slate-400 font-bold mt-1">Standard v2.4</p>
                          </button>
                       ))}
                    </div>
                 </section>
                 
                 <section className="space-y-6">
                    <h4 className="text-xs font-black text-slate-800 uppercase tracking-widest flex items-center gap-2">
                       <Settings size={14} className="text-primary-500" />
                       Data Specifics
                    </h4>
                    <div className="space-y-4">
                       {['Include Punch Times', 'Include IP Logs', 'Include Geo-Tags', 'Include Overtime'].map(opt => (
                          <label key={opt} className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl cursor-pointer hover:bg-slate-100 transition-all">
                             <span className="text-[11px] font-black text-slate-600 uppercase tracking-widest">{opt}</span>
                             <input type="checkbox" className="w-5 h-5 rounded-lg border-slate-200 text-primary-600 focus:ring-primary-500" defaultChecked />
                          </label>
                       ))}
                    </div>
                 </section>
              </div>
              <div className="p-10 border-t border-slate-50 bg-slate-50/20">
                 <button 
                  onClick={handleGenerate}
                  className="w-full py-4 bg-slate-900 text-white font-black rounded-2xl hover:bg-slate-800 transition-all shadow-2xl shadow-slate-200 uppercase tracking-[0.2em] text-[11px]"
                 >
                    Compile & Export Report
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
          <h1 className="text-4xl font-black text-slate-800 tracking-tight leading-none mb-2">Strategic Insight Hub</h1>
          <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest leading-none mt-1">Intelligence Archive & Diagnostic Generation Engine</p>
        </div>
        <div className="flex items-center gap-3 self-start lg:self-center">
           <button 
             onClick={() => showNotification("Initiating recurring task scheduler...")}
             className="px-8 py-3 bg-white border border-slate-100 text-slate-400 font-black text-[10px] uppercase rounded-2xl hover:bg-slate-50 transition-all shadow-sm active:scale-95"
           >
              Schedule Cycle
           </button>
           <button 
             onClick={() => setShowConfigDrawer(true)}
             className="px-10 py-3 bg-slate-900 text-white font-black rounded-2xl hover:bg-slate-800 transition-all shadow-xl shadow-slate-200 uppercase tracking-widest text-[10px]"
           >
              Generate Master Report
           </button>
        </div>
      </div>

      {/* Main Workspace Grid */}
      <div className="flex-1 grid grid-cols-1 xl:grid-cols-4 gap-8 overflow-hidden min-h-0">
         
         {/* 1. SIDEBAR: Live Intelligence & Stats */}
         <div className="xl:col-span-1 flex flex-col gap-6 overflow-y-auto no-scrollbar pb-10">
            
            {/* Live Chart Section */}
            <div className="card-soft bg-white p-8 border-slate-100 shadow-soft">
               <div className="flex items-center justify-between mb-8">
                  <h3 className="text-[11px] font-black text-slate-800 uppercase tracking-[0.2em]">Global Trend</h3>
                  <TrendingUp size={20} className="text-primary-500" />
               </div>
               <div className="h-32 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={trendData}>
                       <defs>
                          <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                             <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.1}/>
                             <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
                          </linearGradient>
                       </defs>
                       <Area type="monotone" dataKey="value" stroke="#8b5cf6" strokeWidth={3} fillOpacity={1} fill="url(#colorValue)" />
                    </AreaChart>
                  </ResponsiveContainer>
               </div>
               <div className="mt-6 flex items-end justify-between">
                  <div>
                     <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Presence Avg</p>
                     <p className="text-2xl font-black text-slate-800 tracking-tighter">94.8%</p>
                  </div>
                  <span className="px-3 py-1 bg-emerald-50 text-emerald-600 text-[10px] font-black rounded-lg">+2.1%</span>
               </div>
            </div>

            {/* Quick Stats Grid */}
            <div className="space-y-4">
               {[
                 { label: 'Cloud Finalized', value: '1,420', icon: CheckCircle2, color: 'text-emerald-500' },
                 { label: 'Storage Node', value: '0.8 GB', icon: Activity, color: 'text-primary-500' },
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

            {/* Compliance Action */}
            <div className="card-soft bg-slate-900 p-8 border-none text-white relative overflow-hidden group mt-auto">
               <div className="relative z-10">
                  <AlertCircle className="mb-4 text-primary-400" size={24} />
                  <h4 className="text-sm font-black uppercase tracking-widest leading-tight mb-2">Audit Compliance</h4>
                  <p className="text-[10px] opacity-60 font-medium leading-relaxed uppercase tracking-widest mb-6">Oct Finalized data is now ready for verification.</p>
                  <button className="w-full py-3 bg-white/10 hover:bg-white/20 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all">Start Verify</button>
               </div>
               <div className="absolute -right-4 -bottom-4 w-32 h-32 bg-primary-600/20 rounded-full blur-3xl group-hover:scale-150 transition-transform"></div>
            </div>
         </div>

         {/* 2. MAIN HUB: Report Archive & Diagnostics */}
         <div className="xl:col-span-3 flex flex-col min-h-0 bg-white border border-slate-100 rounded-[44px] shadow-soft overflow-hidden">
            
            {/* Archive Toolbar */}
            <div className="px-10 py-8 border-b border-slate-50 flex flex-col lg:flex-row lg:items-center justify-between gap-6 bg-slate-50/20">
               <div className="flex items-center gap-8">
                  {['Daily', 'Weekly', 'Monthly', 'Annual'].map(tab => (
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
                    placeholder="Search employees, departments, or shifts..." 
                    className="w-full bg-white border border-slate-100 focus:border-primary-100 outline-none rounded-2xl pl-12 pr-4 py-3 text-xs font-black text-slate-600 transition-all shadow-sm uppercase tracking-tight"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
               </div>
            </div>

            {/* Archive Table */}
            <div className="flex-1 overflow-y-auto no-scrollbar">
               <table className="w-full text-left">
                  <thead className="sticky top-0 z-20 bg-slate-50/80 backdrop-blur-md border-b border-slate-100">
                     <tr>
                        <th className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Report Identity</th>
                        <th className="px-6 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Log Period</th>
                        <th className="px-6 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Category</th>
                        <th className="px-6 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Actions</th>
                     </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50 relative z-10">
                     {filteredReports.map((rep, idx) => (
                        <tr key={idx} onClick={() => navigate(rep.path)} className="group hover:bg-slate-50/50 transition-all cursor-pointer">
                           <td className="px-10 py-8">
                              <div className="flex items-center gap-5">
                                 <div className="p-4 bg-white border border-slate-100 rounded-2xl text-slate-300 group-hover:text-primary-500 group-hover:border-primary-200 transition-all shadow-sm">
                                    <FileText size={24} />
                                 </div>
                                 <div>
                                    <p className="text-sm font-black text-slate-800 tracking-tight leading-none group-hover:text-primary-600 transition-colors uppercase mb-1">{rep.title}</p>
                                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{rep.size} • Verified Archive</p>
                                 </div>
                              </div>
                           </td>
                           <td className="px-6 py-8">
                              <div className="flex items-center gap-2 text-[11px] font-black text-slate-400 uppercase tracking-widest">
                                 <Calendar size={14} className="text-primary-400" />
                                 {rep.date}
                              </div>
                           </td>
                           <td className="px-6 py-8">
                              <span className="px-4 py-1.5 bg-slate-900/5 text-slate-600 text-[10px] font-black rounded-xl uppercase tracking-widest border border-slate-100">{rep.type}</span>
                           </td>
                           <td className="px-10 py-8 text-right">
                              <div className="flex items-center justify-end gap-3">
                                 <button onClick={() => showNotification(`Exporting ${rep.title}...`)} className="p-3 bg-white border border-slate-100 text-slate-400 hover:text-slate-800 rounded-2xl shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all">
                                    <Download size={20} />
                                 </button>
                                 <button className="p-3 bg-white border border-slate-100 text-slate-400 hover:text-primary-600 rounded-2xl shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all">
                                    <Share2 size={20} />
                                 </button>
                              </div>
                           </td>
                        </tr>
                     ))}
                  </tbody>
               </table>
            </div>

            {/* Archive Logic Footer */}
            <div className="px-10 py-6 bg-slate-900 border-t border-white/5 flex items-center justify-between text-white shrink-0">
               <div className="flex items-center gap-4">
                  <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                  <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Archive Node: IN-MUM-SRV-04 Active</p>
               </div>
               <div className="flex items-center gap-6">
                  <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Total Master Indices: 1,420</p>
                  <button className="px-6 py-2.5 bg-white/10 hover:bg-white/20 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all">Sync Archive</button>
               </div>
            </div>

         </div>

      </div>

    </div>
  );
};

export default AttendanceReports;
