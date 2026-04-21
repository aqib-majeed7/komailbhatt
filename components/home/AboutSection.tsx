"use client";

import { motion } from "framer-motion";
import { Pencil, Heart } from "lucide-react";
import { FaYoutube } from "react-icons/fa";
import { GiTrophy } from "react-icons/gi";
import Image from "next/image";
import logoSrc from "@/app/gallery/logo.png";

const youtubeChannel = process.env.NEXT_PUBLIC_YOUTUBE_CHANNEL || "art_by_kumail";

const highlights = [
  {
    icon: <Pencil size={20} />,
    label: "Medium",
    value: "Graphite & Ink",
  },
  {
    icon: <GiTrophy size={20} />,
    label: "Experience",
    value: "5+ Years",
  },
  {
    icon: <Heart size={20} />,
    label: "Pieces Sold",
    value: "200+",
  },
  {
    icon: <FaYoutube size={20} />,
    label: "YouTube",
    value: "Drawing Videos",
  },
];

export default function AboutSection() {
  return (
    <section className="section-padding" style={{ background: "var(--bg-secondary)" }}>
      <div className="section-container">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Left: Image with floating cards */}
          <motion.div
            className="relative"
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            {/* Decorative background blob */}
            <div
              className="absolute -inset-4 rounded-3xl blur-2xl opacity-20"
              style={{ background: "linear-gradient(135deg, #C9A96E, #A07840)" }}
            />

            {/* Main image placeholder */}
            <div
              className="relative rounded-3xl overflow-hidden aspect-[4/5]"
              style={{
                background: "var(--card-bg)",
                border: "1px solid var(--glass-border)",
              }}
            >
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 p-8 text-center">
                {/* Real logo image */}
                <div
                  className="flex items-center justify-center overflow-hidden"
                  style={{
                    width: 240,
                    height: 240,
                    borderRadius: 20,
                    background: "linear-gradient(135deg, rgba(201,169,110,0.12), rgba(160,120,64,0.06))",
                    border: "1.5px solid rgba(201,169,110,0.2)",
                    boxShadow: "0 0 40px rgba(201,169,110,0.18)",
                  }}
                >
                  <Image
                    src={logoSrc}
                    alt="Kumailbhatt Art Logo"
                    width={230}
                    height={230}
                    className="object-contain"
                    style={{ filter: "drop-shadow(0 4px 20px rgba(201,169,110,0.45))" }}
                    priority
                  />
                </div>
                <div>
                  <h3 className="font-serif text-2xl font-bold text-gold">Kumailbhatt</h3>
                  <p className="text-sm mt-1" style={{ color: "var(--text-muted)" }}>
                    Artist & Sketch Creator
                  </p>
                </div>

                <div className="w-full mt-8 space-y-2">
                  {[100, 80, 60, 90, 70].map((w, i) => (
                    <div
                      key={i}
                      className="h-px rounded-full mx-auto"
                      style={{
                        width: `${w}%`,
                        background: `linear-gradient(90deg, transparent, #C9A96E ${50 - i * 5}%, transparent)`,
                        opacity: 0.4 + i * 0.05,
                      }}
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* Floating highlight cards */}
            <motion.div
              className="absolute -right-6 top-12 glass-card p-4 min-w-[140px]"
              animate={{ y: [0, -8, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            >
              <div className="text-2xl font-bold font-serif text-gold">80+</div>
              <div className="text-xs mt-1" style={{ color: "var(--text-muted)" }}>
                Original Artworks
              </div>
            </motion.div>

            <motion.div
              className="absolute -left-6 bottom-16 glass-card p-4 min-w-[140px]"
              animate={{ y: [0, 8, 0] }}
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
            >
              <div className="text-2xl font-bold font-serif text-gold">5★</div>
              <div className="text-xs mt-1" style={{ color: "var(--text-muted)" }}>
                Collector Rating
              </div>
            </motion.div>
          </motion.div>

          {/* Right: Text content */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="space-y-6"
          >
            <div>
              <span
                className="text-xs font-semibold uppercase tracking-widest"
                style={{ color: "var(--accent)" }}
              >
                About the Artist
              </span>
              <h2
                className="font-serif text-3xl md:text-4xl font-bold mt-3 leading-tight"
                style={{ color: "var(--text-primary)" }}
              >
                Where Every Line Tells a Story
              </h2>
              <div className="divider-gold mt-4 mb-4" style={{ margin: "1rem 0" }} />
            </div>

            <p className="text-base leading-relaxed" style={{ color: "var(--text-secondary)" }}>
              I&apos;m Kumailbhatt, a self-taught artist who found their voice through graphite and ink. What started as
              doodles in the margins of notebooks has grown into a deep passion for capturing the human experience
              through hand-drawn art. Follow my journey on Instagram{" "}
              <a href="https://instagram.com/kumailbhatt" target="_blank" rel="noopener noreferrer" className="text-gold hover:underline">@kumailbhatt</a>.
            </p>
            <p className="text-base leading-relaxed" style={{ color: "var(--text-secondary)" }}>
              Every sketch I create is an exploration — of form, shadow, emotion, and storytelling. I work primarily
              in graphite pencil and fine-line ink, often spending hours on a single piece to achieve the depth and
              texture that makes each artwork unique. Watch my drawing process on{" "}
              <a href="https://youtube.com/@art_by_kumail" target="_blank" rel="noopener noreferrer" className="text-gold hover:underline">YouTube @art_by_kumail</a>.
            </p>

            {/* Highlights */}
            <div className="grid grid-cols-2 gap-4 mt-8">
              {highlights.map((h, i) => (
                <motion.div
                  key={h.label}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="p-4 rounded-2xl flex items-center gap-3"
                  style={{
                    background: "var(--glass-bg)",
                    border: "1px solid var(--glass-border)",
                  }}
                >
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                    style={{
                      background: "rgba(201, 169, 110, 0.12)",
                      color: "var(--accent)",
                    }}
                  >
                    {h.icon}
                  </div>
                  <div>
                    <div className="text-xs" style={{ color: "var(--text-muted)" }}>
                      {h.label}
                    </div>
                    <div className="font-semibold text-sm" style={{ color: "var(--text-primary)" }}>
                      {h.value}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Watch videos link */}
            <a
              href={`https://youtube.com/@${youtubeChannel}`}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-glass inline-flex mt-2"
              id="about-youtube-btn"
              style={{ color: "var(--text-primary)" }}
            >
              <FaYoutube size={16} className="text-red-500" />
              Watch My Drawing Process
            </a>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
