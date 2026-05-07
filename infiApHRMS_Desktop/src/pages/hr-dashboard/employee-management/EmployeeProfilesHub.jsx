import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
   Search,
   User,
   Mail,
   Briefcase,
   ArrowRight,
   Calendar,
   BadgeCheck,
   Loader2
} from 'lucide-react';
import { useEmployeeContext } from '../../../context/EmployeeContext';

// Generate a consistent color pair [text, background] from a name string
const nameToColor = (name = '') => {
   const colors = [
      ['#6366f1', '#e0e7ff'], // indigo
      ['#8b5cf6', '#ede9fe'], // violet
      ['#0ea5e9', '#e0f2fe'], // sky
      ['#10b981', '#d1fae5'], // emerald
      ['#f59e0b', '#fef3c7'], // amber
      ['#ef4444', '#fee2e2'], // red
      ['#ec4899', '#fce7f3'], // pink
      ['#14b8a6', '#ccfbf1'], // teal
   ];
   let hash = 0;
   for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash);
   return colors[Math.abs(hash) % colors.length];
};

const getInitials = (name = '') =>
   name.split(' ').slice(0, 2).map(w => w[0]?.toUpperCase() || '').join('');

const formatDate = (dateStr) => {
   if (!dateStr) return null;
   try {
      return new Date(dateStr).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
   } catch { return null; }
};

const EmployeeProfilesHub = () => {
   const navigate = useNavigate();
   const { employees, loading } = useEmployeeContext();
   const [searchQuery, setSearchQuery] = useState('');
   const [imgErrors, setImgErrors] = useState({});

   const filteredEmployees = employees.filter(emp =>
      emp.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (emp.role || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (emp.department || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (emp.email || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (emp.employeeId || '').toLowerCase().includes(searchQuery.toLowerCase())
   );

   return (
      <div className="flex flex-col h-[calc(100vh-120px)] w-full gap-8 animate-in fade-in slide-in-from-bottom-4 duration-700 relative pt-4 overflow-hidden">

         {/* Header */}
         <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 shrink-0">
            <div>
               <h1 className="text-4xl font-black text-slate-800 tracking-tight leading-none mb-2 underline decoration-indigo-300 underline-offset-4 uppercase">
                  Employees Profile Hub
               </h1>
               <p className="text-[10px] text-slate-400 font-black uppercase tracking-[0.2em] mt-1 leading-none">
                  Global Talent Inventory &amp; Identity Portfolio Nodes
               </p>
            </div>
            <div className="flex items-center gap-4 relative group max-w-sm w-full">
               <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-indigo-500 transition-colors" />
               <input
                  type="text"
                  placeholder="Search name, role, email, ID..."
                  className="w-full bg-white border border-slate-100 hover:border-slate-200 focus:border-indigo-500 outline-none rounded-2xl pl-12 pr-4 py-3.5 text-xs font-black text-slate-600 transition-all shadow-soft uppercase tracking-tight"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
               />
            </div>
         </div>

         {/* Gallery */}
         <div className="flex-1 overflow-y-auto no-scrollbar pb-10">
            {loading ? (
               <div className="flex flex-col items-center justify-center h-64 gap-4">
                  <Loader2 size={36} className="text-indigo-400 animate-spin" />
                  <p className="text-[11px] font-black uppercase tracking-widest text-slate-400">
                     Loading employee profiles...
                  </p>
               </div>
            ) : filteredEmployees.length === 0 ? (
               <div className="flex flex-col items-center justify-center h-64 gap-4">
                  <User size={48} className="text-slate-200" />
                  <p className="text-[11px] font-black uppercase tracking-widest text-slate-400">
                     {searchQuery ? 'No employees match your search' : 'No employees found'}
                  </p>
               </div>
            ) : (
               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {filteredEmployees.map((emp) => {
                     const [textColor, bannerBg] = nameToColor(emp.name);
                     const initials = getInitials(emp.name);
                     const hasImage = emp.avatar && !imgErrors[emp.id];
                     const joinedDate = formatDate(emp.joiningDate);

                     return (
                        <div
                           key={emp.id}
                           onClick={() => navigate(`/employees/profile/${emp.id}`)}
                           className="card-soft group hover:border-indigo-100 hover:shadow-2xl hover:shadow-indigo-50 transition-all cursor-pointer relative overflow-hidden flex flex-col pt-0 px-0"
                        >
                           {/* Colored Banner */}
                           <div
                              className="h-16 w-full relative overflow-hidden group-hover:h-20 transition-all duration-500"
                              style={{ backgroundColor: bannerBg }}
                           >
                              <div className="absolute inset-0 bg-gradient-to-r from-black/5 to-transparent" />
                           </div>

                           <div className="px-6 pb-6 relative">
                              {/* Avatar — real image or initials fallback */}
                              <div
                                 className="w-20 h-20 rounded-[24px] overflow-hidden border-4 border-white shadow-xl -mt-10 mb-4 transition-transform group-hover:scale-110 duration-500 flex items-center justify-center shrink-0"
                                 style={{ backgroundColor: hasImage ? 'white' : bannerBg }}
                              >
                                 {hasImage ? (
                                    <img
                                       src={emp.avatar}
                                       alt={emp.name}
                                       className="w-full h-full object-cover"
                                       onError={() =>
                                          setImgErrors(prev => ({ ...prev, [emp.id]: true }))
                                       }
                                    />
                                 ) : (
                                    <span
                                       className="text-2xl font-black select-none"
                                       style={{ color: textColor }}
                                    >
                                       {initials}
                                    </span>
                                 )}
                              </div>

                              {/* Name + Role + Employee ID */}
                              <div className="mb-4">
                                 <h3 className="text-[14px] font-black text-slate-800 tracking-tight leading-none mb-0.5 group-hover:text-indigo-600 transition-colors uppercase">
                                    {emp.name}
                                 </h3>
                                 <p
                                    className="text-[10px] font-black uppercase tracking-[0.15em] leading-none"
                                    style={{ color: textColor }}
                                 >
                                    {emp.role || 'Employee'}
                                 </p>
                                 {emp.employeeId && (
                                    <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest mt-1">
                                       {emp.employeeId}
                                    </p>
                                 )}
                              </div>

                              {/* Details */}
                              <div className="space-y-2 pt-4 border-t border-slate-50">
                                 <div className="flex items-center gap-3">
                                    <Briefcase size={11} className="text-slate-300 shrink-0 group-hover:text-indigo-400 transition-colors" />
                                    <span className="text-[10px] font-bold text-slate-500 uppercase truncate">
                                       {emp.department || 'General'}
                                    </span>
                                 </div>
                                 {emp.email && (
                                    <div className="flex items-center gap-3 min-w-0">
                                       <Mail size={11} className="text-slate-300 shrink-0 group-hover:text-indigo-400 transition-colors" />
                                       <span className="text-[10px] font-medium text-slate-400 truncate lowercase">
                                          {emp.email}
                                       </span>
                                    </div>
                                 )}
                                 {joinedDate && (
                                    <div className="flex items-center gap-3">
                                       <Calendar size={11} className="text-slate-300 shrink-0 group-hover:text-indigo-400 transition-colors" />
                                       <span className="text-[10px] font-bold text-slate-400 uppercase">
                                          Joined {joinedDate}
                                       </span>
                                    </div>
                                 )}
                              </div>

                              <button className="mt-6 w-full py-3 bg-slate-50 group-hover:bg-slate-900 group-hover:text-white rounded-xl text-[9px] font-black uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-2">
                                 Inspect Profile
                                 <ArrowRight size={13} className="opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all" />
                              </button>
                           </div>

                           {/* Status dot */}
                           <div className="absolute top-4 right-4 flex items-center gap-1.5 px-2.5 py-1 bg-white/80 backdrop-blur-md rounded-lg shadow-sm">
                              <div
                                 className={`w-1.5 h-1.5 rounded-full animate-pulse ${
                                    emp.status === 'Active' ? 'bg-emerald-500' : 'bg-amber-400'
                                 }`}
                              />
                              <span className="text-[8px] font-black text-slate-600 uppercase tracking-widest">
                                 {emp.status || 'Active'}
                              </span>
                           </div>
                        </div>
                     );
                  })}
               </div>
            )}
         </div>

         {/* Footer */}
         <div className="px-10 py-6 bg-slate-900 border-t border-white/5 flex items-center justify-between text-white shrink-0 -mx-4">
            <div className="flex items-center gap-4">
               <div className="w-2 h-2 bg-indigo-500 rounded-full animate-pulse" />
               <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
                  Total Workforce Nodes Indexed: {employees.length}
                  {searchQuery && filteredEmployees.length !== employees.length && (
                     <span className="text-indigo-400 ml-2">({filteredEmployees.length} shown)</span>
                  )}
               </p>
            </div>
            <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
               <BadgeCheck size={14} className="text-emerald-500" />
               Live Database
            </div>
         </div>

      </div>
   );
};

export default EmployeeProfilesHub;
