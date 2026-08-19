"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { authClient } from "@/lib/auth/client";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (
    event: FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    if (loading) {
      return;
    }

    setLoading(true);
    setError("");

    try {
      const result = await authClient.requestPasswordReset({
        email: email.trim(),
        redirectTo: `${window.location.origin}/admin/reset-password`,
      });

      if (result.error) {
        throw new Error("Password reset request failed.");
      }

      setSubmitted(true);
    } catch {
      setError(
        "We could not send the reset email. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-black px-6 text-white">
      <div className="w-full max-w-md">
        <p className="mb-4 text-xs uppercase tracking-[0.45em] text-fuchsia-300">
          BO BOWLING
        </p>

        <h1 className="text-4xl font-bold">
          Reset your password
        </h1>

        {submitted ? (
          <div className="mt-8 rounded-2xl border border-emerald-400/20 bg-emerald-400/10 p-5">
            <p className="font-semibold text-emerald-200">
              Check your email
            </p>
            <p className="mt-2 text-sm leading-6 text-gray-300">
              If an admin account exists for that address, a
              password-reset link has been sent. The link expires
              shortly, so use it as soon as it arrives.
            </p>
          </div>
        ) : (
          <>
            <p className="mt-3 text-gray-400">
              Enter the admin email address and we will send a
              secure reset link.
            </p>

            <form
              onSubmit={handleSubmit}
              className="mt-10 space-y-5"
            >
              <div>
                <label className="mb-2 block text-sm text-gray-300">
                  Email
                </label>

                <input
                  type="email"
                  required
                  autoFocus
                  autoComplete="email"
                  value={email}
                  onChange={(event) =>
                    setEmail(event.target.value)
                  }
                  className="w-full rounded-xl border border-white/10 bg-white/[0.06] px-4 py-3.5 outline-none transition focus:border-fuchsia-400/60"
                />
              </div>

              {error && (
                <p
                  role="alert"
                  className="text-sm text-red-400"
                >
                  {error}
                </p>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-full bg-white px-6 py-4 font-semibold text-black transition hover:scale-[1.02] disabled:opacity-50"
              >
                {loading ? "Sending..." : "Send Reset Link"}
              </button>
            </form>
          </>
        )}

        <Link
          href="/admin/login"
          className="mt-8 inline-block text-sm text-fuchsia-300 transition hover:text-fuchsia-200"
        >
          Back to sign in
        </Link>
      </div>
    </main>
  );
}
