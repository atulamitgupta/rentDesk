// =============================================================
//  Page: Maintenance (Prototype)
//  File : client/src/pages/Maintenance.jsx
// =============================================================

import { useState } from 'react';
import { Wrench, Plus, CheckCircle2, Clock, AlertTriangle, X } from 'lucide-react';

const INITIAL_TICKETS = [
    { id: 1, title: 'Water Leakage in Kitchen', room: '101', priority: 'HIGH', status: 'OPEN', date: '2026-03-01' },
    { id: 2, title: 'AC Filter Cleaning', room: '204', priority: 'LOW', status: 'IN_PROGRESS', date: '2026-02-28' },
    { id: 3, title: 'Door Lock Jammed', room: '302', priority: 'MEDIUM', status: 'CLOSED', date: '2026-02-27' },
];

export default function Maintenance() {
    const [tickets, setTickets] = useState(INITIAL_TICKETS);
    const [showModal, setShowModal] = useState(false);
    const [form, setForm] = useState({ title: '', room: '', priority: 'MEDIUM' });

    const handleAdd = (e) => {
        e.preventDefault();
        setTickets([{ ...form, id: Date.now(), status: 'OPEN', date: new Date().toISOString().split('T')[0] }, ...tickets]);
        setShowModal(false);
        setForm({ title: '', room: '', priority: 'MEDIUM' });
    };

    const toggleStatus = (id) => {
        setTickets(prev => prev.map(t => {
            if (t.id !== id) return t;
            const cycle = ['OPEN', 'IN_PROGRESS', 'CLOSED'];
            const next = cycle[(cycle.indexOf(t.status) + 1) % cycle.length];
            return { ...t, status: next };
        }));
    };

    return (
        <div className="space-y-6 pb-24">
            <header className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-black text-slate-800 tracking-tight">Maintenance</h1>
                    <p className="text-sm text-slate-400">{tickets.filter(t => t.status !== 'CLOSED').length} active issues</p>
                </div>
                <div className="w-12 h-12 bg-orange-100 rounded-2xl flex items-center justify-center text-orange-600">
                    <Wrench size={24} />
                </div>
            </header>

            <div className="grid grid-cols-1 gap-4">
                {tickets.map(ticket => (
                    <div key={ticket.id} className="bg-white p-5 rounded-3xl border border-orange-50 shadow-sm space-y-4">
                        <div className="flex items-start justify-between">
                            <div className="space-y-1">
                                <span className={`text-[10px] font-black px-2 py-0.5 rounded-full uppercase tracking-widest ${ticket.priority === 'HIGH' ? 'bg-red-100 text-red-600' :
                                        ticket.priority === 'MEDIUM' ? 'bg-orange-100 text-orange-600' : 'bg-slate-100 text-slate-500'
                                    }`}>
                                    {ticket.priority} Priority
                                </span>
                                <h3 className="font-bold text-slate-800">{ticket.title}</h3>
                                <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Room {ticket.room} · {ticket.date}</p>
                            </div>
                            <button
                                onClick={() => toggleStatus(ticket.id)}
                                className={`px-4 py-2 rounded-2xl text-[10px] font-black uppercase tracking-widest flex items-center gap-2 transition-all active:scale-95 ${ticket.status === 'OPEN' ? 'bg-amber-100 text-amber-700' :
                                        ticket.status === 'IN_PROGRESS' ? 'bg-blue-100 text-blue-700' : 'bg-emerald-100 text-emerald-700'
                                    }`}
                            >
                                {ticket.status === 'OPEN' ? <AlertTriangle size={12} /> :
                                    ticket.status === 'IN_PROGRESS' ? <Clock size={12} /> : <CheckCircle2 size={12} />}
                                {ticket.status.replace('_', ' ')}
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            <button
                onClick={() => setShowModal(true)}
                className="fixed bottom-24 right-6 w-16 h-16 bg-slate-800 text-white rounded-2xl shadow-xl flex items-center justify-center hover:bg-slate-900 active:scale-95 transition-all z-20"
            >
                <Plus size={32} strokeWidth={3} />
            </button>

            {showModal && (
                <div className="fixed inset-0 z-[60] flex items-end sm:items-center justify-center p-4">
                    <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setShowModal(false)} />
                    <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl p-6 animate-in slide-in-from-bottom duration-300">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-xl font-black text-slate-800 flex items-center gap-2">Log Issue</h2>
                            <button onClick={() => setShowModal(false)} className="p-2 hover:bg-slate-100 rounded-xl"><X size={20} className="text-slate-400" /></button>
                        </div>
                        <form onSubmit={handleAdd} className="space-y-4">
                            <div className="space-y-1.5">
                                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Problem Description</label>
                                <input required className="w-full px-4 py-3 bg-slate-50 border-none rounded-2xl font-semibold" placeholder="e.g. Broken Tap" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1.5">
                                    <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Room No</label>
                                    <input required className="w-full px-4 py-3 bg-slate-50 border-none rounded-2xl font-semibold" placeholder="101" value={form.room} onChange={e => setForm({ ...form, room: e.target.value })} />
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Priority</label>
                                    <select className="w-full px-4 py-3 bg-slate-50 border-none rounded-2xl font-semibold appearance-none" value={form.priority} onChange={e => setForm({ ...form, priority: e.target.value })}>
                                        <option>LOW</option>
                                        <option>MEDIUM</option>
                                        <option>HIGH</option>
                                    </select>
                                </div>
                            </div>
                            <button type="submit" className="w-full py-4 bg-orange-500 text-white font-black rounded-2xl mt-4">Create Ticket</button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
