// =============================================================
//  ExpenseForm — Mobile-friendly modal for logging expenses
//  File : client/src/components/ExpenseForm.jsx
//
//  Props:
//    isOpen      : boolean
//    onClose     : () => void
//    onSaved     : (newExpense) => void   ← called after successful save
//    properties  : Array<{ id, name }>   ← for optional property link
// =============================================================

import { useState, useEffect, useRef } from 'react';
import { X, IndianRupee, Loader2, CheckCircle2, Tag, AlignLeft, Building2 } from 'lucide-react';
import { expensesApi } from '../api/index.js';
import toast from 'react-hot-toast';

const CATEGORIES = [
    { value: 'MAINTENANCE', label: '🔧 Maintenance', color: 'bg-blue-100 text-blue-700' },
    { value: 'UTILITY', label: '💡 Utility', color: 'bg-yellow-100 text-yellow-700' },
    { value: 'TAX', label: '🧾 Tax', color: 'bg-red-100 text-red-700' },
    { value: 'INSURANCE', label: '🛡 Insurance', color: 'bg-purple-100 text-purple-700' },
    { value: 'OTHER', label: '📦 Other', color: 'bg-slate-100 text-slate-600' },
];

const EMPTY = { description: '', amount: '', category: 'MAINTENANCE', property_id: '', notes: '' };

export default function ExpenseForm({ isOpen, onClose, onSaved, properties = [] }) {
    const [form, setForm] = useState(EMPTY);
    const [saving, setSaving] = useState(false);
    const [errors, setErrors] = useState({});
    const descRef = useRef(null);

    // Reset & focus on open
    useEffect(() => {
        if (isOpen) {
            setForm(EMPTY);
            setErrors({});
            setTimeout(() => descRef.current?.focus(), 100);
        }
    }, [isOpen]);

    // Close on Escape key
    useEffect(() => {
        const handler = (e) => { if (e.key === 'Escape') onClose(); };
        window.addEventListener('keydown', handler);
        return () => window.removeEventListener('keydown', handler);
    }, [onClose]);

    const set = (k) => (e) => {
        setForm(p => ({ ...p, [k]: e.target.value }));
        if (errors[k]) setErrors(p => ({ ...p, [k]: undefined }));
    };

    const validate = () => {
        const e = {};
        if (!form.description.trim()) e.description = 'Description is required.';
        if (!form.amount || parseFloat(form.amount) <= 0) e.amount = 'Enter a valid amount.';
        return e;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const e2 = validate();
        if (Object.keys(e2).length) { setErrors(e2); return; }

        setSaving(true);
        try {
            const res = await expensesApi.create({
                description: form.description.trim(),
                amount: parseFloat(form.amount),
                category: form.category,
                property_id: form.property_id || undefined,
                notes: form.notes.trim() || undefined,
            });
            toast.success(`Expense recorded: ₹${parseFloat(form.amount).toLocaleString('en-IN')}`);
            onSaved?.(res.data.data);
            onClose();
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to save expense.');
        } finally {
            setSaving(false);
        }
    };

    if (!isOpen) return null;

    const selCat = CATEGORIES.find(c => c.value === form.category);

    return (
        /* Backdrop */
        <div
            className="fixed inset-0 z-50 flex items-end sm:items-center justify-center"
            onClick={(e) => e.target === e.currentTarget && onClose()}
        >
            {/* Dark overlay */}
            <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />

            {/*
        Modal sheet:
          • On mobile: slides up from bottom (rounded top corners, full-width)
          • On desktop: centered card (max-w-md, all corners rounded)
      */}
            <div
                className="relative w-full sm:max-w-md bg-white
                   rounded-t-3xl sm:rounded-3xl
                   shadow-2xl z-10
                   animate-[slideUp_0.25s_ease-out]"
                style={{ maxHeight: '92vh', overflowY: 'auto' }}
            >
                {/* ── Header ─────────────────────────────────────── */}
                <div className="flex items-center justify-between px-5 pt-5 pb-4 border-b border-slate-100">
                    <div className="flex items-center gap-3">
                        <div className="w-9 h-9 bg-orange-100 rounded-xl flex items-center justify-center">
                            <IndianRupee size={18} className="text-orange-500" />
                        </div>
                        <div>
                            <h2 className="font-extrabold text-slate-800 text-base leading-tight">Log Expense</h2>
                            <p className="text-xs text-slate-400">Reduces your net profit</p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 rounded-xl hover:bg-slate-100 transition-colors"
                        aria-label="Close"
                    >
                        <X size={18} className="text-slate-500" />
                    </button>
                </div>

                {/* ── Form body ──────────────────────────────────── */}
                <form onSubmit={handleSubmit} className="px-5 py-5 space-y-5">

                    {/* Description */}
                    <div>
                        <label className="flex items-center gap-1.5 text-sm font-semibold text-slate-700 mb-2">
                            <AlignLeft size={13} className="text-slate-400" /> Description
                        </label>
                        <input
                            ref={descRef}
                            type="text"
                            value={form.description}
                            onChange={set('description')}
                            placeholder="e.g. Plumber repair, Electricity bill"
                            className={`w-full px-4 py-3 rounded-xl border text-sm placeholder-slate-400
                focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent transition-all
                ${errors.description ? 'border-red-400 bg-red-50' : 'border-slate-200'}`}
                        />
                        {errors.description && <p className="text-red-500 text-xs mt-1">{errors.description}</p>}
                    </div>

                    {/* Amount */}
                    <div>
                        <label className="flex items-center gap-1.5 text-sm font-semibold text-slate-700 mb-2">
                            <IndianRupee size={13} className="text-slate-400" /> Amount (₹)
                        </label>
                        <div className="relative">
                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-semibold text-sm">₹</span>
                            <input
                                type="number"
                                inputMode="decimal"
                                min="1"
                                step="0.01"
                                value={form.amount}
                                onChange={set('amount')}
                                placeholder="0.00"
                                className={`w-full pl-8 pr-4 py-3 rounded-xl border text-sm placeholder-slate-400
                  focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent transition-all
                  ${errors.amount ? 'border-red-400 bg-red-50' : 'border-slate-200'}`}
                            />
                        </div>
                        {errors.amount && <p className="text-red-500 text-xs mt-1">{errors.amount}</p>}
                    </div>

                    {/* Category — pill selector */}
                    <div>
                        <label className="flex items-center gap-1.5 text-sm font-semibold text-slate-700 mb-3">
                            <Tag size={13} className="text-slate-400" /> Category
                        </label>
                        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                            {CATEGORIES.map(cat => (
                                <button
                                    key={cat.value}
                                    type="button"
                                    onClick={() => setForm(p => ({ ...p, category: cat.value }))}
                                    className={`py-2.5 px-3 rounded-xl border text-xs font-semibold text-left transition-all
                    ${form.category === cat.value
                                            ? 'border-orange-400 bg-orange-50 text-orange-700 shadow-sm ring-1 ring-orange-300'
                                            : 'border-slate-200 text-slate-600 hover:border-orange-200 hover:bg-orange-50'
                                        }`}
                                >
                                    {cat.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Property (optional) */}
                    {properties.length > 0 && (
                        <div>
                            <label className="flex items-center gap-1.5 text-sm font-semibold text-slate-700 mb-2">
                                <Building2 size={13} className="text-slate-400" /> Property <span className="font-normal text-slate-400">(optional)</span>
                            </label>
                            <select
                                value={form.property_id}
                                onChange={set('property_id')}
                                className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm text-slate-700
                  focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent bg-white"
                            >
                                <option value="">All properties / General</option>
                                {properties.map(p => (
                                    <option key={p.id} value={p.id}>{p.name}</option>
                                ))}
                            </select>
                        </div>
                    )}

                    {/* Notes */}
                    <div>
                        <label className="text-sm font-semibold text-slate-700 mb-2 block">
                            Notes <span className="font-normal text-slate-400">(optional)</span>
                        </label>
                        <textarea
                            rows={2}
                            value={form.notes}
                            onChange={set('notes')}
                            placeholder="Any extra details..."
                            className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm placeholder-slate-400
                focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent transition-all resize-none"
                        />
                    </div>

                    {/* Summary chip */}
                    {form.amount && parseFloat(form.amount) > 0 && (
                        <div className={`flex items-center gap-2.5 px-4 py-3 rounded-xl text-sm font-medium ${selCat?.color ?? 'bg-slate-100'}`}>
                            <CheckCircle2 size={14} />
                            <span>
                                Logging <strong>₹{parseFloat(form.amount).toLocaleString('en-IN')}</strong> as {selCat?.label}
                            </span>
                        </div>
                    )}

                    {/* Submit */}
                    <button
                        type="submit"
                        disabled={saving}
                        className="w-full bg-orange-500 hover:bg-orange-600 active:scale-[0.98]
              disabled:opacity-60 text-white font-bold py-4 rounded-xl
              shadow-sm transition-all flex items-center justify-center gap-2 text-base"
                    >
                        {saving
                            ? <><Loader2 size={16} className="animate-spin" /> Saving…</>
                            : <>
                                <IndianRupee size={16} />
                                Save Expense
                            </>
                        }
                    </button>

                </form>
            </div>
        </div>
    );
}
