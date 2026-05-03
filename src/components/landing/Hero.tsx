"use client";

import { ArrowRight, Sparkles, Smartphone, ShieldCheck, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { motion } from 'framer-motion';

export function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20 bg-[#0F172A]">
      {/* Immersive Fixed Background */}
      <div className="fixed inset-0 z-0">
        <img 
          src="/hero-bg.png" 
          alt="Background" 
          className="w-full h-full object-cover opacity-30 mix-blend-luminosity"
        />
        <div className="absolute inset-0 bg-[#0F172A]/80" />
      </div>

      <div className="container relative z-10 px-6 py-20">
        <div className="max-w-5xl mx-auto text-center space-y-10">
          
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-6 py-2 rounded-full border border-amber-500/20 bg-amber-500/5 backdrop-blur-xl mb-6 shadow-2xl"
          >
            <Sparkles className="w-4 h-4 text-amber-500 animate-pulse" />
            <span className="text-sm font-bold text-white uppercase tracking-widest">O Futuro do Networking</span>
            <span className="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-400 text-[10px] font-black uppercase">2026</span>
          </motion.div>

          {/* Main Heading */}
          <div className="space-y-6">
            <motion.h1 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1, duration: 0.8 }}
              className="text-5xl sm:text-6xl md:text-8xl font-black tracking-tighter leading-[1.05] text-white"
            >
              Seu cartão digital <br className="hidden sm:block" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-orange-500 to-amber-600">
                que fecha negócios
              </span>
            </motion.h1>

            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="text-lg md:text-2xl text-slate-300 max-w-3xl mx-auto font-medium leading-relaxed"
            >
              A forma mais inovadora de passar confiança, facilitar o contato pelo WhatsApp e conquistar mais clientes. 
              <strong className="text-white"> Diga adeus ao papel.</strong>
            </motion.p>
          </div>

          {/* Quick Benefits */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="flex flex-wrap items-center justify-center gap-4 py-8"
          >
            {[
              { icon: Smartphone, label: "Funciona no celular" },
              { icon: Zap, label: "Botão Rápido pro WhatsApp" },
              { icon: ShieldCheck, label: "Não precisa baixar app" }
            ].map((benefit, i) => (
              <div key={i} className="flex items-center gap-3 px-5 py-3 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md">
                 <div className="w-8 h-8 rounded-full bg-amber-500/20 flex items-center justify-center text-amber-500">
                    <benefit.icon className="w-4 h-4" />
                 </div>
                 <span className="text-sm font-bold text-slate-200">{benefit.label}</span>
              </div>
            ))}
          </motion.div>

          {/* CTAs */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="flex flex-col items-center gap-6 mt-8"
          >
            <div className="relative group w-full sm:w-auto">
              <div className="absolute -inset-1 bg-gradient-to-r from-amber-500 to-orange-600 rounded-[2.5rem] blur opacity-60 group-hover:opacity-100 transition duration-500" />
              <Button asChild className="relative w-full sm:w-auto h-20 px-12 rounded-[2rem] bg-slate-950 hover:bg-slate-900 border border-white/10 text-white text-lg md:text-xl font-black uppercase tracking-widest transition-all">
                <a href="https://wa.me/5516991551200?text=Ol%C3%A1%2C%20gostaria%20de%20me%20cadastrar" target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-3">
                  Gerar Meu Link Grátis
                  <ArrowRight className="w-6 h-6 transition-transform group-hover:translate-x-2" />
                </a>
              </Button>
            </div>
            
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-slate-500">
              Crie em 2 minutos • Grátis para sempre
            </p>
          </motion.div>
        </div>
      </div>

      {/* Fade out to next section */}
      <div className="absolute bottom-0 left-0 w-full h-40 bg-gradient-to-t from-[#0F172A] to-transparent pointer-events-none" />
    </section>
  );
}
