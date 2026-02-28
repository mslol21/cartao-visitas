"use server";

import { createClient as createSupabaseServerClient } from '@/utils/supabase/server';
import { revalidatePath } from 'next/cache';

export async function getAllUsersOverview() {
  try {
    const supabase = await createSupabaseServerClient();
    
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
      throw new Error("Configuração do Supabase ausente no servidor. Verifique o arquivo .env.");
    }

    if (!supabase) throw new Error("Falha ao inicializar o cliente Supabase");
    if (!supabase.auth) throw new Error("Serviço de autenticação não disponível no cliente");
    
    // Busca a sessão de forma robusta
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();
    let user = session?.user;

    if (!user) {
      // Tenta o getUser se o getSession falhar (mais rigoroso)
      const { data: { user: authUser }, error: authError } = await supabase.auth.getUser();
      user = authUser || undefined;
      
      if (authError || !user) {
        console.error('Auth check failed:', { sessionError, authError });
        throw new Error("Sessão inválida ou expirada. Recomendo sair e entrar novamente no sistema.");
      }
    }

    // Busca o cargo usando o ID do usuário de forma direta
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('role')
      .eq('user_id', user.id)
      .maybeSingle();

    if (profileError) {
      console.error('Profile Fetch Error:', profileError);
      throw new Error("Erro ao validar permissões de administrador.");
    }

    if (!profile || profile.role !== 'admin') {
      console.warn('Unauthorized access attempt:', user.id);
      throw new Error("Acesso negado: Perfil de administrador não localizado.");
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
