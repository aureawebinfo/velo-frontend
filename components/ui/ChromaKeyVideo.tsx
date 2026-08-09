"use client";

import { useEffect, useRef, useState } from "react";

/* ============================================================================
   ChromaKeyVideo
   Reproduce un video con fondo verde (u otro color sólido con degradado/viñeta)
   y lo dibuja en un <canvas> quitando el fondo en tiempo real, cuadro por cuadro.

   Por qué existe: los .mp4 (H.264) no soportan canal alfa, así que un video
   "sin fondo" exportado a mp4 siempre trae un color de fondo sólido detrás.
   Este componente hace el keying en el cliente para que se vea transparente
   sobre cualquier fondo (el hero de Velo en este caso).

   Cómo funciona:
     1. El <video> real se oculta (display:none) pero sigue reproduciéndose.
     2. En cada requestAnimationFrame, se dibuja el frame actual en un canvas
        oculto de trabajo, se lee su ImageData.
     3. Se convierte cada píxel a HSV y se compara su matiz (hue) contra el
        matiz objetivo (verde ≈ 100°-150°), NO su RGB exacto — así tolera el
        degradado/viñeta del fondo.
     4. Los píxeles dentro del rango de matiz se vuelven transparentes con un
        borde suavizado (feather), y se aplica "spill suppression" para quitar
        el tinte verde que queda pegado a los bordes del sujeto.
     5. El resultado se pinta en el <canvas> visible que sí se muestra en pantalla.
   ============================================================================ */

interface ChromaKeyVideoProps {
  /** Ruta del video fuente (con fondo de color sólido a remover). */
  src: string;
  className?: string;
  /** Matiz objetivo a remover, en grados (0-360). Verde ≈ 120. */
  targetHue?: number;
  /** Tolerancia de matiz en grados. Más alto = quita más verde, pero puede comerse colores del sujeto si se pasa. */
  hueTolerance?: number;
  /** Ancho del borde suavizado (feather), en grados adicionales de matiz. */
  feather?: number;
  /** Saturación mínima para considerar el píxel parte del fondo (evita comerse blancos/negros/grises). */
  minSaturation?: number;
  /** Fuerza de la corrección de "spill" (tinte verde en bordes del sujeto), 0-1. */
  spillStrength?: number;
  autoPlay?: boolean;
  loop?: boolean;
  muted?: boolean;
  /** object-fit del resultado dentro del canvas: "cover" | "contain". */
  fit?: "cover" | "contain";
}

/** Convierte RGB (0-255) a HSV, retornando h en grados (0-360), s y v en 0-1. */
function rgbToHsv(r: number, g: number, b: number) {
  const rN = r / 255;
  const gN = g / 255;
  const bN = b / 255;
  const max = Math.max(rN, gN, bN);
  const min = Math.min(rN, gN, bN);
  const delta = max - min;

  let h = 0;
  if (delta !== 0) {
    if (max === rN) {
      h = 60 * (((gN - bN) / delta) % 6);
    } else if (max === gN) {
      h = 60 * ((bN - rN) / delta + 2);
    } else {
      h = 60 * ((rN - gN) / delta + 4);
    }
  }
  if (h < 0) h += 360;

  const s = max === 0 ? 0 : delta / max;
  const v = max;

  return { h, s, v };
}

/** Distancia angular más corta entre dos matices en el círculo de 360°. */
function hueDistance(a: number, b: number) {
  const diff = Math.abs(a - b) % 360;
  return diff > 180 ? 360 - diff : diff;
}

export default function ChromaKeyVideo({
  src,
  className,
  targetHue = 122,
  hueTolerance = 34,
  feather = 16,
  minSaturation = 0.18,
  spillStrength = 0.6,
  autoPlay = true,
  loop = true,
  muted = true,
  fit = "cover",
}: ChromaKeyVideoProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const workCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const rafRef = useRef<number | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas) return;

    // canvas de trabajo (offscreen), reutilizado en cada frame
    if (!workCanvasRef.current) {
      workCanvasRef.current = document.createElement("canvas");
    }
    const workCanvas = workCanvasRef.current;
    const ctx = canvas.getContext("2d", { willReadFrequently: true });
    const workCtx = workCanvas.getContext("2d", { willReadFrequently: true });
    if (!ctx || !workCtx) return;

    const onLoadedMetadata = () => {
      const w = video.videoWidth;
      const h = video.videoHeight;
      canvas.width = w;
      canvas.height = h;
      workCanvas.width = w;
      workCanvas.height = h;
      setReady(true);
    };

    video.addEventListener("loadedmetadata", onLoadedMetadata);

    const drawFrame = () => {
      if (
        video.readyState >= video.HAVE_CURRENT_DATA &&
        workCanvas.width > 0 &&
        workCanvas.height > 0
      ) {
        const w = workCanvas.width;
        const h = workCanvas.height;

        workCtx.drawImage(video, 0, 0, w, h);
        const frame = workCtx.getImageData(0, 0, w, h);
        const data = frame.data;

        for (let i = 0; i < data.length; i += 4) {
          const r = data[i];
          const g = data[i + 1];
          const b = data[i + 2];

          const { h: hue, s: sat } = rgbToHsv(r, g, b);

          if (sat < minSaturation) {
            // píxel casi gris/blanco/negro: probablemente parte del sujeto, se deja intacto
            continue;
          }

          const dist = hueDistance(hue, targetHue);

          if (dist < hueTolerance) {
            // dentro del fondo: transparente total
            data[i + 3] = 0;
          } else if (dist < hueTolerance + feather) {
            // borde: transparencia gradual (feather) para que no quede un corte duro
            const t = (dist - hueTolerance) / feather; // 0 → 1
            data[i + 3] = Math.round(data[i + 3] * t);

            // spill suppression: en el borde, reducimos el canal verde hacia
            // el promedio de rojo/azul para quitar el tinte verde reflejado
            const avgRB = (r + b) / 2;
            data[i + 1] = Math.round(
              g - (g - avgRB) * spillStrength * (1 - t)
            );
          }
        }

        workCtx.putImageData(frame, 0, 0);

        // dibuja el resultado (ya con alpha) en el canvas visible, respetando "fit"
        const canvasW = canvas.width;
        const canvasH = canvas.height;
        ctx.clearRect(0, 0, canvasW, canvasH);

        if (fit === "cover") {
          const scale = Math.max(canvasW / w, canvasH / h);
          const drawW = w * scale;
          const drawH = h * scale;
          ctx.drawImage(
            workCanvas,
            (canvasW - drawW) / 2,
            (canvasH - drawH) / 2,
            drawW,
            drawH
          );
        } else {
          const scale = Math.min(canvasW / w, canvasH / h);
          const drawW = w * scale;
          const drawH = h * scale;
          ctx.drawImage(
            workCanvas,
            (canvasW - drawW) / 2,
            (canvasH - drawH) / 2,
            drawW,
            drawH
          );
        }
      }

      rafRef.current = requestAnimationFrame(drawFrame);
    };

    rafRef.current = requestAnimationFrame(drawFrame);

    return () => {
      video.removeEventListener("loadedmetadata", onLoadedMetadata);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [targetHue, hueTolerance, feather, minSaturation, spillStrength, fit]);

  return (
    <div className={`relative ${className ?? ""}`}>
      {/* video real, oculto: sigue reproduciéndose y alimenta al canvas */}
      <video
        ref={videoRef}
        src={src}
        autoPlay={autoPlay}
        loop={loop}
        muted={muted}
        playsInline
        className="pointer-events-none absolute h-0 w-0 opacity-0"
      />
      {/* resultado visible, ya sin fondo */}
      <canvas
        ref={canvasRef}
        className="h-full w-full"
        style={{ opacity: ready ? 1 : 0, transition: "opacity 300ms ease" }}
      />
    </div>
  );
}