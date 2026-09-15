"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

const SLIDESHOW_IMAGES = [
  "/proximamente/soon1.webp",
  "/proximamente/soon2.webp",
  "/proximamente/soon3.webp",
  "/proximamente/soon4.webp",
  "/proximamente/soon5.webp",
];

// 👇 Fondo dedicado para móvil (vertical). Cambia esta ruta por una imagen
// de flores/boda que tengas, idealmente en formato vertical o cuadrado.
const MOBILE_BACKGROUND = "/proximamente/soon1.webp";

const SLIDE_DURATION_MS = 4000;
const FADE_DURATION_MS = 1200;

export default function ComingSoonScreen() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % SLIDESHOW_IMAGES.length);
    }, SLIDE_DURATION_MS);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative flex h-[100dvh] w-full items-center justify-center overflow-hidden bg-black">
      {/* ── DESKTOP/TABLET: slideshow de las 5 imágenes horizontales ── */}
      <div className="absolute inset-0 hidden sm:block">
        {SLIDESHOW_IMAGES.map((src, i) => (
          <div
            key={src}
            className="absolute inset-0"
            style={{
              opacity: i === activeIndex ? 1 : 0,
              transition: `opacity ${FADE_DURATION_MS}ms ease-in-out`,
            }}
          >
            <Image
              src={src}
              alt="Próximamente"
              fill
              priority={i === 0}
              className="object-cover"
              sizes="100vw"
              unoptimized
            />
          </div>
        ))}
        <div className="absolute inset-0 bg-black/40" />
      </div>

      {/* ── MOBILE: fondo floral fijo + texto "Próximamente" elegante ── */}
      <div className="absolute inset-0 block sm:hidden">
        <Image
          src={MOBILE_BACKGROUND}
          alt="Próximamente"
          fill
          priority
          className="object-cover"
          sizes="100vw"
          unoptimized
        />
        <div className="absolute inset-0 bg-black/55" />

        <div className="absolute inset-0 flex flex-col items-center justify-center px-6 text-center">
          <h1 className="font-serif text-5xl tracking-tight bg-clip-text text-transparent bg-gradient-to-b from-[#F6E7BC] via-[#D8B876] to-[#8F7139] drop-shadow-lg">
            Próximamente
          </h1>
          <div className="mt-4 flex items-center gap-3">
            <span className="h-px w-8 bg-[#C9A96A]/60" />
            <span className="font-serif text-xl tracking-[0.3em] text-[#EFE6D2]">
              VELO
            </span>
            <span className="h-px w-8 bg-[#C9A96A]/60" />
          </div>
          <p className="mt-3 max-w-[280px] text-xs text-[#B9AF9B]">
            El arte de organizar tu boda perfecta, sin caos
          </p>
        </div>
      </div>

      {/* ── Contador fijo hasta abajo, respetando el safe-area del celular ── */}
      {isMounted && (
        <div
          className="absolute inset-x-0 z-10 flex w-full justify-center gap-4 px-4 sm:gap-12 sm:px-6"
          style={{
            bottom: "max(1rem, env(safe-area-inset-bottom))",
          }}
        >
          {[
            { label: "DÍAS", value: 0 },
            { label: "HORAS", value: 0 },
            { label: "MINUTOS", value: 0 },
            { label: "SEGUNDOS", value: 0 },
          ].map((item, idx) => (
            <div key={idx} className="flex flex-col items-center">
              <span className="font-serif text-2xl tracking-tight bg-clip-text text-transparent bg-gradient-to-b from-[#F6E7BC] via-[#D8B876] to-[#8F7139] drop-shadow-lg sm:text-4xl md:text-5xl lg:text-6xl">
                {String(item.value).padStart(2, "0")}
              </span>
              <span className="mt-1 text-[8px] uppercase tracking-[0.2em] text-[#C9A96A] sm:mt-2 sm:text-[10px] sm:tracking-[0.3em] md:text-[11px]">
                {item.label}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}