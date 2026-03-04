"use server";

import { createClient as createSupabaseServerClient, createAdminClient } from '@/utils/supabase/server';
import { revalidatePath } from 'next/cache';

export async function getRigidServerSession(supabase: any) {
  let authUser = null;
  try {
    const { cookies } = await import('next/headers');
    const allCookies = (await cookies()).getAll();
    const authCookie = allCookies.find(c => c.name.includes('-auth-token'));
    
    let accessToken: string | undefined = undefined;
    if (authCookie?.value) {
      if (authCookie.value.startsWith('{')) {
        accessToken = JSON.parse(authCookie.value)?.access_token;
      } else {
        const possibleJson = atob(authCookie.value);
        accessToken = JSON.parse(possibleJson)?.access_token;
      }
    }

    if (accessToken) {
      const { data: { user } } = await supabase.auth.getUser(accessToken);
      authUser = user;
    }

    if (!authUser) {
      const { data: { user } } = await supabase.auth.getUser();
      authUser = user;
    }
  } catch (e) {
    console.error('SERVER: Auto-Fallback auth check error', e);
  }
  return authUser;
}

export async function getAllUsersOverview() {
  try {
    const supabase = await createSupabaseServerClient();
    const supabaseAdmin = await createAdminClient(); 
    
    // 1. Validar se o usuário atual é admin (Bypass)
    const authUser = await getRigidServerSession(supabase);
    
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
    const supabaseAdmin = await createAdminClient();
    
    if (!supabase || !supabase.auth) throw new Error("Recurso não disponível");
    
    // Verifica admin (Bypass SSR bugs)
    const user = await getRigidServerSession(supabase);
    if (!user) throw new Error("Sessão expirada");

    const { data: profile } = await supabaseAdmin
      .from('profiles')
      .select('role')
      .eq('user_id', user.id)
      .single();

    if (profile?.role !== 'admin') throw new Error("Acesso negado");

    // Mapear status virtual para colunas físicas da tabela profiles
    const dbUpdates: any = {};
    if (updates.plan) dbUpdates.plan = updates.plan;
    
    if (updates.status) {
      if (updates.status === 'active') {
        dbUpdates.billing_type = 'manual';
        const futureDate = new Date();
        futureDate.setFullYear(futureDate.getFullYear() + 10);
        dbUpdates.plan_expires_at = futureDate.toISOString();
      } else if (updates.status === 'stripe_active') {
        dbUpdates.billing_type = 'stripe';
        dbUpdates.plan_expires_at = null;
      } else if (updates.status === 'free') {
        dbUpdates.billing_type = 'none';
        dbUpdates.plan_expires_at = null;
        dbUpdates.plan = 'free';
      } else if (updates.status === 'canceled') {
        dbUpdates.billing_type = 'manual';
        dbUpdates.plan_expires_at = new Date(0).toISOString(); // Expirado no passado
      }
    }

    const { error } = await supabaseAdmin
      .from('profiles')
      .update(Object.keys(dbUpdates).length > 0 ? dbUpdates : updates)
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

    // 1. Verificar sessão de forma ultra-robusta (com extração manual CSR bypass)
    const authUser = await getRigidServerSession(supabase);

    if (!authUser) {
      return { success: false, error: "Sessão não identificada pelo servidor. Por favor, faça logout e login novamente." };
    }

    // 2. Verificar se o usuário é admin
    const { data: profile, error: profileError } = await supabaseAdmin
      .from('profiles')
      .select('role')
      .eq('user_id', authUser.id)
      .maybeSingle();

    if (profileError || !profile || profile.role !== 'admin') {
      console.warn('Unauthorized admin attempt:', authUser.id);
      return { success: false, error: "Acesso negado: Sua conta não tem permissões de administrador." };
    }

    // 3. Criar o usuário no Auth
    const cleanEmail = email.trim().toLowerCase();
    const cleanUsername = username.trim().toLowerCase();

    const { data: userData, error: userError } = await supabaseAdmin.auth.admin.createUser({
      email: cleanEmail,
      password: pass,
      email_confirm: true 
    });

    if (userError) {
      console.error('SUPABASE AUTH ERROR:', userError);
      return { success: false, error: `Erro no Supabase Auth: ${userError.message}` };
    }

    // 4. Inserir ou atualizar o profile (Garante criação mesmo se o trigger de DB falhar)
    if (userData.user) {
      const { error: upsertError } = await supabaseAdmin
        .from('profiles')
        .upsert({ 
          user_id: userData.user.id,
          username: cleanUsername,
          plan: 'free',
          role: 'user'
        }, { onConflict: 'user_id' });
      
      if (upsertError) {
        console.error('PROFILE UPSERT ERROR:', upsertError);
      }
    }


    revalidatePath('/admin');
    return { success: true, data: userData };

  } catch (err: any) {
    console.error('CREATE USER ERROR:', err);
    return { success: false, error: err.message };
  }
}
