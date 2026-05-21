"use client";

import { useState, useEffect } from "react";
import { useUserAuth } from "../_utils/auth";
import { getSongDetails } from "@/services/musicApi";
import Link from "next/link";
import Image from "next/image";
import Navbar from "@/components/Navbar";

export default function ProfilePage() {
  const { user, dbUser, initializing } = useUserAuth();
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (initializing) return;

    if (!user) {
      setLoading(false);
      return;
    }

    if (!dbUser?.user_id) {
      setError("Account sync failed. Try signing out and back in.");
      setLoading(false);
      return;
    }

    async function loadReviews() {
      setLoading(true);
      setError("");
      try {
        const response = await fetch(`/api/reviews/user/${dbUser.user_id}`);
        if (!response.ok) {
          throw new Error("Failed to load reviews");
        }
        const data = await response.json();

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
            } catch {
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
      } catch (err) {
        console.error("Error fetching reviews:", err);
        setError("Failed to load reviews. Please try again later.");
      } finally {
        setLoading(false);
      }
    }

    loadReviews();
  }, [user, dbUser, initializing]);

  const formatDate = (dateString) => {
    try {
      return new Date(dateString).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    } catch {
      return dateString;
    }
  };

  if (initializing) {
    return (
      <div className="min-h-screen bg-[#1a1d20] flex items-center justify-center">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-[#1db954]" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-[#1a1d20] text-white">
        <Navbar />
        <div className="flex items-center justify-center py-32 text-center px-4">
          <div>
            <h1 className="text-2xl font-bold mb-4">
              Please sign in to view your profile
            </h1>
            <Link
              href="/login"
              className="text-[#1db954] hover:underline font-medium"
            >
              Sign in
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const displayName =
    dbUser?.display_name ||
    user.displayName ||
    user.email?.split("@")[0] ||
    "Music Lover";

  return (
    <div className="min-h-screen bg-[#1a1d20] text-white">
      <Navbar />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">{displayName}&apos;s Profile</h1>
          <p className="text-gray-400">{user.email}</p>
          <p className="text-gray-400">
            Member since{" "}
            {new Date(user.metadata?.creationTime).toLocaleDateString()}
          </p>
          <p className="text-gray-400 mt-1">
            {reviews.length} review{reviews.length === 1 ? "" : "s"} written
          </p>
        </div>

        <h2 className="text-2xl font-bold mb-6">Your Reviews</h2>

        {loading ? (
          <div className="flex justify-center items-center h-48">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#1db954]" />
          </div>
        ) : error ? (
          <div className="text-center text-red-400 p-4">{error}</div>
        ) : reviews.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-400 mb-4">
              You haven&apos;t written any reviews yet.
            </p>
            <Link
              href="/"
              className="text-[#1db954] hover:underline font-medium"
            >
              Search for a song to review
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {reviews.map((review) => (
              <div
                key={`${review.user_id}-${review.song_id}`}
                className="bg-gray-800 p-6 rounded-lg border border-gray-700"
              >
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
                    <Link
                      href={`/song/${review.song_id}`}
                      className="text-xl font-bold hover:text-[#1db954] transition-colors"
                    >
                      {review.song?.title}
                    </Link>
                    <p className="text-gray-400">{review.song?.singers}</p>
                  </div>
                </div>
                <div className="mt-4">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-[#1db954] font-medium">
                      {review.rating}/10
                    </span>
                    <span className="text-gray-500">•</span>
                    <span className="text-gray-400">
                      {formatDate(review.date)}
                    </span>
                  </div>
                  {review.title && (
                    <h4 className="text-lg font-semibold mb-2">{review.title}</h4>
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
