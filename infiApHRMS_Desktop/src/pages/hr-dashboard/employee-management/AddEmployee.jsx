import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    ArrowLeft,
    Camera,
    User,
    Mail,
    Phone,
    Briefcase,
    Calendar,
    Users,
    Search,
    DollarSign,
    CheckCircle2,
    Sparkles,
    ArrowRight,
    X,
    Hash
} from 'lucide-react';
import { useEmployeeContext } from '../../../context/EmployeeContext';

const AddEmployee = () => {
    const navigate = useNavigate();
    const fileInputRef = useRef(null);
    const { addEmployee } = useEmployeeContext();

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [previewImage, setPreviewImage] = useState(null);

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        employeeId: `EMP-${Math.floor(Math.random() * 900) + 100}`,
        joiningDate: '',
        department: '',
        role: '',
        manager: '',
        salary: ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreviewImage(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const [submitError, setSubmitError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setSubmitError('');

        const result = await addEmployee({
            ...formData,
            status: 'Active',
            avatar: previewImage
        });

        setIsSubmitting(false);

        if (result?.success === false) {
            setSubmitError(result.error || 'Failed to add employee');
        } else {
            setShowModal(true);
        }
    };

    return (
        <div className="min-h-[calc(100vh-120px)] w-full bg-slate-50/30 p-4 md:p-8 animate-in fade-in duration-700">
            
            {/* Success Modal */}
            {showModal && (
                <div className="fixed inset-0 z-[200] flex items-center justify-center p-6">
                    <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-md animate-in fade-in duration-300" onClick={() => setShowModal(false)}></div>
                    <div className="bg-white rounded-[40px] p-10 max-w-md w-full relative z-[210] shadow-2xl border border-slate-100 animate-in zoom-in-95 duration-500 text-center">
                        <div className="w-24 h-24 bg-primary-50 rounded-[32px] flex items-center justify-center text-primary-500 mx-auto mb-8 relative shadow-inner">
                            <CheckCircle2 size={48} />
                            <div className="absolute -top-2 -right-2 p-2 bg-primary-500 rounded-xl text-white">
                                <Sparkles size={16} />
                            </div>
                        </div>
                        <h2 className="text-3xl font-black text-slate-800 mb-3 tracking-tight">Employee Added!</h2>
                        <p className="text-slate-500 font-medium mb-10 text-sm leading-relaxed">
                            <span className="font-bold text-slate-800">{formData.name}</span> has been successfully onboarded and added to the company directory.
                        </p>
                        <button
                            onClick={() => navigate('/employees')}
                            className="w-full py-4 bg-primary-600 text-white font-bold rounded-2xl hover:bg-primary-700 transition-all flex items-center justify-center gap-2 group shadow-lg shadow-primary-200"
                        >
                            Go to Directory
                            <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
                        </button>
                    </div>
                </div>
            )}

            {/* Back Button and Title */}
            <div className="max-w-3xl mx-auto mb-8 flex items-center gap-4">
                <button 
                    onClick={() => navigate('/employees')}
                    className="p-3 bg-white border border-slate-100 text-slate-400 hover:text-slate-800 rounded-xl shadow-sm transition-all hover:-translate-x-1"
                >
                    <ArrowLeft size={20} />
                </button>
                <h1 className="text-4xl font-black text-slate-800 tracking-tight leading-none mb-1">Add Employee</h1>
            </div>

            {/* Form Card */}
            <div className="max-w-3xl mx-auto bg-white border border-slate-100 rounded-[32px] shadow-xl shadow-slate-200/50 overflow-hidden">
                <form onSubmit={handleSubmit} className="p-8 md:p-12">
                    
                    {/* Avatar Upload */}
                    <div className="flex flex-col items-center mb-12">
                        <label 
                            htmlFor="avatar-upload"
                            className="relative group cursor-pointer block"
                        >
                            <div className="w-32 h-32 bg-slate-100 rounded-full flex items-center justify-center border-4 border-white shadow-lg overflow-hidden relative">
                                {previewImage ? (
                                    <img src={previewImage} alt="Preview" className="w-full h-full object-cover" />
                                ) : (
                                    <User size={48} className="text-slate-300" />
                                )}
                                <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                    <Camera size={24} className="text-white" />
                                </div>
                            </div>
                            <div className="absolute bottom-0 right-0 p-2 bg-primary-600 rounded-full text-white shadow-lg border-2 border-white">
                                <Camera size={14} />
                            </div>
                        </label>
                        <label 
                            htmlFor="avatar-upload"
                            className="mt-4 text-[11px] font-black text-primary-600 uppercase tracking-widest hover:underline cursor-pointer"
                        >
                            Upload Profile Photo
                        </label>
                        <input 
                            id="avatar-upload"
                            type="file" 
                            ref={fileInputRef}
                            className="absolute -z-10 opacity-0 w-0 h-0" 
                            onChange={handleImageChange} 
                            accept="image/*" 
                        />
                    </div>

                    <div className="space-y-12">
                        {/* Personal Details */}
                        <div className="space-y-6">
                            <h3 className="text-[11px] font-black text-slate-800 uppercase tracking-[0.2em] mb-2 leading-none">Personal Details</h3>
                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <label className="text-[11px] font-bold text-slate-600 ml-1">Full Name</label>
                                    <div className="relative">
                                        <input
                                            name="name"
                                            value={formData.name}
                                            onChange={handleChange}
                                            required
                                            type="text"
                                            placeholder="e.g. John Doe"
                                            className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-5 py-4 text-sm font-medium text-slate-800 focus:bg-white focus:border-primary-500 focus:ring-4 focus:ring-primary-500/5 transition-all outline-none"
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[11px] font-bold text-slate-600 ml-1">Email Address</label>
                                    <div className="relative">
                                        <input
                                            name="email"
                                            value={formData.email}
                                            onChange={handleChange}
                                            required
                                            type="email"
                                            placeholder="john@company.com"
                                            className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-5 py-4 text-sm font-medium text-slate-800 focus:bg-white focus:border-primary-500 focus:ring-4 focus:ring-primary-500/5 transition-all outline-none"
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[11px] font-bold text-slate-600 ml-1">Phone Number</label>
                                    <div className="relative">
                                        <input
                                            name="phone"
                                            value={formData.phone}
                                            onChange={handleChange}
                                            type="tel"
                                            placeholder="+1 (555) 000-0000"
                                            className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-5 py-4 text-sm font-medium text-slate-800 focus:bg-white focus:border-primary-500 focus:ring-4 focus:ring-primary-500/5 transition-all outline-none"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Employment Details */}
                        <div className="space-y-6">
                            <h3 className="text-[11px] font-black text-slate-800 uppercase tracking-[0.2em] mb-2 leading-none">Employment Details</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-[11px] font-bold text-slate-600 ml-1">Employee ID</label>
                                    <input
                                        name="employeeId"
                                        value={formData.employeeId}
                                        onChange={handleChange}
                                        required
                                        type="text"
                                        placeholder="EMP-102"
                                        className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-5 py-4 text-sm font-medium text-slate-800 focus:bg-white focus:border-primary-500 focus:ring-4 focus:ring-primary-500/5 transition-all outline-none"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[11px] font-bold text-slate-600 ml-1">Joining Date</label>
                                    <input
                                        name="joiningDate"
                                        value={formData.joiningDate}
                                        onChange={handleChange}
                                        required
                                        type="date"
                                        className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-5 py-4 text-sm font-medium text-slate-800 focus:bg-white focus:border-primary-500 focus:ring-4 focus:ring-primary-500/5 transition-all outline-none font-sans"
                                    />
                                </div>
                                <div className="md:col-span-2 space-y-2">
                                    <label className="text-[11px] font-bold text-slate-600 ml-1">Department</label>
                                    <select
                                        name="department"
                                        value={formData.department}
                                        onChange={handleChange}
                                        required
                                        className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-5 py-4 text-sm font-medium text-slate-800 focus:bg-white focus:border-primary-500 focus:ring-4 focus:ring-primary-500/5 transition-all outline-none appearance-none cursor-pointer"
                                    >
                                        <option value="" disabled>Select Department</option>
                                        <option>Engineering</option>
                                        <option>Product & Design</option>
                                        <option>Marketing</option>
                                        <option>Sales</option>
                                        <option>Operations</option>
                                        <option>Human Resources</option>
                                    </select>
                                </div>
                                <div className="md:col-span-2 space-y-2">
                                    <label className="text-[11px] font-bold text-slate-600 ml-1">Role</label>
                                    <input
                                        name="role"
                                        value={formData.role}
                                        onChange={handleChange}
                                        required
                                        type="text"
                                        placeholder="Senior Product Designer"
                                        className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-5 py-4 text-sm font-medium text-slate-800 focus:bg-white focus:border-primary-500 focus:ring-4 focus:ring-primary-500/5 transition-all outline-none"
                                    />
                                </div>
                                <div className="md:col-span-2 space-y-2">
                                    <label className="text-[11px] font-bold text-slate-600 ml-1">Reporting Manager</label>
                                    <div className="relative">
                                        <Search size={18} className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400" />
                                        <input
                                            name="manager"
                                            value={formData.manager}
                                            onChange={handleChange}
                                            type="text"
                                            placeholder="Search manager..."
                                            className="w-full bg-slate-50 border border-slate-100 rounded-2xl pl-12 pr-5 py-4 text-sm font-medium text-slate-800 focus:bg-white focus:border-primary-500 focus:ring-4 focus:ring-primary-500/5 transition-all outline-none"
                                        />
                                    </div>
                                </div>
                                <div className="md:col-span-2 space-y-2">
                                    <label className="text-[11px] font-bold text-slate-600 ml-1">Annual Salary <span className="font-normal text-slate-400">(Optional)</span></label>
                                    <div className="relative">
                                        <DollarSign size={18} className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400" />
                                        <input
                                            name="salary"
                                            value={formData.salary}
                                            onChange={handleChange}
                                            type="number"
                                            placeholder="0.00"
                                            className="w-full bg-slate-50 border border-slate-100 rounded-2xl pl-12 pr-5 py-4 text-sm font-medium text-slate-800 focus:bg-white focus:border-primary-500 focus:ring-4 focus:ring-primary-500/5 transition-all outline-none"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Form Actions */}
                    <div className="mt-16 flex flex-col sm:flex-row gap-4">
                        <button
                            type="button"
                            onClick={() => navigate('/employees')}
                            className="flex-1 py-4 px-8 bg-white border border-slate-200 text-slate-600 font-bold rounded-2xl hover:bg-slate-50 transition-all hover:border-slate-300"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={isSubmitting || !formData.name}
                            className={`flex-[2] py-4 px-8 font-black rounded-2xl transition-all shadow-xl flex items-center justify-center gap-3 active:scale-95 ${isSubmitting || !formData.name ? 'bg-slate-100 text-slate-300 cursor-not-allowed shadow-none' : 'bg-primary-600 text-white hover:bg-primary-700 shadow-primary-200'}`}
                        >
                            {isSubmitting ? (
                                <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                            ) : (
                                <>
                                    Create Employee
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddEmployee;
