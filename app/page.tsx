import Navbar from "@/components/sections/Navbar";
import Hero from "@/components/sections/Hero";
import SectionBridge from "@/components/effects/SectionBridge";
import Features from "@/components/sections/Features";
import Benefits from "@/components/sections/Benefits";
import Stats from "@/components/sections/Stats";
import ProductShowcase from "@/components/sections/ProductShowcase";
import VenueGallery from "@/components/sections/VenueGallery";
import BusinessValue from "@/components/sections/BusinessValue";
import Pricing from "@/components/sections/Pricing";
import Testimonials from "@/components/sections/Testimonials";
import CTASection from "@/components/sections/CTASection";
import Footer from "@/components/sections/Footer";

// 1. IMPORTA EL COMPONENTE
import WhatsAppButton from "@/components/ui/WhatsAppButton"; // Ajusta la ruta si lo guardaste en otro lado

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
      
      {/* 2. COLOCA EL BOTÓN AQUÍ AL FINAL */}
      <WhatsAppButton />
    </main>
  );
}