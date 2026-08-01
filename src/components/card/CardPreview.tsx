"use client";

import React, { useEffect, useRef, useState } from 'react';

import { 
  MapPin, 
  Globe, 
  Instagram, 
  MessageCircle, 
  Share2, 
  Linkedin, 
  Facebook, 
  Twitter, 
  Youtube,
  BadgeCheck,
  Send,
  ExternalLink,
  Lock,
  Sparkles,
  Download,
  Image as ImageIcon,
  MoreVertical,
  UserPlus,
  FileText,
  Star,
  Briefcase,
  Code,
  Paintbrush,
  Utensils,
  UtensilsCrossed,
  ShoppingBag,
  Heart,
  User,
  Settings,
  Cpu,
  Hammer,
  Wrench,
  Scissors,
  Music,
  Video,
  GraduationCap,
  Stethoscope,
  Scale,
  Calculator,
  Building2,
  Rocket,
  Zap,
  Target,
  Users,
  Award,
  Camera,
  Smartphone,
  Link,
  Crown,
  Plus,
  Tag,
  Shield,
  Clock,
  ChevronRight,
  Construction,
  History,
  ShieldCheck,
  Car,
  PawPrint,
  Terminal,
  Code2,
  Home,
  Gem,
  Navigation,
  Package,
  HardHat,
  HeartPulse,
  Check,
  CheckCircle2,
  Truck,
  Calendar,
  Monitor,
  Play,
  Headphones,
  Mic2,
  Copy,
  Umbrella,
  Sun,
  Palmtree,
  Receipt,
  CreditCard,
  Landmark,
  Brush,
  Flower2,
  Eye,
  Smile,
  Baby,
  Wind,
  Coffee,
  Wifi
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Profile } from '@/types/profile';
import { cn, hexToHsl } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { trackEvent, AnalyticsEventType } from '@/app/actions/analytics';
import { toast } from 'sonner';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import { DigitalField } from '@/components/pro/DigitalField';
import { AnimatedQR } from '@/components/pro/AnimatedQR';
import { isPaidUser } from '@/utils/planUtils';
import { StandardProfessionalLayout } from './StandardProfessionalLayout';
import { AutomotiveDetailingLayout } from './AutomotiveDetailingLayout';
import { ChefEventosLayout } from './ChefEventosLayout';
import { MontadorMoveisLayout } from './MontadorMoveisLayout';
import { getProfessionConfig as getGlobalConfig } from '@/config/professions';

interface CardPreviewProps {
  data: Partial<Profile>;
  showBranding?: boolean;
  suppressTracking?: boolean;
  isDownloadMode?: boolean;
  forceProPreview?: boolean; // Novo: força a exibição de recursos PRO no editor
}

function AutoCarousel({ images }: { images: string[] }) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (!scrollRef.current || images.length <= 1 || paused) return;
    
    const interval = setInterval(() => {
      if (scrollRef.current) {
        const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
        const scrollMax = scrollWidth - clientWidth;
        const itemWidth = 280 + 12; // 280px width + 12px gap
        
        let newScrollLeft = scrollLeft + itemWidth;
        // Volta ao inicio se estiver no final
        if (newScrollLeft >= scrollMax + itemWidth / 2) {
          newScrollLeft = 0;
        }
        
        scrollRef.current.scrollTo({
          left: newScrollLeft,
          behavior: 'smooth'
        });
      }
    }, 2500);

    return () => clearInterval(interval);
  }, [images.length, paused]);

  return (
    <div className="w-full relative group">
      <div 
        ref={scrollRef}
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
        onTouchStart={() => setPaused(true)}
        onTouchEnd={() => setPaused(false)}
        className="flex gap-3 overflow-x-auto pb-4 scroll-hide snap-x snap-mandatory px-1"
      >
        {images.map((img, i) => (
          <motion.div
            key={i}
            whileHover={{ scale: 1.02 }}
            className="relative flex-none w-[280px] aspect-[4/5] rounded-[2rem] overflow-hidden snap-center border border-white/10 shadow-lg bg-slate-100 dark:bg-slate-900"
          >
            <Image 
              src={img} 
              alt={`Portfolio ${i + 1}`} 
              fill 
              className="object-cover"
              unoptimized
            />
            <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
          </motion.div>
        ))}
      </div>
      
      {/* Visual indicator for scrollability */}
      {images.length > 1 && (
        <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 flex gap-1.5 pointer-events-none">
          {images.slice(0, 5).map((_, i) => (
            <div key={i} className="w-1.5 h-1.5 rounded-full bg-primary/20" />
          ))}
        </div>
      )}
    </div>
  );
}

export function CardPreview({ 
  data, 
  showBranding = true, 
  suppressTracking = false, 
  isDownloadMode = false,
  forceProPreview = false 
}: CardPreviewProps) {
  // isPro agora é verdadeiro se o plano for PRO OU se estivermos forçando o preview no editor
  const isPaid = isPaidUser(data as Profile) || forceProPreview;
  const isPro = isPaid;
  const isBarbearia = data.profession === 'barbearia' || data.category === 'barbearia';
  const isEsteticaAutomotiva = ['estetica_automotiva', 'manutencao_automotiva', 'vistoria_veicular'].includes(data.profession as string) || ['estetica_automotiva', 'manutencao_automotiva', 'vistoria_veicular'].includes(data.category as string) || (data.subtitle || '').toLowerCase().includes('película') || (data.business_name || '').toLowerCase().includes('films');
  const isBeauty = ['beauty', 'manicure', 'cabeleireiro'].includes(data.profession as string) || data.category === 'beauty';
  const isHealth = ['health', 'personal_trainer', 'psicologo'].includes(data.profession as string) || data.category === 'health';
  const isSales = data.profession === 'sales' || data.category === 'sales';
  const isFood = ['food', 'quentinhas', 'pizzaria', 'cafeteria'].includes(data.profession as string) || data.category === 'food';
  const isService = data.profession === 'service' || data.category === 'service';
  const isModernService = [
    'pedreiro', 'mecanico', 'eletricista', 'encanador', 'diarista', 
    'frete', 'ar_condicionado', 'gesseiro', 
    'vidraceiro', 'pintor', 'serralheiro', 'marceneiro', 
    'assistencia_celular', 'mestre_de_obras', 'area_lazer', 'manutencao_automotiva'
  ].includes(data.profession as string);
  const isAdvogado = data.profession === 'advogado' || data.category === 'advogado';
  const isTech = ['tech', 'tecnico_informatica', 'designer', 'fotografo'].includes(data.profession as string) || data.category === 'tech';
  const isRealEstate = data.profession === 'real_estate' || data.category === 'real_estate';
  const isDriver = data.profession === 'driver' || data.category === 'driver';
  const isPetshop = data.profession === 'petshop' || data.category === 'petshop';
  const isVeterinario = data.profession === 'veterinario' || data.category === 'veterinario';
  const isArtesao = data.profession === 'artesao' || data.category === 'artesao';
  const isMusico = data.profession === 'musico' || data.category === 'musico';
  const cf = (data.custom_fields as any) || {};
  
  const isStandardized = isModernService || ['quentinhas', 'assistencia_celular', 'van_escolar', 'guia_turistico', 'loja_online', 'esteticista', 'pizzaria', 'cafeteria', 'vistoria_veicular'].some(p => data.profession === p);

  // Data helpers that prefer new fields but fall back to old ones for compatibility
  const previewName = data.business_name || data.name || 'Seu Nome';
  const previewTagline = data.subtitle || data.tagline || 'Sua Especialidade';
  const previewAddress = data.endereco_completo || data.address;
  const previewArea = data.area_atendimento || data.service_area;
  const previewHours = data.horario_funcionamento || '';

  const handleTrackClick = async (type: AnalyticsEventType) => {
    if (suppressTracking || !data.id || isDownloadMode) return;
    await trackEvent(data.id, type);
  };

  const handleDownloadPDF = async () => {
    const cardElement = document.getElementById('digital-card-content');
    if (!cardElement) return;

    toast.loading('Gerando seu cartão PDF profissional...');
    
    try {
      const canvas = await html2canvas(cardElement, {
        scale: 5, // Aumentado para máxima nitidez em telas de alta densidade
        useCORS: true,
        logging: false,
        backgroundColor: null,
        allowTaint: true,
        imageTimeout: 0,
        onclone: (clonedDoc) => {
          // Garante que o elemento clonado esteja visível e com as dimensões corretas
          const el = clonedDoc.getElementById('digital-card-content');
          if (el) {
            el.style.transform = 'none';
            el.style.boxShadow = 'none'; // Sombras complexas podem borrar no canvas, o Pro ja tem ring
          }
        }
      });
      
      const imgData = canvas.toDataURL('image/png', 1.0);
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: [85, 150],
        compress: true // Ativa compressão para manter o arquivo leve sem perder qualidade visual
      });
      
      pdf.addImage(imgData, 'PNG', 0, 0, 85, 150, undefined, 'FAST');
      pdf.save(`Konnexy_${previewName}.pdf`);
      toast.success('PDF baixado!');
    } catch (err) {
      console.error(err);
      toast.error('Erro ao gerar PDF');
    } finally {
      toast.dismiss();
    }
  };

  const handleDownloadPNG = async () => {
    const cardElement = document.getElementById('digital-card-content');
    if (!cardElement) return;

    toast.loading('Gerando imagem de alta qualidade...');
    
    try {
      const canvas = await html2canvas(cardElement, {
        scale: 4, // Ultra alta resolução
        useCORS: true,
        logging: false,
        backgroundColor: null,
      });
      
      const link = document.createElement('a');
      link.download = `Konnexy_${previewName}.png`;
      link.href = canvas.toDataURL('image/png', 1.0);
      link.click();
      toast.success('Imagem salva!');
    } catch (err) {
      console.error(err);
      toast.error('Erro ao gerar imagem');
    } finally {
      toast.dismiss();
    }
  };

  const handleSaveContact = () => {
    // Basic vCard generation
    const vcard = `BEGIN:VCARD
VERSION:3.0
FN:${data.business_name || data.name || 'Contato'}
ORG:${data.subtitle || data.tagline || ''}
TEL;TYPE=CELL:${formattedWhatsapp}
URL:${typeof window !== 'undefined' ? window.location.href : ''}
END:VCARD`;

    const blob = new Blob([vcard], { type: 'text/vcard' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `${previewName}.vcf`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success('Contato pronto para salvar!');
  };
  
  const cleanWhatsapp = data.whatsapp?.replace(/\D/g, '') || '';
  const formattedWhatsapp = cleanWhatsapp.startsWith('55') ? cleanWhatsapp : `55${cleanWhatsapp}`;
  
  const defaultMessage = data.whatsapp_message || (
    isBarbearia ? "Olá! Gostaria de agendar um corte 💈" : 
    data.profession === 'psicologo' ? "Olá! Gostaria de agendar uma consulta psicológica 🛋️" :
    data.profession === 'personal_trainer' ? "Olá! Gostaria de informações sobre consultoria/aulas 💪" :
    data.profession === 'esteticista' ? "Olá! Gostaria de marcar uma avaliação estética 💆‍♀️" :
    data.profession === 'fotografo' ? "Olá! Gostaria de um orçamento para fotos 📸" :
    data.profession === 'designer' ? "Olá! Gostaria de falar sobre um projeto de design 🎨" :
    data.profession === 'tecnico_informatica' ? "Olá! Gostaria de solicitar um suporte técnico 💻" :
    data.profession === 'tech' ? "Olá! Gostaria de falar sobre desenvolvimento de um projeto técnico 🚀" :
    isHealth ? "Olá! Gostaria de agendar um atendimento 🩺" :
    isAdvogado ? "Olá! Gostaria de agendar uma consulta jurídica ⚖️" :
    isRealEstate ? "Olá! Vi seu perfil na Konnexy e gostaria de falar sobre imóveis 🏠" :
    isPetshop ? "Olá! Vi seu perfil na Konnexy e gostaria de agendar um serviço para meu pet 🐾" :
    isVeterinario ? "Olá! Vi seu perfil na Konnexy e gostaria de agendar uma consulta veterinária 🩺" :
    isArtesao ? "Olá! Vi seu perfil na Konnexy e gostaria de falar sobre as suas peças artesanais / encomendas 🎨" :
    isMusico ? "Olá! Gostaria de conversar sobre seu trabalho como músico 🎸" : 
    data.profession === 'mestre_de_obras' ? "Olá! Vi seu perfil na Konnexy e gostaria de um orçamento para minha obra 🏗️" :
    data.profession === 'area_lazer' ? "Olá! Vi seu perfil na Konnexy e gostaria de consultar a disponibilidade da sua área de lazer 📅" :
    data.profession === 'pizzaria' ? "Olá! Vi seu perfil na Konnexy e gostaria de fazer um pedido de pizza 🍕" :
    data.profession === 'cafeteria' ? "Olá! Gostaria de fazer um pedido / reservar uma mesa na cafeteria ☕" :
    data.profession === 'vistoria_veicular' ? "Olá! Gostaria de agendar uma vistoria no meu veículo 🛡️🚘" :
    isDriver ? "Olá! Gostaria de agendar uma corrida / entrega 🚗" : 
    `Olá! Vi seu perfil na Konnexy e gostaria de ${isPro ? 'solicitar um orçamento' : 'conversar'} sobre seus serviços.`
  );
  
  const whatsappLink = cleanWhatsapp
    ? `https://wa.me/${formattedWhatsapp}?text=${encodeURIComponent(defaultMessage)}`
    : '#';

  const cleanWhatsappSecondary = data.whatsapp_secondary?.replace(/\D/g, '') || '';
  const formattedWhatsappSecondary = cleanWhatsappSecondary.startsWith('55') ? cleanWhatsappSecondary : `55${cleanWhatsappSecondary}`;
  const whatsappSecondaryLink = cleanWhatsappSecondary
    ? `https://wa.me/${formattedWhatsappSecondary}?text=${encodeURIComponent(data.whatsapp_secondary_message || defaultMessage)}`
    : '#';

  const socialLinks = [
    { id: 'instagram', icon: Instagram, value: data.instagram, url: `https://instagram.com/${data.instagram}`, label: 'Instagram', trackType: 'click_instagram' as const },
    { id: 'linkedin', icon: Linkedin, value: data.linkedin, url: `https://linkedin.com/in/${data.linkedin}`, label: 'LinkedIn', trackType: 'click_linkedin' as const },
    { id: 'facebook', icon: Facebook, value: data.facebook, url: `https://facebook.com/${data.facebook}`, label: 'Facebook', trackType: 'click_facebook' as const },
    { id: 'tiktok', icon: Music, value: data.tiktok, url: `https://tiktok.com/@${data.tiktok}`, label: 'TikTok', trackType: 'click_tiktok' as const },
    { id: 'twitter', icon: Twitter, value: data.twitter, url: `https://twitter.com/${data.twitter}`, label: 'Twitter', trackType: 'click_twitter' as const },
    { id: 'youtube', icon: Youtube, value: data.youtube, url: `https://youtube.com/@${data.youtube}`, label: 'YouTube', trackType: 'click_youtube' as const },
    { id: 'professional_website', icon: Globe, value: data.website, url: data.website?.startsWith('http') ? data.website : `https://${data.website}`, label: 'Website', trackType: 'click_website' as const },
    { id: 'digital_presence', icon: User, value: true, url: `${process.env.NEXT_PUBLIC_APP_URL || 'https://konnexy.com.br'}/${data.username || data.id}`, label: 'Perfil Digital', trackType: 'click_website' as const },
    { id: 'portfolio_anchor', icon: Link, value: (data.custom_links?.length || 0) > 0, url: `${process.env.NEXT_PUBLIC_APP_URL || 'https://konnexy.com.br'}/${data.username || data.id}#custom-links-section`, label: 'Links & Portfólio', trackType: 'click_custom_links' as any },
  ];

  // All valid links (those with a value)
  const validSocialLinks = socialLinks.filter(s => s.value);
  const customLinks = data.custom_links || [];
  
  // Logic: Pro sees everything. Free sees only 1st and others are disabled.
  const activeServicesLimit = isPro ? 20 : 5; // Increased limit for better grid demo
  const rawServices = data.servicos || data.services || [];
  const services = rawServices.map(s => {
    if (typeof s === 'string') return { name: s, icon: 'Sparkles', whatsappUrl: '' };
    // Map new field names to old ones for compatibility with preview layouts
    const nome = (s as any).nome || (s as any).name;
    const preco = (s as any).preco || (s as any).price;
    const descricao = (s as any).descricao || (s as any).description;
    
    let whatsappUrl = '';
    if (formattedWhatsapp) {
      const serviceMessage = preco && preco.toLowerCase() !== 'sob consulta'
        ? `Olá! Vi seu perfil na Konnexy e gostaria de saber mais sobre: *${nome}* no valor de *${preco}*.`
        : `Olá! Vi seu perfil na Konnexy e gostaria de saber mais sobre: *${nome}*.`;
      whatsappUrl = `https://wa.me/${formattedWhatsapp}?text=${encodeURIComponent(serviceMessage)}`;
    }

    return { name: nome, price: preco, description: descricao, image: (s as any).imagem || (s as any).image || '', icon: (s as any).icon || 'Sparkles', whatsappUrl };
  }).filter(s => s.name?.trim() !== '') || [];
  const activeServicesArr = services.slice(0, activeServicesLimit);
  
  const mainService = activeServicesArr[0];
  const secondaryServices = activeServicesArr.slice(1);

  const ICON_MAP: Record<string, any> = {
    Sparkles, Star, Briefcase, Code, Paintbrush, Camera, Utensils, ShoppingBag, 
    Heart, User, Settings, MessageCircle, Globe, Cpu, Smartphone, Hammer, 
    Wrench, Scissors, Music, Video, GraduationCap, Stethoscope, Scale, 
    Calculator, Building2, Rocket, Zap, Target, Users, Award
  };

  const handleShare = (e: React.MouseEvent) => {
    e.preventDefault();
    if (navigator.share) {
      navigator.share({
        title: data.business_name || data.name || 'Konnexy',
        text: data.subtitle || data.tagline || 'Confira meu perfil profissional',
        url: typeof window !== 'undefined' ? window.location.href : '',
      });
    }
  };

  const getThemeClasses = () => {
    const cf = (data.custom_fields as any) || {};
    
    // Se tiver cor customizada (paleta), o fundo deve ser transparente para mostrar a cor do style
    if (cf.cor_fundo) return "bg-transparent";

    if (!isPro) return "bg-white dark:bg-slate-950";
    
    if (isBarbearia) {
      return "bg-slate-950 text-white border-white/5 shadow-[inset_0_0_120px_rgba(255,255,255,0.02)]";
    }

    if (isEsteticaAutomotiva) {
      return "bg-[#0a0a0a] text-white border-white/5 shadow-[inset_0_0_100px_rgba(245,158,11,0.05)]";
    }

    if (isBeauty) {
      return "bg-[#fffafb] text-slate-900 border-rose-100 shadow-[0_20px_50px_rgba(244,63,94,0.03)]";
    }

    if (isHealth) {
      return "bg-white dark:bg-slate-950 text-slate-900 dark:text-white border-emerald-100 dark:border-emerald-900/20";
    }

    if (isFood) {
      return "bg-[#fffcf5] text-slate-900 border-orange-100 shadow-[0_20px_50px_rgba(251,191,36,0.05)]";
    }

    if (isModernService) {
      return "bg-[#fafafa] text-slate-900 border-slate-100 shadow-[0_20px_50px_rgba(0,0,0,0.02)]";
    }

    if (isTech) {
      return "bg-[#020617] text-white border-blue-900/40 shadow-[inset_0_0_120px_rgba(59,130,246,0.1)]";
    }

    if (isRealEstate) {
      return "bg-[#f8fafc] text-slate-900 border-sky-100 shadow-[0_20px_50px_rgba(14,165,233,0.05)]";
    }

    if (isDriver) {
      return "bg-[#111111] text-white border-white/5 shadow-[inset_0_0_100px_rgba(255,255,255,0.02)]";
    }

    if (isPetshop) {
      return "bg-[#fffaf5] text-slate-900 border-orange-100 shadow-[0_20px_50px_rgba(249,115,22,0.05)]";
    }

    if (isVeterinario) {
      return "bg-[#ecfdf5] text-slate-900 border-emerald-100 shadow-[0_20px_50px_rgba(16,185,129,0.05)]";
    }

    if (isArtesao) {
      return "bg-[#fffbeb] text-slate-900 border-amber-100 shadow-[0_20px_50px_rgba(245,158,11,0.05)]";
    }
    
    switch (data.theme_style) {
      case 'oled': 
        return "bg-black text-white border-white/10 shadow-[inset_0_0_120px_rgba(59,130,246,0.15)]";
      case 'glass': 
        return "bg-white/10 backdrop-blur-3xl border-white/20 shadow-[inset_0_0_40px_rgba(255,255,255,0.1)]";
      case 'minimalist': 
        return "bg-white text-slate-900 border-slate-100 shadow-none";
      default: 
        return "bg-slate-950 text-white border-white/5";
    }
  };

  const getFrameConfig = () => {
    if (!isPro) return null;
    
    switch (data.avatar_frame) {
      case 'barber':
        return { 
          gradient: 'linear-gradient(135deg, #111 0%, #d4af37 100%)', 
          accent: '#d4af37', 
          label: 'Mestre da Lâmina',
          icon: Scissors,
          cta: 'Agende seu horário',
          shape: 'polygon(50% 50%, 80% 0%, 100% 0%, 55% 52%, 100% 100%, 80% 100%, 52% 55%, 35% 72%, 35% 92%, 25% 100%, 8% 100%, 0% 88%, 0% 68%, 18% 58%, 28% 58%, 32% 54%, 28% 50%, 12% 50%, 0% 38%, 0% 12%, 8% 0%, 25% 0%, 35% 8%, 35% 38%)'
        };
      case 'tech':
        return { 
          gradient: 'linear-gradient(135deg, #000 0%, #3b82f6 100%)', 
          accent: '#3b82f6', 
          label: 'Inovação Digital',
          icon: Cpu,
          cta: 'Quero Orçamento',
          shape: 'polygon(0% 10%, 100% 10%, 100% 70%, 65% 70%, 70% 85%, 85% 85%, 85% 100%, 15% 100%, 15% 85%, 30% 85%, 35% 70%, 0% 70%)'
        };
      case 'beauty':
        return { 
          gradient: 'linear-gradient(135deg, #f472b6 0%, #db2777 100%)', 
          accent: '#f472b6', 
          label: 'Beleza & Estilo',
          icon: Sparkles,
          cta: 'Agendar Horário ✨',
          shape: 'polygon(50% 0%, 90% 20%, 100% 60%, 75% 100%, 25% 100%, 0% 60%, 10% 20%)'
        };
      case 'real_estate':
        return { 
          gradient: 'linear-gradient(135deg, #0ea5e9 0%, #0369a1 100%)', 
          accent: '#0ea5e9', 
          label: 'Negócios Imobiliários',
          icon: Building2,
          cta: 'Solicitar Informações 🏠',
          shape: 'polygon(50% 0%, 100% 40%, 100% 100%, 0% 100%, 0% 40%)'
        };
      case 'lawyer':
        return { 
          gradient: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)', 
          accent: '#1e293b', 
          label: 'Consultoria Jurídica',
          icon: Scale,
          cta: 'Agendar Consulta Jurídica ⚖️',
          shape: 'polygon(20% 0%, 80% 0%, 100% 20%, 100% 80%, 80% 100%, 20% 100%, 0% 80%, 0% 20%)'
        };
      case 'service':
        return { 
          gradient: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)', 
          accent: '#f59e0b', 
          label: 'Especialista em Serviços',
          icon: Hammer,
          cta: 'Solicitar Orçamento 🛠️',
          shape: 'polygon(30% 0%, 70% 0%, 100% 30%, 100% 70%, 70% 100%, 30% 100%, 0% 70%, 0% 30%)'
        };
      case 'sales':
        return { 
          gradient: 'linear-gradient(135deg, #8b5cf6 0%, #6d28d9 100%)', 
          accent: '#8b5cf6', 
          label: 'Representante Comercial',
          icon: ShoppingBag,
          cta: 'Ver Catálogo 🛍️',
          shape: 'circle(50% at 50% 50%)'
        };
      case 'health':
        return { 
          gradient: 'linear-gradient(135deg, #10b981 0%, #059669 100%)', 
          accent: '#10b981', 
          label: 'Profissional de Saúde',
          icon: Stethoscope,
          cta: 'Agendar Consulta 🩺',
          shape: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)'
        };
      case 'food':
        return { 
          gradient: 'linear-gradient(135deg, #ef4444 0%, #b91c1c 100%)', 
          accent: '#ef4444', 
          label: 'Espaço Gastronômico',
          icon: Utensils,
          cta: 'Fazer Pedido 🍔',
          shape: 'polygon(0% 0%, 100% 0%, 90% 100%, 10% 100%)'
        };
      case 'cafeteria':
        return { 
          gradient: 'linear-gradient(135deg, #78350f 0%, #451a03 100%)', 
          accent: '#78350f', 
          label: 'Especialista em Café',
          icon: Coffee,
          cta: 'Ver Cardápio ☕',
          shape: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)'
        };
      case 'estetica_automotiva':
        return { 
          gradient: 'linear-gradient(135deg, #111111 0%, #f59e0b 100%)', 
          accent: '#f59e0b', 
          label: 'Estética Automotiva Premium',
          icon: Car,
          cta: 'Solicitar Orçamento 🚘',
          shape: 'polygon(0% 10%, 100% 0%, 100% 90%, 0% 100%)'
        };
    }
    return null;
  };

  const getPhotoFilter = (): string => {
    if (!isPro) return 'none';
    switch (data.photo_filter) {
      case 'bw':      return 'grayscale(100%) contrast(1.1)';
      case 'vintage': return 'sepia(55%) contrast(1.08) brightness(0.92) saturate(0.8)';
      case 'vivid':   return 'saturate(1.9) contrast(1.12) brightness(1.05)';
      case 'golden':  return 'sepia(35%) saturate(1.4) brightness(1.1) hue-rotate(-5deg)';
      case 'cold':    return 'hue-rotate(195deg) saturate(1.3) brightness(1.05)';
      case 'faded':   return 'opacity(0.85) grayscale(20%) brightness(1.1) contrast(0.9) saturate(0.75)';
      case 'dramatic':return 'contrast(1.4) brightness(0.85) saturate(1.2)';
      default:        return 'none';
    }
  };

  const frameConfig = getFrameConfig();
  const premiumGradient = frameConfig?.gradient || (isPro ? (isEsteticaAutomotiva ? 'linear-gradient(135deg, #f59e0b 0%, #b45309 100%)' : `linear-gradient(135deg, ${data.theme_color || '#3b82f6'} 0%, #8b5cf6 100%)`) : undefined);

  const getFieldIcon = (fieldName: string) => {
    const name = fieldName.toLowerCase();
    if (name.includes('atende_domicilio') || name.includes('residencial') || name.includes('home')) return Home;
    if (name.includes('agendamento') || name.includes('horario') || name.includes('schedule')) return Calendar;
    if (name.includes('oab') || name.includes('creci') || name.includes('nr10') || name.includes('registro') || name.includes('crmv') || name.includes('garantia') || name.includes('seguro')) return ShieldCheck;
    if (name.includes('delivery') || name.includes('entreg') || name.includes('frete') || name.includes('veiculo') || name.includes('truck') || name.includes('van')) return Truck;
    if (name.includes('online') || name.includes('remoto') || name.includes('digital') || name.includes('zoom')) return Monitor;
    if (name.includes('experiencia') || name.includes('anos')) return History;
    if (name.includes('socorro') || name.includes('emergencia') || name.includes('urgencia') || name.includes('plantao')) return Zap;
    if (name.includes('clinico') || name.includes('saude') || name.includes('medico') || name.includes('vital')) return HeartPulse;
    if (name.includes('celular') || name.includes('mobile') || name.includes('phone')) return Smartphone;
    if (name.includes('cartao') || name.includes('pagamento') || name.includes('pix') || name.includes('credit')) return Calculator;
    if (name.includes('orcamento') || name.includes('recibo')) return Receipt;
    if (['reforma', 'ferramentas', 'obra', 'construction', 'hard_hat', 'leva_produtos'].some(k => name.includes(k))) return HardHat;
    if (name.includes('banho') || name.includes('tosa') || name.includes('grooming') || name.includes('animal') || name.includes('pet') || name.includes('vet')) return PawPrint;
    if (name.includes('monitor') || name.includes('ajudante')) return UserPlus;
    if (name.includes('ar_condicionado') || name.includes('climatizacao')) return Zap;
    if (name.includes('escola') || name.includes('faculdade') || name.includes('universitario')) return GraduationCap;
    if (name.includes('materiais') || name.includes('producao') || name.includes('encomenda') || name.includes('pronta_entrega')) return Package;
    if (name.includes('alto_padrao') || name.includes('premium')) return Gem;
    if (name.includes('financiamento')) return Landmark;
    if (name.includes('planta') || name.includes('imovel') || name.includes('venda_aluguel')) return Building2;
    if (name.includes('avaliacao')) return Scale;
    if (name.includes('pele') || name.includes('estetica') || name.includes('facial') || name.includes('injetaveis') || name.includes('microagulhamento')) return Sparkles;
    if (name.includes('unha') || name.includes('manicure') || name.includes('pigmentacao') || name.includes('nail_art')) return Brush;
    if (name.includes('crp') || name.includes('autoclave') || name.includes('biosseguranca')) return ShieldCheck;
    if (name.includes('terapia_casal')) return Heart;
    if (name.includes('depilacao') || name.includes('laser')) return Zap;
    if (name.includes('spa') || name.includes('drenagem') || name.includes('relaxante')) return Flower2;
    if (name.includes('convenio') || name.includes('plano')) return CheckCircle2;
    if (name.includes('cafe') || name.includes('coffee') || name.includes('torra') || name.includes('preparo')) return Coffee;
    if (name.includes('wifi') || name.includes('wi_fi')) return Wifi;
    if (name.includes('coworking')) return Monitor;
    return Award;
  };

  const renderProfessionHighlights = (themeColor: string = '#8b5cf6') => {
    const globalConfig = getGlobalConfig(data.profession || data.category);
    if (!globalConfig || globalConfig.customFields.length === 0) return null;

    const fields = globalConfig.customFields.filter(field => {
       const value = (data.custom_fields as any)?.[field.name];
       // Show if it's a boolean true, or a non-empty string/array
       if (field.type === 'boolean') return value === true;
       return (value !== undefined && value !== null && value !== '' && (Array.isArray(value) ? value.length > 0 : true));
    });

    if (fields.length === 0) return null;

    return (
       <div className="w-full mb-10 px-1">
             <div className="h-px flex-1 bg-current opacity-10" />
             <span 
               className="text-[10px] font-black uppercase tracking-[0.4em] opacity-80 text-center"
               style={(data.custom_fields as any)?.cor_info_texto ? { color: (data.custom_fields as any).cor_info_texto } : (data.custom_fields as any)?.cor_texto ? { color: (data.custom_fields as any).cor_texto } : undefined}
             >
               Especialidades & Atributos
             </span>
             <div className="h-px flex-1 bg-current opacity-10" />
          <div className="grid grid-cols-2 gap-4">
             {fields.map((field) => {
                const value = (data.custom_fields as any)?.[field.name];
                const Icon = getFieldIcon(field.name);
                const displayLabel = field.label.replace(/\s*\(.*?\)\s*/g, '');
                const isArray = field.type === 'array' || Array.isArray(value);

                return (
                   <motion.div 
                     key={field.name} 
                     whileHover={{ y: -4, scale: 1.02 }}
                     className={cn(
                       "p-5 rounded-[2rem] backdrop-blur-md border flex flex-col items-center text-center gap-3 transition-all shadow-sm hover:shadow-md", 
                       isArray ? "col-span-2" : "",
                       !(data.custom_fields as any)?.cor_info_fundo && "bg-white/60 dark:bg-slate-900/40 border-slate-100 dark:border-white/10"
                     )}
                     style={(data.custom_fields as any)?.cor_info_fundo ? {
                       backgroundColor: (data.custom_fields as any).cor_info_fundo,
                       borderColor: (data.custom_fields as any).cor_info_fundo + '40'
                     } : undefined}
                   >
                      {field.type === 'boolean' ? (
                        <>
                           <div className="relative p-4 rounded-2xl flex items-center justify-center overflow-hidden transition-transform">
                             <div className="absolute inset-0 opacity-10" style={{ backgroundColor: themeColor }} />
                             <Icon className="w-6 h-6 relative z-10" style={{ color: themeColor }} />
                           </div>
                           <span 
                             className={cn("text-xs font-black uppercase tracking-tight leading-tight mt-1", !(data.custom_fields as any)?.cor_info_texto && !(data.custom_fields as any)?.cor_texto && "text-slate-800 dark:text-white")}
                             style={(data.custom_fields as any)?.cor_info_texto ? { color: (data.custom_fields as any).cor_info_texto } : (data.custom_fields as any)?.cor_texto ? { color: (data.custom_fields as any).cor_texto } : undefined}
                           >{displayLabel}</span>
                           <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20">
                             <Check className="w-3 h-3 text-emerald-500" />
                             <span className="text-[8px] font-black text-emerald-600 uppercase">Confirmado</span>
                           </div>
                        </>
                      ) : isArray ? (
                        <>
                           <div className="flex items-center gap-3 mb-2 w-full justify-center">
                              <div className="w-8 h-8 rounded-xl bg-slate-100 dark:bg-white/5 flex items-center justify-center">
                                <Icon className="w-4 h-4 opacity-70" style={{ color: themeColor }} />
                              </div>
                              <span 
                                className="text-[10px] font-black uppercase tracking-widest opacity-60"
                                style={(data.custom_fields as any)?.cor_info_texto ? { color: (data.custom_fields as any).cor_info_texto } : (data.custom_fields as any)?.cor_texto ? { color: (data.custom_fields as any).cor_texto } : { color: '#64748b' }}
                              >{displayLabel}</span>
                           </div>
                           <div className="flex flex-wrap items-center justify-center gap-2 w-full mt-2">
                              {(Array.isArray(value) ? value : String(value).split(/[,;]/)).map((item: string, i: number) => {
                                const trimmed = item.trim();
                                if (!trimmed) return null;
                                return (
                                  <span key={i} 
                                    className={cn("text-[11px] font-bold px-4 py-2 rounded-2xl shadow-sm transition-colors border",
                                      !(data.custom_fields as any)?.cor_info_fundo && "bg-white dark:bg-white/10 border-slate-100 dark:border-white/20 text-slate-800 dark:text-slate-100 hover:border-emerald-500/50"
                                    )}
                                    style={(data.custom_fields as any)?.cor_info_fundo ? {
                                      backgroundColor: 'rgba(255,255,255,0.1)',
                                      borderColor: (data.custom_fields as any).cor_info_fundo + '80',
                                      color: (data.custom_fields as any)?.cor_info_texto || (data.custom_fields as any)?.cor_texto || '#1e293b'
                                    } : undefined}
                                  >
                                    {trimmed}
                                  </span>
                                );
                              })}
                           </div>
                        </>
                      ) : (
                        <>
                           <div className="p-3 rounded-full bg-slate-50 dark:bg-white/5 mb-1 transition-transform group-hover:rotate-12">
                             <Icon className="w-5 h-5 opacity-60" style={{ color: themeColor }} />
                           </div>
                           <div className="flex flex-col gap-1 w-full">
                              <span 
                                className="text-[9px] font-black uppercase tracking-widest opacity-40 text-slate-500 dark:text-slate-400"
                                style={(data.custom_fields as any)?.cor_info_texto ? { color: (data.custom_fields as any).cor_info_texto } : (data.custom_fields as any)?.cor_texto ? { color: (data.custom_fields as any).cor_texto } : undefined}
                              >{displayLabel}</span>
                              <span 
                                className="text-sm font-black text-slate-900 dark:text-white leading-none tracking-tight break-words"
                                style={(data.custom_fields as any)?.cor_info_texto ? { color: (data.custom_fields as any).cor_info_texto } : (data.custom_fields as any)?.cor_texto ? { color: (data.custom_fields as any).cor_texto } : undefined}
                              >
                                {value}
                              </span>
                           </div>
                        </>
                      )}
                   </motion.div>
                );
             })}
          </div>
       </div>
    );
  };

  const renderPixArea = () => {
    const pixKey = (data.custom_fields as any)?.chave_pix;
    const pixType = (data.custom_fields as any)?.tipo_chave_pix;
    if (!pixKey || !pixType) return null;
    
    // We reuse the dark mode logic
    const isDark = isBarbearia || isTech || isAdvogado || isDriver || isMusico || isEsteticaAutomotiva || (data.background_video_url);

    return (
      <div className="w-full space-y-4 mb-10 px-1">
        <div className="flex items-center gap-3 mb-2">
          <span className={cn("text-[10px] font-black uppercase tracking-[0.2em]", isDark ? "text-teal-400/80" : "text-teal-600/80")}>Chave PIX</span>
          <div className={cn("h-[1px] flex-1", isDark ? "bg-teal-500/20" : "bg-teal-500/20")} />
        </div>
        <Button
          variant="outline"
          onClick={() => {
            navigator.clipboard.writeText(pixKey);
            toast.success('Chave PIX copiada!');
          }}
          className={cn(
            "w-full h-14 rounded-2xl border flex items-center justify-between gap-3 px-4 shadow-sm group",
            isDark 
              ? "bg-teal-950/40 backdrop-blur-md border-teal-500/30 text-teal-100 hover:bg-teal-900/60" 
              : "bg-teal-50 border-teal-200 hover:border-teal-400 text-teal-900 hover:bg-teal-100"
          )}
        >
           <div className="flex items-center gap-3 w-full overflow-hidden">
             <div className={cn("p-2 rounded-xl group-hover:scale-110 transition-transform", isDark ? "bg-teal-500/20 text-teal-300" : "bg-teal-500/10 text-teal-600")}>
               <Copy className="w-5 h-5" />
             </div>
             <div className="flex flex-col items-start gap-0.5 justify-center overflow-hidden h-full flex-1">
               <span className={cn("text-[9px] font-black uppercase tracking-widest leading-none border-b border-transparent", isDark ? "text-teal-300/80" : "text-teal-700/80")}>
                 Copiar Chave ({pixType === 'cpf_cnpj' ? 'CPF/CNPJ' : pixType === 'celular' ? 'Celular' : pixType === 'email' ? 'E-mail' : 'Variada'})
               </span>
               <span className="text-sm font-bold font-mono tracking-tight truncate w-full text-left leading-none">
                 {pixKey}
               </span>
             </div>
           </div>
        </Button>
      </div>
    );
  };

  const renderSocialLinks = () => {
    if (validSocialLinks.length === 0) return null;
    const isDark = isBarbearia || isTech || isAdvogado || isDriver || isMusico || isEsteticaAutomotiva || (data.background_video_url);
    
    return (
      <div className="w-full space-y-4 mb-10 px-1 mt-6">
        <div className="flex items-center gap-3 mb-2">
          <span className={cn("text-[10px] font-black uppercase tracking-[0.2em]", isDark ? "text-white/40" : "text-slate-400")}>Redes Sociais</span>
          <div className={cn("h-[1px] flex-1", isDark ? "bg-white/10" : "bg-slate-200 dark:bg-slate-800")} />
        </div>
        <div className="flex flex-wrap justify-center gap-3">
          {validSocialLinks.map((social, i) => {
            const Icon = social.icon;
            return (
              <motion.a
                key={i}
                whileHover={{ scale: 1.1, y: -2 }}
                whileTap={{ scale: 0.95 }}
                href={social.url}
                target="_blank"
                rel="noopener noreferrer"
                title={social.label}
                className={cn(
                  "w-12 h-12 rounded-full flex items-center justify-center transition-all shadow-md",
                  isDark 
                    ? "bg-white/10 backdrop-blur-xl border border-white/20 text-white hover:bg-white/20" 
                    : "bg-white border border-slate-200/50 hover:border-primary/30 text-slate-800 hover:shadow-lg"
                )}
              >
                <Icon className="w-5 h-5" />
              </motion.a>
            );
          })}
        </div>
      </div>
    );
  };

  const renderOriginalCustomPortfolio = () => {
    if (!isPro || customLinks.length === 0) return null;
    const isDark = isBarbearia || isTech || isAdvogado || isDriver || isEsteticaAutomotiva || (data.background_video_url);
    return (
      <div id="custom-links-section" className="w-full space-y-4 mb-10 scroll-mt-24 px-1">
        <div className="flex items-center gap-3 mb-2">
          <span className={cn("text-[10px] font-black uppercase tracking-[0.2em]", isDark ? "text-white/40" : "text-slate-400")}>Links & Portfólio</span>
          <div className={cn("h-[1px] flex-1", isDark ? "bg-white/10" : "bg-slate-200 dark:bg-slate-800")} />
        </div>
        <div className="flex flex-col gap-3 w-full">
          {customLinks.map((link, i) => (
            <motion.a
              key={i}
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.98 }}
              href={link.url.startsWith('http') ? link.url : `https://${link.url}`}
              target="_blank"
              rel="noopener noreferrer"
              className={cn(
                "w-full px-5 py-4 rounded-3xl flex items-center justify-center text-center gap-3 border transition-all text-sm font-bold shadow-md",
                isDark 
                  ? "bg-white/10 backdrop-blur-xl border-white/20 text-white hover:bg-white/20" 
                  : "bg-white border-slate-200/50 hover:border-primary/30 text-slate-800 hover:shadow-lg"
              )}
            >
              <div className="w-full flex items-center justify-center relative">
                <span className="truncate px-2">{link.title}</span>
                <ChevronRight className="w-3.5 h-3.5 absolute right-0 opacity-20" />
              </div>
            </motion.a>
          ))}
        </div>
      </div>
    );
  };

  const renderVisualPortfolio = () => {
    const portfolioImages = (data.custom_fields as any)?.portfolio_images;
    const portfolioVideo = (data.custom_fields as any)?.portfolio_video_url;

    if (!portfolioImages && !portfolioVideo) return null;

    const images = Array.isArray(portfolioImages) 
      ? portfolioImages 
      : (typeof portfolioImages === 'string' ? portfolioImages.split(/[,;]/).map(s => s.trim()).filter(Boolean) : []);

    const isDark = isBarbearia || isTech || isAdvogado || isDriver || isEsteticaAutomotiva || (data.background_video_url);

    return (
      <div className="w-full space-y-4 mb-10 px-1">
        <div className="flex items-center gap-3 mb-2">
          <span className={cn("text-[10px] font-black uppercase tracking-[0.2em]", isDark ? "text-white/40" : "text-slate-400")}>Portfólio / Vitrine</span>
          <div className={cn("h-[1px] flex-1", isDark ? "bg-white/10" : "bg-slate-200 dark:bg-slate-800")} />
        </div>

        {/* Video Portfolio */}
        {portfolioVideo && (
          <div className="w-full rounded-3xl overflow-hidden aspect-video bg-black/20 border border-white/10 shadow-xl relative group">
            <video 
              src={portfolioVideo} 
              controls 
              className="w-full h-full object-cover"
              poster={images[0]}
            />
          </div>
        )}

        {/* Image Carousel (Scrollable) */}
        {images.length > 0 && (
          <AutoCarousel images={images} />
        )}
      </div>
    );
  };

  const renderCustomPortfolio = () => {
    return (
      <div className="px-5 pb-8">
        {renderSocialLinks()}
        {renderPixArea()}
        {renderVisualPortfolio()}
        {renderOriginalCustomPortfolio()}
      </div>
    );
  };

  return (
    <TooltipProvider>
      <motion.div 
        initial={isPro ? { opacity: 0, y: 30, scale: 0.95 } : { opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ 
          duration: isPro ? 0.8 : 0.4, 
          ease: isPro ? [0.16, 1, 0.3, 1] : "easeOut" 
        }}
        className={cn("w-full max-w-[380px] mx-auto group/card", isDownloadMode && "m-0")}
        style={{ fontFamily: isPro ? data.font_family : 'inherit' }}
      >
        {/* Font Loader for Pro - Sanitizado para evitar XSS */}
        {isPro && data.font_family && (
          <style dangerouslySetInnerHTML={{ __html: `
            @import url('https://fonts.googleapis.com/css2?family=${data.font_family.replace(/[^a-zA-Z0-9 ]/g, '').replace(/ /g, '+')}:wght@400;700;900&display=swap');
          `}} />
        )}

        <div 
          id="digital-card-content"
          className={cn(
            "relative overflow-hidden rounded-[2.5rem] transition-all duration-500 flex flex-col min-h-[600px]",
            ((isPro || isMusico || data.profession === 'area_lazer') && data.background_video_url) ? "dark bg-slate-950" : "",
            isPro 
              ? "border-2 border-primary/20 shadow-[0_40px_100px_-20px_hsl(var(--primary)/0.3)] shadow-[inset_0_0_60px_hsl(var(--primary)/0.1)]" 
              : "border border-slate-200 dark:border-slate-800 shadow-sm bg-white dark:bg-slate-950"
          )}
          style={{ 
            '--primary': isPro ? hexToHsl(data.theme_color || '#3b82f6') : undefined,
            ...((isPro || data.profession === 'esteticista' || data.profession === 'artesao' || data.profession === 'streetup') && (data.custom_fields as any)?.cor_fundo ? { backgroundColor: (data.custom_fields as any).cor_fundo } : {})
          } as React.CSSProperties}
        >
          <div 
            className="absolute inset-0 z-0 bg-transparent"
          >
               <div 
                 className={cn(
                    "w-full h-full transition-colors duration-500 relative overflow-hidden",
                    (data.background_video_url) ? "hidden" : "",
                    ((data.custom_fields as any)?.cor_fundo) ? "bg-transparent" :
                     isPro ? (
                       isBarbearia ? "bg-[#0f0f0f]" : 
                       isEsteticaAutomotiva ? "bg-[#050505]" : 
                       isBeauty ? "bg-[#fdf2f8]" : 
                       isHealth ? "bg-[#f0fdf4]" : 
                       isSales ? "bg-[#f5f3ff]" : 
                       isFood ? "bg-[#fef2f2]" : 
                       isService ? "bg-[#fff7ed]" : 
                        isStandardized ? "bg-white dark:bg-slate-950" : 
                        isTech ? "bg-[#020617]" :
                        isRealEstate ? "bg-[#f8fafc]" :
                        isDriver ? "bg-[#111111]" :
                        isPetshop ? "bg-[#fffaf5]" :
                        isVeterinario ? "bg-[#ecfdf5]" :
                        isArtesao ? "bg-[#fffbeb]" :
                        "konnexy-digital-field"
                     ) : "bg-white dark:bg-slate-950"
                   )}
                >
                  {isBarbearia && !cf.cor_fundo ? (
                    <>
                      {/* Premium Wood/Leather Texture Simulation */}
                      <div className="absolute inset-0 opacity-20" style={{
                        backgroundImage: `radial-gradient(circle at 2px 2px, #d4af37 1px, transparent 0)`,
                        backgroundSize: '32px 32px'
                      }} />
                      <div className="absolute inset-0 bg-gradient-to-br from-[#1a1a1a] via-[#0a0a0a] to-[#000000]" />
                      <div className="absolute inset-0 opacity-30 shadow-[inset_0_0_100px_rgba(0,0,0,0.8)]" />
                      {/* Barber Pole Stripes (Animated) */}
                      <div className="absolute -left-20 top-0 bottom-0 w-40 opacity-5 pointer-events-none rotate-12 bg-gradient-to-r from-red-600 via-white to-blue-600 bg-[length:100%_40px] animate-[slide-down_5s_linear_infinite]" />
                    </>
                  ) : isEsteticaAutomotiva && !cf.cor_fundo ? (
                    <>
                      <div className="absolute inset-0 bg-gradient-to-br from-[#121212] via-[#050505] to-[#000000]" />
                      <div className="absolute inset-0 opacity-[0.03]" style={{
                        backgroundImage: `linear-gradient(45deg, #444 25%, transparent 25%, transparent 75%, #444 75%, #444), linear-gradient(45deg, #444 25%, transparent 25%, transparent 75%, #444 75%, #444)`,
                        backgroundSize: '16px 16px',
                        backgroundPosition: '0 0, 8px 8px'
                      }} />
                    </>
                  ) : isBeauty && !cf.cor_fundo ? (
                    <>
                       <div className="absolute inset-0 bg-gradient-to-br from-[#FEF9F9] via-[#FBFAF9] to-[#FDF2F8] dark:from-[#1a1012] dark:to-[#0a0506]" />
                       <div className="absolute inset-0 opacity-10" style={{
                         backgroundImage: `radial-gradient(circle at 10px 10px, #f472b6 0.2px, transparent 0)`,
                         backgroundSize: '30px 30px'
                       }} />
                       {/* Silk/Glossy Effect */}
                       <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-transparent rotate-45 translate-x-1/2" />
                    </>
                  ) : (isHealth || isVeterinario) && !cf.cor_fundo ? (
                    <>
                       <div className="absolute inset-0 bg-gradient-to-br from-[#F0FDF4] via-[#F8FAFC] to-[#DCFCE7] dark:from-[#06100a] dark:to-[#020604]" />
                       <div className="absolute inset-0 opacity-10" style={{
                         backgroundImage: `radial-gradient(circle at 10px 10px, #10b981 0.5px, transparent 0)`,
                         backgroundSize: '24px 24px'
                       }} />
                       <div className="absolute inset-0 bg-gradient-to-t from-emerald-500/10 to-transparent" />
                       <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-400/10 blur-[100px] rounded-full -translate-y-1/2 translate-x-1/2" />
                       <div className="absolute bottom-0 left-0 w-48 h-48 bg-emerald-600/10 blur-[80px] rounded-full translate-y-1/2 -translate-x-1/2" />
                    </>
                  ) : isSales && !cf.cor_fundo ? (
                    <>
                       <div className="absolute inset-0 bg-gradient-to-br from-[#F5F3FF] via-[#F8FAFC] to-[#EDE9FE] dark:from-[#0c0a13] dark:to-[#05040a]" />
                       <div className="absolute inset-0 opacity-[0.03]" style={{
                         backgroundImage: `linear-gradient(45deg, #8b5cf6 25%, transparent 25%, transparent 50%, #8b5cf6 50%, #8b5cf6 75%, transparent 75%, transparent 100%)`,
                         backgroundSize: '40px 40px'
                       }} />
                    </>
                  ) : isFood && !cf.cor_fundo ? (
                    <>
                       <div className="absolute inset-0 bg-gradient-to-br from-[#FEF2F2] via-[#F8FAFC] to-[#FEE2E2] dark:from-[#130a0a] dark:to-[#0a0505]" />
                       <div className="absolute inset-0 opacity-5" style={{
                         backgroundImage: `radial-gradient(circle at 15px 15px, #ef4444 0.5px, transparent 0)`,
                         backgroundSize: '30px 30px'
                       }} />
                    </>
                   ) : isTech && !cf.cor_fundo ? (
                     <>
                        <div className="absolute inset-0 bg-gradient-to-br from-[#020617] via-[#0f172a] to-[#0141ff20]" />
                        <div className="absolute inset-0 opacity-[0.1]" style={{
                          backgroundImage: `linear-gradient(rgba(59, 130, 246, 0.2) 1px, transparent 1px), linear-gradient(90deg, rgba(59, 130, 246, 0.2) 1px, transparent 1px)`,
                          backgroundSize: '30px 30px'
                        }} />
                        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(59, 130, 246, 0.15),transparent_80%)]" />
                        {/* Matrix-like light effect */}
                        <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-blue-500 to-transparent opacity-50 shadow-[0_0_20px_rgba(59, 130, 246, 0.5)]" />
                     </>
                  ) : isRealEstate && !cf.cor_fundo ? (
                    <>
                       <div className="absolute inset-0 bg-gradient-to-br from-[#ffffff] via-[#f8fafc] to-[#f1f5f9]" />
                       <div className="absolute inset-0 opacity-[0.02]" style={{
                         backgroundImage: `linear-gradient(45deg, #0ea5e9 25%, transparent 25%, transparent 50%, #0ea5e9 50%, #0ea5e9 75%, transparent 75%, transparent 100%)`,
                         backgroundSize: '60px 60px'
                       }} />
                    </>
                  ) : isDriver && !cf.cor_fundo ? (
                    <>
                       <div className="absolute inset-0 bg-[#111111]" />
                       <div className="absolute top-0 left-0 right-0 h-1/2 bg-gradient-to-b from-white/5 to-transparent" />
                       <div className="absolute inset-0 opacity-5" style={{
                         backgroundImage: `linear-gradient(0deg, transparent 24%, rgba(255, 255, 255, .05) 25%, rgba(255, 255, 255, .05) 26%, transparent 27%, transparent 74%, rgba(255, 255, 255, .05) 75%, rgba(255, 255, 255, .05) 76%, transparent 77%, transparent), linear-gradient(90deg, transparent 24%, rgba(255, 255, 255, .05) 25%, rgba(255, 255, 255, .05) 26%, transparent 27%, transparent 74%, rgba(255, 255, 255, .05) 75%, rgba(255, 255, 255, .05) 76%, transparent 77%, transparent)`,
                         backgroundSize: '50px 50px'
                       }} />
                    </>
                  ) : isPetshop && !cf.cor_fundo ? (
                    <>
                       <div className="absolute inset-0 bg-gradient-to-br from-[#fff7ed] via-[#fffaf5] to-[#ffedd5]" />
                       <div className="absolute inset-0 opacity-[0.05]" style={{
                         backgroundImage: `radial-gradient(#f97316 1px, transparent 0)`,
                         backgroundSize: '24px 24px'
                       }} />
                    </>
                  ) : isVeterinario && !cf.cor_fundo ? (
                    <>
                       <div className="absolute inset-0 bg-gradient-to-br from-[#ecfdf5] via-[#f0fdf4] to-[#d1fae5]" />
                       <div className="absolute inset-0 opacity-[0.05]" style={{
                         backgroundImage: `radial-gradient(#10b981 1px, transparent 0)`,
                         backgroundSize: '24px 24px'
                       }} />
                    </>
                  ) : isArtesao && !cf.cor_fundo ? (
                    <>
                       <div className="absolute inset-0 bg-gradient-to-br from-[#FFFBEB] via-[#FEF3C7] to-[#FDE68A] dark:from-[#130d05] dark:to-[#0a0702]" />
                       <div className="absolute inset-0 opacity-10" style={{
                         backgroundImage: `
                           linear-gradient(45deg, #d97706 1px, transparent 1px),
                           linear-gradient(-45deg, #d97706 1px, transparent 1px)
                         `,
                         backgroundSize: '40px 40px'
                       }} />
                       <div className="absolute inset-0 bg-gradient-to-b from-transparent via-amber-500/[0.03] to-amber-700/[0.05]" />
                       <div className="absolute -top-24 -left-24 w-64 h-64 bg-amber-500/10 blur-[100px] rounded-full" />
                    </>
                  ) : isStandardized && !cf.cor_fundo ? null : isService && !cf.cor_fundo ? (
                     <>
                        <div className="absolute inset-0 bg-gradient-to-br from-[#FFF7ED] via-[#F8FAFC] to-[#FFEDD5] dark:from-[#130d0a] dark:to-[#0a0705]" />
                        <div className="absolute inset-0 opacity-[0.04]" style={{
                          backgroundImage: `linear-gradient(0deg, #f59e0b 1px, transparent 1px), linear-gradient(90deg, #f59e0b 1px, transparent 1px)`,
                          backgroundSize: '25px 25px'
                        }} />
                     </>
                   ) : isAdvogado && !cf.cor_fundo ? (
                     <>
                        <div className="absolute inset-0 bg-gradient-to-br from-[#0f172a] via-[#1e293b] to-[#0f172a]" />
                        <div className="absolute inset-0 opacity-[0.03]" style={{
                          backgroundImage: `linear-gradient(0deg, #fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)`,
                          backgroundSize: '40px 40px'
                        }} />
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent" />
                     </>
                   ) : !cf.cor_fundo ? (
                     <DigitalField accentColor={frameConfig?.accent || '#EADBB9'} active={isPro} />
                   ) : null}
                  {!isPro && (
                    <div className="absolute inset-0 bg-slate-50 dark:bg-slate-900/50" />
                  )}
               </div>

               {data.background_video_url && (isPro || isMusico || data.profession === 'area_lazer') && (
                <div className="absolute inset-0 overflow-hidden pointer-events-none transition-all z-0 flex flex-col items-center justify-start">
                  {/* Background Image/Video (Cover, Top Aligned) */}
                  <div className="absolute inset-0 w-full h-full z-0">
                    {data.background_video_url.match(/\.(mp4|webm|ogg|mov)$/i) ? (
                      <video 
                        src={data.background_video_url}
                        autoPlay 
                        muted 
                        loop 
                        playsInline 
                        className="absolute inset-0 w-full h-full object-cover"
                        style={{ objectPosition: 'center 20%' }}
                      />
                    ) : (
                      <div 
                        className="absolute inset-0 w-full h-full" 
                        style={{ 
                          backgroundImage: `url('${data.background_video_url}')`, 
                          backgroundSize: 'cover', 
                          backgroundPosition: 'center 20%' 
                        }} 
                      />
                    )}
                  </div>

                  {/* Premium Dark Overlay */}
                  <div 
                    className="absolute inset-0 z-10"
                    style={{
                      background: 'linear-gradient(to bottom, rgba(11,26,43,0.5), rgba(11,26,43,0.95))'
                    }}
                  />
                  {!isMusico && !((isPro || data.profession === 'esteticista' || data.profession === 'artesao' || data.profession === 'streetup') && (data.custom_fields as any)?.cor_fundo) && (
                    <div className="absolute inset-0 bg-gradient-to-b from-slate-950/20 via-slate-950/60 to-slate-950" />
                  )}
                </div>
              )}
          </div>
        {data.profession === 'chef_eventos' ? (
          <div className="relative flex flex-col w-full min-h-[600px] z-10 overflow-y-auto scroll-hide">
            <ChefEventosLayout data={data as Profile} isPro={isPro} />
            {renderCustomPortfolio()}
          </div>
        ) : data.profession === 'montador_moveis' ? (
          <div className="relative flex flex-col w-full min-h-[600px] z-10 overflow-y-auto scroll-hide">
            <MontadorMoveisLayout data={data as Profile} isPro={isPro} />
            {renderCustomPortfolio()}
          </div>
        ) : isEsteticaAutomotiva ? (
          <div className="relative flex flex-col w-full min-h-[600px] z-10 overflow-y-auto scroll-hide">
            <AutomotiveDetailingLayout data={data} isPro={isPro} />
            {renderCustomPortfolio()}
          </div>
        ) : (
          <div className="relative flex flex-col w-full min-h-[600px] z-10 overflow-y-auto scroll-hide">
            <StandardProfessionalLayout 
              data={data as Profile} 
              isPro={isPro} 
              config={getGlobalConfig(data.profession)}
              profession={data.profession || 'default'}
            />
            {renderCustomPortfolio()}
          </div>
        )}
      </div>

      {/* Pro Upsell */}
      {!isPro && showBranding && (
        <div className="mt-4 px-4 py-3 rounded-[1.5rem] bg-slate-900 border border-primary/20 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-2xl">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-primary/10 flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-primary" />
            </div>
            <span className="text-[10px] font-black uppercase tracking-widest text-slate-300">Upgrade para design premium</span>
          </div>
          <Button variant="hero" size="sm" className="h-8 px-4 text-[10px] font-black rounded-xl bg-primary text-white" asChild>
            <a href="/pricing">Ver Pro</a>
          </Button>
        </div>
      )}
    </motion.div>
  </TooltipProvider>
);
}

