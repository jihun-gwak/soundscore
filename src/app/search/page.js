"use client";
import { useSearchParams } from "next/navigation";
import MusicPlayer from "../../components/MusicPlayer";

export default function SearchPage() {
  const searchParams = useSearchParams();
  const query = searchParams.get("q");

  return (
    <div className="max-w-7xl mx-auto p-5">
      <MusicPlayer initialQuery={query} />
    </div>
  );
}
