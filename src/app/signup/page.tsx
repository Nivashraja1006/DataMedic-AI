"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { Mail, Lock, User, Sparkles, ArrowRight, AlertCircle, CheckCircle2, Loader2 } from "lucide-react";

export default function SignupPage() {
  const router = useRouter();
  const { signup, isAuthenticated } = useAuth();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isAuthenticated && !success) {
      router.push("/dashboard");
    }
  }, [isAuthenticated, router, success]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    setLoading(true);

    try {
      await signup(username, email, password);
      setSuccess("Account created successfully. Redirecting to your dashboard...");
      setTimeout(() => router.push("/dashboard"), 900);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Signup failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#05070C] text-[#EDF0F8]" style={{ fontFamily: "'Inter', system-ui, sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;600;700&family=Inter:wght@400;500;600&display=swap');
        .display { font-family: 'Space Grotesk', sans-serif; letter-spacing: -0.02em; }
        .glow-btn { transition: transform .2s ease, box-shadow .3s ease; }
        .glow-btn:hover { transform: translateY(-1px); box-shadow: 0 8px 30px -6px rgba(108,124,251,0.5); }
        .input-field { transition: border-color .2s ease, background-color .2s ease; }
        .input-field:focus { border-color: #6C7CFB; background-color: rgba(108,124,251,0.05); }
      `}</style>

      <div className="w-full max-w-md px-6 py-12">
        <div className="flex items-center justify-center mb-8">
          <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-[#6C7CFB] to-[#2FD9C4] flex items-center justify-center">
            <Sparkles size={24} className="text-white" />
          </div>
          <h1 className="display text-[28px] font-bold ml-3">DataMedic <span className="text-[#838DA3]">AI</span></h1>
        </div>

        <div className="mb-8 text-center">
          <h2 className="display text-[24px] font-semibold mb-2">Create account</h2>
          <p className="text-[#8993A8] text-[14px]">Start analyzing your data quality today</p>
        </div>

        {error && (
          <div className="mb-6 p-4 rounded-lg border border-[#FF6B75]/30 bg-[#FF6B75]/10 flex items-center gap-2">
            <AlertCircle size={16} className="text-[#FF6B75]" />
            <p className="text-[#FF6B75] text-[13px]">{error}</p>
          </div>
        )}

        {success && (
          <div className="mb-6 p-4 rounded-lg border border-[#2FD9C4]/30 bg-[#2FD9C4]/10 flex items-center gap-2">
            <CheckCircle2 size={16} className="text-[#2FD9C4]" />
            <p className="text-[#2FD9C4] text-[13px]">{success}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-[12px] text-[#B7C0D6] mb-2">Username</label>
            <div className="relative">
              <User size={16} className="absolute left-3.5 top-3.5 text-[#666f82]" />
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="johndoe"
                className="input-field w-full pl-10 pr-4 py-2.5 rounded-lg border border-white/10 bg-white/[0.02] text-white outline-none text-[13px] placeholder:text-[#666f82]"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-[12px] text-[#B7C0D6] mb-2">Email address</label>
            <div className="relative">
              <Mail size={16} className="absolute left-3.5 top-3.5 text-[#666f82]" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                className="input-field w-full pl-10 pr-4 py-2.5 rounded-lg border border-white/10 bg-white/[0.02] text-white outline-none text-[13px] placeholder:text-[#666f82]"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-[12px] text-[#B7C0D6] mb-2">Password</label>
            <div className="relative">
              <Lock size={16} className="absolute left-3.5 top-3.5 text-[#666f82]" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="input-field w-full pl-10 pr-4 py-2.5 rounded-lg border border-white/10 bg-white/[0.02] text-white outline-none text-[13px] placeholder:text-[#666f82]"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-[12px] text-[#B7C0D6] mb-2">Confirm password</label>
            <div className="relative">
              <Lock size={16} className="absolute left-3.5 top-3.5 text-[#666f82]" />
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••"
                className="input-field w-full pl-10 pr-4 py-2.5 rounded-lg border border-white/10 bg-white/[0.02] text-white outline-none text-[13px] placeholder:text-[#666f82]"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="glow-btn w-full mt-6 py-2.5 rounded-lg bg-gradient-to-r from-[#6C7CFB] to-[#9A6BFF] text-white font-medium text-[14px] flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {loading ? <><Loader2 size={16} className="animate-spin" /> Creating account...</> : <>Create account <ArrowRight size={16} /></>}
          </button>
        </form>

        <p className="text-center text-[#8993A8] text-[13px] mt-6">
          Already have an account?{" "}
          <a href="/login" className="text-[#9A6BFF] hover:text-white transition-colors font-medium">
            Sign in
          </a>
        </p>
      </div>
    </div>
  );
}
