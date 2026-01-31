"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Eye, EyeOff } from "lucide-react";
import { BrandLogo } from "@/components/ui/brand-logo";

export default function SignUpPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordValidation, setPasswordValidation] = useState({
    minLength: false,
    hasUpperCase: false,
    hasLowerCase: false,
    hasNumbers: false,
    hasSpecialChar: false,
  });

  const validatePassword = (password: string) => {
    const validation = {
      minLength: password.length >= 8,
      hasUpperCase: /[A-Z]/.test(password),
      hasLowerCase: /[a-z]/.test(password),
      hasNumbers: /\d/.test(password),
      hasSpecialChar: /[!@#$%^&*(),.?":{}|<>]/.test(password),
    };
    setPasswordValidation(validation);
    return Object.values(validation).every(Boolean);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (!validatePassword(formData.password)) {
      setError("Password does not meet requirements");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Failed to create account");
        return;
      }

      // If requires verification, redirect to verify email page
      if (data.requiresVerification) {
        router.push(`/auth/verify?email=${encodeURIComponent(formData.email)}`);
      } else {
        // Fallback: redirect to sign in page
        router.push("/auth/signin?registered=true");
      }
    } catch {
      setError("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Validate password as user types
    if (name === "password") {
      validatePassword(value);
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
              Create your account
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Join AND Offer to access verified suppliers and products
            </p>
          </div>

          <form onSubmit={handleSubmit} className="mt-8 space-y-6">
            {error && (
              <div className="rounded-lg bg-red-50 p-4 text-sm text-red-600 dark:bg-red-900/20">
                {error}
              </div>
            )}

            <div className="space-y-4">
              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-foreground"
                >
                  Full name
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  autoComplete="name"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-lg border border-border bg-background px-3 py-2 text-foreground placeholder-muted-foreground focus:border-brand-primary focus:outline-none focus:ring-1 focus:ring-brand-primary"
                  placeholder="John Doe"
                />
              </div>

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
                  value={formData.email}
                  onChange={handleChange}
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
                <div className="relative">
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="new-password"
                    required
                    value={formData.password}
                    onChange={handleChange}
                    className="mt-1 block w-full rounded-lg border border-border bg-background px-3 py-2 pr-10 text-foreground placeholder-muted-foreground focus:border-brand-primary focus:outline-none focus:ring-1 focus:ring-brand-primary"
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 flex items-center pr-3 text-muted-foreground hover:text-foreground"
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>

                {/* Password validation indicators */}
                {formData.password && (
                  <div className="mt-2 space-y-1 text-xs">
                    <div
                      className={`flex items-center space-x-2 ${passwordValidation.minLength ? "text-green-600" : "text-red-500"}`}
                    >
                      <span>{passwordValidation.minLength ? "✓" : "✗"}</span>
                      <span>At least 8 characters</span>
                    </div>
                    <div
                      className={`flex items-center space-x-2 ${passwordValidation.hasUpperCase ? "text-green-600" : "text-red-500"}`}
                    >
                      <span>{passwordValidation.hasUpperCase ? "✓" : "✗"}</span>
                      <span>One uppercase letter</span>
                    </div>
                    <div
                      className={`flex items-center space-x-2 ${passwordValidation.hasLowerCase ? "text-green-600" : "text-red-500"}`}
                    >
                      <span>{passwordValidation.hasLowerCase ? "✓" : "✗"}</span>
                      <span>One lowercase letter</span>
                    </div>
                    <div
                      className={`flex items-center space-x-2 ${passwordValidation.hasNumbers ? "text-green-600" : "text-red-500"}`}
                    >
                      <span>{passwordValidation.hasNumbers ? "✓" : "✗"}</span>
                      <span>One number</span>
                    </div>
                    <div
                      className={`flex items-center space-x-2 ${passwordValidation.hasSpecialChar ? "text-green-600" : "text-red-500"}`}
                    >
                      <span>
                        {passwordValidation.hasSpecialChar ? "✓" : "✗"}
                      </span>
                      <span>One special character</span>
                    </div>
                  </div>
                )}
              </div>

              <div>
                <label
                  htmlFor="confirmPassword"
                  className="block text-sm font-medium text-foreground"
                >
                  Confirm password
                </label>
                <div className="relative">
                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    autoComplete="new-password"
                    required
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className="mt-1 block w-full rounded-lg border border-border bg-background px-3 py-2 pr-10 text-foreground placeholder-muted-foreground focus:border-brand-primary focus:outline-none focus:ring-1 focus:ring-brand-primary"
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute inset-y-0 right-0 flex items-center pr-3 text-muted-foreground hover:text-foreground"
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>

                {/* Password match indicator */}
                {formData.confirmPassword && (
                  <div
                    className={`mt-1 text-xs flex items-center space-x-2 ${
                      formData.password === formData.confirmPassword
                        ? "text-green-600"
                        : "text-red-500"
                    }`}
                  >
                    <span>
                      {formData.password === formData.confirmPassword
                        ? "✓"
                        : "✗"}
                    </span>
                    <span>
                      {formData.password === formData.confirmPassword
                        ? "Passwords match"
                        : "Passwords do not match"}
                    </span>
                  </div>
                )}
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-lg border-2 border-ecommerce-primary bg-ecommerce-primary px-4 py-3 text-sm font-semibold text-ecommerce-primary-text shadow-md transition hover:bg-ecommerce-primary-hover hover:border-ecommerce-primary-hover hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading ? "Creating account..." : "Create account"}
            </button>

            <div className="text-center text-sm">
              <span className="text-muted-foreground">
                Already have an account?{" "}
              </span>
              <Link
                href="/auth/signin"
                className="font-medium text-brand-primary hover:text-brand-primary-dark"
              >
                Sign in
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
