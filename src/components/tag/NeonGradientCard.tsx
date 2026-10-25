'use client';

import React from 'react';
import { cn } from '@/lib/utils';

export interface NeonColorsProps {
  firstColor: string;
  secondColor: string;
}

export interface NeonGradientCardProps extends React.HTMLAttributes<HTMLDivElement> {
  as?: React.ElementType;
  className?: string;
  innerClassName?: string;
  children?: React.ReactNode;
  borderSize?: number;
  borderRadius?: number;
  neonColors?: NeonColorsProps;
}

/**
 * NeonGradientCard
 * Renderiza borda e aura neon intensas com isolamento de stacking context,
 * garantindo que a borda luminosa envolva cada quadro com nitidez.
 */
export const NeonGradientCard: React.FC<NeonGradientCardProps> = ({
  className,
  innerClassName,
  children,
  borderSize = 2,
  borderRadius = 22,
  neonColors = {
    firstColor: '#f59e0b',
    secondColor: '#6366f1'
  },
  style,
  ...props
}) => {
  const innerRadius = Math.max(8, borderRadius - borderSize);

  return (
    <div
      style={{
        position: 'relative',
        isolation: 'isolate',
        width: '100%',
        borderRadius: `${borderRadius}px`,
        padding: `${borderSize}px`,
        backgroundImage: `linear-gradient(135deg, ${neonColors.firstColor}, ${neonColors.secondColor}, ${neonColors.firstColor})`,
        backgroundSize: '200% 200%',
        boxShadow: `0 0 22px -4px ${neonColors.firstColor}55, 0 0 22px -4px ${neonColors.secondColor}55`,
        ...style
      }}
      className={cn('relative w-full transition-all duration-300', className)}
      {...props}
    >
      {/* Aura Neon Difusa Externa */}
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          top: -2,
          right: -2,
          bottom: -2,
          left: -2,
          zIndex: 0,
          pointerEvents: 'none',
          borderRadius: `${borderRadius + 2}px`,
          backgroundImage: `linear-gradient(135deg, ${neonColors.firstColor}, ${neonColors.secondColor})`,
          filter: 'blur(16px)',
          opacity: 0.42
        }}
      />

      {/* Superfície Interna de Alto Contraste (sem borda interna para não cobrir o neon) */}
      <div
        style={{
          position: 'relative',
          zIndex: 1,
          width: '100%',
          borderRadius: `${innerRadius}px`
        }}
        className={cn(
          'relative w-full bg-zinc-900/95 text-zinc-100 p-5 backdrop-blur-md',
          innerClassName
        )}
      >
        {children}
      </div>
    </div>
  );
};
