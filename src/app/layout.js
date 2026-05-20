import "./globals.css";
import { AuthContextProvider } from "./_utils/auth";

export const metadata = {
  title: "SoundScore — Rate and review music",
  description:
    "Discover songs, listen to previews, and share ratings and reviews with the community.",
  openGraph: {
    title: "SoundScore",
    description: "Search, rate, and review your favorite music.",
    type: "website",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-[#1a1d20] text-white antialiased">
        <AuthContextProvider>{children}</AuthContextProvider>
      </body>
    </html>
  );
}
