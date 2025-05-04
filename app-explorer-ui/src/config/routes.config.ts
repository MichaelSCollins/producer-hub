export interface RouteConfig {
    [serviceName: string]: {
        ui: MicroServiceConfig,
        api: MicroServiceConfig
    }
}
export interface MicroServiceConfig {
    endpoint: {
        [environment: string]: string | null
    }
}
const routes: RouteConfig = {
    "login": {
        "ui": {
            "endpoint": {
                "local": "http://localhost:7000/login"
            }
        },
        "api": {
            "endpoint": {
                "local": "http://localhost:5000/api/users/login"
            }
        }
    },
    "register": {
        "ui": {
            "endpoint": {
                "local": "http://localhost:7000/register"
            }
        },
        "api": {
            "endpoint": {
                "local": "http://localhost:5000/api/users/register"
            }
        }
    },
    "audio": {
        "ui": {
            "endpoint": {
                "local": "http://localhost:3001"
            }
        },
        "api": {
            "endpoint": {
                "local": "http://localhost:5000/api/audio"
            }
        }
    },
    "project": {
        "ui": {
            "endpoint": {
                "local": "http://localhost:3003"
            }
        },
        "api": {
            "endpoint": {
                "local": "http://localhost:7777"
            }
        }
    },
    "subscriptions": {
        "ui": {
            "endpoint": {
                "local": "http://localhost:4000"
            }
        },
        "api": {
            "endpoint": {
                "local": "http://localhost:5000/api/subscriptions"
            }
        }
    },
    "api-gateway": {
        "ui": {
            "endpoint": {
                "local": null
            }
        },
        "api": {
            "endpoint": {
                "local": "http://localhost:5000"
            }
        }
    }
}

export default routes;