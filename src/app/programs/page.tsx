import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Programs | INET Maker",
  description: "Explore INET Maker programs: 3D Prototyping, IoT Innovation, Digital Fabrication, and more.",
};

export default function ProgramsPage() {
  return (
    <div className="px-6 py-16 md:py-24">
      <div className="mx-auto max-w-5xl">
        <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">Programs</h1>
        <p className="text-lg text-slate-600 mb-12 max-w-2xl">
          Specialize in cutting-edge technologies and gain hands-on experience with industry-standard fabrication tools.
        </p>
        <div className="grid md:grid-cols-2 gap-8">
          <div className="p-6 rounded-2xl border border-slate-200 bg-white">
            <h2 id="3d-prototyping" className="text-xl font-bold text-slate-900 mb-2">3D Prototyping</h2>
            <p className="text-slate-600 text-sm mb-4">8 weeks · Hardware</p>
            <p className="text-slate-500 mb-4">
              Master additive manufacturing, surface finishing, and CAD optimization for rapid physical prototyping.
            </p>
            <Link href="/apply" className="text-primary font-semibold hover:underline">Apply →</Link>
          </div>
          <div className="p-6 rounded-2xl border border-slate-200 bg-white">
            <h2 id="iot" className="text-xl font-bold text-slate-900 mb-2">IoT Innovation</h2>
            <p className="text-slate-600 text-sm mb-4">12 weeks · Smart Tech</p>
            <p className="text-slate-500 mb-4">
              Build smart connected devices, integrate cloud services, and create custom sensor networks from scratch.
            </p>
            <Link href="/apply" className="text-primary font-semibold hover:underline">Apply →</Link>
          </div>
          <div className="p-6 rounded-2xl border border-slate-200 bg-white">
            <h2 id="digital-fabrication" className="text-xl font-bold text-slate-900 mb-2">Digital Fabrication</h2>
            <p className="text-slate-600 text-sm mb-4">10 weeks · Manufacturing</p>
            <p className="text-slate-500 mb-4">
              Comprehensive training on laser cutting, CNC milling, and precision waterjet operations.
            </p>
            <Link href="/apply" className="text-primary font-semibold hover:underline">Apply →</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
