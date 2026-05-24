import { stripe } from '@/lib/stripe';
import { createAdminClient } from '@/utils/supabase/admin';
import { headers } from 'next/headers';
import { NextResponse } from 'next/server';
import Stripe from 'stripe';

const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

export async function POST(request: Request) {
  const body = await request.text();
  const headersList = await headers();
  const sig = headersList.get('stripe-signature');

  let event: Stripe.Event;

  try {
    if (process.env.NODE_ENV !== 'production' && (!sig || !endpointSecret)) {
      // For local development/mocking only
      event = JSON.parse(body) as Stripe.Event;
    } else {
      if (!sig) {
        return NextResponse.json({ error: 'Missing stripe-signature header' }, { status: 400 });
      }
      if (!endpointSecret) {
        return NextResponse.json({ error: 'STRIPE_WEBHOOK_SECRET is not configured' }, { status: 500 });
      }
      event = stripe.webhooks.constructEvent(body, sig, endpointSecret);
    }
  } catch (err: unknown) {
    const error = err as Error;
    return NextResponse.json({ error: `Webhook Error: ${error.message}` }, { status: 400 });
  }

  console.log('🔔 Webhook recebido:', event.type);

  const supabase = createAdminClient();

  // Handle the event
  switch (event.type) {
    case 'checkout.session.completed': {
      const session = event.data.object as Stripe.Checkout.Session;
      const userId = session.metadata?.userId;

      console.log('✅ Checkout completo para usuário:', userId);

      if (userId) {
        const { error } = await supabase
          .from('profiles')
          .update({ plan: 'pro' })
          .eq('user_id', userId);
        
        if (error) {
          console.error('❌ Erro ao atualizar perfil para pro:', error);
        } else {
          console.log('✨ Perfil atualizado para PRO com sucesso!');
        }
      } else {
        console.error('⚠️ userId não encontrado nos metadados da sessão');
      }
      break;
    }
    
    // Add more events if needed (customer.subscription.deleted, etc.)
    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  return NextResponse.json({ received: true });
}
