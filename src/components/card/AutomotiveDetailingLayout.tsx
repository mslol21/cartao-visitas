
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
import { getProfessionConfig, professionsMap } from '@/config/professions';
import { toast } from 'sonner';
import { AnimatedQR } from '@/components/pro/AnimatedQR';

interface AutomotiveDetailingLayoutProps {
  data: Partial<Profile>;
  isPro: boolean;
}

export function AutomotiveDetailingLayout({ data, isPro }: AutomotiveDetailingLayoutProps) {
  // --- SUPER ROBUST DATA ACCESS ---
  
  // 1. Resolve Custom Fields
  let cf: any = {};
  try {
    const rawCf = data.custom_fields || (data as any).custom_fields;
    if (typeof rawCf === 'string') {
      cf = JSON.parse(rawCf);
    } else if (rawCf && typeof rawCf === 'object') {
      cf = rawCf;
    }
  } catch (e) {
    console.error("Error parsing custom_fields", e);
  }

  // 2. Resolve Bio & Differentials (Check all possible field names)
  const bio = data.bio_profissional || (data as any).bio_professional || data.name || '';
  const differentialsRaw = data.diferenciais || (data as any).diferenciais || [];
  const differentials = Array.isArray(differentialsRaw) 
    ? differentialsRaw.filter(d => typeof d === 'string' && d.trim().length > 0)
    : (typeof differentialsRaw === 'string' ? [differentialsRaw] : []);

  // 3. Resolve Services
  const servicesRaw = data.servicos || (data as any).services || [];
  const services = Array.isArray(servicesRaw) ? servicesRaw.filter(s => s && s.nome) : [];

  // 4. Highlight Fields Mapping
  const getFieldIcon = (fieldName: string) => {
    const name = fieldName.toLowerCase();
    if (name.includes('atende_domicilio') || name.includes('residencial') || name.includes('home')) return Home;
    if (name.includes('agendamento') || name.includes('horario') || name.includes('schedule')) return Calendar;
    if (name.includes('oab') || name.includes('creci') || name.includes('nr10') || name.includes('registro') || name.includes('crmv') || name.includes('garantia') || name.includes('seguro')) return ShieldCheck;
    if (name.includes('delivery') || name.includes('entreg') || name.includes('frete') || name.includes('veiculo') || name.includes('truck') || name.includes('van') || name.includes('leva_e_traz')) return Truck;
    if (name.includes('online') || name.includes('remoto') || name.includes('digital') || name.includes('zoom')) return Monitor;
    if (name.includes('experiencia') || name.includes('anos')) return History;
    if (name.includes('socorro') || name.includes('emergencia') || name.includes('urgencia') || name.includes('plantao')) return Zap;
    if (name.includes('clinico') || name.includes('saude') || name.includes('medico') || name.includes('vital')) return HeartPulse;
    if (name.includes('celular') || name.includes('mobile') || name.includes('phone')) return Smartphone;
    if (name.includes('cartao') || name.includes('pagamento') || name.includes('pix') || name.includes('credit')) return Calculator;
    if (name.includes('orcamento') || name.includes('recibo')) return Receipt;
    if (['reforma', 'ferramentas', 'obra', 'construction', 'hard_hat', 'leva_produtos'].some(k => name.includes(k))) return HardHat;
    if (name.includes('banho') || name.includes('tosa') || name.includes('grooming') || name.includes('animal') || name.includes('pet') || name.includes('vet')) return PawPrint;
    if (name.includes('monitor') || name.includes('ajudante')) return UserPlus;
    if (name.includes('ar_condicionado') || name.includes('climatizacao')) return Zap;
    if (name.includes('escola') || name.includes('faculdade') || name.includes('universitario')) return GraduationCap;
    if (name.includes('materiais') || name.includes('producao') || name.includes('encomenda') || name.includes('pronta_entrega')) return Package;
    if (name.includes('alto_padrao') || name.includes('premium')) return Gem;
    if (name.includes('financiamento')) return Landmark;
    if (name.includes('planta') || name.includes('imovel') || name.includes('venda_aluguel')) return Building2;
    if (name.includes('avaliacao')) return Scale;
    if (name.includes('pele') || name.includes('estetica') || name.includes('facial') || name.includes('injetaveis') || name.includes('microagulhamento')) return Sparkles;
    if (name.includes('unha') || name.includes('manicure') || name.includes('pigmentacao') || name.includes('nail_art')) return Brush;
    if (name.includes('crp') || name.includes('autoclave') || name.includes('biosseguranca')) return ShieldCheck;
    if (name.includes('terapia_casal')) return Heart;
    if (name.includes('depilacao') || name.includes('laser')) return Zap;
    if (name.includes('spa') || name.includes('drenagem') || name.includes('relaxante')) return Flower2;
    if (name.includes('convenio') || name.includes('plano')) return CheckCircle2;
    if (name.includes('cafe') || name.includes('coffee') || name.includes('torra') || name.includes('preparo')) return Coffee;
    if (name.includes('wifi') || name.includes('wi_fi')) return Wifi;
    if (name.includes('coworking')) return Monitor;
    return Award;
  };

  const commonBooleanFields = [
    { name: 'leva_e_traz', label: 'Leva e Traz' },
    { name: 'aceita_cartao', label: 'Aceita Cartão' },
    { name: 'orcamento_gratis', label: 'Orçamento Grátis' },
    { name: 'atendimento_delivery', label: 'Atendimento Delivery' },
    { name: 'garantia_servico', label: 'Garantia de Serviço' },
    { name: 'garantia_90_dias', label: 'Garantia 90 Dias' },
    { name: 'atendimento_domicilio', label: 'Atendimento Domicílio' }
  ];

  const highlightFields = commonBooleanFields.filter(f => {
    const val = cf[f.name];
    return val === true || val === 'true' || val === 1 || val === '1';
  });

  // 5. Portfolio Images
  const piRaw = cf.portfolio_images || (data as any).portfolio_images || [];
  const portfolioImages = Array.isArray(piRaw) ? piRaw.filter(img => typeof img === 'string' && img.startsWith('http')) : (typeof piRaw === 'string' && piRaw.startsWith('http') ? [piRaw] : []);

  // WhatsApp & Links
  const cleanWhatsapp = data.whatsapp?.replace(/\D/g, '') || '';
  const formattedWhatsapp = cleanWhatsapp.startsWith('55') ? cleanWhatsapp : `55${cleanWhatsapp}`;
  const whatsappLink = `https://wa.me/${formattedWhatsapp}?text=${encodeURIComponent(data.whatsapp_message || 'Olá! Gostaria de um orçamento para estética automotiva.')}`;
  const customLinks = data.custom_links || [];

  // Background logic
  const bgMedia = data.background_video_url || 'https://images.unsplash.com/photo-1601362840469-51e4d8d59085?q=80&w=2070&auto=format&fit=crop';
  const isVideo = bgMedia.match(/\.(mp4|webm|ogg|mov)$/i);

  return (
    <div className="w-full min-h-full bg-[#080808] text-white flex flex-col pb-20 font-sans selection:bg-amber-500 selection:text-black scroll-smooth">
      
      {/* 1. HERO SECTION */}
      <div className="relative w-full overflow-hidden">
        <div className="absolute inset-0 z-0 h-full">
          {isVideo ? (
            <video src={bgMedia} autoPlay muted loop playsInline className="w-full h-full object-cover brightness-[0.3] contrast-125" />
          ) : (
            <img src={bgMedia} alt="Bg" className="w-full h-full object-cover brightness-[0.3] contrast-125" />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-[#080808] via-transparent to-transparent" />
        </div>

        <div className="relative flex flex-col items-center justify-center p-8 z-10 text-center pt-24 pb-20">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col items-center gap-6">
            {data.photo_url && (
              <div className="w-28 h-28 rounded-full border-4 border-amber-500/20 p-1 bg-black/60 backdrop-blur-md shadow-[0_0_50px_rgba(245,158,11,0.3)]">
                <img src={data.photo_url} alt="Logo" className="w-full h-full object-contain rounded-full" />
              </div>
            )}
            
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500 text-black">
                <Sparkles className="w-3 h-3 fill-black" />
                <span className="text-[9px] font-black uppercase tracking-[0.2em]">Premium Studio</span>
              </div>
              <h1 className="text-4xl font-black tracking-tighter leading-none uppercase">
                {data.business_name || 'Studio G3'}
              </h1>
              <p className="text-[10px] font-bold text-amber-500/80 uppercase tracking-[0.2em] max-w-[280px] mx-auto leading-relaxed">
                {data.subtitle || 'Estética Automotiva'}
              </p>
            </div>
          </motion.div>
        </div>
      </div>

      {/* 2. CTA & QUICK INFO */}
      <div className="px-6 -mt-8 relative z-30 flex flex-col gap-4">
        <Button asChild className="w-full h-16 rounded-2xl bg-amber-500 text-black font-black uppercase tracking-tighter text-lg shadow-2xl">
          <a href={whatsappLink} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-3">
            <MessageCircle className="w-6 h-6 fill-black" />
            <span>{data.cta_text || 'Solicitar Orçamento'}</span>
          </a>
        </Button>

        <div className="grid grid-cols-2 gap-3">
          <div className="p-4 rounded-2xl bg-[#121212] border border-white/5 flex flex-col gap-1.5 shadow-xl">
            <Clock className="w-4 h-4 text-amber-500" />
            <span className="text-[8px] font-black uppercase tracking-widest text-white/20">Horário</span>
            <span className="text-[10px] font-bold text-white/90 leading-tight">{data.horario_funcionamento || 'Fale Conosco'}</span>
          </div>
          <div className="p-4 rounded-2xl bg-[#121212] border border-white/5 flex flex-col gap-1.5 shadow-xl">
            <MapPin className="w-4 h-4 text-amber-500" />
            <span className="text-[8px] font-black uppercase tracking-widest text-white/20">Atendimento</span>
            <span className="text-[10px] font-bold text-white/90 leading-tight truncate">{data.area_atendimento || 'Local'}</span>
          </div>
        </div>
      </div>

      {/* 3. ADDRESS */}
      {data.endereco_completo && (
        <div className="px-6 mt-3">
          <a href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(data.endereco_completo)}`} target="_blank" rel="noopener noreferrer" className="w-full p-4 rounded-2xl bg-[#121212] border border-white/5 flex items-center gap-3 shadow-lg">
            <MapPin className="w-4 h-4 text-amber-500 shrink-0" />
            <div className="flex flex-col gap-0.5 overflow-hidden">
              <span className="text-[8px] font-black uppercase tracking-widest text-white/20">Endereço</span>
              <span className="text-[10px] font-bold text-white/70 leading-tight truncate">{data.endereco_completo}</span>
            </div>
          </a>
        </div>
      )}

      {/* 4. DIFFERENTIALS & HIGHLIGHTS */}
      {(highlightFields.length > 0 || differentials.length > 0) && (
        <div className="px-6 mt-12">
          <div className="flex items-center gap-3 mb-6">
            <div className="h-4 w-1 bg-amber-500 rounded-full" />
            <h2 className="text-[10px] font-black uppercase tracking-[0.2em] opacity-40">Diferenciais & Atributos</h2>
          </div>
          
          <div className="grid grid-cols-2 gap-3">
            {highlightFields.map((f) => {
              const Icon = getFieldIcon(f.name);
              return (
                <div key={f.name} className="p-4 rounded-2xl bg-[#121212] border border-white/5 flex flex-col items-center text-center gap-2 shadow-lg">
                  <Icon className="w-5 h-5 text-amber-500" />
                  <span className="text-[9px] font-black uppercase tracking-tight leading-tight">{f.label}</span>
                  <div className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20">
                    <Check className="w-2.5 h-2.5 text-emerald-500" />
                    <span className="text-[7px] font-black text-emerald-500 uppercase">Ativo</span>
                  </div>
                </div>
              );
            })}
            {differentials.map((dif, i) => (
              <div key={i} className="p-4 rounded-2xl bg-[#121212] border border-white/5 flex flex-col items-center text-center gap-2 shadow-lg">
                <Sparkles className="w-5 h-5 text-amber-500" />
                <span className="text-[9px] font-black uppercase tracking-tight leading-tight">{dif}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 5. PORTFOLIO GALLERY */}
      {portfolioImages.length > 0 && (
        <div className="px-6 mt-12">
          <div className="flex items-center gap-3 mb-6">
            <div className="h-4 w-1 bg-amber-500 rounded-full" />
            <h2 className="text-[10px] font-black uppercase tracking-[0.2em] opacity-40">Nosso Portfólio</h2>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {portfolioImages.map((img, i) => (
              <div key={i} className="aspect-square rounded-2xl overflow-hidden border border-white/5 bg-[#121212] shadow-xl">
                <img src={img} alt="Portfolio" className="w-full h-full object-cover" />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 6. SERVICES */}
      {services.length > 0 && (
        <div className="px-6 mt-12">
          <div className="flex items-center gap-3 mb-6">
            <div className="h-4 w-1 bg-amber-500 rounded-full" />
            <h2 className="text-[10px] font-black uppercase tracking-[0.2em] opacity-40">Serviços</h2>
          </div>
          <div className="flex flex-col gap-3">
            {services.map((s, i) => (
              <div key={i} className="p-5 rounded-3xl bg-[#121212] border border-white/5 flex flex-col gap-1 shadow-lg">
                <div className="flex justify-between items-center">
                  <h3 className="text-xs font-black uppercase text-amber-500">{s.nome}</h3>
                  {s.preco && <span className="text-[10px] font-black text-white/40">{s.preco}</span>}
                </div>
                {s.descricao && <p className="text-[10px] text-white/30 leading-relaxed">{s.descricao}</p>}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 7. BIO */}
      {bio && (
        <div className="px-6 mt-12">
          <div className="p-8 rounded-[2.5rem] bg-amber-500 text-black shadow-2xl">
            <div className="flex items-center gap-3 mb-4">
              <User className="w-5 h-5" />
              <h2 className="text-[10px] font-black uppercase tracking-widest">Sobre o Estúdio</h2>
            </div>
            <p className="text-xs font-bold leading-relaxed italic opacity-80">"{bio}"</p>
          </div>
        </div>
      )}

      {/* 8. QR CODE */}
      {isPro && (data.username || data.id) && (
        <div className="px-6 mt-16 flex flex-col items-center gap-5">
          <QrCode className="w-6 h-6 text-amber-500 opacity-40" />
          <div className="p-6 rounded-[2.5rem] bg-white/5 border border-white/10 backdrop-blur-md">
            <AnimatedQR
              url={`${process.env.NEXT_PUBLIC_APP_URL || 'https://konnexy.com.br'}/${data.username || data.id}`}
              photoUrl={data.photo_url || undefined}
              accentColor="#f59e0b"
              size={150}
              active={isPro}
              customFields={data.custom_fields}
            />
          </div>
        </div>
      )}

      {/* 9. SOCIAL */}
      <div className="px-6 mt-16 flex flex-col items-center gap-10">
        <div className="flex gap-5">
          {data.instagram && <a href={`https://instagram.com/${data.instagram}`} target="_blank" rel="noopener noreferrer" className="p-4 rounded-xl bg-white/5 border border-white/10 hover:bg-amber-500 hover:text-black transition-all"><Instagram className="w-5 h-5" /></a>}
          {data.facebook && <a href={`https://facebook.com/${data.facebook}`} target="_blank" rel="noopener noreferrer" className="p-4 rounded-xl bg-white/5 border border-white/10 hover:bg-amber-500 hover:text-black transition-all"><Facebook className="w-5 h-5" /></a>}
          {data.youtube && <a href={`https://youtube.com/${data.youtube}`} target="_blank" rel="noopener noreferrer" className="p-4 rounded-xl bg-white/5 border border-white/10 hover:bg-amber-500 hover:text-black transition-all"><Youtube className="w-5 h-5" /></a>}
        </div>
        <div className="flex flex-col items-center gap-2 opacity-20 pb-10">
          <span className="text-[8px] font-black uppercase tracking-[0.4em]">Konnexy Digital</span>
        </div>
      </div>

    </div>
  );
}
