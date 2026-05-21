"use client";

import Link from "next/link";
import { useState } from "react";
import { useUserAuth, getFirebaseErrorMessage } from "../_utils/auth";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ErrorAlert from "@/components/ErrorAlert";

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
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-10 w-10 border-2 border-accent border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 flex items-center justify-center px-4 py-12">
        {user ? (
          <div className="glass-card p-10 text-center max-w-md w-full animate-slide-up">
            <span className="text-5xl mb-4 block">✓</span>
            <h1 className="text-2xl font-bold mb-4">Welcome back!</h1>
            <div className="flex flex-col gap-3">
              <Link href="/profile" className="btn-primary">
                Go to profile
              </Link>
              <button
                type="button"
                onClick={() => firebaseSignOut().then(() => router.push("/"))}
                className="btn-ghost"
              >
                Sign out
              </button>
            </div>
          </div>
        ) : (
          <div className="w-full max-w-md animate-slide-up">
            <div className="text-center mb-8">
              <span className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-accent to-emerald-600 text-2xl mb-4 shadow-lg shadow-accent/30">
                ♪
              </span>
              <h2 className="text-2xl font-bold">Sign in</h2>
              <p className="text-gray-500 text-sm mt-2">
                New here?{" "}
                <Link href="/login/signup" className="text-accent hover:underline">
                  Create an account
                </Link>
              </p>
            </div>

            <div className="glass-card p-8">
              {authError && (
                <ErrorAlert message={authError} variant="warning" className="mb-6" />
              )}
              <form onSubmit={handleSignIn} className="space-y-4">
                <div>
                  <label className="block text-sm text-gray-400 mb-1.5">Email</label>
                  <input
                    type="email"
                    required
                    autoComplete="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="input-field"
                    placeholder="you@example.com"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-1.5">Password</label>
                  <input
                    type="password"
                    required
                    autoComplete="current-password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="input-field"
                    placeholder="••••••••"
                  />
                </div>
                {error && <ErrorAlert message={error} />}
                <button
                  type="submit"
                  disabled={submitting || !!authError}
                  className="btn-primary w-full"
                >
                  {submitting ? "Signing in..." : "Sign in"}
                </button>
              </form>
            </div>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}
