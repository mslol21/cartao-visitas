"use client";

import React from 'react';
import { Calendar, MapPin, Ticket, Lock, ExternalLink } from 'lucide-react';
import type { MusicEvent } from '@/types/music';

interface MusicTourProps {
  events: MusicEvent[];
  primaryColor?: string;
  secondaryColor?: string;
}

const MONTH_NAMES = [
  'JAN', 'FEV', 'MAR', 'ABR', 'MAI', 'JUN',
  'JUL', 'AGO', 'SET', 'OUT', 'NOV', 'DEZ'
];

export function MusicTour({
  events,
  primaryColor = '#ef4444',
  secondaryColor = '#f43f5e'
}: MusicTourProps) {
  const publishedEvents = events.filter(e => e.published !== false);

  if (publishedEvents.length === 0) return null;

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
            <Calendar className="w-4 h-4" />
          </div>
          <h2 className="text-lg font-black tracking-tight text-white uppercase">
            Agenda de Shows & Eventos
          </h2>
        </div>

        <span className="text-xs font-semibold text-zinc-400">
          {publishedEvents.length} {publishedEvents.length === 1 ? 'data' : 'datas'}
        </span>
      </div>

      {/* Lista de Apresentações */}
      <div className="flex flex-col gap-3">
        {publishedEvents.map((event) => {
          const dateObj = new Date(event.date + 'T12:00:00');
          const day = dateObj.getDate().toString().padStart(2, '0');
          const month = MONTH_NAMES[dateObj.getMonth()] || 'MES';

          return (
            <div
              key={event.id}
              className="flex items-center justify-between p-3.5 rounded-2xl bg-zinc-950 border border-zinc-850 hover:border-zinc-700 transition gap-3 shadow-lg"
            >
              {/* Badge da Data */}
              <div 
                className="flex flex-col items-center justify-center w-14 h-14 rounded-xl border shrink-0 text-center shadow-md"
                style={{ 
                  backgroundColor: `${primaryColor}12`,
                  borderColor: `${primaryColor}40`
                }}
              >
                <span className="text-[11px] font-black uppercase tracking-wider" style={{ color: primaryColor }}>
                  {month}
                </span>
                <span className="text-lg font-black text-white leading-tight">
                  {day}
                </span>
              </div>

              {/* Informações do Local e Horário */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-bold text-white truncate">
                    {event.is_private ? 'Evento Privado' : event.title}
                  </h3>
                  {event.is_private && (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-semibold bg-zinc-900 border border-zinc-800 text-zinc-400 shrink-0">
                      <Lock className="w-2.5 h-2.5" />
                      <span>Privado</span>
                    </span>
                  )}
                </div>

                <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5 text-xs text-zinc-400 mt-1">
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-zinc-500 shrink-0" />
                    <span>{event.is_private ? event.city : `${event.venue}, ${event.city}`}</span>
                  </span>
                  {event.time && <span>• {event.time}</span>}
                </div>
              </div>

              {/* Ação: Ingressos ou Info */}
              {!event.is_private && event.ticket_url && (
                <a
                  href={event.ticket_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 px-3 py-2 rounded-xl text-xs font-bold text-white shadow-md transition active:scale-95 shrink-0"
                  style={{ backgroundColor: primaryColor }}
                >
                  <Ticket className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Ingressos</span>
                </a>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}
