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
        // OFFICIAL KONNEXY DIGITAL FIELD STYLE
        return "konnexy-digital-field text-white border-white/10 shadow-[inset_0_0_60px_rgba(59,130,246,0.1)]";
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
          icon: Zap,
          cta: 'Chamar no WhatsApp',
          shape: 'polygon(40% 0%, 100% 0%, 65% 45%, 95% 45%, 30% 100%, 45% 55%, 15% 55%)'
        };
      case 'barber':
        return { 
          gradient: 'linear-gradient(135deg, #111 0%, #d4af37 100%)', 
          accent: '#d4af37', 
          label: 'Mestre da Lâmina',
          icon: Scissors,
          cta: 'Agende seu horário',
          shape: 'polygon(50% 50%, 80% 0%, 100% 0%, 55% 52%, 100% 100%, 80% 100%, 52% 55%, 35% 72%, 35% 92%, 25% 100%, 8% 100%, 0% 88%, 0% 68%, 18% 58%, 28% 58%, 32% 54%, 28% 50%, 12% 50%, 0% 38%, 0% 12%, 8% 0%, 25% 0%, 35% 8%, 35% 38%)'
        };
      case 'cleaner':
        return { 
          gradient: 'linear-gradient(135deg, #0ea5e9 0%, #e0f2fe 100%)', 
          accent: '#0ea5e9', 
          label: 'Brilho Máximo',
          icon: Sparkles,
          cta: 'Solicitar Faxina',
          shape: 'polygon(50% 0%, 61% 39%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 39%)' 
        };
      case 'mechanic':
        return { 
          gradient: 'linear-gradient(135deg, #334155 0%, #f97316 100%)', 
          accent: '#f97316', 
          label: 'Turbo Mecânica',
          icon: Wrench,
          cta: 'Pedir Orçamento',
          shape: 'polygon(50% 0%, 62% 4%, 65% 15%, 82% 16%, 86% 26%, 96% 36%, 96% 46%, 100% 50%, 96% 54%, 96% 64%, 86% 74%, 82% 84%, 65% 84%, 62% 96%, 50% 100%, 38% 96%, 35% 84%, 18% 84%, 14% 74%, 4% 64%, 4% 54%, 0% 50%, 4% 46%, 4% 36%, 14% 26%, 18% 16%, 35% 15%, 38% 4%)'
        };
      case 'plumber':
        return { 
          gradient: 'linear-gradient(135deg, #1d4ed8 0%, #60a5fa 100%)', 
          accent: '#2563eb',
          label: 'SOS Hidráulica',
          icon: Hammer,
          cta: 'Falar com Encanador',
          shape: 'polygon(50% 0%, 75% 15%, 90% 40%, 100% 65%, 90% 90%, 70% 100%, 30% 100%, 10% 90%, 0% 65%, 10% 40%, 25% 15%)'
        };
      case 'health':
        return { 
          gradient: 'linear-gradient(135deg, #ef4444 0%, #fee2e2 100%)', 
          accent: '#ef4444', 
          label: 'Sempre com Você',
          icon: Stethoscope,
          cta: 'Marcar agora',
          shape: 'polygon(30% 0%, 70% 0%, 70% 30%, 100% 30%, 100% 70%, 70% 70%, 70% 100%, 30% 100%, 30% 70%, 0% 70%, 0% 30%, 30% 30%)'
        };
      case 'law':
        return { 
          gradient: 'linear-gradient(135deg, #0f172a 0%, #eab308 100%)', 
          accent: '#eab308', 
          label: 'Defesa Especializada',
          icon: Scale,
          cta: 'Direito Já',
          shape: 'polygon(10% 0%, 50% 10%, 90% 0%, 100% 5%, 100% 85%, 50% 100%, 0% 85%, 0% 5%)'
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
      case 'pet':
        return { 
          gradient: 'linear-gradient(135deg, #7c2d12 0%, #fb923c 100%)', 
          accent: '#fb923c',
          label: 'Amo meu Pet',
          icon: Heart,
          cta: 'Banho e Tosa',
          shape: 'polygon(50% 40%, 70% 10%, 85% 15%, 80% 45%, 100% 55%, 90% 85%, 50% 100%, 10% 85%, 0% 55%, 20% 45%, 15% 15%, 30% 10%)'
        };
      case 'business':
        return { 
          gradient: 'linear-gradient(135deg, #1e293b 0%, #64748b 100%)', 
          accent: '#64748b', 
          label: 'Foco em Resultados',
          icon: Briefcase,
          cta: 'Falar com Consultor',
          shape: 'polygon(25% 18%, 25% 0%, 35% 0%, 65% 0%, 75% 0%, 75% 18%, 100% 18%, 100% 90%, 94% 100%, 6% 100%, 0% 90%, 0% 18%)'
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
          {/* --- BACKGROUND LAYER (Video or Digital Field) --- */}
          <div 
            className="absolute inset-0 z-0"
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
                 <div className="absolute inset-0 bg-black/40 backdrop-blur-[1px]" />
                 <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-slate-950 to-transparent opacity-80" />
               </>
             ) : (
               <div 
                 className={cn(
                   "w-full h-full transition-colors duration-500 relative",
                   isPro ? "konnexy-digital-field" : "bg-white dark:bg-slate-950"
                 )}
               >
                 {!isPro && (
                   <div className="absolute inset-0 bg-slate-50 dark:bg-slate-900/50" />
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
                {/* ── KONNEXY AURA (Digital Aura + Border Effects + Profession) ── */}
                {(() => {
                  const effect = data.photo_border_effect || 'none';
                  const themeColor = data.theme_color || '#2563EB';
                  const hasEffect = effect !== 'none';
                  const profAccent = profConfig?.accent || '#00D4FF';
                  const ProfIcon = profConfig?.icon;

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
                    if (!profConfig || !isPro) return null;
                    const frame = data.avatar_frame;

                    switch (frame) {
                      // ⚡ Eletricista — faíscas elétricas que tremem
                      case 'electrician':
                        return (
                          <>
                            {/* Anel elétrico piscante */}
                            <div className="absolute rounded-full z-[6]" style={{
                              inset: '-4px',
                              border: `2px solid ${profAccent}`,
                              animation: 'electric-flicker 0.4s ease-in-out infinite',
                              boxShadow: `0 0 12px ${profAccent}80, 0 0 24px ${profAccent}30`,
                            }} />
                            {/* Faíscas em 6 pontos */}
                            {[0, 60, 120, 180, 240, 300].map((deg, i) => (
                              <div key={i} className="absolute z-[7] w-0.5 rounded-full"
                                style={{
                                  height: `${8 + (i % 3) * 5}px`,
                                  background: `linear-gradient(to top, ${profAccent}, transparent)`,
                                  top: '50%', left: '50%',
                                  transformOrigin: '0 0',
                                  transform: `rotate(${deg}deg) translateX(52px) translateY(-50%)`,
                                  animation: `electric-spark ${0.3 + i * 0.07}s ease-out infinite`,
                                  animationDelay: `${i * 0.08}s`,
                                }}
                              />
                            ))}
                          </>
                        );

                      // ✂️ Barbearia — dois anéis tracejados contra-rotativos
                      case 'barber':
                        return (
                          <>
                            <div className="absolute rounded-full z-[6]" style={{
                              inset: '-8px',
                              border: `2px dashed ${profAccent}`,
                              animation: 'aura-spin 5s linear infinite',
                            }} />
                            <div className="absolute rounded-full z-[6]" style={{
                              inset: '-16px',
                              border: `1.5px dashed ${profAccent}50`,
                              animation: 'aura-spin 9s linear infinite reverse',
                            }} />
                            {/* Pontinhos nos quadrantes como marcas de tesoura */}
                            {[45, 135, 225, 315].map((deg, i) => (
                              <div key={i} className="absolute w-2 h-2 rounded-full z-[7]"
                                style={{
                                  background: profAccent,
                                  top: '50%', left: '50%',
                                  boxShadow: `0 0 6px ${profAccent}`,
                                  transform: `rotate(${deg}deg) translateX(50px) translateY(-50%)`,
                                  animation: 'aura-spin 5s linear infinite',
                                  animationDelay: `${-i * 1.25}s`,
                                }}
                              />
                            ))}
                          </>
                        );

                      // 🫧 Limpeza — bolhas subindo
                      case 'cleaner':
                        return (
                          <>
                            {[...Array(9)].map((_, i) => (
                              <div key={i} className="absolute rounded-full z-[6]"
                                style={{
                                  width:  `${7 + (i % 4) * 3}px`,
                                  height: `${7 + (i % 4) * 3}px`,
                                  background: `${profAccent}40`,
                                  border: `1.5px solid ${profAccent}80`,
                                  bottom: `${5 + (i * 10) % 55}%`,
                                  left:   `${8 + (i * 19) % 75}%`,
                                  animation: `bubble-rise ${1.4 + (i % 4) * 0.5}s ease-in-out infinite`,
                                  animationDelay: `${i * 0.25}s`,
                                }}
                              />
                            ))}
                          </>
                        );

                      // ⚙️ Mecânico — engrenagem girante com dois anéis
                      case 'mechanic':
                        return (
                          <>
                            {/* Anel externo com tracejado de dentes */}
                            <div className="absolute rounded-full z-[6]" style={{
                              inset: '-10px',
                              border: `4px solid transparent`,
                              borderTopColor: profAccent,
                              borderBottomColor: profAccent,
                              borderLeftColor:  `${profAccent}40`,
                              borderRightColor: `${profAccent}40`,
                              animation: 'aura-spin 2s linear infinite',
                              boxShadow: `0 0 8px ${profAccent}40`,
                            }} />
                            <div className="absolute rounded-full z-[6]" style={{
                              inset: '-20px',
                              border: `2px dashed ${profAccent}30`,
                              animation: 'aura-spin 5s linear infinite reverse',
                            }} />
                            {/* Parafusos nos 4 pontos */}
                            {[0, 90, 180, 270].map((deg, i) => (
                              <div key={i} className="absolute w-2 h-2 rounded-full z-[7]"
                                style={{
                                  background: profAccent,
                                  top: '50%', left: '50%',
                                  transform: `rotate(${deg}deg) translateX(54px) translateY(-50%)`,
                                  animation: 'aura-spin 2s linear infinite',
                                  animationDelay: `${-i * 0.5}s`,
                                  boxShadow: `0 0 4px ${profAccent}`,
                                }}
                              />
                            ))}
                          </>
                        );

                      // 💧 Encanador — ondas de água se expandindo
                      case 'plumber':
                        return (
                          <>
                            {[0, 1, 2, 3].map((i) => (
                              <div key={i} className="absolute rounded-full z-[6]"
                                style={{
                                  inset: 0,
                                  border: `2px solid ${profAccent}`,
                                  animation: `water-ripple 2s ease-out infinite`,
                                  animationDelay: `${i * 0.5}s`,
                                }}
                              />
                            ))}
                          </>
                        );

                      // ❤️ Saúde — batimento cardíaco duplo-pulso
                      case 'health':
                        return (
                          <>
                            {/* Anel que bate como coração */}
                            <div className="absolute rounded-full z-[6]"
                              style={{
                                inset: '-3px',
                                border: `2.5px solid ${profAccent}`,
                                animation: 'heartbeat 1.2s ease-in-out infinite',
                                boxShadow: `0 0 10px ${profAccent}60`,
                              }}
                            />
                            {/* Rings que se expandem como ECG */}
                            {[0, 1].map((i) => (
                              <div key={i} className="absolute rounded-full z-[5]"
                                style={{
                                  inset: 0,
                                  border: `1.5px solid ${profAccent}80`,
                                  animation: `heartbeat-ring 1.2s ease-out infinite`,
                                  animationDelay: `${i * 0.6}s`,
                                }}
                              />
                            ))}
                          </>
                        );

                      // ⚖️ Direito — partículas douradas orbitando + anel que balança
                      case 'law':
                        return (
                          <>
                            <div className="absolute rounded-full z-[5]" style={{
                              inset: '-8px',
                              border: `1.5px solid ${profAccent}40`,
                              animation: 'scale-rock 3s ease-in-out infinite',
                            }} />
                            {[0, 1, 2, 3].map((i) => (
                              <div key={i} className="absolute w-2 h-2 rounded-full z-[7]"
                                style={{
                                  background: profAccent,
                                  top: '50%', left: '50%',
                                  transformOrigin: '-58px 0',
                                  animation: `gold-orbit 6s linear infinite`,
                                  animationDelay: `${-i * 1.5}s`,
                                  boxShadow: `0 0 8px ${profAccent}`,
                                }}
                              />
                            ))}
                          </>
                        );

                      // 💻 TI — linha de scan digital + cantos de bracket
                      case 'tech':
                        return (
                          <>
                            {/* Scan line inside clipped circle */}
                            <div className="absolute rounded-full overflow-hidden z-[6]" style={{ inset: 0 }}>
                              <div className="absolute left-0 right-0 h-[2px]"
                                style={{
                                  background: `linear-gradient(90deg, transparent, ${profAccent}CC, transparent)`,
                                  animation: 'scan-line 2s linear infinite',
                                  boxShadow: `0 0 8px ${profAccent}`,
                                }}
                              />
                            </div>
                            {/* Corner brackets */}
                            {([
                              { cls: 'top-0 left-0',   br: '4px 0 0 0',   bw: '2px 0 0 2px' },
                              { cls: 'top-0 right-0',  br: '0 4px 0 0',   bw: '2px 2px 0 0' },
                              { cls: 'bottom-0 left-0',br: '0 0 0 4px',   bw: '0 0 2px 2px' },
                              { cls: 'bottom-0 right-0',br:'0 0 4px 0',   bw: '0 2px 2px 0' },
                            ] as const).map(({ cls, br, bw }, i) => (
                              <div key={i} className={`absolute w-5 h-5 z-[7] ${cls}`}
                                style={{
                                  borderColor: profAccent,
                                  borderStyle: 'solid',
                                  borderWidth: bw,
                                  borderRadius: br,
                                  animation: `digital-blink 2s ease-in-out infinite`,
                                  animationDelay: `${i * 0.5}s`,
                                }}
                              />
                            ))}
                          </>
                        );

                      // 🐾 Petshop — corações e patinhas flutuando
                      case 'pet':
                        return (
                          <>
                            {['🐾','❤️','🐾','🐟','❤️','🐾'].map((emoji, i) => (
                              <div key={i} className="absolute z-[6] select-none pointer-events-none"
                                style={{
                                  bottom: `${8 + (i * 13) % 45}%`,
                                  left:   `${6 + (i * 21) % 82}%`,
                                  fontSize: `${10 + (i % 3) * 4}px`,
                                  animation: `pet-float ${1.5 + (i % 3) * 0.6}s ease-out infinite`,
                                  animationDelay: `${i * 0.35}s`,
                                }}
                              >
                                {emoji}
                              </div>
                            ))}
                          </>
                        );

                      // 💼 Negócios — ponto profissional orbitando + anel sólido
                      case 'business':
                        return (
                          <>
                            <div className="absolute rounded-full z-[5]" style={{
                              inset: '-8px',
                              border: `1px solid ${profAccent}30`,
                            }} />
                            {[0, 1].map((i) => (
                              <div key={i} className="absolute w-2.5 h-2.5 rounded-full z-[7]"
                                style={{
                                  background: `linear-gradient(135deg, ${profAccent}, white)`,
                                  top: '50%', left: '50%',
                                  transformOrigin: '-60px 0',
                                  animation: `biz-orbit ${5 + i * 3}s linear infinite`,
                                  animationDelay: `${-i * 2.5}s`,
                                  boxShadow: `0 0 8px ${profAccent}80`,
                                }}
                              />
                            ))}
                          </>
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
                              background: profConfig
                                ? `conic-gradient(from 0deg, ${profAccent}, ${profConfig.gradient.includes('#') ? profConfig.gradient.split('#')[2] ? '#' + profConfig.gradient.split('#')[2].slice(0,6) : profAccent : profAccent}, ${profAccent})`
                                : 'conic-gradient(from 0deg, #00D4FF, #3B82F6, #22D3EE, #00D4FF)',
                            }}
                          />
                          {/* Arc: profession color */}
                          <div
                            className="aura-arc"
                            style={{
                              borderTopColor:   profConfig ? profAccent : '#00D4FF',
                              borderRightColor: profConfig ? profAccent : '#3B82F6',
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
                                background:      profConfig ? profAccent : '#00D4FF',
                              }}
                            />
                          ))}
                          {/* Profissão: animação temática */}
                          {renderProfAnim()}
                        </>
                      )}

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
                        !hasEffect && isPro && profConfig
                          ? "border-[3px]"
                          : !hasEffect && isPro
                          ? "border-4 border-white/40 ring-4 ring-konnexy-cian/20"
                          : "border-4 border-white/10"
                      )}
                      style={!hasEffect && isPro && profConfig ? { borderColor: profAccent + '80' } : {}}
                      >
                        {data.photo_url ? (
                          <Image
                            src={data.photo_url}
                            alt={data.name || 'Avatar'}
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
                          style={{ background: profConfig!.gradient }}
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
                   {data.name || 'Seu Nome'}
                 </h1>
                 <p className={cn(
                   "text-sm md:text-base font-medium leading-relaxed opacity-90 mb-3 text-center max-w-[280px]",
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
                    "w-full h-16 rounded-[1.2rem] font-black text-lg transition-all flex items-center justify-center gap-3 group/btn overflow-hidden relative border-none",
                    isPro 
                      ? "text-white shadow-[0_20px_40px_rgba(37,99,235,0.4)]"
                      : "bg-slate-900 hover:bg-slate-800 text-white shadow-none"
                  )}
                  style={{ 
                    background: isPro ? 'linear-gradient(135deg, #00D4FF 0%, #2563EB 50%, #6D28D9 100%)' : undefined,
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
                       {isPro ? (data.cta_text || profConfig?.cta || 'Falar no WhatsApp') : 'WhatsApp'}
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
                            isPro ? "bg-white/10 text-konnexy-cian" : "bg-slate-100 dark:bg-slate-800 text-primary"
                          )}>
                             <Icon className="w-6 h-6" />
                          </div>
                          <div className="flex flex-col gap-1">
                            <span className={cn("text-sm font-bold tracking-tight", isPro ? "text-white" : "text-slate-900 dark:text-white")}>
                              {service.name}
                            </span>
                          </div>
                       </motion.div>
                     );
                  })}
                </div>
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
            
            {/* Branding Footer (Assinatura de Marca) */}
            {showBranding && (
               <div className="mt-auto pt-8 pb-4 text-center">
                 <a href="/" className={cn("inline-flex flex-col items-center gap-1.5 transition-all opacity-40 hover:opacity-100", 
                   isPro ? "text-white/60 hover:text-white" : "text-slate-400 hover:text-primary")}>
                   <span className="text-[9px] uppercase font-black tracking-[0.3em]">Powered by</span>
                   <span className={cn("text-xs font-black tracking-tight", isPro ? "text-white" : "text-slate-900 dark:text-white")}>KONNEXY™</span>
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
