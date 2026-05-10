
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
  Globe,
  Copy,
  Home,
  Calendar,
  Truck,
  Monitor,
  History,
  HeartPulse,
  Smartphone,
  Calculator,
  Receipt,
  HardHat,
  PawPrint,
  UserPlus,
  GraduationCap,
  Package,
  Gem,
  Landmark,
  Building2,
  Scale,
  Brush,
  Flower2,
  CheckCircle2,
  Coffee,
  Wifi,
  Heart,
  User,
  QrCode,
  Image as ImageIcon
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
  // --- 1. DATA EXTRACTION ---
  // Try to find services and differentials in EVERY possible field
  const allData = { ...data, ...(data as any).custom_fields, ...(data as any).customFields };
  
  // Resolve Services
  const rawS = allData.servicos || allData.services || (data as any).service_list || [];
  const services = Array.isArray(rawS) ? rawS.map(s => {
    if (typeof s === 'string') return { nome: s };
    if (s && typeof s === 'object') return { 
      nome: s.nome || s.name || s.title || '', 
      preco: s.preco || s.price || s.value || '', 
      descricao: s.descricao || s.description || '' 
    };
    return null;
  }).filter(s => s && s.nome) : [];

  // Resolve Differentials
  const rawD = allData.diferenciais || allData.differentials || (data as any).highlights || [];
  const differentials = Array.isArray(rawD) 
    ? rawD.filter(d => d && (typeof d === 'string' ? d.trim().length > 0 : true)).map(d => typeof d === 'string' ? d : (d.nome || d.label || JSON.stringify(d)))
    : (typeof rawD === 'string' && rawD.length > 0 ? [rawD] : []);

  // Resolve Bio
  const bio = allData.bio_profissional || allData.bio_professional || allData.bio || allData.biografia || '';

  // WhatsApp
  const cleanWhatsapp = (data.whatsapp || '').replace(/\D/g, '');
  const formattedWhatsapp = cleanWhatsapp.startsWith('55') ? cleanWhatsapp : `55${cleanWhatsapp}`;
  const whatsappLink = `https://wa.me/${formattedWhatsapp}?text=${encodeURIComponent(data.whatsapp_message || 'Olá! Gostaria de um orçamento.')}`;

  return (
    <div className="w-full min-h-full bg-[#080808] text-white flex flex-col pb-20 font-sans selection:bg-amber-500 selection:text-black overflow-x-hidden">
      
      {/* BACKGROUND HERO */}
      <div className="relative w-full h-[60vh] shrink-0">
        <div className="absolute inset-0 z-0">
          {data.background_video_url?.match(/\.(mp4|webm|ogg|mov)$/i) ? (
            <video src={data.background_video_url} autoPlay muted loop playsInline className="w-full h-full object-cover brightness-[0.4]" />
          ) : (
            <img src={data.background_video_url || 'https://images.unsplash.com/photo-1601362840469-51e4d8d59085'} alt="B" className="w-full h-full object-cover brightness-[0.4]" />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-[#080808] to-transparent" />
        </div>

        <div className="relative h-full flex flex-col items-center justify-center p-6 z-10 text-center">
          <div className="flex flex-col items-center gap-6">
            {data.photo_url && (
              <div className="w-24 h-24 rounded-full border-2 border-amber-500/30 p-1 bg-black/50 backdrop-blur-sm">
                <img src={data.photo_url} alt="Logo" className="w-full h-full object-contain rounded-full" />
              </div>
            )}
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500 text-black text-[9px] font-black uppercase tracking-widest">
                <Sparkles className="w-3 h-3 fill-black" />
                <span>Estética Automotiva</span>
              </div>
              <h1 className="text-3xl font-black uppercase tracking-tighter leading-tight">{data.business_name || 'Studio G3'}</h1>
              {data.subtitle && (
                <p className="text-[10px] font-bold text-amber-500/80 uppercase tracking-widest max-w-[250px] mx-auto leading-relaxed">
                  {data.subtitle}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* CTA SECTION */}
      <div className="px-6 -mt-8 relative z-20 flex flex-col gap-3">
        <Button asChild className="w-full h-16 rounded-2xl bg-amber-500 text-black font-black uppercase tracking-tighter text-lg shadow-[0_10px_30px_rgba(245,158,11,0.3)]">
          <a href={whatsappLink} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3">
            <MessageCircle className="w-6 h-6 fill-black" />
            <span>{data.cta_text || 'Solicitar Orçamento'}</span>
          </a>
        </Button>

        <div className="grid grid-cols-2 gap-3">
          <div className="p-4 rounded-2xl bg-[#121212] border border-white/5 flex flex-col gap-1">
            <Clock className="w-4 h-4 text-amber-500" />
            <span className="text-[10px] font-bold text-white/90">{data.horario_funcionamento || 'Fale Conosco'}</span>
          </div>
          <div className="p-4 rounded-2xl bg-[#121212] border border-white/5 flex flex-col gap-1">
            <MapPin className="w-4 h-4 text-amber-500" />
            <span className="text-[10px] font-bold text-white/90 truncate">{data.area_atendimento || 'Local'}</span>
          </div>
        </div>
      </div>

      {/* DIFFERENTIALS LIST (Force Render) */}
      {(differentials.length > 0) && (
        <div className="px-6 mt-12 space-y-6">
          <div className="flex items-center gap-3">
            <div className="h-4 w-1 bg-amber-500 rounded-full" />
            <h2 className="text-[10px] font-black uppercase tracking-widest text-white/40">Diferenciais</h2>
          </div>
          <div className="grid grid-cols-1 gap-2">
            {differentials.map((d, i) => (
              <div key={i} className="flex items-center gap-3 p-4 rounded-2xl bg-[#121212] border border-white/5">
                <Check className="w-4 h-4 text-emerald-500 shrink-0" />
                <span className="text-xs font-bold text-white/80">{d}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SERVICES LIST (Force Render) */}
      {(services.length > 0) && (
        <div className="px-6 mt-12 space-y-6">
          <div className="flex items-center gap-3">
            <div className="h-4 w-1 bg-amber-500 rounded-full" />
            <h2 className="text-[10px] font-black uppercase tracking-widest text-white/40">Serviços e Preços</h2>
          </div>
          <div className="flex flex-col gap-3">
            {services.map((s, i) => (
              <div key={i} className="p-6 rounded-3xl bg-[#121212] border border-white/5 flex flex-col gap-2 shadow-xl">
                <div className="flex justify-between items-center gap-4">
                  <h3 className="text-sm font-black uppercase text-amber-500">{s.nome}</h3>
                  {s.preco && <span className="shrink-0 text-[10px] font-black bg-white/5 px-2 py-1 rounded-lg">{s.preco}</span>}
                </div>
                {s.descricao && <p className="text-[10px] font-medium text-white/30 leading-relaxed">{s.descricao}</p>}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* BIO SECTION */}
      {bio && (
        <div className="px-6 mt-12">
          <div className="p-8 rounded-[2.5rem] bg-amber-500 text-black shadow-xl">
            <div className="flex items-center gap-3 mb-4">
              <User className="w-5 h-5" />
              <h2 className="text-[10px] font-black uppercase tracking-widest">Sobre Nós</h2>
            </div>
            <p className="text-xs font-bold leading-relaxed italic opacity-80">"{bio}"</p>
          </div>
        </div>
      )}

      {/* QR CODE */}
      {isPro && (data.username || data.id) && (
        <div className="px-6 mt-16 flex flex-col items-center gap-6">
          <div className="p-6 rounded-[2.5rem] bg-white/5 border border-white/10">
            <AnimatedQR
              url={`${process.env.NEXT_PUBLIC_APP_URL || 'https://konnexy.com.br'}/${data.username || data.id}`}
              accentColor="#f59e0b"
              size={140}
              active={true}
              customFields={data.custom_fields}
            />
          </div>
        </div>
      )}

      {/* SOCIAL LINKS */}
      <div className="px-6 mt-16 flex flex-col items-center gap-12">
        <div className="flex gap-4">
          {data.instagram && <a href={`https://instagram.com/${data.instagram}`} target="_blank" className="p-4 rounded-xl bg-[#121212] border border-white/5"><Instagram className="w-5 h-5" /></a>}
          {data.facebook && <a href={`https://facebook.com/${data.facebook}`} target="_blank" className="p-4 rounded-xl bg-[#121212] border border-white/5"><Facebook className="w-5 h-5" /></a>}
        </div>
        <div className="opacity-10 text-[8px] font-black uppercase tracking-[0.5em] pb-10">Konnexy Digital</div>
      </div>

    </div>
  );
}
