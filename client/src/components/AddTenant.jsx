// =============================================================
//  STRICT UI PRESERVATION MODE:
//  Cloud Bass Rent Management — AddTenant.jsx
//  File : client/src/components/AddTenant.jsx
// =============================================================

import React, { useState } from 'react';
import { X, UserPlus, Home, Phone, Mail, MapPin, ShieldAlert, Upload, Save, Loader2, IndianRupee } from 'lucide-react';

export default function AddTenant({ isOpen, onClose, properties, onSave }) {
    const [form, setForm] = useState({
        name: '',
        email: '',
        mobile: '',
        permanentAddress: '',
        property: '',
        roomNumber: '',
        rentAmount: '',
        emergencyName: '',
        emergencyMobile: '',
        idProof: null
    });

    const [isCompressing, setIsCompressing] = useState(false);

    if (!isOpen) return null;

    // Simple client-side compression using Canvas
    const compressImage = (file) => {
        return new Promise((resolve) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = (event) => {
                const img = new Image();
                img.src = event.target.result;
                img.onload = () => {
                    const canvas = document.createElement('canvas');
                    const MAX_WIDTH = 1200;
                    const scaleSize = MAX_WIDTH / img.width;
                    canvas.width = MAX_WIDTH;
                    canvas.height = img.height * scaleSize;
                    const ctx = canvas.getContext('2d');
                    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
                    canvas.toBlob((blob) => {
                        resolve(new File([blob], file.name, { type: 'image/jpeg' }));
                    }, 'image/jpeg', 0.7); // 70% quality
                };
            };
        });
    };

    const handleFileChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;
        if (file.type.startsWith('image/')) {
            setIsCompressing(true);
            const compressed = await compressImage(file);
            setForm({ ...form, idProof: compressed });
            setIsCompressing(false);
        } else {
            setForm({ ...form, idProof: file });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        onSave(form);
        onClose();
    };

    const inputClasses = "w-full px-4 py-3.5 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-orange-500 transition-all font-semibold placeholder-slate-400";
    const labelClasses = "text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1 mb-1.5 flex items-center gap-2";

    return (
        <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-4">
            {/* Backdrop */}
            <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-300" onClick={onClose} />

            {/* Modal Body */}
            <div className="relative w-full max-w-2xl bg-white rounded-[2rem] shadow-2xl flex flex-col max-h-[90vh] overflow-hidden animate-in slide-in-from-bottom duration-300">

                {/* Header */}
                <div className="flex items-center justify-between px-8 py-6 border-b border-slate-50 shrink-0">
                    <div>
                        <h2 className="text-xl font-black text-slate-800 flex items-center gap-3">
                            <div className="w-10 h-10 bg-orange-100 rounded-xl flex items-center justify-center text-orange-600">
                                <UserPlus size={22} />
                            </div>
                            Add New Tenant
                        </h2>
                        <p className="text-xs font-bold text-slate-400 mt-0.5 ml-13">Register a new resident in your system</p>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-slate-50 rounded-2xl transition-colors">
                        <X size={24} className="text-slate-400" />
                    </button>
                </div>

                {/* Form Container */}
                <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-8 no-scrollbar">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-4">

                        {/* ── Primary Info ─────────────────────────────────── */}
                        <div className="space-y-4 md:col-span-2">
                            <h3 className="text-[10px] font-black text-orange-500 uppercase tracking-[0.2em] mb-2">Primary Details</h3>
                        </div>

                        <div className="space-y-1.5">
                            <label className={labelClasses}><UserPlus size={14} /> Full Name</label>
                            <input
                                required
                                placeholder="e.g. Rahul Sharma"
                                className={inputClasses}
                                value={form.name}
                                onChange={e => setForm({ ...form, name: e.target.value })}
                            />
                        </div>

                        <div className="space-y-1.5">
                            <label className={labelClasses}><Phone size={14} /> Mobile Number</label>
                            <input
                                required
                                type="tel"
                                placeholder="+91 98765-43210"
                                className={inputClasses}
                                value={form.mobile}
                                onChange={e => setForm({ ...form, mobile: e.target.value })}
                            />
                        </div>

                        <div className="space-y-1.5 md:col-span-2">
                            <label className={labelClasses}><Mail size={14} /> Email ID</label>
                            <input
                                required
                                type="email"
                                placeholder="rahul@example.com"
                                className={inputClasses}
                                value={form.email}
                                onChange={e => setForm({ ...form, email: e.target.value })}
                            />
                        </div>

                        {/* ── Location & Setup ──────────────────────────── */}
                        <div className="space-y-4 md:col-span-2 mt-2">
                            <h3 className="text-[10px] font-black text-orange-500 uppercase tracking-[0.2em] mb-2">Room Assignment</h3>
                        </div>

                        <div className="space-y-1.5">
                            <label className={labelClasses}><Home size={14} /> Property</label>
                            <select
                                required
                                className={`${inputClasses} appearance-none cursor-pointer`}
                                value={form.property}
                                onChange={e => setForm({ ...form, property: e.target.value })}
                            >
                                <option value="">Select Property</option>
                                {properties?.map(p => (
                                    <option key={p.id} value={p.name}>{p.name}</option>
                                ))}
                            </select>
                        </div>

                        <div className="space-y-1.5">
                            <label className={labelClasses}><Home size={14} /> Room / Unit Number</label>
                            <input
                                required
                                placeholder="e.g. 104-B"
                                className={inputClasses}
                                value={form.roomNumber}
                                onChange={e => setForm({ ...form, roomNumber: e.target.value })}
                            />
                        </div>

                        <div className="space-y-1.5">
                            <label className={labelClasses}><IndianRupee size={14} /> Monthly Rent (₹)</label>
                            <input
                                required
                                type="number"
                                placeholder="Rent for this tenant"
                                className={inputClasses}
                                value={form.rentAmount}
                                onChange={e => setForm({ ...form, rentAmount: e.target.value })}
                            />
                        </div>

                        <div className="space-y-1.5 md:col-span-2">
                            <label className={labelClasses}><MapPin size={14} /> Permanent Address</label>
                            <textarea
                                required
                                rows="3"
                                placeholder="Enter full permanent address..."
                                className={`${inputClasses} resize-none`}
                                value={form.permanentAddress}
                                onChange={e => setForm({ ...form, permanentAddress: e.target.value })}
                            />
                        </div>

                        {/* ── Emergency Details ──────────────────────────── */}
                        <div className="space-y-4 md:col-span-2 mt-2">
                            <h3 className="text-[10px] font-black text-orange-500 uppercase tracking-[0.2em] mb-2">Emergency Contact</h3>
                        </div>

                        <div className="space-y-1.5">
                            <label className={labelClasses}><ShieldAlert size={14} /> Contact Name</label>
                            <input
                                required
                                placeholder="Relative / Friend name"
                                className={inputClasses}
                                value={form.emergencyName}
                                onChange={e => setForm({ ...form, emergencyName: e.target.value })}
                            />
                        </div>

                        <div className="space-y-1.5">
                            <label className={labelClasses}><Phone size={14} /> Emergency Mobile</label>
                            <input
                                required
                                type="tel"
                                placeholder="Emergency number"
                                className={inputClasses}
                                value={form.emergencyMobile}
                                onChange={e => setForm({ ...form, emergencyMobile: e.target.value })}
                            />
                        </div>

                        {/* ── Documents ─────────────────────────────────────────── */}
                        <div className="space-y-4 md:col-span-2 mt-2">
                            <h3 className="text-[10px] font-black text-orange-500 uppercase tracking-[0.2em] mb-2">Verification Documents</h3>
                        </div>

                        <div className="space-y-1.5 md:col-span-2">
                            <label className={labelClasses}><Upload size={14} /> Upload ID Proof (Aadhaar/PAN/Voter ID)</label>
                            <div className="relative group/file">
                                <input
                                    type="file"
                                    className="absolute inset-0 opacity-0 cursor-pointer z-10"
                                    onChange={handleFileChange}
                                />
                                <div className={`
                                        w-full px-4 py-8 border-2 border-dashed rounded-3xl flex flex-col items-center justify-center gap-2 transition-all
                                        ${form.idProof ? 'border-emerald-200 bg-emerald-50' : 'border-slate-100 bg-slate-50 group-hover/file:border-orange-200'}
                                    `}>
                                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shadow-sm ${form.idProof ? 'bg-white text-emerald-500' : 'bg-white text-slate-400 group-hover/file:text-orange-500'}`}>
                                        {isCompressing ? <Loader2 className="animate-spin text-orange-500" size={24} /> : <Upload size={24} />}
                                    </div>
                                    <span className={`text-[11px] font-black uppercase tracking-widest ${form.idProof ? 'text-emerald-600' : 'text-slate-400'}`}>
                                        {isCompressing ? 'Optimizing Image...' : (form.idProof ? form.idProof.name : 'Tap to select document')}
                                    </span>
                                </div>
                            </div>
                        </div>

                    </div>
                </form>

                {/* Footer / Submit */}
                <div className="px-8 py-6 border-t border-slate-50 bg-white shrink-0">
                    <button
                        type="submit"
                        onClick={handleSubmit}
                        className="w-full bg-orange-500 hover:bg-orange-600 text-white font-black py-4 rounded-2xl shadow-xl shadow-orange-100 flex items-center justify-center gap-3 transition-all active:scale-95 translate-y-0"
                    >
                        <Save size={20} strokeWidth={3} />
                        <span>Save Tenant Details</span>
                    </button>
                </div>

            </div>
        </div>
    );
}
