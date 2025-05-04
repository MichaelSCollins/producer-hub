import { createProxyMiddleware } from "http-proxy-middleware";

class ProxyFactory {
    private static instance: ProxyFactory;
    private constructor() { } // Private constructor to prevent instantiation

    public static getInstance(): ProxyFactory {
        if (!ProxyFactory.instance)
        {
            ProxyFactory.instance = new ProxyFactory();
        }
        return ProxyFactory.instance;
    }

    public static createMiddleware(target: string) {
        return createProxyMiddleware(target)
    }

    public createProxy(target: string) {
        createProxyMiddleware({
            target,
            changeOrigin: true,
            logLevel: "debug",
            onProxyReq: (proxyReq, req) => {
                console.log(`[ProxyReq] ${req.method} ${req.originalUrl} -> ${proxyReq.method} ${proxyReq.path}`);
            },
            onProxyRes: (proxyRes, req) => {
                console.log(`[ProxyRes] ${req.method} ${req.originalUrl} -> ${proxyRes.statusCode}`);
            },
            onError: (err, req, res) => {
                console.error(`[ProxyError] ${err.message}`, req);
                res.status(500).json({ error: "Proxy error", details: err.message });
            },
            pathRewrite: undefined,
        });
    }
}

export default ProxyFactory;