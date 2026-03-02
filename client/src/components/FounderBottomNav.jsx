// =============================================================
//  Cloud Bass Rent Management — Founder Mobile Bottom Navigation
//  File : client/src/components/FounderBottomNav.jsx
// =============================================================

import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Users, UserPlus, BarChart3, Menu } from 'lucide-react';

const FOUNDER_TABS = [
    { path: '/master-control', label: 'Home', icon: LayoutDashboard },
    { path: '/master-control/owners', label: 'Owners', icon: Users },
    { path: '/master-control/onboard', label: 'Onboard', icon: UserPlus },
    { path: '/master-control/analytics', label: 'Stats', icon: BarChart3 },
];

export default function FounderBottomNav({ onMenuClick }) {
    const { pathname } = useLocation();

    return (
        <nav
            className="fixed bottom-0 left-0 right-0 z-50 lg:hidden
                 bg-slate-900 border-t border-slate-800
                 shadow-[0_-8px_32px_rgba(0,0,0,0.3)]
                 rounded-t-[2rem] lg:rounded-none"
            style={{ paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}
        >
            <div className="flex items-stretch h-16 pt-1">
                {FOUNDER_TABS.map(({ path, label, icon: Icon }) => {
                    const active = pathname === path;

                    return (
                        <Link
                            key={path}
                            to={path}
                            className={`
                                flex-1 flex flex-col items-center justify-center gap-0.5
                                text-[8px] font-black uppercase tracking-widest select-none
                                transition-all duration-300 active:scale-90
                                ${active ? 'text-orange-400' : 'text-slate-500'}
                            `}
                        >
                            <span className={`
                                relative flex items-center justify-center
                                w-10 h-6 transition-all duration-300
                            `}>
                                <Icon
                                    size={18}
                                    strokeWidth={active ? 3 : 2}
                                    className={`transition-colors duration-200 ${active ? 'text-orange-400 drop-shadow-[0_0_8px_rgba(251,146,60,0.4)]' : 'text-slate-600'
                                        }`}
                                />
                                {/* Minimal active indicator */}
                                {active && (
                                    <span className="absolute -top-0.5 -right-0.5 w-1.5 h-1.5 bg-orange-500 rounded-full shadow-[0_0_8px_rgba(249,115,22,0.8)] animate-pulse" />
                                )}
                            </span>
                            <span className="mt-0.5">{label}</span>
                        </Link>
                    );
                })}

                {/* Sidebar menu trigger */}
                <button
                    onClick={onMenuClick}
                    className="flex-1 flex flex-col items-center justify-center gap-0.5 text-[8px] font-black uppercase tracking-widest select-none text-slate-500 transition-all active:scale-90"
                >
                    <span className="relative flex items-center justify-center w-10 h-6">
                        <Menu size={18} strokeWidth={2} className="text-slate-600" />
                    </span>
                    <span className="mt-0.5">Menu</span>
                </button>
            </div>
        </nav>
    );
}
