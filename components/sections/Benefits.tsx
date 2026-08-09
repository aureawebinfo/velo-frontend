"use client";

import { useEffect, useRef, useState } from "react";
import type { SectionProps } from "@/types";
import { cn } from "@/lib/cn";
import {
  ArrowRight,
  Timer,
  ShieldCheck,
  TrendingUp,
  Gem,
  Gauge,
  Star,
} from "lucide-react";

// ============================================================================
// BENEFITS — "Más eficiencia. Más control. Más rentabilidad."
// ============================================================================

const benefits = [
  {
    icon: Timer,
    number: "01",
    title: "Ahorra tiempo",
    description:
      "Automatiza recordatorios y seguimientos. Tu equipo 100% enfocado en el evento.",
  },
  {
    icon: ShieldCheck,
    number: "02",
    title: "Menos errores",
    description:
      "Información centralizada. Nada se duplica, nada se pierde, nada se olvida.",
  },
  {
    icon: TrendingUp,
    number: "03",
    title: "Más clientes",
    description:
      "Una experiencia premium que se convierte en tu mejor herramienta de recomendación.",
  },
  {
    icon: Gem,
    number: "04",
    title: "Diferénciate",
    description:
      "Un portal con tu marca e identidad. La imagen profesional que justifica tu precio.",
  },
  {
    icon: Gauge,
    number: "05",
    title: "Control total",
    description:
      "Visibilidad absoluta de cada boda, desde la primera consulta hasta el final.",
  },
  {
    icon: Star,
    number: "06",
    title: "Paz mental",
    description:
      "Reduce el estrés operativo. Disfruta de organizar eventos sin caos ni desorden.",
  },
] as const;

type Benefit = (typeof benefits)[number];

const collagePhotos = [
  {
    seed: "aurea-boda-recepcion",
    alt: "Recepción de una boda gestionada con Áurea",
    wrapper: "left-0 top-5 z-0",
    rotation: "-rotate-6",
    floatDelay: "0s",
  },
  {
    seed: "aurea-boda-detalle",
    alt: "Detalles de mesa de un evento organizado con Áurea",
    wrapper: "left-1/2 top-0 z-10 -translate-x-1/2",
    rotation: "rotate-2",
    floatDelay: "1.2s",
  },
  {
    seed: "aurea-boda-marca",
    alt: "Equipo de una casa de eventos trabajando con su portal Áurea",
    wrapper: "right-0 top-8 z-20",
    rotation: "rotate-6",
    floatDelay: "2.1s",
  },
] as const;

export default function Benefits({ className }: SectionProps) {
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
      id="benefits"
      ref={sectionRef}
      onMouseMove={handleMouseMove}
      aria-labelledby="beneficios-title"
      className={cn(
        "relative w-full scroll-mt-24 overflow-hidden bg-background px-6 py-24 text-foreground lg:py-28",
        className
      )}
      style={{ ["--mx" as string]: "50%", ["--my" as string]: "20%" }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@500;600&family=Alex+Brush&display=swap');
        
        @keyframes aurea-dial-spin-slow {
          from { transform: translate(-50%, -50%) rotate(0deg); }
          to   { transform: translate(-50%, -50%) rotate(360deg); }
        }
        @keyframes aurea-drift-a {
          0%, 100% { transform: translate(0, 0) scale(1); }
          50%      { transform: translate(34px, 22px) scale(1.06); }
        }
        @keyframes aurea-drift-b {
          0%, 100% { transform: translate(0, 0) scale(1); }
          50%      { transform: translate(-40px, 16px) scale(1.04); }
        }
        @keyframes aurea-title-reveal {
          from { background-position: 100% 0; }
          to   { background-position: 0 0; }
        }
        @keyframes aurea-shimmer-spin {
          to { --shimmer-angle: 360deg; }
        }
        @keyframes aurea-signal-travel {
          0%   { left: -6%; opacity: 0; }
          8%   { opacity: 1; }
          92%  { opacity: 1; }
          100% { left: 104%; opacity: 0; }
        }
        @keyframes aurea-float {
          0%, 100% { transform: translateY(0); }
          50%      { transform: translateY(-10px); }
        }
        @property --shimmer-angle {
          syntax: '<angle>';
          initial-value: 0deg;
          inherits: false;
        }
        .aurea-dial-giant { animation: aurea-dial-spin-slow 90s linear infinite; }
        .aurea-signal-pulse { animation: aurea-signal-travel 5s ease-in-out infinite; }

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
            rgba(201,169,106,0.8) 8%,
            transparent 18%
          );
          -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
          -webkit-mask-composite: xor;
          mask-composite: exclude;
          opacity: 0.28;
          transition: opacity 350ms ease-out;
          animation: aurea-shimmer-spin 4.5s linear infinite;
          pointer-events: none;
        }
        .aurea-shimmer:hover::before { opacity: 1; }

        @media (prefers-reduced-motion: reduce) {
          .aurea-dial-giant, .aurea-signal-pulse, .aurea-shimmer::before,
          .aurea-drift-a, .aurea-drift-b, .aurea-float, .aurea-title-anim {
            animation: none !important;
          }
        }
      `}</style>

      {/* Atmósfera de fondo */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage:
            "radial-gradient(circle at 1px 1px, rgba(232,229,223,0.4) 1.2px, transparent 0)",
          backgroundSize: "26px 26px",
          maskImage:
            "radial-gradient(ellipse 80% 60% at 50% 0%, black 0%, transparent 75%)",
          WebkitMaskImage:
            "radial-gradient(ellipse 80% 60% at 50% 0%, black 0%, transparent 75%)",
          opacity: 0.45,
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 transition-opacity duration-300"
        style={{
          background:
            "radial-gradient(520px circle at var(--mx) var(--my), rgba(201,169,106,0.10), transparent 65%)",
        }}
      />
      <div
        aria-hidden
        className="aurea-drift-a pointer-events-none absolute -right-44 -top-44 h-[600px] w-[600px] rounded-full"
        style={{
          background:
            "radial-gradient(circle, rgba(201,169,106,0.14) 0%, rgba(201,169,106,0) 70%)",
          animation: "aurea-drift-a 18s ease-in-out infinite",
        }}
      />
      <div
        aria-hidden
        className="aurea-drift-b pointer-events-none absolute -bottom-52 -left-36 h-[520px] w-[520px] rounded-full"
        style={{
          background:
            "radial-gradient(circle, rgba(201,169,106,0.10) 0%, rgba(201,169,106,0) 70%)",
          animation: "aurea-drift-b 22s ease-in-out infinite",
        }}
      />

      <SunGlyph
        rays={20}
        className="aurea-dial-giant pointer-events-none absolute left-2/3 top-1/2 h-[720px] w-[720px] text-accent"
        style={{ opacity: 0.05 }}
      />

      <div className="relative mx-auto max-w-6xl">
        <div className="grid gap-14 lg:grid-cols-[5fr_7fr] lg:gap-12">
          <LeftColumn />

          <div className="lg:border-l lg:border-border/15 lg:pl-12 xl:pl-14">
            <div className="grid gap-4 sm:gap-5 sm:grid-cols-2 lg:gap-6">
              {benefits.map((benefit, i) => (
                <BenefitCard key={benefit.title} benefit={benefit} index={i} />
              ))}
            </div>

            <div
              aria-hidden
              className="pointer-events-none relative mt-10 hidden h-px w-full bg-border/15 lg:block"
            >
              <div
                className="aurea-signal-pulse absolute top-1/2 h-2 w-2 -translate-y-1/2 rounded-full bg-accent"
                style={{ boxShadow: "0 0 12px 3px rgba(201,169,106,0.45)" }}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ----------------------------------------------------------------------------
// LeftColumn
// ----------------------------------------------------------------------------
function LeftColumn() {
  const [ref, visible] = useInViewOnce<HTMLDivElement>();

  const show = (delay: number) => ({
    opacity: visible ? 1 : 0,
    transform: visible ? "translateY(0)" : "translateY(18px)",
    transition: "opacity 700ms ease-out, transform 700ms ease-out",
    transitionDelay: `${delay}ms`,
  });

  return (
    <div ref={ref} className="flex flex-col items-start">
      <div style={show(0)} className="mb-6 flex items-center gap-3">
        <div className="h-[2px] w-8 bg-accent" />
        <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-foreground/50">
          Por qué Áurea
        </span>
      </div>

      <h2
        id="beneficios-title"
        style={show(120)}
        className="leading-[1.1] tracking-tight flex flex-col"
      >
        {/* CORRECCIÓN: Tamaños responsivos para evitar que el texto rompa el diseño horizontal */}
        <span 
          className="block whitespace-nowrap text-[2rem] sm:text-[2.8rem] lg:text-[3.5rem] text-foreground font-medium"
          style={{ fontFamily: "var(--font-title-serif, 'Playfair Display', serif)" }}
        >
          Más eficiencia.
        </span>
        <span 
          className="block whitespace-nowrap text-[2rem] sm:text-[2.8rem] lg:text-[3.5rem] text-foreground font-medium"
          style={{ fontFamily: "var(--font-title-serif, 'Playfair Display', serif)" }}
        >
          Más control.
        </span>
        
        <span
          className="aurea-title-anim block whitespace-nowrap bg-clip-text text-transparent text-[2.8rem] sm:text-[3.8rem] lg:text-[4.5rem] -mt-1 sm:-mt-4 lg:-mt-6 tracking-wide"
          style={{
            fontFamily: "var(--font-title-script, 'Alex Brush', cursive)",
            backgroundImage: "linear-gradient(90deg, #C9A96A 0%, #E4CFA0 50%, #C9A96A 100%)",
            backgroundSize: "200% 100%",
            animation: "aurea-title-reveal 7s ease-in-out infinite alternate",
          }}
        >
          Más rentabilidad.
        </span>
      </h2>

      <p
        style={show(240)}
        className="mt-6 sm:mt-8 max-w-md text-sm leading-relaxed text-foreground/60 lg:text-base"
      >
        Menos tareas repetitivas, menos errores y una experiencia que tus
        clientes perciben como exclusiva. Áurea te da el control de cada boda
        para que tu negocio crezca sin sacrificar la calidad.
      </p>

      <a
        href="#stats"
        style={show(360)}
        className="group mt-8 inline-flex items-center gap-2 text-sm font-medium tracking-wide text-accent cursor-none"
      >
        <span className="relative">
          Ver estadísticas
          <span
            aria-hidden
            className="absolute -bottom-1 left-0 h-px w-full origin-left scale-x-0 bg-accent transition-transform duration-300 group-hover:scale-x-100"
          />
        </span>
        <ArrowRight
          size={15}
          className="transition-transform duration-300 group-hover:translate-x-1"
        />
      </a>

      <Collage visible={visible} />
    </div>
  );
}

// ----------------------------------------------------------------------------
// Collage
// ----------------------------------------------------------------------------
function Collage({ visible }: { visible: boolean }) {
  return (
    <div className="relative mt-12 h-44 w-full max-w-xs sm:h-52 sm:max-w-sm lg:mt-16 pointer-events-none">
      {collagePhotos.map((photo, i) => (
        <div
          key={photo.seed}
          className={cn("absolute", photo.wrapper)}
          style={{
            opacity: visible ? 1 : 0,
            transform: visible ? "translateY(0)" : "translateY(18px)",
            transition: "opacity 700ms ease-out, transform 700ms ease-out",
            transitionDelay: `${480 + i * 120}ms`,
          }}
        >
          <div
            className="aurea-float"
            style={{
              animation: `aurea-float ${9 + i * 1.5}s ease-in-out infinite`,
              animationDelay: photo.floatDelay,
            }}
          >
            <img
              src={`https://picsum.photos/seed/${photo.seed}/480/600`}
              alt={photo.alt}
              width={192}
              height={240}
              loading="lazy"
              decoding="async"
              className={cn(
                "h-44 w-36 rounded-lg border border-accent/30 object-cover sm:h-52 sm:w-40",
                photo.rotation
              )}
              style={{
                filter: "saturate(0.8)",
                boxShadow: "0 20px 40px -16px rgba(201,169,106,0.28)",
              }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}

// ----------------------------------------------------------------------------
// BenefitCard (ACORDEÓN EN MÓVIL)
// ----------------------------------------------------------------------------
function BenefitCard({ benefit, index }: { benefit: Benefit; index: number }) {
  const Icon = benefit.icon;
  const [ref, visible] = useInViewOnce<HTMLDivElement>();
  
  // Estado para controlar la apertura/cierre en móviles
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div
      ref={ref}
      // Al hacer clic, alterna el estado de isExpanded
      onClick={() => setIsExpanded(!isExpanded)}
      className={cn(
        "aurea-shimmer group relative overflow-hidden rounded-lg border border-border/20 bg-white/[0.03] p-4 sm:p-6 transition-all duration-300 hover:border-accent/50 hover:bg-white/[0.05] cursor-pointer sm:cursor-default",
        index % 2 === 1 && "lg:mt-12"
      )}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(18px)",
        transition:
          "opacity 700ms ease-out, transform 700ms ease-out, border-color 350ms ease-out, background-color 350ms ease-out",
        transitionDelay: visible ? `${index * 100}ms` : "0ms",
      }}
    >
      <span
        aria-hidden
        // Reducido a text-4xl en móvil para que no se corte
        className="pointer-events-none absolute right-4 top-3 select-none font-serif text-4xl sm:text-5xl font-light text-accent/[0.30]"
        style={{ WebkitTextStroke: "0.5px rgba(201,169,106,0.25)" }}
      >
        {benefit.number}
      </span>

      {/* Título e Ícono (En línea en móvil, apilados en PC) */}
      <div className="flex items-center gap-4 sm:block">
        <div className="mb-0 sm:mb-4 flex h-10 w-10 sm:h-12 sm:w-12 shrink-0 items-center justify-center rounded-full border border-accent/40 bg-accent/10 text-accent transition-colors duration-300 group-hover:border-accent group-hover:bg-accent group-hover:text-background">
          <Icon size={18} strokeWidth={1.5} />
        </div>

        <h3 className="relative text-sm sm:text-base font-semibold text-foreground pr-6 sm:pr-0">
          {benefit.title}
        </h3>
      </div>

      {/* Contenido Colapsable (Acordeón) */}
      <div 
        className={cn(
          "relative transition-all duration-300 ease-in-out overflow-hidden",
          isExpanded 
            ? "max-h-40 mt-3 opacity-100" 
            : "max-h-0 opacity-0 sm:max-h-40 sm:mt-2 sm:opacity-100" // En PC (sm+) siempre visible
        )}
      >
        <p className="text-xs sm:text-sm leading-relaxed text-foreground/60">
          {benefit.description}
        </p>

        <div className="relative mt-4 sm:mt-5 h-px w-0 bg-accent transition-all duration-300 group-hover:w-12" />
      </div>
    </div>
  );
}

// ----------------------------------------------------------------------------
// SunGlyph
// ----------------------------------------------------------------------------
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