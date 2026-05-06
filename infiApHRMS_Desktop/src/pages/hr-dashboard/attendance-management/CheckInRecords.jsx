import React, { useState, useMemo, useEffect, useRef } from 'react';
import {
    Search,
    Filter,
    Download,
    MapPin,
    Clock,
    Smartphone,
    Laptop,
    MoreHorizontal,
    ExternalLink,
    Flag,
    Calendar,
    ChevronDown,
    BellRing,
    ShieldCheck,
    Globe,
    Activity,
    User,
    History,
    Info,
    X,
    ArrowRight
} from 'lucide-react';

const CheckInRecords = () => {
    // --- STATE ---
    const [notification, setNotification] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedRecordId, setSelectedRecordId] = useState(1);
    const [activeFilter, setActiveFilter] = useState('All');

    const showNotification = (msg) => {
        setNotification(msg);
        setTimeout(() => setNotification(null), 3000);
    };

    const [records] = useState([
        { id: 1, name: 'Arjun Mehta', role: 'Principal Engineer', checkIn: '08:52 AM', checkOut: '05:45 PM', total: '8h 53m', date: '24 Oct 2023', device: 'iPhone 14 Pro', location: 'Mumbai HQ - Floor 4', ip: '192.168.1.45', status: 'On Time', avatar: 'https://i.pravatar.cc/150?u=arjun', verif: 'Face ID Verified', verifTime: '08:52:12' },
        { id: 2, name: 'Priya Sharma', role: 'UX Designer', checkIn: '09:18 AM', checkOut: '06:00 PM', total: '8h 42m', date: '24 Oct 2023', device: 'MacBook Pro', location: 'Remote (BKC, Mumbai)', ip: '192.168.1.12', status: 'Late', avatar: 'https://i.pravatar.cc/150?u=priya', verif: 'Password + SMS', verifTime: '09:18:45' },
        { id: 3, name: 'Rohan Gupta', role: 'Staff Eng', checkIn: '08:45 AM', checkOut: '05:30 PM', total: '8h 45m', date: '23 Oct 2023', device: 'Biometric Scanner', location: 'Mumbai HQ - Primary', ip: '192.168.1.8', status: 'On Time', avatar: 'https://i.pravatar.cc/150?u=rohan', verif: 'Biometric Verified', verifTime: '08:45:02' },
        { id: 4, name: 'Ananya Iyer', role: 'Product Lead', checkIn: '09:05 AM', checkOut: '06:15 PM', total: '9h 10m', date: '23 Oct 2023', device: 'Google Pixel 7', location: 'Bengaluru Office', ip: '10.0.0.124', status: 'On Time', avatar: 'https://i.pravatar.cc/150?u=ananya', verif: 'Face ID Verified', verifTime: '09:05:33' },
        { id: 5, name: 'Sneha Desai', role: 'HR Ops Specialist', checkIn: '09:00 AM', checkOut: '06:45 PM', total: '9h 45m', date: '22 Oct 2023', device: 'Web Dashboard', location: 'Mumbai HQ - Floor 1', ip: '192.168.1.55', status: 'On Time', avatar: 'https://ui-avatars.com/api/?name=Sneha+Desai&background=1e293b&color=fff', verif: 'MFA Verified', verifTime: '09:00:10' },
    ]);

    const selectedRecord = useMemo(() =>
        records.find(r => r.id === selectedRecordId) || records[0]
        , [selectedRecordId, records]);

    // --- DYNAMIC FILTERING ---
    const filteredRecords = useMemo(() => {
        return records.filter(rec =>
            (rec.name.toLowerCase().includes(searchQuery.toLowerCase()) || rec.ip.includes(searchQuery)) &&
            (activeFilter === 'All' || rec.status === activeFilter)
        );
    }, [searchQuery, records, activeFilter]);

    return (
        <div className="flex flex-col h-[calc(100vh-140px)] w-full gap-8 animate-in fade-in slide-in-from-bottom-4 duration-700 relative mt-4">

            {/* Premium Notification */}
            {notification && (
                <div className="fixed top-24 right-8 z-[100] animate-in slide-in-from-right-8 fade-in flex items-center gap-3 bg-slate-900 text-white px-6 py-4 rounded-2xl shadow-2xl border border-white/10">
                    <BellRing size={20} className="text-primary-400" />
                    <span className="text-sm font-bold tracking-tight">{notification}</span>
                </div>
            )}

            {/* Header & Main Controls */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 shrink-0">
                <div>
                    <h1 className="text-4xl font-black text-slate-800 tracking-tight leading-none mb-2">Check-in Diagnostic Center</h1>
                    <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mt-1 leading-none">Real-time enterprise verification & Employee log integrity</p>
                </div>
                <div className="flex items-center gap-3">
                    <button
                        onClick={() => showNotification("Exporting high-fidelity audit trail...")}
                        className="flex items-center gap-2 px-8 py-3 bg-slate-900 text-white font-black rounded-2xl hover:bg-slate-800 transition-all shadow-xl shadow-slate-200 uppercase tracking-widest text-[10px]"
                    >
                        <Download size={16} />
                        Export Audit Trail
                    </button>
                </div>
            </div>

            {/* Workspace Grid (Split Pane) */}
            <div className="flex-1 flex flex-col lg:flex-row gap-8 overflow-hidden min-h-0">

                {/* Left Column: High-Density Diagnostic List */}
                <div className="flex-1 flex flex-col min-w-0 bg-white border border-slate-100 rounded-[44px] shadow-soft overflow-hidden">

                    {/* Table Filter Hub */}
                    <div className="px-8 py-6 border-b border-slate-50 flex items-center justify-between gap-4 bg-slate-50/30">
                        <div className="relative group flex-1">
                            <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-hover:text-primary-500 transition-colors" />
                            <input
                                type="text"
                                placeholder="Search employees, departments, or shifts..."
                                className="w-full bg-white border border-slate-100 focus:border-primary-100 outline-none rounded-2xl pl-12 pr-4 py-3 text-xs font-black text-slate-600 transition-all shadow-sm uppercase tracking-tight"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                        <div className="flex items-center gap-2">
                            <button
                                onClick={() => setActiveFilter('All')}
                                className={`px-4 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeFilter === 'All' ? 'bg-primary-600 text-white shadow-lg' : 'bg-white text-slate-400 border border-slate-100'}`}
                            >
                                All
                            </button>
                            <button
                                onClick={() => setActiveFilter('Late')}
                                className={`px-4 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeFilter === 'Late' ? 'bg-orange-500 text-white shadow-lg' : 'bg-white text-slate-400 border border-slate-100'}`}
                            >
                                Late
                            </button>
                        </div>
                    </div>

                    {/* Table Content */}
                    <div className="flex-1 overflow-y-auto custom-scrollbar">
                        <table className="w-full text-left table-fixed">
                            <thead className="sticky top-0 z-10 bg-white/95 backdrop-blur-sm border-b border-slate-100 shadow-sm">
                                <tr>
                                    <th className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Employee Member</th>
                                    <th className="px-6 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Date</th>
                                    <th className="w-[120px] px-4 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Status</th>
                                    <th className="w-[80px] px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">#</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50">
                                {filteredRecords.map((rec) => (
                                    <tr
                                        key={rec.id}
                                        onClick={() => setSelectedRecordId(rec.id)}
                                        className={`group cursor-pointer transition-all duration-300 ${selectedRecordId === rec.id ? 'bg-primary-50/50' : 'hover:bg-slate-50/50'}`}
                                    >
                                        <td className="px-8 py-6">
                                            <div className="flex items-center gap-4">
                                                <div className="relative">
                                                    <img src={rec.avatar} className={`w-11 h-11 rounded-[16px] object-cover ring-2 transition-all ${selectedRecordId === rec.id ? 'ring-primary-500 shadow-xl' : 'ring-white'}`} alt="" />
                                                    <div className={`absolute -bottom-1 -right-1 w-3.5 h-3.5 rounded-full border-2 border-white ${rec.status === 'Late' ? 'bg-orange-500' : 'bg-green-500'}`}></div>
                                                </div>
                                                <div>
                                                    <p className={`font-black tracking-tight leading-none mb-1 text-sm ${selectedRecordId === rec.id ? 'text-primary-700' : 'text-slate-800'}`}>{rec.name}</p>
                                                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest truncate">{rec.role}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-4 py-6">
                                            <p className="text-xs font-black text-slate-700">{rec.checkIn}</p>
                                            <p className="text-[9px] text-slate-300 font-bold uppercase tracking-tighter mt-1">{rec.date}</p>
                                        </td>
                                        <td className="px-4 py-6">
                                            <span className={`px-2 py-1 text-[9px] font-black rounded-lg border leading-none ${rec.status === 'Late' ? 'bg-orange-50 text-orange-600 border-orange-100' : 'bg-green-50 text-green-600 border-green-100'}`}>
                                                {rec.status}
                                            </span>
                                        </td>
                                        <td className="px-8 py-6 text-right">
                                            <div className={`p-2 rounded-xl transition-all ${selectedRecordId === rec.id ? 'bg-primary-600 text-white shadow-lg' : 'text-slate-200 group-hover:text-primary-300'}`}>
                                                <ArrowRight size={16} />
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Right Column: Deep Dive Diagnostic Panel (Perfection) */}
                <div className="w-full lg:w-[450px] flex flex-col gap-8 shrink-0 animate-in slide-in-from-right-8 duration-700 overflow-y-auto no-scrollbar">

                    {/* 1. Selected User Mini-Profile */}
                    <div className="card-soft bg-white p-8 border-slate-100 shadow-soft text-center group">
                        <div className="relative inline-block mb-6">
                            <div className="w-32 h-32 rounded-[42px] overflow-hidden border-8 border-slate-50 shadow-2xl transition-transform group-hover:scale-105 duration-500">
                                <img src={selectedRecord.avatar} className="w-full h-full object-cover" alt="" />
                            </div>
                            <div className="absolute top-0 right-0 p-3 bg-primary-600 text-white rounded-full shadow-2xl animate-pulse">
                                <ShieldCheck size={20} />
                            </div>
                        </div>
                        <h3 className="text-3xl font-black text-slate-800 tracking-tight leading-none mb-2">{selectedRecord.name}</h3>
                        <p className="text-primary-600 font-bold text-[10px] uppercase tracking-[0.2em] leading-none">{selectedRecord.role}</p>

                        <div className="grid grid-cols-2 gap-4 mt-8 pt-8 border-t border-slate-50">
                            <div className="p-4 bg-slate-50 rounded-[28px] border border-slate-100">
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Verify Method</p>
                                <p className="text-xs font-black text-slate-800">{selectedRecord.verif}</p>
                            </div>
                            <div className="p-4 bg-slate-50 rounded-[28px] border border-slate-100">
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Audit Time</p>
                                <p className="text-xs font-black text-slate-800">{selectedRecord.verifTime}</p>
                            </div>
                        </div>
                    </div>

                    {/* 2. Geo-Diagnostic Widget */}
                    <div className="card-soft bg-white p-8 border-slate-100 shadow-soft space-y-6">
                        <div className="flex items-center justify-between">
                            <h4 className="text-[11px] font-black text-slate-800 uppercase tracking-[0.2em]">Geo-Verification Diagnostics</h4>
                            <Globe size={16} className="text-primary-400" />
                        </div>
                        <div className="aspect-video bg-slate-50 rounded-[32px] border border-slate-100 relative overflow-hidden group/map">
                            <div className="absolute inset-0 bg-[url('https://maps.googleapis.com/maps/api/staticmap?center=19.076,72.877&zoom=14&size=600x300&sensor=false')] bg-cover opacity-60 grayscale group-hover/map:grayscale-0 transition-all duration-700"></div>
                            <div className="absolute inset-0 flex items-center justify-center">
                                <div className="relative">
                                    <div className="absolute w-12 h-12 bg-primary-500/20 rounded-full animate-ping"></div>
                                    <MapPin size={32} className="text-primary-600 relative z-10 drop-shadow-2xl" />
                                </div>
                            </div>
                            <div className="absolute bottom-4 left-4 right-4 bg-white/90 backdrop-blur-md p-3 rounded-2xl border border-white/50 shadow-xl">
                                <div className="flex items-center gap-3">
                                    <MapPin size={14} className="text-primary-500" />
                                    <p className="text-[10px] font-black text-slate-800 truncate">{selectedRecord.location}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* 3. Device Fingerprint & IP Hub */}
                    <div className="card-soft bg-slate-900 border-none text-white p-8 shadow-2xl relative overflow-hidden">
                        <div className="relative z-10 space-y-6">
                            <div className="flex items-center justify-between opacity-40">
                                <h4 className="text-[10px] font-black uppercase tracking-widest">Network Analytics</h4>
                                <Activity size={16} strokeWidth={2.5} />
                            </div>
                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        {selectedRecord.device.includes('iPhone') ? <Smartphone size={18} className="text-indigo-400" /> : <Laptop size={18} className="text-indigo-400" />}
                                        <span className="text-sm font-bold opacity-80">{selectedRecord.device}</span>
                                    </div>
                                    <span className="text-[10px] font-black text-indigo-400">Log ID: #62AQ5</span>
                                </div>
                                <div className="p-4 bg-white/5 rounded-2xl border border-white/5 space-y-1">
                                    <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Source IP Intelligence</p>
                                    <p className="text-sm font-mono font-bold text-primary-400 truncate">{selectedRecord.ip}</p>
                                </div>
                            </div>
                        </div>
                        {/* Background Glow */}
                        <div className="absolute top-0 right-0 w-48 h-48 bg-primary-600/10 rounded-full blur-[80px] -mr-24 -mt-24"></div>
                    </div>

                    {/* 4. Mini Audit Timeline */}
                    <div className="px-8">
                        <h4 className="text-[10px] font-black text-slate-300 uppercase tracking-widest mb-6 border-b border-slate-100 pb-2">Verification History Log</h4>
                        <div className="space-y-6 relative ml-2">
                            <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-slate-100 -ml-0.5"></div>
                            {[
                                { label: 'System Check-in', time: selectedRecord.checkIn, status: 'Success' },
                                { label: 'Platform Handshake', time: '08:52:08 AM', status: 'Success' },
                                { label: 'Location Pin-drop', time: '08:52:05 AM', status: 'Verified' },
                            ].map((t, i) => (
                                <div key={i} className="flex items-center gap-4 relative">
                                    <div className="w-2 h-2 rounded-full bg-slate-200 border-2 border-white shadow-sm -ml-[5px] relative z-10 group-hover:bg-primary-500 transition-colors"></div>
                                    <div className="flex-1">
                                        <div className="flex items-center justify-between">
                                            <p className="text-[11px] font-bold text-slate-800">{t.label}</p>
                                            <span className="text-[9px] font-black text-green-500 uppercase">{t.status}</span>
                                        </div>
                                        <p className="text-[9px] text-slate-400 font-bold">{t.time}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

            </div>

            {/* Footer System Diagnostics */}
            <div className="shrink-0 flex items-center justify-between px-10 py-5 bg-slate-50 border border-slate-100 rounded-[32px] text-slate-400 shadow-inner">
                <div className="flex items-center gap-6">
                    <div className="flex items-center gap-2">
                        <div className="w-2.5 h-2.5 rounded-full bg-green-500 shadow-sm animate-pulse"></div>
                        <span className="text-[10px] font-black uppercase tracking-widest">Identity Pipeline: ACTIVE</span>
                    </div>
                    <div className="h-4 w-px bg-slate-200"></div>
                    <p className="text-[10px] font-black uppercase tracking-widest opacity-60">Verified {records.length} enterprise nodes across H1 2023</p>
                </div>
                <div className="flex items-center gap-3">
                    <button className="p-2 hover:text-slate-800 transition-colors"><Info size={16} /></button>
                    <button className="p-2 hover:text-slate-800 transition-colors"><Activity size={16} /></button>
                </div>
            </div>

        </div>
    );
};

export default CheckInRecords;
