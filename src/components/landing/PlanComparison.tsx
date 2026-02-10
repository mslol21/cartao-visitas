"use client";

import { motion } from 'framer-motion';
import { Play, Sparkles, Crown, Check, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import Image from 'next/image';

const comparisonData = [
  {
    plan: 'Free',
    title: 'Plano Free',
    subtitle: 'Para quem está começando',
    imageSrc: '/videos/1000032806.png',
    highlights: [
      { text: 'Link profissional básico', included: true },
      { text: 'Com logo da Konnexy', included: true },
      { text: 'Cliques no WhatsApp limitados', included: true },
      { text: 'Sem saber quem te visitou', included: false },
      { text: 'Visual estático padrão', included: false },
    ],
    badge: 'Básico',
    badgeColor: 'bg-slate-500',
    borderColor: 'border-slate-300',
    bgGradient: 'from-slate-50 to-slate-100',
  },
  {
    plan: 'Pro',
    title: 'Plano Pro',
    subtitle: 'O máximo profissionalismo',
    imageSrc: '/videos/1000032805.png',
    highlights: [
      { text: 'Visual Premium com Vídeo', included: true },
      { text: 'Sua marca (Sem logo Konnexy)', included: true },
      { text: 'Cliques no WhatsApp ilimitados', included: true },
      { text: 'Saiba quem acessou seu perfil', included: true },
      { text: 'Selo Perfil Verificado', included: true },
    ],
    badge: 'Profissional',
    badgeColor: 'bg-gradient-to-r from-orange-500 to-pink-500',
    borderColor: 'border-primary',
    bgGradient: 'from-primary/5 to-purple-50',
    featured: true,
  },
];

export function PlanComparison() {
  return (
    <section className="py-32 relative overflow-hidden bg-gradient-to-b from-white via-slate-50 to-white dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
      {/* Background decoration */}
      <div className="absolute inset-0 opacity-[0.02]">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500 rounded-full blur-3xl" />
      </div>

      <div className="container relative z-10 px-6">
        {/* Section Header */}
        <div className="text-center max-w-4xl mx-auto mb-20 space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-[10px] font-black uppercase tracking-[0.4em]"
          >
            <Play className="w-3 h-3" />
            Comparação Visual
          </motion.div>
          
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-6xl font-black tracking-tighter"
          >
            Veja a diferença <br />
            <span className="gradient-text">em ação</span>
          </motion.h2>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-muted-foreground text-lg font-medium max-w-2xl mx-auto"
          >
            Compare lado a lado como seu cartão digital aparece no Plano Free versus o Plano Pro. 
            A diferença é visível e impactante.
          </motion.p>
        </div>

        {/* Comparison Grid */}
        <div className="grid md:grid-cols-2 gap-8 lg:gap-12 max-w-7xl mx-auto">
          {comparisonData.map((item, index) => (
            <motion.div
              key={item.plan}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.2 }}
              className={cn(
                "group relative rounded-[2.5rem] overflow-hidden transition-all duration-500",
                item.featured 
                  ? "md:scale-105 shadow-[0_40px_100px_-20px_rgba(59,130,246,0.3)]" 
                  : "shadow-[0_20px_50px_-15px_rgba(0,0,0,0.1)]"
              )}
            >
              {/* Card Background */}
              <div className={cn(
                "absolute inset-0 bg-gradient-to-br opacity-50",
                item.bgGradient
              )} />

              {/* Border Glow Effect */}
              <div className={cn(
                "absolute inset-0 border-2 rounded-[2.5rem]",
                item.borderColor,
                item.featured && "shadow-[inset_0_0_60px_rgba(59,130,246,0.1)]"
              )} />

              <div className="relative p-8 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl rounded-[2.5rem]">
                {/* Badge */}
                <div className="flex items-center justify-between mb-6">
                  <div className={cn(
                    "inline-flex items-center gap-2 px-4 py-2 rounded-full text-white text-[10px] font-black uppercase tracking-widest",
                    item.badgeColor
                  )}>
                    {item.featured ? (
                      <>
                        <Crown className="w-3 h-3" />
                        {item.badge}
                      </>
                    ) : (
                      <>{item.badge}</>
                    )}
                  </div>
                  
                  {item.featured && (
                    <div className="flex items-center gap-1 text-orange-500 text-xs font-bold">
                      <Sparkles className="w-4 h-4 animate-pulse" />
                      Recomendado
                    </div>
                  )}
                </div>

                {/* Title */}
                <div className="mb-6">
                  <h3 className="text-3xl font-black mb-2 tracking-tight">
                    {item.title}
                  </h3>
                  <p className="text-sm text-muted-foreground font-medium italic">
                    "{item.subtitle}"
                  </p>
                </div>

                {/* Image Container */}
                <div className="relative mb-8 rounded-2xl overflow-hidden bg-slate-900 aspect-[9/16] max-w-[280px] mx-auto shadow-2xl">
                  {/* Phone Frame Effect */}
                  <div className="absolute inset-0 z-10 pointer-events-none">
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-6 bg-slate-900 rounded-b-3xl" />
                  </div>
                  
                  <Image
                    src={item.imageSrc}
                    alt={`${item.title} Screenshot`}
                    fill
                    className="object-cover"
                    priority={item.featured}
                  />
                </div>

                {/* Highlights */}
                <div className="space-y-3">
                  {item.highlights.map((highlight, idx) => (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: index * 0.2 + idx * 0.05 }}
                      className="flex items-center gap-3"
                    >
                      <div className={cn(
                        "w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0",
                        highlight.included 
                          ? item.featured 
                            ? "bg-primary/10" 
                            : "bg-slate-100 dark:bg-slate-800"
                          : "bg-red-50 dark:bg-red-900/20"
                      )}>
                        {highlight.included ? (
                          <Check className={cn(
                            "w-3 h-3",
                            item.featured ? "text-primary" : "text-slate-600"
                          )} />
                        ) : (
                          <X className="w-3 h-3 text-red-500" />
                        )}
                      </div>
                      <span className={cn(
                        "text-sm font-bold",
                        highlight.included ? "text-slate-700 dark:text-slate-300" : "text-red-500 line-through"
                      )}>
                        {highlight.text}
                      </span>
                    </motion.div>
                  ))}
                </div>

                {/* Bottom CTA hint */}
                {item.featured && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.5 }}
                    className="mt-8 pt-6 border-t border-primary/20"
                  >
                    <p className="text-center text-xs font-black uppercase tracking-widest text-primary/80">
                      ⚡ Upgrade disponível abaixo
                    </p>
                  </motion.div>
                )}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Bottom Note */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.6 }}
          className="mt-16 text-center"
        >
          <p className="text-sm text-muted-foreground font-medium max-w-2xl mx-auto">
            💡 <strong>Dica:</strong> O Plano Pro inclui fundo em vídeo que roda em loop, 
            criando uma experiência muito mais profissional e memorável para seus clientes.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
