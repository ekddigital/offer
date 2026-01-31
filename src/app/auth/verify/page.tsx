"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { BrandLogo } from "@/components/ui/brand-logo";

function VerifyEmailForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);

  useEffect(() => {
    const emailParam = searchParams.get("email");
    if (emailParam) {
      setEmail(emailParam);
    }
  }, [searchParams]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (resendCooldown > 0) {
      interval = setInterval(() => {
        setResendCooldown((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [resendCooldown]);

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!email || !code) {
      setError("Please enter both email and verification code");
      return;
    }

    if (code.length !== 6) {
      setError("Verification code must be 6 digits");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("/api/auth/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, code }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Failed to verify email");
        return;
      }

      setSuccess("Email verified successfully! Redirecting to sign in...");

      // Redirect to signin page after successful verification
      setTimeout(() => {
        router.push("/auth/signin?verified=true");
      }, 2000);
    } catch {
      setError("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleResendCode = async () => {
    if (!email) {
      setError("Please enter your email address");
      return;
    }

    setError("");
    setResendLoading(true);

    try {
      const response = await fetch("/api/auth/resend", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Failed to resend verification code");
        return;
      }

      setSuccess("Verification code sent to your email");
      setResendCooldown(60); // 1 minute cooldown
      setCode(""); // Clear any existing code
    } catch {
      setError("An error occurred. Please try again.");
    } finally {
      setResendLoading(false);
    }
  };

  const handleCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, "").slice(0, 6);
    setCode(value);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-ecommerce-navy px-4 py-12">
      <div className="w-full max-w-md">
        <div className="rounded-2xl border-2 border-ecommerce-border bg-background p-8 shadow-2xl">
          <div className="text-center">
            <BrandLogo size={64} wrapperClassName="mx-auto rounded-xl p-2" />
            <h2 className="mt-6 text-3xl font-bold text-foreground">
              Verify your email
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Enter the 6-digit code sent to your email address
            </p>
          </div>

          <form onSubmit={handleVerify} className="mt-8 space-y-6">
            {error && (
              <div className="rounded-lg bg-red-50 p-4 text-sm text-red-600 dark:bg-red-900/20">
                {error}
              </div>
            )}

            {success && (
              <div className="rounded-lg bg-green-50 p-4 text-sm text-green-600 dark:bg-green-900/20">
                {success}
              </div>
            )}

            <div className="space-y-4">
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-foreground"
                >
                  Email address
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="mt-1 block w-full rounded-lg border border-border bg-background px-3 py-2 text-foreground placeholder-muted-foreground focus:border-brand-primary focus:outline-none focus:ring-1 focus:ring-brand-primary"
                  placeholder="you@example.com"
                />
              </div>

              <div>
                <label
                  htmlFor="code"
                  className="block text-sm font-medium text-foreground"
                >
                  Verification code
                </label>
                <input
                  id="code"
                  name="code"
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  maxLength={6}
                  required
                  value={code}
                  onChange={handleCodeChange}
                  className="mt-1 block w-full rounded-lg border border-border bg-background px-3 py-2 text-center text-2xl font-mono tracking-widest text-foreground placeholder-muted-foreground focus:border-brand-primary focus:outline-none focus:ring-1 focus:ring-brand-primary"
                  placeholder="123456"
                />
                <p className="mt-1 text-xs text-muted-foreground">
                  Enter the 6-digit code from your email
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <button
                type="submit"
                disabled={loading || !email || !code}
                className="w-full rounded-lg bg-brand-primary px-4 py-2 text-white transition-colors hover:bg-brand-secondary focus:outline-none focus:ring-2 focus:ring-brand-primary focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {loading ? "Verifying..." : "Verify Email"}
              </button>

              <div className="flex items-center justify-between">
                <button
                  type="button"
                  onClick={handleResendCode}
                  disabled={resendLoading || resendCooldown > 0 || !email}
                  className="text-sm text-brand-primary hover:text-brand-secondary disabled:cursor-not-allowed disabled:text-muted-foreground"
                >
                  {resendLoading
                    ? "Sending..."
                    : resendCooldown > 0
                      ? `Resend code in ${resendCooldown}s`
                      : "Resend code"}
                </button>

                <button
                  type="button"
                  onClick={() => router.push("/auth/signin")}
                  className="text-sm text-muted-foreground hover:text-foreground"
                >
                  Back to sign in
                </button>
              </div>
            </div>
          </form>

          <div className="mt-8 text-center">
            <p className="text-xs text-muted-foreground">
              Didn&apos;t receive the code? Check your spam folder or click
              resend.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <VerifyEmailForm />
    </Suspense>
  );
}
