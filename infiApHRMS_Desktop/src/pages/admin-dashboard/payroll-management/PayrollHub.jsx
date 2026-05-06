import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  Tooltip, 
  CartesianGrid 
} from 'recharts';

const chartData = [
  { month: 'May', amount: 380300 },
  { month: 'Jun', amount: 410400 },
  { month: 'Jul', amount: 395000 },
  { month: 'Aug', amount: 450200 },
  { month: 'Sep', amount: 480000 },
  { month: 'Oct', amount: 512000 },
];

const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl shadow-2xl backdrop-blur-xl">
        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{payload[0].payload.month}</p>
        <p className="text-sm font-black text-white tracking-tighter">${payload[0].value.toLocaleString()}</p>
      </div>
    );
  }
  return null;
};
import { useNavigate } from 'react-router-dom';
import {
  CreditCard,
  Clock,
  Users,
  TrendingUp,
  Play,
  FileText,
  BarChart,
  MoreVertical,
  CheckCircle2,
  AlertCircle,
  ChevronRight,
  PieChart,
  Search,
  Zap,
  DollarSign
} from 'lucide-react';

const PayrollHub = () => {
  const navigate = useNavigate();

  const stats = [
    { label: 'Total Monthly', value: '$450,200', change: '+4.2%', icon: DollarSign, color: 'text-indigo-600', bg: 'bg-indigo-50' },
    { label: 'Pending Payments', value: '$12,400', sub: '12 items', icon: Clock, color: 'text-rose-600', bg: 'bg-rose-50' },
    { label: 'Employees Paid', value: '124/128', progress: 96, icon: Users, color: 'text-emerald-600', bg: 'bg-emerald-50' },
    { label: 'Upcoming', value: '$8,500', sub: 'Aug 14', icon: TrendingUp, color: 'text-purple-600', bg: 'bg-purple-50' },
  ];

  const quickActions = [
    { label: 'Run Payroll', icon: Play, path: '/admin/payroll-management/generate', primary: true },
    { label: 'Payslips', icon: FileText, path: '/admin/payroll-management/generate' },
    { label: 'Reports', icon: BarChart, path: '/admin/payroll-management/reports' },
  ];

  const payrollStatus = [
    { month: 'August 2023', scheduled: 'Scheduled for Aug 31', amount: '$112,540', status: 'PENDING', statusColor: 'text-orange-500 bg-orange-50' },
    { month: 'July 2023', scheduled: 'Paid on Jul 28', amount: '$108,220', status: 'PAID', statusColor: 'text-emerald-500 bg-emerald-50' },
  ];

  const disbursements = [
    { name: 'Sarah Jenkins', role: 'UI/UX Designer', amount: '$4,250', status: 'PAID', img: 'https://i.pravatar.cc/150?u=sarah' },
    { name: 'Marcus Chen', role: 'Lead Engineer', amount: '$6,500', status: 'PENDING', img: 'https://i.pravatar.cc/150?u=marcus' },
    { name: 'Elena Rodriguez', role: 'HR Manager', amount: '$5,100', status: 'PAID', img: 'https://i.pravatar.cc/150?u=elena' },
  ];

  return (
    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-20">

      {/* Header System */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8 px-2">
        <div>
           <h1 className="text-4xl font-black text-slate-800 tracking-tight leading-none mb-2">Payroll Management</h1>
           <p className="text-[10px] text-slate-400 font-black uppercase tracking-[0.2em] mt-1 leading-none">Global compensation & disbursement infrastructure</p>
        </div>
        <div className="flex items-center gap-4">
           {/* Dynamic Period Picker */}
           <div className="flex items-center gap-2 p-1.5 bg-slate-50 rounded-2xl border border-slate-100">
              <button className="px-6 py-2.5 bg-white text-slate-900 text-[10px] font-black uppercase rounded-xl shadow-sm border border-slate-100">Monthly</button>
              <button className="px-6 py-2.5 text-slate-400 text-[10px] font-black uppercase rounded-xl hover:bg-white transition-all">Yearly</button>
           </div>
           <div className="w-12 h-12 bg-slate-900 text-white rounded-2xl flex items-center justify-center hover:bg-slate-800 transition-all cursor-pointer shadow-xl shadow-slate-200">
              <Search size={20} />
           </div>
        </div>
      </div>

      {/* Hero Stats Architecture */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 px-2">
        {stats.map((stat, idx) => (
          <div key={idx} className="min-h-[220px] p-10 bg-white rounded-[44px] border border-slate-50 shadow-soft hover:shadow-3xl transition-all duration-500 hover:-translate-y-2 group relative overflow-hidden flex flex-col">
            <div className={`w-14 h-14 rounded-[20px] ${stat.bg} ${stat.color} flex items-center justify-center mb-8 group-hover:scale-110 transition-transform shadow-lg shadow-current/5 shrink-0`}>
              <stat.icon size={26} />
            </div>
            <div className="relative z-10 flex flex-col justify-end flex-1">
               <div className="flex items-baseline gap-3 mb-1">
                  <h3 className="text-4xl font-black text-slate-800 tracking-tighter leading-none">{stat.value}</h3>
                  {stat.change && <span className="text-[10px] text-emerald-500 font-black px-2 py-1 bg-emerald-50 rounded-lg">{stat.change}</span>}
               </div>
                <p className="text-[8px] font-black text-slate-500 uppercase tracking-widest leading-none mb-4">{stat.label}</p>
               {stat.sub && (
                 <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2 mt-auto">
                    <Clock size={12} className="text-indigo-400" />
                    {stat.sub}
                 </p>
               )}
            </div>
            {/* Backdrop Glow */}
            <div className="absolute top-0 right-0 w-24 h-24 bg-current/5 rounded-full blur-3xl group-hover:scale-150 transition-transform"></div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-10 px-2">

        {/* Control Logic Partition */}
        <div className="xl:col-span-4 space-y-10">

          {/* Quick Actions Ecosystem */}
          <section className="bg-white rounded-[56px] p-12 border border-slate-50 shadow-soft border-b-8 border-b-slate-100">
            <h4 className="text-xs font-black uppercase tracking-widest text-slate-800 mb-10 border-b border-slate-50 pb-6">Quick Actions</h4>
            <div className="space-y-4">
              {quickActions.map((action, idx) => (
                <button
                  key={idx}
                  onClick={() => navigate(action.path)}
                  className={`w-full flex items-center gap-5 p-6 rounded-[28px] font-black text-[11px] uppercase tracking-[0.2em] transition-all group/btn
                    ${action.primary
                      ? 'bg-slate-900 text-white shadow-3xl shadow-slate-200 hover:bg-slate-800'
                      : 'bg-slate-50 text-slate-500 hover:bg-indigo-50 hover:text-indigo-600 border border-slate-100/50'}`}
                >
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${action.primary ? 'bg-white/10' : 'bg-white shadow-soft group-hover/btn:shadow-lg'}`}>
                    <action.icon size={22} />
                  </div>
                  {action.label}
                  <ChevronRight size={18} className="ml-auto opacity-0 group-hover/btn:opacity-100 group-hover/btn:translate-x-1 transition-all" />
                </button>
              ))}
            </div>
          </section>

          {/* Payroll Status History */}
          <section className="bg-white rounded-[56px] p-12 border border-slate-50 shadow-soft">
            <div className="flex items-center justify-between mb-10 border-b border-slate-50 pb-6">
              <h4 className="text-xs font-black uppercase tracking-widest text-slate-800">Payroll Status</h4>
              <button className="text-[9px] font-black text-indigo-600 hover:underline uppercase tracking-widest">Global History</button>
            </div>
            <div className="space-y-8">
              {payrollStatus.map((item, idx) => (
                <div key={idx} className="group cursor-pointer">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h4 className="text-2xl font-black text-slate-800 tracking-tight leading-none group-hover:text-indigo-600 transition-colors">{item.month}</h4>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-2">{item.scheduled}</p>
                    </div>
                    <span className={`px-4 py-1.5 rounded-xl text-[9px] font-black tracking-widest border ${item.statusColor}`}>
                      {item.status}
                    </span>
                  </div>
                  <div className="flex items-baseline gap-2 mt-4">
                     <p className="text-xl font-black text-slate-800 tracking-tighter leading-none">{item.amount}</p>
                     <p className="text-[9px] font-black text-slate-200 uppercase tracking-widest leading-none">Net Volume</p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* Disbursement Intelligence Partition */}
        <div className="xl:col-span-8">
          <section className="bg-white rounded-[64px] p-14 border border-slate-50 shadow-soft relative overflow-hidden h-full flex flex-col">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-10 mb-14 relative z-10">
              <div>
                <h2 className="text-4xl font-black text-slate-800 tracking-tight leading-none mb-2">Salary Disbursement</h2>
                <p className="text-[10px] text-slate-400 font-black uppercase tracking-[0.2em] mt-1 leading-none">Real-time audit & payment authorization feed</p>
              </div>
              <div className="relative group flex-1 md:max-w-[400px]">
                <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-indigo-500 transition-colors" size={20} />
                <input
                  type="text"
                  placeholder="Query identity nodes..."
                  className="bg-slate-50 border border-slate-100 rounded-3xl pl-16 pr-8 py-4.5 text-sm font-bold outline-none focus:ring-4 focus:ring-indigo-500/5 focus:border-indigo-500/20 focus:bg-white transition-all w-full shadow-inner"
                />
              </div>
            </div>

            <div className="space-y-6 relative z-10 flex-1">
              {disbursements.map((person, idx) => (
                <div key={idx} className="flex flex-col sm:flex-row items-center justify-between p-8 bg-slate-50/50 hover:bg-white border border-transparent hover:border-slate-100 rounded-[40px] transition-all duration-500 group/item cursor-pointer hover:shadow-3xl hover:-translate-y-1">
                  <div className="flex items-center gap-8 mb-6 sm:mb-0">
                    <div className="w-20 h-20 rounded-[30px] overflow-hidden border-4 border-white shadow-soft transition-transform group-hover/item:scale-110 duration-700">
                      <img src={person.img} alt={person.name} className="w-full h-full object-cover" />
                    </div>
                    <div>
                      <h4 className="text-xl font-black text-slate-800 tracking-tight leading-none mb-2 mb-1 group-hover/item:text-indigo-600 transition-colors uppercase">{person.name}</h4>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">{person.role}</p>
                    </div>
                  </div>
                  <div className="flex flex-col sm:flex-row items-center gap-12 w-full sm:w-auto">
                    <div className="text-center sm:text-right">
                      <div className="flex items-baseline gap-2 justify-center sm:justify-end">
                         <p className="text-2xl font-black text-slate-800 tracking-tighter leading-none">{person.amount}</p>
                         <Zap size={10} className="text-emerald-500 fill-current" />
                      </div>
                      <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest leading-none mt-2">Disbursement Index</p>
                    </div>
                    <div className="flex items-center gap-4 w-full sm:w-auto">
                      {person.status === 'PAID' ? (
                        <div className="flex-1 sm:flex-none h-14 px-8 rounded-2xl bg-emerald-50 text-emerald-500 flex items-center justify-center gap-3 border border-emerald-100 shadow-sm">
                          <CheckCircle2 size={20} strokeWidth={3} />
                          <span className="text-[10px] font-black uppercase tracking-widest">Succeeded</span>
                        </div>
                      ) : (
                        <button
                          onClick={() => navigate('/admin/payroll-management/structure')}
                          className="flex-1 sm:flex-none h-14 px-12 bg-slate-900 text-white font-black rounded-2xl text-[10px] uppercase tracking-[0.3em] shadow-2xl shadow-slate-200 hover:bg-indigo-600 transition-all active:scale-95 group/pay"
                        >
                          PAY
                        </button>
                      )}
                      <button className="p-4 text-slate-200 hover:text-slate-500 transition-colors">
                        <MoreVertical size={24} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Payroll Disbursement Trend Diagnostic */}
            <div className="mt-14 p-12 bg-white rounded-[56px] border border-slate-50 shadow-soft relative overflow-hidden group">
               <div className="flex items-center justify-between mb-10 relative z-10">
                  <div>
                     <h4 className="text-xs font-black text-slate-800 tracking-tight uppercase mb-2">Payroll Disbursement Trend</h4>
                     <p className="text-[10px] text-slate-400 font-black uppercase tracking-[0.2em] mt-1 leading-none">Monthly capital outflow & growth diagnostics</p>
                  </div>
                  <div className="flex items-center gap-8">
                     <div className="text-right">
                        <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest mb-1">Avg. Volume</p>
                        <p className="text-xl font-black text-slate-800 tracking-tighter">$421,450</p>
                     </div>
                     <div className="w-px h-10 bg-slate-100"></div>
                     <div className="text-right">
                        <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest mb-1">Growth</p>
                        <p className="text-xl font-black text-emerald-500 tracking-tighter">+12.4%</p>
                     </div>
                  </div>
               </div>

               <div className="h-[280px] w-full relative z-10">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                      <defs>
                        <linearGradient id="colorAmt" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#4F46E5" stopOpacity={0.1}/>
                          <stop offset="95%" stopColor="#4F46E5" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                      <XAxis 
                        dataKey="month" 
                        axisLine={false} 
                        tickLine={false} 
                        tick={{ fontSize: 10, fontWeight: 900, fill: '#94a3b8' }} 
                        dy={10}
                      />
                      <YAxis 
                        axisLine={false} 
                        tickLine={false} 
                        tick={{ fontSize: 10, fontWeight: 900, fill: '#94a3b8' }} 
                      />
                      <Tooltip content={<CustomTooltip />} />
                      <Area 
                        type="monotone" 
                        dataKey="amount" 
                        stroke="#4F46E5" 
                        strokeWidth={4}
                        fillOpacity={1} 
                        fill="url(#colorAmt)" 
                        activeDot={{ r: 8, strokeWidth: 0, fill: '#4F46E5' }}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
               </div>

               {/* Design Detail Backdrop */}
               <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-indigo-50/30 rounded-full blur-[100px] pointer-events-none group-hover:scale-150 transition-transform duration-1000"></div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default PayrollHub;
