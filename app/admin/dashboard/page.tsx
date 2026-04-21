"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import {
  LayoutDashboard, FileImage, Plus, Pencil, Trash2, X, LogOut,
  Palette, Star, Save, AlertCircle, Upload, ImagePlus, ChevronLeft, ChevronRight,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { Sketch, SketchInput } from "@/lib/types";
import { mockSketches } from "@/lib/mockData";
import { supabase } from "@/lib/supabase";
import toast from "react-hot-toast";
import Logo from "@/components/ui/Logo";

type Tab = "sketches" | "add";

export default function AdminDashboard() {
  const router = useRouter();
  const [tab, setTab] = useState<Tab>("sketches");
  const [sketches, setSketches] = useState<Sketch[]>([]);
  const [loading, setLoading] = useState(true);
  const [editSketch, setEditSketch] = useState<Sketch | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [isAuth, setIsAuth] = useState(false);

  useEffect(() => {
    const auth = sessionStorage.getItem("admin_auth");
    if (!auth) router.replace("/admin");
    else setIsAuth(true);
  }, [router]);

  // Fetch sketches from Supabase on mount
  useEffect(() => {
    if (!isAuth) return;
    const fetchSketches = async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from("sketches")
          .select("*")
          .order("created_at", { ascending: false });
        if (error) throw error;
        setSketches(data && data.length > 0 ? data : mockSketches);
      } catch {
        setSketches(mockSketches);
      } finally {
        setLoading(false);
      }
    };
    fetchSketches();
  }, [isAuth]);

  const handleLogout = () => {
    sessionStorage.removeItem("admin_auth");
    router.replace("/admin");
  };

  const handleAdd = async (data: SketchInput) => {
    try {
      const { data: inserted, error } = await supabase
        .from("sketches")
        .insert([{ ...data, created_at: new Date().toISOString(), updated_at: new Date().toISOString() }])
        .select()
        .single();
      if (error) throw error;
      setSketches((prev) => [inserted, ...prev]);
      toast.success("Sketch added!");
    } catch {
      const newSketch: Sketch = {
        ...data,
        id: Date.now().toString(),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
      setSketches((prev) => [newSketch, ...prev]);
      toast.success("Sketch added!");
    }
    setTab("sketches");
  };

  const handleEdit = async (data: SketchInput) => {
    if (!editSketch) return;
    try {
      const { data: updated, error } = await supabase
        .from("sketches")
        .update({ ...data, updated_at: new Date().toISOString() })
        .eq("id", editSketch.id)
        .select()
        .single();
      if (error) throw error;
      setSketches((prev) => prev.map((s) => s.id === editSketch.id ? updated : s));
      toast.success("Sketch updated!");
    } catch {
      setSketches((prev) =>
        prev.map((s) => s.id === editSketch.id ? { ...s, ...data, updated_at: new Date().toISOString() } : s)
      );
      toast.success("Sketch updated!");
    }
    setEditSketch(null);
    setTab("sketches");
  };

  const handleDelete = async (id: string) => {
    try {
      const { error } = await supabase.from("sketches").delete().eq("id", id);
      if (error) throw error;
    } catch {
      // Continue with local state removal even if DB fails
    }
    setSketches((prev) => prev.filter((s) => s.id !== id));
    setDeleteId(null);
    toast.success("Sketch deleted.");
  };

  if (!isAuth) return null;
  if (loading) return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: "var(--bg-primary)" }}>
      <div className="w-10 h-10 border-2 border-amber-400 border-t-transparent rounded-full animate-spin" />
    </div>
  );

  const stats = [
    { label: "Total Sketches", value: sketches.length, icon: <FileImage size={20} /> },
    { label: "Featured", value: sketches.filter((s) => s.featured).length, icon: <Star size={20} /> },
    { label: "Total Value", value: `₹${sketches.reduce((sum, s) => sum + s.price, 0).toLocaleString("en-IN")}`, icon: <LayoutDashboard size={20} /> },
  ];

  return (
    <div className="min-h-screen" style={{ background: "var(--bg-primary)" }}>
      {/* Sidebar */}
      <aside className="admin-sidebar flex flex-col">
        <div className="p-4 border-b" style={{ borderColor: "var(--glass-border)" }}>
          <Logo size="sm" showText={true} href="/" />
        </div>

        <nav className="flex-1 p-4 space-y-1">
          {[
            { id: "sketches", label: "All Sketches", icon: <FileImage size={18} /> },
            { id: "add", label: "Add New Sketch", icon: <Plus size={18} /> },
          ].map((item) => (
            <button
              key={item.id}
              id={`admin-nav-${item.id}`}
              onClick={() => { setTab(item.id as Tab); setEditSketch(null); }}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-left transition-all duration-200"
              style={{
                background: tab === item.id ? "rgba(201,169,110,0.12)" : "transparent",
                color: tab === item.id ? "var(--accent)" : "var(--text-muted)",
                border: tab === item.id ? "1px solid rgba(201,169,110,0.2)" : "1px solid transparent",
              }}
            >
              {item.icon}
              {item.label}
            </button>
          ))}
        </nav>

        <div className="p-4 border-t" style={{ borderColor: "var(--glass-border)" }}>
          <button
            id="admin-logout-btn"
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 hover:bg-red-500/10"
            style={{ color: "var(--text-muted)" }}
          >
            <LogOut size={18} />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="admin-content p-8">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="font-serif text-2xl font-bold" style={{ color: "var(--text-primary)" }}>
              {tab === "sketches" ? "Manage Sketches" : editSketch ? "Edit Sketch" : "Add New Sketch"}
            </h1>
            <p className="text-sm mt-1" style={{ color: "var(--text-muted)" }}>
              {tab === "sketches" ? `${sketches.length} artworks in collection` : "Upload up to 3 images for this sketch"}
            </p>
          </div>
          {tab === "sketches" && (
            <button id="admin-add-btn" onClick={() => setTab("add")} className="btn-gold text-sm">
              <Plus size={16} /> Add Sketch
            </button>
          )}
        </div>

        {/* Stats */}
        {tab === "sketches" && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
            {stats.map((s, i) => (
              <motion.div
                key={s.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="p-5 rounded-2xl flex items-center gap-4"
                style={{ background: "var(--card-bg)", border: "1px solid var(--glass-border)" }}
              >
                <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: "rgba(201,169,110,0.12)", color: "var(--accent)" }}>
                  {s.icon}
                </div>
                <div>
                  <div className="text-xl font-bold font-serif text-gold">{s.value}</div>
                  <div className="text-xs mt-0.5" style={{ color: "var(--text-muted)" }}>{s.label}</div>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {tab === "sketches" && (
          <SketchTable sketches={sketches} onEdit={(s) => { setEditSketch(s); setTab("add"); }} onDelete={(id) => setDeleteId(id)} />
        )}
        {tab === "add" && (
          <SketchForm sketch={editSketch} onSubmit={editSketch ? handleEdit : handleAdd} onCancel={() => { setEditSketch(null); setTab("sketches"); }} />
        )}
      </main>

      {/* Delete Modal */}
      <AnimatePresence>
        {deleteId && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            style={{ background: "rgba(0,0,0,0.6)", backdropFilter: "blur(4px)" }}
          >
            <motion.div
              initial={{ scale: 0.9 }} animate={{ scale: 1 }} exit={{ scale: 0.9 }}
              className="w-full max-w-sm p-8 rounded-3xl text-center"
              style={{ background: "var(--card-bg)", border: "1px solid var(--glass-border)" }}
            >
              <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 bg-red-500/10">
                <Trash2 size={28} className="text-red-500" />
              </div>
              <h3 className="font-serif text-xl font-bold mb-2" style={{ color: "var(--text-primary)" }}>Delete Sketch?</h3>
              <p className="text-sm mb-8" style={{ color: "var(--text-muted)" }}>This action cannot be undone.</p>
              <div className="flex gap-3">
                <button onClick={() => setDeleteId(null)} className="btn-glass flex-1 justify-center text-sm">Cancel</button>
                <button id="confirm-delete-btn" onClick={() => handleDelete(deleteId)} className="flex-1 py-3 rounded-xl font-semibold text-sm text-white bg-red-500 hover:bg-red-600 transition-colors">Delete</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── Sketch Table ────────────────────────────────────────────────────────────
function SketchTable({ sketches, onEdit, onDelete }: { sketches: Sketch[]; onEdit: (s: Sketch) => void; onDelete: (id: string) => void; }) {
  const [previewIdx, setPreviewIdx] = useState<Record<string, number>>({});

  return (
    <div className="rounded-2xl overflow-hidden" style={{ border: "1px solid var(--glass-border)" }}>
      <div className="grid grid-cols-12 gap-4 px-6 py-4 text-xs font-semibold uppercase tracking-wider"
        style={{ background: "var(--card-bg)", color: "var(--text-muted)", borderBottom: "1px solid var(--glass-border)" }}>
        <div className="col-span-5">Sketch</div>
        <div className="col-span-2">Price</div>
        <div className="col-span-2">Featured</div>
        <div className="col-span-3 text-right">Actions</div>
      </div>

      {sketches.map((sketch, i) => {
        const urls = sketch.image_urls ?? [];
        const idx = previewIdx[sketch.id] ?? 0;
        return (
          <motion.div
            key={sketch.id}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: i * 0.04 }}
            className="grid grid-cols-12 gap-4 px-6 py-4 items-center"
            style={{ borderBottom: i < sketches.length - 1 ? "1px solid var(--glass-border)" : "none" }}
          >
            <div className="col-span-5 flex items-center gap-3">
              {/* Mini carousel thumbnail */}
              <div className="relative w-14 h-14 rounded-xl overflow-hidden flex-shrink-0 group">
                {urls[idx] && (
                  <Image src={urls[idx]} alt={sketch.title} fill className="object-cover" sizes="56px" />
                )}
                {urls.length > 1 && (
                  <div className="absolute inset-0 flex items-center justify-between px-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={() => setPreviewIdx((p) => ({ ...p, [sketch.id]: idx === 0 ? urls.length - 1 : idx - 1 }))}
                      className="w-5 h-5 rounded-full flex items-center justify-center" style={{ background: "rgba(0,0,0,0.6)" }}>
                      <ChevronLeft size={10} color="white" />
                    </button>
                    <button onClick={() => setPreviewIdx((p) => ({ ...p, [sketch.id]: idx === urls.length - 1 ? 0 : idx + 1 }))}
                      className="w-5 h-5 rounded-full flex items-center justify-center" style={{ background: "rgba(0,0,0,0.6)" }}>
                      <ChevronRight size={10} color="white" />
                    </button>
                  </div>
                )}
                {urls.length > 1 && (
                  <div className="absolute bottom-0.5 right-0.5 px-1 rounded text-white" style={{ fontSize: 8, background: "rgba(0,0,0,0.6)" }}>
                    {idx + 1}/{urls.length}
                  </div>
                )}
              </div>
              <div className="min-w-0">
                <p className="font-medium text-sm truncate" style={{ color: "var(--text-primary)" }}>{sketch.title}</p>
                <p className="text-xs truncate" style={{ color: "var(--text-muted)" }}>{(sketch.description || "").slice(0, 45)}...</p>
              </div>
            </div>
            <div className="col-span-2">
              <span className="font-semibold text-sm text-gold">₹{(sketch.price || 0).toLocaleString("en-IN")}</span>
            </div>
            <div className="col-span-2">
              {sketch.featured
                ? <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium" style={{ background: "rgba(201,169,110,0.12)", color: "var(--accent)" }}><Star size={11} fill="currentColor" /> Yes</span>
                : <span className="text-xs" style={{ color: "var(--text-muted)" }}>No</span>
              }
            </div>
            <div className="col-span-3 flex justify-end gap-2">
              <button id={`edit-${sketch.id}`} onClick={() => onEdit(sketch)} className="p-2 rounded-xl transition-all hover:scale-105" style={{ background: "rgba(201,169,110,0.1)", border: "1px solid rgba(201,169,110,0.2)", color: "var(--accent)" }}>
                <Pencil size={14} />
              </button>
              <button id={`delete-${sketch.id}`} onClick={() => onDelete(sketch.id)} className="p-2 rounded-xl transition-all hover:scale-105" style={{ background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.2)", color: "#f87171" }}>
                <Trash2 size={14} />
              </button>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}


// ─── Sketch Form with Supabase Storage Upload ────────────────────────────────
function SketchForm({ sketch, onSubmit, onCancel }: { sketch: Sketch | null; onSubmit: (data: SketchInput) => void; onCancel: () => void; }) {
  const [title, setTitle] = useState(sketch?.title || "");
  const [description, setDescription] = useState(sketch?.description || "");
  const [price, setPrice] = useState(sketch?.price.toString() || "");
  const [featured, setFeatured] = useState(sketch?.featured || false);
  const [imageUrls, setImageUrls] = useState<string[]>(sketch?.image_urls || []);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<number[]>([]);
  const fileRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;

    const remaining = 3 - imageUrls.length;
    const toUpload = files.slice(0, remaining);

    if (toUpload.length === 0) {
      toast.error("Maximum 3 images per sketch");
      return;
    }

    setUploading(true);
    setUploadProgress(Array(toUpload.length).fill(0));

    const uploaded: string[] = [];

    for (let i = 0; i < toUpload.length; i++) {
      const file = toUpload[i];
      const ext = file.name.split(".").pop()?.toLowerCase() || "jpg";
      const fileName = `sketch-${Date.now()}-${Math.random().toString(36).slice(2, 7)}.${ext}`;

      try {
        const { data, error } = await supabase.storage
          .from("sketch-images")
          .upload(`sketches/${fileName}`, file, {
            contentType: file.type,
            upsert: false,
          });

        if (error) throw new Error(error.message);

        const { data: { publicUrl } } = supabase.storage
          .from("sketch-images")
          .getPublicUrl(data.path);

        uploaded.push(publicUrl);
        setUploadProgress((prev) => prev.map((p, idx) => (idx === i ? 100 : p)));
      } catch (err: any) {
        toast.error(`Upload failed: ${err.message}. Make sure the "sketch-images" bucket exists and is public in Supabase Storage.`);
        // Do NOT push a blob URL — skip this file
      }
    }

    if (uploaded.length > 0) {
      setImageUrls((prev) => [...prev, ...uploaded].slice(0, 3));
    }
    setUploading(false);
    setUploadProgress([]);
    if (fileRef.current) fileRef.current.value = "";
  };


  const removeImage = (idx: number) => {
    setImageUrls((prev) => prev.filter((_, i) => i !== idx));
  };

  const moveImage = (from: number, to: number) => {
    setImageUrls((prev) => {
      const arr = [...prev];
      [arr[from], arr[to]] = [arr[to], arr[from]];
      return arr;
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (imageUrls.length === 0) { toast.error("Please upload at least 1 image"); return; }
    onSubmit({ title, description, price: parseFloat(price), image_urls: imageUrls, featured });
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-2xl">
      <form onSubmit={handleSubmit} className="space-y-6">

        {/* ── Image Upload Section ── */}
        <div className="p-6 rounded-2xl space-y-4" style={{ background: "var(--card-bg)", border: "1px solid var(--glass-border)" }}>
          <div className="flex items-center justify-between">
            <h3 className="font-semibold" style={{ color: "var(--text-primary)" }}>
              Artwork Images
            </h3>
            <span className="text-xs px-2 py-1 rounded-full" style={{ background: "rgba(201,169,110,0.12)", color: "var(--accent)" }}>
              {imageUrls.length}/3 uploaded
            </span>
          </div>

          {/* Upload area */}
          {imageUrls.length < 3 && (
            <div
              onClick={() => fileRef.current?.click()}
              className="border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all duration-200 hover:border-amber-400"
              style={{ borderColor: "var(--glass-border)" }}
            >
              <input
                ref={fileRef}
                id="image-upload-input"
                type="file"
                accept="image/*"
                multiple
                className="hidden"
                onChange={handleFileChange}
              />
              {uploading ? (
                <div className="space-y-3">
                  <div className="w-10 h-10 border-2 border-amber-400 border-t-transparent rounded-full animate-spin mx-auto" />
                  <p className="text-sm" style={{ color: "var(--text-muted)" }}>Uploading to Supabase Storage...</p>
                </div>
              ) : (
                <>
                  <Upload size={32} className="mx-auto mb-3" style={{ color: "var(--accent)" }} />
                  <p className="font-medium text-sm mb-1" style={{ color: "var(--text-primary)" }}>
                    Click to upload images
                  </p>
                  <p className="text-xs" style={{ color: "var(--text-muted)" }}>
                    JPG, PNG, WEBP — up to {3 - imageUrls.length} more image{3 - imageUrls.length !== 1 ? "s" : ""}
                  </p>
                </>
              )}
            </div>
          )}

          {/* Image previews */}
          {imageUrls.length > 0 && (
            <div className="grid grid-cols-3 gap-3">
              {imageUrls.map((url, i) => (
                <div key={i} className="relative group rounded-xl overflow-hidden" style={{ aspectRatio: "3/4" }}>
                  <Image src={url} alt={`Preview ${i + 1}`} fill className="object-cover" sizes="200px" />

                  {/* Overlay controls */}
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-between p-2"
                    style={{ background: "rgba(0,0,0,0.55)" }}>
                    {/* Move buttons */}
                    <div className="flex gap-1 w-full justify-between">
                      {i > 0 && (
                        <button type="button" onClick={() => moveImage(i, i - 1)}
                          className="flex-1 py-1 rounded-lg text-white text-xs flex items-center justify-center gap-1"
                          style={{ background: "rgba(255,255,255,0.15)" }}>
                          <ChevronLeft size={12} /> Move
                        </button>
                      )}
                      {i < imageUrls.length - 1 && (
                        <button type="button" onClick={() => moveImage(i, i + 1)}
                          className="flex-1 py-1 rounded-lg text-white text-xs flex items-center justify-center gap-1"
                          style={{ background: "rgba(255,255,255,0.15)" }}>
                          Move <ChevronRight size={12} />
                        </button>
                      )}
                    </div>
                    {/* Delete */}
                    <button type="button" onClick={() => removeImage(i)} id={`remove-img-${i}`}
                      className="w-8 h-8 rounded-full flex items-center justify-center text-white"
                      style={{ background: "rgba(239,68,68,0.8)" }}>
                      <X size={14} />
                    </button>
                  </div>

                  {/* Index badge */}
                  <div className="absolute top-1.5 left-1.5 w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold"
                    style={{ background: i === 0 ? "linear-gradient(135deg,#C9A96E,#A07840)" : "rgba(0,0,0,0.5)", color: "white" }}>
                    {i + 1}
                  </div>
                  {i === 0 && (
                    <div className="absolute bottom-1.5 left-1.5 px-1.5 py-0.5 rounded text-xs font-medium"
                      style={{ background: "linear-gradient(135deg,#C9A96E,#A07840)", color: "#0A0A0F" }}>
                      Cover
                    </div>
                  )}
                </div>
              ))}

              {/* Add more slot */}
              {imageUrls.length < 3 && (
                <div
                  onClick={() => fileRef.current?.click()}
                  className="rounded-xl border-2 border-dashed flex flex-col items-center justify-center gap-2 cursor-pointer transition-all hover:border-amber-400"
                  style={{ aspectRatio: "3/4", borderColor: "var(--glass-border)" }}
                >
                  <ImagePlus size={20} style={{ color: "var(--accent)" }} />
                  <span className="text-xs" style={{ color: "var(--text-muted)" }}>Add more</span>
                </div>
              )}
            </div>
          )}

          <p className="text-xs" style={{ color: "var(--text-muted)" }}>
            💡 Image 1 is the cover (shown in gallery). Drag to reorder. Customers can swipe through all views on the product page.
          </p>
        </div>

        {/* ── Details ── */}
        <div className="p-6 rounded-2xl space-y-5" style={{ background: "var(--card-bg)", border: "1px solid var(--glass-border)" }}>
          <h3 className="font-semibold" style={{ color: "var(--text-primary)" }}>Sketch Details</h3>

          <div>
            <label className="block text-sm mb-2" style={{ color: "var(--text-secondary)" }}>Title *</label>
            <input id="form-title" value={title} onChange={(e) => setTitle(e.target.value)} className="input-glass" placeholder="e.g. Portrait in Shadows" required />
          </div>

          <div>
            <label className="block text-sm mb-2" style={{ color: "var(--text-secondary)" }}>Description *</label>
            <textarea id="form-description" value={description} onChange={(e) => setDescription(e.target.value)} className="input-glass" placeholder="Describe the artwork, technique, inspiration..." rows={4} required style={{ resize: "vertical" }} />
          </div>

          <div>
            <label className="block text-sm mb-2" style={{ color: "var(--text-secondary)" }}>Price (₹) *</label>
            <input id="form-price" type="number" value={price} onChange={(e) => setPrice(e.target.value)} className="input-glass" placeholder="2500" min="1" step="1" required />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium" style={{ color: "var(--text-primary)" }}>Featured Artwork</p>
              <p className="text-xs mt-0.5" style={{ color: "var(--text-muted)" }}>Show on homepage</p>
            </div>
            <button type="button" id="form-featured-toggle" onClick={() => setFeatured(!featured)}
              className="relative w-12 h-6 rounded-full transition-all duration-300"
              style={{ background: featured ? "linear-gradient(135deg,#C9A96E,#A07840)" : "var(--bg-secondary)", border: "1px solid var(--glass-border)" }}>
              <span className="absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white transition-transform duration-300"
                style={{ transform: featured ? "translateX(24px)" : "translateX(0)" }} />
            </button>
          </div>
        </div>

        <div className="flex gap-3">
          <button type="button" onClick={onCancel} className="btn-glass flex-1 justify-center text-sm">Cancel</button>
          <button type="submit" id="form-submit-btn" disabled={uploading} className="btn-gold flex-1 justify-center text-sm" style={{ opacity: uploading ? 0.7 : 1 }}>
            <Save size={15} />
            {sketch ? "Save Changes" : "Add Sketch"}
          </button>
        </div>
      </form>
    </motion.div>
  );
}
