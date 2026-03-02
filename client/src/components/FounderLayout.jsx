// =============================================================
//  Cloud Bass Rent Management — Executive Founder Layout
//  File : client/src/components/FounderLayout.jsx
// =============================================================

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import FounderSidebar from './FounderSidebar';
import FounderBottomNav from './FounderBottomNav';
import { ShieldCheck, Activity, Menu } from 'lucide-react';

const FOUNDER_EMAIL = "founder@rentdesk.in";


export default function FounderLayout({ children }) {
    const { landlord, isAuth } = useAuth();
    const navigate = useNavigate();
    const [isAuthorized, setIsAuthorized] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [sideOpen, setSideOpen] = useState(false);

    useEffect(() => {
        // Gatekeeper Logic: Verify if user is the founder
        if (isAuth && landlord?.email?.toLowerCase() === FOUNDER_EMAIL) {
            setIsAuthorized(true);
        } else {
            setIsAuthorized(false);
        }
        setIsLoading(false);
    }, [isAuth, landlord]);

    if (isLoading) return null;

    // Stealth Mode: If not authorized, return "404" behavior
    if (!isAuthorized) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center bg-[#F8F8F7]">
                <h1 className="text-4xl font-black text-slate-800 mb-4">404</h1>
                <p className="text-slate-500 font-bold mb-8">Oops! The page you're looking for doesn't exist.</p>
                <button
                    onClick={() => navigate('/login')}
                    className="bg-orange-500 text-white px-8 py-4 rounded-2xl font-black text-sm shadow-xl shadow-orange-100 hover:scale-105 transition-all"
                >
                    Back to Home
                </button>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#F8F8F7] flex overflow-hidden relative">

            {/* ── Mobile Sidebar Overlay ─────────────────────────── */}
            {sideOpen && (
                <div
                    className="fixed inset-0 z-[60] bg-slate-900/40 backdrop-blur-sm lg:hidden transition-all duration-300"
                    onClick={() => setSideOpen(false)}
                />
            )}

            {/* ── Founder Sidebar ───────────────────────────────── */}
            <div className={`
                fixed inset-y-0 left-0 z-[70] transition-all duration-500 cubic-bezier(0.4, 0, 0.2, 1)
                lg:sticky lg:top-0 lg:h-screen lg:translate-x-0 lg:flex lg:shrink-0
                ${sideOpen ? 'translate-x-0' : '-translate-x-full'}
            `}>
                <FounderSidebar onClose={() => setSideOpen(false)} />
            </div>

            {/* ── Main Content Area ─────────────────────────────── */}
            <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">

                {/* ── Executive Top Bar ────────────────────────────── */}
                <header className="h-16 lg:h-20 bg-white/60 backdrop-blur-lg border-b border-orange-100/50 flex items-center justify-between px-4 lg:px-10 shrink-0 z-40">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => setSideOpen(true)}
                            className="lg:hidden p-2 rounded-xl bg-orange-50 text-orange-600 hover:bg-orange-100 transition-colors"
                        >
                            <Menu size={20} />
                        </button>
                        <div>
                            <p className="hidden lg:block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1">Founder Master Control</p>
                            <h2 className="text-sm lg:text-xl font-black text-slate-800 tracking-tight flex items-center gap-2">
                                <span className="lg:hidden">Master Panel</span>
                                <span className="hidden lg:inline text-orange-500">CloudBass</span>
                                <span className="inline-flex items-center gap-1.5 px-2 py-0.5 bg-emerald-50 text-emerald-600 text-[8px] lg:text-[10px] rounded-full border border-emerald-100">
                                    <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
                                    LIVE
                                </span>
                            </h2>
                        </div>
                    </div>

                    <div className="flex items-center gap-3 lg:gap-6">
                        <div className="hidden lg:flex flex-col items-end">
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Platform Status</p>
                            <p className="text-sm font-black text-emerald-500 flex items-center gap-1.5">
                                <Activity size={14} /> All Systems Operational
                            </p>
                        </div>

                        <div className="w-8 h-8 lg:w-10 lg:h-10 rounded-xl lg:rounded-2xl bg-slate-900 flex items-center justify-center text-orange-400 shadow-lg">
                            <ShieldCheck size={18} />
                        </div>
                    </div>
                </header>

                {/* ── Floating Badge (Founder Mode) ────────────────── */}
                <div className="lg:hidden fixed bottom-24 right-6 z-50 animate-bounce">
                    <div className="bg-slate-900 text-orange-400 px-4 py-2 rounded-full shadow-2xl border border-orange-400/20 flex items-center gap-2 font-black text-[10px] uppercase tracking-widest pointer-events-none ring-4 ring-orange-500/10">
                        <ShieldCheck size={12} /> Master Mode
                    </div>
                </div>

                {/* ── Scrollable Content Area ──────────────────────── */}
                <main className="flex-1 overflow-y-auto custom-scrollbar p-4 lg:p-10">
                    <div className="max-w-[1400px] mx-auto pb-20 lg:pb-0">
                        {children}
                    </div>
                </main>

                {/* ── Founder Bottom Navigation (Mobile) ───────────── */}
                <FounderBottomNav onMenuClick={() => setSideOpen(true)} />
            </div>
        </div>
    );
}
