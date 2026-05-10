"use client";

import { useEffect, useState, createContext, useContext, ReactNode, useMemo } from 'react';
import { User, Session, AuthError } from '@supabase/supabase-js';
import { createClient } from '@/utils/supabase/client';
import { useRouter } from 'next/navigation';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signUp: (email: string, password: string) => Promise<{ error: AuthError | Error | null }>;
  signIn: (email: string, password: string) => Promise<{ error: AuthError | Error | null }>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const supabase = useMemo(() => createClient(), []);
  const router = useRouter();

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);
        if (event === 'SIGNED_OUT') {
          setUser(null);
          setSession(null);
        }
      }
    );

    supabase.auth.getSession()
      .then(({ data: { session } }) => {
        console.log('🔍 [AuthContext] Sessão recuperada no mount:', !!session);
        setSession(session);
        setUser(session?.user ?? null);
      })
      .catch(err => {
        console.error('❌ [AuthContext] Erro ao recuperar sessão:', err);
        setUser(null);
        setSession(null);
      })
      .finally(() => {
        setLoading(false);
      });

    return () => subscription.unsubscribe();
  }, [supabase]);

  const signUp = async (email: string, password: string) => {
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    });
    return { error };
  };

  const signIn = async (email: string, password: string) => {
    console.log('🚀 Iniciando processo de login no Supabase...');
    console.log('📍 Endpoint:', process.env.NEXT_PUBLIC_SUPABASE_URL);
    
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        console.error('❌ Erro retornado pelo Supabase:', error);
        return { error };
      }

      console.log('✅ Login realizado com sucesso! Sessão:', !!data.session);
      return { error: null };
    } catch (err: unknown) {
      const error = err as Error;
      console.error('🔥 Erro Crítico durante o fetch de login:', error);
      // Se for FetchError, pode ser o URL errado ou bloqueio de rede
      if (error.name === 'FetchError') {
        console.error('⚠️ Detalhe: Falha de rede. Verifique se o URL do Supabase no .env está correto.');
      }
      return { error };
    }
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    router.push('/');
    router.refresh();
  };

  return (
    <AuthContext.Provider value={{ user, session, loading, signUp, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
