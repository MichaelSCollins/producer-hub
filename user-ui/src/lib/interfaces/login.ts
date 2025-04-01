import { AccountAPIRequest, AccountAPIReqonse } from "./api";

export interface Login {
    email: string;
    password: string;
    location?: string;
    device?: string
}

export interface LoginRequest extends AccountAPIRequest, Login { }

export interface LoginResponse extends AccountAPIReqonse { }
