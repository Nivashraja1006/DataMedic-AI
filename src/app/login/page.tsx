"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { Mail, Lock, ArrowRight, Eye, EyeOff, Loader2 } from "lucide-react";

function Logo({ size = 34 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" className="shrink-0">
      <defs>
        <linearGradient id="loginLogoGrad" x1="10" y1="54" x2="54" y2="8" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#1E5FD9" />
          <stop offset="55%" stopColor="#2F8FED" />
          <stop offset="100%" stopColor="#5FE3F0" />
        </linearGradient>
        <linearGradient id="loginLogoBars" x1="0" y1="1" x2="0" y2="0">
          <stop offset="0%" stopColor="#1FA8D6" />
          <stop offset="100%" stopColor="#6DF3EC" />
        </linearGradient>
      </defs>
      <rect width="64" height="64" rx="16" fill="#0A1020" />
      <g fill="#3FD6EE">
        <rect x="3" y="27" width="3" height="3" opacity="0.3" />
        <rect x="8" y="21" width="4" height="4" opacity="0.45" />
        <rect x="6" y="33" width="3" height="3" opacity="0.35" />
        <rect x="12" y="30" width="5" height="5" opacity="0.6" />
        <rect x="10" y="38" width="4" height="4" opacity="0.5" />
        <rect x="16" y="19" width="4" height="4" opacity="0.65" />
      </g>
      <path d="M23,13 H33 A19,19 0 0 1 33,51 H23" stroke="url(#loginLogoGrad)" strokeWidth="9" strokeLinecap="round" fill="none" />
      <rect x="27" y="37" width="4.4" height="9" rx="1.2" fill="url(#loginLogoBars)" />
      <rect x="33.2" y="30" width="4.4" height="16" rx="1.2" fill="url(#loginLogoBars)" />
      <rect x="39.4" y="21" width="4.4" height="25" rx="1.2" fill="url(#loginLogoBars)" />
      <path d="M13,41 C23,53 45,53 51,37" stroke="#EAF6FF" strokeWidth="4" strokeLinecap="round" fill="none" opacity="0.92" />
    </svg>
  );
}

export default function LoginPage() {
  const router = useRouter();
  const { login, isAuthenticated } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [focused, setFocused] = useState<string | null>(null);

  useEffect(() => {
    if (isAuthenticated) {
      router.push("/dashboard");
    }
  }, [isAuthenticated, router]);

  const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!emailValid) {
      setError("Enter a valid email address.");
      return;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    setLoading(true);

    try {
      await login(email, password);
      router.push("/dashboard");
    } catch (err: any) {
      setError(err.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="relative min-h-screen w-full flex items-center justify-center px-6 text-[#EDF0F8] antialiased overflow-hidden"
      style={{ background: "#05070C", fontFamily: "'Inter', system-ui, sans-serif" }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@600;700&family=Inter:wght@400;500;600&display=swap');
        .display { font-family: 'Space Grotesk', sans-serif; letter-spacing: -0.02em; }
        @keyframes floaty { 0%,100% { transform: translate(0,0);} 50% { transform: translate(10px,-16px);} }
        .particle { animation: floaty 8s ease-in-out infinite; }
        @keyframes fadeUp { from { opacity:0; transform: translateY(16px);} to { opacity:1; transform: translateY(0);} }
        .reveal { opacity:0; animation: fadeUp .7s cubic-bezier(.22,.75,.25,1) forwards; }
        .field-glow { transition: border-color .2s ease, box-shadow .2s ease; }
        .field-glow.is-focused { border-color: rgba(108,124,251,0.6); box-shadow: 0 0 0 3px rgba(108,124,251,0.12); }
        .glow-btn { transition: transform .2s ease, box-shadow .3s ease; }
        .glow-btn:hover:not(:disabled) { transform: translateY(-1px); box-shadow: 0 10px 34px -8px rgba(108,124,251,0.55); }
        .glow-btn:active:not(:disabled) { transform: translateY(0) scale(0.99); }
        @keyframes spin { to { transform: rotate(360deg); } }
        .spin { animation: spin 0.8s linear infinite; }
      `}</style>

      <div className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0" style={{ background: "radial-gradient(900px 600px at 20% 0%, rgba(30,20,60,0.9), transparent 60%), radial-gradient(800px 600px at 90% 100%, rgba(20,15,45,0.85), transparent 55%)" }} />
        <div className="absolute -top-24 -left-16 w-96 h-96 rounded-full bg-[#4C5FE0]/16 blur-[110px] particle" />
        <div className="absolute bottom-[-15%] right-[-10%] w-96 h-96 rounded-full bg-[#8A4FE0]/14 blur-[110px] particle" style={{ animationDelay: "2s" }} />
        {[
          { top: "8%", left: "12%" }, { top: "18%", left: "82%" }, { top: "70%", left: "8%" }, { top: "78%", left: "88%" },
        ].map((s, i) => (
          <div key={i} className="absolute w-1 h-1 rounded-full bg-white/70 particle" style={{ ...s, animationDelay: `${i * 1.3}s` }} />
        ))}
      </div>

      <div className="relative w-full max-w-[420px] reveal">
        <div className="flex flex-col items-center mb-8" style={{ animationDelay: "0.05s" }}>
          <Logo size={56} />
          <div className="display text-[22px] font-semibold mt-4">DataMedic <span className="text-[#838DA3] font-medium">AI</span></div>
        </div>

        <div className="text-center mb-8">
          <h1 className="display text-[26px] font-semibold mb-2">Welcome back</h1>
          <p className="text-[13.5px] text-[#8993A8]">Sign in to your account to continue</p>
        </div>

        <form onSubmit={handleSubmit} className="rounded-2xl border border-white/10 bg-white/[0.02] backdrop-blur-xl p-7">
          {error && (
            <div className="mb-4 text-[12.5px] text-[#FF6B75] bg-[#FF6B75]/10 border border-[#FF6B75]/25 rounded-lg px-3 py-2.5">
              {error}
            </div>
          )}

          <label className="block text-[12.5px] font-medium text-[#B7C0D6] mb-1.5">Email address</label>
          <div className={`field-glow flex items-center gap-2.5 rounded-xl border border-white/10 bg-black/25 px-3.5 py-3 mb-5 ${focused === "email" ? "is-focused" : ""}`}>
            <Mail size={16} className="text-[#666f82] shrink-0" />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onFocus={() => setFocused("email")}
              onBlur={() => setFocused(null)}
              placeholder="your@email.com"
              className="flex-1 bg-transparent text-[13.5px] outline-none placeholder:text-[#666f82]"
              autoComplete="email"
            />
          </div>

          <div className="flex items-center justify-between mb-1.5">
            <label className="text-[12.5px] font-medium text-[#B7C0D6]">Password</label>
            <a href="/signup" className="text-[12px] text-[#9A6BFF] hover:text-[#B7A3FF] transition-colors">Forgot password?</a>
          </div>
          <div className={`field-glow flex items-center gap-2.5 rounded-xl border border-white/10 bg-black/25 px-3.5 py-3 mb-5 ${focused === "password" ? "is-focused" : ""}`}>
            <Lock size={16} className="text-[#666f82] shrink-0" />
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onFocus={() => setFocused("password")}
              onBlur={() => setFocused(null)}
              placeholder="••••••••"
              className="flex-1 bg-transparent text-[13.5px] outline-none placeholder:text-[#666f82]"
              autoComplete="current-password"
            />
            <button type="button" onClick={() => setShowPassword((s) => !s)} className="text-[#666f82] hover:text-white transition-colors shrink-0">
              {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
            </button>
          </div>

          <label className="flex items-center gap-2 mb-6 cursor-pointer select-none">
            <input type="checkbox" checked={remember} onChange={(e) => setRemember(e.target.checked)} className="sr-only peer" />
            <span className="w-4 h-4 rounded border border-white/20 flex items-center justify-center peer-checked:bg-gradient-to-br peer-checked:from-[#6C7CFB] peer-checked:to-[#9A6BFF] peer-checked:border-transparent transition-colors">
              {remember && <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth={3}><polyline points="20 6 9 17 4 12" /></svg>}
            </span>
            <span className="text-[12.5px] text-[#8993A8]">Remember me</span>
          </label>

          <button
            type="submit"
            disabled={loading}
            className="glow-btn w-full flex items-center justify-center gap-2 text-[14px] font-medium py-3 rounded-xl bg-gradient-to-r from-[#6C7CFB] to-[#9A6BFF] disabled:opacity-70"
          >
            {loading ? (
              <><Loader2 size={16} className="spin" /> Signing in…</>
            ) : (
              <>Sign in <ArrowRight size={15} /></>
            )}
          </button>
        </form>

        <p className="text-center text-[13px] text-[#8993A8] mt-6">
          Don't have an account? <a href="/signup" className="text-[#9A6BFF] hover:text-[#B7A3FF] font-medium transition-colors">Sign up</a>
        </p>
      </div>
    </div>
  );
}
