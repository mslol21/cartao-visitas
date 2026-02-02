"use client";

import { motion } from 'framer-motion';
import Link from 'next/link';
import { CardPreview } from './CardPreview';
import { Profile } from '@/types/profile';
import Image from 'next/image';
import { cn } from '@/lib/utils';

interface ProfileClientWrapperProps {
  profile: Profile;
  themeColor: string;
}

export function ProfileClientWrapper({ profile, themeColor }: ProfileClientWrapperProps) {
  const isPro = profile.plan === 'pro';

  return (
    <>
      {/* Premium Mesh Gradient Background (Only for Pro) */}
      {isPro ? (
        <div className="fixed inset-0 pointer-events-none">
          <div 
            className="absolute top-[-20%] left-[-10%] w-[70%] h-[70%] rounded-full blur-[120px] opacity-[0.15] dark:opacity-[0.1] animate-pulse-slow transition-all duration-1000"
            style={{ backgroundColor: themeColor }} 
          />
          <div 
            className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] rounded-full blur-[120px] opacity-[0.1] dark:opacity-[0.05]"
            style={{ backgroundColor: themeColor }} 
          />
          <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.05] contrast-150 brightness-100" />
        </div>
      ) : (
        <div className="fixed inset-0 pointer-events-none bg-slate-50 dark:bg-slate-950 opacity-40 transition-all duration-1000" />
      )}

      <div className="relative w-full max-w-[400px] flex flex-col items-center">
        <CardPreview
          data={profile}
          showBranding={profile.plan !== 'pro'}
        />

        {/* Dynamic Trust Badge for Platform (Only for Free) */}
        {!isPro && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.6 }}
            className="mt-12 flex flex-col items-center gap-6"
          >
            <Link
              href="/"
              className="group relative flex items-center gap-3 px-6 py-3 rounded-full bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 shadow-xl hover:shadow-2xl transition-all hover:-translate-y-1"
            >
              <div className="flex -space-x-1.5">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="w-5 h-5 rounded-full border-2 border-white dark:border-slate-800 bg-slate-100 dark:bg-slate-700 overflow-hidden relative">
                    <Image 
                      src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${i + 123}`} 
                      alt={`User ${i}`} 
                      fill
                      className="object-cover"
                    />
                  </div>
                ))}
              </div>
              <p className="text-[11px] font-bold text-slate-600 dark:text-slate-300">
                3k+ profissionais já usam <span className="text-primary tracking-tight">Konnexy</span>
              </p>
            </Link>
            
            <div className="flex flex-col items-center gap-2">
              <p className="text-[10px] text-slate-400 dark:text-slate-600 font-black uppercase tracking-[0.25em]">
                Sustentável • Digital • Profissional
              </p>
            </div>
          </motion.div>
        )}
      </div>
    </>
  );
}
