"use client";

import React, { useState } from 'react';
import type { Profile } from '@/types/profile';
import { parseMusicProfileData } from '@/utils/music-utils';
import { MUSIC_TEMPLATES } from '@/config/music-constants';
import { MusicHero } from './MusicHero';
import { MusicStreamingHub } from './MusicStreamingHub';
import { MusicReleases } from './MusicReleases';
import { MusicVideos } from './MusicVideos';
import { MusicRepertoire } from './MusicRepertoire';
import { MusicTour } from './MusicTour';
import { MusicHireContact } from './MusicHireContact';
import { QrCode, Share2, Sparkles, ArrowUpRight } from 'lucide-react';
import { StyledQRCode } from '@/components/StyledQRCode';
import { SITE_URL } from '@/lib/seo/site';
import Link from 'next/link';

interface MusicProfileViewProps {
  profile: Profile;
  isPreview?: boolean;
}

export function MusicProfileView({ profile, isPreview = false }: MusicProfileViewProps) {
  const [showQrModal, setShowQrModal] = useState(false);

  const musicData = parseMusicProfileData(profile);
  const { config, releases, videos, repertoire, events } = musicData;

  const templateId = config.template || 'stage';
  const templateMeta = MUSIC_TEMPLATES[templateId] || MUSIC_TEMPLATES.stage;

  const primaryColor = config.primary_color || templateMeta.primaryColor;
  const secondaryColor = config.secondary_color || templateMeta.secondaryColor;

  const stageName = config.stage_name || profile.business_name || profile.name || 'Artista';
  const professionLabel = profile.profession === 'cantor' ? 'Cantor(a)' :
    profile.profession === 'compositor' ? 'Compositor(a)' :
    profile.profession === 'banda' ? 'Banda' :
    profile.profession === 'grupo_musical' ? 'Grupo Musical' :
    profile.profession === 'dj' ? 'DJ' :
    profile.profession === 'instrumentista' ? 'Instrumentista' :
    profile.profession === 'produtor_musical' ? 'Produtor(a) Musical' : 'Músico(a)';

  const publicUrl = profile.username ? `${SITE_URL}/${encodeURIComponent(profile.username)}` : SITE_URL;

  // Renderizador dinâmico de seções baseado na ordem e visibilidade configuradas
  const renderSection = (sectionKey: string) => {
    if (config.hidden_sections && config.hidden_sections.includes(sectionKey as any)) {
      return null;
    }

    switch (sectionKey) {
      case 'releases':
        return (
          <MusicReleases
            key="releases"
            releases={releases}
            username={profile.username || undefined}
            profileId={profile.id}
            primaryColor={primaryColor}
            secondaryColor={secondaryColor}
          />
        );
      case 'videos':
        return (
          <MusicVideos
            key="videos"
            videos={videos}
            profileId={profile.id}
            primaryColor={primaryColor}
            secondaryColor={secondaryColor}
          />
        );
      case 'repertoire':
        return (
          <MusicRepertoire
            key="repertoire"
            repertoire={repertoire}
            artistName={stageName}
            whatsapp={profile.whatsapp || undefined}
            primaryColor={primaryColor}
            secondaryColor={secondaryColor}
          />
        );
      case 'events':
        return (
          <MusicTour
            key="events"
            events={events}
            primaryColor={primaryColor}
            secondaryColor={secondaryColor}
          />
        );
      case 'contact':
        return (
          <MusicHireContact
            key="contact"
            stageName={stageName}
            whatsapp={profile.whatsapp || undefined}
            email={config.hire_email || undefined}
            region={config.performance_region || profile.area_atendimento || undefined}
            eventTypes={config.event_types}
            customMessage={config.whatsapp_hire_message}
            profileId={profile.id}
            primaryColor={primaryColor}
            secondaryColor={secondaryColor}
          />
        );
      default:
        return null;
    }
  };

  const sectionOrder = config.section_order || ['hero', 'releases', 'videos', 'repertoire', 'events', 'contact'];

  // Font family por template
  const fontClass = templateId === 'elegance' 
    ? 'font-serif' 
    : templateId === 'neon' 
      ? 'font-sans tracking-wide' 
      : 'font-sans';

  return (
    <div className={`relative w-full ${isPreview ? 'min-h-full' : 'min-h-screen'} bg-zinc-950 text-zinc-100 flex flex-col justify-between selection:bg-amber-500/30 selection:text-amber-200 overflow-x-hidden ${fontClass}`}>
      {/* Atmosfera de fundo adaptativa ao template */}
      <div aria-hidden="true" className="fixed inset-0 pointer-events-none z-0 overflow-hidden bg-zinc-950">
        <div 
          className="absolute inset-0 opacity-25"
          style={{
            background: `radial-gradient(circle at 50% 5%, ${primaryColor}40 0%, transparent 45%), radial-gradient(circle at 80% 60%, ${secondaryColor}25 0%, transparent 50%)`
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-zinc-950/70 to-zinc-950/95" />
      </div>

      {/* Conteúdo Centralizado Mobile-First */}
      <main className={`relative z-10 w-full max-w-lg mx-auto ${isPreview ? 'px-3 pt-4 pb-6' : 'px-4 py-6 sm:py-8'} flex flex-col gap-5 sm:gap-6`}>
        {/* Hero Section */}
        <MusicHero
          profileId={profile.id}
          username={profile.username || undefined}
          stageName={stageName}
          professionLabel={professionLabel}
          genre={config.musical_genre || (profile.custom_fields as any)?.estilo_musical}
          city={config.city || profile.city || undefined}
          region={config.performance_region || profile.area_atendimento || undefined}
          bio={config.bio_short || profile.bio_profissional || profile.subtitle || undefined}
          avatarUrl={profile.photo_url || undefined}
          coverUrl={profile.background_video_url || undefined}
          whatsapp={profile.whatsapp || undefined}
          hireMessage={config.whatsapp_hire_message}
          hireButtonText={config.hire_button_text}
          config={config}
          socialLinks={{
            spotify: (profile.custom_fields as any)?.spotify_link,
            instagram: profile.instagram || undefined,
            youtube: (profile.custom_fields as any)?.youtube_link || profile.youtube || undefined,
            tiktok: profile.tiktok || undefined,
            soundcloud: (profile.custom_fields as any)?.soundcloud_link,
            website: profile.website || undefined
          }}
          primaryColor={primaryColor}
          secondaryColor={secondaryColor}
        />

        {/* Smart landing inspirado nos serviços de streaming: a capa e os links
            publicados surgem primeiro, sem ocultar contratação e portfólio. */}
        {!config.hidden_sections?.includes('releases') && (
          <MusicStreamingHub
            releases={releases}
            username={profile.username || undefined}
            profileId={profile.id}
            primaryColor={primaryColor}
          />
        )}

        {/* Seções em ordem dinâmica */}
        {sectionOrder
          .filter(k => k !== 'hero')
          .map(k => renderSection(k))}

        {/* Rodapé e Identificação Konnexy Music */}
        <footer className="pt-6 pb-4 border-t border-zinc-850 flex flex-col items-center justify-center gap-3 text-center">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setShowQrModal(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-zinc-900 border border-zinc-800 text-xs font-semibold text-zinc-300 hover:text-white transition active:scale-95"
            >
              <QrCode className="w-3.5 h-3.5" />
              <span>Ver QR Code</span>
            </button>
          </div>

          <p className="text-[11px] text-zinc-500">
            Portfólio musical oficial desenvolvido com{' '}
            <Link 
              href="/"
              className="text-zinc-300 font-semibold hover:underline"
            >
              Konnexy Music Pro
            </Link>
          </p>
        </footer>
      </main>

      {/* Modal do QR Code */}
      {showQrModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in">
          <div className="relative w-full max-w-sm rounded-3xl bg-zinc-950 border border-zinc-800 p-6 flex flex-col items-center text-center shadow-2xl">
            <h3 className="text-base font-bold text-white mb-1">
              QR Code do Artista
            </h3>
            <p className="text-xs text-zinc-400 mb-5">
              Aponte a câmera do celular para abrir o portfólio de {stageName}
            </p>

            <div className="p-3 bg-white rounded-2xl shadow-xl">
              <StyledQRCode
                url={publicUrl}
                username={profile.username || stageName}
                photoUrl={profile.photo_url || undefined}
                isPro={true}
              />
            </div>

            <p className="text-xs text-zinc-400 mt-4 break-all max-w-[260px]">
              {publicUrl}
            </p>

            <button
              type="button"
              onClick={() => setShowQrModal(false)}
              className="mt-5 w-full py-2.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-xs font-bold text-white transition"
            >
              Fechar
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
