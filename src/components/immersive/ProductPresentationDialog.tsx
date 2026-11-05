"use client";

import { CheckCircle2, ExternalLink, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";

type ProductPresentationData = {
  name: string;
  description: string;
  audience: string;
  steps: string[];
  features: string[];
  href?: string;
};

const whatsapp = (subject: string) =>
  `https://wa.me/5516991551200?text=${encodeURIComponent(
    `Olá, quero conhecer ${subject}. Podemos agendar uma demonstração?`,
  )}`;

export function ProductPresentationDialog({
  product,
  open,
  onOpenChange,
}: {
  product: ProductPresentationData;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        data-lenis-prevent
        className="max-h-[90svh] w-[calc(100%-2rem)] max-w-3xl overflow-y-auto rounded-3xl border-cyan-300/25 bg-[#080d1c] p-6 text-white shadow-[0_0_70px_rgba(34,211,238,.12)] sm:p-8"
      >
        <span className="pr-6 text-xs font-bold uppercase tracking-widest text-cyan-300">
          Conheça a solução
        </span>
        <DialogTitle className="text-3xl font-black tracking-tight sm:text-4xl">
          {product.name}
        </DialogTitle>
        <DialogDescription className="text-base leading-7 text-slate-300">
          {product.description}
        </DialogDescription>

        <p className="rounded-xl border border-white/10 bg-white/[0.03] p-3 text-sm text-slate-300">
          <strong className="text-white">Ideal para:</strong> {product.audience}.
        </p>

        <h3 className="mt-2 text-lg font-bold">Como funciona na prática</h3>
        <ol className="grid gap-3">
          {product.steps.map((step, index) => (
            <li
              key={step}
              className="flex items-start gap-3 rounded-2xl border border-cyan-300/10 bg-cyan-300/[0.03] p-4 text-sm leading-6 text-slate-200"
            >
              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-cyan-300/10 font-bold text-cyan-300">
                {index + 1}
              </span>
              {step}
            </li>
          ))}
        </ol>

        <ul className="grid gap-2 sm:grid-cols-2">
          {product.features.map((feature) => (
            <li key={feature} className="flex items-center gap-2 text-sm text-slate-300">
              <CheckCircle2 className="h-4 w-4 shrink-0 text-cyan-300" />
              {feature}
            </li>
          ))}
        </ul>

        <div className="mt-3 flex flex-col gap-3 border-t border-white/10 pt-5 sm:flex-row">
          {product.href ? (
            <Button asChild className="h-12 rounded-full bg-cyan-300 font-bold text-[#04111b] hover:bg-cyan-200">
              <a href={product.href} target="_blank" rel="noopener noreferrer">
                Visualizar projeto <ExternalLink className="ml-2 h-4 w-4" />
              </a>
            </Button>
          ) : null}

          <Button
            asChild
            variant="outline"
            className="h-12 rounded-full border-emerald-300/30 bg-emerald-300/5 font-bold text-emerald-200 hover:bg-emerald-300/10 hover:text-white"
          >
            <a href={whatsapp(product.name)} target="_blank" rel="noopener noreferrer">
              <MessageCircle className="mr-2 h-4 w-4" />
              Solicitar demonstração
            </a>
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
