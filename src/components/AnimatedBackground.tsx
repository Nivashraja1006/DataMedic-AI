"use client";

import { motion } from "framer-motion";

export default function AnimatedBackground() {
  const blobs = [
    { className: "-top-20 -left-16 h-72 w-72 bg-[#4f46e5]/20", duration: 18 },
    { className: "top-1/3 right-0 h-80 w-80 bg-[#22d3ee]/15", duration: 22 },
    { className: "bottom-0 left-1/3 h-96 w-96 bg-[#a855f7]/15", duration: 26 },
  ];

  const particles = Array.from({ length: 18 }, (_, index) => ({
    id: index,
    size: 4 + ((index * 7) % 10),
    left: `${(index * 13) % 100}%`,
    top: `${(index * 17) % 100}%`,
    duration: 12 + (index % 8),
    delay: (index % 5) * 1.5,
  }));

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(79,70,229,0.18),transparent_25%),radial-gradient(circle_at_80%_20%,rgba(34,211,238,0.12),transparent_22%),radial-gradient(circle_at_50%_100%,rgba(168,85,247,0.14),transparent_28%)]" />

      <motion.div
        className="absolute inset-0"
        animate={{ backgroundPosition: ["0% 0%", "100% 50%", "0% 100%", "0% 0%"] }}
        transition={{ duration: 20, ease: "linear", repeat: Infinity }}
        style={{
          backgroundImage:
            "linear-gradient(120deg, rgba(59,130,246,0.10), rgba(168,85,247,0.10), rgba(34,211,238,0.08), rgba(15,23,42,0.0))",
          backgroundSize: "200% 200%",
        }}
      />

      <div className="absolute inset-0 opacity-30" style={{ backgroundImage: "linear-gradient(rgba(148,163,184,0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(148,163,184,0.08) 1px, transparent 1px)", backgroundSize: "52px 52px" }} />

      {blobs.map((blob, index) => (
        <motion.div
          key={index}
          className={`absolute rounded-full blur-3xl ${blob.className}`}
          animate={{
            x: [0, 40, -30, 0],
            y: [0, -30, 25, 0],
            scale: [1, 1.15, 0.95, 1],
          }}
          transition={{
            duration: blob.duration,
            ease: "easeInOut",
            repeat: Infinity,
            repeatType: "mirror",
          }}
        />
      ))}

      <motion.div
        className="absolute inset-x-0 bottom-[-12%] h-48 bg-[radial-gradient(circle_at_center,rgba(95,117,255,0.18),transparent_55%)] blur-3xl"
        animate={{
          scaleX: [1, 1.2, 1],
          opacity: [0.35, 0.5, 0.35],
        }}
        transition={{ duration: 15, ease: "easeInOut", repeat: Infinity }}
      />

      {particles.map((particle) => (
        <motion.span
          key={particle.id}
          className="absolute rounded-full bg-white/40"
          style={{
            width: particle.size,
            height: particle.size,
            left: particle.left,
            top: particle.top,
            boxShadow: "0 0 18px rgba(125, 211, 252, 0.45)",
          }}
          animate={{
            y: [0, -24, 0],
            opacity: [0.2, 0.6, 0.2],
            x: [0, 12, -10, 0],
          }}
          transition={{
            duration: particle.duration,
            delay: particle.delay,
            ease: "easeInOut",
            repeat: Infinity,
          }}
        />
      ))}
    </div>
  );
}
