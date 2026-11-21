"use client";

import React, { useState } from 'react';
import { Play, Pause, ExternalLink, Music2 } from 'lucide-react';

interface MusicAudioEmbedProps {
  url?: string;
  title: string;
  coverUrl?: string;
  artist?: string;
  primaryColor?: string;
}

export function MusicAudioEmbed({
  url,
  title,
  coverUrl,
  artist,
  primaryColor = '#ef4444'
}: MusicAudioEmbedProps) {
  const [isPlaying, setIsPlaying] = useState(false);

  if (!url) return null;

  // Extrair ID do Spotify se for link de faixa/álbum
  const isSpotify = url.includes('spotify.com');
  const spotifyMatch = url.match(/track\/([a-zA-Z0-9]+)/) || url.match(/album\/([a-zA-Z0-9]+)/);
  const spotifyEmbedUrl = spotifyMatch 
    ? `https://open.spotify.com/embed/${spotifyMatch[0]}?utm_source=generator&theme=0`
    : null;

  // Extrair ID do YouTube se for link do YouTube
  const isYoutube = url.includes('youtube.com') || url.includes('youtu.be');
  const ytMatch = url.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([\w-]{11})/);
  const ytEmbedUrl = ytMatch ? `https://www.youtube-nocookie.com/embed/${ytMatch[1]}?autoplay=1` : null;

  return (
    <div className="w-full my-3 overflow-hidden rounded-2xl bg-zinc-900/80 border border-zinc-800">
      {!isPlaying ? (
        <div className="flex items-center justify-between p-3 gap-3">
          <div className="flex items-center gap-3 min-w-0">
            {coverUrl ? (
              <img 
                src={coverUrl} 
                alt={title} 
                className="w-12 h-12 rounded-xl object-cover shrink-0 border border-zinc-700/60 shadow-md"
              />
            ) : (
              <div 
                className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0 border border-zinc-700/60 shadow-md"
                style={{ backgroundColor: `${primaryColor}22` }}
              >
                <Music2 className="w-6 h-6" style={{ color: primaryColor }} />
              </div>
            )}
            <div className="min-w-0">
              <p className="text-xs font-semibold text-zinc-100 truncate">{title}</p>
              <p className="text-[11px] text-zinc-400 truncate">{artist || 'Prévia oficial'}</p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setIsPlaying(true)}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold text-white shadow-lg transition active:scale-95 shrink-0"
            style={{ backgroundColor: primaryColor }}
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            <span>Ouvir</span>
          </button>
        </div>
      ) : (
        <div className="relative w-full">
          {isSpotify && spotifyEmbedUrl ? (
            <iframe
              src={spotifyEmbedUrl}
              width="100%"
              height="152"
              allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
              loading="lazy"
              className="rounded-2xl border-0"
            />
          ) : isYoutube && ytEmbedUrl ? (
            <div className="relative aspect-video w-full bg-black">
              <iframe
                src={ytEmbedUrl}
                title={title}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="w-full h-full border-0"
              />
            </div>
          ) : (
            <div className="p-4 flex items-center justify-between">
              <span className="text-xs text-zinc-300 truncate">Ouvir no serviço oficial:</span>
              <a
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold text-white bg-zinc-800 hover:bg-zinc-700"
              >
                <span>Abrir Player</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          )}

          <button
            type="button"
            onClick={() => setIsPlaying(false)}
            className="absolute top-2 right-2 p-1.5 rounded-full bg-black/60 hover:bg-black/90 text-white backdrop-blur-md text-xs transition"
            title="Fechar player"
          >
            ✕
          </button>
        </div>
      )}
    </div>
  );
}
