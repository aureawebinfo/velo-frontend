"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { apiFetch } from "@/utils/apiFetch";
import { Calendar, ChevronRight, Sparkles, AlertTriangle, LogOut, Plus, X } from "lucide-react";

// Tipo basado en el esquema de la base de datos (Plan M1)
interface EventData {
  id: string;
  name: string;
  status: "PLANNING" | "ACTIVE" | "FINISHED";
  createdAt: string;
  weddingDate?: string;
}

const statusLabel: Record<string, string> = {
  PLANNING: "En Planeación",
  ACTIVE: "Activo",
  FINISHED: "Finalizado",
};

const statusColors: Record<string, string> = {
  PLANNING: "bg-amber-50 text-amber-700 border-amber-200",
  ACTIVE: "bg-emerald-50 text-emerald-700 border-emerald-200",
  FINISHED: "bg-stone-50 text-stone-600 border-stone-200",
};

export default function SelectEventPage() {
  const router = useRouter();
  const [events, setEvents] = useState<EventData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // código nuevo edición — Estados para el modal de crear evento.
  // controla si el modal está abierto, los campos del formulario, el estado de carga y errores.
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [formName, setFormName] = useState("");
  const [formDate, setFormDate] = useState("");
  const [formLocation, setFormLocation] = useState("");
  const [formDescription, setFormDescription] = useState("");
  const [formLoading, setFormLoading] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const res = await apiFetch("/events");
        
        if (!res.ok) {
          throw new Error("No se pudieron cargar los eventos.");
        }

        const data: EventData[] = await res.json();
        setEvents(data);

        // Si solo hay 1 evento asignado, auto-seleccionar y saltar al dashboard
        if (data.length === 1) {
          localStorage.setItem("selectedEventId", data[0].id);
          router.push("/dashboard");
        }
      } catch (err: any) {
        setError(err.message || "Ocurrió un error inesperado.");
      } finally {
        // Solo quitamos el loading si hay 0 o >1 eventos. Si hay 1, se queda en loading mientras redirige.
        setLoading(false);
      }
    };

    fetchEvents();
  }, [router]);

  const handleSelectEvent = (id: string) => {
    localStorage.setItem("selectedEventId", id);
    router.push("/dashboard");
  };

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("selectedEventId");
    router.push("/login");
  };

  // código nuevo edición — Función para recargar la lista de eventos desde la API.
  // Se usa después de crear un evento para mostrar el nuevo en la lista sin recargar la página.
  const reloadEvents = async () => {
    try {
      const res = await apiFetch("/events");
      if (res.ok) {
        const data: EventData[] = await res.json();
        setEvents(data);
      }
    } catch {
      // Silencioso: si falla, la lista se queda como está
    }
  };

  // código nuevo edición — Función para manejar el envío del formulario de crear evento.
  // Solo envía el nombre al backend (POST /events). Los otros campos se guardan localmente
  // pero no se envían porque el backend aún no los soporta. Cuando el backend soporte más campos,
  // solo hay que agregarlos al objeto que se envía en el body.
  const handleCreateEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (!formName.trim()) {
      setFormError("El nombre del evento es obligatorio.");
      return;
    }

    setFormLoading(true);
    try {
      const res = await apiFetch("/events", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: formName.trim() }),
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => null);
        throw new Error(errData?.message || "No se pudo crear el evento.");
      }

      // Limpiar formulario y cerrar modal
      setFormName("");
      setFormDate("");
      setFormLocation("");
      setFormDescription("");
      setShowCreateModal(false);

      // Recargar la lista para mostrar el evento recién creado
      await reloadEvents();
    } catch (err: any) {
      setFormError(err.message || "Error al crear el evento.");
    } finally {
      setFormLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F5F2EB]">
        <div className="flex flex-col items-center gap-4 animate-fade-up">
          <div className="w-10 h-10 border-2 border-[#D9D1C5] border-t-[#C9A96A] rounded-full animate-spin" />
          <p className="text-[#7A7167] text-xs font-semibold tracking-widest uppercase">Cargando tu portal...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#F5F2EB] relative overflow-hidden px-4">
      {/* Botón de Logout arriba a la derecha por si entra a una cuenta equivocada */}
      <button 
        onClick={handleLogout}
        className="absolute top-6 right-6 lg:top-10 lg:right-10 flex items-center gap-2 text-xs font-semibold text-[#7A7167] hover:text-[#2C2723] transition-colors"
      >
        <LogOut className="w-4 h-4" /> Cerrar sesión
      </button>

      <div className="relative z-10 w-full max-w-lg animate-fade-up">
        
        {/* Cabecera */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-white border border-[#E8E2D5] shadow-sm mb-5">
            <Sparkles className="w-7 h-7 text-[#C9A96A]" />
          </div>
          <h1 className="text-3xl font-semibold text-[#1F1C19] tracking-tight md:text-4xl" style={{ fontFamily: "var(--font-title-serif, 'Playfair Display', serif)" }}>
            Bienvenido a Áurea
          </h1>
          <p className="text-[#7A7167] text-sm mt-3">Selecciona el evento que deseas administrar en esta sesión.</p>
        </div>

        {/* Manejo de Errores */}
        {error && (
          <div className="mb-6 flex items-center gap-3 rounded-2xl border border-red-100 bg-red-50 p-4 text-sm text-red-700 shadow-xs">
            <AlertTriangle className="h-5 w-5 shrink-0" />
            <p>{error}</p>
          </div>
        )}

        {/* Lista de Eventos */}
        {!error && events.length === 0 ? (
          <div className="bg-white rounded-3xl p-10 border border-[#E8E2D5] shadow-xs text-center">
            <div className="w-16 h-16 bg-[#FAF4EA] rounded-full flex items-center justify-center mx-auto mb-4 border border-[#E8E2D5]">
              <Calendar className="w-7 h-7 text-[#C9A96A]" />
            </div>
            <p className="text-[#1F1C19] font-semibold mb-1">No tienes eventos asignados</p>
            <p className="text-[#7A7167] text-xs">Tu cuenta aún no ha sido vinculada a ninguna planificación. Contacta con tu Wedding Planner.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {events.map((ev) => (
              <button
                key={ev.id}
                onClick={() => handleSelectEvent(ev.id)}
                className="w-full flex items-center justify-between bg-white hover:bg-[#FAF8F5] border border-[#E8E2D5] hover:border-[#D9D1C5] rounded-2xl p-4 transition-all duration-300 group text-left shadow-sm hover:shadow-md hover:-translate-y-0.5"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-[#FAF4EA] border border-[#E8E2D5] flex items-center justify-center shrink-0 transition-colors group-hover:bg-white">
                    <Calendar className="w-5 h-5 text-accent" />
                  </div>
                  <div className="min-w-0 pr-2">
                    <p className="text-[#1F1C19] font-semibold text-sm truncate">{ev.name}</p>
                    <div className="flex items-center gap-2 mt-1.5">
                      <span className={`inline-block px-2 py-0.5 rounded-md text-[9px] font-bold uppercase tracking-wider border ${statusColors[ev.status] || statusColors.PLANNING}`}>
                        {statusLabel[ev.status] || ev.status}
                      </span>
                      {ev.weddingDate && (
                        <span className="text-[10px] text-[#7A7167]">
                          {new Date(ev.weddingDate).toLocaleDateString("es-CO", { day: 'numeric', month: 'short', year: 'numeric' })}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                <div className="shrink-0 w-8 h-8 rounded-full flex items-center justify-center bg-transparent group-hover:bg-white border border-transparent group-hover:border-[#E8E2D5] transition-all">
                  <ChevronRight className="w-4 h-4 text-[#B3ABA0] group-hover:text-accent" />
                </div>
              </button>
            ))}
          </div>
        )}

        {/* código nuevo edición — Botón para abrir el modal de crear evento.
        Aparece debajo de la lista de eventos o del estado vacío.
        Usa estilo borde punteado dorado para diferenciarse de las tarjetas de eventos existentes. */}
        <button
          onClick={() => setShowCreateModal(true)}
          className="mt-6 w-full flex items-center justify-center gap-3 rounded-2xl border-2 border-dashed border-[#C9A96A]/40 bg-white/60 p-4 text-[#A07D38] transition-all duration-300 hover:border-[#C9A96A] hover:bg-[#FAF4EA] hover:shadow-sm"
        >
          <Plus className="w-5 h-5" />
          <span className="text-sm font-semibold">Crear nuevo evento</span>
        </button>

      </div>

      {/* código nuevo edición — Modal para crear evento.
      Se muestra cuando showCreateModal es true.
      Overlay oscuro con backdrop-blur, card blanca con formulario.
      Solo el nombre es requerido. Los otros campos son opcionales y se envían cuando el backend los soporte. */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Overlay oscuro */}
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-xs"
            onClick={() => !formLoading && setShowCreateModal(false)}
          />

          {/* Card del modal */}
          <div className="relative z-10 w-full max-w-md rounded-3xl border border-[#E8E2D5] bg-white p-6 shadow-2xl animate-fade-up sm:p-8">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-lg font-semibold text-[#1F1C19]" style={{ fontFamily: "var(--font-title-serif, 'Playfair Display', serif)" }}>
                  Crear nuevo evento
                </h2>
                <p className="text-xs text-[#7A7167] mt-1">Completa los datos para comenzar.</p>
              </div>
              <button
                onClick={() => !formLoading && setShowCreateModal(false)}
                className="rounded-full p-2 text-[#7A7167] hover:bg-[#F5F2EB] hover:text-[#1F1C19] transition-colors"
                disabled={formLoading}
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Formulario */}
            <form onSubmit={handleCreateEvent} className="space-y-4">
              {/* Nombre (requerido) */}
              <div>
                <label className="block text-[11px] font-semibold uppercase tracking-wider text-[#7A7167] mb-1.5">
                  Nombre del evento *
                </label>
                <input
                  type="text"
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  placeholder="Ej: Boda María y José"
                  required
                  className="w-full rounded-lg border border-[#D9D1C5] bg-white px-3.5 py-2.5 text-sm text-[#2C2723] placeholder-[#A89F95] transition-all focus:border-[#C9A96A] focus:outline-none focus:ring-2 focus:ring-[#C9A96A]/20"
                />
              </div>

              {/* Fecha del evento (opcional) */}
              <div>
                <label className="block text-[11px] font-semibold uppercase tracking-wider text-[#7A7167] mb-1.5">
                  Fecha del evento
                </label>
                <input
                  type="date"
                  value={formDate}
                  onChange={(e) => setFormDate(e.target.value)}
                  className="w-full rounded-lg border border-[#D9D1C5] bg-white px-3.5 py-2.5 text-sm text-[#2C2723] transition-all focus:border-[#C9A96A] focus:outline-none focus:ring-2 focus:ring-[#C9A96A]/20"
                />
              </div>

              {/* Locación (opcional) */}
              <div>
                <label className="block text-[11px] font-semibold uppercase tracking-wider text-[#7A7167] mb-1.5">
                  Locación
                </label>
                <input
                  type="text"
                  value={formLocation}
                  onChange={(e) => setFormLocation(e.target.value)}
                  placeholder="Ej: Hacienda El Rosal"
                  className="w-full rounded-lg border border-[#D9D1C5] bg-white px-3.5 py-2.5 text-sm text-[#2C2723] placeholder-[#A89F95] transition-all focus:border-[#C9A96A] focus:outline-none focus:ring-2 focus:ring-[#C9A96A]/20"
                />
              </div>

              {/* Descripción (opcional) */}
              <div>
                <label className="block text-[11px] font-semibold uppercase tracking-wider text-[#7A7167] mb-1.5">
                  Descripción
                </label>
                <textarea
                  value={formDescription}
                  onChange={(e) => setFormDescription(e.target.value)}
                  placeholder="Detalles adicionales del evento..."
                  rows={3}
                  className="w-full rounded-lg border border-[#D9D1C5] bg-white px-3.5 py-2.5 text-sm text-[#2C2723] placeholder-[#A89F95] transition-all focus:border-[#C9A96A] focus:outline-none focus:ring-2 focus:ring-[#C9A96A]/20 resize-none"
                />
              </div>

              {/* Error */}
              {formError && (
                <p className="text-xs text-red-600 bg-red-50 border border-red-100 rounded-lg px-3 py-2">{formError}</p>
              )}

              {/* Botón submit */}
              <button
                type="submit"
                disabled={formLoading}
                className="w-full rounded-lg bg-[#C9A96A] px-6 py-3 text-sm font-semibold text-white transition-all hover:bg-[#B8963D] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {formLoading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Creando...
                  </>
                ) : (
                  <>
                    <Plus className="w-4 h-4" />
                    Crear evento
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}