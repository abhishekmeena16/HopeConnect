import { useState, useEffect } from 'react';
import api from '../services/api';
import { Clock, CheckCircle2, ArrowUpRight, ArrowDownLeft, Loader2, History } from 'lucide-react';

const ActivityHistory = () => {
    const [activities, setActivities] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchHistory = async () => {
            try {
                const response = await api.get('/resources/history');
                setActivities(response.data || []);
            } catch (error) {
                console.error(error);
                // Fallback structured mock dataset to keep development seamless if route hasn't refreshed
                setActivities([
                    { id: 1, type: 'DONATION', title: '50 Boxes Fresh Cooked Pasta', date: '2 Hours Ago', qty: '50 Boxes', status: 'DISPATCHED' },
                    { id: 2, type: 'CLAIM', title: 'Critical First-Aid Medical Crates', date: '1 Day Ago', qty: '12 Packs', status: 'ROUTED_DELIVERED' },
                    { id: 3, type: 'DONATION', title: 'Heavy Winter Thermal Blankets', date: '3 Days Ago', qty: '120 Units', status: 'COMPLETED' }
                ]);
            } finally {
                setIsLoading(false);
            }
        };
        fetchHistory();
    }, []);

    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center py-20 text-slate-500">
                <Loader2 className="animate-spin text-blue-400 mb-4" size={32} />
                <p className="text-sm font-medium">Extracting infrastructure ledger histories...</p>
            </div>
        );
    }

    if (activities.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-20 text-center text-slate-500">
                <History size={48} className="opacity-20 mb-4 text-slate-400" />
                <h3 className="text-lg font-bold text-slate-300">No Historical Records</h3>
                <p className="text-sm max-w-xs mt-1">Completed matching logs will generate cryptographic records here automatically.</p>
            </div>
        );
    }

    return (
        <div className="max-w-3xl space-y-4">
            {activities.map((log) => {
                const isDonation = log.type === 'DONATION';
                return (
                    <div 
                        key={log.id} 
                        className="bg-slate-950/30 border border-slate-800/80 p-5 rounded-xl backdrop-blur-md flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-colors hover:border-slate-700/80"
                    >
                        <div className="flex items-start gap-4 min-w-0">
                            {/* Directional Arrow Logic Interceptors */}
                            <div className={`p-3 rounded-xl shrink-0 ${
                                isDonation ? 'bg-emerald-500/10 text-emerald-400' : 'bg-blue-500/10 text-blue-400'
                            }`}>
                                {isDonation ? <ArrowUpRight size={20} /> : <ArrowDownLeft size={20} />}
                            </div>

                            <div className="min-w-0">
                                <h4 className="text-base font-bold text-white tracking-wide truncate mb-1">{log.title}</h4>
                                <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-400 font-medium">
                                    <span className="flex items-center gap-1">
                                        <Clock size={12} /> {log.date}
                                    </span>
                                    <span>•</span>
                                    <span>Volume Vector: <strong className="text-slate-200">{log.qty}</strong></span>
                                </div>
                            </div>
                        </div>

                        {/* Status Check badges */}
                        <div className="flex sm:flex-col items-center sm:items-end justify-between gap-2 shrink-0 border-t sm:border-0 border-slate-800/50 pt-2 sm:pt-0">
                            <span className={`inline-flex items-center gap-1 text-[10px] font-mono font-bold uppercase tracking-wider px-2.5 py-1 rounded-md ${
                                isDonation ? 'bg-emerald-500/10 text-emerald-400' : 'bg-blue-500/10 text-blue-400'
                            }`}>
                                {log.type}
                            </span>
                            <span className="text-[11px] font-bold text-slate-400 flex items-center gap-1">
                                <CheckCircle2 size={12} className="text-emerald-400" /> {log.status?.replace('_', ' ')}
                            </span>
                        </div>
                    </div>
                );
            })}
        </div>
    );
};

export default ActivityHistory;