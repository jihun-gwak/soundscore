import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-white/5 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 flex flex-col sm:flex-row justify-between items-center gap-4 text-sm text-gray-500">
        <p>
          <span className="text-accent font-semibold">SoundScore</span> — rate &
          review music together
        </p>
        <div className="flex gap-6">
          <Link href="/" className="hover:text-accent transition-colors">
            Home
          </Link>
          <Link href="/search" className="hover:text-accent transition-colors">
            Search
          </Link>
          <Link href="/login" className="hover:text-accent transition-colors">
            Sign in
          </Link>
        </div>
      </div>
    </footer>
  );
}
