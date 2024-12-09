"use client";
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { getSongDetails } from "@/services/musicApi";

export default function SongDetails() {
  const { id } = useParams();
  const [song, setSong] = useState(null);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    const fetchSongDetails = async () => {
      try {
        const songData = await getSongDetails(id);
        console.log("Preview URL:", songData.audio_url);
        setSong({
          title: songData.title,
          artist: songData.singers,
          albumArt: songData.image_url,
          album: songData.album,
          audioUrl: songData.audio_url,
        });
      } catch (error) {
        console.error("Error fetching song details:", error);
      }
    };

    fetchSongDetails();
  }, [id]);

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`/api/reviews/user/${id}/song/${id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ rating, comment }),
      });

      if (response.ok) {
        // Refresh reviews
        const newReviews = await fetch(`/api/reviews/song/${id}`).then((res) =>
          res.json()
        );
        setReviews(newReviews);
        setComment("");
        setRating(0);
      }
    } catch (error) {
      console.error("Error submitting review:", error);
    }
  };

  if (!song)
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#1db954]"></div>
      </div>
    );

  return (
    <div className="max-w-4xl mx-auto p-5 min-h-screen bg-gray-50">
      <div className="bg-white rounded-xl shadow-xl p-8 mb-8 hover:shadow-2xl transition-shadow duration-300">
        <div className="flex flex-col md:flex-row gap-8">
          <img
            src={song.albumArt}
            alt={song.title}
            className="w-48 h-48 md:w-64 md:h-64 rounded-xl shadow-lg object-cover hover:scale-105 transition-transform duration-300"
          />
          <div className="flex-1">
            <h1 className="text-4xl font-bold mb-3 text-gray-800">
              {song.title}
            </h1>
            <p className="text-2xl text-gray-600 mb-4">{song.artist}</p>
            <p className="text-lg text-gray-500 mb-6">{song.album}</p>
            <div className="bg-gray-100 p-4 rounded-xl">
              {song.audioUrl ? (
                <audio
                  controls
                  className="w-full focus:outline-none"
                  preload="auto"
                  onError={(e) => console.error("Audio error:", e.target.error)}
                >
                  <source src={song.audioUrl} type="audio/mpeg" />
                  Your browser does not support the audio element.
                </audio>
              ) : (
                <p className="text-gray-500 text-center">
                  Preview not available
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Review Form */}
      <div className="bg-white rounded-xl shadow-xl p-8 mb-8">
        <h2 className="text-2xl font-bold mb-6 text-gray-800">
          Write a Review
        </h2>
        <form onSubmit={handleSubmitReview} className="space-y-6">
          <div>
            <label className="block mb-3 text-lg font-medium text-gray-700">
              Rating
            </label>
            <div className="flex gap-3">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  className={`text-3xl transition-colors duration-200 hover:scale-110 ${
                    star <= rating ? "text-yellow-400" : "text-gray-300"
                  }`}
                >
                  ★
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="block mb-3 text-lg font-medium text-gray-700">
              Comment
            </label>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className="w-full p-4 border rounded-xl focus:ring-2 focus:ring-[#1db954] focus:border-transparent transition-all duration-200"
              rows="4"
              placeholder="Share your thoughts about this song..."
            />
          </div>
          <button
            type="submit"
            className="px-8 py-3 bg-[#1db954] text-white rounded-xl hover:bg-[#169c46] transition-all duration-200 font-medium text-lg shadow-md hover:shadow-xl"
          >
            Submit Review
          </button>
        </form>
      </div>

      {/* Reviews List */}
      <div className="bg-white rounded-xl shadow-xl p-8">
        <h2 className="text-2xl font-bold mb-6 text-gray-800">Reviews</h2>
        <div className="space-y-6">
          {reviews.map((review) => (
            <div key={review.id} className="border-b pb-6 last:border-b-0">
              <div className="flex items-center gap-2 mb-3">
                {[1, 2, 3, 4, 5].map((star) => (
                  <span
                    key={star}
                    className={`text-2xl ${
                      star <= review.rating
                        ? "text-yellow-400"
                        : "text-gray-300"
                    }`}
                  >
                    ★
                  </span>
                ))}
              </div>
              <p className="text-gray-700 text-lg">{review.comment}</p>
              <p className="text-sm text-gray-500 mt-3 font-medium">
                By {review.user} • {new Date(review.date).toLocaleDateString()}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
