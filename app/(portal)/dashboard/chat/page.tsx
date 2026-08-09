"use client";

// ---------------------------------------------------------------------------
// M5 — Chat Privado de Concierge (Integrado en Dashboard Unificado)
// ---------------------------------------------------------------------------

import { useEffect, useRef, useState } from "react";
import { Send, Loader2, AlertTriangle, RefreshCw, MessageCircle } from "lucide-react";
import { cn } from "@/lib/cn"; // Asegúrate de tener este helper, si no, usa className estándar

// ---------------------------------------------------------------------------
// Tipos e Interfaces (Se mantienen igual)
// ---------------------------------------------------------------------------
interface Mensaje {
  id: string;
  senderId?: string;
  senderName?: string;
  message: string;
  createdAt: string;
}

interface MensajesResponse {
  data: Mensaje[];
  total: number;
  page: number;
  limit: number;
}

type VistaChat = "cargando" | "vacio" | "error" | "listo";

// ---------------------------------------------------------------------------
// Configuración y Helpers (Adaptados al diseño unificado)
// ---------------------------------------------------------------------------
const API_URL = process.env.NEXT_PUBLIC_API_URL || "";
const POLLING_INTERVAL = 10000; // 10 segundos

// Helpers de auth (localStorage)
function getAccessToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("accessToken");
}

function getSelectedEventId(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("selectedEventId");
}

// Helpers de formato
function formatearHora(iso?: string): string {
  if (!iso) return "";
  return new Date(iso).toLocaleTimeString("es-CO", { hour: "2-digit", minute: "2-digit", hour12: true });
}

function formatearFechaCorta(iso?: string): string {
  if (!iso) return "";
  return new Date(iso).toLocaleDateString("es-CO", { day: "numeric", month: "short" });
}

function mismaFecha(a?: string, b?: string): boolean {
  if (!a || !b) return false;
  const da = new Date(a).toDateString();
  const db = new Date(b).toDateString();
  return da === db;
}

// ---------------------------------------------------------------------------
// Burbuja de mensaje individual (Refactorizada con Tailwind y estilo unificado)
// ---------------------------------------------------------------------------
function BurbujaMensaje({
  msg,
  esMio,
  mostrarFecha,
}: {
  msg: Mensaje;
  esMio: boolean;
  mostrarFecha: boolean;
}) {
  const hora = formatearHora(msg.createdAt);

  return (
    <div className={cn("flex mb-3.5", esMio ? "justify-end" : "justify-start")}>
      <div className={cn("max-w-[75%] flex flex-col", esMio ? "items-end" : "items-start")}>
        {/* Nombre del remitente (solo si no es mío) */}
        {!esMio && msg.senderName && (
          <p className="text-[11px] font-semibold mb-1 ml-1 text-accent opacity-90">
            {msg.senderName}
          </p>
        )}

        {/* Burbuja */}
        <div
          className={cn(
            "relative px-4 py-2.5 rounded-2xl text-xs leading-relaxed shadow-sm",
            esMio
              ? "bg-[#FAF4EA] text-[#2C2723] rounded-br-none border border-[#E8E2D5]" // Estilo mío: crema claro
              : "bg-white text-[#2C2723] rounded-bl-none border border-[#E8E2D5]" // Estilo planner: blanco puro
          )}
        >
          <p className="font-medium">{msg.message}</p>

          {/* Hora dentro de la burbuja */}
          <p
            className={cn(
              "text-[9px] mt-1.5 opacity-60",
              esMio ? "text-right" : "text-left"
            )}
          >
            {hora}
          </p>
        </div>

        {/* Separador de fecha */}
        {mostrarFecha && (
          <div className="flex items-center justify-center w-full my-5">
            <span className="text-[10px] font-medium px-3 py-1 rounded-full bg-[#FAF4EA] text-accent border border-[#E8E2D5]">
              {formatearFechaCorta(msg.createdAt)}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Skeleton de carga (Refactorizado con estilo unificado)
// ---------------------------------------------------------------------------
function ChatSkeleton() {
  return (
    <div className="flex-1 flex flex-col gap-4 p-4" aria-hidden="true">
      {/* Burbuja izquierda (planner) */}
      <div className="flex justify-start">
        <div className="w-2/3 space-y-2">
          <div className="h-2.5 w-20 rounded bg-[#E8E2D5] animate-pulse" />
          <div className="rounded-2xl rounded-bl-none p-4 bg-white animate-pulse border border-[#E8E2D5]">
            <div className="h-2.5 w-full rounded mb-2 bg-[#F5F2EB]" />
            <div className="h-2.5 w-3/4 rounded bg-[#F5F2EB]" />
          </div>
        </div>
      </div>
      {/* Burbuja derecha (usuario) */}
      <div className="flex justify-end">
        <div className="w-1/2 rounded-2xl rounded-br-none p-4 bg-[#FAF4EA] animate-pulse border border-[#E8E2D5]">
          <div className="h-2.5 w-full rounded mb-2 bg-[#F5F2EB]" />
          <div className="h-2.5 w-2/3 rounded bg-[#F5F2EB]" />
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Página principal (Refactorizada para integrarse como sección)
// ---------------------------------------------------------------------------
export default function ChatPage() {
  const [vista, setVista] = useState<VistaChat>("cargando");
  const [mensajes, setMensajes] = useState<Mensaje[]>([]);
  const [texto, setTexto] = useState("");
  const [enviando, setEnviando] = useState(false);
  const [errorEnvio, setErrorEnvio] = useState<string | null>(null);

  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Determinar si un mensaje es del usuario actual
  const esMensajeMio = (msg: Mensaje): boolean => {
    if (typeof window === "undefined") return false;
    const userId = localStorage.getItem("userId");
    if (!userId || !msg.senderId) return false;
    return msg.senderId === userId;
  };

  // Auto-scroll al fondo
  const scrollAlFondo = (instantaneo = false) => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({
        top: scrollRef.current.scrollHeight,
        behavior: instantaneo ? "instant" : "smooth",
      });
    }
  };

  // ---- Carga inicial ----
  useEffect(() => {
    const token = getAccessToken();
    const eventId = getSelectedEventId();
    if (!token || !eventId) { setVista("error"); return; }

    let cancelado = false;
    fetch(`${API_URL}/events/${eventId}/messages?page=1&limit=50`, {
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((json: MensajesResponse) => {
        if (!cancelado) {
          const data = json.data || [];
          setMensajes(data);
          setVista(data.length > 0 ? "listo" : "vacio");
        }
      })
      .catch(() => { if (!cancelado) setVista("error"); });

    return () => { cancelado = true; };
  }, []);

  // Polling cada 10 segundos
  useEffect(() => {
    if (vista !== "listo") return;

    const hacerPolling = async () => {
      try {
        const token = getAccessToken();
        const eventId = getSelectedEventId();
        if (!token || !eventId) return;

        const res = await fetch(`${API_URL}/events/${eventId}/messages?page=1&limit=50`, {
          headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        });

        if (!res.ok) return;

        const json: MensajesResponse = await res.json();
        const nuevos = json.data || [];

        setMensajes((prev) => {
          const idsExistentes = new Set(prev.map((m) => m.id));
          const soloNuevos = nuevos.filter((m) => !idsExistentes.has(m.id));
          if (soloNuevos.length === 0) return prev;
          return [...prev, ...soloNuevos];
        });
      } catch {
        // Silencioso
      }
    };

    const id = setInterval(hacerPolling, POLLING_INTERVAL);
    return () => clearInterval(id);
  }, [vista]);

  // Scroll al fondo cuando cambian los mensajes
  useEffect(() => {
    if (scrollRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = scrollRef.current;
      const distanciaAlFondo = scrollHeight - scrollTop - clientHeight;
      if (distanciaAlFondo < 150 || vista === "cargando") {
        scrollAlFondo(vista === "cargando");
      }
    }
  }, [mensajes, vista]);

  // ---- Enviar mensaje ----
  const handleEnviar = async () => {
    const mensajeTexto = texto.trim();
    if (!mensajeTexto || enviando) return;

    setEnviando(true);
    setErrorEnvio(null);

    try {
      const token = getAccessToken();
      const eventId = getSelectedEventId();

      if (!token || !eventId) {
        throw new Error("No hay sesión activa o evento seleccionado.");
      }

      const res = await fetch(`${API_URL}/events/${eventId}/messages`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ message: mensajeTexto }),
      });

      if (!res.ok) {
        throw new Error(res.status === 401 ? "Sesión expirada" : `Error del servidor (${res.status})`);
      }

      const refreshRes = await fetch(`${API_URL}/events/${eventId}/messages?page=1&limit=50`, {
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      });

      if (refreshRes.ok) {
        const json: MensajesResponse = await refreshRes.json();
        setMensajes(json.data || []);
        setVista((json.data || []).length > 0 ? "listo" : "vacio");
      }

      setTexto("");
      inputRef.current?.focus();
    } catch (err: any) {
      setErrorEnvio(err.message || "Error al enviar el mensaje.");
    } finally {
      setEnviando(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleEnviar();
    }
  };

  // ===================================================================
  // RENDER (Refactorizado para integrarse como sección)
  // ===================================================================
  return (
    <div className="rounded-2xl border border-[#E8E2D5] bg-white shadow-xs overflow-hidden flex flex-col h-[600px]">
      {/* ---------- CABECERA DEL CHAT ---------- */}
      <header className="shrink-0 px-5 py-3.5 border-b border-[#F0EBE1] bg-[#FAF8F5]">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full flex items-center justify-center bg-[#FAF4EA] text-accent border border-[#E8E2D5]">
            <MessageCircle size={18} />
          </div>
          <div>
            <h2 className="text-sm font-bold tracking-tight text-[#1F1C19]">
              Chat Privado con Concierge
            </h2>
            <p className="text-[11px] text-[#7A7167]">
              Comunicación directa con tu Wedding Planner. Polling activo.
            </p>
          </div>
        </div>
      </header>

      {/* ---------- ÁREA DE MENSAJES ---------- */}
      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto px-5 py-6 bg-white"
        style={{ scrollBehavior: "smooth" }}
      >
        {vista === "cargando" && <ChatSkeleton />}

        {vista === "error" && (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-4 bg-red-50 border border-red-100">
              <AlertTriangle size={24} className="text-red-500" />
            </div>
            <h3 className="text-sm font-semibold mb-1 text-[#1F1C19]">
              No pudimos cargar la conversación
            </h3>
            <p className="text-xs mb-5 max-w-xs text-[#7A7167]">
              Revisa tu conexión e inténtalo de nuevo.
            </p>
            <button
              onClick={() => { setVista("cargando"); window.location.reload(); }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold bg-accent text-white transition-all hover:bg-accent/90"
            >
              <RefreshCw size={14} /> Reintentar
            </button>
          </div>
        )}

        {vista === "vacio" && (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="w-16 h-16 rounded-3xl flex items-center justify-center mb-5 bg-[#FAF4EA] border border-[#E8E2D5]">
              <MessageCircle size={28} className="text-accent" />
            </div>
            <h3 className="text-sm font-semibold mb-1 text-[#1F1C19]">
              Sin mensajes aún
            </h3>
            <p className="text-xs max-w-xs text-[#7A7167]">
              Escribe tu primer mensaje para conectar con tu Wedding Planner.
            </p>
          </div>
        )}

        {vista === "listo" && mensajes.length > 0 && (
          <div className="pb-2">
            {mensajes.map((msg, i) => {
              const anterior = i > 0 ? mensajes[i - 1] : null;
              const mostrarFecha =
                !anterior || !mismaFecha(msg.createdAt, anterior.createdAt);

              return (
                <BurbujaMensaje
                  key={msg.id}
                  msg={msg}
                  esMio={esMensajeMio(msg)}
                  mostrarFecha={mostrarFecha}
                />
              );
            })}
          </div>
        )}
      </div>

      {/* ---------- BARRA DE ENVÍO (Adaptada al estilo responsivo unificado) ---------- */}
      <div className="shrink-0 px-4 py-3 border-t border-[#F0EBE1] bg-[#FAF8F5]">
        {/* Error de envío */}
        {errorEnvio && (
          <div className="flex items-center gap-2 mb-2 px-1">
            <AlertTriangle size={12} className="text-red-500" />
            <p className="text-[10px] text-red-600">{errorEnvio}</p>
            <button
              onClick={() => setErrorEnvio(null)}
              className="text-[10px] font-medium text-accent underline ml-auto"
            >
              Ocultar
            </button>
          </div>
        )}

        <div className="flex items-center gap-3">
          <input
            ref={inputRef}
            type="text"
            value={texto}
            onChange={(e) => setTexto(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Escribe tu mensaje…"
            aria-label="Escribe tu mensaje"
            disabled={enviando}
            className="flex-1 px-4 py-2.5 rounded-full text-xs border border-[#D9D1C5] bg-white text-[#2C2723] placeholder-[#A89F95] focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent disabled:opacity-50 transition-all"
          />

          <button
            onClick={handleEnviar}
            disabled={!texto.trim() || enviando}
            aria-label="Enviar mensaje"
            className="shrink-0 inline-flex items-center justify-center w-10 h-10 rounded-full bg-accent text-white transition-all hover:bg-accent/90 active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed shadow-sm"
          >
            {enviando ? (
              <Loader2 size={16} className="animate-spin" />
            ) : (
              <Send size={16} />
            )}
          </button>
        </div>
      </div>
    </div>
  );
}