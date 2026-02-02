"use client";

import { QRCodeSVG } from 'qrcode.react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Download, QrCode } from 'lucide-react';
import { Profile } from '@/types/profile';
import { useRef } from 'react';
import { toast } from 'sonner';

interface QRCodeCustomizerProps {
  profile: Profile;
}

export function QRCodeCustomizer({ profile }: QRCodeCustomizerProps) {
  const qrRef = useRef<SVGSVGElement>(null);
  const publicUrl = typeof window !== 'undefined' 
    ? `${window.location.origin}/${profile.username}` 
    : '';

  const downloadQRCode = () => {
    const svg = qrRef.current;
    if (!svg) return;

    const svgData = new XMLSerializer().serializeToString(svg);
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    const img = new Image();

    img.onload = () => {
      canvas.width = 1024;
      canvas.height = 1024;
      ctx?.drawImage(img, 0, 0, 1024, 1024);
      const pngFile = canvas.toDataURL("image/png");
      const downloadLink = document.createElement("a");
      downloadLink.download = `QR_Code_${profile.username}.png`;
      downloadLink.href = pngFile;
      downloadLink.click();
      toast.success('QR Code baixado com sucesso!');
    };

    img.src = "data:image/svg+xml;base64," + btoa(svgData);
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col items-center gap-6 p-8 rounded-3xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-white/5">
        <label className="text-[10px] font-black uppercase tracking-[0.3em] text-primary">Preview do Seu QR Code</label>
        
        <div className="p-6 bg-white rounded-3xl shadow-2xl border border-slate-100">
          <QRCodeSVG
            ref={qrRef}
            value={publicUrl}
            size={256}
            level="H" // High error correction for logo
            fgColor={profile.theme_color || '#000000'}
            imageSettings={profile.photo_url ? {
              src: profile.photo_url,
              x: undefined,
              y: undefined,
              height: 60,
              width: 60,
              excavate: true,
            } : undefined}
          />
        </div>

        <div className="text-center space-y-2">
          <p className="text-sm font-bold">{profile.name}</p>
          <p className="text-xs text-muted-foreground">{publicUrl}</p>
        </div>

        <Button 
          onClick={downloadQRCode}
          className="w-full h-12 rounded-2xl flex items-center gap-2 font-bold"
        >
          <Download className="w-4 h-4" />
          Baixar QR Code Alta Resolução
        </Button>
      </div>

      <div className="grid gap-4">
        <div className="p-4 rounded-2xl bg-blue-500/5 border border-blue-500/20">
          <p className="text-[10px] font-black uppercase tracking-widest text-blue-500 mb-1 flex items-center gap-2">
            <QrCode className="w-3 h-3" /> Dica de Uso
          </p>
          <p className="text-xs leading-relaxed text-blue-700 dark:text-blue-300">
            Imprima este QR Code em seus cartões físicos, banners ou adesivos. Ele já vem configurado com sua cor de marca e sua foto no centro.
          </p>
        </div>
      </div>
    </div>
  );
}
