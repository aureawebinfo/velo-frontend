"use client";

import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { motion, useInView, type Variants } from "framer-motion";
import { cn } from "@/lib/utils";
import type { SectionProps } from "@/types";
import { AmbientLines } from "@/components/effects/FloatingPaths";
import SideRays from "@/components/effects/SideRays";

const TITLE_LINES = [
  "El software que",
  "organiza cada boda",
  "de principio a fin.",
];

const FOOTER_ITEMS: {
  icon: "shield" | "users" | "cloud";
  label: string;
  sub: string;
}[] = [
  { icon: "shield", label: "Seguro y privado", sub: "Datos protegidos" },
  { icon: "users", label: "Acceso por roles", sub: "Tu equipo y tus clientes" },
  { icon: "cloud", label: "Todo en la nube", sub: "Desde cualquier lugar" },
];

const STATS: {
  prefix?: string;
  value: number;
  suffix?: string;
  label: string;
  icon: "users" | "calendar" | "shield" | "cloud";
}[] = [
  {
    icon: "users",
    prefix: "+",
    value: 60,
    label: "Casas de eventos\nconfían en Áurea",
  },
  {
    icon: "calendar",
    prefix: "+",
    value: 800,
    label: "Bodas gestionadas\nsin caos",
  },
  {
    icon: "shield",
    value: 100,
    suffix: "%",
    label: "Parejas satisfechas\ncon la experiencia",
  },
  {
    icon: "cloud",
    value: 100,
    suffix: "%",
    label: "En la nube,\nsiempre disponible",
  },
];

/* ---------------------------------------------------------------------- */
/* Íconos                                                                 */
/* ---------------------------------------------------------------------- */

function FooterIcon({ type }: { type: "shield" | "users" | "cloud" }) {
  const common = {
    xmlns: "http://www.w3.org/2000/svg",
    width: 18,
    height: 18,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.5,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
  };

  if (type === "shield") {
    return (
      <motion.span
        className="relative inline-flex"
        animate={{
          filter: [
            "drop-shadow(0 0 0px #E4C892)",
            "drop-shadow(0 0 5px #E4C892)",
            "drop-shadow(0 0 0px #E4C892)",
          ],
        }}
        transition={{ duration: 2.6, repeat: Infinity, ease: "easeInOut" }}
      >
        <svg {...common}>
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z" />
          <motion.path
            d="m9 12 2 2 4-4"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{
              duration: 1,
              repeat: Infinity,
              repeatDelay: 1.8,
              ease: "easeInOut",
            }}
          />
        </svg>
      </motion.span>
    );
  }
  if (type === "users") {
    return (
      <span className="relative inline-flex">
        <svg {...common}>
          <motion.path
            d="M17 21v-2a4 4 0 0 0-4-4H7a4 4 0 0 0-4 4v2"
            animate={{ y: [0, -1, 0] }}
            transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.circle
            cx="9"
            cy="7"
            r="4"
            animate={{ scale: [1, 1.12, 1] }}
            transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
            style={{ transformOrigin: "9px 7px" }}
          />
          <motion.path
            d="M23 21v-2a4 4 0 0 0-3-3.87"
            animate={{ y: [0, -1, 0] }}
            transition={{
              duration: 2.2,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 0.3,
            }}
          />
          <motion.path
            d="M16 3.13a4 4 0 0 1 0 7.75"
            animate={{ scale: [1, 1.08, 1] }}
            transition={{
              duration: 2.2,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 0.3,
            }}
            style={{ transformOrigin: "16px 7px" }}
          />
        </svg>
      </span>
    );
  }
  return (
    <motion.span
      className="relative inline-flex"
      animate={{ y: [0, -3, 0] }}
      transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
    >
      <svg {...common}>
        <path d="M17.5 19H9a7 7 0 1 1 6.71-9h.79a4.5 4.5 0 1 1 1 8.9" />
      </svg>
    </motion.span>
  );
}

function StatIcon({
  type,
}: {
  type: "users" | "calendar" | "shield" | "cloud";
}) {
  const common = {
    xmlns: "http://www.w3.org/2000/svg",
    width: 18,
    height: 18,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.5,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
  };

  if (type === "calendar") {
    return (
      <svg {...common}>
        <rect x="3" y="4" width="18" height="18" rx="2" />
        <path d="M16 2v4M8 2v4M3 10h18" />
      </svg>
    );
  }
  if (type === "shield") {
    return (
      <svg {...common}>
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z" />
        <path d="m9 12 2 2 4-4" />
      </svg>
    );
  }
  if (type === "cloud") {
    return (
      <svg {...common}>
        <path d="M17.5 19H9a7 7 0 1 1 6.71-9h.79a4.5 4.5 0 1 1 1 8.9" />
      </svg>
    );
  }
  return (
    <svg {...common}>
      <path d="M17 21v-2a4 4 0 0 0-4-4H7a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  );
}

/* NUEVO ICONO DE OJO PARA "VER CÓMO FUNCIONA" */
function EyeIcon() {
  return (
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
    >
      <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
      <circle cx="12" cy="12" r="3" />
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

function OrnamentDivider() {
  return (
    <div className="my-4 flex items-center gap-3 text-accent/60">
      <span className="h-px flex-1 max-w-[64px] bg-accent/40" />
      <svg width="8" height="8" viewBox="0 0 8 8" fill="currentColor">
        <path d="M4 0 8 4 4 8 0 4Z" />
      </svg>
      <span className="h-px flex-1 max-w-[64px] bg-accent/40" />
    </div>
  );
}

function AnimatedNumber({
  value,
  prefix = "",
  suffix = "",
  delay = 0,
}: {
  value: number;
  prefix?: string;
  suffix?: string;
  delay?: number;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-40px" });
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    if (!isInView) return;
    const duration = 2600;
    let frame: number;
    let start: number;

    const timeout = setTimeout(() => {
      start = performance.now();
      const tick = (now: number) => {
        const progress = Math.min((now - start) / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        setDisplay(Math.round(eased * value));
        if (progress < 1) frame = requestAnimationFrame(tick);
      };
      frame = requestAnimationFrame(tick);
    }, delay);

    return () => {
      clearTimeout(timeout);
      if (frame) cancelAnimationFrame(frame);
    };
  }, [isInView, value, delay]);

  return (
    <span ref={ref}>
      {prefix}
      {display}
      {suffix}
    </span>
  );
}

const letterVariants: Variants = {
  hidden: { y: "60%", opacity: 0 },
  visible: {
    y: "0%",
    opacity: 1,
    transition: { type: "spring", stiffness: 160, damping: 24 },
  },
};

function AnimatedTitle() {
  let globalIndex = 0;

  return (
    <h1 className="select-none">
      {TITLE_LINES.map((line, lineIndex) => {
        const isLast = lineIndex === TITLE_LINES.length - 1;
        return (
          <span
            key={line}
            className={cn(
              "block",
              isLast
                ? "text-accent text-[2.6rem] sm:text-[3.4rem] lg:text-[4rem] -mt-2 sm:-mt-4 lg:-mt-5 tracking-wide"
                : "text-foreground text-[1.75rem] font-medium leading-[1.15] sm:text-[2.15rem] lg:text-[2.4rem]"
            )}
            style={{
              fontFamily: isLast
                ? "var(--font-title-script, 'Alex Brush', cursive)"
                : "var(--font-title-serif, 'Playfair Display', serif)",
              lineHeight: isLast ? 1.1 : undefined,
            }}
          >
            {line.split(" ").map((word, wordIndex) => (
              <span
                key={`${word}-${wordIndex}`}
                className="mr-[0.28em] inline-block overflow-hidden pb-2 -mb-2 pl-4 -ml-4 align-bottom last:mr-0"
              >
                {word.split("").map((letter, letterIndex) => {
                  const delay = 0.25 + globalIndex * 0.02;
                  globalIndex += 1;
                  return (
                    <motion.span
                      key={`${letter}-${letterIndex}`}
                      variants={letterVariants}
                      initial="hidden"
                      animate="visible"
                      transition={{
                        type: "spring",
                        stiffness: 160,
                        damping: 24,
                        delay,
                      }}
                      className="inline-block"
                      style={
                        isLast && (letter === "p" || letter === "P")
                          ? { fontFamily: "'Pinyon Script', cursive" }
                          : undefined
                      }
                    >
                      {letter}
                    </motion.span>
                  );
                })}
              </span>
            ))}
          </span>
        );
      })}
    </h1>
  );
}

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15, delayChildren: 0.15 },
  },
};

const itemVariants: Variants = {
  hidden: { y: 16, opacity: 0 },
  visible: { y: 0, opacity: 1, transition: { duration: 0.6, ease: "easeOut" } },
};

export default function Hero3({ className }: SectionProps) {
  return (
    <motion.section
      id="inicio"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className={cn(
        "relative flex min-h-[100dvh] w-full flex-col overflow-hidden bg-background text-foreground cursor-none",
        className
      )}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@500;600&family=Alex+Brush&family=Pinyon+Script&display=swap');
      `}</style>

      {/* ===== Fondo: foto a pantalla completa ===== */}
      <div className="absolute inset-0 z-0 min-h-[100dvh] bg-background">
        <Image
          src="/images/hero/Hero_Background4.png"
          alt=""
          fill
          priority
          quality={100}
          className="object-contain object-right"
        />

        <div className="absolute inset-0 bg-gradient-to-r from-background from-0% via-background/90 via-35% to-transparent to-65%" />
        <div className="absolute inset-0 bg-gradient-to-t from-background/70 via-transparent to-background/20" />

        <AmbientLines />
        <div className="absolute inset-0 pointer-events-none">
          <SideRays
            speed={1.4}
            rayColor1="#C9A96A"
            rayColor2="#F1D97A"
            intensity={1.8}
            spread={1.3}
            origin="top-right"
            tilt={8}
            saturation={1.15}
            blend={0.55}
            falloff={1.4}
            opacity={0.85}
          />
        </div>
      </div>

      {/* ===== Contenido principal ===== */}
      {/* 1. REDUJE pt-24 a pt-20 y lg:pt-28 a lg:pt-16 para subir todo el bloque */}
      <div className="relative z-10 flex w-full flex-col justify-center px-6 pt-20 pb-4 sm:px-10 lg:px-17 lg:pt-16">
        <div className="max-w-xl">
          <motion.p
            variants={itemVariants}
            className="mb-2 flex items-center gap-3 text-[11px] font-medium uppercase tracking-[0.25em] text-accent"
          >
            <span className="h-px w-8 bg-accent/60" />
            Software de gestión para casas de eventos
          </motion.p>

          <motion.div variants={itemVariants}>
            <AnimatedTitle />
          </motion.div>

          <motion.div variants={itemVariants}>
            {/* 2. Divider ahora usa my-3 en vez de my-4 para ahorrar espacio */}
            <div className="my-3 flex items-center gap-3 text-accent/60">
              <span className="h-px flex-1 max-w-[64px] bg-accent/40" />
              <svg width="8" height="8" viewBox="0 0 8 8" fill="currentColor">
                <path d="M4 0 8 4 4 8 0 4Z" />
              </svg>
              <span className="h-px flex-1 max-w-[64px] bg-accent/40" />
            </div>
          </motion.div>

          <motion.p
            variants={itemVariants}
            className="max-w-[420px] text-[14px] leading-relaxed text-muted sm:text-[15px]"
          >
            Centraliza tareas, pagos, documentos y comunicación en un solo
            portal por cada evento. Menos caos operativo, más parejas felices.
          </motion.p>

          {/* 3. Reduje el mt-5 a mt-4 en los botones */}
          <motion.div
            variants={itemVariants}
            className="mt-4 flex flex-col sm:flex-row sm:items-center gap-4"
          >
            <a
              href="/login"
              className="group inline-flex w-full sm:w-auto justify-center items-center gap-2 rounded-full bg-accent px-6 py-3 text-[13px] font-medium text-background transition-colors hover:bg-accent/90 cursor-none"
            >
              Accede al portal
              <span className="transition-transform duration-300 group-hover:translate-x-1 flex items-center">
                <ArrowIcon />
              </span>
            </a>
            
            <a
              href="#features"
              className="group inline-flex w-full sm:w-auto justify-center items-center gap-2 text-[13px] font-medium text-foreground/90 transition-colors hover:text-accent cursor-none"
            >
              <span className="flex h-8 w-8 items-center justify-center rounded-full border border-white/25 text-foreground transition-colors group-hover:border-accent">
                <EyeIcon />
              </span>
              Ver cómo funciona
            </a>
          </motion.div>
        </div>

        {/* 4. Reduje el mt-5 a mt-4 en los chips */}
        <motion.div
          variants={itemVariants}
          className="mt-4 flex max-w-xl flex-wrap gap-3 lg:max-w-none lg:flex-nowrap"
        >
          {FOOTER_ITEMS.map((item) => (
            <div
              key={item.label}
              className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-2.5 backdrop-blur-sm"
            >
              <span className="text-accent shrink-0">
                <FooterIcon type={item.icon} />
              </span>
              <div className="min-w-0">
                <p className="text-[13px] font-medium text-foreground truncate">
                  {item.label}
                </p>
                <p className="mt-0.5 text-[11px] text-muted truncate">{item.sub}</p>
              </div>
            </div>
          ))}
        </motion.div>
      </div>

      {/* ===== Barra de estadísticas ===== */}
      <motion.div
        variants={itemVariants}
        // 5. Reduje el pb-6 a pb-4 para pegarlo un poquito más abajo y liberar centro
        className="relative z-10 w-full px-6 pb-4 sm:px-10 lg:px-17 mt-auto"
      >
        <div className="grid grid-cols-2 gap-x-4 gap-y-6 sm:flex sm:max-w-4xl sm:flex-wrap sm:items-center sm:gap-x-8 sm:gap-y-4 rounded-3xl border border-white/10 bg-white/[0.03] p-5 sm:px-6 sm:py-3.5 backdrop-blur-sm shadow-xl">
          {STATS.map((stat, i) => (
            <React.Fragment key={stat.label}>
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2.5 sm:gap-3">
                <span className="flex h-8 w-8 sm:h-9 sm:w-9 shrink-0 items-center justify-center rounded-full border border-accent/30 bg-accent/10 text-accent">
                  <StatIcon type={stat.icon} />
                </span>
                <div>
                  <span className="block font-display text-lg sm:text-xl font-semibold text-foreground">
                    <AnimatedNumber
                      value={stat.value}
                      prefix={stat.prefix}
                      suffix={stat.suffix}
                      delay={i * 250}
                    />
                  </span>
                  <p className="mt-0.5 whitespace-pre-line text-[10px] sm:text-[11px] leading-snug text-muted">
                    {stat.label}
                  </p>
                </div>
              </div>
              {i < STATS.length - 1 && (
                <span className="hidden h-8 w-px bg-white/10 sm:block" />
              )}
            </React.Fragment>
          ))}
        </div>
      </motion.div>
    </motion.section>
  );
}