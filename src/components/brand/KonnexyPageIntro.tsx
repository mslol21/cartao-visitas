'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { ReactNode, useEffect, useRef, useState } from 'react';

interface KonnexyPageIntroProps {
  children: ReactNode;
}

export function KonnexyPageIntro({ children }: KonnexyPageIntroProps) {
  const [visible, setVisible] = useState(true);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (reduceMotion) {
      const reducedTimer = window.setTimeout(() => setVisible(false), 300);
      return () => window.clearTimeout(reducedTimer);
    }

    const fallbackTimer = window.setTimeout(() => setVisible(false), 8000);

    const video = videoRef.current;
    if (video) {
      const playPromise = video.play();
      if (playPromise) {
        playPromise.catch(() => {
          // Mantém o fallback para navegadores que bloqueiem autoplay.
        });
      }
    }

    return () => window.clearTimeout(fallbackTimer);
  }, []);

  return (
    <>
      {children}

      <AnimatePresence>
        {visible && (
          <motion.div
            key="konnexy-video-intro"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 1.015, filter: 'blur(6px)' }}
            transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
            className="fixed inset-0 z-[9999] overflow-hidden bg-[#020914]"
            role="status"
            aria-label="Abrindo Konnexy"
          >
            <video
              ref={videoRef}
              src="/videos/gemini_generated_video_060b81f8.mp4"
              autoPlay
              muted
              playsInline
              preload="auto"
              onEnded={() => setVisible(false)}
              className="absolute inset-0 h-full w-full object-contain"
            />

            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/20"
            />

            <button
              type="button"
              onClick={() => setVisible(false)}
              className="absolute bottom-[max(1.25rem,env(safe-area-inset-bottom))] right-5 z-10 rounded-full border border-white/15 bg-black/35 px-4 py-2 text-xs font-semibold uppercase tracking-[0.14em] text-white/80 backdrop-blur-md transition hover:bg-black/55 hover:text-white focus:outline-none focus:ring-2 focus:ring-cyan-400/70"
            >
              Pular
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
