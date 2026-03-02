// =============================================================
//  Cloud Bass Rent Management — Executive Founder Sidebar
//  File : client/src/components/FounderSidebar.jsx
// =============================================================

import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
    LayoutDashboard, BarChart3, Users, UserPlus,
    Gift, Scale, Activity, Settings, LogOut,
    ShieldCheck, Building2, ChevronRight, ClipboardCheck
} from 'lucide-react';
import { useAuth } from '../context/AuthContext.jsx';
import toast from 'react-hot-toast';

const FOUNDER_NAV = [
    {
        title: 'Platform Overview',
        links: [
            { path: '/master-control', label: 'Dashboard Home', icon: LayoutDashboard },
            { path: '/master-control/analytics', label: 'Global Analytics', icon: BarChart3 },
        ]
    },
    {
        title: 'Client Management',
        links: [
            { path: '/master-control/owners', label: 'Owner Directory', icon: Users },
            { path: '/master-control/onboard', label: 'Onboard New Owner', icon: UserPlus },
        ]
    },
    {
        title: 'Growth & Legal',
        links: [
            { path: '/master-control/referrals', label: 'Referral Queue', icon: Gift },
            { path: '/master-control/templates', label: 'Master Templates', icon: Scale },
            { path: '/master-control/tool-stats', label: 'Legal Tool Analytics', icon: Activity },
        ]
    },
    {
        title: 'System',
        links: [
            { path: '/master-control/checklist', label: 'Functional Checklist', icon: ClipboardCheck },
            { path: '/master-control/settings', label: 'Configuration', icon: Settings },
        ]
    }
];

export default function FounderSidebar({ onClose }) {
    const navigate = useNavigate();

    return (
        <aside className="flex flex-col w-64 bg-[#F1F1EF] border-r border-orange-100 shrink-0 z-50">

            {/* ── Founder Executive Badge ─────────────────────────── */}
            <div className="px-6 py-8 border-b border-orange-100/50">
                <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 bg-slate-900 rounded-2xl flex items-center justify-center shadow-xl shadow-slate-200">
                        <ShieldCheck size={20} className="text-orange-400" />
                    </div>
                    <span className="font-black text-slate-800 text-xl tracking-tighter">
                        Cloud<span className="text-orange-500">Bass</span>
                    </span>
                </div>

                {/* Founder Mode Gold Badge */}
                <div className="bg-gradient-to-r from-amber-400 to-yellow-600 border border-amber-500/30 px-4 py-2 rounded-xl flex items-center gap-2 shadow-md">
                    <div className="w-2 h-2 bg-white rounded-full animate-pulse shadow-[0_0_8px_white]" />
                    <span className="text-[10px] font-black text-white uppercase tracking-[0.2em]">Founder Mode</span>
                </div>
            </div>

            {/* ── Navigation ─────────────────────────────────────── */}
            <nav className="flex-1 px-4 py-6 space-y-8">
                {FOUNDER_NAV.map((section) => (
                    <div key={section.title} className="space-y-2">
                        <h3 className="px-4 text-[9px] font-black text-slate-400 uppercase tracking-[0.2em]">
                            {section.title}
                        </h3>
                        <div className="space-y-1">
                            {section.links.map((link) => (
                                <NavLink
                                    key={link.path}
                                    to={link.path}
                                    end={link.path === '/master-control'}
                                    onClick={onClose}
                                    className={({ isActive }) => `
                                        group flex items-center gap-3 px-4 py-3 rounded-2xl font-bold text-sm transition-all duration-300
                                        ${isActive
                                            ? 'bg-orange-500 text-white shadow-lg shadow-orange-100 translate-x-1'
                                            : 'text-slate-500 hover:bg-white hover:text-orange-600 hover:shadow-sm'
                                        }
                                    `}
                                >
                                    {({ isActive }) => (
                                        <>
                                            <link.icon
                                                size={18}
                                                strokeWidth={isActive ? 2.5 : 2}
                                                className={isActive ? 'text-white' : 'text-slate-400 group-hover:text-orange-500 transition-colors'}
                                            />
                                            <span className="flex-1 text-[13px]">{link.label}</span>
                                            {isActive && <ChevronRight size={14} className="text-white/60 animate-pulse" />}
                                        </>
                                    )}
                                </NavLink>
                            ))}
                        </div>
                    </div>
                ))}
            </nav>

        </aside>
    );
}
