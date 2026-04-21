"use client";

import Link from "next/link";
import { Mail, Heart } from "lucide-react";
import { FaWhatsapp, FaInstagram, FaYoutube } from "react-icons/fa";
import { motion } from "framer-motion";
import Logo from "@/components/ui/Logo";

const whatsappNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "916006530058";
const instagramHandle = process.env.NEXT_PUBLIC_INSTAGRAM_HANDLE || "kumailbhatt";
const email = process.env.NEXT_PUBLIC_EMAIL || "Kumailbhat74@gmail.com";
const youtubeChannel = process.env.NEXT_PUBLIC_YOUTUBE_CHANNEL || "art_by_kumail";

const socials = [
  { href: `https://wa.me/${whatsappNumber}?text=Hi%20I%20am%20interested%20in%20your%20art`, label: "WhatsApp", color: "#25D366", icon: <FaWhatsapp size={15} /> },
  { href: `https://instagram.com/${instagramHandle}`, label: "Instagram", color: "#E1306C", icon: <FaInstagram size={15} /> },
  { href: `https://youtube.com/@${youtubeChannel}`, label: "YouTube", color: "#FF0000", icon: <FaYoutube size={15} /> },
  { href: `mailto:${email}`, label: "Email", color: "#4285F4", icon: <Mail size={15} /> },
];

const explore = [
  { href: "/", label: "Home" },
  { href: "/gallery", label: "Gallery" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

const contacts = [
  { href: `https://wa.me/${whatsappNumber}?text=Hi!`, label: "Chat on WhatsApp", color: "#25D366", icon: <FaWhatsapp size={13} /> },
  { href: `https://instagram.com/${instagramHandle}`, label: `@${instagramHandle}`, color: "#E1306C", icon: <FaInstagram size={13} /> },
  { href: `mailto:${email}`, label: email, color: "#4285F4", icon: <Mail size={13} /> },
  { href: `https://youtube.com/@${youtubeChannel}`, label: "Watch Drawing Videos", color: "#FF0000", icon: <FaYoutube size={13} /> },
];

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer style={{ background: "var(--bg-secondary)", borderTop: "1px solid var(--glass-border)" }}>
      <div className="section-container py-16">

        {/* Top Row: 3 equal columns */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 xl:gap-10">

          {/* Col 1 — Brand */}
          <div className="flex flex-col gap-5 min-w-0">
            <Logo size="sm" href="/" showText />
            <p className="text-sm leading-relaxed" style={{ color: "var(--text-muted)", maxWidth: 260 }}>
              Turning imagination into art, one sketch at a time. Each piece is hand-crafted with passion and precision.
            </p>
            {/* Social icons */}
            <div className="flex items-center gap-2 flex-wrap">
              {socials.map((s) => (
                <motion.a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={s.label}
                  whileHover={{ scale: 1.12, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  className="w-9 h-9 rounded-xl flex items-center justify-center transition-all duration-200 flex-shrink-0"
                  style={{ background: "var(--glass-bg)", border: "1px solid var(--glass-border)", color: s.color }}
                >
                  {s.icon}
                </motion.a>
              ))}
            </div>
          </div>

          {/* Col 2 — Explore */}
          <div className="flex flex-col gap-5 min-w-0">
            <h3 className="text-xs font-semibold uppercase tracking-widest" style={{ color: "var(--accent)" }}>
              Explore
            </h3>
            <ul className="flex flex-col gap-3">
              {explore.map((l) => (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    className="text-sm transition-colors duration-200 hover:text-gold inline-flex items-center gap-2 group"
                    style={{ color: "var(--text-muted)" }}
                  >
                    <span
                      className="w-1 h-1 rounded-full transition-all duration-200 group-hover:w-2"
                      style={{ background: "var(--accent)", flexShrink: 0 }}
                    />
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 3 — Get in Touch */}
          <div className="flex flex-col gap-5 min-w-0">
            <h3 className="text-xs font-semibold uppercase tracking-widest" style={{ color: "var(--accent)" }}>
              Get in Touch
            </h3>
            <ul className="flex flex-col gap-3">
              {contacts.map((c) => (
                <li key={c.label}>
                  <a
                    href={c.href}
                    target={c.href.startsWith("mailto") ? undefined : "_blank"}
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2.5 text-sm transition-colors duration-200 hover:text-gold"
                    style={{ color: "var(--text-muted)" }}
                  >
                    <span style={{ color: c.color, flexShrink: 0 }}>{c.icon}</span>
                    <span className="truncate">{c.label}</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div className="mt-4 pt-3 flex flex-col sm:flex-row items-center justify-between gap-3"
          style={{ borderTop: "1px solid var(--glass-border)" }}>
          <p className="text-xs" style={{ color: "var(--text-muted)" }}>
            © {year} Kumailbhatt Art. All rights reserved.
          </p>
          <p className="inline-flex items-center gap-5 text-xs" style={{ color: "var(--text-muted)" }}>
            Made with <Heart size={11} className="fill-red-500 text-red-500" /> for art lovers
          </p>
        </div>
      </div>
    </footer>
  );
}
