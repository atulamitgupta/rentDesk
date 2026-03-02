// =============================================================
//  Page: Properties + Units
//  File : client/src/pages/Properties.jsx
// =============================================================

import { useState, useEffect } from 'react';
import { Building2, Plus, Edit2, Trash2, Home, ChevronRight, X, Loader2 } from 'lucide-react';
import { propertiesApi } from '../api/index.js';
import toast from 'react-hot-toast';

const TYPES = ['APARTMENT', 'PG_HOSTEL', 'COMMERCIAL', 'MIXED'];

const typeColors = {
    APARTMENT: 'bg-blue-100 text-blue-700',
    PG_HOSTEL: 'bg-orange-100 text-orange-700',
    COMMERCIAL: 'bg-purple-100 text-purple-700',
    MIXED: 'bg-teal-100 text-teal-700',
};

const fmt = (n) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(n || 0);

// ── Modal ─────────────────────────────────────────────────────
function Modal({ title, onClose, children }) {
    return (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
            <div className="bg-white rounded-3xl w-full max-w-md shadow-2xl animate-in slide-in-from-bottom-4">
                <div className="flex items-center justify-between p-5 border-b border-slate-100">
                    <h3 className="font-bold text-slate-800">{title}</h3>
                    <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-slate-100 transition-colors">
                        <X size={16} className="text-slate-500" />
                    </button>
                </div>
                <div className="p-5">{children}</div>
            </div>
        </div>
    );
}

// ── Input ─────────────────────────────────────────────────────
function Field({ label, ...props }) {
    return (
        <label className="block">
            <span className="text-sm font-semibold text-slate-700 mb-1.5 block">{label}</span>
            {props.as === 'select' ? (
                <select {...props} className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 bg-white">
                    {props.children}
                </select>
            ) : (
                <input {...props} className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-400" />
            )}
        </label>
    );
}

// ── Property Form ─────────────────────────────────────────────
function PropertyForm({ initial = {}, onSave, onClose, loading }) {
    const [form, setForm] = useState({ name: '', address: '', city: '', state: '', type: 'RESIDENTIAL', ...initial });
    const set = (k) => (e) => setForm(p => ({ ...p, [k]: e.target.value }));

    return (
        <form onSubmit={(e) => { e.preventDefault(); onSave(form); }} className="space-y-4">
            <Field label="Property Name *" value={form.name} onChange={set('name')} placeholder="Sunshine Apartments" required />
            <Field label="Address *" value={form.address} onChange={set('address')} placeholder="12, MG Road" required />
            <div className="grid grid-cols-2 gap-3">
                <Field label="City *" value={form.city} onChange={set('city')} placeholder="Mumbai" required />
                <Field label="State" value={form.state} onChange={set('state')} placeholder="Maharashtra" />
            </div>
            <Field label="Category" as="select" value={form.type} onChange={set('type')}>
                {TYPES.map(t => <option key={t}>{t === 'PG_HOSTEL' ? 'PG / Hostel' : t.charAt(0) + t.slice(1).toLowerCase()}</option>)}
            </Field>
            <div className="flex gap-3 pt-2">
                <button type="button" onClick={onClose} className="flex-1 py-3 rounded-xl border border-slate-200 text-sm font-semibold text-slate-600 hover:bg-slate-50">Cancel</button>
                <button type="submit" disabled={loading} className="flex-1 py-3 rounded-xl bg-orange-500 hover:bg-orange-600 text-white text-sm font-semibold shadow-brand-sm disabled:opacity-60 flex items-center justify-center gap-2">
                    {loading && <Loader2 size={14} className="animate-spin" />} Save
                </button>
            </div>
        </form>
    );
}

// ── Unit Form ─────────────────────────────────────────────────
function UnitForm({ propertyId, onSave, onClose, loading, selectedPropertyType }) {
    const [form, setForm] = useState({ unit_number: '', floor: '', monthly_rent: '', capacity: '1' });
    const set = (k) => (e) => setForm(p => ({ ...p, [k]: e.target.value }));
    return (
        <form onSubmit={(e) => { e.preventDefault(); onSave(form); }} className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
                <Field label="Unit Number *" value={form.unit_number} onChange={set('unit_number')} placeholder="Flat 101" required />
                <Field label="Floor" value={form.floor} onChange={set('floor')} placeholder="1st" />
            </div>
            <div className="grid grid-cols-2 gap-3">
                <Field label="Monthly Rent (₹) *" type="number" value={form.monthly_rent} onChange={set('monthly_rent')} placeholder="15000" required min="0" />
                {selectedPropertyType === 'PG_HOSTEL' && (
                    <Field label="Max Beds *" type="number" value={form.capacity} onChange={set('capacity')} placeholder="3" required min="1" />
                )}
            </div>
            <div className="flex gap-3 pt-2">
                <button type="button" onClick={onClose} className="flex-1 py-3 rounded-xl border border-slate-200 text-sm font-semibold text-slate-600 hover:bg-slate-50">Cancel</button>
                <button type="submit" disabled={loading} className="flex-1 py-3 rounded-xl bg-orange-500 hover:bg-orange-600 text-white text-sm font-semibold shadow-brand-sm disabled:opacity-60 flex items-center justify-center gap-2">
                    {loading && <Loader2 size={14} className="animate-spin" />} Add Unit
                </button>
            </div>
        </form>
    );
}

// ── Main Page ─────────────────────────────────────────────────
export default function Properties() {
    const [properties, setProperties] = useState([]);
    const [selected, setSelected] = useState(null); // property with units
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [modal, setModal] = useState(null); // 'add-prop' | 'edit-prop' | 'add-unit'
    const [editTarget, setEditTarget] = useState(null);

    const fetchProperties = async () => {
        try {
            const res = await propertiesApi.list();
            setProperties(res.data.data);
        } catch { toast.error('Failed to load properties.'); }
        finally { setLoading(false); }
    };

    const fetchSelected = async (id) => {
        const res = await propertiesApi.get(id);
        setSelected(res.data.data);
    };

    useEffect(() => { fetchProperties(); }, []);

    const handleSaveProperty = async (form) => {
        setSaving(true);
        try {
            if (editTarget) {
                await propertiesApi.update(editTarget.id, form);
                toast.success('Property updated!');
            } else {
                await propertiesApi.create(form);
                toast.success('Property created!');
            }
            setModal(null); setEditTarget(null); fetchProperties();
        } catch { toast.error('Failed to save property.'); }
        finally { setSaving(false); }
    };

    const handleDeleteProperty = async (id) => {
        if (!confirm('Delete this property and all its units?')) return;
        try {
            await propertiesApi.remove(id);
            toast.success('Property deleted.'); setSelected(null); fetchProperties();
        } catch { toast.error('Cannot delete — remove tenants first.'); }
    };

    const handleAddUnit = async (form) => {
        if (!selected) return;
        setSaving(true);
        try {
            await propertiesApi.createUnit(selected.id, form);
            toast.success('Unit added!'); setModal(null); fetchSelected(selected.id); fetchProperties();
        } catch { toast.error('Failed to add unit.'); }
        finally { setSaving(false); }
    };

    const handleDeleteUnit = async (unitId) => {
        if (!confirm('Delete this unit?')) return;
        try {
            await propertiesApi.deleteUnit(selected.id, unitId);
            toast.success('Unit deleted.'); fetchSelected(selected.id); fetchProperties();
        } catch { toast.error('Cannot delete — vacate the tenant first.'); }
    };

    if (loading) return <div className="flex items-center justify-center h-64"><div className="w-8 h-8 border-4 border-orange-500 border-t-transparent rounded-full animate-spin" /></div>;

    return (
        <div className="space-y-4 page-enter">
            {/* Header */}
            <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-slate-800">Properties</h2>
                <button onClick={() => { setEditTarget(null); setModal('add-prop'); }} className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white px-4 py-2.5 rounded-xl text-sm font-semibold shadow-brand-sm transition-colors">
                    <Plus size={16} /> Add Property
                </button>
            </div>

            <div className="grid lg:grid-cols-2 gap-4">
                {/* Property List */}
                <div className="space-y-3">
                    {properties.length === 0 ? (
                        <div className="bg-white rounded-2xl p-10 text-center border border-orange-50">
                            <Building2 size={36} className="mx-auto text-slate-300 mb-3" />
                            <p className="font-semibold text-slate-500">No properties yet</p>
                            <p className="text-sm text-slate-400 mt-1">Click "Add Property" to get started</p>
                        </div>
                    ) : properties.map(p => (
                        <div
                            key={p.id}
                            onClick={() => fetchSelected(p.id)}
                            className={`bg-white rounded-2xl p-5 shadow-sm border cursor-pointer transition-all hover:shadow-md ${selected?.id === p.id ? 'border-orange-400 ring-2 ring-orange-100' : 'border-orange-50'}`}
                        >
                            <div className="flex items-start justify-between mb-3">
                                <div>
                                    <h3 className="font-bold text-slate-800">{p.name}</h3>
                                    <p className="text-xs text-slate-400 mt-0.5">{p.address}, {p.city}</p>
                                </div>
                                <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${typeColors[p.type]}`}>{p.type}</span>
                            </div>
                            <div className="flex items-center gap-4 text-sm">
                                <span className="text-slate-500">{p.totalUnits} units</span>
                                <span className="text-green-600 font-medium">{p.occupiedUnits} occupied</span>
                                <span className="text-slate-400">{p.vacantUnits} vacant</span>
                                <span className="ml-auto font-semibold text-orange-600">{fmt(p.totalRentPotential)}/mo</span>
                            </div>
                            <div className="flex items-center justify-between mt-3 pt-3 border-t border-slate-50">
                                <button onClick={(e) => { e.stopPropagation(); setEditTarget(p); setModal('edit-prop'); }} className="flex items-center gap-1 text-xs text-slate-500 hover:text-orange-500 font-medium transition-colors">
                                    <Edit2 size={12} /> Edit
                                </button>
                                <button onClick={(e) => { e.stopPropagation(); handleDeleteProperty(p.id); }} className="flex items-center gap-1 text-xs text-slate-400 hover:text-red-500 font-medium transition-colors">
                                    <Trash2 size={12} /> Delete
                                </button>
                                <ChevronRight size={14} className="text-slate-300" />
                            </div>
                        </div>
                    ))}
                </div>

                {/* Unit Detail Panel */}
                {selected && (
                    <div className="bg-white rounded-2xl p-5 shadow-sm border border-orange-50">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="font-bold text-slate-800">Units — {selected.name}</h3>
                            <button onClick={() => setModal('add-unit')} className="flex items-center gap-1.5 text-sm bg-orange-50 text-orange-600 hover:bg-orange-100 font-semibold px-3 py-1.5 rounded-xl transition-colors">
                                <Plus size={14} /> Add Unit
                            </button>
                        </div>
                        <div className="space-y-2">
                            {selected.units?.length === 0 && <p className="text-sm text-slate-400 text-center py-8">No units yet. Add your first unit above.</p>}
                            {selected.units?.map(u => (
                                <div key={u.id} className={`flex flex-col p-4 rounded-2xl border ${u.status === 'OCCUPIED' ? 'bg-orange-50 border-orange-100' : 'bg-slate-50 border-slate-100'}`}>
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${u.status === 'OCCUPIED' ? 'bg-orange-500' : 'bg-slate-300'}`}>
                                                <Home size={16} className="text-white" />
                                            </div>
                                            <div>
                                                <p className="font-black text-slate-800 text-sm">{u.unit_number}</p>
                                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{selected.type === 'PG_HOSTEL' ? (u.capacity > 1 ? `${u.capacity} Sharing` : 'Single Room') : 'Full Unit'}</p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-sm font-black text-slate-800">{fmt(u.monthly_rent)}</p>
                                            <p className="text-[10px] font-bold text-slate-400">/mo</p>
                                        </div>
                                    </div>

                                    <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            {selected.type === 'PG_HOSTEL' ? (
                                                <span className="text-[10px] font-black text-orange-600 bg-white px-2 py-1 rounded-lg border border-orange-100">
                                                    {u.occupiedBeds || 0}/{u.capacity || 1} BEDS
                                                </span>
                                            ) : (
                                                <span className={`text-[10px] font-black px-2 py-1 rounded-lg border ${u.status === 'OCCUPIED' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-slate-200 text-slate-500 border-slate-300'}`}>
                                                    {u.status}
                                                </span>
                                            )}
                                            {u.tenant && <span className="text-xs font-bold text-slate-500 ml-1">{u.tenant.full_name}</span>}
                                        </div>
                                        <button onClick={() => handleDeleteUnit(u.id)} className="p-1.5 rounded-lg hover:bg-red-50 text-slate-300 hover:text-red-500 transition-colors">
                                            <Trash2 size={13} />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {/* Modals */}
            {modal === 'add-prop' && <Modal title="Add Property" onClose={() => setModal(null)}><PropertyForm onSave={handleSaveProperty} onClose={() => setModal(null)} loading={saving} /></Modal>}
            {modal === 'edit-prop' && <Modal title="Edit Property" onClose={() => setModal(null)}><PropertyForm initial={editTarget} onSave={handleSaveProperty} onClose={() => setModal(null)} loading={saving} /></Modal>}
            {modal === 'add-unit' && <Modal title={`Add Room/Unit to ${selected?.name}`} onClose={() => setModal(null)}><UnitForm propertyId={selected?.id} selectedPropertyType={selected?.type} onSave={handleAddUnit} onClose={() => setModal(null)} loading={saving} /></Modal>}
        </div>
    );
}
