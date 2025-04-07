import express, { Express } from "express";
import morgan from "morgan";
import useProxyLogger from "../proxy/logger";
import handleNotFond from "./notFound";
import bodyParser from "body-parser";
const useMiddleware = (app: Express) => {
    // Middleware
    app.use(bodyParser.json()); // Ensure this is applied before routes
    app.use(express.json());
    handleNotFond(app);
    useProxyLogger(app);
    app.use(morgan('dev'));
    app.use(morgan("combined")); // Log HTTP requests
}
export default useMiddleware;