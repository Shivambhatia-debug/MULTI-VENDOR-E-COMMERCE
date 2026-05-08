"use client";

import { Settings, Save, Shield, Globe, Bell, CreditCard, Sliders, Key, Clock, DollarSign, RefreshCw, Mail, MessageSquare, MapPin, Loader2 } from "lucide-react";
import { useState, useEffect } from "react";

export default function AdminSettingsPage() {
    const [activeTab, setActiveTab] = useState("General");
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    
    const [settings, setSettings] = useState({
        general: { platform_fee: "2.5", default_currency: "QAR" },
        security: { mfa_required: false, session_timeout: "30" },
        payments: { stripe_enabled: true, payout_schedule: "weekly" },
        notifications: { email_alerts: true, sms_alerts: false },
        region: { timezone: "Asia/Qatar", language: "en" }
    });

    useEffect(() => {
        const fetchSettings = async () => {
            try {
                const token = localStorage.getItem("golalita_token");
                const res = await fetch("/api/python/admin/platform/settings", {
                    headers: { "Authorization": `Bearer ${token}` }
                });
                if (res.ok) {
                    const data = await res.json();
                    setSettings({
                        general: data.general || settings.general,
                        security: data.security || settings.security,
                        payments: data.payments || settings.payments,
                        notifications: data.notifications || settings.notifications,
                        region: data.region || settings.region,
                    });
                }
            } catch (err) {
                console.error("Failed to load settings", err);
            } finally {
                setIsLoading(false);
            }
        };
        fetchSettings();
    }, []);

    const handleSave = async () => {
        setIsSaving(true);
        try {
            const token = localStorage.getItem("golalita_token");
            const res = await fetch("/api/python/admin/platform/settings", {
                method: "POST",
                headers: { 
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(settings)
            });
            if (res.ok) {
                alert("Platform settings saved successfully!");
            }
        } catch (err) {
            console.error("Failed to save", err);
            alert("Error saving settings");
        } finally {
            setIsSaving(false);
        }
    };

    const updateSetting = (category: keyof typeof settings, field: string, value: any) => {
        setSettings(prev => ({
            ...prev,
            [category]: { ...prev[category], [field]: value }
        }));
    };

    const TABS = [
        { label: "General", icon: Settings },
        { label: "Security", icon: Shield },
        { label: "Payments", icon: CreditCard },
        { label: "Notifications", icon: Bell },
        { label: "Region & Localization", icon: Globe },
    ];

    return (
        <div className="space-y-8">
            <div className="flex justify-between items-end">
                <div>
                    <h1 className="text-3xl font-black text-slate-950 uppercase tracking-tighter italic">Platform Config</h1>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1 opacity-60">Global system parameters</p>
                </div>
                <button 
                    onClick={handleSave}
                    disabled={isSaving || isLoading}
                    className="px-8 py-3.5 bg-slate-950 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest flex items-center gap-2 hover:bg-slate-900 transition-all shadow-xl active:scale-95 disabled:opacity-50"
                >
                    {isSaving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
                    {isSaving ? "Saving..." : "Save Changes"}
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-1 space-y-4">
                    {TABS.map((item, i) => (
                        <button 
                            key={i} 
                            onClick={() => setActiveTab(item.label)}
                            className={`w-full flex items-center gap-4 p-5 rounded-2xl border transition-all ${activeTab === item.label ? 'bg-white border-slate-950 text-slate-950 shadow-xl' : 'bg-transparent border-transparent text-slate-400 hover:bg-white hover:border-slate-100 hover:text-slate-600'}`}
                        >
                            <item.icon size={20} />
                            <span className="text-[10px] font-black uppercase tracking-widest">{item.label}</span>
                        </button>
                    ))}
                </div>

                <div className="lg:col-span-2 card-saas p-10 bg-white shadow-2xl border-slate-100 min-h-[500px]">
                    {isLoading ? (
                        <div className="h-full flex items-center justify-center">
                            <Loader2 size={32} className="animate-spin text-slate-300" />
                        </div>
                    ) : (
                        <div className="space-y-12 animate-in fade-in duration-300">
                            {activeTab === "General" && (
                                <div>
                                    <h4 className="text-[10px] font-black text-slate-950 uppercase tracking-[0.3em] mb-8 flex items-center gap-3">
                                        <Sliders size={16} /> Marketplace Constants
                                    </h4>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                        <div className="space-y-3">
                                            <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Platform Fee (%)</label>
                                            <input 
                                                type="text" 
                                                value={settings.general.platform_fee} 
                                                onChange={e => updateSetting("general", "platform_fee", e.target.value)}
                                                className="w-full bg-slate-50 border border-slate-100 rounded-xl p-4 text-sm font-black outline-none focus:ring-2 focus:ring-slate-950" 
                                            />
                                        </div>
                                        <div className="space-y-3">
                                            <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Default Currency</label>
                                            <input 
                                                type="text" 
                                                value={settings.general.default_currency} 
                                                onChange={e => updateSetting("general", "default_currency", e.target.value)}
                                                className="w-full bg-slate-50 border border-slate-100 rounded-xl p-4 text-sm font-black outline-none focus:ring-2 focus:ring-slate-950" 
                                            />
                                        </div>
                                    </div>

                                    <div className="pt-12 mt-12 border-t border-slate-50">
                                        <h4 className="text-[10px] font-black text-slate-950 uppercase tracking-[0.3em] mb-8">System Health</h4>
                                        <div className="p-6 bg-emerald-50 rounded-2xl border border-emerald-100 flex items-center justify-between">
                                            <div className="flex items-center gap-4">
                                                <div className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse" />
                                                <span className="text-[10px] font-black text-emerald-700 uppercase tracking-widest">All microservices operational</span>
                                            </div>
                                            <span className="text-[10px] font-black text-emerald-400 uppercase tracking-widest italic">Uptime: 99.99%</span>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {activeTab === "Security" && (
                                <div>
                                    <h4 className="text-[10px] font-black text-slate-950 uppercase tracking-[0.3em] mb-8 flex items-center gap-3">
                                        <Key size={16} /> Access Control
                                    </h4>
                                    <div className="space-y-8">
                                        <div className="flex items-center justify-between p-6 bg-slate-50 rounded-2xl border border-slate-100">
                                            <div>
                                                <p className="text-sm font-black text-slate-950 uppercase tracking-tight">Require MFA for Merchants</p>
                                                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mt-1">Force 2FA on merchant login</p>
                                            </div>
                                            <label className="relative inline-flex items-center cursor-pointer">
                                                <input type="checkbox" className="sr-only peer" checked={settings.security.mfa_required} onChange={e => updateSetting("security", "mfa_required", e.target.checked)} />
                                                <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-slate-950"></div>
                                            </label>
                                        </div>
                                        <div className="space-y-3">
                                            <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2"><Clock size={12}/> Session Timeout (Minutes)</label>
                                            <input 
                                                type="number" 
                                                value={settings.security.session_timeout} 
                                                onChange={e => updateSetting("security", "session_timeout", e.target.value)}
                                                className="w-full bg-slate-50 border border-slate-100 rounded-xl p-4 text-sm font-black outline-none focus:ring-2 focus:ring-slate-950" 
                                            />
                                        </div>
                                    </div>
                                </div>
                            )}

                            {activeTab === "Payments" && (
                                <div>
                                    <h4 className="text-[10px] font-black text-slate-950 uppercase tracking-[0.3em] mb-8 flex items-center gap-3">
                                        <DollarSign size={16} /> Gateway Configuration
                                    </h4>
                                    <div className="space-y-8">
                                        <div className="flex items-center justify-between p-6 bg-blue-50/50 rounded-2xl border border-blue-100">
                                            <div>
                                                <p className="text-sm font-black text-blue-950 uppercase tracking-tight">Stripe Processing</p>
                                                <p className="text-[9px] font-black text-blue-400 uppercase tracking-widest mt-1">Accept global credit cards</p>
                                            </div>
                                            <label className="relative inline-flex items-center cursor-pointer">
                                                <input type="checkbox" className="sr-only peer" checked={settings.payments.stripe_enabled} onChange={e => updateSetting("payments", "stripe_enabled", e.target.checked)} />
                                                <div className="w-11 h-6 bg-blue-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-blue-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                                            </label>
                                        </div>
                                        <div className="space-y-3">
                                            <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2"><RefreshCw size={12}/> Merchant Payout Schedule</label>
                                            <select 
                                                value={settings.payments.payout_schedule}
                                                onChange={e => updateSetting("payments", "payout_schedule", e.target.value)}
                                                className="w-full bg-slate-50 border border-slate-100 rounded-xl p-4 text-sm font-black outline-none focus:ring-2 focus:ring-slate-950 uppercase"
                                            >
                                                <option value="daily">Daily</option>
                                                <option value="weekly">Weekly</option>
                                                <option value="monthly">Monthly</option>
                                            </select>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {activeTab === "Notifications" && (
                                <div>
                                    <h4 className="text-[10px] font-black text-slate-950 uppercase tracking-[0.3em] mb-8 flex items-center gap-3">
                                        <Mail size={16} /> Communication Protocols
                                    </h4>
                                    <div className="space-y-4">
                                        <div className="flex items-center justify-between p-6 bg-slate-50 rounded-2xl border border-slate-100">
                                            <div className="flex items-center gap-4">
                                                <Mail className="text-slate-400" size={20} />
                                                <div>
                                                    <p className="text-sm font-black text-slate-950 uppercase tracking-tight">System Email Alerts</p>
                                                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mt-1">Admin daily summaries</p>
                                                </div>
                                            </div>
                                            <label className="relative inline-flex items-center cursor-pointer">
                                                <input type="checkbox" className="sr-only peer" checked={settings.notifications.email_alerts} onChange={e => updateSetting("notifications", "email_alerts", e.target.checked)} />
                                                <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-slate-950"></div>
                                            </label>
                                        </div>
                                        <div className="flex items-center justify-between p-6 bg-slate-50 rounded-2xl border border-slate-100">
                                            <div className="flex items-center gap-4">
                                                <MessageSquare className="text-slate-400" size={20} />
                                                <div>
                                                    <p className="text-sm font-black text-slate-950 uppercase tracking-tight">SMS Critical Alerts</p>
                                                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mt-1">Downtime notifications</p>
                                                </div>
                                            </div>
                                            <label className="relative inline-flex items-center cursor-pointer">
                                                <input type="checkbox" className="sr-only peer" checked={settings.notifications.sms_alerts} onChange={e => updateSetting("notifications", "sms_alerts", e.target.checked)} />
                                                <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-slate-950"></div>
                                            </label>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {activeTab === "Region & Localization" && (
                                <div>
                                    <h4 className="text-[10px] font-black text-slate-950 uppercase tracking-[0.3em] mb-8 flex items-center gap-3">
                                        <MapPin size={16} /> Regional Overrides
                                    </h4>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                        <div className="space-y-3">
                                            <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Base Timezone</label>
                                            <select 
                                                value={settings.region.timezone}
                                                onChange={e => updateSetting("region", "timezone", e.target.value)}
                                                className="w-full bg-slate-50 border border-slate-100 rounded-xl p-4 text-sm font-black outline-none focus:ring-2 focus:ring-slate-950"
                                            >
                                                <option value="Asia/Qatar">Asia/Qatar (AST)</option>
                                                <option value="UTC">UTC Standard</option>
                                                <option value="America/New_York">America/New_York (EST)</option>
                                            </select>
                                        </div>
                                        <div className="space-y-3">
                                            <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Platform Language</label>
                                            <select 
                                                value={settings.region.language}
                                                onChange={e => updateSetting("region", "language", e.target.value)}
                                                className="w-full bg-slate-50 border border-slate-100 rounded-xl p-4 text-sm font-black outline-none focus:ring-2 focus:ring-slate-950"
                                            >
                                                <option value="en">English (Global)</option>
                                                <option value="ar">Arabic (Qatar)</option>
                                            </select>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
