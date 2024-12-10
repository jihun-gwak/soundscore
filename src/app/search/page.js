"use client";
import { useSearchParams } from "next/navigation";
import MusicPlayer from "../../components/MusicPlayer";
import Link from "next/link";

export default function SearchPage() {
  const searchParams = useSearchParams();
  const query = searchParams.get("q");

  return (
    <div className="min-h-screen bg-[#1a1d20] text-white">
      <nav className="border-b border-gray-800 p-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <Link href="/" className="text-xl font-bold">
            SoundScore
          </Link>
        </div>
      </nav>
      <div className="max-w-7xl mx-auto p-5">
        <MusicPlayer initialQuery={query} />
      </div>
    </div>
  );
}
