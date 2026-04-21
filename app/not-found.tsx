import type { Metadata } from "next";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Link from "next/link";

export const metadata: Metadata = {
  title: "404 – Page Not Found | Komail Art",
};

export default function NotFound() {
  return (
    <>
      <Navbar />
      <main
        className="min-h-screen flex items-center justify-center"
        style={{
          background: "radial-gradient(ellipse 80% 60% at 50% 50%, rgba(201,169,110,0.08) 0%, transparent 70%)",
        }}
      >
        <div className="text-center px-6">
          <div className="text-8xl font-serif font-bold text-gold mb-4">404</div>
          <h1 className="text-2xl font-serif font-semibold mb-2" style={{ color: "var(--text-primary)" }}>
            Sketch Not Found
          </h1>
          <p className="mb-8" style={{ color: "var(--text-muted)" }}>
            This page doesn&apos;t exist — but there are beautiful artworks waiting for you.
          </p>
          <Link href="/gallery" className="btn-gold">
            Browse Gallery
          </Link>
        </div>
      </main>
      <Footer />
    </>
  );
}
