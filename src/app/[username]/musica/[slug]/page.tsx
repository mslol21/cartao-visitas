import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getPublicProfile } from '@/lib/seo/public-profile';
import { parseMusicProfileData } from '@/utils/music-utils';
import { MUSIC_PLATFORMS, MUSIC_TEMPLATES } from '@/config/music-constants';
import { MusicAudioEmbed } from '@/components/music/MusicAudioEmbed';
import { StructuredData } from '@/components/seo/StructuredData';
import { 
  ArrowLeft, 
  Share2, 
  ExternalLink, 
  Sparkles, 
  Disc, 
  Radio, 
  Check, 
  Copy,
  Calendar,
  Music2
} from 'lucide-react';
import { SITE_URL } from '@/lib/seo/site';
import { SmartLinkClientShare } from './SmartLinkClientShare';

interface Props {
  params: Promise<{
    username: string;
    slug: string;
  }>;
}

export const revalidate = 0;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { username, slug } = await params;
  const profile = await getPublicProfile(username);
  if (!profile) return {};

  const musicData = parseMusicProfileData(profile);
  const release = musicData.releases.find(r => r.slug === slug);
  if (!release) return {};

  const title = `${release.title} - ${release.artist} | Smart Link Oficial Konnexy`;
  const description = release.description || `Ouça ${release.title} de ${release.artist} no Spotify, Apple Music, Deezer, YouTube e nas principais plataformas de streaming.`;
  const pagePath = `/${encodeURIComponent(username)}/musica/${encodeURIComponent(slug)}`;

  return {
    title,
    description,
    alternates: {
      canonical: `${SITE_URL}${pagePath}`
    },
    openGraph: {
      title,
      description,
      url: `${SITE_URL}${pagePath}`,
      siteName: 'Konnexy Music Pro',
      type: 'music.song',
      images: [
        {
          url: release.cover_url,
          width: 1080,
          height: 1080,
          alt: `${release.title} - ${release.artist}`
        }
      ]
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [release.cover_url]
    }
  };
}

export default async function MusicSmartLinkPage({ params }: Props) {
  const { username, slug } = await params;
  const profile = await getPublicProfile(username);

  if (!profile || profile.ativo === false) notFound();

  const musicData = parseMusicProfileData(profile);
  const release = musicData.releases.find(r => r.slug === slug);

  if (!release || release.published === false) notFound();

  const templateId = musicData.config.template || 'stage';
  const templateMeta = MUSIC_TEMPLATES[templateId] || MUSIC_TEMPLATES.stage;
  const primaryColor = musicData.config.primary_color || templateMeta.primaryColor;
  const secondaryColor = musicData.config.secondary_color || templateMeta.secondaryColor;

  const publicUrl = `${SITE_URL}/${encodeURIComponent(username)}/musica/${encodeURIComponent(slug)}`;
  const artistProfileUrl = `/${encodeURIComponent(username)}`;

  // Schema.org MusicRecording / MusicAlbum
  const schemaData = {
    '@context': 'https://schema.org',
    '@type': release.release_type === 'album' || release.release_type === 'ep' ? 'MusicAlbum' : 'MusicRecording',
    name: release.title,
    byArtist: {
      '@type': 'MusicGroup',
      name: release.artist
    },
    image: release.cover_url,
    genre: release.genre || 'Music',
    datePublished: release.release_date,
    description: release.description,
    url: publicUrl
  };

  const hasAudioPreview = Boolean(
    release.embed_url || 
    release.streaming_links.some(l => l.platform === 'spotify' || l.platform === 'youtube')
  );

  const previewUrl = release.embed_url || 
    release.streaming_links.find(l => l.platform === 'spotify')?.url || 
    release.streaming_links.find(l => l.platform === 'youtube')?.url;

  return (
    <div className="relative min-h-screen w-full bg-zinc-950 text-zinc-100 flex flex-col justify-between selection:bg-amber-500/30 selection:text-amber-200 overflow-x-hidden">
      <StructuredData data={schemaData} />

      {/* Atmosfera de fundo com arte da capa em blur */}
      <div aria-hidden="true" className="fixed inset-0 pointer-events-none z-0 overflow-hidden bg-zinc-950">
        <img
          src={release.cover_url}
          alt=""
          className="absolute inset-0 h-full w-full object-cover scale-125 opacity-35 blur-3xl"
        />
        <div 
          className="absolute inset-0 opacity-30"
          style={{
            background: `radial-gradient(circle at 50% 15%, ${primaryColor}40 0%, transparent 60%)`
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-zinc-950/80 to-zinc-950" />
      </div>

      {/* Conteúdo Central */}
      <main className="relative z-10 w-full max-w-md mx-auto px-4 py-8 flex flex-col items-center gap-6">
        {/* Navegação de Topo */}
        <div className="w-full flex items-center justify-between">
          <Link
            href={artistProfileUrl}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-black/60 hover:bg-black/90 border border-zinc-800 text-xs font-semibold text-zinc-300 hover:text-white backdrop-blur-md transition active:scale-95 shadow-md"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Perfil do Artista</span>
          </Link>

          <SmartLinkClientShare
            title={`${release.title} - ${release.artist}`}
            text={`Ouça ${release.title} de ${release.artist} em todas as plataformas!`}
            url={publicUrl}
          />
        </div>

        {/* Capa Principal com Sombra e Brilho */}
        <div className="relative w-64 h-64 sm:w-72 sm:h-72 rounded-3xl overflow-hidden shadow-2xl border border-zinc-800 group">
          <img
            src={release.cover_url}
            alt={release.title}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
        </div>

        {/* Título e Metadados do Lançamento */}
        <div className="flex flex-col items-center text-center gap-1.5 max-w-sm">
          <span 
            className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-widest border"
            style={{
              backgroundColor: `${primaryColor}15`,
              borderColor: `${primaryColor}40`,
              color: primaryColor
            }}
          >
            {release.release_type.toUpperCase()}
          </span>

          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight leading-tight mt-1">
            {release.title}
          </h1>

          <p className="text-sm font-semibold text-zinc-300">
            {release.artist}
          </p>

          <div className="flex flex-wrap items-center justify-center gap-2 text-xs text-zinc-500 mt-0.5">
            {release.genre && <span>{release.genre}</span>}
            {release.genre && release.release_date && <span>•</span>}
            {release.release_date && (
              <span className="flex items-center gap-1">
                <Calendar className="w-3 h-3" />
                <span>{new Date(release.release_date + 'T12:00:00').toLocaleDateString('pt-BR')}</span>
              </span>
            )}
          </div>

          {release.description && (
            <p className="text-xs text-zinc-400 mt-2 leading-relaxed whitespace-pre-line">
              {release.description}
            </p>
          )}
        </div>

        {/* Player Embed se disponível */}
        {hasAudioPreview && previewUrl && (
          <div className="w-full">
            <MusicAudioEmbed
              url={previewUrl}
              title={release.title}
              coverUrl={release.cover_url}
              artist={release.artist}
              primaryColor={primaryColor}
            />
          </div>
        )}

        {/* Botões de Plataformas de Streaming */}
        <div className="w-full flex flex-col gap-2.5">
          <div className="flex items-center justify-between px-1">
            <span className="text-xs font-bold uppercase tracking-wider text-zinc-400">
              Escolha sua plataforma
            </span>
            <span className="text-[11px] text-zinc-500">
              {release.streaming_links.length} disponíveis
            </span>
          </div>

          {release.streaming_links.length > 0 ? (
            release.streaming_links.map((link, index) => {
              const platDef = MUSIC_PLATFORMS[link.platform] || MUSIC_PLATFORMS.custom;

              return (
                <a
                  key={index}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center justify-between p-3.5 rounded-2xl bg-zinc-950/90 border border-zinc-800/90 hover:border-zinc-700 transition-all duration-300 active:scale-[0.98] shadow-lg"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div 
                      className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border"
                      style={{ 
                        backgroundColor: `${platDef.brandColor}18`,
                        borderColor: `${platDef.brandColor}40`,
                        color: platDef.brandColor
                      }}
                    >
                      <Radio className="w-5 h-5" />
                    </div>

                    <div className="min-w-0">
                      <p className="text-sm font-bold text-white group-hover:text-zinc-200 truncate">
                        {link.label || platDef.name}
                      </p>
                      <p className="text-[11px] text-zinc-500 truncate">
                        Ouvir no {platDef.name}
                      </p>
                    </div>
                  </div>

                  <div 
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold text-white shadow-md transition group-hover:scale-105 shrink-0"
                    style={{ backgroundColor: platDef.brandColor }}
                  >
                    <span>Play</span>
                    <ExternalLink className="w-3 h-3" />
                  </div>
                </a>
              );
            })
          ) : (
            <div className="p-6 rounded-2xl bg-zinc-900/60 border border-zinc-800 text-center text-xs text-zinc-400">
              Links de streaming em atualização. Visite o perfil do artista para novidades.
            </div>
          )}
        </div>

        {/* Retorno ao Perfil do Artista */}
        <div className="w-full pt-4 border-t border-zinc-850 flex flex-col items-center gap-3 text-center">
          <Link
            href={artistProfileUrl}
            className="w-full py-3 px-4 rounded-xl bg-zinc-900 hover:bg-zinc-850 border border-zinc-800 text-xs font-bold text-zinc-200 hover:text-white transition active:scale-98"
          >
            Ver perfil completo & outros lançamentos de {release.artist}
          </Link>

          <p className="text-[11px] text-zinc-500">
            Smart Link oficial powered by{' '}
            <Link href="/" className="text-zinc-400 font-semibold hover:underline">
              Konnexy Music Pro
            </Link>
          </p>
        </div>
      </main>
    </div>
  );
}
