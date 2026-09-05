import Navbar from "@/components/sections/Navbar";
import Hero from "@/components/sections/Hero";
import SectionBridge from "@/components/effects/SectionBridge";
import Features from "@/components/sections/Features";
import Benefits from "@/components/sections/Benefits";
import Stats from "@/components/sections/Stats";
import Footer from "@/components/sections/Footer";
import WhatsAppButton from "@/components/ui/WhatsAppButton";
import dynamic from "next/dynamic";
import CTASection from "@/components/sections/CTASectionLazy"; // <-- wrapper client-only

const ProductShowcase = dynamic(() => import("@/components/sections/ProductShowcase"));
const VenueGallery = dynamic(() => import("@/components/sections/VenueGallery"));
const BusinessValue = dynamic(() => import("@/components/sections/BusinessValue"));
const Pricing = dynamic(() => import("@/components/sections/Pricing"));
const Testimonials = dynamic(() => import("@/components/sections/Testimonials"));

export default function Home() {
  return (
    <main className="flex w-full flex-col relative">
      <Navbar />
      <Hero />
      <div className="relative h-0 overflow-visible">
        <SectionBridge />
      </div>
      <Features />
      <Benefits />
      <Stats />
      <ProductShowcase />
      <VenueGallery />
      <BusinessValue />
      <Pricing />
      <Testimonials />
      <CTASection />
      <Footer />

      <WhatsAppButton />
    </main>
  );
}