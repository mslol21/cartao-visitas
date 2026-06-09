"use client";

import { 
  MapPin, 
  Globe, 
  Instagram, 
  MessageCircle, 
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
  Wifi,
  Waves,
  Ticket,
  Info,
  ChevronDown
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Profile } from '@/types/profile';
import { cn, hexToHsl } from '@/lib/utils';
import { motion, Variants } from 'framer-motion';
import { ProfessionConfig } from '@/config/professions';
import { toast } from 'sonner';

interface StandardProfessionalLayoutProps {
  data: Partial<Profile>;
  config: ProfessionConfig;
  isPro: boolean;
  profession: string;
}

export function StandardProfessionalLayout({ 
  data, 
  config, 
  isPro,
  profession 
}: StandardProfessionalLayoutProps) {
  
  const cf = (data.custom_fields as any) || {};

  // Helpers
  const cleanWhatsapp = data.whatsapp?.replace(/\D/g, '') || '';
  const formattedWhatsapp = cleanWhatsapp.startsWith('55') ? cleanWhatsapp : `55${cleanWhatsapp}`;
  const defaultMessage = 
    data.whatsapp_message || (
    profession === 'pizzaria' ? "Olá! Vi seu perfil na Konnexy e gostaria de fazer um pedido de pizza 🍕" :
    profession === 'cafeteria' ? "Olá! Gostaria de fazer um pedido / reservar uma mesa na cafeteria ☕" :
    profession === 'vistoria_veicular' ? "Olá! Gostaria de agendar uma vistoria no meu veículo 🛡️🚘" :
    profession === 'montador_moveis' ? "Olá! Vi seu perfil na Konnexy e gostaria de solicitar uma montagem de móveis 🔧" :
    profession === 'chef_eventos' ? "Olá! Vi seu perfil na Konnexy e gostaria de solicitar um orçamento para meu evento 👨‍🍳🍽️" :
    `Olá! Vi seu perfil na Konnexy e gostaria de saber mais sobre seu trabalho como ${config.label}.`);

  const whatsappLink = `https://wa.me/${formattedWhatsapp}?text=${encodeURIComponent(defaultMessage)}`;
  
  const cleanWhatsappSecondary = data.whatsapp_secondary?.replace(/\D/g, '') || '';
  const formattedWhatsappSecondary = cleanWhatsappSecondary.startsWith('55') ? cleanWhatsappSecondary : `55${cleanWhatsappSecondary}`;
  const whatsappSecondaryLink = `https://wa.me/${formattedWhatsappSecondary}?text=${encodeURIComponent(data.whatsapp_secondary_message || defaultMessage)}`;

  // Animation variants
  const fadeIn: Variants = {
    hidden: { opacity: 0, y: 30 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: { 
        delay: i * 0.12, 
        duration: 0.8, 
        ease: [0.16, 1, 0.3, 1] 
      }
    })
  };

  const themeHex = data.theme_color || '#3b82f6';
  const bgColor = cf.cor_fundo;
  const textColor = cf.cor_texto;

  return (
    <div 
      className={cn(
        "w-full min-h-full flex flex-col gap-8 pb-20 transition-colors duration-1000 overflow-x-hidden",
        !bgColor && (isPro ? "bg-slate-950 text-white" : "bg-white text-slate-900")
      )}
      style={{ 
        '--primary': isPro ? hexToHsl(data.theme_color || '#3b82f6') : undefined,
        backgroundColor: bgColor || undefined,
        color: textColor || undefined
      } as React.CSSProperties}
    >
      
      {/* 1. HEADER SECTION (Identity) */}
      <motion.div 
        custom={0} initial="hidden" animate="visible" variants={fadeIn}
        className="flex flex-col items-center text-center px-4 pt-10 relative"
      >
        <div className={cn("konnexy-aura mb-8", isPro && "scale-110")}>
          <div className={cn(
            "relative w-36 h-36 rounded-full border-4 shadow-[0_20px_50px_rgba(0,0,0,0.15)] overflow-hidden z-10 transition-all duration-700",
            isPro ? "border-white/20" : "border-white dark:border-slate-800"
          )}
          style={isPro ? { borderColor: themeHex + '80' } : {}}
          >
            {data.photo_url ? (
               <img 
                 src={data.photo_url || ''} 
                 alt={data.business_name || ''} 
                 className="w-full h-full object-cover transition-transform group-hover:scale-110 duration-700" 
               />
            ) : (
               <div className="w-full h-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                  <span className="text-4xl font-black opacity-20">{data.business_name?.[0] || '?'}</span>
               </div>
            )}
          </div>
        </div>

        <div className={cn(
          "relative p-8 rounded-[3rem] w-full max-w-[340px] transition-all duration-700 overflow-hidden",
          !cf.cor_info_fundo && (isPro ? "bg-white/10 backdrop-blur-2xl border border-white/20 shadow-xl" : "bg-white/80 border border-slate-100 shadow-xl")
        )}
        style={{ 
          backgroundColor: cf.cor_info_fundo || undefined, 
          borderColor: cf.cor_info_fundo ? cf.cor_info_fundo + '30' : undefined,
          color: cf.cor_info_texto || textColor || undefined
        }}
        >
          <h1 
            className="text-4xl font-black tracking-tighter mb-3 leading-[0.9] uppercase font-sora"
            style={{ color: cf.cor_info_texto || textColor || undefined }}
          >
            {data.business_name || 'Seu Negócio'}
          </h1>
          
          <div className="flex flex-col items-center gap-4">
            <div 
              className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-[0.15em] transition-all shadow-sm"
              style={cf.cor_botoes ? { backgroundColor: cf.cor_botoes + '20', color: cf.cor_botoes } : { backgroundColor: 'hsl(var(--primary)/0.1)', color: 'hsl(var(--primary))' }}
            >
               <span className="opacity-100">{config.label}</span>
            </div>

            <p 
            className="text-[11px] font-bold leading-tight opacity-70 tracking-tight uppercase max-w-[200px]"
            style={{ color: cf.cor_info_texto || textColor || undefined }}
          >
            {data.subtitle || data.tagline || 'Sua Especialidade Profissional'}
          </p>
          </div>
        </div>
      </motion.div>

      {/* 2. MEDIA SECTION (Visuals) */}
      {(profession === 'area_lazer' || (data.custom_fields as any)?.foto_local || data.background_video_url) && (
        <motion.div 
          custom={1} initial="hidden" animate="visible" variants={fadeIn}
          className="px-6"
        >
          <div className="w-full rounded-[2.5rem] overflow-hidden shadow-2xl relative border-4 border-white/10 bg-black aspect-[4/5] sm:aspect-video group">
            {(() => {
              const mediaUrl = (data.custom_fields as any)?.foto_local || data.background_video_url;
              if (!mediaUrl) return null;
              
              return mediaUrl.match(/\.(mp4|webm|ogg|mov)$/i) ? (
                <>
                  <video 
                    src={mediaUrl}
                    autoPlay 
                    muted 
                    loop 
                    playsInline 
                    className="absolute inset-0 w-full h-full object-cover blur-2xl opacity-50 scale-150"
                  />
                  <video 
                    src={mediaUrl} 
                    controls 
                    playsInline 
                    className="relative z-10 w-full h-full object-contain"
                  />
                </>
              ) : (
                <>
                  <div 
                    className="absolute inset-0 w-full h-full blur-2xl opacity-50 scale-150 z-0" 
                    style={{ 
                      backgroundImage: `url('${mediaUrl}')`, 
                      backgroundSize: 'cover', 
                      backgroundPosition: 'center' 
                    }} 
                  />
                  <img 
                    src={mediaUrl} 
                    alt={data.business_name || 'Visual Portfólio'} 
                    className="relative z-10 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
                  />
                </>
              );
            })()}
          </div>
        </motion.div>
      )}

      {/* 3. CONTACT SECTION (Primary Actions) */}
      <motion.div 
        custom={2} initial="hidden" animate="visible" variants={fadeIn}
        className="px-6 flex flex-col gap-4"
      >
        {data.whatsapp && (
          <Button 
            asChild
            className={cn(
              "w-full h-16 rounded-[1.5rem] text-lg font-black uppercase tracking-tighter shadow-2xl border-none flex items-center justify-center gap-4 transition-all hover:scale-[1.03] active:scale-[0.97]",
              !cf.cor_botoes && "bg-[#25D366] text-white shadow-[#25D366]/30"
            )}
            style={cf.cor_botoes ? {
               backgroundColor: cf.cor_botoes,
               color: cf.cor_texto_botoes || '#ffffff',
               boxShadow: `0 20px 40px -10px ${cf.cor_botoes}60`
            } : undefined}
          >
            <a href={whatsappLink} target="_blank" rel="noopener noreferrer">
              <MessageCircle className={cn("w-6 h-6", !cf.cor_botoes && "fill-white")} />
              <span className="font-sora">{data.cta_text || config.defaultCta || 'Chamar no WhatsApp'}</span>
            </a>
          </Button>
        )}

        {data.whatsapp_secondary && (
          <Button 
            asChild
            variant="outline"
            className={cn(
              "w-full h-14 rounded-[1.2rem] text-base font-black uppercase tracking-tighter border-2 flex items-center justify-center gap-3 transition-all hover:scale-[1.02] active:scale-[0.98] backdrop-blur-md",
              !cf.cor_botoes && "border-[#25D366] text-[#25D366] hover:bg-[#25D366]/5"
            )}
            style={cf.cor_botoes ? {
               borderColor: cf.cor_botoes,
               color: cf.cor_botoes,
            } : undefined}
          >
            <a href={whatsappSecondaryLink} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-2">
              <MessageCircle className="w-5 h-5 stroke-[2.5px]" />
              <span className="text-[11px] tracking-[0.2em] font-black">Segundo WhatsApp</span>
            </a>
          </Button>
        )}
      </motion.div>

      {/* 4. DIFFERENTIATORS (Diferenciais) */}
      {data.diferenciais && data.diferenciais.length > 0 && (
        <motion.div 
          custom={3} initial="hidden" animate="visible" variants={fadeIn}
          className="px-6"
        >
          <div className="flex items-center gap-3 mb-6 px-2">
            <div className="h-6 w-1.5 bg-primary rounded-full" style={{ backgroundColor: themeHex }} />
            <h2 className="text-[10px] font-black uppercase tracking-[0.25em]" style={{ color: textColor || 'inherit', opacity: 0.6 }}>Por que nos escolher?</h2>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {data.diferenciais.map((dif, idx) => (
              <div 
                key={idx} 
                className={cn(
                  "p-5 rounded-2xl border flex flex-col gap-3 transition-all",
                  !cf.cor_diferenciais_fundo && (isPro ? "bg-white/5 border-white/5" : "bg-white border-slate-100")
                )}
                style={{ 
                  backgroundColor: cf.cor_diferenciais_fundo || undefined, 
                  color: cf.cor_diferenciais_texto || textColor || undefined,
                  borderColor: cf.cor_diferenciais_fundo ? cf.cor_diferenciais_fundo + '30' : undefined 
                }}
              >
                <div className="w-10 h-10 rounded-2xl bg-primary/10 flex items-center justify-center">
                   <Award className="w-5 h-5 text-primary" style={{ color: themeHex }} />
                </div>
                <span className="text-[11px] font-black leading-tight tracking-tight uppercase opacity-90">
                  {dif}
                </span>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {/* 5. SERVICES SECTION */}
      {data.servicos && data.servicos.length > 0 && (
        <motion.div 
          custom={4} initial="hidden" animate="visible" variants={fadeIn}
          className="px-6"
        >
          <div className="flex items-center justify-between mb-6 px-2">
            <div className="flex items-center gap-3">
              <div className="h-6 w-1.5 bg-primary rounded-full" style={{ backgroundColor: themeHex }} />
              <h2 className="text-[10px] font-black uppercase tracking-[0.25em]" style={{ color: textColor || 'inherit', opacity: 0.6 }}>Serviços & Preços</h2>
            </div>
          </div>
          <div className="flex flex-col gap-4">
            {data.servicos.map((servico: any, idx: number) => (
              <div 
                key={idx} 
                className={cn(
                  "p-6 rounded-3xl border transition-all",
                  !cf.cor_servicos_fundo && (isPro ? "bg-white/5 border-white/5" : "bg-white border-slate-100")
                )}
                style={{ 
                  backgroundColor: cf.cor_servicos_fundo || undefined, 
                  color: cf.cor_servicos_texto || textColor || undefined,
                  borderColor: cf.cor_servicos_fundo ? cf.cor_servicos_fundo + '30' : undefined 
                }}
              >
                <div className="flex justify-between items-start gap-4">
                  <div className="flex-1">
                    <h3 className="text-sm font-black uppercase tracking-tight mb-2">
                      {servico.nome}
                    </h3>
                    {servico.descricao && (
                      <p className="text-[11px] font-medium leading-relaxed opacity-70">
                        {servico.descricao}
                      </p>
                    )}
                  </div>
                  {servico.preco && (
                    <div className="bg-primary/10 px-4 py-2 rounded-2xl">
                      <span className="text-sm font-black text-primary tracking-tighter" style={{ color: themeHex }}>
                        {servico.preco}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {/* 6. BIO / ABOUT */}
      {data.bio_profissional && (
        <motion.div 
          custom={5} initial="hidden" animate="visible" variants={fadeIn}
          className="px-6"
        >
           <div className={cn(
             "p-8 rounded-[3rem] border-2 transition-all",
             !cf.cor_bio_fundo && (isPro ? "bg-white/5 backdrop-blur-xl border-white/10 text-slate-300 shadow-2xl" : "bg-white/80 dark:bg-slate-900/80 border-slate-100 dark:border-slate-800")
           )}
           style={{ 
             backgroundColor: cf.cor_bio_fundo || undefined, 
             color: cf.cor_bio_texto || textColor || undefined,
             borderColor: cf.cor_bio_fundo ? cf.cor_bio_fundo + '30' : undefined 
           }}
           >
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-2xl bg-primary/10 flex items-center justify-center">
                   <User className="w-5 h-5 text-primary" style={{ color: themeHex }} />
                </div>
                <h2 className="text-[10px] font-black uppercase tracking-[0.25em] opacity-60">Sobre o Profissional</h2>
              </div>
              <p className="text-[13px] font-medium leading-relaxed tracking-tight italic opacity-90">
                "{data.bio_profissional}"
              </p>
           </div>
        </motion.div>
      )}

      {/* 7. ADDRESS / LOCATION */}
      {data.endereco_completo && (
        <motion.div 
          custom={6} initial="hidden" animate="visible" variants={fadeIn}
          className="px-6"
        >
          <Button 
            asChild
            variant="outline"
            className="w-full h-auto py-6 rounded-[2.5rem] border-2 bg-white/50 dark:bg-slate-900/50 backdrop-blur-md border-slate-200 dark:border-white/10 hover:border-primary/40 group overflow-hidden"
            style={{ 
              backgroundColor: bgColor ? bgColor + '80' : undefined,
              borderColor: textColor ? textColor + '20' : undefined,
              color: textColor || 'inherit'
            }}
          >
            <a 
              href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(data.endereco_completo)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex flex-col items-center gap-3"
            >
              <div className="w-10 h-10 rounded-2xl bg-red-500/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                <MapPin className="w-5 h-5 text-red-500" />
              </div>
              <div className="flex flex-col items-center gap-1 px-4">
                <span className="text-[10px] font-black uppercase tracking-[0.2em] opacity-40">Localização</span>
                <span className="text-[11px] font-bold text-center leading-tight opacity-90">
                  {data.endereco_completo}
                </span>
              </div>
            </a>
          </Button>
        </motion.div>
      )}

      {/* 8. FOOTER / BRANDING */}
      <motion.div 
        custom={7} initial="hidden" animate="visible" variants={fadeIn}
        className="mt-12 flex flex-col items-center gap-4 opacity-40 hover:opacity-100 transition-opacity"
      >
        <p className="text-[9px] font-black uppercase tracking-[0.3em]" style={{ color: textColor || 'inherit' }}>Tecnologia por</p>
        <div className="flex items-center gap-2 grayscale brightness-50">
           <div className="w-6 h-6 bg-primary rounded-lg rotate-12 flex items-center justify-center" style={{ backgroundColor: themeHex }}>
              <span className="text-white text-[10px] font-black">K</span>
           </div>
           <span className="text-xs font-black tracking-tighter uppercase" style={{ color: textColor || 'inherit' }}>Konnexy Digital</span>
        </div>
      </motion.div>

    </div>
  );
}
