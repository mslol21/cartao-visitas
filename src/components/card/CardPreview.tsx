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
  Shield
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Profile } from '@/types/profile';
import { cn } from '@/lib/utils';
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

interface CardPreviewProps {
  data: Partial<Profile>;
  showBranding?: boolean;
  suppressTracking?: boolean;
  isDownloadMode?: boolean;
}

export function CardPreview({ data, showBranding = true, suppressTracking = false, isDownloadMode = false }: CardPreviewProps) {
  const isPro = data.plan === 'pro';

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
      pdf.save(`Konnexy_${data.name || 'Card'}.pdf`);
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
      link.download = `Konnexy_${data.name || 'Card'}.png`;
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
FN:${data.name || 'Contato'}
ORG:${data.tagline || ''}
TEL;TYPE=CELL:${formattedWhatsapp}
URL:${typeof window !== 'undefined' ? window.location.href : ''}
END:VCARD`;

    const blob = new Blob([vcard], { type: 'text/vcard' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `${data.name || 'contato'}.vcf`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success('Contato pronto para salvar!');
  };
  
  const cleanWhatsapp = data.whatsapp?.replace(/\D/g, '') || '';
  const formattedWhatsapp = cleanWhatsapp.startsWith('55') ? cleanWhatsapp : `55${cleanWhatsapp}`;
  
  const whatsappLink = cleanWhatsapp
    ? `https://wa.me/${formattedWhatsapp}?text=${encodeURIComponent(`Olá! Vi seu perfil na Konnexy e gostaria de ${isPro ? 'solicitar um orçamento' : 'conversar'} sobre seus serviços.`)}`
    : '#';

  const socialLinks = [
    { id: 'instagram', icon: Instagram, value: data.instagram, url: `https://instagram.com/${data.instagram}`, label: 'Instagram', trackType: 'click_instagram' as const },
    { id: 'linkedin', icon: Linkedin, value: data.linkedin, url: `https://linkedin.com/in/${data.linkedin}`, label: 'LinkedIn', trackType: 'click_linkedin' as const },
    { id: 'facebook', icon: Facebook, value: data.facebook, url: `https://facebook.com/${data.facebook}`, label: 'Facebook', trackType: 'click_facebook' as const },
    { id: 'tiktok', icon: Music, value: data.tiktok, url: `https://tiktok.com/@${data.tiktok}`, label: 'TikTok', trackType: 'click_tiktok' as const },
    { id: 'twitter', icon: Twitter, value: data.twitter, url: `https://twitter.com/${data.twitter}`, label: 'Twitter', trackType: 'click_twitter' as const },
    { id: 'youtube', icon: Youtube, value: data.youtube, url: `https://youtube.com/@${data.youtube}`, label: 'YouTube', trackType: 'click_youtube' as const },
    { id: 'website', icon: Link, value: data.website, url: data.website?.startsWith('http') ? data.website : `https://${data.website}`, label: 'Site', trackType: 'click_website' as const },
  ];

  // All valid links (those with a value)
  const validSocialLinks = socialLinks.filter(s => s.value);
  const customLinks = data.custom_links || [];
  
  // Logic: Pro sees everything. Free sees only 1st and others are disabled.
  const activeServicesLimit = isPro ? 20 : 5; // Increased limit for better grid demo
  const services = data.services?.map(s => typeof s === 'string' ? { name: s, icon: 'Sparkles' } : s).filter(s => s.name?.trim() !== '') || [];
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
        title: data.name || 'Konnexy',
        text: data.tagline || 'Confira meu perfil profissional',
        url: typeof window !== 'undefined' ? window.location.href : '',
      });
    }
  };

  const getThemeClasses = () => {
    const hasVideo = !!data.background_video_url && isPro;
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
        // Ultra Premium Default with Digital Texture
        return "bg-slate-900/80 backdrop-blur-3xl text-white border-white/10 shadow-[inset_0_0_60px_rgba(59,130,246,0.1)]";
    }
  };

  const getProfessionConfig = () => {
    if (!isPro) return null;
    
    switch (data.avatar_frame) {
      case 'electrician':
        return { 
          gradient: 'linear-gradient(135deg, #fbbf24 0%, #000000 100%)', 
          accent: '#fbbf24', 
          label: 'Eletricista 24h',
          cta: 'Chamar no WhatsApp',
          shape: 'polygon(40% 0%, 100% 0%, 65% 45%, 95% 45%, 30% 100%, 45% 55%, 15% 55%)' // Raio Realista
        };
      case 'barber':
        return { 
          gradient: 'linear-gradient(135deg, #111 0%, #d4af37 100%)', 
          accent: '#d4af37', 
          label: 'Mestre da Lâmina',
          cta: 'Agende seu horário',
          shape: 'polygon(50% 50%, 80% 0%, 100% 0%, 55% 52%, 100% 100%, 80% 100%, 52% 55%, 35% 72%, 35% 92%, 25% 100%, 8% 100%, 0% 88%, 0% 68%, 18% 58%, 28% 58%, 32% 54%, 28% 50%, 12% 50%, 0% 38%, 0% 12%, 8% 0%, 25% 0%, 35% 8%, 35% 38%)' // Tesoura Realista baseada na imagem
        };
      case 'cleaner':
        return { 
          gradient: 'linear-gradient(135deg, #0ea5e9 0%, #e0f2fe 100%)', 
          accent: '#0ea5e9', 
          label: 'Brilho Máximo',
          cta: 'Solicitar Faxina',
          shape: 'polygon(50% 0%, 61% 39%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 39%)' 
        };
      case 'mechanic':
        return { 
          gradient: 'linear-gradient(135deg, #334155 0%, #f97316 100%)', 
          accent: '#f97316', 
          label: 'Turbo Mecânica',
          cta: 'Pedir Orçamento',
          shape: 'polygon(50% 0%, 62% 4%, 65% 15%, 82% 16%, 86% 26%, 96% 36%, 96% 46%, 100% 50%, 96% 54%, 96% 64%, 86% 74%, 82% 84%, 65% 84%, 62% 96%, 50% 100%, 38% 96%, 35% 84%, 18% 84%, 14% 74%, 4% 64%, 4% 54%, 0% 50%, 4% 46%, 4% 36%, 14% 26%, 18% 16%, 35% 15%, 38% 4%)' // Engrenagem Robusta baseada na imagem
        };
      case 'plumber':
        return { 
          gradient: 'linear-gradient(135deg, #1d4ed8 0%, #60a5fa 100%)', 
          accent: '#2563eb', 
          label: 'SOS Hidráulica',
          cta: 'Falar com Encanador',
          shape: 'polygon(50% 0%, 75% 15%, 90% 40%, 100% 65%, 90% 90%, 70% 100%, 30% 100%, 10% 90%, 0% 65%, 10% 40%, 25% 15%)' // Gota Mais Redonda
        };
      case 'health':
        return { 
          gradient: 'linear-gradient(135deg, #ef4444 0%, #fee2e2 100%)', 
          accent: '#ef4444', 
          label: 'Sempre com Você',
          cta: 'Marcar agora',
          shape: 'polygon(30% 0%, 70% 0%, 70% 30%, 100% 30%, 100% 70%, 70% 70%, 70% 100%, 30% 100%, 30% 70%, 0% 70%, 0% 30%, 30% 30%)' // Cruz
        };
      case 'law':
        return { 
          gradient: 'linear-gradient(135deg, #0f172a 0%, #eab308 100%)', 
          accent: '#eab308', 
          label: 'Defesa Especializada',
          cta: 'Direito Já',
          shape: 'polygon(10% 0%, 50% 10%, 90% 0%, 100% 5%, 100% 85%, 50% 100%, 0% 85%, 0% 5%)' // Livro Aberto Detalhado
        };
      case 'tech':
        return { 
          gradient: 'linear-gradient(135deg, #000 0%, #3b82f6 100%)', 
          accent: '#3b82f6', 
          label: 'Inovação Digital',
          cta: 'Quero Orçamento',
          shape: 'polygon(0% 10%, 100% 10%, 100% 70%, 65% 70%, 70% 85%, 85% 85%, 85% 100%, 15% 100%, 15% 85%, 30% 85%, 35% 70%, 0% 70%)' // Monitor / iMac Style
        };
      case 'pet':
        return { 
          gradient: 'linear-gradient(135deg, #7c2d12 0%, #fb923c 100%)', 
          accent: '#7c2d12', 
          label: 'Amo meu Pet',
          cta: 'Banho e Tosa',
          shape: 'polygon(50% 40%, 70% 10%, 85% 15%, 80% 45%, 100% 55%, 90% 85%, 50% 100%, 10% 85%, 0% 55%, 20% 45%, 15% 15%, 30% 10%)'
        };
      case 'business':
        return { 
          gradient: 'linear-gradient(135deg, #1e293b 0%, #64748b 100%)', 
          accent: '#1e293b', 
          label: 'Foco em Resultados',
          cta: 'Falar com Consultor',
          shape: 'polygon(25% 18%, 25% 0%, 35% 0%, 65% 0%, 75% 0%, 75% 18%, 100% 18%, 100% 90%, 94% 100%, 6% 100%, 0% 90%, 0% 18%)'
        };
      // ── Formas Geométricas ──────────────────────────────────────────
      case 'hexagon':
        return {
          gradient: `linear-gradient(135deg, ${data.theme_color || '#3b82f6'} 0%, #8b5cf6 100%)`,
          accent: data.theme_color || '#3b82f6',
          shape: 'polygon(25% 0%, 75% 0%, 100% 50%, 75% 100%, 25% 100%, 0% 50%)',
        };
      case 'diamond':
        return {
          gradient: `linear-gradient(135deg, ${data.theme_color || '#06b6d4'} 0%, #0ea5e9 100%)`,
          accent: data.theme_color || '#06b6d4',
          shape: 'polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)',
        };
      case 'blob':
        return {
          gradient: `linear-gradient(135deg, ${data.theme_color || '#8b5cf6'} 0%, #c084fc 100%)`,
          accent: data.theme_color || '#8b5cf6',
          shape: 'polygon(45% 5%, 68% 0%, 88% 12%, 98% 32%, 96% 58%, 85% 80%, 65% 98%, 38% 100%, 16% 88%, 4% 65%, 2% 38%, 12% 18%, 28% 5%)',
        };
      case 'star8':
        return {
          gradient: `linear-gradient(135deg, ${data.theme_color || '#f59e0b'} 0%, #fde68a 100%)`,
          accent: data.theme_color || '#f59e0b',
          shape: 'polygon(50% 0%, 64% 28%, 93% 7%, 73% 34%, 100% 50%, 73% 66%, 93% 93%, 64% 72%, 50% 100%, 36% 72%, 7% 93%, 27% 66%, 0% 50%, 27% 34%, 7% 7%, 36% 28%)',
        };
      case 'squircle':
        return {
          gradient: `linear-gradient(135deg, ${data.theme_color || '#10b981'} 0%, #34d399 100%)`,
          accent: data.theme_color || '#10b981',
          shape: 'polygon(8% 0%, 92% 0%, 100% 8%, 100% 92%, 92% 100%, 8% 100%, 0% 92%, 0% 8%)',
        };
      case 'oval':
        return {
          gradient: `linear-gradient(135deg, ${data.theme_color || '#ec4899'} 0%, #f9a8d4 100%)`,
          accent: data.theme_color || '#ec4899',
          shape: 'ellipse(42% 50% at 50% 50%)',
        };
      case 'shield':
        return {
          gradient: `linear-gradient(135deg, ${data.theme_color || '#0f172a'} 0%, #334155 100%)`,
          accent: data.theme_color || '#334155',
          shape: 'polygon(15% 0%, 85% 0%, 100% 15%, 100% 60%, 50% 100%, 0% 60%, 0% 15%)',
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

  const profConfig = getProfessionConfig();
  const premiumGradient = profConfig?.gradient || (isPro ? `linear-gradient(135deg, ${data.theme_color || '#3b82f6'} 0%, #8b5cf6 100%)` : undefined);

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
            isPro 
              ? "bg-slate-950 border-2 border-primary/20 shadow-[0_40px_100px_-20px_rgba(59,130,246,0.3)] shadow-[inset_0_0_60px_rgba(59,130,246,0.1)]" 
              : "border border-slate-200 dark:border-slate-800 shadow-sm bg-white dark:bg-slate-950"
          )}
        >
          {/* --- BACKGROUND LAYER (Video with Fade Out) --- */}
          <div 
            className="absolute top-0 inset-x-0 h-[85%] z-0"
            style={isPro && data.background_video_url ? {
              maskImage: 'linear-gradient(to bottom, black 60%, transparent 100%)',
              WebkitMaskImage: 'linear-gradient(to bottom, black 60%, transparent 100%)'
            } : undefined}
          >
              {isPro && data.background_video_url ? (
               <>
                 {data.background_video_url.match(/\.(mp4|webm|ogg|mov)$/i) ? (
                   <video 
                     src={data.background_video_url}
                     autoPlay 
                     muted 
                     loop 
                     playsInline 
                     className="w-full h-full object-cover"
                   />
                 ) : (
                   <img 
                     src={data.background_video_url}
                     alt="Background"
                     className="w-full h-full object-cover"
                   />
                 )}
                 {/* Dark overlay for readability */}
                 <div className="absolute inset-0 bg-black/40 backdrop-blur-[1px]" />
                 {/* Internal Gradient for extra smoothness at the very bottom edge of video */}
                 <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-slate-950 to-transparent opacity-80" />
               </>
             ) : (
               <div 
                 className="w-full h-full transition-colors duration-500 relative"
                 style={{ 
                   backgroundColor: data.theme_color || (isPro ? '#0f172a' : '#f1f5f9'),
                   backgroundImage: isPro && !data.theme_color ? 'linear-gradient(to bottom right, #0f172a, #1e293b)' : undefined
                 }}
               >
                 {/* Digital Texture for Premium */}
                 {isPro && (
                   <div 
                     className="absolute inset-0 opacity-[0.03]" 
                     style={{ 
                       backgroundImage: `linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)`,
                       backgroundSize: '20px 20px'
                     }} 
                   />
                 )}
                 {/* Decorative Gradient overlays for Pro Non-Video */}
                 {isPro && (
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-transparent mix-blend-overlay" />
                 )}
               </div>
             )}
          </div>

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
                    {(data.city?.toLowerCase().includes('zona leste') || data.service_area?.toLowerCase().includes('zona leste')) && (
                      <div className="px-3 py-1 rounded-full bg-red-600 text-white text-[9px] font-black uppercase tracking-widest shadow-lg border border-red-500 animate-[pulse_2s_infinite]">
                        Zona Leste - SP
                      </div>
                    )}
                    {/* Profession Specific Label */}
                    {profConfig?.label && (
                      <div className="px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white text-[9px] font-bold uppercase tracking-wider">
                        {profConfig.label}
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
                {/* ── AVATAR ─────────────────────────────────────── */}
                <motion.div 
                  whileHover={isPro ? { scale: 1.05, rotate: 2 } : {}}
                  animate={isPro && data.photo_border_effect === 'pulse' ? { scale: [1, 1.04, 1] } : {}}
                  transition={isPro && data.photo_border_effect === 'pulse' ? { duration: 2, repeat: Infinity, ease: 'easeInOut' } : {}}
                  className={cn(
                    "w-40 h-40 relative transition-all duration-500 mb-5 flex items-center justify-center",
                    isPro 
                      ? "" 
                      : "rounded-full p-1.5 bg-white shadow-xl"
                  )}
                  style={isPro ? {
                    filter: data.photo_border_effect === 'glow'
                      ? `drop-shadow(0 0 14px ${profConfig?.accent || '#3b82f6'}) drop-shadow(0 0 6px ${profConfig?.accent || '#3b82f6'}99)`
                      : data.photo_border_effect === 'rainbow'
                      ? 'drop-shadow(0 0 14px #f43f5e) drop-shadow(0 0 8px #8b5cf6)'
                      : 'drop-shadow(0 0 20px rgba(59,130,246,0.2))'
                  } : undefined}
                >
                  {/* ── Spinning gradient border ── */}
                  {isPro && data.photo_border_effect === 'spin' && (
                    <motion.div
                      className="absolute -inset-[5px] z-0"
                      style={{
                        clipPath: profConfig?.shape || 'circle(50% at 50% 50%)',
                        background: 'conic-gradient(from 0deg, #3b82f6, #8b5cf6, #ef4444, #f59e0b, #22c55e, #06b6d4, #3b82f6)',
                      }}
                      animate={{ rotate: 360 }}
                      transition={{ duration: 2.8, repeat: Infinity, ease: 'linear' }}
                    />
                  )}

                  {/* ── Rainbow animated glow ── */}
                  {isPro && data.photo_border_effect === 'rainbow' && (
                    <motion.div
                      className="absolute -inset-[5px] z-0 blur-[2px]"
                      style={{ clipPath: profConfig?.shape || 'circle(50% at 50% 50%)' }}
                      animate={{
                        background: [
                          'conic-gradient(from 0deg, #ef4444, #f59e0b, #22c55e, #3b82f6, #8b5cf6, #ef4444)',
                          'conic-gradient(from 120deg, #ef4444, #f59e0b, #22c55e, #3b82f6, #8b5cf6, #ef4444)',
                          'conic-gradient(from 240deg, #ef4444, #f59e0b, #22c55e, #3b82f6, #8b5cf6, #ef4444)',
                          'conic-gradient(from 360deg, #ef4444, #f59e0b, #22c55e, #3b82f6, #8b5cf6, #ef4444)',
                        ],
                      }}
                      transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
                    />
                  )}

                  {/* ── Outer gradient ring (shape border) ── */}
                  <div 
                    className="w-full h-full overflow-hidden flex items-center justify-center relative transition-all duration-500 z-[1]"
                    style={isPro ? {
                      clipPath: profConfig?.shape || 'circle(50% at 50% 50%)',
                      background: premiumGradient
                    } : undefined}
                  >
                    {/* ── Inner photo wrapper ── */}
                    <div 
                      className="w-[calc(100%-6px)] h-[calc(100%-6px)] overflow-hidden bg-slate-100 dark:bg-slate-800 flex items-center justify-center relative transition-all duration-500"
                      style={isPro ? {
                        clipPath: profConfig?.shape || 'circle(50% at 50% 50%)',
                      } : undefined}
                    >
                      {data.photo_url ? (
                        <Image
                          src={data.photo_url}
                          alt={data.name || 'Avatar'}
                          width={160}
                          height={160}
                          className="w-full h-full object-cover transition-all duration-500"
                          style={{ filter: getPhotoFilter() }}
                          priority
                        />
                      ) : (
                        <span className="text-3xl font-bold text-slate-400">
                          {data.name?.charAt(0) || '?'}
                        </span>
                      )}

                      {/* ── Shimmer overlay ── */}
                      {isPro && data.photo_border_effect === 'shimmer' && (
                        <motion.div
                          className="absolute inset-0 overflow-hidden pointer-events-none"
                        >
                          <motion.div
                            className="absolute inset-y-0 w-[45%]"
                            style={{
                              background: 'linear-gradient(105deg, transparent, rgba(255,255,255,0.35), transparent)',
                              skewX: '-20deg',
                            }}
                            animate={{ x: ['-120%', '280%'] }}
                            transition={{ duration: 2.2, repeat: Infinity, ease: 'linear', repeatDelay: 1.5 }}
                          />
                        </motion.div>
                      )}
                    </div>
                  </div>
                  
                  {/* ── Soft Glow behind avatar ── */}
                  {isPro && (
                    <motion.div
                      className="absolute inset-0 -z-10 blur-3xl rounded-full scale-125"
                      style={{ backgroundColor: profConfig?.accent || 'var(--primary)' }}
                      animate={data.photo_border_effect === 'pulse'
                        ? { opacity: [0.5, 1, 0.5], scale: [1.1, 1.4, 1.1] }
                        : { opacity: [0.4, 0.7, 0.4] }
                      }
                      transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
                    />
                  )}

                  {/* ── Verified Badge ── */}
                  {isPro && (
                     <div className="absolute bottom-1 right-1 bg-blue-500 text-white rounded-full p-1.5 shadow-lg border-2 border-slate-950 z-20">
                       <BadgeCheck className="w-4 h-4" />
                     </div>
                  )}

                  {/* ── Orbiting profession icon ── */}
                  {isPro && profConfig && data.photo_border_effect === 'orbit' && (
                    <motion.div
                      className="absolute w-8 h-8 z-30"
                      style={{ top: '50%', left: '50%', marginTop: '-16px', marginLeft: '-16px', originX: '50%', originY: '50%' }}
                      animate={{ rotate: 360 }}
                      transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
                    >
                      <div
                        className="absolute w-7 h-7 rounded-full flex items-center justify-center shadow-lg border border-white/30"
                        style={{
                          top: '-4rem',
                          left: '50%',
                          transform: 'translateX(-50%)',
                          background: profConfig.gradient,
                        }}
                      >
                        <Sparkles className="w-3.5 h-3.5 text-white" />
                      </div>
                    </motion.div>
                  )}
                </motion.div>

                <div className={cn(
                  "flex flex-col items-center px-6 py-4 rounded-[1.5rem] mt-2 transition-all w-full backdrop-blur-sm",
                  isPro 
                    ? "bg-black/20 border border-white/10 shadow-sm"
                    : "bg-slate-50/80 dark:bg-slate-900/80 border border-slate-200/50 dark:border-slate-800/50"
               )}>
                 <h1 className={cn(
                   "text-2xl font-black tracking-tight mb-1 capitalize leading-tight text-center",
                   isPro ? "text-white drop-shadow-sm" : "text-slate-900 dark:text-white"
                 )}>
                   {data.name || 'Seu Nome'}
                 </h1>
                 <p className={cn(
                   "text-sm font-bold leading-relaxed opacity-90 mb-3 text-center max-w-[260px]",
                   isPro ? "text-white/80" : "text-slate-600 dark:text-slate-400"
                 )}>
                   {data.tagline || 'Sua profissão ou frase de impacto'}
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
                            Atendimento em {data.service_area}
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

                     {data.address && (
                       <a 
                         href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(data.address)}`}
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
                         <span className="opacity-80 truncate max-w-[150px]">{data.address}</span>
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
                    "w-full h-15 rounded-2xl font-black text-base transition-all flex items-center justify-center gap-3 group/btn overflow-hidden relative",
                    isPro 
                      ? "text-white shadow-[0_20px_50px_rgba(59,130,246,0.3)] hover:scale-[1.02] active:scale-[0.98]"
                      : "bg-slate-900 hover:bg-slate-800 text-white shadow-none border-0"
                  )}
                  style={{ 
                    background: premiumGradient || (isPro ? (data.theme_color || '#25D366') : undefined),
                  }}
                  asChild
                  aria-label={isPro ? 'Falar Agora via WhatsApp' : 'Conversar via WhatsApp'}
                  onClick={() => handleTrackClick('click_whatsapp')}
                >
                  <a href={whatsappLink} target="_blank" rel="noopener noreferrer">
                    {/* Shine effect for Pro */}
                    {isPro && (
                      <div className="absolute top-0 -inset-full h-full w-1/2 z-5 block transform -skew-x-12 bg-gradient-to-r from-transparent to-white/20 opacity-40 group-hover/btn:animate-shine" />
                    )}
                    <MessageCircle className={cn("w-6 h-6 flex-shrink-0 z-10", isPro ? "fill-white" : "fill-white/80")} />
                    <span className="font-black uppercase tracking-wider z-10">
                       {isPro ? (data.cta_text || profConfig?.cta || 'Falar Agora') : 'WhatsApp'}
                    </span>
                  </a>
                </Button>
              </motion.div>

              {/* Social Navbar */}
              <div className="flex items-center justify-center gap-2 pt-1">
                {/* Visible Social Icons (Max 3) */}
                {validSocialLinks.slice(0, 3).map((social, index) => {
                  const isDisabled = !isPro && index > 0;
                  
                  const LinkContent = (
                    <motion.a
                      key={social.id}
                      whileHover={isDisabled ? {} : { y: -3 }}
                      whileTap={isDisabled ? {} : { scale: 0.9 }}
                      href={isDisabled ? '#' : social.url}
                      target={isDisabled ? undefined : "_blank"}
                      rel={isDisabled ? undefined : "noopener noreferrer"}
                      aria-label={isDisabled ? `${social.label}` : `Visitar ${social.label}`}
                      onClick={() => !isDisabled && handleTrackClick(social.trackType)}
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

            {/* Services */}
            {activeServicesArr.length > 0 && (
              <div className="w-full">
                <div className="flex items-center gap-3 mb-5">
                  <span className={cn("text-[10px] font-black uppercase tracking-[0.2em]", isPro && data.background_video_url ? "text-white/60" : "text-slate-400")}>Serviços</span>
                  <div className={cn("h-[1px] flex-1", isPro && data.background_video_url ? "bg-white/20" : "bg-slate-200 dark:bg-slate-800")} />
                </div>
                
                {mainService && (
                   <motion.div
                     initial={{ opacity: 0, y: 10 }}
                     animate={{ opacity: 1, y: 0 }}
                     whileHover={{ scale: 1.02, x: 5 }}
                     className={cn(
                       "w-full px-5 py-4 rounded-3xl flex items-center gap-4 mb-4 transition-all cursor-pointer",
                       isPro 
                         ? "bg-white/5 backdrop-blur-2xl border border-white/10 hover:bg-white/10 shadow-lg group/srv"
                         : "bg-white border border-slate-100"
                     )}
                   >
                     <div className={cn("w-10 h-10 rounded-2xl flex items-center justify-center text-white shadow-lg shrink-0", isPro ? "bg-gradient-to-br from-primary to-blue-600" : "bg-slate-900")}>
                        {(() => {
                          const Icon = ICON_MAP[mainService.icon || 'Sparkles'] || Sparkles;
                          return <Icon className="w-5 h-5" />;
                        })()}
                     </div>
                     <span className={cn("font-bold uppercase tracking-wide text-sm leading-tight", isPro ? "text-white" : "text-slate-900")}>{mainService.name}</span>
                   </motion.div>
                )}

                {secondaryServices.length > 0 && (
                   <div className="grid grid-cols-1 gap-3">
                     {secondaryServices.map((service, i) => {
                        const Icon = ICON_MAP[service.icon || 'Sparkles'] || Sparkles;
                        return (
                          <motion.div 
                            key={i} 
                            whileHover={isPro ? { x: 5, backgroundColor: 'rgba(255,255,255,0.08)' } : {}}
                            className={cn(
                              "w-full px-5 py-4 rounded-2xl flex items-center gap-4 border transition-all cursor-pointer",
                              isPro 
                                ? "bg-white/[0.03] backdrop-blur-md border-white/5" 
                                : "bg-slate-50 border-slate-100"
                            )}>
                             <div className={cn("w-8 h-8 rounded-xl flex items-center justify-center shrink-0", isPro ? "bg-white/5" : "bg-slate-100")}>
                                <Icon className={cn("w-4 h-4", isPro ? "text-white/60" : "text-slate-500")} />
                             </div>
                             <span className={cn("text-xs font-semibold tracking-wide uppercase", isPro ? "text-white/90" : "text-slate-700 dark:text-slate-300")}>{service.name}</span>
                          </motion.div>
                        );
                     })}
                   </div>
                )}
              </div>
            )}

            {/* Custom Links (Pro Only) */}
            {isPro && customLinks.length > 0 && (
              <div className="w-full space-y-3">
                <div className="flex items-center gap-3 mb-2">
                  <span className={cn("text-[10px] font-black uppercase tracking-[0.2em]", data.background_video_url ? "text-white/60" : "text-slate-400")}>Links Úteis</span>
                  <div className={cn("h-[1px] flex-1", data.background_video_url ? "bg-white/20" : "bg-slate-200 dark:bg-slate-800")} />
                </div>
                <div className="grid gap-3">
                  {customLinks.map((link, i) => (
                    <motion.a
                      key={i}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      href={link.url.startsWith('http') ? link.url : `https://${link.url}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={cn(
                        "w-full px-4 py-4 rounded-2xl flex items-center justify-center text-center gap-3 border transition-all text-sm font-bold shadow-sm",
                        data.background_video_url 
                          ? "bg-white/10 backdrop-blur-xl border-white/20 text-white hover:bg-white/20" 
                          : "bg-white border-slate-100 hover:border-primary/30 text-slate-800"
                      )}
                    >
                      <span className="truncate">{link.title}</span>
                    </motion.a>
                  ))}
                </div>
              </div>
            )}
            
            {/* Branding Footer */}
            {showBranding && (
               <div className="mt-auto py-6 text-center">
                 <a href="/" className={cn("inline-flex items-center gap-1.5 text-[10px] uppercase font-black tracking-[0.2em] transition-colors opacity-60 hover:opacity-100", 
                   isPro && data.background_video_url ? "text-white/60 hover:text-white" : "text-slate-400 hover:text-primary")}>
                   Criado com <span className={cn(isPro && data.background_video_url ? "text-white" : "text-slate-900 dark:text-white")}>Konnexy</span>
                 </a>
               </div>
            )}
          </div>
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
