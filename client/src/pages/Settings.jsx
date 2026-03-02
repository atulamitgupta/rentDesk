// =============================================================
//  Page: Settings (Prototype)
//  File : client/src/pages/Settings.jsx
// =============================================================

import { useState } from 'react';
import { Settings as SettingsIcon, Save, QrCode, Building, Briefcase, Camera } from 'lucide-react';
import toast from 'react-hot-toast';

export default function Settings() {
    const [qrUploaded, setQrUploaded] = useState(false);

    const handleSave = (e) => {
        e.preventDefault();
        toast.success('Settings saved successfully!');
    };

    return (
        <div className="space-y-6 pb-24">
            <header className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-black text-slate-800 tracking-tight">Settings</h1>
                    <p className="text-sm text-slate-400">Manage your business profile</p>
                </div>
                <div className="w-12 h-12 bg-slate-100 rounded-2xl flex items-center justify-center text-slate-600">
                    <SettingsIcon size={24} />
                </div>
            </header>

            <form onSubmit={handleSave} className="space-y-6">
                {/* Business Info Section */}
                <div className="bg-white p-6 rounded-3xl border border-orange-50 shadow-sm space-y-5">
                    <div className="flex items-center gap-2 mb-2">
                        <Briefcase size={18} className="text-orange-500" />
                        <h3 className="text-sm font-black text-slate-800 uppercase tracking-widest">Business Info</h3>
                    </div>

                    <div className="space-y-4">
                        <div className="space-y-1.5">
                            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider ml-1">Brand Name</label>
                            <input required className="w-full px-4 py-3.5 bg-slate-50 border-none rounded-2xl font-semibold" defaultValue="Cloud Bass Rental" />
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider ml-1">Support Email</label>
                            <input required className="w-full px-4 py-3.5 bg-slate-50 border-none rounded-2xl font-semibold" defaultValue="admin@rentdesk.in" />
                        </div>
                    </div>
                </div>

                {/* Payment Settings */}
                <div className="bg-white p-6 rounded-3xl border border-orange-50 shadow-sm space-y-5">
                    <div className="flex items-center gap-2 mb-2">
                        <QrCode size={18} className="text-orange-500" />
                        <h3 className="text-sm font-black text-slate-800 uppercase tracking-widest">Payment Methods</h3>
                    </div>

                    <div className="space-y-1.5">
                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider ml-1">UPI ID for Collection</label>
                        <input className="w-full px-4 py-3.5 bg-slate-50 border-none rounded-2xl font-semibold" placeholder="tenant@upi" defaultValue="9876543210@paytm" />
                    </div>

                    <div className="space-y-1.5">
                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider ml-1">UPI QR Code</label>
                        <div className={`
                            border-2 border-dashed rounded-3xl p-8 flex flex-col items-center justify-center gap-3 transition-all
                            ${qrUploaded ? 'border-emerald-200 bg-emerald-50' : 'border-slate-100 bg-slate-50/50 hover:border-orange-200'}
                        `}>
                            {qrUploaded ? (
                                <>
                                    <div className="w-16 h-16 bg-white rounded-2xl shadow-sm flex items-center justify-center p-2 text-emerald-500">
                                        <QrCode size={48} />
                                    </div>
                                    <p className="text-[10px] font-black text-emerald-600 uppercase">QR Uploaded ✓</p>
                                    <button type="button" onClick={() => setQrUploaded(false)} className="text-[10px] font-black underline text-slate-400 uppercase">Remove</button>
                                </>
                            ) : (
                                <>
                                    <button
                                        type="button"
                                        onClick={() => setQrUploaded(true)}
                                        className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-slate-400 shadow-sm hover:text-orange-500 hover:scale-110 transition-all"
                                    >
                                        <Camera size={24} />
                                    </button>
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Click to upload UPI QR</p>
                                </>
                            )}
                        </div>
                    </div>
                </div>

                <button
                    type="submit"
                    className="w-full py-4 bg-orange-600 text-white font-black rounded-2xl shadow-xl shadow-orange-100 flex items-center justify-center gap-3 active:scale-95 transition-all"
                >
                    <Save size={20} strokeWidth={3} />
                    <span>Save All Changes</span>
                </button>
            </form>
        </div>
    );
}
