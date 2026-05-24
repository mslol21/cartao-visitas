"use client";

import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";

export function Pricing() {
  return (
    <section id="precos" className="py-24 bg-[#05070B] text-slate-100 font-sans relative overflow-hidden z-10 border-t border-white/5">
      {/* Decorative glows */}
      <div className="absolute top-[10%] left-1/2 -translate-x-1/2 w-[70%] h-[300px] rounded-full bg-[#00D4FF]/5 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 right-[-10%] w-[400px] h-[400px] rounded-full bg-purple-500/5 blur-[100px] pointer-events-none" />

      <div className="container px-6 mx-auto max-w-5xl relative z-10">
        
        {/* Title */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs font-black uppercase tracking-[0.25em] text-[#00D4FF] mb-3 block">Preço Simples e Transparente</span>
          <h2 className="text-4xl md:text-5xl font-black mb-4 font-display leading-[1.1]">
            Tudo o que você precisa em um único plano.
          </h2>
          <p className="text-slate-400 text-base md:text-lg">
            Sem contratos de fidelidade, sem taxas de cancelamento e sem comissão sobre suas vendas.
          </p>
        </div>

        {/* Unified Premium Card */}
        <div className="bg-[#0C0F16]/80 backdrop-blur-md border border-[#00D4FF]/20 rounded-[2.5rem] overflow-hidden shadow-2xl shadow-slate-950/50 max-w-4xl mx-auto grid md:grid-cols-12 gap-0 relative group">
          {/* Subtle hover glow effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#00D4FF]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

          {/* Left: Plan details & features (7 columns) */}
          <div className="p-8 md:p-12 md:col-span-7 flex flex-col justify-between border-b md:border-b-0 md:border-r border-white/5 relative z-10">
            <div>
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#00D4FF]/10 border border-[#00B4D8]/30 text-[#00D4FF] text-[10px] font-black uppercase tracking-wider mb-6">
                Plano Completo Konnexy Pro
              </div>
              <h3 className="text-2xl font-black text-white mb-4">Catálogo Digital + Vendas no WhatsApp</h3>
              <p className="text-slate-450 text-xs.5 leading-relaxed mb-8">
                Nós configuramos todo o seu catálogo com produtos, categorias, taxas e formas de pagamento. Você recebe a plataforma pronta para vender, sem precisar programar ou desenhar nada.
              </p>
              
              <div className="h-[1px] bg-white/5 mb-8" />
              
              <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-4">O que está incluso:</h4>
              <ul className="grid sm:grid-cols-2 gap-x-6 gap-y-3.5">
                {[
                  "Catálogo digital profissional",
                  "Produtos e fotos ilimitados",
                  "Organização por Categorias",
                  "Carrinho de compras integrado",
                  "Pedidos estruturados no WhatsApp",
                  "Cálculo automático de taxa de entrega",
                  "Chave Pix e formas de pagamento",
                  "Domínio próprio (ex: suaadega.com.br)",
                  "Pixel do Facebook para anúncios",
                  "Relatórios de acessos e pedidos",
                  "Suporte prioritário via WhatsApp",
                  "Setup e configuração inclusos"
                ].map((feature, idx) => (
                  <li key={idx} className="flex items-start gap-2.5 text-xs text-slate-355">
                    <Check className="w-4 h-4 text-green-400 shrink-0 mt-0.5" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Right: Price details & CTA (5 columns) */}
          <div className="p-8 md:p-12 md:col-span-5 bg-[#080B10]/80 flex flex-col justify-between items-center text-center relative z-10">
            <div className="w-full">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block mb-6">Investimento</span>
              
              {/* Setup Price */}
              <div className="mb-6">
                <span className="text-[10px] text-slate-400 uppercase tracking-wider font-bold block mb-1">Setup Inicial (Taxa Única)</span>
                <div className="flex items-baseline justify-center gap-1">
                  <span className="text-3xl font-black text-white font-display">R$ 297</span>
                  <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Único</span>
                </div>
                <p className="text-[9.5px] text-slate-500 mt-1 max-w-[220px] mx-auto leading-tight font-medium">
                  Configuração completa do seu catálogo e integração com seu WhatsApp.
                </p>
              </div>

              <div className="h-[1px] bg-white/5 my-6" />

              {/* Maintenance Price */}
              <div className="mb-8">
                <span className="text-[10px] text-[#00D4FF] uppercase tracking-wider font-bold block mb-1">Manutenção e Hospedagem</span>
                <div className="flex items-baseline justify-center gap-1">
                  <span className="text-4xl font-black text-white font-display">R$ 49,90</span>
                  <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">/ mês</span>
                </div>
                <p className="text-[9.5px] text-slate-500 mt-1 max-w-[220px] mx-auto leading-tight font-medium">
                  Servidores de alta velocidade, domínio ativo, atualizações e suporte.
                </p>
              </div>
            </div>

            <div className="w-full">
              <Button
                asChild
                className="w-full h-14 rounded-2xl font-bold text-xs uppercase tracking-widest active:scale-95 transition-all flex items-center justify-center gap-1.5 border-0 bg-gradient-to-r from-[#0D5B80] to-[#0A3D58] hover:from-[#116F9C] hover:to-[#0D5073] text-white shadow-xl shadow-[#0D5B80]/20 border border-[#00B4D8]/20"
              >
                <a href="https://wa.me/5516991551200?text=Olá,%20tenho%20interesse%20em%20criar%20meu%20catálogo%20com%20o%20plano%20Konnexy%20Pro." target="_blank" rel="noopener noreferrer">
                  Criar Meu Catálogo
                </a>
              </Button>
              <div className="flex flex-col gap-1 mt-4 text-[9px] text-slate-500 font-bold uppercase tracking-wider items-center">
                <span>🛡️ Sem multa de cancelamento</span>
                <span>⚡ Ativo em até 24 horas</span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer badges */}
        <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-4 mt-16 text-slate-500 text-[10px] font-bold uppercase tracking-wider">
          <span>🛡️ Checkout Integrado</span>
          <span>💬 Suporte Dedicado via WhatsApp</span>
          <span>⚡ Configuração em até 24h</span>
        </div>

      </div>
    </section>
  );
}
