import { useState, useEffect, useMemo, useCallback } from 'react';
import { createClient } from '@/utils/supabase/client';
import { useAuth } from './useAuth';
import { Profile, ProfileFormData } from '@/types/profile';
import { toast } from 'sonner';

export function useProfile() {
  const { user } = useAuth();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const supabase = useMemo(() => createClient(), []);

  const fetchProfile = useCallback(async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          // Profile not found, but trigger should have created it. 
          // If not, we could handle creation here as fallback.
          console.warn('Profile not found for authenticated user');
        } else {
          throw error;
        }
      }
      
      if (data) {
        setProfile(data as Profile);
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
    } finally {
      setLoading(false);
    }
  }, [user, supabase]);

  useEffect(() => {
    if (user) {
      fetchProfile();
    } else {
      setProfile(null);
      setLoading(false);
    }
  }, [user, fetchProfile]);

  const updateProfile = async (formData: Partial<ProfileFormData>) => {
    if (!user) return { error: new Error('Not authenticated') };

    try {
      const { error } = await supabase
        .from('profiles')
        .update(formData)
        .eq('user_id', user.id);

      if (error) throw error;

      // Update local state selectively to avoid full refetch if possible
      setProfile(prev => prev ? { ...prev, ...formData } as Profile : null);
      
      return { error: null };
    } catch (error: any) {
      if (error.code === '23505') {
        toast.error('Este username já está em uso. Escolha outro.');
      } else {
        toast.error('Erro ao atualizar perfil');
      }
      return { error };
    }
  };

  return { profile, loading, updateProfile, refetch: fetchProfile };
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
      } catch (error) {
        setNotFound(true);
      } finally {
        setLoading(false);
      }
    };

    fetchPublicProfile();
  }, [username, supabase]);

  return { profile, loading, notFound };
}
