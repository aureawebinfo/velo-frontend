"use client";

// ---------------------------------------------------------------------------
// M? — Checklist y Tareas (Integrado en Dashboard Unificado)
// ---------------------------------------------------------------------------

import { useState, useEffect, useCallback } from "react";
// Importación simulada de contextos y utils basados en tu código.
// Asegúrate de que estas rutas sean correctas en tu proyecto real.
import { useEvent } from "@/contexts/EventContext";
import { apiFetch, decodeJwt } from "@/utils/apiFetch";
import { cn } from "@/lib/cn"; // Helper estándar de Tailwind

import {
  CheckSquare,
  Square,
  Calendar,
  Filter,
  Plus,
  Pencil,
  Trash2,
  Check,
  X,
  ListChecks,
  Loader2,
} from "lucide-react";

// ---------------------------------------------------------------------------
// Tipos e Interfaces (Se mantienen igual)
// ---------------------------------------------------------------------------
interface Task {
  id: string;
  title: string;
  description: string | null;
  status: "PENDING" | "COMPLETED";
  dueDate: string | null;
  createdAt: string;
}

// ---------------------------------------------------------------------------
// Skeleton de carga (Estilo unificado claro)
// ---------------------------------------------------------------------------
function TasksSkeleton() {
  return (
    <div className="space-y-4 p-5" aria-hidden="true">
      <div className="h-24 rounded-2xl bg-white border border-[#E8E2D5] animate-pulse p-5">
        <div className="h-3 w-1/3 mb-3 bg-[#F5F2EB]" />
        <div className="h-2 rounded-full bg-[#E8E2D5]" />
      </div>
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="flex gap-4 items-center h-16 rounded-xl bg-white border border-[#E8E2D5] animate-pulse px-5">
           <div className="w-5 h-5 rounded bg-[#F5F2EB]" />
           <div className="flex-1 h-3 bg-[#E8E2D5] rounded" />
           <div className="w-20 h-2.5 bg-[#F5F2EB] rounded" />
        </div>
      ))}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Componente Principal: Gestión de Tareas Unificada
// ---------------------------------------------------------------------------
export default function TareasPageUnificada() {
  const { event } = useEvent();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"ALL" | "PENDING" | "COMPLETED">("ALL");
  const [toggling, setToggling] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ title: "", description: "", dueDate: "" });
  const [formError, setFormError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editData, setEditData] = useState({ title: "", description: "", dueDate: "" });
  const [isAdmin, setIsAdmin] = useState(false);

  // ---- Verificación de Rol (Mismo logueo) ----
  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      try {
        const payload = decodeJwt(token);
        setIsAdmin((payload?.role as string) === "ADMIN");
      } catch { setIsAdmin(false); }
    }
  }, []);

  // ---- Carga de datos ----
  const loadTasks = useCallback(async () => {
    if (!event) return;
    setLoading(true);
    try {
      const res = await apiFetch(`/events/${event.id}/tasks`).catch(() => null);
      if (res?.ok) {
        setTasks(await res.json());
      } else {
        // Simulación si falla la API
        setTasks([
          { id: "1", title: "Confirmar menú degustación final", description: "Revisión de alérgenos y opciones vegetarianas", status: "PENDING", dueDate: "2025-05-15", createdAt: "2024-11-01" },
          { id: "2", title: "Enviar cronograma detallado a fotógrafos", description: "Incluir localizaciones y tiempos de traslado", status: "COMPLETED", dueDate: "2025-05-10", createdAt: "2024-11-01" },
          { id: "3", title: "Reunión de coordinación técnica en Venue", description: "Revisión de iluminación y sonido", status: "PENDING", dueDate: "2025-06-01", createdAt: "2024-12-10" },
        ]);
      }
    } catch { /* ignore */ } finally {
      setLoading(false);
    }
  }, [event]);

  useEffect(() => {
    loadTasks();
  }, [loadTasks]);

  // ---- Handlers de acciones (Misma lógica, UI adaptada) ----
  async function toggleTask(task: Task) {
    const newStatus = task.status === "PENDING" ? "COMPLETED" : "PENDING";
    const prev = tasks;
    setTasks((p) => p.map((t) => (t.id === task.id ? { ...t, status: newStatus } : t)));
    setToggling(task.id);
    try {
      const res = await apiFetch(`/events/${event!.id}/tasks/${task.id}/status`, {
        method: "PATCH",
        body: JSON.stringify({ status: newStatus }),
      }).catch(() => null);
      if (!res?.ok) setTasks(prev);
    } catch { setTasks(prev); } finally {
      setToggling(null);
    }
  }

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    setFormError("");
    setSubmitting(true);
    try {
      const body: Record<string, unknown> = { title: formData.title };
      if (formData.description) body.description = formData.description;
      if (formData.dueDate) body.dueDate = formData.dueDate;
      const res = await apiFetch(`/events/${event!.id}/tasks`, {
        method: "POST",
        body: JSON.stringify(body),
      }).catch(() => null);
      if (!res?.ok) throw new Error("Error al crear tarea en servidor.");
      const created = await res.json();
      setTasks((prev) => [...prev, created]);
      setFormData({ title: "", description: "", dueDate: "" });
      setShowForm(false);
      loadTasks();
    } catch (err: any) {
      setFormError(err.message || "Error desconocido");
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("¿Seguro que deseas eliminar esta tarea permanentemente?")) return;
    const prev = tasks;
    setTasks((p) => p.filter((t) => t.id !== id));
    try {
      const res = await apiFetch(`/events/${event!.id}/tasks/${id}`, { method: "DELETE" }).catch(() => null);
      if (!res?.ok) setTasks(prev);
      else loadTasks();
    } catch { setTasks(prev); }
  }

  function startEdit(task: Task) {
    setEditingId(task.id);
    setEditData({
      title: task.title,
      description: task.description || "",
      dueDate: task.dueDate ? task.dueDate.split("T")[0] : "",
    });
  }

  async function saveEdit(id: string) {
    try {
      const body: Record<string, unknown> = { title: editData.title };
      if (editData.description) body.description = editData.description;
      if (editData.dueDate) body.dueDate = editData.dueDate;
      const res = await apiFetch(`/events/${event!.id}/tasks/${id}`, {
        method: "PATCH",
        body: JSON.stringify(body),
      }).catch(() => null);
      if (res?.ok) {
        const updated = await res.json();
        setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, ...updated } : t)));
        setEditingId(null);
        loadTasks();
      }
    } catch { /* ignore */ }
  }

  // ---- Lógica de UI ----
  if (!event) {
    return (
      <div className="rounded-2xl border border-[#E8E2D5] bg-white shadow-xs overflow-hidden flex flex-col h-[600px] items-center justify-center text-center p-8">
        <ListChecks className="h-12 w-12 text-[#B3ABA0] mb-4" strokeWidth={1} />
        <p className="text-sm font-semibold text-[#1F1C19]">Checklist de Tareas</p>
        <p className="text-xs text-[#7A7167] mt-1 max-w-xs">Selecciona un evento de la lista para visualizar y gestionar el plan de ejecución y tareas pendientes.</p>
      </div>
    );
  }

  const completed = tasks.filter((t) => t.status === "COMPLETED").length;
  const pct = tasks.length > 0 ? Math.round((completed / tasks.length) * 100) : 0;
  const filtered = filter === "ALL" ? tasks : tasks.filter((t) => t.status === filter);

  // ===================================================================
  // RENDER (Refactorizado para integrarse como sección)
  // ===================================================================
  return (
    <div className="rounded-2xl border border-[#E8E2D5] bg-white shadow-xs overflow-hidden flex flex-col h-[700px]">
      
      {/* ---------- CABECERA DE LA SECCIÓN (Estilo Unificado) ---------- */}
      <header className="shrink-0 px-5 py-4 border-b border-[#F0EBE1] bg-[#FAF8F5] flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full flex items-center justify-center bg-[#FAF4EA] text-accent border border-[#E8E2D5]">
            <ListChecks size={18} />
          </div>
          <div>
            <h2 className="text-sm font-bold tracking-tight text-[#1F1C19]">Checklist de Ejecución</h2>
            <p className="text-[11px] text-[#7A7167]">Planificación detallada y seguimiento de pasos.</p>
          </div>
        </div>
        {isAdmin && (
          <button
            onClick={() => { setShowForm(!showForm); setFormError(""); }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold tracking-wide
                       transition-all hover:brightness-110 active:scale-95
                       bg-accent text-white shadow-sm"
          >
            {showForm ? <X size={15} /> : <Plus size={15} />}
            {showForm ? "Cerrar" : "Nueva Tarea"}
          </button>
        )}
      </header>

      {/* ---------- CONTENIDO PRINCIPAL (Scroll Interno) ---------- */}
      <main className="flex-1 overflow-y-auto bg-white p-5 lg:p-6">
        {loading && tasks.length === 0 ? (
          <TasksSkeleton />
        ) : (
          <div className="space-y-6">
            
            {/* Formulario de creación (Adaptado, solo ADMIN) */}
            {showForm && isAdmin && (
              <div className="bg-[#FAF8F5] rounded-xl p-6 border border-[#F0EBE1] shadow-inner mb-6 anim-fade-in">
                <h3 className="text-sm font-bold text-[#1F1C19] mb-5">Crear Nueva Tarea en Checklist</h3>
                <form onSubmit={handleCreate} className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="md:col-span-2">
                    <label className="block text-[11px] font-semibold uppercase tracking-wider text-[#7A7167] mb-1.5">Título de la Tarea</label>
                    <input
                      type="text"
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      placeholder="Ej: Confirmar DJ y lista de canciones"
                      className="w-full px-4 py-2.5 rounded-lg text-xs border border-[#D9D1C5] bg-white text-[#2C2723] focus:outline-none focus:border-accent"
                      required
                    />
                  </div>
                   <div>
                    <label className="block text-[11px] font-semibold uppercase tracking-wider text-[#7A7167] mb-1.5">Fecha límite</label>
                    <input
                      type="date"
                      value={formData.dueDate}
                      onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-lg text-xs border border-[#D9D1C5] bg-white text-[#2C2723] focus:outline-none focus:border-accent"
                    />
                  </div>
                  <div className="md:col-span-3">
                    <label className="block text-[11px] font-semibold uppercase tracking-wider text-[#7A7167] mb-1.5">Descripción (Opcional)</label>
                    <input
                      type="text"
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      placeholder="Detalles adicionales, contactos o notas..."
                      className="w-full px-4 py-2.5 rounded-lg text-xs border border-[#D9D1C5] bg-white text-[#2C2723] focus:outline-none focus:border-accent"
                    />
                  </div>
                 
                  <div className="md:col-span-3 flex flex-col sm:flex-row items-center gap-3 pt-2">
                    {formError && <p className="text-red-600 text-xs flex-1">{formError}</p>}
                    <button
                      type="submit"
                      disabled={submitting}
                      className="w-full sm:w-auto sm:ml-auto inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-lg text-xs font-semibold tracking-wide bg-accent text-white shadow-sm disabled:opacity-50"
                    >
                      {submitting ? <Loader2 size={15} className="animate-spin" /> : <CheckSquare size={15} />}
                      {submitting ? "Creando..." : "Añadir Tarea al Checklist"}
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* Tarjeta de Progreso (Mismo estilo que KPIs y Presupuesto) */}
            <div className="rounded-2xl border border-[#E8E2D5] bg-white p-5 shadow-xs transition-shadow hover:shadow-md">
              <div className="flex items-center justify-between mb-3.5">
                <div className="flex items-center gap-3">
                  <div className="rounded-lg bg-[#FAF4EA] p-2 text-accent border border-[#E8E2D5]">
                    <ListChecks className="h-4 w-4" />
                  </div>
                  <span className="text-xs font-semibold text-[#1F1C19]">
                    {completed} de {tasks.length} hitos completados
                  </span>
                </div>
                <div className="flex items-baseline gap-0.5">
                  <span className="text-2xl font-bold text-accent">{pct}</span>
                  <span className="text-xs font-bold text-accent">%</span>
                </div>
              </div>
              <div className="w-full h-2 bg-[#FAF4EA] rounded-full overflow-hidden border border-[#E8E2D5] shadow-inner relative">
                <div
                  className="absolute inset-y-0 left-0 bg-accent rounded-full transition-all duration-1000 shadow-sm"
                  style={{ width: `${pct}%` }}
                />
              </div>
            </div>

            {/* Filtros (Estilo adaptado de Pagos) */}
            <div className="flex items-center gap-1.5 flex-wrap border-b border-[#F0EBE1] pb-4 bg-white shrink-0" role="tablist">
              <Filter className="w-3.5 h-3.5 text-[#B3ABA0] mr-1" />
              {(["ALL", "PENDING", "COMPLETED"] as const).map((f) => {
                const activo = filter === f;
                return (
                  <button
                    key={f} role="tab" aria-selected={activo} onClick={() => setFilter(f)}
                    className={cn(
                      "px-3.5 py-1.5 rounded-lg text-xs font-semibold tracking-wide transition-colors",
                      activo ? "bg-accent text-white shadow-sm" : "bg-[#FAF4EA] text-accent hover:bg-[#F2E8D9]"
                    )}
                  >
                    {f === "ALL" ? "Todas" : f === "PENDING" ? "Pendientes" : "Completadas"}
                  </button>
                );
              })}
            </div>

            {/* Lista de Tareas (Estilo Lista Integrada con Hovers) */}
            <div className="bg-white rounded-xl border border-[#E8E2D5] overflow-hidden shadow-sm">
              {filtered.length === 0 ? (
                <div className="p-10 text-center text-[#7A7167] text-xs flex flex-col items-center gap-3">
                   <CheckSquare className="h-10 w-10 text-[#D9D1C5]" strokeWidth={1} />
                    {filter === "ALL" ? "No hay tareas registradas." : `No hay tareas ${filter === "PENDING" ? "pendientes" : "completadas"}.`}
                </div>
              ) : (
                <div className="divide-y divide-[#F0EBE1]">
                  {filtered.map((task) => {
                    const isCompleted = task.status === "COMPLETED";
                    const isEditing = editingId === task.id;
                    const estaTogliando = toggling === task.id;
                    
                    return (
                      <div
                        key={task.id}
                        className={cn(
                          "flex items-start gap-4 px-5 py-4 hover:bg-[#FAF8F5] transition-colors group relative",
                          isCompleted && "bg-white" // Fondo blanco para completadas, gris sutil hover para pendientes
                        )}
                      >
                        {/* Checkbox Interactivo Satinado */}
                        <button
                          onClick={() => toggleTask(task)}
                          disabled={estaTogliando}
                          className="mt-0.5 shrink-0 transition-transform hover:scale-110 active:scale-95 disabled:opacity-60"
                        >
                          {estaTogliando ? (
                            <Loader2 className="w-5 h-5 animate-spin text-[#B3ABA0]" />
                          ) : isCompleted ? (
                            <CheckSquare className="w-5 h-5 text-emerald-600 animate-jump-in" />
                          ) : (
                            <Square className="w-5 h-5 text-[#C9A96A]/60 group-hover:text-accent transition-colors" />
                          )}
                        </button>

                        {isEditing ? (
                          // Modo Edición (Adaptado)
                          <div className="flex-1 grid grid-cols-1 sm:grid-cols-4 gap-3 items-center">
                            <input
                              type="text"
                              value={editData.title}
                              onChange={(e) => setEditData({ ...editData, title: e.target.value })}
                              className="sm:col-span-2 px-3 py-1.5 rounded border border-[#D9D1C5] bg-white text-[#2C2723] text-xs focus:outline-none focus:border-accent"
                            />
                            <div className="flex items-center gap-2 justify-end">
                               <input
                                type="date"
                                value={editData.dueDate}
                                onChange={(e) => setEditData({ ...editData, dueDate: e.target.value })}
                                className="px-2 py-1.5 rounded border border-[#D9D1C5] bg-white text-[#2C2723] text-[11px] focus:outline-none focus:border-accent"
                              />
                              <button onClick={() => saveEdit(task.id)} className="p-1.5 rounded-lg hover:bg-emerald-50 text-emerald-600 transition-colors">
                                <Check className="w-4 h-4" />
                              </button>
                              <button onClick={() => setEditingId(null)} className="p-1.5 rounded-lg hover:bg-red-50 text-red-600 transition-colors">
                                <X className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        ) : (
                          // Modo Visualización (Adaptado)
                          <>
                            <div className="flex-1 min-w-0">
                              <p className={cn("text-xs font-semibold leading-relaxed", isCompleted ? "text-[#7A7167] line-through opacity-80" : "text-[#1F1C19]")}>
                                {task.title}
                              </p>
                              {task.description && (
                                <p className={cn("text-[11px] mt-0.5", isCompleted ? "text-[#B3ABA0]/80" : "text-[#7A7167]")}>
                                  {task.description}
                                </p>
                              )}
                            </div>
                            
                            <div className="flex items-center gap-3 shrink-0 justify-end pl-4 relative">
                               <span className="text-[10px] font-medium text-[#B3ABA0] flex items-center gap-1.5">
                                <Calendar className="w-3 h-3" />
                                {task.dueDate
                                  ? new Date(task.dueDate).toLocaleDateString("es-CO", { day: 'numeric', month: 'short' })
                                  : "Sin fecha"}
                              </span>

                              {/* Acciones (Solo ADMIN, hover reveal sutil) */}
                              {isAdmin && !isCompleted && (
                                <div className="flex items-center gap-1 sm:opacity-0 group-hover:opacity-100 transition-opacity bg-white/90 sm:absolute sm:right-0 sm:top-[-8px] sm:py-1 sm:px-1 rounded-md">
                                  <button onClick={() => startEdit(task)} title="Editar tarea" className="p-1 rounded-lg hover:bg-[#FAF4EA] text-accent/60 hover:text-accent transition-colors">
                                    <Pencil className="w-3 h-3" />
                                  </button>
                                  <button onClick={() => handleDelete(task.id)} title="Eliminar tarea" className="p-1 rounded-lg hover:bg-red-50 text-red-600/60 hover:text-red-700 transition-colors">
                                    <Trash2 className="w-3 h-3" />
                                  </button>
                                </div>
                              )}
                            </div>
                          </>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}