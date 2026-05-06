import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Briefcase, 
  Users, 
  Calendar, 
  CheckCircle2, 
  Plus, 
  MoreVertical,
  Bell,
  Search,
  ChevronDown
} from 'lucide-react';
import { useAdminDashboard } from '../../../context/AdminDashboardContext';

const RecruitmentHub = () => {
  const navigate = useNavigate();
  const { jobs, totals, fetchJobs } = useAdminDashboard();

  useEffect(() => {
    fetchJobs();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const overviewStats = [
    { label: 'Open Jobs', value: totals.activeCount.toString(), trend: '+2%', icon: Briefcase, color: 'text-indigo-600', bg: 'bg-indigo-50' },
    { label: 'Total Candidates', value: totals.totalApplicants.toString(), trend: '-5%', icon: Users, color: 'text-purple-600', bg: 'bg-purple-50' },
    { label: 'Interviews', value: '24', trend: '+12%', icon: Calendar, color: 'text-orange-600', bg: 'bg-orange-50' },
    { label: 'Filled', value: '8', trend: '+4%', icon: CheckCircle2, color: 'text-emerald-600', bg: 'bg-emerald-50' },
  ];



  return (
    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-20">
      {/* Premium Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black text-slate-800 tracking-tight leading-none mb-2 underline decoration-indigo-300 underline-offset-4 uppercase">InfiAP Recruitment</h1>
          <p className="text-[10px] text-slate-400 font-black uppercase tracking-[0.2em] mt-1 leading-none">Welcome back, Sarah Nodes</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="relative group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-indigo-500 transition-colors" size={18} />
            <input 
              type="text" 
              placeholder="Search everything..." 
              className="bg-white border border-slate-100 rounded-2xl pl-12 pr-6 py-3.5 text-sm font-bold outline-none focus:ring-4 focus:ring-indigo-500/5 transition-all w-[300px] shadow-soft"
            />
          </div>
          <button className="p-4 bg-white border border-slate-100 rounded-2xl text-slate-400 hover:text-indigo-600 transition-all shadow-soft active:scale-95">
            <Bell size={22} />
          </button>
        </div>
      </div>

      {/* Recruitment Overview Section */}
      <section>
        <div className="flex items-center justify-between mb-8 px-2">
          <h2 className="text-xs font-black text-slate-800 uppercase tracking-widest leading-none">Recruitment Overview</h2>
          <button 
            onClick={() => navigate('/admin/recruitment-control/analytics')}
            className="text-[10px] font-black text-indigo-600 hover:underline transition-all uppercase tracking-widest"
          >
            View Statistical Reports
          </button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {overviewStats.map((stat, idx) => (
            <div key={idx} className="p-10 bg-white rounded-[40px] border border-slate-50 shadow-soft group hover:shadow-2xl transition-all duration-500 hover:-translate-y-1.5 border-b-4 border-b-transparent hover:border-b-indigo-500">
              <div className="flex items-center justify-between mb-8">
                <div className={`w-16 h-16 rounded-[24px] ${stat.bg} ${stat.color} flex items-center justify-center group-hover:scale-110 transition-transform shadow-lg shadow-current/5`}>
                  <stat.icon size={28} />
                </div>
                <span className={`text-xs font-black ${stat.trend.startsWith('+') ? 'text-emerald-500' : 'text-rose-500'} bg-slate-50 px-3 py-1.5 rounded-full`}>
                  {stat.trend}
                </span>
              </div>
              <div>
                <p className="text-[8px] font-black text-slate-500 uppercase tracking-widest mb-1 leading-none">Metric Node</p>
                <h3 className="text-4xl font-black text-slate-800 tracking-tighter leading-none">{stat.value}</h3>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Active Job Postings Section */}
      <section className="relative">
        <div className="flex items-center justify-between mb-8 px-2">
          <div className="flex items-center gap-4">
             <h2 className="text-xs font-black text-slate-800 uppercase tracking-widest leading-none">Active Job Postings Nodes</h2>
             <span className="bg-indigo-50 text-indigo-600 text-[9px] font-black px-3 py-1.5 rounded-full uppercase tracking-widest">{jobs.length} Active</span>
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
          {jobs.map((job) => (
            <div key={job.id} className="bg-white p-10 rounded-[48px] border border-slate-50 shadow-soft hover:shadow-3xl transition-all duration-700 hover:-translate-y-2 group relative overflow-hidden">
              <div className="flex justify-between items-start mb-10 relative z-10">
                <div>
                  <h3 className="text-2xl font-black text-slate-800 tracking-tight mb-1 group-hover:text-indigo-600 transition-colors uppercase">{job.title}</h3>
                  <p className="text-sm font-bold text-slate-400 italic">{job.department} • {job.location || 'Remote'}</p>
                </div>
                <button className="text-slate-200 hover:text-slate-400 transition-colors p-2 hover:bg-slate-50 rounded-xl">
                  <MoreVertical size={20} />
                </button>
              </div>
              
              <div className="flex items-center gap-6 mb-12 relative z-10">
                <div className="flex -space-x-4">
                  {(job.avatars || [
                     'https://i.pravatar.cc/150?u=a',
                     'https://i.pravatar.cc/150?u=b',
                     'https://i.pravatar.cc/150?u=c'
                  ]).slice(0, 3).map((avatar, i) => (
                    <div key={i} className="w-12 h-12 rounded-full border-4 border-white overflow-hidden shadow-lg group-hover:scale-110 transition-transform" style={{ transitionDelay: `${i * 100}ms` }}>
                      <img src={avatar} alt="" className="w-full h-full object-cover" />
                    </div>
                  ))}
                  <div className="w-12 h-12 rounded-full border-4 border-white bg-slate-50 flex items-center justify-center text-[10px] font-black text-slate-400">
                    +{job.applicants + (job.avatars ? 0 : 5)}
                  </div>
                </div>
                <span className="text-sm font-black text-slate-300 uppercase tracking-widest">{job.applicants + (job.avatars ? 0 : 5)} Applicants</span>
              </div>

              <div className="flex items-center gap-4 relative z-10">
                <button 
                  onClick={() => navigate('/admin/recruitment-control/tracking')}
                  className="flex-1 py-5 bg-[#4E63F0] text-white text-[10px] font-black uppercase tracking-widest rounded-[24px] shadow-2xl shadow-indigo-100 hover:bg-indigo-700 hover:shadow-indigo-200 transition-all active:scale-95"
                >
                  View Applicants
                </button>
                <button 
                  onClick={() => navigate('/admin/recruitment-control/create')}
                  className="px-8 py-5 border-2 border-slate-100 text-slate-400 hover:border-indigo-500 hover:text-indigo-500 text-[10px] font-black uppercase tracking-widest rounded-[24px] transition-all hover:bg-indigo-50/50 active:scale-95"
                >
                  Edit
                </button>
              </div>

              {/* Decorative Bakground Gradient */}
              <div className="absolute -bottom-20 -right-20 w-48 h-48 bg-indigo-50/50 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-1000"></div>
            </div>
          ))}
        </div>

        {/* Floating Add Button */}
        <button 
          onClick={() => navigate('/admin/recruitment-control/create')}
          className="fixed bottom-12 right-12 w-20 h-20 bg-linear-to-br from-[#4E63F0] to-[#6855E8] text-white rounded-full shadow-[0_24px_48px_-12px_rgba(79,70,229,0.5)] hover:shadow-indigo-300 hover:-translate-y-2 transition-all active:scale-95 flex items-center justify-center group z-40 transform hover:rotate-90 transition-transform duration-500"
        >
          <Plus size={36} strokeWidth={3} />
        </button>
      </section>
    </div>
  );
};

export default RecruitmentHub;
