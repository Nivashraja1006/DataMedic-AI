"use client";

import { motion } from "framer-motion";
import { CheckCircle2 } from "lucide-react";

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

export default function PricingSection() {
  return (
    <section id="pricing" className="mx-auto max-w-7xl px-6 py-20 md:px-10">
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.15 }}
        variants={{ hidden: { opacity: 0, y: 24 }, visible: { opacity: 1, y: 0 } }}
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
  );
}
