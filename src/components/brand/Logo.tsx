"use client";
import React from 'react';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

interface LogoProps {
  className?: string;
  variant?: 'horizontal' | 'icon' | 'mono' | 'pro';
  showTagline?: boolean;
}

export function Logo({ className, variant = 'horizontal', showTagline = true }: LogoProps) {
  const isSmall = variant === 'icon' || variant === 'mono';
  const isPro = variant === 'pro';

  return (
    <motion.div
      className={cn("flex min-w-0 items-center gap-2.5 sm:gap-3.5 group", className)}
      initial={{ opacity: 0, y: -6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2, ease: "easeOut" }}
    >
      <div className="relative shrink-0">
        <div className="absolute -inset-1.5 rounded-full bg-cyan-400/15 blur-lg opacity-60 sm:-inset-2 sm:blur-xl" />

        <div className="relative z-10 h-9 w-10 overflow-hidden rounded-xl border border-cyan-300/20 bg-[#061529] shadow-[0_0_18px_rgba(0,174,255,0.14)] sm:h-11 sm:w-12 md:h-12 md:w-14">
          <img
            src="/logo-konnexy-koi.jpg"
            alt="Konnexy"
            className="h-full w-full object-cover object-center scale-[1.04]"
          />
        </div>
      </div>

      {!isSmall && (
        <div className="flex min-w-0 flex-col justify-center">
          <div className="flex min-w-0 items-center gap-1.5 sm:gap-2">
            <span className="truncate bg-gradient-to-r from-[#e8c170] via-[#eef4ff] to-[#d6a94d] bg-clip-text font-display text-[17px] font-black uppercase leading-none tracking-[0.02em] text-transparent sm:text-xl md:text-2xl">
              Konnexy
            </span>
            {isPro && (
              <span className="shrink-0 rounded-md border border-cyan-300/20 bg-cyan-400/10 px-1.5 py-0.5 text-[7px] font-black uppercase tracking-wider text-cyan-200 sm:text-[8px]">
                PRO
              </span>
            )}
          </div>

          {showTagline && (
            <div className="mt-1 hidden flex-col sm:flex">
              <span className="whitespace-nowrap text-[8px] font-bold uppercase leading-none tracking-[0.16em] text-slate-300 md:text-[9px]">
                CONECTA <span className="text-cyan-400">•</span> ORGANIZA <span className="text-cyan-400">•</span> VENDE
              </span>
              <div className="mt-1.5 flex items-center gap-1.5">
                <div className="h-px w-6 rounded-full bg-gradient-to-r from-[#d6a94d] via-[#eef4ff] to-cyan-400" />
                <div className="h-px flex-1 bg-white/10" />
              </div>
            </div>
          )}
        </div>
      )}
    </motion.div>
  );
}
