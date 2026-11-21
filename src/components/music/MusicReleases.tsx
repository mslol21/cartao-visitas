"use client";

import React from 'react';
import Link from 'next/link';
import { Disc, Play, ExternalLink, Sparkles, Radio } from 'lucide-react';
import type { MusicRelease } from '@/types/music';
import { MUSIC_PLATFORMS } from '@/config/music-constants';
import { MusicAudioEmbed } from './MusicAudioEmbed';
import { trackMusicClickAction } from '@/app/actions/music-pro';

interface MusicReleasesProps {
  releases: MusicRelease[];
  username?: string;
  profileId?: string;
  primaryColor?: string;
  secondaryColor?: string;
}

const TYPE_LABELS: Record<string, string> = {
  single: 'Single',
  ep: 'EP',
  album: 'Álbum',
  faixa: 'Faixa',
  pre_save: 'Pré-Save'
};

export function MusicReleases({
  releases,
  username,
  profileId,
  primaryColor = '#ef4444',
  secondaryColor = '#f43f5e'
}: MusicReleasesProps) {
  const publishedReleases = releases.filter(r => r.published !== false);

  if (publishedReleases.length === 0) return null;

  return (
    <section className="w-full flex flex-col gap-4">
      {/* Cabeçalho da Seção */}
      <div className="flex items-center justify-between px-1">
        <div className="flex items-center gap-2">
          <div 
            className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0 border shadow-sm"
            style={{ 
              backgroundColor: `${primaryColor}15`,
              borderColor: `${primaryColor}40`,
              color: primaryColor
            }}
          >
            <Disc className="w-4 h-4 animate-spin-slow" />
          </div>
          <h2 className="text-lg font-black tracking-tight text-white uppercase">
            Lançamentos & Discografia
          </h2>
        </div>

        <span className="text-xs font-semibold text-zinc-400">
          {publishedReleases.length} {publishedReleases.length === 1 ? 'obra' : 'obras'}
        </span>
      </div>

      {/* Grid de Lançamentos */}
      <div className="flex flex-col gap-4">
        {publishedReleases.map((release) => {
          const smartLinkHref = username ? `/${encodeURIComponent(username)}/musica/${encodeURIComponent(release.slug)}` : '#';

          return (
            <div
              key={release.id}
              className="relative overflow-hidden rounded-2xl bg-zinc-950/80 border border-zinc-800/80 p-4 transition-all duration-300 hover:border-zinc-700 shadow-xl"
            >
              {release.featured && (
                <div 
                  className="absolute top-3 right-3 flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider text-black shadow-md z-10"
                  style={{ backgroundColor: primaryColor }}
                >
                  <Sparkles className="w-2.5 h-2.5" />
                  <span>Destaque</span>
                </div>
              )}

              <div className="flex flex-col sm:flex-row gap-4 items-start">
                {/* Capa do Lançamento */}
                <div className="relative w-full sm:w-32 aspect-square rounded-xl overflow-hidden shrink-0 bg-zinc-900 border border-zinc-800 shadow-md">
                  <img
                    src={release.cover_url}
                    alt={release.title}
                    className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                  />
                  <div className="absolute bottom-1.5 left-1.5 px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider bg-black/80 text-white backdrop-blur-md">
                    {TYPE_LABELS[release.release_type] || release.release_type}
                  </div>
                </div>

                {/* Informações do Lançamento */}
                <div className="flex-1 min-w-0 w-full">
                  <h3 className="text-base font-bold text-white truncate">
                    {release.title}
                  </h3>
                  <p className="text-xs text-zinc-400 mt-0.5 truncate">
                    {release.artist} {release.genre ? `• ${release.genre}` : ''}
                  </p>

                  {release.description && (
                    <p className="text-xs text-zinc-400 mt-2 line-clamp-2 leading-relaxed">
                      {release.description}
                    </p>
                  )}

                  {/* Player Embed se houver link embeddable */}
                  {(release.embed_url || release.streaming_links.some(l => l.platform === 'spotify' || l.platform === 'youtube')) && (
                    <MusicAudioEmbed
                      url={release.embed_url || release.streaming_links.find(l => l.platform === 'spotify')?.url || release.streaming_links.find(l => l.platform === 'youtube')?.url}
                      title={release.title}
                      coverUrl={release.cover_url}
                      artist={release.artist}
                      primaryColor={primaryColor}
                    />
                  )}

                  {/* Plataformas de Streaming */}
                  {release.streaming_links && release.streaming_links.length > 0 && (
                    <div className="flex flex-wrap items-center gap-1.5 mt-3">
                      {release.streaming_links.map((link, idx) => {
                        const platDef = MUSIC_PLATFORMS[link.platform] || MUSIC_PLATFORMS.custom;

                        return (
                          <a
                            key={idx}
                            href={link.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={() => {
                              if (profileId) {
                                trackMusicClickAction(profileId, `click_streaming_${link.platform}`, {
                                  release_id: release.id,
                                  title: release.title,
                                  platform: link.platform
                                }).catch(() => {});
                              }
                            }}
                            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold border transition active:scale-95 ${platDef.badgeBg} ${platDef.hoverBg}`}
                          >
                            <span>{link.label || platDef.name}</span>
                            <ExternalLink className="w-2.5 h-2.5 opacity-70" />
                          </a>
                        );
                      })}
                    </div>
                  )}

                  {/* Botão para abrir o Smart Link Oficial */}
                  {username && (
                    <div className="mt-4 pt-3 border-t border-zinc-850 flex items-center justify-between">
                      <span className="text-[11px] text-zinc-500">Página oficial de streaming</span>
                      <Link
                        href={smartLinkHref}
                        onClick={() => {
                          if (profileId) {
                            trackMusicClickAction(profileId, 'click_smart_link', {
                              release_id: release.id,
                              slug: release.slug
                            }).catch(() => {});
                          }
                        }}
                        className="inline-flex items-center gap-1 text-xs font-bold hover:underline"
                        style={{ color: primaryColor }}
                      >
                        <span>Abrir Smart Link</span>
                        <Radio className="w-3 h-3" />
                      </Link>
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
