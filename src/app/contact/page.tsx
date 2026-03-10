import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact | INET Maker",
  description: "Get in touch with INET Maker for programs, applications, and partnerships.",
};

export default function ContactPage() {
  return (
    <div className="px-6 py-16 md:py-24">
      <div className="mx-auto max-w-2xl">
        <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6">Contact</h1>
        <p className="text-slate-600 mb-8">
          Have questions about our programs or the application process? Reach out and we’ll get back to you.
        </p>
        <div className="space-y-4 text-slate-600">
          <p><strong className="text-slate-900">Email:</strong>{" "}
            <a href="mailto:hello@inetmaker.example" className="text-primary hover:underline">hello@inetmaker.example</a>
          </p>
          <p><strong className="text-slate-900">Applications:</strong>{" "}
            <a href="mailto:apply@inetmaker.example" className="text-primary hover:underline">apply@inetmaker.example</a>
          </p>
        </div>
      </div>
    </div>
  );
}
