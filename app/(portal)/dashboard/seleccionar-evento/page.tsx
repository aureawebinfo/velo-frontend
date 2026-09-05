"use client";

// código nuevo edición — Widget de selección de eventos para el dashboard.
// Muestra la lista de eventos del usuario dentro del layout del dashboard (con sidebar visible).
// Al hacer clic en un evento, lo selecciona usando EventContext (selectEvent) en vez de navegar.
// Incluye botón para crear evento nuevo con modal.

import { useEffect, useState } from "react";
import { useEvent } from "@/contexts/EventContext";
import { apiFetch } from "@/utils/apiFetch";
import { Calendar, ChevronRight, AlertTriangle, Plus, X, CheckCircle2 } from "lucide-react";

interface EventData {
  id: string;
  name: string;
  status: "PLANNING" | "ACTIVE" | "FINISHED";
  createdAt: string;
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

export default function SeleccionarEventoWidget() {
  const { selectEvent, event: currentEvent } = useEvent();
  const [events, setEvents] = useState<EventData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Estados del modal de crear evento
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [formName, setFormName] = useState("");
  const [formDate, setFormDate] = useState("");
  const [formLocation, setFormLocation] = useState("");
  const [formDescription, setFormDescription] = useState("");
  const [formLoading, setFormLoading] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [formSuccess, setFormSuccess] = useState(false);

  const fetchEvents = async () => {
    try {
      const res = await apiFetch("/events");
      if (!res.ok) throw new Error("No se pudieron cargar los eventos.");
      const data: EventData[] = await res.json();
      setEvents(data);
    } catch (err: any) {
      setError(err.message || "Ocurrió un error inesperado.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  // código nuevo edición — Al hacer clic en un evento, lo selecciona en el contexto global.
  // Esto guarda el ID en localStorage y actualiza el EventContext, sin navegar a otra página.
  // El sidebar y todo el dashboard permanecen visibles.
  const handleSelectEvent = (id: string) => {
    selectEvent(id);
  };

  const handleCreateEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    setFormSuccess(false);

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

      setFormName("");
      setFormDate("");
      setFormLocation("");
      setFormDescription("");
      setShowCreateModal(false);
      setFormSuccess(true);
      setTimeout(() => setFormSuccess(false), 4000);

      await fetchEvents();
    } catch (err: any) {
      setFormError(err.message || "Error al crear el evento.");
    } finally {
      setFormLoading(false);
    }
  };

  return (
    <div className="rounded-2xl border border-[#E8E2D5] bg-white shadow-xs overflow-hidden flex flex-col h-[700px]">
      {/* Header */}
      <header className="shrink-0 px-5 py-4 border-b border-[#F0EBE1] bg-[#FAF8F5]">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-[#FAF4EA] text-[#A07D38] border border-[#E8E2D5] flex items-center justify-center">
              <Calendar size={18} />
            </div>
            <div>
              <h2 className="text-sm font-bold tracking-tight text-[#1F1C19]">Seleccionar Evento</h2>
              <p className="text-[11px] text-[#7A7167]">Cambia el evento activo de tu sesión.</p>
            </div>
          </div>
          <button
            onClick={() => setShowCreateModal(true)}
            className="flex items-center gap-1.5 rounded-lg bg-[#C9A96A] px-3 py-1.5 text-[11px] font-semibold text-white transition-all hover:bg-[#B8963D]"
          >
            <Plus className="w-3.5 h-3.5" />
            Nuevo
          </button>
        </div>
      </header>

      {/* Contenido */}
      <main className="flex-1 overflow-y-auto bg-white p-5 lg:p-6">
        {/* Mensaje de éxito al crear */}
        {formSuccess && (
          <div className="mb-4 flex items-center gap-3 rounded-xl border border-emerald-100 bg-emerald-50 p-3 text-xs text-emerald-700">
            <CheckCircle2 className="h-4 w-4 shrink-0" />
            Evento creado correctamente.
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="mb-4 flex items-center gap-3 rounded-xl border border-red-100 bg-red-50 p-3 text-xs text-red-700">
            <AlertTriangle className="h-4 w-4 shrink-0" />
            {error}
          </div>
        )}

        {/* Loading */}
        {loading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-20 animate-pulse rounded-2xl bg-[#F5F2EB]" />
            ))}
          </div>
        ) : events.length === 0 ? (
          /* Estado vacío */
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="w-14 h-14 bg-[#FAF4EA] rounded-full flex items-center justify-center mb-3 border border-[#E8E2D5]">
              <Calendar className="w-6 h-6 text-[#C9A96A]" />
            </div>
            <p className="text-sm font-semibold text-[#1F1C19] mb-1">No tienes eventos</p>
            <p className="text-xs text-[#7A7167]">Crea tu primer evento para comenzar.</p>
          </div>
        ) : (
          /* Lista de eventos */
          <div className="space-y-2">
            {events.map((ev) => {
              const isSelected = ev.id === currentEvent?.id;
              return (
                <button
                  key={ev.id}
                  onClick={() => handleSelectEvent(ev.id)}
                  className={`w-full flex items-center justify-between rounded-2xl p-3.5 text-left transition-all duration-200 ${
                    isSelected
                      ? "border-2 border-[#C9A96A] bg-[#FAF4EA] shadow-sm"
                      : "border border-[#E8E2D5] bg-white hover:bg-[#FAF8F5] hover:border-[#D9D1C5] hover:shadow-xs"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                      isSelected ? "bg-[#C9A96A] text-white" : "bg-[#FAF4EA] text-[#A07D38] border border-[#E8E2D5]"
                    }`}>
                      <Calendar className="w-4 h-4" />
                    </div>
                    <div className="min-w-0">
                      <p className={`text-sm font-semibold truncate ${isSelected ? "text-[#A07D38]" : "text-[#1F1C19]"}`}>
                        {ev.name}
                      </p>
                      <span className={`inline-block mt-1 px-2 py-0.5 rounded-md text-[9px] font-bold uppercase tracking-wider border ${statusColors[ev.status] || statusColors.PLANNING}`}>
                        {statusLabel[ev.status] || ev.status}
                      </span>
                    </div>
                  </div>
                  <div className="shrink-0">
                    {isSelected ? (
                      <span className="text-[10px] font-semibold text-[#A07D38] bg-[#C9A96A]/10 px-2 py-1 rounded-full">Activo</span>
                    ) : (
                      <ChevronRight className="w-4 h-4 text-[#B3ABA0]" />
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        )}
      </main>

      {/* Modal de crear evento */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-xs"
            onClick={() => !formLoading && setShowCreateModal(false)}
          />
          <div className="relative z-10 w-full max-w-md rounded-3xl border border-[#E8E2D5] bg-white p-6 shadow-2xl sm:p-8">
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

            <form onSubmit={handleCreateEvent} className="space-y-4">
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

              {formError && (
                <p className="text-xs text-red-600 bg-red-50 border border-red-100 rounded-lg px-3 py-2">{formError}</p>
              )}

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
