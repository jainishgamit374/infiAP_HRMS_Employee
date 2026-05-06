import React, { useState } from 'react';
import { 
  Plus, 
  Search, 
  FileText, 
  Eye, 
  Edit3, 
  Trash2, 
  CheckCircle2, 
  Clock, 
  Archive,
  MoreVertical,
  ChevronRight,
  ShieldCheck,
  Download,
  Filter
} from 'lucide-react';

const CompanyPolicies = () => {
  const [searchQuery, setSearchQuery] = useState('');

  const stats = [
    { label: 'Total', value: '15', color: 'text-indigo-600', bg: 'bg-indigo-50' },
    { label: 'Active', value: '12', color: 'text-emerald-600', bg: 'bg-emerald-50' },
    { label: 'New', value: '3', color: 'text-amber-500', bg: 'bg-amber-50' },
  ];

  const policies = [
    { 
      id: 1, 
      title: 'Leave Policy', 
      updated: 'March 12, 2024', 
      status: 'Active', 
      tag: 'E-SIGN ACT',
      description: 'Standard guidelines for paid time off, sick leave, and holidays.'
    },
    { 
      id: 2, 
      title: 'Remote Work Guidelines', 
      updated: 'March 05, 2024', 
      status: 'Draft', 
      tag: 'INTERNAL',
      description: 'Protocol for remote operations and communication expectations.'
    },
    { 
      id: 3, 
      title: 'Code of Conduct', 
      updated: 'Jan 22, 2024', 
      status: 'Active', 
      tag: 'COMPLIANCE',
      description: 'Ethical behavior and professional standards for all employees.'
    },
    { 
      id: 4, 
      title: 'Old Expense Policy', 
      updated: 'Dec 15, 2023', 
      status: 'Archived', 
      tag: 'LEGACY',
      description: 'Superseded by New Fiscal Policy v4.0.'
    },
  ];

  const getStatusStyle = (status) => {
    switch (status) {
      case 'Active': return 'bg-emerald-50 text-emerald-600 border-emerald-100';
      case 'Draft': return 'bg-amber-50 text-amber-600 border-amber-100';
      case 'Archived': return 'bg-slate-50 text-slate-400 border-slate-100';
      default: return 'bg-slate-50 text-slate-400';
    }
  };

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-20">
      
      {/* Premium Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8 px-2">
        <div>
           <h1 className="text-4xl font-black text-slate-800 tracking-tight leading-none mb-2 underline decoration-indigo-300 underline-offset-4 uppercase">Company Policies</h1>
           <p className="text-[10px] text-slate-400 font-black uppercase tracking-[0.2em] mt-1 leading-none">Institutional Operating Protocols</p>
        </div>
        <div className="flex items-center gap-4">
           <div className="relative group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-hover:text-indigo-500 transition-colors" size={18} />
              <input 
                type="text" 
                placeholder="Search policies..."
                className="bg-white border border-slate-100 rounded-2xl pl-12 pr-6 py-3.5 text-sm font-bold focus:ring-4 focus:ring-indigo-500/5 outline-none transition-all w-[300px] shadow-soft"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
           </div>
           <button 
             onClick={() => alert('Institutional Protocol Hub: Initializing Policy Creation Node...')}
             className="p-4 bg-slate-900 text-white rounded-2xl shadow-xl shadow-slate-200 hover:bg-indigo-600 hover:scale-105 active:scale-95 transition-all"
           >
              <Plus size={24} strokeWidth={2.5} />
           </button>
        </div>
      </div>

      {/* Stats Quick Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 px-2">
        {stats.map((stat, idx) => (
          <div key={idx} className="bg-white p-8 rounded-[40px] border border-slate-50 shadow-soft flex items-center justify-between group hover:shadow-xl transition-all">
             <div>
                <p className="text-[8px] font-black text-slate-500 uppercase tracking-widest mb-1 leading-none">Policy Node</p>
                <h3 className={`text-4xl font-black ${stat.color} tracking-tighter`}>{stat.value}</h3>
             </div>
             <div className={`w-14 h-14 ${stat.bg} rounded-2xl flex items-center justify-center`}>
                <FileText className={stat.color} size={28} />
             </div>
          </div>
        ))}
      </div>

      {/* Policies List */}
      <div className="px-2">
        <div className="flex items-center justify-between mb-8 px-4">
           <h2 className="text-xs font-black uppercase tracking-[0.3em] text-slate-400">All Master Protocols</h2>
           <button className="flex items-center gap-2 text-[10px] font-black text-indigo-600 uppercase tracking-widest hover:underline">
              <Filter size={14} />
              Filter By Status
           </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
           {policies.map((policy) => (
             <div key={policy.id} className="bg-white p-10 rounded-[56px] border border-slate-50 shadow-soft group hover:shadow-2xl transition-all relative overflow-hidden flex flex-col justify-between min-h-[380px]">
                <div className="relative z-10">
                   <div className="flex items-center justify-between mb-8">
                      <div className={`px-5 py-2 rounded-full border text-[9px] font-black uppercase tracking-widest ${getStatusStyle(policy.status)}`}>
                         {policy.status}
                      </div>
                      <span className="text-[9px] font-black text-slate-300 uppercase tracking-widest px-4 py-2 bg-slate-50 rounded-lg">{policy.tag}</span>
                   </div>

                   <h3 className="text-2xl font-black text-slate-800 tracking-tight mb-4 group-hover:text-indigo-600 transition-colors uppercase leading-tight">{policy.title}</h3>
                   <p className="text-sm font-bold text-slate-400 leading-relaxed mb-6">{policy.description}</p>
                   
                   <div className="flex items-center gap-3 text-[10px] font-black text-slate-300 uppercase tracking-widest">
                      <Clock size={14} strokeWidth={2.5} />
                      Last Updated: {policy.updated}
                   </div>
                </div>

                <div className="mt-10 space-y-4 relative z-10">
                   <button className="w-full py-5 bg-indigo-600 text-white text-[10px] font-black uppercase tracking-widest rounded-[24px] shadow-3xl shadow-indigo-100 hover:bg-slate-900 active:scale-95 transition-all flex items-center justify-center gap-4">
                      <Eye size={18} />
                      View Policy Nodes
                   </button>
                   <div className="grid grid-cols-2 gap-4">
                      <button className="py-4 bg-slate-50 text-slate-500 text-[10px] font-black uppercase tracking-[0.3em] rounded-[20px] hover:bg-indigo-50 hover:text-indigo-600 transition-all flex items-center justify-center gap-3">
                         <Edit3 size={16} />
                         Edit
                      </button>
                      <button className="py-4 bg-slate-50 text-slate-300 text-[10px] font-black uppercase tracking-[0.3em] rounded-[20px] hover:bg-rose-50 hover:text-rose-500 transition-all flex items-center justify-center gap-3">
                         <Trash2 size={16} />
                         Delete
                      </button>
                   </div>
                </div>

                {/* Background Decor */}
                <div className="absolute -right-20 -top-20 w-64 h-64 bg-slate-50 rounded-full group-hover:bg-indigo-50/50 transition-colors duration-700 pointer-events-none"></div>
             </div>
           ))}
        </div>
      </div>

      {/* Floating Action Hint */}
      <div className="fixed bottom-12 right-12 z-20">
         <button 
           onClick={() => alert('Launching Master Policy Deployment Sequence...')}
           className="w-20 h-20 bg-slate-900 text-white rounded-[32px] shadow-2xl flex items-center justify-center hover:bg-indigo-600 hover:scale-110 active:scale-95 transition-all group"
         >
            <Plus size={32} strokeWidth={3} className="group-hover:rotate-90 transition-transform duration-500" />
         </button>
      </div>

    </div>
  );
};

export default CompanyPolicies;
