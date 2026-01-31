"use client";

import { useState, useEffect, Suspense } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { BrandLogo } from "@/components/ui/brand-logo";

function SignInForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Check for success messages from URL params
    const registered = searchParams.get("registered");
    const verified = searchParams.get("verified");

    if (registered) {
      setSuccess(
        "Account created! Please check your email for verification code.",
      );
    } else if (verified) {
      setSuccess("Email verified successfully! You can now sign in.");
    }
  }, [searchParams]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        // Check if error is about email verification
        if (result.error.includes("verify your email")) {
          setError("Please verify your email address before signing in.");
        } else {
          setError("Invalid email or password");
        }
      } else {
        router.push("/");
        router.refresh();
      }
    } catch {
      setError("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-ecommerce-navy px-4 py-12">
      <div className="w-full max-w-md">
        {/* Card Container */}
        <div className="rounded-2xl border-2 border-ecommerce-border bg-background p-8 shadow-2xl">
          <div className="text-center">
            <BrandLogo size={64} wrapperClassName="mx-auto rounded-xl p-2" />
            <h2 className="mt-6 text-3xl font-bold text-foreground">
              Sign in to AND Offer
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Access your account to explore products and submit inquiries
            </p>
          </div>

          <form onSubmit={handleSubmit} className="mt-8 space-y-6">
            {error && (
              <div className="rounded-lg bg-red-50 p-4 text-sm text-red-600 dark:bg-red-900/20">
                {error}
                {error.includes("verify your email") && email && (
                  <div className="mt-2">
                    <Link
                      href={`/auth/verify?email=${encodeURIComponent(email)}`}
                      className="underline font-medium hover:no-underline"
                    >
                      Verify your email now →
                    </Link>
                  </div>
                )}
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
                  htmlFor="password"
                  className="block text-sm font-medium text-foreground"
                >
                  Password
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="mt-1 block w-full rounded-lg border border-border bg-background px-3 py-2 text-foreground placeholder-muted-foreground focus:border-brand-primary focus:outline-none focus:ring-1 focus:ring-brand-primary"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-lg border-2 border-ecommerce-primary bg-ecommerce-primary px-4 py-3 text-sm font-semibold text-ecommerce-primary-text shadow-md transition hover:bg-ecommerce-primary-hover hover:border-ecommerce-primary-hover hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading ? "Signing in..." : "Sign in"}
            </button>

            <div className="text-center text-sm">
              <span className="text-muted-foreground">
                Don&apos;t have an account?{" "}
              </span>
              <Link
                href="/auth/signup"
                className="font-medium text-brand-primary hover:text-brand-primary-dark"
              >
                Sign up
              </Link>
            </div>

            <div className="text-center">
              <Link
                href="/"
                className="text-sm text-muted-foreground hover:text-foreground"
              >
                ← Back to home
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default function SignInPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <SignInForm />
    </Suspense>
  );
}
