"use client";

import { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence, Variants } from 'framer-motion';
import { 
  MessageCircle, 
  MapPin, 
  ChevronRight, 
  Star, 
  Award, 
  ShieldCheck, 
  Check, 
  Image as ImageIcon,
  Briefcase,
  Utensils,
  Wrench,
  Wind,
  Hammer,
  Settings,
  Zap,
  Smile,
  Truck,
  Eye,
  Brush,
  Smartphone,
  HardHat,
  Sun,
  Car,
  Scissors,
  Scale,
  Music,
  ExternalLink,
  Users
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Profile } from '@/types/profile';
import { cn } from '@/lib/utils';
import { ProfessionConfig } from '@/config/professions';

interface StandardProfessionalLayoutProps {
  data: Partial<Profile>;
  config: ProfessionConfig;
  isPro: boolean;
  profession: string;
}

// ─────────────────────────────────────────
// DYNAMIC ICON RESOLVER
// ─────────────────────────────────────────
function getProfessionIcon(prof: string) {
  switch (prof) {
    case 'chef_eventos': return Utensils;
    case 'montador_moveis': return Wrench;
    case 'ar_condicionado': return Wind;
    case 'pedreiro': return Hammer;
    case 'mecanico': return Settings;
    case 'eletricista': return Zap;
    case 'encanador': return Wrench;
    case 'diarista': return Smile;
    case 'frete': return Truck;
    case 'gesseiro': return Hammer;
    case 'vidraceiro': return Eye;
    case 'pintor': return Brush;
    case 'serralheiro': return Hammer;
    case 'marceneiro': return Wrench;
    case 'assistencia_celular': return Smartphone;
    case 'mestre_de_obras': return HardHat;
    case 'area_lazer': return Sun;
    case 'manutencao_automotiva': return Car;
    case 'barbearia': return Scissors;
    case 'advogado': return Scale;
    case 'musico': return Music;
    default: return Briefcase;
  }
}

// ─────────────────────────────────────────
// CARROSSEL FULLBLEED HERO
// ─────────────────────────────────────────
function HeroCarousel({ images, themeHex }: { images: string[]; themeHex: string }) {
  const [current, setCurrent] = useState(0);
  const [paused, setPaused] = useState(false);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const goTo = useCallback((i: number) => setCurrent((i + images.length) % images.length), [images.length]);
  const next = useCallback(() => goTo(current + 1), [current, goTo]);
  const prev = useCallback(() => goTo(current - 1), [current, goTo]);

  useEffect(() => {
    if (paused || images.length <= 1) return;
    timer.current = setTimeout(next, 3200);
    return () => { if (timer.current) clearTimeout(timer.current); };
  }, [current, paused, images.length, next]);

  return (
    <div
      className="relative w-full overflow-hidden animate-in fade-in duration-700"
      style={{ aspectRatio: '16/10' }}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onTouchStart={e => setTouchStart(e.touches[0].clientX)}
      onTouchEnd={e => {
        if (touchStart === null) return;
        const diff = touchStart - e.changedTouches[0].clientX;
        if (Math.abs(diff) > 40) diff > 0 ? next() : prev();
        setTouchStart(null);
      }}
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={current}
          className="absolute inset-0"
          initial={{ opacity: 0, scale: 1.05 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.85, ease: [0.25, 0.46, 0.45, 0.94] }}
        >
          <img src={images[current]} alt={`Portfólio ${current + 1}`} className="w-full h-full object-cover" />
        </motion.div>
      </AnimatePresence>

      {/* Gradients */}
      <div className="absolute inset-x-0 top-0 h-1/3 bg-gradient-to-b from-black/55 to-transparent z-10 pointer-events-none" />
      <div className="absolute inset-x-0 bottom-0 h-3/4 bg-gradient-to-t from-[#0a0a0a] via-black/50 to-transparent z-10 pointer-events-none" />

      {/* Progress bars */}
      {images.length > 1 && (
        <div className="absolute top-3 inset-x-3 flex gap-1 z-20">
          {images.map((_, i) => (
            <button key={i} onClick={() => goTo(i)} className="flex-1 h-[3px] rounded-full overflow-hidden bg-white/20" aria-label={`Foto ${i + 1}`}>
              {i === current ? (
                <motion.div
                  key={current}
                  className="h-full rounded-full origin-left"
                  style={{ backgroundColor: themeHex }}
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: paused ? 0 : 1 }}
                  transition={{ duration: paused ? 0 : 3.2, ease: 'linear' }}
                />
              ) : (
                <div className="h-full rounded-full" style={{ backgroundColor: i < current ? themeHex : 'transparent', opacity: i < current ? 0.7 : 0 }} />
              )}
            </button>
          ))}
        </div>
      )}

      {/* Bottom dots + counter */}
      {images.length > 1 && (
        <div className="absolute inset-x-5 bottom-5 z-20 flex items-center justify-between">
          <div className="flex gap-1.5">
            {images.map((_, i) => (
              <button key={i} onClick={() => goTo(i)}
                className={cn('rounded-full transition-all duration-300', i === current ? 'w-5 h-2' : 'w-2 h-2 opacity-30')}
                style={{ backgroundColor: i === current ? themeHex : 'white' }}
              />
            ))}
          </div>
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full backdrop-blur-md bg-black/30">
            <div className={cn('w-1.5 h-1.5 rounded-full transition-colors', paused ? 'bg-white/30' : 'bg-green-400')} />
            <span className="text-[9px] font-black text-white/50 uppercase tracking-widest">
              {paused ? 'pausado' : 'auto'} · {String(current + 1).padStart(2, '0')}/{String(images.length).padStart(2, '0')}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────
// LAYOUT PRINCIPAL PADRONIZADO PREMIUM
// ─────────────────────────────────────────
export function StandardProfessionalLayout({ 
  data, 
  config, 
  isPro,
  profession 
}: StandardProfessionalLayoutProps) {
  const cf = (data.custom_fields as any) || {};
  const themeHex = data.theme_color || '#3b82f6';
  const textColor = cf.cor_texto;

  // Cores por seção
  const bioFundo = cf.cor_bio_fundo;
  const bioTexto = cf.cor_bio_texto;
  const servicosFundo = cf.cor_servicos_fundo;
  const servicosTexto = cf.cor_servicos_texto;
  const diferenciaisFundo = cf.cor_diferenciais_fundo;
  const diferenciaisTexto = cf.cor_diferenciais_texto;
  const infoFundo = cf.cor_info_fundo;
  const infoTexto = cf.cor_info_texto;

  // WhatsApp Principal
  const cleanWpp = data.whatsapp?.replace(/\D/g, '') || '';
  const fmtWpp = cleanWpp.startsWith('55') ? cleanWpp : `55${cleanWpp}`;
  const defaultWppMsg = data.whatsapp_message || `Olá! Vi seu perfil na Konnexy e gostaria de solicitar um orçamento para seus serviços de ${config.label} 🚀`;
  const wppLink = fmtWpp ? `https://wa.me/${fmtWpp}?text=${encodeURIComponent(defaultWppMsg)}` : '#';

  // WhatsApp Secundário
  const cleanWppSec = data.whatsapp_secondary?.replace(/\D/g, '') || '';
  const fmtWppSec = cleanWppSec ? (cleanWppSec.startsWith('55') ? cleanWppSec : `55${cleanWppSec}`) : '';
  const wppSecLink = fmtWppSec ? `https://wa.me/${fmtWppSec}?text=${encodeURIComponent(data.whatsapp_secondary_message || defaultWppMsg)}` : null;

  // Portfolio images resolver (suporta array ou string separada por vírgula)
  const rawImgs = cf.portfolio_images;
  const images: string[] = Array.isArray(rawImgs)
    ? rawImgs.filter(Boolean)
    : typeof rawImgs === 'string'
      ? rawImgs.split(/[,;]/).map((s: string) => s.trim()).filter(Boolean)
      : [];

  // Imagem de fundo estática
  const bgImage: string | undefined = (isPro && data.background_video_url) || cf.imagem_fundo || cf.cor_fundo;
  const hasBgImage = bgImage && (bgImage.startsWith('http') || bgImage.startsWith('/'));

  // Services
  const rawServices = data.servicos || data.services || [];
  const services = rawServices.map((s: any) => ({
    nome: s.nome || s.name || '',
    descricao: s.descricao || s.description || '',
    preco: s.preco || s.price || '',
    imagem: s.imagem || s.image || '',
  })).filter((s: any) => s.nome);

  // Dynamic Icon for Profession
  const IconComponent = getProfessionIcon(profession);

  // Mapeamento dinâmico de campos customizados para exibir como tags/destaques
  const booleanDiferenciais = config.customFields
    .filter(f => f.type === 'boolean' && cf[f.name] === true)
    .map(f => ({ name: f.name, label: f.label }));

  const arrayFields = config.customFields
    .filter(f => f.type === 'array' && cf[f.name] && !['portfolio_images'].includes(f.name))
    .map(f => {
      const val = cf[f.name];
      const items: string[] = Array.isArray(val)
        ? val
        : typeof val === 'string'
          ? val.split(/[,;]/).map((s: string) => s.trim()).filter(Boolean)
          : [];
      return { name: f.name, label: f.label, items };
    });

  const textHighlights = config.customFields
    .filter(f => f.type === 'text' && cf[f.name] && !['imagem_fundo', 'link_cardapio', 'link_catalogo', 'foto_local'].includes(f.name))
    .map(f => ({ name: f.name, label: f.label, value: cf[f.name] }));

  // Link do catálogo ou arquivo externo
  const externalLink = cf.link_catalogo || cf.link_cardapio;

  const fadeUp: Variants = {
    hidden: { opacity: 0, y: 24 },
    visible: (i: number) => ({
      opacity: 1, y: 0,
      transition: { delay: i * 0.09, duration: 0.7, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] }
    })
  };

  return (
    <div
      className="w-full min-h-full flex flex-col overflow-x-hidden relative"
      style={{
        backgroundColor: hasBgImage ? 'transparent' : (cf.cor_fundo || '#0a0a0a'),
        color: textColor || '#ffffff',
        fontFamily: data.font_family || 'inherit',
      }}
    >
      {/* ── IMAGEM DE FUNDO GLOBAL (quando definida localmente sem background_video_url) ── */}
      {hasBgImage && !(isPro && data.background_video_url) && (
        <>
          <div
            className="absolute inset-0 w-full h-full z-0"
            style={{
              backgroundImage: `url('${bgImage}')`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }}
          />
          {/* Overlay escuro para garantir legibilidade */}
          <div className="absolute inset-0 z-0" style={{ background: 'linear-gradient(to bottom, rgba(10,10,10,0.72) 0%, rgba(10,10,10,0.94) 100%)' }} />
        </>
      )}

      {/* Conteúdo z-10 */}
      <div className="relative z-10 flex flex-col w-full">

        {/* ── HEADER IDENTIDADE DO PROFISSIONAL (Estática no topo) ── */}
        <motion.div
          custom={0} initial="hidden" animate="visible" variants={fadeUp}
          className="px-5 pt-8 pb-4 flex flex-col items-center text-center relative"
        >
          {/* Avatar com borda premium */}
          <div
            className="relative w-28 h-28 rounded-full overflow-hidden shadow-2xl border-4 mb-4 transition-transform hover:scale-105 duration-500"
            style={{ borderColor: themeHex }}
          >
            {data.photo_url ? (
              <img src={data.photo_url} alt={data.business_name || ''} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-4xl font-black" style={{ background: themeHex + '20', color: themeHex }}>
                {(data.business_name || 'K')[0].toUpperCase()}
              </div>
            )}
          </div>

          {/* Nome + profissão */}
          <div className="flex flex-col items-center w-full">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-[0.2em] mb-3" style={{ backgroundColor: themeHex + '18', color: themeHex }}>
              <IconComponent className="w-3.5 h-3.5" />
              {config.label}
            </div>
            <h1 className="text-[28px] font-black tracking-tight leading-none uppercase text-white drop-shadow-lg mb-2">
              {data.business_name || 'Profissional'}
            </h1>
            {(data.subtitle || data.tagline) && (
              <p className="text-[12px] text-white/50 font-medium tracking-wide max-w-[90%]">{data.subtitle || data.tagline}</p>
            )}
          </div>
        </motion.div>

        {/* ── TAGS: DESTAQUES / ATRIBUTOS DIVERSOS ── */}
        {(textHighlights.length > 0 || booleanDiferenciais.length > 0) && (
          <motion.div custom={1} initial="hidden" animate="visible" variants={fadeUp} className="px-5 pt-4 pb-1">
            <div className="flex flex-wrap gap-2">
              {textHighlights.map((highlight, i) => (
                <span key={i} className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] font-bold border" style={{ borderColor: themeHex + '35', color: themeHex, backgroundColor: themeHex + '12' }}>
                  <Star className="w-3.5 h-3.5" />
                  {highlight.label}: {highlight.value}
                </span>
              ))}
              {booleanDiferenciais.slice(0, 2).map((b, i) => (
                <span key={i} className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] font-bold border border-white/10 text-white/55 bg-white/5">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                  {b.label}
                </span>
              ))}
            </div>
          </motion.div>
        )}

        {/* ── CTA WHATSAPP PRINCIPAL ── */}
        <motion.div custom={2} initial="hidden" animate="visible" variants={fadeUp} className="px-5 pt-5 pb-2">
          <Button
            asChild
            className="w-full h-14 rounded-2xl text-[13px] font-black uppercase tracking-widest border-none flex items-center justify-center gap-3 shadow-2xl transition-all hover:scale-[1.02] active:scale-[0.98]"
            style={{
              background: cf.cor_botoes || `linear-gradient(135deg, ${themeHex} 0%, #1e3a8a 100%)`,
              color: cf.cor_texto_botoes || '#ffffff',
              boxShadow: `0 16px 40px -8px ${themeHex}55`,
            }}
          >
            <a href={wppLink} target="_blank" rel="noopener noreferrer">
              <MessageCircle className="w-5 h-5 fill-current" />
              {data.cta_text || config.defaultCta || 'Falar no WhatsApp'}
            </a>
          </Button>
        </motion.div>

        {/* ── CTA WHATSAPP SECUNDÁRIO ── */}
        {wppSecLink && (
          <motion.div custom={2.2} initial="hidden" animate="visible" variants={fadeUp} className="px-5 pt-1.5 pb-2">
            <Button
              asChild
              variant="outline"
              className="w-full h-12 rounded-2xl text-[11px] font-black uppercase tracking-widest border flex items-center justify-center gap-2 bg-transparent transition-all hover:scale-[1.01]"
              style={{ borderColor: themeHex + '30', color: themeHex }}
            >
              <a href={wppSecLink} target="_blank" rel="noopener noreferrer">
                <MessageCircle className="w-4.5 h-4.5" />
                Segundo WhatsApp / Suporte
              </a>
            </Button>
          </motion.div>
        )}

        {/* ── HERO: CARROSSEL (Abaixo do CTA) ── */}
        {images.length > 0 && (
          <motion.div custom={2.3} initial="hidden" animate="visible" variants={fadeUp} className="px-5 py-4">
            <div className="rounded-3xl overflow-hidden shadow-2xl border border-white/10">
              <HeroCarousel images={images} themeHex={themeHex} />
            </div>
          </motion.div>
        )}

        {/* ── DIFERENCIAIS DETALHADOS (BOOLEANS SOBRANTES E ARRAY DIFFERENTIALS) ── */}
        {(booleanDiferenciais.length > 0 || (data.diferenciais && data.diferenciais.length > 0)) && (
          <motion.div custom={2.5} initial="hidden" animate="visible" variants={fadeUp} className="px-5 pt-4 pb-1">
            <div
              className="rounded-2xl p-4"
              style={{
                backgroundColor: diferenciaisFundo || (hasBgImage ? 'rgba(10,10,10,0.65)' : 'transparent'),
                color: diferenciaisTexto || undefined,
              }}
            >
              <p
                className="text-[9px] font-black uppercase tracking-[0.3em] mb-3"
                style={{ color: diferenciaisTexto ? diferenciaisTexto + 'aa' : 'rgba(255,255,255,0.25)' }}
              >Qualidades & Diferenciais</p>
              <div className="flex flex-wrap gap-2">
                {booleanDiferenciais.map(b => (
                  <div key={b.name} className="flex items-center gap-2 px-3 py-2 rounded-xl text-[11px] font-bold border" style={{ borderColor: themeHex + '22', color: diferenciaisTexto || themeHex, background: themeHex + '0C' }}>
                    <span className="w-1.5 h-1.5 rounded-full flex-none" style={{ backgroundColor: diferenciaisTexto || themeHex }} />
                    {b.label}
                  </div>
                ))}
                {(data.diferenciais || []).map((dif: string, i: number) => (
                  <div key={i} className="flex items-center gap-2 px-3 py-2 rounded-xl text-[11px] font-bold border" style={{ borderColor: 'rgba(255,255,255,0.07)', color: diferenciaisTexto || 'rgba(255,255,255,0.6)', background: diferenciaisFundo ? 'transparent' : 'rgba(255,255,255,0.02)' }}>
                    <span className="w-1.5 h-1.5 rounded-full flex-none" style={{ backgroundColor: diferenciaisTexto || 'rgba(255,255,255,0.3)' }} />
                    {dif}
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {/* ── TAGS DE ARRAYS (Marcas, Especialidades etc) ── */}
        {arrayFields.length > 0 && (
          <motion.div custom={2.8} initial="hidden" animate="visible" variants={fadeUp} className="px-5 pt-4 pb-1">
            {arrayFields.map((field) => (
              <div key={field.name} className="mb-4 last:mb-0">
                <p className="text-[9px] font-black uppercase tracking-[0.3em] text-white/25 mb-2.5">{field.label}</p>
                <div className="flex flex-wrap gap-1.5">
                  {field.items.map((item, i) => (
                    <span key={i} className="px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider border border-white/8 text-white/45 bg-white/[0.01]">
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </motion.div>
        )}

        {/* ── SERVIÇOS ── */}
        {services.length > 0 && (
          <motion.div custom={3} initial="hidden" animate="visible" variants={fadeUp} className="px-5 pt-6 pb-2">
            {/* Separador */}
            <div className="flex items-center gap-3 mb-5">
              <div className="h-px flex-1" style={{ background: `linear-gradient(to right, ${themeHex}45, transparent)` }} />
              <span className="text-[9px] font-black uppercase tracking-[0.35em]" style={{ color: servicosTexto ? servicosTexto + '99' : 'rgba(255,255,255,0.25)' }}>Serviços & Pacotes</span>
              <div className="h-px flex-1" style={{ background: `linear-gradient(to left, ${themeHex}45, transparent)` }} />
            </div>

            <div className="flex flex-col gap-3">
              {services.map((srv: any, idx: number) => (
                <motion.a
                  key={idx}
                  href={wppLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.012, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  className="group relative overflow-hidden rounded-2xl border flex items-start gap-4 p-4 transition-all"
                  style={{
                    borderColor: themeHex + '15',
                    backgroundColor: servicosFundo || (hasBgImage ? 'rgba(10,10,10,0.7)' : '#111111'),
                    backdropFilter: hasBgImage ? 'blur(12px)' : undefined
                  }}
                >
                  {/* Number or Image */}
                  {srv.imagem ? (
                    <div className="flex-none w-12 h-12 rounded-xl overflow-hidden relative border border-white/10 shrink-0">
                      <img src={srv.imagem} alt={srv.nome} className="w-full h-full object-cover" />
                    </div>
                  ) : (
                    <div className="flex-none w-8 h-8 rounded-xl flex items-center justify-center text-[11px] font-black mt-0.5" style={{ background: themeHex + '18', color: themeHex }}>
                      {String(idx + 1).padStart(2, '0')}
                    </div>
                  )}

                  <div className="flex-1 min-w-0">
                    <h3 className="text-[13px] font-black uppercase tracking-tight leading-tight mb-1" style={{ color: servicosTexto || '#ffffff' }}>{srv.nome}</h3>
                    {srv.descricao && <p className="text-[11px] leading-relaxed font-medium line-clamp-2" style={{ color: servicosTexto ? servicosTexto + '88' : 'rgba(255,255,255,0.4)' }}>{srv.descricao}</p>}
                  </div>

                  {srv.preco && (
                    <div className="flex-none flex flex-col items-end gap-1 shrink-0">
                      <span className="text-[12px] font-black leading-tight whitespace-nowrap" style={{ color: themeHex }}>{srv.preco}</span>
                      <ChevronRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-40 transition-opacity" style={{ color: themeHex }} />
                    </div>
                  )}

                  {/* Hover glow */}
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" style={{ background: `radial-gradient(circle at 15% 50%, ${themeHex}0A, transparent 60%)` }} />
                </motion.a>
              ))}
            </div>
          </motion.div>
        )}

        {/* ── BIO / SOBRE ── */}
        {data.bio_profissional && (
          <motion.div custom={4} initial="hidden" animate="visible" variants={fadeUp} className="px-5 pt-6 pb-2">
            <div
              className="relative p-6 rounded-3xl border overflow-hidden"
              style={{
                borderColor: themeHex + '18',
                backgroundColor: bioFundo || (hasBgImage ? 'rgba(10,10,10,0.65)' : '#0f0f0f'),
                backdropFilter: hasBgImage ? 'blur(16px)' : undefined
              }}
            >
              {/* Aspas decorativas */}
              <span className="absolute top-1 left-4 text-8xl font-black leading-none select-none pointer-events-none" style={{ color: themeHex + '10' }}>"</span>
              <div className="flex items-center gap-2.5 mb-4 relative z-10">
                <div className="w-7 h-7 rounded-xl flex items-center justify-center" style={{ background: themeHex + '18' }}>
                  <IconComponent className="w-3.5 h-3.5" style={{ color: themeHex }} />
                </div>
                <span className="text-[9px] font-black uppercase tracking-[0.3em]" style={{ color: bioTexto ? bioTexto + 'aa' : 'rgba(255,255,255,0.3)' }}>Sobre o Profissional</span>
              </div>
              <p className="text-[13px] leading-relaxed tracking-tight relative z-10 italic" style={{ color: bioTexto || 'rgba(255,255,255,0.65)' }}>
                {data.bio_profissional}
              </p>
            </div>
          </motion.div>
        )}

        {/* ── LINK EXTERNO / CATÁLOGO ── */}
        {externalLink && (
          <motion.div custom={4.5} initial="hidden" animate="visible" variants={fadeUp} className="px-5 pt-4 pb-2">
            <Button asChild variant="outline"
              className="w-full h-12 rounded-2xl border text-[12px] font-black uppercase tracking-wider flex items-center justify-center gap-2 bg-transparent transition-all hover:scale-[1.01]"
              style={{ borderColor: themeHex + '30', color: themeHex, backdropFilter: 'blur(8px)' }}
            >
              <a href={externalLink.startsWith('http') ? externalLink : `https://${externalLink}`} target="_blank" rel="noopener noreferrer">
                <ExternalLink className="w-4 h-4" />
                Visualizar Catálogo Completo
              </a>
            </Button>
          </motion.div>
        )}

        {/* ── ENDEREÇO / REGIÃO DE ATENDIMENTO ── */}
        {data.endereco_completo && (
          <motion.div custom={5} initial="hidden" animate="visible" variants={fadeUp} className="px-5 pt-3 pb-2">
            <a
              href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(data.endereco_completo)}`}
              target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-3 px-4 py-3 rounded-2xl border transition-colors"
              style={{
                backgroundColor: infoFundo || (hasBgImage ? 'rgba(255,255,255,0.05)' : 'rgba(255,255,255,0.03)'),
                borderColor: infoFundo ? 'transparent' : 'rgba(255,255,255,0.08)',
                color: infoTexto || 'rgba(255,255,255,0.4)',
                backdropFilter: hasBgImage ? 'blur(8px)' : undefined
              }}
            >
              <MapPin className="w-4 h-4 flex-none text-red-400/60" />
              <span className="text-[11px] font-medium truncate">{data.endereco_completo}</span>
            </a>
          </motion.div>
        )}

        {/* ── BRANDING ── */}
        <motion.div custom={6} initial="hidden" animate="visible" variants={fadeUp} className="px-5 pt-8 pb-14 flex items-center justify-center">
          <div className="flex items-center gap-2 opacity-15 hover:opacity-40 transition-opacity">
            <div className="w-5 h-5 rounded-md rotate-12 flex items-center justify-center" style={{ background: themeHex }}>
              <span className="text-black text-[9px] font-black">K</span>
            </div>
            <span className="text-[10px] font-black uppercase tracking-[0.25em] text-white">Konnexy Digital</span>
          </div>
        </motion.div>

      </div>
    </div>
  );
}
