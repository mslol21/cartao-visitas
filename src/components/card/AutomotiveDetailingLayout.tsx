
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
  // Safe data access
  const cf = data.custom_fields || (data as any).custom_fields || {};
  
  // Bio with fallback for field name
  const bio = data.bio_profissional || (data as any).bio_professional || '';
  
  const cleanWhatsapp = data.whatsapp?.replace(/\D/g, '') || '';
  const formattedWhatsapp = cleanWhatsapp.startsWith('55') ? cleanWhatsapp : `55${cleanWhatsapp}`;
  const whatsappLink = `https://wa.me/${formattedWhatsapp}?text=${encodeURIComponent(data.whatsapp_message || 'Olá! Gostaria de um orçamento para estética automotiva.')}`;

  // Services with safety
  const services = (data.servicos || []).filter((s: any) => s && s.nome);

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

  // Greedier Highlight Fields Logic
  const allPossibleFields = Object.values(professionsMap).flatMap(p => p.customFields || []);
  const commonFields = [
    { name: 'leva_e_traz', label: 'Leva e Traz', type: 'boolean' },
    { name: 'aceita_cartao', label: 'Aceita Cartão', type: 'boolean' },
    { name: 'orcamento_gratis', label: 'Orçamento Grátis', type: 'boolean' },
    { name: 'atendimento_delivery', label: 'Atendimento Delivery', type: 'boolean' },
    { name: 'garantia_servico', label: 'Garantia de Serviço', type: 'boolean' }
  ];
  const mergedFields = [...allPossibleFields, ...commonFields];
  
  const highlightFields = mergedFields.filter(field => {
    const value = cf?.[field.name];
    if (field.type === 'boolean') return value === true || value === 'true';
    if (field.name === 'portfolio_images') return false; // Rendered separately
    return (value !== undefined && value !== null && value !== '' && (Array.isArray(value) ? value.length > 0 : true));
  }).filter((f, i, self) => self.findIndex(t => t.name === f.name) === i);

  const customLinks = data.custom_links || [];
  const portfolioImagesRaw = cf.portfolio_images || [];
  const portfolioImages = Array.isArray(portfolioImagesRaw) ? portfolioImagesRaw : (portfolioImagesRaw ? [portfolioImagesRaw] : []);

  // Diferenciais as badges
  const differentials = data.diferenciais || [];

  // Background logic
  const bgMedia = data.background_video_url || 'https://images.unsplash.com/photo-1601362840469-51e4d8d59085?q=80&w=2070&auto=format&fit=crop';
  const isVideo = bgMedia.match(/\.(mp4|webm|ogg|mov)$/i);

  return (
    <div className="w-full min-h-full bg-[#080808] text-white flex flex-col pb-20 font-sans selection:bg-amber-500 selection:text-black scroll-smooth">
      
      {/* 1. HERO SECTION */}
      <div className="relative w-full overflow-hidden">
        {/* Background Media */}
        <div className="absolute inset-0 z-0 h-full">
          {isVideo ? (
            <video 
              src={bgMedia} 
              autoPlay muted loop playsInline 
              className="w-full h-full object-cover brightness-[0.35] contrast-125"
            />
          ) : (
            <img 
              src={bgMedia} 
              alt="Detailing Background" 
              className="w-full h-full object-cover brightness-[0.35] contrast-125"
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-[#080808] via-[#080808]/40 to-transparent" />
        </div>

        {/* Identity content */}
        <div className="relative flex flex-col items-center justify-center p-8 z-10 text-center pt-24 pb-20">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center gap-8"
          >
            {data.photo_url && (
              <div className="w-32 h-32 rounded-full border-4 border-amber-500/20 p-1 bg-black/60 backdrop-blur-md shadow-[0_0_60px_rgba(245,158,11,0.25)]">
                <img 
                  src={data.photo_url} 
                  alt={data.business_name || 'Logo'} 
                  className="w-full h-full object-contain rounded-full"
                />
              </div>
            )}
            
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500 text-black shadow-lg">
                <Sparkles className="w-3.5 h-3.5 fill-black" />
                <span className="text-[10px] font-black uppercase tracking-[0.2em]">Premium Studio</span>
              </div>
              
              <h1 className="text-5xl font-black tracking-tighter leading-[0.8] uppercase drop-shadow-2xl">
                {data.business_name || 'Studio G3'}
              </h1>
              
              <p className="text-[11px] font-bold text-amber-500/80 uppercase tracking-[0.25em] max-w-[280px] mx-auto leading-relaxed">
                {data.subtitle || 'Estética Automotiva'}
              </p>
            </div>
          </motion.div>
        </div>
      </div>

      {/* 2. CTA & QUICK INFO */}
      <div className="px-6 -mt-10 relative z-30 flex flex-col gap-4">
        <Button 
          asChild
          className="w-full h-20 rounded-3xl bg-amber-500 text-black hover:bg-amber-400 font-black uppercase tracking-tighter text-xl shadow-[0_20px_50px_rgba(245,158,11,0.4)] transition-all hover:scale-[1.02] active:scale-[0.98]"
        >
          <a href={whatsappLink} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-4">
            <MessageCircle className="w-8 h-8 fill-black" />
            <span>{data.cta_text || 'Solicitar Orçamento'}</span>
          </a>
        </Button>

        <div className="grid grid-cols-2 gap-3">
          <div className="p-5 rounded-[2rem] bg-[#121212] border border-white/5 flex flex-col gap-2 shadow-2xl">
            <Clock className="w-5 h-5 text-amber-500" />
            <div className="flex flex-col">
              <span className="text-[9px] font-black uppercase tracking-widest text-white/20">Horário</span>
              <span className="text-[11px] font-bold text-white/90 leading-tight">{data.horario_funcionamento || 'Consulte-nos'}</span>
            </div>
          </div>
          <div className="p-5 rounded-[2rem] bg-[#121212] border border-white/5 flex flex-col gap-2 shadow-2xl">
            <MapPin className="w-5 h-5 text-amber-500" />
            <div className="flex flex-col">
              <span className="text-[9px] font-black uppercase tracking-widest text-white/20">Atendimento</span>
              <span className="text-[11px] font-bold text-white/90 leading-tight truncate">{data.area_atendimento || 'Local'}</span>
            </div>
          </div>
        </div>
      </div>

      {/* 3. ADDRESS (Conditional) */}
      {data.endereco_completo && (
        <div className="px-6 mt-4">
          <a 
            href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(data.endereco_completo)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full p-5 rounded-[2rem] bg-[#121212] border border-white/5 flex items-center gap-4 hover:bg-[#181818] transition-colors shadow-xl"
          >
            <div className="w-10 h-10 rounded-2xl bg-amber-500/10 flex items-center justify-center shrink-0">
              <MapPin className="w-5 h-5 text-amber-500" />
            </div>
            <div className="flex flex-col gap-0.5 overflow-hidden">
              <span className="text-[9px] font-black uppercase tracking-widest text-white/20">Endereço Completo</span>
              <span className="text-xs font-bold text-white/80 leading-tight">{data.endereco_completo}</span>
            </div>
          </a>
        </div>
      )}

      {/* 4. HIGHLIGHTS & DIFFERENTIALS */}
      {(highlightFields.length > 0 || differentials.length > 0) && (
        <div className="px-6 mt-16">
          <div className="flex items-center gap-3 mb-8">
            <div className="h-6 w-1 bg-amber-500 rounded-full shadow-[0_0_15px_rgba(245,158,11,0.5)]" />
            <h2 className="text-xs font-black uppercase tracking-[0.3em] opacity-40">Diferenciais & Atributos</h2>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            {/* Boolean Highlights */}
            {highlightFields.map((field) => {
              const value = cf[field.name];
              const Icon = getFieldIcon(field.name) || Award;
              const displayLabel = field.label.replace(/\s*\(.*?\)\s*/g, '');

              return (
                <div key={field.name} className="p-6 rounded-[2.5rem] bg-[#121212] border border-white/5 flex flex-col items-center text-center gap-4 shadow-xl">
                  <div className="w-12 h-12 rounded-2xl bg-amber-500/5 border border-amber-500/10 flex items-center justify-center">
                    <Icon className="w-6 h-6 text-amber-500" />
                  </div>
                  <div className="flex flex-col items-center gap-2">
                    <span className="text-[10px] font-black uppercase tracking-tight leading-tight px-1">{displayLabel}</span>
                    <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20">
                      <Check className="w-3 h-3 text-emerald-500" />
                      <span className="text-[8px] font-black text-emerald-500 uppercase tracking-widest">Ativo</span>
                    </div>
                  </div>
                </div>
              );
            })}

            {/* List Differentials */}
            {differentials.map((dif, i) => (
              <div key={i} className="p-6 rounded-[2.5rem] bg-[#121212] border border-white/5 flex flex-col items-center text-center gap-4 shadow-xl">
                <div className="w-12 h-12 rounded-2xl bg-amber-500/5 border border-amber-500/10 flex items-center justify-center text-amber-500">
                  <Sparkles className="w-6 h-6" />
                </div>
                <span className="text-[10px] font-black uppercase tracking-tight leading-tight">{dif}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 5. PORTFOLIO GALLERY */}
      {portfolioImages.length > 0 && (
        <div className="px-6 mt-16">
          <div className="flex items-center gap-3 mb-8">
            <div className="h-6 w-1 bg-amber-500 rounded-full shadow-[0_0_15px_rgba(245,158,11,0.5)]" />
            <h2 className="text-xs font-black uppercase tracking-[0.3em] opacity-40">Nosso Portfólio</h2>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {portfolioImages.map((img: string, i: number) => (
              <motion.div 
                key={i} 
                whileHover={{ scale: 1.05 }}
                className="aspect-square rounded-[2rem] overflow-hidden border border-white/5 bg-[#121212] shadow-2xl group"
              >
                <img src={img} alt={`Trabalho ${i+1}`} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* 6. PIX & LINKS */}
      {(cf.chave_pix || customLinks.length > 0) && (
        <div className="px-6 mt-16 flex flex-col gap-4">
          {cf.chave_pix && (
            <Button
              variant="outline"
              onClick={() => {
                navigator.clipboard.writeText(cf.chave_pix);
                toast.success('Chave PIX copiada!');
              }}
              className="w-full h-20 rounded-[2rem] bg-teal-950/10 border-teal-500/20 hover:bg-teal-950/20 text-teal-100 flex items-center justify-between px-6 group"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-teal-500/10 flex items-center justify-center">
                  <Copy className="w-6 h-6 text-teal-400 group-hover:scale-110 transition-transform" />
                </div>
                <div className="flex flex-col items-start">
                  <span className="text-[9px] font-black uppercase tracking-widest text-teal-500/60">Pagar via PIX</span>
                  <span className="text-sm font-bold font-mono truncate max-w-[160px]">{cf.chave_pix}</span>
                </div>
              </div>
              <span className="text-[10px] font-black uppercase text-teal-500 opacity-40">Copiar</span>
            </Button>
          )}

          {customLinks.map((link, i) => (
            <Button
              key={i}
              asChild
              variant="outline"
              className="w-full h-16 rounded-[1.5rem] bg-white/5 border-white/10 hover:bg-white/10 text-white text-sm font-bold shadow-xl"
            >
              <a href={link.url.startsWith('http') ? link.url : `https://${link.url}`} target="_blank" rel="noopener noreferrer" className="flex items-center justify-between px-6">
                <span>{link.title}</span>
                <ChevronRight className="w-4 h-4 opacity-40" />
              </a>
            </Button>
          ))}
        </div>
      )}

      {/* 7. SERVICES SHOWCASE */}
      {services.length > 0 && (
        <div className="px-6 mt-16">
          <div className="flex items-center gap-3 mb-8">
            <div className="h-6 w-1 bg-amber-500 rounded-full shadow-[0_0_15px_rgba(245,158,11,0.5)]" />
            <h2 className="text-xs font-black uppercase tracking-[0.3em] opacity-40">Serviços & Tratamentos</h2>
          </div>

          <div className="grid gap-4">
            {services.map((s: any, i: number) => (
              <div 
                key={i}
                className="group relative rounded-[2.5rem] overflow-hidden border border-white/5 bg-[#121212] p-8 flex flex-col gap-4 shadow-2xl"
              >
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-black uppercase tracking-tight text-amber-500">{s.nome}</h3>
                  {s.preco && (
                    <span className="text-white font-black text-xs tracking-tighter bg-white/5 px-4 py-2 rounded-2xl border border-white/10">
                      {s.preco}
                    </span>
                  )}
                </div>
                {s.descricao && (
                  <p className="text-xs font-medium text-white/40 leading-relaxed">{s.descricao}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 8. BIO / ABOUT */}
      {bio && (
        <div className="px-6 mt-20">
          <div className="p-10 rounded-[3rem] bg-amber-500 text-black shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 p-8 opacity-10">
              <Sparkles className="w-20 h-20" />
            </div>
            
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 rounded-2xl bg-black/5 flex items-center justify-center">
                <User className="w-6 h-6" />
              </div>
              <h2 className="text-sm font-black uppercase tracking-widest">Sobre o Estúdio</h2>
            </div>
            
            <p className="text-sm font-bold leading-relaxed italic opacity-90">
              "{bio}"
            </p>
          </div>
        </div>
      )}

      {/* 9. QR CODE & SHARING */}
      {isPro && (data.username || data.id) && (
        <div className="px-6 mt-20 flex flex-col items-center gap-8">
          <div className="flex flex-col items-center text-center gap-2">
            <QrCode className="w-8 h-8 text-amber-500 opacity-60" />
            <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-white/30">Digital Connect Card</h3>
          </div>
          
          <div className="p-8 rounded-[3.5rem] bg-white/5 border border-white/10 backdrop-blur-xl shadow-2xl">
            <AnimatedQR
              url={`${process.env.NEXT_PUBLIC_APP_URL || 'https://konnexy.com.br'}/${data.username || data.id}`}
              photoUrl={data.photo_url || undefined}
              accentColor="#f59e0b"
              size={180}
              active={isPro}
              customFields={data.custom_fields}
            />
          </div>
        </div>
      )}

      {/* 10. SOCIAL & BRANDING */}
      <div className="px-6 mt-20 flex flex-col items-center gap-12">
        <div className="flex gap-6">
          {data.instagram && (
            <a href={`https://instagram.com/${data.instagram}`} target="_blank" rel="noopener noreferrer" className="p-5 rounded-2xl bg-[#121212] border border-white/5 hover:bg-amber-500 hover:text-black transition-all hover:scale-110 active:scale-95 shadow-xl">
              <Instagram className="w-6 h-6" />
            </a>
          )}
          {data.facebook && (
            <a href={`https://facebook.com/${data.facebook}`} target="_blank" rel="noopener noreferrer" className="p-5 rounded-2xl bg-[#121212] border border-white/5 hover:bg-amber-500 hover:text-black transition-all hover:scale-110 active:scale-95 shadow-xl">
              <Facebook className="w-6 h-6" />
            </a>
          )}
          {data.youtube && (
            <a href={`https://youtube.com/${data.youtube}`} target="_blank" rel="noopener noreferrer" className="p-5 rounded-2xl bg-[#121212] border border-white/5 hover:bg-amber-500 hover:text-black transition-all hover:scale-110 active:scale-95 shadow-xl">
              <Youtube className="w-6 h-6" />
            </a>
          )}
        </div>

        <div className="flex flex-col items-center gap-4 opacity-20 pb-10">
          <span className="text-[9px] font-black uppercase tracking-[0.5em]">Konnexy Digital</span>
          <div className="w-12 h-[1px] bg-white/50" />
        </div>
      </div>

    </div>
  );
}
