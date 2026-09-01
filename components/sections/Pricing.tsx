"use client";
import { useState } from "react";
import Image from "next/image";
import { Check, X } from "lucide-react";
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
  // true/false para cada feature de FEATURE_LIST, en el mismo orden
  included: boolean[];
};

// Lista maestra de características — el orden define el orden de las filas
const FEATURE_LIST = [
  "Eventos activos",
  "Usuarios del equipo",
  "Gestión de pagos y documentos",
  "Marca personalizada por evento",
  "Mensajería centralizada",
  "Soporte prioritario",
  "Onboarding personalizado",
  "API e integraciones",
  "Gerente de cuenta dedicado",
] as const;

const plans: Plan[] = [
  {
    name: "Esencial",
    monthly: 49,
    yearly: 39,
    period: "por evento / mes",
    ctaLabel: "Elegir plan",
    //            Eventos  Usuarios  Pagos/docs  Marca  Msj  Soporte+  Onboarding  API  Gerente
    included: [true, true, true, false, false, false, false, false, false],
  },
  {
    name: "Profesional",
    monthly: 99,
    yearly: 79,
    period: "por evento / mes",
    featured: true,
    ctaLabel: "Elegir plan",
    included: [true, true, true, true, true, true, false, false, false],
  },
  {
    name: "Premium",
    monthly: 199,
    yearly: 159,
    period: "por evento / mes",
    ctaLabel: "Elegir plan",
    included: [true, true, true, true, true, true, true, true, true],
  },
];

const WHATSAPP_NUMBER = "573002477019";

function buildWhatsAppLink(planName: string, billing: Billing) {
  const modalidad = billing === "monthly" ? "mensual" : "anual";
  const message = `Hola, quiero contratar el plan ${planName} (${modalidad}) de Áurea.`;
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}

export default function Pricing({ className }: SectionProps) {
  const [billing, setBilling] = useState<Billing>("monthly");

  return (
    <section
      id="pricing"
      className={cn(
        "relative w-full overflow-hidden bg-white px-6 py-24 text-[#2b2625] md:py-32",
        className
      )}
    >
      <span id="integraciones" className="pointer-events-none absolute -top-24" aria-hidden="true" />
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <Image
          src="/images/Pricing.webp"
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover object-center opacity-80"
        />
      </div>
      <div className="pointer-events-none absolute inset-x-0 top-0 z-20 h-24 sm:h-32 bg-gradient-to-b from-white to-transparent" />

      <div className="relative mx-auto max-w-6xl z-10">
        <div className="mb-14 flex flex-col items-center gap-6 text-center">
          <span aria-hidden className="block h-px w-12 bg-accent" />
          <h2
            className="text-3xl font-medium leading-tight tracking-tight md:text-5xl drop-shadow-sm text-[#2b2625]"
            style={{ fontFamily: "var(--font-title-serif, 'Playfair Display', serif)" }}
          >
            Planes para tu negocio
          </h2>
          <div className="relative mt-2 inline-flex items-center rounded-full border border-border/50 bg-white/80 backdrop-blur-md p-1 text-sm font-medium shadow-sm">
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
                billing === "monthly" ? "text-white" : "text-textSecondary"
              )}
            >
              Mensual
            </button>
            <button
              type="button"
              onClick={() => setBilling("yearly")}
              className={cn(
                "relative z-10 flex items-center justify-center gap-2 px-5 py-2 transition-colors",
                billing === "yearly" ? "text-white" : "text-textSecondary"
              )}
            >
              <span>Anual</span>
              <span
                className={cn(
                  "rounded-full px-1.5 py-0.5 text-[10px] font-medium uppercase tracking-wider transition-colors",
                  billing === "yearly"
                    ? "bg-white/20 text-white"
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
                  "group relative flex flex-col rounded-2xl border bg-white/90 backdrop-blur-md p-8 text-text shadow-xl transition-all duration-300 ease-out",
                  "hover:-translate-y-1 hover:shadow-2xl hover:border-accent/50",
                  plan.featured
                    ? "border-2 border-accent shadow-[0_10px_40px_-15px_rgba(201,169,106,0.3)]"
                    : "border-border/40"
                )}
              >
                {plan.featured && (
                  <span
                    aria-hidden
                    className="absolute inset-x-0 top-0 h-[4px] rounded-t-2xl bg-accent"
                  />
                )}
                {plan.featured && (
                  <span className="absolute left-1/2 top-0 z-10 -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent px-4 py-1.5 text-[11px] font-bold uppercase tracking-widest text-white shadow-sm">
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

                {/* Lista de características: check dorado o X gris según el plan */}
                <ul className="mt-8 flex flex-col gap-3 text-sm">
                  {FEATURE_LIST.map((feature, i) => {
                    const hasIt = plan.included[i];
                    return (
                      <li
                        key={feature}
                        className={cn(
                          "flex items-start gap-3",
                          !hasIt && "opacity-40"
                        )}
                      >
                        {hasIt ? (
                          <Check
                            className="mt-0.5 h-4 w-4 flex-shrink-0 text-accent"
                            strokeWidth={2}
                          />
                        ) : (
                          <X
                            className="mt-0.5 h-4 w-4 flex-shrink-0 text-textSecondary/50"
                            strokeWidth={2}
                          />
                        )}
                        <span className={cn(!hasIt && "line-through decoration-textSecondary/40")}>
                          {feature}
                        </span>
                      </li>
                    );
                  })}
                </ul>

                <div className="mt-10 mt-auto pt-4">
                  <a
                    href={buildWhatsAppLink(plan.name, billing)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={cn(
                      "inline-flex w-full items-center justify-center rounded-xl px-6 py-3.5 text-sm font-semibold tracking-wide transition-all duration-300",
                      plan.featured
                        ? "bg-accent text-white shadow-md hover:bg-accent/90 hover:shadow-lg hover:-translate-y-0.5"
                        : "border-2 border-accent/30 text-accent bg-transparent hover:bg-accent/5 hover:border-accent"
                    )}
                  >
                    {plan.ctaLabel}
                  </a>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}