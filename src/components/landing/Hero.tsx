o "use client";

import { ArrowRight, Sparkles, Smartphone, ShieldCheck, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { motion } from 'framer-motion';

export function Hero() {
  return (
    <section className="relative min-h-[95vh] flex items-center justify-center overflow-hidden pt-20">
      {/* Premium Background */}
      <div className="absolute inset-0 bg-slate-50 dark:bg-slate-950" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-primary/10 via-transparent to-transparent opacity-60" />
      
      {/* Floating Elements */}
      <motion.div 
        animate={{ y: [0, -20, 0] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-40 left-[10%] w-64 h-64 bg-primary/10 rounded-full blur-[100px]" 
      />
      <motion.div 
        animate={{ y: [0, 20, 0] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        className="absolute bottom-40 right-[10%] w-80 h-80 bg-blue-600/10 rounded-full blur-[120px]" 
      />

      <div className="container relative z-10 px-6 py-20">
        <div className="max-w-5xl mx-auto text-center space-y-12">
          
          {/* Main Heading */}
          <div className="space-y-6">
            <motion.h1 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1, duration: 0.8 }}
              className="text-4xl sm:text-5xl md:text-7xl font-black tracking-tighter leading-[1.1]"
            >
              Crie seu <br className="hidden sm:block" />
              <span className="gradient-text">Cartão de Visitas Digital</span> <br />
              Grátis e Profissional
            </motion.h1>

            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto font-medium leading-relaxed"
            >
              A Konnexy é a solução ideal para autônomos e prestadores de serviço que querem vender mais. 
              Tenha um <strong>cartão de visitas virtual</strong>, interativo e pronto para compartilhar no WhatsApp. 
              Sem taxas, sem complicação.
            </motion.p>
          </div>

          {/* Quick Benefits */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="flex flex-wrap items-center justify-center gap-x-6 gap-y-3 py-4"
          >
            {[
              "100% Gratuito para começar",
              "Botão direto para WhatsApp",
              "Visual incrível no celular",
              "Link único na bio"
            ].map((benefit, i) => (
              <div key={i} className="flex items-center gap-2 text-sm font-bold text-slate-700 dark:text-slate-300">
                 <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                 {benefit}
              </div>
            ))}
          </motion.div>

          {/* CTAs */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="flex flex-col items-center gap-4"
          >
            <Button asChild variant="hero" size="xl" className="w-full sm:w-auto h-auto min-h-[4rem] sm:h-20 px-6 sm:px-12 py-4 sm:py-0 rounded-2xl sm:rounded-[2rem] text-sm sm:text-lg md:text-xl font-black shadow-2xl shadow-primary/30 group hover:scale-105 transition-transform duration-300">
              <Link href="/signup" className="flex items-center justify-center gap-2">
                Criar cartão grátis agora
                <ArrowRight className="w-5 h-5 sm:w-6 sm:h-6 transition-transform group-hover:translate-x-2" />
              </Link>
            </Button>
            
            <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground/60">
              Sem cartão de crédito • Criado em menos de 2 minutos
            </p>
          </motion.div>
        </div>
      </div>

      {/* Hero Visuals */}
      <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-slate-50 dark:from-slate-950 to-transparent pointer-events-none" />
    </section>
  );
}
