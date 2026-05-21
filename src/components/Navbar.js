"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { useUserAuth } from "@/app/_utils/auth";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/search", label: "Search" },
];

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
  const { user, dbUser, firebaseSignOut, initializing } = useUserAuth();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleSignOut = async () => {
    try {
      await firebaseSignOut();
      router.push("/");
      setMenuOpen(false);
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  const displayName =
    dbUser?.display_name ||
    user?.displayName ||
    user?.email?.split("@")[0];

  return (
    <nav className="sticky top-0 z-50 border-b border-white/5 bg-surface/90 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex justify-between items-center h-16">
          <Link href="/" className="flex items-center gap-2 group">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-accent to-emerald-600 text-lg shadow-lg shadow-accent/25 group-hover:scale-105 transition-transform">
              ♪
            </span>
            <span className="text-lg font-bold tracking-tight">
              Sound<span className="text-accent">Score</span>
            </span>
          </Link>

          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  pathname === link.href
                    ? "text-accent bg-accent/10"
                    : "text-gray-400 hover:text-white hover:bg-white/5"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          <div className="hidden md:flex items-center gap-3">
            {!initializing && user ? (
              <>
                <Link
                  href="/profile"
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-lg transition-colors ${
                    pathname === "/profile"
                      ? "bg-accent/10 text-accent"
                      : "text-gray-300 hover:bg-white/5"
                  }`}
                >
                  <span className="h-8 w-8 rounded-full bg-gradient-to-br from-accent/80 to-emerald-600 flex items-center justify-center text-sm font-bold">
                    {displayName?.[0]?.toUpperCase() || "?"}
                  </span>
                  <span className="text-sm font-medium max-w-[120px] truncate">
                    {displayName}
                  </span>
                </Link>
                <button type="button" onClick={handleSignOut} className="btn-ghost text-sm">
                  Sign out
                </button>
              </>
            ) : !initializing ? (
              <>
                <Link href="/login" className="btn-ghost text-sm">
                  Sign in
                </Link>
                <Link href="/login/signup" className="btn-primary text-sm py-2 px-5">
                  Sign up
                </Link>
              </>
            ) : null}
          </div>

          <button
            type="button"
            className="md:hidden p-2 text-gray-400 hover:text-white"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Menu"
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              {menuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {menuOpen && (
          <div className="md:hidden pb-4 space-y-1 animate-fade-in border-t border-white/5 pt-3">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMenuOpen(false)}
                className="block px-4 py-2 rounded-lg text-gray-300 hover:bg-white/5"
              >
                {link.label}
              </Link>
            ))}
            {user ? (
              <>
                <Link href="/profile" onClick={() => setMenuOpen(false)} className="block px-4 py-2 rounded-lg text-gray-300 hover:bg-white/5">
                  Profile
                </Link>
                <button type="button" onClick={handleSignOut} className="w-full text-left px-4 py-2 text-gray-400">
                  Sign out
                </button>
              </>
            ) : (
              <>
                <Link href="/login" onClick={() => setMenuOpen(false)} className="block px-4 py-2 rounded-lg text-gray-300">
                  Sign in
                </Link>
                <Link href="/login/signup" onClick={() => setMenuOpen(false)} className="block px-4 py-2 text-accent font-medium">
                  Sign up
                </Link>
              </>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}
