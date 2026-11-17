// client/src/components/ActivityHistory.jsx
import { useState, useEffect } from 'react';
import { getActivityHistory, updateResourceStatus } from '../services/resourceService';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import { 
    Clock, CheckCircle2, ArrowUpRight, ArrowDownLeft, Loader2, 
    History, Truck, RefreshCw, Award, MessageSquare
} from 'lucide-react';

const ActivityHistory = ({ onOpenChat, onViewCertificate }) => {
    const { user } = useAuth();
    const [activities, setActivities] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [updatingId, setUpdatingId] = useState(null);
    const [filterTab, setFilterTab] = useState('ALL'); // ALL, DISPATCHES, CLAIMS

    const fetchHistory = async () => {
        setIsLoading(true);
        try {
            const data = await getActivityHistory();
            setActivities(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error("Fetch history error:", error);
            toast.error("Could not load activity history.");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchHistory();
    }, []);

    const handleUpdateStatus = async (resourceId, nextStatus) => {
        setUpdatingId(resourceId);
        try {
            await updateResourceStatus(resourceId, nextStatus);
            toast.success(`Logistics status updated to: ${nextStatus.replace('_', ' ')}`);
            setActivities((prev) => 
                prev.map((item) => 
                    item.id === resourceId ? { ...item, status: nextStatus } : item
                )
            );
        } catch (error) {
            toast.error(error.response?.data?.error || "Failed to update status");
        } finally {
            setUpdatingId(null);
        }
    };

    const formatTimestamp = (dateString) => {
        if (!dateString) return 'Recent';
        try {
            const date = new Date(dateString);
            return date.toLocaleDateString(undefined, { 
                month: 'short', 
                day: 'numeric',
                hour: '2-digit', 
                minute: '2-digit' 
            });
        } catch {
            return dateString;
        }
    };

    const getStatusBadge = (status) => {
        switch (status) {
            case 'PENDING':
                return { label: 'Pending Match', color: 'bg-amber-50 text-amber-800 border-amber-200' };
            case 'ACCEPTED':
                return { label: 'Route Locked', color: 'bg-blue-50 text-blue-800 border-blue-200' };
            case 'IN_TRANSIT':
                return { label: 'In Transit', color: 'bg-purple-50 text-purple-800 border-purple-200' };
            case 'DELIVERED':
                return { label: 'Delivered', color: 'bg-emerald-50 text-emerald-800 border-emerald-200' };
            case 'CANCELLED':
                return { label: 'Cancelled', color: 'bg-rose-50 text-rose-800 border-rose-200' };
            default:
                return { label: status, color: 'bg-slate-100 text-slate-700 border-slate-200' };
        }
    };

    const filteredActivities = activities.filter((item) => {
        const isDonor = item.donorId === user?.id;
        if (filterTab === 'DISPATCHES') return isDonor;
        if (filterTab === 'CLAIMS') return !isDonor;
        return true;
    });

    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center py-20 text-slate-400">
                <Loader2 className="animate-spin text-blue-600 mb-3" size={32} />
                <p className="text-sm font-medium text-slate-600">Querying verified activity ledger...</p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            
            {/* Filter Tabs Header */}
            <div className="ui-card p-4 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-xs">
                <div className="flex items-center gap-2">
                    <button
                        onClick={() => setFilterTab('ALL')}
                        className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition ${
                            filterTab === 'ALL'
                                ? 'bg-slate-900 text-white'
                                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                        }`}
                    >
                        All Records ({activities.length})
                    </button>
                    <button
                        onClick={() => setFilterTab('DISPATCHES')}
                        className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition ${
                            filterTab === 'DISPATCHES'
                                ? 'bg-emerald-600 text-white'
                                : 'bg-emerald-50 text-emerald-800 hover:bg-emerald-100'
                        }`}
                    >
                        My Dispatches
                    </button>
                    <button
                        onClick={() => setFilterTab('CLAIMS')}
                        className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition ${
                            filterTab === 'CLAIMS'
                                ? 'bg-blue-600 text-white'
                                : 'bg-blue-50 text-blue-800 hover:bg-blue-100'
                        }`}
                    >
                        My Claims
                    </button>
                </div>

                <button
                    onClick={fetchHistory}
                    className="flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 transition p-1.5"
                    title="Refresh logs"
                >
                    <RefreshCw size={13} className={isLoading ? "animate-spin" : ""} />
                    <span>Sync Ledger</span>
                </button>
            </div>

            {/* List */}
            {filteredActivities.length === 0 ? (
                <div className="ui-card flex flex-col items-center justify-center py-16 text-center text-slate-500 rounded-3xl p-8">
                    <div className="w-14 h-14 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mb-3">
                        <History size={26} />
                    </div>
                    <h3 className="text-lg font-bold text-slate-800 mb-1 font-heading">No Activity Records</h3>
                    <p className="text-xs sm:text-sm max-w-sm text-slate-500 font-normal">
                        {filterTab === 'ALL'
                            ? "Completed dispatches and claimed matching routes will automatically appear here."
                            : `No entries found under ${filterTab.toLowerCase()}.`}
                    </p>
                </div>
            ) : (
                <div className="space-y-3.5">
                    {filteredActivities.map((log) => {
                        const isDonor = log.donorId === user?.id;
                        const statusBadge = getStatusBadge(log.status);
                        const isUpdatingThis = updatingId === log.id;

                        return (
                            <div 
                                key={log.id} 
                                className="ui-card p-5 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-4 ui-card-hover"
                            >
                                <div className="flex items-start gap-4 min-w-0">
                                    {/* Directional Icon */}
                                    <div className={`p-3 rounded-xl shrink-0 ${
                                        isDonor ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' : 'bg-blue-50 text-blue-600 border border-blue-100'
                                    }`}>
                                        {isDonor ? <ArrowUpRight size={22} /> : <ArrowDownLeft size={22} />}
                                    </div>

                                    <div className="min-w-0">
                                        <div className="flex items-center gap-2 mb-1 flex-wrap">
                                            <h4 className="text-base font-bold text-slate-900 tracking-tight truncate max-w-md font-heading">
                                                {log.title}
                                            </h4>
                                            <span className={`text-[10px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded border ${statusBadge.color}`}>
                                                {statusBadge.label}
                                            </span>
                                        </div>

                                        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-500 font-medium">
                                            <span className="flex items-center gap-1 text-slate-400">
                                                <Clock size={12} /> {formatTimestamp(log.createdAt)}
                                            </span>
                                            <span>•</span>
                                            <span>Type: <strong className="text-slate-700">{log.type?.replace('_', ' ')}</strong></span>
                                            <span>•</span>
                                            <span>Units: <strong className="text-blue-700 font-mono">{log.quantity}</strong></span>
                                            {log.location && (
                                                <>
                                                    <span>•</span>
                                                    <span className="truncate max-w-[200px]">At: {log.location}</span>
                                                </>
                                            )}
                                        </div>

                                        {/* Partner Information */}
                                        <div className="mt-2 text-[11px] text-slate-500">
                                            {isDonor ? (
                                                log.beneficiary ? (
                                                    <span>Route locked by: <strong className="text-slate-800">{log.beneficiary.name}</strong> ({log.beneficiary.role?.replace('_', ' ')})</span>
                                                ) : (
                                                    <span className="text-amber-600 font-medium">Broadcast active • Awaiting nearby shelter claim</span>
                                                )
                                            ) : (
                                                log.donor && (
                                                    <span>Origin donor: <strong className="text-slate-800">{log.donor.name}</strong> ({log.donor.role?.replace('_', ' ')})</span>
                                                )
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {/* Status Progression & Logistics Actions */}
                                <div className="flex flex-wrap items-center justify-end gap-2 shrink-0 border-t md:border-0 border-slate-100 pt-3 md:pt-0">
                                    {/* Direct Logistics Chat */}
                                    {(isDonor ? log.beneficiary : log.donor) && onOpenChat && (
                                        <button
                                            onClick={() => onOpenChat(isDonor ? log.beneficiary : log.donor, log)}
                                            className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition shadow-xs"
                                            title="Chat with logistics partner"
                                        >
                                            <MessageSquare size={13} />
                                            <span>Chat</span>
                                        </button>
                                    )}

                                    {/* Action Buttons */}
                                    {log.status === 'ACCEPTED' && (
                                        <button
                                            onClick={() => handleUpdateStatus(log.id, 'IN_TRANSIT')}
                                            disabled={isUpdatingThis}
                                            className="px-3.5 py-1.5 bg-purple-50 hover:bg-purple-100 text-purple-700 border border-purple-200 rounded-xl text-xs font-bold flex items-center gap-1.5 transition disabled:opacity-50 shadow-xs"
                                        >
                                            <Truck size={14} />
                                            <span>Mark In Transit</span>
                                        </button>
                                    )}

                                    {log.status === 'IN_TRANSIT' && (
                                        <button
                                            onClick={() => handleUpdateStatus(log.id, 'DELIVERED')}
                                            disabled={isUpdatingThis}
                                            className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs flex items-center gap-1.5 transition disabled:opacity-50 shadow-xs"
                                        >
                                            <CheckCircle2 size={14} />
                                            <span>Confirm Handover</span>
                                        </button>
                                    )}

                                    {log.status === 'DELIVERED' && (
                                        <div className="flex items-center gap-2">
                                            <span className="text-xs font-bold text-emerald-700 flex items-center gap-1 px-2.5 py-1 bg-emerald-50 rounded-xl border border-emerald-200">
                                                <CheckCircle2 size={13} /> Handover Verified
                                            </span>
                                            {onViewCertificate && (
                                                <button
                                                    onClick={() => onViewCertificate(log)}
                                                    className="px-3 py-1 bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 rounded-xl text-xs font-bold flex items-center gap-1.5 transition shadow-xs"
                                                >
                                                    <Award size={13} />
                                                    <span>Certificate</span>
                                                </button>
                                            )}
                                        </div>
                                    )}

                                    {log.status === 'PENDING' && (
                                        <span className="text-xs text-slate-400 font-medium px-2 py-1">
                                            Awaiting Match
                                        </span>
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

export default ActivityHistory;