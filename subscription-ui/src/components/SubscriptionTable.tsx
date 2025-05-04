import React from 'react';
import SubscriptionButtons from './SubscriptionButtons';

const SubscriptionTable: React.FC = () => {
    const plans = [
        {
            name: 'Basic',
            price: '$5/month',
            features: ['5GB Audio Storage', 'Basic Music Tools'],
        },
        {
            name: 'Pro',
            price: '$15/month',
            features: ['50GB Audio Storage', 'Advanced Music Tools', 'Priority Support'],
        },
        {
            name: 'Premium',
            price: '$30/month',
            features: ['Unlimited Audio Storage', 'All Music Tools', 'Dedicated Support'],
        },
    ];

    return (
        <div className="subscription-table">
            <h1>Choose Your Plan</h1>
            <table>
                <thead>
                    <tr>
                        <th>Features</th>
                        {plans.map((plan) => (
                            <th key={plan.name}>{plan.name}</th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {['Audio Storage', 'Music Tools', 'Support'].map((feature, index) => (
                        <tr key={index}>
                            <td>{feature}</td>
                            {plans.map((plan) => (
                                <td key={plan.name}>
                                    {plan.features.some((f) => f.includes(feature)) ? '✔️' : ''}
                                </td>
                            ))}
                        </tr>
                    ))}
                    <SubscriptionButtons plans={plans} />
                </tbody>
            </table>
        </div>
    );
};


export default SubscriptionTable;
