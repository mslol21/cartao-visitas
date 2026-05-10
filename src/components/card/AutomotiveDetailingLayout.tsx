
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
  // --- DEBUG BANNER ---
  const debugKeys = Object.keys(data).join(', ');
  
  // --- DATA EXTRACTION ---
  // Ensure we get data from all possible nested or flat sources
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

  // Differentials
  const dRaw = merged.diferenciais || merged.differentials || merged.highlights || [];
  const differentials = Array.isArray(dRaw) ? dRaw.filter(d => !!d) : (typeof dRaw === 'string' ? [dRaw] : []);

  // WhatsApp
  const cleanWhatsapp = (data.whatsapp || '').replace(/\D/g, '');
  const formattedWhatsapp = cleanWhatsapp.startsWith('55') ? cleanWhatsapp : `55${cleanWhatsapp}`;
  const whatsappLink = `https://wa.me/${formattedWhatsapp}?text=${encodeURIComponent(data.whatsapp_message || 'Olá! Gostaria de um orçamento.')}`;

  return (
    <div className="relative w-full min-h-screen bg-[#080808] text-white flex flex-col pb-20 z-[100]">
      
      {/* TEST BANNER */}
      <div className="w-full bg-red-600 text-white text-[10px] font-black p-2 text-center sticky top-0 z-[200] uppercase tracking-widest">
        Sistema Premium Ativado - {data.business_name || 'Sem Nome'}
      </div>

      {/* HERO / IDENTITY */}
      <div className="relative w-full h-[50vh] flex flex-col items-center justify-end pb-12 px-6">
        {data.photo_url && (
          <div className="w-20 h-20 rounded-full border-2 border-amber-500/50 p-1 mb-6 bg-black">
            <img src={data.photo_url} alt="L" className="w-full h-full object-contain rounded-full" />
          </div>
        )}
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-black uppercase tracking-tighter leading-none">{data.business_name || 'STUDIO G3'}</h1>
          <p className="text-[10px] font-bold text-amber-500 uppercase tracking-widest opacity-80">{data.subtitle || 'Excelência Automotiva'}</p>
        </div>
      </div>

      {/* CTA */}
      <div className="px-6 space-y-4">
        <Button asChild className="w-full h-16 rounded-2xl bg-amber-500 text-black font-black uppercase tracking-tighter text-lg shadow-xl">
          <a href={whatsappLink} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3">
            <MessageCircle className="w-6 h-6 fill-black" />
            <span>{data.cta_text || 'Falar no WhatsApp'}</span>
          </a>
        </Button>

        <div className="grid grid-cols-2 gap-3">
          <div className="p-4 rounded-2xl bg-[#121212] border border-white/5 flex flex-col items-center text-center">
            <Clock className="w-4 h-4 text-amber-500 mb-1" />
            <span className="text-[9px] font-bold opacity-60 leading-tight">{data.horario_funcionamento || 'Horário'}</span>
          </div>
          <div className="p-4 rounded-2xl bg-[#121212] border border-white/5 flex flex-col items-center text-center">
            <MapPin className="w-4 h-4 text-amber-500 mb-1" />
            <span className="text-[9px] font-bold opacity-60 leading-tight">{data.area_atendimento || 'Local'}</span>
          </div>
        </div>
      </div>

      {/* DIFFERENTIALS */}
      {differentials.length > 0 && (
        <div className="px-6 mt-12">
          <h2 className="text-[10px] font-black uppercase tracking-widest text-white/30 mb-6 flex items-center gap-2">
            <div className="w-1 h-3 bg-amber-500 rounded-full" />
            Diferenciais
          </h2>
          <div className="flex flex-col gap-2">
            {differentials.map((d, i) => (
              <div key={i} className="flex items-center gap-3 p-4 rounded-xl bg-[#121212] border border-white/5">
                <Check className="w-4 h-4 text-emerald-500" />
                <span className="text-xs font-bold text-white/90">{typeof d === 'string' ? d : JSON.stringify(d)}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SERVICES */}
      {services.length > 0 && (
        <div className="px-6 mt-12">
          <h2 className="text-[10px] font-black uppercase tracking-widest text-white/30 mb-6 flex items-center gap-2">
            <div className="w-1 h-3 bg-amber-500 rounded-full" />
            Serviços
          </h2>
          <div className="flex flex-col gap-3">
            {services.map((s, i) => (
              <div key={i} className="p-5 rounded-2xl bg-[#121212] border border-white/5 space-y-1">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-black uppercase text-amber-500">{s.nome}</span>
                  {s.preco && <span className="text-[10px] font-black opacity-40">{s.preco}</span>}
                </div>
                {s.descricao && <p className="text-[10px] opacity-30 leading-relaxed italic">{s.descricao}</p>}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* BIO */}
      {bio && (
        <div className="px-6 mt-12">
          <div className="p-8 rounded-[2rem] bg-amber-500 text-black">
            <h3 className="text-[10px] font-black uppercase tracking-widest mb-4">A nossa história</h3>
            <p className="text-xs font-bold leading-relaxed italic">"{bio}"</p>
          </div>
        </div>
      )}

      {/* SOCIAL */}
      <div className="px-6 mt-16 flex flex-col items-center gap-10">
        <div className="flex gap-4">
          {data.instagram && <a href={`https://instagram.com/${data.instagram}`} target="_blank" className="p-4 rounded-xl bg-white/5 border border-white/10"><Instagram className="w-5 h-5" /></a>}
          {data.facebook && <a href={`https://facebook.com/${data.facebook}`} target="_blank" className="p-4 rounded-xl bg-white/5 border border-white/10"><Facebook className="w-5 h-5" /></a>}
        </div>
        <div className="opacity-10 text-[8px] font-black uppercase tracking-[0.5em] pb-10">Konnexy Digital</div>
      </div>

    </div>
  );
}
