"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { apiFetch } from "@/utils/apiFetch";
import { Calendar, ChevronRight, Sparkles, AlertTriangle, LogOut } from "lucide-react";

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

      </div>
    </div>
  );
}