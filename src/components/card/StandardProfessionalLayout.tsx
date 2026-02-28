"use client";

import { motion } from 'framer-motion';
import { 
  MessageCircle, 
  MapPin, 
  Clock, 
  Globe, 
  Instagram, 
  CheckCircle2, 
  ChevronRight, 
  ArrowRight,
  Info,
  Calendar,
  Sparkles,
  Award,
  Zap
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Profile, Service, CustomFields, ProfessionCategory } from '@/types/profile';
import { cn } from '@/lib/utils';
import Image from 'next/image';
import { getProfessionConfig } from '@/config/professions';

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
  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: { delay: i * 0.1, duration: 0.5, ease: [0.21, 1.02, 0.47, 0.98] }
    })
  };

  return (
    <div className="w-full flex flex-col gap-8 pb-12 animate-in fade-in duration-700">
      
      {/* 1-5. HEADER SECTION (Identity) */}
      <motion.div 
        custom={0} initial="hidden" animate="visible" variants={fadeIn}
        className="flex flex-col items-center text-center px-4"
      >
        <div className="relative w-32 h-32 mb-6 group">
          <div className={cn(
            "absolute inset-0 rounded-full blur-2xl opacity-20 animate-pulse",
            `bg-${config.theme.color}-500`
          )} />
          <div className="relative w-full h-full rounded-full border-4 border-white dark:border-slate-800 shadow-2xl overflow-hidden z-10">
            {data.photo_url ? (
               <img src={data.photo_url} alt={data.business_name} className="w-full h-full object-cover transition-transform group-hover:scale-110 duration-700" />
            ) : (
               <div className="w-full h-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                  <span className="text-4xl font-black opacity-20">{data.business_name?.[0] || '?'}</span>
               </div>
            )}
          </div>
        </div>

        <h1 className="text-3xl font-black tracking-tighter text-slate-900 dark:text-white mb-2 leading-none uppercase">
          {data.business_name || 'Seu Negócio'}
        </h1>
        
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary border border-primary/20 mb-4">
           <span className="text-[10px] font-black uppercase tracking-[0.2em]">{config.label}</span>
        </div>

        {(data.subtitle || data.tagline) && (
          <p className="text-sm font-medium text-slate-500 dark:text-slate-400 max-w-[280px] italic leading-relaxed">
            "{data.subtitle || data.tagline}"
          </p>
        )}

        <div className="flex flex-wrap justify-center gap-x-6 gap-y-2 mt-6 w-full opacity-60">
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

      {/* 6. MAIN CTA */}
      <motion.div 
        custom={1} initial="hidden" animate="visible" variants={fadeIn}
        className="px-6"
      >
        <Button 
          asChild
          className={cn(
            "w-full h-16 rounded-[1.5rem] text-lg font-black uppercase tracking-tighter shadow-xl transition-all hover:scale-[1.02] border-none flex items-center justify-center gap-3",
            "bg-[#25D366] hover:bg-[#20ba59] text-white shadow-[#25D366]/20"
          )}
        >
          <a href={whatsappLink} target="_blank" rel="noopener noreferrer">
            <MessageCircle className="w-6 h-6 fill-white" />
            <span>Chamar no WhatsApp</span>
            <ArrowRight className="w-5 h-5 ml-auto opacity-40" />
          </a>
        </Button>
      </motion.div>

      {/* 7. BIO PROFISSIONAL */}
      {data.bio_profissional && (
        <motion.div 
          custom={2} initial="hidden" animate="visible" variants={fadeIn}
          className="px-6"
        >
          <div className="p-6 rounded-[2rem] bg-slate-100/50 dark:bg-white/5 border border-slate-200 dark:border-white/10 relative overflow-hidden">
             <div className="absolute top-0 right-0 p-4 opacity-[0.03] pointer-events-none">
                <Info className="w-24 h-24" />
             </div>
             <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-primary mb-3">Sobre Mim</h4>
             <p className="text-sm font-medium text-slate-700 dark:text-slate-300 leading-relaxed text-justify">
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
          <h4 className="text-[11px] font-black uppercase tracking-[0.3em] text-center mb-6 opacity-30">Por que me escolher?</h4>
          <div className="grid grid-cols-1 gap-3">
            {data.diferenciais.map((item, idx) => (
              <div key={idx} className="flex items-center gap-4 p-4 rounded-2xl bg-white/50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-sm">
                 <div className="w-8 h-8 rounded-xl bg-green-500/10 flex items-center justify-center shrink-0">
                    <CheckCircle2 className="w-4 h-4 text-green-500" />
                 </div>
                 <span className="text-xs font-black uppercase tracking-tight text-slate-700 dark:text-slate-200">{item}</span>
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
             <span className="text-[10px] font-black uppercase tracking-[0.4em] opacity-40">Nossos Serviços</span>
             <div className="h-px flex-1 bg-slate-200 dark:bg-white/10" />
          </div>
          
          <div className="space-y-3">
            {(data.servicos && data.servicos.length > 0 ? data.servicos : (data.services || []).map(s => ({
              nome: typeof s === 'string' ? s : s.name,
              preco: typeof s === 'string' ? '' : s.price,
              descricao: typeof s === 'string' ? '' : s.description
            }))).map((service: any, idx) => (
              <div key={idx} className="group p-5 rounded-[1.8rem] bg-white dark:bg-white/5 border border-slate-100 dark:border-white/10 hover:border-primary/40 transition-all flex justify-between items-center shadow-sm">
                 <div className="flex flex-col gap-1">
                    <span className="text-sm font-black uppercase tracking-tighter text-slate-800 dark:text-white">{service.nome}</span>
                    {service.descricao && <p className="text-[10px] text-slate-500 leading-tight italic opacity-70">{service.descricao}</p>}
                 </div>
                 <div className="flex flex-col items-end gap-1">
                    <span className="text-sm font-black text-primary">{service.preco || 'Sob consulta'}</span>
                    <ChevronRight className="w-3 h-3 opacity-20 bg-primary/10 rounded-full" />
                 </div>
              </div>
            ))}
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
              if (!value) return null;

              return (
                <div key={field.name} className="p-4 rounded-[1.5rem] bg-primary/5 border border-primary/20 flex flex-col items-center text-center gap-2">
                   {field.type === 'boolean' ? (
                     <>
                        <Zap className="w-5 h-5 text-primary" />
                        <span className="text-[10px] font-black uppercase tracking-tight leading-tight">{field.label}</span>
                        <div className="w-6 h-1 bg-primary rounded-full" />
                     </>
                   ) : (
                     <>
                        <Award className="w-5 h-5 text-primary" />
                        <span className="text-[8px] font-black uppercase tracking-widest opacity-40">{field.label}</span>
                        <span className="text-[11px] font-black text-slate-800 dark:text-white uppercase leading-tight italic tracking-tighter">
                          {Array.isArray(value) ? value.join(', ') : value}
                        </span>
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

      {/* 12. INSTAGRAM */}
      {data.instagram && (
        <motion.div 
          custom={7} initial="hidden" animate="visible" variants={fadeIn}
          className="px-6"
        >
          <Button 
            asChild
            variant="outline"
            className="w-full h-14 rounded-2xl border-none bg-gradient-to-r from-[#833ab4]/10 via-[#fd1d1d]/10 to-[#fcb045]/10 hover:scale-[1.02] transition-all group overflow-hidden"
          >
            <a href={`https://instagram.com/${data.instagram}`} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-3">
              <Instagram className="w-5 h-5 text-[#E1306C]" />
              <span className="text-xs font-black uppercase tracking-widest text-[#E1306C]">Siga no Instagram</span>
              <span className="text-[10px] opacity-40 font-bold ml-1">@{data.instagram}</span>
            </a>
          </Button>
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
