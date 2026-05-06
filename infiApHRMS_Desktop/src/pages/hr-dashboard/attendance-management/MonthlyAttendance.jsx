import React, { useState, useMemo, useRef, useEffect } from 'react';
import {
    Calendar,
    Search,
    ChevronLeft,
    ChevronRight,
    Filter,
    CheckCircle2,
    XCircle,
    Clock,
    User,
    BellRing,
    Download,
    Activity,
    ArrowRight,
    Info,
    X,
    MapPin,
    ShieldCheck
} from 'lucide-react';
import { useEmployeeContext } from '../../../context/EmployeeContext';

const MonthlyAttendance = () => {
    const { employees } = useEmployeeContext();
    const [notification, setNotification] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');

    // High-Precision States
    const [hoveredRow, setHoveredRow] = useState(null);
    const [hoveredCol, setHoveredCol] = useState(null);
    const [tooltipData, setTooltipData] = useState(null);

    // Scroll Sync Refs
    const nameScrollRef = useRef(null);
    const dataScrollRef = useRef(null);

    const showNotification = (msg) => {
        setNotification(msg);
        setTimeout(() => setNotification(null), 3000);
    };

    // Dual-Ref Sync Engine
    const syncScroll = (e) => {
        const { scrollTop } = e.target;
        if (e.target === nameScrollRef.current && dataScrollRef.current) {
            dataScrollRef.current.scrollTop = scrollTop;
        } else if (e.target === dataScrollRef.current && nameScrollRef.current) {
            nameScrollRef.current.scrollTop = scrollTop;
        }
    };

    // --- GENERATE HIGH-DENSITY MOCK DATA ---
    const daysInMonth = 31;
    const attendanceData = useMemo(() => {
        const names = ['Arjun Mehta', 'Priya Sharma', 'Rohan Gupta', 'Ananya Iyer', 'Sneha Desai', 'Vikram Singh', 'Meera Kapoor', 'Kabir Khan', 'Zoya Ali', 'Rishi Singh', 'Leo Das', 'Maya Reddy', 'Karan Johar', 'Sia Rose'];
        return names.map((name, idx) => {
            const statuses = Array.from({ length: daysInMonth }, (_, i) => {
                const rand = Math.random();
                if (i % 7 === 5 || i % 7 === 6) return 'W'; // Weekend
                if (rand > 0.95) return 'A'; // Absent
                if (rand > 0.85) return 'L'; // Late
                return 'P'; // Present
            });

            const counts = statuses.reduce((acc, s) => {
                acc[s] = (acc[s] || 0) + 1;
                return acc;
            }, { P: 0, A: 0, L: 0, W: 0 });

            return {
                id: idx + 1,
                name,
                role: idx % 2 === 0 ? 'Engineering' : 'Design',
                dept: idx % 3 === 0 ? 'Tech' : 'Creatives',
                avatar: `https://i.pravatar.cc/150?u=${idx + 20}`,
                history: statuses,
                summary: counts
            };
        });
    }, []);

    const filteredData = useMemo(() => {
        return attendanceData.filter(emp => emp.name.toLowerCase().includes(searchQuery.toLowerCase()));
    }, [searchQuery, attendanceData]);

    const getStatusStyle = (s, isHighlight) => {
        if (s === 'W') return 'bg-slate-50 text-slate-200';

        let base = '';
        switch (s) {
            case 'P': base = 'bg-emerald-500 text-white shadow-emerald-100'; break;
            case 'A': base = 'bg-rose-500 text-white shadow-rose-100'; break;
            case 'L': base = 'bg-amber-500 text-white shadow-amber-100'; break;
            default: base = 'bg-slate-50';
        }

        return `${base} ${isHighlight ? 'scale-110 ring-4 ring-white shadow-xl z-10' : ''}`;
    };

    return (
        <div className="flex flex-col h-[calc(100vh-120px)] w-full gap-8 animate-in fade-in slide-in-from-bottom-4 duration-700 relative mt-4 overflow-hidden">

            {/* Global Notification */}
            {notification && (
                <div className="fixed top-24 right-8 z-[100] animate-in slide-in-from-right-8 fade-in flex items-center gap-3 bg-slate-900 text-white px-6 py-4 rounded-2xl shadow-2xl border border-white/10">
                    <Activity size={20} className="text-primary-400" />
                    <span className="text-sm font-bold tracking-tight uppercase tracking-[0.2em]">{notification}</span>
                </div>
            )}

            {/* Forensic Tooltip (Floating) */}
            {tooltipData && (
                <div className="fixed z-[200] pointer-events-none bg-slate-900 text-white p-5 rounded-3xl shadow-2xl border border-white/10 animate-in zoom-in-95" style={{ top: tooltipData.y - 140, left: tooltipData.x - 80 }}>
                    <div className="flex items-center gap-3 mb-3 pb-3 border-b border-white/10">
                        <img src={tooltipData.avatar} className="w-8 h-8 rounded-xl object-cover" alt="" />
                        <div>
                            <p className="text-[10px] font-black uppercase tracking-[0.2em]">{tooltipData.name}</p>
                            <p className="text-[9px] text-slate-400 font-bold uppercase tracking-[0.2em]">{new Date().toLocaleString('default', { month: 'short' })} {tooltipData.day}, {new Date().getFullYear()}</p>
                        </div>
                    </div>
                    <div className="space-y-2">
                        <div className="flex justify-between items-center gap-6">
                            <span className="text-[9px] font-black text-slate-500 uppercase">Punch In</span>
                            <span className="text-[11px] font-black text-primary-400">{tooltipData.status === 'L' ? '09:42 AM' : '08:52 AM'}</span>
                        </div>
                        <div className="flex justify-between items-center gap-6">
                            <span className="text-[9px] font-black text-slate-500 uppercase">Punch Out</span>
                            <span className="text-[11px] font-black text-white">05:45 PM</span>
                        </div>
                    </div>
                </div>
            )}

            {/* Header System */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 shrink-0">
                <div>
                    <h1 className="text-4xl font-black text-slate-800 tracking-tight leading-none mb-2 uppercase">Presence Matrix</h1>
                    <p className="text-[10px] text-slate-400 font-black uppercase tracking-[0.2em] mt-2 leading-none">Automated Employee synchronization & diagnostic reporting</p>
                </div>
                <div className="flex items-center gap-3">
                    <div className="bg-white border border-slate-100 px-6 py-2.5 rounded-2xl shadow-soft flex items-center gap-6 group">
                        <button className="text-slate-300 hover:text-slate-800 transition-colors"><ChevronLeft size={18} /></button>
                        <div className="flex flex-col items-center min-w-[120px]">
                            <span className="text-sm font-black text-slate-800 uppercase tracking-[0.1em]">{new Date().toLocaleString('default', { month: 'long', year: 'numeric' })}</span>
                        </div>
                        <button className="text-slate-300 hover:text-slate-800 transition-colors"><ChevronRight size={18} /></button>
                    </div>
                    <button
                        onClick={() => showNotification("Syncing Forensic Data Archive...")}
                        className="flex items-center gap-3 px-8 py-3 bg-slate-900 text-white font-black rounded-2xl hover:bg-slate-800 transition-all shadow-xl shadow-slate-200 uppercase tracking-[0.2em] text-[10px]"
                    >
                        <Download size={16} />
                        Export Hub
                    </button>
                </div>
            </div>

            {/* The Forensic Grid Container */}
            <div className="flex-1 bg-white border border-slate-100 rounded-[44px] shadow-soft overflow-hidden flex flex-col min-h-0 relative">

                {/* Grid Crosshair Legend */}
                <div className="absolute top-0 right-0 p-8 z-[60] flex items-center gap-4 opacity-0 hover:opacity-100 transition-opacity">
                    <div className="flex items-center gap-2 px-4 py-2 bg-slate-900/10 backdrop-blur-md rounded-xl text-[9px] font-black text-slate-800 uppercase tracking-[0.2em]">
                        Row: {hoveredRow !== null ? hoveredRow + 1 : '--'}
                    </div>
                    <div className="flex items-center gap-2 px-4 py-2 bg-slate-900/10 backdrop-blur-md rounded-xl text-[9px] font-black text-slate-800 uppercase tracking-[0.2em]">
                        Col: {hoveredCol !== null ? hoveredCol + 1 : '--'}
                    </div>
                </div>

                {/* Toolbar */}
                <div className="px-10 py-6 border-b border-slate-50 flex items-center justify-between bg-slate-50/20">
                    <div className="relative group max-w-sm w-full">
                        <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-hover:text-primary-500 transition-colors" />
                        <input
                            type="text"
                            placeholder="Search employee identity..."
                            className="w-full bg-white border border-slate-100 focus:border-primary-100 outline-none rounded-2xl pl-12 pr-4 py-3 text-xs font-black text-slate-600 transition-all shadow-sm uppercase tracking-tight"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                        {searchQuery && <X size={14} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300 cursor-pointer" onClick={() => setSearchQuery('')} />}
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-xl bg-slate-900 flex items-center justify-center text-white font-black text-[10px] shadow-lg">EM</div>
                        <div className="flex flex-col">
                            <span className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] leading-none mb-1">Employee Member</span>
                            <span className="text-xs font-black text-slate-800 tracking-tight leading-none group-hover:text-primary-600 transition-colors uppercase italic underline decoration-primary-200 underline-offset-4">Interactive Perspective</span>
                        </div>
                    </div>
                    <div className="flex items-center gap-8">
                        <div className="hidden lg:flex items-center gap-6">
                            {['P', 'A', 'L', 'W'].map(key => (
                                <div key={key} className="flex items-center gap-2">
                                    <div className={`w-3 h-3 rounded-full ${getStatusStyle(key, false)}`}></div>
                                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">{key === 'W' ? 'Weekend' : key === 'L' ? 'Late' : key === 'P' ? 'Present' : 'Absent'}</span>
                                </div>
                            ))}
                        </div>
                        <button className="p-3 bg-white border border-slate-100 text-slate-400 hover:text-primary-600 rounded-xl transition-all shadow-sm">
                            <Filter size={20} />
                        </button>
                    </div>
                </div>

                {/* MAIN SPLIT GRID */}
                <div className="flex-1 flex overflow-hidden min-h-0 cursor-crosshair">

                    {/* 1. LEFT PANE: EMPLOYEE IDENTITY (SYNCED VERTICAL) */}
                    <div className="w-[320px] flex flex-col shrink-0 border-r border-slate-100 bg-white relative z-50 shadow-[8px_0_24px_rgba(0,0,0,0.02)]">
                        <div className="h-[60px] flex items-center px-10 border-b border-slate-50 bg-slate-50/30">
                            <span className="text-[11px] font-black text-slate-800 uppercase tracking-[0.2em] flex items-center gap-3">
                                <ShieldCheck size={16} className="text-primary-500" />
                                Employee Nodes
                            </span>
                        </div>
                        {/* Fixed Scrollable Area for Names */}
                        <div
                            ref={nameScrollRef}
                            onScroll={syncScroll}
                            className="flex-1 overflow-y-auto no-scrollbar bg-white"
                        >
                            {filteredData.map((emp, rowIdx) => (
                                <div
                                    key={emp.id}
                                    className={`h-[84px] flex items-center px-10 border-b border-slate-50 transition-all duration-300 relative ${hoveredRow === rowIdx ? 'bg-primary-50/50' : 'bg-white'}`}
                                    onMouseEnter={() => setHoveredRow(rowIdx)}
                                    onMouseLeave={() => setHoveredRow(null)}
                                >
                                    {hoveredRow === rowIdx && <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-primary-600 rounded-r-lg animate-in slide-in-from-left-2 shadow-glow shadow-primary-500/20"></div>}
                                    <div className="flex items-center gap-5 min-w-0">
                                        <img src={emp.avatar} className="w-12 h-14 rounded-2xl object-cover ring-4 ring-white shadow-xl shadow-slate-100 group-hover:scale-105 transition-transform" alt="" />
                                        <div>
                                            <p className="text-sm font-black text-slate-800 tracking-tight leading-none group-hover:text-primary-600 transition-colors uppercase mb-1">{emp.name}</p>
                                            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-[0.2em]">{emp.role} • Verified Employee Archive</p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* 2. RIGHT PANE: DATA WORKSPACE (SYNCED VERTICAL + HORIZONTAL) */}
                    <div className="flex-1 flex flex-col overflow-hidden min-w-0 relative">

                        {/* 🧬 Grid Overlays (Laser Sight) */}
                        {hoveredCol !== null && (
                            <div
                                className="absolute inset-y-0 bg-primary-50/20 border-x border-primary-100/50 z-0 pointer-events-none transition-all duration-300"
                                style={{ left: hoveredCol * 54, width: 54 }}
                            ></div>
                        )}

                        {/* Fixed Header for Calendar Days */}
                        <div className="h-[60px] flex shrink-0 overflow-x-auto border-b border-slate-50 bg-slate-50/30 no-scrollbar" style={{ scrollbarWidth: 'none' }}>
                            <div className="flex min-w-max">
                                {Array.from({ length: 31 }, (_, i) => (
                                    <div
                                        key={i}
                                        className={`w-[54px] flex items-center justify-center text-[12px] font-black transition-all ${hoveredCol === i ? 'text-primary-600 bg-primary-100/20 scale-110' : 'text-slate-300 border-r border-slate-50/50'}`}
                                        onMouseEnter={() => setHoveredCol(i)}
                                        onMouseLeave={() => setHoveredCol(null)}
                                    >
                                        {i + 1}
                                    </div>
                                ))}
                                <div className="w-[140px] flex items-center justify-center text-[11px] font-black text-slate-800 bg-slate-200/20 tracking-[0.2em] uppercase">
                                    Diagnostics
                                </div>
                            </div>
                        </div>

                        {/* Scrollable Grid Body */}
                        <div
                            ref={dataScrollRef}
                            onScroll={syncScroll}
                            className="flex-1 overflow-auto bg-white no-scrollbar"
                        >
                            <div className="min-w-max relative z-10">
                                {filteredData.map((emp, rowIdx) => (
                                    <div
                                        key={emp.id}
                                        className={`h-[84px] flex border-b border-slate-50 transition-all ${hoveredRow === rowIdx ? 'bg-primary-50/10' : ''}`}
                                        onMouseEnter={() => setHoveredRow(rowIdx)}
                                        onMouseLeave={() => setHoveredRow(null)}
                                    >
                                        {emp.history.map((status, colIdx) => (
                                            <div
                                                key={colIdx}
                                                className={`w-[54px] flex items-center justify-center transition-all ${hoveredCol === colIdx ? 'bg-primary-50/30' : ''}`}
                                                onMouseEnter={() => {
                                                    setHoveredCol(colIdx);
                                                    if (status !== 'W' && status !== 'A') {
                                                        setTooltipData({ x: 0, y: 0, name: emp.name, avatar: emp.avatar, day: colIdx + 1, status });
                                                    }
                                                }}
                                                onMouseMove={(e) => {
                                                    if (tooltipData) setTooltipData(prev => ({ ...prev, x: e.clientX, y: e.clientY }));
                                                }}
                                                onMouseLeave={() => {
                                                    setHoveredCol(null);
                                                    setTooltipData(null);
                                                }}
                                            >
                                                <div
                                                    className={`w-10 h-10 rounded-2xl flex items-center justify-center text-[11px] font-black transition-all duration-300 cursor-pointer ${getStatusStyle(status, hoveredRow === rowIdx && hoveredCol === colIdx)}`}
                                                >
                                                    {status}
                                                </div>
                                            </div>
                                        ))}
                                        <div className="w-[140px] flex items-center justify-center gap-3 bg-slate-50/50">
                                            <span className="w-8 h-8 flex items-center justify-center bg-emerald-100 text-emerald-700 text-[10px] font-black rounded-xl shadow-sm">{emp.summary.P}</span>
                                            <span className="w-8 h-8 flex items-center justify-center bg-rose-100 text-rose-700 text-[10px] font-black rounded-xl shadow-sm">{emp.summary.A}</span>
                                            <span className="w-8 h-8 flex items-center justify-center bg-amber-100 text-amber-700 text-[10px] font-black rounded-xl shadow-sm">{emp.summary.L}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                </div>

                {/* Grid Footer Summary */}
                <div className="px-12 py-5 bg-slate-900 flex items-center justify-between text-white shrink-0 relative overflow-hidden">
                    <div className="flex items-center gap-10 relative z-10">
                        <div className="flex items-center gap-4">
                            <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse shadow-glow shadow-green-500/50"></div>
                            <span className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-300">Synchronized Forensic Workspace</span>
                        </div>
                        <div className="hidden md:flex items-center gap-3 text-slate-500 text-[11px] font-bold">
                            <Clock size={16} />
                            Last Refresh: {new Date().toLocaleString('default', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                        </div>
                    </div>
                    <div className="flex items-center gap-8 relative z-10">
                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-[0.2em]">Real-time audit calculated for {filteredData.length} Employee nodes</p>
                        <button className="px-10 py-3 bg-primary-600 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] hover:bg-primary-700 transition-all shadow-2xl shadow-primary-500/30 active:scale-95">Re-Sync Engine</button>
                    </div>
                    <div className="absolute top-0 right-0 w-96 h-96 bg-primary-600/10 rounded-full blur-[120px] -mr-48 -mt-48"></div>
                </div>

            </div>

        </div>
    );
};

export default MonthlyAttendance;
