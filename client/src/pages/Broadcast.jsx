// =============================================================
//  Page: Broadcast (Prototype)
//  File : client/src/pages/Broadcast.jsx
// =============================================================

import { useState } from 'react';
import { MessageSquare, Send, Bell, Users, CheckCircle } from 'lucide-react';

export default function Broadcast() {
    const [message, setMessage] = useState('');
    const [history, setHistory] = useState([
        { id: 1, text: 'Rent collection begins tomorrow. Please keep your UPI ready.', date: '2026-03-01', sentTo: 'All Tenants' },
        { id: 2, text: 'Water maintenance in Block A from 2PM to 4PM.', date: '2026-02-25', sentTo: 'Block A' },
    ]);

    const handleSend = (e) => {
        e.preventDefault();
        setHistory([{ id: Date.now(), text: message, date: new Date().toISOString().split('T')[0], sentTo: 'All Tenants' }, ...history]);
        setMessage('');
    };

    return (
        <div className="space-y-6 pb-24">
            <header className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-black text-slate-800 tracking-tight">Broadcast</h1>
                    <p className="text-sm text-slate-400">Reach all tenants via WhatsApp</p>
                </div>
                <div className="w-12 h-12 bg-green-50 rounded-2xl flex items-center justify-center text-green-600">
                    <MessageSquare size={24} />
                </div>
            </header>

            {/* Compose Card */}
            <div className="bg-white p-6 rounded-3xl border border-orange-100 shadow-sm space-y-4">
                <div className="flex items-center gap-3 mb-2">
                    <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center text-orange-600">
                        <Users size={16} />
                    </div>
                    <span className="text-xs font-black text-slate-400 uppercase tracking-[0.15em]">Recipients: All Active Tenants</span>
                </div>

                <textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Type your announcement here..."
                    className="w-full h-32 p-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-orange-500 transition-all font-semibold resize-none"
                />

                <button
                    onClick={handleSend}
                    disabled={!message}
                    className="w-full py-4 bg-orange-600 text-white font-black rounded-2xl shadow-lg shadow-orange-100 flex items-center justify-center gap-3 disabled:opacity-50 transition-all active:scale-95"
                >
                    <Send size={20} strokeWidth={3} />
                    <span>Send Announcement</span>
                </button>
            </div>

            {/* Sent History */}
            <div className="space-y-3">
                <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest pl-1 mb-2">Sent History</h3>
                {history.map(item => (
                    <div key={item.id} className="bg-white p-5 rounded-3xl border border-orange-50 space-y-3">
                        <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-wider text-slate-400">
                            <span className="flex items-center gap-1.5"><Bell size={12} /> {item.sentTo}</span>
                            <span>{item.date}</span>
                        </div>
                        <p className="text-sm font-bold text-slate-800 leading-relaxed">{item.text}</p>
                        <div className="flex items-center gap-1.5 text-emerald-500 font-bold text-[10px] uppercase">
                            <CheckCircle size={10} />
                            <span>Delivered successfully</span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
