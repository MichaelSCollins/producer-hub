"use client";
import { useEffect, useState } from "react";

interface Subscription {
    plan: string;
    status: string;
    startDate: string;
    endDate: string;
}

const MySubscriptions: React.FC = () => {
    const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Fetch subscriptions from the API
        const fetchSubscriptions = async () => {
            try
            {
                const response = await fetch("http://localhost:4444/api/subscriptions/123"); // Replace with your API endpoint
                const data = await response.json();
                setSubscriptions(data);
            } catch (error)
            {
                console.error('Failed to fetch subscriptions', error);
            } finally
            {
                setLoading(false);
            }
        };

        fetchSubscriptions();
    }, []);

    if (loading)
    {
        return <div className="text-center mt-10">Loading...</div>;
    }

    return (
        <div className="container mx-auto p-6">
            <h1 className="text-2xl font-bold mb-4">My Subscriptions</h1>
            {subscriptions.length === 0 ? (
                <p>No subscriptions found.</p>
            ) : (
                <table className="table-auto w-full border-collapse border border-gray-300">
                    <thead>
                        <tr className="bg-gray-100">
                            <th className="border border-gray-300 px-4 py-2">Plan</th>
                            <th className="border border-gray-300 px-4 py-2">Start Date</th>
                            <th className="border border-gray-300 px-4 py-2">End Date</th>
                            <th className="border border-gray-300 px-4 py-2">Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {subscriptions.map((subscription, index) => (
                            <tr key={index} className="text-center">
                                <td className="border border-gray-300 px-4 py-2">{subscription.plan}</td>
                                <td className="border border-gray-300 px-4 py-2">{subscription.startDate}</td>
                                <td className="border border-gray-300 px-4 py-2">{subscription.endDate}</td>
                                <td className="border border-gray-300 px-4 py-2 text-red-600">{subscription.status}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
};

export default MySubscriptions;
