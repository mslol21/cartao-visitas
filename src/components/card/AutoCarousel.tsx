"use client";

import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

interface AutoCarouselProps {
  images: string[];
  themeHex?: string;
  label?: string;
  isPro?: boolean;
  /** Intervalo em ms entre cada slide (default: 3500) */
  interval?: number;
  /** Proporção do container (default: '4/5') */
  aspectRatio?: '1/1' | '4/3' | '4/5' | '16/9';
}

export function AutoCarousel({
  images,
  themeHex = '#f59e0b',
  label = 'Portfólio',
  isPro = true,
  interval = 3500,
  aspectRatio = '4/5',
}: AutoCarouselProps) {
  const [current, setCurrent] = useState(0);
  const [isHovered, setPaused] = useState(false);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const goTo = useCallback((index: number) => {
    setCurrent((index + images.length) % images.length);
  }, [images.length]);

  const next = useCallback(() => goTo(current + 1), [current, goTo]);
  const prev = useCallback(() => goTo(current - 1), [current, goTo]);

  // Auto-advance
  useEffect(() => {
    if (isHovered || images.length <= 1) return;
    timerRef.current = setTimeout(next, interval);
    return () => { if (timerRef.current) clearTimeout(timerRef.current); };
  }, [current, isHovered, images.length, interval, next]);

  // Touch / swipe support
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.touches[0].clientX);
  };
  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStart === null) return;
    const diff = touchStart - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 40) diff > 0 ? next() : prev();
    setTouchStart(null);
  };

  if (!images.length) return null;

  const aspectClass = {
    '1/1': 'aspect-square',
    '4/3': 'aspect-[4/3]',
    '4/5': 'aspect-[4/5]',
    '16/9': 'aspect-video',
  }[aspectRatio];

  return (
    <div className="w-full space-y-3">
      {/* Section header */}
      <div className="flex items-center gap-3 px-1 mb-1">
        <span
          className="text-[10px] font-black uppercase tracking-[0.3em]"
          style={{ color: themeHex, opacity: 0.8 }}
        >
          {label}
        </span>
        <div className="h-[1px] flex-1" style={{ backgroundColor: themeHex + '30' }} />
        <span className="text-[9px] font-bold opacity-30 tabular-nums">
          {current + 1}/{images.length}
        </span>
      </div>

      {/* Carousel container */}
      <div
        className={cn(
          'relative w-full rounded-[2rem] overflow-hidden shadow-2xl cursor-pointer select-none',
          aspectClass,
          isPro
            ? 'border border-white/10 ring-1 ring-white/5'
            : 'border border-slate-200'
        )}
        style={{ boxShadow: `0 24px 60px -12px ${themeHex}30` }}
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        {/* Images */}
        <AnimatePresence mode="wait">
          <motion.div
            key={current}
            className="absolute inset-0 w-full h-full"
            initial={{ opacity: 0, scale: 1.04 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.97 }}
            transition={{ duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] }}
          >
            <img
              src={images[current]}
              alt={`${label} ${current + 1}`}
              className="w-full h-full object-cover"
              loading="eager"
            />
            {/* Gradient overlay at bottom */}
            <div className="absolute inset-x-0 bottom-0 h-2/5 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
          </motion.div>
        </AnimatePresence>

        {/* Progress bar */}
        {images.length > 1 && (
          <div className="absolute top-3 inset-x-3 flex gap-1 z-20">
            {images.map((_, i) => (
              <button
                key={i}
                onClick={() => goTo(i)}
                className="flex-1 h-[3px] rounded-full overflow-hidden bg-white/20 backdrop-blur-sm"
                aria-label={`Slide ${i + 1}`}
              >
                {i === current ? (
                  <motion.div
                    key={current}
                    className="h-full rounded-full origin-left"
                    style={{ backgroundColor: themeHex }}
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: isHovered ? 0 : 1 }}
                    transition={{
                      duration: isHovered ? 0 : interval / 1000,
                      ease: 'linear',
                    }}
                  />
                ) : (
                  <div
                    className="h-full rounded-full"
                    style={{
                      backgroundColor: i < current ? themeHex : 'transparent',
                      opacity: i < current ? 0.8 : 0,
                    }}
                  />
                )}
              </button>
            ))}
          </div>
        )}

        {/* Bottom info overlay */}
        <div className="absolute inset-x-0 bottom-0 z-10 px-5 pb-4 pt-8">
          <div className="flex items-center justify-between">
            {/* Dot indicators */}
            {images.length > 1 && (
              <div className="flex gap-1.5">
                {images.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => goTo(i)}
                    className={cn(
                      'rounded-full transition-all duration-300',
                      i === current
                        ? 'w-5 h-2'
                        : 'w-2 h-2 opacity-40'
                    )}
                    style={{ backgroundColor: i === current ? themeHex : 'white' }}
                    aria-label={`Ir para slide ${i + 1}`}
                  />
                ))}
              </div>
            )}
            {/* Auto-play indicator */}
            {images.length > 1 && (
              <div
                className="flex items-center gap-1.5 px-2.5 py-1 rounded-full backdrop-blur-md"
                style={{ backgroundColor: 'rgba(0,0,0,0.35)' }}
              >
                <div
                  className={cn(
                    'w-1.5 h-1.5 rounded-full transition-colors',
                    isHovered ? 'bg-white/40' : 'bg-green-400'
                  )}
                />
                <span className="text-[8px] font-black text-white/60 uppercase tracking-widest">
                  {isHovered ? 'pausado' : 'auto'}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
