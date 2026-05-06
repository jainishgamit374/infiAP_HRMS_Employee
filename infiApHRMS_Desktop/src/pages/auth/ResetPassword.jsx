import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, ArrowLeft, Send } from 'lucide-react';
import AuthLayout from '../../components/layout/AuthLayout';

const ResetPassword = () => {
    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();
        // Simulate email sent
        navigate('/login');
    };

    return (
        <AuthLayout>
            <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-[0_16px_36px_-14px_rgba(38,20,91,0.28)] border border-[#EAE5F8] flex flex-col items-center">
                
                {/* Header Section */}
                <div className="text-center mb-10">
                    <div className="w-16 h-16 bg-[#6C5CE7]/10 text-[#6C5CE7] rounded-2xl flex items-center justify-center mx-auto mb-6">
                        <Mail size={32} />
                    </div>
                    <h1 className="text-4xl font-black text-[#1A1A1A] tracking-tight mb-3 uppercase">Reset password</h1>
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] leading-relaxed max-w-[320px] mx-auto">
                        Enter your corporate email address to receive a password recovery link.
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="w-full space-y-8">
                    
                    {/* Input Field */}
                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-1">Corporate Email</label>
                        <div className="relative group">
                            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-[#6C5CE7] transition-colors" size={18} />
                            <input
                                type="email"
                                required
                                placeholder="name@company.com"
                                className="w-full bg-[#F8FAFC] border border-gray-100 rounded-2xl pl-12 pr-6 py-4 text-sm font-medium text-gray-800 focus:ring-4 focus:ring-[#6C5CE7]/5 focus:bg-white focus:border-[#6C5CE7] transition-all outline-none"
                            />
                        </div>
                    </div>

                    {/* Action Button */}
                    <button
                        type="submit"
                        className="w-full py-4.5 bg-linear-to-r from-[#6C5CE7] to-[#5A4BDA] text-white font-bold rounded-2xl shadow-lg shadow-[#6C5CE7]/20 hover:shadow-xl hover:shadow-[#6C5CE7]/30 transition-all active:scale-[0.98] flex items-center justify-center gap-3"
                    >
                        <Send size={18} />
                        Send Reset Link
                    </button>

                    {/* Navigation */}
                    <div className="pt-8 border-t border-gray-50">
                        <button
                            type="button"
                            onClick={() => navigate('/login')}
                            className="flex items-center gap-2 mx-auto text-xs font-bold text-gray-400 hover:text-[#6C5CE7] transition-colors group"
                        >
                            <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
                            Back to Sign In
                        </button>
                    </div>

                    {/* Advisory */}
                    <div className="text-center px-4">
                        <p className="text-[10px] font-medium text-gray-300 leading-relaxed uppercase tracking-wider">
                            If you do not receive a recovery link within 5 minutes, please contact your IT administrator.
                        </p>
                    </div>
                </form>
            </div>
        </AuthLayout>
    );
};

export default ResetPassword;
