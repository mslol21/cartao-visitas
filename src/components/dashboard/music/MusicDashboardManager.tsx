"use client";

import React, { useState } from 'react';
import { 
  Sparkles, 
  Disc, 
  Video, 
  ListMusic, 
  Calendar, 
  MessageCircle, 
  Palette, 
  TrendingUp, 
  QrCode, 
  Crown, 
  User, 
  Radio, 
  ArrowLeft,
  LayoutDashboard
} from 'lucide-react';
import type { Profile } from '@/types/profile';
import { parseMusicProfileData } from '@/utils/music-utils';
import { MusicOverviewTab } from './MusicOverviewTab';
import { MusicProfileTab } from './MusicProfileTab';
import { MusicReleasesTab } from './MusicReleasesTab';
import { MusicSmartLinksTab } from './MusicSmartLinksTab';
import { MusicVideosTab } from './MusicVideosTab';
import { MusicRepertoireTab } from './MusicRepertoireTab';
import { MusicEventsTab } from './MusicEventsTab';
import { MusicHireTab } from './MusicHireTab';
import { MusicAppearanceTab } from './MusicAppearanceTab';
import { MusicStatsTab } from './MusicStatsTab';
import { MusicShareTab } from './MusicShareTab';
import { MusicPlansTab } from './MusicPlansTab';

export type MusicDashboardTab = 
  | 'overview' 
  | 'profile' 
  | 'releases' 
  | 'smartlinks' 
  | 'videos' 
  | 'repertoire' 
  | 'events' 
  | 'hire' 
  | 'appearance' 
  | 'stats' 
  | 'share' 
  | 'plans';

interface MusicDashboardManagerProps {
  profile: Profile;
  onRefresh: () => void;
  onSwitchToStandard?: () => void;
  accessToken?: string;
}

const MUSIC_NAV_ITEMS: Array<{ id: MusicDashboardTab; label: string; icon: React.ElementType }> = [
  { id: 'overview', label: 'Visão Geral', icon: LayoutDashboard },
  { id: 'profile', label: 'Meu Perfil', icon: User },
  { id: 'releases', label: 'Músicas', icon: Disc },
  { id: 'smartlinks', label: 'Smart Links', icon: Radio },
  { id: 'videos', label: 'Vídeos', icon: Video },
  { id: 'repertoire', label: 'Repertório', icon: ListMusic },
  { id: 'events', label: 'Agenda', icon: Calendar },
  { id: 'hire', label: 'Contratação', icon: MessageCircle },
  { id: 'appearance', label: 'Aparência', icon: Palette },
  { id: 'stats', label: 'Estatísticas', icon: TrendingUp },
  { id: 'share', label: 'Compartilhar', icon: QrCode },
  { id: 'plans', label: 'Planos', icon: Crown }
];

export function MusicDashboardManager({
  profile,
  onRefresh,
  onSwitchToStandard,
  accessToken
}: MusicDashboardManagerProps) {
  const [activeTab, setActiveTab] = useState<MusicDashboardTab>('overview');
  const musicData = parseMusicProfileData(profile);

  return (
    <div className="flex flex-col gap-6 w-full">
      {/* Barra de Navegação Adaptativa dos 12 Menus Music Pro */}
      <div className="w-full flex items-center justify-between gap-2 overflow-x-auto pb-1 scroll-hide bg-zinc-950/80 p-1.5 rounded-3xl border border-zinc-800">
        <div className="flex items-center gap-1">
          {MUSIC_NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;

            return (
              <button
                key={item.id}
                type="button"
                onClick={() => setActiveTab(item.id)}
                className={`flex items-center gap-2 px-3.5 py-2.5 rounded-2xl text-xs font-bold shrink-0 transition active:scale-95 ${
                  isActive
                    ? 'bg-red-600 text-white shadow-lg'
                    : 'text-zinc-400 hover:text-white hover:bg-zinc-900'
                }`}
              >
                <Icon className="w-4 h-4 shrink-0" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>

        {onSwitchToStandard && (
          <button
            type="button"
            onClick={onSwitchToStandard}
            className="flex items-center gap-1.5 px-3 py-2 rounded-2xl text-[11px] font-bold text-zinc-500 hover:text-zinc-300 hover:bg-zinc-900 transition shrink-0 ml-2"
            title="Voltar ao Editor Geral de Cartão"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span className="hidden lg:inline">Modo Tradicional</span>
          </button>
        )}
      </div>

      {/* Conteúdo da Aba Ativa */}
      <div className="w-full">
        {activeTab === 'overview' && (
          <MusicOverviewTab
            profile={profile}
            musicData={musicData}
            onNavigateTab={(tab) => setActiveTab(tab as MusicDashboardTab)}
          />
        )}

        {activeTab === 'profile' && (
          <MusicProfileTab
            profile={profile}
            musicData={musicData}
            onRefresh={onRefresh}
            accessToken={accessToken}
          />
        )}

        {activeTab === 'releases' && (
          <MusicReleasesTab
            releases={musicData.releases}
            username={profile.username || undefined}
            defaultArtistName={musicData.config.stage_name || profile.business_name || profile.name || ''}
            onRefresh={onRefresh}
            accessToken={accessToken}
          />
        )}

        {activeTab === 'smartlinks' && (
          <MusicSmartLinksTab
            releases={musicData.releases}
            username={profile.username || undefined}
            onNavigateToReleases={() => setActiveTab('releases')}
          />
        )}

        {activeTab === 'videos' && (
          <MusicVideosTab
            videos={musicData.videos}
            onRefresh={onRefresh}
            accessToken={accessToken}
          />
        )}

        {activeTab === 'repertoire' && (
          <MusicRepertoireTab
            repertoire={musicData.repertoire}
            onRefresh={onRefresh}
            accessToken={accessToken}
          />
        )}

        {activeTab === 'events' && (
          <MusicEventsTab
            events={musicData.events}
            onRefresh={onRefresh}
            accessToken={accessToken}
          />
        )}

        {activeTab === 'hire' && (
          <MusicHireTab
            profile={profile}
            musicData={musicData}
            onRefresh={onRefresh}
            accessToken={accessToken}
          />
        )}

        {activeTab === 'appearance' && (
          <MusicAppearanceTab
            musicData={musicData}
            onRefresh={onRefresh}
            accessToken={accessToken}
          />
        )}

        {activeTab === 'stats' && (
          <MusicStatsTab
            profileId={profile.id}
          />
        )}

        {activeTab === 'share' && (
          <MusicShareTab
            profile={profile}
            stageName={musicData.config.stage_name || profile.business_name || profile.name || 'Artista'}
          />
        )}

        {activeTab === 'plans' && (
          <MusicPlansTab
            profile={profile}
            accessToken={accessToken}
          />
        )}
      </div>
    </div>
  );
}
