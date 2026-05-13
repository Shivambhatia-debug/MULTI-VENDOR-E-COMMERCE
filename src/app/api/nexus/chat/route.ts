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
    basic: {
      name: "Basic Plan",
      price: "3500 QAR / Year",
      features: [
        "15 Days Free Trial",
        "Free Domain + SSL",
        "Up to 400 Products",
        "Unlimited Orders Management",
        "Admin App for Management",
        "Stock Management System",
        "Detailed Sales & Analytics"
      ],
      best_for: "New sellers validating ideas"
    },
    premium: {
      name: "Premium Plan",
      price: "4500 QAR / Year",
      features: [
        "Everything in Basic, plus:",
        "15 Days Free Trial",
        "Up to 1500 Products",
        "Unlimited Orders Management",
        "Priority Support",
        "Advanced Marketing Tools",
        "Loyalty & Rewards Program"
      ],
      best_for: "Serious merchants ready to scale in Qatar"
    },
    mobile: {
      name: "Mobile App Plan",
      price: "5500 QAR / Year",
      features: [
        "Everything in Premium, plus:",
        "Dedicated Mobile App (iOS & Android)",
        "Push Notifications Engine",
        "White-label Branding",
        "Priority API Lane",
        "Real-time Logistics Tracking"
      ],
      best_for: "Established brands wanting a mobile-first presence"
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
// PLAN SELECTOR — Centralized plan-picking logic
// ========================================================================
function getPlanForQuery(query: string) {
  if (query.includes('basic')) {
    return {
      title: "Basic Plan",
      price: "3500 QAR",
      color: "text-emerald-400",
      best_for: "New sellers validating ideas",
      features: ["15 Days Free Trial", "Up to 400 Products", "Unlimited Orders", "Free Domain + SSL", "Admin App"]
    };
  }
  if (query.includes('mobile') || query.includes('app')) {
    return {
      title: "Mobile App Plan",
      price: "5500 QAR",
      color: "text-amber-400",
      best_for: "Established brands wanting mobile-first presence",
      features: ["Everything in Premium", "Dedicated iOS & Android App", "Push Notifications", "White-label Option", "Priority Support"]
    };
  }
  // Default: Premium (most popular)
  return {
    title: "Premium Plan",
    price: "4500 QAR",
    color: "text-indigo-400",
    best_for: "Serious merchants ready to scale in Qatar",
    features: ["15 Days Free Trial", "Up to 1500 Products", "Unlimited Orders", "Stock Management", "Advanced Marketing Tools"]
  };
}

// ========================================================================
// LOCAL FALLBACK — Keyword-Based Intelligence (when AI model fails)
// ========================================================================
function getLocalResponse(message: string, role: string): { content: string, metadata: any } {
  const msg = message.toLowerCase().trim();
  
  // ---- GUEST/CUSTOMER QUERIES ----
  if (role === "customer" || role === "guest") {
    if (msg.includes("website") || msg.includes("what is") || msg.includes("about") || msg.includes("golalita") || msg.includes("platform") || msg.includes("kya hai") || msg.includes("tell me")) {
      return {
        content: `Great question! 🚀 Golalita is a next-generation multi-vendor e-commerce platform headquartered in Doha, Qatar. We empower merchants, brands, and entrepreneurs to build, manage, and scale their online stores with cutting-edge AI-powered tools, real-time analytics, and seamless logistics integration.`,
        metadata: { type: 'chart' }
      };
    }

    if (msg.includes("package") || msg.includes("plan") || msg.includes("pricing") || msg.includes("price") || msg.includes("cost") || msg.includes("subscription")) {
      const plan = getPlanForQuery(msg);
      return {
        content: `Here's our recommended plan for you — the **${plan.title}** at ${plan.price} / Year. All plans include a 15-day free trial! Tap the card below to explore on the packages page.`,
        metadata: { type: 'package_card', plan }
      };
    }

    if (msg.includes("feature") || msg.includes("what can") || msg.includes("capability") || msg.includes("offer") || msg.includes("provide")) {
      return {
        content: `Golalita is packed with powerful features! From Multi-Vendor Marketplaces to AI-driven Stock management and Global Logistics. Check out this growth trend from one of our top features:`,
        metadata: { type: 'chart' }
      };
    }
  }

  // ---- MERCHANT QUERIES ----
  if (role === "merchant") {
    if (msg.includes("stock") || msg.includes("inventory") || msg.includes("audit")) {
      return {
        content: `Inventory audit complete. ⚠️ Titanium Gear is critically low at just 3 units. I recommend restocking within 48 hours.`,
        metadata: { type: 'stock_action' }
      };
    }
    if (msg.includes("trend") || msg.includes("growth") || msg.includes("revenue")) {
      return {
        content: `Your Luxury category is showing a +12.4% growth spike this week. Here is the visual projection:`,
        metadata: { type: 'chart' }
      };
    }
  }

  // ---- ADMIN QUERIES ----
  if (role === "admin") {
    if (msg.includes("revenue") || msg.includes("money") || msg.includes("financial")) {
      return {
        content: `Global platform revenue is trending up by 22% this month. Uptime remains stable at 99.9%.`,
        metadata: { type: 'chart' }
      };
    }
  }

  return {
    content: `I'm Golalita AI. I can help you with platform features, packages, pricing, or managing your store operations. What would you like to explore?`,
    metadata: {}
  };
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
            { role: "system", content: SYSTEM_PROMPT + `\n\nMetadata Types available: {"type": "package_card"}, {"type": "chart"}, {"type": "stock_action"}.\n\nCurrent user role: ${role}` },
            { role: "user", content: message }
          ],
          temperature: 0.7,
          max_tokens: 1024
        })
      });

      const data = await response.json();

      if (response.ok) {
        const aiText = data?.choices?.[0]?.message?.content || "";
        const cleanText = aiText.replace(/```json/g, "").replace(/```/g, "").trim();
        
        // Extract the AI's text content (JSON or plain)
        let content = cleanText;
        try {
          const parsed = JSON.parse(cleanText);
          if (parsed.content) content = parsed.content;
        } catch {}

        if (content.length > 20) {
          // ALWAYS inject smart metadata based on the user's question
          const lowerMsg = message.toLowerCase();
          let metadata: any = {};

          if (lowerMsg.includes('package') || lowerMsg.includes('plan') || lowerMsg.includes('pricing') || lowerMsg.includes('price')) {
            metadata = { type: 'package_card', plan: getPlanForQuery(lowerMsg) };
          } else if (lowerMsg.includes('stock') || lowerMsg.includes('inventory') || lowerMsg.includes('audit')) {
            metadata = { type: 'stock_action' };
          } else if (lowerMsg.includes('trend') || lowerMsg.includes('revenue') || lowerMsg.includes('growth')) {
            metadata = { type: 'chart' };
          }

          return NextResponse.json({
            agent_id: "strategy_agent",
            agent_name: "Golalita AI",
            content,
            metadata
          });
        }
      }
    } catch (e) {}

    // FALLBACK
    const local = getLocalResponse(message, role || "customer");
    return NextResponse.json({
      agent_id: "strategy_agent",
      agent_name: "Golalita AI",
      content: local.content,
      metadata: local.metadata
    });

  } catch (error: any) {
    return NextResponse.json({
      agent_id: "strategy_agent",
      agent_name: "Golalita AI",
      content: `System error. But Golalita is still the best platform! Try again.`,
      metadata: {}
    });
  }
}
