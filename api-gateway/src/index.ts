import express from 'express';
import { healthCheck } from './middleware/healthcheck';
import AppInitializer from './facade/AppInitializer';

const app = express();
const PORT = 5000; // Port for the API Gateway
AppInitializer.initialize(app); // Initialize the API Gateway
app.listen(PORT, () => {
    console.log(`API Gateway is running on http://localhost:${PORT}`);
    healthCheck();
}).on('error', (err) => {
    console.error('Error starting API Gateway:', err);
});