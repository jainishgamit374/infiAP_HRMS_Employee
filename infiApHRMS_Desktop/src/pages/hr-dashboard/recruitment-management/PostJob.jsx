import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
    ArrowLeft, 
    X, 
    MapPin, 
    Calendar, 
    Rocket, 
    Save, 
    ChevronDown,
    Briefcase,
    Building2,
    DollarSign,
    CheckCircle2
} from 'lucide-react';
import { useJobContext } from '../../../context/JobContext';

const PostJob = () => {
    const navigate = useNavigate();
    const { addJob } = useJobContext();
    const [skills, setSkills] = useState(['React', 'Node.js', 'Tailwind CSS']);
    const [skillInput, setSkillInput] = useState('');
    const [showSuccess, setShowSuccess] = useState(false);
    const [formData, setFormData] = useState({
        title: '',
        department: 'Engineering',
        type: 'Full-time',
        experience: 'Mid (3-5 years)',
        salary: '',
        location: '',
        deadline: '',
        description: ''
    });

    const handleAddSkill = (e) => {
        if (e.key === 'Enter' && skillInput.trim()) {
            if (!skills.includes(skillInput.trim())) {
                setSkills([...skills, skillInput.trim()]);
            }
            setSkillInput('');
            e.preventDefault();
        }
    };

    const removeSkill = (skill) => {
        setSkills(skills.filter(s => s !== skill));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        addJob({
            ...formData,
            skills
        });
        setShowSuccess(true);
        setTimeout(() => {
            setShowSuccess(false);
            navigate('/recruitment');
        }, 3000);
    };

    return (
        <div className="max-w-[1200px] mx-auto pb-40 animate-in fade-in slide-in-from-bottom-8 duration-700 text-left">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12 border-b border-slate-50 pb-12">
                <div className="flex items-center gap-6">
                    <button 
                        onClick={() => navigate('/recruitment')}
                        className="p-4 bg-white rounded-2xl text-slate-400 hover:text-indigo-600 transition-all shadow-soft group"
                    >
                        <ArrowLeft size={24} className="group-hover:-translate-x-1 transition-transform" />
                    </button>
                    <div>
                        <h1 className="text-4xl font-black text-slate-800 tracking-tight leading-none mb-2">Job Posting</h1>
                        <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">Create a new career gateway for global talent</p>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <button 
                        onClick={() => navigate('/recruitment/active-jobs')}
                        className="px-8 py-3 bg-white border border-slate-100 text-slate-400 font-black text-[10px] uppercase rounded-xl hover:bg-slate-50 transition-all shadow-sm"
                    >
                        View active jobs
                    </button>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                
                {/* Main Form Area */}
                <div className="lg:col-span-2 space-y-8">
                    <div className="bg-white p-12 rounded-[48px] border border-slate-50 shadow-soft space-y-12">
                        
                        {/* Section 1: Core Identification */}
                        <div className="space-y-8">
                            <h3 className="text-[10px] font-black text-indigo-600 uppercase tracking-[0.25em] mb-4">Core Identification</h3>
                            
                            <div className="space-y-4">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">Job Title</label>
                                <input 
                                    type="text" 
                                    placeholder="e.g. Senior Frontend Engineer"
                                    className="w-full bg-slate-50 border border-slate-100 rounded-[24px] px-8 py-5 text-sm font-bold placeholder:text-slate-300 outline-none focus:ring-4 focus:ring-indigo-500/5 focus:border-indigo-500/20 transition-all shadow-inner"
                                    required
                                    value={formData.title}
                                    onChange={(e) => setFormData({...formData, title: e.target.value})}
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="space-y-4">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">Department</label>
                                    <div className="relative">
                                        <select 
                                            className="w-full bg-slate-50 border border-slate-100 rounded-[24px] px-8 py-5 text-sm font-bold outline-none focus:ring-4 focus:ring-indigo-500/5 transition-all shadow-inner appearance-none"
                                            value={formData.department}
                                            onChange={(e) => setFormData({...formData, department: e.target.value})}
                                        >
                                            <option>Engineering</option>
                                            <option>Design</option>
                                            <option>Marketing</option>
                                            <option>Sales</option>
                                            <option>Operations</option>
                                        </select>
                                        <ChevronDown className="absolute right-8 top-1/2 -translate-y-1/2 text-slate-300 pointer-events-none" size={20} />
                                    </div>
                                </div>
                                <div className="space-y-4">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">Employment Type</label>
                                    <div className="relative">
                                        <select 
                                            className="w-full bg-slate-50 border border-slate-100 rounded-[24px] px-8 py-5 text-sm font-bold outline-none focus:ring-4 focus:ring-indigo-500/5 transition-all shadow-inner appearance-none"
                                            value={formData.type}
                                            onChange={(e) => setFormData({...formData, type: e.target.value})}
                                        >
                                            <option>Full-time</option>
                                            <option>Contract</option>
                                            <option>Freelance</option>
                                            <option>Remote</option>
                                        </select>
                                        <ChevronDown className="absolute right-8 top-1/2 -translate-y-1/2 text-slate-300 pointer-events-none" size={20} />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Section 2: Compensation & Logistics */}
                        <div className="space-y-8">
                            <h3 className="text-[10px] font-black text-indigo-600 uppercase tracking-[0.25em] mb-4">Compensation & Logistics</h3>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="space-y-4">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">Salary Range (Annual)</label>
                                    <div className="relative group">
                                        <DollarSign className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-indigo-500 transition-colors" size={18} />
                                        <input 
                                            type="text" 
                                            placeholder="e.g. $120k - $160k"
                                            className="w-full bg-slate-50 border border-slate-100 rounded-[24px] pl-14 pr-8 py-5 text-sm font-bold outline-none focus:ring-4 focus:ring-indigo-500/5 transition-all shadow-inner"
                                            value={formData.salary}
                                            onChange={(e) => setFormData({...formData, salary: e.target.value})}
                                        />
                                    </div>
                                </div>
                                <div className="space-y-4">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">Location</label>
                                    <div className="relative group">
                                        <MapPin className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-indigo-500 transition-colors" size={18} />
                                        <input 
                                            type="text" 
                                            placeholder="City, Country or Remote"
                                            className="w-full bg-slate-50 border border-slate-100 rounded-[24px] pl-14 pr-8 py-5 text-sm font-bold outline-none focus:ring-4 focus:ring-indigo-500/5 transition-all shadow-inner"
                                            value={formData.location}
                                            onChange={(e) => setFormData({...formData, location: e.target.value})}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Section 3: Deep Protocol */}
                        <div className="space-y-8">
                            <h3 className="text-[10px] font-black text-indigo-600 uppercase tracking-[0.25em] mb-4">Role Description & Skills</h3>
                            
                            <div className="space-y-4">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">Required Skills</label>
                                <div className="w-full bg-slate-50 border border-slate-100 rounded-[32px] px-8 py-6 flex flex-wrap gap-3 shadow-inner">
                                    {skills.map(skill => (
                                        <span key={skill} className="bg-white border border-slate-100 text-slate-600 text-[10px] font-black px-5 py-2.5 rounded-xl flex items-center gap-2 group hover:border-indigo-200 transition-all shadow-sm">
                                            {skill}
                                            <X 
                                                size={14} 
                                                className="cursor-pointer text-slate-300 hover:text-rose-500 transition-colors" 
                                                onClick={() => removeSkill(skill)}
                                            />
                                        </span>
                                    ))}
                                    <input 
                                        type="text"
                                        placeholder="Add skill + Enter"
                                        className="bg-transparent border-none outline-none text-[10px] font-black text-slate-600 placeholder:text-slate-300 py-2 min-w-[150px] ml-2"
                                        value={skillInput}
                                        onChange={(e) => setSkillInput(e.target.value)}
                                        onKeyDown={handleAddSkill}
                                    />
                                </div>
                            </div>

                            <div className="space-y-4">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">Full Description</label>
                                <textarea 
                                    placeholder="Outline the mission, requirements, and tech stack..."
                                    rows={8}
                                    className="w-full bg-slate-50 border border-slate-100 rounded-[40px] px-10 py-8 text-sm font-bold placeholder:text-slate-300 outline-none focus:ring-4 focus:ring-indigo-500/5 transition-all shadow-inner resize-none leading-relaxed"
                                    value={formData.description}
                                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                                ></textarea>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Sidebar Configuration */}
                <div className="space-y-8">
                    <div className="bg-slate-900 p-10 rounded-[44px] text-white space-y-8 border-none shadow-2xl shadow-slate-200 sticky top-12">
                        <div>
                            <h4 className="text-xs font-black uppercase tracking-widest mb-2">Publish Intelligence</h4>
                            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Global Talent Distribution</p>
                        </div>

                        <div className="space-y-6 pt-4">
                            <div className="flex items-center justify-between p-4 bg-white/5 rounded-2xl hover:bg-white/10 transition-all cursor-pointer">
                                <span className="text-[10px] font-black uppercase tracking-widest">Internal Visibility</span>
                                <div className="w-10 h-5 bg-indigo-600 rounded-full flex items-center justify-end px-1"><div className="w-3 h-3 bg-white rounded-full"></div></div>
                            </div>
                            <div className="flex items-center justify-between p-4 bg-white/5 rounded-2xl hover:bg-white/10 transition-all cursor-pointer">
                                <span className="text-[10px] font-black uppercase tracking-widest">Public Career Page</span>
                                <div className="w-10 h-5 bg-indigo-600 rounded-full flex items-center justify-end px-1"><div className="w-3 h-3 bg-white rounded-full"></div></div>
                            </div>
                            <div className="flex items-center justify-between p-4 bg-white/5 rounded-2xl hover:bg-white/10 transition-all cursor-pointer">
                                <span className="text-[10px] font-black uppercase tracking-widest">LinkedIn Sync</span>
                                <div className="w-10 h-5 bg-white/20 rounded-full flex items-center justify-start px-1"><div className="w-3 h-3 bg-white rounded-full"></div></div>
                            </div>
                        </div>

                        <div className="pt-8 space-y-4">
                            <button 
                                type="submit"
                                className="w-full py-6 bg-indigo-600 text-white font-black text-xs uppercase tracking-[0.25em] rounded-[28px] shadow-xl shadow-indigo-900/40 hover:bg-white hover:text-slate-900 transition-all flex items-center justify-center gap-4 active:scale-95 group"
                            >
                                <Rocket size={20} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                                Launch Role
                            </button>
                            <button 
                                type="button"
                                className="w-full py-6 border-2 border-white/10 text-white font-black text-xs uppercase tracking-[0.25em] rounded-[28px] hover:bg-white/5 transition-all flex items-center justify-center gap-4 active:scale-95"
                            >
                                <Save size={20} />
                                Draft Buffer
                            </button>
                        </div>
                    </div>

                    <div className="bg-white p-8 rounded-[40px] border border-slate-50 shadow-soft">
                        <div className="flex items-center gap-4 mb-6">
                            <div className="w-12 h-12 bg-indigo-50 text-indigo-500 rounded-2xl flex items-center justify-center shadow-sm">
                                <Calendar size={20} />
                            </div>
                            <div>
                                <h4 className="text-xs font-black text-slate-800 uppercase tracking-widest">Post Duration</h4>
                                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Scheduled offline</p>
                            </div>
                        </div>
                        <input 
                            type="date" 
                            className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 text-xs font-black outline-none focus:ring-4 focus:ring-indigo-500/5 transition-all shadow-inner"
                        />
                    </div>
                </div>
            </form>

            {/* Success Modal */}
            {showSuccess && (
                <div className="fixed inset-0 z-[1000] flex items-center justify-center p-6 text-center">
                    <div className="absolute inset-0 bg-slate-900/80 backdrop-blur-md animate-in fade-in duration-500"></div>
                    <div className="relative bg-white rounded-[64px] p-16 md:p-24 shadow-2xl max-w-2xl w-full animate-in zoom-in-95 fade-in duration-500">
                        <div className="w-32 h-32 bg-emerald-50 text-emerald-500 rounded-[48px] flex items-center justify-center mx-auto mb-12 shadow-xl shadow-emerald-100">
                            <CheckCircle2 size={64} strokeWidth={3} className="animate-in slide-in-from-bottom-4 duration-1000" />
                        </div>
                        <h2 className="text-5xl font-black text-slate-800 tracking-tighter mb-6">Mission Published</h2>
                        <p className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-12">The talent acquisition protocols have been initiated. The role is now live in the global pipeline.</p>
                        <div className="flex flex-col md:flex-row items-center gap-6">
                            <button 
                                onClick={() => navigate('/recruitment')}
                                className="w-full py-6 bg-slate-900 text-white font-black text-xs uppercase tracking-[0.25em] rounded-[28px] hover:bg-indigo-600 transition-all shadow-lg active:scale-95"
                            >
                                Back to Command
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default PostJob;
