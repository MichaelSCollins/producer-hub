import { Request, Response } from 'express';
import { IHubSubscription } from '../models/Subscription';
import HubSubscriptionService from '../services/hubSubsscriptionService';

export const getByUserId = async (req: Request, res: Response) => {
    const { userId } = req.params;
    try
    {
        const subscriptions = await HubSubscriptionService.getUserSubscriptions(userId);
        res.status(200).json(subscriptions);
    } catch (error)
    {
        res.status(500).json({ error: 'Failed to fetch subscriptions' });
    }
}

export const subscribeUser = async (req: Request, res: Response) => {
    try
    {
        console.log(JSON.stringify(req.body, null, 2));
        const user = req.body.email || req.body.userId;
        // Validate user and plan
        // if (!user) return res.status(400).json({
        //     error: 'Email is required'
        // });
        // if (!req.body.plam) return res.status(400).json({
        //     error: 'Plan is required'
        // });
        const subscription = await HubSubscriptionService.create(
            user, req.body.plan
        );

        res.status(200).json(subscription);
    } catch (err)
    {
        console.error(err);
        res.status(500).json({ error: 'Subscription creation failed' });
    }
};
