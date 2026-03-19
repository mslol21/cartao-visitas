"use client";

import { motion, Variants } from 'framer-motion';
import { 
  MessageCircle, 
  MapPin, 
  Clock, 
  Globe, 
  Instagram, 
  CheckCircle2, 
  ChevronRight,
  Info,
  Calendar,
  Sparkles,
  Award,
  Zap,
  Crown,
  ShieldCheck,
  Home,
  Truck,
  HeartPulse,
  History,
  Copy,
  HardHat,
  Monitor,
  Smartphone,
  Check,
  ExternalLink,
  Scissors,
  ShoppingBag,
  Baby,
  Wind,
  Smile,
  Eye,
  Brush,
  Flower2,
  Waves,
  Heart
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Profile, ProfessionCategory } from '@/types/profile';
import { cn, hexToHsl } from '@/lib/utils';
import { getProfessionConfig } from '@/config/professions';
import { toast } from 'sonner';

interface StandardProfessionalLayoutProps {
  data: Partial<Profile>;
  isPro?: boolean;
}

export function StandardProfessionalLayout({ data, isPro }: StandardProfessionalLayoutProps) {
  const profession = data.profession as ProfessionCategory || 'default';
  const config = getProfessionConfig(profession);
  
  // Helpers
  const cleanWhatsapp = data.whatsapp?.replace(/\D/g, '') || '';
  const formattedWhatsapp = cleanWhatsapp.startsWith('55') ? cleanWhatsapp : `55${cleanWhatsapp}`;
  const whatsappLink = `https://wa.me/${formattedWhatsapp}?text=${encodeURIComponent(
    `Olá! Vi seu perfil na Konnexy e gostaria de saber mais sobre seu trabalho como ${config.label}.`
  )}`;

  // Animation variants
  const fadeIn: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: { 
        delay: i * 0.1, 
        duration: 0.5, 
        ease: [0.21, 1.02, 0.47, 0.98] 
      }
    })
  };

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
  const themeHex = data.theme_color || '#2563EB';

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
     if (fieldName.includes('celular')) return Smartphone;
     if (fieldName.includes('kids') || fieldName.includes('infantil')) return Baby;
     if (fieldName.includes('noiva') || fieldName.includes('festa')) return Sparkles;
     if (fieldName.includes('quimica') || fieldName.includes('relaxamento') || fieldName.includes('corte')) return Scissors;
     if (fieldName.includes('produtos') || fieldName.includes('venda')) return ShoppingBag;
     if (fieldName.includes('lavagem') || fieldName.includes('higienizacao')) return Wind;
     if (fieldName.includes('massagem') || fieldName.includes('facial') || fieldName.includes('smile')) return Smile;
     if (fieldName.includes('cilios') || fieldName.includes('sobrancelha') || fieldName.includes('olhar')) return Eye;
     if (fieldName.includes('unha') || fieldName.includes('manicure') || fieldName.includes('pigmentacao')) return Brush;
     if (fieldName.includes('pele') || fieldName.includes('estetica') || fieldName.includes('facial')) return Sparkles;
     if (fieldName.includes('spa') || fieldName.includes('drenagem') || fieldName.includes('relaxante')) return Flower2;
     if (fieldName.includes('reforma') || fieldName.includes('ferramentas') || fieldName.includes('obra')) return HardHat;
     return Award;
  };

  return (
    <div 
      className="w-full flex flex-col gap-6 pb-12 animate-in fade-in duration-700"
      style={{ '--primary': isPro ? hexToHsl(data.theme_color || '#3b82f6') : undefined } as React.CSSProperties}
    >
      
      {/* 1-5. HEADER SECTION (Identity) */}
      <motion.div 
        custom={0} initial="hidden" animate="visible" variants={fadeIn}
        className="flex flex-col items-center text-center px-4 pt-4"
      >
        <div className={cn("konnexy-aura mb-6", isPro && "scale-105")}>
          {isPro && !hasEffect && (
            <>
              <div className="aura-glow" style={{ opacity: 0.4, filter: 'blur(16px)', background: themeHex }} />
              <div className="aura-arc" style={{ borderTopColor: themeHex, borderRightColor: themeHex }} />
            </>
          )}

          {hasEffect && (
            <div
              className="absolute rounded-full z-[5]"
              style={{ inset: '-6px', ...ringStyles[effect], animation: ringAnimations[effect] }}
            />
          )}

          <div className={cn(
            "relative w-32 h-32 rounded-full border-4 shadow-2xl overflow-hidden z-10 transition-all duration-700",
            isPro ? "border-white/20" : "border-white dark:border-slate-800"
          )}
          style={isPro ? { borderColor: themeHex + '60' } : {}}
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
            <div className="absolute -bottom-1 right-1 p-1 bg-white dark:bg-slate-900 rounded-full shadow-lg z-20">
              <div className="p-1 rounded-full bg-primary/10">
                <Crown className="w-3 h-3 text-primary shadow-sm" />
              </div>
            </div>
          )}
        </div>

        <h1 
          className="text-3xl font-black tracking-tighter text-slate-900 dark:text-white mb-2 leading-none uppercase"
          style={(data.custom_fields as any)?.cor_texto ? { color: (data.custom_fields as any).cor_texto } : undefined}
        >
          {data.business_name || 'Seu Negócio'}
        </h1>
        
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary border border-primary/20 mb-4">
           {profession === 'barbearia' && <Scissors className="w-3.5 h-3.5 stroke-[2.5px]" />}
           {profession === 'cabeleireiro' && <Scissors className="w-3.5 h-3.5 stroke-[2.5px]" />}
           {profession === 'manicure' && <Brush className="w-3.5 h-3.5 stroke-[2.5px]" />}
           {(profession === 'esteticista' || profession === 'beauty') && <Sparkles className="w-3.5 h-3.5 stroke-[2.5px]" />}
           <span className="text-[10px] font-black uppercase tracking-[0.2em]">{config.label}</span>
        </div>

        {(data.subtitle || data.tagline) && (
          <p 
            className="text-sm font-medium text-slate-500 dark:text-slate-400 max-w-[280px] italic leading-relaxed"
            style={(data.custom_fields as any)?.cor_texto ? { color: (data.custom_fields as any).cor_texto } : undefined}
          >
            &quot;{data.subtitle || data.tagline}&quot;
          </p>
        )}

        <div 
          className={cn("flex flex-wrap justify-center gap-x-6 gap-y-2 mt-6 w-full", !(data.custom_fields as any)?.cor_texto && "opacity-60")}
          style={(data.custom_fields as any)?.cor_texto ? { color: (data.custom_fields as any).cor_texto } : undefined}
        >
           {(data.area_atendimento || data.tipo_atendimento) && (
             <div className="flex items-center gap-1.5">
                <Globe className="w-3.5 h-3.5" />
                <span className="text-[10px] font-bold uppercase tracking-widest">
                  {data.area_atendimento} • {data.tipo_atendimento}
                </span>
             </div>
           )}
           {data.horario_funcionamento && (
             <div className="flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5" />
                <span className="text-[10px] font-bold uppercase tracking-widest">{data.horario_funcionamento}</span>
             </div>
           )}
        </div>
      </motion.div>

      {/* 6. MAIN CONTACT GROUP */}
      <motion.div 
        custom={1} initial="hidden" animate="visible" variants={fadeIn}
        className="px-6 flex flex-col gap-3"
      >
        <Button 
          asChild
          className={cn(
            "w-full h-14 rounded-[1.2rem] text-base font-black uppercase tracking-tighter shadow-lg border-none flex items-center justify-center gap-3 transition-transform hover:scale-[1.02]",
            !(data.custom_fields as any)?.cor_botoes && "bg-[#25D366] hover:bg-[#20ba59] text-white shadow-[#25D366]/20"
          )}
          style={(data.custom_fields as any)?.cor_botoes ? {
             backgroundColor: (data.custom_fields as any).cor_botoes,
             color: (data.custom_fields as any)?.cor_texto_botoes || '#ffffff',
             boxShadow: `0 10px 15px -3px ${(data.custom_fields as any).cor_botoes}40`
          } : undefined}
        >
          <a href={whatsappLink} target="_blank" rel="noopener noreferrer">
            <MessageCircle className={cn("w-5 h-5", (data.custom_fields as any)?.cor_botoes ? "" : "fill-white")} />
            <span>Chamar no WhatsApp</span>
          </a>
        </Button>

        {data.instagram && (
          <Button 
            asChild
            variant="outline"
            className="w-full h-12 rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all group overflow-hidden"
          >
            <a href={`https://instagram.com/${data.instagram}`} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-2">
              <Instagram className="w-4 h-4 text-[#E1306C]" />
              <span className="text-[10px] font-black uppercase tracking-widest text-slate-700 dark:text-white/80">Instagram</span>
              <span className="text-[9px] text-slate-400 font-bold ml-auto opacity-60 group-hover:opacity-100">@{data.instagram}</span>
              <ChevronRight className="w-3 h-3 text-slate-300 ml-1" />
            </a>
          </Button>
        )}

        {data.website && (
          <Button 
            asChild
            variant="outline"
            className="w-full h-12 rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all group overflow-hidden"
          >
            <a href={data.website.startsWith('http') ? data.website : `https://${data.website}`} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-2">
              <Globe className="w-4 h-4 text-primary" />
              <span className="text-[10px] font-black uppercase tracking-widest text-slate-700 dark:text-white/80">Website Profissional</span>
              <ChevronRight className="w-3 h-3 text-slate-300 ml-auto" />
            </a>
          </Button>
        )}

        {(data.custom_fields as any)?.chave_pix && (data.custom_fields as any)?.tipo_chave_pix && (
          <Button 
            variant="outline"
            className="w-full h-12 rounded-xl border border-teal-500/30 bg-teal-500/5 hover:bg-teal-500/10 transition-all group overflow-hidden"
            onClick={() => {
              navigator.clipboard.writeText((data.custom_fields as any)?.chave_pix);
              toast.success('Chave PIX copiada!');
            }}
          >
            <div className="flex items-center justify-between gap-2 w-full px-2">
              <div className="flex items-center gap-2 text-teal-600 dark:text-teal-400">
                <Copy className="w-4 h-4" />
                <span className="text-[10px] font-black uppercase tracking-widest hidden sm:inline">Copiar PIX</span>
                <span className="text-[10px] font-black uppercase tracking-widest sm:hidden">PIX</span>
              </div>
              <div className="flex items-center gap-2 ml-auto">
                <span className="text-[9px] text-teal-600/80 dark:text-teal-400/80 font-bold uppercase truncate max-w-[80px]">
                   {(data.custom_fields as any)?.tipo_chave_pix === 'cpf_cnpj' ? 'CPF/CNPJ' : 
                    (data.custom_fields as any)?.tipo_chave_pix === 'celular' ? 'Celular' : 
                    (data.custom_fields as any)?.tipo_chave_pix === 'email' ? 'E-mail' : 'Variada'}
                </span>
                <span className="text-[10px] text-teal-700 dark:text-teal-300 font-mono font-bold truncate max-w-[100px] bg-teal-500/10 px-2 py-0.5 rounded">
                   {(data.custom_fields as any)?.chave_pix}
                </span>
              </div>
            </div>
          </Button>
        )}

      </motion.div>

      {/* 7. BIO PROFISSIONAL */}
      {data.bio_profissional && (
        <motion.div 
          custom={2} initial="hidden" animate="visible" variants={fadeIn}
          className="px-6"
        >
          <div className="p-6 rounded-[2rem] bg-white/90 dark:bg-black/60 backdrop-blur-md border border-slate-200 dark:border-white/10 relative overflow-hidden">
             <div className="absolute top-0 right-0 p-4 opacity-[0.03] pointer-events-none">
                <Info className="w-24 h-24" />
             </div>
             <h4 
               className="text-[10px] font-black uppercase tracking-[0.3em] text-primary mb-3"
               style={(data.custom_fields as any)?.cor_texto ? { color: (data.custom_fields as any).cor_texto } : undefined}
             >
               Sobre Mim
             </h4>
             <p 
               className={cn("text-sm font-medium leading-relaxed text-justify", !(data.custom_fields as any)?.cor_texto && "text-slate-700 dark:text-slate-300")}
               style={(data.custom_fields as any)?.cor_texto ? { color: (data.custom_fields as any).cor_texto } : undefined}
             >
               {data.bio_profissional}
             </p>
          </div>
        </motion.div>
      )}

      {/* 8. DIFERENCIAIS */}
      {data.diferenciais && data.diferenciais.length > 0 && (
        <motion.div 
          custom={3} initial="hidden" animate="visible" variants={fadeIn}
          className="px-6"
        >
          <h4 
            className={cn("text-[11px] font-black uppercase tracking-[0.3em] text-center mb-6", !(data.custom_fields as any)?.cor_texto && "opacity-30")}
            style={(data.custom_fields as any)?.cor_texto ? { color: (data.custom_fields as any).cor_texto } : undefined}
          >
            Por que me escolher?
          </h4>
          <div className="grid grid-cols-1 gap-3">
            {data.diferenciais.map((item, idx) => (
              <div key={idx} className="flex items-center gap-4 p-4 rounded-2xl bg-white/90 dark:bg-black/60 backdrop-blur-md border border-slate-100 dark:border-white/10 shadow-sm">
                 <div className="w-8 h-8 rounded-xl bg-green-500/10 flex items-center justify-center shrink-0">
                    <CheckCircle2 className="w-4 h-4 text-green-500" />
                 </div>
                 <span 
                   className="text-xs font-black uppercase tracking-tight text-slate-700 dark:text-slate-200"
                   style={(data.custom_fields as any)?.cor_texto ? { color: (data.custom_fields as any).cor_texto } : undefined}
                 >
                   {item}
                 </span>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {/* 9. SERVIÇOS */}
      {((data.servicos && data.servicos.length > 0) || (data.services && data.services.length > 0)) && (
        <motion.div 
          custom={4} initial="hidden" animate="visible" variants={fadeIn}
          className="px-6"
        >
          <div className="flex items-center gap-3 mb-6">
             <div className="h-px flex-1 bg-slate-200 dark:bg-white/10" />
             <span 
               className={cn("text-[10px] font-black uppercase tracking-[0.4em]", !(data.custom_fields as any)?.cor_texto && "opacity-40 text-slate-900 dark:text-white")}
               style={(data.custom_fields as any)?.cor_texto ? { color: (data.custom_fields as any).cor_texto } : undefined}
             >
               Nossos Serviços
             </span>
             <div className="h-px flex-1 bg-slate-200 dark:bg-white/10" />
          </div>
          
           <div className="space-y-3">
             {(data.servicos && data.servicos.length > 0 ? data.servicos : (data.services || [])).map((s: any, idx) => {
               const service = {
                 nome: typeof s === 'string' ? s : (s.nome || s.name),
                 preco: typeof s === 'string' ? '' : (s.preco || s.price),
                 descricao: typeof s === 'string' ? '' : (s.descricao || s.description)
               };
               
               if (!service.nome) return null;

               const serviceMessage = service.preco && service.preco.toLowerCase() !== 'sob consulta'
                 ? `Olá! Vi seu perfil na Konnexy e gostaria de saber mais sobre o serviço: *${service.nome}* no valor de *${service.preco}*.`
                 : `Olá! Vi seu perfil na Konnexy e gostaria de saber mais sobre o serviço: *${service.nome}*.`;
               const serviceWhatsappLink = formattedWhatsapp ? `https://wa.me/${formattedWhatsapp}?text=${encodeURIComponent(serviceMessage)}` : '#';

               return (
                 <a key={idx} href={serviceWhatsappLink} target={formattedWhatsapp ? "_blank" : "_self"} rel="noopener noreferrer" className="block group p-5 rounded-[1.8rem] bg-white/90 dark:bg-black/60 backdrop-blur-md border border-slate-100 dark:border-white/10 hover:border-primary/40 transition-all shadow-sm hover:-translate-y-1 hover:shadow-md">
                    <div className="flex justify-between items-start sm:items-center w-full gap-3">
                       <div className="flex flex-col gap-1 flex-1 min-w-0">
                          <span 
                            className="text-sm font-black uppercase tracking-tighter text-slate-800 dark:text-white group-hover:text-primary transition-colors line-clamp-2"
                            style={(data.custom_fields as any)?.cor_texto ? { color: (data.custom_fields as any).cor_texto } : undefined}
                          >
                            {service.nome}
                          </span>
                          {service.descricao && (
                            <p 
                              className={cn("text-[10px] leading-tight italic line-clamp-3 sm:line-clamp-2", !(data.custom_fields as any)?.cor_texto && "text-slate-500 opacity-70")}
                              style={(data.custom_fields as any)?.cor_texto ? { color: (data.custom_fields as any).cor_texto } : undefined}
                            >
                              {service.descricao}
                            </p>
                          )}
                       </div>
                       <div className="flex flex-col items-end gap-1 shrink-0 max-w-[40%] text-right pt-0.5 sm:pt-0">
                          <span className="text-sm sm:text-base font-black text-primary leading-tight break-all sm:break-normal">{service.preco || 'Sob consulta'}</span>
                          <span className="text-[8px] sm:text-[9px] font-bold text-slate-400 flex items-center gap-1 group-hover:text-primary transition-colors mt-1">
                            Agendar <ChevronRight className="w-3 h-3 text-white bg-primary rounded-full p-0.5 group-hover:scale-110 transition-transform flex-shrink-0" />
                          </span>
                       </div>
                    </div>
                 </a>
               );
             })}
           </div>
        </motion.div>
      )}

      {/* 10. CUSTOM FIELDS (Profession Specific) */}
      {config.customFields.length > 0 && (
        <motion.div 
          custom={5} initial="hidden" animate="visible" variants={fadeIn}
          className="px-6"
        >
          <div className="grid grid-cols-2 gap-3">
            {config.customFields.map((field) => {
              const value = (data.custom_fields as any)?.[field.name];
              if (!value && typeof value !== 'boolean') return null;
              if (field.type === 'boolean' && value === false) return null;

              const Icon = getFieldIcon(field.name);
              const displayLabel = field.label.replace(/\s*\(.*?\)\s*/g, '');
              const isArray = field.type === 'array' || Array.isArray(value);

              return (
                <div key={field.name} className={cn("p-4 rounded-[1.5rem] bg-primary/5 border border-primary/20 flex flex-col items-center text-center gap-2 group hover:bg-primary/10 transition-colors", isArray ? "col-span-2" : "")}>
                   {field.type === 'boolean' ? (
                     <>
                        <Icon className="w-5 h-5 text-primary group-hover:scale-110 transition-transform" />
                        <span className="text-[10px] font-black uppercase tracking-tight leading-tight">{displayLabel}</span>
                        <Check className="w-3 h-3 text-primary/40" />
                     </>
                   ) : isArray ? (
                     <>
                        <div className="flex items-center gap-2 mb-1">
                           <Icon className="w-4 h-4 text-primary/50" />
                           <span className="text-[9px] font-black uppercase tracking-widest opacity-50">{displayLabel}</span>
                        </div>
                        <div className="flex flex-wrap items-center justify-center gap-1.5 w-full">
                           {(Array.isArray(value) ? value : String(value).split(/[,;]/)).map((item: string, i: number) => {
                             const trimmed = item.trim();
                             if (!trimmed) return null;
                             return (
                               <span key={i} className="text-[10px] font-bold text-slate-800 dark:text-slate-100 bg-white dark:bg-slate-800 border border-primary/10 dark:border-primary/20 px-3 py-1.5 rounded-full shadow-sm">
                                 {trimmed}
                               </span>
                             );
                           })}
                        </div>
                     </>
                   ) : (
                     <>
                        <Icon className="w-5 h-5 text-primary/40" />
                        <div className="flex flex-col gap-0.5">
                           <span className="text-[8px] font-black uppercase tracking-widest opacity-40">{displayLabel}</span>
                           <span className="text-[11px] font-black text-slate-800 dark:text-white uppercase leading-tight italic tracking-tighter">
                             {value}
                           </span>
                        </div>
                     </>
                   )}
                </div>
              );
            })}
          </div>
        </motion.div>
      )}

      {/* 11. ENDEREÇO */}
      {data.has_physical_location && data.endereco_completo && (
        <motion.div 
          custom={6} initial="hidden" animate="visible" variants={fadeIn}
          className="px-6"
        >
          <div className="p-6 rounded-[2rem] bg-primary text-white shadow-2xl shadow-primary/20 relative overflow-hidden">
             <div className="absolute top-0 right-0 p-4 opacity-20 pointer-events-none">
                <MapPin className="w-16 h-16" />
             </div>
             <div className="flex items-center gap-2 mb-4">
                <MapPin className="w-4 h-4" />
                <span className="text-[10px] font-black uppercase tracking-widest opacity-80">Localização Física</span>
             </div>
             <p className="text-xs font-bold leading-relaxed mb-6">{data.endereco_completo}</p>
             <Button asChild variant="secondary" className="w-full h-11 rounded-xl font-black uppercase text-[10px] tracking-widest">
                <a href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(data.endereco_completo)}`} target="_blank" rel="noopener noreferrer">
                   Ver no Mapa
                </a>
             </Button>
          </div>
        </motion.div>
      )}


      {/* 12. LINKS PERSONALIZADOS */}
      {data.custom_links && data.custom_links.length > 0 && (
        <motion.div 
          custom={7} initial="hidden" animate="visible" variants={fadeIn}
          className="px-6 space-y-3 scroll-mt-20"
          id="custom-links-section"
        >
          <div className="flex items-center gap-3">
            <span 
              className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400"
              style={(data.custom_fields as any)?.cor_texto ? { color: (data.custom_fields as any).cor_texto } : undefined}
            >
              Links Úteis
            </span>
            <div className="h-px flex-1 bg-slate-200 dark:bg-slate-800" />
          </div>
          <div className="flex flex-col gap-3">
            {data.custom_links.map((link, idx) => (
              <Button 
                key={idx} 
                asChild 
                variant={(data.custom_fields as any)?.cor_botoes ? "default" : "outline"} 
                className={cn(
                  "w-full h-14 rounded-2xl transition-all font-bold text-sm justify-between group px-6",
                  !(data.custom_fields as any)?.cor_botoes && "border-slate-200 dark:border-slate-800 hover:bg-primary/5 hover:border-primary/30"
                )}
                style={(data.custom_fields as any)?.cor_botoes ? {
                   backgroundColor: (data.custom_fields as any).cor_botoes,
                   color: (data.custom_fields as any)?.cor_texto_botoes || '#ffffff',
                   boxShadow: `0 4px 14px 0 ${(data.custom_fields as any).cor_botoes}40`
                } : undefined}
              >
                <a href={link.url.startsWith('http') ? link.url : `https://${link.url}`} target="_blank" rel="noopener noreferrer" className="w-full flex items-center justify-between">
                  <span className="truncate">{link.title}</span>
                  <ExternalLink className="w-4 h-4 opacity-70 group-hover:scale-110 transition-transform shrink-0" />
                </a>
              </Button>
            ))}
          </div>
        </motion.div>
      )}

      {/* 13. HORÁRIO DE FUNCIONAMENTO */}
      {data.business_hours && Object.values(data.business_hours).some(v => v) && (
        <motion.div 
          custom={8} initial="hidden" animate="visible" variants={fadeIn}
          className="px-6"
        >
          <div className="p-6 rounded-[2rem] bg-white/90 dark:bg-black/60 backdrop-blur-md border border-slate-200 dark:border-white/10">
             <div className="flex items-center gap-2 mb-4">
                <Clock className="w-4 h-4 text-primary" />
                <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Horário de Funcionamento</span>
             </div>
             <div className="space-y-2">
                {['Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado', 'Dom'].map((day) => {
                  const hours = data.business_hours?.[day];
                  if (!hours) return null;
                  return (
                    <div key={day} className="flex justify-between items-center text-[11px] font-bold">
                       <span className="opacity-40 uppercase tracking-widest">{day}</span>
                       <span className="text-slate-900 dark:text-white">{hours}</span>
                    </div>
                  );
                })}
             </div>
          </div>
        </motion.div>
      )}

      {/* PLATFORM BRANDING */}
      <div className="mt-12 flex flex-col items-center gap-4 opacity-30">
        <div className="h-px w-12 bg-slate-400" />
        <p className="text-[8px] font-black uppercase tracking-[0.6em] text-slate-500 dark:text-slate-400">Digital Presence by KONNEXY™</p>
      </div>

    </div>
  );
}
