import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Building2, Users, ShieldCheck, Heart } from 'lucide-react';

export default function AboutUs() {
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
                <h1 className="text-lg font-black text-slate-800 tracking-tight">About Cloud Bass</h1>
                <div className="w-20 lg:block hidden"></div>
            </header>

            <main className="max-w-4xl mx-auto px-6 py-12">
                {/* Hero Section */}
                <section className="text-center mb-16">
                    <div className="inline-flex items-center justify-center w-20 h-20 bg-orange-100 rounded-3xl text-orange-600 mb-6 shadow-xl shadow-orange-100/50">
                        <Building2 size={40} />
                    </div>
                    <h2 className="text-4xl font-black text-slate-900 mb-4 tracking-tight">Our Mission</h2>
                    <p className="text-lg text-slate-500 font-medium leading-relaxed max-w-2xl mx-auto">
                        Empowering property owners with smart, mobile-first tools to manage apartments, PG, and hostels effortlessly.
                    </p>
                </section>

                {/* Core Values Grid */}
                <div className="grid md:grid-cols-2 gap-6 mb-16">
                    {[
                        {
                            icon: Users,
                            title: "Resident First",
                            desc: "We build features that improve the relationship between landlords and tenants through transparency."
                        },
                        {
                            icon: ShieldCheck,
                            title: "Secure & Transparent",
                            desc: "Your data privacy is our top priority. We ensure encrypted records for all financial transactions."
                        },
                        {
                            icon: Heart,
                            title: "Made for India",
                            desc: "Tailored specifically for the Indian rental market — from PG sharing logic to WhatsApp reminders."
                        },
                        {
                            icon: Building2,
                            title: "Scalable Growth",
                            desc: "Whether you have 1 flat or 10 hostels, our platform scales with your business needs."
                        }
                    ].map((val, i) => (
                        <div key={i} className="bg-white p-8 rounded-[2.5rem] border border-orange-50 shadow-sm hover:shadow-md transition-shadow">
                            <div className="w-12 h-12 bg-orange-50 rounded-2xl flex items-center justify-center text-orange-500 mb-6">
                                <val.icon size={24} />
                            </div>
                            <h3 className="text-xl font-black text-slate-800 mb-3">{val.title}</h3>
                            <p className="text-slate-500 font-medium leading-relaxed">{val.desc}</p>
                        </div>
                    ))}
                </div>

                {/* Content Section */}
                <section className="bg-white p-10 rounded-[3rem] border border-orange-50 shadow-sm prose prose-slate max-w-none">
                    <p className="text-lg font-bold text-slate-700 mb-4">What is Cloud Bass?</p>
                    <p className="text-slate-600 leading-relaxed mb-6 font-medium">
                        Cloud Bass was born out of a simple observation: managing rental properties in India is still manual, messy, and stressful. Landlords often balance paper ledgers, bank statements, and endless WhatsApp chats.
                    </p>
                    <p className="text-slate-600 leading-relaxed mb-6 font-medium">
                        We've consolidated everything into one powerful dashboard. Whether you're managing a 3-bedroom apartment or a 50-bed hostel, our system handles the complexity of shared rooms, individual tenant billing, and automated reminders so you can focus on growing your portfolio.
                    </p>
                </section>
            </main>
        </div>
    );
}
