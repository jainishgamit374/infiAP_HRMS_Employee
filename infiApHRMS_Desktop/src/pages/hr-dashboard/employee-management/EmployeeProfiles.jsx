import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  ArrowRight,
  Mail, 
  Phone, 
  MapPin, 
  Calendar, 
  ShieldCheck, 
  Clock, 
  Download,
  Edit3,
  MessageSquare,
  FileText,
  Activity,
  TrendingUp,
  User,
  Shield,
  Briefcase,
  Award,
  Zap,
  Layout,
  Star
} from 'lucide-react';
import { 
  Radar, 
  RadarChart, 
  PolarGrid, 
  PolarAngleAxis, 
  PolarRadiusAxis, 
  ResponsiveContainer 
} from 'recharts';
import { useEmployeeContext } from '../../../context/EmployeeContext';
import { getEmployeeProfile } from '../../../services/hrApi';

const EmployeeProfiles = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { employees } = useEmployeeContext();

  const [employee, setEmployee] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true);
      try {
        const res = await getEmployeeProfile(id);
        const data = res.data?.data;
        if (data) {
          setEmployee({
            id: data._id || data.id,
            name: data.name,
            role: data.role || 'Employee',
            email: data.email,
            phone: data.phone || '+91 00000 00000',
            location: data.location || 'Remote',
            department: data.department || 'General',
            manager: data.manager?.name || 'Not Assigned',
            joiningDate: data.joiningDate ? new Date(data.joiningDate).toLocaleDateString() : 'N/A',
            status: data.status || 'Active',
            avatar: data.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(data.name || 'User')}`,
            banner: 'https://images.unsplash.com/photo-1557683316-973673baf926?q=80&w=2000&auto=format&fit=crop'
          });
        }
      } catch (err) {
        console.error('Failed to load profile, using context fallback:', err);
        // Fallback to context
        const ctxEmp = employees.find(emp => String(emp.id) === String(id));
        if (ctxEmp) {
          setEmployee({ ...ctxEmp, avatar: ctxEmp.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(ctxEmp.name || 'User')}` });
        } else {
          setEmployee({
            id: id || 'EMP-1024',
            name: 'Arjun Mehta',
            role: 'Principal Engineer',
            email: 'arjun.mehta@hrms.in',
            phone: '+91 98765 01024',
            location: 'Mumbai, Maharashtra',
            department: 'Engineering',
            manager: 'Sneha Desai',
            joiningDate: 'Dec 12, 2022',
            status: 'Active',
            avatar: 'https://i.pravatar.cc/150?u=arjun',
            banner: 'https://images.unsplash.com/photo-1557683316-973673baf926?q=80&w=2000&auto=format&fit=crop'
          });
        }
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchProfile();
  }, [id, employees]);

  if (loading || !employee) {
    return <div className="p-8 text-center text-slate-400 font-black uppercase tracking-widest">Loading Profile Node...</div>;
  }

  const activity = [
    { title: 'Project "Delta" submitted', time: '2 hours ago', type: 'Work' },
    { title: 'Information updated by HR', time: 'Yesterday', type: 'System' },
    { title: 'Onboarding process completed', time: 'Dec 2022', type: 'HR' }
  ];

  const skillData = [
    { subject: 'Technical', A: 95, fullMark: 150 },
    { subject: 'Leadership', A: 85, fullMark: 150 },
    { subject: 'Ops', A: 70, fullMark: 150 },
    { subject: 'Compliance', A: 90, fullMark: 150 },
    { subject: 'Innovation', A: 80, fullMark: 150 }
  ];

  return (
    <div className="flex flex-col h-[calc(100vh-120px)] w-full gap-8 animate-in fade-in slide-in-from-bottom-4 duration-700 relative pt-4 overflow-hidden">
      
      {/* Header System */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 shrink-0">
        <div className="flex items-center gap-6">
          <button 
            onClick={() => navigate('/employees')}
            className="p-3 bg-white border border-slate-100 text-slate-400 hover:text-indigo-600 rounded-2xl shadow-sm transition-all active:scale-90"
          >
            <ArrowLeft size={20} />
          </button>
          <div>
            <h1 className="text-4xl font-black text-slate-800 tracking-tight leading-none mb-2 underline decoration-indigo-300 underline-offset-12">Staff Intelligence Profile</h1>
            <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mt-4">Forensic Identity Analysis & Professional IQ Diagnostic</p>
          </div>
        </div>
        <div className="flex items-center gap-3 self-start lg:self-center">
          <button className="px-8 py-3 bg-white border border-slate-100 text-slate-400 font-black text-[10px] uppercase rounded-2xl hover:bg-slate-50 transition-all shadow-sm active:scale-95">
             Export Record
          </button>
          <button 
            onClick={() => navigate(`/employees/edit/${employee.id}`)}
            className="px-10 py-3 bg-slate-900 text-white font-black rounded-2xl hover:bg-slate-800 transition-all shadow-xl shadow-slate-200 uppercase tracking-widest text-[10px]"
          >
             Modify Identity
          </button>
        </div>
      </div>

      {/* Main Workspace Grid */}
      <div className="flex-1 grid grid-cols-1 xl:grid-cols-4 gap-8 overflow-hidden min-h-0">
        
        {/* 1. SIDEBAR: Profile Metrics */}
        <div className="xl:col-span-1 flex flex-col gap-6 overflow-y-auto no-scrollbar pb-10">
           
           <div className="card-soft bg-white p-8 border-slate-100 shadow-soft">
              <div className="flex items-center justify-between mb-8">
                 <h3 className="text-xs font-black text-slate-800 uppercase tracking-widest">Professional IQ</h3>
                 <Award size={20} className="text-indigo-500" />
              </div>
              <div className="h-48 w-full">
                 <ResponsiveContainer width="100%" height="100%">
                   <RadarChart cx="50%" cy="50%" outerRadius="80%" data={skillData}>
                      <PolarGrid stroke="#f1f5f9" />
                      <PolarAngleAxis dataKey="subject" tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 800 }} />
                      <Radar name="Employee" dataKey="A" stroke="#6366f1" fill="#6366f1" fillOpacity={0.1} strokeWidth={3} />
                   </RadarChart>
                 </ResponsiveContainer>
              </div>
              <div className="mt-6 flex items-end justify-between">
                 <div>
                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Aggregate Rating</p>
                    <p className="text-2xl font-black text-slate-800 tracking-tighter">9.2 / 10</p>
                 </div>
                 <span className="px-3 py-1 bg-indigo-50 text-indigo-600 text-[10px] font-black rounded-lg">Top 5%</span>
              </div>
           </div>

           <div className="space-y-4">
              {[
                { label: 'Attendance Reliability', value: '98%', icon: Clock, color: 'text-emerald-500' },
                { label: 'Project Throughput', value: '14 Nodes', icon: Zap, color: 'text-orange-500' },
              ].map((stat, i) => (
                <div key={i} className="card-soft bg-white p-6 flex items-center gap-4 hover:border-indigo-100 transition-all cursor-crosshair">
                   <div className={`p-3 bg-slate-50 rounded-2xl ${stat.color} shadow-inner`}><stat.icon size={20} /></div>
                   <div>
                      <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">{stat.label}</p>
                      <p className="text-lg font-black text-slate-800 tracking-tighter leading-none">{stat.value}</p>
                   </div>
                </div>
              ))}
           </div>

           <div className="card-soft bg-slate-900 p-8 border-none text-white relative overflow-hidden group mt-auto">
              <div className="relative z-10">
                 <Shield className="mb-4 text-indigo-400" size={24} />
                 <h4 className="text-sm font-black uppercase tracking-widest leading-tight mb-2">Access Credentials</h4>
                 <p className="text-[10px] opacity-60 font-medium leading-relaxed uppercase tracking-widest mb-6">Security clearance level: L4 (Administrative Overseer).</p>
                 <button className="w-full py-3 bg-white/10 hover:bg-white/20 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all">Revoke Logic</button>
              </div>
              <div className="absolute -right-4 -bottom-4 w-32 h-32 bg-indigo-600/20 rounded-full blur-3xl group-hover:scale-150 transition-transform"></div>
           </div>
        </div>

        {/* 2. MAIN HUB: Diagnostic Workspace */}
        <div className="xl:col-span-3 flex flex-col min-h-0 bg-white border border-slate-100 rounded-[44px] shadow-soft overflow-hidden">
           
           <div className="flex-1 overflow-y-auto no-scrollbar">
              
              {/* Profile Bio Card */}
              <div className="p-10 border-b border-slate-50 bg-slate-50/20">
                 <div className="flex flex-col md:flex-row gap-10">
                    <div className="w-48 h-48 rounded-[48px] overflow-hidden border-8 border-white shadow-2xl bg-white shrink-0">
                       <img src={employee.avatar} alt="" className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1 pt-4">
                       <div className="flex items-center gap-4 mb-3">
                          <h2 className="text-3xl font-black text-slate-800 tracking-tight leading-none uppercase">{employee.name}</h2>
                          <span className="px-3 py-1 bg-emerald-50 text-emerald-600 text-[10px] font-black rounded-lg uppercase tracking-widest border border-emerald-100">Live Identity</span>
                       </div>
                       <p className="text-indigo-600 font-black text-sm uppercase tracking-widest mb-8">{employee.role} • {employee.department} Hub</p>
                       
                       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                          {[
                            { label: 'Email Node', value: employee.email, icon: Mail },
                            { label: 'Work Center', value: employee.location, icon: MapPin },
                            { label: 'Manager Node', value: employee.manager, icon: User },
                          ].map((hub, i) => (
                            <div key={i} className="flex flex-col gap-1.5">
                               <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{hub.label}</p>
                               <div className="flex items-center gap-2 text-slate-700 font-bold text-[11px]">
                                  <hub.icon size={14} className="text-indigo-400" />
                                  {hub.value}
                               </div>
                            </div>
                          ))}
                       </div>
                    </div>
                 </div>
              </div>

              {/* Forensic Records */}
              <div className="p-10 space-y-12">
                 <section className="animate-in fade-in slide-in-from-bottom-8 duration-700 delay-[200ms] fill-mode-both">
                    <div className="flex items-center gap-3 mb-8">
                       <div className="p-3 bg-slate-50 text-slate-400 rounded-2xl"><TrendingUp size={18} /></div>
                       <h3 className="text-xs font-black text-slate-800 uppercase tracking-widest">Growth Analytics</h3>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                       {['Technical Node', 'Leadership Path', 'Operational IQ'].map((t, idx) => (
                          <div 
                             key={t} 
                             style={{ animationDelay: `${400 + (idx * 100)}ms` }}
                             className="p-6 bg-white border border-slate-100 rounded-[24px] hover:border-indigo-100 transition-all group animate-in fade-in slide-in-from-right-4 fill-mode-both"
                          >
                             <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1 group-hover:text-indigo-500 transition-colors uppercase">{t}</p>
                             <p className="text-xl font-black text-slate-800 tracking-tighter">Accelerated</p>
                          </div>
                       ))}
                    </div>
                 </section>

                 <section className="animate-in fade-in slide-in-from-bottom-8 duration-700 delay-[400ms] fill-mode-both">
                    <div className="flex items-center gap-3 mb-8">
                       <div className="p-3 bg-slate-50 text-slate-400 rounded-2xl"><Activity size={18} /></div>
                       <h3 className="text-xs font-black text-slate-800 uppercase tracking-widest">Identity Timeline</h3>
                    </div>
                    <div className="space-y-6">
                       {activity.map((item, i) => (
                          <div 
                             key={i} 
                             style={{ animationDelay: `${600 + (i * 100)}ms` }}
                             className="flex items-center gap-6 p-6 hover:bg-white border border-transparent hover:border-slate-100 rounded-3xl transition-all group cursor-crosshair animate-in fade-in slide-in-from-left-4 fill-mode-both"
                          >
                             <div className="w-12 h-12 bg-white border border-slate-100 text-slate-400 rounded-2xl flex items-center justify-center shadow-sm group-hover:scale-110 transition-all">
                                <FileText size={20} />
                             </div>
                             <div>
                                <p className="text-sm font-black text-slate-800 tracking-tight leading-none mb-1 group-hover:text-indigo-600 transition-colors uppercase">{item.title}</p>
                                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{item.time} • <span className="text-indigo-400 font-black">{item.type} NODE</span></p>
                             </div>
                             <ArrowRight size={16} className="ml-auto text-slate-200 group-hover:text-indigo-400 transition-all group-hover:translate-x-1" />
                          </div>
                       ))}
                    </div>
                 </section>
              </div>

           </div>

           {/* Persistence Footer */}
           <div className="px-10 py-6 bg-slate-900 border-t border-white/5 flex items-center justify-between text-white shrink-0">
              <div className="flex items-center gap-4">
                 <div className="w-2 h-2 bg-indigo-500 rounded-full animate-pulse"></div>
                 <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Identity Master Record: #{employee.id} Verified</p>
              </div>
              <div className="flex items-center gap-6">
                 <button className="px-6 py-2.5 bg-white/10 hover:bg-white/20 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all">Download Dossier</button>
              </div>
           </div>

        </div>
      </div>
    </div>
  );
};

export default EmployeeProfiles;
