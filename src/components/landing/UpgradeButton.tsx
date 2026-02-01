"use client";

import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Zap } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';
import { useState } from 'react';

export function UpgradeButton() {
  const router = useRouter();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);

  const handleUpgrade = async () => {
    // Se não está logado, redireciona para signup
    if (!user) {
      router.push('/signup?plan=pro');
      return;
    }

    // Se está logado, chama a API de checkout
    setLoading(true);
    try {
      const response = await fetch('/api/checkout', {
        method: 'POST',
      });

      const data = await response.json();

      if (data.url) {
        // Redireciona para o Stripe Checkout
        window.location.href = data.url;
      } else {
        toast.error('Erro ao criar sessão de checkout');
      }
    } catch (error) {
      console.error('Erro:', error);
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
      {loading ? 'Processando...' : 'Seja Premium'}
    </Button>
  );
}
