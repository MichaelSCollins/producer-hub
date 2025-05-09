import express from 'express'
import security from './security'
import middleware from './middleware'
import logger from './logger'
import router from './routes/router'
import proxyApp from './routes/proxy'

const PORT = 5000; // Port for the API Gateway
const app = express()
security.apply(app)
middleware.apply(app)
logger.apply(app)
app.use('/api', router)
proxyApp(app)
app.listen(PORT, () => {
    console.log(`API Gateway is running on http://localhost:${PORT}`);
    // healthCheck();
}).on('error', (err) => {
    console.error('Error starting API Gateway:', err);
});
