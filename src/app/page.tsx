import Link from "next/link";
import Image from "next/image";
import { prisma } from "@/lib/prisma";

export default async function Home() {
  let openCalls: Awaited<ReturnType<typeof prisma.callForApplication.findMany>> = [];
  try {
    openCalls = await prisma.callForApplication.findMany({
      where: { published: true },
      orderBy: { updatedAt: "desc" },
    });
  } catch {
    // DB unreachable (e.g. pool timeout, Hostinger limit) — render page without open calls
  }

  return (
    <div className="relative flex min-h-screen w-full flex-col overflow-x-hidden">
      {/* Hero Section */}
      <section className="hero-gradient px-6 py-12 md:py-20">
        <div className="mx-auto max-w-7xl">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="flex flex-col gap-8">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 w-fit">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-accent"></span>
                </span>
                <span className="text-xs font-bold uppercase tracking-wider text-primary">Next cohort starts Sept 1st</span>
              </div>
              <h1 className="text-5xl md:text-7xl font-bold leading-tight tracking-tight text-slate-900">
                Design the <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">Future</span>
              </h1>
              <p className="text-lg text-slate-600 max-w-xl leading-relaxed">
                Join the digital fabrication and innovation training program. Master the tools of tomorrow and turn your boldest ideas into physical reality with our world-class maker space.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link
                  href="/apply/join"
                  className="px-8 py-4 bg-accent hover:brightness-110 text-slate-900 font-bold rounded-xl shadow-lg shadow-accent/20 transition-all flex items-center gap-2"
                >
                  Join INET Community <span className="material-symbols-outlined">arrow_forward</span>
                </Link>
                <Link
                  href="/programs"
                  className="px-8 py-4 border-2 border-primary/20 hover:border-primary/40 text-primary font-bold rounded-xl transition-all"
                >
                  Explore Courses
                </Link>
              </div>
              <p className="text-sm text-slate-500">
                Get an account, see all upcoming opportunities, and receive alerts by email and in the platform.
              </p>
            </div>
            <div className="relative group">
              <div className="absolute -inset-4 bg-gradient-to-tr from-primary/20 to-accent/20 rounded-3xl blur-2xl opacity-50 group-hover:opacity-75 transition-opacity"></div>
              <div className="relative aspect-square w-full rounded-3xl overflow-hidden shadow-2xl border border-white/50">
                <Image
                  alt="Maker Space Concept"
                  src="https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=800&q=80"
                  fill
                  className="object-cover w-full h-full transform transition-transform duration-700 group-hover:scale-105"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 bg-white/50 border-y border-slate-200/60">
        <div className="mx-auto max-w-7xl px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="flex flex-col items-center md:items-start p-6 rounded-2xl bg-primary/5 border border-primary/10">
              <span className="text-4xl font-bold text-primary mb-1">500+</span>
              <span className="text-sm font-semibold uppercase tracking-widest text-slate-500">Students Trained</span>
            </div>
            <div className="flex flex-col items-center md:items-start p-6 rounded-2xl bg-accent/5 border border-accent/10">
              <span className="text-4xl font-bold text-slate-900 mb-1">1.2k</span>
              <span className="text-sm font-semibold uppercase tracking-widest text-slate-500">Projects Built</span>
            </div>
            <div className="flex flex-col items-center md:items-start p-6 rounded-2xl bg-primary/5 border border-primary/10">
              <span className="text-4xl font-bold text-primary mb-1">45</span>
              <span className="text-sm font-semibold uppercase tracking-widest text-slate-500">Professional Courses</span>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Programs */}
      <section className="py-24 px-6">
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
            <div className="max-w-2xl">
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4 tracking-tight">Featured Programs</h2>
              <p className="text-slate-600">Specialize in cutting-edge technologies and gain hands-on experience with industry-standard fabrication tools.</p>
            </div>
            <Link href="/programs" className="text-primary font-bold flex items-center gap-1 hover:underline underline-offset-4">
              View All Programs <span className="material-symbols-outlined text-sm">open_in_new</span>
            </Link>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {/* Card 1 */}
            <div className="group bg-white rounded-2xl p-4 border border-slate-200 shadow-sm hover:shadow-xl hover:border-primary/20 transition-all">
              <div className="aspect-[4/3] rounded-xl overflow-hidden mb-6 relative">
                <Image alt="3D Prototyping" src="https://images.unsplash.com/photo-1612815154858-60aa4c59eaa6?w=600&q=80" fill className="object-cover transition-transform group-hover:scale-110 duration-500" sizes="(max-width: 768px) 100vw, 33vw" />
              </div>
              <div className="px-2 pb-2">
                <div className="flex items-center gap-2 mb-3">
                  <span className="bg-primary/10 text-primary text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded">Hardware</span>
                  <span className="bg-slate-100 text-slate-500 text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded">8 Weeks</span>
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2 group-hover:text-primary transition-colors">3D Prototyping</h3>
                <p className="text-slate-500 text-sm leading-relaxed mb-6">
                  Master additive manufacturing, surface finishing, and CAD optimization for rapid physical prototyping.
                </p>
                <Link href="/programs#3d-prototyping" className="block w-full py-3 bg-slate-50 group-hover:bg-primary group-hover:text-white font-bold rounded-lg text-slate-700 text-center transition-colors">
                  Learn More
                </Link>
              </div>
            </div>
            {/* Card 2 */}
            <div className="group bg-white rounded-2xl p-4 border border-slate-200 shadow-sm hover:shadow-xl hover:border-primary/20 transition-all">
              <div className="aspect-[4/3] rounded-xl overflow-hidden mb-6 relative">
                <Image alt="IoT Innovation" src="https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=80" fill className="object-cover transition-transform group-hover:scale-110 duration-500" sizes="(max-width: 768px) 100vw, 33vw" />
              </div>
              <div className="px-2 pb-2">
                <div className="flex items-center gap-2 mb-3">
                  <span className="bg-primary/10 text-primary text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded">Smart Tech</span>
                  <span className="bg-slate-100 text-slate-500 text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded">12 Weeks</span>
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2 group-hover:text-primary transition-colors">IoT Innovation</h3>
                <p className="text-slate-500 text-sm leading-relaxed mb-6">
                  Build smart connected devices, integrate cloud services, and create custom sensor networks from scratch.
                </p>
                <Link href="/programs#iot" className="block w-full py-3 bg-slate-50 group-hover:bg-primary group-hover:text-white font-bold rounded-lg text-slate-700 text-center transition-colors">
                  Learn More
                </Link>
              </div>
            </div>
            {/* Card 3 */}
            <div className="group bg-white rounded-2xl p-4 border border-slate-200 shadow-sm hover:shadow-xl hover:border-primary/20 transition-all">
              <div className="aspect-[4/3] rounded-xl overflow-hidden mb-6 relative">
                <Image alt="Digital Fabrication" src="https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?w=600&q=80" fill className="object-cover transition-transform group-hover:scale-110 duration-500" sizes="(max-width: 768px) 100vw, 33vw" />
              </div>
              <div className="px-2 pb-2">
                <div className="flex items-center gap-2 mb-3">
                  <span className="bg-primary/10 text-primary text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded">Manufacturing</span>
                  <span className="bg-slate-100 text-slate-500 text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded">10 Weeks</span>
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2 group-hover:text-primary transition-colors">Digital Fabrication</h3>
                <p className="text-slate-500 text-sm leading-relaxed mb-6">
                  Comprehensive training on laser cutting, CNC milling, and precision waterjet operations.
                </p>
                <Link href="/programs#digital-fabrication" className="block w-full py-3 bg-slate-50 group-hover:bg-primary group-hover:text-white font-bold rounded-lg text-slate-700 text-center transition-colors">
                  Learn More
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Join INET Community — always visible, primary CTA */}
      <section className="py-20 px-6 bg-gradient-to-b from-primary/5 to-white border-y border-slate-200/60">
        <div className="mx-auto max-w-7xl">
          <div className="max-w-3xl mx-auto text-center mb-10">
            <span className="inline-block text-xs font-bold uppercase tracking-wider text-primary mb-4">Become a member</span>
            <h2 className="text-3xl md:text-5xl font-bold text-slate-900 mb-4 tracking-tight">Join the INET Community</h2>
            <p className="text-lg text-slate-600 mb-8">
              This is for everyone who wants to be part of our community. Create your profile once and get access to all upcoming opportunities, courses, and calls. We’ll alert you by email and in the platform so you never miss a chance to apply.
            </p>
            <Link
              href="/apply/join"
              className="inline-flex items-center gap-2 px-10 py-4 bg-primary hover:bg-primary/90 text-white font-bold rounded-xl shadow-xl shadow-primary/20 transition-all"
            >
              Join INET Community <span className="material-symbols-outlined">arrow_forward</span>
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            <div className="rounded-2xl border border-slate-200 bg-white p-6 text-center">
              <span className="material-symbols-outlined text-4xl text-primary mb-3">visibility</span>
              <h3 className="font-bold text-slate-900 mb-1">See all opportunities</h3>
              <p className="text-sm text-slate-600">Browse courses, calls, and programs in one place.</p>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-white p-6 text-center">
              <span className="material-symbols-outlined text-4xl text-primary mb-3">notifications</span>
              <h3 className="font-bold text-slate-900 mb-1">Get alerted</h3>
              <p className="text-sm text-slate-600">Email and in-app alerts when new opportunities open.</p>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-white p-6 text-center">
              <span className="material-symbols-outlined text-4xl text-primary mb-3">badge</span>
              <h3 className="font-bold text-slate-900 mb-1">One profile</h3>
              <p className="text-sm text-slate-600">Single signup for the whole community and all programs.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Open calls for application (course-specific opportunities) */}
      {openCalls.filter((c) => c.slug !== "join").length > 0 && (
        <section className="py-24 px-6 bg-slate-50 border-y border-slate-200">
          <div className="mx-auto max-w-7xl">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4 tracking-tight">Open calls for application</h2>
            <p className="text-slate-600 mb-10 max-w-2xl">
              Current opportunities for courses and programs. Join the community first to get alerted when new calls open.
            </p>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {openCalls.filter((c) => c.slug !== "join").map((call) => (
                <Link
                  key={call.id}
                  href={`/apply/${call.id}`}
                  className="group block rounded-2xl border border-slate-200 bg-white overflow-hidden shadow-sm hover:shadow-lg hover:border-primary/20 transition-all"
                >
                  <div className="aspect-[4/3] bg-gradient-to-br from-primary/10 to-accent/10 flex items-center justify-center overflow-hidden">
                    {call.imageUrl ? (
                      /* eslint-disable-next-line @next/next/no-img-element */
                      <img
                        src={call.imageUrl}
                        alt={call.title}
                        className="object-cover w-full h-full group-hover:scale-105 transition-transform"
                      />
                    ) : (
                      <span className="material-symbols-outlined text-5xl text-primary/40">campaign</span>
                    )}
                  </div>
                  <div className="p-5">
                    <span className="inline-block text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded bg-primary/10 text-primary mb-2">
                      {call.type}
                    </span>
                    <h3 className="text-lg font-bold text-slate-900 mb-1 line-clamp-2 group-hover:text-primary transition-colors">
                      {call.title}
                    </h3>
                    {call.summary && (
                      <p className="text-sm text-slate-600 line-clamp-2 mb-3">{call.summary}</p>
                    )}
                    {call.deadline && (
                      <p className="text-xs text-slate-500 mb-3">
                        Deadline: {new Date(call.deadline).toLocaleDateString()}
                      </p>
                    )}
                    <span className="inline-flex items-center gap-1 text-sm font-semibold text-primary">
                      Apply <span className="material-symbols-outlined text-lg">arrow_forward</span>
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Bottom CTA — Join community */}
      <section className="mx-auto max-w-7xl px-6 pb-24">
        <div className="relative overflow-hidden bg-background-dark rounded-3xl px-8 py-16 md:px-16 text-center">
          <div className="absolute inset-0 opacity-20">
            <div className="absolute top-0 right-0 w-96 h-96 bg-primary rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2"></div>
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-accent rounded-full blur-[100px] translate-y-1/2 -translate-x-1/2"></div>
          </div>
          <div className="relative z-10 flex flex-col items-center gap-6">
            <h2 className="text-3xl md:text-5xl font-bold text-white tracking-tight">Be part of the community</h2>
            <p className="text-slate-400 max-w-xl text-lg">
              Join INET Community to get an account, see all upcoming opportunities, and receive alerts by email and in the system.
            </p>
            <Link
              href="/apply/join"
              className="mt-4 px-10 py-4 bg-primary hover:bg-primary/90 text-white font-bold rounded-xl shadow-xl shadow-primary/20 transition-all"
            >
              Join INET Community
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
