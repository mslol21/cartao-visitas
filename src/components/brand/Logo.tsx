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
  const isSmall = variant === 'icon' || variant === 'mono' || variant === 'pro';

  return (
    <motion.div 
      className={cn("flex items-center gap-4 group cursor-pointer", className)}
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.02 }}
      transition={{ type: "spring", stiffness: 400, damping: 17 }}
    >
      <div className="relative shrink-0">
        {/* Glow effect background that reacts to hover */}
        <div className="absolute -inset-2 bg-gradient-to-r from-[#00D4FF]/25 to-[#0D5B80]/25 blur-xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        
        <div className="relative z-10 w-10 h-10 md:w-11 md:h-11 rounded-xl bg-slate-900 border border-white/10 flex items-center justify-center p-1.5 shadow-lg group-hover:border-[#00D4FF]/30 transition-colors">
          <img 
            src="/logo.png" 
            alt="Konnexy Icon" 
            className="w-full h-full object-contain filter drop-shadow-[0_2px_4px_rgba(0,0,0,0.4)]"
          />
        </div>
      </div>

      {!isSmall && (
        <div className="flex flex-col justify-center">
          <div className="flex items-center gap-2">
            <span className="font-display font-black text-lg md:text-xl tracking-tight text-white leading-none group-hover:text-[#00D4FF] transition-colors">
              Konnexy
            </span>
            {variant === 'pro' && (
              <span className="text-[8px] bg-gradient-to-r from-[#00D4FF] to-[#0D5B80] text-slate-950 font-black px-1.5 py-0.5 rounded-sm uppercase tracking-wider">
                PRO
              </span>
            )}
          </div>
          {showTagline && (
            <div className="flex flex-col mt-1.5">
              <span className="text-[10px] font-black text-transparent bg-clip-text bg-gradient-to-r from-[#00D4FF] via-[#0D5B80] to-[#00D4FF] uppercase tracking-[0.25em] leading-none mb-1 drop-shadow-sm">
                CONECTA • ORGANIZA • VENDE
              </span>
              <div className="flex items-center gap-1.5">
                <div className="h-[2px] w-6 bg-gradient-to-r from-[#00D4FF] to-[#0D5B80] rounded-full" />
                <div className="h-[1px] flex-1 bg-white/5" />
              </div>
            </div>
          )}
        </div>
      )}
    </motion.div>
  );
}
