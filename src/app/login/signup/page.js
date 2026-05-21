"use client";

import Link from "next/link";
import { useState } from "react";
import { useUserAuth, getFirebaseErrorMessage } from "../../_utils/auth";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ErrorAlert from "@/components/ErrorAlert";

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
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-10 w-10 border-2 border-accent border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md animate-slide-up">
          <div className="text-center mb-8">
            <span className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-accent to-emerald-600 text-2xl mb-4 shadow-lg shadow-accent/30">
              ♪
            </span>
            <h2 className="text-2xl font-bold">Join SoundScore</h2>
            <p className="text-gray-500 text-sm mt-2">
              Already have an account?{" "}
              <Link href="/login" className="text-accent hover:underline">
                Sign in
              </Link>
            </p>
          </div>

          <div className="glass-card p-8">
            {authError && (
              <ErrorAlert message={authError} variant="warning" className="mb-6" />
            )}
            <form onSubmit={handleSignUp} className="space-y-4">
              <div>
                <label className="block text-sm text-gray-400 mb-1.5">Email</label>
                <input
                  type="email"
                  required
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="input-field"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1.5">Password</label>
                <input
                  type="password"
                  required
                  autoComplete="new-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="input-field"
                  placeholder="Min 6 characters"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1.5">Confirm password</label>
                <input
                  type="password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="input-field"
                />
              </div>
              {error && <ErrorAlert message={error} />}
              <button
                type="submit"
                disabled={submitting || !!authError}
                className="btn-primary w-full"
              >
                {submitting ? "Creating account..." : "Create account"}
              </button>
            </form>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
