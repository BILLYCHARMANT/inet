import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-white border-t border-slate-200 py-12 px-6">
      <div className="mx-auto max-w-7xl grid grid-cols-2 md:grid-cols-4 gap-12">
        <div className="col-span-2">
          <div className="flex items-center gap-2 mb-6">
            <div className="bg-primary p-1.5 rounded-lg">
              <span className="material-symbols-outlined text-white text-xl">deployed_code</span>
            </div>
            <span className="text-xl font-bold tracking-tight text-slate-900">
              INET <span className="text-primary">MAKER</span>
            </span>
          </div>
          <p className="text-slate-500 max-w-sm leading-relaxed">
            Empowering innovators through digital fabrication, smart hardware design, and hands-on technical excellence since 2018.
          </p>
        </div>
        <div>
          <h4 className="font-bold text-slate-900 mb-6">Programs</h4>
          <ul className="space-y-4 text-slate-500 text-sm">
            <li><Link className="hover:text-primary" href="/programs">All Courses</Link></li>
            <li><Link className="hover:text-primary" href="/programs#certifications">Certifications</Link></li>
            <li><Link className="hover:text-primary" href="/programs#residency">Maker Residency</Link></li>
            <li><Link className="hover:text-primary" href="/programs#corporate">Corporate Training</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="font-bold text-slate-900 mb-6">Connect</h4>
          <ul className="space-y-4 text-slate-500 text-sm">
            <li><a className="hover:text-primary" href="#">Twitter</a></li>
            <li><a className="hover:text-primary" href="#">Instagram</a></li>
            <li><a className="hover:text-primary" href="#">LinkedIn</a></li>
            <li><a className="hover:text-primary" href="#">Discord</a></li>
          </ul>
        </div>
      </div>
      <div className="mx-auto max-w-7xl mt-16 pt-8 border-t border-slate-100 flex flex-col md:flex-row justify-between gap-4 text-slate-400 text-xs font-medium uppercase tracking-widest">
        <p>© {new Date().getFullYear()} INET Maker Hub. All rights reserved.</p>
        <div className="flex gap-8">
          <Link className="hover:text-primary" href="#">Privacy Policy</Link>
          <Link className="hover:text-primary" href="#">Terms of Service</Link>
        </div>
      </div>
    </footer>
  );
}
