// client/src/components/EmergencyPanel.jsx
import { useState, useEffect, useMemo } from 'react';
import { getAllResources, claimResource } from '../services/resourceService';
import { resolveImageUrl } from '../services/api';
import toast from 'react-hot-toast';
import { 
    MapPin, Box, AlertTriangle, HandHeart, Loader2, 
    Search, Utensils, Stethoscope, Home, RefreshCw, User,
    Clock, MessageSquare
} from 'lucide-react';

const EmergencyPanel = ({ onOpenChat }) => {
    const [resources, setResources] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [claimingId, setClaimingId] = useState(null);
    const [selectedCategory, setSelectedCategory] = useState('ALL');
    const [onlyEmergency, setOnlyEmergency] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');

    const fetchResources = async () => {
        setIsLoading(true);
        try {
            const data = await getAllResources();
            setResources(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error("Fetch buffer error:", error);
            toast.error('Failed to sync active logistics buffer');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchResources();
    }, []);

    const handleClaimResource = async (resource) => {
        setClaimingId(resource.id);
        try {
            await claimResource(resource.id);
            toast.success(`Route locked! You claimed: ${resource.title}`);
            // Remove from unclaimed feed
            setResources((prev) => prev.filter((item) => item.id !== resource.id));
        } catch (error) {
            const msg = error.response?.data?.error || 'Failed to lock matching route';
            toast.error(msg);
        } finally {
            setClaimingId(null);
        }
    };

    // Filter resources
    const filteredResources = useMemo(() => {
        return resources.filter((item) => {
            if (selectedCategory !== 'ALL' && item.type !== selectedCategory) {
                return false;
            }
            if (onlyEmergency && !item.isEmergency) {
                return false;
            }
            if (searchQuery.trim()) {
                const query = searchQuery.toLowerCase();
                const matchTitle = item.title?.toLowerCase().includes(query);
                const matchLocation = item.location?.toLowerCase().includes(query);
                const matchDonor = item.donor?.name?.toLowerCase().includes(query);
                return matchTitle || matchLocation || matchDonor;
            }
            return true;
        });
    }, [resources, selectedCategory, onlyEmergency, searchQuery]);

    const getCategoryBadge = (type) => {
        switch (type) {
            case 'FOOD':
                return { label: 'Food & Meals', icon: Utensils, badgeClass: 'text-emerald-700 bg-emerald-50 border-emerald-200' };
            case 'MEDICAL_SUPPLY':
                return { label: 'Medical Supplies', icon: Stethoscope, badgeClass: 'text-blue-700 bg-blue-50 border-blue-200' };
            case 'SHELTER':
                return { label: 'Shelter / Blankets', icon: Home, badgeClass: 'text-amber-700 bg-amber-50 border-amber-200' };
            default:
                return { label: type?.replace('_', ' '), icon: Box, badgeClass: 'text-slate-700 bg-slate-100 border-slate-200' };
        }
    };

    return (
        <div className="space-y-6">
            
            {/* Filter & Search Bar */}
            <div className="ui-card p-4 rounded-2xl flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3 shadow-xs">
                {/* Search */}
                <div className="relative flex-1">
                    <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search open supplies by title, city, or donor name..."
                        className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 text-xs sm:text-sm focus:outline-none focus:border-blue-600 focus:bg-white focus:ring-4 focus:ring-blue-100 transition"
                    />
                </div>

                {/* Filter Pills */}
                <div className="flex flex-wrap items-center gap-2">
                    <button
                        onClick={() => setSelectedCategory('ALL')}
                        className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                            selectedCategory === 'ALL'
                                ? 'bg-slate-900 text-white'
                                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                        }`}
                    >
                        All
                    </button>
                    <button
                        onClick={() => setSelectedCategory('FOOD')}
                        className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                            selectedCategory === 'FOOD'
                                ? 'bg-emerald-600 text-white'
                                : 'bg-emerald-50 text-emerald-800 hover:bg-emerald-100'
                        }`}
                    >
                        Food
                    </button>
                    <button
                        onClick={() => setSelectedCategory('MEDICAL_SUPPLY')}
                        className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                            selectedCategory === 'MEDICAL_SUPPLY'
                                ? 'bg-blue-600 text-white'
                                : 'bg-blue-50 text-blue-800 hover:bg-blue-100'
                        }`}
                    >
                        Medical
                    </button>
                    <button
                        onClick={() => setSelectedCategory('SHELTER')}
                        className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                            selectedCategory === 'SHELTER'
                                ? 'bg-amber-600 text-white'
                                : 'bg-amber-50 text-amber-800 hover:bg-amber-100'
                        }`}
                    >
                        Shelter
                    </button>

                    <button
                        onClick={() => setOnlyEmergency(!onlyEmergency)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 ${
                            onlyEmergency
                                ? 'bg-rose-600 text-white shadow-xs'
                                : 'bg-rose-50 text-rose-700 border border-rose-200 hover:bg-rose-100'
                        }`}
                    >
                        <AlertTriangle size={12} />
                        <span>Emergency Only</span>
                    </button>

                    <button
                        onClick={fetchResources}
                        className="p-2 text-slate-500 hover:text-slate-800 bg-slate-100 rounded-lg hover:bg-slate-200 transition"
                        title="Refresh feed"
                    >
                        <RefreshCw size={14} className={isLoading ? "animate-spin" : ""} />
                    </button>
                </div>
            </div>

            {/* List Canvas */}
            {isLoading ? (
                <div className="flex flex-col items-center justify-center py-20 text-slate-400">
                    <Loader2 className="animate-spin text-blue-600 mb-3" size={32} />
                    <p className="text-sm font-medium text-slate-600">Scanning regional logistics buffer...</p>
                </div>
            ) : filteredResources.length === 0 ? (
                <div className="ui-card flex flex-col items-center justify-center py-16 text-center text-slate-500 rounded-3xl p-8">
                    <div className="w-16 h-16 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mb-4">
                        <Box size={28} />
                    </div>
                    <h3 className="text-lg font-bold text-slate-800 mb-1 font-heading">No Resources In Buffer</h3>
                    <p className="text-xs sm:text-sm max-w-sm text-slate-500 leading-relaxed font-normal">
                        {searchQuery || selectedCategory !== 'ALL' || onlyEmergency
                            ? "Try broadening your category filters or search keywords."
                            : "All available supplies in your sector have been successfully routed. New items will appear here as donors log them."}
                    </p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                    {filteredResources.map((item) => {
                        const badge = getCategoryBadge(item.type);
                        const CategoryIcon = badge.icon;
                        const isClaimingThis = claimingId === item.id;
                        const resolvedImg = resolveImageUrl(item.imageUrl);

                        return (
                            <div 
                                key={item.id} 
                                className="ui-card rounded-2xl overflow-hidden flex flex-col justify-between ui-card-hover"
                            >
                                <div>
                                    {/* Image Canvas */}
                                    <div className="h-44 bg-slate-100 relative overflow-hidden border-b border-slate-100">
                                        {resolvedImg ? (
                                            <img 
                                                src={resolvedImg} 
                                                alt={item.title} 
                                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                                onError={(e) => {
                                                    e.currentTarget.style.display = 'none';
                                                }}
                                            />
                                        ) : (
                                            <div className="w-full h-full flex flex-col items-center justify-center text-slate-400 gap-2">
                                                <Box size={28} className="opacity-40" />
                                                <span className="text-[10px] uppercase font-bold tracking-wider opacity-60">No Image Uploaded</span>
                                            </div>
                                        )}

                                        {/* Category & Emergency Badges */}
                                        <div className="absolute top-3 left-3 flex flex-wrap gap-2">
                                            {item.isEmergency && (
                                                <span className="bg-rose-600 text-white text-[10px] font-black tracking-wider uppercase px-2.5 py-1 rounded-md flex items-center gap-1 shadow-sm animate-pulse">
                                                    <AlertTriangle size={12} /> Emergency Aid
                                                </span>
                                            )}
                                            <span className={`text-[10px] font-bold px-2.5 py-1 rounded-md flex items-center gap-1 border backdrop-blur-md shadow-xs ${badge.badgeClass}`}>
                                                <CategoryIcon size={12} />
                                                <span>{badge.label}</span>
                                            </span>
                                            {item.expiresAt && (() => {
                                                const diff = new Date(item.expiresAt) - Date.now();
                                                if (diff <= 0) return (
                                                    <span className="bg-rose-900/90 text-white text-[10px] font-bold px-2 py-0.5 rounded-md flex items-center gap-1">
                                                        <Clock size={10} /> Expired
                                                    </span>
                                                );
                                                const hrs = Math.floor(diff / (1000 * 60 * 60));
                                                const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
                                                const isUrgent = diff < 2 * 60 * 60 * 1000;
                                                return (
                                                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md flex items-center gap-1 backdrop-blur-md shadow-xs ${
                                                        isUrgent ? 'bg-amber-500 text-white animate-pulse' : 'bg-slate-900/80 text-white'
                                                    }`}>
                                                        <Clock size={10} /> {hrs > 0 ? `${hrs}h ` : ''}{mins}m left
                                                    </span>
                                                );
                                            })()}
                                        </div>

                                        <div className="absolute bottom-3 right-3 bg-white/95 backdrop-blur-md border border-slate-200 text-slate-800 text-[11px] font-mono font-bold px-2.5 py-0.5 rounded-full shadow-xs">
                                            {item.quantity} Units
                                        </div>
                                    </div>

                                    {/* Text Metadata */}
                                    <div className="p-5">
                                        <h3 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight mb-2 line-clamp-1 font-heading" title={item.title}>
                                            {item.title}
                                        </h3>

                                        {item.description && (
                                            <p className="text-xs text-slate-500 mb-4 line-clamp-2 font-normal leading-relaxed">
                                                {item.description}
                                            </p>
                                        )}
                                        
                                        <div className="space-y-2 text-xs text-slate-600 font-medium">
                                            <div className="flex items-center gap-2">
                                                <MapPin size={14} className="text-blue-600 shrink-0" />
                                                <span className="truncate" title={item.location}>
                                                    Pickup: <strong className="text-slate-800">{item.location}</strong>
                                                </span>
                                            </div>

                                            {item.donor && (
                                                <div className="flex items-center gap-2">
                                                    <User size={14} className="text-emerald-600 shrink-0" />
                                                    <span className="truncate">
                                                        Donor: <strong className="text-slate-800">{item.donor.name}</strong> 
                                                        <span className="text-[10px] text-slate-400 ml-1">({item.donor.role?.replace('_', ' ')})</span>
                                                    </span>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {/* Claim & Coordinate Actions */}
                                <div className="p-5 pt-0 flex items-center gap-2">
                                    <button 
                                        onClick={() => handleClaimResource(item)}
                                        disabled={isClaimingThis}
                                        className={`flex-1 font-bold py-2.5 px-4 rounded-xl text-xs tracking-wider uppercase transition-all flex items-center justify-center gap-2 shadow-sm disabled:opacity-50 ${
                                            item.isEmergency
                                                ? 'bg-rose-600 hover:bg-rose-700 text-white shadow-rose-600/20'
                                                : 'bg-blue-600 hover:bg-blue-700 text-white shadow-blue-600/20'
                                        }`}
                                    >
                                        {isClaimingThis ? (
                                            <>
                                                <Loader2 size={14} className="animate-spin" />
                                                <span>Locking Route...</span>
                                            </>
                                        ) : (
                                            <>
                                                <HandHeart size={14} />
                                                <span>Lock Route & Claim</span>
                                            </>
                                        )}
                                    </button>

                                    {item.donor && onOpenChat && (
                                        <button
                                            onClick={() => onOpenChat(item.donor, item)}
                                            className="p-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl transition-colors shrink-0"
                                            title="Message donor directly"
                                        >
                                            <MessageSquare size={16} />
                                        </button>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
};

export default EmergencyPanel;