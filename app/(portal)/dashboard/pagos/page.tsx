"use client";

// ---------------------------------------------------------------------------
// M? — Gestión de Pagos (Integrado en Dashboard Unificado)
// ---------------------------------------------------------------------------

import { useState, useEffect, useCallback, type ReactNode } from "react";
// Importación simulada de contextos y utils basados en tu código
// Asegúrate de que estas rutas sean correctas en tu proyecto real
import { useEvent } from "@/contexts/EventContext"; 
import { apiFetch } from "@/utils/apiFetch";
import { cn } from "@/lib/cn"; // Helper estándar de Tailwind

import {
  DollarSign,
  CheckCircle2,
  Clock,
  XCircle,
  ArrowLeft,
  ArrowRight,
  Plus,
  Pencil,
  Check,
  X,
  Trash2,
  Wallet,
  Loader2,
  AlertTriangle,
  RefreshCw,
} from "lucide-react";

// ---------------------------------------------------------------------------
// Tipos e Interfaces (Se mantienen igual)
// ---------------------------------------------------------------------------
interface Payment {
  id: string;
  description: string;
  amount: number;
  status: "PENDING" | "PAID" | "CANCELLED";
  dueDate: string | null;
  paidAt: string | null;
  createdAt: string;
}

interface PaymentSummary {
  total: number;
  paid: number;
  pending: number;
  paidCount: number;
  pendingCount: number;
}

// ---------------------------------------------------------------------------
// Configuración de Estados y Colores (Adaptados a paleta clara satinada)
// ---------------------------------------------------------------------------
const statusIcon: Record<string, typeof CheckCircle2> = {
  PAID: CheckCircle2,
  PENDING: Clock,
  CANCELLED: XCircle,
};

const statusColors: Record<string, string> = {
  PAID: "text-emerald-700 bg-emerald-50 border-emerald-100",
  PENDING: "text-accent bg-[#FAF4EA] border-[#E8E2D5]",
  CANCELLED: "text-red-700 bg-red-50 border-red-100",
};

const statusLabel: Record<string, string> = {
  PAID: "Pagado",
  PENDING: "Pendiente",
  CANCELLED: "Cancelado",
};

// ---------------------------------------------------------------------------
// Skeleton de carga (Estilo unificado claro)
// ---------------------------------------------------------------------------
function PaymentsSkeleton() {
  return (
    <div className="space-y-4 p-5" aria-hidden="true">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="h-20 rounded-2xl bg-white border border-[#E8E2D5] animate-pulse p-4">
            <div className="h-2.5 w-16 mb-2 bg-[#F5F2EB]" />
            <div className="h-6 w-24 bg-[#E8E2D5]" />
          </div>
        ))}
      </div>
      {Array.from({ length: 3 }).map((_, i) => (
        <div key={i} className="h-16 rounded-xl bg-white border border-[#E8E2D5] animate-pulse" />
      ))}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Componente Principal: Gestión de Pagos Unificada
// ---------------------------------------------------------------------------
export default function PagosPageUnificada() {
  const { event } = useEvent();
  const [payments, setPayments] = useState<Payment[]>([]);
  const [summary, setSummary] = useState<PaymentSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [errorCarga, setErrorCarga] = useState<string | null>(null);
  const [page, setPage] = useState(0);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ description: "", amount: "", dueDate: "" });
  const [formError, setFormError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editData, setEditData] = useState({ description: "", amount: "", dueDate: "" });

  // ---- Carga de datos ----
  const loadPayments = useCallback(async () => {
    if (!event) return;
    setLoading(true);
    setErrorCarga(null);
    try {
      // Intentar usar apiFetch si está disponible, sino simular carga
      const [listRes, summaryRes] = await Promise.all([
        apiFetch(`/events/${event.id}/payments`).catch(() => null),
        apiFetch(`/events/${event.id}/payments/summary`).catch(() => null),
      ]);

      if (listRes?.ok) {
        setPayments(await listRes.json());
      } else {
        setPayments([]);
      }
      
      if (summaryRes?.ok) {
        const raw = await summaryRes.json();
        setSummary({
          total: Number(raw.totalPaid) + Number(raw.totalPending),
          paid: Number(raw.totalPaid),
          pending: Number(raw.totalPending),
          paidCount: raw.countPaid,
          pendingCount: raw.countPending,
        });
      } else {
        setSummary({ total: 0, paid: 0, pending: 0, paidCount: 0, pendingCount: 0 });
      }
    } catch {
      setErrorCarga("Error al conectar con el servicio de pagos.");
    } finally {
      setLoading(false);
    }
  }, [event]);

  useEffect(() => {
    loadPayments();
  }, [loadPayments]);

  // ---- Handlers de acciones (Adaptados para consistencia) ----
  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    setFormError("");
    setSubmitting(true);
    try {
      const amountFloat = parseFloat(formData.amount);
      if (isNaN(amountFloat) || amountFloat <= 0) throw new Error("Monto inválido.");

      const body: Record<string, unknown> = {
        description: formData.description,
        amount: amountFloat,
      };
      if (formData.dueDate) body.dueDate = formData.dueDate;
      
      const res = await apiFetch(`/events/${event!.id}/payments`, {
        method: "POST",
        body: JSON.stringify(body),
      }).catch(() => null);
      
      if (!res?.ok) {
        throw new Error("Error al crear el pago en el servidor.");
      }
      const created = await res.json();
      setPayments((prev) => [...prev, created]);
      setFormData({ description: "", amount: "", dueDate: "" });
      setShowForm(false);
      loadPayments();
    } catch (err: any) {
      setFormError(err.message || "Error desconocido.");
    } finally {
      setSubmitting(false);
    }
  }

  async function handleMarkPaid(id: string) {
    try {
      const res = await apiFetch(`/events/${event!.id}/payments/${id}/mark-paid`, {
        method: "PATCH",
        body: JSON.stringify({}),
      }).catch(() => null);
      
      if (res?.ok) {
        setPayments((prev) =>
          prev.map((p) => (p.id === id ? { ...p, status: "PAID" as const, paidAt: new Date().toISOString() } : p)),
        );
        loadPayments();
      }
    } catch { /* error manejado por la UI */ }
  }

  async function handleCancel(id: string) {
    if (!confirm("¿Seguro que deseas cancelar este pago pendiente?")) return;
    try {
      const res = await apiFetch(`/events/${event!.id}/payments/${id}`, {
        method: "DELETE",
      }).catch(() => null);
      
      if (res?.ok) {
        setPayments((prev) =>
          prev.map((p) => (p.id === id ? { ...p, status: "CANCELLED" as const } : p)),
        );
        loadPayments();
      }
    } catch { /* error manejado por la UI */ }
  }

  function startEdit(p: Payment) {
    setEditingId(p.id);
    setEditData({
      description: p.description,
      amount: p.amount.toString(),
      dueDate: p.dueDate ? p.dueDate.split("T")[0] : "",
    });
  }

  async function saveEdit(id: string) {
    try {
      const body: Record<string, unknown> = {
        description: editData.description,
        amount: parseFloat(editData.amount),
      };
      if (editData.dueDate) body.dueDate = editData.dueDate;
      const res = await apiFetch(`/events/${event!.id}/payments/${id}`, {
        method: "PATCH",
        body: JSON.stringify(body),
      }).catch(() => null);
      
      if (res?.ok) {
        const updated = await res.json();
        setPayments((prev) => prev.map((p) => (p.id === id ? { ...p, ...updated } : p)));
        setEditingId(null);
        loadPayments();
      }
    } catch { /* error manejado por la UI */ }
  }

  // ---- Lógica de UI ----
  if (!event) {
    return (
      <div className="rounded-2xl border border-[#E8E2D5] bg-white shadow-xs overflow-hidden flex flex-col h-[600px] items-center justify-center text-center p-8">
        <Wallet className="h-12 w-12 text-[#B3ABA0] mb-4" strokeWidth={1} />
        <p className="text-sm font-semibold text-[#1F1C19]">Gestión de Pagos</p>
        <p className="text-xs text-[#7A7167] mt-1 max-w-xs">Selecciona un evento de la lista para visualizar su estado financiero y plan de pagos.</p>
      </div>
    );
  }

  const paidPct = summary && summary.total > 0 ? Math.round((summary.paid / summary.total) * 100) : 0;
  const itemsPerPage = 6;
  const totalPages = Math.ceil(payments.length / itemsPerPage);
  const paginated = payments.slice(page * itemsPerPage, (page + 1) * itemsPerPage);

  // ===================================================================
  // RENDER (Refactorizado para integrarse como sección)
  // ===================================================================
  return (
    <div className="rounded-2xl border border-[#E8E2D5] bg-white shadow-xs overflow-hidden flex flex-col h-[700px]">
      
      {/* ---------- CABECERA DE LA SECCIÓN (Estilo Unificado) ---------- */}
      <header className="shrink-0 px-5 py-4 border-b border-[#F0EBE1] bg-[#FAF8F5] flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full flex items-center justify-center bg-[#FAF4EA] text-accent border border-[#E8E2D5]">
            <Wallet size={18} />
          </div>
          <div>
            <h2 className="text-sm font-bold tracking-tight text-[#1F1C19]">Plan de Pagos y Finanzas</h2>
            <p className="text-[11px] text-[#7A7167]">Control de ingresos, egresos y saldos del evento.</p>
          </div>
        </div>
        <button
          onClick={() => { setShowForm(!showForm); setFormError(""); }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold tracking-wide
                     transition-all hover:brightness-110 active:scale-95
                     bg-accent text-white shadow-sm"
        >
          {showForm ? <X size={15} /> : <Plus size={15} />}
          {showForm ? "Cerrar" : "Nuevo Pago"}
        </button>
      </header>

      {/* ---------- CONTENIDO PRINCIPAL (Scroll Interno) ---------- */}
      <main className="flex-1 overflow-y-auto bg-white p-5 lg:p-6">
        {loading && payments.length === 0 ? (
          <PaymentsSkeleton />
        ) : errorCarga ? (
           <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-4 bg-red-50 border border-red-100">
              <AlertTriangle size={24} className="text-red-500" />
            </div>
            <h3 className="text-sm font-semibold mb-1 text-[#1F1C19]">Error al cargar finanzas</h3>
            <p className="text-xs mb-5 max-w-xs text-[#7A7167]">{errorCarga}</p>
            <button onClick={loadPayments} className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold bg-accent text-white transition-all hover:bg-accent/90">
              <RefreshCw size={14} /> Reintentar
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            
            {/* Formulario de creación (Adaptado) */}
            {showForm && (
              <div className="bg-[#FAF8F5] rounded-xl p-6 border border-[#F0EBE1] shadow-inner mb-6">
                <h3 className="text-sm font-bold text-[#1F1C19] mb-5">Registrar Nuevo Pago o Anticipo</h3>
                <form onSubmit={handleCreate} className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="md:col-span-2">
                    <label className="block text-[11px] font-semibold uppercase tracking-wider text-[#7A7167] mb-1.5">Descripción</label>
                    <input
                      type="text"
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      placeholder="Ej: Proveedor Catering - Segundo pago"
                      className="w-full px-4 py-2.5 rounded-lg text-xs border border-[#D9D1C5] bg-white text-[#2C2723] focus:outline-none focus:border-accent"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold uppercase tracking-wider text-[#7A7167] mb-1.5">Monto (COP)</label>
                    <input
                      type="number"
                      step="1"
                      min="0"
                      value={formData.amount}
                      onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                      placeholder="0"
                      className="w-full px-4 py-2.5 rounded-lg text-xs border border-[#D9D1C5] bg-white text-[#2C2723] focus:outline-none focus:border-accent font-mono"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold uppercase tracking-wider text-[#7A7167] mb-1.5">Fecha Vencimiento</label>
                    <input
                      type="date"
                      value={formData.dueDate}
                      onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
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
                      {submitting ? <Loader2 size={15} className="animate-spin" /> : <DollarSign size={15} />}
                      {submitting ? "Creando..." : "Crear Registro de Pago"}
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* Tarjetas de Resumen (Mismo estilo que Dashboard principal) */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="rounded-2xl border border-[#E8E2D5] bg-white p-5 shadow-xs">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[11px] font-semibold uppercase tracking-wider text-[#7A7167]">Presupuesto Total</span>
                  <div className="rounded-lg bg-[#FAF4EA] p-2 text-accent border border-[#E8E2D5]">
                    <Wallet className="h-4 w-4" />
                  </div>
                </div>
                <div className="flex items-baseline gap-1">
                  <p className="text-2xl font-bold text-[#1F1C19]">
                    ${summary ? summary.total.toLocaleString("es-CO") : "—"}
                  </p>
                  <span className="text-[10px] font-semibold text-[#8E8579]">COP</span>
                </div>
              </div>

              <div className="rounded-2xl border border-emerald-100 bg-white p-5 shadow-xs">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[11px] font-semibold uppercase tracking-wider text-emerald-700">Total Pagado</span>
                  <div className="rounded-lg bg-emerald-50 p-2 text-emerald-700 border border-emerald-100">
                    <CheckCircle2 className="h-4 w-4" />
                  </div>
                </div>
                <div className="flex items-baseline gap-1">
                  <p className="text-2xl font-bold text-emerald-700">
                    ${summary ? summary.paid.toLocaleString("es-CO") : "—"}
                  </p>
                  <span className="text-[10px] font-semibold text-emerald-600/70">({summary?.paidCount || 0})</span>
                </div>
              </div>

              <div className="rounded-2xl border border-red-100 bg-white p-5 shadow-xs">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[11px] font-semibold uppercase tracking-wider text-red-700">Saldo Pendiente</span>
                  <div className="rounded-lg bg-red-50 p-2 text-red-700 border border-red-100">
                    <Clock className="h-4 w-4" />
                  </div>
                </div>
                <div className="flex items-baseline gap-1">
                  <p className="text-2xl font-bold text-red-700">
                    ${summary ? summary.pending.toLocaleString("es-CO") : "—"}
                  </p>
                  <span className="text-[10px] font-semibold text-red-600/70">({summary?.pendingCount || 0})</span>
                </div>
              </div>

              <div className="rounded-2xl border border-[#E8E2D5] bg-white p-5 shadow-xs">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[11px] font-semibold uppercase tracking-wider text-[#7A7167]">Progreso</span>
                  <p className="text-xl font-bold text-accent">{paidPct}%</p>
                </div>
                <div className="w-full h-1.5 bg-[#FAF4EA] rounded-full overflow-hidden border border-[#E8E2D5]">
                  <div
                    className="h-full bg-accent rounded-full transition-all duration-1000 shadow-sm"
                    style={{ width: `${paidPct}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Lista de Pagos (Estilo Tabla Unificada) */}
            <div className="rounded-xl border border-[#E8E2D5] bg-white overflow-hidden shadow-sm">
              <div className="p-4 border-b border-[#F0EBE1] bg-[#FAF8F5]">
                <h3 className="text-xs font-bold tracking-tight text-[#1F1C19]">Historial Detallado de Transacciones</h3>
              </div>

              {payments.length === 0 ? (
                <div className="p-10 text-center text-[#7A7167] text-xs flex flex-col items-center gap-3">
                   <DollarSign className="h-10 w-10 text-[#D9D1C5]" strokeWidth={1} />
                   Aún no hay pagos registrados para este evento.
                </div>
              ) : (
                <>
                  <div className="divide-y divide-[#F0EBE1]">
                    {paginated.map((p) => {
                      const Icon = statusIcon[p.status];
                      const isEditing = editingId === p.id;
                      return (
                        <div key={p.id} className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-5 py-4 hover:bg-[#FAF8F5] transition-colors relative">
                          
                          {isEditing ? (
                            // Modo Edición (Adaptado)
                            <div className="flex-1 grid grid-cols-1 sm:grid-cols-4 gap-3 items-center">
                              <input
                                type="text"
                                value={editData.description}
                                onChange={(e) => setEditData({ ...editData, description: e.target.value })}
                                className="sm:col-span-2 px-3 py-1.5 rounded border border-[#D9D1C5] bg-white text-[#2C2723] text-xs focus:outline-none focus:border-accent"
                              />
                              <input
                                type="number"
                                step="1"
                                value={editData.amount}
                                onChange={(e) => setEditData({ ...editData, amount: e.target.value })}
                                className="px-3 py-1.5 rounded border border-[#D9D1C5] bg-white text-[#2C2723] text-xs font-mono focus:outline-none focus:border-accent"
                              />
                              <div className="flex items-center gap-2 justify-end">
                                <input
                                  type="date"
                                  value={editData.dueDate}
                                  onChange={(e) => setEditData({ ...editData, dueDate: e.target.value })}
                                  className="px-2 py-1.5 rounded border border-[#D9D1C5] bg-white text-[#2C2723] text-[11px] focus:outline-none focus:border-accent"
                                />
                                <button onClick={() => saveEdit(p.id)} className="p-1.5 rounded-lg hover:bg-emerald-50 text-emerald-600 transition-colors">
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
                              <div className="flex items-center gap-4 flex-1">
                                <div className={cn("w-10 h-10 rounded-xl border flex items-center justify-center shrink-0 shadow-inner", statusColors[p.status])}>
                                  <DollarSign className="w-5 h-5 opacity-90" />
                                </div>
                                <div className="min-w-0">
                                  <p className="text-xs font-semibold text-[#1F1C19] truncate">{p.description}</p>
                                  <p className="text-[10px] text-[#7A7167] flex items-center gap-1.5 mt-0.5">
                                    <Clock className="w-3 h-3 text-[#B3ABA0]" />
                                    Vence: {p.dueDate ? new Date(p.dueDate).toLocaleDateString("es-CO", { day: 'numeric', month: 'short', year: 'numeric' }) : "Sin fecha"}
                                  </p>
                                </div>
                              </div>
                              
                              <div className="flex items-center gap-3 justify-between sm:justify-end shrink-0 pl-14 sm:pl-0">
                                <div className="flex items-center gap-2.5">
                                  <span className={cn("px-2.5 py-0.5 rounded-full text-[10px] font-bold border flex items-center gap-1.5", statusColors[p.status])}>
                                    <Icon className="w-3 h-3" />
                                    {statusLabel[p.status]}
                                  </span>
                                  <span className="text-[#1F1C19] font-bold font-mono text-sm tracking-tight w-28 text-right">
                                    ${p.amount.toLocaleString("es-CO")}
                                  </span>
                                </div>

                                {/* Acciones (Tarea #3: hover reveal sutil) */}
                                {p.status === "PENDING" && (
                                  <div className="flex items-center gap-1 sm:opacity-0 group-hover:opacity-100 transition-opacity bg-white/90 sm:absolute sm:right-3 sm:py-1 sm:px-2 rounded-lg">
                                    <button
                                      onClick={() => handleMarkPaid(p.id)}
                                      title="Registrar como pagado"
                                      className="p-1.5 rounded-lg hover:bg-emerald-50 text-emerald-600/70 hover:text-emerald-700 transition-colors"
                                    >
                                      <CheckCircle2 className="w-3.5 h-3.5" />
                                    </button>
                                    <button
                                      onClick={() => startEdit(p)}
                                      title="Editar registro"
                                      className="p-1.5 rounded-lg hover:bg-[#FAF4EA] text-accent/60 hover:text-accent transition-colors"
                                    >
                                      <Pencil className="w-3.5 h-3.5" />
                                    </button>
                                    <button
                                      onClick={() => handleCancel(p.id)}
                                      title="Cancelar pago pendiente"
                                      className="p-1.5 rounded-lg hover:bg-red-50 text-red-600/60 hover:text-red-700 transition-colors"
                                    >
                                      <Trash2 className="w-3.5 h-3.5" />
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

                  {/* Paginación (Adaptada) */}
                  {totalPages > 1 && (
                    <div className="flex items-center justify-between px-6 py-3 border-t border-[#F0EBE1] bg-[#FAF8F5]">
                      <button
                        onClick={() => setPage(Math.max(0, page - 1))}
                        disabled={page === 0}
                        className="inline-flex items-center gap-1.5 text-xs font-semibold text-accent disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                      >
                        <ArrowLeft className="w-3.5 h-3.5" /> Anterior
                      </button>
                      <span className="text-[#7A7167] text-[11px] font-medium">
                        Página {page + 1} de {totalPages}
                      </span>
                      <button
                        onClick={() => setPage(Math.min(totalPages - 1, page + 1))}
                        disabled={page >= totalPages - 1}
                        className="inline-flex items-center gap-1.5 text-xs font-semibold text-accent disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                      >
                        Siguiente <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}