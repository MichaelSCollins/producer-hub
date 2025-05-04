import Stripe from 'stripe';
import { stripe } from '../config/stripe';

export interface IStripeResponse {
    subscription: Stripe.Subscription;
    customer: Stripe.Customer;
    session: Stripe.Checkout.Session;
}

export const stripeCheckout = async (userRef: string, planId: string): Promise<IStripeResponse> => {
    // Create a new customer if needed (can be stored in DB)
    const customer = await stripe.customers.create({
        email: userRef
    });
    // Create a subscription for a recurring monthly plan (adjust price ID)
    const subscription: Stripe.Subscription =
        await stripe.subscriptions.create({
            customer: customer.id,
            items: [{ price: 'price_1NEXAMPLEMONTHLY' }], // Replace with your real price ID
            payment_behavior: 'default_incomplete',
            expand: ['latest_invoice.payment_intent'],
        });

    // Create a checkout session to complete the subscription
    const session = await stripe.checkout.sessions.create({
        customer: customer.id,
        mode: 'subscription',
        line_items: [{
            // Replace with your real price ID
            price: 'price_1NEXAMPLEMONTHLY', // Your Stripe price ID
            quantity: 1,
        }],
        subscription_data: {
            trial_period_days: 7, // Optional
        },
        success_url: `${process.env.FRONTEND_SUCCESS_URL}?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: process.env.FRONTEND_CANCEL_URL,
    });

    return {
        customer,
        subscription,
        session,
    };
};