"use client";
import Link from "next/link";
import React, { useState } from "react";
import { useUserAuth } from "../_utils/auth";
import { useRouter } from "next/navigation";

export default function SignInPage() {
  const router = useRouter();
  const { user, emailSignIn, firebaseSignOut } = useUserAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  async function handleSignIn(e) {
    e.preventDefault();
    try {
      setError("");
      // First, authenticate with Firebase
      await emailSignIn(email, password);

      // Check if user exists in database
      const encodedEmail = encodeURIComponent(email);
      const checkUser = await fetch(`/api/users/email/${encodedEmail}`);
      
      if (checkUser.status === 404) {
        // User doesn't exist, create them
        const createResponse = await fetch("/api/users", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: email,
            display_name: email.split("@")[0], // Using part before @ as display name
          }),
        });

        if (!createResponse.ok) {
          throw new Error("Failed to create user record");
        }
      }

      router.push("/profile");
    } catch (error) {
      setError("Failed to sign in. Please check your credentials.");
      console.log(error);
    }
  }

  async function handleSignOut() {
    try {
      await firebaseSignOut();
      router.push("/");
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <main className="min-h-screen bg-[#1a1d20] flex items-center justify-center px-4 sm:px-6 lg:px-8">
      {user ? (
        <div className="max-w-md w-full space-y-8 bg-gray-800 p-8 rounded-xl shadow-lg">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-white mb-2">
              Welcome back!
            </h1>
            <p className="text-gray-400 mb-6">Redirecting to your profile...</p>
            <div className="space-y-4">
              <Link
                href="/profile"
                className="block w-full text-center bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-lg transition duration-300"
              >
                Go to Profile
              </Link>
              <button
                type="button"
                onClick={handleSignOut}
                className="w-full border border-gray-600 text-gray-300 hover:bg-gray-700 font-semibold py-3 px-4 rounded-lg transition duration-300"
              >
                Sign out
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="max-w-md w-full space-y-8 bg-gray-800 p-8 rounded-xl shadow-lg">
          <div>
            <h2 className="text-center text-3xl font-bold text-white">
              Sign in to your account
            </h2>
            <p className="mt-2 text-center text-sm text-gray-400">
              Or{" "}
              <Link
                href="/login/signup"
                className="font-medium text-blue-500 hover:text-blue-400"
              >
                create a new account
              </Link>
            </p>
          </div>
          <form className="mt-8 space-y-6" onSubmit={handleSignIn}>
            <div className="space-y-4">
              <div>
                <label htmlFor="email" className="sr-only">
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
                  className="appearance-none relative block w-full px-3 py-2 border border-gray-600 rounded-lg bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent sm:text-sm"
                  placeholder="Email address"
                />
              </div>
              <div>
                <label htmlFor="password" className="sr-only">
                  Password
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="appearance-none relative block w-full px-3 py-2 border border-gray-600 rounded-lg bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent sm:text-sm"
                  placeholder="Password"
                />
              </div>
            </div>

            {error && (
              <div className="text-red-500 text-sm text-center">{error}</div>
            )}

            <div>
              <button
                type="submit"
                className="group relative w-full flex justify-center py-2 px-4 border border-transparent rounded-lg text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-300"
              >
                Sign in
              </button>
            </div>
          </form>
        </div>
      )}
    </main>
  );
}
