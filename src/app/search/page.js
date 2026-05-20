import { Suspense } from "react";
import Navbar from "@/components/Navbar";
import MusicPlayer from "@/components/MusicPlayer";

function SearchContent() {
  return <MusicPlayer />;
}

export default function SearchPage() {
  return (
    <div className="min-h-screen bg-[#1a1d20] text-white">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <Suspense
          fallback={
            <div className="flex justify-center py-16">
              <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-[#1db954]" />
            </div>
          }
        >
          <SearchContent />
        </Suspense>
      </div>
    </div>
  );
}
