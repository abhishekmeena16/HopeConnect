import { useState, useEffect, useCallback } from 'react';
import { 
    AlertCircle, 
    PlusCircle, 
    Search, 
    HeartHandshake, 
    MessageSquare, 
    MapPin, 
    CheckCircle2, 
    ShieldAlert, 
    X,
    Building2,
    Utensils,
    BriefcaseMedical,
    Home
} from 'lucide-react';
import toast from 'react-hot-toast';
import { getAllAidRequests, createAidRequest, fulfillAidRequest } from '../services/aidRequestService';

export default function AidRequestsBoard({ currentUser, onOpenChat }) {
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [selectedType, setSelectedType] = useState('ALL');
    const [selectedUrgency, setSelectedUrgency] = useState('ALL');
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [submitting, setSubmitting] = useState(false);

    // Form state
    const [form, setForm] = useState({
        title: '',
        type: 'FOOD',
        quantity: '',
        urgency: 'HIGH',
        location: currentUser?.location || '',
        description: ''
    });

    const fetchRequests = useCallback(async () => {
        try {
            setLoading(true);
            const params = {};
            if (selectedType !== 'ALL') params.type = selectedType;
            if (selectedUrgency !== 'ALL') params.urgency = selectedUrgency;
            if (search.trim()) params.search = search.trim();

            const data = await getAllAidRequests(params);
            setRequests(data);
        } catch (error) {
            console.error('Failed to load aid requests:', error);
            toast.error('Failed to sync community aid requests.');
        } finally {
            setLoading(false);
        }
    }, [selectedType, selectedUrgency, search]);

    useEffect(() => {
        fetchRequests();
    }, [fetchRequests]);

    const handleSearchSubmit = (e) => {
        e.preventDefault();
        fetchRequests();
    };

    const handleCreate = async (e) => {
        e.preventDefault();
        if (!form.title || !form.quantity || !form.location) {
            toast.error('Please complete title, quantity, and location.');
            return;
        }

        try {
            setSubmitting(true);
            await createAidRequest({
                ...form,
                quantity: parseInt(form.quantity, 10)
            });
            toast.success('Aid requisition broadcasted to donors successfully!');
            setShowCreateModal(false);
            setForm({
                title: '',
                type: 'FOOD',
                quantity: '',
                urgency: 'HIGH',
                location: currentUser?.location || '',
                description: ''
            });
            fetchRequests();
        } catch (error) {
            console.error('Error broadcasting need:', error);
            toast.error(error.response?.data?.error || 'Failed to broadcast need.');
        } finally {
            setSubmitting(false);
        }
    };

    const handleFulfill = async (request) => {
        if (request.requesterId === currentUser?.id) {
            toast.error('You cannot fulfill your own requisition.');
            return;
        }

        try {
            await fulfillAidRequest(request.id);
            toast.success(`Thank you! You have pledged to fulfill: ${request.title}`);
            fetchRequests();
        } catch (error) {
            console.error('Error fulfilling request:', error);
            toast.error(error.response?.data?.error || 'Failed to pledge fulfillment.');
        }
    };

    const getTypeIcon = (type) => {
        switch (type) {
            case 'FOOD': return <Utensils className="w-4 h-4 text-emerald-600" />;
            case 'MEDICAL_SUPPLY': return <BriefcaseMedical className="w-4 h-4 text-sky-600" />;
            case 'SHELTER': return <Home className="w-4 h-4 text-purple-600" />;
            default: return <AlertCircle className="w-4 h-4 text-blue-600" />;
        }
    };

    return (
        <div className="space-y-6">
            {/* Header Banner */}
            <div className="bg-gradient-to-r from-amber-600 to-orange-600 rounded-3xl p-6 sm:p-8 text-white shadow-lg relative overflow-hidden">
                <div className="absolute right-0 top-0 translate-x-12 -translate-y-8 w-64 h-64 bg-white/10 rounded-full blur-2xl pointer-events-none" />
                
                <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                    <div className="space-y-2 max-w-xl">
                        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-xs font-bold text-amber-100 uppercase tracking-wider">
                            <ShieldAlert className="w-3.5 h-3.5 text-white" />
                            Community Needs Requisition Board
                        </div>
                        <h2 className="text-2xl sm:text-3xl font-extrabold font-heading text-white">
                            Direct Urgent Needs & Requisitions
                        </h2>
                        <p className="text-sm text-amber-100 leading-relaxed">
                            NGOs, healthcare clinics, and shelters broadcast acute local shortages here. Donors and relief teams can immediately step up to fulfill them.
                        </p>
                    </div>

                    <button
                        onClick={() => setShowCreateModal(true)}
                        className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-white text-amber-900 font-bold text-sm shadow-md hover:bg-amber-50 hover:shadow-lg transition-all active:scale-95 shrink-0"
                    >
                        <PlusCircle className="w-4 h-4 text-amber-600" />
                        Broadcast Urgent Need
                    </button>
                </div>
            </div>

            {/* Filter & Search Bar */}
            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
                <form onSubmit={handleSearchSubmit} className="relative flex-1">
                    <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                        type="text"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Search needs by keyword, clinic, or relief camp..."
                        className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all"
                    />
                </form>

                <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
                    <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl">
                        {['ALL', 'FOOD', 'MEDICAL_SUPPLY', 'SHELTER'].map(type => (
                            <button
                                key={type}
                                onClick={() => setSelectedType(type)}
                                className={`px-3 py-1.5 rounded-lg font-semibold transition-all ${
                                    selectedType === type
                                        ? 'bg-white text-slate-900 shadow-xs'
                                        : 'text-slate-600 hover:text-slate-900'
                                }`}
                            >
                                {type === 'ALL' ? 'All Types' : type.replace('_', ' ')}
                            </button>
                        ))}
                    </div>

                    <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl">
                        {['ALL', 'CRITICAL', 'HIGH'].map(urgency => (
                            <button
                                key={urgency}
                                onClick={() => setSelectedUrgency(urgency)}
                                className={`px-2.5 py-1.5 rounded-lg font-semibold transition-all ${
                                    selectedUrgency === urgency
                                        ? 'bg-amber-600 text-white shadow-xs'
                                        : 'text-slate-600 hover:text-slate-900'
                                }`}
                            >
                                {urgency === 'ALL' ? 'Any Urgency' : urgency}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Requests Grid */}
            {loading ? (
                <div className="flex flex-col items-center justify-center py-16 space-y-3">
                    <div className="w-8 h-8 border-3 border-amber-600 border-t-transparent rounded-full animate-spin" />
                    <p className="text-sm text-slate-500 font-medium">Scanning open community requisitions...</p>
                </div>
            ) : requests.length === 0 ? (
                <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 space-y-3">
                    <div className="w-14 h-14 bg-amber-50 text-amber-600 rounded-2xl flex items-center justify-center mx-auto">
                        <CheckCircle2 className="w-7 h-7" />
                    </div>
                    <h3 className="text-lg font-bold text-slate-800">No Open Aid Requisitions</h3>
                    <p className="text-sm text-slate-500 max-w-md mx-auto">
                        All broadcasted community requests have been fulfilled, or none match the selected filter.
                    </p>
                    <button
                        onClick={() => setShowCreateModal(true)}
                        className="px-4 py-2 bg-amber-600 text-white text-xs font-bold rounded-xl hover:bg-amber-700"
                    >
                        Broadcast First Requisition
                    </button>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                    {requests.map(req => {
                        const isCritical = req.urgency === 'CRITICAL';
                        return (
                            <div
                                key={req.id}
                                className={`ui-card rounded-2xl p-5 flex flex-col justify-between transition-all duration-200 hover:-translate-y-1 hover:shadow-md ${
                                    isCritical ? 'border-amber-300 ring-1 ring-amber-400/30' : 'border-slate-200'
                                }`}
                            >
                                <div className="space-y-3">
                                    <div className="flex items-start justify-between gap-2">
                                        <div className="flex items-center gap-2">
                                            <div className="p-2 bg-slate-50 rounded-xl border border-slate-100">
                                                {getTypeIcon(req.type)}
                                            </div>
                                            <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                                                {req.type.replace('_', ' ')}
                                            </span>
                                        </div>

                                        <span className={`text-[10px] font-extrabold uppercase px-2.5 py-1 rounded-full ${
                                            isCritical 
                                                ? 'bg-rose-100 text-rose-700 animate-pulse' 
                                                : req.urgency === 'HIGH' 
                                                ? 'bg-amber-100 text-amber-800' 
                                                : 'bg-slate-100 text-slate-700'
                                        }`}>
                                            {req.urgency} Urgency
                                        </span>
                                    </div>

                                    <div>
                                        <h3 className="text-base font-bold text-slate-900 line-clamp-2">{req.title}</h3>
                                        <p className="text-xs text-slate-500 mt-1 line-clamp-3">
                                            {req.description || 'No detailed specifications provided. Please verify via coordination channel.'}
                                        </p>
                                    </div>

                                    <div className="p-3 bg-slate-50 rounded-xl space-y-1.5 text-xs text-slate-600 border border-slate-100">
                                        <div className="flex items-center justify-between font-semibold">
                                            <span>Quantity Needed:</span>
                                            <span className="text-amber-700 font-bold text-sm">{req.quantity} Units</span>
                                        </div>
                                        <div className="flex items-center gap-1.5 text-slate-500 truncate">
                                            <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                                            <span className="truncate">{req.location}</span>
                                        </div>
                                        <div className="flex items-center gap-1.5 text-slate-500 truncate">
                                            <Building2 className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                                            <span>By: <strong>{req.requester?.name || 'Relief Team'}</strong> ({req.requester?.role})</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="pt-4 mt-2 border-t border-slate-100 flex items-center gap-2">
                                    <button
                                        onClick={() => handleFulfill(req)}
                                        className="flex-1 py-2 px-3 bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-1.5 shadow-sm active:scale-98"
                                    >
                                        <HeartHandshake className="w-3.5 h-3.5" />
                                        Pledge Fulfillment
                                    </button>

                                    <button
                                        onClick={() => onOpenChat && onOpenChat(req.requester, req)}
                                        className="p-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl transition-colors"
                                        title="Direct logistics chat"
                                    >
                                        <MessageSquare className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

            {/* Broadcast Modal */}
            {showCreateModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 animate-in fade-in">
                    <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-100 space-y-5 animate-in zoom-in-95">
                        <div className="flex items-center justify-between">
                            <div>
                                <h3 className="text-xl font-bold font-heading text-slate-900">Broadcast Aid Requisition</h3>
                                <p className="text-xs text-slate-500">Post what your shelter or clinic urgently requires.</p>
                            </div>
                            <button
                                onClick={() => setShowCreateModal(false)}
                                className="p-2 text-slate-400 hover:text-slate-600 rounded-xl"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <form onSubmit={handleCreate} className="space-y-4 text-sm">
                            <div>
                                <label className="block text-xs font-bold text-slate-700 mb-1">Requisition Title *</label>
                                <input
                                    type="text"
                                    value={form.title}
                                    onChange={(e) => setForm({ ...form, title: e.target.value })}
                                    placeholder="e.g. Urgent: 60 blankets and dry rations for evacuation camp"
                                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
                                    required
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="block text-xs font-bold text-slate-700 mb-1">Resource Classification *</label>
                                    <select
                                        value={form.type}
                                        onChange={(e) => setForm({ ...form, type: e.target.value })}
                                        className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/20"
                                    >
                                        <option value="FOOD">Food Surplus / Rations</option>
                                        <option value="MEDICAL_SUPPLY">Medical Aid / Drugs</option>
                                        <option value="SHELTER">Emergency Shelter</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-xs font-bold text-slate-700 mb-1">Quantity Needed *</label>
                                    <input
                                        type="number"
                                        min="1"
                                        value={form.quantity}
                                        onChange={(e) => setForm({ ...form, quantity: e.target.value })}
                                        placeholder="e.g. 50"
                                        className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/20"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="block text-xs font-bold text-slate-700 mb-1">Urgency Level *</label>
                                    <select
                                        value={form.urgency}
                                        onChange={(e) => setForm({ ...form, urgency: e.target.value })}
                                        className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/20 font-semibold"
                                    >
                                        <option value="NORMAL">Normal Priority</option>
                                        <option value="HIGH">High Urgency</option>
                                        <option value="CRITICAL">Critical Emergency (SOS)</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-xs font-bold text-slate-700 mb-1">Drop-off / Camp Location *</label>
                                    <input
                                        type="text"
                                        value={form.location}
                                        onChange={(e) => setForm({ ...form, location: e.target.value })}
                                        placeholder="Camp address or landmark"
                                        className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/20"
                                        required
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-slate-700 mb-1">Specifications / Notes</label>
                                <textarea
                                    rows="3"
                                    value={form.description}
                                    onChange={(e) => setForm({ ...form, description: e.target.value })}
                                    placeholder="Detail any packaging instructions, infant dietary needs, or refrigeration constraints..."
                                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/20 resize-none"
                                />
                            </div>

                            <div className="flex items-center justify-end gap-3 pt-2">
                                <button
                                    type="button"
                                    onClick={() => setShowCreateModal(false)}
                                    className="px-4 py-2.5 text-xs font-semibold text-slate-600 hover:text-slate-800"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={submitting}
                                    className="px-6 py-2.5 bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs rounded-xl shadow-md transition-all disabled:opacity-50"
                                >
                                    {submitting ? 'Broadcasting...' : 'Broadcast Need'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
