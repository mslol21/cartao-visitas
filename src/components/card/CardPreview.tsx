"use client";

import { 
  MapPin, 
  Globe, 
  Instagram, 
  MessageCircle, 
  Share2, 
  Linkedin, 
  Facebook, 
  Twitter, 
  Youtube,
  Trophy,
  CheckCircle2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Profile } from '@/types/profile';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

interface CardPreviewProps {
  data: Partial<Profile>;
  showBranding?: boolean;
}

export function CardPreview({ data, showBranding = true }: CardPreviewProps) {
  const isPro = data.plan === 'pro';
  
  const whatsappLink = data.whatsapp
    ? `https://wa.me/${data.whatsapp.replace(/\D/g, '')}?text=${encodeURIComponent('Olá! Vi seu ConnectCard e gostaria de saber mais sobre seus serviços.')}`
    : '#';

  const socialLinks = [
    { id: 'instagram', icon: Instagram, value: data.instagram, url: `https://instagram.com/${data.instagram}` },
    { id: 'linkedin', icon: Linkedin, iconColor: 'text-[#0077b5]', value: data.linkedin, url: `https://linkedin.com/in/${data.linkedin}` },
    { id: 'facebook', icon: Facebook, iconColor: 'text-[#1877f2]', value: data.facebook, url: `https://facebook.com/${data.facebook}` },
    { id: 'twitter', icon: Twitter, iconColor: 'text-[#1da1f2]', value: data.twitter, url: `https://twitter.com/${data.twitter}` },
    { id: 'youtube', icon: Youtube, iconColor: 'text-[#ff0000]', value: data.youtube, url: `https://youtube.com/@${data.youtube}` },
    { id: 'tiktok', icon: Globe, iconColor: 'text-[#000000]', value: data.tiktok, url: `https://tiktok.com/@${data.tiktok}` },
    { id: 'website', icon: Globe, iconColor: 'text-primary', value: data.website, url: data.website?.startsWith('http') ? data.website : `https://${data.website}` },
  ];

  // Limit socials for free users
  const activeSocials = isPro 
    ? socialLinks.filter(s => s.value)
    : socialLinks.filter(s => s.id === 'instagram' && s.value);

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: data.name || 'ConnectCard',
        text: data.tagline || 'Confira meu perfil profissional',
        url: typeof window !== 'undefined' ? window.location.href : '',
      });
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full max-w-sm mx-auto group/card"
    >
      <div className="relative bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden rounded-[3rem]">
        
        {/* Premium Header */}
        <div 
          className="h-32 relative overflow-hidden transition-colors duration-500"
          style={{ backgroundColor: data.theme_color || '#3b82f6' }}
        >
          <div className="absolute inset-0 opacity-20 bg-hero-pattern" />
          <div className="absolute -top-12 -right-12 w-48 h-48 bg-white/20 rounded-full blur-3xl animate-pulse-slow" />
          
          {isPro && (
            <div className="absolute top-4 right-6 flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md border border-white/30 text-white text-[10px] font-bold uppercase tracking-wider">
              <Trophy className="w-3 h-3" />
              Premium
            </div>
          )}
        </div>

        {/* Profile Section */}
        <div className="px-8 pb-10 -mt-16 relative z-10">
          {/* Avatar Area */}
          <div className="relative w-32 h-32 mx-auto mb-6">
            <motion.div 
              whileHover={{ scale: 1.05 }}
              className="absolute inset-0 rounded-full bg-white dark:bg-slate-800 shadow-2xl p-1.5"
            >
              <div className="w-full h-full rounded-full overflow-hidden bg-slate-100 dark:bg-slate-700 flex items-center justify-center relative border border-slate-200 dark:border-slate-700">
                {data.photo_url ? (
                  <img
                    src={data.photo_url}
                    alt={data.name || ''}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-4xl font-bold text-slate-400">
                    {data.name?.charAt(0) || '?'}
                  </span>
                )}
              </div>
            </motion.div>
            
            {/* Verified Badge */}
            {(data.verified || isPro) && (
              <motion.div 
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                delay={0.5}
                className="absolute bottom-1 right-1 bg-white dark:bg-slate-900 rounded-full p-1 shadow-lg"
              >
                <CheckCircle2 className="w-6 h-6 text-primary fill-current text-blue-500" />
              </motion.div>
            )}
          </div>

          {/* Identity */}
          <div className="text-center mb-8">
            <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white capitalize">
              {data.name || 'Seu Nome'}
            </h1>
            <p className="text-slate-500 dark:text-slate-400 text-sm font-medium mt-1">
              {data.tagline || 'Sua profissão ou frase de impacto'}
            </p>
            
            {data.city && (
              <div className="inline-flex items-center gap-1 mt-3 px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                <MapPin className="w-3 h-3" />
                {data.city}
              </div>
            )}
          </div>

          {/* Quick Actions / Socials */}
          <div className="flex flex-wrap items-center justify-center gap-3 mb-8">
            {activeSocials.map((social) => (
              <motion.a
                key={social.id}
                whileHover={{ y: -3 }}
                whileTap={{ scale: 0.9 }}
                href={social.url}
                target="_blank"
                rel="noopener noreferrer"
                className="w-11 h-11 flex items-center justify-center rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-md transition-all hover:border-primary/50"
              >
                <social.icon className={cn("w-5 h-5", social.iconColor || "text-slate-600 dark:text-slate-300")} />
              </motion.a>
            ))}
            
            <motion.button
              whileHover={{ y: -3 }}
              whileTap={{ scale: 0.9 }}
              onClick={handleShare}
              className="w-11 h-11 flex items-center justify-center rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 shadow-sm"
            >
              <Share2 className="w-5 h-5 text-slate-600 dark:text-slate-300" />
            </motion.button>
          </div>

          {/* Main CTA */}
          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <Button
              variant="default"
              size="lg"
              className="w-full h-16 rounded-2xl bg-[#25D366] hover:bg-[#20ba5a] text-white font-black text-lg shadow-xl shadow-[#25D366]/30 border-b-4 border-[#128C7E]"
              asChild
            >
              <a href={whatsappLink} target="_blank" rel="noopener noreferrer">
                <MessageCircle className="w-6 h-6 fill-current mr-3" />
                {data.cta_text || 'Falar no WhatsApp'}
              </a>
            </Button>
          </motion.div>

          {/* Services List */}
          {data.services && data.services.length > 0 && data.services[0] !== '' && (
            <div className="mt-10 space-y-3">
              <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 text-center">
                Especialidades
              </h3>
              <div className="grid gap-2">
                {data.services.map((service, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 + (i * 0.1) }}
                    className="p-4 bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-700/50 rounded-2xl text-sm font-bold text-slate-700 dark:text-slate-200"
                  >
                    {service}
                  </motion.div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Branding */}
        {showBranding && !isPro && (
          <div className="py-6 text-center bg-slate-50 dark:bg-slate-950/50 border-t border-slate-100 dark:border-slate-900">
            <a href="/" className="text-[10px] uppercase font-black tracking-widest text-slate-400 hover:text-primary transition-colors">
              Powered by <span className="text-slate-900 dark:text-white">ConnectCard</span>
            </a>
          </div>
        )}
      </div>
    </motion.div>
  );
}
