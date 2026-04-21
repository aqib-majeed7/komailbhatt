import type { Metadata } from "next";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import ContactPageClient from "./ContactClient";

export const metadata: Metadata = {
  title: "Contact – Komail Art | Get in Touch",
  description:
    "Contact Komail to purchase a sketch or commission original artwork. Reach out via WhatsApp, Instagram, or email.",
};

export default function ContactPage() {
  return (
    <>
      <Navbar />
      <main>
        <ContactPageClient />
      </main>
      <Footer />
    </>
  );
}
