"use client";

import React, { useState } from 'react';
import { Palette, Check, Sparkles, Eye, ArrowUp, ArrowDown, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { toast } from 'sonner';
import type { MusicProfileData, MusicTemplateId, MusicProfileConfig } from '@/types/music';
import { MUSIC_TEMPLATES } from '@/config/music-constants';
import { saveMusicConfigAction } from '@/app/actions/music-pro';

interface MusicAppearanceTabProps {
  musicData: MusicProfileData;
  onRefresh: () => void;
  accessToken?: string;
}

const SECTION_LABELS: Record<string, string> = {
  hero: 'Identidade & Hero',
  releases: 'Lançamentos & Discografia',
  videos: 'Vídeos & Apresentações',
  repertoire: 'Repertório para Eventos',
  events: 'Agenda de Shows',
  contact: 'Disponibilidade & Contratação'
};

export function MusicAppearanceTab({ musicData, onRefresh, accessToken }: MusicAppearanceTabProps) {
  const [saving, setSaving] = useState(false);

  const [selectedTemplate, setSelectedTemplate] = useState<MusicTemplateId>(musicData.config.template || 'stage');
  const [primaryColor, setPrimaryColor] = useState(musicData.config.primary_color || MUSIC_TEMPLATES[selectedTemplate]?.primaryColor || '#ef4444');
  const [secondaryColor, setSecondaryColor] = useState(musicData.config.secondary_color || MUSIC_TEMPLATES[selectedTemplate]?.secondaryColor || '#f43f5e');
  const [sectionOrder, setSectionOrder] = useState<string[]>(musicData.config.section_order || ['hero', 'releases', 'videos', 'repertoire', 'events', 'contact']);
  const [hiddenSections, setHiddenSections] = useState<string[]>(musicData.config.hidden_sections || []);

  const handleSelectTemplate = (tId: MusicTemplateId) => {
    setSelectedTemplate(tId);
    const meta = MUSIC_TEMPLATES[tId];
    if (meta) {
      setPrimaryColor(meta.primaryColor);
      setSecondaryColor(meta.secondaryColor);
    }
  };

  const handleMoveUp = (index: number) => {
    if (index <= 1) return; // Não mover acima do hero
    const updated = [...sectionOrder];
    const temp = updated[index - 1];
    updated[index - 1] = updated[index];
    updated[index] = temp;
    setSectionOrder(updated);
  };

  const handleMoveDown = (index: number) => {
    if (index >= sectionOrder.length - 1 || index === 0) return;
    const updated = [...sectionOrder];
    const temp = updated[index + 1];
    updated[index + 1] = updated[index];
    updated[index] = temp;
    setSectionOrder(updated);
  };

  const toggleSectionVisibility = (secKey: string) => {
    if (hiddenSections.includes(secKey)) {
      setHiddenSections(hiddenSections.filter(k => k !== secKey));
    } else {
      setHiddenSections([...hiddenSections, secKey]);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const configUpdate: Partial<MusicProfileConfig> = {
        template: selectedTemplate,
        primary_color: primaryColor,
        secondary_color: secondaryColor,
        section_order: sectionOrder as any,
        hidden_sections: hiddenSections as any
      };

      const res = await saveMusicConfigAction(configUpdate, accessToken);
      if (!res.success) throw new Error(res.error);

      toast.success('Visual e template salvos com sucesso!');
      onRefresh();
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || 'Erro ao salvar aparência.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Cabeçalho */}
      <div className="flex flex-col gap-1">
        <h2 className="text-xl font-black text-white tracking-tight">
          Aparência & Templates Musicais
        </h2>
        <p className="text-xs text-zinc-400">
          Selecione o tema visual oficial que melhor reflete seu estilo e configure as cores de destaque e a ordem das seções.
        </p>
      </div>

      {/* Grid de Templates */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {(Object.keys(MUSIC_TEMPLATES) as MusicTemplateId[]).map((tId) => {
          const tm = MUSIC_TEMPLATES[tId];
          const isSelected = selectedTemplate === tId;

          return (
            <div
              key={tId}
              onClick={() => handleSelectTemplate(tId)}
              className={`cursor-pointer relative p-5 rounded-3xl border transition-all duration-300 flex flex-col justify-between gap-4 shadow-xl ${
                isSelected
                  ? 'bg-zinc-900 border-red-500 shadow-red-500/10 ring-2 ring-red-500/30'
                  : 'bg-zinc-900/60 border-zinc-800 hover:border-zinc-700'
              }`}
            >
              <div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span 
                      className="w-4 h-4 rounded-full shadow-md"
                      style={{ backgroundColor: tm.primaryColor }}
                    />
                    <h3 className="text-base font-black text-white tracking-tight">
                      {tm.name}
                    </h3>
                  </div>

                  {isSelected && (
                    <span className="flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-red-500 text-white">
                      <Check className="w-3 h-3" /> Ativo
                    </span>
                  )}
                </div>

                <p className="text-xs font-semibold text-zinc-300 mt-1">
                  {tm.subtitle}
                </p>

                <p className="text-xs text-zinc-400 mt-2 leading-relaxed">
                  {tm.description}
                </p>
              </div>

              <div className="pt-3 border-t border-zinc-800/80">
                <p className="text-[10px] font-bold uppercase tracking-wider text-zinc-500 mb-1.5">
                  Recomendado para:
                </p>
                <div className="flex flex-wrap gap-1">
                  {tm.recommendedFor.map((rec) => (
                    <span key={rec} className="px-2 py-0.5 rounded-md text-[10px] font-semibold bg-zinc-800 text-zinc-300">
                      {rec}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Cores de Destaque */}
      <div className="rounded-3xl bg-zinc-900/60 border border-zinc-800 p-5 sm:p-6 flex flex-col gap-4">
        <h3 className="text-sm font-black text-white uppercase tracking-wider flex items-center gap-2">
          <Palette className="w-4 h-4 text-red-400" />
          <span>Cores de Destaque Personalizadas</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-xs font-bold text-zinc-300">Cor Primária (Botões e Destaques)</label>
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={primaryColor}
                onChange={(e) => setPrimaryColor(e.target.value)}
                className="w-10 h-10 rounded-xl cursor-pointer bg-transparent border-0"
              />
              <input
                type="text"
                value={primaryColor}
                onChange={(e) => setPrimaryColor(e.target.value)}
                className="rounded-xl h-10 px-3 bg-zinc-950 border border-zinc-800 text-white font-mono text-xs flex-1 uppercase"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-zinc-300">Cor Secundária (Gradientes e Bordas)</label>
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={secondaryColor}
                onChange={(e) => setSecondaryColor(e.target.value)}
                className="w-10 h-10 rounded-xl cursor-pointer bg-transparent border-0"
              />
              <input
                type="text"
                value={secondaryColor}
                onChange={(e) => setSecondaryColor(e.target.value)}
                className="rounded-xl h-10 px-3 bg-zinc-950 border border-zinc-800 text-white font-mono text-xs flex-1 uppercase"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Ordem e Visibilidade das Seções */}
      <div className="rounded-3xl bg-zinc-900/60 border border-zinc-800 p-5 sm:p-6 flex flex-col gap-4">
        <div>
          <h3 className="text-sm font-black text-white uppercase tracking-wider">
            Ordem & Visibilidade dos Módulos
          </h3>
          <p className="text-xs text-zinc-400 mt-0.5">
            Organize a hierarquia do seu portfólio e oculte seções que você não utiliza no momento.
          </p>
        </div>

        <div className="flex flex-col gap-2">
          {sectionOrder.map((secKey, idx) => {
            const isHidden = hiddenSections.includes(secKey);
            const isHero = secKey === 'hero';

            return (
              <div
                key={secKey}
                className={`flex items-center justify-between p-3.5 rounded-2xl border transition ${
                  isHidden ? 'bg-zinc-950/40 border-zinc-850 opacity-60' : 'bg-zinc-950 border-zinc-800'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className="text-xs font-mono text-zinc-500 w-4 text-center">
                    {idx + 1}
                  </span>
                  <span className="text-xs font-bold text-white">
                    {SECTION_LABELS[secKey] || secKey}
                  </span>
                  {isHero && (
                    <span className="text-[10px] text-zinc-500 font-medium">
                      (Fixo no topo)
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  {!isHero && (
                    <>
                      <button
                        type="button"
                        disabled={idx <= 1}
                        onClick={() => handleMoveUp(idx)}
                        className="p-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 disabled:opacity-30 text-zinc-400 hover:text-white"
                        title="Mover para cima"
                      >
                        <ArrowUp className="w-3.5 h-3.5" />
                      </button>

                      <button
                        type="button"
                        disabled={idx >= sectionOrder.length - 1}
                        onClick={() => handleMoveDown(idx)}
                        className="p-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 disabled:opacity-30 text-zinc-400 hover:text-white"
                        title="Mover para baixo"
                      >
                        <ArrowDown className="w-3.5 h-3.5" />
                      </button>

                      <div className="flex items-center gap-2 ml-2 pl-2 border-l border-zinc-800">
                        <span className="text-[11px] text-zinc-400">
                          {isHidden ? 'Oculto' : 'Visível'}
                        </span>
                        <Switch
                          checked={!isHidden}
                          onCheckedChange={() => toggleSectionVisibility(secKey)}
                        />
                      </div>
                    </>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="flex justify-end pt-2">
        <Button
          type="button"
          onClick={handleSave}
          disabled={saving}
          className="h-12 px-8 rounded-2xl bg-red-600 hover:bg-red-700 text-white font-black text-xs uppercase tracking-wider shadow-xl transition active:scale-95"
        >
          {saving ? (
            <span className="flex items-center gap-2">
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Salvando...</span>
            </span>
          ) : (
            <span className="flex items-center gap-2">
              <Check className="w-4 h-4" />
              <span>Salvar Aparência</span>
            </span>
          )}
        </Button>
      </div>
    </div>
  );
}
