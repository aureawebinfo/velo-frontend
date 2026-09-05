"use client";

import React from "react";
import Image from "next/image";
import { motion, type Variants } from "framer-motion";
import { cn } from "@/lib/utils";
import type { SectionProps } from "@/types";
import { AmbientLines } from "@/components/effects/FloatingPaths";
import SideRays from "@/components/effects/SideRays";

const TITLE_LINES = [
  "El software que",
  "organiza cada boda",
  "de principio a fin.",
];

/* ---------------------------------------------------------------------- */
/* Íconos                                                                 */
/* ---------------------------------------------------------------------- */

function EyeIcon() {
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
      <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}

function ArrowIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="18"
      height="18"
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
    <div className="my-5 flex items-center gap-4 text-accent/60">
      <span className="h-px flex-1 max-w-[80px] bg-accent/40" />
      <svg width="10" height="10" viewBox="0 0 8 8" fill="currentColor">
        <path d="M4 0 8 4 4 8 0 4Z" />
      </svg>
      <span className="h-px flex-1 max-w-[80px] bg-accent/40" />
    </div>
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
                ? "text-accent text-[3rem] sm:text-[4rem] lg:text-[5.2rem] -mt-2 sm:-mt-4 lg:-mt-5 tracking-wide"
                : "text-foreground text-[2.2rem] font-medium leading-[1.15] sm:text-[2.8rem] lg:text-[3.2rem]"
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
        "relative flex min-h-[100dvh] w-full flex-col overflow-hidden bg-background text-foreground",
        className
      )}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@500;600&family=Alex+Brush&family=Pinyon+Script&display=swap');
      `}</style>

      {/* ===== Fondo: foto a pantalla completa ===== */}
      <div className="absolute inset-0 z-0 min-h-[100dvh] bg-background">
        <Image
          src="/images/hero3.webp"
          alt="Fondo Áurea"
          fill
          priority
          quality={100}
          sizes="100vw"
          // MÓVIL: object-cover enfocado muy a la derecha (85%) para ver la agenda
          // ESCRITORIO (md+): object-contain alineado a la derecha para verla 100% completa y alejada
          className="object-cover object-[85%_center] md:object-contain md:object-right"
        />

        <div className="absolute inset-0 bg-gradient-to-r from-background from-0% via-background/90 via-40% to-transparent to-70%" />
        <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-background/20" />

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

      {/* ===== Contenido principal centrado ===== */}
      <div className="relative z-10 flex h-full min-h-[100dvh] w-full flex-col justify-center px-6 sm:px-10 lg:px-17">
        <div className="max-w-xl">
          <motion.p
            variants={itemVariants}
            className="mb-4 flex items-center gap-3 text-[12px] sm:text-[13px] font-medium uppercase tracking-[0.25em] text-accent"
          >
            <span className="h-px w-8 bg-accent/60" />
            Software de gestión para casas de eventos
          </motion.p>

          <motion.div variants={itemVariants}>
            <AnimatedTitle />
          </motion.div>

          <motion.div variants={itemVariants}>
            <OrnamentDivider />
          </motion.div>

          <motion.p
            variants={itemVariants}
            className="max-w-[500px] text-[15px] leading-relaxed text-muted sm:text-[17px]"
          >
            Centraliza tareas, pagos, documentos y comunicación en un solo
            portal por cada evento. Menos caos operativo, más parejas felices.
          </motion.p>

          <motion.div
            variants={itemVariants}
            className="mt-8 flex flex-col sm:flex-row sm:items-center gap-5"
          >
            <a
              href="/login"
              className="group inline-flex w-full sm:w-auto justify-center items-center gap-2 rounded-full bg-accent px-8 py-4 text-[14px] sm:text-[15px] font-medium text-background transition-colors hover:bg-accent/90"
            >
              Accede al portal
              <span className="transition-transform duration-300 group-hover:translate-x-1 flex items-center">
                <ArrowIcon />
              </span>
            </a>
            
            <a
              href="#features"
              className="group inline-flex w-full sm:w-auto justify-center items-center gap-3 text-[14px] sm:text-[15px] font-medium text-foreground/90 transition-colors hover:text-accent"
            >
              <span className="flex h-10 w-10 items-center justify-center rounded-full border border-white/25 text-foreground transition-colors group-hover:border-accent">
                <EyeIcon />
              </span>
              Ver cómo funciona
            </a>
          </motion.div>
        </div>
      </div>
    </motion.section>
  );
}