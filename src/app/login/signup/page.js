"use client";

import Link from "next/link";
import { useState } from "react";
import { useUserAuth } from "../../_utils/auth";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";

export default function SignUpPage() {
  const router = useRouter();
  const { emailSignUp } = useUserAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");

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

    try {
      setError("");
      await emailSignUp(email, password);

      const response = await fetch("/api/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          display_name: email.split("@")[0],
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to create user record");
      }

      router.push("/profile");
    } catch {
      setError("Could not create account. This email may already be in use.");
    }
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
          <form onSubmit={handleSignUp} className="space-y-4">
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
              className="w-full px-4 py-3 rounded-lg bg-gray-700 border border-gray-600 text-white placeholder-gray-500 focus:ring-2 focus:ring-[#1db954] focus:outline-none"
            />
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              className="w-full px-4 py-3 rounded-lg bg-gray-700 border border-gray-600 text-white placeholder-gray-500 focus:ring-2 focus:ring-[#1db954] focus:outline-none"
            />
            <input
              type="password"
              required
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
              className="w-full py-3 bg-[#1db954] hover:bg-[#1aa34a] text-white font-semibold rounded-lg transition-colors"
            >
              Create account
            </button>
          </form>
        </div>
      </main>
    </div>
  );
}
