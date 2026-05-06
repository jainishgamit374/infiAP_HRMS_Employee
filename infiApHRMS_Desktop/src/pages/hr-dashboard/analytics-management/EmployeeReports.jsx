import React, { useEffect, useMemo, useState } from 'react';
import { 
  Users, 
  TrendingUp, 
  PieChart as PieChartIcon, 
  Globe, 
  Undo2, 
  Download, 
  Filter, 
  BarChart3, 
  ChevronRight, 
  Activity,
  LayoutDashboard,
  BrainCircuit,
  Database
} from 'lucide-react';
import { 
  PieChart, 
  Pie, 
  Cell, 
  ResponsiveContainer, 
  Tooltip, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid,
  Legend
} from 'recharts';
import { useNavigate } from 'react-router-dom';
import { getAnalyticsReport } from '../../../services/hrApi';

const EmployeeReports = () => {
    const navigate = useNavigate();
    const [activeRange, setActiveRange] = useState('Current Year');

    const defaultDepartmentData = [
        { name: 'Engineering', value: 142 },
        { name: 'Design', value: 45 },
        { name: 'Operations', value: 68 },
        { name: 'Sales', value: 93 },
    ];

    const defaultTenureData = [
        { range: '0-1 Yr', count: 85 },
        { range: '1-3 Yrs', count: 124 },
        { range: '3-5 Yrs', count: 96 },
        { range: '5+ Yrs', count: 43 },
    ];

    const [departmentData, setDepartmentData] = useState(defaultDepartmentData);
    const [tenureData, setTenureData] = useState(defaultTenureData);
    const [totalEmployees, setTotalEmployees] = useState(null);

    useEffect(() => {
        let isMounted = true;

        const pickArray = (value) => (Array.isArray(value) ? value : []);

        const loadReport = async () => {
            try {
                const res = await getAnalyticsReport();
                const payload = res.data?.data || {};

                const departments = pickArray(payload.departments || payload.byDepartment || payload.departmentStats || payload);
                const mappedDepartments = departments.map((item, index) => ({
                    name: item.department || item.name || item.dept || `Dept ${index + 1}`,
                    value: Number(item.count ?? item.value ?? item.total ?? 0)
                })).filter((item) => item.name);

                const tenureBuckets = pickArray(payload.tenure || payload.tenureBuckets || payload.tenureBreakdown);
                const mappedTenure = tenureBuckets.map((item, index) => ({
                    range: item.range || item.label || item.bucket || `Range ${index + 1}`,
                    count: Number(item.count ?? item.value ?? 0)
                })).filter((item) => item.range);

                if (!isMounted) return;
                if (mappedDepartments.length) setDepartmentData(mappedDepartments);
                if (mappedTenure.length) setTenureData(mappedTenure);
                if (payload.totalEmployees !== undefined) setTotalEmployees(payload.totalEmployees);
            } catch (err) {
                console.error('Failed to load employee analytics report:', err);
            }
        };

        loadReport();

        return () => {
            isMounted = false;
        };
    }, []);

    const computedTotal = useMemo(() => {
        if (typeof totalEmployees === 'number') return totalEmployees;
        return departmentData.reduce((sum, item) => sum + (Number(item.value) || 0), 0);
    }, [departmentData, totalEmployees]);

    const COLORS = ['#6366f1', '#10b981', '#f59e0b', '#8b5cf6'];

    return (
        <div className="flex flex-col min-h-[calc(100vh-120px)] w-full gap-10 animate-in fade-in slide-in-from-bottom-4 duration-700 relative pt-4 text-left pb-20">
            
            {/* Header */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 shrink-0 text-left">
                <div className="flex items-center gap-6 text-left">
                    <button 
                        onClick={() => navigate('/analytics')}
                        className="p-4 bg-white border border-slate-100 text-slate-400 hover:text-slate-800 rounded-2xl shadow-sm transition-all hover:-translate-x-1 active:scale-95 text-left"
                    >
                        <Undo2 size={20} />
                    </button>
                    <div className="text-left">
                        <h1 className="text-4xl font-black text-slate-800 tracking-tight leading-none mb-2 text-left">Employee Lifecycle Diagnostic</h1>
                        <p className="text-[10px] text-slate-400 font-black uppercase tracking-[0.2em] mt-1 text-left leading-none">Demographic Distribution & Tenure Intelligence Index</p>
                    </div>
                </div>
                
                <div className="flex items-center gap-3">
                    <button className="p-3 bg-white border border-slate-100 text-slate-400 rounded-2xl hover:text-slate-800 shadow-sm transition-all text-left">
                        <Filter size={20} />
                    </button>
                    <button className="px-10 py-3 bg-slate-900 text-white font-black rounded-2xl hover:bg-slate-800 transition-all shadow-xl shadow-slate-200 uppercase tracking-[0.2em] text-[10px] text-left">
                        Export Dataset
                    </button>
                </div>
            </div>

            {/* Content Workspace */}
            <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-12 gap-10 text-left">
                
                {/* 1. Departmental Distribution Pie */}
                <div className="xl:col-span-4 card-soft bg-white p-10 border-slate-100 shadow-soft flex flex-col min-h-[500px] text-left">
                    <div className="mb-10 shrink-0 text-left">
                        <h3 className="text-[11px] font-black text-slate-800 uppercase tracking-[0.2em] text-left">Node Distribution</h3>
                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-[0.2em] mt-1 text-left">Headcount breakdown by department node</p>
                    </div>
                    <div className="flex-1 min-h-0 relative text-left">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={departmentData}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={70}
                                    outerRadius={110}
                                    paddingAngle={5}
                                    dataKey="value"
                                >
                                    {departmentData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip 
                                    contentStyle={{backgroundColor: '#0f172a', border: 'none', borderRadius: '16px', padding: '12px'}}
                                    itemStyle={{color: '#fff', fontSize: '10px', fontWeight: 900, textTransform: 'uppercase'}}
                                />
                            </PieChart>
                        </ResponsiveContainer>
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center pointer-events-none">
                            <p className="text-[10px] text-slate-400 font-black uppercase tracking-[0.2em] leading-none mb-1 text-center">Total</p>
                            <p className="text-3xl font-black text-slate-800 tracking-tighter leading-none text-center">{computedTotal}</p>
                        </div>
                    </div>
                    <div className="mt-8 grid grid-cols-2 gap-4 shrink-0 text-left">
                        {departmentData.map((d, i) => (
                            <div key={i} className="flex items-center justify-between p-3 bg-slate-50 rounded-xl text-left">
                                <div className="flex items-center gap-2 text-left">
                                    <div className="w-2 h-2 rounded-full" style={{backgroundColor: COLORS[i]}}></div>
                                    <span className="text-[10px] font-black text-slate-600 uppercase tracking-[0.2em] text-left">{d.name}</span>
                                </div>
                                <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] text-left">{d.value}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* 2. Tenure Analytics Bar Chart */}
                <div className="xl:col-span-5 card-soft bg-white p-10 border-slate-100 shadow-soft flex flex-col min-h-[500px] text-left">
                    <div className="mb-10 shrink-0 text-left">
                        <h3 className="text-[11px] font-black text-slate-800 uppercase tracking-[0.2em] text-left">Tenure Intelligence</h3>
                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-[0.2em] mt-1 text-left">Employee retention time-segments</p>
                    </div>
                    <div className="flex-1 min-h-0 text-left">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={tenureData}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                <XAxis 
                                    dataKey="range" 
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
                                <Bar dataKey="count" fill="#6366f1" radius={[8, 8, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                    <div className="mt-8 p-6 bg-slate-900 rounded-[28px] text-white flex items-center justify-between shrink-0 text-left">
                        <div className="text-left">
                            <p className="text-[9px] text-white/40 font-black uppercase tracking-[0.2em] text-left">Avg. Retention Node</p>
                            <p className="text-xl font-black text-white tracking-tight text-left">3.4 Years</p>
                        </div>
                        <div className="flex items-center gap-2 text-emerald-400 text-left">
                            <TrendingUp size={20} />
                            <span className="text-[10px] font-black uppercase text-left">+4% Growth</span>
                        </div>
                    </div>
                </div>

            </div>

        </div>
    );
};

export default EmployeeReports;
