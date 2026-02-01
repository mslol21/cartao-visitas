'use server'

import { createClient } from '@/utils/supabase/server';
import { stripe, PRO_PLAN_PRICE_ID } from '@/lib/stripe';
import { headers } from 'next/headers';

export async function createCheckoutSession(manualToken?: string) {
  try {
    const supabase = await createClient();
    
    // Se um token manual foi passado, forçamos a sessão no servidor
    if (manualToken) {
      await supabase.auth.setSession({
        access_token: manualToken,
        refresh_token: '', // Não precisamos do refresh para essa operação única
      });
    }

    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return { error: 'Sessão não reconhecida pelo servidor. Tente atualizar a página.' };
    }

    const { data: profile } = await supabase
      .from('profiles')
      .select('id, user_id')
      .eq('user_id', user.id)
      .single();

    if (!profile) {
      return { error: 'Perfil não encontrado no banco de dados.' };
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
      success_url: `${origin}/dashboard?success=true`,
      cancel_url: `${origin}/dashboard?canceled=true`,
      metadata: {
        userId: user.id,
      },
      customer_email: user.email,
    });

    return { url: checkoutSession.url };
  } catch (error: any) {
    console.error('Stripe error:', error);
    return { error: 'Erro de processamento: ' + error.message };
  }
}
