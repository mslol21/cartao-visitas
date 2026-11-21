"use client";

import React, { useState } from 'react';
import { Share2, Check, Copy } from 'lucide-react';
import { toast } from 'sonner';

interface SmartLinkClientShareProps {
  title: string;
  text: string;
  url: string;
}

export function SmartLinkClientShare({ title, text, url }: SmartLinkClientShareProps) {
  const [copied, setCopied] = useState(false);

  const handleShare = async () => {
    const shareData = { title, text, url };

    if (navigator.share && navigator.canShare && navigator.canShare(shareData)) {
      try {
        await navigator.share(shareData);
        return;
      } catch {
        // Usuário cancelou o share nativo
      }
    }

    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      toast.success('Link do lançamento copiado com sucesso!');
      setTimeout(() => setCopied(false), 2500);
    } catch {
      toast.error('Não foi possível copiar o link.');
    }
  };

  return (
    <button
      type="button"
      onClick={handleShare}
      title="Compartilhar Lançamento"
      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-black/60 hover:bg-black/90 border border-zinc-800 text-xs font-semibold text-zinc-300 hover:text-white backdrop-blur-md transition active:scale-95 shadow-md"
    >
      {copied ? (
        <>
          <Check className="w-3.5 h-3.5 text-emerald-400" />
          <span className="text-emerald-400">Copiado</span>
        </>
      ) : (
        <>
          <Share2 className="w-3.5 h-3.5" />
          <span>Compartilhar</span>
        </>
      )}
    </button>
  );
}
