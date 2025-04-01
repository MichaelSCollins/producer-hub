/* eslint-disable @typescript-eslint/no-explicit-any */
import { CreateAccountRequest, LoginRequest } from "@/lib/interfaces";
import urls from "./api.config"
const api = {
    headers: {
        // "Authorization": `Bearer ${localStorage.getItem("token")}`,
        "Content-Type": "application/json",
        // "X-User-Id": localStorage.getItem("userId"),
    },
    register: async (
        body: CreateAccountRequest
    ) => {
        return api.post<CreateAccountRequest>(
            urls.register,
            body
        ).catch((e) => {
            console.error(e)
            throw e;
        })
    },
    login: async (
        body: LoginRequest
    ) => {
        return api.post<LoginRequest>(
            urls.login,
            body
        );
    },
    post: async <T>(url: string, body: T) => {
        const response = await fetch(url, {
            method: "POST",
            headers: api.headers,
            body: JSON.stringify(body),
        }).catch(err => {
            console.error('api call failed', err);
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
