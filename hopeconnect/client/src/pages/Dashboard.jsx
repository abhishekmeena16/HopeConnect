import { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { 
    History, PackageCheck, AlertCircle, LogOut, 
    Settings, ChevronDown, Bell, PlusCircle, ShieldAlert,
    User, Camera, LayoutDashboard, Route, Zap, Scale, Radio
} from 'lucide-react';

import CreateResourceForm from '../components/CreateResourceForm';
import EmergencyPanel from '../components/EmergencyPanel';
import ActivityHistory from '../components/ActivityHistory';
import axios from 'axios';
import toast from 'react-hot-toast'; 

const Dashboard = () => {
    const { user, logout } = useAuth();
    
    // Defaulting tab state to the custom real-time monitoring deck
    const [activeTab, setActiveTab] = useState('OVERVIEW');
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const [isUpdating, setIsUpdating] = useState(false);

    // Profile Image States
    const fileInputRef = useRef(null);
    const [avatarFile, setAvatarFile] = useState(null);
    const [avatarPreview, setAvatarPreview] = useState('');

    const [profileData, setProfileData] = useState({
        name: '',
        phone: '',
        location: '',
        bio: ''
    });

    useEffect(() => {
        if (user) {
            setProfileData({
                name: user.name || '',
                phone: user.phone || '',
                location: user.location || '',
                bio: user.bio || ''
            });
            if (user.avatarUrl) {
                setAvatarPreview(`http://localhost:5001${user.avatarUrl}`);
            }
        }
    }, [user]);

    const handleAvatarChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setAvatarFile(file);
            setAvatarPreview(URL.createObjectURL(file));
        }
    };

    const canDonate = ['INDIVIDUAL_DONOR', 'RESTAURANT', 'HOSPITAL'].includes(user?.role);
    const canClaim = ['NGO', 'OLD_AGE_HOME', 'HOSPITAL'].includes(user?.role);

    const handleProfileUpdate = async (e) => {
        e.preventDefault();
        setIsUpdating(true);
        try {
            const token = localStorage.getItem('token') || ''; 

            const multiPartPayload = new FormData();
            multiPartPayload.append('name', profileData.name);
            multiPartPayload.append('phone', profileData.phone);
            multiPartPayload.append('location', profileData.location);
            multiPartPayload.append('bio', profileData.bio);
            
            if (avatarFile) {
                multiPartPayload.append('avatar', avatarFile);
            }

            await axios.put('http://localhost:5001/api/auth/profile', multiPartPayload, {
                withCredentials: true, 
                headers: { 
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data'
                }
            });

            toast.success("Profile successfully updated!");
            
            setTimeout(() => {
                window.location.reload();
            }, 1000);

        } catch (error) {
            console.error(error);
            toast.error(error.response?.data?.error || "Failed to update profile");
        } finally {
            setIsUpdating(false);
        }
    };

    return (
        <div className="flex h-screen bg-[#0B1121] text-white font-sans overflow-hidden selection:bg-emerald-500/30">
            
            {/* BACKGROUND DECORATIVE EFFECTS */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-20 pointer-events-none z-0"></div>
            <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-emerald-500/5 blur-[150px] rounded-full pointer-events-none z-0"></div>
            <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-blue-500/5 blur-[150px] rounded-full pointer-events-none z-0"></div>

            {/* --- SIDEBAR --- */}
            <aside className="w-72 bg-[#0f172a]/80 backdrop-blur-xl border-r border-slate-800 flex flex-col z-20">
                <div className="p-6 border-b border-slate-800/50">
                    <div className="text-2xl font-black tracking-widest mb-1 flex items-center gap-1">
                        <span className="text-emerald-400 drop-shadow-[0_0_8px_rgba(52,211,153,0.5)]">HOPE</span>
                        <span className="text-white">CONNECT</span>
                    </div>
                    <p className="text-emerald-400/80 text-xs font-bold uppercase tracking-wider">
                        {user?.role?.replace('_', ' ')} Portal
                    </p>
                </div>

                <nav className="flex-1 overflow-y-auto py-6 px-4 space-y-1 custom-scrollbar">
                    <p className="px-4 text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">System Metrics</p>
                    <NavItem icon={<LayoutDashboard size={20} />} label="Ecosystem Telemetry" isActive={activeTab === 'OVERVIEW'} onClick={() => setActiveTab('OVERVIEW')} />

                    <p className="px-4 text-xs font-bold text-slate-500 uppercase tracking-wider mb-3 mt-6">Resource Logistics</p>
                    {canDonate && (
                        <NavItem icon={<PlusCircle size={20} />} label="Log Resource" isActive={activeTab === 'DONATE'} onClick={() => setActiveTab('DONATE')} />
                    )}
                    {canClaim && (
                        <NavItem icon={<PackageCheck size={20} />} label="Claim Resources" isActive={activeTab === 'CLAIM'} onClick={() => setActiveTab('CLAIM')} />
                    )}
                    <NavItem icon={<History size={20} />} label="Activity Log" isActive={activeTab === 'HISTORY'} onClick={() => setActiveTab('HISTORY')} />
                </nav>

                <div className="p-4 border-t border-slate-800/50">
                    <button onClick={logout} className="flex items-center gap-3 w-full px-4 py-3 text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-xl transition-all font-medium">
                        <LogOut size={20} />
                        <span>Log Out</span>
                    </button>
                </div>
            </aside>

            {/* --- MAIN CONTENT AREA --- */}
            <main className="flex-1 flex flex-col relative z-10 overflow-hidden">
                <header className="h-20 border-b border-slate-800/50 bg-[#0f172a]/50 backdrop-blur-md flex items-center justify-between px-8 z-20">
                    <h2 className="text-sm font-bold uppercase tracking-widest text-slate-400 flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                        {activeTab.replace('_', ' ')} Control Deck
                    </h2>

                    <div className="flex items-center gap-6">
                        <button className="relative text-slate-400 hover:text-white transition-colors">
                            <Bell size={22} />
                            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-rose-500 rounded-full animate-pulse border-2 border-[#0f172a]"></span>
                        </button>

                        <div className="relative">
                            <button 
                                onClick={() => setIsProfileOpen(!isProfileOpen)}
                                className="flex items-center gap-3 pl-4 border-l border-slate-700 hover:opacity-80 transition-opacity"
                            >
                                {avatarPreview ? (
                                    <img src={avatarPreview} alt="Profile" className="w-10 h-10 rounded-full object-cover shadow-lg border border-slate-700" />
                                ) : (
                                    <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-emerald-500 to-teal-500 flex items-center justify-center text-white font-bold shadow-lg">
                                        {user?.name?.charAt(0).toUpperCase() || 'U'}
                                    </div>
                                )}
                                <div className="text-left hidden md:block">
                                    <p className="text-sm font-bold text-white leading-tight">{user?.name || 'User'}</p>
                                    <p className="text-xs text-slate-400">Settings</p>
                                </div>
                                <ChevronDown size={16} className={`text-slate-400 transition-transform ${isProfileOpen ? 'rotate-180' : ''}`} />
                            </button>

                            {isProfileOpen && (
                                <div className="absolute right-0 mt-3 w-64 bg-[#121b2f] border border-slate-700 rounded-2xl shadow-[0_10px_40px_rgba(0,0,0,0.5)] overflow-hidden z-50">
                                    <div className="p-4 border-b border-slate-800">
                                        <p className="text-sm font-bold text-white">Signed in as</p>
                                        <p className="text-xs text-emerald-400 truncate mt-1 font-medium">{user?.email || 'user@hopeconnect.org'}</p>
                                    </div>
                                    <div className="p-2">
                                        <button 
                                            onClick={() => { setActiveTab('PROFILE'); setIsProfileOpen(false); }}
                                            className="flex items-center gap-3 w-full px-3 py-2 text-sm text-slate-300 hover:text-emerald-400 hover:bg-slate-800 rounded-lg transition-colors"
                                        >
                                            <Settings size={16} /> Account Profile
                                        </button>
                                        <button onClick={logout} className="flex items-center gap-3 w-full px-3 py-2 text-sm text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 rounded-lg transition-colors mt-1">
                                            <LogOut size={16} /> Sign out
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </header>

                <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
                    
                    {!user?.verified && ['NGO', 'HOSPITAL'].includes(user?.role) && (
                        <div className="bg-amber-500/10 border border-amber-500/30 rounded-2xl p-4 flex items-start md:items-center gap-4 mb-6 backdrop-blur-md">
                            <div className="bg-amber-500/20 p-2 rounded-lg text-amber-400 shrink-0">
                                <ShieldAlert size={24} />
                            </div>
                            <div>
                                <p className="text-amber-200 text-sm font-medium">
                                    <span className="font-bold text-amber-400">Account Verification Pending:</span> Some capabilities are locked until administrators review your compliance documents. Update your details in the Profile tab.
                                </p>
                            </div>
                        </div>
                    )}

                    <div className="mt-2">
                        {/* ─── DYNAMIC MONITORING OVERVIEW TAB ─── */}
                        {activeTab === 'OVERVIEW' && (
                            <div className="space-y-8 animate-in fade-in duration-500">
                                <header>
                                    <h1 className="text-3xl md:text-4xl font-serif font-black text-white tracking-wide mb-1">
                                        Welcome Back, <span className="text-emerald-400">{user?.name}</span>
                                    </h1>
                                    <p className="text-slate-400 text-sm">Real-time status analysis across connected non-monetary supply lines.</p>
                                </header>

                                {/* Live Telemetry Cards */}
                                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                                    <div className="p-6 bg-slate-900/40 border border-slate-800/80 rounded-2xl backdrop-blur-md relative overflow-hidden group">
                                        <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/5 rounded-full blur-xl group-hover:bg-emerald-500/10 transition-colors"></div>
                                        <div className="text-slate-500 mb-4 flex items-center justify-between">
                                            <Zap size={22} className="text-emerald-400" />
                                            <span className="text-[10px] bg-emerald-500/10 text-emerald-400 px-2 py-0.5 rounded-full font-bold uppercase tracking-wider">Live</span>
                                        </div>
                                        <p className="text-2xl font-bold text-white mb-0.5">14 Mins</p>
                                        <p className="text-xs text-slate-400 font-medium uppercase tracking-wider">Avg Matching Velocity</p>
                                    </div>

                                    <div className="p-6 bg-slate-900/40 border border-slate-800/80 rounded-2xl backdrop-blur-md relative overflow-hidden group">
                                        <div className="absolute top-0 right-0 w-24 h-24 bg-blue-500/5 rounded-full blur-xl group-hover:bg-blue-500/10 transition-colors"></div>
                                        <div className="text-slate-500 mb-4 flex items-center justify-between">
                                            <Scale size={22} className="text-blue-400" />
                                            <Radio size={16} className="text-blue-400 animate-pulse" />
                                        </div>
                                        <p className="text-2xl font-bold text-white mb-0.5">4,850 Kg</p>
                                        <p className="text-xs text-slate-400 font-medium uppercase tracking-wider">Active Resource Weight</p>
                                    </div>

                                    <div className="p-6 bg-slate-900/40 border border-slate-800/80 rounded-2xl backdrop-blur-md relative overflow-hidden group">
                                        <div className="absolute top-0 right-0 w-24 h-24 bg-rose-500/5 rounded-full blur-xl group-hover:bg-rose-500/10 transition-colors"></div>
                                        <div className="text-slate-500 mb-4 flex items-center justify-between">
                                            <AlertCircle size={22} className="text-rose-400" />
                                            <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping"></span>
                                        </div>
                                        <p className="text-2xl font-bold text-white mb-0.5">3 Active</p>
                                        <p className="text-xs text-slate-400 font-medium uppercase tracking-wider">High-Priority Alerts</p>
                                    </div>

                                    <div className="p-6 bg-slate-900/40 border border-slate-800/80 rounded-2xl backdrop-blur-md relative overflow-hidden group">
                                        <div className="absolute top-0 right-0 w-24 h-24 bg-amber-500/5 rounded-full blur-xl group-hover:bg-amber-500/10 transition-colors"></div>
                                        <div className="text-slate-500 mb-4 flex items-center justify-between">
                                            <Route size={22} className="text-amber-400" />
                                        </div>
                                        <p className="text-2xl font-bold text-white mb-0.5">100%</p>
                                        <p className="text-xs text-slate-400 font-medium uppercase tracking-wider">Verified Audits</p>
                                    </div>
                                </div>

                                {/* Graphic Load Allocation System & Quick Navigation Blocks */}
                                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                                    <div className="lg:col-span-2 p-6 bg-slate-900/30 border border-slate-800/80 rounded-2xl backdrop-blur-md flex flex-col justify-between">
                                        <div>
                                            <h3 className="font-bold text-lg mb-2 text-white">Ecosystem Load Distribution</h3>
                                            <p className="text-xs text-slate-400 mb-6">Localized pipeline demand assessment across your region.</p>
                                            
                                            <div className="space-y-4">
                                                <div>
                                                    <div className="flex justify-between text-xs mb-1 font-medium"><span className="text-slate-300">Food Rescue Supplies</span><span className="text-emerald-400">64% Capacity</span></div>
                                                    <div className="w-full h-2 bg-slate-950 rounded-full overflow-hidden"><div className="h-full bg-emerald-500 rounded-full" style={{width: '64%'}}></div></div>
                                                </div>
                                                <div>
                                                    <div className="flex justify-between text-xs mb-1 font-medium"><span className="text-slate-300">First-Aid & Medical Crates</span><span className="text-blue-400">22% Capacity</span></div>
                                                    <div className="w-full h-2 bg-slate-950 rounded-full overflow-hidden"><div className="h-full bg-blue-500 rounded-full" style={{width: '22%'}}></div></div>
                                                </div>
                                                <div>
                                                    <div className="flex justify-between text-xs mb-1 font-medium"><span className="text-slate-300">Blankets & Dispatched Shelter</span><span className="text-amber-400">14% Capacity</span></div>
                                                    <div className="w-full h-2 bg-slate-950 rounded-full overflow-hidden"><div className="h-full bg-amber-500 rounded-full" style={{width: '14%'}}></div></div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="pt-6 mt-6 border-t border-slate-800/50 flex justify-between items-center text-xs text-slate-400">
                                            <span>API Gateway Node Sync: <strong className="text-slate-300">http://localhost:5001</strong></span>
                                            <span className="flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>Data Integrity Verified</span>
                                        </div>
                                    </div>

                                    <div className="p-6 bg-slate-900/30 border border-slate-800/80 rounded-2xl backdrop-blur-md flex flex-col justify-between">
                                        <div>
                                            <h3 className="font-bold text-lg mb-1 text-white">Quick Task Router</h3>
                                            <p className="text-xs text-slate-400 mb-6">Instantly route workflows straight into logistics forms.</p>
                                            
                                            <div className="space-y-3">
                                                {canDonate && (
                                                    <button onClick={() => setActiveTab('DONATE')} className="w-full p-3 bg-slate-950/40 border border-slate-800 rounded-xl flex items-center justify-between text-xs font-semibold hover:border-slate-700 hover:bg-slate-950 transition-all text-slate-300 hover:text-white">
                                                        <span>Dispatch New Donation</span><PlusCircle size={14} className="text-emerald-400" />
                                                    </button>
                                                )}
                                                {canClaim && (
                                                    <button onClick={() => setActiveTab('CLAIM')} className="w-full p-3 bg-slate-950/40 border border-slate-800 rounded-xl flex items-center justify-between text-xs font-semibold hover:border-slate-700 hover:bg-slate-950 transition-all text-slate-300 hover:text-white">
                                                        <span>Inspect Open Claims Buffer</span><PackageCheck size={14} className="text-blue-400" />
                                                    </button>
                                                )}
                                                <button onClick={() => setActiveTab('HISTORY')} className="w-full p-3 bg-slate-950/40 border border-slate-800 rounded-xl flex items-center justify-between text-xs font-semibold hover:border-slate-700 hover:bg-slate-950 transition-all text-slate-300 hover:text-white">
                                                    <span>Review Verified Ledgers</span><History size={14} className="text-amber-400" />
                                                </button>
                                            </div>
                                        </div>
                                        
                                        <div className="bg-slate-950/30 p-3 rounded-xl border border-slate-800/50 text-[11px] text-slate-400 font-light leading-normal">
                                            To modify anchor location pointers, contact phone lines, or updates to organization profile text descriptions, navigate to the User Profile configuration screen.
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* --- PROFILE TAB --- */}
                        {activeTab === 'PROFILE' && (
                            <div className="max-w-4xl bg-slate-900/50 p-8 md:p-10 rounded-3xl border border-slate-800 backdrop-blur-md animate-in fade-in slide-in-from-bottom-8 duration-500">
                                <h2 className="text-2xl font-bold mb-8 text-white flex items-center gap-3">
                                    <User className="text-emerald-400" /> User Profile & Settings
                                </h2>
                                
                                <div className="flex flex-col md:flex-row items-center md:items-start gap-8 mb-10 pb-10 border-b border-slate-800">
                                    <div onClick={() => fileInputRef.current.click()} className="relative group cursor-pointer">
                                        <input type="file" ref={fileInputRef} onChange={handleAvatarChange} className="hidden" accept="image/*" />
                                        {avatarPreview ? (
                                            <img src={avatarPreview} alt="Avatar Preview" className="w-28 h-28 rounded-full object-cover border-4 border-slate-800 group-hover:border-emerald-500 transition-colors" />
                                        ) : (
                                            <div className="w-28 h-28 rounded-full bg-gradient-to-tr from-emerald-500 to-teal-500 flex items-center justify-center text-white text-4xl font-bold border-4 border-slate-800 group-hover:border-emerald-500 transition-colors">
                                                {profileData.name.charAt(0).toUpperCase() || 'U'}
                                            </div>
                                        )}
                                        <div className="absolute bottom-0 right-0 p-2.5 bg-emerald-500 rounded-full shadow-lg border-4 border-[#0f172a] text-slate-900 hover:scale-110 transition-transform">
                                            <Camera size={16} />
                                        </div>
                                    </div>

                                    <div className="text-center md:text-left flex-1">
                                        <h3 className="text-2xl font-bold text-white mb-1">{profileData.name || user?.name}</h3>
                                        <p className="text-emerald-400 text-sm mb-4 font-medium uppercase tracking-wider">{user?.role?.replace('_', ' ')}</p>
                                        <button type="button" onClick={() => fileInputRef.current.click()} className="px-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-white text-sm font-medium rounded-xl border border-slate-700 transition-colors">
                                            Upload New Photo
                                        </button>
                                    </div>
                                </div>

                                <form className="space-y-6" onSubmit={handleProfileUpdate}>
                                    <div className="grid md:grid-cols-2 gap-6">
                                        <div>
                                            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Organization / User Name</label>
                                            <input type="text" value={profileData.name} onChange={(e) => setProfileData({...profileData, name: e.target.value})} className="w-full bg-slate-950/50 border border-slate-700/50 rounded-xl px-4 py-3.5 text-white focus:outline-none focus:border-emerald-500 shadow-inner" />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Email Address (Read Only)</label>
                                            <input type="email" defaultValue={user?.email} disabled className="w-full bg-slate-900/50 border border-slate-800 rounded-xl px-4 py-3.5 text-slate-500 cursor-not-allowed" />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Contact Phone Number</label>
                                            <input type="tel" placeholder="+91 00000 00000" value={profileData.phone} onChange={(e) => setProfileData({...profileData, phone: e.target.value})} className="w-full bg-slate-950/50 border border-slate-700/50 rounded-xl px-4 py-3.5 text-white focus:outline-none focus:border-emerald-500 shadow-inner" />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Headquarters / Location</label>
                                            <input type="text" placeholder="123 Main St, Tech City" value={profileData.location} onChange={(e) => setProfileData({...profileData, location: e.target.value})} className="w-full bg-slate-950/50 border border-slate-700/50 rounded-xl px-4 py-3.5 text-white focus:outline-none focus:border-emerald-500 shadow-inner" />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">About / Mission Statement</label>
                                        <textarea rows="4" placeholder="Describe your NGO's mission..." value={profileData.bio} onChange={(e) => setProfileData({...profileData, bio: e.target.value})} className="w-full bg-slate-950/50 border border-slate-700/50 rounded-xl px-4 py-3.5 text-white focus:outline-none focus:border-emerald-500 resize-none shadow-inner"></textarea>
                                    </div>
                                    
                                    <div className="flex justify-end pt-6 border-t border-slate-800">
                                        <button type="submit" disabled={isUpdating} className="bg-emerald-500 hover:bg-emerald-400 text-slate-900 font-bold py-3.5 px-8 rounded-xl shadow-[0_0_15px_rgba(16,185,129,0.3)] disabled:opacity-50">
                                            {isUpdating ? "Saving Details..." : "Save Profile Details"}
                                        </button>
                                    </div>
                                </form>
                            </div>
                        )}

                        {activeTab === 'DONATE' && (
                            <div className="max-w-2xl bg-slate-900/50 p-8 rounded-3xl border border-slate-800 backdrop-blur-md animate-in fade-in slide-in-from-bottom-8 duration-500">
                                <h2 className="text-2xl font-bold mb-6 text-white flex items-center gap-3">
                                    <PlusCircle className="text-emerald-400" /> Log a New Resource
                                </h2>
                                <CreateResourceForm />
                            </div>
                        )}

                        {activeTab === 'CLAIM' && (
                            <div className="max-w-5xl bg-slate-900/50 p-8 rounded-3xl border border-slate-800 backdrop-blur-md animate-in fade-in slide-in-from-bottom-8 duration-500">
                                <h2 className="text-2xl font-bold mb-6 text-white flex items-center gap-3">
                                    <AlertCircle className="text-rose-500" /> Available Emergency Resources
                                </h2>
                                <EmergencyPanel />
                            </div>
                        )}

                        {activeTab === 'HISTORY' && (
                            <div className="max-w-5xl bg-slate-900/50 p-8 rounded-3xl border border-slate-800 backdrop-blur-md animate-in fade-in slide-in-from-bottom-8 duration-500">
                                <h2 className="text-2xl font-bold mb-6 text-white flex items-center gap-3">
                                    <History className="text-blue-400" /> Resource Activity Log
                                </h2>
                                <ActivityHistory />
                            </div>
                        )}
                    </div>
                </div>
            </main>

            <style>{`
                .custom-scrollbar::-webkit-scrollbar { width: 6px; }
                .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
                .custom-scrollbar::-webkit-scrollbar-thumb { background: #1e293b; border-radius: 10px; }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #334155; }
            `}</style>
        </div>
    );
};

const NavItem = ({ icon, label, isActive, onClick }) => {
    return (
        <button 
            onClick={onClick}
            className={`w-full flex items-center gap-4 px-4 py-3.5 rounded-xl transition-all duration-300 font-medium ${
                isActive ? 'bg-slate-800 text-white shadow-lg border border-slate-700/50' : 'text-slate-400 hover:bg-slate-800/50 hover:text-slate-200'
            }`}
        >
            <div>{icon}</div>
            <span>{label}</span>
        </button>
    );
};

export default Dashboard;