"use client";

import { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  MessageCircle,
  MapPin,
  ChevronRight,
  Car,
  ShieldCheck,
  Star,
  Sparkles,
  Image as ImageIcon,
  ExternalLink,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Profile } from '@/types/profile';
import { cn } from '@/lib/utils';

interface AutomotiveDetailingLayoutProps {
  data: Partial<Profile>;
  isPro: boolean;
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
      className="relative w-full overflow-hidden"
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
          <img src={images[current]} alt={`Serviço ${current + 1}`} className="w-full h-full object-cover" />
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
// LAYOUT PRINCIPAL — ESTÉTICA AUTOMOTIVA
// ─────────────────────────────────────────
export function AutomotiveDetailingLayout({ data, isPro }: AutomotiveDetailingLayoutProps) {
  const cf = (data.custom_fields as any) || {};
  const themeHex = data.theme_color || '#f59e0b';
  const textColor = cf.cor_texto;

  // WhatsApp
  const cleanWpp = data.whatsapp?.replace(/\D/g, '') || '';
  const fmtWpp = cleanWpp.startsWith('55') ? cleanWpp : `55${cleanWpp}`;
  const wppMsg = data.whatsapp_message || 'Olá! Vi seu perfil na Konnexy e gostaria de solicitar um orçamento de estética automotiva 🚗✨';
  const wppLink = fmtWpp ? `https://wa.me/${fmtWpp}?text=${encodeURIComponent(wppMsg)}` : '#';

  // Portfolio images (suporta background_video_url ou cf.portfolio_images)
  const rawImgs = cf.portfolio_images;
  const portfolioImages: string[] = Array.isArray(rawImgs)
    ? rawImgs.filter(Boolean)
    : typeof rawImgs === 'string'
      ? rawImgs.split(/[,;]/).map((s: string) => s.trim()).filter(Boolean)
      : [];

  // Fallback: usar background_video_url como imagem única se não houver portfolio
  const images: string[] = portfolioImages.length > 0
    ? portfolioImages
    : data.background_video_url && !data.background_video_url.match(/\.(mp4|webm|ogg|mov)$/i)
      ? [data.background_video_url]
      : [];

  // Imagem de fundo estática
  const bgImage: string | undefined = cf.imagem_fundo || cf.cor_fundo;
  const hasBgImage = bgImage && (bgImage.startsWith('http') || bgImage.startsWith('/'));

  // Services
  const rawServices = data.servicos || data.services || [];
  const services = rawServices.map((s: any) => ({
    nome: s.nome || s.name || '',
    descricao: s.descricao || s.description || '',
    preco: s.preco || s.price || '',
  })).filter((s: any) => s.nome);

  // Diferenciais booleanos específicos de estética automotiva
  const boolDiferenciais = [
    { key: 'polimento_tecnico', label: 'Polimento Técnico' },
    { key: 'higienizacao_interna', label: 'Higienização Interna' },
    { key: 'vitrificacao_pintura', label: 'Vitrificação' },
    { key: 'peliculas_ppf', label: 'Películas PPF' },
    { key: 'ceramic_coating', label: 'Ceramic Coating' },
    { key: 'lavagem_ecologica', label: 'Lavagem Ecológica' },
    { key: 'atende_em_domicilio', label: 'Atende em Domicílio' },
    { key: 'leva_e_traz', label: 'Leva & Traz' },
  ].filter(b => cf[b.key] === true);

  // Especialidades (array)
  const rawEspecialidades = cf.especialidades || cf.diferenciais || data.diferenciais || [];
  const especialidades: string[] = Array.isArray(rawEspecialidades)
    ? rawEspecialidades.filter(Boolean)
    : typeof rawEspecialidades === 'string'
      ? rawEspecialidades.split(/[,;]/).map((s: string) => s.trim()).filter(Boolean)
      : [];

  // Link externo (catálogo, portfólio etc.)
  const externalLink = cf.link_catalogo || cf.link_portfolio;

  const fadeUp = {
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
      {/* ── IMAGEM DE FUNDO GLOBAL ── */}
      {hasBgImage && (
        <>
          <div
            className="absolute inset-0 w-full h-full z-0"
            style={{
              backgroundImage: `url('${bgImage}')`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }}
          />
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
                {(data.business_name || 'A')[0].toUpperCase()}
              </div>
            )}
          </div>

          {/* Nome + profissão */}
          <div className="flex flex-col items-center w-full">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-[0.2em] mb-3" style={{ backgroundColor: themeHex + '18', color: themeHex }}>
              <Car className="w-3.5 h-3.5" />
              {data.subtitle ? 'Estética Automotiva' : 'Detailing Premium'}
            </div>
            <h1 className="text-[28px] font-black tracking-tight leading-none uppercase text-white drop-shadow-lg mb-2">
              {data.business_name || 'Studio Detailing'}
            </h1>
            {(data.subtitle || data.tagline) && (
              <p className="text-[12px] text-white/50 font-medium tracking-wide max-w-[90%]">{data.subtitle || data.tagline}</p>
            )}
          </div>
        </motion.div>

        {/* ── TAGS: ESPECIALIDADES ── */}
        {(especialidades.length > 0 || cf.anos_experiencia) && (
          <motion.div custom={1} initial="hidden" animate="visible" variants={fadeUp} className="px-5 pt-4 pb-1">
            <div className="flex flex-wrap gap-2">
              {cf.anos_experiencia && (
                <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] font-bold border" style={{ borderColor: themeHex + '35', color: themeHex, backgroundColor: themeHex + '12' }}>
                  <Star className="w-3 h-3" />
                  {cf.anos_experiencia}
                </span>
              )}
              {especialidades.slice(0, 4).map((esp: string, i: number) => (
                <span key={i} className="px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-wider border border-white/8 text-white/40">
                  {esp}
                </span>
              ))}
            </div>
          </motion.div>
        )}

        {/* ── CTA WHATSAPP ── */}
        <motion.div custom={2} initial="hidden" animate="visible" variants={fadeUp} className="px-5 pt-5 pb-2">
          <Button
            asChild
            className="w-full h-14 rounded-2xl text-[13px] font-black uppercase tracking-widest border-none flex items-center justify-center gap-3 shadow-2xl transition-all hover:scale-[1.02] active:scale-[0.98]"
            style={{
              background: cf.cor_botoes || `linear-gradient(135deg, ${themeHex} 0%, #b45309 100%)`,
              color: cf.cor_texto_botoes || '#000000',
              boxShadow: `0 16px 40px -8px ${themeHex}55`,
            }}
          >
            <a href={wppLink} target="_blank" rel="noopener noreferrer">
              <MessageCircle className="w-5 h-5 fill-current" />
              {data.cta_text || 'Solicitar Orçamento'}
            </a>
          </Button>
        </motion.div>

        {/* ── HERO: CARROSSEL (Abaixo do CTA) ── */}
        {images.length > 0 && (
          <motion.div custom={2.3} initial="hidden" animate="visible" variants={fadeUp} className="px-5 py-4">
            <div className="rounded-3xl overflow-hidden shadow-2xl border border-white/10">
              <HeroCarousel images={images} themeHex={themeHex} />
            </div>
          </motion.div>
        )}

        {/* ── DIFERENCIAIS BOOLEANOS ── */}
        {boolDiferenciais.length > 0 && (
          <motion.div custom={2.5} initial="hidden" animate="visible" variants={fadeUp} className="px-5 pt-4 pb-1">
            <p className="text-[9px] font-black uppercase tracking-[0.3em] text-white/25 mb-3">Serviços & Diferenciais</p>
            <div className="flex flex-wrap gap-2">
              {boolDiferenciais.map(b => (
                <div key={b.key} className="flex items-center gap-2 px-3 py-2 rounded-xl text-[11px] font-bold border" style={{ borderColor: themeHex + '22', color: themeHex, background: themeHex + '0C' }}>
                  <span className="w-1.5 h-1.5 rounded-full flex-none" style={{ backgroundColor: themeHex }} />
                  {b.label}
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* ── SERVIÇOS ── */}
        {services.length > 0 && (
          <motion.div custom={3} initial="hidden" animate="visible" variants={fadeUp} className="px-5 pt-6 pb-2">
            {/* Separator */}
            <div className="flex items-center gap-3 mb-5">
              <div className="h-px flex-1" style={{ background: `linear-gradient(to right, ${themeHex}45, transparent)` }} />
              <span className="text-[9px] font-black uppercase tracking-[0.35em] text-white/25">Serviços & Pacotes</span>
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
                  style={{ borderColor: themeHex + '15', backgroundColor: hasBgImage ? 'rgba(10,10,10,0.7)' : '#111111', backdropFilter: hasBgImage ? 'blur(12px)' : undefined }}
                >
                  {/* Number */}
                  <div className="flex-none w-8 h-8 rounded-xl flex items-center justify-center text-[11px] font-black mt-0.5" style={{ background: themeHex + '18', color: themeHex }}>
                    {String(idx + 1).padStart(2, '0')}
                  </div>

                  <div className="flex-1 min-w-0">
                    <h3 className="text-[13px] font-black uppercase tracking-tight text-white leading-tight mb-1">{srv.nome}</h3>
                    {srv.descricao && <p className="text-[11px] text-white/40 leading-relaxed font-medium line-clamp-2">{srv.descricao}</p>}
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
                backgroundColor: hasBgImage ? 'rgba(10,10,10,0.65)' : '#0f0f0f',
                backdropFilter: hasBgImage ? 'blur(16px)' : undefined
              }}
            >
              <span className="absolute top-1 left-4 text-8xl font-black leading-none select-none pointer-events-none" style={{ color: themeHex + '10' }}>"</span>
              <div className="flex items-center gap-2.5 mb-4 relative z-10">
                <div className="w-7 h-7 rounded-xl flex items-center justify-center" style={{ background: themeHex + '18' }}>
                  <Sparkles className="w-3.5 h-3.5" style={{ color: themeHex }} />
                </div>
                <span className="text-[9px] font-black uppercase tracking-[0.3em] text-white/30">Sobre o Estúdio</span>
              </div>
              <p className="text-[13px] text-white/65 leading-relaxed tracking-tight relative z-10 italic">
                {data.bio_profissional}
              </p>
            </div>
          </motion.div>
        )}

        {/* ── LINK EXTERNO ── */}
        {externalLink && (
          <motion.div custom={4.5} initial="hidden" animate="visible" variants={fadeUp} className="px-5 pt-4 pb-2">
            <Button asChild variant="outline"
              className="w-full h-12 rounded-2xl border text-[12px] font-black uppercase tracking-wider flex items-center justify-center gap-2 bg-transparent transition-all hover:scale-[1.01]"
              style={{ borderColor: themeHex + '30', color: themeHex, backdropFilter: 'blur(8px)' }}
            >
              <a href={externalLink.startsWith('http') ? externalLink : `https://${externalLink}`} target="_blank" rel="noopener noreferrer">
                <ExternalLink className="w-4 h-4" />
                Ver Portfólio Completo
              </a>
            </Button>
          </motion.div>
        )}

        {/* ── ENDEREÇO ── */}
        {data.endereco_completo && (
          <motion.div custom={5} initial="hidden" animate="visible" variants={fadeUp} className="px-5 pt-3 pb-2">
            <a
              href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(data.endereco_completo)}`}
              target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-3 px-4 py-3 rounded-2xl border border-white/8 text-white/40 hover:text-white/60 transition-colors"
              style={{ backgroundColor: hasBgImage ? 'rgba(255,255,255,0.05)' : 'rgba(255,255,255,0.03)', backdropFilter: hasBgImage ? 'blur(8px)' : undefined }}
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
