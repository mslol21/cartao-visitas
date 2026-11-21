"use client";

import React, { useState, useEffect } from 'react';
import { 
  TrendingUp, 
  Eye, 
  MessageCircle, 
  Radio, 
  Video, 
  Calendar, 
  Loader2, 
  Disc,
  Music
} from 'lucide-react';
import { getMusicStatsAction, type MusicStatsSummary } from '@/app/actions/music-pro';
import { MUSIC_PLATFORMS } from '@/config/music-constants';

interface MusicStatsTabProps {
  profileId: string;
}

export function MusicStatsTab({ profileId }: MusicStatsTabProps) {
  const [periodDays, setPeriodDays] = useState<7 | 30 | 90>(30);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<MusicStatsSummary | null>(null);

  useEffect(() => {
    let isMounted = true;
    setLoading(true);

    getMusicStatsAction(profileId, periodDays)
      .then((data) => {
        if (isMounted) {
          setStats(data);
          setLoading(false);
        }
      })
      .catch((err) => {
        console.error(err);
        if (isMounted) setLoading(false);
      });

    return () => { isMounted = false; };
  }, [profileId, periodDays]);

  const topPlatform = stats?.platformBreakdown 
    ? Object.entries(stats.platformBreakdown).sort(([, a], [, b]) => b - a)[0]
    : null;

  return (
    <div className="flex flex-col gap-6">
      {/* Cabeçalho com Filtros de Período */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-black text-white tracking-tight">
            Estatísticas do Artista
          </h2>
          <p className="text-xs text-zinc-400">
            Acompanhe métricas reais de engajamento, cliques em streaming e pedidos de orçamento.
          </p>
        </div>

        <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-zinc-900 border border-zinc-800 self-start sm:self-auto">
          {[7, 30, 90].map((days) => (
            <button
              key={days}
              type="button"
              onClick={() => setPeriodDays(days as any)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                periodDays === days
                  ? 'bg-red-600 text-white shadow-md'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              {days} dias
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="p-16 flex flex-col items-center justify-center gap-3">
          <Loader2 className="w-8 h-8 animate-spin text-red-500" />
          <p className="text-xs text-zinc-400">Carregando métricas do artista...</p>
        </div>
      ) : (
        <>
          {/* Grid de Cards de Estatísticas */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
            <div className="p-4 rounded-2xl bg-zinc-900/60 border border-zinc-800 flex flex-col justify-between">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-zinc-400">Visitas ao Perfil</span>
                <Eye className="w-4 h-4 text-zinc-500" />
              </div>
              <div className="mt-3">
                <span className="text-2xl sm:text-3xl font-black text-white">
                  {stats?.visits || 0}
                </span>
                <p className="text-[10px] text-zinc-500 mt-0.5">Últimos {periodDays} dias</p>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-zinc-900/60 border border-zinc-800 flex flex-col justify-between">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-zinc-400">Cliques Contratação</span>
                <MessageCircle className="w-4 h-4 text-emerald-400" />
              </div>
              <div className="mt-3">
                <span className="text-2xl sm:text-3xl font-black text-white">
                  {stats?.hireClicks || 0}
                </span>
                <p className="text-[10px] text-zinc-500 mt-0.5">WhatsApp de shows</p>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-zinc-900/60 border border-zinc-800 flex flex-col justify-between">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-zinc-400">Cliques Streaming</span>
                <Radio className="w-4 h-4 text-red-400" />
              </div>
              <div className="mt-3">
                <span className="text-2xl sm:text-3xl font-black text-white">
                  {stats?.streamingClicks || 0}
                </span>
                <p className="text-[10px] text-zinc-500 mt-0.5">Spotify, Deezer, etc.</p>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-zinc-900/60 border border-zinc-800 flex flex-col justify-between">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-zinc-400">Plays de Vídeo</span>
                <Video className="w-4 h-4 text-cyan-400" />
              </div>
              <div className="mt-3">
                <span className="text-2xl sm:text-3xl font-black text-white">
                  {stats?.videoPlays || 0}
                </span>
                <p className="text-[10px] text-zinc-500 mt-0.5">Apresentações assistidas</p>
              </div>
            </div>
          </div>

          {/* Breakdown por Plataforma e Destaques */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="rounded-3xl bg-zinc-900/60 border border-zinc-800 p-5 flex flex-col gap-4">
              <h3 className="text-sm font-black text-white uppercase tracking-wider">
                Distribuição de Cliques por Plataforma
              </h3>

              {stats && Object.keys(stats.platformBreakdown).length > 0 ? (
                <div className="flex flex-col gap-2.5">
                  {Object.entries(stats.platformBreakdown).map(([platKey, count]) => {
                    const platDef = (MUSIC_PLATFORMS as any)[platKey] || MUSIC_PLATFORMS.custom;
                    const percent = stats.streamingClicks > 0 
                      ? Math.round((count / stats.streamingClicks) * 100) 
                      : 0;

                    return (
                      <div key={platKey} className="space-y-1">
                        <div className="flex items-center justify-between text-xs">
                          <span className="font-bold text-zinc-200">
                            {platDef.name}
                          </span>
                          <span className="text-zinc-400">
                            {count} cliques ({percent}%)
                          </span>
                        </div>
                        <div className="w-full h-2 rounded-full bg-zinc-950 overflow-hidden">
                          <div 
                            className="h-full rounded-full transition-all duration-500"
                            style={{ 
                              width: `${percent}%`, 
                              backgroundColor: platDef.brandColor 
                            }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="p-8 text-center text-xs text-zinc-500">
                  Nenhum clique de streaming registrado no período selecionado.
                </div>
              )}
            </div>

            <div className="rounded-3xl bg-zinc-900/60 border border-zinc-800 p-5 flex flex-col justify-between gap-4">
              <div>
                <h3 className="text-sm font-black text-white uppercase tracking-wider">
                  Plataforma Mais Acessada
                </h3>
                {topPlatform ? (
                  <div className="mt-4 p-4 rounded-2xl bg-zinc-950 border border-zinc-800 flex items-center justify-between">
                    <div>
                      <p className="text-xs text-zinc-400">Canal com maior conversão:</p>
                      <p className="text-lg font-black text-white uppercase mt-0.5">
                        {(MUSIC_PLATFORMS as any)[topPlatform[0]]?.name || topPlatform[0]}
                      </p>
                    </div>
                    <span className="text-xl font-black text-red-400">
                      {topPlatform[1]} cliques
                    </span>
                  </div>
                ) : (
                  <p className="text-xs text-zinc-400 mt-4">
                    Os dados da plataforma favorita dos seus fãs aparecerão aqui à medida que os links forem acessados.
                  </p>
                )}
              </div>

              <div className="p-3.5 rounded-2xl bg-red-950/30 border border-red-500/20 text-xs text-zinc-300">
                <strong className="text-white block mb-0.5">Dica de Conversão:</strong>
                Mantenha seu Smart Link na bio do Instagram e TikTok para direcionar novos fãs para as plataformas onde você monetiza.
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
