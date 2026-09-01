"use client";

import Image from "next/image";
import { useState } from "react";
import { cn } from "@/lib/cn";
import { useInView } from "@/lib/useInView";
import type { SectionProps } from "@/types";
import { motion } from "framer-motion";
import {
  ShieldCheck,
  LayoutGrid,
  Clock,
  SlidersHorizontal,
  MessageCircleQuestion,
  Star,
  ThumbsUp,
  Crown,
  Sparkles,
  ChevronDown, // <-- Añadido para el botón móvil
} from "lucide-react";
import type { ReactNode } from "react";

/* ============================================================================
   BUSINESS VALUE — v4: Flujo Dinámico + Glassmorphism Premium
   ============================================================================ */

interface Benefit {
  icon: ReactNode;
  title: string;
  description: string;
}

interface Pair {
  internal: Benefit;
  commercial: Benefit;
}

const PAIRS: Pair[] = [
  {
    internal: {
      icon: <ShieldCheck className="h-5 w-5" />,
      title: "Menos errores",
      description: "Información centralizada. Elimina duplicidades y reduce errores operativos.",
    },
    commercial: {
      icon: <MessageCircleQuestion className="h-5 w-5" />,
      title: "Menos consultas",
      description: "Las parejas encuentran todo por sí solas, liberando el tiempo de tu equipo.",
    },
  },
  {
    internal: {
      icon: <LayoutGrid className="h-5 w-5" />,
      title: "Todo en un solo lugar",
      description: "Cronograma, pagos y mensajes en un panel. Adiós al caos de WhatsApp.",
    },
    commercial: {
      icon: <Star className="h-5 w-5" />,
      title: "Mejor percepción",
      description: "Un portal profesional transmite prestigio desde el primer contacto.",
    },
  },
  {
    internal: {
      icon: <Clock className="h-5 w-5" />,
      title: "Respuestas automáticas",
      description: "La plataforma guía a los novios, reduciendo consultas repetitivas.",
    },
    commercial: {
      icon: <ThumbsUp className="h-5 w-5" />,
      title: "Más recomendaciones",
      description: "Una experiencia fluida genera parejas felices que te recomiendan.",
    },
  },
  {
    internal: {
      icon: <SlidersHorizontal className="h-5 w-5" />,
      title: "Control total",
      description: "Visibilidad en tiempo real del estado de cada uno de tus eventos.",
    },
    commercial: {
      icon: <Crown className="h-5 w-5" />,
      title: "Experiencia premium",
      description: "Justifica precios más altos posicionándote por encima de tu competencia.",
    },
  },
];

export default function BusinessValue({ className }: SectionProps) {
  const { ref, isInView } = useInView({ threshold: 0.1 });

  return (
    <section
      id="value"
      ref={ref}
      className={cn(
        "relative w-full overflow-hidden bg-transparent px-6 py-24 text-text lg:py-28",
        className
      )}
    >
      {/* Fondo */}
      <div className="pointer-events-none absolute inset-0 -z-10" aria-hidden="true">
        <Image
          src="/images/BusinessValue.webp"
          alt=""
          fill
          quality={100}
          className="object-cover"
        />
        <div className="absolute inset-0 bg-white/30" />
      </div>

      {/* Degradado superior para fusionar con la sección blanca de arriba */}
      <div className="pointer-events-none absolute inset-x-0 top-0 z-20 h-16 sm:h-24 bg-gradient-to-b from-white via-white/80 to-transparent" />
      <div className="mx-auto max-w-6xl">
        {/* Encabezado */}
        <div className="mb-14 lg:mb-16 flex flex-col items-center text-center">
          <div className="mb-4 flex items-center gap-2.5">
            <span className="h-px w-8 bg-accent/40" />
            <span className="flex h-6 w-6 items-center justify-center rounded-full border border-accent/25 bg-accent/10 text-accent">
              <Sparkles className="h-3 w-3" strokeWidth={1.75} />
            </span>
            <span className="text-xs font-medium uppercase tracking-[0.25em] text-accent">
              Causa y efecto
            </span>
            <span className="flex h-6 w-6 items-center justify-center rounded-full border border-accent/25 bg-accent/10 text-accent">
              <Sparkles className="h-3 w-3" strokeWidth={1.75} />
            </span>
            <span className="h-px w-8 bg-accent/40" />
          </div>

          <h2 
            className="max-w-2xl text-3xl font-medium tracking-tight text-text sm:text-4.5xl leading-[1.2]"
            style={{ fontFamily: "var(--font-title-serif, 'Playfair Display', serif)" }}
          >
            Tu equipo trabaja mejor.<br />
            Tus clientes te perciben mejor.
          </h2>
          <p className="mt-5 max-w-lg text-sm leading-relaxed text-textSecondary">
            No son dos beneficios separados: cada mejora operativa de tu
            equipo es, del otro lado del portal, una razón más para que te
            elijan.
          </p>
        </div>

        {/* Encabezados de columna (solo desktop) */}
        <div className="mb-8 hidden grid-cols-[1fr_100px_1fr] items-center gap-4 lg:grid">
          <h3 className="text-right text-xs font-medium uppercase tracking-widest text-textSecondary">
            Operativo Interno (Causa)
          </h3>
          <span />
          <h3 className="text-left text-xs font-medium uppercase tracking-widest text-accent">
            Impacto Comercial (Efecto)
          </h3>
        </div>

        <div className="relative space-y-6 lg:space-y-6">
          {PAIRS.map((pair, i) => (
            <ValuePairCard key={pair.internal.title} pair={pair} index={i} isInView={isInView} />
          ))}
        </div>
      </div>
    </section>
  );
}

// ============================================================================
// COMPONENTE TARJETA DINÁMICA (Móvil Expandible / Desktop Grid)
// ============================================================================
function ValuePairCard({ pair, index, isInView }: { pair: Pair; index: number; isInView: boolean }) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay: index * 0.15 }}
      className="relative"
    >
      {/* ───────────────────────────────────────────────────────── */}
      {/* VERSIÓN DESKTOP: Grid conectada por una línea             */}
      {/* ───────────────────────────────────────────────────────── */}
      <div className="hidden lg:grid grid-cols-[1fr_100px_1fr] items-center gap-4">
        
        {/* Tarjeta Izquierda (Causa) */}
        <div className="group flex flex-row-reverse items-center gap-5 text-right rounded-2xl bg-white/50 backdrop-blur-md border border-white/60 p-5 shadow-[0_8px_30px_-20px_rgba(0,0,0,0.15)] transition-all duration-300 hover:bg-white/70 hover:border-accent/20 hover:-translate-y-0.5">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-white shadow-sm border border-border/30 text-textSecondary transition-colors duration-300 group-hover:text-accent">
            {pair.internal.icon}
          </div>
          <div>
            <h4 className="text-base font-semibold text-text mb-1">{pair.internal.title}</h4>
            <p className="text-sm leading-relaxed text-textSecondary max-w-[280px] ml-auto">
              {pair.internal.description}
            </p>
          </div>
        </div>

        {/* Conector Central Animado (Desktop) */}
        <div className="flex items-center justify-center relative w-full h-full">
          <div className="absolute w-full h-px bg-accent/20" />
          {isInView && (
            <motion.div
              className="absolute h-[2px] w-10 bg-gradient-to-r from-transparent via-accent to-transparent"
              initial={{ left: "0%", opacity: 0 }}
              animate={{ left: "100%", opacity: [0, 1, 1, 0] }}
              transition={{
                duration: 2,
                repeat: Infinity,
                delay: index * 0.4,
                ease: "linear",
              }}
            />
          )}
          <div className="relative z-10 h-2 w-2 rounded-full bg-accent/50 ring-4 ring-white shadow-sm" />
        </div>

        {/* Tarjeta Derecha (Efecto) */}
        <div className="group flex flex-row items-center gap-5 text-left rounded-2xl bg-white/50 backdrop-blur-md border border-white/60 p-5 shadow-[0_8px_30px_-20px_rgba(0,0,0,0.15)] transition-all duration-300 hover:bg-white/70 hover:border-accent/30 hover:-translate-y-0.5 hover:shadow-[0_16px_40px_-20px_rgba(201,161,94,0.25)]">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-accent/10 border border-accent/20 text-accent transition-all duration-300 group-hover:bg-accent group-hover:text-white">
            {pair.commercial.icon}
          </div>
          <div>
            <h4 className="text-base font-semibold text-text mb-1">{pair.commercial.title}</h4>
            <p className="text-sm leading-relaxed text-textSecondary max-w-[280px] mr-auto">
              {pair.commercial.description}
            </p>
          </div>
        </div>
      </div>

      {/* ───────────────────────────────────────────────────────── */}
      {/* VERSIÓN MÓVIL: Tarjeta Interactiva Expandible (Acordeón)  */}
      {/* ───────────────────────────────────────────────────────── */}
      <div 
        className="flex flex-col lg:hidden rounded-2xl bg-white/60 backdrop-blur-md border border-white/70 p-5 shadow-[0_8px_30px_-20px_rgba(0,0,0,0.12)] transition-all duration-300 active:scale-[0.98] cursor-pointer"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        {/* Causa (Siempre visible) */}
        <div className="flex items-center gap-4 text-left">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-white shadow-sm border border-border/30 text-textSecondary">
            {pair.internal.icon}
          </div>
          <div>
            <p className="text-[10px] uppercase tracking-widest text-textSecondary mb-0.5 font-medium">Operativo</p>
            <h4 className="text-sm sm:text-base font-semibold text-text leading-tight mb-1">{pair.internal.title}</h4>
            <p className="text-xs sm:text-sm text-textSecondary leading-snug">{pair.internal.description}</p>
          </div>
        </div>

        {/* Separador e indicador de expansión */}
        <div className="flex items-center justify-center w-full mt-4 border-t border-accent/10 pt-3">
          <div className="flex items-center gap-2 text-[9px] uppercase tracking-widest text-accent font-bold">
            {isExpanded ? "Ocultar impacto" : "Ver impacto comercial"}
            <ChevronDown className={cn("h-3 w-3 transition-transform duration-300", isExpanded && "rotate-180")} />
          </div>
        </div>

        {/* Efecto Comercial (Oculto por defecto) */}
        <div
          className={cn(
            "transition-all duration-500 ease-in-out overflow-hidden flex flex-col items-center text-center",
            isExpanded ? "max-h-64 opacity-100 mt-2" : "max-h-0 opacity-0 mt-0"
          )}
        >
          {/* Pequeña flecha/conector visual */}
          <div className="h-4 w-px bg-gradient-to-b from-transparent via-accent/50 to-transparent mb-3" />
          
          <div className="flex flex-col items-center text-center">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-accent/10 border border-accent/20 text-accent mb-2">
              {pair.commercial.icon}
            </div>
            <p className="text-[10px] uppercase tracking-widest text-accent mb-0.5 font-bold">Comercial</p>
            <h4 className="text-sm sm:text-base font-semibold text-text mb-1">{pair.commercial.title}</h4>
            <p className="text-xs sm:text-sm text-textSecondary leading-relaxed px-2">
              {pair.commercial.description}
            </p>
          </div>
        </div>

      </div>
    </motion.div>
  );
}