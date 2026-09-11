"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useAuth } from "@/contexts/AuthContext";
import AnimatedBackground from "@/components/AnimatedBackground";
import Navbar from "@/components/Navbar";
import ChatWidget from "@/components/ChatWidget";
import HeroText from "@/components/HeroText";
import SignalFlow from "@/components/SignalFlow";
import ImpactSection from "@/components/ImpactSection";
import {
  ArrowRight,
  BarChart3,
  Bot,
  Database,
  Gauge,
  Layers3,
  Quote,
  ScanSearch,
  ShieldCheck,
  ShieldAlert,
  Sparkles,
  Star,
  Upload,
  Wand2,
} from "lucide-react";

const flowSteps = [
  { label: "Upload", progress: 38, active: true, icon: Database },
  { label: "Parsing", progress: 56, active: true, icon: Sparkles },
  { label: "Cleaning", progress: 74, active: true, icon: ShieldCheck },
  { label: "Validation", progress: 86, active: true, icon: Gauge },
  { label: "AI Insight", progress: 96, active: true, icon: Bot },
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

const workflowSteps = [
  { label: "Upload", icon: Upload },
  { label: "Profile", icon: ScanSearch },
  { label: "Score", icon: Gauge },
  { label: "Detect", icon: ShieldAlert },
  { label: "Clean", icon: Sparkles },
];

const testimonials = [
  { initials: "MC", name: "Maya Chen", role: "Data Lead, Northstar", accent: "#22d3ee", quote: "DataMedic turned our weekly quality review into a ten-minute check-in. The signal is finally easy to trust.", rating: 5 },
  { initials: "JR", name: "Jon Rivera", role: "Analytics Director, Kinetic", accent: "#34d399", quote: "We caught a duplicate-account issue before it reached finance. That single alert paid for the workflow.", rating: 5 },
  { initials: "AS", name: "Aisha Shah", role: "Platform Manager, Loomly", accent: "#f472b6", quote: "The recommendations are specific enough for an analyst to act on, without needing a data engineering handoff.", rating: 4 },
  { initials: "OP", name: "Owen Park", role: "VP Data, Meridian", accent: "#818cf8", quote: "Our teams speak about data health in the same language now. That consistency has been the real win.", rating: 5 },
];

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0 },
};

function AnimatedPercent({ value, delay }: { value: number; delay: number }) {
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    let frameId = 0;
    let startTime = 0;
    const duration = 1100;
    const timeoutId = window.setTimeout(() => {
      const animate = (timestamp: number) => {
        if (!startTime) startTime = timestamp;
        const progress = Math.min((timestamp - startTime) / duration, 1);
        const easedProgress = 1 - Math.pow(1 - progress, 3);
        setDisplayValue(Math.round(value * easedProgress));
        if (progress < 1) frameId = window.requestAnimationFrame(animate);
      };

      frameId = window.requestAnimationFrame(animate);
    }, delay);

    return () => {
      window.clearTimeout(timeoutId);
      window.cancelAnimationFrame(frameId);
    };
  }, [delay, value]);

  return (
    <span className="text-[10px] uppercase tracking-[0.18em] text-slate-300">{displayValue}%</span>
  );
}

function LiveClock() {
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    const intervalId = window.setInterval(() => setNow(new Date()), 1000);
    return () => window.clearInterval(intervalId);
  }, []);

  return <span>{now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: false })}</span>;
}

function LifecyclePreview() {
  const [packetPosition, setPacketPosition] = useState(0);
  const [healthScore, setHealthScore] = useState(0);
  const [barsReady, setBarsReady] = useState(false);
  const [testimonialIndex, setTestimonialIndex] = useState(0);

  useEffect(() => {
    let frameId = 0;
    let startTime = 0;
    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      setPacketPosition(((timestamp - startTime) % 9000) / 9000);
      frameId = window.requestAnimationFrame(animate);
    };
    frameId = window.requestAnimationFrame(animate);
    return () => window.cancelAnimationFrame(frameId);
  }, []);

  useEffect(() => {
    let frameId = 0;
    const startTime = performance.now();
    const animate = (timestamp: number) => {
      const progress = Math.min((timestamp - startTime) / 1100, 1);
      setHealthScore(Math.round(96 * (1 - Math.pow(1 - progress, 3))));
      if (progress < 1) frameId = window.requestAnimationFrame(animate);
    };
    frameId = window.requestAnimationFrame(animate);
    const barsTimeout = window.setTimeout(() => setBarsReady(true), 120);
    return () => {
      window.cancelAnimationFrame(frameId);
      window.clearTimeout(barsTimeout);
    };
  }, []);

  useEffect(() => {
    const intervalId = window.setInterval(() => {
      setTestimonialIndex((current) => (current + 1) % testimonials.length);
    }, 4200);
    return () => window.clearInterval(intervalId);
  }, []);

  const currentTestimonial = testimonials[testimonialIndex];
  const activeStation = Math.min(workflowSteps.length - 1, Math.floor(packetPosition * workflowSteps.length));
  const scoreCircumference = 2 * Math.PI * 47;
  const barValues = [61, 67, 73, 78, 84, 90, 96];

  return (
    <section className="mx-auto max-w-7xl px-6 py-20 md:px-10">
      <div className="mb-12 text-center">
        <p className="mb-3 font-mono text-[11px] uppercase tracking-[0.2em] text-[#22d3ee]">Lifecycle preview</p>
        <h2 className="text-3xl font-semibold tracking-[-0.05em] text-white md:text-5xl">See your pipeline in motion.</h2>
      </div>

      <div className="space-y-5">
        <div className="relative overflow-hidden rounded-[28px] border border-white/[0.08] bg-[#111319] p-5 shadow-[0_30px_80px_rgba(0,0,0,0.28)] md:p-8">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_8%_0%,rgba(99,102,241,0.12),transparent_35%),radial-gradient(circle_at_90%_100%,rgba(34,211,238,0.08),transparent_30%)]" />
          <div className="relative mb-9 flex items-center justify-between">
            <div>
              <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#8b90a3]">Continuous pipeline</p>
              <h3 className="mt-1 text-lg font-semibold text-[#eef0f5]">From raw data to ready data</h3>
            </div>
            <span className="flex items-center gap-2 rounded-full border border-[#34d399]/20 bg-[#34d399]/10 px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.15em] text-[#34d399]"><span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[#34d399]" />Live</span>
          </div>

          <div className="relative px-2 pb-2 md:px-8">
            <div className="absolute left-[10%] right-[10%] top-[27px] h-2 rounded-full bg-[#252a37]" />
            <div className="absolute left-[10%] top-[27px] h-2 rounded-full bg-gradient-to-r from-[#34d399] via-[#22d3ee] to-[#6366f1] shadow-[0_0_18px_rgba(34,211,238,0.5)] transition-[width] duration-75" style={{ width: `calc(${packetPosition * 80}% )` }} />
            <div className="absolute top-[22px] h-3.5 w-3.5 -translate-x-1/2 rounded-full bg-[radial-gradient(circle_at_35%_35%,white_0%,#22d3ee_48%,#6366f1_100%)] shadow-[0_0_12px_#22d3ee,0_0_28px_rgba(34,211,238,0.8)]" style={{ left: `${10 + packetPosition * 80}%` }} />
            <div className="relative grid grid-cols-5 gap-2">
              {workflowSteps.map((step, index) => {
                const Icon = step.icon;
                const passed = index < activeStation;
                const active = index === activeStation;
                return (
                  <div key={step.label} className="relative flex min-w-0 flex-col items-center text-center">
                    <div className={`relative flex h-14 w-14 items-center justify-center rounded-2xl border transition-all duration-500 md:h-16 md:w-16 ${passed ? "border-[#34d399]/50 bg-gradient-to-br from-[#34d399] to-[#22d3ee] text-[#061117]" : active ? "border-[#22d3ee]/60 bg-gradient-to-br from-[#6366f1] to-[#22d3ee] text-white shadow-[0_0_26px_rgba(34,211,238,0.35)]" : "border-white/[0.08] bg-[#191c25] text-[#686e80]"}`}>
                      {active && <span className="absolute -inset-2 animate-ping rounded-2xl border border-[#22d3ee]/60" />}
                      <Icon className="relative z-10 h-5 w-5" />
                    </div>
                    <span className={`mt-4 font-mono text-[9px] uppercase tracking-[0.14em] transition-colors md:text-[10px] ${active ? "text-[#22d3ee]" : passed ? "text-[#34d399]" : "text-[#8b90a3]"}`}>Step {index + 1}</span>
                    <span className="mt-1 text-[11px] text-[#eef0f5] md:text-xs">{step.label}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <div className="grid gap-5 lg:grid-cols-2">
          <div className="rounded-[28px] border border-white/[0.08] bg-[#111319] p-5 md:p-7">
            <div className="flex items-start justify-between">
              <div><p className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#22d3ee]">Weekly trend</p><h3 className="mt-2 text-xl font-semibold text-[#eef0f5]">Dataset health score</h3></div>
              <span className="flex items-center gap-2 rounded-full border border-[#34d399]/20 bg-[#34d399]/10 px-2.5 py-1 font-mono text-[9px] uppercase tracking-[0.14em] text-[#34d399]"><span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[#34d399]" />Live</span>
            </div>
            <div className="mt-7 flex items-center gap-5">
              <div className="relative h-32 w-32 shrink-0">
                <svg viewBox="0 0 112 112" className="h-full w-full -rotate-90" role="img" aria-label={`Dataset health score ${healthScore}`}>
                  <defs><linearGradient id="scoreGradient" x1="0%" x2="100%"><stop offset="0%" stopColor="#6366f1" /><stop offset="52%" stopColor="#22d3ee" /><stop offset="100%" stopColor="#34d399" /></linearGradient></defs>
                  <circle cx="56" cy="56" r="47" fill="none" stroke="#252a37" strokeWidth="8" />
                  <circle cx="56" cy="56" r="47" fill="none" stroke="url(#scoreGradient)" strokeLinecap="round" strokeWidth="8" strokeDasharray={scoreCircumference} strokeDashoffset={scoreCircumference * (1 - healthScore / 100)} className="transition-[stroke-dashoffset] duration-100" />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center"><span className="font-mono text-3xl font-semibold text-[#eef0f5]">{healthScore}</span><span className="font-mono text-[9px] uppercase tracking-[0.15em] text-[#8b90a3]">score</span></div>
              </div>
              <p className="max-w-xs text-sm leading-6 text-[#aeb2bf]">Up <strong className="text-[#34d399]">+34%</strong> vs last week, driven by fewer duplicate and null-value flags.</p>
            </div>
            <div className="mt-8 flex h-28 items-end justify-between gap-2 border-b border-white/[0.08] pb-1">
              {barValues.map((value, index) => <div key={index} className="flex h-full flex-1 flex-col items-center justify-end gap-2"><div className="w-full max-w-8 rounded-t-md transition-[height] duration-700 ease-out" style={{ height: barsReady ? `${value}%` : "0%", transitionDelay: `${index * 90}ms`, background: `linear-gradient(to top, ${index < 2 ? "#6366f1" : index < 5 ? "#22d3ee" : "#34d399"}, rgba(255,255,255,0.16))` }} /><span className="font-mono text-[9px] uppercase text-[#626a7c]">{["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"][index]}</span></div>)}
            </div>
          </div>

          <div className="relative overflow-hidden rounded-[28px] border border-white/[0.08] bg-[#111319] p-5 md:p-7">
            <div className="flex items-center justify-between"><div className="flex items-center gap-3"><Quote className="h-5 w-5 text-[#f472b6]" /><p className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#f472b6]">What teams say</p></div><span className="font-mono text-[10px] text-[#626a7c]">0{testimonialIndex + 1} / 0{testimonials.length}</span></div>
            <div key={currentTestimonial.name} className="testimonial-enter mt-10 min-h-[190px]" style={{ "--testimonial-accent": currentTestimonial.accent } as React.CSSProperties}>
              <div className="mb-5 flex gap-1" aria-label={`${currentTestimonial.rating} out of 5 stars`}>{[1, 2, 3, 4, 5].map((star) => <Star key={star} className="h-4 w-4" fill={star <= currentTestimonial.rating ? "currentColor" : "transparent"} style={{ color: star <= currentTestimonial.rating ? currentTestimonial.accent : "#3a3e4b" }} />)}</div>
              <blockquote className="max-w-xl text-xl leading-8 text-[#eef0f5] md:text-2xl">“{currentTestimonial.quote}”</blockquote>
              <div className="mt-7 flex items-center gap-3"><div className="flex h-10 w-10 items-center justify-center rounded-full font-mono text-xs font-semibold text-[#071018]" style={{ background: currentTestimonial.accent }}>{currentTestimonial.initials}</div><div><div className="text-sm font-medium text-[#eef0f5]">{currentTestimonial.name}</div><div className="mt-0.5 text-xs text-[#8b90a3]">{currentTestimonial.role}</div></div></div>
            </div>
            <div className="flex gap-2">{testimonials.map((testimonial, index) => <button key={testimonial.name} type="button" aria-label={`Show testimonial from ${testimonial.name}`} onClick={() => setTestimonialIndex(index)} className={`h-1.5 rounded-full transition-all duration-300 ${index === testimonialIndex ? "w-8" : "w-1.5 bg-[#3a3e4b]"}`} style={index === testimonialIndex ? { background: testimonial.accent } : undefined} />)}</div>
          </div>
        </div>
      </div>
      <style jsx>{` .testimonial-enter { animation: testimonialEnter 550ms ease-out both; } @keyframes testimonialEnter { from { opacity: 0; transform: translateX(18px); } to { opacity: 1; transform: translateX(0); } } @media (prefers-reduced-motion: reduce) { .testimonial-enter { animation: none; } } `}</style>
    </section>
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

            <SignalFlow />
            {/* The signal visualization owns its responsive layout and pointer motion. */}
            {/*
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
            */}
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
            <p className="mb-3 text-[12px] uppercase tracking-[0.2em] text-[#8b5cf6]">Live Data Flow</p>
            <h2 className="text-3xl font-semibold tracking-[-0.05em] text-white md:text-5xl">A real-time pipeline processing data across every stage.</h2>
          </motion.div>

          <div className="grid gap-5 lg:grid-cols-[1.3fr_0.7fr]">
            <motion.section
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.15 }}
              transition={{ duration: 0.55, ease: [0.4, 0, 0.2, 1] }}
              className="relative overflow-hidden rounded-[28px] border border-[#1c2130] bg-[#0a0c12] p-5 shadow-[0_30px_80px_rgba(0,0,0,0.4)] md:p-7"
            >
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_12%_0%,rgba(139,92,246,0.12),transparent_34%),radial-gradient(circle_at_92%_100%,rgba(52,211,153,0.08),transparent_32%)]" />
              <div className="relative z-10 mb-10 flex items-center justify-between">
                <div>
                  <div className="mb-1 font-mono text-[10px] uppercase tracking-[0.22em] text-[#8b5cf6]">Pipeline status</div>
                  <h3 className="text-lg font-semibold text-white">Ingestion pipeline</h3>
                </div>
                <div className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.16em] text-[#aeb4c5]">
                  <span className="h-2 w-2 animate-pulse rounded-full bg-[#8b5cf6] shadow-[0_0_12px_rgba(139,92,246,0.9)]" />
                  Processing
                </div>
              </div>

              <div className="relative z-10 -mx-1 overflow-x-auto pb-2">
                <div className="pipeline-track relative flex min-w-[700px] items-start justify-between px-3">
                  <div className="absolute left-[10%] right-[10%] top-9 h-px bg-[#1c2130]" />
                  <div className="pipeline-trail absolute left-[10%] top-[33px] h-[3px] w-24 rounded-full bg-gradient-to-r from-transparent via-[#8b5cf6] to-[#34d399] shadow-[0_0_14px_rgba(139,92,246,0.8)]" />

                  {flowSteps.map((step, index) => {
                    const Icon = step.icon;
                    const completed = step.progress >= 100;
                    const progressDelay = 260 + index * 330;

                    return (
                      <motion.div
                        key={step.label}
                        initial={{ opacity: 0, y: 12 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, amount: 0.3 }}
                        transition={{ duration: 0.4, delay: index * 0.08 }}
                        className="relative z-10 flex w-28 flex-col items-center text-center"
                      >
                        <div className={`relative flex h-[74px] w-[74px] items-center justify-center rounded-full border bg-[#0a0c12] transition-colors duration-500 ${completed ? "border-[#34d399] text-[#34d399] shadow-[0_0_24px_rgba(52,211,153,0.3)]" : "border-[#8b5cf6]/50 text-[#c4b5fd]"}`}>
                          {!completed && <span className="absolute -inset-1 rounded-full border border-transparent border-t-[#8b5cf6] border-r-[#8b5cf6]/40 animate-spin" />}
                          <span className={`flex h-12 w-12 items-center justify-center rounded-full ${completed ? "bg-[#34d399]/10" : "bg-[#8b5cf6]/10"}`}>
                            <Icon className="h-5 w-5" />
                          </span>
                        </div>
                        <span className="mt-4 font-mono text-[11px] text-[#e5e7eb]">{step.label}</span>
                        <AnimatedPercent value={step.progress} delay={progressDelay} />
                      </motion.div>
                    );
                  })}
                </div>
              </div>
            </motion.section>

            <motion.section
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.15 }}
              transition={{ duration: 0.55, ease: [0.4, 0, 0.2, 1], delay: 0.08 }}
              className="relative overflow-hidden rounded-[28px] border border-[#1c2130] bg-[#0a0c12] shadow-[0_30px_80px_rgba(0,0,0,0.4)]"
            >
              <div className="flex items-center gap-2 border-b border-[#1c2130] bg-[#05060a] px-4 py-3">
                <span className="h-2.5 w-2.5 rounded-full bg-[#ef4444]/80" />
                <span className="h-2.5 w-2.5 rounded-full bg-[#f59e0b]/80" />
                <span className="h-2.5 w-2.5 rounded-full bg-[#34d399]/80" />
                <span className="ml-2 font-mono text-[10px] text-[#73798b]">session · intake</span>
                <span className="ml-auto font-mono text-[10px] tabular-nums text-[#73798b]"><LiveClock /></span>
              </div>

              <div className="p-5 md:p-6">
                <div className="mb-5 flex items-center justify-between">
                  <div>
                    <div className="font-mono text-[10px] uppercase tracking-[0.22em] text-[#8b5cf6]">Reading panel</div>
                    <h3 className="mt-1 text-lg font-semibold text-white">Live console</h3>
                  </div>
                  <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-[#34d399]">streaming</span>
                </div>

                <div className="space-y-3 font-mono text-[11px] leading-5 text-[#73798b]">
                  {["Reading file...", "Analyzing columns...", "Detecting anomalies...", "Normalizing values...", "AI insight ready."].map((item, index, logs) => {
                    const isFinal = index === logs.length - 1;
                    return (
                      <motion.div
                        key={item}
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.35, delay: index * 0.15, ease: [0.4, 0, 0.2, 1] }}
                        className={`flex gap-2 ${isFinal ? "text-[#34d399]" : ""}`}
                      >
                        <span className="shrink-0 text-[#51586a]">{`14:32:${String(8 + index).padStart(2, "0")}`}</span>
                        <span className={isFinal ? "text-[#34d399]" : "text-[#8b5cf6]"}>{isFinal ? "✓" : "›"}</span>
                        <span>{item}</span>
                      </motion.div>
                    );
                  })}
                </div>

                <div className="mt-7 border-t border-[#1c2130] pt-5">
                  <div className="mb-3 flex items-center justify-between font-mono text-[10px] uppercase tracking-[0.18em] text-[#73798b]">
                    <span>Active stream</span>
                    <span className="text-[#34d399]">live</span>
                  </div>
                  <svg viewBox="0 0 600 110" preserveAspectRatio="none" className="h-24 w-full overflow-visible" aria-label="Animated live data waveform" role="img">
                    <defs>
                      <linearGradient id="waveGradient" x1="0%" x2="100%">
                        <stop offset="0%" stopColor="#8b5cf6" />
                        <stop offset="52%" stopColor="#22d3ee" />
                        <stop offset="100%" stopColor="#34d399" />
                      </linearGradient>
                    </defs>
                    <path d="M0 57 C35 18 62 90 100 52 S162 24 200 58 S262 92 300 50 S362 20 400 57 S462 90 500 52 S562 26 600 55" fill="none" stroke="#1c2130" strokeWidth="7" strokeLinecap="round" />
                    <path className="waveform-line" d="M0 57 C35 18 62 90 100 52 S162 24 200 58 S262 92 300 50 S362 20 400 57 S462 90 500 52 S562 26 600 55" fill="none" stroke="url(#waveGradient)" strokeWidth="2.5" strokeLinecap="round" />
                  </svg>
                </div>
              </div>
            </motion.section>
          </div>

          <style jsx>{`
            .pipeline-trail {
              animation: pipelineTrail 2.4s linear infinite;
            }

            .waveform-line {
              stroke-dasharray: 18 12;
              animation: waveformDash 2.8s linear infinite, waveformFloat 2.2s ease-in-out infinite;
              transform-origin: center;
            }

            @keyframes pipelineTrail {
              0% { transform: translateX(-115%); opacity: 0; }
              12% { opacity: 1; }
              82% { opacity: 1; }
              100% { transform: translateX(650%); opacity: 0; }
            }

            @keyframes waveformDash {
              to { stroke-dashoffset: -60; }
            }

            @keyframes waveformFloat {
              0%, 100% { transform: translateY(2px); }
              50% { transform: translateY(-3px); }
            }

            @media (prefers-reduced-motion: reduce) {
              .pipeline-trail, .waveform-line { animation: none; }
            }
          `}</style>
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
                  key={step.label}
                  initial={{ opacity: 0, y: 18 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.2 }}
                  transition={{ duration: 0.45, delay: index * 0.08 }}
                  className="relative rounded-[28px] border border-white/10 bg-white/[0.03] p-5 text-center"
                >
                  <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-[#7B91FF] to-[#2FD9C4] text-base font-semibold text-white shadow-[0_12px_30px_rgba(108,124,251,0.35)]">
                    {index + 1}
                  </div>
                  <div className="text-xl font-medium text-white">{step.label}</div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        <LifecyclePreview />

        <ImpactSection />

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
            <Link href="/pricing" className="hover:text-white">Pricing</Link>
            <a href="#contact" className="hover:text-white">Contact</a>
          </div>

          <div>© 2026 DataMedic AI. All rights reserved.</div>
        </div>
      </footer>

      <ChatWidget />
    </div>
  );
}
