
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
  
  const cleanWhatsapp = data.whatsapp?.replace(/\D/g, '') || '';
  const formattedWhatsapp = cleanWhatsapp.startsWith('55') ? cleanWhatsapp : `55${cleanWhatsapp}`;
  const whatsappLink = `https://wa.me/${formattedWhatsapp}?text=${encodeURIComponent(data.whatsapp_message || 'Olá! Gostaria de um orçamento para estética automotiva.')}`;

  const services = (data.servicos || []).map((s: any) => ({
    nome: s.nome,
    preco: s.preco,
    descricao: s.descricao,
    image: s.image_url
  }));

  // Background logic: If background_video_url exists, use it. 
  // Otherwise, use a high-quality detailing photo instead of stretching the logo.
  const bgMedia = data.background_video_url || 'https://images.unsplash.com/photo-1601362840469-51e4d8d59085?q=80&w=2070&auto=format&fit=crop';
  const isVideo = bgMedia.match(/\.(mp4|webm|ogg|mov)$/i);

  return (
    <div className="w-full min-h-full bg-[#080808] text-white flex flex-col pb-20 font-sans selection:bg-amber-500 selection:text-black">
      
      {/* 1. HERO SECTION (Banner + Identity) */}
      <div className="relative w-full aspect-[4/5] overflow-hidden">
        {/* Background Media */}
        <div className="absolute inset-0 z-0">
          {isVideo ? (
            <video 
              src={bgMedia} 
              autoPlay muted loop playsInline 
              className="w-full h-full object-cover brightness-[0.4] contrast-125"
            />
          ) : (
            <img 
              src={bgMedia} 
              alt="Detailing Background" 
              className="w-full h-full object-cover brightness-[0.4] contrast-125"
            />
          )}
          {/* Gradient Overlays for Readability */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#080808] via-transparent to-black/60" />
        </div>

        {/* Brand Logo (Centered and clean) */}
        <div className="absolute inset-0 flex flex-col items-center justify-center p-6 z-10 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="flex flex-col items-center gap-6"
          >
            {data.photo_url && (
              <div className="w-32 h-32 rounded-full border-4 border-amber-500/30 p-1 bg-black/40 backdrop-blur-sm shadow-[0_0_40px_rgba(245,158,11,0.2)]">
                <img 
                  src={data.photo_url} 
                  alt={data.business_name || 'Logo'} 
                  className="w-full h-full object-contain rounded-full"
                />
              </div>
            )}
            
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500 text-black mb-2">
                <Sparkles className="w-3 h-3" />
                <span className="text-[10px] font-black uppercase tracking-widest">Premium Detailing</span>
              </div>
              
              <h1 className="text-4xl font-black tracking-tighter leading-none uppercase drop-shadow-lg">
                {data.business_name || 'Seu Estúdio'}
              </h1>
              <p className="text-xs font-bold text-amber-500/80 uppercase tracking-[0.2em] max-w-[280px] mx-auto">
                {data.subtitle || 'Excelência Automotiva'}
              </p>
            </div>
          </motion.div>
        </div>
      </div>

      {/* 2. PRIMARY ACTIONS (Floating WhatsApp) */}
      <div className="px-6 -mt-10 relative z-20">
        <Button 
          asChild
          className="w-full h-20 rounded-2xl bg-amber-500 text-black hover:bg-amber-400 font-black uppercase tracking-tighter text-xl shadow-[0_20px_60px_rgba(245,158,11,0.4)] transition-all hover:scale-[1.02] active:scale-[0.98]"
        >
          <a href={whatsappLink} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-4">
            <MessageCircle className="w-7 h-7 fill-black" />
            <span>{data.cta_text || 'Solicitar Orçamento'}</span>
          </a>
        </Button>
      </div>

      {/* 3. QUICK INFO BADGES (Solid for readability) */}
      <div className="px-6 mt-10 grid grid-cols-2 gap-4">
        <div className="p-5 rounded-2xl bg-[#121212] border border-white/5 flex flex-col gap-2 shadow-xl">
          <Clock className="w-5 h-5 text-amber-500" />
          <span className="text-[9px] font-black uppercase tracking-widest text-white/30">Atendimento</span>
          <span className="text-[11px] font-bold text-white/90 leading-tight">{data.horario_funcionamento || 'Seg a Sex: 08h-18h'}</span>
        </div>
        <div className="p-5 rounded-2xl bg-[#121212] border border-white/5 flex flex-col gap-2 shadow-xl">
          <MapPin className="w-5 h-5 text-amber-500" />
          <span className="text-[9px] font-black uppercase tracking-widest text-white/30">Localização</span>
          <span className="text-[11px] font-bold text-white/90 leading-tight truncate">{data.area_atendimento || 'Grande São Paulo'}</span>
        </div>
      </div>

      {/* 4. ADDRESS SECTION (Visible as requested) */}
      {data.endereco_completo && (
        <div className="px-6 mt-4">
          <a 
            href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(data.endereco_completo)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full p-5 rounded-2xl bg-[#121212] border border-white/5 flex items-center gap-4 hover:bg-[#181818] transition-colors"
          >
            <div className="p-3 rounded-xl bg-amber-500/10 text-amber-500">
              <MapPin className="w-5 h-5" />
            </div>
            <div className="flex flex-col gap-1 overflow-hidden">
              <span className="text-[9px] font-black uppercase tracking-widest text-white/30">Endereço Completo</span>
              <span className="text-[11px] font-bold text-white/80 leading-tight truncate">{data.endereco_completo}</span>
            </div>
          </a>
        </div>
      )}

      {/* 5. SERVICES SHOWCASE */}
      <div className="px-6 mt-12">
        <div className="flex items-center gap-3 mb-8">
          <div className="h-6 w-1 bg-amber-500 rounded-full shadow-[0_0_15px_rgba(245,158,11,0.5)]" />
          <h2 className="text-xs font-black uppercase tracking-[0.3em] opacity-60">Serviços & Tratamentos</h2>
        </div>

        <div className="grid gap-4">
          {services.map((s: any, i: number) => (
            <motion.div 
              key={i}
              className="group relative rounded-3xl overflow-hidden border border-white/5 bg-[#121212] transition-all hover:border-amber-500/30 p-6 flex flex-col gap-3 shadow-lg"
            >
              <div className="flex justify-between items-start">
                <div className="flex flex-col gap-1">
                  <h3 className="text-base font-black uppercase tracking-tight">{s.nome}</h3>
                  <div className="h-0.5 w-8 bg-amber-500 rounded-full opacity-40 group-hover:w-full transition-all duration-500" />
                </div>
                {s.preco && (
                  <span className="text-amber-500 font-black text-xs tracking-tighter bg-amber-500/10 px-3 py-1.5 rounded-xl border border-amber-500/20">
                    {s.preco}
                  </span>
                )}
              </div>
              {s.descricao && (
                <p className="text-[11px] font-medium text-white/50 leading-relaxed">{s.descricao}</p>
              )}
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
