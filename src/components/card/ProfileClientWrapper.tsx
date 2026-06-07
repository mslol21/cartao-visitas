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
  isDarkCard?: boolean;
}

export function ProfileClientWrapper({ profile, themeColor, isDarkCard = false }: ProfileClientWrapperProps) {
  const isPro = profile.plan === 'pro';

  return (
    <>
      {/* Global Background (Only for Pro) */}
      {isPro && profile.background_video_url && (
        <div className="fixed inset-0 z-[-2] pointer-events-none bg-slate-950 overflow-hidden">
          {/* Background media: cover, anchored at top */}
          {profile.background_video_url.match(/\.(mp4|webm|ogg|mov)$/i) ? (
            <video
              src={profile.background_video_url}
              autoPlay
              muted
              loop
              playsInline
              className="absolute inset-0 w-full h-full object-cover"
              style={{ objectPosition: 'center 20%' }}
            />
          ) : (
            <div 
              className="absolute inset-0 w-full h-full"
              style={{ 
                backgroundImage: `url('${profile.background_video_url}')`,
                backgroundSize: 'cover',
                backgroundPosition: 'center 20%'
              }}
            />
          )}
          {/* Premium Dark Overlay — topo visível, fundo escuro para o conteúdo */}
          <div 
            className="absolute inset-0 z-10"
            style={{ background: 'linear-gradient(to bottom, rgba(11,26,43,0.5), rgba(11,26,43,0.97))' }}
          />
        </div>
      )}

      {/* Premium Background Noise (Only for Pro) */}
      {isPro ? (
        <div className="fixed inset-0 pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03] contrast-150 brightness-100 z-0 mix-blend-overlay" />
      ) : (
        // Overlay neutro: invisível sobre fundos escuros, imperceptível sobre fundos claros
        <div className={`fixed inset-0 pointer-events-none z-0 transition-all duration-1000 ${isDarkCard ? 'opacity-0' : 'bg-slate-100/30'}`} />
      )}

      <div className="relative w-full max-w-[400px] flex flex-col items-center">
        {/* Card Aura Effect (Only for Pro) */}
        {isPro && (
          <div className="absolute -inset-[100px] pointer-events-none z-[-1] overflow-visible">
            <div 
              className="absolute top-[5%] left-1/2 -translate-x-1/2 w-[120%] h-[40%] rounded-full blur-[100px] opacity-[0.25] dark:opacity-[0.15] animate-pulse-slow transition-colors duration-1000 mix-blend-screen"
              style={{ backgroundColor: themeColor }} 
            />
            <div 
              className="absolute bottom-[20%] left-1/2 -translate-x-1/2 w-[110%] h-[40%] rounded-full blur-[120px] opacity-[0.2] dark:opacity-[0.1] transition-colors duration-1000 mix-blend-screen"
              style={{ backgroundColor: themeColor }} 
            />
          </div>
        )}

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
