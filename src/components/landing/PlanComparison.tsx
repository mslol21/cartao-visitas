"use client";

import { motion } from 'framer-motion';
import { Play, Sparkles, Crown, Check, X, Info } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

const featuresList = [
  { name: 'Link personalizado (konnexy.com.br/seu-nome)', free: true, pro: true },
  { name: 'Botão de WhatsApp', free: 'Apenas 1', pro: 'Ilimitados' },
  { name: 'Redes Sociais', free: 'Limitadas', pro: 'Ilimitadas (Instagram, TikTok, LinkedIn, etc)' },
  { name: 'Catálogo de Serviços', free: true, pro: true },
  { name: 'Branding', free: 'Com Logo Konnexy', pro: '100% Sua Marca' },
  { name: 'Painel de Analytics & Visitas', free: false, pro: true },
  { name: 'Temas Profissionais (Imóveis, TI, Petshop, etc)', free: false, pro: true },
  { name: 'Vídeo no Fundo da Tela', free: false, pro: true },
  { name: 'Selo de Conta Verificada 👑', free: false, pro: true },
  { name: 'Assinatura Interativa em QR Code', free: false, pro: true },
];

export function PlanComparison() {
  return (
    <section className="py-32 relative overflow-hidden bg-slate-950 text-white">
      {/* Dynamic Background Effects */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-primary/20 rounded-full blur-[120px] mix-blend-screen animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-[600px] h-[600px] bg-purple-500/20 rounded-full blur-[150px] mix-blend-screen" />
        <div className="absolute inset-0 bg-[url('/noise.png')] opacity-20 mix-blend-overlay" />
      </div>

      <div className="container relative z-10 px-6">
        {/* Section Header */}
        <div className="text-center max-w-4xl mx-auto mb-20 space-y-6">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white text-[11px] font-black uppercase tracking-[0.4em] shadow-2xl"
          >
            <Crown className="w-4 h-4 text-yellow-400" />
            Tabela Comparativa
          </motion.div>
          
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-6xl font-black tracking-tighter text-white"
          >
            Escolha o plano <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400">ideal para você</span>
          </motion.h2>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-slate-400 text-lg font-medium max-w-2xl mx-auto"
          >
            Compare detalhadamente todos os recursos e descubra por que os profissionais de sucesso escolhem o plano PRO.
          </motion.p>
        </div>

        {/* Beautiful Comparison Table */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
          className="max-w-5xl mx-auto relative group rounded-[2.5rem] bg-white/5 backdrop-blur-xl border border-white/10 shadow-[0_0_100px_rgba(0,0,0,0.5)] overflow-hidden"
        >
           {/* Top headers */}
           <div className="grid grid-cols-3 border-b border-white/10 bg-black/20">
              <div className="p-6 md:p-8 flex items-center">
                 <span className="text-sm font-black uppercase tracking-widest text-slate-400">Recursos</span>
              </div>
              <div className="p-6 md:p-8 text-center flex flex-col items-center justify-center border-l border-white/10">
                 <h3 className="text-xl font-bold text-white mb-1">Plano Free</h3>
                 <span className="text-xs font-medium text-slate-500">O Básico</span>
              </div>
              <div className="p-6 md:p-8 text-center flex flex-col items-center justify-center border-l border-white/10 bg-primary/10 relative overflow-hidden">
                 <div className="absolute top-0 w-full h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500" />
                 <div className="flex items-center gap-1.5 mb-1">
                   <Sparkles className="w-4 h-4 text-yellow-400 animate-pulse" />
                   <h3 className="text-xl md:text-2xl font-black text-white">Plano PRO</h3>
                 </div>
                 <span className="text-xs font-bold text-primary uppercase tracking-widest">Recomendado</span>
              </div>
           </div>

           {/* Table Body */}
           <div className="divide-y divide-white/5">
             {featuresList.map((feature, i) => (
                <div key={i} className="grid grid-cols-3 hover:bg-white-[0.02] transition-colors">
                  <div className="p-5 md:p-6 flex items-center">
                    <span className="text-sm font-medium text-slate-300">{feature.name}</span>
                  </div>
                  <div className="p-5 md:p-6 flex items-center justify-center border-l border-white/5 opacity-70">
                    {typeof feature.free === 'boolean' ? (
                       feature.free ? <Check className="w-5 h-5 text-slate-400" /> : <X className="w-5 h-5 text-red-500/50" />
                    ) : (
                       <span className="text-xs font-bold text-slate-400 text-center">{feature.free}</span>
                    )}
                  </div>
                  <div className="p-5 md:p-6 flex items-center justify-center border-l border-white/5 bg-primary/5">
                    {typeof feature.pro === 'boolean' ? (
                       feature.pro ? <Check className="w-6 h-6 text-green-400" /> : <X className="w-5 h-5 text-red-500" />
                    ) : (
                       <span className="text-xs md:text-sm font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400 text-center">{feature.pro}</span>
                    )}
                  </div>
                </div>
             ))}
           </div>

           {/* CTA Row */}
           <div className="grid grid-cols-3 border-t border-white/10 bg-black/40">
              <div className="p-6"></div>
              <div className="p-6 flex items-center justify-center border-l border-white/10">
                 <Link href="/signup" className="text-sm font-bold text-slate-400 hover:text-white transition-colors underline underline-offset-4">
                   Criar Grátis
                 </Link>
              </div>
              <div className="p-6 flex items-center justify-center border-l border-white/10">
                 <Button asChild className="w-full bg-gradient-to-r from-primary to-purple-600 hover:from-primary/80 hover:to-purple-500 text-white font-black uppercase tracking-widest border-0 shadow-[0_0_30px_rgba(59,130,246,0.5)]">
                    <Link href="/pricing">Quero ser PRO</Link>
                 </Button>
              </div>
           </div>
        </motion.div>
      </div>
    </section>
  );
}
