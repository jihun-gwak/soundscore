"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Navbar from "@/components/Navbar";

export default function HomePage() {
  const [searchQuery, setSearchQuery] = useState("");
  const router = useRouter();

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  return (
    <div className="min-h-screen bg-[#1a1d20] text-white">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <header className="text-center py-20 sm:py-32 bg-gradient-to-br from-[#1db954]/30 via-[#191414] to-[#1a1d20] rounded-2xl mb-10 border border-gray-800">
          <h1 className="text-4xl sm:text-6xl font-bold mb-4 tracking-tight">
            Rate your favorite music
          </h1>
          <p className="text-lg sm:text-xl text-gray-300 mb-10">
            Search tracks, listen to previews, and share reviews
          </p>

          <form onSubmit={handleSearch} className="max-w-2xl mx-auto px-4">
            <div className="flex flex-col sm:flex-row gap-3">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search for a song or artist..."
                className="flex-1 px-6 py-4 rounded-full text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#1db954] text-lg"
              />
              <button
                type="submit"
                className="px-10 py-4 bg-[#1db954] text-white rounded-full hover:bg-[#1aa34a] transition-colors text-lg font-semibold"
              >
                Search
              </button>
            </div>
          </form>
        </header>

        <section className="grid sm:grid-cols-3 gap-6 text-center">
          <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700">
            <p className="text-3xl font-bold text-[#1db954] mb-2">Search</p>
            <p className="text-gray-400 text-sm">
              Find any track via Deezer&apos;s catalog
            </p>
          </div>
          <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700">
            <p className="text-3xl font-bold text-[#1db954] mb-2">Rate</p>
            <p className="text-gray-400 text-sm">
              Score songs from 0 to 10 with written reviews
            </p>
          </div>
          <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700">
            <p className="text-3xl font-bold text-[#1db954] mb-2">Share</p>
            <p className="text-gray-400 text-sm">
              See community scores and build your profile
            </p>
          </div>
        </section>

        <p className="text-center mt-12 text-gray-500 text-sm">
          New here?{" "}
          <Link href="/login/signup" className="text-[#1db954] hover:underline">
            Create a free account
          </Link>
        </p>
      </div>
    </div>
  );
}
