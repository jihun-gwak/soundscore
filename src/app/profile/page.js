"use client";

import { useState, useEffect } from "react";
import { useUserAuth } from "../_utils/auth";
import Image from "next/image";
import Link from "next/link";

export default function ProfilePage() {
  const { user } = useUserAuth();
  const [userProfile, setUserProfile] = useState({
    displayName: "",
    bio: "Music enthusiast and avid listener",
    joinDate: "",
    totalReviews: 0,
    favoriteGenres: ["Rock", "Jazz", "Electronic"],
  });

  const [reviews, setReviews] = useState([
    // Placeholder reviews until we implement the backend
    {
      id: 1,
      albumName: "Random Access Memories",
      artist: "Daft Punk",
      rating: 4.5,
      reviewText: "A masterpiece of electronic music that seamlessly blends retro and modern sounds.",
      date: "2023-12-01",
      likes: 42,
    },
    {
      id: 2,
      albumName: "Kind of Blue",
      artist: "Miles Davis",
      rating: 5,
      reviewText: "The definitive jazz album. Every note is perfectly placed.",
      date: "2023-11-15",
      likes: 38,
    },
  ]);

  useEffect(() => {
    if (user) {
      // Update profile with user data
      setUserProfile(prev => ({
        ...prev,
        displayName: user.email?.split('@')[0] || 'Music Lover',
        joinDate: new Date(user.metadata?.creationTime).toLocaleDateString(),
      }));

      // Here you would typically fetch the user's reviews from your backend
      // For now we'll use the placeholder reviews
    }
  }, [user]);

  if (!user) {
    return (
      <div className="min-h-screen bg-[#1a1d20] text-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Please sign in to view your profile</h1>
          <Link href="/signup" className="text-blue-500 hover:text-blue-400">
            Sign In
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#1a1d20] text-white">
      {/* Header/Navigation */}
      <nav className="border-b border-gray-800 p-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <Link href="/" className="text-xl font-bold">SoundScore</Link>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Profile Header */}
        <div className="bg-gray-800 rounded-lg p-6 mb-8">
          <div className="flex items-start gap-6">
            <div className="w-32 h-32 bg-gray-700 rounded-full flex items-center justify-center">
              <span className="text-4xl">{userProfile.displayName[0]?.toUpperCase()}</span>
            </div>
            <div className="flex-1">
              <h1 className="text-3xl font-bold mb-2">{userProfile.displayName}</h1>
              <p className="text-gray-400 mb-4">{userProfile.bio}</p>
              <div className="flex gap-4 text-sm text-gray-400">
                <span>Joined {userProfile.joinDate}</span>
                <span>•</span>
                <span>{reviews.length} Reviews</span>
              </div>
              <div className="mt-4">
                <h3 className="text-sm text-gray-400 mb-2">Favorite Genres</h3>
                <div className="flex gap-2">
                  {userProfile.favoriteGenres.map((genre) => (
                    <span
                      key={genre}
                      className="px-3 py-1 bg-gray-700 rounded-full text-sm"
                    >
                      {genre}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Reviews Section */}
        <div>
          <h2 className="text-2xl font-bold mb-6">Reviews</h2>
          <div className="grid gap-6">
            {reviews.map((review) => (
              <div key={review.id} className="bg-gray-800 rounded-lg p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-xl font-semibold">{review.albumName}</h3>
                    <p className="text-gray-400">{review.artist}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-yellow-400">★</span>
                    <span>{review.rating.toFixed(1)}</span>
                  </div>
                </div>
                <p className="text-gray-300 mb-4">{review.reviewText}</p>
                <div className="flex justify-between items-center text-sm text-gray-400">
                  <span>{review.date}</span>
                  <div className="flex items-center gap-2">
                    <button className="flex items-center gap-1 hover:text-white transition-colors">
                      <span>♥</span>
                      <span>{review.likes}</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}