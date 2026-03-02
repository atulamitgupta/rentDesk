import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Mail, MessageSquare, Send, Phone, MapPin, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';

export default function ContactUs() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [form, setForm] = useState({ name: '', subject: '', message: '' });

    const handleSubmit = (e) => {
        e.preventDefault();
        setLoading(true);
        // Simulate API call
        setTimeout(() => {
            toast.success("Message sent! We'll get back to you soon.");
            setForm({ name: '', subject: '', message: '' });
            setLoading(false);
        }, 1500);
    };

    const handleWhatsApp = () => {
        window.open(`https://wa.me/919999999999?text=Hi Cloud Bass, I need help with my project.`, '_blank');
    };

    return (
        <div className="min-h-screen bg-[#F8F8F7] text-slate-800 pb-24">
            {/* Header */}
            <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-orange-100 px-6 py-4 flex items-center justify-between">
                <button
                    onClick={() => navigate('/')}
                    className="flex items-center gap-2 text-slate-600 font-bold hover:text-orange-500 transition-colors"
                >
                    <ArrowLeft size={20} />
                    <span>Back to Home</span>
                </button>
                <h1 className="text-lg font-black text-slate-800 tracking-tight">Contact Us</h1>
                <div className="w-20 lg:block hidden"></div>
            </header>

            <main className="max-w-2xl mx-auto px-6 py-12">
                <div className="text-center mb-12">
                    <h2 className="text-3xl font-black text-slate-900 mb-3 tracking-tight">Get in Touch</h2>
                    <p className="text-slate-500 font-bold">Have questions? We're here to help you manage your properties better.</p>
                </div>

                <div className="bg-white rounded-[2.5rem] p-8 lg:p-10 border border-orange-50 shadow-xl shadow-orange-100/20">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">Your Name</label>
                            <input
                                required
                                value={form.name}
                                onChange={e => setForm({ ...form, name: e.target.value })}
                                placeholder="Enter your full name"
                                className="w-full px-5 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-orange-500 transition-all font-semibold"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">Subject</label>
                            <input
                                required
                                value={form.subject}
                                onChange={e => setForm({ ...form, subject: e.target.value })}
                                placeholder="What is this regarding?"
                                className="w-full px-5 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-orange-500 transition-all font-semibold"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">Message</label>
                            <textarea
                                required
                                rows="5"
                                value={form.message}
                                onChange={e => setForm({ ...form, message: e.target.value })}
                                placeholder="How can we help you?"
                                className="w-full px-5 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-orange-500 transition-all font-semibold resize-none"
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-5 bg-orange-500 hover:bg-orange-600 text-white font-black rounded-2xl shadow-xl shadow-orange-100 flex items-center justify-center gap-3 transition-all active:scale-95 disabled:opacity-70"
                        >
                            {loading ? <Loader2 size={20} className="animate-spin" /> : <Send size={20} />}
                            <span>Send Message</span>
                        </button>
                    </form>
                </div>

                {/* Info Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-8">
                    <div className="bg-white p-6 rounded-3xl border border-orange-50 flex items-center gap-4">
                        <div className="w-12 h-12 bg-orange-50 rounded-2xl flex items-center justify-center text-orange-600">
                            <Mail size={20} />
                        </div>
                        <div className="min-w-0">
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Email Support</p>
                            <p className="text-sm font-black text-slate-800 truncate">support@cloudbass.com</p>
                        </div>
                    </div>
                    <div className="bg-white p-6 rounded-3xl border border-orange-50 flex items-center gap-4">
                        <div className="w-12 h-12 bg-orange-50 rounded-2xl flex items-center justify-center text-orange-600">
                            <MapPin size={20} />
                        </div>
                        <div className="min-w-0">
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Office</p>
                            <p className="text-sm font-black text-slate-800">Gurgaon, Haryana</p>
                        </div>
                    </div>
                </div>
            </main>

            {/* WhatsApp Floating Button */}
            <button
                onClick={handleWhatsApp}
                className="fixed bottom-8 right-8 w-16 h-16 bg-green-500 text-white rounded-full shadow-2xl flex items-center justify-center z-50 hover:bg-green-600 transition-all hover:scale-110 active:scale-90 shadow-green-200/50"
            >
                <MessageSquare size={28} fill="white" />
            </button>
        </div>
    );
}
