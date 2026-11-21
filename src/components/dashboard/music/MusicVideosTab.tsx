"use client";

import React, { useState } from 'react';
import { Video, Plus, Trash2, Pencil, ExternalLink, Loader2, Play, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from 'sonner';
import type { MusicVideo, MusicVideoCategory } from '@/types/music';
import { saveMusicVideoAction, deleteMusicVideoAction } from '@/app/actions/music-pro';

interface MusicVideosTabProps {
  videos: MusicVideo[];
  onRefresh: () => void;
  accessToken?: string;
}

const CATEGORY_OPTIONS: Array<{ value: MusicVideoCategory; label: string }> = [
  { value: 'ao_vivo', label: 'Apresentação Ao Vivo' },
  { value: 'videoclipe', label: 'Videoclipe Oficial' },
  { value: 'casamento', label: 'Casamentos & Cerimônias' },
  { value: 'corporativo', label: 'Eventos Corporativos' },
  { value: 'show', label: 'Shows & Festivais' },
  { value: 'ensaio', label: 'Ensaios de Estúdio' },
  { value: 'promocional', label: 'Vídeo Promocional / Teaser' }
];

export function MusicVideosTab({ videos, onRefresh, accessToken }: MusicVideosTabProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // Form
  const [videoId, setVideoId] = useState('');
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<MusicVideoCategory>('ao_vivo');
  const [videoUrl, setVideoUrl] = useState('');
  const [thumbnailUrl, setThumbnailUrl] = useState('');
  const [duration, setDuration] = useState('');
  const [description, setDescription] = useState('');
  const [published, setPublished] = useState(true);

  const handleOpenNew = () => {
    setVideoId('');
    setTitle('');
    setCategory('ao_vivo');
    setVideoUrl('');
    setThumbnailUrl('');
    setDuration('');
    setDescription('');
    setPublished(true);
    setIsEditing(true);
  };

  const handleOpenEdit = (v: MusicVideo) => {
    setVideoId(v.id);
    setTitle(v.title);
    setCategory(v.category);
    setVideoUrl(v.video_url);
    setThumbnailUrl(v.thumbnail_url || '');
    setDuration(v.duration || '');
    setDescription(v.description || '');
    setPublished(v.published !== false);
    setIsEditing(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !videoUrl.trim()) {
      toast.error('Preencha pelo menos o título e a URL do vídeo.');
      return;
    }

    setSaving(true);
    try {
      const res = await saveMusicVideoAction({
        id: videoId || undefined,
        title,
        category,
        video_url: videoUrl,
        thumbnail_url: thumbnailUrl,
        duration,
        description,
        published
      }, accessToken);

      if (!res.success) throw new Error(res.error);

      toast.success(videoId ? 'Vídeo atualizado com sucesso!' : 'Vídeo cadastrado com sucesso!');
      setIsEditing(false);
      onRefresh();
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || 'Erro ao salvar vídeo.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Deseja realmente excluir este vídeo?')) return;
    setDeletingId(id);
    try {
      const res = await deleteMusicVideoAction(id, accessToken);
      if (!res.success) throw new Error(res.error);
      toast.success('Vídeo excluído com sucesso.');
      onRefresh();
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || 'Erro ao excluir vídeo.');
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
            Vídeos & Apresentações
          </h2>
          <p className="text-xs text-zinc-400">
            Adicione videoclipes e vídeos de apresentações ao vivo para contratantes assistirem diretamente no seu portfólio.
          </p>
        </div>

        {!isEditing && (
          <Button
            type="button"
            onClick={handleOpenNew}
            className="flex items-center gap-2 h-11 px-5 rounded-2xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs uppercase tracking-wider shadow-lg active:scale-95 shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>Adicionar Vídeo</span>
          </Button>
        )}
      </div>

      {/* Form */}
      {isEditing && (
        <form onSubmit={handleSave} className="rounded-3xl bg-zinc-900/80 border border-zinc-800 p-5 sm:p-6 flex flex-col gap-4 shadow-2xl">
          <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
            <h3 className="text-sm font-black text-white uppercase tracking-wider flex items-center gap-2">
              <Video className="w-4 h-4 text-red-500" />
              <span>{videoId ? 'Editar Vídeo' : 'Novo Vídeo'}</span>
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
              <Label className="text-xs font-bold text-zinc-300">Título do Vídeo *</Label>
              <Input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Ex: Show ao vivo no Festival de Verão"
                required
                className="rounded-2xl h-12 bg-zinc-950 border-zinc-800 text-white"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-xs font-bold text-zinc-300">Categoria do Vídeo</Label>
              <Select value={category} onValueChange={(val) => setCategory(val as any)}>
                <SelectTrigger className="rounded-2xl h-12 bg-zinc-950 border-zinc-800 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="rounded-2xl bg-zinc-900 border-zinc-800 text-white">
                  {CATEGORY_OPTIONS.map((c) => (
                    <SelectItem key={c.value} value={c.value}>
                      {c.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2 sm:col-span-2">
              <Label className="text-xs font-bold text-zinc-300">Link do Vídeo (YouTube ou Vimeo) *</Label>
              <Input
                value={videoUrl}
                onChange={(e) => setVideoUrl(e.target.value)}
                placeholder="https://youtube.com/watch?v=... ou https://youtu.be/..."
                required
                className="rounded-2xl h-12 bg-zinc-950 border-zinc-800 text-white"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-xs font-bold text-zinc-300">URL da Miniatura Personalizada (Opcional)</Label>
              <Input
                value={thumbnailUrl}
                onChange={(e) => setThumbnailUrl(e.target.value)}
                placeholder="https://exemplo.com/thumb.jpg"
                className="rounded-2xl h-12 bg-zinc-950 border-zinc-800 text-white"
              />
              <p className="text-[11px] text-zinc-500">
                Se deixar em branco, a imagem será capturada automaticamente do YouTube.
              </p>
            </div>

            <div className="space-y-2">
              <Label className="text-xs font-bold text-zinc-300">Duração Aproximada (Ex: 3:45)</Label>
              <Input
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                placeholder="Ex: 4:12"
                className="rounded-2xl h-12 bg-zinc-950 border-zinc-800 text-white"
              />
            </div>

            <div className="space-y-2 sm:col-span-2">
              <Label className="text-xs font-bold text-zinc-300">Descrição / Ficha Técnica (Opcional)</Label>
              <Textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Gravado ao vivo em... Direção por..."
                rows={2}
                className="rounded-2xl bg-zinc-950 border-zinc-800 text-white text-xs"
              />
            </div>
          </div>

          <div className="flex items-center justify-between pt-2 border-t border-zinc-800">
            <div className="flex items-center gap-3">
              <Switch checked={published} onCheckedChange={setPublished} id="pub-vid" />
              <label htmlFor="pub-vid" className="text-xs font-bold text-zinc-200 cursor-pointer">
                Exibir na galeria pública
              </label>
            </div>

            <div className="flex gap-2">
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
                {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Salvar Vídeo'}
              </Button>
            </div>
          </div>
        </form>
      )}

      {/* Lista */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
        {videos.length > 0 ? (
          videos.map((video) => (
            <div
              key={video.id}
              className="flex flex-col justify-between p-3.5 rounded-2xl bg-zinc-900/60 border border-zinc-800 hover:border-zinc-700 transition shadow-lg gap-3"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h3 className="text-sm font-bold text-white truncate max-w-[220px]">
                    {video.title}
                  </h3>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-red-400">
                    {CATEGORY_OPTIONS.find(c => c.value === video.category)?.label || video.category}
                  </span>
                </div>

                <div className="flex items-center gap-1 shrink-0">
                  <button
                    type="button"
                    onClick={() => handleOpenEdit(video)}
                    className="p-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 transition"
                    title="Editar"
                  >
                    <Pencil className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    disabled={deletingId === video.id}
                    onClick={() => handleDelete(video.id)}
                    className="p-1.5 rounded-lg bg-zinc-800 hover:bg-red-500/20 text-zinc-400 hover:text-red-400 transition"
                    title="Excluir"
                  >
                    {deletingId === video.id ? (
                      <Loader2 className="w-3.5 h-3.5 animate-spin text-red-400" />
                    ) : (
                      <Trash2 className="w-3.5 h-3.5" />
                    )}
                  </button>
                </div>
              </div>

              <div className="text-[11px] text-zinc-500 font-mono truncate">
                {video.video_url}
              </div>
            </div>
          ))
        ) : (
          <div className="sm:col-span-2 p-12 text-center rounded-3xl bg-zinc-900/40 border border-dashed border-zinc-800 flex flex-col items-center gap-3">
            <Video className="w-10 h-10 text-zinc-600" />
            <h3 className="text-sm font-bold text-white">Nenhum vídeo cadastrado</h3>
            <p className="text-xs text-zinc-400 max-w-sm">
              Vídeos ao vivo e teasers de apresentações aumentam a taxa de fechamento de orçamentos para eventos.
            </p>
            <Button
              type="button"
              onClick={handleOpenNew}
              className="mt-2 rounded-2xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs uppercase tracking-wider"
            >
              Adicionar Primeiro Vídeo
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
