"use client";

import React, { useState } from 'react';
import { Radio, Copy, Check, ExternalLink, QrCode, Disc, Sparkles } from 'lucide-react';
import { toast } from 'sonner';
import type { MusicRelease } from '@/types/music';
import { SITE_URL } from '@/lib/seo/site';
import { StyledQRCode } from '@/components/StyledQRCode';

interface MusicSmartLinksTabProps {
  releases: MusicRelease[];
  username?: string;
  onNavigateToReleases: () => void;
}

export function MusicSmartLinksTab({
  releases,
  username,
  onNavigateToReleases
}: MusicSmartLinksTabProps) {
  const [copiedSlug, setCopiedSlug] = useState<string | null>(null);
  const [activeQrRelease, setActiveQrRelease] = useState<MusicRelease | null>(null);

  const handleCopy = async (slug: string, url: string) => {
    try {
      await navigator.clipboard.writeText(url);
      setCopiedSlug(slug);
      toast.success('Smart Link copiado com sucesso!');
      setTimeout(() => setCopiedSlug(null), 2000);
    } catch {
      toast.error('Erro ao copiar link.');
    }
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Cabeçalho */}
      <div className="flex flex-col gap-1">
        <h2 className="text-xl font-black text-white tracking-tight">
          Gerenciador de Smart Links
        </h2>
        <p className="text-xs text-zinc-400">
          Cada lançamento possui sua própria página de destino otimizada para streaming, com botões diretos para Spotify, Apple Music, Deezer e YouTube.
        </p>
      </div>

      {/* Lista de Smart Links */}
      <div className="flex flex-col gap-3">
        {releases.length > 0 ? (
          releases.map((release) => {
            const smartLinkUrl = username 
              ? `${SITE_URL}/${encodeURIComponent(username)}/musica/${encodeURIComponent(release.slug)}` 
              : '';

            return (
              <div
                key={release.id}
                className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-2xl bg-zinc-900/60 border border-zinc-800 hover:border-zinc-700 transition gap-4 shadow-lg"
              >
                <div className="flex items-center gap-3.5 min-w-0">
                  <img
                    src={release.cover_url}
                    alt={release.title}
                    className="w-16 h-16 rounded-xl object-cover shrink-0 bg-zinc-950 border border-zinc-800 shadow-md"
                  />
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <h3 className="text-sm font-bold text-white truncate">
                        {release.title}
                      </h3>
                      <span className="px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider bg-red-500/20 text-red-400 border border-red-500/30">
                        {release.release_type}
                      </span>
                    </div>

                    <p className="text-xs text-zinc-400 mt-0.5">
                      {release.artist} • {release.streaming_links.length} plataformas conectadas
                    </p>

                    <p className="text-[11px] text-zinc-500 font-mono mt-1 truncate">
                      {smartLinkUrl}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                  <button
                    type="button"
                    onClick={() => handleCopy(release.slug, smartLinkUrl)}
                    className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-750 text-white text-xs font-semibold transition active:scale-95"
                    title="Copiar Smart Link"
                  >
                    {copiedSlug === release.slug ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                        <span className="text-emerald-400">Copiado</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Copiar Link</span>
                      </>
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={() => setActiveQrRelease(release)}
                    className="p-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white transition"
                    title="QR Code do Lançamento"
                  >
                    <QrCode className="w-4 h-4" />
                  </button>

                  <a
                    href={smartLinkUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white transition"
                    title="Visualizar Smart Link no Navegador"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </a>
                </div>
              </div>
            );
          })
        ) : (
          <div className="p-12 text-center rounded-3xl bg-zinc-900/40 border border-dashed border-zinc-800 flex flex-col items-center gap-3">
            <Radio className="w-10 h-10 text-zinc-600" />
            <h3 className="text-sm font-bold text-white">Nenhum Smart Link disponível</h3>
            <p className="text-xs text-zinc-400 max-w-sm">
              Cadastre suas músicas na aba Discografia para gerar automaticamente Smart Links individuais.
            </p>
            <button
              type="button"
              onClick={onNavigateToReleases}
              className="mt-2 px-4 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs uppercase tracking-wider"
            >
              Ir para Discografia
            </button>
          </div>
        )}
      </div>

      {/* Modal do QR Code do Lançamento */}
      {activeQrRelease && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in">
          <div className="relative w-full max-w-sm rounded-3xl bg-zinc-950 border border-zinc-800 p-6 flex flex-col items-center text-center shadow-2xl">
            <h3 className="text-base font-bold text-white mb-1">
              QR Code do Lançamento
            </h3>
            <p className="text-xs text-zinc-400 mb-4">
              Escaneie para abrir o Smart Link de <strong>{activeQrRelease.title}</strong>
            </p>

            <div className="p-3 bg-white rounded-2xl shadow-xl">
              <StyledQRCode
                url={`${SITE_URL}/${encodeURIComponent(username || '')}/musica/${encodeURIComponent(activeQrRelease.slug)}`}
                username={username || activeQrRelease.artist}
                photoUrl={activeQrRelease.cover_url}
                isPro={true}
              />
            </div>

            <p className="text-xs text-zinc-500 font-mono mt-4 break-all max-w-[260px]">
              {SITE_URL}/{username}/musica/{activeQrRelease.slug}
            </p>

            <button
              type="button"
              onClick={() => setActiveQrRelease(null)}
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
