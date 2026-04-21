"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { useState } from "react";

const logoSrc = "/logo.png";

interface LogoProps {
  size?: "sm" | "md" | "lg" | "xl";
  showText?: boolean;
  href?: string;
  className?: string;
}

const sizes = {
  sm:  { img: 36,  fontSize: 17, sub: 9  },
  md:  { img: 48,  fontSize: 21, sub: 10 },
  lg:  { img: 72,  fontSize: 28, sub: 13 },
  xl:  { img: 120, fontSize: 44, sub: 18 },
};

/** SVG fallback — shown until logo.png loads or if it fails */
function KMark({ size }: { size: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="gld" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#E8C98A" />
          <stop offset="45%" stopColor="#C9A96E" />
          <stop offset="100%" stopColor="#8B6914" />
        </linearGradient>
        <linearGradient id="shine" x1="0%" y1="0%" x2="60%" y2="100%">
          <stop offset="0%" stopColor="#FFF5D6" stopOpacity="0.55" />
          <stop offset="100%" stopColor="#C9A96E" stopOpacity="0" />
        </linearGradient>
        <filter id="dshadow">
          <feDropShadow dx="0" dy="5" stdDeviation="5" floodColor="#8B6914" floodOpacity="0.45" />
        </filter>
        <filter id="glow">
          <feGaussianBlur stdDeviation="2" result="b" />
          <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
      </defs>
      {/* Outer rings */}
      <circle cx="60" cy="60" r="56" fill="none" stroke="url(#gld)" strokeWidth="1.2" opacity="0.35" />
      <circle cx="60" cy="60" r="49" fill="none" stroke="url(#gld)" strokeWidth="0.5" strokeDasharray="3 5" opacity="0.25" />
      {/* Background glow */}
      <circle cx="60" cy="60" r="48" fill="rgba(201,169,110,0.06)" />
      {/* Shadow K */}
      <g transform="translate(2,3)" opacity="0.35">
        <rect x="33" y="26" width="9" height="68" rx="4" fill="#6B4F10" />
        <path d="M42 60 L74 26 L84 26 L52 62z" fill="#6B4F10" />
        <path d="M42 60 L74 94 L84 94 L52 58z" fill="#6B4F10" />
      </g>
      {/* Main K */}
      <g filter="url(#dshadow)">
        <rect x="32" y="25" width="9" height="70" rx="4.5" fill="url(#gld)" />
        <path d="M41 59 L73 25 L83 25 L51 61 Z" fill="url(#gld)" />
        <path d="M41 61 L73 95 L83 95 L51 59 Z" fill="url(#gld)" />
      </g>
      {/* Shine overlay */}
      <g filter="url(#glow)" opacity="0.6">
        <rect x="33" y="25" width="4" height="70" rx="2" fill="url(#shine)" />
        <path d="M41 59 L56 42 L60 42 L45 59 Z" fill="url(#shine)" />
      </g>
      {/* Corner dots */}
      {[0, 90, 180, 270].map((a, i) => {
        const r = (a * Math.PI) / 180;
        return <circle key={i} cx={60 + 56 * Math.cos(r)} cy={60 + 56 * Math.sin(r)} r="2.2" fill="url(#gld)" opacity="0.7" />;
      })}
    </svg>
  );
}

export default function Logo({ size = "md", showText = true, href = "/", className = "" }: LogoProps) {
  const s = sizes[size];
  const [imgError, setImgError] = useState(false);

  const mark = (
    <motion.div
      className="relative flex-shrink-0"
      style={{ width: s.img, height: s.img }}
      whileHover={{ scale: 1.08 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
    >
      {!imgError ? (
        <Image
          src={logoSrc}
          alt="Kumailbhatt Art Logo"
          width={s.img}
          height={s.img}
          className="object-cover w-full h-full"
          style={{
            borderRadius: size === "xl" ? 24 : 12,
            filter: "drop-shadow(0 4px 20px rgba(201,169,110,0.4))",
          }}
          onError={() => setImgError(true)}
          priority
        />
      ) : (
        <KMark size={s.img} />
      )}
    </motion.div>
  );

  const text = showText && (
    <div className="flex flex-col" style={{ gap: 1, minWidth: 0 }}>
      <span
        className="font-serif font-bold tracking-tight leading-none whitespace-nowrap"
        style={{
          fontSize: s.fontSize,
          background: "linear-gradient(135deg, #E8C98A 0%, #C9A96E 50%, #A07840 100%)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          backgroundClip: "text",
        }}
      >
        Kumailbhatt
      </span>
      <span
        className="font-sans font-light uppercase whitespace-nowrap"
        style={{ fontSize: s.sub, color: "var(--text-muted)", letterSpacing: "0.28em" }}
      >
        Art Studio
      </span>
    </div>
  );

  const inner = (
    <div className={`flex items-center gap-3 ${className}`} style={{ minWidth: 0 }}>
      {mark}
      {text}
    </div>
  );

  if (href) return <Link href={href} className="w-fit">{inner}</Link>;
  return inner;
}
