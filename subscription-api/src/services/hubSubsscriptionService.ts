import Stripe from "stripe";
import Subscription, { IHubSubscription } from "../models/Subscription";
import { HubSubscriptionFactory } from "../models/factory/subscriptionFactory";
import { IStripeResponse as IStripeCheckoutResponse, stripeCheckout } from "./stripeService";
import HubSubscriptionAdapter from "../models/adapter/subscriptionAdapter";
class HubSubscriptionService {
    static async create(userId: string, planId: string): Promise<IHubSubscription | void> {
        // Validate user and plan
        if (!userId || !planId) throw new Error('User ID and Plan ID are required');
        // Create a new subscription in the database
        const mongoData: IHubSubscription =
            HubSubscriptionFactory.createDefault(userId, planId);
        // Create a new Stripe subscription
        await stripeCheckout(
            userId, planId
        ).then((checkoutData: IStripeCheckoutResponse) => {
            const adapter = new HubSubscriptionAdapter(userId);
            const data = adapter.fromStipeCheckout({
                planId,
                ...checkoutData
            });
            Object.assign(mongoData, data);
        }).catch((error) => {
            console.error('Error creating subscription in Stripe:');
            console.error(error.message);
            Object.assign(mongoData, {
                status: 'failed',
                error: error.message
            });
        })
        // Save the subscription data to MongoDB
        return await Subscription.create(
            mongoData
        ).then((subscription: IHubSubscription) => {
            console.log('Subscription saved to MongoDB:', subscription);
            return subscription;
        })
            .catch((error) => {
                console.error('Error saving subscription to MongoDB: ', error.message);
            })
    }

    /**
     * Fetch all subscriptions for a given userId.
     * @param userId - The ID of the user whose subscriptions are to be fetched.
     * @returns A promise resolving to an array of subscriptions.
     */
    static async getUserSubscriptions(userId: string): Promise<IHubSubscription[]> {
        try
        {
            const subscriptions = await Subscription.find({ userId });
            return subscriptions;
        } catch (error)
        {
            console.error(`Failed to fetch subscriptions for userId: ${userId}`, error);
            throw new Error('Failed to fetch subscriptions');
        }
    };

    static async cancelHubSubscription(subscriptionId: string): Promise<void> {
        // Validate subscription

    }
}

export default HubSubscriptionService;