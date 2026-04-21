import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import SketchDetailClient from "./SketchDetailClient";
import { createServerSupabase } from "@/lib/supabase";

interface Props {
  params: { id: string };
}

async function getSketch(id: string) {
  try {
    const supabase = createServerSupabase();
    const { data, error } = await supabase
      .from("sketches")
      .select("*")
      .eq("id", id)
      .single();
    if (error) return null;
    return data;
  } catch {
    return null;
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const sketch = await getSketch(params.id);
  if (!sketch) return { title: "Sketch Not Found" };

  return {
    title: `${sketch.title} – Kumailbhatt Art`,
    description: sketch.description,
    openGraph: {
      title: sketch.title,
      description: sketch.description,
      images: sketch.image_urls ?? [],
    },
  };
}

export default async function SketchPage({ params }: Props) {
  const sketch = await getSketch(params.id);
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

// Don't pre-generate static pages — fetch dynamically from Supabase
export const dynamic = "force-dynamic";
