import ProxyFactory from "../lib/factory/ProxyFactory";
import { routes } from "./routes";
import State from "../state";
import AppBuilder from "../lib/builder/AppBuilder";

export const routeProxies = () => {
    for (const { route, target } of routes)
    {
        const proxy = ProxyFactory.createMiddleware(target)
        AppBuilder.app.use(route, proxy);
    };
}

export default routeProxies;