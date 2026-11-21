"use client";

import React, { useState, useMemo } from 'react';
import { ListMusic, Search, Music2, MessageCircle } from 'lucide-react';
import type { MusicRepertoireItem } from '@/types/music';

interface MusicRepertoireProps {
  repertoire: MusicRepertoireItem[];
  artistName?: string;
  whatsapp?: string;
  primaryColor?: string;
  secondaryColor?: string;
}

const CATEGORY_NAMES: Record<string, string> = {
  todos: 'Todas',
  casamentos: 'Casamentos',
  cerimonias: 'Cerimônias',
  mpb: 'MPB',
  pop: 'Pop',
  rock: 'Rock',
  jazz: 'Jazz',
  instrumental: 'Instrumental',
  corporativo: 'Corporativo',
  geral: 'Geral'
};

export function MusicRepertoire({
  repertoire,
  artistName,
  whatsapp,
  primaryColor = '#ef4444',
  secondaryColor = '#f43f5e'
}: MusicRepertoireProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('todos');

  const cleanPhone = (whatsapp || '').replace(/\D/g, '');

  if (repertoire.length === 0) return null;

  const categories = ['todos', ...Array.from(new Set(repertoire.map(r => r.category)))];

  const filteredItems = useMemo(() => {
    return repertoire.filter((item) => {
      const matchesCategory = activeCategory === 'todos' || item.category === activeCategory;
      const q = searchQuery.toLowerCase().trim();
      const matchesQuery = !q || 
        item.title.toLowerCase().includes(q) || 
        (item.original_artist && item.original_artist.toLowerCase().includes(q)) ||
        (item.genre && item.genre.toLowerCase().includes(q));

      return matchesCategory && matchesQuery;
    });
  }, [repertoire, activeCategory, searchQuery]);

  const handleRequestSong = (songTitle: string) => {
    if (!cleanPhone) return;
    const msg = `Olá, ${artistName || ''}! Gostaria de saber se você pode incluir a música "${songTitle}" no repertório do meu evento.`;
    window.open(`https://wa.me/${cleanPhone}?text=${encodeURIComponent(msg)}`, '_blank', 'noopener,noreferrer');
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
            <ListMusic className="w-4 h-4" />
          </div>
          <h2 className="text-lg font-black tracking-tight text-white uppercase">
            Repertório para Eventos
          </h2>
        </div>

        <span className="text-xs font-semibold text-zinc-400">
          {repertoire.length} canções
        </span>
      </div>

      {/* Caixa de Busca */}
      <div className="relative w-full">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Buscar canção, artista ou estilo..."
          className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-zinc-600 transition"
        />
        {searchQuery && (
          <button
            type="button"
            onClick={() => setSearchQuery('')}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-zinc-400 hover:text-white"
          >
            Limpar
          </button>
        )}
      </div>

      {/* Categorias */}
      {categories.length > 2 && (
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scroll-hide">
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setActiveCategory(cat)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold shrink-0 transition ${
                activeCategory === cat 
                  ? 'bg-zinc-100 text-zinc-950 font-bold shadow-md' 
                  : 'bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white'
              }`}
            >
              {CATEGORY_NAMES[cat] || cat}
            </button>
          ))}
        </div>
      )}

      {/* Lista de Músicas */}
      <div className="overflow-hidden rounded-2xl bg-zinc-950 border border-zinc-850 shadow-xl divide-y divide-zinc-850">
        {filteredItems.length > 0 ? (
          filteredItems.map((item, index) => (
            <div
              key={item.id}
              className="flex items-center justify-between p-3.5 hover:bg-zinc-900/60 transition gap-3"
            >
              <div className="flex items-center gap-3 min-w-0">
                <span className="text-xs font-mono text-zinc-600 w-5 shrink-0 text-center">
                  {index + 1}
                </span>
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-zinc-100 truncate">
                    {item.title}
                  </p>
                  <p className="text-xs text-zinc-400 truncate">
                    {item.original_artist ? item.original_artist : 'Versão Exclusiva'}
                    {item.genre ? ` • ${item.genre}` : ''}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <span className="hidden sm:inline-block px-2 py-0.5 rounded-md text-[10px] font-medium bg-zinc-900 border border-zinc-800 text-zinc-400">
                  {CATEGORY_NAMES[item.category] || item.category}
                </span>

                {cleanPhone && (
                  <button
                    type="button"
                    onClick={() => handleRequestSong(item.title)}
                    className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition"
                    title={`Solicitar "${item.title}" no seu evento`}
                  >
                    <MessageCircle className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          ))
        ) : (
          <div className="p-8 text-center text-xs text-zinc-500">
            Nenhuma música encontrada para "{searchQuery}".
          </div>
        )}
      </div>

      {/* Rodapé interativo do repertório */}
      {cleanPhone && (
        <div className="flex items-center justify-between p-3 rounded-xl bg-zinc-900/70 border border-zinc-800 text-xs">
          <span className="text-zinc-300">Tem uma música especial que deseja no repertório?</span>
          <button
            type="button"
            onClick={() => {
              const msg = `Olá, ${artistName || ''}! Tenho interesse em contratar sua apresentação e gostaria de sugerir músicas para o repertório.`;
              window.open(`https://wa.me/${cleanPhone}?text=${encodeURIComponent(msg)}`, '_blank', 'noopener,noreferrer');
            }}
            className="font-bold underline hover:opacity-80 shrink-0 ml-2"
            style={{ color: primaryColor }}
          >
            Sugerir Canção
          </button>
        </div>
      )}
    </section>
  );
}
