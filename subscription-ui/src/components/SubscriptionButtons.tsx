"use client";
import { subscribeToPlan } from '../lib/api';
import { AxiosResponse } from 'axios';

const SubscriptionButtons = ({ plans }: {
    plans: {
        name: string
    }[]
}) => {
    return <tr className="subscription-actions">
        <td>
            <h2>Subscribe</h2>
            <p>Select a plan to subscribe:</p>
        </td>
        {plans.map((plan) => (
            <td key={plan.name}>
                <button
                    key={plan.name}
                    onClick={
                        () =>
                            handleSubscribe(
                                plan.name
                            )}
                    className="w-full h-full bg-none border-slate-500/50">
                    Subscribe to {plan.name}
                </button>
            </td>
        ))}
    </tr>
}

const handleSubscribe = async (plan: string) => {
    try
    {
        const userId = '123'; // Todo: Replace with actual user ID from context or state
        const response = await subscribeToPlan(plan, userId);
        handleResponse(response);
    } catch
    {
        alert('Failed to subscribe to the plan. Please try again.');
    }
};

const handleResponse = (response: AxiosResponse) => {
    switch (response.status) // Check the response status code
    {
        case 201:
        case 200:
            alert('Subscription successful!');
            // Redirect to Stripe checkout session URL if needed
            window.location.href = response.data.sessionUrl;
            break;
        case 400:
            alert('Invalid request. Please check your input.');
            break;
        case 500:
            alert('Server error. Please try again later.');
            break;
        default:
            alert('An unexpected error occurred. Please try again.');
            break;
    }
}

export default SubscriptionButtons;