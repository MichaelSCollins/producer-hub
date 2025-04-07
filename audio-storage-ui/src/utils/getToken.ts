import axios from 'axios';

export async function getToken(): Promise<string> {
    try
    {
        const response = await axios.get('http://localhost:3000/api/token'); // Replace with actual URL
        return response.data.token;
    } catch (error)
    {
        console.error('Error fetching token:', error);
        throw error;
    }
}
