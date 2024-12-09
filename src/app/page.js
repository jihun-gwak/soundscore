"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useUserAuth } from "./_utils/auth";
import SoundScoreLogo from "../Assets/images/SoundScoreLogo.png";

export default function HomePage() {
  const { user, firebaseSignOut } = useUserAuth();

  const handleSignOut = async () => {
    try {
      await firebaseSignOut();
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  return (
    <div className="min-h-screen bg-[#1a1d20] text-white">
      {/* Navigation */}
      <nav className="flex items-center justify-between p-4">
        <div className="flex items-center">
          <Image src={SoundScoreLogo} alt="SoundScore Logo" width={40} height={40} className="rounded-full" />
          <input 
            type="search" 
            placeholder="Search SoundScore..." 
            className="ml-4 px-4 py-2 bg-[#2a2d30] rounded-full text-sm w-64"
          />
        </div>
        <div className="flex items-center space-x-6">
          <Link href="/music" className="hover:text-gray-300">Music</Link>
          <Link href="/reviews" className="hover:text-gray-300">Write a Review</Link>
          
          {user ? (
            <>
              <Link href="/profile" className="hover:text-gray-300 flex items-center space-x-2">
                <div className="w-8 h-8 bg-gray-700 rounded-full flex items-center justify-center">
                  <span className="text-sm">{user.email?.[0].toUpperCase()}</span>
                </div>
                <span>Profile</span>
              </Link>
              <button 
                onClick={handleSignOut}
                className="hover:text-gray-300"
              >
                Sign Out
              </button>
            </>
          ) : (
            <Link 
              href="/signup" 
              className="bg-[#0095f6] px-4 py-2 rounded-md hover:bg-[#0084dd] transition-colors"
            >
              Log In
            </Link>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <main className="max-w-6xl mx-auto px-4 py-20 text-center">
        <div className="flex justify-center mb-8">
          <Image
            src={SoundScoreLogo}
            alt="SoundScore Logo"
            width={120}
            height={120}
            className="rounded-full shadow-lg"
          />
        </div>
        <h1 className="text-5xl font-bold mb-6">
          Review your favorite albums.
          <br />
          Discuss your favorite artists.
          <br />
          Share your passion for music.
        </h1>
        
        <p className="text-gray-400 text-xl mb-12 max-w-3xl mx-auto">
          SoundScore is a social platform that allows you to keep track of all the music
          you listen to and grow your passion for music with friends. Write reviews,
          rate albums, and compile lists in music's fastest growing community.
        </p>

        {user ? (
          <Link 
            href="/profile"
            className="bg-[#0095f6] px-8 py-4 rounded-lg text-lg font-semibold hover:bg-[#0084dd] transition-colors"
          >
            Go to Profile
          </Link>
        ) : (
          <Link 
            href="/signup"
            className="bg-[#0095f6] px-8 py-4 rounded-lg text-lg font-semibold hover:bg-[#0084dd] transition-colors"
          >
            Join SoundScore for free!
          </Link>
        )}

        {/* App Store Links */}
        <div className="mt-20 text-gray-400">
          <p className="mb-4">IMDb for music. Also available on</p>
          <div className="flex justify-center space-x-4">
            <Link href="#" className="opacity-75 hover:opacity-100">
              <Image src="/apple-store.png" alt="App Store" width={24} height={24} />
            </Link>
            <Link href="#" className="opacity-75 hover:opacity-100">
              <Image src="/google-play.png" alt="Google Play" width={24} height={24} />
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
