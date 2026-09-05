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

const features = [
  {
    icon: CalendarCheck,
    index: "01",
    name: "Cronograma y tareas",
    description: "Fechas límite, responsables y seguimiento en tiempo real.",
    image: "/images/features/Cronograma_.webp",
  },
  {
    icon: Wallet,
    index: "02",
    name: "Gestión de pagos",
    description: "Registro claro de lo que se debe y lo que se ha pagado.",
    image: "/images/features/Pagos_.webp",
  },
  {
    icon: FileText,
    index: "03",
    name: "Documentos",
    description: "Contratos, menús, planos y más. Siempre disponibles.",
    image: "/images/features/Documentos_.webp",
  },
  {
    icon: MessagesSquare,
    index: "04",
    name: "Mensajería centralizada",
    description: "Comunicación directa con tu equipo y tus clientes.",
    image: "/images/features/Mensajeria_.webp",
  },
  {
    icon: Bell,
    index: "05",
    name: "Notificaciones",
    description: "Recordatorios automáticos para que nada se pase por alto.",
    image: "/images/features/Notificaciones_.webp",
  },
  {
    icon: Users,
    index: "06",
    name: "Gestión de invitados",
    description: "Control de confirmaciones, mesas y requerimientos especiales.",
    image: "/images/features/Invitados2.webp",
  },
] as const;

export default function Features({ className }: SectionProps) {
  return (
    <section
      id="features"
      aria-labelledby="features-title"
      className={cn(
        "relative w-full scroll-mt-24 overflow-hidden bg-white px-6 py-16 text-text lg:py-20",
        className
      )}
    >
      <span id="video" className="pointer-events-none absolute -top-24" aria-hidden="true" />

      {/* Atmósfera de fondo */}
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <Image
          src="/images/features.webp"
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
              className="text-accent text-[2.6rem] sm:text-[3.4rem] lg:text-[4rem] -mt-1 sm:-mt-2 lg:-mt-4 tracking-wide block"
              style={{
                fontFamily: "var(--font-title-script, 'Alex Brush', cursive)",
                lineHeight: 1.1,
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
            className="group inline-flex items-center gap-2 rounded-full bg-accent px-8 py-3.5 text-[13px] font-medium text-background transition-all hover:bg-accent/90 hover:scale-105 shadow-[0_0_20px_rgba(201,169,106,0.3)]"
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
// FeatureCard — sin tilt 3D, sin shimmer, sin rotación infinita del ícono
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
      <article className="group relative h-full overflow-hidden rounded-lg border border-border bg-white p-4 transition-colors duration-300">
        <span
          aria-hidden
          className="pointer-events-none absolute right-3 top-3 z-10 select-none font-serif text-5xl font-light text-accent/[0.35]"
          style={{ WebkitTextStroke: "0.5px rgba(201,169,106,0.28)" }}
        >
          {item.index}
        </span>

        {/* Imagen principal */}
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

        {/* Ícono — sin rotación, estático */}
        <div className="relative mb-3 h-10 w-10">
          <SunGlyph rays={12} className="absolute inset-0 h-full w-full text-accent/55" />
          <svg viewBox="0 0 48 48" className="absolute inset-0 h-full w-full text-accent/70">
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