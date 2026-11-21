"use client";

import React, { useState } from 'react';
import { Crown, Check, Sparkles, Zap, ShieldCheck, ArrowRight, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { MUSIC_PLANS } from '@/config/music-constants';
import type { Profile } from '@/types/profile';
import { createCheckoutSession } from '@/app/actions/checkout';

interface MusicPlansTabProps {
  profile: Profile;
  accessToken?: string;
}

export function MusicPlansTab({ profile, accessToken }: MusicPlansTabProps) {
  const [loadingCheckout, setLoadingCheckout] = useState(false);
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('yearly');

  const currentPlan = profile.plan === 'pro' || profile.plan === 'fundador_local' ? 'music_pro' : 'music';

  const handleUpgrade = async () => {
    setLoadingCheckout(true);
    try {
      const res = await createCheckoutSession(accessToken);
      if (res.url) {
        window.location.href = res.url;
      } else {
        toast.error(res.error || 'Não foi possível iniciar o checkout.');
      }
    } catch (err: any) {
      console.error(err);
      toast.error('Erro ao conectar ao serviço de pagamentos.');
    } finally {
      setLoadingCheckout(false);
    }
  };

  const handleAssistedSetup = () => {
    const cleanPhone = '5511999999999'; // Konnexy Support
    const msg = `Olá! Tenho interesse no serviço de Implantação Assistida do Konnexy Music Pro (R$ 197,00) para meu perfil ${profile.username || ''}.`;
    window.open(`https://wa.me/5511978252277?text=${encodeURIComponent(msg)}`, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Cabeçalho */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-black text-white tracking-tight">
            Planos & Assinatura Konnexy Music
          </h2>
          <p className="text-xs text-zinc-400">
            Escolha o plano ideal para a sua carreira artística e apresentações em eventos.
          </p>
        </div>

        {/* Ciclo de Cobrança */}
        <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-zinc-900 border border-zinc-800 self-start sm:self-auto">
          <button
            type="button"
            onClick={() => setBillingCycle('monthly')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
              billingCycle === 'monthly' ? 'bg-red-600 text-white shadow-md' : 'text-zinc-400 hover:text-white'
            }`}
          >
            Mensal
          </button>
          <button
            type="button"
            onClick={() => setBillingCycle('yearly')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition ${
              billingCycle === 'yearly' ? 'bg-red-600 text-white shadow-md' : 'text-zinc-400 hover:text-white'
            }`}
          >
            <span>Anual</span>
            <span className="px-1.5 py-0.2 rounded-md text-[9px] bg-emerald-500/20 text-emerald-400 border border-emerald-500/40">
              Economize
            </span>
          </button>
        </div>
      </div>

      {/* Grid de Planos */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch">
        {/* Plano Konnexy Music */}
        <div className="rounded-3xl bg-zinc-900/60 border border-zinc-800 p-6 flex flex-col justify-between gap-6 shadow-xl">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-black text-white">
                {MUSIC_PLANS.music.name}
              </h3>
              {currentPlan === 'music' && (
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-zinc-800 text-zinc-300">
                  Plano Base
                </span>
              )}
            </div>

            <div className="flex items-baseline gap-1">
              <span className="text-3xl font-black text-white">
                R$ {billingCycle === 'yearly' ? '149' : '14,90'}
              </span>
              <span className="text-xs text-zinc-400 font-semibold">
                /{billingCycle === 'yearly' ? 'ano' : 'mês'}
              </span>
            </div>

            <div className="space-y-2.5 pt-2 border-t border-zinc-800">
              {MUSIC_PLANS.music.features.map((feat, i) => (
                <div key={i} className="flex items-center gap-2.5 text-xs text-zinc-300">
                  <Check className="w-4 h-4 text-zinc-500 shrink-0" />
                  <span>{feat}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Plano Konnexy Music Pro (Destaque) */}
        <div className="relative rounded-3xl bg-gradient-to-b from-red-950/60 via-zinc-900 to-zinc-950 border-2 border-red-500/60 p-6 flex flex-col justify-between gap-6 shadow-2xl ring-1 ring-red-500/20">
          <div className="absolute -top-3 right-6 flex items-center gap-1 px-3 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-red-600 text-white shadow-lg">
            <Sparkles className="w-3 h-3" />
            <span>Mais Recomendado</span>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-black text-white flex items-center gap-2">
                <Crown className="w-5 h-5 text-amber-400" />
                <span>{MUSIC_PLANS.music_pro.name}</span>
              </h3>
              {currentPlan === 'music_pro' && (
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-emerald-500/20 border border-emerald-500/40 text-emerald-400">
                  Seu Plano Ativo
                </span>
              )}
            </div>

            <div className="flex items-baseline gap-1">
              <span className="text-3xl sm:text-4xl font-black text-white">
                R$ {billingCycle === 'yearly' ? '299' : '29,90'}
              </span>
              <span className="text-xs text-zinc-400 font-semibold">
                /{billingCycle === 'yearly' ? 'ano' : 'mês'}
              </span>
            </div>

            <div className="space-y-2.5 pt-2 border-t border-zinc-800">
              {MUSIC_PLANS.music_pro.features.map((feat, i) => (
                <div key={i} className="flex items-center gap-2.5 text-xs text-zinc-200">
                  <Check className="w-4 h-4 text-red-400 shrink-0" />
                  <span className="font-medium">{feat}</span>
                </div>
              ))}
            </div>
          </div>

          <Button
            type="button"
            disabled={loadingCheckout || currentPlan === 'music_pro'}
            onClick={handleUpgrade}
            className="w-full h-12 rounded-2xl bg-red-600 hover:bg-red-700 text-white font-black text-xs uppercase tracking-wider shadow-xl transition active:scale-95"
          >
            {loadingCheckout ? (
              <span className="flex items-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Iniciando Checkout...</span>
              </span>
            ) : currentPlan === 'music_pro' ? (
              'Plano Pro Já Ativo'
            ) : (
              'Assinar Konnexy Music Pro'
            )}
          </Button>
        </div>
      </div>

      {/* Implantação Assistida */}
      <div className="rounded-3xl bg-zinc-900/60 border border-zinc-800 p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-6 shadow-xl">
        <div className="space-y-1 max-w-xl">
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-400 uppercase tracking-wider">
            <Zap className="w-3.5 h-3.5" />
            <span>Serviço Opcional Konnexy</span>
          </div>
          <h3 className="text-base font-black text-white">
            {MUSIC_PLANS.assisted_setup.name} — R$ {MUSIC_PLANS.assisted_setup.priceOneTime},00
          </h3>
          <p className="text-xs text-zinc-400 leading-relaxed">
            {MUSIC_PLANS.assisted_setup.description}
          </p>
        </div>

        <Button
          type="button"
          onClick={handleAssistedSetup}
          variant="outline"
          className="h-11 px-5 rounded-2xl border-zinc-700 hover:bg-zinc-800 text-white font-bold text-xs uppercase tracking-wider shrink-0"
        >
          Contratar Implantação
        </Button>
      </div>
    </div>
  );
}
