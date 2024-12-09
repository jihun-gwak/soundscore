"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";

function HomePage() {
  const [searchQuery, setSearchQuery] = useState("");
  const router = useRouter();

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-5">
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

      {/* Recent Reviews Section */}
      <section className="mb-10">
        <h2 className="text-2xl font-bold text-gray-800 mb-5">
          Recent Reviews
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
          {/* We'll populate this with actual reviews later */}
          <div className="bg-white rounded-lg shadow p-4">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-12 h-12 bg-gray-200 rounded-md"></div>
              <div>
                <h3 className="font-semibold">Song Name</h3>
                <p className="text-sm text-gray-600">Artist Name</p>
              </div>
            </div>
            <div className="flex items-center mb-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <span key={star} className="text-yellow-400">
                  ★
                </span>
              ))}
            </div>
            <p className="text-sm text-gray-700">
              Great song! Love the beats...
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}

export default HomePage;
