
// Define routes and corresponding microservices
export const routes = [
    {
        route: "/api/users/",
        target: "http://localhost:7777", // Base URL of user-api
    },
    {
        route: "/api/audio/",
        target: "http://localhost:8081",
    }
];