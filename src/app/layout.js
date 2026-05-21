import { Outfit } from "next/font/google";
import "./globals.css";
import { AuthContextProvider } from "./_utils/auth";
import { ToastProvider } from "@/components/Toast";

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
});

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
    <html lang="en" className={outfit.variable}>
      <body className="font-sans min-h-screen flex flex-col">
        <AuthContextProvider>
          <ToastProvider>{children}</ToastProvider>
        </AuthContextProvider>
      </body>
    </html>
  );
}
