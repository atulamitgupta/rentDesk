// =============================================================
//  Page: Tenants (Local State Version)
//  File : client/src/pages/Tenants.jsx
// =============================================================

import { useState, useEffect } from 'react';
import { Users, Plus, Search, MessageSquare, Home, Phone, X, UserPlus } from 'lucide-react';
import AddTenant from '../components/AddTenant.jsx';
import TenantDetails from '../components/TenantDetails.jsx';
import { propertiesApi } from '../api/index.js';

const INITIAL_TENANTS = [
    {
        id: 1, name: 'Priya Sharma', room: '101', phone: '+919876543210', property: 'Palm Heights',
        email: 'priya@example.com', emergencyName: 'Rajesh Sharma', emergencyMobile: '+919999999999'
    },
    { id: 2, name: 'Rahul Verma', room: '204', phone: '+919876543211', property: 'Green Villa' },
    { id: 3, name: 'Surbhi Gupta', room: '302', phone: '+919876543212', property: 'Palm Heights' },
];

export default function Tenants() {
    const [tenants, setTenants] = useState(INITIAL_TENANTS);
    const [search, setSearch] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [selectedTenant, setSelectedTenant] = useState(null);
    const [properties, setProperties] = useState([]);

    useEffect(() => {
        const fetchProperties = async () => {
            try {
                const res = await propertiesApi.list();
                setProperties(res.data.data || []);
            } catch (err) {
                console.error('Failed to fetch properties', err);
            }
        };
        fetchProperties();
    }, []);

    const filtered = tenants.filter(t =>
        t.name.toLowerCase().includes(search.toLowerCase()) ||
        t.room.includes(search)
    );

    const handleSave = (tenantData) => {
        setTenants([...tenants, {
            id: Date.now(),
            name: tenantData.name,
            room: tenantData.roomNumber,
            phone: tenantData.mobile,
            property: tenantData.property,
            email: tenantData.email,
            permanentAddress: tenantData.permanentAddress,
            emergencyName: tenantData.emergencyName,
            emergencyMobile: tenantData.emergencyMobile
        }]);
        setShowModal(false);
    };

    const handleWhatsApp = (e, phone) => {
        e.stopPropagation();
        window.open(`https://wa.me/${phone.replace('+', '')}`, '_blank');
    };

    return (
        <div className="space-y-6 pb-24">
            {/* Header */}
            <header className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-extrabold text-slate-800 tracking-tight">Tenants</h1>
                    <p className="text-sm text-slate-400">{tenants.length} active residents</p>
                </div>
                <div className="w-12 h-12 bg-orange-100 rounded-2xl flex items-center justify-center text-orange-600">
                    <Users size={24} />
                </div>
            </header>

            {/* Search */}
            <div className="relative group">
                <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-orange-500 transition-colors" />
                <input
                    type="text"
                    placeholder="Search by name or room..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full pl-12 pr-4 py-4 bg-white border border-slate-200 rounded-2xl shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent transition-all"
                />
            </div>

            {/* List */}
            <div className="grid grid-cols-1 gap-4">
                {filtered.map(tenant => (
                    <div
                        key={tenant.id}
                        onClick={() => setSelectedTenant(tenant)}
                        className="bg-white p-4 rounded-3xl border border-orange-50 shadow-sm flex items-center justify-between group hover:border-orange-200 transition-all cursor-pointer"
                    >
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-gradient-to-br from-orange-400 to-orange-500 rounded-2xl flex items-center justify-center text-white font-black text-lg">
                                {tenant.name.charAt(0)}
                            </div>
                            <div>
                                <h3 className="font-bold text-slate-800">{tenant.name}</h3>
                                <p className="text-xs text-slate-400 flex items-center gap-1.5">
                                    <Home size={12} strokeWidth={2.5} /> Room {tenant.room} · {tenant.property}
                                </p>
                            </div>
                        </div>

                        <div className="flex items-center gap-2">
                            <button
                                onClick={(e) => handleWhatsApp(e, tenant.phone)}
                                className="p-3 bg-green-50 text-green-600 rounded-xl hover:bg-green-600 hover:text-white transition-all active:scale-90"
                            >
                                <MessageSquare size={18} />
                            </button>
                            <a
                                href={`tel:${tenant.phone}`}
                                onClick={(e) => e.stopPropagation()}
                                className="p-3 bg-slate-50 text-slate-600 rounded-xl hover:bg-slate-800 hover:text-white transition-all active:scale-90"
                            >
                                <Phone size={18} />
                            </a>
                        </div>
                    </div>
                ))}

                {filtered.length === 0 && (
                    <div className="text-center py-12 bg-white rounded-3xl border border-dashed border-slate-200">
                        <Users size={48} className="mx-auto text-slate-200 mb-3" />
                        <p className="text-slate-400 font-medium">No tenants found</p>
                    </div>
                )}
            </div>

            {/* Floating Action Button */}
            <button
                onClick={() => setShowModal(true)}
                className="fixed bottom-24 right-6 w-16 h-16 bg-orange-500 text-white rounded-2xl shadow-lg shadow-orange-200 flex items-center justify-center hover:bg-orange-600 active:scale-95 transition-all z-20"
            >
                <Plus size={32} strokeWidth={3} />
            </button>

            {/* Add Tenant Modal (New Component) */}
            <AddTenant
                isOpen={showModal}
                onClose={() => setShowModal(false)}
                onSave={handleSave}
                properties={properties}
            />

            {/* Tenant Detail Modal (New Component) */}
            <TenantDetails
                isOpen={!!selectedTenant}
                tenant={selectedTenant}
                onClose={() => setSelectedTenant(null)}
                onEdit={() => {
                    // Logic for edit can be added here
                    toast.success('Edit feature coming soon!');
                }}
            />
        </div>
    );
}
