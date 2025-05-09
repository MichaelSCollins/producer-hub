import bodyParser from "body-parser";
import express from "express";
import morgan from "morgan";

const apply = (app) => {
    console.log("[api-gateway] Middleware initializing...");
    // Middleware
    app.use(express.json())
    app.use(bodyParser.json()); // Ensure this is applied before routes
    // Middleware to parse URL-encoded request bodies
    app.use(express.urlencoded({ extended: true }));
    app.use(morgan('dev'));
    app.use(morgan("combined")); // Log HTTP requests
    // handleNotFond(app);
    console.log("[api-gateway] Middleware initialized.");
    return this;
}

export default {
    apply
};