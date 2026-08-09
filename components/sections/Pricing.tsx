"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Check, X, CreditCard, ChevronRight, Sparkles } from "lucide-react";
import type { SectionProps } from "@/types";
import { cn } from "@/lib/cn";

type Billing = "monthly" | "yearly";

type Plan = {
  name: string;
  monthly: number;
  yearly: number;
  period: string;
  featured?: boolean;
  ctaLabel: string;
  features: string[];
};

const plans: Plan[] = [
  {
    name: "Esencial",
    monthly: 49,
    yearly: 39,
    period: "por evento / mes",
    ctaLabel: "Elegir plan",
    features: [
      "Hasta 20 eventos activos",
      "1 usuario administrador",
      "Gestión de pagos y documentos",
      "Soporte por email",
    ],
  },
  {
    name: "Profesional",
    monthly: 99,
    yearly: 79,
    period: "por evento / mes",
    featured: true,
    ctaLabel: "Elegir plan",
    features: [
      "Eventos ilimitados",
      "Hasta 5 usuarios",
      "Marca personalizada por evento",
      "Mensajería centralizada",
      "Soporte prioritario",
    ],
  },
  {
    name: "Premium",
    monthly: 199,
    yearly: 159,
    period: "por evento / mes",
    ctaLabel: "Elegir plan",
    features: [
      "Todo de Profesional",
      "Usuarios ilimitados",
      "Onboarding personalizado",
      "API e integraciones",
      "Gerente de cuenta dedicado",
    ],
  },
];

export default function Pricing({ className }: SectionProps) {
  const [billing, setBilling] = useState<Billing>("monthly");
  const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null);
  const [dates, setDates] = useState({ today: "", next: "" });

  // Calcular fechas dinámicamente para el modal
  useEffect(() => {
    if (selectedPlan) {
      const today = new Date();
      const nextDate = new Date(today);
      if (billing === "monthly") {
        nextDate.setMonth(nextDate.getMonth() + 1);
      } else {
        nextDate.setFullYear(nextDate.getFullYear() + 1);
      }
      
      const formatter = new Intl.DateTimeFormat('es-CO', { day: 'numeric', month: 'short', year: 'numeric' });
      setDates({
        today: formatter.format(today),
        next: formatter.format(nextDate)
      });
    }
  }, [selectedPlan, billing]);

  return (
    <section
      id="pricing"   
      className={cn("relative w-full overflow-hidden px-6 py-24 text-foreground md:py-32", className)}
    >
      <span id="integraciones" className="pointer-events-none absolute -top-24" aria-hidden="true" />

      <div aria-hidden className="pointer-events-none absolute inset-0">
        <Image
          src="/images/Pricing1.png"
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover object-center"
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(to bottom, rgba(11,11,10,0.35) 0%, rgba(11,11,10,0.55) 55%, rgba(11,11,10,0.85) 100%), radial-gradient(ellipse 55% 40% at 50% 0%, rgba(201,169,106,0.18), transparent 70%)",
          }}
        />
      </div>

      <div className="relative mx-auto max-w-6xl">
        <div className="mb-14 flex flex-col items-center gap-6 text-center">
          <span aria-hidden className="block h-px w-12 bg-accent" />
          <h2 className="text-3xl font-medium leading-tight tracking-tight md:text-5xl">
            Planes para tu negocio
          </h2>

          <div className="relative mt-2 inline-flex items-center rounded-full border border-border bg-white p-1 text-sm font-medium">
            <span
              aria-hidden
              className={cn(
                "absolute top-1 bottom-1 left-1 w-[calc(50%-4px)] rounded-full bg-accent transition-transform duration-200 ease-out",
                billing === "yearly" ? "translate-x-full" : "translate-x-0"
              )}
            />
            <button
              type="button"
              onClick={() => setBilling("monthly")}
              className={cn(
                "relative z-10 flex-1 px-5 py-2 transition-colors",
                billing === "monthly" ? "text-text" : "text-textSecondary"
              )}
            >
              Mensual
            </button>
            <button
              type="button"
              onClick={() => setBilling("yearly")}
              className={cn(
                "relative z-10 flex items-center justify-center gap-2 px-5 py-2 transition-colors",
                billing === "yearly" ? "text-text" : "text-textSecondary"
              )}
            >
              <span>Anual</span>
              <span
                className={cn(
                  "rounded-full px-1.5 py-0.5 text-[10px] font-medium uppercase tracking-wider transition-colors",
                  billing === "yearly"
                    ? "bg-text/10 text-text"
                    : "bg-accent/15 text-accent"
                )}
              >
                −20%
              </span>
            </button>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {plans.map((plan) => {
            const price = billing === "monthly" ? plan.monthly : plan.yearly;
            return (
              <div
                key={plan.name}
                className={cn(
                  "group relative flex flex-col rounded-lg border bg-white/80 backdrop-blur-sm p-8 text-text transition-all duration-300 ease-out",
                  "hover:-translate-y-1 hover:border-accent/50",
                  plan.featured ? "border-2 border-accent" : "border-border"
                )}
              >
                {plan.featured && (
                  <span
                    aria-hidden
                    className="absolute inset-x-0 top-0 h-[3px] rounded-t-lg bg-accent"
                  />
                )}

                {plan.featured && (
                  <span className="absolute left-1/2 top-0 z-10 -translate-x-1/2 -translate-y-full rounded-full bg-accent px-3 py-1 text-xs font-medium uppercase tracking-widest text-text">
                    Más popular
                  </span>
                )}

                <h3 className="text-lg font-medium">{plan.name}</h3>

                <div className="mt-4 flex items-baseline gap-2">
                  <span className="text-4xl font-medium tracking-tight">
                    ${price}
                  </span>
                  <span className="text-sm text-textSecondary">USD</span>
                </div>
                <p className="mt-1 text-sm text-textSecondary">{plan.period}</p>

                <ul className="mt-8 flex flex-col gap-3 text-sm">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-3">
                      <Check
                        className="mt-0.5 h-4 w-4 flex-shrink-0 text-accent"
                        strokeWidth={1.5}
                      />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>

                <div className="mt-10">
                  <button
                    onClick={() => setSelectedPlan(plan)}
                    className={cn(
                      "inline-flex w-full items-center justify-center rounded px-6 py-3 text-sm font-medium tracking-wide transition-colors duration-300",
                      plan.featured
                        ? "bg-accent text-text hover:opacity-90 group-hover:ring-4 group-hover:ring-accent/60 group-hover:ring-offset-2 group-hover:ring-offset-white"
                        : "border border-accent text-accent bg-transparent hover:bg-accent/10 hover:text-text group-hover:bg-accent group-hover:text-text group-hover:border-accent"
                    )}
                  >
                    {plan.ctaLabel}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ================= MODAL DE PAGO (Estilo Play Store) ================= */}
      {selectedPlan && (
        <div 
          className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 p-0 backdrop-blur-sm sm:items-center sm:p-4 animate-in fade-in duration-200"
          onClick={() => setSelectedPlan(null)} // Cierra el modal al hacer clic afuera
        >
          <div 
            className="relative flex w-full max-w-[420px] flex-col overflow-hidden bg-white text-slate-900 shadow-2xl max-h-[95vh] rounded-t-2xl sm:max-h-[90vh] sm:rounded-xl animate-in slide-in-from-bottom-full sm:slide-in-from-bottom-4 sm:zoom-in-95 duration-300"
            onClick={(e) => e.stopPropagation()} // Evita que se cierre al hacer clic adentro
          >
            {/* Header (Fijo arriba) */}
            <div className="flex shrink-0 items-center justify-between border-b border-slate-100 px-6 py-4">
              <span className="text-sm font-medium text-slate-600">Portal Novios</span>
              <button 
                onClick={() => setSelectedPlan(null)}
                className="rounded-full p-1 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Contenido (Habilitado para hacer scroll si la pantalla es pequeña) */}
            <div className="flex-1 overflow-y-auto p-6">
              {/* Info del Plan */}
              <div className="mb-8 flex items-center gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-accent/10 text-accent">
                  <Sparkles className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="text-base font-semibold leading-none">
                    Plan {selectedPlan.name} ({billing === "monthly" ? "Mensual" : "Anual"})
                  </h3>
                  <p className="mt-1 text-sm text-slate-500">Suscripción comercial</p>
                </div>
              </div>

              <h4 className="mb-5 text-[17px] font-medium">Próximos pagos</h4>

              {/* Timeline de Pagos */}
              <div className="relative mb-8 ml-2 space-y-6 border-l-[1.5px] border-blue-600">
                {/* Hoy */}
                <div className="relative pl-6">
                  <div className="absolute -left-[5.5px] top-1.5 h-[9px] w-[9px] rounded-full border-[2px] border-blue-600 bg-white" />
                  <div className="flex items-start justify-between">
                    <span className="mt-0.5 text-sm text-slate-700">Empieza: hoy</span>
                    <div className="text-right">
                      <div className="text-sm font-medium">
                        $ {billing === "monthly" ? selectedPlan.monthly : selectedPlan.yearly}.00/{billing === "monthly" ? "mes" : "año"}
                      </div>
                      <div className="text-[11px] text-slate-400">sin impuestos</div>
                    </div>
                  </div>
                </div>

                {/* Próximo cobro */}
                <div className="relative pl-6">
                  <div className="absolute -left-[5.5px] top-1.5 h-[9px] w-[9px] rounded-full border-[2px] border-blue-600 bg-white" />
                  <div className="flex items-start justify-between">
                    <span className="mt-0.5 text-sm text-slate-700">Empieza: {dates.next}</span>
                    <div className="text-right">
                      <div className="text-sm font-medium">
                        $ {billing === "monthly" ? selectedPlan.monthly : selectedPlan.yearly}.00/{billing === "monthly" ? "mes" : "año"}
                      </div>
                      <div className="text-[11px] text-slate-400">sin impuestos</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Políticas */}
              <div className="mb-6">
                <h4 className="mb-3 text-[17px] font-medium">Suscribirse en Portal Novios</h4>
                <ul className="list-disc space-y-2 pl-4 text-[13px] text-slate-600">
                  <li>Cancela en cualquier momento desde tu panel de configuración.</li>
                  <li>Te enviaremos un recordatorio 7 días antes de que se renueve tu suscripción.</li>
                </ul>
              </div>

              {/* Selector de Método de Pago */}
              <button className="flex w-full items-center justify-between rounded-lg border border-slate-200 p-3 transition-colors hover:bg-slate-50">
                <div className="flex items-center gap-3">
                  <div className="rounded bg-slate-800 p-1">
                    <CreditCard className="h-5 w-5 text-white" />
                  </div>
                  <span className="text-sm font-medium text-slate-700">Visa-5181</span>
                </div>
                <ChevronRight className="h-5 w-5 text-slate-400" />
              </button>
            </div>

            {/* Footer / CTA (Fijo abajo) */}
            <div className="shrink-0 rounded-b-xl border-t border-slate-100 bg-slate-50 p-4 pb-6 sm:pb-4 sm:flex sm:justify-end">
              <button 
                className="w-full sm:w-auto rounded-full bg-[#0b57d0] px-8 py-2.5 text-sm font-medium text-white shadow-sm transition-colors hover:bg-[#0842a0]"
                onClick={() => {
                  alert("Integrar pasarela de pago (Stripe/MercadoPago)");
                  setSelectedPlan(null);
                }}
              >
                Suscribirme
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}