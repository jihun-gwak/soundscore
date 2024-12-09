"use client";

import Link from "next/link";
import Image from "next/image";
import SoundScoreLogo from "../Assets/images/SoundScoreLogo.png";

export default function HomePage() {
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
          <Link href="/members" className="hover:text-gray-300">Members</Link>
          <Link href="/lists" className="hover:text-gray-300">Lists</Link>
          <Link href="/pro" className="text-[#0095f6] hover:text-[#0084dd]">Pro</Link>
          <Link href="/signup" className="hover:text-gray-300">Log In</Link>
          <Link 
            href="/signup/signup" 
            className="bg-[#0095f6] px-4 py-2 rounded-md hover:bg-[#0084dd] transition-colors"
          >
            Sign Up
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="max-w-6xl mx-auto px-4 py-20 text-center">
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

        <Link 
          href="/signup"
          className="bg-[#0095f6] px-8 py-4 rounded-lg text-lg font-semibold hover:bg-[#0084dd] transition-colors"
        >
          Join SoundScore for free!
        </Link>

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
