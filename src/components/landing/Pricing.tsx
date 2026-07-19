"use client";

import { Check, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

export function Pricing() {
  const plans = [
    {
      name: "Konnexy Link",
      tagline: "Página de links inteligente para criadores",
      setupPrice: "R$ 197",
      monthlyPrice: "R$ 19,90",
      features: [
        "Redes Sociais & Links ilimitados",
        "Integração Spotify & YouTube",
        "Calendário de Agenda de Eventos",
        "Mini Portfólio & Galeria de Fotos",
        "Direcionamento para WhatsApp",
        "Design Premium Otimizado",
        "Hospedagem & Suporte inclusos",
      ],
      whatsappMsg: "Olá! Gostaria de solicitar o desenvolvimento do meu Konnexy Link.",
      badge: null,
      gradient: "from-blue-600 to-indigo-600",
    },
    {
      name: "Konnexy Catálogo",
      tagline: "Sua loja/delivery integrado ao WhatsApp",
      setupPrice: "R$ 297",
      monthlyPrice: "R$ 49,90",
      features: [
        "Produtos & Categorias ilimitadas",
        "Carrinho de Compras interativo",
        "Integração de pagamentos por PIX",
        "Cálculo automático de taxa de entrega",
        "Pedidos estruturados no WhatsApp",
        "Conexão de Domínio Próprio",
        "Painel Administrativo completo",
      ],
      whatsappMsg: "Olá! Gostaria de solicitar o desenvolvimento do meu Konnexy Catálogo.",
      badge: "Mais Popular",
      gradient: "from-[#00D4FF] to-blue-600",
    },
    {
      name: "Konnexy Sites",
      tagline: "Landing Pages profissionais de alta conversão",
      setupPrice: "A partir de R$ 397",
      monthlyPrice: "Sob Demanda",
      monthlyDesc: "Sem mensalidade obrigatória",
      features: [
        "Layout exclusivo de alta performance",
        "Otimização completa de SEO",
        "Formulários de captura de leads",
        "Botões de WhatsApp flutuantes",
        "Mapa de localização (Google Maps)",
        "Ideal para clínicas, construtoras e escritórios",
        "Código limpo de carregamento ultra rápido",
      ],
      whatsappMsg: "Olá! Gostaria de fazer um orçamento de Landing Page / Konnexy Sites.",
      badge: "Ideal p/ Serviços",
      gradient: "from-purple-600 to-pink-600",
    },
    {
      name: "Konnexy Pet",
      tagline: "Plataforma completa de gestão e agendamentos",
      setupPrice: "R$ 890",
      monthlyPrice: "R$ 89,90",
      features: [
        "Site profissional customizado",
        "Agendamento Online de Banho & Tosa",
        "CRM & Cadastro de Clientes/Pets",
        "Controle Financeiro & de Estoque",
        "Programa de Fidelidade integrado",
        "Área Exclusiva do Tutor",
        "Marketing automatizado via WhatsApp",
        "Dashboard Executivo completo",
      ],
      whatsappMsg: "Olá! Gostaria de solicitar uma demonstração do Konnexy Pet para meu Pet Shop.",
      badge: "Solução mais completa",
      gradient: "from-emerald-500 to-teal-700",
    },
  ];

  return (
    <section id="precos" className="py-24 bg-[#030712] text-slate-100 font-sans relative overflow-hidden z-10 border-t border-white/5">
      {/* Glow backgrounds */}
      <div className="absolute top-[10%] left-1/4 w-[500px] h-[500px] rounded-full bg-blue-500/5 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[10%] right-1/4 w-[500px] h-[500px] rounded-full bg-indigo-500/5 blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        {/* Title */}
        <div className="text-center max-w-3xl mx-auto mb-20">
          <span className="text-xs font-black uppercase tracking-[0.3em] text-[#00D4FF] mb-3 block">Orçamento Sob Medida</span>
          <h2 className="text-4xl md:text-5xl font-black mb-6 font-display leading-[1.1] text-white">
            Soluções sob medida para o seu negócio crescer.
          </h2>
          <p className="text-slate-400 text-sm md:text-base leading-relaxed max-w-2xl mx-auto font-medium">
            Desenvolvemos plataformas personalizadas e completas. Escolha a solução ideal e fale conosco para receber uma proposta comercial detalhada.
          </p>
        </div>

        {/* Pricing Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 items-stretch">
          {plans.map((plan, idx) => {
            const isPet = plan.name === "Konnexy Pet";
            const isCatalog = plan.name === "Konnexy Catálogo";
            return (
              <div 
                key={idx}
                className={`relative flex flex-col justify-between rounded-[2rem] p-8 border transition-all duration-300 hover:y-[-8px] bg-[#090D16]/90 backdrop-blur-md ${
                  isCatalog 
                    ? "border-[#00D4FF]/40 shadow-[0_20px_50px_rgba(0,212,255,0.1)] scale-102 z-20" 
                    : isPet 
                      ? "border-emerald-500/30 hover:border-emerald-500/50" 
                      : "border-white/5 hover:border-white/10"
                }`}
              >
                {/* Badge if exists */}
                {plan.badge && (
                  <div className={`absolute top-4 right-4 px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-wider ${
                    isPet 
                      ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/30" 
                      : isCatalog 
                        ? "bg-[#00D4FF]/10 text-[#00D4FF] border border-[#00D4FF]/30" 
                        : "bg-purple-500/10 text-purple-400 border border-purple-500/30"
                  }`}>
                    {plan.badge}
                  </div>
                )}

                <div>
                  {/* Name & Tagline */}
                  <h3 className="text-xl font-black text-white mb-2">{plan.name}</h3>
                  <p className="text-xs text-slate-400 leading-normal min-h-[36px] mb-6">{plan.tagline}</p>

                  <div className="h-[1px] bg-white/5 mb-6" />

                  {/* Pricing Details replaced with Solicitar Orçamento */}
                  <div className="space-y-2 mb-8 py-3">
                    <span className="text-[10px] text-slate-550 uppercase tracking-widest font-black block">Investimento</span>
                    <div className="flex items-baseline gap-1 mt-0.5">
                      <span className={`text-2xl font-black ${isCatalog ? "text-[#00D4FF]" : isPet ? "text-emerald-400" : "text-white"}`}>Sob Consulta</span>
                    </div>
                    <p className="text-[11px] text-slate-400 leading-normal font-medium">
                      Solicite uma análise rápida e receba um orçamento personalizado.
                    </p>
                  </div>

                  <div className="h-[1px] bg-white/5 mb-6" />

                  {/* Features List */}
                  <ul className="space-y-3 mb-8">
                    {plan.features.map((feature, fIdx) => (
                      <li key={fIdx} className="flex items-start gap-2 text-[11px] text-slate-300 font-medium">
                        <Check className={`w-3.5 h-3.5 shrink-0 mt-0.5 ${isPet ? "text-emerald-400" : isCatalog ? "text-[#00D4FF]" : "text-purple-400"}`} />
                        <span className="leading-snug">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Call To Action */}
                <Button
                  asChild
                  className={`w-full h-12 rounded-xl text-xs font-black uppercase tracking-wider active:scale-95 transition-all shadow-md ${
                    isCatalog
                      ? "bg-gradient-to-r from-[#00D4FF] to-blue-600 text-white shadow-blue-500/20"
                      : isPet
                        ? "bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-emerald-500/10 hover:opacity-90"
                        : "bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 text-white"
                  }`}
                >
                  <a href={`https://wa.me/5516991551200?text=${encodeURIComponent(plan.whatsappMsg)}`} target="_blank" rel="noopener noreferrer">
                    Solicitar Orçamento
                  </a>
                </Button>
              </div>
            );
          })}
        </div>

        {/* Support Callout */}
        <div className="mt-16 text-center border border-white/5 rounded-2.5rem p-6 bg-white/[0.01] max-w-2xl mx-auto flex flex-col sm:flex-row items-center justify-center gap-4 text-slate-400 text-xs font-semibold">
          <Sparkles className="w-5 h-5 text-amber-500 shrink-0" />
          <span>Precisa de um projeto de sistema ou aplicativo sob medida fora das soluções acima?</span>
          <a href="https://wa.me/5516991551200?text=Olá,%20gostaria%20de%20conversar%20sobre%20um%20projeto%20personalizado%20de%20tecnologia" target="_blank" rel="noopener noreferrer" className="text-[#00D4FF] hover:underline font-black uppercase tracking-wider shrink-0">
            Fale Conosco
          </a>
        </div>
      </div>
    </section>
  );
}
