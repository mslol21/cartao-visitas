
import { stripe } from '@/lib/stripe';
import { createClient } from '@/utils/supabase/server';
import { headers } from 'next/headers';
import { NextResponse } from 'next/server';

const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

export async function POST(request: Request) {
  const body = await request.text();
  const headersList = await headers();
  const sig = headersList.get('stripe-signature');

  let event;

  try {
    if (!sig || !endpointSecret) {
      // For development/mocking
      event = JSON.parse(body);
    } else {
      event = stripe.webhooks.constructEvent(body, sig, endpointSecret);
    }
  } catch (err: any) {
    return NextResponse.json({ error: `Webhook Error: ${err.message}` }, { status: 400 });
  }

  const supabase = await createClient();

  // Handle the event
  switch (event.type) {
    case 'checkout.session.completed':
      const session = event.data.object;
      const userId = session.metadata.userId;

      if (userId) {
        const { error } = await supabase
          .from('profiles')
          .update({ plan: 'pro' })
          .eq('user_id', userId);
        
        if (error) {
          console.error('Error updating profile to pro:', error);
        }
      }
      break;
    
    // Add more events if needed (customer.subscription.deleted, etc.)
    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  return NextResponse.json({ received: true });
}
