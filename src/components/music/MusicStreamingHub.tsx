"use client";

import React from 'react';
import Link from 'next/link';
import { ArrowUpRight, Disc3, Headphones, Play, Radio } from 'lucide-react';
import type { MusicRelease, MusicPlatformId } from '@/types/music';
import { MUSIC_PLATFORMS } from '@/config/music-constants';
import { trackMusicClickAction } from '@/app/actions/music-pro';

interface MusicStreamingHubProps {
  releases: MusicRelease[];
  profileId?: string;
  username?: string;
  primaryColor?: string;
}

const PLATFORM_ORDER: MusicPlatformId[] = [
  'spotify', 'apple_music', 'deezer', 'youtube_music', 'youtube',
  'amazon_music', 'tidal', 'soundcloud', 'bandcamp', 'mixcloud', 'custom'
];

const PLATFORM_SHORT: Partial<Record<MusicPlatformId, string>> = {
  spotify: '♫', apple_music: '♪', deezer: '≋', youtube_music: '▶',
  youtube: '▶', amazon_music: '♫', tidal: '◆', soundcloud: '☁',
  bandcamp: '◈', mixcloud: '≈', custom: '↗'
};

export function MusicStreamingHub({
  releases, profileId, username, primaryColor = '#ef4444'
}: MusicStreamingHubProps) {
  const published = releases.filter(release => release.published !== false);
  const featured = published.find(release => release.featured) || published[0];

  if (!featured) return null;

  const platforms = [...(featured.streaming_links || [])]
    .filter(link => {
      try {
        const url = new URL(link.url);
        return url.protocol === 'https:' || url.protocol === 'http:';
      } catch {
        return false;
      }
    })
    .sort((a, b) => PLATFORM_ORDER.indexOf(a.platform) - PLATFORM_ORDER.indexOf(b.platform));

  if (!platforms.length) return null;

  const smartLink = username && featured.slug
    ? `/${encodeURIComponent(username)}/musica/${encodeURIComponent(featured.slug)}`
    : null;

  return (
    <section
      aria-labelledby="music-streaming-heading"
      className="relative isolate w-full min-w-0 overflow-hidden rounded-[2rem] border border-white/10 bg-zinc-950 shadow-2xl"
    >
      {featured.cover_url && (
        <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden" aria-hidden="true">
          <img src={featured.cover_url} alt="" className="h-full w-full scale-125 object-cover opacity-30 blur-3xl" />
          <div className="absolute inset-0 bg-gradient-to-b from-zinc-950/50 via-zinc-950/75 to-zinc-950" />
        </div>
      )}

      <div className="flex min-w-0 flex-col items-center px-4 pb-7 pt-8 text-center sm:px-7 sm:pt-10">
        <span className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/15 bg-black/35 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.2em] text-white/75">
          <Headphones className="h-3.5 w-3.5" /> Ouça agora
        </span>

        <div className="mb-5 w-28 overflow-hidden rounded-2xl border border-white/20 bg-zinc-900 shadow-xl sm:w-36">
          <div className="aspect-square">
            {featured.cover_url
              ? <img src={featured.cover_url} alt={`Capa de ${featured.title}`} className="h-full w-full object-cover" />
              : <div className="flex h-full w-full items-center justify-center"><Disc3 className="h-12 w-12 text-white/50" /></div>}
          </div>
        </div>

        <h2 id="music-streaming-heading" className="max-w-full break-words text-2xl font-black leading-tight tracking-tight text-white sm:text-3xl">
          {featured.title}
        </h2>
        <p className="mt-2 max-w-full break-words text-sm font-medium text-white/75">{featured.artist}</p>
        <p className="mb-7 mt-3 text-xs text-white/60">Escolha sua plataforma preferida para ouvir</p>

        <div className="flex w-full min-w-0 flex-col gap-3">
          {platforms.map((link, index) => {
            const platform = MUSIC_PLATFORMS[link.platform] || MUSIC_PLATFORMS.custom;
            return (
              <a
                key={`${link.platform}-${index}`}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`Ouvir ${featured.title} no ${link.label || platform.name}`}
                onClick={() => {
                  if (!profileId) return;
                  void trackMusicClickAction(profileId, `click_streaming_${link.platform}`, {
                    release_id: featured.id, platform: link.platform, origin: 'streaming_hub'
                  }).catch(() => {});
                }}
                className="group flex min-h-16 w-full min-w-0 items-center justify-between gap-3 rounded-full border border-white/90 bg-white px-5 py-3 text-zinc-950 shadow-lg transition-transform duration-200 hover:-translate-y-0.5 hover:shadow-xl focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white active:scale-[0.99] sm:px-6"
              >
                <span className="flex shrink-0 items-center gap-2 text-sm font-bold">
                  <Play className="h-4 w-4 fill-current" /> Reproduzir
                </span>
                <span className="flex min-w-0 items-center justify-end gap-2">
                  <span className="truncate text-right text-xs font-semibold text-zinc-500 sm:text-sm">{link.label || platform.name}</span>
                  <span
                    className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-base font-black text-white"
                    style={{ backgroundColor: platform.brandColor || primaryColor }}
                    aria-hidden="true"
                  >
                    {PLATFORM_SHORT[link.platform] || '↗'}
                  </span>
                </span>
              </a>
            );
          })}
        </div>

        {smartLink && (
          <Link
            href={smartLink}
            className="mt-6 inline-flex min-h-11 items-center justify-center gap-2 rounded-full border border-white/20 bg-white/10 px-5 text-xs font-bold text-white transition-colors hover:bg-white/20"
          >
            <Radio className="h-4 w-4" /> Compartilhar este lançamento <ArrowUpRight className="h-4 w-4" />
          </Link>
        )}
      </div>
    </section>
  );
}
