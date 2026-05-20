"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useUserAuth } from "@/app/_utils/auth";

export default function Navbar() {
  const router = useRouter();
  const { user, firebaseSignOut } = useUserAuth();

  const handleSignOut = async () => {
    try {
      await firebaseSignOut();
      router.push("/");
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  return (
    <nav className="border-b border-gray-800 bg-[#1a1d20]/95 backdrop-blur sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex justify-between items-center">
        <Link
          href="/"
          className="text-xl font-bold text-white hover:text-[#1db954] transition-colors"
        >
          SoundScore
        </Link>
        <div className="flex items-center gap-3 sm:gap-4">
          {user ? (
            <>
              <span className="hidden sm:inline text-sm text-gray-400">
                {user.displayName || user.email?.split("@")[0]}
              </span>
              <Link
                href="/profile"
                className="text-sm font-medium text-white hover:text-[#1db954] transition-colors"
              >
                Profile
              </Link>
              <button
                type="button"
                onClick={handleSignOut}
                className="text-sm text-gray-400 hover:text-white transition-colors"
              >
                Sign out
              </button>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="text-sm text-gray-300 hover:text-white transition-colors"
              >
                Sign in
              </Link>
              <Link
                href="/login/signup"
                className="text-sm font-semibold bg-[#1db954] text-white px-4 py-2 rounded-lg hover:bg-[#1aa34a] transition-colors"
              >
                Sign up
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
