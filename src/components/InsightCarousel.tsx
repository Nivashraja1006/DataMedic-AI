"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft, ArrowRight, Bot, CircleAlert, Gauge, Sparkles } from "lucide-react";
import { useEffect, useState } from "react";

const slides = [
  {
    id: "health",
    title: "Dataset Health",
    accent: "#7B91FF",
    content: (
      <div className="grid gap-4 md:grid-cols-[1.1fr_0.9fr]">
        <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-4">
          <div className="mb-6 flex items-center justify-between text-[12px] text-slate-300">
            <span>Dataset health</span>
            <span className="text-[#34D399]">+18.3%</span>
          </div>

          <div className="relative flex justify-center">
            <div className="relative flex h-36 w-36 items-center justify-center rounded-full border border-white/10 bg-[#0F172A] shadow-[0_0_22px_rgba(123,145,255,0.2)]">
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
                    transition={{ duration: 0.9, ease: "easeOut" }}
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
            <div className="mb-3 flex items-center gap-2 text-[11px] uppercase tracking-[0.18em] text-slate-400">
              <Gauge className="h-3.5 w-3.5 text-[#7B91FF]" />
              Health Snapshot
            </div>
            <div className="space-y-3">
              {[
                { label: "Completeness", value: "94%" },
                { label: "Consistency", value: "89%" },
                { label: "Coverage", value: "96%" },
              ].map((metric) => (
                <div key={metric.label} className="flex items-center justify-between rounded-xl border border-white/10 bg-[#0d1426] px-3 py-2">
                  <span className="text-[12px] text-slate-300">{metric.label}</span>
                  <span className="text-[12px] text-white">{metric.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    ),
  },
  {
    id: "alerts",
    title: "Alerts",
    accent: "#FBBF24",
    content: (
      <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-4">
        <div className="mb-4 flex items-center gap-2 text-[11px] uppercase tracking-[0.18em] text-slate-400">
          <CircleAlert className="h-3.5 w-3.5 text-[#FBBF24]" />
          Monitoring alerts
        </div>

        <div className="space-y-3">
          {[
            { label: "Nulls", value: "2.4%", color: "#60A5FA" },
            { label: "Duplicates", value: "0.7%", color: "#FBBF24" },
            { label: "Outliers", value: "4.1%", color: "#FB7185" },
          ].map((alert) => (
            <motion.div
              key={alert.label}
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4 }}
              className="flex items-center justify-between rounded-xl border border-white/10 bg-[#0d1426] px-3 py-3"
            >
              <span className="text-[12px] text-slate-300">{alert.label}</span>
              <span className="text-[12px] font-medium" style={{ color: alert.color }}>{alert.value}</span>
            </motion.div>
          ))}
        </div>
      </div>
    ),
  },
  {
    id: "insight",
    title: "AI Insight",
    accent: "#2FD9C4",
    content: (
      <div className="rounded-2xl border border-white/10 bg-gradient-to-br from-[#7B91FF]/12 to-[#2FD9C4]/10 p-5">
        <div className="mb-4 flex items-center gap-2 text-[#DDE6FF]">
          <Bot className="h-4 w-4 text-[#9A6BFF]" />
          <span className="text-[12px] uppercase tracking-[0.18em]">AI Insight</span>
        </div>

        <div className="space-y-3 text-sm leading-7 text-slate-200">
          <div className="rounded-xl border border-white/10 bg-white/[0.02] p-3">
            Priority 1: Correct formatting issues in email and phone columns.
          </div>
          <div className="rounded-xl border border-white/10 bg-white/[0.02] p-3">
            Priority 2: Remove duplicate customer records before modeling.
          </div>
          <div className="rounded-xl border border-white/10 bg-white/[0.02] p-3">
            Priority 3: Review outliers in high-value transactions.
          </div>
        </div>
      </div>
    ),
  },
];

export default function InsightCarousel() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    if (isPaused) {
      return;
    }

    const interval = window.setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % slides.length);
    }, 4000);

    return () => window.clearInterval(interval);
  }, [isPaused]);

  const currentSlide = slides[activeIndex];

  const goToSlide = (direction: number) => {
    setActiveIndex((prev) => (prev + direction + slides.length) % slides.length);
  };

  return (
    <div
      className="relative overflow-hidden rounded-[30px] border border-white/10 bg-white/[0.03] p-4 shadow-[0_24px_90px_rgba(10,14,24,0.75)] backdrop-blur-md"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div className="mb-4 flex items-center justify-between gap-4">
        <div className="flex items-center gap-2 text-[#DDE6FF]">
          <Sparkles className="h-4 w-4 text-[#7B91FF]" />
          <span className="text-[11px] uppercase tracking-[0.22em] text-slate-400">Insights</span>
        </div>

        <div className="flex items-center gap-2">
          <button
            aria-label="Previous slide"
            onClick={() => goToSlide(-1)}
            className="flex h-8 w-8 items-center justify-center rounded-full border border-white/10 bg-white/[0.02] text-slate-200 transition hover:border-white/20 hover:text-white"
          >
            <ArrowLeft className="h-4 w-4" />
          </button>
          <button
            aria-label="Next slide"
            onClick={() => goToSlide(1)}
            className="flex h-8 w-8 items-center justify-center rounded-full border border-white/10 bg-white/[0.02] text-slate-200 transition hover:border-white/20 hover:text-white"
          >
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div className="relative min-h-[360px]">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentSlide.id}
            initial={{ opacity: 0, x: 30, scale: 0.98 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: -30, scale: 0.98 }}
            transition={{ duration: 0.45, ease: "easeOut" }}
            className="absolute inset-0"
          >
            <div className="mb-5 flex items-center gap-2 text-[#DDE6FF]">
              <span
                className="h-2.5 w-2.5 rounded-full"
                style={{ background: currentSlide.accent, boxShadow: `0 0 18px ${currentSlide.accent}` }}
              />
              <span className="text-[12px] uppercase tracking-[0.18em]">{currentSlide.title}</span>
            </div>
            {currentSlide.content}
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="mt-6 flex items-center justify-center gap-2">
        {slides.map((slide, index) => (
          <button
            key={slide.id}
            aria-label={`Go to slide ${index + 1}`}
            onClick={() => setActiveIndex(index)}
            className={`h-2.5 rounded-full transition-all duration-300 ${
              index === activeIndex ? "w-8 bg-gradient-to-r from-[#7B91FF] to-[#2FD9C4]" : "w-2.5 bg-white/20 hover:bg-white/35"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
