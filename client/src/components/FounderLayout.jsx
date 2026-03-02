import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import FounderSidebar from './FounderSidebar';
import FounderBottomNav from './FounderBottomNav';
import { ShieldCheck, Activity, Menu, ChevronDown, User, LogOut, Bell, Search } from 'lucide-react';
import toast from 'react-hot-toast';

export default function FounderLayout() {
    const { landlord, isAuth, logout } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const [sideOpen, setSideOpen] = useState(false);
    const [profileOpen, setProfileOpen] = useState(false);

    // Compute authorization directly to avoid "white screen" flashes
    const isAuthorized = isAuth && landlord?.role === 'founder';

    const handleLogout = () => {
        logout();
        navigate('/login');
        toast.success('Founder Session Terminated');
    };

    // Page Title Mapping
    const PAGE_TITLES = {
        '/master-control': 'Dashboard',
        '/master-control/analytics': 'Analytics',
        '/master-control/owners': 'Owners',
        '/master-control/onboard': 'Onboarding',
        '/master-control/referrals': 'Referrals',
        '/master-control/templates': 'Templates',
        '/master-control/tool-stats': 'Tool Stats',
        '/master-control/checklist': 'Checklist',
        '/master-control/settings': 'Settings',
    };
    const currentTitle = PAGE_TITLES[location.pathname] || 'Dashboard';


    // Stealth Mode: If not authorized, return "404" behavior or redirect
    if (!isAuthorized) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center bg-[#F8F8F7]">
                <h1 className="text-4xl font-black text-slate-800 mb-4">404</h1>
                <p className="text-slate-500 font-bold mb-8">Oops! The page you're looking for doesn't exist.</p>
                <button
                    onClick={() => navigate(isAuth ? '/dashboard' : '/login')}
                    className="bg-orange-500 text-white px-8 py-4 rounded-2xl font-black text-sm shadow-xl shadow-orange-100 hover:scale-105 transition-all"
                >
                    {isAuth ? 'Go to My Dashboard' : 'Back to Login'}
                </button>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#F8F8F7] flex flex-col relative" onClick={() => profileOpen && setProfileOpen(false)}>

            {/* ── Mobile Sidebar Overlay ─────────────────────────── */}
            {sideOpen && (
                <div
                    className="fixed inset-0 z-[60] bg-slate-900/40 backdrop-blur-sm lg:hidden transition-all duration-300"
                    onClick={() => setSideOpen(false)}
                />
            )}

            <div className="flex flex-1 flex-col lg:flex-row relative">
                {/* ── Founder Sidebar ───────────────────────────────── */}
                <div className={`
                    fixed inset-y-0 left-0 z-[70] transition-all duration-500 cubic-bezier(0.4, 0, 0.2, 1)
                    lg:relative lg:inset-0 lg:translate-x-0 lg:flex lg:shrink-0
                    ${sideOpen ? 'translate-x-0' : '-translate-x-full'}
                `}>
                    <FounderSidebar onClose={() => setSideOpen(false)} />
                </div>

                {/* ── Main Content Area ─────────────────────────────── */}
                <div className="flex-1 flex flex-col min-w-0 min-h-screen">

                    {/* ── Executive Top Bar ────────────────────────────── */}
                    <header className="h-16 lg:h-20 bg-white border-b border-orange-100 flex items-center justify-between px-4 lg:px-10 shrink-0 z-40">
                        <div className="flex items-center gap-4">
                            <button
                                onClick={(e) => { e.stopPropagation(); setSideOpen(true); }}
                                className="lg:hidden p-2 rounded-xl bg-orange-50 text-orange-600 hover:bg-orange-100 transition-colors"
                            >
                                <Menu size={20} />
                            </button>
                            <div>
                                <h1 className="text-xl font-black text-slate-800 tracking-tight">
                                    {currentTitle}
                                </h1>
                            </div>
                        </div>

                        {/* Search Bar (Central) */}
                        <div className="hidden md:block flex-1 max-w-md mx-8">
                            <div className="relative group">
                                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-orange-500 transition-colors" size={18} />
                                <input
                                    type="text"
                                    placeholder="Search platform, owners, or tools..."
                                    className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-2.5 pl-12 pr-4 text-sm font-bold text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-500/10 focus:border-orange-400 focus:bg-white transition-all"
                                />
                            </div>
                        </div>

                        {/* ── Profile & Notifications ─────────────────────── */}
                        <div className="flex items-center gap-4 lg:gap-6">
                            {/* Notification Bell */}
                            <button className="relative p-2 rounded-xl hover:bg-slate-50 transition-colors text-slate-500">
                                <Bell size={22} />
                                <span className="absolute top-2 right-2 w-2 h-2 bg-orange-500 rounded-full border-2 border-white animate-pulse" />
                            </button>

                            {/* Pill Profile Dropdown */}
                            <div className="relative">
                                <button
                                    onClick={(e) => { e.stopPropagation(); setProfileOpen(!profileOpen); }}
                                    className="flex items-center gap-3 p-1 pr-4 rounded-full bg-white border border-slate-100 hover:border-orange-200 hover:shadow-lg transition-all active:scale-95"
                                >
                                    <div className="w-8 h-8 lg:w-9 lg:h-9 rounded-full bg-gradient-to-tr from-orange-400 to-orange-600 flex items-center justify-center text-white text-xs lg:text-sm font-black shadow-lg shadow-orange-100">
                                        {landlord?.full_name?.charAt(0) || 'F'}
                                    </div>
                                    <span className="text-sm font-black text-slate-700 hidden sm:inline">
                                        {landlord?.full_name?.split(' ')[0] || 'Founder'}
                                    </span>
                                    <ChevronDown size={14} className={`text-slate-400 transition-transform duration-300 ${profileOpen ? 'rotate-180' : ''}`} />
                                </button>

                                {profileOpen && (
                                    <div className="absolute right-0 mt-3 w-64 bg-white rounded-3xl border border-orange-100 shadow-2xl p-2 z-[100] animate-in fade-in slide-in-from-top-2 duration-300">
                                        <div className="px-4 py-4 border-b border-slate-50 mb-2">
                                            <p className="text-sm font-black text-slate-800">{landlord?.full_name || 'Cloud Bass Founder'}</p>
                                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">{landlord?.email}</p>
                                        </div>

                                        <button
                                            onClick={() => navigate('/master-control/settings')}
                                            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold text-slate-600 hover:bg-orange-50 hover:text-orange-600 transition-all"
                                        >
                                            <User size={16} />
                                            <span>Command Settings</span>
                                        </button>

                                        <div className="h-px bg-slate-50 my-2" />

                                        <button
                                            onClick={handleLogout}
                                            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold text-red-500 hover:bg-red-50 transition-all"
                                        >
                                            <LogOut size={16} />
                                            <span>Sign Out</span>
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    </header>

                    {/* ── Content Area (Unified Roll) ──────────────────────── */}
                    <main className="p-4 lg:p-10">
                        <div className="max-w-[1400px] mx-auto pb-24">
                            <Outlet />
                        </div>
                    </main>

                    {/* ── Founder Bottom Navigation (Mobile) ───────────── */}
                    <FounderBottomNav onMenuClick={() => setSideOpen(true)} />
                </div>
            </div>
        </div>
    );
}
