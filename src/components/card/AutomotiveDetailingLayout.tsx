
"use client";

import { 
  MessageCircle, 
  MapPin, 
  Award, 
  Check, 
  ChevronRight, 
  Car, 
  Sparkles, 
  Clock, 
  ShieldCheck,
  Zap,
  Instagram,
  Linkedin,
  Facebook,
  Youtube,
  Globe
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Profile } from '@/types/profile';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

interface AutomotiveDetailingLayoutProps {
  data: Partial<Profile>;
  isPro: boolean;
}

export function AutomotiveDetailingLayout({ data, isPro }: AutomotiveDetailingLayoutProps) {
  const cf = (data.custom_fields as any) || {};
  const themeColor = data.theme_color || '#f59e0b';
  const textColor = cf.cor_texto || '#ffffff';
  
  const cleanWhatsapp = data.whatsapp?.replace(/\D/g, '') || '';
  const formattedWhatsapp = cleanWhatsapp.startsWith('55') ? cleanWhatsapp : `55${cleanWhatsapp}`;
  const whatsappLink = `https://wa.me/${formattedWhatsapp}?text=${encodeURIComponent(data.whatsapp_message || 'Olá! Gostaria de um orçamento para estética automotiva.')}`;

  const services = (data.servicos || []).map((s: any) => ({
    nome: s.nome,
    preco: s.preco,
    descricao: s.descricao,
    image: s.image_url
  }));

  return (
    <div className="w-full min-h-full bg-[#050505] text-white flex flex-col pb-20 font-sans selection:bg-amber-500 selection:text-black">
      
      {/* 1. HERO SECTION (Banner + Profile) */}
      <div className="relative w-full aspect-[4/5] overflow-hidden">
        {/* Background Image / Video */}
        <div className="absolute inset-0 z-0">
          {data.photo_url ? (
            <img 
              src={data.photo_url} 
              alt={data.business_name || ''} 
              className="w-full h-full object-cover brightness-75 contrast-125"
            />
          ) : (
            <div className="w-full h-full bg-slate-900 flex items-center justify-center">
              <Car className="w-20 h-20 opacity-10" />
            </div>
          )}
          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-transparent to-black/40" />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#050505]" />
        </div>

        {/* Content over Hero */}
        <div className="absolute bottom-10 left-0 w-full px-6 z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 mb-4">
              <Sparkles className="w-3 h-3 text-amber-500" />
              <span className="text-[10px] font-black uppercase tracking-widest text-amber-500">Premium Detailing</span>
            </div>
            
            <h1 className="text-5xl font-black tracking-tighter leading-[0.85] uppercase mb-2 drop-shadow-2xl">
              {data.business_name || 'Seu Estúdio'}
            </h1>
            <p className="text-sm font-bold opacity-60 uppercase tracking-widest max-w-[280px]">
              {data.subtitle || 'Excelência em Estética Automotiva'}
            </p>
          </motion.div>
        </div>
      </div>

      {/* 2. PRIMARY ACTIONS (Floating WhatsApp) */}
      <div className="px-6 -mt-8 relative z-20">
        <Button 
          asChild
          className="w-full h-18 rounded-2xl bg-amber-500 text-black hover:bg-amber-400 font-black uppercase tracking-tighter text-xl shadow-[0_20px_50px_rgba(245,158,11,0.3)] transition-all hover:scale-[1.02] active:scale-[0.98]"
        >
          <a href={whatsappLink} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-4">
            <MessageCircle className="w-6 h-6 fill-black" />
            <span>{data.cta_text || 'Solicitar Orçamento'}</span>
          </a>
        </Button>
      </div>

      {/* 3. QUICK INFO BADGES */}
      <div className="px-6 mt-10 grid grid-cols-2 gap-4">
        <div className="p-4 rounded-2xl bg-white/5 border border-white/10 flex flex-col gap-2">
          <Clock className="w-5 h-5 text-amber-500" />
          <span className="text-[10px] font-black uppercase tracking-widest opacity-40">Atendimento</span>
          <span className="text-xs font-bold">{data.horario_funcionamento || 'Consulte Horário'}</span>
        </div>
        <div className="p-4 rounded-2xl bg-white/5 border border-white/10 flex flex-col gap-2">
          <MapPin className="w-5 h-5 text-amber-500" />
          <span className="text-[10px] font-black uppercase tracking-widest opacity-40">Localização</span>
          <span className="text-xs font-bold truncate">{data.area_atendimento || 'Sob Consulta'}</span>
        </div>
      </div>

      {/* 4. SERVICES SHOWCASE (The Core) */}
      <div className="px-6 mt-12">
        <div className="flex items-center gap-3 mb-8">
          <div className="h-6 w-1 bg-amber-500 rounded-full shadow-[0_0_15px_rgba(245,158,11,0.5)]" />
          <h2 className="text-xs font-black uppercase tracking-[0.3em] opacity-80">Serviços Especializados</h2>
        </div>

        <div className="grid gap-6">
          {services.map((s: any, i: number) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1 }}
              className="group relative rounded-3xl overflow-hidden border border-white/5 bg-[#0f0f0f] transition-all hover:border-amber-500/30"
            >
              {/* Service Image Background (Optional) */}
              {s.image && (
                <div className="absolute right-0 top-0 w-1/3 h-full opacity-20 grayscale group-hover:grayscale-0 transition-all duration-700">
                  <img src={s.image} alt={s.nome} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-l from-transparent to-[#0f0f0f]" />
                </div>
              )}

              <div className="p-6 relative z-10 flex flex-col gap-2">
                <div className="flex justify-between items-start">
                  <h3 className="text-lg font-black uppercase tracking-tighter max-w-[70%]">{s.nome}</h3>
                  {s.preco && (
                    <span className="text-amber-500 font-black text-sm tracking-tighter bg-amber-500/10 px-3 py-1 rounded-xl">
                      {s.preco}
                    </span>
                  )}
                </div>
                {s.descricao && (
                  <p className="text-xs font-medium opacity-50 leading-relaxed max-w-[80%]">{s.descricao}</p>
                )}
                <div className="mt-2 flex items-center gap-1 text-amber-500/60 font-black text-[9px] uppercase tracking-widest group-hover:text-amber-500 transition-colors">
                  Saiba mais <ChevronRight className="w-3 h-3" />
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* 5. WHY US (Diferenciais) */}
      <div className="px-6 mt-16 pb-10">
        <div className="p-8 rounded-[3rem] bg-amber-500 text-black shadow-[0_30px_60px_-15px_rgba(245,158,11,0.3)]">
          <div className="flex items-center gap-3 mb-6">
            <ShieldCheck className="w-6 h-6" />
            <h2 className="text-sm font-black uppercase tracking-widest">Compromisso de Qualidade</h2>
          </div>
          
          <div className="grid gap-4">
            {(data.diferenciais || ['Produtos Importados', 'Garantia de Satisfação', 'Entrega no Prazo']).map((dif, i) => (
              <div key={i} className="flex items-center gap-3">
                <Check className="w-4 h-4 stroke-[3px]" />
                <span className="text-xs font-black uppercase tracking-tight">{dif}</span>
              </div>
            ))}
          </div>

          <div className="mt-8 pt-8 border-t border-black/10">
            <p className="text-sm font-bold leading-relaxed italic opacity-80">
              "{data.bio_professional || 'Tratamos cada veículo como uma obra de arte única.'}"
            </p>
          </div>
        </div>
      </div>

      {/* 6. SOCIAL & BRANDING */}
      <div className="px-6 mt-8 flex flex-col items-center gap-10">
        <div className="flex gap-6">
          {data.instagram && (
            <a href={`https://instagram.com/${data.instagram}`} target="_blank" rel="noopener noreferrer" className="p-4 rounded-2xl bg-white/5 border border-white/10 hover:bg-amber-500 hover:text-black transition-all">
              <Instagram className="w-5 h-5" />
            </a>
          )}
          <a href="#" className="p-4 rounded-2xl bg-white/5 border border-white/10 hover:bg-amber-500 hover:text-black transition-all">
            <Globe className="w-5 h-5" />
          </a>
        </div>

        <div className="flex flex-col items-center gap-4 opacity-20">
          <span className="text-[10px] font-black uppercase tracking-[0.4em]">Konnexy Digital</span>
          <div className="w-12 h-[1px] bg-white/50" />
        </div>
      </div>

    </div>
  );
}
