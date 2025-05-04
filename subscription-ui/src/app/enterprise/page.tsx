import React from 'react';

const EnterpriseSubscriptions: React.FC = () => {
    const subscriptionOptions = [
        {
            name: 'Basic Company Plan',
            price: '$99/month',
            features: ['Feature A', 'Feature B', 'Feature C'],
        },
        {
            name: 'Pro Plan',
            price: '$199/month',
            features: ['5 subscriptions', 'poop', 'Feature C', 'Feature D'],
        },
        {
            name: 'Enterprise Plan',
            price: 'Custom Pricing',
            features: ['All Features', 'Dedicated Support', 'Custom Integrations'],
        },
    ];

    return (
        <div className="container mx-auto p-6">
            <h1 className="text-2xl font-bold mb-4">Enterprise Subscription Options</h1>
            <table className="table-auto w-full border-collapse border border-gray-300">
                <thead>
                    <tr className="bg-gray-100">
                        <th className="border border-gray-300 px-4 py-2">Plan</th>
                        <th className="border border-gray-300 px-4 py-2">Price</th>
                        <th className="border border-gray-300 px-4 py-2">Features</th>
                    </tr>
                </thead>
                <tbody>
                    {subscriptionOptions.map((option, index) => (
                        <tr key={index} className="text-center">
                            <td className="border border-gray-300 px-4 py-2">{option.name}</td>
                            <td className="border border-gray-300 px-4 py-2">{option.price}</td>
                            <td className="border border-gray-300 px-4 py-2">
                                <ul className="list-disc list-inside">
                                    {option.features.map((feature, idx) => (
                                        <li key={idx}>{feature}</li>
                                    ))}
                                </ul>
                            </td>
                            <td className="border border-gray-300 px-4 py-2">
                                <button className='cursor-pointer hover:bg-blue-900 border px-4 py-2 bg-blue-700 border-blue-800'>Subscribe</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default EnterpriseSubscriptions;
