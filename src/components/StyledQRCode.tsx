"use client";

import React, { useEffect, useRef, useState } from "react";
import QRCodeStyling, {
  Options,
  DrawType,
  TypeNumber,
  Mode,
  ErrorCorrectionLevel,
  DotType,
  CornerSquareType,
  CornerDotType
} from "qr-code-styling";
import { Button } from "@/components/ui/button";
import { Download, Crown, Loader2, Share2, FileDown } from "lucide-react";
import { toast } from "sonner";
import Link from "next/link";

interface StyledQRCodeProps {
  url: string;
  isPro?: boolean;
  username: string;
  photoUrl?: string;
  customFields?: any;
}

export const StyledQRCode: React.FC<StyledQRCodeProps> = ({ url, isPro = false, username, photoUrl, customFields }) => {
  const [qrCode, setQrCode] = useState<QRCodeStyling | null>(null);
  const ref = useRef<HTMLDivElement>(null);
  const [isDownloading, setIsDownloading] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const options: Options = {
      width: 1000,
      height: 1000,
      type: "svg" as DrawType,
      data: url,
      image: isPro ? (photoUrl || "/logo-icon.svg") : undefined,
      margin: 20,
      qrOptions: {
        typeNumber: 0 as TypeNumber,
        mode: "Byte" as Mode,
        errorCorrectionLevel: "H" as ErrorCorrectionLevel
      },
      imageOptions: {
        hideBackgroundDots: true,
        imageSize: 0.4,
        margin: 10,
        crossOrigin: "anonymous",
      },
      dotsOptions: {
        color: isPro ? (customFields?.cor_qr_pontos || "#2563eb") : "#000000",
        type: isPro ? "rounded" as DotType : "square" as DotType,
        gradient: (isPro && !customFields?.cor_qr_pontos) ? {
          type: "linear",
          rotation: 45,
          colorStops: [
            { offset: 0, color: "#2563eb" }, // Blue
            { offset: 1, color: "#10b981" }  // Green
          ]
        } : undefined
      },
      backgroundOptions: {
        color: customFields?.cor_qr_fundo || "transparent",
      },
      cornersSquareOptions: {
        color: isPro ? (customFields?.cor_qr_cantos_quadrado || "#2563eb") : "#000000",
        type: isPro ? "extra-rounded" as CornerSquareType : "square" as CornerSquareType,
      },
      cornersDotOptions: {
        color: isPro ? (customFields?.cor_qr_cantos_ponto || "#10b981") : "#000000",
        type: isPro ? "dot" as CornerDotType : "square" as CornerDotType,
      }
    };

    const newQrCode = new QRCodeStyling(options);
    setQrCode(newQrCode);

    if (ref.current) {
      ref.current.innerHTML = "";
      newQrCode.append(ref.current);
    }
  }, [url, isPro, photoUrl, customFields]);

  const onDownloadClick = async (extension: "png" | "svg") => {
    if (!qrCode) return;
    
    setIsDownloading(extension);
    try {
      await qrCode.download({
        name: `konnexy-${username}`,
        extension: extension
      });
      toast.success(`Download ${extension.toUpperCase()} concluído!`);
    } catch (error) {
      console.error("Erro no download:", error);
      toast.error("Erro ao realizar o download.");
    } finally {
      setIsDownloading(null);
    }
  };

  return (
    <div className="flex flex-col items-center gap-6 p-6 bg-card border border-border rounded-3xl shadow-soft transition-all hover:shadow-medium">
      <div className="relative group">
        {/* QR Code Container */}
        <div 
          ref={ref} 
          className="bg-white p-4 rounded-2xl shadow-inner overflow-hidden flex items-center justify-center transition-transform group-hover:scale-[1.02] duration-300 [&>svg]:w-full [&>svg]:h-full [&>canvas]:w-full [&>canvas]:h-full"
          style={{ width: "320px", height: "320px" }}
        />
        
        {!isPro && (
          <div className="absolute inset-0 bg-background/60 backdrop-blur-[2px] rounded-2xl flex flex-col items-center justify-center p-6 text-center transition-opacity group-hover:bg-background/40">
            <div className="bg-primary/10 p-3 rounded-full mb-3 text-primary">
              <Crown className="w-8 h-8 fill-primary/20" />
            </div>
            <p className="text-sm font-medium text-foreground mb-4">
              QR personalizado disponível no plano PRO
            </p>
            <Button asChild variant="hero" size="sm" className="shadow-lg">
              <Link href="/pricing">
                Fazer upgrade
              </Link>
            </Button>
          </div>
        )}
      </div>

      <div className="w-full space-y-3">
        {isPro ? (
          <div className="grid grid-cols-2 gap-3">
            <Button
              onClick={() => onDownloadClick("png")}
              className="w-full gap-2 rounded-xl h-12"
              variant="outline"
              disabled={!!isDownloading}
            >
              {isDownloading === "png" ? <Loader2 className="w-4 h-4 animate-spin" /> : <FileDown className="w-4 h-4" />}
              PNG <span className="text-[10px] opacity-70">(1000px)</span>
            </Button>
            <Button
              onClick={() => onDownloadClick("svg")}
              className="w-full gap-2 rounded-xl h-12"
              variant="outline"
              disabled={!!isDownloading}
            >
              {isDownloading === "svg" ? <Loader2 className="w-4 h-4 animate-spin" /> : <FileDown className="w-4 h-4" />}
              SVG <span className="text-[10px] opacity-70">(Vetor)</span>
            </Button>
          </div>
        ) : (
          <Button
            onClick={() => onDownloadClick("png")}
            className="w-full gap-2 rounded-xl h-12 bg-zinc-900 hover:bg-zinc-800 text-white"
            disabled={!!isDownloading}
          >
            {isDownloading === "png" ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
            Baixar QR Code (PNG)
          </Button>
        )}
        
        <p className="text-center text-[11px] text-muted-foreground">
          {isPro 
            ? "Alta resolução com fundo transparente ideal para impressão." 
            : "Upgrade para PRO para baixar em SVG e ter QR personalizado."}
        </p>
      </div>
    </div>
  );
};
