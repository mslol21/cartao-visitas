"use client";

import React, { useState } from 'react';
import { Video, Play, X, ExternalLink } from 'lucide-react';
import type { MusicVideo, MusicVideoCategory } from '@/types/music';
import { trackMusicClickAction } from '@/app/actions/music-pro';

interface MusicVideosProps {
  videos: MusicVideo[];
  profileId?: string;
  primaryColor?: string;
  secondaryColor?: string;
}

const CATEGORY_LABELS: Record<string, string> = {
  videoclipe: 'Videoclipes',
  ao_vivo: 'Ao Vivo',
  casamento: 'Casamentos',
  corporativo: 'Corporativos',
  show: 'Shows',
  ensaio: 'Ensaios',
  promocional: 'Promocionais'
};

function getYouTubeEmbedUrl(url: string): string | null {
  const match = url.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([\w-]{11})/);
  return match ? `https://www.youtube-nocookie.com/embed/${match[1]}?autoplay=1` : null;
}

function getYouTubeThumbnail(url: string): string | null {
  const match = url.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([\w-]{11})/);
  return match ? `https://img.youtube.com/vi/${match[1]}/hqdefault.jpg` : null;
}

export function MusicVideos({
  videos,
  profileId,
  primaryColor = '#ef4444',
  secondaryColor = '#f43f5e'
}: MusicVideosProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('todos');
  const [activeVideo, setActiveVideo] = useState<MusicVideo | null>(null);

  const publishedVideos = videos.filter(v => v.published !== false);

  if (publishedVideos.length === 0) return null;

  const categories = ['todos', ...Array.from(new Set(publishedVideos.map(v => v.category)))];

  const filteredVideos = selectedCategory === 'todos' 
    ? publishedVideos 
    : publishedVideos.filter(v => v.category === selectedCategory);

  const handleOpenVideo = (video: MusicVideo) => {
    setActiveVideo(video);
    if (profileId) {
      trackMusicClickAction(profileId, 'click_video_play', {
        video_id: video.id,
        title: video.title,
        category: video.category
      }).catch(() => {});
    }
  };

  return (
    <section className="w-full flex flex-col gap-4">
      {/* Cabeçalho */}
      <div className="flex items-center justify-between px-1">
        <div className="flex items-center gap-2">
          <div 
            className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0 border shadow-sm"
            style={{ 
              backgroundColor: `${primaryColor}15`,
              borderColor: `${primaryColor}40`,
              color: primaryColor
            }}
          >
            <Video className="w-4 h-4" />
          </div>
          <h2 className="text-lg font-black tracking-tight text-white uppercase">
            Vídeos & Apresentações
          </h2>
        </div>

        <span className="text-xs font-semibold text-zinc-400">
          {publishedVideos.length} {publishedVideos.length === 1 ? 'vídeo' : 'vídeos'}
        </span>
      </div>

      {/* Filtros de Categoria */}
      {categories.length > 2 && (
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scroll-hide">
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold shrink-0 transition ${
                selectedCategory === cat 
                  ? 'bg-zinc-100 text-zinc-950 font-bold shadow-md' 
                  : 'bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white'
              }`}
            >
              {cat === 'todos' ? 'Todos' : CATEGORY_LABELS[cat] || cat}
            </button>
          ))}
        </div>
      )}

      {/* Galeria de Vídeos */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
        {filteredVideos.map((video) => {
          const thumbnail = video.thumbnail_url || getYouTubeThumbnail(video.video_url) || 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&q=80&w=640&h=360';

          return (
            <div
              key={video.id}
              onClick={() => handleOpenVideo(video)}
              className="group relative cursor-pointer overflow-hidden rounded-2xl bg-zinc-950 border border-zinc-850 hover:border-zinc-700 transition-all duration-300 shadow-xl"
            >
              {/* Thumbnail 16:9 */}
              <div className="relative aspect-video w-full overflow-hidden bg-zinc-900">
                <img
                  src={thumbnail}
                  alt={video.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 opacity-85"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                {/* Botão de Play Central */}
                <div 
                  className="absolute inset-0 flex items-center justify-center transition-transform duration-300 group-hover:scale-110"
                >
                  <div 
                    className="w-12 h-12 rounded-full flex items-center justify-center text-white shadow-2xl backdrop-blur-md"
                    style={{ backgroundColor: `${primaryColor}cc` }}
                  >
                    <Play className="w-5 h-5 fill-current ml-0.5" />
                  </div>
                </div>

                {/* Badges de Categoria e Duração */}
                <div className="absolute bottom-2 left-2 flex items-center gap-1.5">
                  <span className="px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider bg-black/80 text-white backdrop-blur-md">
                    {CATEGORY_LABELS[video.category] || video.category}
                  </span>
                  {video.duration && (
                    <span className="px-1.5 py-0.5 rounded-md text-[10px] font-semibold bg-zinc-900/90 text-zinc-300 backdrop-blur-md">
                      {video.duration}
                    </span>
                  )}
                </div>
              </div>

              {/* Título e Descrição */}
              <div className="p-3">
                <h3 className="text-sm font-bold text-white group-hover:text-zinc-200 truncate">
                  {video.title}
                </h3>
                {video.description && (
                  <p className="text-xs text-zinc-400 mt-1 line-clamp-1">
                    {video.description}
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal do Player de Vídeo */}
      {activeVideo && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4 animate-in fade-in">
          <div className="relative w-full max-w-3xl overflow-hidden rounded-2xl bg-zinc-950 border border-zinc-800 shadow-2xl">
            {/* Header do Modal */}
            <div className="flex items-center justify-between p-3.5 border-b border-zinc-800">
              <h3 className="text-sm font-bold text-white truncate max-w-md">
                {activeVideo.title}
              </h3>
              <button
                type="button"
                onClick={() => setActiveVideo(null)}
                className="p-1 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition"
                title="Fechar vídeo"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Video Player */}
            <div className="relative aspect-video w-full bg-black">
              {getYouTubeEmbedUrl(activeVideo.video_url) ? (
                <iframe
                  src={getYouTubeEmbedUrl(activeVideo.video_url)!}
                  title={activeVideo.title}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="w-full h-full border-0"
                />
              ) : (
                <video
                  src={activeVideo.video_url}
                  controls
                  autoPlay
                  className="w-full h-full object-contain"
                />
              )}
            </div>

            {/* Rodapé do Modal */}
            {activeVideo.description && (
              <div className="p-3.5 text-xs text-zinc-300 border-t border-zinc-800/80">
                <p>{activeVideo.description}</p>
              </div>
            )}
          </div>
        </div>
      )}
    </section>
  );
}
