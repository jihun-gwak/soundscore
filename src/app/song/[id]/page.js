"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { getSongDetails } from "@/services/musicApi";
import Link from "next/link";
import { useUserAuth } from "@/app/_utils/auth";
import Navbar from "@/components/Navbar";

export default function SongDetails() {
  const { id } = useParams();
  const [song, setSong] = useState(null);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [reviews, setReviews] = useState([]);
  const [averageRating, setAverageRating] = useState(null);
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const { user, dbUser, initializing, getIdToken } = useUserAuth();

  const fetchReviews = async () => {
    const response = await fetch(`/api/reviews/song/${id}`);
    if (!response.ok) throw new Error("Failed to fetch reviews");
    const data = await response.json();
    setReviews(data.reviews ?? []);
    setAverageRating(data.averageRating);
  };

  useEffect(() => {
    const fetchSongDetails = async () => {
      try {
        const songData = await getSongDetails(id);
        setSong({
          title: songData.title,
          artist: songData.singers,
          albumArt: songData.image_url,
          album: songData.album,
          audioUrl: songData.audio_url,
        });
      } catch (err) {
        console.error("Error fetching song details:", err);
        setError(err.message || "Failed to load song details");
      }
    };

    fetchSongDetails();
    fetchReviews().catch((err) => {
      console.error("Error fetching reviews:", err);
      setError("Failed to load reviews");
    });
  }, [id]);

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    if (!user) {
      setError("Please sign in to write a review");
      return;
    }

    if (!dbUser?.user_id) {
      setError("Account still syncing. Wait a moment and try again.");
      return;
    }

    if (rating < 0 || rating > 10) {
      setError("Please select a rating between 0 and 10");
      return;
    }

    if (!comment.trim()) {
      setError("Please write a comment");
      return;
    }

    setIsSubmitting(true);
    setError("");

    try {
      const token = await getIdToken();
      if (!token) {
        throw new Error("Session expired. Please sign in again.");
      }

      const response = await fetch("/api/reviews", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          song_id: Number(id),
          title: null,
          rating,
          date: new Date().toISOString().split("T")[0],
          body: comment,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to save review");
      }

      await fetchReviews();
      setComment("");
      setRating(5);
      setIsFormVisible(false);
    } catch (err) {
      setError(err.message || "An unexpected error occurred. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!song && !error) {
    return (
      <div className="min-h-screen bg-[#1a1d20]">
        <Navbar />
        <div className="flex items-center justify-center py-32">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#1db954]" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#1a1d20] text-white">
      <Navbar />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
        {error && !song && (
          <p className="text-red-400 text-center">{error}</p>
        )}

        {song && (
          <>
            <div className="bg-gray-800 rounded-xl p-6 sm:p-8 mb-8 border border-gray-700">
              <div className="flex flex-col md:flex-row gap-8">
                {song.albumArt && (
                  <img
                    src={song.albumArt}
                    alt={song.title}
                    className="w-48 h-48 md:w-56 md:h-56 rounded-xl object-cover mx-auto md:mx-0"
                  />
                )}
                <div className="flex-1 text-center md:text-left">
                  <h1 className="text-3xl sm:text-4xl font-bold mb-2">
                    {song.title}
                  </h1>
                  <p className="text-xl text-gray-300 mb-1">{song.artist}</p>
                  <p className="text-gray-500 mb-4">{song.album}</p>
                  {averageRating != null && (
                    <p className="text-[#1db954] font-semibold mb-4">
                      Community score: {averageRating.toFixed(1)}/10
                      <span className="text-gray-500 font-normal">
                        {" "}
                        ({reviews.length} review
                        {reviews.length === 1 ? "" : "s"})
                      </span>
                    </p>
                  )}
                  <div className="bg-gray-700/50 p-4 rounded-xl">
                    {song.audioUrl ? (
                      <audio controls className="w-full" preload="metadata">
                        <source src={song.audioUrl} type="audio/mpeg" />
                      </audio>
                    ) : (
                      <p className="text-gray-400 text-sm">
                        Preview not available
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-gray-800 rounded-xl p-6 sm:p-8 border border-gray-700">
              <div className="flex flex-wrap justify-between items-center gap-4 mb-6">
                <h2 className="text-2xl font-bold">
                  Reviews {reviews.length > 0 && `(${reviews.length})`}
                </h2>
                {user ? (
                  <button
                    type="button"
                    onClick={() => {
                      setIsFormVisible(!isFormVisible);
                      setError("");
                    }}
                    className="px-6 py-2 bg-[#1db954] rounded-lg hover:bg-[#169c46] font-medium transition-colors"
                  >
                    {isFormVisible ? "Cancel" : "Write a review"}
                  </button>
                ) : (
                  <Link
                    href="/login"
                    className="text-[#1db954] hover:underline font-medium"
                  >
                    Sign in to review
                  </Link>
                )}
              </div>

              {error && (
                <div className="bg-red-500/10 border border-red-500/50 text-red-400 p-4 rounded-lg mb-6">
                  {error}
                </div>
              )}

              {isFormVisible && (
                <form onSubmit={handleSubmitReview} className="space-y-6 mb-8">
                  <div>
                    <label className="block mb-2 font-medium text-gray-300">
                      Rating (0–10)
                    </label>
                    <div className="flex items-center gap-4">
                      <input
                        type="range"
                        min="0"
                        max="10"
                        step="1"
                        value={rating}
                        onChange={(e) => setRating(Number(e.target.value))}
                        className="flex-1 accent-[#1db954]"
                      />
                      <span className="text-2xl font-bold w-12 text-center">
                        {rating}
                      </span>
                    </div>
                  </div>
                  <div>
                    <label className="block mb-2 font-medium text-gray-300">
                      Comment
                    </label>
                    <textarea
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                      className="w-full p-4 bg-gray-700 border border-gray-600 rounded-xl text-white focus:ring-2 focus:ring-[#1db954] focus:outline-none"
                      rows={4}
                      placeholder="Share your thoughts..."
                      disabled={isSubmitting}
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-8 py-3 bg-[#1db954] rounded-xl font-medium hover:bg-[#169c46] disabled:opacity-50"
                  >
                    {isSubmitting ? "Submitting..." : "Submit review"}
                  </button>
                </form>
              )}

              <div className="space-y-6 divide-y divide-gray-700">
                {reviews.length === 0 ? (
                  <p className="text-gray-400 text-center py-8">
                    No reviews yet. Be the first!
                  </p>
                ) : (
                  reviews.map((review) => (
                    <article
                      key={`${review.user_id}-${review.song_id}`}
                      className="pt-6 first:pt-0"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium text-white">
                          {review.display_name}
                        </span>
                        <span className="text-[#1db954] font-bold">
                          {review.rating}/10
                        </span>
                      </div>
                      <p className="text-gray-300">{review.review_body}</p>
                      <p className="mt-2 text-sm text-gray-500">
                        {new Date(review.review_date).toLocaleDateString()}
                      </p>
                    </article>
                  ))
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
