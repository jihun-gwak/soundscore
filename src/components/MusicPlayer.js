"use client";

import { useState, useEffect } from "react";
import { getSongDetails, searchSongs } from "../services/musicApi";
import { useRouter } from "next/navigation";

export default function MusicPlayer({ initialQuery = "" }) {
  const router = useRouter();
  const [currentSong, setCurrentSong] = useState(null);
  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [searchResults, setSearchResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [submittedQuery, setSubmittedQuery] = useState(initialQuery);
  const [showTitle, setShowTitle] = useState(true);

  useEffect(() => {
    if (initialQuery) {
      handleSearch();
    }
  }, [initialQuery]);

  const handleSearch = async (e) => {
    e?.preventDefault();
    setError(null);
    setSubmittedQuery(searchQuery);
    setShowTitle(true);

    if (searchQuery.trim()) {
      try {
        setIsLoading(true);
        const results = await searchSongs(searchQuery);
        // Update validation to include id
        const validResults = results.filter(
          (song) =>
            song.id &&
            song.url &&
            song.title &&
            typeof song.id === "number" &&
            typeof song.url === "string" &&
            typeof song.title === "string"
        );
        setSearchResults(validResults);
      } catch (err) {
        setError(`Failed to search songs: ${err.message}`);
        setSearchResults([]);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleSongSelect = async (song) => {
    try {
      setIsLoading(true);
      setError(null);
      // Navigate to the song's review page
      router.push(`/songs/${song.id}`);
    } catch (err) {
      setError(`Failed to load song details: ${err.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="music-player">
      {/* Title Section - uses submittedQuery and showTitle state */}
      {showTitle && submittedQuery && (
        <h1 className="text-2xl font-bold mb-6">
          Search Results for: {submittedQuery}
        </h1>
      )}

      {/* Search Section */}
      <form className="search-section mb-6" onSubmit={handleSearch}>
        <div className="flex gap-2">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search for songs..."
            aria-label="Search for songs"
            className="flex-1 px-4 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-[#1db954]"
          />
          <button
            type="submit"
            disabled={isLoading}
            className="px-6 py-2 bg-[#1db954] text-white rounded-lg hover:bg-[#169c46] transition-colors disabled:bg-gray-400"
          >
            {isLoading ? "Searching..." : "Search"}
          </button>
        </div>
      </form>

      {/* Error Message */}
      {error && (
        <div className="error-message" role="alert">
          {error}
        </div>
      )}

      {/* Search Results */}
      <div className="search-results grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
        {searchResults.length === 0 && searchQuery && !isLoading && (
          <p className="text-gray-500 col-span-full text-center py-4">
            No songs found. Try a different search term.
          </p>
        )}
        {searchResults.map((song, index) => (
          <button
            key={song.id || index}
            className="song-item flex items-center p-3 rounded-lg border hover:border-[#1db954] transition-all hover:shadow-md bg-white w-full text-left"
            onClick={() => handleSongSelect(song)}
            disabled={isLoading}
          >
            <img
              src={song.image_url}
              alt=""
              className="w-16 h-16 rounded-md object-cover"
              onError={(e) => {
                e.target.src = "/fallback-image.png";
              }}
            />
            <div className="song-info ml-4 flex-1 overflow-hidden">
              <h3 className="font-medium text-gray-900 truncate">
                {song.title}
              </h3>
              <p className="text-sm text-gray-500 truncate">{song.singers}</p>
            </div>
          </button>
        ))}
      </div>

      {isLoading && (
        <div className="loading-spinner" role="status">
          <span className="sr-only">Loading...</span>
        </div>
      )}

      {/* Current Song Player */}
      {currentSong && (
        <div className="current-song">
          <img
            src={currentSong.image_url}
            alt={`Album art for ${currentSong.title}`}
          />
          <div className="song-details">
            <h2>{currentSong.title}</h2>
            <p>{currentSong.singers}</p>
            <p>{currentSong.album}</p>
            {currentSong.lyrics && (
              <div className="lyrics">
                <h3>Lyrics</h3>
                <p>{currentSong.lyrics}</p>
              </div>
            )}
          </div>
          <audio
            controls
            src={currentSong.url}
            onError={() => setError("Failed to load audio. Please try again.")}
          />
        </div>
      )}
    </div>
  );
}
