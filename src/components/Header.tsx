import Link from "next/link";
import AuthNav from "./AuthNav";

export default function Header() {
  return (
    <header className="fixed top-0 z-50 w-full px-6 py-4">
      <nav className="mx-auto max-w-7xl glass-header border border-white/20 rounded-2xl px-6 py-3 flex items-center justify-between shadow-lg shadow-primary/5">
        <Link href="/" className="flex items-center gap-2 group cursor-pointer">
          <div className="bg-primary p-1.5 rounded-lg rotate-3 group-hover:rotate-0 transition-transform">
            <span className="material-symbols-outlined text-white text-2xl">deployed_code</span>
          </div>
          <span className="text-xl font-bold tracking-tight text-slate-900">
            INET <span className="text-primary">MAKER</span>
          </span>
        </Link>
        <div className="hidden md:flex items-center gap-8">
          <Link className="text-sm font-semibold hover:text-primary transition-colors" href="/programs">Programs</Link>
          <Link className="text-sm font-semibold hover:text-primary transition-colors" href="/about">About</Link>
          <Link className="text-sm font-semibold hover:text-primary transition-colors" href="/success-stories">Success Stories</Link>
          <Link className="text-sm font-semibold hover:text-primary transition-colors" href="/e-learning">E-Learning</Link>
          <Link className="text-sm font-semibold hover:text-primary transition-colors" href="/contact">Contact</Link>
        </div>
        <div className="flex items-center gap-3">
          <AuthNav />
        </div>
      </nav>
    </header>
  );
}
