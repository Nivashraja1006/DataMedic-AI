import Link from "next/link";
import { ArrowRight, CheckCircle2 } from "lucide-react";

type HeroTextProps = {
  isAuthenticated: boolean;
};

export default function HeroText({ isAuthenticated }: HeroTextProps) {
  return (
    <div className="max-w-xl">
      <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-[#7B91FF]/30 bg-[#0e1530]/80 px-3 py-1.5 text-[12px] text-[#DDE6FF] backdrop-blur-md">
        <span className="h-2 w-2 rounded-full bg-[#34D399]" />
        AI-powered data quality for modern teams
      </div>

      <h1 className="text-[2.8rem] font-semibold leading-[0.96] tracking-[-0.06em] text-white md:text-[5rem]">
        Clean Data.
        <span className="bg-gradient-to-r from-[#7B91FF] via-[#9A6BFF] to-[#2FD9C4] bg-[length:200%_100%] bg-clip-text text-transparent animate-[pulse_4s_ease-in-out_infinite]">
          {" "}Smarter Decisions.
        </span>
      </h1>

      <p className="mt-6 max-w-lg text-base leading-8 text-slate-300 md:text-lg">
        Turn noisy, inconsistent datasets into trusted business assets with AI-powered profiling, scoring,
        detection, and cleaning workflows built for real teams.
      </p>

      <div className="mt-8 flex flex-col gap-4 sm:flex-row">
        <Link
          href={isAuthenticated ? "/dashboard" : "/signup"}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#6C7CFB] to-[#9A6BFF] px-6 py-3.5 text-sm font-semibold text-white shadow-[0_18px_40px_rgba(108,124,251,0.5)] transition hover:-translate-y-0.5 hover:shadow-[0_24px_50px_rgba(108,124,251,0.55)]"
        >
          {isAuthenticated ? "Open Dashboard" : "Get Started"}
          <ArrowRight className="h-4 w-4" />
        </Link>
        <a
          href="#how-it-works"
          className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/[0.02] px-6 py-3.5 text-sm font-medium text-slate-200 transition hover:border-white/20 hover:text-white"
        >
          See How It Works
        </a>
      </div>

      <div className="mt-10 flex flex-wrap items-center gap-6 text-[12px] text-slate-400">
        <div className="flex items-center gap-2">
          <CheckCircle2 className="h-4 w-4 text-[#34D399]" /> 99.9% reliability
        </div>
        <div className="flex items-center gap-2">
          <CheckCircle2 className="h-4 w-4 text-[#34D399]" /> Real-time monitoring
        </div>
      </div>
    </div>
  );
}
