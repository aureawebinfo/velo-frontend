"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/cn";
import { useInView } from "@/lib/useInView";
import type { SectionProps } from "@/types";
import {
  Check,
  CalendarDays,
  CreditCard,
  FileText,
  MessageSquare,
  Clock,
  DownloadCloud,
} from "lucide-react";
import CardSwap, { Card } from "@/components/ui/CardSwap";

const CHECKS = [
  "Información centralizada en un solo lugar",
  "Visión en tiempo real del estado del evento",
  "Menos consultas innecesarias de las parejas",
  "Experiencia premium que refuerza tu marca",
];

export default function ProductShowcase({ className }: SectionProps) {
  const { ref, isInView } = useInView({ threshold: 0.15 });
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(mq.matches);
    const handler = () => setReducedMotion(mq.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  return (
    <section
      id="product"
      ref={ref}
      className={cn(
        "relative overflow-hidden bg-white px-6 py-24 text-text",
        className
      )}
      style={{
        backgroundImage: "url('/images/productshowcase.png')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;500;600&family=Alex+Brush&display=swap');
        @keyframes aurea-draw { to { stroke-dashoffset: 0; } }
        @keyframes aurea-cursor-pulse {
          0%, 100% { transform: scale(1); opacity: .55; }
          50% { transform: scale(1.9); opacity: 0; }
        }
        @keyframes aurea-pop-in {
          0% { transform: scale(.4); opacity: 0; }
          60% { transform: scale(1.12); opacity: 1; }
          100% { transform: scale(1); opacity: 1; }
        }
        @keyframes aurea-drift {
          0% { transform: translate3d(0,0,0); opacity: 0; }
          15% { opacity: .7; }
          85% { opacity: .5; }
          100% { transform: translate3d(var(--dx), -140px, 0); opacity: 0; }
        }
        @keyframes aurea-glow-shift {
          0%, 100% { transform: translate(-8%, -6%) scale(1); }
          50% { transform: translate(8%, 6%) scale(1.15); }
        }
        .aurea-particle { animation: aurea-drift linear infinite; }
        .aurea-glow { animation: aurea-glow-shift 9s ease-in-out infinite; }
        @media (prefers-reduced-motion: reduce) {
          .aurea-particle, .aurea-glow { animation: none !important; }
        }
      `}</style>

      <div className="mx-auto grid max-w-[1400px] grid-cols-1 items-center gap-16 lg:grid-cols-2">
        
        {/* ========================================================
            Columna izquierda: texto (Se mantiene igual)
            ======================================================== */}
        <div className={cn("relative animate-fade-up pl-4 lg:pl-12", isInView && "visible")}>
          <div className="mb-6 flex items-center gap-3 text-accent">
            <RingsIcon className="h-5 w-5 shrink-0 opacity-80" />
            <span className="h-px w-12 bg-accent/40" />
            <span className="text-[11px] font-semibold uppercase tracking-[0.25em] text-accent">
              Todo en un solo portal
            </span>
          </div>

          <h2 className="select-none text-[#2a2a2a] flex flex-wrap items-baseline gap-x-3">
            <span
              className="text-[1.75rem] font-medium leading-[1.15] sm:text-[2.15rem] lg:text-[2.4rem]"
              style={{ fontFamily: "var(--font-title-serif, 'Playfair Display', serif)" }}
            >
              Así funciona
            </span>
            <span
              className="text-accent text-[2.6rem] sm:text-[3.4rem] lg:text-[4.5rem] tracking-wide"
              style={{ fontFamily: "var(--font-title-script, 'Alex Brush', cursive)", lineHeight: 1 }}
            >
              Áurea
            </span>
          </h2>

          <OrnamentDivider visible={isInView} />

          <p className="max-w-md text-base md:text-lg font-light leading-relaxed text-[#555555]">
            Un portal centralizado donde cada boda tiene su propio espacio de
            trabajo. Cronograma, pagos, documentos y comunicación, todo visible
            en un solo lugar.
          </p>

          <ul className="mt-8 space-y-4">
            {CHECKS.map((item, i) => (
              <li
                key={item}
                className={cn(
                  "flex items-start gap-4 transition-all duration-500",
                  isInView ? "translate-x-0 opacity-100" : "-translate-x-2 opacity-0"
                )}
                style={{ transitionDelay: `${150 + i * 120}ms` }}
              >
                <span className="relative mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-accent/10">
                  <span
                    className="absolute inset-0 rounded-full bg-accent/20"
                    style={{
                      animation: isInView && !reducedMotion
                        ? `aurea-cursor-pulse 1800ms ease-out ${300 + i * 120}ms 1`
                        : undefined,
                    }}
                  />
                  <Check
                    className="relative h-3 w-3 text-accent"
                    style={{
                      strokeWidth: 3, 
                      animation: isInView
                        ? `aurea-pop-in 420ms cubic-bezier(.34,1.56,.64,1) ${200 + i * 120}ms backwards`
                        : undefined,
                    }}
                  />
                </span>
                <span className="text-[15px] md:text-base font-normal leading-relaxed text-[#4a4a4a]">
                  {item}
                </span>
              </li>
            ))}
          </ul>
        </div>

        {/* ========================================================
            Columna derecha: Animación de tarjetas VIVAS y a Color
            ======================================================== */}
        <div
          className={cn(
            "relative w-full h-[450px] sm:h-[550px] lg:h-[700px] flex items-center justify-center lg:justify-end animate-fade-up", 
            isInView && "visible"
          )}
          style={{ transitionDelay: "200ms" }}
        >
          <div
            className="aurea-glow pointer-events-none absolute inset-0 -z-10 rounded-full opacity-40 blur-3xl lg:-inset-10"
            style={{ background: "radial-gradient(closest-side, var(--color-accent, #C9A15E) 0%, transparent 70%)" }}
            aria-hidden="true"
          />
          <FloatingParticles active={isInView && !reducedMotion} />

          <CardSwap
            className="origin-center lg:origin-right translate-x-0 lg:translate-x-[15%] translate-y-[10%] scale-[0.55] sm:scale-[0.75] lg:scale-[0.9] xl:scale-[1.05] antialiased"
            width={520} 
            height={420}
            cardDistance={45}
            verticalDistance={55}
            skewAmount={6}
            delay={3500}
            pauseOnHover={true}
          >
            {/* CARD 1: CRONOGRAMA (Dusty Blue / Azul Grisáceo) */}
            <Card className="group flex flex-col overflow-hidden rounded-2xl shadow-[0_20px_60px_-15px_rgba(0,0,0,0.3)] border border-[#A1B8CE] transform-gpu [transform:translateZ(0)] [backface-visibility:hidden]">
              <MinimalBrowserBar />
              <div className="flex flex-1 flex-col items-center justify-center bg-gradient-to-br from-[#D9E2E8] to-[#B8C9D6] p-8 text-center">
                <div className="mb-5 rounded-2xl bg-[#9DB5C9] p-5 text-[#1E3A5F] shadow-sm transition-all duration-500 group-hover:scale-110 group-hover:bg-[#1E3A5F] group-hover:text-[#D9E2E8]">
                  <CalendarDays className="h-10 w-10" strokeWidth={1.5} />
                </div>
                <h3 className="mb-2 text-2xl font-medium tracking-wide text-[#1E3A5F]" style={{ fontFamily: "var(--font-title-serif, 'Playfair Display', serif)" }}>Cronograma</h3>
                <p className="mb-6 text-sm font-light leading-relaxed text-[#3B5473] max-w-[280px]">
                  Gestión visual del día del evento.
                </p>
                {/* Mini UI Timeline (Glassmorphism) */}
                <div className="w-full max-w-[260px] space-y-3 rounded-xl bg-white/40 backdrop-blur-md p-4 shadow-sm border border-white/50">
                  <div className="flex items-center gap-3">
                    <Clock className="h-4 w-4 text-[#1E3A5F]/50" />
                    <div className="h-2 w-full rounded-full bg-white/60 overflow-hidden"><div className="h-full w-[100%] bg-[#1E3A5F]/40" /></div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Clock className="h-4 w-4 text-[#1E3A5F]" />
                    <div className="h-2 w-full rounded-full bg-white/60 overflow-hidden"><div className="h-full w-[60%] bg-[#1E3A5F]" /></div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Clock className="h-4 w-4 text-[#1E3A5F]/30" />
                    <div className="h-2 w-full rounded-full bg-white/60 overflow-hidden"><div className="h-full w-[30%] bg-[#1E3A5F]/20" /></div>
                  </div>
                </div>
              </div>
            </Card>

            {/* CARD 2: PAGOS (Sage Green / Verde Salvia) */}
            <Card className="group flex flex-col overflow-hidden rounded-2xl shadow-[0_20px_60px_-15px_rgba(0,0,0,0.3)] border border-[#9DBDAE] transform-gpu [transform:translateZ(0)] [backface-visibility:hidden]">
              <MinimalBrowserBar />
              <div className="flex flex-1 flex-col items-center justify-center bg-gradient-to-br from-[#D8E2DC] to-[#B3C9BE] p-8 text-center">
                <div className="mb-5 rounded-2xl bg-[#9DBDAE] p-5 text-[#204A36] shadow-sm transition-all duration-500 group-hover:scale-110 group-hover:bg-[#204A36] group-hover:text-[#D8E2DC]">
                  <CreditCard className="h-10 w-10" strokeWidth={1.5} />
                </div>
                <h3 className="mb-2 text-2xl font-medium tracking-wide text-[#204A36]" style={{ fontFamily: "var(--font-title-serif, 'Playfair Display', serif)" }}>Pagos</h3>
                <p className="mb-6 text-sm font-light leading-relaxed text-[#3C614F] max-w-[280px]">
                  Control y seguimiento financiero claro.
                </p>
                {/* Mini UI Progress (Glassmorphism) */}
                <div className="w-full max-w-[260px] rounded-xl bg-white/40 backdrop-blur-md p-5 shadow-sm border border-white/50">
                  <div className="flex justify-between items-end mb-2">
                    <span className="text-xs font-semibold uppercase tracking-wider text-[#204A36]/70">Abonado</span>
                    <span className="text-xl font-bold text-[#204A36]">68%</span>
                  </div>
                  <div className="h-2.5 w-full rounded-full bg-white/60 overflow-hidden">
                    <div className="h-full bg-[#204A36] w-[68%] transition-all duration-1000 group-hover:w-[100%]" />
                  </div>
                </div>
              </div>
            </Card>

            {/* CARD 3: DOCUMENTOS (Dusty Lilac / Lila Apagado) */}
            <Card className="group flex flex-col overflow-hidden rounded-2xl shadow-[0_20px_60px_-15px_rgba(0,0,0,0.3)] border border-[#BA9EB4] transform-gpu [transform:translateZ(0)] [backface-visibility:hidden]">
              <MinimalBrowserBar />
              <div className="flex flex-1 flex-col items-center justify-center bg-gradient-to-br from-[#E2D8E0] to-[#C9B3C5] p-8 text-center">
                <div className="mb-5 rounded-2xl bg-[#BA9EB4] p-5 text-[#4A2041] shadow-sm transition-all duration-500 group-hover:scale-110 group-hover:bg-[#4A2041] group-hover:text-[#E2D8E0]">
                  <FileText className="h-10 w-10" strokeWidth={1.5} />
                </div>
                <h3 className="mb-2 text-2xl font-medium tracking-wide text-[#4A2041]" style={{ fontFamily: "var(--font-title-serif, 'Playfair Display', serif)" }}>Documentos</h3>
                <p className="mb-6 text-sm font-light leading-relaxed text-[#613C59] max-w-[280px]">
                  Contratos y archivos centralizados.
                </p>
                {/* Mini UI File (Glassmorphism) */}
                <div className="w-full max-w-[260px] flex items-center gap-4 rounded-xl bg-white/40 backdrop-blur-md p-4 shadow-sm border border-white/50">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#4A2041] text-white transition-transform duration-500 group-hover:rotate-12">
                    <Check className="h-5 w-5" />
                  </div>
                  <div className="text-left">
                    <div className="text-sm font-semibold text-[#4A2041]">Contrato_Boda.pdf</div>
                    <div className="text-xs text-[#4A2041]/70 flex items-center gap-1 mt-0.5"><DownloadCloud className="h-3 w-3"/> Firmado</div>
                  </div>
                </div>
              </div>
            </Card>

            {/* CARD 4: MENSAJERÍA (Warm Taupe / Arena Topo) */}
            <Card className="group flex flex-col overflow-hidden rounded-2xl shadow-[0_20px_60px_-15px_rgba(0,0,0,0.3)] border border-[#BCAFA3] transform-gpu [transform:translateZ(0)] [backface-visibility:hidden]">
              <MinimalBrowserBar />
              <div className="flex flex-1 flex-col items-center justify-center bg-gradient-to-br from-[#E2DDD8] to-[#C9BEB3] p-8 text-center">
                <div className="mb-5 rounded-2xl bg-[#BCAFA3] p-5 text-[#4A3B20] shadow-sm transition-all duration-500 group-hover:scale-110 group-hover:bg-[#4A3B20] group-hover:text-[#E2DDD8]">
                  <MessageSquare className="h-10 w-10" strokeWidth={1.5} />
                </div>
                <h3 className="mb-2 text-2xl font-medium tracking-wide text-[#4A3B20]" style={{ fontFamily: "var(--font-title-serif, 'Playfair Display', serif)" }}>Mensajería</h3>
                <p className="mb-5 text-sm font-light leading-relaxed text-[#63553C] max-w-[280px]">
                  Comunicación directa y unificada.
                </p>
                {/* Mini UI Chats (Glassmorphism) */}
                <div className="w-full max-w-[260px] space-y-3 px-1">
                  <div className="rounded-2xl rounded-tl-sm bg-white/50 backdrop-blur-md p-3 text-[13px] text-[#4A3B20] shadow-sm border border-white/50 text-left">
                    ¿A qué hora llegan los proveedores?
                  </div>
                  <div className="ml-auto w-[85%] rounded-2xl rounded-tr-sm bg-[#4A3B20] p-3 text-[13px] text-[#E2DDD8] shadow-md text-left transition-transform duration-500 group-hover:-translate-y-1">
                    A las 9:00 AM exactas. ✨
                  </div>
                </div>
              </div>
            </Card>
          </CardSwap>
        </div>
      </div>
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-32 bg-gradient-to-b from-transparent to-white" />
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  Barra Superior Minimalista tipo macOS con color dinámico          */
/* ------------------------------------------------------------------ */
function MinimalBrowserBar() {
  return (
    <div className="flex h-10 items-center border-b border-black/10 bg-white/30 px-4 backdrop-blur-md">
      <div className="flex gap-2">
        <span className="h-2.5 w-2.5 rounded-full bg-black/20" />
        <span className="h-2.5 w-2.5 rounded-full bg-black/20" />
        <span className="h-2.5 w-2.5 rounded-full bg-black/20" />
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Ornamentos y Partículas (Se mantienen iguales)                    */
/* ------------------------------------------------------------------ */

function RingsIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 20" fill="none" stroke="currentColor" strokeWidth="1.3" className={className} aria-hidden="true">
      <circle cx="12" cy="10" r="7.2" />
      <circle cx="20" cy="10" r="7.2" />
    </svg>
  );
}

function OrnamentDivider({ visible }: { visible: boolean }) {
  return (
    <div className={cn("my-4 flex items-center gap-3 text-accent/60 transition-opacity duration-700", visible ? "opacity-100" : "opacity-0")}>
      <span className="h-px flex-1 max-w-[64px] bg-accent/40" />
      <svg width="8" height="8" viewBox="0 0 8 8" fill="currentColor">
        <path d="M4 0 8 4 4 8 0 4Z" />
      </svg>
      <span className="h-px flex-1 max-w-[64px] bg-accent/40" />
    </div>
  );
}

function FloatingParticles({ active }: { active: boolean }) {
  const particles = useRef(
    Array.from({ length: 7 }, (_, i) => ({
      id: i,
      left: 8 + ((i * 13) % 90),
      size: 3 + (i % 3),
      duration: 6000 + (i % 4) * 1300,
      delay: i * 700,
      dx: i % 2 === 0 ? "18px" : "-18px",
    }))
  ).current;

  if (!active) return null;

  return (
    <div className="pointer-events-none absolute inset-0 -z-10 overflow-visible" aria-hidden="true">
      {particles.map((p) => (
        <span
          key={p.id}
          className="aurea-particle absolute rounded-full bg-accent"
          style={{
            left: `${p.left}%`,
            bottom: "-10px",
            width: p.size,
            height: p.size,
            animationDuration: `${p.duration}ms`,
            animationDelay: `${p.delay}ms`,
            ["--dx" as string]: p.dx,
          }}
        />
      ))}
    </div>
  );
}