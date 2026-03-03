"use server";

import { createClient as createSupabaseServerClient, createAdminClient } from '@/utils/supabase/server';
import { revalidatePath } from 'next/cache';

export async function getAllUsersOverview() {
  try {
    const supabase = await createSupabaseServerClient();
    const supabaseAdmin = await createAdminClient(); // Cliente com privilégios de service_role
    
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
      throw new Error("Configuração do Supabase ausente no servidor. Verifique o arquivo .env.");
    }

    // 1. Validar se o usuário atual é admin (usando cliente normal para segurança)
    const { data: { session } } = await supabase.auth.getSession();
    const user = session?.user;

    if (!user) {
      const { data: { user: authUser } } = await supabase.auth.getUser();
      if (!authUser) throw new Error("Sessão expirada");
    }

    const userId = user?.id || (await supabase.auth.getUser()).data.user?.id;
    
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('user_id', userId)
      .maybeSingle();

    if (!profile || profile.role !== 'admin') {
      throw new Error("Acesso negado: Perfil de administrador necessário.");
    }

    // 2. Buscar dados usando o cliente Admin (para poder ler auth.users via View)
    const { data, error } = await supabaseAdmin
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

export async function createNewUser(email: string, pass: string, username: string) {
  try {
    const supabaseAdmin = await createAdminClient();
    const supabase = await createSupabaseServerClient();

    // 1. Verificar se quem está chamando é admin
    const { data: { user: authUser } } = await supabase.auth.getUser();
    if (!authUser) throw new Error("Sessão expirada");

    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('user_id', authUser.id)
      .single();

    if (profile?.role !== 'admin') throw new Error("Acesso negado");

    // 2. Criar o usuário no Auth usando Service Role
    const { data: userData, error: userError } = await supabaseAdmin.auth.admin.createUser({
      email,
      password: pass,
      email_confirm: true 
    });

    if (userError) throw userError;

    // 3. Atualizar o profile com o username
    if (userData.user) {
      const { error: profileError } = await supabaseAdmin
        .from('profiles')
        .update({ username: username.toLowerCase() })
        .eq('user_id', userData.user.id);
      
      if (profileError) console.error('Error updating username:', profileError);
    }

    revalidatePath('/admin');
    return { success: true, data: userData };
  } catch (err: any) {
    console.error('CREATE USER ERROR:', err);
    return { success: false, error: err.message };
  }
}


