import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

import { MerchantProvider } from "@/context/MerchantContext";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Golalita | Modern SaaS E-Commerce Platform",
  description: "The all-in-one platform for e-commerce, store building, and marketplaces.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className={`${inter.className} min-h-screen bg-white text-slate-900 antialiased`}>
        <MerchantProvider>
          {children}
        </MerchantProvider>
      </body>
    </html>
  );
}
