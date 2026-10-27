'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { ReactNode, useEffect, useState } from 'react';

interface KonnexyPageIntroProps {
  children: ReactNode;
  duration?: number;
}

export function KonnexyPageIntro({
  children,
  duration = 1800
}: KonnexyPageIntroProps) {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const timer = window.setTimeout(
      () => setVisible(false),
      reduceMotion ? 250 : duration
    );

    return () => window.clearTimeout(timer);
  }, [duration]);

  return (
    <>
      {children}

      <AnimatePresence>
        {visible && (
          <motion.div
            key="konnexy-intro"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 1.025, filter: 'blur(8px)' }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="fixed inset-0 z-[9999] flex items-center justify-center overflow-hidden bg-[#031326]"
            aria-label="Abrindo Konnexy"
            role="status"
          >
            <div
              className="absolute inset-0 opacity-70"
              style={{
                background:
                  'radial-gradient(circle at 50% 34%, rgba(14,165,233,.22), transparent 27%), radial-gradient(circle at 72% 62%, rgba(37,99,235,.15), transparent 30%), linear-gradient(145deg, #031326 0%, #061b31 48%, #020814 100%)'
              }}
            />

            <div
              className="absolute inset-0 opacity-[0.15]"
              style={{
                backgroundImage:
                  'radial-gradient(circle, rgba(56,189,248,.9) 1px, transparent 1.5px)',
                backgroundSize: '26px 26px'
              }}
            />

            <motion.div
              initial={{ x: '-35%', opacity: 0 }}
              animate={{ x: '0%', opacity: 0.7 }}
              transition={{ duration: 0.75, ease: 'easeOut' }}
              className="absolute left-[-12vw] top-[12%] h-px w-[54vw] rotate-[-27deg] bg-gradient-to-r from-transparent via-cyan-400 to-transparent shadow-[0_0_18px_rgba(34,211,238,.7)]"
            />
            <motion.div
              initial={{ x: '35%', opacity: 0 }}
              animate={{ x: '0%', opacity: 0.55 }}
              transition={{ duration: 0.8, delay: 0.1, ease: 'easeOut' }}
              className="absolute bottom-[16%] right-[-12vw] h-px w-[58vw] rotate-[-30deg] bg-gradient-to-r from-transparent via-blue-500 to-transparent shadow-[0_0_20px_rgba(59,130,246,.75)]"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.82, y: 18 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.72, ease: [0.16, 1, 0.3, 1] }}
              className="relative z-10 flex w-full max-w-xl flex-col items-center px-6 text-center"
            >
              <div className="relative mb-5">
                <motion.div
                  initial={{ scale: 0.65, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.7, delay: 0.08, ease: 'easeOut' }}
                  className="absolute -inset-10 rounded-full bg-cyan-400/15 blur-3xl"
                />
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 9, repeat: Infinity, ease: 'linear' }}
                  className="absolute -inset-4 rounded-full border border-dashed border-cyan-300/25"
                />

                <motion.div
                  initial={{ scale: 0.84, rotate: -4 }}
                  animate={{ scale: [0.84, 1.03, 1], rotate: [-4, 1, 0] }}
                  transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
                  className="relative w-[280px] max-w-[78vw] overflow-hidden rounded-[2rem] border border-cyan-300/20 bg-[#061529]/60 p-2 shadow-[0_0_55px_rgba(34,211,238,.20)] sm:w-[340px]"
                >
                  <img
                    src="/logo.png"
                    alt="Konnexy"
                    className="h-auto w-full object-contain"
                  />
                  <div className="pointer-events-none absolute inset-0 bg-gradient-to-tr from-cyan-400/10 via-transparent to-amber-300/10" />
                </motion.div>
              </div>

              <motion.h1
                initial={{ opacity: 0, letterSpacing: '0.18em', y: 12 }}
                animate={{ opacity: 1, letterSpacing: '0.05em', y: 0 }}
                transition={{ duration: 0.65, delay: 0.18, ease: 'easeOut' }}
                className="bg-gradient-to-r from-[#e8c170] via-[#f8fbff] to-[#d7a845] bg-clip-text text-4xl font-black uppercase text-transparent drop-shadow-[0_0_22px_rgba(255,255,255,.08)] sm:text-5xl"
              >
                Konnexy
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.45, delay: 0.42 }}
                className="mt-2 text-[10px] font-semibold uppercase tracking-[0.28em] text-slate-300 sm:text-xs"
              >
                Soluções digitais para negócios
              </motion.p>

              <motion.div
                initial={{ opacity: 0, scaleX: 0.4 }}
                animate={{ opacity: 1, scaleX: 1 }}
                transition={{ duration: 0.5, delay: 0.52 }}
                className="mt-5 flex items-center gap-3 text-[10px] font-bold uppercase tracking-[0.32em] text-slate-400"
              >
                <span>Conecta</span>
                <span className="h-1.5 w-1.5 rounded-full bg-cyan-400 shadow-[0_0_12px_rgba(34,211,238,.9)]" />
                <span>Organiza</span>
                <span className="h-1.5 w-1.5 rounded-full bg-cyan-400 shadow-[0_0_12px_rgba(34,211,238,.9)]" />
                <span>Vende</span>
              </motion.div>

              <div className="mt-8 h-[3px] w-40 overflow-hidden rounded-full bg-white/10">
                <motion.div
                  initial={{ x: '-100%' }}
                  animate={{ x: '0%' }}
                  transition={{ duration: Math.max(0.9, duration / 1000 - 0.25), ease: 'easeInOut' }}
                  className="h-full w-full bg-gradient-to-r from-cyan-400 via-blue-500 to-amber-400 shadow-[0_0_16px_rgba(56,189,248,.65)]"
                />
              </div>
            </motion.div>

            <div className="pointer-events-none absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-black/35 to-transparent" />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
