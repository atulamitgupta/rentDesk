import React, { useState } from 'react';
import {
    Users, ShieldCheck, FileText, Gift,
    BarChart3, Activity, Zap, CheckCircle2,
    XCircle, MoreVertical, TrendingUp, Search,
    ArrowUpRight, Building2, MousePointer2
} from 'lucide-react';
import toast from 'react-hot-toast';

export default function SuperAdminDashboard() {
    const [owners, setOwners] = useState([
        { id: 1, name: 'Suresh Gupta', email: 'suresh@gmail.com', type: 'PG / Hostel', status: 'Active', properties: 3 },
        { id: 2, name: 'Vikram Malhotra', email: 'vikram@yahoo.com', type: 'Apartment', status: 'Inactive', properties: 1 },
        { id: 3, name: 'Anita Rao', email: 'anita@outlook.com', type: 'PG / Hostel', status: 'Active', properties: 2 },
    ]);

    const stats = {
        totalAgreements: 1240,
        totalReceipts: 8520,
        activeOwners: 450,
        totalReferrals: 85
    };

    const legalToolClicks = [
        { tool: 'Rent Agreement', clicks: 450, trend: '+12%' },
        { tool: 'HRA Receipt', clicks: 380, trend: '+8%' },
        { tool: 'Police Verification', clicks: 210, trend: '+5%' },
        { tool: 'Inventory Check', clicks: 95, trend: '-2%' },
    ];

    const toggleStatus = (id) => {
        setOwners(owners.map(o => o.id === id ? { ...o, status: o.status === 'Active' ? 'Inactive' : 'Active' } : o));
        toast.success("Owner status updated!");
    };

    const sectionLabel = "text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4 flex items-center gap-2";

    return (
        <div className="space-y-8 page-enter pb-24">
            {/* Header / Badge */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <div className="inline-flex items-center gap-2 px-3 py-1 bg-slate-900 text-orange-400 text-[10px] font-black uppercase tracking-widest rounded-full mb-3 shadow-lg shadow-slate-100">
                        <ShieldCheck size={12} /> Super Admin System
                    </div>
                    <h1 className="text-3xl font-black text-slate-800 tracking-tight">Platform Overview</h1>
                </div>

                <div className="flex items-center gap-3">
                    <div className="text-right hidden sm:block">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">System Health</p>
                        <p className="text-sm font-black text-emerald-500 flex items-center justify-end gap-1">
                            <Activity size={14} /> All Systems Operational
                        </p>
                    </div>
                </div>
            </div>

            {/* Quick Stats Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                    { label: 'Total Agreements', val: stats.totalAgreements, icon: FileText, color: 'text-orange-500 bg-orange-50' },
                    { label: 'Total Receipts', val: stats.totalReceipts, icon: Zap, color: 'text-blue-500 bg-blue-50' },
                    { label: 'Active Owners', val: stats.activeOwners, icon: Users, color: 'text-emerald-500 bg-emerald-50' },
                    { label: 'Referrals', val: stats.totalReferrals, icon: Gift, color: 'text-purple-500 bg-purple-50' },
                ].map((s, i) => (
                    <div key={i} className="bg-white p-6 lg:p-8 rounded-[2rem] border border-orange-50 shadow-sm">
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-4 ${s.color}`}>
                            <s.icon size={20} />
                        </div>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{s.label}</p>
                        <p className="text-2xl font-black text-slate-800">{s.val.toLocaleString()}</p>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                {/* User Management Section */}
                <div className="lg:col-span-2 space-y-6">
                    <h3 className={sectionLabel}><Building2 size={14} /> Owner Management</h3>
                    <div className="bg-white rounded-[2.5rem] border border-orange-50 shadow-sm overflow-hidden text-left">
                        <table className="w-full">
                            <thead className="bg-slate-50/50">
                                <tr>
                                    <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Owner Detail</th>
                                    <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Type</th>
                                    <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50">
                                {owners.map(owner => (
                                    <tr key={owner.id} className="hover:bg-slate-50/30 transition-colors">
                                        <td className="px-8 py-5">
                                            <div className="flex items-center gap-3">
                                                <div className="w-9 h-9 bg-slate-100 rounded-full flex items-center justify-center font-black text-slate-500 text-xs">
                                                    {owner.name[0]}
                                                </div>
                                                <div>
                                                    <p className="text-sm font-black text-slate-800">{owner.name}</p>
                                                    <p className="text-[10px] font-bold text-slate-400">{owner.email}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-8 py-5">
                                            <span className={`text-[10px] font-black px-3 py-1 rounded-full ${owner.type.includes('PG') ? 'bg-orange-50 text-orange-600' : 'bg-blue-50 text-blue-600'}`}>
                                                {owner.type}
                                            </span>
                                        </td>
                                        <td className="px-8 py-5 text-right">
                                            <button
                                                onClick={() => toggleStatus(owner.id)}
                                                className={`text-[10px] font-black uppercase tracking-widest px-4 py-2 rounded-xl transition-all active:scale-95 ${owner.status === 'Active'
                                                        ? 'bg-emerald-50 text-emerald-600 border border-emerald-100'
                                                        : 'bg-red-50 text-red-600 border border-red-100'
                                                    }`}
                                            >
                                                {owner.status}
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        <div className="p-6 bg-slate-50/50 border-t border-slate-50 text-center">
                            <button className="text-[10px] font-black text-orange-600 hover:text-orange-700 uppercase tracking-widest flex items-center justify-center gap-2 mx-auto">
                                View All Registered Landlords <ArrowUpRight size={14} />
                            </button>
                        </div>
                    </div>
                </div>

                {/* SEO & Tool Stats Tracker */}
                <div className="space-y-6">
                    <h3 className={sectionLabel}><Search size={14} /> SEO / Tool Engagement</h3>
                    <div className="bg-white p-8 rounded-[2.5rem] border border-orange-50 shadow-sm space-y-6">
                        {legalToolClicks.map((item, i) => (
                            <div key={i} className="flex items-center justify-between group">
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center text-slate-400 group-hover:bg-orange-50 group-hover:text-orange-500 transition-colors">
                                        <MousePointer2 size={18} />
                                    </div>
                                    <div>
                                        <p className="text-sm font-black text-slate-800">{item.tool}</p>
                                        <p className="text-[10px] font-bold text-slate-400">{item.clicks} Total Clicks</p>
                                    </div>
                                </div>
                                <div className={`text-[10px] font-black ${item.trend.startsWith('+') ? 'text-emerald-500' : 'text-red-500'}`}>
                                    {item.trend}
                                </div>
                            </div>
                        ))}

                        <div className="pt-4 border-t border-slate-50 text-center">
                            <p className="text-[10px] font-bold text-slate-400">Monthly SEO Traffic Analysis Active</p>
                        </div>
                    </div>

                    {/* Referral Rewards Manager */}
                    <h3 className={sectionLabel}><Gift size={14} /> Rewards Manager</h3>
                    <div className="bg-white p-6 rounded-[2rem] border border-orange-50 shadow-sm space-y-4">
                        {[
                            { from: 'Landlord A', to: 'Landlord B', status: 'Pending' },
                        ].map((r, i) => (
                            <div key={i} className="p-4 bg-slate-50 rounded-2xl flex items-center justify-between border border-transparent hover:border-orange-100 transition-all">
                                <div className="min-w-0">
                                    <p className="text-xs font-black text-slate-800 truncate">{r.from} referred {r.to}</p>
                                    <p className="text-[9px] font-bold text-slate-400 uppercase mt-0.5">Reward Status: {r.status}</p>
                                </div>
                                <button
                                    onClick={() => toast.success("Reward Approved!")}
                                    className="bg-orange-500 text-white px-3 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest shadow-sm active:scale-90 transition-all shrink-0"
                                >
                                    Approve
                                </button>
                            </div>
                        ))}
                    </div>
                </div>

            </div>
        </div>
    );
}
