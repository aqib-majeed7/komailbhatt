import type { Metadata } from "next";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import AboutSection from "@/components/home/AboutSection";

export const metadata: Metadata = {
  title: "About – Kumailbhatt Art | The Artist Behind the Sketches",
  description:
    "Learn about Kumailbhatt, the artist behind these hand-drawn sketches. Follow on Instagram @kumailbhatt and YouTube @art_by_kumail.",
};

export default function AboutPage() {
  return (
    <>
      <Navbar />
      <main>
        <div
          className="pt-32 pb-8"
          style={{
            background:
              "radial-gradient(ellipse 80% 50% at 50% 0%, rgba(201,169,110,0.10) 0%, transparent 70%)",
          }}
        >
          <div className="section-container text-center">
            <span
              className="text-xs font-semibold uppercase tracking-widest"
              style={{ color: "var(--accent)" }}
            >
              The Person
            </span>
            <h1
              className="font-serif text-4xl md:text-6xl font-bold mt-3 mb-4"
              style={{ color: "var(--text-primary)" }}
            >
              About Me
            </h1>
            <div className="divider-gold" />
          </div>
        </div>
        <AboutSection />
      </main>
      <Footer />
    </>
  );
}
