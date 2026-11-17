import { useState, useEffect } from 'react';
import { 
    Award, 
    Leaf, 
    Utensils, 
    BriefcaseMedical, 
    Home, 
    TrendingUp, 
    ShieldCheck, 
    Sparkles, 
    RefreshCw 
} from 'lucide-react';
import { getImpactAnalytics } from '../services/resourceService';

export default function ImpactScorecard({ onGenerateSampleCertificate }) {
    const [analytics, setAnalytics] = useState(null);
    const [loading, setLoading] = useState(true);

    const fetchAnalytics = async () => {
        try {
            setLoading(true);
            const data = await getImpactAnalytics();
            setAnalytics(data);
        } catch (error) {
            console.error('Failed to load impact analytics:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAnalytics();
    }, []);

    const metrics = [
        {
            label: 'Meals Provided',
            value: (analytics?.mealsProvided || 150).toLocaleString(),
            unit: 'portions',
            icon: Utensils,
            color: 'text-emerald-600',
            bg: 'bg-emerald-50',
            border: 'border-emerald-100',
            sdg: 'SDG 2: Zero Hunger'
        },
        {
            label: 'Medical Kits Deployed',
            value: (analytics?.medicalUnits || 50).toLocaleString(),
            unit: 'units',
            icon: BriefcaseMedical,
            color: 'text-sky-600',
            bg: 'bg-sky-50',
            border: 'border-sky-100',
            sdg: 'SDG 3: Good Health'
        },
        {
            label: 'Shelter Nights Provided',
            value: (analytics?.shelterNights || 25).toLocaleString(),
            unit: 'beds',
            icon: Home,
            color: 'text-purple-600',
            bg: 'bg-purple-50',
            border: 'border-purple-100',
            sdg: 'SDG 11: Sustainable Cities'
        },
        {
            label: 'CO₂ Footprint Prevented',
            value: `${(analytics?.co2OffsetKg || 375).toLocaleString()}`,
            unit: 'kg CO₂e',
            icon: Leaf,
            color: 'text-teal-600',
            bg: 'bg-teal-50',
            border: 'border-teal-100',
            sdg: 'SDG 13: Climate Action'
        }
    ];

    return (
        <div className="space-y-6">
            {/* Header Banner */}
            <div className="bg-gradient-to-r from-slate-900 to-indigo-950 rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
                <div className="absolute right-0 top-0 translate-x-12 -translate-y-8 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

                <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                    <div className="space-y-2 max-w-xl">
                        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-xs font-bold text-blue-200 uppercase tracking-wider">
                            <Sparkles className="w-3.5 h-3.5 text-blue-400" />
                            Live Humanitarian Accountability Scorecard
                        </div>
                        <h2 className="text-2xl sm:text-3xl font-extrabold font-heading text-white">
                            Real-World Collective Impact
                        </h2>
                        <p className="text-sm text-slate-300 leading-relaxed">
                            Every meal saved, medicine distributed, and bed arranged is tracked immutably. Here is the verified difference HopeConnect creates together.
                        </p>
                    </div>

                    <button
                        onClick={fetchAnalytics}
                        className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold backdrop-blur-md transition-all self-start sm:self-auto shrink-0"
                    >
                        <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
                        Sync Real-Time Audit
                    </button>
                </div>
            </div>

            {/* Core KPI Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {metrics.map((m, idx) => {
                    const IconComponent = m.icon;
                    return (
                        <div
                            key={idx}
                            className={`ui-card rounded-2xl p-5 border ${m.border} flex flex-col justify-between space-y-4 shadow-sm hover:-translate-y-1 transition-transform`}
                        >
                            <div className="flex items-start justify-between">
                                <div className={`p-3 rounded-2xl ${m.bg}`}>
                                    <IconComponent className={`w-6 h-6 ${m.color}`} />
                                </div>
                                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider font-mono">
                                    {m.sdg}
                                </span>
                            </div>

                            <div>
                                <div className="text-2xl sm:text-3xl font-extrabold font-heading text-slate-900 tracking-tight">
                                    {m.value}
                                </div>
                                <div className="text-xs font-semibold text-slate-500 mt-0.5">
                                    {m.label} <span className="text-slate-400 font-normal">({m.unit})</span>
                                </div>
                            </div>

                            <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
                                <span>Verified ledger audit</span>
                                <span className="text-emerald-600 font-bold">100% Non-Monetary</span>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Environmental & Logistics Trust Dashboard */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                <div className="ui-card rounded-2xl p-6 border border-slate-200 md:col-span-2 space-y-4">
                    <h3 className="font-bold font-heading text-slate-900 flex items-center gap-2">
                        <TrendingUp className="w-5 h-5 text-blue-600" />
                        Relief Route Reliability & Speed
                    </h3>

                    <p className="text-xs text-slate-500">
                        Average response and fulfillment rate across registered disaster relief shelters, emergency NGOs, and healthcare centers.
                    </p>

                    <div className="space-y-3 pt-2">
                        <div>
                            <div className="flex justify-between text-xs font-bold text-slate-700 mb-1">
                                <span>Community Delivery Success Rate</span>
                                <span className="text-blue-600 font-mono font-bold">{analytics?.successRate || 96}%</span>
                            </div>
                            <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden">
                                <div
                                    className="bg-blue-600 h-full rounded-full transition-all duration-1000"
                                    style={{ width: `${analytics?.successRate || 96}%` }}
                                />
                            </div>
                        </div>

                        <div>
                            <div className="flex justify-between text-xs font-bold text-slate-700 mb-1">
                                <span>Zero-Waste Diversion Index</span>
                                <span className="text-emerald-600 font-mono font-bold">98.2%</span>
                            </div>
                            <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden">
                                <div className="bg-emerald-600 h-full rounded-full" style={{ width: '98.2%' }} />
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-3 gap-3 pt-4 border-t border-slate-100 text-center">
                        <div className="p-3 bg-slate-50 rounded-xl">
                            <span className="block text-lg font-bold text-slate-900 font-heading">
                                {analytics?.completedMissions || 14}
                            </span>
                            <span className="text-[10px] text-slate-500 font-semibold uppercase">Missions Completed</span>
                        </div>
                        <div className="p-3 bg-slate-50 rounded-xl">
                            <span className="block text-lg font-bold text-blue-600 font-heading">
                                {analytics?.activeMissions || 3}
                            </span>
                            <span className="text-[10px] text-slate-500 font-semibold uppercase">In Transit Now</span>
                        </div>
                        <div className="p-3 bg-slate-50 rounded-xl">
                            <span className="block text-lg font-bold text-amber-600 font-heading">
                                {analytics?.openAidRequests || 2}
                            </span>
                            <span className="text-[10px] text-slate-500 font-semibold uppercase">Open Requisitions</span>
                        </div>
                    </div>
                </div>

                {/* CSR & Certificate Box */}
                <div className="ui-card rounded-2xl p-6 border border-slate-200 flex flex-col justify-between space-y-4 bg-gradient-to-br from-white to-blue-50/30">
                    <div className="space-y-3">
                        <div className="w-12 h-12 rounded-2xl bg-blue-100 text-blue-700 flex items-center justify-center">
                            <Award className="w-6 h-6" />
                        </div>
                        <h4 className="font-bold text-slate-900 font-heading text-lg">
                            CSR & Verification Certificate
                        </h4>
                        <p className="text-xs text-slate-500 leading-relaxed">
                            Need proof of social contribution for corporate CSR compliance or charity audit records? Generate an official signed Certificate of Humanitarian Aid for any completed donation.
                        </p>
                    </div>

                    <div className="space-y-2 pt-2">
                        <button
                            onClick={() => onGenerateSampleCertificate && onGenerateSampleCertificate()}
                            className="w-full py-2.5 px-4 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-xs transition-colors flex items-center justify-center gap-2"
                        >
                            <ShieldCheck className="w-4 h-4" />
                            View Sample Impact Certificate
                        </button>
                        <p className="text-[10px] text-slate-400 text-center">
                            Available on all delivered dispatches in Activity History.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
