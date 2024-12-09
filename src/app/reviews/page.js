"use client";

import { useState, useEffect } from "react";
import { useUserAuth } from "../_utils/auth";
import Link from "next/link";
import Image from "next/image";

export default function WriteReviewPage() {
  const { user } = useUserAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [selectedTrack, setSelectedTrack] = useState(null);
  const [rating, setRating] = useState(0);
  const [reviewText, setReviewText] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [error, setError] = useState("");

  // Function to search for tracks using Spotify API
  const searchTracks = async (query) => {
    if (!query.trim()) return;
    
    setIsSearching(true);
    setError("");

    try {
      const response = await fetch(`/api/spotify/search?q=${encodeURIComponent(query)}`);
      const data = await response.json();
      
      if (data.error) {
        setError("Failed to search for tracks. Please try again.");
        return;
      }

      setSearchResults(data.tracks.items);
    } catch (error) {
      setError("An error occurred while searching. Please try again.");
      console.error("Search error:", error);
    } finally {
      setIsSearching(false);
    }
  };

  // Debounced search
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (searchQuery) {
        searchTracks(searchQuery);
      }
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [searchQuery]);

  const handleTrackSelect = (track) => {
    setSelectedTrack(track);
    setSearchResults([]);
    setSearchQuery("");
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    
    if (!selectedTrack) {
      setError("Please select a track to review");
      return;
    }

    if (rating === 0) {
      setError("Please select a rating");
      return;
    }

    if (!reviewText.trim()) {
      setError("Please write a review");
      return;
    }

    try {
      const review = {
        userId: user.uid,
        trackId: selectedTrack.id,
        trackName: selectedTrack.name,
        artistName: selectedTrack.artists[0].name,
        albumName: selectedTrack.album.name,
        albumCover: selectedTrack.album.images[0]?.url,
        rating,
        reviewText,
        createdAt: new Date().toISOString(),
      };

      // Send review to your backend
      const response = await fetch('/api/reviews', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(review),
      });

      if (!response.ok) {
        throw new Error('Failed to submit review');
      }

      // Reset form
      setSelectedTrack(null);
      setRating(0);
      setReviewText("");
      setError("");

      // Redirect to profile or review success page
      window.location.href = '/profile';
    } catch (error) {
      setError("Failed to submit review. Please try again.");
      console.error("Submit error:", error);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-[#1a1d20] text-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Please sign in to write a review</h1>
          <Link href="/signup" className="text-blue-500 hover:text-blue-400">
            Sign In
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#1a1d20] text-white">
      <nav className="border-b border-gray-800 p-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <Link href="/" className="text-xl font-bold">SoundScore</Link>
        </div>
      </nav>

      <main className="max-w-3xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Write a Review</h1>

        {/* Search Section */}
        <div className="mb-8">
          <div className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search for a song, artist, or album..."
              className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-white placeholder-gray-400"
            />
            {isSearching && (
              <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
              </div>
            )}
          </div>

          {/* Search Results */}
          {searchResults.length > 0 && (
            <div className="mt-2 bg-gray-800 border border-gray-700 rounded-lg overflow-hidden">
              {searchResults.map((track) => (
                <button
                  key={track.id}
                  onClick={() => handleTrackSelect(track)}
                  className="w-full p-4 flex items-center gap-4 hover:bg-gray-700 transition-colors border-b border-gray-700 last:border-0"
                >
                  {track.album.images[0] && (
                    <Image
                      src={track.album.images[0].url}
                      alt={track.album.name}
                      width={48}
                      height={48}
                      className="rounded"
                    />
                  )}
                  <div className="flex-1 text-left">
                    <div className="font-medium">{track.name}</div>
                    <div className="text-sm text-gray-400">
                      {track.artists.map(a => a.name).join(", ")} • {track.album.name}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Selected Track */}
        {selectedTrack && (
          <div className="mb-8 p-6 bg-gray-800 rounded-lg">
            <div className="flex items-center gap-6">
              {selectedTrack.album.images[0] && (
                <Image
                  src={selectedTrack.album.images[0].url}
                  alt={selectedTrack.album.name}
                  width={120}
                  height={120}
                  className="rounded"
                />
              )}
              <div>
                <h2 className="text-2xl font-bold">{selectedTrack.name}</h2>
                <p className="text-gray-400">
                  {selectedTrack.artists.map(a => a.name).join(", ")}
                </p>
                <p className="text-gray-400">{selectedTrack.album.name}</p>
              </div>
            </div>
          </div>
        )}

        {/* Review Form */}
        <form onSubmit={handleSubmitReview} className="space-y-6">
          {/* Rating */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Rating
            </label>
            <div className="flex gap-2">
              {[...Array(10)].map((_, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setRating(i + 1)}
                  className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${
                    rating >= i + 1 ? 'bg-yellow-500 text-gray-900' : 'bg-gray-700 text-gray-400'
                  }`}
                >
                  {i + 1}
                </button>
              ))}
            </div>
          </div>

          {/* Review Text */}
          <div>
            <label htmlFor="review" className="block text-sm font-medium text-gray-300 mb-2">
              Your Review
            </label>
            <textarea
              id="review"
              rows={6}
              value={reviewText}
              onChange={(e) => setReviewText(e.target.value)}
              placeholder="Write your review here..."
              className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-white placeholder-gray-400"
            />
          </div>

          {error && (
            <div className="text-red-500 text-sm">{error}</div>
          )}

          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors"
          >
            Submit Review
          </button>
        </form>
      </main>
    </div>
  );
}