import bodyParser from "body-parser";
import express from "express";
import morgan from "morgan";
import SecurityBuilder from "./SecurityBuilder";

class MiddlewareBuilder extends SecurityBuilder {
    buildMiddleware() {
        console.log("[api-gateway] Middleware initializing...");
        // Middleware
        this.app.use(bodyParser.json()); // Ensure this is applied before routes
        this.app.use(express.json());
        // handleNotFond(app);
        this.app.use(morgan('dev'));
        this.app.use(morgan("combined")); // Log HTTP requests
        console.log("[api-gateway] Middleware initialized.");
        return this;
    }
}

export default MiddlewareBuilder;