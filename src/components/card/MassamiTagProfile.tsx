'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Download,
  Share2,
  MessageCircle,
  Copy,
  Check,
  Sparkles,
  Layers,
  ArrowUpRight,
  ShieldCheck,
  Terminal,
  Cpu,
  MapPin,
  Clock,
  Globe,
  ShoppingBag,
  ExternalLink,
  Award,
  X,
  ZoomIn
} from 'lucide-react';
import Image from 'next/image';
import { toast } from 'sonner';
import { NeonGradientCard } from '@/components/tag/NeonGradientCard';
import {
  BrandCardBackground,
  resolveProfessionBrand
} from '@/components/tag/BrandCardBackground';
import {
  ProjectsBottomSheet,
  type CatalogServiceItem
} from '@/components/tag/ProjectsBottomSheet';
import { getProfessionConfig } from '@/config/professions';
import { trackEvent, type AnalyticsEventType } from '@/app/actions/analytics';
import type { Profile } from '@/types/profile';

interface MassamiTagProfileProps {
  profile?: Profile | null;
  isPreview?: boolean;
}

interface ServiceChip {
  id: string;
  label: string;
  badge?: string;
  message: string;
}

const MASSAMI_CHIPS: ServiceChip[] = [
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

const MASSAMI_TECH_STACK = [
  { name: 'Next.js 15', category: 'Framework' },
  { name: 'React 19', category: 'UI' },
  { name: 'Tailwind CSS', category: 'Styling' },
  { name: 'Supabase', category: 'Backend/DB' },
  { name: 'NFC / IoT', category: 'Hardware' },
  { name: 'Google Cloud', category: 'Cloud' }
];

const PROFESSION_COVER_MAP: Record<string, string> = {
  chef_eventos:
    'https://cdn.pixabay.com/photo/2017/06/01/18/46/cook-2364221_1280.jpg',
  pizzaria:
    'https://cdn.pixabay.com/photo/2017/12/09/08/18/pizza-3007395_1280.jpg',
  cafeteria:
    'https://cdn.pixabay.com/photo/2016/02/19/11/40/coffee-shop-1209863_1280.jpg',
  quentinhas:
    'https://cdn.pixabay.com/photo/2014/11/05/15/57/salmon-518032_1280.jpg',
  food: 'https://cdn.pixabay.com/photo/2016/03/05/19/02/hamburger-1238246_1280.jpg',
  artesao:
    'https://cdn.pixabay.com/photo/2016/11/19/20/55/packages-1840742_1280.jpg',
  guia_turistico:
    'https://cdn.pixabay.com/photo/2016/01/09/18/27/journey-1130732_1280.jpg',
  area_lazer:
    'https://cdn.pixabay.com/photo/2017/01/20/00/30/maldives-1996256_1280.jpg',
  manutencao_automotiva:
    'https://cdn.pixabay.com/photo/2016/11/23/17/25/automobile-1853939_1280.jpg',
  mecanico:
    'https://cdn.pixabay.com/photo/2016/11/23/17/25/automobile-1853939_1280.jpg',
  vistoria_veicular:
    'https://cdn.pixabay.com/photo/2014/05/18/19/15/car-347410_1280.jpg',
  estetica_automotiva:
    'https://cdn.pixabay.com/photo/2014/05/18/19/15/car-347410_1280.jpg',
  driver:
    'https://cdn.pixabay.com/photo/2014/05/18/19/15/car-347410_1280.jpg',
  frete:
    'https://cdn.pixabay.com/photo/2016/11/23/17/25/automobile-1853939_1280.jpg',
  van_escolar:
    'https://cdn.pixabay.com/photo/2018/12/10/18/31/vw-bus-3867383_1280.jpg',
  musico:
    'https://cdn.pixabay.com/photo/2015/05/07/11/02/guitar-756326_1280.jpg',
  streetup:
    'https://cdn.pixabay.com/photo/2017/08/01/11/48/woman-2564660_1280.jpg',
  loja_online:
    'https://cdn.pixabay.com/photo/2016/11/19/20/55/packages-1840742_1280.jpg',
  sales:
    'https://cdn.pixabay.com/photo/2016/11/19/20/55/packages-1840742_1280.jpg',
  barbearia:
    'https://cdn.pixabay.com/photo/2020/05/21/11/35/barber-5200384_1280.jpg',
  manicure:
    'https://cdn.pixabay.com/photo/2016/11/29/01/34/manicure-1866571_1280.jpg',
  cabeleireiro:
    'https://cdn.pixabay.com/photo/2016/10/30/18/35/wellness-1783935_1280.jpg',
  esteticista:
    'https://cdn.pixabay.com/photo/2016/10/30/18/35/wellness-1783935_1280.jpg',
  beauty:
    'https://cdn.pixabay.com/photo/2016/10/30/18/35/wellness-1783935_1280.jpg',
  petshop:
    'https://cdn.pixabay.com/photo/2016/12/13/05/15/puppy-1903313_1280.jpg',
  veterinario:
    'https://cdn.pixabay.com/photo/2016/12/13/05/15/puppy-1903313_1280.jpg',
  personal_trainer:
    'https://cdn.pixabay.com/photo/2017/08/07/14/02/man-2604149_1280.jpg',
  psicologo:
    'https://cdn.pixabay.com/photo/2018/01/31/10/50/wellness-3120815_1280.jpg',
  health:
    'https://cdn.pixabay.com/photo/2017/01/29/21/16/nurse-2019420_1280.jpg',
  advogado:
    'https://cdn.pixabay.com/photo/2014/12/03/10/30/scales-of-justice-555314_1280.jpg',
  pedreiro:
    'https://cdn.pixabay.com/photo/2016/11/23/00/43/brick-wall-1851520_1280.jpg',
  mestre_de_obras:
    'https://cdn.pixabay.com/photo/2016/11/23/00/43/brick-wall-1851520_1280.jpg',
  serralheiro:
    'https://cdn.pixabay.com/photo/2016/01/19/18/12/welding-1150005_1280.jpg',
  tech: '/hero-bg.png',
  tecnico_informatica:
    'https://cdn.pixabay.com/photo/2016/11/19/22/52/coding-1841550_1280.jpg'
};

const IGNORED_CUSTOM_FIELD_KEYS = new Set([
  'portfolio_images',
  'portfolio_video_url',
  'imagem_fundo',
  'link_cardapio',
  'link_catalogo',
  'catalogo_pdf',
  'foto_local',
  'chave_pix',
  'tipo_chave_pix',
  'cor_fundo',
  'cor_texto',
  'cor_botoes',
  'cor_texto_botoes',
  'cor_bio_fundo',
  'cor_bio_texto',
  'cor_servicos_fundo',
  'cor_servicos_texto',
  'cor_diferenciais_fundo',
  'cor_diferenciais_texto',
  'cor_info_fundo',
  'cor_info_texto',
  'cor_qr_fundo',
  'cor_qr_pontos',
  'cor_qr_cantos_quadrado',
  'cor_qr_cantos_ponto',
  'spotify_link',
  'youtube_link'
]);

function formatBooleanFieldLabel(rawLabel: string): string {
  return rawLabel
    .replace(/\s*\(.*?\)\s*/g, '')
    .replace(/\?+$/, '')
    .replace(/^(Tem|Possui|Inclui)\s+/i, '')
    .trim();
}

function isUrlLike(str: string): boolean {
  const s = str.trim().toLowerCase();
  return (
    s.startsWith('http://') ||
    s.startsWith('https://') ||
    s.startsWith('/storage/') ||
    s.includes('supabase.co')
  );
}

function PortfolioAutoCarousel({
  images,
  onSelectImage
}: {
  images: string[];
  onSelectImage: (img: string) => void;
}) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (!scrollRef.current || images.length <= 1 || paused) return;
    const interval = setInterval(() => {
      if (scrollRef.current) {
        const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
        const scrollMax = scrollWidth - clientWidth;
        const itemWidth = 250 + 12;
        let next = scrollLeft + itemWidth;
        if (next >= scrollMax + itemWidth / 2) next = 0;
        scrollRef.current.scrollTo({ left: next, behavior: 'smooth' });
      }
    }, 2800);
    return () => clearInterval(interval);
  }, [images.length, paused]);

  return (
    <div
      ref={scrollRef}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onTouchStart={() => setPaused(true)}
      onTouchEnd={() => setPaused(false)}
      className="flex gap-3 overflow-x-auto pb-2 scroll-hide snap-x snap-mandatory"
    >
      {images.map((img, i) => (
        <button
          key={i}
          type="button"
          onClick={() => onSelectImage(img)}
          className="group relative flex-none w-[250px] sm:w-[270px] h-44 rounded-2xl overflow-hidden snap-center border border-zinc-800 bg-zinc-950 focus:outline-none"
        >
          <img
            src={img}
            alt=""
            aria-hidden="true"
            className="absolute inset-0 w-full h-full object-cover blur-lg opacity-35 scale-110 pointer-events-none"
          />
          <img
            src={img}
            alt={`Portfólio ${i + 1}`}
            className="relative z-10 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute bottom-2 right-2 z-20 flex h-7 w-7 items-center justify-center rounded-full bg-black/60 text-white opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-sm">
            <ZoomIn className="h-3.5 w-3.5" />
          </div>
        </button>
      ))}
    </div>
  );
}

export function MassamiTagProfile({
  profile,
  isPreview = false
}: MassamiTagProfileProps) {
  const isMassami =
    profile?.username?.toLowerCase() === 'massami' ||
    (!profile?.username &&
      !profile?.name &&
      !profile?.business_name &&
      !isPreview);

  const [selectedChipId, setSelectedChipId] = useState<string>('0');
  const [isProjectsSheetOpen, setIsProjectsSheetOpen] = useState<boolean>(false);
  const [pixCopied, setPixCopied] = useState<boolean>(false);
  const [lightboxImage, setLightboxImage] = useState<string | null>(null);

  const customFieldsObj = (profile?.custom_fields as any) || {};
  const profKey = (
    profile?.profession ||
    profile?.category ||
    'default'
  ).toLowerCase();

  // Normalização de Serviços do Perfil
  const rawServices = profile?.servicos || profile?.services || [];
  const normalizedServices: CatalogServiceItem[] = rawServices
    .map((s) => {
      if (typeof s === 'string') return { name: s };
      return {
        name: (s as any).nome || (s as any).name || '',
        price: (s as any).preco || (s as any).price || '',
        description: (s as any).descricao || (s as any).description || '',
        image: (s as any).imagem || (s as any).image || ''
      };
    })
    .filter((s) => s.name.trim() !== '');

  // Portfólio de Imagens / Vídeo
  const rawPortfolioImages = customFieldsObj.portfolio_images;
  const portfolioImages: string[] = (
    Array.isArray(rawPortfolioImages)
      ? rawPortfolioImages
      : typeof rawPortfolioImages === 'string'
        ? rawPortfolioImages.split(/[,;]/).map((s: string) => s.trim())
        : []
  ).filter(
    (s: string) => Boolean(s) && (s.startsWith('http') || s.startsWith('/'))
  );

  const portfolioVideoUrl: string | undefined =
    customFieldsObj.portfolio_video_url;

  // Identidade e Informações do Perfil
  const displayName = isMassami
    ? 'Massami | Konnexy'
    : profile?.business_name || profile?.name || profile?.username || 'Seu Nome';

  const professionConfig = getProfessionConfig(
    profile?.profession || profile?.category
  );

  const topBadge = isMassami
    ? 'DEVELOPER FULL-STACK • PHY DIGITAL & SAAS'
    : (
        professionConfig?.label ||
        profile?.expert_area ||
        profile?.tagline ||
        profile?.profession ||
        'PROFISSIONAL VERIFICADO'
      ).toUpperCase();

  const bioText = isMassami
    ? 'Desenvolvedor de software, soluções SaaS e tecnologia Phygital para transformar negócios locais.'
    : profile?.subtitle ||
      profile?.bio_profissional ||
      profile?.tagline ||
      'Atendimento de excelência e soluções pensadas para você.';

  const avatarSrc = isMassami
    ? '/images/koi_hero.png'
    : profile?.photo_url || '/images/koi_hero.png';

  // Resolução inteligente da Imagem/Vídeo de Capa Representativa
  const firstServiceWithImage = normalizedServices.find((s) => s.image)?.image;
  const customBgImage =
    typeof customFieldsObj.imagem_fundo === 'string' &&
    (customFieldsObj.imagem_fundo.startsWith('http') ||
      customFieldsObj.imagem_fundo.startsWith('/'))
      ? customFieldsObj.imagem_fundo
      : undefined;

  const coverUrl = isMassami
    ? '/hero-bg.png'
    : profile?.background_video_url ||
      customBgImage ||
      portfolioImages[0] ||
      firstServiceWithImage ||
      PROFESSION_COVER_MAP[profKey] ||
      '/hero-bg.png';

  const isCoverVideo = /\.(mp4|webm|ogg|mov)$/i.test(coverUrl);

  const primaryNeonColor = isMassami
    ? '#38bdf8'
    : profile?.theme_color && profile.theme_color !== '#8c8c8c'
      ? profile.theme_color
      : '#f59e0b';

  const secondaryNeonColor = isMassami ? '#f59e0b' : '#6366f1';

  const professionWatermark = isMassami
    ? 'code'
    : resolveProfessionBrand(profKey);

  // Contatos e Chaves
  const rawPhone = (
    profile?.whatsapp || (isMassami ? '16991551200' : '')
  ).replace(/\D/g, '');
  const cleanPhone = rawPhone
    ? rawPhone.startsWith('55')
      ? rawPhone
      : `55${rawPhone}`
    : '';

  const formattedPhoneDisplay = rawPhone
    ? rawPhone.length === 11
      ? `(${rawPhone.slice(0, 2)}) ${rawPhone.slice(2, 7)}-${rawPhone.slice(7)}`
      : rawPhone
    : '';

  const pixKey =
    customFieldsObj.chave_pix ||
    (isMassami ? 'shitara.massami@gmail.com' : '');

  const locationText =
    profile?.endereco_completo ||
    profile?.address ||
    profile?.area_atendimento ||
    profile?.service_area ||
    profile?.city ||
    '';

  const hoursText = profile?.horario_funcionamento || '';

  // Chips Rápidos Dinâmicos
  const dynamicChips: ServiceChip[] = isMassami
    ? MASSAMI_CHIPS
    : normalizedServices.length > 0
      ? normalizedServices.slice(0, 4).map((srv, idx) => ({
          id: String(idx),
          label: srv.name,
          badge:
            srv.price && srv.price.toLowerCase() !== 'sob consulta'
              ? srv.price
              : idx === 0
                ? 'Destaque'
                : undefined,
          message:
            srv.price && srv.price.toLowerCase() !== 'sob consulta'
              ? `Olá, ${displayName}! Acessei seu cartão digital Konnexy e gostaria de solicitar: *${srv.name}* (${srv.price}).`
              : `Olá, ${displayName}! Acessei seu cartão digital Konnexy e gostaria de saber mais sobre: *${srv.name}*.`
        }))
      : [
          {
            id: '0',
            label: 'Solicitar Orçamento',
            badge: 'Rápido',
            message: `Olá, ${displayName}! Acessei seu cartão digital e gostaria de solicitar um orçamento.`
          },
          {
            id: '1',
            label: 'Agendar Horário / Atendimento',
            message: `Olá, ${displayName}! Gostaria de verificar a disponibilidade para agendar um atendimento.`
          },
          {
            id: '2',
            label: 'Conhecer Serviços / Produtos',
            message: `Olá, ${displayName}! Gostaria de conhecer mais detalhes sobre seus serviços e produtos.`
          },
          {
            id: '3',
            label: 'Tirar uma Dúvida',
            message: `Olá, ${displayName}! Vi seu perfil na Konnexy e gostaria de tirar uma dúvida.`
          }
        ];

  const activeChip =
    dynamicChips.find((c) => c.id === selectedChipId) || dynamicChips[0];

  const waUrl = cleanPhone
    ? `https://wa.me/${cleanPhone}?text=${encodeURIComponent(
        activeChip.message
      )}`
    : '#';

  // Diferenciais / Tags de Especialidade Limpos
  const activeProfessionBadges: string[] = [];
  if (!isMassami) {
    if (Array.isArray(profile?.diferenciais)) {
      for (const item of profile.diferenciais) {
        if (item && typeof item === 'string' && !isUrlLike(item)) {
          activeProfessionBadges.push(formatBooleanFieldLabel(item));
        }
      }
    }
    if (professionConfig?.customFields) {
      for (const field of professionConfig.customFields) {
        if (IGNORED_CUSTOM_FIELD_KEYS.has(field.name)) continue;
        const val = customFieldsObj[field.name];
        if (field.type === 'boolean' && val === true) {
          activeProfessionBadges.push(formatBooleanFieldLabel(field.label));
        } else if (field.type === 'array' && val) {
          const arr = Array.isArray(val)
            ? val
            : typeof val === 'string'
              ? val.split(/[,;]/)
              : [];
          for (const rawItem of arr) {
            const strItem = String(rawItem).trim();
            if (strItem && !isUrlLike(strItem)) {
              activeProfessionBadges.push(strItem);
            }
          }
        } else if (
          field.type === 'text' &&
          typeof val === 'string' &&
          val.trim() &&
          !isUrlLike(val) &&
          val.trim().length <= 40
        ) {
          activeProfessionBadges.push(val.trim());
        }
      }
    }
    if (profile?.tipo_atendimento && !isUrlLike(profile.tipo_atendimento)) {
      activeProfessionBadges.push(profile.tipo_atendimento);
    }
  }

  const uniqueBadges = Array.from(new Set(activeProfessionBadges)).slice(0, 10);
  const customLinks = profile?.custom_links || [];

  // Redes Sociais
  const instagramUser = (
    profile?.instagram || (isMassami ? 'konnexy.web' : '')
  )
    .replace('@', '')
    .trim();
  const linkedinUser = (
    profile?.linkedin || (isMassami ? 'massami-shitara' : '')
  ).trim();
  const facebookUser = (profile?.facebook || '').trim();
  const tiktokUser = (profile?.tiktok || '').replace('@', '').trim();
  const youtubeUser = (profile?.youtube || '').replace('@', '').trim();
  const websiteUrl = (
    profile?.website || (isMassami ? 'https://konnexy.com.br' : '')
  ).trim();
  const githubUser = isMassami ? 'MassamiShitara' : '';

  const handleTrack = (type: AnalyticsEventType) => {
    if (isPreview || !profile?.id) return;
    trackEvent(profile.id, type).catch(() => {});
  };

  const handleDownloadVCard = () => {
    const vcard = [
      'BEGIN:VCARD',
      'VERSION:3.0',
      `FN:${displayName}`,
      `ORG:${profile?.business_name || displayName}`,
      `TITLE:${topBadge}`,
      cleanPhone ? `TEL;TYPE=CELL,VOICE:+${cleanPhone}` : '',
      pixKey && pixKey.includes('@') ? `EMAIL;TYPE=WORK:${pixKey}` : '',
      websiteUrl
        ? `URL:${websiteUrl.startsWith('http') ? websiteUrl : `https://${websiteUrl}`}`
        : '',
      `NOTE:${bioText.replace(/\r?\n/g, ' ')}`,
      'END:VCARD'
    ]
      .filter(Boolean)
      .join('\r\n');

    const blob = new Blob([vcard], { type: 'text/vcard;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute(
      'download',
      `${(profile?.username || displayName).toLowerCase().replace(/[^a-z0-9]/g, '-')}.vcf`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    toast.success('Contacto guardado!', {
      description: 'Ficheiro .vcf pronto para adicionar à sua agenda.'
    });
  };

  const handleShare = async () => {
    const shareData = {
      title: displayName,
      text: bioText,
      url:
        typeof window !== 'undefined'
          ? window.location.href
          : `https://konnexy.com.br/${profile?.username || ''}`
    };

    if (navigator.share && navigator.canShare && navigator.canShare(shareData)) {
      try {
        await navigator.share(shareData);
      } catch {
        // Cancelado
      }
    } else {
      try {
        await navigator.clipboard.writeText(shareData.url);
        toast.success('Link copiado com sucesso!', {
          description: 'Pronto para partilhar.'
        });
      } catch {
        toast.error('Não foi possível copiar o link.');
      }
    }
  };

  const handleCopyPix = async () => {
    if (!pixKey) return;
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

  const handleSelectProjectForContact = (
    itemName: string,
    itemPrice?: string
  ) => {
    if (!cleanPhone) return;
    handleTrack('click_whatsapp');
    const customMessage = itemPrice
      ? `Olá, ${displayName}! Vi o item *${itemName}* (${itemPrice}) no seu cartão Konnexy e gostaria de fazer um pedido / orçamento.`
      : `Olá, ${displayName}! Vi *${itemName}* no seu cartão Konnexy e gostaria de mais informações.`;
    const targetUrl = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(
      customMessage
    )}`;
    window.open(targetUrl, '_blank', 'noopener,noreferrer');
  };

  const previewServiceCols =
    normalizedServices.length === 1
      ? 'grid-cols-1'
      : normalizedServices.length === 2
        ? 'grid-cols-2'
        : 'grid-cols-3';

  return (
    <div
      className={`relative w-full ${
        isPreview ? 'min-h-full' : 'min-h-screen'
      } bg-zinc-950 text-zinc-100 flex flex-col justify-between selection:bg-amber-500/30 selection:text-amber-200 overflow-x-hidden`}
    >
      {/* Atmosfera global padrão: a mídia do perfil também preenche o espaço externo */}
      <div
        aria-hidden="true"
        className="fixed inset-0 pointer-events-none z-0 overflow-hidden bg-zinc-950"
      >
        {isCoverVideo ? (
          <video
            src={coverUrl}
            autoPlay
            muted
            loop
            playsInline
            className="absolute inset-0 h-full w-full object-cover scale-110 opacity-45 blur-xl"
          />
        ) : (
          <img
            src={coverUrl}
            alt=""
            className="absolute inset-0 h-full w-full object-cover scale-110 opacity-50 blur-xl"
          />
        )}
        <div
          className="absolute inset-0"
          style={{
            background: `radial-gradient(circle at 50% 8%, ${primaryNeonColor}29 0%, transparent 42%)`
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/35 via-zinc-950/60 to-zinc-950/95" />
        <div
          className="absolute inset-0 opacity-60"
          style={{
            background: `linear-gradient(115deg, transparent 0%, ${primaryNeonColor}14 38%, transparent 62%)`
          }}
        />
      </div>

      {/* Container Mobile-First Centrado */}
      <main
        className={`relative z-10 w-full max-w-md mx-auto ${
          isPreview ? 'px-3 pt-8 pb-6' : 'px-4 py-6'
        } flex flex-col gap-5`}
      >
        {/* ====================================================================
         * 1. HEADER HERO (Cartão de Identidade 16:9 com Borda Néon)
         * ==================================================================== */}
        <NeonGradientCard
          borderRadius={24}
          borderSize={2}
          neonColors={{
            firstColor: primaryNeonColor,
            secondColor: '#6366f1'
          }}
          innerClassName="relative overflow-hidden p-0 bg-zinc-950"
        >
          {/* Imagem ou Vídeo de Fundo 16:9 com gradiente profundo */}
          <div className="relative aspect-[16/9] w-full overflow-hidden bg-zinc-900">
            {isCoverVideo ? (
              <video
                src={coverUrl}
                autoPlay
                muted
                loop
                playsInline
                className="absolute inset-0 w-full h-full object-cover opacity-85"
              />
            ) : (
              <img
                src={coverUrl}
                alt={displayName}
                className="absolute inset-0 w-full h-full object-cover object-center opacity-90 transition-transform duration-700 hover:scale-105"
              />
            )}
            <div className="absolute inset-0 bg-gradient-to-b from-black/5 via-black/30 to-zinc-950/90" />

            {/* Ações Rápidas no Topo */}
            <div className="absolute top-3.5 right-3.5 flex items-center gap-2 z-20">
              <button
                type="button"
                onClick={handleDownloadVCard}
                title="Salvar Contato na Agenda (.vcf)"
                aria-label="Salvar Contato na Agenda"
                className="flex h-9 w-9 items-center justify-center rounded-full bg-zinc-900/80 hover:bg-zinc-800 border border-zinc-700/80 text-zinc-200 hover:text-white backdrop-blur-md shadow-lg transition active:scale-95"
              >
                <Download className="h-4 w-4" />
              </button>

              <button
                type="button"
                onClick={handleShare}
                title="Compartilhar Perfil"
                aria-label="Compartilhar Perfil"
                className="flex h-9 w-9 items-center justify-center rounded-full bg-zinc-900/80 hover:bg-zinc-800 border border-zinc-700/80 text-zinc-200 hover:text-white backdrop-blur-md shadow-lg transition active:scale-95"
              >
                <Share2 className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Conteúdo do Hero Identidade — continuidade visual da capa, sem bloco preto chapado */}
          <div
            className="relative -mt-14 px-5 pb-6 pt-1 flex flex-col items-center text-center z-10 overflow-hidden"
            style={{
              background: `
                radial-gradient(ellipse at 50% 0%, ${primaryNeonColor}38 0%, ${primaryNeonColor}12 34%, transparent 62%),
                linear-gradient(to bottom, rgba(9,9,11,0.18) 0%, rgba(9,9,11,0.78) 42%, rgba(9,9,11,0.96) 100%)
              `
            }}
          >
            <div aria-hidden="true" className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
              <div
                className="absolute -left-16 bottom-10 h-px w-[125%] rotate-[9deg] opacity-70"
                style={{
                  background: `linear-gradient(90deg, transparent, ${primaryNeonColor}, transparent)`,
                  boxShadow: `0 0 14px ${primaryNeonColor}99`
                }}
              />
              <div
                className="absolute -right-20 bottom-16 h-px w-[115%] -rotate-[8deg] opacity-45"
                style={{
                  background: `linear-gradient(90deg, transparent, ${secondaryNeonColor}, transparent)`,
                  boxShadow: `0 0 12px ${secondaryNeonColor}88`
                }}
              />
              <div
                className="absolute left-1/2 top-2 h-28 w-64 -translate-x-1/2 rounded-full blur-3xl opacity-20"
                style={{ backgroundColor: primaryNeonColor }}
              />
            </div>

            {/* Avatar Circular com Anel Néon */}
            <button
              type="button"
              onClick={() => setLightboxImage(avatarSrc)}
              className="relative z-10 mb-3.5 group focus:outline-none"
            >
              <div
                aria-hidden="true"
                className="absolute -inset-1 rounded-full bg-gradient-to-tr from-amber-500 via-sky-400 to-indigo-500 opacity-85 blur-sm group-hover:opacity-100 transition duration-500"
              />
              <div className="relative h-24 w-24 rounded-full overflow-hidden border-2 border-zinc-900 bg-zinc-950 shadow-2xl">
                <img
                  src={avatarSrc}
                  alt={displayName}
                  className="w-full h-full object-cover object-center rounded-full"
                />
              </div>

              <div
                title="Perfil Ativo"
                className="absolute bottom-1 right-1 h-4 w-4 rounded-full bg-emerald-500 border-2 border-zinc-950 shadow-[0_0_8px_rgba(16,185,129,0.8)]"
              />
            </button>

            {/* Badge Superior */}
            <span className="relative z-10 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-zinc-900/85 backdrop-blur-md border border-zinc-800 text-[10px] font-bold tracking-widest uppercase text-amber-400/90 mb-2 shadow-inner max-w-full truncate">
              <Sparkles className="h-3 w-3 text-amber-400 shrink-0" />
              <span className="truncate">{topBadge}</span>
            </span>

            {/* Título Principal */}
            <h1 className="relative z-10 text-2xl font-extrabold tracking-tight text-white drop-shadow-lg">
              {displayName}
            </h1>

            {/* Subtítulo / Bio */}
            <p className="relative z-10 mt-2 text-xs sm:text-sm text-zinc-300 leading-relaxed max-w-sm whitespace-pre-line">
              {bioText}
            </p>

            {/* Localização e Horário */}
            {(locationText || hoursText) && (
              <div className="relative z-10 mt-3.5 flex flex-wrap items-center justify-center gap-2">
                {locationText && (
                  <span className="inline-flex items-center gap-1 text-[11px] text-zinc-300 bg-zinc-900/90 border border-zinc-800/90 px-2.5 py-1 rounded-full">
                    <MapPin className="h-3 w-3 text-amber-400 shrink-0" />
                    <span className="truncate max-w-[220px]">{locationText}</span>
                  </span>
                )}
                {hoursText && (
                  <span className="inline-flex items-center gap-1 text-[11px] text-zinc-300 bg-zinc-900/90 border border-zinc-800/90 px-2.5 py-1 rounded-full">
                    <Clock className="h-3 w-3 text-sky-400 shrink-0" />
                    <span className="truncate max-w-[220px]">{hoursText}</span>
                  </span>
                )}
              </div>
            )}
          </div>
        </NeonGradientCard>

        {/* ====================================================================
         * 2. CARD PRINCIPAL DE CONVERSÃO (Hero Action com Borda Néon)
         * ==================================================================== */}
        <NeonGradientCard
          borderRadius={24}
          borderSize={2}
          neonColors={{
            firstColor: primaryNeonColor,
            secondColor: secondaryNeonColor
          }}
          innerClassName="relative overflow-hidden p-5 bg-zinc-900/95 backdrop-blur-md"
        >
          <BrandCardBackground
            brand={professionWatermark}
            size={140}
            opacity={0.14}
          />

          <div className="relative z-10 flex flex-col gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1.5">
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-sky-500/10 border border-sky-500/25 text-[11px] font-semibold text-sky-300">
                  {isMassami ? (
                    <Terminal className="h-3 w-3" />
                  ) : (
                    <Sparkles className="h-3 w-3" />
                  )}
                  <span>
                    {isMassami ? 'Atendimento Consultivo' : 'Atendimento Rápido'}
                  </span>
                </span>
              </div>
              <h2 className="text-lg font-bold text-white tracking-tight">
                {isMassami
                  ? 'Como posso ajudar o seu negócio hoje?'
                  : 'Como podemos ajudar você hoje?'}
              </h2>
              <p className="text-xs text-zinc-400">
                Selecione uma opção abaixo para iniciar o atendimento personalizado:
              </p>
            </div>

            {/* Seletor de Chips Rápidos Interativos */}
            <div className="grid grid-cols-2 gap-2">
              {dynamicChips.map((chip) => {
                const isSelected = chip.id === activeChip.id;
                return (
                  <button
                    key={chip.id}
                    type="button"
                    onClick={() => setSelectedChipId(chip.id)}
                    className={`relative flex flex-col justify-between items-start text-left p-3 rounded-xl border text-xs font-semibold transition-all duration-200 min-h-[68px] ${
                      isSelected
                        ? 'bg-zinc-800/95 border-sky-400/80 text-white shadow-[0_0_15px_rgba(56,189,248,0.25)] ring-1 ring-sky-400/40'
                        : 'bg-zinc-950/60 border-zinc-800/90 text-zinc-300 hover:bg-zinc-800/50 hover:text-white hover:border-zinc-700'
                    }`}
                  >
                    <div className="flex items-center justify-between w-full gap-1 mb-1">
                      {chip.badge ? (
                        <span className="inline-block max-w-[82%] truncate text-[9px] uppercase tracking-wider font-bold text-amber-400 bg-amber-400/10 border border-amber-400/20 px-1.5 py-0.5 rounded">
                          {chip.badge}
                        </span>
                      ) : (
                        <span className="text-[10px] font-mono text-zinc-500">
                          •
                        </span>
                      )}
                      {isSelected && (
                        <Check className="h-3.5 w-3.5 text-sky-400 shrink-0" />
                      )}
                    </div>
                    <span className="leading-snug line-clamp-2 w-full">
                      {chip.label}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Botão de Ação Primária de Alta Conversão */}
            {cleanPhone && (
              <motion.a
                href={waUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => handleTrack('click_cta')}
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.98 }}
                className="relative group overflow-hidden flex items-center justify-center gap-2.5 w-full py-3.5 px-4 rounded-xl font-bold text-sm text-zinc-950 bg-gradient-to-r from-emerald-400 via-teal-300 to-emerald-400 shadow-[0_0_25px_rgba(52,211,153,0.35)] hover:shadow-[0_0_35px_rgba(52,211,153,0.55)] transition-all text-center"
              >
                <div
                  aria-hidden="true"
                  className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/40 to-transparent"
                />
                <MessageCircle className="h-5 w-5 fill-zinc-950 stroke-none shrink-0" />
                <span className="tracking-tight truncate">
                  {isMassami
                    ? 'Falar no WhatsApp com Proposta Pronta'
                    : profile?.cta_text || 'Falar no WhatsApp com Proposta Pronta'}
                </span>
              </motion.a>
            )}
          </div>
        </NeonGradientCard>

        {/* ====================================================================
         * 3. BENTO GRID MODULAR (Todos os Quadros com Borda Néon)
         * ==================================================================== */}
        <div className="grid grid-cols-2 gap-4">
          {/* =================================================================
           * Cartão WhatsApp Direto (Span 2 - Borda Néon Verde Oficial)
           * ================================================================= */}
          {cleanPhone && (
            <motion.a
              href={`https://wa.me/${cleanPhone}?text=${encodeURIComponent(
                profile?.whatsapp_message ||
                  `Olá, ${displayName}! Acessei seu cartão digital Konnexy e gostaria de conversar.`
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => handleTrack('click_whatsapp')}
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.98 }}
              className="col-span-2 block group"
            >
              <NeonGradientCard
                borderSize={2}
                borderRadius={20}
                neonColors={{ firstColor: '#25D366', secondColor: '#128C7E' }}
                innerClassName="relative overflow-hidden flex items-center justify-between p-4 bg-zinc-900/95 backdrop-blur-md"
              >
                <BrandCardBackground brand="whatsapp" size={130} opacity={0.22} />

                <div className="relative z-10 flex items-center gap-3.5">
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#25D366]/15 border border-[#25D366]/30 text-[#25D366] shadow-[0_0_15px_rgba(37,211,102,0.25)] shrink-0">
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
                      {formattedPhoneDisplay
                        ? `Atendimento em tempo real • ${formattedPhoneDisplay}`
                        : 'Fale conosco em tempo real'}
                    </p>
                  </div>
                </div>

                <div className="relative z-10 flex h-8 w-8 items-center justify-center rounded-full bg-zinc-800/80 text-zinc-400 group-hover:text-white group-hover:bg-zinc-700 transition shrink-0">
                  <ArrowUpRight className="h-4 w-4" />
                </div>
              </NeonGradientCard>
            </motion.a>
          )}

          {/* =================================================================
           * Cartão Catálogo de Serviços / Projetos & Sistemas (Span 2 - Borda Néon)
           * ================================================================= */}
          {(isMassami || normalizedServices.length > 0) && (
            <motion.button
              type="button"
              onClick={() => setIsProjectsSheetOpen(true)}
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.98 }}
              className="col-span-2 text-left block group"
            >
              <NeonGradientCard
                borderSize={2}
                borderRadius={20}
                neonColors={{ firstColor: '#f59e0b', secondColor: '#6366f1' }}
                innerClassName="relative overflow-hidden p-5 bg-zinc-900/95 backdrop-blur-md"
              >
                <BrandCardBackground brand="konnexy" size={150} opacity={0.18} />

                <div className="relative z-10 flex flex-col gap-3">
                  <div className="flex items-center justify-between w-full">
                    <div className="flex items-center gap-2">
                      <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-amber-500/15 border border-amber-500/30 text-amber-400">
                        {isMassami ? (
                          <Layers className="h-3.5 w-3.5" />
                        ) : (
                          <ShoppingBag className="h-3.5 w-3.5" />
                        )}
                      </span>
                      <span className="text-xs font-bold uppercase tracking-wider text-amber-400">
                        {isMassami
                          ? 'Portfólio & Produtos'
                          : `Catálogo (${normalizedServices.length})`}
                      </span>
                    </div>
                    <span className="inline-flex items-center gap-1 text-xs font-bold text-zinc-300 group-hover:text-white transition">
                      Ver Todos <ArrowUpRight className="h-3.5 w-3.5" />
                    </span>
                  </div>

                  <div>
                    <h3 className="text-base font-bold text-white tracking-tight">
                      {isMassami
                        ? 'Projetos & Sistemas Desenvolvidos'
                        : 'Catálogo de Serviços & Soluções'}
                    </h3>
                    <p className="text-xs text-zinc-400 mt-0.5">
                      {isMassami
                        ? 'Toque para abrir a lista detalhada com demonstrações'
                        : 'Toque para visualizar detalhes, imagens, valores e fazer seu pedido'}
                    </p>
                  </div>

                  {isMassami ? (
                    <div className="grid grid-cols-3 gap-2 pt-1 border-t border-zinc-800/80">
                      <div className="rounded-lg bg-zinc-950/70 border border-zinc-800 p-2.5">
                        <p className="text-[11px] font-bold text-zinc-200 truncate">
                          Konnexy Tag
                        </p>
                        <p className="text-[9px] text-zinc-500 truncate">
                          SaaS Phygital
                        </p>
                      </div>
                      <div className="rounded-lg bg-zinc-950/70 border border-zinc-800 p-2.5">
                        <p className="text-[11px] font-bold text-zinc-200 truncate">
                          Vitriniza
                        </p>
                        <p className="text-[9px] text-zinc-500 truncate">
                          Marketplace
                        </p>
                      </div>
                      <div className="rounded-lg bg-zinc-950/70 border border-zinc-800 p-2.5">
                        <p className="text-[11px] font-bold text-zinc-200 truncate">
                          Agenda &amp; Pet
                        </p>
                        <p className="text-[9px] text-zinc-500 truncate">
                          Gestão 360°
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div
                      className={`grid ${previewServiceCols} gap-2.5 pt-2 border-t border-zinc-800/80`}
                    >
                      {normalizedServices.slice(0, 3).map((srv, idx) => (
                        <div
                          key={idx}
                          className="rounded-xl bg-zinc-950/80 border border-zinc-800/90 p-2.5 flex flex-col justify-between gap-1.5"
                        >
                          {srv.image && (
                            <div className="relative w-full h-20 rounded-lg overflow-hidden bg-zinc-900 border border-zinc-800/60">
                              <img
                                src={srv.image}
                                alt={srv.name}
                                className="w-full h-full object-cover object-center"
                              />
                            </div>
                          )}
                          <p className="text-[11px] font-bold text-zinc-100 leading-snug line-clamp-2">
                            {srv.name}
                          </p>
                          <p className="text-[10px] text-amber-400 font-semibold truncate">
                            {srv.price || 'Consultar'}
                          </p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </NeonGradientCard>
            </motion.button>
          )}

          {/* =================================================================
           * Cartão Galeria / Vitrine Visual (Span 2 - Borda Néon)
           * ================================================================= */}
          {(portfolioImages.length > 0 || portfolioVideoUrl) && (
            <div className="col-span-2">
              <NeonGradientCard
                borderSize={2}
                borderRadius={20}
                neonColors={{ firstColor: '#f59e0b', secondColor: '#ec4899' }}
                innerClassName="relative overflow-hidden p-4 bg-zinc-900/95 backdrop-blur-md space-y-3"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-zinc-200 flex items-center gap-1.5">
                    <Sparkles className="h-3.5 w-3.5 text-amber-400" />
                    Vitrine &amp; Portfólio
                  </span>
                  {portfolioImages.length > 0 && (
                    <span className="text-[10px] text-zinc-400">
                      Toque na foto para ampliar
                    </span>
                  )}
                </div>

                {portfolioVideoUrl && (
                  <div className="w-full rounded-xl overflow-hidden aspect-video bg-black border border-zinc-800">
                    <video
                      src={portfolioVideoUrl}
                      controls
                      className="w-full h-full object-cover"
                      poster={portfolioImages[0]}
                    />
                  </div>
                )}

                {portfolioImages.length > 0 && (
                  <PortfolioAutoCarousel
                    images={portfolioImages}
                    onSelectImage={(img) => setLightboxImage(img)}
                  />
                )}
              </NeonGradientCard>
            </div>
          )}

          {/* =================================================================
           * Cartão Tecnologias / Diferenciais & Especialidades (Borda Néon)
           * ================================================================= */}
          {(isMassami || uniqueBadges.length > 0) && (
            <div
              className={`${
                pixKey ? 'col-span-1' : 'col-span-2'
              } flex`}
            >
              <NeonGradientCard
                borderSize={2}
                borderRadius={20}
                neonColors={{ firstColor: '#38bdf8', secondColor: '#6366f1' }}
                className="flex-1 flex"
                innerClassName="relative overflow-hidden p-4 bg-zinc-900/95 backdrop-blur-md flex flex-col justify-between h-full"
              >
                <BrandCardBackground
                  brand={professionWatermark}
                  size={90}
                  opacity={0.16}
                />

                <div className="relative z-10">
                  <div className="flex items-center gap-1.5 mb-2">
                    {isMassami ? (
                      <Cpu className="h-3.5 w-3.5 text-sky-400" />
                    ) : (
                      <Award className="h-3.5 w-3.5 text-amber-400" />
                    )}
                    <span className="text-[11px] font-bold uppercase tracking-wider text-zinc-200">
                      {isMassami ? 'Tech Stack' : 'Diferenciais'}
                    </span>
                  </div>
                  <p className="text-[11px] text-zinc-400 mb-3">
                    {isMassami
                      ? 'Tecnologias de alta performance:'
                      : 'Destaques e garantias do serviço:'}
                  </p>
                </div>

                <div className="relative z-10 flex flex-wrap gap-1.5">
                  {isMassami
                    ? MASSAMI_TECH_STACK.map((tech) => (
                        <span
                          key={tech.name}
                          className="inline-flex items-center text-[10px] font-mono px-2.5 py-1 rounded-md bg-zinc-950/85 border border-zinc-800 text-zinc-300 font-medium"
                        >
                          {tech.name}
                        </span>
                      ))
                    : uniqueBadges.map((badge, idx) => (
                        <span
                          key={idx}
                          className="inline-flex items-center text-[11px] font-medium px-2.5 py-1 rounded-lg bg-zinc-950/85 border border-zinc-800 text-zinc-200"
                        >
                          <span className="text-emerald-400 mr-1.5">✓</span>
                          {badge}
                        </span>
                      ))}
                </div>
              </NeonGradientCard>
            </div>
          )}

          {/* =================================================================
           * Cartão Chave Pix (Borda Néon Teal Oficial)
           * ================================================================= */}
          {pixKey && (
            <motion.div
              whileHover={{ y: -2 }}
              className={`${
                isMassami || uniqueBadges.length > 0
                  ? 'col-span-1'
                  : 'col-span-2'
              } flex`}
            >
              <NeonGradientCard
                borderSize={2}
                borderRadius={20}
                neonColors={{ firstColor: '#32BCAD', secondColor: '#0ea5e9' }}
                className="flex-1 flex"
                innerClassName="relative overflow-hidden p-4 bg-zinc-900/95 backdrop-blur-md flex flex-col justify-between h-full"
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
                    Pagamento rápido em 1 toque:
                  </p>
                  <p className="text-[11px] font-mono font-medium text-zinc-200 mt-2 truncate bg-zinc-950/70 p-1.5 rounded-lg border border-zinc-800/80">
                    {pixKey}
                  </p>
                </div>

                <div className="relative z-10 mt-3">
                  <button
                    type="button"
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
                        <span>Copiar Chave Pix</span>
                      </>
                    )}
                  </button>
                </div>
              </NeonGradientCard>
            </motion.div>
          )}

          {/* =================================================================
           * Cartão Links Customizados / Portfólio Externo (Borda Néon)
           * ================================================================= */}
          {!isMassami && customLinks.length > 0 && (
            <div className="col-span-2">
              <NeonGradientCard
                borderSize={2}
                borderRadius={20}
                neonColors={{ firstColor: primaryNeonColor, secondColor: '#6366f1' }}
                innerClassName="relative overflow-hidden p-4 bg-zinc-900/95 backdrop-blur-md space-y-2.5"
              >
                <span className="text-xs font-bold text-zinc-200 tracking-tight block">
                  Links &amp; Atalhos
                </span>
                <div className="grid grid-cols-1 gap-2">
                  {customLinks.map((item, idx) => (
                    <a
                      key={idx}
                      href={
                        item.url.startsWith('http')
                          ? item.url
                          : `https://${item.url}`
                      }
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-between p-3 rounded-xl bg-zinc-950/80 border border-zinc-800 hover:border-zinc-700 text-xs font-semibold text-zinc-200 hover:text-white transition"
                    >
                      <span className="truncate">{item.title}</span>
                      <ExternalLink className="h-3.5 w-3.5 text-zinc-400 shrink-0" />
                    </a>
                  ))}
                </div>
              </NeonGradientCard>
            </div>
          )}

          {/* =================================================================
           * Cartão Redes Sociais & Perfis Oficiais (Span 2 - Borda Néon)
           * ================================================================= */}
          {(instagramUser ||
            linkedinUser ||
            githubUser ||
            facebookUser ||
            tiktokUser ||
            youtubeUser ||
            websiteUrl) && (
            <div className="col-span-2">
              <NeonGradientCard
                borderSize={2}
                borderRadius={20}
                neonColors={{ firstColor: '#ec4899', secondColor: '#8b5cf6' }}
                innerClassName="relative overflow-hidden p-4 bg-zinc-900/95 backdrop-blur-md"
              >
                <BrandCardBackground brand="instagram" size={105} opacity={0.14} />

                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-bold text-zinc-200 tracking-tight">
                      Redes Sociais &amp; Canais Oficiais
                    </span>
                    {instagramUser && (
                      <span className="text-[10px] text-zinc-400 font-mono">
                        @{instagramUser}
                      </span>
                    )}
                  </div>

                  <div className="grid grid-cols-3 gap-2">
                    {/* Instagram */}
                    {instagramUser && (
                      <a
                        href={
                          instagramUser.startsWith('http')
                            ? instagramUser
                            : `https://instagram.com/${instagramUser}`
                        }
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={() => handleTrack('click_instagram')}
                        className="group flex flex-col items-center justify-center gap-1.5 p-3 rounded-xl bg-zinc-950/75 border border-zinc-800 hover:border-pink-500/50 hover:bg-zinc-900 transition-all text-center"
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
                    )}

                    {/* LinkedIn */}
                    {linkedinUser && (
                      <a
                        href={
                          linkedinUser.startsWith('http')
                            ? linkedinUser
                            : `https://linkedin.com/in/${linkedinUser}`
                        }
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={() => handleTrack('click_linkedin')}
                        className="group flex flex-col items-center justify-center gap-1.5 p-3 rounded-xl bg-zinc-950/75 border border-zinc-800 hover:border-blue-500/50 hover:bg-zinc-900 transition-all text-center"
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
                    )}

                    {/* GitHub */}
                    {githubUser && (
                      <a
                        href={`https://github.com/${githubUser}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group flex flex-col items-center justify-center gap-1.5 p-3 rounded-xl bg-zinc-950/75 border border-zinc-800 hover:border-zinc-500 hover:bg-zinc-900 transition-all text-center"
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
                    )}

                    {/* Facebook */}
                    {facebookUser && (
                      <a
                        href={
                          facebookUser.startsWith('http')
                            ? facebookUser
                            : `https://facebook.com/${facebookUser}`
                        }
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={() => handleTrack('click_facebook')}
                        className="group flex flex-col items-center justify-center gap-1.5 p-3 rounded-xl bg-zinc-950/75 border border-zinc-800 hover:border-blue-600/50 hover:bg-zinc-900 transition-all text-center"
                      >
                        <div className="h-7 w-7 flex items-center justify-center text-blue-500 group-hover:scale-110 transition">
                          <svg viewBox="0 0 24 24" className="h-5 w-5 fill-current">
                            <path d="M22.675 0h-21.35c-.732 0-1.325.593-1.325 1.325v21.351c0 .731.593 1.324 1.325 1.324h11.495v-9.294h-3.128v-3.622h3.128v-2.671c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.463.099 2.795.143v3.24l-1.918.001c-1.504 0-1.795.715-1.795 1.763v2.313h3.587l-.467 3.622h-3.12v9.293h6.116c.73 0 1.323-.593 1.323-1.325v-21.35c0-.732-.593-1.325-1.325-1.325z" />
                          </svg>
                        </div>
                        <span className="text-[11px] font-semibold text-zinc-300 group-hover:text-white">
                          Facebook
                        </span>
                      </a>
                    )}

                    {/* TikTok */}
                    {tiktokUser && (
                      <a
                        href={
                          tiktokUser.startsWith('http')
                            ? tiktokUser
                            : `https://tiktok.com/@${tiktokUser}`
                        }
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={() => handleTrack('click_tiktok')}
                        className="group flex flex-col items-center justify-center gap-1.5 p-3 rounded-xl bg-zinc-950/75 border border-zinc-800 hover:border-cyan-400/50 hover:bg-zinc-900 transition-all text-center"
                      >
                        <div className="h-7 w-7 flex items-center justify-center text-cyan-400 group-hover:scale-110 transition">
                          <svg viewBox="0 0 24 24" className="h-5 w-5 fill-current">
                            <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z" />
                          </svg>
                        </div>
                        <span className="text-[11px] font-semibold text-zinc-300 group-hover:text-white">
                          TikTok
                        </span>
                      </a>
                    )}

                    {/* YouTube */}
                    {youtubeUser && (
                      <a
                        href={
                          youtubeUser.startsWith('http')
                            ? youtubeUser
                            : `https://youtube.com/@${youtubeUser}`
                        }
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={() => handleTrack('click_youtube')}
                        className="group flex flex-col items-center justify-center gap-1.5 p-3 rounded-xl bg-zinc-950/75 border border-zinc-800 hover:border-red-500/50 hover:bg-zinc-900 transition-all text-center"
                      >
                        <div className="h-7 w-7 flex items-center justify-center text-red-500 group-hover:scale-110 transition">
                          <svg viewBox="0 0 24 24" className="h-5 w-5 fill-current">
                            <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                          </svg>
                        </div>
                        <span className="text-[11px] font-semibold text-zinc-300 group-hover:text-white">
                          YouTube
                        </span>
                      </a>
                    )}

                    {/* Website */}
                    {!isMassami && websiteUrl && (
                      <a
                        href={
                          websiteUrl.startsWith('http')
                            ? websiteUrl
                            : `https://${websiteUrl}`
                        }
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={() => handleTrack('click_website')}
                        className="group flex flex-col items-center justify-center gap-1.5 p-3 rounded-xl bg-zinc-950/75 border border-zinc-800 hover:border-amber-500/50 hover:bg-zinc-900 transition-all text-center"
                      >
                        <div className="h-7 w-7 flex items-center justify-center text-amber-400 group-hover:scale-110 transition">
                          <Globe className="h-5 w-5" />
                        </div>
                        <span className="text-[11px] font-semibold text-zinc-300 group-hover:text-white">
                          Site Oficial
                        </span>
                      </a>
                    )}
                  </div>
                </div>
              </NeonGradientCard>
            </div>
          )}
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
            © {new Date().getFullYear()} Konnexy Ecosystem • Todos os direitos
            reservados.
          </p>
        </footer>
      </main>

      {/* Lightbox para Ampliar Fotos em Proporção Original */}
      <AnimatePresence>
        {lightboxImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setLightboxImage(null)}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md p-4"
          >
            <button
              type="button"
              onClick={() => setLightboxImage(null)}
              aria-label="Fechar imagem"
              className="absolute top-4 right-4 flex h-10 w-10 items-center justify-center rounded-full bg-zinc-800/80 text-zinc-200 hover:text-white"
            >
              <X className="h-5 w-5" />
            </button>
            <img
              src={lightboxImage}
              alt="Visualização ampliada"
              className="max-h-[85vh] max-w-[92vw] object-contain rounded-2xl shadow-2xl border border-zinc-800"
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Gaveta / Bottom Sheet de Catálogo & Projetos */}
      <ProjectsBottomSheet
        isOpen={isProjectsSheetOpen}
        onClose={() => setIsProjectsSheetOpen(false)}
        isMassami={isMassami}
        businessName={displayName}
        services={normalizedServices}
        onSelectProjectForContact={handleSelectProjectForContact}
      />
    </div>
  );
}
