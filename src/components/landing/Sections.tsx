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
    <section className="py-24 bg-white dark:bg-slate-950">
      <div className="container px-6">
        <div className="max-w-4xl mx-auto flex flex-col md:flex-row items-center gap-12">
          <div className="flex-1 space-y-6">
            <motion.h2 
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="text-3xl md:text-4xl font-black tracking-tight"
            >
              O que é um <br />
              <span className="text-primary">Cartão de Visitas Digital?</span>
            </motion.h2>
            
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="text-lg text-slate-600 dark:text-slate-400 font-medium leading-relaxed space-y-4"
            >
              <p>
                É a evolução do cartão de papel. Em vez de entregar um papel que vai para o lixo, você envia um 
                <strong className="text-foreground"> link interativo </strong> 
                onde seu cliente pode te chamar no WhatsApp, ver seu portfólio, ou salvar seu contato com um clique.
              </p>
              <p>
                O <strong>card digital para autônomos</strong> da Konnexy funciona como um mini site otimizado para celular. 
                É leve, carrega na hora e você pode atualizar quando quiser, sem gastar com impressões.
              </p>
            </motion.div>
          </div>
          
          <div className="flex-1 flex justify-center">
             <div className="relative w-full max-w-sm aspect-square bg-slate-100 dark:bg-slate-900 rounded-[2rem] flex items-center justify-center">
                <Smartphone className="w-32 h-32 text-slate-200 dark:text-slate-800" />
                <div className="absolute inset-0 bg-gradient-to-tr from-primary/10 to-transparent rounded-[2rem]" />
             </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export function HowItWorksSection() {
  const steps = [
    { 
      icon: UserPlus, 
      title: "1. Crie sua conta grátis", 
      desc: "Cadastre-se rapidinho apenas com seu nome e email." 
    },
    { 
      icon: Settings, 
      title: "2. Personalize seu perfil", 
      desc: "Adicione foto, WhatsApp, redes sociais e escolha um tema." 
    },
    { 
      icon: Share2, 
      title: "3. Comece a compartilhar", 
      desc: "Envie seu link exclusivo para clientes e feche negócios." 
    }
  ];

  return (
    <section className="py-24 bg-slate-50 dark:bg-slate-900/50">
      <div className="container px-6">
        <div className="max-w-4xl mx-auto text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-black tracking-tight mb-4">
            Como funciona a Konnexy
          </h2>
          <p className="text-muted-foreground text-lg">
            Seu cartão online pronto em 3 passos simples
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {steps.map((step, i) => (
             <motion.div 
               key={i}
               initial={{ opacity: 0, y: 20 }}
               whileInView={{ opacity: 1, y: 0 }}
               viewport={{ once: true }}
               transition={{ delay: i * 0.2 }}
               className="bg-white dark:bg-slate-950 p-8 rounded-3xl shadow-lg border border-slate-100 dark:border-slate-900 relative"
             >
               <div className="w-14 h-14 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mb-6">
                 <step.icon className="w-7 h-7" />
               </div>
               <h3 className="text-xl font-bold mb-3">{step.title}</h3>
               <p className="text-muted-foreground leading-relaxed">
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
    <section className="py-24 bg-white dark:bg-slate-950">
      <div className="container px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-5xl font-black tracking-tight mb-6">
            Para quem é a <span className="text-primary">Konnexy?</span>
          </h2>
          <p className="text-lg text-muted-foreground mb-12 max-w-2xl mx-auto">
            Desenvolvemos o <span className="font-bold text-foreground">cartão de visitas digital perfeito</span> para quem precisa vender e se conectar rápido.
          </p>
          
          <div className="flex flex-wrap justify-center gap-4">
            {audience.map((item, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                className="px-6 py-4 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 font-bold text-slate-700 dark:text-slate-300 flex items-center gap-2"
              >
                <Check className="w-4 h-4 text-primary" />
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
      title: "100% Otimizado para WhatsApp",
      desc: "Seu cliente abre o cartão rápido e te chama em 1 clique."
    },
    {
      title: "Sempre Atualizado",
      desc: "Mudou de número? Atualize o cartão digital sem gastar nada."
    },
    {
      title: "Aparência Profissional",
      desc: "Mostre que você leva seu trabalho a sério com um design premium."
    },
    {
      title: "Grátis de Verdade",
      desc: "Comece sem pagar nada. O plano Free é vitalício."
    }
  ];

  return (
    <section className="py-24 bg-slate-50 dark:bg-slate-900/50">
      <div className="container px-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-black tracking-tight mb-6">
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
                className="flex gap-4 p-6 rounded-3xl bg-white dark:bg-slate-950 border border-slate-100 dark:border-slate-900"
              >
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <Check className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-bold text-lg mb-1">{b.title}</h3>
                  <p className="text-muted-foreground text-sm">{b.desc}</p>
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
      question: "O cartão de visitas digital é realmente grátis?",
      answer: "Sim! Na Konnexy você pode criar seu cartão digital gratuito e usar para sempre. Oferecemos também um plano Pro para quem quer recursos extras, como fundo em vídeo e analytics."
    },
    {
      question: "Como compartilho meu cartão de visitas?",
      answer: "Você recebe um link exclusivo (ex: konnexy.io/seunome). Você pode colocar esse link na bio do Instagram, enviar pelo WhatsApp ou gerar um QR Code."
    },
    {
      question: "Funciona em iPhone e Android?",
      answer: "Funciona perfeitamente em qualquer celular. Seu cartão é um site otimizado que abre direto no navegador, sem precisar instalar aplicativos."
    },
    {
      question: "Posso alterar minhas informações depois?",
      answer: "Com certeza. Diferente do cartão de papel, o cartão virtual permite que você edite telefone, foto e serviços a qualquer momento pelo nosso painel."
    }
  ];

  return (
    <section className="py-24 bg-white dark:bg-slate-950">
      <div className="container px-6">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-5xl font-black tracking-tight flex items-center justify-center gap-3">
              <HelpCircle className="w-8 h-8 md:w-10 md:h-10 text-primary" />
              Dúvidas Frequentes
            </h2>
          </div>

          <Accordion type="single" collapsible className="w-full">
            {faqs.map((faq, i) => (
              <AccordionItem key={i} value={`item-${i}`}>
                <AccordionTrigger className="text-left font-bold text-lg py-6">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground text-base leading-relaxed pb-6">
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
    <section className="py-24 relative overflow-hidden">
      <div className="absolute inset-0 bg-primary/5" />
      <div className="container relative z-10 px-6">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <h2 className="text-4xl md:text-6xl font-black tracking-tighter">
            Pare de perder clientes. <br />
            <span className="gradient-text">Comece agora sem custo.</span>
          </h2>
          
          <p className="text-lg md:text-xl text-muted-foreground font-medium max-w-2xl mx-auto">
            Junte-se a milhares de autônomos que modernizaram sua apresentação com a Konnexy.
          </p>
          
          <div className="pt-4">
            <Button asChild variant="hero" size="xl" className="w-full sm:w-auto h-16 sm:h-20 px-12 rounded-2xl sm:rounded-[2rem] text-xl font-black shadow-2xl shadow-primary/30 group hover:scale-105 transition-transform duration-300">
              <Link href="/signup">
                Criar cartão grátis em minutos
                <ArrowRight className="w-6 h-6 ml-3 transition-transform group-hover:translate-x-2" />
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
