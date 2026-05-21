"use client";

import { useState, useEffect } from "react";
import { useUserAuth } from "../_utils/auth";
import { getSongDetails } from "@/services/musicApi";
import { fetchJson, getClientErrorMessage, isUnauthorized } from "@/lib/fetchJson";
import Link from "next/link";
import Image from "next/image";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import StarRating from "@/components/StarRating";
import ErrorAlert from "@/components/ErrorAlert";

export default function ProfilePage() {
  const { user, dbUser, initializing, getIdToken } = useUserAuth();
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
        const token = await getIdToken();
        const data = await fetchJson(`/api/reviews/user/${dbUser.user_id}`, {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        });

        const formatted = await Promise.all(
          data.map(async (review) => {
            try {
              const song = await getSongDetails(review.song_id);
              return { ...review, song, date: review.review_date, body: review.review_body };
            } catch {
              return {
                ...review,
                song: { title: "Unavailable", singers: "—", image_url: null },
                date: review.review_date,
                body: review.review_body,
              };
            }
          })
        );
        setReviews(formatted);
      } catch (err) {
        setError(
          isUnauthorized(err)
            ? "Please sign in again to view your reviews."
            : getClientErrorMessage(err, "Failed to load reviews")
        );
      } finally {
        setLoading(false);
      }
    }

    loadReviews();
  }, [user, dbUser, initializing, getIdToken]);

  if (initializing) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-2 border-accent border-t-transparent" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1 flex items-center justify-center px-4">
          <div className="glass-card p-10 text-center max-w-md animate-slide-up">
            <span className="text-5xl mb-4 block">👤</span>
            <h1 className="text-2xl font-bold mb-2">Your profile awaits</h1>
            <p className="text-gray-400 mb-6">Sign in to see your reviews and stats</p>
            <Link href="/login" className="btn-primary">
              Sign in
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const displayName =
    dbUser?.display_name || user.displayName || user.email?.split("@")[0];
  const avgRating =
    reviews.length > 0
      ? reviews.reduce((s, r) => s + r.rating, 0) / reviews.length
      : null;

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-4xl mx-auto w-full px-4 sm:px-6 py-8 animate-fade-in">
        <div className="glass-card overflow-hidden mb-8">
          <div className="h-24 bg-gradient-to-r from-accent/40 to-purple-900/50" />
          <div className="px-6 sm:px-8 pb-8 -mt-12 flex flex-col sm:flex-row gap-6 items-start sm:items-end">
            <div className="h-24 w-24 rounded-2xl bg-gradient-to-br from-accent to-emerald-600 flex items-center justify-center text-4xl font-bold shadow-xl ring-4 ring-surface">
              {displayName[0]?.toUpperCase()}
            </div>
            <div className="flex-1 pb-2">
              <h1 className="text-3xl font-bold">{displayName}</h1>
              <p className="text-gray-400">{user.email}</p>
              <p className="text-sm text-gray-500 mt-1">
                Member since{" "}
                {new Date(user.metadata?.creationTime).toLocaleDateString()}
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4 mb-10">
          <div className="glass-card p-5 text-center">
            <p className="text-3xl font-bold text-accent">{reviews.length}</p>
            <p className="text-xs text-gray-500 mt-1 uppercase tracking-wide">Reviews</p>
          </div>
          <div className="glass-card p-5 text-center">
            <p className="text-3xl font-bold text-white">
              {avgRating != null ? avgRating.toFixed(1) : "—"}
            </p>
            <p className="text-xs text-gray-500 mt-1 uppercase tracking-wide">Avg score</p>
          </div>
          <div className="glass-card p-5 text-center">
            <p className="text-3xl font-bold text-white">
              {reviews.length > 0
                ? Math.max(...reviews.map((r) => r.rating))
                : "—"}
            </p>
            <p className="text-xs text-gray-500 mt-1 uppercase tracking-wide">Best rating</p>
          </div>
        </div>

        <h2 className="text-xl font-bold mb-4">Your reviews</h2>

        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((n) => (
              <div key={n} className="h-28 rounded-2xl bg-gray-800/50 animate-pulse" />
            ))}
          </div>
        ) : error ? (
          <ErrorAlert message={error} />
        ) : reviews.length === 0 ? (
          <div className="glass-card p-12 text-center">
            <p className="text-4xl mb-3">✍️</p>
            <p className="text-gray-400 mb-4">No reviews yet</p>
            <Link href="/" className="btn-primary">
              Find a song to review
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {reviews.map((review) => (
              <div
                key={`${review.user_id}-${review.song_id}`}
                className="glass-card p-5 hover:border-accent/20 transition-colors group"
              >
                <div className="flex gap-4">
                  {review.song?.image_url && (
                    <Image
                      src={review.song.image_url}
                      alt=""
                      width={72}
                      height={72}
                      className="rounded-xl object-cover ring-1 ring-white/10"
                    />
                  )}
                  <div className="flex-1 min-w-0">
                    <Link
                      href={`/song/${review.song_id}`}
                      className="text-lg font-bold hover:text-accent transition-colors truncate block"
                    >
                      {review.song?.title}
                    </Link>
                    <p className="text-sm text-gray-500">{review.song?.singers}</p>
                    <div className="mt-3 flex flex-wrap items-center gap-4">
                      <StarRating value={review.rating} size="sm" />
                      <span className="text-xs text-gray-500">
                        {new Date(review.date).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="text-gray-300 mt-2 text-sm line-clamp-2">{review.body}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
