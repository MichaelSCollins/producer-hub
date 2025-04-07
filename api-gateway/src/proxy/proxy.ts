import { Express } from "express";
import ProxyFactory from "../factory/ProxyFactory";
import { routes } from "./routes";

export const useProxies = (app: Express) => {
    for (const { route, target } of routes)
    {
        const proxy = ProxyFactory.createMiddleware(target)
        app.use(route, proxy);
    };
}

export default useProxies;