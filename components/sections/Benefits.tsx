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
    url: "https://images.unsplash.com/photo-1519225421980-715cb0215aed?q=80&w=800&auto=format&fit=crop",
    alt: "Recepción de boda elegante",
    wrapper: "-left-2 top-8 sm:-left-4 sm:top-16 z-0",
    rotation: "-rotate-6",
  },
  {
    url: "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?q=80&w=800&auto=format&fit=crop",
    alt: "Detalles de mesa de un evento organizado con Áurea",
    wrapper: "left-1/2 top-0 z-10 -translate-x-1/2",
    rotation: "rotate-2",
  },
  {
    url: "https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=800&auto=format&fit=crop",
    alt: "Montaje exterior lujoso para bodas",
    wrapper: "-right-2 top-12 sm:-right-4 sm:top-24 z-20",
    rotation: "rotate-6",
  },
] as const;

export default function Benefits({ className }: SectionProps) {
  return (
    <section
      id="benefits"
      aria-labelledby="beneficios-title"
      className={cn(
        "relative w-full scroll-mt-24 overflow-hidden bg-background px-6 py-24 text-foreground lg:py-28",
        className
      )}
    >
      {/* Atmósfera de fondo (estática) */}
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
        className="pointer-events-none absolute -right-44 -top-44 h-[600px] w-[600px] rounded-full"
        style={{
          background:
            "radial-gradient(circle, rgba(201,169,106,0.14) 0%, rgba(201,169,106,0) 70%)",
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -bottom-52 -left-36 h-[520px] w-[520px] rounded-full"
        style={{
          background:
            "radial-gradient(circle, rgba(201,169,106,0.10) 0%, rgba(201,169,106,0) 70%)",
        }}
      />
      <SunGlyph
        rays={20}
        className="pointer-events-none absolute left-2/3 top-1/2 h-[720px] w-[720px] -translate-x-1/2 -translate-y-1/2 text-accent"
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
            />
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
          className="block whitespace-nowrap text-accent text-[2.8rem] sm:text-[3.8rem] lg:text-[4.5rem] -mt-1 sm:-mt-4 lg:-mt-6 tracking-wide"
          style={{
            fontFamily: "var(--font-title-script, 'Alex Brush', cursive)",
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
        className="group mt-8 inline-flex items-center gap-2 text-sm font-medium tracking-wide text-accent"
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
// Collage — sin flotación infinita, solo aparición al hacer scroll
// ----------------------------------------------------------------------------
function Collage({ visible }: { visible: boolean }) {
  return (
    <div className="relative mt-16 h-72 w-full max-w-xs sm:h-[400px] sm:max-w-md lg:mt-24 pointer-events-none">
      {collagePhotos.map((photo, i) => (
        <div
          key={i}
          className={cn("absolute", photo.wrapper)}
          style={{
            opacity: visible ? 1 : 0,
            transform: visible ? "translateY(0)" : "translateY(24px)",
            transition: "opacity 700ms ease-out, transform 700ms ease-out",
            transitionDelay: `${480 + i * 120}ms`,
          }}
        >
          <img
            src={photo.url}
            alt={photo.alt}
            loading="lazy"
            decoding="async"
            className={cn(
              "h-56 w-40 rounded-xl border border-accent/30 object-cover sm:h-[300px] sm:w-[220px]",
              photo.rotation
            )}
            style={{
              filter: "saturate(0.9)",
              boxShadow: "0 25px 50px -12px rgba(201,169,106,0.25)",
            }}
          />
        </div>
      ))}
    </div>
  );
}

// ----------------------------------------------------------------------------
// BenefitCard (Acordeón en móvil) — sin shimmer
// ----------------------------------------------------------------------------
function BenefitCard({ benefit, index }: { benefit: Benefit; index: number }) {
  const Icon = benefit.icon;
  const [ref, visible] = useInViewOnce<HTMLDivElement>();

  const [isExpanded, setIsExpanded] = useState(false);
  return (
    <div
      ref={ref}
      onClick={() => setIsExpanded(!isExpanded)}
      className={cn(
        "group relative overflow-hidden rounded-lg border border-border/20 bg-white/[0.03] p-4 sm:p-6 transition-all duration-300 hover:border-accent/50 hover:bg-white/[0.05]",
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
        className="pointer-events-none absolute right-4 top-3 select-none font-serif text-4xl sm:text-5xl font-light text-accent/[0.30]"
        style={{ WebkitTextStroke: "0.5px rgba(201,169,106,0.25)" }}
      >
        {benefit.number}
      </span>
      <div className="flex items-center gap-4 sm:block">
        <div className="mb-0 sm:mb-4 flex h-10 w-10 sm:h-12 sm:w-12 shrink-0 items-center justify-center rounded-full border border-accent/40 bg-accent/10 text-accent transition-colors duration-300 group-hover:border-accent group-hover:bg-accent group-hover:text-background">
          <Icon size={18} strokeWidth={1.5} />
        </div>
        <h3 className="relative text-sm sm:text-base font-semibold text-foreground pr-6 sm:pr-0">
          {benefit.title}
        </h3>
      </div>
      <div
        className={cn(
          "relative transition-all duration-300 ease-in-out overflow-hidden",
          isExpanded
            ? "max-h-40 mt-3 opacity-100"
            : "max-h-0 opacity-0 sm:max-h-40 sm:mt-2 sm:opacity-100"
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