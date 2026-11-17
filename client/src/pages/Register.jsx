// client/src/pages/Register.jsx
import { useState } from 'react';
import api from '../services/api'; 
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import { 
    User, Mail, Lock, ShieldCheck, ArrowRight, 
    HeartHandshake, Building2, Eye, EyeOff, ArrowLeft,
    Sparkles, CheckCircle2
} from 'lucide-react';

const Register = () => {
    const navigate = useNavigate();
    const auth = useAuth();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

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

        const name = formData.name.trim();
        const email = formData.email.trim().toLowerCase();
        const password = formData.password;
        const role = formData.role;

        if (!name || !email || !password) {
            toast.error("Please fill in all required fields.");
            setIsSubmitting(false);
            return;
        }

        if (password.length < 8) {
            toast.error("Password must be at least 8 characters long.");
            setIsSubmitting(false);
            return;
        }

        try {
            const response = await api.post('/auth/register', { name, email, password, role });
            
            if (response.data.token) {
                localStorage.setItem('token', response.data.token);
                if (auth && typeof auth.login === 'function') {
                    auth.login(response.data, response.data.token);
                }
                toast.success('Registration successful! Welcome to HopeConnect.');
                navigate('/dashboard');
            } else {
                toast.success('Registration successful! Please sign in.');
                navigate('/login');
            }
        } catch (error) {
            const errorMsg = error.response?.data?.errors?.[0]?.msg 
                          || error.response?.data?.error 
                          || 'Registration failed. Please check your details.';
            toast.error(errorMsg);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#F8FAFC] flex items-stretch text-slate-800 font-sans selection:bg-blue-600 selection:text-white">
            
            {/* ─── LEFT PANEL: EDITORIAL SHOWCASE (Desktop) ─── */}
            <div className="hidden lg:flex lg:w-1/2 bg-slate-900 text-white relative flex-col justify-between p-12 xl:p-16 overflow-hidden">
                <div className="absolute top-[-100px] left-[-100px] w-[500px] h-[500px] bg-blue-600/15 blur-[120px] rounded-full pointer-events-none"></div>
                <div className="absolute bottom-[-100px] right-[-100px] w-[450px] h-[450px] bg-amber-500/10 blur-[120px] rounded-full pointer-events-none"></div>

                <Link to="/" className="flex items-center gap-2.5 relative z-10 w-fit group">
                    <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform">
                        <HeartHandshake size={22} />
                    </div>
                    <div className="text-xl font-bold tracking-tight font-heading flex items-center gap-1">
                        <span className="text-white font-black">HOPE</span>
                        <span className="text-blue-400 font-black">CONNECT</span>
                    </div>
                </Link>

                <div className="relative z-10 max-w-lg my-auto space-y-6">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-emerald-300 border border-white/10 text-xs font-semibold uppercase tracking-wider">
                        <Sparkles size={12} className="text-emerald-400" /> Decentralized Relief Network
                    </div>
                    <h2 className="text-4xl xl:text-5xl font-black font-heading tracking-tight leading-tight">
                        Turn Unused Surplus Into <br/>
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-blue-400">
                            Immediate Human Relief
                        </span>
                    </h2>
                    <p className="text-slate-300 font-normal leading-relaxed text-base xl:text-lg">
                        Create an account to join an active network of food providers, community clinics, and verified shelters collaborating to eliminate waste.
                    </p>

                    <div className="pt-6 grid grid-cols-2 gap-4 border-t border-slate-800">
                        <div className="flex items-center gap-3 p-4 bg-slate-800/60 rounded-2xl border border-slate-700/60">
                            <ShieldCheck size={22} className="text-emerald-400 shrink-0" />
                            <span className="text-xs text-slate-200 font-semibold leading-tight">Zero Platform Fees</span>
                        </div>
                        <div className="flex items-center gap-3 p-4 bg-slate-800/60 rounded-2xl border border-slate-700/60">
                            <CheckCircle2 size={22} className="text-blue-400 shrink-0" />
                            <span className="text-xs text-slate-200 font-semibold leading-tight">Direct Proximity Dispatch</span>
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

            {/* ─── RIGHT PANEL: REGISTRATION CARD ─── */}
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

                <div className="w-full max-w-md space-y-6 pt-12 lg:pt-0">
                    <div>
                        <h1 className="text-3xl sm:text-4xl font-black font-heading text-slate-900 tracking-tight mb-2">Join HopeConnect</h1>
                        <p className="text-sm text-slate-500 font-normal">
                            Already registered?{' '}
                            <Link to="/login" className="text-blue-600 font-semibold hover:text-blue-700 underline underline-offset-4">
                                Sign in here
                            </Link>
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        
                        {/* 1. Name */}
                        <div>
                            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">Full Name / Organization</label>
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-blue-600 transition-colors">
                                    <User size={18} />
                                </div>
                                <input 
                                    type="text" 
                                    name="name"
                                    required 
                                    value={formData.name}
                                    onChange={handleChange}
                                    placeholder="e.g. Feeding Hope Trust / Rahul Verma" 
                                    className="w-full pl-11 pr-4 py-3 bg-white border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 text-sm focus:outline-none focus:border-blue-600 focus:ring-4 focus:ring-blue-100 transition shadow-xs"
                                />
                            </div>
                        </div>

                        {/* 2. Email */}
                        <div>
                            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">Email Address</label>
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-blue-600 transition-colors">
                                    <Mail size={18} />
                                </div>
                                <input 
                                    type="email" 
                                    name="email"
                                    required 
                                    value={formData.email}
                                    onChange={handleChange}
                                    placeholder="coordinator@organization.org" 
                                    className="w-full pl-11 pr-4 py-3 bg-white border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 text-sm focus:outline-none focus:border-blue-600 focus:ring-4 focus:ring-blue-100 transition shadow-xs"
                                />
                            </div>
                        </div>

                        {/* 3. Password */}
                        <div>
                            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">Password (min. 8 characters)</label>
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-blue-600 transition-colors">
                                    <Lock size={18} />
                                </div>
                                <input 
                                    type={showPassword ? "text" : "password"} 
                                    name="password"
                                    required 
                                    minLength="8"
                                    value={formData.password}
                                    onChange={handleChange}
                                    placeholder="••••••••••••" 
                                    className="w-full pl-11 pr-11 py-3 bg-white border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 text-sm focus:outline-none focus:border-blue-600 focus:ring-4 focus:ring-blue-100 transition shadow-xs"
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

                        {/* 4. Role */}
                        <div>
                            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">Registering As</label>
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-blue-600 transition-colors">
                                    <Building2 size={18} />
                                </div>
                                <select 
                                    name="role"
                                    value={formData.role}
                                    onChange={handleChange}
                                    className="w-full pl-11 pr-10 py-3 bg-white border border-slate-200 rounded-xl text-slate-900 text-sm focus:outline-none focus:border-blue-600 focus:ring-4 focus:ring-blue-100 transition appearance-none cursor-pointer font-medium shadow-xs"
                                >
                                    <option value="INDIVIDUAL_DONOR">Individual Donor (Personal surplus & supplies)</option>
                                    <option value="RESTAURANT">Restaurant / Caterer (Bulk prepared meals)</option>
                                    <option value="HOSPITAL">Hospital / Health Center (Medical crates)</option>
                                    <option value="NGO">NGO / Charitable Shelter (Claim & distribute)</option>
                                    <option value="OLD_AGE_HOME">Old Age Home / Care Center (Recipient facility)</option>
                                </select>
                                <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none text-slate-400">
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                                </div>
                            </div>
                        </div>

                        {/* 5. Submit */}
                        <div className="pt-2">
                            <button 
                                type="submit" 
                                disabled={isSubmitting}
                                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3.5 rounded-xl shadow-md hover:shadow-lg transition-all transform hover:-translate-y-0.5 flex items-center justify-center gap-2 group disabled:opacity-50 text-sm"
                            >
                                {isSubmitting ? 'Creating Account...' : 'Complete Registration'}
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