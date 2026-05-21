"use client";

import { useState, useEffect, useMemo } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { getSongDetails, getSongReviews } from "@/services/musicApi";
import { fetchJson, getClientErrorMessage, isUnauthorized } from "@/lib/fetchJson";
import { useUserAuth } from "@/app/_utils/auth";
import { useToast } from "@/components/Toast";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import StarRating from "@/components/StarRating";
import ScoreBadge from "@/components/ScoreBadge";
import ErrorAlert from "@/components/ErrorAlert";

export default function SongDetails() {
  const { id } = useParams();
  const { user, dbUser, initializing, getIdToken } = useUserAuth();
  const { showToast } = useToast();

  const [song, setSong] = useState(null);
  const [songLoading, setSongLoading] = useState(true);
  const [songError, setSongError] = useState("");

  const [reviews, setReviews] = useState([]);
  const [averageRating, setAverageRating] = useState(null);
  const [reviewsLoading, setReviewsLoading] = useState(true);
  const [reviewsError, setReviewsError] = useState("");
  const [sortBy, setSortBy] = useState("newest");

  const [rating, setRating] = useState(7);
  const [comment, setComment] = useState("");
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState("");

  const myReview = useMemo(
    () => reviews.find((r) => r.user_id === dbUser?.user_id),
    [reviews, dbUser]
  );

  const sortedReviews = useMemo(() => {
    const list = [...reviews];
    if (sortBy === "highest") return list.sort((a, b) => b.rating - a.rating);
    if (sortBy === "lowest") return list.sort((a, b) => a.rating - b.rating);
    return list.sort(
      (a, b) => new Date(b.review_date) - new Date(a.review_date)
    );
  }, [reviews, sortBy]);

  const loadReviews = async () => {
    setReviewsLoading(true);
    setReviewsError("");
    try {
      const data = await getSongReviews(id);
      setReviews(data.reviews ?? []);
      setAverageRating(data.averageRating);
    } catch (err) {
      setReviewsError(getClientErrorMessage(err, "Could not load reviews"));
      setReviews([]);
    } finally {
      setReviewsLoading(false);
    }
  };

  useEffect(() => {
    setSongLoading(true);
    setSongError("");
    getSongDetails(id)
      .then((data) =>
        setSong({
          title: data.title,
          artist: data.singers,
          albumArt: data.image_url,
          album: data.album,
          audioUrl: data.audio_url,
        })
      )
      .catch((err) => setSongError(getClientErrorMessage(err)))
      .finally(() => setSongLoading(false));

    loadReviews();
  }, [id]);

  useEffect(() => {
    if (myReview && !isFormVisible) {
      setRating(myReview.rating);
      setComment(myReview.review_body || "");
    }
  }, [myReview, isFormVisible]);

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    setFormError("");

    if (!user) {
      setFormError("Sign in to write a review");
      return;
    }
    if (!dbUser?.user_id) {
      setFormError("Account syncing — try again in a moment");
      return;
    }
    if (!comment.trim()) {
      setFormError("Please write a comment");
      return;
    }

    setIsSubmitting(true);
    try {
      const token = await getIdToken();
      if (!token) throw new Error("Session expired. Please sign in again.");

      await fetchJson("/api/reviews", {
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
          body: comment.trim(),
        }),
      });

      showToast(myReview ? "Review updated!" : "Review posted!");
      setIsFormVisible(false);
      await loadReviews();
    } catch (err) {
      const msg = getClientErrorMessage(err);
      setFormError(isUnauthorized(err) ? "Please sign in to review" : msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteReview = async () => {
    if (!dbUser?.user_id || !confirm("Delete your review?")) return;
    try {
      const token = await getIdToken();
      await fetchJson(
        `/api/reviews/user/${dbUser.user_id}/song/${id}`,
        { method: "DELETE", headers: { Authorization: `Bearer ${token}` } }
      );
      showToast("Review deleted");
      setComment("");
      setRating(7);
      setIsFormVisible(false);
      await loadReviews();
    } catch (err) {
      showToast(getClientErrorMessage(err), "error");
    }
  };

  if (songLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <div className="animate-spin rounded-full h-14 w-14 border-2 border-accent border-t-transparent" />
        </div>
      </div>
    );
  }

  if (songError && !song) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1 flex items-center justify-center px-4">
          <ErrorAlert
            title="Could not load song"
            message={songError}
            onRetry={() => window.location.reload()}
          />
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-4xl mx-auto w-full px-4 sm:px-6 py-8 animate-fade-in">
        <div className="glass-card overflow-hidden mb-8">
          <div className="relative h-32 sm:h-40 bg-gradient-to-r from-accent/30 via-purple-900/40 to-surface" />
          <div className="relative px-6 sm:px-8 pb-8 -mt-16 sm:-mt-20">
            <div className="flex flex-col sm:flex-row gap-6 items-start">
              {song.albumArt && (
                <img
                  src={song.albumArt}
                  alt={song.title}
                  className="w-36 h-36 sm:w-44 sm:h-44 rounded-2xl object-cover shadow-2xl ring-4 ring-surface"
                />
              )}
              <div className="flex-1 pt-2 sm:pt-16">
                <h1 className="text-3xl sm:text-4xl font-bold mb-1">{song.title}</h1>
                <p className="text-xl text-gray-300">{song.artist}</p>
                <p className="text-gray-500 mt-1">{song.album}</p>
                {song.audioUrl && (
                  <audio controls className="w-full mt-4 max-w-md" preload="metadata">
                    <source src={song.audioUrl} type="audio/mpeg" />
                  </audio>
                )}
              </div>
              {averageRating != null && (
                <div className="sm:pt-16">
                  <ScoreBadge score={averageRating} count={reviews.length} size="lg" />
                </div>
              )}
            </div>
          </div>
        </div>

        <section className="glass-card p-6 sm:p-8">
          <div className="flex flex-wrap justify-between items-center gap-4 mb-6">
            <div>
              <h2 className="text-2xl font-bold">Reviews</h2>
              <p className="text-gray-500 text-sm">
                {reviewsLoading ? "Loading..." : `${reviews.length} total`}
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              {reviews.length > 0 && (
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="input-field py-2 text-sm w-auto"
                >
                  <option value="newest">Newest first</option>
                  <option value="highest">Highest rated</option>
                  <option value="lowest">Lowest rated</option>
                </select>
              )}
              {!initializing && user ? (
                <button
                  type="button"
                  onClick={() => {
                    setIsFormVisible(!isFormVisible);
                    setFormError("");
                  }}
                  className="btn-primary py-2"
                >
                  {isFormVisible ? "Cancel" : myReview ? "Edit review" : "Write review"}
                </button>
              ) : (
                <Link href="/login" className="btn-primary py-2 text-sm">
                  Sign in to review
                </Link>
              )}
            </div>
          </div>

          {reviewsError && (
            <ErrorAlert
              message={reviewsError}
              variant="warning"
              onRetry={loadReviews}
              className="mb-6"
            />
          )}

          {formError && (
            <ErrorAlert message={formError} className="mb-6" />
          )}

          {isFormVisible && user && (
            <form
              onSubmit={handleSubmitReview}
              className="mb-8 p-6 rounded-2xl bg-surface-overlay/50 border border-accent/20 space-y-5"
            >
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-3">
                  Your score
                </label>
                <div className="flex items-center gap-4">
                  <input
                    type="range"
                    min="0"
                    max="10"
                    step="1"
                    value={rating}
                    onChange={(e) => setRating(Number(e.target.value))}
                    className="flex-1 accent-accent h-2"
                  />
                  <span className="text-3xl font-bold text-accent w-12 text-center tabular-nums">
                    {rating}
                  </span>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Your review
                </label>
                <textarea
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  className="input-field min-h-[120px] resize-y"
                  placeholder="What did you think of this track?"
                  disabled={isSubmitting}
                  maxLength={2000}
                />
                <p className="text-xs text-gray-500 mt-1 text-right">
                  {comment.length}/2000
                </p>
              </div>
              <div className="flex flex-wrap gap-3">
                <button type="submit" disabled={isSubmitting} className="btn-primary">
                  {isSubmitting ? "Saving..." : myReview ? "Update review" : "Post review"}
                </button>
                {myReview && (
                  <button
                    type="button"
                    onClick={handleDeleteReview}
                    className="btn-ghost text-red-400 hover:text-red-300"
                  >
                    Delete review
                  </button>
                )}
              </div>
            </form>
          )}

          {reviewsLoading ? (
            <div className="space-y-4">
              {[1, 2, 3].map((n) => (
                <div key={n} className="h-24 rounded-xl bg-gray-800/50 animate-pulse" />
              ))}
            </div>
          ) : sortedReviews.length === 0 ? (
            <div className="text-center py-16 text-gray-500">
              <p className="text-4xl mb-3">🎧</p>
              <p>No reviews yet — be the first!</p>
            </div>
          ) : (
            <div className="space-y-4">
              {sortedReviews.map((review) => {
                const isMine = review.user_id === dbUser?.user_id;
                return (
                  <article
                    key={`${review.user_id}-${review.song_id}`}
                    className={`p-5 rounded-2xl border transition-colors ${
                      isMine
                        ? "bg-accent/5 border-accent/30"
                        : "bg-surface-overlay/30 border-white/5 hover:border-white/10"
                    }`}
                  >
                    <div className="flex flex-wrap justify-between gap-3 mb-3">
                      <div className="flex items-center gap-3">
                        <span className="h-10 w-10 rounded-full bg-gradient-to-br from-gray-600 to-gray-800 flex items-center justify-center font-bold text-sm">
                          {review.display_name?.[0]?.toUpperCase() || "?"}
                        </span>
                        <div>
                          <p className="font-semibold">
                            {review.display_name}
                            {isMine && (
                              <span className="ml-2 text-xs text-accent font-normal">
                                (you)
                              </span>
                            )}
                          </p>
                          <p className="text-xs text-gray-500">
                            {new Date(review.review_date).toLocaleDateString(undefined, {
                              year: "numeric",
                              month: "short",
                              day: "numeric",
                            })}
                          </p>
                        </div>
                      </div>
                      <StarRating value={review.rating} size="sm" />
                    </div>
                    <p className="text-gray-300 leading-relaxed">{review.review_body}</p>
                  </article>
                );
              })}
            </div>
          )}
        </section>
      </main>

      <Footer />
    </div>
  );
}
