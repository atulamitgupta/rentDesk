import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Shield, Lock, Eye, FileText } from 'lucide-react';

export default function PrivacyPolicy() {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-[#F8F8F7] text-slate-800">
            {/* Header */}
            <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-orange-100 px-6 py-4 flex items-center justify-between">
                <button
                    onClick={() => navigate('/')}
                    className="flex items-center gap-2 text-slate-600 font-bold hover:text-orange-500 transition-colors"
                >
                    <ArrowLeft size={20} />
                    <span>Back to Home</span>
                </button>
                <h1 className="text-lg font-black text-slate-800 tracking-tight">Privacy Policy</h1>
                <div className="w-20 lg:block hidden"></div>
            </header>

            <main className="max-w-4xl mx-auto px-6 py-12">
                <div className="bg-white rounded-[3rem] p-10 lg:p-14 border border-orange-50 shadow-sm prose prose-slate max-w-none">
                    <div className="flex items-center gap-3 text-orange-600 mb-8">
                        <Shield size={32} />
                        <h2 className="text-3xl font-black text-slate-900 m-0">Data Privacy & Protection</h2>
                    </div>

                    <p className="text-slate-500 font-bold mb-10 border-l-4 border-orange-500 pl-4 py-2 bg-orange-50/30 rounded-r-xl">
                        Last Updated: March 2026. This policy explains how Cloud Bass collects, uses, and protects your data.
                    </p>

                    <section className="space-y-8">
                        <div>
                            <h3 className="flex items-center gap-2 text-xl font-black text-slate-800 mb-4">
                                <FileText size={20} className="text-orange-400" />
                                1. Information We Collect
                            </h3>
                            <p className="text-slate-600 font-medium leading-relaxed">
                                We collect information necessary to manage rental records, including but not limited to:
                                <strong>Landlord profile (Name, Email), Tenant details (Name, Phone, ID Proofs), and Transaction records (Rent payments, Expenses).</strong>
                            </p>
                        </div>

                        <div>
                            <h3 className="flex items-center gap-2 text-xl font-black text-slate-800 mb-4">
                                <Lock size={20} className="text-orange-400" />
                                2. How We Protect Your Data
                            </h3>
                            <p className="text-slate-600 font-medium leading-relaxed">
                                All sensitive information like ID proofs and payment history is stored on secure, encrypted servers. We implement industry-standard SSL encryption for all data transfers between your device and our systems.
                            </p>
                        </div>

                        <div>
                            <h3 className="flex items-center gap-2 text-xl font-black text-slate-800 mb-4">
                                <Eye size={20} className="text-orange-400" />
                                3. Data Usage & Third Parties
                            </h3>
                            <p className="text-slate-600 font-medium leading-relaxed">
                                We do not sell your data to third-party advertisers. Data is used solely to facilitate rent management services, such as sending WhatsApp reminders or generating income reports.
                            </p>
                        </div>

                        <div className="bg-orange-50 p-6 rounded-3xl border border-orange-100 mt-12">
                            <h4 className="text-sm font-black text-orange-700 uppercase tracking-widest mb-2">Note for Tenant Privacy</h4>
                            <p className="text-xs font-bold text-slate-600 leading-relaxed">
                                Landlords are responsible for obtaining consent from tenants before uploading their ID documents and personal information to the Cloud Bass platform.
                            </p>
                        </div>
                    </section>
                </div>
            </main>
        </div>
    );
}
