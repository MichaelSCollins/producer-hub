import mongoose, { Schema, Document } from 'mongoose';

export interface IHubSubscription {
    userId: string;
    plan: string;
    status: string;
    start?: number | null;
    end?: number | null;
    trialEnd?: number | null;
    subscriptionId?: string;
    subscriptionEnd?: number | null;
    sessionUrl?: string | null;
    sessionId?: string;
    customerId?: string;
    createdAt?: Date;
    updatedAt?: Date;
}

export interface ISubscription extends Document, IHubSubscription { }

const SubscriptionSchema: Schema = new Schema({
    userId: { type: String, required: true },
    plan: { type: String, required: true },
    status: { type: String, required: true, enum: ['active', 'inactive', 'failed', 'initialized', 'cancelled'] },
    sessionUrl: { type: String, required: false },
    sessionId: { type: String, required: false },
    subscriptionId: { type: String, required: false },
    customerId: { type: String, required: false },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
    trialEnd: { type: Date, required: false },
    start: { type: Date, required: false },
    endDate: { type: Date, required: false },
});

export default mongoose.model<ISubscription>('Subscription', SubscriptionSchema);
