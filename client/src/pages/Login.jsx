// client/src/pages/Login.jsx
import { useState } from 'react';
import api from '../services/api'; 
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import { 
    Mail, Lock, ShieldCheck, ArrowRight, 
    HeartHandshake, Eye, EyeOff, ArrowLeft,
    CheckCircle2, Sparkles
} from 'lucide-react';

const Login = () => {
    const navigate = useNavigate();
    const auth = useAuth();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        const email = formData.email.trim().toLowerCase();
        const password = formData.password;

        if (!email || !password) {
            toast.error("Please enter both email and password");
            setIsSubmitting(false);
            return;
        }

        try {
            const response = await api.post('/auth/login', { email, password });
            
            if (response.data.token) {
                localStorage.setItem('token', response.data.token);
            }

            if (auth && typeof auth.login === 'function') {
                auth.login(response.data, response.data.token);
            }

            toast.success(`Welcome back, ${response.data.name || 'Coordinator'}!`);
            navigate('/dashboard');

        } catch (error) {
            const errorMsg = error.response?.data?.error 
                          || error.response?.data?.errors?.[0]?.msg 
                          || 'Invalid email or password';
            toast.error(errorMsg);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#F8FAFC] flex items-stretch text-slate-800 font-sans selection:bg-blue-600 selection:text-white">
            
            {/* ─── LEFT PANEL: EDITORIAL SHOWCASE (Desktop) ─── */}
            <div className="hidden lg:flex lg:w-1/2 bg-slate-900 text-white relative flex-col justify-between p-12 xl:p-16 overflow-hidden">
                {/* Ambient glow orbs */}
                <div className="absolute top-[-100px] left-[-100px] w-[500px] h-[500px] bg-blue-600/15 blur-[120px] rounded-full pointer-events-none"></div>
                <div className="absolute bottom-[-100px] right-[-100px] w-[450px] h-[450px] bg-amber-500/10 blur-[120px] rounded-full pointer-events-none"></div>

                {/* Brand */}
                <Link to="/" className="flex items-center gap-2.5 relative z-10 w-fit group">
                    <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform">
                        <HeartHandshake size={22} />
                    </div>
                    <div className="text-xl font-bold tracking-tight font-heading flex items-center gap-1">
                        <span className="text-white font-black">HOPE</span>
                        <span className="text-blue-400 font-black">CONNECT</span>
                    </div>
                </Link>

                {/* Value deck */}
                <div className="relative z-10 max-w-lg my-auto space-y-6">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-blue-300 border border-white/10 text-xs font-semibold uppercase tracking-wider">
                        <Sparkles size={12} className="text-amber-400" /> Non-Monetary Resource Pipeline
                    </div>
                    <h2 className="text-4xl xl:text-5xl font-black font-heading tracking-tight leading-tight">
                        Powering Real-Time Aid <br/>
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-300 to-amber-300">
                            Across Communities
                        </span>
                    </h2>
                    <p className="text-slate-300 font-normal leading-relaxed text-base xl:text-lg">
                        Sign in to monitor active surplus donations, dispatch emergency food crates, or lock matching distribution routes for verified shelters.
                    </p>

                    <div className="pt-6 grid grid-cols-2 gap-4 border-t border-slate-800">
                        <div className="flex items-center gap-3 p-4 bg-slate-800/60 rounded-2xl border border-slate-700/60">
                            <ShieldCheck size={22} className="text-emerald-400 shrink-0" />
                            <span className="text-xs text-slate-200 font-semibold leading-tight">Verified Shelter Network</span>
                        </div>
                        <div className="flex items-center gap-3 p-4 bg-slate-800/60 rounded-2xl border border-slate-700/60">
                            <CheckCircle2 size={22} className="text-blue-400 shrink-0" />
                            <span className="text-xs text-slate-200 font-semibold leading-tight">Instant Audit Trail</span>
                        </div>
                    </div>
                </div>

                <div className="flex items-center justify-between text-xs text-slate-400 relative z-10">
                    <p>© 2026 HopeConnect Network.</p>
                    <Link to="/" className="text-slate-300 hover:text-white flex items-center gap-1 transition">
                        <ArrowLeft size={14} /> Back to Homepage
                    </Link>
                </div>
            </div>

            {/* ─── RIGHT PANEL: CLEAN LOGIN CARD ─── */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12 md:p-16 relative min-h-screen">
                
                {/* Mobile Top Header */}
                <div className="absolute top-6 left-6 right-6 lg:hidden flex items-center justify-between">
                    <Link to="/" className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center">
                            <HeartHandshake size={18} />
                        </div>
                        <span className="font-bold text-sm text-slate-900 font-heading">HOPECONNECT</span>
                    </Link>
                    <Link to="/" className="text-xs text-slate-500 hover:text-slate-800 flex items-center gap-1 font-semibold">
                        <ArrowLeft size={14} /> Home
                    </Link>
                </div>

                <div className="w-full max-w-md space-y-8 pt-12 lg:pt-0">
                    <div>
                        <h1 className="text-3xl sm:text-4xl font-black font-heading text-slate-900 tracking-tight mb-2">Welcome Back</h1>
                        <p className="text-sm text-slate-500 font-normal">
                            New coordinator or donor?{' '}
                            <Link to="/register" className="text-blue-600 font-semibold hover:text-blue-700 underline underline-offset-4">
                                Register your account
                            </Link>
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-5">
                        
                        {/* 1. Email Input */}
                        <div>
                            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Email Address</label>
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-blue-600 transition-colors">
                                    <Mail size={18} />
                                </div>
                                <input 
                                    type="email" 
                                    name="email"
                                    id="email"
                                    required 
                                    value={formData.email}
                                    onChange={handleChange}
                                    placeholder="name@organization.org" 
                                    className="w-full pl-11 pr-4 py-3.5 bg-white border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 text-sm focus:outline-none focus:border-blue-600 focus:ring-4 focus:ring-blue-100 transition shadow-xs"
                                />
                            </div>
                        </div>

                        {/* 2. Password Input */}
                        <div>
                            <div className="flex justify-between items-center mb-2">
                                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">Account Password</label>
                            </div>
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-blue-600 transition-colors">
                                    <Lock size={18} />
                                </div>
                                <input 
                                    type={showPassword ? "text" : "password"} 
                                    name="password"
                                    id="password"
                                    required 
                                    value={formData.password}
                                    onChange={handleChange}
                                    placeholder="••••••••••••" 
                                    className="w-full pl-11 pr-11 py-3.5 bg-white border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 text-sm focus:outline-none focus:border-blue-600 focus:ring-4 focus:ring-blue-100 transition shadow-xs"
                                />
                                <button 
                                    type="button" 
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 hover:text-slate-600 focus:outline-none"
                                    aria-label="Toggle password visibility"
                                >
                                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            </div>
                        </div>

                        {/* 3. Submit Button */}
                        <div className="pt-2">
                            <button 
                                type="submit" 
                                disabled={isSubmitting}
                                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3.5 rounded-xl shadow-md hover:shadow-lg transition-all transform hover:-translate-y-0.5 flex items-center justify-center gap-2 group disabled:opacity-50 text-sm"
                            >
                                {isSubmitting ? 'Authenticating...' : 'Sign In To Operations Deck'}
                                {!isSubmitting && <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />}
                            </button>
                        </div>
                    </form>

                    {/* Test credentials helper */}
                    <div className="p-4 bg-slate-100/80 rounded-2xl border border-slate-200 text-xs text-slate-600 leading-relaxed text-center">
                        <span className="font-bold text-slate-800">Quick Test Credentials:</span><br />
                        NGO Shelter: <code className="text-blue-700 font-semibold">helpindia@org.in</code> • Donor: <code className="text-blue-700 font-semibold">daru@gmail.com</code>
                    </div>
                </div>
            </div>

        </div>
    );
};

export default Login;