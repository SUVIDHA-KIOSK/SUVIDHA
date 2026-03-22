import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Navigate } from "react-router-dom";
import { authApi } from "../../api/authApi";
import { useAuthStore } from "../../stores/authStore";
import { useUserStore } from "../../stores/userStore";
import { ApiClientError } from "../../types/api";
import { parseJwtPayload } from "../../utils/jwt";

function display(value: unknown): string {
  if (value === null || value === undefined || value === "") {
    return "Not available";
  }

  if (typeof value === "boolean") {
    return value ? "Yes" : "No";
  }

  return String(value);
}

function formatDateTime(value: string | undefined, fallback: string): string {
  if (!value) {
    return fallback;
  }

  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) {
    return fallback;
  }

  return parsed.toLocaleString();
}

function labelTone(value: string | undefined): string {
  if (!value) {
    return "bg-slate-100 text-slate-700";
  }

  if (value === "VERIFIED" || value === "DOMESTIC") {
    return "bg-emerald-100 text-emerald-700";
  }

  if (value === "PENDING") {
    return "bg-amber-100 text-amber-700";
  }

  if (value === "REJECTED") {
    return "bg-rose-100 text-rose-700";
  }

  return "bg-cyan-100 text-cyan-700";
}

function profileCompletionScore(values: Array<unknown>): number {
  const completed = values.filter(
    (value) => value !== null && value !== undefined && value !== "",
  ).length;
  return Math.round((completed / values.length) * 100);
}

function FieldRow({
  label,
  value,
  mono,
}: {
  label: string;
  value: string;
  mono?: boolean;
}) {
  return (
    <div className="grid gap-1 border-b border-slate-100 py-3 last:border-b-0 sm:grid-cols-[180px_1fr] sm:items-center sm:gap-2">
      <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
        {label}
      </p>
      <p className={`text-sm text-slate-800 ${mono ? "font-mono break-all" : ""}`}>
        {value}
      </p>
    </div>
  );
}

export default function ProfilePage() {
  const logout = useAuthStore((state) => state.logout);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const token = useAuthStore((state) => state.token);
  const user = useUserStore((state) => state.user);
  const setUser = useUserStore((state) => state.setUser);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  if (!isAuthenticated || !token) {
    return <Navigate to="/login" replace />;
  }

  useEffect(() => {
    let ignore = false;

    if (!token) {
      return;
    }

    async function loadProfile() {
      setLoading(true);
      setError("");

      try {
        const profile = await authApi.getProfile(token!);
        if (ignore) return;

        setUser({
          ...user,
          ...profile,
          tokenExpiresAt: profile.tokenExpiresAt,
        });
      } catch (err) {
        if (ignore) return;

        const apiError = err as ApiClientError;
        setError(apiError.message);

        if (apiError.status === 401) {
          logout();
        }
      } finally {
        if (!ignore) {
          setLoading(false);
        }
      }
    }

    loadProfile();

    return () => {
      ignore = true;
    };
  }, [logout, setUser, token]);

  const payload = parseJwtPayload(token);
  const expiresAt = payload?.exp
    ? new Date(payload.exp * 1000).toLocaleString()
    : "Not available";
  const issuedAt = payload?.iat
    ? new Date(payload.iat * 1000).toLocaleString()
    : "Not available";
  const userTokenIssuedAt = user?.tokenIssuedAt
    ? formatDateTime(user.tokenIssuedAt, issuedAt)
    : issuedAt;
  const userTokenExpiresAt = user?.tokenExpiresAt
    ? formatDateTime(user.tokenExpiresAt, expiresAt)
    : expiresAt;

  const initials = (user?.fullName || "SUVIDHA User")
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((item) => item[0]?.toUpperCase())
    .join("");

  const completion = profileCompletionScore([
    user?.consumerId,
    user?.fullName,
    user?.mobile,
    user?.aadhar,
    user?.email,
    user?.dob,
    user?.gender,
    user?.kycStatus,
    user?.connectionType,
  ]);

  return (
    <section className="space-y-5">
      <div className="glass-panel overflow-hidden rounded-2xl p-5 sm:p-6">
        <div className="grid gap-5 md:grid-cols-[auto_1fr_auto] md:items-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-cyan-300/20 text-xl font-semibold text-cyan-100 ring-1 ring-cyan-200/30">
            {initials || "SU"}
          </div>

          <div>
            <p className="theme-pill">Citizen Profile</p>
            <h1 className="mt-3 text-3xl font-semibold text-white">
              {display(user?.fullName)}
            </h1>
            <p className="mt-2 text-sm text-slate-300">
              Profile synced from the auth service with live session details.
            </p>
          </div>

          <div className="flex flex-wrap gap-2 md:justify-end">
            <span
              className={`rounded-full px-3 py-1 text-xs font-semibold ${labelTone(
                user?.kycStatus,
              )}`}
            >
              KYC: {display(user?.kycStatus)}
            </span>
            <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-semibold text-slate-100">
              Profile: {completion}%
            </span>
          </div>
        </div>

        <div className="mt-5 grid gap-3 sm:grid-cols-3">
          <div className="rounded-xl border border-white/15 bg-white/5 p-3">
            <p className="text-xs uppercase tracking-wide text-slate-400">Consumer</p>
            <p className="mt-1 text-sm font-semibold text-white">
              {display(user?.consumerId)}
            </p>
          </div>
          <div className="rounded-xl border border-white/15 bg-white/5 p-3">
            <p className="text-xs uppercase tracking-wide text-slate-400">Connection</p>
            <p className="mt-1 text-sm font-semibold text-white">
              {display(user?.connectionType)}
            </p>
          </div>
          <div className="rounded-xl border border-white/15 bg-white/5 p-3">
            <p className="text-xs uppercase tracking-wide text-slate-400">Status</p>
            <p className="mt-1 text-sm font-semibold text-white">
              {display(user?.isActive ? "Active" : "Inactive")}
            </p>
          </div>
        </div>
      </div>

      {loading ? (
        <p className="rounded-xl border border-cyan-200/20 bg-cyan-100/10 px-4 py-2 text-sm text-cyan-100">
          Loading profile...
        </p>
      ) : null}
      {error ? (
        <p className="rounded-xl border border-rose-200/30 bg-rose-100/10 px-4 py-2 text-sm text-rose-200">
          {error}
        </p>
      ) : null}

      <div className="grid gap-4 xl:grid-cols-[1.2fr_1fr] xl:gap-6">
        <div className="space-y-4">
          <div className="theme-card p-4 sm:p-5">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-500">
              Identity Details
            </h2>
            <div className="mt-2">
              <FieldRow label="Consumer ID" value={display(user?.consumerId)} />
              <FieldRow label="Full Name" value={display(user?.fullName)} />
              <FieldRow label="Mobile" value={display(user?.mobile)} />
              <FieldRow label="Aadhar" value={display(user?.aadhar)} mono />
              <FieldRow label="Email" value={display(user?.email)} />
              <FieldRow label="Date of Birth" value={display(user?.dob)} />
              <FieldRow label="Gender" value={display(user?.gender)} />
            </div>
          </div>

          <div className="theme-card p-4 sm:p-5">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-500">
              Account Details
            </h2>
            <div className="mt-2">
              <FieldRow label="KYC Status" value={display(user?.kycStatus)} />
              <FieldRow
                label="Connection Type"
                value={display(user?.connectionType)}
              />
              <FieldRow
                label="Account Active"
                value={display(user?.isActive ? "Yes" : "No")}
              />
              <FieldRow
                label="Login Identifier Type"
                value={display(user?.identifierType)}
              />
              <FieldRow
                label="Login Identifier Value"
                value={display(user?.identifierValue)}
                mono
              />
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="theme-card p-4 sm:p-5">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-500">
              Session & Security
            </h2>
            <div className="mt-2">
              <FieldRow label="Token Issued At" value={userTokenIssuedAt} />
              <FieldRow label="Token Expires At" value={userTokenExpiresAt} />
              <FieldRow label="JWT Subject" value={display(payload?.sub)} mono />
            </div>
          </div>

          <div className="theme-card p-4 sm:p-5">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-500">
              Quick Actions
            </h2>
            <div className="mt-3 grid gap-3">
              <Link
                to="/"
                className="rounded-xl bg-slate-900 px-4 py-2.5 text-center text-sm font-semibold text-white transition hover:bg-slate-800"
              >
                Go to Home
              </Link>
              <button
                type="button"
                onClick={() => window.location.reload()}
                className="rounded-xl border border-slate-300 px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
              >
                Refresh Profile
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
