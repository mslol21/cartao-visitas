"use client";

import React, { useState } from 'react';
import { MessageCircle, Mail, MapPin, CheckCircle2, Sparkles } from 'lucide-react';
import { trackMusicClickAction } from '@/app/actions/music-pro';

interface MusicHireContactProps {
  stageName: string;
  whatsapp?: string;
  email?: string;
  region?: string;
  eventTypes?: string[];
  customMessage?: string;
  profileId?: string;
  primaryColor?: string;
  secondaryColor?: string;
}

export function MusicHireContact({
  stageName,
  whatsapp,
  email,
  region,
  eventTypes = [],
  customMessage,
  profileId,
  primaryColor = '#ef4444',
  secondaryColor = '#f43f5e'
}: MusicHireContactProps) {
  const [selectedEventType, setSelectedEventType] = useState<string>(eventTypes[0] || 'Casamentos');
  const cleanPhone = (whatsapp || '').replace(/\D/g, '');

  const handleSendInquiry = () => {
    if (profileId) {
      trackMusicClickAction(profileId, 'click_music_hire', {
        event_type: selectedEventType,
        origin: 'contact_section'
      }).catch(() => {});
    }

    if (!cleanPhone) return;

    const baseMsg = customMessage || `Olá, ${stageName}! Gostaria de informações sobre disponibilidade e valores para uma apresentação.`;
    const fullMsg = `${baseMsg}\n\n*Tipo de Evento:* ${selectedEventType}\n*Região:* ${region || 'A combinar'}`;

    window.open(`https://wa.me/${cleanPhone}?text=${encodeURIComponent(fullMsg)}`, '_blank', 'noopener,noreferrer');
  };

  return (
    <section className="w-full flex flex-col gap-4 p-5 rounded-3xl bg-zinc-950 border border-zinc-850 shadow-2xl">
      {/* Cabeçalho */}
      <div className="flex flex-col gap-1 text-center sm:text-left">
        <span 
          className="text-xs font-black uppercase tracking-widest"
          style={{ color: primaryColor }}
        >
          Disponibilidade & Orçamentos
        </span>
        <h2 className="text-xl font-black text-white tracking-tight">
          Contrate {stageName} para o seu evento
        </h2>
        <p className="text-xs text-zinc-400 leading-relaxed">
          Selecione o formato do seu evento e fale diretamente com o artista para consultar datas e valores.
        </p>
      </div>

      {/* Seleção de Tipo de Evento */}
      {eventTypes.length > 0 && (
        <div className="flex flex-col gap-2 mt-1">
          <label className="text-xs font-bold text-zinc-300">
            Qual é a ocasião do seu evento?
          </label>
          <div className="flex flex-wrap gap-2">
            {eventTypes.map((type) => {
              const isSelected = selectedEventType === type;
              return (
                <button
                  key={type}
                  type="button"
                  onClick={() => setSelectedEventType(type)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition active:scale-95 ${
                    isSelected
                      ? 'text-white shadow-md'
                      : 'bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white'
                  }`}
                  style={{
                    backgroundColor: isSelected ? primaryColor : undefined,
                    borderColor: isSelected ? primaryColor : undefined
                  }}
                >
                  {type}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Região e E-mail */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 pt-2 border-t border-zinc-850 text-xs text-zinc-400">
        {region && (
          <div className="flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5 text-zinc-500 shrink-0" />
            <span>Região: <strong className="text-zinc-200">{region}</strong></span>
          </div>
        )}

        {email && (
          <div className="flex items-center gap-1.5">
            <Mail className="w-3.5 h-3.5 text-zinc-500 shrink-0" />
            <span>Contato: <strong className="text-zinc-200">{email}</strong></span>
          </div>
        )}
      </div>

      {/* Botão de Envio de Orçamento */}
      {cleanPhone && (
        <button
          type="button"
          onClick={handleSendInquiry}
          className="w-full flex items-center justify-center gap-2.5 py-3.5 px-6 rounded-2xl font-black text-sm uppercase tracking-wider text-white shadow-xl transition-all duration-300 active:scale-[0.98] mt-2"
          style={{
            background: `linear-gradient(135deg, ${primaryColor}, ${secondaryColor})`,
            boxShadow: `0 8px 24px -6px ${primaryColor}66`
          }}
        >
          <MessageCircle className="w-5 h-5 shrink-0" />
          <span>Solicitar Orçamento no WhatsApp</span>
        </button>
      )}
    </section>
  );
}
