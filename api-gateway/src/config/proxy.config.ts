
// Define routes and corresponding microservices
export const routes = [
    {
        route: "/api/users/register",
        target: "http://localhost:7777/api/users/register", // Base URL of user-api
    },
    {
        route: "/api/user",
        target: "http://localhost:7777/api/users/user", // Base URL of user-api
    },
    {
        route: "/api/subscription/",
        target: "http://localhost:4444", // Base URL of user-api
    },
    {
        route: "/api/audio/",
        target: "http://localhost:8081/api/audio",
    }
];