// =============================================================
//  Cloud Bass Rent Management — Unified Professional Sidebar
//  File : client/src/components/Sidebar.jsx
// =============================================================

import { NavLink, useNavigate } from 'react-router-dom';
import {
    LayoutDashboard, Building2, Users, IndianRupee,
    BookOpen, BarChart3, Wrench, MessageSquare,
    Settings, LogOut, X, ChevronRight, UserCircle,
    Gift, Scale, ShieldCheck
} from 'lucide-react';
import { useAuth } from '../context/AuthContext.jsx';
import toast from 'react-hot-toast';

const NAV_ITEMS = [
    {
        title: 'Core Management',
        links: [
            { path: '/dashboard', label: 'Home', icon: LayoutDashboard },
            { path: '/properties', label: 'Properties', icon: Building2 },
            { path: '/tenants', label: 'Tenants', icon: Users },
            { path: '/payments', label: 'Payments', icon: IndianRupee },
        ]
    },
    {
        title: 'Operations',
        links: [
            { path: '/expenses', label: 'Expenses', icon: IndianRupee },
            { path: '/maintenance', label: 'Maintenance', icon: Wrench },
            { path: '/broadcast', label: 'Broadcast', icon: MessageSquare },
        ]
    },
    {
        title: 'Growth & Legal',
        links: [
            { path: '/refer-earn', label: 'Refer & Earn', icon: Gift },
            { path: '/tools', label: 'Legal Hub', icon: Scale },
        ]
    },
    {
        title: 'Reports',
        links: [
            { path: '/income-stats', label: 'Income Stats', icon: BarChart3 },
        ]
    },
    {
        title: 'System Owner',
        links: [
            { path: '/settings', label: 'Settings', icon: Settings },
        ]
    }
];

export default function Sidebar({ onClose }) {
    const { landlord, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        toast.success('Signed out successfully');
        navigate('/login');
    };

    return (
        <aside className="flex flex-col w-64 bg-[#F8F8F7] border-r border-orange-100 shrink-0 z-50">

            {/* ── Brand Identity ───────────────────────────────────── */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-orange-100 shrink-0">
                <NavLink to="/dashboard" className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-orange-600 rounded-2xl flex items-center justify-center shadow-lg shadow-orange-100">
                        <Building2 size={20} className="text-white" />
                    </div>
                    <span className="font-black text-slate-800 text-xl tracking-tighter">
                        Cloud<span className="text-orange-500">Bass</span>
                    </span>
                </NavLink>
                {/* Mobile Close Button */}
                {onClose && (
                    <button onClick={onClose} className="lg:hidden p-2 rounded-xl hover:bg-orange-50 transition-colors">
                        <X size={20} className="text-slate-500" />
                    </button>
                )}
            </div>

            {/* ── Navigable Links ─────────────────────────────────── */}
            <nav className="flex-1 px-4 py-2">
                <div className="space-y-4">
                    {NAV_ITEMS.map((section) => (
                        <div key={section.title} className="space-y-1.5">
                            <h3 className="px-4 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
                                {section.title}
                            </h3>
                            <div className="space-y-1">
                                {section.links.map((link) => (
                                    <NavLink
                                        key={link.path}
                                        to={link.path}
                                        onClick={onClose}
                                        className={({ isActive }) => `
                                            group flex items-center gap-3.5 px-4 py-3.5 rounded-2xl font-bold text-sm transition-all duration-300
                                            ${isActive
                                                ? 'bg-orange-500 text-white shadow-xl shadow-orange-100 translate-x-1'
                                                : 'text-slate-500 hover:bg-orange-50 hover:text-orange-600'
                                            }
                                        `}
                                    >
                                        {({ isActive }) => (
                                            <>
                                                <link.icon
                                                    size={19}
                                                    strokeWidth={isActive ? 2.5 : 2}
                                                    className={isActive ? 'text-white' : 'text-slate-400 group-hover:text-orange-500 transition-colors'}
                                                />
                                                <span className="flex-1">{link.label}</span>
                                                {isActive && <ChevronRight size={14} className="text-white/60 animate-pulse" />}
                                            </>
                                        )}
                                    </NavLink>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </nav>

            {/* ── Landlord Account Panel ──────────────────────────── */}
            <div className="p-4 border-t border-orange-100 bg-white/40 backdrop-blur-md">

                <div className="bg-white rounded-3xl p-4 shadow-sm border border-orange-50 space-y-4">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-tr from-slate-100 to-slate-200 rounded-full flex items-center justify-center text-slate-600">
                            <UserCircle size={22} />
                        </div>
                        <div className="min-w-0">
                            <p className="text-sm font-black text-slate-800 truncate leading-none mb-1">
                                {landlord?.full_name || 'Landlord Admin'}
                            </p>
                            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">
                                System Admin
                            </p>
                        </div>
                    </div>

                    <button
                        onClick={handleLogout}
                        className="w-full flex items-center justify-center gap-2 py-3 rounded-2xl text-[13px] font-black text-red-500 bg-red-50/50 hover:bg-red-500 hover:text-white transition-all duration-300 active:scale-95"
                    >
                        <LogOut size={16} strokeWidth={3} />
                        <span>Sign Out</span>
                    </button>
                </div>
            </div>

        </aside>
    );
}
