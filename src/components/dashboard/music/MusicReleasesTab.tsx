"use client";

import React, { useState } from 'react';
import { 
  Disc, 
  Plus, 
  Trash2, 
  Pencil, 
  ExternalLink, 
  Loader2, 
  Sparkles, 
  Radio, 
  Check, 
  X,
  Play
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from 'sonner';
import type { MusicRelease, MusicReleaseType, MusicStreamingLink, MusicPlatformId } from '@/types/music';
import { MUSIC_PLATFORMS } from '@/config/music-constants';
import { saveMusicReleaseAction, deleteMusicReleaseAction } from '@/app/actions/music-pro';
import { SITE_URL } from '@/lib/seo/site';
import Link from 'next/link';

interface MusicReleasesTabProps {
  releases: MusicRelease[];
  username?: string;
  defaultArtistName: string;
  onRefresh: () => void;
  accessToken?: string;
}

const TYPE_OPTIONS: Array<{ value: MusicReleaseType; label: string }> = [
  { value: 'single', label: 'Single' },
  { value: 'ep', label: 'EP' },
  { value: 'album', label: 'Álbum' },
  { value: 'faixa', label: 'Faixa Avulsa' },
  { value: 'pre_save', label: 'Próximo Lançamento (Pré-Save)' }
];

export function MusicReleasesTab({
  releases,
  username,
  defaultArtistName,
  onRefresh,
  accessToken
}: MusicReleasesTabProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // Form State
  const [releaseId, setReleaseId] = useState('');
  const [title, setTitle] = useState('');
  const [artist, setArtist] = useState(defaultArtistName);
  const [slug, setSlug] = useState('');
  const [releaseType, setReleaseType] = useState<MusicReleaseType>('single');
  const [coverUrl, setCoverUrl] = useState('');
  const [description, setDescription] = useState('');
  const [releaseDate, setReleaseDate] = useState('');
  const [genre, setGenre] = useState('');
  const [featured, setFeatured] = useState(false);
  const [published, setPublished] = useState(true);
  const [embedUrl, setEmbedUrl] = useState('');
  const [streamingLinks, setStreamingLinks] = useState<MusicStreamingLink[]>([]);

  const handleOpenNew = () => {
    setReleaseId('');
    setTitle('');
    setArtist(defaultArtistName);
    setSlug('');
    setReleaseType('single');
    setCoverUrl('');
    setDescription('');
    setReleaseDate(new Date().toISOString().split('T')[0]);
    setGenre('');
    setFeatured(false);
    setPublished(true);
    setEmbedUrl('');
    setStreamingLinks([
      { platform: 'spotify', url: '' },
      { platform: 'apple_music', url: '' },
      { platform: 'youtube', url: '' }
    ]);
    setIsEditing(true);
  };

  const handleOpenEdit = (release: MusicRelease) => {
    setReleaseId(release.id);
    setTitle(release.title);
    setArtist(release.artist);
    setSlug(release.slug);
    setReleaseType(release.release_type);
    setCoverUrl(release.cover_url);
    setDescription(release.description || '');
    setReleaseDate(release.release_date || '');
    setGenre(release.genre || '');
    setFeatured(Boolean(release.featured));
    setPublished(release.published !== false);
    setEmbedUrl(release.embed_url || '');
    setStreamingLinks(release.streaming_links && release.streaming_links.length > 0 
      ? release.streaming_links 
      : [{ platform: 'spotify', url: '' }]);
    setIsEditing(true);
  };

  const handleAddPlatformLink = (platId: MusicPlatformId) => {
    if (streamingLinks.some(l => l.platform === platId)) return;
    setStreamingLinks([...streamingLinks, { platform: platId, url: '' }]);
  };

  const handleUpdatePlatformLink = (index: number, url: string) => {
    const updated = [...streamingLinks];
    updated[index].url = url;
    setStreamingLinks(updated);
  };

  const handleRemovePlatformLink = (index: number) => {
    setStreamingLinks(streamingLinks.filter((_, i) => i !== index));
  };

  const handleTitleChange = (newTitle: string) => {
    setTitle(newTitle);
    if (!releaseId) {
      // Auto-gerar slug amigável
      const autoSlug = newTitle
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-|-$/g, '');
      setSlug(autoSlug);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !coverUrl.trim()) {
      toast.error('Preencha pelo menos o título e a URL da capa.');
      return;
    }

    setSaving(true);
    try {
      // Filtrar links vazios
      const validLinks = streamingLinks.filter(l => Boolean(l.url && l.url.trim().startsWith('http')));

      const res = await saveMusicReleaseAction({
        id: releaseId || undefined,
        title,
        artist,
        slug: slug || title.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
        release_type: releaseType,
        cover_url: coverUrl,
        description,
        release_date: releaseDate,
        genre,
        featured,
        published,
        embed_url: embedUrl,
        streaming_links: validLinks
      }, accessToken);

      if (!res.success) throw new Error(res.error);

      toast.success(releaseId ? 'Lançamento atualizado com sucesso!' : 'Lançamento cadastrado com sucesso!');
      setIsEditing(false);
      onRefresh();
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || 'Erro ao salvar lançamento.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Deseja realmente excluir este lançamento? Esta ação não pode ser desfeita.')) return;
    setDeletingId(id);
    try {
      const res = await deleteMusicReleaseAction(id, accessToken);
      if (!res.success) throw new Error(res.error);
      toast.success('Lançamento excluído com sucesso.');
      onRefresh();
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || 'Erro ao excluir lançamento.');
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
            Discografia & Músicas
          </h2>
          <p className="text-xs text-zinc-400">
            Cadastre singles, álbuns e EPs com links de streaming e Smart Links dedicados.
          </p>
        </div>

        {!isEditing && (
          <Button
            type="button"
            onClick={handleOpenNew}
            className="flex items-center gap-2 h-11 px-5 rounded-2xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs uppercase tracking-wider shadow-lg active:scale-95 shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>Adicionar Lançamento</span>
          </Button>
        )}
      </div>

      {/* Formulário de Criação/Edição */}
      {isEditing ? (
        <form onSubmit={handleSave} className="rounded-3xl bg-zinc-900/80 border border-zinc-800 p-5 sm:p-6 flex flex-col gap-5 shadow-2xl">
          <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
            <h3 className="text-sm font-black text-white uppercase tracking-wider flex items-center gap-2">
              <Disc className="w-4 h-4 text-red-500" />
              <span>{releaseId ? 'Editar Lançamento' : 'Novo Lançamento'}</span>
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
              <Label className="text-xs font-bold text-zinc-300">Título da Obra / Música *</Label>
              <Input
                value={title}
                onChange={(e) => handleTitleChange(e.target.value)}
                placeholder="Ex: Te Amar Demais, Sonhos Acústicos"
                required
                className="rounded-2xl h-12 bg-zinc-950 border-zinc-800 text-white"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-xs font-bold text-zinc-300">Nome do Artista / Banda *</Label>
              <Input
                value={artist}
                onChange={(e) => setArtist(e.target.value)}
                placeholder="Ex: Seu Nome Artístico"
                required
                className="rounded-2xl h-12 bg-zinc-950 border-zinc-800 text-white"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-xs font-bold text-zinc-300">Tipo de Lançamento</Label>
              <Select value={releaseType} onValueChange={(val) => setReleaseType(val as any)}>
                <SelectTrigger className="rounded-2xl h-12 bg-zinc-950 border-zinc-800 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="rounded-2xl bg-zinc-900 border-zinc-800 text-white">
                  {TYPE_OPTIONS.map((t) => (
                    <SelectItem key={t.value} value={t.value}>
                      {t.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="text-xs font-bold text-zinc-300">URL da Imagem da Capa (1:1 Quadrada) *</Label>
              <Input
                value={coverUrl}
                onChange={(e) => setCoverUrl(e.target.value)}
                placeholder="https://exemplo.com/capa.jpg"
                required
                className="rounded-2xl h-12 bg-zinc-950 border-zinc-800 text-white"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-xs font-bold text-zinc-300">Gênero Musical</Label>
              <Input
                value={genre}
                onChange={(e) => setGenre(e.target.value)}
                placeholder="Ex: MPB, Pop, Rock, Eletrônica"
                className="rounded-2xl h-12 bg-zinc-950 border-zinc-800 text-white"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-xs font-bold text-zinc-300">Data de Lançamento</Label>
              <Input
                type="date"
                value={releaseDate}
                onChange={(e) => setReleaseDate(e.target.value)}
                className="rounded-2xl h-12 bg-zinc-950 border-zinc-800 text-white"
              />
            </div>

            <div className="space-y-2 sm:col-span-2">
              <Label className="text-xs font-bold text-zinc-300">
                Slug da URL do Smart Link (ex: konnexy.com.br/{username || 'artista'}/musica/<strong>{slug || 'meu-single'}</strong>)
              </Label>
              <Input
                value={slug}
                onChange={(e) => setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-]+/g, ''))}
                placeholder="meu-single"
                required
                className="rounded-2xl h-11 bg-zinc-950 border-zinc-800 text-white font-mono text-xs"
              />
            </div>

            <div className="space-y-2 sm:col-span-2">
              <Label className="text-xs font-bold text-zinc-300">Descrição / Release de Imprensa (Opcional)</Label>
              <Textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Conte a história por trás deste lançamento, compositores, produção e equipe técnica..."
                rows={3}
                className="rounded-2xl bg-zinc-950 border-zinc-800 text-white text-xs"
              />
            </div>

            <div className="space-y-2 sm:col-span-2">
              <Label className="text-xs font-bold text-zinc-300">Link para Player Embed Oficial (Spotify ou YouTube)</Label>
              <Input
                value={embedUrl}
                onChange={(e) => setEmbedUrl(e.target.value)}
                placeholder="https://open.spotify.com/track/... ou https://youtube.com/watch?v=..."
                className="rounded-2xl h-11 bg-zinc-950 border-zinc-800 text-white text-xs"
              />
              <p className="text-[11px] text-zinc-500">
                Se preenchido, exibe um player de áudio sob demanda na página do lançamento.
              </p>
            </div>
          </div>

          {/* Seção de Links de Streaming */}
          <div className="pt-2 flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <Label className="text-xs font-bold uppercase tracking-wider text-zinc-300">
                Plataformas de Streaming do Lançamento
              </Label>
              <div className="flex items-center gap-1">
                {(['spotify', 'apple_music', 'deezer', 'youtube_music', 'amazon_music', 'soundcloud'] as MusicPlatformId[]).map((pId) => {
                  const plat = MUSIC_PLATFORMS[pId];
                  return (
                    <button
                      key={pId}
                      type="button"
                      onClick={() => handleAddPlatformLink(pId)}
                      className="px-2 py-1 rounded-lg text-[10px] font-bold bg-zinc-800 hover:bg-zinc-700 text-zinc-300 transition"
                      title={`Adicionar ${plat.name}`}
                    >
                      + {plat.name}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="flex flex-col gap-2">
              {streamingLinks.map((link, idx) => {
                const plat = MUSIC_PLATFORMS[link.platform] || MUSIC_PLATFORMS.custom;

                return (
                  <div key={idx} className="flex items-center gap-2">
                    <span 
                      className="w-28 shrink-0 text-xs font-bold px-2.5 py-2 rounded-xl border text-center truncate"
                      style={{ 
                        color: plat.brandColor, 
                        borderColor: `${plat.brandColor}40`,
                        backgroundColor: `${plat.brandColor}12`
                      }}
                    >
                      {plat.name}
                    </span>

                    <Input
                      value={link.url}
                      onChange={(e) => handleUpdatePlatformLink(idx, e.target.value)}
                      placeholder={`https://${plat.domainUrlHint || 'exemplo.com'}/...`}
                      className="rounded-xl h-10 bg-zinc-950 border-zinc-800 text-white text-xs flex-1"
                    />

                    <button
                      type="button"
                      onClick={() => handleRemovePlatformLink(idx)}
                      className="p-2 rounded-xl text-zinc-500 hover:text-red-400 hover:bg-zinc-800 transition"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Destaque & Publicado */}
          <div className="flex flex-wrap items-center justify-between gap-4 pt-3 border-t border-zinc-800">
            <div className="flex items-center gap-3">
              <Switch
                checked={featured}
                onCheckedChange={setFeatured}
                id="featured-switch"
              />
              <label htmlFor="featured-switch" className="text-xs font-bold text-zinc-200 cursor-pointer">
                Destacar no topo da discografia
              </label>
            </div>

            <div className="flex items-center gap-3">
              <Switch
                checked={published}
                onCheckedChange={setPublished}
                id="published-switch"
              />
              <label htmlFor="published-switch" className="text-xs font-bold text-zinc-200 cursor-pointer">
                Publicado na página
              </label>
            </div>
          </div>

          {/* Ações do Formulário */}
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
              {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Salvar Lançamento'}
            </Button>
          </div>
        </form>
      ) : null}

      {/* Lista de Lançamentos Cadastrados */}
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
                <div className="flex items-center gap-3 min-w-0">
                  <img
                    src={release.cover_url}
                    alt={release.title}
                    className="w-14 h-14 rounded-xl object-cover shrink-0 bg-zinc-950 border border-zinc-800 shadow-md"
                  />
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <h3 className="text-sm font-bold text-white truncate">
                        {release.title}
                      </h3>
                      {release.featured && (
                        <span className="px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider bg-red-500/20 border border-red-500/40 text-red-400">
                          Destaque
                        </span>
                      )}
                      {!release.published && (
                        <span className="px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider bg-zinc-800 text-zinc-400">
                          Rascunho
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-zinc-400 mt-0.5 truncate">
                      {release.artist} • <strong className="uppercase text-[10px] text-zinc-500">{release.release_type}</strong>
                      {release.genre ? ` • ${release.genre}` : ''}
                    </p>
                    {smartLinkUrl && (
                      <p className="text-[11px] text-zinc-500 font-mono mt-1 truncate">
                        {smartLinkUrl}
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                  {smartLinkUrl && (
                    <a
                      href={smartLinkUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-semibold transition"
                      title="Abrir Smart Link"
                    >
                      <Radio className="w-3.5 h-3.5 text-red-400" />
                      <span className="hidden sm:inline">Smart Link</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  )}

                  <button
                    type="button"
                    onClick={() => handleOpenEdit(release)}
                    className="p-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white transition"
                    title="Editar lançamento"
                  >
                    <Pencil className="w-4 h-4" />
                  </button>

                  <button
                    type="button"
                    disabled={deletingId === release.id}
                    onClick={() => handleDelete(release.id)}
                    className="p-2 rounded-xl bg-zinc-800 hover:bg-red-500/20 text-zinc-400 hover:text-red-400 transition"
                    title="Excluir lançamento"
                  >
                    {deletingId === release.id ? (
                      <Loader2 className="w-4 h-4 animate-spin text-red-400" />
                    ) : (
                      <Trash2 className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>
            );
          })
        ) : (
          <div className="p-12 text-center rounded-3xl bg-zinc-900/40 border border-dashed border-zinc-800 flex flex-col items-center gap-3">
            <Disc className="w-10 h-10 text-zinc-600 animate-spin-slow" />
            <h3 className="text-sm font-bold text-white">Nenhum lançamento cadastrado</h3>
            <p className="text-xs text-zinc-400 max-w-sm">
              Cadastre suas faixas, singles ou álbuns com links para o Spotify, Apple Music e YouTube para compartilhar com seus fãs.
            </p>
            <Button
              type="button"
              onClick={handleOpenNew}
              className="mt-2 rounded-2xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs uppercase tracking-wider"
            >
              Cadastrar Primeiro Lançamento
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
