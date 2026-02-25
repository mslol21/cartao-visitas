"use client";

import React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface AnimatedQRProps {
  /** URL completa do QR code (gerada externamente) */
  qrSrc: string;
  /** Cor de acento da profissão */
  accentColor?: string;
  /** Gradiente da profissão (para o frame) */
  profGradient?: string;
  /** Tamanho em px */
  size?: number;
  /** Está ativo (isPro) */
  active?: boolean;
}

export function AnimatedQR({
  qrSrc,
  accentColor = "#00D4FF",
  profGradient,
  size = 112,
  active = true,
}: AnimatedQRProps) {
  if (!active) {
    // Free: QR estático, simples
    return (
      <div
        className="rounded-2xl overflow-hidden border border-slate-200/30 shadow-md"
        style={{ width: size, height: size }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={qrSrc} alt="QR Code" className="w-full h-full object-cover" />
      </div>
    );
  }

  // PRO: QR animado
  const gradient =
    profGradient ||
    `linear-gradient(135deg, ${accentColor}cc, ${accentColor}44)`;

  return (
    <motion.div
      className="relative flex items-center justify-center"
      style={{ width: size + 16, height: size + 16 }}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      {/* Glow ring pulsante */}
      <div
        className="absolute inset-0 rounded-[1.5rem]"
        style={{
          animation: "qr-pulse 3s ease-in-out infinite",
          borderRadius: "1.25rem",
        }}
      />

      {/* Frame externo com gradiente da profissão */}
      <div
        className="absolute inset-0 rounded-[1.5rem] p-[2px]"
        style={{
          background: gradient,
          animation: "aura-spin 20s linear infinite",
        }}
      >
        <div className="w-full h-full rounded-[1.3rem] bg-slate-950" />
      </div>

      {/* Cantos de bracket PRO */}
      {[
        { cls: "top-0 left-0",    br: "8px 0 0 0",   bw: "2px 0 0 2px" },
        { cls: "top-0 right-0",   br: "0 8px 0 0",   bw: "2px 2px 0 0" },
        { cls: "bottom-0 left-0", br: "0 0 0 8px",   bw: "0 0 2px 2px" },
        { cls: "bottom-0 right-0",br: "0 0 8px 0",   bw: "0 2px 2px 0" },
      ].map(({ cls, br, bw }, i) => (
        <div
          key={i}
          className={`absolute w-5 h-5 z-[3] ${cls}`}
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

      {/* QR image */}
      <div
        className="relative z-[2] rounded-[1.1rem] overflow-hidden"
        style={{ width: size, height: size }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={qrSrc}
          alt="QR Code Konnexy PRO"
          className="w-full h-full object-cover"
          style={{ filter: "invert(0)" }}
        />
        {/* Overlay tint com a cor da profissão */}
        <div
          className="absolute inset-0 mix-blend-color pointer-events-none"
          style={{ background: `${accentColor}15` }}
        />
      </div>

      {/* Label PRO badge */}
      <div
        className="absolute -bottom-3 left-1/2 -translate-x-1/2 z-[4] px-3 py-0.5 rounded-full text-[8px] font-black uppercase tracking-widest text-white shadow-lg"
        style={{ background: gradient }}
      >
        Konnexy PRO
      </div>
    </motion.div>
  );
}
