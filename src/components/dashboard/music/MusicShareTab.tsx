"use client";

import React, { useState } from 'react';
import { QrCode, Copy, Check, ExternalLink, Download, Share2, Smartphone } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { StyledQRCode } from '@/components/StyledQRCode';
import { SITE_URL } from '@/lib/seo/site';
import type { Profile } from '@/types/profile';

interface MusicShareTabProps {
  profile: Profile;
  stageName: string;
}

export function MusicShareTab({ profile, stageName }: MusicShareTabProps) {
  const [copied, setCopied] = useState(false);
  const publicUrl = profile.username ? `${SITE_URL}/${encodeURIComponent(profile.username)}` : SITE_URL;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(publicUrl);
      setCopied(true);
      toast.success('Link do perfil copiado!');
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error('Erro ao copiar link.');
    }
  };

  const handleDownloadQr = () => {
    const canvas = document.querySelector('canvas');
    if (canvas) {
      const url = canvas.toDataURL('image/png');
      const a = document.createElement('a');
      a.download = `qrcode-${(profile.username || stageName).toLowerCase().replace(/[^a-z0-9]/g, '-')}.png`;
      a.href = url;
      a.click();
      toast.success('QR Code baixado com sucesso!');
    } else {
      toast.error('QR Code ainda sendo gerado.');
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-1">
        <h2 className="text-xl font-black text-white tracking-tight">
          Compartilhamento & QR Code Oficial
        </h2>
        <p className="text-xs text-zinc-400">
          Divulgue seu portfólio musical em cartazes de shows, banners de palco, redes sociais e materiais impressos.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 items-start">
        {/* Card do QR Code com Download */}
        <div className="rounded-3xl bg-zinc-900/60 border border-zinc-800 p-6 flex flex-col items-center text-center gap-4 shadow-xl">
          <div className="p-4 bg-white rounded-3xl shadow-2xl">
            <StyledQRCode
              url={publicUrl}
              username={profile.username || stageName}
              photoUrl={profile.photo_url || undefined}
              isPro={true}
            />
          </div>

          <div className="w-full">
            <h3 className="text-sm font-bold text-white">QR Code de Palco & Divulgação</h3>
            <p className="text-xs text-zinc-400 mt-1 max-w-xs">
              Ideal para colocar em banners, flyers, crachás e nos telões do seu show.
            </p>
          </div>

          <Button
            type="button"
            onClick={handleDownloadQr}
            className="w-full h-12 rounded-2xl bg-zinc-800 hover:bg-zinc-700 text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2"
          >
            <Download className="w-4 h-4" />
            <span>Baixar Imagem PNG</span>
          </Button>
        </div>

        {/* Link e Canais de Compartilhamento */}
        <div className="flex flex-col gap-4">
          <div className="rounded-3xl bg-zinc-900/60 border border-zinc-800 p-6 flex flex-col gap-4 shadow-xl">
            <h3 className="text-sm font-black text-white uppercase tracking-wider">
              Seu Link Público Konnexy
            </h3>

            <div className="p-3.5 rounded-2xl bg-zinc-950 border border-zinc-800 text-xs font-mono text-zinc-300 break-all">
              {publicUrl}
            </div>

            <div className="flex gap-2">
              <Button
                type="button"
                onClick={handleCopy}
                className="flex-1 h-11 rounded-2xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs uppercase tracking-wider"
              >
                {copied ? <Check className="w-4 h-4 mr-2 text-emerald-300" /> : <Copy className="w-4 h-4 mr-2" />}
                {copied ? 'Copiado!' : 'Copiar Link'}
              </Button>

              <a
                href={publicUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center w-11 h-11 rounded-2xl bg-zinc-800 hover:bg-zinc-700 text-white transition shrink-0"
                title="Abrir no navegador"
              >
                <ExternalLink className="w-4 h-4" />
              </a>
            </div>
          </div>

          <div className="rounded-3xl bg-zinc-900/60 border border-zinc-800 p-6 flex flex-col gap-3 shadow-xl">
            <div className="flex items-center gap-2.5">
              <Smartphone className="w-5 h-5 text-red-400" />
              <h3 className="text-sm font-bold text-white">Cartão Físico com NFC para Músicos</h3>
            </div>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Leve uma placa acrílica inteligente ou cartão Konnexy Tag para o camarim e eventos: basta o contratante aproximar o smartphone para abrir seu portfólio instantaneamente.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
