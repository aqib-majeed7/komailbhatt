import type { Metadata } from "next";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import GalleryClient from "./GalleryClient";

export const metadata: Metadata = {
  title: "Gallery – Kumailbhatt Art | Browse All Hand-Drawn Sketches",
  description:
    "Browse the complete collection of original hand-drawn sketches by Kumailbhatt (art_by_kumail). Graphite, ink, and pencil artwork available for purchase.",
};

export default function GalleryPage() {
  return (
    <>
      <Navbar />
      <main>
        <GalleryClient />
      </main>
      <Footer />
    </>
  );
}
