"use client";

import { useEffect, useRef, useState } from "react";
import type { SectionProps } from "@/types";
import { cn } from "@/lib/cn";

// ============================================================================
// STATS — franja de métricas (sin título visible)
// ----------------------------------------------------------------------------
// Fondo: negro. Franja delgada con separadores verticales finos entre datos.
// 5 métricas en fila: nº de casas de eventos, nº de bodas gestionadas, sello
// dorado central (monograma), % de parejas satisfechas y % de reducción de
// consultas repetitivas. Número grande en blanco con la etiqueta descriptiva
// pequeña en gris debajo.
//
// Detalles visuales:
//  • Sello central: emblema dorado con doble aro, texto circular "ÁUREA ·
//    PORTAL NOVIOS" girando muy lento (80s) y monograma "Á" estático — la
//    misma metáfora del dial de Features/Benefits pero como sello de marca.
//  • Sufijos "+" y "%" en dorado, números con tabular-nums (sin salto de
//    ancho mientras cuentan) y etiquetas en gris suave.
//  • Atmósfera sutil: puntos de fondo, halo dorado detrás del sello y el
//    resplandor radial que sigue al mouse (mismo lenguaje que la landing).
//  • Separadores verticales solo en md+ (divide-x); en móvil el sello ocupa
//    el ancho completo y las métricas se apilan en 2 columnas.
//
// Animación: los números cuentan de 0 al valor final en 1000ms (ease-out)
// cuando la franja entra al viewport, con fade-up escalonado (100ms por
// columna). Sin animaciones ligadas al scroll.
// ============================================================================

const stats = [
  {
    value: 15,
    suffix: "h",
    label: "Ahorradas al mes por evento en tareas administrativas",
  },
  {
    value: 3,
    suffix: "x",
    label: "Más rápido el seguimiento de pagos pendientes",
  },
  {
    value: 62,
    suffix: "%",
    label: "Menos consultas repetitivas para tu equipo",
  },
  {
    value: 24,
    suffix: "/7",
    label: "Acceso al portal para tu equipo y tus clientes",
  },
] as const;

export default function Stats({ className }: SectionProps) {
  const sectionRef = useRef<HTMLElement>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLElement>) => {
    const rect = sectionRef.current?.getBoundingClientRect();
    if (!rect) return;
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    sectionRef.current?.style.setProperty("--mx", `${x}%`);
    sectionRef.current?.style.setProperty("--my", `${y}%`);
  };

  return (
    <section
      id="stats"
      ref={sectionRef}
      onMouseMove={handleMouseMove}
      aria-label="Estadísticas de Áurea"
      className={cn(
        "relative w-full overflow-hidden border-y border-border/20 bg-background px-6 py-12 text-foreground lg:py-14",
        className
      )}
      style={{ ["--mx" as string]: "50%", ["--my" as string]: "20%" }}
    >
      <style>{`
        @keyframes aurea-seal-spin {
          from { transform: rotate(0deg); }
          to   { transform: rotate(360deg); }
        }
        @keyframes aurea-drift-a {
          0%, 100% { transform: translate(0, 0) scale(1); }
          50%      { transform: translate(24px, 16px) scale(1.05); }
        }
        @keyframes aurea-drift-b {
          0%, 100% { transform: translate(0, 0) scale(1); }
          50%      { transform: translate(-26px, 12px) scale(1.04); }
        }
        .aurea-seal-spin { animation: aurea-seal-spin 80s linear infinite; }

        @media (prefers-reduced-motion: reduce) {
          .aurea-seal-spin, .aurea-anim-a, .aurea-anim-b {
            animation: none !important;
          }
        }
      `}</style>

      {/* ---------------------------------------------------------------- */}
      {/* Atmósfera de fondo (sutil, la franja es delgada) */}
      {/* ---------------------------------------------------------------- */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage:
            "radial-gradient(circle at 1px 1px, rgba(232,229,223,0.35) 1.2px, transparent 0)",
          backgroundSize: "26px 26px",
          opacity: 0.35,
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 transition-opacity duration-300"
        style={{
          background:
            "radial-gradient(460px circle at var(--mx) var(--my), rgba(201,169,106,0.09), transparent 65%)",
        }}
      />
      {/* Halo dorado fijo detrás del sello central */}
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-1/2 h-[440px] w-[440px] -translate-x-1/2 -translate-y-1/2 rounded-full"
        style={{
          background:
            "radial-gradient(circle, rgba(201,169,106,0.10) 0%, rgba(201,169,106,0) 70%)",
        }}
      />
      <div
        aria-hidden
        className="aurea-anim-a pointer-events-none absolute -left-24 -top-24 h-[280px] w-[280px] rounded-full"
        style={{
          background:
            "radial-gradient(circle, rgba(201,169,106,0.08) 0%, rgba(201,169,106,0) 70%)",
          animation: "aurea-drift-a 18s ease-in-out infinite",
        }}
      />
      <div
        aria-hidden
        className="aurea-anim-b pointer-events-none absolute -bottom-24 -right-24 h-[280px] w-[280px] rounded-full"
        style={{
          background:
            "radial-gradient(circle, rgba(201,169,106,0.07) 0%, rgba(201,169,106,0) 70%)",
          animation: "aurea-drift-b 21s ease-in-out infinite",
        }}
      />

      <div className="relative mx-auto max-w-6xl">
        <StatsGrid />
      </div>
    </section>
  );
}

// ----------------------------------------------------------------------------
// StatsGrid: una sola grilla con las 4 métricas y el sello central. Un único
// observador de viewport dispara el fade-up escalonado y los contadores.
// ----------------------------------------------------------------------------
function StatsGrid() {
  const [ref, visible] = useInViewOnce<HTMLDivElement>();

  return (
    <div
      ref={ref}
      className="grid grid-cols-2 md:grid-cols-5 md:divide-x md:divide-border/15"
    >
      <Stat {...stats[0]} index={0} visible={visible} />
      <Stat {...stats[1]} index={1} visible={visible} />
      <Seal index={2} visible={visible} />
      <Stat {...stats[2]} index={3} visible={visible} />
      <Stat {...stats[3]} index={4} visible={visible} />
    </div>
  );
}

// ----------------------------------------------------------------------------
// Stat: número grande en blanco (con sufijo dorado) + etiqueta gris debajo.
// El contador arranca en 0 y sube al valor final en 1000ms.
// ----------------------------------------------------------------------------
function Stat({
  value,
  suffix,
  label,
  index,
  visible,
}: {
  value: number;
  suffix: string;
  label: string;
  index: number;
  visible: boolean;
}) {
  const count = useCountUp(value, visible);
  const shown = Math.round(count).toLocaleString("es-CO");

  return (
    <div
      className="flex flex-col items-center justify-center px-4 py-9 text-center sm:px-6"
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(18px)",
        transition: "opacity 700ms ease-out, transform 700ms ease-out",
        transitionDelay: visible ? `${index * 100}ms` : "0ms",
      }}
    >
      <span className="text-3xl font-semibold tabular-nums tracking-tight text-foreground lg:text-4xl">
        {shown}
        <span className="text-accent">{suffix}</span>
      </span>
      <span className="mt-2.5 max-w-[190px] text-xs leading-snug text-foreground/50">
        {label}
      </span>
    </div>
  );
}

// ----------------------------------------------------------------------------
// Seal: emblema dorado central. El aro exterior con el texto circular rota muy
// lento (80s); el monograma "Á" se mantiene erguido al centro.
// ----------------------------------------------------------------------------
function Seal({ index, visible }: { index: number; visible: boolean }) {
  return (
    <div
      role="img"
      aria-label="Sello de Áurea"
      className="col-span-2 flex items-center justify-center py-6 md:col-span-1 md:py-9"
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(18px)",
        transition: "opacity 700ms ease-out, transform 700ms ease-out",
        transitionDelay: visible ? `${index * 100}ms` : "0ms",
      }}
    >
      <div className="relative h-20 w-20 lg:h-24 lg:w-24">
        <svg
          viewBox="0 0 120 120"
          className="aurea-seal-spin absolute inset-0 h-full w-full text-accent"
          aria-hidden
        >
          <defs>
            <path
              id="aurea-seal-path"
              d="M60 60 m-42 0 a42 42 0 1 1 84 0 a42 42 0 1 1 -84 0"
              fill="none"
            />
          </defs>
          <circle
            cx="60"
            cy="60"
            r="57"
            fill="none"
            stroke="currentColor"
            strokeWidth="1"
            opacity="0.45"
          />
          <circle
            cx="60"
            cy="60"
            r="50"
            fill="none"
            stroke="currentColor"
            strokeWidth="0.75"
            strokeDasharray="2 5"
            opacity="0.55"
          />
          <text
            fontSize="10"
            fill="currentColor"
            letterSpacing="2"
            opacity="0.85"
            fontFamily="Georgia, 'Times New Roman', serif"
          >
            <textPath href="#aurea-seal-path">
              VELO · VELO · VELO · VELO · VELO
            </textPath>
          </text>
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="font-serif text-3xl text-accent lg:text-4xl">
            V
          </span>
        </div>
      </div>
    </div>
  );
}

// ----------------------------------------------------------------------------
// useCountUp: cuenta de 0 al valor final con ease-out cúbico en 1000ms.
// Se apaga la animación con prefers-reduced-motion (salta directo al final).
// ----------------------------------------------------------------------------
function useCountUp(target: number, start: boolean): number {
  const [value, setValue] = useState(0);
  const rafRef = useRef(0);

  useEffect(() => {
    if (!start) return;

    if (
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      setValue(target);
      return;
    }

    const duration = 1000;
    const startTime = performance.now();

    const tick = (now: number) => {
      const progress = Math.min((now - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setValue(target * eased);
      if (progress < 1) {
        rafRef.current = requestAnimationFrame(tick);
      }
    };

    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [start, target]);

  return value;
}

// ----------------------------------------------------------------------------
// useInViewOnce: dispara la animación una sola vez al entrar al viewport.
// ----------------------------------------------------------------------------
function useInViewOnce<T extends HTMLElement>(): [
  React.RefObject<T | null>,
  boolean
] {
  const ref = useRef<T>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.2 }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return [ref, isVisible];
}
