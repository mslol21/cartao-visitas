"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Check, 
  ChevronRight, 
  ArrowRight, 
  Sparkles, 
  Smartphone, 
  Instagram, 
  MessageCircle, 
  ShoppingCart, 
  Share2, 
  Grid, 
  Tag, 
  Globe, 
  Zap, 
  BarChart3, 
  CheckCircle2, 
  Store, 
  Scissors, 
  UtensilsCrossed, 
  Dog, 
  LayoutDashboard, 
  Clock, 
  ThumbsUp, 
  ChevronDown, 
  Shield, 
  Award,
  Stethoscope,
  Music,
  Compass,
  Building,
  Calendar,
  X
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Navbar } from "./Navbar";
import { Footer } from "./Footer";
import { Pricing } from "./Pricing";
import Image from "next/image";

// Niches config
const SEGMENTOS = [
  { name: "Pet Shops", icon: Dog },
  { name: "Clínicas", icon: Stethoscope },
  { name: "Músicos", icon: Music },
  { name: "Bandas", icon: Music },
  { name: "Artistas", icon: Sparkles },
  { name: "Confeitarias", icon: UtensilsCrossed },
  { name: "Construtoras", icon: Building },
  { name: "Eventos", icon: Calendar },
  { name: "Restaurantes", icon: UtensilsCrossed },
  { name: "Adegas", icon: Store },
  { name: "Lojas", icon: ShoppingCart },
  { name: "Escritórios", icon: Shield },
  { name: "Prestadores de serviço", icon: Scissors },
  { name: "Consultores", icon: BarChart3 }
];

const PRODUTOS = [
  {
    id: "pet",
    title: "Konnexy Pet",
    description: "Plataforma completa para Pet Shops.",
    longDesc: "Gerencie banho e tosa, histórico de pets, vendas de produtos e a comunicação com os tutores de forma unificada.",
    icon: Dog,
    image: "/images/landing/demo_petshop.png",
    recursos: [
      "Site profissional",
      "Agendamento Online",
      "CRM integrado",
      "Cadastro de Clientes & Pets",
      "Controle Financeiro",
      "Controle de Estoque",
      "Programa de Fidelidade",
      "Área do Tutor",
      "Marketing por WhatsApp",
      "Dashboard Executivo"
    ]
  },
  {
    id: "catalogo",
    title: "Konnexy Catálogo",
    description: "Catálogo Digital integrado ao WhatsApp.",
    longDesc: "Exiba seus produtos online, permita que clientes montem carrinhos e receba pedidos organizados diretamente no WhatsApp.",
    icon: ShoppingCart,
    image: "/images/landing/demo_catalogo.png",
    idealFor: "Adegas, Lojas, Restaurantes, Hamburguerias, Docerias, Delivery",
    recursos: [
      "Exibição de Produtos",
      "Carrinho de compras",
      "Pagamento por PIX",
      "Taxa de entrega automática",
      "Organização por Categorias",
      "Domínio próprio conectado"
    ]
  },
  {
    id: "link",
    title: "Konnexy Link",
    description: "Página profissional semelhante ao Linktree.",
    longDesc: "Centralize seus canais de atendimento, redes sociais, músicas e portfólio em uma única URL premium de alta conversão.",
    icon: Share2,
    image: "/images/landing/demo_link.png",
    idealFor: "Músicos, Bandas, Influenciadores, Empresas, Criadores de conteúdo",
    recursos: [
      "Redes sociais integradas",
      "Widget Spotify",
      "Vídeos do YouTube",
      "Agenda de Shows/Eventos",
      "Portfólio & Galeria",
      "Botão flutuante WhatsApp",
      "Galeria de Fotos"
    ]
  },
  {
    id: "vitrine",
    title: "Konnexy Vitrine",
    description: "Catálogo profissional para quem vende produtos personalizados.",
    longDesc: "Mostre a essência dos seus produtos sob encomenda ou artesanais. Organize o fluxo de pedidos sem complicações.",
    icon: Tag,
    image: "/images/landing/demo_vitrine.png",
    idealFor: "Artesanato, Decoração, Artistas plásticos, Papelaria, Produtos personalizados",
    recursos: [
      "Catálogo de Imagens",
      "Galeria de inspirações",
      "Pedido direto via WhatsApp",
      "Filtro por Categorias",
      "Produtos ilimitados"
    ]
  },
  {
    id: "sites",
    title: "Konnexy Sites",
    description: "Landing Pages profissionais.",
    longDesc: "Destaque seus serviços e capte mais contatos qualificados através de páginas institucionais velozes e otimizadas.",
    icon: Globe,
    image: "/images/landing/demo_landing.png",
    idealFor: "Clínicas, Escritórios, Construtoras, Empresas, Eventos, Prestadores de serviço",
    recursos: [
      "Otimização SEO avançada",
      "Formulários de captação",
      "Integração com WhatsApp",
      "Google Maps incorporado",
      "Alta performance em celulares"
    ]
  }
];

const DEMONSTRACOES = [
  { name: "Pet Shop (Konnexy Pet)", image: "/images/landing/demo_petshop.png" },
  { name: "Catálogo Digital (Konnexy Catálogo)", image: "/images/landing/demo_catalogo.png" },
  { name: "Vitrine de Beleza (Konnexy Vitrine)", image: "/images/landing/demo_vitrine.png" },
  { name: "Link Profissional (Konnexy Link)", image: "/images/landing/demo_link.png" },
  { name: "Landing Pages (Konnexy Sites)", image: "/images/landing/demo_landing.png" },
  { name: "Painel Administrativo", image: "/images/landing/demo_admin.png" }
];

const FAQS = [
  {
    question: "Quanto tempo leva a implantação?",
    answer: "A implantação padrão das soluções Konnexy Link e Catálogo leva até 48 horas após o envio dos dados. Para Landing Pages (Konnexy Sites) e plataformas complexas como o Konnexy Pet, o prazo varia entre 5 a 10 dias úteis, conforme as personalizações acordadas."
  },
  {
    question: "Posso usar meu domínio próprio?",
    answer: "Com certeza! Em todas as nossas soluções (exceto no plano básico do Konnexy Link), você pode associar um domínio próprio (ex: www.seudominio.com.br). Nós nos encarregamos de toda a configuração do servidor e do certificado de segurança SSL."
  },
  {
    question: "Existe fidelidade?",
    answer: "Não há fidelidade obrigatória nos nossos planos recorrentes. Você pode cancelar sua assinatura mensal quando desejar, sem multas ou taxas adicionais. Para serviços sem mensalidade, você paga apenas a taxa de desenvolvimento inicial."
  },
  {
    question: "O sistema funciona no celular?",
    answer: "Sim. Todas as soluções desenvolvidas pela Konnexy são 100% responsivas, criadas sob o conceito Mobile-First. Seus clientes e tutores terão uma experiência similar a de um aplicativo, com velocidade e navegação fluida."
  },
  {
    question: "Vocês oferecem suporte?",
    answer: "Sim, oferecemos suporte prioritário diretamente via WhatsApp em horário comercial para tirar dúvidas, auxiliar na gestão da plataforma e realizar eventuais ajustes ou atualizações."
  },
  {
    question: "Posso solicitar personalizações?",
    answer: "Como somos uma empresa de tecnologia focada em plataformas digitais sob medida, você pode solicitar recursos adicionais personalizados. Nosso time técnico analisa as suas necessidades e desenvolve o módulo ideal para seu modelo de negócio."
  }
];

export function KonnexyLanding() {
  const [openFaqIdx, setOpenFaqIdx] = useState<number | null>(null);
  const [selectedDemoImage, setSelectedDemoImage] = useState<string | null>(null);

  const toggleFaq = (idx: number) => {
    setOpenFaqIdx(openFaqIdx === idx ? null : idx);
  };

  return (
    <div className="bg-[#030c1b] text-slate-155 font-sans min-h-screen selection:bg-[#EADBB9]/30 selection:text-white relative overflow-x-hidden">
      
      {/* Navbar */}
      <Navbar />

      {/* ── HERO SECTION (Stripe/Vercel style) ── */}
      <section className="relative pt-32 pb-24 md:pt-40 md:pb-36 flex flex-col justify-center items-center overflow-hidden border-b border-white/5">
        {/* Glow Effects */}
        <div className="absolute top-[-100px] left-1/2 -translate-x-1/2 w-[900px] h-[350px] rounded-full bg-[#EADBB9]/5 blur-[130px] pointer-events-none" />
        <div className="absolute bottom-[10%] right-[-10%] w-[350px] h-[350px] rounded-full bg-[#C5CAD2]/5 blur-[120px] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-16 items-center relative z-10 w-full">
          {/* Left Column (Text & CTAs) */}
          <div className="lg:col-span-7 space-y-8 text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#EADBB9]/10 border border-[#EADBB9]/20 text-[#EADBB9] text-[10px] font-black uppercase tracking-widest">
              <Sparkles className="w-3.5 h-3.5" />
              Tecnologia & Desenvolvimento Premium
            </div>
            
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white leading-[1.08] tracking-tight font-display">
              Tecnologia para transformar a gestão e as vendas do seu negócio.
            </h1>
            
            <p className="text-slate-400 text-sm sm:text-base lg:text-lg leading-relaxed max-w-2xl">
              A Konnexy desenvolve plataformas digitais personalizadas que ajudam empresas a vender mais, organizar processos e oferecer uma experiência profissional aos seus clientes.
            </p>

            <div className="flex flex-wrap items-center gap-4">
              <Button asChild className="h-14 px-8 rounded-2xl text-xs font-black uppercase tracking-widest bg-gradient-to-r from-[#EADBB9] to-[#C5CAD2] hover:from-[#f3e7d3] hover:to-[#d2d6dd] text-white shadow-xl shadow-amber-500/5 transition-all hover:scale-[1.02] active:scale-95 border border-[#EADBB9]/20">
                <a href="#produtos">
                  Conhecer Soluções
                </a>
              </Button>
              <Button asChild variant="outline" className="h-14 px-8 rounded-2xl text-xs font-black uppercase tracking-widest border border-white/10 hover:border-white/20 hover:bg-white/5 text-white transition-all">
                <a href="https://wa.me/5516991551200?text=Olá,%20gostaria%20de%20solicitar%20uma%20demonstração%20das%20soluções%20da%20Konnexy" target="_blank" rel="noopener noreferrer">
                  Solicitar Demonstração
                </a>
              </Button>
            </div>
          </div>

          {/* Right Column (Mockups & Floating Stats) */}
          <div className="lg:col-span-5 relative flex justify-center items-center mt-10 lg:mt-0">
            {/* Visual background circles */}
            <div className="absolute w-[350px] h-[350px] rounded-full border border-white/5 scale-120 animate-pulse pointer-events-none" style={{ animationDuration: '6s' }} />

            {/* Devices Composition Mockup */}
            <div className="relative z-10 w-full max-w-[460px] aspect-[4/3] rounded-[2rem] overflow-hidden border border-white/10 shadow-2xl shadow-black/80">
              <Image 
                src="/images/landing/hero_devices.png" 
                alt="Konnexy Multi-device Platform Preview" 
                fill
                className="object-cover"
                priority
              />
            </div>

            {/* Floating Info Cards (Linear style) */}
            <div className="absolute top-[-20px] left-[-20px] z-20 bg-slate-950/85 backdrop-blur-md border border-white/10 rounded-2xl p-4 shadow-xl flex items-center gap-3 animate-bounce" style={{ animationDuration: '4s' }}>
              <div className="w-8 h-8 rounded-xl bg-emerald-500/25 flex items-center justify-center text-emerald-400">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <div>
                <p className="text-[10px] text-slate-500 uppercase tracking-wider font-bold">Pedidos recebidos</p>
                <p className="text-xs font-black text-white">Prontos p/ entrega</p>
              </div>
            </div>

            <div className="absolute bottom-[20px] right-[-20px] z-20 bg-slate-950/85 backdrop-blur-md border border-white/10 rounded-2xl p-4 shadow-xl flex items-center gap-3 animate-bounce" style={{ animationDuration: '5s', animationDelay: '1s' }}>
              <div className="w-8 h-8 rounded-xl bg-[#EADBB9]/25 flex items-center justify-center text-[#EADBB9]">
                <Calendar className="w-5 h-5" />
              </div>
              <div>
                <p className="text-[10px] text-slate-500 uppercase tracking-wider font-bold">Agendamentos</p>
                <p className="text-xs font-black text-white">Sincronizados na agenda</p>
              </div>
            </div>

            <div className="absolute bottom-[-30px] left-[30px] z-20 bg-slate-950/85 backdrop-blur-md border border-white/10 rounded-2xl p-3 px-4 shadow-xl flex items-center gap-3">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              <span className="text-[11px] font-bold text-slate-350">Clientes Ativos: +1.200</span>
            </div>
          </div>
        </div>
      </section>

      {/* ── NOSSOS PRODUTOS SECTION ── */}
      <section id="produtos" className="py-24 max-w-7xl mx-auto px-6 relative border-b border-white/5">
        <div className="text-center max-w-3xl mx-auto mb-20">
          <span className="text-xs font-black uppercase tracking-[0.3em] text-[#EADBB9] mb-3 block">Nossos Produtos</span>
          <h2 className="text-4xl md:text-5xl font-black text-white leading-tight font-display mb-4">
            Plataformas digitais desenhadas para o seu nicho.
          </h2>
          <p className="text-slate-400 text-sm md:text-base max-w-xl mx-auto leading-relaxed">
            Esqueça sistemas engessados. Desenvolvemos interfaces intuitivas integradas e prontas para uso.
          </p>
        </div>

        {/* Product Cards Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {PRODUTOS.map((product, idx) => {
            const Icon = product.icon;
            return (
              <div 
                key={product.id}
                className="bg-[#081426]/90 border border-white/5 hover:border-white/10 rounded-[2.2rem] p-8 flex flex-col justify-between transition-all duration-300 hover:y-[-6px] relative group"
              >
                <div>
                  {/* Card Header & Icon */}
                  <div className="flex items-center justify-between mb-6">
                    <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center text-[#EADBB9] group-hover:bg-[#EADBB9]/10 transition-colors">
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className="text-[9px] font-black uppercase tracking-widest text-slate-650">SaaS Premium</span>
                  </div>

                  {/* Title & Description */}
                  <h3 className="text-xl font-black text-white mb-2">{product.title}</h3>
                  <p className="text-xs text-slate-400 leading-relaxed mb-6 min-h-[40px]">{product.longDesc}</p>

                  <div className="h-[1px] bg-white/5 mb-6" />

                  {/* Features / Benefits */}
                  <div className="space-y-4 mb-8">
                    <h4 className="text-[9px] font-black uppercase tracking-widest text-slate-500">Recursos principais:</h4>
                    <ul className="space-y-2.5">
                      {product.recursos.slice(0, 5).map((rec, rIdx) => (
                        <li key={rIdx} className="flex items-center gap-2 text-[11px] text-slate-300 font-medium">
                          <Check className="w-3.5 h-3.5 text-[#EADBB9] shrink-0" />
                          <span>{rec}</span>
                        </li>
                      ))}
                      {product.recursos.length > 5 && (
                        <li className="text-[10px] text-slate-500 font-bold italic pl-5">
                          + {product.recursos.length - 5} recursos avançados
                        </li>
                      )}
                    </ul>
                  </div>
                </div>

                {/* Demonstration Button */}
                <Button 
                  onClick={() => setSelectedDemoImage(product.image)}
                  className="w-full h-12 rounded-xl text-xs font-black uppercase tracking-wider bg-white/5 hover:bg-white/10 text-white border border-white/5"
                >
                  Ver Demonstração
                </Button>
              </div>
            );
          })}
        </div>
      </section>

      {/* ── SOLUÇÕES POR SEGMENTO SECTION ── */}
      <section id="segmentos" className="py-24 max-w-7xl mx-auto px-6 border-b border-white/5 relative">
        <div className="absolute top-[10%] left-[-10%] w-[300px] h-[300px] bg-[#EADBB9]/5 blur-[100px] pointer-events-none" />
        
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs font-black uppercase tracking-[0.3em] text-[#EADBB9] mb-3 block">Mercado e Segmentos</span>
          <h2 className="text-4xl md:text-5xl font-black text-white leading-tight font-display mb-4">
            Tecnologia adaptada ao seu modelo de negócio.
          </h2>
          <p className="text-slate-400 text-sm md:text-base leading-relaxed max-w-xl mx-auto">
            Nossas soluções cobrem as particularidades operacionais de diversos nichos comerciais e profissionais.
          </p>
        </div>

        {/* Segments Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-4">
          {SEGMENTOS.map((seg, idx) => {
            const Icon = seg.icon;
            return (
              <div 
                key={idx}
                className="bg-[#081426]/80 border border-white/5 rounded-2xl p-5 flex flex-col items-center justify-center text-center gap-3 transition-colors hover:bg-white/[0.03] hover:border-white/10"
              >
                <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-[#EADBB9]">
                  <Icon className="w-5 h-5" />
                </div>
                <span className="text-[11px] font-bold text-slate-300 leading-tight">{seg.name}</span>
              </div>
            );
          })}
        </div>
      </section>

      {/* ── COMO FUNCIONA SECTION ── */}
      <section className="py-24 max-w-7xl mx-auto px-6 border-b border-white/5 relative">
        <div className="text-center max-w-3xl mx-auto mb-20">
          <span className="text-xs font-black uppercase tracking-[0.3em] text-[#EADBB9] mb-3 block">Fluxo de Entrega</span>
          <h2 className="text-4xl md:text-5xl font-black text-white leading-tight font-display mb-4">
            Sua plataforma no ar em quatro etapas simples.
          </h2>
          <p className="text-slate-400 text-sm md:text-base max-w-xl mx-auto leading-relaxed">
            Cuidamos de toda a engenharia técnica e design para você focar no crescimento da sua marca.
          </p>
        </div>

        {/* Steps Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 relative">
          {[
            { num: "01", title: "Escolha a solução ideal", desc: "Selecione o produto base da Konnexy que melhor se encaixa no seu nicho de atuação." },
            { num: "02", title: "Personalização completa", desc: "Nossa equipe adapta layouts, cores, recursos e integrações com o WhatsApp para sua marca." },
            { num: "03", title: "Publicação no domínio", desc: "Configuramos os servidores, certificado SSL e publicamos a plataforma sob o seu domínio próprio." },
            { num: "04", title: "Comece a utilizar", desc: "Sua plataforma digital pronta, validada e apta para receber pedidos e agendamentos imediatamente." }
          ].map((step, idx) => (
            <div key={idx} className="bg-[#081426]/50 border border-white/5 p-8 rounded-[2rem] relative flex flex-col justify-between min-h-[220px]">
              <div>
                <span className="text-3xl font-black bg-gradient-to-r from-[#EADBB9] to-[#C5CAD2] bg-clip-text text-transparent block mb-4">
                  {step.num}
                </span>
                <h3 className="text-base font-black text-white mb-2 leading-tight">{step.title}</h3>
                <p className="text-[11px] text-slate-400 leading-relaxed font-medium">{step.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── DIFERENCIAIS SECTION ── */}
      <section className="py-24 max-w-7xl mx-auto px-6 border-b border-white/5">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
          <div className="lg:col-span-5 space-y-6">
            <span className="text-xs font-black uppercase tracking-[0.3em] text-[#EADBB9]">Diferenciais de Valor</span>
            <h2 className="text-4xl md:text-5xl font-black text-white leading-tight font-display">
              Infraestrutura de ponta, sem dor de cabeça.
            </h2>
            <p className="text-slate-400 text-sm leading-relaxed">
              Diferente de plataformas e plugins genéricos, a Konnexy constrói plataformas rápidas, seguras e prontas para rodar perfeitamente em dispositivos móveis.
            </p>
          </div>

          <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-6">
            {[
              { title: "Plataforma personalizada", desc: "Criada especificamente com a identidade visual da sua marca.", icon: Sparkles },
              { title: "Hospedagem inclusa", desc: "Servidores em nuvem de alta velocidade e escalabilidade.", icon: Globe },
              { title: "Domínio próprio", desc: "Conectamos seu endereço profissional com certificado SSL incluso.", icon: Compass },
              { title: "Atualizações constantes", desc: "Melhorias de desempenho e segurança automáticas inclusas.", icon: Zap },
              { title: "Suporte especializado", desc: "Suporte técnico dedicado via WhatsApp com atendimento humano.", icon: MessageCircle },
              { title: "Integração com WhatsApp", desc: "Pedidos estruturados enviados diretamente para sua conta.", icon: MessageCircle },
              { title: "Layout Premium", desc: "Estética minimalista focada na conversão e vendas.", icon: Award },
              { title: "Alta Performance", desc: "Navegação veloz sem lentidão ou telas travadas.", icon: Zap },
              { title: "SEO otimizado", desc: "Preparado para indexação nas buscas orgânicas do Google.", icon: BarChart3 },
              { title: "Acesso pelo celular", desc: "Totalmente responsivo sob a filosofia Mobile-First.", icon: Smartphone }
            ].map((dif, idx) => {
              const Icon = dif.icon;
              return (
                <div key={idx} className="flex gap-4 p-5 rounded-2xl bg-[#081426]/50 border border-white/5">
                  <div className="w-8 h-8 rounded-xl bg-white/5 flex items-center justify-center text-[#EADBB9] shrink-0">
                    <Icon className="w-4.5 h-4.5" />
                  </div>
                  <div>
                    <h3 className="text-xs font-black text-white mb-1 uppercase tracking-wider">{dif.title}</h3>
                    <p className="text-[11px] text-slate-400 leading-normal font-medium">{dif.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── DEMONSTRAÇÕES GALLERY SECTION ── */}
      <section id="demonstracoes" className="py-24 max-w-7xl mx-auto px-6 border-b border-white/5 relative">
        <div className="absolute bottom-[10%] right-[-10%] w-[300px] h-[300px] bg-[#C5CAD2]/5 blur-[100px] pointer-events-none" />

        <div className="text-center max-w-3xl mx-auto mb-20">
          <span className="text-xs font-black uppercase tracking-[0.3em] text-[#EADBB9] mb-3 block">Demonstrações Reais</span>
          <h2 className="text-4xl md:text-5xl font-black text-white leading-tight font-display mb-4">
            Explore nossos projetos em detalhes.
          </h2>
          <p className="text-slate-400 text-sm md:text-base leading-relaxed max-w-xl mx-auto">
            Clique sobre qualquer uma das capturas reais abaixo para ampliar a imagem do painel ou aplicativo.
          </p>
        </div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {DEMONSTRACOES.map((demo, idx) => (
            <div 
              key={idx}
              className="bg-[#081426]/90 border border-white/5 rounded-[2rem] overflow-hidden group cursor-pointer"
              onClick={() => setSelectedDemoImage(demo.image)}
            >
              <div className="relative aspect-[4/3] w-full overflow-hidden border-b border-white/5">
                <Image 
                  src={demo.image} 
                  alt={demo.name} 
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <span className="text-[10px] font-black uppercase tracking-widest bg-white text-black px-4 py-2 rounded-xl">
                    Visualizar Detalhes
                  </span>
                </div>
              </div>
              <div className="p-6 flex items-center justify-between">
                <span className="text-xs font-black text-white">{demo.name}</span>
                <span className="text-[10px] text-[#EADBB9] font-black uppercase tracking-wider flex items-center gap-1">
                  Ver demonstração <ChevronRight className="w-3 h-3" />
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── PLANOS / PREÇOS SECTION ── */}
      <Pricing />

      {/* ── TESTIMONIALS SECTION (Placeholder preparado) ── */}
      <section className="py-24 max-w-7xl mx-auto px-6 border-b border-white/5">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs font-black uppercase tracking-[0.3em] text-[#EADBB9] mb-3 block">Cases & Sucesso</span>
          <h2 className="text-4xl md:text-5xl font-black text-white leading-tight font-display mb-4">
            Empresas que conectam ao futuro.
          </h2>
          <p className="text-slate-400 text-sm md:text-base leading-relaxed max-w-xl mx-auto">
            Veja o que dizem os empreendedores que digitalizaram suas vendas e atendimentos com a tecnologia Konnexy.
          </p>
        </div>

        {/* Testimonials Grid (Pre-configured placeholder cards) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { author: "Em breve", role: "Proprietário de Adega", text: "Espaço reservado para o depoimento dos nossos clientes parceiros. Casos reais de otimização de vendas e controle de estoque estarão disponíveis nesta seção em breve." },
            { author: "Em breve", role: "Gestora de Pet Shop", text: "Espaço reservado para o depoimento dos nossos clientes parceiros. Casos reais de aumento de agendamentos e fidelização de tutores estarão disponíveis nesta seção em breve." },
            { author: "Em breve", role: "Diretor Comercial", text: "Espaço reservado para o depoimento dos nossos clientes parceiros. Casos de sucesso sobre captação de leads via landing pages rápidas estarão disponíveis nesta seção em breve." }
          ].map((test, idx) => (
            <div key={idx} className="bg-[#081426]/50 border border-white/5 p-8 rounded-[2rem] relative flex flex-col justify-between">
              <div>
                <span className="text-5xl font-serif text-white/5 select-none absolute top-4 left-4">“</span>
                <p className="text-xs text-slate-400/80 leading-relaxed font-medium italic relative z-10 mb-6">
                  {test.text}
                </p>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-white/5 flex items-center justify-center text-slate-600 font-bold text-xs">
                  {test.author[0]}
                </div>
                <div>
                  <h4 className="text-xs font-black text-white">{test.author}</h4>
                  <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">{test.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── FAQ SECTION ── */}
      <section id="faq" className="py-24 max-w-3xl mx-auto px-6 border-b border-white/5">
        <div className="text-center mb-16">
          <span className="text-xs font-black uppercase tracking-[0.3em] text-[#EADBB9] mb-3 block">FAQ</span>
          <h2 className="text-3xl md:text-4xl font-black text-white leading-tight font-display mb-4">
            Dúvidas Frequentes
          </h2>
          <p className="text-slate-400 text-sm leading-relaxed">
            Ficou com alguma dúvida sobre as soluções Konnexy? Confira as respostas rápidas abaixo.
          </p>
        </div>

        {/* FAQ Accordion */}
        <div className="space-y-4">
          {FAQS.map((faq, idx) => {
            const isOpen = openFaqIdx === idx;
            return (
              <div 
                key={idx}
                className="bg-[#081426]/60 border border-white/5 rounded-2xl overflow-hidden transition-all"
              >
                <button
                  onClick={() => toggleFaq(idx)}
                  className="w-full p-6 flex items-center justify-between text-left text-slate-205 hover:text-white transition-colors"
                >
                  <span className="text-xs font-black uppercase tracking-wider leading-snug">{faq.question}</span>
                  <ChevronDown className={`w-4 h-4 shrink-0 transition-transform duration-300 ${isOpen ? "rotate-180 text-[#EADBB9]" : "text-slate-550"}`} />
                </button>

                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25, ease: "easeInOut" }}
                    >
                      <div className="p-6 pt-0 text-xs text-slate-400 leading-relaxed font-medium border-t border-white/[0.02]">
                        {faq.answer}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </section>

      {/* ── CTA FINAL SECTION ── */}
      <section className="py-24 relative overflow-hidden">
        {/* Glow decoration */}
        <div className="absolute inset-0 bg-[#EADBB9]/5 blur-[120px] pointer-events-none" />

        <div className="max-w-4xl mx-auto px-6 text-center relative z-10 space-y-8">
          <h2 className="text-4xl sm:text-5xl font-black text-white tracking-tight font-display leading-tight">
            Pronto para modernizar seu negócio?
          </h2>
          <p className="text-slate-400 text-sm leading-relaxed max-w-xl mx-auto font-medium">
            Escolha uma das soluções da Konnexy e tenha uma plataforma profissional desenvolvida especialmente para sua empresa.
          </p>

          <div className="flex flex-wrap justify-center items-center gap-4">
            <Button asChild className="h-14 px-8 rounded-2xl text-xs font-black uppercase tracking-widest bg-white text-black hover:bg-white/90 shadow-xl shadow-white/5 transition-all">
              <a href="https://wa.me/5516991551200?text=Olá,%20gostaria%20de%20solicitar%20uma%20demonstração%20das%20soluções%20da%20Konnexy" target="_blank" rel="noopener noreferrer">
                Solicitar Demonstração
              </a>
            </Button>
            <Button asChild variant="outline" className="h-14 px-8 rounded-2xl text-xs font-black uppercase tracking-widest border border-[#EADBB9]/30 hover:border-[#EADBB9]/50 text-[#EADBB9] hover:bg-[#EADBB9]/5 transition-all">
              <a href="https://wa.me/5516991551200" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2">
                <MessageCircle className="w-4 h-4 fill-current" />
                Falar pelo WhatsApp
              </a>
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer />

      {/* ── DEMONSTRATION LIGHTBOX MODAL ── */}
      <AnimatePresence>
        {selectedDemoImage && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200] bg-black/90 flex items-center justify-center p-4 backdrop-blur-md"
            onClick={() => setSelectedDemoImage(null)}
          >
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="relative max-w-4xl w-full aspect-[4/3] rounded-[2rem] overflow-hidden border border-white/10 shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <Image 
                src={selectedDemoImage} 
                alt="Demonstration Details" 
                fill
                className="object-contain"
              />
              <button 
                onClick={() => setSelectedDemoImage(null)}
                className="absolute top-4 right-4 w-10 h-10 rounded-full bg-black/60 border border-white/10 flex items-center justify-center text-white hover:bg-black/80 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
