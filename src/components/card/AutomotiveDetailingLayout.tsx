
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
import { toast } from 'sonner';
import { AnimatedQR } from '@/components/pro/AnimatedQR';

interface AutomotiveDetailingLayoutProps {
  data: Partial<Profile>;
  isPro: boolean;
}

export function AutomotiveDetailingLayout({ data, isPro }: AutomotiveDetailingLayoutProps) {
  // --- 1. DATA EXTRACTION (ULTRA INCLUSIVE) ---
  
  // Custom Fields
  const cf = (data as any).custom_fields || (data as any).customFields || {};
  
  // Services (Check new and old fields, and handle both object/string formats)
  const rawServices = (data as any).servicos || (data as any).services || [];
  const services = Array.isArray(rawServices) ? rawServices.map(s => {
    if (typeof s === 'string') return { nome: s };
    return s;
  }).filter(s => s && (s.nome || s.name)) : [];

  // Differentials (Check new and old fields)
  const rawDifs = (data as any).diferenciais || (data as any).differentials || (data as any).diferencial || [];
  const differentials = Array.isArray(rawDifs) 
    ? rawDifs.filter(d => d && (typeof d === 'string' ? d.trim() : true))
    : (rawDifs ? [rawDifs] : []);

  // Bio
  const bio = (data as any).bio_profissional || (data as any).bio_professional || (data as any).bio || '';

  // Highlights (Booleans in custom_fields)
  const getFieldIcon = (name: string) => {
    const n = name.toLowerCase();
    if (n.includes('domicilio') || n.includes('home')) return Home;
    if (n.includes('garantia') || n.includes('seguro')) return ShieldCheck;
    if (n.includes('delivery') || n.includes('entrega') || n.includes('leva_e_traz')) return Truck;
    if (n.includes('cartao') || n.includes('pagamento') || n.includes('pix')) return Calculator;
    if (n.includes('orcamento')) return Receipt;
    return Award;
  };

  const highlightFields = [
    { key: 'leva_e_traz', label: 'Leva e Traz' },
    { key: 'aceita_cartao', label: 'Aceita Cartão' },
    { key: 'orcamento_gratis', label: 'Orçamento Grátis' },
    { key: 'atendimento_domicilio', label: 'Atendimento Domicílio' },
    { key: 'garantia_servico', label: 'Garantia de Serviço' },
    { key: 'atendimento_delivery', label: 'Atendimento Delivery' }
  ].filter(f => cf[f.key] === true || cf[f.key] === 'true' || cf[f.key] === 1 || cf[f.key] === '1');

  // Portfolio
  const rawPortfolio = cf.portfolio_images || (data as any).portfolio_images || [];
  const portfolio = Array.isArray(rawPortfolio) ? rawPortfolio.filter(img => typeof img === 'string' && img.includes('http')) : (typeof rawPortfolio === 'string' && rawPortfolio.includes('http') ? [rawPortfolio] : []);

  // --- 2. HELPERS ---
  const cleanWhatsapp = (data.whatsapp || '').replace(/\D/g, '');
  const formattedWhatsapp = cleanWhatsapp.startsWith('55') ? cleanWhatsapp : `55${cleanWhatsapp}`;
  const whatsappLink = `https://wa.me/${formattedWhatsapp}?text=${encodeURIComponent(data.whatsapp_message || 'Olá! Gostaria de um orçamento.')}`;

  return (
    <div className="w-full min-h-full bg-[#080808] text-white flex flex-col pb-20 font-sans selection:bg-amber-500 selection:text-black">
      
      {/* HERO SECTION */}
      <div className="relative w-full h-[65vh] flex flex-col overflow-hidden">
        <div className="absolute inset-0 z-0">
          {data.background_video_url?.match(/\.(mp4|webm|ogg|mov)$/i) ? (
            <video src={data.background_video_url} autoPlay muted loop playsInline className="w-full h-full object-cover brightness-[0.35]" />
          ) : (
            <img src={data.background_video_url || 'https://images.unsplash.com/photo-1601362840469-51e4d8d59085?q=80&w=2070'} alt="Bg" className="w-full h-full object-cover brightness-[0.35]" />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-[#080808] to-transparent" />
        </div>

        <div className="relative flex-1 flex flex-col items-center justify-center p-6 z-10 text-center">
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="flex flex-col items-center gap-6">
            {data.photo_url && (
              <div className="w-28 h-28 rounded-full border-4 border-amber-500/20 p-1 bg-black/40 backdrop-blur-md">
                <img src={data.photo_url} alt="Logo" className="w-full h-full object-contain rounded-full" />
              </div>
            )}
            <div className="space-y-3">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500 text-black">
                <Sparkles className="w-3 h-3 fill-black" />
                <span className="text-[9px] font-black uppercase tracking-widest">Premium Detailing</span>
              </div>
              <h1 className="text-4xl font-black uppercase tracking-tighter">{data.business_name || 'Seu Negócio'}</h1>
              <p className="text-[10px] font-bold text-amber-500/80 uppercase tracking-widest max-w-[280px] mx-auto">
                {data.subtitle || 'Excelência Automotiva'}
              </p>
            </div>
          </motion.div>
        </div>
      </div>

      {/* CTA & INFO GRID */}
      <div className="px-6 -mt-12 relative z-30 flex flex-col gap-4">
        <Button asChild className="w-full h-16 rounded-2xl bg-amber-500 text-black font-black uppercase tracking-tighter text-lg shadow-2xl hover:scale-[1.02] active:scale-[0.98]">
          <a href={whatsappLink} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3">
            <MessageCircle className="w-6 h-6 fill-black" />
            <span>{data.cta_text || 'Solicitar Orçamento'}</span>
          </a>
        </Button>

        <div className="grid grid-cols-2 gap-3">
          <div className="p-4 rounded-2xl bg-[#121212] border border-white/5 flex flex-col gap-1.5 shadow-xl">
            <Clock className="w-4 h-4 text-amber-500" />
            <span className="text-[8px] font-black uppercase tracking-widest text-white/20">Atendimento</span>
            <span className="text-[10px] font-bold text-white/90 leading-tight">{data.horario_funcionamento || 'Fale Conosco'}</span>
          </div>
          <div className="p-4 rounded-2xl bg-[#121212] border border-white/5 flex flex-col gap-1.5 shadow-xl">
            <MapPin className="w-4 h-4 text-amber-500" />
            <span className="text-[8px] font-black uppercase tracking-widest text-white/20">Local</span>
            <span className="text-[10px] font-bold text-white/90 leading-tight truncate">{data.area_atendimento || 'Sob Consulta'}</span>
          </div>
        </div>
      </div>

      {/* ADDRESS */}
      {data.endereco_completo && (
        <div className="px-6 mt-4">
          <div className="p-4 rounded-2xl bg-[#121212] border border-white/5 flex items-center gap-3 shadow-lg">
            <MapPin className="w-4 h-4 text-amber-500" />
            <div className="flex flex-col">
              <span className="text-[8px] font-black uppercase tracking-widest text-white/20">Endereço</span>
              <span className="text-[10px] font-bold text-white/70 leading-tight">{data.endereco_completo}</span>
            </div>
          </div>
        </div>
      )}

      {/* DIFFERENTIALS & ATTRIBUTES (The requested part) */}
      {(highlightFields.length > 0 || differentials.length > 0) && (
        <div className="px-6 mt-16">
          <div className="flex items-center gap-3 mb-6">
            <div className="h-5 w-1 bg-amber-500 rounded-full" />
            <h2 className="text-[10px] font-black uppercase tracking-[0.2em] opacity-40">Diferenciais & Atributos</h2>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {highlightFields.map((f) => {
              const Icon = getFieldIcon(f.key);
              return (
                <div key={f.key} className="p-5 rounded-[2rem] bg-[#121212] border border-white/5 flex flex-col items-center text-center gap-2 shadow-xl">
                  <Icon className="w-5 h-5 text-amber-500" />
                  <span className="text-[9px] font-black uppercase tracking-tight">{f.label}</span>
                  <Check className="w-3 h-3 text-emerald-500" />
                </div>
              );
            })}
            {differentials.map((dif: any, i: number) => (
              <div key={i} className="p-5 rounded-[2rem] bg-[#121212] border border-white/5 flex flex-col items-center text-center gap-2 shadow-xl">
                <Sparkles className="w-5 h-5 text-amber-500" />
                <span className="text-[9px] font-black uppercase tracking-tight">
                  {typeof dif === 'string' ? dif : (dif.nome || dif.label)}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SERVICES CATALOG (The requested part) */}
      {services.length > 0 && (
        <div className="px-6 mt-16">
          <div className="flex items-center gap-3 mb-6">
            <div className="h-5 w-1 bg-amber-500 rounded-full shadow-[0_0_15px_rgba(245,158,11,0.5)]" />
            <h2 className="text-[10px] font-black uppercase tracking-[0.2em] opacity-40">Nossos Serviços</h2>
          </div>
          <div className="flex flex-col gap-3">
            {services.map((s, i) => (
              <div key={i} className="p-6 rounded-[2rem] bg-[#121212] border border-white/5 flex flex-col gap-1.5 shadow-2xl">
                <div className="flex justify-between items-start">
                  <h3 className="text-sm font-black uppercase text-amber-500">{s.nome || s.name}</h3>
                  {s.preco && <span className="text-[10px] font-black text-white/40">{s.preco}</span>}
                </div>
                {(s.descricao || s.description) && (
                  <p className="text-[10px] font-medium text-white/30 leading-relaxed">{s.descricao || s.description}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* PORTFOLIO */}
      {portfolio.length > 0 && (
        <div className="px-6 mt-16">
          <div className="flex items-center gap-3 mb-6">
            <div className="h-5 w-1 bg-amber-500 rounded-full" />
            <h2 className="text-[10px] font-black uppercase tracking-[0.2em] opacity-40">Portfólio</h2>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {portfolio.map((img, i) => (
              <div key={i} className="aspect-square rounded-2xl overflow-hidden border border-white/5 bg-[#121212] shadow-xl">
                <img src={img} alt="P" className="w-full h-full object-cover" />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* BIO */}
      {bio && (
        <div className="px-6 mt-20">
          <div className="p-10 rounded-[3rem] bg-amber-500 text-black shadow-2xl">
            <div className="flex items-center gap-3 mb-4">
              <User className="w-6 h-6" />
              <h2 className="text-[11px] font-black uppercase tracking-widest">Sobre o Estúdio</h2>
            </div>
            <p className="text-xs font-bold leading-relaxed italic opacity-80">"{bio}"</p>
          </div>
        </div>
      )}

      {/* FOOTER & SOCIAL */}
      <div className="px-6 mt-20 flex flex-col items-center gap-10">
        <div className="flex gap-4">
          {data.instagram && <a href={`https://instagram.com/${data.instagram}`} target="_blank" className="p-4 rounded-xl bg-white/5 border border-white/10"><Instagram className="w-5 h-5" /></a>}
          {data.facebook && <a href={`https://facebook.com/${data.facebook}`} target="_blank" className="p-4 rounded-xl bg-white/5 border border-white/10"><Facebook className="w-5 h-5" /></a>}
        </div>
        <div className="opacity-10 text-[9px] font-black uppercase tracking-[0.5em] pb-10">Konnexy Digital</div>
      </div>

    </div>
  );
}
