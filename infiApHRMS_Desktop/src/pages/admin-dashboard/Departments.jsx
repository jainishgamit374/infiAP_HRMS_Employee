import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Building2,
  Users,
  LayoutGrid,
  Plus,
  Search,
  ChevronRight,
  MoreVertical,
  Zap,
  LayoutDashboard
} from 'lucide-react';
import { useAdminDashboard } from '../../context/AdminDashboardContext';

const Departments = () => {
  const navigate = useNavigate();
  const { departments, totals, fetchDepartments } = useAdminDashboard();

  useEffect(() => {
    fetchDepartments();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const overviewStats = [
    { label: 'Depts', value: totals.deptCount.toString(), icon: Building2, color: 'text-[#4E63F0]', bg: 'bg-[#4E63F0]/5' },
    { label: 'Teams', value: totals.teamCount.toString(), icon: LayoutGrid, color: 'text-[#6C5CE7]', bg: 'bg-[#6C5CE7]/5' },
  ];

  return (
    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Header Area */}
      <div className="flex items-center justify-between px-2">
        <div>
          <h1 className="text-4xl font-black text-slate-800 tracking-tight leading-none mb-2">Departments</h1>
          <p className="text-[10px] text-slate-400 font-black uppercase tracking-[0.2em] mt-1 leading-none">InfiAP Organizational Structure</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="relative group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-indigo-500 transition-colors" size={18} />
            <input
              type="text"
              placeholder="Search departments..."
              className="bg-white border border-slate-100 rounded-2xl pl-12 pr-6 py-3.5 text-sm font-bold outline-none focus:ring-4 focus:ring-indigo-500/5 focus:border-indigo-500/20 transition-all w-[300px] shadow-soft"
            />
          </div>
          <button
            onClick={() => navigate('/admin/department-management/create')}
            className="flex items-center gap-3 px-8 py-4 bg-linear-to-r from-[#4E63F0] to-[#6855E8] text-white rounded-2xl shadow-xl shadow-indigo-100 hover:shadow-indigo-200 hover:-translate-y-1 transition-all active:scale-95 text-xs font-black uppercase tracking-widest"
          >
            <Plus size={18} strokeWidth={3} />
            Create Department
          </button>
        </div>
      </div>

      {/* Overview Block */}
      <section className="px-2">
        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-6 block">Executive Overview</label>
        <div className="grid grid-cols-3 gap-10">
          {overviewStats.map((stat, idx) => (
            <div key={idx} className="p-10 bg-white rounded-[40px] border border-slate-50 shadow-soft flex items-center gap-8 group hover:shadow-2xl transition-all duration-500 hover:-translate-y-1.5">
              <div className={`w-20 h-20 rounded-[28px] ${stat.bg} ${stat.color} flex items-center justify-center group-hover:scale-110 transition-transform shadow-lg shadow-current/5`}>
                <stat.icon size={36} />
              </div>
              <div>
                <h3 className="text-4xl font-black text-slate-800 tracking-tighter leading-none mb-2">{stat.value}</h3>
                <p className="text-[8px] font-black text-slate-500 uppercase tracking-widest leading-none">{stat.label}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Main Grid */}
      <section className="px-2 pb-24 relative">
        <div className="flex items-center justify-between mb-8">
          <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Active Departments</label>
          <button className="text-[10px] font-black text-indigo-600 hover:underline transition-all uppercase tracking-widest">See All Resources</button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {departments.map((dept, idx) => (
            <div key={idx} className="p-10 bg-white rounded-[48px] border border-slate-50 shadow-soft transition-all duration-700 hover:shadow-3xl hover:-translate-y-2 group relative overflow-hidden">
              <div className="flex justify-between items-start mb-12 relative z-10">
                <div className={`px-5 py-2 rounded-full text-[10px] font-black tracking-[0.2em] uppercase 
                    ${dept.color === 'indigo' ? 'bg-indigo-50 text-indigo-500' :
                    dept.color === 'orange' ? 'bg-orange-50 text-orange-500' : 'bg-emerald-50 text-emerald-500'}`}>
                  {dept.sub}
                </div>
                <button className="text-slate-200 hover:text-slate-400 transition-colors p-2 hover:bg-slate-50 rounded-xl">
                  <MoreVertical size={20} />
                </button>
              </div>

              <div className="relative z-10 space-y-2 mb-10">
                <h3 className="text-3xl font-black text-slate-800 tracking-tight group-hover:text-indigo-600 transition-colors">{dept.name}</h3>
                <p className="text-sm font-bold text-slate-400 italic">Head: {dept.head}</p>
              </div>

              <div className="relative z-10 flex items-center gap-12 mb-12">
                <div className="flex flex-col">
                  <span className="flex items-center gap-2 text-indigo-500 mb-1">
                    <div className="w-2 h-2 rounded-full bg-current"></div>
                    <span className="text-lg font-black tracking-tight">{dept.teams}</span>
                  </span>
                  <span className="text-[8px] font-black text-slate-500 uppercase tracking-widest leading-none">Teams</span>
                </div>
              </div>

              <button
                onClick={() => navigate('/admin/department-management/teams')}
                className="relative z-10 w-full py-5 bg-slate-50 text-slate-600 font-black rounded-[24px] group-hover:bg-indigo-600 group-hover:text-white group-hover:shadow-2xl group-hover:shadow-indigo-100 transition-all duration-500 text-[10px] uppercase tracking-widest"
              >
                View Teams
              </button>

              {/* Decorative Background Element */}
              <div className="absolute -bottom-20 -right-20 w-48 h-48 rounded-full bg-indigo-50/50 blur-3xl group-hover:scale-150 transition-transform duration-1000"></div>
            </div>
          ))}

          {/* New Dept Trigger */}
          <div
            onClick={() => navigate('/admin/department-management/create')}
            className="p-10 border-4 border-dashed border-slate-100 rounded-[48px] flex flex-col items-center justify-center group hover:border-indigo-200 hover:bg-indigo-50/20 transition-all duration-500 cursor-pointer"
          >
            <div className="w-20 h-20 rounded-full bg-white shadow-soft flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <Plus size={40} className="text-slate-200 group-hover:text-indigo-400" />
            </div>
            <p className="text-xs font-black text-slate-300 uppercase tracking-[0.2em] group-hover:text-indigo-500 transition-colors">Add Department</p>
          </div>
        </div>

        {/* Floating Minimal CTA */}
        <button
          onClick={() => navigate('/admin/department-management/create')}
          className="fixed bottom-12 right-12 w-20 h-20 bg-linear-to-br from-[#4E63F0] to-[#6855E8] text-white rounded-full shadow-[0_24px_48px_-12px_rgba(79,70,229,0.5)] hover:shadow-indigo-300 hover:-translate-y-2 transition-all active:scale-95 flex items-center justify-center group z-40"
        >
          <Plus size={32} strokeWidth={3} className="group-hover:rotate-90 transition-transform duration-500" />
        </button>
      </section>
    </div>
  );
};

export default Departments;
