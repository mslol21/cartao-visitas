"use client";

import { PhoneFrame } from './PhoneFrame';
import { CardPreview } from '@/components/card/CardPreview';
import { MusicProfileView } from '@/components/music/MusicProfileView';
import { isMusicProfession } from '@/types/music';
import { Profile } from '@/types/profile';
import { motion } from 'framer-motion';
import { Smartphone, Eye } from 'lucide-react';
import { isPaidUser } from '@/utils/planUtils';

interface LivePreviewProps {
  data: Partial<Profile>;
}

export function LivePreview({ data }: LivePreviewProps) {
  const isPaid = isPaidUser(data as Profile);
  const isMusic = isMusicProfession(data.profession) || Boolean((data.custom_fields as any)?.music_pro?.config?.enabled);
  
  return (
    <div className="flex flex-col items-center">
      <div className="w-full flex items-center justify-between mb-8 px-2">
        <h2 className="text-xs font-black uppercase tracking-[0.25em] text-muted-foreground flex items-center gap-2">
          <Eye className="w-4 h-4" /> Preview
        </h2>
        <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-[10px] font-bold text-slate-500">
          <Smartphone className="w-3 h-3" /> {isMusic ? 'Konnexy Music' : 'Mobile View'}
        </div>
      </div>
      
      <PhoneFrame>
        {isMusic ? (
          <div className="h-full overflow-y-auto scroll-hide">
            <MusicProfileView profile={data as Profile} isPreview={true} />
          </div>
        ) : (
          <CardPreview
            data={data}
            showBranding={!isPaid}
            suppressTracking={true}
            forceProPreview={true}
          />
        )}
      </PhoneFrame>
      
      <motion.p 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        className="mt-8 text-[10px] font-bold uppercase tracking-widest text-muted-foreground/40 text-center"
      >
        Segure e arraste para visualizar o scroll
      </motion.p>
    </div>
  );
}
