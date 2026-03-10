import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Success Stories | INET Maker",
  description: "Stories and projects from INET Maker graduates and the community.",
};

export default function SuccessStoriesPage() {
  return (
    <div className="px-6 py-16 md:py-24">
      <div className="mx-auto max-w-3xl">
        <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6">Success Stories</h1>
        <p className="text-lg text-slate-600 leading-relaxed">
          Stories and project highlights from our community will appear here. Check back soon or{" "}
          <a href="/contact" className="text-primary font-semibold hover:underline">get in touch</a> to share yours.
        </p>
      </div>
    </div>
  );
}
