"use client";

import React, { useState } from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2, Check, Music, User, MapPin, Image as ImageIcon, Sparkles } from 'lucide-react';
import { toast } from 'sonner';
import type { Profile } from '@/types/profile';
import type { MusicProfileData, MusicProfileConfig } from '@/types/music';
import { MUSIC_PROFESSIONS, MusicProfession } from '@/types/music';
import { saveMusicConfigAction } from '@/app/actions/music-pro';
import { updateOwnerProfileNeon } from '@/app/actions/neon-profile';

interface MusicProfileTabProps {
  profile: Profile;
  musicData: MusicProfileData;
  onRefresh: () => void;
  accessToken?: string;
}

const PROFESSION_LABELS: Record<string, string> = {
  musico: 'Músico(a)',
  cantor: 'Cantor(a)',
  compositor: 'Compositor(a)',
  banda: 'Banda',
  grupo_musical: 'Grupo Musical',
  dj: 'DJ',
  instrumentista: 'Instrumentista',
  produtor_musical: 'Produtor(a) Musical'
};

export function MusicProfileTab({
  profile,
  musicData,
  onRefresh,
  accessToken
}: MusicProfileTabProps) {
  const [saving, setSaving] = useState(false);

  const [stageName, setStageName] = useState(musicData.config.stage_name || profile.business_name || profile.name || '');
  const [profession, setProfession] = useState(profile.profession || 'musico');
  const [musicalGenre, setMusicalGenre] = useState(musicData.config.musical_genre || (profile.custom_fields as any)?.estilo_musical || '');
  const [city, setCity] = useState(musicData.config.city || profile.city || '');
  const [region, setRegion] = useState(musicData.config.performance_region || profile.area_atendimento || '');
  const [bio, setBio] = useState(musicData.config.bio_short || profile.bio_profissional || profile.subtitle || '');
  const [customCoverUrl, setCustomCoverUrl] = useState(musicData.config.custom_cover_url || profile.background_video_url || '');
  const [customAvatarUrl, setCustomAvatarUrl] = useState(musicData.config.custom_avatar_url || profile.photo_url || '');
  const [coverFraming, setCoverFraming] = useState<'center' | 'top' | 'bottom'>(musicData.config.cover_framing || 'center');
  const [avatarFraming, setAvatarFraming] = useState<'center' | 'top' | 'bottom'>(musicData.config.avatar_framing || 'center');
  const [spotifyLink, setSpotifyLink] = useState((profile.custom_fields as any)?.spotify_link || '');
  const [youtubeLink, setYoutubeLink] = useState((profile.custom_fields as any)?.youtube_link || profile.youtube || '');
  const [soundcloudLink, setSoundcloudLink] = useState((profile.custom_fields as any)?.soundcloud_link || '');
  const [instagram, setInstagram] = useState(profile.instagram || '');
  const [tiktok, setTiktok] = useState(profile.tiktok || '');
  const [whatsapp, setWhatsapp] = useState(profile.whatsapp || '');

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      // 1. Atualizar config no Music Pro
      const configUpdate: Partial<MusicProfileConfig> = {
        stage_name: stageName,
        musical_genre: musicalGenre,
        city,
        performance_region: region,
        bio_short: bio,
        custom_cover_url: customCoverUrl,
        custom_avatar_url: customAvatarUrl,
        cover_framing: coverFraming,
        avatar_framing: avatarFraming
      };

      const musicRes = await saveMusicConfigAction(configUpdate, accessToken);
      if (!musicRes.success) throw new Error(musicRes.error);

      // 2. Atualizar perfil base para manter paridade no banco
      const profileUpdate: any = {
        business_name: stageName,
        profession,
        category: profession,
        city,
        area_atendimento: region,
        bio_profissional: bio,
        photo_url: customAvatarUrl || profile.photo_url,
        background_video_url: customCoverUrl || profile.background_video_url,
        instagram,
        tiktok,
        whatsapp,
        custom_fields: {
          ...(profile.custom_fields || {}),
          estilo_musical: musicalGenre,
          spotify_link: spotifyLink,
          youtube_link: youtubeLink,
          soundcloud_link: soundcloudLink
        }
      };

      await updateOwnerProfileNeon(profileUpdate, accessToken);

      toast.success('Perfil artístico atualizado com sucesso!');
      onRefresh();
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || 'Erro ao salvar perfil.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSave} className="flex flex-col gap-6">
      {/* Cabeçalho */}
      <div className="flex flex-col gap-1">
        <h2 className="text-xl font-black text-white tracking-tight">
          Dados do Artista & Identidade Visual
        </h2>
        <p className="text-xs text-zinc-400">
          Personalize as informações públicas que aparecem no cabeçalho do seu portfólio.
        </p>
      </div>

      {/* Grid de Campos Básicos */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label className="text-xs font-bold uppercase tracking-wider text-zinc-300">
            Nome Artístico / Nome da Banda *
          </Label>
          <Input
            value={stageName}
            onChange={(e) => setStageName(e.target.value)}
            placeholder="Ex: Alok, Mariana Rios, Banda Sunset"
            required
            className="rounded-2xl h-12 bg-zinc-900 border-zinc-800 text-white"
          />
        </div>

        <div className="space-y-2">
          <Label className="text-xs font-bold uppercase tracking-wider text-zinc-300">
            Categoria Musical *
          </Label>
          <Select 
            value={profession} 
            onValueChange={(val) => setProfession(val as any)}
          >
            <SelectTrigger className="rounded-2xl h-12 bg-zinc-900 border-zinc-800 text-white">
              <SelectValue placeholder="Selecione" />
            </SelectTrigger>
            <SelectContent className="rounded-2xl bg-zinc-900 border-zinc-800 text-white">
              {MUSIC_PROFESSIONS.map((p) => (
                <SelectItem key={p} value={p}>
                  {PROFESSION_LABELS[p] || p}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label className="text-xs font-bold uppercase tracking-wider text-zinc-300">
            Gênero / Estilo Musical Principal
          </Label>
          <Input
            value={musicalGenre}
            onChange={(e) => setMusicalGenre(e.target.value)}
            placeholder="Ex: MPB, Sertanejo, Rock, Eletrônica, Jazz"
            className="rounded-2xl h-12 bg-zinc-900 border-zinc-800 text-white"
          />
        </div>

        <div className="space-y-2">
          <Label className="text-xs font-bold uppercase tracking-wider text-zinc-300">
            WhatsApp para Contratação
          </Label>
          <Input
            value={whatsapp}
            onChange={(e) => setWhatsapp(e.target.value)}
            placeholder="Ex: (11) 99999-9999"
            className="rounded-2xl h-12 bg-zinc-900 border-zinc-800 text-white"
          />
        </div>

        <div className="space-y-2">
          <Label className="text-xs font-bold uppercase tracking-wider text-zinc-300">
            Cidade Base
          </Label>
          <Input
            value={city}
            onChange={(e) => setCity(e.target.value)}
            placeholder="Ex: São Paulo, SP"
            className="rounded-2xl h-12 bg-zinc-900 border-zinc-800 text-white"
          />
        </div>

        <div className="space-y-2">
          <Label className="text-xs font-bold uppercase tracking-wider text-zinc-300">
            Região de Atuação para Shows
          </Label>
          <Input
            value={region}
            onChange={(e) => setRegion(e.target.value)}
            placeholder="Ex: Grande SP e Litoral, Atende todo o Brasil"
            className="rounded-2xl h-12 bg-zinc-900 border-zinc-800 text-white"
          />
        </div>
      </div>

      {/* Biografia Resumida */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label className="text-xs font-bold uppercase tracking-wider text-zinc-300">
            Biografia Curta
          </Label>
          <span className="text-[11px] text-zinc-500">
            {bio.length} caracteres
          </span>
        </div>
        <Textarea
          value={bio}
          onChange={(e) => setBio(e.target.value)}
          placeholder="Conte um pouco sobre sua trajetória, referências musicais e diferenciais das suas apresentações..."
          rows={4}
          className="rounded-2xl bg-zinc-900 border-zinc-800 text-white text-xs leading-relaxed"
        />
      </div>

      {/* Fotos e Enquadramentos */}
      <div className="rounded-3xl bg-zinc-900/60 border border-zinc-800 p-5 sm:p-6 flex flex-col gap-4">
        <h3 className="text-sm font-black text-white uppercase tracking-wider flex items-center gap-2">
          <ImageIcon className="w-4 h-4 text-red-400" />
          <span>Fotografia & Imagem de Capa</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label className="text-xs font-bold text-zinc-300">
              URL da Imagem de Capa (Banner 16:9)
            </Label>
            <Input
              value={customCoverUrl}
              onChange={(e) => setCustomCoverUrl(e.target.value)}
              placeholder="https://exemplo.com/minha-capa.jpg"
              className="rounded-2xl h-11 bg-zinc-900 border-zinc-800 text-white text-xs"
            />
            <div className="flex items-center gap-2 pt-1">
              <span className="text-[11px] text-zinc-400">Enquadramento da Capa:</span>
              <div className="flex gap-1">
                {(['top', 'center', 'bottom'] as const).map((pos) => (
                  <button
                    key={pos}
                    type="button"
                    onClick={() => setCoverFraming(pos)}
                    className={`px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase transition ${
                      coverFraming === pos ? 'bg-red-500 text-white' : 'bg-zinc-800 text-zinc-400 hover:text-white'
                    }`}
                  >
                    {pos === 'top' ? 'Topo' : pos === 'center' ? 'Centro' : 'Base'}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-xs font-bold text-zinc-300">
              URL da Foto / Avatar do Artista
            </Label>
            <Input
              value={customAvatarUrl}
              onChange={(e) => setCustomAvatarUrl(e.target.value)}
              placeholder="https://exemplo.com/meu-avatar.jpg"
              className="rounded-2xl h-11 bg-zinc-900 border-zinc-800 text-white text-xs"
            />
            <div className="flex items-center gap-2 pt-1">
              <span className="text-[11px] text-zinc-400">Enquadramento do Avatar:</span>
              <div className="flex gap-1">
                {(['top', 'center', 'bottom'] as const).map((pos) => (
                  <button
                    key={pos}
                    type="button"
                    onClick={() => setAvatarFraming(pos)}
                    className={`px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase transition ${
                      avatarFraming === pos ? 'bg-red-500 text-white' : 'bg-zinc-800 text-zinc-400 hover:text-white'
                    }`}
                  >
                    {pos === 'top' ? 'Topo' : pos === 'center' ? 'Centro' : 'Base'}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Redes Sociais e Streaming */}
      <div className="rounded-3xl bg-zinc-900/60 border border-zinc-800 p-5 sm:p-6 flex flex-col gap-4">
        <h3 className="text-sm font-black text-white uppercase tracking-wider flex items-center gap-2">
          <Music className="w-4 h-4 text-red-400" />
          <span>Links Rápidos de Streaming & Redes</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label className="text-xs font-bold text-zinc-300">Link do Spotify (Perfil Artista)</Label>
            <Input
              value={spotifyLink}
              onChange={(e) => setSpotifyLink(e.target.value)}
              placeholder="https://open.spotify.com/artist/..."
              className="rounded-2xl h-11 bg-zinc-900 border-zinc-800 text-white text-xs"
            />
          </div>

          <div className="space-y-2">
            <Label className="text-xs font-bold text-zinc-300">Canal do YouTube</Label>
            <Input
              value={youtubeLink}
              onChange={(e) => setYoutubeLink(e.target.value)}
              placeholder="https://youtube.com/@meucanal"
              className="rounded-2xl h-11 bg-zinc-900 border-zinc-800 text-white text-xs"
            />
          </div>

          <div className="space-y-2">
            <Label className="text-xs font-bold text-zinc-300">SoundCloud</Label>
            <Input
              value={soundcloudLink}
              onChange={(e) => setSoundcloudLink(e.target.value)}
              placeholder="https://soundcloud.com/meuperfil"
              className="rounded-2xl h-11 bg-zinc-900 border-zinc-800 text-white text-xs"
            />
          </div>

          <div className="space-y-2">
            <Label className="text-xs font-bold text-zinc-300">Instagram (@usuario)</Label>
            <Input
              value={instagram}
              onChange={(e) => setInstagram(e.target.value)}
              placeholder="@meu_perfil_artistico"
              className="rounded-2xl h-11 bg-zinc-900 border-zinc-800 text-white text-xs"
            />
          </div>

          <div className="space-y-2">
            <Label className="text-xs font-bold text-zinc-300">TikTok (@usuario)</Label>
            <Input
              value={tiktok}
              onChange={(e) => setTiktok(e.target.value)}
              placeholder="@meu_tiktok"
              className="rounded-2xl h-11 bg-zinc-900 border-zinc-800 text-white text-xs"
            />
          </div>
        </div>
      </div>

      {/* Botão de Salvar */}
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
              <span>Salvar Perfil Musical</span>
            </span>
          )}
        </Button>
      </div>
    </form>
  );
}
