"use client";

import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Zap } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';
import { useState } from 'react';
import { createCheckoutSession } from '@/app/actions/checkout';

export function UpgradeButton() {
  const router = useRouter();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);

  const handleUpgrade = async () => {
    if (!user) {
      router.push('/signup?plan=pro');
      return;
    }

    setLoading(true);
    try {
      const result = await createCheckoutSession();

      if (result.url) {
        window.location.href = result.url;
      } else {
        toast.error(result.error || 'Erro ao criar sessão de checkout');
      }
    } catch (error: any) {
      toast.error('Erro ao processar pagamento');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button
      variant="hero"
      className="w-full h-16 rounded-2xl text-sm font-black uppercase tracking-widest shadow-xl shadow-primary/20 transition-all active:scale-95"
      onClick={handleUpgrade}
      disabled={loading}
    >
      <Zap className="w-4 h-4 mr-2 fill-current" />
      {loading ? 'Redirecionando...' : 'Seja Premium'}
    </Button>
  );
}
