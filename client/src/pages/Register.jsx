// client/src/pages/Register.jsx
import { useState } from 'react';
import api from '../services/api'; 
import { useNavigate, Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { 
    User, Mail, Lock, ShieldCheck, ArrowRight, 
    Sunrise, Building2, Heart, Sparkles 
} from 'lucide-react';

const Register = () => {
    const navigate = useNavigate();
    const [isSubmitting, setIsSubmitting] = useState(false);

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        role: 'INDIVIDUAL_DONOR' 
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            await api.post('/auth/register', formData);
            toast.success('Registration successful! Please log in.');
            navigate('/login'); 
        } catch (error) {
            const errorMsg = error.response?.data?.errors?.[0]?.msg 
                          || error.response?.data?.error 
                          || 'Registration failed';
            toast.error(errorMsg);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#0B1121] flex items-stretch text-white font-sans overflow-hidden relative">
            
            {/* GRID BACKGROUND EFFECTS */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:5rem_5rem] opacity-10 pointer-events-none z-0"></div>

            {/* ─── LEFT PANEL: ENTERPRISE CINEMATIC STAGE ─── */}
            <div className="hidden lg:flex lg:w-1/2 bg-[#090d16] relative flex-col justify-between p-16 border-r border-slate-900 overflow-hidden">
                <div className="absolute top-[-200px] left-[-200px] w-[600px] h-[600px] bg-rose-500/10 blur-[130px] rounded-full pointer-events-none"></div>
                <div className="absolute bottom-[-150px] right-[-100px] w-[500px] h-[500px] bg-emerald-500/5 blur-[120px] rounded-full pointer-events-none"></div>

                {/* Core Brand Header */}
                <div className="flex items-center gap-3 relative z-10">
                    <Sunrise className="text-[#FF3366]" size={36} />
                    <div className="text-2xl font-black tracking-widest flex items-center gap-1">
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-500 via-purple-500 to-blue-500">HOPE</span>
                        <span className="text-white">CONNECT</span>
                    </div>
                </div>

                {/* Platform Value Proposition Deck */}
                <div className="relative z-10 max-w-lg my-auto space-y-6">
                    <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-900 border border-slate-800 text-xs font-semibold text-emerald-400 tracking-wide uppercase">
                        <Sparkles size={12} /> Non-Profit Network Framework
                    </div>
                    <h2 className="text-4xl xl:text-5xl font-serif font-black tracking-tight leading-tight">
                        Optimizing Surplus for <br/>
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-400 via-orange-300 to-amber-200 italic font-normal">Direct Local Impact</span>
                    </h2>
                    <p className="text-slate-400 font-light leading-relaxed text-base xl:text-lg">
                        Join an ecosystem engineered to strip out waste. Secure asset verification, real-time demand matching pipelines, and full logistics visibility.
                    </p>

                    {/* Infrastructure Metric Grid Cards */}
                    <div className="pt-6 grid grid-cols-2 gap-4 border-t border-slate-900">
                        <div className="flex items-center gap-3 p-3 bg-slate-900/40 rounded-xl border border-slate-900">
                            <ShieldCheck size={20} className="text-emerald-400 shrink-0" />
                            <span className="text-xs text-slate-300 font-medium tracking-wide">100% Secure Audits</span>
                        </div>
                        <div className="flex items-center gap-3 p-3 bg-slate-900/40 rounded-xl border border-slate-900">
                            <Heart size={20} className="text-rose-400 shrink-0" />
                            <span className="text-xs text-slate-300 font-medium tracking-wide">Direct Resource Routes</span>
                        </div>
                    </div>
                </div>

                {/* Footer Disclaimer */}
                <p className="text-xs text-slate-600 relative z-10">
                    © 2026 HopeConnect Infrastructure. Fully non-monetary supply operations.
                </p>
            </div>

            {/* ─── RIGHT PANEL: PREMIUM AUTH REGISTRATION CARD ─── */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-8 md:p-12 relative z-10">
                <div className="absolute top-10 right-10 lg:hidden flex items-center gap-2">
                    <Sunrise className="text-[#FF3366]" size={28} />
                    <span className="font-bold tracking-widest text-sm text-white">HOPECONNECT</span>
                </div>

                <div className="w-full max-w-md space-y-8">
                    <div>
                        <h1 className="text-3xl font-serif font-extrabold tracking-tight mb-2">Join HopeConnect</h1>
                        <p className="text-sm text-slate-400 font-light">
                            Already have an account?{' '}
                            <Link to="/login" className="text-emerald-400 font-medium hover:text-emerald-300 transition-colors underline underline-offset-4">
                                Log in here
                            </Link>
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-5">
                        
                        {/* 1. Identity Name Input */}
                        <div>
                            <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Organization / Full Name</label>
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-500 group-focus-within:text-emerald-400 transition-colors">
                                    <User size={18} />
                                </div>
                                <input 
                                    type="text" 
                                    name="name"
                                    required 
                                    value={formData.name}
                                    onChange={handleChange}
                                    placeholder="e.g., Feeding Hope NGO / John Doe" 
                                    className="w-full pl-11 pr-4 py-3.5 bg-slate-950/40 border border-slate-800 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-colors shadow-inner"
                                />
                            </div>
                        </div>

                        {/* 2. Email Address Input */}
                        <div>
                            <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Email Address</label>
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-500 group-focus-within:text-emerald-400 transition-colors">
                                    <Mail size={18} />
                                </div>
                                <input 
                                    type="email" 
                                    name="email"
                                    required 
                                    value={formData.email}
                                    onChange={handleChange}
                                    placeholder="name@organization.org" 
                                    className="w-full pl-11 pr-4 py-3.5 bg-slate-950/40 border border-slate-800 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-colors shadow-inner"
                                />
                            </div>
                        </div>

                        {/* 3. Password Input */}
                        <div>
                            <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Account Password</label>
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-500 group-focus-within:text-emerald-400 transition-colors">
                                    <Lock size={18} />
                                </div>
                                <input 
                                    type="password" 
                                    name="password"
                                    required 
                                    minLength="8"
                                    value={formData.password}
                                    onChange={handleChange}
                                    placeholder="Minimum 8 characters" 
                                    className="w-full pl-11 pr-4 py-3.5 bg-slate-950/40 border border-slate-800 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-colors shadow-inner"
                                />
                            </div>
                        </div>

                        {/* 4. Ecosystem Network Selector Dropdown */}
                        <div>
                            <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">I am registering as a:</label>
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-500 group-focus-within:text-emerald-400 transition-colors">
                                    <Building2 size={18} />
                                </div>
                                <select 
                                    name="role"
                                    value={formData.role}
                                    onChange={handleChange}
                                    className="w-full pl-11 pr-4 py-3.5 bg-slate-950/40 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-colors appearance-none cursor-pointer font-medium"
                                >
                                    <option value="INDIVIDUAL_DONOR" className="bg-[#121b2f]">Individual Donor</option>
                                    <option value="RESTAURANT" className="bg-[#121b2f]">Restaurant</option>
                                    <option value="HOSPITAL" className="bg-[#121b2f]">Hospital</option>
                                    <option value="NGO" className="bg-[#121b2f]">NGO</option>
                                    <option value="OLD_AGE_HOME" className="bg-[#121b2f]">Old Age Home</option>
                                </select>
                                <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none text-slate-500">
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                                </div>
                            </div>
                        </div>

                        {/* 5. Submit Button */}
                        <div className="pt-3">
                            <button 
                                type="submit" 
                                disabled={isSubmitting}
                                className="w-full bg-gradient-to-r from-rose-500 via-purple-600 to-blue-600 hover:opacity-95 text-white font-bold py-4 rounded-xl shadow-[0_4px_25px_rgba(244,63,94,0.15)] transition-all transform hover:-translate-y-0.5 flex items-center justify-center gap-2 group disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {isSubmitting ? 'Registering Core Node...' : 'Create Account'}
                                {!isSubmitting && <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />}
                            </button>
                        </div>
                    </form>
                </div>
            </div>

        </div>
    );
};

export default Register;