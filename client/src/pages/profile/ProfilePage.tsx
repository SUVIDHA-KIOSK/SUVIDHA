import { useEffect, useState } from "react";
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
    ? new Date(user.tokenIssuedAt).toLocaleString()
    : issuedAt;
  const userTokenExpiresAt = user?.tokenExpiresAt
    ? new Date(user.tokenExpiresAt).toLocaleString()
    : expiresAt;

  return (
    <section className="space-y-5">
      <div className="glass-panel rounded-2xl p-5 sm:p-6">
        <p className="theme-pill">Citizen Profile</p>
        <h1 className="mt-3 text-3xl font-semibold text-white">
          Your Account Details
        </h1>
        <p className="mt-2 text-sm text-slate-300">
          Live data synced from the auth service profile endpoint.
        </p>
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

      <div className="grid gap-4 md:grid-cols-2 xl:gap-6">
        <div className="theme-card p-4 sm:p-5">
          <h2 className="mb-3 text-xs font-semibold uppercase tracking-widest text-slate-500">
            Identity Details
          </h2>
          <div className="space-y-2 text-sm text-slate-700 sm:text-[15px]">
            <p>
              <span className="font-semibold text-slate-900">Consumer ID:</span>{" "}
              {display(user?.consumerId)}
            </p>
            <p>
              <span className="font-semibold text-slate-900">Full Name:</span>{" "}
              {display(user?.fullName)}
            </p>
            <p>
              <span className="font-semibold text-slate-900">Mobile:</span>{" "}
              {display(user?.mobile)}
            </p>
            <p>
              <span className="font-semibold text-slate-900">Aadhar:</span>{" "}
              {display(user?.aadhar)}
            </p>
            <p>
              <span className="font-semibold text-slate-900">Email:</span>{" "}
              {display(user?.email)}
            </p>
            <p>
              <span className="font-semibold text-slate-900">
                Date of Birth:
              </span>{" "}
              {display(user?.dob)}
            </p>
            <p>
              <span className="font-semibold text-slate-900">Gender:</span>{" "}
              {display(user?.gender)}
            </p>
          </div>
        </div>

        <div className="theme-card p-4 sm:p-5">
          <h2 className="mb-3 text-xs font-semibold uppercase tracking-widest text-slate-500">
            Account Details
          </h2>
          <div className="space-y-2 text-sm text-slate-700 sm:text-[15px]">
            <p>
              <span className="font-semibold text-slate-900">KYC Status:</span>{" "}
              {display(user?.kycStatus)}
            </p>
            <p>
              <span className="font-semibold text-slate-900">
                Connection Type:
              </span>{" "}
              {display(user?.connectionType)}
            </p>
            <p>
              <span className="font-semibold text-slate-900">Active:</span>{" "}
              {display(user?.isActive)}
            </p>
            <p>
              <span className="font-semibold text-slate-900">
                Login Identifier Type:
              </span>{" "}
              {display(user?.identifierType)}
            </p>
            <p>
              <span className="font-semibold text-slate-900">
                Login Identifier Value:
              </span>{" "}
              {display(user?.identifierValue)}
            </p>
          </div>
        </div>

        <div className="theme-card p-4 md:col-span-2 sm:p-5">
          <h2 className="mb-3 text-xs font-semibold uppercase tracking-widest text-slate-500">
            Session Details
          </h2>
          <div className="space-y-2 text-sm text-slate-700 sm:text-[15px]">
            <p>
              <span className="font-semibold text-slate-900">
                Token Issued At:
              </span>{" "}
              {userTokenIssuedAt}
            </p>
            <p>
              <span className="font-semibold text-slate-900">
                Token Expires At:
              </span>{" "}
              {userTokenExpiresAt}
            </p>
            <p className="break-all">
              <span className="font-semibold text-slate-900">
                JWT Subject (sub):
              </span>{" "}
              {display(payload?.sub)}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
