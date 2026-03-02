import React from 'react';
import { Link } from 'react-router-dom';
import { Building2, Mail, Phone, Instagram, Twitter, Facebook } from 'lucide-react';

export default function Footer() {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="bg-white border-t border-orange-100 pt-16 pb-8 px-6">
            <div className="max-w-6xl mx-auto">
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-12 mb-16">
                    {/* Brand Section */}
                    <div className="md:col-span-1 space-y-6">
                        <div className="flex items-center gap-2">
                            <div className="w-10 h-10 bg-orange-500 rounded-xl flex items-center justify-center text-white shadow-lg shadow-orange-100">
                                <Building2 size={24} />
                            </div>
                            <span className="text-xl font-black text-slate-900 tracking-tight">Cloud Bass</span>
                        </div>
                        <p className="text-sm font-bold text-slate-400 leading-relaxed">
                            Smart rent management for modern Indian landlords. Manage your properties, tenants, and expenses with ease.
                        </p>
                        <div className="flex items-center gap-4">
                            {[Facebook, Twitter, Instagram].map((Icon, i) => (
                                <a key={i} href="#" className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400 hover:bg-orange-50 hover:text-orange-500 transition-all border border-transparent hover:border-orange-100 shadow-sm">
                                    <Icon size={18} />
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div className="space-y-6">
                        <h4 className="text-xs font-black text-slate-900 uppercase tracking-widest">Company</h4>
                        <ul className="space-y-4">
                            <li><Link to="/about" className="text-sm font-black text-slate-400 hover:text-orange-500 transition-colors">About Us</Link></li>
                            <li><Link to="/contact" className="text-sm font-black text-slate-400 hover:text-orange-500 transition-colors">Contact Us</Link></li>
                        </ul>
                    </div>

                    {/* Legal Tools Section (New) */}
                    <div className="space-y-6">
                        <h4 className="text-xs font-black text-slate-900 uppercase tracking-widest">Legal Tools</h4>
                        <ul className="space-y-4">
                            <li><Link to="/tools" className="text-sm font-black text-slate-400 hover:text-orange-500 transition-colors">Rent Agreement Generator</Link></li>
                            <li><Link to="/tools" className="text-sm font-black text-slate-400 hover:text-orange-500 transition-colors">HRA Receipt Maker</Link></li>
                            <li><Link to="/tools" className="text-sm font-black text-slate-400 hover:text-orange-500 transition-colors">Security Refund Calc</Link></li>
                        </ul>
                    </div>

                    {/* Legal Links */}
                    <div className="space-y-6">
                        <h4 className="text-xs font-black text-slate-900 uppercase tracking-widest">Legal</h4>
                        <ul className="space-y-4">
                            <li><Link to="/privacy" className="text-sm font-black text-slate-400 hover:text-orange-500 transition-colors">Privacy Policy</Link></li>
                            <li><Link to="/terms" className="text-sm font-black text-slate-400 hover:text-orange-500 transition-colors">Terms of Service</Link></li>
                        </ul>
                    </div>

                    {/* Contact Info */}
                    <div className="space-y-6">
                        <h4 className="text-xs font-black text-slate-900 uppercase tracking-widest">Support</h4>
                        <div className="space-y-4">
                            <div className="flex items-center gap-3">
                                <Mail size={16} className="text-orange-500" />
                                <span className="text-sm font-black text-slate-600">support@cloudbass.com</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <Phone size={16} className="text-orange-500" />
                                <span className="text-sm font-black text-slate-600">+91 99999 99999</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="pt-8 border-t border-slate-50 flex flex-col md:flex-row items-center justify-between gap-4">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
                        © {currentYear} Cloud Bass Rent Management. All Rights Reserved.
                    </p>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] flex items-center gap-2">
                        Made with <span className="text-orange-500 font-bold">❤</span> in India
                    </p>
                </div>
            </div>
        </footer>
    );
}
