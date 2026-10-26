"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Check, 
  ChevronRight, 
  Sparkles, 
  Smartphone, 
  MessageCircle, 
  ShoppingCart, 
  Share2, 
  Tag, 
  Globe, 
  Zap, 
  BarChart3, 
  Store, 
  Scissors, 
  UtensilsCrossed, 
  Dog, 
  ChevronDown, 
  Shield, 
  Award,
  Stethoscope,
  Music,
  Compass,
  Building,
  Calendar,
  Factory,
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
  { id:"google", title:"Presença no Google", description:"Perfil da Empresa no Google organizado e otimizado.", longDesc:"Melhore como seu negócio aparece nas buscas e no Maps, com informações, serviços, fotos e pontos de contato mais claros para quem já procura pelo que você oferece.", icon:MapPin, image:"/images/koi_hero.png", idealFor:"Comércios locais, clínicas, oficinas, salões, restaurantes e prestadores", recursos:["Configuração e otimização do perfil","Categorias e serviços organizados","Orientação para avaliações","Informações e contatos atualizados","Gestão contínua sob demanda"] },
  { id:"sites", title:"Sites & Landing Pages", description:"Presença profissional focada em confiança e conversão.", longDesc:"Criamos páginas rápidas e responsivas para apresentar serviços, captar contatos, gerar orçamentos ou direcionar clientes ao WhatsApp.", icon:Globe, image:"/site.png", idealFor:"Empresas, profissionais, clínicas, cursos, eventos e serviços", recursos:["Design profissional e responsivo","Integração com WhatsApp","SEO técnico","Formulários e CTAs","Domínio próprio"] },
  { id:"catalogo", title:"Catálogos & Cardápios", description:"Produtos e serviços organizados para vender pelo WhatsApp.", longDesc:"Transforme conversas repetitivas em uma vitrine digital organizada, com categorias, produtos, informações e pedidos enviados diretamente para o atendimento.", icon:ShoppingCart, image:"/catalogo.png", idealFor:"Lojas, delivery, adegas, moda, presentes, artesanato e alimentação", recursos:["Vitrine digital","Categorias e produtos","Carrinho ou pedido estruturado","Integração com WhatsApp","Painel de atualização"] },
  { id:"tag", title:"Konnexy Tag — NFC & QR", description:"Aproxime, escaneie e conecte o cliente ao seu negócio.", longDesc:"Uma experiência física e digital para avaliações, contatos, redes sociais, cardápios, catálogos e páginas profissionais usando NFC e QR Code.", icon:QrCode, image:"/link.png", idealFor:"Balcões, recepções, lojas, profissionais, eventos e atendimento presencial", recursos:["NFC + QR Code","Página profissional","Atalhos para WhatsApp e redes","Avaliações no Google","Conteúdo atualizável"] },
  { id:"trafego", title:"Tráfego Pago", description:"Anúncios para levar pessoas certas até sua oferta.", longDesc:"Planejamos e gerenciamos campanhas no Google e nas redes sociais conforme objetivo, região e orçamento, conectando anúncio, página e atendimento.", icon:Megaphone, image:"/images/koi_hero.png", idealFor:"Negócios com oferta clara que querem ampliar alcance e captação", recursos:["Google Ads","Meta Ads","Segmentação local","Acompanhamento de campanhas","Verba de mídia separada da gestão"] },
  { id:"sistemas", title:"Sistemas Sob Medida", description:"Tecnologia para organizar processos do seu negócio.", longDesc:"Desenvolvemos soluções conforme a operação: agendamento, orçamento, ordem de serviço, PDV, estoque, painel administrativo e outros fluxos digitais.", icon:Settings2, image:"/fabrica.png", idealFor:"Negócios que precisam reduzir tarefas manuais e centralizar informações", recursos:["Painéis administrativos","Agendamentos e orçamentos","PDV e estoque","Fluxos personalizados","Integrações conforme o projeto"] }
];

const DEMONSTRACOES = [
  { name: "Clínica Especializada (Konnexy Sites)", image: "/images/landing/demo_clinica.png", url: "https://www.amartea.com.br/" },
  { name: "Consultoria & Palestras (Konnexy Sites)", image: "/images/landing/demo_miltonbarros.png", url: "https://miltonbarros.com.br/" },
  { name: "Biotecnologia e Pesquisa (Konnexy Sites)", image: "/images/landing/demo_lapharmatec.png", url: "https://www.lapharmatec.com.br/" },
  { name: "Agência de Turismo (Konnexy Travel)", image: "/turismo.png", url: "https://konnexy-turismo.vercel.app/" },
  { name: "Vitrine Floral (Konnexy Catálogo)", image: "/images/landing/demo_floricultura.png", url: "https://konney-floricultura.vercel.app/" },
  { name: "Pet Shop (Konnexy Pet)", image: "/pet.png", url: "https://konnexypet.vercel.app/" },
  { name: "Catálogo Digital (Konnexy Catálogo)", image: "/catalogo.png", url: null },
  { name: "Vitrine de Beleza (Konnexy Vitrine)", image: "/vitrine.png", url: "https://konnexy-vitrine.vercel.app/" },
  { name: "Painel de Produção (Konnexy Fábrica)", image: "/fabrica.png", url: "https://konnexy-fabrica.vercel.app/" },
  { name: "Link Profissional (Konnexy Link)", image: "/link.png", url: null }
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

      {/* ── HERO: proposta de valor ── */}
      <section className="relative pt-32 pb-24 md:pt-40 md:pb-32 overflow-hidden border-b border-white/5">
        <div className="absolute top-[-120px] left-1/2 -translate-x-1/2 w-[900px] h-[420px] rounded-full bg-[#EADBB9]/10 blur-[140px] pointer-events-none" />
        <div className="absolute bottom-[-80px] right-[-5%] w-[420px] h-[420px] rounded-full bg-blue-500/10 blur-[140px] pointer-events-none" />
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-14 items-center relative z-10">
          <div className="lg:col-span-7">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#EADBB9]/10 border border-[#EADBB9]/20 text-[#EADBB9] text-[10px] font-black uppercase tracking-widest mb-6"><Sparkles className="w-3.5 h-3.5" /> Soluções digitais para pequenos negócios</div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white leading-[1.02] tracking-tight font-display">Seu negócio mais fácil de <span className="text-[#EADBB9]">encontrar, conhecer e comprar.</span></h1>
            <p className="mt-6 text-slate-300 text-base sm:text-lg leading-relaxed max-w-2xl">A Konnexy conecta Google, WhatsApp, sites, catálogos, NFC/QR, anúncios e sistemas para melhorar sua presença digital e facilitar o caminho do cliente até o contato ou a compra.</p>
            <div className="mt-8 flex flex-wrap gap-3 text-xs font-bold text-slate-300">{["Google & Maps","Sites","Catálogos","NFC + QR","Tráfego Pago","Sistemas"].map(item => <span key={item} className="px-3 py-2 rounded-full border border-white/10 bg-white/[0.04]">{item}</span>)}</div>
            <div className="mt-9 flex flex-wrap gap-4">
              <Button asChild className="h-14 px-7 rounded-2xl text-xs font-black uppercase tracking-widest bg-[#EADBB9] hover:bg-[#EADBB9]/90 text-[#030c1b]"><a href="https://wa.me/5516991551200?text=Olá,%20vi%20o%20site%20da%20Konnexy%20e%20quero%20uma%20análise%20do%20meu%20negócio." target="_blank" rel="noopener noreferrer">Quero uma análise inicial</a></Button>
              <Button asChild variant="outline" className="h-14 px-7 rounded-2xl text-xs font-black uppercase tracking-widest border-white/15 text-white hover:bg-white/5"><a href="#produtos">Ver soluções</a></Button>
            </div>
            <p className="mt-4 text-[11px] text-slate-500">Sem pacote obrigatório: primeiro entendemos o que faz sentido melhorar no seu negócio.</p>
          </div>
          <div className="lg:col-span-5">
            <div className="relative rounded-[2rem] border border-[#EADBB9]/20 bg-white/[0.035] p-6 sm:p-8 shadow-2xl shadow-black/50 overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-[#EADBB9]/10 via-transparent to-blue-500/10" />
              <div className="relative">
                <span className="text-[10px] font-black uppercase tracking-[0.25em] text-[#EADBB9]">Diagnóstico → solução</span>
                <h2 className="mt-3 text-2xl font-black text-white">Não vendemos tecnologia por vender.</h2>
                <p className="mt-3 text-sm text-slate-400 leading-relaxed">Identificamos o gargalo e indicamos a solução adequada ao momento do negócio.</p>
                <div className="mt-7 space-y-3">
                  {[
                    {icon:Search, problem:"Não aparece bem nas buscas", solution:"Google + presença local"},
                    {icon:MessageCircle, problem:"Atendimento repetitivo", solution:"Catálogo, página ou automação"},
                    {icon:Megaphone, problem:"Precisa alcançar mais pessoas", solution:"Tráfego pago + estrutura de conversão"},
                    {icon:Settings2, problem:"Processo desorganizado", solution:"Sistema sob medida"}
                  ].map(({icon:ItemIcon,problem,solution}) => <div key={problem} className="flex items-center gap-3 rounded-2xl border border-white/10 bg-[#030c1b]/70 p-3.5"><div className="w-9 h-9 rounded-xl bg-[#EADBB9]/10 text-[#EADBB9] flex items-center justify-center shrink-0"><ItemIcon className="w-4 h-4" /></div><div><p className="text-xs font-bold text-white">{problem}</p><p className="text-[10px] text-slate-500 mt-0.5">{solution}</p></div></div>)}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── SERVIÇOS SECTION ── */}
      <section id="produtos" className="py-24 max-w-7xl mx-auto px-6 relative border-b border-white/5">
        <div className="text-center max-w-3xl mx-auto mb-20">
          <span className="text-xs font-black uppercase tracking-[0.3em] text-[#EADBB9] mb-3 block">Soluções Konnexy</span>
          <h2 className="text-4xl md:text-5xl font-black text-white leading-tight font-display mb-4">
            O digital certo para o problema certo.
          </h2>
          <p className="text-slate-400 text-sm md:text-base max-w-xl mx-auto leading-relaxed">
            Você não precisa contratar tudo. Combinamos apenas as soluções que ajudam seu negócio a ser encontrado, atender melhor e criar novas oportunidades.
          </p>
        </div>

        {/* Product Cards Layout */}
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          variants={{
            hidden: { opacity: 0 },
            show: {
              opacity: 1,
              transition: { staggerChildren: 0.1 }
            }
          }}
        >
          {PRODUTOS.map((product) => {
            const Icon = product.icon;
            return (
              <motion.div 
                key={product.id}
                variants={{
                  hidden: { opacity: 0, y: 20 },
                  show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 100 } }
                }}
                className="bg-[#030c1b]/60 backdrop-blur-md border border-[#C5CAD2]/10 hover:border-[#EADBB9]/30 hover:shadow-[inset_0_0_20px_rgba(234,219,185,0.05)] rounded-[2.2rem] p-8 flex flex-col justify-between transition-all duration-300 relative group"
              >
                <div>
                  {/* Card Header & Icon */}
                  <div className="flex items-center justify-between mb-6">
                    <div className="w-12 h-12 rounded-2xl bg-[#C5CAD2]/5 flex items-center justify-center text-[#EADBB9] group-hover:bg-[#EADBB9]/10 transition-colors">
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className="text-[9px] font-black uppercase tracking-widest text-slate-500">Solução profissional</span>
                  </div>

                  {/* Title & Description */}
                  <h3 className="text-xl font-black text-white mb-2">{product.title}</h3>
                  <p className="text-xs text-slate-400 leading-relaxed mb-6 min-h-[40px]">{product.longDesc}</p>

                  <div className="h-[1px] bg-white/5 mb-6" />

                  {/* Features / Benefits */}
                  <div className="space-y-4 mb-8">
                    <h4 className="text-[9px] font-black uppercase tracking-widest text-slate-500">O que pode incluir:</h4>
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
                  className="w-full h-12 rounded-xl text-xs font-black uppercase tracking-wider bg-[#030c1b]/40 hover:bg-[#EADBB9]/10 text-white border border-[#C5CAD2]/10 transition-all"
                >
                  Ver Demonstração
                </Button>
              </motion.div>
            );
          })}
        </motion.div>
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
            Da análise à solução, sem complicação.
          </h2>
          <p className="text-slate-400 text-sm md:text-base max-w-xl mx-auto leading-relaxed">
            Primeiro entendemos como seu negócio vende e atende. Depois indicamos e implantamos somente o que fizer sentido.
          </p>
        </div>

        {/* Steps Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 relative">
          {[
            { num: "01", title: "Análise inicial", desc: "Entendemos seus canais atuais, presença digital e principal dificuldade." },
            { num: "02", title: "Prioridade e proposta", desc: "Mostramos o que melhorar primeiro e montamos uma proposta adequada ao momento do negócio." },
            { num: "03", title: "Implantação", desc: "Configuramos a solução, conteúdo, integrações e canais necessários." },
            { num: "04", title: "Acompanhamento", desc: "Entregamos a estrutura pronta e orientamos como usar, divulgar e evoluir a solução." }
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
                <div key={idx} className="flex gap-4 p-5 rounded-2xl bg-[#030c1b]/60 backdrop-blur-md border border-[#C5CAD2]/10 hover:border-[#EADBB9]/30 hover:shadow-[inset_0_0_15px_rgba(234,219,185,0.05)] transition-all group">
                  <div className="w-8 h-8 rounded-xl bg-[#C5CAD2]/5 flex items-center justify-center text-[#EADBB9] shrink-0 group-hover:bg-[#EADBB9]/10 transition-colors">
                    <Icon className="w-4.5 h-4.5" />
                  </div>
                  <div>
                    <h3 className="text-xs font-black text-white mb-1 uppercase tracking-wider">{dif.title}</h3>
                    <p className="text-[11px] text-[#C5CAD2] leading-normal font-medium">{dif.desc}</p>
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
          {DEMONSTRACOES.map((demo, idx) => {
            const Wrapper = demo.url ? 'a' : 'div';
            const wrapperProps = demo.url 
              ? { href: demo.url, target: "_blank", rel: "noopener noreferrer" } 
              : { onClick: () => setSelectedDemoImage(demo.image) };
              
            return (
              <Wrapper 
                key={idx}
                className="bg-[#081426]/90 border border-white/5 rounded-[2rem] overflow-hidden group cursor-pointer block"
                {...wrapperProps}
              >
                <div className="relative aspect-[4/3] w-full overflow-hidden border-b border-white/5">
                  <Image 
                    src={demo.image} 
                    alt={demo.name} 
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <span className="text-[10px] font-black uppercase tracking-widest bg-white text-black px-4 py-2 rounded-xl flex items-center gap-2">
                      {demo.url ? "Acessar Site" : "Visualizar Detalhes"} {demo.url && <ChevronRight className="w-3 h-3" />}
                    </span>
                  </div>
                </div>
                <div className="p-6 flex items-center justify-between">
                  <span className="text-xs font-black text-white">{demo.name}</span>
                  <span className="text-[10px] text-[#EADBB9] font-black uppercase tracking-wider flex items-center gap-1">
                    {demo.url ? "Visitar" : "Ver demonstração"} <ChevronRight className="w-3 h-3" />
                  </span>
                </div>
              </Wrapper>
            );
          })}
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
            Quer descobrir o que faria mais diferença no seu negócio hoje?
          </h2>
          <p className="text-slate-400 text-sm leading-relaxed max-w-xl mx-auto font-medium">
            Mostre seu negócio para a Konnexy. Fazemos uma análise inicial e indicamos por onde começar, sem empurrar um pacote desnecessário.
          </p>

          <div className="flex flex-wrap justify-center items-center gap-4">
            <Button asChild className="h-14 px-8 rounded-2xl text-xs font-black uppercase tracking-widest bg-white text-black hover:bg-white/90 shadow-xl shadow-white/5 transition-all">
              <a href="https://wa.me/5516991551200?text=Olá,%20gostaria%20de%20solicitar%20uma%20demonstração%20das%20soluções%20da%20Konnexy" target="_blank" rel="noopener noreferrer">
                Solicitar análise
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
