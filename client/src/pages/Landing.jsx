// =============================================================
//  Cloud Bass Rent Management — Landing Page
//  File : client/src/pages/Landing.jsx
//
//  Sections:
//    1. Navbar       — Logo + Login CTA
//    2. Hero         — Headline + Sub + CTA buttons
//    3. Stats Bar    — Social proof numbers
//    4. Features     — 3 feature cards
//    5. How It Works — 3-step process
//    6. Testimonial  — Quote card
//    7. CTA Banner   — Final call to action
//    8. Footer       — Brand + copyright
// =============================================================

import { useNavigate } from 'react-router-dom';
import {
    Zap, MessageSquare, Cloud, CheckCircle, ArrowRight,
    Building2, IndianRupee, Bell, ShieldCheck, ChevronRight,
    Star, Menu, X
} from 'lucide-react';
import { useState } from 'react';
import Footer from '../components/Footer.jsx';

// ── Smooth scroll helper ──────────────────────────────────────
const scrollTo = (id) => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });

// ── Feature card data ─────────────────────────────────────────
const FEATURES = [
    {
        icon: Zap,
        color: 'bg-orange-500',
        title: 'Auto-Rent Generation',
        desc: 'Every 1st of the month, rent records are created automatically for all tenants — zero manual effort required.',
    },
    {
        icon: MessageSquare,
        color: 'bg-green-500',
        title: 'WhatsApp Reminders',
        desc: 'Send a professional, pre-filled payment reminder to any tenant in one tap. No paid API needed.',
    },
    {
        icon: Cloud,
        color: 'bg-blue-500',
        title: 'Cloud-Backed Storage',
        desc: 'Your data lives in a PostgreSQL database in the cloud — accessible from any device, always in sync.',
    },
    {
        icon: Building2,
        color: 'bg-purple-500',
        title: 'Multi-Property CRUD',
        desc: 'Manage unlimited properties and units. Add, edit, or remove in seconds with a clean mobile-first UI.',
    },
    {
        icon: IndianRupee,
        color: 'bg-teal-500',
        title: 'Full Payment Ledger',
        desc: 'Track every ₹ — Pending, Paid, Overdue, Waived. Filter by month, property, or payment status.',
    },
    {
        icon: ShieldCheck,
        color: 'bg-rose-500',
        title: 'Zero-Cost Hosting',
        desc: 'Deploy on Vercel + Render.com + Neon.tech — all free tiers. Production-grade at ₹0/month.',
    },
];

const STEPS = [
    { num: '01', title: 'Add Your Property', desc: 'Create your building, add units with monthly rent amounts.' },
    { num: '02', title: 'Assign Tenants', desc: 'Link a tenant to each unit. Their WhatsApp number is stored.' },
    { num: '03', title: 'Collect Rent on Auto', desc: 'Rent records generate on the 1st. You get a dashboard overview instantly.' },
];

// =============================================================
//  MAIN COMPONENT
// =============================================================
export default function Landing() {
    const navigate = useNavigate();
    const [menuOpen, setMenuOpen] = useState(false);

    return (
        <div className="min-h-screen bg-[#F8F8F7] font-['Inter',sans-serif] overflow-x-hidden">

            {/* ═══════════════════════════════════════════════════════
          NAVBAR
      ═══════════════════════════════════════════════════════ */}
            <nav className="sticky top-0 z-50 bg-[#F8F8F7]/90 backdrop-blur-md border-b border-orange-100">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
                    {/* Logo */}
                    <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 bg-gradient-to-br from-orange-400 to-orange-600 rounded-xl flex items-center justify-center shadow-brand-sm">
                            <Building2 size={16} className="text-white" />
                        </div>
                        <span className="font-bold text-slate-800 text-lg tracking-tight">
                            Cloud<span className="text-orange-500">Bass</span>
                        </span>
                    </div>

                    {/* Desktop Nav Links */}
                    <div className="hidden md:flex items-center gap-8 text-sm text-slate-600 font-medium">
                        <button onClick={() => scrollTo('features')} className="hover:text-orange-500 transition-colors">Features</button>
                        <button onClick={() => scrollTo('how-it-works')} className="hover:text-orange-500 transition-colors">How It Works</button>
                        <button onClick={() => scrollTo('pricing')} className="hover:text-orange-500 transition-colors">Pricing</button>
                    </div>

                    {/* CTA */}
                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => navigate('/login')}
                            className="hidden sm:block text-sm font-semibold text-slate-700 hover:text-orange-500 transition-colors px-3 py-2"
                        >
                            Sign In
                        </button>
                        <button
                            onClick={() => navigate('/login')}
                            className="bg-orange-500 hover:bg-orange-600 active:scale-95 text-white text-sm font-semibold px-4 py-2 rounded-xl shadow-brand-sm transition-all"
                        >
                            Get Started →
                        </button>
                        {/* Mobile menu toggle */}
                        <button className="md:hidden p-1.5 rounded-lg" onClick={() => setMenuOpen(v => !v)}>
                            {menuOpen ? <X size={20} className="text-slate-600" /> : <Menu size={20} className="text-slate-600" />}
                        </button>
                    </div>
                </div>

                {/* Mobile menu */}
                {menuOpen && (
                    <div className="md:hidden border-t border-orange-100 bg-white px-4 py-3 space-y-1">
                        {['features', 'how-it-works', 'pricing'].map(id => (
                            <button key={id} onClick={() => { scrollTo(id); setMenuOpen(false); }}
                                className="block w-full text-left px-3 py-2.5 rounded-xl text-sm font-medium text-slate-700 hover:bg-orange-50 capitalize transition-colors">
                                {id.replace('-', ' ')}
                            </button>
                        ))}
                    </div>
                )}
            </nav>

            {/* ═══════════════════════════════════════════════════════
          HERO SECTION
      ═══════════════════════════════════════════════════════ */}
            <section className="relative pt-16 pb-20 px-4 sm:px-6 overflow-hidden">
                {/* Background decoration */}
                <div className="absolute top-0 right-0 w-96 h-96 bg-orange-100 rounded-full blur-3xl opacity-40 -translate-y-1/2 translate-x-1/3 pointer-events-none" />
                <div className="absolute bottom-0 left-0 w-72 h-72 bg-orange-50 rounded-full blur-3xl opacity-60 translate-y-1/2 -translate-x-1/3 pointer-events-none" />

                <div className="relative max-w-4xl mx-auto text-center">
                    {/* Badge */}
                    <div className="inline-flex items-center gap-2 bg-orange-100 text-orange-700 text-xs font-semibold px-4 py-2 rounded-full mb-6 border border-orange-200">
                        <Zap size={12} className="fill-orange-500" />
                        Zero-cost · Mobile-first · Fully automated
                    </div>

                    {/* Headline */}
                    <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 leading-tight tracking-tight mb-6">
                        Manage your Properties
                        <br />
                        <span className="bg-gradient-to-r from-orange-500 to-orange-600 bg-clip-text text-transparent">
                            with rentDesk Platform.
                        </span>
                    </h1>

                    {/* Sub */}
                    <p className="text-lg sm:text-xl text-slate-500 max-w-2xl mx-auto mb-10 leading-relaxed">
                        Automate monthly rent collection, send WhatsApp reminders in one tap,
                        and track every payment — all from your phone. Built for Indian landlords.
                    </p>

                    {/* CTAs */}
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                        <button
                            onClick={() => navigate('/login')}
                            className="w-full sm:w-auto flex items-center justify-center gap-2 bg-orange-500 hover:bg-orange-600 active:scale-95 text-white font-bold text-base px-8 py-4 rounded-2xl shadow-brand-lg transition-all"
                        >
                            Start Managing Free <ArrowRight size={18} />
                        </button>
                        <button
                            onClick={() => scrollTo('features')}
                            className="w-full sm:w-auto flex items-center justify-center gap-2 text-slate-700 bg-white border border-slate-200 hover:border-orange-300 hover:bg-orange-50 font-semibold text-base px-8 py-4 rounded-2xl transition-all"
                        >
                            See Features <ChevronRight size={18} className="text-orange-500" />
                        </button>
                    </div>

                    {/* Trust signals */}
                    <div className="mt-10 flex items-center justify-center gap-6 text-sm text-slate-400 flex-wrap">
                        {['No credit card needed', 'Free forever plan', 'WhatsApp built-in'].map(t => (
                            <span key={t} className="flex items-center gap-1.5">
                                <CheckCircle size={14} className="text-green-500" /> {t}
                            </span>
                        ))}
                    </div>
                </div>

                {/* Hero illustration — Dashboard preview */}
                <div className="relative max-w-3xl mx-auto mt-14">
                    <div className="bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden">
                        {/* Fake Browser chrome */}
                        <div className="bg-slate-50 border-b border-slate-100 px-4 py-3 flex items-center gap-2">
                            <div className="flex gap-1.5">
                                <div className="w-3 h-3 rounded-full bg-red-400" />
                                <div className="w-3 h-3 rounded-full bg-yellow-400" />
                                <div className="w-3 h-3 rounded-full bg-green-400" />
                            </div>
                            <div className="flex-1 bg-white rounded-lg px-3 py-1.5 text-xs text-slate-400 text-center border border-slate-100">
                                app.cloudbass.in/dashboard
                            </div>
                        </div>
                        {/* Mini dashboard preview */}
                        <div className="p-4 bg-[#F8F8F7]">
                            <div className="grid grid-cols-3 gap-3 mb-4">
                                {[
                                    { label: 'Collected', val: '₹53,000', color: 'border-green-200 bg-green-50', badge: 'bg-green-500' },
                                    { label: 'Pending', val: '₹18,000', color: 'border-amber-200 bg-amber-50', badge: 'bg-amber-500' },
                                    { label: 'Overdue', val: '₹20,000', color: 'border-red-200 bg-red-50', badge: 'bg-red-500' },
                                ].map(c => (
                                    <div key={c.label} className={`rounded-xl p-3 border ${c.color}`}>
                                        <div className={`w-2 h-2 rounded-full ${c.badge} mb-1.5`} />
                                        <p className="text-xs text-slate-500">{c.label}</p>
                                        <p className="text-sm font-bold text-slate-800">{c.val}</p>
                                    </div>
                                ))}
                            </div>
                            {[
                                { name: 'Priya Sharma', unit: 'Flat 101', status: 'Paid', sc: 'bg-green-100 text-green-700' },
                                { name: 'Mohammed Khan', unit: 'Flat 201', status: 'Pending', sc: 'bg-amber-100 text-amber-700' },
                                { name: 'Anita Patel', unit: 'Flat 301', status: 'Overdue', sc: 'bg-red-100 text-red-700' },
                            ].map(t => (
                                <div key={t.name} className="flex items-center justify-between bg-white rounded-xl px-3 py-2.5 mb-2 border border-slate-100">
                                    <div className="flex items-center gap-2">
                                        <div className="w-7 h-7 bg-orange-500 rounded-full flex items-center justify-center text-white text-xs font-bold">{t.name[0]}</div>
                                        <div>
                                            <p className="text-xs font-semibold text-slate-800">{t.name}</p>
                                            <p className="text-xs text-slate-400">{t.unit}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${t.sc}`}>{t.status}</span>
                                        <div className="w-6 h-6 bg-green-500 rounded-lg flex items-center justify-center">
                                            <MessageSquare size={10} className="text-white" />
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                    {/* Glow */}
                    <div className="absolute -inset-4 bg-gradient-to-b from-orange-200/20 to-transparent rounded-3xl blur-2xl -z-10" />
                </div>
            </section>

            {/* ═══════════════════════════════════════════════════════
          STATS BAR
      ═══════════════════════════════════════════════════════ */}
            <section className="bg-orange-500 py-8 px-4">
                <div className="max-w-4xl mx-auto grid grid-cols-2 sm:grid-cols-4 gap-6 text-center">
                    {[
                        { val: '100%', label: 'Free to Use' },
                        { val: '₹0', label: 'Monthly Hosting Cost' },
                        { val: '1-Tap', label: 'WhatsApp Reminders' },
                        { val: '24/7', label: 'Auto Rent Engine' },
                    ].map(s => (
                        <div key={s.label}>
                            <p className="text-3xl font-extrabold text-white">{s.val}</p>
                            <p className="text-sm text-orange-100 mt-1">{s.label}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* ═══════════════════════════════════════════════════════
          FEATURES
      ═══════════════════════════════════════════════════════ */}
            <section id="features" className="py-20 px-4 sm:px-6">
                <div className="max-w-6xl mx-auto">
                    <div className="text-center mb-14">
                        <p className="text-orange-500 font-semibold text-sm uppercase tracking-widest mb-3">What You Get</p>
                        <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900">
                            Everything a Landlord Needs
                        </h2>
                        <p className="text-slate-500 mt-4 max-w-xl mx-auto">
                            No complicated setup. No subscriptions. Just a fast, clean tool that works the way you think.
                        </p>
                    </div>

                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {FEATURES.map(({ icon: Icon, color, title, desc }) => (
                            <div key={title} className="group bg-white rounded-2xl p-6 border border-slate-100 hover:border-orange-200 hover:shadow-brand-md transition-all cursor-default">
                                <div className={`w-12 h-12 ${color} rounded-2xl flex items-center justify-center shadow-sm mb-4 group-hover:scale-110 transition-transform`}>
                                    <Icon size={22} className="text-white" />
                                </div>
                                <h3 className="font-bold text-slate-800 mb-2">{title}</h3>
                                <p className="text-slate-500 text-sm leading-relaxed">{desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ═══════════════════════════════════════════════════════
          HOW IT WORKS
      ═══════════════════════════════════════════════════════ */}
            <section id="how-it-works" className="py-20 px-4 sm:px-6 bg-white">
                <div className="max-w-4xl mx-auto">
                    <div className="text-center mb-14">
                        <p className="text-orange-500 font-semibold text-sm uppercase tracking-widest mb-3">Simple Setup</p>
                        <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900">
                            Up and Running in 3 Steps
                        </h2>
                    </div>

                    <div className="grid sm:grid-cols-3 gap-8">
                        {STEPS.map((s, i) => (
                            <div key={s.num} className="relative text-center">
                                {i < STEPS.length - 1 && (
                                    <div className="hidden sm:block absolute top-8 left-[60%] w-full h-px bg-gradient-to-r from-orange-200 to-transparent" />
                                )}
                                <div className="w-16 h-16 bg-orange-50 border-2 border-orange-200 rounded-2xl flex items-center justify-center mx-auto mb-4">
                                    <span className="text-2xl font-extrabold text-orange-500">{s.num}</span>
                                </div>
                                <h3 className="font-bold text-slate-800 mb-2">{s.title}</h3>
                                <p className="text-sm text-slate-500 leading-relaxed">{s.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ═══════════════════════════════════════════════════════
          TESTIMONIAL
      ═══════════════════════════════════════════════════════ */}
            <section className="py-20 px-4 sm:px-6">
                <div className="max-w-2xl mx-auto text-center">
                    <div className="flex justify-center gap-1 mb-6">
                        {[...Array(5)].map((_, i) => <Star key={i} size={20} className="fill-orange-400 text-orange-400" />)}
                    </div>
                    <blockquote className="text-2xl sm:text-3xl font-bold text-slate-800 leading-snug mb-6">
                        "Earlier I used to call each tenant individually. Now I just tap 'Send WhatsApp' and it's done in seconds."
                    </blockquote>
                    <div className="flex items-center justify-center gap-3">
                        <div className="w-10 h-10 bg-orange-500 rounded-full flex items-center justify-center text-white font-bold">R</div>
                        <div className="text-left">
                            <p className="font-semibold text-slate-800 text-sm">Ramesh Gupta</p>
                            <p className="text-sm text-slate-400">Landlord · Mumbai · 5 Units</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* ═══════════════════════════════════════════════════════
          PRICING SECTION
      ═══════════════════════════════════════════════════════ */}
            <section id="pricing" className="py-20 px-4 sm:px-6 bg-white">
                <div className="max-w-md mx-auto text-center">
                    <p className="text-orange-500 font-semibold text-sm uppercase tracking-widest mb-3">Pricing</p>
                    <h2 className="text-3xl font-extrabold text-slate-900 mb-4">Always Free.</h2>
                    <p className="text-slate-500 mb-8">No hidden costs. No subscriptions. Deploy on free-tier cloud services and run forever at ₹0.</p>
                    <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-3xl p-8 border border-orange-200">
                        <div className="text-6xl font-extrabold text-orange-500 mb-2">₹0</div>
                        <p className="text-slate-500 text-sm mb-6">per month, forever</p>
                        <ul className="text-left space-y-3 mb-8">
                            {['Unlimited Properties', 'Unlimited Tenants', 'Auto Rent Generation', 'WhatsApp Reminders', 'Payment Ledger', 'Cloud Database'].map(f => (
                                <li key={f} className="flex items-center gap-3 text-sm text-slate-700">
                                    <CheckCircle size={16} className="text-green-500 shrink-0" /> {f}
                                </li>
                            ))}
                        </ul>
                        <button
                            onClick={() => navigate('/login')}
                            className="w-full bg-orange-500 hover:bg-orange-600 active:scale-95 text-white font-bold py-4 rounded-2xl shadow-brand-md transition-all"
                        >
                            Start for Free →
                        </button>
                    </div>
                </div>
            </section>

            {/* ═══════════════════════════════════════════════════════
          CTA BANNER
      ═══════════════════════════════════════════════════════ */}
            <section className="bg-gradient-to-r from-orange-500 to-orange-600 py-16 px-4 sm:px-6">
                <div className="max-w-3xl mx-auto text-center">
                    <h2 className="text-3xl sm:text-4xl font-extrabold text-white mb-4">
                        Ready to automate your rent collection?
                    </h2>
                    <p className="text-orange-100 mb-8 text-lg">
                        Join landlords who've replaced spreadsheets and phone calls with CloudBass.
                    </p>
                    <button
                        onClick={() => navigate('/login')}
                        className="bg-white hover:bg-orange-50 active:scale-95 text-orange-500 font-bold text-lg px-10 py-4 rounded-2xl shadow-xl transition-all"
                    >
                        Get Started — It's Free
                    </button>
                </div>
            </section>

            {/* ═══════════════════════════════════════════════════════
          FOOTER
      ═══════════════════════════════════════════════════════ */}
            <Footer />

        </div>
    );
}
