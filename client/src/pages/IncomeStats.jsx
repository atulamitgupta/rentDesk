// =============================================================
//  Page: Income Stats (Prototype)
//  File : client/src/pages/IncomeStats.jsx
// =============================================================

import { BarChart3, TrendingUp, ArrowUpRight, ArrowDownRight } from 'lucide-react';

export default function IncomeStats() {
    return (
        <div className="space-y-6 pb-24">
            <header className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-black text-slate-800 tracking-tight">Income Stats</h1>
                    <p className="text-sm text-slate-400">Financial health at a glance</p>
                </div>
                <div className="w-12 h-12 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-600">
                    <BarChart3 size={24} />
                </div>
            </header>

            {/* Main P&L Card */}
            <div className="bg-slate-900 p-6 rounded-[2.5rem] text-white shadow-2xl relative overflow-hidden">
                <div className="relative z-10">
                    <p className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] mb-2">Net Profit (Monthly)</p>
                    <div className="flex items-end gap-3 mb-6">
                        <h2 className="text-5xl font-black tracking-tighter">₹48,250</h2>
                        <span className="text-emerald-400 font-black text-sm flex items-center gap-1 mb-2 bg-emerald-400/10 px-2 py-1 rounded-full border border-emerald-400/20">
                            <ArrowUpRight size={14} /> +12%
                        </span>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="bg-white/5 p-4 rounded-3xl border border-white/10">
                            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">Gross Income</p>
                            <p className="text-xl font-black">₹62,000</p>
                        </div>
                        <div className="bg-white/5 p-4 rounded-3xl border border-white/10">
                            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">Total Expenses</p>
                            <p className="text-xl font-black text-orange-400">₹13,750</p>
                        </div>
                    </div>
                </div>
                {/* Visual Accent */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-orange-600/20 blur-[80px] rounded-full" />
                <div className="absolute bottom-4 left-4 w-40 h-1 bg-gradient-to-r from-orange-500 to-transparent rounded-full opacity-50" />
            </div>

            {/* Performance Insights */}
            <div className="space-y-4">
                <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest pl-1">Insights</h3>

                <div className="bg-white p-5 rounded-3xl border border-orange-50 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-emerald-50 rounded-xl flex items-center justify-center text-emerald-600">
                            <TrendingUp size={20} />
                        </div>
                        <div>
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Occupancy</p>
                            <p className="text-sm font-bold text-slate-800">92% Average</p>
                        </div>
                    </div>
                    <ArrowUpRight className="text-emerald-500" size={20} />
                </div>

                <div className="bg-white p-5 rounded-3xl border border-orange-50 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-orange-50 rounded-xl flex items-center justify-center text-orange-600">
                            <ArrowDownRight size={20} />
                        </div>
                        <div>
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Expense Variance</p>
                            <p className="text-sm font-bold text-slate-800">-₹2,400 vs last month</p>
                        </div>
                    </div>
                    <span className="text-[10px] font-black text-emerald-500 uppercase">Saving</span>
                </div>
            </div>
        </div>
    );
}
