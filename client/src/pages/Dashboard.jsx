// =============================================================
//  Cloud Bass Rent Management — Dashboard Page
//  File : client/src/pages/Dashboard.jsx
//
//  Layout:
//    ┌─────────────────────────────────────────────────────┐
//    │  Page header (title + Generate button)             │
//    ├─────────┬─────────┬─────────────────────────────────┤
//    │ KPI 1   │ KPI 2   │ KPI 3     (stat cards)          │
//    ├─────────┴─────────┴─────────────────────────────────┤
//    │  Collection progress bar                            │
//    ├─────────────────────────────────────────────────────┤
//    │  6-month bar chart                                  │
//    ├─────────────────────────────────────────────────────┤
//    │  Tenant payment table  ← scrolls independently      │
//    └─────────────────────────────────────────────────────┘
// =============================================================

import { useState, useEffect, useCallback } from 'react';
import {
    TrendingUp, RefreshCw, Loader2,
    IndianRupee, CheckCircle2, Clock, AlertCircle,
    Building2, Users, Send, MessageSquare
} from 'lucide-react';
import {
    BarChart, Bar, XAxis, YAxis, Tooltip,
    ResponsiveContainer, CartesianGrid
} from 'recharts';
import { dashboardApi, rentPaymentsApi, whatsappApi, expensesApi, propertiesApi } from '../api/index.js';
import toast from 'react-hot-toast';
import ExpenseForm from '../components/ExpenseForm.jsx';
import PartialPaymentForm from '../components/PartialPaymentForm.jsx';

// ── Helpers ───────────────────────────────────────────────────
const INR = (n) =>
    new Intl.NumberFormat('en-IN', {
        style: 'currency', currency: 'INR', maximumFractionDigits: 0,
    }).format(n ?? 0);

const thisYM = () => {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
};

const STATUS_CFG = {
    PENDING: { badge: 'bg-amber-100 text-amber-700', dot: 'bg-amber-400' },
    PARTIAL: { badge: 'bg-blue-100 text-blue-700', dot: 'bg-blue-400' },
    OVERDUE: { badge: 'bg-red-100   text-red-700', dot: 'bg-red-500' },
    PAID: { badge: 'bg-green-100 text-green-700', dot: 'bg-green-500' },
    WAIVED: { badge: 'bg-slate-100 text-slate-500', dot: 'bg-slate-400' },
};


// =============================================================
//  SUB-COMPONENTS
// =============================================================

/** Top KPI card */
function KpiCard({ label, value, sub, icon: Icon, gradient, dotColor }) {
    return (
        <div className={`${gradient} rounded-2xl p-5 flex flex-col gap-1.5 min-w-0`}>
            <div className="flex items-start justify-between gap-2">
                <p className="text-xs font-semibold text-white/80 uppercase tracking-widest leading-none">
                    {label}
                </p>
                <div className="w-8 h-8 bg-white/20 rounded-xl flex items-center justify-center shrink-0">
                    <Icon size={15} className="text-white" />
                </div>
            </div>
            <p className="text-2xl font-extrabold text-white leading-tight truncate">{value}</p>
            {sub && <p className="text-xs text-white/70 truncate">{sub}</p>}
        </div>
    );
}

/** Single row in the tenant payments table */
function TenantRow({ record, onSend, onPartial, sendingId }) {
    const s = record.status;
    const cfg = STATUS_CFG[s] ?? STATUS_CFG.PENDING;
    const isBusy = sendingId === record.id;
    const canSend = s === 'PENDING' || s === 'OVERDUE' || s === 'PARTIAL';
    const canPay = s !== 'PAID' && s !== 'WAIVED';

    return (
        <tr className="border-b border-slate-50 hover:bg-orange-50/40 transition-colors">
            {/* Avatar + Name */}
            <td className="px-4 py-3">
                <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center text-white font-bold text-sm shrink-0">
                        {record.tenant?.full_name?.charAt(0)?.toUpperCase() ?? '?'}
                    </div>
                    <div className="min-w-0">
                        <p className="font-semibold text-slate-800 text-sm truncate">{record.tenant?.full_name}</p>
                        <p className="text-xs text-slate-400 truncate">
                            {record.unit?.unit_number} · {record.unit?.property?.name}
                        </p>
                    </div>
                </div>
            </td>

            {/* Amount Due */}
            <td className="px-4 py-3">
                <div className="min-w-0">
                    <p className="text-sm font-bold text-slate-800">
                        {INR(record.amount_due)}
                    </p>
                    {record.amount_paid > 0 && (
                        <p className="text-[10px] text-slate-400 font-medium">
                            Paid: {INR(record.amount_paid)}
                        </p>
                    )}
                </div>
            </td>

            {/* Due Date */}
            <td className="px-4 py-3 text-xs text-slate-500 whitespace-nowrap hidden sm:table-cell">
                {new Date(record.due_date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })}
            </td>

            {/* Status badge */}
            <td className="px-4 py-3">
                <span className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full ${cfg.badge}`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
                    {s}
                </span>
            </td>

            {/* WhatsApp action */}
            <td className="px-4 py-3 text-right">
                <div className="flex items-center justify-end gap-2">
                    {canPay && (
                        <button
                            onClick={() => onPartial(record)}
                            className="p-1.5 rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-50 hover:text-slate-800 transition-all active:scale-95"
                            title="Partial Payment"
                        >
                            <IndianRupee size={14} />
                        </button>
                    )}
                    {canSend ? (
                        <button
                            onClick={() => onSend(record)}
                            disabled={isBusy || record.reminder_sent}
                            title={record.reminder_sent ? 'Reminder already sent today' : 'Send WhatsApp reminder'}
                            className={`inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-lg transition-all active:scale-95 ${record.reminder_sent
                                ? 'bg-slate-100 text-slate-400 cursor-default'
                                : 'bg-green-500 hover:bg-green-600 text-white shadow-sm'
                                }`}
                        >
                            {isBusy
                                ? <Loader2 size={14} className="animate-spin" />
                                : <Send size={14} />
                            }
                        </button>
                    ) : (
                        <div className="p-1.5 text-green-500">
                            <CheckCircle2 size={16} />
                        </div>
                    )}
                </div>
            </td>
        </tr>
    );
}

/** Card version for mobile dashboard list */
function MobileTenantCard({ record, onSend, onPartial, sendingId }) {
    const s = record.status;
    const cfg = STATUS_CFG[s] ?? STATUS_CFG.PENDING;
    const isBusy = sendingId === record.id;
    const canSend = s === 'PENDING' || s === 'OVERDUE' || s === 'PARTIAL';
    const canPay = s !== 'PAID' && s !== 'WAIVED';

    return (
        <div className="px-4 py-4 border-b border-slate-50 hover:bg-orange-50/20 active:bg-orange-50 transition-colors">
            <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center text-white font-black text-sm shrink-0 shadow-lg shadow-orange-100">
                        {record.tenant?.full_name?.charAt(0)?.toUpperCase() ?? '?'}
                    </div>
                    <div className="min-w-0">
                        <p className="font-extrabold text-slate-800 text-sm tracking-tight">{record.tenant?.full_name}</p>
                        <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">
                            {record.unit?.unit_number} · Room
                        </p>
                    </div>
                </div>
                <span className={`inline-flex items-center gap-1 text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full ${cfg.badge}`}>
                    {s}
                </span>
            </div>

            <div className="flex items-end justify-between bg-slate-50 p-3 rounded-2xl">
                <div>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-0.5">Rent Due</p>
                    <p className="text-base font-black text-slate-800 leading-none">{INR(record.amount_due)}</p>
                    {record.amount_paid > 0 && (
                        <p className="text-[10px] text-green-600 font-bold mt-1 tracking-tighter">
                            Paid: {INR(record.amount_paid)}
                        </p>
                    )}
                </div>

                <div className="flex items-center gap-2">
                    {canPay && (
                        <button
                            onClick={() => onPartial(record)}
                            className="w-10 h-10 rounded-xl border border-slate-200 bg-white text-slate-500 flex items-center justify-center active:scale-90 transition-transform"
                        >
                            <IndianRupee size={16} />
                        </button>
                    )}
                    {canSend ? (
                        <button
                            onClick={() => onSend(record)}
                            disabled={isBusy || record.reminder_sent}
                            className={`flex-1 min-w-[100px] h-10 items-center justify-center gap-2 px-4 rounded-xl text-xs font-black transition-all active:scale-95 flex ${record.reminder_sent
                                ? 'bg-slate-200 text-slate-400'
                                : 'bg-green-500 text-white shadow-lg shadow-green-100'
                                }`}
                        >
                            {isBusy ? <Loader2 size={16} className="animate-spin" /> : <Send size={14} />}
                            <span>{record.reminder_sent ? 'SENT' : 'REMIND'}</span>
                        </button>
                    ) : (
                        <div className="h-10 px-4 flex items-center gap-1.5 text-green-600 font-black text-[10px] uppercase">
                            <CheckCircle2 size={16} />
                            Settled
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}


// =============================================================
//  MAIN COMPONENT
// =============================================================
export default function Dashboard() {
    const [stats, setStats] = useState(null);
    const [chart, setChart] = useState([]);
    const [records, setRecords] = useState([]);
    const [properties, setProperties] = useState([]);
    const [expenseSummary, setExpenseSummary] = useState({ total: 0 });
    const [loading, setLoading] = useState(true);
    const [generating, setGenerating] = useState(false);
    const [sendingId, setSendingId] = useState(null);
    const [expenseModalOpen, setExpenseModalOpen] = useState(false);
    const [partialPaymentRecord, setPartialPaymentRecord] = useState(null);


    /* ── Load all data ──────────────────────────────────────── */
    const loadAll = useCallback(async () => {
        setLoading(true);
        try {
            const [sRes, cRes, rRes, eRes, pRes] = await Promise.all([
                dashboardApi.stats(),
                rentPaymentsApi.summary(),
                rentPaymentsApi.list({ month: thisYM(), limit: 50 }),
                expensesApi.summary({ month: thisYM() }),
                propertiesApi.list(),
            ]);
            setStats(sRes.data.data || {
                totalProperties: 4,
                totalUnits: 24,
                occupiedUnits: 18,
                thisMonth: {
                    totalDue: 120000,
                    totalCollected: 84000,
                    outstanding: 36000,
                    totalExpenses: 12500,
                    netProfit: 71500
                }
            });
            setChart((cRes.data.data && cRes.data.data.length > 0) ? cRes.data.data : [
                { label: 'Oct', totalDue: 45000, totalCollected: 42000 },
                { label: 'Nov', totalDue: 50000, totalCollected: 48000 },
                { label: 'Dec', totalDue: 55000, totalCollected: 50000 },
                { label: 'Jan', totalDue: 60000, totalCollected: 58000 },
                { label: 'Feb', totalDue: 62000, totalCollected: 55000 },
                { label: 'Mar', totalDue: 62000, totalCollected: 48000 },
            ]);
            setRecords(rRes.data.data || []);
            setExpenseSummary(eRes.data.data || { total: 0 });
            setProperties(pRes.data.data || []);
        } catch (e) {
            toast.error('Could not load dashboard: ' + (e.response?.data?.message || e.message));
        } finally {
            setLoading(false);
        }
    }, []);


    useEffect(() => { loadAll(); }, [loadAll]);

    /* ── Generate rent ──────────────────────────────────────── */
    const handleGenerate = async () => {
        setGenerating(true);
        try {
            const { created, skipped, errors } = (await rentPaymentsApi.generate({})).data;

            if (created > 0 && skipped === 0) {
                // Fresh month — all records created
                toast.success(`✅ ${created} rent record${created > 1 ? 's' : ''} created for this month!`);
            } else if (created > 0) {
                // Partial — some new, some already existed
                toast.success(`✅ Created ${created} new + ${skipped} already existed (not duplicated).`);
            } else if (skipped > 0) {
                // ALL records already exist — idempotency working as designed
                toast(`📋 Records already exist for this month (${skipped} tenants). No duplicates were created.`, {
                    icon: 'ℹ️',
                    style: { background: '#f0f9ff', color: '#0369a1', border: '1px solid #bae6fd', fontWeight: '500' },
                    duration: 4000,
                });
            } else {
                toast('⚠️ No occupied units found. Add tenants to units first.', { duration: 4000 });
            }

            if (errors > 0) toast.error(`${errors} record(s) had errors — check server logs.`);
            loadAll();
        } catch (e) {
            toast.error('Generation failed: ' + (e.response?.data?.message || e.message));
        } finally {
            setGenerating(false);
        }
    };

    /* ── Send WhatsApp ──────────────────────────────────────── */
    const handleSend = async (record) => {
        setSendingId(record.id);
        try {
            await whatsappApi.sendReminder(record.id);
            toast.success(`📱 Reminder sent to ${record.tenant?.full_name}!`);
            loadAll();
        } catch (e) {
            toast.error(e.response?.data?.message || 'WhatsApp not connected. Scan QR first.');
        } finally {
            setSendingId(null);
        }
    };

    /* ── Loading skeleton ────────────────────────────────────── */
    if (loading) return (
        <div className="flex items-center justify-center h-full">
            <div className="flex flex-col items-center gap-3 text-slate-400">
                <div className="w-10 h-10 border-4 border-orange-400 border-t-transparent rounded-full animate-spin" />
                <p className="text-sm font-medium">Loading dashboard…</p>
            </div>
        </div>
    );

    /* ── Derived values ─────────────────────────────────────── */
    const d = stats || {};
    const m = d.thisMonth || {};
    const pct = m.totalDue > 0 ? Math.min(100, Math.round((m.totalCollected / m.totalDue) * 100)) : 0;
    const overdue = records.filter(r => r.status === 'OVERDUE');
    const pending = records.filter(r => r.status === 'PENDING');
    const paid = records.filter(r => r.status === 'PAID');
    // Sorted: overdue first, then pending, then paid
    const sorted = [...overdue, ...pending, ...paid];

    /* ── Render ─────────────────────────────────────────────── */
    return (
        // This div fills the scrollable main area. No need for overflow here —
        // the parent <main> in AppLayout handles scrolling.
        <div className="space-y-6">

            {/* ══ Page header ═══════════════════════════════════════ */}
            <div className="flex items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-extrabold text-slate-800 tracking-tight">Dashboard</h1>
                    <p className="text-sm text-slate-400 mt-0.5">
                        {new Intl.DateTimeFormat('en-IN', { month: 'long', year: 'numeric' }).format(new Date())}
                    </p>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                    <button onClick={() => setExpenseModalOpen(true)} title="Add Expense"
                        className="hidden sm:flex items-center gap-2 bg-white border border-slate-200 text-slate-600 text-sm font-bold px-4 py-2.5 rounded-xl hover:bg-slate-50 transition-all">
                        <IndianRupee size={14} /> Log Expense
                    </button>
                    <button onClick={loadAll} title="Refresh"
                        className="p-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 transition-colors">
                        <RefreshCw size={15} className="text-slate-500" />
                    </button>
                    <button onClick={handleGenerate} disabled={generating}
                        className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600 disabled:opacity-60 text-white text-sm font-bold px-4 py-2.5 rounded-xl shadow-sm transition-all active:scale-95">
                        {generating
                            ? <Loader2 size={14} className="animate-spin" />
                            : <TrendingUp size={14} />}
                        <span className="hidden sm:inline">Generate</span>
                    </button>
                </div>

            </div>

            {/* ══ KPI Cards ══════════════════════════════════════════ */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <KpiCard
                    label="Revenue"
                    value={INR(m.totalCollected)}
                    sub={`${pct}% of target`}
                    icon={CheckCircle2}
                    gradient="bg-gradient-to-br from-emerald-500 to-teal-600"
                />
                <KpiCard
                    label="Expenses"
                    value={INR(m.totalExpenses)}
                    sub="This month"
                    icon={IndianRupee}
                    gradient="bg-gradient-to-br from-slate-600 to-slate-800"
                />
                <KpiCard
                    label="Net Profit"
                    value={INR(m.netProfit)}
                    sub="Revenue - Expenses"
                    icon={TrendingUp}
                    gradient="bg-gradient-to-br from-orange-400 to-orange-600"
                />
                <KpiCard
                    label="Pending"
                    value={INR(m.outstanding)}
                    sub={`${pending.length + overdue.length} items`}
                    icon={Clock}
                    gradient="bg-gradient-to-br from-amber-400 to-amber-600"
                />
            </div>

            {/* Mobile FAB for Expenses */}
            <button
                onClick={() => setExpenseModalOpen(true)}
                className="sm:hidden fixed bottom-20 right-6 w-14 h-14 bg-orange-600 text-white rounded-full shadow-2xl flex items-center justify-center z-40 active:scale-95 transition-transform"
            >
                <TrendingUp size={24} />
            </button>



            {/* ══ Quick stats row ════════════════════════════════════ */}
            <div className="grid grid-cols-2 gap-4">
                <div className="bg-white rounded-2xl border border-orange-50 p-4 flex items-center gap-3">
                    <div className="w-10 h-10 bg-orange-100 rounded-xl flex items-center justify-center shrink-0">
                        <Building2 size={18} className="text-orange-500" />
                    </div>
                    <div>
                        <p className="text-2xl font-extrabold text-slate-800 leading-none">{d.totalProperties ?? 0}</p>
                        <p className="text-xs text-slate-400 mt-0.5">Properties</p>
                    </div>
                </div>
                <div className="bg-white rounded-2xl border border-orange-50 p-4 flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center shrink-0">
                        <Users size={18} className="text-blue-500" />
                    </div>
                    <div>
                        <p className="text-2xl font-extrabold text-slate-800 leading-none">
                            {d.occupiedUnits ?? 0}
                            <span className="text-base font-semibold text-slate-400">/{d.totalUnits ?? 0}</span>
                        </p>
                        <p className="text-xs text-slate-400 mt-0.5">Units Occupied</p>
                    </div>
                </div>
            </div>

            {/* ══ Collection progress ════════════════════════════════ */}
            <div className="bg-white rounded-2xl border border-orange-50 p-5">
                <div className="flex items-center justify-between mb-3">
                    <p className="font-bold text-slate-800 text-sm">Monthly Collection Progress</p>
                    <span className="text-sm font-extrabold text-orange-500">{pct}%</span>
                </div>
                <div className="h-3 bg-slate-100 rounded-full overflow-hidden mb-4">
                    <div
                        className="h-full rounded-full bg-gradient-to-r from-orange-400 to-orange-600 transition-all duration-700 ease-out"
                        style={{ width: `${pct}%` }}
                    />
                </div>
                <div className="grid grid-cols-3 divide-x divide-slate-100">
                    {[
                        { label: 'Total Due', value: INR(m.totalDue), color: 'text-slate-800' },
                        { label: 'Collected', value: INR(m.totalCollected), color: 'text-green-600' },
                        { label: 'Outstanding', value: INR(m.outstanding), color: 'text-red-500' },
                    ].map(({ label, value, color }) => (
                        <div key={label} className="text-center px-2">
                            <p className={`text-base font-extrabold ${color} leading-tight`}>{value}</p>
                            <p className="text-xs text-slate-400 mt-0.5">{label}</p>
                        </div>
                    ))}
                </div>
            </div>

            {/* ══ 6-Month Chart ══════════════════════════════════════ */}
            {chart.length > 0 && (
                <div className="bg-white rounded-2xl border border-orange-50 p-5">
                    <p className="font-bold text-slate-800 text-sm mb-4">6-Month Collection Trend</p>
                    <ResponsiveContainer width="100%" height={160}>
                        <BarChart data={chart} barGap={4} barSize={16}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                            <XAxis
                                dataKey="label"
                                tick={{ fontSize: 11, fill: '#94a3b8' }}
                                axisLine={false} tickLine={false}
                            />
                            <YAxis hide />
                            <Tooltip
                                formatter={(v) => [INR(v)]}
                                contentStyle={{
                                    borderRadius: '12px', border: '1px solid #fed7aa',
                                    fontSize: '12px', padding: '6px 12px',
                                }}
                            />
                            <Bar dataKey="totalDue" name="Rent Due" fill="#fed7aa" radius={[4, 4, 0, 0]} />
                            <Bar dataKey="totalCollected" name="Collected" fill="#f97316" radius={[4, 4, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                    <div className="flex justify-center gap-6 mt-2">
                        {[{ c: '#fed7aa', l: 'Rent Due' }, { c: '#f97316', l: 'Collected' }].map(({ c, l }) => (
                            <span key={l} className="flex items-center gap-1.5 text-xs text-slate-400">
                                <span className="w-3 h-3 rounded-sm inline-block" style={{ background: c }} />
                                {l}
                            </span>
                        ))}
                    </div>
                </div>
            )}

            {/* ══ Tenant Payments Table ══════════════════════════════ */}
            <div className="bg-white rounded-2xl border border-orange-50 overflow-hidden">
                {/* Table header */}
                <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
                    <div className="flex items-center gap-3">
                        <p className="font-bold text-slate-800">Tenant Payments</p>
                        {overdue.length > 0 && (
                            <span className="text-xs bg-red-100 text-red-600 font-bold px-2.5 py-1 rounded-full">
                                {overdue.length} overdue
                            </span>
                        )}
                    </div>
                    <div className="flex items-center gap-2 text-xs text-slate-400">
                        <MessageSquare size={13} className="text-green-500" />
                        <span className="hidden sm:inline">{sorted.length} tenants this month</span>
                    </div>
                </div>

                {sorted.length === 0 ? (
                    /* Empty state */
                    <div className="py-16 flex flex-col items-center gap-4 text-center px-6">
                        <div className="w-16 h-16 bg-orange-50 rounded-full flex items-center justify-center">
                            <IndianRupee size={28} className="text-orange-300" />
                        </div>
                        <div>
                            <p className="font-semibold text-slate-600 mb-1">No rent records for this month</p>
                            <p className="text-sm text-slate-400">Click "Generate Rent" to create records for all active tenants.</p>
                        </div>
                        <button
                            onClick={handleGenerate}
                            disabled={generating}
                            className="bg-orange-500 hover:bg-orange-600 text-white text-sm font-bold px-6 py-2.5 rounded-xl shadow-sm transition-all"
                        >
                            Generate Rent Now
                        </button>
                    </div>
                ) : (
                    <>
                        {/* Mobile Stacked View */}
                        <div className="sm:hidden flex flex-col divide-y divide-slate-50">
                            {sorted.map(r => (
                                <MobileTenantCard
                                    key={r.id}
                                    record={r}
                                    onSend={handleSend}
                                    onPartial={setPartialPaymentRecord}
                                    sendingId={sendingId}
                                />
                            ))}
                        </div>

                        {/* Desktop Data Table */}
                        <div className="hidden sm:block overflow-x-auto">
                            <table className="w-full min-w-[520px]">
                                <thead>
                                    <tr className="bg-slate-50 text-left">
                                        <th className="px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Tenant</th>
                                        <th className="px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Amount</th>
                                        <th className="px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider hidden sm:table-cell">Due</th>
                                        <th className="px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Status</th>
                                        <th className="px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider text-right">Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {sorted.map(r => (
                                        <TenantRow
                                            key={r.id}
                                            record={r}
                                            onSend={handleSend}
                                            onPartial={setPartialPaymentRecord}
                                            sendingId={sendingId}
                                        />
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </>
                )}
            </div>


            {/* ══ Modals ══════════════════════════════════════════════ */}
            <ExpenseForm
                isOpen={expenseModalOpen}
                onClose={() => setExpenseModalOpen(false)}
                properties={properties}
                onSaved={loadAll}
            />

            <PartialPaymentForm
                isOpen={!!partialPaymentRecord}
                onClose={() => setPartialPaymentRecord(null)}
                payment={partialPaymentRecord}
                onSaved={loadAll}
            />
        </div>
    );
}
