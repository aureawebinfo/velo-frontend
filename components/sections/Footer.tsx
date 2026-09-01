"use client";

/**
 * AUREA — Footer · Cinematic (video en loop real + spotlight que revela el video)
 */

import { useEffect, useMemo, useRef, useState, type ReactElement } from "react";

// ─── Config ──────────────────────────────────────────────────────────────
const FOOTER_VIDEO = "/videos/video_hero.mp4";
const FOOTER_IMAGE = "/images/hero/hero1.webp";

const FLOWER_FRAME_MAX_CHECK = 5;
const FLOWER_FRAME_INTERVAL_MS = 110;
const FLOWER_HOLD_MS = 1200;
const FLOWER_CLOSE_HOLD_MS = 260;

const REVEAL_RADIUS_PX = 170;

function flowerFramePath(n: number) {
  return `/images/hero/flower/flower-${String(n).padStart(2, "0")}.png`;
}

const NAV_COLUMNS: {
  title: string;
  links: { label: string; href: string; target?: string }[];
}[] = [
  {
    title: "EXPLORA",
    links: [
      { label: "Inicio", href: "#inicio" },
      { label: "Características", href: "#features" },
      { label: "Beneficios", href: "#benefits" },
      { label: "La Plataforma", href: "#product" },
      { label: "Espacios", href: "#gallery" },
    ],
  },
  {
    title: "CONOCE MÁS",
    links: [
      { label: "Impacto Comercial", href: "#value" },
      { label: "Estadísticas", href: "#stats" },
      { label: "Testimonios", href: "#testimonials" },
      { label: "Planes", href: "#pricing" },
    ],
  },
  {
    title: "CONTACTO",
    links: [
      { label: "Solicita tu demo", href: "#cta" },
      {
        label: "Escríbenos al WhatsApp",
        href: "https://wa.me/573002477019?text=Hola%20%C3%81urea,%20me%20gustar%C3%ADa%20recibir%20m%C3%A1s%20informaci%C3%B3n.",
        target: "_blank",
      },
      {
        label: "Cómo llegar",
        href: "https://www.google.com/maps/search/?api=1&query=Aurea+Web+Colombia",
        target: "_blank",
      },
      { label: "Portal de novios", href: "/app/login" },
    ],
  },
];

const SOCIAL_LINKS: { label: string; href: string; icon: ReactElement }[] = [
  {
    label: "Instagram",
    href: "https://www.instagram.com/aurea.web/",
    icon: <InstagramIcon />,
  },
  {
    label: "TikTok",
    href: "https://www.tiktok.com/@aurea_web?is_from_webapp=1&sender_device=pc",
    icon: <TikTokIcon />,
  },
  {
    label: "LinkedIn",
    href: "https://www.linkedin.com/in/%C3%A1urea-web-s-a-s-403861384/",
    icon: <LinkedInIcon />,
  },
  {
    label: "GitHub",
    href: "https://github.com/aureawebinfo",
    icon: <GitHubIcon />,
  },
];

export function Footer() {
  const footerRef = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  const [inView, setInView] = useState(false);
  const [flowerFrameCount, setFlowerFrameCount] = useState(1);
  const [flowerReady, setFlowerReady] = useState(false);
  const [flowerFrame, setFlowerFrame] = useState(0);
  const [reduceMotion, setReduceMotion] = useState(false);

  // ── Spotlight con el cursor: perfora la imagen para revelar el video ──
  const [revealPos, setRevealPos] = useState<{ x: number; y: number; alpha: number } | null>(
    null
  );

  const handleMouseMove = (e: React.MouseEvent<HTMLElement>) => {
    const rect = footerRef.current?.getBoundingClientRect();
    if (!rect) return;

    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Calcular distancia exacta desde el cursor hasta la esquina inferior derecha
    const cornerX = rect.width;
    const cornerY = rect.height;
    const distanceToCorner = Math.sqrt(
      Math.pow(cornerX - x, 2) + Math.pow(cornerY - y, 2)
    );

    let alpha = 0; // 0 = linterna encendida (revela todo)
    
    // Distancias para el efecto (puedes ajustarlas si lo necesitas)
    const FADE_START = 600; // A 600px de la esquina, empieza a perder fuerza
    const FADE_END = 300;   // A 300px o menos, se bloquea TOTALMENTE (100% oculto)

    if (distanceToCorner < FADE_START) {
      if (distanceToCorner <= FADE_END) {
        alpha = 1; // Apagado total en la zona de la marca de agua
      } else {
        // Transición suave entre 600px y 300px
        alpha = 1 - ((distanceToCorner - FADE_END) / (FADE_START - FADE_END));
      }
    }

    setRevealPos({ x, y, alpha });
  };

  const handleMouseLeave = () => setRevealPos(null);

  const revealMaskStyle = useMemo<React.CSSProperties | undefined>(() => {
    const x = revealPos ? `${revealPos.x}px` : "-9999px";
    const y = revealPos ? `${revealPos.y}px` : "-9999px";
    const alpha = revealPos ? revealPos.alpha : 0;

    // Una sola máscara dinámica que "rellena" el agujero con alpha cuando te acercas a la esquina
    const spotlightMask = `radial-gradient(circle ${REVEAL_RADIUS_PX}px at ${x} ${y}, rgba(0,0,0,${alpha}) 0%, rgba(0,0,0,${alpha}) 55%, rgba(0,0,0,1) 100%)`;

    return {
      WebkitMaskImage: spotlightMask,
      maskImage: spotlightMask,
    };
  }, [revealPos]);

  // ── Reduce motion ────────────────────────────────────────────────────
  useEffect(() => {
    setReduceMotion(
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    );
  }, []);

  // ── El video arranca (y se queda en loop) al llegar al footer ────────
  useEffect(() => {
    const el = footerRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (entry.isIntersecting) {
          setInView(true);
          observer.disconnect();
        }
      },
      { threshold: 0.2 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!inView) return;
    const v = videoRef.current;
    if (!v) return;
    v.currentTime = 0;
    v.play().catch(() => {});
  }, [inView]);

  // ── Flower: detectar frames disponibles ──────────────────────────────
  useEffect(() => {
    let cancelled = false;
    const found = new Array<boolean>(FLOWER_FRAME_MAX_CHECK).fill(false);
    let settled = 0;
    for (let i = 0; i < FLOWER_FRAME_MAX_CHECK; i++) {
      const img = new window.Image();
      const done = (ok: boolean) => {
        found[i] = ok;
        if (++settled === FLOWER_FRAME_MAX_CHECK && !cancelled) {
          let count = 0;
          while (count < FLOWER_FRAME_MAX_CHECK && found[count]) count++;
          setFlowerFrameCount(Math.max(count, 1));
          setFlowerReady(true);
        }
      };
      img.onload = () => done(true);
      img.onerror = () => done(false);
      img.src = flowerFramePath(i + 1);
    }
    return () => {
      cancelled = true;
    };
  }, []);

  const flowerFrames = useMemo(
    () =>
      Array.from({ length: flowerFrameCount }, (_, i) =>
        flowerFramePath(i + 1)
      ),
    [flowerFrameCount]
  );

  // ── Flower: flipbook idle (abre, mantiene, cierra, mantiene, repite) ──
  useEffect(() => {
    if (!flowerReady) return;
    if (reduceMotion) {
      setFlowerFrame(flowerFrameCount - 1);
      return;
    }

    let frame = 0;
    let direction: 1 | -1 = 1;
    let cancelled = false;
    let tid: ReturnType<typeof setTimeout>;

    const tick = () => {
      if (cancelled) return;
      setFlowerFrame(frame);
      const atOpen = direction === 1 && frame === flowerFrameCount - 1;
      const atClosed = direction === -1 && frame === 0;
      let delay = FLOWER_FRAME_INTERVAL_MS;
      if (atOpen) {
        delay = FLOWER_HOLD_MS;
        direction = -1;
      } else if (atClosed) {
        delay = FLOWER_CLOSE_HOLD_MS;
        direction = 1;
      } else {
        frame += direction;
      }
      tid = setTimeout(tick, delay);
    };
    tid = setTimeout(tick, 0);
    return () => {
      cancelled = true;
      clearTimeout(tid);
    };
  }, [flowerReady, flowerFrameCount, reduceMotion]);

  return (
    <footer
      id="contacto"
      ref={footerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="relative w-full overflow-hidden bg-black text-[#EFE6D2]  [&_a]: [&_button]:"
    >
      {/* Entrada suave desde la sección anterior */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-[420px] bg-gradient-to-b from-black via-black/85 to-transparent z-[1]" />

      {/* ── Fondo: video en loop permanente + imagen que el cursor "perfora" ── */}
      <div className="absolute inset-0 z-0">
        <video
          ref={videoRef}
          className="absolute inset-0 h-full w-full object-cover"
          src={FOOTER_VIDEO}
          poster={FOOTER_IMAGE}
          loop
          muted
          playsInline
          preload="auto"
        />

        {/* Imagen estática: cubre todo, pero ahora la máscara protege la esquina inferior derecha */}
        <img
          src={FOOTER_IMAGE}
          alt=""
          aria-hidden
          loading="lazy"
          decoding="async"
          className="absolute inset-0 h-full w-full object-cover"
          style={revealMaskStyle}
        />

        <div className="absolute inset-0 bg-black/60" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(201,169,106,0.08),transparent_60%)]" />
        <div className="absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-[#C9A96A]/40 to-transparent" />
        
        {/* ELIMINADO: Ya no necesitas el div oscuro de h-24 w-40 aquí */}
      </div>

      {/* ── Contenido ────────────────────────────────────────────────── */}
      <div className="relative z-10 mx-auto max-w-[1600px] px-6 pb-6 pt-6 sm:px-10 sm:pt-8">
        {/* ── Bloque superior: tres columnas ─────────────────────────── */}
        <div className="border-b border-[#C9A96A]/15 pb-6">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3 md:gap-4 lg:gap-6">
            {/* Columna izquierda: filosofía / cita */}
            <div className="flex flex-col items-center justify-center text-center md:items-start md:text-left">
              <span className="text-[10px] uppercase tracking-[0.3em] text-[#C9A96A]/70">
                Nuestra filosofía
              </span>
              <span className="mt-3 font-serif text-lg italic leading-snug text-[#EFE6D2] md:text-xl">
                "Donde los sueños
                <br className="hidden md:block" />
                encuentran su hogar"
              </span>
              <div className="mt-4 h-px w-12 bg-[#C9A96A]/40" />
            </div>

            {/* Columna central: rosa + título + CTA */}
            <div className="flex flex-col items-center text-center">
              {flowerFrames.length > 0 && (
                <img
                  src={
                    flowerFrames[Math.min(flowerFrame, flowerFrames.length - 1)]
                  }
                  alt=""
                  aria-hidden
                  className="w-[min(75%,340px)] object-contain drop-shadow-[0_0_40px_rgba(0,0,0,0.65)]"
                  style={{ imageRendering: "crisp-edges" }}
                />
              )}
              <h2 className="mt-0 font-serif text-[clamp(1.4rem,3.5vw,2.4rem)] tracking-tight bg-clip-text text-transparent bg-linear-to-b from-[#F6E7BC] via-[#D8B876] to-[#8F7139]">
                Listo para escribir tu historia
              </h2>
              <p className="max-w-xs text-sm text-[#B9AF9B]">
                Agenda una visita y descubre por qué las parejas eligen Aurea
                para el día más importante de sus vidas.
              </p>
              <a
                href="https://wa.me/573002477019?text=Hola%20%C3%81urea%20Web%2C%20me%20gustar%C3%ADa%20recibir%20m%C3%A1s%20informaci%C3%B3n%20sobre%20sus%20servicios."
                target="_blank"
                rel="noopener noreferrer"
                className="mt-3 inline-flex items-center gap-3 rounded-full border border-[#C9A96A]/60 px-8 py-3 text-[11px] tracking-[0.3em] text-[#EFE6D2] transition-all duration-500 hover:border-[#C9A96A] hover:bg-[#C9A96A]/10 sm:text-xs"
              >
                AGENDA TU VISITA
              </a>
            </div>

            {/* Columna derecha: contacto */}
            <div className="flex flex-col items-center justify-center text-center md:items-end md:text-right">
              <span className="text-[10px] uppercase tracking-[0.3em] text-[#C9A96A]/70">
                Estamos para ti
              </span>
              {/* Se agregó la etiqueta de apertura <a ...> aquí */}
              <a
                href="https://wa.me/573002477019"
                target="_blank"
                rel="noopener noreferrer"
                className="mt-3 font-serif text-lg text-[#EFE6D2] transition-colors duration-300 hover:text-[#C9A96A] md:text-xl"
              >
                +57 300 247 7019
              </a>
              {/* Se agregó la etiqueta de apertura <a ...> aquí */}
              <a
                href="mailto:aureawebinfo@gmail.com"
                className="mt-1 text-sm text-[#B9AF9B] transition-colors duration-300 hover:text-[#EFE6D2]"
              >
                aureawebinfo@gmail.com
              </a>{" "}
              {/* Se agregó la etiqueta de cierre </a> aquí */}
              <div className="mt-4 h-px w-12 bg-[#C9A96A]/40" />
            </div>
          </div>
        </div>

        {/* ── Bloque medio: logo + columnas + redes ──────────────────── */}
        <div className="grid grid-cols-1 gap-8 py-8 sm:grid-cols-2 lg:grid-cols-5">
          <div className="lg:col-span-2">
            <a
              href="https://aurea-web.com"
              target="_blank"
              rel="noopener noreferrer"
              className="font-serif text-2xl tracking-tight bg-clip-text text-transparent bg-linear-to-b from-[#F6E7BC] via-[#D8B876] to-[#8F7139]"
            >
              AUREA
            </a>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-[#B9AF9B]">
              Casa de eventos dedicada a bodas exclusivas, donde cada detalle se
              diseña para convertirse en un recuerdo inolvidable.
            </p>
            <div className="mt-6 flex items-center gap-4">
              {SOCIAL_LINKS.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  aria-label={s.label}
                  className="group relative flex h-12 w-12 items-center justify-center rounded-full transition-transform duration-300 hover:scale-110"
                >
                  <span className="absolute inset-0 rounded-full border border-[#C9A96A]/40 bg-linear-to-b from-[#C9A96A]/15 to-transparent transition-all duration-300 group-hover:border-[#C9A96A] group-hover:shadow-[0_0_18px_rgba(201,169,106,0.45)]" />
                  <span className="relative text-[#D8B876] transition-colors duration-300 group-hover:text-[#F6E7BC]">
                    {s.icon}
                  </span>
                </a>
              ))}
            </div>
          </div>

          {NAV_COLUMNS.map((col) => (
            <div key={col.title}>
              <h3 className="text-[11px] tracking-[0.25em] text-[#C9A96A]">
                {col.title}
              </h3>
              <ul className="mt-4 space-y-3">
                {col.links.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      className="text-sm text-[#B9AF9B] transition-colors duration-300 hover:text-[#EFE6D2]"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* ── Barra inferior ──────────────────────────────────────────── */}
        <div className="flex flex-col items-center justify-between gap-4 border-t border-[#C9A96A]/15 pt-5 text-xs text-[#B9AF9B] sm:flex-row">
          <p>
            &copy; {new Date().getFullYear()}{" "}
            <a
              href="https://aurea-web.com"
              target="_blank"
              rel="noopener noreferrer"
              className=" font-medium text-[#C9A96A] transition-colors hover:text-[#EFE6D2]"
            >
              Aurea Web
            </a>
            . Todos los derechos reservados.
          </p>
          <div className="flex items-center gap-6">
            <a
              href="/privacidad"
              className=" transition-colors duration-300 hover:text-[#EFE6D2]"
            >
              Política de privacidad
            </a>
            <a
              href="/terminos"
              className=" transition-colors duration-300 hover:text-[#EFE6D2]"
            >
              Términos y condiciones
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;

// ─── Iconos sociales ─────────────────────────────────────────────────
function LinkedInIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
      <path d="M20.45 20.45h-3.55v-5.57c0-1.33-.02-3.03-1.85-3.03-1.85 0-2.14 1.45-2.14 2.94v5.66H9.36V9h3.41v1.56h.05c.47-.9 1.63-1.85 3.36-1.85 3.6 0 4.27 2.37 4.27 5.45v6.29ZM5.34 7.43a2.06 2.06 0 1 1 0-4.12 2.06 2.06 0 0 1 0 4.12ZM7.12 20.45H3.56V9h3.56v11.45Z" />
    </svg>
  );
}

function GitHubIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2C6.48 2 2 6.58 2 12.21c0 4.51 2.87 8.33 6.84 9.68.5.1.68-.22.68-.49v-1.92c-2.78.62-3.37-1.36-3.37-1.36-.46-1.19-1.11-1.51-1.11-1.51-.91-.64.07-.62.07-.62 1 .07 1.53 1.06 1.53 1.06.89 1.56 2.34 1.11 2.91.85.09-.66.35-1.11.63-1.37-2.22-.26-4.56-1.13-4.56-5.02 0-1.11.38-2.02 1.01-2.73-.1-.26-.44-1.3.1-2.71 0 0 .83-.27 2.72 1.04a9.2 9.2 0 0 1 4.96 0c1.89-1.31 2.72-1.04 2.72-1.04.54 1.41.2 2.45.1 2.71.63.71 1.01 1.62 1.01 2.73 0 3.9-2.34 4.76-4.57 5.01.36.32.68.94.68 1.9v2.82c0 .27.18.6.69.49A10.03 10.03 0 0 0 22 12.21C22 6.58 17.52 2 12 2Z" />
    </svg>
  );
}

function InstagramIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.6}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="2" y="2" width="20" height="20" rx="5" />
      <circle cx="12" cy="12" r="4.2" />
      <circle cx="17.3" cy="6.7" r="0.6" fill="currentColor" stroke="none" />
    </svg>
  );
}
function FacebookIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.6}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3.2l.8-4H14V7a1 1 0 0 1 1-1h3V2Z" />
    </svg>
  );
}
function TikTokIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.6}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M9 12a3.5 3.5 0 1 0 3.5 3.5V3.5" />
      <path d="M12.5 5.5a4.5 4.5 0 0 0 4.5 4.5" />
    </svg>
  );
}
function WhatsAppIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12.012 2c-5.506 0-9.989 4.478-9.99 9.984a9.932 9.932 0 001.356 5.03L2 22l5.129-1.343a9.92 9.92 0 004.88 1.272h.004c5.505 0 9.988-4.478 9.989-9.985 0-2.668-1.038-5.176-2.924-7.062A9.914 9.914 0 0012.012 2zm5.834 14.195c-.247.694-1.222 1.326-1.721 1.385-.47.056-1.077.08-1.721-.128-.392-.127-.899-.292-1.554-.576-2.756-1.192-4.549-3.98-4.688-4.165-.138-.184-1.13-1.503-1.13-2.868 0-1.365.716-2.038.972-2.316.255-.278.558-.348.744-.348.187 0 .373.001.536.01.173.008.406-.066.634.482.238.572.81 1.977.88 2.12.07.143.118.312.023.498-.093.187-.14.303-.278.464-.138.163-.29.364-.414.489-.138.139-.283.29-.122.567.161.278.718 1.186 1.542 1.921 1.06.946 1.954 1.238 2.232 1.377.278.139.44.116.603-.07.162-.186.696-.811.881-1.089.186-.278.371-.232.626-.139.255.093 1.624.765 1.902.904.278.139.464.209.533.325.07.116.07.672-.177 1.366z" />
    </svg>
  );
}
