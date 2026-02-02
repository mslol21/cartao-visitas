"use client";

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
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
  MessageCircle,
  LayoutDashboard,
  Palette,
} from 'lucide-react';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from "@/lib/utils";

import { Logo } from '@/components/brand/Logo';
import { verifyCheckoutSession, forceSyncProPlan } from '@/app/actions/checkout';
import { getProfileAnalytics } from '@/app/actions/analytics';

type DashboardTab = 'editor' | 'analytics' | 'settings';

interface AnalyticsData {
  visits: number;
  clicks: number;
  whatsappClicks: number;
  conversionRate: number;
}

function DashboardContent() {
  const router = useRouter();
  const { user, loading: authLoading, signOut } = useAuth();
  const { profile, loading: profileLoading, updateProfile, refetch } = useProfile();
  const searchParams = useSearchParams();
  
  const [activeTab, setActiveTab] = useState<DashboardTab>('editor');
  const [currentData, setCurrentData] = useState<Partial<Profile>>({});
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [loadingAnalytics, setLoadingAnalytics] = useState(false);
  const [copied, setCopied] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);

  useEffect(() => {
    if (profile) {
      setCurrentData(profile);
    }
  }, [profile]);

  useEffect(() => {
    const fetchStats = async () => {
      if (activeTab === 'analytics' && profile?.id && profile.plan === 'pro') {
        setLoadingAnalytics(true);
        const stats = await getProfileAnalytics(profile.id);
        setAnalytics(stats);
        setLoadingAnalytics(false);
      }
    };
    fetchStats();
  }, [activeTab, profile]);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
    }
  }, [user, authLoading, router]);

  // Fail-safe: Verificação manual se o webhook falhar
  useEffect(() => {
    const sessionId = searchParams.get('session_id');
    const success = searchParams.get('success');

    if (success === 'true' && sessionId && profile && profile.plan === 'free') {
      const verify = async () => {
        toast.loading('Confirmando sua assinatura PRO...');
        const result = await verifyCheckoutSession(sessionId);
        
        toast.dismiss();
        if (result.success) {
          toast.success('Parabéns! Sua conta agora é PRO.');
          await refetch();
          // Limpa a URL
          router.replace('/dashboard');
        } else {
          console.error('Falha na verificação manual:', result.error);
        }
      };
      verify();
    }
  }, [searchParams, profile, refetch, router]);

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
  const isPro = profile?.plan === 'pro';

  return (
    <>
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      {/* Premium Header */}
      <header className="bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl border-b border-slate-200/50 dark:border-slate-800/50 sticky top-0 z-50">
        <div className="max-w-[1400px] mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/" className="flex items-center">
              <Logo variant="horizontal" showTagline={false} className="scale-[0.65] sm:scale-75 origin-left" />
            </Link>
            <nav className="hidden lg:flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-2xl">
               <button 
                 onClick={() => setActiveTab('editor')}
                 className={cn(
                   "px-4 py-2 rounded-xl text-xs font-bold transition-all",
                   activeTab === 'editor' ? "bg-white dark:bg-slate-700 shadow-sm opacity-100" : "opacity-40 hover:opacity-100"
                 )}
               >
                 Editor
               </button>
               <button 
                 onClick={() => setActiveTab('analytics')}
                 className={cn(
                   "px-4 py-2 rounded-xl text-xs font-bold transition-all",
                   activeTab === 'analytics' ? "bg-white dark:bg-slate-700 shadow-sm opacity-100" : "opacity-40 hover:opacity-100"
                 )}
               >
                 Analytics
               </button>
               <button 
                 onClick={() => setActiveTab('settings')}
                 className={cn(
                   "px-4 py-2 rounded-xl text-xs font-bold transition-all",
                   activeTab === 'settings' ? "bg-white dark:bg-slate-700 shadow-sm opacity-100" : "opacity-40 hover:opacity-100"
                 )}
               >
                 Ajustes
               </button>
            </nav>
          </div>

          <div className="flex items-center gap-3">
            <AnimatePresence>
              {isPro ? (
                <motion.div 
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="flex items-center gap-2 px-3 sm:px-4 py-2 rounded-2xl bg-primary/10 border border-primary/20 text-primary"
                >
                  <Crown className="w-3.5 h-3.5 sm:w-4 h-4" />
                  <span className="text-[9px] sm:text-[10px] font-black uppercase tracking-widest">PRO</span>
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

      <main className="max-w-[1400px] mx-auto px-4 sm:px-6 py-10">
        <AnimatePresence mode="wait">
          {activeTab === 'editor' && (
            <motion.div 
              key="editor"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="grid lg:grid-cols-[1fr,450px] gap-12 items-start"
            >
              {/* LEFT: Management */}
              <div className="space-y-8">
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.3em] text-primary">
                      <span className="w-8 h-[2px] bg-primary rounded-full" />
                      Workplace
                    </div>
                    <h1 className="text-3xl sm:text-4xl font-black tracking-tighter">Personalize seu Perfil</h1>
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
                    isPro={isPro}
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
                {!isPro && (
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
            </motion.div>
          )}

          {activeTab === 'analytics' && (
            <motion.div 
              key="analytics"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-8"
            >
              <div className="space-y-2">
                <h1 className="text-3xl sm:text-4xl font-black tracking-tighter">Analytics</h1>
                <p className="text-muted-foreground font-medium">Visualize quem está visitando seu perfil e quais botões estão sendo clicados.</p>
              </div>

              {!isPro ? (
                <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] p-12 text-center border-2 border-dashed border-slate-200 dark:border-slate-800">
                  <div className="max-w-md mx-auto space-y-6">
                    <div className="w-20 h-20 bg-primary/10 rounded-3xl flex items-center justify-center mx-auto">
                      <Eye className="w-10 h-10 text-primary" />
                    </div>
                    <h2 className="text-2xl font-black tracking-tight">Recurso Exclusivo Pro</h2>
                    <p className="text-muted-foreground leading-relaxed">
                      Assine o plano Pro para ter acesso a gráficos detalhados, origem de tráfego e taxa de conversão do seu cartão.
                    </p>
                    <Button asChild variant="hero" size="xl" className="w-full rounded-[1.5rem] shadow-2xl shadow-primary/20">
                      <Link href="/pricing">Subir de Nível agora</Link>
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="grid md:grid-cols-3 gap-6">
                  {loadingAnalytics ? (
                    <div className="md:col-span-3 flex items-center justify-center p-20">
                      <Loader2 className="w-8 h-8 animate-spin text-primary/40" />
                    </div>
                  ) : (
                    <>
                      {[
                        { label: 'Visitas Totais', value: analytics?.visits || 0, icon: Eye, color: 'text-blue-500' },
                        { label: 'Cliques no WhatsApp', value: analytics?.whatsappClicks || 0, icon: MessageCircle, color: 'text-green-500' },
                        { label: 'Taxa de Conversão', value: `${analytics?.conversionRate || 0}%`, icon: Zap, color: 'text-yellow-500' },
                      ].map((stat, i) => (
                        <div key={i} className="bg-white dark:bg-slate-900 p-8 rounded-[2rem] border border-border/50 shadow-sm space-y-4">
                          <div className="flex items-center justify-between">
                            <div className="w-10 h-10 rounded-xl bg-slate-50 dark:bg-slate-800 flex items-center justify-center">
                              <stat.icon className={cn("w-5 h-5", stat.color)} />
                            </div>
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Real Time</span>
                          </div>
                          <div>
                            <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">{stat.label}</p>
                            <p className="text-3xl font-black mt-1">{stat.value}</p>
                          </div>
                        </div>
                      ))}
                      
                      <div className="md:col-span-3 bg-white dark:bg-slate-900 p-12 rounded-[2.5rem] border border-border/50 text-center">
                        <p className="text-muted-foreground font-medium italic">Gráficos de evolução em desenvolvimento...</p>
                      </div>
                    </>
                  )}
                </div>
              )}
            </motion.div>
          )}

          {activeTab === 'settings' && (
            <motion.div 
              key="settings"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="max-w-2xl space-y-8"
            >
              <div className="space-y-2">
                <h1 className="text-3xl sm:text-4xl font-black tracking-tighter">Ajustes</h1>
                <p className="text-muted-foreground font-medium">Gerencie sua conta e preferências da plataforma.</p>
              </div>

              <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] border border-border/50 overflow-hidden">
                <div className="p-8 border-b border-border/50 flex items-center justify-between">
                  <div>
                    <p className="font-bold">Informações da Conta</p>
                    <p className="text-xs text-muted-foreground">{user?.email}</p>
                  </div>
                  <div className="px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-[10px] font-black uppercase tracking-widest">
                    Plano {isPro ? 'Pro' : 'Free'}
                  </div>
                </div>

                {!isPro && (
                   <div className="p-8 border-b border-border/50 flex items-center justify-between group cursor-pointer hover:bg-slate-50 transition-colors"
                     onClick={async () => {
                        setIsSyncing(true);
                        toast.loading('Sincronizando com Stripe...');
                        const res = await forceSyncProPlan();
                        toast.dismiss();
                        if (res.success) {
                          toast.success('Plano PRO ativado com sucesso!');
                          await refetch();
                        } else {
                          toast.error(res.error || 'Nenhuma assinatura encontrada.');
                        }
                        setIsSyncing(false);
                     }}
                   >
                     <div>
                       <p className="font-bold flex items-center gap-2">
                         Sincronizar Assinatura
                         {isSyncing && <Loader2 className="w-3 h-3 animate-spin" />}
                       </p>
                       <p className="text-xs text-muted-foreground italic">Já assinou e ainda está no Free? Clique para sincronizar.</p>
                     </div>
                     <Zap className="w-4 h-4 text-primary opacity-0 group-hover:opacity-100 transition-opacity" />
                   </div>
                )}
                
                <div className="p-8 space-y-6">
                  <div className="flex items-center justify-between group cursor-pointer" onClick={() => router.push('/pricing')}>
                    <div>
                      <p className="text-sm font-bold">Assinatura</p>
                      <p className="text-xs text-muted-foreground">Gerencie seus pagamentos e faturas via Stripe.</p>
                    </div>
                    <ExternalLink className="w-4 h-4 opacity-20 group-hover:opacity-100 transition-opacity" />
                  </div>

                  <div className="h-[1px] bg-border/50" />

                  <div className="flex items-center justify-between group cursor-pointer text-red-500" onClick={handleSignOut}>
                    <div>
                      <p className="text-sm font-bold">Encerrar Sessão</p>
                      <p className="text-xs opacity-60">Sair da sua conta no Konnexy.</p>
                    </div>
                    <LogOut className="w-4 h-4" />
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

        <footer className="max-w-[1400px] mx-auto px-6 py-12 flex flex-col sm:flex-row items-center justify-between gap-6 border-t border-border/30 mt-12 pb-32 lg:pb-12 text-center sm:text-left">
          <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">© 2024 Konnexy</p>
          <div className="flex items-center gap-6">
             <Link href="/terms" className="text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-primary">Termos</Link>
             <Link href="/privacy" className="text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-primary">Privacidade</Link>
          </div>
        </footer>
      </div>

    {/* Mobile Tab Navigation */}
    <div className="lg:hidden fixed bottom-6 left-6 right-6 z-50">
      <nav className="glass shadow-2xl rounded-[2rem] p-1.5 flex items-center justify-between border border-white/20">
        {[
          { id: 'editor', label: 'Editor', icon: LayoutDashboard },
          { id: 'analytics', label: 'Stats', icon: Zap },
          { id: 'settings', label: 'Ajustes', icon: Palette }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as DashboardTab)}
            className={cn(
              "flex-1 flex flex-col items-center gap-1 py-3 px-2 rounded-2xl transition-all",
              activeTab === tab.id 
                ? "bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-xl" 
                : "text-muted-foreground/60 hover:text-foreground"
            )}
          >
            <tab.icon className="w-5 h-5" />
            <span className="text-[10px] font-black uppercase tracking-widest">{tab.label}</span>
          </button>
        ))}
      </nav>
    </div>
    </>
  );
}

export default function DashboardPage() {
  return (
    <Suspense fallback={
       <div className="min-h-screen flex items-center justify-center bg-background">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
       </div>
    }>
      <DashboardContent />
    </Suspense>
  );
}
