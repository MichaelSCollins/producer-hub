import { IHubSubscription as IHubSubscription } from "../Subscription";
import Stripe from "stripe";

export class HubSubscriptionFactory {
    static createDefault(userId: string, planId: string): IHubSubscription {
        const data: IHubSubscription = {
            userId,
            plan: planId,
            trialEnd: null, // Add appropriate default or fetched value
            subscriptionId: '', // Add appropriate default or fetched value
            sessionUrl: '', // Add appropriate default or fetched value
            subscriptionEnd: null, // Add appropriate default or fetched value
            start: null, // Add appropriate default or fetched value
            end: null, // Add appropriate default or fetched value
            sessionId: '', // Add appropriate default or fetched value
            customerId: '', // Add appropriate default or fetched value
            status: 'initialized',
            createdAt: new Date(),
            updatedAt: new Date()
        };
        return data
    }
}
export default HubSubscriptionFactory;