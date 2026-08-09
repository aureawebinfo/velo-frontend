"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/cn";
import { useInView } from "@/lib/useInView";
import type { SectionProps } from "@/types";
import { Sparkles } from "lucide-react";
import DriftWall from "@/components/effects/DriftWall";
import Image from "next/image";

const VENUE_IMAGES = [
  { image: "/images/gallery/1.png", title: "Montaje Imperial", href: undefined },
  { image: "/images/gallery/2.png", title: "Recepción Campestre", href: undefined },
  { image: "/images/gallery/3.png", title: "Ceremonia al aire libre", href: undefined },
  { image: "/images/gallery/4.png", title: "Detalles florales premium", href: undefined },
  { image: "/images/gallery/5.png", title: "Mesa de novios", href: undefined },
  { image: "/images/gallery/6.png", title: "Interiores de lujo", href: undefined },
  { image: "/images/gallery/7.png", title: "Silletería Tiffany", href: undefined },
  { image: "/images/gallery/8.png", title: "Cristalería fina", href: undefined },
  { image: "/images/gallery/9.png", title: "Iluminación romántica", href: undefined },
  { image: "/images/gallery/10.png", title: "Mesa de postres", href: undefined },
  { image: "/images/gallery/1.png", title: "Lounge para invitados", href: undefined },
  { image: "/images/gallery/2.png", title: "Atardecer en terrazas", href: undefined },
  { image: "/images/gallery/3.png", title: "Estilo minimalista", href: undefined },
  { image: "/images/gallery/4.png", title: "Candelabros y decoración", href: undefined },
  { image: "/images/gallery/5.png", title: "Zonas verdes", href: undefined },
];

export default function VenueGallery({ className }: SectionProps) {
  const { ref, isInView } = useInView({ threshold: 0.1 });
  
  const [wallConfig, setWallConfig] = useState({
    columns: 5,
    tileWidth: 220,
    tileHeight: 150,
    gap: 18,
  });

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      if (width < 640) {
        // CORRECCIÓN 1: Tarjetas ligeramente más proporcionales para celular
        setWallConfig({ columns: 2, tileWidth: 155, tileHeight: 115, gap: 12 });
      } else if (width < 1024) {
        setWallConfig({ columns: 3, tileWidth: 180, tileHeight: 120, gap: 14 });
      } else {
        setWallConfig({ columns: 5, tileWidth: 220, tileHeight: 150, gap: 18 });
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <section
      id="gallery"
      ref={ref}
      className={cn(
        "relative w-full overflow-hidden bg-[#FAF5F2] px-4 py-16 text-[#2b2625] sm:px-6 lg:py-28",
        className
      )}
    >
      {/* Fondo con leve tinte crema/blush pastel */}
      <div className="absolute inset-0 -z-10 bg-[#FAF5F2]">
        <Image
          src="/images/BrandCustomization.png"
          alt=""
          fill
          sizes="100vw"
          className="object-cover opacity-15 mix-blend-multiply"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#FAF5F2]/40 via-transparent to-[#FAF5F2]/80" />
      </div>

      {/* ── FUNDIDO SUPERIOR ── */}
      {/* CORRECCIÓN 2: h-16 en móvil, h-32 en escritorio para no cortar tanto las imágenes */}
      <div className="pointer-events-none absolute inset-x-0 top-0 z-20 h-16 sm:h-32 bg-gradient-to-b from-white via-[#FAF5F2]/80 to-transparent" />

      {/* Encabezado */}
      <div className="mx-auto mb-10 max-w-2xl text-center relative z-20 sm:mb-14">
        <div className="mb-4 flex items-center justify-center gap-2">
          <Sparkles className="h-3.5 w-3.5 text-accent" />
          <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-accent sm:text-[11px]">
            Tu vitrina digital
          </span>
          <Sparkles className="h-3.5 w-3.5 text-accent" />
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
        
        <p className="mx-auto mt-4 max-w-lg text-xs leading-relaxed text-[#6e6360] sm:text-sm md:text-base">
          Eleva el prestigio de tu locación. Brinda a los novios una experiencia inmersiva para que visualicen su gran día en tus instalaciones antes de su primera visita.
        </p>
      </div>

      {/* Contenedor del DriftWall ajustado dinámicamente */}
      <div
        className={cn(
          "animate-fade-up relative mx-auto h-[500px] sm:h-[520px] lg:h-[620px] w-full max-w-7xl bg-[#FAF5F2] rounded-2xl overflow-hidden",
          isInView && "visible"
        )}
      >
        <DriftWall
          items={[...VENUE_IMAGES, ...VENUE_IMAGES, ...VENUE_IMAGES, ...VENUE_IMAGES]}
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
          parallax={0.4}
          lift={48}
          fade={0.1}
          radius={12}
          pauseOnHover={false}
          grayscale={false}
          style={{}}
        />
      </div>

      {/* ── FUNDIDO INFERIOR ── */}
      {/* CORRECCIÓN 4: Igual que arriba, h-20 en móvil para no tapar tanto */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 z-20 h-20 sm:h-32 bg-gradient-to-t from-white via-[#FAF5F2]/80 to-transparent" />
    </section>
  );
}