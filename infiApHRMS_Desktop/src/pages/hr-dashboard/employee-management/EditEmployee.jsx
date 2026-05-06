import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
    ArrowLeft,
    User,
    MapPin,
    Briefcase,
    DollarSign,
    ShieldCheck,
    CheckCircle,
    Sparkles,
    ArrowRight,
    Save,
    AlertCircle,
    Activity,
    Shield,
    TrendingUp,
    Clock,
    UserPlus
} from 'lucide-react';
import { useEmployeeContext } from '../../../context/EmployeeContext';

const EditEmployee = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { employees, updateEmployee } = useEmployeeContext();

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [error, setError] = useState(null);

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        role: '',
        department: '',
        manager: '',
        location: '',
        status: ''
    });

    // --- IDENTITY FETCH ---
    useEffect(() => {
        const employee = employees.find(emp => emp.id === id || emp._id === id);
        if (employee) {
            setFormData({
                name: employee.name,
                email: employee.email,
                role: employee.role,
                department: employee.department,
                manager: employee.manager,
                location: employee.location || 'Mumbai Office',
                status: employee.status
            });
        } else if (employees.length > 0) {
            setError("Employee Identity Not Found");
        }
    }, [id, employees]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const [submitError, setSubmitError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setSubmitError('');

        const result = await updateEmployee(id, formData);

        setIsSubmitting(false);

        if (result?.success === false) {
            setSubmitError(result.error || 'Failed to update employee');
        } else {
            setShowModal(true);
        }
    };

    if (error) {
        return (
            <div className="flex flex-col items-center justify-center py-40 animate-in fade-in zoom-in-95">
                <div className="w-20 h-20 bg-red-50 text-red-500 rounded-[32px] flex items-center justify-center mb-6 border border-red-100 shadow-xl shadow-red-100/50">
                    <AlertCircle size={40} />
                </div>
                <h2 className="text-3xl font-black text-slate-800 tracking-tight mb-2">Diagnostic Error</h2>
                <p className="text-slate-400 font-bold uppercase tracking-widest text-xs mb-8">{error}</p>
                <button 
                   onClick={() => navigate('/employees')}
                   className="px-10 py-4 bg-slate-900 text-white font-black rounded-2xl hover:bg-slate-800 transition-all flex items-center gap-2 shadow-xl"
                >
                    <ArrowLeft size={18} />
                    Back to Directory
                </button>
            </div>
        );
    }

    return (
        <div className="flex flex-col h-[calc(100vh-120px)] w-full gap-8 animate-in fade-in slide-in-from-bottom-4 duration-700 relative pt-4 overflow-hidden">

            {/* Success Animation Modal */}
            {showModal && (
                <div className="fixed inset-0 z-200 flex items-center justify-center p-6 sm:p-0 overflow-hidden">
                    <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-md animate-in fade-in duration-500"></div>
                    <div className="bg-white rounded-[40px] p-12 max-w-md w-full relative z-210 shadow-[0_35px_60px_-15px_rgba(0,0,0,0.3)] border border-slate-100 animate-in zoom-in-95 duration-300 text-center">
                        <div className="w-24 h-24 bg-green-50 rounded-[32px] flex items-center justify-center text-green-500 mx-auto mb-8 relative">
                            <CheckCircle size={48} strokeWidth={2.5} />
                            <div className="absolute -top-2 -right-2 p-2 bg-primary-600 rounded-full text-white shadow-lg animate-bounce">
                                <Sparkles size={16} />
                            </div>
                        </div>
                        <h2 className="text-3xl font-black text-slate-800 tracking-tight mb-3 uppercase">Identity Updated</h2>
                        <p className="text-slate-500 font-bold leading-relaxed mb-10 text-[10px] uppercase tracking-widest">
                            Employee record for <span className="text-indigo-600">#{id}</span> has been synchronized with the global ledger.
                        </p>
                        <button
                            onClick={() => navigate('/employees')}
                            className="w-full py-4 bg-slate-900 text-white font-black rounded-2xl hover:bg-slate-800 transition-all flex items-center justify-center gap-2 group shadow-xl"
                        >
                            Back to Command Center
                            <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
                        </button>
                    </div>
                </div>
            )}

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
                        <h1 className="text-4xl font-black text-slate-800 tracking-tight leading-none mb-2 underline decoration-orange-300 underline-offset-12">Modify Identity Node</h1>
                        <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mt-4 flex items-center gap-2">
                           <span className="w-1.5 h-1.5 rounded-full bg-orange-500 animate-pulse"></span>
                           Strategic Lifecycle Diagnostic: Node {id}
                        </p>
                    </div>
                </div>
                <div className="flex items-center gap-3 self-start lg:self-center">
                    <button
                        onClick={() => navigate('/employees')}
                        className="px-8 py-3 bg-white border border-slate-100 text-slate-400 font-black text-[10px] uppercase rounded-2xl hover:bg-slate-50 transition-all shadow-sm active:scale-95"
                    >
                        Discard Changes
                    </button>
                    <button
                        onClick={handleSubmit}
                        disabled={isSubmitting}
                        className="px-10 py-3 bg-slate-900 text-white font-black rounded-2xl hover:bg-slate-800 transition-all shadow-xl shadow-slate-200 uppercase tracking-widest text-[10px] flex items-center gap-2"
                    >
                       {isSubmitting ? (
                           <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                       ) : <Save size={16} />}
                       Synchronize Profile
                    </button>
                </div>
            </div>

            {/* Main Workspace Grid */}
            <div className="flex-1 grid grid-cols-1 xl:grid-cols-4 gap-8 overflow-hidden min-h-0">
                
                {/* 1. SIDEBAR: Lifecycle Diagnostic */}
                <div className="xl:col-span-1 flex flex-col gap-6 overflow-y-auto no-scrollbar pb-10">
                   
                   <div className="card-soft bg-slate-900 border-none shadow-2xl p-8 text-white">
                        <div className="flex items-center gap-3 mb-8">
                             <div className="p-3 bg-white/10 text-white rounded-2xl">
                                <Shield size={24} />
                             </div>
                             <div>
                                <h3 className="text-sm font-black text-white tracking-tight uppercase">Lifecycle Status</h3>
                                <p className="text-[9px] text-slate-400 font-black uppercase tracking-widest">Global State Node</p>
                             </div>
                        </div>

                        <div className="space-y-4">
                            {['Active', 'On Leave', 'Offboarded'].map((status) => (
                                <button
                                    key={status}
                                    type="button"
                                    onClick={() => setFormData(prev => ({ ...prev, status }))}
                                    className={`w-full flex items-center justify-between p-4 rounded-2xl transition-all border-2 ${
                                        formData.status === status 
                                        ? 'bg-indigo-600/20 border-indigo-500 text-white' 
                                        : 'bg-white/5 border-transparent text-slate-400 hover:bg-white/10'
                                    }`}
                                >
                                    <span className="text-[10px] font-black uppercase tracking-widest">{status}</span>
                                    <div className={`w-2.5 h-2.5 rounded-full ${
                                        status === 'Active' ? 'bg-emerald-500' : 
                                        status === 'On Leave' ? 'bg-orange-500' : 
                                        'bg-rose-500'
                                    }`} />
                                </button>
                            ))}
                        </div>

                        <div className="mt-10 p-5 bg-white/5 rounded-2xl border border-white/5">
                             <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-3 leading-none">Diagnostic Logic</p>
                             <div className="flex items-start gap-3">
                                 <AlertCircle size={14} className="text-indigo-400 shrink-0 mt-0.5" />
                                 <p className="text-[10px] font-bold text-slate-400 leading-relaxed italic uppercase">
                                     Modification of lifecycle status triggers automated notification protocols to payroll and security hubs.
                                 </p>
                             </div>
                        </div>
                   </div>

                   <div className="space-y-4">
                      {[
                        { label: 'Security Clearance', value: 'Level 4', icon: Shield, color: 'text-indigo-500' },
                        { label: 'Sync Status', value: 'Master Node', icon: Activity, color: 'text-emerald-500' },
                      ].map((stat, i) => (
                        <div key={i} className="card-soft bg-white p-6 flex items-center gap-4 hover:border-orange-100 transition-all cursor-crosshair">
                           <div className={`p-3 bg-slate-50 rounded-2xl ${stat.color} shadow-inner`}><stat.icon size={20} /></div>
                           <div>
                              <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">{stat.label}</p>
                              <p className="text-lg font-black text-slate-800 tracking-tighter leading-none">{stat.value}</p>
                           </div>
                        </div>
                      ))}
                   </div>
                </div>

                {/* 2. MAIN HUB: Form Workspace */}
                <div className="xl:col-span-3 flex flex-col min-h-0 bg-white border border-slate-100 rounded-[44px] shadow-soft overflow-hidden">
                   
                   <div className="flex-1 overflow-y-auto no-scrollbar relative p-10">
                      <form onSubmit={handleSubmit} className="space-y-12">
                         
                         <section className="space-y-8">
                            <div className="flex items-center gap-4 pb-4 border-b border-slate-50">
                               <div className="w-10 h-10 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center font-black">01</div>
                               <div>
                                  <h2 className="text-lg font-black text-slate-800 uppercase tracking-tight">Identity Foundation</h2>
                                  <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest leading-none mt-1">Primary Workforce Identifiers</p>
                               </div>
                            </div>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                               <div className="space-y-2.5">
                                   <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest pl-1">Full Legal Name</label>
                                   <input
                                       name="name"
                                       value={formData.name}
                                       onChange={handleChange}
                                       required
                                       type="text"
                                       className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 text-xs font-black text-slate-700 focus:ring-4 focus:ring-indigo-500/10 focus:bg-white focus:border-indigo-500 transition-all outline-none uppercase"
                                   />
                               </div>
                               <div className="space-y-2.5">
                                   <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest pl-1">Corporate Email Hub</label>
                                   <input
                                       name="email"
                                       value={formData.email}
                                       onChange={handleChange}
                                       required
                                       type="email"
                                       className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 text-xs font-black text-slate-700 focus:ring-4 focus:ring-indigo-500/10 focus:bg-white focus:border-indigo-500 transition-all outline-none"
                                   />
                               </div>
                            </div>
                         </section>

                         <section className="space-y-8">
                            <div className="flex items-center gap-4 pb-4 border-b border-slate-50">
                               <div className="w-10 h-10 bg-orange-50 text-orange-600 rounded-xl flex items-center justify-center font-black">02</div>
                               <div>
                                  <h2 className="text-lg font-black text-slate-800 uppercase tracking-tight">Operational Placement</h2>
                                  <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest leading-none mt-1">Job Topology & Hierarchical Data</p>
                               </div>
                            </div>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                               <div className="space-y-2.5">
                                   <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest pl-1">Designation Label</label>
                                   <input
                                       name="role"
                                       value={formData.role}
                                       onChange={handleChange}
                                       required
                                       type="text"
                                       className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 text-xs font-black text-slate-700 focus:ring-4 focus:ring-indigo-500/10 focus:bg-white focus:border-indigo-500 transition-all outline-none uppercase"
                                   />
                               </div>
                               <div className="space-y-2.5">
                                   <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest pl-1">Department Hub</label>
                                   <select
                                       name="department"
                                       value={formData.department}
                                       onChange={handleChange}
                                       className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-5 py-4 text-xs font-black text-slate-700 outline-none cursor-pointer appearance-none uppercase"
                                   >
                                       <option>Engineering</option>
                                       <option>Product & Design</option>
                                       <option>Operations</option>
                                       <option>Marketing</option>
                                       <option>Human Resources</option>
                                   </select>
                               </div>
                               <div className="space-y-2.5">
                                   <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest pl-1">Superior Manager Node</label>
                                   <input
                                       name="manager"
                                       value={formData.manager}
                                       onChange={handleChange}
                                       required
                                       type="text"
                                       className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 text-xs font-black text-slate-700 focus:ring-4 focus:ring-indigo-500/10 focus:bg-white focus:border-indigo-500 transition-all outline-none uppercase"
                                   />
                               </div>
                               <div className="space-y-2.5">
                                   <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest pl-1">Physical Work Center</label>
                                   <div className="relative">
                                       <MapPin size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" />
                                       <input
                                           name="location"
                                           value={formData.location}
                                           onChange={handleChange}
                                           type="text"
                                           className="w-full bg-slate-50 border border-slate-100 rounded-2xl pl-12 pr-6 py-4 text-xs font-black text-slate-700 focus:ring-4 focus:ring-indigo-500/10 focus:bg-white focus:border-indigo-500 transition-all outline-none uppercase"
                                       />
                                   </div>
                               </div>
                            </div>
                         </section>

                      </form>
                   </div>

                   {/* Persistence Footer */}
                   <div className="px-10 py-6 bg-slate-900 border-t border-white/5 flex items-center justify-between text-white shrink-0">
                      <div className="flex items-center gap-4">
                         <div className="w-2 h-2 bg-orange-500 rounded-full animate-pulse"></div>
                         <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Modification Buffer Active</p>
                      </div>
                      <div className="flex items-center gap-6">
                         <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest leading-none italic uppercase">Unsaved changes will be purged upon session timeout.</p>
                      </div>
                   </div>
                </div>
            </div>

        </div>
    );
};

export default EditEmployee;
