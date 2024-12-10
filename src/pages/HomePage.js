"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useUserAuth } from "../app/_utils/auth";
import Link from "next/link";

function HomePage() {
  const [searchQuery, setSearchQuery] = useState("");
  const router = useRouter();
  const { user, dbUser, firebaseSignOut } = useUserAuth();

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  const handleSignOut = async () => {
    try {
      await firebaseSignOut();
      router.push("/");
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-5">
      <nav className="flex justify-between items-center mb-8">
        <Link href="/" className="text-xl font-bold">
          SoundScore
        </Link>
        <div className="flex gap-4 items-center">
          {user ? (
            <div className="flex items-center gap-4">
              <div className="text-gray-800">
                <span className="font-medium">
                  Welcome, {user.displayName || "User"}
                </span>
              </div>
              <Link
                href="/profile"
                className="flex items-center gap-2 bg-[#0095f6] px-6 py-3 rounded-lg text-white font-semibold hover:bg-[#0084dd] transition-colors"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                    clipRule="evenodd"
                  />
                </svg>
                Profile
              </Link>
              <button
                onClick={handleSignOut}
                className="px-4 py-3 text-gray-600 hover:text-gray-800 transition-colors"
              >
                Sign Out
              </button>
            </div>
          ) : (
            <Link
              href="/login/signup"
              className="bg-[#0095f6] px-8 py-4 rounded-lg text-lg font-semibold hover:bg-[#0084dd] transition-colors"
            >
              Join SoundScore for free!
            </Link>
          )}
        </div>
      </nav>

      <header className="text-center py-24 bg-gradient-to-r from-[#1db954] to-[#191414] text-white rounded-2xl mb-10">
        <h1 className="text-5xl mb-5">Rate Your Favorite Music</h1>
        <p className="mb-6">Search, Rate, and Review Any Song</p>

        {/* Search Bar */}
        <form onSubmit={handleSearch} className="max-w-2xl mx-auto">
          <div className="flex gap-2">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search for a song..."
              className="flex-1 px-4 py-3 rounded-full text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#1db954]"
            />
            <button
              type="submit"
              className="px-8 py-3 bg-white text-[#1db954] rounded-full hover:bg-gray-100 transition-colors"
            >
              Search
            </button>
          </div>
        </form>
      </header>
    </div>
  );
}

export default HomePage;
