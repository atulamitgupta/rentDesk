// =============================================================
//  Cloud Bass Rent Management — Mobile Bottom Navigation
//  File : client/src/components/BottomNav.jsx
//
//  Rules:
//    • fixed bottom-0 left-0 right-0 — always pinned to viewport
//    • md:hidden — disappears on desktop (sidebar takes over)
//    • Safe-area padding for iPhone notched screens (env(safe-area-inset-bottom))
//    • Orange active state, slate-400 inactive
//    • Animated scale + colour transition on tap
// =============================================================

import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Building2, IndianRupee, Users, Menu } from 'lucide-react';

const TABS = [
    { path: '/dashboard', label: 'Home', icon: LayoutDashboard },
    { path: '/properties', label: 'Properties', icon: Building2 },
    { path: '/tenants', label: 'Tenants', icon: Users },
    { path: '/rent-ledger', label: 'Payments', icon: IndianRupee },
];

export default function BottomNav({ onMenuClick }) {
    const { pathname } = useLocation();

    return (
        /*
          Key layout classes explained:
            fixed bottom-0 left-0 right-0   → pins to viewport bottom edge
            md:hidden                        → hides on md (≥768px) and above
            z-50                             → floats above all page content
            pb-safe                          → respects iPhone home-bar safe area
        */
        <nav
            className="fixed bottom-0 left-0 right-0 z-50 md:hidden
                 bg-white border-t border-slate-100
                 shadow-[0_-4px_24px_rgba(0,0,0,0.06)]"
            style={{ paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}
        >
            <div className="flex items-stretch h-16">
                {TABS.map(({ path, label, icon: Icon }) => {
                    const active = pathname === path;

                    return (
                        <Link
                            key={path}
                            to={path}
                            className={`
                flex-1 flex flex-col items-center justify-center gap-0.5
                text-[10px] font-semibold tracking-wide select-none
                transition-all duration-150 active:scale-90
                ${active ? 'text-orange-500' : 'text-slate-400'}
              `}
                        >
                            {/* Icon wrapper — orange pill background when active */}
                            <span className={`
                relative flex items-center justify-center
                w-10 h-6 rounded-full transition-all duration-200
                ${active ? 'bg-orange-50' : ''}
              `}>
                                <Icon
                                    size={20}
                                    strokeWidth={active ? 2.5 : 1.8}
                                    className={`transition-colors duration-150 ${active ? 'text-orange-500' : 'text-slate-400'
                                        }`}
                                />
                                {/* Active dot indicator */}
                                {active && (
                                    <span className="absolute -top-1 right-1.5 w-1.5 h-1.5 bg-orange-500 rounded-full" />
                                )}
                            </span>

                            {/* Label */}
                            <span className={active ? 'text-orange-500' : 'text-slate-400'}>
                                {label}
                            </span>
                        </Link>
                    );
                })}

                {/* More Menu Toggle — for comfort access */}
                <button
                    onClick={onMenuClick}
                    className="flex-1 flex flex-col items-center justify-center gap-0.5 text-[10px] font-semibold tracking-wide select-none text-slate-400 transition-all active:scale-90"
                >
                    <span className="relative flex items-center justify-center w-10 h-6">
                        <Menu size={20} strokeWidth={1.8} />
                    </span>
                    <span>More</span>
                </button>
            </div>
        </nav>
    );
}
