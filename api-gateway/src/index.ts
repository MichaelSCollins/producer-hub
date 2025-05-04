import AppBuilder from './lib/builder/AppBuilder';
import { healthCheck } from './routes/healthcheck';

const PORT = 5000; // Port for the API Gateway

AppBuilder
    .initialize()
    .buildSecurity()
    .buildMiddleware()
    .buildRouting()
    .build()
    .listen(PORT, () => {
        console.log(`API Gateway is running on http://localhost:${PORT}`);
        // healthCheck();
    }).on('error', (err) => {
        console.error('Error starting API Gateway:', err);
    });