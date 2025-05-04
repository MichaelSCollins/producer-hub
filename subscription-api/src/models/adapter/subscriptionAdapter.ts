import Stripe from "stripe";
import { IHubSubscription } from "../Subscription";

class HubSubscriptionAdapter {
    userId: string;;
    constructor(userId: string) {
        this.userId = userId;
    }
    fromStipeCheckout({
        planId,
        subscription,
        customer,
        session
    }: {
        planId: string,
        subscription: Stripe.Subscription,
        customer: Stripe.Customer,
        session: Stripe.Checkout.Session
    }): IHubSubscription {
        const subscriptionData: IHubSubscription = {
            userId: this.userId,
            customerId: customer.id,
            sessionUrl: session.url,
            sessionId: session.id,
            start: subscription.start_date,
            end: subscription.current_period_end,
            plan: planId,
            subscriptionId: session.id,
            status: subscription.status,
            subscriptionEnd: subscription.current_period_end,
            trialEnd: subscription.trial_end,
            createdAt: new Date(),
            updatedAt: new Date(),
        }
        return subscriptionData;
    }
}

export default HubSubscriptionAdapter;