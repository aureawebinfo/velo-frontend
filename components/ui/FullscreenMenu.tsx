"use client";

import React, { useEffect } from "react";
// Hemos eliminado el dynamic import de SoftAurora para mejorar drásticamente el rendimiento
import { AnimatePresence, motion, type Variants } from "framer-motion";

export type MenuItem = { label: string; href: string };

export const MENU_ITEMS: MenuItem[] = [
  { label: "Inicio", href: "#inicio" },
  { label: "Características", href: "#features" },
  { label: "Beneficios", href: "#benefits" },
  { label: "Estadísticas", href: "#stats" },
  { label: "El Portal", href: "#product" },
  { label: "Galería", href: "#gallery" },
  { label: "Valor Comercial", href: "#value" },
  { label: "Planes", href: "#pricing" },
  { label: "Testimonios", href: "#testimonials" },
];

const ROMAN = ["I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX", "X"];

const panelVariants: Variants = {
  hidden: { x: "100%" },
  visible: {
    x: "0%",
    transition: { duration: 0.7, ease: [0.65, 0.01, 0.05, 0.99] },
  },
  exit: {
    x: "100%",
    transition: { duration: 0.45, ease: [0.65, 0.01, 0.05, 0.99] },
  },
};

const overlayVariants: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.5 } },
  exit: { opacity: 0, transition: { duration: 0.3 } },
};

const listVariants: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.05, delayChildren: 0.2 } },
  exit: { transition: { staggerChildren: 0.03, staggerDirection: -1 } },
};

const linkVariants: Variants = {
  hidden: { x: 20, opacity: 0 },
  visible: {
    x: 0,
    opacity: 1,
    transition: { type: "spring", stiffness: 200, damping: 26 },
  },
  exit: { x: 20, opacity: 0, transition: { duration: 0.2 } },
};

function CloseIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="14"
      height="14"
      viewBox="0 0 16 16"
      fill="none"
    >
      <path
        d="M7.33333 16L7.33333 0L8.66667 0L8.66667 16L7.33333 16Z"
        fill="currentColor"
        transform="rotate(45 8 8)"
      />
      <path
        d="M16 8.66667L0 8.66667L0 7.33333L16 7.33333L16 8.66667Z"
        fill="currentColor"
        transform="rotate(45 8 8)"
      />
    </svg>
  );
}

export default function FullscreenMenu({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    if (isOpen) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleEsc);
    } else {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleEsc);
    }

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleEsc);
    };
  }, [isOpen, onClose]);

  const handleNavigation = (
    e: React.MouseEvent<HTMLAnchorElement>,
    href: string,
  ) => {
    e.preventDefault();
    onClose();
    setTimeout(() => {
      const targetId = href.substring(1);
      const element = document.getElementById(targetId);
      if (element) element.scrollIntoView({ behavior: "smooth" });
    }, 450);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex justify-end ">
          {/* Overlay Izquierdo (Desktop) */}
          <motion.div
            initial="hidden"
            animate="visible"
            exit="exit"
            variants={overlayVariants}
            className="absolute inset-0 hidden sm:block bg-black/60 backdrop-blur-sm z-10"
            onClick={onClose}
          >
            {/* OPTIMIZACIÓN: Reemplazo de SoftAurora por un gradiente CSS puro. 
                Es 100% ligero, no consume CPU y mantiene el estilo elegante. */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_50%,_rgba(201,169,106,0.15),_transparent_60%)] pointer-events-none" />
          </motion.div>

          {/* Overlay Móvil */}
          <motion.div
            initial="hidden"
            animate="visible"
            exit="exit"
            variants={overlayVariants}
            className="absolute inset-0 block sm:hidden bg-black/95 z-0"
            onClick={onClose}
          />

          {/* Panel del Menú */}
          <motion.div
            initial="hidden"
            animate="visible"
            exit="exit"
            variants={panelVariants}
            className="relative z-30 flex h-full w-full flex-col border-l border-white/5 bg-[#0A0806] sm:w-[450px] lg:w-[500px] shadow-2xl "
          >
            <div className="pointer-events-none absolute inset-0 overflow-hidden">
              <div className="absolute -top-[10%] -right-[10%] h-[40%] w-[60%] rounded-full bg-[#C9A96A]/10 blur-[100px]" />
              <div className="absolute -bottom-[10%] -left-[10%] h-[40%] w-[60%] rounded-full bg-[#C9A96A]/05 blur-[100px]" />
            </div>

            {/* Contenedor principal: Ajuste de padding vertical (py-4) para ganar espacio */}
            <div className="relative z-10 flex h-full min-h-0 flex-col px-6 py-4 sm:px-12 sm:py-8 overflow-hidden">
              {/* Header (sin cambios) */}
              <div className="mb-4 sm:mb-6 flex items-center justify-between shrink-0">
                <span className="text-lg sm:text-xl font-serif tracking-tight text-[#EFE6D2]">
                  Áurea
                </span>
                <button
                  onClick={onClose}
                  className="group flex items-center gap-3 text-[#B9AF9B] hover:text-[#C9A96A] transition-colors "
                >
                  <span className="text-[10px] uppercase tracking-[0.2em] hidden sm:block">
                    Cerrar
                  </span>
                  <div className="flex h-8 w-8 sm:h-10 sm:w-10 items-center justify-center rounded-full border border-white/10 group-hover:border-[#C9A96A]/40 transition-all">
                    <CloseIcon />
                  </div>
                </button>
              </div>

              {/* Navegación: min-h-0 es la clave para que respete el espacio disponible */}
              <motion.nav
                variants={listVariants}
                className="flex flex-1 min-h-0 flex-col justify-between"
              >
                {MENU_ITEMS.map((item, i) => (
                  <motion.a
                    key={item.href}
                    variants={linkVariants}
                    href={item.href}
                    onClick={(e) => handleNavigation(e, item.href)}
                    className="group relative flex items-baseline gap-3 sm:gap-4 border-b border-white/[0.03] transition-colors "
                    style={{ paddingBlock: "clamp(0.35rem, 1.6vh, 0.875rem)" }}
                  >
                    <span className="w-5 sm:w-6 font-mono text-[9px] tracking-widest text-[#C9A96A]/40 group-hover:text-[#C9A96A]">
                      {ROMAN[i]}
                    </span>
                    <span
                      className="font-serif tracking-tight text-[#EFE6D2]/80 group-hover:text-[#EFE6D2] group-hover:translate-x-2 transition-all duration-300"
                      style={{ fontSize: "clamp(1.1rem, 3.2vh, 1.875rem)" }}
                    >
                      {item.label}
                    </span>
                    <span className="absolute bottom-0 left-0 h-[1px] w-0 bg-[#C9A96A] transition-all duration-500 group-hover:w-full" />
                  </motion.a>
                ))}
              </motion.nav>

              {/* Footer (sin cambios) */}
              <div className="mt-4 sm:mt-6 flex flex-col gap-2 border-t border-white/5 pt-4 shrink-0 sm:flex-row sm:items-center sm:justify-between">
                <span className="text-[8px] sm:text-[9px] uppercase tracking-[0.2em] text-[#B9AF9B]">
                  Velo · Gestión de Eventos
                </span>
                <a
                  href="/login"
                  className="text-[10px] uppercase tracking-[0.15em] text-[#C9A96A] hover:text-white transition-colors "
                >
                  Acceso clientes <span className="ml-1">→</span>
                </a>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
