"use client";

import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ArrowRight, Check, X, Smartphone, Zap, UserCheck, BarChart3, Video, ShieldCheck } from 'lucide-react';

export function ProblemSection() {
  return (
    <section className="py-24 bg-white dark:bg-slate-950">
      <div className="container px-6">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-5xl font-black tracking-tight"
          >
            Ainda usa cartão físico ou <br />
            <span className="text-red-500">PDF no WhatsApp?</span>
          </motion.h2>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-lg text-muted-foreground font-medium leading-relaxed max-w-2xl mx-auto"
          >
            <p className="mb-4">
              Autônomos perdem clientes todos os dias por não terem uma apresentação profissional.
              Cartão acaba, contato se perde e a primeira impressão não volta.
            </p>
            <p className="text-foreground font-bold">
              A Konnexy resolve isso com um cartão de visitas digital simples, bonito e sempre disponível no celular.
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

export function AboutSection() {
  return (
    <section className="py-24 bg-slate-50 dark:bg-slate-900/50">
      <div className="container px-6">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-5xl font-black tracking-tight"
          >
            Seu cartão de visitas, <br />
            <span className="gradient-text">sempre no celular</span>
          </motion.h2>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-lg text-muted-foreground font-medium leading-relaxed max-w-2xl mx-auto"
          >
            <p className="mb-4">
              Com a Konnexy, você cria um link profissional único com seus dados, serviços e botão direto para contato.
            </p>
            <p className="text-foreground font-bold">
              Basta compartilhar o link e pronto. Sem papel, sem complicação.
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

export function WhyChooseSection() {
  const benefits = [
    "Aparência profissional em qualquer lugar",
    "Link único para compartilhar no WhatsApp, Instagram ou QR Code",
    "Cliente fala com você em 1 clique",
    "Atualize seus dados sem refazer cartão",
    "Funciona em qualquer celular"
  ];

  return (
    <section className="py-24 bg-white dark:bg-slate-950">
      <div className="container px-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-black tracking-tight mb-6">
              Por que autônomos escolhem a <span className="text-primary">Konnexy?</span>
            </h2>
          </div>
          
          <div className="grid sm:grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto">
            {benefits.map((benefit, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="flex items-center gap-4 p-4 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800"
              >
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <Check className="w-4 h-4 text-primary" />
                </div>
                <span className="font-bold text-slate-700 dark:text-slate-300">
                  {benefit}
                </span>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export function TargetAudienceSection() {
  const audience = [
    "Corretores",
    "Prestadores de serviço",
    "Designers e freelancers",
    "Consultores",
    "Vendedores",
    "Profissionais liberais"
  ];

  return (
    <section className="py-24 bg-slate-50 dark:bg-slate-900/50">
      <div className="container px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-5xl font-black tracking-tight mb-8">
            Ideal para quem <br />
            <span className="gradient-text">trabalha por conta própria</span>
          </h2>
          
          <div className="flex flex-wrap justify-center gap-4 max-w-3xl mx-auto mb-10">
            {audience.map((item, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                className="px-6 py-3 rounded-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm font-bold text-slate-700 dark:text-slate-300"
              >
                {item}
              </motion.div>
            ))}
          </div>
          
          <p className="text-lg font-medium text-muted-foreground">
            Se você vive de contato, a Konnexy é pra você.
          </p>
        </div>
      </div>
    </section>
  );
}

export function TrustSection() {
  return (
    <section className="py-24 bg-white dark:bg-slate-950">
      <div className="container px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-5xl font-black tracking-tight mb-12">
            Simples, rápido e seguro
          </h2>
          
          <div className="flex flex-col md:flex-row justify-center items-center gap-8 md:gap-16">
            <div className="flex flex-col items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
                <ShieldCheck className="w-8 h-8" />
              </div>
              <p className="font-bold max-w-[200px]">Sem cartão de crédito para começar</p>
            </div>
            <div className="flex flex-col items-center gap-4">
               <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
                <Zap className="w-8 h-8" />
              </div>
              <p className="font-bold max-w-[200px]">Criado em menos de 2 minutos</p>
            </div>
            <div className="flex flex-col items-center gap-4">
               <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
                <UserCheck className="w-8 h-8" />
              </div>
              <p className="font-bold max-w-[200px]">Feito para autônomos no Brasil</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export function FinalCTASection() {
  return (
    <section className="py-24 relative overflow-hidden">
      <div className="absolute inset-0 bg-primary/5" />
      <div className="container relative z-10 px-6">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <h2 className="text-4xl md:text-6xl font-black tracking-tighter">
            Comece agora seu <br />
            <span className="gradient-text">cartão de visitas digital</span>
          </h2>
          
          <p className="text-lg md:text-xl text-muted-foreground font-medium max-w-2xl mx-auto">
            Crie seu cartão gratuitamente e comece a passar mais profissionalismo hoje.
          </p>
          
          <div className="pt-4">
            <Button asChild variant="hero" size="xl" className="w-full sm:w-auto h-16 sm:h-20 px-12 rounded-2xl sm:rounded-[2rem] text-xl font-black shadow-2xl shadow-primary/30 group hover:scale-105 transition-transform duration-300">
              <Link href="/signup">
                Criar cartão grátis agora
                <ArrowRight className="w-6 h-6 ml-3 transition-transform group-hover:translate-x-2" />
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
