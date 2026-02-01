import { createClient } from '@/utils/supabase/server';
import { stripe, PRO_PLAN_PRICE_ID } from '@/lib/stripe';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    
    // getUser() é mais lento mas valida o token com o Supabase
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return NextResponse.json(
        { error: 'Não autorizado: Usuário não autenticado no servidor.', details: authError?.message }, 
        { status: 401 }
      );
    }

    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('id, user_id')
      .eq('user_id', user.id)
      .single();

    if (profileError || !profile) {
      return NextResponse.json(
        { error: 'Perfil não encontrado no banco de dados.', details: profileError?.message }, 
        { status: 404 }
      );
    }

    if (!PRO_PLAN_PRICE_ID || PRO_PLAN_PRICE_ID === 'price_mock_pro') {
      return NextResponse.json(
        { error: 'ID do plano Stripe não configurado corretamente no servidor.' }, 
        { status: 500 }
      );
    }

    const session_stripe = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price: PRO_PLAN_PRICE_ID,
          quantity: 1,
        },
      ],
      mode: 'subscription',
      success_url: `${request.headers.get('origin')}/dashboard?success=true`,
      cancel_url: `${request.headers.get('origin')}/dashboard?canceled=true`,
      metadata: {
        userId: user.id,
      },
      customer_email: user.email,
    });

    return NextResponse.json({ url: session_stripe.url });
  } catch (error: any) {
    console.error('Stripe error:', error);
    return NextResponse.json(
      { error: 'Erro interno ao criar checkout.', details: error.message }, 
      { status: 500 }
    );
  }
}
