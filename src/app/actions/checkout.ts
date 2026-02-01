'use server'

import { createClient } from '@/utils/supabase/server';
import { stripe, PRO_PLAN_PRICE_ID } from '@/lib/stripe';
import { headers } from 'next/headers';

export async function createCheckoutSession() {
  try {
    const supabase = await createClient();
    
    // Verificação dupla de sessão para Next.js 15
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();
    
    if (sessionError || !session) {
      console.error('Erro de sessão no Checkout:', sessionError);
      return { error: `Sessão não encontrada: ${sessionError?.message || 'Faça login novamente.'}` };
    }

    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return { error: `Usuário não verificado: ${authError?.message || 'Tente sair e entrar novamente.'}` };
    }

    const { data: profile } = await supabase
      .from('profiles')
      .select('id, user_id')
      .eq('user_id', user.id)
      .single();

    if (!profile) {
      return { error: 'Perfil não encontrado. Tente atualizar a página.' };
    }

    const headersList = await headers();
    const origin = headersList.get('origin') || 'https://konnexy.vercel.app';

    const session = await stripe.checkout.sessions.create({
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

    return { url: session.url };
  } catch (error: any) {
    console.error('Stripe error:', error);
    return { error: 'Erro de servidor: ' + error.message };
  }
}
