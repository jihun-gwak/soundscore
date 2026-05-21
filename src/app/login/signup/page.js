"use client";

import Link from "next/link";
import { useState } from "react";
import { useUserAuth, getFirebaseErrorMessage } from "../../_utils/auth";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";

export default function SignUpPage() {
  const router = useRouter();
  const { emailSignUp, authError, initializing } = useUserAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function handleSignUp(e) {
    e.preventDefault();

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    setError("");
    setSubmitting(true);

    try {
      await emailSignUp(email.trim(), password);
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

  return (
    <div className="min-h-screen bg-[#1a1d20]">
      <Navbar />
      <main className="flex items-center justify-center px-4 py-16">
        <div className="max-w-md w-full bg-gray-800 p-8 rounded-xl border border-gray-700">
          <h2 className="text-center text-2xl font-bold mb-2">Create account</h2>
          <p className="text-center text-sm text-gray-400 mb-8">
            Already have an account?{" "}
            <Link href="/login" className="text-[#1db954] hover:underline">
              Sign in
            </Link>
          </p>

          {authError && (
            <p className="text-amber-400 text-sm text-center mb-4">{authError}</p>
          )}

          <form onSubmit={handleSignUp} className="space-y-4">
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
              autoComplete="new-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password (min 6 characters)"
              className="w-full px-4 py-3 rounded-lg bg-gray-700 border border-gray-600 text-white placeholder-gray-500 focus:ring-2 focus:ring-[#1db954] focus:outline-none"
            />
            <input
              type="password"
              required
              autoComplete="new-password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm password"
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
              {submitting ? "Creating account..." : "Create account"}
            </button>
          </form>
        </div>
      </main>
    </div>
  );
}
