"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SongCard from "@/components/SongCard";
import SkeletonGrid from "@/components/SkeletonGrid";
import { getChartTracks } from "@/services/musicApi";
import { getClientErrorMessage } from "@/lib/fetchJson";

const QUICK_SEARCHES = ["Daft Punk", "Taylor Swift", "Drake", "BTS", "The Weeknd"];

export default function HomePage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [chart, setChart] = useState([]);
  const [chartLoading, setChartLoading] = useState(true);
  const [chartError, setChartError] = useState("");
  const router = useRouter();

  useEffect(() => {
    getChartTracks(9)
      .then(setChart)
      .catch((err) => setChartError(getClientErrorMessage(err)))
      .finally(() => setChartLoading(false));
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 py-8">
        <header className="relative overflow-hidden rounded-3xl mb-12 border border-white/5 animate-fade-in">
          <div className="absolute inset-0 bg-gradient-to-br from-accent/20 via-transparent to-purple-900/20" />
          <div className="absolute top-0 right-0 w-96 h-96 bg-accent/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 animate-pulse-glow" />
          <div className="relative px-6 sm:px-12 py-16 sm:py-24 text-center">
            <p className="text-accent text-sm font-semibold uppercase tracking-widest mb-4">
              Discover · Rate · Review
            </p>
            <h1 className="text-4xl sm:text-6xl font-bold mb-4 tracking-tight bg-gradient-to-r from-white via-white to-gray-400 bg-clip-text text-transparent">
              Your music, scored
            </h1>
            <p className="text-lg text-gray-400 max-w-xl mx-auto mb-10">
              Search millions of tracks, listen to previews, and share what you think with the community.
            </p>

            <form onSubmit={handleSearch} className="max-w-2xl mx-auto">
              <div className="flex flex-col sm:flex-row gap-3 p-2 rounded-2xl bg-black/30 border border-white/10 backdrop-blur-sm">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search songs, artists, albums..."
                  className="flex-1 px-5 py-4 rounded-xl bg-transparent text-white placeholder-gray-500 focus:outline-none text-lg"
                />
                <button type="submit" className="btn-primary rounded-xl sm:px-10">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                  Search
                </button>
              </div>
            </form>

            <div className="flex flex-wrap justify-center gap-2 mt-6">
              {QUICK_SEARCHES.map((term) => (
                <button
                  key={term}
                  type="button"
                  onClick={() => router.push(`/search?q=${encodeURIComponent(term)}`)}
                  className="px-4 py-1.5 rounded-full text-sm bg-white/5 border border-white/10 text-gray-400 hover:text-accent hover:border-accent/30 transition-colors"
                >
                  {term}
                </button>
              ))}
            </div>
          </div>
        </header>

        <section className="mb-14 animate-slide-up">
          <div className="flex items-end justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold">Trending now</h2>
              <p className="text-gray-500 text-sm mt-1">Top tracks on Deezer — tap to rate</p>
            </div>
            <Link href="/search" className="text-sm text-accent hover:underline font-medium">
              Explore all →
            </Link>
          </div>

          {chartLoading && <SkeletonGrid count={6} />}
          {chartError && (
            <p className="text-gray-500 text-center py-8">{chartError}</p>
          )}
          {!chartLoading && !chartError && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {chart.map((track, i) => (
                <div key={track.id} className="relative" style={{ animationDelay: `${i * 50}ms` }}>
                  <span className="absolute -top-2 -left-2 z-10 w-7 h-7 rounded-lg bg-accent/90 text-xs font-bold flex items-center justify-center shadow-lg">
                    {i + 1}
                  </span>
                  <SongCard song={track} />
                </div>
              ))}
            </div>
          )}
        </section>

        <section className="grid sm:grid-cols-3 gap-6 mb-12">
          {[
            { icon: "🔍", title: "Search", desc: "Millions of tracks via Deezer" },
            { icon: "⭐", title: "Rate 0–10", desc: "Score with written reviews" },
            { icon: "👥", title: "Community", desc: "See what others think" },
          ].map((item) => (
            <div
              key={item.title}
              className="glass-card p-6 text-center hover:border-accent/20 transition-colors group"
            >
              <span className="text-4xl mb-3 block group-hover:scale-110 transition-transform">
                {item.icon}
              </span>
              <h3 className="font-bold text-lg mb-1">{item.title}</h3>
              <p className="text-gray-500 text-sm">{item.desc}</p>
            </div>
          ))}
        </section>
      </main>

      <Footer />
    </div>
  );
}
