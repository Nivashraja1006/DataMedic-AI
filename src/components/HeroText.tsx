import Link from "next/link";
import { ArrowRight, CheckCircle2 } from "lucide-react";

type HeroTextProps = {
  isAuthenticated: boolean;
};

export default function HeroText({ isAuthenticated }: HeroTextProps) {
  return (
    <div className="max-w-xl">
      <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-[#14b8a6]/20 bg-[#ecfdf5]/80 px-3 py-1.5 text-[11px] font-medium uppercase tracking-[0.2em] text-slate-700 backdrop-blur-md">
        <span className="relative flex h-2.5 w-2.5 items-center justify-center">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#14b8a6]/60 opacity-75" />
          <span className="relative h-2 w-2 rounded-full bg-[#14b8a6]" />
        </span>
        Live data flow intelligence
      </div>

      <h1 className="text-[2.8rem] font-semibold leading-[0.94] tracking-[-0.065em] text-slate-900 md:text-[5rem]">
        <span className="block">Clean Data.</span>
        <span className="block bg-gradient-to-r from-[#14b8a6] via-[#3b82f6] to-[#10b981] bg-[length:200%_100%] bg-clip-text text-transparent">
          Smarter Decisions.
        </span>
      </h1>

      <p className="mt-6 max-w-lg text-base leading-8 text-slate-600 md:text-lg">
        Streamline messy files from upload to insight with a live data-quality engine that parses,
        validates, and explains every anomaly in plain language.
      </p>

      <div className="mt-8 flex flex-col gap-4 sm:flex-row">
        <Link
          href={isAuthenticated ? "/dashboard" : "/signup"}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#14b8a6] to-[#3b82f6] px-6 py-3.5 text-sm font-semibold text-white shadow-[0_10px_24px_rgba(20,184,166,0.18)] transition duration-300 hover:-translate-y-0.5 hover:shadow-[0_16px_30px_rgba(59,130,246,0.2)]"
        >
          {isAuthenticated ? "Open Dashboard" : "Get Started"}
          <ArrowRight className="h-4 w-4" />
        </Link>
        <a
          href="#how-it-works"
          className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white/80 px-6 py-3.5 text-sm font-medium text-slate-700 transition duration-300 hover:border-slate-300 hover:bg-white"
        >
          See How It Works
        </a>
      </div>

      <div className="mt-10 flex flex-wrap items-center gap-6 text-[12px] text-slate-500">
        <div className="flex items-center gap-2">
          <CheckCircle2 className="h-4 w-4 text-[#10b981]" /> 99.9% reliability
        </div>
        <div className="flex items-center gap-2">
          <CheckCircle2 className="h-4 w-4 text-[#10b981]" /> Real-time anomaly detection
        </div>
      </div>
    </div>
  );
}
