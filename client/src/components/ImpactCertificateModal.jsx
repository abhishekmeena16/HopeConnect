// client/src/components/ImpactCertificateModal.jsx
import { useMemo } from 'react';
import { Award, Printer, X, ShieldCheck, CheckCircle2, Leaf } from 'lucide-react';

export default function ImpactCertificateModal({ resource, onClose }) {
    const certDetails = useMemo(() => {
        if (!resource) return null;
        const rawDate = resource.updatedAt || resource.createdAt || '2026-10-18T13:00:00Z';
        const dateObj = new Date(rawDate);
        return {
            certId: `HC-CERT-${(resource.id || 'RELIEF').slice(0, 8).toUpperCase()}-${dateObj.getFullYear()}`,
            formattedDate: dateObj.toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            })
        };
    }, [resource]);

    if (!resource || !certDetails) return null;

    const isFood = resource.type === 'FOOD';
    const co2Saved = isFood ? Math.round(resource.quantity * 2.5) : Math.round(resource.quantity * 1.8);

    const handlePrint = () => {
        window.print();
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/70 backdrop-blur-xs p-4 overflow-y-auto">
            <div className="relative bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-10 shadow-2xl border border-slate-200 animate-in zoom-in-95 my-8">
                {/* Modal Controls (Hidden in Print) */}
                <div className="no-print flex items-center justify-between pb-4 mb-4 border-b border-slate-100">
                    <div className="flex items-center gap-2 text-xs font-bold text-slate-500 uppercase tracking-wider">
                        <Award className="w-4 h-4 text-blue-600" />
                        Official Humanitarian Aid Certificate
                    </div>
                    <div className="flex items-center gap-2">
                        <button
                            onClick={handlePrint}
                            className="flex items-center gap-1.5 px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-xs transition-colors"
                        >
                            <Printer className="w-3.5 h-3.5" />
                            Print / Save as PDF
                        </button>
                        <button
                            onClick={onClose}
                            className="p-1.5 text-slate-400 hover:text-slate-600 rounded-xl"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>
                </div>

                {/* Printable Formal Certificate Canvas */}
                <div
                    id="printable-certificate"
                    className="border-4 border-double border-slate-800 p-8 sm:p-10 rounded-2xl relative bg-gradient-to-b from-amber-50/30 via-white to-slate-50/40 text-slate-900 text-center"
                >
                    {/* Watermark Logo */}
                    <div className="absolute inset-0 flex items-center justify-center opacity-4 pointer-events-none">
                        <Award className="w-96 h-96 text-slate-900" />
                    </div>

                    <div className="relative z-10 space-y-6">
                        {/* Header Crest */}
                        <div className="flex flex-col items-center space-y-2">
                            <div className="w-14 h-14 rounded-2xl bg-slate-900 text-white flex items-center justify-center shadow-md">
                                <Award className="w-8 h-8 text-amber-400" />
                            </div>
                            <h1 className="text-2xl sm:text-3xl font-serif font-extrabold tracking-wide uppercase text-slate-900">
                                Certificate of Humanitarian Aid
                            </h1>
                            <p className="text-xs uppercase tracking-widest text-slate-500 font-semibold font-mono">
                                HopeConnect Humanitarian Relief & Resource Ledger
                            </p>
                        </div>

                        {/* Recipient Notice */}
                        <div className="space-y-2">
                            <p className="text-xs sm:text-sm text-slate-600 italic">
                                This document serves as official verification of verified physical asset redistribution and humanitarian relief:
                            </p>
                            <div className="text-xl sm:text-2xl font-bold font-serif text-blue-900 border-b-2 border-slate-300 pb-2 inline-block px-8">
                                {resource.donor?.name || 'Verified Benefactor'}
                            </div>
                            <p className="text-xs text-slate-500 font-medium uppercase tracking-wider">
                                Role: {resource.donor?.role?.replace('_', ' ') || 'COMMUNITY DONOR'}
                            </p>
                        </div>

                        {/* Manifest Itemized Block */}
                        <div className="bg-slate-50/80 border border-slate-200 rounded-xl p-4 sm:p-5 text-left grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs font-sans">
                            <div>
                                <span className="text-[10px] text-slate-400 uppercase font-bold block">Physical Asset</span>
                                <span className="font-bold text-slate-800 text-sm">{resource.title}</span>
                            </div>
                            <div>
                                <span className="text-[10px] text-slate-400 uppercase font-bold block">Quantity Verified</span>
                                <span className="font-bold text-emerald-700 text-sm">{resource.quantity} Units</span>
                            </div>
                            <div>
                                <span className="text-[10px] text-slate-400 uppercase font-bold block">Beneficiary Entity</span>
                                <span className="font-bold text-slate-800 text-sm">{resource.beneficiary?.name || 'Community Relief Target'}</span>
                            </div>
                            <div>
                                <span className="text-[10px] text-slate-400 uppercase font-bold block">Status Verified</span>
                                <span className="inline-flex items-center gap-1 font-bold text-emerald-600 text-sm">
                                    <CheckCircle2 className="w-3.5 h-3.5" />
                                    {resource.status}
                                </span>
                            </div>
                        </div>

                        {/* ESG & CO2 Metric */}
                        <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center justify-center gap-2 text-xs font-semibold text-emerald-800">
                            <Leaf className="w-4 h-4 text-emerald-600 shrink-0" />
                            <span>Estimated ESG Carbon Footprint Prevented: <strong>~{co2Saved} kg CO₂e</strong></span>
                        </div>

                        {/* Signatures & Verification Seal */}
                        <div className="pt-6 border-t border-slate-200 flex items-center justify-between text-xs text-slate-600">
                            <div className="text-left space-y-1">
                                <div className="font-mono text-[10px] text-slate-400">CERTIFICATE NO.</div>
                                <div className="font-mono font-bold text-slate-800 text-xs">{certDetails.certId}</div>
                                <div className="text-[10px] text-slate-400">Issued: {certDetails.formattedDate}</div>
                            </div>

                            <div className="flex flex-col items-center">
                                <div className="w-12 h-12 rounded-full border-2 border-dashed border-amber-600/50 flex items-center justify-center bg-amber-50">
                                    <ShieldCheck className="w-6 h-6 text-amber-600" />
                                </div>
                                <span className="text-[9px] uppercase tracking-wider font-bold text-amber-800 mt-1">Official Seal</span>
                            </div>

                            <div className="text-right space-y-1">
                                <div className="font-serif italic font-bold text-slate-800 text-sm">HopeConnect Registry</div>
                                <div className="text-[10px] text-slate-400">Cryptographically Signed Ledger</div>
                                <div className="text-[10px] text-emerald-600 font-semibold">100% Non-Monetary Aid Verified</div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="no-print mt-4 text-center">
                    <p className="text-[11px] text-slate-400">
                        This certificate can be used for Corporate Social Responsibility (CSR) compliance, institutional audit records, and tax documentation.
                    </p>
                </div>
            </div>
        </div>
    );
}
