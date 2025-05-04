import { Express, Request, Response, NextFunction } from "express";

const handleNotFond = (app: Express) => {
    // Handler for route-not-found
    app.use((_req, res) => {
        res.status(404).json({
            code: 404,
            status: "Error",
            message: "Route not found.",
            data: null,
        });
    });
    app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
        console.error(err.stack);
        res.status(500).send('Something went wrong!');
    });

}

export default handleNotFond;