"use client";

import { Check, Sparkles, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { UpgradeButton } from './UpgradeButton';

const plans = [
  {
    name: 'Plano Free',
    price: '0',
    description: 'Experimente o cartão, sinta o poder, desbloqueie o profissional',
    features: [
      { text: 'Link público básico', excluded: false },
      { text: 'Botão WhatsApp (50 cliques/mês)', excluded: false },
      { text: '1 especialidade', excluded: false },
      { text: 'Foto com marca d’água Konnexy', excluded: false },
      { text: 'Instagram integrado', excluded: true },
      { text: 'Outras redes sociais', excluded: true },
      { text: 'Analytics', excluded: true },
      { text: 'Personalização visual', excluded: true },
      { text: 'Remoção da marca Konnexy', excluded: true },
    ],
    cta: 'Testar grátis',
    href: '/signup',
    popular: false,
    subText: 'Ideal para testar. Profissionais usam o Pro.',
  },
  {
    name: 'Plano Pro',
    price: '19',
    description: 'Seu cartão digital como vitrine profissional',
    features: [
      { text: 'Tudo do Free', excluded: false },
      { text: 'WhatsApp ilimitado', excluded: false },
      { text: 'Sem marca d’água', excluded: false },
      { text: 'Redes sociais ilimitadas', excluded: false },
      { text: 'Até 20 especialidades', excluded: false },
      { text: 'Analytics completo', excluded: false },
      { text: 'Preview mobile premium', excluded: false },
      { text: 'Upload de logo/foto HQ', excluded: false },
      { text: 'Selo Profissional Verificado', excluded: false },
      { text: 'Suporte prioritário', excluded: false },
    ],
    cta: 'Criar cartão profissional',
    href: '/pricing',
    popular: true,
  },
];

export function Pricing() {
  return (
    <section id="precos" className="py-32 bg-slate-50 dark:bg-slate-950 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-full opacity-[0.03] bg-hero-pattern" />
      
      <div className="container relative z-10 px-6">
        <div className="text-center max-w-3xl mx-auto mb-20 space-y-4">
           <div className="text-[10px] font-black uppercase tracking-[0.4em] text-primary">Preços</div>
           <h2 className="text-3xl sm:text-4xl md:text-6xl font-black tracking-tighter leading-tight">
             Simplicidade que <br />
             <span className="gradient-text">escala seu negócio.</span>
           </h2>
           <p className="text-muted-foreground text-lg font-medium">
             Escolha o plano que melhor se adapta ao momento da sua carreira.
           </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {plans.map((plan, index) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className={`relative p-8 sm:p-12 rounded-[2.5rem] sm:rounded-[3rem] border-2 transition-all duration-300 flex flex-col ${
                plan.popular
                  ? 'border-primary bg-white dark:bg-slate-900 shadow-[0_40px_100px_-20px_rgba(59,130,246,0.2)]'
                  : 'border-border/50 bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm'
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-6 left-1/2 -translate-x-1/2">
                  <div className="inline-flex items-center gap-2 px-6 py-2 rounded-full bg-slate-900 text-white text-[10px] font-black uppercase tracking-widest whitespace-nowrap">
                    <Sparkles className="w-3 h-3 text-orange-400 animate-pulse" />
                    🔥 Mais escolhido
                  </div>
                </div>
              )}

              <div className="mb-10 text-center">
                <h3 className="text-2xl font-black mb-3 italic tracking-tight uppercase tracking-[0.1em]">
                  {plan.name}
                </h3>
                <p className="text-sm text-muted-foreground font-medium leading-relaxed max-w-[280px] mx-auto italic">
                  “{plan.description}”
                </p>
              </div>

              <div className="mb-10 text-center">
                <div className="flex items-start justify-center">
                  <span className="text-xl sm:text-2xl font-bold mt-2">R$</span>
                  <span className="text-6xl sm:text-8xl font-black tracking-tighter">{plan.price}</span>
                </div>
                <div className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/60">Por Mês • Sem fidelidade</div>
              </div>

              <div className="space-y-4 mb-12 flex-grow">
                {plan.features.map((feature) => (
                  <div key={feature.text} className={`flex items-center gap-4 ${feature.excluded ? 'opacity-40' : ''}`}>
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
                      feature.excluded 
                        ? 'bg-slate-100 dark:bg-slate-800' 
                        : (plan.popular ? 'bg-primary/10' : 'bg-slate-100 dark:bg-slate-800')
                    }`}>
                      {feature.excluded ? (
                        <X className="w-3.5 h-3.5 text-slate-400" />
                      ) : (
                        <Check className={`w-3.5 h-3.5 ${plan.popular ? 'text-primary' : 'text-slate-400'}`} />
                      )}
                    </div>
                    <span className={`text-sm font-bold ${feature.excluded ? 'line-through decoration-slate-400' : 'opacity-80'}`}>
                      {feature.text}
                    </span>
                  </div>
                ))}
              </div>

              <div className="mt-auto">
                {plan.popular ? (
                  <UpgradeButton />
                ) : (
                  <div className="space-y-4">
                    <Button
                      asChild
                      variant="outline"
                      className="w-full h-16 rounded-2xl text-sm font-black uppercase tracking-widest shadow-xl transition-all active:scale-95"
                    >
                      <Link href={plan.href}>
                        {plan.cta}
                      </Link>
                    </Button>
                    <p className="text-center text-[11px] font-bold text-primary/80 italic">
                      {plan.subText}
                    </p>
                  </div>
                )}
                
                <p className="mt-6 text-center text-[10px] font-bold text-muted-foreground/40 uppercase tracking-widest">
                   Cancelamento instantâneo a qualquer momento
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
