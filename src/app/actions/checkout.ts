'use server'

import { createClient } from '@/utils/supabase/server';
import { stripe, PRO_PLAN_PRICE_ID } from '@/lib/stripe';
import { headers } from 'next/headers';

export async function createCheckoutSession(manualToken?: string) {
  try {
    const supabase = await createClient();
    
    let user = null;

    // Tenta validar o usuário diretamente com o token fornecido pelo cliente
    if (manualToken) {
      const { data: { user: verifiedUser }, error: verifyError } = await supabase.auth.getUser(manualToken);
      if (verifiedUser) {
        user = verifiedUser;
      } else {
        console.error('Erro ao validar token manual:', verifyError);
      }
    }

    // Se não validou com o token, tenta pelos cookies da sessão
    if (!user) {
      const { data: { user: cookieUser } } = await supabase.auth.getUser();
      user = cookieUser;
    }
    
    if (!user) {
      return { 
        error: 'Sessão não reconhecida. Por favor, faça login novamente para revalidar seu acesso.' 
      };
    }

    const { data: profile } = await supabase
      .from('profiles')
      .select('id, user_id')
      .eq('user_id', user.id)
      .single();

    if (!profile) {
      return { error: 'Perfil não encontrado na nossa base de dados.' };
    }

    const headersList = await headers();
    const origin = headersList.get('origin') || 'https://konnexy.vercel.app';

    const checkoutSession = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price: PRO_PLAN_PRICE_ID,
          quantity: 1,
        },
      ],
      mode: 'subscription',
      success_url: `${origin}/dashboard?success=true&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/dashboard?canceled=true`,
      metadata: {
        userId: user.id,
      },
      customer_email: user.email,
    });

    return { url: checkoutSession.url };
  } catch (error: unknown) {
    const err = error as Error;
    console.error('Stripe error:', err);
    return { error: 'Falha na conexão com o checkout: ' + err.message };
  }
}

export async function verifyCheckoutSession(sessionId: string) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return { error: 'Usuário não autenticado' };
    }

    // 1. Verificar a sessão no Stripe
    const session = await stripe.checkout.sessions.retrieve(sessionId);
    
    // 2. Validar se a sessão pertence ao usuário e foi paga
    if (session.metadata?.userId !== user.id) {
      return { error: 'Sessão inválida para este usuário' };
    }

    if (session.payment_status === 'paid' || session.status === 'complete') {
      // 3. Atualizar o plano usando o admin client para garantir sucesso
      const { createAdminClient } = await import('@/utils/supabase/admin');
      const adminSupabase = createAdminClient();
      
      const { error: updateError } = await adminSupabase
        .from('profiles')
        .update({ plan: 'pro' })
        .eq('user_id', user.id);

      if (updateError) throw updateError;
      
      return { success: true };
    }

    return { error: 'Pagamento ainda não confirmado no Stripe' };
  } catch (error: unknown) {
    const err = error as Error;
    console.error('Verify session error:', err);
    return { error: err.message };
  }
}

export async function forceSyncProPlan() {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) return { error: 'Sessão não encontrada ou expirada. Faça login no Konnexy novamente.' };

    // 1. Procurar sessões pagas deste usuário no Stripe
    const sessions = await stripe.checkout.sessions.list({
      limit: 5,
      customer_details: { email: user.email! }
    });

    const hasPaidSession = sessions.data.some(s => s.payment_status === 'paid' || s.status === 'complete');

    if (hasPaidSession) {
      const { createAdminClient } = await import('@/utils/supabase/admin');
      const admin = createAdminClient();
      await admin.from('profiles').update({ plan: 'pro' }).eq('user_id', user.id);
      return { success: true };
    }

    return { error: 'Nenhuma assinatura ativa encontrada no Stripe' };
  } catch (error: unknown) {
    const err = error as Error;
    return { error: err.message };
  }
}
