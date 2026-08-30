"use client";

import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import AnimatedBackground from "@/components/AnimatedBackground";
import Navbar from "@/components/Navbar";
import { motion } from "framer-motion";
import {
  ArrowRight,
  BarChart3,
  Bot,
  CheckCircle2,
  Database,
  Gauge,
  Layers3,
  Menu,
  ShieldCheck,
  Sparkles,
  Wand2,
} from "lucide-react";

const navLinks = [
  { label: "Home", href: "#home" },
  { label: "Features", href: "#features" },
  { label: "How It Works", href: "#how-it-works" },
  { label: "Pricing", href: "#pricing" },
  { label: "Contact", href: "#contact" },
];

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

const steps = [
  "Upload",
  "Profile",
  "Score",
  "Detect",
  "Clean",
];

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

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

export default function LandingPage() {
  const { isAuthenticated } = useAuth();

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#020617] text-[#EDF0F8]">
      <AnimatedBackground />

      <Navbar />

      <main className="relative z-10">
        <section className="mx-auto grid max-w-7xl items-center gap-10 px-6 pb-20 pt-12 md:px-10 lg:grid-cols-[1.05fr_0.95fr] lg:pb-28 lg:pt-16">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="max-w-xl"
          >
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-[#7B91FF]/30 bg-[#0e1530]/80 px-3 py-1.5 text-[12px] text-[#DDE6FF] backdrop-blur-md">
              <span className="h-2 w-2 rounded-full bg-[#34D399]" />
              AI-powered data quality for modern teams
            </div>

            <h1 className="text-[2.8rem] font-semibold leading-[0.96] tracking-[-0.06em] text-white md:text-[5rem]">
              Clean Data.
              <span className="bg-gradient-to-r from-[#7B91FF] via-[#9A6BFF] to-[#2FD9C4] bg-clip-text text-transparent"> Smarter Decisions.</span>
            </h1>

            <p className="mt-6 max-w-lg text-base leading-8 text-slate-300 md:text-lg">
              Turn noisy, inconsistent datasets into trusted business assets with AI-powered profiling, scoring, detection, and cleaning workflows built for real teams.
            </p>

            <div className="mt-8 flex flex-col gap-4 sm:flex-row">
              <a href={isAuthenticated ? "/dashboard" : "/signup"} className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#6C7CFB] to-[#9A6BFF] px-6 py-3.5 text-sm font-semibold text-white shadow-[0_18px_40px_rgba(108,124,251,0.5)] transition hover:translate-y-[-1px]">
                {isAuthenticated ? "Open Dashboard" : "Get Started"} <ArrowRight className="h-4 w-4" />
              </a>
              <a href="#how-it-works" className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/[0.02] px-6 py-3.5 text-sm font-medium text-slate-200 transition hover:border-white/20 hover:text-white">
                See How It Works
              </a>
            </div>

            <div className="mt-10 flex flex-wrap items-center gap-6 text-[12px] text-slate-400">
              <div className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-[#34D399]" /> 99.9% reliability</div>
              <div className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-[#34D399]" /> Real-time monitoring</div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="relative"
          >
            <div className="relative mx-auto max-w-[540px] rounded-[32px] border border-white/10 bg-white/[0.03] p-4 shadow-[0_24px_90px_rgba(10,14,24,0.75)] backdrop-blur-md">
              <div className="absolute -left-6 top-14 h-28 w-28 rounded-full bg-[#7B91FF]/20 blur-3xl" />
              <div className="absolute -right-8 bottom-8 h-36 w-36 rounded-full bg-[#2FD9C4]/20 blur-3xl" />

              <div className="rounded-[28px] border border-white/10 bg-[#0A1020]/90 p-4">
                <div className="mb-4 flex items-center justify-between">
                  <div className="flex gap-2">
                    <span className="h-3 w-3 rounded-full bg-[#FF5F57]" />
                    <span className="h-3 w-3 rounded-full bg-[#FFBD2E]" />
                    <span className="h-3 w-3 rounded-full bg-[#28C840]" />
                  </div>
                  <div className="rounded-full border border-[#7B91FF]/30 bg-[#7B91FF]/10 px-2 py-1 text-[10px] uppercase tracking-[0.18em] text-[#DDE6FF]">
                    LIVE
                  </div>
                </div>

                <div className="grid gap-4 md:grid-cols-[1.1fr_0.9fr]">
                  <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-4">
                    <div className="mb-6 flex items-center justify-between text-[12px] text-slate-300">
                      <span>Dataset health</span>
                      <span className="text-[#34D399]">+18.3%</span>
                    </div>

                    <div className="relative flex justify-center">
                      <div className="relative flex h-36 w-36 items-center justify-center rounded-full border border-white/10 bg-[#0F172A]">
                        <div className="absolute inset-4 rounded-full border border-[#7B91FF]/40" />
                        <div className="absolute inset-8 rounded-full border border-[#2FD9C4]/40" />
                        <div className="text-center">
                          <div className="text-4xl font-semibold text-white">92</div>
                          <div className="mt-1 text-[10px] uppercase tracking-[0.18em] text-slate-400">Score</div>
                        </div>
                      </div>
                    </div>

                    <div className="mt-4 space-y-3">
                      {[
                        { label: "Completeness", value: 94, color: "#7B91FF" },
                        { label: "Validity", value: 89, color: "#2FD9C4" },
                        { label: "Uniqueness", value: 82, color: "#A66BFF" },
                      ].map((item) => (
                        <div key={item.label}>
                          <div className="mb-1 flex items-center justify-between text-[11px] text-slate-300">
                            <span>{item.label}</span>
                            <span>{item.value}%</span>
                          </div>
                          <div className="h-2.5 rounded-full bg-white/5">
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{ width: `${item.value}%` }}
                              transition={{ duration: 1, ease: "easeOut" }}
                              className="h-full rounded-full"
                              style={{ background: item.color }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-4">
                      <div className="mb-3 text-[11px] uppercase tracking-[0.18em] text-slate-400">Alerts</div>
                      <div className="space-y-3">
                        {[
                          { label: "Nulls", value: "2.4%", color: "#60A5FA" },
                          { label: "Duplicates", value: "0.7%", color: "#FBBF24" },
                          { label: "Outliers", value: "4.1%", color: "#FB7185" },
                        ].map((alert) => (
                          <div key={alert.label} className="flex items-center justify-between rounded-xl border border-white/10 bg-[#0d1426] px-3 py-2">
                            <span className="text-[12px] text-slate-300">{alert.label}</span>
                            <span className="text-[12px]" style={{ color: alert.color }}>{alert.value}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="rounded-2xl border border-white/10 bg-gradient-to-br from-[#7B91FF]/12 to-[#2FD9C4]/10 p-4">
                      <div className="mb-2 flex items-center gap-2 text-[#DDE6FF]">
                        <Bot className="h-4 w-4 text-[#9A6BFF]" />
                        <span className="text-[12px] uppercase tracking-[0.18em]">AI insight</span>
                      </div>
                      <p className="text-sm leading-6 text-slate-200">
                        "Customer emails appear inconsistent in 6 records. Suggested normalization is ready to apply."
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </section>

        <section id="about" className="mx-auto max-w-7xl px-6 py-20 md:px-10">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.15 }}
            variants={fadeUp}
            transition={{ duration: 0.5 }}
            className="mb-12 max-w-2xl"
          >
            <p className="mb-3 text-[12px] uppercase tracking-[0.2em] text-[#7B91FF]">About</p>
            <h2 className="text-3xl font-semibold tracking-[-0.05em] text-white md:text-5xl">What is DataMedic AI?</h2>
          </motion.div>

          <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
            <motion.div
              initial={{ opacity: 0, x: -18 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.55 }}
              className="rounded-[30px] border border-white/10 bg-white/[0.03] p-6 md:p-8"
            >
              <p className="text-base leading-8 text-slate-300">
                DataMedic AI helps teams understand, improve, and trust their data with AI-powered profiling, scoring, and actionable recommendations. Instead of chasing broken reports, teams can detect quality issues early, resolve them quickly, and keep data pipelines decision-ready.
              </p>
              <div className="mt-8 grid gap-4 sm:grid-cols-3">
                {[
                  { value: "99.9%", label: "Reliability" },
                  { value: "2.4x", label: "Faster triage" },
                  { value: "24/7", label: "Monitoring" },
                ].map((item) => (
                  <div key={item.label} className="rounded-2xl border border-white/10 bg-[#0d1426] p-4 text-center">
                    <div className="text-2xl font-semibold text-white">{item.value}</div>
                    <div className="mt-2 text-[11px] uppercase tracking-[0.18em] text-slate-400">{item.label}</div>
                  </div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 18 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.55 }}
              className="rounded-[30px] border border-white/10 bg-gradient-to-br from-[#111a2f] to-[#0c1220] p-6"
            >
              <div className="mb-4 flex items-center justify-between text-sm text-slate-300">
                <span>Quality overview</span>
                <span className="rounded-full border border-[#34D399]/30 bg-[#34D399]/10 px-2 py-1 text-[10px] uppercase tracking-[0.18em] text-[#89f8bd]">Live</span>
              </div>
              <div className="space-y-5">
                {[
                  { label: "Integrity", value: 96 },
                  { label: "Completeness", value: 92 },
                  { label: "Validity", value: 89 },
                ].map((item) => (
                  <div key={item.label}>
                    <div className="mb-2 flex items-center justify-between text-sm text-slate-300">
                      <span>{item.label}</span>
                      <span>{item.value}%</span>
                    </div>
                    <div className="h-2.5 rounded-full bg-white/5">
                      <motion.div
                        initial={{ width: 0 }}
                        whileInView={{ width: `${item.value}%` }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.7 }}
                        className="h-full rounded-full bg-gradient-to-r from-[#7B91FF] to-[#2FD9C4]"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
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
              {steps.map((step, index) => (
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
          <div className="grid gap-8 lg:grid-cols-[0.95fr_1.05fr]">
            <motion.div
              initial={{ opacity: 0, x: -18 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.55 }}
              className="rounded-[30px] border border-white/10 bg-white/[0.03] p-6"
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
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 18 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.55 }}
              className="rounded-[30px] border border-white/10 bg-gradient-to-br from-[#0c1222] to-[#111d31] p-6"
            >
              <p className="mb-3 text-[12px] uppercase tracking-[0.2em] text-[#7B91FF]">Why teams switch</p>
              <h3 className="text-3xl font-semibold tracking-[-0.05em] text-white">AI that reads the story in your data.</h3>
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
              <Link href={isAuthenticated ? "/dashboard" : "/signup"} className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#6C7CFB] to-[#9A6BFF] px-7 py-3.5 text-sm font-semibold text-white shadow-[0_18px_40px_rgba(108,124,251,0.5)] transition hover:translate-y-[-1px]">
                {isAuthenticated ? "Go to Dashboard" : "Get Started"} <ArrowRight className="h-4 w-4" />
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
    </div>
  );
}
