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
          // Profile not found, let's create it as a fallback
          console.log('Profile missing, creating one for user:', user.id);
          const { data: newProfile, error: createError } = await supabase
            .from('profiles')
            .insert({
              user_id: user.id,
              plan: 'free'
            })
            .select()
            .single();

          if (createError) {
            console.error('Failed to create fallback profile:', createError);
            return;
          }
          
          if (newProfile) {
            setProfile(newProfile as Profile);
          }
        } else {
          throw error;
        }
      }
      
      if (data) {
        const profileData = data as Profile;
        // Check for manual plan expiration
        if (profileData.billing_type === 'manual' && profileData.plan_expires_at) {
          const expirationDate = new Date(profileData.plan_expires_at);
          if (expirationDate < new Date()) {
            // Plan expired, demote to free
            const updates = { 
              plan: 'free' as const, 
              billing_type: 'stripe' as const 
            };
            
            await supabase
              .from('profiles')
              .update(updates)
              .eq('id', profileData.id);
              
            setProfile({ ...profileData, ...updates });
            return;
          }
        }
        setProfile(profileData);
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
