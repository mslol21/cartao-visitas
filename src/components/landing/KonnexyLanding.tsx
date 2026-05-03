"use client";

import React from "react";
import { motion } from "framer-motion";
import { 
  CheckCircle2, 
  MessageSquare, 
  ShoppingCart, 
  LayoutList, 
  Store, 
  Scissors, 
  Shirt, 
  Factory, 
  ArrowRight,
  Phone,
  Link as LinkIcon,
  Clock,
  ThumbsUp,
  Smartphone
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Navbar } from "./Navbar";
import { Logo } from "../brand/Logo";

const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2
    }
  }
};

export function KonnexyLanding() {
  return (
    <div className="min-h-screen bg-[#0F172A] text-slate-100 font-sans selection:bg-amber-500/30 overflow-x-hidden">
      <Navbar />
      {/* Global Fixed Background */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <img 
          src="/hero-bg.png" 
          alt="Background" 
          className="w-full h-full object-cover opacity-20 mix-blend-luminosity"
        />
        <div className="absolute inset-0 bg-[#0F172A]/70" />
      </div>

      {/* 1. HERO SECTION */}
      <section className="relative pt-32 pb-20 overflow-hidden min-h-[90vh] flex items-center z-10">
        <div className="container relative z-10 px-4 mx-auto max-w-6xl">
          <div className="flex flex-col lg:flex-row items-center gap-12">
            <motion.div 
              className="flex-1 text-center lg:text-left"
              initial="hidden"
              animate="visible"
              variants={staggerContainer}
            >
              <motion.div variants={fadeIn} className="inline-block px-4 py-1.5 mb-6 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-sm font-medium">
                Soluções simples para pequenos negócios
              </motion.div>
              <motion.h1 variants={fadeIn} className="font-display text-4xl lg:text-6xl font-bold tracking-tight mb-4 leading-tight">
                Organize seu atendimento, pedidos e vendas no <span className="text-[#22C55E]">WhatsApp</span>
              </motion.h1>
              <motion.div variants={fadeIn} className="mb-8">
                <div className="flex items-center gap-2 mb-2 justify-center lg:justify-start">
                  <span className="text-amber-500 font-black text-sm tracking-[0.3em]">CONECTA • ORGANIZA • VENDE</span>
                </div>
                <p className="text-lg lg:text-xl text-slate-400 max-w-2xl mx-auto lg:mx-0">
                  Soluções simples para pequenos negócios venderem mais e se organizarem melhor. Tecnologia que aproxima, negócios que crescem.
                </p>
              </motion.div>
              <motion.div variants={fadeIn} className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start mb-8">
                <Button size="lg" className="bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white font-bold text-lg h-14 px-8 rounded-xl shadow-lg shadow-amber-500/20 transition-all">
                  Ver como funciona
                </Button>
                <Button size="lg" variant="outline" className="border-[#22C55E] text-[#22C55E] hover:bg-[#22C55E] hover:text-white bg-transparent font-medium text-lg h-14 px-8 rounded-xl transition-all" asChild>
                  <a href="https://wa.me/5516991551200?text=Olá, vi o site da Konnexy e gostaria de saber mais" target="_blank" rel="noopener noreferrer">
                    <Phone className="mr-2 h-5 w-5" />
                    Falar no WhatsApp
                  </a>
                </Button>
              </motion.div>
              <motion.div variants={fadeIn} className="flex items-center justify-center lg:justify-start gap-4 text-sm text-slate-400 font-medium">
                <span className="flex items-center gap-1.5"><Clock className="w-4 h-4 text-blue-400" /> Pronto em até 24h</span>
                <span className="text-slate-600">•</span>
                <span className="flex items-center gap-1.5"><ThumbsUp className="w-4 h-4 text-blue-400" /> Simples</span>
                <span className="text-slate-600">•</span>
                <span className="flex items-center gap-1.5"><Smartphone className="w-4 h-4 text-blue-400" /> Funciona no celular</span>
              </motion.div>
            </motion.div>
            
            <motion.div 
              className="flex-1 w-full max-w-md lg:max-w-none relative"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.7, delay: 0.2 }}
            >
              <div className="relative mx-auto w-[280px] h-[580px] bg-slate-900 rounded-[2.5rem] border-[8px] border-slate-800 shadow-2xl overflow-hidden ring-1 ring-white/10">
                <div className="absolute top-0 inset-x-0 h-6 bg-slate-800 rounded-b-3xl w-40 mx-auto z-20"></div>
                <div className="absolute inset-0 bg-gradient-to-b from-amber-600/10 to-slate-900 p-4 pt-10 flex flex-col gap-3">
                  {/* Mockup UI */}
                  <div className="bg-slate-800/80 rounded-xl p-3 flex items-center gap-3 border border-white/5">
                    <div className="w-12 h-12 bg-amber-500 rounded-full flex items-center justify-center shrink-0">
                      <Store className="text-white w-6 h-6" />
                    </div>
                    <div>
                      <div className="font-bold text-white text-sm">KONNEXY</div>
                      <div className="text-[8px] text-amber-500 font-bold uppercase tracking-wider">Conecta • Organiza • Vende</div>
                    </div>
                  </div>
                  <div className="space-y-2 mt-2">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="bg-slate-800/50 rounded-lg p-3 border border-white/5 flex gap-3 items-center">
                        <div className="w-16 h-16 bg-slate-700 rounded-md shrink-0"></div>
                        <div className="flex-1">
                          <div className="h-3 w-3/4 bg-slate-700 rounded mb-2"></div>
                          <div className="h-3 w-1/2 bg-amber-500/50 rounded"></div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="mt-auto">
                    <div className="bg-[#22C55E] text-white text-center py-3 rounded-xl font-bold text-sm shadow-lg">
                      Enviar Pedido
                    </div>
                  </div>
                </div>
              </div>
              {/* Decorative elements behind phone */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-amber-500/10 blur-[100px] -z-10 rounded-full"></div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* 2. PROBLEM SECTION */}
      <section className="py-24 bg-slate-950/80 backdrop-blur-md border-y border-white/5 relative z-10">
        <div className="container px-4 mx-auto max-w-5xl text-center">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
          >
            <motion.h2 variants={fadeIn} className="font-display text-3xl lg:text-4xl font-bold mb-12">
              Seu WhatsApp virou bagunça?
            </motion.h2>
            <div className="grid md:grid-cols-3 gap-8 mb-12">
              <motion.div variants={fadeIn} className="bg-slate-800/50 p-8 rounded-2xl border border-white/5">
                <MessageSquare className="w-10 h-10 text-red-400 mb-4 mx-auto" />
                <h3 className="text-xl font-semibold mb-2">Clientes perguntando tudo</h3>
                <p className="text-slate-400">Preço, horário, catálogo... As mesmas perguntas todos os dias.</p>
              </motion.div>
              <motion.div variants={fadeIn} className="bg-slate-800/50 p-8 rounded-2xl border border-white/5">
                <Smartphone className="w-10 h-10 text-orange-400 mb-4 mx-auto" />
                <h3 className="text-xl font-semibold mb-2">Você responde manualmente</h3>
                <p className="text-slate-400">Perdendo horas digitando os mesmos textos e enviando fotos.</p>
              </motion.div>
              <motion.div variants={fadeIn} className="bg-slate-800/50 p-8 rounded-2xl border border-white/5">
                <ShoppingCart className="w-10 h-10 text-yellow-400 mb-4 mx-auto" />
                <h3 className="text-xl font-semibold mb-2">Pedidos desorganizados</h3>
                <p className="text-slate-400">Informações perdidas no meio da conversa, causando erros.</p>
              </motion.div>
            </div>
            <motion.div variants={fadeIn} className="inline-block px-8 py-4 bg-red-500/10 border border-red-500/20 rounded-2xl">
              <p className="text-xl font-semibold text-red-400">
                Conclusão: Você trabalha mais e perde venda.
              </p>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* 3. SOLUTION SECTION */}
      <section className="py-24 relative z-10 bg-slate-900/40 backdrop-blur-sm">
        <div className="container px-4 mx-auto max-w-6xl">
          <motion.div 
            className="text-center mb-16"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeIn}
          >
            <h2 className="font-display text-3xl lg:text-4xl font-bold mb-4">
              A Konnexy organiza isso pra você
            </h2>
            <p className="text-xl text-slate-400 max-w-2xl mx-auto">
              O cliente vê tudo, escolhe sozinho e te envia o pedido pronto.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-4 gap-4 relative">
            {/* Connection line for desktop */}
            <div className="hidden md:block absolute top-1/2 left-0 w-full h-0.5 bg-gradient-to-r from-blue-500/0 via-blue-500/50 to-[#22C55E]/50 -translate-y-1/2 z-0"></div>
            
            {[
              { step: "1", title: "Entra no link", desc: "Cliente clica no seu link profissional." },
              { step: "2", title: "Visualiza", desc: "Vê seus produtos ou serviços com clareza." },
              { step: "3", title: "Organiza", desc: "Monta o pedido no próprio celular." },
              { step: "4", title: "Envia", desc: "Chega no seu WhatsApp formatado." },
            ].map((item, i) => (
              <motion.div 
                key={i}
                className="relative z-10 bg-slate-800 p-6 rounded-2xl border border-white/10 text-center shadow-xl"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <div className="w-12 h-12 rounded-full bg-[#2563EB] text-white flex items-center justify-center text-xl font-bold mx-auto mb-4 border-4 border-slate-900 shadow-lg shadow-blue-500/20">
                  {item.step}
                </div>
                <h3 className="text-lg font-bold mb-2">{item.title}</h3>
                <p className="text-sm text-slate-400">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. PLATFORM SECTION */}
      <section className="py-24 bg-slate-950/90 backdrop-blur-md border-y border-white/5 relative z-10">
        <div className="container px-4 mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="font-display text-3xl lg:text-4xl font-bold mb-6">
              Uma solução completa para organizar seu negócio
            </h2>
            <p className="text-xl text-blue-400 font-medium bg-blue-500/10 border border-blue-500/20 inline-block px-6 py-2 rounded-full">
              Você não precisa de vários sistemas. Precisa de um que funcione.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <motion.div 
              className="bg-gradient-to-b from-slate-800 to-slate-800/50 p-8 rounded-3xl border border-white/10 hover:border-blue-500/50 transition-colors"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <div className="w-14 h-14 bg-blue-500/20 rounded-2xl flex items-center justify-center mb-6">
                <LinkIcon className="w-7 h-7 text-blue-400" />
              </div>
              <h3 className="text-2xl font-bold mb-4 text-white">Presença Digital</h3>
              <ul className="space-y-3">
                <li className="flex items-start gap-3 text-slate-300">
                  <CheckCircle2 className="w-5 h-5 text-blue-400 shrink-0 mt-0.5" />
                  <span>Link profissional (Bio do Instagram)</span>
                </li>
                <li className="flex items-start gap-3 text-slate-300">
                  <CheckCircle2 className="w-5 h-5 text-blue-400 shrink-0 mt-0.5" />
                  <span>Página organizada e moderna</span>
                </li>
                <li className="flex items-start gap-3 text-slate-300">
                  <CheckCircle2 className="w-5 h-5 text-blue-400 shrink-0 mt-0.5" />
                  <span>Serviços e contatos fáceis de achar</span>
                </li>
              </ul>
            </motion.div>

            <motion.div 
              className="bg-gradient-to-b from-slate-800 to-slate-800/50 p-8 rounded-3xl border border-white/10 hover:border-green-500/50 transition-colors"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
            >
              <div className="w-14 h-14 bg-[#22C55E]/20 rounded-2xl flex items-center justify-center mb-6">
                <ShoppingCart className="w-7 h-7 text-[#22C55E]" />
              </div>
              <h3 className="text-2xl font-bold mb-4 text-white">Vendas</h3>
              <ul className="space-y-3">
                <li className="flex items-start gap-3 text-slate-300">
                  <CheckCircle2 className="w-5 h-5 text-[#22C55E] shrink-0 mt-0.5" />
                  <span>Catálogo ou cardápio digital</span>
                </li>
                <li className="flex items-start gap-3 text-slate-300">
                  <CheckCircle2 className="w-5 h-5 text-[#22C55E] shrink-0 mt-0.5" />
                  <span>Cliente monta o próprio pedido</span>
                </li>
                <li className="flex items-start gap-3 text-slate-300">
                  <CheckCircle2 className="w-5 h-5 text-[#22C55E] shrink-0 mt-0.5" />
                  <span>Pedido chega pronto no WhatsApp</span>
                </li>
              </ul>
            </motion.div>

            <motion.div 
              className="bg-gradient-to-b from-slate-800 to-slate-800/50 p-8 rounded-3xl border border-white/10 hover:border-purple-500/50 transition-colors"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
            >
              <div className="w-14 h-14 bg-purple-500/20 rounded-2xl flex items-center justify-center mb-6">
                <LayoutList className="w-7 h-7 text-purple-400" />
              </div>
              <h3 className="text-2xl font-bold mb-4 text-white">Operação</h3>
              <ul className="space-y-3">
                <li className="flex items-start gap-3 text-slate-300">
                  <CheckCircle2 className="w-5 h-5 text-purple-400 shrink-0 mt-0.5" />
                  <span>Organização de pedidos</span>
                </li>
                <li className="flex items-start gap-3 text-slate-300">
                  <CheckCircle2 className="w-5 h-5 text-purple-400 shrink-0 mt-0.5" />
                  <span>Menos erros na produção</span>
                </li>
                <li className="flex items-start gap-3 text-slate-300">
                  <CheckCircle2 className="w-5 h-5 text-purple-400 shrink-0 mt-0.5" />
                  <span>Fluxo de trabalho fluído</span>
                </li>
              </ul>
            </motion.div>
          </div>
        </div>
      </section>

      {/* 5. USE CASE SECTION */}
      <section className="py-24">
        <div className="container px-4 mx-auto max-w-5xl">
          <h2 className="font-display text-3xl lg:text-4xl font-bold text-center mb-12">
            Funciona para diferentes tipos de negócio
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { icon: Store, name: "Lanchonetes e Restaurantes" },
              { icon: Scissors, name: "Salões de Beleza e Estética" },
              { icon: Shirt, name: "Lojas de Roupas e Varejo" },
              { icon: Factory, name: "Pequenas Fábricas e Produção" }
            ].map((item, i) => (
              <motion.div 
                key={i}
                className="bg-slate-800/30 border border-slate-700 p-6 rounded-2xl text-center hover:bg-slate-800 transition-colors"
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <item.icon className="w-10 h-10 text-blue-400 mx-auto mb-4" />
                <h3 className="font-semibold text-slate-200">{item.name}</h3>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. BENEFITS */}
      <section className="py-20 bg-amber-950/30 backdrop-blur-sm border-y border-amber-500/20 relative z-10">
        <div className="container px-4 mx-auto max-w-6xl">
          <div className="flex flex-wrap justify-center gap-4 lg:gap-8">
            {[
              "Menos conversa repetitiva",
              "Mais pedidos fechados",
              "Atendimento mais rápido",
              "Mais organização",
              "Mais profissional"
            ].map((benefit, i) => (
              <div key={i} className="flex items-center gap-2 bg-slate-900/50 px-5 py-3 rounded-full border border-blue-500/20 shadow-sm">
                <CheckCircle2 className="w-5 h-5 text-[#22C55E]" />
                <span className="font-medium text-slate-200">{benefit}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 7. DEMO SECTION */}
      <section className="py-24 text-center">
        <div className="container px-4 mx-auto max-w-3xl">
          <h2 className="font-display text-3xl lg:text-4xl font-bold mb-8">
            Veja funcionando na prática
          </h2>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-slate-800 hover:bg-slate-700 text-white border border-slate-600 h-14 px-8 rounded-xl text-lg">
              Ver pedido pronto
            </Button>
            <Button size="lg" className="bg-slate-800 hover:bg-slate-700 text-white border border-slate-600 h-14 px-8 rounded-xl text-lg">
              Ver link profissional
            </Button>
          </div>
        </div>
      </section>

      {/* 8. SOCIAL PROOF */}
      <section className="py-24 bg-slate-950/80 backdrop-blur-md border-y border-white/5 relative z-10">
        <div className="container px-4 mx-auto max-w-5xl">
          <div className="grid md:grid-cols-2 gap-8">
            <motion.div 
              className="bg-slate-800 p-8 rounded-3xl border border-white/5 relative"
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <div className="text-4xl text-blue-500/40 font-serif absolute top-6 left-6">"</div>
              <p className="text-xl italic text-slate-300 relative z-10 pt-4 mb-6">
                Agora os clientes já chegam com o pedido pronto no WhatsApp. Economizo pelo menos 2 horas do meu dia que eu gastava só digitando preço.
              </p>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-blue-500/20 rounded-full flex items-center justify-center text-blue-400 font-bold">L</div>
                <div>
                  <div className="font-bold text-white">Lanchonete do Zé</div>
                  <div className="text-sm text-slate-400">Cliente Konnexy</div>
                </div>
              </div>
            </motion.div>
            <motion.div 
              className="bg-slate-800 p-8 rounded-3xl border border-white/5 relative"
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <div className="text-4xl text-blue-500/40 font-serif absolute top-6 left-6">"</div>
              <p className="text-xl italic text-slate-300 relative z-10 pt-4 mb-6">
                Organizou muito meu atendimento. A página fica linda e passa muita credibilidade para quem entra no meu Instagram.
              </p>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-pink-500/20 rounded-full flex items-center justify-center text-pink-400 font-bold">M</div>
                <div>
                  <div className="font-bold text-white">Maria Estética</div>
                  <div className="text-sm text-slate-400">Cliente Konnexy</div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* 9. PRICING / OFFER */}
      <section className="py-24">
        <div className="container px-4 mx-auto max-w-4xl text-center">
          <h2 className="font-display text-3xl lg:text-4xl font-bold mb-4">
            Simples, rápido e acessível
          </h2>
          <p className="text-xl text-slate-400 mb-12">Planos que cabem no bolso do pequeno negócio.</p>
          
          <div className="max-w-md mx-auto bg-slate-800 rounded-3xl border-2 border-amber-500 overflow-hidden shadow-2xl shadow-amber-500/20">
            <div className="bg-gradient-to-r from-amber-500 to-orange-600 py-4">
              <h3 className="text-xl font-bold text-white">Plano Essencial</h3>
            </div>
            <div className="p-8">
              <div className="mb-8 py-4 border-b border-white/5">
                <div className="text-4xl font-black text-white mb-2">Consultar Preço</div>
                <p className="text-slate-400 text-sm">Entre em contato para saber mais sobre o Plano Essencial e Setup Inicial</p>
              </div>
              
              <ul className="space-y-4 mb-8 text-left">
                <li className="flex items-center gap-3">
                  <CheckCircle2 className="w-5 h-5 text-[#22C55E]" />
                  <span>Link profissional completo</span>
                </li>
                <li className="flex items-center gap-3">
                  <CheckCircle2 className="w-5 h-5 text-[#22C55E]" />
                  <span>Catálogo de produtos / serviços</span>
                </li>
                <li className="flex items-center gap-3">
                  <CheckCircle2 className="w-5 h-5 text-[#22C55E]" />
                  <span>Pedidos diretos no WhatsApp</span>
                </li>
                <li className="flex items-center gap-3">
                  <CheckCircle2 className="w-5 h-5 text-[#22C55E]" />
                  <span>Suporte humanizado</span>
                </li>
              </ul>
              
              <Button className="w-full bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white h-14 text-lg font-bold rounded-xl" asChild>
                <a href="https://wa.me/5516991551200?text=Olá, tenho interesse no Plano Essencial da Konnexy" target="_blank" rel="noopener noreferrer">
                  Quero esse plano
                </a>
              </Button>
            </div>
          </div>
          
          <div className="mt-12 p-6 bg-slate-800/50 rounded-2xl border border-white/5 inline-block text-left max-w-lg">
            <h4 className="font-bold text-lg mb-2 flex items-center gap-2">
              <span className="text-blue-400">💡</span> Quer tudo integrado?
            </h4>
            <p className="text-slate-400 mb-4">Temos planos avançados para quem precisa de gestão completa de estoque e PDV.</p>
            <button className="text-blue-400 font-medium hover:text-blue-300 flex items-center gap-1">
              Conhecer planos maiores <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>

      {/* 10. FINAL CTA */}
      <section className="py-24 bg-gradient-to-b from-slate-950 to-amber-950/50 relative overflow-hidden z-10">
        {/* Floating WhatsApp button extra style context */}
        <div className="absolute inset-0 bg-[url('/noise.png')] opacity-20 mix-blend-overlay"></div>
        <div className="container px-4 mx-auto max-w-4xl text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
          >
            <h2 className="font-display text-4xl lg:text-5xl font-bold mb-6">
              Quer organizar seu negócio hoje?
            </h2>
            <p className="text-xl text-slate-300 mb-10 max-w-2xl mx-auto">
              Eu configuro tudo pra você e deixo funcionando rápido. Sem dor de cabeça, sem complicação.
            </p>
            <Button size="lg" className="bg-[#22C55E] hover:bg-green-600 text-white font-bold text-xl h-16 px-10 rounded-2xl shadow-xl shadow-green-500/20 transition-all hover:scale-105" asChild>
              <a href="https://wa.me/5516991551200?text=Olá, vi o site da Konnexy e gostaria de saber mais" target="_blank" rel="noopener noreferrer">
                <MessageSquare className="mr-3 h-6 w-6" />
                Falar no WhatsApp
              </a>
            </Button>
          </motion.div>
        </div>
      </section>
      
      {/* Floating WhatsApp Button */}
      <a 
        href="https://wa.me/5516991551200?text=Olá, vi o site da Konnexy e gostaria de saber mais" 
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 w-16 h-16 bg-[#22C55E] text-white rounded-full flex items-center justify-center shadow-lg shadow-green-500/30 hover:scale-110 transition-transform z-50 animate-bounce hover:animate-none"
        aria-label="Falar no WhatsApp"
      >
        <MessageSquare className="w-8 h-8" />
      </a>
    </div>
  );
}
