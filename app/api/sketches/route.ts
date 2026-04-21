import { NextResponse } from "next/server";
import { mockSketches } from "@/lib/mockData";

// In production: replace with Supabase queries
export async function GET() {
  try {
    // Try Supabase first (if configured)
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    if (supabaseUrl && supabaseUrl !== "your_supabase_project_url") {
      const { createServerSupabase } = await import("@/lib/supabase");
      const supabase = createServerSupabase();
      const { data, error } = await supabase
        .from("sketches")
        .select("*")
        .order("created_at", { ascending: false });
      if (!error && data) return NextResponse.json(data);
    }
    // Fallback to mock data
    return NextResponse.json(mockSketches);
  } catch {
    return NextResponse.json(mockSketches);
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { title, description, price, image_url, featured } = body;

    if (!title || !price || !image_url) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    if (supabaseUrl && supabaseUrl !== "your_supabase_project_url") {
      const { createServerSupabase } = await import("@/lib/supabase");
      const supabase = createServerSupabase();
      const { data, error } = await supabase
        .from("sketches")
        .insert({ title, description, price, image_url, featured: featured ?? false })
        .select()
        .single();
      if (error) return NextResponse.json({ error: error.message }, { status: 500 });
      return NextResponse.json(data, { status: 201 });
    }

    // Mock response
    const newSketch = {
      id: Date.now().toString(),
      title, description, price, image_url,
      featured: featured ?? false,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    return NextResponse.json(newSketch, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
