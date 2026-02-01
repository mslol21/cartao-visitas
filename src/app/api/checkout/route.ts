import { createClient } from '@/utils/supabase/server';
import { stripe, PRO_PLAN_PRICE_ID } from '@/lib/stripe';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    
    // Tenta pegar a sessão primeiro
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();
    
    if (sessionError || !session) {
      return NextResponse.json(
        { error: 'Não autorizado: Sessão não encontrada. Por favor, faça login novamente.', details: sessionError?.message }, 
        { status: 401 }
      );
    }

    const user = session.user;

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
