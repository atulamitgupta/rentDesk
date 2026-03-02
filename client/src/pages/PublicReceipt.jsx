import React from 'react';
import {
    CheckCircle2, Download, Share2, Building2,
    Gift, ArrowRight, IndianRupee, Printer, ExternalLink
} from 'lucide-react';

export default function PublicReceipt() {
    // In a real app, this would fetch data from a public API based on a slug/token
    const receiptData = {
        tenant: 'Rahul Sharma',
        room: '101',
        property: 'Blue Heights Apartment',
        amount: '12,000',
        date: 'March 01, 2026',
        id: 'TXN-992834',
        status: 'PAID'
    };

    const handlePrint = () => window.print();

    return (
        <div className="min-h-screen bg-[#F8F8F7] py-12 px-6">
            <div className="max-w-xl mx-auto space-y-8">

                {/* Brand Logo (Public View) */}
                <div className="flex flex-col items-center gap-2 mb-8 animate-in fade-in duration-700">
                    <div className="w-12 h-12 bg-orange-500 rounded-2xl flex items-center justify-center text-white shadow-xl shadow-orange-100">
                        <Building2 size={24} />
                    </div>
                    <span className="text-xl font-black text-slate-800 tracking-tight">Cloud Bass <span className="text-orange-500 text-sm font-bold uppercase tracking-widest ml-1">Receipts</span></span>
                </div>

                {/* Main Receipt Card */}
                <div className="bg-white rounded-[3rem] shadow-2xl shadow-orange-100/50 border border-orange-50 overflow-hidden relative">
                    {/* Status Ribbon */}
                    <div className="absolute top-8 right-[-35px] rotate-45 bg-emerald-500 text-white px-12 py-1.5 text-[10px] font-black uppercase tracking-[0.2em] shadow-lg">
                        {receiptData.status}
                    </div>

                    <div className="p-10 lg:p-14">
                        <div className="flex items-center gap-4 mb-10">
                            <div className="w-16 h-16 bg-emerald-50 rounded-full flex items-center justify-center text-emerald-500">
                                <CheckCircle2 size={32} />
                            </div>
                            <div>
                                <h2 className="text-2xl font-black text-slate-800">Rent Paid Successfully</h2>
                                <p className="text-sm font-bold text-slate-400">Transaction ID: {receiptData.id}</p>
                            </div>
                        </div>

                        <div className="space-y-6">
                            <div className="flex justify-between items-center py-4 border-b border-slate-50">
                                <span className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Amount Paid</span>
                                <span className="text-2xl font-black text-slate-800 flex items-center gap-1">
                                    <IndianRupee size={20} className="text-emerald-500" /> {receiptData.amount}
                                </span>
                            </div>

                            <div className="grid grid-cols-2 gap-8 py-4">
                                <div>
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Tenant Name</p>
                                    <p className="text-sm font-black text-slate-700">{receiptData.tenant}</p>
                                </div>
                                <div>
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Room / Type</p>
                                    <p className="text-sm font-black text-slate-700">Room {receiptData.room}</p>
                                </div>
                                <div>
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Payment Date</p>
                                    <p className="text-sm font-black text-slate-700">{receiptData.date}</p>
                                </div>
                                <div>
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Property</p>
                                    <p className="text-sm font-black text-slate-700 truncate">{receiptData.property}</p>
                                </div>
                            </div>
                        </div>

                        <div className="mt-12 flex flex-col sm:flex-row gap-3 noprint">
                            <button
                                onClick={handlePrint}
                                className="flex-1 flex items-center justify-center gap-2 py-4 bg-slate-900 text-white rounded-2xl font-black text-xs hover:bg-slate-800 transition-all active:scale-95"
                            >
                                <Printer size={16} /> Download PDF
                            </button>
                            <button className="flex-1 flex items-center justify-center gap-2 py-4 bg-white border border-slate-200 rounded-2xl text-slate-700 font-black text-xs hover:bg-orange-50 hover:border-orange-200 transition-all">
                                <Share2 size={16} /> Share Receipt
                            </button>
                        </div>
                    </div>

                    <div className="bg-slate-50 p-6 text-center border-t border-slate-100">
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Computer generated receipt · No signature required</p>
                    </div>
                </div>

                {/* Referral Banner for Tenant */}
                <div className="bg-gradient-to-r from-orange-500 to-orange-600 rounded-[2rem] p-8 text-white flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xl shadow-orange-100/50 animate-in slide-in-from-bottom duration-1000">
                    <div className="flex items-center gap-5">
                        <div className="w-14 h-14 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center">
                            <Gift size={28} className="text-white" />
                        </div>
                        <div className="text-center sm:text-left">
                            <h3 className="text-lg font-black leading-tight">Help a Friend Find a Home</h3>
                            <p className="text-xs font-bold text-orange-100 mt-1">Refer a friend and get <span className="underline decoration-2">₹500 off</span> on next rent</p>
                        </div>
                    </div>
                    <button className="bg-white text-orange-500 font-black px-6 py-3 rounded-xl shadow-lg hover:scale-105 active:scale-95 transition-all flex items-center gap-2 text-xs">
                        Refer Now <ArrowRight size={14} />
                    </button>
                </div>

                <div className="text-center">
                    <p className="text-xs font-bold text-slate-400">Manage your own properties? <a href="/" className="text-orange-500 underline">Join Cloud Bass Landlords</a></p>
                </div>

            </div>

            <style dangerouslySetInnerHTML={{
                __html: `
                @media print {
                    .noprint { display: none !important; }
                    body { background: white !important; padding: 0 !important; }
                    .max-w-xl { max-width: 100% !important; margin: 0 !important; }
                }
            `}} />
        </div>
    );
}
