"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Eye } from "lucide-react";
import { Sketch } from "@/lib/types";
import { mockSketches } from "@/lib/mockData";

const featured = mockSketches.filter((s) => s.featured).slice(0, 6);

export default function FeaturedGallery({ sketches }: { sketches?: Sketch[] }) {
  const items = sketches || featured;

  return (
    <section className="section-padding" style={{ background: "var(--bg-primary)" }}>
      <div className="section-container">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, amount: 0.3 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12 md:mb-16"
        >
          <motion.span
            className="text-xs font-semibold uppercase tracking-widest"
            style={{ color: "var(--accent)" }}
            initial={{ opacity: 0, letterSpacing: "0.1em" }}
            whileInView={{ opacity: 1, letterSpacing: "0.25em" }}
            viewport={{ once: false }}
            transition={{ duration: 0.8 }}
          >
            Featured Works
          </motion.span>
          <h2 className="font-serif text-3xl md:text-5xl font-bold mt-3 mb-4" style={{ color: "var(--text-primary)" }}>
            Handpicked Masterpieces
          </h2>
          <div className="divider-gold" />
          <p className="mt-4 text-sm md:text-base max-w-lg mx-auto" style={{ color: "var(--text-secondary)" }}>
            A curated selection of my finest works — each sketch a unique journey of lines, shadows, and soul.
          </p>
        </motion.div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6">
          {items.map((sketch, index) => (
            <motion.div
              key={sketch.id}
              initial={{ opacity: 0, y: 50, scale: 0.95 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: false, amount: 0.2 }}
              transition={{ duration: 0.5, delay: index * 0.08, type: "spring", stiffness: 100 }}
            >
              <SketchCard sketch={sketch} />
            </motion.div>
          ))}
        </div>

        {/* View All CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, amount: 0.5 }}
          transition={{ duration: 0.6 }}
          className="flex justify-center mt-12 md:mt-14"
        >
          <Link href="/gallery" className="btn-gold" id="featured-view-all-btn">
            View All Works
            <ArrowRight size={16} />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}

function SketchCard({ sketch }: { sketch: Sketch }) {
  return (
    <Link href={`/sketch/${sketch.id}`}>
      <motion.div
        className="sketch-card group"
        style={{ minHeight: 360 }}
        whileHover={{ y: -6, scale: 1.02 }}
        whileTap={{ scale: 0.97 }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
      >
        {/* Image */}
        <div className="relative w-full overflow-hidden" style={{ height: 260 }}>
          <Image
            src={sketch.image_urls[0]}
            alt={sketch.title}
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-110"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />

          {/* Gradient overlay — always visible on mobile, hover on desktop */}
          <div
            className="absolute inset-0 transition-opacity duration-300"
            style={{
              background: "linear-gradient(to top, rgba(10,10,15,0.85) 0%, rgba(10,10,15,0.3) 50%, transparent 100%)",
              opacity: 1,
            }}
          />

          {/* Price + eye icon — always visible on mobile */}
          <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between">
            <div className="price-tag text-sm">₹{sketch.price.toLocaleString("en-IN")}</div>
            <motion.div
              className="w-9 h-9 rounded-xl flex items-center justify-center"
              style={{ background: "rgba(255,255,255,0.15)", color: "white" }}
              whileHover={{ scale: 1.15 }}
            >
              <Eye size={15} />
            </motion.div>
          </div>

          {/* Featured badge */}
          {sketch.featured && (
            <div
              className="absolute top-3 left-3 px-3 py-1 rounded-full text-xs font-semibold"
              style={{ background: "linear-gradient(135deg, #C9A96E, #A07840)", color: "#0A0A0F" }}
            >
              ✦ Featured
            </div>
          )}
        </div>

        {/* Info */}
        <div className="p-4 md:p-5">
          <h3 className="font-serif text-base md:text-lg font-semibold mb-1" style={{ color: "var(--text-primary)" }}>
            {sketch.title}
          </h3>
          <p className="text-xs md:text-sm line-clamp-2" style={{ color: "var(--text-muted)" }}>
            {sketch.description}
          </p>
          <div className="flex items-center justify-between mt-3">
            <span className="font-bold text-gold text-base md:text-lg">
              ₹{sketch.price.toLocaleString("en-IN")}
            </span>
            <motion.span
              className="text-xs flex items-center gap-1"
              style={{ color: "var(--accent)" }}
              whileHover={{ gap: "0.4rem" }}
            >
              View Details <ArrowRight size={12} />
            </motion.span>
          </div>
        </div>
      </motion.div>
    </Link>
  );
}
