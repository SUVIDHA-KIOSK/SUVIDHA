import { type FormEvent, useState } from "react";
import { useNavigate } from "react-router-dom";
import { authApi } from "../../api/authApi";
import { ApiClientError } from "../../types/api";
import type { IdentifierType } from "../../types/user";
import { useAuthStore } from "../../stores/authStore";
import { useUserStore } from "../../stores/userStore";
import { parseJwtPayload } from "../../utils/jwt";

type IdentifierMeta = {
  title: string;
  subtitle: string;
  placeholder: string;
  helper: string;
  maxLength: number;
  inputMode: "text" | "numeric";
};

const identifierMetaMap: Record<IdentifierType, IdentifierMeta> = {
  M: {
    title: "Mobile Number",
    subtitle: "Login with your registered mobile.",
    placeholder: "Enter 10-digit mobile number",
    helper: "Only digits are allowed.",
    maxLength: 10,
    inputMode: "numeric",
  },
  A: {
    title: "Aadhar Number",
    subtitle: "Use your linked 12-digit Aadhar.",
    placeholder: "Enter 12-digit Aadhar number",
    helper: "Only digits are allowed.",
    maxLength: 12,
    inputMode: "numeric",
  },
  C: {
    title: "Consumer ID",
    subtitle: "Use your SUVIDHA consumer identifier.",
    placeholder: "Enter Consumer ID (e.g. CON1001)",
    helper: "Use letters, numbers, hyphen, or underscore.",
    maxLength: 24,
    inputMode: "text",
  },
};

const sanitizeIdentifierValue = (
  type: IdentifierType,
  value: string,
): string => {
  if (type === "M" || type === "A") {
    return value.replace(/\D/g, "");
  }
  return value.replace(/\s+/g, "").toUpperCase();
};

const validateIdentifierValue = (
  type: IdentifierType,
  value: string,
): string | null => {
  if (type === "M" && !/^\d{10}$/.test(value)) {
    return "Mobile number must be exactly 10 digits.";
  }
  if (type === "A" && !/^\d{12}$/.test(value)) {
    return "Aadhar number must be exactly 12 digits.";
  }
  if (type === "C" && !/^[A-Z0-9_-]{4,24}$/.test(value)) {
    return "Consumer ID must be 4-24 characters and use only letters, numbers, hyphen, or underscore.";
  }
  return null;
};

const sanitizeOtp = (value: string): string => value.replace(/\D/g, "").slice(0, 6);

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
    const cleanedIdentifierValue = sanitizeIdentifierValue(
      identifierType,
      identifierValue,
    ).slice(0, identifierMetaMap[identifierType].maxLength);
    const validationError = validateIdentifierValue(
      identifierType,
      cleanedIdentifierValue,
    );

    setIdentifierValue(cleanedIdentifierValue);
    setMessage("");
    setError("");
    if (validationError) {
      setError(validationError);
      return;
    }

    setLoading(true);

    try {
      const data = await authApi.requestOtp({
        identifierType,
        identifierValue: cleanedIdentifierValue,
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
    const cleanedOtp = sanitizeOtp(otp);
    setOtp(cleanedOtp);
    setMessage("");
    setError("");
    if (!/^\d{6}$/.test(cleanedOtp)) {
      setError("OTP must be exactly 6 digits.");
      return;
    }

    setLoading(true);

    try {
      const data = await authApi.verifyOtp({
        identifierType,
        identifierValue,
        otp: cleanedOtp,
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
    <section className="mx-auto grid max-w-6xl gap-6 lg:grid-cols-[1.15fr_1fr]">
      <aside className="glass-panel relative overflow-hidden rounded-2xl p-6 sm:p-8">
        <div className="pointer-events-none absolute -right-20 -top-20 h-56 w-56 rounded-full bg-cyan-400/20 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-24 -left-20 h-64 w-64 rounded-full bg-amber-300/15 blur-3xl" />

        <p className="theme-pill">Trusted Citizen Access</p>
        <h1 className="mt-4 text-3xl font-semibold leading-tight text-white sm:text-4xl">
          Welcome back to
          <span className="block text-cyan-300">SUVIDHA Services</span>
        </h1>
        <p className="mt-4 max-w-xl text-sm text-slate-300 sm:text-base">
          Secure OTP authentication for utility and civic services. Pick your
          preferred identifier, request a one-time password, and continue to your
          profile in under a minute.
        </p>

        <div className="mt-7 grid gap-3 text-sm text-slate-200">
          <div className="rounded-xl border border-white/10 bg-white/5 p-3">
            <p className="font-semibold text-white">Step 1</p>
            <p className="mt-1 text-slate-300">Select identifier type and submit your details.</p>
          </div>
          <div className="rounded-xl border border-white/10 bg-white/5 p-3">
            <p className="font-semibold text-white">Step 2</p>
            <p className="mt-1 text-slate-300">Receive a 6-digit OTP on your registered contact.</p>
          </div>
          <div className="rounded-xl border border-white/10 bg-white/5 p-3">
            <p className="font-semibold text-white">Step 3</p>
            <p className="mt-1 text-slate-300">Verify OTP to access your dashboard and profile.</p>
          </div>
        </div>
      </aside>

      <div className="theme-card p-5 sm:p-7">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="text-2xl font-semibold text-slate-900">Login</h2>
            <p className="mt-1 text-sm text-slate-500">
              OTP-based sign-in for Mobile, Aadhar, or Consumer ID.
            </p>
          </div>
          <span
            className={`rounded-full px-3 py-1 text-xs font-semibold ${
              otpRequested
                ? "bg-emerald-100 text-emerald-700"
                : "bg-slate-100 text-slate-600"
            }`}
          >
            {otpRequested ? "OTP Sent" : "Awaiting Request"}
          </span>
        </div>

        <form onSubmit={handleRequestOtp} className="mt-6 space-y-4">
          <div className="grid gap-3 sm:grid-cols-3">
            {(["M", "A", "C"] as IdentifierType[]).map((type) => {
              const active = identifierType === type;
              return (
                <button
                  key={type}
                  type="button"
                  onClick={() => {
                    setIdentifierType(type);
                    setIdentifierValue("");
                    setOtp("");
                    setOtpRequested(false);
                    setMessage("");
                    setError("");
                  }}
                  className={`rounded-xl border px-3 py-2 text-left transition ${
                    active
                      ? "border-cyan-400 bg-cyan-50 shadow-sm"
                      : "border-slate-200 bg-white hover:border-slate-300"
                  }`}
                >
                  <p className="text-xs font-semibold text-slate-500">{type}</p>
                  <p className="mt-0.5 text-sm font-semibold text-slate-800">
                    {identifierMetaMap[type].title}
                  </p>
                </button>
              );
            })}
          </div>

          <div className="rounded-xl border border-slate-200 bg-slate-50/70 p-4">
            <p className="text-sm font-semibold text-slate-800">
              {identifierMetaMap[identifierType].title}
            </p>
            <p className="mt-1 text-xs text-slate-500">
              {identifierMetaMap[identifierType].subtitle}
            </p>

            <label className="mt-3 block text-sm font-medium text-slate-700">
              Identifier Value
              <input
                value={identifierValue}
                onChange={(event) =>
                  setIdentifierValue(
                    sanitizeIdentifierValue(identifierType, event.target.value).slice(
                      0,
                      identifierMetaMap[identifierType].maxLength,
                    ),
                  )
                }
                inputMode={identifierMetaMap[identifierType].inputMode}
                placeholder={identifierMetaMap[identifierType].placeholder}
                className="theme-input mt-1"
                required
              />
            </label>
            <p className="mt-1 text-xs text-slate-500">
              {identifierMetaMap[identifierType].helper}
            </p>
          </div>

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
              Enter OTP
              <input
                value={otp}
                onChange={(event) => setOtp(sanitizeOtp(event.target.value))}
                inputMode="numeric"
                placeholder="Enter 6-digit OTP"
                className="theme-input mt-1 text-center tracking-[0.3em]"
                maxLength={6}
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
