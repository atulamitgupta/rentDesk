import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Scale, CheckSquare, AlertCircle, HelpCircle } from 'lucide-react';

export default function TermsOfService() {
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
                <h1 className="text-lg font-black text-slate-800 tracking-tight">Terms of Service</h1>
                <div className="w-20 lg:block hidden"></div>
            </header>

            <main className="max-w-4xl mx-auto px-6 py-12">
                <div className="bg-white rounded-[3rem] p-10 lg:p-14 border border-orange-50 shadow-sm prose prose-slate max-w-none">
                    <div className="flex items-center gap-3 text-orange-600 mb-8">
                        <Scale size={32} />
                        <h2 className="text-3xl font-black text-slate-900 m-0">Terms & Conditions</h2>
                    </div>

                    <p className="text-slate-500 font-bold mb-10 border-l-4 border-orange-500 pl-4 py-2 bg-orange-50/30 rounded-r-xl">
                        By using Cloud Bass, you agree to follow the rules outlined below for property and rent management.
                    </p>

                    <section className="space-y-8">
                        <div>
                            <h3 className="flex items-center gap-2 text-xl font-black text-slate-800 mb-4">
                                <CheckSquare size={20} className="text-orange-400" />
                                1. User Responsibility
                            </h3>
                            <p className="text-slate-600 font-medium leading-relaxed">
                                Landlords must ensure all data entered (rent amounts, property types, and tenant names) is accurate. Cloud Bass acts as a management tool and is not responsible for legal disputes between landlords and tenants.
                            </p>
                        </div>

                        <div>
                            <h3 className="flex items-center gap-2 text-xl font-black text-slate-800 mb-4">
                                <AlertCircle size={20} className="text-orange-400" />
                                2. Lawful Use
                            </h3>
                            <p className="text-slate-600 font-medium leading-relaxed">
                                Users shall not use the service for any illegal activities or to store unauthorized personal documents of individuals without their consent.
                            </p>
                        </div>

                        <div>
                            <h3 className="flex items-center gap-2 text-xl font-black text-slate-800 mb-4">
                                <HelpCircle size={20} className="text-orange-400" />
                                3. Service Limitations
                            </h3>
                            <p className="text-slate-600 font-medium leading-relaxed">
                                Cloud Bass reserves the right to suspend accounts that violate our terms or misuse the communication features (e.g., WhatsApp spamming).
                            </p>
                        </div>

                        <div className="bg-slate-900 p-8 rounded-[2rem] text-white mt-12">
                            <h4 className="text-xs font-black text-orange-400 uppercase tracking-widest mb-3">Service Availability</h4>
                            <p className="text-sm font-bold text-slate-300 leading-relaxed">
                                While we strive for 99.9% uptime, Cloud Bass does not guarantee uninterrupted service and is not liable for data loss due to unforeseen technical failures.
                            </p>
                        </div>
                    </section>
                </div>
            </main>
        </div>
    );
}
