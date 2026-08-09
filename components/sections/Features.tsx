"use client";

import Image from "next/image";
import React, { useEffect, useRef, useState } from "react";
import type { SectionProps } from "@/types";
import { cn } from "@/lib/utils";
import {
  CalendarCheck,
  Wallet,
  FileText,
  MessagesSquare,
  Bell,
  Users,
} from "lucide-react";

// ============================================================================
// FEATURES — "Una herramienta, todo bajo control"
// ============================================================================

function SunGlyph({
  rays = 12,
  className,
  style,
}: {
  rays?: number;
  className?: string;
  style?: React.CSSProperties;
}) {
  return (
    <svg viewBox="0 0 100 100" className={className} style={style} aria-hidden>
      {Array.from({ length: rays }).map((_, i) => {
        const angle = (i / rays) * 360;
        return (
          <path
            key={i}
            d="M50 30 C 53 20, 53 10, 50 2 C 47 10, 47 20, 50 30 Z"
            fill="currentColor"
            opacity={i % 2 === 0 ? 0.9 : 0.55}
            transform={`rotate(${angle} 50 50)`}
          />
        );
      })}
      <circle cx="50" cy="50" r="22" fill="currentColor" opacity="0.12" />
    </svg>
  );
}

function ArrowIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M5 12h14" />
      <path d="m12 5 7 7-7 7" />
    </svg>
  );
}

// 1. ACTUALIZAMOS EL ARRAY PARA USAR TUS IMÁGENES REALES
const features = [
  {
    icon: CalendarCheck,
    index: "01",
    name: "Cronograma y tareas",
    description: "Fechas límite, responsables y seguimiento en tiempo real.",
    // Foto: Agenda/Planner en tono claro
    image: "https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?q=80&w=600&auto=format&fit=crop",
  },
  {
    icon: Wallet,
    index: "02",
    name: "Gestión de pagos",
    description: "Registro claro de lo que se debe y lo que se ha pagado.",
    // Foto: Minimalista de finanzas/laptop
    image: "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?q=80&w=600&auto=format&fit=crop",
  },
  {
    icon: FileText,
    index: "03",
    name: "Documentos",
    description: "Contratos, menús, planos y más. Siempre disponibles.",
    // Foto: Papeles elegantes en escritorio claro
    image: "https://images.unsplash.com/photo-1606857521015-7f9fcf423740?q=80&w=600&auto=format&fit=crop",
  },
  {
    icon: MessagesSquare,
    index: "04",
    name: "Mensajería centralizada",
    description: "Comunicación directa con tu equipo y tus clientes.",
    // Foto: Celular en mano, tono cálido/comunicación
    image: "https://images.unsplash.com/photo-1512428559087-560fa5ceab42?q=80&w=600&auto=format&fit=crop",
  },
  {
    icon: Bell,
    index: "05",
    name: "Notificaciones",
    description: "Recordatorios automáticos para que nada se pase por alto.",
    // Foto: Minimalista de alertas/escritorio
    image: "https://images.unsplash.com/photo-1596526131083-e8c633c948d2?q=80&w=600&auto=format&fit=crop",
  },
  {
    icon: Users,
    index: "06",
    name: "Gestión de invitados",
    description: "Control de confirmaciones, mesas y requerimientos especiales.",
    // Foto: Mesa de boda elegante (Place settings)
    image: "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?q=80&w=600&auto=format&fit=crop",
  },
] as const;

export default function Features({ className }: SectionProps) {
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
      id="features"
      ref={sectionRef}
      onMouseMove={handleMouseMove}
      aria-labelledby="features-title"
      // Reduje py-24 a py-16 para ahorrar espacio vertical
      className={cn(
        "relative w-full scroll-mt-24 overflow-hidden bg-white px-6 py-16 text-text lg:py-20",
        className
      )}
      style={{ ["--mx" as string]: "50%", ["--my" as string]: "20%" }}
    >
      <span id="video" className="pointer-events-none absolute -top-24" aria-hidden="true" />
      
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@500;600&family=Alex+Brush&display=swap');
        
        @keyframes aurea-dial-spin {
          from { transform: rotate(0deg); }
          to   { transform: rotate(360deg); }
        }
        @keyframes aurea-dial-spin-reverse {
          from { transform: rotate(360deg); }
          to   { transform: rotate(0deg); }
        }
        @keyframes aurea-title-reveal {
          from { background-position: 100% 0; }
          to   { background-position: 0 0; }
        }
        @keyframes aurea-shimmer-spin {
          to { --shimmer-angle: 360deg; }
        }
        @property --shimmer-angle {
          syntax: '<angle>';
          initial-value: 0deg;
          inherits: false;
        }
        .aurea-dial-ring { animation: aurea-dial-spin 26s linear infinite; }
        .aurea-dial-ring-inner { animation: aurea-dial-spin-reverse 18s linear infinite; }

        .aurea-shimmer { position: relative; }
        .aurea-shimmer::before {
          content: "";
          position: absolute;
          inset: -1px;
          border-radius: 8px;
          padding: 1px;
          background: conic-gradient(
            from var(--shimmer-angle),
            transparent 0%,
            rgba(201,169,106,0.9) 8%,
            transparent 18%
          );
          -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
          -webkit-mask-composite: xor;
          mask-composite: exclude;
          opacity: 0.35;
          transition: opacity 300ms ease-out;
          animation: aurea-shimmer-spin 4s linear infinite;
          pointer-events: none;
        }
        .aurea-shimmer:hover::before { opacity: 1; }

        @media (prefers-reduced-motion: reduce) {
          .aurea-dial-ring, .aurea-dial-ring-inner,
          .aurea-shimmer::before, .aurea-title-anim {
            animation: none !important;
          }
        }
      `}</style>

      {/* Atmósfera de fondo */}
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <Image
          src="/images/features.png"
          alt="Fondo Features"
          fill
          className="object-cover"
          priority={false}
        />
      </div>
      <div className="pointer-events-none absolute inset-x-0 top-0 h-32 bg-linear-to-b from-black/12 to-transparent" />

      <div className="relative mx-auto max-w-6xl">
        
        {/* Header */}
        <div className="mx-auto mb-12 max-w-2xl text-center">
          <div className="mb-4 flex items-center justify-center gap-3">
            <div className="h-[2px] w-8 bg-accent" />
            <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-textSecondary">
              Panel de control
            </span>
            <div className="h-[2px] w-8 bg-accent" />
          </div>
          
          <h2 id="features-title" className="flex flex-col items-center justify-center">
            <span 
              className="text-text text-[1.75rem] font-medium leading-[1.15] sm:text-[2.15rem] lg:text-[2.4rem] block"
              style={{ fontFamily: "var(--font-title-serif, 'Playfair Display', serif)" }}
            >
              Una herramienta,
            </span>
            <span
              className="aurea-title-anim text-accent text-[2.6rem] sm:text-[3.4rem] lg:text-[4rem] -mt-1 sm:-mt-2 lg:-mt-4 tracking-wide block bg-clip-text text-transparent"
              style={{
                fontFamily: "var(--font-title-script, 'Alex Brush', cursive)",
                lineHeight: 1.1,
                backgroundImage: "linear-gradient(90deg, #C9A96A 0%, #E4CFA0 50%, #C9A96A 100%)",
                backgroundSize: "200% 100%",
                animation: "aurea-title-reveal 6s ease-in-out infinite alternate",
              }}
            >
              todo bajo control
            </span>
          </h2>

          <p className="mx-auto mt-4 max-w-md text-sm leading-relaxed text-textSecondary">
            Cada módulo se alimenta del anterior: nada queda aislado, nada se
            te escapa.
          </p>
        </div>

        {/* Tarjetas */}
        <div className="relative">
          {/* Se mantiene grid-cols-3 para conservar la simetría */}
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((item, i) => (
              <FeatureCard key={item.name} item={item} index={i} />
            ))}
          </div>
        </div>

        {/* BOTÓN */}
        <div className="mt-12 flex justify-center">
          <a
            href="#benefits"
            className="group inline-flex items-center gap-2 rounded-full bg-accent px-8 py-3.5 text-[13px] font-medium text-background transition-all hover:bg-accent/90 hover:scale-105 cursor-none shadow-[0_0_20px_rgba(201,169,106,0.3)]"
          >
            Conoce todos nuestros beneficios
            <span className="transition-transform duration-300 group-hover:translate-x-1 flex items-center">
              <ArrowIcon />
            </span>
          </a>
        </div>

      </div>
    </section>
  );
}

// ----------------------------------------------------------------------------
// FeatureCard
// ----------------------------------------------------------------------------
function FeatureCard({
  item,
  index,
}: {
  item: (typeof features)[number];
  index: number;
}) {
  const Icon = item.icon;
  const [ref, isVisible] = useInViewOnce<HTMLDivElement>();
  const [tilt, setTilt] = useState({ x: 0, y: 0 });

  const handleMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width - 0.5;
    const py = (e.clientY - rect.top) / rect.height - 0.5;
    setTilt({ x: py * -6, y: px * 8 });
  };
  const resetTilt = () => setTilt({ x: 0, y: 0 });

  return (
    <div
      ref={ref}
      className="group h-full"
      style={{
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? "translateY(0)" : "translateY(18px)",
        transition: "opacity 700ms ease-out, transform 700ms ease-out",
        transitionDelay: isVisible ? `${index * 100}ms` : "0ms",
      }}
    >
      <article
        onMouseMove={handleMove}
        onMouseLeave={resetTilt}
        // Reduje p-5 a p-4 para compactar la tarjeta
        className="aurea-shimmer group relative h-full overflow-hidden rounded-lg border border-border bg-white p-4"
        style={{
          transform: `perspective(800px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`,
          transition: "transform 200ms ease-out, border-color 300ms ease-out",
          transformStyle: "preserve-3d",
        }}
      >
        <span
          aria-hidden
          className="pointer-events-none absolute right-3 top-3 z-10 select-none font-serif text-5xl font-light text-accent/[0.35]"
          style={{ WebkitTextStroke: "0.5px rgba(201,169,106,0.28)" }}
        >
          {item.index}
        </span>

        {/* Imagen principal: Más pequeña (h-28) y usa la imagen local */}
        <div className="group/img relative -mx-4 -mt-4 mb-4 h-28 overflow-hidden bg-stone-100">
          <Image
            src={item.image}
            alt={item.name}
            fill
            className="object-cover transition-transform duration-500 ease-out group-hover/img:scale-105"
          />
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0"
            style={{
              background:
                "linear-gradient(180deg, rgba(0,0,0,0.05) 0%, rgba(0,0,0,0.25) 100%)",
            }}
          />
        </div>

        {/* Ícono de Sol y Herramienta (ligeramente más pequeño) */}
        <div className="relative mb-3 h-10 w-10">
          <SunGlyph
            rays={12}
            className="aurea-dial-ring absolute inset-0 h-full w-full text-accent/55"
          />
          <svg
            viewBox="0 0 48 48"
            className="aurea-dial-ring-inner absolute inset-0 h-full w-full text-accent/70"
          >
            <circle cx="24" cy="24" r="17" fill="none" stroke="currentColor" strokeWidth="1" strokeDasharray="3 5" />
          </svg>
          <div className="absolute inset-[8px] flex items-center justify-center rounded-full bg-muted text-accent transition-colors duration-300 group-hover:bg-accent group-hover:text-background">
            <Icon size={14} strokeWidth={1.5} />
          </div>
        </div>

        <h3 className="relative mb-1 text-sm font-semibold text-text">
          {item.name}
        </h3>

        <p className="relative text-xs leading-relaxed text-textSecondary">
          {item.description}
        </p>

        <div className="relative mt-3 h-px w-0 bg-accent transition-all duration-300 group-hover:w-8" />
      </article>
    </div>
  );
}

// ----------------------------------------------------------------------------
// useInViewOnce
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