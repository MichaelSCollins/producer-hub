class HealthCheckRouter {
    static routeHealthCheck = (app) => {
        // Healthcheck route
        app.get('/healthcheck', (req, res) => {
            res.status(200).json({ status: 'OK' });
        });
    }
}

export const healthCheck = () => {
    console.log('Performing healthcheck...');
    // Perform a healthcheck by sending a request to the healthcheck endpoint
    fetch('http://localhost:5000/healthcheck')
        .then(async (response) => {
            console.log("Healthcheck passed: ", JSON.stringify(await response.json()))
        })
        .catch((error) => {
            console.error('Error fetching healthcheck:', error);
        }).finally(() => {
            console.log('Healthcheck completed');
        })
}

export default HealthCheckRouter;