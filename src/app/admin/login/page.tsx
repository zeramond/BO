"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth/client";

export default function AdminLoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
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
      const result = await authClient.signIn.email({
        email: email.trim(),
        password,
      });

      if (result.error) {
        throw new Error(
          result.error.message || "Invalid email or password."
        );
      }

      router.replace("/admin/reservations");
      router.refresh();
    } catch (loginError) {
      console.error("Admin login failed:", loginError);
      setError("Invalid email or password.");
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
          Reservations Admin
        </h1>

        <p className="mt-3 text-gray-400">
          Sign in to manage reservation requests.
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
              autoComplete="email"
              value={email}
              onChange={(event) =>
                setEmail(event.target.value)
              }
              className="w-full rounded-xl border border-white/10 bg-white/[0.06] px-4 py-3.5 outline-none transition focus:border-fuchsia-400/60"
            />
          </div>

          <div>
            <div className="mb-2 flex items-center justify-between gap-4">
              <label className="block text-sm text-gray-300">
                Password
              </label>

              <Link
                href="/admin/forgot-password"
                className="text-sm text-fuchsia-300 transition hover:text-fuchsia-200"
              >
                Forgot password?
              </Link>
            </div>

            <input
              type="password"
              required
              autoComplete="current-password"
              value={password}
              onChange={(event) =>
                setPassword(event.target.value)
              }
              className="w-full rounded-xl border border-white/10 bg-white/[0.06] px-4 py-3.5 outline-none transition focus:border-fuchsia-400/60"
            />
          </div>

          {error && (
            <p className="text-sm text-red-400">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-full bg-white px-6 py-4 font-semibold text-black transition hover:scale-[1.02] disabled:opacity-50"
          >
            {loading ? "Signing In..." : "Sign In"}
          </button>
        </form>
      </div>
    </main>
  );
}
