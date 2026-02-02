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
  Sparkles
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
import { trackEvent, AnalyticsEventType } from '@/app/actions/analytics';
import { toast } from 'sonner';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import { Download, Image as ImageIcon } from 'lucide-react';

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
  
  const cleanWhatsapp = data.whatsapp?.replace(/\D/g, '') || '';
  const formattedWhatsapp = cleanWhatsapp.startsWith('55') ? cleanWhatsapp : `55${cleanWhatsapp}`;
  
  const whatsappLink = cleanWhatsapp
    ? `https://wa.me/${formattedWhatsapp}?text=${encodeURIComponent(`Olá! Vi seu perfil na Konnexy e gostaria de ${isPro ? 'solicitar um orçamento' : 'conversar'} sobre seus serviços.`)}`
    : '#';

  const socialLinks = [
    { id: 'instagram', icon: Instagram, value: data.instagram, url: `https://instagram.com/${data.instagram}`, label: 'Instagram', trackType: 'click_instagram' as const },
    { id: 'linkedin', icon: Linkedin, value: data.linkedin, url: `https://linkedin.com/in/${data.linkedin}`, label: 'LinkedIn', trackType: 'click_linkedin' as const },
    { id: 'facebook', icon: Facebook, value: data.facebook, url: `https://facebook.com/${data.facebook}`, label: 'Facebook', trackType: 'click_facebook' as const },
    { id: 'twitter', icon: Twitter, value: data.twitter, url: `https://twitter.com/${data.twitter}`, label: 'Twitter', trackType: 'click_twitter' as const },
    { id: 'youtube', icon: Youtube, value: data.youtube, url: `https://youtube.com/@${data.youtube}`, label: 'YouTube', trackType: 'click_youtube' as const },
    { id: 'website', icon: Globe, value: data.website, url: data.website?.startsWith('http') ? data.website : `https://${data.website}`, label: 'Website', trackType: 'click_website' as const },
  ];

  // All valid links (those with a value)
  const validSocialLinks = socialLinks.filter(s => s.value);
  
  // Logic: Pro sees everything. Free sees only 1st and others are disabled.
  const activeServicesLimit = isPro ? 20 : 5; // Increased limit for better grid demo
  const services = data.services?.filter(s => s.trim() !== '') || [];
  const activeServicesArr = services.slice(0, activeServicesLimit);
  
  const mainService = activeServicesArr[0];
  const secondaryServices = activeServicesArr.slice(1);

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
      case 'oled': return "bg-black text-white border-white/10";
      case 'glass': return "bg-white/5 backdrop-blur-3xl border-white/20";
      case 'minimalist': return "bg-white text-slate-900 border-slate-100 shadow-none";
      default: 
        if (hasVideo) return "bg-black/20 backdrop-blur-2xl text-white border-white/10";
        return "bg-white dark:bg-slate-950 text-slate-900 dark:text-white";
    }
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
            "relative overflow-hidden rounded-[2.5rem] transition-all duration-500",
            getThemeClasses(),
            isPro 
              ? "border-2 border-primary/10 shadow-[0_50px_100px_-20px_rgba(0,0,0,0.25)] ring-1 ring-primary/5" 
              : "border border-slate-200 dark:border-slate-800 shadow-sm"
          )}
        >
          {/* Pro Background Video */}
          {isPro && data.background_video_url && (
            <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none opacity-30 blur-sm">
              <video 
                key={data.background_video_url}
                autoPlay 
                muted 
                loop 
                playsInline 
                className="w-full h-full object-cover"
              >
                <source src={data.background_video_url} type="video/mp4" />
              </video>
              <div className="absolute inset-0 bg-black/40" />
            </div>
          )}

          {/* Pro Background Enhancements */}
          {isPro && !data.background_video_url && data.theme_style !== 'minimalist' && (
            <>
              {/* Subtle Animated Gradient Background for Body */}
              <div className="absolute inset-0 opacity-[0.03] transition-opacity duration-1000">
                <div className="absolute top-0 right-0 w-64 h-64 bg-primary blur-[100px] rounded-full animate-pulse" />
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-600 blur-[100px] rounded-full animate-pulse-slow" />
              </div>
              
              {/* Pattern Texture Overlay */}
              <div className="absolute inset-0 opacity-[0.05] pointer-events-none mix-blend-overlay" 
                   style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg width='20' height='20' viewBox='0 0 20 20' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%239C92AC' fill-opacity='0.4' fill-rule='evenodd'%3E%3Ccircle cx='3' cy='3' r='3'/%3E%3Ccircle cx='13' cy='13' r='3'/%3E%3C/g%3E%3C/svg%3E")` }} 
              />
              
              {/* Large Subtle Illustrative Icon */}
              <div className="absolute -bottom-10 -right-10 opacity-10 blur-sm pointer-events-none">
                <Sparkles className="w-64 h-64 text-slate-400 rotate-12" />
              </div>
            </>
          )}
          
          {/* Header */}
          <div 
            className={cn(
              "h-28 relative overflow-hidden transition-all duration-700",
              data.theme_style === 'glass' && "bg-transparent backdrop-blur-sm"
            )}
            style={{ 
              backgroundColor: data.theme_style === 'glass' ? undefined : (data.theme_color || (isPro ? '#3b82f6' : '#f1f5f9')),
              backgroundImage: isPro && data.theme_style !== 'minimalist' && data.theme_style !== 'glass' 
                ? `linear-gradient(135deg, ${data.theme_color || '#3b82f6'} 0%, #1e293b 100%)` 
                : 'none'
            }}
          >
            {isPro && (
              <>
                <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_30%_20%,_white_0%,_transparent_60%)]" />
                <div className="absolute top-0 inset-x-0 h-full bg-gradient-to-b from-black/20 to-transparent" />
                
                {/* Decorative Elements for Pro */}
                <div className="absolute -top-4 -left-4 w-24 h-24 bg-white/10 rounded-full blur-2xl" />
                <div className="absolute top-2 left-6 w-12 h-1 bg-white/20 rounded-full blur-sm" />
                
                <div className="absolute top-4 right-5 flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-black/30 backdrop-blur-xl border border-white/20 text-white text-[10px] font-black uppercase tracking-[0.2em] shadow-2xl">
                  <BadgeCheck className="w-3.5 h-3.5 text-blue-400" />
                  Premium
                </div>
              </>
            )}
            
            {!isPro && (
              <div className="absolute top-4 right-5 px-3 py-1 rounded-full bg-slate-200/50 text-slate-500 text-[9px] font-bold uppercase tracking-wider">
                Digital Free
              </div>
            )}
          </div>

          {/* Profile Content Area */}
          <div className="px-6 pb-10 -mt-14 relative z-10 flex flex-col items-center">
            
            {/* Avatar */}
            <div className="relative mb-6">
              <motion.div 
                whileHover={isPro ? { scale: 1.05 } : {}}
                className={cn(
                  "w-28 h-28 rounded-[2rem] bg-white dark:bg-slate-900 p-1.5 relative overflow-hidden transition-all duration-500",
                  isPro 
                    ? "shadow-[0_25px_50px_-12px_rgba(0,0,0,0.4)] ring-4 ring-primary/30 ring-offset-4 ring-offset-white dark:ring-offset-slate-950" 
                    : "shadow-md border border-slate-100 dark:border-slate-800"
                )}
              >
                {/* Glow for Pro */}
                {isPro && (
                  <div className="absolute inset-0 bg-gradient-to-tr from-primary/30 to-transparent animate-pulse" />
                )}
                
                <div className="w-full h-full rounded-[1.7rem] overflow-hidden bg-slate-100 dark:bg-slate-800 flex items-center justify-center border border-slate-100 dark:border-slate-700/50">
                  {data.photo_url ? (
                    <Image
                      src={data.photo_url}
                      alt={data.name || 'Avatar'}
                      width={112}
                      height={112}
                      className="w-full h-full object-cover"
                      priority
                    />
                  ) : (
                    <span className="text-3xl font-bold text-slate-400">
                      {data.name?.charAt(0) || '?'}
                    </span>
                  )}
                </div>
              </motion.div>
              
              {/* Verified Badge Overlay (Pro Only) */}
              {isPro && (
                <motion.div 
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.4 }}
                  className="absolute -bottom-1 -right-1 bg-blue-500 text-white rounded-xl p-1.5 shadow-lg border-2 border-white dark:border-slate-900 z-20"
                >
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <BadgeCheck className="w-4 h-4" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Profissional Verificado</p>
                    </TooltipContent>
                  </Tooltip>
                </motion.div>
              )}
            </div>

            {/* Identity & Visual Hierarchy */}
            <div className="text-center mb-8 w-full">
              <h1 
                className={cn(
                  "text-xl sm:text-2xl font-black tracking-tight mb-1 capitalize break-words",
                  (isPro && (data.background_video_url || data.theme_style === 'oled' || data.theme_style === 'glass')) ? "text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)]" : "text-slate-900 dark:text-white"
                )}
              >
                {data.name || 'Seu Nome'}
              </h1>
              <p 
                className={cn(
                  "text-sm font-bold leading-relaxed px-4 break-words",
                  (isPro && (data.background_video_url || data.theme_style === 'oled' || data.theme_style === 'glass')) ? "text-white/80 drop-shadow-[0_1px_2px_rgba(0,0,0,0.5)]" : "text-slate-600 dark:text-slate-400 opacity-80"
                )}
              >
                {data.tagline || 'Sua profissão ou frase de impacto'}
              </p>
              
              {data.city && (
                <div className="flex items-center justify-center gap-1.5 mt-3 text-[11px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em] text-center px-4">
                  <MapPin className="w-3 h-3 flex-shrink-0" />
                  <span className="truncate">{data.city}</span>
                </div>
              )}
            </div>

            {/* Structured Services Section */}
            {activeServicesArr.length > 0 && (
              <div className="w-full mb-8">
                <div className="flex items-center gap-2 mb-4 px-1">
                  <div className="h-[1px] flex-1 bg-slate-100 dark:bg-slate-800" />
                  <span className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">Serviços</span>
                  <div className="h-[1px] flex-1 bg-slate-100 dark:bg-slate-800" />
                </div>
                
                {/* Main Service (Featured) */}
                {mainService && (() => {
                  const getServiceIcon = (text: string) => {
                    const t = text.toLowerCase();
                    if (t.includes('advoc') || t.includes('direit') || t.includes('jurid')) return <Globe className="w-6 h-6" />;
                    if (t.includes('saud') || t.includes('medic') || t.includes('dentist') || t.includes('psico')) return <BadgeCheck className="w-6 h-6" />;
                    if (t.includes('tech') || t.includes('dev') || t.includes('soft') || t.includes('ti')) return <Globe className="w-6 h-6" />;
                    if (t.includes('market') || t.includes('venda') || t.includes('social')) return <Send className="w-6 h-6" />;
                    return <Sparkles className="w-6 h-6" />;
                  };

                  return (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={cn(
                        "w-full p-4 mb-3 rounded-2xl flex items-center justify-between group transition-all duration-300",
                        isPro 
                          ? (data.background_video_url 
                              ? "bg-white/10 backdrop-blur-xl border border-white/20 shadow-xl hover:bg-white/15" 
                              : "bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 shadow-sm hover:shadow-md")
                          : "bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800"
                      )}
                    >
                      <div className="flex items-center gap-4">
                        <div className={cn(
                          "w-12 h-12 rounded-xl flex items-center justify-center transition-colors",
                          isPro ? "bg-primary/10" : "bg-slate-200 dark:bg-slate-800 text-slate-400"
                        )} style={{ color: isPro ? (data.theme_color || '#3b82f6') : undefined }}>
                          {getServiceIcon(mainService)}
                        </div>
                        <div className="flex flex-col">
                          <span className="text-[9px] font-black uppercase tracking-widest mb-0.5" style={{ color: data.theme_color || '#3b82f6' }}>Destaque</span>
                          <span className="text-sm font-black text-slate-900 dark:text-white uppercase">{mainService}</span>
                        </div>
                      </div>
                    </motion.div>
                  );
                })()}

                {/* Secondary Services Grid */}
                {secondaryServices.length > 0 && (
                  <div className="grid grid-cols-2 gap-3 pb-2">
                    {secondaryServices.map((service, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.1 + (i * 0.05) }}
                        className={cn(
                          "p-3 rounded-2xl flex flex-col gap-2 transition-all duration-300",
                          isPro 
                            ? (data.background_video_url 
                                ? "bg-white/10 backdrop-blur-xl border border-white/20 shadow-xl hover:bg-white/15" 
                                : "bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 shadow-sm hover:shadow-md")
                            : "bg-slate-50/50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800"
                        )}
                      >
                        <div className={cn(
                          "w-8 h-8 rounded-lg flex items-center justify-center",
                          isPro ? "bg-slate-100 dark:bg-white/10 text-slate-500" : "bg-slate-200/50 dark:bg-slate-800 text-slate-400"
                        )}>
                          <div className="w-1.5 h-1.5 rounded-full bg-current" />
                        </div>
                        <span className="text-xs font-bold text-slate-700 dark:text-slate-300 line-clamp-2 leading-tight uppercase">
                          {service}
                        </span>
                      </motion.div>
                    ))}
                    
                    {/* Upgrade Placeholder for Free */}
                    {!isPro && services.length > 5 && (
                      <div className="p-3 rounded-2xl border-2 border-dashed border-slate-100 dark:border-slate-800 flex items-center justify-center bg-slate-50/20">
                         <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">+{services.length - 5} Mais</span>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* Action Stack */}
            <div className="w-full space-y-4">
              {/* Main Conversion Button (WhatsApp) */}
              <motion.div 
                whileHover={isPro ? { scale: 1.02, y: -2 } : {}} 
                whileTap={isPro ? { scale: 0.98 } : {}}
                className="w-full"
              >
                <Button
                  variant="default"
                  size="lg"
                  className={cn(
                    "w-full h-[72px] rounded-2xl font-black text-lg transition-all flex items-center justify-center gap-3",
                    isPro 
                      ? "text-white shadow-xl hover:brightness-110 active:translate-y-1"
                      : "bg-slate-900 hover:bg-slate-800 text-white shadow-none border-0"
                  )}
                  style={{ 
                    backgroundColor: isPro ? (data.theme_color || '#25D366') : undefined,
                    boxShadow: isPro ? `0 20px 40px -10px ${data.theme_color}44` : undefined
                  }}
                  asChild
                  aria-label={isPro ? 'Solicitar Orçamento via WhatsApp' : 'Conversar via WhatsApp'}
                  onClick={() => handleTrackClick('click_whatsapp')}
                >
                  <a href={whatsappLink} target="_blank" rel="noopener noreferrer">
                    <MessageCircle className={cn("w-7 h-7 flex-shrink-0", isPro ? "fill-white" : "fill-white/80")} />
                    <div className="text-left flex flex-col leading-tight">
                      <span className={cn("text-[10px] uppercase tracking-[0.2em] font-black", isPro ? "opacity-80" : "opacity-60")}>
                        {isPro ? 'Contato Premium' : 'Contato'}
                      </span>
                      <span className="font-black">
                        {isPro ? 'Solicitar Orçamento' : 'WhatsApp'}
                      </span>
                    </div>
                  </a>
                </Button>
              </motion.div>

              {/* Social Links Bar */}
              <div className="flex items-center justify-between gap-2.5 pt-2">
                <div className="flex flex-wrap items-center gap-2.5">
                  {validSocialLinks.map((social, index) => {
                    const isDisabled = !isPro && index > 0;
                    
                    const LinkContent = (
                      <motion.a
                        key={social.id}
                        whileHover={isDisabled ? {} : { y: -3, backgroundColor: 'var(--slate-100)' }}
                        whileTap={isDisabled ? {} : { scale: 0.9 }}
                        href={isDisabled ? '#' : social.url}
                        target={isDisabled ? undefined : "_blank"}
                        rel={isDisabled ? undefined : "noopener noreferrer"}
                        aria-label={isDisabled ? `${social.label} (Disponível no Pro)` : `Visitar ${social.label}`}
                        onClick={() => !isDisabled && handleTrackClick(social.trackType)}
                        className={cn(
                          "w-12 h-12 flex items-center justify-center rounded-2xl transition-all shadow-sm relative overflow-hidden",
                          isPro 
                            ? "bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-600 dark:text-slate-300 hover:text-primary hover:border-primary/30"
                            : "bg-slate-100/50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-400 dark:text-slate-500",
                          isDisabled && "opacity-40 cursor-not-allowed grayscale"
                        )}
                      >
                        <social.icon className="w-5 h-5 flex-shrink-0" />
                        {isDisabled && (
                          <div className="absolute top-0 right-0 bg-slate-900 text-white p-0.5 rounded-bl-lg">
                            <Lock className="w-2.5 h-2.5" />
                          </div>
                        )}
                        {isPro && (
                           <div className="absolute inset-0 bg-gradient-to-tr from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                        )}
                      </motion.a>
                    );

                    if (isDisabled) {
                      return (
                        <Tooltip key={social.id}>
                          <TooltipTrigger asChild>
                            {LinkContent}
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Disponível no Plano Pro</p>
                          </TooltipContent>
                        </Tooltip>
                      );
                    }

                    return LinkContent;
                  })}
                </div>
                
                {/* PRO Controls: Download PDF & PNG */}
                  {isPro && !isDownloadMode && (
                    <div className="flex gap-2">
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button 
                            variant="outline" 
                            size="icon"
                            onClick={handleDownloadPNG}
                            className="bg-white/10 border-white/20 text-white hover:bg-white/20 rounded-xl"
                          >
                            <ImageIcon className="w-4 h-4" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>Baixar PNG (3k)</TooltipContent>
                      </Tooltip>

                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button 
                            variant="outline" 
                            size="icon"
                            onClick={handleDownloadPDF}
                            className="bg-white/10 border-white/20 text-white hover:bg-white/20 rounded-xl"
                          >
                            <Download className="w-4 h-4" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>Baixar PDF</TooltipContent>
                      </Tooltip>
                    </div>
                  )}
                <button
                  onClick={handleShare}
                  aria-label="Compartilhar Cartão"
                  className={cn(
                    "w-12 h-12 flex items-center justify-center rounded-2xl transition-all flex-shrink-0",
                    isPro
                      ? "bg-slate-50 dark:bg-slate-901 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                      : "bg-slate-50 dark:bg-slate-901 border border-slate-200 dark:border-slate-800 text-slate-400 dark:text-slate-500"
                  )}
                >
                  <Share2 className="w-5 h-5" />
                </button>

                {isPro && (
                  <button
                    onClick={handleDownloadPDF}
                    aria-label="Baixar PDF"
                    className="w-12 h-12 flex items-center justify-center rounded-2xl transition-all flex-shrink-0 bg-white dark:bg-slate-900 border-2 border-primary/20 text-primary hover:bg-primary hover:text-white"
                  >
                    <Download className="w-5 h-5" />
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Branding Footer */}
          {showBranding && (
            <div className={cn(
              "py-4 text-center border-t transition-all",
              isPro ? "opacity-0 h-0 p-0 overflow-hidden pointer-events-none" : "bg-slate-50/50 dark:bg-slate-950/50 border-slate-100 dark:border-slate-900"
            )}>
              {!isPro && (
                <a href="/" className="group inline-flex items-center gap-1.5 text-[9px] uppercase font-black tracking-[0.2em] text-slate-400 hover:text-primary transition-colors">
                  Crie o seu em 
                  <span className="text-slate-900 dark:text-white group-hover:text-primary transition-colors">Konnexy.com</span>
                </a>
              )}
            </div>
          )}
        </div>

        {/* Pro Upsell (Only for Free cards when viewed by owner/preview) */}
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
