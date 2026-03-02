// =============================================================
//  Page: Expenses (Local State Version)
//  File : client/src/pages/Expenses.jsx
// =============================================================

import { useState } from 'react';
import { IndianRupee, Plus, Wrench, Lightbulb, Receipt, Trash2, Calendar } from 'lucide-react';

const INITIAL_EXPENSES = [
    { id: 1, desc: 'Bathroom Leak Fixing', cat: 'Maintenance', amount: 1500, date: '2026-03-01' },
    { id: 2, desc: 'Common Area Lights', cat: 'Electric', amount: 450, date: '2026-02-28' },
];

export default function Expenses() {
    const [expenses, setExpenses] = useState(INITIAL_EXPENSES);
    const [form, setForm] = useState({ desc: '', cat: 'Maintenance', amount: '' });

    const handleAdd = (e) => {
        e.preventDefault();
        const newEx = {
            ...form,
            id: Date.now(),
            date: new Date().toISOString().split('T')[0],
            amount: parseFloat(form.amount)
        };
        setExpenses([newEx, ...expenses]);
        setForm({ desc: '', cat: 'Maintenance', amount: '' });
    };

    const removeExpense = (id) => {
        setExpenses(expenses.filter(e => e.id !== id));
    };

    const total = expenses.reduce((acc, curr) => acc + curr.amount, 0);

    return (
        <div className="space-y-6 pb-24">
            {/* Header */}
            <header className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-extrabold text-slate-800 tracking-tight">Expenses</h1>
                    <p className="text-sm text-slate-400">Total spent: ₹{total.toLocaleString('en-IN')}</p>
                </div>
                <div className="w-12 h-12 bg-red-50 rounded-2xl flex items-center justify-center text-red-500">
                    <Receipt size={24} />
                </div>
            </header>

            {/* Quick Form */}
            <div className="bg-white p-6 rounded-3xl border border-orange-50 shadow-sm">
                <h3 className="text-sm font-black text-slate-800 uppercase tracking-widest mb-4">Log New Cost</h3>
                <form onSubmit={handleAdd} className="space-y-4">
                    <div className="space-y-1.5">
                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider ml-1">Description</label>
                        <input
                            required
                            className="w-full px-4 py-3 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-orange-500 transition-all font-semibold"
                            placeholder="e.g. Electrician, Plumbing"
                            value={form.desc}
                            onChange={(e) => setForm({ ...form, desc: e.target.value })}
                        />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider ml-1">Category</label>
                            <select
                                className="w-full px-4 py-3 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-orange-500 transition-all font-semibold appearance-none"
                                value={form.cat}
                                onChange={(e) => setForm({ ...form, cat: e.target.value })}
                            >
                                <option>Maintenance</option>
                                <option>Utility</option>
                                <option>Electric</option>
                                <option>Other</option>
                            </select>
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider ml-1">Amount (₹)</label>
                            <input
                                required
                                type="number"
                                className="w-full px-4 py-3 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-orange-500 transition-all font-black"
                                placeholder="0.00"
                                value={form.amount}
                                onChange={(e) => setForm({ ...form, amount: e.target.value })}
                            />
                        </div>
                    </div>
                    <button
                        type="submit"
                        className="w-full py-4 bg-slate-800 text-white font-black rounded-2xl shadow-xl hover:bg-slate-900 transition-all active:scale-[0.98] flex items-center justify-center gap-2"
                    >
                        <Plus size={18} strokeWidth={3} /> Record Expense
                    </button>
                </form>
            </div>

            {/* History List */}
            <div className="space-y-3">
                <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest pl-1 mb-2">Recent History</h3>
                {expenses.map(ex => (
                    <div key={ex.id} className="bg-white p-4 rounded-3xl border border-orange-50 flex items-center justify-between group">
                        <div className="flex items-center gap-4">
                            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${ex.cat === 'Maintenance' ? 'bg-blue-50 text-blue-500' :
                                    ex.cat === 'Electric' ? 'bg-yellow-50 text-yellow-500' : 'bg-orange-50 text-orange-500'
                                }`}>
                                {ex.cat === 'Maintenance' ? <Wrench size={20} /> :
                                    ex.cat === 'Electric' ? <Lightbulb size={20} /> : <Receipt size={20} />}
                            </div>
                            <div>
                                <h4 className="font-bold text-slate-800 text-sm leading-tight">{ex.desc}</h4>
                                <div className="flex items-center gap-2 mt-1">
                                    <span className="text-[10px] bg-slate-100 text-slate-500 px-2 py-0.5 rounded-full font-bold uppercase">{ex.cat}</span>
                                    <span className="text-[10px] text-slate-400 flex items-center gap-1 font-semibold">
                                        <Calendar size={10} /> {ex.date}
                                    </span>
                                </div>
                            </div>
                        </div>
                        <div className="flex items-center gap-4">
                            <p className="font-black text-slate-800">₹{ex.amount.toLocaleString('en-IN')}</p>
                            <button
                                onClick={() => removeExpense(ex.id)}
                                className="p-2 text-slate-200 hover:text-red-500 transition-colors"
                            >
                                <Trash2 size={16} />
                            </button>
                        </div>
                    </div>
                ))}

                {expenses.length === 0 && (
                    <div className="text-center py-12 bg-white rounded-3xl border border-dashed border-slate-200">
                        <p className="text-slate-400 font-medium">No expenses logged yet</p>
                    </div>
                )}
            </div>
        </div>
    );
}
