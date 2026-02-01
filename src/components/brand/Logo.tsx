import React from 'react';
import { cn } from '@/lib/utils';

interface LogoProps {
  className?: string;
  variant?: 'horizontal' | 'icon' | 'mono' | 'pro';
  showTagline?: boolean;
}

export function Logo({ className, variant = 'horizontal', showTagline = true }: LogoProps) {
  if (variant === 'icon') {
    return (
      <svg
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={cn("w-10 h-10", className)}
      >
        <circle cx="50" cy="50" r="48" fill="#1E293B" />
        <circle cx="50" cy="50" r="40" stroke="#4ADE80" strokeWidth="4" />
        <path
          d="M35 30V70M35 50L65 30M35 55L65 75"
          stroke="white"
          strokeWidth="8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path d="M50 35L35 50L55 65" fill="#4ADE80" opacity="0.3" />
      </svg>
    );
  }

  if (variant === 'mono' || variant === 'pro') {
    return (
      <div className={cn("flex items-center gap-3", className)}>
        <svg
          viewBox="0 0 100 100"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-8 h-8"
        >
          <path
            d="M30 50C30 38.9543 38.9543 30 50 30C61.0457 30 70 38.9543 70 50C70 61.0457 61.0457 70 50 70C38.9543 70 30 61.0457 30 50Z"
            stroke="currentColor"
            strokeWidth="8"
          />
          <path
            d="M50 50C50 38.9543 58.9543 30 70 30C81.0457 30 90 38.9543 90 50C90 61.0457 81.0457 70 70 70C58.9543 70 50 61.0457 50 50Z"
            stroke="currentColor"
            strokeWidth="8"
          />
        </svg>
        <span className="text-2xl font-black tracking-tight">Konnexy</span>
      </div>
    );
  }

  return (
    <div className={cn("flex flex-col", className)}>
      <div className="flex items-center gap-4">
        <Logo variant="icon" className="w-12 h-12" />
        <span className="text-4xl font-black tracking-tight text-[#1E293B] dark:text-white">
          Konnexy
        </span>
      </div>
      {showTagline && (
        <span className="text-[14px] font-bold text-[#4ADE80] mt-1 ml-16 uppercase tracking-widest">
          sua identidade conectada
        </span>
      )}
    </div>
  );
}
