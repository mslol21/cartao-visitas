"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';
import { useProfile } from '@/hooks/useProfile';
import { EditorForm } from '@/components/dashboard/EditorForm';
import { LivePreview } from '@/components/dashboard/LivePreview';
import { Button } from '@/components/ui/button';
import { Profile } from '@/types/profile';
import { 
  LogOut, 
  ExternalLink, 
  Copy, 
  Check, 
  Loader2,
  Crown,
  Eye,
  Zap,
  ArrowLeft,
  LayoutDashboard
} from 'lucide-react';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';

function DashboardContent() {
  const router = useRouter();
  const { user, loading: authLoading, signOut } = useAuth();
  const { profile, loading: profileLoading, updateProfile } = useProfile();
  
  const [currentData, setCurrentData] = useState<Partial<Profile>>({});
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (profile) {
      setCurrentData(profile);
    }
  }, [profile]);

  const handleSignOut = async () => {
    await signOut();
    router.push('/');
  };

  const handleAutoSave = async (data: Partial<Profile>) => {
    await updateProfile(data);
  };

  const copyLink = () => {
    if (profile?.username) {
      const url = `${window.location.origin}/${profile.username}`;
      navigator.clipboard.writeText(url);
      setCopied(true);
      toast.success('Link copiado!');
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (authLoading || profileLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex flex-col items-center gap-6"
        >
          <div className="relative">
             <div className="w-16 h-16 rounded-3xl border-4 border-primary/20 border-t-primary animate-spin" />
             <div className="absolute inset-0 flex items-center justify-center">
                <LayoutDashboard className="w-6 h-6 text-primary/40" />
             </div>
          </div>
          <p className="text-sm font-black uppercase tracking-[0.2em] text-muted-foreground animate-pulse">Sincronizando Dashboard...</p>
        </motion.div>
      </div>
    );
  }

  const publicUrl = profile?.username ? `/${profile.username}` : null;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      {/* Premium Header */}
      <header className="bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl border-b border-slate-200/50 dark:border-slate-800/50 sticky top-0 z-50">
        <div className="max-w-[1400px] mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-8">
            <Link href="/" className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-slate-900 dark:bg-white flex items-center justify-center shadow-2xl">
                <span className="text-white dark:text-slate-900 font-black text-xs">CV</span>
              </div>
              <span className="font-black text-xl tracking-tighter hidden sm:inline">ConnectCard</span>
            </Link>
            
            <nav className="hidden md:flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-2xl">
               <button className="px-4 py-2 rounded-xl bg-white dark:bg-slate-700 shadow-sm text-xs font-bold transition-all">Editor</button>
               <button className="px-4 py-2 rounded-xl text-xs font-bold opacity-40 hover:opacity-100 transition-all">Analytics</button>
               <button className="px-4 py-2 rounded-xl text-xs font-bold opacity-40 hover:opacity-100 transition-all">Ajustes</button>
            </nav>
          </div>

          <div className="flex items-center gap-3">
            <AnimatePresence>
              {profile?.plan === 'pro' ? (
                <motion.div 
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="hidden lg:flex items-center gap-2 px-4 py-2 rounded-2xl bg-primary/10 border border-primary/20 text-primary"
                >
                  <Crown className="w-4 h-4" />
                  <span className="text-[10px] font-black uppercase tracking-widest">Plano ProAtivo</span>
                </motion.div>
              ) : (
                <Button asChild variant="hero" size="sm" className="hidden sm:flex rounded-2xl bg-slate-900 dark:bg-white text-white dark:text-slate-900">
                  <Link href="/pricing" className="flex items-center gap-2">
                    <Zap className="w-4 h-4 fill-current" />
                    Ser Pro
                  </Link>
                </Button>
              )}
            </AnimatePresence>
            
            <div className="h-4 w-[1px] bg-border mx-2" />
            
            <button 
              onClick={handleSignOut}
              className="p-3 rounded-2xl bg-slate-100 dark:bg-slate-800 hover:bg-red-500/10 hover:text-red-500 transition-all group"
            >
              <LogOut className="w-5 h-5 transition-transform group-hover:-translate-x-1" />
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-[1400px] mx-auto px-6 py-10">
        <div className="grid lg:grid-cols-[1fr,450px] gap-12 items-start">
          
          {/* LEFT: Management */}
          <div className="space-y-8">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.3em] text-primary">
                  <span className="w-8 h-[2px] bg-primary rounded-full" />
                  Workplace
                </div>
                <h1 className="text-4xl font-black tracking-tighter">Personalize seu Perfil</h1>
              </div>

              {publicUrl && (
                <div className="flex items-center gap-3">
                  <button 
                    onClick={copyLink}
                    className="flex items-center gap-2 px-5 h-12 rounded-2xl bg-white dark:bg-slate-900 border border-border/50 shadow-sm font-bold text-sm hover:border-primary transition-all active:scale-95"
                  >
                    {copied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                    {copied ? 'Copiado' : 'Link'}
                  </button>
                  <Button asChild variant="hero" className="h-12 px-6 rounded-2xl shadow-xl shadow-primary/20 group">
                    <Link href={publicUrl} target="_blank">
                      Ver Perfil
                      <ExternalLink className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
                    </Link>
                  </Button>
                </div>
              )}
            </div>

            <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-200/60 dark:border-slate-800/60 p-8 sm:p-10 shadow-2xl shadow-slate-200/50 dark:shadow-none">
              <EditorForm
                initialData={currentData}
                onSubmit={handleAutoSave}
                onChange={setCurrentData}
                isPro={profile?.plan === 'pro'}
              />
            </div>
          </div>

          {/* RIGHT: Visual Reference */}
          <div className="lg:sticky lg:top-32 space-y-8">
            <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-200/60 dark:border-slate-800/60 p-10 shadow-2xl shadow-slate-200/50 dark:shadow-none relative overflow-hidden">
              <div className="absolute top-0 right-0 p-8 opacity-5">
                 <LayoutDashboard className="w-40 h-40" />
              </div>
              <LivePreview data={currentData} />
            </div>

            {/* Pro Upgrade Card */}
            {profile?.plan !== 'pro' && (
              <motion.div 
                whileHover={{ y: -5 }}
                className="relative overflow-hidden p-8 rounded-[2.5rem] bg-slate-900 text-white shadow-2xl dark:border dark:border-white/10"
              >
                <div className="absolute -top-10 -right-10 w-40 h-40 bg-primary/20 rounded-full blur-[80px]" />
                <div className="relative z-10 space-y-6">
                  <div className="w-12 h-12 rounded-2xl bg-primary/20 flex items-center justify-center border border-primary/30">
                     <Zap className="w-6 h-6 text-primary fill-current" />
                  </div>
                  <div>
                    <h3 className="text-xl font-black tracking-tight mb-2">Desbloqueie o Potencial Máximo</h3>
                    <p className="text-slate-400 text-sm leading-relaxed">
                      Remova marcas d&apos;água, use domínios personalizados e tenha acesso a métricas avançadas de cliques.
                    </p>
                  </div>
                  <Button asChild variant="hero" className="w-full h-14 rounded-2xl shadow-xl shadow-primary/20 font-black text-sm uppercase tracking-widest">
                    <Link href="/pricing">Upgrade por R$19/mês</Link>
                  </Button>
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </main>

      <footer className="max-w-[1400px] mx-auto px-6 py-12 flex flex-col sm:flex-row items-center justify-between gap-6 border-t border-border/30 mt-12">
        <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">© 2024 ConnectCard Platform • Premium Experience</p>
        <div className="flex items-center gap-6">
           <Link href="/terms" className="text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-primary">Termos</Link>
           <Link href="/privacy" className="text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-primary">Privacidade</Link>
        </div>
      </footer>
    </div>
  );
}

export default function DashboardPage() {
  return <DashboardContent />;
}
