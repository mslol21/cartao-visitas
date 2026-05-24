"use client";

import { useState } from "react";
import { Check, Crown, Star, Sparkles, MessageSquare, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";

const FOUNDING_SPOTS = 20;
const spotsLeft = 7;
const filled = FOUNDING_SPOTS - spotsLeft;

const plans = [
  {
    id: "pro",
    name: "Plano PRO",
    price: "R$ 49",
    period: "por mês",
    description: "Ideal para negócios locais que querem começar a vender de forma organizada pelo WhatsApp.",
    icon: Crown,
    accent: "#00D4FF",
    border: "border-white/5",
    hoverBorder: "hover:border-[#00D4FF]/30",
    glowColor: "rgba(0, 212, 255, 0.05)",
    cta: "Começar Agora",
    features: [
      "Catálogo digital profissional",
      "Produtos e fotos ilimitados",
      "Organização por Categorias",
      "Carrinho de compras integrado",
      "Pedidos automatizados no WhatsApp",
      "Cálculo automático de taxa de entrega",
      "Formas de pagamento e chave Pix",
      "Suporte humanizado via WhatsApp",
    ],
    href: "https://wa.me/5516991551200?text=Olá, tenho interesse no Plano PRO da Konnexy.",
  },
  {
    id: "founding",
    name: "Membro Fundador",
    price: "R$ 497",
    period: "pagamento único",
    description: "Acesso vitalício sem mensalidades. Vagas limitadas para os primeiros parceiros da plataforma.",
    icon: Sparkles,
    accent: "#22C55E",
    border: "border-green-500/20",
    hoverBorder: "hover:border-green-500/40",
    glowColor: "rgba(34, 197, 94, 0.05)",
    badge: "🔥 ACESSO VITALÍCIO",
    cta: "Garantir Vaga Vitalícia",
    features: [
      "Tudo do plano PRO para sempre",
      "Sem mensalidades ou anuidades",
      "Setup inicial gratuito (configuramos para você)",
      "Suporte VIP vitalício via WhatsApp",
      "Prioridade em novas funcionalidades",
      "Selo exclusivo no painel",
    ],
    href: "https://wa.me/5516991551200?text=Olá, quero garantir minha vaga de Membro Fundador com acesso vitalício.",
  },
  {
    id: "business",
    name: "Plano Business",
    price: "R$ 99",
    period: "por mês",
    description: "Para empresas que precisam de domínio próprio, marca exclusiva e análise profunda de dados.",
    icon: Star,
    accent: "#a78bfa",
    border: "border-white/5",
    hoverBorder: "hover:border-purple-500/30",
    glowColor: "rgba(167, 139, 250, 0.05)",
    cta: "Falar com Consultor",
    features: [
      "Tudo do Plano PRO",
      "Domínio próprio (ex: suaadega.com.br)",
      "Remoção da marca Konnexy",
      "Relatórios de visitas e vendas",
      "Pixel do Facebook integrado",
      "Suporte prioritário 24/7",
    ],
    href: "https://wa.me/5516991551200?text=Olá, gostaria de saber mais sobre o Plano Business da Konnexy.",
  },
];

export function Pricing() {
  const [hovered, setHovered] = useState<string | null>(null);

  return (
    <section id="precos" className="py-24 bg-[#05070B] text-slate-100 font-sans relative overflow-hidden z-10 border-t border-white/5">
      {/* Decorative glows */}
      <div className="absolute top-[10%] left-1/2 -translate-x-1/2 w-[70%] h-[300px] rounded-full bg-[#00D4FF]/5 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 right-[-10%] w-[400px] h-[400px] rounded-full bg-purple-500/5 blur-[100px] pointer-events-none" />

      <div className="container px-6 mx-auto max-w-6xl relative z-10">
        
        {/* Founding Spot Alert banner */}
        <div className="flex flex-col items-center mb-16 text-center">
          <div className="inline-flex items-center gap-3 bg-red-950/20 border border-red-500/25 rounded-2xl px-5 py-3.5 mb-6 text-left max-w-lg shadow-xl shadow-red-500/5">
            <span className="text-xl">🔥</span>
            <div>
              <div className="text-[11px] font-black text-red-400 uppercase tracking-widest leading-none mb-1">OFERTA DE LANÇAMENTO — VAGAS LIMITADAS</div>
              <div className="text-xs text-slate-400">
                Apenas <strong className="text-white">{spotsLeft} vagas restantes</strong> de {FOUNDING_SPOTS} para o acesso vitalício.
              </div>
            </div>
          </div>

          {/* Progress bar */}
          <div className="w-full max-w-[340px] text-left">
            <div className="flex justify-between mb-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-500">
              <span>Vagas Preenchidas</span>
              <span className="text-red-400">{filled} / {FOUNDING_SPOTS}</span>
            </div>
            <div className="h-1.5 bg-slate-900 border border-white/5 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-red-500 to-orange-500 rounded-full transition-all duration-1000" 
                style={{ width: `${(filled / FOUNDING_SPOTS) * 100}%` }}
              />
            </div>
          </div>
        </div>

        {/* Title */}
        <div className="text-center max-w-3xl mx-auto mb-20">
          <span className="text-xs font-black uppercase tracking-[0.25em] text-[#00D4FF] mb-3 block">Planos e Preços</span>
          <h2 className="text-4xl md:text-5xl font-black mb-4 font-display leading-[1.1]">
            Escolha o plano ideal para o seu negócio crescer.
          </h2>
          <p className="text-slate-400 text-base md:text-lg">
            Sem taxas ocultas, sem comissão por venda. Cancele ou altere seu plano quando quiser.
          </p>
        </div>

        {/* Plans grid */}
        <div className="grid md:grid-cols-3 gap-6 items-start">
          {plans.map((plan) => {
            const Icon = plan.icon;
            const isHovered = hovered === plan.id;
            return (
              <div
                key={plan.id}
                onMouseEnter={() => setHovered(plan.id)}
                onMouseLeave={() => setHovered(null)}
                className={`bg-[#0C0F16]/80 backdrop-blur-md border rounded-[2rem] p-8 flex flex-col justify-between transition-all duration-300 relative min-h-[580px] ${plan.border} ${plan.hoverBorder} ${
                  isHovered ? "-translate-y-2 shadow-2xl shadow-slate-950" : "translate-y-0"
                }`}
                style={{
                  boxShadow: isHovered ? `0 20px 40px -15px ${plan.glowColor}` : "none",
                }}
              >
                {plan.badge && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-gradient-to-r from-green-500 to-emerald-600 text-white text-[9px] font-black px-4.5 py-1.5 rounded-full uppercase tracking-widest shadow-lg shadow-green-500/20 whitespace-nowrap">
                    {plan.badge}
                  </div>
                )}

                <div>
                  {/* Card Header */}
                  <div className="flex items-center gap-2 mb-4">
                    <div className="p-2 rounded-lg bg-slate-900 border border-white/5 text-[#00D4FF] flex items-center justify-center shrink-0">
                      <Icon className="w-5 h-5" style={{ color: plan.accent }} />
                    </div>
                    <span className="font-bold text-xs uppercase tracking-wider text-slate-400" style={{ color: plan.accent }}>
                      {plan.name}
                    </span>
                  </div>

                  {/* Price */}
                  <div className="flex items-baseline gap-2 mb-4">
                    <span className="text-4xl font-black text-white font-display tracking-tight">{plan.price}</span>
                    <span className="text-xs text-slate-500 font-medium uppercase tracking-wider">{plan.period}</span>
                  </div>

                  <p className="text-slate-400 text-xs.5 leading-relaxed mb-6">
                    {plan.description}
                  </p>

                  <div className="h-[1px] bg-white/5 mb-6" />

                  {/* Features List */}
                  <ul className="space-y-3.5 mb-8">
                    {plan.features.map((feature, idx) => (
                      <li key={idx} className="flex items-start gap-2.5 text-xs.5 text-slate-300">
                        <Check className="w-4 h-4 text-green-400 shrink-0 mt-0.5" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* CTA Button */}
                <div>
                  <Button
                    asChild
                    className={`w-full h-12 rounded-xl font-bold text-xs uppercase tracking-widest active:scale-95 transition-all flex items-center justify-center gap-1.5 border-0 ${
                      plan.id === "founding"
                        ? "bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-xl shadow-green-500/20 hover:from-green-600 hover:to-emerald-700"
                        : plan.id === "business"
                        ? "bg-gradient-to-r from-purple-500 to-indigo-600 text-white shadow-xl shadow-purple-500/20 hover:from-purple-600 hover:to-indigo-700"
                        : "bg-gradient-to-r from-[#0D5B80] to-[#0A3D58] hover:from-[#116F9C] hover:to-[#0D5073] text-white shadow-xl shadow-[#0D5B80]/20 border border-[#00B4D8]/20"
                    }`}
                  >
                    <a href={plan.href} target="_blank" rel="noopener noreferrer">
                      {plan.cta}
                    </a>
                  </Button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer badges */}
        <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-4 mt-16 text-slate-500 text-[11px] font-bold uppercase tracking-wider">
          <span>🛡️ Checkout Integrado</span>
          <span>💬 Suporte Dedicado</span>
          <span>⚡ Configuração em até 24h</span>
        </div>

      </div>
    </section>
  );
}
