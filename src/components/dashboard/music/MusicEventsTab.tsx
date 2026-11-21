"use client";

import React, { useState } from 'react';
import { Calendar, Plus, Trash2, Pencil, ExternalLink, Loader2, Lock, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { toast } from 'sonner';
import type { MusicEvent } from '@/types/music';
import { saveMusicEventAction, deleteMusicEventAction } from '@/app/actions/music-pro';

interface MusicEventsTabProps {
  events: MusicEvent[];
  onRefresh: () => void;
  accessToken?: string;
}

export function MusicEventsTab({ events, onRefresh, accessToken }: MusicEventsTabProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // Form
  const [eventId, setEventId] = useState('');
  const [title, setTitle] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [venue, setVenue] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [description, setDescription] = useState('');
  const [ticketUrl, setTicketUrl] = useState('');
  const [isPrivate, setIsPrivate] = useState(false);
  const [published, setPublished] = useState(true);

  const handleOpenNew = () => {
    setEventId('');
    setTitle('');
    setDate(new Date().toISOString().split('T')[0]);
    setTime('20:00');
    setVenue('');
    setCity('');
    setState('');
    setDescription('');
    setTicketUrl('');
    setIsPrivate(false);
    setPublished(true);
    setIsEditing(true);
  };

  const handleOpenEdit = (e: MusicEvent) => {
    setEventId(e.id);
    setTitle(e.title);
    setDate(e.date);
    setTime(e.time || '');
    setVenue(e.venue);
    setCity(e.city);
    setState(e.state || '');
    setDescription(e.description || '');
    setTicketUrl(e.ticket_url || '');
    setIsPrivate(Boolean(e.is_private));
    setPublished(e.published !== false);
    setIsEditing(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !date.trim() || !venue.trim() || !city.trim()) {
      toast.error('Preencha os campos obrigatórios (Título, Data, Local e Cidade).');
      return;
    }

    setSaving(true);
    try {
      const res = await saveMusicEventAction({
        id: eventId || undefined,
        title,
        date,
        time,
        venue,
        city,
        state,
        description,
        ticket_url: ticketUrl,
        is_private: isPrivate,
        published
      }, accessToken);

      if (!res.success) throw new Error(res.error);

      toast.success(eventId ? 'Evento atualizado com sucesso!' : 'Evento adicionado à agenda!');
      setIsEditing(false);
      onRefresh();
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || 'Erro ao salvar evento.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Deseja excluir este evento da agenda?')) return;
    setDeletingId(id);
    try {
      const res = await deleteMusicEventAction(id, accessToken);
      if (!res.success) throw new Error(res.error);
      toast.success('Evento excluído da agenda.');
      onRefresh();
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || 'Erro ao excluir evento.');
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Cabeçalho */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-black text-white tracking-tight">
            Agenda de Shows & Eventos
          </h2>
          <p className="text-xs text-zinc-400">
            Mantenha seus contratantes e fãs informados sobre suas próximas datas e apresentações.
          </p>
        </div>

        {!isEditing && (
          <Button
            type="button"
            onClick={handleOpenNew}
            className="flex items-center gap-2 h-11 px-5 rounded-2xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs uppercase tracking-wider shadow-lg active:scale-95 shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>Adicionar Data</span>
          </Button>
        )}
      </div>

      {/* Form */}
      {isEditing && (
        <form onSubmit={handleSave} className="rounded-3xl bg-zinc-900/80 border border-zinc-800 p-5 sm:p-6 flex flex-col gap-4 shadow-2xl">
          <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
            <h3 className="text-sm font-black text-white uppercase tracking-wider flex items-center gap-2">
              <Calendar className="w-4 h-4 text-red-500" />
              <span>{eventId ? 'Editar Apresentação' : 'Nova Apresentação na Agenda'}</span>
            </h3>
            <button
              type="button"
              onClick={() => setIsEditing(false)}
              className="p-1 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-xs font-bold text-zinc-300">Título do Show / Evento *</Label>
              <Input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Ex: Turnê Acústica, Casamento Privado"
                required
                className="rounded-2xl h-12 bg-zinc-950 border-zinc-800 text-white"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-xs font-bold text-zinc-300">Data do Evento *</Label>
              <Input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                required
                className="rounded-2xl h-12 bg-zinc-950 border-zinc-800 text-white"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-xs font-bold text-zinc-300">Horário Previsto (Opcional)</Label>
              <Input
                value={time}
                onChange={(e) => setTime(e.target.value)}
                placeholder="Ex: 21:00"
                className="rounded-2xl h-12 bg-zinc-950 border-zinc-800 text-white"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-xs font-bold text-zinc-300">Local / Casa de Shows / Espaço *</Label>
              <Input
                value={venue}
                onChange={(e) => setVenue(e.target.value)}
                placeholder="Ex: Blue Note, Villa Bisutti, Teatro Municipal"
                required
                className="rounded-2xl h-12 bg-zinc-950 border-zinc-800 text-white"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-xs font-bold text-zinc-300">Cidade *</Label>
              <Input
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="Ex: São Paulo"
                required
                className="rounded-2xl h-12 bg-zinc-950 border-zinc-800 text-white"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-xs font-bold text-zinc-300">Estado / UF</Label>
              <Input
                value={state}
                onChange={(e) => setState(e.target.value)}
                placeholder="Ex: SP"
                className="rounded-2xl h-12 bg-zinc-950 border-zinc-800 text-white"
              />
            </div>

            <div className="space-y-2 sm:col-span-2">
              <Label className="text-xs font-bold text-zinc-300">Link para Ingressos / Informações (Opcional)</Label>
              <Input
                value={ticketUrl}
                onChange={(e) => setTicketUrl(e.target.value)}
                placeholder="https://sympla.com.br/... ou https://ticket360.com.br/..."
                className="rounded-2xl h-12 bg-zinc-950 border-zinc-800 text-white text-xs"
              />
            </div>

            <div className="space-y-2 sm:col-span-2">
              <Label className="text-xs font-bold text-zinc-300">Descrição / Informações Adicionais</Label>
              <Textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Abertura dos portões às 19h. Censura 18 anos..."
                rows={2}
                className="rounded-2xl bg-zinc-950 border-zinc-800 text-white text-xs"
              />
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-4 pt-3 border-t border-zinc-800">
            <div className="flex items-center gap-3">
              <Switch checked={isPrivate} onCheckedChange={setIsPrivate} id="priv-sw" />
              <div>
                <label htmlFor="priv-sw" className="text-xs font-bold text-zinc-200 cursor-pointer block">
                  Evento Privado (Casamento / Corporativo)
                </label>
                <p className="text-[10px] text-zinc-500">
                  Oculta o endereço exato na página pública por discrição e segurança do contratante.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Switch checked={published} onCheckedChange={setPublished} id="pub-sw" />
              <label htmlFor="pub-sw" className="text-xs font-bold text-zinc-200 cursor-pointer">
                Exibir na agenda pública
              </label>
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsEditing(false)}
              className="rounded-2xl h-11 px-5 border-zinc-800 text-zinc-300"
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={saving}
              className="rounded-2xl h-11 px-6 bg-red-600 hover:bg-red-700 text-white font-bold text-xs uppercase tracking-wider"
            >
              {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Salvar Data'}
            </Button>
          </div>
        </form>
      )}

      {/* Lista de Apresentações */}
      <div className="flex flex-col gap-3">
        {events.length > 0 ? (
          events.map((evt) => (
            <div
              key={evt.id}
              className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-2xl bg-zinc-900/60 border border-zinc-800 hover:border-zinc-700 transition gap-4 shadow-lg"
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className="flex flex-col items-center justify-center w-12 h-12 rounded-xl bg-red-500/15 border border-red-500/30 text-center shrink-0">
                  <span className="text-[10px] font-black text-red-400">
                    {evt.date.split('-')[1]}
                  </span>
                  <span className="text-base font-black text-white leading-tight">
                    {evt.date.split('-')[2]}
                  </span>
                </div>

                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-bold text-white truncate">
                      {evt.title}
                    </h3>
                    {evt.is_private && (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-bold bg-zinc-800 text-zinc-400">
                        <Lock className="w-2.5 h-2.5" />
                        <span>Privado</span>
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-zinc-400 mt-0.5 truncate">
                    {evt.venue} • {evt.city}{evt.state ? `, ${evt.state}` : ''} {evt.time ? `(${evt.time})` : ''}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                <button
                  type="button"
                  onClick={() => handleOpenEdit(evt)}
                  className="p-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300 transition"
                  title="Editar"
                >
                  <Pencil className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  disabled={deletingId === evt.id}
                  onClick={() => handleDelete(evt.id)}
                  className="p-2 rounded-xl bg-zinc-800 hover:bg-red-500/20 text-zinc-400 hover:text-red-400 transition"
                  title="Excluir"
                >
                  {deletingId === evt.id ? (
                    <Loader2 className="w-4 h-4 animate-spin text-red-400" />
                  ) : (
                    <Trash2 className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="p-12 text-center rounded-3xl bg-zinc-900/40 border border-dashed border-zinc-800 flex flex-col items-center gap-3">
            <Calendar className="w-10 h-10 text-zinc-600" />
            <h3 className="text-sm font-bold text-white">Nenhum evento na agenda</h3>
            <p className="text-xs text-zinc-400 max-w-sm">
              Cadastre suas próximas datas para que contratantes vejam sua disponibilidade e fãs acompanhem suas apresentações.
            </p>
            <Button
              type="button"
              onClick={handleOpenNew}
              className="mt-2 rounded-2xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs uppercase tracking-wider"
            >
              Adicionar Primeira Data
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
