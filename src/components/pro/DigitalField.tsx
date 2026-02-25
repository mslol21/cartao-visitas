"use client";

import React from "react";

interface DigitalFieldProps {
  /** Cor de acento da profissão */
  accentColor?: string;
  /** Ativo (isPro) */
  active?: boolean;
}

/**
 * Fundo digital premium — gradiente animado + partículas flutuantes.
 * Renderizado dentro do header do cartão PRO como camada de fundo.
 */
export function DigitalField({
  accentColor = "#00D4FF",
  active = false,
}: DigitalFieldProps) {
  if (!active) return null;

  // Partículas com posições fixas para evitar hydration mismatch
  const particles = [
    { size: 3, top: 12, left: 18, delay: 0,   dur: 8  },
    { size: 2, top: 35, left: 70, delay: 1.5, dur: 10 },
    { size: 4, top: 60, left: 40, delay: 0.8, dur: 12 },
    { size: 2, top: 80, left: 85, delay: 2.2, dur: 9  },
    { size: 3, top: 25, left: 55, delay: 3.1, dur: 11 },
    { size: 2, top: 50, left: 10, delay: 1.0, dur: 14 },
    { size: 3, top: 70, left: 25, delay: 2.7, dur: 10 },
    { size: 2, top: 15, left: 88, delay: 0.5, dur: 13 },
    { size: 4, top: 88, left: 60, delay: 1.9, dur: 8  },
    { size: 2, top: 42, left: 92, delay: 3.5, dur: 11 },
  ] as const;

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-[0]">
      {/* Gradiente animado multi-camadas */}
      <div
        className="absolute inset-0"
        style={{
          background: `
            radial-gradient(ellipse 60% 40% at 20% 20%, ${accentColor}18 0%, transparent 70%),
            radial-gradient(ellipse 50% 60% at 80% 80%, ${accentColor}10 0%, transparent 60%),
            radial-gradient(ellipse 80% 50% at 50% 100%, #2563EB14 0%, transparent 70%)
          `,
          animation: "field-gradient-shift 12s ease-in-out infinite",
          backgroundSize: "200% 200%",
        }}
      />

      {/* Malha/grid luminosa sutil */}
      <div
        className="absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage: `
            linear-gradient(${accentColor} 1px, transparent 1px),
            linear-gradient(90deg, ${accentColor} 1px, transparent 1px)
          `,
          backgroundSize: "48px 48px",
        }}
      />

      {/* Partículas flutuantes */}
      {particles.map((p, i) => (
        <div
          key={i}
          className="absolute rounded-full"
          style={{
            width:  `${p.size}px`,
            height: `${p.size}px`,
            top:    `${p.top}%`,
            left:   `${p.left}%`,
            background: accentColor,
            boxShadow:  `0 0 ${p.size * 3}px ${accentColor}`,
            animation:  `field-particle-float ${p.dur}s ease-out infinite`,
            animationDelay: `${p.delay}s`,
          }}
        />
      ))}

      {/* Linha de horizonte luminosa */}
      <div
        className="absolute bottom-0 left-0 right-0 h-[1px]"
        style={{
          background: `linear-gradient(90deg, transparent, ${accentColor}60, transparent)`,
        }}
      />
    </div>
  );
}
