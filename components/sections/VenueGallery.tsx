"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/cn";
import { useInView } from "@/lib/useInView";
import type { SectionProps } from "@/types";
import { Sparkles } from "lucide-react";
import DriftWall from "@/components/effects/DriftWall";
import Image from "next/image";

// 1. SOLO IMÁGENES ÚNICAS: Quitamos los duplicados del arreglo original.
const UNIQUE_VENUES = [
  { image: "/images/gallery/1.webp", title: "Montaje Imperial", href: undefined },
  { image: "/images/gallery/2.webp", title: "Recepción Campestre", href: undefined },
  { image: "/images/gallery/3.webp", title: "Ceremonia al aire libre", href: undefined },
  { image: "/images/gallery/4.webp", title: "Detalles florales premium", href: undefined },
  { image: "/images/gallery/5.webp", title: "Mesa de novios", href: undefined },
  { image: "/images/gallery/6.webp", title: "Interiores de lujo", href: undefined },
  { image: "/images/gallery/7.webp", title: "Silletería Tiffany", href: undefined },
  { image: "/images/gallery/8.webp", title: "Cristalería fina", href: undefined },
  { image: "/images/gallery/9.webp", title: "Iluminación romántica", href: undefined },
  { image: "/images/gallery/10.webp", title: "Mesa de postres", href: undefined },
];

// 2. MEZCLA PERFECTA Y SIN HUECOS (240 elementos).
const DISPLAY_IMAGES = Array.from({ length: 240 }, (_, i) => {
  const mixedIndex = (i * 27 + Math.floor(i / 13) * 11) % UNIQUE_VENUES.length;
  return UNIQUE_VENUES[mixedIndex];
});

export default function VenueGallery({ className }: SectionProps) {
  const { ref, isInView } = useInView({ threshold: 0.1 });
  
  const [wallConfig, setWallConfig] = useState({
    columns: 5,
    tileWidth: 220,
    tileHeight: 150,
    gap: 18,
  });

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;

    const handleResize = () => {
      clearTimeout(timeoutId);
      
      timeoutId = setTimeout(() => {
        const width = window.innerWidth;
        let newConfig;

        if (width < 640) {
          newConfig = { columns: 3, tileWidth: 155, tileHeight: 115, gap: 12 };
        } else if (width < 1024) {
          newConfig = { columns: 4, tileWidth: 180, tileHeight: 120, gap: 14 };
        } else {
          newConfig = { columns: 5, tileWidth: 220, tileHeight: 150, gap: 18 };
        }

        setWallConfig((prev) => (prev.columns !== newConfig.columns ? newConfig : prev));
      }, 150);
    };

    handleResize(); 
    window.addEventListener("resize", handleResize);
    return () => {
      clearTimeout(timeoutId);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <section
      id="gallery"
      ref={ref}
      // Revertido al color crema/blanco original
      className={cn(
        "relative w-full overflow-hidden px-4 py-16 text-[#2b2625] sm:px-6 lg:py-28",
        className
      )}
    >
      <div className="absolute inset-0 -z-10 bg-[#FAF5F2]">
        <Image
          src="/images/gallery.webp"
          alt=""
          fill
          sizes="100vw"
          className="object-cover opacity-90 mix-blend-multiply"
          priority
        />
        {/* Revertido el degradado inferior */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#FAF5F2]/40 via-transparent to-[#FAF5F2]/80" />
      </div>

      <div className="pointer-events-none absolute inset-x-0 top-0 z-20 h-22 sm:h-26 bg-gradient-to-b from-white via-[#FAF5F2]/80 to-transparent" />

      <div className="mx-auto mb-10 max-w-3xl text-center relative z-20 sm:mb-14">
        
        {/* TEXTO 1: "Tu vitrina digital" resaltado con diseño de etiqueta (pill) */}
        <div className="mb-6 flex items-center justify-center gap-3">
          <Sparkles className="h-4 w-4 text-accent" />
          <span className="rounded-full bg-accent/10 px-4 py-1.5 font-mono text-xs sm:text-sm font-bold uppercase tracking-[0.25em] text-accent shadow-sm border border-accent/20 backdrop-blur-md">
            Tu vitrina digital
          </span>
          <Sparkles className="h-4 w-4 text-accent" />
        </div>
        
        <h2 className="text-3xl font-semibold leading-[1.15] tracking-tight text-[#2b2625] sm:text-4xl lg:text-[2.75rem]">
          Haz que se enamoren de{" "}
          <span
            className="text-accent block mt-1"
            style={{
              fontFamily: "var(--font-title-script, 'Alex Brush', cursive)",
              fontSize: "1.4em",
            }}
          >
            tus espacios
          </span>
        </h2>
        
        {/* TEXTO 2: "Eleva el prestigio..." más grande, oscuro y con mayor peso visual */}
        <p className="mx-auto mt-6 max-w-2xl text-sm sm:text-base md:text-lg font-medium leading-relaxed text-[#3d3634] drop-shadow-sm">
          Eleva el prestigio de tu locación. Brinda a los novios una experiencia inmersiva para que visualicen su gran día en tus instalaciones antes de su primera visita.
        </p>
      </div>

      <div
        className={cn(
          "animate-fade-up relative mx-auto h-[450px] sm:h-[520px] lg:h-[620px] w-full max-w-7xl rounded-2xl overflow-hidden shadow-sm",
          isInView && "visible"
        )}
      >
        <div className="absolute top-1/2 left-1/2 h-[140%] w-[140%] -translate-x-1/2 -translate-y-1/2 transform-gpu pointer-events-none">
          <DriftWall
            items={DISPLAY_IMAGES}
            columns={wallConfig.columns}
            tileWidth={wallConfig.tileWidth}
            tileHeight={wallConfig.tileHeight}
            gap={wallConfig.gap}
            tilt={12}
            turn={-10}
            perspective={1000}
            depth={100}
            speed={25}
            direction="up"
            variance={0.35}
            parallax={0} 
            lift={0}
            fade={0.1}
            radius={12}
            pauseOnHover={false}
            grayscale={false}
            style={{}} 
          />
        </div>
      </div>

      {/* Revertido a la transición original */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 z-20 h-24 sm:h-32 bg-gradient-to-t from-white via-[#FAF5F2]/80 to-transparent" />
    </section>
  );
}