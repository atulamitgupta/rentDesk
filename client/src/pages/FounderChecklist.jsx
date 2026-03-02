// =============================================================
//  Cloud Bass Rent Management — Founder Checklist
//  File : client/src/pages/FounderChecklist.jsx
// =============================================================

import React, { useState, useEffect } from 'react';
import {
    ShieldCheck, Lock, Smartphone, FileText,
    MessageSquare, Search, Zap, Gift,
    UserPlus, Scale, CheckCircle2
} from 'lucide-react';
import toast from 'react-hot-toast';

const CHECKLIST_DATA = [
    {
        category: 'Security & Access Check',
        items: [
            { id: 'middleware', label: 'Middleware Lock: Confirm only founder email can access /master-control' },
            { id: 'isolation', label: "Data Isolation: Verify regular Owners cannot see other owners' data via API" },
            { id: 'mobile_res', label: "Mobile Restriction: Ensure Founder view shows 'Quick Actions' on mobile" }
        ]
    },
    {
        category: 'Core Product Readiness',
        items: [
            { id: 'pdf_gen', label: 'PDF Generator: Test if Rent Agreement PDF correctly fills tenant data' },
            { id: 'whatsapp', label: "WhatsApp API: Verify 'Rent Reminders' and 'Onboarding Links' delivery" },
            { id: 'seo', label: 'Tool SEO: Check all 7 legal tool pages have meta-descriptions' }
        ]
    },
    {
        category: 'Growth & Referral Loop',
        items: [
            { id: 'referral_trig', label: 'Referral Trigger: Founder portal notification on new owner signup' },
            { id: 'reward_logic', label: "Reward Logic: 'Approve' button updates owner status to 'Premium'" }
        ]
    },
    {
        category: 'Business Operations',
        items: [
            { id: 'onboarding', label: "Owner Onboarding: 'Add New Owner' form creates clean empty dashboard" },
            { id: 'templates', label: 'Master Templates: Successfully edit global Rent Agreement text' }
        ]
    }
];

export default function FounderChecklist() {
    const [checkedItems, setCheckedItems] = useState(() => {
        const saved = localStorage.getItem('founder_checklist');
        return saved ? JSON.parse(saved) : {};
    });

    useEffect(() => {
        localStorage.setItem('founder_checklist', JSON.stringify(checkedItems));
    }, [checkedItems]);

    const totalItems = CHECKLIST_DATA.reduce((acc, cat) => acc + cat.items.length, 0);
    const completedItems = Object.values(checkedItems).filter(v => v).length;
    const progress = Math.round((completedItems / totalItems) * 100);

    const toggleItem = (id) => {
        setCheckedItems(prev => ({ ...prev, [id]: !prev[id] }));
        if (!checkedItems[id]) {
            toast.success('Task marked as ready!');
        }
    };

    return (
        <div className="max-w-4xl mx-auto space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-10">
            {/* Header & Progress */}
            <div className="bg-white p-8 lg:p-10 rounded-[3rem] border border-orange-50 shadow-sm space-y-6">
                <div className="flex items-center justify-between gap-4">
                    <div>
                        <h2 className="text-2xl lg:text-3xl font-black text-slate-800 tracking-tight">Platform Readiness</h2>
                        <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px] mt-2">Executive Launch Checklist</p>
                    </div>
                    <div className="text-right">
                        <span className="text-3xl font-black text-orange-500">{progress}%</span>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Complete</p>
                    </div>
                </div>

                <div className="h-4 w-full bg-slate-100 rounded-full overflow-hidden border border-slate-50">
                    <div
                        className="h-full bg-gradient-to-r from-orange-400 to-orange-600 transition-all duration-1000 ease-out shadow-[0_0_15px_rgba(249,115,22,0.3)]"
                        style={{ width: `${progress}%` }}
                    />
                </div>
            </div>

            {/* Checklist Sections */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-10">
                {CHECKLIST_DATA.map((section, idx) => (
                    <div key={idx} className="space-y-6">
                        <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] px-2 flex items-center gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-orange-500" />
                            {section.category}
                        </h3>
                        <div className="bg-white rounded-[2.5rem] border border-orange-50 shadow-sm overflow-hidden">
                            <div className="divide-y divide-slate-50">
                                {section.items.map(item => (
                                    <label
                                        key={item.id}
                                        className="flex items-start gap-4 p-6 cursor-pointer hover:bg-orange-50/30 transition-all group"
                                    >
                                        <div className="relative mt-0.5">
                                            <input
                                                type="checkbox"
                                                checked={!!checkedItems[item.id]}
                                                onChange={() => toggleItem(item.id)}
                                                className="peer absolute opacity-0 w-6 h-6 cursor-pointer"
                                            />
                                            <div className="w-6 h-6 border-2 border-slate-200 rounded-lg bg-white transition-all peer-checked:bg-orange-500 peer-checked:border-orange-500 flex items-center justify-center">
                                                <CheckCircle2 size={14} className="text-white opacity-0 peer-checked:opacity-100 transition-opacity" strokeWidth={3} />
                                            </div>
                                        </div>
                                        <span className={`text-sm font-bold transition-all ${checkedItems[item.id] ? 'text-slate-400 line-through' : 'text-slate-700'}`}>
                                            {item.label}
                                        </span>
                                    </label>
                                ))}
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Footer Notice */}
            <div className="bg-slate-900 p-8 rounded-[2.5rem] text-center space-y-4">
                <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center mx-auto text-orange-400">
                    <ShieldCheck size={24} />
                </div>
                <h4 className="text-white font-black text-sm uppercase tracking-widest">Global Status</h4>
                <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest max-w-xs mx-auto leading-loose">
                    This checklist synchronizes with the production deployment log. 100% completion unlocks the 'Self-Onboarding' portal.
                </p>
            </div>
        </div>
    );
}
