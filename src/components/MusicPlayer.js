"use client";

import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { searchSongs } from "@/services/musicApi";
import { getClientErrorMessage } from "@/lib/fetchJson";
import SongCard from "./SongCard";
import SkeletonGrid from "./SkeletonGrid";
import ErrorAlert from "./ErrorAlert";

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
    if (initialQuery) runSearch(initialQuery);
  }, [initialQuery]);

  const runSearch = async (query) => {
    if (!query.trim()) return;
    setError(null);
    setSubmittedQuery(query);
    setIsLoading(true);
    try {
      const results = await searchSongs(query);
      setSearchResults(
        results.filter(
          (song) => song.id && song.title && typeof song.id === "number"
        )
      );
    } catch (err) {
      setError(getClientErrorMessage(err, "Search failed"));
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
    <div className="animate-fade-in">
      {submittedQuery && (
        <h1 className="text-2xl sm:text-3xl font-bold mb-2">
          Results for <span className="text-accent">&ldquo;{submittedQuery}&rdquo;</span>
        </h1>
      )}
      <p className="text-gray-500 text-sm mb-6">
        {isLoading
          ? "Searching..."
          : submittedQuery
            ? `${searchResults.length} track${searchResults.length === 1 ? "" : "s"} found`
            : "Enter a song or artist to search"}
      </p>

      <form onSubmit={handleSearch} className="mb-8">
        <div className="flex flex-col sm:flex-row gap-3">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search for songs..."
            aria-label="Search for songs"
            className="input-field flex-1 text-lg"
          />
          <button type="submit" disabled={isLoading} className="btn-primary">
            {isLoading ? "Searching..." : "Search"}
          </button>
        </div>
      </form>

      {error && (
        <ErrorAlert message={error} onRetry={() => runSearch(submittedQuery)} className="mb-6" />
      )}

      {isLoading && <SkeletonGrid count={6} />}

      {!isLoading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {searchResults.length === 0 && submittedQuery && !error && (
            <p className="text-gray-500 col-span-full text-center py-12 glass-card">
              No songs found. Try a different search term.
            </p>
          )}
          {searchResults.map((song) => (
            <SongCard key={song.id} song={song} />
          ))}
        </div>
      )}
    </div>
  );
}
