'use server'

import { createClient } from '@/utils/supabase/server';
import { stripe, PRO_PLAN_PRICE_ID } from '@/lib/stripe';
import { headers } from 'next/headers';

export async function createCheckoutSession() {
  try {
    const supabase = await createClient();
    
    // 1. Pegar a sessão do Supabase (chamamos de 'supabaseAuth')
    const { data: { session: supabaseSession }, error: sessionError } = await supabase.auth.getSession();
    
    if (sessionError || !supabaseSession) {
      return { error: 'Sessão não encontrada. Por favor, faça login novamente.' };
    }

    // 2. Pegar o usuário
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return { error: 'Usuário não verificado. Tente sair e entrar novamente.' };
    }

    // 3. Verificar o perfil
    const { data: profile } = await supabase
      .from('profiles')
      .select('id, user_id')
      .eq('user_id', user.id)
      .single();

    if (!profile) {
      return { error: 'Perfil não encontrado.' };
    }

    const headersList = await headers();
    const origin = headersList.get('origin') || 'https://konnexy.vercel.app';

    // 4. Criar sessão do Stripe (chamamos de 'stripeSession')
    const stripeSession = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price: PRO_PLAN_PRICE_ID,
          quantity: 1,
        },
      ],
      mode: 'subscription',
      success_url: `${origin}/dashboard?success=true`,
      cancel_url: `${origin}/dashboard?canceled=true`,
      metadata: {
        userId: user.id,
      },
      customer_email: user.email,
    });

    return { url: stripeSession.url };
  } catch (error: any) {
    console.error('Stripe error:', error);
    return { error: 'Erro de servidor: ' + error.message };
  }
}
