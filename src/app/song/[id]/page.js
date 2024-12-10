"use client";
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { getSongDetails } from "@/services/musicApi";
import Link from "next/link";
import { useUserAuth } from "@/app/_utils/auth";

export default function SongDetails() {
  const { id } = useParams();
  const [song, setSong] = useState(null);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [reviews, setReviews] = useState([]);
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const { user, dbUser } = useUserAuth();

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
      } catch (error) {
        console.error("Error fetching song details:", error);
        setError("Failed to load song details");
      }
    };

    const fetchReviews = async () => {
      try {
        const response = await fetch(`/api/reviews/song/${id}`);
        if (!response.ok) {
          throw new Error("Failed to fetch reviews");
        }
        const data = await response.json();
        setReviews(data);
      } catch (error) {
        console.error("Error fetching reviews:", error);
        setError("Failed to load reviews");
      }
    };

    fetchSongDetails();
    fetchReviews();
  }, [id]);

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    if (!user || !dbUser) {
      setError("Please sign in to write a review");
      return;
    }

    if (!dbUser.user_id) {
      setError("Unable to submit review. Please try signing in again.");
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
      const reviewData = {
        user_id: parseInt(dbUser.user_id),
        song_id: id,
        title: null,
        rating: rating,
        date: new Date().toISOString().split("T")[0],
        body: comment,
      };

      const response = await fetch("/api/reviews", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(reviewData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to save review");
      }

      // Refresh reviews after successful submission
      const reviewsResponse = await fetch(`/api/reviews/song/${id}`);
      if (!reviewsResponse.ok) {
        throw new Error("Failed to fetch updated reviews");
      }
      const newReviews = await reviewsResponse.json();
      setReviews(newReviews);

      // Reset form
      setComment("");
      setRating(0);
      setIsFormVisible(false);
      setError("");
    } catch (error) {
      console.error("Error submitting review:", error);
      setError(
        error.message || "An unexpected error occurred. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!song) {
    return (
      <div className="min-h-screen bg-[#1a1d20] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#1db954]"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#1a1d20] text-white">
      <nav className="border-b border-gray-800 p-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <Link href="/" className="text-xl font-bold">
            SoundScore
          </Link>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto p-5">
        {/* Song Details Card */}
        <div className="bg-gray-800 rounded-xl shadow-xl p-8 mb-8">
          <div className="flex flex-col md:flex-row gap-8">
            <img
              src={song.albumArt}
              alt={song.title}
              className="w-48 h-48 md:w-64 md:h-64 rounded-xl shadow-lg object-cover hover:scale-105 transition-transform duration-300"
            />
            <div className="flex-1">
              <h1 className="text-4xl font-bold mb-3 text-white">
                {song.title}
              </h1>
              <p className="text-2xl text-gray-300 mb-4">{song.artist}</p>
              <p className="text-lg text-gray-400 mb-6">{song.album}</p>
              <div className="bg-gray-700 p-4 rounded-xl">
                {song.audioUrl ? (
                  <audio
                    controls
                    className="w-full focus:outline-none"
                    preload="auto"
                    onError={(e) =>
                      console.error("Audio error:", e.target.error)
                    }
                  >
                    <source src={song.audioUrl} type="audio/mpeg" />
                    Your browser does not support the audio element.
                  </audio>
                ) : (
                  <p className="text-gray-400 text-center">
                    Preview not available
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Reviews Section */}
        <div className="bg-gray-800 rounded-xl shadow-xl p-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-white">
              Reviews {reviews.length > 0 && `(${reviews.length})`}
            </h2>
            {user ? (
              <button
                onClick={() => {
                  setIsFormVisible(!isFormVisible);
                  setError("");
                }}
                className="px-6 py-2 bg-[#1db954] text-white rounded-xl hover:bg-[#169c46] transition-all duration-200 font-medium"
              >
                {isFormVisible ? "Cancel Review" : "Write a Review"}
              </button>
            ) : (
              <p className="text-gray-400">Sign in to write a review</p>
            )}
          </div>

          {error && (
            <div className="bg-red-500/10 border border-red-500/50 text-red-500 p-4 rounded-xl mb-6">
              {error}
            </div>
          )}

          {isFormVisible && (
            <form onSubmit={handleSubmitReview} className="space-y-6 mb-8">
              <div>
                <label className="block mb-3 text-lg font-medium text-gray-300">
                  Rating (0-10)
                </label>
                <div className="flex flex-col gap-2">
                  <div className="flex items-center gap-4">
                    <div className="flex-1 h-3 bg-gray-700 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-[#1db954] transition-all duration-200"
                        style={{ width: `${(rating / 10) * 100}%` }}
                      />
                    </div>
                    <span className="text-2xl font-bold text-white min-w-[3rem] text-center">
                      {rating}
                    </span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="10"
                    step="1"
                    value={rating}
                    onChange={(e) => setRating(Number(e.target.value))}
                    className="w-full accent-[#1db954] cursor-pointer"
                  />
                </div>
              </div>
              <div>
                <label className="block mb-3 text-lg font-medium text-gray-300">
                  Comment
                </label>
                <textarea
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  className="w-full p-4 bg-gray-700 border border-gray-600 rounded-xl text-white focus:ring-2 focus:ring-[#1db954] focus:border-transparent transition-all duration-200"
                  rows="4"
                  placeholder="Share your thoughts about this song..."
                  disabled={isSubmitting}
                />
              </div>
              <button
                type="submit"
                className={`px-8 py-3 bg-[#1db954] text-white rounded-xl hover:bg-[#169c46] transition-all duration-200 font-medium text-lg shadow-md hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed`}
                disabled={isSubmitting}
              >
                {isSubmitting ? "Submitting..." : "Submit Review"}
              </button>
            </form>
          )}

          {/* Reviews List */}
          <div className="space-y-6 divide-y divide-gray-700">
            {reviews.length === 0 ? (
              <p className="text-gray-400 text-center py-8">
                No reviews yet. Be the first to review this song!
              </p>
            ) : (
              reviews.map((review) => (
                <div
                  key={`${review.user_id}-${review.song_id}`}
                  className="pt-6"
                >
                  <div className="flex items-center mb-2">
                    <span className="text-gray-400 mr-2">Rating:</span>
                    <div className="flex items-center">
                      <div className="flex-1 max-w-[200px] h-2 bg-gray-700 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-[#1db954]"
                          style={{ width: `${(review.rating / 10) * 100}%` }}
                        />
                      </div>
                      <span className="text-lg font-bold text-white">
                        {review.rating}/10
                      </span>
                    </div>
                  </div>
                  <p className="text-gray-300">{review.review_body}</p>
                  <div className="mt-2 text-sm text-gray-500">
                    By
                    {new Date(review.review_date).toLocaleDateString()}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
