import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About | INET Maker",
  description: "Learn about INET Maker — digital fabrication, innovation, and hands-on technical excellence.",
};

export default function AboutPage() {
  return (
    <div className="px-6 py-16 md:py-24">
      <div className="mx-auto max-w-3xl">
        <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6">About INET Maker</h1>
        <p className="text-lg text-slate-600 leading-relaxed mb-6">
          INET Maker empowers innovators through digital fabrication, smart hardware design, and hands-on technical excellence. Since 2018 we have trained hundreds of makers and supported over a thousand projects.
        </p>
        <p className="text-slate-600 leading-relaxed">
          Our programs combine 3D prototyping, IoT innovation, and digital manufacturing with access to a world-class maker space. Whether you are starting out or leveling up, we provide the tools and community to turn ideas into reality.
        </p>
      </div>
    </div>
  );
}
