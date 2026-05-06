import React, { useEffect, useState } from 'react';
import {
    Search,
    Filter,
    ChevronRight,
    Clock,
    CheckCircle2,
    XCircle,
    User,
    Calendar,
    MoreHorizontal,
    Mail,
    ArrowRight,
    ShieldCheck,
    AlertCircle,
    Undo2,
    Check,
    X,
    LayoutGrid,
    List,
    MapPin,
    Briefcase,
    UserPlus,
    LayoutDashboard,
    Users,
    ClipboardList,
    Settings
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { getCandidateReview, shortlistCandidate, rejectCandidate } from '../../../services/hrApi';

const Applications = () => {
    const navigate = useNavigate();
    const [searchQuery, setSearchQuery] = useState('');
    const [activeTab, setActiveTab] = useState('New');
    const [viewMode, setViewMode] = useState('Grid');
    const [notification, setNotification] = useState(null);

    const defaultApplicants = [
        {
            id: 'CAN-9021',
            name: 'Alex Rivers',
            role: 'Senior Software Engineer',
            dept: 'Engineering',
            location: 'Remote (San Francisco, CA)',
            appliedAt: 'Oct 24, 2023',
            status: 'New',
            avatar: 'https://i.pravatar.cc/150?u=alex'
        },
        {
            id: 'CAN-9022',
            name: 'Sarah Chen',
            role: 'Product Designer',
            dept: 'Design',
            location: 'London, UK',
            appliedAt: 'Oct 22, 2023',
            status: 'New',
            avatar: 'https://i.pravatar.cc/150?u=sarah'
        },
        {
            id: 'CAN-9023',
            name: 'Marcus Thompson',
            role: 'Account Executive',
            dept: 'Sales',
            location: 'New York, NY',
            appliedAt: 'Oct 21, 2023',
            status: 'New',
            avatar: 'https://i.pravatar.cc/150?u=marcus'
        },
        {
            id: 'CAN-9024',
            name: 'Elena Rodriguez',
            role: 'HR Manager',
            dept: 'People Ops',
            location: 'Austin, TX',
            appliedAt: 'Oct 19, 2023',
            status: 'New',
            avatar: 'https://i.pravatar.cc/150?u=elena'
        },
    ];

    const [applicants, setApplicants] = useState(defaultApplicants);

    useEffect(() => {
        let isMounted = true;

        const loadApplicants = async () => {
            try {
                const res = await getCandidateReview();
                const payload = Array.isArray(res.data?.data) ? res.data.data : [];
                const mapped = payload.map((item, index) => ({
                    id: item.id || item.candidateId || item._id || item.code || `CAN-${index + 1}`,
                    name: item.name || item.fullName || item.candidateName || `Candidate ${index + 1}`,
                    role: item.role || item.jobTitle || item.position || 'Role Pending',
                    dept: item.department || item.dept || item.team || '—',
                    location: item.location || item.city || item.workLocation || '—',
                    appliedAt: item.appliedAt || item.createdAt || item.submittedAt || '—',
                    status: item.status || item.stage || 'New',
                    avatar: item.avatar || item.profilePicture || `https://i.pravatar.cc/150?u=${encodeURIComponent(item.email || item.name || index)}`
                }));

                if (isMounted && mapped.length) {
                    setApplicants(mapped);
                }
            } catch (err) {
                console.error('Failed to load applications:', err);
            }
        };

        loadApplicants();

        return () => {
            isMounted = false;
        };
    }, []);

    const showNotification = (msg) => {
        setNotification(msg);
        setTimeout(() => setNotification(null), 3000);
    };

    const handleAction = async (id, newStatus) => {
        const action = newStatus === 'Shortlisted' ? shortlistCandidate : newStatus === 'Rejected' ? rejectCandidate : null;
        try {
            if (action) {
                await action(id, { status: newStatus });
            }
            setApplicants((prev) => prev.map((app) => app.id === id ? { ...app, status: newStatus } : app));
            showNotification(`Candidate ${id} moved to ${newStatus}.`);
        } catch (err) {
            console.error('Candidate action failed:', err);
            showNotification(`Failed to update ${id}.`);
        }
    };

    const filteredApplicants = applicants.filter(app => {
        const matchesSearch = app.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            app.role.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesTab = activeTab === 'All' || app.status === activeTab;
        return matchesSearch && matchesTab;
    });

    return (
        <div className="flex flex-col h-[calc(100vh-120px)] w-full gap-8 animate-in fade-in slide-in-from-bottom-4 duration-700 relative pt-4 overflow-hidden text-left">

            {/* Notification */}
            {notification && (
                <div className="fixed top-24 right-8 z-100 animate-in slide-in-from-right-8 fade-in flex items-center gap-3 bg-slate-900 text-white px-6 py-4 rounded-2xl shadow-2xl border border-white/10">
                    <Check size={20} className="text-emerald-400" />
                    <span className="text-sm font-black uppercase tracking-widest">{notification}</span>
                </div>
            )}

            {/* Header Section */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 shrink-0">
                <div className="flex items-center gap-6">
                    <button
                        onClick={() => navigate('/recruitment')}
                        className="p-4 bg-white border border-slate-100 text-slate-400 hover:text-slate-800 rounded-2xl shadow-sm transition-all hover:-translate-x-1 active:scale-95"
                    >
                        <Undo2 size={20} />
                    </button>
                    <div>
                        <h1 className="text-4xl font-black text-slate-800 tracking-tight leading-none mb-2 text-left uppercase">Review Applications</h1>
                        <div className="flex items-center gap-4">
                            <span className="flex items-center gap-2 px-3 py-1 bg-indigo-50 text-indigo-600 rounded-lg text-[10px] font-black uppercase tracking-[0.2em]">
                                <UserPlus size={12} />
                                12 New Today
                            </span>
                            <span className="flex items-center gap-2 px-3 py-1 bg-slate-50 text-slate-400 rounded-lg text-[10px] font-black uppercase tracking-[0.2em]">
                                <Clock size={12} />
                                48 Pending Reviews
                            </span>
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <div className="flex p-1 bg-slate-100 rounded-xl">
                        <button
                            onClick={() => setViewMode('List')}
                            className={`p-2 rounded-lg transition-all ${viewMode === 'List' ? 'bg-white shadow-sm text-primary-600' : 'text-slate-400 hover:text-slate-600'}`}
                        >
                            <List size={18} />
                        </button>
                        <button
                            onClick={() => setViewMode('Grid')}
                            className={`p-2 rounded-lg transition-all ${viewMode === 'Grid' ? 'bg-white shadow-sm text-primary-600' : 'text-slate-400 hover:text-slate-600'}`}
                        >
                            <LayoutGrid size={18} />
                        </button>
                    </div>
                    <button
                        onClick={() => showNotification("Synchronizing global candidate pool...")}
                        className="px-10 py-3 bg-slate-900 text-white font-black rounded-2xl hover:bg-slate-800 transition-all shadow-xl shadow-slate-200 uppercase tracking-[0.2em] text-[10px] active:scale-95"
                    >
                        Sync Pipeline
                    </button>
                </div>
            </div>

            {/* Toolbar */}
            <div className="px-10 py-6 bg-white border border-slate-100 rounded-[32px] shadow-soft flex flex-col lg:flex-row lg:items-center justify-between gap-6 shrink-0">
                <div className="flex items-center gap-8">
                    {['New', 'Shortlisted', 'Interview', 'Rejected', 'All'].map(tab => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`text-[11px] font-black uppercase tracking-[0.2em] transition-all relative py-2 ${activeTab === tab ? 'text-indigo-600' : 'text-slate-300 hover:text-slate-800'}`}
                        >
                            {tab === 'New' ? `New (24)` : tab === 'Shortlisted' ? `Shortlisted (12)` : tab}
                            {activeTab === tab && <div className="absolute bottom-0 left-0 right-0 h-1 bg-indigo-600 rounded-full animate-in zoom-in-y"></div>}
                        </button>
                    ))}
                </div>

                <div className="flex items-center gap-4 w-full lg:w-auto">
                    <div className="relative group max-w-sm w-full lg:w-64">
                        <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-hover:text-indigo-500 transition-colors" />
                        <input
                            type="text"
                            placeholder="Search applicants..."
                            className="w-full bg-slate-50 border border-slate-100 focus:border-indigo-100 outline-none rounded-2xl pl-12 pr-4 py-3 text-xs font-black text-slate-600 transition-all shadow-sm uppercase tracking-tight"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                    <button className="p-3 bg-slate-50 border border-slate-100 text-slate-400 hover:text-indigo-600 rounded-xl transition-all shadow-sm active:scale-95">
                        <Filter size={20} />
                    </button>
                </div>
            </div>

            {/* Applicants Workspace */}
            <div className="flex-1 overflow-y-auto no-scrollbar pb-20">
                <div className={`grid ${viewMode === 'Grid' ? 'grid-cols-1 md:grid-cols-2 xl:grid-cols-3' : 'grid-cols-1'} gap-6`}>
                    {filteredApplicants.map((applicant) => (
                        <div key={applicant.id} className="card-soft bg-white p-8 border-slate-100 shadow-soft hover:shadow-2xl hover:-translate-y-1 transition-all group relative overflow-hidden">
                            <div className="flex items-start justify-between mb-8 relative z-10">
                                <div className="flex items-center gap-5">
                                    <div className="relative">
                                        <img src={applicant.avatar} className="w-16 h-16 rounded-[24px] object-cover shadow-lg border-2 border-white group-hover:scale-110 transition-transform duration-500" alt="" />
                                        <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-indigo-500 border-2 border-white rounded-full flex items-center justify-center text-[8px] text-white font-bold">
                                            <Check size={10} />
                                        </div>
                                    </div>
                                    <div>
                                        <h3 className="text-[14px] font-black text-slate-800 tracking-tight leading-none mb-1 group-hover:text-indigo-600 transition-colors uppercase">{applicant.name}</h3>
                                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-[0.2em]">Applied {applicant.appliedAt}</p>
                                    </div>
                                </div>
                                <button className="p-2 text-slate-300 hover:text-slate-800 rounded-xl transition-all"><MoreHorizontal size={20} /></button>
                            </div>

                            <div className="space-y-4 mb-8 relative z-10">
                                <div className="flex items-center gap-3 p-3 bg-slate-50/50 rounded-xl border border-slate-50 group-hover:bg-indigo-50/30 group-hover:border-indigo-50 transition-all">
                                    <Briefcase size={14} className="text-indigo-500" />
                                    <p className="text-[11px] font-black text-slate-600 uppercase tracking-[0.15em]">{applicant.role}</p>
                                </div>
                                <div className="flex items-center gap-3 p-3 bg-slate-50/50 rounded-xl border border-slate-50 group-hover:bg-emerald-50/30 group-hover:border-emerald-50 transition-all">
                                    <MapPin size={14} className="text-emerald-500" />
                                    <p className="text-[11px] font-black text-slate-600 uppercase tracking-[0.15em]">{applicant.location}</p>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-3 relative z-10">
                                <button
                                    onClick={() => navigate(`/recruitment/candidate/${applicant.id}`)}
                                    className="py-3 bg-primary-600 text-white font-black rounded-xl hover:bg-primary-700 transition-all shadow-lg shadow-primary-500/20 uppercase tracking-[0.2em] text-[9px] flex items-center justify-center gap-2 active:scale-95"
                                >
                                    <ShieldCheck size={14} />
                                    Review
                                </button>
                                <button
                                    onClick={() => handleAction(applicant.id, 'Shortlisted')}
                                    className="py-3 bg-emerald-50 text-emerald-600 border border-emerald-100 font-black rounded-xl hover:bg-emerald-100 transition-all uppercase tracking-[0.2em] text-[9px] active:scale-95"
                                >
                                    Shortlist
                                </button>
                                <button
                                    onClick={() => navigate('/recruitment/interviews/schedule')}
                                    className="py-3 bg-orange-50 text-orange-600 border border-orange-100 font-black rounded-xl hover:bg-orange-100 transition-all uppercase tracking-[0.2em] text-[9px] flex items-center justify-center gap-2 active:scale-95"
                                >
                                    <Calendar size={14} />
                                    Schedule
                                </button>
                                <button
                                    onClick={() => handleAction(applicant.id, 'Rejected')}
                                    className="py-3 bg-rose-50 text-rose-600 border border-rose-100 font-black rounded-xl hover:bg-rose-100 transition-all uppercase tracking-[0.2em] text-[9px] active:scale-95"
                                >
                                    Reject
                                </button>
                            </div>

                            {/* Decorative background element */}
                            <div className="absolute -right-8 -bottom-8 w-24 h-24 bg-slate-50 rounded-full group-hover:scale-150 transition-transform duration-700 opacity-50"></div>
                        </div>
                    ))}
                </div>

                {/* Pagination Placeholder */}
                <div className="mt-12 flex items-center justify-between px-10">
                    <p className="text-[10px] text-slate-400 font-black uppercase tracking-[0.2em]">Showing 1-4 of 24 applications</p>
                    <div className="flex items-center gap-2">
                        {[1, 2, 3].map(p => (
                            <button key={p} className={`w-10 h-10 rounded-xl font-black text-xs transition-all ${p === 1 ? 'bg-indigo-600 text-white shadow-lg' : 'bg-white text-slate-400 hover:bg-slate-50 border border-slate-100'}`}>{p}</button>
                        ))}
                        <button className="w-10 h-10 rounded-xl bg-white border border-slate-100 text-slate-400 hover:bg-slate-50 transition-all flex items-center justify-center">
                            <ArrowRight size={16} />
                        </button>
                    </div>
                </div>
            </div>

            {/* Desktop Navigation Footer */}
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-slate-900 px-10 py-4 rounded-[32px] shadow-2xl flex items-center gap-10 border border-white/10 shrink-0">
                {[
                    { icon: LayoutDashboard, label: 'Dashboard', path: '/recruitment' },
                    { icon: Users, label: 'Candidates', path: '/recruitment/candidates' },
                    { icon: ClipboardList, label: 'Applications', path: '/recruitment/applications', active: true },
                    { icon: Settings, label: 'Settings', path: '/settings' },
                ].map((item, i) => (
                    <button
                        key={i}
                        onClick={() => navigate(item.path)}
                        className={`flex flex-col items-center gap-1 transition-all ${item.active ? 'text-indigo-400 scale-110' : 'text-slate-500 hover:text-white hover:scale-105'}`}
                    >
                        <item.icon size={18} />
                        <span className="text-[8px] font-black uppercase tracking-[0.2em]">{item.label}</span>
                    </button>
                ))}
            </div>
        </div>
    );
};

export default Applications;
