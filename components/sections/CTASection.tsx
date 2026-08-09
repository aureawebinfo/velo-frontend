"use client";

import Link from "next/link";
import type { SectionProps } from "@/types";
import GradientWaves from "@/components/effects/GradientWaves";

// Fondo: ondas doradas suaves sobre negro — cierre elegante y minimal.
export default function CTASection({ className }: SectionProps) {
  return (
    <section
      id="cta"
      className={`relative flex min-h-[70vh] w-full items-center justify-center overflow-hidden bg-background px-6 py-28 text-center text-foreground md:min-h-[80vh] ${
        className ?? ""
      }`}
    >
      {/* ---------------------------------------------------------------- */}
      {/* Fondo animado: olas de gradiente en tonos dorado/negro           */}
      {/* ---------------------------------------------------------------- */}
      <div aria-hidden className="absolute inset-0">
        <GradientWaves
          horizonColor="#000000"
          waveColor="#8A6A2E"
          crestColor="#F1D97A"
          speed={0.3}
          amplitude={3}
          waveScale={0.6}
          waveRatio={0.9}
          swell={35}
          turbulence={18}
          tilt={1.15}
          zoom={1.1}
          height={4.5}
          fogDepth={20}
          detail="medium"
          brightness={1.3}
          opacity={1}
          mouseInteraction
          parallaxStrength={0.35}
          grain
          grainIntensity={0.04}
        />
        {/* Velo para que el texto siempre sea legible sobre las olas */}
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-background/70" />

        {/* Fundido hacia negro puro en el borde inferior, para unir con el Footer */}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-40 bg-gradient-to-b from-transparent to-black" />
      </div>

      {/* ---------------------------------------------------------------- */}
      {/* Contenido                                                        */}
      {/* ---------------------------------------------------------------- */}
      <div className="relative mx-auto flex max-w-3xl flex-col items-center gap-8">
        <h2 className="text-4xl leading-[1.15] tracking-tight text-foreground md:text-6xl">
          <span className="font-serif font-medium">
            ¿Listo para llevar tu gestión
          </span>
          <br />
          <span
            className="text-accent text-[1.15em]"
            style={{
              fontFamily: "var(--font-title-script, 'Alex Brush', cursive)",
            }}
          >
            al siguiente nivel?
          </span>
        </h2>

        <Link
          href="https://wa.me/573002477019?text=Hola%20%C3%81urea%20Web%2C%20me%20gustar%C3%ADa%20recibir%20m%C3%A1s%20informaci%C3%B3n%20sobre%20sus%20servicios."
          className="group inline-flex items-center gap-2 text-sm font-medium tracking-wide text-foreground/80 transition-colors hover:text-accent"
        >
          <span className="h-px w-8 bg-accent/50 transition-all duration-300 group-hover:w-12 group-hover:bg-accent" />
          Solicita tu demo
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="transition-transform duration-300 group-hover:translate-x-1"
          >
            <path d="M5 12h14" />
            <path d="m12 5 7 7-7 7" />
          </svg>
        </Link>
      </div>
    </section>
  );
}
