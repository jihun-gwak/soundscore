import { Suspense } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import MusicPlayer from "@/components/MusicPlayer";

export default function SearchPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 py-8">
        <Suspense
          fallback={
            <div className="flex justify-center py-24">
              <div className="animate-spin rounded-full h-12 w-12 border-2 border-accent border-t-transparent" />
            </div>
          }
        >
          <MusicPlayer />
        </Suspense>
      </main>
      <Footer />
    </div>
  );
}
