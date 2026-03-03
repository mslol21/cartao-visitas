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

    // 1. Validar se o usuário atual é admin
    const { data: { user: authUser } } = await supabase.auth.getUser();
    
    if (!authUser) {
      throw new Error("Sessão não encontrada. Por favor, faça login novamente.");
    }

    const { data: profile } = await supabaseAdmin
      .from('profiles')
      .select('role')
      .eq('user_id', authUser.id)
      .single();

    if (profile?.role !== 'admin') {
      throw new Error("Acesso negado: Somente administradores podem ver esta lista.");
    }

    // 2. Buscar dados (usando e-mail ou display_name conforme disponível na View)
    const { data, error } = await supabaseAdmin
      .from('admin_users_overview')
      .select('*')
      .order('created_at', { ascending: false });

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

    // 1. Verificar sessão usando getUser (mais seguro para Server Actions)
    const { data: { user: authUser }, error: authError } = await supabase.auth.getUser();

    if (authError || !authUser) {
      console.error('AUTH ERROR DETAILS:', authError);
      throw new Error("Sessão expirada ou inválida. Por favor, faça login novamente.");
    }

    // 2. Verificar se o usuário é admin
    const { data: profile, error: profileError } = await supabaseAdmin
      .from('profiles')
      .select('role')
      .eq('user_id', authUser.id)
      .maybeSingle();

    if (profileError) {
      console.error('ADMIN CHECK DB ERROR:', profileError);
      throw new Error(`Erro de permissão: ${profileError.message}`);
    }

    if (!profile || profile.role !== 'admin') {
      throw new Error("Acesso negado: Perfil de administrador necessário.");
    }



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


