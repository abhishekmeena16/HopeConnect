import { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import { MapPin, Filter, RefreshCw } from 'lucide-react';

export default function ReliefMap({ resources = [], aidRequests = [], onClaim, onFulfill, onOpenChat }) {
    const mapContainerRef = useRef(null);
    const mapInstanceRef = useRef(null);
    const markersGroupRef = useRef(null);
    const [filterType, setFilterType] = useState('ALL'); // ALL, FOOD, MEDICAL_SUPPLY, SHELTER, EMERGENCY, NEEDS
    const [selectedEntity, setSelectedEntity] = useState(null);

    // Color code and pin generation
    const getPinHtml = (type, isEmergency, isNeed, urgency) => {
        if (isNeed) {
            const isCritical = urgency === 'CRITICAL';
            return `
                <div style="
                    background: ${isCritical ? '#E11D48' : '#D97706'};
                    color: white;
                    width: 38px;
                    height: 38px;
                    border-radius: 50% 50% 50% 0;
                    transform: rotate(-45deg);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    box-shadow: 0 4px 12px rgba(217, 119, 6, 0.4);
                    border: 2px solid #FFFFFF;
                ">
                    <div style="transform: rotate(45deg); font-size: 14px; font-weight: bold;">🆘</div>
                </div>
            `;
        }

        if (isEmergency) {
            return `
                <div style="
                    background: #E11D48;
                    color: white;
                    width: 40px;
                    height: 40px;
                    border-radius: 50% 50% 50% 0;
                    transform: rotate(-45deg);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    box-shadow: 0 0 16px rgba(225, 29, 72, 0.6);
                    border: 3px solid #FFFFFF;
                    animation: pulse 1.5s infinite;
                ">
                    <div style="transform: rotate(45deg); font-size: 15px;">🚨</div>
                </div>
            `;
        }

        let bg = '#2563EB'; // Medical / default
        let icon = '📦';
        if (type === 'FOOD') {
            bg = '#059669';
            icon = '🥗';
        } else if (type === 'MEDICAL_SUPPLY') {
            bg = '#0284C7';
            icon = '💊';
        } else if (type === 'SHELTER') {
            bg = '#7C3AED';
            icon = '⛺';
        }

        return `
            <div style="
                background: ${bg};
                color: white;
                width: 36px;
                height: 36px;
                border-radius: 50% 50% 50% 0;
                transform: rotate(-45deg);
                display: flex;
                align-items: center;
                justify-content: center;
                box-shadow: 0 4px 12px rgba(15, 23, 42, 0.25);
                border: 2px solid #FFFFFF;
            ">
                <div style="transform: rotate(45deg); font-size: 14px;">${icon}</div>
            </div>
        `;
    };

    // Initialize Map
    useEffect(() => {
        if (!mapContainerRef.current) return;

        if (!mapInstanceRef.current) {
            // Default center: Central Delhi relief cluster
            const map = L.map(mapContainerRef.current, {
                center: [28.6139, 77.2090],
                zoom: 11,
                scrollWheelZoom: true
            });

            // Clean high-contrast OpenStreetMap tiles
            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                attribution: '&copy; OpenStreetMap contributors',
                maxZoom: 18
            }).addTo(map);

            const markersGroup = L.featureGroup().addTo(map);
            markersGroupRef.current = markersGroup;
            mapInstanceRef.current = map;
        }

        return () => {
            if (mapInstanceRef.current) {
                mapInstanceRef.current.remove();
                mapInstanceRef.current = null;
            }
        };
    }, []);

    // Render Markers on Map
    useEffect(() => {
        if (!mapInstanceRef.current || !markersGroupRef.current) return;

        const map = mapInstanceRef.current;
        const markersGroup = markersGroupRef.current;
        markersGroup.clearLayers();

        const latLngs = [];

        // 1. Plot Resources (Supplies)
        resources.forEach(res => {
            if (filterType === 'NEEDS') return;
            if (filterType === 'EMERGENCY' && !res.isEmergency) return;
            if (['FOOD', 'MEDICAL_SUPPLY', 'SHELTER'].includes(filterType) && res.type !== filterType) return;

            const lat = res.latitude || 28.6139;
            const lng = res.longitude || 77.2090;
            latLngs.push([lat, lng]);

            const iconHtml = getPinHtml(res.type, res.isEmergency, false);
            const customIcon = L.divIcon({
                className: 'custom-div-pin',
                html: iconHtml,
                iconSize: [40, 40],
                iconAnchor: [20, 38],
                popupAnchor: [0, -38]
            });

            const marker = L.marker([lat, lng], { icon: customIcon });

            marker.on('click', () => {
                setSelectedEntity({ ...res, entityKind: 'SUPPLY' });
            });

            marker.bindPopup(`
                <div style="min-width: 220px; padding: 12px; font-family: inherit;">
                    <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 6px;">
                        <span style="font-size: 10px; font-weight: 700; text-transform: uppercase; padding: 2px 8px; border-radius: 9999px; background: ${res.isEmergency ? '#FEE2E2; color: #991B1B;' : '#E0F2FE; color: #0369A1;'}">
                            ${res.isEmergency ? 'SOS EMERGENCY' : res.type.replace('_', ' ')}
                        </span>
                        <span style="font-size: 11px; font-weight: 700; color: #0F172A;">${res.quantity} Units</span>
                    </div>
                    <div style="font-size: 13px; font-weight: 700; color: #0F172A; margin-bottom: 4px;">${res.title}</div>
                    <div style="font-size: 11px; color: #64748B; margin-bottom: 8px;">📍 ${res.location}</div>
                    <div style="font-size: 11px; color: #334155; margin-bottom: 8px;">Donor: <strong>${res.donor?.name || 'Verified Relief Donor'}</strong></div>
                    <div style="font-size: 10px; color: #059669; font-weight: 600;">Click card below map to claim or coordinate</div>
                </div>
            `);

            markersGroup.addLayer(marker);
        });

        // 2. Plot Community Aid Requests (Needs)
        aidRequests.forEach(req => {
            if (filterType !== 'ALL' && filterType !== 'NEEDS' && filterType !== req.type) return;

            const lat = req.latitude || 28.6139;
            const lng = req.longitude || 77.2090;
            latLngs.push([lat, lng]);

            const iconHtml = getPinHtml(req.type, false, true, req.urgency);
            const customIcon = L.divIcon({
                className: 'custom-div-pin',
                html: iconHtml,
                iconSize: [40, 40],
                iconAnchor: [20, 38],
                popupAnchor: [0, -38]
            });

            const marker = L.marker([lat, lng], { icon: customIcon });

            marker.on('click', () => {
                setSelectedEntity({ ...req, entityKind: 'NEED' });
            });

            marker.bindPopup(`
                <div style="min-width: 220px; padding: 12px; font-family: inherit;">
                    <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 6px;">
                        <span style="font-size: 10px; font-weight: 700; text-transform: uppercase; padding: 2px 8px; border-radius: 9999px; background: #FEF3C7; color: #92400E;">
                            NEED: ${req.urgency} URGENCY
                        </span>
                        <span style="font-size: 11px; font-weight: 700; color: #0F172A;">Need ${req.quantity} Units</span>
                    </div>
                    <div style="font-size: 13px; font-weight: 700; color: #0F172A; margin-bottom: 4px;">${req.title}</div>
                    <div style="font-size: 11px; color: #64748B; margin-bottom: 8px;">📍 ${req.location}</div>
                    <div style="font-size: 11px; color: #334155; margin-bottom: 8px;">Requester: <strong>${req.requester?.name || 'Local NGO'}</strong></div>
                    <div style="font-size: 10px; color: #D97706; font-weight: 600;">Click card below map to pledge fulfillment</div>
                </div>
            `);

            markersGroup.addLayer(marker);
        });

        // Auto zoom to fit markers
        if (latLngs.length > 0) {
            try {
                map.fitBounds(L.latLngBounds(latLngs), { padding: [50, 50], maxZoom: 13 });
            } catch (err) {
                console.warn("Map bounds fit error:", err);
            }
        }
    }, [resources, aidRequests, filterType]);

    const handleResetView = () => {
        if (!mapInstanceRef.current || !markersGroupRef.current) return;
        const layers = markersGroupRef.current.getLayers();
        if (layers.length > 0) {
            mapInstanceRef.current.fitBounds(markersGroupRef.current.getBounds(), { padding: [50, 50], maxZoom: 13 });
        } else {
            mapInstanceRef.current.setView([28.6139, 77.2090], 11);
        }
    };

    return (
        <div className="space-y-4">
            {/* Map Header & Controls */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
                <div>
                    <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                        <MapPin className="w-5 h-5 text-blue-600" />
                        Live Relief Operations GIS Map
                    </h2>
                    <p className="text-xs sm:text-sm text-slate-500">
                        Spatial command center visualizing available surplus supplies and active community aid requisitions.
                    </p>
                </div>

                <div className="flex items-center gap-2">
                    <button
                        onClick={handleResetView}
                        className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
                        title="Re-center map"
                    >
                        <RefreshCw className="w-3.5 h-3.5" />
                        Reset View
                    </button>
                </div>
            </div>

            {/* Filter Pills */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs font-medium">
                <span className="text-slate-400 flex items-center gap-1 pl-1">
                    <Filter className="w-3.5 h-3.5" /> Filter:
                </span>
                {[
                    { id: 'ALL', label: 'All Operations' },
                    { id: 'FOOD', label: '🟢 Food Surplus' },
                    { id: 'MEDICAL_SUPPLY', label: '🔵 Medical Aid' },
                    { id: 'SHELTER', label: '🟣 Shelters' },
                    { id: 'EMERGENCY', label: '🚨 SOS Emergency' },
                    { id: 'NEEDS', label: '🆘 Community Needs' },
                ].map(tab => (
                    <button
                        key={tab.id}
                        onClick={() => setFilterType(tab.id)}
                        className={`px-3 py-1.5 rounded-full whitespace-nowrap transition-all ${
                            filterType === tab.id
                                ? 'bg-blue-600 text-white shadow-sm shadow-blue-500/20 font-semibold'
                                : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
                        }`}
                    >
                        {tab.label}
                    </button>
                ))}
            </div>

            {/* Interactive Leaflet Canvas */}
            <div className="relative w-full h-[450px] sm:h-[520px] rounded-2xl border border-slate-200 overflow-hidden shadow-inner bg-slate-100">
                <div ref={mapContainerRef} className="w-full h-full" />

                {/* Map Legend Overlay */}
                <div className="absolute bottom-3 left-3 z-[1000] bg-white/95 backdrop-blur-md p-3 rounded-xl border border-slate-200 shadow-md text-[11px] space-y-1.5 max-w-[200px]">
                    <div className="font-bold text-slate-900 border-b border-slate-100 pb-1">Legend</div>
                    <div className="flex items-center gap-2 text-slate-700">
                        <span className="w-3 h-3 rounded-full bg-emerald-600 inline-block"></span>
                        <span>Food Surplus</span>
                    </div>
                    <div className="flex items-center gap-2 text-slate-700">
                        <span className="w-3 h-3 rounded-full bg-sky-600 inline-block"></span>
                        <span>Medical Supplies</span>
                    </div>
                    <div className="flex items-center gap-2 text-slate-700">
                        <span className="w-3 h-3 rounded-full bg-purple-600 inline-block"></span>
                        <span>Emergency Shelter</span>
                    </div>
                    <div className="flex items-center gap-2 text-slate-700">
                        <span className="w-3 h-3 rounded-full bg-rose-600 inline-block"></span>
                        <span>Critical SOS</span>
                    </div>
                    <div className="flex items-center gap-2 text-slate-700">
                        <span className="w-3 h-3 rounded-full bg-amber-500 inline-block"></span>
                        <span>Community Aid Need</span>
                    </div>
                </div>
            </div>

            {/* Active Selected Pin Inspector Card */}
            {selectedEntity && (
                <div className="p-4 bg-white rounded-2xl border border-blue-200 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 animate-in fade-in slide-in-from-bottom-2">
                    <div className="space-y-1">
                        <div className="flex items-center gap-2">
                            <span className={`text-[10px] font-bold uppercase px-2.5 py-0.5 rounded-full ${
                                selectedEntity.entityKind === 'NEED'
                                    ? 'bg-amber-100 text-amber-800'
                                    : selectedEntity.isEmergency
                                    ? 'bg-rose-100 text-rose-800 animate-pulse'
                                    : 'bg-blue-100 text-blue-800'
                            }`}>
                                {selectedEntity.entityKind === 'NEED' ? 'AID REQUISITION' : 'AVAILABLE DISPATCH'}
                            </span>
                            <span className="text-xs font-semibold text-slate-500">
                                {selectedEntity.type?.replace('_', ' ')} • {selectedEntity.quantity} Units
                            </span>
                        </div>
                        <h3 className="text-base font-bold text-slate-900">{selectedEntity.title}</h3>
                        <p className="text-xs text-slate-600">
                            📍 {selectedEntity.location} {selectedEntity.contactPhone ? `• 📞 ${selectedEntity.contactPhone}` : ''}
                        </p>
                        {selectedEntity.description && (
                            <p className="text-xs text-slate-500 line-clamp-1">{selectedEntity.description}</p>
                        )}
                    </div>

                    <div className="flex items-center gap-2 self-stretch sm:self-auto shrink-0">
                        {selectedEntity.entityKind === 'NEED' ? (
                            <button
                                onClick={() => onFulfill && onFulfill(selectedEntity)}
                                className="w-full sm:w-auto px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold rounded-xl shadow-sm transition-colors"
                            >
                                Pledge Fulfillment
                            </button>
                        ) : (
                            <button
                                onClick={() => onClaim && onClaim(selectedEntity.id)}
                                className="w-full sm:w-auto px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-sm transition-colors"
                            >
                                Claim This Supply
                            </button>
                        )}

                        <button
                            onClick={() => {
                                const targetUser = selectedEntity.entityKind === 'NEED' ? selectedEntity.requester : selectedEntity.donor;
                                if (onOpenChat && targetUser) onOpenChat(targetUser, selectedEntity);
                            }}
                            className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl transition-colors"
                            title="Chat with organizer"
                        >
                            Message
                        </button>

                        <button
                            onClick={() => setSelectedEntity(null)}
                            className="px-2.5 py-2 text-slate-400 hover:text-slate-600 text-xs rounded-xl"
                        >
                            ✕
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
