import React, { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Users, 
  Clock, 
  Home, 
  UserMinus, 
  Search, 
  Download, 
  MoreHorizontal,
  MapPin,
  CheckCircle2,
  XCircle,
  Calendar,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  TrendingUp,
  BellRing,
  CheckCircle,
  X,
  AlertTriangle,
  ArrowRight,
  Loader2
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  ResponsiveContainer,
  Cell,
  Tooltip,
  XAxis
} from 'recharts';
import { getAttendanceDailyOverview, getAttendanceRecords, getAttendanceCorrectionRequests, reviewAttendanceCorrection } from '../../../services/hrApi';

const AttendanceDashboard = () => {
  const navigate = useNavigate();

  // --- STATE ---
  const [notification, setNotification] = useState(null);
  const [selectedDate, setSelectedDate] = useState(new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }));
  const [searchQuery, setSearchQuery] = useState('');
  const [isExporting, setIsExporting] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [loading, setLoading] = useState(true);
  
  const [correctionRequests, setCorrectionRequests] = useState([]);
  const [attendanceLogs, setAttendanceLogs] = useState([]);
  const [stats, setStats] = useState([
    { id: 'stat-1', title: 'Present Today', value: '—', change: '--', icon: Users, color: 'text-green-600', bg: 'bg-green-50' },
    { id: 'stat-2', title: 'Absent', value: '—', change: '--', icon: UserMinus, color: 'text-rose-600', bg: 'bg-rose-50' },
    { id: 'stat-3', title: 'Late Arrivals', value: '—', change: '--', icon: Clock, color: 'text-orange-600', bg: 'bg-orange-50' },
    { id: 'stat-4', title: 'WFH Mode', value: '—', change: '--', icon: Home, color: 'text-indigo-600', bg: 'bg-indigo-50' },
  ]);

  // Fetch data from API
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [overviewRes, recordsRes, correctionsRes] = await Promise.all([
          getAttendanceDailyOverview().catch(() => ({ data: {} })),
          getAttendanceRecords({ limit: 20 }).catch(() => ({ data: {} })),
          getAttendanceCorrectionRequests({ status: 'Pending' }).catch(() => ({ data: {} })),
        ]);

        const overview = overviewRes.data?.data;
        if (overview) {
          setStats([
            { id: 'stat-1', title: 'Present Today', value: String(overview.present || 0), change: overview.presentChange || '+0%', icon: Users, color: 'text-green-600', bg: 'bg-green-50' },
            { id: 'stat-2', title: 'Absent', value: String(overview.absent || 0), change: overview.absentChange || '0%', icon: UserMinus, color: 'text-rose-600', bg: 'bg-rose-50' },
            { id: 'stat-3', title: 'Late Arrivals', value: String(overview.late || 0), change: overview.lateChange || '0%', icon: Clock, color: 'text-orange-600', bg: 'bg-orange-50' },
            { id: 'stat-4', title: 'WFH Mode', value: String(overview.wfh || 0), change: overview.wfhChange || 'Normal', icon: Home, color: 'text-indigo-600', bg: 'bg-indigo-50' },
          ]);
        }

        const records = recordsRes.data?.data || [];
        if (records.length > 0) {
          setAttendanceLogs(records.map((r, i) => ({
            id: r._id || `log-${i}`,
            name: r.employeeName || r.name || 'Unknown',
            role: r.role || r.designation || 'Employee',
            checkIn: r.checkIn || '--:--',
            checkOut: r.checkOut || '--:--',
            status: r.status || 'On Time',
            location: r.location || 'Office',
            latLong: r.latLong || '',
            type: r.type || 'Office',
            avatar: r.avatar || `https://i.pravatar.cc/150?u=${(r.employeeName || r.name || 'user').split(' ')[0].toLowerCase()}`,
          })));
        } else {
          // Fallback data
          setAttendanceLogs([
            { id: 'log-1', name: 'Arjun Mehta', role: 'Principal Engineer', checkIn: '08:52 AM', checkOut: '--:--', status: 'On Time', location: 'Remote', latLong: '40.7128°N, 74.0060°W', type: 'Remote', avatar: 'https://i.pravatar.cc/150?u=arjun' },
            { id: 'log-2', name: 'Priya Sharma', role: 'UX Designer', checkIn: '09:18 AM', checkOut: '--:--', status: 'Late (18m)', location: 'Office', latLong: 'BKC, Mumbai', type: 'Office', avatar: 'https://i.pravatar.cc/150?u=priya' },
          ]);
        }

        const corrections = correctionsRes.data?.data || [];
        if (corrections.length > 0) {
          setCorrectionRequests(corrections.map(c => ({
            id: c._id || c.id,
            name: c.employeeName || c.name || 'Unknown',
            time: c.submittedAt ? new Date(c.submittedAt).toLocaleString() : 'Recently',
            reason: c.reason || 'Correction',
            comment: c.comment || c.description || '',
            avatar: c.avatar || `https://i.pravatar.cc/150?u=${(c.employeeName || c.name || 'user').split(' ')[0].toLowerCase()}`,
          })));
        } else {
          setCorrectionRequests([
            { id: 'corr-1', name: 'Liam Wilson', time: '10m ago', reason: 'Missed Punch', comment: '"Device battery died at 5:00 PM."', avatar: 'https://i.pravatar.cc/150?u=liam' },
          ]);
        }
      } catch (err) {
        console.error('Attendance fetch failed:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // --- DYNAMIC SEARCH LOGIC ---
  const filteredLogs = useMemo(() => {
    return attendanceLogs.filter(log => 
      log.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.status.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery, attendanceLogs]);

  // --- HANDLERS ---
  const showNotification = (msg) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3000);
  };

  const handleExport = () => {
    setIsExporting(true);
    setTimeout(() => {
      setIsExporting(false);
      showNotification("Attendance report (CSV) successfully exported.");
    }, 1500);
  };

  const handleCorrection = async (id, action, name) => {
    try {
      await reviewAttendanceCorrection({ correctionId: id, action: action.toLowerCase() });
    } catch (err) {
      console.error('Correction review failed:', err);
    }
    setCorrectionRequests(prev => prev.filter(req => req.id !== id));
    showNotification(`Attendance request for ${name} ${action} successfully.`);
  };

  const chartData = [
    { day: 'Mon', value: 92 }, { day: 'Tue', value: 95 }, { day: 'Wed', value: 98 }, 
    { day: 'Thu', value: 94 }, { day: 'Fri', value: 98.2 }, { day: 'Sat', value: 10 }, { day: 'Sun', value: 5 },
  ];

  return (
    <div className="flex flex-col xl:flex-row gap-8 w-full animate-in fade-in slide-in-from-bottom-4 duration-700 pb-20 mt-4 px-1">
      
      {/* Date Picker Modal */}
      {showDatePicker && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-6">
           <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-md animate-in fade-in" onClick={() => setShowDatePicker(false)}></div>
           <div className="bg-white rounded-[32px] p-8 max-w-sm w-full relative z-[210] shadow-2xl border border-slate-100 animate-in zoom-in-95">
              <div className="flex items-center justify-between mb-8">
                 <h3 className="text-xl font-black text-slate-800 tracking-tight">Select Log Date</h3>
                 <button onClick={() => setShowDatePicker(false)} className="p-2 hover:bg-slate-100 rounded-full transition-colors"><X size={20} className="text-slate-400" /></button>
              </div>
              <div className="space-y-3">
                 {['24 Oct 2023', '23 Oct 2023', '22 Oct 2023', '21 Oct 2023'].map(date => (
                    <button 
                      key={date}
                      onClick={() => { setSelectedDate(date); setShowDatePicker(false); showNotification(`Attendance logs loaded for ${date}`); }}
                      className={`w-full p-4 rounded-2xl font-bold flex items-center justify-between transition-all ${selectedDate === date ? 'bg-primary-600 text-white shadow-lg' : 'bg-slate-50 text-slate-600 hover:bg-slate-100'}`}
                    >
                       {date}
                       {selectedDate === date && <CheckCircle size={18} />}
                    </button>
                 ))}
              </div>
           </div>
        </div>
      )}

      {/* Notification Toast */}
      {notification && (
        <div className="fixed top-24 right-8 z-[100] animate-in slide-in-from-right-8 fade-in flex items-center gap-3 bg-slate-900 text-white px-6 py-4 rounded-2xl shadow-2xl border border-white/10">
          <BellRing size={20} className="text-primary-400" />
          <span className="text-sm font-bold tracking-tight">{notification}</span>
        </div>
      )}

      {/* --- MAIN CONTENT --- */}
      <div className="flex-1 space-y-8 min-w-0">
        
        {/* Page Header (Daily Overview - Mockup Style 1) */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-1">
            <h1 className="text-4xl font-black text-slate-800 tracking-tight leading-none mb-2">Attendance Console</h1>
            <p className="text-[10px] text-slate-400 font-black uppercase tracking-[0.2em] leading-none mt-1">Operational Logistics & Personnel Integrity Hub</p>
          </div>
          <div className="flex items-center gap-3 self-start lg:self-center">
             <div 
               onClick={() => setShowDatePicker(true)}
               className="flex items-center gap-4 bg-white border border-slate-100 px-5 py-3 rounded-2xl shadow-sm hover:border-slate-400 transition-all cursor-pointer group active:scale-95"
             >
                <Calendar size={18} className="text-primary-500 group-hover:scale-110 transition-transform" />
                <span className="text-sm font-black text-slate-700">{selectedDate}</span>
                <ChevronDown size={16} className="text-slate-300" />
             </div>
             <button 
               onClick={handleExport}
               disabled={isExporting}
               className="flex items-center gap-2 px-6 py-3 bg-slate-900 text-white font-black rounded-2xl hover:bg-slate-800 hover:shadow-xl transition-all active:scale-95 disabled:bg-slate-300 min-w-[160px] justify-center shadow-lg shadow-slate-200"
             >
                {isExporting ? (
                  <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                ) : (
                  <>
                    <Download size={18} />
                    Export Report
                  </>
                )}
             </button>
          </div>
        </div>

        {/* Global Alert (Mockup Style 3 Notifications) */}
        <div className="p-5 bg-orange-50 border border-orange-100 rounded-[28px] flex items-center gap-5 shadow-sm animate-in slide-in-from-top-4 duration-1000">
           <div className="p-3 bg-white rounded-2xl shadow-sm text-orange-500">
              <AlertTriangle size={24} />
           </div>
           <div>
              <p className="text-sm font-black text-slate-800">Late check-in detected</p>
              <p className="text-xs font-bold text-orange-600/80">5 employees from Sales checked in after 09:30 AM.</p>
           </div>
           <button className="ml-auto p-2 hover:bg-orange-100 rounded-xl transition-colors text-orange-400"><X size={18} /></button>
        </div>

        {/* Stats Grid (Mockup Style 1 Metrics) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat) => (
            <div key={stat.id} className="card-soft group hover:translate-y-[-4px] transition-all duration-300 border-slate-100 hover:border-primary-100 bg-white shadow-soft p-8">
               <div className="flex items-start justify-between mb-6">
                  <div className={`p-4 rounded-[22px] ${stat.bg} ${stat.color} group-hover:rotate-12 transition-transform shadow-inner`}>
                    <stat.icon size={28} strokeWidth={2.5} />
                  </div>
                  <span className={`text-[10px] font-black px-3 py-1.5 rounded-xl border ${
                    stat.change.includes('+') ? 'bg-green-50 text-green-600 border-green-100' : 
                    stat.change.includes('-') ? 'bg-rose-50 text-rose-600 border-rose-100' : 'bg-slate-50 text-slate-400 border-slate-100'
                  }`}>
                    {stat.change}
                  </span>
               </div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-2">{stat.title}</p>
                <h3 className="text-4xl font-black text-slate-800 tracking-tighter mt-1">{stat.value}</h3>
            </div>
          ))}
        </div>

        {/* Activity Logs (Mockup Style 1 - Check-in Records) */}
        <div className="card-soft p-0 overflow-hidden border-slate-100 shadow-soft bg-white">
          <div className="px-8 py-6 border-b border-slate-50 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <h2 className="text-[11px] font-black text-slate-800 uppercase tracking-[0.2em]">Operational Punch Records</h2>
            <div className="flex items-center gap-3">
               <div className="relative group flex-1 md:flex-none">
                  <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-hover:text-primary-500 transition-colors" />
                  <input 
                    type="text" 
                    placeholder="Search logs..." 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="bg-slate-50 border border-slate-100 focus:border-primary-200 outline-none rounded-2xl pl-12 pr-5 py-2.5 text-sm font-bold text-slate-700 w-full md:w-64 transition-all" 
                  />
               </div>
               <button className="text-xs font-black text-primary-600 uppercase tracking-widest hover:underline">View All</button>
            </div>
          </div>

          <div className="overflow-x-auto min-h-[400px] no-scrollbar" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
            <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-50/50">
                  <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Employee</th>
                  <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Punch In</th>
                  <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Punch Out</th>
                  <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Mode</th>
                  <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] text-right">Settings</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {filteredLogs.map((log) => (
                  <tr key={log.id} className="group hover:bg-slate-50/30 transition-all duration-200">
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-[20px] overflow-hidden border-2 border-white shadow-md shrink-0 ring-4 ring-slate-50">
                          <img src={log.avatar} alt="" className="w-full h-full object-cover" />
                        </div>
                        <div>
                          <p className="text-sm font-black text-slate-800 tracking-tight leading-none mb-2 group-hover:text-primary-600 transition-colors uppercase">{log.name}</p>
                          <div className="flex items-center gap-1.5 text-indigo-400 font-black text-[9px] uppercase tracking-[0.1em]">
                             {log.role}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-6 font-bold">
                       <span className="text-sm text-slate-800 font-black">{log.checkIn}</span>
                       <p className={`text-[10px] font-black mt-1 uppercase tracking-tighter ${log.status.includes('Late') ? 'text-orange-500' : 'text-green-500'}`}>
                         {log.status}
                       </p>
                    </td>
                    <td className="px-6 py-6">
                      <span className="text-sm font-black text-slate-400">{log.checkOut}</span>
                    </td>
                    <td className="px-6 py-6">
                       <span className={`px-3 py-1.5 text-[9px] font-black uppercase tracking-wider rounded-xl border ${
                          log.type === 'Remote' ? 'bg-indigo-50 text-indigo-600 border-indigo-100' : 'bg-primary-50 text-primary-600 border-primary-100'
                       }`}>
                          {log.type}
                       </span>
                    </td>
                    <td className="px-8 py-6 text-right">
                       <button className="p-3 text-slate-300 hover:text-slate-800 hover:bg-white rounded-2xl transition-all border border-transparent hover:border-slate-100 shadow-sm">
                          <MoreHorizontal size={20} />
                       </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* --- RIGHT SIDEBAR (The Control Hub) --- */}
      <div className="w-full xl:w-[380px] space-y-8">
        
        {/* Correction Box (Mockup Style 4/5) */}
        <div className="card-soft relative overflow-hidden group bg-white shadow-soft">
          <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-[11px] font-black text-slate-800 uppercase tracking-[0.2em] mb-2">Correction Diagnostics</h2>
                <p className="text-[10px] text-slate-400 font-black uppercase tracking-[0.2em] leading-none">Pending Hub</p>
              </div>
             <span className="px-2.5 py-1 text-[10px] font-black rounded-2xl bg-slate-900 text-white uppercase tracking-widest">
               {correctionRequests.length} Tasks
             </span>
          </div>
          
          <div className="space-y-6">
            {correctionRequests.map((req) => (
              <div key={req.id} className="p-6 bg-slate-50 rounded-[32px] border border-slate-100 space-y-5 hover:shadow-2xl transition-all duration-500 animate-in zoom-in-95 group/card">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="relative">
                      <img src={req.avatar} alt="" className="w-11 h-11 rounded-2xl object-cover ring-4 ring-white shadow-md shadow-slate-100" />
                      <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-orange-500 rounded-full border-2 border-white"></div>
                    </div>
                    <div>
                      <p className="text-sm font-black text-slate-800 leading-none mb-1.5">{req.name}</p>
                      <p className="text-[10px] font-black text-primary-600 uppercase tracking-widest opacity-80">{req.reason}</p>
                    </div>
                  </div>
                </div>
                <p className="text-[11px] text-slate-500 font-bold italic leading-relaxed bg-white/80 p-5 rounded-[24px] border border-dashed border-slate-200 shadow-inner group-hover/card:bg-white transition-colors">
                  {req.comment}
                </p>
                  <div className="flex items-center gap-3">
                    <button 
                      onClick={() => handleCorrection(req.id, 'Applied', req.name)}
                      className="flex-1 py-3.5 bg-slate-900 text-white text-[11px] font-black rounded-2xl hover:bg-slate-800 transition-all shadow-xl shadow-slate-200 active:scale-95 flex items-center justify-center gap-2 group/btn"
                    >
                      Approve
                    </button>
                    <button 
                      onClick={() => navigate(`/attendance/correction/${req.id}`)}
                      className="p-3.5 bg-white border border-slate-200 text-slate-500 rounded-2xl hover:bg-slate-50 transition-all shadow-sm group/review active:scale-90"
                    >
                      <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                    </button>
                  </div>
              </div>
            ))}
          </div>
          
          <button 
            onClick={() => { setCorrectionRequests([]); showNotification(`${correctionRequests.length} tasks synchronized and archived.`); }}
            className="w-full mt-8 py-4 bg-primary-600 text-white text-[11px] font-black rounded-2xl hover:bg-primary-700 transition-all shadow-lg shadow-primary-50 uppercase tracking-[0.2em] active:scale-[0.98]"
          >
            Bulk Approve ({correctionRequests.length})
          </button>
        </div>

        {/* Weekly Progress Card */}
        <div className="card-soft bg-slate-900 border-none relative overflow-hidden text-white shadow-2xl p-8 min-h-[440px] flex flex-col">
           <div className="relative z-10 flex-1 flex flex-col">
              <div className="flex items-center justify-between mb-8">
                 <h3 className="text-[11px] font-black uppercase tracking-[0.2em] opacity-40">System Performance</h3>
                 <TrendingUp size={24} className="text-primary-500" strokeWidth={3} />
              </div>
              <div className="flex items-end gap-3 mb-10">
                 <span className="text-5xl font-black text-white tracking-tighter">98.2%</span>
                 <span className="text-xs font-black text-primary-500 mb-1.5 opacity-90">+0.4%</span>
              </div>
              
              <div className="flex-1 w-full min-h-[160px] relative">
                 <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={chartData}>
                       <Bar dataKey="value" radius={[8, 8, 0, 0]}>
                          {chartData.map((entry, index) => (
                             <Cell key={`cell-${index}`} fill={index === 4 ? '#8b5cf6' : 'rgba(255,255,255,0.06)'} className="hover:fill-primary-400 transition-all duration-300 cursor-pointer" />
                          ))}
                       </Bar>
                    </BarChart>
                 </ResponsiveContainer>
              </div>
              
              <div className="flex justify-between items-center px-3 pt-6 text-[10px] font-black text-slate-600 uppercase tracking-widest">
                 {chartData.map(d => <span key={d.day}>{d.day}</span>)}
              </div>
           </div>
           
           {/* Abstract Background Decor */}
           <div className="absolute top-0 right-0 w-64 h-64 bg-primary-600/10 rounded-full blur-[100px] -mr-32 -mt-32"></div>
           <div className="absolute bottom-0 left-0 w-48 h-48 bg-indigo-600/10 rounded-full blur-[80px] -ml-24 -mb-24 opacity-50"></div>
        </div>

      </div>

    </div>
  );
};

export default AttendanceDashboard;
