/* eslint-disable @typescript-eslint/no-explicit-any */
import { CreateAccountRequest, LoginRequest } from "../../../../user-ui/src/lib/interfaces";
import endpoints from "./api.config"
const api = {
    headers: {
        // "Authorization": `Bearer ${localStorage.getItem("token")}`,
        // "Content-Type": "application/json",
        // "X-User-Id": localStorage.getItem("userId"),
    },
    register: async (
        body: CreateAccountRequest
    ) => {
        console.log("Registering user", endpoints.register, body)
        return await api.post<CreateAccountRequest>(
            endpoints.register,
            body
        ).catch((e) => {
            console.error(e.message)
            throw e;
        })
    },
    login: async (
        body: LoginRequest
    ) => {
        console.log("[POST]: ", endpoints.login, body)
        return await api.post<LoginRequest>(
            endpoints.login,
            body,
        ).catch((e) => {
            console.error(e.message)
            throw e;
        })
    },
    getCurrentUser: async (
    ) => {
        return await api.get(
            endpoints.user,
        );
    },
    post: async <T>(url: string, body: T) => {
        const response = await fetch(url, {
            method: "POST",
            headers: api.headers,
            credentials: 'include', // 🔥 this sends and receives cookies
            body: JSON.stringify(body),
        }).catch(err => {
            console.error('api call failed', err.message);
            throw err;
        });
        if (!response.ok)
        {
            throw new Error(`Error: ${response.status}`);
        }
        return response.json();
    },
    put: async (url: string, body: Record<
        string,
        any
    >) => {
        const response = await fetch(url, {
            method: "PUT",
            credentials: 'include', // 🔥 this sends and receives cookies
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(body),
        });
        if (!response.ok)
        {
            throw new Error(`Error: ${response.status}`);
        }
        return response.json();
    },
    get: async (url: string) => {
        const response = await fetch(url);
        if (!response.ok)
        {
            throw new Error(`Error: ${response.status}`);
        }
        return response.json();
    },
};

export default api;
