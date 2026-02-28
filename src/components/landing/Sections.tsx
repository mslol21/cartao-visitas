"use client";

import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { 
  ArrowRight, 
  Check, 
  Settings, 
  Share2, 
  UserPlus, 
  HelpCircle,
  Smartphone,
  Zap,
  Globe,
  ChevronDown
} from 'lucide-react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export function WhatIsSection() {
  return (
    <section className="py-32 bg-slate-950 relative overflow-hidden border-t border-white/5">
      <div className="absolute top-0 right-1/4 w-[400px] h-[400px] bg-primary/10 blur-[120px] rounded-full mix-blend-screen" />
      <div className="container px-6 relative z-10">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-black tracking-tighter text-white"
          >
            O que é um <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-primary">Cartão de Visitas Digital?</span>
          </motion.h2>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="grid md:grid-cols-2 gap-8 text-lg text-slate-400 font-medium leading-relaxed text-left"
          >
            <div className="p-8 rounded-[2rem] bg-white/5 border border-white/10 backdrop-blur-xl">
              <Globe className="w-8 h-8 text-blue-400 mb-6" />
              <p>
                É o fim dos cartões de papel que são perdidos ou jogados fora. Com a Konnexy, você tem um 
                <strong className="text-white"> link profissional </strong> 
                onde seus clientes encontram tudo o que precisam para te contratar em um só lugar.
              </p>
            </div>
            <div className="p-8 rounded-[2rem] bg-white/5 border border-white/10 backdrop-blur-xl">
              <Zap className="w-8 h-8 text-yellow-400 mb-6" />
              <p>
                Funciona como um <strong className="text-white">perfil digital inteligente</strong>: você compartilha pelo WhatsApp ou Instagram, o cliente salva seu contato na hora e já pode ver seus serviços sem precisar baixar nada.
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

export function HowItWorksSection() {
  const steps = [
    { 
      icon: UserPlus, 
      title: "1. Escolha seu nome", 
      desc: "Crie sua conta em segundos e defina o link personalizado do seu cartão." 
    },
    { 
      icon: Settings, 
      title: "2. Adicione dados", 
      desc: "Coloque sua foto, redes sociais e os serviços que você oferece." 
    },
    { 
      icon: Share2, 
      title: "3. Envie o Link", 
      desc: "Compartilhe com novos clientes e facilite o fechamento de negócios." 
    }
  ];

  return (
    <section className="py-32 bg-[#020617] relative">
      <div className="container px-6">
        <div className="max-w-4xl mx-auto text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-black tracking-tighter mb-4 text-white">
            Como funciona a Konnexy
          </h2>
          <p className="text-slate-400 text-lg">
            Seu cartão online pronto em 3 passos simples
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto relative z-10">
          <div className="absolute top-1/2 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary/20 to-transparent -translate-y-1/2 hidden md:block" />
          {steps.map((step, i) => (
             <motion.div 
               key={i}
               initial={{ opacity: 0, y: 30 }}
               whileInView={{ opacity: 1, y: 0 }}
               viewport={{ once: true }}
               transition={{ delay: i * 0.2 }}
               className="bg-slate-900/80 backdrop-blur-xl p-8 rounded-[2rem] shadow-2xl border border-white/10 relative text-center group hover:-translate-y-2 transition-transform duration-300"
             >
               <div className="w-16 h-16 mx-auto rounded-2xl bg-primary/20 text-primary flex items-center justify-center mb-6 shadow-[0_0_30px_rgba(59,130,246,0.2)] group-hover:scale-110 transition-transform duration-300">
                 <step.icon className="w-8 h-8" />
               </div>
               <h3 className="text-xl font-bold mb-3 text-white">{step.title}</h3>
               <p className="text-slate-400 leading-relaxed text-sm">
                 {step.desc}
               </p>
             </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function TargetAudienceSection() {
  const audience = [
    "Autônomos e Freelancers",
    "Corretores de Imóveis",
    "Advogados e Consultores",
    "Vendedores e Representantes",
    "Profissionais de Saúde",
    "Prestadores de Serviço"
  ];

  return (
    <section className="py-32 bg-slate-950 border-t border-white/5">
      <div className="container px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-black tracking-tighter mb-6 text-white">
            Feito para quem <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-primary">faz acontecer.</span>
          </h2>
          <p className="text-lg text-slate-400 mb-12 max-w-2xl mx-auto">
            A Konnexy é a escolha de profissionais que entendem que a <span className="font-bold text-white">primeira impressão é a que vende.</span>
          </p>
          
          <div className="flex flex-wrap justify-center gap-4">
            {audience.map((item, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                className="px-6 py-4 rounded-full bg-white/5 border border-white/10 font-bold text-slate-300 flex items-center gap-2 hover:bg-white/10 transition-colors shadow-xl"
              >
                <Check className="w-4 h-4 text-green-400" />
                {item}
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export function WhyChooseSection() {
  const benefits = [
    {
      title: "Agilidade no WhatsApp",
      desc: "Seu cliente te chama com um clique, sem precisar salvar seu número antes."
    },
    {
      title: "Economia Real",
      desc: "Nunca mais gaste dinheiro com gráficas ou cartões que ficam desatualizados."
    },
    {
      title: "Confiança Imediata",
      desc: "Passe uma imagem muito mais profissional e moderna para quem busca seus serviços."
    },
    {
      title: "Sempre com Você",
      desc: "Seu cartão está no seu celular. Você nunca mais vai dizer 'esqueci meu cartão'."
    }
  ];

  return (
    <section className="py-32 bg-[#020617] relative">
      <div className="absolute inset-0 bg-[url('/noise.png')] opacity-[0.03] mix-blend-overlay pointer-events-none" />
      <div className="container px-6 relative z-10">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-black tracking-tighter mb-6 text-white">
              Por que escolher a Konnexy?
            </h2>
          </div>
          
          <div className="grid md:grid-cols-2 gap-6">
            {benefits.map((b, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="flex gap-4 p-8 rounded-[2rem] bg-white/5 backdrop-blur-md border border-white/10 hover:border-white/20 hover:bg-white/10 transition-colors"
              >
                <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0 shadow-[0_0_20px_rgba(59,130,246,0.2)]">
                  <Check className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-bold text-lg mb-2 text-white">{b.title}</h3>
                  <p className="text-slate-400 text-sm">{b.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export function FAQSection() {
  const faqs = [
    {
      question: "É grátis de verdade?",
      answer: "Sim! Você pode criar seu cartão profissional sem custo e usar por tempo ilimitado. Temos um plano Pro para quem deseja recursos supremos de design, Temas e estatísticas."
    },
    {
      question: "Como eu envio para os clientes?",
      answer: "Você terá um link único (ex: konnexy.com.br/seu-nome). É só copiar e colar na bio do Instagram ou enviar direto na conversa do WhatsApp."
    },
    {
      question: "O cliente precisa baixar aplicativo?",
      answer: "Ninguém precisa baixar nada. O cartão abre instantaneamente no navegador de qualquer celular (iPhone ou Android)."
    },
    {
      question: "Posso mudar meu telefone depois?",
      answer: "Claro! Diferente do cartão impresso, aqui você altera foto, telefone ou serviços a qualquer momento e o link continua sempre o mesmo."
    }
  ];

  return (
    <section className="py-32 bg-slate-950 border-t border-white/5">
      <div className="container px-6">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-black tracking-tighter flex items-center justify-center gap-3 text-white">
              Dúvidas Frequentes
            </h2>
          </div>

          <Accordion type="single" collapsible className="w-full">
            {faqs.map((faq, i) => (
              <AccordionItem key={i} value={`item-${i}`} className="border-b border-white/10">
                <AccordionTrigger className="text-left font-bold text-lg py-6 text-slate-200 hover:text-white transition-colors">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-slate-400 text-base leading-relaxed pb-6">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  );
}

export function FinalCTASection() {
  return (
    <section className="py-32 relative overflow-hidden bg-[#020617] text-white">
      <div className="absolute inset-0 bg-gradient-to-t from-primary/20 via-transparent to-transparent opacity-60" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-600/20 blur-[150px] rounded-full mix-blend-screen" />
      <div className="container relative z-10 px-6">
        <div className="max-w-4xl mx-auto text-center space-y-10">
          <h2 className="text-5xl md:text-7xl font-black tracking-tighter">
            Não perca mais <br className="hidden md:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">oportunidade de negócio.</span>
          </h2>
          
          <p className="text-xl md:text-2xl text-slate-300 font-medium max-w-2xl mx-auto">
            Junte-se a milhares de profissionais que já modernizaram sua forma de vender.
          </p>
          
          <div className="pt-6 relative group inline-block">
            <div className="absolute -inset-2 bg-gradient-to-r from-primary to-purple-600 rounded-[2.5rem] blur-xl opacity-50 group-hover:opacity-100 transition duration-500" />
            <Button asChild className="relative w-full sm:w-auto h-20 px-12 rounded-[2rem] bg-slate-950 hover:bg-slate-900 border border-white/10 text-white text-lg md:text-xl font-black uppercase tracking-widest transition-all shadow-[0_0_50px_rgba(59,130,246,0.3)]">
              <Link href="/signup" className="flex items-center justify-center gap-3">
                <span className="text-center">Gerar Meu Link Profissional</span>
                <ArrowRight className="w-6 h-6 transition-transform group-hover:translate-x-2 shrink-0" />
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
