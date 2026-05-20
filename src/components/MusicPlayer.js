"use client";

import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { searchSongs } from "@/services/musicApi";

export default function MusicPlayer() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get("q") || "";

  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [searchResults, setSearchResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [submittedQuery, setSubmittedQuery] = useState(initialQuery);

  useEffect(() => {
    if (initialQuery) {
      runSearch(initialQuery);
    }
  }, [initialQuery]);

  const runSearch = async (query) => {
    if (!query.trim()) return;
    setError(null);
    setSubmittedQuery(query);
    setIsLoading(true);
    try {
      const results = await searchSongs(query);
      const validResults = results.filter(
        (song) =>
          song.id &&
          song.title &&
          typeof song.id === "number" &&
          typeof song.title === "string"
      );
      setSearchResults(validResults);
    } catch (err) {
      setError(`Failed to search songs: ${err.message}`);
      setSearchResults([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    const q = searchQuery.trim();
    if (!q) return;
    router.replace(`/search?q=${encodeURIComponent(q)}`, { scroll: false });
    await runSearch(q);
  };

  return (
    <div>
      {submittedQuery && (
        <h1 className="text-2xl font-bold mb-6">
          Results for &ldquo;{submittedQuery}&rdquo;
        </h1>
      )}

      <form onSubmit={handleSearch} className="mb-6">
        <div className="flex flex-col sm:flex-row gap-3">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search for songs..."
            aria-label="Search for songs"
            className="flex-1 px-4 py-3 rounded-lg bg-gray-800 border border-gray-700 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#1db954]"
          />
          <button
            type="submit"
            disabled={isLoading}
            className="px-6 py-3 bg-[#1db954] text-white rounded-lg hover:bg-[#169c46] transition-colors disabled:opacity-50 font-medium"
          >
            {isLoading ? "Searching..." : "Search"}
          </button>
        </div>
      </form>

      {error && (
        <div
          className="bg-red-500/10 border border-red-500/50 text-red-400 p-4 rounded-lg mb-6"
          role="alert"
        >
          {error}
        </div>
      )}

      {isLoading && (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-[#1db954]" />
        </div>
      )}

      {!isLoading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {searchResults.length === 0 && submittedQuery && (
            <p className="text-gray-400 col-span-full text-center py-8">
              No songs found. Try a different search term.
            </p>
          )}
          {searchResults.map((song) => (
            <button
              key={song.id}
              type="button"
              className="flex items-center gap-4 p-4 rounded-xl border border-gray-700 bg-gray-800/80 hover:border-[#1db954] hover:bg-gray-800 transition-all text-left w-full"
              onClick={() => router.push(`/song/${song.id}`)}
            >
              {song.image_url && (
                <img
                  src={song.image_url}
                  alt=""
                  className="w-16 h-16 rounded-lg object-cover shrink-0"
                />
              )}
              <div className="min-w-0">
                <h3 className="font-medium text-white truncate">{song.title}</h3>
                <p className="text-sm text-gray-400 truncate">{song.singers}</p>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
