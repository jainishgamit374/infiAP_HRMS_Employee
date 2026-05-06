import React, { useState } from 'react';
import { 
  FileText, 
  Download, 
  BarChart3, 
  TrendingUp, 
  Undo2, 
  Filter, 
  Activity, 
  Award, 
  Building, 
  Search,
  ChevronDown,
  LayoutDashboard,
  Zap,
  ClipboardList
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Cell,
  LineChart,
  Line
} from 'recharts';
import { useNavigate } from 'react-router-dom';

const PerformanceReports = () => {
    const navigate = useNavigate();
    const [activeCycle, setActiveCycle] = useState('Quarter 3, 2023');

    const distributionData = [
        { name: 'Under', count: 12, range: '0-40' },
        { name: 'Emerging', count: 48, range: '40-60' },
        { name: 'Standard', count: 184, range: '60-80' },
        { name: 'High', count: 86, range: '80-90' },
        { name: 'Elite', count: 18, range: '90-100' },
    ];

    const growthData = [
        { month: 'May', engineering: 78, product: 82, sales: 65 },
        { month: 'Jun', engineering: 82, product: 84, sales: 72 },
        { month: 'Jul', engineering: 85, product: 88, sales: 78 },
        { month: 'Aug', engineering: 88, product: 85, sales: 82 },
        { month: 'Sep', engineering: 92, product: 91, sales: 88 },
        { month: 'Oct', engineering: 94, product: 93, sales: 90 },
    ];

    const COLORS = ['#f43f5e', '#f59e0b', '#3b82f6', '#8b5cf6', '#10b981'];

    return (
        <div className="flex flex-col min-h-[calc(100vh-120px)] w-full gap-10 animate-in fade-in slide-in-from-bottom-4 duration-700 relative pt-4 text-left pb-20">
            
            {/* Header */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 shrink-0 text-left">
                <div className="flex items-center gap-6 text-left">
                    <button 
                        onClick={() => navigate('/performance')}
                        className="p-4 bg-white border border-slate-100 text-slate-400 hover:text-slate-800 rounded-2xl shadow-sm transition-all hover:-translate-x-1 active:scale-95 text-left"
                    >
                        <Undo2 size={20} />
                    </button>
                    <div className="text-left">
                        <h1 className="text-4xl font-black text-slate-800 tracking-tight leading-none mb-2 text-left">Performance Analytics & Reports</h1>
                        <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mt-1 text-left leading-none">Forensic Growth Attribution & Merit Bell Curve Diagnostic</p>
                    </div>
                </div>
                
                <div className="flex items-center gap-3">
                    <div className="flex items-center gap-3 px-5 py-2 bg-white border border-slate-100 rounded-2xl text-[10px] font-black uppercase tracking-widest text-slate-600 shadow-sm text-left">
                        Cycle: {activeCycle}
                    </div>
                    <button className="p-3 bg-slate-900 text-white rounded-2xl hover:bg-slate-800 transition-all shadow-xl shadow-slate-200 active:scale-95 text-left">
                        <Download size={20} />
                    </button>
                </div>
            </div>

            {/* Analytical Workspace */}
            <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-12 gap-10 text-left">
                
                {/* 1. Merit Distribution Diagnostic */}
                <div className="xl:col-span-12 card-soft bg-white p-10 border-slate-100 shadow-soft flex flex-col min-h-[500px] text-left">
                    <div className="mb-10 shrink-0 text-left">
                        <h3 className="text-[11px] font-black text-slate-800 uppercase tracking-[0.2em] text-left">Merit Distribution Matrix</h3>
                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1 text-left">Bell curve mapping of current performance nodes</p>
                    </div>
                    <div className="flex-1 min-h-0 text-left">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={distributionData}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                <XAxis 
                                    dataKey="name" 
                                    axisLine={false} 
                                    tickLine={false} 
                                    tick={{fontSize: 9, fontWeight: 900, fill: '#94a3b8'}}
                                    dy={10}
                                />
                                <YAxis 
                                    axisLine={false} 
                                    tickLine={false} 
                                    tick={{fontSize: 9, fontWeight: 900, fill: '#94a3b8'}}
                                />
                                <Tooltip 
                                    contentStyle={{backgroundColor: '#0f172a', border: 'none', borderRadius: '16px', padding: '12px'}}
                                    itemStyle={{color: '#fff', fontSize: '10px', fontWeight: 900, textTransform: 'uppercase'}}
                                    cursor={{fill: '#f1f5f9'}}
                                />
                                <Bar dataKey="count" radius={[12, 12, 0, 0]}>
                                    {distributionData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                    <div className="mt-8 grid grid-cols-5 gap-4 text-left">
                        {distributionData.map((item, i) => (
                            <div key={i} className="text-center">
                                <p className="text-[8px] text-slate-400 font-black uppercase tracking-widest text-center">{item.range}</p>
                                <p className="text-xs font-black text-slate-800 text-center">{item.count} Nodes</p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* 2. Departmental Growth Velocity */}
                <div className="xl:col-span-8 card-soft bg-white p-10 border-slate-100 shadow-soft flex flex-col min-h-[500px] text-left">
                    <div className="mb-10 shrink-0 text-left">
                        <h3 className="text-[11px] font-black text-slate-800 uppercase tracking-[0.2em] text-left">Evolution Velocity by Node</h3>
                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1 text-left">Quarterly growth scores across core departments</p>
                    </div>
                    <div className="flex-1 min-h-0 text-left">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={growthData}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                <XAxis 
                                    dataKey="month" 
                                    axisLine={false} 
                                    tickLine={false} 
                                    tick={{fontSize: 9, fontWeight: 900, fill: '#94a3b8'}}
                                    dy={10}
                                />
                                <YAxis 
                                    axisLine={false} 
                                    tickLine={false} 
                                    tick={{fontSize: 9, fontWeight: 900, fill: '#94a3b8'}}
                                    domain={[50, 100]}
                                />
                                <Tooltip 
                                    contentStyle={{backgroundColor: '#0f172a', border: 'none', borderRadius: '16px', padding: '12px'}}
                                    itemStyle={{fontSize: '10px', fontWeight: 900, textTransform: 'uppercase'}}
                                />
                                <Line type="monotone" dataKey="engineering" stroke="#6366f1" strokeWidth={4} dot={{ r: 4, fill: '#6366f1' }} activeDot={{ r: 6 }} />
                                <Line type="monotone" dataKey="product" stroke="#10b981" strokeWidth={4} dot={{ r: 4, fill: '#10b981' }} activeDot={{ r: 6 }} />
                                <Line type="monotone" dataKey="sales" stroke="#f59e0b" strokeWidth={4} dot={{ r: 4, fill: '#f59e0b' }} activeDot={{ r: 6 }} />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                    <div className="mt-8 flex items-center justify-center gap-6 shrink-0 text-left">
                        <div className="flex items-center gap-2">
                            <div className="w-3 h-3 bg-indigo-500 rounded-full"></div>
                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Engineering</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-3 h-3 bg-emerald-500 rounded-full"></div>
                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Product</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Sales</span>
                        </div>
                    </div>
                </div>

                {/* 3. Bottom Row Summary List */}
                <div className="xl:col-span-2 card-soft bg-slate-50 p-8 border-slate-100 shadow-soft flex items-center justify-between text-left">
                    <div className="flex items-center gap-8 text-left">
                        <div className="p-5 bg-white rounded-3xl shadow-sm text-left flex items-center gap-4 border border-slate-100">
                            <div className="w-12 h-12 bg-primary-50 rounded-2xl flex items-center justify-center text-primary-500">
                                <TrendingUp size={24} />
                            </div>
                            <div className="text-left">
                                <p className="text-[9px] text-slate-400 font-black uppercase tracking-widest text-left">Top Growth Node</p>
                                <p className="text-sm font-black text-slate-800 text-left">Engineering • +12%</p>
                            </div>
                        </div>
                        <div className="p-5 bg-white rounded-3xl shadow-sm text-left flex items-center gap-4 border border-slate-100">
                            <div className="w-12 h-12 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-500">
                                <Award size={24} />
                            </div>
                            <div className="text-left">
                                <p className="text-[9px] text-slate-400 font-black uppercase tracking-widest text-left">Top Talent Core</p>
                                <p className="text-sm font-black text-slate-800 text-left">Product Design</p>
                            </div>
                        </div>
                    </div>
                    <button className="px-10 py-4 bg-slate-900 text-white font-black rounded-2xl hover:bg-slate-800 transition-all uppercase tracking-widest text-[10px] shadow-2xl shadow-slate-200 text-left">
                        Generate Quarterly PDF
                    </button>
                </div>

            </div>

        </div>
    );
};

export default PerformanceReports;
