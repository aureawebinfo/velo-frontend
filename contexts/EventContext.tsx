import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from "react";
// código nuevo edición — apiFetch es la función que ya existe en el proyecto para hacer peticiones HTTP.
// La necesitamos aquí porque EventProvider debe cargar la lista de eventos del usuario al iniciar.
// Sin este import, el contexto no tendría forma de hablar con el backend.
import { apiFetch } from "@/utils/apiFetch";

type Event = {
  id: string;
  name: string;
  status: string;
  [key: string]: unknown;
};

type EventContextShape = {
  event: Event | null;
  events: Event[];
  loading: boolean;
  selectEvent: (id: string) => void;
};

const defaultValue: EventContextShape = {
  event: null,
  events: [],
  loading: false,
  selectEvent: () => {},
};

const EventContext = createContext<EventContextShape>(defaultValue);

export function EventProvider({ children }: { children: ReactNode }) {
  const [events, setEvents] = useState<Event[]>([]);
  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);

  // código nuevo edición — Este useEffect se ejecuta una sola vez cuando el usuario entra al dashboard.
  // Hace lo siguiente paso a paso:
  // 1. Llama a GET /events para obtener todos los eventos donde el usuario es miembro.
  // 2. Si la respuesta es correcta, guarda la lista en el estado "events".
  // 3. Revisa si hay un "selectedEventId" guardado en localStorage (lo guarda select-event/page.tsx).
  // 4. Si lo encuentra, busca ese evento en la lista y lo pone como "event" seleccionado.
  // 5. Si todo falla, events queda vacío y event queda en null (silencioso, sin mostrar error).
  // 6. Siempre pone loading en false al final para que la UI deje de mostrar el spinner.
  // Sin esto, TareasWidget y PagosWidget siempre recibirían event: null y mostrarían "Selecciona un evento".
  useEffect(() => {
    const loadEvents = async () => {
      try {
        const res = await apiFetch("/events");
        if (res.ok) {
          const data: Event[] = await res.json();
          if (Array.isArray(data)) {
            setEvents(data);

            // Auto-seleccionar evento guardado en localStorage
            const savedId = localStorage.getItem("selectedEventId");
            if (savedId) {
              const found = data.find((e) => e.id === savedId) || null;
              setEvent(found);
            }
          }
        }
      } catch {
        // Silencioso: events queda vacío
      } finally {
        setLoading(false);
      }
    };

    loadEvents();
  }, []);

  // código nuevo edición — selectEvent es la función que llaman las páginas del dashboard cuando el usuario elige un evento.
  // Hace dos cosas:
  // 1. Busca el evento en la lista "events" por su ID y lo pone como "event" seleccionado.
  // 2. Guarda el ID en localStorage para que si el usuario recarga la página, el evento siga seleccionado.
  // Sin el paso 2, al recargar se perdería la selección y el usuario tendría que elegir de nuevo.
  const selectEvent = useCallback((id: string) => {
    const found = events.find((e) => e.id === id) || null;
    setEvent(found);
    if (found) {
      localStorage.setItem("selectedEventId", found.id);
    }
  }, [events]);

  return (
    <EventContext.Provider value={{ event, events, loading, selectEvent }}>
      {children}
    </EventContext.Provider>
  );
}

export function useEvent() {
  return useContext(EventContext);
}
