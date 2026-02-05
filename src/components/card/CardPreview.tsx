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
  Smartphone
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
    { id: 'twitter', icon: Twitter, value: data.twitter, url: `https://twitter.com/${data.twitter}`, label: 'Twitter', trackType: 'click_twitter' as const },
    { id: 'youtube', icon: Youtube, value: data.youtube, url: `https://youtube.com/@${data.youtube}`, label: 'YouTube', trackType: 'click_youtube' as const },
    { id: 'website', icon: Globe, value: data.website, url: data.website?.startsWith('http') ? data.website : `https://${data.website}`, label: 'Website', trackType: 'click_website' as const },
  ];

  // All valid links (those with a value)
  const validSocialLinks = socialLinks.filter(s => s.value);
  
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
        return "bg-black text-white border-white/10 shadow-[inset_0_0_120px_rgba(59,130,246,0.15)]"; // Added blue glow to darkness
      case 'glass': 
        return "bg-white/10 backdrop-blur-3xl border-white/20 shadow-[inset_0_0_40px_rgba(255,255,255,0.1)]";
      case 'minimalist': 
        return "bg-white text-slate-900 border-slate-100 shadow-none";
      default: 
        if (hasVideo) return "bg-black/20 backdrop-blur-2xl text-white border-white/10";
        // Ultra Premium Default
        return "bg-slate-900/80 backdrop-blur-3xl text-white border-white/10 shadow-[inset_0_0_60px_rgba(59,130,246,0.1)]";
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
            "relative overflow-hidden rounded-[2.5rem] transition-all duration-500 flex flex-col min-h-[600px]",
            isPro 
              ? "border-2 border-primary/20 shadow-[0_40px_100px_-20px_rgba(59,130,246,0.3)] shadow-[inset_0_0_60px_rgba(59,130,246,0.1)]" 
              : "border border-slate-200 dark:border-slate-800 shadow-sm bg-white dark:bg-slate-950"
          )}
        >
          {/* --- TOP SECTION (Video/Header + Identity) --- */}
          <div className="relative w-full p-6 pt-12 pb-16 flex flex-col items-center text-center shrink-0 overflow-hidden">
            
            {/* Background Layer */}
            <div className="absolute inset-0 z-0">
               {isPro && data.background_video_url ? (
                 <>
                   <video 
                     src={data.background_video_url}
                     autoPlay 
                     muted 
                     loop 
                     playsInline 
                     className="w-full h-full object-cover"
                   />
                   <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px]" />
                 </>
               ) : (
                 <div 
                   className="w-full h-full transition-colors duration-500"
                   style={{ 
                     backgroundColor: data.theme_color || (isPro ? '#0f172a' : '#f1f5f9'),
                     backgroundImage: isPro && !data.theme_color ? 'linear-gradient(to bottom right, #0f172a, #1e293b)' : undefined
                   }}
                 />
               )}
               
               {/* Decorative Gradient overlays for Pro Non-Video */}
               {isPro && !data.background_video_url && (
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-transparent mix-blend-overlay" />
               )}
            </div>

            {/* Badges */}
            <div className="absolute top-4 right-5 z-20">
               {isPro ? (
                  <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-black/30 backdrop-blur-xl border border-white/20 text-white text-[10px] font-black uppercase tracking-[0.2em] shadow-lg">
                    <BadgeCheck className="w-3.5 h-3.5 text-blue-400" />
                    Premium
                  </div>
               ) : (
                  <div className="px-3 py-1 rounded-full bg-slate-200/50 text-slate-500 text-[9px] font-bold uppercase tracking-wider backdrop-blur-md">
                    Digital Free
                  </div>
               )}
            </div>

            {/* Identity Content */}
            <div className="relative z-10 flex flex-col items-center w-full max-w-[90%]">
               {/* Avatar */}
               <motion.div 
                 whileHover={isPro ? { scale: 1.05 } : {}}
                 className={cn(
                   "w-28 h-28 rounded-[2rem] p-1.5 relative overflow-hidden transition-all duration-500 mb-5",
                   isPro 
                     ? "bg-white/10 backdrop-blur-md shadow-2xl ring-1 ring-white/20" 
                     : "bg-white shadow-xl"
                 )}
               >
                 <div className="w-full h-full rounded-[1.7rem] overflow-hidden bg-slate-100 dark:bg-slate-800 flex items-center justify-center relative">
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
                 {/* Verified Badge */}
                 {isPro && (
                    <div className="absolute -bottom-1 -right-1 bg-blue-500 text-white rounded-xl p-1 shadow-lg border-2 border-transparent z-20">
                      <BadgeCheck className="w-3.5 h-3.5" />
                    </div>
                 )}
               </motion.div>

               {/* Name & Text */}
               <h1 className={cn(
                 "text-2xl font-black tracking-tight mb-2 capitalize leading-tight",
                 (isPro || data.background_video_url) ? "text-white drop-shadow-md" : (data.theme_color ? "text-white drop-shadow-md" : "text-slate-900")
               )}>
                 {data.name || 'Seu Nome'}
               </h1>
               <p className={cn(
                 "text-sm font-bold leading-relaxed opacity-90 mb-2 max-w-[280px]",
                 (isPro || data.background_video_url) ? "text-white/90 drop-shadow-sm" : (data.theme_color ? "text-white/90" : "text-slate-600")
               )}>
                 {data.tagline || 'Sua profissão ou frase de impacto'}
               </p>
               
               {data.city && (
                 <div className={cn(
                   "flex items-center gap-1.5 text-[10px] font-black uppercase tracking-[0.2em]",
                   (isPro || data.background_video_url) ? "text-white/60" : (data.theme_color ? "text-white/60" : "text-slate-400")
                 )}>
                   <MapPin className="w-3 h-3" />
                   {data.city}
                 </div>
               )}
            </div>
          </div>

          {/* --- BOTTOM SECTION (Actions & Services) --- */}
          <div className={cn(
            "relative flex-1 -mt-8 rounded-t-[2.5rem] p-6 pt-10 z-10 flex flex-col gap-8",
            isPro ? "bg-white/90 dark:bg-slate-950/90 backdrop-blur-xl" : "bg-slate-50 dark:bg-slate-950"
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
              <div className="flex items-center justify-between gap-2.5 pt-1">
                <div className="flex flex-wrap items-center gap-2.5">
                  {validSocialLinks.map((social, index) => {
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
                            ? "bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-600 dark:text-slate-300 hover:text-white hover:bg-primary hover:border-primary"
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
                </div>
                
                <div className="flex items-center gap-2">
                   <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <button className={cn(
                        "w-12 h-12 flex items-center justify-center rounded-2xl transition-all shadow-sm",
                        isPro ? "bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-600 dark:text-slate-300" : "bg-slate-200/50 text-slate-400"
                      )}>
                        <Download className="w-5 h-5" />
                      </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-56 rounded-2xl p-2">
                      <DropdownMenuItem onClick={handleSaveContact} className="rounded-xl h-11 cursor-pointer font-bold">Salvar Contato</DropdownMenuItem>
                      {isPro && (
                        <>
                          <DropdownMenuItem onClick={handleDownloadPNG} className="rounded-xl h-11 cursor-pointer font-bold">Baixar PNG</DropdownMenuItem>
                          <DropdownMenuItem onClick={handleDownloadPDF} className="rounded-xl h-11 cursor-pointer font-bold">Baixar PDF</DropdownMenuItem>
                        </>
                      )}
                    </DropdownMenuContent>
                  </DropdownMenu>

                  <button onClick={handleShare} className={cn(
                    "w-14 h-14 flex items-center justify-center rounded-[1.4rem] transition-all shadow-lg text-white",
                    isPro ? "bg-primary hover:brightness-110" : "bg-slate-900"
                  )}>
                    <Share2 className="w-6 h-6" />
                  </button>
                </div>
              </div>
            </div>

            {/* Services */}
            {activeServicesArr.length > 0 && (
              <div className="w-full">
                <div className="flex items-center gap-3 mb-5">
                  <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Serviços</span>
                  <div className="h-[1px] flex-1 bg-slate-200 dark:bg-slate-800" />
                </div>
                
                {mainService && (
                   <motion.div
                     initial={{ opacity: 0, y: 10 }}
                     animate={{ opacity: 1, y: 0 }}
                     className={cn(
                       "w-full p-5 rounded-3xl flex items-center gap-4 mb-3 transition-colors",
                       isPro 
                         ? "bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/5 shadow-sm"
                         : "bg-white border border-slate-100"
                     )}
                   >
                     <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center text-white shadow-lg", isPro ? "bg-primary" : "bg-slate-900")}>
                        <Sparkles className="w-6 h-6" />
                     </div>
                     <div>
                       <span className="text-[9px] font-black uppercase tracking-[0.1em] text-primary mb-0.5 block">Destaque</span>
                       <span className="font-black text-slate-900 dark:text-white uppercase leading-tight">{mainService.name}</span>
                     </div>
                   </motion.div>
                )}

                {secondaryServices.length > 0 && (
                  <div className="grid grid-cols-2 gap-3">
                    {secondaryServices.map((service, i) => (
                       <div key={i} className={cn(
                         "p-4 rounded-2xl flex flex-col gap-2 border",
                         isPro ? "bg-white/50 dark:bg-white/5 border-slate-200 dark:border-white/5" : "bg-slate-50 border-slate-100"
                       )}>
                          <div className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-white/10 flex items-center justify-center">
                            <span className="w-1.5 h-1.5 rounded-full bg-slate-400" />
                          </div>
                          <span className="text-xs font-bold leading-tight uppercase text-slate-700 dark:text-slate-300">{service.name}</span>
                       </div>
                    ))}
                  </div>
                )}
              </div>
            )}
            
            {/* Branding Footer */}
            {showBranding && (
               <div className="mt-auto py-6 text-center">
                 <a href="/" className="inline-flex items-center gap-1.5 text-[10px] uppercase font-black tracking-[0.2em] text-slate-400 hover:text-primary transition-colors opacity-60 hover:opacity-100">
                   Criado com <span className="text-slate-900 dark:text-white">Konnexy</span>
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
