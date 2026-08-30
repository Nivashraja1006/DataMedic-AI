"use client";

import { motion } from "framer-motion";

export default function AnimatedBackground() {
  const singleFloat = { className: "-top-20 -left-16 h-72 w-72 bg-[#4f46e5]/10", duration: 18 };
  const singleFlowLine = "M-20 120 C 120 72, 220 142, 360 110 S 560 75, 760 118 S 960 150, 1100 122";

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(79,70,229,0.14),transparent_25%),radial-gradient(circle_at_80%_20%,rgba(34,211,238,0.10),transparent_20%),radial-gradient(circle_at_50%_100%,rgba(168,85,247,0.10),transparent_25%)]" />

      <motion.div
        className="absolute inset-0 opacity-70"
        animate={{ opacity: 0.7 }}
        transition={{ duration: 18, ease: "easeInOut", repeat: Infinity, repeatType: "reverse" }}
        style={{
          backgroundImage:
            "linear-gradient(120deg, rgba(59,130,246,0.06), rgba(168,85,247,0.06), rgba(34,211,238,0.04), rgba(15,23,42,0.0))",
          backgroundSize: "200% 200%",
        }}
      />

      <div className="absolute inset-0 opacity-20" style={{ backgroundImage: "linear-gradient(rgba(148,163,184,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(148,163,184,0.06) 1px, transparent 1px)", backgroundSize: "52px 52px" }} />

      <svg className="absolute inset-0 h-full w-full opacity-40" viewBox="0 0 1200 500" preserveAspectRatio="none" aria-hidden="true">
        <motion.path
          d={singleFlowLine}
          fill="none"
          stroke="rgba(156, 170, 255, 0.22)"
          strokeWidth="1.2"
          animate={{ x: 12, opacity: 0.28 }}
          transition={{ duration: 16, ease: "easeInOut", repeat: Infinity, repeatType: "reverse" }}
        />
      </svg>

      <motion.div
        className={`absolute rounded-full blur-2xl ${singleFloat.className}`}
        animate={{ x: 18, y: -12, scale: 1.04 }}
        transition={{
          duration: singleFloat.duration,
          ease: "easeInOut",
          repeat: Infinity,
          repeatType: "reverse",
        }}
      />
    </div>
  );
}
