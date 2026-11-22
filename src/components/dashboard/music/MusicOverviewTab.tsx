"use client";

import React from 'react';
import { 
  Sparkles, 
  ExternalLink, 
  Copy, 
  Check, 
  Disc, 
  Video, 
  ListMusic, 
  Calendar, 
  MessageCircle, 
  Eye, 
  Radio,
  ArrowRight
} from 'lucide-react';
import type { Profile } from '@/types/profile';
import type { MusicProfileData } from '@/types/music';
import { SITE_URL } from '@/lib/seo/site';
import { toast } from 'sonner';

interface MusicOverviewTabProps {
  profile: Profile;
  musicData: MusicProfileData;
  onNavigateTab: (tab: string) => void;
}

export function MusicOverviewTab({ profile, musicData, onNavigateTab }: MusicOverviewTabProps) {
  const [copied, setCopied] = React.useState(false);
  const publicUrl = profile.username ? `${SITE_URL}/${encodeURIComponent(profile.username)}` : SITE_URL;

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(publicUrl);
      setCopied(true);
      toast.success('Link do perfil copiado!');
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error('Erro ao copiar link.');
    }
  };

  const releasesCount = musicData.releases.length;
  const videosCount = musicData.videos.length;
  const repertoireCount = musicData.repertoire.length;
  const eventsCount = musicData.events.length;

  return (
    <div className="flex min-w-0 w-full flex-col gap-6">
      {/* Banner Principal de Boas-vindas ao Konnexy Music Pro */}
      <div className="relative min-w-0 w-full overflow-hidden rounded-3xl bg-gradient-to-r from-red-950/80 via-zinc-900 to-zinc-950 border border-red-500/30 p-6 sm:p-8 shadow-2xl">
        <div className="absolute top-0 right-0 w-80 h-80 bg-red-600/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex min-w-0 flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="min-w-0 space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-500/20 border border-red-500/40 text-red-400 text-xs font-black uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Konnexy Music Pro Ativo</span>
            </div>
            <h2 className="break-words text-2xl sm:text-3xl font-black text-white tracking-tight">
              {musicData.config.stage_name || profile.business_name || profile.name || 'Seu Portfólio Artístico'}
            </h2>
            <p className="text-xs sm:text-sm text-zinc-300 max-w-xl leading-relaxed">
              Gerencie sua discografia, gere Smart Links para seus lançamentos, apresente seus vídeos de shows e feche contratações de eventos diretamente no WhatsApp.
            </p>
          </div>

          <div className="flex w-full min-w-0 flex-col gap-2 sm:w-auto sm:flex-row sm:shrink-0">
            <a
              href={publicUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex w-full min-w-0 items-center justify-center gap-2 px-4 py-3 rounded-2xl sm:w-auto bg-white text-zinc-950 font-black text-xs uppercase tracking-wider hover:bg-zinc-200 transition shadow-lg active:scale-95"
            >
              <span>Ver Perfil</span>
              <ExternalLink className="w-4 h-4" />
            </a>

            <button
              type="button"
              onClick={handleCopyLink}
              className="flex items-center justify-center gap-2 px-4 py-3 rounded-2xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 text-white font-bold text-xs uppercase tracking-wider transition active:scale-95 shadow-md"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
              <span>{copied ? 'Copiado!' : 'Copiar Link'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Cards de Métricas e Contadores Rápidos */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        <div 
          onClick={() => onNavigateTab('releases')}
          className="cursor-pointer group p-4 rounded-2xl bg-zinc-900/70 border border-zinc-800 hover:border-red-500/40 transition shadow-lg flex flex-col justify-between"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-zinc-400">Discografia</span>
            <Disc className="w-4 h-4 text-red-400 group-hover:rotate-45 transition-transform" />
          </div>
          <div className="mt-4 flex items-baseline justify-between">
            <span className="text-2xl font-black text-white">{releasesCount}</span>
            <span className="text-[11px] font-semibold text-zinc-500 group-hover:text-red-400 transition flex items-center gap-0.5">
              Gerenciar <ArrowRight className="w-3 h-3" />
            </span>
          </div>
        </div>

        <div 
          onClick={() => onNavigateTab('videos')}
          className="cursor-pointer group p-4 rounded-2xl bg-zinc-900/70 border border-zinc-800 hover:border-red-500/40 transition shadow-lg flex flex-col justify-between"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-zinc-400">Vídeos</span>
            <Video className="w-4 h-4 text-red-400 group-hover:scale-110 transition-transform" />
          </div>
          <div className="mt-4 flex items-baseline justify-between">
            <span className="text-2xl font-black text-white">{videosCount}</span>
            <span className="text-[11px] font-semibold text-zinc-500 group-hover:text-red-400 transition flex items-center gap-0.5">
              Ver todos <ArrowRight className="w-3 h-3" />
            </span>
          </div>
        </div>

        <div 
          onClick={() => onNavigateTab('repertoire')}
          className="cursor-pointer group p-4 rounded-2xl bg-zinc-900/70 border border-zinc-800 hover:border-red-500/40 transition shadow-lg flex flex-col justify-between"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-zinc-400">Repertório</span>
            <ListMusic className="w-4 h-4 text-red-400 group-hover:scale-110 transition-transform" />
          </div>
          <div className="mt-4 flex items-baseline justify-between">
            <span className="text-2xl font-black text-white">{repertoireCount}</span>
            <span className="text-[11px] font-semibold text-zinc-500 group-hover:text-red-400 transition flex items-center gap-0.5">
              Canções <ArrowRight className="w-3 h-3" />
            </span>
          </div>
        </div>

        <div 
          onClick={() => onNavigateTab('events')}
          className="cursor-pointer group p-4 rounded-2xl bg-zinc-900/70 border border-zinc-800 hover:border-red-500/40 transition shadow-lg flex flex-col justify-between"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-zinc-400">Agenda</span>
            <Calendar className="w-4 h-4 text-red-400 group-hover:scale-110 transition-transform" />
          </div>
          <div className="mt-4 flex items-baseline justify-between">
            <span className="text-2xl font-black text-white">{eventsCount}</span>
            <span className="text-[11px] font-semibold text-zinc-500 group-hover:text-red-400 transition flex items-center gap-0.5">
              Datas <ArrowRight className="w-3 h-3" />
            </span>
          </div>
        </div>
      </div>

      {/* Checklist de Lançamento e Configuração do Artista */}
      <div className="rounded-3xl bg-zinc-900/60 border border-zinc-800 p-6 flex flex-col gap-4">
        <h3 className="text-sm font-black text-white uppercase tracking-wider">
          Passos recomendados para o seu lançamento
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div 
            onClick={() => onNavigateTab('profile')}
            className="cursor-pointer p-3.5 rounded-2xl bg-zinc-950/70 border border-zinc-800/80 hover:border-zinc-700 flex items-center justify-between gap-3 transition"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-zinc-900 flex items-center justify-center font-bold text-xs text-zinc-400 border border-zinc-800">
                1
              </div>
              <div>
                <p className="text-xs font-bold text-zinc-200">Ajuste seu Nome e Bio</p>
                <p className="text-[11px] text-zinc-500">Defina seu gênero musical e região</p>
              </div>
            </div>
            <ArrowRight className="w-4 h-4 text-zinc-600" />
          </div>

          <div 
            onClick={() => onNavigateTab('releases')}
            className="cursor-pointer p-3.5 rounded-2xl bg-zinc-950/70 border border-zinc-800/80 hover:border-zinc-700 flex items-center justify-between gap-3 transition"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-zinc-900 flex items-center justify-center font-bold text-xs text-zinc-400 border border-zinc-800">
                2
              </div>
              <div>
                <p className="text-xs font-bold text-zinc-200">Cadastre seu primeiro Single ou EP</p>
                <p className="text-[11px] text-zinc-500">Gere um Smart Link para suas plataformas</p>
              </div>
            </div>
            <ArrowRight className="w-4 h-4 text-zinc-600" />
          </div>

          <div 
            onClick={() => onNavigateTab('hire')}
            className="cursor-pointer p-3.5 rounded-2xl bg-zinc-950/70 border border-zinc-800/80 hover:border-zinc-700 flex items-center justify-between gap-3 transition"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-zinc-900 flex items-center justify-center font-bold text-xs text-zinc-400 border border-zinc-800">
                3
              </div>
              <div>
                <p className="text-xs font-bold text-zinc-200">Configure o Botão de Contratação</p>
                <p className="text-[11px] text-zinc-500">Defina sua mensagem personalizada de WhatsApp</p>
              </div>
            </div>
            <ArrowRight className="w-4 h-4 text-zinc-600" />
          </div>

          <div 
            onClick={() => onNavigateTab('appearance')}
            className="cursor-pointer p-3.5 rounded-2xl bg-zinc-950/70 border border-zinc-800/80 hover:border-zinc-700 flex items-center justify-between gap-3 transition"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-zinc-900 flex items-center justify-center font-bold text-xs text-zinc-400 border border-zinc-800">
                4
              </div>
              <div>
                <p className="text-xs font-bold text-zinc-200">Escolha seu Template Musical</p>
                <p className="text-[11px] text-zinc-500">Elegance, Stage, Neon ou Acoustic</p>
              </div>
            </div>
            <ArrowRight className="w-4 h-4 text-zinc-600" />
          </div>
        </div>
      </div>
    </div>
  );
}
