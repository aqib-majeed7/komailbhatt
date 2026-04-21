"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useMotionValue, useTransform, useSpring } from "framer-motion";
import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";
import Logo from "@/components/ui/Logo";

export default function HeroSection() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const mouseX = useMotionValue(0.5);
  const mouseY = useMotionValue(0.5);
  const [mounted, setMounted] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Smooth spring for 3D tilt
  const springX = useSpring(useTransform(mouseX, [0, 1], [-10, 10]), { stiffness: 50, damping: 18 });
  const springY = useSpring(useTransform(mouseY, [0, 1], [10, -10]), { stiffness: 50, damping: 18 });

  useEffect(() => {
    setMounted(true);
    const mobile = window.innerWidth < 768;
    setIsMobile(mobile);

    // Desktop: mouse tilt
    const handleMouse = (e: MouseEvent) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      mouseX.set((e.clientX - rect.left) / rect.width);
      mouseY.set((e.clientY - rect.top) / rect.height);
    };

    // Mobile: device orientation tilt
    const handleOrientation = (e: DeviceOrientationEvent) => {
      if (e.gamma !== null && e.beta !== null) {
        mouseX.set(Math.min(Math.max((e.gamma + 45) / 90, 0), 1));
        mouseY.set(Math.min(Math.max((e.beta - 20) / 60, 0), 1));
      }
    };

    if (!mobile) {
      window.addEventListener("mousemove", handleMouse);
    } else {
      window.addEventListener("deviceorientation", handleOrientation);
    }

    return () => {
      window.removeEventListener("mousemove", handleMouse);
      window.removeEventListener("deviceorientation", handleOrientation);
    };
  }, [mouseX, mouseY]);

  // Particle canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;
    const isMob = window.innerWidth < 768;
    const PARTICLE_COUNT = isMob ? 35 : 80;

    const resize = () => { canvas.width = window.innerWidth; canvas.height = window.innerHeight; };
    resize();
    window.addEventListener("resize", resize);

    const particles = Array.from({ length: PARTICLE_COUNT }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      size: Math.random() * 2 + 0.4,
      speedX: (Math.random() - 0.5) * 0.4,
      speedY: (Math.random() - 0.5) * 0.4,
      alpha: Math.random() * 0.5 + 0.1,
      hue: Math.random() > 0.5 ? 38 : 45,
    }));

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach((p) => {
        p.x += p.speedX;
        p.y += p.speedY;
        if (p.x < 0) p.x = canvas.width;
        if (p.x > canvas.width) p.x = 0;
        if (p.y < 0) p.y = canvas.height;
        if (p.y > canvas.height) p.y = 0;

        const g = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.size * 5);
        g.addColorStop(0, `hsla(${p.hue}, 70%, 65%, ${p.alpha})`);
        g.addColorStop(1, `hsla(${p.hue}, 70%, 65%, 0)`);
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size * 5, 0, Math.PI * 2);
        ctx.fillStyle = g;
        ctx.fill();
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(${p.hue}, 80%, 70%, ${p.alpha + 0.3})`;
        ctx.fill();
      });
      animId = requestAnimationFrame(animate);
    };
    animate();
    return () => { window.removeEventListener("resize", resize); cancelAnimationFrame(animId); };
  }, []);

  return (
    <section
      ref={containerRef}
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
      style={{ perspective: "1200px" }}
    >
      {/* ── Particle canvas ── */}
      <canvas ref={canvasRef} className="absolute inset-0 z-0" style={{ opacity: 0.7 }} />

      {/* Deep glow */}
      <div className="absolute inset-0 z-0 pointer-events-none"
        style={{ background: "radial-gradient(ellipse 80% 70% at 50% 40%, rgba(201,169,110,0.08) 0%, rgba(160,120,64,0.03) 50%, transparent 80%)" }} />

      {/* 3D floor grid */}
      <div className="absolute bottom-0 left-0 right-0 z-0 pointer-events-none" style={{ height: "55%", overflow: "hidden" }}>
        <div style={{
          position: "absolute", inset: 0,
          backgroundImage: `linear-gradient(rgba(201,169,110,0.07) 1px, transparent 1px), linear-gradient(90deg, rgba(201,169,110,0.07) 1px, transparent 1px)`,
          backgroundSize: "60px 60px",
          transform: "perspective(600px) rotateX(75deg) translateY(60%)",
          transformOrigin: "center bottom",
          maskImage: "linear-gradient(to top, rgba(0,0,0,0.5) 0%, transparent 65%)",
          WebkitMaskImage: "linear-gradient(to top, rgba(0,0,0,0.5) 0%, transparent 65%)",
        }} />
      </div>

      {/* ── Floating ambient orbs ── */}
      {mounted && [
        { x: "8%",  y: "20%", size: 280, delay: 0,   color: "rgba(201,169,110,0.07)" },
        { x: "75%", y: "15%", size: 200, delay: 1.5,  color: "rgba(160,120,64,0.05)"  },
        { x: "85%", y: "65%", size: 320, delay: 0.8,  color: "rgba(201,169,110,0.05)" },
        { x: "5%",  y: "70%", size: 180, delay: 2,    color: "rgba(232,201,138,0.04)" },
      ].map((orb, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full pointer-events-none z-0"
          style={{ left: orb.x, top: orb.y, width: orb.size, height: orb.size, background: `radial-gradient(circle, ${orb.color} 0%, transparent 70%)` }}
          animate={{ y: [0, -20, 0], scale: [1, 1.07, 1] }}
          transition={{ duration: 6 + i * 1.5, repeat: Infinity, ease: "easeInOut", delay: orb.delay }}
        />
      ))}

      {/* ── Main content — 3D tilt ── */}
      <motion.div
        className="relative z-10 text-center px-5 max-w-4xl mx-auto w-full"
        style={{
          rotateX: isMobile ? 0 : springY,
          rotateY: isMobile ? 0 : springX,
          transformStyle: "preserve-3d",
        }}
      >
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="flex justify-center mb-5"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold uppercase tracking-widest"
            style={{ background: "rgba(201,169,110,0.1)", border: "1px solid rgba(201,169,110,0.22)", color: "var(--accent)" }}>
            <Sparkles size={12} />
            Original Hand-Drawn Art
            <Sparkles size={12} />
          </div>
        </motion.div>

        {/* 3D Logo — floats above on its own Z layer */}
        <motion.div
          initial={{ opacity: 0, scale: 0.5, rotateY: -90 }}
          animate={{ opacity: 1, scale: 1, rotateY: 0 }}
          transition={{ duration: 1.1, type: "spring", stiffness: 90, damping: 15, delay: 0.1 }}
          className="flex justify-center mb-6"
          style={{ transform: "translateZ(40px)" }}
        >
          {/* Continuous float animation on mobile */}
          <motion.div
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          >
            <Logo size={isMobile ? "lg" : "xl"} showText={false} href="" className="cursor-default" />
          </motion.div>
        </motion.div>

        {/* Main title */}
        <motion.h1
          className="font-serif font-bold leading-tight tracking-tight"
          initial={{ opacity: 0, y: 32 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.3 }}
          style={{
            fontSize: "clamp(2.2rem, 7vw, 5.5rem)",
            color: "var(--text-primary)",
            transform: "translateZ(20px)",
          }}
        >
          Turning Imagination
          <br />
          <motion.span
            style={{
              background: "linear-gradient(135deg, #E8C98A 0%, #C9A96E 40%, #A07840 80%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
              display: "inline-block",
            }}
            animate={{ backgroundPosition: ["0%", "100%", "0%"] }}
            transition={{ duration: 5, repeat: Infinity }}
          >
            into Art
          </motion.span>
        </motion.h1>

        {/* Gold divider */}
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 0.9, delay: 0.6 }}
          className="mx-auto my-5"
          style={{ width: 80, height: 1, background: "linear-gradient(90deg, transparent, #C9A96E, transparent)" }}
        />

        {/* Subtitle */}
        <motion.p
          className="text-sm md:text-lg leading-relaxed max-w-xl mx-auto px-2"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          style={{ color: "var(--text-secondary)" }}
        >
          Every sketch tells a story. Browse original hand-drawn artworks by{" "}
          <span className="text-gold font-medium">Kumailbhatt</span> — available for purchase and custom commissions.
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          className="flex flex-col sm:flex-row items-center justify-center gap-3 mt-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.7 }}
          style={{ transform: "translateZ(30px)" }}
        >
          <Link href="/gallery" id="hero-browse-btn" className="btn-gold text-sm md:text-base px-6 md:px-8 py-3 md:py-4 group w-full sm:w-auto justify-center">
            Browse Gallery
            <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
          </Link>
          <a
            href={`https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "916006530058"}?text=Hi%2C+I+am+interested+in+your+artwork`}
            target="_blank" rel="noopener noreferrer" id="hero-whatsapp-btn"
            className="btn-glass text-sm md:text-base px-6 md:px-8 py-3 md:py-4 w-full sm:w-auto justify-center"
          >
            💬 Chat on WhatsApp
          </a>
        </motion.div>

        {/* Social proof chips */}
        <motion.div
          className="flex items-center justify-center gap-2 flex-wrap mt-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
        >
          {["200+ Pieces Created", "5★ Collectors", "Pan India Delivery"].map((t, i) => (
            <motion.span
              key={t}
              className="text-xs px-3 py-1.5 rounded-full"
              style={{ background: "var(--glass-bg)", border: "1px solid var(--glass-border)", color: "var(--text-muted)" }}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 1 + i * 0.1 }}
            >
              {t}
            </motion.span>
          ))}
        </motion.div>
      </motion.div>
    </section>
  );
}
