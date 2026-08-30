"use client";

import { motion, animate, useMotionValue, useTransform } from "framer-motion";
import { useEffect } from "react";
import { AlertTriangle, Bot, ShieldCheck } from "lucide-react";

const metrics = [
  { label: "Completeness", value: 94, color: "#7b91ff" },
  { label: "Validity", value: 89, color: "#2fd9c4" },
  { label: "Uniqueness", value: 82, color: "#a66bff" },
];

const alerts = [
  { label: "Nulls", value: "2.4%", tone: "#60a5fa" },
  { label: "Duplicates", value: "0.7%", tone: "#fbbf24" },
  { label: "Outliers", value: "4.1%", tone: "#fb7185" },
];

function AnimatedCounter({ value, suffix = "" }: { value: number; suffix?: string }) {
  const motionValue = useMotionValue(0);
  const rounded = useTransform(motionValue, (latest) => `${Math.round(latest)}${suffix}`);

  useEffect(() => {
    const controls = animate(motionValue, value, { duration: 1.3, ease: "easeOut" });
    return () => controls.stop();
  }, [motionValue, value]);

  return <motion.span style={{ display: "inline-block" }}>{rounded}</motion.span>;
}

export default function DashboardPreview() {
  return (
    <motion.div
      className="relative mx-auto w-full max-w-[560px]"
      initial={{ opacity: 0, y: 18, rotateX: 6 }}
      animate={{ opacity: 1, y: 0, rotateX: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      whileHover={{ y: -4, rotateX: 2, rotateY: -2 }}
      style={{ transformStyle: "preserve-3d" }}
      layout={false}
    >
      <div className="absolute -left-8 top-10 h-28 w-28 rounded-full bg-[#7b91ff]/15 blur-3xl" />
      <div className="absolute -right-10 bottom-6 h-36 w-36 rounded-full bg-[#8d6af7]/12 blur-3xl" />

      <div className="relative rounded-[32px] border border-white/10 bg-white/[0.03] p-4 shadow-[0_24px_90px_rgba(10,14,24,0.65)] backdrop-blur-xl">
        <div className="rounded-[28px] border border-white/10 bg-[#09111d]/90 p-4">
          <div className="mb-4 flex items-center justify-between">
            <div className="flex gap-2">
              {["#FF5F57", "#FFBD2E", "#28C840"].map((color) => (
                <span key={color} className="h-3 w-3 rounded-full" style={{ background: color }} />
              ))}
            </div>
            <div className="inline-flex items-center gap-1.5 rounded-full border border-[#8aa8ff]/25 bg-[#8aa8ff]/10 px-2 py-1 text-[10px] uppercase tracking-[0.18em] text-[#dfe7ff]">
              <span className="relative flex h-2 w-2 items-center justify-center">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#7ac7b3]/70" />
                <span className="relative h-1.5 w-1.5 rounded-full bg-[#7ac7b3]" />
              </span>
              Live
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-[1.08fr_0.92fr]">
            <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-4">
              <div className="mb-6 flex items-center justify-between text-[12px] text-slate-300">
                <span>Dataset health</span>
                <span className="text-[#86d6ba]">+18.3%</span>
              </div>

              <div className="relative flex justify-center">
                <motion.div
                  animate={{ scale: 1 }}
                  transition={{ duration: 0.4, ease: "easeOut" }}
                  className="relative flex h-36 w-36 items-center justify-center rounded-full border border-white/10 bg-[#0f172a]"
                >
                  <div className="absolute inset-4 rounded-full border border-[#8aa8ff]/30" />
                  <div className="absolute inset-8 rounded-full border border-[#8a6cd9]/30" />
                  <div className="text-center">
                    <div className="text-4xl font-semibold text-white">
                      <AnimatedCounter value={92} />
                    </div>
                    <div className="mt-1 text-[10px] uppercase tracking-[0.18em] text-slate-400">Score</div>
                  </div>
                </motion.div>
              </div>

              <div className="mt-4 space-y-3">
                {metrics.map((metric) => (
                  <div key={metric.label}>
                    <div className="mb-1 flex items-center justify-between text-[11px] text-slate-300">
                      <span>{metric.label}</span>
                      <span>{metric.value}%</span>
                    </div>
                    <div className="h-2.5 rounded-full bg-white/5">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${metric.value}%` }}
                        transition={{ duration: 1.1, ease: [0.4, 0, 0.2, 1] }}
                        className="h-full rounded-full"
                        style={{ background: metric.color }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-4">
                <div className="mb-3 flex items-center gap-2 text-[11px] uppercase tracking-[0.18em] text-slate-400">
                  <AlertTriangle className="h-3.5 w-3.5 text-[#f1c777]" />
                  Alerts
                </div>

                <div className="space-y-3">
                  {alerts.map((alert) => (
                    <div
                      key={alert.label}
                      className="flex items-center justify-between rounded-xl border border-white/10 bg-[#0e1729] px-3 py-2.5"
                    >
                      <span className="text-[12px] text-slate-300">{alert.label}</span>
                      <span className="text-[12px] font-medium" style={{ color: alert.tone }}>
                        {alert.value}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-2xl border border-white/10 bg-gradient-to-br from-[#8aa8ff]/10 to-[#8a6cd9]/10 p-4">
                <div className="mb-2 flex items-center gap-2 text-[#dfe7ff]">
                  <Bot className="h-4 w-4 text-[#8aa8ff]" />
                  <span className="text-[12px] uppercase tracking-[0.18em]">AI insight</span>
                </div>
                <p className="text-sm leading-6 text-slate-200">
                  “Customer emails are inconsistent in 6 records. Suggested normalization is ready to apply.”
                </p>
              </div>

              <div className="rounded-2xl border border-[#86d6ba]/20 bg-[#86d6ba]/8 p-3 text-[12px] text-[#d8f7ea]">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="h-4 w-4 text-[#86d6ba]" />
                  Data quality baseline improved 18.3%
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
