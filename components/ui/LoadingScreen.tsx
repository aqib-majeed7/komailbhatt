"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import Image from "next/image";
import logoSrc from "@/app/gallery/logo.png";

export default function LoadingScreen() {
  const [visible, setVisible] = useState(true);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // Animate progress bar
    const interval = setInterval(() => {
      setProgress((p) => {
        if (p >= 100) { clearInterval(interval); return 100; }
        return p + Math.random() * 18;
      });
    }, 120);

    // Hide after 1.8s
    const timer = setTimeout(() => setVisible(false), 1900);
    return () => { clearTimeout(timer); clearInterval(interval); };
  }, []);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.6, ease: "easeInOut" }}
          className="fixed inset-0 z-[9999] flex flex-col items-center justify-center"
          style={{ background: "var(--bg-primary)" }}
        >
          {/* Background gold glow */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background:
                "radial-gradient(ellipse 60% 50% at 50% 50%, rgba(201,169,110,0.07) 0%, transparent 70%)",
            }}
          />

          {/* 3D Logo Ring */}
          <div className="relative flex items-center justify-center mb-8">
            {/* Rotating rings */}
            <motion.div
              className="absolute rounded-full border"
              style={{ width: 160, height: 160, borderColor: "rgba(201,169,110,0.15)" }}
              animate={{ rotate: 360 }}
              transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
            />
            <motion.div
              className="absolute rounded-full border"
              style={{
                width: 200, height: 200,
                borderColor: "rgba(201,169,110,0.08)",
                borderStyle: "dashed",
              }}
              animate={{ rotate: -360 }}
              transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
            />

            {/* Logo image */}
            <motion.div
              initial={{ scale: 0.4, rotateY: -90, opacity: 0 }}
              animate={{ scale: 1, rotateY: 0, opacity: 1 }}
              transition={{ duration: 0.8, type: "spring", stiffness: 120, damping: 14 }}
              style={{ perspective: 800 }}
            >
              <Image
                src={logoSrc}
                alt="Kumailbhatt Art"
                width={100}
                height={100}
                className="object-contain"
                style={{ filter: "drop-shadow(0 6px 24px rgba(201,169,110,0.5))" }}
                priority
              />
            </motion.div>
          </div>

          {/* Artist name */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.6 }}
            className="text-center"
          >
            <h1
              className="font-serif text-2xl font-bold tracking-tight"
              style={{
                background: "linear-gradient(135deg, #E8C98A, #C9A96E, #A07840)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              Kumailbhatt Art
            </h1>
            <p className="text-xs uppercase tracking-[0.4em] mt-1" style={{ color: "var(--text-muted)" }}>
              Loading Collection
            </p>
          </motion.div>

          {/* Progress bar */}
          <div
            className="absolute bottom-0 left-0 right-0 h-[2px]"
            style={{ background: "rgba(201,169,110,0.1)" }}
          >
            <motion.div
              className="h-full"
              style={{
                width: `${Math.min(progress, 100)}%`,
                background: "linear-gradient(90deg, #C9A96E, #E8C98A)",
                transition: "width 0.15s ease",
              }}
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
