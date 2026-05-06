import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Search, 
  Filter, 
  User, 
  Mail, 
  MapPin, 
  Briefcase, 
  ArrowRight,
  TrendingUp,
  Activity,
  Award,
  ChevronRight,
  Grid
} from 'lucide-react';
import { useEmployeeContext } from '../../../context/EmployeeContext';

const EmployeeProfilesHub = () => {
  const navigate = useNavigate();
  const { employees } = useEmployeeContext();
  const [searchQuery, setSearchQuery] = useState('');

  const filteredEmployees = employees.filter(emp => 
    emp.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    emp.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
    emp.department.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex flex-col h-[calc(100vh-120px)] w-full gap-8 animate-in fade-in slide-in-from-bottom-4 duration-700 relative pt-4 overflow-hidden">
      
      {/* Header System */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 shrink-0">
        <div>
          <h1 className="text-4xl font-black text-slate-800 tracking-tight leading-none mb-2 underline decoration-indigo-300 underline-offset-4 uppercase">Forensic Profile Hub</h1>
          <p className="text-[10px] text-slate-400 font-black uppercase tracking-[0.2em] mt-1 leading-none">Global Talent Inventory & Identity Portfolio Nodes</p>
        </div>
        <div className="flex items-center gap-4 relative group max-w-sm w-full">
           <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-indigo-500 transition-colors" />
           <input 
             type="text" 
             placeholder="Search identity or role..." 
             className="w-full bg-white border border-slate-100 hover:border-slate-200 focus:border-indigo-500 outline-none rounded-2xl pl-12 pr-4 py-3.5 text-xs font-black text-slate-600 transition-all shadow-soft uppercase tracking-tight"
             value={searchQuery}
             onChange={(e) => setSearchQuery(e.target.value)}
           />
        </div>
      </div>

      {/* Profile Gallery Grid */}
      <div className="flex-1 overflow-y-auto no-scrollbar pb-10">
         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredEmployees.map((emp) => (
               <div 
                  key={emp.id}
                  onClick={() => navigate(`/employees/profile/${emp.id}`)}
                  className="card-soft group hover:border-indigo-100 hover:shadow-2xl hover:shadow-indigo-50 transition-all cursor-pointer relative overflow-hidden flex flex-col pt-0 px-0"
               >
                  {/* Decorative Banner */}
                  <div className="h-16 w-full bg-slate-50 relative overflow-hidden group-hover:h-20 transition-all duration-500">
                     <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/10 to-transparent"></div>
                  </div>

                  <div className="px-6 pb-6 relative">
                     {/* Avatar Node */}
                     <div className="w-20 h-20 rounded-[24px] overflow-hidden border-4 border-white shadow-xl bg-white -mt-10 mb-4 transition-transform group-hover:scale-110 duration-500">
                        <img src={emp.avatar || `https://i.pravatar.cc/150?u=${emp.id}`} alt="" className="w-full h-full object-cover" />
                     </div>

                     <div className="mb-6">
                        <h3 className="text-[14px] font-black text-slate-800 tracking-tight leading-none mb-1 group-hover:text-indigo-600 transition-colors uppercase">{emp.name}</h3>
                        <p className="text-[10px] text-indigo-500 font-black uppercase tracking-[0.2em]">{emp.role}</p>
                     </div>

                     <div className="space-y-3 pt-4 border-t border-slate-50">
                        <div className="flex items-center gap-3">
                           <Briefcase size={12} className="text-slate-300 group-hover:text-indigo-400" />
                           <span className="text-[10px] font-bold text-slate-500 uppercase">{emp.department} Hub</span>
                        </div>
                        <div className="flex items-center gap-3">
                           <MapPin size={12} className="text-slate-300 group-hover:text-indigo-400" />
                           <span className="text-[10px] font-bold text-slate-500 uppercase">{emp.location || 'Mumbai Core'}</span>
                        </div>
                     </div>

                     <button className="mt-8 w-full py-3 bg-slate-50 group-hover:bg-slate-900 group-hover:text-white rounded-xl text-[9px] font-black uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-2">
                        Inspect Profile
                        <ArrowRight size={14} className="opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all" />
                     </button>
                  </div>

                  {/* Operational Status Dot */}
                  <div className="absolute top-4 right-4 flex items-center gap-1.5 px-2.5 py-1 bg-white/80 backdrop-blur-md rounded-lg shadow-sm">
                     <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
                     <span className="text-[8px] font-black text-slate-600 uppercase tracking-widest">Active</span>
                  </div>
               </div>
            ))}
         </div>
      </div>

      {/* Persistence Footer */}
      <div className="px-10 py-6 bg-slate-900 border-t border-white/5 flex items-center justify-between text-white shrink-0 -mx-4">
         <div className="flex items-center gap-4">
            <div className="w-2 h-2 bg-indigo-500 rounded-full animate-pulse"></div>
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Total Workforce Nodes Indexed: {employees.length}</p>
         </div>
         <div className="flex items-center gap-6">
            <button className="px-6 py-2.5 bg-white/10 hover:bg-white/20 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] transition-all italic">Purging identity cache...</button>
         </div>
      </div>

    </div>
  );
};

export default EmployeeProfilesHub;
