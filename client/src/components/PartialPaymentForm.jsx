// =============================================================
//  PartialPaymentForm — Record a partial rent payment
//  File : client/src/components/PartialPaymentForm.jsx
// =============================================================

import { useState, useEffect, useRef } from 'react';
import { X, IndianRupee, Loader2, CheckCircle2 } from 'lucide-react';
import { rentPaymentsApi } from '../api/index.js';
import toast from 'react-hot-toast';

export default function PartialPaymentForm({ isOpen, onClose, onSaved, payment }) {
    const [amount, setAmount] = useState('');
    const [note, setNote] = useState('');
    const [saving, setSaving] = useState(false);
    const inputRef = useRef(null);

    useEffect(() => {
        if (isOpen) {
            setAmount('');
            setNote('');
            setTimeout(() => inputRef.current?.focus(), 100);
        }
    }, [isOpen]);

    if (!isOpen || !payment) return null;

    const balance = Number(payment.amount_due) - Number(payment.amount_paid);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const val = parseFloat(amount);
        if (isNaN(val) || val <= 0) {
            toast.error('Enter a valid amount.');
            return;
        }
        if (val > balance) {
            toast.error(`Amount exceeds balance due (₹${balance})`);
            return;
        }

        setSaving(true);
        try {
            const res = await rentPaymentsApi.partialPay(payment.id, { amount: val, note });
            toast.success(res.data.message);
            onSaved?.(res.data.data);
            onClose();
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to record payment.');
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />

            <div className="relative w-full max-w-sm bg-white rounded-3xl shadow-2xl z-10 animate-[slideUp_0.2s_ease-out]">
                <div className="flex items-center justify-between px-6 pt-6 pb-4 border-b border-slate-50">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center text-green-600">
                            <IndianRupee size={20} />
                        </div>
                        <div>
                            <h3 className="font-bold text-slate-800">Partial Payment</h3>
                            <p className="text-xs text-slate-400">Balance: ₹{balance.toLocaleString('en-IN')}</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
                        <X size={20} className="text-slate-400" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-5">
                    <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-2">Amount to Pay</label>
                        <div className="relative">
                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold">₹</span>
                            <input
                                ref={inputRef}
                                type="number"
                                inputMode="decimal"
                                value={amount}
                                onChange={(e) => setAmount(e.target.value)}
                                placeholder="0.00"
                                className="w-full pl-8 pr-4 py-3.5 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-orange-500 transition-all font-bold text-lg"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-2">Payment Note (Optional)</label>
                        <input
                            type="text"
                            value={note}
                            onChange={(e) => setNote(e.target.value)}
                            placeholder="e.g. UPI, Cash, Check #123"
                            className="w-full px-4 py-3 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-orange-500 transition-all text-sm"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={saving || !amount}
                        className="w-full py-4 bg-orange-500 hover:bg-orange-600 disabled:opacity-50 text-white font-bold rounded-2xl shadow-lg shadow-orange-200 transition-all active:scale-95 flex items-center justify-center gap-2"
                    >
                        {saving ? <Loader2 size={20} className="animate-spin" /> : <CheckCircle2 size={20} />}
                        {saving ? 'Recording...' : 'Confirm Payment'}
                    </button>
                </form>
            </div>
        </div>
    );
}
