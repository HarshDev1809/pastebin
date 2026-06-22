import { Ubuntu, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import { Navbar } from "@/lib/components/Navbar";
import { Footer } from "@/lib/components/Footer";
import { ThemeProvider } from "@/components/theme-provider";

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
  title: "Snippet-Lite | Simple & Modern Snippet",
  description: "A minimalist snippet for sharing code and text snippets.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${ubuntu.variable} ${geistMono.variable} antialiased min-h-screen flex flex-col font-sans`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <Navbar />
          <main className="flex-1">
            {children}
          </main>
          <Toaster position="top-right" richColors />
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}
