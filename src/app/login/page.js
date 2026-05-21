"use client";

import Link from "next/link";
import { useState } from "react";
import { useUserAuth, getFirebaseErrorMessage } from "../_utils/auth";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";

export default function SignInPage() {
  const router = useRouter();
  const { user, authError, emailSignIn, firebaseSignOut, initializing } =
    useUserAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function handleSignIn(e) {
    e.preventDefault();
    setError("");
    setSubmitting(true);

    try {
      await emailSignIn(email.trim(), password);
      router.push("/profile");
    } catch (err) {
      setError(getFirebaseErrorMessage(err));
    } finally {
      setSubmitting(false);
    }
  }

  if (initializing) {
    return (
      <div className="min-h-screen bg-[#1a1d20] flex items-center justify-center">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-[#1db954]" />
      </div>
    );
  }

  if (user) {
    return (
      <div className="min-h-screen bg-[#1a1d20]">
        <Navbar />
        <main className="flex items-center justify-center px-4 py-16">
          <div className="max-w-md w-full bg-gray-800 p-8 rounded-xl border border-gray-700 text-center">
            <h1 className="text-2xl font-bold mb-4">You&apos;re signed in</h1>
            <div className="flex flex-col gap-3">
              <Link
                href="/profile"
                className="bg-[#1db954] hover:bg-[#1aa34a] text-white font-semibold py-3 rounded-lg transition-colors"
              >
                Go to profile
              </Link>
              <button
                type="button"
                onClick={() => firebaseSignOut().then(() => router.push("/"))}
                className="text-gray-400 hover:text-white py-2"
              >
                Sign out
              </button>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#1a1d20]">
      <Navbar />
      <main className="flex items-center justify-center px-4 py-16">
        <div className="max-w-md w-full bg-gray-800 p-8 rounded-xl border border-gray-700">
          <h2 className="text-center text-2xl font-bold mb-2">Sign in</h2>
          <p className="text-center text-sm text-gray-400 mb-8">
            Or{" "}
            <Link href="/login/signup" className="text-[#1db954] hover:underline">
              create an account
            </Link>
          </p>

          {authError && (
            <p className="text-amber-400 text-sm text-center mb-4">{authError}</p>
          )}

          <form onSubmit={handleSignIn} className="space-y-4">
            <input
              type="email"
              required
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
              className="w-full px-4 py-3 rounded-lg bg-gray-700 border border-gray-600 text-white placeholder-gray-500 focus:ring-2 focus:ring-[#1db954] focus:outline-none"
            />
            <input
              type="password"
              required
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              className="w-full px-4 py-3 rounded-lg bg-gray-700 border border-gray-600 text-white placeholder-gray-500 focus:ring-2 focus:ring-[#1db954] focus:outline-none"
            />
            {error && (
              <p className="text-red-400 text-sm text-center">{error}</p>
            )}
            <button
              type="submit"
              disabled={submitting || !!authError}
              className="w-full py-3 bg-[#1db954] hover:bg-[#1aa34a] text-white font-semibold rounded-lg transition-colors disabled:opacity-50"
            >
              {submitting ? "Signing in..." : "Sign in"}
            </button>
          </form>
        </div>
      </main>
    </div>
  );
}
