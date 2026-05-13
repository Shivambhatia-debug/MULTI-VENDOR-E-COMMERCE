"use client";

import React from "react";
import {
    Globe,
    Cpu,
    Zap,
    Layout,
    Settings,
    Shield,
    Sparkles,
    Bot,
    Terminal,
    Loader2,
    ArrowRight,
    HelpCircle,
    Mail,
    Phone,
    MessageCircle,
    AlertCircle,
    TrendingUp,
    BarChart3,
    LayoutDashboard
} from "lucide-react";
import { motion } from "framer-motion";
import { useMerchant } from "@/context/MerchantContext";

const AI_LOGO = "/web background/web background/logo 3 png.png";

const agents = [
    { id: 'billing', name: 'Billing Agent', status: 'Active', icon: Settings, color: 'text-blue-500' },
    { id: 'tech', name: 'Systems Agent', status: 'Analyzing', icon: Terminal, color: 'text-emerald-500' },
    { id: 'marketing', name: 'Strategy Agent', status: 'Standby', icon: Zap, color: 'text-amber-500' }
];

const categories = [
    {
        title: "Autonomous Setup",
        desc: "Deploy your entire store infrastructure using Nexus AI agents.",
        icon: Cpu,
        color: "bg-blue-600/10 text-blue-600"
    },
    {
        title: "Agent Matrix",
        desc: "Customize specialized AI agents for your customer service.",
        icon: Bot,
        color: "bg-emerald-600/10 text-emerald-600"
    },
    {
        title: "Cloud Infrastructure",
        desc: "Manage high-performance hosting and global CDN nodes.",
        icon: Globe,
        color: "bg-amber-600/10 text-amber-600"
    },
    {
        title: "Enterprise Security",
        desc: "Next-gen encryption and identity protocol management.",
        icon: Shield,
        color: "bg-rose-600/10 text-rose-600"
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
    const { user, merchantInfo } = useMerchant();
    // Advanced Role Detection: admin > merchant > customer (guest)
    const role = user?.role === "admin" ? "admin" : (user ? "merchant" : "customer");
    
    const [messages, setMessages] = React.useState<any[]>([]);
    const [command, setCommand] = React.useState("");
    const [isLoading, setIsLoading] = React.useState(false);
    const [isThinking, setIsThinking] = React.useState(false);

    // Multi-Tier Contextual Insights
    const getInsights = () => {
        if (role === "admin") return [
            { id: 1, title: "Platform Revenue", desc: "+22% growth this month.", icon: BarChart3, color: "text-emerald-400", border: "border-emerald-400/20" },
            { id: 2, title: "Merchant Queue", desc: "12 partners awaiting audit.", icon: LayoutDashboard, color: "text-amber-400", border: "border-amber-400/20" },
            { id: 3, title: "Node Clusters", desc: "99.9% uptime across 14 regions.", icon: Globe, color: "text-indigo-400", border: "border-indigo-400/20" }
        ];
        if (role === "merchant") return [
            { id: 1, title: "Stock Alert", desc: "Titanium Gear: 3 units left.", icon: AlertCircle, color: "text-rose-400", border: "border-rose-400/20" },
            { id: 2, title: "Growth", desc: "Luxury watches: +12% growth.", icon: TrendingUp, color: "text-emerald-400", border: "border-emerald-400/20" },
            { id: 3, title: "Security", desc: "Nodes stable. Data encrypted.", icon: Shield, color: "text-indigo-400", border: "border-indigo-400/20" }
        ];
        return [
            { id: 1, title: "Multi-Vendor", desc: "Manage 1000+ vendors seamlessly.", icon: Globe, color: "text-emerald-400", border: "border-emerald-400/20" },
            { id: 2, title: "AI Core", desc: "Predictive analytics & 24/7 AI.", icon: Sparkles, color: "text-indigo-400", border: "border-indigo-400/20" },
            { id: 3, title: "Support", desc: "Dedicated technical sales protocol.", icon: MessageCircle, color: "text-rose-400", border: "border-rose-400/20" }
        ];
    };

    const insights = getInsights();
    const scrollRef = React.useRef<HTMLDivElement>(null);

    React.useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages, isThinking]);

    React.useEffect(() => {
        // Multi-Tier Contextual Greeting
        setTimeout(() => {
            let greeting = "";
            if (role === "admin") {
                greeting = `Global Protocol Online. Welcome, Administrator. Infrastructure is operating at peak efficiency (Nodes: 14/14). I've detected 12 new merchant applications in the verification queue and a 22% spike in global transaction volume. How shall we govern the platform today?`;
            } else if (role === "merchant") {
                greeting = `Protocol active. Welcome back, ${merchantInfo?.name || 'Partner'}. I've audited your infrastructure: I detected a low stock warning for Titanium Gear and a significant growth trend in the Luxury category. How would you like to proceed?`;
            } else {
                greeting = `Protocol Online. Welcome to Golalita AI. I am your autonomous onboarding partner. Ready to build the future of E-Commerce? I can explain our multi-vendor packages, AI integration, or help you start your 14-day free trial. How can I assist you today?`;
            }

            setMessages([{ 
                role: 'ai', 
                agent_name: 'GOLALITA AI',
                agent_id: 'strategy_agent',
                content: greeting,
                icon: role === "admin" ? Shield : Bot,
                color: 'bg-indigo-500/20',
                textColor: 'text-indigo-400'
            }]);
        }, 1000);
    }, [merchantInfo, role]);

    const handleExecute = async (inputMsg?: string) => {
        const userMsg = inputMsg || command;
        if (!userMsg.trim()) return;
        
        setCommand("");
        setMessages(prev => [...prev, { role: 'user', content: userMsg }]);
        setIsThinking(true);

        try {
            const response = await fetch("/api/nexus/chat", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ 
                    message: userMsg,
                    role: role,
                    merchant_id: merchantInfo?.id
                })
            });
            const data = await response.json();
            
            const agentMap: any = {
                'systems_agent': { icon: Terminal, color: 'bg-emerald-500/20', text: 'text-emerald-400' },
                'billing_agent': { icon: Settings, color: 'bg-indigo-500/20', text: 'text-indigo-400' },
                'strategy_agent': { icon: Zap, color: 'bg-indigo-500/20', text: 'text-indigo-400' }
            };

            const agentInfo = agentMap[data?.agent_id] || { icon: Bot, color: 'bg-slate-500/20', text: 'text-slate-400' };

            setMessages(prev => [...prev, { 
                ...data, 
                content: data?.content || "Protocol synchronized.",
                icon: agentInfo.icon,
                color: agentInfo.color,
                textColor: agentInfo.text
            }]);
        } catch (error) {
            console.error("AI Error:", error);
            setMessages(prev => [...prev, { 
                role: 'ai', 
                agent_name: 'SYSTEM',
                content: "Error syncing with Golalita AI. Check your link.",
                icon: AlertCircle,
                color: 'bg-rose-500/20',
                textColor: 'text-rose-400'
            }]);
        } finally {
            setIsThinking(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#020617] text-slate-100 flex flex-col font-sans selection:bg-indigo-500/30">
            {/* Cleaner Header */}
            <header className="border-b border-white/5 bg-[#020617]/80 backdrop-blur-xl py-4 px-10 flex items-center justify-between sticky top-0 z-50">
                <div className="flex items-center gap-4">
                    <img src={AI_LOGO} alt="Golalita" className="h-10 w-10 object-contain" />
                    <div>
                        <h1 className="text-xl font-bold tracking-tight uppercase tracking-tighter">GOLALITA <span className="text-indigo-400">AI</span></h1>
                        <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">
                            {role === "admin" ? "Global Mission Control" : "Autonomous Hub"}
                        </p>
                    </div>
                </div>
                
                <div className="hidden md:flex items-center gap-6">
                    <div className="flex items-center gap-2 px-4 py-1.5 rounded-full border border-white/5 bg-white/5">
                        <div className={`h-1.5 w-1.5 rounded-full ${role === "admin" ? "bg-amber-500" : "bg-emerald-500"}`}></div>
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                            {role === "admin" ? "Root Access" : "Secure Link"}
                        </span>
                    </div>
                    <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                        {role.toUpperCase()} MODE
                    </div>
                </div>
            </header>

            <main className="flex-1 flex overflow-hidden">
                {/* Simplified Sidebar */}
                <aside className="w-72 border-r border-white/5 bg-black/20 p-8 hidden lg:flex flex-col gap-10">
                    <div>
                        <h2 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 mb-6 flex items-center gap-2">
                            {role === "admin" ? "Global Metrics" : (role === "merchant" ? "Insights" : "Platform Features")}
                        </h2>
                        <div className="space-y-4">
                            {insights.map((insight) => (
                                <div key={insight.id} className={`border ${insight.border} bg-white/[0.02] p-4 rounded-2xl group transition-all`}>
                                    <div className="flex items-center gap-3 mb-2">
                                        <insight.icon size={14} className={insight.color} />
                                        <span className={`text-[10px] font-bold uppercase tracking-widest ${insight.color}`}>{insight.title}</span>
                                    </div>
                                    <p className="text-[11px] text-slate-400 leading-relaxed font-medium">{insight.desc}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="mt-auto p-6 rounded-2xl bg-indigo-500/5 border border-indigo-500/10">
                        {role === "admin" ? (
                            <>
                                <h3 className="text-xs font-bold mb-2 text-slate-300">System Load</h3>
                                <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
                                    <div className="h-full w-[42%] bg-amber-500 rounded-full"></div>
                                </div>
                                <p className="text-[10px] text-slate-500 mt-2 font-bold uppercase tracking-widest italic">42% GPU Cycles</p>
                            </>
                        ) : role === "merchant" ? (
                            <>
                                <h3 className="text-xs font-bold mb-2 text-slate-300">Protocol Health</h3>
                                <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
                                    <div className="h-full w-[85%] bg-indigo-500 rounded-full"></div>
                                </div>
                                <p className="text-[10px] text-slate-500 mt-2 font-bold uppercase tracking-widest italic">85% Optimization</p>
                            </>
                        ) : (
                            <>
                                <h3 className="text-xs font-bold mb-2 text-slate-300">Package Status</h3>
                                <p className="text-[11px] text-slate-400 mb-4 leading-relaxed">"Start your journey with our **Enterprise Hub** package. Save 20% on annual billing."</p>
                                <button className="text-[10px] font-black uppercase tracking-widest text-indigo-400 flex items-center gap-2">
                                    View Packages <ArrowRight size={12} />
                                </button>
                            </>
                        )}
                    </div>
                </aside>

                {/* Refined Terminal Area */}
                <section className="flex-1 flex flex-col relative bg-gradient-to-b from-[#020617] to-black">
                    <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center opacity-[0.03] pointer-events-none"></div>
                    
                    <div 
                        ref={scrollRef}
                        className="flex-1 overflow-y-auto p-10 space-y-10 relative z-10"
                    >
                        {messages.map((msg, i) => (
                            <div 
                                key={i} 
                                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-in fade-in slide-in-from-bottom-2 duration-300`}
                            >
                                <div className={`flex gap-5 max-w-[80%] md:max-w-[65%] ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                                    {msg.role !== 'user' && (
                                        <div className={`h-10 w-10 shrink-0 rounded-xl ${msg.color || 'bg-white/5'} border border-white/5 flex items-center justify-center shadow-lg shadow-indigo-500/5`}>
                                            <msg.icon size={18} className={msg.textColor || "text-white"} />
                                        </div>
                                    )}
                                    <div className={`${msg.role === 'user' ? 'bg-indigo-600 text-white' : 'bg-white/[0.02] border border-white/5 text-slate-200'} p-6 rounded-2xl ${msg.role === 'user' ? 'rounded-tr-none' : 'rounded-tl-none shadow-sm backdrop-blur-sm'}`}>
                                        {msg.agent_name && (
                                            <div className="flex items-center gap-3 mb-2">
                                                <span className={`text-[9px] font-bold uppercase tracking-[0.2em] ${msg.textColor || 'text-slate-500'}`}>{msg.agent_name}</span>
                                            </div>
                                        )}
                                        <p className="text-sm font-medium leading-relaxed tracking-tight">
                                            {msg.content}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        ))}
                        
                        {isThinking && (
                            <div className="flex justify-start">
                                <div className="bg-white/5 border border-white/5 px-5 py-3 rounded-2xl rounded-tl-none flex items-center gap-3">
                                    <div className="flex gap-1">
                                        <div className="h-1 w-1 rounded-full bg-indigo-400 animate-bounce"></div>
                                        <div className="h-1 w-1 rounded-full bg-indigo-400 animate-bounce [animation-delay:0.2s]"></div>
                                        <div className="h-1 w-1 rounded-full bg-indigo-400 animate-bounce [animation-delay:0.4s]"></div>
                                    </div>
                                    <span className="text-[10px] font-bold uppercase tracking-widest text-indigo-400">Processing</span>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Simpler Control Area */}
                    <div className="p-10 bg-[#020617]/50 border-t border-white/5 backdrop-blur-3xl relative z-20">
                        <div className="flex flex-wrap gap-2 mb-6">
                            {role === "admin" ? (
                                ["Merchant Queue", "Global Revenue", "System Logs", "Revenue Audit"].map((btn) => (
                                    <button 
                                        key={btn}
                                        onClick={() => handleExecute(btn)}
                                        className="px-4 py-1.5 rounded-lg border border-white/5 bg-white/5 text-[10px] font-bold uppercase tracking-widest text-slate-500 hover:bg-white/10 transition-all active:scale-95"
                                    >
                                        {btn}
                                    </button>
                                ))
                            ) : role === "merchant" ? (
                                ["Audits", "Trends", "Stocks", "Support"].map((btn) => (
                                    <button 
                                        key={btn}
                                        onClick={() => handleExecute(btn)}
                                        className="px-4 py-1.5 rounded-lg border border-white/5 bg-white/5 text-[10px] font-bold uppercase tracking-widest text-slate-500 hover:bg-white/10 transition-all active:scale-95"
                                    >
                                        {btn}
                                    </button>
                                ))
                            ) : (
                                ["Packages", "Features", "Pricing", "Contact Sales"].map((btn) => (
                                    <button 
                                        key={btn}
                                        onClick={() => handleExecute(btn)}
                                        className="px-4 py-1.5 rounded-lg border border-white/5 bg-white/5 text-[10px] font-bold uppercase tracking-widest text-slate-500 hover:bg-white/10 transition-all active:scale-95"
                                    >
                                        {btn}
                                    </button>
                                ))
                            )}
                        </div>
                        
                        <div className="relative">
                            <div className="bg-white/[0.02] border border-white/5 rounded-xl p-1 flex items-center gap-2 focus-within:border-indigo-500/50 transition-all">
                                <input 
                                    value={command}
                                    onChange={(e) => setCommand(e.target.value)}
                                    onKeyDown={(e) => e.key === 'Enter' && handleExecute()}
                                    placeholder={role === "admin" ? "Enter Root Command..." : (role === "merchant" ? "Execute command..." : "Ask about Golalita features...")}
                                    className="flex-1 bg-transparent border-none focus:ring-0 text-sm font-medium placeholder:text-slate-700 py-3 px-4"
                                />
                                <button 
                                    onClick={() => handleExecute()}
                                    disabled={isThinking || !command.trim()}
                                    className="bg-indigo-600 hover:bg-indigo-500 text-white p-3 rounded-lg transition-all disabled:opacity-50 active:scale-95 shadow-lg shadow-indigo-500/20"
                                >
                                    <ArrowRight size={20} />
                                </button>
                            </div>
                        </div>
                    </div>
                </section>
            </main>
        </div>
    );
}
