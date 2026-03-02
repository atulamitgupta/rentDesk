import React, { useState } from 'react';
import { Gift, Copy, MessageSquare, Users as UsersIcon, ChevronRight, Share2, TrendingUp, Wallet } from 'lucide-react';
import { useAuth } from '../context/AuthContext.jsx';
import toast from 'react-hot-toast';

export default function ReferEarn() {
    const { landlord } = useAuth();
    const referralLink = `https://cloudbass.in/signup?ref=${landlord?.id || 'CBASS100'}`;
    const [copied, setCopied] = useState(false);

    const handleCopy = () => {
        navigator.clipboard.writeText(referralLink);
        setCopied(true);
        toast.success("Referral link copied!");
        setTimeout(() => setCopied(false), 2000);
    };

    const handleInvite = () => {
        const text = `Hi, I am using Cloud Bass to manage my rental property. It automates rent collection and WhatsApp reminders. Try it here: ${referralLink}`;
        window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
    };

    const referrals = [
        { name: 'Suresh Raina', type: 'PG / Hostel', status: 'Joined', date: 'Feb 20, 2026' },
        { name: 'Anjali Sharma', type: 'Apartment', status: 'Pending', date: 'Feb 25, 2026' },
        { name: 'Vikram Singh', type: 'PG / Hostel', status: 'Joined', date: 'Feb 28, 2026' },
    ];

    return (
        <div className="space-y-6 page-enter pb-20">
            {/* Hero Card */}
            <div className="bg-gradient-to-br from-orange-400 to-orange-600 rounded-[2.5rem] p-8 text-white relative overflow-hidden shadow-2xl shadow-orange-100">
                <div className="relative z-10 flex flex-col md:flex-row items-center gap-8">
                    <div className="flex-1 text-center md:text-left">
                        <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-white/20 backdrop-blur-md rounded-full text-xs font-black uppercase tracking-widest mb-4">
                            <TrendingUp size={14} /> Viral Growth Program
                        </div>
                        <h1 className="text-4xl font-black mb-4 tracking-tight leading-none">Refer & Earn <br /> Rewards</h1>
                        <p className="text-orange-100 font-bold max-w-sm">Invite your fellow landlords to Cloud Bass and get exclusive premium features for free.</p>

                        <div className="mt-8 flex flex-wrap gap-4 justify-center md:justify-start">
                            <div className="bg-white/10 backdrop-blur-sm p-4 rounded-3xl border border-white/20">
                                <p className="text-orange-100 text-[10px] font-black uppercase tracking-widest mb-1">Referrals</p>
                                <p className="text-2xl font-black">08</p>
                            </div>
                            <div className="bg-white/10 backdrop-blur-sm p-4 rounded-3xl border border-white/20">
                                <p className="text-orange-100 text-[10px] font-black uppercase tracking-widest mb-1">Earning</p>
                                <p className="text-2xl font-black">₹4,000</p>
                            </div>
                        </div>
                    </div>
                    <div className="hidden md:block">
                        <div className="w-48 h-48 bg-white/10 rounded-full flex items-center justify-center animate-pulse">
                            <Gift size={80} className="text-white drop-shadow-lg" />
                        </div>
                    </div>
                </div>
                {/* Decoration */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
            </div>

            {/* Referral Sharing Area */}
            <div className="bg-white rounded-[2rem] p-8 border border-orange-50 shadow-sm space-y-8">
                <div>
                    <h2 className="text-xl font-black text-slate-800 mb-2">Share Your Link</h2>
                    <p className="text-sm font-bold text-slate-400">Copy this link or share it directly on WhatsApp.</p>
                </div>

                <div className="flex flex-col md:flex-row gap-4">
                    <div className="flex-1 flex items-center gap-3 bg-slate-50 p-4 rounded-2xl border border-slate-100">
                        <p className="text-sm font-bold text-slate-600 truncate">{referralLink}</p>
                        <button
                            onClick={handleCopy}
                            className="p-2.5 bg-white rounded-xl shadow-sm text-slate-400 hover:text-orange-500 transition-colors"
                        >
                            <Copy size={18} />
                        </button>
                    </div>

                    <button
                        onClick={handleInvite}
                        className="bg-orange-500 hover:bg-orange-600 active:scale-95 text-white font-black px-8 py-4 rounded-2xl shadow-xl shadow-orange-100 flex items-center justify-center gap-3 transition-all"
                    >
                        <MessageSquare size={20} fill="currentColor" />
                        Invite Fellow Landlord
                    </button>
                </div>
            </div>

            {/* Tracking Table */}
            <div className="bg-white rounded-[2rem] border border-orange-50 shadow-sm overflow-hidden">
                <div className="px-8 py-6 border-b border-slate-50 flex items-center justify-between">
                    <h2 className="text-xl font-black text-slate-800">Referral Activity</h2>
                    <span className="text-[10px] font-black text-orange-500 uppercase tracking-widest">Live Status</span>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-slate-50/50">
                            <tr>
                                <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Name</th>
                                <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Property Type</th>
                                <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {referrals.map((ref, i) => (
                                <tr key={i} className="hover:bg-slate-50/50 transition-colors">
                                    <td className="px-8 py-5">
                                        <p className="text-sm font-black text-slate-800">{ref.name}</p>
                                        <p className="text-[10px] font-bold text-slate-400">{ref.date}</p>
                                    </td>
                                    <td className="px-8 py-5">
                                        <span className={`text-[10px] font-black px-3 py-1 rounded-full ${ref.type.includes('PG') ? 'bg-orange-50 text-orange-600 border border-orange-100' : 'bg-blue-50 text-blue-600 border border-blue-100'}`}>
                                            {ref.type}
                                        </span>
                                    </td>
                                    <td className="px-8 py-5">
                                        <div className="flex flex-col items-end">
                                            <span className={`text-[10px] font-black uppercase tracking-widest ${ref.status === 'Joined' ? 'text-emerald-500' : 'text-amber-500'}`}>
                                                {ref.status}
                                            </span>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                {referrals.length === 0 && (
                    <div className="p-12 text-center">
                        <p className="text-sm font-bold text-slate-400">No referrals yet. Start inviting landlords!</p>
                    </div>
                )}
            </div>
        </div>
    );
}
