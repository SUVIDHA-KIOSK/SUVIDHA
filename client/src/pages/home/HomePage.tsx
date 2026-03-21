export default function HomePage() {
  return (
    <section className="space-y-6">
      <div className="glass-panel rounded-2xl p-6 sm:p-8">
        <p className="theme-pill">Civic Digital Desk</p>
        <h1 className="mt-4 text-3xl font-semibold leading-tight text-white sm:text-5xl">
          One portal for utility identity and citizen profile access.
        </h1>
        <p className="mt-4 max-w-3xl text-sm text-slate-300 sm:text-base">
          Securely sign in with OTP, verify account metadata, and keep all
          service-linked identity information in one place.
        </p>

        <div className="mt-6 flex flex-wrap gap-3">
          <div className="rounded-full border border-cyan-300/35 bg-cyan-400/10 px-3 py-1 text-xs text-cyan-100">
            OTP Auth
          </div>
          <div className="rounded-full border border-emerald-300/35 bg-emerald-400/10 px-3 py-1 text-xs text-emerald-100">
            Profile Sync
          </div>
          <div className="rounded-full border border-amber-300/35 bg-amber-400/10 px-3 py-1 text-xs text-amber-100">
            Session Security
          </div>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <div className="theme-card p-5">
          <p className="text-xs font-semibold uppercase tracking-widest text-slate-500">
            Security
          </p>
          <h2 className="mt-2 text-lg font-semibold text-slate-900">
            OTP + JWT
          </h2>
          <p className="mt-2 text-sm text-slate-600">
            Secure login flow backed by Redis OTP lifecycle and token sessions.
          </p>
        </div>

        <div className="theme-card p-5">
          <p className="text-xs font-semibold uppercase tracking-widest text-slate-500">
            Profile
          </p>
          <h2 className="mt-2 text-lg font-semibold text-slate-900">
            Citizen Details
          </h2>
          <p className="mt-2 text-sm text-slate-600">
            View identity, account, and session details fetched from auth
            service.
          </p>
        </div>

        <div className="theme-card p-5 sm:col-span-2 lg:col-span-1">
          <p className="text-xs font-semibold uppercase tracking-widest text-slate-500">
            Architecture
          </p>
          <h2 className="mt-2 text-lg font-semibold text-slate-900">
            Modular Frontend
          </h2>
          <p className="mt-2 text-sm text-slate-600">
            Feature folders, Zustand stores, env-driven API layer, and
            responsive pages.
          </p>
        </div>
      </div>
    </section>
  );
}
