"use client";

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
  Truck,
  HardHat,
  HeartPulse,
  Check,
  Calendar,
  Monitor
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
import { getProfessionConfig as getGlobalConfig } from '@/config/professions';

interface CardPreviewProps {
  data: Partial<Profile>;
  showBranding?: boolean;
  suppressTracking?: boolean;
  isDownloadMode?: boolean;
  forceProPreview?: boolean; // Novo: força a exibição de recursos PRO no editor
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
  const isBeauty = ['beauty', 'manicure', 'cabeleireiro', 'esteticista'].includes(data.profession as string) || data.category === 'beauty';
  const isHealth = ['health', 'personal_trainer', 'psicologo'].includes(data.profession as string) || data.category === 'health';
  const isSales = data.profession === 'sales' || data.category === 'sales';
  const isFood = ['food', 'quentinhas'].includes(data.profession as string) || data.category === 'food';
  const isService = data.profession === 'service' || data.category === 'service';
  const isModernService = [
    'pedreiro', 'mecanico', 'eletricista', 'encanador', 'diarista', 
    'frete', 'ar_condicionado', 'montador_moveis', 'gesseiro', 
    'vidraceiro', 'pintor', 'serralheiro', 'marceneiro', 
    'assistencia_celular'
  ].includes(data.profession as string);
  const isAdvogado = data.profession === 'advogado' || data.category === 'advogado';
  const isTech = ['tech', 'tecnico_informatica', 'designer', 'fotografo'].includes(data.profession as string) || data.category === 'tech';
  const isRealEstate = data.profession === 'real_estate' || data.category === 'real_estate';
  const isDriver = data.profession === 'driver' || data.category === 'driver';
  const isPetshop = data.profession === 'petshop' || data.category === 'petshop';
  
  const isStandardized = isModernService || ['quentinhas', 'assistencia_celular'].some(p => data.profession === p);

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
  
  const whatsappLink = cleanWhatsapp
    ? `https://wa.me/${formattedWhatsapp}?text=${encodeURIComponent(
        isBarbearia ? "Olá! Gostaria de agendar um corte 💈" : 
        data.profession === 'psicologo' ? "Olá! Gostaria de agendar uma consulta psicológica 🛋️" :
        data.profession === 'personal_trainer' ? "Olá! Gostaria de informações sobre consultoria/aulas 💪" :
        data.profession === 'esteticista' ? "Olá! Gostaria de marcar uma avaliação estética 💆‍♀️" :
        data.profession === 'fotografo' ? "Olá! Gostaria de um orçamento para fotos 📸" :
        isHealth ? "Olá! Gostaria de agendar um atendimento 🩺" :
        isAdvogado ? "Olá! Gostaria de agendar uma consulta jurídica ⚖️" :
        `Olá! Vi seu perfil na Konnexy e gostaria de ${isPro ? 'solicitar um orçamento' : 'conversar'} sobre seus serviços.`
      )}`
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

    return { name: nome, price: preco, description: descricao, icon: (s as any).icon || 'Sparkles', whatsappUrl };
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
    const hasVideo = !!data.background_video_url && isPro;
    
    // BARBEARIA - PREMIUM THEME
    if (isBarbearia) {
      return "bg-[#0a0a0a] text-white border-yellow-700/30 shadow-[inset_0_0_150px_rgba(212,175,55,0.05),0_50px_100px_-20px_rgba(0,0,0,0.5)]";
    }

    if (isAdvogado) {
      return "bg-[#0f172a] text-white border-slate-700/50 shadow-[inset_0_0_100px_rgba(30,41,59,0.5)]";
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
    
    if (!isPro) return "bg-white dark:bg-slate-950";
    
    switch (data.theme_style) {
      case 'oled': 
        return "bg-black text-white border-white/10 shadow-[inset_0_0_120px_rgba(59,130,246,0.15)]";
      case 'glass': 
        return "bg-white/10 backdrop-blur-3xl border-white/20 shadow-[inset_0_0_40px_rgba(255,255,255,0.1)]";
      case 'minimalist': 
        return "bg-white text-slate-900 border-slate-100 shadow-none";
      default: 
        if (hasVideo) return "bg-black/20 backdrop-blur-2xl text-white border-white/10";
        // OFFICIAL KONNEXY DIGITAL FIELD STYLE
        return "konnexy-digital-field text-white border-white/10 shadow-[inset_0_0_60px_rgba(59,130,246,0.1)]";
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
  const premiumGradient = frameConfig?.gradient || (isPro ? `linear-gradient(135deg, ${data.theme_color || '#3b82f6'} 0%, #8b5cf6 100%)` : undefined);

  const getFieldIcon = (fieldName: string) => {
    const name = fieldName.toLowerCase();
    if (name.includes('atende_domicilio') || name.includes('residencial') || name.includes('home')) return Home;
    if (name.includes('agendamento') || name.includes('horario') || name.includes('schedule')) return Calendar;
    if (name.includes('oab') || name.includes('creci') || name.includes('nr10') || name.includes('registro')) return ShieldCheck;
    if (name.includes('delivery') || name.includes('entreg') || name.includes('frete') || name.includes('veiculo') || name.includes('truck')) return Truck;
    if (name.includes('online') || name.includes('remoto') || name.includes('digital') || name.includes('zoom')) return Monitor;
    if (name.includes('experiencia') || name.includes('anos')) return History;
    if (name.includes('socorro') || name.includes('emergencia') || name.includes('urgencia')) return Zap;
    if (name.includes('clinico') || name.includes('saude') || name.includes('medico') || name.includes('vital')) return HeartPulse;
    if (name.includes('celular') || name.includes('mobile') || name.includes('phone')) return Smartphone;
    if (['reforma', 'ferramentas', 'obra', 'construction', 'hard_hat'].some(k => name.includes(k))) return HardHat;
    if (name.includes('banho') || name.includes('tosa') || name.includes('grooming') || name.includes('animal') || name.includes('pet')) return PawPrint;
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
       <div className="w-full mb-8 px-1">
          <div className="flex items-center gap-3 mb-6">
             <div className="h-px flex-1 bg-current opacity-10" />
             <span className="text-[9px] font-black uppercase tracking-[0.3em] opacity-30">Destaques Profissionais</span>
             <div className="h-px flex-1 bg-current opacity-10" />
          </div>
          <div className="grid grid-cols-2 gap-3">
             {fields.map((field) => {
                const value = (data.custom_fields as any)?.[field.name];
                const Icon = getFieldIcon(field.name);
                return (
                   <div key={field.name} className="p-4 rounded-2xl bg-white dark:bg-white/5 border border-current/10 flex flex-col items-center text-center gap-2 group hover:bg-current/10 transition-all hover:scale-[1.02] active:scale-95 shadow-sm">
                      {field.type === 'boolean' ? (
                        <>
                           <div className="relative p-3 rounded-xl flex items-center justify-center overflow-hidden mb-1 group-hover:scale-110 transition-transform">
                             <div className="absolute inset-0 opacity-15 transition-opacity group-hover:opacity-25" style={{ backgroundColor: themeColor }} />
                             <Icon className="w-6 h-6 relative z-10" style={{ color: themeColor }} />
                           </div>
                           <span className="text-[10px] font-black uppercase tracking-tight leading-tight text-slate-800 dark:text-white opacity-90 mt-1">{field.label}</span>
                           <Check className="w-3 h-3 opacity-60 mt-1" style={{ color: themeColor }} />
                        </>
                      ) : (
                        <>
                           <Icon className="w-5 h-5 opacity-50 group-hover:scale-110 transition-transform" style={{ color: themeColor }} />
                           <div className="flex flex-col gap-0.5 w-full">
                              <span className="text-[7px] font-black uppercase tracking-widest opacity-60 text-slate-600 dark:text-slate-400">{field.label}</span>
                              <span className="text-[10px] font-black uppercase leading-tight italic tracking-tighter truncate w-full text-slate-900 dark:text-white">
                                {Array.isArray(value) ? value.join(', ') : value}
                              </span>
                           </div>
                        </>
                      )}
                   </div>
                );
             })}
          </div>
       </div>
    );
  };

  const renderCustomPortfolio = () => {
    if (!isPro || customLinks.length === 0) return null;
    const isDark = isBarbearia || isTech || isAdvogado || isDriver || (data.background_video_url);
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
        {/* Font Loader for Pro */}
        {isPro && data.font_family && (
          <style dangerouslySetInnerHTML={{ __html: `
            @import url('https://fonts.googleapis.com/css2?family=${data.font_family.replace(/ /g, '+')}:wght@400;700;900&display=swap');
          `}} />
        )}

        <div 
          id="digital-card-content"
          className={cn(
            "relative overflow-hidden rounded-[2.5rem] transition-all duration-500 flex flex-col min-h-[600px]",
            (isPro && data.background_video_url) ? "dark bg-slate-950" : "",
            isPro 
              ? "border-2 border-primary/20 shadow-[0_40px_100px_-20px_hsl(var(--primary)/0.3)] shadow-[inset_0_0_60px_hsl(var(--primary)/0.1)]" 
              : "border border-slate-200 dark:border-slate-800 shadow-sm bg-white dark:bg-slate-950"
          )}
          style={{ 
            '--primary': isPro ? hexToHsl(data.theme_color || '#3b82f6') : undefined,
          } as React.CSSProperties}
        >
          <div 
            className="absolute inset-0 z-0 bg-transparent"
          >
               <div 
                 className={cn(
                    "w-full h-full transition-colors duration-500 relative overflow-hidden",
                    (isPro && data.background_video_url) ? "hidden" : "",
                     isPro ? (
                       isBarbearia ? "bg-[#0f0f0f]" : 
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
                       isAdvogado ? "bg-[#0f172a]" :
                       "konnexy-digital-field"
                     ) : "bg-white dark:bg-slate-950"
                   )}
                >
                  {isBarbearia ? (
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
                  ) : isBeauty ? (
                    <>
                       <div className="absolute inset-0 bg-gradient-to-br from-[#FEF9F9] via-[#FBFAF9] to-[#FDF2F8] dark:from-[#1a1012] dark:to-[#0a0506]" />
                       <div className="absolute inset-0 opacity-10" style={{
                         backgroundImage: `radial-gradient(circle at 10px 10px, #f472b6 0.2px, transparent 0)`,
                         backgroundSize: '30px 30px'
                       }} />
                       {/* Silk/Glossy Effect */}
                       <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-transparent rotate-45 translate-x-1/2" />
                    </>
                  ) : isHealth ? (
                    <>
                       <div className="absolute inset-0 bg-gradient-to-br from-[#F0FDF4] via-[#F8FAFC] to-[#DCFCE7] dark:from-[#06100a] dark:to-[#020604]" />
                       <div className="absolute inset-0 opacity-5" style={{
                         backgroundImage: `radial-gradient(circle at 10px 10px, #10b981 0.5px, transparent 0)`,
                         backgroundSize: '20px 20px'
                       }} />
                       <div className="absolute inset-0 bg-gradient-to-t from-emerald-500/5 to-transparent" />
                    </>
                  ) : isSales ? (
                    <>
                       <div className="absolute inset-0 bg-gradient-to-br from-[#F5F3FF] via-[#F8FAFC] to-[#EDE9FE] dark:from-[#0c0a13] dark:to-[#05040a]" />
                       <div className="absolute inset-0 opacity-[0.03]" style={{
                         backgroundImage: `linear-gradient(45deg, #8b5cf6 25%, transparent 25%, transparent 50%, #8b5cf6 50%, #8b5cf6 75%, transparent 75%, transparent 100%)`,
                         backgroundSize: '40px 40px'
                       }} />
                    </>
                  ) : isFood ? (
                    <>
                       <div className="absolute inset-0 bg-gradient-to-br from-[#FEF2F2] via-[#F8FAFC] to-[#FEE2E2] dark:from-[#130a0a] dark:to-[#0a0505]" />
                       <div className="absolute inset-0 opacity-5" style={{
                         backgroundImage: `radial-gradient(circle at 15px 15px, #ef4444 0.5px, transparent 0)`,
                         backgroundSize: '30px 30px'
                       }} />
                    </>
                   ) : isTech ? (
                     <>
                        <div className="absolute inset-0 bg-gradient-to-br from-[#020617] via-[#0f172a] to-[#0141ff20]" />
                        <div className="absolute inset-0 opacity-[0.1]" style={{
                          backgroundImage: `linear-gradient(rgba(59, 130, 246, 0.2) 1px, transparent 1px), linear-gradient(90deg, rgba(59, 130, 246, 0.2) 1px, transparent 1px)`,
                          backgroundSize: '30px 30px'
                        }} />
                        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(59,130,246,0.15),transparent_80%)]" />
                        {/* Matrix-like light effect */}
                        <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-blue-500 to-transparent opacity-50 shadow-[0_0_20px_rgba(59,130,246,0.5)]" />
                     </>
                  ) : isRealEstate ? (
                    <>
                       <div className="absolute inset-0 bg-gradient-to-br from-[#ffffff] via-[#f8fafc] to-[#f1f5f9]" />
                       <div className="absolute inset-0 opacity-[0.02]" style={{
                         backgroundImage: `linear-gradient(45deg, #0ea5e9 25%, transparent 25%, transparent 50%, #0ea5e9 50%, #0ea5e9 75%, transparent 75%, transparent 100%)`,
                         backgroundSize: '60px 60px'
                       }} />
                    </>
                  ) : isDriver ? (
                    <>
                       <div className="absolute inset-0 bg-[#111111]" />
                       <div className="absolute top-0 left-0 right-0 h-1/2 bg-gradient-to-b from-white/5 to-transparent" />
                       <div className="absolute inset-0 opacity-5" style={{
                         backgroundImage: `linear-gradient(0deg, transparent 24%, rgba(255, 255, 255, .05) 25%, rgba(255, 255, 255, .05) 26%, transparent 27%, transparent 74%, rgba(255, 255, 255, .05) 75%, rgba(255, 255, 255, .05) 76%, transparent 77%, transparent), linear-gradient(90deg, transparent 24%, rgba(255, 255, 255, .05) 25%, rgba(255, 255, 255, .05) 26%, transparent 27%, transparent 74%, rgba(255, 255, 255, .05) 75%, rgba(255, 255, 255, .05) 76%, transparent 77%, transparent)`,
                         backgroundSize: '50px 50px'
                       }} />
                    </>
                  ) : isPetshop ? (
                    <>
                       <div className="absolute inset-0 bg-gradient-to-br from-[#fff7ed] via-[#fffaf5] to-[#ffedd5]" />
                       <div className="absolute inset-0 opacity-[0.05]" style={{
                         backgroundImage: `radial-gradient(#f97316 1px, transparent 0)`,
                         backgroundSize: '24px 24px'
                       }} />
                    </>
                  ) : isStandardized ? null : isService ? (
                     <>
                        <div className="absolute inset-0 bg-gradient-to-br from-[#FFF7ED] via-[#F8FAFC] to-[#FFEDD5] dark:from-[#130d0a] dark:to-[#0a0705]" />
                        <div className="absolute inset-0 opacity-[0.04]" style={{
                          backgroundImage: `linear-gradient(0deg, #f59e0b 1px, transparent 1px), linear-gradient(90deg, #f59e0b 1px, transparent 1px)`,
                          backgroundSize: '25px 25px'
                        }} />
                     </>
                   ) : isAdvogado ? (
                     <>
                        <div className="absolute inset-0 bg-gradient-to-br from-[#0f172a] via-[#1e293b] to-[#0f172a]" />
                        <div className="absolute inset-0 opacity-[0.03]" style={{
                          backgroundImage: `linear-gradient(0deg, #fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)`,
                          backgroundSize: '40px 40px'
                        }} />
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent" />
                     </>
                   ) : (
                     <DigitalField accentColor={frameConfig?.accent || '#00D4FF'} active={isPro} />
                   )}
                  {!isPro && (
                    <div className="absolute inset-0 bg-slate-50 dark:bg-slate-900/50" />
                  )}
               </div>

              {isPro && data.background_video_url && (
               <div className="absolute inset-0 overflow-hidden pointer-events-none transition-all z-0">
                 <div 
                   className="w-full h-[65%] relative"
                   style={{
                     maskImage: 'linear-gradient(to bottom, black 0%, black 50%, transparent 100%)',
                     WebkitMaskImage: 'linear-gradient(to bottom, black 0%, black 50%, transparent 100%)'
                   }}
                 >
                   {data.background_video_url.match(/\.(mp4|webm|ogg|mov)$/i) ? (
                     <video 
                       src={data.background_video_url}
                       autoPlay 
                       muted 
                       loop 
                       playsInline 
                       className="w-full h-full object-cover object-top opacity-50"
                     />
                   ) : (
                     <img 
                       src={data.background_video_url}
                       alt="Background"
                       className="w-full h-full object-cover object-top opacity-50"
                     />
                   )}
                 </div>
                 <div className="absolute inset-0 bg-gradient-to-b from-slate-950/50 via-slate-950/80 to-slate-950" />
               </div>
              )}
          </div>
          {isPro && isStandardized ? (
            <div className="relative flex flex-col w-full min-h-[600px] z-10 overflow-y-auto scroll-hide">
              <StandardProfessionalLayout data={data as Profile} isPro={isPro} />
            </div>
          ) : isBarbearia ? (
            <div className="relative flex flex-col items-center w-full min-h-[600px] z-10 px-6 py-10 overflow-y-auto scroll-hide">
              {/* Header */}
              <div className="flex flex-col items-center mb-8">
                <div className="relative w-40 h-40 rounded-full border-4 border-[#C6A75E] overflow-hidden shadow-[0_0_30px_rgba(198,167,94,0.3)] mb-4">
                  {data.photo_url ? (
                    <Image
                      src={data.photo_url}
                      alt={previewName || 'Barbearia'}
                      fill
                      className="object-cover"
                      style={{ filter: getPhotoFilter() }}
                      priority
                    />
                  ) : (
                    <div className="w-full h-full bg-[#1a1a1a] flex items-center justify-center text-[#C6A75E] text-4xl font-black">
                      <Scissors className="w-12 h-12" />
                    </div>
                  )}
                </div>
                <h1 className="text-3xl font-black text-white tracking-tighter uppercase mb-1 text-center">{previewName}</h1>
                <p className="text-[#C6A75E] font-bold text-sm tracking-widest uppercase italic text-center">{previewTagline}</p>
              </div>

              {/* Main Call to Action */}
              <motion.div 
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
                className="w-full mb-8"
              >
                <Button
                  className="w-full h-20 rounded-xl bg-[#C6A75E] hover:bg-[#b39550] text-black font-black text-xl uppercase tracking-tighter shadow-[0_15px_30px_rgba(198,167,94,0.4)] relative overflow-hidden group/cta flex items-center justify-center gap-3"
                  asChild
                  onClick={() => handleTrackClick('click_whatsapp')}
                >
                  <a href={whatsappLink} target="_blank" rel="noopener noreferrer">
                    <div className="absolute top-0 -inset-full h-full w-1/2 z-5 block transform -skew-x-12 bg-gradient-to-r from-transparent to-white/30 opacity-40 animate-shine" />
                    <MessageCircle className="w-8 h-8 fill-black" />
                    <span>Agendar Corte 💈</span>
                  </a>
                </Button>
              </motion.div>

              {/* Highlights Barbearia */}
              {renderProfessionHighlights('#C6A75E')}

              {/* Secondary Buttons Grid (Max 4) */}
              <div className="grid grid-cols-2 gap-3 w-full mb-10">
                <Button 
                  variant="outline" 
                  className="rounded-lg h-12 bg-white/5 border-white/10 text-white/80 text-[10px] font-black uppercase tracking-widest hover:bg-white/10"
                  onClick={() => document.getElementById('services-table')?.scrollIntoView({ behavior: 'smooth' })}
                >
                  <FileText className="w-4 h-4 mr-2 text-[#C6A75E]" />
                  Serviços
                </Button>

                {data.instagram && (
                  <Button 
                    variant="outline" 
                    className="rounded-lg h-12 bg-white/5 border-white/10 text-white/80 text-[10px] font-black uppercase tracking-widest hover:bg-white/10"
                    asChild
                    onClick={() => handleTrackClick('click_instagram')}
                  >
                    <a href={`https://instagram.com/${data.instagram}`} target="_blank" rel="noopener noreferrer">
                      <Instagram className="w-4 h-4 mr-2 text-[#C6A75E]" />
                      Instagram
                    </a>
                  </Button>
                )}

                {previewAddress && (
                  <Button 
                    variant="outline" 
                    className="rounded-lg h-12 bg-white/5 border-white/10 text-white/80 text-[10px] font-black uppercase tracking-widest hover:bg-white/10"
                    asChild
                    onClick={() => handleTrackClick('click_address')}
                  >
                    <a href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(previewAddress || '')}`} target="_blank" rel="noopener noreferrer">
                      <MapPin className="w-4 h-4 mr-2 text-[#C6A75E]" />
                      Localização
                    </a>
                  </Button>
                )}

                <Button 
                  variant="outline" 
                  className="rounded-lg h-12 bg-white/5 border-white/10 text-white/80 text-[10px] font-black uppercase tracking-widest hover:bg-white/10"
                  onClick={() => document.getElementById('hours-table')?.scrollIntoView({ behavior: 'smooth' })}
                >
                  <Clock className="w-4 h-4 mr-2 text-[#C6A75E]" />
                  Horários
                </Button>
              </div>

              {/* Services Section - Table Layout */}
              <div id="services-table" className="w-full mb-10">
                <div className="flex items-center gap-3 mb-6">
                  <div className="h-[1px] flex-1 bg-white/10" />
                  <span className="text-[#C6A75E] text-[10px] font-black uppercase tracking-[0.3em]">Tabela de Serviços</span>
                  <div className="h-[1px] flex-1 bg-white/10" />
                </div>
                
                <div className="space-y-[1px] bg-white/5 rounded-xl border border-white/10 overflow-hidden shadow-2xl">
                  <div className="grid grid-cols-[1fr_auto] p-4 bg-white/5 text-[#C6A75E] text-[10px] font-black uppercase tracking-widest">
                    <span>Serviço</span>
                    <span>Preço</span>
                  </div>
                  {activeServicesArr.length > 0 ? activeServicesArr.map((service, i) => (
                    <div key={i} className="grid grid-cols-[1fr_auto] items-center p-4 bg-transparent border-t border-white/5 text-white/90 text-sm font-bold group hover:bg-white/5 transition-colors">
                      <div className="flex flex-col gap-1">
                        <span className="flex items-center gap-2">
                          <div className="w-1.5 h-1.5 rounded-full bg-[#C6A75E]/30 group-hover:bg-[#C6A75E] transition-colors" />
                          {service.name}
                        </span>
                        {service.description && (
                          <p className="text-[10px] text-white/40 font-medium pl-3.5 leading-tight italic">
                            {service.description}
                          </p>
                        )}
                      </div>
                      <span className="text-[#C6A75E] font-black">
                        {service.price || '—'}
                      </span>
                    </div>
                  )) : (
                    <p className="p-8 text-center text-white/20 text-xs italic uppercase tracking-widest">Configure seus serviços no painel</p>
                  )}
                </div>
              </div>

              {/* Business Hours Section */}
              {data.business_hours && Object.values(data.business_hours).some(v => v) && (
                <div id="hours-table" className="w-full mb-10">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="h-[1px] flex-1 bg-white/10" />
                    <span className="text-[#C6A75E] text-[10px] font-black uppercase tracking-[0.3em]">Horário de Atendimento</span>
                    <div className="h-[1px] flex-1 bg-white/10" />
                  </div>
                  
                  <div className="space-y-[1px] bg-white/5 rounded-xl border border-white/10 overflow-hidden shadow-2xl">
                    {['Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado', 'Dom'].map((day) => {
                      const hours = data.business_hours?.[day];
                      if (!hours) return null;
                      return (
                        <div key={day} className="grid grid-cols-[1fr_auto] items-center p-4 bg-transparent border-t border-white/5 text-white/90 text-[11px] font-medium group hover:bg-white/5 transition-colors uppercase tracking-wider">
                          <span className="opacity-60">{day}</span>
                          <span className="text-[#C6A75E] font-black">{hours}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {previewArea && (
                <div className="w-full mb-10 px-4 py-3 rounded-xl bg-[#C6A75E]/5 border border-[#C6A75E]/20 text-center">
                  <span className="text-[8px] font-black uppercase text-[#C6A75E] tracking-widest block mb-1">Área de Atuação</span>
                  <p className="text-xs font-bold text-white italic">{previewArea}</p>
                </div>
              )}

              {/* Footer */}
              <div className="mt-auto w-full text-center space-y-6 pt-10 pb-4">
                {previewAddress && (
                  <p className="text-white/40 text-[10px] font-medium leading-relaxed max-w-[200px] mx-auto uppercase tracking-tighter">
                    {previewAddress}
                  </p>
                )}
                
                <div className="flex flex-col items-center gap-2">
                   <div className="inline-flex flex-col items-center gap-1.5 opacity-30">
                     <span className="text-[8px] uppercase font-black tracking-[0.4em] text-white">Página Profissional por</span>
                     <span className="text-xs font-black tracking-tighter text-white">KONNEXY™</span>
                   </div>
                </div>

                {/* QR Signature PRO */}
                {isPro && (data.username || data.id) && (
                  <div className="flex flex-col items-center mt-6 mb-2">
                    <AnimatedQR
                      url={`${process.env.NEXT_PUBLIC_APP_URL || 'https://konnexy.com.br'}/u/${data.username || data.id}`}
                      photoUrl={data.photo_url || undefined}
                      accentColor="#C6A75E"
                      size={100}
                      active={isPro}
                    />
                  </div>
                )}
              </div>

              {/* Floating Fixed Button (Subtle) */}
              <motion.a
                href={whatsappLink}
                target="_blank"
                rel="noopener noreferrer"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="fixed bottom-6 right-6 w-14 h-14 bg-[#C6A75E] rounded-full flex items-center justify-center shadow-2xl z-[100] md:hidden"
                onClick={() => handleTrackClick('click_whatsapp')}
              >
                <MessageCircle className="w-7 h-7 fill-black" />
              </motion.a>
            {renderCustomPortfolio()}
            </div>
          ) : isBeauty ? (
            <div className="relative flex flex-col items-center w-full min-h-[600px] z-10 px-6 py-10 overflow-y-auto scroll-hide">
              {/* Header Beleza */}
              <div className="flex flex-col items-center mb-8">
                <div className="relative w-40 h-40 rounded-full border-4 border-[#F472B6] overflow-hidden shadow-[0_0_30px_rgba(244,114,182,0.3)] mb-4 bg-white/50 backdrop-blur-md">
                  {data.photo_url ? (
                    <Image
                      src={data.photo_url}
                      alt={previewName || 'Profile'}
                      fill
                      className="object-cover"
                      style={{ filter: getPhotoFilter() }}
                      unoptimized
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-pink-50 dark:bg-pink-900/10">
                      {data.profession === 'cabeleireiro' ? <Scissors className="w-12 h-12 text-[#F472B6]/40" /> : 
                       <Sparkles className="w-12 h-12 text-[#F472B6]/40" />}
                    </div>
                  )}
                </div>
                <h1 className="text-3xl font-serif text-[#1e1e1e] dark:text-white text-center leading-tight">
                  {previewName}
                </h1>
                <p className="text-xs font-medium uppercase tracking-[0.2em] text-[#DB2777] dark:text-[#F472B6] mt-2 italic">
                  {previewTagline}
                </p>
                {data.city && (
                  <div className="flex items-center gap-1.5 mt-3 opacity-60">
                    <MapPin className="w-3 h-3 text-[#DB2777]" />
                    <span className="text-[10px] font-bold uppercase tracking-widest text-[#1e1e1e] dark:text-white">{data.city}</span>
                  </div>
                )}
              </div>

              {/* Botão de Agendamento */}
              <Button 
                asChild 
                className="w-full h-14 rounded-full bg-[#DB2777] hover:bg-[#BE185D] text-white font-bold text-sm shadow-[0_10px_25px_-5px_rgba(219,39,119,0.4)] mb-10 transition-all hover:scale-[1.02] border-none"
              >
                <a 
                  href={whatsappLink} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  onClick={() => handleTrackClick('click_whatsapp')}
                >
                  {data.cta_text || 'Agendar Horário ✨'}
                </a>
              </Button>

              {/* Redes Sociais */}
              <div className="flex justify-center gap-4 mb-10 w-full">
                {validSocialLinks.map((social, i) => {
                  const Icon = social.icon;
                  return (
                    <motion.a
                      key={social.id}
                      href={social.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      whileHover={{ scale: 1.1, y: -2 }}
                      className="w-12 h-12 rounded-full bg-white dark:bg-white/5 border border-[#F472B6]/20 flex items-center justify-center text-[#DB2777] dark:text-[#F472B6] shadow-sm backdrop-blur-md"
                      onClick={() => handleTrackClick(social.trackType as any)}
                    >
                      <Icon className="w-5 h-5" />
                    </motion.a>
                  );
                })}
              </div>

              {/* Serviços Beleza */}
              <div className="w-full mb-10">
                <div className="flex items-center gap-3 mb-6">
                  <div className="h-[0.5px] flex-1 bg-[#F472B6]/30" />
                  <span className="text-[#DB2777] dark:text-[#F472B6] text-[9px] font-black uppercase tracking-[0.4em]">Experiências & Rituais</span>
                  <div className="h-[0.5px] flex-1 bg-[#F472B6]/30" />
                </div>
                
                <div className="space-y-3">
                  {activeServicesArr.length > 0 ? activeServicesArr.map((service, i) => (
                    <motion.a 
                      key={i} 
                      href={service.whatsappUrl || whatsappLink} target="_blank" rel="noopener noreferrer"
                      initial={{ opacity: 0, y: 10 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      className="flex justify-between items-center p-5 rounded-[1.5rem] bg-white/60 dark:bg-white/5 border border-[#F472B6]/10 backdrop-blur-md group hover:border-[#DB2777] hover:shadow-md transition-all cursor-pointer"
                    >
                      <div className="flex flex-col gap-0.5">
                        <span className="text-sm font-bold text-slate-900 dark:text-white/95 group-hover:text-[#DB2777] transition-colors">{service.name}</span>
                        {service.description && (
                          <p className="text-[10px] text-slate-500 italic opacity-80 leading-tight pr-4">
                            {service.description}
                          </p>
                        )}
                      </div>
                      <div className="flex flex-col items-end gap-1">
                        <span className="text-sm font-black text-[#DB2777] dark:text-[#F472B6]">
                          {service.price || '—'}
                        </span>
                        <ChevronRight className="w-4 h-4 text-[#DB2777] opacity-20 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                      </div>
                    </motion.a>
                  )) : (
                    <p className="text-center text-xs opacity-20 italic uppercase tracking-[0.2em] py-10">Revele seus serviços aqui</p>
                  )}
                </div>
              </div>

              {/* Especialidade / Anos de Estrada */}
              <div className="grid grid-cols-2 gap-4 w-full mb-10">
                {data.expert_area && (
                  <div className="flex flex-col items-center justify-center p-4 rounded-3xl bg-[#F472B6]/5 border border-[#F472B6]/10 text-center">
                    <Award className="w-5 h-5 text-[#DB2777] mb-2" />
                    <span className="text-[8px] font-black uppercase tracking-widest opacity-40 mb-1">Especialidade</span>
                    <span className="text-[10px] font-bold text-[#DB2777] dark:text-pink-300">{data.expert_area}</span>
                  </div>
                )}
                {data.founded_year && (
                  <div className="flex flex-col items-center justify-center p-4 rounded-3xl bg-[#F472B6]/5 border border-[#F472B6]/10 text-center">
                    <Star className="w-5 h-5 text-[#DB2777] mb-2" />
                    <span className="text-[8px] font-black uppercase tracking-widest opacity-40 mb-1">Fundado em</span>
                    <span className="text-[10px] font-bold text-[#DB2777] dark:text-pink-300">{data.founded_year}</span>
                  </div>
                )}
              </div>

              {/* Highlights Beauty */}
              {renderProfessionHighlights('#db2777')}

              {/* Endereço */}
              {previewAddress && (
                <div className="w-full p-6 rounded-[2rem] bg-white/40 dark:bg-white/5 border border-[#F472B6]/10 mb-10 text-center backdrop-blur-md">
                  <MapPin className="w-5 h-5 text-[#DB2777] mx-auto mb-2 opacity-60" />
                  <p className="text-xs font-medium text-slate-800 dark:text-pink-50/80 leading-relaxed">
                    {previewAddress}
                  </p>
                </div>
              )}
              {/* Atuação e Horários Beleza */}
              <div className="w-full space-y-4 mb-10">
                {previewArea && (
                  <div className="flex flex-col items-center p-4 rounded-[1.5rem] bg-[#F472B6]/5 border border-[#F472B6]/10 text-center">
                    <Globe className="w-4 h-4 text-[#DB2777] mb-2 opacity-60" />
                    <span className="text-[8px] font-black uppercase tracking-widest opacity-40 mb-1">Região de Atendimento</span>
                    <p className="text-[10px] font-bold text-[#DB2777] dark:text-pink-300">{previewArea}</p>
                  </div>
                )}

                {data.business_hours && Object.values(data.business_hours).some(v => v) && (
                  <div className="p-6 rounded-[2rem] bg-white/40 dark:bg-white/5 border border-[#F472B6]/10 backdrop-blur-md">
                    <div className="flex items-center gap-2 mb-4">
                      <Clock className="w-4 h-4 text-[#DB2777] opacity-60" />
                      <span className="text-[9px] font-black uppercase tracking-[0.2em] text-[#DB2777] dark:text-pink-200">Horários de Atendimento</span>
                    </div>
                    <div className="space-y-2">
                       {['Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado', 'Dom'].map((day) => {
                         const hours = data.business_hours?.[day];
                         if (!hours) return null;
                         return (
                           <div key={day} className="flex justify-between text-[10px] font-medium border-b border-[#F472B6]/5 pb-1 last:border-0">
                             <span className="text-slate-400 capitalize">{day}</span>
                             <span className="text-[#DB2777] dark:text-pink-300 font-bold">{hours}</span>
                           </div>
                         );
                       })}
                    </div>
                  </div>
                )}
              </div>
              
              <div className="flex flex-col items-center gap-2 mb-4">
                 <div className="inline-flex flex-col items-center gap-1.5 opacity-20">
                   <span className="text-[8px] uppercase font-black tracking-[0.5em] text-[#DB2777] dark:text-pink-200">Konnexy&trade; Haute Couture</span>
                 </div>
              </div>

              {/* QR Signature PRO */}
              {isPro && (data.username || data.id) && (
                <div className="flex flex-col items-center mb-10">
                  <AnimatedQR
                    url={`${process.env.NEXT_PUBLIC_APP_URL || 'https://konnexy.com.br'}/u/${data.username || data.id}`}
                    photoUrl={data.photo_url || undefined}
                    accentColor="#F472B6"
                    size={100}
                    active={isPro}
                  />
                </div>
              )}
            {renderCustomPortfolio()}
            </div>
            ) : isHealth ? (
              <div className="relative flex flex-col items-center w-full min-h-[600px] z-10 px-6 py-12 overflow-y-auto scroll-hide">
                {/* Header Saúde Premium */}
                <div className="flex flex-col items-center mb-10 w-full">
                  <motion.div 
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="relative w-44 h-44 mb-6"
                  >
                    <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-[#10b981] to-[#6ee7b7] opacity-20 blur-2xl animate-pulse" />
                    <div className="relative w-full h-full rounded-full border-[6px] border-white dark:border-slate-900 shadow-2xl overflow-hidden z-10">
                      {data.photo_url ? (
                        <Image src={data.photo_url} alt={previewName || 'Saúde'} fill className="object-cover" unoptimized />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-emerald-50 dark:bg-emerald-950">
                          {data.profession === 'personal_trainer' ? <Target className="w-16 h-16 text-[#10b981]/40" /> : 
                           data.profession === 'psicologo' ? <HeartPulse className="w-16 h-16 text-[#10b981]/40" /> : 
                           <Stethoscope className="w-16 h-16 text-[#10b981]/40" />}
                        </div>
                      )}
                    </div>
                    <div className="absolute -bottom-2 -right-2 w-12 h-12 rounded-2xl bg-[#10b981] flex items-center justify-center text-white shadow-xl z-20 border-4 border-white dark:border-slate-900">
                      {data.profession === 'personal_trainer' ? <Zap className="w-5 h-5 fill-current" /> : 
                       data.profession === 'psicologo' ? <HeartPulse className="w-5 h-5 fill-current" /> : 
                       <Heart className="w-5 h-5 fill-current" />}
                    </div>
                  </motion.div>
                  
                  <h1 className="text-3xl font-black text-slate-900 dark:text-white text-center tracking-tighter leading-none mb-3">
                    {previewName}
                  </h1>
                  <div className="flex items-center gap-2 bg-emerald-50 dark:bg-emerald-900/20 px-4 py-1.5 rounded-full border border-emerald-100 dark:border-emerald-800/30">
                    <ShieldCheck className="w-3.5 h-3.5 text-[#10b981]" />
                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[#059669]">
                      {previewTagline}
                    </span>
                  </div>
                </div>


                {/* CTA Saúde */}
                <Button 
                  asChild 
                  className="w-full h-14 rounded-2xl bg-[#10b981] hover:bg-[#059669] text-white font-bold text-sm shadow-[0_10px_20px_-5px_rgba(16,185,129,0.3)] mb-8 transition-all hover:scale-[1.02] border-none"
                >
                  <a 
                    href={whatsappLink} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    onClick={() => handleTrackClick('click_whatsapp')}
                  >
                    {data.cta_text || 'Agendar Consulta 🩺'}
                  </a>
                </Button>

                {/* Highlights Health */}
                {renderProfessionHighlights('#10b981')}

                {/* Serviços Saúde */}
                <div className="w-full mb-8">
                  <p className="text-[9px] font-black uppercase tracking-widest text-slate-400 mb-4 text-center">Procedimentos & Consultas</p>
                  <div className="space-y-2">
                    {activeServicesArr.length > 0 ? activeServicesArr.map((service, i) => (
                      <a key={i} href={service.whatsappUrl || whatsappLink} target="_blank" rel="noopener noreferrer" className="flex justify-between items-center p-4 rounded-3xl bg-white/80 dark:bg-emerald-950/20 border border-emerald-100 dark:border-emerald-900/30 group hover:border-emerald-500 transition-all cursor-pointer">
                        <div className="flex flex-col flex-1">
                          <span className="text-sm font-bold text-slate-700 dark:text-emerald-50 leading-tight group-hover:text-emerald-600 transition-colors">{service.name}</span>
                          {service.description && <span className="text-[10px] text-slate-400 leading-tight mt-1 opacity-70">{service.description}</span>}
                        </div>
                        {service.price && <span className="text-sm font-black text-[#10b981] ml-4 bg-[#10b981]/10 px-3 py-1 rounded-xl shrink-0 group-hover:bg-[#10b981] group-hover:text-white transition-colors">{service.price}</span>}
                      </a>
                    )) : (
                      <p className="text-center text-xs opacity-20 italic py-6">Adicione seus serviços médicos</p>
                    )}
                  </div>
                </div>

                  {/* Localização e Horários Saúde Premium */}
                  <div className="w-full space-y-4 mb-10">
                    <div className="bg-emerald-50/30 dark:bg-emerald-950/20 p-6 rounded-[2.5rem] border border-emerald-100/50 dark:border-emerald-800/30 relative overflow-hidden">
                      <div className="absolute top-0 right-0 p-6 opacity-[0.05] pointer-events-none">
                        <Clock className="w-20 h-20 text-[#10b981]" />
                      </div>
                      
                      <div className="relative z-10 space-y-6">
                        {previewAddress && (
                          <div className="flex items-start gap-4">
                            <div className="w-10 h-10 rounded-2xl bg-white dark:bg-slate-900 flex items-center justify-center shrink-0 shadow-sm">
                              <MapPin className="w-5 h-5 text-[#10b981]" />
                            </div>
                            <div className="flex flex-col">
                              <span className="text-[9px] font-black uppercase text-emerald-600/60 mb-1 tracking-widest">Endereço Clínica</span>
                              <p className="text-xs font-bold text-slate-700 dark:text-emerald-50 leading-relaxed">{previewAddress}</p>
                            </div>
                          </div>
                        )}

                        {data.business_hours && Object.values(data.business_hours).some(v => v) && (
                          <div className="pt-6 border-t border-emerald-100 dark:border-emerald-800/50">
                            <div className="flex items-center gap-3 mb-4">
                              <Clock className="w-4 h-4 text-[#10b981]" />
                              <span className="text-[10px] font-black uppercase text-emerald-700 tracking-[0.2em]">Horários de Atendimento</span>
                            </div>
                            <div className="grid grid-cols-1 gap-2">
                              {['Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado', 'Dom'].map((day) => {
                                const hours = data.business_hours?.[day];
                                if (!hours) return null;
                                return (
                                  <div key={day} className="flex justify-between items-center bg-white/50 dark:bg-black/20 p-3 rounded-xl">
                                    <span className="text-[10px] font-bold text-slate-500 uppercase">{day}</span>
                                    <span className="text-[10px] font-black text-[#059669]">{hours}</span>
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    {previewArea && (
                      <div className="flex items-center gap-4 p-5 rounded-[2.5rem] bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-sm">
                        <div className="w-10 h-10 rounded-full bg-emerald-50 dark:bg-emerald-950 flex items-center justify-center shrink-0">
                          <Globe className="w-5 h-5 text-[#10b981]" />
                        </div>
                        <div className="flex flex-col">
                          <span className="text-[9px] font-black uppercase text-slate-400 mb-0.5 tracking-widest">Área de Atendimento</span>
                          <p className="text-[11px] font-bold text-slate-700 dark:text-emerald-50">{previewArea}</p>
                        </div>
                      </div>
                    )}
                  </div>

                <div className="mt-auto opacity-20 flex flex-col items-center gap-1 mb-6">
                   <span className="text-[7px] uppercase font-black tracking-[0.4em]">Konnexy&trade; Health System</span>
                </div>

                {/* QR Signature PRO */}
                {isPro && (data.username || data.id) && (
                  <div className="flex flex-col items-center mb-10">
                    <AnimatedQR
                      url={`${process.env.NEXT_PUBLIC_APP_URL || 'https://konnexy.com.br'}/u/${data.username || data.id}`}
                      photoUrl={data.photo_url || undefined}
                      accentColor="#10b981"
                      size={100}
                      active={isPro}
                    />
                  </div>
                )}
              {renderCustomPortfolio()}
            </div>
            ) : isSales ? (
              <div className="relative flex flex-col items-center w-full min-h-[600px] z-10 px-6 py-10 overflow-y-auto scroll-hide">
                {/* Header Vendas */}
                <div className="w-full mb-8 flex flex-col items-center">
                  <div className="relative w-full aspect-[16/9] rounded-3xl overflow-hidden shadow-xl mb-6 border-b-4 border-[#8b5cf6]">
                    {data.photo_url ? (
                      <Image
                      src={data.photo_url}
                      alt={previewName || 'Vendas'}
                      fill
                      className="object-cover"
                      style={{ filter: getPhotoFilter() }}
                      unoptimized
                    />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-violet-50 dark:bg-violet-900/10">
                        <ShoppingBag className="w-12 h-12 text-[#8b5cf6]/40" />
                      </div>
                    )}
                    <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/60 to-transparent" />
                    <div className="absolute bottom-4 left-6 right-6">
                      <h1 className="text-xl font-black text-white uppercase italic tracking-tighter">
                        {previewName}
                      </h1>
                    </div>
                  </div>
                  <p className="text-xs font-bold text-[#8b5cf6] dark:text-violet-300 italic">
                    {previewTagline}
                  </p>
                </div>

                {/* CTA Principal Vendas */}
                <Button 
                  asChild 
                  className="w-full h-16 rounded-2xl bg-[#8b5cf6] hover:bg-[#7c3aed] text-white font-black text-lg shadow-[0_15px_30px_-10px_rgba(139,92,246,0.5)] mb-8 transition-all hover:scale-[1.02] border-none italic"
                >
                  <a 
                    href={whatsappLink} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    onClick={() => handleTrackClick('click_whatsapp')}
                  >
                    {data.cta_text || 'Faça seu Pedido 🛍️'}
                  </a>
                </Button>

                {/* Highlights Sales */}
                {renderProfessionHighlights('#8b5cf6')}

                {/* Grid de Produtos/Serviços */}
                <div className="w-full mb-8">
                  <p className="text-[10px] font-black uppercase tracking-widest text-[#8b5cf6]/40 text-center mb-4">Destaques do Catálogo</p>
                  <div className="grid grid-cols-1 gap-3">
                    {activeServicesArr.length > 0 ? activeServicesArr.map((service, i) => (
                      <div key={i} className="flex flex-col p-5 rounded-3xl bg-white dark:bg-slate-900 border-b-2 border-r-2 border-violet-100 dark:border-violet-900/30 group hover:border-[#8b5cf6] transition-colors shadow-sm relative overflow-hidden">
                        <div className="flex justify-between items-center mb-2 relative z-10 w-full">
                        <div className="flex flex-col flex-1">
                          <span className="text-sm font-black text-slate-800 dark:text-white uppercase tracking-tighter leading-tight">{service.name}</span>
                          {service.description && <p className="text-[11px] text-slate-500 dark:text-violet-200/60 leading-tight line-clamp-2 mt-1">{service.description}</p>}
                        </div>
                        {service.price && <span className="bg-violet-100 dark:bg-violet-900/40 text-[#8b5cf6] text-[10px] font-black px-3 py-1 rounded-full shrink-0 ml-4">{service.price}</span>}
                      </div>
                    </div>
                  )) : (
                    <p className="text-center text-xs opacity-20 italic py-8">Destaque seus produtos aqui</p>
                  )}
                </div>
              </div>

                {/* Detalhes Vendas */}
                <div className="w-full space-y-4 mb-8">
                  {previewAddress && (
                    <div className="p-5 rounded-3xl bg-slate-900 border-l-4 border-[#8b5cf6] text-white">
                      <div className="flex items-center gap-2 mb-2">
                        <MapPin className="w-4 h-4 text-[#8b5cf6]" />
                        <span className="text-[9px] font-black uppercase tracking-[0.2em] text-[#8b5cf6]">Localização</span>
                      </div>
                      <p className="text-xs font-medium opacity-80">{previewAddress}</p>
                    </div>
                  )}
                  {previewArea && (
                    <div className="p-5 rounded-3xl bg-violet-50 dark:bg-violet-900/10 border border-violet-100 dark:border-violet-800/30">
                      <div className="flex items-center gap-2 mb-2">
                        <Globe className="w-4 h-4 text-[#8b5cf6]" />
                        <span className="text-[9px] font-black uppercase tracking-[0.2em] text-[#8b5cf6]">Atendimento</span>
                      </div>
                      <p className="text-xs font-bold italic text-slate-700 dark:text-violet-100">{previewArea}</p>
                    </div>
                  )}
                  
                  {data.business_hours && Object.values(data.business_hours).some(v => v) && (
                    <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800">
                      <div className="flex items-center gap-2 mb-4">
                        <Clock className="w-4 h-4 text-[#8b5cf6]" />
                        <span className="text-[9px] font-black uppercase tracking-[0.2em]">Horário de Funcionamento</span>
                      </div>
                      <div className="grid grid-cols-1 gap-1">
                        {['Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado', 'Dom'].map((day) => {
                          const hours = data.business_hours?.[day];
                          if (!hours) return null;
                          return (
                            <div key={day} className="flex justify-between text-[10px] items-center py-1 border-b border-slate-50 dark:border-slate-800 last:border-0">
                              <span className="text-slate-400 font-bold uppercase">{day}</span>
                              <span className="text-[#8b5cf6] font-black italic">{hours}</span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>

                {/* Redes Sociais Vendas */}
                <div className="flex justify-center gap-3 w-full mb-10">
                  {validSocialLinks.map((social) => {
                    const Icon = social.icon;
                    return (
                      <a 
                        key={social.id}
                        href={social.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-12 h-12 rounded-2xl bg-white dark:bg-slate-800 border-2 border-slate-50 dark:border-slate-800 flex items-center justify-center text-[#8b5cf6] shadow-sm hover:border-[#8b5cf6] transition-colors"
                        onClick={() => handleTrackClick(social.trackType as any)}
                      >
                        <Icon className="w-5 h-5" />
                      </a>
                    );
                  })}
                </div>

                {/* Footer Vendas */}
                <div className="mt-auto w-full flex justify-between items-end opacity-30 mb-8">
                   <div className="flex flex-col">
                     <span className="text-[7px] font-black uppercase tracking-widest">Enterprise Solution</span>
                     <span className="text-[10px] font-black tracking-tighter">KONNEXY&trade; SALES</span>
                   </div>
                   <ShoppingBag className="w-8 h-8 opacity-20" />
                </div>

                {/* QR Signature PRO */}
                {isPro && (data.username || data.id) && (
                  <div className="flex flex-col items-center mb-10 w-full">
                    <AnimatedQR
                      url={`${process.env.NEXT_PUBLIC_APP_URL || 'https://konnexy.com.br'}/u/${data.username || data.id}`}
                      photoUrl={data.photo_url || undefined}
                      accentColor="#8b5cf6"
                      size={100}
                      active={isPro}
                    />
                  </div>
                )}
              {renderCustomPortfolio()}
            </div>
            ) : isFood ? (
              <div className="relative flex flex-col items-center w-full min-h-[600px] z-10 px-6 py-10 overflow-y-auto scroll-hide">
                {/* Header Comida */}
                <div className="flex flex-col items-center mb-8">
                  <div className="relative w-44 h-44 rounded-[2.5rem] rotate-3 overflow-hidden shadow-2xl mb-6 border-4 border-white">
                    {data.photo_url ? (
                      <Image
                        src={data.photo_url}
                        alt={previewName || 'Gastronomia'}
                        fill
                        className="object-cover -rotate-3 scale-110"
                        unoptimized
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-orange-50">
                        <UtensilsCrossed className="w-12 h-12 text-orange-500/40" />
                      </div>
                    )}
                  </div>
                  <h1 className="text-3xl font-black text-slate-900 dark:text-white text-center leading-none tracking-tighter uppercase drop-shadow-md">
                    {previewName}
                  </h1>
                  <span className="mt-2 px-3 py-1 rounded-full bg-red-600 text-white text-[9px] font-black uppercase tracking-widest shadow-md">
                    {previewTagline}
                  </span>
                </div>

                {/* CTA Comida */}
                <Button 
                  asChild 
                  className="w-full h-16 rounded-[1.5rem] bg-red-600 hover:bg-red-700 text-white font-black text-lg shadow-[0_15px_30px_rgba(220,38,38,0.3)] mb-8 transition-transform active:scale-95 border-none"
                >
                  <a 
                    href={whatsappLink} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    onClick={() => handleTrackClick('click_whatsapp')}
                  >
                    {data.cta_text || 'Fazer meu Pedido 🍔'}
                  </a>
                </Button>

                  {/* Highlights Food (Dynamic from config) */}
                  {renderProfessionHighlights('#ef4444')}

                   <div className="flex items-center gap-2 mb-6 mt-4">
                     <div className="h-px flex-1 bg-red-100 dark:bg-red-500/20" />
                     <span className="text-[10px] font-black text-red-600 dark:text-red-400 uppercase tracking-widest drop-shadow-sm">Favoritos da Casa</span>
                     <div className="h-px flex-1 bg-red-100 dark:bg-red-500/20" />
                   </div>
                   <div className="grid grid-cols-1 gap-4 mb-4">
                     {activeServicesArr.length > 0 ? activeServicesArr.map((service, i) => (
                       <a key={i} href={service.whatsappUrl || whatsappLink} target="_blank" rel="noopener noreferrer" className="flex justify-between items-center py-4 px-5 rounded-[1.5rem] bg-white/80 dark:bg-slate-900/60 shadow-md border border-red-100 dark:border-red-500/30 backdrop-blur-md transition-transform hover:scale-[1.02] cursor-pointer hover:border-red-500/50 group">
                         <div className="flex flex-col gap-1 w-full pr-3 relative">
                           <span className="text-base font-black text-slate-800 dark:text-white leading-none group-hover:text-red-500 transition-colors">{service.name}</span>
                           {service.description && <span className="text-[11px] text-slate-500 dark:text-slate-400 leading-snug line-clamp-2 mt-1">{service.description}</span>}
                           <div className="flex items-center gap-1 mt-2">
                             <span className="text-[9px] font-black uppercase tracking-widest text-red-500/70 group-hover:text-red-500">Adicionar</span>
                             <ChevronRight className="w-3 h-3 text-red-500/50 group-hover:translate-x-1 group-hover:text-red-500 transition-all" />
                           </div>
                         </div>
                         <div className="flex items-center justify-end shrink-0">
                           <span className="text-base font-black text-red-600 dark:text-red-400 whitespace-nowrap">{service.price || 'Sob consulta'}</span>
                         </div>
                       </a>
                     )) : (
                       <p className="text-center text-xs opacity-40 italic py-10 dark:text-white">Adicione seus pratos no painel</p>
                     )}
                   </div>

                {/* Detalhes Comida */}
                <div className="w-full space-y-3 mb-10">
                  {previewAddress && (
                    <a 
                      href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(previewAddress)}`}
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex flex-col items-center p-6 rounded-[2.5rem] bg-orange-50 dark:bg-slate-900/60 border-2 border-dashed border-orange-200 dark:border-red-500/30 text-center backdrop-blur-md hover:bg-orange-100 dark:hover:bg-slate-800/80 transition-colors cursor-pointer group"
                    >
                      <MapPin className="w-8 h-8 text-red-600 dark:text-red-400 mb-3 group-hover:scale-110 transition-transform" />
                      <span className="text-[9px] font-black uppercase tracking-widest text-red-600/60 dark:text-red-400/80 mb-2">Onde nos Encontrar</span>
                      <p className="text-sm font-bold text-slate-800 dark:text-white leading-relaxed mb-4">{previewAddress}</p>
                      <span className="text-[10px] font-black uppercase tracking-widest bg-red-100 dark:bg-red-900/40 text-red-600 dark:text-red-400 px-4 py-2 rounded-full border border-red-200 dark:border-red-500/20">Ver no Mapa</span>
                    </a>
                  )}

                  <div className="grid grid-cols-2 gap-3">
                    {previewArea && (
                      <div className="p-5 rounded-[2rem] bg-white dark:bg-slate-900/60 border border-red-50 dark:border-red-500/20 text-center backdrop-blur-md">
                        <Globe className="w-5 h-5 text-red-600 dark:text-red-400 mx-auto mb-2" />
                        <span className="text-[8px] font-black uppercase text-slate-400 block mb-1">Entregas em</span>
                        <p className="text-[10px] font-black text-red-600 dark:text-red-400 uppercase">{previewArea}</p>
                      </div>
                    )}
                    {data.business_hours && Object.values(data.business_hours).some(v => v) && (
                      <div className="p-5 rounded-[2rem] bg-white dark:bg-slate-900/60 border border-red-50 dark:border-red-500/20 text-center backdrop-blur-md">
                        <Clock className="w-5 h-5 text-red-600 dark:text-red-400 mx-auto mb-2" />
                        <span className="text-[8px] font-black uppercase text-slate-400 block mb-1">Estamos</span>
                        <p className="text-[10px] font-black text-red-600 dark:text-red-400 uppercase">Abertos Hoje</p>
                      </div>
                    )}
                  </div>
                  
                  {data.business_hours && Object.values(data.business_hours).some(v => v) && (
                    <div className="p-6 rounded-[2rem] bg-red-600 text-white">
                      <p className="text-[10px] font-black uppercase tracking-widest mb-4 opacity-60">Horário de Cozinha</p>
                      <div className="space-y-2">
                        {['Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado', 'Dom'].map((day) => {
                          const hours = data.business_hours?.[day];
                          if (!hours) return null;
                          return (
                            <div key={day} className="flex justify-between text-[11px] font-bold italic">
                              <span className="opacity-60">{day}</span>
                              <span className="tracking-tighter">{hours}</span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>

                {/* Redes Comida */}
                <div className="flex justify-center gap-4 mb-4">
                  {validSocialLinks.map((social) => {
                    const Icon = social.icon;
                    return (
                      <a 
                        key={social.id}
                        href={social.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-10 h-10 rounded-full bg-slate-900 text-white flex items-center justify-center hover:scale-110 transition-transform"
                        onClick={() => handleTrackClick(social.trackType as any)}
                      >
                        <Icon className="w-4 h-4" />
                      </a>
                    );
                  })}
                </div>

                <div className="mt-auto flex flex-col items-center gap-1 opacity-20 mb-6">
                   <span className="text-[9px] font-black tracking-[0.3em]">KONNEXY&trade; FOOD</span>
                </div>

                {/* QR Signature PRO */}
                {isPro && (data.username || data.id) && (
                  <div className="flex flex-col items-center mb-10 w-full">
                    <AnimatedQR
                      url={`${process.env.NEXT_PUBLIC_APP_URL || 'https://konnexy.com.br'}/${data.username || data.id}`}
                      photoUrl={data.photo_url || undefined}
                      accentColor="#ef4444"
                      size={100}
                      active={isPro}
                    />
                  </div>
                )}
              {renderCustomPortfolio()}
            </div>
            ) : isTech ? (
              <div className="relative flex flex-col items-center w-full min-h-[600px] z-10 px-6 py-10 overflow-y-auto scroll-hide">
                  {/* Tech Aesthetics - Digital Grid Background simulated via patterns */}
                  <div className="w-full flex justify-between items-start mb-10 pt-4">
                     <div className="flex flex-col">
                       <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center mb-4 border border-blue-500/20">
                         <Terminal className="w-5 h-5 text-blue-400" />
                       </div>
                       <h1 className="text-2xl font-bold text-white tracking-tighter leading-none">
                         {previewName}
                       </h1>
                       <p className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-500 mt-2">
                          {data.expert_area || previewTagline}
                       </p>
                     </div>
                     <div className="relative w-24 h-24 rounded-2xl border-2 border-blue-500/50 p-1 bg-blue-500/5 overflow-hidden group/photo">
                        <div className="absolute inset-0 bg-blue-500/10 opacity-0 group-hover/photo:opacity-100 transition-opacity" />
                        <div className="w-full h-full rounded-xl overflow-hidden relative">
                           {data.photo_url ? (
                             <Image
                               src={data.photo_url}
                               alt={previewName || 'Tech'}
                               fill
                               className="object-cover"
                               unoptimized
                             />
                           ) : (
                             <div className="w-full h-full bg-slate-900 flex items-center justify-center">
                               {data.profession === 'designer' ? <Paintbrush className="w-8 h-8 text-blue-500/40" /> :
                                data.profession === 'fotografo' ? <Camera className="w-8 h-8 text-blue-500/40" /> :
                                data.profession === 'tecnico_informatica' ? <Monitor className="w-8 h-8 text-blue-500/40" /> :
                                <Cpu className="w-8 h-8 text-blue-500/40" />}
                             </div>
                           )}
                        </div>
                     </div>
                  </div>

                  {/* Tech CTA */}
                  <Button 
                    asChild 
                    className="w-full h-16 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-black text-sm tracking-widest uppercase mb-10 shadow-[0_20px_40px_rgba(37,99,235,0.3)] transition-all active:scale-95"
                    onClick={() => handleTrackClick('click_whatsapp')}
                  >
                    <a href={whatsappLink} target="_blank" rel="noopener noreferrer">
                       <Code2 className="w-4 h-4 mr-2" />
                       {data.cta_text || 'Solicitar Orçamento'}
                    </a>
                  </Button>

                  {/* Highlights Tech */}
                  {renderProfessionHighlights('#3b82f6')}

                  {/* Tech Stack (Services) */}
                  <div className="w-full mb-10">
                     <div className="flex items-center gap-3 mb-6">
                       <span className="text-[10px] font-black uppercase tracking-[0.3em] text-blue-400">Stack de Especialidades</span>
                       <div className="h-[1px] flex-1 bg-blue-500/10" />
                     </div>
                     <div className="grid grid-cols-1 gap-4">
                       {activeServicesArr.length > 0 ? activeServicesArr.map((service, i) => (
                         <a key={i} href={service.whatsappUrl || whatsappLink} target="_blank" rel="noopener noreferrer" className="group/svc flex flex-col gap-1.5 p-5 rounded-2xl bg-white/5 border border-white/5 hover:border-blue-500/50 transition-all backdrop-blur-md relative overflow-hidden cursor-pointer">
                           <div className="absolute top-0 right-0 w-24 h-24 bg-blue-500/5 blur-2xl rounded-full -mr-8 -mt-8 pointer-events-none group-hover/svc:bg-blue-500/20 transition-colors" />
                           <div className="flex justify-between items-center relative z-10 w-full">
                             <div className="flex flex-col">
                               <span className="text-xs font-bold text-white uppercase tracking-tight">{service.name}</span>
                               {service.price && <span className="text-[9px] font-black text-blue-400 mt-2 uppercase tracking-[0.1em]">{service.price}</span>}
                             </div>
                             <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center opacity-0 group-hover/svc:opacity-100 transition-all group-hover/svc:translate-x-1">
                               <ChevronRight className="w-4 h-4 text-blue-400" />
                             </div>
                           </div>
                           {service.description && (
                             <p className="text-[10px] text-slate-400 leading-relaxed opacity-60 relative z-10">{service.description}</p>
                           )}
                         </a>
                       )) : (
                         <p className="text-center text-xs opacity-20 italic py-10">Serviços não configurados</p>
                       )}
                     </div>
                  </div>

                  {/* Tech Details & Location */}
                  <div className="w-full space-y-4 mb-8">
                     {(data.address || data.city) && (
                       <div className="p-5 rounded-2xl bg-[#0f172a] border border-blue-500/20 text-white flex items-start gap-4">
                         <MapPin className="w-5 h-5 text-blue-400 mt-1 shrink-0" />
                         <div className="flex flex-col">
                           <span className="text-[10px] font-black uppercase text-blue-500/60 mb-1 tracking-widest">Base de Operações</span>
                           <p className="text-xs font-bold text-slate-300 leading-relaxed">{previewAddress} {data.city ? `- ${data.city}` : ''}</p>
                         </div>
                       </div>
                     )}

                     {data.business_hours && Object.values(data.business_hours).some(v => v) && (
                       <div className="p-5 rounded-2xl bg-[#0f172a] border border-blue-500/20 text-white">
                         <div className="flex items-center gap-3 mb-4">
                           <Clock className="w-4 h-4 text-blue-400" />
                           <span className="text-[10px] font-black uppercase text-blue-500 tracking-[0.2em]">Horários de Suporte</span>
                         </div>
                         <div className="grid grid-cols-1 gap-2">
                           {['Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado', 'Dom'].map((day) => {
                             const hours = data.business_hours?.[day];
                             if (!hours) return null;
                             return (
                               <div key={day} className="flex justify-between items-center p-2 rounded-lg hover:bg-white/5 transition-colors">
                                 <span className="text-[10px] font-bold text-slate-500 uppercase">{day}</span>
                                 <span className="text-[10px] font-black text-blue-400">{hours}</span>
                               </div>
                             );
                           })}
                         </div>
                       </div>
                     )}
                   </div>

                   {/* Tech Social */}
                   <div className="flex justify-center gap-4 w-full mb-10">
                     {validSocialLinks.map((social) => {
                       const Icon = social.icon;
                       return (
                         <a 
                           key={social.id}
                           href={social.url}
                           target="_blank"
                           rel="noopener noreferrer"
                           className="w-12 h-12 rounded-xl bg-blue-500/5 border border-blue-500/20 flex items-center justify-center text-blue-400 hover:bg-blue-500/20 hover:scale-110 transition-all"
                           onClick={() => handleTrackClick(social.trackType as any)}
                         >
                           <Icon className="w-5 h-5" />
                         </a>
                       );
                     })}
                   </div>

                  {/* QR Signature PRO */}
                  {isPro && (data.username || data.id) && (
                    <div className="bg-slate-900/50 p-4 rounded-3xl border border-blue-500/20 mb-10 backdrop-blur-xl">
                      <AnimatedQR
                        url={`${process.env.NEXT_PUBLIC_APP_URL || 'https://konnexy.com.br'}/u/${data.username || data.id}`}
                        photoUrl={data.photo_url || undefined}
                        accentColor="#3b82f6"
                        size={120}
                        active={isPro}
                      />
                    </div>
                  )}

                  {/* Tech Footer */}
                  <div className="mt-auto opacity-30 flex items-center gap-2">
                     <span className="text-[7px] font-black uppercase tracking-[0.5em] text-blue-400">KONNEXY&trade; DIGITAL SOLUTIONS</span>
                  </div>
               {renderCustomPortfolio()}
            </div>
            ) : isRealEstate ? (
              <div className="relative flex flex-col items-center w-full min-h-[600px] z-10 px-6 py-10 overflow-y-auto scroll-hide">
                  {/* Real Estate Theme - Luxurious Gold & Emerald Style */}
                  <div className="w-full flex flex-col items-center mb-10 pt-4 text-center">
                     <div className="relative w-32 h-32 rounded-full border-4 border-emerald-500/30 p-1.5 mb-6 shadow-2xl">
                        <div className="w-full h-full rounded-full overflow-hidden border-2 border-emerald-500/20">
                           {data.photo_url ? (
                             <Image src={data.photo_url} alt={previewName || 'Imóveis'} fill className="object-cover" unoptimized />
                           ) : (
                             <div className="w-full h-full bg-slate-900 flex items-center justify-center">
                               <User className="w-10 h-10 text-emerald-500/30" />
                             </div>
                           )}
                        </div>
                        <div className="absolute -bottom-2 right-2 w-10 h-10 rounded-full bg-emerald-600 border-4 border-slate-950 flex items-center justify-center shadow-xl">
                           <Home className="w-4 h-4 text-white" />
                        </div>
                     </div>
                     <h1 className="text-2xl font-bold text-white tracking-tight leading-none mb-3">
                       {previewName}
                     </h1>
                     <div className="px-4 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20">
                       <span className="text-[9px] font-black uppercase tracking-[0.2em] text-emerald-500">
                          {data.expert_area || 'Especialista em Imóveis'}
                       </span>
                     </div>
                  </div>

                  {/* Real Estate CTA */}
                  <Button 
                    asChild 
                    className="w-full h-16 rounded-[1.25rem] bg-emerald-600 hover:bg-emerald-500 text-white font-black text-sm tracking-[0.1em] uppercase mb-10 shadow-[0_20px_35px_rgba(16,185,129,0.3)] transition-all active:scale-95"
                    onClick={() => handleTrackClick('click_whatsapp')}
                  >
                    <a href={whatsappLink} target="_blank" rel="noopener noreferrer">
                       <Building2 className="w-4 h-4 mr-2" />
                       {data.cta_text || 'Encontrar Imóvel'}
                    </a>
                  </Button>

                  {/* Highlights Real Estate */}
                  {renderProfessionHighlights('#10b981')}

                  {/* Properties / Services */}
                  <div className="w-full mb-10">
                     <div className="flex items-center gap-3 mb-6">
                       <span className="text-[10px] font-black uppercase tracking-[0.3em] text-emerald-500">Portfólio de Atuação</span>
                       <div className="h-[1px] flex-1 bg-emerald-500/10" />
                     </div>
                     <div className="grid grid-cols-1 gap-4">
                       {activeServicesArr.length > 0 ? activeServicesArr.map((service, i) => (
                         <div key={i} className="group/svc flex flex-col gap-1.5 p-6 rounded-3xl bg-white/5 border border-white/5 hover:border-emerald-500/30 transition-all relative overflow-hidden">
                           <div className="flex justify-between items-start relative z-10 w-full">
                             <div className="flex flex-col gap-1">
                               <span className="text-xs font-bold text-white uppercase tracking-tight">{service.name}</span>
                               {service.price && <span className="text-[10px] font-black text-emerald-500 mt-1">{service.price}</span>}
                             </div>
                             <Gem className="w-4 h-4 text-emerald-500 opacity-30 group-hover/svc:opacity-100 transition-opacity" />
                           </div>
                           {service.description && (
                             <p className="text-[10px] text-slate-400 leading-relaxed opacity-60 mt-2">{service.description}</p>
                           )}
                         </div>
                       )) : (
                         <p className="text-center text-xs opacity-20 italic py-10">Especialidades não informadas</p>
                       )}
                     </div>
                  </div>

                  {/* Real Estate Contact & Location */}
                  <div className="w-full space-y-4 mb-8">
                     {(data.address || data.city) && (
                       <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-emerald-100 dark:border-emerald-900/30 flex items-start gap-4">
                         <MapPin className="w-6 h-6 text-emerald-500 mt-1 shrink-0" />
                         <div className="flex flex-col">
                           <span className="text-[10px] font-black uppercase text-emerald-600/60 mb-1 tracking-widest">Escritório</span>
                           <p className="text-xs font-bold text-slate-700 dark:text-emerald-50 leading-relaxed">{previewAddress} {data.city ? `- ${data.city}` : ''}</p>
                         </div>
                       </div>
                     )}

                     {data.business_hours && Object.values(data.business_hours).some(v => v) && (
                       <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-emerald-100 dark:border-emerald-900/30">
                         <div className="flex items-center gap-3 mb-4">
                           <Clock className="w-5 h-5 text-emerald-500" />
                           <span className="text-[10px] font-black uppercase text-emerald-700 dark:text-emerald-500 tracking-[0.2em]">Horário Comercial</span>
                         </div>
                         <div className="grid grid-cols-1 gap-2">
                           {['Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado', 'Dom'].map((day) => {
                             const hours = data.business_hours?.[day];
                             if (!hours) return null;
                             return (
                               <div key={day} className="flex justify-between items-center py-2 border-b border-emerald-50 dark:border-emerald-900/20 last:border-0">
                                 <span className="text-[10px] font-bold text-slate-500 uppercase">{day}</span>
                                 <span className="text-[10px] font-black text-emerald-600 dark:text-emerald-400">{hours}</span>
                               </div>
                             );
                           })}
                         </div>
                       </div>
                     )}
                   </div>

                   {/* Real Estate Social */}
                   <div className="flex justify-center gap-4 w-full mb-10">
                     {validSocialLinks.map((social) => {
                       const Icon = social.icon;
                       return (
                         <a 
                           key={social.id}
                           href={social.url}
                           target="_blank"
                           rel="noopener noreferrer"
                           className="w-12 h-12 rounded-full bg-emerald-50 dark:bg-emerald-900/20 flex items-center justify-center text-emerald-600 dark:text-emerald-400 hover:bg-emerald-100 dark:hover:bg-emerald-900/40 hover:scale-110 transition-all border border-emerald-100 dark:border-emerald-800/50"
                           onClick={() => handleTrackClick(social.trackType as any)}
                         >
                           <Icon className="w-5 h-5" />
                         </a>
                       );
                     })}
                   </div>
                  <div className="mt-auto pt-8 flex flex-col items-center gap-4">
                     {isPro && (data.username || data.id) && (
                       <div className="bg-white p-3 rounded-2xl shadow-2xl rotate-3">
                         <AnimatedQR
                           url={`${process.env.NEXT_PUBLIC_APP_URL || 'https://konnexy.com.br'}/u/${data.username || data.id}`}
                           photoUrl={data.photo_url || undefined}
                           accentColor="#10b981"
                           size={80}
                           active={isPro}
                         />
                       </div>
                     )}
                     <span className="text-[7px] font-bold uppercase tracking-[0.5em] text-emerald-500/40">Luxury Real Estate Signature</span>
                  </div>
               {renderCustomPortfolio()}
            </div>
            ) : isDriver ? (
               <div className="relative flex flex-col items-center w-full min-h-[600px] z-10 px-6 py-10 overflow-y-auto scroll-hide">
                  {/* Driver/Delivery Aesthetics - Mobility and Speed */}
                  <div className="w-full flex justify-between items-center mb-10 pt-4">
                     <div className="flex flex-col">
                       <h1 className="text-2xl font-black text-white uppercase italic tracking-tighter leading-none mb-1">
                         {previewName}
                       </h1>
                       <div className="flex items-center gap-2">
                         <div className="w-2 h-2 rounded-full bg-orange-500 animate-pulse" />
                         <span className="text-[9px] font-black uppercase tracking-[0.2em] text-orange-500">
                           {data.expert_area || previewTagline}
                         </span>
                       </div>
                     </div>
                     <div className="relative w-20 h-20 rounded-full border-4 border-orange-500 overflow-hidden shadow-[0_0_20px_rgba(249,115,22,0.3)]">
                        {data.photo_url ? (
                          <Image src={data.photo_url} alt={previewName || 'Driver'} fill className="object-cover" unoptimized />
                        ) : (
                          <div className="w-full h-full bg-slate-900 flex items-center justify-center">
                            <Car className="w-8 h-8 text-orange-500/50" />
                          </div>
                        )}
                     </div>
                  </div>

                  {/* Driver CTA */}
                  <Button 
                    asChild 
                    className="w-full h-16 rounded-2xl bg-orange-500 hover:bg-orange-400 text-slate-950 font-black text-sm tracking-widest uppercase mb-10 shadow-2xl transition-all active:scale-95 group"
                    onClick={() => handleTrackClick('click_whatsapp')}
                  >
                    <a href={whatsappLink} target="_blank" rel="noopener noreferrer">
                       <Navigation className="w-4 h-4 mr-2 group-hover:animate-bounce" />
                       {data.cta_text || 'Chamar Agora'}
                    </a>
                  </Button>

                  {/* Highlights Driver */}
                  {renderProfessionHighlights('#f97316')}

                  {/* Driver Services */}
                  <div className="w-full mb-10">
                    <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500 mb-6 border-l-4 border-orange-500 pl-3">Serviços e Rotas</p>
                    <div className="grid grid-cols-1 gap-3">
                       {activeServicesArr.length > 0 ? activeServicesArr.map((service, i) => (
                         <div key={i} className="flex items-center gap-4 p-4 rounded-2xl bg-white/5 border border-white/5 hover:bg-white/10 transition-colors">
                           <div className="w-10 h-10 rounded-xl bg-orange-500/10 flex items-center justify-center">
                              <Package className="w-5 h-5 text-orange-500" />
                           </div>
                           <div className="flex flex-col">
                             <span className="text-xs font-bold text-white uppercase">{service.name}</span>
                             {service.price && <span className="text-[9px] font-black text-orange-500">{service.price}</span>}
                           </div>
                         </div>
                       )) : (
                         <p className="text-center text-xs opacity-20 italic py-10">Serviços não informados</p>
                       )}
                    </div>
                  </div>

                  {/* Footer Driver */}
                  <div className="mt-auto flex items-center gap-3 opacity-30">
                     <span className="text-[8px] font-black uppercase tracking-[0.5em]">Fast Route Protocol &trade;</span>
                  </div>
               {renderCustomPortfolio()}
            </div>
            ) : isPetshop ? (
               <div className="relative flex flex-col items-center w-full min-h-[600px] z-10 px-6 py-10 overflow-y-auto scroll-hide">
                  {/* Petshop Aesthetics - Playful and Friendly */}
                  <div className="w-full flex items-center gap-6 mb-10 pt-4">
                     <div className="relative w-28 h-28 shrink-0">
                        <div className="absolute inset-0 bg-purple-500/20 rounded-[2.5rem] rotate-6" />
                        <div className="absolute inset-0 bg-mint-500/20 rounded-[2.5rem] -rotate-3" />
                        <div className="relative w-full h-full rounded-[2rem] overflow-hidden border-4 border-white dark:border-slate-800 shadow-xl">
                           {data.photo_url ? (
                             <Image src={data.photo_url} alt={previewName || 'Petshop'} fill className="object-cover" unoptimized />
                           ) : (
                             <div className="w-full h-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                               <PawPrint className="w-10 h-10 text-purple-400" />
                             </div>
                           )}
                        </div>
                     </div>
                     <div className="flex flex-col">
                       <h1 className="text-2xl font-black text-purple-600 dark:text-purple-400 leading-none mb-2">
                         {previewName}
                       </h1>
                       <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">
                          {data.expert_area || previewTagline}
                       </span>
                     </div>
                  </div>

                  {/* Petshop CTA */}
                  <Button 
                    asChild 
                    className="w-full h-16 rounded-[2rem] bg-purple-500 hover:bg-purple-600 text-white font-black text-sm tracking-widest uppercase mb-10 shadow-xl transition-all"
                    onClick={() => handleTrackClick('click_whatsapp')}
                  >
                    <a href={whatsappLink} target="_blank" rel="noopener noreferrer">
                       <MessageCircle className="w-4 h-4 mr-2" />
                       {data.cta_text || 'Agendar Banho & Tosa'}
                    </a>
                  </Button>

                  {/* Highlights Highlights */}
                  {renderProfessionHighlights('#a855f7')}

                  {/* Pet Services - Changed to List format similar to barbearia */}
                  <div className="w-full mb-8">
                     <div className="flex justify-center gap-3 mb-6 items-center">
                        <div className="h-[1px] flex-1 bg-purple-500/20" />
                        <PawPrint className="w-4 h-4 text-purple-500/40" />
                        <span className="text-[10px] font-black text-purple-600 dark:text-purple-400 uppercase tracking-widest">Nossos Serviços</span>
                        <PawPrint className="w-4 h-4 text-purple-500/40" />
                        <div className="h-[1px] flex-1 bg-purple-500/20" />
                     </div>
                     <div className="bg-white dark:bg-slate-800 rounded-3xl border border-purple-100 dark:border-purple-900/30 p-2 shadow-xl">
                       {activeServicesArr.length > 0 ? activeServicesArr.map((service, i) => (
                         <div key={i} className="flex justify-between items-center p-4 border-b border-purple-50 dark:border-purple-900/20 last:border-0 hover:bg-purple-50/50 dark:hover:bg-purple-900/10 transition-colors rounded-2xl">
                           <div className="flex flex-col">
                             <div className="flex items-center gap-2">
                               <Heart className="w-4 h-4 text-purple-400" />
                               <span className="text-sm font-bold text-slate-800 dark:text-white uppercase tracking-tight">{service.name}</span>
                             </div>
                             {service.description && (
                               <span className="text-[10px] text-slate-500 dark:text-slate-400 mt-1 line-clamp-1 max-w-[200px] ml-6">{service.description}</span>
                             )}
                           </div>
                           {service.price && (
                             <div className="flex items-center gap-2 shrink-0">
                               <div className="w-4 h-[1px] bg-purple-200 dark:bg-purple-800 hidden sm:block" />
                               <span className="text-purple-600 dark:text-purple-400 font-black">{service.price}</span>
                             </div>
                           )}
                         </div>
                       )) : (
                         <p className="text-center text-xs text-slate-400 italic py-8">Nenhum serviço cadastrado.</p>
                       )}
                     </div>
                  </div>

                  {/* Petshop Contact & Details */}
                  <div className="w-full space-y-4 mb-8">
                     {(data.address || data.city) && (
                       <div className="p-6 rounded-3xl bg-purple-50 dark:bg-purple-900/10 border border-purple-100 dark:border-purple-900/30 flex items-start gap-4">
                         <div className="w-10 h-10 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center shrink-0">
                           <MapPin className="w-5 h-5 text-purple-500" />
                         </div>
                         <div className="flex flex-col pt-1">
                           <span className="text-[10px] font-black uppercase text-purple-600/60 mb-1 tracking-widest">Onde Estamos</span>
                           <p className="text-xs font-bold text-slate-700 dark:text-purple-50 leading-relaxed">{previewAddress} {data.city ? `- ${data.city}` : ''}</p>
                         </div>
                       </div>
                     )}

                     {data.business_hours && Object.values(data.business_hours).some(v => v) && (
                       <div className="p-6 rounded-3xl bg-white dark:bg-slate-800 border border-purple-100 dark:border-purple-900/30 shadow-sm">
                         <div className="flex items-center gap-3 mb-4">
                           <Clock className="w-5 h-5 text-purple-500" />
                           <span className="text-[10px] font-black uppercase text-purple-700 dark:text-purple-400 tracking-[0.2em]">Horário de Funcionamento</span>
                         </div>
                         <div className="grid grid-cols-1 gap-2">
                           {['Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado', 'Dom'].map((day) => {
                             const hours = data.business_hours?.[day];
                             if (!hours) return null;
                             return (
                               <div key={day} className="flex justify-between items-center py-2 border-b border-purple-50 dark:border-purple-900/20 last:border-0">
                                 <span className="text-[10px] font-bold text-slate-500 uppercase">{day}</span>
                                 <span className="text-[10px] font-black text-purple-600 dark:text-purple-400">{hours}</span>
                               </div>
                             );
                           })}
                         </div>
                       </div>
                     )}
                   </div>

                   {/* Petshop Social */}
                   <div className="flex justify-center gap-4 w-full mb-10">
                     {validSocialLinks.map((social) => {
                       const Icon = social.icon;
                       return (
                         <a 
                           key={social.id}
                           href={social.url}
                           target="_blank"
                           rel="noopener noreferrer"
                           className="w-12 h-12 rounded-2xl bg-white dark:bg-slate-800 shadow-lg flex items-center justify-center text-purple-500 hover:bg-purple-500 hover:text-white hover:-translate-y-1 transition-all"
                           onClick={() => handleTrackClick(social.trackType as any)}
                         >
                           <Icon className="w-5 h-5" />
                         </a>
                       );
                     })}
                   </div>

                  <div className="mt-auto opacity-30">
                     <span className="text-[7px] font-black uppercase tracking-[0.4em] text-purple-600 dark:text-purple-400">PetCare Management Signature</span>
                  </div>
               {renderCustomPortfolio()}
            </div>
            ) : isService ? (
              <div className="relative flex flex-col items-center w-full min-h-[600px] z-10 px-6 py-10 overflow-y-auto scroll-hide">
                {/* Header Serviços / Manutenção - INDUSTRIAL REVAMPED */}
                <div className="w-full mb-8 p-6 rounded-[2.5rem] bg-slate-900 shadow-2xl relative overflow-hidden group">
                  <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:rotate-12 transition-transform duration-500 pointer-events-none">
                    <Construction className="w-24 h-24 text-white" />
                  </div>
                  <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-[#f59e0b] opacity-5 rounded-full blur-3xl" />
                  
                  <div className="relative z-10 flex flex-col items-center text-center">
                    <div className="relative w-28 h-28 rounded-3xl border-2 border-[#f59e0b]/50 overflow-hidden mb-6 p-1.5 bg-slate-800 rotate-3 transition-transform group-hover:rotate-0">
                      <div className="w-full h-full rounded-2xl overflow-hidden relative">
                        {data.photo_url ? (
                          <Image
                            src={data.photo_url}
                            alt={previewName || 'Serviços'}
                            fill
                            className="object-cover -rotate-3 scale-110 group-hover:rotate-0 transition-transform"
                            unoptimized
                          />
                        ) : (
                          <div className="w-full h-full bg-slate-800 flex items-center justify-center">
                            <Settings className="w-10 h-10 text-[#f59e0b]" />
                          </div>
                        )}
                      </div>
                    </div>
                    <h1 className="text-2xl font-black text-white uppercase tracking-tighter leading-none mb-2">
                      {previewName}
                    </h1>
                    <div className="px-3 py-1 bg-[#f59e0b] rounded-lg inline-block">
                      <p className="text-[9px] font-black text-slate-900 uppercase tracking-[0.2em]">
                        {previewTagline}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Trust Badges / Stats - UP FRONT */}
                {(data.expert_area || data.founded_year) && (
                  <div className="grid grid-cols-2 gap-3 w-full mb-6">
                    {data.expert_area && (
                      <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 flex flex-col items-center text-center">
                        <div className="w-10 h-10 rounded-xl bg-[#f59e0b]/10 flex items-center justify-center mb-2">
                          <Award className="w-5 h-5 text-[#f59e0b]" />
                        </div>
                        <span className="text-[8px] font-black uppercase text-slate-400 mb-1">Especialidade</span>
                        <p className="text-[10px] font-black text-slate-800 dark:text-white uppercase truncate w-full">{data.expert_area}</p>
                      </div>
                    )}
                    {data.founded_year && (
                      <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 flex flex-col items-center text-center">
                        <div className="w-10 h-10 rounded-xl bg-[#f59e0b]/10 flex items-center justify-center mb-2">
                          <History className="w-5 h-5 text-[#f59e0b]" />
                        </div>
                        <span className="text-[8px] font-black uppercase text-slate-400 mb-1">No Mercado</span>
                        <p className="text-[10px] font-black text-slate-800 dark:text-white uppercase truncate w-full">Desde {data.founded_year}</p>
                      </div>
                    )}
                  </div>
                )}

                {/* CTA Serviços */}
                <Button 
                  asChild 
                  className="w-full h-16 rounded-2xl bg-[#f59e0b] hover:bg-[#d97706] text-black font-black text-base shadow-[0_20px_40px_rgba(245,158,11,0.25)] mb-8 transition-all active:scale-95 border-none group"
                >
                  <a 
                    href={whatsappLink} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    onClick={() => handleTrackClick('click_whatsapp')}
                  >
                    <MessageCircle className="w-5 h-5 mr-2 fill-black" />
                    {data.cta_text || 'Solicitar Orçamento'}
                    <ChevronRight className="w-5 h-5 ml-auto group-hover:translate-x-1 transition-transform" />
                  </a>
                </Button>

                {/* Highlights Service */}
                {renderProfessionHighlights('#f59e0b')}

                {/* Localização e Atendimento */}
                {(data.address || data.service_area) && (
                  <div className="w-full mb-8 space-y-3">
                    {previewAddress && (
                      <div className="flex items-start gap-4 p-5 rounded-2xl bg-slate-900 text-white shadow-xl border border-slate-800 relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-20 h-20 bg-white/5 rounded-full -mr-10 -mt-10 blur-2xl pointer-events-none" />
                        <div className="w-10 h-10 rounded-xl bg-[#f59e0b] flex items-center justify-center shrink-0">
                          <MapPin className="w-5 h-5 text-black" />
                        </div>
                        <div className="flex flex-col">
                          <span className="text-[9px] font-black uppercase text-[#f59e0b] mb-1">Localização</span>
                          <p className="text-xs font-bold leading-relaxed">{previewAddress}</p>
                        </div>
                      </div>
                    )}
                    {previewArea && (
                      <div className="flex items-center gap-4 p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                        <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center shrink-0">
                          <Globe className="w-5 h-5 text-[#f59e0b]" />
                        </div>
                        <div className="flex flex-col">
                          <span className="text-[9px] font-black uppercase text-slate-400 mb-1">Raio de Atuação</span>
                          <span className="text-xs font-black uppercase text-slate-800 dark:text-white">{previewArea}</span>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Lista de Soluções */}
                <div className="w-full mb-10">
                  <div className="flex items-center gap-4 mb-6">
                    <span className="text-[11px] font-black text-slate-400 uppercase tracking-[0.3em] whitespace-nowrap">Soluções Especializadas</span>
                    <div className="h-px w-full bg-slate-200 dark:bg-slate-800" />
                  </div>
                    <div className="space-y-4">
                      {activeServicesArr.length > 0 ? activeServicesArr.map((service, i) => (
                        <div key={i} className="flex flex-col p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-sm group hover:border-[#f59e0b] transition-all relative overflow-hidden">
                          <div className="flex justify-between items-center relative z-10 w-full gap-4">
                            <div className="flex flex-col flex-1">
                              <span className="text-sm font-black text-slate-800 dark:text-white uppercase tracking-tighter leading-tight">{service.name}</span>
                              {service.description && <p className="text-[11px] text-slate-500 mt-1.5 leading-relaxed opacity-80">{service.description}</p>}
                            </div>
                            {service.price && (
                              <span className="text-xs font-black text-[#f59e0b] bg-[#f59e0b]/10 px-3 py-1.5 rounded-xl shrink-0 border border-[#f59e0b]/20">
                                {service.price}
                              </span>
                            )}
                          </div>
                          <div className="absolute top-0 right-0 p-2 opacity-[0.03] pointer-events-none">
                            <Hammer className="w-12 h-12" />
                          </div>
                        </div>
                      )) : (
                      <p className="text-center text-xs opacity-20 italic py-10">Consulte nossos serviços via WhatsApp</p>
                    )}
                  </div>
                </div>

                {/* Horários e Redes Sociais */}
                <div className="w-full grid grid-cols-1 gap-6 mb-10">
                  {data.business_hours && Object.values(data.business_hours).some(v => v) && (
                    <div className="bg-slate-900 rounded-[2.5rem] p-8 text-white relative overflow-hidden">
                      <div className="absolute top-0 right-0 p-6 opacity-10 pointer-events-none">
                        <Clock className="w-16 h-16 text-white" />
                      </div>
                      <h3 className="text-xs font-black uppercase tracking-[0.3em] text-[#f59e0b] mb-6">Expediente</h3>
                      <div className="space-y-3 relative z-10">
                        {['Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado', 'Dom'].map((day) => {
                          const hours = data.business_hours?.[day];
                          if (!hours) return null;
                          return (
                            <div key={day} className="flex justify-between items-center text-[10px] font-bold uppercase tracking-widest border-b border-white/10 pb-2 last:border-0">
                              <span className="opacity-40">{day}</span>
                              <span className="text-[#f59e0b]">{hours}</span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  <div className="flex justify-between gap-3">
                    {validSocialLinks.map((social) => {
                      const Icon = social.icon;
                      return (
                        <a
                          key={social.id}
                          href={social.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex-1 h-14 rounded-2xl bg-white dark:bg-slate-800 border-2 border-slate-50 dark:border-slate-800 flex items-center justify-center text-slate-600 dark:text-slate-300 shadow-sm transition-all hover:scale-105 active:scale-95 group"
                          onClick={() => handleTrackClick(social.trackType as any)}
                        >
                          <Icon className="w-6 h-6 group-hover:text-[#f59e0b]" />
                        </a>
                      );
                    })}
                  </div>
                </div>

                <div className="mt-auto flex flex-col items-center gap-4 py-8">
                   <div className="px-4 py-2 bg-slate-100 dark:bg-slate-800 rounded-full opacity-40">
                      <span className="text-[9px] font-black tracking-[0.4em] uppercase text-slate-600 dark:text-slate-400">KONNEXY INDUSTRIAL SYSTEM</span>
                   </div>
                   
                   {/* QR Signature PRO */}
                   {isPro && (data.username || data.id) && (
                     <div className="bg-white dark:bg-slate-800 p-4 rounded-3xl shadow-xl border border-slate-100 dark:border-slate-800 scale-90">
                       <AnimatedQR
                         url={`${process.env.NEXT_PUBLIC_APP_URL || 'https://konnexy.com.br'}/u/${data.username || data.id}`}
                         photoUrl={data.photo_url || undefined}
                         accentColor="#f59e0b"
                         size={120}
                         active={isPro}
                       />
                     </div>
                   )}
                </div>
              {renderCustomPortfolio()}
            </div>
            ) : isAdvogado ? (
              <div className="relative flex flex-col items-center w-full min-h-[600px] z-10 px-6 py-10 overflow-y-auto scroll-hide">
                 {/* Header Advogado - Sobriedade e Elegância */}
                 <div className="w-full flex justify-between items-start mb-10 pt-4">
                    <div className="flex flex-col">
                      <Scale className="w-8 h-8 text-slate-400 mb-3" />
                      <h1 className="text-2xl font-serif text-white tracking-tight leading-none">
                        {previewName}
                      </h1>
                      <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 mt-2">
                         {data.expert_area || previewTagline}
                      </p>
                    </div>
                    <div className="relative w-24 h-24 rounded-full border-2 border-slate-700 p-1">
                       <div className="w-full h-full rounded-full overflow-hidden">
                          {data.photo_url ? (
                            <Image
                              src={data.photo_url}
                              alt={previewName || 'Advogado'}
                              fill
                              className="object-cover"
                              unoptimized
                            />
                          ) : (
                            <div className="w-full h-full bg-slate-800 flex items-center justify-center">
                              <User className="w-8 h-8 text-slate-600" />
                            </div>
                          )}
                       </div>
                    </div>
                 </div>

                 {/* CTA Principal Advogado */}
                 <Button 
                   asChild 
                   className="w-full h-16 rounded-xl bg-slate-100 hover:bg-white text-slate-900 font-bold text-sm tracking-widest uppercase mb-10 shadow-2xl transition-all active:scale-95 group/law"
                   onClick={() => handleTrackClick('click_whatsapp')}
                 >
                   <a href={whatsappLink} target="_blank" rel="noopener noreferrer">
                      <MessageCircle className="w-4 h-4 mr-2" />
                      {data.cta_text || 'Agendar Consulta'}
                   </a>
                 </Button>

                 {/* Highlights Advogado */}
                 {renderProfessionHighlights('#94a3b8')}

                 {/* Especialidades Jurídicas */}
                 <div className="w-full mb-10">
                    <div className="flex items-center gap-3 mb-6">
                      <span className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500">Áreas de Atuação</span>
                      <div className="h-[1px] flex-1 bg-slate-800" />
                    </div>
                    <div className="grid grid-cols-1 gap-4">
                      {activeServicesArr.length > 0 ? activeServicesArr.map((service, i) => (
                        <div key={i} className="group/svc flex flex-col gap-1.5 p-5 rounded-2xl bg-slate-900 border border-slate-800 transition-colors hover:border-slate-600 relative overflow-hidden">
                          <div className="flex justify-between items-center relative z-10 w-full">
                            <div className="flex flex-col">
                              <span className="text-xs font-bold text-white uppercase tracking-tight leading-none">{service.name}</span>
                              {service.price && <span className="text-[9px] font-black text-slate-500 mt-2 uppercase tracking-widest">{service.price}</span>}
                            </div>
                            <ChevronRight className="w-4 h-4 text-slate-600 group-hover/svc:translate-x-1 transition-transform" />
                          </div>
                          {service.description && (
                            <p className="text-[10px] text-slate-400 italic leading-relaxed opacity-60 relative z-10">{service.description}</p>
                          )}
                        </div>
                      )) : (
                        <p className="text-center text-xs opacity-20 italic py-10">Especialidades não informadas</p>
                      )}
                    </div>
                 </div>

                 {/* Informações de Contato / Localização */}
                 <div className="w-full space-y-4 mb-10">
                   {data.city && (
                      <div className="flex items-center gap-3 p-4 rounded-xl bg-slate-800/50 border border-slate-700/50">
                        <MapPin className="w-4 h-4 text-slate-400" />
                        <span className="text-xs font-medium text-slate-300">{data.city} {data.address && `- ${previewAddress}`}</span>
                      </div>
                   )}
                   {previewArea && (
                      <div className="flex items-center gap-3 p-4 rounded-xl bg-slate-800/50 border border-slate-700/50">
                        <Globe className="w-4 h-4 text-slate-400" />
                        <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Atendimento: {previewArea}</span>
                      </div>
                   )}
                 </div>

                 {/* Business Hours Advogado */}
                 {data.business_hours && Object.values(data.business_hours).some(v => v) && (
                   <div className="w-full mb-10">
                     <p className="text-[9px] font-black uppercase tracking-widest text-slate-600 mb-4 px-1">Expediente Jurídico</p>
                     <div className="grid grid-cols-1 gap-1">
                        {['Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado', 'Dom'].map((day) => {
                          const hours = data.business_hours?.[day];
                          if (!hours) return null;
                          return (
                            <div key={day} className="flex justify-between p-3 rounded-lg hover:bg-slate-800/30 transition-colors">
                              <span className="text-[10px] font-bold text-slate-500 uppercase">{day}</span>
                              <span className="text-[10px] font-bold text-white">{hours}</span>
                            </div>
                          );
                        })}
                     </div>
                   </div>
                 )}

                 {/* Redes Sociais Advogado */}
                 <div className="flex justify-center gap-6 w-full mb-10">
                   {validSocialLinks.map((social) => {
                     const Icon = social.icon;
                     return (
                       <a 
                         key={social.id}
                         href={social.url}
                         target="_blank"
                         rel="noopener noreferrer"
                         className="text-slate-500 hover:text-white transition-colors"
                         onClick={() => handleTrackClick(social.trackType as any)}
                       >
                         <Icon className="w-5 h-5" />
                       </a>
                     );
                   })}
                 </div>

                 {/* QR Code Advogado */}
                 {isPro && (data.username || data.id) && (
                   <div className="flex flex-col items-center mt-4 mb-10">
                     <AnimatedQR
                       url={`${process.env.NEXT_PUBLIC_APP_URL || 'https://konnexy.com.br'}/${data.username || data.id}`}
                       photoUrl={data.photo_url || undefined}
                       accentColor="#94a3b8"
                       size={100}
                       active={isPro}
                     />
                   </div>
                 )}

                 {/* Footer Advogado */}
                 <div className="mt-auto opacity-20 text-center">
                    <p className="text-[8px] font-black uppercase tracking-[0.5em]">Advocacia de Excelência</p>
                 </div>
              </div>
            ) : isStandardized ? (
              <div className="relative flex flex-col w-full min-h-[600px] z-10 overflow-y-auto scroll-hide">
                 <StandardProfessionalLayout data={data} isPro={isPro} />
              </div>
            ) : (
            <>
              {/* --- TOP SECTION (Identity) --- */}
          <div className="relative w-full p-6 pt-12 pb-8 flex flex-col items-center text-center shrink-0 z-10 transition-all">
            
            {/* Badges */}
            <div className="absolute top-4 right-5 z-20">
                {isPro ? (
                  <div className="flex flex-col items-end gap-2 text-right">
                    <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-black/30 backdrop-blur-xl border border-white/20 text-white text-[10px] font-black uppercase tracking-[0.2em] shadow-lg group-hover/card:border-amber-500/50 transition-colors">
                      <Crown className="w-3.5 h-3.5 text-amber-400 fill-amber-400/20" />
                      Premium
                    </div>
                    {/* ZL Badge - Regional Focus */}
                    {(data.city?.toLowerCase().includes('zona leste') || previewArea?.toLowerCase().includes('zona leste')) && (
                      <div className="px-3 py-1 rounded-full bg-red-600 text-white text-[9px] font-black uppercase tracking-widest shadow-lg border border-red-500 animate-[pulse_2s_infinite]">
                        Zona Leste - SP
                      </div>
                    )}
                    {/* Profession Specific Label */}
                    {frameConfig?.label && (
                      <div className="px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white text-[9px] font-bold uppercase tracking-wider">
                        {frameConfig.label}
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="px-3 py-1 rounded-full bg-slate-200/50 text-slate-500 text-[9px] font-bold uppercase tracking-wider backdrop-blur-md">
                    Digital Free
                  </div>
                )}
            </div>

            {/* Identity Content */}
            <div className="relative z-10 flex flex-col items-center w-full max-w-[90%]">
                {/* ── KONNEXY AURA (Digital Aura + Border Effects + Profession) ── */}
                {(() => {
                  const effect = data.photo_border_effect || 'none';
                  const themeColor = data.theme_color || '#2563EB';
                  const hasEffect = effect !== 'none';
                  const profAccent = data.theme_color || frameConfig?.accent || '#00D4FF';
                  const ProfIcon = frameConfig?.icon;

                  // --- Ring styles for each border effect ---
                  const ringStyles: Record<string, React.CSSProperties> = {
                    none:    {},
                    glow:    { background: themeColor, filter: `blur(8px)`, opacity: 0.7 },
                    spin:    { background: 'conic-gradient(from 0deg, #3b82f6, #8b5cf6, #ef4444, #f59e0b, #22c55e, #3b82f6)' },
                    rainbow: { background: 'conic-gradient(from 0deg, #ef4444, #f59e0b, #22c55e, #3b82f6, #8b5cf6, #ef4444)' },
                    pulse:   { background: themeColor, opacity: 0.85 },
                    shimmer: { background: 'linear-gradient(105deg, #94a3b8 30%, #f8fafc 50%, #94a3b8 70%)', backgroundSize: '200% 100%' },
                    orbit:   { border: `3px dashed ${themeColor}`, background: 'transparent' },
                  };
                  const ringAnimations: Record<string, string> = {
                    spin:    'aura-spin 3s linear infinite',
                    rainbow: 'aura-spin 4s linear infinite',
                    pulse:   'pulse 1.8s ease-in-out infinite',
                    shimmer: 'shine 2s linear infinite',
                    orbit:   'aura-spin 6s linear infinite',
                  };

                   // ── Profession-specific animations ──────────────────────────
                  const renderProfAnim = (): React.ReactNode => {
                    if (!frameConfig || !isPro) return null;
                    const frame = data.avatar_frame;

                      switch (frame) {
                        // ✂️ Barbearia — Órbitas de precisão elegantes
                        case 'barber':
                          return (
                            <>
                              <div className="absolute rounded-full z-[15]" style={{
                                inset: '-15px',
                                border: `2.5px solid ${profAccent}30`,
                                borderTopColor: profAccent,
                                borderBottomColor: profAccent,
                                animation: 'aura-spin 15s linear infinite',
                              }} />
                              <div className="absolute rounded-full z-[15]" style={{
                                inset: '-24px',
                                border: `1.5px dashed ${profAccent}40`,
                                animation: 'aura-spin 25s linear infinite reverse',
                              }} />
                              {[0, 90, 180, 270].map((deg, i) => (
                                <div key={i} className="absolute w-2 h-1 z-[16]"
                                  style={{
                                    background: profAccent,
                                    top: '50%', left: '50%',
                                    transform: `rotate(${deg}deg) translateX(78px) translateY(-50%)`,
                                    animation: 'aura-spin 15s linear infinite',
                                  }}
                                />
                              ))}
                            </>
                          );

                        // 💻 TI — Brackets de Scanner e Stream de Dados
                        case 'tech':
                          return (
                            <>
                              {/* Cantos de scanner alargados */}
                              {([
                                { cls: 'top-0 left-0',   br: '12px 0 0 0',   bw: '3px 0 0 3px', ins: '-18px' },
                                { cls: 'top-0 right-0',  br: '0 12px 0 0',   bw: '3px 3px 0 0', ins: '-18px' },
                                { cls: 'bottom-0 left-0',br: '0 0 0 12px',   bw: '0 0 3px 3px', ins: '-18px' },
                                { cls: 'bottom-0 right-0',br:'0 0 12px 0',   bw: '0 3px 3px 0', ins: '-18px' },
                              ] as const).map(({ cls, br, bw, ins }, i) => (
                                <div key={i} className={`absolute w-8 h-8 z-[25]`}
                                  style={{
                                    borderColor: profAccent,
                                    borderStyle: 'solid',
                                    borderWidth: bw,
                                    borderRadius: br,
                                    top: i < 2 ? ins : 'auto',
                                    bottom: i >= 2 ? ins : 'auto',
                                    left: i % 2 === 0 ? ins : 'auto',
                                    right: i % 2 !== 0 ? ins : 'auto',
                                    animation: `digital-blink 3s ease-in-out infinite`,
                                    animationDelay: `${i * 0.4}s`,
                                    filter: `drop-shadow(0 0 5px ${profAccent}80)`,
                                  }}
                                />
                              ))}
                              {/* Data stream dots */}
                              <div className="absolute rounded-full z-[20]" style={{
                                inset: '-28px',
                                border: `1px dashed ${profAccent}20`,
                                animation: 'aura-spin 20s linear infinite',
                              }} />
                            </>
                          );

                        // ✨ Beleza — Brilhos e Pétalas
                        case 'beauty':
                          return (
                            <>
                              <div className="absolute rounded-full z-[15]" style={{
                                inset: '-18px',
                                border: `2px solid ${profAccent}40`,
                                borderLeftColor: 'transparent',
                                borderRightColor: 'transparent',
                                animation: 'aura-spin 8s ease-in-out infinite',
                              }} />
                              {[...Array(4)].map((_, i) => (
                                <Sparkles key={i} className="absolute z-[16] opacity-60"
                                  style={{
                                    color: profAccent,
                                    width: '12px', height: '12px',
                                    top: i < 2 ? '0%' : '100%',
                                    left: i % 2 === 0 ? '0%' : '100%',
                                    animation: 'pulse 2s ease-in-out infinite',
                                    animationDelay: `${i * 0.5}s`,
                                  }}
                                />
                              ))}
                            </>
                          );

                        // 🏠 Imóveis — Moldura Estrutural
                        case 'real_estate':
                          return (
                            <div className="absolute z-[15] overflow-hidden" style={{ inset: '-10px', border: `2px solid ${profAccent}40`, borderRadius: '12px' }}>
                              <div className="absolute top-0 left-0 w-full h-[2px]" style={{ background: `linear-gradient(90deg, transparent, ${profAccent}, transparent)`, animation: 'shine 3s linear infinite' }} />
                            </div>
                          );

                        // ⚖️ Advogado — Linhas de Equilíbrio
                        case 'lawyer':
                          return (
                            <>
                              <div className="absolute w-[120%] h-[1px] z-[15] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-20" style={{ background: profAccent }} />
                              <div className="absolute h-[120%] w-[1px] z-[15] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-20" style={{ background: profAccent }} />
                            </>
                          );

                        // 🩺 Saúde — Pulso Vital
                        case 'health':
                          return (
                            <div className="absolute rounded-full z-[15]" style={{
                              inset: '-20px',
                              border: `2px solid ${profAccent}`,
                              opacity: 0.3,
                              animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
                            }} />
                          );

                        // 🍔 Comida — Vapor/Aura Quente
                        case 'food':
                          return (
                            <div className="absolute z-[15] opacity-40" style={{
                              inset: '-15px',
                              background: `radial-gradient(circle, ${profAccent}30 0%, transparent 70%)`,
                              animation: 'pulse 3s ease-in-out infinite',
                            }} />
                          );

                        default:
                          return null;
                    }
                  };

                  return (
                    <div className={cn("konnexy-aura mb-8", isPro && "scale-110")}>

                      {/* --- Default Aura (no border effect selected) --- */}
                      {!hasEffect && (
                        <>
                          {/* Glow: profession color when available, else Konnexy cyan */}
                          <div
                            className="aura-glow"
                            style={{
                              opacity: isPro ? 0.75 : 0.55,
                              filter: `blur(${isPro ? 16 : 12}px)`,
                              background: frameConfig
                                ? `conic-gradient(from 0deg, ${profAccent}, ${frameConfig.gradient.includes('#') ? frameConfig.gradient.split('#')[2] ? '#' + frameConfig.gradient.split('#')[2].slice(0,6) : profAccent : profAccent}, ${profAccent})`
                                : 'conic-gradient(from 0deg, #00D4FF, #3B82F6, #22D3EE, #00D4FF)',
                            }}
                          />
                          {/* Arc: profession color */}
                          <div
                            className="aura-arc"
                            style={{
                              borderTopColor:   frameConfig ? profAccent : '#00D4FF',
                              borderRightColor: frameConfig ? profAccent : '#3B82F6',
                              borderWidth: isPro ? '3px' : '2px',
                              opacity: isPro ? 0.7 : 0.4,
                            }}
                          />
                          {/* Particles */}
                          {[...Array(isPro ? 10 : 5)].map((_, i) => (
                            <div
                              key={i}
                              className="aura-particle"
                              style={{
                                top:             `${(i * 37 + 5) % 120 - 10}%`,
                                left:            `${(i * 53 + 10) % 120 - 10}%`,
                                animationDelay:  `${i * 0.4}s`,
                                animationDuration:`${3 + (i % 3)}s`,
                                transform:       `scale(${isPro ? 1 + (i % 3) * 0.3 : 0.6 + (i % 3) * 0.2})`,
                                opacity:         isPro ? 0.45 : 0.2,
                                background:      frameConfig ? profAccent : '#00D4FF',
                              }}
                            />
                          ))}
                          {/* Profissão: animação temática */}
                          {renderProfAnim()}
                        </>
                      )}

                      {/* Profissão: animação temática (renderiza sempre se não houver efeito ou se isPro) */}
                      {hasEffect && renderProfAnim()}

                      {/* --- Border effect ring --- */}
                      {hasEffect && (
                        <div
                          className="absolute rounded-full z-[5]"
                          style={{ inset: '-6px', ...ringStyles[effect], animation: ringAnimations[effect] }}
                        />
                      )}
                      {effect === 'glow' && (
                        <div className="absolute rounded-full z-[4] blur-[14px]"
                          style={{ inset: '-10px', background: themeColor, opacity: 0.5, animation: 'pulse 2s ease-in-out infinite' }}
                        />
                      )}

                      {/* Profile Photo */}
                      <div className={cn(
                        "relative w-36 h-36 md:w-40 md:h-40 rounded-full overflow-hidden z-10 shadow-2xl transition-all duration-700",
                        !hasEffect && isPro && frameConfig
                          ? "border-[3px]"
                          : !hasEffect && isPro
                          ? "border-4 border-white/40 ring-4 ring-konnexy-cian/20"
                          : "border-4 border-white/10"
                      )}
                      style={!hasEffect && isPro && frameConfig ? { borderColor: profAccent + '80' } : {}}
                      >
                        {data.photo_url ? (
                          <Image
                            src={data.photo_url}
                            alt={previewName || 'Avatar'}
                            fill
                            className="object-cover"
                            style={{ filter: getPhotoFilter() }}
                            priority
                          />
                        ) : (
                          <div className="w-full h-full bg-konnexy-base flex items-center justify-center text-white text-4xl font-black">
                            {data.name?.charAt(0) || '?'}
                          </div>
                        )}
                      </div>

                      {/* Profession icon badge (replaces Crown when profession is set) */}
                      {isPro && ProfIcon && !hasEffect && (
                        <div
                          className="absolute -bottom-1 right-1 p-1.5 rounded-full shadow-lg border-2 border-slate-900 z-20"
                          style={{ background: frameConfig!.gradient }}
                        >
                          <ProfIcon className="w-4 h-4 text-white drop-shadow" />
                        </div>
                      )}

                      {/* Crown badge when NO profession set or when border effect active */}
                      {isPro && (!ProfIcon || hasEffect) && (
                        <div className="absolute -bottom-1 right-2 bg-gradient-to-br from-konnexy-cian to-konnexy-blue p-1.5 rounded-full shadow-lg border-2 border-slate-900 z-20 animate-pulse">
                          <Crown className="w-4 h-4 text-white" />
                        </div>
                      )}
                    </div>
                  );
                })()}

                <div className={cn(
                  "flex flex-col items-center px-6 py-4 rounded-[1.5rem] mt-2 transition-all w-full backdrop-blur-md",
                  isPro 
                    ? "bg-white/5 border border-white/10 shadow-sm"
                    : "bg-slate-50/80 dark:bg-slate-900/80 border border-slate-200/50 dark:border-slate-800/50"
               )}>
                 <h1 className={cn(
                   "text-2xl md:text-3xl font-black tracking-tight mb-1 capitalize leading-tight text-center font-sora",
                   isPro ? "text-white drop-shadow-sm" : "text-slate-900 dark:text-white"
                 )}>
                   {previewName}
                 </h1>
                 <p className={cn(
                   "text-sm md:text-base font-medium leading-relaxed opacity-90 mb-3 text-center max-w-[280px]",
                   isPro ? "text-white/80" : "text-slate-600 dark:text-slate-400"
                 )}>
                   {previewTagline}
                 </p>
                 
                 <div className="flex flex-col gap-2.5 mt-2 w-full">
                     {isPro && data.expert_area && (
                       <div className="flex items-center gap-2 justify-center text-[11px] font-bold text-white/90">
                         <div className="w-5 h-5 rounded-full bg-blue-500/20 flex items-center justify-center">
                            <Briefcase className="w-3 h-3 text-blue-400" />
                         </div>
                         Especialista em {data.expert_area}
                       </div>
                     )}

                     <div className="flex flex-wrap items-center justify-center gap-2">
                        {data.city && (
                          <div className={cn(
                            "flex items-center gap-1.5 text-[10px] font-black uppercase tracking-[0.2em] py-1 px-3 rounded-full",
                            isPro ? "bg-white/10 text-white/70" : "bg-slate-200/50 dark:bg-slate-800 text-slate-500"
                          )}>
                            <MapPin className="w-3 h-3" />
                            {data.city}
                          </div>
                        )}

                        {isPro && data.service_area && (
                          <div className={cn(
                            "flex items-center gap-1.5 text-[10px] font-black uppercase tracking-[0.1em] py-1 px-3 rounded-full",
                            "bg-amber-500/10 text-amber-500 border border-amber-500/20"
                          )}>
                            <Target className="w-3 h-3" />
                            Atendimento em {previewArea}
                          </div>
                        )}

                        {isPro && data.founded_year && (
                          <div className={cn(
                            "flex items-center gap-1.5 text-[10px] font-black uppercase tracking-[0.1em] py-1 px-3 rounded-full",
                            "bg-white/10 text-white/50 border border-white/10"
                          )}>
                            <Award className="w-3 h-3" />
                            Desde {data.founded_year}
                          </div>
                        )}
                     </div>

                     {previewAddress && (
                       <a 
                         href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(previewAddress || '')}`}
                         target="_blank"
                         rel="noopener noreferrer"
                         onClick={() => handleTrackClick('click_address')}
                         className={cn(
                         "flex items-center gap-1.5 text-[10px] font-bold py-1 px-3 rounded-full border transition-all hover:scale-105 mx-auto active:scale-95 w-fit",
                         isPro 
                           ? "bg-white/5 border-white/10 text-white/80 hover:bg-white/10" 
                           : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"
                       )}>
                         <MapPin className="w-3 h-3 opacity-50" />
                         <span className="opacity-80 truncate max-w-[150px]">{previewAddress}</span>
                       </a>
                     )}
                  </div>
               </div>
             </div>
          </div>

          {/* --- BOTTOM SECTION (Actions & Services) --- */}
          <div className={cn(
            "relative flex-1 p-6 pt-4 z-10 flex flex-col gap-8",
            // If Pro + Video, use transparent background for continuity. Else, maintain the sheet look if desired or full color.
            isPro && data.background_video_url 
              ? "bg-transparent" // Seamless, video continues
              : (isPro ? "bg-white/90 dark:bg-slate-950/90 backdrop-blur-xl rounded-t-[2.5rem] -mt-8" : "bg-slate-50 dark:bg-slate-950 rounded-t-[2.5rem] -mt-8")
          )}>
            {/* Action Stack */}
            <div className="w-full space-y-4">
              <motion.div 
                whileHover={isPro ? { scale: 1.02, y: -2 } : {}} 
                whileTap={isPro ? { scale: 0.98 } : {}}
                className="w-full"
              >
                <Button
                  variant="default"
                  size="lg"
                  className={cn(
                    "w-full h-16 rounded-[1.2rem] font-black text-lg transition-all flex items-center justify-center gap-3 group/btn overflow-hidden relative border-none",
                    isPro 
                      ? "text-white shadow-[0_20px_40px_rgba(37,99,235,0.4)]"
                      : "bg-slate-900 hover:bg-slate-800 text-white shadow-none"
                  )}
                  style={{ 
                    background: isPro 
                      ? (isBarbearia 
                          ? 'linear-gradient(135deg, #d4af37 0%, #a8872d 50%, #7c621d 100%)' 
                          : 'linear-gradient(135deg, #00D4FF 0%, #2563EB 50%, #6D28D9 100%)')
                      : undefined,
                  }}
                  asChild
                  aria-label={isPro ? 'Falar Agora via WhatsApp' : 'Conversar via WhatsApp'}
                  onClick={() => handleTrackClick('click_whatsapp')}
                >
                  <a href={whatsappLink} target="_blank" rel="noopener noreferrer">
                    {/* Shine effect */}
                    <div className="absolute top-0 -inset-full h-full w-1/2 z-5 block transform -skew-x-12 bg-gradient-to-r from-transparent to-white/20 opacity-40 group-hover/btn:animate-shine" />
                    
                    <MessageCircle className={cn("w-6 h-6 flex-shrink-0 z-10", isPro ? "fill-white" : "fill-white/80")} />
                    <span className="font-black uppercase tracking-[0.05em] z-10">
                       {isPro ? (data.cta_text || (isBarbearia ? 'Agendar Corte 💈' : (frameConfig?.cta || 'Falar no WhatsApp'))) : 'WhatsApp'}
                    </span>
                  </a>
                </Button>
              </motion.div>

              {/* Social Navbar */}
              <div className="flex items-center justify-center gap-2 pt-1">
                {/* Visible Social Icons (Max 5 for Pro) */}
                {validSocialLinks.slice(0, isPro ? 5 : 3).map((social, index) => {
                  const isDisabled = !isPro && index > 0;
                  
                  const LinkContent = (
                    <motion.a
                      key={social.id}
                      whileHover={isDisabled ? {} : { y: -3 }}
                      whileTap={isDisabled ? {} : { scale: 0.9 }}
                      href={isDisabled ? '#' : social.url}
                      target={isDisabled || social.url.includes('#') ? undefined : "_blank"}
                      rel={isDisabled || social.url.includes('#') ? undefined : "noopener noreferrer"}
                      aria-label={isDisabled ? `${social.label}` : `Visitar ${social.label}`}
                      onClick={(e) => {
                        if (isDisabled) return;
                        if (social.url.includes('#')) {
                          const anchorId = social.url.includes('#') ? social.url.split('#')[1] : null;
                          if (anchorId) {
                            e.preventDefault();
                            const el = document.getElementById(anchorId);
                            if (el) {
                              el.scrollIntoView({ behavior: 'smooth' });
                            } else {
                              // If on dashboard, maybe the ID isn't in this window, but let's try
                              window.location.href = social.url;
                            }
                          }
                        }
                        handleTrackClick(social.trackType);
                      }}
                      className={cn(
                        "w-12 h-12 flex items-center justify-center rounded-2xl transition-all shadow-sm relative overflow-hidden",
                        isPro 
                          ? "bg-white/10 backdrop-blur-xl border border-white/20 text-white hover:bg-white/20"
                          : "bg-slate-200/50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-400",
                        isDisabled && "opacity-40 cursor-not-allowed grayscale"
                      )}
                    >
                      <social.icon className="w-5 h-5 flex-shrink-0" />
                      {isDisabled && <Lock className="absolute top-1 right-1 w-2.5 h-2.5 text-slate-500" />}
                    </motion.a>
                  );

                  if (isDisabled) {
                    return (
                       <Tooltip key={social.id}>
                         <TooltipTrigger asChild>{LinkContent}</TooltipTrigger>
                         <TooltipContent><p>Disponível no Plano Pro</p></TooltipContent>
                       </Tooltip>
                    );
                  }
                  return LinkContent;
                })}

                {/* 'More' Button (Navbar Style) */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button className={cn(
                      "w-12 h-12 flex items-center justify-center rounded-2xl transition-all shadow-sm",
                      isPro ? "bg-white/10 backdrop-blur-xl border border-white/20 text-white hover:bg-white/20" : "bg-slate-200/50 text-slate-400"
                    )}>
                      <MoreVertical className="w-5 h-5" />
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-64 rounded-2xl p-2 bg-white/95 dark:bg-slate-950/95 backdrop-blur-2xl">
                    
                    {/* Remaining Socials */}
                    {validSocialLinks.length > 3 && (
                      <>
                        <div className="px-2 py-1.5 text-[10px] font-black uppercase tracking-wider opacity-50">Redes Sociais</div>
                        <div className="grid grid-cols-4 gap-1 mb-2">
                          {validSocialLinks.slice(3).map((social) => (
                             <DropdownMenuItem key={social.id} asChild className="p-0 bg-transparent focus:bg-transparent justify-center">
                               <a 
                                 href={social.url} 
                                 target="_blank" 
                                 rel="noopener noreferrer"
                                 className="w-12 h-12 rounded-xl bg-slate-100 dark:bg-white/5 flex items-center justify-center text-slate-600 dark:text-slate-300 hover:bg-primary hover:text-white transition-colors"
                                 onClick={() => handleTrackClick(social.trackType)}
                               >
                                 <social.icon className="w-5 h-5" />
                               </a>
                             </DropdownMenuItem>
                          ))}
                        </div>
                        <div className="h-px bg-slate-200 dark:bg-white/10 my-1" />
                      </>
                    )}

                    <DropdownMenuItem onClick={handleSaveContact} className="rounded-xl h-10 cursor-pointer font-bold">
                       <UserPlus className="w-4 h-4 mr-2" /> Salvar Contato
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={handleShare} className="rounded-xl h-10 cursor-pointer font-bold">
                       <Share2 className="w-4 h-4 mr-2" /> Compartilhar Perfil
                    </DropdownMenuItem>
                    
                    {isPro && (
                      <>
                        <div className="h-px bg-slate-200 dark:bg-white/10 my-1" />
                        <DropdownMenuItem onClick={handleDownloadPNG} className="rounded-xl h-10 cursor-pointer font-bold">
                          <ImageIcon className="w-4 h-4 mr-2" /> Baixar Imagem (PNG)
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={handleDownloadPDF} className="rounded-xl h-10 cursor-pointer font-bold">
                          <FileText className="w-4 h-4 mr-2" /> Baixar PDF
                        </DropdownMenuItem>
                      </>
                    )}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>

            {/* Services (Serviços Organizados) */}
            {activeServicesArr.length > 0 && (
              <div className="w-full">
                <div className="flex items-center gap-3 mb-6">
                  <span className={cn("text-[10px] font-black uppercase tracking-[0.25em]", isPro ? "text-white/40" : "text-slate-400")}>Catálogo de Serviços</span>
                  <div className={cn("h-[1px] flex-1", isPro ? "bg-white/10" : "bg-slate-200 dark:bg-slate-800")} />
                </div>
                
                <div className="flex flex-col gap-4">
                  {activeServicesArr.map((service, i) => {
                     const Icon = ICON_MAP[service.icon || 'Sparkles'] || Sparkles;
                     return (
                       <motion.div 
                         key={i} 
                         initial={{ opacity: 0, x: -10 }}
                         animate={{ opacity: 1, x: 0 }}
                         transition={{ delay: 0.1 * i }}
                         whileHover={isPro ? { x: 8, scale: 1.01 } : {}}
                         className={cn(
                           "group flex items-center gap-5 p-4 rounded-[1.2rem] transition-all cursor-pointer",
                           isPro 
                             ? "glass-premium hover:bg-white/20" 
                             : "bg-white dark:bg-slate-900 border border-slate-100 dark:border-white/5"
                         )}>
                          <div className={cn(
                            "w-12 h-12 rounded-xl flex items-center justify-center shrink-0 transition-transform group-hover:rotate-6",
                            isPro 
                              ? (isBarbearia ? "bg-yellow-500/10 text-yellow-500" : "bg-white/10 text-konnexy-cian") 
                              : "bg-slate-100 dark:bg-slate-800 text-primary"
                          )}>
                             <Icon className="w-6 h-6" />
                          </div>
                          <div className="flex flex-col flex-1 gap-1">
                            <div className="flex justify-between items-center w-full">
                               <span className={cn("text-sm font-bold tracking-tight", isPro ? "text-white" : "text-slate-900 dark:text-white")}>
                                 {service.name}
                               </span>
                               {service.price && (
                                 <span className={cn("text-[10px] font-black uppercase tracking-widest px-2 py-1 rounded-lg shrink-0 ml-2", isPro ? "bg-white/10 text-konnexy-cian" : "bg-slate-100 text-primary")}>
                                   {service.price}
                                 </span>
                               )}
                            </div>
                            {service.description && (
                              <p className={cn("text-[11px] leading-tight opacity-60 line-clamp-2", isPro ? "text-white/80" : "text-slate-500")}>
                                {service.description}
                              </p>
                            )}
                            {isPro && (
                              <div className="flex items-center justify-end mt-1">
                                <ChevronRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-40 transition-all -translate-x-1 group-hover:translate-x-0" />
                              </div>
                            )}
                          </div>
                       </motion.div>
                     );
                  })}
                </div>
              </div>
            )}

            {/* Custom Links (Pro Only) */}
            {isPro && customLinks.length > 0 && (
              <div id="custom-links-section" className="w-full space-y-3 scroll-mt-20">
                <div className="flex items-center gap-3 mb-2">
                  <span className={cn("text-[10px] font-black uppercase tracking-[0.2em]", data.background_video_url ? "text-white/60" : "text-slate-400")}>Links Úteis</span>
                  <div className={cn("h-[1px] flex-1", data.background_video_url ? "bg-white/20" : "bg-slate-200 dark:bg-slate-800")} />
                </div>
                <div className="flex flex-col gap-3 w-full">
                  {customLinks.map((link, i) => (
                    <motion.a
                      key={i}
                      whileHover={{ scale: 1.02, y: -1 }}
                      whileTap={{ scale: 0.98 }}
                      href={link.url.startsWith('http') ? link.url : `https://${link.url}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={cn(
                        "w-full px-5 py-4 rounded-2xl flex items-center justify-center text-center gap-3 border transition-all text-sm font-bold shadow-sm",
                        data.background_video_url 
                          ? "bg-white/10 backdrop-blur-xl border-white/20 text-white hover:bg-white/20" 
                          : "bg-white border-slate-100 hover:border-primary/30 text-slate-800"
                      )}
                    >
                      <div className="w-full flex items-center justify-center relative">
                        <span className="truncate px-2">{link.title}</span>
                        <ChevronRight className="w-3 h-3 absolute right-0 opacity-10" />
                      </div>
                    </motion.a>
                  ))}
                </div>
              </div>
            )}

            {/* Business Hours (Default Layout) */}
            {data.business_hours && Object.values(data.business_hours).some(v => v) && (
              <div className="w-full space-y-3">
                <div className="flex items-center gap-3 mb-2">
                  <span className={cn("text-[10px] font-black uppercase tracking-[0.2em]", isPro ? "text-white/40" : "text-slate-400")}>Horário de Funcionamento</span>
                  <div className={cn("h-[1px] flex-1", isPro ? "bg-white/10" : "bg-slate-200 dark:bg-slate-800")} />
                </div>
                <div className="grid gap-2 bg-slate-100/50 dark:bg-white/5 rounded-2xl p-4 border border-slate-200/50 dark:border-white/5">
                  {['Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado', 'Dom'].map((day) => {
                    const hours = data.business_hours?.[day];
                    if (!hours) return null;
                    return (
                      <div key={day} className="flex items-center justify-between text-[11px] font-bold">
                        <span className="opacity-40 uppercase tracking-widest">{day}</span>
                        <span className={cn(isPro ? "text-white" : "text-slate-900 dark:text-white")}>{hours}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
            
            {/* QR Signature PRO */}
            {isPro && (data.username || data.id) && (
              <div className="flex flex-col items-center mt-2 mb-4">
                <AnimatedQR
                  url={`${process.env.NEXT_PUBLIC_APP_URL || 'https://konnexy.com.br'}/${data.username || data.id}`}
                  photoUrl={data.photo_url || undefined}
                  accentColor={frameConfig?.accent || '#00D4FF'}
                  profGradient={frameConfig?.gradient}
                  size={120}
                  active={isPro}
                />
              </div>
            )}

            {/* Branding Footer (Assinatura de Marca) */}
            {showBranding && (
               <div className="mt-auto pt-8 pb-4 text-center">
                 <a href="/" className={cn("inline-flex flex-col items-center gap-1.5 transition-all opacity-40 hover:opacity-100", 
                   isPro ? "text-white/60 hover:text-white" : "text-slate-400 hover:text-primary")}>
                   <span className="text-[9px] uppercase font-black tracking-[0.3em]">Powered by</span>
                    <span className={cn("text-xs font-black tracking-tight", isPro ? "text-white" : "text-slate-900 dark:text-white")}>KONNEXY&trade;</span>
                  </a>
                </div>
              )}
            </div>
          </>
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
