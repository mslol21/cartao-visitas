'use server'

import { createClient } from '@/utils/supabase/server';
import { stripe, PRO_PLAN_PRICE_ID } from '@/lib/stripe';
import { headers } from 'next/headers';

export async function createCheckoutSession() {
  try {
    const supabase = await createClient();
    
    // Simplificado para pegar o usuário de forma mais direta
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      console.error('SERVER ACTION: Usuário não encontrado no getUser()');
      return { error: 'Sessão expirada. Por favor, saia e faça login novamente.' };
    }

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
    return { error: 'Erro crítico de servidor. Tente atualizar a página.' };
  }
}
