// =============================================================
//  Cloud Bass Rent Management — Founder Portal Main Router
//  File : client/src/pages/FounderPortal.jsx
// =============================================================

import React, { useState } from 'react';
import {
    ShieldCheck, Users, GanttChart, Building2,
    MousePointer2, Gift, CheckCircle2,
    Activity, Search, Lock, LogIn,
    ArrowDownToLine, RefreshCw, Radio,
    BarChart3, Settings, UserPlus, Scale, ClipboardCheck
} from 'lucide-react';
import toast from 'react-hot-toast';
import { Routes, Route } from 'react-router-dom';

// ── Sub-Pages ───────────────────────────────────────────────
import FounderChecklist from './FounderChecklist';

const GlobalAnalytics = () => <div className="p-10 lg:p-20 text-center animate-in fade-in duration-500"><BarChart3 size={64} className="mx-auto text-orange-200 mb-6" /><h2 className="text-xl lg:text-2xl font-black text-slate-800">Global Infrastructure Growth</h2><p className="text-slate-400 font-bold uppercase tracking-widest text-[9px] lg:text-[10px]">Synchronizing live onboarding trends...</p></div>;
const OwnerDirectory = () => <div className="p-10 lg:p-20 text-center animate-in fade-in duration-500"><Users size={64} className="mx-auto text-orange-200 mb-6" /><h2 className="text-xl lg:text-2xl font-black text-slate-800">Master Owner Directory</h2><p className="text-slate-400 font-bold uppercase tracking-widest text-[9px] lg:text-[10px]">Querying 1,240 Landlord Records...</p></div>;
const ReferralQueue = () => <div className="p-10 lg:p-20 text-center animate-in fade-in duration-500"><Gift size={64} className="mx-auto text-orange-200 mb-6" /><h2 className="text-xl lg:text-2xl font-black text-slate-800">Referral Processing Hall</h2><p className="text-slate-400 font-bold uppercase tracking-widest text-[9px] lg:text-[10px]">18 requests awaiting payout verification.</p></div>;
const MasterTemplates = () => <div className="p-10 lg:p-20 text-center animate-in fade-in duration-500"><Scale size={64} className="mx-auto text-orange-200 mb-6" /><h2 className="text-2xl font-black text-slate-800">Master Legal Templates</h2><p className="text-slate-400 font-bold uppercase tracking-widest text-[10px]">Edit global document drafts for all users.</p></div>;
const ToolAnalytics = () => <div className="p-10 lg:p-20 text-center animate-in fade-in duration-500"><Activity size={64} className="mx-auto text-orange-200 mb-6" /><h2 className="text-2xl font-black text-slate-800">Legal Hub SEO Engagement</h2><p className="text-slate-400 font-bold uppercase tracking-widest text-[10px]">Analyzing organic reach and tool clicks.</p></div>;
const SystemSettings = () => <div className="p-10 lg:p-20 text-center animate-in fade-in duration-500"><Settings size={64} className="mx-auto text-orange-200 mb-6" /><h2 className="text-2xl font-black text-slate-800">System Configuration</h2><p className="text-slate-400 font-bold uppercase tracking-widest text-[10px]">Environment variables and audit log controls.</p></div>;

// ── Constants and Mock Data ─────────────────────────────────
const STATS_CARDS = [
    { label: 'Total Landlords', value: '1,240', icon: Users, color: 'text-orange-500 bg-orange-50' },
    { label: 'Global Active Tenants', value: '4,852', icon: Building2, color: 'text-blue-500 bg-blue-50' },
    { label: 'Total Legal Docs Generated', value: '12,450', icon: GanttChart, color: 'text-emerald-500 bg-emerald-50' },
    { label: 'Pending Referrals', value: '18', icon: Gift, color: 'text-purple-500 bg-purple-50' },
];

const OWNERS_DATA = [
    { id: 1, name: 'Suresh Gupta', type: 'Residential', tenants: 12, status: 'Verified', email: 'suresh@rentdesk.in' },
    { id: 2, name: 'Vikram Malhotra', type: 'Commercial', tenants: 3, status: 'Pending', email: 'vikram@rentdesk.in' },
    { id: 3, name: 'Anita Rao', type: 'Residential', tenants: 8, status: 'Verified', email: 'anita@rentdesk.in' },
    { id: 4, name: 'Rajesh Khanna', type: 'PG / Hostel', tenants: 24, status: 'Verified', email: 'rajesh@rentdesk.in' },
    { id: 5, name: 'Meena Sharma', type: 'Residential', tenants: 5, status: 'Pending', email: 'meena@rentdesk.in' },
];

const LEGAL_TOOLS = [
    { id: 1, name: 'Rent Agreement', usage: 4520 },
    { id: 2, name: 'HRA Receipt', usage: 3840 },
    { id: 3, name: 'Police Verification', usage: 2105 },
    { id: 4, name: 'Security Refund', usage: 942 },
    { id: 5, name: 'Inventory Checklist', usage: 860 },
    { id: 6, name: 'Legal Notice Drafts', usage: 420 },
    { id: 7, name: 'Rent Increase Letter', usage: 310 },
];

const LEGAL_TOOL_CLICKS = [
    { tool: 'Rent Agreement', clicks: 4520, trend: '+12%' },
    { tool: 'HRA Receipt', clicks: 3840, trend: '+8%' },
    { tool: 'Police Verification', clicks: 2105, trend: '+5%' },
    { tool: 'Inventory Check', clicks: 860, trend: '-2%' },
];


// ── MAIN COMPONENT: FOUNDER PORTAL ──────────────────────────
export default function FounderPortal() {
    return (
        <Routes>
            <Route index element={<FounderOverview />} />
            <Route path="analytics" element={<GlobalAnalytics />} />
            <Route path="owners" element={<OwnerDirectory />} />
            <Route path="onboard" element={<OnboardOwner />} />
            <Route path="referrals" element={<ReferralQueue />} />
            <Route path="templates" element={<MasterTemplates />} />
            <Route path="tool-stats" element={<ToolAnalytics />} />
            <Route path="settings" element={<SystemSettings />} />
            <Route path="checklist" element={<FounderChecklist />} />
        </Routes>
    );
}

// ── SUB-PAGE: DASHBOARD OVERVIEW ────────────────────────────
function FounderOverview() {
    const [owners, setOwners] = useState(OWNERS_DATA);

    const toggleStatus = (id) => {
        setOwners(owners.map(o => o.id === id ? { ...o, status: o.status === 'Verified' ? 'Pending' : 'Verified' } : o));
        toast.success("Owner status updated!");
    };

    const sectionLabel = "text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4 flex items-center gap-2";

    return (
        <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700">

            {/* Platform Stats Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
                {STATS_CARDS.map((stat, i) => {
                    const Icon = stat.icon;
                    return (
                        <div key={i} className="bg-white p-6 lg:p-8 rounded-[2rem] lg:rounded-[2.5rem] border border-orange-50 shadow-sm group hover:border-orange-200 transition-all">
                            <div className={`w-10 h-10 lg:w-12 lg:h-12 rounded-xl lg:rounded-2xl flex items-center justify-center mb-4 lg:mb-6 transition-transform group-hover:scale-110 ${stat.color}`}>
                                <Icon size={20} className="lg:hidden" />
                                <Icon size={24} className="hidden lg:block" />
                            </div>
                            <p className="text-[8px] lg:text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{stat.label}</p>
                            <p className="text-xl lg:text-3xl font-black text-slate-800">{stat.value}</p>
                        </div>
                    );
                })}
            </div>

            {/* Action Bar (Bulk Controls) */}
            <div className="bg-slate-900 p-6 lg:p-8 rounded-[2rem] lg:rounded-[3rem] shadow-2xl flex flex-col md:flex-row items-center justify-between gap-6 lg:gap-8 border border-slate-800 relative overflow-hidden">
                <div className="relative z-10 text-center md:text-left">
                    <h2 className="text-lg lg:text-xl font-black text-white mb-1">Bulk Command Center</h2>
                    <p className="text-[8px] lg:text-xs font-bold text-slate-400 uppercase tracking-widest">Execute platform-wide operations</p>
                </div>

                <div className="flex flex-wrap justify-center gap-3 lg:gap-4 relative z-10">
                    <button
                        onClick={() => toast.success("Drafting Global Announcement Dashboard...")}
                        className="bg-white/10 hover:bg-white/20 text-white px-4 lg:px-6 py-2.5 lg:py-3 rounded-xl lg:rounded-2xl text-[8px] lg:text-[10px] font-black uppercase tracking-widest border border-white/10 transition-all flex items-center gap-2"
                    >
                        <Radio size={14} className="text-orange-400" /> <span className="hidden sm:inline">Send</span> Announcement
                    </button>
                    <button
                        onClick={() => toast.success("Generating Growth Report...")}
                        className="bg-white/10 hover:bg-white/20 text-white px-4 lg:px-6 py-2.5 lg:py-3 rounded-xl lg:rounded-2xl text-[8px] lg:text-[10px] font-black uppercase tracking-widest border border-white/10 transition-all flex items-center gap-2"
                    >
                        <ArrowDownToLine size={14} className="text-blue-400" /> <span className="hidden sm:inline">Export</span> Data
                    </button>
                    <button
                        onClick={() => {
                            setOwners(owners.map(o => ({ ...o, status: 'Verified' })));
                            toast.success("All pending owners verified!");
                        }}
                        className="bg-orange-500 hover:bg-orange-600 text-white px-6 lg:px-8 py-2.5 lg:py-3 rounded-xl lg:rounded-2xl text-[8px] lg:text-[10px] font-black uppercase tracking-widest shadow-lg shadow-orange-500/20 transition-all flex items-center gap-2"
                    >
                        <ShieldCheck size={14} /> <span className="hidden sm:inline">Verify All</span> Pending
                    </button>
                </div>

                <div className="absolute top-0 right-0 w-64 h-64 bg-orange-500/10 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/2" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-10">

                {/* Owner Management Table (Responsive) */}
                <div className="lg:col-span-2 space-y-8 lg:space-y-10">
                    <div className="space-y-6">
                        <h3 className={sectionLabel}><Users size={14} /> Owner Management Hub</h3>

                        {/* Desktop View: Full Table */}
                        <div className="hidden lg:block bg-white rounded-[3rem] border border-orange-50 shadow-sm overflow-hidden">
                            <table className="w-full text-left">
                                <thead className="bg-slate-50/50">
                                    <tr>
                                        <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Landlord</th>
                                        <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Type</th>
                                        <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Status</th>
                                        <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Access</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-50">
                                    {owners.map(owner => (
                                        <tr key={owner.id} className="hover:bg-slate-50/30 transition-colors group">
                                            <td className="px-8 py-6">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 bg-slate-100 rounded-2xl flex items-center justify-center font-black text-slate-400 text-xs">
                                                        {owner.name[0]}
                                                    </div>
                                                    <div>
                                                        <p className="text-sm font-black text-slate-800 flex items-center gap-2">
                                                            {owner.name}
                                                        </p>
                                                        <p className="text-[10px] font-bold text-slate-400 tracking-wide uppercase">{owner.email}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-8 py-6">
                                                <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest px-3 py-1 bg-slate-50 rounded-lg border border-slate-100">
                                                    {owner.type}
                                                </span>
                                            </td>
                                            <td className="px-8 py-6 text-right">
                                                <button
                                                    onClick={() => toggleStatus(owner.id)}
                                                    className={`text-[10px] font-black uppercase tracking-widest px-4 py-2 rounded-xl transition-all active:scale-95 ${owner.status === 'Verified'
                                                        ? 'bg-emerald-50 text-emerald-600 border border-emerald-100'
                                                        : 'bg-red-50 text-red-600 border border-red-100'
                                                        }`}
                                                >
                                                    {owner.status}
                                                </button>
                                            </td>
                                            <td className="px-8 py-6 text-right">
                                                <button
                                                    onClick={() => toast.success(`Switching to ${owner.name}'s account...`)}
                                                    className="px-4 py-2 bg-slate-900 text-white text-[10px] font-black uppercase tracking-widest rounded-xl shadow-lg shadow-slate-200 opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all flex items-center gap-2 ml-auto"
                                                >
                                                    <LogIn size={14} /> Portal
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* Mobile View: List Cards */}
                        <div className="lg:hidden space-y-4">
                            {owners.map(owner => (
                                <div key={owner.id} className="bg-white p-5 rounded-[2rem] border border-orange-50 shadow-sm space-y-4">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 bg-slate-100 rounded-2xl flex items-center justify-center font-black text-slate-400 text-xs">
                                                {owner.name[0]}
                                            </div>
                                            <div>
                                                <p className="text-sm font-black text-slate-800">{owner.name}</p>
                                                <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">{owner.type}</p>
                                            </div>
                                        </div>
                                        <span className={`text-[8px] font-black px-2 py-1 rounded-lg border ${owner.status === 'Verified' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-red-50 text-red-600 border-red-100'}`}>
                                            {owner.status}
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <button
                                            onClick={() => toast.success(`Calling ${owner.name}...`)}
                                            className="flex-1 bg-slate-50 text-slate-600 py-3 rounded-xl font-black text-[9px] uppercase tracking-widest border border-slate-100 flex items-center justify-center gap-2"
                                        >
                                            <Search size={14} /> Call Owner
                                        </button>
                                        <button
                                            onClick={() => toggleStatus(owner.id)}
                                            className="flex-1 bg-orange-500 text-white py-3 rounded-xl font-black text-[9px] uppercase tracking-widest shadow-lg shadow-orange-100 flex items-center justify-center gap-2"
                                        >
                                            <ShieldCheck size={14} /> {owner.status === 'Verified' ? 'Unverify' : 'Verify'}
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* SEO & Tool Engagement Tracker (Mobile Responsive) */}
                    <div className="space-y-6">
                        <h3 className={sectionLabel}><Search size={14} /> SEO & Tool Engagement Tracker</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-6">
                            {LEGAL_TOOL_CLICKS.map((item, i) => (
                                <div key={i} className="bg-white p-6 rounded-[2rem] lg:rounded-[2.5rem] border border-orange-50 shadow-sm flex items-center justify-between group hover:border-orange-200 transition-all">
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 lg:w-12 lg:h-12 bg-slate-50 rounded-xl lg:rounded-2xl flex items-center justify-center text-slate-400 group-hover:bg-orange-50 group-hover:text-orange-500 transition-colors">
                                            <MousePointer2 size={18} />
                                        </div>
                                        <div>
                                            <p className="text-xs lg:text-sm font-black text-slate-800">{item.tool}</p>
                                            <p className="text-[9px] lg:text-[10px] font-bold text-slate-400">{item.clicks.toLocaleString()} Total Clicks</p>
                                        </div>
                                    </div>
                                    <div className={`text-[9px] lg:text-[10px] font-black px-3 py-1 rounded-full ${item.trend.startsWith('+') ? 'bg-emerald-50 text-emerald-500' : 'bg-red-50 text-red-500'}`}>
                                        {item.trend}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Right Column Monitoring */}
                <div className="space-y-8 lg:space-y-10">
                    {/* Legal Hub Monitoring */}
                    <div className="space-y-6">
                        <h3 className={sectionLabel}><GanttChart size={14} /> Legal Hub Tracking</h3>
                        <div className="bg-white p-6 lg:p-8 rounded-[2.5rem] lg:rounded-[3rem] border border-orange-50 shadow-sm">
                            <div className="space-y-5 lg:space-y-6">
                                {LEGAL_TOOLS.map(tool => (
                                    <div key={tool.id} className="group flex flex-col gap-2">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-3">
                                                <div className="w-1.5 h-1.5 rounded-full bg-orange-400 shadow-[0_0_8px_rgba(249,115,22,0.4)]" />
                                                <p className="text-xs lg:text-sm font-black text-slate-800 group-hover:text-orange-500 transition-colors">{tool.name}</p>
                                            </div>
                                            <p className="text-[9px] lg:text-[10px] font-black text-slate-400 uppercase tracking-widest">{tool.usage.toLocaleString()} uses</p>
                                        </div>
                                        <div className="h-1.5 w-full bg-slate-50 rounded-full overflow-hidden border border-slate-100">
                                            <div
                                                className="h-full bg-gradient-to-r from-orange-400 to-orange-600 rounded-full transition-all duration-1000"
                                                style={{ width: `${(tool.usage / 5000) * 100}%` }}
                                            />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* System Activity Logs */}
                    <div className="space-y-6">
                        <h3 className={sectionLabel}><Activity size={14} /> Live System Logs</h3>
                        <div className="bg-slate-900 p-6 rounded-[2rem] lg:rounded-[2.5rem] border border-slate-800 shadow-xl overflow-hidden relative">
                            <div className="space-y-4 max-h-[300px] lg:max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                                {[
                                    { time: '04:15 AM', type: 'AUTH', msg: 'Founder portal accessed' },
                                    { time: '03:42 AM', type: 'SYSTEM', msg: 'Rent gen cron completed' },
                                    { time: '02:30 AM', type: 'PAYMENT', msg: 'Payment verified: Flat 102' },
                                    { time: '01:15 AM', type: 'USER', msg: 'New signup: Rajesh K.' },
                                    { time: '12:00 AM', type: 'SYSTEM', msg: 'DB backup saved to S3' }
                                ].map((log, i) => (
                                    <div key={i} className="flex gap-3">
                                        <p className="text-[7px] font-black text-slate-500 whitespace-nowrap pt-1">{log.time}</p>
                                        <div>
                                            <span className={`text-[7px] font-black px-1 py-0.5 rounded mr-1.5 ${log.type === 'AUTH' ? 'bg-orange-500/20 text-orange-400' : 'bg-emerald-500/20 text-emerald-400'}`}>
                                                {log.type}
                                            </span>
                                            <p className="text-[9px] font-bold text-slate-400 leading-normal">{log.msg}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Security Notice */}
                    <div className="p-6 lg:p-8 bg-orange-50/50 rounded-[2.5rem] border border-orange-100 flex flex-col items-center text-center">
                        <div className="w-10 h-10 lg:w-12 lg:h-12 bg-white rounded-xl lg:rounded-2xl flex items-center justify-center text-orange-500 shadow-sm mb-4">
                            <Lock size={18} />
                        </div>
                        <h4 className="text-xs lg:text-sm font-black text-slate-800 uppercase tracking-tight mb-2">Founder Enclave</h4>
                        <p className="text-[9px] lg:text-xs font-bold text-slate-400 leading-relaxed mb-6">
                            Secure end-to-end encrypted session. Actions affect production.
                        </p>
                        <div className="flex items-center gap-2 text-[8px] lg:text-[9px] font-black text-emerald-600 uppercase tracking-widest">
                            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                            Live Access
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
}

// ── SUB-PAGE: ONBOARD OWNER FORM ─────────────────────────────
function OnboardOwner() {
    const [form, setForm] = useState({ name: '', email: '', type: 'Residential', phone: '' });

    const handleSubmit = (e) => {
        e.preventDefault();
        toast.promise(
            new Promise((resolve) => setTimeout(resolve, 1500)),
            {
                loading: 'Initializing PG infrastructure...',
                success: 'Landlord Dashboard provisioned successfully!',
                error: 'Handshake failed.'
            }
        );
    };

    return (
        <div className="max-w-xl mx-auto py-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="text-center mb-10">
                <div className="w-16 h-16 bg-orange-500 text-white rounded-[2rem] flex items-center justify-center mx-auto mb-6 shadow-xl shadow-orange-100">
                    <UserPlus size={32} />
                </div>
                <h2 className="text-2xl lg:text-3xl font-black text-slate-800 tracking-tight">Onboard New Partner</h2>
                <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px] mt-2">Manual Account Creation Protocol</p>
            </div>

            <form onSubmit={handleSubmit} className="bg-white p-8 lg:p-10 rounded-[3rem] border border-orange-50 shadow-2xl space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Full Name</label>
                        <input
                            type="text"
                            required
                            placeholder="e.g. Mukesh Ambani"
                            className="w-full px-6 py-4 rounded-2xl bg-slate-50 border border-slate-100 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all"
                            onChange={(e) => setForm({ ...form, name: e.target.value })}
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Property Type</label>
                        <select
                            className="w-full px-6 py-4 rounded-2xl bg-slate-50 border border-slate-100 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all appearance-none"
                            onChange={(e) => setForm({ ...form, type: e.target.value })}
                        >
                            <option>Residential</option>
                            <option>Commercial</option>
                            <option>PG / Hostel</option>
                            <option>Co-living Space</option>
                        </select>
                    </div>
                </div>

                <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Email Address</label>
                    <input
                        type="email"
                        required
                        placeholder="owner@enterprise.com"
                        className="w-full px-6 py-4 rounded-2xl bg-slate-50 border border-slate-100 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all"
                        onChange={(e) => setForm({ ...form, email: e.target.value })}
                    />
                </div>

                <div className="pt-4">
                    <button
                        type="submit"
                        className="w-full bg-slate-900 hover:bg-black text-white py-5 rounded-2xl font-black text-[12px] uppercase tracking-[0.3em] shadow-2xl transition-all active:scale-95 flex items-center justify-center gap-4"
                    >
                        Provision Account <ShieldCheck size={20} className="text-orange-500" />
                    </button>
                    <p className="mt-6 text-center text-[9px] font-bold text-slate-400 flex items-center justify-center gap-2">
                        <Lock size={10} /> Automated password generation & welcome kit email delivery.
                    </p>
                </div>
            </form>
        </div>
    );
}
