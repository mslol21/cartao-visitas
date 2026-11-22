"use client";

import React from 'react';
import { ExternalLink, Instagram, Music2, Radio, Cloud, AudioLines, Play } from 'lucide-react';
import type { MusicPlatformId } from '@/types/music';

export type MusicBrand = MusicPlatformId | 'instagram' | 'tiktok';

interface MusicBrandIconProps {
  brand: MusicBrand;
  className?: string;
}

/**
 * Ícones reconhecíveis de plataformas. Os ícones SVG são vetoriais,
 * independentes de fontes externas e herdam currentColor.
 */
export function MusicBrandIcon({ brand, className = 'h-5 w-5' }: MusicBrandIconProps) {
  if (brand === 'instagram') return <Instagram aria-hidden="true" className={className} strokeWidth={2.15} />;
  if (brand === 'youtube' || brand === 'youtube_music') {
    return (
      <svg aria-hidden="true" className={className} viewBox="0 0 24 24" fill="currentColor">
        <rect x="2" y="5" width="20" height="14" rx="4" fill="currentColor" />\n        <path d="m10 8.5 6 3.5-6 3.5v-7Z" fill="#fff" />
      </svg>
    );
  }
  if (brand === 'spotify') {
    return (
      <svg aria-hidden="true" className={className} viewBox="0 0 24 24" fill="none">
        <circle cx="12" cy="12" r="10.5" fill="currentColor" />
        <path d="M5.6 9c4.5-1.3 9.3-.9 13.2 1.4M6.5 12.4c4-1.2 8.2-.7 11.6 1.3M7.4 15.4c3.5-.9 6.8-.5 9.6 1.2" stroke="#0A0A0A" strokeWidth="1.65" strokeLinecap="round" />
      </svg>
    );
  }
  if (brand === 'tiktok') {
    return (
      <svg aria-hidden="true" className={className} viewBox="0 0 24 24" fill="currentColor">
        <path d="M14.4 2h3.1c.2 2.3 1.5 3.8 4.5 4V9c-1.9 0-3.5-.5-4.8-1.4v7.3a6.2 6.2 0 1 1-6.4-6.2v3.2a3 3 0 1 0 3.6 3V2Z" />
      </svg>
    );
  }
  if (brand === 'deezer') {
    return (
      <svg aria-hidden="true" className={className} viewBox="0 0 24 24" fill="currentColor">
        <path d="M2 16h4v2H2zm0 3h4v2H2zm5-6h4v2H7zm0 3h4v2H7zm0 3h4v2H7zm5-9h4v2h-4zm0 3h4v2h-4zm0 3h4v2h-4zm0 3h4v2h-4zm5-12h5v2h-5zm0 3h5v2h-5zm0 3h5v2h-5zm0 3h5v2h-5zm0 3h5v2h-5z" />
      </svg>
    );
  }
  if (brand === 'tidal') {
    return (
      <svg aria-hidden="true" className={className} viewBox="0 0 24 24" fill="currentColor">
        <path d="m5 4 3.5 3.5L5 11 1.5 7.5 5 4Zm7 0 3.5 3.5L12 11 8.5 7.5 12 4Zm7 0 3.5 3.5L19 11l-3.5-3.5L19 4Zm-7 7 3.5 3.5L12 18l-3.5-3.5L12 11Z" />
      </svg>
    );
  }
  if (brand === 'soundcloud') return <Cloud aria-hidden="true" className={className} strokeWidth={2.5} />;
  if (brand === 'apple_music') return <Music2 aria-hidden="true" className={className} strokeWidth={2.5} />;
  if (brand === 'amazon_music' || brand === 'mixcloud') return <AudioLines aria-hidden="true" className={className} strokeWidth={2.5} />;
  if (brand === 'bandcamp') return <Radio aria-hidden="true" className={className} strokeWidth={2.5} />;
  if (brand === 'custom') return <ExternalLink aria-hidden="true" className={className} />;
  return <Play aria-hidden="true" className={className} />;
}
