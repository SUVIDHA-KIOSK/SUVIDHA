import { Link } from "react-router-dom";

export default function NotFoundPage() {
  return (
    <section className="mx-auto max-w-xl space-y-5 rounded-2xl border border-white/10 bg-white p-6 text-center shadow-xl shadow-slate-900/20 sm:p-9">
      <p className="text-xs font-semibold uppercase tracking-widest text-slate-500">
        Page Error
      </p>
      <h1 className="text-4xl font-semibold text-slate-900 sm:text-5xl">404</h1>
      <p className="text-slate-600">
        The page you requested is outside the civic route map.
      </p>
      <Link to="/" className="theme-btn-primary inline-block px-5 py-2.5">
        Back to Home
      </Link>
    </section>
  );
}
