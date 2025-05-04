import Stripe from 'stripe';
import dotenv from 'dotenv';

dotenv.config();

const stripeKey = process.env.STRIPE_SECRET_KEY ?? 'no-key'
export const stripe = new Stripe(stripeKey, {
    apiVersion: '2022-11-15',
});