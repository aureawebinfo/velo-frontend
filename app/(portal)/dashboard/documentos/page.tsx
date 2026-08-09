"use client";

// ---------------------------------------------------------------------------
// M4 — Bóveda de Documentos (Integrado en Dashboard Unificado)
// ---------------------------------------------------------------------------

import { useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import {
  FileText,
  Image as ImageIcon,
  FileSpreadsheet,
  File,
  Download,
  Eye,
  Upload,
  Search,
  X,
  RefreshCw,
  FolderOpen,
  AlertTriangle,
  CheckCircle2,
  Loader2,
  Trash2,
} from "lucide-react";
import { cn } from "@/lib/cn"; // Helper estándar de Tailwind

// ---------------------------------------------------------------------------
// Tipos e Interfaces (Se mantienen igual)
// ---------------------------------------------------------------------------
interface Documento {
  id: string;
  name: string;
  fileUrl?: string;
  extension?: string;
  size?: string;
  createdAt?: string;
}

type VistaEstado = "cargando" | "vacio" | "error" | "listo";
type GrupoKey = "todos" | "pdf" | "imagenes" | "hojas";

interface InfoExtension {
  icon: ReactNode;
  bg: string;
  fg: string;
  label: string;
}

// ---------------------------------------------------------------------------
// Configuración y Helpers (Adaptados al diseño unificado)
// ---------------------------------------------------------------------------
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10 MB
const API_URL = process.env.NEXT_PUBLIC_API_URL || "";

// Helpers de auth (localStorage)
function getAccessToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("accessToken");
}

function getSelectedEventId(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("selectedEventId");
}

const GROUPS: Record<GrupoKey, { label: string; match: (ext: string) => boolean }> = {
  todos: { label: "Todos", match: () => true },
  pdf: { label: "PDF", match: (ext) => ext === "pdf" },
  imagenes: { label: "Imágenes", match: (ext) => ["png", "jpg", "jpeg", "gif", "webp", "svg"].includes(ext) },
  hojas: { label: "Hojas de cálculo", match: (ext) => ["xlsx", "xls", "csv"].includes(ext) },
};

// Mapeo de iconos y colores (Adaptados a paleta clara satinada)
function infoPorExtension(ext?: string): InfoExtension {
  const base = (ext || "").toLowerCase();
  switch (base) {
    case "pdf":
      return { icon: <FileText size={20} />, bg: "bg-red-50", fg: "text-red-600", label: "PDF" };
    case "png":
    case "jpg":
    case "jpeg":
    case "gif":
    case "webp":
    case "svg":
      return { icon: <ImageIcon size={20} />, bg: "bg-emerald-50", fg: "text-emerald-700", label: base.toUpperCase() };
    case "xlsx":
    case "xls":
    case "csv":
      return { icon: <FileSpreadsheet size={20} />, bg: "bg-amber-50", fg: "text-amber-700", label: base.toUpperCase() };
    default:
      return { icon: <File size={20} />, bg: "bg-stone-50", fg: "text-stone-600", label: (base || "ARCH").toUpperCase() };
  }
}

function formatearFecha(iso?: string): string | null {
  if (!iso) return null;
  return new Date(iso).toLocaleDateString("es-CO", { day: "numeric", month: "short", year: "numeric" });
}

function formatearTamano(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

// ---------------------------------------------------------------------------
// Skeleton de carga (Refactorizado con estilo unificado claro)
// ---------------------------------------------------------------------------
function SkeletonGrid() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4" aria-hidden="true">
      {Array.from({ length: 8 }).map((_, i) => (
        <div
          key={i}
          className="rounded-2xl p-5 bg-white border border-[#E8E2D5] animate-pulse"
        >
          <div className="w-11 h-11 rounded-xl mb-4 bg-[#F5F2EB]" />
          <div className="h-4 rounded w-3/4 mb-3 bg-[#F5F2EB]" />
          <div className="h-3 rounded w-1/2 bg-[#F5F2EB]" />
        </div>
      ))}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Tarjeta de documento (Refactorizada con Tailwind y estilo unificado claro)
// ---------------------------------------------------------------------------
interface TarjetaDocumentoProps {
  doc: Documento;
  onPreview: (doc: Documento) => void;
  onDownload: (doc: Documento) => void;
  onDelete: (doc: Documento) => void;
}

function TarjetaDocumento({ doc, onPreview, onDownload, onDelete }: TarjetaDocumentoProps) {
  const { icon, bg, fg, label } = infoPorExtension(doc.extension);
  const fecha = formatearFecha(doc.createdAt);

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={() => onPreview(doc)}
      onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && onPreview(doc)}
      aria-label={`Abrir ${doc.name}`}
      className="group relative rounded-2xl p-5 text-left transition-all duration-200
                 hover:-translate-y-0.5 hover:shadow-lg cursor-pointer bg-white border border-[#E8E2D5]"
    >
      {/* ---- Botón eliminar (solo visible al hover) ---- */}
      <button
        onClick={(e) => { e.stopPropagation(); onDelete(doc); }}
        aria-label={`Eliminar ${doc.name}`}
        className="absolute top-3 right-3 p-2 rounded-lg opacity-0 group-hover:opacity-100
                   transition-opacity duration-200 hover:bg-red-50 text-red-500 z-10"
        title="Eliminar documento"
      >
        <Trash2 size={16} />
      </button>

      <div className="flex items-start justify-between mb-4">
        <div className={cn("w-11 h-11 rounded-xl flex items-center justify-center", bg, fg)}>
          {icon}
        </div>
        <span
          className={cn("text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-md", bg, fg)}
        >
          {label}
        </span>
      </div>

      <h4 className="text-[14px] font-semibold leading-snug mb-1.5 line-clamp-2 text-[#1F1C19]" title={doc.name}>
        {doc.name}
      </h4>

      <div className="flex items-center gap-2 mb-4">
        {doc.size && <span className="text-xs text-[#7A7167]">{doc.size}</span>}
        {doc.size && fecha && <span className="text-[#D9D1C5]">·</span>}
        {fecha && <span className="text-xs text-[#7A7167]">{fecha}</span>}
      </div>

      <div className="flex items-center gap-2 pt-3 border-t border-[#F0EBE1]">
        <button
          onClick={(e) => { e.stopPropagation(); onPreview(doc); }}
          aria-label={`Ver ${doc.name}`}
          className="flex-1 inline-flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-semibold tracking-wide transition-colors bg-[#FAF4EA] text-accent hover:bg-[#F2E8D9]"
        >
          <Eye size={13} /> Ver
        </button>
        <button
          onClick={(e) => { e.stopPropagation(); onDownload(doc); }}
          aria-label={`Descargar ${doc.name}`}
          className="flex-1 inline-flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-semibold tracking-wide transition-colors bg-[#FAF4EA] text-accent hover:bg-[#F2E8D9]"
        >
          <Download size={13} /> Descargar
        </button>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Modal de confirmación para eliminar (Refactorizado con estilo claro Áurea)
// ---------------------------------------------------------------------------
interface ModalConfirmacionProps {
  doc: Documento | null;
  onCancelar: () => void;
  onConfirmar: () => void;
  eliminando: boolean;
}

function ModalConfirmacion({ doc, onCancelar, onConfirmar, eliminando }: ModalConfirmacionProps) {
  if (!doc) return null;

  const { icon, bg, fg } = infoPorExtension(doc.extension);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center px-4 backdrop-blur-sm bg-black/40"
      onClick={onCancelar}
    >
      <div
        className="w-full max-w-md rounded-3xl p-8 shadow-2xl bg-white border border-[#E8E2D5]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* ---- Icono de advertencia ---- */}
        <div className="flex justify-center mb-6">
          <div className="w-16 h-16 rounded-2xl flex items-center justify-center bg-red-50 text-red-500 border border-red-100">
            <Trash2 size={28} />
          </div>
        </div>

        {/* ---- Texto ---- */}
        <h3 className="text-lg font-bold text-center mb-2 text-[#1F1C19]">
          ¿Eliminar este documento?
        </h3>
        <p className="text-sm text-center mb-6 text-[#7A7167]">
          Esta acción no se puede deshacer. Se eliminará permanentemente:
        </p>

        {/* ---- Ficha del documento a eliminar ---- */}
        <div className="flex items-center gap-3 p-3 rounded-xl mb-8 bg-[#FAF8F5] border border-[#F0EBE1]">
          <div className={cn("w-10 h-10 rounded-lg flex items-center justify-center shrink-0", bg, fg)}>
            {icon}
          </div>
          <div className="min-w-0">
            <p className="text-sm font-semibold truncate text-[#1F1C19]">{doc.name}</p>
            <p className="text-xs text-[#7A7167]">
              {doc.size && `${doc.size} · `}{formatearFecha(doc.createdAt)}
            </p>
          </div>
        </div>

        {/* ---- Botones ---- */}
        <div className="flex gap-3">
          <button
            onClick={onCancelar}
            disabled={eliminando}
            className="flex-1 py-2.5 rounded-xl text-sm font-semibold transition-colors bg-[#FAF4EA] text-accent hover:bg-[#F2E8D9] disabled:opacity-50"
          >
            Cancelar
          </button>
          <button
            onClick={onConfirmar}
            disabled={eliminando}
            className="flex-1 inline-flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold tracking-wide
                       transition-all hover:brightness-110 active:scale-95 bg-red-600 text-white disabled:opacity-50 shadow-sm"
          >
            {eliminando ? (
              <>
                <Loader2 size={15} className="animate-spin" />
                Eliminando…
              </>
            ) : (
              <>
                <Trash2 size={15} />
                Sí, eliminar
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Toast / mensaje de notificación (Refactorizado con estilo unificado claro)
// ---------------------------------------------------------------------------
interface ToastProps {
  tipo: "exito" | "error";
  mensaje: string;
  onClose: () => void;
}

function ToastNotificacion({ tipo, mensaje, onClose }: ToastProps) {
  const esExito = tipo === "exito";

  return (
    <div
      className={cn(
        "fixed top-6 right-6 z-50 flex items-start gap-3 px-5 py-4 rounded-2xl shadow-2xl max-w-sm animate-fade-in-right",
        esExito ? "bg-[#FAF4EA] border border-accent/20" : "bg-red-50 border border-red-100"
      )}
    >
      <div className="shrink-0 mt-0.5">
        {esExito ? (
          <CheckCircle2 size={20} className="text-accent" />
        ) : (
          <AlertTriangle size={20} className="text-red-500" />
        )}
      </div>
      <div className="flex-1 min-w-0">
        <p className={cn("text-sm font-semibold", esExito ? "text-accent" : "text-red-600")}>
          {esExito ? "¡Listo!" : "Error"}
        </p>
        <p className="text-xs mt-0.5 text-[#2C2723]/70">
          {mensaje}
        </p>
      </div>
      <button onClick={onClose} className="text-[#B3ABA0] hover:text-[#5C5349]">
        <X size={16} />
      </button>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Componente Principal: Bóveda de Documentos Unificada
// ---------------------------------------------------------------------------
export default function DocumentosPageUnificada() {
  const [vista, setVista] = useState<VistaEstado>("cargando");
  const [documentos, setDocumentos] = useState<Documento[]>([]);
  const [busqueda, setBusqueda] = useState("");
  const [grupoActivo, setGrupoActivo] = useState<GrupoKey>("todos");

  // ---- Estados de upload ----
  const [isDragging, setIsDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [uploadExito, setUploadExito] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // ---- Estados de eliminación ----
  const [docAEliminar, setDocAEliminar] = useState<Documento | null>(null);
  const [eliminando, setEliminando] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const [deleteExito, setDeleteExito] = useState<string | null>(null);

  // ---- Carga inicial ----
  useEffect(() => {
    const token = getAccessToken();
    const eventId = getSelectedEventId();
    if (!token || !eventId) { setVista("error"); return; }

    let cancelado = false;
    fetch(`${API_URL}/events/${eventId}/documents`, {
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data: Documento[]) => { 
        if (!cancelado) { 
          setDocumentos(Array.isArray(data) ? data : []); 
          setVista(Array.isArray(data) && data.length > 0 ? "listo" : "vacio"); 
        } 
      })
      .catch(() => { if (!cancelado) setVista("error"); });

    return () => { cancelado = true; };
  }, []);

  // ---- Filtrado ----
  const documentosFiltrados = useMemo(() => {
    return documentos
      .filter((d) => GROUPS[grupoActivo].match((d.extension || "").toLowerCase()))
      .filter((d) => d.name.toLowerCase().includes(busqueda.toLowerCase()));
  }, [documentos, grupoActivo, busqueda]);

  // ---- Handlers de tarjetas ----
  const handlePreview = (doc: Documento) => {
    if (doc.fileUrl) window.open(doc.fileUrl, "_blank");
  };
  const handleDownload = (doc: Documento) => {
    if (doc.fileUrl) {
      const a = document.createElement("a");
      a.href = doc.fileUrl;
      a.download = doc.name;
      a.click();
    }
  };

  // ---- Control de Borrado (Tarea #3) ----
  const handleDelete = (doc: Documento) => {
    setDocAEliminar(doc);
  };

  const handleConfirmarEliminar = async () => {
    if (!docAEliminar) return;
    setEliminando(true);

    try {
      const token = getAccessToken();
      const eventId = getSelectedEventId();
      if (!token || !eventId) throw new Error("No hay sesión activa.");

      const res = await fetch(`${API_URL}/events/${eventId}/documents/${docAEliminar.id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) throw new Error(`Error del servidor (${res.status})`);

      setDocumentos((prev) => {
        const nuevos = prev.filter((d) => d.id !== docAEliminar.id);
        if (nuevos.length === 0) setVista("vacio");
        return nuevos;
      });

      setDeleteExito(`"${docAEliminar.name}" eliminado.`);
      setDocAEliminar(null);
    } catch (err: any) {
      setDeleteError(err.message || "Error al eliminar.");
    } finally {
      setEliminando(false);
    }
  };

  // ---- Cargador Multimedia Interactivo (Tarea #2) ----
  const handleAbrirSelector = () => { fileInputRef.current?.click(); };

  const procesarArchivos = async (files: FileList | File[]) => {
    const archivos = Array.from(files);
    if (archivos.length === 0) return;
    const archivo = archivos[0];

    if (archivo.size > MAX_FILE_SIZE) {
      setUploadError(`"${archivo.name}" supera los 10 MB.`);
      return;
    }

    setUploading(true);
    setUploadError(null);

    try {
      const token = getAccessToken();
      const eventId = getSelectedEventId();
      if (!token || !eventId) throw new Error("No hay sesión activa.");

      const formData = new FormData();
      formData.append("file", archivo);
      formData.append("name", archivo.name);

      const res = await fetch(`${API_URL}/events/${eventId}/documents`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });

      if (!res.ok) throw new Error(`Error del servidor (${res.status})`);

      const refreshRes = await fetch(`${API_URL}/events/${eventId}/documents`, {
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      });

      if (refreshRes.ok) {
        const data: Documento[] = await refreshRes.json();
        setDocumentos(data);
        setVista(data.length > 0 ? "listo" : "vacio");
      }
      setUploadExito(`"${archivo.name}" subido.`);
    } catch (err: any) {
      setUploadError(err.message || "Error al subir.");
    } finally {
      setUploading(false);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) procesarArchivos(e.target.files);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  // Handlers: Drag & Drop (Tarea #2)
  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault(); e.stopPropagation();
    if (!uploading) setIsDragging(true);
  };
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault(); e.stopPropagation();
    if (!uploading) setIsDragging(true);
  };
  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault(); e.stopPropagation();
    if (e.currentTarget === e.target || !e.currentTarget.contains(e.relatedTarget as Node)) {
      setIsDragging(false);
    }
  };
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault(); e.stopPropagation();
    setIsDragging(false);
    if (uploading) return;
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) procesarArchivos(e.dataTransfer.files);
  };

  // Autoclose toasts
  useEffect(() => {
    if (uploadError) { const t = setTimeout(() => setUploadError(null), 5000); return () => clearTimeout(t); }
  }, [uploadError]);
  useEffect(() => {
    if (uploadExito) { const t = setTimeout(() => setUploadExito(null), 4000); return () => clearTimeout(t); }
  }, [uploadExito]);
  useEffect(() => {
    if (deleteError) { const t = setTimeout(() => setDeleteError(null), 5000); return () => clearTimeout(t); }
  }, [deleteError]);
  useEffect(() => {
    if (deleteExito) { const t = setTimeout(() => setDeleteExito(null), 4000); return () => clearTimeout(t); }
  }, [deleteExito]);

  // ===================================================================
  // RENDER (Refactorizado para integrarse como sección)
  // ===================================================================
  return (
    <div
      className="rounded-2xl border border-[#E8E2D5] bg-white shadow-xs overflow-hidden flex flex-col h-[700px] relative"
      onDragEnter={handleDragEnter}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      {/* ---- DROP OVERLAY (Tarea #2) ---- */}
      {isDragging && (
        <div className="absolute inset-0 z-40 flex items-center justify-center backdrop-blur-sm bg-white/60">
          <div className="flex flex-col items-center gap-4 px-10 py-14 rounded-3xl border-4 border-dashed bg-white border-accent/40 shadow-2xl">
            <div className="w-16 h-16 rounded-2xl flex items-center justify-center bg-[#FAF4EA] text-accent border border-[#E8E2D5]">
              <Upload size={32} />
            </div>
            <p className="text-lg font-bold text-[#1F1C19]">Suelta tu archivo aquí</p>
            <p className="text-xs text-[#7A7167]">PDF, imágenes o Excel · Máx. 10 MB</p>
          </div>
        </div>
      )}

      {/* ---- MODAL DE ELIMINAR (Tarea #3) ---- */}
      {docAEliminar && (
        <ModalConfirmacion
          doc={docAEliminar}
          onCancelar={() => { if (!eliminando) setDocAEliminar(null); }}
          onConfirmar={handleConfirmarEliminar}
          eliminando={eliminando}
        />
      )}

      {/* ---- TOASTS (Cambiados a estilo claro) ---- */}
      {uploadError && <ToastNotificacion tipo="error" mensaje={uploadError} onClose={() => setUploadError(null)} />}
      {uploadExito && <ToastNotificacion tipo="exito" mensaje={uploadExito} onClose={() => setUploadExito(null)} />}
      {deleteError && <ToastNotificacion tipo="error" mensaje={deleteError} onClose={() => setDeleteError(null)} />}
      {deleteExito && <ToastNotificacion tipo="exito" mensaje={deleteExito} onClose={() => setDeleteExito(null)} />}

      {/* ---- INPUT FILE OCULTO ---- */}
      <input ref={fileInputRef} type="file" accept=".pdf,.png,.jpg,.jpeg,.gif,.webp,.svg,.xlsx,.xls,.csv" onChange={handleFileInputChange} className="hidden" aria-hidden="true" />

      {/* ---------- CABECERA DE LA SECCIÓN (Estilo Unificado) ---------- */}
      <header className="shrink-0 px-5 py-4 border-b border-[#F0EBE1] bg-[#FAF8F5] flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full flex items-center justify-center bg-[#FAF4EA] text-accent border border-[#E8E2D5]">
            <FolderOpen size={18} />
          </div>
          <div>
            <h2 className="text-sm font-bold tracking-tight text-[#1F1C19]">Bóveda de Documentos</h2>
            <p className="text-[11px] text-[#7A7167]">Contratos, cotizaciones y planos de tu boda.</p>
          </div>
        </div>
        <button
          onClick={handleAbrirSelector}
          disabled={uploading}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold tracking-wide
                     transition-all hover:brightness-110 active:scale-95
                     disabled:opacity-40 disabled:cursor-not-allowed bg-accent text-white shadow-sm"
        >
          {uploading ? <Loader2 size={15} className="animate-spin" /> : <Upload size={15} />}
          {uploading ? "Subiendo…" : "Subir documento"}
        </button>
      </header>

      {/* ---------- BARRA DE BÚSQUEDA Y FILTROS (Adaptada) ---------- */}
      {(vista === "listo" || vista === "vacio") && documentos.length > 0 && (
        <div className="shrink-0 px-5 py-3 border-b border-[#F0EBE1] bg-white flex flex-col sm:flex-row sm:items-center gap-3">
          <div className="relative flex-1 max-w-sm">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#B3ABA0]" />
            <input
              type="text"
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              placeholder="Buscar por nombre…"
              className="w-full pl-9 pr-8 py-2 rounded-lg text-xs border border-[#D9D1C5] bg-white text-[#2C2723] placeholder-[#A89F95] focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent"
            />
            {busqueda && (
              <button onClick={() => setBusqueda("")} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#B3ABA0] hover:text-[#5C5349]">
                <X size={14} />
              </button>
            )}
          </div>

          <div className="flex items-center gap-1.5 flex-wrap" role="tablist">
            {(Object.entries(GROUPS) as [GrupoKey, (typeof GROUPS)[GrupoKey]][]).map(([key, g]) => {
              const activo = grupoActivo === key;
              return (
                <button
                  key={key} role="tab" aria-selected={activo} onClick={() => setGrupoActivo(key)}
                  className={cn(
                    "px-3.5 py-1.5 rounded-lg text-xs font-semibold tracking-wide transition-colors",
                    activo ? "bg-accent text-white shadow-sm" : "bg-[#FAF4EA] text-accent hover:bg-[#F2E8D9]"
                  )}
                >
                  {g.label}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* ---------- CONTENIDO (Scroll Interno) ---------- */}
      <main className="flex-1 overflow-y-auto px-5 py-6 bg-white">
        {vista === "cargando" && <SkeletonGrid />}

        {vista === "error" && (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-4 bg-red-50 border border-red-100">
              <File size={24} className="text-red-500" />
            </div>
            <h3 className="text-sm font-semibold mb-1 text-[#1F1C19]">No pudimos cargar tus documentos</h3>
            <p className="text-xs mb-5 max-w-xs text-[#7A7167]">Revisa tu conexión e inténtalo de nuevo.</p>
            <button onClick={() => setVista("listo")} className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold bg-accent text-white transition-all hover:bg-accent/90">
              <RefreshCw size={14} /> Reintentar
            </button>
          </div>
        )}

        {vista === "vacio" && (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="w-16 h-16 rounded-3xl flex items-center justify-center mb-5 bg-[#FAF4EA] border border-[#E8E2D5]">
              <FolderOpen size={28} className="text-accent" />
            </div>
            <h3 className="text-sm font-semibold mb-1 text-[#1F1C19]">Aún no tienes documentos</h3>
            <p className="text-xs mb-5 max-w-xs text-[#7A7167]">Sube tu primer archivo — un contrato o una cotización — para empezar.</p>
            <button onClick={handleAbrirSelector} disabled={uploading} className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold bg-accent text-white transition-all hover:bg-accent/90 shadow-sm">
              {uploading ? <Loader2 size={15} className="animate-spin" /> : <Upload size={15} />}
              {uploading ? "Subiendo…" : "Subir mi primer documento"}
            </button>
          </div>
        )}

        {vista === "listo" && documentos.length > 0 && (
          documentosFiltrados.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 pb-2">
              {documentosFiltrados.map((doc) => (
                <TarjetaDocumento key={doc.id} doc={doc} onPreview={handlePreview} onDownload={handleDownload} onDelete={handleDelete} />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <p className="text-xs text-[#7A7167]">Ningún archivo coincide con tu búsqueda.</p>
              <button onClick={() => { setBusqueda(""); setGrupoActivo("todos"); }} className="mt-2 text-xs font-semibold text-accent underline hover:text-accent/90">
                Quitar filtros
              </button>
            </div>
          )
        )}
      </main>
    </div>
  );
}