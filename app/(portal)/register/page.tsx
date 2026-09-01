"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { motion, type Variants } from "framer-motion";
import Image from "next/image";
import { API_URL, apiFetch } from "@/utils/apiFetch";
import { AmbientLines } from "@/components/effects/FloatingPaths";
import SideRays from "@/components/effects/SideRays";

// --- Animaciones fluidas ---
const pageVariants: Variants = {
  hidden: { opacity: 0, filter: "blur(8px)" },
  visible: { 
    opacity: 1, 
    filter: "blur(0px)",
    transition: { duration: 0.8, ease: "easeOut" }
  },
  exit: { 
    opacity: 0, 
    filter: "blur(8px)",
    transition: { duration: 0.4, ease: "easeIn" } 
  },
};

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08, delayChildren: 0.15 },
  },
};

const itemVariants: Variants = {
  hidden: { y: 12, opacity: 0 },
  visible: { 
    y: 0, 
    opacity: 1, 
    transition: { duration: 0.5, ease: [0.25, 0.4, 0.25, 1] } 
  },
};

const imageVariants: Variants = {
  hidden: { scale: 1.05, opacity: 0 },
  visible: { 
    scale: 1, 
    opacity: 1, 
    transition: { duration: 1.2, ease: "easeOut" } 
  }
};

export default function RegisterPage() {
  const router = useRouter();
  const [isExiting, setIsExiting] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleNavigateToLogin = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsExiting(true);
    setTimeout(() => {
      router.push("/login");
    }, 400); 
  };

  const handleNavigateToHome = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsExiting(true);
    setTimeout(() => {
      router.push("/");
    }, 400); 
  };

  async function handleEmailRegister(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const response = await apiFetch("/auth/register", {
        method: "POST",
        body: JSON.stringify({ name, email, password }),
      });

      if (!response.ok) {
        if (response.status === 409) {
          throw new Error("Este correo ya está registrado.");
        }
        throw new Error("Error en el servidor al intentar crear la cuenta.");
      }

      const data = await response.json();

      // Guardar tokens reales emitidos por el backend
      if (data.accessToken) localStorage.setItem("accessToken", data.accessToken);
      if (data.refreshToken) localStorage.setItem("refreshToken", data.refreshToken);

      router.push("/dashboard");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Error al registrarse");
    } finally {
      setLoading(false);
    }
  }

  async function handleGoogleRegister() {
    setError("");
    const googleWindow = window.open(
      `${API_URL}/auth/google`,
      "_blank",
      "width=500,height=600"
    );
    if (!googleWindow) {
      setError("Popup bloqueado. Permite popups para este sitio.");
    }
  }

  return (
    <motion.div 
      initial="hidden" 
      animate={isExiting ? "exit" : "visible"}
      variants={pageVariants}
      className="flex h-[100dvh] w-full bg-[#EFEBE4] text-[#2C2723] overflow-hidden select-none"
    >
      
      {/* ===== Columna Izquierda: Formulario Premium ===== */}
      <div className="relative flex h-full w-full flex-col items-center justify-center px-6 py-4 lg:w-1/2 lg:px-12 bg-gradient-to-b from-[#F3EFEA] via-[#ECE6DE] to-[#E5DFD6]">
        
        {/* Botón de volver */}
        <button
          type="button"
          onClick={handleNavigateToHome}
          aria-label="Volver"
          className="group absolute left-5 top-5 lg:left-8 lg:top-8 flex h-9 w-9 items-center justify-center rounded-md border border-[#C9A96A]/30 bg-white/40 text-[#A07D38] backdrop-blur-sm transition-all duration-300 hover:border-[#C9A96A] hover:bg-[#C9A96A]/10"
        >
          <ArrowLeft className="h-4 w-4 transition-transform duration-300 group-hover:-translate-x-1" strokeWidth={1.5} />
        </button>

        <motion.div
          variants={containerVariants}
          className="relative z-10 w-full max-w-[340px]"
        >
          {/* Logo Dorado Original de Áurea */}
          <motion.div variants={itemVariants} className="mb-3 flex justify-center">
            <Image
              src="/images/Logo1.png"
              alt="Áurea"
              width={70}
              height={70}
              priority
              className="h-[52px] w-auto drop-shadow-[0_2px_10px_rgba(201,169,106,0.25)]" 
            />
          </motion.div>

          <motion.div variants={itemVariants} className="mb-5 flex items-center justify-center gap-4 text-[9px] font-semibold uppercase tracking-[0.35em] text-[#A07D38]">
            <span className="h-px w-8 bg-[#C9A96A]/40" />
            REGISTRO
            <span className="h-px w-8 bg-[#C9A96A]/40" />
          </motion.div>

          <motion.div variants={itemVariants}>
            <form onSubmit={handleEmailRegister} className="space-y-3">
              <div>
                <label className="mb-1 block text-[9px] font-medium uppercase tracking-widest text-[#7C7167]">
                  Nombre completo
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Tu nombre"
                  className="w-full rounded-md border border-[#C9A96A]/25 bg-white/75 px-3.5 py-2.5 text-xs text-[#2C2723] placeholder-[#A89F95] shadow-xs backdrop-blur-xs transition-all duration-300 focus:border-[#C9A96A] focus:bg-white focus:shadow-[0_0_15px_rgba(201,169,106,0.15)] focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="mb-1 block text-[9px] font-medium uppercase tracking-widest text-[#7C7167]">
                  Correo electrónico
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="tu@correo.com"
                  className="w-full rounded-md border border-[#C9A96A]/25 bg-white/75 px-3.5 py-2.5 text-xs text-[#2C2723] placeholder-[#A89F95] shadow-xs backdrop-blur-xs transition-all duration-300 focus:border-[#C9A96A] focus:bg-white focus:shadow-[0_0_15px_rgba(201,169,106,0.15)] focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="mb-1 block text-[9px] font-medium uppercase tracking-widest text-[#7C7167]">
                  Contraseña
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full rounded-md border border-[#C9A96A]/25 bg-white/75 px-3.5 py-2.5 text-xs text-[#2C2723] placeholder-[#A89F95] shadow-xs backdrop-blur-xs transition-all duration-300 focus:border-[#C9A96A] focus:bg-white focus:shadow-[0_0_15px_rgba(201,169,106,0.15)] focus:outline-none"
                  required
                />
              </div>

              {error && (
                <p className="text-left text-[11px] text-red-600">{error}</p>
              )}

              <button
                type="submit"
                disabled={loading}
                className="mt-3.5 w-full rounded-md bg-[#C9A96A] py-2.5 text-[10.5px] font-semibold uppercase tracking-[0.2em] text-[#1E1B18] shadow-md shadow-[#C9A96A]/20 transition-all duration-300 hover:bg-[#D4B678] hover:shadow-lg hover:shadow-[#C9A96A]/30 hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-50"
              >
                {loading ? "Creando cuenta..." : "Crear cuenta"}
              </button>
            </form>

            <div className="relative my-4 flex items-center gap-3">
              <span className="h-px flex-1 bg-[#C9A96A]/20" />
              <span className="text-[8.5px] uppercase tracking-widest text-[#8E8378]">
                O regístrate con
              </span>
              <span className="h-px flex-1 bg-[#C9A96A]/20" />
            </div>

            <button
              onClick={handleGoogleRegister}
              className="group flex w-full items-center justify-center gap-2.5 rounded-md border border-[#C9A96A]/25 bg-white/70 py-2 shadow-xs transition-all duration-300 hover:border-[#C9A96A] hover:bg-white"
            >
              <svg className="h-3.5 w-3.5" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
              </svg>
              <span className="text-[11px] font-medium tracking-wider text-[#4E443B]">
                Google
              </span>
            </button>

            <p className="mt-4 text-center text-[10.5px] text-[#7C7167]">
              ¿Ya tienes una cuenta?{" "}
              <a 
                href="/login" 
                onClick={handleNavigateToLogin}
                className="font-semibold text-[#A07D38] underline-offset-4 hover:underline cursor-pointer"
              >
                Inicia sesión
              </a>
            </p>
          </motion.div>
        </motion.div>
      </div>

      {/*  Columna Derecha: Mármol Blanco con Efectos Visibles  */}
      <div className="relative hidden w-1/2 lg:block border-l border-[#C9A96A]/20 bg-[#E8E2D9] overflow-hidden">
        <motion.div 
          variants={imageVariants} 
          className="absolute inset-0 h-full w-full"
        >
          <Image
            src="/images/Register.png"
            alt="Mármol Blanco"
            fill
            priority
            quality={100}
            className="object-cover contrast-105 brightness-95" 
          />
          
          {/* Fundido suave hacia la columna izquierda */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#ECE6DE] via-[#ECE6DE]/30 to-transparent w-1/3 z-10" />

          {/* Líneas fluidas animadas */}
          <div className="pointer-events-none absolute inset-x-0 inset-y-0 z-10 opacity-90 mix-blend-multiply [&_path]:stroke-[#6A4E1D] [&_path]:stroke-[1.5px] [&_path]:opacity-90">
            <AmbientLines />
          </div>

          {/* Rayos dorados con tono ámbar cálido para resaltar sobre mármol claro */}
          <div className="pointer-events-none absolute inset-0 z-10">
            <SideRays
              speed={1.2}
              rayColor1="#B88E3D"
              rayColor2="#8C6721"
              intensity={1.2}
              spread={1.2}
              origin="top-right"
              tilt={8}
              saturation={1.4}
              blend={0.7}
              falloff={1.2}
              opacity={0.7}
            />
          </div>
        </motion.div>
      </div>

    </motion.div>
  );
}