"use client";
import Link from "next/link";
import { useState } from "react";
import { useUserAuth } from "../_utils/auth";

export default function SignUpPage() {
  const { user, emailSignUp } = useUserAuth();
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

    try {
      setError("");
      await emailSignUp(email, password);
    } catch (error) {
      if (error.code === "auth/email-already-in-use") {
        setError("Email already in use. Please use a different email.");
      } else if (error.code === "auth/weak-password") {
        setError("Password should be at least 6 characters long.");
      } else {
        setError("Failed to create an account.");
      }
      console.log(error);
    }
  }

  return (
    <main className="min-h-screen bg-gray-50 flex items-center justify-center px-4 sm:px-6 lg:px-8">
      {user ? (
        <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-xl shadow-lg">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Account Created Successfully!
            </h1>
            <p className="text-gray-600 mb-6">Welcome, {user.email}</p>
            <div className="space-y-4">
              <Link
                href="week-10/shopping-list"
                className="block w-full text-center bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-lg transition duration-300"
              >
                Go to shopping list
              </Link>
              <Link
                href="/"
                className="block w-full text-center border border-gray-300 text-gray-700 hover:bg-gray-50 font-semibold py-3 px-4 rounded-lg transition duration-300"
              >
                Back to Home
              </Link>
            </div>
          </div>
        </div>
      ) : (
        <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-xl shadow-lg">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900">
              Create an Account
            </h1>
            <p className="mt-2 text-gray-600">Sign up to get started</p>
          </div>

          {error && (
            <div className="bg-red-50 text-red-500 p-3 rounded-lg text-center text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSignUp} className="space-y-6">
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700"
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
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700"
              >
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="new-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label
                htmlFor="confirmPassword"
                className="block text-sm font-medium text-gray-700"
              >
                Confirm Password
              </label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                autoComplete="new-password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <button
              type="submit"
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-300"
            >
              Create Account
            </button>
          </form>

          <p className="text-center text-gray-600">
            Already have an account?{" "}
            <Link
              href="/"
              className="text-blue-600 hover:text-blue-800 font-semibold"
            >
              Sign in
            </Link>
          </p>
        </div>
      )}
    </main>
  );
}
