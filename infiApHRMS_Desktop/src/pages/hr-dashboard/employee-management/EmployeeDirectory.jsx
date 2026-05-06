import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Plus,
  Download,
  Search,
  ChevronDown,
  MoreHorizontal,
  Mail,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  BellRing,
  Edit3,
  MoreVertical,
  User,
  Activity,
  TrendingUp,
  Filter,
  ArrowRight,
  FileText
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  ResponsiveContainer, 
  XAxis, 
  Cell,
  Tooltip as RechartsTooltip
} from 'recharts';
import { useEmployeeContext } from '../../../context/EmployeeContext';

const EmployeeDirectory = () => {
  const navigate = useNavigate();
  const { employees } = useEmployeeContext();

  // --- STATE MANAGEMENT ---
  const [notification, setNotification] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeActionId, setActiveActionId] = useState(null);
  const [filters, setFilters] = useState({
    department: 'All Departments',
    roleType: 'All Roles',
    status: 'All Status',
    joiningDate: ''
  });

  const deptData = [
    { name: 'Eng', value: 42, color: '#6366f1' },
    { name: 'Design', value: 12, color: '#ec4899' },
    { name: 'Ops', value: 28, color: '#f59e0b' },
    { name: 'HR', value: 8, color: '#10b981' },
    { name: 'Mark', value: 15, color: '#3b82f6' }
  ];

  // --- FILTER LOGIC ---
  const filteredEmployees = useMemo(() => {
    return employees.filter(emp => {
      const matchesSearch = emp.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        emp.email.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesDept = filters.department === 'All Departments' || emp.department === filters.department;
      const matchesStatus = filters.status === 'All Status' || emp.status === filters.status;

      return matchesSearch && matchesDept && matchesStatus;
    });
  }, [searchQuery, filters, employees]);

  // --- HANDLERS ---
  const showNotification = (msg) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3000);
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const handleExport = () => {
    showNotification("Employee data exported to CSV successfully.");
  };

  return (
    <div className="flex flex-col h-[calc(100vh-120px)] w-full gap-8 animate-in fade-in slide-in-from-bottom-4 duration-700 relative pt-4 overflow-hidden">

      {/* Dynamic Notification Toast */}
      {notification && (
        <div className="fixed top-24 right-8 z-100 animate-in slide-in-from-right-8 fade-in flex items-center gap-3 bg-slate-900 text-white px-6 py-4 rounded-2xl shadow-2xl border border-white/10">
          <BellRing size={20} className="text-primary-400" />
          <span className="text-sm font-bold tracking-tight uppercase tracking-widest">{notification}</span>
        </div>
      )}

      {/* Header System */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 shrink-0">
        <div>
          <h1 className="text-4xl font-black text-slate-800 tracking-tight leading-none mb-2 underline decoration-indigo-300 underline-offset-4 uppercase">Staffing Command Center</h1>
          <p className="text-[10px] text-slate-400 font-black uppercase tracking-[0.2em] mt-1 leading-none">Corporate Workforce Directory & Organizational Diagnostic Nodes</p>
        </div>
        <div className="flex items-center gap-3 self-start lg:self-center">
          <button
            onClick={handleExport}
            className="px-8 py-3 bg-white border border-slate-100 text-slate-400 font-black text-[10px] uppercase rounded-2xl hover:bg-slate-50 transition-all shadow-sm active:scale-95"
          >
            Bulk Export
          </button>
          <button
            onClick={() => navigate('/employees/add')}
            className="px-10 py-3 bg-slate-900 text-white font-black rounded-2xl hover:bg-slate-800 transition-all shadow-xl shadow-slate-200 uppercase tracking-widest text-[10px]"
          >
            Deploy New Identity
          </button>
        </div>
      </div>

      {/* Main Workspace Grid */}
      <div className="flex-1 grid grid-cols-1 xl:grid-cols-4 gap-8 overflow-hidden min-h-0" onClick={() => setActiveActionId(null)}>
        
        {/* 1. SIDEBAR: Live Staffing Metrics */}
        <div className="xl:col-span-1 flex flex-col gap-6 overflow-y-auto no-scrollbar pb-10">
           
           <div className="card-soft bg-white p-8 border-slate-100 shadow-soft">
              <div className="flex items-center justify-between mb-8">
                 <h3 className="text-xs font-black text-slate-800 uppercase tracking-widest">Dept Distribution</h3>
                 <TrendingUp size={20} className="text-indigo-500" />
              </div>
              <div className="h-32 w-full">
                 <ResponsiveContainer width="100%" height="100%">
                   <BarChart data={deptData}>
                      <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                         {deptData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                         ))}
                      </Bar>
                   </BarChart>
                 </ResponsiveContainer>
              </div>
               <div className="mt-6 flex items-end justify-between">
                  <div>
                     <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Total Nodes</p>
                     <p className="text-3xl font-black text-slate-800 tracking-tighter leading-none">{employees.length} Active</p>
                  </div>
                  <span className="px-3 py-1 bg-indigo-50 text-indigo-600 text-[10px] font-black rounded-lg">92% CAP</span>
               </div>
           </div>

           <div className="space-y-4">
              {[
                { label: 'Engineering Load', value: '42%', icon: Activity, color: 'text-indigo-500' },
                { label: 'Ops Efficiency', value: '98.2%', icon: TrendingUp, color: 'text-emerald-500' },
              ].map((stat, i) => (
                <div key={i} className="card-soft bg-white p-6 flex items-center gap-4 hover:border-indigo-100 transition-all cursor-crosshair">
                   <div className={`p-3 bg-slate-50 rounded-2xl ${stat.color} shadow-inner`}><stat.icon size={20} /></div>
                   <div>
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-2">{stat.label}</p>
                      <p className="text-2xl font-black text-slate-800 tracking-tighter leading-none">{stat.value}</p>
                   </div>
                </div>
              ))}
           </div>

           <div className="card-soft bg-slate-900 p-8 border-none text-white relative overflow-hidden group mt-auto">
              <div className="relative z-10">
                 <User className="mb-4 text-indigo-400" size={24} />
                  <h4 className="text-xs font-black uppercase tracking-widest leading-tight mb-2">Audit Compliance</h4>
                  <p className="text-[10px] opacity-60 font-black leading-relaxed uppercase tracking-widest mb-6">Workforce identity nodes are currently synchronized with the global ledger.</p>
                  <button className="w-full py-4 bg-white/10 hover:bg-white/20 rounded-xl text-[10px] font-black uppercase tracking-[0.25em] transition-all">Export Forensic Log</button>
              </div>
              <div className="absolute -right-4 -bottom-4 w-32 h-32 bg-indigo-600/20 rounded-full blur-3xl group-hover:scale-150 transition-transform"></div>
           </div>
        </div>

        {/* 2. MAIN HUB: Diagnostic Table */}
        <div className="xl:col-span-3 flex flex-col min-h-0 bg-white border border-slate-100 rounded-[44px] shadow-soft overflow-hidden">
           
           {/* Command Toolbar */}
           <div className="px-10 py-8 border-b border-slate-50 flex flex-col lg:flex-row lg:items-center justify-between gap-6 bg-slate-50/20">
              <div className="flex items-center gap-8">
                 <div className="relative group max-w-sm w-full lg:w-64">
                   <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" />
                   <input 
                     type="text" 
                     placeholder="Search identity or node..." 
                     className="w-full bg-white border border-slate-100 focus:border-indigo-100 outline-none rounded-2xl pl-12 pr-4 py-3 text-xs font-black text-slate-600 transition-all shadow-sm uppercase tracking-tight"
                     value={searchQuery}
                     onChange={(e) => setSearchQuery(e.target.value)}
                   />
                 </div>
                 <div className="flex items-center gap-3">
                    <div className="px-4 py-2 bg-white border border-slate-100 rounded-xl flex items-center gap-2">
                       <Filter size={14} className="text-slate-300" />
                       <select 
                         className="text-[10px] font-black text-slate-400 uppercase tracking-widest outline-none bg-transparent cursor-pointer"
                         value={filters.department}
                         onChange={(e) => handleFilterChange('department', e.target.value)}
                       >
                          <option>All Departments</option>
                          <option>Engineering</option>
                          <option>Design</option>
                          <option>Operations</option>
                       </select>
                    </div>
                 </div>
              </div>
           </div>

           {/* Workspace Table */}
           <div className="flex-1 overflow-y-auto no-scrollbar relative">
              <table className="w-full text-left border-collapse">
                 <thead className="sticky top-0 z-20 bg-slate-50/80 backdrop-blur-md border-b border-slate-100">
                    <tr>
                       <th className="px-10 py-6 text-[10px] font-black text-slate-500 uppercase tracking-widest">Identity Node</th>
                       <th className="px-6 py-6 text-[10px] font-black text-slate-500 uppercase tracking-widest">Operational Role</th>
                       <th className="px-6 py-6 text-[10px] font-black text-slate-500 uppercase tracking-widest text-center">Lifecycle</th>
                       <th className="px-10 py-6 text-[10px] font-black text-slate-500 uppercase tracking-widest text-right">Actions</th>
                    </tr>
                 </thead>
                 <tbody className="divide-y divide-slate-50 relative z-10 font-[Inter]">
                    {filteredEmployees.map((emp) => (
                       <tr key={emp.id} className="group hover:bg-indigo-50/30 transition-all">
                          <td className="px-10 py-8">
                             <div className="flex items-center gap-5">
                                <div className="w-14 h-14 rounded-2xl overflow-hidden border-2 border-slate-100 p-0.5 shadow-sm bg-white group-hover:scale-110 transition-all">
                                   <img src={emp.avatar} alt="" className="w-full h-full object-cover rounded-[14px]" />
                                </div>
                                 <div>
                                    <p className="text-sm font-black text-slate-800 tracking-tight leading-none mb-2 group-hover:text-indigo-600 transition-colors uppercase">{emp.name}</p>
                                    <div className="flex items-center gap-1.5 text-indigo-400 font-black text-[9px] uppercase tracking-[0.1em]">
                                       {emp.email}
                                    </div>
                                 </div>
                             </div>
                          </td>
                          <td className="px-6 py-8">
                             <p className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.2em] mb-1">{emp.id}</p>
                             <p className="text-sm font-black text-slate-700 tracking-tight uppercase leading-none">{emp.role}</p>
                          </td>
                          <td className="px-6 py-8">
                             <div className="flex items-center justify-center">
                                <span className={`px-4 py-1.5 text-[9px] font-black rounded-xl uppercase tracking-widest border flex items-center gap-2 ${
                                   emp.status === 'Active' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-orange-50 text-orange-600 border-orange-100'
                                }`}>
                                   <div className={`w-1.5 h-1.5 rounded-full ${emp.status === 'Active' ? 'bg-emerald-500 pulse-emerald' : 'bg-orange-500 animate-pulse'}`} />
                                   {emp.status}
                                </span>
                             </div>
                          </td>
                          <td className="px-10 py-8 text-right relative">
                             <button 
                               onClick={(e) => { e.stopPropagation(); setActiveActionId(activeActionId === emp.id ? null : emp.id); }}
                               className="p-3 bg-white border border-slate-100 text-slate-400 hover:text-slate-800 rounded-2xl shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all active:scale-90"
                             >
                                <MoreVertical size={20} />
                             </button>

                             {activeActionId === emp.id && (
                                <div className="absolute right-10 top-20 w-56 bg-slate-900 text-white rounded-[24px] shadow-2xl py-4 z-50 animate-in zoom-in-95 fade-in duration-200 border border-white/10">
                                   <button 
                                     onClick={() => navigate(`/employees/profile/${emp.id}`)}
                                     className="w-full text-left px-6 py-3 text-[11px] font-black uppercase tracking-widest hover:bg-white/10 flex items-center gap-3 transition-all"
                                   >
                                      <ExternalLink size={16} className="text-indigo-400" />
                                      View Intelligence
                                   </button>
                                   <button 
                                     onClick={() => navigate(`/employees/edit/${emp.id}`)}
                                     className="w-full text-left px-6 py-3 text-[11px] font-black uppercase tracking-widest hover:bg-white/10 flex items-center gap-3 transition-all"
                                   >
                                      <Edit3 size={16} className="text-orange-400" />
                                      Modify Identity
                                   </button>
                                   <div className="h-px bg-white/5 my-2 mx-6"></div>
                                   <button className="w-full text-left px-6 py-3 text-[11px] font-black uppercase tracking-widest hover:bg-white/10 flex items-center gap-3 transition-all text-slate-400">
                                      <FileText size={16} />
                                      Export Dataset
                                   </button>
                                </div>
                             )}
                          </td>
                       </tr>
                    ))}
                 </tbody>
              </table>
           </div>

           {/* Persistence Footer */}
           <div className="px-10 py-6 bg-slate-900 border-t border-white/5 flex items-center justify-between text-white shrink-0">
              <div className="flex items-center gap-4">
                 <div className="w-2 h-2 bg-indigo-500 rounded-full animate-pulse"></div>
                 <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Identity Master Node Active</p>
              </div>
              <div className="flex items-center gap-6">
                 <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest leading-none">Showing {filteredEmployees.length} Workforce Segments</p>
                 <button className="px-6 py-2.5 bg-white/10 hover:bg-white/20 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all">Sync Ledger</button>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default EmployeeDirectory;
