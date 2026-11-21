"use client";

import React, { useState } from 'react';
import { 
  Download, 
  Share2, 
  MapPin, 
  Music, 
  MessageCircle, 
  Check, 
  Copy, 
  Sparkles,
  ExternalLink,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { toast } from 'sonner';
import type { MusicProfileConfig } from '@/types/music';
import { SITE_URL } from '@/lib/seo/site';
import { trackMusicClickAction } from '@/app/actions/music-pro';

interface MusicHeroProps {
  profileId?: string;
  username?: string;
  stageName: string;
  professionLabel: string;
  genre?: string;
  city?: string;
  region?: string;
  bio?: string;
  avatarUrl?: string;
  coverUrl?: string;
  whatsapp?: string;
  hireMessage?: string;
  hireButtonText?: string;
  config: MusicProfileConfig;
  socialLinks?: {
    spotify?: string;
    instagram?: string;
    youtube?: string;
    tiktok?: string;
    soundcloud?: string;
    website?: string;
  };
  primaryColor?: string;
  secondaryColor?: string;
}

export function MusicHero({
  profileId,
  username,
  stageName,
  professionLabel,
  genre,
  city,
  region,
  bio,
  avatarUrl,
  coverUrl,
  whatsapp,
  hireMessage,
  hireButtonText = 'Contratar para Eventos',
  config,
  socialLinks = {},
  primaryColor = '#ef4444',
  secondaryColor = '#f43f5e'
}: MusicHeroProps) {
  const [bioExpanded, setBioExpanded] = useState(false);
  const cleanPhone = (whatsapp || '').replace(/\D/g, '');

  const defaultCover = 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&q=80&w=1280&h=720';
  const effectiveCover = config.custom_cover_url || coverUrl || defaultCover;
  const effectiveAvatar = config.custom_avatar_url || avatarUrl || '';

  const coverPositionClass = config.cover_framing === 'top' 
    ? 'object-top' 
    : config.cover_framing === 'bottom' 
      ? 'object-bottom' 
      : 'object-center';

  const avatarPositionClass = config.avatar_framing === 'top' 
    ? 'object-top' 
    : config.avatar_framing === 'bottom' 
      ? 'object-bottom' 
      : 'object-center';

  const handleHireClick = () => {
    if (profileId) {
      trackMusicClickAction(profileId, 'click_music_hire', { origin: 'hero' }).catch(() => {});
    }

    if (!cleanPhone) {
      toast.error('WhatsApp de contratação não configurado.');
      return;
    }

    const message = hireMessage || config.whatsapp_hire_message || 'Olá! Conheci seu trabalho pelo seu portfólio Konnexy e gostaria de informações sobre disponibilidade e valores para uma apresentação.';
    const waUrl = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`;
    window.open(waUrl, '_blank', 'noopener,noreferrer');
  };

  const handleShare = async () => {
    const publicUrl = username ? `${SITE_URL}/${encodeURIComponent(username)}` : SITE_URL;
    const shareData = {
      title: `${stageName} | Portfólio Musical`,
      text: `Confira o perfil musical oficial de ${stageName} no Konnexy Music Pro!`,
      url: publicUrl
    };

    if (navigator.share && navigator.canShare && navigator.canShare(shareData)) {
      try {
        await navigator.share(shareData);
      } catch {
        // usuário cancelou
      }
    } else {
      try {
        await navigator.clipboard.writeText(publicUrl);
        toast.success('Link copiado para a área de transferência!');
      } catch {
        toast.error('Não foi possível copiar o link.');
      }
    }
  };

  const handleDownloadVCard = () => {
    const vcard = [
      'BEGIN:VCARD',
      'VERSION:3.0',
      `FN:${stageName}`,
      `TITLE:${professionLabel}${genre ? ` - ${genre}` : ''}`,
      cleanPhone ? `TEL;TYPE=CELL,VOICE:+${cleanPhone}` : '',
      socialLinks.website ? `URL:${socialLinks.website}` : '',
      bio ? `NOTE:${bio.replace(/\r?\n/g, ' ')}` : '',
      'END:VCARD'
    ].filter(Boolean).join('\r\n');

    const blob = new Blob([vcard], { type: 'text/vcard;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `${stageName.toLowerCase().replace(/[^a-z0-9]/g, '-')}.vcf`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    toast.success('Contato pronto para salvar na sua agenda!');
  };

  const isBioLong = bio && bio.length > 180;
  const displayBio = isBioLong && !bioExpanded ? `${bio.slice(0, 180)}...` : bio;

  return (
    <section className="relative w-full overflow-hidden rounded-3xl bg-zinc-950 border border-zinc-850 shadow-2xl">
      {/* 1. Imagem de Capa 16:9 com Parallax e Ações Rápidas */}
      <div className="relative aspect-[16/9] w-full overflow-hidden bg-zinc-900">
        <img 
          src={effectiveCover} 
          alt={stageName} 
          className={`h-full w-full object-cover ${coverPositionClass} transition-transform duration-700 hover:scale-105 opacity-90`}
        />
        {/* Gradiente de transição para o corpo */}
        <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/40 to-transparent" />
        <div 
          className="absolute inset-0 opacity-30 pointer-events-none"
          style={{ background: `radial-gradient(circle at 50% 10%, ${primaryColor}55 0%, transparent 60%)` }}
        />

        {/* Botões Rápidos no topo da capa */}
        <div className="absolute top-3 right-3 flex items-center gap-2 z-20">
          <button
            type="button"
            onClick={handleDownloadVCard}
            title="Salvar Contato (.vcf)"
            aria-label="Salvar Contato na Agenda"
            className="flex h-9 w-9 items-center justify-center rounded-full bg-black/60 hover:bg-black/90 border border-white/20 text-white backdrop-blur-md transition active:scale-95 shadow-lg"
          >
            <Download className="h-4 w-4" />
          </button>

          <button
            type="button"
            onClick={handleShare}
            title="Compartilhar Perfil"
            aria-label="Compartilhar Perfil"
            className="flex h-9 w-9 items-center justify-center rounded-full bg-black/60 hover:bg-black/90 border border-white/20 text-white backdrop-blur-md transition active:scale-95 shadow-lg"
          >
            <Share2 className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* 2. Avatar e Detalhes do Artista */}
      <div className="relative px-5 pb-6 pt-0 -mt-16 sm:-mt-20 flex flex-col items-center text-center z-10">
        {/* Avatar Circular com Borda de Destaque */}
        <div className="relative mb-3.5">
          <div 
            className="w-28 h-28 sm:w-32 sm:h-32 rounded-full p-1 shadow-2xl transition duration-500 hover:scale-105"
            style={{
              background: `linear-gradient(135deg, ${primaryColor}, ${secondaryColor})`
            }}
          >
            <div className="w-full h-full rounded-full overflow-hidden bg-zinc-950">
              {effectiveAvatar ? (
                <img 
                  src={effectiveAvatar} 
                  alt={stageName} 
                  className={`w-full h-full object-cover ${avatarPositionClass}`}
                />
              ) : (
                <div 
                  className="w-full h-full flex items-center justify-center bg-zinc-900"
                  style={{ color: primaryColor }}
                >
                  <Music className="w-12 h-12" />
                </div>
              )}
            </div>
          </div>

          {/* Selo Pro */}
          <div 
            className="absolute bottom-1 right-1 flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider text-black shadow-lg"
            style={{ backgroundColor: primaryColor }}
          >
            <Sparkles className="w-2.5 h-2.5" />
            <span>PRO</span>
          </div>
        </div>

        {/* Nome do Artista e Gênero */}
        <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight leading-tight">
          {stageName}
        </h1>

        <div className="flex flex-wrap items-center justify-center gap-2 mt-2">
          <span 
            className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider border shadow-sm"
            style={{ 
              borderColor: `${primaryColor}40`,
              backgroundColor: `${primaryColor}15`,
              color: primaryColor
            }}
          >
            {professionLabel}
          </span>

          {genre && (
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-zinc-800/80 border border-zinc-700 text-zinc-300">
              {genre}
            </span>
          )}
        </div>

        {/* Localização / Região de Atuação */}
        {(city || region) && (
          <div className="flex items-center justify-center gap-1.5 mt-2.5 text-xs text-zinc-400">
            <MapPin className="w-3.5 h-3.5 shrink-0 text-zinc-500" />
            <span>{city ? (region ? `${city} • ${region}` : city) : region}</span>
          </div>
        )}

        {/* Biografia Resumida */}
        {bio && (
          <div className="mt-4 max-w-lg text-sm text-zinc-300 leading-relaxed">
            <p className="whitespace-pre-line">{displayBio}</p>
            {isBioLong && (
              <button
                type="button"
                onClick={() => setBioExpanded(!bioExpanded)}
                className="mt-1.5 inline-flex items-center gap-1 text-xs font-semibold hover:underline"
                style={{ color: primaryColor }}
              >
                {bioExpanded ? (
                  <>Menos detalhes <ChevronUp className="w-3 h-3" /></>
                ) : (
                  <>Ler biografia completa <ChevronDown className="w-3 h-3" /></>
                )}
              </button>
            )}
          </div>
        )}

        {/* 3. CTA Principal: CONTRATAR PARA EVENTOS */}
        <div className="w-full max-w-md mt-6">
          <button
            type="button"
            onClick={handleHireClick}
            className="group relative w-full flex items-center justify-center gap-3 py-3.5 px-6 rounded-2xl font-black text-sm uppercase tracking-wider text-white shadow-xl transition-all duration-300 active:scale-[0.98] overflow-hidden"
            style={{
              background: `linear-gradient(135deg, ${primaryColor}, ${secondaryColor})`,
              boxShadow: `0 8px 24px -6px ${primaryColor}66`
            }}
          >
            <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full duration-1000 bg-gradient-to-r from-transparent via-white/25 to-transparent transition-transform" />
            <MessageCircle className="w-5 h-5 shrink-0" />
            <span>{hireButtonText}</span>
          </button>
        </div>

        {/* 4. Links Sociais e Streaming Rápidos */}
        <div className="flex flex-wrap items-center justify-center gap-2 mt-5">
          {socialLinks.spotify && (
            <a
              href={socialLinks.spotify}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => profileId && trackMusicClickAction(profileId, 'click_streaming_spotify', { origin: 'hero' })}
              className="flex items-center justify-center w-10 h-10 rounded-xl bg-zinc-900 border border-zinc-800 text-[#1DB954] hover:bg-[#1DB954]/10 hover:border-[#1DB954]/40 transition active:scale-95 shadow-md"
              title="Spotify"
              aria-label="Spotify"
            >
              <Music className="w-5 h-5" />
            </a>
          )}

          {socialLinks.youtube && (
            <a
              href={socialLinks.youtube}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => profileId && trackMusicClickAction(profileId, 'click_streaming_youtube', { origin: 'hero' })}
              className="flex items-center justify-center w-10 h-10 rounded-xl bg-zinc-900 border border-zinc-800 text-[#FF0000] hover:bg-[#FF0000]/10 hover:border-[#FF0000]/40 transition active:scale-95 shadow-md"
              title="YouTube"
              aria-label="YouTube"
            >
              <ExternalLink className="w-5 h-5" />
            </a>
          )}

          {socialLinks.instagram && (
            <a
              href={`https://instagram.com/${socialLinks.instagram.replace('@', '')}`}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => profileId && trackMusicClickAction(profileId, 'click_instagram', { origin: 'hero' })}
              className="flex items-center justify-center w-10 h-10 rounded-xl bg-zinc-900 border border-zinc-800 text-[#E1306C] hover:bg-[#E1306C]/10 hover:border-[#E1306C]/40 transition active:scale-95 shadow-md"
              title="Instagram"
              aria-label="Instagram"
            >
              <span className="text-xs font-black">IG</span>
            </a>
          )}

          {socialLinks.tiktok && (
            <a
              href={`https://tiktok.com/@${socialLinks.tiktok.replace('@', '')}`}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => profileId && trackMusicClickAction(profileId, 'click_tiktok', { origin: 'hero' })}
              className="flex items-center justify-center w-10 h-10 rounded-xl bg-zinc-900 border border-zinc-800 text-cyan-400 hover:bg-cyan-500/10 hover:border-cyan-500/40 transition active:scale-95 shadow-md"
              title="TikTok"
              aria-label="TikTok"
            >
              <span className="text-xs font-black">TT</span>
            </a>
          )}

          {socialLinks.soundcloud && (
            <a
              href={socialLinks.soundcloud}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => profileId && trackMusicClickAction(profileId, 'click_streaming_soundcloud', { origin: 'hero' })}
              className="flex items-center justify-center w-10 h-10 rounded-xl bg-zinc-900 border border-zinc-800 text-[#FF5500] hover:bg-[#FF5500]/10 hover:border-[#FF5500]/40 transition active:scale-95 shadow-md"
              title="SoundCloud"
              aria-label="SoundCloud"
            >
              <span className="text-xs font-black">SC</span>
            </a>
          )}
        </div>
      </div>
    </section>
  );
}
