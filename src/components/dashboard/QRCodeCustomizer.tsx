"use client";

import { QRCodeCanvas } from 'qrcode.react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Download, QrCode, Loader2 } from 'lucide-react';
import { Profile } from '@/types/profile';
import { useRef, useState, useEffect } from 'react';
import { toast } from 'sonner';

interface QRCodeCustomizerProps {
  profile: Profile;
}

export function QRCodeCustomizer({ profile }: QRCodeCustomizerProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [base64Image, setBase64Image] = useState<string | null>(null);
  const [isProcessingImage, setIsProcessingImage] = useState(false);
  
  const publicUrl = typeof window !== 'undefined' 
    ? `${window.location.origin}/${profile.username}` 
    : '';

  // Efeito para converter a imagem externa em Base64 local
  // Isso evita que o canvas fique "sujo" (tainted) e bloqueie o download
  useEffect(() => {
    async function convertToBase64() {
      if (!profile.photo_url) {
        setBase64Image(null);
        return;
      }

      setIsProcessingImage(true);
      try {
        const response = await fetch(profile.photo_url);
        const blob = await response.blob();
        const reader = new FileReader();
        reader.onloadend = () => {
          setBase64Image(reader.result as string);
          setIsProcessingImage(false);
        };
        reader.readAsDataURL(blob);
      } catch (error) {
        console.error('Erro ao processar imagem para QR:', error);
        setIsProcessingImage(false);
      }
    }

    convertToBase64();
  }, [profile.photo_url]);

  const downloadQRCode = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    // O QRCodeCanvas já desenha em alta resolução (size=512)
    const pngFile = canvas.toDataURL("image/png");
    const downloadLink = document.createElement("a");
    downloadLink.download = `QR_Code_${profile.username}.png`;
    downloadLink.href = pngFile;
    downloadLink.click();
    toast.success('QR Code baixado com sucesso!');
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col items-center gap-6 p-8 rounded-3xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-white/5">
        <label className="text-[10px] font-black uppercase tracking-[0.3em] text-primary">Preview do Seu QR Code</label>
        
        <div className="p-6 bg-white rounded-3xl shadow-2xl border border-slate-100 flex items-center justify-center relative min-h-[256px] min-w-[256px]">
          {isProcessingImage && (
            <div className="absolute inset-0 flex items-center justify-center bg-white/80 z-10 rounded-2xl">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
          )}
          
          <QRCodeCanvas
            ref={canvasRef}
            value={publicUrl}
            size={512} // Resolução real do desenho (dobro do visual)
            style={{ width: '256px', height: '256px' }} // Tamanho exibido
            level="H" 
            fgColor={profile.theme_color || '#000000'}
            imageSettings={(profile.photo_url && base64Image) ? {
              src: base64Image,
              x: undefined,
              y: undefined,
              height: 100,
              width: 100,
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
          disabled={isProcessingImage}
          className="w-full h-12 rounded-2xl flex items-center gap-2 font-bold"
        >
          {isProcessingImage ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Download className="w-4 h-4" />
          )}
          Baixar QR Code Alta Resolução
        </Button>
      </div>

      <div className="grid gap-4">
        <div className="p-4 rounded-2xl bg-blue-500/5 border border-blue-500/20">
          <p className="text-[10px] font-black uppercase tracking-widest text-blue-500 mb-1 flex items-center gap-2">
            <QrCode className="w-3 h-3" /> Dica de Uso
          </p>
          <p className="text-xs leading-relaxed text-blue-700 dark:text-blue-300">
            Este QR Code foi gerado com uma técnica de segurança para garantir que sua foto de perfil seja incluída no download com nitidez total.
          </p>
        </div>
      </div>
    </div>
  );
}
