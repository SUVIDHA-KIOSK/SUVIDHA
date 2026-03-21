import { type FormEvent, useState } from "react";
import { useNavigate } from "react-router-dom";
import { authApi } from "../../api/authApi";
import { ApiClientError } from "../../types/api";
import type { IdentifierType } from "../../types/user";
import { useAuthStore } from "../../stores/authStore";
import { useUserStore } from "../../stores/userStore";
import { parseJwtPayload } from "../../utils/jwt";

export default function LoginPage() {
  const navigate = useNavigate();
  const setToken = useAuthStore((state) => state.setToken);
  const setUser = useUserStore((state) => state.setUser);

  const [identifierType, setIdentifierType] = useState<IdentifierType>("M");
  const [identifierValue, setIdentifierValue] = useState("");
  const [otp, setOtp] = useState("");
  const [otpRequested, setOtpRequested] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleRequestOtp = async (event: FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setError("");

    try {
      const data = await authApi.requestOtp({
        identifierType,
        identifierValue,
      });
      setOtpRequested(true);
      setMessage(
        `OTP requested. Expires at ${new Date(data.otpExpiresAt).toLocaleTimeString()}`,
      );

      if (data.otp) {
        setOtp(data.otp);
      }
    } catch (err) {
      const requestError = err as ApiClientError;
      setError(requestError.message);
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (event: FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setError("");

    try {
      const data = await authApi.verifyOtp({
        identifierType,
        identifierValue,
        otp,
      });

      const payload = parseJwtPayload(data.accessToken);
      const issuedAt = payload?.iat
        ? new Date(payload.iat * 1000).toISOString()
        : undefined;

      setToken(data.accessToken);
      setUser({
        ...data.user,
        identifierType,
        identifierValue,
        tokenIssuedAt: issuedAt,
        tokenExpiresAt: data.expiresAt,
      });
      navigate("/profile");
    } catch (err) {
      const requestError = err as ApiClientError;
      setError(requestError.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="mx-auto grid max-w-5xl gap-6 lg:grid-cols-[1.1fr_1fr]">
      <aside className="glass-panel rounded-2xl p-6 sm:p-7">
        <p className="theme-pill">Citizen Access</p>
        <h1 className="mt-4 text-3xl font-semibold leading-tight text-white sm:text-4xl">
          Login to your
          <span className="block text-cyan-300">SUVIDHA account</span>
        </h1>
        <p className="mt-4 text-sm text-slate-300 sm:text-base">
          Verify your identity using mobile, aadhar, or consumer ID. OTP expires
          in 5 minutes and is secured via Redis session policy.
        </p>

        <div className="mt-6 grid gap-3 text-sm text-slate-200">
          <div className="rounded-xl border border-white/10 bg-white/5 p-3">
            1. Submit identifier
          </div>
          <div className="rounded-xl border border-white/10 bg-white/5 p-3">
            2. Receive OTP on registered email
          </div>
          <div className="rounded-xl border border-white/10 bg-white/5 p-3">
            3. Verify and continue securely
          </div>
        </div>
      </aside>

      <div className="theme-card p-5 sm:p-7">
        <h2 className="text-xl font-semibold text-slate-900">OTP Login</h2>
        <p className="mt-1 text-sm text-slate-500">
          Use M, A, or C based identifier.
        </p>

        <form onSubmit={handleRequestOtp} className="mt-5 space-y-4">
          <label className="block text-sm font-medium text-slate-700">
            Identifier Type
            <select
              value={identifierType}
              onChange={(event) =>
                setIdentifierType(event.target.value as IdentifierType)
              }
              className="theme-input mt-1"
            >
              <option value="M">M - Mobile</option>
              <option value="A">A - Aadhar</option>
              <option value="C">C - Consumer ID</option>
            </select>
          </label>

          <label className="block text-sm font-medium text-slate-700">
            Identifier Value
            <input
              value={identifierValue}
              onChange={(event) =>
                setIdentifierValue(event.target.value.trim())
              }
              placeholder="Enter your value"
              className="theme-input mt-1"
              required
            />
          </label>

          <button
            type="submit"
            disabled={loading}
            className="theme-btn-primary w-full px-4 py-2.5 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? "Requesting OTP..." : "Request OTP"}
          </button>
        </form>

        {otpRequested ? (
          <form
            onSubmit={handleVerifyOtp}
            className="mt-6 space-y-4 border-t border-slate-200 pt-5"
          >
            <label className="block text-sm font-medium text-slate-700">
              OTP
              <input
                value={otp}
                onChange={(event) => setOtp(event.target.value.trim())}
                placeholder="Enter 6-digit OTP"
                className="theme-input mt-1 tracking-[0.22em]"
                required
              />
            </label>

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl bg-emerald-500 px-4 py-2.5 font-semibold text-white transition hover:bg-emerald-600 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? "Verifying OTP..." : "Verify OTP"}
            </button>
          </form>
        ) : null}

        {message ? (
          <p className="mt-4 rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-700">
            {message}
          </p>
        ) : null}
        {error ? (
          <p className="mt-4 rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-700">
            {error}
          </p>
        ) : null}
      </div>
    </section>
  );
}
