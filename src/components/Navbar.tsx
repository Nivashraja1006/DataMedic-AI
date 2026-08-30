import Link from "next/link";
import Image from "next/image";

const navItems = [
  { label: "Home", href: "#home" },
  { label: "Features", href: "#features" },
  { label: "How It Works", href: "#how-it-works" },
  { label: "Pricing", href: "#pricing" },
  { label: "Contact", href: "#contact" },
];

export default function Navbar() {
  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-[#020617]/70 backdrop-blur-2xl">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 md:px-10">
        <Link
          href="/"
          className="group flex items-center gap-2 self-center transition duration-200 hover:opacity-100"
          aria-label="Go to DataMedic AI home"
        >
          <div className="flex items-center justify-center overflow-hidden rounded-none bg-transparent p-0">
            <Image
              src="/logo-main.svg"
              alt="DataMedic AI logo"
              width={220}
              height={52}
              priority
              className="h-[42px] w-auto object-contain bg-transparent transition-all duration-200 group-hover:scale-105 md:h-[46px]"
              style={{ background: "transparent" }}
            />
          </div>
        </Link>

        <div className="hidden items-center gap-8 md:flex">
          {navItems.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className="relative text-[13px] font-medium text-slate-300 transition duration-200 hover:text-white"
            >
              <span className="after:absolute after:-bottom-1 after:left-0 after:h-px after:w-full after:origin-left after:scale-x-0 after:bg-gradient-to-r after:from-[#7b91ff] after:to-[#6ee7d9] after:transition-transform after:duration-300 hover:after:scale-x-100">
                {item.label}
              </span>
            </Link>
          ))}
        </div>

        <div className="hidden items-center gap-3 md:flex">
          <Link
            href="/login"
            className="rounded-xl border border-white/10 bg-white/[0.02] px-4 py-2 text-[13px] font-medium text-slate-200 transition duration-200 hover:border-white/20 hover:text-white"
          >
            Login
          </Link>
          <Link
            href="/dashboard"
            className="rounded-xl bg-gradient-to-r from-[#6ee7d9] via-[#7b91ff] to-[#9a6bff] px-4 py-2 text-[13px] font-medium text-white shadow-[0_18px_35px_rgba(123,145,255,0.25)] transition duration-200 hover:-translate-y-0.5"
          >
            Sign Up
          </Link>
        </div>
      </nav>
    </header>
  );
}
