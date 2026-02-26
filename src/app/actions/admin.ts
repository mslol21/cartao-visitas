"use server";

import { createClient as createSupabaseServerClient } from '@/utils/supabase/server';
import { revalidatePath } from 'next/cache';

export async function getAllUsersOverview() {
  try {
    const supabase = await createSupabaseServerClient();
    
    if (!supabase) throw new Error("Falha ao inicializar o cliente Supabase");
    if (!supabase.auth) throw new Error("Serviço de autenticação não disponível no cliente");
    
    // Verifica se o usuário atual é admin
    const { data: authData, error: authError } = await supabase.auth.getUser();
    if (authError) {
      console.error('Admin Auth Error:', authError);
      throw new Error("Erro na autenticação: " + authError.message);
    }
    
    const user = authData?.user;
    if (!user) throw new Error("Usuário não identificado");

    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('role')
      .eq('user_id', user.id)
      .single();

    if (profileError) {
      console.error('Admin Profile Fetch Error:', profileError);
      throw new Error("Erro ao buscar cargo do perfil");
    }

    if (profile?.role !== 'admin') {
      throw new Error("Acesso negado: você não é um administrador");
    }

    const { data, error } = await supabase
      .from('admin_users_overview')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Admin Data Fetch Error:', error);
      throw error;
    }
    
    return { data, success: true };
  } catch (err: any) {
    console.error('CRITICAL ADMIN ERROR:', err);
    return { 
      success: false, 
      error: err.message || "Erro desconhecido no servidor" 
    };
  }
}

export async function updateUserPlan(userId: string, updates: any) {
  try {
    const supabase = await createSupabaseServerClient();
    
    if (!supabase || !supabase.auth) throw new Error("Recurso não disponível");
    
    // Verifica admin
    const { data: authData, error: authError } = await supabase.auth.getUser();
    if (authError || !authData?.user) throw new Error("Sessão expirada");
    
    const user = authData.user;

    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('user_id', user.id)
      .single();

    if (profile?.role !== 'admin') throw new Error("Acesso negado");

    const { error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('user_id', userId);

    if (error) throw error;
    
    revalidatePath('/admin');
    return { success: true };
  } catch (err: any) {
    console.error('UPDATE PLAN ERROR:', err);
    return { success: false, error: err.message };
  }
}
