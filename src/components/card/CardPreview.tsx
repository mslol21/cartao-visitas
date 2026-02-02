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
  Lock
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

interface CardPreviewProps {
  data: Partial<Profile>;
  showBranding?: boolean;
}

export function CardPreview({ data, showBranding = true }: CardPreviewProps) {
  const isPro = data.plan === 'pro';
  
  const whatsappLink = data.whatsapp
    ? `https://wa.me/${data.whatsapp.replace(/\D/g, '')}?text=${encodeURIComponent(`Olá! Vi seu perfil no ConnectCard e gostaria de ${isPro ? 'solicitar um orçamento' : 'conversar'} sobre seus serviços.`)}`
    : '#';

  const socialLinks = [
    { id: 'instagram', icon: Instagram, value: data.instagram, url: `https://instagram.com/${data.instagram}`, label: 'Instagram' },
    { id: 'linkedin', icon: Linkedin, value: data.linkedin, url: `https://linkedin.com/in/${data.linkedin}`, label: 'LinkedIn' },
    { id: 'facebook', icon: Facebook, value: data.facebook, url: `https://facebook.com/${data.facebook}`, label: 'Facebook' },
    { id: 'twitter', icon: Twitter, value: data.twitter, url: `https://twitter.com/${data.twitter}`, label: 'Twitter' },
    { id: 'youtube', icon: Youtube, value: data.youtube, url: `https://youtube.com/@${data.youtube}`, label: 'YouTube' },
    { id: 'website', icon: Globe, value: data.website, url: data.website?.startsWith('http') ? data.website : `https://${data.website}`, label: 'Website' },
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
        title: data.name || 'ConnectCard',
        text: data.tagline || 'Confira meu perfil profissional',
        url: typeof window !== 'undefined' ? window.location.href : '',
      });
    }
  };

  return (
    <TooltipProvider>
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="w-full max-w-[380px] mx-auto group/card"
      >
        <div className="relative bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800/50 shadow-[0_30px_60px_-15px_rgba(0,0,0,0.15)] overflow-hidden rounded-[2.5rem]">
          
          {/* Premium Header */}
          <div 
            className="h-28 relative overflow-hidden"
            style={{ backgroundColor: data.theme_color || '#3b82f6' }}
          >
            <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white via-transparent to-transparent" />
            <div className="absolute top-0 inset-x-0 h-full bg-gradient-to-b from-black/20 to-transparent" />
            
            {isPro && (
              <div className="absolute top-4 right-5 flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white text-[9px] font-bold uppercase tracking-[0.15em]">
                <BadgeCheck className="w-3 h-3 text-blue-400" />
                Pro Member
              </div>
            )}
          </div>

          {/* Profile Content Area */}
          <div className="px-6 pb-10 -mt-14 relative z-10 flex flex-col items-center">
            
            {/* Avatar with Enhanced Shadow/Border */}
            <div className="relative mb-6">
              <motion.div 
                whileHover={{ scale: 1.02 }}
                className={cn(
                  "w-28 h-28 rounded-[2rem] bg-white dark:bg-slate-900 shadow-[0_10px_40px_-10px_rgba(0,0,0,0.2)] dark:shadow-none p-1.5 relative overflow-hidden",
                  isPro && "ring-4 ring-primary/20 ring-offset-4 ring-offset-white dark:ring-offset-slate-950"
                )}
              >
                {/* Glow for Pro */}
                {isPro && (
                  <div className="absolute inset-0 bg-gradient-to-tr from-primary/20 to-transparent animate-pulse" />
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
                      className="px-3 py-1.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-[11px] font-bold text-slate-600 dark:text-slate-300 whitespace-nowrap"
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
                whileHover={{ scale: 1.02 }} 
                whileTap={{ scale: 0.98 }}
                className="w-full"
              >
                <Button
                  variant="default"
                  size="lg"
                  className="w-full h-[70px] rounded-[1.25rem] bg-[#25D366] hover:bg-[#20ba5a] text-white font-black text-lg shadow-[0_15px_30px_-5px_rgba(37,211,102,0.3)] border-b-[6px] border-[#128C7E] transition-all flex items-center justify-center gap-3 active:border-b-0 active:translate-y-1"
                  asChild
                  aria-label={isPro ? 'Solicitar Orçamento via WhatsApp' : 'Conversar via WhatsApp'}
                >
                  <a href={whatsappLink} target="_blank" rel="noopener noreferrer">
                    <MessageCircle className="w-7 h-7 fill-white flex-shrink-0" />
                    <div className="text-left flex flex-col leading-tight">
                      <span className="text-[10px] uppercase tracking-widest opacity-80 font-bold">Contato direto</span>
                      <span>{isPro ? 'Solicitar Orçamento' : 'Chamar no WhatsApp'}</span>
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
                        className={cn(
                          "w-12 h-12 flex items-center justify-center rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:text-primary transition-all shadow-sm relative overflow-hidden",
                          isDisabled && "opacity-40 cursor-not-allowed grayscale"
                        )}
                      >
                        <social.icon className="w-5 h-5 flex-shrink-0" />
                        {isDisabled && (
                          <div className="absolute top-0 right-0 bg-slate-900 text-white p-0.5 rounded-bl-lg">
                            <Lock className="w-2.5 h-2.5" />
                          </div>
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
                  className="w-12 h-12 flex items-center justify-center rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all flex-shrink-0"
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
                  Powered by 
                  <span className="text-slate-900 dark:text-white group-hover:text-primary transition-colors">Konnexy</span>
                </a>
              )}
            </div>
          )}
        </div>
      </motion.div>
    </TooltipProvider>
  );
}
