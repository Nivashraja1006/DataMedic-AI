"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useAuth } from "@/contexts/AuthContext";
import AnimatedBackground from "@/components/AnimatedBackground";
import Navbar from "@/components/Navbar";
import DashboardPreview from "@/components/landing/DashboardPreview";
import ChatWidget from "@/components/ChatWidget";
import HeroText from "@/components/HeroText";
import Slideshow from "@/components/Slideshow";
import { useParallax } from "@/hooks/useParallax";
import {
  ArrowRight,
  BarChart3,
  Bot,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Database,
  Gauge,
  Layers3,
  ShieldCheck,
  Sparkles,
  Wand2,
} from "lucide-react";

const featureCards = [
  {
    icon: Database,
    title: "Data Profiling",
    description: "Discover column drift, null patterns, and semantic structure across every dataset in seconds.",
  },
  {
    icon: Gauge,
    title: "AI Detection",
    description: "Surface broken rules, invalid formats, duplicates, and edge-case anomalies before they spread.",
  },
  {
    icon: Wand2,
    title: "Smart Cleaning",
    description: "Get actionable suggestions and guided fixes powered by rule-based reasoning and AI insights.",
  },
  {
    icon: BarChart3,
    title: "Real-time Scoring",
    description: "Track data health continuously with a live quality score across all critical dimensions.",
  },
];

const workflowSteps = ["Upload", "Profile", "Score", "Detect", "Clean"];

const plans = [
  {
    name: "Starter",
    price: "$19",
    description: "For small teams starting their data quality journey.",
    cta: "Try free",
    features: ["2 datasets", "Basic profiling", "AI issue detection", "Community support"],
  },
  {
    name: "Pro",
    price: "$49",
    description: "For fast-moving teams that need deeper visibility and automation.",
    cta: "Most popular",
    featured: true,
    features: ["Unlimited datasets", "Real-time scoring", "AI Copilot", "Advanced anomaly rules"],
  },
  {
    name: "Enterprise",
    price: "Custom",
    description: "For organizations managing sensitive data pipelines at scale.",
    cta: "Talk to sales",
    features: ["SSO & governance", "Private deployment", "Custom rules", "Priority support"],
  },
];

const slideData = [
  {
    title: "Dataset dashboard",
    badge: "Live telemetry",
    description: "Monitor data quality with AI-driven scoring, drift detection, and live issue summaries.",
    accent: "#7b91ff",
    content: [
      { label: "Completeness", amount: 94 },
      { label: "Validity", amount: 89 },
      { label: "Integrity", amount: 96 },
    ],
  },
  {
    title: "AI insights panel",
    badge: "Copilot ready",
    description: "Turn noisy records into confident next steps with plain-English guidance and recommendations.",
    accent: "#9a6bff",
    content: [
      { label: "Missing values", amount: 12 },
      { label: "Duplicate IDs", amount: 6 },
      { label: "Schema drift", amount: 3 },
    ],
  },
  {
    title: "Data cleaning workflow",
    badge: "Automation",
    description: "Prioritize cleanup actions with step-by-step, model-aware recommendation flows.",
    accent: "#2fd9c4",
    content: [
      { label: "Normalization", amount: 88 },
      { label: "Deduplication", amount: 73 },
      { label: "Validation", amount: 91 },
    ],
  },
];

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0 },
};

export default function LandingPage() {
  const { isAuthenticated } = useAuth();
  const { transform } = useParallax(18);
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const maxScroll = document.body.scrollHeight - window.innerHeight;
      const progress = maxScroll > 0 ? (window.scrollY / maxScroll) * 100 : 0;
      setScrollProgress(progress);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#020617] text-[#EDF0F8]">
      <motion.div
        className="fixed left-0 top-0 z-[100] h-[2px] bg-gradient-to-r from-[#7b91ff] via-[#9a6bff] to-[#2fd9c4] shadow-[0_0_18px_rgba(123,145,255,0.7)]"
        style={{ width: `${scrollProgress}%` }}
      />

      <AnimatedBackground />
      <Navbar />

      <main className="relative z-10 bg-[#f4f8fb] text-slate-900">
        <section id="home" className="mx-auto grid max-w-7xl items-center gap-10 px-6 pb-20 pt-12 md:px-10 lg:grid-cols-[1.02fr_0.98fr] lg:pb-28 lg:pt-16">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            <HeroText isAuthenticated={isAuthenticated} />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="relative"
            style={{ transform: `perspective(1200px) rotateX(${transform.rotateX}) rotateY(${transform.rotateY})` }}
          >
            <div className="relative mx-auto max-w-[620px] rounded-[32px] border border-slate-200/80 bg-white/75 p-4 shadow-[0_20px_60px_rgba(15,23,42,0.08)] backdrop-blur-xl">
              <div className="rounded-[28px] border border-slate-200 bg-[#f8fbff] p-4">
                <div className="mb-4 flex items-center justify-between">
                  <div className="flex items-center gap-2 text-[11px] font-medium uppercase tracking-[0.18em] text-slate-500">
                    <span className="h-2.5 w-2.5 rounded-full bg-[#14b8a6]" />
                    Live data pipeline
                  </div>
                  <div className="rounded-full border border-[#14b8a6]/20 bg-[#ecfdf5] px-2.5 py-1 text-[10px] font-medium uppercase tracking-[0.18em] text-[#0f766e]">
                    Running
                  </div>
                </div>

                <div className="relative overflow-hidden rounded-[24px] border border-slate-200 bg-gradient-to-br from-white via-[#f8fbff] to-[#eef8ff] p-4">
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(20,184,166,0.08),transparent_30%),radial-gradient(circle_at_bottom_right,rgba(59,130,246,0.08),transparent_30%)]" />

                  <div className="relative mb-5 flex items-center justify-between rounded-2xl border border-slate-200 bg-white/70 px-3 py-2">
                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-[#14b8a6]/15 to-[#3b82f6]/15 text-[#0f172a]">
                        <Database className="h-4 w-4" />
                      </div>
                      <div>
                        <div className="text-xs font-medium text-slate-500">customer_export.csv</div>
                        <div className="text-[11px] text-slate-400">214 rows • 14 columns</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-[10px] uppercase tracking-[0.18em] text-slate-400">Status</div>
                      <div className="text-sm font-semibold text-[#0f766e]">Processing</div>
                    </div>
                  </div>

                  <div className="relative mb-5">
                    <svg className="absolute left-1/2 top-8 h-[120px] w-[80%] -translate-x-1/2" viewBox="0 0 500 120" preserveAspectRatio="none" aria-hidden="true">
                      <motion.path
                        d="M 28 60 L 110 60 M 110 60 L 210 60 M 210 60 L 315 60 M 315 60 L 430 60"
                        stroke="rgba(20,184,166,0.35)"
                        strokeWidth="2"
                        strokeDasharray="8 8"
                        fill="none"
                        animate={{ pathLength: [0.45, 1, 0.45] }}
                        transition={{ duration: 3.2, repeat: Infinity, ease: "easeInOut" }}
                      />
                    </svg>

                    <div className="grid grid-cols-5 gap-3">
                      {[
                        { label: "Upload", color: "bg-[#14b8a6]", icon: Database },
                        { label: "Parsing", color: "bg-[#3b82f6]", icon: Sparkles },
                        { label: "Cleaning", color: "bg-[#10b981]", icon: ShieldCheck },
                        { label: "Validation", color: "bg-[#14b8a6]", icon: Gauge },
                        { label: "AI Insight", color: "bg-[#3b82f6]", icon: Bot },
                      ].map((step, index) => {
                        const Icon = step.icon;
                        const isActive = index === 2 || index === 3;
                        return (
                          <motion.div
                            key={step.label}
                            whileHover={{ y: -3, scale: 1.02 }}
                            animate={isActive ? { boxShadow: ["0 0 0 rgba(20,184,166,0.08)", "0 10px 20px rgba(20,184,166,0.14)", "0 0 0 rgba(20,184,166,0.08)"] } : {}}
                            transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
                            className={`relative rounded-2xl border ${isActive ? "border-[#14b8a6]/50 bg-white" : "border-slate-200 bg-white/80"} p-3 text-center shadow-sm`}
                          >
                            <div className={`mx-auto mb-2 flex h-9 w-9 items-center justify-center rounded-xl ${step.color} text-white shadow-sm`}>
                              <Icon className="h-4 w-4" />
                            </div>
                            <div className="text-[11px] font-medium text-slate-700">{step.label}</div>
                            <div className="mt-2 text-[10px] uppercase tracking-[0.18em] text-slate-400">
                              {index === 0 ? "45%" : index === 1 ? "62%" : index === 2 ? "78%" : index === 3 ? "87%" : "96%"}
                            </div>
                          </motion.div>
                        );
                      })}
                    </div>
                  </div>

                  <div className="grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
                    <div className="rounded-2xl border border-slate-200 bg-white/80 p-4">
                      <div className="mb-3 flex items-center justify-between text-[11px] text-slate-500">
                        <span className="uppercase tracking-[0.18em]">Reading file</span>
                        <span className="font-medium text-[#0f766e]">214 rows</span>
                      </div>

                      <div className="space-y-3">
                        {[
                          "Parsing columns...",
                          "Detecting null values...",
                          "AI analyzing anomalies...",
                        ].map((log, index) => (
                          <div key={log} className="flex items-center gap-3">
                            <span className="inline-flex h-2.5 w-2.5 rounded-full bg-[#14b8a6]" style={{ opacity: 0.4 + index * 0.3 }} />
                            <span className="text-sm text-slate-600">{log}</span>
                          </div>
                        ))}
                      </div>

                      <div className="mt-4 space-y-2">
                        <div className="flex items-center justify-between text-[11px] text-slate-500">
                          <span>Scan progress</span>
                          <span>78%</span>
                        </div>
                        <div className="h-2.5 overflow-hidden rounded-full bg-slate-100">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: "78%" }}
                            transition={{ duration: 1.2, ease: "easeOut" }}
                            className="h-full rounded-full bg-gradient-to-r from-[#14b8a6] via-[#3b82f6] to-[#10b981]"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="rounded-2xl border border-slate-200 bg-white/80 p-4">
                        <div className="mb-3 flex items-center justify-between text-[11px] uppercase tracking-[0.18em] text-slate-500">
                          <span>Quality score</span>
                          <span className="text-[#0f766e]">92</span>
                        </div>
                        <div className="relative mx-auto flex h-28 w-28 items-center justify-center rounded-full border border-slate-200 bg-gradient-to-br from-white to-slate-50">
                          <motion.div
                            animate={{ scale: [1, 1.04, 1] }}
                            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                            className="absolute inset-2 rounded-full border border-[#14b8a6]/30"
                          />
                          <div className="text-center">
                            <div className="text-3xl font-semibold text-slate-900">92</div>
                            <div className="text-[10px] uppercase tracking-[0.18em] text-slate-400">Score</div>
                          </div>
                        </div>
                      </div>

                      <div className="rounded-2xl border border-slate-200 bg-[#f8fbff] p-4">
                        <div className="mb-3 flex items-center gap-2 text-[11px] uppercase tracking-[0.18em] text-slate-500">
                          <Bot className="h-3.5 w-3.5 text-[#3b82f6]" />
                          AI insight
                        </div>
                        <p className="text-sm leading-6 text-slate-600">
                          “Nulls are concentrated in the customer email field. Suggested normalization is ready to apply.”
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </section>

        <section id="features" className="mx-auto max-w-7xl px-6 py-20 md:px-10">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.15 }}
            variants={fadeUp}
            transition={{ duration: 0.5 }}
            className="mx-auto mb-12 max-w-2xl text-center"
          >
            <p className="mb-3 text-[12px] uppercase tracking-[0.2em] text-[#7B91FF]">Features</p>
            <h2 className="text-3xl font-semibold tracking-[-0.05em] text-white md:text-5xl">Everything your data team needs.</h2>
          </motion.div>

          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
            {featureCards.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 18 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.2 }}
                  transition={{ duration: 0.45, delay: index * 0.08 }}
                  whileHover={{ y: -6, scale: 1.01 }}
                  className="rounded-[28px] border border-white/10 bg-white/[0.03] p-6 shadow-[0_18px_40px_rgba(9,14,25,0.35)] backdrop-blur-md"
                >
                  <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-[#7B91FF]/25 to-[#2FD9C4]/15 text-[#B9C7FF]">
                    <Icon className="h-5 w-5" />
                  </div>
                  <h3 className="mb-3 text-xl font-semibold text-white">{feature.title}</h3>
                  <p className="text-sm leading-7 text-slate-300">{feature.description}</p>
                </motion.div>
              );
            })}
          </div>
        </section>

        <section id="how-it-works" className="mx-auto max-w-7xl px-6 py-20 md:px-10">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.15 }}
            variants={fadeUp}
            transition={{ duration: 0.5 }}
            className="mx-auto mb-12 max-w-2xl text-center"
          >
            <p className="mb-3 text-[12px] uppercase tracking-[0.2em] text-[#7B91FF]">How it works</p>
            <h2 className="text-3xl font-semibold tracking-[-0.05em] text-white md:text-5xl">From upload to confident decisions.</h2>
          </motion.div>

          <div className="relative">
            <div className="absolute left-0 right-0 top-12 hidden h-px bg-gradient-to-r from-transparent via-white/10 to-transparent md:block" />
            <div className="grid gap-6 md:grid-cols-5">
              {workflowSteps.map((step, index) => (
                <motion.div
                  key={step}
                  initial={{ opacity: 0, y: 18 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.2 }}
                  transition={{ duration: 0.45, delay: index * 0.08 }}
                  className="relative rounded-[28px] border border-white/10 bg-white/[0.03] p-5 text-center"
                >
                  <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-[#7B91FF] to-[#2FD9C4] text-base font-semibold text-white shadow-[0_12px_30px_rgba(108,124,251,0.35)]">
                    {index + 1}
                  </div>
                  <div className="text-xl font-medium text-white">{step}</div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-6 py-20 md:px-10">
          <div className="mb-12 text-center">
            <p className="mb-3 text-[12px] uppercase tracking-[0.2em] text-[#7B91FF]">Lifecycle preview</p>
            <h2 className="text-3xl font-semibold tracking-[-0.05em] text-white md:text-5xl">See your pipeline in motion.</h2>
          </div>

          <div className="grid gap-8 lg:grid-cols-[0.95fr_1.05fr]">
            <Slideshow slides={slideData} />

            <motion.div
              initial={{ opacity: 0, x: 18 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.55 }}
              className="rounded-[30px] border border-white/10 bg-gradient-to-br from-[#111a2f] to-[#0c1220] p-6"
            >
              <div className="mb-4 flex items-center gap-2 text-[#7B91FF]">
                <Bot className="h-5 w-5" />
                <span className="text-[12px] uppercase tracking-[0.2em]">AI Copilot</span>
              </div>

              <div className="rounded-2xl border border-white/10 bg-[#0D1424] p-4">
                <div className="mb-4 flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-[#7B91FF] to-[#2FD9C4] text-sm font-semibold text-white">AI</div>
                  <div className="text-[12px] text-slate-300">What should I fix first?</div>
                </div>
                <div className="space-y-3 text-sm leading-7 text-slate-200">
                  <div className="rounded-xl border border-white/10 bg-white/[0.02] p-3">Priority 1: Correct formatting issues in email and phone columns.</div>
                  <div className="rounded-xl border border-white/10 bg-white/[0.02] p-3">Priority 2: Remove duplicate customer records before modeling.</div>
                  <div className="rounded-xl border border-white/10 bg-white/[0.02] p-3">Priority 3: Review outliers in high-value transactions.</div>
                </div>
              </div>

              <div className="mt-6 space-y-4">
                {[
                  "Identify hidden quality risks before they affect reporting.",
                  "Turn raw data into a governed, consistent source of truth.",
                  "Collaborate across teams with plain-language recommendations.",
                ].map((reason) => (
                  <div key={reason} className="flex gap-3 rounded-2xl border border-white/10 bg-white/[0.02] p-4">
                    <div className="mt-0.5 flex h-6 w-6 items-center justify-center rounded-full bg-[#34D399]/15 text-[#34D399]">
                      <ShieldCheck className="h-4 w-4" />
                    </div>
                    <p className="text-sm leading-7 text-slate-200">{reason}</p>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </section>

        <section id="pricing" className="mx-auto max-w-7xl px-6 py-20 md:px-10">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.15 }}
            variants={fadeUp}
            transition={{ duration: 0.5 }}
            className="mx-auto mb-12 max-w-2xl text-center"
          >
            <p className="mb-3 text-[12px] uppercase tracking-[0.2em] text-[#7B91FF]">Pricing</p>
            <h2 className="text-3xl font-semibold tracking-[-0.05em] text-white md:text-5xl">Simple plans that scale with your data.</h2>
          </motion.div>

          <div className="grid gap-6 lg:grid-cols-3">
            {plans.map((plan, index) => (
              <motion.div
                key={plan.name}
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.45, delay: index * 0.08 }}
                whileHover={{ y: -6 }}
                className={`rounded-[28px] border p-6 ${plan.featured ? "border-[#7B91FF]/50 bg-gradient-to-b from-[#121a33] to-[#0b1221] shadow-[0_20px_60px_rgba(108,124,251,0.25)]" : "border-white/10 bg-white/[0.02]"}`}
              >
                <div className="mb-5 flex items-center justify-between">
                  <h3 className="text-xl font-semibold text-white">{plan.name}</h3>
                  {plan.featured ? <span className="rounded-full bg-[#7B91FF]/20 px-2 py-1 text-[10px] uppercase tracking-[0.18em] text-[#DDE6FF]">Popular</span> : null}
                </div>

                <div className="mb-4 text-4xl font-semibold tracking-[-0.05em] text-white">{plan.price}</div>
                <p className="mb-6 text-sm leading-7 text-slate-300">{plan.description}</p>

                <ul className="space-y-3">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-center gap-3 text-sm text-slate-200">
                      <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#34D399]/15 text-[#34D399]">
                        <CheckCircle2 className="h-3.5 w-3.5" />
                      </span>
                      {feature}
                    </li>
                  ))}
                </ul>

                <button className={`mt-8 w-full rounded-xl px-4 py-3 text-sm font-medium transition ${plan.featured ? "bg-gradient-to-r from-[#6C7CFB] to-[#9A6BFF] text-white" : "border border-white/10 bg-white/[0.02] text-slate-200 hover:border-white/20 hover:text-white"}`}>
                  {plan.cta}
                </button>
              </motion.div>
            ))}
          </div>
        </section>

        <section id="contact" className="mx-auto max-w-7xl px-6 py-20 md:px-10">
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.5 }}
            className="rounded-[32px] border border-white/10 bg-gradient-to-r from-[#101a2f] via-[#0d1321] to-[#0d1726] p-8 text-center md:p-14"
          >
            <p className="mb-3 text-[12px] uppercase tracking-[0.2em] text-[#7B91FF]">Ready to go</p>
            <h2 className="text-3xl font-semibold tracking-[-0.05em] text-white md:text-5xl">Ready to clean your data?</h2>
            <p className="mx-auto mt-4 max-w-xl text-base leading-8 text-slate-300">
              Build trusted pipelines, resolve quality issues fast, and make better decisions with AI-guided insights that keep your data healthy.
            </p>
            <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link href={isAuthenticated ? "/dashboard" : "/signup"} className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#6C7CFB] to-[#9A6BFF] px-7 py-3.5 text-sm font-semibold text-white shadow-[0_18px_40px_rgba(108,124,251,0.5)] transition hover:-translate-y-0.5">
                {isAuthenticated ? "Go to Dashboard" : "Get Started"}
                <ArrowRight className="h-4 w-4" />
              </Link>
              <a href="mailto:hello@datamedic.ai" className="inline-flex items-center justify-center rounded-xl border border-white/10 bg-white/[0.02] px-7 py-3.5 text-sm font-medium text-slate-200 transition hover:border-white/20 hover:text-white">
                Contact Sales
              </a>
            </div>
          </motion.div>
        </section>
      </main>

      <footer className="relative z-10 border-t border-white/10 px-6 py-10 md:px-10">
        <div className="mx-auto flex max-w-7xl flex-col gap-5 text-sm text-slate-400 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br from-[#7B91FF] to-[#2FD9C4] text-white">
              <Layers3 className="h-4 w-4" />
            </div>
            <span>DataMedic AI</span>
          </div>

          <div className="flex flex-wrap items-center gap-5">
            <a href="#home" className="hover:text-white">Home</a>
            <a href="#features" className="hover:text-white">Features</a>
            <a href="#how-it-works" className="hover:text-white">How It Works</a>
            <a href="#pricing" className="hover:text-white">Pricing</a>
            <a href="#contact" className="hover:text-white">Contact</a>
          </div>

          <div>© 2026 DataMedic AI. All rights reserved.</div>
        </div>
      </footer>

      <ChatWidget />
    </div>
  );
}
