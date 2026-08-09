import Link from "next/link";

export default function PortalHomePage() {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <div className="mx-auto flex min-h-screen max-w-6xl flex-col gap-10 px-6 py-16 sm:px-10">
        <div className="rounded-3xl border border-white/10 bg-[#0b0b0a]/80 p-10 shadow-[0_40px_120px_rgba(0,0,0,0.35)] backdrop-blur-xl">
          <p className="text-sm uppercase tracking-[0.3em] text-accent/70">
            Portal de novios
          </p>
          <h1 className="mt-4 text-4xl font-semibold leading-tight sm:text-5xl">
            Bienvenido al portal de gestión de bodas.
          </h1>
          <p className="mt-6 max-w-2xl text-base leading-relaxed text-textSecondary">
            Accede a tu dashboard, revisa el avance de pagos, tareas y documentos,
            y selecciona el evento que deseas gestionar.
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
            <Link
              href="/app/login"
              className="inline-flex items-center justify-center rounded-full bg-accent px-7 py-3 text-sm font-semibold uppercase tracking-[0.25em] text-background transition hover:bg-accent/90"
            >
              Iniciar sesión
            </Link>
            <Link
              href="/app/dashboard"
              className="inline-flex items-center justify-center rounded-full border border-white/15 bg-white/5 px-7 py-3 text-sm font-semibold uppercase tracking-[0.25em] text-foreground transition hover:border-accent"
            >
              Ir al dashboard
            </Link>
            <Link
              href="/app/select-event"
              className="inline-flex items-center justify-center rounded-full border border-white/15 bg-white/5 px-7 py-3 text-sm font-semibold uppercase tracking-[0.25em] text-foreground transition hover:border-accent"
            >
              Seleccionar evento
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
