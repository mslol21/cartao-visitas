'use client';

import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  Sparkles,
  CheckCircle2,
  Layers,
  Cpu,
  ArrowUpRight,
  ShoppingBag,
  MessageCircle
} from 'lucide-react';
import Image from 'next/image';

export interface ProjectItem {
  id: string;
  name: string;
  badge: string;
  subtitle: string;
  description: string;
  features: string[];
  techStack: string[];
  demoUrl?: string;
  image?: string;
  gradient: string;
}

export interface CatalogServiceItem {
  name: string;
  price?: string;
  description?: string;
  image?: string;
}

const KONNEXY_PROJECTS_DATA: ProjectItem[] = [
  {
    id: 'konnexy-tag',
    name: 'Konnexy Tag',
    badge: 'PHYGITAL & IOT',
    subtitle: 'SaaS com Placas Acrílicas Inteligentes NFC + QR',
    description:
      'Solução inovadora que une hardware físico e software em nuvem. Placas inteligentes em acrílico com chip NFC e QR Code dinâmico para comércios locais captarem avaliações no Google 5 estrelas, conectarem clientes ao Wi-Fi sem senha e receberem pagamentos Pix em 1 toque.',
    features: [
      'Micro-páginas ultrarrápidas mobile-first',
      'Avaliação no Google em 1 toque (Place ID)',
      'Wi-Fi Inteligente sem digitação de senha',
      'Pix Direto com chave e QR Code instantâneo',
      'Telemetria de acessos físicos em tempo real'
    ],
    techStack: ['Next.js 15', 'NFC NTAG213', 'Tailwind CSS', 'Supabase', 'IoT'],
    demoUrl: 'https://konnexy.com.br',
    image: '/images/koi_hero.png',
    gradient: 'from-amber-500/20 via-orange-500/10 to-indigo-500/20'
  },
  {
    id: 'vitriniza',
    name: 'Vitriniza',
    badge: 'MARKETPLACE & GUIA',
    subtitle: 'Guia Comercial e Marketplace Hiperlocal',
    description:
      'Ecossistema hiperlocal de negócios que reúne comércio, serviços e gastronomia da região em um só ambiente moderno, com catálogos interativos e finalização de pedidos diretamente no WhatsApp.',
    features: [
      'Catálogo interativo com produtos e variações',
      'Checkout otimizado com envio direto ao WhatsApp',
      'Indexação SEO local de alto ranqueamento',
      'Painel de gestão intuitivo para os lojistas'
    ],
    techStack: ['Next.js', 'React', 'Tailwind CSS', 'Supabase', 'WhatsApp API'],
    demoUrl: 'https://vitriniza.vercel.app/',
    image: '/images/landing/demo_vitrine.png',
    gradient: 'from-emerald-500/20 via-teal-500/10 to-cyan-500/20'
  },
  {
    id: 'konnexy-agenda',
    name: 'Konnexy Agenda & Pet',
    badge: 'GESTÃO & SAAS VERTICAL',
    subtitle: 'Sistemas Especializados para Clínicas, Barbearias & Pets',
    description:
      'Plataformas SaaS verticais desenvolvidas especificamente para o fluxo de atendimento presencial e remoto de prestadores de serviços, pet shops (módulo Banho & Tosa), barbearias e profissionais liberais.',
    features: [
      'Agendamento online 24/7 integrado à agenda',
      'Módulo especializado para pets e fichas clínicas',
      'Lembretes automáticos por WhatsApp',
      'Histórico de atendimentos e gestão financeira'
    ],
    techStack: ['Next.js', 'React', 'PostgreSQL', 'Framer Motion', 'Tailwind'],
    demoUrl: 'https://konnexy.com.br',
    image: '/images/landing/demo_petshop.png',
    gradient: 'from-purple-500/20 via-pink-500/10 to-blue-500/20'
  }
];

interface ProjectsBottomSheetProps {
  isOpen: boolean;
  onClose: () => void;
  isMassami?: boolean;
  businessName?: string;
  services?: CatalogServiceItem[];
  onSelectProjectForContact?: (itemName: string, itemPrice?: string) => void;
}

export function ProjectsBottomSheet({
  isOpen,
  onClose,
  isMassami = false,
  businessName = 'Konnexy',
  services = [],
  onSelectProjectForContact
}: ProjectsBottomSheetProps) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  const showKonnexyEcosystem = isMassami;
  const hasCustomServices = services.length > 0;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center p-0 sm:p-4">
          {/* Backdrop Glassmorphism */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/80 backdrop-blur-md"
          />

          {/* Sheet / Drawer Container */}
          <motion.div
            initial={{ y: '100%', opacity: 0.6 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: '100%', opacity: 0 }}
            transition={{ type: 'spring', damping: 28, stiffness: 300 }}
            className="relative z-10 w-full max-w-lg max-h-[88vh] flex flex-col rounded-t-[28px] sm:rounded-3xl border border-zinc-800 bg-zinc-950/95 text-zinc-100 shadow-2xl backdrop-blur-xl overflow-hidden"
          >
            {/* Mobile Handle Indicator */}
            <div className="pt-3 pb-1 flex justify-center sm:hidden">
              <div className="h-1.5 w-12 rounded-full bg-zinc-700/80" />
            </div>

            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-800/80 bg-zinc-900/40">
              <div className="flex items-center gap-2.5">
                <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400">
                  {showKonnexyEcosystem ? (
                    <Layers className="h-4 w-4" />
                  ) : (
                    <ShoppingBag className="h-4 w-4" />
                  )}
                </div>
                <div>
                  <h3 className="text-base font-bold text-zinc-100">
                    {showKonnexyEcosystem
                      ? 'Sistemas & Soluções'
                      : 'Catálogo de Serviços & Produtos'}
                  </h3>
                  <p className="text-xs text-zinc-400">
                    {showKonnexyEcosystem
                      ? 'Ecossistema Konnexy em produção'
                      : businessName}
                  </p>
                </div>
              </div>

              <button
                onClick={onClose}
                aria-label="Fechar gaveta"
                className="flex h-8 w-8 items-center justify-center rounded-full bg-zinc-800/80 text-zinc-400 hover:text-zinc-100 hover:bg-zinc-700 transition"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto px-6 py-5 space-y-5">
              {/* 1. Catálogo de Serviços / Produtos do Perfil (Para todas as contas) */}
              {hasCustomServices && !showKonnexyEcosystem && (
                <div className="space-y-4">
                  {services.map((service, idx) => (
                    <div
                      key={idx}
                      className="rounded-2xl border border-zinc-800/90 bg-zinc-900/70 p-4 backdrop-blur-sm transition-all hover:border-zinc-700 flex flex-col gap-3"
                    >
                      {service.image && (
                        <div className="relative w-full aspect-[16/10] rounded-xl overflow-hidden border border-zinc-800 bg-zinc-950">
                          <Image
                            src={service.image}
                            alt={service.name}
                            fill
                            unoptimized
                            className="object-cover"
                          />
                        </div>
                      )}

                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <h4 className="text-base font-bold text-white tracking-tight">
                            {service.name}
                          </h4>
                          {service.description && (
                            <p className="text-xs text-zinc-400 leading-relaxed mt-1">
                              {service.description}
                            </p>
                          )}
                        </div>
                        {service.price && (
                          <span className="shrink-0 inline-flex items-center px-2.5 py-1 rounded-full text-xs font-extrabold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                            {service.price}
                          </span>
                        )}
                      </div>

                      {onSelectProjectForContact && (
                        <button
                          onClick={() => {
                            onSelectProjectForContact(service.name, service.price);
                            onClose();
                          }}
                          className="w-full flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-300 border border-emerald-500/30 text-xs font-bold transition"
                        >
                          <MessageCircle className="h-3.5 w-3.5" />
                          <span>Solicitar pelo WhatsApp</span>
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              )}

              {/* 2. Ecossistema Konnexy (Projetos em destaque para Massami) */}
              {showKonnexyEcosystem &&
                KONNEXY_PROJECTS_DATA.map((project) => (
                  <div
                    key={project.id}
                    className="rounded-2xl border border-zinc-800/90 bg-zinc-900/60 p-5 backdrop-blur-sm transition-all hover:border-zinc-700 relative overflow-hidden"
                  >
                    <div
                      aria-hidden="true"
                      className={`absolute -top-12 -right-12 h-36 w-36 rounded-full bg-gradient-to-br ${project.gradient} blur-2xl pointer-events-none opacity-60`}
                    />

                    <div className="flex items-center justify-between gap-2 mb-2">
                      <span className="inline-flex items-center gap-1.5 text-[10px] font-bold tracking-wider uppercase px-2.5 py-1 rounded-full bg-zinc-800/90 border border-zinc-700 text-amber-400">
                        <Sparkles className="h-3 w-3" />
                        {project.badge}
                      </span>

                      {project.demoUrl && (
                        <a
                          href={project.demoUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-xs font-semibold text-zinc-400 hover:text-white transition"
                        >
                          <span>Demo</span>
                          <ArrowUpRight className="h-3.5 w-3.5" />
                        </a>
                      )}
                    </div>

                    <h4 className="text-lg font-bold text-white tracking-tight">
                      {project.name}
                    </h4>
                    <p className="text-xs text-zinc-400 font-medium mt-0.5">
                      {project.subtitle}
                    </p>

                    <p className="text-xs text-zinc-300 leading-relaxed mt-3">
                      {project.description}
                    </p>

                    <div className="mt-4 space-y-1.5 border-t border-zinc-800/60 pt-3">
                      {project.features.map((feat, idx) => (
                        <div
                          key={idx}
                          className="flex items-center gap-2 text-xs text-zinc-300"
                        >
                          <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
                          <span>{feat}</span>
                        </div>
                      ))}
                    </div>

                    <div className="mt-4 flex flex-wrap gap-1.5 pt-2">
                      {project.techStack.map((tech) => (
                        <span
                          key={tech}
                          className="text-[10px] font-mono font-medium px-2 py-0.5 rounded-md bg-zinc-800/80 text-zinc-400 border border-zinc-700/60"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>

                    {onSelectProjectForContact && (
                      <div className="mt-4 pt-2">
                        <button
                          onClick={() => {
                            onSelectProjectForContact(project.name);
                            onClose();
                          }}
                          className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-xs font-bold text-zinc-100 transition border border-zinc-700/70"
                        >
                          Solicitar Proposta para este Sistema →
                        </button>
                      </div>
                    )}
                  </div>
                ))}

              {/* Caso Massami também tenha serviços adicionais cadastrados */}
              {showKonnexyEcosystem && hasCustomServices && (
                <div className="pt-2 space-y-3">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-400 px-1">
                    Serviços Sob Medida
                  </h4>
                  {services.map((service, idx) => (
                    <div
                      key={idx}
                      className="rounded-2xl border border-zinc-800/90 bg-zinc-900/60 p-4 flex items-center justify-between gap-3"
                    >
                      <div>
                        <h5 className="text-sm font-bold text-white">
                          {service.name}
                        </h5>
                        {service.description && (
                          <p className="text-xs text-zinc-400 mt-0.5">
                            {service.description}
                          </p>
                        )}
                      </div>
                      {onSelectProjectForContact && (
                        <button
                          onClick={() => {
                            onSelectProjectForContact(service.name, service.price);
                            onClose();
                          }}
                          className="shrink-0 px-3 py-1.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-xs font-bold text-amber-400 border border-zinc-700 transition"
                        >
                          Orçar →
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Bottom Safe Area / Footer */}
            <div className="px-6 py-3 border-t border-zinc-800/80 bg-zinc-900/60 flex items-center justify-between text-xs text-zinc-500">
              <span className="flex items-center gap-1.5">
                <Cpu className="h-3.5 w-3.5 text-zinc-400" />
                Konnexy Phygital Experience
              </span>
              <button
                onClick={onClose}
                className="text-zinc-400 hover:text-zinc-200 font-medium"
              >
                Fechar
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
