"use client";

import Link from "next/link";
import { useState } from "react";
import { motion } from "framer-motion";
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { useAuth } from "@/contexts/AuthContext";
import AnimatedBackground from "@/components/AnimatedBackground";
import Navbar from "@/components/Navbar";
import ChatWidget from "@/components/ChatWidget";
import HeroText from "@/components/HeroText";
import Slideshow from "@/components/Slideshow";
import {
  AlertTriangle,
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

const pipelineSteps = [
  { label: "Upload", icon: Database, progress: "42%", active: false },
  { label: "Parsing", icon: Sparkles, progress: "58%", active: false },
  { label: "Cleaning", icon: ShieldCheck, progress: "78%", active: true },
  { label: "Validation", icon: Gauge, progress: "87%", active: true },
  { label: "AI Insight", icon: Bot, progress: "96%", active: false },
];

const chartData = [
  { name: "Mon", value: 64 },
  { name: "Tue", value: 68 },
  { name: "Wed", value: 72 },
  { name: "Thu", value: 70 },
  { name: "Fri", value: 85 },
  { name: "Sat", value: 88 },
  { name: "Sun", value: 92 },
];

const liveSignalData = [
  { name: "T1", value: 38 },
  { name: "T2", value: 52 },
  { name: "T3", value: 48 },
  { name: "T4", value: 66 },
  { name: "T5", value: 58 },
  { name: "T6", value: 72 },
  { name: "T7", value: 64 },
  { name: "T8", value: 80 },
  { name: "T9", value: 76 },
  { name: "T10", value: 88 },
  { name: "T11", value: 82 },
  { name: "T12", value: 94 },
];

const flowSteps = [
  { label: "Upload", progress: 38, active: true, icon: Database },
  { label: "Parsing", progress: 56, active: true, icon: Sparkles },
  { label: "Cleaning", progress: 74, active: true, icon: ShieldCheck },
  { label: "Validation", progress: 86, active: true, icon: Gauge },
  { label: "AI Insight", progress: 96, active: true, icon: Bot },
];

const alerts = [
  { label: "Nulls", value: "2.4%", tone: "text-[#60a5fa]" },
  { label: "Duplicates", value: "0.7%", tone: "text-[#fbbf24]" },
  { label: "Outliers", value: "4.1%", tone: "text-[#fb7185]" },
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

function AnimatedPercent({ value }: { value: number }) {
  return (
    <motion.span
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: "easeOut" }}
      className="text-[10px] uppercase tracking-[0.18em] text-slate-300"
    >
      {value}%
    </motion.span>
  );
}

export default function LandingPage() {
  const { isAuthenticated } = useAuth();

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#020617] text-[#EDF0F8]">
      <motion.div
        className="fixed left-0 top-0 z-[100] h-[2px] bg-gradient-to-r from-[#7b91ff] via-[#9a6bff] to-[#2fd9c4] shadow-[0_0_18px_rgba(123,145,255,0.7)]"
        style={{ width: "58%" }}
      />

      <AnimatedBackground />
      <Navbar />

      <main className="relative z-10 bg-[#020617] text-[#edf2ff]">
        <section id="home" className="mx-auto grid max-w-7xl items-center gap-10 px-6 pb-20 pt-12 md:px-10 lg:grid-cols-[1.02fr_0.98fr] lg:pb-28 lg:pt-16">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
          >
            <HeroText isAuthenticated={isAuthenticated} />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: [0.4, 0, 0.2, 1] }}
            className="relative"
            style={{ transform: "perspective(1200px) rotateX(0deg) rotateY(0deg)" }}
          >
            <div className="absolute -left-8 top-8 h-28 w-28 rounded-full bg-[#7b91ff]/20 blur-3xl" />
            <div className="absolute -right-8 bottom-8 h-32 w-32 rounded-full bg-[#5eead4]/20 blur-3xl" />

            <div className="relative mx-auto max-w-[620px] rounded-[32px] border border-white/10 bg-white/[0.03] p-4 shadow-[0_25px_90px_rgba(9,14,25,0.78)] backdrop-blur-xl">
              <div className="rounded-[28px] border border-white/10 bg-[#09111d]/90 p-4">
                <div className="mb-4 flex items-center justify-between">
                  <div className="flex items-center gap-2 text-[11px] font-medium uppercase tracking-[0.18em] text-slate-300">
                    <span className="h-2.5 w-2.5 rounded-full bg-[#5eead4]" />
                    Live data pipeline
                  </div>
                  <div className="rounded-full border border-[#7b91ff]/30 bg-[#7b91ff]/10 px-2.5 py-1 text-[10px] font-medium uppercase tracking-[0.18em] text-[#dfe7ff]">
                    Running
                  </div>
                </div>

                <div className="rounded-[24px] border border-white/10 bg-gradient-to-br from-[#0c1628] via-[#0c1220] to-[#10192f] p-4">
                  <div className="mb-5 flex items-center justify-between rounded-2xl border border-white/10 bg-white/[0.02] px-3 py-2.5">
                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-[#7b91ff]/18 to-[#5eead4]/18 text-[#dfe7ff]">
                        <Database className="h-4 w-4" />
                      </div>
                      <div>
                        <div className="text-xs font-medium text-slate-200">customer_export.csv</div>
                        <div className="text-[11px] text-slate-400">214 rows • 14 columns</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-[10px] uppercase tracking-[0.18em] text-slate-400">Status</div>
                      <div className="text-sm font-semibold text-[#7ee0d6]">Processing</div>
                    </div>
                  </div>

                  <div className="relative mb-5 px-2">
                    <svg className="absolute left-1/2 top-9 h-[120px] w-[82%] -translate-x-1/2" viewBox="0 0 500 120" preserveAspectRatio="none" aria-hidden="true">
                      <motion.path
                        d="M 26 60 L 100 60 M 100 60 L 195 60 M 195 60 L 300 60 M 300 60 L 410 60"
                        stroke="rgba(126, 224, 214, 0.4)"
                        strokeWidth="2"
                        strokeDasharray="8 8"
                        fill="none"
                        initial={{ pathLength: 0.4 }}
                        animate={{ pathLength: 1 }}
                        transition={{ duration: 0.7, ease: "easeOut" }}
                      />
                    </svg>

                    <div className="grid grid-cols-5 gap-3">
                      {pipelineSteps.map((step, index) => {
                        const Icon = step.icon;
                        const isActive = step.active;
                        return (
                          <motion.div
                            key={step.label}
                            whileHover={{ y: -3, scale: 1.02 }}
                            transition={{ duration: 0.2, ease: "easeOut" }}
                            className={`relative rounded-2xl border p-3 text-center ${isActive ? "border-[#7ee0d6]/50 bg-[#0f1f2d]" : "border-white/10 bg-white/[0.02]"}`}
                          >
                            <div className={`mx-auto mb-2 flex h-9 w-9 items-center justify-center rounded-xl ${index % 2 === 0 ? "bg-gradient-to-br from-[#7b91ff] to-[#6ee7d9]" : "bg-gradient-to-br from-[#9a6bff] to-[#7b91ff]"} text-white`}>
                              <Icon className="h-4 w-4" />
                            </div>
                            <div className="text-[11px] font-medium text-slate-200">{step.label}</div>
                            <div className="mt-2 text-[10px] uppercase tracking-[0.18em] text-slate-400">{step.progress}</div>
                          </motion.div>
                        );
                      })}
                    </div>
                  </div>

                  <div className="grid gap-4 xl:grid-cols-[1.14fr_0.86fr]">
                    <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-4">
                      <div className="mb-3 flex items-center justify-between text-[11px] text-slate-300">
                        <span className="uppercase tracking-[0.18em]">Quality score</span>
                        <span className="font-medium text-[#7ee0d6]">92/100</span>
                      </div>

                      <div className="flex items-center gap-4">
                        <div className="relative flex h-28 w-28 items-center justify-center rounded-full border border-white/10 bg-[#111c2d]">
                          <motion.div
                            initial={{ scale: 0.96 }}
                            animate={{ scale: 1 }}
                            transition={{ duration: 0.5, ease: "easeOut" }}
                            className="absolute inset-2 rounded-full border border-[#7ee0d6]/40"
                          />
                          <div className="text-center">
                            <div className="text-3xl font-semibold text-white">92</div>
                            <div className="text-[10px] uppercase tracking-[0.18em] text-slate-400">Score</div>
                          </div>
                        </div>

                        <div className="flex-1 space-y-3">
                          {[
                            { label: "Completeness", value: 94, color: "#7b91ff" },
                            { label: "Validity", value: 89, color: "#6ee7d9" },
                            { label: "Uniqueness", value: 82, color: "#9a6bff" },
                          ].map((metric) => (
                            <div key={metric.label}>
                              <div className="mb-1 flex items-center justify-between text-[11px] text-slate-300">
                                <span>{metric.label}</span>
                                <span>{metric.value}%</span>
                              </div>
                              <div className="h-2 rounded-full bg-white/5">
                                <motion.div
                                  initial={{ width: 0 }}
                                  animate={{ width: `${metric.value}%` }}
                                  transition={{ duration: 0.9, ease: [0.4, 0, 0.2, 1] }}
                                  className="h-full rounded-full"
                                  style={{ background: metric.color }}
                                />
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-4">
                        <div className="mb-3 flex items-center gap-2 text-[11px] uppercase tracking-[0.18em] text-slate-400">
                          <AlertTriangle className="h-3.5 w-3.5 text-[#fbbf24]" />
                          Alerts
                        </div>

                        <div className="space-y-3">
                          {alerts.map((alert) => (
                            <div key={alert.label} className="flex items-center justify-between rounded-xl border border-white/10 bg-[#0d1426] px-3 py-2.5">
                              <span className="text-[12px] text-slate-300">{alert.label}</span>
                              <span className={`text-[12px] font-medium ${alert.tone}`}>{alert.value}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="rounded-2xl border border-[#7b91ff]/20 bg-gradient-to-br from-[#7b91ff]/12 to-[#5eead4]/10 p-4">
                        <div className="mb-2 flex items-center gap-2 text-[#dfe7ff]">
                          <Bot className="h-4 w-4 text-[#7b91ff]" />
                          <span className="text-[12px] uppercase tracking-[0.18em]">AI insight</span>
                        </div>
                        <p className="text-sm leading-6 text-slate-200">
                          “AI detected inconsistencies and suggests normalization for the email and billing columns.”
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 rounded-2xl border border-white/10 bg-white/[0.02] p-4">
                    <div className="mb-3 flex items-center justify-between text-[11px] uppercase tracking-[0.18em] text-slate-400">
                      <span>Data health trend</span>
                      <span className="text-[#7ee0d6]">+18.3%</span>
                    </div>

                    <div className="h-28 w-full">
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                          <defs>
                            <linearGradient id="qualityFill" x1="0" x2="0" y1="0" y2="1">
                              <stop offset="0%" stopColor="#7b91ff" stopOpacity={0.55} />
                              <stop offset="100%" stopColor="#7b91ff" stopOpacity={0.05} />
                            </linearGradient>
                          </defs>
                          <CartesianGrid stroke="rgba(148,163,184,0.12)" vertical={false} />
                          <XAxis dataKey="name" tickLine={false} axisLine={false} tick={{ fill: "#94a3b8", fontSize: 11 }} />
                          <YAxis hide domain={[50, 100]} />
                          <Tooltip
                            cursor={{ stroke: "rgba(148,163,184,0.25)" }}
                            contentStyle={{ background: "#0f172a", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 12 }}
                          />
                          <Area type="monotone" dataKey="value" stroke="#7b91ff" strokeWidth={3} fill="url(#qualityFill)" />
                        </AreaChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </section>

        <section id="live-data-flow" className="mx-auto max-w-7xl px-6 py-20 md:px-10">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.15 }}
            variants={fadeUp}
            transition={{ duration: 0.5 }}
            className="mx-auto mb-10 max-w-3xl text-center"
          >
            <p className="mb-3 text-[12px] uppercase tracking-[0.2em] text-[#7B91FF]">Live Data Flow</p>
            <h2 className="text-3xl font-semibold tracking-[-0.05em] text-white md:text-5xl">A real-time pipeline processing data across every stage.</h2>
          </motion.div>

          <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.15 }}
              transition={{ duration: 0.55, ease: [0.4, 0, 0.2, 1] }}
              className="relative overflow-hidden rounded-[34px] border border-white/10 bg-[#050d18]/90 p-5 shadow-[0_30px_80px_rgba(2,6,23,0.6)] backdrop-blur-xl"
              layout={false}
            >
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(138,160,255,0.18),_transparent_30%),radial-gradient(circle_at_bottom_right,_rgba(91,182,177,0.12),_transparent_28%)]" />
              <div className="absolute inset-0 opacity-30 [background-image:linear-gradient(rgba(148,163,184,0.08)_1px,transparent_1px),linear-gradient(90deg,rgba(148,163,184,0.08)_1px,transparent_1px)] [background-size:28px_28px]" />

              <div className="relative z-10 mb-5 flex items-center justify-between">
                <div className="text-[10px] uppercase tracking-[0.2em] text-slate-400">Pipeline status</div>
                <div className="inline-flex items-center gap-2 rounded-full border border-[#8aa0ff]/20 bg-[#8aa0ff]/10 px-2.5 py-1 text-[10px] uppercase tracking-[0.18em] text-[#dfe7ff] shadow-[0_0_18px_rgba(138,160,255,0.14)]">
                  <span className="h-2 w-2 animate-pulse rounded-full bg-[#5bb6b1]" />
                  Processing
                </div>
              </div>

              <div className="relative z-10 overflow-hidden rounded-[26px] border border-white/10 bg-[#08131d]/85 p-4">
                <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-[#8aa0ff]/8 to-transparent" />
                <div className="absolute inset-x-4 bottom-8 h-20 opacity-80">
                  <svg viewBox="0 0 600 120" preserveAspectRatio="none" className="h-full w-full" aria-hidden="true">
                    <path d="M 0 62 C 42 60, 60 90, 110 58 S 180 28, 240 62 S 320 90, 390 56 S 480 32, 600 70" fill="none" stroke="rgba(138,160,255,0.5)" strokeWidth="2" strokeLinecap="round" />
                    <path d="M 0 76 C 58 80, 96 44, 146 70 S 224 96, 300 62 S 394 36, 470 74 S 548 84, 600 62" fill="none" stroke="rgba(91,182,177,0.45)" strokeWidth="1.5" strokeLinecap="round" />
                  </svg>
                </div>

                <div className="relative mb-4 flex items-center justify-between gap-2">
                  <div className="text-[11px] uppercase tracking-[0.2em] text-slate-400">Flow</div>
                  <div className="h-1.5 w-24 overflow-hidden rounded-full bg-white/5">
                    <div className="h-full w-1/3 rounded-full bg-gradient-to-r from-[#8aa0ff] via-[#9a6bff] to-[#5bb6b1]" />
                  </div>
                </div>

                <div className="relative">
                  <div className="absolute left-6 right-6 top-1/2 hidden h-px -translate-y-1/2 bg-gradient-to-r from-transparent via-white/10 to-transparent md:block" />
                  <div className="absolute left-10 right-10 top-1/2 hidden h-10 -translate-y-1/2 md:block">
                    {[...Array(12)].map((_, particleIndex) => (
                      <span
                        key={particleIndex}
                        className="absolute top-1/2 h-1.5 w-1.5 rounded-full bg-[#8aa0ff] shadow-[0_0_12px_rgba(138,160,255,0.85)] opacity-70"
                        style={{
                          left: `${(particleIndex / 12) * 100}%`,
                          transform: "translateY(-50%)",
                        }}
                      />
                    ))}
                  </div>

                  <div className="relative grid gap-3 md:grid-cols-5">
                    {flowSteps.map((step, index) => {
                      const Icon = step.icon;
                      const active = index < flowSteps.length - 1 || step.progress >= 90;

                      return (
                        <motion.div
                          key={step.label}
                          initial={{ opacity: 0, y: 14 }}
                          whileInView={{ opacity: 1, y: 0 }}
                          viewport={{ once: true, amount: 0.25 }}
                          transition={{ duration: 0.45, delay: index * 0.08, ease: [0.4, 0, 0.2, 1] }}
                          whileHover={{ y: -4, scale: 1.02 }}
                          className="relative"
                        >
                          <motion.div
                            transition={{ duration: 0.2, ease: "easeOut" }}
                            className={`relative overflow-hidden rounded-[22px] border p-3.5 ${active ? "border-[#8aa0ff]/30 bg-[#0d1a2b]/95" : "border-white/8 bg-white/[0.025]"}`}
                          >
                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent opacity-0 transition-opacity duration-300 hover:opacity-100" />
                            <div className="relative z-10">
                              <div className={`mb-3 flex h-9 w-9 items-center justify-center rounded-xl border ${active ? "border-[#8aa0ff]/30 bg-[#0f2338] text-[#edf2ff] shadow-[0_0_18px_rgba(138,160,255,0.18)]" : "border-white/5 bg-[#111b2b] text-slate-400"}`}>
                                <Icon className="h-4 w-4" />
                              </div>

                              <div className="mb-2 flex items-center justify-between gap-2">
                                <span className="text-[11px] font-medium text-white">{step.label}</span>
                                <AnimatedPercent value={step.progress} />
                              </div>

                              <div className="h-1.5 overflow-hidden rounded-full bg-white/5">
                                <motion.div
                                  initial={{ width: 0 }}
                                  animate={{ width: `${step.progress}%` }}
                                  transition={{ duration: 0.9, ease: "easeOut", delay: 0.2 + index * 0.08 }}
                                  className={`h-full rounded-full ${active ? "bg-gradient-to-r from-[#8aa0ff] via-[#9a6bff] to-[#5bb6b1] shadow-[0_0_16px_rgba(138,160,255,0.5)]" : "bg-slate-600"}`}
                                />
                              </div>
                            </div>
                          </motion.div>
                        </motion.div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.15 }}
              transition={{ duration: 0.55, ease: [0.4, 0, 0.2, 1], delay: 0.08 }}
              className="rounded-[34px] border border-white/10 bg-[#060d18]/90 p-5 shadow-[0_30px_80px_rgba(2,6,23,0.62)] backdrop-blur-xl"
            >
              <div className="mb-4 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="relative flex h-2.5 w-2.5 items-center justify-center">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#5bb6b1]/80 opacity-80" />
                    <span className="relative h-2 w-2 rounded-full bg-[#5bb6b1]" />
                  </span>
                  <div className="text-[10px] uppercase tracking-[0.2em] text-slate-400">Reading panel</div>
                </div>
                <div className="rounded-full border border-white/10 bg-white/[0.02] px-2 py-1 text-[10px] uppercase tracking-[0.18em] text-slate-300">
                  processing
                </div>
              </div>

              <div className="rounded-[24px] border border-white/10 bg-[#09151f] p-4">
                <div className="mb-4 flex items-center justify-between text-[10px] uppercase tracking-[0.2em] text-slate-400">
                  <span>session / intake</span>
                  <span>14:32:08</span>
                </div>

                <div className="space-y-2 text-sm text-slate-300">
                  {[
                    "Reading file...",
                    "Analyzing columns...",
                    "Detecting anomalies...",
                    "Normalizing values...",
                    "AI insight ready."
                  ].map((item, index) => (
                    <motion.div
                      key={item}
                      initial={{ opacity: 0, x: 8 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.28, delay: index * 0.07, ease: [0.4, 0, 0.2, 1] }}
                      className="flex items-center gap-2 rounded-xl border border-white/5 bg-white/[0.02] px-2.5 py-2"
                    >
                      <span className="h-1.5 w-1.5 rounded-full bg-[#8aa0ff]" />
                      <span>{item}</span>
                    </motion.div>
                  ))}
                </div>

                <div className="mt-4 rounded-[18px] border border-white/10 bg-[#0b1a2d] p-3">
                  <div className="mb-2 flex items-center gap-2 text-[10px] uppercase tracking-[0.2em] text-slate-400">
                    <span className="inline-block h-2 w-2 rounded-full bg-[#5bb6b1]" />
                    Active stream
                  </div>

                  <div className="flex min-h-[52px] items-end gap-1">
                    {[28, 34, 42, 31, 44, 36, 58, 52, 64, 54, 68, 62, 74, 70, 80, 75, 84, 76, 66, 60].map((bar, index) => (
                      <span key={`${bar}-${index}`} className="w-1.5 rounded-full bg-gradient-to-t from-[#8aa0ff] to-[#5bb6b1] shadow-[0_0_14px_rgba(91,182,177,0.4)]" style={{ height: `${bar}px` }} />
                    ))}
                  </div>
                </div>
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
