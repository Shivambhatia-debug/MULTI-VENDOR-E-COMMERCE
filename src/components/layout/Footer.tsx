import Link from "next/link";
import { Mail, Globe, MessageCircle } from "lucide-react";

const Footer = () => {
    return (
        <footer className="bg-slate-900 text-slate-300">
            <div className="max-w-7xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
                    <div className="col-span-1 md:col-span-1">
                        <Link href="/" className="flex items-center gap-2 mb-6">
                            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                                <span className="text-white font-bold text-lg">G</span>
                            </div>
                            <span className="text-xl font-bold text-white">Golalita</span>
                        </Link>
                        <p className="text-slate-400 text-sm leading-relaxed mb-6">
                            The next-generation commerce operating system. Build, scale, and manage your business across every channel.
                        </p>
                        <div className="flex space-x-4">
                            <a href="#" className="hover:text-blue-500 transition-colors"><MessageCircle size={20} /></a>
                            <a href="#" className="hover:text-blue-400 transition-colors"><Globe size={20} /></a>
                            <a href="#" className="hover:text-pink-500 transition-colors"><MessageCircle size={20} /></a>
                            <a href="#" className="hover:text-blue-600 transition-colors"><MessageCircle size={20} /></a>
                        </div>
                    </div>

                    <div>
                        <h3 className="text-white font-semibold mb-6">Platform</h3>
                        <ul className="space-y-4 text-sm">
                            <li><Link href="#" className="hover:text-white transition-colors">Store Builder</Link></li>
                            <li><Link href="#" className="hover:text-white transition-colors">Marketplace</Link></li>
                            <li><Link href="#" className="hover:text-white transition-colors">Vendor Dashboard</Link></li>
                            <li><Link href="#" className="hover:text-white transition-colors">API Reference</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h3 className="text-white font-semibold mb-6">Resources</h3>
                        <ul className="space-y-4 text-sm">
                            <li><Link href="#" className="hover:text-white transition-colors">Documentation</Link></li>
                            <li><Link href="#" className="hover:text-white transition-colors">Help Center</Link></li>
                            <li><Link href="#" className="hover:text-white transition-colors">Pricing</Link></li>
                            <li><Link href="#" className="hover:text-white transition-colors">Case Studies</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h3 className="text-white font-semibold mb-6">Contact Us</h3>
                        <p className="text-sm text-slate-400 mb-4">Stay updated with our latest news and features.</p>
                        <div className="flex gap-2">
                            <input
                                type="email"
                                placeholder="Email address"
                                className="bg-slate-800 border-none rounded-lg px-4 py-2 text-sm w-full focus:ring-2 focus:ring-blue-600 transition-all outline-none"
                            />
                            <button className="bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-lg transition-colors">
                                <Mail size={20} />
                            </button>
                        </div>
                    </div>
                </div>

                <div className="border-t border-slate-800 mt-16 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-slate-500 shadow-2xl">
                    <p>© 2026 Golalita E-Commerce. All rights reserved.</p>
                    <div className="flex space-x-6">
                        <Link href="#" className="hover:text-white">Privacy Policy</Link>
                        <Link href="#" className="hover:text-white">Terms of Service</Link>
                        <Link href="#" className="hover:text-white">Cookie Policy</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
