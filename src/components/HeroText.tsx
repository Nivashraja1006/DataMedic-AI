import Link from "next/link";
import { ArrowRight, CheckCircle2 } from "lucide-react";

type HeroTextProps = {
  isAuthenticated: boolean;
};

export default function HeroText({ isAuthenticated }: HeroTextProps) {
  return (
    <div className="max-w-xl">
      <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-[#7b91ff]/30 bg-[#0d1324]/75 px-3 py-1.5 text-[11px] font-medium uppercase tracking-[0.2em] text-slate-200 backdrop-blur-md">
        <span className="relative flex h-2.5 w-2.5 items-center justify-center">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#5eead4]/80 opacity-75" />
          <span className="relative h-2 w-2 rounded-full bg-[#5eead4]" />
        </span>
        Trusted by 2000+ data teams
      </div>

      <h1 className="text-[2.8rem] font-semibold leading-[0.94] tracking-[-0.065em] text-white md:text-[5rem]">
        <span className="block">Clean Data.</span>
        <span className="block bg-gradient-to-r from-[#7b91ff] via-[#8a6ad9] to-[#6ee7d9] bg-[length:200%_100%] bg-clip-text text-transparent">
          Smarter Decisions.
        </span>
      </h1>

      <p className="mt-6 max-w-lg text-base leading-8 text-slate-300 md:text-lg">
        AI-powered data quality for modern teams—detect issues early, standardize messy records,
        and turn raw files into trusted business decisions in minutes.
      </p>

      <div className="mt-8 flex flex-col gap-4 sm:flex-row">
        <Link
          href={isAuthenticated ? "/dashboard" : "/signup"}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#6ee7d9] via-[#7b91ff] to-[#9a6bff] px-6 py-3.5 text-sm font-semibold text-white shadow-[0_18px_35px_rgba(123,145,255,0.28)] transition duration-300 hover:-translate-y-0.5 hover:shadow-[0_22px_40px_rgba(123,145,255,0.35)]"
        >
          {isAuthenticated ? "Open Dashboard" : "Start free cleaning"}
          <ArrowRight className="h-4 w-4" />
        </Link>
        <a
          href="#how-it-works"
          className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/[0.03] px-6 py-3.5 text-sm font-medium text-slate-100 transition duration-300 hover:border-white/20 hover:bg-white/[0.05] hover:text-white"
        >
          See how it works
        </a>
      </div>

      <div className="mt-10 flex flex-wrap items-center gap-6 text-[12px] text-slate-300">
        <div className="flex items-center gap-2">
          <CheckCircle2 className="h-4 w-4 text-[#6ee7d9]" /> 99.9% reliability
        </div>
        <div className="flex items-center gap-2">
          <CheckCircle2 className="h-4 w-4 text-[#6ee7d9]" /> Real-time data health tracking
        </div>
      </div>
    </div>
  );
}
