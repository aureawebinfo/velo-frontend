import { createContext, useContext, useState, useEffect, type ReactNode } from "react";

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

  useEffect(() => {
    // Minimal placeholder: no-op fetch. Leave events empty and loading false.
    setLoading(false);
  }, []);

  function selectEvent(id: string) {
    const found = events.find((e) => e.id === id) || null;
    setEvent(found);
  }

  return (
    <EventContext.Provider value={{ event, events, loading, selectEvent }}>
      {children}
    </EventContext.Provider>
  );
}

export function useEvent() {
  return useContext(EventContext);
}
