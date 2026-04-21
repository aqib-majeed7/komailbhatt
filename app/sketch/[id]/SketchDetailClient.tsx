"use client";

import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle, Mail, ArrowLeft, Share2, Check, ChevronLeft, ChevronRight, Shield, Truck, Star } from "lucide-react";
import { FaInstagram } from "react-icons/fa";
import Image from "next/image";
import Link from "next/link";
import { Sketch } from "@/lib/types";
import { useState, useEffect, useCallback } from "react";
import toast from "react-hot-toast";

const whatsappNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "916006530058";
const instagramHandle = process.env.NEXT_PUBLIC_INSTAGRAM_HANDLE || "kumailbhatt";
const artistEmail = process.env.NEXT_PUBLIC_EMAIL || "Kumailbhat74@gmail.com";

type Direction = 1 | -1;

const slideVariants = {
  enter: (dir: Direction) => ({ x: dir > 0 ? "100%" : "-100%", opacity: 0 }),
  center: { x: 0, opacity: 1 },
  exit: (dir: Direction) => ({ x: dir > 0 ? "-100%" : "100%", opacity: 0 }),
};

export default function SketchDetailClient({ sketch }: { sketch: Sketch }) {
  const [copied, setCopied] = useState(false);
  const [imgIndex, setImgIndex] = useState(0);
  const [direction, setDirection] = useState<Direction>(1);
  const [paused, setPaused] = useState(false);

  const images = sketch.image_urls?.length ? sketch.image_urls : [];
  const hasMultiple = images.length > 1;

  const goTo = useCallback((newIdx: number) => {
    setDirection(newIdx > imgIndex ? 1 : -1);
    setImgIndex(newIdx);
  }, [imgIndex]);

  const prev = useCallback(() => goTo(imgIndex === 0 ? images.length - 1 : imgIndex - 1), [goTo, imgIndex, images.length]);
  const next = useCallback(() => goTo(imgIndex === images.length - 1 ? 0 : imgIndex + 1), [goTo, imgIndex, images.length]);

  // Auto-swipe every 3 seconds
  useEffect(() => {
    if (!hasMultiple || paused) return;
    const timer = setInterval(() => {
      setDirection(1);
      setImgIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
    }, 3000);
    return () => clearInterval(timer);
  }, [hasMultiple, paused, images.length]);



  const whatsappMsg = encodeURIComponent(
    `Hi! I am interested in the sketch "${sketch.title}" (₹${sketch.price.toLocaleString("en-IN")}). Could you please share more details?`
  );

  const handleShare = async () => {
    const url = window.location.href;
    if (navigator.share) { await navigator.share({ title: sketch.title, url }); }
    else {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="min-h-screen" style={{ background: "var(--bg-primary)" }}>
      {/* Subtle gradient top */}
      <div
        className="absolute top-0 left-0 right-0 h-[500px] pointer-events-none"
        style={{ background: "radial-gradient(ellipse 80% 50% at 50% 0%, rgba(201,169,110,0.06) 0%, transparent 70%)" }}
      />

      <div className="relative section-container pt-28 pb-24">
        {/* Back link */}
        <motion.div initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.4 }} className="mb-10">
          <Link
            href="/gallery"
            className="inline-flex items-center gap-2 text-sm font-medium px-4 py-2 rounded-full transition-all duration-200 hover:gap-3"
            style={{ background: "var(--glass-bg)", border: "1px solid var(--glass-border)", color: "var(--text-secondary)" }}
          >
            <ArrowLeft size={14} /> Back to Gallery
          </Link>
        </motion.div>

        {/* MAIN GRID — strict 50/50 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 xl:gap-20 items-start">

          {/* ── LEFT: Image Carousel ── */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="lg:sticky lg:top-28 space-y-4 w-full"
          >
            {/* Main carousel frame */}
            <div
              className="relative w-full overflow-hidden rounded-3xl"
              style={{
                aspectRatio: "4/5",
                border: "1px solid var(--glass-border)",
                boxShadow: "0 32px 80px rgba(0,0,0,0.35), 0 0 40px rgba(201,169,110,0.05)",
              }}
              onMouseEnter={() => setPaused(true)}
              onMouseLeave={() => setPaused(false)}
            >
              <AnimatePresence initial={false} custom={direction} mode="popLayout">
                <motion.div
                  key={imgIndex}
                  custom={direction}
                  variants={slideVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{ type: "spring", stiffness: 280, damping: 28 }}
                  className="absolute inset-0"
                >
                  {images[imgIndex] && (
                    <Image
                      src={images[imgIndex]}
                      alt={`${sketch.title} — view ${imgIndex + 1}`}
                      fill
                      className="object-cover"
                      sizes="(max-width: 1024px) 100vw, 50vw"
                      priority={imgIndex === 0}
                    />
                  )}
                </motion.div>
              </AnimatePresence>

              {/* Arrows */}
              {hasMultiple && (
                <>
                  <button id="carousel-prev" onClick={prev}
                    className="absolute left-3 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-xl flex items-center justify-center hover:scale-110 transition-transform"
                    style={{ background: "rgba(0,0,0,0.5)", backdropFilter: "blur(8px)", color: "white" }}>
                    <ChevronLeft size={20} />
                  </button>
                  <button id="carousel-next" onClick={next}
                    className="absolute right-3 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-xl flex items-center justify-center hover:scale-110 transition-transform"
                    style={{ background: "rgba(0,0,0,0.5)", backdropFilter: "blur(8px)", color: "white" }}>
                    <ChevronRight size={20} />
                  </button>
                </>
              )}

              {/* Badges */}
              {hasMultiple && (
                <div className="absolute top-3 right-3 z-10 px-2.5 py-1 rounded-full text-xs font-medium"
                  style={{ background: "rgba(0,0,0,0.5)", color: "white", backdropFilter: "blur(8px)" }}>
                  {imgIndex + 1} / {images.length}
                </div>
              )}
              {sketch.featured && (
                <div className="absolute top-3 left-3 z-10 px-3 py-1 rounded-full text-xs font-semibold"
                  style={{ background: "linear-gradient(135deg,#C9A96E,#A07840)", color: "#0A0A0F" }}>
                  ✦ Featured
                </div>
              )}
            </div>

            {/* Dot indicators */}
            {hasMultiple && (
              <div className="flex items-center justify-center gap-2">
                {images.map((_, i) => (
                  <button key={i} id={`dot-${i}`} onClick={() => goTo(i)}
                    className="rounded-full transition-all duration-300"
                    style={{
                      width: i === imgIndex ? 28 : 8, height: 8,
                      background: i === imgIndex ? "linear-gradient(135deg,#C9A96E,#A07840)" : "var(--glass-border)",
                    }} />
                ))}
              </div>
            )}

            {/* Thumbnails */}
            {hasMultiple && (
              <div className="flex gap-3">
                {images.map((url, i) => (
                  <button key={i} id={`thumb-${i}`} onClick={() => goTo(i)}
                    className="relative flex-1 rounded-xl overflow-hidden transition-all duration-200"
                    style={{ height: 80, border: i === imgIndex ? "2px solid #C9A96E" : "2px solid var(--glass-border)", opacity: i === imgIndex ? 1 : 0.55 }}>
                    <Image src={url} alt={`View ${i + 1}`} fill className="object-cover" sizes="100px" />
                  </button>
                ))}
              </div>
            )}

            {/* Share */}
            <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
              onClick={handleShare} id="share-sketch-btn" className="btn-glass w-full justify-center text-sm">
              {copied ? <><Check size={15} style={{ color: "#25D366" }} /> Link Copied!</> : <><Share2 size={15} /> Share this Sketch</>}
            </motion.button>
          </motion.div>

          {/* ── RIGHT: Details ── */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="w-full space-y-8"
          >
            {/* Title & Price */}
            <div>
              {sketch.featured && (
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold mb-3"
                  style={{ background: "rgba(201,169,110,0.12)", border: "1px solid rgba(201,169,110,0.25)", color: "var(--accent)" }}>
                  <Star size={11} fill="currentColor" /> Featured Work
                </div>
              )}
              <h1 className="font-serif text-3xl md:text-4xl xl:text-5xl font-bold leading-tight" style={{ color: "var(--text-primary)" }}>
                {sketch.title}
              </h1>
              <div className="mt-5 flex items-center gap-4 flex-wrap">
                <span className="text-3xl md:text-4xl font-bold font-serif text-gold">
                  ₹{sketch.price.toLocaleString("en-IN")}
                </span>
                <span className="price-tag">Original Artwork</span>
              </div>
            </div>

            <div className="divider-gold" style={{ margin: 0 }} />

            {/* Description */}
            <div>
              <h2 className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: "var(--accent)" }}>
                About This Piece
              </h2>
              <p className="text-base leading-7" style={{ color: "var(--text-secondary)" }}>
                {sketch.description}
              </p>
            </div>

            {/* Details table */}
            <div className="rounded-2xl overflow-hidden" style={{ border: "1px solid var(--glass-border)" }}>
              {[
                { label: "Medium", value: "Hand-drawn (Graphite / Ink)" },
                { label: "Type", value: "One-of-a-Kind Original" },
                { label: "Views", value: `${images.length} image${images.length !== 1 ? "s" : ""} available` },
                { label: "Delivery", value: "Secure care packaging — Pan India" },
              ].map((d, i) => (
                <div
                  key={d.label}
                  className="flex items-center justify-between px-5 py-3.5 text-sm"
                  style={{
                    borderBottom: i < 3 ? "1px solid var(--glass-border)" : "none",
                    background: i % 2 === 0 ? "var(--glass-bg)" : "transparent",
                  }}
                >
                  <span style={{ color: "var(--text-muted)" }}>{d.label}</span>
                  <span className="font-medium text-right" style={{ color: "var(--text-primary)" }}>{d.value}</span>
                </div>
              ))}
            </div>

            {/* Trust badges */}
            <div className="grid grid-cols-3 gap-3">
              {[
                { icon: <Shield size={16} />, label: "Authentic", sub: "Original artwork" },
                { icon: <Truck size={16} />, label: "Delivery", sub: "Pan India" },
                { icon: <Star size={16} />, label: "Quality", sub: "5★ rated" },
              ].map((b) => (
                <div key={b.label} className="flex flex-col items-center gap-1.5 p-3 rounded-xl text-center"
                  style={{ background: "var(--glass-bg)", border: "1px solid var(--glass-border)" }}>
                  <div style={{ color: "var(--accent)" }}>{b.icon}</div>
                  <p className="text-xs font-semibold" style={{ color: "var(--text-primary)" }}>{b.label}</p>
                  <p className="text-xs" style={{ color: "var(--text-muted)" }}>{b.sub}</p>
                </div>
              ))}
            </div>

            {/* Purchase section */}
            <div className="space-y-3">
              <h2 className="text-xs font-semibold uppercase tracking-widest" style={{ color: "var(--accent)" }}>
                Purchase This Sketch
              </h2>

              <motion.a
                id="whatsapp-contact-btn"
                whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}
                href={`https://wa.me/${whatsappNumber}?text=${whatsappMsg}`}
                target="_blank" rel="noopener noreferrer"
                className="btn-whatsapp w-full justify-center text-base py-4"
              >
                <MessageCircle size={19} />
                Contact on WhatsApp
              </motion.a>

              <motion.a
                id="instagram-contact-btn"
                whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}
                href={`https://instagram.com/${instagramHandle}`}
                target="_blank" rel="noopener noreferrer"
                className="btn-instagram w-full justify-center text-base py-4"
              >
                <FaInstagram size={19} />
                Message on Instagram
              </motion.a>

              <motion.a
                id="email-contact-btn"
                whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}
                href={`mailto:${artistEmail}?subject=Interested in "${sketch.title}"&body=Hi! I am interested in the sketch "${sketch.title}" priced at ₹${sketch.price}.`}
                className="btn-email w-full justify-center text-base py-4"
              >
                <Mail size={19} />
                Send Email
              </motion.a>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
