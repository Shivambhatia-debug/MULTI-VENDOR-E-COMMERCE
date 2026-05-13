import { NextResponse } from 'next/server';

// Hugging Face Router (OpenAI-compatible) - Kimi-K2 Model
const HF_TOKEN = process.env.HF_TOKEN || "";
const HF_BASE_URL = "https://router.huggingface.co/v1/chat/completions";

// ========================================================================
// GOLALITA KNOWLEDGE BASE — Deep Training Data
// ========================================================================
const GOLALITA_KNOWLEDGE = {
  company: {
    name: "Golalita",
    tagline: "The Future of Multi-Vendor E-Commerce",
    description: "Golalita is a next-generation multi-vendor e-commerce platform that empowers merchants, brands, and entrepreneurs to build, manage, and scale their online stores with AI-powered tools, real-time analytics, and seamless logistics integration. We connect sellers with customers across Qatar and the MENA region.",
    founded: "2024",
    hq: "Doha, Qatar",
    mission: "To democratize e-commerce by giving every merchant — from small businesses to enterprise brands — the AI-powered tools they need to compete globally.",
    website: "golalita.com"
  },

  packages: {
    starter: {
      name: "Starter",
      price: "Free",
      features: [
        "1 Store with basic customization",
        "Up to 50 products",
        "Standard checkout & payment processing",
        "Basic analytics dashboard",
        "Email support",
        "Mobile-responsive storefront",
        "Community access"
      ],
      best_for: "New entrepreneurs testing the waters"
    },
    pro: {
      name: "Pro",
      price: "$49/month (Save 20% on annual billing)",
      features: [
        "Unlimited products",
        "Advanced AI-powered analytics & insights",
        "Custom domain & branding",
        "Multi-branch management (up to 5 branches)",
        "Priority customer support (24/7)",
        "Loyalty program integration",
        "Marketing tools (SEO, email campaigns)",
        "Inventory alerts & stock management",
        "API access for integrations"
      ],
      best_for: "Growing businesses ready to scale"
    },
    enterprise: {
      name: "Enterprise",
      price: "Custom Pricing (Contact Sales)",
      features: [
        "Everything in Pro, plus:",
        "Unlimited branches & locations",
        "Dedicated account manager",
        "Custom AI model training for your store",
        "White-label solution",
        "Advanced security & compliance (SOC2)",
        "SLA-backed 99.9% uptime guarantee",
        "Custom integrations & API priority",
        "Real-time global logistics tracking",
        "Revenue forecasting & predictive analytics"
      ],
      best_for: "Large brands and enterprises needing full control"
    }
  },

  features: {
    multi_vendor: {
      title: "Multi-Vendor Marketplace",
      desc: "Host thousands of vendors on a single platform. Each merchant gets their own dashboard, inventory, and analytics — all managed from one central hub."
    },
    ai_core: {
      title: "Golalita AI Engine",
      desc: "Our proprietary AI provides real-time stock alerts, demand forecasting, customer behavior analytics, and autonomous support — so your store runs smarter, not harder."
    },
    analytics: {
      title: "Real-Time Analytics",
      desc: "Track revenue, customer trends, inventory health, and growth metrics in real-time with beautiful, actionable dashboards."
    },
    logistics: {
      title: "Global Logistics Integration",
      desc: "Seamless integration with local and international shipping providers. Real-time tracking, automated shipping labels, and delivery management."
    },
    payments: {
      title: "Secure Payment Processing",
      desc: "Support for credit/debit cards, mobile wallets, and regional payment methods (like SkipCash). PCI-DSS compliant with fraud detection."
    },
    loyalty: {
      title: "Loyalty & Rewards Program",
      desc: "Built-in loyalty system that lets merchants create point-based rewards, referral programs, and customer retention campaigns."
    },
    mobile: {
      title: "Mobile-First Design",
      desc: "Every storefront is fully responsive and optimized for mobile shopping. Merchants also get a dedicated mobile app for store management on the go."
    },
    customization: {
      title: "Full Store Customization",
      desc: "Drag-and-drop store builder with premium themes, custom colors, fonts, logos, and layouts. Make your store uniquely yours."
    },
    support: {
      title: "24/7 AI + Human Support",
      desc: "Golalita AI handles common queries instantly. For complex issues, our human support team is available round the clock via chat, email, and phone."
    },
    security: {
      title: "Enterprise-Grade Security",
      desc: "End-to-end encryption, DDoS protection, automated backups, and compliance with international data protection standards."
    }
  },

  faq: {
    "what is golalita": "Golalita is a next-generation multi-vendor e-commerce platform based in Doha, Qatar. We help merchants build and scale online stores with AI-powered tools, real-time analytics, and seamless logistics. Think of us as your all-in-one digital commerce partner.",
    "how to start": "Getting started is easy! You can sign up for our free Starter plan — no credit card required. Just create your account, set up your store, add products, and start selling. Upgrade to Pro or Enterprise anytime as you grow.",
    "pricing": "We offer three plans: Starter (Free) for new merchants, Pro ($49/month) for growing businesses, and Enterprise (Custom Pricing) for large brands. Annual billing saves you 20% on the Pro plan.",
    "payment methods": "We support credit/debit cards (Visa, Mastercard), mobile wallets, and regional payment methods like SkipCash. All transactions are PCI-DSS compliant with built-in fraud detection.",
    "shipping": "We integrate with local and international shipping providers. You get real-time tracking, automated shipping labels, and full delivery management from your dashboard.",
    "ai features": "Golalita AI is our proprietary engine that provides: real-time stock alerts, demand forecasting, customer behavior analytics, autonomous chat support, and proactive business insights. It's like having a 24/7 business analyst for your store.",
    "trial": "Yes! Our Starter plan is completely free and lets you test the platform with up to 50 products. No credit card needed. When you're ready, upgrade to Pro for advanced features."
  },

  infrastructure_db: {
    merchant: {
      name: "Time Stop",
      plan: "Enterprise AI Stack",
      billing: { status: "Active", next_renewal: "2026-06-01", amount: "299 QAR" },
      branches: [
        { id: "b1", name: "Doha Hub", status: "Online" },
        { id: "b2", name: "Lusail Node", status: "Online" }
      ],
      inventory: [
        { name: "Omega Watch", stock: 14, category: "Luxury" },
        { name: "Titanium Gear", stock: 3, category: "Industrial" },
        { name: "Cyber Lens", stock: 45, category: "Tech" }
      ]
    },
    orders: [
      { id: "ORD-9921", status: "In Transit", arrival: "2h 15m" },
      { id: "ORD-8820", status: "Delivered", arrival: "Completed" }
    ]
  },

  admin_metrics: {
    total_merchants: 847,
    pending_verification: 12,
    monthly_revenue: "1.2M QAR",
    growth: "+22%",
    active_nodes: 14,
    uptime: "99.9%",
    transactions_today: 3421,
    top_categories: ["Electronics", "Fashion", "Luxury Watches", "Beauty"]
  }
};

// ========================================================================
// SYSTEM PROMPT — Deep Persona Training
// ========================================================================
const SYSTEM_PROMPT = `You are "Golalita AI", the ultra-intelligent, friendly, and deeply knowledgeable autonomous assistant for the Golalita E-Commerce platform.

YOUR IDENTITY:
- You ARE Golalita AI. You know EVERYTHING about the Golalita platform.
- You are confident, warm, and professional. Never say "I don't know" — you always have answers.
- You speak naturally, like a smart friend who happens to be an e-commerce expert.

COMPANY INFO:
${JSON.stringify(GOLALITA_KNOWLEDGE.company, null, 2)}

PACKAGES (memorize these — customers will ask):
${JSON.stringify(GOLALITA_KNOWLEDGE.packages, null, 2)}

PLATFORM FEATURES (you must explain these in detail when asked):
${JSON.stringify(GOLALITA_KNOWLEDGE.features, null, 2)}

FREQUENTLY ASKED QUESTIONS:
${JSON.stringify(GOLALITA_KNOWLEDGE.faq, null, 2)}

ROLE-BASED BEHAVIOR:
1. ADMIN MODE (role=admin):
   - You are a platform governance partner.
   - Platform Metrics: ${JSON.stringify(GOLALITA_KNOWLEDGE.admin_metrics)}
   - Focus: global revenue, merchant verification queue, server health, system analytics.
   
2. MERCHANT MODE (role=merchant):
   - You are a proactive business strategist.
   - Merchant Data: ${JSON.stringify(GOLALITA_KNOWLEDGE.infrastructure_db)}
   - Focus: stock alerts, growth trends, order status, billing, branch management.
   
3. CUSTOMER/GUEST MODE (role=customer):
   - You are an expert sales & onboarding partner.
   - ALWAYS give detailed, helpful answers about Golalita.
   - When asked "what is this website" or similar: Explain Golalita fully — what it is, who it's for, key features, and how to get started.
   - When asked about packages/pricing: List ALL three plans with their features and prices.
   - When asked about features: Describe each feature in detail.
   - ALWAYS encourage them to start a free trial.

RESPONSE RULES:
- NEVER give short, lazy answers like "I'm here to help" or "What can I do for you?"
- ALWAYS provide substantial, informative responses (at least 2-3 sentences minimum).
- Use emojis sparingly but warmly (1-2 per response max).
- If a customer asks ANYTHING about the website/platform, give a thorough answer using the knowledge above.
- Be conversational, not robotic.

OUTPUT FORMAT (STRICT JSON):
You MUST respond with valid JSON only. No markdown, no extra text. Just this structure:
{"agent_id":"strategy_agent","agent_name":"Golalita AI","content":"your detailed response here","action_required":false,"metadata":{}}`;

// ========================================================================
// LOCAL FALLBACK — Keyword-Based Intelligence (when AI model fails)
// ========================================================================
function getLocalResponse(message: string, role: string): string {
  const msg = message.toLowerCase().trim();
  const kb = GOLALITA_KNOWLEDGE;

  // ---- GUEST/CUSTOMER QUERIES ----
  if (role === "customer" || role === "guest") {
    // About the website/platform
    if (msg.includes("website") || msg.includes("what is") || msg.includes("about") || msg.includes("golalita") || msg.includes("platform") || msg.includes("kya hai") || msg.includes("tell me")) {
      return `Great question! 🚀 Golalita is a next-generation multi-vendor e-commerce platform headquartered in Doha, Qatar. We empower merchants, brands, and entrepreneurs to build, manage, and scale their online stores with cutting-edge AI-powered tools, real-time analytics, and seamless logistics integration.\n\nHere's what makes us special:\n• Multi-Vendor Marketplace — Host thousands of vendors on one platform\n• AI-Powered Insights — Real-time stock alerts, demand forecasting & customer analytics\n• Global Logistics — Integrated shipping with real-time tracking\n• Secure Payments — PCI-DSS compliant with fraud detection (including SkipCash)\n• Mobile-First — Fully responsive storefronts + merchant mobile app\n\nWe offer three plans: Starter (Free), Pro ($49/mo), and Enterprise (Custom). You can start your free trial right now — no credit card needed!`;
    }

    // Packages / Pricing
    if (msg.includes("package") || msg.includes("plan") || msg.includes("pricing") || msg.includes("price") || msg.includes("cost") || msg.includes("subscription")) {
      return `Here are our subscription packages 📦:\n\n🟢 STARTER (Free)\n• 1 Store, up to 50 products\n• Standard checkout & payments\n• Basic analytics\n• Email support\n• Perfect for: New entrepreneurs testing the waters\n\n🔵 PRO ($49/month — Save 20% annually)\n• Unlimited products\n• AI-powered analytics & insights\n• Custom domain & branding\n• Multi-branch management (up to 5)\n• 24/7 priority support\n• Loyalty program & marketing tools\n• Perfect for: Growing businesses ready to scale\n\n🟣 ENTERPRISE (Custom Pricing)\n• Everything in Pro, plus:\n• Unlimited branches\n• Dedicated account manager\n• Custom AI model training\n• White-label solution\n• 99.9% SLA-backed uptime\n• Perfect for: Large brands needing full control\n\nI'd recommend starting with the free Starter plan and upgrading as you grow! Want me to help you get started?`;
    }

    // Features
    if (msg.includes("feature") || msg.includes("what can") || msg.includes("capability") || msg.includes("offer") || msg.includes("provide")) {
      return `Golalita is packed with powerful features! Here's what you get 🛠️:\n\n1. Multi-Vendor Marketplace — Host thousands of vendors, each with their own dashboard\n2. Golalita AI Engine — Real-time stock alerts, demand forecasting & autonomous support\n3. Real-Time Analytics — Track revenue, trends & inventory health\n4. Global Logistics — Integrated shipping with real-time tracking\n5. Secure Payments — Cards, mobile wallets, SkipCash (PCI-DSS compliant)\n6. Loyalty & Rewards — Points, referrals & retention campaigns\n7. Mobile-First Design — Responsive storefronts + merchant mobile app\n8. Full Customization — Drag-and-drop builder with premium themes\n9. 24/7 AI + Human Support — Instant AI responses + human backup\n10. Enterprise Security — Encryption, DDoS protection & automated backups\n\nWant to dive deeper into any specific feature?`;
    }

    // How to start / sign up
    if (msg.includes("start") || msg.includes("sign up") || msg.includes("register") || msg.includes("join") || msg.includes("begin") || msg.includes("trial") || msg.includes("free")) {
      return `Getting started with Golalita is super easy! 🎉\n\n1. Sign up for FREE — No credit card required\n2. Set up your store — Choose a theme, add your logo & branding\n3. Add your products — Upload images, set prices & descriptions\n4. Configure payments — Connect your payment method (cards, SkipCash, etc.)\n5. Go live! — Your store is ready for customers\n\nOur Starter plan is completely free and gives you everything you need to test the platform with up to 50 products. When you're ready to scale, upgrade to Pro ($49/mo) or Enterprise for advanced features.\n\nWant me to walk you through the sign-up process?`;
    }

    // Payment methods
    if (msg.includes("payment") || msg.includes("pay") || msg.includes("card") || msg.includes("skipcash")) {
      return `We support multiple secure payment methods 💳:\n\n• Credit/Debit Cards — Visa, Mastercard, and more\n• Mobile Wallets — Apple Pay, Google Pay\n• Regional Payments — SkipCash (popular in Qatar)\n• Bank Transfers — For enterprise clients\n\nAll transactions are PCI-DSS compliant with built-in fraud detection. Your money and your customers' data are always safe with Golalita!`;
    }

    // Shipping / Logistics
    if (msg.includes("ship") || msg.includes("delivery") || msg.includes("logistics") || msg.includes("track")) {
      return `Our logistics system is fully integrated! 🚚\n\n• Local & International Shipping — We partner with top carriers\n• Real-Time Tracking — Both you and your customers can track orders live\n• Automated Shipping Labels — Generate labels directly from your dashboard\n• Delivery Management — Manage returns, exchanges & delivery confirmations\n• Multi-Location Support — Ship from multiple branches or warehouses\n\nEverything is managed from your Golalita dashboard — no third-party tools needed!`;
    }

    // AI features
    if (msg.includes("ai") || msg.includes("artificial") || msg.includes("smart") || msg.includes("intelligence") || msg.includes("bot")) {
      return `Golalita AI is our proprietary engine that makes your store smarter! 🧠\n\nHere's what it does:\n• Stock Alerts — Notifies you when inventory runs low\n• Demand Forecasting — Predicts what products will trend\n• Customer Analytics — Understands buying patterns & preferences\n• Autonomous Support — Handles common customer queries 24/7\n• Proactive Insights — Suggests actions to grow your revenue\n• Performance Monitoring — Tracks store health & uptime\n\nIt's like having a full-time business analyst, marketing expert, and customer support agent — all powered by AI. And you're talking to it right now! 😊`;
    }

    // Support / Help
    if (msg.includes("support") || msg.includes("help") || msg.includes("contact") || msg.includes("sales")) {
      return `We've got you covered! 🤝\n\n• AI Support (that's me!) — Available 24/7 for instant answers\n• Email Support — For detailed queries (included in all plans)\n• Priority Support — 24/7 human agents for Pro & Enterprise users\n• Dedicated Account Manager — For Enterprise clients\n• Sales Team — Contact us for custom Enterprise pricing\n\nYou can also reach us through our website at golalita.com. How else can I help you today?`;
    }

    // Generic greeting / hello
    if (msg.includes("hello") || msg.includes("hi") || msg.includes("hey") || msg === "hii" || msg === "hlo") {
      return `Hey there! Welcome to Golalita! 👋\n\nI'm Golalita AI, your personal assistant. I can help you with:\n• Learning about our platform & features\n• Exploring our subscription packages (Starter, Pro, Enterprise)\n• Understanding pricing & payment options\n• Getting started with your free trial\n• Any other questions about Golalita!\n\nWhat would you like to know?`;
    }
  }

  // ---- MERCHANT QUERIES ----
  if (role === "merchant") {
    if (msg.includes("stock") || msg.includes("inventory") || msg.includes("audit")) {
      return `Here's your current inventory audit 📊:\n\n• Omega Watch — 14 units (Luxury) ✅ Healthy\n• Titanium Gear — 3 units (Industrial) ⚠️ CRITICAL LOW\n• Cyber Lens — 45 units (Tech) ✅ Healthy\n\n⚠️ Action Required: Titanium Gear is critically low at just 3 units. I recommend restocking within 48 hours to avoid stockouts. Your Doha Hub and Lusail Node are both online and operational.`;
    }
    if (msg.includes("trend") || msg.includes("growth") || msg.includes("revenue")) {
      return `Here are your latest growth trends 📈:\n\n• Luxury category (Omega Watch) — +12% week-over-week growth in Doha Hub\n• Tech category (Cyber Lens) — Stable demand with strong conversion rates\n• Industrial category (Titanium Gear) — High demand but critically low stock\n\nYour next billing renewal is on June 1, 2026 (299 QAR for Enterprise AI Stack). Both branches are performing well. I'd recommend focusing marketing efforts on the Luxury category given the growth trend!`;
    }
    if (msg.includes("order") || msg.includes("delivery") || msg.includes("ship")) {
      return `Here's your order status update 📦:\n\n• ORD-9921 — In Transit (ETA: 2h 15m)\n• ORD-8820 — Delivered ✅ (Completed)\n\nBoth your branches (Doha Hub & Lusail Node) are online and processing orders normally. Everything looks good!`;
    }
  }

  // ---- ADMIN QUERIES ----
  if (role === "admin") {
    if (msg.includes("merchant") || msg.includes("queue") || msg.includes("verification")) {
      return `Platform Merchant Status 🏛️:\n\n• Total Active Merchants: 847\n• Pending Verification: 12 new applications\n• Top Categories: Electronics, Fashion, Luxury Watches, Beauty\n\nI recommend reviewing the 12 pending applications. The verification queue has been growing — prioritizing merchants in high-demand categories (Electronics & Fashion) could accelerate platform growth.`;
    }
    if (msg.includes("revenue") || msg.includes("money") || msg.includes("financial") || msg.includes("audit")) {
      return `Global Revenue Report 💰:\n\n• Monthly Revenue: 1.2M QAR (+22% growth)\n• Transactions Today: 3,421\n• Active Nodes: 14/14 (99.9% uptime)\n• Top Revenue Categories: Electronics, Fashion, Luxury Watches\n\nThe platform is performing exceptionally well. The 22% growth spike is primarily driven by new merchant onboarding in the Electronics category.`;
    }
    if (msg.includes("system") || msg.includes("server") || msg.includes("log") || msg.includes("node") || msg.includes("health")) {
      return `System Health Report 🖥️:\n\n• Active Nodes: 14/14 (all operational)\n• Uptime: 99.9% (SLA target met)\n• GPU Utilization: 42%\n• Memory: 67% utilized\n• No critical incidents in the last 24 hours\n\nAll systems are green. The platform is running at optimal efficiency.`;
    }
  }

  // ---- UNIVERSAL FALLBACK ----
  return `Hey! I'm Golalita AI — your smart assistant for the Golalita E-Commerce platform 🚀\n\nGolalita is a powerful multi-vendor marketplace platform based in Doha, Qatar. We help merchants build and scale their stores with AI-powered tools, real-time analytics, and global logistics.\n\nI can help you with:\n• Platform features & capabilities\n• Subscription packages & pricing\n• Getting started with a free trial\n• Technical support & troubleshooting\n\nWhat would you like to know more about?`;
}

// ========================================================================
// API HANDLER
// ========================================================================
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { message, role } = body;

    console.log(`[GOLALITA-AI] Processing ${role} request: "${message}"`);

    // Attempt AI model response first
    try {
      const response = await fetch(HF_BASE_URL, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${HF_TOKEN}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          model: "moonshotai/Kimi-K2-Instruct-0905",
          messages: [
            { role: "system", content: SYSTEM_PROMPT + `\n\nCurrent user role: ${role}` },
            { role: "user", content: message }
          ],
          temperature: 0.7,
          max_tokens: 1024
        })
      });

      const data = await response.json();
      console.log("[GOLALITA-AI] HF Status:", response.status);

      if (response.ok) {
        const aiText = data?.choices?.[0]?.message?.content || "";
        const cleanText = aiText.replace(/```json/g, "").replace(/```/g, "").trim();
        
        console.log("[GOLALITA-AI] AI Response:", cleanText.substring(0, 300));

        // Try to parse JSON from the AI
        try {
          const parsed = JSON.parse(cleanText);
          // Validate the response has meaningful content
          if (parsed.content && parsed.content.length > 20) {
            return NextResponse.json(parsed);
          }
        } catch {
          // AI returned plain text (not JSON) — still use it if it's meaningful
          if (cleanText.length > 30) {
            return NextResponse.json({
              agent_id: "strategy_agent",
              agent_name: "Golalita AI",
              content: cleanText,
              action_required: false,
              metadata: {}
            });
          }
        }
      }
    } catch (fetchError) {
      console.log("[GOLALITA-AI] Model unavailable, using local intelligence...");
    }

    // FALLBACK: Use deep local knowledge base
    console.log("[GOLALITA-AI] Using local knowledge base fallback");
    const localResponse = getLocalResponse(message, role || "customer");

    return NextResponse.json({
      agent_id: "strategy_agent",
      agent_name: "Golalita AI",
      content: localResponse,
      action_required: false,
      metadata: {}
    });

  } catch (error: any) {
    console.error("[GOLALITA-AI] Fatal:", error?.message);
    return NextResponse.json({
      agent_id: "strategy_agent",
      agent_name: "Golalita AI",
      content: `I'm experiencing a brief connection hiccup. But I can tell you — Golalita is a powerful multi-vendor e-commerce platform! We offer free trials, AI-powered analytics, and everything you need to build a thriving online store. Try refreshing and ask me again!`,
      action_required: false
    });
  }
}
