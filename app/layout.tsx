import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/providers/ThemeProvider";
import { Toaster } from "react-hot-toast";
import LoadingScreen from "@/components/ui/LoadingScreen";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Kumailbhatt Art – Hand-Drawn Sketches & Original Artwork",
  description:
    "Discover and collect unique hand-drawn sketches by Kumailbhatt. Original artwork crafted with passion — turning imagination into art. Browse the gallery and connect directly via WhatsApp or Instagram.",
  keywords: ["kumailbhatt", "hand drawn sketches", "original artwork", "artist portfolio", "buy art", "sketch gallery", "art by kumail"],
  openGraph: {
    title: "Kumailbhatt Art – Hand-Drawn Sketches",
    description: "Turning Imagination into Art. Browse unique hand-drawn sketches by Kumailbhatt.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Playfair+Display:ital,wght@0,400;0,500;0,600;0,700;1,400;1,500&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className={inter.className}>
        <ThemeProvider>
          <LoadingScreen />
          {children}
          <Toaster
            position="bottom-right"
            toastOptions={{
              style: {
                background: "var(--card-bg)",
                color: "var(--text-primary)",
                border: "1px solid var(--glass-border)",
                backdropFilter: "blur(20px)",
                borderRadius: "12px",
              },
            }}
          />
        </ThemeProvider>
      </body>
    </html>
  );
}
