
"use client";

import { 
  MessageCircle, MapPin, Award, Check, ChevronRight, Car, Sparkles, Clock, ShieldCheck,
  Zap, Instagram, Linkedin, Facebook, Youtube, Globe, Copy, Home, Calendar, Truck,
  Monitor, History, HeartPulse, Smartphone, Calculator, Receipt, HardHat, PawPrint,
  UserPlus, GraduationCap, Package, Gem, Landmark, Building2, Scale, Brush, Flower2,
  CheckCircle2, Coffee, Wifi, Heart, User, QrCode, Image as ImageIcon
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Profile } from '@/types/profile';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import { AnimatedQR } from '@/components/pro/AnimatedQR';

interface AutomotiveDetailingLayoutProps {
  data: Partial<Profile>;
  isPro: boolean;
}

export function AutomotiveDetailingLayout({ data, isPro }: AutomotiveDetailingLayoutProps) {
  // --- DATA EXTRACTION ---
  const cf = (data as any).custom_fields || (data as any).customFields || {};
  const merged = { ...data, ...cf };
  
  // Bio
  const bio = merged.bio_profissional || merged.bio_professional || merged.bio || merged.biografia || '';
  
  // Services
  const sRaw = merged.servicos || merged.services || (data as any).service_list || [];
  const services = Array.isArray(sRaw) ? sRaw.map(s => {
    if (typeof s === 'string') return { nome: s };
    if (s && typeof s === 'object') return {
      nome: s.nome || s.name || s.titulo || '',
      preco: s.preco || s.price || s.valor || '',
      descricao: s.descricao || s.description || ''
    };
    return null;
  }).filter(s => s && s.nome) : [];

  // Differentials (Improved splitting for strings)
  const dRaw = merged.diferenciais || merged.differentials || merged.highlights || [];
  let differentials: string[] = [];
  if (Array.isArray(dRaw)) {
    differentials = dRaw.filter(d => typeof d === 'string' && d.trim().length > 0);
  } else if (typeof dRaw === 'string') {
    differentials = dRaw.split('\n').map(d => d.trim()).filter(d => d.length > 0);
  }

  // WhatsApp
  const cleanWhatsapp = (data.whatsapp || '').replace(/\D/g, '');
  const formattedWhatsapp = cleanWhatsapp.startsWith('55') ? cleanWhatsapp : `55${cleanWhatsapp}`;
  const whatsappLink = `https://wa.me/${formattedWhatsapp}?text=${encodeURIComponent(data.whatsapp_message || 'Olá! Gostaria de um orçamento.')}`;

  return (
    <div className="relative w-full min-h-screen bg-[#080808] text-white flex flex-col pb-20 overflow-x-hidden">
      
      {/* HERO / BACKGROUND SECTION */}
      <div className="relative w-full h-[65vh] shrink-0 overflow-hidden flex flex-col items-center justify-center pt-10 pb-16">
        {/* Background Image/Video */}
        <div className="absolute inset-0 z-0">
          {data.background_video_url?.match(/\.(mp4|webm|ogg|mov)$/i) ? (
            <video src={data.background_video_url} autoPlay muted loop playsInline className="w-full h-full object-cover brightness-[0.35]" />
          ) : (
            <img src={data.background_video_url || 'https://images.unsplash.com/photo-1601362840469-51e4d8d59085'} alt="B" className="w-full h-full object-cover brightness-[0.35]" />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-[#080808] via-transparent to-black/20" />
        </div>

        {/* Logo & Identity */}
        <div className="relative z-10 flex flex-col items-center gap-6 px-6 text-center">
          {data.photo_url && (
            <div className="w-28 h-28 rounded-full border-4 border-amber-500/20 p-1 bg-black/40 backdrop-blur-md">
              <img src={data.photo_url} alt="Logo" className="w-full h-full object-contain rounded-full" />
            </div>
          )}
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500 text-black text-[9px] font-black uppercase tracking-widest shadow-lg">
              <Sparkles className="w-3 h-3 fill-black" />
              <span>Premium Detailing</span>
            </div>
            <h1 className="text-4xl sm:text-5xl font-black uppercase tracking-tighter leading-none drop-shadow-2xl">
              {data.business_name || 'Studio G3'}
            </h1>
            <p className="text-[11px] font-bold text-amber-500/90 uppercase tracking-[0.2em] max-w-[280px] mx-auto leading-relaxed">
              {data.subtitle || 'Excelência Automotiva'}
            </p>
          </div>
        </div>
      </div>

      {/* PRIMARY CTA & QUICK INFO */}
      <div className="px-6 -mt-1 relative z-20 flex flex-col gap-4">
        <Button asChild className="w-full h-20 rounded-[2rem] bg-amber-500 text-black font-black uppercase tracking-tighter text-xl shadow-[0_20px_50px_rgba(245,158,11,0.35)] hover:scale-[1.02] active:scale-[0.98] transition-all">
          <a href={whatsappLink} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3">
            <MessageCircle className="w-7 h-7 fill-black" />
            <span>{data.cta_text || 'Chamar no WhatsApp'}</span>
          </a>
        </Button>

        <div className="grid grid-cols-2 gap-3">
          <div className="p-5 rounded-3xl bg-[#121212]/90 backdrop-blur-sm border border-white/5 flex flex-col gap-1 shadow-xl">
            <Clock className="w-4 h-4 text-amber-500" />
            <span className="text-[8px] font-black uppercase tracking-widest text-white/20">Atendimento</span>
            <span className="text-[10px] font-bold text-white/90 leading-tight">{data.horario_funcionamento || 'Fale Conosco'}</span>
          </div>
          <div className="p-5 rounded-3xl bg-[#121212]/90 backdrop-blur-sm border border-white/5 flex flex-col gap-1 shadow-xl">
            <MapPin className="w-4 h-4 text-amber-500" />
            <span className="text-[8px] font-black uppercase tracking-widest text-white/20">Localização</span>
            <span className="text-[10px] font-bold text-white/90 leading-tight truncate">{data.area_atendimento || 'Sob Consulta'}</span>
          </div>
        </div>
      </div>

      {/* DIFFERENTIALS SECTION */}
      {differentials.length > 0 && (
        <div className="px-6 mt-16">
          <div className="flex items-center gap-3 mb-8">
            <div className="h-6 w-1 bg-amber-500 rounded-full shadow-[0_0_15px_rgba(245,158,11,0.5)]" />
            <h2 className="text-[11px] font-black uppercase tracking-[0.3em] opacity-40">Nossos Diferenciais</h2>
          </div>
          <div className="flex flex-col gap-3">
            {differentials.map((d, i) => (
              <div key={i} className="flex items-center gap-4 p-5 rounded-2xl bg-[#121212] border border-white/5 shadow-lg group hover:border-amber-500/20 transition-all">
                <div className="w-8 h-8 rounded-xl bg-amber-500/10 flex items-center justify-center shrink-0">
                  <CheckCircle2 className="w-5 h-5 text-amber-500" />
                </div>
                <span className="text-xs font-black uppercase tracking-tight text-white/80">{d}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SERVICES CATALOG */}
      {services.length > 0 && (
        <div className="px-6 mt-16">
          <div className="flex items-center gap-3 mb-8">
            <div className="h-6 w-1 bg-amber-500 rounded-full shadow-[0_0_15px_rgba(245,158,11,0.5)]" />
            <h2 className="text-[11px] font-black uppercase tracking-[0.3em] opacity-40">Catálogo de Serviços</h2>
          </div>
          <div className="flex flex-col gap-3">
            {services.map((s, i) => (
              <div key={i} className="p-6 rounded-[2.5rem] bg-[#121212] border border-white/5 flex flex-col gap-3 shadow-2xl hover:border-amber-500/30 transition-all group">
                <div className="flex justify-between items-start gap-4">
                  <h3 className="text-sm font-black uppercase text-amber-500 group-hover:text-amber-400 transition-colors">{s.nome}</h3>
                  {s.preco && (
                    <span className="shrink-0 text-[10px] font-black bg-amber-500/10 text-amber-500 px-3 py-1 rounded-full border border-amber-500/20">
                      {s.preco}
                    </span>
                  )}
                </div>
                {s.descricao && (
                  <p className="text-[11px] font-medium text-white/30 leading-relaxed group-hover:text-white/50 transition-colors italic">
                    {s.descricao}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* PROFESSIONAL BIO */}
      {bio && (
        <div className="px-6 mt-20">
          <div className="relative p-10 rounded-[3rem] bg-amber-500 text-black shadow-2xl overflow-hidden group">
            <div className="absolute top-0 right-0 p-8 opacity-10 rotate-12 group-hover:rotate-0 transition-transform duration-700">
              <Sparkles className="w-24 h-24" />
            </div>
            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-6">
                <User className="w-6 h-6" />
                <h2 className="text-[12px] font-black uppercase tracking-widest">A Nossa História</h2>
              </div>
              <p className="text-sm font-bold leading-relaxed italic opacity-90">"{bio}"</p>
            </div>
          </div>
        </div>
      )}

      {/* QR CODE SECTION */}
      {isPro && (data.username || data.id) && (
        <div className="px-6 mt-20 flex flex-col items-center text-center gap-6">
          <div className="p-8 rounded-[3rem] bg-white/5 border border-white/10 backdrop-blur-xl shadow-2xl">
            <AnimatedQR
              url={`${process.env.NEXT_PUBLIC_APP_URL || 'https://konnexy.com.br'}/${data.username || data.id}`}
              accentColor="#f59e0b"
              size={160}
              active={true}
              customFields={data.custom_fields}
            />
          </div>
          <div className="space-y-1">
            <p className="text-[10px] font-black uppercase tracking-widest opacity-20">Escaneie para compartilhar</p>
            <p className="text-[9px] font-bold opacity-10 tracking-widest uppercase">Konnexy Digital ID</p>
          </div>
        </div>
      )}

      {/* SOCIAL LINKS & FOOTER */}
      <div className="px-6 mt-24 flex flex-col items-center gap-12">
        <div className="flex gap-6">
          {data.instagram && (
            <a href={`https://instagram.com/${data.instagram}`} target="_blank" className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center hover:bg-amber-500/10 hover:border-amber-500/30 transition-all group">
              <Instagram className="w-6 h-6 group-hover:text-amber-500 transition-colors" />
            </a>
          )}
          {data.facebook && (
            <a href={`https://facebook.com/${data.facebook}`} target="_blank" className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center hover:bg-amber-500/10 hover:border-amber-500/30 transition-all group">
              <Facebook className="w-6 h-6 group-hover:text-amber-500 transition-colors" />
            </a>
          )}
        </div>
        <div className="flex flex-col items-center gap-4 opacity-10">
          <div className="h-px w-20 bg-white" />
          <div className="text-[9px] font-black uppercase tracking-[0.6em] pb-10">Konnexy</div>
        </div>
      </div>

    </div>
  );
}
