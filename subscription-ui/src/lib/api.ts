import axios from 'axios';

const API_GATEWAY = 'http://localhost:4444';

export const subscribeToPlan = async (plan: string, userId: string) => {
    console.log(API_GATEWAY);
    console.log('Subscribing to plan:', plan, 'for user:', userId);
    try
    {
        const response = await axios.post(`${API_GATEWAY}/api/subscribe`, {
            plan,
            userId,
        });
        return response.data;
    } catch (error)
    {
        if (error instanceof Error)
            console.error('Error subscribing to plan:', error.message);
        // throw error;
    }
};

export const getUserDetails = async (userId: string) => {
    try
    {
        const response = await axios.get(`${API_GATEWAY}/api/users/${userId}`);
        return response.data;
    } catch (error)
    {
        console.error('Error fetching user details:', error);
        throw error;
    }
};
