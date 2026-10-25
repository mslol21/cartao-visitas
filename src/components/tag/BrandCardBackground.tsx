'use client';

import React from 'react';

export type BrandWatermarkType =
  | 'whatsapp'
  | 'pix'
  | 'code'
  | 'konnexy'
  | 'instagram'
  | 'linkedin'
  | 'github'
  | 'google'
  | 'food'
  | 'auto'
  | 'travel'
  | 'craft'
  | 'music'
  | 'beauty'
  | 'services';

interface BrandCardBackgroundProps {
  brand: BrandWatermarkType;
  align?: 'right' | 'center' | 'top-right';
  size?: number;
  opacity?: number;
}

/**
 * Resolve automaticamente a marca d'água temática para a profissão do perfil
 */
export function resolveProfessionBrand(profession?: string | null): BrandWatermarkType {
  const p = (profession || '').toLowerCase();
  if (
    ['chef_eventos', 'pizzaria', 'cafeteria', 'quentinhas', 'food'].includes(p)
  ) {
    return 'food';
  }
  if (
    [
      'manutencao_automotiva',
      'vistoria_veicular',
      'estetica_automotiva',
      'mecanico',
      'driver',
      'frete',
      'van_escolar'
    ].includes(p)
  ) {
    return 'auto';
  }
  if (['guia_turistico', 'area_lazer'].includes(p)) {
    return 'travel';
  }
  if (['artesao', 'designer', 'fotografo', 'streetup', 'loja_online'].includes(p)) {
    return 'craft';
  }
  if (['musico'].includes(p)) {
    return 'music';
  }
  if (
    [
      'barbearia',
      'manicure',
      'cabeleireiro',
      'esteticista',
      'beauty',
      'health',
      'psicologo',
      'personal_trainer',
      'petshop',
      'veterinario'
    ].includes(p)
  ) {
    return 'beauty';
  }
  if (['tech', 'tecnico_informatica', 'assistencia_celular'].includes(p)) {
    return 'code';
  }
  return 'services';
}

/**
 * Renderiza ao fundo do card a atmosfera cromática + a marca d'água vetorial de alta fidelidade
 */
export function BrandCardBackground({
  brand,
  align = 'right',
  size = 138,
  opacity = 0.16
}: BrandCardBackgroundProps) {
  const glowMap: Record<BrandWatermarkType, string> = {
    whatsapp:
      'radial-gradient(circle at 88% 50%, rgba(37,211,102,0.25), rgba(18,140,126,0.10) 65%, transparent 100%)',
    pix:
      'radial-gradient(circle at 85% 40%, rgba(50,188,173,0.25), rgba(50,188,173,0.08) 65%, transparent 100%)',
    code:
      'radial-gradient(circle at 85% 35%, rgba(56,189,248,0.25), rgba(99,102,241,0.14) 65%, transparent 100%)',
    konnexy:
      'radial-gradient(circle at 85% 35%, rgba(245,158,11,0.28), rgba(234,88,12,0.18) 45%, rgba(99,102,241,0.15) 85%, transparent 100%)',
    instagram:
      'radial-gradient(circle at 85% 30%, rgba(253,29,29,0.24), rgba(131,58,180,0.22) 48%, rgba(252,176,69,0.16) 85%, transparent 100%)',
    linkedin:
      'radial-gradient(circle at 85% 40%, rgba(10,102,194,0.28), rgba(10,102,194,0.08) 65%, transparent 100%)',
    github:
      'radial-gradient(circle at 85% 40%, rgba(255,255,255,0.18), rgba(161,161,170,0.08) 65%, transparent 100%)',
    google:
      'radial-gradient(circle at 85% 20%, rgba(66,133,244,0.22), rgba(234,67,53,0.16) 38%, rgba(251,188,5,0.14) 68%, rgba(52,168,83,0.12) 100%)',
    food:
      'radial-gradient(circle at 88% 35%, rgba(245,158,11,0.26), rgba(234,88,12,0.16) 55%, transparent 100%)',
    auto:
      'radial-gradient(circle at 88% 35%, rgba(59,130,246,0.24), rgba(245,158,11,0.14) 55%, transparent 100%)',
    travel:
      'radial-gradient(circle at 88% 35%, rgba(16,185,129,0.25), rgba(14,165,233,0.15) 55%, transparent 100%)',
    craft:
      'radial-gradient(circle at 88% 35%, rgba(217,119,6,0.25), rgba(236,72,153,0.14) 55%, transparent 100%)',
    music:
      'radial-gradient(circle at 88% 35%, rgba(168,85,247,0.26), rgba(59,130,246,0.15) 55%, transparent 100%)',
    beauty:
      'radial-gradient(circle at 88% 35%, rgba(244,63,94,0.24), rgba(168,85,247,0.14) 55%, transparent 100%)',
    services:
      'radial-gradient(circle at 88% 35%, rgba(245,158,11,0.22), rgba(99,102,241,0.14) 60%, transparent 100%)'
  };

  const posStyle: React.CSSProperties =
    align === 'center'
      ? {
          position: 'absolute',
          top: '50%',
          left: '50%',
          width: `${size}px`,
          height: `${size}px`,
          transform: 'translate(-50%, -50%) rotate(-8deg)',
          opacity,
          pointerEvents: 'none',
          zIndex: 0
        }
      : align === 'top-right'
        ? {
            position: 'absolute',
            right: '-10px',
            top: '-10px',
            width: `${size}px`,
            height: `${size}px`,
            transform: 'rotate(-8deg)',
            opacity,
            pointerEvents: 'none',
            zIndex: 0
          }
        : {
            position: 'absolute',
            right: '-14px',
            bottom: '-14px',
            width: `${size}px`,
            height: `${size}px`,
            transform: 'rotate(-10deg)',
            opacity,
            pointerEvents: 'none',
            zIndex: 0
          };

  return (
    <>
      {/* Iluminação cromática ao fundo */}
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          inset: 0,
          background: glowMap[brand],
          pointerEvents: 'none',
          zIndex: 0
        }}
      />

      {/* Marca d'água vetorial */}
      <div aria-hidden="true" style={posStyle}>
        {brand === 'whatsapp' && (
          <svg viewBox="0 0 48 48" className="h-full w-full">
            <path
              fill="#25D366"
              d="M24 4C12.95 4 4 12.95 4 24c0 3.62.97 7.01 2.66 9.94L4 44l10.35-2.62C17.18 43.06 20.48 44 24 44c11.05 0 20-8.95 20-20S35.05 4 24 4zm11.67 28.25c-.49 1.38-2.85 2.64-3.98 2.81-1.02.15-2.31.22-3.73-.23-.86-.27-1.97-.64-3.39-1.25-5.96-2.57-9.85-8.57-10.15-8.97-.3-.4-2.42-3.22-2.42-6.14 0-2.92 1.53-4.35 2.07-4.95.54-.6 1.18-.75 1.58-.75.4 0 .79.01 1.13.02.36.02.85-.14 1.33 1.02.49 1.18 1.68 4.09 1.83 4.39.15.3.25.65.05 1.05-.2.4-.3.65-.6.99-.3.35-.62.78-.89 1.05-.3.3-.61.62-.26 1.22.35.6 1.54 2.54 3.31 4.12 2.27 2.02 4.19 2.65 4.79 2.95.6.3.95.25 1.3-.15.35-.4 1.5-1.75 1.9-2.35.4-.6.8-.5 1.35-.3.55.2 3.5 1.65 4.1 1.95.6.3 1 .45 1.15.7.15.25.15 1.43-.34 2.81z"
            />
          </svg>
        )}

        {brand === 'pix' && (
          <svg viewBox="0 0 48 48" className="h-full w-full">
            <path
              fill="#32BCAD"
              d="M34.8 29.7c-1.8 0-3.5-.7-4.8-2l-6-6 6-6c1.3-1.3 3-2 4.8-2h1.6l-7.6-7.6c-2.6-2.6-6.9-2.6-9.6 0l-7.6 7.6h1.6c1.8 0 3.5.7 4.8 2l6 6-6 6c-1.3 1.3-3 2-4.8 2h-1.6l7.6 7.6c2.6 2.6 6.9 2.6 9.6 0l7.6-7.6h-1.6z"
            />
          </svg>
        )}

        {brand === 'code' && (
          <svg viewBox="0 0 48 48" className="h-full w-full" fill="none" stroke="#38BDF8" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="16 14 6 24 16 34" />
            <polyline points="32 14 42 24 32 34" />
            <line x1="28" y1="10" x2="20" y2="38" stroke="#818CF8" />
          </svg>
        )}

        {brand === 'konnexy' && (
          <svg viewBox="0 0 120 120" className="h-full w-full" fill="none">
            <defs>
              <linearGradient id="brandKonnexyGrad" x1="0" y1="0" x2="120" y2="120" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stopColor="#F59E0B" />
                <stop offset="50%" stopColor="#EA580C" />
                <stop offset="100%" stopColor="#6366F1" />
              </linearGradient>
            </defs>
            <path d="M36 34V86M36 60L68 34M50 49L70 86" stroke="#FFFFFF" strokeWidth="9" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M80 46C86 53 86 67 80 74" stroke="url(#brandKonnexyGrad)" strokeWidth="7" strokeLinecap="round" />
            <path d="M91 37C101 49 101 71 91 83" stroke="url(#brandKonnexyGrad)" strokeWidth="7" strokeLinecap="round" strokeOpacity="0.75" />
          </svg>
        )}

        {brand === 'food' && (
          <svg viewBox="0 0 48 48" className="h-full w-full" fill="none" stroke="#F59E0B" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
            <path d="M16 6v14a6 6 0 0 0 12 0V6" />
            <line x1="22" y1="6" x2="22" y2="42" />
            <path d="M36 6c-3 0-6 4-6 10v10h6v16" />
          </svg>
        )}

        {brand === 'auto' && (
          <svg viewBox="0 0 48 48" className="h-full w-full" fill="none" stroke="#38BDF8" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
            <path d="M10 28l4-10h20l4 10" />
            <rect x="6" y="28" width="36" height="10" rx="3" />
            <circle cx="14" cy="38" r="3" />
            <circle cx="34" cy="38" r="3" />
          </svg>
        )}

        {brand === 'travel' && (
          <svg viewBox="0 0 48 48" className="h-full w-full" fill="none" stroke="#10B981" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="24" cy="24" r="18" />
            <polygon points="30 18 21 21 18 30 27 27 30 18" />
          </svg>
        )}

        {brand === 'craft' && (
          <svg viewBox="0 0 48 48" className="h-full w-full" fill="none" stroke="#F59E0B" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
            <path d="M24 6l4.5 9.5L39 17l-7.5 7.3 1.8 10.4L24 29.8l-9.3 4.9 1.8-10.4L9 17l10.5-1.5L24 6z" />
          </svg>
        )}

        {brand === 'music' && (
          <svg viewBox="0 0 48 48" className="h-full w-full" fill="none" stroke="#A855F7" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
            <path d="M18 36V12l22-4v24" />
            <circle cx="13" cy="36" r="5" />
            <circle cx="35" cy="32" r="5" />
          </svg>
        )}

        {brand === 'beauty' && (
          <svg viewBox="0 0 48 48" className="h-full w-full" fill="none" stroke="#F43F5E" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
            <path d="M24 6l3 9 9 3-9 3-3 9-3-9-9-3 9-3 3-9z" />
            <path d="M36 30l1.5 4.5L42 36l-4.5 1.5L36 42l-1.5-4.5L30 36l4.5-1.5L36 30z" />
          </svg>
        )}

        {brand === 'services' && (
          <svg viewBox="0 0 48 48" className="h-full w-full" fill="none" stroke="#F59E0B" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="24" cy="20" r="10" />
            <path d="M17 28l-3 14 10-5 10 5-3-14" />
          </svg>
        )}

        {brand === 'instagram' && (
          <svg viewBox="0 0 48 48" className="h-full w-full">
            <defs>
              <linearGradient id="igWatermarkGrad" x1="0%" y1="100%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#FCB045" />
                <stop offset="50%" stopColor="#FD1D1D" />
                <stop offset="100%" stopColor="#833AB4" />
              </linearGradient>
            </defs>
            <rect x="4" y="4" width="40" height="40" rx="12" fill="url(#igWatermarkGrad)" />
            <circle cx="24" cy="24" r="9" fill="none" stroke="#ffffff" strokeWidth="3.5" />
            <circle cx="34.5" cy="13.5" r="2.5" fill="#ffffff" />
          </svg>
        )}

        {brand === 'linkedin' && (
          <svg viewBox="0 0 48 48" className="h-full w-full">
            <path
              fill="#0A66C2"
              d="M42 4H6C4.9 4 4 4.9 4 6v36c0 1.1.9 2 2 2h36c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zM15.4 38.6h-6.2V18.7h6.2v19.9zM12.3 16c-2 0-3.6-1.6-3.6-3.6s1.6-3.6 3.6-3.6 3.6 1.6 3.6 3.6-1.6 3.6-3.6 3.6zm26.3 22.6h-6.2v-9.7c0-2.3 0-5.3-3.2-5.3s-3.7 2.5-3.7 5.1v9.9h-6.2V18.7h5.9v2.7h.1c.8-1.6 2.8-3.2 5.8-3.2 6.2 0 7.3 4.1 7.3 9.4v11z"
            />
          </svg>
        )}

        {brand === 'github' && (
          <svg viewBox="0 0 48 48" className="h-full w-full" fill="#FFFFFF">
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M24 4C12.95 4 4 12.95 4 24c0 8.84 5.73 16.34 13.68 18.99 1 .18 1.36-.43 1.36-.96 0-.47-.02-1.72-.03-3.38-5.56 1.21-6.73-2.68-6.73-2.68-.91-2.31-2.22-2.93-2.22-2.93-1.81-1.24.14-1.21.14-1.21 2 .14 3.06 2.06 3.06 2.06 1.78 3.05 4.67 2.17 5.81 1.66.18-1.29.7-2.17 1.27-2.67-4.44-.5-9.11-2.22-9.11-9.89 0-2.19.78-3.97 2.06-5.37-.21-.51-.89-2.54.2-5.3 0 0 1.68-.54 5.5 2.05A19.16 19.16 0 0124 16.37c1.7.01 3.42.23 5.02.68 3.81-2.59 5.49-2.05 5.49-2.05 1.1 2.76.42 4.79.21 5.3 1.28 1.4 2.05 3.18 2.05 5.37 0 7.69-4.68 9.38-9.14 9.87.72.62 1.36 1.85 1.36 3.73 0 2.7-.02 4.87-.02 5.53 0 .54.36 1.16 1.37.96C38.27 40.33 44 32.83 44 24c0-11.05-8.95-20-20-20z"
            />
          </svg>
        )}

        {brand === 'google' && (
          <svg viewBox="0 0 48 48" className="h-full w-full">
            <path
              fill="#EA4335"
              d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"
            />
            <path
              fill="#4285F4"
              d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"
            />
            <path
              fill="#FBBC05"
              d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"
            />
            <path
              fill="#34A853"
              d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"
            />
          </svg>
        )}
      </div>
    </>
  );
}
