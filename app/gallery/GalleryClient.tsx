"use client";

import { useEffect, useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { Search, ArrowRight, Eye } from "lucide-react";
import { Sketch } from "@/lib/types";
import { supabase } from "@/lib/supabase";

type SortOption = "newest" | "price-asc" | "price-desc";

export default function GalleryPageClient({ sketches: initialSketches }: { sketches?: Sketch[] }) {
  const [allSketches, setAllSketches] = useState<Sketch[]>(initialSketches || []);
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState<SortOption>("newest");

  useEffect(() => {
    if (initialSketches && initialSketches.length > 0) return; // use passed data if available
    const fetchSketches = async () => {
      const { data, error } = await supabase
        .from("sketches")
        .select("*")
        .order("created_at", { ascending: false });
      if (!error && data) setAllSketches(data);
    };
    fetchSketches();
  }, [initialSketches]);

  const filtered = useMemo(() => {
    let result = allSketches.filter(
      (s) =>
        s.title.toLowerCase().includes(search.toLowerCase()) ||
        s.description.toLowerCase().includes(search.toLowerCase())
    );
    if (sort === "price-asc") result = [...result].sort((a, b) => a.price - b.price);
    if (sort === "price-desc") result = [...result].sort((a, b) => b.price - a.price);
    if (sort === "newest") result = [...result].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
    return result;
  }, [allSketches, search, sort]);

  return (
    <div>
      {/* Section Header */}
      <div
        className="pt-32 pb-16"
        style={{
          background:
            "radial-gradient(ellipse 80% 50% at 50% 0%, rgba(201,169,110,0.10) 0%, transparent 70%)",
        }}
      >
        <div className="section-container text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span
              className="text-xs font-semibold uppercase tracking-widest"
              style={{ color: "var(--accent)" }}
            >
              The Collection
            </span>
            <h1
              className="font-serif text-4xl md:text-6xl font-bold mt-3 mb-4"
              style={{ color: "var(--text-primary)" }}
            >
              Full Gallery
            </h1>
            <div className="divider-gold" />
            <p className="mt-4 text-base max-w-md mx-auto" style={{ color: "var(--text-secondary)" }}>
              Browse {allSketches.length} original hand-drawn sketches — each available for purchase
            </p>
          </motion.div>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="section-container mb-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="flex flex-col sm:flex-row gap-4 items-stretch sm:items-center"
        >
          {/* Search */}
          <div className="relative flex-1">
            <Search
              size={16}
              className="absolute left-4 top-1/2 -translate-y-1/2"
              style={{ color: "var(--text-muted)" }}
            />
            <input
              id="gallery-search"
              type="text"
              placeholder="Search sketches..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="input-glass pl-11"
            />
          </div>

          {/* Sort */}
          <div className="flex items-center gap-3">
            <select
              id="gallery-sort"
              value={sort}
              onChange={(e) => setSort(e.target.value as SortOption)}
              className="input-glass py-3 cursor-pointer"
              style={{ width: "auto", minWidth: 160 }}
            >
              <option value="newest">Newest First</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
            </select>
          </div>
        </motion.div>

        {/* Results count */}
        <p className="text-sm mt-4" style={{ color: "var(--text-muted)" }}>
          Showing {filtered.length} of {allSketches.length} sketches
        </p>
      </div>

      {/* Grid */}
      <div className="section-container pb-24">
        <AnimatePresence mode="wait">
          {filtered.length === 0 ? (
            <motion.div
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-center py-24"
            >
              <div className="text-5xl mb-4">🔍</div>
              <h3 className="font-serif text-2xl mb-2" style={{ color: "var(--text-primary)" }}>
                No sketches found
              </h3>
              <p style={{ color: "var(--text-muted)" }}>Try a different search term</p>
            </motion.div>
          ) : (
            <motion.div
              key="grid"
              className="product-grid"
            >
              {filtered.map((sketch, index) => (
                <motion.div
                  key={sketch.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.06 }}
                >
                  <GalleryCard sketch={sketch} />
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

function GalleryCard({ sketch }: { sketch: Sketch }) {
  return (
    <Link href={`/sketch/${sketch.id}`}>
      <div className="sketch-card group">
        {/* Image */}
        <div className="relative w-full overflow-hidden" style={{ height: 260 }}>
          {(sketch.image_urls ?? [])[0] && (
            <Image
              src={(sketch.image_urls ?? [])[0]}
              alt={sketch.title}
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-110"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
            />
          )}
          <div className="sketch-card-overlay" />
          <div className="sketch-card-actions">
            <div className="flex items-center justify-between">
              <div className="price-tag text-sm">₹{sketch.price.toLocaleString("en-IN")}</div>
              <div
                className="w-8 h-8 rounded-lg flex items-center justify-center"
                style={{ background: "rgba(255,255,255,0.15)", color: "white" }}
              >
                <Eye size={14} />
              </div>
            </div>
          </div>
          {sketch.featured && (
            <div
              className="absolute top-3 left-3 px-2.5 py-1 rounded-full text-xs font-semibold"
              style={{ background: "linear-gradient(135deg, #C9A96E, #A07840)", color: "#0A0A0F" }}
            >
              Featured
            </div>
          )}
        </div>

        {/* Info */}
        <div className="p-4">
          <h3 className="font-serif text-base font-semibold mb-1" style={{ color: "var(--text-primary)" }}>
            {sketch.title}
          </h3>
          <div className="flex items-center justify-between mt-3">
            <span className="font-bold text-gold">₹{sketch.price.toLocaleString("en-IN")}</span>
            <span className="text-xs flex items-center gap-1" style={{ color: "var(--accent)" }}>
              View <ArrowRight size={11} />
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}
