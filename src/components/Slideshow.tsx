"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useMemo } from "react";
import { useAutoRotate } from "@/hooks/useAutoRotate";

export type SlideItem = {
  title: string;
badge: string;
  description: string;
  accent: string;
  content: Array<{ label: string; amount: number }>;
};

type SlideshowProps = {
  slides?: SlideItem[];
};

const defaultSlides: SlideItem[] = [
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

export default function Slideshow({ slides = defaultSlides }: SlideshowProps) {
  const { index, setIndex } = useAutoRotate(slides.length);
  const activeSlide = useMemo(() => slides[index], [index, slides]);

  return (
    <div className="rounded-[32px] border border-white/10 bg-[#0c1321]/80 p-6 backdrop-blur-xl">
      <div className="mb-5 flex items-center justify-between">
        <div>
          <div className="text-[11px] uppercase tracking-[0.2em] text-[#7b91ff]">Auto slideshow</div>
          <div className="mt-2 text-2xl font-semibold text-white">{activeSlide.title}</div>
        </div>
        <div className="rounded-full border border-white/10 bg-white/[0.02] px-2.5 py-1 text-[10px] uppercase tracking-[0.18em] text-slate-300">
          {activeSlide.badge}
        </div>
      </div>

      <div className="relative overflow-hidden rounded-[24px] border border-white/10 bg-white/[0.02] p-5">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeSlide.title}
            initial={{ opacity: 0, x: 30, scale: 0.98 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: -30, scale: 0.98 }}
            transition={{ duration: 0.45, ease: [0.4, 0, 0.2, 1] }}
            className="space-y-5"
          >
            <p className="text-sm leading-7 text-slate-300">{activeSlide.description}</p>

            {activeSlide.content.map((item) => (
              <div key={item.label}>
                <div className="mb-2 flex items-center justify-between text-[11px] uppercase tracking-[0.18em] text-slate-300">
                  <span>{item.label}</span>
                  <span>{item.amount}%</span>
                </div>
                <div className="h-2.5 overflow-hidden rounded-full bg-white/5">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${item.amount}%` }}
                    transition={{ duration: 0.9, ease: [0.4, 0, 0.2, 1] }}
                    className="h-full rounded-full"
                    style={{ background: `linear-gradient(90deg, ${activeSlide.accent}, #9a6bff)` }}
                  />
                </div>
              </div>
            ))}
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="mt-6 flex items-center justify-center gap-3">
        <button
          type="button"
          onClick={() => setIndex((index - 1 + slides.length) % slides.length)}
          className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/[0.02] text-slate-200 transition hover:text-white"
          aria-label="Previous slide"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>

        <div className="flex items-center gap-2">
          {slides.map((slide, slideIndex) => (
            <button
              key={slide.title}
              type="button"
              onClick={() => setIndex(slideIndex)}
              aria-label={`Go to slide ${slideIndex + 1}`}
              className={`h-2.5 rounded-full transition-all ${
                index === slideIndex ? "w-8 bg-white" : "w-2.5 bg-white/20 hover:bg-white/40"
              }`}
            />
          ))}
        </div>

        <button
          type="button"
          onClick={() => setIndex((index + 1) % slides.length)}
          className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/[0.02] text-slate-200 transition hover:text-white"
          aria-label="Next slide"
        >
          <ChevronRight className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
}
