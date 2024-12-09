"use client";

import { useState, useEffect } from "react";
import { useUserAuth } from "../_utils/auth";
import { getSongDetails } from "@/services/musicApi";
import Link from "next/link";
import Image from "next/image";

export default function ProfilePage() {
  const { user } = useUserAuth();
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (user) {
      fetchUserReviews();
    }
  }, [user]);

  const fetchUserReviews = async () => {
    if (!user?.uid) {
      setError("No user found");
      setLoading(false);
      return;
    }

    try {
      // Using the correct API endpoint for user reviews
      const response = await fetch(`/api/reviews/user/${user.uid}`);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      // Process reviews with song details
      const formattedReviews = await Promise.all(
        data.map(async (review) => {
          try {
            const songDetails = await getSongDetails(review.song_id);
            return {
              ...review,
              song: songDetails,
              title: review.review_title, // Match the database column names
              body: review.review_body,
              date: review.review_date,
            };
          } catch (songError) {
            console.warn(
              `Failed to fetch details for song ${review.song_id}:`,
              songError
            );
            return {
              ...review,
              song: {
                title: "Song details unavailable",
                singers: "Unknown Artist",
                image_url: null,
                album: "Unknown Album",
              },
              title: review.review_title,
              body: review.review_body,
              date: review.review_date,
            };
          }
        })
      );

      setReviews(formattedReviews);
    } catch (error) {
      console.error("Error fetching reviews:", error);
      setError("Failed to load reviews. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-[#1a1d20] text-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">
            Please sign in to view your profile
          </h1>
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
          <Link href="/" className="text-xl font-bold">
            SoundScore
          </Link>
        </div>
      </nav>

      <main className="max-w-4xl mx-auto p-4">
        <h1 className="text-3xl font-bold mb-8">Your Reviews</h1>

        {loading ? (
          <div className="flex justify-center items-center h-48">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
          </div>
        ) : error ? (
          <div className="text-center text-red-500 p-4">{error}</div>
        ) : reviews.length === 0 ? (
          <div className="text-center text-gray-400 p-4">
            No reviews yet.
            <Link
              href="/reviews"
              className="text-blue-500 hover:text-blue-400 ml-2"
            >
              Write your first review
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {reviews.map((review) => (
              <div key={review.song_id} className="bg-gray-800 p-6 rounded-lg">
                <div className="flex items-center gap-4">
                  {review.song.image_url && (
                    <Image
                      src={review.song.image_url}
                      alt={review.song.title}
                      width={80}
                      height={80}
                      className="rounded"
                    />
                  )}
                  <div>
                    <h2 className="text-xl font-bold">{review.song.title}</h2>
                    <p className="text-gray-400">{review.song.singers}</p>
                  </div>
                </div>
                <div className="mt-4">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-yellow-500">
                      Rating: {review.rating}/10
                    </span>
                    <span className="text-gray-400">•</span>
                    <span className="text-gray-400">
                      {new Date(review.date).toLocaleDateString()}
                    </span>
                  </div>
                  {review.title && (
                    <h3 className="text-lg font-semibold mb-2">
                      {review.title}
                    </h3>
                  )}
                  <p className="text-gray-300">{review.body}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
