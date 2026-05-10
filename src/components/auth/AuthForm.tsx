"use client";

import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2, ArrowLeft, Mail, Lock } from 'lucide-react';
import { toast } from 'sonner';
import { z } from 'zod';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Logo } from '@/components/brand/Logo';

const authSchema = z.object({
  email: z.string().email('Email inválido').max(255, 'Email muito longo'),
  password: z.string().min(6, 'Senha deve ter pelo menos 6 caracteres').max(100, 'Senha muito longa'),
});

interface AuthFormProps {
  mode: 'login' | 'signup';
}

export function AuthForm({ mode }: AuthFormProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, loading: authLoading, signIn, signUp } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const isSignUp = mode === 'signup';
  
  useEffect(() => {
    const message = searchParams.get('message');
    if (message) {
      toast.info(message);
    }
  }, [searchParams]);

  useEffect(() => {
    if (user && !authLoading) {
      console.log('🔄 Usuário detectado no AuthForm, redirecionando...');
      router.push('/dashboard');
    }
  }, [user, authLoading, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate input
    const result = authSchema.safeParse({ email, password });
    if (!result.success) {
      toast.error(result.error.errors[0].message);
      return;
    }

    console.log('📝 Formulário submetido. Modo:', mode);
    
    setLoading(true);

    try {
      if (isSignUp) {
        const { error } = await signUp(email, password);
        console.log('🏁 Resultado do signUp no Form:', { error });
        if (error) {
          if (error.message?.includes('already registered')) {
            toast.error('Este email já está cadastrado. Faça login.');
          } else {
            toast.error(error.message || 'Erro ao criar conta');
          }
        } else {
          toast.success('Conta criada! Verifique seu email para confirmar.');
        }
      } else {
        const { error } = await signIn(email, password);
        console.log('🏁 Resultado do signIn no Form:', { error });
        
        if (error) {
          if (error.message?.includes('Invalid login')) {
            toast.error('Email ou senha incorretos');
          } else {
            toast.error(error.message || 'Erro ao realizar login');
          }
        } else {
          console.log('🍪 Cookies detectados no login:', document.cookie.split(';').length);
          toast.success('Login realizado com sucesso! Redirecionando...');
          
          router.refresh();
          
          console.log('🚀 Redirecionando agora para /dashboard...');
          window.location.href = '/dashboard';
        }
      }
    } catch (err: unknown) {
      const error = err as Error;
      console.error('❌ Erro inesperado no handleSubmit:', error);
      toast.error(error.message || 'Ocorreu um erro inesperado. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      {/* Background decorations */}
      <div className="absolute inset-0 bg-hero-pattern pointer-events-none opacity-20" />
      <div className="absolute top-20 left-10 w-72 h-72 bg-primary/10 rounded-full blur-3xl" />
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />

      <div className="relative w-full max-w-md">
        {/* Back link */}
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-8"
        >
          <ArrowLeft className="w-4 h-4" />
          Voltar ao início
        </Link>

        {/* Card */}
        <div className="bg-card border border-border rounded-2xl p-8 shadow-soft">
          {/* Logo */}
          <div className="flex items-center justify-center mb-8">
            <Logo variant="horizontal" showTagline={false} className="scale-75" />
          </div>

          {/* Title */}
          <div className="text-center mb-8">
            <h1 className="font-display text-2xl font-bold mb-2">
              {isSignUp ? 'Criar sua conta' : 'Entrar na sua conta'}
            </h1>
            <p className="text-muted-foreground text-sm">
              {isSignUp
                ? 'Crie seu cartão de visita digital em minutos'
                : 'Acesse seu painel e edite seu cartão'}
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="seu@email.com"
                  className="pl-10"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Senha</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="pl-10"
                  required
                />
              </div>
            </div>

            <Button type="submit" variant="hero" size="lg" className="w-full" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Aguarde...
                </>
              ) : isSignUp ? (
                'Criar conta'
              ) : (
                'Entrar'
              )}
            </Button>
          </form>

          {/* Toggle - Removido link de signup público conforme solicitado */}
          {isSignUp && (
            <div className="mt-6 text-center text-sm">
              <span className="text-muted-foreground">
                Já tem uma conta?
              </span>{' '}
              <Link
                href="/login"
                className="text-primary font-medium hover:underline"
              >
                Entrar
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
