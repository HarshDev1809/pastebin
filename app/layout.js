import { Ubuntu, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import { Navbar } from "@/lib/components/Navbar";
import { Footer } from "@/lib/components/Footer";

const ubuntu = Ubuntu({
  variable: "--font-ubuntu",
  subsets: ["latin"],
  weight: ["300", "400", "500", "700"],
});

const geistMono = Geist_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Pastebin-Lite | Simple & Modern Pastebin",
  description: "A minimalist pastebin for sharing code and text snippets.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${ubuntu.variable} ${geistMono.variable} antialiased min-h-screen flex flex-col font-sans`}>
        <Navbar />
        <main className="flex-1">
          {children}
        </main>
        <Toaster position="top-right" richColors />
        <Footer />
      </body>
    </html>
  );
}
