import { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { 
    History, PackageCheck, AlertCircle, LogOut, 
    Settings, ChevronDown, PlusCircle, ShieldAlert,
    User, Camera, LayoutDashboard, Route, Zap, Scale, Radio,
    Menu, X, CheckCircle, HeartHandshake, MapPin, MessageSquare,
    Award
} from 'lucide-react';

import CreateResourceForm from '../components/CreateResourceForm';
import EmergencyPanel from '../components/EmergencyPanel';
import ActivityHistory from '../components/ActivityHistory';
import ReliefMap from '../components/ReliefMap';
import AidRequestsBoard from '../components/AidRequestsBoard';
import LogisticsChat from '../components/LogisticsChat';
import ImpactScorecard from '../components/ImpactScorecard';
import ImpactCertificateModal from '../components/ImpactCertificateModal';

import api, { resolveImageUrl, API_BASE_URL } from '../services/api';
import { getAllResources, claimResource } from '../services/resourceService';
import { getAllAidRequests, fulfillAidRequest } from '../services/aidRequestService';
import toast from 'react-hot-toast'; 

const Dashboard = () => {
    const { user, logout, updateUser } = useAuth();
    
    const [activeTab, setActiveTab] = useState('OVERVIEW');
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
    const [isUpdatingProfile, setIsUpdatingProfile] = useState(false);

    // Live Map & Shared Data
    const [resources, setResources] = useState([]);
    const [aidRequests, setAidRequests] = useState([]);

    // Cross-Component Routing State
    const [chatPartner, setChatPartner] = useState(null);
    const [chatResource, setChatResource] = useState(null);
    const [certificateResource, setCertificateResource] = useState(null);

    // Profile States
    const fileInputRef = useRef(null);
    const [avatarFile, setAvatarFile] = useState(null);
    const [avatarPreview, setAvatarPreview] = useState('');
    const [profileData, setProfileData] = useState({
        name: '',
        phone: '',
        location: '',
        bio: ''
    });

    const refreshPlatformData = async () => {
        try {
            const [resData, reqData] = await Promise.all([
                getAllResources().catch(() => []),
                getAllAidRequests().catch(() => [])
            ]);
            setResources(Array.isArray(resData) ? resData : []);
            setAidRequests(Array.isArray(reqData) ? reqData : []);
        } catch (error) {
            console.error('Failed to sync map data:', error);
        }
    };

    useEffect(() => {
        refreshPlatformData();
    }, []);

    useEffect(() => {
        if (user) {
            setProfileData({
                name: user.name || '',
                phone: user.phone || '',
                location: user.location || '',
                bio: user.bio || ''
            });
            if (user.avatarUrl) {
                setAvatarPreview(resolveImageUrl(user.avatarUrl));
            }
        }
    }, [user]);

    const handleAvatarChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            if (file.size > 5 * 1024 * 1024) {
                toast.error("Avatar image size must be under 5MB");
                return;
            }
            setAvatarFile(file);
            setAvatarPreview(URL.createObjectURL(file));
        }
    };

    // Role Capabilities
    const canDonate = ['INDIVIDUAL_DONOR', 'RESTAURANT', 'HOSPITAL', 'ADMIN'].includes(user?.role);
    const canClaim = ['NGO', 'OLD_AGE_HOME', 'HOSPITAL', 'ADMIN'].includes(user?.role);

    const handleOpenChat = (partner, resource = null) => {
        if (!partner) return;
        setChatPartner(partner);
        setChatResource(resource);
        setActiveTab('CHAT');
    };

    const handleClaimFromMap = async (resourceId) => {
        try {
            await claimResource(resourceId);
            toast.success('Route locked! Supply successfully claimed.');
            refreshPlatformData();
        } catch (error) {
            toast.error(error.response?.data?.error || 'Failed to claim resource.');
        }
    };

    const handleFulfillFromMap = async (request) => {
        try {
            await fulfillAidRequest(request.id);
            toast.success(`Thank you! Pledged to fulfill: ${request.title}`);
            refreshPlatformData();
        } catch (error) {
            toast.error(error.response?.data?.error || 'Failed to fulfill requisition.');
        }
    };

    const handleProfileUpdate = async (e) => {
        e.preventDefault();
        setIsUpdatingProfile(true);
        try {
            const multiPartPayload = new FormData();
            multiPartPayload.append('name', profileData.name.trim());
            multiPartPayload.append('phone', profileData.phone.trim());
            multiPartPayload.append('location', profileData.location.trim());
            multiPartPayload.append('bio', profileData.bio.trim());
            
            if (avatarFile) {
                multiPartPayload.append('avatar', avatarFile);
            }

            const response = await api.put('/auth/profile', multiPartPayload, {
                headers: { 
                    'Content-Type': 'multipart/form-data'
                }
            });

            if (updateUser && typeof updateUser === 'function') {
                updateUser(response.data);
            }

            toast.success("Profile coordinates successfully saved!");
            setAvatarFile(null);

        } catch (error) {
            console.error(error);
            toast.error(error.response?.data?.error || "Failed to update profile");
        } finally {
            setIsUpdatingProfile(false);
        }
    };

    const handleTabSwitch = (tab) => {
        setActiveTab(tab);
        setIsMobileNavOpen(false);
    };

    return (
        <div className="flex h-screen bg-[#F8FAFC] text-slate-800 font-sans overflow-hidden selection:bg-blue-600 selection:text-white">
            
            {/* MOBILE BACKDROP OVERLAY */}
            {isMobileNavOpen && (
                <div 
                    onClick={() => setIsMobileNavOpen(false)}
                    className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs z-40 lg:hidden"
                />
            )}

            {/* --- SIDEBAR (Deep Obsidian Navy for clear contrast) --- */}
            <aside className={`
                fixed lg:static inset-y-0 left-0 z-50
                w-72 bg-[#0F172A] text-white flex flex-col 
                transition-transform duration-300 ease-in-out border-r border-slate-800
                ${isMobileNavOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
            `}>
                {/* Brand Header */}
                <div className="p-6 border-b border-slate-800 flex items-center justify-between">
                    <div>
                        <div className="flex items-center gap-2.5 mb-2">
                            <div className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center shadow-md">
                                <HeartHandshake size={18} />
                            </div>
                            <span className="font-bold text-lg tracking-tight font-heading text-white">HOPECONNECT</span>
                        </div>
                        <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white/10 text-emerald-400 text-[10px] font-mono font-bold uppercase tracking-wider">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                            {user?.role?.replace('_', ' ') || 'COORDINATOR'}
                        </div>
                    </div>

                    <button 
                        onClick={() => setIsMobileNavOpen(false)}
                        className="lg:hidden p-1.5 text-slate-400 hover:text-white"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Navigation Items */}
                <nav className="flex-1 overflow-y-auto py-6 px-4 space-y-1.5 custom-scrollbar">
                    <p className="px-3 text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2">Operations Deck</p>
                    <NavItem 
                        icon={<LayoutDashboard size={18} />} 
                        label="Ecosystem Overview" 
                        isActive={activeTab === 'OVERVIEW'} 
                        onClick={() => handleTabSwitch('OVERVIEW')} 
                    />
                    <NavItem 
                        icon={<MapPin size={18} className="text-cyan-400" />} 
                        label="Live Relief GIS Map" 
                        isActive={activeTab === 'MAP'} 
                        onClick={() => handleTabSwitch('MAP')} 
                    />
                    <NavItem 
                        icon={<Award size={18} className="text-yellow-400" />} 
                        label="Impact Scorecard" 
                        isActive={activeTab === 'IMPACT'} 
                        onClick={() => handleTabSwitch('IMPACT')} 
                    />

                    <p className="px-3 text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2 mt-6">Relief Logistics</p>
                    <NavItem 
                        icon={<ShieldAlert size={18} className="text-amber-400" />} 
                        label="Community Needs Board" 
                        isActive={activeTab === 'NEEDS'} 
                        onClick={() => handleTabSwitch('NEEDS')} 
                    />
                    {canDonate && (
                        <NavItem 
                            icon={<PlusCircle size={18} className="text-emerald-400" />} 
                            label="Log New Supply" 
                            isActive={activeTab === 'DONATE'} 
                            onClick={() => handleTabSwitch('DONATE')} 
                        />
                    )}
                    {canClaim && (
                        <NavItem 
                            icon={<PackageCheck size={18} className="text-blue-400" />} 
                            label="Claims Buffer" 
                            isActive={activeTab === 'CLAIM'} 
                            onClick={() => handleTabSwitch('CLAIM')} 
                        />
                    )}
                    <NavItem 
                        icon={<History size={18} className="text-purple-400" />} 
                        label="Activity History" 
                        isActive={activeTab === 'HISTORY'} 
                        onClick={() => handleTabSwitch('HISTORY')} 
                    />

                    <p className="px-3 text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2 mt-6">Coordination</p>
                    <NavItem 
                        icon={<MessageSquare size={18} className="text-indigo-400" />} 
                        label="Logistics Messenger" 
                        isActive={activeTab === 'CHAT'} 
                        onClick={() => handleTabSwitch('CHAT')} 
                    />
                    <NavItem 
                        icon={<Settings size={18} />} 
                        label="Profile Coordinates" 
                        isActive={activeTab === 'PROFILE'} 
                        onClick={() => handleTabSwitch('PROFILE')} 
                    />
                </nav>

                {/* Footer User & Sign Out */}
                <div className="p-4 border-t border-slate-800">
                    <button 
                        onClick={logout} 
                        className="flex items-center gap-3 w-full px-4 py-3 text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-xl transition font-semibold text-xs uppercase tracking-wider"
                    >
                        <LogOut size={16} />
                        <span>Sign Out Session</span>
                    </button>
                </div>
            </aside>

            {/* --- MAIN CONTENT CANVAS --- */}
            <main className="flex-1 flex flex-col relative z-10 overflow-hidden">
                
                {/* Header Navbar */}
                <header className="h-16 lg:h-20 bg-white border-b border-slate-200 flex items-center justify-between px-4 sm:px-8 z-20 shadow-xs">
                    <div className="flex items-center gap-3">
                        <button 
                            onClick={() => setIsMobileNavOpen(true)}
                            aria-label="Open navigation menu"
                            className="lg:hidden p-2 text-slate-600 hover:text-slate-900 bg-slate-100 rounded-xl"
                        >
                            <Menu size={20} />
                        </button>
                        <div>
                            <h2 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-slate-700 flex items-center gap-2 font-heading">
                                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                                {activeTab.replace('_', ' ')} Workstation
                            </h2>
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        {/* Quick GIS Map Switch Button */}
                        {activeTab !== 'MAP' && (
                            <button
                                onClick={() => setActiveTab('MAP')}
                                className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-xl text-xs font-bold transition shadow-xs"
                            >
                                <MapPin size={14} />
                                <span>GIS Map</span>
                            </button>
                        )}

                        {/* User Profile Dropdown */}
                        <div className="relative">
                            <button 
                                onClick={() => setIsProfileOpen(!isProfileOpen)}
                                className="flex items-center gap-3 pl-3 sm:pl-4 border-l border-slate-200 hover:opacity-90 transition"
                            >
                                {avatarPreview ? (
                                    <img 
                                        src={avatarPreview} 
                                        alt="Profile" 
                                        className="w-9 h-9 sm:w-10 sm:h-10 rounded-full object-cover border border-slate-300 shadow-xs" 
                                    />
                                ) : (
                                    <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold text-sm shadow-xs font-heading">
                                        {user?.name?.charAt(0).toUpperCase() || 'U'}
                                    </div>
                                )}
                                <div className="text-left hidden md:block">
                                    <p className="text-sm font-bold text-slate-800 leading-tight truncate max-w-[140px] font-heading">{user?.name || 'Coordinator'}</p>
                                    <p className="text-[11px] text-slate-500 font-medium">Account Settings</p>
                                </div>
                                <ChevronDown size={14} className={`text-slate-400 transition-transform ${isProfileOpen ? 'rotate-180' : ''}`} />
                            </button>

                            {isProfileOpen && (
                                <div className="absolute right-0 mt-3 w-64 bg-white border border-slate-200 rounded-2xl shadow-xl overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                                    <div className="p-4 border-b border-slate-100 bg-slate-50">
                                        <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Signed In Account</p>
                                        <p className="text-sm font-bold text-slate-900 truncate mt-0.5 font-heading">{user?.name}</p>
                                        <p className="text-xs text-blue-600 truncate font-mono mt-0.5">{user?.email}</p>
                                    </div>
                                    <div className="p-2">
                                        <button 
                                            onClick={() => { setActiveTab('PROFILE'); setIsProfileOpen(false); }}
                                            className="flex items-center gap-3 w-full px-3 py-2 text-xs font-semibold text-slate-700 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition"
                                        >
                                            <Settings size={15} /> Edit Profile & Coordinates
                                        </button>
                                        <button 
                                            onClick={logout} 
                                            className="flex items-center gap-3 w-full px-3 py-2 text-xs font-semibold text-rose-600 hover:text-rose-700 hover:bg-rose-50 rounded-xl transition mt-1"
                                        >
                                            <LogOut size={15} /> Sign Out Session
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </header>

                {/* Tab Content Canvas */}
                <div className="flex-1 overflow-y-auto p-4 sm:p-8 custom-scrollbar">
                    
                    {/* Unverified NGO Notice */}
                    {!user?.verified && ['NGO', 'HOSPITAL'].includes(user?.role) && (
                        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 flex items-start sm:items-center gap-3.5 mb-6 shadow-xs">
                            <div className="bg-amber-100 p-2 rounded-xl text-amber-700 shrink-0">
                                <ShieldAlert size={20} />
                            </div>
                            <div className="text-xs sm:text-sm text-amber-900">
                                <span className="font-bold">Organization Verification In Review:</span> Keep your warehouse pickup location and contact numbers updated in the Profile tab for rapid validation.
                            </div>
                        </div>
                    )}

                    {/* ─── TAB 1: OVERVIEW TELEMETRY ─── */}
                    {activeTab === 'OVERVIEW' && (
                        <div className="space-y-8 max-w-7xl">
                            
                            {/* Welcome Banner */}
                            <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white rounded-3xl p-6 sm:p-8 shadow-md relative overflow-hidden">
                                <div className="relative z-10 max-w-2xl">
                                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 text-white text-xs font-semibold uppercase tracking-wider mb-3 backdrop-blur-md">
                                        <Radio size={14} className="animate-pulse text-emerald-300" /> Live Grid Synchronized
                                    </div>
                                    <h1 className="text-2xl sm:text-4xl font-black font-heading tracking-tight mb-2">
                                        Welcome, {user?.name || 'Partner Coordinator'}
                                    </h1>
                                    <p className="text-blue-100 text-xs sm:text-sm leading-relaxed font-normal">
                                        Real-time operational dashboard for physical surplus logistics, immediate demand matching, and distribution audit trails.
                                    </p>
                                </div>
                            </div>

                            {/* KPI Metrics Grid */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                                <div className="ui-card p-6 rounded-2xl ui-card-hover">
                                    <div className="flex items-center justify-between mb-4">
                                        <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                                            <Zap size={20} />
                                        </div>
                                        <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 font-mono">Real-Time</span>
                                    </div>
                                    <p className="text-2xl sm:text-3xl font-black font-heading text-slate-900 mb-0.5">14 Mins</p>
                                    <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Avg Route Matching Speed</p>
                                </div>

                                <div className="ui-card p-6 rounded-2xl ui-card-hover">
                                    <div className="flex items-center justify-between mb-4">
                                        <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                                            <Scale size={20} />
                                        </div>
                                        <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 font-mono">Monthly</span>
                                    </div>
                                    <p className="text-2xl sm:text-3xl font-black font-heading text-slate-900 mb-0.5">4,850 Kg</p>
                                    <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Physical Supplies Routed</p>
                                </div>

                                <div className="ui-card p-6 rounded-2xl ui-card-hover">
                                    <div className="flex items-center justify-between mb-4">
                                        <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center">
                                            <AlertCircle size={20} />
                                        </div>
                                        <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-rose-50 text-rose-700 font-mono">Critical</span>
                                    </div>
                                    <p className="text-2xl sm:text-3xl font-black font-heading text-slate-900 mb-0.5">Urgent Aid</p>
                                    <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">High-Priority Allocations</p>
                                </div>

                                <div className="ui-card p-6 rounded-2xl ui-card-hover">
                                    <div className="flex items-center justify-between mb-4">
                                        <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
                                            <Route size={20} />
                                        </div>
                                        <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 font-mono">Audited</span>
                                    </div>
                                    <p className="text-2xl sm:text-3xl font-black font-heading text-slate-900 mb-0.5">100%</p>
                                    <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Verified Zero-Waste Routing</p>
                                </div>
                            </div>

                            {/* Load Distribution and Quick Actions */}
                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                                <div className="lg:col-span-2 ui-card p-6 sm:p-8 rounded-3xl flex flex-col justify-between shadow-xs">
                                    <div>
                                        <h3 className="font-bold text-lg text-slate-900 mb-1 font-heading">Ecosystem Supply Demand</h3>
                                        <p className="text-xs text-slate-500 mb-6 font-normal">Active resource distribution percentages across verified partner shelters.</p>
                                        
                                        <div className="space-y-5">
                                            <div>
                                                <div className="flex justify-between text-xs mb-1.5 font-semibold text-slate-700">
                                                    <span>Food Rescue & Prepared Meals</span>
                                                    <span className="text-emerald-600 font-mono font-bold">64% Capacity</span>
                                                </div>
                                                <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                                                    <div className="h-full bg-emerald-500 rounded-full" style={{width: '64%'}}></div>
                                                </div>
                                            </div>
                                            <div>
                                                <div className="flex justify-between text-xs mb-1.5 font-semibold text-slate-700">
                                                    <span>First-Aid & Medical Crates</span>
                                                    <span className="text-blue-600 font-mono font-bold">22% Capacity</span>
                                                </div>
                                                <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                                                    <div className="h-full bg-blue-600 rounded-full" style={{width: '22%'}}></div>
                                                </div>
                                            </div>
                                            <div>
                                                <div className="flex justify-between text-xs mb-1.5 font-semibold text-slate-700">
                                                    <span>Winter Blankets & Crisis Shelter</span>
                                                    <span className="text-amber-600 font-mono font-bold">14% Capacity</span>
                                                </div>
                                                <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                                                    <div className="h-full bg-amber-500 rounded-full" style={{width: '14%'}}></div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="pt-6 mt-6 border-t border-slate-100 flex flex-col sm:flex-row justify-between sm:items-center text-xs text-slate-500 gap-2 font-medium">
                                        <span>API Gateway Node: <strong className="text-slate-700 font-mono">{API_BASE_URL}</strong></span>
                                        <span className="flex items-center gap-1.5 text-emerald-600"><CheckCircle size={14} /> Immutable Ledger Connected</span>
                                    </div>
                                </div>

                                <div className="ui-card p-6 sm:p-8 rounded-3xl flex flex-col justify-between shadow-xs">
                                    <div>
                                        <h3 className="font-bold text-lg text-slate-900 mb-1 font-heading">Direct Task Router</h3>
                                        <p className="text-xs text-slate-500 mb-6 font-normal">Immediate operational actions for your privileges.</p>
                                        
                                        <div className="space-y-3">
                                            <button 
                                                onClick={() => setActiveTab('MAP')} 
                                                className="w-full p-3.5 bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-xl flex items-center justify-between text-xs font-bold text-blue-900 transition group"
                                            >
                                                <span>Live GIS Relief Map</span>
                                                <MapPin size={16} className="text-blue-600 group-hover:scale-110 transition-transform" />
                                            </button>

                                            <button 
                                                onClick={() => setActiveTab('NEEDS')} 
                                                className="w-full p-3.5 bg-amber-50 hover:bg-amber-100 border border-amber-200 rounded-xl flex items-center justify-between text-xs font-bold text-amber-900 transition group"
                                            >
                                                <span>Community Needs Requisitions</span>
                                                <ShieldAlert size={16} className="text-amber-600 group-hover:scale-110 transition-transform" />
                                            </button>

                                            {canDonate && (
                                                <button 
                                                    onClick={() => setActiveTab('DONATE')} 
                                                    className="w-full p-3.5 bg-slate-50 hover:bg-emerald-50 border border-slate-200 hover:border-emerald-300 rounded-xl flex items-center justify-between text-xs font-bold text-slate-700 hover:text-emerald-800 transition group"
                                                >
                                                    <span>Dispatch New Supply</span>
                                                    <PlusCircle size={16} className="text-emerald-600 group-hover:scale-110 transition-transform" />
                                                </button>
                                            )}
                                            {canClaim && (
                                                <button 
                                                    onClick={() => setActiveTab('CLAIM')} 
                                                    className="w-full p-3.5 bg-slate-50 hover:bg-blue-50 border border-slate-200 hover:border-blue-300 rounded-xl flex items-center justify-between text-xs font-bold text-slate-700 hover:text-blue-800 transition group"
                                                >
                                                    <span>Open Claims Buffer</span>
                                                    <PackageCheck size={16} className="text-blue-600 group-hover:scale-110 transition-transform" />
                                                </button>
                                            )}
                                            <button 
                                                onClick={() => setActiveTab('CHAT')} 
                                                className="w-full p-3.5 bg-slate-50 hover:bg-indigo-50 border border-slate-200 hover:border-indigo-300 rounded-xl flex items-center justify-between text-xs font-bold text-slate-700 hover:text-indigo-800 transition group"
                                            >
                                                <span>Logistics Coordination Chat</span>
                                                <MessageSquare size={16} className="text-indigo-600 group-hover:scale-110 transition-transform" />
                                            </button>
                                        </div>
                                    </div>
                                    
                                    <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs text-slate-500 font-normal mt-6 leading-relaxed">
                                        Need to update contact numbers or warehouse pickup address? Adjust coordinates in Profile.
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* ─── TAB 2: LIVE GIS RELIEF MAP ─── */}
                    {activeTab === 'MAP' && (
                        <div className="max-w-7xl space-y-6">
                            <ReliefMap 
                                resources={resources}
                                aidRequests={aidRequests}
                                onClaim={handleClaimFromMap}
                                onFulfill={handleFulfillFromMap}
                                onOpenChat={handleOpenChat}
                            />
                        </div>
                    )}

                    {/* ─── TAB 3: COMMUNITY NEEDS REQUISITIONS ─── */}
                    {activeTab === 'NEEDS' && (
                        <div className="max-w-7xl space-y-6">
                            <AidRequestsBoard 
                                currentUser={user}
                                onOpenChat={handleOpenChat}
                            />
                        </div>
                    )}

                    {/* ─── TAB 4: IMPACT SCORECARD ─── */}
                    {activeTab === 'IMPACT' && (
                        <div className="max-w-7xl space-y-6">
                            <ImpactScorecard 
                                onGenerateSampleCertificate={() => {
                                    setCertificateResource({
                                        id: 'SAMPLE-RELIEF-2026',
                                        title: '150 Nutritious Meal Packs & Clean Drinking Water',
                                        type: 'FOOD',
                                        quantity: 150,
                                        status: 'DELIVERED',
                                        donor: { name: user?.name || 'Verified Benefactor', role: user?.role },
                                        beneficiary: { name: 'Yamuna Flood Relief Center' },
                                        updatedAt: new Date().toISOString()
                                    });
                                }}
                            />
                        </div>
                    )}

                    {/* ─── TAB 5: LOG NEW RESOURCE ─── */}
                    {activeTab === 'DONATE' && canDonate && (
                        <div className="max-w-3xl ui-card p-6 sm:p-10 rounded-3xl shadow-sm">
                            <div className="mb-8">
                                <h2 className="text-2xl font-bold font-heading text-slate-900 flex items-center gap-2.5">
                                    <PlusCircle className="text-emerald-600" /> Log A New Supply Resource
                                </h2>
                                <p className="text-xs sm:text-sm text-slate-500 font-normal mt-1">
                                    Logged items instantly broadcast onto regional shelter feeds for 15-minute route matching.
                                </p>
                            </div>
                            <CreateResourceForm onSuccess={() => {
                                refreshPlatformData();
                                setActiveTab('HISTORY');
                            }} />
                        </div>
                    )}

                    {/* ─── TAB 6: CLAIM BUFFER ─── */}
                    {activeTab === 'CLAIM' && canClaim && (
                        <div className="max-w-6xl space-y-6">
                            <div>
                                <h2 className="text-2xl font-bold font-heading text-slate-900 flex items-center gap-2.5">
                                    <PackageCheck className="text-blue-600" /> Open Logistics Buffer
                                </h2>
                                <p className="text-xs sm:text-sm text-slate-500 font-normal mt-1">
                                    Available food, medical gear, and emergency supplies waiting for shelter pickup in your sector.
                                </p>
                            </div>
                            <EmergencyPanel onOpenChat={handleOpenChat} />
                        </div>
                    )}

                    {/* ─── TAB 7: LOGISTICS MESSENGER ─── */}
                    {activeTab === 'CHAT' && (
                        <div className="max-w-5xl space-y-6">
                            <LogisticsChat 
                                currentUser={user}
                                initialPartner={chatPartner}
                                initialResource={chatResource}
                            />
                        </div>
                    )}

                    {/* ─── TAB 8: ACTIVITY HISTORY ─── */}
                    {activeTab === 'HISTORY' && (
                        <div className="max-w-5xl space-y-6">
                            <div>
                                <h2 className="text-2xl font-bold font-heading text-slate-900 flex items-center gap-2.5">
                                    <History className="text-purple-600" /> Verified Activity Ledger
                                </h2>
                                <p className="text-xs sm:text-sm text-slate-500 font-normal mt-1">
                                    Trace handovers, in-transit updates, and delivery confirmations for your account.
                                </p>
                            </div>
                            <ActivityHistory 
                                onOpenChat={handleOpenChat}
                                onViewCertificate={(item) => setCertificateResource(item)}
                            />
                        </div>
                    )}

                    {/* ─── TAB 9: PROFILE SETTINGS ─── */}
                    {activeTab === 'PROFILE' && (
                        <div className="max-w-3xl ui-card p-6 sm:p-10 rounded-3xl shadow-sm">
                            <h2 className="text-2xl font-bold font-heading mb-8 text-slate-900 flex items-center gap-2.5">
                                <User className="text-blue-600" /> Organization Profile & Coordinates
                            </h2>
                            
                            {/* Avatar Picker */}
                            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 mb-8 pb-8 border-b border-slate-100">
                                <div onClick={() => fileInputRef.current?.click()} className="relative group cursor-pointer shrink-0">
                                    <input 
                                        type="file" 
                                        ref={fileInputRef} 
                                        onChange={handleAvatarChange} 
                                        className="hidden" 
                                        accept="image/*" 
                                    />
                                    {avatarPreview ? (
                                        <img 
                                            src={avatarPreview} 
                                            alt="Avatar Preview" 
                                            className="w-24 h-24 rounded-full object-cover border-4 border-slate-100 group-hover:border-blue-500 transition-colors shadow-sm" 
                                        />
                                    ) : (
                                        <div className="w-24 h-24 rounded-full bg-blue-600 flex items-center justify-center text-white text-3xl font-bold font-heading border-4 border-slate-100 group-hover:border-blue-500 transition-colors shadow-sm">
                                            {profileData.name.charAt(0).toUpperCase() || 'U'}
                                        </div>
                                    )}
                                    <div className="absolute bottom-0 right-0 p-2 bg-blue-600 rounded-full shadow-sm border-2 border-white text-white group-hover:scale-110 transition-transform">
                                        <Camera size={14} />
                                    </div>
                                </div>

                                <div className="text-center sm:text-left flex-1 min-w-0">
                                    <h3 className="text-xl font-bold font-heading text-slate-900 mb-1 truncate">{profileData.name || user?.name}</h3>
                                    <p className="text-blue-700 text-xs mb-3 font-semibold uppercase tracking-wider">
                                        {user?.role?.replace('_', ' ') || 'COMMUNITY USER'}
                                    </p>
                                    <button 
                                        type="button" 
                                        onClick={() => fileInputRef.current?.click()} 
                                        className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold rounded-xl transition"
                                    >
                                        Change Profile Photo
                                    </button>
                                </div>
                            </div>

                            {/* Details Form */}
                            <form className="space-y-5" onSubmit={handleProfileUpdate}>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                                    <div>
                                        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Organization / Full Name</label>
                                        <input 
                                            type="text" 
                                            required
                                            value={profileData.name} 
                                            onChange={(e) => setProfileData({...profileData, name: e.target.value})} 
                                            className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-slate-900 text-sm focus:outline-none focus:border-blue-600 focus:ring-4 focus:ring-blue-100 transition shadow-xs" 
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Email Address (Immutable)</label>
                                        <input 
                                            type="email" 
                                            defaultValue={user?.email} 
                                            disabled 
                                            className="w-full bg-slate-100 border border-slate-200 rounded-xl px-4 py-3 text-slate-500 text-sm cursor-not-allowed font-mono" 
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Contact Phone Line</label>
                                        <input 
                                            type="tel" 
                                            placeholder="+91 98765 43210" 
                                            value={profileData.phone} 
                                            onChange={(e) => setProfileData({...profileData, phone: e.target.value})} 
                                            className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-slate-900 text-sm focus:outline-none focus:border-blue-600 focus:ring-4 focus:ring-blue-100 transition shadow-xs" 
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Headquarters / Warehouse Address</label>
                                        <input 
                                            type="text" 
                                            placeholder="Connaught Place, New Delhi" 
                                            value={profileData.location} 
                                            onChange={(e) => setProfileData({...profileData, location: e.target.value})} 
                                            className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-slate-900 text-sm focus:outline-none focus:border-blue-600 focus:ring-4 focus:ring-blue-100 transition shadow-xs" 
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">About / Mission Statement</label>
                                    <textarea 
                                        rows="4" 
                                        placeholder="Describe your daily operations, capacity, and distribution coverage..." 
                                        value={profileData.bio} 
                                        onChange={(e) => setProfileData({...profileData, bio: e.target.value})} 
                                        className="w-full bg-white border border-slate-200 rounded-xl p-4 text-slate-900 text-sm focus:outline-none focus:border-blue-600 focus:ring-4 focus:ring-blue-100 transition resize-none shadow-xs"
                                    ></textarea>
                                </div>
                                
                                <div className="flex justify-end pt-4 border-t border-slate-100">
                                    <button 
                                        type="submit" 
                                        disabled={isUpdatingProfile} 
                                        className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3.5 px-8 rounded-xl shadow-md disabled:opacity-50 text-sm transition"
                                    >
                                        {isUpdatingProfile ? "Saving Coordinates..." : "Save Coordinates & Details"}
                                    </button>
                                </div>
                            </form>
                        </div>
                    )}

                </div>
            </main>

            {/* Official Impact Certificate Modal */}
            {certificateResource && (
                <ImpactCertificateModal 
                    resource={certificateResource}
                    onClose={() => setCertificateResource(null)}
                />
            )}

        </div>
    );
};

const NavItem = ({ icon, label, isActive, onClick }) => {
    return (
        <button 
            onClick={onClick}
            className={`w-full flex items-center gap-3.5 px-4 py-3 rounded-xl transition-all duration-150 text-xs font-semibold ${
                isActive 
                    ? 'bg-blue-600 text-white shadow-sm' 
                    : 'text-slate-400 hover:bg-slate-800 hover:text-white'
            }`}
        >
            <div className="shrink-0">{icon}</div>
            <span className="truncate">{label}</span>
        </button>
    );
};

export default Dashboard;