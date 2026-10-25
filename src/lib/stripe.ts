import Stripe from 'stripe';

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  typescript: true,
});

export const PRO_PLAN_PRICE_ID = process.env.NEXT_PUBLIC_STRIPE_PRO_PRICE_ID || 'price_mock_pro';
