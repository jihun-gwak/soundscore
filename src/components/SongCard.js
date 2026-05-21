"use client";

import Link from "next/link";

export default function SongCard({ song, onClick, asLink = true }) {
  const content = (
    <>
      <div className="relative shrink-0">
        {song.image_url ? (
          <img
            src={song.image_url}
            alt=""
            className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl object-cover ring-1 ring-white/10 group-hover:ring-accent/40 transition-all"
          />
        ) : (
          <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl bg-surface-overlay flex items-center justify-center text-2xl">
            🎵
          </div>
        )}
        <div className="absolute inset-0 rounded-xl bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
          <span className="text-white text-xs font-semibold">View</span>
        </div>
      </div>
      <div className="min-w-0 flex-1">
        <h3 className="font-semibold text-white truncate group-hover:text-accent transition-colors">
          {song.title}
        </h3>
        <p className="text-sm text-gray-400 truncate">{song.singers}</p>
        {song.album && (
          <p className="text-xs text-gray-500 truncate mt-0.5">{song.album}</p>
        )}
      </div>
      <svg
        className="w-5 h-5 text-gray-600 group-hover:text-accent shrink-0 transition-colors"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
      </svg>
    </>
  );

  const className =
    "group flex items-center gap-4 p-4 rounded-2xl glass-card hover:border-accent/30 hover:shadow-lg hover:shadow-accent/5 transition-all duration-300 text-left w-full";

  if (asLink && song.id) {
    return (
      <Link href={`/song/${song.id}`} className={className}>
        {content}
      </Link>
    );
  }

  return (
    <button type="button" onClick={() => onClick?.(song)} className={className}>
      {content}
    </button>
  );
}
