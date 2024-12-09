import localFont from "next/font/local";
import "./globals.css";
import { AuthContextProvider } from "./_utils/auth";

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <AuthContextProvider>{children}</AuthContextProvider>
      </body>
    </html>
  );
}
