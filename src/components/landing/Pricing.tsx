"use client";

import { Check, Sparkles, X, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { motion } from 'framer-motion';

const plans = [
  {
    name: 'Plano Free',
    priceText: 'Gratuito',
    description: 'Teste seu cartão agora',
    features: [
      { text: 'Cartão de visitas digital', excluded: false },
      { text: 'Link personalizado', excluded: false },
      { text: 'Botão WhatsApp (até 50 cliques)', excluded: false },
      { text: '1 especialidade/serviço', excluded: false },
      { text: 'Com marca Konnexy', excluded: false },
      { text: 'WhatsApp ilimitado', excluded: true },
      { text: 'Sem marca d\'água', excluded: true },
      { text: 'Estatísticas de acesso', excluded: true },
      { text: 'Fundo em vídeo premium', excluded: true },
    ],
    cta: 'Começar grátis',
    href: 'https://wa.me/5516991551200?text=Ol%C3%A1%2C%20gostaria%20de%20me%20cadastrar',
    popular: false,
    subText: 'Crie seu link em 2 minutos',
  },
  {
    name: 'Plano Pro',
    priceText: 'Premium',
    description: 'Para quem quer vender mais',
    features: [
      { text: 'Tudo do Free e mais:', excluded: false },
      { text: 'Contatos e WhatsApp ilimitados', excluded: false },
      { text: 'Sem logo Konnexy (Sua marca)', excluded: false },
      { text: 'Redes sociais ilimitadas', excluded: false },
      { text: 'Até 20 especialidades', excluded: false },
      { text: 'Estatísticas completas', excluded: false },
      { text: 'Temas Vip & Videos de Fundo', excluded: false },
      { text: 'Selo de perfil verificado', excluded: false },
      { text: 'QR Code Dinâmico Animado', excluded: false },
    ],
    cta: 'Ser Profissional agora',
    href: '/login?upgrade=true',
    popular: true,
    subText: 'O investimento que se paga sozinho',
  },
];

export function Pricing() {
  return (
    <section id="precos" className="py-32 bg-slate-950 relative overflow-hidden text-white border-t border-white/5">
      {/* Background decoration */}
      <div className="absolute inset-0 opacity-100 pointer-events-none overflow-hidden">
        <div className="absolute top-1/2 left-0 w-[500px] h-[500px] bg-primary/20 rounded-full blur-[120px] mix-blend-screen" />
        <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-purple-500/20 rounded-full blur-[150px] mix-blend-screen" />
        <div className="absolute inset-0 bg-[url('/noise.png')] opacity-[0.03] mix-blend-overlay" />
      </div>
      
      <div className="container relative z-10 px-6">
        <div className="text-center max-w-3xl mx-auto mb-20 space-y-6">
           <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/5 backdrop-blur-md border border-white/10 text-white text-[11px] font-black uppercase tracking-[0.4em] shadow-xl">
             Investimento
           </div>
           <h2 className="text-4xl sm:text-5xl md:text-7xl font-black tracking-tighter leading-tight text-white">
             O visual profissional <br />
             <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-primary to-purple-400">que você merece.</span>
           </h2>
           <p className="text-slate-400 text-lg font-medium max-w-2xl mx-auto">
             Aumente suas vendas com um cartão digital que transmite confiança superlativa e facilita o contato para seus clientes.
           </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 lg:gap-12 max-w-5xl mx-auto">
          {plans.map((plan, index) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className={`group relative rounded-[2.5rem] transition-all duration-500 ${
                plan.popular
                  ? 'md:scale-105 z-10'
                  : ''
              }`}
            >
              {/* Card Background Layers */}
              {plan.popular && (
                 <div className="absolute -inset-1 bg-gradient-to-b from-primary to-purple-600 rounded-[2.5rem] blur-md opacity-20 group-hover:opacity-40 transition-opacity duration-500" />
              )}
              
              <div className={`relative p-8 sm:p-12 backdrop-blur-2xl rounded-[2.5rem] flex flex-col h-full overflow-hidden ${
                 plan.popular ? 'bg-gradient-to-b from-slate-900 to-slate-950 border border-primary/30 shadow-[0_0_50px_rgba(59,130,246,0.15)]' : 'bg-white/5 border border-white/10'
              }`}>
                
                {/* Internal Glow for Popular */}
                {plan.popular && (
                  <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-[80px] pointer-events-none" />
                )}

                {/* Popular Badge */}
                {plan.popular && (
                  <div className="absolute -top-5 left-1/2 -translate-x-1/2">
                    <div className="inline-flex items-center gap-2 px-6 py-2 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 text-white text-[11px] font-black uppercase tracking-widest whitespace-nowrap shadow-xl border border-white/20">
                      <Sparkles className="w-3.5 h-3.5 animate-pulse text-yellow-300" />
                      Acesso Vitalício Vip
                    </div>
                  </div>
                )}

                <div className="mb-10 text-center relative z-10">
                  <h3 className="text-3xl font-black mb-3 tracking-tight text-white">
                    {plan.name}
                  </h3>
                  <p className="text-sm text-slate-400 font-medium leading-relaxed max-w-[280px] mx-auto italic">
                    “{plan.description}”
                  </p>
                </div>

                <div className="mb-10 text-center relative z-10">
                  <div className="flex items-center justify-center">
                    <h4 className="text-5xl sm:text-6xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-primary">
                       {plan.priceText}
                    </h4>
                  </div>
                  <div className="mt-4 text-[11px] font-black uppercase tracking-[0.3em] text-slate-500">Sem Fidelidade • Flexível</div>
                </div>

                <div className="space-y-4 mb-12 flex-grow relative z-10 pt-8 border-t border-white/10">
                  {plan.features.map((feature, i) => (
                    <div key={i} className={`flex items-center gap-4 ${feature.excluded ? 'opacity-40' : ''}`}>
                      <div className={`w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 transition-colors ${
                        feature.excluded 
                          ? 'bg-white/5 border border-white/5' 
                          : (plan.popular ? 'bg-primary/20 border border-primary/30' : 'bg-white/10 border border-white/10')
                      }`}>
                        {feature.excluded ? (
                          <X className="w-4 h-4 text-red-400" />
                        ) : (
                          <Check className={`w-4 h-4 ${plan.popular ? 'text-blue-400' : 'text-slate-300'}`} />
                        )}
                      </div>
                      <span className={`text-sm font-bold ${feature.excluded ? 'line-through decoration-slate-500 text-slate-500' : 'text-slate-200'}`}>
                        {feature.text}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="mt-auto relative z-10">
                  <div className="space-y-4">
                    <Button
                      asChild
                      className={`w-full h-16 rounded-[2rem] text-sm font-black uppercase tracking-widest transition-all ${
                         plan.popular 
                         ? 'bg-gradient-to-r from-primary to-purple-600 hover:from-primary/80 hover:to-purple-500 text-white shadow-[0_0_30px_rgba(59,130,246,0.5)] border-0' 
                         : 'bg-white/5 hover:bg-white/10 border border-white/20 text-white'
                      }`}
                    >
                      <a href={plan.href} target={plan.href.startsWith("http") ? "_blank" : undefined} rel={plan.href.startsWith("http") ? "noopener noreferrer" : undefined} className="flex items-center justify-center gap-2">
                        {plan.cta}
                        <ArrowRight className="w-5 h-5" />
                      </a>
                    </Button>
                    <p className={`text-center text-[11px] font-bold italic tracking-wider ${plan.popular ? 'text-primary' : 'text-slate-500'}`}>
                      {plan.subText}
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
