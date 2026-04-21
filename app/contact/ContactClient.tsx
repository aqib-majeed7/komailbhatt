"use client";

import { motion } from "framer-motion";
import { MessageCircle, Mail, Send, MapPin, Clock } from "lucide-react";
import { FaInstagram, FaYoutube } from "react-icons/fa";
import { useState } from "react";
import toast from "react-hot-toast";

const whatsappNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "916006530058";
const instagramHandle = process.env.NEXT_PUBLIC_INSTAGRAM_HANDLE || "kumailbhatt";
const artistEmail = process.env.NEXT_PUBLIC_EMAIL || "Kumailbhat74@gmail.com";
const youtubeChannel = process.env.NEXT_PUBLIC_YOUTUBE_CHANNEL || "art_by_kumail";

const channels = [
  {
    id: "whatsapp-channel",
    icon: <MessageCircle size={24} />,
    label: "WhatsApp",
    description: "Fastest response — usually within hours",
    action: "Chat Now",
    href: `https://wa.me/${whatsappNumber}?text=Hi%2C+I+am+interested+in+your+artwork!`,
    color: "#25D366",
    bg: "rgba(37,211,102,0.08)",
    border: "rgba(37,211,102,0.2)",
  },
  {
    id: "instagram-channel",
    icon: <FaInstagram size={24} />,
    label: "Instagram",
    description: "DM for commissions and collaboration",
    action: `@${instagramHandle}`,
    href: `https://instagram.com/${instagramHandle}`,
    color: "#E1306C",
    bg: "rgba(225,48,108,0.08)",
    border: "rgba(225,48,108,0.2)",
  },
  {
    id: "email-channel",
    icon: <Mail size={24} />,
    label: "Email",
    description: "For detailed commissions and inquiries",
    action: artistEmail,
    href: `mailto:${artistEmail}`,
    color: "#4285F4",
    bg: "rgba(66,133,244,0.08)",
    border: "rgba(66,133,244,0.2)",
  },
  {
    id: "youtube-channel",
    icon: <FaYoutube size={24} />,
    label: "YouTube",
    description: "Watch my sketching process & tutorials",
    action: "Watch Videos",
    href: `https://youtube.com/@${youtubeChannel}`,
    color: "#FF0000",
    bg: "rgba(255,0,0,0.08)",
    border: "rgba(255,0,0,0.2)",
  },
];

export default function ContactPageClient() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const subject = encodeURIComponent(`Message from ${name} via Komail Art`);
    const body = encodeURIComponent(`Name: ${name}\nEmail: ${email}\n\n${message}`);
    window.location.href = `mailto:${artistEmail}?subject=${subject}&body=${body}`;
    toast.success("Opening email client...");
  };

  return (
    <div>
      {/* Header */}
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
          >
            <span className="text-xs font-semibold uppercase tracking-widest" style={{ color: "var(--accent)" }}>
              Let&apos;s Connect
            </span>
            <h1 className="font-serif text-4xl md:text-6xl font-bold mt-3 mb-4" style={{ color: "var(--text-primary)" }}>
              Get in Touch
            </h1>
            <div className="divider-gold" />
            <p className="mt-4 text-base max-w-md mx-auto" style={{ color: "var(--text-secondary)" }}>
              Interested in a sketch or a custom commission? Reach out through any of these channels.
            </p>
          </motion.div>
        </div>
      </div>

      <div className="section-container pb-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          {/* Left: Contact channels */}
          <div className="space-y-6">
            <h2 className="font-serif text-2xl font-semibold" style={{ color: "var(--text-primary)" }}>
              Reach Out Directly
            </h2>
            <div className="space-y-4">
              {channels.map((ch, i) => (
                <motion.a
                  key={ch.id}
                  id={ch.id}
                  href={ch.href}
                  target={ch.href.startsWith("mailto") ? undefined : "_blank"}
                  rel="noopener noreferrer"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                  whileHover={{ x: 6 }}
                  className="flex items-center gap-4 p-5 rounded-2xl transition-all duration-200 group block"
                  style={{
                    background: ch.bg,
                    border: `1px solid ${ch.border}`,
                  }}
                >
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
                    style={{ background: `${ch.color}20`, color: ch.color }}
                  >
                    {ch.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-sm" style={{ color: "var(--text-primary)" }}>
                      {ch.label}
                    </p>
                    <p className="text-xs mt-0.5" style={{ color: "var(--text-muted)" }}>
                      {ch.description}
                    </p>
                  </div>
                  <span className="text-sm font-medium flex-shrink-0" style={{ color: ch.color }}>
                    {ch.action} →
                  </span>
                </motion.a>
              ))}
            </div>

            {/* Info card */}
            <div
              className="p-5 rounded-2xl space-y-3 mt-6"
              style={{ background: "var(--glass-bg)", border: "1px solid var(--glass-border)" }}
            >
              <div className="flex items-center gap-3 text-sm" style={{ color: "var(--text-secondary)" }}>
                <MapPin size={16} style={{ color: "var(--accent)" }} />
                Based in India — ships worldwide
              </div>
              <div className="flex items-center gap-3 text-sm" style={{ color: "var(--text-secondary)" }}>
                <Clock size={16} style={{ color: "var(--accent)" }} />
                Response within 24 hours
              </div>
            </div>
          </div>

          {/* Right: Contact form */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <div
              className="p-8 rounded-3xl"
              style={{
                background: "var(--card-bg)",
                border: "1px solid var(--glass-border)",
                backdropFilter: "blur(20px)",
              }}
            >
              <h2 className="font-serif text-2xl font-semibold mb-6" style={{ color: "var(--text-primary)" }}>
                Send a Message
              </h2>
              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="block text-sm mb-2" style={{ color: "var(--text-secondary)" }}>
                    Your Name
                  </label>
                  <input
                    id="contact-name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="input-glass"
                    placeholder="Your name"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm mb-2" style={{ color: "var(--text-secondary)" }}>
                    Email
                  </label>
                  <input
                    id="contact-email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="input-glass"
                    placeholder="your@email.com"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm mb-2" style={{ color: "var(--text-secondary)" }}>
                    Message
                  </label>
                  <textarea
                    id="contact-message"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="input-glass"
                    placeholder="I'm interested in a custom portrait sketch..."
                    rows={5}
                    required
                    style={{ resize: "vertical" }}
                  />
                </div>
                <button type="submit" id="contact-submit-btn" className="btn-gold w-full justify-center">
                  <Send size={16} />
                  Send Message
                </button>
              </form>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
