"use client";

import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import FeatureSlideshow from "@/components/landing/FeatureSlideshow";
import BrandMarquee from "@/components/landing/BrandMarquee";
import Hero from "@/components/landing/Hero";
import AppSection from "@/components/landing/AppSection";
import Pricing from "@/components/landing/Pricing";
import CTA from "@/components/landing/CTA";
import { motion } from "framer-motion";

export default function LandingPage() {
    return (
        <main className="min-h-screen bg-white">
            <Navbar />

            {/* Cinematic Feature Hero (Slideshow) */}
            <FeatureSlideshow />

            {/* Brand Marquee */}
            <BrandMarquee />

            {/* Interactive Showcase Section */}
            <Hero />

            {/* App Promotion */}
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.8 }}
                className="section-padding py-0 mb-12"
            >
                <AppSection />
            </motion.div>

            {/* Pricing Section */}
            <motion.div
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.8 }}
            >
                <Pricing />
            </motion.div>

            {/* Final CTA */}
            <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.8 }}
            >
                <CTA />
            </motion.div>

            <Footer />
        </main>
    );
}
