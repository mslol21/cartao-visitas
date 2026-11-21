"use client";

import React, { useState } from 'react';
import { ListMusic, Plus, Trash2, Pencil, Loader2, Music2, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from 'sonner';
import type { MusicRepertoireItem, MusicRepertoireCategory } from '@/types/music';
import { saveMusicRepertoireAction, deleteMusicRepertoireAction } from '@/app/actions/music-pro';

interface MusicRepertoireTabProps {
  repertoire: MusicRepertoireItem[];
  onRefresh: () => void;
  accessToken?: string;
}

const CATEGORY_OPTIONS: Array<{ value: MusicRepertoireCategory; label: string }> = [
  { value: 'casamentos', label: 'Casamentos & Cerimônias' },
  { value: 'cerimonias', label: 'Música Sacra / Religiosa' },
  { value: 'mpb', label: 'MPB / Bossa Nova' },
  { value: 'pop', label: 'Pop Nacional & Internacional' },
  { value: 'rock', label: 'Rock & Clássicos' },
  { value: 'jazz', label: 'Jazz & Blues' },
  { value: 'instrumental', label: 'Música Instrumental' },
  { value: 'corporativo', label: 'Eventos Corporativos' },
  { value: 'geral', label: 'Repertório Geral' }
];

export function MusicRepertoireTab({ repertoire, onRefresh, accessToken }: MusicRepertoireTabProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // Form State
  const [itemId, setItemId] = useState('');
  const [title, setTitle] = useState('');
  const [originalArtist, setOriginalArtist] = useState('');
  const [genre, setGenre] = useState('');
  const [category, setCategory] = useState<MusicRepertoireCategory>('casamentos');
  const [notes, setNotes] = useState('');

  const handleOpenNew = () => {
    setItemId('');
    setTitle('');
    setOriginalArtist('');
    setGenre('');
    setCategory('casamentos');
    setNotes('');
    setIsEditing(true);
  };

  const handleOpenEdit = (item: MusicRepertoireItem) => {
    setItemId(item.id);
    setTitle(item.title);
    setOriginalArtist(item.original_artist || '');
    setGenre(item.genre || '');
    setCategory(item.category);
    setNotes(item.notes || '');
    setIsEditing(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      toast.error('Informe o nome da música.');
      return;
    }

    setSaving(true);
    try {
      const res = await saveMusicRepertoireAction({
        id: itemId || undefined,
        title,
        original_artist: originalArtist,
        genre,
        category,
        notes
      }, accessToken);

      if (!res.success) throw new Error(res.error);

      toast.success(itemId ? 'Música atualizada no repertório!' : 'Música adicionada ao repertório!');
      setIsEditing(false);
      onRefresh();
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || 'Erro ao salvar repertório.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Deseja remover esta música do repertório?')) return;
    setDeletingId(id);
    try {
      const res = await deleteMusicRepertoireAction(id, accessToken);
      if (!res.success) throw new Error(res.error);
      toast.success('Música removida do repertório.');
      onRefresh();
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || 'Erro ao remover música.');
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
            Repertório Musical
          </h2>
          <p className="text-xs text-zinc-400">
            Cadastre as músicas que você toca em casamentos, formaturas e eventos. Clientes podem buscar canções e sugerir no WhatsApp.
          </p>
        </div>

        {!isEditing && (
          <Button
            type="button"
            onClick={handleOpenNew}
            className="flex items-center gap-2 h-11 px-5 rounded-2xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs uppercase tracking-wider shadow-lg active:scale-95 shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>Adicionar Música</span>
          </Button>
        )}
      </div>

      {/* Form */}
      {isEditing && (
        <form onSubmit={handleSave} className="rounded-3xl bg-zinc-900/80 border border-zinc-800 p-5 sm:p-6 flex flex-col gap-4 shadow-2xl">
          <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
            <h3 className="text-sm font-black text-white uppercase tracking-wider flex items-center gap-2">
              <ListMusic className="w-4 h-4 text-red-500" />
              <span>{itemId ? 'Editar Canção' : 'Nova Canção no Repertório'}</span>
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
              <Label className="text-xs font-bold text-zinc-300">Nome da Música *</Label>
              <Input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Ex: Hallelujah, Como é Grande o Meu Amor por Você"
                required
                className="rounded-2xl h-12 bg-zinc-950 border-zinc-800 text-white"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-xs font-bold text-zinc-300">Artista Original / Compositor</Label>
              <Input
                value={originalArtist}
                onChange={(e) => setOriginalArtist(e.target.value)}
                placeholder="Ex: Roberto Carlos, Leonard Cohen"
                className="rounded-2xl h-12 bg-zinc-950 border-zinc-800 text-white"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-xs font-bold text-zinc-300">Categoria do Repertório</Label>
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

            <div className="space-y-2">
              <Label className="text-xs font-bold text-zinc-300">Gênero Musical</Label>
              <Input
                value={genre}
                onChange={(e) => setGenre(e.target.value)}
                placeholder="Ex: MPB, Bossa Nova, Rock Clássico"
                className="rounded-2xl h-12 bg-zinc-950 border-zinc-800 text-white"
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2 border-t border-zinc-800">
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
              {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Salvar Canção'}
            </Button>
          </div>
        </form>
      )}

      {/* Lista de Músicas */}
      <div className="overflow-hidden rounded-2xl bg-zinc-900/60 border border-zinc-800 divide-y divide-zinc-850 shadow-xl">
        {repertoire.length > 0 ? (
          repertoire.map((item, idx) => (
            <div
              key={item.id}
              className="flex items-center justify-between p-3.5 hover:bg-zinc-850/40 transition gap-3"
            >
              <div className="flex items-center gap-3 min-w-0">
                <span className="text-xs font-mono text-zinc-600 w-5 shrink-0 text-center">
                  {idx + 1}
                </span>
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-white truncate">
                    {item.title}
                  </p>
                  <p className="text-xs text-zinc-400 truncate">
                    {item.original_artist || 'Autor Desconhecido'} 
                    {item.genre ? ` • ${item.genre}` : ''}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <span className="hidden sm:inline-block px-2.5 py-0.5 rounded-lg text-[10px] font-bold bg-zinc-800 text-zinc-400">
                  {CATEGORY_OPTIONS.find(c => c.value === item.category)?.label || item.category}
                </span>

                <button
                  type="button"
                  onClick={() => handleOpenEdit(item)}
                  className="p-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 transition"
                  title="Editar"
                >
                  <Pencil className="w-3.5 h-3.5" />
                </button>

                <button
                  type="button"
                  disabled={deletingId === item.id}
                  onClick={() => handleDelete(item.id)}
                  className="p-1.5 rounded-lg bg-zinc-800 hover:bg-red-500/20 text-zinc-400 hover:text-red-400 transition"
                  title="Excluir"
                >
                  {deletingId === item.id ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin text-red-400" />
                  ) : (
                    <Trash2 className="w-3.5 h-3.5" />
                  )}
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="p-12 text-center flex flex-col items-center gap-3">
            <ListMusic className="w-10 h-10 text-zinc-600" />
            <h3 className="text-sm font-bold text-white">Repertório vazio</h3>
            <p className="text-xs text-zinc-400 max-w-sm">
              Adicione as músicas que compõem suas apresentações para facilitar a escolha de repertório pelos contratantes.
            </p>
            <Button
              type="button"
              onClick={handleOpenNew}
              className="mt-2 rounded-2xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs uppercase tracking-wider"
            >
              Adicionar Primeira Canção
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
