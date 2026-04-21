import { NextResponse } from "next/server";
import { mockSketches } from "@/lib/mockData";

interface Params {
  params: { id: string };
}

export async function GET(_req: Request, { params }: Params) {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    if (supabaseUrl && supabaseUrl !== "your_supabase_project_url") {
      const { createServerSupabase } = await import("@/lib/supabase");
      const supabase = createServerSupabase();
      const { data, error } = await supabase
        .from("sketches")
        .select("*")
        .eq("id", params.id)
        .single();
      if (error) return NextResponse.json({ error: "Not found" }, { status: 404 });
      return NextResponse.json(data);
    }
    const sketch = mockSketches.find((s) => s.id === params.id);
    if (!sketch) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json(sketch);
  } catch {
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function PUT(request: Request, { params }: Params) {
  try {
    const body = await request.json();
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    if (supabaseUrl && supabaseUrl !== "your_supabase_project_url") {
      const { createServerSupabase } = await import("@/lib/supabase");
      const supabase = createServerSupabase();
      const { data, error } = await supabase
        .from("sketches")
        .update({ ...body, updated_at: new Date().toISOString() })
        .eq("id", params.id)
        .select()
        .single();
      if (error) return NextResponse.json({ error: error.message }, { status: 500 });
      return NextResponse.json(data);
    }
    return NextResponse.json({ ...body, id: params.id });
  } catch {
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function DELETE(_req: Request, { params }: Params) {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    if (supabaseUrl && supabaseUrl !== "your_supabase_project_url") {
      const { createServerSupabase } = await import("@/lib/supabase");
      const supabase = createServerSupabase();
      const { error } = await supabase.from("sketches").delete().eq("id", params.id);
      if (error) return NextResponse.json({ error: error.message }, { status: 500 });
      return NextResponse.json({ success: true });
    }
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
