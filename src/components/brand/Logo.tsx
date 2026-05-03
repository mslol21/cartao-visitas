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
      <div className="relative">
        {/* Glow effect background that reacts to hover */}
        <div className="absolute -inset-2 bg-gradient-to-r from-amber-500/20 to-orange-600/20 blur-xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        
        <img 
          src="/logo.png" 
          alt="Konnexy" 
          className={cn(
            "relative z-10 object-contain transition-all duration-500",
            isSmall ? "w-12 h-12" : "h-16 w-auto",
            "filter drop-shadow-[0_2px_8px_rgba(0,0,0,0.3)] group-hover:drop-shadow-[0_0_20px_rgba(245,158,11,0.4)]"
          )} 
        />
      </div>

      {!isSmall && (
        <div className="flex flex-col justify-center">
          {showTagline && (
            <div className="flex flex-col">
              <span className="text-[11px] font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-orange-500 to-amber-600 uppercase tracking-[0.3em] leading-none mb-1.5 drop-shadow-sm">
                CONECTA • ORGANIZA • VENDE
              </span>
              <div className="flex items-center gap-2">
                <div className="h-[2px] w-8 bg-gradient-to-r from-amber-500 to-orange-600 rounded-full" />
                <div className="h-[1px] flex-1 bg-white/5 group-hover:bg-white/10 transition-colors" />
              </div>
            </div>
          )}
        </div>
      )}
    </motion.div>
  );
}
