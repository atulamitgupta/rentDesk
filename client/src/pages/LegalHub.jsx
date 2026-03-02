import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
    Search, FileText, ShieldAlert, IndianRupee,
    Wallet, ClipboardCheck, Scale, MousePointer2,
    ArrowRight, MessageSquare, Download, Share2,
    Users as UsersIcon, Building2, HelpCircle,
    ChevronDown, LayoutDashboard, Gift, Home,
    TrendingUp, CheckCircle2, Wrench
} from 'lucide-react';
import { useAuth } from '../context/AuthContext.jsx';
import toast from 'react-hot-toast';

const TOOLS = [
    {
        id: 'rent-agreement',
        title: 'Rent Agreement Generator',
        desc: 'Generate legally valid 11-month rental agreements for your tenants in seconds.',
        icon: FileText,
        color: 'text-orange-500 bg-orange-50'
    },
    {
        id: 'police-verification',
        title: 'Police Verification Form',
        desc: 'Access printable police verification forms for Noida, Delhi, and Gurgaon districts.',
        icon: ShieldAlert,
        color: 'text-blue-500 bg-blue-50'
    },
    {
        id: 'hra-receipt',
        title: 'HRA Receipt Maker',
        desc: 'Create professional HRA rent receipts for your tenants to claim tax benefits.',
        icon: IndianRupee,
        color: 'text-emerald-500 bg-emerald-50'
    },
    {
        id: 'security-refund',
        title: 'Security Refund Calculator',
        desc: 'Calculate final settlement amounts after deducting damages and pending bills.',
        icon: Wallet,
        color: 'text-purple-500 bg-purple-50'
    },
    {
        id: 'inventory-check',
        title: 'Inventory Checklist',
        desc: 'Professionally track the condition of ACs, Fans, and Furniture during move-in.',
        icon: ClipboardCheck,
        color: 'text-teal-500 bg-teal-50'
    },
    {
        id: 'eviction-notice',
        title: 'Legal Notice Drafts',
        desc: 'Standard legal notices for rule violations, late payments, or property evacuation.',
        icon: Scale,
        color: 'text-rose-500 bg-rose-50'
    },
    {
        id: 'rent-increase',
        title: 'Rent Increase Letter',
        desc: 'Professional template to notify tenants about annual rent hikes and renewals.',
        icon: TrendingUp,
        color: 'text-amber-500 bg-amber-50'
    },
    {
        id: 'owner-noc',
        title: 'Owner NOC Generator',
        desc: 'No Objection Certificate for tenant address proof or commercial registration.',
        icon: CheckCircle2,
        color: 'text-indigo-500 bg-indigo-50'
    },
    {
        id: 'maintenance-log',
        title: 'Maintenance Log Book',
        desc: 'Detailed log of repairs and plumbing issues fixed in each unit for records.',
        icon: Wrench,
        color: 'text-slate-500 bg-slate-50'
    },
];

export default function LegalHub() {
    const { isAuth, landlord } = useAuth();
    const navigate = useNavigate();
    const [searchQuery, setSearchQuery] = useState('');
    const [activeFAQ, setActiveFAQ] = useState(null);

    const filteredTools = TOOLS.filter(t =>
        t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.desc.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const faqs = [
        {
            q: "Why do I need Police Verification for tenants?",
            a: "Police verification is a mandatory legal requirement in most Indian cities. It ensures the safety of the neighborhood and protects the landlord from legal liability in case of criminal activities by a tenant."
        },
        {
            q: "Is an 11-month rent agreement legally valid?",
            a: "Yes, 11-month agreements are standard practice in India as they do not require mandatory registration under the Registration Act, 1908, saving both parties from hefty stamp duty while remaining legally binding in court."
        },
        {
            q: "How can I make an HRA receipt for my tenant?",
            a: "You can use our HRA Receipt Maker. Simply enter the rent amount, your PAN details, and the tenant's name to generate a professional PDF receipt they can submit to their company."
        }
    ];

    return (
        <div className="min-h-screen bg-[#F8F8F7] text-slate-800 pb-20">

            {/* ── Header ────────────────────────────────────────── */}
            <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-orange-100 px-6 py-4">
                <div className="max-w-6xl mx-auto flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 bg-orange-500 rounded-xl flex items-center justify-center text-white shadow-lg shadow-orange-100">
                            <Building2 size={18} />
                        </div>
                        <span className="font-black text-slate-800 text-lg tracking-tight">Cloud Bass <span className="text-orange-500 text-sm font-bold uppercase tracking-widest ml-1">Tools</span></span>
                    </div>

                    <div className="hidden md:flex items-center gap-8">
                        <Link to="/" className="text-xs font-black text-slate-400 hover:text-orange-500 uppercase tracking-widest transition-colors">Home</Link>
                        {isAuth ? (
                            <>
                                <Link to="/dashboard" className="text-xs font-black text-slate-400 hover:text-orange-500 uppercase tracking-widest transition-colors">Dashboard</Link>
                                <Link to="/refer-earn" className="text-xs font-black text-slate-400 hover:text-orange-500 uppercase tracking-widest transition-colors">Refer & Earn</Link>
                            </>
                        ) : (
                            <Link to="/login" className="text-xs font-black text-slate-400 hover:text-orange-500 uppercase tracking-widest transition-colors">Owner Login</Link>
                        )}
                    </div>

                    <button
                        onClick={() => navigate(isAuth ? '/dashboard' : '/login')}
                        className="bg-slate-900 text-white px-5 py-2.5 rounded-xl font-black text-[10px] uppercase tracking-widest shadow-lg shadow-slate-100 hover:bg-slate-800 transition-all active:scale-95 flex items-center gap-2"
                    >
                        {isAuth ? <LayoutDashboard size={14} /> : <Home size={14} />}
                        {isAuth ? 'Go to App' : 'Get Started'}
                    </button>
                </div>
            </nav>

            {/* ── Hero Section ───────────────────────────────────── */}
            <section className="bg-white border-b border-orange-100 pt-16 pb-20 px-6">
                <div className="max-w-4xl mx-auto text-center">
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-orange-100 text-orange-700 text-[10px] font-black uppercase tracking-widest rounded-full mb-6 border border-orange-200">
                        <Scale size={14} /> Legal & Utility Hub
                    </div>
                    <h1 className="text-4xl md:text-5xl font-black text-slate-900 mb-6 tracking-tight leading-none">
                        Free Property Management <br /> <span className="text-orange-500">Legal Tools</span>
                    </h1>
                    <p className="text-lg text-slate-500 font-bold mb-10 max-w-2xl mx-auto">
                        Automated documents, legal drafts, and compliance tracking for Indian landlords. No subscription required.
                    </p>

                    {/* Search Bar */}
                    <div className="relative max-w-xl mx-auto group">
                        <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-orange-500 transition-colors" size={20} />
                        <input
                            type="text"
                            placeholder="Search for a tool (e.g. HRA, Agreement, Notice)..."
                            className="w-full pl-16 pr-8 py-5 bg-slate-50 border-2 border-slate-100 rounded-3xl outline-none focus:border-orange-500 focus:bg-white transition-all shadow-sm font-bold text-slate-700 placeholder-slate-400"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                </div>
            </section>

            {/* ── The Tool Grid (3x3) ───────────────────────────── */}
            <section className="max-w-6xl mx-auto px-6 py-20">
                <div className="flex items-center justify-between mb-12">
                    <h2 className="text-2xl font-black text-slate-800 tracking-tight">Available Tools</h2>
                    <p className="text-xs font-black text-orange-500 uppercase tracking-widest">Showing {filteredTools.length} results</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {filteredTools.map((tool) => (
                        <div
                            key={tool.id}
                            className="group bg-white p-10 rounded-[2.5rem] border border-orange-50 shadow-sm hover:shadow-2xl hover:shadow-orange-100/40 hover:-translate-y-2 transition-all duration-500 flex flex-col"
                        >
                            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-8 shadow-sm transition-transform duration-500 group-hover:scale-110 ${tool.color}`}>
                                {tool.icon ? <tool.icon size={26} /> : <FileText size={26} />}
                            </div>
                            <h3 className="text-xl font-black text-slate-800 mb-3 leading-tight">{tool.title}</h3>
                            <p className="text-sm font-bold text-slate-400 leading-relaxed mb-8 flex-1">{tool.desc}</p>

                            <div className="space-y-3">
                                <button className="w-full py-4 bg-orange-500 hover:bg-orange-600 text-white font-black rounded-2xl shadow-xl shadow-orange-100 flex items-center justify-center gap-3 transition-all active:scale-95 text-xs">
                                    <Download size={16} /> Generate PDF
                                </button>
                                {isAuth && (
                                    <div className="flex items-center justify-center gap-2 text-[10px] font-black text-emerald-500 uppercase tracking-widest">
                                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                                        Auto-fill from Dashboard
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>

                {filteredTools.length === 0 && (
                    <div className="py-20 text-center bg-white rounded-[3rem] border border-dashed border-orange-200">
                        <HelpCircle size={48} className="text-orange-200 mx-auto mb-4" />
                        <p className="text-lg font-black text-slate-800">No tool matches your search</p>
                        <button onClick={() => setSearchQuery('')} className="text-orange-500 font-bold underline mt-2 text-sm">Clear Search</button>
                    </div>
                )}
            </section>

            {/* ── SEO FAQ Section ────────────────────────────────── */}
            <section className="bg-slate-900 py-24 px-6 relative overflow-hidden">
                <div className="max-w-4xl mx-auto relative z-10">
                    <div className="text-center mb-16">
                        <p className="text-orange-400 font-black text-[10px] uppercase tracking-[0.2em] mb-3">Expert Guidance</p>
                        <h2 className="text-3xl font-black text-white tracking-tight">Legal Knowledge Base</h2>
                    </div>

                    <div className="space-y-4">
                        {faqs.map((faq, i) => (
                            <div key={i} className="bg-white/5 border border-white/10 rounded-[2rem] overflow-hidden transition-all">
                                <button
                                    onClick={() => setActiveFAQ(activeFAQ === i ? null : i)}
                                    className="w-full flex items-center justify-between px-8 py-6 text-left"
                                >
                                    <span className="text-lg font-black text-white">{faq.q}</span>
                                    <ChevronDown size={20} className={`text-orange-400 transition-transform ${activeFAQ === i ? 'rotate-180' : ''}`} />
                                </button>
                                {activeFAQ === i && (
                                    <div className="px-8 pb-8 animate-in slide-in-from-top duration-300">
                                        <p className="text-slate-400 font-medium leading-relaxed">{faq.a}</p>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
                {/* Decoration */}
                <div className="absolute top-0 right-0 w-96 h-96 bg-orange-500/10 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2" />
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-500/5 rounded-full blur-[80px] translate-y-1/2 -translate-x-1/2" />
            </section>

            {/* ── Mobile Guest Notice ────────────────────────────── */}
            {!isAuth && (
                <div className="max-w-6xl mx-auto px-6 mt-12">
                    <div className="bg-gradient-to-r from-orange-400 to-orange-600 rounded-[2rem] p-8 text-white flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl shadow-orange-100">
                        <div>
                            <h3 className="text-xl font-black tracking-tight leading-tight">Managing multiple properties?</h3>
                            <p className="text-sm font-bold text-orange-100 mt-1 uppercase tracking-widest">Join 500+ Landlords on Cloud Bass</p>
                        </div>
                        <button
                            onClick={() => navigate('/login')}
                            className="bg-white text-orange-500 px-8 py-4 rounded-2xl font-black text-sm shadow-lg hover:scale-105 transition-all flex items-center gap-2"
                        >
                            Create Free Account <ArrowRight size={18} />
                        </button>
                    </div>
                </div>
            )}

        </div>
    );
}

