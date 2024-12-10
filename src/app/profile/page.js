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
  const [userProfile, setUserProfile] = useState({
    displayName: "",
    joinDate: "",
    reviewCount: 0,
  });

  useEffect(() => {
    if (user) {
      setUserProfile((prev) => ({
        ...prev,
        displayName:
          user.displayName || user.email?.split("@")[0] || "Music Lover",
        joinDate: new Date(user.metadata?.creationTime).toLocaleDateString(),
      }));
    }
  }, [user]);

  const fetchUserReviews = async () => {
    if (!user?.uid) {
      setError("No user found");
      setLoading(false);
      return;
    }

    try {
      const neonUser = await fetch(
        `/api/users/email/${encodeURIComponent(user.email)}`
      );
      const neonUserData = await neonUser.json();
      const response = await fetch(`/api/reviews/user/${neonUserData.user_id}`);
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
              title: review.review_title,
              body: review.review_body,
              date: review.review_date,
              rating: review.rating,
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
              rating: review.rating,
            };
          }
        })
      );

      setReviews(formattedReviews);
      setUserProfile((prev) => ({
        ...prev,
        reviewCount: formattedReviews.length,
      }));
    } catch (error) {
      console.error("Error fetching reviews:", error);
      setError("Failed to load reviews. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchUserReviews();
    }
  }, [user]);

  const formatDate = (dateString) => {
    try {
      return new Date(dateString).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    } catch (e) {
      return dateString;
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-[#1a1d20] text-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">
            Please sign in to view your profile
          </h1>
          <Link
            href="/login/signup"
            className="text-[#1db954] hover:text-[#1aa34a]"
          >
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
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">
            {userProfile.displayName}'s Profile
          </h1>
          <p className="text-gray-400">Member since {userProfile.joinDate}</p>
          <p className="text-gray-400">
            {userProfile.reviewCount} reviews written
          </p>
        </div>

        <h2 className="text-2xl font-bold mb-6">Your Reviews</h2>

        {loading ? (
          <div className="flex justify-center items-center h-48">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
          </div>
        ) : error ? (
          <div className="text-center text-red-500 p-4">{error}</div>
        ) : reviews.length === 0 ? (
          <div className="bg-gray-800 rounded-lg p-8 text-center">
            <h3 className="text-xl font-semibold mb-4">No Reviews Yet</h3>
            <p className="text-gray-400 mb-6">
              Start sharing your thoughts on your favorite music!
            </p>
            <Link
              href="/home"
              className="inline-block bg-[#1db954] px-6 py-3 rounded-lg text-white font-semibold hover:bg-[#1aa34a] transition-colors"
            >
              Find Songs to Review
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {reviews.map((review) => (
              <div key={review.id} className="bg-gray-800 p-6 rounded-lg">
                <div className="flex items-center gap-4">
                  {review.song?.image_url && (
                    <Image
                      src={review.song.image_url}
                      alt={review.song.title}
                      width={80}
                      height={80}
                      className="rounded"
                    />
                  )}
                  <div>
                    <h3 className="text-xl font-bold">{review.song?.title}</h3>
                    <p className="text-gray-400">{review.song?.singers}</p>
                  </div>
                </div>
                <div className="mt-4">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-yellow-500">
                      Rating: {review.rating}/10
                    </span>
                    <span className="text-gray-400">•</span>
                    <span className="text-gray-400">
                      {formatDate(review.date)}
                    </span>
                  </div>
                  {review.title && (
                    <h4 className="text-lg font-semibold mb-2">
                      {review.title}
                    </h4>
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
