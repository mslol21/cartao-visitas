'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Download,
  Share2,
  MessageCircle,
  Copy,
  Check,
  ExternalLink,
  Sparkles,
  Layers,
  ArrowUpRight,
  ShieldCheck,
  CheckCircle2,
  Terminal,
  Cpu
} from 'lucide-react';
import Image from 'next/image';
import { toast } from 'sonner';
import { NeonGradientCard } from '@/components/tag/NeonGradientCard';
import { BrandCardBackground } from '@/components/tag/BrandCardBackground';
import { ProjectsBottomSheet } from '@/components/tag/ProjectsBottomSheet';
import type { Profile } from '@/types/profile';

interface MassamiTagProfileProps {
  profile?: Profile | null;
}

interface ServiceChip {
  id: string;
  label: string;
  badge?: string;
  message: string;
}

const SERVICE_CHIPS: ServiceChip[] = [
  {
    id: 'analise',
    label: 'Quero uma Análise Gratuita',
    badge: 'Popular',
    message:
      'Olá, Massami! Acessei seu cartão digital e gostaria de solicitar uma análise gratuita da presença digital do meu negócio.'
  },
  {
    id: 'site_catalogo',
    label: 'Criar Site / Catálogo',
    message:
      'Olá, Massami! Gostaria de um orçamento para criação de um site / catálogo digital profissional para a minha empresa.'
  },
  {
    id: 'placa_nfc',
    label: 'Placa Acrílica NFC + QR',
    badge: 'Phygital',
    message:
      'Olá, Massami! Vi as soluções da Konnexy Tag e tenho interesse na Placa Acrílica Inteligente com NFC e QR Code.'
  },
  {
    id: 'sistema_automacao',
    label: 'Sistema Web / Automação',
    message:
      'Olá, Massami! Preciso de um sistema web / automação sob medida para otimizar os processos da minha empresa.'
  }
];

const TECH_STACK = [
  { name: 'Next.js 15', category: 'Framework' },
  { name: 'React 19', category: 'UI' },
  { name: 'Tailwind CSS', category: 'Styling' },
  { name: 'Supabase', category: 'Backend/DB' },
  { name: 'NFC / IoT', category: 'Hardware' },
  { name: 'Google Cloud', category: 'Cloud' }
];

export function MassamiTagProfile({ profile }: MassamiTagProfileProps) {
  const [selectedChipId, setSelectedChipId] = useState<string>('analise');
  const [isProjectsSheetOpen, setIsProjectsSheetOpen] = useState<boolean>(false);
  const [pixCopied, setPixCopied] = useState<boolean>(false);

  // Dados com fallback seguro
  const phone = (profile?.whatsapp || '16991551200').replace(/\D/g, '');
  const cleanPhone = phone.startsWith('55') ? phone : `55${phone}`;
  const pixKey =
    (profile?.custom_fields as any)?.chave_pix ||
    (profile as any)?.email ||
    'shitara.massami@gmail.com';
  const instagramUser = (profile?.instagram || 'konnexy.web').replace('@', '');
  const linkedinUser = profile?.linkedin || 'massami-shitara';
  const githubUser = 'MassamiShitara';

  // Obter chip selecionado atual
  const activeChip =
    SERVICE_CHIPS.find((c) => c.id === selectedChipId) || SERVICE_CHIPS[0];

  // URL WhatsApp calculada
  const waUrl = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(
    activeChip.message
  )}`;

  // 1. Download vCard
  const handleDownloadVCard = () => {
    const vcard = [
      'BEGIN:VCARD',
      'VERSION:3.0',
      'N:Shitara;Massami;;;',
      'FN:Massami Shitara | Konnexy',
      'ORG:Konnexy Tecnologia',
      'TITLE:Developer Full-Stack • Phygital & SaaS',
      `TEL;TYPE=CELL,VOICE:+${cleanPhone}`,
      `EMAIL;TYPE=WORK:${pixKey}`,
      'URL:https://konnexy.com.br',
      `X-SOCIALPROFILE;TYPE=instagram:https://instagram.com/${instagramUser}`,
      `X-SOCIALPROFILE;TYPE=linkedin:https://linkedin.com/in/${linkedinUser}`,
      'NOTE:Desenvolvedor de software, soluções SaaS e tecnologia Phygital para transformar negócios locais.',
      'END:VCARD'
    ].join('\r\n');

    const blob = new Blob([vcard], { type: 'text/vcard;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'massami-konnexy.vcf');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    toast.success('Contacto guardado!', {
      description: 'Ficheiro .vcf pronto para adicionar à sua agenda.'
    });
  };

  // 2. Partilha Nativa (Web Share API)
  const handleShare = async () => {
    const shareData = {
      title: 'Massami | Konnexy',
      text: 'Desenvolvedor Full-Stack • Phygital & Soluções SaaS na Konnexy',
      url: typeof window !== 'undefined' ? window.location.href : 'https://konnexy.com.br/massami'
    };

    if (navigator.share && navigator.canShare && navigator.canShare(shareData)) {
      try {
        await navigator.share(shareData);
      } catch {
        // Partilha cancelada pelo utilizador
      }
    } else {
      try {
        await navigator.clipboard.writeText(shareData.url);
        toast.success('Link copiado com sucesso!', {
          description: 'Pronto para partilhar com quem quiser.'
        });
      } catch {
        toast.error('Não foi possível copiar o link.');
      }
    }
  };

  // 3. Copiar Chave Pix
  const handleCopyPix = async () => {
    try {
      await navigator.clipboard.writeText(pixKey);
      setPixCopied(true);
      toast.success('Chave Pix copiada!', {
        description: pixKey
      });
      setTimeout(() => setPixCopied(false), 2400);
    } catch {
      toast.error('Não foi possível copiar a chave Pix.');
    }
  };

  // Ação ao escolher projeto no sheet
  const handleSelectProjectForContact = (projectName: string) => {
    const customMessage = `Olá, Massami! Vi o projeto *${projectName}* no seu cartão Konnexy e gostaria de conversar sobre uma solução similar para o meu negócio.`;
    const targetUrl = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(
      customMessage
    )}`;
    window.open(targetUrl, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="w-full min-h-screen bg-black text-zinc-100 flex flex-col justify-between selection:bg-amber-500/30 selection:text-amber-200">
      {/* Container Mobile-First Centrado */}
      <main className="w-full max-w-md mx-auto px-4 py-6 flex flex-col gap-4">
        {/* ====================================================================
         * 1. HEADER HERO (Cartão de Identidade 16:9)
         * ==================================================================== */}
        <div className="relative w-full rounded-3xl overflow-hidden border border-zinc-800 bg-zinc-950 shadow-2xl">
          {/* Imagem de Fundo 16:9 com gradiente profundo */}
          <div className="relative aspect-[16/9] w-full overflow-hidden">
            <Image
              src="/hero-bg.png"
              alt="Konnexy Header Background"
              fill
              priority
              className="object-cover opacity-45 scale-105"
            />
            {/* Gradiente Escuro de Alta Fidelidade */}
            <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/60 to-zinc-950/95" />

            {/* Ações Rápidas no Topo */}
            <div className="absolute top-3.5 right-3.5 flex items-center gap-2 z-20">
              {/* Botão Baixar vCard */}
              <button
                onClick={handleDownloadVCard}
                title="Salvar Contato na Agenda (.vcf)"
                aria-label="Salvar Contato na Agenda"
                className="flex h-9 w-9 items-center justify-center rounded-full bg-zinc-900/80 hover:bg-zinc-800 border border-zinc-700/80 text-zinc-200 hover:text-white backdrop-blur-md shadow-lg transition active:scale-95"
              >
                <Download className="h-4 w-4" />
              </button>

              {/* Botão Partilha Nativa */}
              <button
                onClick={handleShare}
                title="Compartilhar Perfil"
                aria-label="Compartilhar Perfil"
                className="flex h-9 w-9 items-center justify-center rounded-full bg-zinc-900/80 hover:bg-zinc-800 border border-zinc-700/80 text-zinc-200 hover:text-white backdrop-blur-md shadow-lg transition active:scale-95"
              >
                <Share2 className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Conteúdo do Hero Identidade */}
          <div className="relative -mt-16 px-5 pb-6 flex flex-col items-center text-center z-10">
            {/* Avatar Circular com Anel Néon */}
            <div className="relative mb-3.5 group">
              <div
                aria-hidden="true"
                className="absolute -inset-1 rounded-full bg-gradient-to-tr from-amber-500 via-orange-500 to-indigo-500 opacity-70 blur-sm group-hover:opacity-100 transition duration-500"
              />
              <div className="relative h-24 w-24 rounded-full overflow-hidden border-2 border-zinc-900 bg-zinc-950 shadow-2xl p-0.5">
                <Image
                  src="/images/koi_hero.png"
                  alt="Massami | Konnexy"
                  fill
                  sizes="96px"
                  priority
                  className="object-cover rounded-full"
                />
              </div>

              {/* Indicador de Status Online */}
              <div
                title="Online para novos projetos"
                className="absolute bottom-1 right-1 h-4 w-4 rounded-full bg-emerald-500 border-2 border-zinc-950 shadow-[0_0_8px_rgba(16,185,129,0.8)]"
              />
            </div>

            {/* Badge Superior */}
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-zinc-900/90 border border-zinc-800 text-[10px] font-bold tracking-widest uppercase text-amber-400/90 mb-2 shadow-inner">
              <Sparkles className="h-3 w-3 text-amber-400" />
              DEVELOPER FULL-STACK • PHY DIGITAL &amp; SAAS
            </span>

            {/* Título Principal */}
            <h1 className="text-2xl font-extrabold tracking-tight text-white flex items-center justify-center gap-1.5">
              Massami <span className="text-zinc-500 font-light">|</span> Konnexy
            </h1>

            {/* Subtítulo / Bio */}
            <p className="mt-2 text-xs sm:text-sm text-zinc-400 leading-relaxed max-w-sm">
              Desenvolvedor de software, soluções SaaS e tecnologia Phygital para
              transformar negócios locais.
            </p>
          </div>
        </div>

        {/* ====================================================================
         * 2. CARD PRINCIPAL DE CONVERSÃO (Hero Action - Estilo Google Card)
         * ==================================================================== */}
        <NeonGradientCard
          borderRadius={24}
          borderSize={1.5}
          neonColors={{
            firstColor: '#38bdf8', // Azul elétrico / ciano
            secondColor: '#f59e0b' // Dourado sutil
          }}
          innerClassName="relative overflow-hidden p-5 bg-zinc-900/90 border border-zinc-800/80 backdrop-blur-md"
        >
          {/* Marca d'água de código ao fundo */}
          <BrandCardBackground brand="code" size={140} opacity={0.14} />

          <div className="relative z-10 flex flex-col gap-4">
            {/* Cabeçalho do Card */}
            <div>
              <div className="flex items-center gap-2 mb-1.5">
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-sky-500/10 border border-sky-500/25 text-[11px] font-semibold text-sky-300">
                  <Terminal className="h-3 w-3" />
                  Atendimento Consultivo
                </span>
              </div>
              <h2 className="text-lg font-bold text-white tracking-tight">
                Como posso ajudar o seu negócio hoje?
              </h2>
              <p className="text-xs text-zinc-400">
                Escolha o tema abaixo para iniciar uma conversa com proposta pronta:
              </p>
            </div>

            {/* Seletor de Chips Rápidos Interativos */}
            <div className="grid grid-cols-2 gap-2">
              {SERVICE_CHIPS.map((chip) => {
                const isSelected = chip.id === selectedChipId;
                return (
                  <button
                    key={chip.id}
                    onClick={() => setSelectedChipId(chip.id)}
                    className={`relative flex flex-col items-start text-left p-3 rounded-xl border text-xs font-semibold transition-all duration-200 ${
                      isSelected
                        ? 'bg-zinc-800/95 border-sky-400/80 text-white shadow-[0_0_15px_rgba(56,189,248,0.25)] ring-1 ring-sky-400/40'
                        : 'bg-zinc-950/60 border-zinc-800/90 text-zinc-300 hover:bg-zinc-800/50 hover:text-white hover:border-zinc-700'
                    }`}
                  >
                    <div className="flex items-center justify-between w-full mb-1">
                      <span className="text-[10px] font-mono text-zinc-500">
                        {chip.badge ? (
                          <span className="text-[9px] uppercase tracking-wider font-bold text-amber-400 bg-amber-400/10 border border-amber-400/20 px-1.5 py-0.2 rounded">
                            {chip.badge}
                          </span>
                        ) : (
                          '•'
                        )}
                      </span>
                      {isSelected && (
                        <Check className="h-3.5 w-3.5 text-sky-400 shrink-0" />
                      )}
                    </div>
                    <span className="leading-tight">{chip.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Botão de Ação Primária de Alta Conversão */}
            <motion.a
              href={waUrl}
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.98 }}
              className="relative group overflow-hidden flex items-center justify-center gap-2.5 w-full py-3.5 px-4 rounded-xl font-bold text-sm text-zinc-950 bg-gradient-to-r from-emerald-400 via-teal-300 to-emerald-400 shadow-[0_0_25px_rgba(52,211,153,0.35)] hover:shadow-[0_0_35px_rgba(52,211,153,0.55)] transition-all"
            >
              {/* Efeito Shimmer Glow */}
              <div
                aria-hidden="true"
                className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/40 to-transparent"
              />

              <MessageCircle className="h-5 w-5 fill-zinc-950 stroke-none" />
              <span className="tracking-tight">
                Falar no WhatsApp com Proposta Pronta
              </span>
            </motion.a>
          </div>
        </NeonGradientCard>

        {/* ====================================================================
         * 3. BENTO GRID MODULAR DE SOLUÇÕES & ECOSSISTEMA
         * ==================================================================== */}
        <div className="grid grid-cols-2 gap-3.5">
          {/* =================================================================
           * Cartão WhatsApp Direto (Span 2 - Marca d'água Verde Oficial)
           * ================================================================= */}
          <motion.a
            href={`https://wa.me/${cleanPhone}?text=${encodeURIComponent(
              'Olá, Massami! Acessei seu cartão profissional Konnexy e gostaria de conversar.'
            )}`}
            target="_blank"
            rel="noopener noreferrer"
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.98 }}
            className="col-span-2 block group"
          >
            <NeonGradientCard
              borderSize={1.5}
              borderRadius={20}
              neonColors={{ firstColor: '#25D366', secondColor: '#128C7E' }}
              innerClassName="relative overflow-hidden flex items-center justify-between p-4 bg-zinc-900/90 border border-zinc-800/80 backdrop-blur-md"
            >
              <BrandCardBackground brand="whatsapp" size={130} opacity={0.22} />

              <div className="relative z-10 flex items-center gap-3.5">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#25D366]/15 border border-[#25D366]/30 text-[#25D366] shadow-[0_0_15px_rgba(37,211,102,0.25)]">
                  <MessageCircle className="h-6 w-6 fill-[#25D366] stroke-none" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-bold text-white tracking-tight">
                      WhatsApp Direto
                    </h3>
                    <span className="inline-flex items-center text-[9px] font-semibold px-2 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400">
                      Online
                    </span>
                  </div>
                  <p className="text-xs text-zinc-400">
                    Fale comigo em tempo real pelo (16) 99155-1200
                  </p>
                </div>
              </div>

              <div className="relative z-10 flex h-8 w-8 items-center justify-center rounded-full bg-zinc-800/80 text-zinc-400 group-hover:text-white group-hover:bg-zinc-700 transition">
                <ArrowUpRight className="h-4 w-4" />
              </div>
            </NeonGradientCard>
          </motion.a>

          {/* =================================================================
           * Cartão "Projetos & Sistemas Desenvolvidos" (Span 2 - Aciona Sheet)
           * ================================================================= */}
          <motion.button
            onClick={() => setIsProjectsSheetOpen(true)}
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.98 }}
            className="col-span-2 text-left block group"
          >
            <NeonGradientCard
              borderSize={1.5}
              borderRadius={20}
              neonColors={{ firstColor: '#f59e0b', secondColor: '#6366f1' }}
              innerClassName="relative overflow-hidden p-5 bg-zinc-900/90 border border-zinc-800/80 backdrop-blur-md"
            >
              <BrandCardBackground brand="konnexy" size={150} opacity={0.18} />

              <div className="relative z-10 flex flex-col gap-3">
                <div className="flex items-center justify-between w-full">
                  <div className="flex items-center gap-2">
                    <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-amber-500/15 border border-amber-500/30 text-amber-400">
                      <Layers className="h-3.5 w-3.5" />
                    </span>
                    <span className="text-xs font-bold uppercase tracking-wider text-amber-400">
                      Portfólio &amp; Produtos
                    </span>
                  </div>
                  <span className="inline-flex items-center gap-1 text-xs font-bold text-zinc-300 group-hover:text-white transition">
                    Ver Todos <ArrowUpRight className="h-3.5 w-3.5" />
                  </span>
                </div>

                <div>
                  <h3 className="text-base font-bold text-white tracking-tight">
                    Projetos &amp; Sistemas Desenvolvidos
                  </h3>
                  <p className="text-xs text-zinc-400 mt-0.5">
                    Toque para abrir a lista detalhada com demonstrações
                  </p>
                </div>

                {/* Micro-preview dos 3 pilares */}
                <div className="grid grid-cols-3 gap-2 pt-1 border-t border-zinc-800/80">
                  <div className="rounded-lg bg-zinc-950/70 border border-zinc-800 p-2">
                    <p className="text-[11px] font-bold text-zinc-200 truncate">
                      Konnexy Tag
                    </p>
                    <p className="text-[9px] text-zinc-500 truncate">SaaS Phygital</p>
                  </div>
                  <div className="rounded-lg bg-zinc-950/70 border border-zinc-800 p-2">
                    <p className="text-[11px] font-bold text-zinc-200 truncate">
                      Vitriniza
                    </p>
                    <p className="text-[9px] text-zinc-500 truncate">Marketplace</p>
                  </div>
                  <div className="rounded-lg bg-zinc-950/70 border border-zinc-800 p-2">
                    <p className="text-[11px] font-bold text-zinc-200 truncate">
                      Agenda &amp; Pet
                    </p>
                    <p className="text-[9px] text-zinc-500 truncate">Gestão 360°</p>
                  </div>
                </div>
              </div>
            </NeonGradientCard>
          </motion.button>

          {/* =================================================================
           * Cartão Tecnologias (Tags compactas - Col 1)
           * ================================================================= */}
          <div className="col-span-1 rounded-2xl border border-zinc-800 bg-zinc-900/80 p-4 backdrop-blur-md relative overflow-hidden flex flex-col justify-between">
            <BrandCardBackground brand="code" size={90} opacity={0.16} />

            <div className="relative z-10">
              <div className="flex items-center gap-1.5 mb-2">
                <Cpu className="h-3.5 w-3.5 text-sky-400" />
                <span className="text-[11px] font-bold uppercase tracking-wider text-zinc-300">
                  Tech Stack
                </span>
              </div>
              <p className="text-[11px] text-zinc-400 mb-3">
                Tecnologias de alta performance:
              </p>
            </div>

            <div className="relative z-10 flex flex-wrap gap-1.5">
              {TECH_STACK.map((tech) => (
                <span
                  key={tech.name}
                  className="inline-flex items-center text-[10px] font-mono px-2 py-0.5 rounded-md bg-zinc-950/80 border border-zinc-800 text-zinc-300 font-medium"
                >
                  {tech.name}
                </span>
              ))}
            </div>
          </div>

          {/* =================================================================
           * Cartão Chave Pix (Col 2 - Copiar em 1 Toque)
           * ================================================================= */}
          <motion.div
            whileHover={{ y: -2 }}
            className="col-span-1 rounded-2xl border border-zinc-800 bg-zinc-900/80 p-4 backdrop-blur-md relative overflow-hidden flex flex-col justify-between"
          >
            <BrandCardBackground brand="pix" size={96} opacity={0.18} />

            <div className="relative z-10">
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#32BCAD] flex items-center gap-1">
                  <ShieldCheck className="h-3.5 w-3.5" />
                  Chave Pix
                </span>
              </div>
              <p className="text-[11px] text-zinc-400 leading-tight">
                Pagamento ou sinal para novos projetos:
              </p>
              <p className="text-[11px] font-mono font-medium text-zinc-200 mt-2 truncate bg-zinc-950/70 p-1.5 rounded-lg border border-zinc-800/80">
                {pixKey}
              </p>
            </div>

            <div className="relative z-10 mt-3">
              <button
                onClick={handleCopyPix}
                className="w-full flex items-center justify-center gap-1.5 py-2 px-2.5 rounded-xl bg-[#32BCAD]/15 hover:bg-[#32BCAD]/25 text-[#32BCAD] border border-[#32BCAD]/40 text-xs font-bold transition active:scale-95"
              >
                {pixCopied ? (
                  <>
                    <Check className="h-3.5 w-3.5" />
                    <span>Copiado!</span>
                  </>
                ) : (
                  <>
                    <Copy className="h-3.5 w-3.5" />
                    <span>Copiar Chave</span>
                  </>
                )}
              </button>
            </div>
          </motion.div>

          {/* =================================================================
           * Cartão Redes Sociais & Perfis Oficiais (Span 2)
           * ================================================================= */}
          <div className="col-span-2 rounded-2xl border border-zinc-800 bg-zinc-900/80 p-4 backdrop-blur-md relative overflow-hidden">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-zinc-200 tracking-tight">
                Redes Sociais &amp; Perfis Oficiais
              </span>
              <span className="text-[10px] text-zinc-500 font-mono">
                @konnexy.web
              </span>
            </div>

            <div className="grid grid-cols-3 gap-2">
              {/* Instagram */}
              <a
                href={`https://instagram.com/${instagramUser}`}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex flex-col items-center justify-center gap-1.5 p-3 rounded-xl bg-zinc-950/70 border border-zinc-800 hover:border-pink-500/50 hover:bg-zinc-900 transition-all text-center"
              >
                <div className="h-7 w-7 flex items-center justify-center text-pink-400 group-hover:scale-110 transition">
                  <svg viewBox="0 0 24 24" className="h-5 w-5 fill-current">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                  </svg>
                </div>
                <span className="text-[11px] font-semibold text-zinc-300 group-hover:text-white">
                  Instagram
                </span>
              </a>

              {/* LinkedIn */}
              <a
                href={`https://linkedin.com/in/${linkedinUser}`}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex flex-col items-center justify-center gap-1.5 p-3 rounded-xl bg-zinc-950/70 border border-zinc-800 hover:border-blue-500/50 hover:bg-zinc-900 transition-all text-center"
              >
                <div className="h-7 w-7 flex items-center justify-center text-blue-400 group-hover:scale-110 transition">
                  <svg viewBox="0 0 24 24" className="h-5 w-5 fill-current">
                    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                  </svg>
                </div>
                <span className="text-[11px] font-semibold text-zinc-300 group-hover:text-white">
                  LinkedIn
                </span>
              </a>

              {/* GitHub */}
              <a
                href={`https://github.com/${githubUser}`}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex flex-col items-center justify-center gap-1.5 p-3 rounded-xl bg-zinc-950/70 border border-zinc-800 hover:border-zinc-500 hover:bg-zinc-900 transition-all text-center"
              >
                <div className="h-7 w-7 flex items-center justify-center text-zinc-300 group-hover:text-white group-hover:scale-110 transition">
                  <svg viewBox="0 0 24 24" className="h-5 w-5 fill-current">
                    <path
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                    />
                  </svg>
                </div>
                <span className="text-[11px] font-semibold text-zinc-300 group-hover:text-white">
                  GitHub
                </span>
              </a>
            </div>
          </div>
        </div>

        {/* ====================================================================
         * 4. RODAPÉ
         * ==================================================================== */}
        <footer className="mt-4 pt-6 pb-4 border-t border-zinc-900/80 flex flex-col items-center text-center gap-2">
          <div className="flex items-center gap-2">
            <div className="relative h-4 w-4">
              <Image
                src="/logos/konnexy-logo.svg"
                alt="Konnexy Logo"
                fill
                className="object-contain"
              />
            </div>
            <p className="text-xs font-semibold text-zinc-300">
              Konnexy • Tecnologia que conecta o físico ao digital.
            </p>
          </div>
          <p className="text-[11px] text-zinc-600">
            © {new Date().getFullYear()} Konnexy Ecosystem • Todos os direitos reservados.
          </p>
        </footer>
      </main>

      {/* Gaveta / Bottom Sheet de Projetos & Sistemas */}
      <ProjectsBottomSheet
        isOpen={isProjectsSheetOpen}
        onClose={() => setIsProjectsSheetOpen(false)}
        onSelectProjectForContact={handleSelectProjectForContact}
      />
    </div>
  );
}
