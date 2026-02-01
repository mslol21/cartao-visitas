"use client";

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
          
          {/* Badge */}
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-3 px-6 py-2 rounded-full glass border border-primary/20 shadow-2xl shadow-primary/10"
          >
            <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-primary">
              Plataforma Premium de Networking
            </span>
          </motion.div>

          {/* Main Heading */}
          <div className="space-y-6">
            <motion.h1 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1, duration: 0.8 }}
              className="text-5xl md:text-8xl font-black tracking-tighter leading-[0.9]"
            >
              Seu Sucesso Começa <br />
              Com Um <span className="gradient-text">Link Único.</span>
            </motion.h1>

            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto font-medium leading-relaxed"
            >
              Transformamos seu contato em uma experiência premium. 
              Crie seu cartão de visita digital em segundos e conecte-se 
              com o mundo de forma profissional e escalável.
            </motion.p>
          </div>

          {/* Social Proof & Features */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="flex flex-wrap items-center justify-center gap-8 py-4 px-8 border-y border-border/10"
          >
            <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-muted-foreground">
               <ShieldCheck className="w-4 h-4 text-primary" /> Perfil Verificado
            </div>
            <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-muted-foreground">
               <Zap className="w-4 h-4 text-primary fill-current" /> Instant Setup
            </div>
            <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-muted-foreground">
               <Smartphone className="w-4 h-4 text-primary" /> Mobile First
            </div>
          </motion.div>

          {/* CTAs */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Button asChild variant="hero" size="xl" className="h-20 px-10 rounded-[2rem] text-lg font-black shadow-2xl shadow-primary/30 group">
              <Link href="/signup">
                Começar Gratuitamente
                <ArrowRight className="w-6 h-6 ml-3 transition-transform group-hover:translate-x-2" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="xl" className="h-20 px-10 rounded-[2rem] text-lg font-black border-2 hover:bg-slate-50 dark:hover:bg-slate-900 shadow-xl transition-all">
              <a href="#como-funciona">
                Ver Demonstração
              </a>
            </Button>
          </motion.div>

          {/* Platform Stat */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="pt-10 flex flex-col items-center gap-4"
          >
            <div className="flex -space-x-3">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="w-12 h-12 rounded-2xl bg-slate-200 dark:bg-slate-800 border-4 border-slate-50 dark:border-slate-950 flex items-center justify-center text-xs font-black">
                   {String.fromCharCode(64 + i)}
                </div>
              ))}
              <div className="w-12 h-12 rounded-2xl bg-primary text-white border-4 border-slate-50 dark:border-slate-950 flex items-center justify-center text-[10px] font-black">
                +2k
              </div>
            </div>
            <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">
               Junte-se a <span className="text-foreground">2240+ profissionais</span> de elite
            </p>
          </motion.div>
        </div>
      </div>

      {/* Hero Visuals */}
      <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-slate-50 dark:from-slate-950 to-transparent pointer-events-none" />
    </section>
  );
}
