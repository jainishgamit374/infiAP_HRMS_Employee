import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAdminDashboard } from '../../../context/AdminDashboardContext';
import { 
  Users, 
  Search, 
  Plus, 
  ChevronRight, 
  ArrowLeft,
  Filter,
  MoreVertical,
  ShieldCheck,
  Zap,
  LayoutGrid,
  Bell
} from 'lucide-react';

const ManageTeams = () => {
  const navigate = useNavigate();
  const { teams, fetchTeams } = useAdminDashboard();
  const [activeTab, setActiveTab] = useState('All Teams');

  useEffect(() => {
    fetchTeams();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const tabs = ['All Teams', 'Development', 'QA & Testing', 'Design'];

  const filteredTeams = activeTab === 'All Teams' ? teams : teams.filter(t => t.type === activeTab);

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-20">
      
      {/* Dynamic Header Section */}
      <div className="bg-white rounded-[40px] p-10 border border-slate-50 shadow-soft flex flex-col md:flex-row md:items-center justify-between gap-8">
        <div className="flex items-center gap-6">
          <button 
            onClick={() => navigate('/admin/departments')}
            className="w-14 h-14 rounded-2xl bg-slate-50 text-slate-400 flex items-center justify-center hover:bg-indigo-50 hover:text-indigo-600 transition-all group"
          >
            <ArrowLeft size={24} className="group-hover:-translate-x-1 transition-transform" />
          </button>
          <div>
            <h1 className="text-4xl font-black text-slate-800 tracking-tight leading-none mb-2 text-left">Department Teams</h1>
            <p className="text-[10px] text-slate-400 font-black uppercase tracking-[0.2em] mt-1 leading-none text-left flex items-center gap-2">
              Engineering Department
              <span className="w-1 h-1 rounded-full bg-slate-300"></span>
              <span className="text-indigo-500">20 Teams Total</span>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="relative group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
            <input 
              type="text" 
              placeholder="Search teams or leads..." 
              className="bg-slate-50 border border-slate-100 rounded-2xl pl-12 pr-6 py-3.5 text-sm font-bold outline-none focus:ring-4 focus:ring-indigo-500/5 focus:border-indigo-500/20 focus:bg-white transition-all w-[320px]"
            />
          </div>
          <button className="p-4 bg-slate-50 text-slate-400 rounded-2xl hover:bg-slate-100 transition-all relative">
            <Bell size={20} />
            <span className="absolute top-4 right-4 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
          </button>
        </div>
      </div>

      <div className="flex items-center gap-3 overflow-x-auto no-scrollbar py-2">
        {tabs.map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-8 py-3.5 rounded-full text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap
              ${activeTab === tab 
                ? 'bg-slate-900 text-white shadow-xl shadow-slate-200 -translate-y-1' 
                : 'bg-white text-slate-400 border border-slate-100 hover:bg-slate-50 hover:text-slate-600'}`}
          >
            {tab}
          </button>
        ))}
        <button className="ml-auto flex items-center gap-2 text-[10px] font-black text-indigo-600 uppercase tracking-widest hover:underline">
          <Filter size={14} />
          Advanced Filters
        </button>
      </div>

      {/* Teams Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-10">
        {filteredTeams.map((team, idx) => (
          <div key={idx} className="bg-white rounded-[48px] border border-slate-50 shadow-soft overflow-hidden group hover:shadow-2xl transition-all duration-500 flex flex-col">
            <div className="p-10 flex-1">
              <div className="flex justify-between items-start mb-8">
                <div>
                  <h3 className="text-2xl font-black text-slate-800 tracking-tight group-hover:text-indigo-600 transition-colors mb-1">{team.name}</h3>
                  <p className="text-sm font-bold text-slate-400 italic">Lead: {team.lead}</p>
                </div>
                <div className="flex gap-2">
                  <button className="p-3 bg-slate-50 text-slate-300 rounded-xl hover:text-indigo-600 hover:bg-indigo-50 transition-all">
                    <ShieldCheck size={18} />
                  </button>
                  <button className="p-3 bg-slate-50 text-slate-300 rounded-xl hover:text-red-500 hover:bg-red-50 transition-all">
                    <Zap size={18} />
                  </button>
                </div>
              </div>

              <div className="flex items-center gap-6 mb-10">
                <div className="px-6 py-4 bg-indigo-50 rounded-[20px] flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-white text-indigo-600 flex items-center justify-center shadow-sm">
                    <Users size={20} />
                  </div>
                  <div>
                    <h4 className="text-lg font-black text-slate-800 leading-none mb-1">{team.members}</h4>
                    <p className="text-[8px] font-black text-slate-500 uppercase tracking-widest leading-none">Members</p>
                  </div>
                </div>
                <button className="flex-1 py-5 bg-slate-50 text-slate-500 hover:bg-indigo-600 hover:text-white transition-all rounded-[20px] font-black text-[10px] uppercase tracking-widest shadow-lg shadow-transparent hover:shadow-indigo-100 flex items-center justify-center gap-3">
                  View Team Details
                  <ChevronRight size={16} />
                </button>
              </div>

              {/* Key Members Sub-Section */}
              <div className="space-y-6 pt-8 border-t border-slate-50">
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 block px-2">Key Members Nodes</label>
                <div className="space-y-4">
                  {team.keyMembers.map((member, midx) => (
                    <div key={midx} className="flex items-center justify-between p-4 bg-slate-50/50 hover:bg-white border border-transparent hover:border-slate-100 rounded-2xl transition-all cursor-pointer group/member">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-white shadow-sm transition-transform group-hover/member:scale-110">
                          <img src={member.img} alt={member.name} />
                        </div>
                        <div>
                          <p className="text-sm font-black text-slate-800 group-hover/member:text-indigo-600 transition-colors">{member.name}</p>
                          <p className="text-[8px] font-black text-slate-500 uppercase tracking-widest leading-none">{member.role}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 px-3 py-1 bg-green-50 text-green-600 rounded-full">
                        <div className="w-1 h-1 rounded-full bg-current animate-pulse"></div>
                        <span className="text-[9px] font-black uppercase tracking-[0.2em]">{member.status}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Floating CTA */}
      <button 
        onClick={() => navigate('/admin/department-management/teams/create')}
        className="fixed bottom-12 right-12 flex items-center gap-4 px-10 py-5 bg-slate-900 text-white rounded-full shadow-2xl hover:shadow-indigo-200 hover:-translate-y-2 transition-all active:scale-95 group z-40"
      >
        <div className="w-8 h-8 rounded-xl bg-white/10 flex items-center justify-center group-hover:rotate-90 transition-transform duration-500">
          <Plus size={20} strokeWidth={3} />
        </div>
        <span className="text-[10px] font-black uppercase tracking-widest">Create Team</span>
      </button>

    </div>
  );
};

export default ManageTeams;
