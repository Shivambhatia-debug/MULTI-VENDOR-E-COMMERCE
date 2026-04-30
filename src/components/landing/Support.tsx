"use client";

import React from "react";
import {
    Search,
    MessageCircle,
    Book,
    FileText,
    HelpCircle,
    ArrowRight,
    Mail,
    Phone,
    Globe
} from "lucide-react";
import { motion } from "framer-motion";

const categories = [
    {
        title: "Getting Started",
        desc: "New to Golalita? Learn the basics of setting up your store.",
        icon: Globe,
        color: "bg-blue-50 text-blue-600"
    },
    {
        title: "Store Builder",
        desc: "Customize your layouts, products, and branding with ease.",
        icon: Book,
        color: "bg-emerald-50 text-emerald-600"
    },
    {
        title: "Payments & Commission",
        desc: "Understand our 0% commission model and payment gateways.",
        icon: FileText,
        color: "bg-amber-50 text-amber-600"
    },
    {
        title: "Merchant App",
        desc: "Manage your business on the go with our mobile dashboard.",
        icon: MessageCircle,
        color: "bg-rose-50 text-rose-600"
    }
];

const faqs = [
    {
        q: "How do I start building my store?",
        a: "Navigate to the Store Builder section in your dashboard and follow the step-by-step setup guide."
    },
    {
        q: "What is the 0% commission model?",
        a: "Unlike other platforms, Golalita does not take a percentage of your sales. You only pay your subscription fee."
    },
    {
        q: "Can I use my own domain?",
        a: "Yes, all our plans include a free domain SSL certificate or you can connect your existing one."
    }
];

export default function Support() {
    return (
        <div className="min-h-screen bg-white">
            {/* Hero Section */}
            <section className="relative pt-40 pb-24 overflow-hidden bg-slate-950 text-white">
                <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-slate-400 to-transparent" />
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                    >
                        <h1 className="text-5xl lg:text-7xl font-black mb-8 uppercase tracking-tighter">Support Center</h1>
                        <p className="text-slate-400 text-lg max-w-2xl mx-auto mb-12 font-medium">
                            How can we help you today? Search our knowledge base or browse categories below.
                        </p>

                        <div className="max-w-2xl mx-auto relative group">
                            <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-white transition-colors" size={20} />
                            <input
                                type="text"
                                placeholder="Search help articles..."
                                className="w-full bg-white/5 border border-white/10 rounded-2xl py-6 pl-16 pr-8 text-white focus:outline-none focus:ring-1 focus:ring-white/20 transition-all font-medium"
                            />
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Categories */}
            <section className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {categories.map((cat, i) => (
                        <motion.div
                            key={i}
                            whileHover={{ y: -5 }}
                            className="p-8 border border-slate-100 rounded-3xl hover:shadow-2xl transition-all cursor-pointer group"
                        >
                            <div className={`w-14 h-14 rounded-2xl ${cat.color} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                                <cat.icon size={28} />
                            </div>
                            <h3 className="text-lg font-black text-slate-950 mb-3 uppercase tracking-tight">{cat.title}</h3>
                            <p className="text-slate-500 text-sm leading-relaxed mb-6 font-medium">{cat.desc}</p>
                            <div className="flex items-center gap-2 text-slate-950 font-black text-[10px] uppercase tracking-widest">
                                View Articles <ArrowRight size={14} />
                            </div>
                        </motion.div>
                    ))}
                </div>
            </section>

            {/* FAQs & Contact Grid */}
            <section className="py-24 bg-slate-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-20">
                        {/* FAQ Column */}
                        <div>
                            <h2 className="text-3xl font-black text-slate-950 mb-12 uppercase tracking-tighter">Frequently Asked</h2>
                            <div className="space-y-8">
                                {faqs.map((faq, i) => (
                                    <div key={i} className="border-b border-slate-200 pb-8 last:border-0">
                                        <h4 className="text-sm font-black text-slate-950 mb-3 uppercase tracking-tight flex items-center gap-3">
                                            <HelpCircle size={16} className="text-slate-400" />
                                            {faq.q}
                                        </h4>
                                        <p className="text-slate-600 text-sm leading-relaxed font-medium pl-7">{faq.a}</p>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Contact Form Column */}
                        <div className="bg-white p-10 rounded-[2.5rem] border border-slate-200 shadow-xl">
                            <h2 className="text-2xl font-black text-slate-950 mb-4 uppercase tracking-tighter">Direct Message</h2>
                            <p className="text-slate-500 text-sm mb-8 font-medium">Can't find what you need? Send us a message and our team will get back to you in 24h.</p>

                            <form className="space-y-6">
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Name</label>
                                        <input type="text" className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3.5 text-slate-950 focus:outline-none focus:border-slate-300 font-medium text-sm" placeholder="John Doe" />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Email</label>
                                        <input type="email" className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3.5 text-slate-950 focus:outline-none focus:border-slate-300 font-medium text-sm" placeholder="john@example.com" />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Subject</label>
                                    <select className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3.5 text-slate-950 focus:outline-none focus:border-slate-300 font-medium text-sm">
                                        <option>Technical Issue</option>
                                        <option>Billing Question</option>
                                        <option>Feature Request</option>
                                        <option>Other</option>
                                    </select>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Message</label>
                                    <textarea rows={4} className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3.5 text-slate-950 focus:outline-none focus:border-slate-300 font-medium text-sm" placeholder="Tell us more about your issue..."></textarea>
                                </div>
                                <button className="w-full bg-slate-950 text-white rounded-xl py-5 text-[11px] font-black uppercase tracking-widest hover:bg-slate-900 transition-all shadow-lg active:scale-[0.98]">
                                    Send Message
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </section>

            {/* Quick Contact Bar */}
            <section className="py-12 border-t border-slate-100">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-around gap-8 text-center md:text-left">
                    <div className="flex items-center gap-4 justify-center md:justify-start">
                        <div className="w-10 h-10 bg-slate-50 rounded-full flex items-center justify-center text-slate-900"><Mail size={18} /></div>
                        <div>
                            <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Email Us</p>
                            <p className="text-sm font-black text-slate-900">support@golalita.com</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-4 justify-center md:justify-start">
                        <div className="w-10 h-10 bg-slate-50 rounded-full flex items-center justify-center text-slate-900"><Phone size={18} /></div>
                        <div>
                            <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Call Us</p>
                            <p className="text-sm font-black text-slate-900">+974 4400 0000</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-4 justify-center md:justify-start">
                        <div className="w-10 h-10 bg-slate-50 rounded-full flex items-center justify-center text-slate-900"><MessageCircle size={18} /></div>
                        <div>
                            <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Live Chat</p>
                            <p className="text-sm font-black text-slate-900">Available 24/7</p>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
