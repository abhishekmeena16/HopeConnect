import { useState, useEffect } from 'react';
import api from '../services/api';
import toast from 'react-hot-toast';
import { MapPin, Box, AlertTriangle, HandHeart, Loader2 } from 'lucide-react';

const EmergencyPanel = () => {
    const [resources, setResources] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchResources = async () => {
            try {
                const response = await api.get('/resources');
                // Ensure array structure and sort emergencies to the top
                const data = response.data || [];
                const sorted = [...data].sort((a, b) => b.isEmergency - a.isEmergency);
                setResources(sorted);
            } catch (error) {
                console.error(error);
                toast.error('Failed to sync active logistics buffer');
            } finally {
                setIsLoading(false);
            }
        };
        fetchResources();
    }, []);

    const handleClaimResource = async (resourceId) => {
        try {
            await api.post(`/resources/${resourceId}/claim`);
            toast.success('Resource distribution matching route locked!');
            // Remove claimed item dynamically from the active visual feed array
            setResources(prev => prev.filter(item => item.id !== resourceId));
        } catch (error) {
            toast.error(error.response?.data?.error || 'Failed to initiate distribution route');
        }
    };

    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center py-20 text-slate-500">
                <Loader2 className="animate-spin text-emerald-400 mb-4" size={32} />
                <p className="text-sm font-medium">Syncing regional logistics buffers...</p>
            </div>
        );
    }

    if (resources.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-20 text-center text-slate-500">
                <Box size={48} className="opacity-20 mb-4 text-slate-400" />
                <h3 className="text-lg font-bold text-slate-300">Logistics Buffer Empty</h3>
                <p className="text-sm max-w-xs mt-1">All incoming food and medical supplies have been successfully matched and dispatched.</p>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {resources.map((item) => (
                <div 
                    key={item.id} 
                    className={`bg-slate-950/40 border rounded-2xl overflow-hidden backdrop-blur-md flex flex-col justify-between transition-all duration-300 group hover:-translate-y-1 ${
                        item.isEmergency 
                            ? 'border-rose-500/30 shadow-[0_0_20px_rgba(225,29,72,0.05)]' 
                            : 'border-slate-800 hover:border-slate-700 shadow-xl'
                    }`}
                >
                    <div>
                        {/* Dynamic Image Canvas Section */}
                        <div className="h-44 bg-slate-900 relative overflow-hidden border-b border-slate-950">
                            {item.imageUrl ? (
                                <img 
                                    src={`http://localhost:5001${item.imageUrl}`} 
                                    alt={item.title} 
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                />
                            ) : (
                                <div className="w-full h-full flex flex-col items-center justify-center bg-slate-900 text-slate-600 gap-2">
                                    <Box size={28} className="opacity-40" />
                                    <span className="text-xs uppercase font-bold tracking-wider opacity-40">No Photo Attached</span>
                                </div>
                            )}

                            {/* Emergency Category Flag Badge */}
                            {item.isEmergency && (
                                <div className="absolute top-4 left-4 bg-rose-500 text-white text-[10px] font-black tracking-widest uppercase px-2.5 py-1 rounded-md flex items-center gap-1 shadow-lg shadow-rose-950/50 animate-pulse">
                                    <AlertTriangle size={12} /> Critical Crisis aid
                                </div>
                            )}

                            <div className="absolute top-4 right-4 bg-slate-950/80 backdrop-blur-md border border-slate-800 text-slate-300 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                                {item.type?.replace('_', ' ')}
                            </div>
                        </div>

                        {/* Text Metadata Body Block */}
                        <div className="p-6">
                            <h3 className="text-xl font-serif font-bold text-white tracking-wide mb-2 line-clamp-1">{item.title}</h3>
                            
                            <div className="space-y-2.5 text-xs text-slate-400 font-medium">
                                <div className="flex items-center gap-2">
                                    <Box size={14} className="text-emerald-400 shrink-0" />
                                    <span>Quantity Available: <strong className="text-white font-semibold">{item.quantity} Allocation Units</strong></span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <MapPin size={14} className="text-blue-400 shrink-0" />
                                    <span className="truncate">Pickup Anchor: <strong className="text-white font-semibold">{item.location}</strong></span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Master Allocation Trigger Call to Action */}
                    <div className="p-6 pt-0">
                        <button 
                            onClick={() => handleClaimResource(item.id)}
                            className={`w-full font-bold py-3 px-4 rounded-xl text-xs tracking-wider uppercase transition-all duration-300 flex items-center justify-center gap-2 ${
                                item.isEmergency
                                    ? 'bg-rose-500 hover:bg-rose-600 text-white shadow-[0_4px_15px_rgba(225,29,72,0.2)]'
                                    : 'bg-slate-800 hover:bg-emerald-500 hover:text-slate-950 text-slate-300 shadow-md'
                            }`}
                        >
                            <HandHeart size={14} /> Lock Matching Route
                        </button>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default EmergencyPanel;