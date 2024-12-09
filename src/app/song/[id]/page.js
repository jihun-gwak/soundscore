"use client";
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";

export default function SongDetails() {
  const { id } = useParams();
  const [song, setSong] = useState(null);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    // Fetch song details and reviews
    const fetchSongDetails = async () => {
      try {
        // Replace with actual API calls
        const songResponse = await fetch(`/api/songs/${id}`);
        const songData = await songResponse.json();
        setSong(songData);

        const reviewsResponse = await fetch(`/api/songs/${id}/reviews`);
        const reviewsData = await reviewsResponse.json();
        setReviews(reviewsData);
      } catch (error) {
        console.error("Error fetching song details:", error);
      }
    };

    fetchSongDetails();
  }, [id]);

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`/api/songs/${id}/reviews`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ rating, comment }),
      });

      if (response.ok) {
        // Refresh reviews
        const newReviews = await fetch(`/api/songs/${id}/reviews`).then((res) =>
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

  if (!song) return <div className="p-8">Loading...</div>;

  return (
    <div className="max-w-4xl mx-auto p-5">
      <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
        <div className="flex gap-6">
          <img
            src={song.albumArt}
            alt={song.title}
            className="w-48 h-48 rounded-lg"
          />
          <div>
            <h1 className="text-3xl font-bold mb-2">{song.title}</h1>
            <p className="text-xl text-gray-600 mb-4">{song.artist}</p>
            <p className="text-gray-500">{song.album}</p>
          </div>
        </div>
      </div>

      {/* Review Form */}
      <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
        <h2 className="text-2xl font-bold mb-4">Write a Review</h2>
        <form onSubmit={handleSubmitReview}>
          <div className="mb-4">
            <label className="block mb-2">Rating</label>
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  className={`text-2xl ${
                    star <= rating ? "text-yellow-400" : "text-gray-300"
                  }`}
                >
                  ★
                </button>
              ))}
            </div>
          </div>
          <div className="mb-4">
            <label className="block mb-2">Comment</label>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className="w-full p-2 border rounded-lg"
              rows="4"
            />
          </div>
          <button
            type="submit"
            className="px-6 py-2 bg-[#1db954] text-white rounded-full hover:bg-[#169c46] transition-colors"
          >
            Submit Review
          </button>
        </form>
      </div>

      {/* Reviews List */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-2xl font-bold mb-4">Reviews</h2>
        <div className="space-y-4">
          {reviews.map((review) => (
            <div key={review.id} className="border-b pb-4">
              <div className="flex items-center gap-2 mb-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <span
                    key={star}
                    className={`text-xl ${
                      star <= review.rating
                        ? "text-yellow-400"
                        : "text-gray-300"
                    }`}
                  >
                    ★
                  </span>
                ))}
              </div>
              <p className="text-gray-700">{review.comment}</p>
              <p className="text-sm text-gray-500 mt-2">
                By {review.user} on {new Date(review.date).toLocaleDateString()}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
