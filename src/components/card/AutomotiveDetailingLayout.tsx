
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
  QrCode
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Profile } from '@/types/profile';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import { getProfessionConfig } from '@/config/professions';
import { toast } from 'sonner';
import { AnimatedQR } from '@/components/pro/AnimatedQR';

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

  const getFieldIcon = (fieldName: string) => {
    const name = fieldName.toLowerCase();
    if (name.includes('atende_domicilio') || name.includes('residencial') || name.includes('home')) return Home;
    if (name.includes('agendamento') || name.includes('horario') || name.includes('schedule')) return Calendar;
    if (name.includes('oab') || name.includes('creci') || name.includes('nr10') || name.includes('registro') || name.includes('crmv') || name.includes('garantia') || name.includes('seguro')) return ShieldCheck;
    if (name.includes('delivery') || name.includes('entreg') || name.includes('frete') || name.includes('veiculo') || name.includes('truck') || name.includes('van')) return Truck;
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

  // Background logic
  const bgMedia = data.background_video_url || 'https://images.unsplash.com/photo-1601362840469-51e4d8d59085?q=80&w=2070&auto=format&fit=crop';
  const isVideo = bgMedia.match(/\.(mp4|webm|ogg|mov)$/i);

  const globalConfig = getProfessionConfig(data.profession || data.category);
  const highlightFields = globalConfig?.customFields.filter(field => {
    const value = cf?.[field.name];
    if (field.type === 'boolean') return value === true;
    return (value !== undefined && value !== null && value !== '' && (Array.isArray(value) ? value.length > 0 : true));
  }) || [];

  const customLinks = data.custom_links || [];

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

      {/* 4. ADDRESS SECTION (Visible if filled) */}
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

      {/* 5. HIGHLIGHTS SECTION (Atributos & Especialidades) */}
      {highlightFields.length > 0 && (
        <div className="px-6 mt-12">
          <div className="flex items-center gap-3 mb-8">
            <div className="h-6 w-1 bg-amber-500 rounded-full shadow-[0_0_15px_rgba(245,158,11,0.5)]" />
            <h2 className="text-xs font-black uppercase tracking-[0.3em] opacity-60">Diferenciais & Atributos</h2>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {highlightFields.map((field) => {
              const value = cf[field.name];
              const Icon = getFieldIcon(field.name);
              const displayLabel = field.label.replace(/\s*\(.*?\)\s*/g, '');
              const isArray = field.type === 'array' || Array.isArray(value);

              return (
                <div key={field.name} className={cn(
                  "p-5 rounded-3xl bg-[#121212] border border-white/5 flex flex-col items-center text-center gap-3",
                  isArray ? "col-span-2" : ""
                )}>
                  {field.type === 'boolean' ? (
                    <>
                      <div className="p-3 rounded-2xl bg-amber-500/10 text-amber-500">
                        <Icon className="w-6 h-6" />
                      </div>
                      <span className="text-[10px] font-black uppercase tracking-tight leading-tight">{displayLabel}</span>
                      <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20">
                        <Check className="w-3 h-3 text-emerald-500" />
                        <span className="text-[8px] font-black text-emerald-600 uppercase">Sim</span>
                      </div>
                    </>
                  ) : isArray ? (
                    <>
                      <div className="flex items-center gap-3 mb-2 w-full justify-center">
                        <Icon className="w-4 h-4 text-amber-500" />
                        <span className="text-[10px] font-black uppercase tracking-widest text-white/30">{displayLabel}</span>
                      </div>
                      <div className="flex flex-wrap items-center justify-center gap-2 w-full">
                        {(Array.isArray(value) ? value : String(value).split(/[,;]/)).map((item: string, i: number) => (
                          <span key={i} className="text-[10px] font-bold px-3 py-1.5 rounded-xl bg-white/5 border border-white/5">
                            {item.trim()}
                          </span>
                        ))}
                      </div>
                    </>
                  ) : (
                    <>
                      <Icon className="w-5 h-5 text-amber-500/60" />
                      <div className="flex flex-col gap-1">
                        <span className="text-[9px] font-black uppercase tracking-widest text-white/30">{displayLabel}</span>
                        <span className="text-xs font-bold text-white">{value}</span>
                      </div>
                    </>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 6. PIX SECTION (Visible if filled) */}
      {cf.chave_pix && (
        <div className="px-6 mt-12">
          <div className="flex items-center gap-3 mb-6">
            <div className="h-6 w-1 bg-teal-500 rounded-full shadow-[0_0_15px_rgba(20,184,166,0.5)]" />
            <h2 className="text-xs font-black uppercase tracking-[0.3em] opacity-60 text-teal-500">Pagamento PIX</h2>
          </div>
          <Button
            variant="outline"
            onClick={() => {
              navigator.clipboard.writeText(cf.chave_pix);
              toast.success('Chave PIX copiada!');
            }}
            className="w-full h-16 rounded-2xl bg-teal-950/20 border-teal-500/20 hover:bg-teal-950/40 text-teal-100 flex items-center justify-between px-6 group"
          >
            <div className="flex items-center gap-4">
              <div className="p-2 rounded-xl bg-teal-500/20 text-teal-400 group-hover:scale-110 transition-transform">
                <Copy className="w-5 h-5" />
              </div>
              <div className="flex flex-col items-start">
                <span className="text-[9px] font-black uppercase tracking-widest text-teal-500/60">Copiar Chave</span>
                <span className="text-sm font-bold font-mono truncate max-w-[180px]">{cf.chave_pix}</span>
              </div>
            </div>
            <span className="text-[10px] font-black uppercase text-teal-500 opacity-40">Tocar para copiar</span>
          </Button>
        </div>
      )}

      {/* 7. CUSTOM LINKS (Visible if filled) */}
      {customLinks.length > 0 && (
        <div className="px-6 mt-12">
          <div className="flex items-center gap-3 mb-6">
            <div className="h-6 w-1 bg-white/20 rounded-full" />
            <h2 className="text-xs font-black uppercase tracking-[0.3em] opacity-60">Links Úteis</h2>
          </div>
          <div className="flex flex-col gap-3">
            {customLinks.map((link, i) => (
              <Button
                key={i}
                asChild
                variant="outline"
                className="w-full h-14 rounded-2xl bg-white/5 border-white/10 hover:bg-white/10 text-white font-bold"
              >
                <a href={link.url.startsWith('http') ? link.url : `https://${link.url}`} target="_blank" rel="noopener noreferrer" className="flex items-center justify-between px-6">
                  <span>{link.title}</span>
                  <ChevronRight className="w-4 h-4 opacity-40" />
                </a>
              </Button>
            ))}
          </div>
        </div>
      )}

      {/* 8. SERVICES SHOWCASE */}
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

      {/* 9. BIO / ABOUT */}
      {data.bio_profissional && (
        <div className="px-6 mt-16 pb-10">
          <div className="p-8 rounded-[3rem] bg-amber-500 text-black shadow-[0_30px_60px_-15px_rgba(245,158,11,0.3)]">
            <div className="flex items-center gap-3 mb-6">
              <User className="w-6 h-6" />
              <h2 className="text-sm font-black uppercase tracking-widest">Sobre o Estúdio</h2>
            </div>
            
            <p className="text-sm font-bold leading-relaxed italic opacity-80">
              "{data.bio_profissional}"
            </p>

            <div className="mt-8 pt-8 border-t border-black/10">
              <div className="flex flex-wrap gap-2">
                {(data.diferenciais || []).map((dif, i) => (
                  <div key={i} className="flex items-center gap-2 px-3 py-1 bg-black/5 rounded-full">
                    <Check className="w-3 h-3" />
                    <span className="text-[9px] font-black uppercase">{dif}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 10. INTERACTIVE QR CODE (Pro Only) */}
      {isPro && (data.username || data.id) && (
        <div className="px-6 mt-16 flex flex-col items-center gap-6">
          <div className="flex flex-col items-center text-center gap-2 mb-4">
            <QrCode className="w-8 h-8 text-amber-500 opacity-60" />
            <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-white/40">QR Code Interativo</h3>
          </div>
          
          <div className="p-6 rounded-[2.5rem] bg-white/5 border border-white/10 backdrop-blur-md shadow-2xl">
            <AnimatedQR
              url={`${process.env.NEXT_PUBLIC_APP_URL || 'https://konnexy.com.br'}/${data.username || data.id}`}
              photoUrl={data.photo_url || undefined}
              accentColor="#f59e0b"
              size={180}
              active={isPro}
              customFields={data.custom_fields}
            />
          </div>
          
          <p className="text-[10px] font-bold text-white/30 uppercase tracking-widest">Escaneie para compartilhar</p>
        </div>
      )}

      {/* 11. SOCIAL & BRANDING */}
      <div className="px-6 mt-16 flex flex-col items-center gap-10">
        <div className="flex gap-6">
          {data.instagram && (
            <a href={`https://instagram.com/${data.instagram}`} target="_blank" rel="noopener noreferrer" className="p-4 rounded-2xl bg-white/5 border border-white/10 hover:bg-amber-500 hover:text-black transition-all">
              <Instagram className="w-5 h-5" />
            </a>
          )}
          {data.facebook && (
            <a href={`https://facebook.com/${data.facebook}`} target="_blank" rel="noopener noreferrer" className="p-4 rounded-2xl bg-white/5 border border-white/10 hover:bg-amber-500 hover:text-black transition-all">
              <Facebook className="w-5 h-5" />
            </a>
          )}
          {data.youtube && (
            <a href={`https://youtube.com/${data.youtube}`} target="_blank" rel="noopener noreferrer" className="p-4 rounded-2xl bg-white/5 border border-white/10 hover:bg-amber-500 hover:text-black transition-all">
              <Youtube className="w-5 h-5" />
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
