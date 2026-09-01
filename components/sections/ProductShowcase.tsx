"use client";
import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { cn } from "@/lib/cn";
import { useInView } from "@/lib/useInView";
import type { SectionProps } from "@/types";
import {
  Check,
  Crown,
  Users,
  Smartphone,
  CheckCircle,
  Palette,
  HeartHandshake,
} from "lucide-react";
import CardSwap, { Card } from "@/components/ui/CardSwap";

const CHECKS = [
  "Portal web con tu propio logo y colores",
  "Las parejas gestionan su lista de invitados",
  "Consultas de pagos automáticas 24/7",
  "Aprobación de cotizaciones y menús online",
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
      id="portal-novios"
      ref={ref}
      className={cn(
        "relative overflow-hidden bg-white px-6 py-24 text-text",
        className,
      )}
      style={{
        contentVisibility: "auto",
        containIntrinsicSize: "auto 1000px",
      }}
    >
      {/* Background Image - Optimized with Next.js Image */}
      <Image
        src="/images/productshowcase.webp"
        alt=""
        fill
        loading="lazy"
        decoding="async"
        className="absolute inset-0 -z-10 object-cover"
        sizes="100vw"
        quality={75}
      />

      {/* Keyframes - Sacadas del @import de Google Fonts */}
      <style>{`
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
          0%, 100% { transform: translate3d(-8%, -6%, 0) scale(1); }
          50% { transform: translate3d(8%, 6%, 0) scale(1.15); }
        }
        .aurea-particle { 
          animation: aurea-drift linear infinite; 
          will-change: transform, opacity;
        }
        .aurea-glow { 
          animation: aurea-glow-shift 9s ease-in-out infinite; 
          will-change: transform;
        }
        @media (prefers-reduced-motion: reduce) {
          .aurea-particle, .aurea-glow { animation: none !important; }
        }
      `}</style>

      <div className="mx-auto grid max-w-[1400px] grid-cols-1 items-center gap-16 lg:grid-cols-2 relative z-10">
        {/* ========================================================
            Columna izquierda: texto enfocado en el PORTAL DE NOVIOS
            ======================================================== */}
        <div
          className={cn(
            "relative animate-fade-up pl-4 lg:pl-12",
            isInView && "visible",
          )}
        >
          <div className="mb-6 flex items-center gap-3 text-accent">
            <RingsIcon className="h-5 w-5 shrink-0 opacity-80" />
            <span className="h-px w-12 bg-accent/40" />
            <span className="text-[11px] font-semibold uppercase tracking-[0.25em] text-accent">
              Experiencia del cliente
            </span>
          </div>

          <h2 className="select-none text-[#2a2a2a] flex flex-col gap-1">
            <span
              className="text-[1.75rem] font-medium leading-[1.15] sm:text-[2.15rem] lg:text-[2.4rem]"
              style={{
                fontFamily:
                  "var(--font-title-serif, 'Playfair Display', serif)",
              }}
            >
              Sorprende con tu propio
            </span>
            <span
              className="text-accent text-[2.6rem] sm:text-[3.4rem] lg:text-[4.5rem] tracking-wide"
              style={{
                fontFamily: "var(--font-title-script, 'Alex Brush', cursive)",
                lineHeight: 1,
              }}
            >
              Portal de Novios
            </span>
          </h2>

          <OrnamentDivider visible={isInView} />

          <p className="max-w-md text-base md:text-lg font-medium leading-relaxed text-[#333333]">
            Bríndales a tus clientes una experiencia de lujo. Un espacio digital
            privado donde pueden ver sus avances, pagos e invitados, sin
            depender de tu equipo.
          </p>

          <ul className="mt-8 space-y-4">
            {CHECKS.map((item, i) => (
              <li
                key={item}
                className={cn(
                  "flex items-start gap-4 transition-all duration-500",
                  isInView
                    ? "translate-x-0 opacity-100"
                    : "-translate-x-2 opacity-0",
                )}
                style={{ transitionDelay: `${150 + i * 120}ms` }}
              >
                <span className="relative mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-accent/10">
                  <span
                    className="absolute inset-0 rounded-full bg-accent/20"
                    style={{
                      animation:
                        isInView && !reducedMotion
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
                <span className="text-[15px] md:text-base font-medium leading-relaxed text-[#333333]">
                  {item}
                </span>
              </li>
            ))}
          </ul>
        </div>

        {/* ========================================================
            Columna derecha: Tarjetas del Portal de Novios
            ======================================================== */}
        <div
          className={cn(
            "relative w-full h-[450px] sm:h-[550px] lg:h-[700px] flex items-center justify-center lg:justify-end animate-fade-up",
            isInView && "visible",
          )}
          style={{ transitionDelay: "200ms" }}
        >
          <div
            className="aurea-glow pointer-events-none absolute inset-0 -z-10 rounded-full opacity-40 blur-3xl lg:-inset-10"
            style={{
              background:
                "radial-gradient(closest-side, var(--color-accent, #C9A15E) 0%, transparent 70%)",
            }}
            aria-hidden="true"
          />

          <FloatingParticles active={isInView && !reducedMotion} />

          <CardSwap
            className="pointer-events-none origin-center lg:origin-right translate-x-0 lg:translate-x-[15%] translate-y-[10%] scale-[0.55] sm:scale-[0.75] lg:scale-[0.9] xl:scale-[1.05] antialiased will-change-transform"
            width={520}
            height={420}
            cardDistance={45}
            verticalDistance={55}
            skewAmount={6}
            delay={3500}
            pauseOnHover={false}
            enableGPU={true} // Agrega esto si CardSwap lo acepta
          >
            {/* CARD 1: MARCA BLANCA (Oscura/Elegante) */}
            <Card className="flex flex-col overflow-hidden rounded-2xl shadow-[0_20px_60px_-15px_rgba(0,0,0,0.3)] border border-[#3A332C] transform-gpu [transform:translateZ(0)] [backface-visibility:hidden]">
              <MinimalBrowserBar />
              <div className="relative flex flex-1 flex-col items-center justify-center bg-gradient-to-br from-[#1E1A17] to-[#120F0D] p-8 text-center">
                <div className="absolute top-6 right-6 flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-1.5 text-[9px] font-bold uppercase tracking-widest text-[#C9A96A] shadow-sm border border-[#C9A96A]/30">
                  <Crown className="h-3 w-3 fill-current" /> Marca Blanca
                </div>
                <div className="mb-5 rounded-2xl bg-[#C9A96A]/20 p-5 text-[#C9A96A] shadow-sm">
                  <Palette className="h-10 w-10" strokeWidth={1.5} />
                </div>
                <h3
                  className="mb-2 text-2xl font-medium tracking-wide text-[#EFE6D2]"
                  style={{
                    fontFamily:
                      "var(--font-title-serif, 'Playfair Display', serif)",
                  }}
                >
                  Tu Identidad
                </h3>
                <p className="mb-6 text-sm font-light leading-relaxed text-[#A89F91] max-w-[280px]">
                  El portal de los novios se adapta a tu logo y colores
                  corporativos.
                </p>

                {/* Mini UI Logo */}
                <div className="w-full max-w-[260px] flex items-center justify-center rounded-xl bg-white/10 p-4 shadow-sm border border-white/10">
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-full bg-[#C9A96A]" />
                    <div className="h-2.5 w-24 rounded-full bg-white/20" />
                  </div>
                </div>
              </div>
            </Card>

            {/* CARD 2: AUTOGESTIÓN DE INVITADOS (Dusty Blue) */}
            <Card className="flex flex-col overflow-hidden rounded-2xl shadow-[0_20px_60px_-15px_rgba(0,0,0,0.3)] border border-[#A1B8CE] transform-gpu [transform:translateZ(0)] [backface-visibility:hidden]">
              <MinimalBrowserBar />
              <div className="relative flex flex-1 flex-col items-center justify-center bg-gradient-to-br from-[#D9E2E8] to-[#B8C9D6] p-8 text-center">
                <div className="absolute top-6 right-6 flex items-center gap-1.5 rounded-full bg-white/70 px-3 py-1.5 text-[9px] font-bold uppercase tracking-widest text-[#1E3A5F] shadow-sm border border-white/50">
                  <HeartHandshake className="h-3 w-3" strokeWidth={2.5} />{" "}
                  Autogestión
                </div>
                <div className="mb-5 rounded-2xl bg-[#9DB5C9] p-5 text-[#1E3A5F] shadow-sm">
                  <Users className="h-10 w-10" strokeWidth={1.5} />
                </div>
                <h3
                  className="mb-2 text-2xl font-medium tracking-wide text-[#1E3A5F]"
                  style={{
                    fontFamily:
                      "var(--font-title-serif, 'Playfair Display', serif)",
                  }}
                >
                  Mesa e Invitados
                </h3>
                <p className="mb-6 text-sm font-light leading-relaxed text-[#3B5473] max-w-[280px]">
                  Las parejas cargan su lista y organizan las mesas sin enviarte
                  excels.
                </p>

                {/* Mini UI Users */}
                <div className="w-full max-w-[260px] space-y-2 rounded-xl bg-white/50 p-4 shadow-sm border border-white/50">
                  <div className="flex items-center justify-between border-b border-white/40 pb-2">
                    <span className="text-xs font-semibold text-[#1E3A5F]">
                      Mesa 1 (Familia)
                    </span>
                    <span className="text-[10px] bg-[#1E3A5F] text-white px-2 py-0.5 rounded-full">
                      8/8
                    </span>
                  </div>
                  <div className="flex items-center gap-2 pt-1 text-xs text-[#1E3A5F]/70">
                    <div className="h-5 w-5 rounded-full bg-white flex items-center justify-center border border-[#1E3A5F]/20">
                      👤
                    </div>
                    Ana y Carlos (+2 niños)
                  </div>
                </div>
              </div>
            </Card>

            {/* CARD 3: SALDOS 24/7 (Sage Green) */}
            <Card className="flex flex-col overflow-hidden rounded-2xl shadow-[0_20px_60px_-15px_rgba(0,0,0,0.3)] border border-[#9DBDAE] transform-gpu [transform:translateZ(0)] [backface-visibility:hidden]">
              <MinimalBrowserBar />
              <div className="relative flex flex-1 flex-col items-center justify-center bg-gradient-to-br from-[#D8E2DC] to-[#B3C9BE] p-8 text-center">
                <div className="absolute top-6 right-6 flex items-center gap-1.5 rounded-full bg-white/70 px-3 py-1.5 text-[9px] font-bold uppercase tracking-widest text-[#204A36] shadow-sm border border-white/50">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#204A36] opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-[#204A36]"></span>
                  </span>
                  Cero WhatsApps
                </div>
                <div className="mb-5 rounded-2xl bg-[#9DBDAE] p-5 text-[#204A36] shadow-sm">
                  <Smartphone className="h-10 w-10" strokeWidth={1.5} />
                </div>
                <h3
                  className="mb-2 text-2xl font-medium tracking-wide text-[#204A36]"
                  style={{
                    fontFamily:
                      "var(--font-title-serif, 'Playfair Display', serif)",
                  }}
                >
                  Saldos 24/7
                </h3>
                <p className="mb-6 text-sm font-light leading-relaxed text-[#3C614F] max-w-[280px]">
                  Ven su historial de pagos y próximas cuotas desde el celular.
                </p>

                {/* Mini UI Phone */}
                <div className="w-full max-w-[260px] rounded-xl bg-white/50 p-4 shadow-sm border border-white/50">
                  <div className="flex justify-between items-center mb-3">
                    <span className="text-xs text-[#204A36]/70">
                      Próximo pago: 15 Dic
                    </span>
                    <span className="text-sm font-bold text-[#204A36]">
                      $1.500
                    </span>
                  </div>
                  <div className="w-full py-2 bg-[#204A36] text-white text-[11px] uppercase tracking-wider rounded-lg font-semibold">
                    Subir comprobante
                  </div>
                </div>
              </div>
            </Card>

            {/* CARD 4: APROBACIONES DIGITALES (Dusty Lilac) */}
            <Card className="flex flex-col overflow-hidden rounded-2xl shadow-[0_20px_60px_-15px_rgba(0,0,0,0.3)] border border-[#BA9EB4] transform-gpu [transform:translateZ(0)] [backface-visibility:hidden]">
              <MinimalBrowserBar />
              <div className="relative flex flex-1 flex-col items-center justify-center bg-gradient-to-br from-[#E2D8E0] to-[#C9B3C5] p-8 text-center">
                <div className="absolute top-6 right-6 flex items-center gap-1.5 rounded-full bg-white/70 px-3 py-1.5 text-[9px] font-bold uppercase tracking-widest text-[#4A2041] shadow-sm border border-white/50">
                  Con 1 solo clic
                </div>
                <div className="mb-5 rounded-2xl bg-[#BA9EB4] p-5 text-[#4A2041] shadow-sm">
                  <CheckCircle className="h-10 w-10" strokeWidth={1.5} />
                </div>
                <h3
                  className="mb-2 text-2xl font-medium tracking-wide text-[#4A2041]"
                  style={{
                    fontFamily:
                      "var(--font-title-serif, 'Playfair Display', serif)",
                  }}
                >
                  Aprobaciones
                </h3>
                <p className="mb-6 text-sm font-light leading-relaxed text-[#613C59] max-w-[280px]">
                  Aceptan propuestas, cotizaciones extras y menús digitalmente.
                </p>

                {/* Mini UI Approve */}
                <div className="w-full max-w-[260px] flex items-center justify-between rounded-xl bg-white/50 p-4 shadow-sm border border-white/50">
                  <div className="text-left">
                    <div className="text-sm font-semibold text-[#4A2041]">
                      Menú 3 Tiempos
                    </div>
                    <div className="text-[10px] text-[#4A2041]/70 mt-0.5">
                      Pendiente de revisión
                    </div>
                  </div>
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border-2 border-[#4A2041] text-[#4A2041]">
                    <Check className="h-4 w-4" strokeWidth={3} />
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
    <div className="flex h-10 items-center border-b border-black/10 bg-white/40 px-4">
      <div className="flex gap-2">
        <span className="h-2.5 w-2.5 rounded-full bg-black/20" />
        <span className="h-2.5 w-2.5 rounded-full bg-black/20" />
        <span className="h-2.5 w-2.5 rounded-full bg-black/20" />
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Ornamentos y Partículas                                           */
/* ------------------------------------------------------------------ */
function RingsIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 32 20"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.3"
      className={className}
      aria-hidden="true"
    >
      <circle cx="12" cy="10" r="7.2" />
      <circle cx="20" cy="10" r="7.2" />
    </svg>
  );
}

function OrnamentDivider({ visible }: { visible: boolean }) {
  return (
    <div
      className={cn(
        "my-4 flex items-center gap-3 text-accent/60 transition-opacity duration-700",
        visible ? "opacity-100" : "opacity-0",
      )}
    >
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
    })),
  ).current;

  if (!active) return null;

  return (
    <div
      className="pointer-events-none absolute inset-0 -z-10 overflow-visible"
      aria-hidden="true"
    >
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
