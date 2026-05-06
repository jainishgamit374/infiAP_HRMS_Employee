import React, { useState } from 'react';
import { 
  Undo2, 
  Send, 
  ShieldCheck, 
  Info, 
  Calendar, 
  Briefcase, 
  MessageCircle,
  AlertTriangle,
  FileSignature
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { createResignation } from '../../../services/hrApi';

const SubmitResignation = () => {
    const navigate = useNavigate();
    const [submitted, setSubmitted] = useState(false);
    const [formData, setFormData] = useState({
        employeeName: 'Alex Henderson',
        department: 'Product Engineering',
        noticeDate: '',
        lastDay: '',
        reason: '',
        comments: ''
    });

    const reasons = [
        'Better Opportunity',
        'Relocation',
        'Personal Reasons',
        'Career Change',
        'Higher Education',
        'Other'
    ];

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitError, setSubmitError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setSubmitError('');
        try {
            await createResignation({
                employeeName: formData.employeeName,
                department: formData.department,
                noticeDate: formData.noticeDate,
                lastWorkingDay: formData.lastDay,
                reason: formData.reason,
                comments: formData.comments,
            });
            setSubmitted(true);
        } catch (err) {
            setSubmitError(err.response?.data?.error || 'Failed to submit resignation');
        } finally {
            setIsSubmitting(false);
        }
    };

    if (submitted) {
        return (
            <div className="flex flex-col min-h-[calc(100vh-120px)] w-full items-center justify-center animate-in fade-in zoom-in-95 duration-700 text-left">
                <div className="max-w-xl w-full card-soft bg-white p-12 border-slate-100 shadow-2xl text-center relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-primary-50 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
                    <div className="relative z-10 flex flex-col items-center text-center">
                        <div className="w-24 h-24 bg-primary-50 rounded-[32px] flex items-center justify-center text-primary-500 mb-8 border-4 border-white shadow-xl animate-bounce">
                            <ShieldCheck size={48} strokeWidth={2.5} />
                        </div>
                        <h2 className="text-4xl font-black text-slate-800 tracking-tight leading-none mb-6 text-center">Protocol Initiated</h2>
                        <p className="text-slate-400 text-sm font-medium uppercase tracking-widest leading-relaxed mb-10 max-w-sm mx-auto text-center">
                            Your resignation node has been successfully synchronized with the HRMS core. The exit lifecycle for <span className="text-primary-600 font-black">{formData.employeeName}</span> is now active.
                        </p>
                        <button 
                            onClick={() => navigate('/resignation')}
                            className="w-full py-5 bg-slate-900 text-white font-black rounded-2xl hover:bg-slate-800 transition-all shadow-xl shadow-slate-200 uppercase tracking-[0.2em] text-[11px] active:scale-95"
                        >
                            Return to Exit Hub
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-col min-h-[calc(100vh-120px)] w-full gap-10 animate-in fade-in slide-in-from-bottom-4 duration-700 relative pt-4 text-left pb-20">
            
            {/* Header */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 shrink-0 text-left">
                <div className="flex items-center gap-6 text-left">
                    <button 
                        onClick={() => navigate('/resignation')}
                        className="p-4 bg-white border border-slate-100 text-slate-400 hover:text-slate-800 rounded-2xl shadow-sm transition-all hover:-translate-x-1 active:scale-95 text-left"
                    >
                        <Undo2 size={20} />
                    </button>
                    <div className="text-left">
                        <h1 className="text-4xl font-black text-slate-800 tracking-tight leading-none mb-2 text-left">Resignation Gateway</h1>
                        <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mt-1 text-left leading-none">Formal Exit Protocol Initiation & Data Entry</p>
                    </div>
                </div>
            </div>

            {/* Form Workspace */}
            <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-10 text-left">
                
                {/* 1. SIDEBAR: Instructional Content */}
                <div className="xl:col-span-4 flex flex-col gap-10 text-left">
                    <div className="card-soft bg-slate-900 p-10 border-none text-white relative overflow-hidden group text-left">
                        <div className="relative z-10 text-left">
                            <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center mb-8">
                                <FileSignature className="text-primary-400" size={32} />
                            </div>
                            <h3 className="text-2xl font-black uppercase tracking-tighter leading-tight mb-4 text-left">InfiAp Resignation <br/>Portal</h3>
                            <p className="text-xs opacity-60 font-medium leading-relaxed uppercase tracking-[0.2em] mb-10 text-left">Please ensure all fields are synchronized correctly. Once submitted, the exit lifecycle enters an immutable state subject to HR verification.</p>
                            
                            <div className="space-y-6 text-left">
                                {[
                                    { icon: Info, label: 'Notice Period', val: '90 Days Required' },
                                    { icon: AlertTriangle, label: 'Compliance', val: 'Asset Return Sync' }
                                ].map((item, i) => (
                                    <div key={i} className="flex items-center gap-4 py-4 border-b border-white/10 text-left">
                                        <item.icon size={18} className="text-primary-400" />
                                        <div className="text-left">
                                            <p className="text-[8px] font-black uppercase text-white/40 tracking-widest text-left">{item.label}</p>
                                            <p className="text-[10px] font-black uppercase text-left">{item.val}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="absolute -right-20 -bottom-20 w-80 h-80 bg-primary-600/10 rounded-full blur-[100px] group-hover:scale-150 transition-transform"></div>
                    </div>

                    <div className="card-soft bg-white p-8 border-slate-100 shadow-soft text-left">
                        <h4 className="text-[10px] font-black text-slate-800 uppercase tracking-widest mb-6 border-b border-slate-50 pb-4 text-left">Exit Policy Note</h4>
                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-[0.15em] leading-loose text-left">
                            Note: Your submission will be routed to your manager and HR representitve. All recovery assets must be returned by your last working day.
                        </p>
                    </div>
                </div>

                {/* 2. MAIN FORM: Submission Engine */}
                <div className="xl:col-span-8 card-soft bg-white p-12 border border-slate-100 shadow-soft flex flex-col min-h-[600px] text-left">
                    <form onSubmit={handleSubmit} className="space-y-10 text-left">
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 text-left">
                            <div className="space-y-4 text-left">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] text-left">Employee ID/Name</label>
                                <div className="relative text-left">
                                    <Briefcase className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                                    <input 
                                        type="text" 
                                        className="w-full bg-slate-50 border border-slate-100 p-6 rounded-[24px] text-xs font-black text-slate-600 uppercase tracking-tight outline-none pl-16 text-left cursor-not-allowed"
                                        value={formData.employeeName}
                                        disabled
                                    />
                                </div>
                            </div>
                            <div className="space-y-4 text-left">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] text-left">Assigned Department</label>
                                <input 
                                    type="text" 
                                    className="w-full bg-slate-50 border border-slate-100 p-6 rounded-[24px] text-xs font-black text-slate-600 uppercase tracking-tight outline-none text-left cursor-not-allowed"
                                    value={formData.department}
                                    disabled
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 text-left">
                            <div className="space-y-4 text-left">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] text-left">Notice Initiation Date</label>
                                <div className="relative text-left">
                                    <Calendar className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                                    <input 
                                        type="date" 
                                        required
                                        className="w-full bg-slate-50 border border-slate-100 p-6 rounded-[24px] text-xs font-black text-slate-600 uppercase tracking-tight outline-none pl-16 text-left focus:border-primary-100 transition-all font-sans"
                                        onChange={(e) => setFormData({...formData, noticeDate: e.target.value})}
                                    />
                                </div>
                            </div>
                            <div className="space-y-4 text-left">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] text-left">Projected Last Day</label>
                                <div className="relative text-left">
                                    <Calendar className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                                    <input 
                                        type="date" 
                                        required
                                        className="w-full bg-slate-50 border border-slate-100 p-6 rounded-[24px] text-xs font-black text-slate-600 uppercase tracking-tight outline-none pl-16 text-left focus:border-primary-100 transition-all font-sans"
                                        onChange={(e) => setFormData({...formData, lastDay: e.target.value})}
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="space-y-4 text-left">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] text-left">Primary Reason for Exit</label>
                            <select 
                                required
                                className="w-full bg-slate-50 border border-slate-100 p-6 rounded-[24px] text-xs font-black text-slate-600 uppercase tracking-tight outline-none text-left focus:border-primary-100 transition-all"
                                onChange={(e) => setFormData({...formData, reason: e.target.value})}
                            >
                                <option value="">Select a specific driver...</option>
                                {reasons.map(r => <option key={r} value={r}>{r}</option>)}
                            </select>
                        </div>

                        <div className="space-y-4 text-left">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] text-left">Qualitative Comments (Optional)</label>
                            <div className="relative text-left">
                                <MessageCircle className="absolute left-6 top-8 text-slate-300" size={18} />
                                <textarea 
                                    className="w-full h-40 bg-slate-50 border border-slate-100 p-8 pl-16 rounded-[32px] text-xs font-black text-slate-600 uppercase tracking-tight outline-none text-left focus:border-primary-100 transition-all resize-none no-scrollbar"
                                    placeholder="Enter additional details regarding your decision..."
                                    onChange={(e) => setFormData({...formData, comments: e.target.value})}
                                ></textarea>
                            </div>
                        </div>

                        <div className="pt-6 flex flex-col md:flex-row gap-4 text-left">
                            <button 
                                type="submit"
                                className="flex-1 py-6 bg-primary-600 text-white font-black rounded-[28px] hover:bg-primary-700 transition-all shadow-2xl shadow-primary-200 uppercase tracking-[0.3em] text-[11px] active:scale-95 flex items-center justify-center gap-3"
                            >
                                <Send size={18} />
                                Submit Resignation
                            </button>
                            <button 
                                type="button"
                                onClick={() => navigate('/resignation')}
                                className="px-12 py-6 bg-slate-50 text-slate-400 font-black rounded-[28px] hover:bg-slate-100 transition-all uppercase tracking-widest text-[11px]"
                            >
                                Cancel
                            </button>
                        </div>

                    </form>
                </div>

            </div>

        </div>
    );
};

export default SubmitResignation;
