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
    <header className="sticky top-0 z-50 border-b border-slate-200/80 bg-white/70 backdrop-blur-2xl">
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
              className="relative text-[13px] font-medium text-slate-600 transition duration-200 hover:text-slate-900"
            >
              <span className="after:absolute after:-bottom-1 after:left-0 after:h-px after:w-full after:origin-left after:scale-x-0 after:bg-gradient-to-r after:from-[#14b8a6] after:to-[#3b82f6] after:transition-transform after:duration-300 hover:after:scale-x-100">
                {item.label}
              </span>
            </Link>
          ))}
        </div>

        <div className="hidden items-center gap-3 md:flex">
          <Link
            href="/login"
            className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-[13px] font-medium text-slate-700 transition duration-200 hover:border-slate-300 hover:text-slate-900"
          >
            Login
          </Link>
          <Link
            href="/dashboard"
            className="rounded-xl bg-gradient-to-r from-[#14b8a6] to-[#3b82f6] px-4 py-2 text-[13px] font-medium text-white shadow-[0_12px_24px_rgba(20,184,166,0.18)] transition duration-200 hover:-translate-y-0.5"
          >
            Sign Up
          </Link>
        </div>
      </nav>
    </header>
  );
}
