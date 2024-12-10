"use client";

import { useState, useEffect } from "react";
import { useUserAuth } from "../_utils/auth";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { searchSongs } from "@/services/musicApi";

export default function WriteReviewPage() {
  const { user } = useUserAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [selectedTrack, setSelectedTrack] = useState(null);
  const [rating, setRating] = useState(0);
  const [reviewText, setReviewText] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [error, setError] = useState("");
  const [isFormExpanded, setIsFormExpanded] = useState(false);
  const router = useRouter();

  // Function to search for tracks using Deezer API
  const searchTracks = async (query) => {
    if (!query.trim()) return;

    setIsSearching(true);
    setError("");


    try {
      const results = await searchSongs(query);
      setSearchResults(results);
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
        user_id: parseInt(user.uid),
        song_id: parseInt(selectedTrack.id),
        title: null,
        rating: rating,
        date: new Date().toISOString().split("T")[0],
        body: reviewText,
      };

      const response = await fetch("/api/reviews", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(review),
      });

      if (!response.ok) {
        throw new Error("Failed to submit review");
      }

      // Reset form
      setSelectedTrack(null);
      setRating(0);
      setReviewText("");
      setError("");
      setIsFormExpanded(false);

      // Redirect to profile
      router.push("/profile");
    } catch (error) {
      setError("Failed to submit review. Please try again.");
      console.error("Submit error:", error);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-[#121212] text-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">
            Please sign in to write a review
          </h1>
          <Link href="/login/signup" className="text-[#1db954] hover:text-[#1aa34a]">
            Sign In
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#121212] text-white">
      <nav className="border-b border-gray-800 p-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <Link href="/" className="text-xl font-bold">
            SoundScore
          </Link>
        </div>
      </nav>

      <main className="max-w-3xl mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Reviews</h1>
          {!isFormExpanded && (
            <button
              onClick={() => setIsFormExpanded(true)}
              className="bg-[#1db954] px-6 py-3 rounded-lg text-white font-semibold hover:bg-[#1aa34a] transition-colors flex items-center gap-2"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
              </svg>
              Write a Review
            </button>
          )}
        </div>

        {/* Collapsible Review Form */}
        {isFormExpanded && (
          <div className="bg-gray-800 rounded-lg p-6 mb-8 animate-fadeIn">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">Write a Review</h2>
              <button
                onClick={() => setIsFormExpanded(false)}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Search Section */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Search for a Song
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search for a song, artist, or album..."
                  className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:border-[#1db954]"
                />
                {isSearching && (
                  <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  </div>
                )}
              </div>

              {/* Search Results */}
              {searchResults.length > 0 && (
                <div className="mt-2 bg-gray-700 rounded-lg border border-gray-600 max-h-60 overflow-y-auto">
                  {searchResults.map((track) => (
                    <button
                      key={track.id}
                      onClick={() => handleTrackSelect(track)}
                      className="w-full p-4 flex items-center gap-4 hover:bg-gray-600 transition-colors text-left"
                    >
                      {track.album?.cover && (
                        <Image
                          src={track.album.cover}
                          alt={track.title}
                          width={48}
                          height={48}
                          className="rounded"
                        />
                      )}
                      <div>
                        <div className="font-medium">{track.title}</div>
                        <div className="text-sm text-gray-400">{track.artist?.name}</div>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Selected Track */}
            {selectedTrack && (
              <div className="mb-6 p-4 bg-gray-700 rounded-lg flex items-center gap-4">
                {selectedTrack.album?.cover && (
                  <Image
                    src={selectedTrack.album.cover}
                    alt={selectedTrack.title}
                    width={64}
                    height={64}
                    className="rounded"
                  />
                )}
                <div>
                  <div className="font-medium">{selectedTrack.title}</div>
                  <div className="text-sm text-gray-400">{selectedTrack.artist?.name}</div>
                </div>
                <button
                  onClick={() => setSelectedTrack(null)}
                  className="ml-auto text-gray-400 hover:text-white"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </button>
              </div>
            )}

            {/* Rating */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Rating
              </label>
              <div className="flex gap-2">
                {[...Array(10)].map((_, index) => (
                  <button
                    key={index + 1}
                    onClick={() => setRating(index + 1)}
                    className={`w-10 h-10 rounded-lg flex items-center justify-center font-medium transition-colors ${
                      rating >= index + 1
                        ? "bg-[#1db954] text-white"
                        : "bg-gray-700 text-gray-400 hover:bg-gray-600"
                    }`}
                  >
                    {index + 1}
                  </button>
                ))}
              </div>
            </div>

            {/* Review Text */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Your Review
              </label>
              <textarea
                value={reviewText}
                onChange={(e) => setReviewText(e.target.value)}
                placeholder="Write your review here..."
                className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg h-32 resize-none focus:outline-none focus:border-[#1db954]"
              />
            </div>

            {error && (
              <div className="mb-6 text-red-500 text-sm">{error}</div>
            )}

            <div className="flex justify-end gap-4">
              <button
                onClick={() => setIsFormExpanded(false)}
                className="px-6 py-3 text-gray-400 hover:text-white transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmitReview}
                className="bg-[#1db954] px-6 py-3 rounded-lg text-white font-semibold hover:bg-[#1aa34a] transition-colors"
              >
                Submit Review
              </button>
            </div>
          </div>
        )}

        {/* Reviews List will go here */}
      </main>
    </div>
  );
}
