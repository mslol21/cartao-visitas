"use client";

import React, { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import QRCodeStyling, {
  DrawType,
  TypeNumber,
  Mode,
  ErrorCorrectionLevel,
  DotType,
  CornerSquareType,
  CornerDotType,
  Options
} from "qr-code-styling";

interface AnimatedQRProps {
  /** A URL que o QR code vai abrir */
  url: string;
  /** Foto para o centro do QR */
  photoUrl?: string;
  /** Cor de acento da profissão */
  accentColor?: string;
  /** Gradiente da profissão */
  profGradient?: string;
  /** Tamanho em px */
  size?: number;
  /** Está ativo (isPro) */
  active?: boolean;
  /** Custom fields from profile */
  customFields?: any;
}

export function AnimatedQR({
  url,
  photoUrl,
  accentColor = "#00D4FF",
  profGradient,
  size = 112,
  active = true,
  customFields,
}: AnimatedQRProps) {
  const [qrCode, setQrCode] = useState<QRCodeStyling | null>(null);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const options: Options = {
      width: size * 4, // Higher resolution for cleaner look
      height: size * 4,
      type: "svg" as DrawType,
      data: url,
      image: active ? (photoUrl || "/logo-icon.svg") : undefined,
      margin: 10,
      qrOptions: {
        typeNumber: 0 as TypeNumber,
        mode: "Byte" as Mode,
        errorCorrectionLevel: "H" as ErrorCorrectionLevel
      },
      imageOptions: {
        hideBackgroundDots: true,
        imageSize: 0.4,
        margin: 5,
        crossOrigin: "anonymous",
      },
      dotsOptions: {
        color: active ? (customFields?.cor_qr_pontos || "#2563eb") : "#000000",
        type: active ? "rounded" as DotType : "square" as DotType,
        gradient: (active && !customFields?.cor_qr_pontos) ? {
          type: "linear",
          rotation: 45,
          colorStops: [
            { offset: 0, color: "#2563eb" }, // Blue (Igual ao da esquerda)
            { offset: 1, color: "#10b981" }  // Green (Igual ao da esquerda)
          ]
        } : undefined
      },
      backgroundOptions: {
        color: customFields?.cor_qr_fundo || "#ffffff", // Fundo customizado ou branco
      },
      cornersSquareOptions: {
        color: active ? (customFields?.cor_qr_cantos_quadrado || "#2563eb") : "#000000",
        type: active ? "extra-rounded" as CornerSquareType : "square" as CornerSquareType,
      },
      cornersDotOptions: {
        color: active ? (customFields?.cor_qr_cantos_ponto || "#10b981") : "#000000",
        type: active ? "dot" as CornerDotType : "square" as CornerDotType,
      }
    };

    const newQrCode = new QRCodeStyling(options);
    setQrCode(newQrCode);

    if (ref.current) {
      ref.current.innerHTML = "";
      newQrCode.append(ref.current);
    }
  }, [url, active, photoUrl, size, customFields]);

  if (!active) {
    return (
      <div
        ref={ref}
        className="rounded-2xl overflow-hidden border border-slate-200/30 shadow-md bg-white p-2"
        style={{ width: size, height: size }}
      />
    );
  }

  const gradient =
    profGradient ||
    `linear-gradient(135deg, ${accentColor}cc, ${accentColor}44)`;

  return (
    <motion.div
      className="relative flex items-center justify-center p-4 bg-white/5 rounded-[2rem] backdrop-blur-sm"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      {/* Glow ring pulsante */}
      <div
        className="absolute inset-0 rounded-[2.2rem]"
        style={{
          animation: "qr-pulse 3s ease-in-out infinite",
        }}
      />

      {/* Frame externo com gradiente da profissão */}
      <div
        className="absolute inset-0 rounded-[2.2rem] p-[2px]"
        style={{
          background: gradient,
          animation: "aura-spin 30s linear infinite",
        }}
      >
        <div className="w-full h-full rounded-[2.1rem] bg-slate-950" />
      </div>

      {/* Cantos de bracket PRO */}
      {[
        { cls: "top-2 left-2",    br: "12px 0 0 0",   bw: "3px 0 0 3px" },
        { cls: "top-2 right-2",   br: "0 12px 0 0",   bw: "3px 3px 0 0" },
        { cls: "bottom-2 left-2", br: "0 0 0 12px",   bw: "0 0 3px 3px" },
        { cls: "bottom-2 right-2",br: "0 0 12px 0",   bw: "0 3px 3px 0" },
      ].map(({ cls, br, bw }, i) => (
        <div
          key={i}
          className={`absolute w-8 h-8 z-[10] ${cls}`}
          style={{
            borderColor: accentColor,
            borderStyle: "solid",
            borderWidth: bw,
            borderRadius: br,
            animation: `qr-corner-blink 2.5s ease-in-out infinite`,
            animationDelay: `${i * 0.6}s`,
          }}
        />
      ))}

      {/* Styled QR container */}
      <div
        className="relative z-[5] rounded-2xl overflow-hidden bg-white p-2 shadow-2xl"
        style={{ width: size + 10, height: size + 10 }}
      >
        <div 
          ref={ref} 
          className="w-full h-full flex items-center justify-center [&>svg]:w-full [&>svg]:h-full [&>canvas]:w-full [&>canvas]:h-full"
        />
      </div>

      {/* Label PRO badge */}
      <div
        className="absolute -bottom-2 left-1/2 -translate-x-1/2 z-[20] px-4 py-1 rounded-full text-[9px] font-black uppercase tracking-widest text-white shadow-xl"
        style={{ background: gradient }}
      >
        Konnexy PRO Signature
      </div>
    </motion.div>
  );
}
