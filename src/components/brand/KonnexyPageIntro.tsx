'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { ReactNode, useEffect, useRef, useState } from 'react';

interface KonnexyPageIntroProps {
  children: ReactNode;
}

const INTRO_TOTAL_MS = 5000;
const EXIT_TRANSITION_MS = 250;
const VIDEO_PLAY_TIME_SECONDS = (INTRO_TOTAL_MS - EXIT_TRANSITION_MS) / 1000;

export function KonnexyPageIntro({ children }: KonnexyPageIntroProps) {
  const [visible, setVisible] = useState(true);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (reduceMotion) {
      const reducedTimer = window.setTimeout(() => setVisible(false), 300);
      return () => window.clearTimeout(reducedTimer);
    }

    // Fecha a abertura a tempo de concluir a transição em aproximadamente 5s.
    const fallbackTimer = window.setTimeout(
      () => setVisible(false),
      INTRO_TOTAL_MS - EXIT_TRANSITION_MS,
    );

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

  const handleLoadedMetadata = () => {
    const video = videoRef.current;
    if (!video || !Number.isFinite(video.duration) || video.duration <= 0) return;

    // Acelera apenas quando necessário para o vídeo caber na abertura de 5s.
    video.playbackRate = Math.max(1, video.duration / VIDEO_PLAY_TIME_SECONDS);
  };

  return (
    <>
      {children}

      <AnimatePresence>
        {visible && (
          <motion.div
            key="konnexy-video-intro"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 1.015, filter: 'blur(6px)' }}
            transition={{ duration: EXIT_TRANSITION_MS / 1000, ease: [0.22, 1, 0.36, 1] }}
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
              onLoadedMetadata={handleLoadedMetadata}
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
