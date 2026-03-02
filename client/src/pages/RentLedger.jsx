// =============================================================
//  Page: Rent Ledger (Local State Version)
//  File : client/src/pages/RentLedger.jsx
// =============================================================

import { useState } from 'react';
import { BookOpen, IndianRupee, CheckCircle2, Clock, AlertCircle, ShoppingBag } from 'lucide-react';

const INITIAL_DATA = [
    { id: 1, tenant: 'Priya Sharma', room: '101', rent: 12000, status: 'PAID' },
    { id: 2, tenant: 'Rahul Verma', room: '204', rent: 8500, status: 'PENDING' },
    { id: 3, tenant: 'Surbhi Gupta', room: '302', rent: 15000, status: 'PARTIAL' },
];

export default function RentLedger() {
    const [payments, setPayments] = useState(INITIAL_DATA);

    const toggleStatus = (id) => {
        setPayments(prev => prev.map(p => {
            if (p.id !== id) return p;
            const cycle = ['PENDING', 'PARTIAL', 'PAID'];
            const next = cycle[(cycle.indexOf(p.status) + 1) % cycle.length];
            return { ...p, status: next };
        }));
    };

    const total = payments.reduce((acc, curr) => acc + curr.rent, 0);
    const collected = payments.filter(p => p.status === 'PAID').reduce((acc, curr) => acc + curr.rent, 0);

    return (
        <div className="space-y-6 pb-24">
            {/* Header */}
            <header className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-extrabold text-slate-800 tracking-tight">Rent Ledger</h1>
                    <p className="text-sm text-slate-400">Monthly collection tracking</p>
                </div>
                <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600">
                    <BookOpen size={24} />
                </div>
            </header>

            {/* Summary Stats */}
            <div className="grid grid-cols-2 gap-4">
                <div className="bg-white p-5 rounded-3xl border border-orange-100 shadow-sm">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Total Target</p>
                    <p className="text-xl font-black text-slate-800">₹{total.toLocaleString('en-IN')}</p>
                </div>
                <div className="bg-orange-500 p-5 rounded-3xl shadow-lg shadow-orange-100">
                    <p className="text-[10px] font-bold text-white/70 uppercase tracking-wider mb-1">Collected</p>
                    <p className="text-xl font-black text-white">₹{collected.toLocaleString('en-IN')}</p>
                </div>
            </div>

            {/* Table Header (Mobile Friendly Icons) */}
            <div className="bg-white rounded-3xl border border-orange-50 shadow-sm overflow-hidden overflow-x-auto no-scrollbar">
                <table className="w-full text-left border-collapse min-w-[320px]">
                    <thead>
                        <tr className="bg-slate-50 border-b border-slate-100">
                            <th className="p-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Tenant</th>
                            <th className="p-4 text-xs font-bold text-slate-400 uppercase tracking-wider text-right">Rent</th>
                            <th className="p-4 text-xs font-bold text-slate-400 uppercase tracking-wider text-center">Status</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                        {payments.map(payment => (
                            <tr key={payment.id} className="group hover:bg-orange-50/30 transition-all">
                                <td className="p-4">
                                    <p className="font-bold text-slate-800 text-sm">{payment.tenant}</p>
                                    <p className="text-[11px] text-slate-400 font-semibold tracking-wide">ROOM {payment.room}</p>
                                </td>
                                <td className="p-4 text-right">
                                    <p className="font-black text-slate-800 text-sm">₹{payment.rent.toLocaleString('en-IN')}</p>
                                </td>
                                <td className="p-4 flex items-center justify-center">
                                    <button
                                        onClick={() => toggleStatus(payment.id)}
                                        className={`
                                            px-3 py-1.5 rounded-full text-[10px] font-black tracking-widest uppercase flex items-center gap-1.5 transition-all active:scale-95
                                            ${payment.status === 'PAID' ? 'bg-green-100 text-green-700' : ''}
                                            ${payment.status === 'PENDING' ? 'bg-amber-100 text-amber-700' : ''}
                                            ${payment.status === 'PARTIAL' ? 'bg-blue-100 text-blue-700' : ''}
                                        `}
                                    >
                                        <div className={`w-1.5 h-1.5 rounded-full ${payment.status === 'PAID' ? 'bg-green-500' :
                                                payment.status === 'PENDING' ? 'bg-amber-500' : 'bg-blue-500'
                                            }`} />
                                        {payment.status}
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Bottom Sticky Note */}
            <div className="bg-slate-800 p-4 rounded-3xl flex items-center justify-between text-white shadow-xl">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center">
                        <IndianRupee size={20} className="text-orange-400" />
                    </div>
                    <div>
                        <p className="text-white font-bold text-sm">Overall Balance</p>
                        <p className="text-white/60 text-xs font-semibold">Ready to collect ₹{(total - collected).toLocaleString('en-IN')}</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
