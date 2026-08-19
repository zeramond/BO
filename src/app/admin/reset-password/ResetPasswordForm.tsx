"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { authClient } from "@/lib/auth/client";

type ResetPasswordFormProps = {
  token: string | null;
  invalidLink: boolean;
};

export default function ResetPasswordForm({
  token,
  invalidLink,
}: ResetPasswordFormProps) {
  const [password, setPassword] = useState("");
  const [confirmation, setConfirmation] = useState("");
  const [loading, setLoading] = useState(false);
  const [complete, setComplete] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (
    event: FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    if (loading || !token) {
      return;
    }

    if (password !== confirmation) {
      setError("The passwords do not match.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const result = await authClient.resetPassword({
        newPassword: password,
        token,
      });

      if (result.error) {
        throw new Error("Password reset failed.");
      }

      setComplete(true);
      setPassword("");
      setConfirmation("");
    } catch {
      setError(
        "This reset link is invalid or has expired. Request a new one and try again."
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
          Choose a new password
        </h1>

        {complete ? (
          <div className="mt-8 rounded-2xl border border-emerald-400/20 bg-emerald-400/10 p-5">
            <p className="font-semibold text-emerald-200">
              Password updated
            </p>
            <p className="mt-2 text-sm leading-6 text-gray-300">
              You can now sign in with your new password.
            </p>
          </div>
        ) : invalidLink ? (
          <div className="mt-8 rounded-2xl border border-red-400/20 bg-red-400/10 p-5">
            <p className="font-semibold text-red-300">
              This link is invalid or expired
            </p>
            <p className="mt-2 text-sm leading-6 text-gray-300">
              Request a new password-reset email to continue.
            </p>
          </div>
        ) : (
          <>
            <p className="mt-3 text-gray-400">
              Use at least 8 characters. Your new password can be
              up to 128 characters long.
            </p>

            <form
              onSubmit={handleSubmit}
              className="mt-10 space-y-5"
            >
              <div>
                <label className="mb-2 block text-sm text-gray-300">
                  New password
                </label>

                <input
                  type="password"
                  required
                  autoFocus
                  minLength={8}
                  maxLength={128}
                  autoComplete="new-password"
                  value={password}
                  onChange={(event) =>
                    setPassword(event.target.value)
                  }
                  className="w-full rounded-xl border border-white/10 bg-white/[0.06] px-4 py-3.5 outline-none transition focus:border-fuchsia-400/60"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm text-gray-300">
                  Confirm new password
                </label>

                <input
                  type="password"
                  required
                  minLength={8}
                  maxLength={128}
                  autoComplete="new-password"
                  value={confirmation}
                  onChange={(event) =>
                    setConfirmation(event.target.value)
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
                {loading ? "Updating..." : "Update Password"}
              </button>
            </form>
          </>
        )}

        <div className="mt-8 flex flex-wrap gap-x-6 gap-y-3 text-sm">
          {(invalidLink || error) && (
            <Link
              href="/admin/forgot-password"
              className="text-fuchsia-300 transition hover:text-fuchsia-200"
            >
              Request a new link
            </Link>
          )}

          <Link
            href="/admin/login"
            className="text-fuchsia-300 transition hover:text-fuchsia-200"
          >
            Back to sign in
          </Link>
        </div>
      </div>
    </main>
  );
}
