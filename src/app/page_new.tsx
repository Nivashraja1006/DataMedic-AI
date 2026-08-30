"use client";

import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { useEffect } from "react";
import {
  Sparkles, ArrowRight, CheckCircle2, Database, AlertTriangle,
  Wand2, BarChart3, GitCompare, TrendingUp
} from "lucide-react";

export default function LandingPage() {
  const router = useRouter();
  const { isAuthenticated, isLoading } = useAuth();

  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      router.push("/dashboard");
    }
  }, [isAuthenticated, isLoading, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#05070C] flex items-center justify-center text-white">
        <Sparkles size={48} className="animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#05070C] text-[#EDF0F8]" style={{ fontFamily: "'Inter', system-ui, sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;600;700&family=Inter:wght@400;500;600&display=swap');
        .display { font-family: 'Space Grotesk', sans-serif; letter-spacing: -0.02em; }
        .glow-btn { transition: transform .2s ease, box-shadow .3s ease; }
        .glow-btn:hover { transform: translateY(-1px); box-shadow: 0 8px 30px -6px rgba(108,124,251,0.5); }
        @keyframes fadeUp { from { opacity:0; transform: translateY(20px);} to { opacity:1; transform: translateY(0);} }
        .reveal { animation: fadeUp .6s cubic-bezier(.22,.75,.25,1) both; }
      `}</style>

      {/* Navigation */}
      <nav className="border-b border-white/8 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#6C7CFB] to-[#2FD9C4] flex items-center justify-center">
              <Sparkles size={18} />
            </div>
            <h1 className="display text-[18px] font-bold">DataMedic <span className="text-[#838DA3]">AI</span></h1>
          </div>
          <div className="flex items-center gap-3">
            <a href="/login" className="text-[13px] text-[#8993A8] hover:text-white transition">Sign in</a>
            <a href="/signup" className="glow-btn text-[13px] px-4 py-2 rounded-lg bg-gradient-to-r from-[#6C7CFB] to-[#9A6BFF] text-white font-medium">
              Get started
            </a>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="max-w-5xl mx-auto px-6 py-20 text-center">
        <div className="reveal mb-6 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.05] px-3 py-1.5 text-[12px] text-[#B7C0D6]">
          <span className="h-1.5 w-1.5 rounded-full bg-[#2FD9C4]" />
          AI-powered data quality for modern teams
        </div>

        <h2 className="display text-[48px] md:text-[64px] font-bold leading-tight mb-6 reveal" style={{ animationDelay: "0.1s" }}>
          Make every <span className="bg-gradient-to-r from-[#6C7CFB] via-[#9A6BFF] to-[#2FD9C4] bg-clip-text text-transparent">dataset</span> trustworthy
        </h2>

        <p className="text-[16px] text-[#8993A8] mb-8 max-w-2xl mx-auto reveal" style={{ animationDelay: "0.2s" }}>
          Profile your data, detect issues, and clean automatically. Powered by AI, backed by statistics — no manual rules needed.
        </p>

        <div className="flex items-center justify-center gap-4 reveal mb-16" style={{ animationDelay: "0.3s" }}>
          <a href="/signup" className="glow-btn flex items-center gap-2 rounded-lg bg-gradient-to-r from-[#6C7CFB] to-[#9A6BFF] px-6 py-3.5 text-[14px] font-medium text-white">
            Start free <ArrowRight size={16} />
          </a>
          <button className="flex items-center gap-2 text-[14px] text-[#B7C0D6] hover:text-white transition">
            <span className="flex h-8 w-8 items-center justify-center rounded-full border border-white/15">▶</span> See how it works
          </button>
        </div>

        {/* Dashboard Preview */}
        <div className="reveal rounded-2xl border border-white/10 bg-white/[0.02] p-1 overflow-hidden backdrop-blur-xl" style={{ animationDelay: "0.4s" }}>
          <div className="aspect-video bg-gradient-to-br from-[#6C7CFB]/10 to-[#2FD9C4]/10 rounded-lg border border-white/5 flex items-center justify-center">
            <div className="text-center">
              <Database size={48} className="mx-auto mb-3 text-[#9A6BFF] opacity-50" />
              <p className="text-[#666f82]">Interactive dashboard preview</p>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="max-w-6xl mx-auto px-6 py-20">
        <div className="text-center mb-16">
          <h3 className="display text-[32px] font-bold mb-3">Complete data quality platform</h3>
          <p className="text-[#8993A8]">Everything you need to assess and improve data health</p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            { icon: Database, title: "Upload & Store", desc: "CSV, Excel, or JSON. Securely stored and indexed." },
            { icon: BarChart3, title: "Profile Data", desc: "Automatic column analysis with type detection." },
            { icon: AlertTriangle, title: "Detect Issues", desc: "Missing values, duplicates, format errors, outliers." },
            { icon: TrendingUp, title: "Quality Score", desc: "6-dimensional scoring system based on industry standards." },
            { icon: Wand2, title: "AI Recommendations", desc: "Smart fixes suggested per issue with explanations." },
            { icon: Sparkles, title: "AI Copilot", desc: "Ask questions about your data in natural language." },
          ].map((feature, i) => (
            <div key={i} className="rounded-xl border border-white/10 bg-white/[0.02] p-6 hover:border-white/20 transition-colors">
              <div className="w-10 h-10 rounded-lg bg-[#6C7CFB]/20 flex items-center justify-center mb-4 text-[#9A6BFF]">
                <feature.icon size={20} />
              </div>
              <h4 className="display text-[16px] font-semibold mb-2">{feature.title}</h4>
              <p className="text-[13px] text-[#8993A8]">{feature.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-4xl mx-auto px-6 py-20 text-center">
        <div className="rounded-2xl border border-white/10 bg-gradient-to-br from-[#6C7CFB]/10 to-[#2FD9C4]/10 p-12">
          <h3 className="display text-[32px] font-bold mb-3">Ready to improve your data?</h3>
          <p className="text-[#8993A8] mb-8">Start with a free account. Upgrade when you need more datasets or advanced features.</p>
          <div className="flex items-center justify-center gap-4">
            <a href="/signup" className="glow-btn flex items-center gap-2 rounded-lg bg-gradient-to-r from-[#6C7CFB] to-[#9A6BFF] px-6 py-3 text-[14px] font-medium text-white">
              Create free account <ArrowRight size={16} />
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/8 py-8 px-6 text-center text-[11px] text-[#666f82]">
        <p>© 2026 DataMedic AI. All rights reserved.</p>
      </footer>
    </div>
  );
}
