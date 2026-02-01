"use client";

import React from 'react';
import { motion } from 'framer-motion';

interface PhoneFrameProps {
  children: React.ReactNode;
}

export function PhoneFrame({ children }: PhoneFrameProps) {
  return (
    <div className="relative mx-auto w-full max-w-[320px] sm:max-w-[340px] aspect-[9/18.5]">
      {/* Premium Outer Chassis */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="absolute inset-0 border-[10px] border-slate-900 rounded-[3.5rem] shadow-[0_50px_100px_-20px_rgba(0,0,0,0.5)] bg-slate-900 overflow-hidden"
      >
        {/* Dynamic Island / Notch */}
        <div className="absolute top-2 left-1/2 -translate-x-1/2 w-28 h-7 bg-black rounded-3xl z-50 flex items-center justify-center p-1.5 overflow-hidden">
          <div className="w-1.5 h-1.5 rounded-full bg-blue-500/50 mr-2" />
          <div className="w-4 h-1 rounded-full bg-slate-800" />
        </div>
        
        {/* Screen Content Container */}
        <div className="h-full w-full overflow-y-auto scroll-hide bg-slate-50 dark:bg-slate-950 pt-2">
          {children}
        </div>
        
        {/* Side Buttons */}
        <div className="absolute top-20 -left-[12px] w-[2px] h-8 bg-slate-800 rounded-r-sm" />
        <div className="absolute top-32 -left-[12px] w-[2px] h-12 bg-slate-800 rounded-r-sm" />
        <div className="absolute top-28 -right-[12px] w-[2px] h-16 bg-slate-800 rounded-l-sm" />
      </motion.div>
      
      {/* Decorative Shine Overlay */}
      <div className="absolute inset-4 pointer-events-none rounded-[2.5rem] bg-gradient-to-tr from-white/5 to-transparent z-40" />
    </div>
  );
}
