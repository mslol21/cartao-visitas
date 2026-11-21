"use client";

import React, { useState } from 'react';
import { MessageCircle, Check, Loader2, Sparkles, ExternalLink, Plus, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import type { Profile } from '@/types/profile';
import type { MusicProfileData, MusicProfileConfig } from '@/types/music';
import { DEFAULT_MUSIC_HIRE_MESSAGE, MUSIC_DEFAULT_EVENT_TYPES } from '@/config/music-constants';
import { saveMusicConfigAction } from '@/app/actions/music-pro';
import { updateOwnerProfileNeon } from '@/app/actions/neon-profile';

interface MusicHireTabProps {
  profile: Profile;
  musicData: MusicProfileData;
  onRefresh: () => void;
  accessToken?: string;
}

export function MusicHireTab({ profile, musicData, onRefresh, accessToken }: MusicHireTabProps) {
  const [saving, setSaving] = useState(false);

  const [whatsapp, setWhatsapp] = useState(profile.whatsapp || '');
  const [hireButtonText, setHireButtonText] = useState(musicData.config.hire_button_text || 'Contratar para Eventos');
  const [whatsappMessage, setWhatsappMessage] = useState(musicData.config.whatsapp_hire_message || DEFAULT_MUSIC_HIRE_MESSAGE);
  const [hireEmail, setHireEmail] = useState(musicData.config.hire_email || '');
  const [region, setRegion] = useState(musicData.config.performance_region || profile.area_atendimento || '');
  const [eventTypes, setEventTypes] = useState<string[]>(musicData.config.event_types && musicData.config.event_types.length > 0 
    ? musicData.config.event_types 
    : MUSIC_DEFAULT_EVENT_TYPES);
  const [newTypeInput, setNewTypeInput] = useState('');

  const handleAddEventType = () => {
    if (!newTypeInput.trim()) return;
    if (eventTypes.includes(newTypeInput.trim())) return;
    setEventTypes([...eventTypes, newTypeInput.trim()]);
    setNewTypeInput('');
  };

  const handleRemoveEventType = (typeToRemove: string) => {
    setEventTypes(eventTypes.filter(t => t !== typeToRemove));
  };

  const handleTestWhatsApp = () => {
    const cleanPhone = whatsapp.replace(/\D/g, '');
    if (!cleanPhone) {
      toast.error('Informe um número de WhatsApp válido.');
      return;
    }
    const testUrl = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(whatsappMessage)}`;
    window.open(testUrl, '_blank', 'noopener,noreferrer');
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const configUpdate: Partial<MusicProfileConfig> = {
        hire_button_text: hireButtonText,
        whatsapp_hire_message: whatsappMessage,
        hire_email: hireEmail,
        performance_region: region,
        event_types: eventTypes
      };

      const musicRes = await saveMusicConfigAction(configUpdate, accessToken);
      if (!musicRes.success) throw new Error(musicRes.error);

      await updateOwnerProfileNeon({
        whatsapp,
        whatsapp_message: whatsappMessage,
        area_atendimento: region
      }, accessToken);

      toast.success('Configurações de contratação salvas com sucesso!');
      onRefresh();
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || 'Erro ao salvar contratação.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSave} className="flex flex-col gap-6">
      {/* Cabeçalho */}
      <div className="flex flex-col gap-1">
        <h2 className="text-xl font-black text-white tracking-tight">
          Contratação & WhatsApp para Shows
        </h2>
        <p className="text-xs text-zinc-400">
          Configure o fluxo de fechamento de orçamentos diretamente para o seu WhatsApp profissional.
        </p>
      </div>

      <div className="rounded-3xl bg-zinc-900/60 border border-zinc-800 p-5 sm:p-6 flex flex-col gap-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label className="text-xs font-bold text-zinc-300">Número de WhatsApp com DDD *</Label>
            <Input
              value={whatsapp}
              onChange={(e) => setWhatsapp(e.target.value)}
              placeholder="Ex: (11) 99999-9999"
              required
              className="rounded-2xl h-12 bg-zinc-950 border-zinc-800 text-white"
            />
          </div>

          <div className="space-y-2">
            <Label className="text-xs font-bold text-zinc-300">Texto do Botão de Ação Principal</Label>
            <Input
              value={hireButtonText}
              onChange={(e) => setHireButtonText(e.target.value)}
              placeholder="Contratar para Eventos"
              className="rounded-2xl h-12 bg-zinc-950 border-zinc-800 text-white"
            />
          </div>

          <div className="space-y-2">
            <Label className="text-xs font-bold text-zinc-300">E-mail Profissional (Opcional)</Label>
            <Input
              value={hireEmail}
              onChange={(e) => setHireEmail(e.target.value)}
              placeholder="contato@meunome.com.br"
              type="email"
              className="rounded-2xl h-12 bg-zinc-950 border-zinc-800 text-white"
            />
          </div>

          <div className="space-y-2">
            <Label className="text-xs font-bold text-zinc-300">Região de Atuação para Apresentações</Label>
            <Input
              value={region}
              onChange={(e) => setRegion(e.target.value)}
              placeholder="Ex: São Paulo, Interior e Litoral"
              className="rounded-2xl h-12 bg-zinc-950 border-zinc-800 text-white"
            />
          </div>

          <div className="space-y-2 sm:col-span-2">
            <Label className="text-xs font-bold text-zinc-300">Mensagem Padrão de Abertura no WhatsApp</Label>
            <Textarea
              value={whatsappMessage}
              onChange={(e) => setWhatsappMessage(e.target.value)}
              rows={3}
              className="rounded-2xl bg-zinc-950 border-zinc-800 text-white text-xs leading-relaxed"
            />
            <p className="text-[11px] text-zinc-500">
              Esta é a mensagem que o contratante envia pré-preenchida ao clicar no botão do WhatsApp.
            </p>
          </div>
        </div>

        {/* Tipos de Eventos Atendidos */}
        <div className="pt-3 border-t border-zinc-800 flex flex-col gap-3">
          <Label className="text-xs font-bold text-zinc-300">Formatos e Tipos de Eventos Atendidos</Label>
          <div className="flex flex-wrap gap-2">
            {eventTypes.map((type) => (
              <span
                key={type}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-zinc-800 border border-zinc-700 text-white"
              >
                <span>{type}</span>
                <button
                  type="button"
                  onClick={() => handleRemoveEventType(type)}
                  className="p-0.5 rounded-full hover:bg-zinc-700 text-zinc-400 hover:text-white"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            ))}
          </div>

          <div className="flex items-center gap-2 max-w-sm mt-1">
            <Input
              value={newTypeInput}
              onChange={(e) => setNewTypeInput(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleAddEventType(); } }}
              placeholder="Novo formato (ex: Bodas, Inauguração)"
              className="rounded-xl h-10 bg-zinc-950 border-zinc-800 text-white text-xs"
            />
            <Button
              type="button"
              onClick={handleAddEventType}
              className="h-10 px-4 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-white text-xs shrink-0"
            >
              Adicionar
            </Button>
          </div>
        </div>

        {/* Testar botão */}
        <div className="pt-3 border-t border-zinc-800 flex items-center justify-between">
          <span className="text-xs text-zinc-400">Verifique como a conversa abre no celular:</span>
          <Button
            type="button"
            variant="outline"
            onClick={handleTestWhatsApp}
            className="flex items-center gap-2 rounded-xl h-10 border-zinc-700 text-xs text-zinc-200"
          >
            <MessageCircle className="w-3.5 h-3.5 text-emerald-400" />
            <span>Testar Mensagem no WhatsApp</span>
            <ExternalLink className="w-3 h-3 text-zinc-500" />
          </Button>
        </div>
      </div>

      <div className="flex justify-end pt-2">
        <Button
          type="submit"
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
              <span>Salvar Configuração</span>
            </span>
          )}
        </Button>
      </div>
    </form>
  );
}
