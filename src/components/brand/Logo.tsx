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
      className={cn("flex items-center gap-3.5 group cursor-pointer", className)}
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.02 }}
      transition={{ type: "spring", stiffness: 400, damping: 17 }}
    >
      <div className="relative shrink-0">
        <div className="absolute -inset-2 rounded-full bg-cyan-400/20 blur-xl opacity-60 transition-opacity duration-500 group-hover:opacity-100" />

        <div className="relative z-10 h-12 w-14 md:h-14 md:w-16 overflow-hidden rounded-2xl border border-cyan-300/20 bg-[#061529] shadow-[0_0_24px_rgba(0,174,255,0.16)] transition-all duration-300 group-hover:border-cyan-300/45 group-hover:shadow-[0_0_30px_rgba(0,174,255,0.28)]">
          <img
            src="/logo-konnexy-koi.jpg"
            alt="Konnexy — koi tecnológico"
            className="h-full w-full object-cover object-center scale-[1.04]"
          />
        </div>
      </div>

      {!isSmall && (
        <div className="flex min-w-0 flex-col justify-center">
          <div className="flex items-center gap-2">
            <span className="bg-gradient-to-r from-[#e8c170] via-[#eef4ff] to-[#d6a94d] bg-clip-text font-display text-xl font-black uppercase leading-none tracking-[0.03em] text-transparent drop-shadow-[0_1px_8px_rgba(91,185,255,0.16)] md:text-2xl">
              Konnexy
            </span>
            {isPro && (
              <span className="rounded-md border border-cyan-300/20 bg-cyan-400/10 px-1.5 py-0.5 text-[8px] font-black uppercase tracking-wider text-cyan-200">
                PRO
              </span>
            )}
          </div>

          {showTagline && (
            <div className="mt-1.5 flex flex-col">
              <span className="whitespace-nowrap text-[9px] font-bold uppercase leading-none tracking-[0.2em] text-slate-300 md:text-[10px]">
                CONECTA <span className="text-cyan-400">•</span> ORGANIZA <span className="text-cyan-400">•</span> VENDE
              </span>
              <div className="mt-1.5 flex items-center gap-1.5">
                <div className="h-px w-7 rounded-full bg-gradient-to-r from-[#d6a94d] via-[#eef4ff] to-cyan-400" />
                <div className="h-px flex-1 bg-white/10" />
              </div>
            </div>
          )}
        </div>
      )}
    </motion.div>
  );
}
