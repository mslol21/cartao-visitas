import { useState, useEffect, useMemo, useCallback } from 'react';
import { createClient } from '@/utils/supabase/client';
import { useAuth } from './useAuth';
import { getOwnerProfileNeon, updateOwnerProfileNeon } from '@/app/actions/neon-profile';
import { Profile, ProfileFormData } from '@/types/profile';
import { toast } from 'sonner';

export function useProfile() {
  const { user, session } = useAuth();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const supabase = useMemo(() => createClient(), []);

  const fetchProfile = useCallback(async () => {
    if (!user || !session?.access_token) {
      setProfile(null);
      setError(null);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const data = await getOwnerProfileNeon(session.access_token);
      if (!data) throw new Error('O perfil não foi encontrado.');
      setProfile(data);
    } catch (cause) {
      console.error('Error fetching profile:', cause);
      setError('Não foi possível carregar seu perfil. Verifique a conexão e tente novamente.');
    } finally {
      setLoading(false);
    }
  }, [user, session?.access_token]);

  useEffect(() => {
    if (user && session?.access_token) {
      fetchProfile();
    } else {
      setProfile(null);
      setError(null);
      setLoading(false);
    }
  }, [user, session?.access_token, fetchProfile]);

  const updateProfile = async (formData: Partial<ProfileFormData>) => {
    if (!user || !session?.access_token) return { error: new Error('Not authenticated') };

    try {
      const result = await updateOwnerProfileNeon(formData, session.access_token);
      if (result.error) throw new Error(result.error);

      // Update local state selectively to avoid full refetch if possible
      setProfile(prev => prev ? { ...prev, ...formData } as Profile : null);
      
      return { error: null };
    } catch (error: unknown) {
      const err = error as { code?: string };
      if (err.code === '23505') {
        toast.error('Este username já está em uso. Escolha outro.');
      } else {
        toast.error('Erro ao atualizar perfil');
      }
      return { error: error as Error };
    }
  };

  return { profile, loading, error, updateProfile, refetch: fetchProfile };
}

export function usePublicProfile(username: string) {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const supabase = useMemo(() => createClient(), []);

  useEffect(() => {
    const fetchPublicProfile = async () => {
      if (!username) return;

      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('username', username)
          .single();

        if (error || !data) {
          setNotFound(true);
          return;
        }

        setProfile(data as Profile);
      } catch {
        setNotFound(true);
      } finally {
        setLoading(false);
      }
    };

    fetchPublicProfile();
  }, [username, supabase]);

  return { profile, loading, notFound };
}
