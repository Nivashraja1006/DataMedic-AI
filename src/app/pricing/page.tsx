import Link from "next/link";
import Navbar from "@/components/Navbar";
import PricingSection from "@/components/PricingSection";

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-[#020617] text-[#EDF0F8]">
      <Navbar />
      <main className="relative z-10">
        <div className="mx-auto max-w-7xl px-6 pt-14 md:px-10 md:pt-20">
          <Link href="/" className="text-sm text-slate-400 transition hover:text-white">← Back to home</Link>
        </div>
        <PricingSection />
      </main>
    </div>
  );
}
