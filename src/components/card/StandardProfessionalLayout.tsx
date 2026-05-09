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

  const themeHex = data.theme_color || '#2563EB';

  const getPhotoFilter = (): string => {
    if (!isPro) return 'none';
    switch (data.photo_filter) {
      case 'bw':      return 'grayscale(100%) contrast(1.1)';
      case 'vintage': return 'sepia(55%) contrast(1.08) brightness(0.92) saturate(0.8)';
      case 'vivid':   return 'saturate(1.9) contrast(1.12) brightness(1.05)';
      case 'golden':  return 'sepia(35%) saturate(1.4) brightness(1.1) hue-rotate(-5deg)';
      case 'cold':    return 'hue-rotate(195deg) saturate(1.3) brightness(1.05)';
      case 'dramatic':return 'contrast(1.4) brightness(0.85) saturate(1.2)';
      default:        return 'none';
    }
  };

  const effect = data.photo_border_effect || 'none';
  const hasEffect = effect !== 'none' && isPro;

  const ringStyles: Record<string, React.CSSProperties> = {
    none:    {},
    glow:    { background: themeHex, filter: `blur(8px)`, opacity: 0.7 },
    spin:    { background: 'conic-gradient(from 0deg, #3b82f6, #8b5cf6, #ef4444, #f59e0b, #22c55e, #3b82f6)' },
    rainbow: { background: 'conic-gradient(from 0deg, #ef4444, #f59e0b, #22c55e, #3b82f6, #8b5cf6, #ef4444)' },
    pulse:   { background: themeHex, opacity: 0.85 },
    shimmer: { background: 'linear-gradient(105deg, #94a3b8 30%, #f8fafc 50%, #94a3b8 70%)', backgroundSize: '200% 100%' },
    orbit:   { border: `3px dashed ${themeHex}`, background: 'transparent' },
  };

  const ringAnimations: Record<string, string> = {
    spin:    'aura-spin 3s linear infinite',
    rainbow: 'aura-spin 4s linear infinite',
    pulse:   'pulse 1.8s ease-in-out infinite',
    shimmer: 'shine 2s linear infinite',
    orbit:   'aura-spin 6s linear infinite',
  };

  const getFieldIcon = (fieldName: string) => {
     if (fieldName.includes('atende_domicilio') || fieldName.includes('residencial')) return Home;
     if (fieldName.includes('agendamento') || fieldName.includes('horario')) return Calendar;
     if (fieldName.includes('oab') || fieldName.includes('creci') || fieldName.includes('nr10')) return ShieldCheck;
     if (fieldName.includes('delivery') || fieldName.includes('frete') || fieldName.includes('veiculo')) return Truck;
     if (fieldName.includes('online') || fieldName.includes('remoto') || fieldName.includes('digital')) return Monitor;
     if (fieldName.includes('experiencia')) return History;
     if (fieldName.includes('socorro') || fieldName.includes('emergencia')) return Zap;
     if (fieldName.includes('clinico') || fieldName.includes('saude')) return HeartPulse;
     if (fieldName.includes('garantia') || fieldName.includes('seguro')) return ShieldCheck;
     if (fieldName.includes('cartao') || fieldName.includes('pix') || fieldName.includes('pagamento')) return CreditCard;
     if (fieldName.includes('orcamento') || fieldName.includes('recibo')) return Receipt;
     if (fieldName.includes('celular')) return Smartphone;
     if (fieldName.includes('kids') || fieldName.includes('infantil')) return Baby;
     if (fieldName.includes('noiva') || fieldName.includes('festa')) return Sparkles;
     if (fieldName.includes('quimica') || fieldName.includes('relaxamento') || fieldName.includes('corte')) return Scissors;
     if (fieldName.includes('produtos') || fieldName.includes('venda')) return ShoppingBag;
     if (fieldName.includes('lavagem') || fieldName.includes('higienizacao')) return Wind;
     if (fieldName.includes('massagem') || fieldName.includes('facial') || fieldName.includes('smile')) return Smile;
     if (fieldName.includes('cilios') || fieldName.includes('sobrancelha') || fieldName.includes('olhar')) return Eye;
     if (fieldName.includes('unha') || fieldName.includes('manicure') || fieldName.includes('pigmentacao') || fieldName.includes('nail_art')) return Brush;
     if (fieldName.includes('pele') || fieldName.includes('estetica') || fieldName.includes('facial') || fieldName.includes('injetaveis') || fieldName.includes('microagulhamento')) return Sparkles;
     if (fieldName.includes('spa') || fieldName.includes('drenagem') || fieldName.includes('relaxante')) return Flower2;
     if (fieldName.includes('crp') || fieldName.includes('autoclave') || fieldName.includes('biosseguranca')) return ShieldCheck;
     if (fieldName.includes('terapia_casal')) return Heart;
     if (fieldName.includes('depilacao') || fieldName.includes('laser')) return Zap;
     if (fieldName.includes('convenio') || fieldName.includes('plano')) return CheckCircle2;
     if (fieldName.includes('reforma') || fieldName.includes('ferramentas') || fieldName.includes('obra') || fieldName.includes('leva_produtos')) return HardHat;
     if (fieldName.includes('piscina') || fieldName.includes('lazer')) return Waves;
     if (fieldName.includes('churrasqueira') || fieldName.includes('festa')) return Sparkles;
     if (fieldName.includes('capacidade')) return Users;
     if (fieldName.includes('wifi')) return Globe;
     if (fieldName.includes('som') || fieldName.includes('musica')) return Music;
     if (fieldName.includes('pet')) return Heart;
     if (fieldName.includes('vr') || fieldName.includes('refeicao') || fieldName.includes('ticket')) return Ticket;
     if (fieldName.includes('fisico') || fieldName.includes('local')) return MapPin;
     if (fieldName.includes('alto_padrao') || fieldName.includes('premium')) return Gem;
     if (fieldName.includes('financiamento')) return Landmark;
     if (fieldName.includes('planta') || fieldName.includes('imovel') || fieldName.includes('venda_aluguel')) return Building2;
     if (fieldName.includes('avaliacao')) return Scale;
     if (fieldName.includes('coworking')) return Monitor;
     if (fieldName.includes('mecanica') || fieldName.includes('injecao') || fieldName.includes('freios') || fieldName.includes('suspensao') || fieldName.includes('alinhamento')) return Wrench;
     if (fieldName.includes('estetica_automotiva') || fieldName.includes('martelinho')) return Sparkles;
     return Award;
  };

  const getProfessionBg = () => {
    switch(profession) {
      case 'barbearia': return 'bg-slate-950';
      case 'advogado': return 'bg-slate-50';
      case 'beauty':
      case 'manicure':
      case 'cabeleireiro': return 'bg-rose-50/30';
      case 'tech':
      case 'tecnico_informatica': return 'bg-slate-900';
      case 'health':
      case 'psicologo': return 'bg-indigo-50/20';
      case 'mecanico':
      case 'manutencao_automotiva': return 'bg-zinc-950';
      default: return 'bg-white dark:bg-slate-950';
    }
  }

  return (
    <div 
      className={cn("w-full min-h-full flex flex-col gap-8 pb-20 transition-colors duration-1000 overflow-x-hidden", getProfessionBg())}
      style={{ '--primary': isPro ? hexToHsl(data.theme_color || '#3b82f6') : undefined } as React.CSSProperties}
    >
      
      {/* 1. HEADER SECTION (Identity) */}
      <motion.div 
        custom={0} initial="hidden" animate="visible" variants={fadeIn}
        className="flex flex-col items-center text-center px-4 pt-10 relative"
      >
        {/* Abstract Background Decoration */}
        <div className="absolute top-0 left-0 right-0 h-60 overflow-hidden opacity-10 pointer-events-none">
           {profession === 'tech' && <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--primary)_0%,_transparent_70%)] blur-3xl scale-150" />}
           {(profession === 'barbearia' || profession === 'mecanico') && <div className="absolute inset-0 bg-[repeating-linear-gradient(45deg,_transparent_0px,_transparent_10px,_#ffffff_10px,_#ffffff_11px)]" />}
           {(profession === 'beauty' || profession === 'manicure') && <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_#fda4af_0%,_transparent_50%),radial-gradient(circle_at_top_left,_#f9a8d4_0%,_transparent_50%)] blur-3xl" />}
        </div>

        <div className={cn("konnexy-aura mb-8", isPro && "scale-110")}>
          {isPro && !hasEffect && (
            <>
              <div className="aura-glow" style={{ opacity: 0.5, filter: 'blur(20px)', background: themeHex }} />
              <div className="aura-arc" style={{ borderTopColor: themeHex, borderRightColor: themeHex, borderWidth: '3px' }} />
            </>
          )}

          {hasEffect && (
            <div
              className="absolute rounded-full z-[5]"
              style={{ inset: '-8px', ...ringStyles[effect], animation: ringAnimations[effect] }}
            />
          )}

          <div className={cn(
            "relative w-36 h-36 rounded-full border-4 shadow-[0_20px_50px_rgba(0,0,0,0.15)] overflow-hidden z-10 transition-all duration-700",
            isPro ? "border-white/40" : "border-white dark:border-slate-800"
          )}
          style={isPro ? { borderColor: themeHex + '80' } : {}}
          >
            {data.photo_url ? (
               <img 
                 src={data.photo_url || ''} 
                 alt={data.business_name || ''} 
                 className="w-full h-full object-cover transition-transform group-hover:scale-110 duration-700" 
                 style={{ filter: getPhotoFilter() }}
               />
            ) : (
               <div className="w-full h-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                  <span className="text-4xl font-black opacity-20">{data.business_name?.[0] || '?'}</span>
               </div>
            )}
          </div>

          {isPro && (
            <div className="absolute -bottom-2 -right-2 p-1.5 bg-white dark:bg-slate-900 rounded-full shadow-2xl z-20 ring-4 ring-white/10">
              <div className="p-1.5 rounded-full bg-primary/10">
                <Crown className="w-4 h-4 text-primary shadow-sm" />
              </div>
            </div>
          )}
        </div>

        <div className={cn(
          "relative p-8 rounded-[3rem] w-full max-w-[340px] transition-all duration-700 overflow-hidden",
          isPro 
            ? "bg-white/10 backdrop-blur-2xl border border-white/20 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.2)]" 
            : "bg-white/80 dark:bg-slate-900/80 border border-slate-100 dark:border-slate-800 shadow-xl"
        )}
        style={cf.cor_info_fundo ? { backgroundColor: cf.cor_info_fundo + '40', borderColor: cf.cor_info_fundo + '30' } : undefined}
        >
          {/* Subtle Inner Glow for Pro */}
          {isPro && <div className="absolute -top-10 -right-10 w-32 h-32 bg-primary/20 blur-3xl pointer-events-none" />}

          <h1 
            className="text-4xl font-black tracking-tighter text-slate-900 dark:text-white mb-3 leading-[0.9] uppercase font-sora"
            style={cf.cor_texto ? { color: cf.cor_texto } : undefined}
          >
            {data.business_name || 'Seu Negócio'}
          </h1>
          
          <div className="flex flex-col items-center gap-4">
            <div 
              className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-[0.15em] transition-all shadow-sm"
              style={cf.cor_botoes ? { backgroundColor: cf.cor_botoes + '20', color: cf.cor_botoes } : { backgroundColor: 'hsl(var(--primary)/0.1)', color: 'hsl(var(--primary))' }}
            >
               {profession === 'barbearia' && <Scissors className="w-3.5 h-3.5 stroke-[3px]" />}
               {profession === 'cabeleireiro' && <Scissors className="w-3.5 h-3.5 stroke-[3px]" />}
               {profession === 'manicure' && <Brush className="w-3.5 h-3.5 stroke-[3px]" />}
               {(profession === 'esteticista' || profession === 'beauty') && <Sparkles className="w-3.5 h-3.5 stroke-[3px]" />}
               {(profession === 'pedreiro' || profession === 'mestre_de_obras') && <HardHat className="w-3.5 h-3.5 stroke-[3px]" />}
               {profession === 'area_lazer' && <Umbrella className="w-3.5 h-3.5 stroke-[3px]" />}
               {profession === 'loja_online' && <ShoppingBag className="w-3.5 h-3.5 stroke-[3px]" />}
               {profession === 'cafeteria' && <Coffee className="w-3.5 h-3.5 stroke-[3px]" />}
               {(profession === 'mecanico' || profession === 'manutencao_automotiva') && <Wrench className="w-3.5 h-3.5 stroke-[3px]" />}
               {profession === 'vistoria_veicular' && <ShieldCheck className="w-3.5 h-3.5 stroke-[3px]" />}
               <span className="opacity-100">{config.label}</span>
            </div>

            <p 
              className="text-[11px] font-bold leading-tight opacity-70 tracking-tight uppercase max-w-[200px]"
              style={cf.cor_texto ? { color: cf.cor_texto } : undefined}
            >
              {data.subtitle || data.tagline || 'Sua Especialidade Profissional'}
            </p>
          </div>
        </div>

        <div 
          className={cn("flex flex-wrap justify-center gap-x-8 gap-y-3 mt-8 w-full px-6", !(data.custom_fields as any)?.cor_texto && "opacity-50")}
          style={(data.custom_fields as any)?.cor_texto ? { color: (data.custom_fields as any).cor_texto } : undefined}
        >
           {(data.area_atendimento || data.tipo_atendimento) && (
             <div className="flex items-center gap-2 bg-black/5 dark:bg-white/5 px-3 py-1.5 rounded-full">
                <Globe className="w-4 h-4 text-primary/70" />
                <span className="text-[10px] font-black uppercase tracking-wider">
                  {data.area_atendimento} • {data.tipo_atendimento}
                </span>
             </div>
           )}
           {data.horario_funcionamento && (
             <div className="flex items-center gap-2 bg-black/5 dark:bg-white/5 px-3 py-1.5 rounded-full">
                <Clock className="w-4 h-4 text-primary/70" />
                <span className="text-[10px] font-black uppercase tracking-wider">{data.horario_funcionamento}</span>
             </div>
           )}
        </div>

        {profession === 'loja_online' && (data.custom_fields as any)?.envio_nacional && (
          <div className="mt-6 flex items-center gap-3 px-5 py-2.5 rounded-2xl bg-green-500/10 text-green-600 border-2 border-green-500/20 text-[10px] font-black uppercase tracking-[0.1em] animate-pulse shadow-lg shadow-green-500/10">
            <Truck className="w-4 h-4" />
            <span>Envio para Todo Brasil</span>
          </div>
        )}
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
              "w-full h-16 rounded-[1.5rem] text-lg font-black uppercase tracking-tighter shadow-2xl border-none flex items-center justify-center gap-4 transition-all hover:scale-[1.03] active:scale-[0.97] hover:-translate-y-1",
              !(data.custom_fields as any)?.cor_botoes && (
                profession === 'loja_online' 
                  ? "bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-violet-500/40" 
                  : "bg-[#25D366] hover:bg-[#20ba59] text-white shadow-[#25D366]/30"
              )
            )}
            style={(data.custom_fields as any)?.cor_botoes ? {
               backgroundColor: (data.custom_fields as any).cor_botoes,
               color: (data.custom_fields as any)?.cor_texto_botoes || '#ffffff',
               boxShadow: `0 20px 40px -10px ${(data.custom_fields as any).cor_botoes}60`
            } : undefined}
          >
            <a href={whatsappLink} target="_blank" rel="noopener noreferrer">
              {profession === 'loja_online' ? (
                <ShoppingBag className="w-6 h-6 fill-white/20" />
              ) : (
                <MessageCircle className={cn("w-6 h-6", (data.custom_fields as any)?.cor_botoes ? "" : "fill-white")} />
              )}
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
              !(data.custom_fields as any)?.cor_botoes && "border-[#25D366] text-[#25D366] hover:bg-[#25D366]/5"
            )}
            style={(data.custom_fields as any)?.cor_botoes ? {
               borderColor: (data.custom_fields as any).cor_botoes,
               color: (data.custom_fields as any).cor_botoes,
            } : undefined}
          >
            <a href={whatsappSecondaryLink} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-2">
              <MessageCircle className="w-5 h-5 stroke-[2.5px]" />
              <span className="text-[11px] tracking-[0.2em] font-black">Segundo WhatsApp</span>
            </a>
          </Button>
        )}

        {(data.custom_fields as any)?.link_catalogo && (
          <Button 
            asChild
            className={cn(
              "w-full h-14 rounded-[1.2rem] text-[11px] font-black uppercase tracking-[0.2em] border-2 border-primary/20 bg-primary/5 hover:bg-primary/10 text-primary transition-all shadow-lg shadow-primary/5",
            )}
          >
            <a href={(data.custom_fields as any).link_catalogo.startsWith('http') ? (data.custom_fields as any).link_catalogo : `https://${(data.custom_fields as any).link_catalogo}`} target="_blank" rel="noopener noreferrer">
              <ExternalLink className="w-4 h-4 mr-2 stroke-[3px]" />
              <span>Ver Catálogo Online</span>
            </a>
          </Button>
        )}

        <div className="grid grid-cols-2 gap-3">
          {data.instagram && (
            <Button 
              asChild
              variant="outline"
              className={cn(
                "w-full h-14 rounded-[1.2rem] transition-all group overflow-hidden border-2 bg-white/50 dark:bg-slate-900/50 backdrop-blur-md border-slate-200 dark:border-white/10 hover:border-[#E1306C]/40",
              )}
            >
              <a href={`https://instagram.com/${data.instagram}`} target="_blank" rel="noopener noreferrer" className="flex flex-col items-center justify-center gap-1">
                <Instagram className="w-5 h-5 text-[#E1306C]" />
                <span className="text-[9px] font-black uppercase tracking-widest text-slate-700 dark:text-white/80">Instagram</span>
              </a>
            </Button>
          )}

          {data.website && (
            <Button 
              asChild
              variant="outline"
              className="w-full h-14 rounded-[1.2rem] transition-all group overflow-hidden border-2 bg-white/50 dark:bg-slate-900/50 backdrop-blur-md border-slate-200 dark:border-white/10 hover:border-primary/40"
            >
              <a href={data.website.startsWith('http') ? data.website : `https://${data.website}`} target="_blank" rel="noopener noreferrer" className="flex flex-col items-center justify-center gap-1">
                <Globe className="w-5 h-5 text-primary" />
                <span className="text-[9px] font-black uppercase tracking-widest text-slate-700 dark:text-white/80">Website</span>
              </a>
            </Button>
          )}
        </div>

        {(data.custom_fields as any)?.chave_pix && (data.custom_fields as any)?.tipo_chave_pix && (
          <Button 
            variant="outline"
            className="w-full h-14 rounded-[1.2rem] border-2 border-teal-500/20 bg-teal-500/5 hover:bg-teal-500/10 transition-all group overflow-hidden"
            onClick={() => {
              navigator.clipboard.writeText((data.custom_fields as any)?.chave_pix);
              toast.success('Chave PIX copiada!');
            }}
          >
            <div className="flex items-center justify-between gap-3 w-full px-4">
              <div className="flex items-center gap-3 text-teal-600 dark:text-teal-400">
                <Copy className="w-4 h-4 stroke-[3px]" />
                <span className="text-[10px] font-black uppercase tracking-widest">PIX</span>
              </div>
              <div className="flex items-center gap-3 ml-auto overflow-hidden">
                <span className="text-[9px] text-teal-600/60 font-bold uppercase truncate max-w-[60px] hidden sm:block">
                   {(data.custom_fields as any)?.tipo_chave_pix}
                </span>
                <span className="text-[11px] text-teal-700 dark:text-teal-300 font-mono font-black truncate max-w-[140px] bg-teal-500/10 px-3 py-1 rounded-lg">
                   {(data.custom_fields as any)?.chave_pix}
                </span>
              </div>
            </div>
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
            <div className="h-6 w-1.5 bg-primary rounded-full shadow-[0_0_15px_rgba(var(--primary),0.5)]" />
            <h2 className="text-[10px] font-black uppercase tracking-[0.25em] text-slate-500 dark:text-slate-400">Por que nos escolher?</h2>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {data.diferenciais.map((dif, idx) => (
              <div 
                key={idx} 
                className={cn(
                  "flex flex-col gap-3 p-5 rounded-[2rem] border-2 transition-all group",
                  isPro 
                    ? "bg-white/5 backdrop-blur-md border-white/10 hover:border-primary/30 hover:bg-white/10" 
                    : "bg-white dark:bg-slate-900 border-slate-100 dark:border-slate-800"
                )}
              >
                <div className="w-10 h-10 rounded-2xl bg-primary/10 flex items-center justify-center transition-transform group-hover:scale-110 group-hover:rotate-6">
                  {idx % 4 === 0 ? <Award className="w-5 h-5 text-primary" /> : 
                   idx % 4 === 1 ? <ShieldCheck className="w-5 h-5 text-primary" /> : 
                   idx % 4 === 2 ? <Zap className="w-5 h-5 text-primary" /> : 
                   <Clock className="w-5 h-5 text-primary" />}
                </div>
                <span className="text-[11px] font-black leading-tight tracking-tight uppercase text-slate-700 dark:text-white/90">
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
              <div className="h-6 w-1.5 bg-primary rounded-full shadow-[0_0_15px_rgba(var(--primary),0.5)]" />
              <h2 className="text-[10px] font-black uppercase tracking-[0.25em] text-slate-500 dark:text-slate-400">Serviços & Preços</h2>
            </div>
            {isPro && <Sparkles className="w-4 h-4 text-primary animate-pulse" />}
          </div>
          <div className="flex flex-col gap-4">
            {data.servicos.map((servico, idx) => (
              <div 
                key={idx} 
                className={cn(
                  "p-6 rounded-[2.5rem] border-2 transition-all relative overflow-hidden group",
                  isPro 
                    ? "bg-white/5 backdrop-blur-xl border-white/10 hover:border-primary/30 shadow-lg" 
                    : "bg-white dark:bg-slate-900 border-slate-100 dark:border-slate-800"
                )}
              >
                {/* Subtle Background Icon for Pro */}
                {isPro && (
                  <div className="absolute -right-4 -bottom-4 opacity-[0.03] group-hover:opacity-[0.07] transition-opacity">
                     <Briefcase className="w-32 h-32 rotate-12" />
                  </div>
                )}

                <div className="flex justify-between items-start gap-4 relative z-10">
                  <div className="flex-1">
                    <h3 className="text-sm font-black uppercase tracking-tight text-slate-900 dark:text-white mb-2 group-hover:text-primary transition-colors">
                      {servico.nome}
                    </h3>
                    {servico.descricao && (
                      <p className="text-[11px] font-medium text-slate-500 dark:text-slate-400 leading-relaxed max-w-[240px]">
                        {servico.descricao}
                      </p>
                    )}
                    <div className="flex items-center gap-4 mt-4">
                       {servico.duracao && (
                         <div className="flex items-center gap-1.5 text-primary/60">
                            <Clock className="w-3.5 h-3.5" />
                            <span className="text-[10px] font-black uppercase tracking-widest">{servico.duracao}</span>
                         </div>
                       )}
                    </div>
                  </div>
                  {servico.preco && (
                    <div className="flex flex-col items-end">
                      <div className="bg-primary/10 px-4 py-2 rounded-2xl border border-primary/20">
                        <span className="text-sm font-black text-primary tracking-tighter">
                          {servico.preco}
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {/* 6. BIO / ABOUT */}
      {data.bio_professional && (
        <motion.div 
          custom={5} initial="hidden" animate="visible" variants={fadeIn}
          className="px-6"
        >
           <div className={cn(
             "p-8 rounded-[3rem] border-2 transition-all",
             isPro 
               ? "bg-white/5 backdrop-blur-xl border-white/10 text-slate-300 shadow-2xl" 
               : "bg-white/80 dark:bg-slate-900/80 border-slate-100 dark:border-slate-800"
           )}
           >
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-2xl bg-primary/10 flex items-center justify-center">
                   <User className="w-5 h-5 text-primary" />
                </div>
                <h2 className="text-[10px] font-black uppercase tracking-[0.25em] text-slate-500 dark:text-slate-400">Sobre o Profissional</h2>
              </div>
              <p className="text-[13px] font-medium leading-relaxed tracking-tight text-slate-600 dark:text-slate-300 italic">
                "{data.bio_professional}"
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
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Localização</span>
                <span className="text-[11px] font-bold text-slate-700 dark:text-white/90 text-center leading-tight">
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
        <p className="text-[9px] font-black uppercase tracking-[0.3em] text-slate-500">Tecnologia por</p>
        <div className="flex items-center gap-2 grayscale brightness-50">
           <div className="w-6 h-6 bg-primary rounded-lg rotate-12 flex items-center justify-center">
              <span className="text-white text-[10px] font-black">K</span>
           </div>
           <span className="text-xs font-black tracking-tighter uppercase">Konnexy Digital</span>
        </div>
      </motion.div>

    </div>
  );
}
