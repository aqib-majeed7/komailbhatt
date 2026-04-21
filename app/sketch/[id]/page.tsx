import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import SketchDetailClient from "./SketchDetailClient";
import { mockSketches } from "@/lib/mockData";

interface Props {
  params: { id: string };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const sketch = mockSketches.find((s) => s.id === params.id);
  if (!sketch) return { title: "Sketch Not Found" };

  return {
    title: `${sketch.title} – Kumailbhatt Art`,
    description: sketch.description,
    openGraph: {
      title: sketch.title,
      description: sketch.description,
      images: sketch.image_urls,
    },
  };
}

export default function SketchPage({ params }: Props) {
  const sketch = mockSketches.find((s) => s.id === params.id);
  if (!sketch) notFound();

  return (
    <>
      <Navbar />
      <main>
        <SketchDetailClient sketch={sketch} />
      </main>
      <Footer />
    </>
  );
}

export function generateStaticParams() {
  return mockSketches.map((s) => ({ id: s.id }));
}
