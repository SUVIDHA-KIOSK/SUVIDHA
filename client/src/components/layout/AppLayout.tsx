import { Link, Outlet } from "react-router-dom";
import { useAuthStore } from "../../stores/authStore";
import { useUserStore } from "../../stores/userStore";

export default function AppLayout() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const logout = useAuthStore((state) => state.logout);
  const user = useUserStore((state) => state.user);
  const clearUser = useUserStore((state) => state.clearUser);

  const handleLogout = () => {
    logout();
    clearUser();
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-slate-950 text-slate-100">
      <div className="pointer-events-none absolute inset-0 opacity-70">
        <div className="absolute -left-24 -top-24 h-72 w-72 rounded-full bg-cyan-500/30 blur-3xl" />
        <div className="absolute right-0 top-1/4 h-80 w-80 rounded-full bg-amber-500/25 blur-3xl" />
        <div className="absolute bottom-0 left-1/3 h-80 w-80 rounded-full bg-emerald-500/25 blur-3xl" />
      </div>

      <header className="relative border-b border-white/10 bg-slate-950/65 backdrop-blur">
        <nav className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-4 py-3 sm:px-6 lg:py-4">
          <div className="flex items-center gap-3 sm:gap-4">
            <Link
              to="/"
              className="rounded-lg border border-cyan-300/30 bg-cyan-300/10 px-2.5 py-1.5 text-sm font-semibold tracking-wide text-cyan-100 sm:text-base"
            >
              SUVIDHA
            </Link>
            <div className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 p-1">
              <Link
                to="/"
                className="rounded-full px-3 py-1 text-xs text-slate-200 transition hover:bg-white/10 sm:text-sm"
              >
                Home
              </Link>
              <Link
                to="/profile"
                className="rounded-full px-3 py-1 text-xs text-slate-200 transition hover:bg-white/10 sm:text-sm"
              >
                Profile
              </Link>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {isAuthenticated ? (
              <>
                <span className="max-w-28 truncate rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-xs text-slate-200 sm:max-w-none sm:text-sm">
                  {user?.fullName || "Logged in"}
                </span>
                <button
                  type="button"
                  onClick={handleLogout}
                  className="rounded-lg bg-rose-500/90 px-3 py-1.5 text-sm font-medium text-white transition hover:bg-rose-400"
                >
                  Logout
                </button>
              </>
            ) : (
              <Link
                to="/login"
                className="rounded-lg bg-cyan-500 px-3 py-1.5 text-sm font-semibold text-slate-950 transition hover:bg-cyan-400"
              >
                Login
              </Link>
            )}
          </div>
        </nav>
      </header>

      <main className="relative mx-auto w-full max-w-6xl px-4 py-7 sm:px-6 sm:py-9">
        <Outlet />
      </main>

      <footer className="relative mx-auto w-full max-w-6xl px-4 pb-6 text-center text-xs text-slate-400 sm:px-6">
        SUVIDHA civic access portal
      </footer>
    </div>
  );
}
