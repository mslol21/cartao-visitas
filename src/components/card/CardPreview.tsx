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

interface CardPreviewProps {
  data: Partial<Profile>;
  showBranding?: boolean;
  suppressTracking?: boolean;
}

export function CardPreview({ data, showBranding = true, suppressTracking = false }: CardPreviewProps) {
  const isPro = data.plan === 'pro';

  const handleTrackClick = async (type: AnalyticsEventType) => {
    if (suppressTracking || !data.id) return;
    await trackEvent(data.id, type);
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
  const activeServicesLimit = isPro ? 20 : 3;
  const services = data.services?.filter(s => s.trim() !== '') || [];
  const activeServices = services.slice(0, activeServicesLimit);

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

  return (
    <TooltipProvider>
      <motion.div 
        initial={isPro ? { opacity: 0, y: 30, scale: 0.95 } : { opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ 
          duration: isPro ? 0.8 : 0.4, 
          ease: isPro ? [0.16, 1, 0.3, 1] : "easeOut" 
        }}
        className="w-full max-w-[380px] mx-auto group/card"
      >
        <div className={cn(
          "relative bg-white dark:bg-slate-950 overflow-hidden rounded-[2.5rem] transition-all duration-500",
          isPro 
            ? "border-2 border-primary/10 shadow-[0_40px_80px_-15px_rgba(59,130,246,0.15)] ring-1 ring-primary/5" 
            : "border border-slate-200 dark:border-slate-800 shadow-sm"
        )}>
          {/* Texture Overlay for Pro */}
          {isPro && (
            <div className="absolute inset-0 opacity-[0.03] pointer-events-none" 
                 style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%239C92AC' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")` }} 
            />
          )}
          
          {/* Header */}
          <div 
            className={cn(
              "h-28 relative overflow-hidden transition-all duration-700",
              !isPro && "saturate-50"
            )}
            style={{ 
              backgroundColor: !isPro ? '#f1f5f9' : (data.theme_color || '#3b82f6'),
              backgroundImage: isPro ? `linear-gradient(135deg, ${data.theme_color || '#3b82f6'} 0%, #1e293b 100%)` : 'none'
            }}
          >
            {isPro && (
              <>
                <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_30%_20%,_white_0%,_transparent_60%)]" />
                <div className="absolute top-0 inset-x-0 h-full bg-gradient-to-b from-black/20 to-transparent" />
                
                <div className="absolute top-4 right-5 flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-black/20 backdrop-blur-md border border-white/20 text-white text-[10px] font-bold uppercase tracking-[0.2em] shadow-lg">
                  <BadgeCheck className="w-3.5 h-3.5 text-blue-400" />
                  Pro
                </div>
              </>
            )}
            
            {!isPro && (
              <div className="absolute top-4 right-5 px-3 py-1 rounded-full bg-slate-200/50 text-slate-500 text-[9px] font-bold uppercase tracking-wider">
                Plano Gratuito
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
                    ? "shadow-[0_20px_40px_-10px_rgba(59,130,246,0.3)] ring-4 ring-primary/20 ring-offset-4 ring-offset-white dark:ring-offset-slate-950" 
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
              <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-white mb-1 capitalize break-words">
                {data.name || 'Seu Nome'}
              </h1>
              <p className="text-slate-600 dark:text-slate-400 text-sm font-medium leading-relaxed px-4 break-words">
                {data.tagline || 'Sua profissão ou frase de impacto'}
              </p>
              
              {data.city && (
                <div className="flex items-center justify-center gap-1.5 mt-3 text-[11px] font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider text-center px-4">
                  <MapPin className="w-3 h-3 flex-shrink-0" />
                  <span className="truncate">{data.city}</span>
                </div>
              )}
            </div>

            {/* Specialty Chips */}
            {activeServices.length > 0 && (
              <div className="flex flex-wrap justify-center gap-2 mb-8 px-2">
                <AnimatePresence>
                  {activeServices.map((service, i) => (
                    <motion.span
                      key={i}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.1 * i }}
                      className={cn(
                        "px-3 py-1.5 rounded-xl border text-[11px] font-bold whitespace-nowrap transition-all",
                        isPro 
                          ? "bg-primary/5 border-primary/20 text-primary"
                          : "bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300"
                      )}
                    >
                      {service.charAt(0).toUpperCase() + service.slice(1).toLowerCase()}
                    </motion.span>
                  ))}
                  {!isPro && services.length > 3 && (
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <motion.span
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 border border-dashed border-slate-300 dark:border-slate-700 text-[11px] font-bold text-slate-400 cursor-help"
                        >
                          +{services.length - 3} mais
                        </motion.span>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Disponível no Plano Pro</p>
                      </TooltipContent>
                    </Tooltip>
                  )}
                </AnimatePresence>
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
                      ? "bg-gradient-to-r from-[#25D366] to-[#128C7E] text-white shadow-[0_20px_40px_-10px_rgba(37,211,102,0.4)] border-b-4 border-[#0d6157] hover:brightness-110 active:border-b-0 active:translate-y-1"
                      : "bg-slate-100 hover:bg-slate-200 text-slate-900 border border-slate-200 shadow-none grayscale-[0.5]"
                  )}
                  asChild
                  aria-label={isPro ? 'Solicitar Orçamento via WhatsApp' : 'Conversar via WhatsApp'}
                  onClick={() => handleTrackClick('click_whatsapp')}
                >
                  <a href={whatsappLink} target="_blank" rel="noopener noreferrer">
                    <MessageCircle className={cn("w-7 h-7 flex-shrink-0", isPro ? "fill-white" : "fill-slate-500")} />
                    <div className="text-left flex flex-col leading-tight">
                      <span className={cn("text-[10px] uppercase tracking-widest font-bold", isPro ? "opacity-80" : "text-slate-500")}>
                        {isPro ? 'Contato Premium' : 'Contato'}
                      </span>
                      <span className={!isPro ? 'text-slate-700 font-bold' : ''}>
                        {isPro ? 'Solicitar Orçamento' : 'Chamar no WhatsApp'}
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
                            ? "bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:text-primary hover:border-primary/30"
                            : "bg-slate-50 border border-slate-100 text-slate-600 dark:text-slate-400",
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
                
                <button
                  onClick={handleShare}
                  aria-label="Compartilhar Cartão"
                  className={cn(
                    "w-12 h-12 flex items-center justify-center rounded-2xl transition-all flex-shrink-0",
                    isPro
                      ? "bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                      : "bg-slate-50 border border-slate-100 text-slate-400"
                  )}
                >
                  <Share2 className="w-5 h-5" />
                </button>
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
          <div className="mt-4 px-4 py-3 rounded-2xl bg-primary/5 border border-primary/10 flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-primary" />
              <span className="text-[11px] font-semibold text-slate-600">Remova a marca e use cores personalizadas</span>
            </div>
            <Button variant="ghost" size="sm" className="h-7 px-3 text-[10px] font-bold text-primary hover:bg-primary/10" asChild>
              <a href="/pricing">Ver Pro</a>
            </Button>
          </div>
        )}
      </motion.div>
    </TooltipProvider>
  );
}
