"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { apiFetch } from "@/utils/apiFetch";

import {
  LayoutDashboard,
  Wallet,
  CheckSquare,
  MessageSquare,
  LogOut,
  Bell,
  ChevronRight,
  ChevronDown,
  CalendarDays,
  Clock,
  FileText,
  AlertTriangle, // Para alertas de error
  Menu, // [MOBILE] ícono hamburguesa
  X, // [MOBILE] ícono cerrar
} from "lucide-react";

// ===================================================================
// IMPORTACIÓN DE LOS WIDGETS (Tus otras páginas refactorizadas)
// ===================================================================
import ChatWidget from "./chat/page";
import DocumentosWidget from "./documentos/page";
import NotificacionesWidget from "./notificaciones/page";
import PagosWidget from "./pagos/page";
import TareasWidget from "./tareas/page";
import SeleccionarEventoWidget from "./seleccionar-evento/page";

// ---------------------------------------------------------------------------
// TIPOS M1 - Refrendados por el Plan Backend
// ---------------------------------------------------------------------------
interface EventMember {
  id: string;
  name: string;
  status: "PLANNING" | "ACTIVE" | "FINISHED";
  createdAt: string;
  // Campos visuales (No están en el modelo Event del plan backend, se mantienen simulados)
  locationSim: string;
  imageSim: string;
}

interface UserProfile {
  name: string;
  email: string;
  role: "ADMIN" | "COUPLE";
}

// ---------------------------------------------------------------------------
// HELPERS VISUALES (Se mantienen para imágenes/locaciones no implementadas en DB)
// ---------------------------------------------------------------------------
// Imágenes y locaciones de ejemplo para las tarjetas de eventos (reemplazar cuando el backend tenga archivos multimedia)
const SIMULATED_LOCATIONS = ["Hacienda El Rosal", "Casa Toscana", "Villa de las Flores", "Finca San Miguel"];
const SIMULATED_IMAGES = ["/images/gallery/1.png", "/images/gallery/2.png", "/images/gallery/3.png", "/images/gallery/4.png"];



export default function DashboardPage() {
  const router = useRouter();
  // Estado que controla qué sección del dashboard se está viendo
  const [activeTab, setActiveTab] = useState("inicio");

  // [MOBILE] Estado del drawer del sidebar en pantallas pequeñas
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // ===================================================================
  // NUEVOS ESTADOS PARA DATOS REALES
  // ===================================================================
  const [userName, setUserName] = useState<string>("Cargando...");
  const [realEvents, setRealEvents] = useState<EventMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingError, setLoadingError] = useState<string | null>(null);

  // código nuevo edición — Estados para datos reales de pagos y tareas del dashboard.
  // Antes eran valores simulados hardcoded ($245.000.000 y 18 tareas).
  // Ahora se cargan de la API usando los mismos endpoints que usan las páginas de pagos y tareas.
  const [paymentSummary, setPaymentSummary] = useState({ totalPaid: 0, totalPending: 0 });
  const [pendingTasksCount, setPendingTasksCount] = useState(0);
  const [pendingTasksList, setPendingTasksList] = useState<{ id: string; title: string; couple: string; date: string }[]>([]);

  // ===================================================================
  // CARGA DE DATOS REALES (M0 y M1)
  // ===================================================================
  useEffect(() => {
    // Solo cargar datos si estamos en la pestaña de inicio
    if (activeTab !== "inicio") return;

    setLoading(true);
    setLoadingError(null);

    const loadDashboardData = async () => {
      try {
        // 1. Cargar Perfil (M0 - /users/me)
        const profileRes = await apiFetch("/users/me").catch(() => null);
        if (profileRes && profileRes.ok) {
          const profile: UserProfile = await profileRes.json();
          setUserName(profile.name);
        } else {
          setUserName("Usuario Áurea");
        }

        // 2. Cargar Eventos Reales del Usuario (M1 - /events)
        const eventsRes = await apiFetch("/events").catch(() => null);
        if (eventsRes && eventsRes.ok) {
          const eventsResponse: any[] = await eventsRes.json();

          if (Array.isArray(eventsResponse)) {
            // Procesar los eventos agregando imágenes/locaciones simuladas
            const processedEvents = eventsResponse.map((evt, index) => ({
              ...evt,
              locationSim: SIMULATED_LOCATIONS[index % SIMULATED_LOCATIONS.length],
              imageSim: SIMULATED_IMAGES[index % SIMULATED_IMAGES.length],
            }));
            setRealEvents(processedEvents);

            // código nuevo edición — Cargar resumen de pagos y tareas pendientes de todos los eventos.
            // Por cada evento, llama a GET /events/:eventId/payments/summary y GET /events/:eventId/tasks.
            // Suma los totales de todos los eventos para mostrar en los KPIs del dashboard.
            // Si algún evento falla, lo ignora silenciosamente (no rompe el dashboard).
            let totalPaid = 0;
            let totalPending = 0;
            let totalPendingTasks = 0;
            const allPendingTasks: { id: string; title: string; couple: string; date: string }[] = [];

            for (const evt of processedEvents) {
              const [summaryRes, tasksRes] = await Promise.all([
                apiFetch(`/events/${evt.id}/payments/summary`).catch(() => null),
                apiFetch(`/events/${evt.id}/tasks`).catch(() => null),
              ]);

              if (summaryRes?.ok) {
                const summary = await summaryRes.json();
                totalPaid += Number(summary.totalPaid) || 0;
                totalPending += Number(summary.totalPending) || 0;
              }

              if (tasksRes?.ok) {
                const tasks = await tasksRes.json();
                if (Array.isArray(tasks)) {
                  const pending = tasks.filter((t: any) => t.status === "PENDING");
                  totalPendingTasks += pending.length;
                  pending.forEach((t: any) => {
                    allPendingTasks.push({
                      id: t.id,
                      title: t.title,
                      couple: evt.coupleName || evt.name || "Sin evento",
                      date: t.dueDate ? new Date(t.dueDate).toLocaleDateString("es-CO", { day: "numeric", month: "short" }) : "Sin fecha",
                    });
                  });
                }
              }
            }

            setPaymentSummary({ totalPaid, totalPending });
            setPendingTasksCount(totalPendingTasks);
            setPendingTasksList(allPendingTasks.slice(0, 5));
          } else {
            setRealEvents([]);
          }
        } else {
          setRealEvents([]);
        }
      } catch (err) {
        setLoadingError("Error al conectar con la base de datos de Áurea.");
        setUserName("Casa de Eventos Áurea (Fallback)");
      } finally {
        setLoading(false);
      }
    };

    loadDashboardData();
  }, [activeTab]);

  // [MOBILE] Bloquea el scroll del body cuando el drawer está abierto
  useEffect(() => {
    document.body.style.overflow = sidebarOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [sidebarOpen]);

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    router.push("/");
  };

  // [MOBILE] Cierra el drawer automáticamente al navegar (solo importa en mobile)
  const handleNavClick = (id: string) => {
    setActiveTab(id);
    setSidebarOpen(false);
  };

  // Menú lateral simplificado con las secciones reales que tenemos
  const navItems = [
    { id: "inicio", label: "Inicio", icon: LayoutDashboard },
    { id: "seleccionar-evento", label: "Seleccionar Evento", icon: CalendarDays },
    { id: "presupuesto", label: "Pagos y Finanzas", icon: Wallet },
    { id: "tareas", label: "Checklist de Tareas", icon: CheckSquare },
    { id: "documentos", label: "Bóveda de Documentos", icon: FileText },
    { id: "mensajes", label: "Chat Concierge", icon: MessageSquare },
  ];

  // Cálculos de KPIs basados en datos reales (Parcial hasta mergear M2/M3)
  const totalRealEvents = realEvents.length;
  const activeEventsCount = realEvents.filter((e) => e.status === "ACTIVE").length;

  // ===================================================================
  // RENDERIZADOR DINÁMICO DE CONTENIDO
  // ===================================================================
  const renderContent = () => {
    switch (activeTab) {
      case "presupuesto":
        return <PagosWidget />;
      case "tareas":
        return <TareasWidget />;
      case "documentos":
        return <DocumentosWidget />;
      case "mensajes":
        return <ChatWidget />;
      case "notificaciones":
        return <NotificacionesWidget />;
      case "seleccionar-evento":
        return <SeleccionarEventoWidget />;
      case "inicio":
      default:
        // EL RESUMEN DEL DASHBOARD
        return (
          <>
            {/* Alerta de Error de Conexión */}
            {loadingError && (
              <div className="mb-6 flex items-center gap-3 rounded-2xl border border-red-100 bg-red-50 p-3 text-xs text-red-700 anim-fade-in shadow-xs z-10 sm:p-4 sm:text-sm">
                <AlertTriangle className="h-5 w-5 shrink-0" />
                <p>
                  <strong>Aviso Importante:</strong> {loadingError} Algunos widgets siguen mostrando datos de muestra.
                </p>
              </div>
            )}

            {/* ── 4 Tarjetas de Métricas (KPIs) ── */}
            <div className="mb-6 grid grid-cols-2 gap-3 sm:mb-8 sm:gap-5 lg:grid-cols-4">
              {/* KPIs con datos reales de la API */}
              <div className="rounded-2xl border border-[#E8E2D5] bg-white p-3.5 shadow-xs transition-shadow hover:shadow-md sm:p-5">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-semibold uppercase tracking-wider text-[#7A7167] sm:text-[11px]">
                    Eventos Activos
                  </span>
                  <div className="rounded-lg bg-[#FAF4EA] p-1.5 text-[#A07D38] sm:p-2">
                    <CalendarDays className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                  </div>
                </div>
                <p className={`mt-2 text-2xl font-bold text-[#1F1C19] sm:mt-3 sm:text-3xl ${loading ? "animate-pulse" : ""}`}>
                  {loading ? "--" : activeEventsCount}
                </p>
              </div>

              <div className="rounded-2xl border border-[#E8E2D5] bg-white p-3.5 shadow-xs transition-shadow hover:shadow-md sm:p-5">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-semibold uppercase tracking-wider text-[#7A7167] sm:text-[11px]">
                    Total Eventos
                  </span>
                  <div className="rounded-lg bg-[#FAF4EA] p-1.5 text-[#A07D38] sm:p-2">
                    <Clock className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                  </div>
                </div>
                <p className={`mt-2 text-2xl font-bold text-[#1F1C19] sm:mt-3 sm:text-3xl ${loading ? "animate-pulse" : ""}`}>
                  {loading ? "--" : totalRealEvents}
                </p>
              </div>

              {/* código nuevo edición — KPI de Presupuesto con datos reales de la API.
              Antes mostraba $245.000.000 hardcoded. Ahora suma totalPaid + totalPending de todos los eventos. */}
              <div className="rounded-2xl border border-[#E8E2D5] bg-white p-3.5 shadow-xs transition-shadow hover:shadow-md sm:p-5">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-semibold uppercase tracking-wider text-[#7A7167] sm:text-[11px]">
                    Presupuesto Total
                  </span>
                  <div className="rounded-lg bg-[#FAF4EA] p-1.5 text-[#A07D38] sm:p-2">
                    <Wallet className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                  </div>
                </div>
                <div className="mt-2 flex flex-wrap items-baseline gap-1 sm:mt-3">
                  <span className={`text-lg font-bold sm:text-2xl ${loading ? "animate-pulse text-[#D9D1C5]" : "text-[#1F1C19]"}`}>
                    {loading ? "--" : `$${(paymentSummary.totalPaid + paymentSummary.totalPending).toLocaleString("es-CO")}`}
                  </span>
                  <span className="text-[10px] font-semibold text-[#8E8579]">COP</span>
                </div>
              </div>

              {/* código nuevo edición — KPI de Tareas Pendientes con datos reales de la API.
              Antes mostraba 18 hardcoded. Ahora cuenta las tareas con status PENDING de todos los eventos. */}
              <div className="rounded-2xl border border-[#E8E2D5] bg-white p-3.5 shadow-xs transition-shadow hover:shadow-md sm:p-5">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-semibold uppercase tracking-wider text-[#7A7167] sm:text-[11px]">
                    Tareas Pendientes
                  </span>
                  <div className="rounded-lg bg-[#FAF4EA] p-1.5 text-[#A07D38] sm:p-2">
                    <CheckSquare className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                  </div>
                </div>
                <p className={`mt-2 text-2xl font-bold sm:mt-3 sm:text-3xl ${loading ? "animate-pulse text-[#D9D1C5]" : "text-[#1F1C19]"}`}>
                  {loading ? "--" : pendingTasksCount}
                </p>
              </div>
            </div>

            {/* ── Grilla Principal: 3 Widgets Clave ── */}
            <div className="grid grid-cols-1 gap-5 sm:gap-6 lg:grid-cols-3">
              {/* Widget 1: Próximos Eventos (¡REALES de M1!) */}
              <div className="z-0 flex h-[340px] flex-col overflow-hidden rounded-2xl border border-[#E8E2D5] bg-white p-4 shadow-xs sm:h-[400px] sm:p-6">
                <div className="mb-4 flex shrink-0 items-center justify-between sm:mb-5">
                  <h2 className="text-xs font-bold tracking-wide text-[#1F1C19] sm:text-sm">Próximos Eventos</h2>
                  <button className="text-[11px] font-semibold text-[#A07D38] hover:underline">Ver calendario</button>
                </div>

                {loading && (
                  <div className="flex flex-1 flex-col items-center justify-center text-center text-xs text-[#7A7167]">
                    <div className="relative mb-4 h-20 w-20 overflow-hidden opacity-50">
                      <Image src="/images/logo.png" alt="Aurea Loading" fill className="object-contain" />
                    </div>
                    Conectando con la base de datos de Áurea...
                  </div>
                )}

                {!loading && realEvents.length === 0 && !loadingError && (
                  <div className="flex flex-1 items-center justify-center text-center text-xs text-[#7A7167]">
                    Aún no tienes eventos registrados en Áurea.
                  </div>
                )}

                {!loading && realEvents.length > 0 && (
                  <div className="space-y-3 overflow-y-auto pr-1 sm:space-y-3.5">
                    {realEvents.map((evt) => (
                      <div
                        key={evt.id}
                        className="group flex cursor-pointer items-center justify-between rounded-xl border border-[#F0EBE1] bg-[#FAF8F5] p-2.5 transition-all duration-200 hover:border-[#C9A96A]/40 hover:bg-white hover:shadow-xs"
                      >
                        <div className="flex min-w-0 items-center gap-3">
                          <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-lg bg-stone-200">
                            <Image src={evt.imageSim} alt={evt.name} fill className="object-cover" />
                          </div>
                          <div className="min-w-0">
                            <p className="truncate text-xs font-bold text-[#1F1C19]">{evt.name}</p>
                            <p className="truncate text-[10px] text-[#7A7167]">
                              <span className={evt.status === "ACTIVE" ? "font-medium text-emerald-700" : ""}>
                                {evt.status === "PLANNING" ? "Planeación" : evt.status === "ACTIVE" ? "Activo" : "Finalizado"}
                              </span>{" "}
                              · <span className="text-[#A07D38]">{evt.locationSim}</span>
                            </p>
                          </div>
                        </div>
                        <ChevronRight className="h-4 w-4 shrink-0 text-[#B3ABA0] transition-transform group-hover:translate-x-0.5 group-hover:text-[#A07D38]" />
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* código nuevo edición — Widget de Presupuesto con datos reales de la API.
              Antes era un gráfico circular con valores hardcodeados ($245M, $145M, $70M).
              Ahora calcula los porcentajes reales de pagado vs pendiente de todos los eventos.
              Si no hay datos, muestra "Sin pagos registrados". */}
              <div className="z-0 rounded-2xl border border-[#E8E2D5] bg-white p-4 shadow-xs sm:p-6">
                <div className="mb-4 flex items-center justify-between">
                  <h2 className="text-xs font-bold tracking-wide text-[#1F1C19] sm:text-sm">Presupuesto</h2>
                </div>
                {loading ? (
                  <div className="flex items-center justify-center h-48 animate-pulse">
                    <p className="text-xs text-[#B3ABA0]">Cargando...</p>
                  </div>
                ) : paymentSummary.totalPaid === 0 && paymentSummary.totalPending === 0 ? (
                  <div className="flex items-center justify-center h-48 text-center">
                    <p className="text-xs text-[#7A7167]">Sin pagos registrados en tus eventos.</p>
                  </div>
                ) : (
                  <>
                    {/* Gráfico circular con datos reales */}
                    <div className="relative my-4 flex items-center justify-center">
                      <svg className="h-32 w-32 -rotate-90 transform sm:h-40 sm:w-40" viewBox="0 0 100 100">
                        <circle cx="50" cy="50" r="38" fill="transparent" stroke="#EFEBE4" strokeWidth="11" />
                        <circle
                          cx="50" cy="50" r="38" fill="transparent"
                          stroke="#C9A96A" strokeWidth="11"
                          strokeDasharray="238.76"
                          strokeDashoffset={238.76 - (238.76 * (paymentSummary.totalPaid / (paymentSummary.totalPaid + paymentSummary.totalPending)))}
                          strokeLinecap="round"
                        />
                      </svg>
                      <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                        <span className="text-[9px] font-semibold uppercase tracking-wider text-[#7A7167]">Total</span>
                        <span className="text-xs font-bold text-[#1F1C19] sm:text-sm">
                          ${(paymentSummary.totalPaid + paymentSummary.totalPending).toLocaleString("es-CO")}
                        </span>
                        <span className="text-[9px] font-medium text-[#8E8579]">COP</span>
                      </div>
                    </div>
                    <div className="mt-5 space-y-2 text-xs">
                      <div className="flex items-center justify-between border-b border-[#F0EBE1] pb-1.5">
                        <div className="flex items-center gap-2">
                          <span className="h-2.5 w-2.5 rounded-full bg-[#C9A96A]" />
                          <span className="text-[#6A6158]">Pagado</span>
                        </div>
                        <span className="font-semibold text-[#1F1C19]">${paymentSummary.totalPaid.toLocaleString("es-CO")}</span>
                      </div>
                      <div className="flex items-center justify-between pt-0.5">
                        <div className="flex items-center gap-2">
                          <span className="h-2.5 w-2.5 rounded-full bg-[#E5DDD0]" />
                          <span className="text-[#6A6158]">Pendiente</span>
                        </div>
                        <span className="font-semibold text-[#1F1C19]">${paymentSummary.totalPending.toLocaleString("es-CO")}</span>
                      </div>
                    </div>
                  </>
                )}
              </div>

              {/* código nuevo edición — Widget de Tareas Pendientes con datos reales de la API.
              Antes mostraba tareas simuladas hardcodeadas (menú degustación, cronograma, etc.).
              Ahora muestra hasta 5 tareas pendientes reales de todos los eventos del usuario.
              Si no hay tareas pendientes, muestra un mensaje vacío amigable. */}
              <div className="z-0 rounded-2xl border border-[#E8E2D5] bg-white p-4 shadow-xs sm:p-6">
                <div className="mb-4 flex items-center justify-between sm:mb-5">
                  <h2 className="text-xs font-bold tracking-wide text-[#1F1C19] sm:text-sm">Tareas Pendientes</h2>
                  <button
                    onClick={() => setActiveTab("tareas")}
                    className="text-[11px] font-semibold text-[#A07D38] hover:underline"
                  >
                    Ver todas
                  </button>
                </div>
                {loading ? (
                  <div className="space-y-3">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="h-14 animate-pulse rounded-xl bg-[#F5F2EB]" />
                    ))}
                  </div>
                ) : pendingTasksList.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-8 text-center">
                    <CheckSquare className="mb-2 h-8 w-8 text-[#D9D1C5]" />
                    <p className="text-xs text-[#7A7167]">No hay tareas pendientes</p>
                    <p className="text-[10px] text-[#B3ABA0]">Todas las tareas están completadas</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {pendingTasksList.map((t) => (
                      <div
                        key={t.id}
                        className="flex items-start gap-3 rounded-xl border border-[#F0EBE1] bg-[#FAF8F5] p-3 transition-colors hover:bg-white hover:shadow-xs"
                      >
                        <div className="mt-0.5 h-4 w-4 shrink-0 rounded-sm border border-[#C9A96A]/40 bg-[#FAF4EA]" />
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-xs font-semibold text-[#1F1C19]">{t.title}</p>
                          <p className="truncate text-[10px] text-[#7A7167]">{t.couple}</p>
                        </div>
                        <span className="shrink-0 rounded-md bg-[#FAF4EA] px-2 py-0.5 text-[10px] font-medium text-[#A07D38]">
                          {t.date}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </>
        );
    }
  };

  return (
    <div className="flex h-screen w-full overflow-hidden bg-[#F5F2EB] text-[#2C2723]">
      {/* [MOBILE] Overlay oscuro detrás del drawer, solo visible < lg cuando está abierto */}
      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 z-30 bg-black/50 backdrop-blur-xs lg:hidden"
          aria-hidden="true"
        />
      )}

      {/* =========================================================
          SIDEBAR IZQUIERDA (Estilo Dark Luxury Áurea)
          [MOBILE] Drawer fixed que se desliza con translate-x, oculto por
          defecto en < lg y siempre visible como columna fija en lg+.
          ========================================================= */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 flex w-72 shrink-0 flex-col justify-between border-r border-[#2C2723]/10 bg-[#161412] px-5 py-6 text-[#EAE5D9] transition-transform duration-300 ease-in-out lg:static lg:z-20 lg:w-64 lg:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div>
          {/* Logo Áurea + botón cerrar (mobile) */}
          <div className="mb-8 flex items-center justify-between px-2">
            <div
              className="flex cursor-pointer items-center gap-3"
              onClick={() => handleNavClick("inicio")}
            >
              <span
                className="text-2xl font-medium tracking-[0.25em] text-[#C9A96A]"
                style={{ fontFamily: "var(--font-title-serif, 'Playfair Display', serif)" }}
              >
                ÁUREA
              </span>
            </div>
            {/* [MOBILE] Botón cerrar drawer, solo visible < lg */}
            <button
              onClick={() => setSidebarOpen(false)}
              aria-label="Cerrar menú"
              className="rounded-lg p-1.5 text-[#B3ABA0] hover:bg-white/5 hover:text-white lg:hidden"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Menú de Navegación Dinámico */}
          <nav className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`flex w-full items-center gap-3.5 rounded-lg px-3.5 py-2.5 text-xs font-medium transition-all duration-200 ${
                    isActive
                      ? "bg-[#C9A96A] font-semibold text-[#161412] shadow-md shadow-[#C9A96A]/20"
                      : "text-[#B3ABA0] hover:bg-white/5 hover:text-[#FAF5ED]"
                  }`}
                >
                  <Icon className={`h-4 w-4 ${isActive ? "text-[#161412]" : "text-[#B3ABA0]"}`} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Perfil Inferior & Cerrar Sesión (M0 REAL) */}
        <div className="border-t border-white/10 pt-4">
          <div className="mb-3 flex items-center gap-3 px-2">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#C9A96A]/20 text-xs font-semibold text-[#C9A96A] animate-pulse">
              {loading ? "--" : userName.split(" ").map((n) => n[0]).join("").toUpperCase().substring(0, 2)}
            </div>
            <div className="min-w-0 flex-1 text-left">
              <p className={`truncate text-xs font-semibold text-[#FAF5ED] ${loading ? "animate-pulse" : ""}`}>
                {loading ? "Cargando..." : userName}
              </p>
              <p className="truncate text-[10px] text-[#8E8579]">Aurea Events CE</p>
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-xs text-[#B3ABA0] transition-colors hover:bg-red-500/10 hover:text-red-400"
          >
            <LogOut className="h-4 w-4" />
            <span>Cerrar sesión</span>
          </button>
        </div>
      </aside>

      {/* =========================================================
          CONTENIDO PRINCIPAL
          [MOBILE] padding reducido en pantallas chicas
          ========================================================= */}
      <main className="relative flex-1 overflow-y-auto px-4 py-5 sm:px-6 sm:py-6 lg:px-12 lg:py-8">
        {/* Barra Superior / Header General */}
        <header className="mb-6 flex flex-col gap-4 sm:mb-8 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-3 min-w-0">
            {/* [MOBILE] Botón hamburguesa, solo visible < lg */}
            <button
              onClick={() => setSidebarOpen(true)}
              aria-label="Abrir menú"
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-[#D9D1C5] bg-white text-[#2C2723] shadow-xs lg:hidden"
            >
              <Menu className="h-4.5 w-4.5" />
            </button>

            <div className="min-w-0 flex-1">
              <h1
                className={`truncate text-lg font-semibold tracking-tight text-[#1F1C19] sm:text-2xl md:text-3xl transition-all ${
                  loading ? "animate-pulse" : ""
                }`}
                style={{ fontFamily: "var(--font-title-serif, 'Playfair Display', serif)" }}
              >
                {activeTab === "inicio" ? `Bienvenida, ${loading ? "Usuario" : userName}` : "Panel de Gestión Áurea"}
              </h1>
              <p className="mt-1 truncate text-[11px] text-[#7A7167] sm:text-xs">
                {activeTab === "inicio"
                  ? "Aquí tienes el resumen de tus bodas y eventos."
                  : "Navega entre las diferentes herramientas de administración."}
              </p>
            </div>
          </div>

          <div className="flex shrink-0 items-center justify-end gap-3 sm:gap-4">
            {/* [MOBILE] Se oculta el chip de nombre duplicado en pantallas muy chicas, ya está en el header */}
            <div className="hidden items-center gap-2 rounded-full border border-[#D9D1C5] bg-white px-4 py-1.5 text-xs font-medium text-[#2C2723] shadow-xs sm:flex">
              <span className={loading ? "animate-pulse" : ""}>{loading ? "Cargando..." : userName}</span>
              <ChevronDown className="h-3.5 w-3.5 text-[#7A7167]" />
            </div>
            {/* Botón de Campana: Cambia la vista a Notificaciones */}
            <button
              onClick={() => setActiveTab("notificaciones")}
              aria-label="Notificaciones"
              className={`flex h-9 w-9 items-center justify-center rounded-full border shadow-xs transition-colors ${
                activeTab === "notificaciones"
                  ? "border-[#C9A96A] bg-[#C9A96A] text-white"
                  : "border-[#D9D1C5] bg-white text-[#5C5349] hover:bg-[#EBE5DB]"
              }`}
            >
              <Bell className="h-4 w-4" />
            </button>
          </div>
        </header>

        {/* ── AQUÍ SE INYECTA LA SECCIÓN ACTIVA ── */}
        <div className="z-0 animate-fade-up">{renderContent()}</div>
      </main>
    </div>
  );
}