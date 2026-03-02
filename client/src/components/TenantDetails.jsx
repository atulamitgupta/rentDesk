// =============================================================
//  STRICT UI PRESERVATION MODE:
//  Cloud Bass Rent Management — TenantDetails.jsx
//  File : client/src/components/TenantDetails.jsx
// =============================================================

import React from 'react';
import {
    X, Phone, MessageSquare, Home, Mail, MapPin,
    ShieldAlert, FileText, Users, Calendar,
    CheckCircle2, Clock, ChevronRight, Edit3
} from 'lucide-react';

export default function TenantDetails({ isOpen, onClose, tenant, onEdit }) {
    if (!isOpen || !tenant) return null;

    const sectionLabel = "text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-3 flex items-center gap-2";
    const infoCard = "bg-slate-50 p-4 rounded-2xl border border-transparent hover:border-orange-100 transition-all";

    const handleCall = (num) => { window.location.href = `tel:${num}`; };
    const handleWA = (num) => { window.open(`https://wa.me/${num.replace(/\D/g, '')}`, '_blank'); };

    return (
        <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-0 sm:p-4">
            {/* Backdrop */}
            <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-md animate-in fade-in duration-300" onClick={onClose} />

            {/* Modal Body */}
            <div className="relative w-full max-w-lg bg-white rounded-t-[2.5rem] sm:rounded-[2.5rem] shadow-2xl flex flex-col max-h-[95vh] overflow-hidden animate-in slide-in-from-bottom duration-500">

                {/* ── Sticky Header ─────────────────────────────────── */}
                <div className="relative shrink-0 pt-10 pb-6 px-8 bg-gradient-to-b from-orange-50/50 to-white">
                    <button
                        onClick={onClose}
                        className="absolute top-6 right-6 p-2 bg-white rounded-2xl shadow-sm text-slate-400 hover:text-orange-500 transition-colors"
                    >
                        <X size={20} />
                    </button>

                    <div className="flex flex-col items-center text-center">
                        <div className="w-24 h-24 bg-gradient-to-br from-orange-400 to-orange-600 rounded-[2rem] flex items-center justify-center text-white text-3xl font-black shadow-xl shadow-orange-100 mb-4 animate-in zoom-in duration-500">
                            {tenant.name?.charAt(0)}
                        </div>
                        <h2 className="text-2xl font-black text-slate-800 tracking-tight">{tenant.name}</h2>
                        <div className="mt-2 flex flex-col items-center gap-1">
                            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-white border border-orange-100 rounded-full text-xs font-black text-orange-600 shadow-sm">
                                <Home size={12} /> Room {tenant.room} · {tenant.property}
                            </div>
                            {tenant.rentAmount && (
                                <p className="text-[11px] font-bold text-slate-400 uppercase tracking-[0.1em]">
                                    Individual Rent: <span className="text-orange-600">₹{tenant.rentAmount}</span>
                                </p>
                            )}
                        </div>
                    </div>
                </div>

                {/* ── Scrollable Content ──────────────────────────── */}
                <div className="flex-1 overflow-y-auto px-8 py-2 no-scrollbar pb-32">
                    <div className="space-y-8">

                        {/* Actions Row */}
                        <div className="grid grid-cols-2 gap-3">
                            <button
                                onClick={() => handleWA(tenant.phone)}
                                className="flex items-center justify-center gap-2 py-4 bg-orange-500 text-white rounded-2xl font-black text-sm shadow-lg shadow-orange-100 active:scale-95 transition-all"
                            >
                                <MessageSquare size={18} fill="currentColor" />
                                WhatsApp
                            </button>
                            <button
                                onClick={onEdit}
                                className="flex items-center justify-center gap-2 py-4 bg-slate-900 text-white rounded-2xl font-black text-sm active:scale-95 transition-all"
                            >
                                <Edit3 size={18} />
                                Edit Profile
                            </button>
                        </div>

                        {/* Personal Contact */}
                        <div>
                            <h3 className={sectionLabel}><Users size={14} /> Personal Information</h3>
                            <div className="space-y-3">
                                <div className={infoCard}>
                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Email ID</p>
                                    <p className="text-sm font-bold text-slate-700">{tenant.email || 'Not Provided'}</p>
                                </div>
                                <div className={`${infoCard} flex items-center justify-between`}>
                                    <div>
                                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Mobile Number</p>
                                        <p className="text-sm font-bold text-slate-700">{tenant.phone}</p>
                                    </div>
                                    <button
                                        onClick={() => handleCall(tenant.phone)}
                                        className="p-3 bg-white rounded-xl shadow-sm text-slate-400 hover:text-orange-500 transition-all active:scale-90"
                                    >
                                        <Phone size={18} />
                                    </button>
                                </div>
                                <div className={infoCard}>
                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Permanent Address</p>
                                    <p className="text-sm font-bold text-slate-700 leading-relaxed">
                                        {tenant.permanentAddress || 'Address not updated'}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Emergency Contact */}
                        <div>
                            <h3 className={sectionLabel}><ShieldAlert size={14} className="text-red-400" /> Emergency Contact</h3>
                            <div className="bg-red-50/50 p-4 rounded-3xl border border-red-100 flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-black text-slate-800">{tenant.emergencyName || 'No Name Added'}</p>
                                    <p className="text-xs font-bold text-slate-400 mt-0.5">{tenant.emergencyMobile || 'No Mobile Added'}</p>
                                </div>
                                {(tenant.emergencyMobile || tenant.phone) && (
                                    <button
                                        onClick={() => handleCall(tenant.emergencyMobile || tenant.phone)}
                                        className="p-3 bg-white rounded-2xl shadow-sm text-red-500 active:scale-90 transition-all"
                                    >
                                        <Phone size={18} />
                                    </button>
                                )}
                            </div>
                        </div>

                        {/* Documents */}
                        <div>
                            <h3 className={sectionLabel}><FileText size={14} /> Verification Documents</h3>
                            <button className="w-full flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-dashed border-slate-200 hover:border-orange-300 transition-all group">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-slate-400 group-hover:text-orange-500 shadow-sm transition-colors">
                                        <FileText size={20} />
                                    </div>
                                    <div className="text-left">
                                        <p className="text-sm font-black text-slate-700">Aadhaar_Card.pdf</p>
                                        <p className="text-[10px] font-bold text-emerald-500 uppercase">Verified</p>
                                    </div>
                                </div>
                                <ChevronRight size={18} className="text-slate-300" />
                            </button>
                        </div>

                        {/* Roommates — only in PG Mode */}
                        {tenant.propertyType === 'PG_HOSTEL' && (
                            <div>
                                <h3 className={sectionLabel}><Users size={14} /> Other Occupants (Roommates)</h3>
                                {tenant.roommates && tenant.roommates.length > 0 ? (
                                    <div className="space-y-3">
                                        {tenant.roommates.map((rm, i) => (
                                            <div key={i} className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-100">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center text-[10px] font-black text-slate-500 uppercase">
                                                        {rm.name?.charAt(0)}
                                                    </div>
                                                    <p className="text-xs font-bold text-slate-700">{rm.name}</p>
                                                </div>
                                                <button onClick={() => handleCall(rm.phone)} className="text-slate-400 hover:text-orange-500">
                                                    <Phone size={14} />
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="p-4 bg-slate-50 rounded-2xl border border-dashed border-slate-200 text-center">
                                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Single occupancy or no roommates joined yet</p>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Payment History */}
                        <div>
                            <h3 className={sectionLabel}><Calendar size={14} /> Payment History</h3>
                            <div className="space-y-4 relative before:absolute before:left-5 before:top-2 before:bottom-2 before:w-px before:bg-slate-100">
                                {[
                                    { month: 'February 2026', status: 'PAID', amount: '₹12,000' },
                                    { month: 'January 2026', status: 'PAID', amount: '₹12,000' },
                                    { month: 'December 2025', status: 'PENDING', amount: '₹12,000' }
                                ].map((item, idx) => (
                                    <div key={idx} className="relative flex items-center justify-between pl-10 group">
                                        <div className={`absolute left-3 w-4 h-4 rounded-full border-2 border-white ring-4 ring-white z-10 ${item.status === 'PAID' ? 'bg-emerald-500' : 'bg-orange-400 shadow-lg shadow-orange-100 animate-pulse'}`} />
                                        <div>
                                            <p className="text-sm font-black text-slate-800">{item.month}</p>
                                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{item.amount}</p>
                                        </div>
                                        <div className={`px-3 py-1 rounded-full text-[9px] font-black tracking-widest ${item.status === 'PAID' ? 'bg-emerald-50 text-emerald-600' : 'bg-orange-50 text-orange-600'}`}>
                                            {item.status}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                    </div>
                </div>

            </div>
        </div>
    );
}
