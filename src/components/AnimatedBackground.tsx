"use client";

import { motion } from "framer-motion";

export default function AnimatedBackground() {
  const blobs = [
    { className: "-top-20 -left-16 h-72 w-72 bg-[#4f46e5]/12", duration: 18 },
    { className: "top-1/3 right-0 h-80 w-80 bg-[#22d3ee]/10", duration: 22 },
    { className: "bottom-0 left-1/3 h-96 w-96 bg-[#a855f7]/10", duration: 26 },
  ];

  const particles = Array.from({ length: 18 }, (_, index) => ({
    id: index,
    size: 3 + ((index * 7) % 8),
    left: `${(index * 13) % 100}%`,
    top: `${(index * 17) % 100}%`,
    duration: 12 + (index % 8),
    delay: (index % 5) * 1.5,
  }));

  const waveLines = [
    "M-20 65 C 80 30, 180 90, 300 60 S 480 30, 620 65 S 830 100, 1000 60",
    "M-20 120 C 120 72, 220 142, 360 110 S 560 75, 760 118 S 960 150, 1100 122",
    "M-20 165 C 100 140, 210 188, 360 162 S 590 128, 790 172 S 1000 198, 1120 168",
  ];

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(79,70,229,0.14),transparent_25%),radial-gradient(circle_at_80%_20%,rgba(34,211,238,0.10),transparent_20%),radial-gradient(circle_at_50%_100%,rgba(168,85,247,0.10),transparent_25%)]" />

      <motion.div
        className="absolute inset-0 opacity-70"
        animate={{ backgroundPosition: ["0% 0%", "100% 50%", "0% 100%", "0% 0%"] }}
        transition={{ duration: 20, ease: "linear", repeat: Infinity }}
        style={{
          backgroundImage:
            "linear-gradient(120deg, rgba(59,130,246,0.08), rgba(168,85,247,0.08), rgba(34,211,238,0.06), rgba(15,23,42,0.0))",
          backgroundSize: "200% 200%",
        }}
      />

      <div className="absolute inset-0 opacity-20" style={{ backgroundImage: "linear-gradient(rgba(148,163,184,0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(148,163,184,0.08) 1px, transparent 1px)", backgroundSize: "52px 52px" }} />

      <svg className="absolute inset-0 h-full w-full opacity-40" viewBox="0 0 1200 500" preserveAspectRatio="none" aria-hidden="true">
        {waveLines.map((line, index) => (
          <motion.path
            key={line}
            d={line}
            fill="none"
            stroke="rgba(156, 170, 255, 0.22)"
            strokeWidth="1.2"
            animate={{
              x: [0, 16, -10, 0],
              opacity: [0.16, 0.34, 0.2, 0.16],
            }}
            transition={{
              duration: 16 + index * 4,
              ease: [0.4, 0, 0.2, 1],
              repeat: Infinity,
            }}
          />
        ))}
      </svg>

      {blobs.map((blob, index) => (
        <motion.div
          key={index}
          className={`absolute rounded-full blur-3xl ${blob.className}`}
          animate={{
            x: [0, 28, -24, 0],
            y: [0, -18, 22, 0],
            scale: [1, 1.12, 0.96, 1],
          }}
          transition={{
            duration: blob.duration,
            ease: [0.4, 0, 0.2, 1],
            repeat: Infinity,
            repeatType: "mirror",
          }}
        />
      ))}

      <motion.div
        className="absolute inset-x-0 bottom-[-12%] h-48 bg-[radial-gradient(circle_at_center,rgba(95,117,255,0.12),transparent_55%)] blur-3xl"
        animate={{
          scaleX: [1, 1.18, 1],
          opacity: [0.2, 0.35, 0.2],
        }}
        transition={{ duration: 15, ease: [0.4, 0, 0.2, 1], repeat: Infinity }}
      />

      {particles.map((particle) => (
        <motion.span
          key={particle.id}
          className="absolute rounded-full bg-white/35"
          style={{
            width: particle.size,
            height: particle.size,
            left: particle.left,
            top: particle.top,
            boxShadow: "0 0 14px rgba(148, 163, 184, 0.28)",
          }}
          animate={{
            y: [0, -18, 0],
            opacity: [0.12, 0.45, 0.12],
            x: [0, 8, -6, 0],
          }}
          transition={{
            duration: particle.duration,
            delay: particle.delay,
            ease: [0.4, 0, 0.2, 1],
            repeat: Infinity,
          }}
        />
      ))}
    </div>
  );
}
