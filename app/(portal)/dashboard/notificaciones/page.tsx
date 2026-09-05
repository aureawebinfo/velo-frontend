"use client";

// ---------------------------------------------------------------------------
// M6 — Alertas y Notificaciones (Integrado en Dashboard Unificado)
// ---------------------------------------------------------------------------

import { useEffect, useState } from "react";
import {
  Bell,
  Loader2,
  AlertTriangle,
  RefreshCw,
  CheckCircle2,
  Clock,
  DollarSign,
  ClipboardList,
  FileText,
} from "lucide-react";
import { cn } from "@/lib/cn";
import { apiFetch } from "@/utils/apiFetch";

// ---------------------------------------------------------------------------
// Tipos e Interfaces (Se mantienen igual)
// ---------------------------------------------------------------------------
type TipoNotificacion = "PAYMENT_DUE" | "TASK_DUE" | "DOCUMENT_UPLOADED";

interface Notificacion {
  id: string;
  type: TipoNotificacion | string;
  message: string;
  read: boolean;
  createdAt: string;
}

type VistaEstado = "cargando" | "vacio" | "error" | "listo";

// ---------------------------------------------------------------------------
// Configuración y Helpers (Adaptados al diseño unificado)
// ---------------------------------------------------------------------------

// Icono + color satinado sutil según tipo de notificación
function datosPorTipo(type: string) {
  switch (type) {
    case "PAYMENT_DUE":
      return {
        icon: <DollarSign size={17} />,
        bg: "bg-[#FAF4EA]", // Crema Satinado
        fg: "text-accent", // Dorado
        label: "Pago",
      };
    case "TASK_DUE":
      return {
        icon: <ClipboardList size={17} />,
        bg: "bg-red-50", // Rojo sutil urgencia
        fg: "text-red-700",
        label: "Tarea",
      };
    case "DOCUMENT_UPLOADED":
      return {
        icon: <FileText size={17} />,
        bg: "bg-stone-50", // Gris mineral sutil
        fg: "text-stone-700",
        label: "Documento",
      };
    default:
      return {
        icon: <Bell size={17} />,
        bg: "bg-[#F5F2EB]",
        fg: "text-[#5C5349]",
        label: "Aviso",
      };
  }
}

// Helpers de formato de fecha relativa (Se mantiene igual)
function formatearFechaRelativa(iso?: string): string {
  if (!iso) return "";
  const ahora = Date.now();
  const fecha = new Date(iso).getTime();
  const diffMs = ahora - fecha;
  const diffMin = Math.floor(diffMs / 60000);
  const diffHoras = Math.floor(diffMs / 3600000);
  const diffDias = Math.floor(diffMs / 86400000);

  if (diffMin < 1) return "Ahora";
  if (diffMin < 60) return `Hace ${diffMin} min`;
  if (diffHoras < 24) return `Hace ${diffHoras} h`;
  if (diffDias < 7) return `Hace ${diffDias} días`;
  return new Date(iso).toLocaleDateString("es-CO", {
    day: "numeric",
    month: "short",
  });
}

// ---------------------------------------------------------------------------
// Skeleton de carga (Refactorizado con estilo unificado claro)
// ---------------------------------------------------------------------------
function NotificacionesSkeleton() {
  return (
    <div className="space-y-3" aria-hidden="true">
      {Array.from({ length: 5 }).map((_, i) => (
        <div
          key={i}
          className="rounded-2xl p-5 bg-white border border-[#E8E2D5] animate-pulse"
        >
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-xl shrink-0 bg-[#F5F2EB]" />
            <div className="flex-1 space-y-2.5">
              <div className="h-2.5 w-20 rounded bg-[#F5F2EB]" />
              <div className="h-3 w-full rounded bg-[#E8E2D5]" />
              <div className="h-2.5 w-24 rounded bg-[#F5F2EB]" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Componente Principal: Centro de Notificaciones Unificado
// ---------------------------------------------------------------------------
export default function NotificacionesPageUnificada() {
  const [vista, setVista] = useState<VistaEstado>("cargando");
  const [notificaciones, setNotificaciones] = useState<Notificacion[]>([]);
  const [marcandoIds, setMarcandoIds] = useState<Set<string>>(new Set());
  const [saliendoIds, setSaliendoIds] = useState<Set<string>>(new Set());

  // Contador de no leídas
  const noLeidas = notificaciones.filter((n) => !n.read).length;

  // ---- Disparar evento global para el navbar ----
  useEffect(() => {
    if (typeof window !== "undefined") {
      window.dispatchEvent(
        new CustomEvent("notificaciones:actualizar", {
          detail: { noLeidas },
        })
      );
    }
  }, [noLeidas]);

  // ---- Carga inicial ----
  const cargarNotificaciones = async () => {
    setVista("cargando");
    try {
      const res = await apiFetch("/notifications");

      if (!res.ok) {
        throw new Error(res.status === 401 ? "Sesión expirada" : `Error (${res.status})`);
      }

      const data = await res.json();
      const rawNotifs = Array.isArray(data) ? data : [];

      // Ordenar: no leídas primero, luego por fecha más reciente
      const ordenadas = rawNotifs.sort((a, b) => {
        if (a.read !== b.read) return a.read ? 1 : -1;
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      });

      setNotificaciones(ordenadas);
      setVista(ordenadas.length > 0 ? "listo" : "vacio");
    } catch {
      setVista("error");
    }
  };

  useEffect(() => {
    cargarNotificaciones();
  }, []);

  // ---- Marcar como leída con animación (Adaptada a diseño claro) ----
  const marcarComoLeida = async (notif: Notificacion) => {
    if (marcandoIds.has(notif.id) || saliendoIds.has(notif.id)) return;

    setMarcandoIds((prev) => new Set(prev).add(notif.id));

    try {
      const res = await apiFetch(`/notifications/${notif.id}/read`, {
        method: "PATCH",
      });

      if (!res.ok) {
        throw new Error(`Error (${res.status})`);
      }

      // Iniciar animación de salida (slide-out sutil)
      setSaliendoIds((prev) => new Set(prev).add(notif.id));

      // Después de la animación (400ms), marcar como leída en el estado
      setTimeout(() => {
        setNotificaciones((prev) =>
          prev.map((n) => (n.id === notif.id ? { ...n, read: true } : n))
        );
        setSaliendoIds((prev) => {
          const next = new Set(prev);
          next.delete(notif.id);
          return next;
        });
      }, 400);
    } catch {
      // Silencioso en fallo
    } finally {
      setMarcandoIds((prev) => {
        const next = new Set(prev);
        next.delete(notif.id);
        return next;
      });
    }
  };

  // ===================================================================
  // RENDER (Refactorizado para integrarse como sección)
  // ===================================================================
  return (
    <div className="rounded-2xl border border-[#E8E2D5] bg-white shadow-xs overflow-hidden flex flex-col h-[650px]">
      
      {/* ---------- CABECERA DEL WIDGET (Estilo Unificado Claro) ---------- */}
      <header className="shrink-0 px-5 py-3.5 border-b border-[#F0EBE1] bg-[#FAF8F5] flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="relative w-9 h-9 rounded-full flex items-center justify-center bg-[#FAF4EA] text-accent border border-[#E8E2D5]">
            <Bell size={18} />
            {/* Badge contador sobre el icono */}
            {noLeidas > 0 && (
              <span className="absolute -top-1 -right-1 flex h-4 min-w-[16px] items-center justify-center rounded-full bg-red-600 px-1 text-[9px] font-bold text-white shadow-sm">
                {noLeidas > 99 ? "99+" : noLeidas}
              </span>
            )}
          </div>
          <div>
            <h2 className="text-sm font-bold tracking-tight text-[#1F1C19]">Centro de Alertas</h2>
            <p className="text-[11px] text-[#7A7167]">Notificaciones sobre pagos, tareas y documentos.</p>
          </div>
        </div>

        <button
          onClick={cargarNotificaciones}
          disabled={vista === "cargando"}
          className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold tracking-wide
                     transition-all hover:bg-[#EBE5DB] active:scale-95
                     disabled:opacity-50 disabled:cursor-not-allowed bg-white border border-[#D9D1C5] text-[#2C2723]"
        >
          <RefreshCw size={14} className={vista === "cargando" ? "animate-spin" : ""} />
          Actualizar
        </button>
      </header>

      {/* ---------- CONTENIDO (Scroll Interno Claro) ---------- */}
      <main className="flex-1 overflow-y-auto px-5 py-6 bg-white">
        {vista === "cargando" && <NotificacionesSkeleton />}

        {vista === "error" && (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-4 bg-red-50 border border-red-100">
              <AlertTriangle size={24} className="text-red-500" />
            </div>
            <h3 className="text-sm font-semibold mb-1 text-[#1F1C19]">No pudimos cargar las alertas</h3>
            <p className="text-xs mb-5 max-w-xs text-[#7A7167]">Revisa tu conexión e inténtalo de nuevo.</p>
            <button
              onClick={cargarNotificaciones}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold bg-accent text-white transition-all hover:bg-accent/90"
            >
              <RefreshCw size={14} /> Reintentar
            </button>
          </div>
        )}

        {vista === "vacio" && (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="w-16 h-16 rounded-3xl flex items-center justify-center mb-5 bg-[#FAF4EA] border border-[#E8E2D5]">
              <CheckCircle2 size={28} className="text-accent" />
            </div>
            <h3 className="text-sm font-semibold mb-1 text-[#1F1C19]">Todo al día</h3>
            <p className="text-xs max-w-xs text-[#7A7167]">No tienes notificaciones pendientes.</p>
          </div>
        )}

        {vista === "listo" && notificaciones.length > 0 && (
          <div className="space-y-3 pb-2 relative">
            {notificaciones.map((notif) => {
              const { icon, bg, fg, label } = datosPorTipo(notif.type);
              const estaSaliendo = saliendoIds.has(notif.id);
              const estaMarcando = marcandoIds.has(notif.id);

              return (
                <div
                  key={notif.id}
                  className={cn(
                    "group rounded-2xl p-5 border transition-all duration-300 relative",
                    // Animación slide-out claro
                    estaSaliendo 
                      ? "opacity-0 -translate-x-3 max-h-0 overflow-hidden p-0 my-0 border-0" 
                      : "opacity-100 translate-x-0",
                    // Estilo Unread vs Read
                    notif.read 
                      ? "bg-white border-[#F0EBE1]" // Leída: blanco puro
                      : "bg-[#FAF8F5] border-[#E8E2D5] shadow-sm" // No leída: mineral sutil
                  )}
                >
                  <div className="flex items-start gap-4">
                    {/* Icono del tipo Satinado */}
                    <div
                      className={cn("w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border", bg, fg, notif.read ? "border-[#F0EBE1]" : "border-[#E8E2D5]/50")}
                    >
                      {icon}
                    </div>

                    {/* Contenido Texto Unificado */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1.5">
                        <span
                          className={cn("text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md", bg, fg)}
                        >
                          {label}
                        </span>
                        {!notif.read && (
                          <span
                            className="w-1.5 h-1.5 rounded-full shrink-0 bg-red-600 animate-pulse"
                            title="No leída"
                          />
                        )}
                      </div>

                      <p
                        className={cn("text-xs leading-relaxed font-medium", notif.read ? "text-[#7A7167]" : "text-[#1F1C19]")}
                      >
                        {notif.message}
                      </p>

                      <div className="flex items-center gap-3 mt-2.5 pt-2.5 border-t border-[#F0EBE1]/70">
                        <span className="text-[11px] inline-flex items-center gap-1.5 text-[#B3ABA0]">
                          <Clock size={11} />
                          {formatearFechaRelativa(notif.createdAt)}
                        </span>

                        {notif.read && (
                          <span className="text-[11px] inline-flex items-center gap-1.5 text-accent opacity-80 font-medium">
                            <CheckCircle2 size={11} />
                            Leída
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Botón marcar como leída (Estilo Satinado Satinado Satinado) */}
                    {!notif.read && (
                      <button
                        onClick={() => marcarComoLeida(notif)}
                        disabled={estaMarcando}
                        aria-label="Marcar como leída"
                        className="shrink-0 p-2 rounded-lg transition-all
                                   bg-[#FAF4EA] text-accent border border-accent/20
                                   hover:bg-[#F2E8D9] disabled:opacity-50 disabled:cursor-not-allowed
                                   group-hover:border-accent/40 shadow-sm"
                      >
                        {estaMarcando ? (
                          <Loader2 size={15} className="animate-spin" />
                        ) : (
                          <CheckCircle2 size={15} />
                        )}
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}